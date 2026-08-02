(function () {
  'use strict';
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const loading = document.getElementById('quote-loading');
  const errorState = document.getElementById('quote-error');
  const documentView = document.getElementById('quote-document');
  let quote = null;

  function money(value) { return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(value || 0)); }
  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return '—';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  function setText(id, value) { const element = document.getElementById(id); if (element) element.textContent = value == null ? '' : String(value); }
  function fail(message) { loading.hidden = true; errorState.hidden = false; setText('quote-error-message', message); }
  function db() { return window.FutunetFirebase && window.FutunetFirebase.db; }
  function serverTime() { return firebase.firestore.FieldValue.serverTimestamp(); }

  function render(data) {
    quote = data;
    const issuer = data.issuer || {};
    setText('quote-document-type', data.docType === 'proforma' ? 'Factura proforma' : 'Cotización comercial');
    setText('quote-company-name', issuer.displayName || issuer.legalName || 'Futunet');
    setText('quote-company-details', [issuer.rnc ? `RNC ${issuer.rnc}` : '', issuer.phone || '', issuer.email || '', issuer.address || ''].filter(Boolean).join(' · '));
    setText('quote-number', data.invoiceNumber || '—');
    setText('quote-valid-until', formatDate(data.validUntil));
    setText('quote-client-name', data.clientName || 'Cliente');
    setText('quote-client-document', data.clientDocumentMasked ? `Documento ${data.clientDocumentMasked}` : '');
    setText('quote-date', formatDate(data.date));
    setText('quote-payment-terms', data.paymentTerms || '');
    setText('quote-notes', data.notes || 'Sin observaciones adicionales.');
    setText('quote-subtotal', money(data.subtotal));
    setText('quote-discount', money(data.discountAmount));
    setText('quote-tax', money(data.itbis));
    setText('quote-total', money(data.total));
    const body = document.getElementById('quote-items');
    body.innerHTML = '';
    (Array.isArray(data.items) ? data.items : []).forEach(item => {
      const row = document.createElement('tr');
      [item.description || '', Number(item.qty || 0), money(item.price), money(item.tax), money(item.total)].forEach(value => {
        const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
      });
      body.appendChild(row);
    });
    loading.hidden = true;
    documentView.hidden = false;
    const expired = data.validUntil && data.validUntil < new Date().toISOString().slice(0, 10);
    if (['accepted', 'rejected'].includes(data.responseStatus)) showResult(data.responseStatus);
    else if (expired) {
      document.getElementById('quote-response-form-wrap').hidden = true;
      showResult('expired');
    }
  }

  function showResult(status) {
    document.getElementById('quote-response-form-wrap').hidden = true;
    const result = document.getElementById('quote-response-result');
    result.hidden = false;
    if (status === 'accepted') {
      setText('quote-response-icon', '✓'); setText('quote-response-title', 'Cotización aceptada');
      setText('quote-response-message', 'Tu respuesta quedó registrada. La empresa podrá continuar con el proceso comercial.');
    } else if (status === 'rejected') {
      setText('quote-response-icon', '×'); setText('quote-response-title', 'Cotización rechazada');
      setText('quote-response-message', 'Tu respuesta quedó registrada. La empresa podrá contactarte para revisar alternativas.');
    } else {
      setText('quote-response-icon', '!'); setText('quote-response-title', 'Cotización vencida');
      setText('quote-response-message', 'Solicita una versión actualizada antes de aceptar precios o condiciones.');
    }
  }

  async function respond(status) {
    const name = document.getElementById('quote-signer-name').value.trim();
    const acceptedTerms = document.getElementById('quote-accept-terms').checked;
    if (name.length < 3) { document.getElementById('quote-signer-name').reportValidity(); return; }
    if (!acceptedTerms) { document.getElementById('quote-accept-terms').reportValidity(); return; }
    const buttons = document.querySelectorAll('#quote-response-form button');
    buttons.forEach(button => { button.disabled = true; });
    try {
      await db().collection('public_quote_links').doc(token).update({
        responseStatus: status, signerName: name, responseNote: document.getElementById('quote-response-note').value.trim(),
        acceptedTerms: true, respondedAt: serverTime(), updatedAt: serverTime()
      });
      showResult(status);
    } catch (error) {
      buttons.forEach(button => { button.disabled = false; });
      fail('No se pudo registrar la respuesta. Actualiza la página y vuelve a intentarlo.');
    }
  }

  async function init() {
    if (!/^[a-f0-9]{48}$/.test(token)) { fail('El enlace no contiene un token válido.'); return; }
    try {
      const doc = await db().collection('public_quote_links').doc(token).get();
      if (!doc.exists) { fail('La cotización no existe o el enlace fue retirado.'); return; }
      render(doc.data());
      if (doc.data().responseStatus === 'pending') {
        try {
          await doc.ref.update({ responseStatus: 'viewed', viewedAt: serverTime(), updatedAt: serverTime() });
        } catch (viewError) {
          console.warn('No se pudo registrar la visualización; la cotización permanece disponible.', viewError);
        }
      }
    } catch (error) { fail('No pudimos verificar la cotización. Revisa tu conexión o solicita un enlace nuevo.'); }
  }

  document.getElementById('quote-response-form').addEventListener('submit', event => { event.preventDefault(); respond('accepted'); });
  document.getElementById('quote-reject-button').addEventListener('click', () => respond('rejected'));
  document.getElementById('quote-print-button').addEventListener('click', () => window.print());
  window.addEventListener('load', init);
})();
