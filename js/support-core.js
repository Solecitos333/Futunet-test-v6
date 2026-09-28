/* Shared support validation. No DOM, network or AI credentials. */
(function (root) {
  'use strict';
  const TYPES = { bug: 'Error en la página', complaint: 'Reclamación', help: 'Ayuda con un servicio' };
  const STATUSES = { open: 'Abierto', in_progress: 'En revisión', waiting: 'Esperando al cliente', resolved: 'Resuelto', closed: 'Cerrado' };
  const PRIORITIES = { normal: 'Normal', high: 'Alta', urgent: 'Urgente' };
  const STAFF = ['superadmin', 'admin', 'editor', 'support_agent', 'billing_clerk', 'marketing_manager'];
  const GUIDES = {
    bug: { question: '¿Qué intentabas hacer y qué ocurrió? Incluye los pasos para repetirlo y lo que esperabas ver.', tip: 'Si no hay datos sin guardar, prueba recargar la página. Anota cualquier mensaje de error y si ocurre también en otro navegador. No repitas pagos si no sabes si se procesaron.' },
    complaint: { question: '¿Qué sucedió, cuándo ocurrió y qué solución esperas? Puedes indicar el número de pedido o factura.', tip: 'Revisa el detalle del pedido o servicio en Mi cuenta. Adjunta evidencia del inconveniente y explica la solución que solicitas. El equipo revisará tu caso; este asistente no autoriza reembolsos.' },
    help: { question: '¿Con qué producto o servicio necesitas ayuda y qué has intentado hasta ahora?', tip: 'Indica el producto o servicio afectado y desde cuándo ocurre. Para Internet, revisa la alimentación y las conexiones visibles del equipo. No restablezcas el router de fábrica.' }
  };
  function roles(profile) { return [...new Set([profile?.role, ...(Array.isArray(profile?.roles) ? profile.roles : [])])]; }
  function isStaff(profile) { return !!profile && profile.status !== 'disabled' && !profile.companyCode && roles(profile).some(r => STAFF.includes(r)); }
  function isSupport(profile) { return isStaff(profile) && roles(profile).some(r => ['admin', 'superadmin', 'support_agent'].includes(r)); }
  function canManage(profile, ticket) { return isSupport(profile) || (ticket.source === 'internal' && isStaff(profile)); }
  function clean(value, max, label, min = 0) {
    const text = String(value || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    if (text.length < min || text.length > max) throw new Error(label + ': usa entre ' + min + ' y ' + max + ' caracteres.');
    return text;
  }
  function safePage(value) {
    if (!String(value || '').trim()) return '';
    let url;
    try { url = new URL(value, 'https://futunet.com.do/'); } catch { throw new Error('La dirección de la página no es válida.'); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('La página debe ser una dirección http o https.');
    // Never retain query strings, fragments, credentials or bearer tokens.
    return clean(url.origin + url.pathname, 500, 'Página');
  }
  function draft(input) {
    if (!Object.hasOwn(TYPES, input.type)) throw new Error('Selecciona el tipo de caso.');
    if (!['internal', 'external'].includes(input.source)) throw new Error('Origen no válido.');
    return {
      type: input.source === 'internal' ? 'bug' : input.type, source: input.source,
      title: clean(input.title, 120, 'Asunto', 5), description: clean(input.description, 5000, 'Descripción', 20),
      page: safePage(input.page), reference: clean(input.reference, 100, 'Referencia'),
      attempted: clean(input.attempted, 1000, 'Pasos ya intentados'),
      environment: clean(input.environment, 500, 'Entorno'),
      guided: input.guided === true
    };
  }
  function summary(d) {
    return [TYPES[d.type] + ': ' + d.title, d.description, d.page && 'Página: ' + d.page,
      d.reference && 'Referencia: ' + d.reference, d.attempted && 'Ya intentó: ' + d.attempted,
      d.environment && 'Entorno: ' + d.environment,
      d.guided && 'Orientación inicial consultada: ' + GUIDES[d.type].tip].filter(Boolean).join('\n\n');
  }
  function validateFiles(files) {
    if (files.length > 3) throw new Error('Puedes adjuntar hasta 3 capturas.');
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Solo se admiten imágenes JPG, PNG o WebP.');
      if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Cada captura debe pesar entre 1 byte y 5 MB.');
    }
    return files;
  }
  const api = { TYPES, STATUSES, PRIORITIES, STAFF, GUIDES, roles, isStaff, isSupport, canManage, clean, safePage, draft, summary, validateFiles };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FutunetSupportCore = api;
})(typeof window !== 'undefined' ? window : this);
