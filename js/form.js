/* =============================================================
   FORM.JS — Futunet (Hardened DevSecOps Edition)
   Lógica del formulario de contacto con mitigaciones de seguridad:
   - Validación estricta de tipos y formatos
   - Protección Honeypot contra bots automáticos
   - Cooldown / Rate limiting en cliente contra envíos masivos
   - Verificación de consentimiento de privacidad (Ley 172-13 / RGPD)
   - Sanitización de texto para prevenir inyecciones y caracteres maliciosos
   ============================================================= */

/**
 * Sanitiza texto eliminando etiquetas HTML y caracteres de control invisibles
 */
function sanitizeInputText(str) {
  if (!str) return '';
  return String(str)
    .replace(/<[^>]*>/g, '') // Eliminar tags HTML
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Eliminar caracteres de control
    .trim();
}

/**
 * Recoge los datos del formulario de contacto,
 * valida los campos obligatorios, privacidad, honeypot y abre WhatsApp de forma segura.
 */
function sendForm(event) {
  if (event) event.preventDefault();

  // Helper de notificación
  const notify = (message, type) => {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  };

  // 1. Verificación Honeypot (Trampa para bots automáticos)
  const hpField = document.getElementById('f-hp-check');
  if (hpField && hpField.value) {
    console.warn('Bot submission blocked via honeypot.');
    // Respuesta señuelo para despistar al bot sin realizar acción real
    notify('Tu mensaje ha sido enviado correctamente.', 'success');
    const form = document.getElementById('contact-form');
    if (form) form.reset();
    return;
  }

  // 2. Cooldown de envío (Rate-limiting en cliente para evitar spam reiterado)
  const lastSubmitKey = 'futunet_last_contact_ts';
  const now = Date.now();
  const lastSubmit = sessionStorage.getItem(lastSubmitKey);
  if (lastSubmit && (now - Number(lastSubmit)) < 10000) {
    const remaining = Math.ceil((10000 - (now - Number(lastSubmit))) / 1000);
    notify(`Por favor espera ${remaining} segundos antes de enviar otra solicitud.`, 'error');
    return;
  }

  // 3. Verificación de Consentimiento de Privacidad (Ley 172-13 / RGPD)
  const privacyConsent = document.getElementById('f-privacy-consent');
  if (privacyConsent && !privacyConsent.checked) {
    notify('Debes aceptar la política de privacidad para enviar tu solicitud.', 'error');
    privacyConsent.focus();
    return;
  }

  // Obtener y sanitizar valores del formulario
  const rawNombre   = document.getElementById('f-nombre')?.value || '';
  const rawTel      = document.getElementById('f-tel')?.value || '';
  const rawServicio = document.getElementById('f-servicio')?.value || '';
  const rawMsg      = document.getElementById('f-msg')?.value || '';

  const nombre   = sanitizeInputText(rawNombre);
  const tel      = sanitizeInputText(rawTel);
  const servicio = sanitizeInputText(rawServicio);
  const msg      = sanitizeInputText(rawMsg);

  // Validación de obligatoriedad
  if (!nombre) {
    notify('Por favor completa tu nombre.', 'error');
    return;
  }
  if (!tel) {
    notify('Por favor completa tu teléfono.', 'error');
    return;
  }

  // Validaciones de longitud para evitar abusos/spam
  if (nombre.length < 2 || nombre.length > 100) {
    notify('El nombre debe tener entre 2 y 100 caracteres.', 'error');
    return;
  }
  if (msg.length > 1500) {
    notify('El mensaje no debe superar los 1500 caracteres.', 'error');
    return;
  }

  // Validación de formato del teléfono (E.164 o local dominicano)
  const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/;
  if (!phoneRegex.test(tel)) {
    notify('Por favor introduce un número de teléfono válido (mín. 7 dígitos).', 'error');
    return;
  }

  // Limpieza de caracteres de escape para WhatsApp
  const cleanNombre = nombre.replace(/[\r\n\t]/g, ' ').replace(/\*/g, '');
  const cleanMsg = msg.replace(/\n{3,}/g, '\n\n'); // Colapsar saltos de línea excesivos

  // Construir el mensaje para WhatsApp
  let text = `Hola Futunet, soy *${cleanNombre}* (${tel}).`;

  if (servicio) {
    text += `\n\nMe interesa: *${servicio}*.`;
  }

  if (cleanMsg) {
    text += `\n\nMensaje: ${cleanMsg}`;
  }

  text += `\n\n¿Me pueden dar más información?`;

  // Registrar timestamp de envío para cooldown
  sessionStorage.setItem(lastSubmitKey, String(now));

  // Abrir WhatsApp con el mensaje construido de forma segura con fallback para bloqueadores de ventanas emergentes
  const targetNumber = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || '18297411041';
  const waUrl = `https://wa.me/${encodeURIComponent(targetNumber)}?text=${encodeURIComponent(text)}`;
  const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = waUrl;
  }
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', sendForm);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
}
