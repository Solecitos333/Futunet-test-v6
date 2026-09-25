/**
 * Futunet User Panel Logic
 * Manages profile, saved carts, favorites, and order history
 */
(function () {
  'use strict';

  var db = null;
  var currentUser = null;
  var userData = null;

  function init(user, data) {
    db = window.FutunetFirebase.db;
    currentUser = user;
    userData = data;

    renderProfile();
    loadSavedCarts();
    renderFavorites();
    loadUserOrders();
    loadUserSuggestions(user);
    setupProfileForm();
    if (window.FutunetFinancing) window.FutunetFinancing.init(user, data);
    
    var params = new URLSearchParams(window.location.search);
    if (params.get('completeProfile') === '1' && (!data.documentType || !data.documentNumber)) {
      showToast('Completa tu documento de identidad para compras y financiamientos.', 'info');
    }
  }

  // ─── Sanitization & Security Helpers (OWASP XSS & Control Chars Mitigation) ───
  function sanitizeProfileInput(str) {
    if (!str) return '';
    return String(str)
      .replace(/<[^>]*>/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
  }

  // ─── Profile Section ───
  function renderProfile() {
    setText('user-name', userData.displayName || 'Sin nombre');
    setText('user-email', userData.email || '');
    setText('user-role-badge', translateRole(userData.role));

    var el = document.getElementById('user-role-badge');
    if (el) el.className = 'up-role-badge up-role-' + (userData.role || 'user');

    // Fill form fields
    setVal('profile-name', userData.displayName || '');
    setVal('profile-phone', userData.phone || '');
    setVal('profile-address', userData.address || '');
    setVal('profile-document-type', userData.documentType || 'cedula');
    setVal('profile-document-number', userData.documentNumber || '');
    var documentTypeField = document.getElementById('profile-document-type');
    var documentNumberField = document.getElementById('profile-document-number');
    var identityLocked = userData.financingProfileStatus === 'approved';
    if (documentTypeField) documentTypeField.disabled = identityLocked;
    if (documentNumberField) documentNumberField.readOnly = identityLocked;
    var terms = document.getElementById('profile-terms');
    if (terms) {
      terms.checked = userData.termsAccepted === true;
      terms.disabled = userData.termsAccepted === true;
    }

    // Avatar
    var avatar = document.getElementById('user-avatar');
    if (avatar) {
      avatar.textContent = (userData.displayName || userData.email || '?').charAt(0).toUpperCase();
    }
  }

  function translateRole(role) {
    var map = { superadmin: 'Superadmin', admin: 'Administrador', editor: 'Editor', user: 'Usuario' };
    return map[role] || 'Usuario';
  }

  function setupProfileForm() {
    var form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = document.getElementById('profile-save-btn');
      if (btn) btn.disabled = true;

      // 1. Verificación Honeypot (Trampa antispam para bots)
      var hpField = document.getElementById('profile-hp-check');
      if (hpField && hpField.value.trim() !== '') {
        console.warn('Bot profile update blocked via honeypot.');
        showToast('Perfil actualizado correctamente', 'success');
        if (btn) btn.disabled = false;
        return;
      }

      // 2. Cooldown de actualización de perfil (Rate-limiting en cliente 5s)
      var profileCooldownKey = 'futunet_last_profile_update_ts';
      var now = Date.now();
      var lastUpdate = sessionStorage.getItem(profileCooldownKey);
      if (lastUpdate && (now - Number(lastUpdate)) < 5000) {
        var waitSecs = Math.ceil((5000 - (now - Number(lastUpdate))) / 1000);
        showToast('Por favor espera ' + waitSecs + ' segundo(s) antes de volver a guardar.', 'info');
        if (btn) btn.disabled = false;
        return;
      }

      var rawName = document.getElementById('profile-name')?.value || '';
      var rawPhone = document.getElementById('profile-phone')?.value || '';
      var rawAddress = document.getElementById('profile-address')?.value || '';
      var documentType = document.getElementById('profile-document-type')?.value || 'cedula';
      var rawDocNumber = document.getElementById('profile-document-number')?.value || '';
      var acceptedTerms = !!document.getElementById('profile-terms')?.checked;

      if (!acceptedTerms) {
        showToast('Debes aceptar los términos y la política de privacidad.', 'error');
        if (btn) btn.disabled = false;
        return;
      }

      var name = sanitizeProfileInput(rawName).slice(0, 100);
      var phone = sanitizeProfileInput(rawPhone).slice(0, 25);
      var address = sanitizeProfileInput(rawAddress).slice(0, 300);
      var documentNumber = sanitizeProfileInput(rawDocNumber).slice(0, 25);

      if (phone && !/^\+?[0-9\s-]{7,25}$/.test(phone)) {
        showToast('Por favor introduce un número de teléfono válido (mín. 7 dígitos).', 'error');
        if (btn) btn.disabled = false;
        return;
      }

      try {
        var identity = FutunetAuth.normalizeIdentityDocument(documentType, documentNumber, false);
        var updateData = {
          displayName: name,
          phone: phone,
          address: address,
          documentType: identity.documentType,
          documentNumber: identity.documentNumber,
          identityProfileComplete: !!(identity.documentNumber && identity.documentType),
          termsAccepted: true
        };
        if (userData.termsAccepted !== true) {
          updateData.termsAcceptedAt = firebase.firestore.FieldValue.serverTimestamp();
          updateData.termsVersion = '2026-08-01';
        }
        await db.collection('users').doc(currentUser.uid).update(updateData);
        await currentUser.updateProfile({ displayName: name });
        Object.assign(userData, updateData);
        sessionStorage.setItem(profileCooldownKey, String(Date.now()));
        renderProfile();
        showToast('Perfil actualizado correctamente', 'success');
      } catch (err) {
        console.error('Profile update error:', err);
        showToast('Error al guardar: ' + (err.message || 'Intenta de nuevo.'), 'error');
      }
      if (btn) btn.disabled = false;
    });
  }

  // ─── Saved Carts ───
  async function loadSavedCarts() {
    var container = document.getElementById('saved-carts-list');
    if (!container) return;

    try {
      var snapshot = await db.collection('carts')
        .where('userId', '==', currentUser.uid)
        .orderBy('savedAt', 'desc')
        .limit(20)
        .get();

      if (snapshot.empty) {
        container.innerHTML = '<div class="up-empty"><p>No tienes carritos guardados aún</p></div>';
        return;
      }

      var html = '';
      snapshot.forEach(function (doc) {
        var cart = doc.data();
        var items = cart.items || {};
        var count = Object.keys(items).length;
        var date = cart.savedAt ? new Date(cart.savedAt.seconds * 1000).toLocaleDateString('es-DO') : '—';
        html += '<div class="up-cart-card" data-cart-id="' + doc.id + '">' +
          '<div class="up-cart-info">' +
          '  <strong>' + escapeHtml(cart.name || 'Carrito sin nombre') + '</strong>' +
          '  <span>' + count + ' producto' + (count !== 1 ? 's' : '') + ' · ' + date + '</span>' +
          '</div>' +
          '<div class="up-cart-actions">' +
          '  <button class="up-btn-sm up-btn-load" data-action="load" data-cart-id="' + doc.id + '">Cargar</button>' +
          '  <button class="up-btn-sm up-btn-delete" data-action="delete" data-cart-id="' + doc.id + '">Eliminar</button>' +
          '</div>' +
          '</div>';
      });
      container.innerHTML = html;

      // Bind cart actions
      container.querySelectorAll('[data-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var action = this.getAttribute('data-action');
          var cartId = this.getAttribute('data-cart-id');
          if (action === 'load') loadCart(cartId);
          if (action === 'delete') deleteCart(cartId);
        });
      });
    } catch (err) {
      console.error('Load carts error:', err);
      container.innerHTML = '<div class="up-empty"><p>Error al cargar carritos</p></div>';
    }
  }

  async function loadCart(cartId) {
    try {
      var doc = await db.collection('carts').doc(cartId).get();
      if (!doc.exists) { showToast('Carrito no encontrado', 'error'); return; }
      var cart = doc.data();
      localStorage.setItem('futunetCatalogCart', JSON.stringify({ items: cart.items || {} }));
      window.dispatchEvent(new CustomEvent('futunet-cart-updated'));
      showToast('Carrito cargado. Ve al catálogo para verlo.', 'success');
    } catch (err) {
      showToast('Error al cargar el carrito', 'error');
    }
  }

  async function deleteCart(cartId) {
    if (!confirm('¿Eliminar este carrito guardado?')) return;
    try {
      await db.collection('carts').doc(cartId).delete();
      showToast('Carrito eliminado', 'success');
      loadSavedCarts();
    } catch (err) {
      showToast('Error al eliminar', 'error');
    }
  }

  // ─── Save current cart ───
  window.saveCurrentCart = async function () {
    var storedCart = JSON.parse(localStorage.getItem('futunetCatalogCart') || '{}');
    var cartItems = storedCart && storedCart.items && typeof storedCart.items === 'object'
      ? storedCart.items
      : storedCart;
    if (!cartItems || Object.keys(cartItems).length === 0) {
      showToast('Tu carrito está vacío', 'error');
      return;
    }

    var name = prompt('Nombre para este carrito:');
    if (!name || !name.trim()) return;

    try {
      await db.collection('carts').add({
        userId: currentUser.uid,
        name: name.trim(),
        items: cartItems,
        savedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showToast('Carrito guardado exitosamente', 'success');
      loadSavedCarts();
    } catch (err) {
      console.error('Save cart error:', err);
      showToast('Error al guardar el carrito', 'error');
    }
  };

  // ─── Favorites ───
  function renderFavorites() {
    var container = document.getElementById('favorites-list');
    if (!container) return;

    var favs = userData.favorites || [];
    if (favs.length === 0) {
      container.innerHTML = '<div class="up-empty"><p>No tienes productos favoritos</p></div>';
      return;
    }
    container.innerHTML = '<div class="up-empty"><p>' + favs.length + ' favorito(s) guardados. Ve al catálogo para verlos.</p></div>';
  }

  // ─── Orders Section ───
  var allUserOrders = [];

  async function loadUserOrders() {
    var tbody = document.getElementById('user-orders-list-body');
    if (!tbody) return;

    try {
      var snapshot = await db.collection('orders')
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No has realizado ningún pedido aún.</td></tr>';
        return;
      }

      allUserOrders = [];
      var html = '';

      snapshot.forEach(function (doc) {
        var o = doc.data();
        o.id = doc.id;
        allUserOrders.push(o);

        var date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('es-DO') : '—';
        var totalFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(o.total);
        
        var methodMap = { whatsapp: 'WhatsApp', bank_transfer: 'Transferencia' };
        var method = escapeHtml(methodMap[o.paymentMethod] || o.paymentMethod || 'WhatsApp');

        var statusMap = { pending: 'Pendiente', processing: 'Procesando', shipped: 'Enviado', delivered: 'Entregado' };
        var statusLabel = escapeHtml(statusMap[o.status] || o.status || 'Pendiente');
        var statusClass = 'up-badge up-badge-' + escapeHtml(o.status || 'pending');

          html += '<tr class="up-table-row">' +
          '  <td class="up-table-cell up-order-id">#' + o.id.substring(0, 8) + '</td>' +
          '  <td class="up-table-cell">' + date + '</td>' +
          '  <td class="up-table-cell" style="font-weight:700;">' + totalFormatted + '</td>' +
          '  <td class="up-table-cell">' + method + '</td>' +
          '  <td class="up-table-cell"><span class="' + statusClass + '">' + statusLabel + '</span></td>' +
          '  <td class="up-table-cell" style="text-align:right;">' +
          '    <button type="button" class="up-btn-sm up-btn-load" data-order-id="' + escapeHtml(o.id) + '">Ver</button>' +
          '  </td>' +
          '</tr>';
      });

      tbody.innerHTML = html;
      tbody.querySelectorAll('button[data-order-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var orderId = this.getAttribute('data-order-id');
          if (orderId) window.showUserOrderDetail(orderId);
        });
      });
    } catch (err) {
      console.error('Error loading orders:', err);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar tus pedidos.</td></tr>';
    }
  }

  window.showUserOrderDetail = function (orderId) {
    var order = allUserOrders.find(o => o.id === orderId);
    if (!order) return;

    var itemsHtml = '';
    var items = order.items || [];
    items.forEach(function (item) {
      var priceFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.price);
      var totalFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.price * item.qty);
      var img = item.img || 'img/logo.webp';
      
      itemsHtml += '<div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #e5eef8;">' +
        '  <img src="' + escapeHtml(img) + '" style="width:40px; height:40px; object-fit:cover; border-radius:6px;" onerror="this.src=\'img/logo.webp\'">' +
        '  <div style="flex-grow:1;">' +
        '    <div style="font-weight:600; color:#0a101d; font-size:0.85rem;">' + escapeHtml(item.title) + '</div>' +
        '    <div style="font-size:0.75rem; color:#76889e;">' + priceFormatted + ' x ' + item.qty + '</div>' +
        '  </div>' +
        '  <div style="font-weight:600; color:#0a101d; font-size:0.85rem;">' + totalFormatted + '</div>' +
        '</div>';
    });

    var subtotalFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(order.total);

    var voucherHtml = '';
    if (order.paymentMethod === 'bank_transfer' && order.paymentVoucherUrl) {
      var safeVoucherUrl = (order.paymentVoucherUrl || '').trim();
      var isSafeUrl = !safeVoucherUrl.toLowerCase().startsWith('javascript:') && 
                      !safeVoucherUrl.toLowerCase().startsWith('data:');
      if (isSafeUrl) {
        voucherHtml = '<div style="margin-top:16px; padding-top:16px; border-top:1px solid #e5eef8;">' +
          '  <div style="font-size:0.75rem; color:#76889e; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Comprobante de Pago</div>' +
          '  <a href="' + escapeHtml(safeVoucherUrl) + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; color:#0A70A2; font-weight:600; font-size:0.82rem; text-decoration:underline;">' +
          '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '    Ver Comprobante Adjunto' +
          '  </a>' +
          '</div>';
      }
    }

    var contentHtml = '<div>' +
      '  <div style="background:#f3f7fc; padding:12px; border-radius:12px; border:1px solid #e5eef8; margin-bottom:16px; font-size:0.8rem; color:#394c60; display:grid; grid-template-columns:1fr 1fr; gap:12px;">' +
      '    <div>' +
      '      <strong>Contacto:</strong> ' + escapeHtml(order.userName || '—') + '<br>' +
      '      <strong>Teléfono:</strong> ' + escapeHtml(order.userPhone || '—') +
      '    </div>' +
      '    <div>' +
      '      <strong>Envío:</strong> ' + escapeHtml(order.shippingAddress || '—') +
      '    </div>' +
      '  </div>' +
      '  <div style="margin-bottom:16px;">' +
      '    <div style="font-size:0.75rem; color:#76889e; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Artículos</div>' +
      '    ' + itemsHtml +
      '  </div>' +
      '  <div style="background:#f9fafc; padding:12px; border-radius:12px; border:1px solid #e5eef8; display:flex; justify-content:space-between; font-weight:700; color:#0a101d; font-size:0.95rem;">' +
      '    <span>Total:</span>' +
      '    <span>' + subtotalFormatted + '</span>' +
      '  </div>' +
      '  ' + voucherHtml +
      '</div>';

    var container = document.getElementById('user-order-detail-content');
    if (container) container.innerHTML = contentHtml;
    var modal = document.getElementById('user-order-detail-modal');
    if (modal) modal.style.display = 'flex';
  };

  window.closeUserOrderModal = function () {
    var modal = document.getElementById('user-order-detail-modal');
    if (modal) modal.style.display = 'none';
  };

  // ─── Suggestions Section ───
  async function loadUserSuggestions(user) {
    var container = document.getElementById('user-suggestions-list');
    if (!container || !db || !user) return;

    try {
      var snap = await db.collection('suggestions')
        .where('userId', '==', user.uid)
        .limit(20)
        .get();

      var items = [];
      snap.forEach(function (doc) {
        items.push(Object.assign({ id: doc.id }, doc.data()));
      });

      if (items.length === 0 && user.email) {
        try {
          var snapEmail = await db.collection('suggestions')
            .where('authorEmail', '==', user.email)
            .limit(20)
            .get();
          snapEmail.forEach(function (doc) {
            items.push(Object.assign({ id: doc.id }, doc.data()));
          });
        } catch (eEmail) { }
      }

      // Sort by date descending
      items.sort(function (a, b) {
        var tA = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        var tB = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return tB - tA;
      });

      if (items.length === 0) {
        container.innerHTML = '<div class="up-empty" style="text-align:center; padding:36px 16px;">' +
          '<div style="font-size:2.4rem; margin-bottom:8px;">💡</div>' +
          '<h4 style="margin:0 0 6px; font-weight:700; color:#1e293b;">Aún no has registrado sugerencias</h4>' +
          '<p style="margin:0 0 16px; color:#64748b; font-size:0.88rem; max-width:420px; margin-inline:auto;">¿Tienes una idea para la plataforma, nuevos productos o mejoras en el servicio? Aporta tu propuesta y recibe respuesta directa de nuestro equipo.</p>' +
          '<a href="sugerencias.html" class="up-btn-save" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:10px 20px; font-size:0.88rem; width:auto;">Enviar mi primera sugerencia</a>' +
        '</div>';
        return;
      }

      var html = '<div style="display:flex; flex-direction:column; gap:16px;">';
      items.forEach(function (item) {
        var dateStr = 'Reciente';
        if (item.createdAt && item.createdAt.toDate) {
          dateStr = item.createdAt.toDate().toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
        } else if (item.createdAt && item.createdAt.seconds) {
          dateStr = new Date(item.createdAt.seconds * 1000).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        var statusMap = {
          'pending': { label: 'Pendiente', color: '#b45309', bg: '#fef3c7' },
          'in_review': { label: 'En Evaluación', color: '#0369a1', bg: '#e0f2fe' },
          'planned': { label: 'Planificada', color: '#6d28d9', bg: '#ede9fe' },
          'implemented': { label: '¡Implementada!', color: '#15803d', bg: '#dcfce7' },
          'archived': { label: 'Archivada', color: '#475569', bg: '#f1f5f9' }
        };
        var st = statusMap[item.status] || statusMap['pending'];

        var responseHtml = '';
        if (item.officialResponse) {
          responseHtml = '<div style="margin-top:12px; padding:12px 14px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; font-size:0.85rem; color:#14532d;">' +
            '<div style="font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:6px;">' +
              '<span>✔ Respuesta oficial de Futunet</span>' +
              (item.respondedBy ? '<span style="font-weight:normal; opacity:0.8;">— ' + escapeHtml(item.respondedBy) + '</span>' : '') +
            '</div>' +
            '<p style="margin:0; line-height:1.45;">' + escapeHtml(item.officialResponse) + '</p>' +
          '</div>';
        } else {
          responseHtml = '<div style="margin-top:10px; font-size:0.8rem; color:#64748b; font-style:italic;">' +
            '⏳ En revisión por nuestro equipo técnico y directivo.' +
          '</div>';
        }

        html += '<div style="border:1px solid #e2e8f0; border-radius:14px; padding:16px 18px; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.03);">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px;">' +
            '<div>' +
              '<span style="display:inline-block; font-family:monospace; font-weight:700; font-size:0.82rem; background:#f1f5f9; padding:2px 8px; border-radius:6px; color:#0f172a; margin-right:8px;">' + escapeHtml(item.refCode || item.id) + '</span>' +
              '<span style="font-size:0.8rem; color:#94a3b8;">' + escapeHtml(dateStr) + '</span>' +
              '<h4 style="margin:6px 0 0; font-size:1.05rem; font-weight:700; color:#0f172a;">' + escapeHtml(item.title) + '</h4>' +
            '</div>' +
            '<span style="display:inline-block; padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:700; color:' + st.color + '; background:' + st.bg + ';">' + escapeHtml(st.label) + '</span>' +
          '</div>' +
          '<p style="margin:0; font-size:0.88rem; color:#475569; line-height:1.5;">' + escapeHtml(item.description) + '</p>' +
          responseHtml +
        '</div>';
      });
      html += '</div>';

      container.innerHTML = html;
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    } catch (err) {
      console.error('Error cargando sugerencias de usuario:', err);
      container.innerHTML = '<div class="up-empty" style="color:#b91c1c;">No pudimos cargar tus sugerencias en este momento.</div>';
    }
  }

  // ─── Tab Navigation ───
  function setupTabs() {
    var tabs = document.querySelectorAll('[data-up-tab]');
    var panels = document.querySelectorAll('[data-up-panel]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-up-tab');
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });
        this.classList.add('is-active');
        var panel = document.querySelector('[data-up-panel="' + target + '"]');
        if (panel) panel.classList.add('is-active');
        try {
          var url = new URL(window.location.href);
          url.searchParams.set('tab', target);
          url.searchParams.delete('completeProfile');
          window.history.replaceState({}, '', url.toString());
        } catch (e) { }
      });
    });

    var requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (requestedTab) {
      var requestedButton = document.querySelector('[data-up-tab="' + requestedTab + '"]');
      if (requestedButton) requestedButton.click();
    }
  }

  // ─── Helpers ───
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }
  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg, type) {
    var existing = document.querySelector('.up-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'up-toast up-toast-' + (type || 'info');
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  // ─── Init ───
  document.addEventListener('DOMContentLoaded', function () {
    setupTabs();
    FutunetGuard.requireAuth(function (user, data) {
      init(user, data);
      // Show page after auth
      var page = document.getElementById('user-panel-page');
      if (page) page.classList.add('is-loaded');
    });
  });
})();
