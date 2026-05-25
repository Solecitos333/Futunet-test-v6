/**
 * Futunet Admin Panel Logic
 * CRUD operations for inventory, users, discounts, orders, config, banners, categories, brands, searches, audit
 */
(function () {
  'use strict';

  var db, storage, currentUserData;
  var currentHistoryUserId = null;
  var currentPageInventory = 1;
  var currentPageUsers = 1;
  var currentPageOrders = 1;
  var currentPageDiscounts = 1;
  var currentPageAudit = 1;
  var itemsPerPage = 20;

  var allOrders = [];
  var currentOrdersSearchQuery = '';
  var currentOrdersStatusFilter = 'all';

  var allDiscounts = [];
  var currentDiscountSearchQuery = '';

  var allAuditLogs = [];
  var currentAuditSearchQuery = '';

  function init() {
    db = window.FutunetFirebase.db;
    storage = window.FutunetFirebase.storage;
    currentUserData = FutunetAuth.getUserData();

    // Auto-setup/seed default categories and brands if empty
    seedDefaultCategoriesAndBrands();

    loadDashboardStats();
    loadInventory();
    loadUsers();
    loadDiscounts();
    loadOrders();
    loadConfig();
    
    // New Loaders
    loadBanners();
    loadCategories();
    loadBrands();
    loadSearchQueries();
    loadAuditLogs();
    loadLayout();

    // Setup logout button listener
    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function () {
        if (await showConfirmModal('Cerrar sesión', '¿Estás seguro de que deseas salir del panel de administración?')) {
          try {
            await window.FutunetFirebase.auth.signOut();
            showToast('Sesión cerrada con éxito', 'success');
            setTimeout(function () { window.location.href = 'login.html'; }, 1000);
          } catch (err) {
            showToast('Error al cerrar sesión: ' + err.message, 'error');
          }
        }
      });
    }

    setupModals();
    initImageUploader();
    initBannerUploader();
    initBrandUploader();

    // Auto-migrate hidden items ONCE without user intervention
    if (currentUserData.role === 'superadmin' && !localStorage.getItem('futunet_auto_migrated_v2')) {
      localStorage.setItem('futunet_auto_migrated_v2', 'true');
      syncToFirebase();
    }
  }

  // ═══════════════════════════════════
  // SEED DEFAULT DATA
  // ═══════════════════════════════════
  async function seedDefaultCategoriesAndBrands() {
    try {
      var catsSnapshot = await db.collection('categories').get();
      if (catsSnapshot.empty) {
        var defaultCats = [
          { name: 'Cámaras de seguridad', icon: 'shield-check' },
          { name: 'Control de accesos', icon: 'key' },
          { name: 'Cerraduras', icon: 'lock' },
          { name: 'Laptops corporativas', icon: 'laptop' },
          { name: 'Computadoras', icon: 'monitor' },
          { name: 'Impresoras y consumibles', icon: 'printer' },
          { name: 'Periféricos y partes', icon: 'mouse' },
          { name: 'Componentes de red wifi', icon: 'wifi' },
          { name: 'Infraestructura de datos', icon: 'server' },
          { name: 'Cristalería y divisiones', icon: 'layout' },
          { name: 'Remozamiento profesional', icon: 'hammer' },
          { name: 'Papelería y suministros', icon: 'paperclip' },
          { name: 'Escritorios', icon: 'table' },
          { name: 'Sillas y sillones', icon: 'armchair' },
          { name: 'Estantes y archivos', icon: 'archive' },
          { name: 'Energía y respaldo', icon: 'battery-charging' },
          { name: 'Servicios', icon: 'briefcase' }
        ];
        var batch = db.batch();
        defaultCats.forEach(function (c) {
          var ref = db.collection('categories').doc();
          batch.set(ref, c);
        });
        await batch.commit();
        console.log('Default categories seeded.');
      }
      
      var brandsSnapshot = await db.collection('brands').get();
      if (brandsSnapshot.empty) {
        var defaultBrands = [
          { name: 'Dell', logo: 'img/marcas/dell.png' },
          { name: 'HP', logo: 'img/marcas/hp.png' },
          { name: 'Hikvision', logo: 'img/marcas/hikvision.png' },
          { name: 'Epson', logo: 'img/marcas/epson.png' },
          { name: 'Intel', logo: 'img/marcas/intel.png' }
        ];
        var batch = db.batch();
        defaultBrands.forEach(function (b) {
          var ref = db.collection('brands').doc();
          batch.set(ref, b);
        });
        await batch.commit();
        console.log('Default brands seeded.');
      }
    } catch (e) {
      console.warn('Seeding error:', e);
    }
  }

  // ═══════════════════════════════════
  // AUDIT LOGS LOGGER
  // ═══════════════════════════════════
  async function writeAuditLog(action, details, metadata) {
    try {
      var logData = {
        action: action,
        details: details,
        userEmail: currentUserData.email || 'Anónimo',
        userId: currentUserData.uid || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (metadata) {
        logData.metadata = metadata;
      }
      await db.collection('audit_logs').add(logData);
      loadAuditLogs();
    } catch (e) {
      console.warn('Error writing audit log:', e);
    }
  }

  // ═══════════════════════════════════
  // DASHBOARD STATS & ALERTS
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

      // Inventory alerts
      var alertsContainer = document.getElementById('dashboard-stock-alerts');
      if (alertsContainer) {
        var html = '';
        products.forEach(function (doc) {
          var p = doc.data();
          if (p.stock != null) {
            var stock = parseInt(p.stock);
            if (stock === 0) {
              html += '<div style="display:flex; justify-content:space-between; align-items:center; background:#fee2e2; border-left:4px solid #ef4444; padding:10px 14px; border-radius:8px; font-size:0.85rem;"><span style="color:#991b1b; font-weight:600;">' + escapeHtml(p.title) + '</span><span style="background:#ef4444; color:white; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">AGOTADO</span></div>';
            } else if (stock <= 5) {
              html += '<div style="display:flex; justify-content:space-between; align-items:center; background:#fef3c7; border-left:4px solid #f59e0b; padding:10px 14px; border-radius:8px; font-size:0.85rem;"><span style="color:#92400e; font-weight:600;">' + escapeHtml(p.title) + '</span><span style="background:#f59e0b; color:white; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">BAJO STOCK (' + stock + ')</span></div>';
            }
          }
        });
        alertsContainer.innerHTML = html || '<div style="color:#10b981; text-align:center; padding:16px; font-weight:500;">✓ Todo el inventario en buen estado</div>';
      }

      // Recent Activity
      var activityContainer = document.getElementById('dashboard-audit-activity');
      if (activityContainer) {
        var logs = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(5).get();
        var html = '';
        logs.forEach(function (doc) {
          var log = doc.data();
          var time = log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString('es-DO', {hour: '2-digit', minute:'2-digit'}) : '';
          var date = log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleDateString('es-DO') : '';
          html += '<div style="background:#f3f7fc; padding:10px 14px; border-radius:8px; font-size:0.82rem; border:1px solid #e5eef8; margin-bottom:8px;">' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600; color:#394c60;">' +
            '<span>' + escapeHtml(log.userEmail) + '</span>' +
            '<span style="font-size:0.75rem; color:#76889e;">' + date + ' ' + time + '</span>' +
            '</div>' +
            '<div style="color:#0a101d;">' + escapeHtml(log.action) + ': <span style="color:#76889e;">' + escapeHtml(log.details) + '</span></div>' +
            '</div>';
        });
        activityContainer.innerHTML = html || '<div style="color:#76889e; text-align:center; padding:16px;">Sin actividad registrada</div>';
      }

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
    tbody.innerHTML = getTableSkeletonHtml(6, 6);

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
    
    var totalItems = filtered.length;
    var startIndex = (currentPageInventory - 1) * itemsPerPage;
    var pagedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

    renderInventoryTable(pagedProducts);

    renderPagination('inventory-pagination', totalItems, itemsPerPage, currentPageInventory, function (newPage) {
      currentPageInventory = newPage;
      filterAndRenderInventory();
    });
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
        var prevSnap = await db.collection('products').doc(productId).get();
        var prevData = prevSnap.exists ? prevSnap.data() : null;
        await db.collection('products').doc(productId).update(data);
        writeAuditLog('Editar Producto', data.title, {
          collection: 'products',
          docId: productId,
          type: 'update',
          previousData: prevData,
          newData: data
        });
        showToast('Producto actualizado', 'success');
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.isActive = true;
        var docRef = await db.collection('products').add(data);
        writeAuditLog('Crear Producto', data.title, {
          collection: 'products',
          docId: docRef.id,
          type: 'create',
          newData: data
        });
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

    if (!(await showConfirmModal('Restaurar Inventario', '¿Deseas restaurar los ' + totalItemsToSync + ' artículos del inventario anterior? Las computadoras Selektronic y escritorios se configurarán como VISIBLES por defecto, mientras que el resto estará OCULTO. Se conservará el estado actual de los que ya existan en la base de datos.'))) {
      return;
    }

    try {
      showToast('Iniciando sincronización...', 'success');
      
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

      for (var i = 0; i < backupItems.length; i++) {
        var p = { ...backupItems[i] };
        
        if (p.id.startsWith('mob_oficina_')) {
          p.isActive = true;
        } else if (existingStatus[p.id] !== undefined) {
          p.isActive = existingStatus[p.id];
        } else {
          p.isActive = false;
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

      for (var j = 0; j < selektronicItems.length; j++) {
        var p = { ...selektronicItems[j] };
        
        if (p.id.startsWith('supplier_selektronic_')) {
          p.isActive = true;
        } else if (existingStatus[p.id] !== undefined) {
          p.isActive = existingStatus[p.id];
        } else {
          p.isActive = true;
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

      writeAuditLog('Restaurar Inventario', 'Sincronizados ' + totalItemsToSync + ' artículos de fallbacks locales');
      showToast('Sincronización de ' + totalItemsToSync + ' artículos completada', 'success');
      loadInventory();
      loadDashboardStats();
    } catch (e) {
      console.error('Sync error:', e);
      showToast('Error en sincronización: ' + e.message, 'error');
    }
  }

  async function deleteProduct(id) {
    if (!(await showConfirmModal('Eliminar producto', '¿Eliminar este producto? Esta acción no se puede deshacer.'))) return;
    try {
      var prevSnap = await db.collection('products').doc(id).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      await db.collection('products').doc(id).delete();
      writeAuditLog('Eliminar Producto', prevData ? prevData.title : id, {
        collection: 'products',
        docId: id,
        type: 'delete',
        previousData: prevData
      });
      showToast('Producto eliminado', 'success');
      loadInventory();
      loadDashboardStats();
    } catch (e) {
      showToast('Error al eliminar: ' + e.message, 'error');
    }
  }

  async function toggleProductActive(id, currentStatus) {
    try {
      var prevSnap = await db.collection('products').doc(id).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      var updatedFields = {
        isActive: !currentStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('products').doc(id).update(updatedFields);
      var p = prevData || {};
      var nextData = { ...p, ...updatedFields };
      writeAuditLog(!currentStatus ? 'Mostrar Producto' : 'Ocultar Producto', p.title || id, {
        collection: 'products',
        docId: id,
        type: 'update',
        previousData: p,
        newData: nextData
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
    setVal('product-brand', product.brand || '');
    setVal('product-stock', product.stock != null ? product.stock : '');
    setVal('product-condition', product.condition || 'Nuevo');
    
    // Auto-select category
    populateProductCategorySelect();
    setVal('product-category', product.category || product.department || '');
    
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
    populateProductCategorySelect();
    renderPreview();
    
    var cb = document.getElementById('product-active');
    if(cb) cb.checked = true;

    var modalTitle = document.querySelector('#product-modal .admin-modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Agregar producto';
    openModal('product-modal');
  }

  // ═══════════════════════════════════
  var allUsers = [];
  var currentUserSearchQuery = '';

  function filterAndRenderUsers() {
    var query = (currentUserSearchQuery || '').toLowerCase().trim();
    var filtered = allUsers;
    if (query) {
      filtered = allUsers.filter(function (u) {
        var name = (u.displayName || '').toLowerCase();
        var email = (u.email || '').toLowerCase();
        var role = (u.role || '').toLowerCase();
        var status = (u.status || '').toLowerCase();
        return name.indexOf(query) !== -1 || email.indexOf(query) !== -1 || role.indexOf(query) !== -1 || status.indexOf(query) !== -1;
      });
    }

    var totalItems = filtered.length;
    var startIndex = (currentPageUsers - 1) * itemsPerPage;
    var pagedUsers = filtered.slice(startIndex, startIndex + itemsPerPage);

    renderUsersTable(pagedUsers);

    renderPagination('users-pagination', totalItems, itemsPerPage, currentPageUsers, function (newPage) {
      currentPageUsers = newPage;
      filterAndRenderUsers();
    });
  }

  async function loadUsers() {
    var tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = getTableSkeletonHtml(5, 5);

    try {
      var snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
      allUsers = [];
      snapshot.forEach(function (doc) { allUsers.push({ id: doc.id, ...doc.data() }); });
      filterAndRenderUsers();
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
      var historyBtn = '';
      if (currentUserData && currentUserData.role === 'superadmin') {
        historyBtn = '<button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.showUserHistory(\'' + u.id + '\')" title="Ver historial" style="margin-left:4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>';
      }
      html += '<tr>' +
        '<td data-label="Nombre"><strong style="color:#0a101d;">' + escapeHtml(u.displayName || 'Sin nombre') + '</strong></td>' +
        '<td data-label="Email">' + escapeHtml(u.email || '') + '</td>' +
        '<td data-label="Rol"><span class="admin-role-badge role-' + (u.role || 'user') + '">' + (u.role || 'user') + '</span></td>' +
        '<td data-label="Estado"><span class="admin-status-badge status-' + (u.status || 'active') + '">' + (u.status || 'active') + '</span></td>' +
        '<td data-label="Acciones">' +
        (canEdit
          ? '<button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editUser(\'' + u.id + '\')" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>' + historyBtn
          : historyBtn || '<span style="font-size:0.75rem;color:#a0b0c4;">—</span>') +
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
      var prevSnap = await db.collection('users').doc(userId).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      var updatedFields = {
        displayName: displayName,
        role: role,
        status: status
      };
      await db.collection('users').doc(userId).update(updatedFields);
      var u = prevData || {};
      var nextData = { ...u, ...updatedFields };
      writeAuditLog('Editar Usuario', (u.email || userId) + ' (Rol: ' + role + ', Estado: ' + status + ')', {
        collection: 'users',
        docId: userId,
        type: 'update',
        previousData: u,
        newData: nextData
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
    tbody.innerHTML = getTableSkeletonHtml(6, 5);

    try {
      var snapshot = await db.collection('discounts').get();
      allDiscounts = [];
      snapshot.forEach(function (doc) {
        allDiscounts.push({ id: doc.id, ...doc.data() });
      });
      filterAndRenderDiscounts();
    } catch (e) {
      console.error('Discounts load error:', e);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar descuentos</td></tr>';
    }
  }

  function filterAndRenderDiscounts() {
    var query = (currentDiscountSearchQuery || '').toLowerCase().trim();
    var filtered = allDiscounts;
    if (query) {
      filtered = allDiscounts.filter(function (d) {
        var code = (d.id || '').toLowerCase();
        var type = (d.type || '').toLowerCase();
        return code.indexOf(query) !== -1 || type.indexOf(query) !== -1;
      });
    }

    var totalItems = filtered.length;
    var startIndex = (currentPageDiscounts - 1) * itemsPerPage;
    var pagedDiscounts = filtered.slice(startIndex, startIndex + itemsPerPage);

    renderDiscountsTable(pagedDiscounts);

    renderPagination('discounts-pagination', totalItems, itemsPerPage, currentPageDiscounts, function (newPage) {
      currentPageDiscounts = newPage;
      filterAndRenderDiscounts();
    });
  }

  function renderDiscountsTable(discounts) {
    var tbody = document.getElementById('discounts-table-body');
    if (!tbody) return;

    if (discounts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No hay códigos de descuento que coincidan.</td></tr>';
      return;
    }

    var html = '';
    discounts.forEach(function (d) {
      var typeLabel = d.type === 'percent' ? d.value + '%' : 'RD$' + d.value;
      var statusClass = d.isActive ? 'status-active' : 'status-disabled';
      var statusLabel = d.isActive ? 'Activo' : 'Inactivo';

      html += '<tr>' +
        '<td data-label="Código"><strong style="color:#0a101d;font-family:monospace;">' + escapeHtml(d.id) + '</strong></td>' +
        '<td data-label="Tipo">' + (d.type === 'percent' ? 'Porcentaje' : 'Monto fijo') + '</td>' +
        '<td data-label="Valor">' + typeLabel + '</td>' +
        '<td data-label="Uso">' + (d.usageCount || 0) + '/' + (d.maxUses || '∞') + '</td>' +
        '<td data-label="Estado"><span class="admin-status-badge ' + statusClass + '">' + statusLabel + '</span></td>' +
        '<td data-label="Acciones">' +
        '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.toggleDiscount(\'' + d.id + '\', ' + !d.isActive + ')" title="' + (d.isActive ? 'Desactivar' : 'Activar') + '">' + (d.isActive ? '⏸' : '▶') + '</button>' +
        '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteDiscount(\'' + d.id + '\')" title="Eliminar">✕</button>' +
        '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
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

    var typeLabel = type === 'percent' ? value + '%' : 'RD$' + value;

    try {
      var prevSnap = await db.collection('discounts').doc(code).get();
      var isUpdate = prevSnap.exists;
      var prevData = isUpdate ? prevSnap.data() : null;

      var data = {
        type: type,
        value: value,
        minPurchase: minPurchase,
        maxUses: maxUses,
        usageCount: isUpdate ? (prevData.usageCount || 0) : 0,
        expiresAt: expiry ? firebase.firestore.Timestamp.fromDate(new Date(expiry)) : null,
        isActive: isUpdate ? (prevData.isActive !== false) : true,
        createdAt: isUpdate ? (prevData.createdAt || firebase.firestore.FieldValue.serverTimestamp()) : firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('discounts').doc(code).set(data);
      writeAuditLog(
        isUpdate ? 'Editar Descuento' : 'Crear Descuento',
        code + ' (' + typeLabel + ')',
        {
          collection: 'discounts',
          docId: code,
          type: isUpdate ? 'update' : 'create',
          previousData: prevData,
          newData: data
        }
      );
      showToast(isUpdate ? 'Código de descuento actualizado' : 'Código de descuento creado', 'success');
      closeModal('discount-modal');
      loadDiscounts();
      loadDashboardStats();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  async function toggleDiscount(code, newState) {
    try {
      var prevSnap = await db.collection('discounts').doc(code).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      var updatedFields = { isActive: newState };
      await db.collection('discounts').doc(code).update(updatedFields);
      var nextData = prevData ? { ...prevData, ...updatedFields } : null;
      writeAuditLog(newState ? 'Activar Descuento' : 'Desactivar Descuento', code, {
        collection: 'discounts',
        docId: code,
        type: 'update',
        previousData: prevData,
        newData: nextData
      });
      showToast(newState ? 'Descuento activado' : 'Descuento desactivado', 'success');
      loadDiscounts();
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  }

  async function deleteDiscount(code) {
    if (!(await showConfirmModal('Eliminar descuento', '¿Estás seguro de que deseas eliminar el código de descuento "' + code + '"?'))) return;
    try {
      var prevSnap = await db.collection('discounts').doc(code).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      await db.collection('discounts').doc(code).delete();
      writeAuditLog('Eliminar Descuento', code, {
        collection: 'discounts',
        docId: code,
        type: 'delete',
        previousData: prevData
      });
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
    tbody.innerHTML = getTableSkeletonHtml(6, 5);

    try {
      var snapshot = await db.collection('orders').orderBy('createdAt', 'desc').limit(1000).get();
      allOrders = [];
      snapshot.forEach(function (doc) {
        allOrders.push({ id: doc.id, ...doc.data() });
      });
      filterAndRenderOrders();
    } catch (e) {
      console.error('Orders load error:', e);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar pedidos</td></tr>';
    }
  }

  function filterAndRenderOrders() {
    var query = (currentOrdersSearchQuery || '').toLowerCase().trim();
    var statusFilter = currentOrdersStatusFilter || 'all';

    var filtered = allOrders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(function (o) {
        return o.status === statusFilter;
      });
    }

    if (query) {
      filtered = filtered.filter(function (o) {
        var id = (o.id || '').toLowerCase();
        var clientName = (o.userName || '').toLowerCase();
        return id.indexOf(query) !== -1 || clientName.indexOf(query) !== -1;
      });
    }

    var totalItems = filtered.length;
    var startIndex = (currentPageOrders - 1) * itemsPerPage;
    var pagedOrders = filtered.slice(startIndex, startIndex + itemsPerPage);

    renderOrdersTable(pagedOrders);

    renderPagination('orders-pagination', totalItems, itemsPerPage, currentPageOrders, function (newPage) {
      currentPageOrders = newPage;
      filterAndRenderOrders();
    });
  }

  function renderOrdersTable(orders) {
    var tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No hay pedidos que coincidan.</td></tr>';
      return;
    }

    var html = '';
    orders.forEach(function (o) {
      var date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('es-DO') : '—';
      var statusMap = { pending: 'Pendiente', processing: 'Procesando', shipped: 'Enviado', delivered: 'Entregado' };
      var statusLabel = statusMap[o.status] || o.status || 'Pendiente';

      html += '<tr>' +
        '<td data-label="ID" style="font-family:monospace;font-size:0.78rem;">' + o.id.substring(0, 8) + '...</td>' +
        '<td data-label="Cliente">' + escapeHtml(o.userName || '—') + '</td>' +
        '<td data-label="Total"><strong>' + formatPrice(o.total) + '</strong></td>' +
        '<td data-label="Estado"><span class="admin-role-badge role-' + (o.status === 'delivered' ? 'editor' : o.status === 'processing' ? 'admin' : 'user') + '">' + statusLabel + '</span></td>' +
        '<td data-label="Fecha" class="col-hide-mobile">' + date + '</td>' +
        '<td data-label="Acciones">' +
        '  <select onchange="AdminPanel.updateOrderStatus(\'' + o.id + '\', this.value)" style="padding:4px 8px;border:1px solid #e5eef8;border-radius:8px;font-size:0.78rem;font-family:Outfit;">' +
        '    <option value="pending"' + (o.status === 'pending' ? ' selected' : '') + '>Pendiente</option>' +
        '    <option value="processing"' + (o.status === 'processing' ? ' selected' : '') + '>Procesando</option>' +
        '    <option value="shipped"' + (o.status === 'shipped' ? ' selected' : '') + '>Enviado</option>' +
        '    <option value="delivered"' + (o.status === 'delivered' ? ' selected' : '') + '>Entregado</option>' +
        '  </select>' +
        '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.showOrderDetail(\'' + o.id + '\')" title="Ver detalles" style="margin-left:4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>' +
        '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      var prevSnap = await db.collection('orders').doc(orderId).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      var updatedFields = {
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('orders').doc(orderId).update(updatedFields);
      var nextData = prevData ? { ...prevData, ...updatedFields } : null;
      writeAuditLog('Cambiar Estado de Pedido', orderId.substring(0, 8) + ' → ' + newStatus, {
        collection: 'orders',
        docId: orderId,
        type: 'update',
        previousData: prevData,
        newData: nextData
      });
      showToast('Estado actualizado', 'success');
    } catch (e) { showToast('Error: ' + e.message, 'error'); }
  }

  async function showOrderDetail(orderId) {
    try {
      var doc = await db.collection('orders').doc(orderId).get();
      if (!doc.exists) return;
      var o = doc.data();
      
      var itemsHtml = '';
      var subtotal = 0;
      var items = o.items || [];
      
      items.forEach(function (item) {
        var price = parseFloat(item.price) || 0;
        var qty = parseInt(item.qty) || 1;
        var totalItem = price * qty;
        subtotal += totalItem;
        
        var img = item.img || 'img/logo.png';
        itemsHtml += '<div style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #e5eef8;">' +
          '<img src="' + escapeAttr(img) + '" style="width:40px; height:40px; object-fit:cover; border-radius:6px;" onerror="this.src=\'img/logo.png\'">' +
          '<div style="flex-grow:1;">' +
          '<div style="font-weight:600; color:#0a101d; font-size:0.88rem;">' + escapeHtml(item.title) + '</div>' +
          '<div style="font-size:0.78rem; color:#76889e;">' + formatPrice(price) + ' x ' + qty + '</div>' +
          '</div>' +
          '<div style="font-weight:600; color:#0a101d; font-size:0.88rem;">' + formatPrice(totalItem) + '</div>' +
          '</div>';
      });
      
      var discountLabel = '—';
      var discountVal = 0;
      if (o.discount) {
        discountVal = parseFloat(o.discount.amount) || 0;
        discountLabel = escapeHtml(o.discount.code) + ' (-' + formatPrice(discountVal) + ')';
      }
      
      var phone = o.userPhone || '';
      var cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone && !cleanPhone.startsWith('1') && cleanPhone.length === 10) {
        cleanPhone = '1' + cleanPhone;
      }
      
      var whatsappText = '*FUTUNET - Factura / Detalle de Pedido*\n' +
        '--------------------------------------------\n' +
        '*Pedido ID:* ' + orderId.substring(0, 8) + '\n' +
        '*Cliente:* ' + (o.userName || '—') + '\n' +
        '*Email:* ' + (o.userEmail || '—') + '\n' +
        '*Teléfono:* ' + (o.userPhone || '—') + '\n' +
        '*Dirección:* ' + (o.shippingAddress || '—') + '\n' +
        '--------------------------------------------\n' +
        '*Artículos:*\n';
      
      items.forEach(function(item) {
        var price = parseFloat(item.price) || 0;
        var qty = parseInt(item.qty) || 1;
        whatsappText += '- ' + item.title + ' (' + qty + 'x ' + formatPrice(price) + ')\n';
      });
      
      whatsappText += '--------------------------------------------\n' +
        '*Subtotal:* ' + formatPrice(subtotal) + '\n';
      if (discountVal > 0) {
        whatsappText += '*Descuento:* -' + formatPrice(discountVal) + ' (' + o.discount.code + ')\n';
      }
      whatsappText += '*Total General:* ' + formatPrice(o.total) + '\n\n' +
        '¡Gracias por preferirnos! Su pedido está siendo procesado.';
        
      var waUrl = 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(whatsappText);
      
      var contentHtml = '<div style="font-family:Outfit, sans-serif;">' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; background:#f3f7fc; padding:16px; border-radius:12px; border:1px solid #e5eef8;">' +
        '<div>' +
        '<div style="font-size:0.75rem; color:#76889e; text-transform:uppercase; font-weight:700;">Información del Cliente</div>' +
        '<div style="font-weight:700; color:#0a101d; margin-top:4px; font-size:1rem;">' + escapeHtml(o.userName || '—') + '</div>' +
        '<div style="font-size:0.85rem; color:#394c60; margin-top:2px;">Email: ' + escapeHtml(o.userEmail || '—') + '</div>' +
        '<div style="font-size:0.85rem; color:#394c60; margin-top:2px;">Teléfono: ' + escapeHtml(o.userPhone || '—') + '</div>' +
        '</div>' +
        '<div>' +
        '<div style="font-size:0.75rem; color:#76889e; text-transform:uppercase; font-weight:700;">Detalles del Envío</div>' +
        '<div style="font-size:0.85rem; color:#394c60; margin-top:4px;">Dirección: ' + escapeHtml(o.shippingAddress || '—') + '</div>' +
        '<div style="font-size:0.85rem; color:#394c60; margin-top:2px;">Notas: ' + escapeHtml(o.shippingNotes || '—') + '</div>' +
        '</div>' +
        '</div>' +
        
        '<div style="margin-bottom:20px;">' +
        '<div style="font-size:0.75rem; color:#76889e; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Artículos Comprados</div>' +
        itemsHtml +
        '</div>' +
        
        '<div style="background:#f9fafc; padding:16px; border-radius:12px; border:1px solid #e5eef8; margin-bottom:20px;">' +
        '<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.88rem; color:#394c60;"><span>Subtotal:</span><span>' + formatPrice(subtotal) + '</span></div>' +
        '<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.88rem; color:#394c60;"><span>Código de Descuento:</span><span>' + discountLabel + '</span></div>' +
        '<div style="display:flex; justify-content:space-between; font-weight:700; color:#0a101d; font-size:1.05rem; padding-top:8px; border-top:1px dashed #e5eef8;"><span>Total General:</span><span>' + formatPrice(o.total) + '</span></div>' +
        '</div>' +
        
        '<div style="display:flex; gap:12px; justify-content:flex-end;">' +
        '<button class="admin-btn admin-btn-ghost" data-close-modal onclick="AdminPanel.closeModal(\'order-detail-modal\')">Cerrar</button>' +
        (cleanPhone ? '<a href="' + waUrl + '" target="_blank" class="admin-btn admin-btn-primary" style="display:inline-flex; align-items:center; gap:6px; background-color:#25d366; border-color:#25d366;"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.501-5.734-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.851-4.388 9.854-9.782.002-2.613-1.013-5.07-2.861-6.92C16.371 2.05 13.915.825 12.009.825 6.613.825 2.225 5.216 2.221 10.61c0 1.54.437 3.047 1.266 4.386L2.52 19.3l4.127-1.08c1.6.953 3.19 1.45 4.62 1.451z"/></svg>Enviar WhatsApp</a>' : '') +
        '</div>' +
        '</div>';
        
      var el = document.getElementById('order-detail-content');
      if (el) el.innerHTML = contentHtml;
      openModal('order-detail-modal');
    } catch (e) {
      showToast('Error al ver pedido: ' + e.message, 'error');
    }
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
        setVal('config-advisor', data.advisorName || 'Orbis Espinal');
        setVal('config-address', data.address || 'Santiago, República Dominicana');
        setVal('config-map-url', data.mapUrl || '');
        setVal('config-instagram', data.instagramUrl || '');
        setVal('config-facebook', data.facebookUrl || '');
        setVal('config-maintenance-msg', data.maintenanceMessage || '');
        
        var maint = document.getElementById('config-maintenance');
        if (maint) maint.checked = data.maintenanceMode || false;
      }
    } catch (e) { console.warn('Config load error:', e); }
  }

  async function saveConfig(e) {
    if (e) e.preventDefault();
    var whatsapp = getVal('config-whatsapp');
    var siteName = getVal('config-sitename');
    var advisor = getVal('config-advisor');
    var address = getVal('config-address');
    var mapUrl = getVal('config-map-url');
    var instagram = getVal('config-instagram');
    var facebook = getVal('config-facebook');
    var maintMsg = getVal('config-maintenance-msg');
    
    var maint = document.getElementById('config-maintenance');
    var maintenanceMode = maint ? maint.checked : false;

    try {
      var prevSnap = await db.collection('config').doc('site').get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;

      var data = {
        whatsappNumber: whatsapp,
        siteName: siteName,
        advisorName: advisor,
        address: address,
        mapUrl: mapUrl,
        instagramUrl: instagram,
        facebookUrl: facebook,
        maintenanceMessage: maintMsg,
        maintenanceMode: maintenanceMode,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('config').doc('site').set(data, { merge: true });
      writeAuditLog('Actualizar Configuración', 'Se modificaron los ajustes del sitio', {
        collection: 'config',
        docId: 'site',
        type: 'update',
        previousData: prevData,
        newData: data
      });
      showToast('Configuración guardada', 'success');
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  // ═══════════════════════════════════
  // VISUAL EDITOR / LAYOUT
  // ═══════════════════════════════════
  var layoutSections = [];

  async function loadLayout() {
    try {
      var doc = await db.collection('config').doc('layout').get();
      if (doc.exists) {
        var data = doc.data();
        if (data.sections && Array.isArray(data.sections)) {
          layoutSections = data.sections;
        } else {
          layoutSections = getDefaultLayout();
        }
      } else {
        layoutSections = getDefaultLayout();
      }
    } catch (e) {
      console.warn('Failed to load layout, using defaults:', e);
      layoutSections = getDefaultLayout();
    }
    renderLayoutControls();
    updateLivePreview();
  }

  function getDefaultLayout() {
    return [
      { id: 'inicio', name: 'Banner Rotativo', visible: true, title: 'La tecnología del<br><span class="hero-title-accent">futuro</span>', subtitle: '' },
      { id: 'productos-categoria', name: 'Productos por Categoría', visible: true, title: 'Productos por categoría', subtitle: 'Explora nuestro catálogo organizado por departamento y encuentra lo que necesitas.' },
      { id: 'destacados-catalogo', name: 'Artículos Destacados', visible: true, title: 'Artículos destacados del catálogo', subtitle: 'Descubre productos listos para cotizar y entra directo al detalle que más se parezca a lo que estás buscando.' },
      { id: 'servicios', name: 'Nuestros Servicios / Soluciones', visible: true, title: 'Soluciones para vender, operar y proteger mejor', subtitle: 'Explora las áreas en las que acompañamos a empresas, instituciones y hogares con equipos, instalación y soporte.' },
      { id: 'equipa-oficina', name: 'Equipa tu Oficina', visible: true, title: 'Equipa tu oficina', subtitle: 'Encuentra desde computadoras hasta mobiliario. Todo para que tu espacio de trabajo funcione al máximo.' },
      { id: 'marcas', name: 'Logos de Marcas', visible: true, title: 'Marcas con las que trabajamos', subtitle: 'Pasa el cursor sobre una marca para descubrir sus productos destacados.' },
      { id: 'nosotros', name: 'Quiénes Somos', visible: true, title: 'Tecnología con criterio, servicio con respaldo', subtitle: '' },
      { id: 'proyecto-cta', name: 'Llamado a la Acción (Proyecto)', visible: true, title: '¿Tienes un proyecto en mente?', subtitle: 'Cuéntanos lo que necesitas y te ayudamos a aterrizar una solución realista, clara y lista para cotizar.' },
      { id: 'contacto', name: 'Contacto / Mensaje', visible: true, title: 'Conversemos sobre lo que necesitas', subtitle: 'Escríbenos y recibe una orientación clara para tu compra, tu instalación o tu próximo proyecto.' }
    ];
  }

  function renderLayoutControls() {
    var container = document.getElementById('visual-editor-controls');
    if (!container) return;
    container.innerHTML = '';

    layoutSections.forEach(function (sec, idx) {
      var item = document.createElement('div');
      item.className = 'visual-editor-item';
      item.style.cssText = 'border: 1px solid #e5eef8; border-radius: 12px; padding: 16px; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 12px;';
      
      var isFirst = idx === 0;
      var isLast = idx === layoutSections.length - 1;
      
      var html = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 700; color: #0a101d; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem;">${sec.name}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.moveSectionUp('${sec.id}')" style="padding: 4px 8px;" title="Subir" ${isFirst ? 'disabled style="opacity:0.4; pointer-events:none;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.moveSectionDown('${sec.id}')" style="padding: 4px 8px;" title="Bajar" ${isLast ? 'disabled style="opacity:0.4; pointer-events:none;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <label class="admin-switch">
              <input type="checkbox" ${sec.visible ? 'checked' : ''} onchange="AdminPanel.toggleSectionVisibility('${sec.id}', this.checked)">
              <span class="admin-slider"></span>
            </label>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px; ${sec.visible ? '' : 'display: none;'}">
          <div>
            <label style="font-size: 0.72rem; color: #76889e; font-weight: 600; text-transform: uppercase;">Título</label>
            <input type="text" value="${escapeAttr(sec.title)}" oninput="AdminPanel.updateSectionTitle('${sec.id}', this.value)" style="width: 100%; padding: 6px 10px; border: 1px solid #e5eef8; border-radius: 8px; font-family: Outfit; font-size: 0.85rem; box-sizing: border-box;">
          </div>
          ${sec.id !== 'inicio' && sec.id !== 'nosotros' ? `
          <div>
            <label style="font-size: 0.72rem; color: #76889e; font-weight: 600; text-transform: uppercase;">Subtítulo</label>
            <textarea rows="2" oninput="AdminPanel.updateSectionSubtitle('${sec.id}', this.value)" style="width: 100%; padding: 6px 10px; border: 1px solid #e5eef8; border-radius: 8px; font-family: Outfit; font-size: 0.85rem; resize: vertical; box-sizing: border-box;">${sec.subtitle || ''}</textarea>
          </div>
          ` : ''}
        </div>
      `;
      item.innerHTML = html;
      container.appendChild(item);
    });
  }

  function updateLivePreview() {
    var iframe = document.getElementById('visual-preview-iframe');
    if (!iframe) return;
    try {
      if (iframe.contentWindow && iframe.contentWindow.FutunetLayout) {
        iframe.contentWindow.FutunetLayout.applyLiveChanges(layoutSections);
      } else {
        iframe.onload = function() {
          if (iframe.contentWindow && iframe.contentWindow.FutunetLayout) {
            iframe.contentWindow.FutunetLayout.applyLiveChanges(layoutSections);
          }
        };
      }
    } catch(e) {
      console.warn('Cannot push live preview changes directly:', e);
    }
  }

  async function saveLayoutConfig() {
    try {
      var prevSnap = await db.collection('config').doc('layout').get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;

      var data = {
        sections: layoutSections,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('config').doc('layout').set(data);
      writeAuditLog('Actualizar Portada', 'Se modificó el diseño y reordenamiento de secciones de la portada', {
        collection: 'config',
        docId: 'layout',
        type: 'update',
        previousData: prevData,
        newData: data
      });
      showToast('Diseño de portada guardado exitosamente', 'success');
      updateLivePreview();
    } catch (e) {
      showToast('Error al guardar: ' + e.message, 'error');
    }
  }

  async function resetDefaultLayout() {
    if (await showConfirmModal('Restaurar diseño de portada', '¿Está seguro de que desea restaurar el diseño original de la portada? Esto restablecerá el orden, visibilidad y títulos de fábrica.')) {
      layoutSections = getDefaultLayout();
      renderLayoutControls();
      updateLivePreview();
      showToast('Valores restaurados (debe hacer clic en "Guardar Cambios" para aplicarlos)', 'info');
    }
  }

  function moveSectionUp(id) {
    var idx = layoutSections.findIndex(function(s) { return s.id === id; });
    if (idx > 0) {
      var temp = layoutSections[idx];
      layoutSections[idx] = layoutSections[idx - 1];
      layoutSections[idx - 1] = temp;
      renderLayoutControls();
      updateLivePreview();
    }
  }

  function moveSectionDown(id) {
    var idx = layoutSections.findIndex(function(s) { return s.id === id; });
    if (idx >= 0 && idx < layoutSections.length - 1) {
      var temp = layoutSections[idx];
      layoutSections[idx] = layoutSections[idx + 1];
      layoutSections[idx + 1] = temp;
      renderLayoutControls();
      updateLivePreview();
    }
  }

  function toggleSectionVisibility(id, visible) {
    var sec = layoutSections.find(function(s) { return s.id === id; });
    if (sec) {
      sec.visible = visible;
      renderLayoutControls();
      updateLivePreview();
    }
  }

  function updateSectionTitle(id, title) {
    var sec = layoutSections.find(function(s) { return s.id === id; });
    if (sec) {
      sec.title = title;
      updateLivePreview();
    }
  }

  function updateSectionSubtitle(id, subtitle) {
    var sec = layoutSections.find(function(s) { return s.id === id; });
    if (sec) {
      sec.subtitle = subtitle;
      updateLivePreview();
    }
  }

  // ═══════════════════════════════════
  // BANNERS CRUD
  // ═══════════════════════════════════
  var allBanners = [];
  async function loadBanners() {
    var tbody = document.getElementById('banners-table-body');
    if (!tbody) return;
    tbody.innerHTML = getTableSkeletonHtml(6, 4);
    try {
      var snapshot = await db.collection('banners').orderBy('order').get();
      allBanners = [];
      var html = '';
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#76889e;">No hay banners promocionales creados.</td></tr>';
        return;
      }
      snapshot.forEach(function (doc) {
        var b = doc.data();
        allBanners.push({ id: doc.id, ...b });
        var img = b.image || 'img/logo.png';
        var statusBadge = (b.isActive !== false) ? 
          '<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Activo</span>' : 
          '<span style="background:#fee2e2; color:#991b1b; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600;">Inactivo</span>';

        html += '<tr>' +
          '<td data-label="Imagen"><img src="' + escapeAttr(img) + '" style="width:120px;height:48px;object-fit:cover;border-radius:6px;"></td>' +
          '<td data-label="Título"><strong style="color:#0a101d;">' + escapeHtml(b.title) + '</strong> ' + statusBadge + '</td>' +
          '<td data-label="Subtítulo">' + escapeHtml(b.subtitle || '—') + '</td>' +
          '<td data-label="Enlace">' + escapeHtml(b.link || '—') + '</td>' +
          '<td data-label="Orden">' + (b.order || 1) + '</td>' +
          '<td data-label="Acciones">' +
          '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editBanner(\'' + doc.id + '\')">Editar</button>' +
          '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteBanner(\'' + doc.id + '\')">Eliminar</button>' +
          '</td>' +
          '</tr>';
      });
      tbody.innerHTML = html;
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar banners</td></tr>';
    }
  }

  function openNewBanner() {
    document.getElementById('banner-form').reset();
    setVal('banner-id', '');
    bannerUploadFile = null;
    renderBannerPreview();
    var cb = document.getElementById('banner-active');
    if (cb) cb.checked = true;
    openModal('banner-modal');
  }

  function editBanner(id) {
    var banner = allBanners.find(function (b) { return b.id === id; });
    if (!banner) return;
    setVal('banner-id', banner.id);
    setVal('banner-title', banner.title);
    setVal('banner-subtitle', banner.subtitle || '');
    setVal('banner-link', banner.link || '');
    setVal('banner-order', banner.order || 1);
    
    var cb = document.getElementById('banner-active');
    if (cb) cb.checked = banner.isActive !== false;
    
    bannerUploadFile = banner.image || null;
    renderBannerPreview();
    openModal('banner-modal');
  }

  async function saveBanner(e) {
    if (e) e.preventDefault();
    var id = getVal('banner-id');
    var title = getVal('banner-title').trim();
    var subtitle = getVal('banner-subtitle').trim();
    var link = getVal('banner-link').trim();
    var order = parseInt(getVal('banner-order')) || 1;
    var cb = document.getElementById('banner-active');
    var isActive = cb ? cb.checked : true;
    
    if (!title) return;
    
    var btn = document.getElementById('btn-save-banner');
    if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
    
    try {
      var imageUrl = '';
      if (bannerUploadFile) {
        if (typeof bannerUploadFile === 'string') {
          imageUrl = bannerUploadFile;
        } else {
          var ext = bannerUploadFile.name.split('.').pop();
          var fileName = 'banner_' + Date.now() + '.' + ext;
          var ref = storage.ref('banners/' + fileName);
          await ref.put(bannerUploadFile);
          imageUrl = await ref.getDownloadURL();
        }
      }
      
      var data = {
        title: title,
        subtitle: subtitle,
        link: link,
        order: order,
        image: imageUrl,
        isActive: isActive
      };
      
      if (id) {
        var prevSnap = await db.collection('banners').doc(id).get();
        var prevData = prevSnap.exists ? prevSnap.data() : null;
        await db.collection('banners').doc(id).update(data);
        writeAuditLog('Editar Banner', title, {
          collection: 'banners',
          docId: id,
          type: 'update',
          previousData: prevData,
          newData: data
        });
        showToast('Banner actualizado', 'success');
      } else {
        var docRef = await db.collection('banners').add(data);
        writeAuditLog('Crear Banner', title, {
          collection: 'banners',
          docId: docRef.id,
          type: 'create',
          newData: data
        });
        showToast('Banner creado', 'success');
      }
      closeModal('banner-modal');
      loadBanners();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Guardar Banner'; }
    }
  }

  async function deleteBanner(id) {
    var banner = allBanners.find(function (b) { return b.id === id; });
    if (!banner) return;
    if (!(await showConfirmModal('Eliminar banner', '¿Eliminar el banner "' + banner.title + '"?'))) return;
    try {
      var prevSnap = await db.collection('banners').doc(id).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      await db.collection('banners').doc(id).delete();
      writeAuditLog('Eliminar Banner', banner.title, {
        collection: 'banners',
        docId: id,
        type: 'delete',
        previousData: prevData
      });
      showToast('Banner eliminado', 'success');
      loadBanners();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  function removeBannerImage() {
    bannerUploadFile = null;
    renderBannerPreview();
  }

  // ═══════════════════════════════════
  // CATEGORIES & BRANDS CRUD
  // ═══════════════════════════════════
  var currentCatBrandsTab = 'categories';
  function switchCatBrandsTab(tab) {
    currentCatBrandsTab = tab;
    var btnCats = document.getElementById('btn-tab-categories');
    var btnBrands = document.getElementById('btn-tab-brands');
    var contentCats = document.getElementById('tab-content-categories');
    var contentBrands = document.getElementById('tab-content-brands');
    
    if (tab === 'categories') {
      btnCats.className = 'admin-btn admin-btn-primary';
      btnBrands.className = 'admin-btn admin-btn-ghost';
      contentCats.style.display = 'block';
      contentBrands.style.display = 'none';
    } else {
      btnCats.className = 'admin-btn admin-btn-ghost';
      btnBrands.className = 'admin-btn admin-btn-primary';
      contentCats.style.display = 'none';
      contentBrands.style.display = 'block';
    }
  }

  // Categories management
  var allCategories = [];
  async function loadCategories() {
    var tbody = document.getElementById('categories-table-body');
    if (!tbody) return;
    tbody.innerHTML = getTableSkeletonHtml(3, 4);
    try {
      var snapshot = await db.collection('categories').orderBy('name').get();
      allCategories = [];
      var html = '';
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:#76889e;">No hay categorías.</td></tr>';
        return;
      }
      snapshot.forEach(function (doc) {
        var c = doc.data();
        allCategories.push({ id: doc.id, ...c });
        html += '<tr>' +
          '<td data-label="Nombre"><strong style="color:#0a101d;">' + escapeHtml(c.name) + '</strong></td>' +
          '<td data-label="Icono / Lucide">' + escapeHtml(c.icon || '—') + '</td>' +
          '<td data-label="Acciones">' +
          '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editCategory(\'' + doc.id + '\')">Editar</button>' +
          '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteCategory(\'' + doc.id + '\')">Eliminar</button>' +
          '</td>' +
          '</tr>';
      });
      tbody.innerHTML = html;
      populateProductCategorySelect();
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar categorías</td></tr>';
    }
  }

  function populateProductCategorySelect() {
    var select = document.getElementById('product-category');
    if (!select) return;
    var html = '<option value="">Selecciona categoría</option>';
    allCategories.forEach(function (c) {
      html += '<option value="' + escapeAttr(c.name) + '">' + escapeHtml(c.name) + '</option>';
    });
    select.innerHTML = html;
  }

  function openNewCategory() {
    document.getElementById('category-form').reset();
    setVal('category-id', '');
    openModal('category-modal');
  }

  function editCategory(id) {
    var cat = allCategories.find(function (c) { return c.id === id; });
    if (!cat) return;
    setVal('category-id', cat.id);
    setVal('category-name', cat.name);
    setVal('category-icon', cat.icon || '');
    openModal('category-modal');
  }

  async function saveCategory(e) {
    if (e) e.preventDefault();
    var id = getVal('category-id');
    var name = getVal('category-name').trim();
    var icon = getVal('category-icon').trim();
    if (!name) return;
    
    try {
      var data = { name: name, icon: icon };
      if (id) {
        var prevSnap = await db.collection('categories').doc(id).get();
        var prevData = prevSnap.exists ? prevSnap.data() : null;
        await db.collection('categories').doc(id).update(data);
        writeAuditLog('Editar Categoría', name, {
          collection: 'categories',
          docId: id,
          type: 'update',
          previousData: prevData,
          newData: data
        });
        showToast('Categoría actualizada', 'success');
      } else {
        var docRef = await db.collection('categories').add(data);
        writeAuditLog('Crear Categoría', name, {
          collection: 'categories',
          docId: docRef.id,
          type: 'create',
          newData: data
        });
        showToast('Categoría creada', 'success');
      }
      closeModal('category-modal');
      loadCategories();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  async function deleteCategory(id) {
    var cat = allCategories.find(function (c) { return c.id === id; });
    if (!cat) return;
    if (!(await showConfirmModal('Eliminar categoría', '¿Eliminar la categoría "' + cat.name + '"?'))) return;
    try {
      var prevSnap = await db.collection('categories').doc(id).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      await db.collection('categories').doc(id).delete();
      writeAuditLog('Eliminar Categoría', cat.name, {
        collection: 'categories',
        docId: id,
        type: 'delete',
        previousData: prevData
      });
      showToast('Categoría eliminada', 'success');
      loadCategories();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  // Brands management
  var allBrands = [];
  async function loadBrands() {
    var tbody = document.getElementById('brands-table-body');
    if (!tbody) return;
    tbody.innerHTML = getTableSkeletonHtml(3, 4);
    try {
      var snapshot = await db.collection('brands').orderBy('name').get();
      allBrands = [];
      var html = '';
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:#76889e;">No hay marcas.</td></tr>';
        return;
      }
      snapshot.forEach(function (doc) {
        var b = doc.data();
        allBrands.push({ id: doc.id, ...b });
        var logo = b.logo || 'img/logo.png';
        html += '<tr>' +
          '<td data-label="Logo"><img src="' + escapeAttr(logo) + '" style="width:48px;height:48px;object-fit:contain;background:#f8f9fa;padding:4px;border-radius:8px;"></td>' +
          '<td data-label="Nombre"><strong style="color:#0a101d;">' + escapeHtml(b.name) + '</strong></td>' +
          '<td data-label="Acciones">' +
          '  <button class="admin-btn admin-btn-ghost admin-btn-sm" onclick="AdminPanel.editBrand(\'' + doc.id + '\')">Editar</button>' +
          '  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="AdminPanel.deleteBrand(\'' + doc.id + '\')">Eliminar</button>' +
          '</td>' +
          '</tr>';
      });
      tbody.innerHTML = html;
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar marcas</td></tr>';
    }
  }

  function openNewBrand() {
    document.getElementById('brand-form').reset();
    setVal('brand-id', '');
    brandUploadFile = null;
    renderBrandPreview();
    openModal('brand-modal');
  }

  function editBrand(id) {
    var brand = allBrands.find(function (b) { return b.id === id; });
    if (!brand) return;
    setVal('brand-id', brand.id);
    setVal('brand-name', brand.name);
    brandUploadFile = brand.logo || null;
    renderBrandPreview();
    openModal('brand-modal');
  }

  async function saveBrand(e) {
    if (e) e.preventDefault();
    var id = getVal('brand-id');
    var name = getVal('brand-name').trim();
    if (!name) return;
    
    var btn = document.getElementById('btn-save-brand');
    if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
    
    try {
      var logoUrl = '';
      if (brandUploadFile) {
        if (typeof brandUploadFile === 'string') {
          logoUrl = brandUploadFile;
        } else {
          var ext = brandUploadFile.name.split('.').pop();
          var fileName = 'brand_' + Date.now() + '.' + ext;
          var ref = storage.ref('brands/' + fileName);
          await ref.put(brandUploadFile);
          logoUrl = await ref.getDownloadURL();
        }
      }
      
      var data = { name: name, logo: logoUrl };
      if (id) {
        var prevSnap = await db.collection('brands').doc(id).get();
        var prevData = prevSnap.exists ? prevSnap.data() : null;
        await db.collection('brands').doc(id).update(data);
        writeAuditLog('Editar Marca', name, {
          collection: 'brands',
          docId: id,
          type: 'update',
          previousData: prevData,
          newData: data
        });
        showToast('Marca actualizada', 'success');
      } else {
        var docRef = await db.collection('brands').add(data);
        writeAuditLog('Crear Marca', name, {
          collection: 'brands',
          docId: docRef.id,
          type: 'create',
          newData: data
        });
        showToast('Marca creada', 'success');
      }
      closeModal('brand-modal');
      loadBrands();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Guardar Marca'; }
    }
  }

  async function deleteBrand(id) {
    var brand = allBrands.find(function (b) { return b.id === id; });
    if (!brand) return;
    if (!(await showConfirmModal('Eliminar marca', '¿Eliminar la marca "' + brand.name + '"?'))) return;
    try {
      var prevSnap = await db.collection('brands').doc(id).get();
      var prevData = prevSnap.exists ? prevSnap.data() : null;
      await db.collection('brands').doc(id).delete();
      writeAuditLog('Eliminar Marca', brand.name, {
        collection: 'brands',
        docId: id,
        type: 'delete',
        previousData: prevData
      });
      showToast('Marca eliminada', 'success');
      loadBrands();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  function removeBrandImage() {
    brandUploadFile = null;
    renderBrandPreview();
  }

  // ═══════════════════════════════════
  // SEARCH ANALYTICS
  // ═══════════════════════════════════
  async function loadSearchQueries() {
    var tbody = document.getElementById('searches-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:32px;color:#76889e;">Cargando...</td></tr>';
    try {
      var snapshot = await db.collection('search_queries').get();
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:32px;color:#76889e;">No hay búsquedas registradas.</td></tr>';
        return;
      }
      
      var frequencies = {};
      snapshot.forEach(function (doc) {
        var data = doc.data();
        var q = String(data.query || '').trim().toLowerCase();
        if (q) {
          frequencies[q] = (frequencies[q] || 0) + 1;
        }
      });
      
      var sorted = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
      var html = '';
      sorted.forEach(function ([term, count]) {
        html += '<tr>' +
          '<td><strong style="color:#0a101d;">' + escapeHtml(term) + '</strong></td>' +
          '<td>' + count + '</td>' +
          '</tr>';
      });
      tbody.innerHTML = html || '<tr><td colspan="2" style="text-align:center;padding:32px;color:#76889e;">No hay búsquedas válidas.</td></tr>';
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar búsquedas</td></tr>';
    }
  }

  async function clearSearchQueries() {
    if (!(await showConfirmModal('Limpiar búsquedas', '¿Deseas vaciar todas las analíticas de búsqueda? Esto eliminará todos los registros de búsqueda.'))) return;
    try {
      var snapshot = await db.collection('search_queries').get();
      var batch = db.batch();
      snapshot.forEach(function (doc) {
        batch.delete(doc.ref);
      });
      await batch.commit();
      writeAuditLog('Limpiar Búsquedas', 'Se vació el historial de analíticas');
      showToast('Historial de búsquedas eliminado', 'success');
      loadSearchQueries();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  // ═══════════════════════════════════
  // AUDIT LOGS
  // ═══════════════════════════════════
  async function loadAuditLogs() {
    var tbody = document.getElementById('audit-table-body');
    if (!tbody) return;
    tbody.innerHTML = getTableSkeletonHtml(5, 5);
    try {
      var snapshot = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(1000).get();
      allAuditLogs = [];
      snapshot.forEach(function (doc) {
        allAuditLogs.push({ id: doc.id, ...doc.data() });
      });
      filterAndRenderAuditLogs();
    } catch (e) {
      console.error('Audit logs load error:', e);
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar auditoría</td></tr>';
    }
  }

  function filterAndRenderAuditLogs() {
    var query = (currentAuditSearchQuery || '').toLowerCase().trim();
    var filtered = allAuditLogs;
    if (query) {
      filtered = allAuditLogs.filter(function (log) {
        var userEmail = (log.userEmail || '').toLowerCase();
        var action = (log.action || '').toLowerCase();
        var details = (log.details || '').toLowerCase();
        return userEmail.indexOf(query) !== -1 || action.indexOf(query) !== -1 || details.indexOf(query) !== -1;
      });
    }

    var totalItems = filtered.length;
    var startIndex = (currentPageAudit - 1) * itemsPerPage;
    var pagedAudit = filtered.slice(startIndex, startIndex + itemsPerPage);

    renderAuditTable(pagedAudit);

    renderPagination('audit-pagination', totalItems, itemsPerPage, currentPageAudit, function (newPage) {
      currentPageAudit = newPage;
      filterAndRenderAuditLogs();
    });
  }

  function renderAuditTable(logs) {
    var tbody = document.getElementById('audit-table-body');
    if (!tbody) return;

    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:#76889e;">No hay registros de auditoría que coincidan.</td></tr>';
      return;
    }

    var html = '';
    logs.forEach(function (log) {
      var time = log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString('es-DO') : '—';
      var revertBtn = '';
      if (currentUserData.role === 'superadmin' && log.metadata && log.metadata.collection && log.metadata.type) {
        revertBtn = '<button class="admin-btn admin-btn-ghost admin-btn-sm" style="color:#e74c3c;border-color:rgba(231,76,60,0.15);padding:4px 8px;font-size:0.75rem;border-radius:6px;" onclick="AdminPanel.revertAction(\'' + log.id + '\')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:middle;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Revertir</button>';
      } else {
        revertBtn = '<span style="font-size:0.75rem;color:#a0b0c4;">—</span>';
      }

      html += '<tr>' +
        '<td data-label="Fecha/Hora" style="font-size:0.8rem;color:#76889e;">' + time + '</td>' +
        '<td data-label="Usuario"><strong style="color:#394c60;">' + escapeHtml(log.userEmail) + '</strong></td>' +
        '<td data-label="Acción"><span class="admin-role-badge role-admin" style="text-transform:none;">' + escapeHtml(log.action) + '</span></td>' +
        '<td data-label="Detalles">' + escapeHtml(log.details) + '</td>' +
        '<td data-label="Acciones" style="text-align:right;">' + revertBtn + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
  }

  async function showUserHistory(userId) {
    currentHistoryUserId = userId;
    var u = allUsers.find(function (usr) { return usr.id === userId; });
    var name = u ? (u.displayName || 'Sin nombre') : 'Usuario desconocido';
    var email = u ? (u.email || '') : '';

    var nameEl = document.getElementById('history-user-name');
    var emailEl = document.getElementById('history-user-email');
    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;

    var tbody = document.getElementById('user-history-table-body');
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:32px;color:#76889e;">Cargando historial...</td></tr>';

    openModal('user-history-modal');

    try {
      var snapshot = await db.collection('audit_logs').where('userId', '==', userId).get();
      var logs = [];
      snapshot.forEach(function (doc) {
        logs.push({ id: doc.id, ...doc.data() });
      });

      // Sort by timestamp desc (in-memory)
      logs.sort(function (a, b) {
        var tA = a.timestamp ? (a.timestamp.seconds || 0) : 0;
        var tB = b.timestamp ? (b.timestamp.seconds || 0) : 0;
        return tB - tA;
      });

      if (tbody) {
        if (logs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:32px;color:#76889e;">No hay acciones registradas para este usuario.</td></tr>';
          return;
        }

        var html = '';
        logs.forEach(function (log) {
          var time = log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString('es-DO') : '—';
          var revertBtn = '';
          if (currentUserData.role === 'superadmin' && log.metadata && log.metadata.collection && log.metadata.type) {
            revertBtn = '<button class="admin-btn admin-btn-ghost admin-btn-sm" style="color:#e74c3c;border-color:rgba(231,76,60,0.15);padding:4px 8px;font-size:0.75rem;border-radius:6px;" onclick="AdminPanel.revertAction(\'' + log.id + '\')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:middle;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Revertir</button>';
          } else {
            revertBtn = '<span style="font-size:0.75rem;color:#a0b0c4;">—</span>';
          }

          html += '<tr>' +
            '<td data-label="Fecha/Hora" style="font-size:0.8rem;color:#76889e;">' + time + '</td>' +
            '<td data-label="Acción"><span class="admin-role-badge role-admin" style="text-transform:none;">' + escapeHtml(log.action) + '</span></td>' +
            '<td data-label="Detalles">' + escapeHtml(log.details) + '</td>' +
            '<td data-label="Acciones" style="text-align:right;">' + revertBtn + '</td>' +
            '</tr>';
        });
        tbody.innerHTML = html;
      }
    } catch (e) {
      console.error('Error loading user history:', e);
      if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:32px;color:#e74c3c;">Error al cargar historial: ' + e.message + '</td></tr>';
    }
  }

  async function revertAction(logId) {
    if (currentUserData.role !== 'superadmin') {
      showToast('Acceso denegado: solo el superadmin puede realizar esta acción.', 'error');
      return;
    }

    try {
      var logSnap = await db.collection('audit_logs').doc(logId).get();
      if (!logSnap.exists) {
        showToast('El registro de auditoría no existe.', 'error');
        return;
      }

      var logData = logSnap.data();
      var metadata = logData.metadata;
      if (!metadata || !metadata.collection || !metadata.docId || !metadata.type) {
        showToast('Este registro no contiene metadatos válidos para ser revertido.', 'error');
        return;
      }

      var collection = metadata.collection;
      var docId = metadata.docId;
      var type = metadata.type;
      var previousData = metadata.previousData || null;

      var confirmMsg = '¿Estás seguro de que deseas deshacer la acción "' + logData.action + '" (' + logData.details + ')?';
      if (!(await showConfirmModal('Revertir Acción', confirmMsg))) return;

      showToast('Revirtiendo acción...', 'info');

      if (type === 'create') {
        await db.collection(collection).doc(docId).delete();
      } else if (type === 'update') {
        if (!previousData) {
          throw new Error('No se encontraron los datos previos para realizar la restauración.');
        }
        await db.collection(collection).doc(docId).set(previousData);
      } else if (type === 'delete') {
        if (!previousData) {
          throw new Error('No se encontraron los datos previos para recrear el documento.');
        }
        await db.collection(collection).doc(docId).set(previousData);
      } else {
        throw new Error('Tipo de cambio no compatible para reversión.');
      }

      var revertDetails = 'Revertido log ID: ' + logId + ' (' + logData.action + ' en ' + collection + '/' + docId + ')';
      await writeAuditLog('Revertir Acción', revertDetails, {
        collection: collection,
        docId: docId,
        type: 'revert',
        revertedLogId: logId,
        userId: currentUserData.uid
      });

      showToast('Acción revertida con éxito', 'success');

      if (collection === 'products') {
        loadInventory();
        loadDashboardStats();
      } else if (collection === 'users') {
        loadUsers();
        loadDashboardStats();
      } else if (collection === 'discounts') {
        loadDiscounts();
        loadDashboardStats();
      } else if (collection === 'banners') {
        loadBanners();
      } else if (collection === 'categories') {
        loadCategories();
      } else if (collection === 'brands') {
        loadBrands();
      } else if (collection === 'orders') {
        loadOrders();
      } else if (collection === 'config') {
        if (docId === 'site') {
          loadConfig();
        } else if (docId === 'layout') {
          loadLayout();
        }
      }

      loadAuditLogs();

      if (currentHistoryUserId) {
        showUserHistory(currentHistoryUserId);
      }

    } catch (err) {
      console.error('Reversion error:', err);
      showToast('Error al revertir: ' + err.message, 'error');
    }
  }

  // ═══════════════════════════════════
  // MODALS & EVENT HANDLERS
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

          for(var i=0; i<uploadFiles.length; i++) {
            var file = uploadFiles[i];
            var ext = file.name.split('.').pop();
            var fileName = 'product_' + Date.now() + '_' + Math.floor(Math.random()*1000) + '.' + ext;
            var ref = storage.ref('products/' + fileName);
            await ref.put(file);
            var url = await ref.getDownloadURL();
            finalGallery.push(url);
          }

          var selectedCategory = getVal('product-category');

          var data = {
            title: getVal('product-title'),
            desc: getVal('product-desc'),
            price: parseFloat(getVal('product-price')) || 0,
            category: selectedCategory,
            department: selectedCategory ? selectedCategory.toLowerCase() : 'otros',
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

    // Banner form
    var bannerForm = document.getElementById('banner-form');
    if (bannerForm) {
      bannerForm.addEventListener('submit', function (e) {
        saveBanner(e);
      });
    }

    // Category form
    var categoryForm = document.getElementById('category-form');
    if (categoryForm) {
      categoryForm.addEventListener('submit', function (e) {
        saveCategory(e);
      });
    }

    // Brand form
    var brandForm = document.getElementById('brand-form');
    if (brandForm) {
      brandForm.addEventListener('submit', function (e) {
        saveBrand(e);
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
          currentPageInventory = 1;
          filterAndRenderInventory();
        }, 300);
      });
    }

    // Inventory category filter
    var categoryFilter = document.getElementById('inventory-category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', function () {
        currentCategoryFilter = this.value;
        currentPageInventory = 1;
        filterAndRenderInventory();
      });
    }

    // Users search
    var usersSearchInput = document.getElementById('users-search');
    if (usersSearchInput) {
      var userDebounceTimer;
      usersSearchInput.addEventListener('input', function () {
        clearTimeout(userDebounceTimer);
        var q = this.value;
        userDebounceTimer = setTimeout(function () {
          currentUserSearchQuery = q;
          currentPageUsers = 1;
          filterAndRenderUsers();
        }, 300);
      });
    }

    // Password reset click listener
    var resetPwdBtn = document.getElementById('btn-reset-password');
    if (resetPwdBtn) {
      resetPwdBtn.addEventListener('click', function() {
        var email = getVal('user-email-input').trim();
        if (email) {
          sendUserPasswordReset(email);
        } else {
          showToast('No hay email seleccionado', 'error');
        }
      });
    }

    // Orders search & filter
    var ordersSearch = document.getElementById('orders-search');
    if (ordersSearch) {
      ordersSearch.addEventListener('input', function() {
        currentOrdersSearchQuery = this.value;
        currentPageOrders = 1;
        filterAndRenderOrders();
      });
    }
    var ordersStatusFilter = document.getElementById('orders-status-filter');
    if (ordersStatusFilter) {
      ordersStatusFilter.addEventListener('change', function() {
        currentOrdersStatusFilter = this.value;
        currentPageOrders = 1;
        filterAndRenderOrders();
      });
    }

    // Discounts search
    var discountsSearch = document.getElementById('discounts-search');
    if (discountsSearch) {
      discountsSearch.addEventListener('input', function() {
        currentDiscountSearchQuery = this.value;
        currentPageDiscounts = 1;
        filterAndRenderDiscounts();
      });
    }

    // Audit search
    var auditSearch = document.getElementById('audit-search');
    if (auditSearch) {
      auditSearch.addEventListener('input', function() {
        currentAuditSearchQuery = this.value;
        currentPageAudit = 1;
        filterAndRenderAuditLogs();
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

  function showConfirmModal(title, message) {
    return new Promise(function (resolve) {
      var modal = document.getElementById('confirm-modal');
      var titleEl = document.getElementById('confirm-title');
      var msgEl = document.getElementById('confirm-message');
      var btnAccept = document.getElementById('confirm-btn-accept');
      var btnCancel = document.getElementById('confirm-btn-cancel');
      var btnClose = document.getElementById('confirm-close');

      if (!modal) {
        resolve(confirm(message));
        return;
      }

      titleEl.textContent = title;
      msgEl.textContent = message;
      modal.classList.add('is-open');

      function cleanup(result) {
        modal.classList.remove('is-open');
        btnAccept.removeEventListener('click', onAccept);
        btnCancel.removeEventListener('click', onCancel);
        if (btnClose) btnClose.removeEventListener('click', onCancel);
        resolve(result);
      }

      function onAccept() { cleanup(true); }
      function onCancel() { cleanup(false); }

      btnAccept.addEventListener('click', onAccept);
      btnCancel.addEventListener('click', onCancel);
      if (btnClose) btnClose.addEventListener('click', onCancel);
    });
  }

  function getTableSkeletonHtml(cols, rows) {
    var html = '';
    for (var r = 0; r < rows; r++) {
      html += '<tr>';
      for (var c = 0; c < cols; c++) {
        if (c === 0) {
          html += '<td><div class="admin-skeleton-img"></div></td>';
        } else if (c === cols - 1) {
          html += '<td style="display:flex; gap:6px; align-items:center;"><div class="admin-skeleton-btn"></div><div class="admin-skeleton-btn"></div></td>';
        } else {
          html += '<td><div class="admin-skeleton"></div></td>';
        }
      }
      html += '</tr>';
    }
    return html;
  }

  function renderPagination(containerId, totalItems, itemsPerPage, currentPage, onPageChange) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    
    if (totalItems === 0) {
      container.innerHTML = '';
      return;
    }

    var startItem = (currentPage - 1) * itemsPerPage + 1;
    var endItem = Math.min(currentPage * itemsPerPage, totalItems);

    var html = '<div class="admin-pagination">' +
      '<div class="admin-pagination-info">Mostrando ' + startItem + ' - ' + endItem + ' de ' + totalItems + ' elementos</div>' +
      '<div class="admin-pagination-buttons">' +
      '  <button class="admin-pagination-btn" id="' + containerId + '-prev" ' + (currentPage === 1 ? 'disabled' : '') + '>Anterior</button>' +
      '  <span style="display:flex; align-items:center; padding: 0 8px; font-weight:600; font-size:0.82rem;">Pág. ' + currentPage + ' de ' + totalPages + '</span>' +
      '  <button class="admin-pagination-btn" id="' + containerId + '-next" ' + (currentPage === totalPages ? 'disabled' : '') + '>Siguiente</button>' +
      '</div>' +
      '</div>';

    container.innerHTML = html;

    var prevBtn = document.getElementById(containerId + '-prev');
    var nextBtn = document.getElementById(containerId + '-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      });
    }
  }

  async function sendUserPasswordReset(email) {
    try {
      await window.FutunetFirebase.auth.sendPasswordResetEmail(email);
      showToast('Correo de restablecimiento enviado a ' + email, 'success');
      writeAuditLog('Restablecer Contraseña', 'Se envió correo de restablecimiento a ' + email);
    } catch (e) {
      showToast('Error al enviar correo: ' + e.message, 'error');
    }
  }

  function exportToCSV(headers, dataKeys, filename, dataArray) {
    if (!dataArray || !dataArray.length) {
      showToast('No hay datos para exportar', 'error');
      return;
    }

    var csvRows = [];
    
    // Add header row
    csvRows.push(headers.map(function (h) {
      return '"' + String(h).replace(/"/g, '""') + '"';
    }).join(','));

    // Add data rows
    dataArray.forEach(function (item) {
      var row = dataKeys.map(function (key) {
        var val = '';
        if (typeof key === 'function') {
          val = key(item);
        } else {
          val = item[key];
        }
        if (val == null) val = '';
        return '"' + String(val).replace(/"/g, '""') + '"';
      });
      csvRows.push(row.join(','));
    });

    var csvContent = '\uFEFF' + csvRows.join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement('a');
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    showToast('Exportación completada', 'success');
  }

  function exportInventoryToCSV() {
    var headers = ['Nombre', 'Precio', 'Stock', 'Categoría', 'Marca', 'Condición', 'Estado'];
    var keys = [
      'title',
      'price',
      'stock',
      function(p) { return p.category || p.department || ''; },
      'brand',
      'condition',
      function(p) { return p.isActive !== false ? 'Visible' : 'Oculto'; }
    ];
    exportToCSV(headers, keys, 'inventario_futunet.csv', allProducts);
  }

  function exportUsersToCSV() {
    var headers = ['Nombre', 'Email', 'Rol', 'Estado', 'Fecha de Registro'];
    var keys = [
      'displayName',
      'email',
      'role',
      'status',
      function(u) { return u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleString('es-DO') : ''; }
    ];
    exportToCSV(headers, keys, 'usuarios_futunet.csv', allUsers);
  }

  function exportOrdersToCSV() {
    var headers = ['Pedido ID', 'Cliente', 'Email', 'Teléfono', 'Dirección', 'Artículos', 'Subtotal', 'Descuento Código', 'Descuento Monto', 'Total', 'Estado', 'Fecha'];
    var keys = [
      'id',
      'userName',
      'userEmail',
      'userPhone',
      'shippingAddress',
      function(o) {
        var items = o.items || [];
        return items.map(function(it) { return it.title + ' (' + (it.qty || 1) + 'x RD$' + it.price + ')'; }).join(' | ');
      },
      function(o) {
        var sub = 0;
        (o.items || []).forEach(function(it) { sub += (parseFloat(it.price) || 0) * (parseInt(it.qty) || 1); });
        return sub;
      },
      function(o) { return o.discount ? o.discount.code : ''; },
      function(o) { return o.discount ? o.discount.amount : 0; },
      'total',
      'status',
      function(o) { return o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleString('es-DO') : ''; }
    ];
    exportToCSV(headers, keys, 'pedidos_futunet.csv', allOrders);
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
    syncToFirebase: syncToFirebase,
    exportInventoryToCSV: exportInventoryToCSV,
    exportUsersToCSV: exportUsersToCSV,
    exportOrdersToCSV: exportOrdersToCSV,
    
    // Banners CRUD
    openNewBanner: openNewBanner,
    editBanner: editBanner,
    deleteBanner: deleteBanner,
    removeBannerImage: removeBannerImage,
    
    // Categories CRUD
    openNewCategory: openNewCategory,
    editCategory: editCategory,
    deleteCategory: deleteCategory,
    
    // Brands CRUD
    openNewBrand: openNewBrand,
    editBrand: editBrand,
    deleteBrand: deleteBrand,
    removeBrandImage: removeBrandImage,
    switchCatBrandsTab: switchCatBrandsTab,
    
    // Searches Methods
    clearSearchQueries: clearSearchQueries,
    
    // Order details
    showOrderDetail: showOrderDetail,

    // Visual Editor / Layout
    loadLayout: loadLayout,
    saveLayoutConfig: saveLayoutConfig,
    resetDefaultLayout: resetDefaultLayout,
    moveSectionUp: moveSectionUp,
    moveSectionDown: moveSectionDown,
    toggleSectionVisibility: toggleSectionVisibility,
    updateSectionTitle: updateSectionTitle,
    updateSectionSubtitle: updateSectionSubtitle,
    updateLivePreview: updateLivePreview,
    showUserHistory: showUserHistory,
    revertAction: revertAction
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

// ======= BANNERS UPLOADER LOGIC =======
var bannerUploadFile = null;

function initBannerUploader() {
  var zone = document.getElementById('banner-upload-zone');
  var input = document.getElementById('banner-image');
  if(!zone || !input) return;
  zone.addEventListener('click', function() { input.click(); });
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      bannerUploadFile = e.dataTransfer.files[0];
      renderBannerPreview();
    }
  });
  input.addEventListener('change', function(e) {
    if (e.target.files.length) {
      bannerUploadFile = e.target.files[0];
      renderBannerPreview();
    }
  });
}

function renderBannerPreview() {
  var container = document.getElementById('banner-preview-container');
  if(!container) return;
  container.innerHTML = '';
  if (bannerUploadFile) {
    var url = typeof bannerUploadFile === 'string' ? bannerUploadFile : URL.createObjectURL(bannerUploadFile);
    container.innerHTML = '<div class="image-thumb-wrapper"><img src="'+url+'"><button type="button" class="image-thumb-remove" onclick="AdminPanel.removeBannerImage()">X</button></div>';
  }
}

// ======= BRANDS UPLOADER LOGIC =======
var brandUploadFile = null;

function initBrandUploader() {
  var zone = document.getElementById('brand-upload-zone');
  var input = document.getElementById('brand-logo');
  if(!zone || !input) return;
  zone.addEventListener('click', function() { input.click(); });
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      brandUploadFile = e.dataTransfer.files[0];
      renderBrandPreview();
    }
  });
  input.addEventListener('change', function(e) {
    if (e.target.files.length) {
      brandUploadFile = e.target.files[0];
      renderBrandPreview();
    }
  });
}

function renderBrandPreview() {
  var container = document.getElementById('brand-preview-container');
  if(!container) return;
  container.innerHTML = '';
  if (brandUploadFile) {
    var url = typeof brandUploadFile === 'string' ? brandUploadFile : URL.createObjectURL(brandUploadFile);
    container.innerHTML = '<div class="image-thumb-wrapper"><img src="'+url+'"><button type="button" class="image-thumb-remove" onclick="AdminPanel.removeBrandImage()">X</button></div>';
  }
}
