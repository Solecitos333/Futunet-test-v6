/**
 * Futunet - Buzón de Sugerencias e Ideas
 * Manejador del formulario de sugerencias para clientes y usuarios del sistema
 */
(function () {
  'use strict';

  var selectedCategory = 'web_platform';
  var selectedAudience = 'client';
  var currentRating = 0;
  var ratingLabels = {
    1: '1 estrella — Muy mejorable',
    2: '2 estrellas — Regular',
    3: '3 estrellas — Aceptable',
    4: '4 estrellas — Buena',
    5: '5 estrellas — ¡Excelente!'
  };

  // Referencias a elementos DOM
  var form = document.getElementById('sug-form');
  var categoryCards = document.querySelectorAll('.sug-category-card');
  var audienceBtns = document.querySelectorAll('.sug-audience-btn');
  var starBtns = document.querySelectorAll('.sug-star-btn');
  var ratingText = document.getElementById('sug-rating-text');
  var anonCheckbox = document.getElementById('sug-anon-checkbox');
  var contactFields = document.getElementById('sug-contact-fields');
  var submitBtn = document.getElementById('sug-submit-btn');
  var alertBox = document.getElementById('sug-alert');
  var formCard = document.getElementById('sug-form-card');
  var successCard = document.getElementById('sug-success-card');
  var refCodeDisplay = document.getElementById('sug-ref-code');
  var copyCodeBtn = document.getElementById('sug-copy-code-btn');
  var btnAnother = document.getElementById('sug-btn-another');
  var trackInput = document.getElementById('sug-track-input');
  var trackBtn = document.getElementById('sug-track-btn');
  var trackResult = document.getElementById('sug-track-result');
  var communityGrid = document.getElementById('sug-community-grid');

  // Inicialización cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function () {
    initCategorySelector();
    initAudienceSelector();
    initRatingStars();
    initAnonymousToggle();
    initCharCounters();
    checkCurrentUser();
    initTracking();
    initCopyCode();
    initCommunityWall();
    initCommunityFilters();
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
    if (btnAnother) {
      btnAnother.addEventListener('click', resetFormView);
    }
  });

  // 1. Selector de Categorías
  function initCategorySelector() {
    categoryCards.forEach(function (card) {
      card.addEventListener('click', function () {
        categoryCards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        selectedCategory = card.getAttribute('data-cat') || 'web_platform';
      });
    });
  }

  // 2. Selector de Perfil / Audiencia (Cliente vs Colaborador)
  function initAudienceSelector() {
    audienceBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        audienceBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        selectedAudience = btn.getAttribute('data-audience') || 'client';
      });
    });
  }

  // 3. Calificación por Estrellas
  function initRatingStars() {
    starBtns.forEach(function (btn, index) {
      var starVal = index + 1;

      btn.addEventListener('mouseenter', function () {
        highlightStars(starVal);
        if (ratingText) ratingText.textContent = ratingLabels[starVal] || '';
      });

      btn.addEventListener('mouseleave', function () {
        highlightStars(currentRating);
        if (ratingText) {
          ratingText.textContent = currentRating > 0 ? ratingLabels[currentRating] : 'Opcional';
        }
      });

      btn.addEventListener('click', function () {
        if (currentRating === starVal) {
          // Toggle off
          currentRating = 0;
        } else {
          currentRating = starVal;
        }
        highlightStars(currentRating);
        if (ratingText) {
          ratingText.textContent = currentRating > 0 ? ratingLabels[currentRating] : 'Opcional';
        }
      });
    });
  }

  function highlightStars(count) {
    starBtns.forEach(function (btn, index) {
      if (index < count) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  // 4. Toggle Anónimo
  function initAnonymousToggle() {
    if (!anonCheckbox) return;
    anonCheckbox.addEventListener('change', function () {
      var isAnon = anonCheckbox.checked;
      if (contactFields) {
        if (isAnon) {
          contactFields.classList.add('is-dimmed');
          var nameInput = document.getElementById('sug-name');
          var emailInput = document.getElementById('sug-email');
          var phoneInput = document.getElementById('sug-phone');
          if (nameInput) nameInput.required = false;
          if (emailInput) emailInput.required = false;
        } else {
          contactFields.classList.remove('is-dimmed');
        }
      }
    });
  }

  // 5. Contadores de caracteres
  function initCharCounters() {
    var textInputs = [
      { id: 'sug-title', counterId: 'sug-title-count', max: 150 },
      { id: 'sug-desc', counterId: 'sug-desc-count', max: 3000 },
      { id: 'sug-benefit', counterId: 'sug-benefit-count', max: 1000 }
    ];

    textInputs.forEach(function (item) {
      var el = document.getElementById(item.id);
      var counter = document.getElementById(item.counterId);
      if (el && counter) {
        el.addEventListener('input', function () {
          counter.textContent = el.value.length + ' / ' + item.max;
        });
      }
    });
  }

  // 6. Detectar usuario autenticado para pre-completar datos
  function checkCurrentUser() {
    var checkAuthInterval = setInterval(function () {
      if (window.FutunetAuth) {
        clearInterval(checkAuthInterval);
        var user = window.FutunetAuth.getCurrentUser ? window.FutunetAuth.getCurrentUser() : null;
        var userData = window.FutunetAuth.getUserData ? window.FutunetAuth.getUserData() : null;

        if (user) {
          var nameInput = document.getElementById('sug-name');
          var emailInput = document.getElementById('sug-email');
          if (nameInput && !nameInput.value) {
            nameInput.value = user.displayName || (userData && userData.nombre) || '';
          }
          if (emailInput && !emailInput.value) {
            emailInput.value = user.email || '';
          }

          // Si es staff o admin, marcar por defecto como usuario del sistema
          var roles = userData ? [userData.role, ...(userData.roles || [])] : [];
          var isStaff = roles.some(function (r) {
            return ['superadmin', 'admin', 'editor', 'support_agent', 'billing_clerk'].indexOf(r) > -1;
          });
          if (isStaff) {
            var staffBtn = document.querySelector('.sug-audience-btn[data-audience="staff"]');
            if (staffBtn) staffBtn.click();
          }
        }
      }
    }, 100);

    setTimeout(function () { clearInterval(checkAuthInterval); }, 4000);
  }

  // 7. Generar código de referencia amigable
  function generateRefCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = 'SUG-';
    for (var i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function sanitizeText(str) {
    if (!str) return '';
    return String(str)
      .replace(/<[^>]*>/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
  }

  // 8. Envío del Formulario
  async function handleFormSubmit(e) {
    e.preventDefault();
    hideAlert();

    // 1. Verificación Honeypot (Trampa antispam para bots)
    var hp = document.getElementById('sug-hp-check');
    if (hp && hp.value.trim() !== '') {
      console.warn('Bot submission blocked via honeypot.');
      if (formCard) formCard.hidden = true;
      if (successCard) successCard.hidden = false;
      return;
    }

    // 2. Cooldown de envío (Rate-limiting en cliente 15s)
    var cooldownKey = 'futunet_last_sug_ts';
    var now = Date.now();
    var lastSub = sessionStorage.getItem(cooldownKey);
    if (lastSub && (now - Number(lastSub)) < 15000) {
      var remaining = Math.ceil((15000 - (now - Number(lastSub))) / 1000);
      showAlert('Por favor espera ' + remaining + ' segundos antes de enviar otra sugerencia.');
      return;
    }

    // 3. Sanitización y captura de campos
    var title = sanitizeText(document.getElementById('sug-title')?.value || '');
    var desc = sanitizeText(document.getElementById('sug-desc')?.value || '');
    var benefit = sanitizeText(document.getElementById('sug-benefit')?.value || '');
    var isAnon = anonCheckbox ? anonCheckbox.checked : false;
    var name = isAnon ? '' : sanitizeText(document.getElementById('sug-name')?.value || '');
    var email = isAnon ? '' : sanitizeText(document.getElementById('sug-email')?.value || '');
    var phone = isAnon ? '' : sanitizeText(document.getElementById('sug-phone')?.value || '');

    // 4. Verificación de Consentimiento de Privacidad (Ley 172-13 / RGPD)
    var privacyConsent = document.getElementById('sug-privacy-consent');
    if (!isAnon && (name || email || phone)) {
      if (privacyConsent && !privacyConsent.checked) {
        showAlert('Debes autorizar el tratamiento de tus datos de contacto conforme a la política de privacidad.');
        if (privacyConsent) privacyConsent.focus();
        return;
      }
    }

    // Validaciones
    if (title.length < 3 || title.length > 150) {
      showAlert('Por favor escribe un título claro de entre 3 y 150 caracteres.');
      return;
    }

    if (desc.length < 5 || desc.length > 3000) {
      showAlert('Por favor describe tu sugerencia con al menos 5 caracteres (máximo 3000).');
      return;
    }

    if (!isAnon && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('Por favor introduce un correo electrónico válido o selecciona la casilla de envío anónimo.');
      return;
    }

    // Preparar objeto de envío
    var db = window.FutunetFirebase ? window.FutunetFirebase.db : (window.firebase ? firebase.firestore() : null);
    if (!db) {
      showAlert('No pudimos conectar con el servidor en este momento. Por favor revisa tu conexión a Internet o intenta en unos instantes.');
      return;
    }

    setSubmitting(true);

    try {
      var currentUser = window.FutunetAuth && window.FutunetAuth.getCurrentUser ? window.FutunetAuth.getCurrentUser() : null;
      var userData = window.FutunetAuth && window.FutunetAuth.getUserData ? window.FutunetAuth.getUserData() : null;

      var refCode = generateRefCode();
      var suggestionData = {
        title: title,
        description: desc,
        category: selectedCategory,
        targetAudience: selectedAudience,
        status: 'pending',
        isAnonymous: isAnon,
        refCode: refCode,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (benefit) suggestionData.benefit = benefit;
      if (currentRating > 0) suggestionData.rating = currentRating;
      if (!isAnon && name) suggestionData.authorName = name;
      if (!isAnon && email) suggestionData.authorEmail = email;
      if (!isAnon && phone) suggestionData.authorPhone = phone;
      if (currentUser && currentUser.uid) suggestionData.userId = currentUser.uid;
      if (userData && userData.role) suggestionData.userRole = userData.role;
      suggestionData.source = 'web_public';
      suggestionData.pageUrl = window.location.href;

      // Guardar en la colección Firestore
      var docRef = await db.collection('suggestions').add(suggestionData);

      // Registrar timestamp de cooldown exitoso
      sessionStorage.setItem(cooldownKey, String(Date.now()));

      // Mostrar confirmación
      if (refCodeDisplay) {
        refCodeDisplay.textContent = refCode;
        refCodeDisplay.setAttribute('data-ref-code', refCode);
      }
      if (formCard) formCard.hidden = true;
      if (successCard) {
        successCard.hidden = false;
        successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Limpiar formulario para futuro reuso
      form.reset();
      if (privacyConsent) privacyConsent.checked = false;
      currentRating = 0;
      highlightStars(0);
      if (ratingText) ratingText.textContent = 'Opcional';

    } catch (err) {
      console.error('Error al enviar sugerencia:', err);
      showAlert('Ocurrió un error al enviar tu sugerencia: ' + (err.message || 'Inténtalo de nuevo en unos minutos.'));
    } finally {
      setSubmitting(false);
    }
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    var btnText = submitBtn.querySelector('.sug-btn-text');
    var btnSpinner = submitBtn.querySelector('.sug-spinner');
    if (btnText) btnText.textContent = isSubmitting ? 'Enviando tu idea…' : 'Enviar sugerencia';
    if (btnSpinner) btnSpinner.hidden = !isSubmitting;
  }

  function showAlert(msg) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.hidden = false;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    if (alertBox) {
      alertBox.textContent = '';
      alertBox.hidden = true;
    }
  }

  function resetFormView() {
    if (successCard) successCard.hidden = true;
    if (formCard) {
      formCard.hidden = false;
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 10. Utilidades de formato y escape
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getStatusBadge(status) {
    var s = status || 'pending';
    var map = {
      'pending': { label: 'Pendiente de Revisión', cls: 'sug-status-pending' },
      'in_review': { label: 'En Evaluación Técnica', cls: 'sug-status-in_review' },
      'planned': { label: 'Planificada en Roadmap', cls: 'sug-status-planned' },
      'implemented': { label: '¡Implementada con Éxito!', cls: 'sug-status-implemented' },
      'archived': { label: 'Procesada / Archivada', cls: 'sug-status-archived' }
    };
    var item = map[s] || map['pending'];
    return '<span class="sug-status-badge ' + item.cls + '">' + escapeHtml(item.label) + '</span>';
  }

  function getCategoryName(cat) {
    var map = {
      'web_platform': 'Plataforma Web y Catálogo',
      'services_support': 'Servicios y Soporte Técnico',
      'catalog_products': 'Productos e Inventario',
      'customer_service': 'Atención al Cliente y Cobros',
      'other': 'Propuesta General'
    };
    return map[cat] || 'General';
  }

  // 11. Consulta y Seguimiento de Sugerencia por Código
  function initTracking() {
    if (trackBtn) {
      trackBtn.addEventListener('click', handleTrackSuggestion);
    }
    if (trackInput) {
      trackInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleTrackSuggestion();
        }
      });
    }

    try {
      var urlParams = new URLSearchParams(window.location.search);
      var refParam = urlParams.get('ref') || urlParams.get('code');
      if (refParam && trackInput) {
        trackInput.value = refParam.trim().toUpperCase();
        handleTrackSuggestion();
      }
    } catch (e) {
      // Ignorar fallo de URLSearchParams en navegadores antiguos
    }
  }

  // 11b. Copiar código de seguimiento (SUG-B6410)
  function initCopyCode() {
    if (!copyCodeBtn) return;
    copyCodeBtn.addEventListener('click', function () {
      var code = refCodeDisplay ? refCodeDisplay.getAttribute('data-ref-code') || refCodeDisplay.textContent.trim() : '';
      if (!code) return;
      var cleanCode = (code.match(/SUG-[A-Z0-9]{5}/i) || [code])[0].toUpperCase();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cleanCode).then(onCodeCopied).catch(function () {
          fallbackCopyText(cleanCode);
          onCodeCopied();
        });
      } else {
        fallbackCopyText(cleanCode);
        onCodeCopied();
      }
      // Pre-llenar campo de consulta si existe
      if (trackInput) {
        trackInput.value = cleanCode;
      }
    });
  }

  function fallbackCopyText(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function onCodeCopied() {
    var btnText = document.getElementById('sug-copy-btn-text');
    var btnIcon = document.getElementById('sug-copy-btn-icon');
    if (btnText) btnText.textContent = '¡Copiado!';
    if (btnIcon) btnIcon.setAttribute('data-lucide', 'check');
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
    setTimeout(function () {
      if (btnText) btnText.textContent = 'Copiar código';
      if (btnIcon) btnIcon.setAttribute('data-lucide', 'copy');
      if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
      }
    }, 2200);
  }

  async function handleTrackSuggestion() {
    if (!trackInput || !trackResult) return;
    var raw = trackInput.value.trim();
    if (!raw) {
      trackResult.hidden = false;
      trackResult.innerHTML = '<p style="color:#b91c1c; margin:0; font-size:0.9rem;">Por favor escribe tu código de referencia (ej: SUG-A1B2C).</p>';
      return;
    }

    var match = raw.match(/SUG-[A-Z0-9]{5}/i);
    var code = match ? match[0].toUpperCase() : raw.toUpperCase();
    var db = window.FutunetFirebase ? window.FutunetFirebase.db : (window.firebase ? firebase.firestore() : null);
    if (!db) {
      var fbOffline = getFallbackSuggestionByCode(code);
      if (fbOffline) {
        trackResult.hidden = false;
        renderTrackResult(fbOffline, fbOffline.refCode);
        return;
      }
      trackResult.hidden = false;
      trackResult.innerHTML = '<p style="color:#b91c1c; margin:0; font-size:0.9rem;">No pudimos conectar con el servidor en este momento. Revisa tu conexión.</p>';
      return;
    }

    trackResult.hidden = false;
    trackResult.innerHTML = '<p style="color:#64748b; margin:0; font-size:0.9rem;"><i class="fas fa-spinner fa-spin"></i> Consultando estado de la propuesta…</p>';

    try {
      var foundDoc = null;
      var docData = null;

      // 1. Búsqueda por refCode exacto
      var snap = await db.collection('suggestions').where('refCode', '==', code).limit(1).get();
      if (!snap.empty) {
        foundDoc = snap.docs[0];
        docData = foundDoc.data();
      } else if (raw.length >= 12) {
        // 2. Si introdujo un ID de documento Firestore directo
        try {
          var directDoc = await db.collection('suggestions').doc(raw).get();
          if (directDoc.exists) {
            foundDoc = directDoc;
            docData = directDoc.data();
          }
        } catch (eDoc) {
          // Ignorar fallo de búsqueda directa
        }
      }

      if (!foundDoc || !docData) {
        var fbNotFound = getFallbackSuggestionByCode(code);
        if (fbNotFound) {
          renderTrackResult(fbNotFound, fbNotFound.refCode);
          return;
        }
        trackResult.innerHTML = '<div style="padding:10px 0;">' +
          '<h4 style="margin:0 0 6px; color:#b91c1c; font-size:1rem; font-weight:700;">Propuesta no encontrada</h4>' +
          '<p style="margin:0; font-size:0.88rem; color:#64748b;">No encontramos ninguna sugerencia con el código <strong>' + escapeHtml(code) + '</strong>. Verifica que esté bien escrito o comunícate con nosotros.</p>' +
          '</div>';
        return;
      }

      renderTrackResult(docData, foundDoc.id);

    } catch (err) {
      console.error('Error al consultar sugerencia:', err);
      var fbErr = getFallbackSuggestionByCode(code);
      if (fbErr) {
        renderTrackResult(fbErr, fbErr.refCode);
        return;
      }
      trackResult.innerHTML = '<p style="color:#b91c1c; margin:0; font-size:0.9rem;">Error al consultar el estado: ' + escapeHtml(err.message || 'Error de red') + '</p>';
    }
  }

  function renderTrackResult(data, docId) {
    var dateStr = 'Reciente';
    if (data.createdAt && data.createdAt.toDate) {
      var d = data.createdAt.toDate();
      dateStr = d.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (data.createdAt && data.createdAt.seconds) {
      var dSec = new Date(data.createdAt.seconds * 1000);
      dateStr = dSec.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    var badgeHtml = getStatusBadge(data.status);
    var catName = getCategoryName(data.category);

    var responseHtml = '';
    if (data.officialResponse) {
      var respDateStr = '';
      if (data.respondedAt && data.respondedAt.toDate) {
        respDateStr = ' — ' + data.respondedAt.toDate().toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
      } else if (data.respondedAt && data.respondedAt.seconds) {
        respDateStr = ' — ' + new Date(data.respondedAt.seconds * 1000).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      var responder = data.respondedBy ? (' por ' + escapeHtml(data.respondedBy)) : '';
      responseHtml = '<div class="sug-response-box">' +
        '<div class="sug-response-header">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
          '<span>Respuesta Oficial de Futunet' + responder + respDateStr + '</span>' +
        '</div>' +
        '<p class="sug-response-body">' + escapeHtml(data.officialResponse) + '</p>' +
      '</div>';
    } else {
      responseHtml = '<div style="margin-top:14px; padding:12px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; font-size:0.88rem; color:#1e40af;">' +
        '<strong>Tu sugerencia está en evaluación:</strong> Nuestro equipo directivo y técnico revisa periódicamente cada propuesta recibida. Cuando tengamos una resolución o respuesta oficial, podrás verla aquí ingresando tu código.' +
      '</div>';
    }

    trackResult.innerHTML = '<div style="display:flex; flex-direction:column; gap:12px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
        '<div>' +
          '<span style="font-size:0.75rem; font-weight:700; color:var(--sug-primary); text-transform:uppercase;">' + escapeHtml(catName) + '</span>' +
          '<h4 style="margin:4px 0 0; font-size:1.15rem; color:var(--sug-navy); font-weight:700;">' + escapeHtml(data.title) + '</h4>' +
        '</div>' +
        badgeHtml +
      '</div>' +
      '<p style="margin:0; font-size:0.9rem; color:#475569; line-height:1.5;">' + escapeHtml(data.description) + '</p>' +
      '<div style="font-size:0.8rem; color:#94a3b8; display:flex; gap:12px; flex-wrap:wrap;">' +
        '<span>Código: <strong style="font-family:monospace; color:#0f172a;">' + escapeHtml(data.refCode || docId) + '</strong></span>' +
        '<span>Fecha de registro: ' + escapeHtml(dateStr) + '</span>' +
      '</div>' +
      responseHtml +
    '</div>';

    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  var loadedCommunityIdeas = [];

  var canonicalSuggestionsList = [
    {
      refCode: 'SUG-W8421',
      title: 'Buscador y seguimiento de sugerencias por código',
      category: 'web_platform',
      status: 'implemented',
      description: 'Permitir a los usuarios y clientes ingresar el código SUG-XXXXX para revisar en qué fase está su idea y qué respondió el equipo.',
      officialResponse: '¡Implementado! Ya puedes consultar tu código directamente desde esta página y en Mi Cuenta.'
    },
    {
      refCode: 'SUG-C9130',
      title: 'Incorporación de proyectores y pantallas al catálogo de oficinas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Ampliar la oferta tecnológica corporativa incluyendo proyectores Epson multimedia de alta luminosidad para salas de reuniones.',
      officialResponse: '¡Cumplido! Se añadieron proyectores Epson PowerLite y pantallas retráctiles con garantía en Equipos de Oficina.'
    },
    {
      refCode: 'SUG-M5204',
      title: 'Filtro rápido por marcas y disponibilidad en smartphones',
      category: 'web_platform',
      status: 'implemented',
      description: 'Optimizar la barra del catálogo en pantallas móviles para filtrar marcas y disponibilidad de manera inmediata sin desplazarse demasiado.',
      officialResponse: '¡Implementado! Se añadió la barra táctil de filtros rápidos por marca y disponibilidad sobre la lista de productos para compras ágiles.'
    },
    {
      refCode: 'SUG-F3819',
      title: 'Descarga directa de comprobantes de pago e internet en PDF',
      category: 'customer_service',
      status: 'implemented',
      description: 'Permitir a los clientes residenciales y corporativos descargar sus comprobantes de mensualidad de internet en formato PDF listo para contabilidad.',
      officialResponse: '¡Implementado! Hemos integrado el botón de descarga directa de comprobantes fiscales y recibos de pago en el módulo de Facturación.'
    },
    {
      refCode: 'SUG-L4920',
      title: 'Libreros de madera ejecutivos para oficina en el catálogo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Añadir opciones de libreros y estanterías de madera para archivo de documentos y expedientes corporativos en Mobiliario de Oficina.',
      officialResponse: '¡Atendido! Ya se encuentra disponible el Librero de madera ejecutivo para oficina en Mobiliario con estantes reforzados y cotización en línea.'
    },
    {
      refCode: 'SUG-T1802',
      title: 'Aires acondicionados TGM Mini-Split y climatización con filtro rápido',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Facilitar la búsqueda y cotización de equipos de climatización TGM Mini-Split de 12,000 a 24,000 BTU en el catálogo corporativo.',
      officialResponse: '¡Implementado! Incorporamos los modelos TGM Mini-Split Inverter con filtro directo por marca en el catálogo y paquetes de instalación.'
    },
    {
      refCode: 'SUG-B6410',
      title: 'Botón de copiar código de seguimiento al enviar una sugerencia',
      category: 'web_platform',
      status: 'implemented',
      description: 'Facilitar el copiado en un clic del código SUG-XXXXX asignado al enviar una propuesta para no tener que anotarlo manualmente.',
      officialResponse: '¡Cumplido! Al registrar una propuesta se habilita el botón interactivo de copiado rápido al portapapeles con confirmación visual.'
    },
    {
      refCode: 'SUG-P5512',
      title: 'Impresoras multifuncionales EcoTank y térmicas POS en el catálogo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Habilitar las impresoras Epson de tinta continua y modelos térmicos para facturación y puntos de venta.',
      officialResponse: '¡Cumplido! Activamos las multifuncionales Epson EcoTank L3250, Brother, Canon e impresoras térmicas POS de 80mm en stock.'
    },
    {
      refCode: 'SUG-A7291',
      title: 'Disponibilidad de Apple AirPods y auriculares con garantía local',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Añadir al catálogo Apple AirPods originales y accesorios de audio de alta fidelidad para llamadas y trabajo.',
      officialResponse: '¡Disponible! Se integraron los Apple AirPods (2.ª gen) originales con estuche de carga y despacho garantizado.'
    },
    {
      refCode: 'SUG-K3844',
      title: 'Teclados cableados Dell USB y periféricos resistentes de oficina',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Facilitar la reposición de teclados de oficina duraderos para digitación continua con teclado numérico.',
      officialResponse: '¡Implementado! Incorporamos el Teclado Dell KB216 USB formato completo para despachos y áreas administrativas.'
    },
    {
      refCode: 'SUG-E2835',
      title: 'Escritorios ejecutivos blancos y mobiliario corporativo para oficina',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Disponibilidad de escritorios ejecutivos con panel frontal, configuraciones en L con credenza y pasacables para oficinas y despachos.',
      officialResponse: '¡Cumplido! Se actualizó y habilitó la línea completa de escritorios ejecutivos y estaciones gerenciales con fotos reales e instalación.'
    },
    {
      refCode: 'SUG-L7390',
      title: 'Laptops corporativas Dell Latitude (Serie 5000 y 7000) táctiles y Core i5/i7',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Disponibilidad de laptops empresariales de alta resistencia Dell Latitude con pantalla táctil, 16 GB de RAM y almacenamiento SSD NVMe.',
      officialResponse: '¡Disponible! Se integraron las laptops Dell Latitude 7390 Touch, 5330 Core i7 y 5410/7400 con garantía local y soporte corporativo.'
    },
    {
      refCode: 'SUG-G9420',
      title: 'Componentes Gaming de alto rendimiento (Refrigeración 360, Gabinetes y Fuentes ATX 3.1)',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Habilitar hardware de grado entusiasta: disipadores AIO 360mm con pantallas LCD/AMOLED (TRYX y Kraken), gabinetes panorámicos y fuentes PCIe 5.0.',
      officialResponse: '¡Implementado! Disponibles en catálogo y gaming.html los enfriamientos TRYX Panorama 360, Kraken Elite, gabinetes Lian Li/MSI y fuentes ATX 3.1.'
    },
    {
      refCode: 'SUG-D3050',
      title: 'Disponibilidad de computadoras de escritorio Dell OptiPlex SFF Core i5 para oficinas y comercios',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Disponibilidad de PCs de escritorio de factor de forma compacto Dell OptiPlex SFF con procesadores Core i5 de 7ma generación, 8GB a 16GB de RAM y SSD para puestos de facturación y oficinas.',
      officialResponse: '¡Implementado! Integradas al catálogo las computadoras Dell OptiPlex SFF (modelos 7050, 5050 y 3050) con discos SSD ultrarrápidos y garantía corporativa.'
    },
    {
      refCode: 'SUG-M2480',
      title: 'Incorporación de monitores LG y pantallas IPS Full HD de 24 y 27 pulgadas al catálogo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Monitores de oficina Full HD de 24 y 27 pulgadas de marcas líderes como LG y Dell con descanso ocular Flicker Safe y puertos HDMI.',
      officialResponse: '¡Disponible! Ya incorporamos los monitores LG 24" y 27" IPS Full HD con Flicker Safe y Dell 24" antirreflejo listos para entrega inmediata.'
    },
    {
      refCode: 'SUG-H7200',
      title: 'Cámaras de seguridad Hikvision 1080p y kits de videovigilancia en el catálogo de seguridad',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cámaras de videovigilancia Hikvision ColorVu con visión nocturna a color 24/7 y kits grabadores DVR de 4 canales con app móvil Hik-Connect.',
      officialResponse: '¡Atendido! Habilitadas en el catálogo las cámaras Hikvision ColorVu Turbo HD 1080p y kits DVR de 4 canales con monitoreo remoto en tiempo real.'
    },
    {
      refCode: 'SUG-L5480',
      title: 'Disponibilidad de Laptop corporativa Dell Latitude 5480 Core i5 para oficina y digitación',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Laptops empresariales Dell Latitude 5480 de 14 pulgadas con procesador Intel Core i5, 8 GB de RAM y SSD de 128 GB para labores de oficina y digitación.',
      officialResponse: '¡Implementado! Integrada al catálogo la Laptop Dell Latitude 5480 Core i5 con 8 GB de RAM, SSD ultrarrápido y garantía corporativa Futunet.'
    }
  ];

  function getFallbackSuggestionByCode(code) {
    if (!code) return null;
    var clean = code.trim().toUpperCase();
    return canonicalSuggestionsList.find(function (s) {
      return (s.refCode || '').toUpperCase() === clean;
    }) || null;
  }

  // 12. Muro de Ideas Comunitarias Implementadas / Planificadas
  async function initCommunityWall() {
    if (!communityGrid) return;

    var db = window.FutunetFirebase ? window.FutunetFirebase.db : (window.firebase ? firebase.firestore() : null);
    if (!db) {
      renderFallbackCommunityWall();
      return;
    }

    try {
      var snap = await db.collection('suggestions')
        .where('status', 'in', ['implemented', 'planned'])
        .limit(30)
        .get();

      if (snap.empty) {
        renderFallbackCommunityWall();
        return;
      }

      var items = [];
      snap.forEach(function (doc) {
        items.push(doc.data());
      });
      loadedCommunityIdeas = items;
      renderCommunityCards(loadedCommunityIdeas);
    } catch (e) {
      renderFallbackCommunityWall();
    }
  }

  function renderCommunityCards(list) {
    if (!communityGrid) return;
    if (!list || list.length === 0) {
      communityGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:32px 16px; color:#64748b;">No hay propuestas bajo esta categoría aún.</div>';
      return;
    }
    var html = '';
    list.forEach(function (d) {
      html += renderCommunityCard(d);
    });
    communityGrid.innerHTML = html;
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  function initCommunityFilters() {
    var filterContainer = document.getElementById('sug-comm-filters');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.sug-comm-filter-btn');
      if (!btn) return;

      filterContainer.querySelectorAll('.sug-comm-filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');

      var cat = btn.getAttribute('data-cat') || 'all';
      filterCommunityByCategory(cat);
    });
  }

  function filterCommunityByCategory(category) {
    var baseList = (loadedCommunityIdeas && loadedCommunityIdeas.length > 0) ? loadedCommunityIdeas : canonicalSuggestionsList;
    if (category === 'all') {
      renderCommunityCards(baseList);
      return;
    }
    var filtered = baseList.filter(function (item) {
      if (category === 'web_ux') {
        return item.category === 'web_platform' || item.category === 'web_ux';
      }
      if (category === 'customer_service') {
        return item.category === 'customer_service' || item.category === 'services_support';
      }
      return item.category === category;
    });
    renderCommunityCards(filtered);
  }

  function renderCommunityCard(d) {
    var catName = getCategoryName(d.category);
    var badgeHtml = getStatusBadge(d.status);
    var responseText = d.officialResponse ? escapeHtml(d.officialResponse) : 'Propuesta evaluada positivamente y en camino para nuestros usuarios.';
    return '<div class="sug-comm-card" data-cat="' + escapeHtml(d.category || '') + '">' +
      '<div>' +
        '<div class="sug-comm-top">' +
          '<span style="font-size:0.75rem; font-weight:700; color:var(--sug-primary); text-transform:uppercase;">' + escapeHtml(catName) + '</span>' +
          badgeHtml +
        '</div>' +
        '<h4 class="sug-comm-title">' + escapeHtml(d.title) + '</h4>' +
        '<p class="sug-comm-desc">' + escapeHtml(d.description) + '</p>' +
      '</div>' +
      '<div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:10px 12px; border-radius:6px; font-size:0.82rem; color:#334155; margin-top:12px;">' +
        '<strong style="color:var(--sug-primary); display:block; margin-bottom:2px;">Respuesta Futunet:</strong>' +
        responseText +
      '</div>' +
    '</div>';
  }

  function renderFallbackCommunityWall() {
    loadedCommunityIdeas = canonicalSuggestionsList;
    renderCommunityCards(canonicalSuggestionsList);
  }

})();
