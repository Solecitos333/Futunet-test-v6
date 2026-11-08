/** Commercial workflow extensions for billing: drafts, quotes, approvals and collections. */
window.ERPBillingWorkflows = (function () {
  'use strict';

  const Core = window.ERPBillingCore;
  let user = null;
  let companyCode = 'CREATICOS';
  let prefix = 'creaticos';
  let isAdmin = false;
  let initialized = false;
  let windowListenersAttached = false;
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
  function domDocument() {
    return (typeof window !== 'undefined' && window.document) || (typeof document !== 'undefined' ? document : null);
  }
  function safeOpenWhatsApp(url) {
    if (typeof window !== 'undefined' && typeof window.safeOpenWhatsApp === 'function') {
      return window.safeOpenWhatsApp(url);
    }
    if (!url) return;
    try {
      const doc = domDocument();
      if (!doc) return;
      const link = doc.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      doc.body.appendChild(link);
      link.click();
      setTimeout(() => { if (link.parentNode) link.parentNode.removeChild(link); }, 200);
    } catch (e) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
  function notify(message, type = 'info') { window.ERPBilling.showToast(message, type); }
  async function safeCopyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // Fallback a selección de DOM
      }
    }
    try {
      const doc = domDocument();
      if (!doc) return false;
      const ta = doc.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = doc.execCommand ? doc.execCommand('copy') : false;
      doc.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }
  function collection(name) { return db().collection(`${prefix}_${name}`); }
  function currentSettings() { return billing().settings || {}; }
  function currentInvoices() { return billing().invoices || []; }
  function currentClients() { return billing().clients || []; }
  function currentPayments() { return billing().payments || []; }
  function clientById(id) { return currentClients().find(item => item.id === id) || null; }
  function invoiceById(id) { return currentInvoices().find(item => item.id === id) || null; }
  function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

  function openDialog(title, content, className = '') {
    const doc = domDocument();
    if (!doc) return { overlay: null, close: () => {} };
    const overlay = doc.createElement('div');
    overlay.className = 'erp-action-dialog is-open';
    overlay.innerHTML = `<section class="erp-action-dialog-card commercial-document-dialog ${escapeHTML(className)}" role="dialog" aria-modal="true">
      <div class="commercial-card-header" style="padding:0 0 16px;margin-bottom:16px;">
        <h2 style="margin:0;font-size:1.12rem;"></h2>
        <button type="button" class="table-btn table-btn-secondary" data-close-dialog aria-label="Cerrar">×</button>
      </div>
      <div data-dialog-content></div>
    </section>`;
    const h2El = overlay.querySelector('h2');
    if (h2El) h2El.textContent = title;
    const dialogContent = overlay.querySelector('[data-dialog-content]');
    if (dialogContent) dialogContent.append(content);
    const close = () => overlay.remove();
    overlay.querySelector('[data-close-dialog]')?.addEventListener('click', close);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    doc.body.appendChild(overlay);
    setTimeout(() => overlay.querySelector('input,select,button')?.focus(), 0);
    return { overlay, close };
  }

  function formNode(html) {
    const doc = domDocument();
    if (!doc) return null;
    const wrapper = doc.createElement('div');
    wrapper.innerHTML = html;
    return wrapper;
  }

  function documentSnapshotFromForm(formElement) {
    const doc = domDocument();
    const form = formElement || doc?.getElementById('invoice-editor-form') || doc;
    if (!form) return null;
    const rows = Array.from((form.querySelector('#invoice-form-items-body') || doc?.getElementById('invoice-form-items-body') || form).querySelectorAll('tr'));
    const discountEl = form.querySelector('#form-invoice-discount-pct') || form.querySelector('#form-invoice-discount') || doc?.getElementById('form-invoice-discount-pct') || doc?.getElementById('form-invoice-discount');
    const discountPct = Number(discountEl?.value || 0);

    return {
      id: (form.querySelector('#form-invoice-id') || doc?.getElementById('form-invoice-id'))?.value || '',
      docType: (form.querySelector('#form-invoice-doc-type') || doc?.getElementById('form-invoice-doc-type'))?.value || 'quote',
      clientId: (form.querySelector('#form-invoice-client-id') || doc?.getElementById('form-invoice-client-id'))?.value || '',
      clientName: (form.querySelector('#form-invoice-client-name') || doc?.getElementById('form-invoice-client-name'))?.value.trim() || '',
      clientRnc: (form.querySelector('#form-invoice-client-rnc') || doc?.getElementById('form-invoice-client-rnc'))?.value.trim() || '',
      clientPhone: (form.querySelector('#form-invoice-client-phone') || doc?.getElementById('form-invoice-client-phone'))?.value.trim() || '',
      clientEmail: (form.querySelector('#form-invoice-client-email') || doc?.getElementById('form-invoice-client-email'))?.value.trim() || '',
      clientAddress: (form.querySelector('#form-invoice-client-address') || doc?.getElementById('form-invoice-client-address'))?.value.trim() || '',
      date: (form.querySelector('#form-invoice-date') || doc?.getElementById('form-invoice-date'))?.value || localDate(),
      dueDate: (form.querySelector('#form-invoice-due-date') || doc?.getElementById('form-invoice-due-date'))?.value || '',
      division: (form.querySelector('#form-invoice-division') || doc?.getElementById('form-invoice-division'))?.value || 'general',
      ncfType: (form.querySelector('#form-invoice-ncf-type') || doc?.getElementById('form-invoice-ncf-type'))?.value || 'none',
      ncf: (form.querySelector('#form-invoice-ncf') || doc?.getElementById('form-invoice-ncf'))?.value.trim() || '',
      paymentTerms: (form.querySelector('#form-invoice-payment-terms') || doc?.getElementById('form-invoice-payment-terms'))?.value || 'Contado',
      notes: (form.querySelector('#form-invoice-notes') || doc?.getElementById('form-invoice-notes'))?.value.trim() || '',
      discountPct: discountPct,
      items: rows.map(row => {
        const productInput = row.querySelector('.row-product-search');
        const idInput = row.querySelector('.row-product-id');
        const costInput = row.querySelector('.row-cost');
        const priceInput = row.querySelector('.row-price');
        const qtyInput = row.querySelector('.row-qty');
        const taxInput = row.querySelector('.row-tax');
        const discountInput = row.querySelector('.row-discount');

        const productId = idInput?.value || 'custom';
        const description = productInput?.value.trim() || '';
        const price = Number(priceInput?.value || 0);
        const qty = Number(qtyInput?.value || 1);
        const tax = Number(taxInput?.value || 0);
        const taxMode = taxInput?.dataset?.override === 'true' ? 'amount' : 'rate';
        const taxRate = Number(taxInput?.dataset?.percent || 0);
        const discount = Number(discountInput?.value || 0);
        const costVal = costInput?.value;
        const unitCost = (costVal === '' || costVal == null) ? null : Number(costVal);
        const subtotal = Core ? Core.roundMoney(price * qty) : Number((price * qty).toFixed(2));

        return {
          code: productId,
          productId: productId,
          description: description,
          price: price,
          qty: qty,
          tax: tax,
          taxType: taxMode,
          taxMode: taxMode,
          taxRate: taxRate,
          itbisRate: taxRate,
          discount: discount,
          unitCost: unitCost,
          subtotal: subtotal
        };
      }).filter(item => item.description || item.price > 0)
    };
  }

  function meaningfulDraft(data) {
    if (!data) return false;
    if (data.id) return true;
    if (data.clientName && data.clientName.trim().length > 0) return true;
    if (data.clientRnc && data.clientRnc.trim().length > 0) return true;
    if (data.clientPhone && data.clientPhone.trim().length > 0) return true;
    if (data.clientEmail && data.clientEmail.trim().length > 0) return true;
    if (data.clientAddress && data.clientAddress.trim().length > 0) return true;
    if (data.notes && data.notes.trim().length > 0) return true;
    if (data.ncf && data.ncf.trim().length > 0) return true;
    if (Number(data.discountPct || 0) > 0) return true;
    if (Array.isArray(data.items) && data.items.some(item => item.description || Number(item.price || 0) > 0 || Number(item.discount || 0) > 0 || Number(item.unitCost || 0) > 0)) return true;
    return false;
  }

  function currentCompanyCode() {
    if (window.ERPBilling && typeof window.ERPBilling.getBillingSnapshot === 'function') {
      try {
        const snap = window.ERPBilling.getBillingSnapshot();
        if (snap && snap.companyCode) return snap.companyCode;
      } catch (e) {}
    }
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('active_company_code');
        if (stored) return stored;
      } catch (e) {}
    }
    if (typeof sessionStorage !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('active_company_code');
        if (stored) return stored;
      } catch (e) {}
    }
    return companyCode || 'CREATICOS';
  }

  function draftId() { return `${(user && user.uid) ? user.uid : 'local'}_invoice_editor`; }
  function localDraftKey() { return `erp_billing_draft_${currentCompanyCode()}_${(user && user.uid) ? user.uid : 'local'}`; }
  function setDraftStatus(text, tone) {
    const doc = domDocument();
    const status = doc?.getElementById('billing-draft-status');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone || '';
  }

  function readLocalDraft() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const active = currentCompanyCode();
      const uid = (user && user.uid) ? user.uid : 'local';

      // 1. Primary strictly scoped key
      let raw = localStorage.getItem(`erp_billing_draft_${active}_${uid}`);

      // 2. Exact alias check for the same tenant (FUTUNET <-> FUTUNETSRL) for the SAME user
      if (!raw) {
        if (active === 'FUTUNETSRL') {
          raw = localStorage.getItem(`erp_billing_draft_FUTUNET_${uid}`);
        } else if (active === 'FUTUNET') {
          raw = localStorage.getItem(`erp_billing_draft_FUTUNETSRL_${uid}`);
        }
      }

      // 3. Fallback ONLY for unauthenticated sessions in the exact same company
      if (!raw && (!user || !user.uid)) {
        raw = localStorage.getItem(`erp_billing_draft_${active}_local`) || localStorage.getItem(`erp_billing_draft_${active}`);
        if (!raw && (active === 'FUTUNETSRL' || active === 'FUTUNET')) {
          const alias = active === 'FUTUNETSRL' ? 'FUTUNET' : 'FUTUNETSRL';
          raw = localStorage.getItem(`erp_billing_draft_${alias}_local`) || localStorage.getItem(`erp_billing_draft_${alias}`);
        }
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        const data = (parsed && parsed.data && typeof parsed.data === 'object') ? parsed.data : parsed;
        const savedAt = (parsed && (parsed.savedAt || parsed.updatedAt)) || Date.now();
        if (data && meaningfulDraft(data)) {
          return { id: draftId(), data, updatedAt: new Date(savedAt) };
        }
      }
    } catch (e) {
      console.warn('Unable to read local draft', e);
    }
    return null;
  }

  function flushDraftNow() {
    clearTimeout(draftTimer);
    const doc = domDocument();
    const form = doc?.getElementById('invoice-editor-form');
    if (!form) return;
    const data = documentSnapshotFromForm(form);
    if (!meaningfulDraft(data)) return;
    try {
      const savedAt = Date.now();
      localStorage.setItem(localDraftKey(), JSON.stringify({ data, savedAt }));
      latestDraft = { id: draftId(), ownerId: (user && user.uid) ? user.uid : 'local', companyCode, formType: 'invoice-editor', data, updatedAt: new Date(savedAt) };
      lastDraftWrite = savedAt;
    } catch (e) {
      console.warn('Unable to synchronously flush draft to localStorage', e);
    }
  }

  async function saveDraftNow(options = {}) {
    const data = documentSnapshotFromForm();
    if (!meaningfulDraft(data)) {
      setDraftStatus('Sin contenido para guardar', 'muted');
      return;
    }
    setDraftStatus('Guardando borrador…', 'saving');
    const savedAt = Date.now();
    try {
      localStorage.setItem(localDraftKey(), JSON.stringify({ data, savedAt }));
    } catch (e) {
      console.warn('Local draft write error', e);
    }
    latestDraft = { id: draftId(), ownerId: (user && user.uid) ? user.uid : 'local', companyCode, formType: 'invoice-editor', data, updatedAt: new Date(savedAt) };
    lastDraftWrite = savedAt;

    if (user && user.uid && typeof collection === 'function') {
      const payload = { ownerId: user.uid, companyCode, formType: 'invoice-editor', data, updatedAt: serverTime() };
      try {
        await collection('billing_drafts').doc(draftId()).set(payload, { merge: true });
        setDraftStatus(`Borrador guardado a las ${new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`, 'saved');
        if (!options.silent) notify('Borrador guardado en la cuenta.', 'success');
      } catch (error) {
        setDraftStatus('Guardado temporalmente en este dispositivo', 'warning');
        if (!options.silent) notify('Sin conexión: el borrador quedó guardado temporalmente en este dispositivo.', 'warning');
      }
    } else {
      setDraftStatus(`Borrador guardado localmente a las ${new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`, 'saved');
      if (!options.silent) notify('Borrador guardado localmente.', 'success');
    }
  }

  function scheduleDraftSave() {
    clearTimeout(draftTimer);
    setDraftStatus('Cambios pendientes…', 'pending');
    draftTimer = setTimeout(() => {
      saveDraftNow({ silent: true });
    }, 500);
  }

  function checkDraftBanner() {
    const doc = domDocument();
    const banner = doc?.getElementById('billing-draft-banner');
    if (!banner) return false;
    const local = readLocalDraft();
    if (local && meaningfulDraft(local.data)) {
      latestDraft = local;
      banner.hidden = false;
      banner.removeAttribute('hidden');
      banner.style.display = '';
      const updated = doc.getElementById('billing-draft-updated');
      if (updated) {
        const timeStr = timeLabel(local.updatedAt);
        const docType = local.data.docType === 'quote' ? 'Cotización' : (local.data.docType === 'proforma' ? 'Proforma' : 'Factura');
        const clientDesc = local.data.clientName ? ` para ${local.data.clientName}` : '';
        updated.textContent = `${docType}${clientDesc} · Guardado: ${timeStr}`;
      }
      return true;
    } else {
      banner.hidden = true;
      banner.setAttribute('hidden', '');
      banner.style.display = 'none';
      return false;
    }
  }

  async function loadLatestDraft() {
    let cloudDraft = null;
    if (user && user.uid && typeof collection === 'function') {
      try {
        const docSnap = await collection('billing_drafts').doc(draftId()).get();
        if (docSnap.exists) cloudDraft = { id: docSnap.id, ...docSnap.data() };
      } catch (error) {
        console.warn('Cloud draft unavailable', error);
      }
    }
    const localDraft = readLocalDraft();
    const cloudDate = asDate(cloudDraft && cloudDraft.updatedAt);
    const localDateValue = asDate(localDraft && localDraft.updatedAt);
    latestDraft = cloudDate && (!localDateValue || cloudDate >= localDateValue) ? cloudDraft : localDraft;

    const doc = domDocument();
    const banner = doc?.getElementById('billing-draft-banner');
    if (!banner) return;
    if (!latestDraft || !meaningfulDraft(latestDraft.data)) {
      banner.hidden = true;
      banner.setAttribute('hidden', '');
      banner.style.display = 'none';
      return;
    }
    banner.hidden = false;
    banner.removeAttribute('hidden');
    banner.style.display = '';
    const updated = doc.getElementById('billing-draft-updated');
    if (updated) {
      const timeStr = timeLabel(latestDraft.updatedAt);
      const docType = latestDraft.data.docType === 'quote' ? 'Cotización' : (latestDraft.data.docType === 'proforma' ? 'Proforma' : 'Factura');
      const clientDesc = latestDraft.data.clientName ? ` para ${latestDraft.data.clientName}` : '';
      updated.textContent = `${docType}${clientDesc} · Guardado: ${timeStr}`;
    }
  }

  function restoreLatestDraft() {
    if (!latestDraft) {
      latestDraft = readLocalDraft();
    }
    if (!latestDraft || !meaningfulDraft(latestDraft.data)) return;
    if (window.ERPBilling && typeof window.ERPBilling.populateInvoiceForm === 'function') {
      window.ERPBilling.populateInvoiceForm(latestDraft.data, { title: 'Borrador recuperado' });
    }
    const doc = domDocument();
    const draftBanner = doc?.getElementById('billing-draft-banner');
    if (draftBanner) {
      draftBanner.hidden = true;
      draftBanner.setAttribute('hidden', '');
      draftBanner.style.display = 'none';
    }
    setDraftStatus('Borrador restaurado; revisa antes de guardar', 'warning');
    notify('Borrador restaurado como documento editable.', 'success');
  }

  async function discardLatestDraft() {
    if (window.ERPBilling && typeof window.ERPBilling.clearInvoiceForm === 'function') {
      window.ERPBilling.clearInvoiceForm();
    }
    await clearLatestDraft();
    setDraftStatus('Sin cambios pendientes', 'muted');
    notify('Borrador descartado.', 'success');
  }

  async function clearLatestDraft() {
    latestDraft = null;
    clearTimeout(draftTimer);
    if (typeof localStorage !== 'undefined') {
      try {
        const active = currentCompanyCode();
        const uid = (user && user.uid) ? user.uid : 'local';
        const allowedKeys = new Set([
          localDraftKey(),
          `erp_billing_draft_${active}_${uid}`
        ]);
        if (!user || !user.uid) {
          allowedKeys.add(`erp_billing_draft_${active}_local`);
          allowedKeys.add(`erp_billing_draft_${active}`);
        } else {
          allowedKeys.add(`erp_billing_draft_${active}_local`);
        }
        if (active === 'FUTUNETSRL' || active === 'FUTUNET') {
          const alias = active === 'FUTUNETSRL' ? 'FUTUNET' : 'FUTUNETSRL';
          allowedKeys.add(`erp_billing_draft_${alias}_${uid}`);
          allowedKeys.add(`erp_billing_draft_${alias}_local`);
          if (!user || !user.uid) {
            allowedKeys.add(`erp_billing_draft_${alias}`);
          }
        }
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && allowedKeys.has(k)) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {
        console.warn('Error clearing localStorage draft', e);
      }
    }
    const doc = domDocument();
    const banner = doc?.getElementById('billing-draft-banner');
    if (banner) {
      banner.hidden = true;
      banner.setAttribute('hidden', '');
      banner.style.display = 'none';
    }
    setDraftStatus('Sin cambios pendientes', 'muted');
    if (user && user.uid && typeof collection === 'function') {
      try { await collection('billing_drafts').doc(draftId()).delete(); } catch (error) { console.warn('Unable to clear cloud draft', error); }
    }
  }

  function updateFormCommercialMetrics(items, globalDiscountPct) {
    const metrics = Core.calculateCommercialMetrics(items, globalDiscountPct);
    const settings = currentSettings();
    const doc = domDocument();
    const card = doc?.getElementById('commercial-margin-card');
    if (!card) return metrics;
    const coverageRequired = Number(settings.minimumCostCoveragePct == null ? 80 : settings.minimumCostCoveragePct);
    const marginRequired = Number(settings.minimumMarginPct == null ? 15 : settings.minimumMarginPct);
    const marginValue = doc.getElementById('commercial-margin-value');
    const profitValue = doc.getElementById('commercial-profit-value');
    const coverageValue = doc.getElementById('commercial-coverage-value');
    const guidance = doc.getElementById('commercial-margin-guidance');
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
    const doc = domDocument();
    const body = doc?.getElementById('commercial-quotes-body');
    if (!body) return;
    const sorted = rows.slice().sort((a, b) => {
      const diff = Core.getDocumentModificationTime(b) - Core.getDocumentModificationTime(a);
      if (diff !== 0) return diff;
      return String(b.invoiceNumber || b.id || '').localeCompare(String(a.invoiceNumber || a.id || ''));
    });
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
        const ok = await safeCopyText(link.url);
        notify(ok ? 'Enlace copiado.' : 'No se pudo copiar automáticamente al portapapeles.', ok ? 'success' : 'warning');
      } else if (channel === 'whatsapp') {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        safeOpenWhatsApp(waUrl);
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
    const doc = domDocument();
    const card = doc?.getElementById('commercial-approvals-card');
    if (card) card.hidden = !isAdmin;
    if (!isAdmin) return;
    const body = doc?.getElementById('commercial-approvals-body');
    if (!body) return;
    try {
      const snapshot = await collection('approval_requests').limit(250).get();
      approvals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (asDate(b.requestedAt)?.getTime() || 0) - (asDate(a.requestedAt)?.getTime() || 0));
      if (!approvals.length) { body.innerHTML = '<tr><td colspan="7" class="erp-empty-state">No hay excepciones pendientes.</td></tr>'; return; }
      body.innerHTML = approvals.map(item => `<tr><td>${escapeHTML(timeLabel(item.requestedAt))}</td><td>${escapeHTML(item.requestedByEmail)}</td><td>${escapeHTML(item.clientName)}</td>
        <td>${escapeHTML((item.reasons || []).join(' · '))}</td><td>${escapeHTML(money(item.total))}</td>
        <td><span class="admin-badge commercial-status is-${item.status === 'approved' ? 'green' : (item.status === 'rejected' ? 'red' : 'orange')}">${escapeHTML(item.status === 'approved' ? 'Aprobada' : (item.status === 'rejected' ? 'Rechazada' : 'Pendiente'))}</span></td>
        <td>${item.status === 'pending' ? `<div class="table-actions"><button type="button" class="table-btn table-btn-success" data-erp-click="ERPBillingWorkflows.reviewApproval('${escapeAttr(item.id)}','approved')">Aprobar</button><button type="button" class="table-btn table-btn-danger" data-erp-click="ERPBillingWorkflows.reviewApproval('${escapeAttr(item.id)}','rejected')">Rechazar</button></div>` : escapeHTML(item.reviewReason || '—')}</td></tr>`).join('');
    } catch (error) {
      if (body) {
        body.innerHTML = `<tr><td colspan="7" class="erp-empty-state is-error">${escapeHTML(error.message)}</td></tr>`;
      }
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
    content.querySelector('form')?.addEventListener('submit', async event => {
      event.preventDefault();
      try {
        const invId = content.querySelector('#commercial-reminder-invoice')?.value;
        const invoice = invId ? invoiceById(invId) : null;
        if (!invoice) {
          notify('Selecciona una factura válida.', 'warning');
          return;
        }
        const scheduledFor = content.querySelector('#commercial-reminder-date')?.value || localDate();
        const channel = content.querySelector('#commercial-reminder-channel')?.value || 'whatsapp';
        const note = (content.querySelector('#commercial-reminder-note')?.value || '').trim();
        await collection('collection_reminders').add({
          companyCode, invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber || '', clientId: invoice.clientId || '', clientName: invoice.clientName || '',
          scheduledFor, channel,
          note, status: 'scheduled', createdBy: user.uid, createdAt: serverTime(), updatedAt: serverTime()
        });
        await recordEvent(invoice.id, 'collection_reminder_scheduled', 'Recordatorio de cobro programado.');
        dialog.close();
        await loadReminders();
        notify('Recordatorio programado.', 'success');
      } catch (err) {
        console.error('Error scheduling reminder:', err);
        notify('No se pudo programar el recordatorio: ' + (err.message || 'Error de red'), 'error');
      }
    });
  }

  async function loadReminders() {
    const doc = domDocument();
    const list = doc?.getElementById('commercial-reminders-list');
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
    if (reminder.channel === 'whatsapp') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      safeOpenWhatsApp(waUrl);
    }
    if (reminder.channel === 'email') window.location.href = `mailto:${encodeURIComponent(client.email || '')}?subject=${encodeURIComponent(`Recordatorio ${invoice.invoiceNumber}`)}&body=${encodeURIComponent(message)}`;
    if (reminder.channel === 'phone') await safeCopyText(message);
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
    content.querySelector('form')?.addEventListener('submit', async event => {
      event.preventDefault();
      try {
        const clientSelect = content.querySelector('#statement-client');
        if (!clientSelect?.value) return;
        await downloadStatement(clientSelect.value);
        dialog.close();
      } catch (err) {
        console.error('Error generating statement:', err);
        notify('No se pudo generar el estado de cuenta: ' + (err.message || 'Error de procesamiento'), 'error');
      }
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
    content.querySelector('form')?.addEventListener('submit', async event => {
      event.preventDefault();
      try {
        const nameInput = content.querySelector('#template-name');
        const tmplName = (nameInput?.value || '').trim();
        if (!tmplName) {
          notify('Introduce un nombre para la plantilla.', 'warning');
          return;
        }
        const frequency = content.querySelector('#template-frequency')?.value || 'none';
        const nextRunDate = frequency === 'none' ? '' : (content.querySelector('#template-next-date')?.value || '');
        const active = !!content.querySelector('#template-active')?.checked;
        await collection('billing_templates').add({
          companyCode, name: tmplName, frequency,
          nextRunDate,
          active, snapshot, createdBy: user.uid, createdByEmail: user.email || '', createdAt: serverTime(), updatedAt: serverTime()
        });
        await recordEvent('', 'template_created', `Plantilla ${tmplName} creada.`);
        dialog.close();
        await loadTemplates();
        notify('Plantilla guardada.', 'success');
      } catch (err) {
        console.error('Error saving template:', err);
        notify('No se pudo guardar la plantilla: ' + (err.message || 'Error de red'), 'error');
      }
    });
  }

  async function loadTemplates() {
    const doc = domDocument();
    const list = doc?.getElementById('commercial-templates-list');
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
    const doc = domDocument();
    if (!initialized || !doc || !doc.getElementById('commercial-kpi-stats')) return;
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
    const kpiConv = doc.getElementById('commercial-kpi-conversion');
    if (kpiConv) kpiConv.textContent = quotes.length ? `${((converted / quotes.length) * 100).toFixed(1)}%` : 'Sin cotizaciones';
    const kpiMargin = doc.getElementById('commercial-kpi-margin');
    if (kpiMargin) kpiMargin.textContent = costCoveredSales > 0 ? `${(((costCoveredSales - cost) / costCoveredSales) * 100).toFixed(1)}%` : 'Sin costos';
    const kpiDays = doc.getElementById('commercial-kpi-collection-days');
    if (kpiDays) kpiDays.textContent = paidDays.length ? `${(paidDays.reduce((sum, value) => sum + value, 0) / paidDays.length).toFixed(1)} días` : 'Sin datos';
    const kpiOverdue = doc.getElementById('commercial-kpi-overdue');
    if (kpiOverdue) kpiOverdue.textContent = pending > 0 ? `${((overdue / pending) * 100).toFixed(1)}%` : '0%';
    const scope = doc.getElementById('commercial-data-scope');
    if (scope) scope.textContent = billing().history.hasMoreInvoices ? `Indicadores sobre los ${invoices.length} documentos más recientes. Puedes cargar historial anterior en Facturas.` : `Indicadores sobre ${invoices.length} documentos cargados.`;
  }

  function renderStockSuggestions() {
    const doc = domDocument();
    const list = doc?.getElementById('commercial-stock-suggestions');
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
      const errList = content.querySelector('.commercial-list');
      if (errList) {
        errList.innerHTML = `<div class="erp-empty-state is-error">${escapeHTML(error.message)}</div>`;
      }
    }
  }

  function renderComplianceChecks() {
    const doc = domDocument();
    const container = doc?.getElementById('commercial-compliance-checks');
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
    const doc = domDocument();
    const form = doc?.getElementById('invoice-editor-form');
    if (form && !form.dataset.draftListenersAttached) {
      form.addEventListener('input', scheduleDraftSave);
      form.addEventListener('change', scheduleDraftSave);
      form.dataset.draftListenersAttached = 'true';
    }
    if (!windowListenersAttached && typeof window !== 'undefined') {
      window.addEventListener('beforeunload', flushDraftNow);
      window.addEventListener('pagehide', flushDraftNow);
      if (doc) {
        doc.addEventListener('erp:invoice-saved', event => onInvoiceSaved(event).catch(error => console.warn('Unable to record invoice event', error)));
        doc.addEventListener('erp:document-event', event => onDocumentEvent(event).catch(error => console.warn('Unable to record document event', error)));
      }
      windowListenersAttached = true;
    }
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
    recordStockReview,
    documentSnapshotFromForm,
    flushDraftNow,
    clearActiveDraft: clearLatestDraft,
    clearLatestDraft,
    checkDraftBanner,
    scheduleDraftSave
  };
})();
