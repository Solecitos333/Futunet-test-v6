/** Administrative workflow for financing identity review, debts and payments. */
(function () {
  'use strict';

  var db;
  var auth;
  var profiles = [];
  var accounts = [];
  var payments = [];

  function allowed() {
    var data = window.FutunetAuth && FutunetAuth.getUserData();
    var roles = data && Array.isArray(data.roles) ? data.roles : [data ? data.role : ''];
    return roles.includes('superadmin') || roles.includes('admin');
  }

  async function load() {
    if (!allowed()) return;
    db = window.FutunetFirebase.db;
    auth = window.FutunetFirebase.auth;
    loadingRows();
    try {
      var result = await Promise.all([
        db.collection('financing_profiles').get(),
        db.collection('financing_accounts').get(),
        db.collection('financing_payments').get()
      ]);
      profiles = result[0].docs.map(function (doc) { return { id: doc.id, ...doc.data() }; });
      accounts = result[1].docs.map(function (doc) { return { id: doc.id, ...doc.data() }; });
      payments = result[2].docs.map(function (doc) { return { id: doc.id, ...doc.data() }; });
      profiles.sort(function (a, b) {
        if (a.status === 'pending_review' && b.status !== 'pending_review') return -1;
        if (b.status === 'pending_review' && a.status !== 'pending_review') return 1;
        return timestamp(b.submittedAt) - timestamp(a.submittedAt);
      });
      accounts.sort(function (a, b) { return timestamp(b.createdAt) - timestamp(a.createdAt); });
      renderProfiles();
      renderAccounts();
      renderTotals();
      populateClients();
      var pending = profiles.filter(function (profile) { return profile.status === 'pending_review'; }).length;
      var badge = document.getElementById('badge-financing');
      if (badge) { badge.textContent = pending; badge.style.display = pending ? 'inline-flex' : 'none'; }
    } catch (error) {
      console.error('Financing admin load error:', error);
      setBodyError('financing-profiles-table-body', 6, 'No se pudieron cargar los expedientes.');
      setBodyError('financing-accounts-table-body', 8, 'No se pudieron cargar las cuentas.');
    }
  }

  function loadingRows() {
    var profileBody = document.getElementById('financing-profiles-table-body');
    var accountBody = document.getElementById('financing-accounts-table-body');
    if (profileBody) profileBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:28px;color:#76889e;">Cargando expedientes...</td></tr>';
    if (accountBody) accountBody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:28px;color:#76889e;">Cargando cuentas...</td></tr>';
  }

  function setBodyError(id, colspan, message) {
    var body = document.getElementById(id);
    if (body) body.innerHTML = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:28px;color:#e74c3c;">' + escapeHtml(message) + '</td></tr>';
  }

  function renderProfiles() {
    var body = document.getElementById('financing-profiles-table-body');
    if (!body) return;
    if (!profiles.length) {
      body.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:28px;">No hay expedientes enviados.</td></tr>';
      return;
    }
    body.innerHTML = profiles.map(function (profile) {
      var links = '<div class="fin-doc-links">' + documentLink(profile.idPhotoPath, 'Documento') + documentLink(profile.selfiePhotoPath, 'Selfie con ID') + documentLink(profile.signaturePath, 'Firma') + '</div>';
      var actions = profile.status === 'pending_review'
        ? '<div class="fin-admin-actions"><button class="admin-btn admin-btn-primary admin-btn-sm" onclick="AdminFinancing.review(\'' + profile.id + '\',\'approved\')">Aprobar</button>' +
          '<button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminFinancing.review(\'' + profile.id + '\',\'rejected\')">Rechazar</button></div>'
        : '<span style="font-size:.75rem;color:#64748b;">Revisado</span>';
      return '<tr><td data-label="Cliente"><strong>' + escapeHtml(profile.displayName || 'Sin nombre') + '</strong><br><small>' + escapeHtml(profile.email || '') + '</small></td>' +
        '<td data-label="Documento">' + escapeHtml((profile.documentType === 'passport' ? 'Pasaporte ' : 'Cédula ') + (profile.documentNumber || '')) + '</td>' +
        '<td data-label="Estado"><span class="fin-status-pill fin-status-' + escapeHtml(profile.status) + '">' + escapeHtml(profileStatus(profile.status)) + '</span></td>' +
        '<td data-label="Enviado">' + escapeHtml(dateLabel(profile.submittedAt)) + '</td><td data-label="Documentos">' + links + '</td><td data-label="Acciones">' + actions + '</td></tr>';
    }).join('');
  }

  function documentLink(path, label) {
    if (!path || !String(path).startsWith('financing-documents/')) return '<span style="color:#94a3b8;">' + escapeHtml(label) + ' no disponible</span>';
    return '<button type="button" class="fin-link-button" onclick="AdminFinancing.openDocument(decodeURIComponent(\'' + encodeURIComponent(path) + '\'))">' + escapeHtml(label) + '</button>';
  }

  async function openDocument(path) {
    if (!allowed() || !String(path).startsWith('financing-documents/')) return;
    var preview = window.open('', '_blank');
    if (preview) preview.opener = null;
    try {
      var url = await window.FutunetFirebase.storage.ref().child(path).getDownloadURL();
      if (preview) preview.location.replace(url);
    } catch (error) {
      if (preview) preview.close();
      toast('No se pudo abrir el documento protegido: ' + error.message, 'error');
    }
  }

  async function review(userId, status) {
    if (!allowed()) return;
    var profile = profiles.find(function (item) { return item.id === userId; });
    if (!profile || profile.status !== 'pending_review') return;
    var reason = '';
    if (status === 'rejected') {
      reason = (window.prompt('Indica qué debe corregir el cliente:') || '').trim();
      if (!reason) { toast('Debes indicar el motivo del rechazo.', 'error'); return; }
      reason = reason.slice(0, 500);
    }
    var question = status === 'approved'
      ? '¿Aprobar este expediente y habilitar al cliente para recibir cuentas financiadas?'
      : '¿Devolver este expediente para que el cliente lo corrija?';
    if (!window.confirm(question)) return;
    try {
      var batch = db.batch();
      var data = { status: status, reviewedAt: firebase.firestore.FieldValue.serverTimestamp(), reviewedBy: auth.currentUser.uid };
      if (status === 'rejected') data.rejectionReason = reason;
      batch.update(db.collection('financing_profiles').doc(userId), data);
      batch.update(db.collection('users').doc(userId), { financingProfileStatus: status });
      await batch.commit();
      await audit(status === 'approved' ? 'Aprobar financiamiento' : 'Rechazar financiamiento', (profile.email || userId) + (reason ? ' · ' + reason : ''));
      toast(status === 'approved' ? 'Expediente aprobado.' : 'Expediente devuelto al cliente.', 'success');
      await load();
    } catch (error) {
      toast('No se pudo revisar el expediente: ' + error.message, 'error');
    }
  }

  function populateClients() {
    var select = document.getElementById('fin-admin-user');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona un cliente</option>' + profiles.filter(function (profile) {
      return profile.status === 'approved';
    }).map(function (profile) {
      return '<option value="' + escapeHtml(profile.id) + '">' + escapeHtml((profile.displayName || profile.email) + ' · ' + profile.documentNumber) + '</option>';
    }).join('');
  }

  function openAccountModal() {
    if (!allowed()) return;
    populateClients();
    if (!profiles.some(function (profile) { return profile.status === 'approved'; })) {
      toast('Primero debes aprobar al menos un expediente de financiamiento.', 'error');
      return;
    }
    var form = document.getElementById('financing-account-form');
    if (form) form.reset();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setVal('fin-admin-first-date', tomorrow.toISOString().slice(0, 10));
    setVal('fin-admin-count', '12');
    setVal('fin-admin-down', '0');
    updatePreview();
    window.AdminPanel.openModal('financing-account-modal');
  }

  function updatePreview() {
    var total = round(numVal('fin-admin-total'));
    var down = round(numVal('fin-admin-down'));
    var count = Math.max(1, parseInt(val('fin-admin-count'), 10) || 1);
    var preview = document.getElementById('fin-admin-installment-preview');
    if (preview) preview.textContent = money(round(Math.max(0, total - down) / count));
  }

  async function saveAccount(event) {
    event.preventDefault();
    if (!allowed()) return;
    var userId = val('fin-admin-user');
    var profile = profiles.find(function (item) { return item.id === userId && item.status === 'approved'; });
    var total = round(numVal('fin-admin-total'));
    var down = round(numVal('fin-admin-down'));
    var count = parseInt(val('fin-admin-count'), 10) || 0;
    var firstDate = val('fin-admin-first-date');
    if (!profile) { toast('Selecciona un cliente con expediente aprobado.', 'error'); return; }
    if (total <= 0 || down < 0 || down >= total || count < 1 || count > 240 || !/^\d{4}-\d{2}-\d{2}$/.test(firstDate)) {
      toast('Revisa el precio, el inicial, las cuotas y la primera fecha.', 'error'); return;
    }
    var button = document.getElementById('fin-admin-save-account');
    if (button) { button.disabled = true; button.textContent = 'Creando cuenta...'; }
    try {
      var ref = db.collection('financing_accounts').doc();
      var financed = round(total - down);
      var accountNumber = 'FIN-' + new Date().toISOString().slice(0, 7).replace('-', '') + '-' + ref.id.slice(0, 6).toUpperCase();
      var now = firebase.firestore.FieldValue.serverTimestamp();
      var data = {
        userId: userId, userName: profile.displayName || '', userEmail: profile.email || '', documentNumber: profile.documentNumber || '',
        accountNumber: accountNumber, itemName: val('fin-admin-item').trim(), description: val('fin-admin-description').trim(),
        totalAmount: total, downPayment: down, financedAmount: financed, installmentCount: count,
        installmentAmount: round(financed / count), frequency: val('fin-admin-frequency'), firstPaymentDate: firstDate,
        nextPaymentDate: firstDate, totalPaid: 0, balance: financed, installmentsPaid: 0, status: 'active',
        createdAt: now, updatedAt: now, createdBy: auth.currentUser.uid
      };
      await ref.set(data);
      await audit('Asignar deuda financiada', accountNumber + ' · ' + data.userEmail + ' · ' + money(financed));
      toast('Cuenta ' + accountNumber + ' creada correctamente.', 'success');
      window.AdminPanel.closeModal('financing-account-modal');
      await load();
    } catch (error) {
      toast('No se pudo crear la cuenta: ' + error.message, 'error');
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Crear cuenta'; }
    }
  }

  function renderAccounts() {
    var body = document.getElementById('financing-accounts-table-body');
    if (!body) return;
    if (!accounts.length) {
      body.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:28px;">No hay cuentas financiadas asignadas.</td></tr>';
      return;
    }
    body.innerHTML = accounts.map(function (account) {
      var action = account.status !== 'paid'
        ? '<button class="admin-btn admin-btn-primary admin-btn-sm" onclick="AdminFinancing.openPayment(\'' + account.id + '\')">Registrar abono</button>'
        : '<span style="font-size:.75rem;color:#16a34a;font-weight:700;">Saldada</span>';
      return '<tr><td data-label="Cuenta"><strong>' + escapeHtml(account.accountNumber || account.id) + '</strong><br><small>Próx. ' + escapeHtml(dateLabel(account.nextPaymentDate)) + '</small></td>' +
        '<td data-label="Cliente">' + escapeHtml(account.userName || account.userEmail) + '</td><td data-label="Artículo">' + escapeHtml(account.itemName || '') + '<br><small>' + escapeHtml((account.installmentsPaid || 0) + ' de ' + account.installmentCount + ' cuotas') + '</small></td>' +
        '<td data-label="Financiado">' + money(account.financedAmount) + '</td><td data-label="Abonado">' + money(account.totalPaid) + '</td><td data-label="Balance"><strong>' + money(account.balance) + '</strong></td>' +
        '<td data-label="Estado"><span class="fin-status-pill fin-status-' + escapeHtml(account.status || 'active') + '">' + escapeHtml(accountStatus(account.status)) + '</span></td><td data-label="Acciones">' + action + '</td></tr>';
    }).join('');
  }

  function openPayment(accountId) {
    var account = accounts.find(function (item) { return item.id === accountId; });
    if (!account || account.status === 'paid') return;
    setVal('fin-payment-account-id', account.id);
    setVal('fin-payment-amount', String(Math.min(Number(account.installmentAmount || 0), Number(account.balance || 0)).toFixed(2)));
    setVal('fin-payment-date', new Date().toISOString().slice(0, 10));
    setVal('fin-payment-method', 'cash');
    setVal('fin-payment-reference', '');
    setVal('fin-payment-notes', '');
    var summary = document.getElementById('fin-payment-account-summary');
    if (summary) summary.innerHTML = '<div><strong>' + escapeHtml(account.accountNumber + ' · ' + account.userName) + '</strong><span>' + escapeHtml(account.itemName) + '</span></div><span class="fin-status-pill fin-status-active">Balance ' + money(account.balance) + '</span>';
    window.AdminPanel.openModal('financing-payment-modal');
  }

  async function savePayment(event) {
    event.preventDefault();
    if (!allowed()) return;
    var accountId = val('fin-payment-account-id');
    var amount = round(numVal('fin-payment-amount'));
    var paidAt = val('fin-payment-date');
    if (amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(paidAt)) { toast('Indica un monto y una fecha válidos.', 'error'); return; }
    var button = document.getElementById('fin-payment-save');
    if (button) { button.disabled = true; button.textContent = 'Registrando...'; }
    var paymentRef = db.collection('financing_payments').doc();
    try {
      await db.runTransaction(async function (transaction) {
        var accountRef = db.collection('financing_accounts').doc(accountId);
        var snapshot = await transaction.get(accountRef);
        if (!snapshot.exists) throw new Error('La cuenta ya no existe.');
        var account = snapshot.data();
        var balance = round(account.balance);
        if (amount > balance + 0.001) throw new Error('El abono no puede superar el balance de ' + money(balance) + '.');
        var totalPaid = round(Number(account.totalPaid || 0) + amount);
        var newBalance = round(Number(account.financedAmount || 0) - totalPaid);
        var installmentsPaid = Math.min(Number(account.installmentCount || 0), Math.floor((totalPaid + 0.001) / Number(account.installmentAmount || 1)));
        if (newBalance <= 0.01) { newBalance = 0; totalPaid = round(account.financedAmount); installmentsPaid = Number(account.installmentCount || 0); }
        transaction.set(paymentRef, {
          accountId: accountId, userId: account.userId, amount: amount, method: val('fin-payment-method'),
          reference: val('fin-payment-reference').trim(), notes: val('fin-payment-notes').trim(), paidAt: paidAt,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), createdBy: auth.currentUser.uid
        });
        transaction.update(accountRef, {
          totalPaid: totalPaid, balance: newBalance, installmentsPaid: installmentsPaid,
          status: newBalance === 0 ? 'paid' : 'active', nextPaymentDate: addPeriods(account.firstPaymentDate, installmentsPaid, account.frequency),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(), lastPaymentId: paymentRef.id
        });
      });
      await audit('Registrar abono de financiamiento', accountId + ' · ' + money(amount));
      toast('Abono registrado correctamente.', 'success');
      window.AdminPanel.closeModal('financing-payment-modal');
      await load();
    } catch (error) {
      toast('No se pudo registrar el abono: ' + error.message, 'error');
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Registrar abono'; }
    }
  }

  function addPeriods(firstDate, count, frequency) {
    var date = new Date(String(firstDate || '') + 'T12:00:00');
    if (Number.isNaN(date.getTime())) return firstDate;
    if (frequency === 'weekly') date.setDate(date.getDate() + count * 7);
    else if (frequency === 'biweekly') date.setDate(date.getDate() + count * 15);
    else date.setMonth(date.getMonth() + count);
    return date.toISOString().slice(0, 10);
  }

  function renderTotals() {
    text('admin-fin-total', money(accounts.reduce(function (sum, item) { return sum + Number(item.financedAmount || 0); }, 0)));
    text('admin-fin-paid', money(accounts.reduce(function (sum, item) { return sum + Number(item.totalPaid || 0); }, 0)));
    text('admin-fin-balance', money(accounts.reduce(function (sum, item) { return sum + Number(item.balance || 0); }, 0)));
  }

  function audit(action, details) {
    return db.collection('audit_logs').add({ action: action, details: details, userEmail: auth.currentUser.email || '', userId: auth.currentUser.uid, timestamp: firebase.firestore.FieldValue.serverTimestamp() }).catch(function () { });
  }

  function setup() {
    var accountForm = document.getElementById('financing-account-form');
    var paymentForm = document.getElementById('financing-payment-form');
    if (accountForm) accountForm.addEventListener('submit', saveAccount);
    if (paymentForm) paymentForm.addEventListener('submit', savePayment);
    ['fin-admin-total', 'fin-admin-down', 'fin-admin-count'].forEach(function (id) {
      var field = document.getElementById(id); if (field) field.addEventListener('input', updatePreview);
    });
    if (window.AdminPanel) window.AdminPanel.openFinancingAccountModal = openAccountModal;
  }

  function profileStatus(value) { return ({ pending_review: 'En revisión', approved: 'Aprobado', rejected: 'Rechazado' })[value] || value; }
  function accountStatus(value) { return ({ active: 'Activa', paid: 'Pagada', overdue: 'Atrasada', cancelled: 'Cancelada' })[value] || value; }
  function money(value) { return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(value) || 0); }
  function round(value) { return Math.round((Number(value) || 0) * 100) / 100; }
  function timestamp(value) { if (!value) return 0; if (value.toMillis) return value.toMillis(); if (value.seconds) return value.seconds * 1000; if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(value + 'T12:00:00').getTime(); return new Date(value).getTime() || 0; }
  function dateLabel(value) { var stamp = timestamp(value); return stamp ? new Date(stamp).toLocaleDateString('es-DO') : '—'; }
  function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function numVal(id) { return Number(val(id)) || 0; }
  function setVal(id, value) { var el = document.getElementById(id); if (el) el.value = value; }
  function text(id, value) { var el = document.getElementById(id); if (el) el.textContent = value; }
  function escapeHtml(value) { return String(value === undefined || value === null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function toast(message, type) {
    var node = document.createElement('div');
    node.className = 'admin-toast admin-toast-' + (type || 'info');
    node.textContent = message;
    document.body.appendChild(node);
    requestAnimationFrame(function () { node.classList.add('is-visible'); });
    setTimeout(function () { node.remove(); }, 4200);
  }

  document.addEventListener('DOMContentLoaded', setup);
  window.AdminFinancing = { load: load, review: review, openPayment: openPayment, openDocument: openDocument };
})();
