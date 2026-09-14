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
  var btnAnother = document.getElementById('sug-btn-another');

  // Inicialización cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function () {
    initCategorySelector();
    initAudienceSelector();
    initRatingStars();
    initAnonymousToggle();
    initCharCounters();
    checkCurrentUser();
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
    var title = sanitizeText(document.getElementById('sug-title').value || '');
    var desc = sanitizeText(document.getElementById('sug-desc').value || '');
    var benefit = sanitizeText(document.getElementById('sug-benefit').value || '');
    var isAnon = anonCheckbox ? anonCheckbox.checked : false;
    var name = isAnon ? '' : sanitizeText(document.getElementById('sug-name').value || '');
    var email = isAnon ? '' : sanitizeText(document.getElementById('sug-email').value || '');
    var phone = isAnon ? '' : sanitizeText(document.getElementById('sug-phone').value || '');

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
        refCodeDisplay.textContent = refCode + ' (' + docRef.id.slice(0, 6).toUpperCase() + ')';
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

})();
