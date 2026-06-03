/**
 * Futunet Internet Portal Controller (PWA client dashboard)
 * Manages authentication, PWA UI logic, payment reports, and support tickets.
 */
(function () {
  'use strict';

  var db = null;
  var storage = null;
  var currentUser = null;
  var userData = null;
  var selectedFile = null;

  // Inicialización
  // Helper para ocultar la pantalla de carga del portal
  function hidePortalLoading() {
    var loader = document.getElementById('portal-loading-view');
    if (loader) loader.style.display = 'none';
  }

  // Inicialización
  function init() {
    // Modo Solo Planes por query param ?view=planes
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'planes') {
      document.body.classList.add('solo-planes-mode');
    }

    // Seteo de Firebase
    if (window.FutunetFirebase) {
      db = window.FutunetFirebase.db;
      storage = window.FutunetFirebase.storage;
    }

    // Escuchar cambios de Auth de forma segura
    FutunetAuth.authReady.then(function () {
      FutunetAuth.onAuthChanged(async function (user, fullUserData) {
        if (user) {
          currentUser = user;
          userData = fullUserData;
          if (userData) {
            // Verificar si es un cliente de internet configurado administrativamente
            if (userData.isInternetClient) {
              showPortalView();
            } else {
              showNoClientView();
            }
          } else {
            // Fallback en caso de que no se hayan devuelto los datos completos en el listener
            await loadPortalUser();
          }
        } else {
          currentUser = null;
          userData = null;
          showPublicView();
        }
      });
    });

    // Detectar instalación PWA e inicializar triggers
    setupPwaInstructions();
    setupDropzone();
    setupForms();

    // Cerrar modales al hacer clic fuera (en el background de la clase .portal-modal)
    document.querySelectorAll('.portal-modal').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          window.closePortalModals();
        }
      });
    });

    // Auto-inicializar estado de la calculadora si existe el slider
    if (document.getElementById('devices-slider')) {
      window.updateMegasCalc();
    }

    // Inicializar slider de precio y filtros si existe
    if (document.getElementById('price-filter-slider')) {
      window.updatePriceSliderVal();
      
      // Aplicar filtros por parámetro de tipo si viene en la URL
      var typeParam = urlParams.get('type');
      if (typeParam) {
        var checkbox = document.querySelector('input[name="filter-plan-type"][value="' + typeParam + '"]');
        if (checkbox) {
          checkbox.checked = true;
          // Ajustar el radio de servicio según corresponda
          if (typeParam === 'multiplan') {
            var radio = document.querySelector('input[name="filter-service"][value="television"]');
            if (radio) radio.checked = true;
          } else {
            var radio = document.querySelector('input[name="filter-service"][value="internet"]');
            if (radio) radio.checked = true;
          }
        }
      }
      
      window.filterPlans();
    }
  }

  // Carga datos del cliente de internet (Fallback)
  async function loadPortalUser() {
    if (!db) {
      console.warn('Database is not initialized. Showing public view.');
      showPublicView();
      return;
    }
    if (!currentUser) {
      showPublicView();
      return;
    }
    try {
      var userDoc = await db.collection('users').doc(currentUser.uid).get();
      if (!userDoc.exists) {
        showPublicView();
        return;
      }
      userData = userDoc.data();
      
      // Verificar si es un cliente de internet configurado administrativamente
      if (userData.isInternetClient) {
        showPortalView();
      } else {
        showNoClientView();
      }
    } catch (err) {
      console.error('Error al cargar datos del portal de clientes:', err);
      showPublicView();
    }
  }

  // Muestra landing pública
  function showPublicView() {
    hidePortalLoading();
    document.getElementById('internet-public-view').style.display = 'block';
    document.getElementById('internet-portal-view').style.display = 'none';
    var container = document.querySelector('.portal-container');
    if (container) container.classList.remove('wide');
  }

  // Muestra Web App de autogestión
  function showPortalView() {
    hidePortalLoading();
    document.getElementById('internet-public-view').style.display = 'none';
    document.getElementById('internet-portal-view').style.display = 'block';
    document.getElementById('portal-app-card').style.display = 'block';
    document.getElementById('portal-no-client').style.display = 'none';
    var container = document.querySelector('.portal-container');
    if (container) container.classList.remove('wide');

    // Rellenar datos
    setText('client-name', 'Hola, ' + (userData.displayName || 'Cliente'));
    setText('client-code', 'CÓDIGO: ' + (userData.clientCode || 'FT-INTERNET-' + currentUser.uid.substring(0, 6).toUpperCase()));
    
    // Mapeo de planes
    var plans = {
      '10mb': { name: 'Plan Inicial 10 Megas', price: 'RD$ 900.00' },
      '20mb': { name: 'Plan Bronce 20 Megas', price: 'RD$ 1,000.00' },
      '50mb': { name: 'Plan Plata 50 Megas', price: 'RD$ 1,500.00' },
      '100mb': { name: 'Plan Oro 100 Megas', price: 'RD$ 2,000.00' },
      '200mb': { name: 'Plan Platino 200 Megas', price: 'RD$ 2,500.00' },
      '300mb': { name: 'Plan Ultra 300 Megas', price: 'RD$ 3,000.00' },
      '400mb': { name: 'Plan Pro 400 Megas', price: 'RD$ 4,000.00' },
      '500mb': { name: 'Plan Élite 500 Megas', price: 'RD$ 5,000.00' }
    };
    var planId = userData.internetPlan || '50mb';
    var planInfo = plans[planId] || { name: 'Plan Personalizado ' + planId, price: 'A cotizar' };
    
    setText('portal-plan-name', planInfo.name);
    setText('portal-plan-price', planInfo.price);

    // Estado del Servicio (Active, Suspended, Inactive)
    var statusEl = document.getElementById('client-status');
    if (statusEl) {
      var status = userData.internetStatus || 'active';
      statusEl.className = 'status-badge status-' + status;
      if (status === 'active') statusEl.textContent = 'Servicio Activo';
      if (status === 'suspended') statusEl.textContent = 'Servicio Suspendido';
      if (status === 'inactive') statusEl.textContent = 'Servicio Inactivo';
    }

    // Configurar logout
    var logoutBtn = document.getElementById('portal-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = function () {
        FutunetAuth.signOut().then(function () {
          window.location.reload();
        });
      };
    }
  }

  // Muestra vista si está logueado pero no tiene internet asociado
  function showNoClientView() {
    hidePortalLoading();
    document.getElementById('internet-public-view').style.display = 'none';
    document.getElementById('internet-portal-view').style.display = 'block';
    document.getElementById('portal-app-card').style.display = 'none';
    document.getElementById('portal-no-client').style.display = 'block';
    var container = document.querySelector('.portal-container');
    if (container) container.classList.add('wide');

    // Inicializar al primer paso del stepper
    goToHiringStep(1);

    // Verificar si hay un plan de contratación pendiente en sessionStorage
    var pendingPlanName = sessionStorage.getItem('pending_hiring_plan_name');
    var pendingPlanId = sessionStorage.getItem('pending_hiring_plan_id');
    var pendingPlanPrice = sessionStorage.getItem('pending_hiring_plan_price');
    if (pendingPlanName && pendingPlanId && pendingPlanPrice) {
      sessionStorage.removeItem('pending_hiring_plan_name');
      sessionStorage.removeItem('pending_hiring_plan_id');
      sessionStorage.removeItem('pending_hiring_plan_price');
      setTimeout(function () {
        window.selectHiringPlan(pendingPlanName, pendingPlanId, parseFloat(pendingPlanPrice));
      }, 100);
    }

    var logoutBtn = document.getElementById('no-client-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = function () {
        FutunetAuth.signOut().then(function () {
          window.location.reload();
        });
      };
    }
  }

  // ─── PWA Y NOTIFICACIONES DE INSTALACIÓN ───
  function setupPwaInstructions() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // Si es móvil y no está en pantalla de inicio, sugerir instalación
    if (isMobile && !isStandalone) {
      var banner = document.getElementById('pwa-banner');
      if (banner) {
        banner.style.display = 'flex';
        var instrText = document.getElementById('pwa-instructions');
        var isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isiOS) {
          instrText.innerHTML = 'Pulsa el botón de <strong>Compartir</strong> en Safari y luego selecciona <strong>"Añadir a pantalla de inicio"</strong>.';
        } else {
          instrText.innerHTML = 'Pulsa los <strong>tres puntos</strong> en Chrome y selecciona <strong>"Instalar aplicación"</strong>.';
        }
      }
    }
  }

  window.hidePwaBanner = function () {
    var banner = document.getElementById('pwa-banner');
    if (banner) banner.style.display = 'none';
  };

  // ─── COPYS DE CUENTAS EN UN CLIC ───
  window.copyText = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (window.showToast) window.showToast('Copiado al portapapeles', 'success');
      }).catch(function () {
        if (window.showToast) window.showToast('Error al copiar', 'error');
      });
    } else {
      // Fallback para entornos inseguros (HTTP)
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        var successful = document.execCommand('copy');
        if (successful) {
          if (window.showToast) window.showToast('Copiado al portapapeles', 'success');
        } else {
          if (window.showToast) window.showToast('Error al copiar', 'error');
        }
      } catch (err) {
        if (window.showToast) window.showToast('Error al copiar', 'error');
      }
      document.body.removeChild(textarea);
    }
  };

  // ─── MODALES DEL PORTAL ───
  var portalModalCleanup = null;
  var portalModalPreviousActiveElement = null;

  function activePortalFocusTrap(modalEl) {
    portalModalPreviousActiveElement = document.activeElement;
    if (portalModalCleanup) portalModalCleanup();
    if (window.FutunetFocusTrap) {
      portalModalCleanup = window.FutunetFocusTrap(modalEl, window.closePortalModals);
    }
    setTimeout(function () {
      var focusables = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length > 0) focusables[0].focus();
    }, 100);
  }

  window.openPaymentReportModal = function () {
    var modal = document.getElementById('payment-report-modal');
    modal.classList.add('is-active');
    activePortalFocusTrap(modal);
  };

  window.openSupportModal = function (type) {
    var modal = document.getElementById('support-modal');
    var title = document.getElementById('support-modal-title');
    var detailsLabel = document.getElementById('support-details-label');
    var detailsInput = document.getElementById('support-details');
    var speedDiv = document.getElementById('support-speed-selection');
    
    document.getElementById('support-type').value = type;

    if (type === 'change_plan') {
      title.textContent = 'Solicitar Cambio de Plan';
      detailsLabel.textContent = 'Comentarios adicionales (Opcional)';
      detailsInput.placeholder = 'Indícanos si tienes alguna duda o requerimiento especial con tu velocidad...';
      detailsInput.required = false;
      speedDiv.style.display = 'block';
    } else {
      title.textContent = 'Reportar Avería Técnica';
      detailsLabel.textContent = 'Detalles del problema o avería';
      detailsInput.placeholder = 'Describe qué ocurre (ej: luz roja en router, lentitud, caída total)...';
      detailsInput.required = true;
      speedDiv.style.display = 'none';
    }

    modal.classList.add('is-active');
    activePortalFocusTrap(modal);
  };


  window.closePortalModals = function () {
    document.querySelectorAll('.portal-modal').forEach(function (m) {
      m.classList.remove('is-active');
    });
    removeVoucherFile();
    if (portalModalCleanup) {
      portalModalCleanup();
      portalModalCleanup = null;
    }
    if (portalModalPreviousActiveElement && typeof portalModalPreviousActiveElement.focus === 'function') {
      portalModalPreviousActiveElement.focus();
      portalModalPreviousActiveElement = null;
    }
  };

  // ─── DRAG & DROP ZONE (Voucher) ───
  function setupDropzone() {
    var zone = document.getElementById('voucher-dropzone');
    var fileInput = document.getElementById('pay-voucher-file');
    if (!zone || !fileInput) return;

    zone.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        handleFileSelect(this.files[0]);
      }
    });

    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      zone.style.borderColor = '#0A70A2';
      zone.style.background = 'rgba(10,112,162,0.05)';
    });

    zone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      zone.style.borderColor = 'rgba(255,255,255,0.12)';
      zone.style.background = 'rgba(255,255,255,0.01)';
    });

    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.style.borderColor = 'rgba(255,255,255,0.12)';
      zone.style.background = 'rgba(255,255,255,0.01)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    // Validar tamaño máximo 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('El archivo supera los 5MB permitidos.', 'error');
      return;
    }
    selectedFile = file;
    document.getElementById('voucher-filename').textContent = file.name;
    document.getElementById('voucher-preview-box').style.display = 'flex';
    document.getElementById('voucher-dropzone').style.display = 'none';
  }

  window.removeVoucherFile = function () {
    selectedFile = null;
    var fileInput = document.getElementById('pay-voucher-file');
    if (fileInput) fileInput.value = '';
    
    var preview = document.getElementById('voucher-preview-box');
    var dropzone = document.getElementById('voucher-dropzone');
    if (preview) preview.style.display = 'none';
    if (dropzone) dropzone.style.display = 'block';
  };

  // ─── FORMULARIOS ───
  function setupForms() {
    // 1. Formulario de Pago (Reporte de transferencia)
    var payForm = document.getElementById('payment-report-form');
    if (payForm) {
      payForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        var btn = document.getElementById('pay-submit-btn');
        if (btn) btn.disabled = true;

        var amount = document.getElementById('pay-amount').value;
        var bank = document.getElementById('pay-bank').value;

        // Validar base de datos y almacenamiento
        if (!db || !storage) {
          if (window.showToast) window.showToast('El servicio de base de datos no está disponible.', 'error');
          if (btn) btn.disabled = false;
          return;
        }

        // Validar numéricamente el monto
        var amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
          if (window.showToast) window.showToast('Por favor introduce un monto de pago válido.', 'error');
          if (btn) btn.disabled = false;
          return;
        }

        if (!selectedFile) {
          if (window.showToast) window.showToast('Por favor sube la foto o PDF del comprobante', 'error');
          if (btn) btn.disabled = false;
          return;
        }

        try {
          // Subir a Storage
          var fileExt = selectedFile.name.split('.').pop();
          var randomId = Math.random().toString(36).substring(2, 10);
          var storagePath = 'vouchers/' + currentUser.uid + '/' + randomId + '_' + Date.now() + '.' + fileExt;
          
          var fileRef = storage.ref().child(storagePath);
          if (window.showToast) window.showToast('Subiendo comprobante...', 'info');
          
          var uploadTask = await fileRef.put(selectedFile);
          var downloadUrl = await uploadTask.ref.getDownloadURL();

          // Registrar en Firestore
          await db.collection('internet_payments').add({
            userId: currentUser.uid,
            userName: userData.displayName || 'Cliente',
            userEmail: currentUser.email,
            amount: amountNum,
            bank: bank,
            voucherUrl: downloadUrl,
            storagePath: storagePath,
            status: 'pending',
            plan: userData.internetPlan || '50mb',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });

          // Registrar log de auditoría
          await db.collection('audit_logs').add({
            action: 'Reporte de pago',
            details: 'Cliente reportó pago de RD$ ' + amountNum + ' vía ' + bank,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });

          if (window.showToast) window.showToast('Pago reportado exitosamente. Lo verificaremos a la brevedad.', 'success');
          closePortalModals();
        } catch (err) {
          console.error('Error al subir pago:', err);
          if (window.showToast) window.showToast('Error al enviar el reporte. Intenta nuevamente.', 'error');
        }

        if (btn) btn.disabled = false;
      });
    }

    // 2. Formulario de Soporte / Aumento
    var supportForm = document.getElementById('support-form');
    if (supportForm) {
      supportForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = document.getElementById('support-submit-btn');
        if (btn) btn.disabled = true;

        var type = document.getElementById('support-type').value;
        var details = document.getElementById('support-details').value.trim();
        var newSpeed = document.getElementById('support-new-speed').value;

        if (!db) {
          if (window.showToast) window.showToast('Base de datos no disponible.', 'error');
          if (btn) btn.disabled = false;
          return;
        }

        var ticketData = {
          userId: currentUser.uid,
          userName: userData.displayName || 'Cliente',
          userEmail: currentUser.email,
          type: type,
          details: details,
          status: 'pending',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (type === 'change_plan') {
          ticketData.requestedPlan = newSpeed;
          ticketData.details = 'Solicitud de cambio a: ' + newSpeed + '. ' + details;
        }

        try {
          await db.collection('internet_tickets').add(ticketData);
          if (window.showToast) window.showToast('Solicitud enviada correctamente.', 'success');
          closePortalModals();
          supportForm.reset();
        } catch (err) {
          if (window.showToast) window.showToast('Error al enviar solicitud', 'error');
        }
        if (btn) btn.disabled = false;
      });
    }

    // 3. Formulario de Contrato (Usuario Logueado sin Servicio desde Portal)
    var portalHiringForm = document.getElementById('portal-hiring-form');
    if (portalHiringForm) {
      portalHiringForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = document.getElementById('p-hir-submit-btn');
        if (btn) btn.disabled = true;

        var name = document.getElementById('p-hir-name').value.trim();
        var email = document.getElementById('p-hir-email').value.trim();
        var phone = document.getElementById('p-hir-phone').value.trim();
        var date = document.getElementById('p-hir-date').value;
        var schedule = document.getElementById('p-hir-schedule').value;
        var address = document.getElementById('p-hir-address').value.trim();
        var notes = document.getElementById('p-hir-notes').value.trim();
        var planName = document.getElementById('p-hir-plan-name').value;
        var planId = document.getElementById('p-hir-plan-id').value;

        if (!db) {
          if (window.showToast) window.showToast('Base de datos no disponible.', 'error');
          if (btn) btn.disabled = false;
          return;
        }

        try {
          // Dar formato a la dirección, fecha y comentarios en la propiedad message requerida por las reglas de Firestore
          var messageText = 'Solicitud de contratación de Internet (Usuario Registrado): ' + planName + '.\n' +
                            'Dirección: ' + address + '\n' +
                            'Fecha Preferida: ' + date + '\n' +
                            'Horario: ' + schedule;
          if (notes) {
            messageText += '\nComentarios: ' + notes;
          }

          // Registrar en Firestore cumpliendo estrictamente con la regla de campos permitidos
          await db.collection('service_requests').add({
            name: name,
            phone: phone,
            email: email,
            message: messageText,
            serviceId: 'internet',
            serviceTitle: 'Internet Fibra Óptica',
            planRequested: planName,
            status: 'pending',
            type: 'internet_hiring',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          // Rellenar datos en la pantalla de éxito
          setText('success-plan-label', planName);
          setText('success-phone-label', phone);
          
          // Formatear fecha para mostrarla amigable
          var dateParts = date.split('-');
          var formattedDate = date;
          if (dateParts.length === 3) {
            var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            formattedDate = jsDate.toLocaleDateString('es-ES', options);
            // Capitalizar primer letra
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
          }
          setText('success-date-label', formattedDate);
          setText('success-schedule-label', schedule);

          goToHiringStep(3);
          portalHiringForm.reset();
          
          // Reiniciar iconos de Lucide en la pantalla de éxito
          if (window.lucide) {
            window.lucide.createIcons();
          }
        } catch (err) {
          console.error('Error al registrar solicitud de internet:', err);
          if (window.showToast) window.showToast('Error al registrar solicitud. Intenta de nuevo.', 'error');
        }
        if (btn) btn.disabled = false;
      });
    }
  }

  // Stepper para contratación
  window.selectHiringPlan = function (planName, planId, price) {
    document.getElementById('p-hir-plan-name').value = planName;
    document.getElementById('p-hir-plan-id').value = planId;
    document.getElementById('p-hir-selected-label').textContent = planName + ' (RD$ ' + price.toLocaleString() + '/mes)';
    
    // Rellenar datos del usuario si están disponibles
    if (currentUser && userData) {
      var nameEl = document.getElementById('p-hir-name');
      var emailEl = document.getElementById('p-hir-email');
      if (nameEl) nameEl.value = userData.displayName || currentUser.displayName || '';
      if (emailEl) emailEl.value = currentUser.email || '';
    }

    // Establecer fecha mínima como mañana
    var dateEl = document.getElementById('p-hir-date');
    if (dateEl) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var dd = String(tomorrow.getDate()).padStart(2, '0');
      var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      var yyyy = tomorrow.getFullYear();
      dateEl.min = yyyy + '-' + mm + '-' + dd;
    }

    goToHiringStep(2);
  };

  window.prevHiringStep = function (stepNum) {
    goToHiringStep(stepNum);
  };

  function goToHiringStep(stepNum) {
    // Esconder todos los paneles
    document.querySelectorAll('.hiring-step-panel').forEach(function (panel) {
      panel.classList.remove('active');
    });
    // Mostrar el panel actual
    var panel = document.getElementById('hiring-step-' + stepNum);
    if (panel) panel.classList.add('active');

    // Actualizar stepper indicators
    for (var i = 1; i <= 3; i++) {
      var indicator = document.getElementById('step-ind-' + i);
      var line = document.getElementById('step-line-' + (i - 1));
      
      if (indicator) {
        indicator.classList.remove('active', 'completed');
        if (i === stepNum) {
          indicator.classList.add('active');
        } else if (i < stepNum) {
          indicator.classList.add('completed');
        }
      }
      if (line) {
        line.classList.remove('active');
        if (i - 1 < stepNum) {
          line.classList.add('active');
        }
      }
    }
  }

  // Helpers
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Se eliminó showToast local en favor de window.showToast global de main.js

  // Lógica del Toggle de Planes (Público y Privado)
  window.togglePlanCategory = function (category, isPortal) {
    var prefix = isPortal ? '.portal-plan-item' : '.plan-card';
    var cards = document.querySelectorAll(prefix);
    
    // Cambiar estado activo de los botones de toggle
    var btnClass = isPortal ? 'portal-toggle-btn' : 'public-toggle-btn';
    document.querySelectorAll('.' + btnClass).forEach(function (btn) {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    cards.forEach(function (card) {
      if (card.getAttribute('data-category') === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // ─── FAQ INTERACTIVE SEARCH & CATEGORIES ───
  var currentFaqCategory = 'todos';
  
  window.filterFaqCategory = function (category, btn) {
    currentFaqCategory = category;
    
    // Cambiar estado activo de los botones de categoría
    document.querySelectorAll('.faq-tag-btn').forEach(function (el) {
      el.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    
    applyFaqFilters();
  };

  window.filterFaqs = function () {
    applyFaqFilters();
  };

  function applyFaqFilters() {
    var query = document.getElementById('faq-search-input').value.toLowerCase().trim();
    
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var itemCategory = item.getAttribute('data-category');
      var qText = item.querySelector('.faq-trigger span').textContent.toLowerCase();
      var aText = item.querySelector('.faq-answer p').textContent.toLowerCase();
      
      var matchesCategory = (currentFaqCategory === 'todos' || itemCategory === currentFaqCategory);
      var matchesSearch = (query === '' || qText.includes(query) || aText.includes(query));
      
      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
        var trigger = item.querySelector('.faq-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        var answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
      }
    });
  }

  // ─── CALCULADORA DE MEGAS (ACTIVIDADES Y DISPOSITIVOS) ───
  var plansList = [
    { id: '10mb', speed: 10, name: 'Plan Inicial', desc: 'Ideal para redes sociales, chat y navegación básica de pocos dispositivos.', price: 900 },
    { id: '20mb', speed: 20, name: 'Plan Bronce', desc: 'Ideal para familias pequeñas, streaming de video HD y navegación fluida.', price: 1000 },
    { id: '50mb', speed: 50, name: 'Plan Plata', desc: 'Perfecto para teletrabajo, múltiples streamings HD y descargas rápidas.', price: 1500 },
    { id: '100mb', speed: 100, name: 'Plan Oro', desc: 'Ideal para hogares conectados, streaming 4K, descargas pesadas y gaming.', price: 2000 },
    { id: '200mb', speed: 200, name: 'Plan Platino', desc: 'Ideal para teletrabajo intensivo, gaming competitivo y muchos dispositivos concurrentes.', price: 2500 },
    { id: '300mb', speed: 300, name: 'Plan Ultra', desc: 'Velocidad premium para creadores de contenido, streaming 4K/8K y domótica completa.', price: 3000 },
    { id: '400mb', speed: 400, name: 'Plan Pro', desc: 'Velocidad ultra-rápida para máxima demanda y descargas de gran volumen.', price: 4000 },
    { id: '500mb', speed: 500, name: 'Plan Élite', desc: 'La máxima potencia disponible. Velocidad empresarial para el hogar del futuro.', price: 5000 }
  ];

  var currentRecommendedPlan = plansList[0];

  window.toggleCalcActivity = function (el) {
    el.classList.toggle('active');
    window.updateMegasCalc();
  };

  window.updateMegasCalc = function () {
    var sum = 0;
    var activeCards = document.querySelectorAll('.calc-activity-card.active');
    activeCards.forEach(function (card) {
      sum += parseInt(card.getAttribute('data-speed') || 0);
    });

    var slider = document.getElementById('devices-slider');
    if (!slider) return;
    var devices = parseInt(slider.value);
    
    var label = document.getElementById('devices-count-label');
    if (label) {
      if (devices === 25) {
        label.textContent = '25+ Dispositivos';
      } else if (devices === 1) {
        label.textContent = '1 Dispositivo';
      } else {
        label.textContent = devices + ' Dispositivos';
      }
    }

    if (sum === 0) sum = 5;
    var requiredSpeed = sum * (1 + (devices - 1) * 0.12);

    var matchingPlan = plansList[0];
    for (var i = 0; i < plansList.length; i++) {
      if (plansList[i].speed >= requiredSpeed) {
        matchingPlan = plansList[i];
        break;
      }
      matchingPlan = plansList[i];
    }

    currentRecommendedPlan = matchingPlan;

    var sugMegas = document.getElementById('calc-sug-megas');
    if (sugMegas) sugMegas.innerHTML = matchingPlan.speed + ' <span>Mbps</span>';
    
    var planName = document.getElementById('calc-plan-name');
    if (planName) planName.textContent = matchingPlan.name;
    
    var planDesc = document.getElementById('calc-plan-desc');
    if (planDesc) planDesc.textContent = matchingPlan.desc;
    
    var planPrice = document.getElementById('calc-plan-price');
    if (planPrice) planPrice.textContent = 'RD$ ' + matchingPlan.price.toLocaleString() + ' / mes';
  };

  window.requestSuggestedPlan = function () {
    if (!currentRecommendedPlan) return;
    
    var fullName = currentRecommendedPlan.name + ' ' + currentRecommendedPlan.speed + ' Megas';
    var planId = currentRecommendedPlan.id;
    var price = currentRecommendedPlan.price;

    if (!currentUser) {
      showToast('Por favor, inicia sesión para solicitar este plan', 'info');
      setTimeout(function () {
        window.location.href = 'login.html?redirect=internet.html';
      }, 1500);
    } else {
      if (userData && userData.isInternetClient) {
        window.openSupportModal('change_plan');
        var speedSelect = document.getElementById('support-new-speed');
        if (speedSelect) {
          speedSelect.value = planId;
        }
      } else {
        window.selectHiringPlan(fullName, planId, price);
      }
    }
  };

  // Lógica interactiva de planes estilo Claro: filtros, búsqueda, ordenamiento y selección
  window.toggleCardDetail = function (btn) {
    btn.classList.toggle('active');
    var card = btn.closest('.claro-card');
    var detailContent = card.querySelector('.claro-card-detail-content');
    if (btn.classList.contains('active')) {
      detailContent.style.maxHeight = detailContent.scrollHeight + "px";
    } else {
      detailContent.style.maxHeight = null;
    }
  };

  window.updatePriceSliderVal = function () {
    var slider = document.getElementById('price-filter-slider');
    var display = document.getElementById('price-slider-val');
    if (slider && display) {
      display.textContent = 'RD$ ' + parseFloat(slider.value).toLocaleString();
    }
    window.filterPlans();
  };

  window.clearAllFilters = function () {
    var radios = document.getElementsByName('filter-service');
    radios.forEach(function (r) {
      r.checked = (r.value === 'all');
    });

    var checkboxes = document.getElementsByName('filter-plan-type');
    checkboxes.forEach(function (c) {
      c.checked = false;
    });

    var slider = document.getElementById('price-filter-slider');
    if (slider) {
      slider.value = slider.max;
    }
    
    var searchInput = document.getElementById('plan-search-input');
    if (searchInput) {
      searchInput.value = '';
    }

    var sortSelect = document.getElementById('plan-sort-select');
    if (sortSelect) {
      sortSelect.value = 'default';
    }

    window.updatePriceSliderVal();
    window.sortPlans();
  };

  var originalCardElements = [];

  window.filterPlans = function () {
    var serviceVal = 'all';
    var radios = document.getElementsByName('filter-service');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        serviceVal = radios[i].value;
        break;
      }
    }

    var checkedTypes = [];
    var checkboxes = document.getElementsByName('filter-plan-type');
    checkboxes.forEach(function (c) {
      if (c.checked) {
        checkedTypes.push(c.value);
      }
    });

    var maxPrice = 5000;
    var slider = document.getElementById('price-filter-slider');
    if (slider) {
      maxPrice = parseFloat(slider.value);
    }

    var searchQuery = '';
    var searchInput = document.getElementById('plan-search-input');
    if (searchInput) {
      searchQuery = searchInput.value.toLowerCase().trim();
    }

    var cards = document.querySelectorAll('#claro-plans-grid .claro-card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var cardService = card.getAttribute('data-service');
      var cardType = card.getAttribute('data-type');
      var cardPrice = parseFloat(card.getAttribute('data-price') || 0);
      var cardName = (card.getAttribute('data-name') || '').toLowerCase();
      var cardSpeed = (card.getAttribute('data-speed') || '').toLowerCase();

      var matchesService = (serviceVal === 'all' || cardService === serviceVal);
      var matchesType = (checkedTypes.length === 0 || checkedTypes.indexOf(cardType) !== -1);
      var matchesPrice = (cardPrice <= maxPrice);
      var matchesSearch = (searchQuery === '' || cardName.indexOf(searchQuery) !== -1 || cardSpeed.indexOf(searchQuery) !== -1);

      if (matchesService && matchesType && matchesPrice && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    var noResultsMsg = document.getElementById('no-plans-results');
    var grid = document.getElementById('claro-plans-grid');
    if (visibleCount === 0) {
      if (!noResultsMsg && grid) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-plans-results';
        noResultsMsg.style.gridColumn = '1 / -1';
        noResultsMsg.style.textAlign = 'center';
        noResultsMsg.style.padding = '40px 20px';
        noResultsMsg.style.color = '#64748b';
        noResultsMsg.style.fontFamily = "'Outfit', sans-serif";
        noResultsMsg.innerHTML = '<i class="fas fa-search" style="font-size:2.2rem; margin-bottom:12px; color:#cbd5e1;"></i><p style="font-weight:600; margin:0;">No se encontraron planes que coincidan con los filtros</p>';
        grid.appendChild(noResultsMsg);
      }
      if (noResultsMsg) noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  };

  window.sortPlans = function () {
    var grid = document.getElementById('claro-plans-grid');
    if (!grid) return;

    var select = document.getElementById('plan-sort-select');
    if (!select) return;
    var sortBy = select.value;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.claro-card'));

    if (originalCardElements.length === 0) {
      originalCardElements = cards.slice();
    }

    if (sortBy === 'default') {
      originalCardElements.forEach(function (card) {
        grid.appendChild(card);
      });
    } else {
      cards.sort(function (a, b) {
        var priceA = parseFloat(a.getAttribute('data-price') || 0);
        var priceB = parseFloat(b.getAttribute('data-price') || 0);
        var speedA = parseFloat(a.getAttribute('data-speed') || 0);
        var speedB = parseFloat(b.getAttribute('data-speed') || 0);

        if (sortBy === 'price-asc') {
          return priceA - priceB;
        } else if (sortBy === 'price-desc') {
          return priceB - priceA;
        } else if (sortBy === 'speed-desc') {
          return speedB - speedA;
        }
        return 0;
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    var noResultsMsg = document.getElementById('no-plans-results');
    if (noResultsMsg && noResultsMsg.parentNode === grid) {
      grid.appendChild(noResultsMsg);
    }
  };

  window.selectClaroPlan = function (name, id, price) {
    var fullName = name;
    var planId = id;

    if (!currentUser) {
      sessionStorage.setItem('pending_hiring_plan_name', fullName);
      sessionStorage.setItem('pending_hiring_plan_id', planId);
      sessionStorage.setItem('pending_hiring_plan_price', price);

      if (window.showToast) window.showToast('Redirigiendo al portal para completar tu solicitud...', 'info');
      setTimeout(function () {
        window.location.href = 'login.html?redirect=internet.html';
      }, 1200);
    } else {
      if (userData && userData.isInternetClient) {
        window.openSupportModal('change_plan');
        var speedSelect = document.getElementById('support-new-speed');
        if (speedSelect) {
          speedSelect.value = planId;
        }
      } else {
        window.selectHiringPlan(fullName, planId, price);
      }
    }
  };

  // El test de velocidad real de Ookla Speedtest se ejecuta de forma nativa en el iframe de internet.html.

  // Auto-inicializar cuando el DOM esté listo
  window.addEventListener('DOMContentLoaded', init);
})();
