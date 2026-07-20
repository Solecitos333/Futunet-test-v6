/**
 * ERP extensions for the billing workspace: alerts, purchases/AP, banking and inventory audit.
 * Restricted to the Creaticos and Futunet tenants.
 */
window.ERPExtensions = (function () {
  'use strict';

  let user = null;
  let companyCode = 'CREATICOS';
  let prefix = 'creaticos';
  let purchases = [];
  let bankMovements = [];

  function db() { return window.FutunetFirebase.db; }
  function serverTime() { return firebase.firestore.FieldValue.serverTimestamp(); }
  function money(value) {
    return 'RD$ ' + Number(value || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function escapeHTML(value) {
    const div = document.createElement('div');
    div.textContent = String(value == null ? '' : value);
    return div.innerHTML;
  }
  function localDate() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  }
  function parseDate(value) {
    return value ? new Date(value + 'T12:00:00') : null;
  }
  function formatDate(value) {
    const date = value && value.toDate ? value.toDate() : parseDate(value);
    return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('es-DO') : '—';
  }
  function notify(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) { alert(message); return; }
    const toast = document.createElement('div');
    toast.className = `erp-extension-toast is-${type || 'success'}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }
  function statCard(label, value, tone) {
    return `<div class="admin-stat-card"><div class="admin-stat-icon stat-icon-${tone || 'blue'}"><i data-lucide="activity"></i></div><div class="admin-stat-label">${escapeHTML(label)}</div><div class="admin-stat-value">${escapeHTML(value)}</div></div>`;
  }
  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }
  function setDefaultDates() {
    const today = localDate();
    ['purchase-date', 'purchase-due-date', 'bank-date'].forEach(id => {
      const input = document.getElementById(id);
      if (input && !input.value) input.value = today;
    });
  }

  function init(userData) {
    user = userData || {};
    companyCode = window.ERPBillingCore.resolveCompanyCode(userData, localStorage.getItem('active_company_code') || 'CREATICOS');
    prefix = companyCode === 'CREATICOS' ? 'creaticos' : 'futunet';
    setDefaultDates();
  }

  async function load(target) {
    if (target === 'alerts') return loadAlerts();
    if (target === 'receivables') return loadReceivables();
    if (target === 'purchases') return loadPurchases();
    if (target === 'banking') return loadBanking();
    if (target === 'inventory-audit') return loadInventoryAudit();
  }

  function openPanel(target) {
    const nav = document.querySelector(`[data-nav="${target}"]`);
    if (nav) nav.click();
  }

  async function loadReceivables() {
    const body = document.getElementById('erp-receivables-body');
    if (body) body.innerHTML = '<tr><td colspan="8" class="erp-empty-state">Cargando cartera…</td></tr>';
    try {
      const snapshot = await db().collection(`${prefix}_invoices`).orderBy('createdAt', 'desc').limit(1000).get();
      const today = parseDate(localDate());
      const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(item =>
        item.docType === 'invoice' && item.status !== 'cancelled' && Number(item.total || 0) - Number(item.paidAmount || 0) > 0.009
      ).map(item => {
        const due = parseDate(item.dueDate);
        const ageDays = due ? Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86400000)) : 0;
        const balance = Math.round((Number(item.total || 0) - Number(item.paidAmount || 0)) * 100) / 100;
        const bucket = ageDays <= 30 ? '0-30 días' : (ageDays <= 60 ? '31-60 días' : (ageDays <= 90 ? '61-90 días' : '+90 días'));
        return { ...item, ageDays, bucket, balance };
      }).sort((a, b) => b.ageDays - a.ageDays);
      const balances = {
        current: rows.filter(item => item.ageDays <= 30).reduce((sum, item) => sum + item.balance, 0),
        mid: rows.filter(item => item.ageDays > 30 && item.ageDays <= 60).reduce((sum, item) => sum + item.balance, 0),
        late: rows.filter(item => item.ageDays > 60 && item.ageDays <= 90).reduce((sum, item) => sum + item.balance, 0),
        critical: rows.filter(item => item.ageDays > 90).reduce((sum, item) => sum + item.balance, 0)
      };
      const stats = document.getElementById('erp-receivable-stats');
      if (stats) stats.innerHTML = [statCard('0-30 días', money(balances.current), 'blue'), statCard('31-60 días', money(balances.mid), 'orange'), statCard('61-90 días', money(balances.late), 'orange'), statCard('+90 días', money(balances.critical), 'orange')].join('');
      if (!rows.length) { body.innerHTML = '<tr><td colspan="8" class="erp-empty-state">No hay cuentas por cobrar pendientes.</td></tr>'; refreshIcons(); return; }
      body.innerHTML = rows.map(item => `<tr><td><strong>${escapeHTML(item.invoiceNumber)}</strong><small>${escapeHTML(item.ncf || 'Sin NCF')}</small></td><td>${escapeHTML(item.clientName)}</td><td>${escapeHTML(formatDate(item.dueDate))}</td><td><span class="erp-status is-${item.ageDays > 60 ? 'pending' : 'reconciled'}">${escapeHTML(item.bucket)}</span></td><td>${escapeHTML(money(item.total))}</td><td>${escapeHTML(money(item.paidAmount))}</td><td><strong>${escapeHTML(money(item.balance))}</strong></td><td><button class="table-btn table-btn-primary" type="button" onclick="ERPBilling.viewInvoice('${escapeHTML(item.id)}')">Ver / cobrar</button></td></tr>`).join('');
      refreshIcons();
    } catch (error) {
      if (body) body.innerHTML = `<tr><td colspan="8" class="erp-empty-state is-error">${escapeHTML(error.message)}</td></tr>`;
    }
  }

  async function loadPurchases() {
    setDefaultDates();
    const body = document.getElementById('erp-purchases-body');
    if (body) body.innerHTML = '<tr><td colspan="6" class="erp-empty-state">Cargando compras…</td></tr>';
    try {
      const snapshot = await db().collection(`${prefix}_purchases`).orderBy('createdAt', 'desc').limit(500).get();
      purchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderPurchases();
    } catch (error) {
      console.error('Unable to load purchases', error);
      if (body) body.innerHTML = `<tr><td colspan="6" class="erp-empty-state is-error">${escapeHTML(error.message)}</td></tr>`;
    }
  }

  function renderPurchases() {
    const pending = purchases.filter(item => item.status === 'pending');
    const paid = purchases.filter(item => item.status === 'paid');
    const totalPending = pending.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const totalPaid = paid.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const stats = document.getElementById('erp-purchase-stats');
    if (stats) stats.innerHTML = [
      statCard('Compras registradas', String(purchases.length), 'blue'),
      statCard('Cuentas pendientes', String(pending.length), 'orange'),
      statCard('Balance por pagar', money(totalPending), 'orange'),
      statCard('Compras pagadas', money(totalPaid), 'green')
    ].join('');

    const body = document.getElementById('erp-purchases-body');
    if (!body) return;
    if (!purchases.length) {
      body.innerHTML = '<tr><td colspan="6" class="erp-empty-state">Todavía no hay compras registradas.</td></tr>';
      refreshIcons();
      return;
    }
    body.innerHTML = purchases.map(item => `
      <tr>
        <td>${escapeHTML(formatDate(item.date))}</td>
        <td><strong>${escapeHTML(item.supplierName)}</strong><small>${escapeHTML(item.supplierRnc)} · ${escapeHTML(item.ncf)}</small></td>
        <td>${escapeHTML(money(item.total))}</td>
        <td>${escapeHTML(formatDate(item.dueDate))}</td>
        <td><span class="erp-status is-${item.status}">${item.status === 'paid' ? 'Pagada' : 'Pendiente'}</span></td>
        <td>${item.status === 'pending' ? `<button class="table-btn table-btn-primary" type="button" onclick="ERPExtensions.markPurchasePaid('${escapeHTML(item.id)}')">Marcar pagada</button>` : '—'}</td>
      </tr>`).join('');
    refreshIcons();
  }

  async function savePurchase(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('[type="submit"]');
    if (submit.disabled) return;
    submit.disabled = true;
    try {
      const supplierRnc = document.getElementById('purchase-supplier-rnc').value.replace(/\D/g, '');
      const ncf = document.getElementById('purchase-ncf').value.trim().toUpperCase();
      const date = document.getElementById('purchase-date').value;
      const dueDate = document.getElementById('purchase-due-date').value;
      const subtotal = Number(document.getElementById('purchase-subtotal').value);
      const itbis = Number(document.getElementById('purchase-itbis').value || 0);
      const paymentMethod = document.getElementById('purchase-payment-method').value;
      if (![9, 11].includes(supplierRnc.length)) throw new Error('El RNC o cédula debe tener 9 u 11 dígitos.');
      if (!/^(B\d{10}|E\d{12})$/.test(ncf)) throw new Error('El NCF debe tener un formato fiscal válido.');
      if (!date || !dueDate || dueDate < date) throw new Error('Revisa las fechas de compra y vencimiento.');
      if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(itbis) || itbis < 0 || subtotal + itbis <= 0) throw new Error('Los montos de la compra no son válidos.');
      const isPaid = paymentMethod !== '04';
      await db().collection(`${prefix}_purchases`).add({
        companyCode,
        supplierRnc,
        supplierName: document.getElementById('purchase-supplier-name').value.trim(),
        ncf,
        date,
        dueDate,
        expenseType: document.getElementById('purchase-expense-type').value,
        subtotal,
        itbis,
        total: Math.round((subtotal + itbis) * 100) / 100,
        paymentMethod,
        concept: document.getElementById('purchase-concept').value.trim(),
        status: isPaid ? 'paid' : 'pending',
        paidAt: isPaid ? serverTime() : null,
        createdBy: user.uid,
        updatedBy: user.uid,
        createdAt: serverTime(),
        updatedAt: serverTime()
      });
      form.reset();
      setDefaultDates();
      notify('Compra registrada y agregada al control 606.', 'success');
      await loadPurchases();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      submit.disabled = false;
    }
  }

  async function markPurchasePaid(id) {
    if (!confirm('¿Confirmas que esta cuenta por pagar fue saldada?')) return;
    try {
      await db().collection(`${prefix}_purchases`).doc(id).update({
        status: 'paid', paidAt: serverTime(), updatedAt: serverTime(), updatedBy: user.uid
      });
      notify('Cuenta por pagar marcada como pagada.', 'success');
      await loadPurchases();
    } catch (error) { notify(error.message, 'error'); }
  }

  function clean606(value) {
    return String(value == null ? '' : value).replace(/[\t\r\n]/g, ' ').trim();
  }
  function dgiiDate(value) { return String(value || '').replace(/-/g, ''); }
  async function export606() {
    if (!purchases.length) await loadPurchases();
    if (!purchases.length) { notify('No hay compras que exportar.', 'warning'); return; }
    const rows = purchases.map(item => [
      item.supplierRnc, item.supplierRnc.length === 9 ? '1' : '2', item.expenseType || '09', item.ncf, '',
      dgiiDate(item.date), item.status === 'paid' ? dgiiDate(item.date) : '', '0.00', Number(item.subtotal || 0).toFixed(2),
      Number(item.total || 0).toFixed(2), Number(item.itbis || 0).toFixed(2), '0.00', '0.00', '0.00', Number(item.itbis || 0).toFixed(2),
      '0.00', '', '0.00', '0.00', '0.00', '0.00', '0.00', item.paymentMethod || '04'
    ].map(clean606).join('\t'));
    const content = rows.join('\r\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DGII_606_${companyCode}_${localDate()}.txt`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href);
    notify('Reporte 606 generado. Prevalídalo antes de remitirlo a DGII.', 'success');
  }

  async function loadBanking() {
    setDefaultDates();
    const body = document.getElementById('erp-bank-body');
    if (body) body.innerHTML = '<tr><td colspan="7" class="erp-empty-state">Cargando movimientos…</td></tr>';
    try {
      const snapshot = await db().collection(`${prefix}_bank_movements`).orderBy('createdAt', 'desc').limit(500).get();
      bankMovements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderBanking();
    } catch (error) {
      console.error('Unable to load banking', error);
      if (body) body.innerHTML = `<tr><td colspan="7" class="erp-empty-state is-error">${escapeHTML(error.message)}</td></tr>`;
    }
  }

  function isBankIncome(type) { return type === 'deposit' || type === 'transfer_in'; }
  function renderBanking() {
    const income = bankMovements.filter(item => isBankIncome(item.type)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expense = bankMovements.filter(item => !isBankIncome(item.type)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const pending = bankMovements.filter(item => item.status !== 'reconciled').length;
    const stats = document.getElementById('erp-bank-stats');
    if (stats) stats.innerHTML = [statCard('Entradas', money(income), 'green'), statCard('Salidas', money(expense), 'orange'), statCard('Balance libro', money(income - expense), 'blue'), statCard('Por conciliar', String(pending), 'orange')].join('');
    const body = document.getElementById('erp-bank-body');
    if (!body) return;
    if (!bankMovements.length) { body.innerHTML = '<tr><td colspan="7" class="erp-empty-state">No hay movimientos bancarios.</td></tr>'; return; }
    body.innerHTML = bankMovements.map(item => {
      const incomeMovement = isBankIncome(item.type);
      return `<tr><td>${escapeHTML(formatDate(item.date))}</td><td>${escapeHTML(item.account)}</td><td><strong>${escapeHTML(item.reference)}</strong><small>${escapeHTML(item.description)}</small></td><td>${incomeMovement ? escapeHTML(money(item.amount)) : '—'}</td><td>${!incomeMovement ? escapeHTML(money(item.amount)) : '—'}</td><td><span class="erp-status is-${item.status}">${item.status === 'reconciled' ? 'Conciliado' : 'Pendiente'}</span></td><td>${item.status !== 'reconciled' ? `<button class="table-btn table-btn-primary" type="button" onclick="ERPExtensions.reconcileBankMovement('${escapeHTML(item.id)}')">Conciliar</button>` : '—'}</td></tr>`;
    }).join('');
  }

  async function saveBankMovement(event) {
    event.preventDefault();
    const submit = event.currentTarget.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const amount = Number(document.getElementById('bank-amount').value);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('El monto debe ser mayor que cero.');
      await db().collection(`${prefix}_bank_movements`).add({
        companyCode,
        date: document.getElementById('bank-date').value,
        account: document.getElementById('bank-account').value.trim(),
        type: document.getElementById('bank-type').value,
        reference: document.getElementById('bank-reference').value.trim(),
        amount,
        description: document.getElementById('bank-description').value.trim(),
        status: 'pending',
        createdBy: user.uid,
        createdAt: serverTime(),
        updatedAt: serverTime()
      });
      event.currentTarget.reset(); setDefaultDates();
      notify('Movimiento bancario registrado.', 'success');
      await loadBanking();
    } catch (error) { notify(error.message, 'error'); }
    finally { submit.disabled = false; }
  }

  async function reconcileBankMovement(id) {
    if (!confirm('¿Marcar este movimiento como conciliado con el estado bancario?')) return;
    try {
      await db().collection(`${prefix}_bank_movements`).doc(id).update({
        status: 'reconciled', reconciledAt: serverTime(), reconciledBy: user.uid, updatedAt: serverTime()
      });
      notify('Movimiento conciliado.', 'success');
      await loadBanking();
    } catch (error) { notify(error.message, 'error'); }
  }

  async function loadInventoryAudit() {
    const body = document.getElementById('erp-inventory-audit-body');
    if (body) body.innerHTML = '<tr><td colspan="6" class="erp-empty-state">Cargando kardex…</td></tr>';
    try {
      const snapshot = await db().collection(`${prefix}_inventory_movements`).orderBy('timestamp', 'desc').limit(500).get();
      const movements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (!movements.length) { body.innerHTML = '<tr><td colspan="6" class="erp-empty-state">Aún no hay movimientos. Se crearán con las próximas ventas y anulaciones.</td></tr>'; return; }
      body.innerHTML = movements.map(item => `<tr><td>${escapeHTML(formatDate(item.timestamp))}</td><td><strong>${escapeHTML(item.invoiceNumber)}</strong><small>${escapeHTML(item.invoiceId)}</small></td><td>${escapeHTML(item.productId)}</td><td><span class="erp-status is-${item.type === 'sale' ? 'pending' : 'paid'}">${item.type === 'sale' ? 'Salida por venta' : 'Reverso'}</span></td><td class="${Number(item.quantity) < 0 ? 'erp-negative' : 'erp-positive'}">${escapeHTML(item.quantity)}</td><td>${escapeHTML(item.createdBy)}</td></tr>`).join('');
    } catch (error) {
      if (body) body.innerHTML = `<tr><td colspan="6" class="erp-empty-state is-error">${escapeHTML(error.message)}</td></tr>`;
    }
  }

  async function loadAlerts() {
    const list = document.getElementById('erp-alert-list');
    if (list) list.innerHTML = '<div class="erp-empty-state">Analizando operaciones…</div>';
    try {
      const invoicePromise = db().collection(`${prefix}_invoices`).orderBy('createdAt', 'desc').limit(500).get();
      const purchasePromise = db().collection(`${prefix}_purchases`).orderBy('createdAt', 'desc').limit(500).get();
      const productCollections = companyCode === 'CREATICOS' ? ['creaticos_products', 'products'] : ['products'];
      const [invoiceSnapshot, purchaseSnapshot, productSnapshots] = await Promise.all([
        invoicePromise, purchasePromise, Promise.all(productCollections.map(name => db().collection(name).get()))
      ]);
      const invoices = invoiceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const purchaseRows = purchaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const products = productSnapshots.flatMap(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const today = parseDate(localDate());
      const inSevenDays = new Date(today.getTime() + 7 * 86400000);
      const overdueInvoices = invoices.filter(item => item.docType === 'invoice' && item.status !== 'cancelled' && Number(item.total || 0) > Number(item.paidAmount || 0) && parseDate(item.dueDate) < today);
      const dueSoonInvoices = invoices.filter(item => item.docType === 'invoice' && item.status !== 'cancelled' && Number(item.total || 0) > Number(item.paidAmount || 0) && parseDate(item.dueDate) >= today && parseDate(item.dueDate) <= inSevenDays);
      const overduePurchases = purchaseRows.filter(item => item.status === 'pending' && parseDate(item.dueDate) < today);
      const lowStock = products.filter(item => item.isActive !== false && item.stock != null && Number(item.stock) <= 5);
      const missingNcf = invoices.filter(item => item.docType === 'invoice' && item.status !== 'cancelled' && !item.ncf);
      const stats = document.getElementById('erp-alert-stats');
      if (stats) stats.innerHTML = [statCard('CxC vencidas', String(overdueInvoices.length), 'orange'), statCard('Vencen en 7 días', String(dueSoonInvoices.length), 'blue'), statCard('CxP vencidas', String(overduePurchases.length), 'orange'), statCard('Stock bajo', String(lowStock.length), 'orange')].join('');
      const groups = [
        ['Cuentas por cobrar vencidas', overdueInvoices, item => `${item.invoiceNumber} · ${item.clientName} · ${money(Number(item.total || 0) - Number(item.paidAmount || 0))}`],
        ['Facturas próximas a vencer', dueSoonInvoices, item => `${item.invoiceNumber} · vence ${formatDate(item.dueDate)}`],
        ['Cuentas por pagar vencidas', overduePurchases, item => `${item.supplierName} · ${item.ncf} · ${money(item.total)}`],
        ['Inventario bajo o agotado', lowStock, item => `${item.name || item.title || item.id} · stock ${Number(item.stock || 0)}`],
        ['Facturas sin NCF', missingNcf, item => `${item.invoiceNumber} · ${item.clientName}`]
      ];
      list.innerHTML = groups.map(([title, rows, describe]) => `<section class="admin-table-card erp-alert-card"><h3>${escapeHTML(title)} <span>${rows.length}</span></h3>${rows.length ? `<ul>${rows.slice(0, 12).map(item => `<li>${escapeHTML(describe(item))}</li>`).join('')}</ul>` : '<p>Sin novedades.</p>'}</section>`).join('');
      refreshIcons();
    } catch (error) {
      console.error('Unable to load alerts', error);
      if (list) list.innerHTML = `<div class="erp-empty-state is-error">${escapeHTML(error.message)}</div>`;
    }
  }

  return { init, load, openPanel, loadAlerts, loadReceivables, loadPurchases, savePurchase, markPurchasePaid, export606, loadBanking, saveBankMovement, reconcileBankMovement, loadInventoryAudit };
})();
