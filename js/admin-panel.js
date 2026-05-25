/**
 * Futunet Admin Panel Logic
 * CRUD operations for inventory, users, discounts, orders, config
 */
(function () {
  'use strict';

  var db, storage, currentUserData;

  function init() {
    db = window.FutunetFirebase.db;
    storage = window.FutunetFirebase.storage;
    currentUserData = FutunetAuth.getUserData();

    loadDashboardStats();
    loadInventory();
    loadUsers();
    loadDiscounts();
    loadOrders();
    loadConfig();
    setupModals();
  }

  // ═══════════════════════════════════
  // DASHBOARD STATS
  // ═══════════════════════════════════
  async function loadDashboardStats() {
    try {
      var products = await db.collection('products').get();
      var users = await db.collection('users').get();
      var orders = await db.collection('orders').get();
      var discounts = await db.collection('discounts').where('isActive', '==', true).get();

      setText('stat-products', products.size);
      setText('stat-users', users.size);
      setText('stat-orders', orders.size);
      setText('stat-discounts', discounts.size);
    } catch (e) {
      console.warn('Stats load error:', e);
    }
  }

  // ═══════════════════════════════════
  // INVENTORY
  // ═══════════════════════════════════
  var allProducts = [];

  async function loadInventory() {
    var tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">Cargando...</td></tr>';

    try {
      var snapshot = await db.collection('products').orderBy('title').get();
      allProducts = [];
      snapshot.forEach(function (doc) { allProducts.push({ id: doc.id, ...doc.data() }); });
      renderInventoryTable(allProducts);
    } catch (e) {
      console.error('Inventory load error:', e);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar inventario. Verifica las reglas de Firestore.</td></tr>';
    }
  }

  function renderInventoryTable(products) {
    var tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No hay productos. Click "Agregar producto" para comenzar.</td></tr>';
      return;
    }

    var html = '';
    products.forEach(function (p) {
      var img = p.img || p.gallery?.[0] || 'img/logo.png';
      html += '<tr>' +
        '<td data-label="Imagen"><img src="' + escapeAttr(img) + '" style="width:48px;height:48px;object-fit:cover;border-radius:10px;" alt="" onerror="this.src=\'img/logo.png\'"></td>' +
        '<td data-label="Nombre"><strong style="color:#0a101d;">' + escapeHtml(p.title || 'Sin nombre') + '</strong></td>' +
        '<td data-label="Categoría" class="col-hide-mobile">' + escapeHtml(p.category || p.department || '-') + '</td>' +
        '<td data-label="Precio">' + formatPrice(p.price) + '</td>' +
        '<td data-label="Stock" class="col-hide-mobile">' + (p.stock != null ? p.stock : '-') + '</td>' +
        '<td data-label="Acciones">' +
        '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editProduct(\'' + p.id + '\')" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>' +
        '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteProduct(\'' + p.id + '\')" title="Eliminar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>' +
        '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  function searchInventory(query) {
    var q = query.toLowerCase().trim();
    if (!q) { renderInventoryTable(allProducts); return; }
    var filtered = allProducts.filter(function (p) {
      return (p.title || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q);
    });
    renderInventoryTable(filtered);
  }

  async function saveProduct(data, productId) {
    try {
      data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      data.updatedBy = currentUserData.uid || '';
      if (productId) {
        await db.collection('products').doc(productId).update(data);
        showToast('Producto actualizado', 'success');
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.isActive = true;
        await db.collection('products').add(data);
        showToast('Producto creado', 'success');
      }
      closeModal('product-modal');
      loadInventory();
      loadDashboardStats();
    } catch (e) {
      console.error('Save product error:', e);
      showToast('Error al guardar: ' + e.message, 'error');
    }
  }

  async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      await db.collection('products').doc(id).delete();
      showToast('Producto eliminado', 'success');
      loadInventory();
      loadDashboardStats();
    } catch (e) {
      showToast('Error al eliminar: ' + e.message, 'error');
    }
  }

  function editProduct(id) {
    var product = allProducts.find(function (p) { return p.id === id; });
    if (!product) return;

    setVal('product-id', product.id);
    setVal('product-title', product.title || '');
    setVal('product-desc', product.desc || '');
    setVal('product-price', product.price || '');
    setVal('product-category', product.category || product.department || '');
    setVal('product-brand', product.brand || '');
    setVal('product-stock', product.stock != null ? product.stock : '');
    setVal('product-img', product.img || '');

    var modalTitle = document.querySelector('#product-modal .admin-modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Editar producto';
    openModal('product-modal');
  }

  function openNewProduct() {
    document.getElementById('product-form').reset();
    setVal('product-id', '');
    var modalTitle = document.querySelector('#product-modal .admin-modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Agregar producto';
    openModal('product-modal');
  }

  // ═══════════════════════════════════
  // USERS
  // ═══════════════════════════════════
  var allUsers = [];

  async function loadUsers() {
    var tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:#76889e;">Cargando...</td></tr>';

    try {
      var snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
      allUsers = [];
      snapshot.forEach(function (doc) { allUsers.push({ id: doc.id, ...doc.data() }); });
      renderUsersTable(allUsers);
    } catch (e) {
      console.error('Users load error:', e);
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar usuarios</td></tr>';
    }
  }

  function renderUsersTable(users) {
    var tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;">No hay usuarios registrados.</td></tr>';
      return;
    }

    var html = '';
    users.forEach(function (u) {
      var canEdit = currentUserData.role === 'superadmin' || (u.role !== 'superadmin' && u.role !== 'admin');
      html += '<tr>' +
        '<td data-label="Nombre"><strong style="color:#0a101d;">' + escapeHtml(u.displayName || 'Sin nombre') + '</strong></td>' +
        '<td data-label="Email">' + escapeHtml(u.email || '') + '</td>' +
        '<td data-label="Rol"><span class="admin-role-badge role-' + (u.role || 'user') + '">' + (u.role || 'user') + '</span></td>' +
        '<td data-label="Estado"><span class="admin-status-badge status-' + (u.status || 'active') + '">' + (u.status || 'active') + '</span></td>' +
        '<td data-label="Acciones">' +
        (canEdit
          ? '<button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editUser(\'' + u.id + '\')" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
          : '<span style="font-size:0.75rem;color:#a0b0c4;">—</span>') +
        '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  function editUser(id) {
    var user = allUsers.find(function (u) { return u.id === id; });
    if (!user) return;

    setVal('user-id', user.id);
    setVal('user-name-input', user.displayName || '');
    setVal('user-email-input', user.email || '');
    setVal('user-role-select', user.role || 'user');

    var statusCheck = document.getElementById('user-status-check');
    if (statusCheck) statusCheck.checked = user.status === 'active';

    // Restrict role options based on current user's role
    var roleSelect = document.getElementById('user-role-select');
    if (roleSelect) {
      var opts = roleSelect.options;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === 'superadmin' && currentUserData.role !== 'superadmin') {
          opts[i].disabled = true;
        } else {
          opts[i].disabled = false;
        }
      }
    }

    openModal('user-modal');
  }

  async function saveUser() {
    var userId = getVal('user-id');
    var role = getVal('user-role-select');
    var statusCheck = document.getElementById('user-status-check');
    var status = (statusCheck && statusCheck.checked) ? 'active' : 'disabled';
    var displayName = getVal('user-name-input');

    if (!userId) return;

    try {
      await db.collection('users').doc(userId).update({
        displayName: displayName,
        role: role,
        status: status
      });
      showToast('Usuario actualizado', 'success');
      closeModal('user-modal');
      loadUsers();
      loadDashboardStats();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  // ═══════════════════════════════════
  // DISCOUNTS
  // ═══════════════════════════════════
  async function loadDiscounts() {
    var tbody = document.getElementById('discounts-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">Cargando...</td></tr>';

    try {
      var snapshot = await db.collection('discounts').get();
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No hay códigos de descuento creados.</td></tr>';
        return;
      }

      var html = '';
      snapshot.forEach(function (doc) {
        var d = doc.data();
        var typeLabel = d.type === 'percent' ? d.value + '%' : 'RD$' + d.value;
        var statusClass = d.isActive ? 'status-active' : 'status-disabled';
        var statusLabel = d.isActive ? 'Activo' : 'Inactivo';

        html += '<tr>' +
          '<td data-label="Código"><strong style="color:#0a101d;font-family:monospace;">' + escapeHtml(doc.id) + '</strong></td>' +
          '<td data-label="Tipo">' + (d.type === 'percent' ? 'Porcentaje' : 'Monto fijo') + '</td>' +
          '<td data-label="Valor">' + typeLabel + '</td>' +
          '<td data-label="Uso">' + (d.usageCount || 0) + '/' + (d.maxUses || '∞') + '</td>' +
          '<td data-label="Estado"><span class="admin-status-badge ' + statusClass + '">' + statusLabel + '</span></td>' +
          '<td data-label="Acciones">' +
          '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.toggleDiscount(\'' + doc.id + '\', ' + !d.isActive + ')" title="' + (d.isActive ? 'Desactivar' : 'Activar') + '">' + (d.isActive ? '⏸' : '▶') + '</button>' +
          '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteDiscount(\'' + doc.id + '\')" title="Eliminar">✕</button>' +
          '</td>' +
          '</tr>';
      });
      tbody.innerHTML = html;
    } catch (e) {
      console.error('Discounts load error:', e);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar descuentos</td></tr>';
    }
  }

  async function saveDiscount() {
    var code = getVal('discount-code').trim().toUpperCase();
    var type = getVal('discount-type');
    var value = parseFloat(getVal('discount-value')) || 0;
    var minPurchase = parseFloat(getVal('discount-min')) || 0;
    var maxUses = parseInt(getVal('discount-max-uses')) || 0;
    var expiry = getVal('discount-expiry');

    if (!code) { showToast('Ingresa un código', 'error'); return; }
    if (value <= 0) { showToast('El valor debe ser mayor a 0', 'error'); return; }

    try {
      await db.collection('discounts').doc(code).set({
        type: type,
        value: value,
        minPurchase: minPurchase,
        maxUses: maxUses,
        usageCount: 0,
        expiresAt: expiry ? firebase.firestore.Timestamp.fromDate(new Date(expiry)) : null,
        isActive: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showToast('Código de descuento creado', 'success');
      closeModal('discount-modal');
      loadDiscounts();
      loadDashboardStats();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  async function toggleDiscount(code, newState) {
    try {
      await db.collection('discounts').doc(code).update({ isActive: newState });
      showToast(newState ? 'Descuento activado' : 'Descuento desactivado', 'success');
      loadDiscounts();
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  }

  async function deleteDiscount(code) {
    if (!confirm('¿Eliminar el código "' + code + '"?')) return;
    try {
      await db.collection('discounts').doc(code).delete();
      showToast('Descuento eliminado', 'success');
      loadDiscounts();
      loadDashboardStats();
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  }

  // ═══════════════════════════════════
  // ORDERS
  // ═══════════════════════════════════
  async function loadOrders() {
    var tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">Cargando...</td></tr>';

    try {
      var snapshot = await db.collection('orders').orderBy('createdAt', 'desc').limit(50).get();
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No hay pedidos registrados.</td></tr>';
        return;
      }

      var html = '';
      snapshot.forEach(function (doc) {
        var o = doc.data();
        var date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('es-DO') : '—';
        var statusMap = { pending: 'Pendiente', processing: 'Procesando', shipped: 'Enviado', delivered: 'Entregado' };
        var statusLabel = statusMap[o.status] || o.status || 'Pendiente';

        html += '<tr>' +
          '<td data-label="ID" style="font-family:monospace;font-size:0.78rem;">' + doc.id.substring(0, 8) + '...</td>' +
          '<td data-label="Cliente">' + escapeHtml(o.userName || '—') + '</td>' +
          '<td data-label="Total"><strong>' + formatPrice(o.total) + '</strong></td>' +
          '<td data-label="Estado"><span class="admin-role-badge role-' + (o.status === 'delivered' ? 'editor' : o.status === 'processing' ? 'admin' : 'user') + '">' + statusLabel + '</span></td>' +
          '<td data-label="Fecha" class="col-hide-mobile">' + date + '</td>' +
          '<td data-label="Acciones">' +
          '  <select onchange="AdminPanel.updateOrderStatus(\'' + doc.id + '\', this.value)" style="padding:4px 8px;border:1px solid #e5eef8;border-radius:8px;font-size:0.78rem;font-family:Outfit;">' +
          '    <option value="pending"' + (o.status === 'pending' ? ' selected' : '') + '>Pendiente</option>' +
          '    <option value="processing"' + (o.status === 'processing' ? ' selected' : '') + '>Procesando</option>' +
          '    <option value="shipped"' + (o.status === 'shipped' ? ' selected' : '') + '>Enviado</option>' +
          '    <option value="delivered"' + (o.status === 'delivered' ? ' selected' : '') + '>Entregado</option>' +
          '  </select>' +
          '</td>' +
          '</tr>';
      });
      tbody.innerHTML = html;
    } catch (e) {
      console.error('Orders load error:', e);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar pedidos</td></tr>';
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await db.collection('orders').doc(orderId).update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showToast('Estado actualizado', 'success');
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  }

  // ═══════════════════════════════════
  // CONFIG
  // ═══════════════════════════════════
  async function loadConfig() {
    try {
      var doc = await db.collection('config').doc('site').get();
      if (doc.exists) {
        var data = doc.data();
        setVal('config-whatsapp', data.whatsappNumber || '');
        setVal('config-sitename', data.siteName || 'Futunet');
        var maint = document.getElementById('config-maintenance');
        if (maint) maint.checked = data.maintenanceMode || false;
      }
    } catch (e) { console.warn('Config load error:', e); }
  }

  async function saveConfig() {
    var whatsapp = getVal('config-whatsapp');
    var siteName = getVal('config-sitename');
    var maint = document.getElementById('config-maintenance');
    var maintenanceMode = maint ? maint.checked : false;

    try {
      await db.collection('config').doc('site').set({
        whatsappNumber: whatsapp,
        siteName: siteName,
        maintenanceMode: maintenanceMode,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      showToast('Configuración guardada', 'success');
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  // ═══════════════════════════════════
  // MODALS
  // ═══════════════════════════════════
  function setupModals() {
    // Product form
    var productForm = document.getElementById('product-form');
    if (productForm) {
      productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {
          title: getVal('product-title'),
          desc: getVal('product-desc'),
          price: parseFloat(getVal('product-price')) || 0,
          category: getVal('product-category'),
          brand: getVal('product-brand'),
          stock: parseInt(getVal('product-stock')) || 0,
          img: getVal('product-img')
        };
        var id = getVal('product-id');
        saveProduct(data, id || null);
      });
    }

    // User form
    var userForm = document.getElementById('user-form');
    if (userForm) {
      userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveUser();
      });
    }

    // Discount form
    var discountForm = document.getElementById('discount-form');
    if (discountForm) {
      discountForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveDiscount();
      });
    }

    // Config form
    var configForm = document.getElementById('config-form');
    if (configForm) {
      configForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveConfig();
      });
    }

    // Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = this.closest('.admin-modal-overlay');
        if (modal) modal.classList.remove('is-open');
      });
    });

    // Inventory search
    var searchInput = document.getElementById('inventory-search');
    if (searchInput) {
      var debounceTimer;
      searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        var q = this.value;
        debounceTimer = setTimeout(function () { searchInventory(q); }, 300);
      });
    }
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.add('is-open');
  }
  function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.remove('is-open');
  }

  // ═══════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════
  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function setVal(id, val) { var el = document.getElementById(id); if (el) el.value = val; }
  function getVal(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function escapeHtml(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  function escapeAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function formatPrice(p) {
    if (p == null || p === '' || p === 'Contactar') return '<span style="color:#0A70A2;font-weight:600;">Contactar</span>';
    var num = parseFloat(p);
    if (isNaN(num)) return '<span style="color:#0A70A2;font-weight:600;">' + p + '</span>';
    return 'RD$ ' + num.toLocaleString('es-DO', { minimumFractionDigits: 2 });
  }

  function showToast(msg, type) {
    var existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'admin-toast admin-toast-' + (type || 'success');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-visible'); });
    setTimeout(function () { t.classList.remove('is-visible'); setTimeout(function () { t.remove(); }, 300); }, 3000);
  }

  // ─── Public API ───
  window.AdminPanel = {
    init: init,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
    openNewProduct: openNewProduct,
    editUser: editUser,
    saveUser: saveUser,
    toggleDiscount: toggleDiscount,
    deleteDiscount: deleteDiscount,
    updateOrderStatus: updateOrderStatus,
    saveConfig: saveConfig,
    openModal: openModal,
    closeModal: closeModal,
    loadInventory: loadInventory,
    loadUsers: loadUsers,
    loadDiscounts: loadDiscounts,
    loadOrders: loadOrders,
    searchInventory: searchInventory
  };
})();
