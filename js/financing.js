/**
 * Client financing profile, accounts and payment history.
 * Sensitive files live in Firebase Storage and are protected by storage.rules.
 */
(function () {
  'use strict';

  var db = null;
  var storage = null;
  var currentUser = null;
  var userData = null;
  var currentProfile = null;
  var signatureDrawn = false;

  function init(user, data) {
    if (!document.getElementById('financing-profile-status')) return;
    db = window.FutunetFirebase.db;
    storage = window.FutunetFirebase.storage;
    currentUser = user;
    userData = data || {};
    fillProfileDefaults();
    setupSignaturePad();
    setupForm();
    loadFinancingProfile();
    loadAccounts();
  }

  function fillProfileDefaults() {
    setVal('fin-document-type', userData.documentType || 'cedula');
    setVal('fin-document-number', userData.documentNumber || '');
    setVal('fin-phone', userData.phone || '');
    setVal('fin-address', userData.address || '');
  }

  function setupSignaturePad() {
    var canvas = document.getElementById('fin-signature-canvas');
    if (!canvas || canvas.dataset.ready === '1') return;
    canvas.dataset.ready = '1';
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    var drawing = false;

    function point(event) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    canvas.addEventListener('pointerdown', function (event) {
      drawing = true;
      signatureDrawn = true;
      var p = point(event);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', function (event) {
      if (!drawing) return;
      var p = point(event);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
    function stop(event) {
      drawing = false;
      if (event.pointerId !== undefined && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('pointerleave', function () { drawing = false; });

    var clear = document.getElementById('fin-clear-signature');
    if (clear) clear.addEventListener('click', function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      signatureDrawn = false;
    });
  }

  function setupForm() {
    var form = document.getElementById('financing-profile-form');
    if (!form || form.dataset.ready === '1') return;
    form.dataset.ready = '1';
    form.addEventListener('submit', submitProfile);
  }

  async function loadFinancingProfile() {
    try {
      var snapshot = await db.collection('financing_profiles').doc(currentUser.uid).get();
      currentProfile = snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
      renderProfileStatus();
    } catch (error) {
      console.error('Financing profile load error:', error);
      renderStatus('No se pudo cargar el expediente', 'Intenta recargar la página.', 'rejected', 'Error');
    }
  }

  function renderProfileStatus() {
    var status = currentProfile ? currentProfile.status : 'not_started';
    var form = document.getElementById('financing-profile-form');
    if (status === 'approved') {
      renderStatus('Expediente aprobado', 'Ya puedes solicitar compras y servicios financiados.', status, 'Aprobado');
      form.hidden = true;
    } else if (status === 'pending_review') {
      renderStatus('Expediente en revisión', 'Recibimos tus documentos. Un administrador validará la información antes de habilitar el crédito.', status, 'En revisión');
      form.hidden = true;
    } else if (status === 'rejected') {
      var reason = currentProfile.rejectionReason ? ' Motivo: ' + currentProfile.rejectionReason : '';
      renderStatus('Necesitamos que corrijas el expediente', 'Puedes volver a enviar las fotos y la firma.' + reason, status, 'Requiere cambios');
      form.hidden = false;
      fillFromProfile();
    } else {
      renderStatus('Completa tu expediente', 'Este paso adicional es obligatorio únicamente para solicitar financiamiento.', status, 'Pendiente');
      form.hidden = false;
    }
  }

  function fillFromProfile() {
    if (!currentProfile) return;
    setVal('fin-document-type', currentProfile.documentType || userData.documentType || 'cedula');
    setVal('fin-document-number', currentProfile.documentNumber || userData.documentNumber || '');
    setVal('fin-phone', currentProfile.phone || userData.phone || '');
    setVal('fin-address', currentProfile.address || userData.address || '');
  }

  function renderStatus(title, description, status, label) {
    var container = document.getElementById('financing-profile-status');
    if (!container) return;
    container.innerHTML = '<div><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(description) + '</span></div>' +
      '<span class="fin-status-pill fin-status-' + escapeHtml(status) + '">' + escapeHtml(label) + '</span>';
  }

  async function submitProfile(event) {
    event.preventDefault();
    var button = document.getElementById('financing-submit-btn');
    var idFile = document.getElementById('fin-id-photo').files[0];
    var selfieFile = document.getElementById('fin-selfie-photo').files[0];
    var accepted = document.getElementById('financing-terms').checked;

    try {
      var identity = FutunetAuth.normalizeIdentityDocument(
        document.getElementById('fin-document-type').value,
        document.getElementById('fin-document-number').value
      );
      validateImage(idFile, 'la foto del documento');
      validateImage(selfieFile, 'la foto sosteniendo el documento');
      if (!signatureDrawn) throw new Error('Dibuja tu firma digital antes de enviar.');
      if (!accepted) throw new Error('Debes aceptar las políticas y condiciones de financiamiento.');

      button.disabled = true;
      button.textContent = 'Protegiendo y subiendo documentos...';
      var stamp = Date.now();
      var basePath = 'financing-documents/' + currentUser.uid + '/';
      var idUpload = await uploadFile(idFile, basePath + 'document_' + stamp + extensionFor(idFile));
      var selfieUpload = await uploadFile(selfieFile, basePath + 'selfie_' + stamp + extensionFor(selfieFile));
      var signatureBlob = await canvasBlob(document.getElementById('fin-signature-canvas'));
      var signatureUpload = await uploadFile(signatureBlob, basePath + 'signature_' + stamp + '.png', 'image/png');
      var phone = document.getElementById('fin-phone').value.trim();
      var address = document.getElementById('fin-address').value.trim();
      if (phone.length < 7) throw new Error('Ingresa un teléfono válido.');
      if (address.length < 8) throw new Error('Ingresa tu dirección residencial completa.');

      var now = firebase.firestore.FieldValue.serverTimestamp();
      var profile = {
        userId: currentUser.uid,
        displayName: userData.displayName || currentUser.displayName || '',
        email: userData.email || currentUser.email || '',
        phone: phone,
        address: address,
        documentType: identity.documentType,
        documentNumber: identity.documentNumber,
        idPhotoPath: idUpload.path,
        selfiePhotoPath: selfieUpload.path,
        signaturePath: signatureUpload.path,
        termsAccepted: true,
        termsVersion: '2026-08-01',
        termsAcceptedAt: now,
        status: 'pending_review',
        updatedAt: now,
        submittedAt: now
      };
      if (!currentProfile) profile.createdAt = now;
      if (currentProfile && currentProfile.status === 'rejected') {
        profile.rejectionReason = firebase.firestore.FieldValue.delete();
        profile.reviewedAt = firebase.firestore.FieldValue.delete();
        profile.reviewedBy = firebase.firestore.FieldValue.delete();
      }
      var batch = db.batch();
      batch.set(db.collection('financing_profiles').doc(currentUser.uid), profile, { merge: !!currentProfile });
      batch.update(db.collection('users').doc(currentUser.uid), {
        phone: phone,
        address: address,
        documentType: identity.documentType,
        documentNumber: identity.documentNumber,
        identityProfileComplete: true,
        financingProfileStatus: 'pending_review'
      });
      await batch.commit();
      await writeAudit('Expediente de financiamiento enviado', 'El cliente envió sus documentos para revisión.');
      currentProfile = { ...profile, rejectionReason: '', createdAt: currentProfile ? currentProfile.createdAt : now };
      renderProfileStatus();
      showToast('Expediente enviado correctamente. Te notificaremos cuando sea revisado.', 'success');
    } catch (error) {
      console.error('Financing profile submit error:', error);
      showToast(error.message || 'No se pudo enviar el expediente.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Enviar expediente para revisión';
    }
  }

  function validateImage(file, label) {
    if (!file) throw new Error('Selecciona ' + label + '.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Solo se aceptan imágenes JPG, PNG o WEBP.');
    }
    if (file.size > 5 * 1024 * 1024) throw new Error('Cada imagen debe pesar 5 MB o menos.');
  }

  function extensionFor(file) {
    var map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
    return map[file.type] || '.jpg';
  }

  async function uploadFile(file, path, contentType) {
    var ref = storage.ref().child(path);
    await ref.put(file, { contentType: contentType || file.type });
    return { path: path };
  }

  function canvasBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error('No se pudo procesar la firma.')); }, 'image/png');
    });
  }

  async function loadAccounts() {
    var container = document.getElementById('financing-accounts-list');
    try {
      var results = await Promise.all([
        db.collection('financing_accounts').where('userId', '==', currentUser.uid).get(),
        db.collection('financing_payments').where('userId', '==', currentUser.uid).get()
      ]);
      var accounts = results[0].docs.map(function (doc) { return { id: doc.id, ...doc.data() }; });
      var payments = results[1].docs.map(function (doc) { return { id: doc.id, ...doc.data() }; });
      accounts.sort(function (a, b) { return timestampValue(b.createdAt) - timestampValue(a.createdAt); });
      payments.sort(function (a, b) { return timestampValue(b.paidAt) - timestampValue(a.paidAt); });
      renderAccounts(accounts, payments);
    } catch (error) {
      console.error('Financing accounts load error:', error);
      if (container) container.innerHTML = '<div class="fin-empty">No se pudieron cargar las cuentas en este momento.</div>';
    }
  }

  function renderAccounts(accounts, payments) {
    var totalFinanced = accounts.reduce(function (sum, account) { return sum + number(account.financedAmount); }, 0);
    var totalPaid = accounts.reduce(function (sum, account) { return sum + number(account.totalPaid); }, 0);
    var totalBalance = accounts.reduce(function (sum, account) { return sum + number(account.balance); }, 0);
    setText('fin-total-financed', money(totalFinanced));
    setText('fin-total-paid', money(totalPaid));
    setText('fin-total-balance', money(totalBalance));
    var container = document.getElementById('financing-accounts-list');
    if (!accounts.length) {
      container.innerHTML = '<div class="fin-empty">Aún no tienes artículos o servicios asignados a cuotas.</div>';
      return;
    }
    container.innerHTML = accounts.map(function (account) {
      var accountPayments = payments.filter(function (payment) { return payment.accountId === account.id; });
      var financed = number(account.financedAmount);
      var paid = number(account.totalPaid);
      var progress = financed > 0 ? Math.min(100, Math.max(0, (paid / financed) * 100)) : 0;
      return '<article class="fin-account-card">' +
        '<div class="fin-account-head"><div><h4>' + escapeHtml(account.itemName || 'Financiamiento') + '</h4>' +
        '<div class="fin-account-meta">Cuenta ' + escapeHtml(account.accountNumber || account.id) + ' · ' + escapeHtml(frequencyLabel(account.frequency)) + '</div></div>' +
        '<span class="fin-status-pill fin-status-' + escapeHtml(account.status || 'active') + '">' + escapeHtml(statusLabel(account.status)) + '</span></div>' +
        (account.description ? '<p class="fin-account-meta">' + escapeHtml(account.description) + '</p>' : '') +
        '<div class="fin-progress"><span style="width:' + progress.toFixed(1) + '%"></span></div>' +
        '<div class="fin-account-numbers">' +
          numberBox('Precio total', money(account.totalAmount)) + numberBox('Inicial', money(account.downPayment)) +
          numberBox('Monto financiado', money(financed)) + numberBox('Abonado', money(paid)) +
          numberBox('Balance', money(account.balance)) + numberBox('Cuota', money(account.installmentAmount)) +
          numberBox('Cuotas pagadas', String(account.installmentsPaid || 0) + ' de ' + String(account.installmentCount || 0)) +
          numberBox('Próximo pago', formatDate(account.nextPaymentDate)) +
        '</div>' +
        '<div class="fin-payments"><strong style="font-size:.82rem;color:#0f172a;">Historial de abonos</strong>' +
        (accountPayments.length ? accountPayments.map(paymentRow).join('') : '<div class="fin-account-meta" style="padding-top:8px;">Todavía no hay abonos registrados.</div>') +
        '</div></article>';
    }).join('');
  }

  function numberBox(label, value) {
    return '<div class="fin-account-number"><small>' + escapeHtml(label) + '</small><strong>' + escapeHtml(value) + '</strong></div>';
  }

  function paymentRow(payment) {
    return '<div class="fin-payment-row"><span>' + formatDate(payment.paidAt) + '</span><strong>' + money(payment.amount) + '</strong><span>' + escapeHtml(methodLabel(payment.method)) + '</span><span>' + escapeHtml(payment.reference || 'Sin referencia') + '</span></div>';
  }

  function frequencyLabel(value) {
    return ({ weekly: 'Cuotas semanales', biweekly: 'Cuotas quincenales', monthly: 'Cuotas mensuales' })[value] || 'Plan de cuotas';
  }
  function statusLabel(value) {
    return ({ active: 'Activa', paid: 'Pagada', overdue: 'Atrasada', cancelled: 'Cancelada' })[value] || 'Activa';
  }
  function methodLabel(value) {
    return ({ cash: 'Efectivo', transfer: 'Transferencia', card: 'Tarjeta', other: 'Otro' })[value] || value || 'Pago';
  }
  function money(value) {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(number(value));
  }
  function number(value) { return Math.round((Number(value) || 0) * 100) / 100; }
  function timestampValue(value) {
    if (!value) return 0;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (value.seconds) return value.seconds * 1000;
    return new Date(value).getTime() || 0;
  }
  function formatDate(value) {
    if (!value) return '—';
    var date = typeof value.toDate === 'function' ? value.toDate() : new Date(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T12:00:00' : value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function setVal(id, value) { var el = document.getElementById(id); if (el) el.value = value; }
  function setText(id, value) { var el = document.getElementById(id); if (el) el.textContent = value; }
  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function showToast(message, type) {
    if (window.showToast) return window.showToast(message, type);
    var toast = document.createElement('div');
    toast.className = 'up-toast up-toast-' + (type || 'info');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    setTimeout(function () { toast.remove(); }, 4200);
  }
  function writeAudit(action, details) {
    return db.collection('audit_logs').add({
      action: action,
      details: details,
      userEmail: currentUser.email || '',
      userId: currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () { });
  }

  window.FutunetFinancing = { init: init, reloadAccounts: loadAccounts };
})();
