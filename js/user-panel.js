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
    setupProfileForm();
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

      var name = document.getElementById('profile-name').value.trim();
      var phone = document.getElementById('profile-phone').value.trim();
      var address = document.getElementById('profile-address').value.trim();

      try {
        await db.collection('users').doc(currentUser.uid).update({
          displayName: name,
          phone: phone,
          address: address
        });
        await currentUser.updateProfile({ displayName: name });
        userData.displayName = name;
        userData.phone = phone;
        userData.address = address;
        renderProfile();
        showToast('Perfil actualizado correctamente', 'success');
      } catch (err) {
        console.error('Profile update error:', err);
        showToast('Error al guardar. Intenta de nuevo.', 'error');
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
      localStorage.setItem('futunetCatalogCart', JSON.stringify(cart.items || {}));
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
    var cartData = JSON.parse(localStorage.getItem('futunetCatalogCart') || '{}');
    if (Object.keys(cartData).length === 0) {
      showToast('Tu carrito está vacío', 'error');
      return;
    }

    var name = prompt('Nombre para este carrito:');
    if (!name || !name.trim()) return;

    try {
      await db.collection('carts').add({
        userId: currentUser.uid,
        name: name.trim(),
        items: cartData,
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
        var method = methodMap[o.paymentMethod] || o.paymentMethod || 'WhatsApp';

        var statusMap = { pending: 'Pendiente', processing: 'Procesando', shipped: 'Enviado', delivered: 'Entregado' };
        var statusLabel = statusMap[o.status] || o.status || 'Pendiente';
        var statusClass = 'up-badge up-badge-' + (o.status || 'pending');

        html += '<tr class="up-table-row">' +
          '  <td class="up-table-cell up-order-id">#' + o.id.substring(0, 8) + '</td>' +
          '  <td class="up-table-cell">' + date + '</td>' +
          '  <td class="up-table-cell" style="font-weight:700;">' + totalFormatted + '</td>' +
          '  <td class="up-table-cell">' + method + '</td>' +
          '  <td class="up-table-cell"><span class="' + statusClass + '">' + statusLabel + '</span></td>' +
          '  <td class="up-table-cell" style="text-align:right;">' +
          '    <button class="up-btn-sm up-btn-load" onclick="window.showUserOrderDetail(\'' + o.id + '\')">Ver</button>' +
          '  </td>' +
          '</tr>';
      });

      tbody.innerHTML = html;
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
        '  <img src="' + img + '" style="width:40px; height:40px; object-fit:cover; border-radius:6px;" onerror="this.src=\'img/logo.webp\'">' +
        '  <div style="flex-grow:1;">' +
        '    <div style="font-weight:600; color:#0a101d; font-size:0.85rem;">' + item.title + '</div>' +
        '    <div style="font-size:0.75rem; color:#76889e;">' + priceFormatted + ' x ' + item.qty + '</div>' +
        '  </div>' +
        '  <div style="font-weight:600; color:#0a101d; font-size:0.85rem;">' + totalFormatted + '</div>' +
        '</div>';
    });

    var subtotalFormatted = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(order.total);

    var voucherHtml = '';
    if (order.paymentMethod === 'bank_transfer' && order.paymentVoucherUrl) {
      voucherHtml = '<div style="margin-top:16px; padding-top:16px; border-top:1px solid #e5eef8;">' +
        '  <div style="font-size:0.75rem; color:#76889e; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Comprobante de Pago</div>' +
        '  <a href="' + order.paymentVoucherUrl + '" target="_blank" style="display:inline-flex; align-items:center; gap:6px; color:#0A70A2; font-weight:600; font-size:0.82rem; text-decoration:underline;">' +
        '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
        '    Ver Comprobante Adjunto' +
        '  </a>' +
        '</div>';
    }

    var contentHtml = '<div>' +
      '  <div style="background:#f3f7fc; padding:12px; border-radius:12px; border:1px solid #e5eef8; margin-bottom:16px; font-size:0.8rem; color:#394c60; display:grid; grid-template-columns:1fr 1fr; gap:12px;">' +
      '    <div>' +
      '      <strong>Contacto:</strong> ' + (order.userName || '—') + '<br>' +
      '      <strong>Teléfono:</strong> ' + (order.userPhone || '—') +
      '    </div>' +
      '    <div>' +
      '      <strong>Envío:</strong> ' + (order.shippingAddress || '—') +
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
      });
    });
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
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
