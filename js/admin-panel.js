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
    initImageUploader(); // Ensure image uploader starts

    // Auto-migrate hidden items ONCE without user intervention
    if (currentUserData.role === 'superadmin' && !localStorage.getItem('futunet_auto_migrated_v2')) {
      localStorage.setItem('futunet_auto_migrated_v2', 'true');
      syncToFirebase();
    }
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
  var currentCategoryFilter = 'all';
  var currentSearchQuery = '';

  async function loadInventory() {
    if (currentUserData.role === 'superadmin') {
      var syncBtn = document.getElementById('btn-sync-firebase');
      if (syncBtn) syncBtn.style.display = 'inline-flex';
    }

    var tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">Cargando...</td></tr>';

    try {
      var snapshot = await db.collection('products').orderBy('title').get();
      allProducts = [];
      snapshot.forEach(function (doc) { allProducts.push({ id: doc.id, ...doc.data() }); });
      populateCategoryFilter(allProducts);
      filterAndRenderInventory();
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
      var img = p.img || (p.gallery && p.gallery[0]) || 'img/logo.png';
      var statusBadge = (p.isActive !== false) ? 
        '<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; margin-left:8px;">Visible</span>' : 
        '<span style="background:#fee2e2; color:#991b1b; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; margin-left:8px;">Oculto</span>';
      
      var eyeIcon = (p.isActive !== false) ? 
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' : 
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';

      html += '<tr>' +
        '<td data-label="Imagen"><img src="' + escapeAttr(img) + '" style="width:48px;height:48px;object-fit:cover;border-radius:10px;" alt="" onerror="this.src=\'img/logo.png\'"></td>' +
        '<td data-label="Nombre"><strong style="color:#0a101d;">' + escapeHtml(p.title || 'Sin nombre') + '</strong>' + statusBadge + '</td>' +
        '<td data-label="Categoría" class="col-hide-mobile">' + escapeHtml(p.category || p.department || '-') + '</td>' +
        '<td data-label="Precio">' + formatPrice(p.price) + '</td>' +
        '<td data-label="Stock" class="col-hide-mobile">' + (p.stock != null ? p.stock : '-') + '</td>' +
        '<td data-label="Acciones">' +
        '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.toggleProductActive(\'' + p.id + '\', ' + (p.isActive !== false) + ')" title="Ocultar/Mostrar">' + eyeIcon + '</button>' +
        '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editProduct(\'' + p.id + '\')" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>' +
        '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteProduct(\'' + p.id + '\')" title="Eliminar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>' +
        '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  function normalizeSearchText(str) {
    return String(str || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\u00f1/g, 'n').replace(/\u00d1/g, 'n')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  function filterAndRenderInventory() {
    var filtered = allProducts;
    
    // 1. Filter by category
    if (currentCategoryFilter !== 'all') {
      filtered = filtered.filter(function (p) {
        var cat = p.category || p.department || '';
        return cat.trim() === currentCategoryFilter;
      });
    }
    
    // 2. Filter by smart search query (all query words must match somewhere)
    var cleanQuery = normalizeSearchText(currentSearchQuery);
    if (cleanQuery) {
      var queryWords = cleanQuery.split(/\s+/).filter(Boolean);
      filtered = filtered.filter(function (p) {
        var title = normalizeSearchText(p.title);
        var brand = normalizeSearchText(p.brand);
        var category = normalizeSearchText(p.category || p.department);
        var desc = normalizeSearchText(p.desc);
        var combinedText = title + ' ' + brand + ' ' + category + ' ' + desc;
        
        return queryWords.every(function (word) {
          return combinedText.includes(word);
        });
      });
    }
    
    renderInventoryTable(filtered);
  }

  function populateCategoryFilter(products) {
    var select = document.getElementById('inventory-category-filter');
    if (!select) return;
    
    var currentVal = select.value;
    var categories = new Set();
    products.forEach(function (p) {
      var cat = p.category || p.department;
      if (cat) categories.add(cat.trim());
    });
    
    var sortedCategories = Array.from(categories).sort();
    var html = '<option value="all">Todas las categorías</option>';
    sortedCategories.forEach(function (cat) {
      html += '<option value="' + escapeAttr(cat) + '">' + escapeHtml(cat) + '</option>';
    });
    
    select.innerHTML = html;
    
    if (sortedCategories.includes(currentVal)) {
      select.value = currentVal;
    } else {
      select.value = 'all';
    }
  }

  function searchInventory(query) {
    currentSearchQuery = query;
    filterAndRenderInventory();
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

  async function syncToFirebase() {
    var backupItems = (typeof window.backupDatabase !== 'undefined' && Array.isArray(window.backupDatabase)) ? window.backupDatabase : [];
    
    // Normalize and retrieve Selektronic products
    var selektronicItems = [];
    if (window.supplierInventory && window.supplierInventory.feeds && window.supplierInventory.feeds.selektronic) {
      var feed = window.supplierInventory.feeds.selektronic;
      for (var i = 0; i < feed.length; i++) {
        var norm = window.supplierInventory.normalizeSupplierProduct('selektronic', feed[i], i);
        if (norm) {
          selektronicItems.push(norm);
        }
      }
    }

    var totalItemsToSync = backupItems.length + selektronicItems.length;
    if (totalItemsToSync === 0) {
      showToast('No se encontraron artículos locales para restaurar.', 'error');
      return;
    }

    if (!confirm('¿Deseas restaurar los ' + totalItemsToSync + ' artículos del inventario anterior? Las computadoras Selektronic y escritorios se configurarán como VISIBLES por defecto, mientras que el resto estará OCULTO. Se conservará el estado actual de los que ya existan en la base de datos.')) {
      return;
    }

    try {
      showToast('Iniciando sincronización...', 'success');
      
      // Load current active status from Firestore to preserve it
      var snapshot = await db.collection('products').get();
      var existingStatus = {};
      snapshot.forEach(function (doc) {
        var data = doc.data();
        if (data && data.isActive !== undefined) {
          existingStatus[doc.id] = data.isActive;
        }
      });

      var batch = db.batch();
      var count = 0;

      // 1. Sync backup items (Excel + Custom desks)
      for (var i = 0; i < backupItems.length; i++) {
        var p = { ...backupItems[i] };
        
        // Preserve active status if it exists in DB, otherwise set default active status
        if (existingStatus[p.id] !== undefined) {
          p.isActive = existingStatus[p.id];
        } else {
          // Desks (mob_oficina_*) are active by default, others hidden
          p.isActive = p.id.startsWith('mob_oficina_');
        }

        var docRef = db.collection('products').doc(p.id);
        batch.set(docRef, p);
        count++;
        if (count === 400) {
          await batch.commit();
          batch = db.batch();
          count = 0;
        }
      }

      // 2. Sync Selektronic items
      for (var j = 0; j < selektronicItems.length; j++) {
        var p = { ...selektronicItems[j] };
        
        // Preserve active status if it exists in DB, otherwise set to true by default
        if (existingStatus[p.id] !== undefined) {
          p.isActive = existingStatus[p.id];
        } else {
          // Selektronic items are active by default
          p.isActive = p.id.startsWith('supplier_selektronic_');
        }

        var docRef = db.collection('products').doc(p.id);
        batch.set(docRef, p);
        count++;
        if (count === 400) {
          await batch.commit();
          batch = db.batch();
          count = 0;
        }
      }

      if (count > 0) {
        await batch.commit();
      }

      showToast('Sincronización de ' + totalItemsToSync + ' artículos completada', 'success');
      loadInventory();
      loadDashboardStats();
    } catch (e) {
      console.error('Sync error:', e);
      showToast('Error en sincronización: ' + e.message, 'error');
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

  async function toggleProductActive(id, currentStatus) {
    try {
      await db.collection('products').doc(id).update({
        isActive: !currentStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showToast(!currentStatus ? 'Producto visible en la tienda' : 'Producto ocultado de la tienda', 'success');
      loadInventory();
      loadDashboardStats();
    } catch (e) {
      showToast('Error al actualizar estado: ' + e.message, 'error');
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
    setVal('product-condition', product.condition || 'Nuevo');
    
    var cb = document.getElementById('product-active');
    if(cb) cb.checked = product.isActive !== false;

    var specsStr = Array.isArray(product.specs) ? product.specs.join('\n') : (product.specs || '');
    setVal('product-specs', specsStr);

    existingGallery = [];
    uploadFiles = [];
    if(product.gallery && product.gallery.length) {
      existingGallery = [...product.gallery];
    } else if (product.img) {
      existingGallery = [product.img];
    }
    renderPreview();

    var modalTitle = document.querySelector('#product-modal .admin-modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Editar producto';
    openModal('product-modal');
  }

  function openNewProduct() {
    document.getElementById('product-form').reset();
    setVal('product-id', '');
    existingGallery = [];
    uploadFiles = [];
    renderPreview();
    
    var cb = document.getElementById('product-active');
    if(cb) cb.checked = true;

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
      productForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = document.getElementById('btn-save-product');
        if(btn) { btn.disabled = true; btn.textContent = 'Subiendo...'; }

        try {
          var specsRaw = getVal('product-specs');
          var specsArr = specsRaw ? specsRaw.split('\n').filter(function(s){return s.trim()!==''}) : [];
          var activeCb = document.getElementById('product-active');

          var finalGallery = [...existingGallery];

          // Upload new files
          for(var i=0; i<uploadFiles.length; i++) {
            var file = uploadFiles[i];
            var ext = file.name.split('.').pop();
            var fileName = 'product_' + Date.now() + '_' + Math.floor(Math.random()*1000) + '.' + ext;
            var ref = storage.ref('products/' + fileName);
            await ref.put(file);
            var url = await ref.getDownloadURL();
            finalGallery.push(url);
          }

          var data = {
            title: getVal('product-title'),
            desc: getVal('product-desc'),
            price: parseFloat(getVal('product-price')) || 0,
            category: getVal('product-category'),
            department: getVal('product-category') ? getVal('product-category').toLowerCase() : 'otros',
            brand: getVal('product-brand'),
            stock: parseInt(getVal('product-stock')) || 0,
            condition: getVal('product-condition'),
            isActive: activeCb ? activeCb.checked : true,
            specs: specsArr,
            gallery: finalGallery,
            img: finalGallery.length > 0 ? finalGallery[0] : ''
          };

          var id = getVal('product-id');
          await saveProduct(data, id || null);
        } catch(err) {
          showToast('Error al subir: ' + err.message, 'error');
        } finally {
          if(btn) { btn.disabled = false; btn.textContent = 'Publicar producto'; }
        }
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
        debounceTimer = setTimeout(function () {
          currentSearchQuery = q;
          filterAndRenderInventory();
        }, 300);
      });
    }

    // Inventory category filter
    var categoryFilter = document.getElementById('inventory-category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', function () {
        currentCategoryFilter = this.value;
        filterAndRenderInventory();
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
    toggleProductActive: toggleProductActive,
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
    searchInventory: searchInventory,
    syncToFirebase: syncToFirebase
  };
})();

// ======= IMAGE UPLOADER LOGIC =======
var uploadFiles = [];
var existingGallery = [];

function initImageUploader() {
  var zone = document.getElementById('image-upload-zone');
  var input = document.getElementById('product-images');
  if(!zone || !input) return;
  zone.addEventListener('click', function() { input.click(); });
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault(); zone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', function(e) { handleFiles(e.target.files); });
}

function handleFiles(files) {
  for (var i=0; i<files.length; i++) {
    uploadFiles.push(files[i]);
  }
  renderPreview();
}

function renderPreview() {
  var container = document.getElementById('image-preview-container');
  if(!container) return;
  container.innerHTML = '';
  existingGallery.forEach(function(url, idx) {
    container.innerHTML += '<div class=\"image-thumb-wrapper\"><img src=\"'+url+'\"><button type=\"button\" class=\"image-thumb-remove\" onclick=\"removeExistingImage('+idx+')\">X</button></div>';
  });
  uploadFiles.forEach(function(file, idx) {
    var objectUrl = URL.createObjectURL(file);
    container.innerHTML += '<div class=\"image-thumb-wrapper\"><img src=\"'+objectUrl+'\"><button type=\"button\" class=\"image-thumb-remove\" onclick=\"removeUploadFile('+idx+')\">X</button></div>';
  });
}

window.removeExistingImage = function(idx) { existingGallery.splice(idx, 1); renderPreview(); };
window.removeUploadFile = function(idx) { uploadFiles.splice(idx, 1); renderPreview(); };

