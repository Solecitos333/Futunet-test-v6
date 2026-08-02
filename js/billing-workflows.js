/** Commercial workflow extensions for billing: drafts, quotes, approvals and collections. */
window.ERPBillingWorkflows = (function () {
  'use strict';

  const Core = window.ERPBillingCore;
  let user = null;
  let companyCode = 'CREATICOS';
  let prefix = 'creaticos';
  let isAdmin = false;
  let initialized = false;
  let latestDraft = null;
  let draftTimer = null;
  let lastDraftWrite = 0;
  let templates = [];
  let reminders = [];
  let approvals = [];

  function db() { return window.FutunetFirebase.db; }
  function serverTime() { return firebase.firestore.FieldValue.serverTimestamp(); }
  function billing() { return window.ERPBilling.getBillingSnapshot(); }
  function money(value) { return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(value || 0)); }
  function localDate(value = new Date()) { return Core.toLocalDateInput(value); }
  function dateLabel(value) { return Core.formatDate(value) || '—'; }
  function asDate(value) {
    if (!value) return null;
    if (value.toDate) return value.toDate();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  function timeLabel(value) {
    const date = asDate(value);
    return date ? date.toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  }
  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(value) { return escapeHTML(value).replace(/`/g, '&#96;'); }
  function notify(message, type = 'info') { window.ERPBilling.showToast(message, type); }
  function collection(name) { return db().collection(`${prefix}_${name}`); }
  function currentSettings() { return billing().settings || {}; }
  function currentInvoices() { return billing().invoices || []; }
  function currentClients() { return billing().clients || []; }
  function currentPayments() { return billing().payments || []; }
  function clientById(id) { return currentClients().find(item => item.id === id) || null; }
  function invoiceById(id) { return currentInvoices().find(item => item.id === id) || null; }
  function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

  function openDialog(title, content, className = '') {
    const overlay = document.createElement('div');
    overlay.className = 'erp-action-dialog is-open';
    overlay.innerHTML = `<section class="erp-action-dialog-card commercial-document-dialog ${className}" role="dialog" aria-modal="true">
      <div class="commercial-card-header" style="padding:0 0 16px;margin-bottom:16px;">
        <h2 style="margin:0;font-size:1.12rem;"></h2>
        <button type="button" class="table-btn table-btn-secondary" data-close-dialog aria-label="Cerrar">×</button>
      </div>
      <div data-dialog-content></div>
    </section>`;
    overlay.querySelector('h2').textContent = title;
    overlay.querySelector('[data-dialog-content]').append(content);
    const close = () => overlay.remove();
    overlay.querySelector('[data-close-dialog]').addEventListener('click', close);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.body.appendChild(overlay);
    setTimeout(() => overlay.querySelector('input,select,button')?.focus(), 0);
    return { overlay, close };
  }

  function formNode(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper;
  }

  function documentSnapshotFromForm() {
    const rows = Array.from(document.querySelectorAll('#invoice-form-items-body tr'));
    return {
      docType: document.getElementById('form-invoice-doc-type')?.value || 'quote',
      clientId: document.getElementById('form-invoice-client-id')?.value || '',
      clientName: document.getElementById('form-invoice-client-name')?.value.trim() || '',
      clientRnc: document.getElementById('form-invoice-client-rnc')?.value.trim() || '',
      date: document.getElementById('form-invoice-date')?.value || localDate(),
      dueDate: document.getElementById('form-invoice-due-date')?.value || '',
      division: document.getElementById('form-invoice-division')?.value || 'general',
      paymentTerms: document.getElementById('form-invoice-payment-terms')?.value || 'Contado',
      notes: document.getElementById('form-invoice-notes')?.value.trim() || '',
      discountPct: Number(document.getElementById('form-invoice-discount-pct')?.value || 0),
      items: rows.map(row => ({
        productId: row.querySelector('.row-product-id')?.value || 'custom',
        description: row.querySelector('.row-product-search')?.value.trim() || '',
        price: Number(row.querySelector('.row-price')?.value || 0),
        qty: Number(row.querySelector('.row-qty')?.value || 1),
        tax: Number(row.querySelector('.row-tax')?.value || 0),
        taxMode: row.querySelector('.row-tax')?.dataset.override === 'true' ? 'amount' : 'rate',
        taxRate: Number(row.querySelector('.row-tax')?.dataset.percent || 0),
        discount: Number(row.querySelector('.row-discount')?.value || 0),
        unitCost: row.querySelector('.row-cost')?.value === '' ? null : Number(row.querySelector('.row-cost')?.value || 0)
      })).filter(item => item.description || item.price > 0)
    };
  }

  function meaningfulDraft(data) {
    return Boolean(data && (data.clientName || data.notes || (Array.isArray(data.items) && data.items.some(item => item.description || item.price > 0))));
  }

  function draftId() { return `${user.uid}_invoice_editor`; }
  function localDraftKey() { return `erp_billing_draft_${companyCode}_${user.uid}`; }
  function setDraftStatus(text, tone) {
    const status = document.getElementById('billing-draft-status');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone || '';
  }

  async function saveDraftNow(options = {}) {
    if (!initialized || !user) return;
    const data = documentSnapshotFromForm();
    if (!meaningfulDraft(data)) {
      setDraftStatus('Sin contenido para guardar', 'muted');
      return;
    }
    setDraftStatus('Guardando borrador…', 'saving');
    const payload = { ownerId: user.uid, companyCode, formType: 'invoice-editor', data, updatedAt: serverTime() };
    try {
      await collection('billing_drafts').doc(draftId()).set(payload, { merge: true });
      latestDraft = { id: draftId(), ...payload, updatedAt: new Date() };
      localStorage.setItem(localDraftKey(), JSON.stringify({ data, savedAt: Date.now() }));
      lastDraftWrite = Date.now();
      setDraftStatus(`Borrador guardado a las ${new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`, 'saved');
      if (!options.silent) notify('Borrador guardado en la cuenta.', 'success');
    } catch (error) {
      localStorage.setItem(localDraftKey(), JSON.stringify({ data, savedAt: Date.now() }));
      setDraftStatus('Guardado temporalmente en este dispositivo', 'warning');
      if (!options.silent) notify('Sin conexión: el borrador quedó guardado temporalmente en este dispositivo.', 'warning');
    }
  }

  function scheduleDraftSave() {
    clearTimeout(draftTimer);
    setDraftStatus('Cambios pendientes…', 'pending');
    draftTimer = setTimeout(() => {
      if (Date.now() - lastDraftWrite < 3500) {
        scheduleDraftSave();
        return;
      }
      saveDraftNow({ silent: true });
    }, 1800);
  }

  async function loadLatestDraft() {
    let cloudDraft = null;
    try {
      const doc = await collection('billing_drafts').doc(draftId()).get();
      if (doc.exists) cloudDraft = { id: doc.id, ...doc.data() };
    } catch (error) {
      console.warn('Cloud draft unavailable', error);
    }
    let localDraft = null;
    try {
      const raw = localStorage.getItem(localDraftKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        localDraft = { id: draftId(), data: parsed.data, updatedAt: new Date(parsed.savedAt) };
      }
    } catch (error) { localStorage.removeItem(localDraftKey()); }
    const cloudDate = asDate(cloudDraft && cloudDraft.updatedAt);
    const localDateValue = asDate(localDraft && localDraft.updatedAt);
    latestDraft = cloudDate && (!localDateValue || cloudDate >= localDateValue) ? cloudDraft : localDraft;
    const banner = document.getElementById('billing-draft-banner');
    if (!banner || !latestDraft || !meaningfulDraft(latestDraft.data)) return;
    banner.hidden = false;
    const updated = document.getElementById('billing-draft-updated');
    if (updated) updated.textContent = `Última actualización: ${timeLabel(latestDraft.updatedAt)}`;
  }

  function restoreLatestDraft() {
    if (!latestDraft || !meaningfulDraft(latestDraft.data)) return;
    window.ERPBilling.populateInvoiceForm(latestDraft.data, { title: 'Borrador recuperado' });
    document.getElementById('billing-draft-banner').hidden = true;
    setDraftStatus('Borrador restaurado; revisa antes de guardar', 'warning');
    notify('Borrador restaurado como documento editable.', 'success');
  }

  async function discardLatestDraft() {
    const confirmed = await window.ERPBilling.confirmAction('¿Descartar el borrador recuperable?', { title: 'Descartar borrador', confirmLabel: 'Descartar', tone: 'danger' });
    if (!confirmed) return;
    await clearLatestDraft();
    notify('Borrador descartado.', 'success');
  }

  async function clearLatestDraft() {
    latestDraft = null;
    localStorage.removeItem(localDraftKey());
    document.getElementById('billing-draft-banner')?.setAttribute('hidden', '');
    setDraftStatus('Sin cambios pendientes', 'muted');
    try { await collection('billing_drafts').doc(draftId()).delete(); } catch (error) { console.warn('Unable to clear cloud draft', error); }
  }

  function updateFormCommercialMetrics(items, globalDiscountPct) {
    const metrics = Core.calculateCommercialMetrics(items, globalDiscountPct);
    const settings = currentSettings();
    const card = document.getElementById('commercial-margin-card');
    if (!card) return metrics;
    const coverageRequired = Number(settings.minimumCostCoveragePct == null ? 80 : settings.minimumCostCoveragePct);
    const marginRequired = Number(settings.minimumMarginPct == null ? 15 : settings.minimumMarginPct);
    const marginValue = document.getElementById('commercial-margin-value');
    const profitValue = document.getElementById('commercial-profit-value');
    const coverageValue = document.getElementById('commercial-coverage-value');
    const guidance = document.getElementById('commercial-margin-guidance');
    card.classList.remove('is-healthy', 'is-warning', 'is-danger');
    coverageValue.textContent = `${metrics.costCoveragePct.toFixed(0)}%`;
    if (metrics.costCoveragePct < coverageRequired) {
      marginValue.textContent = 'Cobertura insuficiente';
      profitValue.textContent = metrics.coveredRows ? money(metrics.grossProfit) : '—';
      guidance.textContent = `Faltan costos en parte de la propuesta. Se requiere ${coverageRequired}% de cobertura para controlar el margen.`;
      card.classList.add('is-warning');
    } else {
      marginValue.textContent = `${metrics.marginPct.toFixed(1)}%`;
      profitValue.textContent = money(metrics.grossProfit);
      if (metrics.marginPct < marginRequired) {
        guidance.textContent = `El margen está por debajo de la política de ${marginRequired}%. Requerirá aprobación administrativa.`;
        card.classList.add('is-danger');
      } else {
        guidance.textContent = `La operación cumple el margen mínimo configurado de ${marginRequired}%.`;
        card.classList.add('is-healthy');
      }
    }
    return metrics;
  }

  async function authorizeDocument(invoiceData) {
    const settings = currentSettings();
    if (settings.commercialApprovalEnabled === false) return { allowed: true };
    const metrics = invoiceData.commercialMetrics || Core.calculateCommercialMetrics(invoiceData.items, invoiceData.discountPct);
    const reasons = Core.commercialApprovalReasons(metrics, settings);
    if (!reasons.length) return { allowed: true };
    if (isAdmin) {
      invoiceData.commercialOverride = { reasons, authorizedBy: user.uid };
      await recordEvent('', 'commercial_override', `Excepción autorizada por administrador: ${reasons.join('; ')}`, { reasons });
      return { allowed: true };
    }
    const fingerprint = Core.stableCommercialFingerprint(invoiceData);
    const requestId = `${user.uid}_${fingerprint}`;
    const ref = collection('approval_requests').doc(requestId);
    const existing = await ref.get();
    if (existing.exists && existing.data().status === 'approved') {
      return { allowed: true, approvalId: requestId };
    }
    const requestData = {
      companyCode,
      fingerprint,
      requestedBy: user.uid,
      requestedByEmail: user.email || '',
      clientName: invoiceData.clientName || '',
      docType: invoiceData.docType,
      total: Number(invoiceData.total || 0),
      reasons,
      metrics,
      documentSnapshot: { ...invoiceData, updatedAt: null },
      status: 'pending',
      requestedAt: serverTime(),
      updatedAt: serverTime()
    };
    await ref.set(requestData, { merge: true });
    notify('La operación quedó pendiente de aprobación. El borrador se conservará para continuar después.', 'warning');
    await saveDraftNow({ silent: true });
    return { allowed: false, approvalId: requestId };
  }

  async function recordEvent(documentId, action, summary, metadata = {}) {
    if (!user) return;
    await collection('document_events').add({
      companyCode, documentId: documentId || 'commercial', action, summary: String(summary || '').slice(0, 1000),
      metadata, userId: user.uid, userEmail: user.email || '', timestamp: serverTime()
    });
  }

  async function load() {
    if (!initialized) return;
    let quoteRows = currentInvoices().filter(item => ['quote', 'proforma'].includes(item.docType));
    await syncPublicResponses(quoteRows);
    quoteRows = currentInvoices().filter(item => ['quote', 'proforma'].includes(item.docType));
    await Promise.all([loadApprovals(), loadReminders(), loadTemplates()]);
    renderQuotes(quoteRows);
    refreshKpis();
    renderStockSuggestions();
    renderComplianceChecks();
    refreshIcons();
  }

  async function syncPublicResponses(quotes) {
    try {
      const snapshot = await db().collection('public_quote_links').where('companyCode', '==', companyCode).limit(250).get();
      const quoteMap = new Map(quotes.map(item => [item.id, item]));
      const updates = [];
      const synchronizedResponses = [];
      snapshot.docs.forEach(doc => {
        const link = doc.data();
        const quote = quoteMap.get(link.sourceDocumentId);
        if (!quote || !['viewed', 'accepted', 'rejected'].includes(link.responseStatus)) return;
        const current = Core.quoteWorkflowMeta(quote.workflowStatus, quote.validUntil || quote.dueDate).status;
        if (current === link.responseStatus || ['converted'].includes(current)) return;
        updates.push(collection('invoices').doc(quote.id).update({
          workflowStatus: link.responseStatus,
          clientResponseName: link.signerName || '',
          clientResponseNote: link.responseNote || '',
          clientRespondedAt: link.respondedAt || link.viewedAt || serverTime(),
          updatedBy: user.uid,
          updatedAt: serverTime()
        }));
        synchronizedResponses.push({
          quoteId: quote.id,
          status: link.responseStatus,
          signerName: link.signerName || '',
          note: link.responseNote || ''
        });
      });
      await Promise.all(updates);
      await Promise.all(synchronizedResponses.map(response => recordEvent(
        response.quoteId,
        `quote_${response.status}`,
        response.status === 'viewed'
          ? 'El cliente abrió el enlace seguro de la cotización.'
          : `El cliente marcó la cotización como ${response.status === 'accepted' ? 'aceptada' : 'rechazada'}.`,
        { signerName: response.signerName, note: response.note, source: 'public_link' }
      )));
      if (updates.length) await window.ERPBilling.reloadData();
    } catch (error) { console.warn('Unable to synchronize public quote responses', error); }
  }

  function renderQuotes(rows) {
    const body = document.getElementById('commercial-quotes-body');
    if (!body) return;
    const sorted = rows.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    if (!sorted.length) {
      body.innerHTML = '<tr><td colspan="7" class="erp-empty-state">Todavía no hay cotizaciones o proformas.</td></tr>';
      return;
    }
    body.innerHTML = sorted.slice(0, 250).map(item => {
      const meta = Core.quoteWorkflowMeta(item.workflowStatus, item.validUntil || item.dueDate);
      const activity = item.clientRespondedAt || item.sharedAt || item.updatedAt || item.createdAt;
      const actions = [
        `<button type="button" class="table-btn table-btn-primary" title="Ver" data-erp-click="ERPBilling.viewInvoice('${escapeAttr(item.id)}')">Ver</button>`,
        `<button type="button" class="table-btn table-btn-secondary" title="Compartir" data-erp-click="ERPBillingWorkflows.openShareDialog('${escapeAttr(item.id)}')">Compartir</button>`,
        `<button type="button" class="table-btn table-btn-secondary" title="Duplicar" data-erp-click="ERPBilling.duplicateDocument('${escapeAttr(item.id)}')">Duplicar</button>`,
        `<button type="button" class="table-btn table-btn-secondary" title="Historial" data-erp-click="ERPBillingWorkflows.openHistoryDialog('${escapeAttr(item.id)}')">Historial</button>`
      ];
      if (!['accepted', 'converted'].includes(meta.status)) {
        actions.push(`<button type="button" class="table-btn table-btn-success" data-erp-click="ERPBillingWorkflows.setQuoteStatus('${escapeAttr(item.id)}','accepted')">Aceptar</button>`);
      }
      if (!['rejected', 'converted'].includes(meta.status)) {
        actions.push(`<button type="button" class="table-btn table-btn-danger" data-erp-click="ERPBillingWorkflows.setQuoteStatus('${escapeAttr(item.id)}','rejected')">Rechazar</button>`);
      }
      return `<tr><td><strong>${escapeHTML(item.invoiceNumber)}</strong><small>${item.docType === 'proforma' ? 'Proforma' : 'Cotización'} · v${Number(item.version || 1)}</small></td>
        <td>${escapeHTML(item.clientName)}</td><td>${escapeHTML(dateLabel(item.validUntil || item.dueDate))}</td>
        <td><span class="admin-badge commercial-status is-${meta.tone}">${escapeHTML(meta.label)}</span></td>
        <td>${escapeHTML(money(item.total))}</td><td>${escapeHTML(timeLabel(activity))}</td><td><div class="table-actions">${actions.join('')}</div></td></tr>`;
    }).join('');
  }

  async function setQuoteStatus(id, status) {
    if (!Core.QUOTE_WORKFLOW_STATUSES.includes(status) || ['draft', 'converted'].includes(status)) return;
    const source = invoiceById(id) || (await collection('invoices').doc(id).get()).data();
    if (!source || !['quote', 'proforma'].includes(source.docType)) return;
    if (status === 'accepted' && !isAdmin) {
      notify('La aceptación manual requiere un administrador; también puede aceptarla el cliente desde su enlace seguro.', 'warning');
      return;
    }
    const confirmed = await window.ERPBilling.confirmAction(`¿Marcar ${source.invoiceNumber || 'el documento'} como ${status === 'accepted' ? 'aceptado' : 'rechazado'}?`, {
      title: 'Actualizar cotización', confirmLabel: 'Actualizar', tone: status === 'rejected' ? 'danger' : ''
    });
    if (!confirmed) return;
    await collection('invoices').doc(id).update({ workflowStatus: status, clientRespondedAt: serverTime(), updatedBy: user.uid, updatedAt: serverTime() });
    await recordEvent(id, `quote_${status}`, `Documento marcado como ${status}.`);
    await window.ERPBilling.reloadData();
    await load();
    notify('Estado comercial actualizado.', 'success');
  }

  function sanitizedPublicQuote(invoice) {
    const rnc = String(invoice.clientRnc || '').replace(/\D/g, '');
    return {
      invoiceNumber: invoice.invoiceNumber || '',
      docType: invoice.docType,
      companyCode,
      issuer: invoice.issuerSnapshot || {},
      clientName: invoice.clientName || '',
      clientDocumentMasked: rnc ? `${'*'.repeat(Math.max(0, rnc.length - 4))}${rnc.slice(-4)}` : '',
      date: invoice.date || '',
      validUntil: invoice.validUntil || invoice.dueDate || '',
      paymentTerms: invoice.paymentTerms || '',
      notes: invoice.notes || '',
      items: (invoice.items || []).map(item => ({
        description: item.description || '', qty: Number(item.qty || 0), price: Number(item.price || 0),
        discount: Number(item.discount || 0), tax: Number(item.tax || 0), total: Number(item.total || 0)
      })),
      subtotal: Number(invoice.subtotal || 0), discountAmount: Number(invoice.discountAmount || 0),
      itbis: Number(invoice.itbis || 0), total: Number(invoice.total || 0)
    };
  }

  async function ensurePublicLink(invoice) {
    let token = invoice.publicShareToken || '';
    if (!token) {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      token = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
    }
    const origin = window.location.origin;
    const url = `${origin}/cotizacion.html?token=${encodeURIComponent(token)}`;
    const linkRef = db().collection('public_quote_links').doc(token);
    const existing = await linkRef.get();
    const payload = {
      ...sanitizedPublicQuote(invoice),
      sourceDocumentId: invoice.id,
      responseStatus: existing.exists ? (existing.data().responseStatus || 'pending') : 'pending',
      createdBy: existing.exists ? (existing.data().createdBy || user.uid) : user.uid,
      createdAt: existing.exists ? (existing.data().createdAt || serverTime()) : serverTime(),
      updatedAt: serverTime()
    };
    const batch = db().batch();
    batch.set(linkRef, payload, { merge: true });
    batch.update(collection('invoices').doc(invoice.id), {
      publicShareToken: token,
      publicShareUrl: url,
      workflowStatus: invoice.workflowStatus === 'accepted' ? 'accepted' : 'sent',
      sharedAt: serverTime(), updatedBy: user.uid, updatedAt: serverTime()
    });
    await batch.commit();
    return { token, url };
  }

  async function openShareDialog(id) {
    let invoice = invoiceById(id);
    if (!invoice) {
      const doc = await collection('invoices').doc(id).get();
      invoice = doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
    if (!invoice || !['quote', 'proforma'].includes(invoice.docType)) {
      notify('Solo las cotizaciones y proformas pueden solicitar aceptación.', 'warning');
      return;
    }
    const link = await ensurePublicLink(invoice);
    await recordEvent(id, 'quote_shared', 'Se preparó un enlace seguro de revisión y aceptación.', { channel: 'link' });
    const client = clientById(invoice.clientId) || invoice.customerSnapshot || {};
    const message = `Hola ${invoice.clientName || ''}, puedes revisar y responder la ${invoice.docType === 'proforma' ? 'proforma' : 'cotización'} ${invoice.invoiceNumber}: ${link.url}`;
    const content = formNode(`<div class="commercial-dialog-grid">
      <div class="form-group is-wide"><label>Enlace protegido por token</label><div class="commercial-share-link" id="commercial-share-url">${escapeHTML(link.url)}</div></div>
      <button type="button" class="admin-btn admin-btn-secondary" data-share-channel="copy">Copiar enlace</button>
      <button type="button" class="admin-btn admin-btn-secondary" data-share-channel="whatsapp">Abrir WhatsApp</button>
      <button type="button" class="admin-btn admin-btn-secondary" data-share-channel="email">Preparar correo</button>
      <button type="button" class="admin-btn admin-btn-secondary" data-share-channel="pdf">Abrir para PDF</button>
      <p class="form-help is-wide">El enlace contiene únicamente la cotización, oculta la identificación completa y registra la respuesta del cliente. No se envía nada sin tu acción.</p>
    </div>`);
    const dialog = openDialog(`Compartir ${invoice.invoiceNumber}`, content);
    content.querySelectorAll('[data-share-channel]').forEach(button => button.addEventListener('click', async () => {
      const channel = button.dataset.shareChannel;
      if (channel === 'copy') {
        await navigator.clipboard.writeText(link.url);
        notify('Enlace copiado.', 'success');
      } else if (channel === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      } else if (channel === 'email') {
        window.location.href = `mailto:${encodeURIComponent(client.email || '')}?subject=${encodeURIComponent(`${invoice.docType === 'proforma' ? 'Proforma' : 'Cotización'} ${invoice.invoiceNumber}`)}&body=${encodeURIComponent(message)}`;
      } else if (channel === 'pdf') {
        dialog.close();
        await window.ERPBilling.viewInvoice(invoice.id);
        notify('Usa “Descargar PDF” para adjuntarlo al mensaje.', 'info');
      }
      if (channel !== 'pdf') await recordEvent(invoice.id, 'delivery_prepared', `Comunicación preparada por ${channel}.`, { channel, recipient: client.email || client.phone || '' });
    }));
  }

  async function loadApprovals() {
    const card = document.getElementById('commercial-approvals-card');
    if (card) card.hidden = !isAdmin;
    if (!isAdmin) return;
    try {
      const snapshot = await collection('approval_requests').limit(250).get();
      approvals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (asDate(b.requestedAt)?.getTime() || 0) - (asDate(a.requestedAt)?.getTime() || 0));
      const body = document.getElementById('commercial-approvals-body');
      if (!approvals.length) { body.innerHTML = '<tr><td colspan="7" class="erp-empty-state">No hay excepciones pendientes.</td></tr>'; return; }
      body.innerHTML = approvals.map(item => `<tr><td>${escapeHTML(timeLabel(item.requestedAt))}</td><td>${escapeHTML(item.requestedByEmail)}</td><td>${escapeHTML(item.clientName)}</td>
        <td>${escapeHTML((item.reasons || []).join(' · '))}</td><td>${escapeHTML(money(item.total))}</td>
        <td><span class="admin-badge commercial-status is-${item.status === 'approved' ? 'green' : (item.status === 'rejected' ? 'red' : 'orange')}">${escapeHTML(item.status === 'approved' ? 'Aprobada' : (item.status === 'rejected' ? 'Rechazada' : 'Pendiente'))}</span></td>
        <td>${item.status === 'pending' ? `<div class="table-actions"><button type="button" class="table-btn table-btn-success" data-erp-click="ERPBillingWorkflows.reviewApproval('${escapeAttr(item.id)}','approved')">Aprobar</button><button type="button" class="table-btn table-btn-danger" data-erp-click="ERPBillingWorkflows.reviewApproval('${escapeAttr(item.id)}','rejected')">Rechazar</button></div>` : escapeHTML(item.reviewReason || '—')}</td></tr>`).join('');
    } catch (error) {
      document.getElementById('commercial-approvals-body').innerHTML = `<tr><td colspan="7" class="erp-empty-state is-error">${escapeHTML(error.message)}</td></tr>`;
    }
  }

  async function reviewApproval(id, status) {
    if (!isAdmin || !['approved', 'rejected'].includes(status)) return;
    const reason = await window.ERPBilling.promptAction(status === 'approved' ? 'Añade una nota de autorización.' : 'Indica qué debe corregirse.', {
      title: status === 'approved' ? 'Aprobar excepción' : 'Rechazar excepción', inputLabel: 'Nota', required: true,
      confirmLabel: status === 'approved' ? 'Aprobar' : 'Rechazar', tone: status === 'rejected' ? 'danger' : ''
    });
    if (reason === null) return;
    await collection('approval_requests').doc(id).update({ status, reviewReason: reason, reviewedBy: user.uid, reviewedAt: serverTime(), updatedAt: serverTime() });
    await recordEvent(id, `approval_${status}`, reason);
    await loadApprovals();
    notify(status === 'approved' ? 'Excepción aprobada.' : 'Excepción rechazada.', 'success');
  }

  function outstandingInvoices() {
    return currentInvoices().filter(item => item.docType === 'invoice' && item.status !== 'cancelled' && Number(item.total || 0) - Number(item.paidAmount || 0) > .009);
  }

  function openReminderDialog(invoiceId = '') {
    const rows = outstandingInvoices();
    if (!rows.length) { notify('No hay facturas pendientes para programar.', 'info'); return; }
    const options = rows.map(item => `<option value="${escapeAttr(item.id)}" ${item.id === invoiceId ? 'selected' : ''}>${escapeHTML(item.invoiceNumber)} · ${escapeHTML(item.clientName)} · ${escapeHTML(money(Number(item.total || 0) - Number(item.paidAmount || 0)))}</option>`).join('');
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + Number(currentSettings().collectionReminderDays || 3));
    const content = formNode(`<form id="commercial-reminder-form" class="commercial-dialog-grid">
      <div class="form-group is-wide"><label for="commercial-reminder-invoice">Factura</label><select id="commercial-reminder-invoice" class="form-input" required>${options}</select></div>
      <div class="form-group"><label for="commercial-reminder-date">Fecha</label><input id="commercial-reminder-date" class="form-input" type="date" value="${localDate(defaultDate)}" required></div>
      <div class="form-group"><label for="commercial-reminder-channel">Canal</label><select id="commercial-reminder-channel" class="form-input"><option value="whatsapp">WhatsApp</option><option value="email">Correo</option><option value="phone">Llamada</option></select></div>
      <div class="form-group is-wide"><label for="commercial-reminder-note">Nota</label><input id="commercial-reminder-note" class="form-input" maxlength="300" placeholder="Seguimiento acordado, promesa de pago…"></div>
      <div class="erp-form-actions is-wide"><button type="submit" class="admin-btn admin-btn-primary">Programar recordatorio</button></div>
    </form>`);
    const dialog = openDialog('Programar recordatorio de cobro', content);
    content.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();
      const invoice = invoiceById(content.querySelector('#commercial-reminder-invoice').value);
      if (!invoice) return;
      await collection('collection_reminders').add({
        companyCode, invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber || '', clientId: invoice.clientId || '', clientName: invoice.clientName || '',
        scheduledFor: content.querySelector('#commercial-reminder-date').value, channel: content.querySelector('#commercial-reminder-channel').value,
        note: content.querySelector('#commercial-reminder-note').value.trim(), status: 'scheduled', createdBy: user.uid, createdAt: serverTime(), updatedAt: serverTime()
      });
      await recordEvent(invoice.id, 'collection_reminder_scheduled', 'Recordatorio de cobro programado.');
      dialog.close();
      await loadReminders();
      notify('Recordatorio programado.', 'success');
    });
  }

  async function loadReminders() {
    const list = document.getElementById('commercial-reminders-list');
    if (!list) return;
    try {
      const snapshot = await collection('collection_reminders').limit(250).get();
      reminders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => String(a.scheduledFor).localeCompare(String(b.scheduledFor)));
      if (!reminders.length) { list.innerHTML = '<div class="erp-empty-state">No hay recordatorios programados.</div>'; return; }
      list.innerHTML = reminders.slice(0, 100).map(item => `<article class="commercial-list-item"><div><strong>${escapeHTML(item.clientName)} · ${escapeHTML(item.invoiceNumber)}</strong><small>${escapeHTML(dateLabel(item.scheduledFor))} · ${escapeHTML(item.channel)} · ${escapeHTML(item.note || 'Sin nota')}</small></div><div class="commercial-list-actions">
        <span class="admin-badge commercial-status is-${item.status === 'completed' ? 'green' : (item.status === 'prepared' ? 'blue' : 'orange')}">${escapeHTML(item.status === 'completed' ? 'Completado' : (item.status === 'prepared' ? 'Preparado' : 'Programado'))}</span>
        ${item.status !== 'completed' ? `<button type="button" class="table-btn table-btn-primary" data-erp-click="ERPBillingWorkflows.prepareReminder('${escapeAttr(item.id)}')">Preparar</button><button type="button" class="table-btn table-btn-success" data-erp-click="ERPBillingWorkflows.completeReminder('${escapeAttr(item.id)}')">Completar</button>` : ''}
      </div></article>`).join('');
    } catch (error) { list.innerHTML = `<div class="erp-empty-state is-error">${escapeHTML(error.message)}</div>`; }
  }

  async function prepareReminder(id) {
    const reminder = reminders.find(item => item.id === id);
    const invoice = reminder && invoiceById(reminder.invoiceId);
    if (!reminder || !invoice) return;
    const client = clientById(invoice.clientId) || invoice.customerSnapshot || {};
    const balance = Number(invoice.total || 0) - Number(invoice.paidAmount || 0);
    const message = `Hola ${invoice.clientName}, te recordamos que la factura ${invoice.invoiceNumber} presenta un balance de ${money(balance)} con vencimiento ${dateLabel(invoice.dueDate)}. Quedamos atentos para ayudarte.`;
    if (reminder.channel === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    if (reminder.channel === 'email') window.location.href = `mailto:${encodeURIComponent(client.email || '')}?subject=${encodeURIComponent(`Recordatorio ${invoice.invoiceNumber}`)}&body=${encodeURIComponent(message)}`;
    if (reminder.channel === 'phone') await navigator.clipboard.writeText(message);
    await collection('collection_reminders').doc(id).update({ status: 'prepared', preparedAt: serverTime(), preparedBy: user.uid, updatedAt: serverTime() });
    await recordEvent(invoice.id, 'collection_message_prepared', `Recordatorio preparado por ${reminder.channel}.`, { channel: reminder.channel });
    await loadReminders();
    notify('Comunicación preparada. Márcala como completada después de contactar al cliente.', 'success');
  }

  async function completeReminder(id) {
    const reminder = reminders.find(item => item.id === id);
    if (!reminder) return;
    await collection('collection_reminders').doc(id).update({ status: 'completed', completedAt: serverTime(), completedBy: user.uid, updatedAt: serverTime() });
    await recordEvent(reminder.invoiceId, 'collection_reminder_completed', 'Seguimiento de cobro completado.');
    await loadReminders();
  }

  function openStatementDialog() {
    const clients = currentClients().filter(client => currentInvoices().some(invoice => invoice.clientId === client.id));
    if (!clients.length) { notify('No hay clientes con documentos para generar un estado de cuenta.', 'info'); return; }
    const options = clients.sort((a, b) => String(a.name).localeCompare(String(b.name))).map(client => `<option value="${escapeAttr(client.id)}">${escapeHTML(client.name)} · ${escapeHTML(client.rnc || 'Sin identificación')}</option>`).join('');
    const content = formNode(`<form class="commercial-dialog-grid"><div class="form-group is-wide"><label for="statement-client">Cliente</label><select id="statement-client" class="form-input" required>${options}</select></div><div class="erp-form-actions is-wide"><button type="submit" class="admin-btn admin-btn-primary">Descargar estado de cuenta PDF</button></div></form>`);
    const dialog = openDialog('Generar estado de cuenta', content);
    content.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();
      await downloadStatement(content.querySelector('#statement-client').value);
      dialog.close();
    });
  }

  async function downloadStatement(clientId) {
    const client = clientById(clientId);
    if (!client) return;
    const invoices = currentInvoices().filter(item => item.clientId === clientId && item.docType === 'invoice' && item.status !== 'cancelled').sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const payments = currentPayments().filter(item => invoices.some(invoice => invoice.id === item.invoiceId));
    const rows = invoices.map(invoice => {
      const paid = payments.filter(payment => payment.invoiceId === invoice.id).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      return { ...invoice, paid: Math.max(Number(invoice.paidAmount || 0), paid), balance: Math.max(0, Number(invoice.total || 0) - Number(invoice.paidAmount || 0)) };
    });
    const balance = rows.reduce((sum, item) => sum + item.balance, 0);
    const element = document.createElement('div');
    element.className = 'statement-print';
    element.innerHTML = `<h1>Estado de cuenta</h1><p><strong>${escapeHTML(currentSettings().name || companyCode)}</strong></p><p>Cliente: ${escapeHTML(client.name)} · ${escapeHTML(client.rnc || '')}</p><p>Generado: ${escapeHTML(new Date().toLocaleString('es-DO'))}</p>
      <table><thead><tr><th>Documento</th><th>Emisión</th><th>Vencimiento</th><th>Total</th><th>Abonado</th><th>Balance</th><th>Estado</th></tr></thead><tbody>${rows.map(item => `<tr><td>${escapeHTML(item.invoiceNumber)}</td><td>${escapeHTML(dateLabel(item.date))}</td><td>${escapeHTML(dateLabel(item.dueDate))}</td><td>${escapeHTML(money(item.total))}</td><td>${escapeHTML(money(item.paid))}</td><td>${escapeHTML(money(item.balance))}</td><td>${item.balance <= .009 ? 'Saldada' : (Core.isOverdue(item.dueDate, item.balance) ? 'Vencida' : 'Pendiente')}</td></tr>`).join('')}</tbody></table>
      ${payments.length ? `<h2 style="font-size:14px;margin:18px 0 0;">Historial de abonos</h2><table><thead><tr><th>Fecha</th><th>Documento</th><th>Método</th><th>Referencia</th><th>Monto</th></tr></thead><tbody>${payments.sort((a, b) => (asDate(a.timestamp)?.getTime() || 0) - (asDate(b.timestamp)?.getTime() || 0)).map(payment => { const invoice = rows.find(item => item.id === payment.invoiceId); return `<tr><td>${escapeHTML(timeLabel(payment.timestamp))}</td><td>${escapeHTML(invoice ? invoice.invoiceNumber : payment.invoiceId)}</td><td>${escapeHTML(payment.method || '')}</td><td>${escapeHTML(payment.notes || '')}</td><td>${escapeHTML(money(payment.amount))}</td></tr>`; }).join('')}</tbody></table>` : ''}
      <p class="statement-total"><strong>Balance pendiente: ${escapeHTML(money(balance))}</strong></p>`;
    document.body.appendChild(element);
    try {
      await html2pdf().set({ margin: 10, filename: `Estado_de_cuenta_${String(client.name || 'cliente').replace(/[^a-z0-9]+/gi, '_')}.pdf`, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' } }).from(element).save();
      await recordEvent(clientId, 'statement_downloaded', `Estado de cuenta generado para ${client.name}.`);
    } finally { element.remove(); }
  }

  function openTemplateDialog() {
    const snapshot = documentSnapshotFromForm();
    if (!meaningfulDraft(snapshot)) { notify('Completa al menos el cliente o un concepto antes de crear la plantilla.', 'warning'); return; }
    const content = formNode(`<form class="commercial-dialog-grid">
      <div class="form-group is-wide"><label for="template-name">Nombre de la plantilla</label><input id="template-name" class="form-input" maxlength="100" required placeholder="Ej. Mantenimiento mensual"></div>
      <div class="form-group"><label for="template-frequency">Frecuencia</label><select id="template-frequency" class="form-input"><option value="none">Sin recurrencia</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option><option value="quarterly">Trimestral</option></select></div>
      <div class="form-group"><label for="template-next-date">Próxima generación</label><input id="template-next-date" class="form-input" type="date" value="${snapshot.dueDate || localDate()}"></div>
      <label class="commercial-check-option is-wide"><input type="checkbox" id="template-active" checked><span><strong>Plantilla activa</strong><small>La recurrencia prepara borradores para revisión; no emite facturas ni NCF automáticamente.</small></span></label>
      <div class="erp-form-actions is-wide"><button type="submit" class="admin-btn admin-btn-primary">Guardar plantilla</button></div>
    </form>`);
    const dialog = openDialog('Guardar plantilla comercial', content);
    content.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();
      const frequency = content.querySelector('#template-frequency').value;
      await collection('billing_templates').add({
        companyCode, name: content.querySelector('#template-name').value.trim(), frequency,
        nextRunDate: frequency === 'none' ? '' : content.querySelector('#template-next-date').value,
        active: content.querySelector('#template-active').checked, snapshot, createdBy: user.uid, createdByEmail: user.email || '', createdAt: serverTime(), updatedAt: serverTime()
      });
      await recordEvent('', 'template_created', `Plantilla ${content.querySelector('#template-name').value.trim()} creada.`);
      dialog.close();
      await loadTemplates();
      notify('Plantilla guardada.', 'success');
    });
  }

  async function loadTemplates() {
    const list = document.getElementById('commercial-templates-list');
    if (!list) return;
    try {
      const snapshot = await collection('billing_templates').limit(200).get();
      templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => String(a.name).localeCompare(String(b.name)));
      if (!templates.length) { list.innerHTML = '<div class="erp-empty-state">No hay plantillas guardadas.</div>'; return; }
      const today = localDate();
      list.innerHTML = templates.map(item => {
        const due = item.active && item.frequency !== 'none' && item.nextRunDate && item.nextRunDate <= today;
        return `<article class="commercial-list-item"><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.frequency === 'none' ? 'Uso manual' : `${item.frequency} · próxima ${dateLabel(item.nextRunDate)}`)}${due ? ' · lista para generar' : ''}</small></div><div class="commercial-list-actions">
          ${due ? '<span class="admin-badge commercial-status is-orange">Pendiente</span>' : ''}
          <button type="button" class="table-btn table-btn-primary" data-erp-click="ERPBillingWorkflows.loadTemplate('${escapeAttr(item.id)}')">Usar</button>
          ${item.frequency !== 'none' ? `<button type="button" class="table-btn table-btn-success" data-erp-click="ERPBillingWorkflows.generateRecurringDraft('${escapeAttr(item.id)}')">Generar ciclo</button>` : ''}
          ${(isAdmin || item.createdBy === user.uid) ? `<button type="button" class="table-btn table-btn-danger" data-erp-click="ERPBillingWorkflows.deleteTemplate('${escapeAttr(item.id)}')">Eliminar</button>` : ''}
        </div></article>`;
      }).join('');
    } catch (error) { list.innerHTML = `<div class="erp-empty-state is-error">${escapeHTML(error.message)}</div>`; }
  }

  function loadTemplate(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    window.ERPBilling.populateInvoiceForm(template.snapshot, { refreshDates: true, title: template.name });
    notify('Plantilla cargada como borrador editable.', 'success');
  }

  async function generateRecurringDraft(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    loadTemplate(id);
    const nextRunDate = Core.nextRecurringDate(template.nextRunDate || localDate(), template.frequency);
    await collection('billing_templates').doc(id).update({ lastGeneratedDate: localDate(), nextRunDate, updatedAt: serverTime() });
    await saveDraftNow({ silent: true });
    await recordEvent('', 'recurring_draft_generated', `Borrador recurrente generado desde ${template.name}.`, { templateId: id, nextRunDate });
    await loadTemplates();
  }

  async function deleteTemplate(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    if (!await window.ERPBilling.confirmAction(`¿Eliminar la plantilla “${template.name}”?`, { title: 'Eliminar plantilla', confirmLabel: 'Eliminar', tone: 'danger' })) return;
    await collection('billing_templates').doc(id).delete();
    await loadTemplates();
  }

  function refreshKpis() {
    if (!initialized || !document.getElementById('commercial-kpi-stats')) return;
    const invoices = currentInvoices();
    const quotes = invoices.filter(item => ['quote', 'proforma'].includes(item.docType));
    const converted = quotes.filter(item => item.status === 'converted' || item.convertedTo || item.workflowStatus === 'converted').length;
    const sales = invoices.filter(item => item.docType === 'invoice' && item.status !== 'cancelled');
    let netSales = 0;
    let cost = 0;
    let costCoveredSales = 0;
    sales.forEach(invoice => {
      const metrics = invoice.commercialMetrics || Core.calculateCommercialMetrics(invoice.items, invoice.discountPct);
      netSales += Number(metrics.netSales || 0);
      cost += Number(metrics.totalCost || 0);
      costCoveredSales += Number(metrics.netSales || 0) * (Number(metrics.costCoveragePct || 0) / 100);
    });
    const paidDays = sales.filter(item => item.status === 'paid').map(invoice => {
      const issued = Core.parseDateOnly(invoice.date);
      const lastPayment = currentPayments().filter(payment => payment.invoiceId === invoice.id).map(payment => asDate(payment.timestamp)).filter(Boolean).sort((a, b) => b - a)[0];
      return issued && lastPayment ? Math.max(0, Math.round((lastPayment - issued) / 86400000)) : null;
    }).filter(value => value !== null);
    const pending = sales.reduce((sum, item) => sum + Math.max(0, Number(item.total || 0) - Number(item.paidAmount || 0)), 0);
    const overdue = sales.filter(item => Core.isOverdue(item.dueDate, Number(item.total || 0) - Number(item.paidAmount || 0))).reduce((sum, item) => sum + Math.max(0, Number(item.total || 0) - Number(item.paidAmount || 0)), 0);
    document.getElementById('commercial-kpi-conversion').textContent = quotes.length ? `${((converted / quotes.length) * 100).toFixed(1)}%` : 'Sin cotizaciones';
    document.getElementById('commercial-kpi-margin').textContent = costCoveredSales > 0 ? `${(((costCoveredSales - cost) / costCoveredSales) * 100).toFixed(1)}%` : 'Sin costos';
    document.getElementById('commercial-kpi-collection-days').textContent = paidDays.length ? `${(paidDays.reduce((sum, value) => sum + value, 0) / paidDays.length).toFixed(1)} días` : 'Sin datos';
    document.getElementById('commercial-kpi-overdue').textContent = pending > 0 ? `${((overdue / pending) * 100).toFixed(1)}%` : '0%';
    const scope = document.getElementById('commercial-data-scope');
    if (scope) scope.textContent = billing().history.hasMoreInvoices ? `Indicadores sobre los ${invoices.length} documentos más recientes. Puedes cargar historial anterior en Facturas.` : `Indicadores sobre ${invoices.length} documentos cargados.`;
  }

  function renderStockSuggestions() {
    const list = document.getElementById('commercial-stock-suggestions');
    if (!list) return;
    const products = [...(billing().products || []), ...(billing().futunetProducts || [])];
    const unique = new Map();
    products.forEach(item => unique.set(`${item._isCreaticos ? 'c' : 'f'}_${item.id}`, item));
    const low = Array.from(unique.values()).filter(item => item.isActive !== false && item.stock != null && Number(item.stock) <= Number(item.reorderPoint == null ? 5 : item.reorderPoint)).sort((a, b) => Number(a.stock) - Number(b.stock));
    if (!low.length) { list.innerHTML = '<div class="erp-empty-state">No hay productos bajo el punto de reposición.</div>'; return; }
    list.innerHTML = low.slice(0, 100).map(item => `<article class="commercial-list-item"><div><strong>${escapeHTML(item.name || item.title || item.id)}</strong><small>Stock ${Number(item.stock || 0)} · punto de reposición ${Number(item.reorderPoint == null ? 5 : item.reorderPoint)}</small></div><button type="button" class="table-btn table-btn-primary" data-erp-click="ERPBillingWorkflows.recordStockReview('${escapeAttr(item.id)}')">Revisado</button></article>`).join('');
  }

  async function recordStockReview(productId) {
    await recordEvent(productId, 'stock_suggestion_reviewed', 'Sugerencia de reposición revisada.', { productId });
    notify('Revisión de reposición registrada en la auditoría.', 'success');
  }

  async function openHistoryDialog(documentId) {
    const content = formNode('<div class="commercial-list"><div class="erp-empty-state">Cargando historial…</div></div>');
    openDialog('Historial inmutable del documento', content);
    try {
      const snapshot = await collection('document_events').where('documentId', '==', documentId).limit(250).get();
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (asDate(b.timestamp)?.getTime() || 0) - (asDate(a.timestamp)?.getTime() || 0));
      const list = content.querySelector('.commercial-list');
      list.innerHTML = events.length ? events.map(item => `<article class="commercial-list-item"><div><strong>${escapeHTML(item.summary || item.action)}</strong><small>${escapeHTML(timeLabel(item.timestamp))} · ${escapeHTML(item.userEmail || item.userId)} · ${escapeHTML(item.action)}</small></div></article>`).join('') : '<div class="erp-empty-state">No hay eventos registrados para este documento.</div>';
    } catch (error) {
      content.querySelector('.commercial-list').innerHTML = `<div class="erp-empty-state is-error">${escapeHTML(error.message)}</div>`;
    }
  }

  function renderComplianceChecks() {
    const container = document.getElementById('commercial-compliance-checks');
    if (!container) return;
    const settings = currentSettings();
    const rnc = String(settings.rnc || '').replace(/\D/g, '');
    const invoices = currentInvoices().filter(item => item.docType === 'invoice' && item.status !== 'cancelled');
    const checks = [
      { ok: rnc.length === 9, title: 'Identificación empresarial', detail: rnc.length === 9 ? 'RNC empresarial con nueve dígitos.' : 'Corrige el RNC configurado de la empresa.' },
      { ok: Boolean(settings.invoicePrefix && settings.quotePrefix), title: 'Secuencias internas', detail: 'Prefijos de factura y cotización configurados.' },
      { ok: invoices.every(item => item.ncf || item.ncfType === 'none'), title: 'Consistencia de NCF', detail: invoices.some(item => !item.ncf && item.ncfType !== 'none') ? 'Hay facturas que esperaban comprobante y no lo contienen.' : 'No se detectaron ausencias incompatibles en el historial cargado.' },
      { ok: invoices.every(item => !['B01', 'B12', 'B14', 'B15'].includes(item.ncfType) || [9, 11].includes(String(item.clientRnc || '').replace(/\D/g, '').length)), title: 'Identificación de receptores', detail: 'Validación técnica sobre comprobantes que requieren identificación.' },
      { ok: true, title: 'Validación oficial pendiente', detail: 'Prevalida los archivos 606/607/608 y confirma requisitos vigentes antes de remitirlos.' }
    ];
    container.innerHTML = checks.map(item => `<div class="commercial-check ${item.ok ? '' : 'is-warning'}"><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.detail)}</small></div></div>`).join('');
  }

  async function onInvoiceSaved(event) {
    await clearLatestDraft();
    const detail = event.detail || {};
    const saved = invoiceById(detail.id) || {};
    const versionSnapshot = {
      invoiceNumber: saved.invoiceNumber || '', docType: saved.docType || detail.docType || '',
      clientName: saved.clientName || '', date: saved.date || '', dueDate: saved.dueDate || '',
      items: (saved.items || []).map(item => ({ productId: item.productId || 'custom', description: item.description || '', price: Number(item.price || 0), qty: Number(item.qty || 0), tax: Number(item.tax || 0), discount: Number(item.discount || 0) })),
      subtotal: Number(saved.subtotal || 0), itbis: Number(saved.itbis || 0), total: Number(saved.total || 0),
      status: saved.status || '', workflowStatus: saved.workflowStatus || '', version: Number(saved.version || 1)
    };
    await recordEvent(detail.id, `document_${detail.action || 'saved'}`, `Documento ${detail.action === 'updated' ? 'actualizado' : 'creado'} desde facturación.`, { versionSnapshot });
    refreshKpis();
  }

  async function onDocumentEvent(event) {
    const detail = event.detail || {};
    if (!detail.documentId || !detail.action) return;
    await recordEvent(detail.documentId, detail.action, detail.summary || detail.action, detail.metadata || {});
  }

  async function init(userData) {
    user = userData || {};
    const snapshot = billing();
    companyCode = snapshot.companyCode;
    prefix = snapshot.prefix;
    isAdmin = snapshot.isUserAdmin;
    initialized = true;
    const form = document.getElementById('invoice-editor-form');
    if (form) {
      form.addEventListener('input', scheduleDraftSave);
      form.addEventListener('change', scheduleDraftSave);
    }
    document.addEventListener('erp:invoice-saved', event => onInvoiceSaved(event).catch(error => console.warn('Unable to record invoice event', error)));
    document.addEventListener('erp:document-event', event => onDocumentEvent(event).catch(error => console.warn('Unable to record document event', error)));
    await loadLatestDraft();
    refreshKpis();
  }

  return {
    init, load, refreshKpis, updateFormCommercialMetrics, authorizeDocument,
    saveDraftNow, restoreLatestDraft, discardLatestDraft,
    openShareDialog, setQuoteStatus, reviewApproval,
    openHistoryDialog,
    openReminderDialog, prepareReminder, completeReminder,
    openStatementDialog, openTemplateDialog, loadTemplate, deleteTemplate, generateRecurringDraft,
    recordStockReview
  };
})();
