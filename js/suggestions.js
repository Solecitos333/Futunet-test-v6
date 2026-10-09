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

  // Referencias a elementos DOM (se vinculan defensivamente en bindDOMElements)
  var form, categoryCards, audienceBtns, starBtns, ratingText, anonCheckbox,
      contactFields, submitBtn, alertBox, formCard, successCard, refCodeDisplay,
      copyCodeBtn, btnAnother, trackInput, trackBtn, trackResult, communityGrid;

  function bindDOMElements() {
    if (typeof document === 'undefined') return;
    form = document.getElementById('sug-form');
    categoryCards = document.querySelectorAll('.sug-category-card');
    audienceBtns = document.querySelectorAll('.sug-audience-btn');
    starBtns = document.querySelectorAll('.sug-star-btn');
    ratingText = document.getElementById('sug-rating-text');
    anonCheckbox = document.getElementById('sug-anon-checkbox');
    contactFields = document.getElementById('sug-contact-fields');
    submitBtn = document.getElementById('sug-submit-btn');
    alertBox = document.getElementById('sug-alert');
    formCard = document.getElementById('sug-form-card');
    successCard = document.getElementById('sug-success-card');
    refCodeDisplay = document.getElementById('sug-ref-code');
    copyCodeBtn = document.getElementById('sug-copy-code-btn');
    btnAnother = document.getElementById('sug-btn-another');
    trackInput = document.getElementById('sug-track-input');
    trackBtn = document.getElementById('sug-track-btn');
    trackResult = document.getElementById('sug-track-result');
    communityGrid = document.getElementById('sug-community-grid');
  }

  function initSuggestionsApp() {
    bindDOMElements();
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
  }

  // Inicialización cuando el DOM esté listo (resiliente a carga diferida o async)
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSuggestionsApp);
    } else {
      initSuggestionsApp();
    }
  }

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
    var lastSub = null;
    try {
      lastSub = sessionStorage.getItem(cooldownKey);
    } catch (e) {}
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
      try {
        sessionStorage.setItem(cooldownKey, String(Date.now()));
      } catch (e) {}

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
      trackInput.addEventListener('keydown', function (e) {
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

    // 1. Verificación Honeypot (Trampa antispam para bots)
    var trackHp = document.getElementById('sug-track-hp-check');
    if (trackHp && trackHp.value.trim() !== '') {
      console.warn('Bot tracking query blocked via honeypot.');
      trackResult.hidden = false;
      trackResult.innerHTML = '<p style="color:#ef4444; margin:0; font-size:0.9rem;">Consulta no válida.</p>';
      return;
    }

    // Cooldown de consulta de seguimiento (Rate-limiting en cliente 3s contra flooding)
    var trackCooldownKey = 'futunet_last_sug_track_ts';
    var nowTs = Date.now();
    var lastTrack = null;
    try {
      lastTrack = sessionStorage.getItem(trackCooldownKey);
    } catch (e) {}
    if (lastTrack && (nowTs - Number(lastTrack)) < 3000) {
      var waitSecs = Math.ceil((3000 - (nowTs - Number(lastTrack))) / 1000);
      trackResult.hidden = false;
      trackResult.innerHTML = '<p style="color:#64748b; margin:0; font-size:0.9rem;">Por favor espera ' + waitSecs + ' segundo(s) antes de realizar otra consulta.</p>';
      return;
    }

    var raw = trackInput.value
      .replace(/<[^>]*>/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();

    if (!raw) {
      trackResult.hidden = false;
      trackResult.innerHTML = '<p style="color:#b91c1c; margin:0; font-size:0.9rem;">Por favor escribe tu código de referencia (ej: SUG-A1B2C).</p>';
      return;
    }

    try {
      sessionStorage.setItem(trackCooldownKey, String(Date.now()));
    } catch (e) {}

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
    },
    {
      refCode: 'SUG-L5330',
      title: 'Disponibilidad de Laptop ejecutiva Dell Latitude 5330 Intel Core i7 (12.ª Gen) de 13.3 pulgadas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Laptops ejecutivas ultraligeras Dell Latitude 5330 con procesador Intel Core i7 de 12.ª generación, 16 GB de RAM y SSD NVMe de 256 GB para directivos y trabajo móvil.',
      officialResponse: '¡Implementado! Ya se encuentra disponible la Laptop Dell Latitude 5330 Core i7 (12.ª Gen) con 16 GB RAM, 256 GB SSD y pantalla Full HD de 13.3 pulgadas lista para entrega inmediata.'
    },
    {
      refCode: 'SUG-S4120',
      title: 'Disponibilidad y cotización de suministros de oficina, papelería corporativa y equipamiento integral',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Línea de papelería corporativa, carpetas, resmas, grapadoras, cintas y suministros de oficina con cotización formal B2B y comprobante fiscal NCF.',
      officialResponse: '¡Atendido! Habilitada la sección completa de Papelería y Suministros en el catálogo y en la subpágina especializada de Mobiliario y Suministros con facturación corporativa.'
    },
    {
      refCode: 'SUG-P9240',
      title: 'Disponibilidad de proyectores Epson PowerLite 3,400 lúmenes y pantallas retráctiles para salas de juntas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Proyectores multimedia Epson de alta luminosidad (3,400+ lúmenes) con HDMI y pantallas de proyección retráctiles de 100 pulgadas para conferencias y educación con garantía local.',
      officialResponse: '¡Cumplido! Se incorporaron al catálogo corporativo el proyector Epson PowerLite E20 3LCD de 3,400 lúmenes y la Pantalla de Proyección Retráctil de 100" con trípode y soporte mural para salas de juntas.'
    },
    {
      refCode: 'SUG-R7520',
      title: 'Disponibilidad de switches empresariales Cisco y puntos de acceso Ubiquiti UniFi para redes y telecomunicaciones',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Switches Gigabit Cisco Business (16 y 24 puertos PoE+) y puntos de acceso Ubiquiti UniFi 6 Plus (U6+) para infraestructura de red, cableado y WiFi empresarial.',
      officialResponse: '¡Implementado! Integrados al catálogo los switches Gigabit Cisco Business CBS110/CBS250 PoE+ y puntos de acceso Ubiquiti UniFi 6 Plus con entrega y soporte oficial en Santiago.'
    },
    {
      refCode: 'SUG-N3210',
      title: 'Canal interactivo para selección de fecha y franja horaria en solicitudes de instalación y servicio técnico',
      category: 'services_support',
      status: 'implemented',
      description: 'Herramienta en línea para elegir fecha preferida y franja horaria (mañana/tarde) al solicitar instalación de internet fibra óptica o cableado estructurado.',
      officialResponse: '¡Atendido! Activado el selector de horario y fecha preferida para agendamiento de visitas técnicas en los portales de Internet y Servicios Corporativos con confirmación inmediata por WhatsApp.'
    },
    {
      refCode: 'SUG-S8320',
      title: 'Disponibilidad de Sillas Ergonómicas Ejecutivas de Oficina con soporte lumbar y brazos ajustables',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sillas ergonómicas de oficina de gama ejecutiva con malla transpirable, soporte lumbar ajustable y pistón de gas para jornadas laborales continuas.',
      officialResponse: '¡Implementado! Incorporamos al catálogo de Mobiliario la Silla Ergonómica Ejecutiva Futunet con soporte lumbar regulable y la Silla de Malla Operativa listas para entrega corporativa en Santiago.'
    },
    {
      refCode: 'SUG-U6140',
      title: 'Disponibilidad de Sistemas UPS y No-Break Forza para protección de computadoras y servidores',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sistemas UPS interactivos y No-Break de marcas líderes como Forza y Hikvision para proteger equipos de cómputo y servidores ante apagones y variaciones de voltaje.',
      officialResponse: '¡Cumplido! Se integraron al catálogo el UPS Interactivo Forza NT-1002 de 1000VA / 500W con regulación AVR y los sistemas UPS Hikvision con garantía oficial de Futunet.'
    },
    {
      refCode: 'SUG-C2850',
      title: 'Buscador interactivo y contador de ideas implementadas en el Muro Comunitario del Buzón',
      category: 'web_platform',
      status: 'implemented',
      description: 'Indicadores visuales de conteo por categoría y filtros dinámicos en el Muro Comunitario para consultar fácilmente cuántas propuestas han sido resueltas.',
      officialResponse: '¡Implementado! Ya se encuentran activas las insignias dinámicas de conteo en cada botón de categoría del muro comunitario con el total de propuestas atendidas.'
    },
    {
      refCode: 'SUG-P8210',
      title: 'Disponibilidad de Lectores de Códigos de Barra 1D/2D y Gavetas de Dinero para Puntos de Venta (POS)',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Equipamiento de punto de venta (POS): lector omnidireccional USB manos libres con lectura en pantallas y gaveta monedero metálica con solenoide RJ11.',
      officialResponse: '¡Implementado! Incorporamos el Lector de Códigos de Barra 1D/2D con soporte automático y la Gaveta de Dinero Metálica RJ11 con garantía oficial.'
    },
    {
      refCode: 'SUG-D4910',
      title: 'Cámaras de seguridad Dahua HDCVI 1080p y grabadores DVR XVR Cooper en el catálogo de seguridad',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cámaras de videovigilancia Dahua bala IP67 exterior y domo interior con visión nocturna Smart IR, y grabadores XVR Cooper 1080N con app móvil DMSS.',
      officialResponse: '¡Atendido! Se integraron al catálogo las cámaras Dahua Domo y Bala 1080p y el grabador XVR Cooper de 4 canales con monitoreo remoto en la app DMSS.'
    },
    {
      refCode: 'SUG-K9530',
      title: 'Optimización del buscador del catálogo con soporte a términos como escáner, cajón de dinero y bobinas de red',
      category: 'web_platform',
      status: 'implemented',
      description: 'Stemming semántico en el motor de búsqueda para sinónimos frecuentes: scanner y escaner (lectores), cajon y monedero (gavetas), y bobinas (cableado UTP).',
      officialResponse: '¡Implementado! El motor de búsqueda en catalog.js ahora reconoce sinónimos como scanner, cajón de dinero y bobina garantizando resultados certeros.'
    },
    {
      refCode: 'SUG-Z5180',
      title: 'Disponibilidad de terminales biométricas ZKTeco para control de asistencia y acceso con reloj ponchador',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Terminales ZKTeco MB20 de huella digital, reconocimiento facial y tarjeta RFID para control de asistencia con exportación a Excel y apertura de puertas.',
      officialResponse: '¡Cumplido! Se integró la Terminal Biométrica ZKTeco MB20 con función de Reloj Ponchador a USB en Excel, relevador para cerradura magnética y garantía local.'
    },
    {
      refCode: 'SUG-W3250',
      title: 'Disponibilidad de discos duros Western Digital Purple (WD Purple) para videovigilancia y grabadores DVR/NVR',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Discos duros de 2TB WD Purple SATA III con tecnología AllFrame para trabajo continuo 24/7 en grabadores de seguridad CCTV Dahua y Hikvision.',
      officialResponse: '¡Implementado! Disponibles en catálogo y seguridad electrónica los discos Western Digital WD Purple 2TB con tecnología AllFrame y 3 años de garantía oficial.'
    },
    {
      refCode: 'SUG-R6090',
      title: 'Gabinetes de pared (Wall Mount) y racks de 9U con cerradura para protección de switches y equipos de red',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Gabinetes metálicos de pared estándar 19" de 9U con puerta de cristal templado, cerradura con llave y ventilación para proteger switches y DVRs.',
      officialResponse: '¡Atendido! Se integró el Gabinete Rack de Pared 9U 600x450mm con cerradura y paneles desmontables, y se optimizó la búsqueda para rack y gabinetes de red.'
    },
    {
      refCode: 'SUG-C600M',
      title: 'Disponibilidad de cerraduras electromagnéticas (electroimán 600 lbs) con soporte ZL y botón liberador No Touch para control de accesos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cerraduras magnéticas de 600 lbs con kit de soporte ZL y pulsadores de salida infrarrojos sin contacto para control de puertas.',
      officialResponse: '¡Implementado! Disponibles en catálogo la Cerradura Electromagnética 600 lbs ZKTeco con soporte ZL y el Botón Pulsador No Touch de acero inoxidable.'
    },
    {
      refCode: 'SUG-B305C',
      title: 'Disponibilidad de bobinas de cable de red UTP Cat 6 (305 metros / 1000 ft) 100% cobre para cableado estructurado y CCTV',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Bobinas de cable de red UTP Categoría 6 de 305 metros 100% cobre puro de 23 AWG para enlaces de datos Gigabit y cámaras IP PoE.',
      officialResponse: '¡Atendido! Incorporada al catálogo la Bobina de Cable UTP Cat 6 (305m / 1000 ft) 100% Cobre Puro con certificación PoE+ y entrega inmediata.'
    },
    {
      refCode: 'SUG-T8260',
      title: 'Disponibilidad de Sistemas Wi-Fi 6 Mesh TP-Link Deco y Enlaces Omada para cobertura total en hogares y oficinas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sistemas Wi-Fi 6 en malla (Mesh) TP-Link Deco X20 para eliminar puntos ciegos de señal en residencias y oficinas con roaming fluido.',
      officialResponse: '¡Cumplido! Ya se encuentra disponible el Sistema TP-Link Deco X20 Wi-Fi 6 Mesh AX1800 (Pack de 2) con filtro rápido de marca TP-Link en catálogo.'
    },
    {
      refCode: 'SUG-P2400',
      title: 'Disponibilidad de Patch Panels de 24 Puertos Cat 6 para Racks de 19" y Patch Cords Certificados Gigabit',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Patch panels de 24 puertos Cat 6 estándar 1U para montaje en rack y patch cords UTP de 2 metros 100% cobre para interconectar switches y cableado estructurado.',
      officialResponse: '¡Atendido! Incorporados al catálogo el Patch Panel Cat 6 24 Puertos 1U para Rack 19" y los Patch Cords UTP Cat 6 de 2m con entrega inmediata en Santiago.'
    },
    {
      refCode: 'SUG-A1200',
      title: 'Optimización de búsqueda para Puntos de Acceso Wi-Fi y disponibilidad de Access Points Ubiquiti UniFi y TP-Link Omada',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Soporte de búsqueda y stemming bilingüe para access point, ap, punto de acceso y soluciones inalámbricas corporativas UniFi 6.',
      officialResponse: '¡Implementado! El motor de búsqueda ahora reconoce access point, ap y punto de acceso destacando el Ubiquiti UniFi 6 Plus con fichas técnicas completas.'
    },
    {
      refCode: 'SUG-C4500',
      title: 'Disponibilidad de Conectores RJ45 Cat 6 con Botas Protectoras y Conectores Modulares para Redes y CCTV',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Packs de 100 conectores RJ45 Cat 6 con pines chapados en oro y botas protectoras de goma para terminación de bobinas de cable de red.',
      officialResponse: '¡Cumplido! Ya está disponible en el catálogo el Pack de 100 Conectores RJ45 Cat 6 con botas protectoras y búsqueda optimizada por plug y terminales.'
    },
    {
      refCode: 'SUG-T3040',
      title: 'Disponibilidad de Kit de Herramientas de Red: Crimpadora RJ45 Multifunción con Pelacables y Tester de Cable de Red RJ45/RJ11',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Kit profesional de herramientas de red con tenaza crimpadora 3 en 1 para RJ45/RJ11 y tester de red maestro y remoto con LED secuencial.',
      officialResponse: '¡Atendido! Se integró el Kit de Crimpadora RJ45/RJ11 y Tester de Red maestro/remoto con LEDs numerados y pelacables para entrega inmediata.'
    },
    {
      refCode: 'SUG-E3600',
      title: 'Disponibilidad de Cámaras Wi-Fi de Seguridad Ezviz (C6N 1080p 360° Pan & Tilt y H3c Exterior) con Almacenamiento en MicroSD y App Móvil',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cámaras de seguridad inalámbricas Ezviz C6N 360° motorizada para interior y Ezviz H3c IP67 para exterior con detección IA y control móvil.',
      officialResponse: '¡Cumplido! Ya se encuentran disponibles en catálogo y en marca-ezviz.html las cámaras Wi-Fi Ezviz C6N y H3c con MicroSD y gestión en app.'
    },
    {
      refCode: 'SUG-B9100',
      title: 'Optimización de Búsqueda para Terminales Biométricas y Desacoplamiento de Cerraduras Electromagnéticas',
      category: 'web_platform',
      status: 'implemented',
      description: 'Priorización destacada de la Terminal Biométrica ZKTeco MB20 (reloj ponchador con lectura facial y huella) sobre accesorios de herraje en búsquedas biométricas.',
      officialResponse: '¡Implementado! El motor de búsqueda clasifica la Terminal Biométrica ZKTeco MB20 y terminales Hikvision en el puesto #1 indiscutible al buscar biométrico.'
    },
    {
      refCode: 'SUG-M750G',
      title: 'Disponibilidad de Routers MikroTik hEX RB750Gr3 Gigabit para balanceo de carga Multi-WAN y gestión de redes',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Routers balanceadores MikroTik hEX (RB750Gr3) de 5 puertos Gigabit con RouterOS L4 para redundancia de fibra óptica, balanceo PCC y VPN.',
      officialResponse: '¡Atendido! Se integró al catálogo y a marca-mikrotik.html el Router MikroTik hEX RB750Gr3 con 5 puertos Gigabit y RouterOS L4 con garantía y NCF.'
    },
    {
      refCode: 'SUG-L2700',
      title: 'Disponibilidad de Combo Teclado y Mouse Inalámbrico Logitech MK270 para oficinas y puestos de trabajo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Combo inalámbrico Logitech MK270 con teclado en español y mouse óptico con un solo receptor USB Nano para puestos corporativos y de oficina.',
      officialResponse: '¡Cumplido! Ya está disponible en catálogo y en marca-logitech.html el Combo Inalámbrico Logitech MK270 con hasta 36 meses de batería y factura fiscal.'
    },
    {
      refCode: 'SUG-W9200',
      title: 'Disponibilidad de Cámara Web Logitech C920 HD Pro 1080p con micrófono estéreo para videoconferencias y teletrabajo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cámara web profesional Logitech C920 Full HD 1080p con lentes de cristal, enfoque automático y micrófonos estéreo duales para videollamadas corporativas.',
      officialResponse: '¡Implementado! Incorporada al catálogo y a marca-logitech.html la Cámara Web Logitech C920 HD Pro con RightLight 2 y 1 año de garantía oficial Futunet.'
    },
    {
      refCode: 'SUG-T1400',
      title: 'Disponibilidad de Laptops Corporativas Lenovo ThinkPad L14 Core i5 con 16 GB RAM y SSD NVMe para Oficinas y Empresas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Laptops empresariales de alta durabilidad Lenovo ThinkPad con chasis militar MIL-STD-810H, Intel Core i5, 16 GB RAM, SSD NVMe y teclado ergonómico resistente a salpicaduras con TrackPoint.',
      officialResponse: '¡Cumplido! Ya se encuentra disponible en catálogo y en marca-lenovo.html la Laptop Corporativa Lenovo ThinkPad L14 (14" FHD IPS, Core i5, 16GB RAM, 256GB SSD) con garantía y comprobante fiscal NCF.'
    },
    {
      refCode: 'SUG-N308G',
      title: 'Disponibilidad de Switches Gigabit Netgear GS308 de 8 Puertos Metálicos No Administrables para Redes y Pymes',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Switches Gigabit Ethernet Netgear GS308 de 8 puertos metálicos no administrables con diseño Fanless silencioso y Plug & Play para oficinas y comercios.',
      officialResponse: '¡Implementado! Se incorporó al catálogo de Redes y a marca-netgear.html el Switch Netgear GS308 Gigabit de 8 puertos con carcasa de acero y arquitectura sin bloqueo de 16 Gbps.'
    },
    {
      refCode: 'SUG-S1000',
      title: 'Disponibilidad de Sistemas UPS APC Easy UPS BV1000I-MS 1000VA / 600W (Schneider Electric) con Regulación Automática AVR',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sistemas de alimentación ininterrumpida UPS APC by Schneider Electric de 1000VA / 600W con regulación automática AVR y 4 tomas universales protegidas contra apagones y sobretensiones.',
      officialResponse: '¡Atendido! Incorporamos al catálogo de Energía y a marca-schneiderelectric.html el Sistema UPS APC Easy UPS BV1000I-MS 1000VA / 600W (Schneider Electric) con regulación AVR y 2 años de garantía oficial.'
    },
    {
      refCode: 'SUG-L8400',
      title: 'Disponibilidad de Routers Wi-Fi 6 Linksys Hydra Pro 6 (AX5400) y Soluciones de Red Mesh para Residencias y Empresas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En casas de gran metraje, oficinas de arquitectura y comercios en Santiago requerimos routers Wi-Fi 6 Linksys Hydra Pro 6 (AX5400) con canales de 160 MHz, tecnología Mesh Intelligent y puertos Gigabit para aprovechar al máximo las conexiones de fibra óptica de alta velocidad de Futunet.',
      officialResponse: '¡Implementado! Ya incorporamos al catálogo de Redes y a marca-linksys.html el Router Wi-Fi 6 Linksys Hydra Pro 6 AX5400 con canales de 160 MHz, Intelligent Mesh y 2 años de garantía oficial.'
    },
    {
      refCode: 'SUG-V2400',
      title: 'Disponibilidad de Inversores/Cargadores Solares Victron Energy MultiPlus y Controladores MPPT para Sistemas de Energía y Respaldo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Inversores/cargadores de onda senoidal pura Victron Energy MultiPlus (24V / 3000VA / 70A) con conmutación ultrarrápida UPS de menos de 20 ms y controladores de carga solar SmartSolar MPPT para respaldo crítico y energía solar.',
      officialResponse: '¡Atendido! Incorporamos al catálogo de Energía y a marca-victronenergy.html el Inversor/Cargador Victron Energy MultiPlus 24/3000/70 senoidal puro con función UPS y controladores MPPT con 5 años de garantía.'
    },
    {
      refCode: 'SUG-P5800',
      title: 'Disponibilidad de Kits de Alarma Contra Intrusión Paradox Spectra con Sensores de Movimiento Infrarrojos PIR y Teclado LCD',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sistemas de alarma perimetral cableada e inalámbrica Paradox Spectra SP4000 con teclado LCD Paradox K32+, sensores de movimiento infrarrojos digitales antimascota Paradox NV5 y sirena de alta potencia de 30W para comercios y residencias.',
      officialResponse: '¡Cumplido! Se integró al catálogo de Seguridad y a marca-paradox.html el Kit de Alarma Paradox Spectra SP4000 con teclado LCD K32+, sensor PIR antimascota NV5, batería de respaldo y sirena de 30W.'
    },
    {
      refCode: 'SUG-P1300',
      title: 'Disponibilidad de Teléfonos IP Panasonic KX-HDV130B y Centrales PBX para Comunicación y Telefonía Corporativa',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En consultorios médicos, bufetes de abogados y empresas en Santiago requerimos teléfonos IP Panasonic KX-HDV130B de 2 líneas SIP con audio HD de banda ancha, pantalla LCD gráfica retroiluminada de 2.3", doble puerto Ethernet con PoE y altavoz manos libres full dúplex para recepciones y puestos de trabajo.',
      officialResponse: '¡Implementado! Ya incorporamos al catálogo de Equipos de Oficina y a marca-panasonic.html el Teléfono IP Panasonic KX-HDV130B de 2 líneas SIP con audio HD, pantalla LCD de 2.3", soporte PoE y 1 año de garantía oficial Futunet con NCF.'
    },
    {
      refCode: 'SUG-M1800',
      title: 'Disponibilidad de Aires Acondicionados Mini-Split Inverter Mitsubishi Electric de 18,000 BTU de Ultra Alta Eficiencia para Servidores y Oficinas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para salas de servidores (Data Centers), cuartos de telecomunicaciones, despachos gerenciales y residencias premium en Santiago requerimos unidades de aire acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL de 18,000 BTU con eficiencia de hasta 24.6 SEER, compresor Inverter PAM y operación ultra silenciosa Whisper Quiet de 19 dB.',
      officialResponse: '¡Cumplido! Se integró al catálogo de Energía y Climatización y a marca-mitsubishi.html el Aire Acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 18,000 BTU con hasta 24.6 SEER, modo silencioso Whisper Quiet de 19 dB y 5 años de garantía en compresor.'
    },
    {
      refCode: 'SUG-J2300',
      title: 'Disponibilidad de Switches Empresariales Juniper Networks EX2300-24P Gigabit PoE+ para Redes Corporativas y Telecomunicaciones',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En proyectos de zonas francas, banca, instituciones educativas y data centers en Santiago requerimos switches de grado carrier Juniper Networks EX2300-24P de 24 puertos Gigabit Ethernet PoE+ con presupuesto de 370W, 4 puertos uplink SFP+ de 10 GbE y sistema operativo Junos OS con tecnología Virtual Chassis.',
      officialResponse: '¡Atendido! Incorporamos al catálogo de Redes y a marca-juniper.html el Switch Empresarial Juniper Networks EX2300-24P Gigabit PoE+ (24 puertos PoE+ 370W y 4 uplinks 10GbE SFP+) con Junos OS, Virtual Chassis y garantía con soporte técnico en Santiago.'
    },
    {
      refCode: 'SUG-S3100',
      title: 'Disponibilidad de Interruptores Termomagnéticos Industriales Siemens Sentron 3P 100A para Protección de Tableros Eléctricos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En instalaciones eléctricas industriales, naves comerciales de zonas francas y data centers en Santiago requerimos interruptores termomagnéticos en caja moldeada Siemens Sentron de 3 polos y 100 Amperios con capacidad de interrupción de cortocircuito de hasta 25 kA para protección de acometidas y tableros principales.',
      officialResponse: '¡Cumplido! Se incorporó al catálogo de Energía y a marca-siemens.html el Interruptor Termomagnético Industrial Siemens Sentron Tripolar 100A (3P, 25 kA a 415V/480V) con mecanismo térmico-magnético calibrado y 2 años de garantía oficial Siemens.'
    },
    {
      refCode: 'SUG-T1350',
      title: 'Disponibilidad de Sistemas de Almacenamiento Energético y Baterías de Respaldo Solar Tesla Powerwall 2 (13.5 kWh)',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para proyectos solares fotovoltaicos, residencias de alto nivel y oficinas corporativas en Santiago requerimos sistemas de respaldo y almacenamiento de energía Tesla Powerwall 2 de 13.5 kWh con inversor acoplado y Backup Gateway 2 para suministro ininterrumpido ante apagones.',
      officialResponse: '¡Implementado! Ya se encuentra en el catálogo de Energía y en marca-tesla.html el Sistema de Batería de Respaldo Tesla Powerwall 2 (13.5 kWh utilizables, 5 kW continuos) con Tesla Backup Gateway 2 para conmutación instantánea y 10 años de garantía oficial.'
    },
    {
      refCode: 'SUG-D1500',
      title: 'Disponibilidad de Servidores en Torre Dell PowerEdge T150 con Intel Xeon y Arreglos RAID para Pymes y Centros de Cómputo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En consultorios clínicos, cooperativas, empresas de manufactura en zonas francas y firmas corporativas en Santiago requerimos servidores empresariales en torre Dell PowerEdge T150 con procesador Intel Xeon E-2300, 32 GB de memoria RAM ECC, controladora RAID PERC y discos empresariales redundantes para bases de datos SQL y ERP.',
      officialResponse: '¡Hola Ing. Alberto! Ya incorporamos al catálogo corporativo de Equipos de Oficina y a marca-dell.html el Servidor en Torre Dell PowerEdge T150 (Xeon E-2314 Quad-Core, 32 GB RAM DDR4 ECC, 2x 2 TB RAID 1, PERC H355 e iDRAC9 Basic) con 3 años de garantía ProSupport.'
    },
    {
      refCode: 'SUG-O6100',
      title: 'Disponibilidad de Terminales Ópticas ONT / ONU GPON Wi-Fi 6 de Doble Banda para Conexiones de Fibra Óptica FTTH y Redes GPON',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para proyectos de condominios, residenciales con infraestructura GPON y clientes de internet fibra óptica de alta velocidad de Futunet, requerimos terminales ópticas ONU/ONT GPON Wi-Fi 6 AX1800 de doble banda (2.4 GHz y 5 GHz) con 4 puertos Gigabit LAN, SC/APC y FXS VoIP.',
      officialResponse: '¡Saludos Ing. Miguel Ángel! Incorporamos al catálogo de Redes y Telecomunicaciones y a marca-tp-link.html la Terminal Óptica ONT GPON Wi-Fi 6 AX1800 (puerto SC/APC, 4x GbE LAN, Wi-Fi 6 doble banda y FXS VoIP) compatible con las redes FTTH de Futunet.'
    },
    {
      refCode: 'SUG-C4000',
      title: 'Disponibilidad de Cámaras de Seguridad Autónomas con Panel Solar y Conectividad Móvil 4G LTE para Fincas, Obras y Almacenes',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En proyectos de construcción de naves, fincas agrícolas y quintas en las afueras de Santiago donde no llega tendido eléctrico ni internet por cable, requerimos cámaras de seguridad inalámbricas con panel solar integrado, batería de litio recargable, módem 4G LTE y sensor PIR.',
      officialResponse: '¡Hola Lic. José Manuel! Ya incorporamos al catálogo de Seguridad y a marca-hikvision.html la Cámara de Seguridad Solar 4G LTE 1080p con Panel Solar Integrado, Batería de Litio Recargable, sensor PIR inteligente, visión nocturna a color y protección IP66 con garantía oficial.'
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
        .limit(50)
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
      updateCommunityFilterCounts(loadedCommunityIdeas);
      renderCommunityCards(loadedCommunityIdeas);
    } catch (e) {
      renderFallbackCommunityWall();
    }
  }

  function updateCommunityFilterCounts(list) {
    if (!list) return;
    var countAll = document.getElementById('sug-count-all');
    var countProducts = document.getElementById('sug-count-products');
    var countWeb = document.getElementById('sug-count-web');
    var countServices = document.getElementById('sug-count-services');

    var total = list.length;
    var products = list.filter(function (item) { return item.category === 'catalog_products'; }).length;
    var web = list.filter(function (item) { return item.category === 'web_platform' || item.category === 'web_ux'; }).length;
    var services = list.filter(function (item) { return item.category === 'customer_service' || item.category === 'services_support'; }).length;

    if (countAll) countAll.textContent = total;
    if (countProducts) countProducts.textContent = products;
    if (countWeb) countWeb.textContent = web;
    if (countServices) countServices.textContent = services;
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
    updateCommunityFilterCounts(canonicalSuggestionsList);
    renderCommunityCards(canonicalSuggestionsList);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      canonicalSuggestionsList: canonicalSuggestionsList
    };
  }

})();
