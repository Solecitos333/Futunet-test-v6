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

  // Validación — Nombre y teléfono son obligatorios
  if (!nombre || !tel) {
    alert('Por favor completa tu nombre y teléfono.');
    return;
  }

  // Construir el mensaje para WhatsApp
  let text = `Hola Futunet, soy *${nombre}* (${tel}).`;

  if (servicio) {
    text += `\n\nMe interesa: *${servicio}*.`;
  }

  if (msg) {
    text += `\n\nMensaje: ${msg}`;
  }

  text += `\n\n¿Me pueden dar más información?`;

  // Abrir WhatsApp con el mensaje construido
  window.open(
    `https://wa.me/18297411041?text=${encodeURIComponent(text)}`,
    '_blank'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', sendForm);
  }
});
