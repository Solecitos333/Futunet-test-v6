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
        categoryCards.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('is-active');
        card.setAttribute('aria-checked', 'true');
        selectedCategory = card.getAttribute('data-cat') || 'web_platform';
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // 2. Selector de Perfil / Audiencia (Cliente vs Colaborador)
  function initAudienceSelector() {
    audienceBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        audienceBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-checked', 'true');
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

    var normalizedRaw = raw.replace(/^SUG[\s_]?/i, 'SUG-');
    var match = normalizedRaw.match(/SUG-[A-Z0-9]{5}/i);
    var code = match ? match[0].toUpperCase() : normalizedRaw.toUpperCase();
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
    } else if (typeof data.createdAt === 'string' && data.createdAt.length >= 8) {
      var dStr = new Date(data.createdAt);
      if (!isNaN(dStr.getTime())) {
        dateStr = dStr.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
      }
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
      } else if (typeof data.respondedAt === 'string' && data.respondedAt.length >= 8) {
        var dResp = new Date(data.respondedAt);
        if (!isNaN(dResp.getTime())) {
          respDateStr = ' — ' + dResp.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
        }
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
    },
    {
      refCode: 'SUG-S5500',
      title: 'Disponibilidad de Pantallas Comerciales Samsung Crystal UHD 55" 4K para Salas de Juntas, Presentaciones y Cartelería Digital',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En salas de juntas corporativas, centros médicos, firmas de abogados y naves en zonas francas de Santiago requerimos pantallas comerciales Samsung de 55 pulgadas con resolución 4K UHD, procesador Crystal 4K, operación empresarial 16/7 continua, panel antirreflejo, audio estéreo integrado y puertos HDMI para presentaciones y cartelería digital con garantía y comprobante fiscal NCF.',
      officialResponse: '¡Hola Lic. Alejandro! Tu propuesta ha sido implementada exitosamente. Incorporamos al catálogo de Equipos de Oficina y a marca-samsung.html la Pantalla Comercial Samsung Crystal UHD 55" 4K Serie Business (BE55T) con procesador Crystal 4K, HDR10+, operación comercial continua 16/7, 3 puertos HDMI, Wi-Fi integrado, sintonizador digital y montaje estándar VESA, con 3 años de garantía oficial y comprobante fiscal NCF.'
    },
    {
      refCode: 'SUG-U1000',
      title: 'Disponibilidad de Gateways de Red Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra) Multi-WAN Gigabit para Gestión Centralizada UniFi',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para proyectos de cableado estructurado, residencias de alto nivel y oficinas en Santiago requerimos el gateway de red Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra) con capacidad de enrutamiento de 1 Gbps con IDS/IPS activo, puerto WAN 2.5 GbE con balanceo y failover Multi-WAN, 4 puertos Gigabit LAN, pantalla LCM frontal y consola UniFi Network integrada sin licencias ni costes mensuales.',
      officialResponse: '¡Saludos Ing. Franklin! Nos complace informarte que tu sugerencia ha sido implementada. Ya se encuentra disponible en el catálogo de Redes y Telecomunicaciones y en marca-ubiquiti.html el Gateway de Red Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra), con puerto WAN 2.5 GbE, Multi-WAN con balanceo/failover, 4 puertos Gigabit LAN, inspección profunda IDS/IPS de 1 Gbps, pantalla LCM de 0.96" y gestión en la nube UniFi Network sin cuotas de suscripción.'
    },
    {
      refCode: 'SUG-N3010',
      title: 'Disponibilidad de Grabadores NVR Uniview Ultra HD 4K de 8 Canales con 8 Puertos PoE Integrados para Videovigilancia IP',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En instalaciones de videovigilancia IP para naves industriales, plazas comerciales y residenciales en Santiago requerimos grabadores NVR Uniview NVR301-08S3-P8 de 8 canales con switch PoE de 8 puertos independientes integrados Plug & Play, soporte para cámaras IP hasta 8 MP (4K), salida HDMI 4K, compresión Ultra 265 para optimización de ancho de banda y almacenamiento, y monitoreo móvil en la app EZView.',
      officialResponse: '¡Hola Ing. Wilfredo! Tu sugerencia ha sido atendida e implementada. Hemos integrado al catálogo de Seguridad Electrónica y a marca-uniview.html el Grabador NVR Uniview 4K Ultra HD de 8 Canales con Switch PoE de 8 Puertos Integrados (NVR301-08S3-P8), compatible con cámaras IP de hasta 8 MP (4K), compresión Ultra 265, salida HDMI 4K, bahía SATA para disco duro hasta 6 TB y visualización en tiempo real desde la app EZView con garantía oficial.'
    },
    {
      refCode: 'SUG-H4500',
      title: 'Disponibilidad de Laptops Corporativas HP ProBook 450 G10 Intel Core i7 con 16 GB RAM y 512 GB SSD NVMe para Empresas y Despachos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestra firma de ingeniería y despachos administrativos en Santiago necesitamos adquirir laptops corporativas HP de alta durabilidad serie ProBook 450 G10 con pantalla de 15.6 pulgadas Full HD antirreflejo, procesador Intel Core i7 de 13.ª generación, 16 GB de RAM expandible, 512 GB SSD NVMe y teclado completo en español con bloque numérico para digitación contable y cálculos.',
      officialResponse: '¡Hola Ing. Rafael! Nos complace informarte que tu sugerencia ha sido implementada con éxito. Ya incorporamos al catálogo corporativo de Equipos de Oficina y a la página oficial marca-hp.html la Laptop Corporativa HP ProBook 450 G10 (15.6" FHD IPS, Intel Core i7-1355U, 16 GB RAM DDR4, 512 GB SSD NVMe, teclado numérico completo en español y seguridad HP Wolf Pro Security) con 1 año de garantía oficial Futunet y comprobante fiscal formal NCF.'
    },
    {
      refCode: 'SUG-H4280',
      title: 'Disponibilidad de Impresoras Multifuncionales Láser HP LaserJet Pro MFP M428fdw de Alto Rendimiento para Facturación y Oficinas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En notarías, consultorios médicos y áreas de facturación en Santiago requerimos impresoras láser monocromáticas robustas de alta velocidad como la HP LaserJet Pro MFP M428fdw (con funciones de impresión, escaneo, copia y fax, doble cara automático dúplex, alimentador ADF de 50 hojas, conectividad Ethernet Gigabit, Wi-Fi de doble banda y cartuchos de tóner de alta capacidad HP CF258X) para imprimir contratos y documentos con máxima nitidez y bajo costo por página.',
      officialResponse: '¡Estimada Lic. Mariana! Tu propuesta ha sido atendida e implementada. Hemos integrado al catálogo de Equipos de Oficina y a marca-hp.html la Impresora Multifuncional Láser HP LaserJet Pro MFP M428fdw (impresión a 40 ppm, escaneo dúplex a doble cara en una sola pasada, pantalla táctil a color de 2.7", Wi-Fi de doble banda, Ethernet y bandeja para 350 hojas con tóner de alto rendimiento), con garantía oficial y entrega directa en Santiago.'
    },
    {
      refCode: 'SUG-C3500',
      title: 'Disponibilidad de Switches Administrables Cisco Business CBS350-24T-4G Gigabit con 4 Uplinks SFP y Enrutamiento Estático L3 para Redes Corporativas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En proyectos de cableado estructurado, centros de datos y redes empresariales en Santiago requerimos switches administrables de capa 2/3 Cisco Business CBS350-24T-4G de 24 puertos Gigabit Ethernet con 4 puertos dedicados SFP Gigabit para enlaces troncales de fibra óptica, soporte de enrutamiento estático IPv4/IPv6 de capa 3, VLANs avanzadas 802.1Q, seguridad de puertos 802.1X y gestión intuitiva mediante Cisco Business Dashboard sin costos de licencias.',
      officialResponse: '¡Saludos Ing. Cristian! Tu sugerencia ha sido implementada exitosamente. Ya incorporamos al catálogo de Redes y Telecomunicaciones y a la página oficial marca-cisco.html el Switch Administrable Gigabit Cisco Business CBS350-24T-4G (24 puertos Gigabit Ethernet 10/100/1000, 4 puertos SFP Gigabit dedicados, capacidad de conmutación de 56 Gbps, enrutamiento estático L3, control de acceso ACL, VLANs y administración web/SNMP/Cisco Business Dashboard) con soporte y garantía oficial de Futunet en Santiago.'
    },
    {
      refCode: 'SUG-S3000',
      title: 'Disponibilidad de Sistemas UPS Online de Doble Conversión APC by Schneider Electric Easy UPS SRV 3000VA para Protección de Racks y Servidores Críticos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En salas de servidores, laboratorios clínicos y centros de cómputo en Santiago enfrentamos constantes variaciones de voltaje y microcortes eléctricos que desestabilizan los servidores. Los UPS interactivos convencionales demoran entre 4 y 10 ms en conmutar, lo que puede reiniciar storage o conmutadores sensibles. Requerimos sistemas UPS Online de doble conversión verdadera como el APC by Schneider Electric Easy UPS SRV 2000VA (1600W) o 3000VA (2400W) en formato torre/rack, con onda senoidal pura, cero tiempo de transferencia (0 ms), factor de potencia elevado, pantalla LCD de monitoreo, bypass automático y ranura inteligente para tarjeta de gestión de red SNMP para apagado seguro de servidores Dell PowerEdge.',
      officialResponse: '¡Hola Ing. Carlos! Nos complace comunicarte que tu sugerencia ha sido aprobada e implementada en su totalidad. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-schneiderelectric.html el Sistema UPS Online Doble Conversión APC by Schneider Electric Easy UPS SRV 3000VA / 2400W (tecnología Online Doble Conversión, 0 ms de tiempo de transferencia, salida senoidal pura a 120V, pantalla LCD gráfica multifunción, ranura para tarjeta de gestión de red SNMP, bypass automático y tomas NEMA 5-20R / L5-30R) con 2 años de garantía oficial y soporte técnico especializado de Futunet en Santiago.'
    },
    {
      refCode: 'SUG-M5009',
      title: 'Disponibilidad de Routers de Alto Rendimiento MikroTik RB5009UG+S+IN con Puerto 2.5G y 10G SFP+ para Balanceo de Carga Multi-WAN y Enlaces Redundantes',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras plantas de ensamblaje y logística en el parque industrial requerimos routers de grado industrial con gran potencia de enrutamiento y puertos multi-gigabit como el MikroTik RB5009UG+S+IN (equipado con procesador Quad-Core a 1.4 GHz, 1 GB RAM DDR4, 7 puertos Gigabit Ethernet, 1 puerto 2.5 Gigabit Ethernet y una jaula SFP+ de 10 Gbps para fibra óptica troncal). Actualmente en marca-mikrotik.html solo tienen el modelo básico hEX RB750Gr3, el cual se satura al manejar múltiples túneles VPN WireGuard, reglas complejas de firewall y balanceo de carga Multi-WAN simultáneo.',
      officialResponse: '¡Saludos cordiales Ing. Manuel! Tu solicitud ha sido acogida e implementada de inmediato. Hemos agregado al catálogo de Redes de Datos y a marca-mikrotik.html el Router de Alto Rendimiento MikroTik RB5009UG+S+IN (CPU Marvell Armada Quad-Core 1.4 GHz, 1 GB RAM DDR4, 7 puertos Gigabit 10/100/1000, 1 puerto 2.5 GbE, 1 jaula 10G SFP+, sistema operativo RouterOS v7 nivel 5 y chasis de aluminio disipador de calor para montaje en rack) con garantía oficial y asistencia de configuración de failover de Futunet en Santiago.'
    },
    {
      refCode: 'SUG-L7000',
      title: 'Disponibilidad de Computadoras Corporativas Ultracompactas Lenovo ThinkCentre M70q Tiny Gen 4 Intel Core i5 para Oficinas y Cajas de Cobro',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras sucursales comerciales, farmacias y despachos administrativos en Santiago disponemos de mostradores y escritorios con espacio muy limitado donde no cabe una torre convencional. Requerimos computadoras de formato ultra compacto Lenovo ThinkCentre M70q Tiny Gen 4 (con procesador Intel Core i5 de 13.ª generación, 16 GB de memoria RAM DDR4/DDR5, 512 GB SSD NVMe M.2, conectividad Wi-Fi 6E, Bluetooth, salidas DisplayPort/HDMI para doble monitor y compatibilidad de montaje VESA detrás de la pantalla). En la sección de Lenovo de la web solo figuraba una laptop ThinkPad y requerimos desktops corporativos fijos de alta durabilidad.',
      officialResponse: '¡Hola Licda. Patricia! Tu propuesta ha sido atendida con éxito. Hemos integrado al catálogo de Equipos de Oficina y a la página oficial marca-lenovo.html la Computadora Ultracompacta Corporativa Lenovo ThinkCentre M70q Tiny Gen 4 (procesador Intel Core i5-13400T de 10 núcleos, 16 GB RAM DDR4 expandible a 64 GB, 512 GB SSD NVMe, puertos HDMI, DisplayPort, USB-C, Wi-Fi 6E, teclado y mouse Lenovo USB en español y chasis ultracompacto de 1 litro con certificación militar MIL-STD-810H) con 3 años de garantía oficial y entrega inmediata en Santiago.'
    },
    {
      refCode: 'SUG-U4080',
      title: 'Disponibilidad de Cámaras IP Uniview ColorHunter 4K 8MP PoE con Visión Nocturna a Color 24/7 y Micrófono Integrado para Videovigilancia Comercial',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras naves industriales, almacenes de distribución y plazas comerciales en Santiago requerimos cámaras IP profesionales tipo bullet Uniview ColorHunter 4K Ultra HD de 8 Megapíxeles (con lente de gran apertura F1.0 para visión nocturna a color real 24/7 sin blanco y negro borroso, iluminación cálida de 30 metros, analítica inteligente SIP de clasificación humana/vehicular para evitar falsas alarmas, micrófono integrado para audio ambiental, ranura microSD y protección metálica IP67). Ya cuentan con el excelente NVR Uniview 4K de 8 canales en marca-uniview.html pero requerimos las cámaras ColorHunter 4K PoE compatibles para armar la solución de seguridad completa con garantía local y NCF.',
      officialResponse: '¡Hola Ing. Ramón Emilio! Tu propuesta ha sido evaluada e implementada con éxito. Ya incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-uniview.html la Cámara IP Uniview ColorHunter 4K 8MP PoE (visión nocturna a color real 24/7 con apertura F1.0, micrófono integrado, analítica inteligente SIP de clasificación humana/vehicular, protección metálica IP67 y ranura microSD) plenamente compatible con el NVR Uniview 4K de 8 canales, con garantía oficial y asistencia técnica en Santiago.'
    },
    {
      refCode: 'SUG-N308P',
      title: 'Disponibilidad de Switches Netgear ProSAFE GS308PP Gigabit PoE+ de 8 Puertos con Alta Potencia para Cámaras IP y Puntos de Acceso Wi-Fi',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En consultorios médicos, clínicas dentales y pequeñas oficinas corporativas en Santiago requerimos switches metálicos silenciosos sin ventilador (fanless) Netgear ProSAFE GS308PP de 8 puertos Gigabit Ethernet donde todos los 8 puertos suministren alimentación PoE+ 802.3at con presupuesto de al menos 83 Watts para energizar cámaras de seguridad IP, domos y access points Wi-Fi 6 de techo sin inyectores independientes. En marca-netgear.html solo disponían del switch no PoE básico GS308.',
      officialResponse: '¡Estimado Lic. Fernando! Nos alegra informarte que tu sugerencia ha sido aprobada e implementada. Hemos integrado al catálogo de Redes de Datos y a la página oficial marca-netgear.html el Switch Netgear ProSAFE GS308PP 8 Puertos Gigabit PoE+ (chasis metálico silencioso sin ventilador, 8 puertos Gigabit con soporte PoE+ 802.3at de alta potencia hasta 83W, QoS de hardware y capacidad de 16 Gbps) con 2 años de garantía corporativa y despacho inmediato en Santiago.'
    },
    {
      refCode: 'SUG-V1030',
      title: 'Disponibilidad de Controladores de Carga Solar Victron Energy SmartSolar MPPT 100/30 con Bluetooth Integrado para Sistemas de Respaldo Energético y Energía Solar',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En proyectos de energía solar fotovoltaica residencial y comercial y sistemas de respaldo de telecomunicaciones en Santiago requerimos controladores de carga solar Victron Energy SmartSolar MPPT 100/30 (100V / 30A) con Bluetooth Smart integrado para vincular con la aplicación VictronConnect, algoritmo de recarga inteligente BatteryLife para baterías de litio y ciclo profundo y protección total contra sobretensiones. En marca-victronenergy.html solo contaban con el inversor MultiPlus pero no el controlador MPPT de carga solar.',
      officialResponse: '¡Hola Ing. Carolina! Tu solicitud ha sido atendida e implementada de inmediato. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-victronenergy.html el Controlador de Carga Solar Victron Energy SmartSolar MPPT 100/30 (algoritmo ultra rápido MPPT, 100V / 30A, Bluetooth Smart integrado, gestión inteligente de baterías BatteryLife compatible con Litio y Plomo-Ácido y monitoreo completo mediante app VictronConnect) con 5 años de garantía oficial y soporte técnico de ingeniería en Santiago.'
    },
    {
      refCode: 'SUG-P2300',
      title: 'Disponibilidad de Teléfonos IP Ejecutivos Panasonic KX-HDV230 con 6 Líneas SIP, Pantalla LCD Retroiluminada y Teclas BLF Programables para Recepciones y Gerencia',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras empresas, notarías y oficinas corporativas en Santiago requerimos teléfonos IP de escritorio ejecutivos Panasonic KX-HDV230 con capacidad para 6 líneas SIP simultáneas, doble pantalla LCD gráfica con teclas virtuales de auto-etiquetado BLF (Busy Lamp Field) para supervisar extensiones internas en tiempo real con indicador luminoso y doble puerto Gigabit Ethernet PoE para evitar adaptadores de corriente en cada escritorio. En marca-panasonic.html solo figuraba el modelo básico KX-HDV130 de 2 líneas y requerimos terminales ejecutivas para puestos de operadora y despachos gerenciales.',
      officialResponse: '¡Hola Lic. José Luis! Tu sugerencia ha sido implementada con total éxito. Ya incorporamos al catálogo de Equipos de Oficina y a la página oficial marca-panasonic.html el Teléfono IP Ejecutivo Panasonic KX-HDV230 de 6 líneas SIP con pantalla principal LCD retroiluminada de 2.3", pantalla secundaria con 12 teclas BLF / DSS de auto-etiquetado (hasta 24 funciones en 2 páginas con LED bicolor), audio Sonic HD de banda ancha, doble puerto Gigabit Ethernet con soporte PoE y conector RJ9 para cintillo telefónico, respaldado por 1 año de garantía oficial y factura fiscal NCF en Santiago.'
    },
    {
      refCode: 'SUG-J3000',
      title: 'Disponibilidad de Gateways de Seguridad y Firewalls Empresariales Juniper Networks SRX300 para Protección Perimetral y VPNs Corporativas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras plantas de ensamblaje en el parque industrial de zonas francas (PIVEM), bancos y sedes corporativas en Santiago requerimos gateways de seguridad y firewalls perimetrales de próxima generación Juniper Networks SRX300 de 8 puertos Gigabit (incluyendo 2 puertos combo de fibra óptica SFP) con rendimiento de firewall de hasta 1 Gbps, 250 Mbps de throughput en túneles VPN IPsec de alta seguridad, sistema operativo Junos OS y diseño Fanless sin ventiladores para cuartos de telecomunicaciones. En marca-juniper.html solo figuraba el switch EX2300 pero no la solución de enrutamiento y seguridad perimetral.',
      officialResponse: '¡Saludos cordiales Ing. Rafael! Nos complace informarte que tu requerimiento ha sido acogido e implementado de inmediato. Ya incorporamos al catálogo de Redes y Datos y a la página oficial marca-juniper.html el Firewall y Gateway de Servicios Juniper Networks SRX300 (8 puertos Gigabit Ethernet con 2 puertos combo SFP de fibra óptica, firewall de 1 Gbps, VPN IPsec cifrada AES-256 de 250 Mbps, enrutamiento dinámico Junos OS, seguridad UTM con prevención de intrusiones IPS y chasis metálico Fanless silencioso de grado industrial) con 2 años de garantía corporativa y soporte de ingeniería en Santiago.'
    },
    {
      refCode: 'SUG-S2500',
      title: 'Disponibilidad de Contactores Magnéticos Industriales Siemens Sirius 3RT y Relés de Sobrecarga para Protección y Arranque de Motores Trifásicos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En tableros eléctricos industriales, estaciones de bombeo de agua y cuartos de máquinas en naves comerciales de Santiago requerimos contactores magnéticos trifásicos Siemens Sirius de la serie 3RT (tamaño S0, 25 Amperios / 11 kW / 15 HP a 400V en categoría AC-3) con bobina de control a 110V/120V AC estándar y contactos auxiliares 1NA + 1NC integrados para arranque directo, enclavamiento y mando de motores trifásicos. En marca-siemens.html solo figuraba el interruptor termomagnético en caja moldeada Sentron.',
      officialResponse: '¡Hola Ing. Carlos! Tu propuesta ha sido implementada con éxito. Ya incorporamos al catálogo de Energía y Climatización y a la página oficial marca-siemens.html el Contactor Magnético Industrial Siemens Sirius 3RT2026-1AK60 Trifásico 25A (11 kW a 400V, bobina de 110V/120V AC 50/60 Hz, contactos auxiliares 1NA+1NC integrados, vida útil de más de 10 millones de maniobras mecánicas y montaje universal a presión en riel DIN de 35 mm) con 2 años de garantía oficial Siemens y facturación con comprobante fiscal NCF en Santiago.'
    },
    {
      refCode: 'SUG-T4800',
      title: 'Disponibilidad de Cargadores de Vehículos Eléctricos Tesla Wall Connector Gen 3 (48A / 11.5 kW) con Wi-Fi para Residencias, Negocios y Flotas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para residencias modernas, edificios corporativos, plazas comerciales y flotas de transporte en Santiago requerimos estaciones de carga para vehículos eléctricos (EV) Tesla Wall Connector Gen 3 (capacidad de hasta 48 Amperios / 11.5 kW de potencia en 240V monofásico/bifásico, cable de 24 pies de longitud, conectividad Wi-Fi integrada para actualizaciones de firmware y control de acceso, compartición de energía Power Sharing para hasta 6 unidades en un mismo circuito y monitoreo en tiempo real desde la aplicación móvil Tesla). En marca-tesla.html solo disponían de la batería Powerwall 2 pero no cargadores de pared para vehículos.',
      officialResponse: '¡Hola Ing. Héctor! Tu sugerencia ha sido implementada con total éxito. Ya incorporamos al catálogo de Energía & Climatización y a la página oficial marca-tesla.html el Cargador de Vehículos Eléctricos Tesla Wall Connector Gen 3 (48A / 11.5 kW a 240V, cable de 24 pies, conectividad Wi-Fi, gestión de carga inteligente Power Sharing y monitoreo vía app Tesla) con 4 años de garantía oficial y facturación con comprobante fiscal NCF en Santiago.'
    },
    {
      refCode: 'SUG-M3600',
      title: 'Disponibilidad de Aires Acondicionados Comerciales Tipo Cassette Inverter Mitsubishi Electric PLA-M 36,000 BTU (3 Toneladas) para Falsos Techos en Oficinas y Clínicas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En remodelaciones corporativas, clínicas de diagnóstico, bufetes y salones de conferencia en Santiago con falsos techos requerimos sistemas de climatización comerciales tipo cassette de 4 vías Mitsubishi Electric PLA-M de 36,000 BTU (3 Toneladas) con tecnología Inverter PAM de alta eficiencia (hasta 21 SEER), flujo de aire 3D omnidireccional con sensor 3D i-See Sensor, bomba de condensado de alto levante integrada y control remoto programable silencioso. En marca-mitsubishi.html solo figuraba el mini-split mural MSZ-GL18 pero no unidades de techo para diseño arquitectónico comercial.',
      officialResponse: '¡Saludos cordiales Arq. Nelson! Nos complace comunicarte que tu propuesta ha sido implementada con éxito. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-mitsubishi.html el Aire Acondicionado Comercial Tipo Cassette Inverter Mitsubishi Electric PLA-M 36,000 BTU / 3 TR (diseño para falso techo de 4 vías, 3D i-See Sensor inteligente, bomba de drenaje incorporada, compresor Inverter ultra eficiente y operación silenciosa) con 3 años de garantía oficial y entrega en Santiago.'
    },
    {
      refCode: 'SUG-P1500',
      title: 'Disponibilidad de Módulos Comunicadores de Red IP Paradox IP150+ para Conexión de Paneles de Alarma Spectra y EVO a la App Móvil Insite Gold',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para completar los sistemas de alarma contra intrusión Paradox Spectra SP4000 que ofrecen en la web, en residencias, joyerías y almacenes en Santiago requerimos módulos de comunicación IP / Ethernet Paradox IP150+ para conectar el panel de alarma al router de internet de la propiedad y permitir armado/desarmado remoto, recepción de notificaciones push instantáneas de pánico o intrusión en la app móvil Insite Gold y reporte a estaciones centrales de monitoreo por protocolo IP/GPRS sin necesidad de línea telefónica fija terrestre.',
      officialResponse: '¡Hola Lic. Francisco Javier! Tu requerimiento ha sido atendido e implementado de inmediato. Incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-paradox.html el Módulo Comunicador de Red IP Paradox IP150+ (puerto Ethernet 10/100, soporte de cifrado AES-256 / MD5, compatibilidad total con paneles Paradox Spectra SP, Magellan y EVO, conexión a la app móvil Insite Gold y envío de eventos por correo electrónico o central receptora) con 1 año de garantía oficial y asesoría técnica en Santiago.'
    },
    {
      refCode: 'SUG-L6400',
      title: 'Disponibilidad de Sistemas Wi-Fi 6E Mesh Tri-Banda Linksys Velop Pro 6E AXE5400 con Banda de 6 GHz para Redes Residenciales y Corporativas de Ultra Alta Velocidad',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para aprovechar al 100% los planes de fibra óptica de ultra alta velocidad de Futunet (300 a 500 Megas o 1 Gbps) en condominios, chalets y oficinas con docenas de dispositivos inalámbricos simultáneos en Santiago, requerimos sistemas en malla (Mesh) Tri-Banda Linksys Velop Pro 6E AXE5400 con la nueva banda limpia de 6 GHz (sin interferencias de vecinos), puerto WAN Gigabit de 1 Gbps, tecnología Cognitive Mesh para auto-optimización continua y cobertura sin zonas muertas de hasta 3,000 pies cuadrados por nodo.',
      officialResponse: '¡Saludos Ing. David! Nos alegra informarte que tu propuesta ha sido implementada. Ya incorporamos al catálogo de Redes y Datos y a la página oficial marca-linksys.html el Sistema Wi-Fi 6E Mesh Tri-Banda Linksys Velop Pro 6E AXE5400 (tri-banda concurrente 2.4 GHz, 5 GHz y la nueva banda libre de 6 GHz, tecnología Cognitive Mesh, cobertura de hasta 3,000 pies cuadrados, puertos Gigabit y configuración fácil desde app Linksys) con 2 años de garantía corporativa y entrega inmediata en Santiago.'
    },
    {
      refCode: 'SUG-E8200',
      title: 'Disponibilidad de Cámaras Wi-Fi de Seguridad PTZ Motorizadas Ezviz H8c 360° para Exterior con Visión Nocturna a Color y Seguimiento IA',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En residencias unifamiliares, almacenes y condominios en Santiago requerimos cámaras de seguridad para intemperie tipo domo PTZ motorizadas con rotación horizontal de 350° y vertical de 80° Ezviz H8c (resolución Full HD 1080p, visión nocturna a color, seguimiento automático de personas con IA, defensa activa con sirena y luz estroboscópica, audio bidireccional, protección IP65 y ranura microSD hasta 512 GB).',
      officialResponse: '¡Hola Licda. Carmen Rosa! Tu propuesta ha sido implementada con total éxito. Ya incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-ezviz.html la Cámara de Seguridad Wi-Fi PTZ Exterior Ezviz H8c 1080p (giro horizontal motorizado de 350° e inclinación de 80°, visión nocturna a color real 24/7, detección y seguimiento inteligente de siluetas humanas con IA, defensa activa con sirena y luz estroboscópica, audio bidireccional y ranura para tarjeta microSD de hasta 512 GB) con 1 año de garantía oficial Ezviz y entrega inmediata en Santiago.'
    },
    {
      refCode: 'SUG-L9500',
      title: 'Disponibilidad de Cámaras de Conferencia Todo en Uno Logitech MeetUp 4K Ultra HD con Micrófonos Integrados para Salas de Reuniones Corporativas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En salas de juntas, despachos gerenciales y salones de conferencia en Santiago requerimos sistemas de videoconferencia profesionales Todo en Uno Logitech MeetUp con lente ultra gran angular de 120° con resolución 4K Ultra HD, panorámica e inclinación motorizada, tecnología RightSight para encuadre automático de participantes, matriz de 3 micrófonos con cancelación de eco RightSound y altavoz optimizado para la voz humana.',
      officialResponse: '¡Saludos Ing. Manuel! Nos complace comunicarte que tu sugerencia ha sido implementada exitosamente. Ya incorporamos al catálogo de Equipos de Oficina y a la página oficial marca-logitech.html la Cámara de Videoconferencia Todo en Uno Logitech MeetUp 4K Ultra HD (lente ultra gran angular de 120°, óptica 4K, panorámica/inclinación motorizada, encuadre automático RightSight, 3 micrófonos con formación de haces RightSound y altavoz full duplex de alta fidelidad) certificada para Teams, Zoom y Google Meet, con 2 años de garantía corporativa y facturación formal con NCF en Santiago.'
    },
    {
      refCode: 'SUG-Z400B',
      title: 'Disponibilidad de Cerraduras Digitales Inteligentes ZKTeco TL400B Biométricas con Huella, Teclado Táctil y Tarjeta RFID',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Para oficinas privadas, salas de servidores, despachos directivos y residencias premium en Santiago requerimos cerraduras digitales inteligentes ZKTeco TL400B con lector semiconductor de huella digital ultrarrápido, teclado numérico táctil capacitivo con contraseña aleatoria anti-espía, lector de tarjetas de proximidad RFID Mifare, llave física de alta seguridad oculta, pestillo reversible de acero inoxidable y aviso de batería baja con puerto USB para alimentación de emergencia.',
      officialResponse: '¡Hola Arq. Roberto! Tu propuesta ha sido evaluada y acogida con éxito. Ya incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-zkteco.html la Cerradura Digital Inteligente ZKTeco TL400B Biométrica (sensor semiconductor de huella digital < 0.5s, teclado táctil anti-espía, tarjeta RFID Mifare, llave mecánica de seguridad oculta, pestillo reversible europeo en acero inoxidable y puerto micro USB de emergencia) con 1 año de garantía oficial ZKTeco y comprobante fiscal NCF en Santiago.'
    },
    {
      refCode: 'SUG-U6800',
      title: 'Disponibilidad de Puntos de Acceso Wi-Fi 6 de Alto Rendimiento Ubiquiti UniFi 6 Pro (U6-Pro) Doble Banda 5.3 Gbps para Naves, Zonas Francas y Alta Densidad',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En naves industriales de zonas francas (PIVEM), centros de eventos, centros médicos y oficinas de arquitectura en Santiago con alta densidad de usuarios inalámbricos requerimos puntos de acceso de alto rendimiento Ubiquiti UniFi 6 Pro (U6-Pro) con Wi-Fi 6 de doble banda concurrente (hasta 5.3 Gbps de tasa total de transferencia con 4x4 MU-MIMO en 5 GHz con canales de 160 MHz y 2x2 en 2.4 GHz), puerto Gigabit Ethernet PoE+, soporte para más de 350 clientes conectados simultáneos y aislamiento de tráfico por VLANs.',
      officialResponse: '¡Saludos cordiales Ing. Cristian! Tu solicitud ha sido implementada de inmediato. Ya incorporamos al catálogo de Redes de Datos y a la página oficial marca-ubiquiti.html el Punto de Acceso Wi-Fi 6 Ubiquiti UniFi 6 Pro (U6-Pro), con tasa agregada de 5.3 Gbps (4x4 MU-MIMO en 5 GHz con canales de 160 MHz hasta 4.8 Gbps y 2x2 en 2.4 GHz hasta 573.5 Mbps), puerto Gigabit Ethernet PoE+, capacidad para más de 350 clientes simultáneos y gestión centralizada UniFi Network sin licencias, con 1 año de garantía oficial en Santiago.'
    },
    {
      refCode: 'SUG-S6500',
      title: 'Disponibilidad de Pantallas Interactivas Táctiles Samsung Flip Pro 65" 4K UHD para Salas de Juntas, Capacitación y Teletrabajo Colaborativo',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En salas de conferencias, centros de innovación, universidades (PUCMM/UTESA) y oficinas corporativas en Santiago requerimos pantallas interactivas táctiles profesionales Samsung Flip Pro (WM65B) de 65 pulgadas con resolución 4K UHD, tecnología táctil multitoque de baja latencia (26 ms) con hasta 20 puntos táctiles simultáneos, lápiz interactivo pasivo, conectividad versátil (HDMI, DisplayPort, USB-C con carga de 65W y transferencia de datos/video en un solo cable), altavoces estéreo integrados de 40W y compatibilidad inalámbrica con SmartView+, AirPlay 2 y OPS slot.',
      officialResponse: '¡Saludos cordiales Ing. Arnaldo! Tu propuesta ha sido acogida e implementada de inmediato. Ya incorporamos al catálogo de Equipos de Oficina y a la página oficial marca-samsung.html la Pantalla Interactiva Táctil Samsung Flip Pro de 65" 4K UHD (resolución 3840 x 2160, multitáctil de 20 puntos con latencia ultrabaja de 26 ms, puerto USB-C 65W Todo-en-Uno, duplicación inalámbrica SmartView+ y AirPlay 2, altavoces estéreo frontales de 40W y ranura OPS) con 3 años de garantía oficial Samsung y facturación formal con NCF en Santiago.'
    },
    {
      refCode: 'SUG-D3660',
      title: 'Disponibilidad de Estaciones de Trabajo Profesionales Dell Precision 3660 Tower con Gráficos Dedicados NVIDIA RTX para Arquitectura, Ingeniería y Modelado BIM',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En firmas de arquitectura, constructoras e ingenierías en Santiago requerimos estaciones de trabajo certificadas Dell Precision 3660 Tower equipadas con procesador Intel Core i7 de 13.ª generación (16 núcleos), 32 GB de memoria RAM DDR5 con soporte ECC, tarjeta gráfica profesional dedicada NVIDIA RTX con certificación ISV para AutoCAD, Revit, SketchUp, Lumion y SolidWorks, almacenamiento dual ultrarrápido SSD NVMe PCIe 4.0 de 1 TB más disco secundario de 2 TB para proyectos pesados, y fuente de poder de 500W con certificación 80 Plus Platinum.',
      officialResponse: '¡Hola Arq. Giancarlo! Tu sugerencia ha sido aprobada e implementada en su totalidad. Ya incorporamos al catálogo corporativo de Equipos de Oficina y a la página oficial marca-dell.html la Estación de Trabajo en Torre Dell Precision 3660 Workstation (Intel Core i7-13700 16 núcleos hasta 5.2 GHz, 32 GB RAM DDR5, gráficos profesionales dedicados NVIDIA RTX con certificación ISV, 1 TB SSD NVMe PCIe Gen4 + 2 TB HDD, fuente 500W Platinum y Windows 11 Pro) con 3 años de soporte Dell ProSupport en sitio en Santiago.'
    },
    {
      refCode: 'SUG-A7900',
      title: 'Disponibilidad de Unidades PDU Administrables para Rack APC by Schneider Electric con Monitoreo Remoto de Energía y Pantalla Digital para Data Centers',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En salas de servidores, centros de cómputo y racks de telecomunicaciones en Santiago requerimos unidades de distribución de energía en rack (Rack PDU) monitoreables y administrables APC by Schneider Electric Metered Rack PDU de 120V / 20A con 16 tomas NEMA 5-20R para montaje vertical 0U o horizontal 1U/2U, con pantalla LCD frontal de consumo de corriente en amperios (A), interfaz de gestión web HTTP/HTTPS, SNMP y Telnet con umbrales de alerta temprana para prevenir sobrecargas en interruptores y monitoreo ambiental.',
      officialResponse: '¡Saludos cordiales Ing. Franklyn! Tu propuesta ha sido atendida e implementada exitosamente. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-schneiderelectric.html la Unidad de Distribución de Energía PDU para Rack APC by Schneider Electric Metered 120V / 20A (16 tomas NEMA 5-20R, pantalla digital LCD de corriente en tiempo real, interfaz de red Ethernet RJ-45 con soporte SNMP/Web/CLI, alertas configurables de sobrecarga y montaje versátil en rack) con 2 años de garantía corporativa y facturación formal con NCF en Santiago.'
    },
    {
      refCode: 'SUG-D4300',
      title: 'Disponibilidad de Terminales de Control de Acceso y Asistencia Facial Dahua con Inteligencia Artificial, Doble Cámara y Pantalla Táctil',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En torres empresariales, almacenes de zonas francas, condominios residenciales y clínicas en Santiago requerimos terminales biométricas autónomas de control de acceso y control de tiempo Dahua Technology con reconocimiento facial asistido por IA mediante doble cámara de 2 MP con luz estelar e infrarroja (anti-suplantación por fotos o videos), pantalla táctil a color de 4.3 pulgadas, capacidad para 1,500 rostros y 3,000 tarjetas IC/Mifare, verificación ultra rápida (< 0.2s), conexión Ethernet TCP/IP, puerto Wi-Fi y salida de relé para control de electroimán y cerradura de puerta.',
      officialResponse: '¡Hola Ing. Ramón Emilio! Nos alegra informarte que tu propuesta ha sido implementada exitosamente. Ya incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-dahua.html la Terminal Biométrica de Control de Acceso Facial Dahua con Inteligencia Artificial (doble cámara 2MP con sensor WDR y luz visible, pantalla táctil LCD de 4.3", reconocimiento en < 0.2s anti-suplantación, 1,500 rostros, lector de tarjetas IC Mifare, Wi-Fi, Ethernet y software de gestión SmartPSS / DSS) con 1 año de garantía oficial Dahua y facturación formal con NCF en Santiago.'
    },
    {
      refCode: 'SUG-L3400',
      title: 'Disponibilidad de Monitores UltraWide LG 34WP500-B de 34 Pulgadas IPS WFHD (2560x1080) con Doble HDMI y Split Screen para Productividad y Finanzas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En firmas de contabilidad, despachos de consultoría financiera, estudios de diseño gráfico y estaciones de desarrollo de software en Santiago requerimos monitores panorámicos UltraWide LG 34WP500-B de 34 pulgadas con relación 21:9 y panel IPS WFHD (2560 x 1080) con calibración de color sRGB 95% y HDR10. En nuestros escritorios las configuraciones de doble monitor tradicional generan divisiones molestas con marcos en el centro y ocupan dos enchufes y doble cableado. Con el monitor UltraWide de 34" y el software LG OnScreen Control podemos dividir la pantalla limpiamente en hasta 4 cuadrantes para comparar simultáneamente estados financieros, planos, bases de datos o código fuente.',
      officialResponse: '¡Hola Lic. Kelvin! Nos complace comunicarte que tu propuesta ha sido implementada con total éxito. Ya incorporamos al catálogo corporativo de Equipos de Oficina y a la página oficial marca-lg.html el Monitor UltraWide LG 34WP500-B de 34 Pulgadas IPS WFHD (resolución 2560 x 1080 en formato panorámico 21:9, cobertura sRGB 95%, HDR10, frecuencia de 75 Hz con AMD FreeSync, doble entrada HDMI 2.0 y soporte de división de pantalla LG OnScreen Control) con 3 años de garantía oficial LG y facturación formal con NCF en Santiago.'
    },
    {
      refCode: 'SUG-M5300',
      title: 'Disponibilidad de Routers Inalámbricos Wi-Fi 6 MikroTik hAP ax³ Gigabit con Puerto 2.5G y CPU Quad-Core para Oficinas y Proveedores de Internet',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En empresas de telecomunicaciones, proveedores locales de internet (WISP), despachos profesionales y condominios en Santiago requerimos routers inalámbricos Wi-Fi 6 de alta potencia MikroTik hAP ax³ (código C53UiG+5HPaxD2HPaxD) equipados con procesador Quad-Core a 1.8 GHz, 1 GB de RAM, radio Wi-Fi 6 de doble banda AX1800 de alto rendimiento con antenas externas desmontables, 4 puertos Gigabit Ethernet y un puerto 2.5 Gigabit Ethernet para troncales de fibra óptica o enlaces de alta velocidad.',
      officialResponse: '¡Saludos cordiales Ing. Nelson! Tu solicitud ha sido atendida e implementada de inmediato. Hemos agregado al catálogo de Redes de Datos y a la página oficial marca-mikrotik.html el Router Inalámbrico Wi-Fi 6 MikroTik hAP ax³ AX1800 (CPU Quad-Core 1.8 GHz, 1 GB RAM, Wi-Fi 6 de doble banda con antenas externas de alta ganancia, 1 puerto 2.5 GbE, 4 puertos Gigabit LAN, PoE y sistema RouterOS v7 nivel 6 con soporte de contenedores y WireGuard) con 1 año de garantía oficial y respaldo de soporte técnico en Santiago.'
    },
    {
      refCode: 'SUG-C3508',
      title: 'Disponibilidad de Switches Administrables Cisco Business CBS350-8P-E-2G de 8 Puertos Gigabit PoE+ con Enlaces Combo SFP para Sucursales',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En sucursales bancarias, clínicas médicas, recepciones corporativas y salas de servidores de pequeñas y medianas empresas en Santiago requerimos switches administrables de Capa 3 compactos y silenciosos Cisco Business CBS350-8P-E-2G de 8 puertos Gigabit Ethernet con soporte PoE+ (802.3at con presupuesto de 67W) para alimentar puntos de acceso, teléfonos IP y cámaras sin ruido de ventilador, más 2 puertos combo Gigabit RJ-45 / SFP para enlaces ascendentes de fibra óptica troncal.',
      officialResponse: '¡Hola Ing. Héctor! Tu sugerencia ha sido aprobada e implementada en su totalidad. Ya incorporamos al catálogo corporativo de Redes de Datos y a la página oficial marca-cisco.html el Switch Administrable Cisco Business CBS350-8P-E-2G (8 puertos Gigabit PoE+ 802.3at hasta 67W, 2 puertos combo GbE/SFP de fibra óptica, enrutamiento de Capa 3, QoS avanzado, chasis metálico fanless 100% silencioso y panel web en español) con garantía oficial limitada de por vida Cisco y comprobante fiscal NCF en Santiago.'
    },
    {
      refCode: 'SUG-A1500',
      title: 'Disponibilidad de Sistemas UPS Interactivos APC Smart-UPS SMT1500C 1440VA / 1000W Onda Senoidal Pura con LCD y Monitoreo Cloud SmartConnect',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En servidores corporativos de virtualización, cabinas de almacenamiento NAS (Synology/QNAP), conmutadores centrales y conmutadores telefónicos IP en Santiago requerimos sistemas de respaldo ininterrumpido de energía de onda senoidal pura como el APC Smart-UPS SMT1500C de 1440VA / 1000W fabricado por Schneider Electric con pantalla LCD digital frontal, 8 tomas NEMA 5-15R con grupos conmutados, regulación AVR de amplio rango y puerto de monitoreo en la nube APC SmartConnect.',
      officialResponse: '¡Saludos cordiales Ing. Joelvis! Tu propuesta ha sido acogida e implementada de inmediato. Ya incorporamos al catálogo de Energía & Climatización y a la página oficial marca-schneiderelectric.html el Sistema UPS Interactivo APC Smart-UPS SMT1500C 1440VA / 1000W (onda senoidal pura con certificación para servidores PFC activo, 8 tomas NEMA 5-15R con grupos conmutados, regulación de voltaje AVR Boost & Trim, pantalla LCD interactiva de navegación, puerto Ethernet SmartConnect de monitoreo en la nube y ranura SmartSlot) con 3 años de garantía oficial y entrega directa en Santiago.'
    },
    {
      refCode: 'SUG-L1600',
      title: 'Disponibilidad de Laptops Corporativas Lenovo ThinkPad E16 Gen 1 de 16 Pulgadas FHD+ (Intel Core i7 13.ª Gen, 16GB RAM, 512GB SSD) con Teclado Numérico para Contabilidad y Gestión Empresarial',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras firmas de contabilidad, auditoría externa y consultoría fiscal en Santiago requerimos laptops corporativas Lenovo ThinkPad E16 Gen 1 con pantalla de 16 pulgadas antirreflejo WUXGA (1920x1200) formato 16:10, procesador Intel Core i7-1355U de 10 núcleos, 16 GB de memoria RAM DDR4 expandible, unidad de estado sólido de 512 GB SSD NVMe M.2 y teclado retroiluminado completo en español con bloque numérico dedicado independiente. En marca-lenovo.html solo contaban con la ThinkPad L14 de 14" que no tiene bloque numérico y ralentiza el ingreso de comprobantes fiscales NCF y nóminas TSS.',
      officialResponse: '¡Hola Lic. Carlos Manuel! Tu solicitud ha sido atendida e implementada de inmediato. Ya incorporamos al catálogo corporativo de Equipos de Oficina y a la página oficial marca-lenovo.html la Laptop Corporativa Lenovo ThinkPad E16 Gen 1 (pantalla IPS WUXGA de 16" 16:10 antirreflejo, Intel Core i7-1355U hasta 5.0 GHz, 16 GB RAM DDR4, 512 GB SSD NVMe M.2, teclado ergonómico en español con teclado numérico integrado, lector de huella dactilar en botón de encendido, cámara FHD con obturador de privacidad ThinkShutter y certificación militar MIL-STD-810H) con 1 año de garantía oficial Lenovo y facturación formal con NCF en Santiago.'
    },
    {
      refCode: 'SUG-T6530',
      title: 'Disponibilidad de Puntos de Acceso Wi-Fi 6 de Techo TP-Link Omada EAP653 AX3000 Gigabit PoE para Hoteles, Oficinas y Restaurantes con Gestión en la Nube Omada SDN',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En hoteles boutique de Los Jardines, clínicas odontológicas, restaurantes y oficinas corporativas en Santiago requerimos puntos de acceso inalámbricos Wi-Fi 6 de techo TP-Link Omada EAP653 con velocidad AX3000 (hasta 2402 Mbps en 5 GHz + 574 Mbps en 2.4 GHz), puerto Gigabit Ethernet con alimentación PoE+ 802.3at, diseño ultra delgado de montaje en techo o pared y compatibilidad con el controlador Omada SDN en la nube para configuración masiva, portal cautivo para invitados con vouchers y roaming fluido 802.11k/v. En marca-tp-link.html solo contaban con routers residenciales y el sistema Deco, requiriendo una solución profesional de techo con gestión centralizada.',
      officialResponse: '¡Saludos cordiales Ing. Ramón Antonio! Nos complace informarte que tu requerimiento ha sido acogido e implementado en su totalidad. Ya incorporamos al catálogo de Redes de Datos y a la página oficial marca-tp-link.html el Punto de Acceso Wi-Fi 6 TP-Link Omada EAP653 AX3000 (diseño ultra slim de techo, doble banda AX3000 con OFDMA y MU-MIMO, puerto Gigabit PoE 802.3at, roaming continuo 802.11k/v, portal cautivo con autenticación SMS/Voucher y control centralizado gratuito en la nube mediante Omada SDN) con 3 años de garantía oficial y entrega inmediata en Santiago.'
    },
    {
      refCode: 'SUG-E5590',
      title: 'Disponibilidad de Impresoras Multifuncionales EcoTank Epson L5590 con Alimentador Automático ADF, Red Ethernet, Wi-Fi Direct y Fax para Despachos Contables y Pymes',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras oficinas de contabilidad, notarías y despachos legales en Santiago requerimos impresoras multifuncionales de tinta continua original Epson EcoTank L5590 4-en-1 (impresora, copiadora, escáner y fax) equipadas con alimentador automático de documentos (ADF) de 30 hojas para escanear y copiar contratos multi-página sin levantar la tapa hoja por hoja, conectividad de red por cable Ethernet RJ-45 más Wi-Fi Direct para compartir en red local entre varios contadores sin desconexiones, pantalla LCD a color de 1.44" y compatibilidad con botellas de tinta de ultra alto rendimiento Epson 544 (hasta 4,500 páginas en negro y 7,500 en color). En marca-epson.html solo figuraban los modelos L3210/L3250 que no tienen ADF ni puerto Ethernet.',
      officialResponse: '¡Hola Licda. Xiomara! Tu propuesta ha sido implementada con total éxito. Ya incorporamos al catálogo corporativo de Equipos de Oficina y a la página oficial marca-epson.html la Impresora Multifuncional Epson EcoTank L5590 (sistema de tanque de tinta continua 100% sin cartuchos con botellas 544, alimentador automático ADF de 30 páginas, puerto de red Ethernet 10/100, Wi-Fi Direct, Apple AirPrint, pantalla LCD a color de 1.44" y velocidades de hasta 33 ppm) con 2 años de garantía oficial Epson registrando el equipo y suministro garantizado de tintas originales en Santiago.'
    },
    {
      refCode: 'SUG-H8240',
      title: 'Disponibilidad de Cámaras IP Domo Hikvision AcuSense 4K 8MP (DS-2CD2183G2-IU) con Clasificación IA de Humanos y Vehículos, Micrófono Integrado y Visión Nocturna EXIR 30m',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En condominios residenciales de Cerros de Gurabo, entradas de naves en zonas francas (PIVEM) y estacionamientos comerciales en Santiago requerimos cámaras IP domo antivandálicas Hikvision AcuSense 4K de 8 Megapíxeles (modelo DS-2CD2183G2-IU) con tecnología de Inteligencia Artificial Deep Learning para clasificación precisa de humanos y vehículos, eliminando las falsas alarmas ocasionadas por ramas, lluvias o gatos. Necesitamos este modelo con micrófono ambiental incorporado para registro sonoro de incidentes, lente gran angular de 2.8 mm (107° de visión), compresión H.265+, ranura para tarjeta microSD de hasta 512 GB, visión nocturna infrarroja EXIR de hasta 30 metros y certificación IP67 para intemperie con chasis antivandálico IK10.',
      officialResponse: '¡Saludos cordiales Ing. Arnaldo! Tu solicitud ha sido aprobada e integrada de inmediato. Ya incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-hikvision.html la Cámara IP Domo Hikvision AcuSense 4K 8MP DS-2CD2183G2-IU (resolución 3840x2160 a 20 fps, filtro de falsas alarmas mediante IA para humanos y vehículos, micrófono integrado de alta fidelidad, visión nocturna EXIR 30m, rango dinámico WDR 120 dB, ranura MicroSD hasta 512GB, protección intemperie IP67 y antivandálica IK10) con 2 años de garantía oficial Hikvision y soporte técnico de configuración en Santiago.'
    },
    {
      refCode: 'SUG-L2240',
      title: 'Disponibilidad de Routers VPN Empresariales Linksys LRT224 Dual-WAN Gigabit con Balanceo de Carga y Respaldo Automático para Conexiones Redundantes Claro/Altice',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En nuestras empresas, centros médicos y oficinas de consultoría en Santiago contratamos dos proveedores de internet simultáneos (fibra óptica Claro y Altice) y requerimos un router balanceador VPN Linksys LRT224 Dual-WAN Gigabit que gestione el balanceo de tráfico inteligente y conmute automáticamente (failover) si una de las líneas experimenta interrupciones. Necesitamos soporte para hasta 50 túneles IPSec sitio a sitio hacia sucursales remotas y 5 túneles OpenVPN para colaboradores en teletrabajo, junto con cortafuegos SPI y segmentación por VLANs 802.1Q en chasis metálico silencioso sin ventilador.',
      officialResponse: '¡Hola Ing. David! Tu solicitud ha sido aprobada e implementada de inmediato. Incorporamos al catálogo de Redes de Datos y a la página oficial marca-linksys.html el Router VPN Empresarial Dual-WAN Gigabit Linksys LRT224 (balanceo de carga inteligente Claro/Altice, failover automático, 4 puertos LAN Gigabit con VLAN 802.1Q, hasta 50 túneles IPSec y 5 túneles OpenVPN con aceleración por hardware, cortafuegos SPI y chasis metálico silencioso) con 2 años de garantía corporativa y soporte de ingeniería en Santiago.'
    },
    {
      refCode: 'SUG-N7240',
      title: 'Disponibilidad de Switches Administrables Netgear Smart Managed Pro GS724TPv2 de 24 Puertos Gigabit PoE+ (190W) con 2 Puertos SFP Dedicados para Racks Corporativos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En proyectos de infraestructura de red en parques industriales y plazas corporativas en Santiago requerimos switches para montaje en rack de 19 pulgadas Netgear Smart Managed Pro GS724TPv2 de 24 puertos Gigabit Ethernet donde todos los puertos admitan PoE+ 802.3at con presupuesto de al menos 190 Watts para alimentar teléfonos IP, puntos de acceso Wi-Fi 6 y cámaras de videovigilancia sin requerir inyectores externos. Asimismo, requerimos 2 puertos SFP Gigabit dedicados para enlaces de subida de fibra óptica hacia switches de distribución y gestión web L2/L2+ con VLANs y ACLs.',
      officialResponse: '¡Saludos cordiales Ing. Héctor Bienvenido! Nos complace informarte que tu requerimiento ha sido acogido e implementado de inmediato. Ya incorporamos al catálogo de Redes de Datos y a la página oficial marca-netgear.html el Switch Administrable Netgear Smart Managed Pro GS724TPv2 de 24 Puertos Gigabit PoE+ (190W de presupuesto PoE+, 2 puertos SFP de fibra dedicados, administración web L2/L2+, VLAN 802.1Q, ACL de seguridad, QoS avanzado y montaje en rack de 19" de 1U) con garantía oficial ProSAFE y factura fiscal formal en Santiago.'
    },
    {
      refCode: 'SUG-V5000',
      title: 'Disponibilidad de Monitores de Baterías Victron Energy SmartShunt 500A / 50mV con Bluetooth Integrado para Sistemas Solares y Bancos de Respaldo Inversor',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En instalaciones solares fotovoltaicas y sistemas de respaldo energético con inversores en residencias y empresas de Santiago requerimos monitores de corriente de alta precisión Victron Energy SmartShunt 500A / 50mV con Bluetooth Smart integrado para consultar desde el celular en la aplicación VictronConnect el porcentaje exacto de batería restante (SoC %), amperios-hora consumidos, voltaje del banco y tiempo restante de autonomía. Necesitamos que sea compatible con bancos de 12V, 24V y 48V tanto de Litio LiFePO4 como de baterías de ciclo profundo y que cuente con entrada auxiliar para medir temperatura o tensión de una batería de arranque.',
      officialResponse: '¡Hola Ing. Carolina! Tu propuesta ha sido aprobada e integrada con éxito. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-victronenergy.html el Monitor de Baterías Inteligente Victron Energy SmartShunt 500A / 50mV (Bluetooth integrado para app VictronConnect, cálculo de SoC %, lectura de amperios consumidos y autonomía restante, entrada secundaria para temperatura o banco auxiliar, compatible con 12V/24V/48V Litio y Plomo-Ácido y puerto VE.Direct) con 5 años de garantía oficial Victron y disponibilidad inmediata en Santiago.'
    },
    {
      refCode: 'SUG-P6000',
      title: 'Disponibilidad de Sistemas Telefónicos Inalámbricos DECT IP Panasonic KX-TGP600 con 8 Líneas SIP para Clínicas, Naves Comerciales y Almacenes',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En almacenes de distribución, clínicas médicas, concesionarios y oficinas de múltiples departamentos en Santiago requerimos sistemas de telefonía inalámbrica corporativa DECT IP Panasonic KX-TGP600 con estación base PoE y terminales inalámbricos que admitan hasta 8 cuentas SIP simultáneas y 8 llamadas concurrentes. En marca-panasonic.html solo contaban con teléfonos de escritorio fijos por cable, requiriendo una solución de comunicación inalámbrica con sonido HD Voice, pantalla a color de 1.8 pulgadas y cobertura de hasta 300 metros para movilidad del personal dentro de las instalaciones.',
      officialResponse: '¡Estimado Lic. José Luis! Nos alegra comunicarte que tu sugerencia ha sido implementada de inmediato. Hemos incorporado al catálogo corporativo de Equipos de Oficina y a la página oficial marca-panasonic.html el Sistema Telefónico Inalámbrico DECT IP Panasonic KX-TGP600 (soporta hasta 8 cuentas SIP y 8 llamadas simultáneas, pantalla LCD a color de 1.8", audio HD Voice con reducción de ruido, puerto Ethernet PoE y capacidad de expansión hasta 8 terminales para movilidad total en almacenes y clínicas) con 1 año de garantía oficial y soporte local en Santiago.'
    }
  ,
    {
      refCode: 'SUG-J2312',
      title: 'Disponibilidad de Switches Compactos Fanless Juniper Networks EX2300-C-12P PoE+ con Uplinks 10GbE SFP+ para Oficinas y Racks Silenciosos',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En consultorios médicos, sucursales bancarias, oficinas abiertas y centros de monitoreo en Santiago requerimos switches de capa de acceso compactos y 100% silenciosos (sin ventilador / fanless) como el Juniper Networks EX2300-C-12P de 12 puertos Gigabit PoE+ con presupuesto de 124W para alimentar puntos de acceso Wi-Fi 6 y teléfonos VoIP, además de 2 puertos uplink dedicados de 10GbE SFP+ para conectarse por fibra a 10 Gigabits al núcleo de red central. En marca-juniper.html cuentan con el EX2300-24P de 24 puertos para rack grande, pero para espacios reducidos y silenciosos necesitamos el formato compacto fanless.',
      officialResponse: '¡Saludos cordiales Ing. Marcos Antonio! Tu sugerencia ha sido implementada de inmediato. Incorporamos al catálogo corporativo de Redes y a la página oficial marca-juniper.html el Switch Compacto Fanless Juniper Networks EX2300-C-12P (12 puertos Gigabit Ethernet PoE+ 802.3at con 124W, 2 puertos uplink dedicados 10GbE SFP+, sistema operativo Junos OS, enrutamiento L2/L3, diseño fanless 100% silencioso y montaje en pared o escritorio) con garantía corporativa oficial y soporte técnico en Santiago.'
    },
    {
      refCode: 'SUG-M1200',
      title: 'Disponibilidad de Aires Acondicionados Inverter Mitsubishi Electric MSZ-GL 12,000 BTU Ultra Silenciosos (19 dB) para Dormitorios, Despachos y Racks de Telecomunicaciones',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En consultorios médicos, dormitorios de residencias de alto estándar y cuartos de telecomunicaciones en Santiago requerimos unidades de climatización ultra silenciosas y de altísima eficiencia como el aire acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 12,000 BTU (modelo MSZ-GL12NA / MUZ-GL12NA) con eficiencia de 23.1 SEER, nivel de ruido casi inaudible de solo 19 dB en modo silencioso, filtro nano-platino anti-alérgenos y compatibilidad con control Wi-Fi Kumo Cloud. En marca-mitsubishi.html disponían del modelo de 18k BTU y cassette de 36k BTU, requiriendo el de 12,000 BTU para áreas de hasta 20-25 metros cuadrados con ahorro extremo de energía eléctrica.',
      officialResponse: '¡Hola Dra. Pamela! Nos complace comunicarte que tu solicitud ha sido aprobada e integrada con éxito. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-mitsubishi.html el Aire Acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 12,000 BTU 23.1 SEER (operación ultra silenciosa a 19 dB, compresor Inverter con gas ecológico R-410A, filtro catalítico Nano-Platinum antibacterial, modo Econo Cool y compatibilidad con Wi-Fi Kumo Cloud) con garantía oficial directa y facturación con NCF en Santiago.'
    },
    {
      refCode: 'SUG-P5050',
      title: 'Disponibilidad de Paneles de Alarma Híbridos Inalámbricos Paradox Magellan MG5050+ de 32 Zonas con Transceptor Integrado 433 MHz para Residencias y Comercios',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En residencias de alto nivel, plazas comerciales y oficinas en Santiago donde no es factible perforar paredes o pasar canaletas para cables de sensores, requerimos el panel de alarma híbrido Paradox Magellan MG5050+ (MG5050 Plus) que incorpora un transceptor de radiofrecuencia de 433 MHz en la placa principal, admitiendo hasta 32 zonas inalámbricas o cableadas (5 zonas cableadas en tarjeta expandibles a 32), 2 particiones independientes, tecnología StayD para protección 24/7 sin desactivar perimetrales, y compatibilidad total con el módulo IP150+ y la app móvil BlueEye (Insite GOLD) para armado/desarmado y notificaciones push inmediatas.',
      officialResponse: '¡Estimado Ing. José Ramón! Tu propuesta ha sido acogida e implementada de inmediato. Incorporamos al catálogo de Seguridad Electrónica y a la página oficial marca-paradox.html el Panel de Alarma Híbrido Inalámbrico Paradox Magellan MG5050+ (soporta hasta 32 zonas inalámbricas o cableadas, transceptor RF integrado de 433 MHz, 5 zonas en placa expandibles a 32, 2 particiones independientes, modo StayD y gestión por app móvil BlueEye con módulo IP150+) con 2 años de garantía oficial y soporte de configuración técnica en Santiago.'
    },
    {
      refCode: 'SUG-S8300',
      title: 'Disponibilidad de Controladores Lógicos Programables Siemens LOGO! 230RCE (8 Entradas / 4 Salidas Relé) con Pantalla LCD, Ethernet y Servidor Web para Automatización de Bombas y Generadores',
      category: 'catalog_products',
      status: 'implemented',
      description: 'En cuartos de máquinas, estaciones de bombeo de agua residencial y comercial, sistemas de conmutación de transferencias eléctricas de generadores y control de iluminación en edificios en Santiago requerimos micro-PLCs Siemens LOGO! 8.3 / 8.4 modelo 230RCE (alimentación directa 115V/230V AC) con pantalla frontal LCD con retroiluminación configurable, 8 entradas digitales, 4 salidas de relé de 10A, puerto Ethernet RJ-45 integrado con soporte Modbus TCP/IP, servidor web HTML5 integrado y ranura para tarjeta MicroSD para registro de datos (datalogging). En marca-siemens.html disponen de breakers y contactores, pero necesitamos el cerebro programable para automatizaciones industriales y comerciales.',
      officialResponse: '¡Hola Ing. Carlos Eduardo! Tu sugerencia ha sido aprobada e implementada en su totalidad. Ya incorporamos al catálogo corporativo de Energía & Climatización y a la página oficial marca-siemens.html el Micro-PLC y Controlador Lógico Siemens LOGO! 230RCE (alimentación 115V/230V AC, 8 entradas digitales, 4 salidas de relé 10A, pantalla LCD con teclado de navegación, puerto Ethernet con servidor web HTML5, Modbus TCP/IP y ranura MicroSD para registro) con garantía oficial Siemens y soporte especializado en Santiago.'
        },
    {
      refCode: 'SUG-U5400',
      title: 'Puntos de Acceso Wi-Fi Exteriores Ubiquiti UniFi Swiss Army Knife Ultra (UK-Ultra) IPX6',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Puntos de acceso versátiles ultracompactos resistentes a la intemperie (IPX6) con antenas internas y conectores RP-SMA para terrazas, patios y almacenes.',
      officialResponse: '¡Implementado! Incorporamos el AP Ubiquiti UniFi Swiss Army Knife Ultra (UK-Ultra) PoE IPX6 en catálogo y en marca-ubiquiti.html.'
    },
    {
      refCode: 'SUG-D3449',
      title: 'Cámaras IP Dahua TiOC 2.0 4MP con Disuasión Activa, Sirena 110dB y Full-Color 24/7',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cámaras IP preventivas Dahua TiOC 2.0 con estrobos rojo/azul, sirena de 110 dB, visión a color 24/7 y filtrado de falsas alarmas IA WizSense.',
      officialResponse: '¡Cumplido! Disponible la Cámara IP Dahua TiOC 2.0 WizSense 4MP (DH-IPC-HDW3449HP-AS-PV) con disuasión activa y soporte en Santiago.'
    },
    {
      refCode: 'SUG-C3524',
      title: 'Switches Administrables Cisco Business CBS350-24P-4G de 24 Puertos Gigabit PoE+ (195W) y 4x SFP',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Switches de conmutación gestionable L3 Cisco Business CBS350 de 24 puertos Gigabit PoE+ con 4 enlaces de fibra SFP dedicados para racks corporativos.',
      officialResponse: '¡Implementado! Integrado al catálogo el Switch Cisco Business CBS350-24P-4G con 195W PoE+, 4 SFP de fibra y garantía oficial de por vida.'
    },
    {
      refCode: 'SUG-A2200',
      title: 'Sistemas UPS para Rack APC Smart-UPS SMT2200RM2U de 2200VA / 1980W 2U Onda Senoidal Pura',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sistemas de respaldo ininterrumpido en formato rack 2U APC Smart-UPS 2200VA con onda senoidal pura, pantalla LCD y monitoreo cloud SmartConnect.',
      officialResponse: '¡Atendido! Se integró el Sistema UPS APC Smart-UPS SMT2200RM2U de 2200VA / 1980W con regulación AVR y gestión cloud en Energía y Climatización.'
        },
    {
      refCode: 'SUG-T1150',
      title: 'Cargadores Universales de Vehículos Eléctricos Tesla Universal Wall Connector (48A / 11.5 kW)',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cargador universal EV Tesla con adaptador Magic Dock integrado (compatible con Tesla y J1772), 48A, Wi-Fi y cable de 24 pies.',
      officialResponse: '¡Implementado! Integrado el Cargador Tesla Universal Wall Connector 48A con Magic Dock en marca-tesla.html y Energía.'
    },
    {
      refCode: 'SUG-M3260',
      title: 'Switches Administrables MikroTik CRS326-24G-2S+RM (24 Puertos Gigabit + 2 Puertos 10G SFP+)',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Switch de distribución en rack 1U con 24 puertos Gigabit, 2 jaulas SFP+ 10G y Dual Boot SwOS/RouterOS para WISPs y corporaciones.',
      officialResponse: '¡Cumplido! Disponible el Switch MikroTik CRS326-24G-2S+RM de 24G + 2x 10G SFP+ en catálogo y en marca-mikrotik.html.'
    },
    {
      refCode: 'SUG-E2500',
      title: 'Timbres Inteligentes con Video 2K+ 5MP Ezviz DB2 Pro con Batería y Chime Interior',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Videoportero inalámbrico 2K+ (5MP) a batería con timbre interior incluido, visión ultra gran angular de 176° y detección PIR.',
      officialResponse: '¡Implementado! Incorporado el Timbre Inalámbrico Ezviz DB2 Pro 2K+ a batería con chime interior en Seguridad Electrónica.'
    },
    {
      refCode: 'SUG-L4000',
      title: 'Cámaras Web Empresariales Logitech BRIO 4K Ultra HD con HDR y Reconocimiento Windows Hello',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Cámara web profesional 4K Ultra HD con HDR RightLight 3, sensores IR para Windows Hello y doble micrófono con cancelación de ruido.',
      officialResponse: '¡Atendido! Se incorporó la Cámara Web Logitech BRIO 4K Pro Ultra HD con Windows Hello en Equipos y Oficina y marca-logitech.html.'
        },
    {
      refCode: 'SUG-S7320',
      title: 'Monitores Inteligentes Samsung Smart Monitor M7 32" 4K UHD con USB-C 65W y Smart Hub',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Monitor inteligente 32" 4K UHD con puerto USB-C 65W Power Delivery, Smart TV Hub con Office 365, altavoces y VESA.',
      officialResponse: '¡Implementado! Integrado el Samsung Smart Monitor M7 32" 4K UHD con USB-C 65W en marca-samsung.html y Monitores.'
    },
    {
      refCode: 'SUG-L1100',
      title: 'Tablets Corporativas Lenovo Tab M11 de 11" 90Hz WUXGA con Lápiz Lenovo Tab Pen',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Tablet empresarial de 11" WUXGA 90Hz con lápiz óptico Lenovo Tab Pen (4096 niveles), Helio G88, 128GB y 4 altavoces Dolby Atmos.',
      officialResponse: '¡Cumplido! Disponible la Tablet Lenovo Tab M11 con lápiz Tab Pen incluido en catálogo y en marca-lenovo.html.'
    },
    {
      refCode: 'SUG-L2788',
      title: 'Monitores Profesionales Ergonómicos LG 27QN880-B Ergo 27" QHD IPS con Brazo C-Clamp',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Monitor ergonómico 27" QHD (2560x1440) con innovador brazo articulado Ergo C-Clamp, giro 280°, USB-C 60W y 99% sRGB.',
      officialResponse: '¡Implementado! Incorporado el Monitor LG 27QN880-B Ergo con brazo articulado C-Clamp y USB-C en Monitores y marca-lg.html.'
    },
    {
      refCode: 'SUG-N6500',
      title: 'Routers Móviles Hotspot 5G / Wi-Fi 6E Netgear Nighthawk M6 Pro (MR6500) con Puerto 2.5G',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Hotspot móvil 5G empresarial con módem Qualcomm Snapdragon X65, Wi-Fi 6E tri-banda, puerto Ethernet 2.5G y pantalla táctil.',
      officialResponse: '¡Atendido! Se incorporó el Hotspot 5G Netgear Nighthawk M6 Pro (MR6500) con puerto 2.5G en Redes y marca-netgear.html.'
        },
    {
      refCode: 'SUG-V9004',
      title: 'Centros de Comunicación y Monitoreo Victron Energy Cerbo GX con Portal VRM',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Centro de comunicación y telemetría Victron Cerbo GX con puertos VE.Direct, VE.Can, VE.Bus, Wi-Fi, Ethernet, Bluetooth y soporte GX Touch.',
      officialResponse: '¡Aprobado! Disponible el Centro de Comunicación Victron Cerbo GX en Energía y Climatización y marca-victronenergy.html.'
    },
    {
      refCode: 'SUG-L7000',
      title: 'Sistemas Wi-Fi 7 Mesh Tri-Banda Linksys Velop Pro 7 (Cognitive Mesh BE11000)',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Sistema en malla Wi-Fi 7 de hasta 11 Gbps con canales de 320 MHz en 6 GHz, Multi-Link Operation MLO y puerto WAN 2.5G multigigabit.',
      officialResponse: '¡Implementado! Incorporado el Sistema Wi-Fi 7 Linksys Velop Pro 7 en Redes y Conectividad y marca-linksys.html.'
    },
    {
      refCode: 'SUG-S2022',
      title: 'Variadores de Frecuencia Industriales Siemens SINAMICS V20 de 2.2 kW / 3 HP 230V',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Convertidor de frecuencia Siemens SINAMICS V20 para motores de 3 HP con panel BOP integrado, comunicación Modbus RTU RS485 y modo ECO.',
      officialResponse: '¡Cumplido! Se sumó el Variador Siemens SINAMICS V20 2.2kW en Energía y Climatización y marca-siemens.html.'
    },
    {
      refCode: 'SUG-P5500',
      title: 'Centrales Telefónicas IP PBX Híbridas Panasonic KX-NS500 para Comunicaciones Unificadas',
      category: 'catalog_products',
      status: 'implemented',
      description: 'Central híbrida Panasonic KX-NS500 de 6 líneas analógicas + 18 extensiones expandible a 288 extensiones, 128 SIP y buzón de voz a email.',
      officialResponse: '¡Atendido! Disponible la Central Telefónica IP PBX Panasonic KX-NS500 en Equipos de Oficina y marca-panasonic.html.'
    }];

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
        .limit(250)
        .get();

      if (snap.empty) {
        renderFallbackCommunityWall();
        return;
      }

      var items = [];
      snap.forEach(function (doc) {
        var data = doc.data() || {};
        data.id = doc.id;
        items.push(data);
      });

      function getTimestamp(val) {
        if (!val) return 0;
        if (typeof val.seconds === 'number') return val.seconds;
        if (typeof val.toDate === 'function') return val.toDate().getTime() / 1000;
        if (typeof val.getTime === 'function') return val.getTime() / 1000;
        if (typeof val === 'string') {
          var d = new Date(val);
          return isNaN(d.getTime()) ? 0 : d.getTime() / 1000;
        }
        return 0;
      }

      items.sort(function (a, b) {
        return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
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
