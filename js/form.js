/* =============================================================
   FORM.JS — Futunet
   Lógica del formulario de contacto.
   Recoge los datos del formulario, valida los campos
   obligatorios y abre WhatsApp con un mensaje formateado.
   ============================================================= */


/* -------------------------------------------------------------
   1. ENVÍO DE FORMULARIO → WHATSAPP
   Valida nombre y teléfono, construye el mensaje y lo envía.
   ------------------------------------------------------------- */

/**
 * Recoge los datos del formulario de contacto,
 * valida los campos obligatorios (nombre y teléfono),
 * construye un texto con formato y abre WhatsApp.
 */
function sendForm(event) {
  if (event) event.preventDefault();

  // Obtener valores del formulario
  const nombre   = document.getElementById('f-nombre').value.trim();
  const tel      = document.getElementById('f-tel').value.trim();
  const servicio = document.getElementById('f-servicio').value;
  const msg      = document.getElementById('f-msg').value.trim();

  // Helper de notificación
  const notify = (message, type) => {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  };

  // Validación — Nombre y teléfono son obligatorios
  if (!nombre) {
    notify('Por favor completa tu nombre.', 'error');
    return;
  }
  if (!tel) {
    notify('Por favor completa tu teléfono.', 'error');
    return;
  }

  // Validaciones de longitud para evitar abusos/spam
  if (nombre.length > 100) {
    notify('El nombre no debe superar los 100 caracteres.', 'error');
    return;
  }
  if (msg.length > 1500) {
    notify('El mensaje no debe superar los 1500 caracteres.', 'error');
    return;
  }

  // Validación de formato del teléfono
  const phoneRegex = /^\+?[0-9\s-]{7,20}$/;
  if (!phoneRegex.test(tel)) {
    notify('Por favor introduce un número de teléfono válido (mín. 7 dígitos).', 'error');
    return;
  }

  // Limpieza básica de caracteres para evitar formateo malicioso en el enlace de WhatsApp
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

  // Abrir WhatsApp con el mensaje construido
  window.open(
    `https://wa.me/${(window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || '18297411041'}?text=${encodeURIComponent(text)}`,
    '_blank'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', sendForm);
  }
});
