/**
 * Creaticos Billing System Lógica JS
 * Maneja estadísticas (Chart.js), CRUD de facturas, clientes, productos y cobros con Firestore.
 */

window.ERPBilling = (function () {
  'use strict';

  const BillingCore = window.ERPBillingCore;
  if (!BillingCore) throw new Error('No se pudo cargar el núcleo de cálculos de facturación.');

  // Tenant Config
  const SUPPORTED_COMPANIES = ['CREATICOS', 'FUTUNETSRL'];
  const BILLING_API_BASE_URL = 'https://futunet-backend.onrender.com';
  const DEFAULT_RESTAURANT_TABLES = Array.from({ length: 12 }, (_, index) => `Mesa ${index + 1}`);
  let activeCompanyCode = 'CREATICOS';
  let isCreaticos = true;
  let isPanitas = false;
  let collectionClients = '';
  let collectionInvoices = '';
  let collectionPayments = '';
  let collectionSettings = '';
  let collectionSecrets = '';
  let collectionCashSessions = '';
  let collectionInventoryMovements = '';
  let collectionNcfRegistry = '';
  let collectionRefunds = '';
  let collectionProducts = '';

  function configureTenant(userData) {
    const requestedCode = BillingCore.resolveCompanyCode(
      userData,
      localStorage.getItem('active_company_code') || 'CREATICOS'
    );

    activeCompanyCode = requestedCode;
    localStorage.setItem('active_company_code', activeCompanyCode);
    sessionStorage.setItem('active_company_code', activeCompanyCode);
    isCreaticos = activeCompanyCode === 'CREATICOS';
    isPanitas = activeCompanyCode === 'PANITAS';

    const prefix = isCreaticos ? 'creaticos' : (isPanitas ? 'panitas' : 'futunet');
    collectionClients = `${prefix}_clients`;
    collectionInvoices = `${prefix}_invoices`;
    collectionPayments = `${prefix}_payments`;
    collectionSettings = `${prefix}_settings`;
    collectionSecrets = `${prefix}_secrets`;
    collectionCashSessions = `${prefix}_cash_sessions`;
    collectionInventoryMovements = `${prefix}_inventory_movements`;
    collectionNcfRegistry = `${prefix}_ncf_registry`;
    collectionRefunds = `${prefix}_refunds`;
    collectionProducts = isCreaticos ? 'creaticos_products' : (isPanitas ? 'panitas_products' : 'products');
  }

  // Firestore DB reference
  function getDB() { return window.FutunetFirebase.db; }

  function inventoryProductTarget(db, compositeId) {
    const match = /^(creaticos|futunet|panitas)_(.+)$/.exec(String(compositeId || ''));
    if (!match) return null;
    const sourceCollection = match[1] === 'creaticos'
      ? 'creaticos_products'
      : (match[1] === 'panitas' ? 'panitas_products' : 'products');
    return {
      productId: compositeId,
      documentId: match[2],
      collection: sourceCollection,
      ref: db.collection(sourceCollection).doc(match[2])
    };
  }

  function aggregateInventoryItems(items) {
    const aggregated = new Map();
    (items || []).forEach(item => {
      const productId = String(item.productId || '');
      if (!/^(creaticos|futunet|panitas)_/.test(productId)) return;
      const current = aggregated.get(productId) || { ...item, qty: 0 };
      current.qty += Number(item.qty || 0);
      aggregated.set(productId, current);
    });
    return Array.from(aggregated.values());
  }

  function productCategorySnapshot(compositeId) {
    const match = /^(creaticos|futunet|panitas)_(.+)$/.exec(String(compositeId || ''));
    if (!match) return 'Otros';
    const source = match[1] === 'creaticos'
      ? creaticosProducts
      : (match[1] === 'futunet' ? futunetProducts : products);
    const product = source.find(item => item.id === match[2]);
    return String(product && product.category || (match[1] === 'creaticos' ? 'Servicios Creaticos' : 'Otros'));
  }

  async function lookupRncSecure(cleanRnc) {
    const authUser = window.firebase && firebase.auth ? firebase.auth().currentUser : null;
    if (!authUser) throw new Error('La sesión expiró. Inicia sesión nuevamente.');
    const idToken = await authUser.getIdToken();
    const response = await fetch(`${BILLING_API_BASE_URL}/api/rnc/consulta?rnc=${encodeURIComponent(cleanRnc)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'X-Company-Code': activeCompanyCode
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.mensaje || `Error HTTP ${response.status}`);
    }
    if (data && data.error) throw new Error(data.mensaje || data.error);
    return data;
  }

  // HTML escaping helper for XSS prevention
  function escapeHTML(str) {
    if (str === undefined || str === null) return '';
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Attribute escaping helper for attribute breakouts
  function escapeAttr(str) {
    if (str === undefined || str === null) return '';
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Toast notification system
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `erp-toast toast-${type}`;
    
    // Select icon based on type
    let icon = '';
    if (type === 'success') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
    } else if (type === 'danger') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
    } else if (type === 'warning') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
    } else {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`;
    }

    toast.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    // Auto remove from DOM after anim ends (3s)
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  function billingInitializationErrorMessage(error) {
    const code = String(error && error.code || '').toLowerCase();
    const message = String(error && error.message || 'Error desconocido.');
    if (code.includes('permission-denied') || /missing or insufficient permissions/i.test(message)) {
      const authUser = window.firebase && firebase.auth ? firebase.auth().currentUser : null;
      if (!authUser || authUser.emailVerified !== true) {
        return 'La sesión necesita renovar la verificación del correo. Cierra sesión e inicia nuevamente.';
      }
      const companyName = activeCompanyCode === 'FUTUNETSRL' ? 'Futunet' : 'Creaticos';
      return `Tu usuario no tiene acceso a la facturación de ${companyName}. Cierra sesión e inicia nuevamente; si continúa, revisa la empresa y el rol asignados al usuario.`;
    }
    return 'No se pudo iniciar la facturación: ' + message;
  }

  function actionDialog(options) {
    const config = options || {};
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'erp-action-dialog is-open';
      overlay.setAttribute('role', 'presentation');
      overlay.innerHTML = `
        <section class="erp-action-dialog-card" role="dialog" aria-modal="true" aria-labelledby="erp-action-dialog-title">
          <div class="erp-action-dialog-icon" aria-hidden="true">${config.tone === 'danger' ? '!' : '?'}</div>
          <h2 id="erp-action-dialog-title"></h2>
          <p class="erp-action-dialog-message"></p>
          <label class="erp-action-dialog-input-wrap" hidden>
            <span></span>
            <input class="form-input" type="text" maxlength="500" />
          </label>
          <div class="erp-action-dialog-actions">
            <button type="button" class="admin-btn admin-btn-ghost" data-dialog-cancel>Cancelar</button>
            <button type="button" class="admin-btn admin-btn-primary" data-dialog-confirm>Confirmar</button>
          </div>
        </section>`;
      const title = overlay.querySelector('h2');
      const message = overlay.querySelector('.erp-action-dialog-message');
      const inputWrap = overlay.querySelector('.erp-action-dialog-input-wrap');
      const input = overlay.querySelector('input');
      const confirmButton = overlay.querySelector('[data-dialog-confirm]');
      const cancelButton = overlay.querySelector('[data-dialog-cancel]');
      title.textContent = config.title || 'Confirmar acción';
      message.textContent = config.message || '';
      confirmButton.textContent = config.confirmLabel || 'Confirmar';
      if (config.tone === 'danger') confirmButton.classList.add('is-danger');
      if (config.input) {
        inputWrap.hidden = false;
        inputWrap.querySelector('span').textContent = config.inputLabel || 'Información requerida';
        input.value = config.defaultValue || '';
        input.placeholder = config.placeholder || '';
      }
      const finish = value => {
        document.removeEventListener('keydown', onKeydown, true);
        overlay.remove();
        resolve(value);
      };
      const confirm = () => {
        if (config.input && config.required && !input.value.trim()) {
          input.setCustomValidity(config.requiredMessage || 'Completa este campo.');
          input.reportValidity();
          return;
        }
        finish(config.input ? input.value.trim() : true);
      };
      const onKeydown = event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          finish(config.input ? null : false);
        }
        if (event.key === 'Enter' && (!config.input || event.target === input)) {
          event.preventDefault();
          confirm();
        }
      };
      confirmButton.addEventListener('click', confirm);
      cancelButton.addEventListener('click', () => finish(config.input ? null : false));
      overlay.addEventListener('click', event => {
        if (event.target === overlay) finish(config.input ? null : false);
      });
      document.addEventListener('keydown', onKeydown, true);
      document.body.appendChild(overlay);
      setTimeout(() => (config.input ? input : confirmButton).focus(), 0);
    });
  }

  function confirmAction(message, options = {}) {
    return actionDialog({ ...options, message, input: false });
  }

  function promptAction(message, options = {}) {
    return actionDialog({ ...options, message, input: true });
  }

  // System State Caches
  let settings = null;
  let activeCashSession = null;
  let invoices = [];
  let clients = [];
  let products = [];
  let creaticosProducts = [];
  let futunetProducts = [];
  let payments = [];
  let refunds = [];
  const DATA_PAGE_SIZE = 500;
  const PAYMENT_PAGE_SIZE = 1000;
  const DIRECTORY_CACHE_LIMIT = 2000;
  let invoiceHistoryCursor = null;
  let paymentHistoryCursor = null;
  let hasMoreInvoiceHistory = false;
  let hasMorePaymentHistory = false;
  
  let currentInvoiceItems = [];
  let dashboardChart = null;
  let categoryChart = null;
  let returnToInvoice = false;
  let returnToPos = false;
  let posCart = [];
  let posClient = { id: '', name: 'Consumidor Final', rnc: '' };
  let posNcfType = 'none';
  let posDocType = 'invoice';
  let posActiveCategory = 'all';
  let currentProfileClientId = '';
  let isProcessingPosSale = false;
  let pendingPosManualReference = '';
  let lastFocusedBeforeModal = null;
  let restaurantOrders = [];
  let restaurantOrdersLoaded = false;
  let unsubscribeRestaurantOrders = null;
  let restaurantClockTimer = null;

  // Pagination for Invoices
  let invoiceCurrentPage = 1;
  const invoicePageSize = 10;

  // Edit State
  let editingInvoiceId = null;
  let editingInvoiceNumber = null;
  let conversionSourceId = null;
  let isInitializingForm = false;

  // Security Context
  let currentUser = null;
  let isUserAdmin = false;
  let isKitchenOnly = false;

  async function init(userData) {
    configureTenant(userData);
    currentUser = userData;
    const roles = Array.from(new Set([
      userData ? (userData.role || 'user') : 'user',
      ...((userData && Array.isArray(userData.roles)) ? userData.roles : [])
    ]));
    const activeCompany = activeCompanyCode.toLowerCase();
    const tenantAdminRole = activeCompany + '_admin';
    isUserAdmin = roles.includes('superadmin') || 
                  roles.includes('admin') || 
                  roles.includes('erp_admin') || 
                  roles.includes(tenantAdminRole);
    const hasGeneralErpAccess = isUserAdmin ||
      roles.includes('editor') ||
      roles.includes('erp_operator') ||
      roles.includes(`${activeCompany}_operator`) ||
      roles.includes(`${activeCompany}_user`) ||
      roles.includes(`${activeCompany}_usuario`);
    isKitchenOnly = isPanitas && roles.includes('panitas_kitchen') && !hasGeneralErpAccess;

    document.querySelectorAll('[data-rnc-lookup]').forEach(button => {
      button.hidden = !isUserAdmin;
    });
    const productFormTab = document.getElementById('subtab-btn-products-form');
    if (productFormTab) productFormTab.hidden = !isUserAdmin;

    console.log('%c✏️ Initializing ERP Billing System for ' + activeCompanyCode + '...', 'color: #0a70a2; font-weight: bold;');
    try {
      applyTenantTheme();
      initializeModalAccessibility();
      await loadSettings();
      if (isKitchenOnly) {
        setupEventListeners();
        startRestaurantRealtime();
        return;
      }
      await fetchAllData();
      await checkActiveCashSession();
      const fiscalPeriodInput = document.getElementById('fiscal-report-period');
      if (fiscalPeriodInput && !fiscalPeriodInput.value) {
        fiscalPeriodInput.value = BillingCore.toLocalDateInput().slice(0, 7);
      }
      initDashboard();
      setupEventListeners();
      if (isPanitas) {
        startRestaurantRealtime();
      }
    } catch (err) {
      console.error('Error initializing ERP Billing:', err);
      showToast(billingInitializationErrorMessage(err), 'danger');
      throw err;
    }
  }

  // Apply tenant specific visual themes and layouts
  function applyTenantTheme() {
    const root = document.documentElement;
    if (isCreaticos) {
      root.style.setProperty('--primary', '#6366f1');
      root.style.setProperty('--primary-hover', '#4f46e5');
      root.style.setProperty('--primary-rgb', '99, 102, 241');
      root.style.setProperty('--bg-layout', 'linear-gradient(180deg, #f8faff 0%, #eef2ff 100%)');
      root.style.setProperty('--card-shadow', '0 10px 30px -10px rgba(99, 102, 241, 0.08), 0 1px 3px rgba(99, 102, 241, 0.03)');
      root.style.setProperty('--input-focus', 'rgba(99, 102, 241, 0.15)');
    } else if (isPanitas) {
      root.style.setProperty('--primary', '#ea580c');
      root.style.setProperty('--primary-hover', '#c2410c');
      root.style.setProperty('--primary-rgb', '234, 88, 12');
      root.style.setProperty('--bg-layout', 'linear-gradient(180deg, #fffaf5 0%, #ffedd5 100%)');
      root.style.setProperty('--card-shadow', '0 10px 30px -10px rgba(234, 88, 12, 0.08), 0 1px 3px rgba(234, 88, 12, 0.03)');
      root.style.setProperty('--input-focus', 'rgba(234, 88, 12, 0.15)');
    } else {
      root.style.setProperty('--primary', '#0a70a2');
      root.style.setProperty('--primary-hover', '#085d88');
      root.style.setProperty('--primary-rgb', '10, 112, 162');
      root.style.setProperty('--bg-layout', 'linear-gradient(180deg, #f3f7fc 0%, #eaf2fb 100%)');
      root.style.setProperty('--card-shadow', '0 10px 30px -10px rgba(10, 112, 162, 0.08), 0 1px 3px rgba(10, 112, 162, 0.03)');
      root.style.setProperty('--input-focus', 'rgba(10, 112, 162, 0.15)');
    }

    // Set page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      if (isCreaticos) {
        pageTitle.textContent = 'Creaticos Group';
      } else if (isPanitas) {
        pageTitle.textContent = 'Los Panitas By Nechy';
      } else {
        pageTitle.textContent = 'Futunet Suministros';
      }
    }

    // Set sidebar logos/names
    const sbLogo = document.getElementById('sidebar-brand-logo');
    if (sbLogo) {
      if (isCreaticos) sbLogo.src = 'img/logo-creaticos-icon.png';
      else if (isPanitas) sbLogo.src = 'img/logo-panitas.png';
      else sbLogo.src = 'img/logo-navbar.webp';
    }
    
    const sbName = document.getElementById('sidebar-brand-name');
    if (sbName) {
      if (isCreaticos) sbName.textContent = 'Creaticos Group';
      else if (isPanitas) sbName.textContent = 'Los Panitas';
      else sbName.textContent = 'Futunet Suministros';
    }

    // Set view/printable logo
    const viewLogoEl = document.getElementById('view-company-logo');
    if (viewLogoEl) {
      if (isCreaticos) viewLogoEl.src = 'img/logo-creaticos-full.webp';
      else if (isPanitas) viewLogoEl.src = 'img/logo-panitas.png';
      else viewLogoEl.src = 'img/futunet-logo-clean.png';
    }

    // Show/hide division selector
    const divisionGroup = document.getElementById('division-form-group');
    if (divisionGroup) {
      divisionGroup.style.display = isCreaticos ? 'block' : 'none';
    }

    // Show/hide source filter based on tenant
    const pSourceFilter = document.getElementById('products-source-filter');
    if (pSourceFilter) {
      pSourceFilter.value = isCreaticos ? 'creaticos' : 'futunet';
      pSourceFilter.style.display = (isCreaticos || isPanitas) ? 'none' : 'inline-block';
    }

    // Show/hide POS categories
    const posCategoriesList = document.getElementById('pos-categories-list');
    if (posCategoriesList) {
      posCategoriesList.style.display = (isCreaticos || isPanitas) ? 'flex' : 'none';
      if (isPanitas) {
        posCategoriesList.innerHTML = `
          <button type="button" class="pos-category-btn is-active" id="pos-cat-all" data-erp-click="ERPBilling.filterPosCategory('all')">Todos</button>
          <button type="button" class="pos-category-btn" id="pos-cat-comida" data-erp-click="ERPBilling.filterPosCategory('comida')">Comida</button>
          <button type="button" class="pos-category-btn" id="pos-cat-bebidas" data-erp-click="ERPBilling.filterPosCategory('bebidas')">Bebidas</button>
        `;
      }
    }

    // Show/hide product source group
    const productSourceGroup = document.getElementById('form-product-source-group');
    if (productSourceGroup) {
      productSourceGroup.style.display = isCreaticos ? 'block' : 'none';
    }

    // Adjust POS categories button display
    const posCatCreaticos = document.getElementById('pos-cat-creaticos');
    const posCatFutunet = document.getElementById('pos-cat-futunet');
    if (posCatCreaticos) posCatCreaticos.style.display = isCreaticos ? 'inline-block' : 'none';
    if (posCatFutunet) posCatFutunet.style.display = isCreaticos ? 'inline-block' : 'none';

    // Show/hide restaurant fields and mesas container
    const restFields = document.getElementById('pos-restaurant-fields');
    if (restFields) restFields.style.display = isPanitas ? 'block' : 'none';

    const restTables = document.getElementById('pos-restaurant-tables-container');
    if (restTables) restTables.style.display = isPanitas ? 'block' : 'none';

    const restSettings = document.getElementById('restaurant-settings-group');
    if (restSettings) restSettings.style.display = isPanitas ? 'block' : 'none';

    // Dynamic titles for Dashboard and Settings
    const dashboardTitle = document.getElementById('dashboard-panel-title');
    if (dashboardTitle) {
      dashboardTitle.textContent = isCreaticos ? 'Dashboard Creaticos Group' : (isPanitas ? 'Dashboard Los Panitas' : 'Dashboard Futunet');
    }
    const settingsTitle = document.getElementById('settings-panel-title');
    if (settingsTitle) {
      settingsTitle.textContent = isCreaticos ? 'Configuración de Creaticos Group' : (isPanitas ? 'Configuración de Los Panitas' : 'Configuración de Futunet');
    }
  }

  const NCF_FIELDS = {
    B01: { prefix: 'ncfB01Prefix', sequence: 'ncfB01Seq', start: 'ncfB01Start', end: 'ncfB01End', expiry: 'ncfB01Expiry' },
    B02: { prefix: 'ncfB02Prefix', sequence: 'ncfB02Seq', start: 'ncfB02Start', end: 'ncfB02End', expiry: 'ncfB02Expiry' },
    B03: { prefix: 'ncfB03Prefix', sequence: 'ncfB03Seq', start: 'ncfB03Start', end: 'ncfB03End', expiry: 'ncfB03Expiry' },
    B04: { prefix: 'ncfB04Prefix', sequence: 'ncfB04Seq', start: 'ncfB04Start', end: 'ncfB04End', expiry: 'ncfB04Expiry' },
    B12: { prefix: 'ncfB12Prefix', sequence: 'ncfB12Seq', start: 'ncfB12Start', end: 'ncfB12End', expiry: 'ncfB12Expiry' },
    B14: { prefix: 'ncfB14Prefix', sequence: 'ncfB14Seq', start: 'ncfB14Start', end: 'ncfB14End', expiry: 'ncfB14Expiry' },
    B15: { prefix: 'ncfB15Prefix', sequence: 'ncfB15Seq', start: 'ncfB15Start', end: 'ncfB15End', expiry: 'ncfB15Expiry' }
  };

  function normalizeNcfSettings(target) {
    Object.entries(NCF_FIELDS).forEach(([type, fields]) => {
      target[fields.prefix] = BillingCore.normalizeNcfPrefix(target[fields.prefix], type);
      const sequence = Number(target[fields.sequence]);
      target[fields.sequence] = Number.isInteger(sequence) && sequence > 0 ? sequence : 1;
      const start = Number(target[fields.start]);
      const end = Number(target[fields.end]);
      target[fields.start] = Number.isInteger(start) && start > 0 ? start : 1;
      target[fields.end] = Number.isInteger(end) && end >= target[fields.start] ? end : 99999999;
      target[fields.expiry] = String(target[fields.expiry] || '').slice(0, 10);
    });
    target.ncfLowStockWarning = Math.max(1, Number(target.ncfLowStockWarning) || 25);
    return target;
  }

  function buildNcfFromSettings(sourceSettings, type) {
    const fields = NCF_FIELDS[type];
    if (!fields) return '';
    return BillingCore.buildNcf(type, sourceSettings[fields.prefix], sourceSettings[fields.sequence]);
  }

  function invoiceIssuerSnapshot(division, sourceSettings = settings) {
    const base = sourceSettings || {};
    let displayName = base.name || (isCreaticos ? 'Creaticos Group' : 'Futunet Suministros');
    if (isCreaticos && division === 'papeleria') displayName = 'Creaticos Papelería y Suministros';
    if (isCreaticos && division === 'sublimacion') displayName = 'Creaticos Sublimación';
    return {
      companyCode: activeCompanyCode,
      legalName: base.name || displayName,
      displayName,
      rnc: base.rnc || '',
      phone: base.phone || '',
      email: base.email || '',
      address: base.address || '',
      slogan: base.ticketSlogan || '',
      instagram: base.ticketInstagram || '',
      logo: isCreaticos ? 'img/logo-creaticos-full.webp' : 'img/futunet-logo-clean.png'
    };
  }

  function invoiceCustomerSnapshot(clientId, fallback) {
    const client = clients.find(item => item.id === clientId) || {};
    return {
      id: clientId || 'custom',
      name: client.name || fallback.name || '',
      rnc: client.rnc || fallback.rnc || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || ''
    };
  }

  // Load Settings (Ensure default document in Firestore if not existing)
  async function loadSettings() {
    const docRef = getDB().collection(collectionSettings).doc('general');
    const doc = await docRef.get();
    if (doc.exists) {
      settings = doc.data();
      if (isCreaticos) {
        // Ensure name is updated to Creaticos Group in Firestore if it was the old one
        if (settings.name === 'Creaticos Papelería y Sublimados' || settings.name === 'Creaticos Papelería') {
          settings.name = 'Creaticos Group';
          if (isUserAdmin) await docRef.update({ name: 'Creaticos Group' });
        }
        // Ensure RNC is updated to the real one
        if (settings.rnc === '131-78945-2') {
          settings.rnc = '133-73669-1';
          if (isUserAdmin) await docRef.update({ rnc: '133-73669-1' });
        }
      } else {
        // Futunet migration check
        if (settings.name === 'Futunet' || settings.name === 'Futunet Suministros SRL') {
          settings.name = 'Futunet Suministros';
          if (isUserAdmin) await docRef.update({ name: 'Futunet Suministros' });
        }
        if (settings.rnc === '131-78945-2') {
          settings.rnc = '132-70207-7';
          if (isUserAdmin) await docRef.update({ rnc: '132-70207-7' });
        }
      }
      // Backward compatibility for quote settings
      if (settings.quotePrefix === undefined) settings.quotePrefix = 'COT-';
      if (settings.nextQuoteNum === undefined) settings.nextQuoteNum = 1001;
      if (settings.proformaPrefix === undefined) settings.proformaPrefix = 'PROF-';
      if (settings.nextProformaNum === undefined) settings.nextProformaNum = 1001;
      if (settings.quoteValidityDays === undefined) settings.quoteValidityDays = 15;
      if (settings.minimumMarginPct === undefined) settings.minimumMarginPct = 15;
      if (settings.minimumCostCoveragePct === undefined) settings.minimumCostCoveragePct = 80;
      if (settings.maxOperatorDiscountPct === undefined) settings.maxOperatorDiscountPct = 10;
      if (settings.commercialApprovalEnabled === undefined) settings.commercialApprovalEnabled = true;
      if (settings.collectionReminderDays === undefined) settings.collectionReminderDays = 3;
      if (settings.ncfB14Prefix === undefined) settings.ncfB14Prefix = 'B14';
      if (settings.ncfB14Seq === undefined) settings.ncfB14Seq = 1;
      if (settings.ncfB15Prefix === undefined) settings.ncfB15Prefix = 'B15';
      if (settings.ncfB15Seq === undefined) settings.ncfB15Seq = 1;
      if (settings.ncfB12Prefix === undefined) settings.ncfB12Prefix = 'B12';
      if (settings.ncfB12Seq === undefined) settings.ncfB12Seq = 1;
      if (isPanitas) {
        try {
          settings.restaurantTables = BillingCore.normalizeRestaurantTables(settings.restaurantTables || DEFAULT_RESTAURANT_TABLES);
        } catch (error) {
          settings.restaurantTables = DEFAULT_RESTAURANT_TABLES.slice();
        }
      }
    } else {
      // Default initial settings based on tenant
      if (isCreaticos) {
        settings = {
          name: 'Creaticos Group',
          rnc: '133-73669-1',
          phone: '849-342-8525',
          email: '',
          address: 'Calle 7 Las Colinas, Santiago',
          invoicePrefix: 'CRE-',
          nextInvoiceNum: 1001,
          quotePrefix: 'COT-',
          nextQuoteNum: 1001,
          proformaPrefix: 'PROF-',
          nextProformaNum: 1001,
          ncfB01Prefix: 'B01',
          ncfB01Seq: 1,
          ncfB02Prefix: 'B02',
          ncfB02Seq: 1,
          ncfB14Prefix: 'B14',
          ncfB14Seq: 1,
          ncfB15Prefix: 'B15',
          ncfB15Seq: 1,
          ncfB12Prefix: 'B12',
          ncfB12Seq: 1,
          defaultTax: 18
        };
      } else if (isPanitas) {
        settings = {
          name: 'Los Panitas By Nechy',
          rnc: 'N/D',
          phone: '829-459-7437',
          email: '',
          address: 'C/7, detrás Bomba Texaco, al lado McDonald\'s, Las Colinas, Stgo',
          invoicePrefix: 'PAN-',
          nextInvoiceNum: 1001,
          quotePrefix: 'COT-',
          nextQuoteNum: 1001,
          proformaPrefix: 'PROF-',
          nextProformaNum: 1001,
          ncfB01Prefix: 'B01',
          ncfB01Seq: 1,
          ncfB02Prefix: 'B02',
          ncfB02Seq: 1,
          ncfB14Prefix: 'B14',
          ncfB14Seq: 1,
          ncfB15Prefix: 'B15',
          ncfB15Seq: 1,
          ncfB12Prefix: 'B12',
          ncfB12Seq: 1,
          defaultTax: 0,
          restaurantTables: DEFAULT_RESTAURANT_TABLES.slice()
        };
      } else {
        settings = {
          name: 'Futunet Suministros',
          rnc: '132-70207-7',
          phone: '829-741-1041',
          email: 'ventas@futunet.com.do',
          address: 'Calle 7 Las Colinas, Santiago',
          invoicePrefix: 'FUT-',
          nextInvoiceNum: 1001,
          quotePrefix: 'COT-',
          nextQuoteNum: 1001,
          proformaPrefix: 'PROF-',
          nextProformaNum: 1001,
          ncfB01Prefix: 'B01',
          ncfB01Seq: 1,
          ncfB02Prefix: 'B02',
          ncfB02Seq: 1,
          ncfB14Prefix: 'B14',
          ncfB14Seq: 1,
          ncfB15Prefix: 'B15',
          ncfB15Seq: 1,
          ncfB12Prefix: 'B12',
          ncfB12Seq: 1,
          defaultTax: 18
        };
      }
      // Solo un administrador puede inicializar la configuración persistente.
      // Los demás perfiles pueden abrir el sistema con valores seguros de respaldo.
      if (isUserAdmin) await docRef.set(settings);
    }
    normalizeNcfSettings(settings);

    const legacyRncApiKey = String(settings.rncApiKey || '').trim();
    settings.rncApiKey = '';
    if (isUserAdmin && legacyRncApiKey) {
      try {
        await getDB().collection(collectionSecrets).doc('general').set({ rncApiKey: legacyRncApiKey }, { merge: true });
        await docRef.update({ rncApiKey: firebase.firestore.FieldValue.delete() });
      } catch (secretError) {
        console.warn('No se pudo retirar el token heredado de la configuración pública.', secretError);
      }
    }

    updateBrandingText();
  }

  // Bind settings to UI details
  function updateBrandingText() {
    // Populate header details in printable invoice
    const rncEl = document.getElementById('view-company-rnc');
    const phoneEl = document.getElementById('view-company-phone');
    const emailEl = document.getElementById('view-company-email');
    const addressEl = document.getElementById('view-company-address');
    const nameEl = document.getElementById('view-company-name');

    if (rncEl) rncEl.textContent = settings.rnc || '';
    if (phoneEl) phoneEl.textContent = settings.phone || '';
    if (emailEl) emailEl.textContent = settings.email || '';
    if (addressEl) addressEl.textContent = settings.address || '';
    if (nameEl && !isCreaticos) nameEl.textContent = settings.name || '';

    // Ticket Slogan
    const sloganEl = document.getElementById('view-company-slogan');
    if (sloganEl) {
      if (settings.ticketSlogan) {
        sloganEl.textContent = settings.ticketSlogan;
        sloganEl.style.display = 'block';
      } else {
        sloganEl.style.display = 'none';
      }
    }

    // Ticket Instagram
    const igWrapper = document.getElementById('view-company-instagram-wrapper');
    const igEl = document.getElementById('view-company-instagram');
    if (igWrapper && igEl) {
      if (settings.ticketInstagram) {
        igEl.textContent = '@' + settings.ticketInstagram.replace(/^@/, '');
        igWrapper.style.display = 'block';
      } else {
        igWrapper.style.display = 'none';
      }
    }

    // Ticket Footer Message
    const ticketFooterEl = document.getElementById('view-ticket-footer-message');
    if (ticketFooterEl) {
      if (settings.ticketFooter) {
        ticketFooterEl.textContent = settings.ticketFooter;
        ticketFooterEl.style.display = 'block';
      } else {
        ticketFooterEl.style.display = 'none';
      }
    }
  }

  function showTableSkeletons() {
    const invoicesBody = document.getElementById('invoices-table-body');
    const clientsBody = document.getElementById('clients-table-body');
    const productsBody = document.getElementById('products-table-body');

    if (invoicesBody) {
      invoicesBody.innerHTML = `
        <tr class="skeleton-row">
          <td><div class="skeleton-line" style="width: 80px;"></div></td>
          <td><div class="skeleton-line" style="width: 140px;"></div></td>
          <td><div class="skeleton-line" style="width: 100px;"></div></td>
          <td><div class="skeleton-line" style="width: 90px;"></div></td>
          <td><div class="skeleton-line" style="width: 110px;"></div></td>
          <td><div class="skeleton-line" style="width: 70px;"></div></td>
          <td><div class="skeleton-line" style="width: 60px;"></div></td>
          <td><div class="skeleton-line" style="width: 80px;"></div></td>
        </tr>
      `.repeat(4);
    }
    if (clientsBody) {
      clientsBody.innerHTML = `
        <tr class="skeleton-row">
          <td><div class="skeleton-line" style="width: 150px;"></div></td>
          <td><div class="skeleton-line" style="width: 100px;"></div></td>
          <td><div class="skeleton-line" style="width: 90px;"></div></td>
          <td><div class="skeleton-line" style="width: 120px;"></div></td>
          <td><div class="skeleton-line" style="width: 180px;"></div></td>
          <td><div class="skeleton-line" style="width: 80px;"></div></td>
        </tr>
      `.repeat(4);
    }
    if (productsBody) {
      productsBody.innerHTML = `
        <tr class="skeleton-row">
          <td><div class="skeleton-line" style="width: 180px;"></div></td>
          <td><div class="skeleton-line" style="width: 80px;"></div></td>
          <td><div class="skeleton-line" style="width: 100px;"></div></td>
          <td><div class="skeleton-line" style="width: 120px;"></div></td>
          <td><div class="skeleton-line" style="width: 80px;"></div></td>
        </tr>
      `.repeat(4);
    }
  }

  // Fetch all collections in background
  async function fetchAllDataLegacy() {
    showTableSkeletons();
    try {
      const clientsSnap = await getDB().collection(collectionClients).get();
      clients = [];
      clientsSnap.forEach(doc => {
        clients.push({ id: doc.id, ...doc.data() });
      });

      if (isPanitas) {
        const panitasSnap = await getDB().collection(collectionProducts).get();
        products = [];
        panitasSnap.forEach(doc => {
          products.push({ id: doc.id, ...doc.data(), _isCreaticos: false });
        });
      } else if (isCreaticos) {
        const productsSnap = await getDB().collection('creaticos_products').get();
        creaticosProducts = [];
        productsSnap.forEach(doc => {
          creaticosProducts.push({ id: doc.id, ...doc.data(), _isCreaticos: true });
        });

        const futunetSnap = await getDB().collection('products').get();
        futunetProducts = [];
        futunetSnap.forEach(doc => {
          futunetProducts.push({ id: doc.id, ...doc.data(), _isCreaticos: false });
        });

        // Update active products based on filter selection
        const sourceEl = document.getElementById('products-source-filter');
        const source = sourceEl ? sourceEl.value : (isCreaticos ? 'creaticos' : 'futunet');
        products = source === 'creaticos' ? creaticosProducts : futunetProducts;
      } else {
        const futunetSnap = await getDB().collection('products').get();
        futunetProducts = [];
        creaticosProducts = [];
        futunetSnap.forEach(doc => {
          futunetProducts.push({ id: doc.id, ...doc.data(), _isCreaticos: false });
        });
        products = futunetProducts;
      }

      const invoicesSnap = await getDB().collection(collectionInvoices).orderBy('createdAt', 'desc').get();
      invoices = [];
      invoicesSnap.forEach(doc => {
        invoices.push({ id: doc.id, ...doc.data() });
      });

      const paymentsSnap = await getDB().collection(collectionPayments).orderBy('timestamp', 'desc').get();
      payments = [];
      paymentsSnap.forEach(doc => {
        payments.push({ id: doc.id, ...doc.data() });
      });

      const refundsSnap = await getDB().collection(collectionRefunds).orderBy('timestamp', 'desc').limit(2000).get();
      refunds = [];
      refundsSnap.forEach(doc => {
        refunds.push({ id: doc.id, ...doc.data() });
      });
    } finally {
      // Clear skeletons to stop infinite CPU-intensive background animations
      const invoicesBody = document.getElementById('invoices-table-body');
      const clientsBody = document.getElementById('clients-table-body');
      const productsBody = document.getElementById('products-table-body');
      if (invoicesBody) invoicesBody.innerHTML = '';
      if (clientsBody) clientsBody.innerHTML = '';
      if (productsBody) productsBody.innerHTML = '';
    }
  }

  async function fetchAllData() {
    showTableSkeletons();
    try {
      const database = getDB();
      const productCollections = isPanitas
        ? [collectionProducts]
        : (isCreaticos ? ['creaticos_products', 'products'] : ['products']);
      const invoiceQuery = database.collection(collectionInvoices).orderBy('createdAt', 'desc').limit(DATA_PAGE_SIZE);
      const paymentQuery = database.collection(collectionPayments).orderBy('timestamp', 'desc').limit(PAYMENT_PAGE_SIZE);
      const [clientsSnap, productSnapshots, invoicesSnap, paymentsSnap, refundsSnap] = await Promise.all([
        database.collection(collectionClients).limit(DIRECTORY_CACHE_LIMIT).get(),
        Promise.all(productCollections.map(name => database.collection(name).limit(DIRECTORY_CACHE_LIMIT).get())),
        invoiceQuery.get(),
        paymentQuery.get(),
        database.collection(collectionRefunds).orderBy('timestamp', 'desc').limit(2000).get()
      ]);

      clients = clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      invoices = invoicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      payments = paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      refunds = refundsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      invoiceHistoryCursor = invoicesSnap.docs[invoicesSnap.docs.length - 1] || null;
      paymentHistoryCursor = paymentsSnap.docs[paymentsSnap.docs.length - 1] || null;
      hasMoreInvoiceHistory = invoicesSnap.size === DATA_PAGE_SIZE;
      hasMorePaymentHistory = paymentsSnap.size === PAYMENT_PAGE_SIZE;

      if (isPanitas) {
        products = productSnapshots[0].docs.map(doc => ({ id: doc.id, ...doc.data(), _isCreaticos: false }));
        creaticosProducts = [];
        futunetProducts = [];
      } else if (isCreaticos) {
        creaticosProducts = productSnapshots[0].docs.map(doc => ({ id: doc.id, ...doc.data(), _isCreaticos: true }));
        futunetProducts = productSnapshots[1].docs.map(doc => ({ id: doc.id, ...doc.data(), _isCreaticos: false }));
        const sourceElement = document.getElementById('products-source-filter');
        products = sourceElement && sourceElement.value === 'futunet' ? futunetProducts : creaticosProducts;
      } else {
        creaticosProducts = [];
        futunetProducts = productSnapshots[0].docs.map(doc => ({ id: doc.id, ...doc.data(), _isCreaticos: false }));
        products = futunetProducts;
      }
    } catch (error) {
      console.error('No se pudieron cargar los datos de facturación:', error);
      showToast('No se pudieron cargar todos los datos. Revisa tu conexión y permisos.', 'danger');
      throw error;
    } finally {
      ['invoices-table-body', 'clients-table-body', 'products-table-body'].forEach(id => {
        const body = document.getElementById(id);
        if (body) body.innerHTML = '';
      });
    }
  }

  async function loadMoreBillingHistory() {
    if (!hasMoreInvoiceHistory && !hasMorePaymentHistory) {
      showToast('Ya se cargó todo el historial disponible.', 'info');
      return;
    }
    const loadButton = document.getElementById('btn-load-more-invoices');
    if (loadButton) loadButton.disabled = true;
    try {
      const database = getDB();
      const tasks = [];
      if (hasMoreInvoiceHistory && invoiceHistoryCursor) {
        tasks.push(database.collection(collectionInvoices)
          .orderBy('createdAt', 'desc')
          .startAfter(invoiceHistoryCursor)
          .limit(DATA_PAGE_SIZE)
          .get()
          .then(snapshot => {
            const existing = new Set(invoices.map(item => item.id));
            snapshot.docs.forEach(doc => {
              if (!existing.has(doc.id)) invoices.push({ id: doc.id, ...doc.data() });
            });
            invoiceHistoryCursor = snapshot.docs[snapshot.docs.length - 1] || invoiceHistoryCursor;
            hasMoreInvoiceHistory = snapshot.size === DATA_PAGE_SIZE;
          }));
      }
      if (hasMorePaymentHistory && paymentHistoryCursor) {
        tasks.push(database.collection(collectionPayments)
          .orderBy('timestamp', 'desc')
          .startAfter(paymentHistoryCursor)
          .limit(PAYMENT_PAGE_SIZE)
          .get()
          .then(snapshot => {
            const existing = new Set(payments.map(item => item.id));
            snapshot.docs.forEach(doc => {
              if (!existing.has(doc.id)) payments.push({ id: doc.id, ...doc.data() });
            });
            paymentHistoryCursor = snapshot.docs[snapshot.docs.length - 1] || paymentHistoryCursor;
            hasMorePaymentHistory = snapshot.size === PAYMENT_PAGE_SIZE;
          }));
      }
      await Promise.all(tasks);
      renderInvoicesTable();
      initDashboard();
      if (window.ERPBillingWorkflows) window.ERPBillingWorkflows.refreshKpis();
      showToast('Se agregó el siguiente bloque del historial.', 'success');
    } catch (error) {
      console.error('Unable to load additional billing history', error);
      showToast('No se pudo cargar el historial anterior.', 'danger');
    } finally {
      if (loadButton) loadButton.disabled = false;
    }
  }

  // Setup general DOM action listeners
  function setupEventListeners() {
    const cartItems = document.getElementById('pos-cart-items-list');
    if (cartItems) {
      cartItems.addEventListener('input', event => {
        const noteInput = event.target.closest('[data-pos-item-note]');
        if (noteInput) {
          const index = Number(noteInput.getAttribute('data-pos-item-note'));
          if (Number.isInteger(index) && posCart[index]) {
            posCart[index].notes = noteInput.value.slice(0, 300);
          }
          return;
        }
        const allergyInput = event.target.closest('[data-pos-item-allergy]');
        if (allergyInput) {
          const index = Number(allergyInput.getAttribute('data-pos-item-allergy'));
          if (Number.isInteger(index) && posCart[index]) {
            posCart[index].allergyWarning = allergyInput.checked;
          }
        }
      });
    }

    const refreshTablesButton = document.getElementById('btn-refresh-restaurant-tables');
    if (refreshTablesButton) refreshTablesButton.addEventListener('click', refreshActiveTables);
    const refreshKdsButton = document.getElementById('btn-refresh-kds');
    if (refreshKdsButton) refreshKdsButton.addEventListener('click', refreshKds);
    const cancelTableButton = document.getElementById('btn-cancel-table-order');
    if (cancelTableButton) cancelTableButton.addEventListener('click', cancelCurrentTableOrder);

    window.addEventListener('online', () => {
      if (!unsubscribeRestaurantOrders && isPanitas) startRestaurantRealtime();
      else updateRestaurantConnectionUI();
    });
    window.addEventListener('offline', () => updateRestaurantConnectionUI('offline'));
    window.addEventListener('beforeunload', stopRestaurantRealtime);

    // Autocomplete list close on click outside
    document.addEventListener('click', function (e) {
      const dropdown = document.getElementById('client-autocomplete-dropdown');
      if (dropdown && !e.target.closest('.autocomplete-wrapper')) {
        dropdown.style.display = 'none';
      }
      const posDropdown = document.getElementById('pos-client-autocomplete-list');
      if (posDropdown && !e.target.closest('#pos-client-search')) {
        posDropdown.style.display = 'none';
      }
      // Close all row autocomplete lists
      const rowLists = document.querySelectorAll('.row-autocomplete-list');
      rowLists.forEach(list => {
        if (!e.target.closest('tr') || e.target.closest('tr').id !== list.closest('tr').id) {
          list.style.display = 'none';
        }
      });
    });

    document.addEventListener('keydown', function (event) {
      const modal = document.querySelector('.admin-modal.is-open');
      if (!modal) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal(modal.id);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getModalFocusable(modal);
      if (focusable.length === 0) {
        event.preventDefault();
        modal.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Barcode scanner keyboard wedge global listener
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    window.addEventListener('keypress', (e) => {
      const posContent = document.getElementById('subtab-invoices-pos');
      if (!posContent || !posContent.classList.contains('is-active')) return;

      // Ignore if typing in text inputs (except search/sim inputs)
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        const id = document.activeElement.id;
        if (id !== 'pos-product-search' && id !== 'barcode-simulator-manual') {
          return;
        }
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) {
          handleScannedBarcode(barcodeBuffer);
          barcodeBuffer = '';
          e.preventDefault();
        }
      } else {
        barcodeBuffer += e.key;
      }
    });

    setupRncAutoLookup();
  }

  // Set up listeners for automatic RNC lookup
  function setupRncAutoLookup() {
    if (!isUserAdmin) return;
    const inputs = [
      { rncId: 'form-invoice-client-rnc', nameId: 'form-invoice-client-name', idId: 'form-invoice-client-id', context: 'invoice-form' },
      { rncId: 'form-client-rnc', nameId: 'form-client-name', idId: 'form-client-id', context: 'client-form' }
    ];

    inputs.forEach(cfg => {
      const rncEl = document.getElementById(cfg.rncId);
      if (!rncEl) return;

      // Create a suggestion box container under the input if it doesn't exist
      let sugBox = document.getElementById(cfg.rncId + '-suggestion');
      if (!sugBox) {
        sugBox = document.createElement('div');
        sugBox.id = cfg.rncId + '-suggestion';
        sugBox.className = 'rnc-suggestion-box';
        sugBox.style.display = 'none';
        sugBox.style.fontSize = '0.75rem';
        sugBox.style.marginTop = '4px';
        sugBox.style.padding = '8px 12px';
        sugBox.style.borderRadius = '8px';
        sugBox.style.background = 'rgba(16, 185, 129, 0.1)';
        sugBox.style.border = '1px solid rgba(16, 185, 129, 0.2)';
        sugBox.style.color = '#10b981';
        sugBox.style.fontWeight = '600';
        sugBox.style.cursor = 'pointer';
        sugBox.style.transition = 'all 0.2s';
        rncEl.parentNode.appendChild(sugBox);
      }

      let lastCheckedRnc = '';
      let lookupTimeout = null;

      rncEl.addEventListener('input', function() {
        const cleanRnc = rncEl.value.replace(/[^0-9]/g, '');
        sugBox.style.display = 'none';
        sugBox.innerHTML = '';

        // Format as they type if it's a complete 9-digit RNC or 11-digit Cédula
        if (cleanRnc.length === 9) {
          rncEl.value = cleanRnc.replace(/^(\d{3})(\d{5})(\d{1})$/, '$1-$2-$3');
        } else if (cleanRnc.length === 11) {
          rncEl.value = cleanRnc.replace(/^(\d{3})(\d{7})(\d{1})$/, '$1-$2-$3');
        }

        if (cleanRnc.length !== 9 && cleanRnc.length !== 11) {
          lastCheckedRnc = '';
          if (lookupTimeout) clearTimeout(lookupTimeout);
          return;
        }

        if (cleanRnc === lastCheckedRnc) return;
        lastCheckedRnc = cleanRnc;

        sugBox.style.display = 'block';
        sugBox.style.background = 'rgba(59, 130, 246, 0.1)';
        sugBox.style.border = '1px solid rgba(59, 130, 246, 0.2)';
        sugBox.style.color = '#3b82f6';
        sugBox.innerHTML = '⚡ Consultando DGII...';

        if (lookupTimeout) clearTimeout(lookupTimeout);
        lookupTimeout = setTimeout(async function() {
          try {
            const data = await lookupRncSecure(cleanRnc);
            if (data && !data.error && data.nombre_razon_social) {
              const nombre = data.nombre_razon_social;
              const nombreComercial = data.nombre_comercial ? ` (${data.nombre_comercial})` : '';
              const fullName = nombre + (data.nombre_comercial && data.nombre_comercial !== nombre ? nombreComercial : '');

              sugBox.style.background = 'rgba(16, 185, 129, 0.1)';
              sugBox.style.border = '1px solid rgba(16, 185, 129, 0.2)';
              sugBox.style.color = '#10b981';
              sugBox.innerHTML = `💡 DGII: ${escapeHTML(fullName)} <span style="text-decoration:underline;margin-left:5px;color:var(--primary);">[Haga clic aquí para autocompletar]</span>`;
              sugBox.addEventListener('click', function() {
                const nameEl = document.getElementById(cfg.nameId);
                const idEl = document.getElementById(cfg.idId);
                if (nameEl) nameEl.value = fullName;
                if (idEl) idEl.value = 'custom';
                rncEl.value = data.cedula_rnc || rncEl.value;
                sugBox.style.display = 'none';
              });
            } else {
              sugBox.style.background = 'rgba(239, 68, 68, 0.1)';
              sugBox.style.border = '1px solid rgba(239, 68, 68, 0.2)';
              sugBox.style.color = '#ef4444';
              sugBox.innerHTML = '❌ No encontrado en DGII';
            }
          } catch (err) {
            console.error(err);
            sugBox.style.background = 'rgba(239, 68, 68, 0.1)';
            sugBox.style.border = '1px solid rgba(239, 68, 68, 0.2)';
            sugBox.style.color = '#ef4444';
            sugBox.innerHTML = '❌ Error de consulta DGII';
          }
        }, 300);
      });
    });
  }

  // Switch Panel View
  function switchPanel(panelId) {
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach(p => p.classList.remove('is-active'));
    
    const panel = document.getElementById('panel-' + panelId);
    if (panel) panel.classList.add('is-active');

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Format Currencies
  function formatMoney(amount) {
    return 'RD$ ' + Number(amount || 0).toLocaleString('es-DO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Format Dates
  function formatDate(timestamp) {
    return BillingCore.formatDate(timestamp, 'es-DO');
  }

  function isRevenueInvoice(invoice) {
    return invoice && invoice.docType === 'invoice' && invoice.status !== 'cancelled';
  }

  function isFiscalAdjustment(invoice) {
    return invoice && ['credit_note', 'debit_note'].includes(invoice.docType);
  }

  function invoiceNetTotal(invoice) {
    return BillingCore.roundMoney(
      Number(invoice.total || 0) +
      Number(invoice.debitedAmount || 0) -
      Number(invoice.creditedAmount || 0)
    );
  }

  function invoiceBalance(invoice) {
    if (isFiscalAdjustment(invoice)) return 0;
    const effectivePaid = Number(invoice.paidAmount || 0) - Number(invoice.refundedAmount || 0);
    return Math.max(0, BillingCore.roundMoney(invoiceNetTotal(invoice) - effectivePaid));
  }

  // ═══════════════════════════════════════════
  // 1. DASHBOARD & STATS LÓGICA
  // ═══════════════════════════════════════════
  function timestampToDate(value) {
    if (value && typeof value.toDate === 'function') return value.toDate();
    if (value && Number.isFinite(value.seconds)) return new Date(value.seconds * 1000);
    return BillingCore.parseDateOnly(value);
  }

  function dashboardDateWindow() {
    const filter = document.getElementById('dashboard-period-filter');
    const mode = filter ? filter.value : 'month';
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let start = null;
    if (mode === 'month') start = new Date(now.getFullYear(), now.getMonth(), 1);
    if (mode === '30days') start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    if (mode === 'quarter') start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    if (mode === 'year') start = new Date(now.getFullYear(), 0, 1);
    return { start, end, mode };
  }

  function dateInDashboardWindow(value, windowRange) {
    const date = timestampToDate(value);
    if (!date) return false;
    if (windowRange.start && date < windowRange.start) return false;
    return date <= windowRange.end;
  }

  function adjustmentSignedAmount(document, field = 'total') {
    const amount = Number(document && document[field] || 0);
    if (document && document.docType === 'credit_note') return -amount;
    if (document && document.docType === 'debit_note') return amount;
    return amount;
  }

  function initDashboard() {
    switchPanel('dashboard');

    const windowRange = dashboardDateWindow();
    const periodDocuments = invoices.filter(document =>
      document.status !== 'cancelled' &&
      ['invoice', 'credit_note', 'debit_note'].includes(document.docType) &&
      dateInDashboardWindow(document.date, windowRange)
    );
    const periodInvoices = periodDocuments.filter(document => document.docType === 'invoice');
    const totalBilled = BillingCore.roundMoney(periodDocuments.reduce((sum, document) =>
      sum + adjustmentSignedAmount(document), 0));
    const totalPaid = BillingCore.roundMoney(
      payments.filter(payment => dateInDashboardWindow(payment.timestamp, windowRange))
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0) -
      refunds.filter(refund => dateInDashboardWindow(refund.timestamp, windowRange))
        .reduce((sum, refund) => sum + Number(refund.amount || 0), 0)
    );
    const totalPending = BillingCore.roundMoney(periodInvoices.reduce((sum, invoice) => sum + invoiceBalance(invoice), 0));
    const totalItbis = BillingCore.roundMoney(periodDocuments.reduce((sum, document) =>
      sum + adjustmentSignedAmount(document, 'itbis'), 0));
    const invoiceCount = periodInvoices.length;
    const averageTicket = invoiceCount ? BillingCore.roundMoney(totalBilled / invoiceCount) : 0;
    const overdueTotal = BillingCore.roundMoney(periodInvoices.reduce((sum, invoice) =>
      sum + (BillingCore.isOverdue(invoice.dueDate, invoiceBalance(invoice)) ? invoiceBalance(invoice) : 0), 0));
    const activeClients = new Set(periodInvoices.map(invoice => invoice.clientId || invoice.clientRnc || invoice.clientName).filter(Boolean));

    // Set stats text
    document.getElementById('stat-total-billed').textContent = formatMoney(totalBilled);
    document.getElementById('stat-total-paid').textContent = formatMoney(totalPaid);
    document.getElementById('stat-total-pending').textContent = formatMoney(totalPending);
    document.getElementById('stat-total-clients').textContent = activeClients.size.toString();
    document.getElementById('stat-total-itbis').textContent = formatMoney(totalItbis);
    document.getElementById('stat-average-ticket').textContent = formatMoney(averageTicket);
    document.getElementById('stat-overdue-total').textContent = formatMoney(overdueTotal);
    document.getElementById('stat-invoice-count').textContent = String(invoiceCount);
    const updated = document.getElementById('dashboard-last-updated');
    if (updated) updated.textContent = `Actualizado ${new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}`;

    // Populate recent invoices table
    const recentBody = document.getElementById('db-recent-invoices-body');
    recentBody.innerHTML = '';
    
    const recent = periodInvoices.slice(0, 5);
    if (recent.length === 0) {
      recentBody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">No hay facturas registradas</td></tr>`;
    } else {
      recent.forEach(inv => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => viewInvoice(inv.id));
        tr.innerHTML = `
          <td><strong>${escapeHTML(inv.invoiceNumber)}</strong></td>
          <td>${escapeHTML(inv.clientName)}</td>
          <td style="text-align:right;">${formatMoney(inv.total)}</td>
        `;
        recentBody.appendChild(tr);
      });
    }

    // Build statistics charts
    renderMonthlyChart();
    renderCategoryChart(periodInvoices);
    renderPaymentBreakdown(periodInvoices, windowRange);
  }

  function renderMonthlyChart() {
    const ctx = document.getElementById('chart-billing-trend');
    if (!ctx) return;

    if (dashboardChart) {
      dashboardChart.destroy();
    }

    // Process last 6 months invoice statistics
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlySales = {};

    // Get current last 6 months list
    const labels = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      monthlySales[key] = 0;
      labels.push({ key: key, label: monthNames[d.getMonth()] + ' ' + d.getFullYear() });
    }

    invoices.forEach(inv => {
      if (inv.status === 'cancelled' || !['invoice', 'credit_note', 'debit_note'].includes(inv.docType)) return;
      const date = BillingCore.parseDateOnly(inv.date);
      if (date) {
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (monthlySales[key] !== undefined) {
          monthlySales[key] += adjustmentSignedAmount(inv);
        }
      }
    });

    const data = labels.map(l => monthlySales[l.key]);

    dashboardChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(l => l.label),
        datasets: [{
          label: 'Facturado (RD$)',
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return 'RD$ ' + value.toLocaleString(); }
            }
          }
        }
      }
    });
  }

  function renderCategoryChart(sourceInvoices = invoices.filter(isRevenueInvoice)) {
    const ctx = document.getElementById('chart-category-distribution');
    if (!ctx) return;

    if (categoryChart) {
      categoryChart.destroy();
    }

    const categorySales = {};

    sourceInvoices.forEach(inv => {
      if (!isRevenueInvoice(inv)) return;
      if (Array.isArray(inv.items)) {
        inv.items.forEach(item => {
          const productId = String(item.productId || '');
          const sourceMatch = /^(creaticos|futunet|panitas)_(.+)$/.exec(productId);
          const rawProductId = sourceMatch ? sourceMatch[2] : productId;
          const prod = products.find(p => p.id === rawProductId) ||
                       creaticosProducts.find(p => p.id === rawProductId) ||
                       futunetProducts.find(p => p.id === rawProductId);
          
          let category = 'Otros';
          if (item.categorySnapshot) {
            category = item.categorySnapshot;
          } else if (prod && prod.category) {
            category = prod.category;
          } else if (isPanitas) {
            category = 'Comida';
          } else {
            const isCr = (sourceMatch && sourceMatch[1] === 'creaticos') ||
                         creaticosProducts.some(p => p.id === rawProductId);
            category = isCr ? 'Servicios Creaticos' : 'Servicios Futunet';
          }
          
          category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

          const amount = Number(item.total || (item.price * item.qty)) || 0;
          categorySales[category] = (categorySales[category] || 0) + amount;
        });
      }
    });

    const labels = Object.keys(categorySales);
    const data = Object.values(categorySales);

    if (labels.length === 0) {
      labels.push('Sin Ventas');
      data.push(0);
    }

    const bgColors = [
      'rgba(249, 115, 22, 0.85)',
      'rgba(99, 102, 241, 0.85)',
      'rgba(34, 197, 94, 0.85)',
      'rgba(239, 68, 68, 0.85)',
      'rgba(168, 85, 247, 0.85)',
      'rgba(234, 179, 8, 0.85)'
    ];
    const borderColors = [
      'rgb(249, 115, 22)',
      'rgb(99, 102, 241)',
      'rgb(34, 197, 94)',
      'rgb(239, 68, 68)',
      'rgb(168, 85, 247)',
      'rgb(234, 179, 8)'
    ];

    categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: bgColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        }
      }
    });
  }

  function renderPaymentBreakdown(sourceInvoices = invoices.filter(isRevenueInvoice), windowRange = dashboardDateWindow()) {
    let cashSales = 0;
    let cardSales = 0;
    let transferSales = 0;
    let creditSales = 0;
    let otherSales = 0;

    const validInvoiceIds = new Set(sourceInvoices.map(invoice => invoice.id));
    payments.forEach(pay => {
      if (!validInvoiceIds.has(pay.invoiceId) || !dateInDashboardWindow(pay.timestamp, windowRange)) return;
      const method = BillingCore.paymentMethodGroup(pay.method || 'Efectivo');
      const amount = Number(pay.amount || 0);

      if (method === 'cash') {
        cashSales += amount;
      } else if (method === 'card') {
        cardSales += amount;
      } else if (method === 'transfer') {
        transferSales += amount;
      } else {
        otherSales += amount;
      }
    });

    sourceInvoices.forEach(inv => {
      const balance = invoiceBalance(inv);
      if (balance > 0) creditSales += balance;
    });

    const cashEl = document.getElementById('db-ops-cash');
    const cardEl = document.getElementById('db-ops-card');
    const transferEl = document.getElementById('db-ops-transfer');
    const creditEl = document.getElementById('db-ops-credit');
    const otherEl = document.getElementById('db-ops-other');

    if (cashEl) cashEl.textContent = formatMoney(cashSales);
    if (cardEl) cardEl.textContent = formatMoney(cardSales);
    if (transferEl) transferEl.textContent = formatMoney(transferSales);
    if (creditEl) creditEl.textContent = formatMoney(creditSales);
    if (otherEl) otherEl.textContent = formatMoney(otherSales);
  }

  // ═══════════════════════════════════════════
  // 2. FACTURAS (INVOICES) CRUD & LOGIC
  // ═══════════════════════════════════════════
  function renderInvoicesTable() {
    switchPanel('invoices');

    const startDateVal = document.getElementById('filter-invoice-start-date').value;
    const endDateVal = document.getElementById('filter-invoice-end-date').value;
    const statusFilter = document.getElementById('invoice-status-filter').value;
    const ncfFilter = document.getElementById('invoice-ncf-filter').value;
    const searchVal = document.getElementById('invoice-search').value.toLowerCase().trim();

    // Filter array
    let filtered = invoices.filter(inv => {
      // 1. Status Filter
      let matchStatus = true;
      if (statusFilter !== 'all') {
        matchStatus = statusFilter === 'quote' || statusFilter === 'proforma'
          ? inv.docType === statusFilter
          : inv.status === statusFilter;
      }

      // 2. NCF Filter
      let matchNcf = true;
      if (ncfFilter !== 'all') {
        if (ncfFilter === 'none') {
          matchNcf = !inv.ncf || inv.ncf === '';
        } else {
          matchNcf = inv.ncf && inv.ncf.startsWith(ncfFilter);
        }
      }

      // 3. Date Filter
      let matchDate = true;
      let invDate = null;
      if (inv.date) {
        invDate = BillingCore.parseDateOnly(inv.date);
      }
      if (invDate) {
        invDate.setHours(0,0,0,0);
        if (startDateVal) {
          const startDate = BillingCore.parseDateOnly(startDateVal);
          startDate.setHours(0,0,0,0);
          if (invDate < startDate) matchDate = false;
        }
        if (endDateVal) {
          const endDate = BillingCore.parseDateOnly(endDateVal);
          endDate.setHours(0,0,0,0);
          if (invDate > endDate) matchDate = false;
        }
      } else if (startDateVal || endDateVal) {
        matchDate = false;
      }

      // 4. Search Filter
      let matchSearch = true;
      if (searchVal) {
        const clientName = (inv.clientName || '').toLowerCase();
        const clientRnc = (inv.clientRnc || '').toLowerCase();
        const invoiceNum = (inv.invoiceNumber || '').toLowerCase();
        const ncfVal = (inv.ncf || '').toLowerCase();
        matchSearch = clientName.includes(searchVal) ||
                      clientRnc.includes(searchVal) ||
                      invoiceNum.includes(searchVal) ||
                      ncfVal.includes(searchVal);
      }

      return matchStatus && matchNcf && matchDate && matchSearch;
    });

    // Pagination bounds
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / invoicePageSize) || 1;
    if (invoiceCurrentPage > totalPages) invoiceCurrentPage = totalPages;

    const startIdx = (invoiceCurrentPage - 1) * invoicePageSize;
    const paginated = filtered.slice(startIdx, startIdx + invoicePageSize);

    const tbody = document.getElementById('invoices-table-body');
    tbody.innerHTML = '';

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:32px;">No se encontraron facturas.</td></tr>`;
      document.getElementById('invoices-pagination').innerHTML = '';
      return;
    }

    paginated.forEach(inv => {
      const tr = document.createElement('tr');
      
      let statusBadge = '';
      if (inv.docType === 'quote') {
        const workflow = BillingCore.quoteWorkflowMeta(inv.workflowStatus, inv.validUntil || inv.dueDate);
        statusBadge = `<span class="admin-badge commercial-status is-${workflow.tone}">${escapeHTML(workflow.label)}</span>`;
      } else if (inv.docType === 'proforma') {
        const workflow = BillingCore.quoteWorkflowMeta(inv.workflowStatus, inv.validUntil || inv.dueDate);
        statusBadge = `<span class="admin-badge commercial-status is-${workflow.tone}">${escapeHTML(workflow.label)}</span>`;
      } else if (inv.docType === 'credit_note') {
        statusBadge = '<span class="admin-badge badge-credit">Nota de crédito</span>';
      } else if (inv.docType === 'debit_note') {
        statusBadge = '<span class="admin-badge badge-partial">Nota de débito</span>';
      } else if (inv.status === 'paid') {
        statusBadge = '<span class="admin-badge badge-paid">Pagada</span>';
      } else if (inv.status === 'pending' || inv.status === 'unpaid' || inv.status === 'partial') {
        const balanceValue = invoiceBalance(inv);
        const overdue = BillingCore.isOverdue(inv.dueDate, balanceValue);
        statusBadge = overdue
          ? '<span class="admin-badge badge-overdue">Vencida</span>' 
          : inv.status === 'partial'
            ? '<span class="admin-badge badge-partial">Abono parcial</span>'
            : inv.status === 'unpaid'
              ? '<span class="admin-badge badge-credit">A crédito</span>'
              : '<span class="admin-badge badge-pending">Pendiente</span>';
      } else if (inv.status === 'cancelled') {
        statusBadge = '<span class="admin-badge badge-cancelled">Anulada</span>';
      } else if (inv.status === 'converted') {
        statusBadge = '<span class="admin-badge badge-converted">Convertida</span>';
      }

      const balance = invoiceBalance(inv);

      let actionsHtml = `
        <div class="table-actions">
          <button class="table-btn table-btn-primary" title="Ver Detalle" data-erp-click="ERPBilling.viewInvoice('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="table-btn table-btn-secondary" title="Imprimir / PDF" data-erp-click="ERPBilling.printInvoiceDirectly('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          </button>
          <button class="table-btn table-btn-secondary" title="Duplicar documento" data-erp-click="ERPBilling.duplicateDocument('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
          </button>
          <button class="table-btn table-btn-secondary" title="Historial del documento" data-erp-click="ERPBillingWorkflows.openHistoryDialog('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>
          </button>
      `;

      if (inv.status !== 'cancelled' && inv.status !== 'converted' && !isFiscalAdjustment(inv)) {
        const canEdit = ((inv.docType === 'quote' || inv.docType === 'proforma') && !['accepted', 'converted'].includes(inv.workflowStatus)) ||
          (inv.docType === 'invoice' && !inv.ncf && Number(inv.paidAmount || 0) === 0);
        if (canEdit) actionsHtml += `
          <button class="table-btn table-btn-secondary" title="Editar" data-erp-click="ERPBilling.editQuote('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
          </button>
        `;

        if (inv.docType === 'quote' || inv.docType === 'proforma') {
          actionsHtml += `
            <button class="table-btn table-btn-secondary" title="Compartir y solicitar aceptación" data-erp-click="ERPBillingWorkflows.openShareDialog('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>
            </button>
            <button class="table-btn table-btn-success" title="Convertir a Factura" data-erp-click="ERPBilling.convertQuoteFromList('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          `;
        } else if (inv.docType === 'invoice' && balance > 0) {
          actionsHtml += `
            <button class="table-btn table-btn-success" title="Registrar Cobro" data-erp-click="ERPBilling.openRegisterPaymentFromList('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 14h.01M10 14h.01"/></svg>
            </button>
          `;
        }

        if (isUserAdmin && inv.docType === 'invoice') actionsHtml += `
          <button class="table-btn table-btn-secondary" title="Crear nota de crédito o débito" data-erp-click="ERPBilling.openFiscalAdjustment('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></svg>
          </button>
          <button class="table-btn table-btn-danger" title="Anular Factura" data-erp-click="ERPBilling.cancelInvoice('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          </button>
        `;
      }

      actionsHtml += `</div>`;

      tr.innerHTML = `
        <td><strong>${escapeHTML(inv.invoiceNumber)}</strong></td>
        <td>${escapeHTML(inv.clientName)}</td>
        <td>${escapeHTML(formatDate(inv.date))}</td>
        <td>${escapeHTML(formatDate(inv.dueDate))}</td>
        <td>${inv.ncf ? escapeHTML(inv.ncf) : '<span style="color:#cbd5e1;font-size:0.8rem;">Ninguno</span>'}</td>
        <td title="${Number(inv.creditedAmount || 0) || Number(inv.debitedAmount || 0) ? 'Total neto después de ajustes fiscales' : 'Total del documento'}">${escapeHTML(formatMoney(isFiscalAdjustment(inv) ? inv.total : invoiceNetTotal(inv)))}</td>
        <td>${statusBadge}</td>
        <td>${actionsHtml}</td>
      `;
      tbody.appendChild(tr);
    });

    renderPaginationControls(totalPages);
  }

  function renderPaginationControls(totalPages) {
    const container = document.getElementById('invoices-pagination');
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'admin-pagination';
    
    div.innerHTML = `
      <button class="pagination-btn" id="btn-page-prev" ${invoiceCurrentPage === 1 ? 'disabled' : ''}>Anterior</button>
      <span style="font-size: 0.85rem; font-weight: 500; color:var(--text-muted);">Pág. ${invoiceCurrentPage} de ${totalPages}</span>
      <button class="pagination-btn" id="btn-page-next" ${invoiceCurrentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
      ${hasMoreInvoiceHistory || hasMorePaymentHistory ? '<button class="pagination-btn pagination-load-more" id="btn-load-more-invoices" type="button">Cargar historial anterior</button>' : ''}
    `;

    container.appendChild(div);

    document.getElementById('btn-page-prev').addEventListener('click', () => {
      if (invoiceCurrentPage > 1) {
        invoiceCurrentPage--;
        renderInvoicesTable();
      }
    });
    document.getElementById('btn-page-next').addEventListener('click', () => {
      if (invoiceCurrentPage < totalPages) {
        invoiceCurrentPage++;
        renderInvoicesTable();
      }
    });
    const loadMoreButton = document.getElementById('btn-load-more-invoices');
    if (loadMoreButton) loadMoreButton.addEventListener('click', loadMoreBillingHistory);
  }

  // Reset form helper
  function clearInvoiceForm() {
    editingInvoiceId = null;
    editingInvoiceNumber = null;
    conversionSourceId = null;

    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = '';
    document.getElementById('form-invoice-client-id').value = '';
    document.getElementById('form-invoice-client-rnc').value = '';
    
    // Set default dates
    const today = new Date();
    const todayStr = BillingCore.toLocalDateInput(today);
    document.getElementById('form-invoice-date').value = todayStr;
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    document.getElementById('form-invoice-due-date').value = BillingCore.toLocalDateInput(dueDate);

    document.getElementById('form-invoice-ncf-type').value = 'none';
    document.getElementById('form-invoice-ncf').value = '';
    document.getElementById('form-invoice-ncf').setAttribute('readonly', 'true');

    // Reset division
    const divisionSelect = document.getElementById('form-invoice-division');
    if (divisionSelect) divisionSelect.value = 'general';

    // Reset doc type
    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = 'invoice';
      handleDocTypeChange('invoice');
    }

    // Reset payment terms, notes, and discount
    const paymentTermsSelect = document.getElementById('form-invoice-payment-terms');
    if (paymentTermsSelect) paymentTermsSelect.value = 'Contado';

    const invoiceNotesInput = document.getElementById('form-invoice-notes');
    if (invoiceNotesInput) invoiceNotesInput.value = '';

    const discountPctInput = document.getElementById('form-invoice-discount-pct');
    if (discountPctInput) discountPctInput.value = 0;

    // Clean body table
    const tbody = document.getElementById('invoice-form-items-body');
    if (tbody) tbody.innerHTML = '';

    // Add first row
    addInvoiceFormItemRow();
  }

  // Reset form and view Create Panel
  function openNewInvoiceForm() {
    clearInvoiceForm();
    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    
    const titleEl = document.getElementById('invoice-form-title');
    if (titleEl) titleEl.textContent = 'Crear Nueva Factura';

    const submitBtn = document.querySelector('#invoice-editor-form button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Guardar Factura';
  }

  function handleDocTypeChange(val) {
    const ncfTypeSelect = document.getElementById('form-invoice-ncf-type');
    const ncfInput = document.getElementById('form-invoice-ncf');
    const docNotes = document.getElementById('form-invoice-doc-notes');

    if (val === 'quote' || val === 'proforma') {
      ncfTypeSelect.value = 'none';
      ncfTypeSelect.setAttribute('disabled', 'true');
      ncfInput.value = '';
      ncfInput.setAttribute('readonly', 'true');
      if (docNotes) {
        docNotes.innerHTML = val === 'quote'
          ? '📝 <strong>Modo Cotización:</strong> No se generan NCFs ni se afecta la contabilidad de ingresos reales.'
          : '📄 <strong>Modo Factura Proforma:</strong> Borrador formalizado sin validez fiscal ni NCF. Útil previo a emitir la factura final.';
      }
    } else {
      ncfTypeSelect.removeAttribute('disabled');
      if (docNotes) {
        docNotes.innerHTML = 'Crea facturas comerciales estándar o presupuestos informativos para tus clientes.';
      }
      handleNcfTypeChange(ncfTypeSelect.value);
    }
  }

  // Dynamic row additions in Invoice Creator Form
  function addInvoiceFormItemRow(itemData = null) {
    const tbody = document.getElementById('invoice-form-items-body');
    const tr = document.createElement('tr');
    
    const rowId = 'row-' + Date.now() + '-' + Math.floor(Math.random()*1000);
    tr.id = rowId;

    let rowTaxAmount = 0.00;
    let overrideStr = 'false';
    let taxPercent = settings ? Number(settings.defaultTax) : 18;
    if (itemData) {
      const resolvedTax = BillingCore.resolveLineTax(itemData);
      rowTaxAmount = resolvedTax.amount;
      overrideStr = resolvedTax.mode === 'amount' ? 'true' : 'false';
      taxPercent = resolvedTax.rate;
    }

    tr.innerHTML = `
      <td>
        <div class="autocomplete-wrapper" style="position:relative; margin-bottom:4px;">
          <input type="text" class="form-input row-product-search" placeholder="Escribe para buscar..." data-erp-input="ERPBilling.searchRowProductAutocomplete(this, '${rowId}')" value="${itemData ? escapeAttr(itemData.description) : ''}" required autocomplete="off" />
          <input type="hidden" class="row-product-id" value="${itemData ? itemData.productId : 'custom'}" />
          <input type="hidden" class="row-cost" value="${itemData && itemData.unitCost != null ? escapeAttr(String(itemData.unitCost)) : ''}" />
          <div class="autocomplete-dropdown row-autocomplete-list" style="display:none; position:absolute; left:0; right:0; z-index:100; max-height:200px; overflow-y:auto; background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px;"></div>
        </div>
      </td>
      <td>
        <input type="number" class="form-input row-price" step="0.01" min="0" value="${itemData ? itemData.price : '0.00'}" required data-erp-input="ERPBilling.handleRowPriceQtyChange(this)" />
      </td>
      <td>
        <input type="number" class="form-input row-qty" min="1" value="${itemData ? itemData.qty : '1'}" required data-erp-input="ERPBilling.handleRowPriceQtyChange(this)" />
      </td>
      <td>
        <input type="number" class="form-input row-tax" step="0.01" min="0" value="${rowTaxAmount.toFixed(2)}" data-erp-input="ERPBilling.handleRowTaxChange(this)" data-override="${overrideStr}" data-percent="${taxPercent}" />
      </td>
      <td>
        <input type="number" class="form-input row-discount" min="0" max="100" value="${itemData && itemData.discount ? itemData.discount : '0'}" data-erp-input="ERPBilling.handleRowPriceQtyChange(this)" style="text-align: right;" />
      </td>
      <td style="text-align:right; font-weight:600; padding-right:10px;" class="row-total">RD$ 0.00</td>
      <td>
        <button type="button" class="table-btn table-btn-danger" title="Quitar Fila" data-erp-click="ERPBilling.deleteInvoiceFormItemRow('${rowId}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    
    calculateInvoiceFormTotals();
  }

  // Quitar fila
  function deleteInvoiceFormItemRow(rowId) {
    const tr = document.getElementById(rowId);
    if (tr) {
      tr.remove();
      calculateInvoiceFormTotals();
    }
  }

  // Row autocomplete search
  function searchRowProductAutocomplete(input, rowId) {
    const tr = document.getElementById(rowId);
    if (!tr) return;

    const listEl = tr.querySelector('.row-autocomplete-list');
    const idInput = tr.querySelector('.row-product-id');
    if (!listEl) return;

    const val = input.value.trim();
    if (!val) {
      listEl.style.display = 'none';
      idInput.value = 'custom';
      return;
    }

    const allProds = isPanitas
      ? products.map(p => ({ ...p, _src: 'panitas' }))
      : [].concat(
          creaticosProducts.map(p => ({ ...p, _src: 'creaticos' })),
          futunetProducts.map(p => ({ ...p, _src: 'futunet' }))
        );

    const seen = new Set();
    const uniqueProds = allProds.filter(p => {
      if (p.isActive === false) return false;
      const compositeId = p._src + '_' + p.id;
      if (seen.has(compositeId)) return false;
      seen.add(compositeId);
      return true;
    });

    const matches = uniqueProds.filter(p => {
      const name = (p.name || p.title || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const ref = (p.reference || '').toLowerCase();
      const barcode = (p.barcode || '').toLowerCase();
      
      return name.includes(val.toLowerCase()) || 
             sku.includes(val.toLowerCase()) || 
             ref.includes(val.toLowerCase()) || 
             barcode.includes(val.toLowerCase());
    });

    listEl.innerHTML = '';
    listEl.style.display = 'block';

    matches.slice(0, 10).forEach(p => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.padding = '8px 12px';
      item.style.cursor = 'pointer';
      item.style.borderBottom = '1px solid var(--border-color)';
      item.style.fontSize = '0.82rem';

      const pName = p.name || p.title || '';
      const pPrice = isNaN(Number(p.price)) ? 0 : Number(p.price);
      const srcLabel = p._src === 'creaticos' ? 'Creaticos' : (p._src === 'panitas' ? 'Los Panitas' : 'Futunet');
      const codeLabel = p.sku ? ` [SKU: ${p.sku}]` : '';

      item.textContent = `${pName} (${formatMoney(pPrice)}) - ${srcLabel}${codeLabel}`;
      
      item.addEventListener('click', () => {
        input.value = pName;
        idInput.value = p._src + '_' + p.id;
        
        const priceInput = tr.querySelector('.row-price');
        const taxInput = tr.querySelector('.row-tax');
        const costInput = tr.querySelector('.row-cost');

        if (priceInput) priceInput.value = pPrice.toFixed(2);
        if (costInput) costInput.value = p.cost != null && Number.isFinite(Number(p.cost)) ? Number(p.cost).toFixed(2) : '';
        if (taxInput) {
          const productTaxPercent = (p.tax !== undefined) ? Number(p.tax) : 18;
          const qty = Number(tr.querySelector('.row-qty').value) || 1;
          taxInput.value = (pPrice * qty * (productTaxPercent / 100)).toFixed(2);
          taxInput.dataset.override = 'false';
          taxInput.dataset.percent = String(productTaxPercent);
        }

        listEl.style.display = 'none';
        calculateInvoiceFormTotals();
      });
      listEl.appendChild(item);
    });

    const customItem = document.createElement('div');
    customItem.className = 'autocomplete-item';
    customItem.style.padding = '8px 12px';
    customItem.style.cursor = 'pointer';
    customItem.style.borderBottom = '1px solid var(--border-color)';
    customItem.style.fontSize = '0.82rem';
    customItem.style.fontWeight = '600';
    customItem.style.color = 'var(--text-muted)';
    customItem.textContent = `✏️ Usar concepto temporal: "${val}"`;
    customItem.addEventListener('click', () => {
      idInput.value = 'custom';
      listEl.style.display = 'none';
    });
    listEl.appendChild(customItem);

    if (!isUserAdmin) return;

    const createItem = document.createElement('div');
    createItem.className = 'autocomplete-item';
    createItem.style.padding = '8px 12px';
    createItem.style.cursor = 'pointer';
    createItem.style.fontSize = '0.82rem';
    createItem.style.fontWeight = '600';
    createItem.style.color = 'var(--primary)';
    createItem.textContent = `➕ Crear nuevo producto: "${val}"`;
    createItem.addEventListener('click', () => {
      listEl.style.display = 'none';
      localStorage.setItem('redirect_product_invoice_row', rowId);
      localStorage.setItem('redirect_product_invoice_name', val);

      switchPanel('products');
      switchSubTab('products', 'form');
      openNewProductForm();
      
      const formNameInput = document.getElementById('form-product-name');
      if (formNameInput) {
        formNameInput.value = val;
      }
    });
    listEl.appendChild(createItem);
  }

  // Calculate Subtotal, Taxes, and Totals inside creation form
  function calculateInvoiceFormTotals() {
    const tbody = document.getElementById('invoice-form-items-body');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');

    const rawItems = [];
    rows.forEach(tr => {
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const lineItbis = Number(tr.querySelector('.row-tax').value) || 0;
      const taxInput = tr.querySelector('.row-tax');
      const discountInput = tr.querySelector('.row-discount');
      const discountPct = discountInput ? (Number(discountInput.value) || 0) : 0;
      rawItems.push({
        price,
        qty,
        discount: discountPct,
        unitCost: tr.querySelector('.row-cost') ? tr.querySelector('.row-cost').value : '',
        tax: lineItbis,
        taxMode: taxInput && taxInput.dataset.override === 'true' ? 'amount' : 'rate',
        taxRate: taxInput ? Number(taxInput.dataset.percent) || 0 : 0
      });
    });

    const globalDiscountPctInput = document.getElementById('form-invoice-discount-pct');
    const globalDiscountPct = globalDiscountPctInput ? (Number(globalDiscountPctInput.value) || 0) : 0;
    const calculated = BillingCore.calculateInvoiceTotals(rawItems, globalDiscountPct);
    rows.forEach((tr, index) => {
      const totalCol = tr.querySelector('.row-total');
      if (totalCol && calculated.items[index]) totalCol.textContent = formatMoney(calculated.items[index].total);
    });

    const subtotalEl = document.getElementById('form-summary-subtotal');
    const discountEl = document.getElementById('form-summary-discount');
    const itbisEl = document.getElementById('form-summary-itbis');
    const totalEl = document.getElementById('form-summary-total');

    if (subtotalEl) subtotalEl.textContent = formatMoney(calculated.subtotal);
    if (discountEl) discountEl.textContent = formatMoney(calculated.discountAmount);
    if (itbisEl) itbisEl.textContent = formatMoney(calculated.itbis);
    if (totalEl) totalEl.textContent = formatMoney(calculated.total);
    if (window.ERPBillingWorkflows) {
      window.ERPBillingWorkflows.updateFormCommercialMetrics(rawItems, globalDiscountPct);
    }
  }

  // Client Auto-Complete Dropdown Search
  function searchClientAutocomplete(val) {
    const dropdown = document.getElementById('client-autocomplete-dropdown');
    dropdown.innerHTML = '';

    if (!val) {
      dropdown.style.display = 'none';
      return;
    }

    const cleanVal = val.replace(/[^0-9]/g, '');
    const filtered = clients.filter(c => {
      const matchName = c.name.toLowerCase().includes(val.toLowerCase());
      const matchRnc = c.rnc && c.rnc.replace(/[^0-9]/g, '').includes(cleanVal);
      return matchName || (cleanVal.length > 0 && matchRnc);
    });
    
    // Add DGII query options if the typed value looks like an RNC (9 or 11 digits)
    if (cleanVal.length === 9 || cleanVal.length === 11) {
      const dgiiItem = document.createElement('div');
      dgiiItem.className = 'autocomplete-item';
      dgiiItem.style.fontWeight = 'bold';
      dgiiItem.style.color = 'var(--primary)';
      dgiiItem.innerHTML = `<span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg> 🔍 Consultar RNC "${cleanVal}" en DGII</span>`;
      dgiiItem.addEventListener('click', function() {
        dropdown.style.display = 'none';
        searchClientByRnc(cleanVal, 'invoice-form');
      });
      dropdown.appendChild(dgiiItem);
    }

    if (filtered.length === 0) {
      // Option to quickly register a new client
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.fontWeight = 'bold';
      item.style.color = 'var(--primary)';
      item.innerHTML = `<span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg> + Registrar "${escapeHTML(val)}" como nuevo cliente</span>`;
      item.addEventListener('click', function() {
        dropdown.style.display = 'none';
        openNewClientForm(val);
      });
      dropdown.appendChild(item);
    } else {
      filtered.forEach(c => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = `${c.name} ${c.rnc ? `(RNC: ${c.rnc})` : ''}`;
        item.addEventListener('click', function() {
          document.getElementById('form-invoice-client-name').value = c.name;
          document.getElementById('form-invoice-client-id').value = c.id;
          document.getElementById('form-invoice-client-rnc').value = c.rnc || 'No registrado';
          dropdown.style.display = 'none';
        });
        dropdown.appendChild(item);
      });
    }

    dropdown.style.display = 'block';
  }
  function handleNcfTypeChange(type) {
    const ncfInput = document.getElementById('form-invoice-ncf');
    if (type === 'none') {
      ncfInput.value = '';
      ncfInput.setAttribute('readonly', 'true');
    } else if (type === 'manual') {
      ncfInput.value = '';
      ncfInput.removeAttribute('readonly');
      ncfInput.focus();
    } else if (NCF_FIELDS[type]) {
      ncfInput.setAttribute('readonly', 'true');
      try {
        const range = BillingCore.assertNcfRangeAvailable(settings, type, BillingCore.toLocalDateInput());
        ncfInput.value = buildNcfFromSettings(settings, type);
        if (range.low) {
          showToast(`Quedan ${range.remaining} comprobantes disponibles en el rango ${type}.`, 'warning');
        }
      } catch (error) {
        ncfInput.value = '';
        showToast(error.message, 'danger');
      }
    }
  }

  // Submit and Save Invoice
  async function saveInvoice(e) {
    e.preventDefault();
    let savedDocumentId = editingInvoiceId || '';
    const wasEditing = Boolean(editingInvoiceId);
    const savedConversionSourceId = conversionSourceId || '';
    const submitButton = e.submitter || document.querySelector('#invoice-editor-form button[type="submit"]');
    if (submitButton && submitButton.disabled) return;
    const originalButtonText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Guardando...';
    }

    try {

    const docType = document.getElementById('form-invoice-doc-type').value;
    let clientId = document.getElementById('form-invoice-client-id').value;
    const clientName = document.getElementById('form-invoice-client-name').value.trim();
    const clientRnc = document.getElementById('form-invoice-client-rnc').value.trim();
    
    if (!clientName) {
      showToast('Por favor, introduce el nombre del cliente.', 'warning');
      return;
    }
    if (!clientId) {
      clientId = 'custom';
    }

    const date = document.getElementById('form-invoice-date').value;
    const dueDate = document.getElementById('form-invoice-due-date').value;
    const ncfType = document.getElementById('form-invoice-ncf-type').value;
    const ncf = document.getElementById('form-invoice-ncf').value.trim();

    if (!['invoice', 'quote', 'proforma'].includes(docType) || !date || !dueDate) {
      showToast('Completa el tipo de documento y las fechas requeridas.', 'danger');
      return;
    }
    if (dueDate < date) {
      showToast('La fecha de vencimiento no puede ser anterior a la fecha de emisión.', 'danger');
      return;
    }
    if (docType === 'invoice' && ncfType === 'manual' && !BillingCore.isValidNcf(ncf, { allowElectronic: false })) {
      showToast('El NCF manual debe ser un comprobante físico válido de 11 posiciones. Los e-CF se emiten únicamente mediante la integración certificada.', 'danger');
      return;
    }
    if (docType === 'invoice' && ncfType === 'manual' && invoices.some(invoice => invoice.id !== editingInvoiceId && invoice.ncf === ncf)) {
      showToast('Ese NCF ya está asociado a otro documento.', 'danger');
      return;
    }
    
    const divisionEl = document.getElementById('form-invoice-division');
    const division = divisionEl ? divisionEl.value : 'general';

    // Check if items table is empty
    const tbody = document.getElementById('invoice-form-items-body');
    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) {
      showToast('Debes agregar al menos un ítem al documento.', 'warning');
      return;
    }

    // Build items object list
    const items = [];
    let subtotal = 0;
    let totalItbis = 0;
    let totalRowDiscount = 0;

    for (let tr of rows) {
      const searchInput = tr.querySelector('.row-product-search');
      const productIdInput = tr.querySelector('.row-product-id');
      const description = searchInput ? searchInput.value.trim() : '';
      const price = Number(tr.querySelector('.row-price').value);
      const qty = Number(tr.querySelector('.row-qty').value);
      const lineTax = Number(tr.querySelector('.row-tax').value);
      const unitCostInput = tr.querySelector('.row-cost');
      const unitCost = unitCostInput && unitCostInput.value !== '' ? Number(unitCostInput.value) : null;
      
      const discountInput = tr.querySelector('.row-discount');
      const discountPct = discountInput ? Number(discountInput.value) : 0;

      if (!description) {
        showToast('Todos los ítems agregados deben tener una descripción.', 'danger');
        return;
      }
      if (!Number.isFinite(price) || price < 0 || !Number.isFinite(qty) || qty <= 0 ||
          !Number.isFinite(lineTax) || lineTax < 0 || !Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100 ||
          (unitCost !== null && (!Number.isFinite(unitCost) || unitCost < 0))) {
        showToast('Revisa precio, cantidad, ITBIS y descuento de cada artículo.', 'danger');
        return;
      }

      const lineSub = price * qty;
      const lineDiscount = lineSub * (discountPct / 100);

      items.push({
        productId: productIdInput ? productIdInput.value : 'custom',
        description: description,
        categorySnapshot: productCategorySnapshot(productIdInput ? productIdInput.value : 'custom'),
        price: price,
        qty: qty,
        tax: lineTax,
        taxMode: tr.querySelector('.row-tax').dataset.override === 'true' ? 'amount' : 'rate',
        taxRate: Number(tr.querySelector('.row-tax').dataset.percent) || 0,
        discount: discountPct,
        unitCost,
        total: lineSub - lineDiscount + lineTax
      });

      subtotal += lineSub;
      totalItbis += lineTax;
      totalRowDiscount += lineDiscount;
    }

    const globalDiscountPctEl = document.getElementById('form-invoice-discount-pct');
    const globalDiscountPct = globalDiscountPctEl ? (Number(globalDiscountPctEl.value) || 0) : 0;
    const calculatedTotals = BillingCore.calculateInvoiceTotals(items, globalDiscountPct);
    items.splice(0, items.length, ...calculatedTotals.items);
    subtotal = calculatedTotals.subtotal;
    totalItbis = calculatedTotals.itbis;
    totalRowDiscount = calculatedTotals.rowDiscountAmount;
    const totalDiscountAmount = calculatedTotals.discountAmount;
    const grandTotal = calculatedTotals.total;
    if (!Number.isFinite(grandTotal) || grandTotal <= 0) {
      showToast('El total del documento debe ser mayor que cero.', 'danger');
      return;
    }

    const cleanClientId = clientRnc.replace(/\D/g, '');
    if (docType === 'invoice' && ['B01', 'B12', 'B14', 'B15'].includes(ncfType) && ![9, 11].includes(cleanClientId.length)) {
      showToast('Este tipo de comprobante requiere un RNC o cédula válido.', 'danger');
      return;
    }
    if (docType === 'invoice' && ncfType === 'B02' && grandTotal >= 250000 && ![9, 11].includes(cleanClientId.length)) {
      showToast('Las facturas de consumo desde RD$250,000 requieren la identificación del cliente.', 'danger');
      return;
    }
    
    // Generate document ID number
    let invoiceNum = '';
    let status = 'pending';
    let paidAmount = 0;
    
    if (editingInvoiceId) {
      invoiceNum = editingInvoiceNumber || editingInvoiceId;
      status = docType === 'quote' ? 'quote' : (docType === 'proforma' ? 'proforma' : 'pending');
      const originalDoc = invoices.find(i => i.id === editingInvoiceId);
      if (originalDoc) {
        const origDocType = originalDoc.docType || originalDoc.type || docType;
        if (origDocType !== docType) {
          showToast('El tipo de un documento existente no puede cambiarse. Usa la opción Convertir.', 'danger');
          return;
        }
        if (['accepted', 'converted'].includes(originalDoc.workflowStatus)) {
          showToast('Una cotización aceptada o convertida está bloqueada. Duplica el documento para crear una nueva versión comercial.', 'warning');
          return;
        }
        if (originalDoc.docType === 'invoice' && (originalDoc.inventoryPostedAt || originalDoc.ncf || Number(originalDoc.paidAmount || 0) > 0)) {
          showToast('Una factura contabilizada en inventario, fiscal o con cobros no puede editarse. Debe anularse mediante el proceso correspondiente.', 'danger');
          return;
        }
        paidAmount = originalDoc.paidAmount || 0;
        status = originalDoc.status || 'pending';
        if (docType !== 'quote' && docType !== 'proforma') {
          if (paidAmount >= grandTotal) {
            status = 'paid';
          } else {
            status = 'pending';
          }
        }
      }
    } else {
      if (docType === 'quote') {
        invoiceNum = (settings.quotePrefix || 'COT-') + String(settings.nextQuoteNum || 1001);
        status = 'quote';
      } else if (docType === 'proforma') {
        invoiceNum = (settings.proformaPrefix || 'PROF-') + String(settings.nextProformaNum || 1001);
        status = 'proforma';
      } else {
        invoiceNum = settings.invoicePrefix + String(settings.nextInvoiceNum);
      }
    }

    if (paidAmount > grandTotal + 0.01) {
      showToast('El nuevo total no puede ser menor que los cobros ya registrados.', 'danger');
      return;
    }

    // Document Data
    const paymentTermsEl = document.getElementById('form-invoice-payment-terms');
    const paymentTerms = paymentTermsEl ? paymentTermsEl.value : 'Contado';

    const invoiceNotesEl = document.getElementById('form-invoice-notes');
    const invoiceNotes = invoiceNotesEl ? invoiceNotesEl.value.trim() : '';

    const userUid = (currentUser && (currentUser.uid || currentUser.id)) ? (currentUser.uid || currentUser.id) : 'admin';
    const invoiceData = {
      docType: docType || 'quote',
      type: docType || 'quote',
      companyCode: activeCompanyCode || 'CREATICOS',
      invoiceNumber: invoiceNum || editingInvoiceNumber || editingInvoiceId || 'COT-1000',
      number: invoiceNum || editingInvoiceNumber || editingInvoiceId || 'COT-1000',
      clientId: clientId || 'custom',
      clientName: clientName || '',
      clientRnc: clientRnc || '',
      customerSnapshot: invoiceCustomerSnapshot(clientId, { name: clientName, rnc: clientRnc }),
      issuerSnapshot: invoiceIssuerSnapshot(division),
      fiscalSchemaVersion: 2,
      date: date || '',
      dueDate: dueDate || '',
      division: division || 'general',
      ncfType: (docType === 'quote' || docType === 'proforma') ? 'none' : (ncfType || 'none'),
      ncf: (docType === 'quote' || docType === 'proforma') ? '' : (ncf || ''),
      items: items || [],
      subtotal: subtotal || 0,
      discountPct: globalDiscountPct || 0,
      discountAmount: totalDiscountAmount || 0,
      taxableAmount: calculatedTotals.taxableAmount || 0,
      itbis: totalItbis || 0,
      total: grandTotal || 0,
      paidAmount: paidAmount || 0,
      status: status || 'quote',
      paymentTerms: paymentTerms || 'Contado',
      notes: invoiceNotes || '',
      workflowStatus: docType === 'quote' || docType === 'proforma'
        ? ((editingInvoiceId && invoices.find(item => item.id === editingInvoiceId)?.workflowStatus) || 'draft')
        : 'issued',
      validUntil: dueDate || '',
      version: editingInvoiceId
        ? Number(invoices.find(item => item.id === editingInvoiceId)?.version || 1) + 1
        : 1,
      commercialMetrics: BillingCore.calculateCommercialMetrics(items, globalDiscountPct),
      updatedBy: userUid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    Object.keys(invoiceData).forEach(k => {
      if (invoiceData[k] === undefined) delete invoiceData[k];
    });
    if (conversionSourceId) invoiceData.sourceDocumentId = conversionSourceId;

    if (window.ERPBillingWorkflows && typeof window.ERPBillingWorkflows.authorizeDocument === 'function') {
      const authorization = await window.ERPBillingWorkflows.authorizeDocument(invoiceData);
      if (!authorization || authorization.allowed !== true) return;
      if (authorization.approvalId) invoiceData.commercialApprovalId = authorization.approvalId;
    }

    if (editingInvoiceId) {
      // Save updates to Firestore
      await getDB().collection(collectionInvoices).doc(editingInvoiceId).update(invoiceData);
    } else {
      // Save new document to Firestore using a transaction for NCF and invoice sequences
      const dbRef = getDB();
      const settingsDocRef = dbRef.collection(collectionSettings).doc('general');
      const invoicesCollRef = dbRef.collection(collectionInvoices);
      const conversionSourceRef = conversionSourceId ? invoicesCollRef.doc(conversionSourceId) : null;
      const newInvoiceDocRef = invoicesCollRef.doc();
      savedDocumentId = newInvoiceDocRef.id;

      await dbRef.runTransaction(async (transaction) => {
        const settingsDoc = await transaction.get(settingsDocRef);
        if (!settingsDoc.exists) {
          throw new Error("El documento de configuración de la empresa no existe.");
        }
        
        const conversionSourceDoc = conversionSourceRef ? await transaction.get(conversionSourceRef) : null;
        const conversionSourceData = conversionSourceDoc && conversionSourceDoc.exists ? conversionSourceDoc.data() : null;
        if (conversionSourceDoc && (
          !conversionSourceData
          || !['quote', 'proforma'].includes(conversionSourceData.docType)
          || conversionSourceData.convertedTo
          || conversionSourceData.status === 'converted'
        )) {
          throw new Error('La cotización o proforma ya fue convertida por otro proceso.');
        }

        const stockDocuments = [];
        for (const item of (docType === 'invoice' ? aggregateInventoryItems(items) : [])) {
          const target = inventoryProductTarget(dbRef, item.productId);
          if (!target) continue;
          const productDoc = await transaction.get(target.ref);
          if (!productDoc.exists) throw new Error(`El producto "${item.description}" ya no existe.`);
          stockDocuments.push({ item, target, data: productDoc.data() });
        }

        const freshSettings = settingsDoc.data();
        let freshInvoiceNum = '';
        let freshNcf = '';
        const settingsUpdates = {};

        if (docType === 'quote') {
          freshInvoiceNum = (freshSettings.quotePrefix || 'COT-') + String(freshSettings.nextQuoteNum || 1001);
          settingsUpdates.nextQuoteNum = (freshSettings.nextQuoteNum || 1001) + 1;
        } else if (docType === 'proforma') {
          freshInvoiceNum = (freshSettings.proformaPrefix || 'PROF-') + String(freshSettings.nextProformaNum || 1001);
          settingsUpdates.nextProformaNum = (freshSettings.nextProformaNum || 1001) + 1;
        } else {
          freshInvoiceNum = (freshSettings.invoicePrefix || 'CRE-') + String(freshSettings.nextInvoiceNum || 1001);
          settingsUpdates.nextInvoiceNum = (freshSettings.nextInvoiceNum || 1001) + 1;

          if (NCF_FIELDS[ncfType]) {
            const fields = NCF_FIELDS[ncfType];
            BillingCore.assertNcfRangeAvailable(freshSettings, ncfType, date);
            freshNcf = BillingCore.buildNcf(ncfType, freshSettings[fields.prefix] || ncfType, freshSettings[fields.sequence] || 1);
            settingsUpdates[fields.sequence] = Number(freshSettings[fields.sequence] || 1) + 1;
          } else if (ncfType === 'manual') {
            freshNcf = ncf; // Keep the manually entered NCF
          }
        }

        let ncfRegistryRef = null;
        if (freshNcf) {
          ncfRegistryRef = dbRef.collection(collectionNcfRegistry).doc(freshNcf);
          const ncfRegistryDoc = await transaction.get(ncfRegistryRef);
          if (ncfRegistryDoc.exists) {
            throw new Error(`El NCF ${freshNcf} ya fue utilizado por otro documento.`);
          }
        }

        invoiceData.invoiceNumber = freshInvoiceNum;
        invoiceData.ncf = (docType === 'quote' || docType === 'proforma') ? '' : freshNcf;
        invoiceData.createdBy = currentUser.uid;
        invoiceData.createdAt = firebase.firestore.FieldValue.serverTimestamp();

        const inventoryEffects = [];
        stockDocuments.forEach(({ item, target, data }) => {
          if (data.stock === undefined || data.stock === null) return;
          const currentStock = Number(data.stock) || 0;
          if (currentStock < item.qty) {
            throw new Error(`Stock insuficiente para "${data.name || data.title || item.description}". Disponible: ${currentStock}, solicitado: ${item.qty}`);
          }
          const movementRef = dbRef.collection(collectionInventoryMovements).doc();
          transaction.update(target.ref, {
            stock: currentStock - item.qty,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastInventoryMovementId: movementRef.id
          });
          inventoryEffects.push({
            productId: target.productId,
            documentId: target.documentId,
            collection: target.collection,
            quantity: item.qty,
            movementRef
          });
        });
        if (docType === 'invoice') {
          invoiceData.inventoryEffects = inventoryEffects.map(({ movementRef, ...effect }) => effect);
          invoiceData.inventoryPostedAt = firebase.firestore.FieldValue.serverTimestamp();
        }

        // Perform writes in the transaction
        transaction.set(newInvoiceDocRef, invoiceData);
        if (ncfRegistryRef) {
          transaction.set(ncfRegistryRef, {
            ncf: freshNcf,
            invoiceId: newInvoiceDocRef.id,
            companyCode: activeCompanyCode,
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        inventoryEffects.forEach(effect => {
          transaction.set(effect.movementRef, {
            type: 'sale',
            invoiceId: newInvoiceDocRef.id,
            invoiceNumber: freshInvoiceNum,
            productId: effect.productId,
            productDocumentId: effect.documentId,
            productCollection: effect.collection,
            quantity: -effect.quantity,
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        });
        transaction.update(settingsDocRef, settingsUpdates);
        if (conversionSourceRef) {
          transaction.update(conversionSourceRef, {
            status: 'converted',
            workflowStatus: 'converted',
            convertedTo: newInvoiceDocRef.id,
            convertedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.uid,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      });
    }

    // Clear form fields
    clearInvoiceForm();
    
    // Reload local settings and cache
    await loadSettings();
    await fetchAllData();
    
    // Go to Invoices list
    switchSubTab('invoices', 'list');
    renderInvoicesTable();
    showToast('Documento guardado correctamente.', 'success');
    document.dispatchEvent(new CustomEvent('erp:invoice-saved', {
      detail: { id: savedDocumentId, docType, action: wasEditing ? 'updated' : 'created' }
    }));
    if (savedConversionSourceId) {
      document.dispatchEvent(new CustomEvent('erp:document-event', {
        detail: { documentId: savedConversionSourceId, action: 'quote_converted', summary: `Documento convertido en la factura ${invoiceData.invoiceNumber || savedDocumentId}.`, metadata: { convertedTo: savedDocumentId } }
      }));
    }
    } catch (error) {
      console.error('Error saving invoice:', error);
      showToast('No se pudo guardar el documento: ' + error.message, 'danger');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || 'Guardar Documento';
      }
    }
  }

  // Cancel/Anular Invoice
  async function cancelInvoice(id, number) {
    if (!isUserAdmin) {
      showToast('No tienes permisos de administrador para anular facturas.', 'danger');
      return;
    }
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    if (Number(invoice.paidAmount || 0) > 0) {
      showToast('No se puede anular una factura con cobros. Registra primero la devolución o nota de crédito correspondiente.', 'danger');
      return;
    }
    let actualNumber = number || invoice.invoiceNumber || 'desconocida';
    if (!await confirmAction(`¿Deseas anular la factura ${actualNumber}? Se registrará en la auditoría y no podrá revertirse.`, {
      title: 'Anular factura',
      confirmLabel: 'Anular factura',
      tone: 'danger'
    })) {
      return;
    }
    const cancellationTypeInput = await promptAction(
      'Indica el código de anulación 608 (01 al 10).',
      { title: 'Motivo fiscal de anulación', inputLabel: 'Código', defaultValue: '04', required: true, confirmLabel: 'Continuar' }
    );
    if (cancellationTypeInput === null) return;
    const cancellationType = String(cancellationTypeInput).replace(/\D/g, '').padStart(2, '0');
    if (!/^(0[1-9]|10)$/.test(cancellationType)) {
      showToast('Selecciona un tipo de anulación válido del 01 al 10.', 'danger');
      return;
    }

    try {
      const db = getDB();
      const invoiceRef = db.collection(collectionInvoices).doc(id);
      const auditRef = db.collection('audit_logs').doc();
      await db.runTransaction(async transaction => {
        const freshInvoiceDoc = await transaction.get(invoiceRef);
        if (!freshInvoiceDoc.exists) throw new Error('La factura ya no existe.');
        const freshInvoice = freshInvoiceDoc.data();
        if (freshInvoice.status === 'cancelled') throw new Error('La factura ya fue anulada.');
        if (Number(freshInvoice.paidAmount || 0) > 0) {
          throw new Error('La factura tiene cobros registrados y no puede anularse directamente.');
        }
        if (freshInvoice.inventoryReversedAt) throw new Error('El inventario de esta factura ya fue reversado.');

        const stockDocuments = [];
        for (const effect of (Array.isArray(freshInvoice.inventoryEffects) ? freshInvoice.inventoryEffects : [])) {
          const target = inventoryProductTarget(db, effect.productId);
          if (!target) throw new Error('La factura contiene una referencia de inventario no válida.');
          const productDoc = await transaction.get(target.ref);
          if (!productDoc.exists) throw new Error(`No se encontró el producto ${effect.productId} para reversar el inventario.`);
          stockDocuments.push({ effect, target, data: productDoc.data() });
        }

        stockDocuments.forEach(({ effect, target, data }) => {
          const quantity = Number(effect.quantity || 0);
          const movementRef = db.collection(collectionInventoryMovements).doc();
          transaction.update(target.ref, {
            stock: (Number(data.stock) || 0) + quantity,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastInventoryMovementId: movementRef.id
          });
          transaction.set(movementRef, {
            type: 'sale_reversal',
            invoiceId: id,
            invoiceNumber: freshInvoice.invoiceNumber || actualNumber,
            productId: target.productId,
            productDocumentId: target.documentId,
            productCollection: target.collection,
            quantity: quantity,
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        transaction.update(invoiceRef, {
          status: 'cancelled',
          cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
          cancellationDate: BillingCore.toLocalDateInput(),
          cancellationType,
          cancelledBy: currentUser.uid,
          inventoryReversedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: currentUser.uid
        });
        transaction.set(auditRef, {
          action: `Anulación Factura ${activeCompanyCode}`,
          details: `Factura ${actualNumber} anulada en el panel de ${activeCompanyCode}`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userId: currentUser.uid,
          userEmail: currentUser.email
        });
      });

      await fetchAllData();
      renderInvoicesTable();
      showToast('Factura anulada y registrada en auditoría.', 'success');
      document.dispatchEvent(new CustomEvent('erp:document-event', { detail: { documentId: id, action: 'invoice_cancelled', summary: `Factura ${actualNumber} anulada.` } }));
    } catch (err) {
      console.error(err);
      showToast('Error al anular la factura: ' + err.message, 'danger');
    }
  }

  function openFiscalAdjustment(invoiceId) {
    if (!isUserAdmin) {
      showToast('Solo un administrador puede emitir notas fiscales.', 'danger');
      return;
    }
    const invoice = invoices.find(item => item.id === invoiceId);
    if (!invoice || invoice.docType !== 'invoice' || invoice.status === 'cancelled') {
      showToast('Selecciona una factura fiscal activa.', 'warning');
      return;
    }
    if (!/^B\d{10}$/.test(String(invoice.ncf || '').toUpperCase())) {
      showToast('La factura debe tener un NCF físico válido para emitir una nota relacionada.', 'warning');
      return;
    }
    const remainingCredit = Math.max(0, BillingCore.roundMoney(Number(invoice.total || 0) - Number(invoice.creditedAmount || 0)));
    document.getElementById('fiscal-adjustment-invoice-id').value = invoiceId;
    document.getElementById('fiscal-adjustment-type').value = 'credit_note';
    document.getElementById('fiscal-adjustment-date').value = BillingCore.toLocalDateInput();
    document.getElementById('fiscal-adjustment-amount').value = remainingCredit.toFixed(2);
    document.getElementById('fiscal-adjustment-reason').value = '';
    document.getElementById('fiscal-adjustment-resolution').value = 'credit_balance';
    document.getElementById('fiscal-adjustment-restock').checked = false;
    document.getElementById('fiscal-adjustment-summary').innerHTML = `
      <strong>${escapeHTML(invoice.invoiceNumber)}</strong><br>
      <span style="color:var(--text-muted);font-size:0.84rem;">NCF ${escapeHTML(invoice.ncf)} · ${escapeHTML(invoice.clientName)} · Total ${escapeHTML(formatMoney(invoice.total))}</span>
    `;
    handleFiscalAdjustmentTypeChange();
    handleFiscalAdjustmentResolutionChange();
    openModal('modal-fiscal-adjustment');
  }

  function handleFiscalAdjustmentTypeChange() {
    const invoiceId = document.getElementById('fiscal-adjustment-invoice-id').value;
    const invoice = invoices.find(item => item.id === invoiceId);
    if (!invoice) return;
    const type = document.getElementById('fiscal-adjustment-type').value;
    const amountInput = document.getElementById('fiscal-adjustment-amount');
    const options = document.getElementById('credit-note-options');
    const limit = document.getElementById('fiscal-adjustment-limit');
    const remainingCredit = Math.max(0, BillingCore.roundMoney(Number(invoice.total || 0) - Number(invoice.creditedAmount || 0)));
    if (type === 'credit_note') {
      options.style.display = 'block';
      amountInput.max = remainingCredit.toFixed(2);
      if (Number(amountInput.value) > remainingCredit || Number(amountInput.value) <= 0) amountInput.value = remainingCredit.toFixed(2);
      limit.textContent = `Máximo disponible para acreditar: ${formatMoney(remainingCredit)}.`;
    } else {
      options.style.display = 'none';
      amountInput.removeAttribute('max');
      if (Number(amountInput.value) <= 0) amountInput.value = '0.00';
      limit.textContent = 'El monto incrementará el balance de la factura original.';
    }
  }

  function handleFiscalAdjustmentResolutionChange() {
    const resolution = document.getElementById('fiscal-adjustment-resolution').value;
    const methodGroup = document.getElementById('fiscal-refund-method-group');
    if (methodGroup) methodGroup.style.display = resolution === 'refund' ? 'block' : 'none';
  }

  async function saveFiscalAdjustment(event) {
    event.preventDefault();
    if (!isUserAdmin) return;
    const submit = event.submitter;
    if (submit && submit.disabled) return;
    const invoiceId = document.getElementById('fiscal-adjustment-invoice-id').value;
    const type = document.getElementById('fiscal-adjustment-type').value;
    const date = document.getElementById('fiscal-adjustment-date').value;
    const amount = BillingCore.roundMoney(document.getElementById('fiscal-adjustment-amount').value);
    const reason = document.getElementById('fiscal-adjustment-reason').value.trim();
    const resolution = type === 'credit_note'
      ? document.getElementById('fiscal-adjustment-resolution').value
      : 'additional_charge';
    const refundMethod = document.getElementById('fiscal-refund-method').value;
    const requestedRestock = type === 'credit_note' && document.getElementById('fiscal-adjustment-restock').checked;
    if (!['credit_note', 'debit_note'].includes(type) || !date || !reason || amount <= 0) {
      showToast('Completa correctamente el tipo, fecha, monto y motivo.', 'danger');
      return;
    }
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Emitiendo…';
    }

    try {
      const db = getDB();
      const settingsRef = db.collection(collectionSettings).doc('general');
      const originalRef = db.collection(collectionInvoices).doc(invoiceId);
      const adjustmentRef = db.collection(collectionInvoices).doc();
      const ncfType = type === 'credit_note' ? 'B04' : 'B03';
      const fields = NCF_FIELDS[ncfType];

      await db.runTransaction(async transaction => {
        const settingsDoc = await transaction.get(settingsRef);
        const originalDoc = await transaction.get(originalRef);
        if (!settingsDoc.exists || !originalDoc.exists) throw new Error('No se encontró la configuración o factura original.');
        const original = originalDoc.data();
        if (original.docType !== 'invoice' || original.status === 'cancelled') throw new Error('La factura original ya no admite ajustes.');

        const credited = Number(original.creditedAmount || 0);
        const debited = Number(original.debitedAmount || 0);
        const refunded = Number(original.refundedAmount || 0);
        const remainingCredit = BillingCore.roundMoney(Number(original.total || 0) - credited);
        if (type === 'credit_note' && amount > remainingCredit + 0.01) {
          throw new Error(`El monto supera el crédito disponible de ${formatMoney(remainingCredit)}.`);
        }
        const effectivePaid = Math.max(0, Number(original.paidAmount || 0) - refunded);
        if (resolution === 'refund' && amount > effectivePaid + 0.01) {
          throw new Error(`Solo se pueden devolver ${formatMoney(effectivePaid)} ya cobrados.`);
        }

        const freshSettings = settingsDoc.data();
        BillingCore.assertNcfRangeAvailable(freshSettings, ncfType, date);
        const freshNcf = BillingCore.buildNcf(ncfType, freshSettings[fields.prefix] || ncfType, freshSettings[fields.sequence] || 1);
        const registryRef = db.collection(collectionNcfRegistry).doc(freshNcf);
        const registryDoc = await transaction.get(registryRef);
        if (registryDoc.exists) throw new Error(`El NCF ${freshNcf} ya fue utilizado.`);

        const completesCredit = type === 'credit_note' && credited + amount >= Number(original.total || 0) - 0.01;
        const shouldRestock = requestedRestock && completesCredit && !original.creditRestockedAt;
        const restockDocuments = [];
        if (shouldRestock) {
          for (const effect of (original.inventoryEffects || [])) {
            const fallbackTarget = inventoryProductTarget(db, effect.productId);
            const effectCollection = effect.collection || (fallbackTarget && fallbackTarget.collection);
            const effectDocumentId = effect.documentId || (fallbackTarget && fallbackTarget.documentId);
            if (!effectCollection || !effectDocumentId) continue;
            const productRef = db.collection(effectCollection).doc(effectDocumentId);
            const productDoc = await transaction.get(productRef);
            if (productDoc.exists) {
              restockDocuments.push({
                effect: { ...effect, collection: effectCollection, documentId: effectDocumentId },
                ref: productRef,
                data: productDoc.data()
              });
            }
          }
        }

        const originalTotal = Math.max(0.01, Number(original.total || 0));
        const ratio = amount / originalTotal;
        const adjustmentItbis = BillingCore.roundMoney(Number(original.itbis || 0) * ratio);
        const adjustmentDiscount = BillingCore.roundMoney(Number(original.discountAmount || 0) * ratio);
        const adjustmentTaxable = BillingCore.roundMoney(Math.max(0, amount - adjustmentItbis));
        const adjustmentSubtotal = BillingCore.roundMoney(adjustmentTaxable + adjustmentDiscount);
        const adjustmentNumber = `${type === 'credit_note' ? 'NC' : 'ND'}-${freshNcf}`;
        const adjustmentData = {
          docType: type,
          type,
          companyCode: activeCompanyCode,
          invoiceNumber: adjustmentNumber,
          number: adjustmentNumber,
          originalInvoiceId: invoiceId,
          originalInvoiceNumber: original.invoiceNumber,
          modifiedNcf: original.ncf,
          clientId: original.clientId || 'custom',
          clientName: original.clientName || '',
          clientRnc: original.clientRnc || '',
          customerSnapshot: original.customerSnapshot || invoiceCustomerSnapshot(original.clientId, { name: original.clientName, rnc: original.clientRnc }),
          issuerSnapshot: original.issuerSnapshot || invoiceIssuerSnapshot(original.division),
          fiscalSchemaVersion: 2,
          date,
          dueDate: date,
          division: original.division || 'general',
          ncfType,
          ncf: freshNcf,
          items: [{
            productId: 'fiscal_adjustment',
            description: `${type === 'credit_note' ? 'Nota de crédito' : 'Nota de débito'}: ${reason}`,
            price: adjustmentTaxable,
            qty: 1,
            discount: 0,
            tax: adjustmentItbis,
            taxAfterGlobalDiscount: adjustmentItbis,
            taxMode: 'amount',
            taxRate: original.taxableAmount > 0 ? BillingCore.roundMoney(Number(original.itbis || 0) / Number(original.taxableAmount) * 100) : 0,
            total: amount
          }],
          subtotal: adjustmentSubtotal,
          discountPct: 0,
          discountAmount: adjustmentDiscount,
          taxableAmount: adjustmentTaxable,
          itbis: adjustmentItbis,
          total: amount,
          paidAmount: 0,
          status: 'issued',
          paymentTerms: original.paymentTerms || 'Contado',
          notes: reason,
          adjustmentReason: reason,
          resolution,
          refundAmount: resolution === 'refund' ? amount : 0,
          refundMethod: resolution === 'refund' ? refundMethod : '',
          restocked: shouldRestock,
          inventoryEffects: shouldRestock ? (original.inventoryEffects || []) : [],
          createdBy: currentUser.uid,
          updatedBy: currentUser.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (shouldRestock) adjustmentData.inventoryPostedAt = firebase.firestore.FieldValue.serverTimestamp();

        const nextCredited = type === 'credit_note' ? BillingCore.roundMoney(credited + amount) : credited;
        const nextDebited = type === 'debit_note' ? BillingCore.roundMoney(debited + amount) : debited;
        const nextRefunded = resolution === 'refund' ? BillingCore.roundMoney(refunded + amount) : refunded;
        const nextNetTotal = BillingCore.roundMoney(Number(original.total || 0) + nextDebited - nextCredited);
        const nextEffectivePaid = Math.max(0, BillingCore.roundMoney(Number(original.paidAmount || 0) - nextRefunded));
        let nextStatus = nextNetTotal <= 0.01 ? 'credited' : BillingCore.paymentStatus(nextNetTotal, nextEffectivePaid);
        if (nextStatus === 'pending' && original.status === 'unpaid') nextStatus = 'unpaid';

        const originalUpdates = {
          creditedAmount: nextCredited,
          debitedAmount: nextDebited,
          refundedAmount: nextRefunded,
          lastAdjustmentId: adjustmentRef.id,
          status: nextStatus,
          updatedBy: currentUser.uid,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (shouldRestock) originalUpdates.creditRestockedAt = firebase.firestore.FieldValue.serverTimestamp();

        restockDocuments.forEach(({ effect, ref, data }) => {
          const currentStock = Number(data.stock || 0);
          const movementRef = db.collection(collectionInventoryMovements).doc();
          transaction.update(ref, {
            stock: currentStock + Number(effect.quantity || 0),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastInventoryMovementId: movementRef.id
          });
          transaction.set(movementRef, {
            type: 'credit_note_return',
            invoiceId: adjustmentRef.id,
            invoiceNumber: adjustmentNumber,
            productId: effect.productId,
            productDocumentId: effect.documentId,
            productCollection: effect.collection,
            quantity: Number(effect.quantity || 0),
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        });

        transaction.set(adjustmentRef, adjustmentData);
        transaction.set(registryRef, {
          ncf: freshNcf,
          invoiceId: adjustmentRef.id,
          companyCode: activeCompanyCode,
          createdBy: currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        transaction.update(originalRef, originalUpdates);
        transaction.update(settingsRef, { [fields.sequence]: Number(freshSettings[fields.sequence] || 1) + 1 });
        if (resolution === 'refund') {
          transaction.set(db.collection(collectionRefunds).doc(), {
            invoiceId,
            adjustmentId: adjustmentRef.id,
            amount,
            method: refundMethod,
            reason,
            companyCode: activeCompanyCode,
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        transaction.set(db.collection('audit_logs').doc(), {
          action: type === 'credit_note' ? 'Emitir nota de crédito' : 'Emitir nota de débito',
          details: `${adjustmentNumber} vinculada a ${original.invoiceNumber} por ${formatMoney(amount)}`,
          userEmail: currentUser.email,
          userId: currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      closeModal('modal-fiscal-adjustment');
      await loadSettings();
      await fetchAllData();
      renderInvoicesTable();
      showToast('Ajuste fiscal emitido y vinculado correctamente.', 'success');
      document.dispatchEvent(new CustomEvent('erp:document-event', { detail: { documentId: invoiceId, action: 'fiscal_adjustment_issued', summary: `Ajuste fiscal emitido por ${formatMoney(amount)}.` } }));
    } catch (error) {
      console.error('Fiscal adjustment error:', error);
      showToast(error.message || 'No se pudo emitir el ajuste fiscal.', 'danger');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'Emitir ajuste fiscal';
      }
    }
  }

  // ─── INVOICE DETAIL VIEW & PRINT ───
  async function viewInvoice(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    switchPanel('invoice-view');

    // Reset print format to Letter
    const formatSelect = document.getElementById('print-format-select');
    if (formatSelect) {
      formatSelect.value = 'letter';
    }
    handlePrintFormatChange('letter', { skipFit: true });

    // Historical documents use immutable snapshots. Legacy invoices fall back
    // to the current records without mutating the stored document.
    const currentClient = clients.find(c => c.id === inv.clientId) || {};
    const client = inv.customerSnapshot || {
      name: inv.clientName,
      rnc: inv.clientRnc,
      address: currentClient.address || 'Dirección no registrada',
      phone: currentClient.phone || 'N/D',
      email: currentClient.email || 'N/D'
    };
    const issuer = inv.issuerSnapshot || invoiceIssuerSnapshot(inv.division);

    const nameEl = document.getElementById('view-company-name');
    if (nameEl) nameEl.textContent = issuer.displayName || issuer.legalName || '';
    const issuerRncEl = document.getElementById('view-company-rnc');
    const issuerPhoneEl = document.getElementById('view-company-phone');
    const issuerEmailEl = document.getElementById('view-company-email');
    const issuerAddressEl = document.getElementById('view-company-address');
    const issuerLogoEl = document.getElementById('view-company-logo');
    if (issuerRncEl) issuerRncEl.textContent = issuer.rnc || '';
    if (issuerPhoneEl) issuerPhoneEl.textContent = issuer.phone || '';
    if (issuerEmailEl) issuerEmailEl.textContent = issuer.email || '';
    if (issuerAddressEl) issuerAddressEl.textContent = issuer.address || '';
    if (issuerLogoEl && issuer.logo) issuerLogoEl.src = issuer.logo;

    // Target the printable title (Factura vs Cotización vs Proforma)
    const headerTitle = document.querySelector('.billing-meta-box h3');
    if (headerTitle) {
      if (inv.docType === 'quote') {
        headerTitle.textContent = 'COTIZACIÓN';
      } else if (inv.docType === 'proforma') {
        headerTitle.textContent = 'FACTURA PROFORMA';
      } else if (inv.docType === 'credit_note') {
        headerTitle.textContent = 'NOTA DE CRÉDITO';
      } else if (inv.docType === 'debit_note') {
        headerTitle.textContent = 'NOTA DE DÉBITO';
      } else {
        headerTitle.textContent = 'FACTURA';
      }
    }

    // Bind metadata
    document.getElementById('view-invoice-number').textContent = inv.invoiceNumber;
    document.getElementById('view-invoice-date').textContent = formatDate(inv.date);
    document.getElementById('view-invoice-due-date').textContent = formatDate(inv.dueDate);
    document.getElementById('view-invoice-ncf').textContent = inv.ncf || 'Sin Comprobante';

    // Badge status
    const statusEl = document.getElementById('view-invoice-status');
    statusEl.className = 'admin-badge';
    statusEl.removeAttribute('style');

    if (inv.docType === 'credit_note') {
      statusEl.classList.add('badge-credit');
      statusEl.textContent = 'Nota de crédito';
    } else if (inv.docType === 'debit_note') {
      statusEl.classList.add('badge-partial');
      statusEl.textContent = 'Nota de débito';
    } else if (inv.status === 'converted') {
      statusEl.classList.add('badge-converted');
      statusEl.textContent = 'Convertida';
    } else if (inv.docType === 'quote') {
      const workflow = BillingCore.quoteWorkflowMeta(inv.workflowStatus, inv.validUntil || inv.dueDate);
      statusEl.classList.add('commercial-status', `is-${workflow.tone}`);
      statusEl.textContent = workflow.label;
    } else if (inv.docType === 'proforma') {
      const workflow = BillingCore.quoteWorkflowMeta(inv.workflowStatus, inv.validUntil || inv.dueDate);
      statusEl.classList.add('commercial-status', `is-${workflow.tone}`);
      statusEl.textContent = workflow.label;
    } else if (inv.status === 'paid') {
      statusEl.classList.add('badge-paid');
      statusEl.textContent = 'Pagada';
    } else if (inv.status === 'pending' || inv.status === 'partial' || inv.status === 'unpaid') {
      const overdue = BillingCore.isOverdue(inv.dueDate, invoiceBalance(inv));
      statusEl.classList.add(overdue ? 'badge-overdue' : (inv.status === 'partial' ? 'badge-partial' : (inv.status === 'unpaid' ? 'badge-credit' : 'badge-pending')));
      statusEl.textContent = overdue ? 'Vencida' : (inv.status === 'partial' ? 'Abono parcial' : (inv.status === 'unpaid' ? 'A crédito' : 'Pendiente'));
    } else if (inv.status === 'cancelled') {
      statusEl.classList.add('badge-cancelled');
      statusEl.textContent = 'Anulada';
    }

    // Client details
    document.getElementById('view-client-name').textContent = client.name || inv.clientName;
    document.getElementById('view-client-rnc').textContent = client.rnc || inv.clientRnc || 'N/D';
    document.getElementById('view-client-phone').textContent = client.phone || 'N/D';
    document.getElementById('view-client-email').textContent = client.email || 'N/D';
    document.getElementById('view-client-address').textContent = client.address || 'N/D';

    // Populate items preview table
    const itemsTbody = document.getElementById('view-invoice-items-body');
    itemsTbody.innerHTML = '';
    
    inv.items.forEach(line => {
      const price = Number(line.price) || 0;
      const qty = Number(line.qty) || 1;
      const lineTaxAmount = line.taxAfterGlobalDiscount !== undefined
        ? Number(line.taxAfterGlobalDiscount)
        : BillingCore.resolveLineTax(line).amount;

      const lineDiscountPct = line.discount || 0;
      const lineDiscountStr = lineDiscountPct > 0 ? `${lineDiscountPct}%` : '—';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHTML(line.description)}</td>
        <td style="text-align:right;">${escapeHTML(formatMoney(price))}</td>
        <td style="text-align:center;">${escapeHTML(qty)}</td>
        <td style="text-align:right;">${escapeHTML(formatMoney(lineTaxAmount))}</td>
        <td style="text-align:center;">${escapeHTML(lineDiscountStr)}</td>
        <td style="text-align:right;">${escapeHTML(formatMoney(line.total))}</td>
      `;
      itemsTbody.appendChild(tr);
    });

    // Populate mathematical totals
    const balance = invoiceBalance(inv);
    const discountAmount = inv.discountAmount || 0;

    document.getElementById('view-summary-subtotal').textContent = formatMoney(inv.subtotal);
    document.getElementById('view-summary-discount').textContent = formatMoney(discountAmount);
    document.getElementById('view-summary-itbis').textContent = formatMoney(inv.itbis);
    document.getElementById('view-summary-total').textContent = formatMoney(inv.total);
    document.getElementById('view-summary-paid').textContent = formatMoney(inv.paidAmount);
    document.getElementById('view-summary-balance').textContent = formatMoney(balance);

    // Populate payment terms and notes
    const viewTermsEl = document.getElementById('view-invoice-payment-terms');
    if (viewTermsEl) viewTermsEl.textContent = inv.paymentTerms || inv.paymentTerm || 'Contado';
    
    const viewNotesEl = document.getElementById('view-invoice-notes');
    if (viewNotesEl) viewNotesEl.textContent = inv.notes || '';

    // Populate payment logs
    const paymentList = document.getElementById('view-invoice-payments-body');
    paymentList.innerHTML = '';

    const invPayments = payments.filter(p => p.invoiceId === invoiceId);
    if (invPayments.length === 0) {
      paymentList.innerHTML = '<li>No hay cobros registrados para esta factura.</li>';
    } else {
      invPayments.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${formatDate(p.timestamp)}</strong>: ${formatMoney(p.amount)} vía ${escapeHTML(p.method)} ${p.notes ? `(${escapeHTML(p.notes)})` : ''}`;
        paymentList.appendChild(li);
      });
    }

    // Set Payment and Convert Buttons Actions
    const payBtn = document.getElementById('btn-view-register-payment');
    const convertBtn = document.getElementById('btn-view-convert-invoice');
    const commercialResponse = document.getElementById('view-commercial-response');
    if (commercialResponse) {
      const isCommercialDocument = inv.docType === 'quote' || inv.docType === 'proforma';
      commercialResponse.hidden = !isCommercialDocument;
      if (isCommercialDocument) {
        const workflow = BillingCore.quoteWorkflowMeta(inv.workflowStatus, inv.validUntil || inv.dueDate);
        document.getElementById('view-commercial-response-title').textContent = `${workflow.label} · versión ${Number(inv.version || 1)}`;
        document.getElementById('view-commercial-response-detail').textContent = inv.clientResponseName
          ? `Respondida por ${inv.clientResponseName}${inv.clientResponseNote ? ` · ${inv.clientResponseNote}` : ''}`
          : `Válida hasta ${formatDate(inv.validUntil || inv.dueDate)}.`;
        const shareButton = document.getElementById('view-commercial-share-button');
        const historyButton = document.getElementById('view-commercial-history-button');
        shareButton.replaceWith(shareButton.cloneNode(true));
        historyButton.replaceWith(historyButton.cloneNode(true));
        document.getElementById('view-commercial-share-button').addEventListener('click', () => window.ERPBillingWorkflows.openShareDialog(inv.id));
        document.getElementById('view-commercial-history-button').addEventListener('click', () => window.ERPBillingWorkflows.openHistoryDialog(inv.id));
      }
    }
    
    if (inv.docType === 'quote' || inv.docType === 'proforma') {
      payBtn.style.display = 'none';
      if (convertBtn && inv.status !== 'cancelled' && inv.status !== 'converted' && !inv.convertedTo) {
        convertBtn.style.display = 'inline-flex';
        convertBtn.setAttribute('data-quote-id', inv.id);
      } else if (convertBtn) {
        convertBtn.style.display = 'none';
      }
    } else {
      if (convertBtn) convertBtn.style.display = 'none';
      if (inv.status !== 'cancelled' && balance > 0) {
        payBtn.style.display = 'inline-flex';
        // Pass data values to modal trigger
        payBtn.setAttribute('data-inv-id', inv.id);
        payBtn.setAttribute('data-inv-total', inv.total);
        payBtn.setAttribute('data-inv-paid', inv.paidAmount);
        payBtn.setAttribute('data-inv-balance', balance);
      } else {
        payBtn.style.display = 'none';
      }
    }

    await applyAdaptivePrintLayout();
  }

  function convertQuoteToInvoice() {
    const convertBtn = document.getElementById('btn-view-convert-invoice');
    if (!convertBtn) return;
    const quoteId = convertBtn.getAttribute('data-quote-id');
    convertQuoteFromList(quoteId);
  }

  // ═══════════════════════════════════════════
  // 4. REGISTRO DE COBROS / PAGOS
  // ═══════════════════════════════════════════
  function openRegisterPaymentModal() {
    const payBtn = document.getElementById('btn-view-register-payment');
    const invId = payBtn.getAttribute('data-inv-id');
    openRegisterPaymentFromList(invId);
  }

  async function registerPayment(e) {
    e.preventDefault();

    const invoiceId = document.getElementById('form-payment-invoice-id').value;
    const amount = Number(document.getElementById('form-payment-amount').value);
    const method = document.getElementById('form-payment-method').value;
    const notes = document.getElementById('form-payment-notes').value.trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      showToast('El monto debe ser superior a cero.', 'warning');
      return;
    }
    if (!['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque'].includes(method)) {
      showToast('Selecciona un método de pago válido.', 'danger');
      return;
    }

    try {
      const db = getDB();
      const invRef = db.collection(collectionInvoices).doc(invoiceId);
      const paymentRef = db.collection(collectionPayments).doc();
      const sessionRef = activeCashSession
        ? db.collection(collectionCashSessions).doc(activeCashSession.id)
        : null;
      const paymentData = {
        invoiceId: invoiceId,
        amount: amount,
        method: method,
        notes: notes,
        createdBy: currentUser.uid,
        companyCode: activeCompanyCode,
        cashSessionId: activeCashSession ? activeCashSession.id : '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.runTransaction(async transaction => {
        const invSnap = await transaction.get(invRef);
        if (!invSnap.exists) throw new Error('La factura ya no existe.');
        const inv = invSnap.data();
        if (inv.docType !== 'invoice' || inv.status === 'cancelled') {
          throw new Error('Este documento no admite cobros.');
        }
        const total = Number(inv.total || 0);
        const previousPaid = Number(inv.paidAmount || 0);
        const balance = BillingCore.roundMoney(total - previousPaid);
        if (amount > balance + 0.01) {
          throw new Error(`El monto excede el balance pendiente de ${formatMoney(balance)}.`);
        }
        const newPaidAmount = BillingCore.roundMoney(previousPaid + amount);

        transaction.set(paymentRef, paymentData);
        transaction.update(invRef, {
          paidAmount: newPaidAmount,
          status: BillingCore.paymentStatus(total, newPaidAmount),
          lastPaymentId: paymentRef.id,
          updatedBy: currentUser.uid,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        if (sessionRef) {
          const updates = { transactionsCount: firebase.firestore.FieldValue.increment(1) };
          if (method === 'Efectivo') {
            updates.salesCash = firebase.firestore.FieldValue.increment(amount);
          } else if (method === 'Tarjeta') {
            updates.salesCard = firebase.firestore.FieldValue.increment(amount);
          } else if (method === 'Transferencia' || method === 'Cheque') {
            updates.salesTransfer = firebase.firestore.FieldValue.increment(amount);
          }
          transaction.update(sessionRef, updates);
        }
      });

      if (sessionRef) {
        const freshDoc = await sessionRef.get();
        activeCashSession = { id: freshDoc.id, ...freshDoc.data() };
        updateCashSessionUI();
      }

      // Reload references
      await fetchAllData();
      closeModal('modal-payment');
      
      // Update details view
      viewInvoice(invoiceId);
      showToast('Cobro registrado correctamente.', 'success');
      document.dispatchEvent(new CustomEvent('erp:document-event', { detail: { documentId: invoiceId, action: 'payment_registered', summary: `Cobro de ${formatMoney(amount)} por ${method}.` } }));
    } catch (err) {
      console.error(err);
      showToast('No se pudo registrar el cobro: ' + err.message, 'danger');
    }
  }

  // ═══════════════════════════════════════════
  // 5. CLIENTES (CLIENTS) DIRECTORY
  // ═══════════════════════════════════════════
  function renderClientsTable() {
    switchPanel('clients');

    const searchVal = document.getElementById('clients-search').value.toLowerCase();
    const cleanSearchVal = searchVal.replace(/[^0-9]/g, '');
    
    const filtered = clients.filter(c => {
      const matchName = c.name.toLowerCase().includes(searchVal);
      const cleanRnc = c.rnc ? c.rnc.replace(/[^0-9]/g, '') : '';
      const matchRnc = cleanRnc && (cleanRnc.includes(cleanSearchVal) || c.rnc.toLowerCase().includes(searchVal));
      const matchEmail = c.email && c.email.toLowerCase().includes(searchVal);
      return matchName || (cleanSearchVal.length > 0 && matchRnc) || matchEmail;
    });

    const tbody = document.getElementById('clients-table-body');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">No se encontraron clientes.</td></tr>`;
      return;
    }

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHTML(c.name)}</strong></td>
        <td>${c.rnc ? escapeHTML(c.rnc) : '<span style="color:#cbd5e1;">Sin registro</span>'}</td>
        <td>${c.phone ? escapeHTML(c.phone) : '—'}</td>
        <td>${c.email ? escapeHTML(c.email) : '—'}</td>
        <td>${c.address ? escapeHTML(c.address) : '—'}</td>
        <td>
          <div class="table-actions">
            <button class="table-btn table-btn-secondary" title="Ver Perfil" data-erp-click="ERPBilling.viewClientProfile('${c.id}')" style="color: var(--primary);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </button>
            <button class="table-btn table-btn-primary" title="Editar" data-erp-click="ERPBilling.openEditClientForm('${c.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="table-btn table-btn-danger" title="Eliminar" data-erp-click="ERPBilling.deleteClient('${c.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function viewClientProfile(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    currentProfileClientId = clientId;

    switchPanel('client-profile');

    // Populate general client info
    document.getElementById('profile-client-name').textContent = client.name;
    document.getElementById('profile-client-rnc').textContent = client.rnc || 'N/D';
    document.getElementById('profile-client-phone').textContent = client.phone || 'N/D';
    document.getElementById('profile-client-email').textContent = client.email || 'N/D';
    document.getElementById('profile-client-address').textContent = client.address || 'N/D';

    // RNC badge
    const badge = document.getElementById('profile-client-rnc-badge');
    if (badge) {
      badge.textContent = client.rnc ? (client.rnc.length === 9 ? 'RNC Jurídico' : 'Cédula Física') : 'Sin Registro';
    }

    // Avatar
    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
      avatar.textContent = (client.name || '?').charAt(0).toUpperCase();
    }

    // Filter invoices for this client
    const clientInvoices = invoices.filter(inv => inv.clientId === clientId);

    let totalPurchases = 0;
    let totalPaid = 0;
    let totalBalance = 0;

    const tbody = document.getElementById('profile-invoices-body');
    tbody.innerHTML = '';

    if (clientInvoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text-muted);">Este cliente no tiene facturas registradas.</td></tr>';
    } else {
      clientInvoices.forEach(inv => {
        const isCancelled = inv.status === 'cancelled';
        const isQuote = inv.docType === 'quote';
        const isProforma = inv.docType === 'proforma';

        if (!isCancelled && inv.docType === 'invoice') {
          totalPurchases += invoiceNetTotal(inv);
          totalPaid += Math.max(0, Number(inv.paidAmount || 0) - Number(inv.refundedAmount || 0));
          totalBalance += invoiceBalance(inv);
        }

        const balance = invoiceBalance(inv);

        let statusClass = 'badge-pending';
        let statusText = 'Pendiente';
        if (isCancelled) {
          statusClass = 'badge-cancelled';
          statusText = 'Anulada';
        } else if (isQuote) {
          statusClass = 'badge-pending';
          statusText = 'Cotización';
        } else if (isProforma) {
          statusClass = 'badge-pending';
          statusText = 'Proforma';
        } else if (inv.status === 'paid') {
          statusClass = 'badge-paid';
          statusText = 'Pagada';
        } else if (inv.status === 'partial') {
          statusClass = 'badge-partial';
          statusText = 'Abono parcial';
        } else if (inv.status === 'unpaid') {
          statusClass = 'badge-credit';
          statusText = 'A crédito';
        } else {
          if (BillingCore.isOverdue(inv.dueDate, balance)) {
            statusClass = 'badge-overdue';
            statusText = 'Vencida';
          }
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHTML(inv.invoiceNumber)}</strong></td>
          <td>${escapeHTML(formatDate(inv.date))}</td>
          <td>${inv.ncf ? escapeHTML(inv.ncf) : '—'}</td>
          <td>${escapeHTML(formatMoney(inv.total))}</td>
          <td style="color:var(--success); font-weight:500;">${escapeHTML(formatMoney(inv.paidAmount || 0))}</td>
          <td style="color:${balance > 0 ? '#ef4444' : 'inherit'}; font-weight:600;">${escapeHTML(formatMoney(balance))}</td>
          <td><span class="admin-badge ${statusClass}">${statusText}</span></td>
          <td>
            <button class="table-btn table-btn-secondary" title="Ver Factura" data-erp-click="ERPBilling.viewInvoice('${inv.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    document.getElementById('profile-stats-purchases').textContent = formatMoney(totalPurchases);
    document.getElementById('profile-stats-paid').textContent = formatMoney(totalPaid);
    document.getElementById('profile-stats-balance').textContent = formatMoney(totalBalance);

    // Render Credit products list
    const creditBody = document.getElementById('profile-credit-products-body');
    if (creditBody) {
      creditBody.innerHTML = '';
      
      const unpaidInvoices = clientInvoices.filter(inv => {
        const isCancelled = inv.status === 'cancelled';
        const isQuote = inv.docType === 'quote';
        const isProforma = inv.docType === 'proforma';
        const isUnpaid = invoiceBalance(inv) > 0;
        return inv.docType === 'invoice' && !isCancelled && !isQuote && !isProforma && isUnpaid;
      });

      if (unpaidInvoices.length === 0) {
        creditBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">No hay artículos a crédito pendientes.</td></tr>';
      } else {
        unpaidInvoices.forEach(inv => {
          (inv.items || []).forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${escapeHTML(item.description || item.name || 'Artículo')}</strong></td>
              <td>${escapeHTML(item.qty)}</td>
              <td>${escapeHTML(formatMoney(item.price))}</td>
              <td>${escapeHTML(formatMoney(item.total || (item.price * item.qty)))}</td>
              <td>${escapeHTML(formatDate(inv.date))}</td>
              <td><span style="cursor:pointer; color:var(--primary); text-decoration:underline;" data-erp-click="ERPBilling.viewInvoice('${inv.id}')">${escapeHTML(inv.invoiceNumber)}</span></td>
            `;
            creditBody.appendChild(tr);
          });
        });
      }
    }
  }

  function openNewClientForm(prefilledName = '') {
    const titleEl = document.getElementById('client-form-title');
    if (titleEl) titleEl.textContent = 'Agregar Nuevo Cliente';

    document.getElementById('form-client-id').value = '';
    document.getElementById('form-client-name').value = prefilledName;
    document.getElementById('form-client-rnc').value = '';
    document.getElementById('form-client-phone').value = '';
    document.getElementById('form-client-email').value = '';
    document.getElementById('form-client-address').value = '';

    // Check if we are coming from invoice autocomplete
    const invoicePanel = document.getElementById('panel-invoices');
    const invoiceFormTab = document.getElementById('subtab-invoices-form');
    if (invoicePanel && invoicePanel.classList.contains('is-active') && invoiceFormTab && invoiceFormTab.classList.contains('is-active')) {
      returnToInvoice = true;
    } else {
      returnToInvoice = false;
    }

    switchPanel('clients');
    switchSubTab('clients', 'form');
  }

  function openEditClientForm(clientId) {
    const c = clients.find(item => item.id === clientId);
    if (!c) return;

    const titleEl = document.getElementById('client-form-title');
    if (titleEl) titleEl.textContent = 'Editar Cliente';

    document.getElementById('form-client-id').value = c.id;
    document.getElementById('form-client-name').value = c.name;
    document.getElementById('form-client-rnc').value = c.rnc || '';
    document.getElementById('form-client-phone').value = c.phone || '';
    document.getElementById('form-client-email').value = c.email || '';
    document.getElementById('form-client-address').value = c.address || '';

    returnToInvoice = false;

    switchPanel('clients');
    switchSubTab('clients', 'form');
  }

  async function saveClient(e) {
    e.preventDefault();

    const id = document.getElementById('form-client-id').value;
    const name = document.getElementById('form-client-name').value.trim();
    const rnc = document.getElementById('form-client-rnc').value.trim();
    const email = document.getElementById('form-client-email').value.trim();
    const cleanRnc = rnc.replace(/\D/g, '');
    if (!name || name.length > 150) {
      showToast('El nombre del cliente es obligatorio y debe ser válido.', 'danger');
      return;
    }
    if (rnc && ![9, 11].includes(cleanRnc.length)) {
      showToast('El RNC o cédula debe contener 9 u 11 dígitos.', 'danger');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Introduce un correo electrónico válido.', 'danger');
      return;
    }
    if (cleanRnc && clients.some(client => client.id !== id && String(client.rnc || '').replace(/\D/g, '') === cleanRnc)) {
      showToast('Ya existe otro cliente registrado con ese RNC o cédula.', 'danger');
      return;
    }
    const clientData = {
      name: name,
      rnc: rnc,
      phone: document.getElementById('form-client-phone').value.trim(),
      email: email,
      address: document.getElementById('form-client-address').value.trim(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    let savedId = id;
    if (id) {
      // Update
      await getDB().collection(collectionClients).doc(id).update(clientData);
    } else {
      // Create
      clientData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      const newDoc = await getDB().collection(collectionClients).add(clientData);
      savedId = newDoc.id;
    }

    await fetchAllData();

    if (returnToPos) {
      returnToPos = false;
      document.getElementById('pos-client-search').value = clientData.name;
      document.getElementById('pos-client-id').value = savedId;
      document.getElementById('pos-client-rnc').value = clientData.rnc || '';
      posClient = { id: savedId, name: clientData.name, rnc: clientData.rnc || '' };
      
      switchPanel('invoices');
      switchSubTab('invoices', 'pos');
    } else if (returnToInvoice) {
      returnToInvoice = false;
      document.getElementById('form-invoice-client-name').value = clientData.name;
      document.getElementById('form-invoice-client-id').value = savedId;
      document.getElementById('form-invoice-client-rnc').value = clientData.rnc || 'No registrado';
      
      switchPanel('invoices');
      switchSubTab('invoices', 'form');
    } else {
      switchSubTab('clients', 'list');
      renderClientsTable();
    }
  }

  async function deleteClient(id, name) {
    if (!isUserAdmin) {
      showToast('No tienes permisos de administrador para eliminar clientes.', 'danger');
      return;
    }
    let actualName = name;
    if (!actualName) {
      const client = clients.find(c => c.id === id);
      actualName = client ? client.name : 'desconocido';
    }
    if (!await confirmAction(`¿Deseas eliminar al cliente "${actualName}"? Las facturas asociadas se conservarán.`, {
      title: 'Eliminar cliente',
      confirmLabel: 'Eliminar',
      tone: 'danger'
    })) {
      return;
    }

    try {
      await getDB().collection(collectionClients).doc(id).delete();
      await fetchAllData();
      renderClientsTable();
    } catch (e) {
      console.error(e);
      showToast('No se pudo eliminar el cliente.', 'danger');
    }
  }

  // ═══════════════════════════════════════════
  // 6. PRODUCTOS / SERVICIOS DIRECTORY
  // ═══════════════════════════════════════════
  function renderProductsTable() {
    switchPanel('products');

    const sourceEl = document.getElementById('products-source-filter');
    const source = sourceEl ? sourceEl.value : 'creaticos';
    
    if (isPanitas) {
      // La colección activa de Panitas ya fue cargada en products.
    } else if (isCreaticos) {
      products = source === 'creaticos' ? creaticosProducts : futunetProducts;
    } else {
      products = futunetProducts;
    }

    const searchVal = document.getElementById('products-search').value.toLowerCase();
    
    const filtered = products.filter(p => {
      if (p.isActive === false) return false;
      const name = p.name || p.title || '';
      const desc = p.description || p.desc || '';
      const sku = p.sku || '';
      const ref = p.reference || p.ref || '';
      const barcode = p.barcode || '';
      return name.toLowerCase().includes(searchVal) || 
             desc.toLowerCase().includes(searchVal) ||
             sku.toLowerCase().includes(searchVal) ||
             ref.toLowerCase().includes(searchVal) ||
             barcode.toLowerCase().includes(searchVal);
    });

    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted);">No se encontraron productos o servicios.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      const name = p.name || p.title || 'Sin nombre';
      const desc = p.description || p.desc || '—';
      const price = p.price || 0;
      const tax = p.tax !== undefined ? `${p.tax}% ITBIS` : '18% ITBIS (Al facturar)';
      const isCreaticosVal = p._isCreaticos ? 'true' : 'false';

      let codesHtml = '';
      if (p.sku || p.reference || p.ref) {
        const codes = [];
        if (p.sku) codes.push(`SKU: <span class="admin-code-badge">${escapeHTML(p.sku)}</span>`);
        if (p.reference || p.ref) codes.push(`Ref: <span class="admin-code-badge">${escapeHTML(p.reference || p.ref)}</span>`);
        codesHtml = `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; display:flex; gap:8px;">${codes.join(' | ')}</div>`;
      }

      const productActions = isUserAdmin ? `
            <button class="table-btn table-btn-primary" title="Editar" data-erp-click="ERPBilling.openEditProductForm('${escapeAttr(p.id)}', ${isCreaticosVal})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="table-btn table-btn-danger" title="Archivar" data-erp-click="ERPBilling.deleteProduct('${escapeAttr(p.id)}', '', ${isCreaticosVal})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>` : '<span class="admin-readonly-label">Solo lectura</span>';

      tr.innerHTML = `
        <td>
          <strong>${escapeHTML(name)}</strong>
          ${codesHtml}
        </td>
        <td>${escapeHTML(desc)}</td>
        <td>${escapeHTML(formatMoney(price))}</td>
        <td>${escapeHTML(tax)}</td>
        <td>
          <div class="table-actions">
            ${productActions}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function handleModalSourceChange() {
    const source = document.getElementById('form-product-source').value;
    const isFutunet = source === 'futunet';
    
    document.getElementById('futunet-only-fields').style.display = isFutunet ? 'block' : 'none';
    document.getElementById('form-product-tax-group').style.display = isFutunet ? 'none' : 'block';
    
    document.getElementById('label-product-name').textContent = isFutunet ? 'Título del producto (Futunet) *' : 'Concepto / Nombre del Ítem *';
    
    const stockInput = document.getElementById('form-product-stock');
    if (isFutunet) {
      stockInput.setAttribute('required', 'required');
    } else {
      stockInput.removeAttribute('required');
    }
  }

  function openNewProductForm() {
    if (!isUserAdmin) {
      showToast('Solo un administrador ERP puede crear productos.', 'danger');
      return;
    }
    const titleEl = document.getElementById('product-form-title');
    if (titleEl) titleEl.textContent = 'Agregar Producto / Servicio';

    document.getElementById('form-product-id').value = '';
    document.getElementById('form-product-name').value = '';
    document.getElementById('form-product-description').value = '';
    document.getElementById('form-product-price').value = '';
    document.getElementById('form-product-cost').value = '';
    document.getElementById('form-product-tax').value = settings.defaultTax.toString();
    
    document.getElementById('form-product-sku').value = '';
    document.getElementById('form-product-reference').value = '';
    document.getElementById('form-product-barcode').value = '';

    const sourceFilter = document.getElementById('products-source-filter');
    const activeSource = sourceFilter ? sourceFilter.value : 'creaticos';
    
    const sourceSelect = document.getElementById('form-product-source');
    if (sourceSelect) {
      sourceSelect.value = activeSource;
      sourceSelect.removeAttribute('disabled');
    }
    
    document.getElementById('form-product-stock').value = '0';
    document.getElementById('form-product-reorder-point').value = '5';
    document.getElementById('form-product-category').value = 'Otros';

    handleModalSourceChange();
    switchPanel('products');
    switchSubTab('products', 'form');
  }

  function openEditProductForm(productId, isCreaticos) {
    if (!isUserAdmin) {
      showToast('Solo un administrador ERP puede modificar productos.', 'danger');
      return;
    }
    const activeProducts = isPanitas ? products : (isCreaticos ? creaticosProducts : futunetProducts);
    const p = activeProducts.find(item => item.id === productId);
    if (!p) return;

    const titleEl = document.getElementById('product-form-title');
    if (titleEl) {
      titleEl.textContent = isCreaticos ? 'Editar Producto / Servicio (Creaticos)' : 'Editar Producto (Futunet)';
    }

    document.getElementById('form-product-id').value = p.id;
    document.getElementById('form-product-name').value = p.name || p.title || '';
    document.getElementById('form-product-description').value = p.description || p.desc || '';
    document.getElementById('form-product-price').value = p.price;
    document.getElementById('form-product-cost').value = p.cost != null ? p.cost : '';
    
    document.getElementById('form-product-sku').value = p.sku || '';
    document.getElementById('form-product-reference').value = p.reference || p.ref || '';
    document.getElementById('form-product-barcode').value = p.barcode || '';

    const sourceSelect = document.getElementById('form-product-source');
    if (sourceSelect) {
      sourceSelect.value = isCreaticos ? 'creaticos' : 'futunet';
      sourceSelect.setAttribute('disabled', 'disabled');
    }

    if (isCreaticos) {
      document.getElementById('form-product-tax').value = (p.tax !== undefined) ? p.tax.toString() : '18';
    } else {
      document.getElementById('form-product-stock').value = p.stock != null ? p.stock : '0';
      document.getElementById('form-product-reorder-point').value = p.reorderPoint != null ? p.reorderPoint : '5';
      document.getElementById('form-product-category').value = p.category || 'Otros';
    }

    handleModalSourceChange();
    switchPanel('products');
    switchSubTab('products', 'form');
  }

  async function saveProduct(e) {
    e.preventDefault();

    if (!isUserAdmin) {
      showToast('Solo un administrador ERP puede modificar productos.', 'danger');
      return;
    }

    const id = document.getElementById('form-product-id').value;
    const source = document.getElementById('form-product-source').value;
    const isCreaticos = source === 'creaticos';

    const skuVal = document.getElementById('form-product-sku').value.trim();
    const referenceVal = document.getElementById('form-product-reference').value.trim();
    const barcodeVal = document.getElementById('form-product-barcode').value.trim();
    const costVal = Number(document.getElementById('form-product-cost').value || 0);
    if (!Number.isFinite(costVal) || costVal < 0) {
      showToast('El costo unitario debe ser un número válido.', 'danger');
      return;
    }

    try {
      if (isCreaticos) {
        const priceValue = Number(document.getElementById('form-product-price').value);
        const taxValue = Number(document.getElementById('form-product-tax').value);
        if (!Number.isFinite(priceValue) || priceValue < 0 || !Number.isFinite(taxValue) || taxValue < 0 || taxValue > 100) {
          throw new Error('El precio o el ITBIS del producto no es válido.');
        }
        const prodData = {
          name: document.getElementById('form-product-name').value.trim(),
          description: document.getElementById('form-product-description').value.trim(),
          price: priceValue,
          cost: costVal,
          tax: taxValue,
          sku: skuVal,
          reference: referenceVal,
          barcode: barcodeVal
        };

        if (id) {
          await getDB().collection('creaticos_products').doc(id).update(prodData);
        } else {
          await getDB().collection('creaticos_products').add(prodData);
        }
      } else {
        const nameVal = document.getElementById('form-product-name').value.trim();
        const descVal = document.getElementById('form-product-description').value.trim();
        const priceVal = Number(document.getElementById('form-product-price').value);
        const stockVal = Number(document.getElementById('form-product-stock').value);
        const reorderPointVal = Number(document.getElementById('form-product-reorder-point').value || 0);
        const categoryVal = document.getElementById('form-product-category').value;
        if (!Number.isFinite(priceVal) || priceVal < 0 || !Number.isInteger(stockVal) || stockVal < 0 || !Number.isInteger(reorderPointVal) || reorderPointVal < 0) {
          throw new Error('El precio o el inventario del producto no es válido.');
        }

        const prodData = {
          title: nameVal,
          desc: descVal,
          price: priceVal,
          cost: costVal,
          stock: stockVal,
          reorderPoint: reorderPointVal,
          category: categoryVal,
          department: categoryVal.toLowerCase(),
          condition: 'Nuevo',
          isActive: true,
          sku: skuVal,
          reference: referenceVal,
          barcode: barcodeVal,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const targetCollection = isPanitas ? 'panitas_products' : 'products';
        if (id) {
          await getDB().collection(targetCollection).doc(id).update(prodData);
        } else {
          prodData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await getDB().collection(targetCollection).add(prodData);
        }
      }

      await fetchAllData();

      // Check if redirecting back to invoice row
      const redirectRowId = localStorage.getItem('redirect_product_invoice_row');
      if (redirectRowId) {
        localStorage.removeItem('redirect_product_invoice_row');
        localStorage.removeItem('redirect_product_invoice_name');

        const tr = document.getElementById(redirectRowId);
        if (tr) {
          const savedName = document.getElementById('form-product-name').value.trim();
          
          let savedProd = null;
          let compositeId = 'custom';
          
          if (isCreaticos) {
            savedProd = creaticosProducts.find(p => p.name === savedName);
            if (savedProd) compositeId = 'creaticos_' + savedProd.id;
          } else if (isPanitas) {
            savedProd = products.find(p => p.title === savedName);
            if (savedProd) compositeId = 'panitas_' + savedProd.id;
          } else {
            savedProd = futunetProducts.find(p => p.title === savedName);
            if (savedProd) compositeId = 'futunet_' + savedProd.id;
          }

          if (savedProd) {
            const searchInput = tr.querySelector('.row-product-search');
            const idInput = tr.querySelector('.row-product-id');
            const priceInput = tr.querySelector('.row-price');
            const taxSelect = tr.querySelector('.row-tax');

            if (searchInput) searchInput.value = savedName;
            if (idInput) idInput.value = compositeId;
            if (priceInput) priceInput.value = Number(savedProd.price).toFixed(2);
            if (taxSelect) {
              taxSelect.value = (savedProd.tax !== undefined) ? savedProd.tax.toString() : (settings ? settings.defaultTax.toString() : '18');
            }
          }
          
          switchPanel('invoices');
          switchSubTab('invoices', 'form');
          calculateInvoiceFormTotals();
          return;
        }
      }

      switchSubTab('products', 'list');
      renderProductsTable();
    } catch (err) {
      console.error(err);
      showToast('Error al guardar el producto: ' + err.message, 'danger');
    }
  }

  async function deleteProduct(id, name, isCreaticos) {
    if (!isUserAdmin) {
      showToast('No tienes permisos de administrador para archivar ítems.', 'danger');
      return;
    }
    let actualName = name;
    if (!actualName) {
      const list = isPanitas ? products : (isCreaticos ? creaticosProducts : futunetProducts);
      const prod = list.find(p => p.id === id);
      actualName = prod ? (prod.name || prod.title) : 'desconocido';
    }
    if (!await confirmAction(`¿Deseas archivar el ítem "${actualName}"? Dejará de aparecer en ventas y conservará su historial.`, {
      title: 'Archivar ítem',
      confirmLabel: 'Archivar',
      tone: 'danger'
    })) {
      return;
    }

    try {
      const coll = isCreaticos ? 'creaticos_products' : (isPanitas ? 'panitas_products' : 'products');
      await getDB().collection(coll).doc(id).update({
        isActive: false,
        archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
        archivedBy: currentUser.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await fetchAllData();
      renderProductsTable();
    } catch (e) {
      console.error(e);
      showToast('Error al archivar el ítem: ' + e.message, 'danger');
    }
  }

  // ═══════════════════════════════════════════
  // 7. CONFIGURACIÓN (SETTINGS) PANEL
  // ═══════════════════════════════════════════
  function loadSettingsForm() {
    switchPanel('settings');

    document.getElementById('set-company-name').value = settings.name;
    document.getElementById('set-company-rnc').value = settings.rnc;
    document.getElementById('set-company-phone').value = settings.phone;
    document.getElementById('set-company-email').value = settings.email;
    document.getElementById('set-company-address').value = settings.address;
    
    Object.entries(NCF_FIELDS).forEach(([type, fields]) => {
      const slug = type.toLowerCase();
      const prefixInput = document.getElementById(`set-ncf-${slug}-prefix`);
      const sequenceInput = document.getElementById(`set-ncf-${slug}-seq`);
      const startInput = document.getElementById(`set-ncf-${slug}-start`);
      const endInput = document.getElementById(`set-ncf-${slug}-end`);
      const expiryInput = document.getElementById(`set-ncf-${slug}-expiry`);
      if (prefixInput) prefixInput.value = settings[fields.prefix] || type;
      if (sequenceInput) sequenceInput.value = settings[fields.sequence] || 1;
      if (startInput) startInput.value = settings[fields.start] || 1;
      if (endInput) endInput.value = settings[fields.end] || 99999999;
      if (expiryInput) expiryInput.value = settings[fields.expiry] || '';
    });
    const lowWarningInput = document.getElementById('set-ncf-low-warning');
    if (lowWarningInput) lowWarningInput.value = settings.ncfLowStockWarning || 25;

    document.getElementById('set-invoice-prefix').value = settings.invoicePrefix;
    document.getElementById('set-invoice-seq').value = settings.nextInvoiceNum;
    document.getElementById('set-default-tax').value = settings.defaultTax.toString();
    
    document.getElementById('set-quote-prefix').value = settings.quotePrefix || 'COT-';
    document.getElementById('set-quote-seq').value = settings.nextQuoteNum || 1001;
    
    document.getElementById('set-proforma-prefix').value = settings.proformaPrefix || 'PROF-';
    document.getElementById('set-proforma-seq').value = settings.nextProformaNum || 1001;
    const commercialFields = {
      'set-quote-validity-days': settings.quoteValidityDays || 15,
      'set-minimum-margin': settings.minimumMarginPct == null ? 15 : settings.minimumMarginPct,
      'set-cost-coverage': settings.minimumCostCoveragePct == null ? 80 : settings.minimumCostCoveragePct,
      'set-max-operator-discount': settings.maxOperatorDiscountPct == null ? 10 : settings.maxOperatorDiscountPct,
      'set-collection-reminder-days': settings.collectionReminderDays == null ? 3 : settings.collectionReminderDays
    };
    Object.entries(commercialFields).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) input.value = value;
    });
    const approvalInput = document.getElementById('set-commercial-approval-enabled');
    if (approvalInput) approvalInput.checked = settings.commercialApprovalEnabled !== false;

    const restaurantTablesInput = document.getElementById('set-restaurant-tables');
    if (restaurantTablesInput) {
      restaurantTablesInput.value = getConfiguredRestaurantTables().join('\n');
    }

    // Ticket Customization
    document.getElementById('set-ticket-slogan').value = settings.ticketSlogan || '';
    document.getElementById('set-ticket-instagram').value = settings.ticketInstagram || '';
    document.getElementById('set-ticket-footer').value = settings.ticketFooter || '';

    // RNC API Key
    document.getElementById('set-rnc-api-key').value = '';
  }

  async function saveSettings(e) {
    e.preventDefault();

    if (!isUserAdmin) {
      showToast('No tienes permisos de administrador para guardar configuraciones.', 'danger');
      return;
    }

    const rawDefaultTax = Number(document.getElementById('set-default-tax').value);
    const rncApiKey = document.getElementById('set-rnc-api-key').value.trim();
    let restaurantTables = settings.restaurantTables || DEFAULT_RESTAURANT_TABLES;
    if (isPanitas) {
      try {
        restaurantTables = BillingCore.normalizeRestaurantTables(document.getElementById('set-restaurant-tables').value);
      } catch (error) {
        showToast(error.message, 'danger');
        return;
      }
    }
    const updated = {
      name: document.getElementById('set-company-name').value.trim(),
      rnc: document.getElementById('set-company-rnc').value.trim(),
      phone: document.getElementById('set-company-phone').value.trim(),
      email: document.getElementById('set-company-email').value.trim(),
      address: document.getElementById('set-company-address').value.trim(),
      
      ncfB01Prefix: document.getElementById('set-ncf-b01-prefix').value.trim(),
      ncfB01Seq: Number(document.getElementById('set-ncf-b01-seq').value) || 1,
      ncfB02Prefix: document.getElementById('set-ncf-b02-prefix').value.trim(),
      ncfB02Seq: Number(document.getElementById('set-ncf-b02-seq').value) || 1,
      ncfB03Prefix: document.getElementById('set-ncf-b03-prefix').value.trim(),
      ncfB03Seq: Number(document.getElementById('set-ncf-b03-seq').value) || 1,
      ncfB04Prefix: document.getElementById('set-ncf-b04-prefix').value.trim(),
      ncfB04Seq: Number(document.getElementById('set-ncf-b04-seq').value) || 1,
      
      ncfB14Prefix: document.getElementById('set-ncf-b14-prefix').value.trim(),
      ncfB14Seq: Number(document.getElementById('set-ncf-b14-seq').value) || 1,
      ncfB15Prefix: document.getElementById('set-ncf-b15-prefix').value.trim(),
      ncfB15Seq: Number(document.getElementById('set-ncf-b15-seq').value) || 1,
      ncfB12Prefix: document.getElementById('set-ncf-b12-prefix').value.trim(),
      ncfB12Seq: Number(document.getElementById('set-ncf-b12-seq').value) || 1,

      invoicePrefix: document.getElementById('set-invoice-prefix').value.trim(),
      nextInvoiceNum: Number(document.getElementById('set-invoice-seq').value) || 1001,
      defaultTax: rawDefaultTax,
      
      quotePrefix: document.getElementById('set-quote-prefix').value.trim(),
      nextQuoteNum: Number(document.getElementById('set-quote-seq').value) || 1001,
      
      proformaPrefix: document.getElementById('set-proforma-prefix').value.trim(),
      nextProformaNum: Number(document.getElementById('set-proforma-seq').value) || 1001,

      quoteValidityDays: Number(document.getElementById('set-quote-validity-days').value) || 15,
      minimumMarginPct: Number(document.getElementById('set-minimum-margin').value),
      minimumCostCoveragePct: Number(document.getElementById('set-cost-coverage').value),
      maxOperatorDiscountPct: Number(document.getElementById('set-max-operator-discount').value),
      collectionReminderDays: Number(document.getElementById('set-collection-reminder-days').value) || 3,
      commercialApprovalEnabled: document.getElementById('set-commercial-approval-enabled').checked,

      ticketSlogan: document.getElementById('set-ticket-slogan').value.trim(),
      ticketInstagram: document.getElementById('set-ticket-instagram').value.trim(),
      ticketFooter: document.getElementById('set-ticket-footer').value.trim(),
      ncfLowStockWarning: Number(document.getElementById('set-ncf-low-warning').value) || 25,
      ...(isPanitas ? { restaurantTables } : {})
    };

    Object.entries(NCF_FIELDS).forEach(([type, fields]) => {
      const slug = type.toLowerCase();
      updated[fields.start] = Number(document.getElementById(`set-ncf-${slug}-start`).value) || 1;
      updated[fields.end] = Number(document.getElementById(`set-ncf-${slug}-end`).value) || 99999999;
      updated[fields.expiry] = document.getElementById(`set-ncf-${slug}-expiry`).value || '';
    });

    const sequenceFields = [
      'ncfB01Seq', 'ncfB02Seq', 'ncfB03Seq', 'ncfB04Seq',
      'ncfB12Seq', 'ncfB14Seq', 'ncfB15Seq',
      'nextInvoiceNum', 'nextQuoteNum', 'nextProformaNum'
    ];
    const prefixesAreValid = Object.entries(NCF_FIELDS).every(([type, fields]) => updated[fields.prefix].toUpperCase() === type);
    const sequencesAreValid = sequenceFields.every(field => Number.isInteger(updated[field]) && updated[field] > 0 && updated[field] <= 99999999);
    const rangesAreValid = Object.values(NCF_FIELDS).every(fields =>
      Number.isInteger(updated[fields.start]) &&
      Number.isInteger(updated[fields.end]) &&
      updated[fields.start] > 0 &&
      updated[fields.end] >= updated[fields.start] &&
      updated[fields.sequence] >= updated[fields.start] &&
      updated[fields.sequence] <= updated[fields.end]
    );
    const commercialRulesAreValid = Number.isInteger(updated.quoteValidityDays) && updated.quoteValidityDays >= 1 && updated.quoteValidityDays <= 365 &&
      Number.isFinite(updated.minimumMarginPct) && updated.minimumMarginPct >= 0 && updated.minimumMarginPct <= 100 &&
      Number.isFinite(updated.minimumCostCoveragePct) && updated.minimumCostCoveragePct >= 0 && updated.minimumCostCoveragePct <= 100 &&
      Number.isFinite(updated.maxOperatorDiscountPct) && updated.maxOperatorDiscountPct >= 0 && updated.maxOperatorDiscountPct <= 100 &&
      Number.isInteger(updated.collectionReminderDays) && updated.collectionReminderDays >= 0 && updated.collectionReminderDays <= 90;
    if (!prefixesAreValid || !sequencesAreValid || !rangesAreValid || !commercialRulesAreValid || ![0, 16, 18].includes(rawDefaultTax)) {
      showToast('Revisa los prefijos, secuencias, rangos autorizados y el ITBIS predeterminado.', 'danger');
      return;
    }
    normalizeNcfSettings(updated);

    try {
      const db = getDB();
      const batch = db.batch();
      batch.set(db.collection(collectionSettings).doc('general'), {
        ...updated,
        rncApiKey: firebase.firestore.FieldValue.delete()
      }, { merge: true });
      if (rncApiKey) {
        batch.set(db.collection(collectionSecrets).doc('general'), { rncApiKey: rncApiKey }, { merge: true });
      }
      await batch.commit();
      
      // Reload settings in cache
      await loadSettings();
      if (isPanitas) renderActiveTables();
      showToast('Configuración guardada correctamente.', 'success');
      
      initDashboard();
    } catch (err) {
      console.error(err);
      showToast('No se pudo guardar la configuración.', 'danger');
    }
  }

  // ═══════════════════════════════════════════
  // 8. MODALS OPEN/CLOSE HELPERS
  // ═══════════════════════════════════════════
  function getModalFocusable(modal) {
    return Array.from(modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
  }

  function initializeModalAccessibility() {
    document.querySelectorAll('.admin-modal').forEach(modal => {
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      modal.tabIndex = -1;
      const title = modal.querySelector('.admin-modal-header h2');
      if (title) {
        if (!title.id) title.id = `${modal.id}-title`;
        modal.setAttribute('aria-labelledby', title.id);
      }
      modal.querySelectorAll('.admin-modal-close').forEach(button => {
        button.type = 'button';
        if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', 'Cerrar ventana');
      });
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      lastFocusedBeforeModal = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      modal.inert = false;
      document.body.classList.add('erp-modal-open');
      requestAnimationFrame(() => {
        const focusable = getModalFocusable(modal);
        (focusable[0] || modal).focus();
      });
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      if (!document.querySelector('.admin-modal.is-open')) document.body.classList.remove('erp-modal-open');
      if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus();
      }
      lastFocusedBeforeModal = null;
    }
  }

  // Sub-tabs navigation & custom helper actions
  function switchSubTab(tabGroup, tabName) {
    const btns = document.querySelectorAll(`#panel-${tabGroup} .erp-subtab-btn`);
    btns.forEach(btn => btn.classList.remove('is-active'));

    const activeBtn = document.getElementById(`subtab-btn-${tabGroup}-${tabName}`);
    if (activeBtn) activeBtn.classList.add('is-active');

    const contents = document.querySelectorAll(`#panel-${tabGroup} .erp-tab-content`);
    contents.forEach(c => c.classList.remove('is-active'));

    const activeContent = document.getElementById(`subtab-${tabGroup}-${tabName}`);
    if (activeContent) activeContent.classList.add('is-active');

    // Auto-initialize form with clean defaults if manually switching to empty form tab
    if (tabName === 'form' && !isInitializingForm) {
      isInitializingForm = true;
      const idVal = document.getElementById(tabGroup === 'invoices' ? 'form-invoice-id' : (tabGroup === 'clients' ? 'form-client-id' : 'form-product-id')).value;
      if (!idVal) {
        if (tabGroup === 'invoices') {
          openNewInvoiceForm();
        } else if (tabGroup === 'clients') {
          openNewClientForm();
        } else if (tabGroup === 'products') {
          openNewProductForm();
        }
      }
      isInitializingForm = false;
    }

    if (tabGroup === 'invoices' && tabName === 'pos') {
      renderPosProducts();
      renderPosCart();
    }

    if (tabGroup === 'invoices' && tabName === 'sessions') {
      renderSessionsHistoryTable();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function renderSessionsHistoryTable() {
    const tbody = document.getElementById('sessions-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted);">Cargando historial de cajas...</td></tr>';
    
    try {
      const snap = await getDB().collection(collectionCashSessions)
        .orderBy('openedAt', 'desc')
        .limit(50)
        .get();
        
      tbody.innerHTML = '';
      
      if (snap.empty) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted);">No hay sesiones de caja registradas.</td></tr>';
        return;
      }
      
      snap.forEach(doc => {
        const s = doc.data();
        const openedAtDate = s.openedAt ? new Date(s.openedAt.seconds * 1000) : null;
        const closedAtDate = s.closedAt ? new Date(s.closedAt.seconds * 1000) : null;
        
        const openedStr = openedAtDate ? openedAtDate.toLocaleString('es-DO', { hour12: true }) : 'N/D';
        const closedStr = closedAtDate ? closedAtDate.toLocaleString('es-DO', { hour12: true }) : 'En Curso';
        
        const cajero = s.openedBy || 'N/D';
        const base = Number(s.initialCash) || 0;
        
        const totalSalesCash = Number(s.salesCash || 0);
        const expectedCash = base + totalSalesCash;
        
        const realCash = s.closedAt ? Number(s.realCash ?? s.realCashCount ?? 0) : null;
        const diff = s.closedAt ? (realCash - expectedCash) : 0;
        
        let diffStr = '—';
        let diffColor = 'inherit';
        if (s.closedAt) {
          diffStr = formatMoney(diff);
          if (diff > 0) {
            diffStr = `+${diffStr}`;
            diffColor = 'var(--success)';
          } else if (diff < 0) {
            diffColor = '#ef4444';
          }
        }
        
        const status = s.closedAt ? 'Cerrada' : 'Abierta';
        const statusColor = s.closedAt ? 'var(--text-muted)' : 'var(--success)';
        const notes = s.notes || s.closeNotes || '—';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHTML(openedStr)}</td>
          <td>${escapeHTML(closedStr)}</td>
          <td>${escapeHTML(cajero)}</td>
          <td>${escapeHTML(formatMoney(base))}</td>
          <td>${escapeHTML(formatMoney(expectedCash))}</td>
          <td>${realCash !== null ? escapeHTML(formatMoney(realCash)) : '—'}</td>
          <td style="color:${diffColor}; font-weight:600;">${escapeHTML(diffStr)}</td>
          <td><span style="color:${statusColor}; font-weight:600;">${escapeHTML(status)}</span></td>
          <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHTML(notes)}">${escapeHTML(notes)}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:#ef4444;">Error al cargar historial: ${escapeHTML(e.message)}</td></tr>`;
    }
  }

  // ─── TOUCH POS (PUNTO DE VENTA) METHODS ───
  function renderPosProducts() {
    const grid = document.getElementById('pos-products-grid-list');
    if (!grid) return;
    grid.innerHTML = '';

    const searchVal = document.getElementById('pos-product-search') ? document.getElementById('pos-product-search').value.toLowerCase() : '';

    let list = [];
    if (isPanitas) {
      list = products;
      if (posActiveCategory !== 'all') {
        list = list.filter(p => {
          const category = String(p.category || 'comida').toLowerCase();
          if (posActiveCategory === 'comida') {
            return category.includes('comida') || category.includes('plato') || category.includes('hamburg') || category.includes('hot') || category.includes('sándwich') || category.includes('sandwich');
          } else if (posActiveCategory === 'bebidas') {
            return category.includes('bebida') || category.includes('jugo') || category.includes('refresco') || category.includes('agua') || category.includes('trago');
          }
          return category === posActiveCategory;
        });
      }
    } else {
      if (posActiveCategory === 'all' || posActiveCategory === 'creaticos') {
        list = list.concat(creaticosProducts);
      }
      if (posActiveCategory === 'all' || posActiveCategory === 'futunet') {
        list = list.concat(futunetProducts);
      }
    }

    list = list.filter(p => p.isActive !== false);

    if (searchVal) {
      list = list.filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const ref = (p.reference || '').toLowerCase();
        const barcode = (p.barcode || '').toLowerCase();
        return name.includes(searchVal) || sku.includes(searchVal) || ref.includes(searchVal) || barcode.includes(searchVal);
      });
    }

    if (list.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No se encontraron productos.</div>';
      return;
    }

    list.forEach(p => {
      const isCr = p._isCreaticos;
      const badgeClass = isPanitas ? 'badge-futunet' : (isCr ? 'badge-creaticos' : 'badge-futunet');
      const badgeLabel = isPanitas ? (p.category || 'Comida') : (isCr ? 'Creaticos' : 'Futunet');
      const name = p.name || p.title || '';
      const code = p.sku || p.reference || 'S/C';
      const price = Number(p.price);

      const card = document.createElement('div');
      card.className = 'pos-product-card';
      
      let stockHtml = '';
      let isOutOfStock = false;
      if (p.stock !== undefined && p.stock !== null) {
        const stockNum = Number(p.stock);
        if (stockNum <= 0) {
          isOutOfStock = true;
          stockHtml = `<span class="pos-prod-stock" style="font-size:0.7rem; font-weight:700; color:#ef4444; background:#fee2e2; padding:2px 6px; border-radius:4px; margin-left:auto;">Agotado</span>`;
        } else if (stockNum < 5) {
          stockHtml = `<span class="pos-prod-stock" style="font-size:0.7rem; font-weight:700; color:#ea580c; background:#ffedd5; padding:2px 6px; border-radius:4px; margin-left:auto;">Stock: ${stockNum}</span>`;
        } else {
          stockHtml = `<span class="pos-prod-stock" style="font-size:0.7rem; font-weight:600; color:#16a34a; background:#dcfce7; padding:2px 6px; border-radius:4px; margin-left:auto;">Stock: ${stockNum}</span>`;
        }
      }

      if (isOutOfStock) {
        card.style.opacity = '0.6';
        card.style.cursor = 'not-allowed';
      }

      card.addEventListener('click', () => addPosCartItem(p));
      card.innerHTML = `
        <div class="pos-prod-info">
          <div style="display:flex; align-items:center; width:100%; gap:4px; margin-bottom:4px;">
            <span class="pos-prod-badge ${badgeClass}">${escapeHTML(badgeLabel)}</span>
            ${stockHtml}
          </div>
          <h4 class="pos-prod-title" title="${escapeHTML(name)}" style="margin-top:0;">${escapeHTML(name)}</h4>
          <span class="pos-prod-code">Cod: ${escapeHTML(code)}</span>
        </div>
        <div class="pos-prod-footer">
          <span class="pos-prod-price">${escapeHTML(formatMoney(price))}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderPosCart() {
    const cartList = document.getElementById('pos-cart-items-list');
    if (!cartList) return;
    cartList.innerHTML = '';

    if (posCart.length === 0) {
      cartList.innerHTML = '<div class="pos-cart-empty">Venta vacía. Selecciona productos a la derecha o escanea un código.</div>';
      updatePosTotals();
      return;
    }

    posCart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'pos-cart-item';
      const sub = item.price * item.qty;
      const sourceBadge = item.source === 'panitas' ? ' (P)' : (item.isCreaticos ? ' (C)' : ' (F)');

      itemEl.innerHTML = `
        <div class="pos-item-info">
          <div class="pos-item-title">${escapeHTML(item.name)}</div>
          <div class="pos-item-meta">${escapeHTML(formatMoney(item.price))} c/u${sourceBadge}</div>
          ${isPanitas ? `
            <input type="text" class="form-input pos-item-kitchen-note" data-pos-item-note="${index}" value="${escapeAttr(item.notes || '')}" maxlength="300" placeholder="Nota para cocina (sin cebolla, alergia...)" aria-label="Nota de cocina para ${escapeAttr(item.name)}" />
            <label class="pos-item-allergy"><input type="checkbox" data-pos-item-allergy="${index}" ${item.allergyWarning ? 'checked' : ''} /> Aviso de alergia</label>
          ` : ''}
        </div>
        <div class="pos-item-qty-controls">
          <button type="button" class="pos-qty-btn" data-erp-click="ERPBilling.changePosCartItemQty(${index}, -1)">-</button>
          <span class="pos-qty-val">${item.qty}</span>
          <button type="button" class="pos-qty-btn" data-erp-click="ERPBilling.changePosCartItemQty(${index}, 1)">+</button>
        </div>
        <div class="pos-item-price">${escapeHTML(formatMoney(sub))}</div>
        <button type="button" class="pos-btn-icon" data-erp-click="ERPBilling.removePosCartItem(${index})" style="padding:4px; margin-left:4px;" title="Quitar item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      `;
      cartList.appendChild(itemEl);
    });

    updatePosTotals();
  }

  function updatePosTotals() {
    let subtotal = 0;
    let itbis = 0;

    posCart.forEach(item => {
      const itemSub = item.price * item.qty;
      const taxRate = item.tax || 0;
      subtotal += itemSub;
      itbis += itemSub * (taxRate / 100);
    });

    const grandTotal = subtotal + itbis;

    document.getElementById('pos-total-subtotal').textContent = formatMoney(subtotal);
    document.getElementById('pos-total-itbis').textContent = formatMoney(itbis);
    document.getElementById('pos-total-grand').textContent = formatMoney(grandTotal);

    const nfcAmountEl = document.getElementById('nfc-payment-amount');
    if (nfcAmountEl) {
      nfcAmountEl.textContent = formatMoney(grandTotal);
    }
  }

  function addPosCartItem(p) {
    if (!activeCashSession) {
      showToast('Debes abrir una sesión de caja antes de agregar productos al carrito.', 'warning');
      handleCashSessionAction();
      return;
    }

    if (p.stock !== undefined && p.stock !== null && Number(p.stock) <= 0) {
      showToast(`El producto "${p.name || p.title}" está agotado.`, 'warning');
      return;
    }

    const unitPrice = Number(p.price);
    const taxRate = p.tax !== undefined ? Number(p.tax) : (settings ? Number(settings.defaultTax) : 18);
    if (!Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
      showToast(`El producto "${p.name || p.title}" tiene precio o impuesto inválido.`, 'danger');
      return;
    }

    const isCr = Boolean(p._isCreaticos);
    const sourcePrefix = isPanitas ? 'panitas' : (isCr ? 'creaticos' : 'futunet');
    const pId = sourcePrefix + '_' + p.id;
    
    const existingIndex = posCart.findIndex(item => item.productId === pId);
    if (existingIndex > -1) {
      if (p.stock !== undefined && p.stock !== null && posCart[existingIndex].qty >= Number(p.stock)) {
        showToast(`Stock insuficiente. Disponible: ${p.stock}`, 'warning');
        return;
      }
      posCart[existingIndex].qty += 1;
    } else {
      posCart.push({
        productId: pId,
        name: p.name || p.title || '',
        price: unitPrice,
        qty: 1,
        tax: taxRate,
        isCreaticos: isCr,
        source: sourcePrefix
      });
    }
    renderPosCart();
    playBeepTone(800, 0.05);
  }

  function changePosCartItemQty(index, delta) {
    if (index < 0 || index >= posCart.length) return;
    const item = posCart[index];
    if (delta > 0) {
      const originalId = item.productId.replace(/^(creaticos_|futunet_|panitas_)/, '');
      const prod = products.find(p => p.id === originalId) || 
                   creaticosProducts.find(p => p.id === originalId) || 
                   futunetProducts.find(p => p.id === originalId);
      if (prod && prod.stock !== undefined && prod.stock !== null && item.qty >= Number(prod.stock)) {
        showToast(`Stock insuficiente. Disponible: ${prod.stock}`, 'warning');
        return;
      }
    }
    
    item.qty += delta;
    if (item.qty <= 0) {
      posCart.splice(index, 1);
    }
    renderPosCart();
    playBeepTone(600, 0.04);
  }

  function removePosCartItem(index) {
    if (index < 0 || index >= posCart.length) return;
    posCart.splice(index, 1);
    renderPosCart();
    playBeepTone(400, 0.08);
  }

  function printKitchenTicket() {
    const rawTable = document.getElementById('pos-restaurant-table').value.trim();
    const clientName = document.getElementById('pos-restaurant-client-name').value.trim();
    if (!rawTable) {
      showToast('Por favor, especifique la mesa antes de imprimir el ticket de cocina.', 'warning');
      return;
    }
    let table = '';
    try {
      table = BillingCore.normalizeTableName(rawTable);
    } catch (error) {
      showToast(error.message, 'danger');
      return;
    }
    if (posCart.length === 0) {
      showToast('El carrito está vacío.', 'warning');
      return;
    }

    const ticketEl = document.getElementById('kitchen-ticket-print');
    if (!ticketEl) return;
    const generalNotes = document.getElementById('pos-restaurant-order-notes').value.trim().slice(0, 500);
    const priority = document.getElementById('pos-restaurant-priority').value;

    let itemsHtml = '';
    posCart.forEach(item => {
      itemsHtml += `
        <div style="font-size:12pt; border-bottom:1px dashed #ccc; padding:4px 0;">
          <div style="font-weight:bold;">${item.qty}x ${escapeHTML(item.name)}</div>
          ${item.notes ? `<div style="font-size:10pt; font-weight:bold; margin-top:3px;">${item.allergyWarning ? '⚠️ ALERGIA · ' : 'NOTA: '}${escapeHTML(item.notes)}</div>` : ''}
        </div>
      `;
    });

    const now = new Date();
    ticketEl.innerHTML = `
      <div style="text-align:center; font-family:monospace; width: 100%;">
        <h2 style="margin: 0 0 10px; font-size: 16pt; letter-spacing: 1px;">ORDEN DE COCINA</h2>
        <div style="font-size: 14pt; margin-bottom: 10px; border:2px solid #000; padding:5px; font-weight:bold;">
          MESA: ${escapeHTML(table)}
        </div>
        <div style="font-size: 11pt; margin-bottom: 10px;">
          Cliente: ${escapeHTML(clientName || 'Consumidor Final')}
        </div>
        ${priority !== 'normal' ? `<div style="font-size:12pt; font-weight:bold; border:2px solid #000; padding:4px; margin-bottom:10px;">${priority === 'urgent' ? 'URGENTE' : 'PRIORIDAD'}</div>` : ''}
        ${generalNotes ? `<div style="font-size:11pt; text-align:left; font-weight:bold; margin-bottom:10px;">NOTA GENERAL: ${escapeHTML(generalNotes)}</div>` : ''}
        <div style="font-size: 9pt; margin-bottom: 15px; color:#555;">
          Fecha: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}
        </div>
        <div style="text-align:left; margin-bottom:15px; border-top:2px solid #000; padding-top:10px;">
          ${itemsHtml}
        </div>
        <div style="font-size: 10pt; margin-top:20px; font-weight:bold;">
          ¡Buen Provecho!
        </div>
      </div>
    `;

    document.body.classList.add('printing-kitchen-ticket');
    window.print();
    document.body.classList.remove('printing-kitchen-ticket');
  }

  function restaurantEventData(table, fromStatus, toStatus, action, revision, cycle) {
    return {
      orderId: table,
      table,
      fromStatus: fromStatus || '',
      toStatus,
      action,
      revision,
      cycle,
      userId: currentUser.uid,
      userEmail: currentUser.email || '',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  function getConfiguredRestaurantTables() {
    try {
      return BillingCore.normalizeRestaurantTables(settings && settings.restaurantTables
        ? settings.restaurantTables
        : DEFAULT_RESTAURANT_TABLES);
    } catch (error) {
      return DEFAULT_RESTAURANT_TABLES.slice();
    }
  }

  function updateRestaurantConnectionUI(state = 'auto') {
    const statusEl = document.getElementById('kds-connection-status');
    if (!statusEl) return;
    const isOffline = state === 'offline' || !navigator.onLine;
    const hasError = state === 'error';
    const isLive = !isOffline && !hasError && (
      state === 'connected' || (state === 'auto' && Boolean(unsubscribeRestaurantOrders) && restaurantOrdersLoaded)
    );
    statusEl.className = `kds-connection-status ${isLive ? 'is-online' : (isOffline || hasError ? 'is-offline' : 'is-connecting')}`;
    statusEl.textContent = isLive
      ? 'En vivo'
      : (isOffline ? 'Sin conexión' : (hasError ? 'Error de sincronización' : 'Conectando...'));
  }

  function stopRestaurantRealtime() {
    if (unsubscribeRestaurantOrders) unsubscribeRestaurantOrders();
    unsubscribeRestaurantOrders = null;
    if (restaurantClockTimer) clearInterval(restaurantClockTimer);
    restaurantClockTimer = null;
  }

  function startRestaurantRealtime() {
    stopRestaurantRealtime();
    updateRestaurantConnectionUI('connecting');
    unsubscribeRestaurantOrders = getDB().collection('panitas_table_orders')
      .onSnapshot(snapshot => {
        restaurantOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        restaurantOrdersLoaded = true;
        updateRestaurantConnectionUI('connected');
        renderActiveTables();
        renderKds();
      }, error => {
        console.error('Error in restaurant realtime listener:', error);
        unsubscribeRestaurantOrders = null;
        updateRestaurantConnectionUI('error');
        showToast('Se perdió la sincronización de comandas. Usa Actualizar para reintentar.', 'danger');
      });
    restaurantClockTimer = setInterval(() => {
      const kdsPanel = document.getElementById('panel-kds');
      if (kdsPanel && kdsPanel.classList.contains('is-active')) renderKds();
    }, 30000);
  }

  async function saveTableOrder() {
    if (!currentUser || !currentUser.uid) return;
    if (posCart.length === 0) {
      showToast('El carrito está vacío.', 'warning');
      return;
    }

    try {
      const tableInput = document.getElementById('pos-restaurant-table');
      const table = BillingCore.normalizeTableName(tableInput.value);
      tableInput.value = table;
      const clientName = document.getElementById('pos-restaurant-client-name').value.trim().slice(0, 150) || 'Consumidor Final';
      const notes = document.getElementById('pos-restaurant-order-notes').value.trim().slice(0, 500);
      const priority = document.getElementById('pos-restaurant-priority').value;
      if (!['normal', 'high', 'urgent'].includes(priority)) throw new Error('Prioridad de orden no válida.');

      const items = posCart.map(item => ({
        productId: String(item.productId || '').slice(0, 150),
        name: String(item.name || '').trim().slice(0, 150),
        price: BillingCore.roundMoney(item.price),
        qty: Number(item.qty),
        tax: Number(item.tax || 0),
        notes: String(item.notes || '').trim().slice(0, 300),
        modifiers: Array.isArray(item.modifiers) ? item.modifiers.map(String).slice(0, 10) : [],
        allergyWarning: Boolean(item.allergyWarning)
      }));
      if (items.some(item => !item.name || !Number.isFinite(item.price) || item.price < 0 || !Number.isInteger(item.qty) || item.qty < 1 || !Number.isFinite(item.tax) || item.tax < 0 || item.tax > 100)) {
        throw new Error('La orden contiene artículos inválidos.');
      }

      const db = getDB();
      const orderRef = db.collection('panitas_table_orders').doc(table);
      const eventRef = db.collection('panitas_order_events').doc();

      await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(orderRef);
        const existing = snapshot.exists ? snapshot.data() : null;
        const previousStatus = existing ? (existing.status || 'pending') : '';
        const startsNewCycle = !existing || ['closed', 'cancelled'].includes(previousStatus);
        if (existing && ['served', 'pending_payment'].includes(previousStatus)) {
          throw new Error('La orden ya fue servida. Debe cobrarse o cancelarse antes de editarla.');
        }

        const itemsChanged = existing ? BillingCore.restaurantItemsChanged(existing.items, items) : true;
        const nextStatus = startsNewCycle || (itemsChanged && previousStatus !== 'pending') ? 'pending' : (previousStatus || 'pending');
        if (existing && !startsNewCycle && !BillingCore.canTransitionRestaurantOrder(previousStatus, nextStatus)) {
          throw new Error(`No se puede cambiar la orden de ${previousStatus} a ${nextStatus}.`);
        }

        const revision = Number(existing && existing.revision || 0) + 1;
        const cycle = startsNewCycle ? Number(existing && existing.cycle || 0) + 1 : Number(existing.cycle || 1);
        const statusChanged = startsNewCycle || previousStatus !== nextStatus;
        const now = firebase.firestore.FieldValue.serverTimestamp();
        const orderData = {
          table,
          clientName,
          items,
          notes,
          priority,
          status: nextStatus,
          waiterName: currentUser.displayName || currentUser.email || 'Mesero',
          createdBy: startsNewCycle ? currentUser.uid : (existing.createdBy || currentUser.uid),
          updatedBy: currentUser.uid,
          revision,
          cycle,
          createdAt: startsNewCycle ? now : (existing.createdAt || now),
          statusChangedAt: statusChanged ? now : (existing.statusChangedAt || existing.updatedAt || now),
          updatedAt: now
        };

        transaction.set(orderRef, orderData);
        transaction.set(eventRef, restaurantEventData(
          table,
          previousStatus,
          nextStatus,
          startsNewCycle ? 'created' : (itemsChanged ? 'items_updated' : 'details_updated'),
          revision,
          cycle
        ));
      });

      showToast(`Orden de ${table} guardada y sincronizada con cocina.`, 'success');
      clearPosCart();
    } catch (error) {
      console.error('Error saving table order:', error);
      showToast('No se pudo guardar la orden: ' + error.message, 'danger');
    }
  }

  async function refreshRestaurantOrders() {
    const snapshot = await getDB().collection('panitas_table_orders').get();
    restaurantOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    restaurantOrdersLoaded = true;
    renderActiveTables();
    renderKds();
  }

  async function refreshActiveTables() {
    try {
      await refreshRestaurantOrders();
      if (!unsubscribeRestaurantOrders) startRestaurantRealtime();
      updateRestaurantConnectionUI();
    } catch (error) {
      console.error('Error refreshing active tables:', error);
      updateRestaurantConnectionUI('error');
      const listEl = document.getElementById('pos-restaurant-tables-list');
      if (listEl) listEl.innerHTML = '<div class="restaurant-empty-state is-error">Error al cargar el plano de mesas.</div>';
    }
  }

  function renderActiveTables() {
    const listEl = document.getElementById('pos-restaurant-tables-list');
    if (!listEl || !restaurantOrdersLoaded) return;
    listEl.innerHTML = '';

    const activeOrders = new Map();
    restaurantOrders.filter(BillingCore.isActiveRestaurantOrder).forEach(order => activeOrders.set(order.table || order.id, order));
    const configuredTables = getConfiguredRestaurantTables();
    const allTables = [...configuredTables];
    activeOrders.forEach((order, table) => { if (!allTables.includes(table)) allTables.push(table); });

    allTables.forEach(tableName => {
      const order = activeOrders.get(tableName);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `restaurant-table-card ${order ? 'is-occupied' : 'is-free'} ${order ? `status-${order.status || 'pending'}` : ''}`;
      if (order) {
        const meta = BillingCore.restaurantStatusMeta(order.status || 'pending');
        card.setAttribute('aria-label', `${tableName}, ${meta.label}, ${formatMoney(BillingCore.restaurantOrderTotal(order.items))}`);
        card.innerHTML = `
          <strong>🍽️ ${escapeHTML(tableName)}</strong>
          <span class="restaurant-table-client">${escapeHTML(order.clientName || 'Consumidor Final')}</span>
          <span class="restaurant-table-total">${formatMoney(BillingCore.restaurantOrderTotal(order.items))}</span>
          <span class="restaurant-status-badge tone-${meta.tone}">${escapeHTML(meta.label)}</span>
        `;
        card.addEventListener('click', () => loadTableOrder(tableName));
      } else {
        card.setAttribute('aria-label', `${tableName}, disponible`);
        card.innerHTML = `<strong>🍽️ ${escapeHTML(tableName)}</strong><span>Disponible</span>`;
        card.addEventListener('click', () => selectFreeTable(tableName));
      }
      listEl.appendChild(card);
    });
  }

  async function confirmDiscardCurrentCart(nextTable) {
    const currentTable = document.getElementById('pos-restaurant-table').value.trim();
    if (posCart.length === 0 || currentTable === nextTable) return true;
    return confirmAction('Hay una venta u orden sin guardar. ¿Deseas descartarla para cambiar de mesa?', {
      title: 'Descartar cambios',
      confirmLabel: 'Descartar',
      tone: 'danger'
    });
  }

  async function selectFreeTable(tableName) {
    if (!await confirmDiscardCurrentCart(tableName)) return;
    const tableInput = document.getElementById('pos-restaurant-table');
    const nameInput = document.getElementById('pos-restaurant-client-name');
    if (posCart.length) clearPosCart();
    if (tableInput) tableInput.value = tableName;
    if (nameInput) nameInput.value = '';
    document.getElementById('pos-restaurant-order-notes').value = '';
    document.getElementById('pos-restaurant-priority').value = 'normal';
    showToast(`${tableName} seleccionada para una nueva orden.`, 'success');
  }

  async function loadTableOrder(tableName) {
    if (!await confirmDiscardCurrentCart(tableName)) return;
    try {
      let order = restaurantOrders.find(item => (item.table || item.id) === tableName);
      if (!order) {
        const snapshot = await getDB().collection('panitas_table_orders').doc(tableName).get();
        if (!snapshot.exists) throw new Error('La orden ya no existe.');
        order = { id: snapshot.id, ...snapshot.data() };
      }
      if (!BillingCore.isActiveRestaurantOrder(order)) throw new Error('La orden ya está cerrada o cancelada.');

      posCart = (Array.isArray(order.items) ? order.items : []).map(item => ({
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        qty: Number(item.qty),
        tax: Number(item.tax || 0),
        notes: item.notes || '',
        modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
        allergyWarning: Boolean(item.allergyWarning),
        source: String(item.productId || '').split('_')[0],
        isCreaticos: String(item.productId || '').startsWith('creaticos_')
      }));
      renderPosCart();

      document.getElementById('pos-restaurant-table').value = order.table || tableName;
      document.getElementById('pos-restaurant-client-name').value = order.clientName || '';
      document.getElementById('pos-restaurant-order-notes').value = order.notes || '';
      document.getElementById('pos-restaurant-priority').value = order.priority || 'normal';
      showToast(`Orden de ${tableName} cargada.`, 'success');
    } catch (error) {
      console.error('Error loading table order:', error);
      showToast('No se pudo cargar la orden: ' + error.message, 'danger');
    }
  }

  function orderMinutesInStatus(order) {
    const rawDate = order.statusChangedAt || order.updatedAt || order.createdAt;
    const date = rawDate && rawDate.toDate ? rawDate.toDate() : new Date(rawDate || Date.now());
    return Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  }

  function renderKds() {
    const gridEl = document.getElementById('kds-orders-grid');
    if (!gridEl || !restaurantOrdersLoaded) return;
    gridEl.innerHTML = '';
    const kitchenOrders = restaurantOrders
      .filter(order => ['pending', 'preparing', 'ready'].includes(order.status || 'pending'))
      .sort((a, b) => {
        const priorityRank = { urgent: 0, high: 1, normal: 2 };
        const rank = (priorityRank[a.priority || 'normal'] ?? 2) - (priorityRank[b.priority || 'normal'] ?? 2);
        if (rank !== 0) return rank;
        const aDate = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        const bDate = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return aDate - bDate;
      });

    if (kitchenOrders.length === 0) {
      gridEl.innerHTML = '<div class="restaurant-empty-state">🍳 Cocina al día. No hay comandas activas.</div>';
      return;
    }

    kitchenOrders.forEach(order => {
      const table = order.table || order.id;
      const status = order.status || 'pending';
      const meta = BillingCore.restaurantStatusMeta(status);
      const minutes = orderMinutesInStatus(order);
      const card = document.createElement('article');
      card.className = `kds-card status-${status} priority-${order.priority || 'normal'} ${minutes >= 20 ? 'is-delayed' : ''}`;

      const items = Array.isArray(order.items) ? order.items : [];
      const itemsList = items.map(item => `
        <li>
          <div><strong>${escapeHTML(item.qty)}x</strong> ${escapeHTML(item.name || 'Artículo')}</div>
          ${item.notes ? `<p class="kds-item-note">${item.allergyWarning ? '⚠️ ' : ''}${escapeHTML(item.notes)}</p>` : ''}
        </li>
      `).join('');

      card.innerHTML = `
        <header class="kds-card-header">
          <div><h3>${escapeHTML(table)}</h3><p>${escapeHTML(order.clientName || 'Consumidor Final')} · ${escapeHTML(order.waiterName || 'Mesero')}</p></div>
          <span class="restaurant-status-badge tone-${meta.tone}">${escapeHTML(meta.label)}</span>
        </header>
        <div class="kds-card-meta"><span>${minutes === 0 ? 'Hace un momento' : `Hace ${minutes} min`}</span>${order.priority && order.priority !== 'normal' ? `<strong>${order.priority === 'urgent' ? 'URGENTE' : 'PRIORIDAD'}</strong>` : ''}</div>
        ${order.notes ? `<p class="kds-order-note">Nota general: ${escapeHTML(order.notes)}</p>` : ''}
        <ul class="kds-items">${itemsList}</ul>
        <div class="kds-card-actions"></div>
      `;

      const actions = card.querySelector('.kds-card-actions');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'admin-btn admin-btn-primary kds-action-button';
      if (status === 'pending') {
        button.textContent = '👨‍🍳 Comenzar preparación';
        button.addEventListener('click', () => updateKdsStatus(table, 'preparing'));
      } else if (status === 'preparing') {
        button.textContent = '✅ Marcar como lista';
        button.addEventListener('click', () => updateKdsStatus(table, 'ready'));
      } else {
        button.textContent = '🍽️ Marcar como servida';
        button.addEventListener('click', () => updateKdsStatus(table, 'served'));
      }
      actions.appendChild(button);
      gridEl.appendChild(card);
    });
  }

  async function refreshKds() {
    const gridEl = document.getElementById('kds-orders-grid');
    if (gridEl) gridEl.innerHTML = '<div class="restaurant-empty-state">Actualizando comandas...</div>';
    try {
      await refreshRestaurantOrders();
      if (!unsubscribeRestaurantOrders) startRestaurantRealtime();
      updateRestaurantConnectionUI();
    } catch (error) {
      console.error('Error refreshing KDS:', error);
      updateRestaurantConnectionUI('error');
      if (gridEl) gridEl.innerHTML = '<div class="restaurant-empty-state is-error">No se pudieron cargar las comandas.</div>';
    }
  }

  async function updateKdsStatus(tableId, nextStatus) {
    if (!currentUser || !currentUser.uid) return;
    try {
      const table = BillingCore.normalizeTableName(tableId);
      if (!['preparing', 'ready', 'served'].includes(nextStatus)) throw new Error('Estado de cocina no permitido.');
      const db = getDB();
      const orderRef = db.collection('panitas_table_orders').doc(table);
      const eventRef = db.collection('panitas_order_events').doc();
      await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(orderRef);
        if (!snapshot.exists) throw new Error('La comanda ya no existe.');
        const order = snapshot.data();
        const previousStatus = order.status || 'pending';
        if (!BillingCore.canTransitionRestaurantOrder(previousStatus, nextStatus)) {
          throw new Error(`La comanda cambió a ${BillingCore.restaurantStatusMeta(previousStatus).label}. Actualiza la pantalla.`);
        }
        const isLegacy = !Number.isInteger(order.revision) || !Number.isInteger(order.cycle) || !order.createdAt;
        const revision = isLegacy ? 1 : order.revision + 1;
        const cycle = isLegacy ? 1 : order.cycle;
        const now = firebase.firestore.FieldValue.serverTimestamp();
        transaction.set(orderRef, {
          table,
          clientName: String(order.clientName || 'Consumidor Final').slice(0, 150),
          items: Array.isArray(order.items) && order.items.length ? order.items : [{
            productId: 'legacy', name: 'Orden migrada', price: 0, qty: 1, tax: 0,
            notes: '', modifiers: [], allergyWarning: false
          }],
          notes: String(order.notes || '').slice(0, 500),
          priority: ['normal', 'high', 'urgent'].includes(order.priority) ? order.priority : 'normal',
          status: nextStatus,
          waiterName: String(order.waiterName || currentUser.displayName || currentUser.email || 'Mesero').slice(0, 150),
          createdBy: order.createdBy || currentUser.uid,
          createdAt: order.createdAt || order.updatedAt || now,
          revision,
          cycle,
          updatedBy: currentUser.uid,
          statusChangedAt: now,
          updatedAt: now
        });
        transaction.set(eventRef, restaurantEventData(table, previousStatus, nextStatus, 'status_changed', revision, cycle));
      });
      showToast(`${table}: ${BillingCore.restaurantStatusMeta(nextStatus).label}.`, 'success');
    } catch (error) {
      console.error('Error updating KDS status:', error);
      showToast('No se pudo actualizar la comanda: ' + error.message, 'danger');
    }
  }

  async function cancelCurrentTableOrder() {
    if (!currentUser || !currentUser.uid) return;
    const rawTable = document.getElementById('pos-restaurant-table').value.trim();
    if (!rawTable) {
      showToast('Selecciona una mesa con una orden activa.', 'warning');
      return;
    }
    const reasonInput = await promptAction('Indica por qué se cancela esta orden.', {
      title: 'Cancelar orden',
      inputLabel: 'Motivo',
      required: true,
      confirmLabel: 'Cancelar orden',
      tone: 'danger'
    });
    if (reasonInput === null) return;
    const reason = reasonInput.trim().slice(0, 500);
    if (reason.length < 3) {
      showToast('El motivo de cancelación debe tener al menos 3 caracteres.', 'warning');
      return;
    }

    try {
      const table = BillingCore.normalizeTableName(rawTable);
      const db = getDB();
      const orderRef = db.collection('panitas_table_orders').doc(table);
      const eventRef = db.collection('panitas_order_events').doc();
      await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(orderRef);
        if (!snapshot.exists) throw new Error('La orden ya no existe.');
        const order = snapshot.data();
        const previousStatus = order.status || 'pending';
        if (!BillingCore.canTransitionRestaurantOrder(previousStatus, 'cancelled')) {
          throw new Error('La orden ya fue cerrada o cancelada.');
        }
        const isLegacy = !Number.isInteger(order.revision) || !Number.isInteger(order.cycle) || !order.createdAt;
        const revision = isLegacy ? 1 : order.revision + 1;
        const cycle = isLegacy ? 1 : order.cycle;
        const now = firebase.firestore.FieldValue.serverTimestamp();
        transaction.set(orderRef, {
          table,
          clientName: String(order.clientName || 'Consumidor Final').slice(0, 150),
          items: Array.isArray(order.items) && order.items.length ? order.items : [{
            productId: 'legacy', name: 'Orden migrada', price: 0, qty: 1, tax: 0,
            notes: '', modifiers: [], allergyWarning: false
          }],
          notes: String(order.notes || '').slice(0, 500),
          priority: ['normal', 'high', 'urgent'].includes(order.priority) ? order.priority : 'normal',
          status: 'cancelled',
          waiterName: String(order.waiterName || currentUser.displayName || currentUser.email || 'Mesero').slice(0, 150),
          createdBy: order.createdBy || currentUser.uid,
          createdAt: order.createdAt || order.updatedAt || now,
          updatedBy: currentUser.uid,
          revision,
          cycle,
          statusChangedAt: now,
          updatedAt: now,
          cancellationReason: reason,
          cancelledAt: now,
          cancelledBy: currentUser.uid
        });
        transaction.set(eventRef, restaurantEventData(table, previousStatus, 'cancelled', 'cancelled', revision, cycle));
      });
      clearPosCart();
      showToast(`${table} fue cancelada y registrada en auditoría.`, 'success');
    } catch (error) {
      console.error('Error cancelling table order:', error);
      showToast('No se pudo cancelar la orden: ' + error.message, 'danger');
    }
  }

  function openGeneralAbonoModal() {
    const clientId = document.getElementById('form-abono-client-id');
    const nameEl = document.getElementById('abono-client-name');
    const debtEl = document.getElementById('abono-client-debt');
    const amountInput = document.getElementById('form-abono-amount');
    const notesInput = document.getElementById('form-abono-notes');

    // Retrieve active client details from profile view
    const clientName = document.getElementById('profile-client-name').textContent;
    const balanceText = document.getElementById('profile-stats-balance').textContent;
    const balanceVal = Number(balanceText.replace(/[^0-9.]/g, '')) || 0;

    // Prefill form
    const currentClientId = currentProfileClientId;
    if (!currentClientId) {
      showToast('Error al identificar el cliente activo.', 'danger');
      return;
    }

    if (clientId) clientId.value = currentClientId;
    if (nameEl) nameEl.textContent = clientName;
    if (debtEl) debtEl.textContent = formatMoney(balanceVal);
    if (amountInput) {
      amountInput.value = balanceVal.toFixed(2);
      amountInput.max = balanceVal.toFixed(2);
    }
    if (notesInput) notesInput.value = '';

    openModal('modal-general-abono');
  }

  async function submitGeneralAbono(e) {
    e.preventDefault();

    const clientId = document.getElementById('form-abono-client-id').value;
    const amountVal = Number(document.getElementById('form-abono-amount').value) || 0;
    const method = document.getElementById('form-abono-method').value;
    const notes = document.getElementById('form-abono-notes').value.trim();

    if (!clientId || !Number.isFinite(amountVal) || amountVal <= 0) {
      showToast('Por favor, ingrese un monto válido.', 'warning');
      return;
    }
    if (!['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque'].includes(method)) {
      showToast('Selecciona un método de pago válido.', 'warning');
      return;
    }

    try {
      // Fetch all invoices for this client
      const snap = await getDB().collection(collectionInvoices)
        .where('clientId', '==', clientId)
        .get();

      let clientInvoices = [];
      snap.forEach(doc => {
        const data = doc.data();
        const total = Number(data.total) || 0;
        const paid = Number(data.paidAmount) || 0;
        const pending = total - paid;
        if (data.docType === 'invoice' && data.status !== 'cancelled' && pending > 0) {
          clientInvoices.push({ id: doc.id, pending: pending, ...data });
        }
      });

      // Sort invoices oldest first
      clientInvoices.sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        return dateA.localeCompare(dateB);
      });

      if (clientInvoices.length === 0) {
        showToast('El cliente no tiene deudas pendientes.', 'warning');
        closeModal('modal-general-abono');
        return;
      }

      const totalDebt = BillingCore.roundMoney(clientInvoices.reduce((sum, invoice) => sum + invoice.pending, 0));
      if (amountVal > totalDebt + 0.01) {
        showToast(`El abono excede la deuda pendiente de ${formatMoney(totalDebt)}.`, 'danger');
        return;
      }

      let previewRemaining = amountVal;
      let affectedInvoiceCount = 0;
      for (const invoice of clientInvoices) {
        if (previewRemaining <= 0.009) break;
        previewRemaining = BillingCore.roundMoney(previewRemaining - Math.min(previewRemaining, invoice.pending));
        affectedInvoiceCount += 1;
      }
      if (affectedInvoiceCount > 8) {
        showToast('Este abono alcanzaría más de 8 facturas. Divídelo en dos operaciones para conservar una validación atómica segura.', 'warning');
        return;
      }

      const db = getDB();
      const invoiceRefs = clientInvoices.slice(0, affectedInvoiceCount).map(invoice => db.collection(collectionInvoices).doc(invoice.id));
      const sessionRef = activeCashSession ? db.collection(collectionCashSessions).doc(activeCashSession.id) : null;

      await db.runTransaction(async transaction => {
        const freshInvoices = [];
        for (const invoiceRef of invoiceRefs) {
          const snapshot = await transaction.get(invoiceRef);
          if (!snapshot.exists) continue;
          const data = snapshot.data();
          const pending = BillingCore.roundMoney(Number(data.total || 0) - Number(data.paidAmount || 0));
          if (data.docType === 'invoice' && data.status !== 'cancelled' && pending > 0) {
            freshInvoices.push({ id: snapshot.id, ref: invoiceRef, pending, ...data });
          }
        }

        const freshDebt = BillingCore.roundMoney(freshInvoices.reduce((sum, invoice) => sum + invoice.pending, 0));
        if (amountVal > freshDebt + 0.01) {
          throw new Error(`El abono excede la deuda pendiente actual de ${formatMoney(freshDebt)}.`);
        }

        let remainingAbono = amountVal;
        for (const invoice of freshInvoices) {
          if (remainingAbono <= 0.009) break;
          const paymentAmount = BillingCore.roundMoney(Math.min(remainingAbono, invoice.pending));
          const newPaidAmount = BillingCore.roundMoney(Number(invoice.paidAmount || 0) + paymentAmount);
          const paymentRef = db.collection(collectionPayments).doc();
          transaction.update(invoice.ref, {
            paidAmount: newPaidAmount,
            status: BillingCore.paymentStatus(invoice.total, newPaidAmount),
            lastPaymentId: paymentRef.id,
            updatedBy: currentUser.uid,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          transaction.set(paymentRef, {
            invoiceId: invoice.id,
            amount: paymentAmount,
            method: method,
            notes: (notes ? notes + ' - ' : '') + 'Abono general prorrateado',
            createdBy: currentUser.uid,
            companyCode: activeCompanyCode,
            cashSessionId: activeCashSession ? activeCashSession.id : '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          remainingAbono = BillingCore.roundMoney(remainingAbono - paymentAmount);
        }

        if (sessionRef) {
          const sessionUpdates = { transactionsCount: firebase.firestore.FieldValue.increment(1) };
          if (method === 'Efectivo') sessionUpdates.salesCash = firebase.firestore.FieldValue.increment(amountVal);
          else if (method === 'Tarjeta') sessionUpdates.salesCard = firebase.firestore.FieldValue.increment(amountVal);
          else sessionUpdates.salesTransfer = firebase.firestore.FieldValue.increment(amountVal);
          transaction.update(sessionRef, sessionUpdates);
        }
      });

      showToast(`Abono de RD$ ${amountVal.toFixed(2)} registrado con éxito.`, 'success');
      closeModal('modal-general-abono');

      // Refresh data and UI
      await fetchAllData();
      
      // Update local cash session state if active
      if (activeCashSession) {
        const sessDoc = await getDB().collection(collectionCashSessions).doc(activeCashSession.id).get();
        activeCashSession = { id: sessDoc.id, ...sessDoc.data() };
        updateCashSessionUI();
      }

      await viewClientProfile(clientId);
    } catch (err) {
      console.error('Error submitting general abono:', err);
      showToast('Error al registrar el abono del cliente.', 'danger');
    }
  }

  function clearPosCart() {
    posCart = [];
    renderPosCart();
    document.getElementById('pos-client-search').value = '';
    document.getElementById('pos-client-id').value = '';
    document.getElementById('pos-client-rnc').value = '';
    document.getElementById('pos-ncf-type').value = 'none';
    document.getElementById('pos-doc-type').value = 'invoice';
    posClient = { id: '', name: 'Consumidor Final', rnc: '' };
    posNcfType = 'none';
    posDocType = 'invoice';
    if (isPanitas) {
      const restTable = document.getElementById('pos-restaurant-table');
      const restClient = document.getElementById('pos-restaurant-client-name');
      const restNotes = document.getElementById('pos-restaurant-order-notes');
      const restPriority = document.getElementById('pos-restaurant-priority');
      if (restTable) restTable.value = '';
      if (restClient) restClient.value = '';
      if (restNotes) restNotes.value = '';
      if (restPriority) restPriority.value = 'normal';
    }
  }

  function filterPosCategory(cat) {
    posActiveCategory = cat;
    const btns = document.querySelectorAll('.pos-category-btn');
    btns.forEach(btn => btn.classList.remove('is-active'));
    
    const activeBtn = document.getElementById('pos-cat-' + cat);
    if (activeBtn) activeBtn.classList.add('is-active');

    renderPosProducts();
  }

  function searchPosProducts(val) {
    renderPosProducts();
  }

  function searchPosClient(val) {
    const listEl = document.getElementById('pos-client-autocomplete-list');
    if (!listEl) return;

    if (!val.trim()) {
      listEl.style.display = 'none';
      posClient = { id: '', name: 'Consumidor Final', rnc: '' };
      document.getElementById('pos-client-id').value = '';
      document.getElementById('pos-client-rnc').value = '';
      return;
    }

    const cleanVal = val.replace(/[^0-9]/g, '');
    const matches = clients.filter(c => {
      const matchName = c.name.toLowerCase().includes(val.toLowerCase());
      const cleanRnc = c.rnc ? c.rnc.replace(/[^0-9]/g, '') : '';
      const matchRnc = cleanRnc && (cleanRnc.includes(cleanVal) || c.rnc.includes(val));
      return matchName || (cleanVal.length > 0 && matchRnc);
    });

    if (matches.length === 0) {
      listEl.style.display = 'none';
      return;
    }

    listEl.innerHTML = '';
    listEl.style.display = 'block';

    matches.forEach(c => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = c.name + (c.rnc ? ` (RNC: ${c.rnc})` : '');
      item.addEventListener('click', () => {
        document.getElementById('pos-client-search').value = c.name;
        document.getElementById('pos-client-id').value = c.id;
        document.getElementById('pos-client-rnc').value = c.rnc || '';
        posClient = { id: c.id, name: c.name, rnc: c.rnc || '' };
        listEl.style.display = 'none';
      });
      listEl.appendChild(item);
    });
  }

  function openNewClientFormFromPos() {
    switchPanel('clients');
    switchSubTab('clients', 'form');
    openNewClientForm();
    returnToPos = true;
  }

  function handlePosNcfTypeChange(value) {
    posNcfType = value;
  }

  function handlePosDocTypeChange(value) {
    posDocType = value;
    const ncfSelect = document.getElementById('pos-ncf-type');
    if (value === 'quote' || value === 'proforma') {
      if (ncfSelect) {
        ncfSelect.value = 'none';
        ncfSelect.setAttribute('disabled', 'true');
      }
      posNcfType = 'none';
    } else {
      if (ncfSelect) {
        ncfSelect.removeAttribute('disabled');
      }
    }
  }

  // ─── CASH REGISTER TURN MANAGEMENT ───
  async function findOpenCashSessionForCurrentUser() {
    const collection = getDB().collection(collectionCashSessions);
    const byUid = await collection.where('openedByUid', '==', currentUser.uid).get();
    let openDoc = byUid.docs.find(doc => doc.data().status === 'open');
    if (openDoc || !currentUser.email) return openDoc || null;

    const legacy = await collection.where('openedBy', '==', currentUser.email).get();
    openDoc = legacy.docs.find(doc => doc.data().status === 'open');
    if (openDoc && !openDoc.data().openedByUid) {
      await openDoc.ref.update({ openedByUid: currentUser.uid });
      openDoc = await openDoc.ref.get();
    }
    return openDoc || null;
  }

  async function checkActiveCashSession() {
    if (!currentUser) return;
    try {
      const openDoc = await findOpenCashSessionForCurrentUser();
      if (openDoc) {
        const doc = openDoc;
        activeCashSession = { id: doc.id, ...doc.data() };
      } else {
        activeCashSession = null;
      }
      updateCashSessionUI();
    } catch (err) {
      console.error('Error checking active cash session:', err);
      activeCashSession = null;
      updateCashSessionUI();
    }
  }

  function updateCashSessionUI() {
    const btn = document.getElementById('pos-btn-cash-session');
    const label = document.getElementById('pos-cash-session-status');
    if (!btn || !label) return;

    if (activeCashSession) {
      const totalSales = (activeCashSession.salesCash || 0) + (activeCashSession.salesCard || 0) +
        (activeCashSession.salesNfc || 0) + (activeCashSession.salesTransfer || 0) + (activeCashSession.salesCredit || 0);
      label.textContent = `Caja abierta · Ventas ${formatMoney(totalSales)}`;
      btn.style.background = 'rgba(16, 185, 129, 0.15)';
      btn.style.color = '#10b981';
      btn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    } else {
      label.textContent = 'Abrir Caja';
      btn.style.background = 'rgba(239, 68, 68, 0.15)';
      btn.style.color = '#ef4444';
      btn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    }
  }

  function handleCashSessionAction() {
    if (activeCashSession) {
      // Pop open close register modal
      document.getElementById('cash-close-initial').textContent = formatMoney(activeCashSession.initialCash);
      document.getElementById('cash-close-sales-cash').textContent = formatMoney(activeCashSession.salesCash || 0);
      document.getElementById('cash-close-sales-card').textContent = formatMoney(activeCashSession.salesCard || 0);
      document.getElementById('cash-close-sales-nfc').textContent = formatMoney(activeCashSession.salesNfc || 0);
      document.getElementById('cash-close-sales-transfer').textContent = formatMoney(activeCashSession.salesTransfer || 0);
      
      const expected = activeCashSession.initialCash + (activeCashSession.salesCash || 0);
      document.getElementById('cash-close-expected-cash').textContent = formatMoney(expected);
      document.getElementById('form-cash-close-real').value = '';
      document.getElementById('cash-close-difference').textContent = 'RD$ 0.00';
      document.getElementById('cash-close-difference').style.color = 'var(--text-main)';
      document.getElementById('form-cash-close-notes').value = '';
      
      openModal('modal-cash-close');
    } else {
      // Pop open open register modal
      document.getElementById('form-cash-open-amount').value = '0.00';
      openModal('modal-cash-open');
    }
  }

  async function openCashSession(e) {
    if (e) e.preventDefault();
    if (!currentUser) return;

    const amountInput = document.getElementById('form-cash-open-amount');
    const initialCash = Number(amountInput ? amountInput.value : 0);
    if (!Number.isFinite(initialCash) || initialCash < 0) {
      showToast('El fondo inicial debe ser un monto válido mayor o igual a cero.', 'danger');
      return;
    }

    try {
      const email = currentUser.email || '';
      const existingOpenDoc = await findOpenCashSessionForCurrentUser();
      if (existingOpenDoc) {
        const doc = existingOpenDoc;
        activeCashSession = { id: doc.id, ...doc.data() };
        updateCashSessionUI();
        closeModal('modal-cash-open');
        showToast('Ya existe una sesión de caja abierta para este usuario.', 'warning');
        return;
      }
      const docData = {
        openedBy: email,
        openedByUid: currentUser.uid,
        openedAt: firebase.firestore.FieldValue.serverTimestamp(),
        initialCash: initialCash,
        status: 'open',
        salesCash: 0,
        salesCard: 0,
        salesNfc: 0,
        salesTransfer: 0,
        salesCredit: 0,
        transactionsCount: 0
      };

      const ref = await getDB().collection(collectionCashSessions).add(docData);
      activeCashSession = { id: ref.id, ...docData };
      updateCashSessionUI();
      closeModal('modal-cash-open');
      showToast('Caja abierta correctamente.', 'success');
    } catch (err) {
      console.error('Error opening cash session:', err);
      showToast('Error al abrir la caja: ' + err.message, 'danger');
    }
  }

  function calculateCashDifference() {
    if (!activeCashSession) return;
    const realInput = document.getElementById('form-cash-close-real');
    const realVal = Number(realInput ? realInput.value : 0);
    const expected = activeCashSession.initialCash + (activeCashSession.salesCash || 0);
    const diff = realVal - expected;

    if (!Number.isFinite(realVal) || realVal < 0) {
      showToast('El efectivo contado debe ser un monto válido mayor o igual a cero.', 'danger');
      return;
    }

    const diffEl = document.getElementById('cash-close-difference');
    if (diffEl) {
      diffEl.textContent = formatMoney(diff);
      if (diff === 0) {
        diffEl.style.color = '#10b981'; // Green
      } else if (diff < 0) {
        diffEl.style.color = '#ef4444'; // Red
      } else {
        diffEl.style.color = '#3b82f6'; // Blue
      }
    }
  }

  async function closeCashSession(e) {
    if (e) e.preventDefault();
    if (!activeCashSession) return;

    const realInput = document.getElementById('form-cash-close-real');
    const notesInput = document.getElementById('form-cash-close-notes');
    const realVal = Number(realInput ? realInput.value : NaN);
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!Number.isFinite(realVal) || realVal < 0) {
      showToast('El efectivo contado debe ser un monto válido mayor o igual a cero.', 'danger');
      return;
    }

    const expected = activeCashSession.initialCash + (activeCashSession.salesCash || 0);
    const diff = realVal - expected;

    try {
      await getDB().collection(collectionCashSessions).doc(activeCashSession.id).update({
        closedAt: firebase.firestore.FieldValue.serverTimestamp(),
        realCash: realVal,
        difference: diff,
        notes: notes,
        status: 'closed',
        closedBy: currentUser.uid
      });

      activeCashSession = null;
      updateCashSessionUI();
      closeModal('modal-cash-close');
      showToast('Caja cerrada; el arqueo quedó registrado.', 'success');
    } catch (err) {
      console.error('Error closing cash session:', err);
      showToast('Error al cerrar la caja: ' + err.message, 'danger');
    }
  }

  // ─── DATA EXPORT UTILITIES ───
  function downloadCSV(filename, csvContent) {
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  function downloadText(filename, textContent) {
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function selectedFiscalPeriod(inputId = 'fiscal-report-period') {
    const input = document.getElementById(inputId);
    const fallback = BillingCore.toLocalDateInput().slice(0, 7);
    const value = input && input.value ? input.value : fallback;
    if (input && !input.value) input.value = fallback;
    return BillingCore.normalizeFiscalPeriod(value);
  }

  function dgiiTextValue(value, numeric = false) {
    if (numeric) return Number(value || 0).toFixed(2);
    return String(value === undefined || value === null ? '' : value).replace(/[|\r\n\t]/g, ' ').trim();
  }

  function exportInvoicesToCSV() {
    if (invoices.length === 0) {
      showToast('No hay facturas registradas para exportar.', 'info');
      return;
    }

    let csv = 'No. Factura,Tipo,NCF,Cliente,RNC/Cédula,Fecha Emisión,Subtotal,ITBIS,Total,Pagado,Estado\n';
    invoices.forEach(inv => {
      csv += [
        BillingCore.csvCell(inv.invoiceNumber),
        BillingCore.csvCell(inv.docType),
        BillingCore.csvCell(inv.ncf || 'N/D'),
        BillingCore.csvCell(inv.clientName || 'Consumidor Final'),
        BillingCore.csvCell(inv.clientRnc || 'N/D'),
        BillingCore.csvCell(inv.date),
        Number(inv.subtotal || 0).toFixed(2),
        Number(inv.itbis || 0).toFixed(2),
        Number(inv.total || 0).toFixed(2),
        Number(inv.paidAmount || 0).toFixed(2),
        BillingCore.csvCell(inv.status)
      ].join(',') + '\n';
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`Facturas_${companyName}_${BillingCore.toLocalDateInput()}.csv`, csv);
  }

  function exportDGII607ToCSV() {
    let period;
    try {
      period = selectedFiscalPeriod();
    } catch (error) {
      showToast(error.message, 'danger');
      return;
    }
    const eligibleInvoices = invoices.filter(invoice =>
      ['invoice', 'credit_note', 'debit_note'].includes(invoice.docType) &&
      BillingCore.recordBelongsToPeriod(invoice, period)
    );
    const groups = eligibleInvoices.reduce((result, invoice) => {
      const classification = BillingCore.classify607Invoice(invoice);
      result[classification] = (result[classification] || 0) + 1;
      return result;
    }, {});
    const detailInvoices = eligibleInvoices.filter(invoice => BillingCore.classify607Invoice(invoice) === 'detail');
    if (Number(groups.invalid || 0) > 0) {
      showToast(`Hay ${groups.invalid} comprobante(s) con NCF o identificación inválida en ${period}. Corrígelos antes de generar el 607.`, 'danger');
      return;
    }
    const companyRnc = String(settings && settings.rnc || '').replace(/\D/g, '');
    if (companyRnc.length !== 9) {
      showToast('Configura un RNC empresarial válido antes de generar reportes DGII.', 'danger');
      return;
    }
    const records = detailInvoices.map(invoice => {
      const record = BillingCore.build607Record(invoice, payments);
      return record.map((value, index) => dgiiTextValue(value, index >= 7)).join('|');
    });
    const header = ['607', companyRnc, period.replace('-', ''), records.length].join('|');
    downloadText(`DGII_F_607_${companyRnc}_${period.replace('-', '')}.TXT`, [header, ...records].join('\r\n'));

    const consumerInvoices = eligibleInvoices.filter(invoice => BillingCore.classify607Invoice(invoice) === 'consumer-summary');
    const consumerAmount = consumerInvoices.reduce((sum, invoice) =>
      sum + Number(invoice.taxableAmount !== undefined ? invoice.taxableAmount : Number(invoice.subtotal || 0) - Number(invoice.discountAmount || 0)), 0);
    const consumerItbis = consumerInvoices.reduce((sum, invoice) => sum + Number(invoice.itbis || 0), 0);
    const electronic = Number(groups.electronic || 0);
    const summary = consumerInvoices.length
      ? ` Resumen consumidor final: ${consumerInvoices.length} comprobante(s), base ${formatMoney(consumerAmount)}, ITBIS ${formatMoney(consumerItbis)}.`
      : '';
    const electronicNote = electronic ? ` Se excluyeron ${electronic} e-NCF históricos; deben seguir el canal electrónico.` : '';
    showToast(`607 de ${period} generado con ${records.length} registro(s). Prevalídalo antes de remitir.${summary}${electronicNote}`, consumerInvoices.length || electronic ? 'warning' : 'success');
  }

  function exportDGII608() {
    let period;
    try {
      period = selectedFiscalPeriod();
    } catch (error) {
      showToast(error.message, 'danger');
      return;
    }
    const companyRnc = String(settings && settings.rnc || '').replace(/\D/g, '');
    if (companyRnc.length !== 9) {
      showToast('Configura un RNC empresarial válido antes de generar reportes DGII.', 'danger');
      return;
    }
    const records = invoices
      .filter(invoice => invoice.status === 'cancelled' &&
        String(invoice.cancellationDate || invoice.date || '').slice(0, 7) === period)
      .map(BillingCore.build608Record)
      .filter(Boolean)
      .map(record => record.map(value => dgiiTextValue(value)).join('|'));
    const header = ['608', companyRnc, period.replace('-', ''), records.length].join('|');
    downloadText(`DGII_F_608_${companyRnc}_${period.replace('-', '')}.TXT`, [header, ...records].join('\r\n'));
    showToast(`608 de ${period} generado con ${records.length} NCF anulado(s). Prevalídalo antes de remitir.`, 'success');
  }

  function exportDGII606ToCSV() {
    if (window.ERPExtensions && typeof window.ERPExtensions.export606 === 'function') {
      return window.ERPExtensions.export606();
    }
    showToast('El módulo de compras todavía no está disponible. Recarga la página e inténtalo de nuevo.', 'danger');
  }

  function exportClientsToCSV() {
    if (clients.length === 0) {
      showToast('No hay clientes registrados para exportar.', 'info');
      return;
    }

    let csv = 'Nombre,RNC/Cédula,Teléfono,Email,Dirección\n';
    clients.forEach(c => {
      csv += [c.name, c.rnc, c.phone, c.email, c.address].map(BillingCore.csvCell).join(',') + '\n';
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`Clientes_${companyName}_${BillingCore.toLocalDateInput()}.csv`, csv);
  }

  function exportProductsToCSV() {
    if (products.length === 0) {
      showToast('No hay productos registrados para exportar.', 'info');
      return;
    }

    let csv = 'Código/ID,Descripción,Precio,Impuesto (%),Origen\n';
    products.forEach(p => {
      const origin = p._isCreaticos ? 'Creaticos' : 'Futunet';
      csv += [
        BillingCore.csvCell(p.id),
        BillingCore.csvCell(p.name || p.title || p.description || ''),
        Number(p.price || 0).toFixed(2),
        Number(p.tax || 0).toFixed(2),
        BillingCore.csvCell(origin)
      ].join(',') + '\n';
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`Productos_${companyName}_${BillingCore.toLocalDateInput()}.csv`, csv);
  }

  async function checkoutPos(method) {
    if (!activeCashSession) {
      showToast('Debes abrir una sesión de caja antes de realizar un cobro.', 'warning');
      handleCashSessionAction();
      return;
    }

    if (posCart.length === 0) {
      showToast('El carrito está vacío.', 'warning');
      return;
    }

    let subtotal = 0;
    let itbis = 0;
    posCart.forEach(item => {
      const itemSub = item.price * item.qty;
      const taxRate = item.tax || 0;
      subtotal += itemSub;
      itbis += itemSub * (taxRate / 100);
    });
    const total = subtotal + itbis;

    if (method === 'cash') {
      document.getElementById('pos-cash-total-to-pay').textContent = formatMoney(total);
      document.getElementById('pos-cash-amount-received').value = total.toFixed(2);
      document.getElementById('pos-cash-change-due').textContent = formatMoney(0);
      openModal('modal-pos-cash-payment');
      setTimeout(() => {
        const input = document.getElementById('pos-cash-amount-received');
        if (input) {
          input.focus();
          input.select();
        }
      }, 300);
      return;
    }

    if (method === 'nfc') {
      document.getElementById('nfc-payment-amount').textContent = formatMoney(total);
      document.getElementById('nfc-payment-status').textContent = 'PENDIENTE DE REFERENCIA DEL VOUCHER';
      document.getElementById('nfc-manual-reference').value = '';
      pendingPosManualReference = '';
      const tapBtn = document.getElementById('btn-nfc-tap-action');
      if (tapBtn) {
        tapBtn.style.display = 'block';
        tapBtn.disabled = false;
        tapBtn.textContent = 'Registrar pago verificado';
      }
      openModal('modal-nfc-payment');
      setTimeout(() => document.getElementById('nfc-manual-reference')?.focus(), 200);
      return;
    }

    if (method === 'credit') {
      if (!posClient || !posClient.id) {
        showToast('Debe seleccionar un cliente registrado para realizar una venta a crédito.', 'warning');
        return;
      }
      if (!await confirmAction(`¿Deseas registrar esta venta a crédito para ${posClient.name}?`, {
        title: 'Venta a crédito',
        confirmLabel: 'Registrar a crédito'
      })) {
        return;
      }
    }

    await processPosSale(method);
  }

  function calculatePosCashChange() {
    const totalText = document.getElementById('pos-cash-total-to-pay').textContent;
    const totalNum = Number(totalText.replace(/[^0-9.]/g, '')) || 0;
    const received = Number(document.getElementById('pos-cash-amount-received').value) || 0;
    const change = Math.max(0, received - totalNum);
    
    document.getElementById('pos-cash-change-due').textContent = formatMoney(change);

    const submitBtn = document.getElementById('pos-cash-submit-btn');
    if (submitBtn) {
      if (received < totalNum) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      } else {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }
  }

  async function confirmPosCashPayment(e) {
    if (e) e.preventDefault();
    
    const totalText = document.getElementById('pos-cash-total-to-pay').textContent;
    const totalNum = Number(totalText.replace(/[^0-9.]/g, '')) || 0;
    const received = Number(document.getElementById('pos-cash-amount-received').value) || 0;
    
    if (received < totalNum) {
      showToast('Efectivo recibido es insuficiente.', 'danger');
      return;
    }

    closeModal('modal-pos-cash-payment');
    await processPosSale('cash');
  }

  async function processPosSale(method) {
    if (isProcessingPosSale) {
      showToast('La venta ya se está procesando.', 'warning');
      return;
    }
    if (!['cash', 'card', 'nfc', 'credit'].includes(method)) {
      showToast('Método de pago no válido.', 'danger');
      return;
    }
    if (method === 'nfc' && pendingPosManualReference.length < 4) {
      showToast('Indica la referencia del voucher del terminal físico.', 'danger');
      return;
    }
    isProcessingPosSale = true;
    let docType = posDocType;
    let ncfType = posNcfType;
    let status = (docType === 'quote' || docType === 'proforma') ? docType : (method === 'credit' ? 'unpaid' : 'paid');

    let subtotal = 0;
    let itbis = 0;
    const items = posCart.map(item => {
      const lineSub = item.price * item.qty;
      const lineTax = lineSub * (item.tax / 100);
      subtotal += lineSub;
      itbis += lineTax;
      
      return {
        productId: item.productId,
        productSource: item.source,
        description: item.name,
        categorySnapshot: productCategorySnapshot(item.productId),
        price: item.price,
        qty: item.qty,
        tax: lineTax,
        taxMode: 'rate',
        taxRate: item.tax,
        notes: String(item.notes || '').slice(0, 300),
        total: lineSub + lineTax
      };
    });

    const posTotals = BillingCore.calculateInvoiceTotals(items, 0);
    items.splice(0, items.length, ...posTotals.items);
    subtotal = posTotals.subtotal;
    itbis = posTotals.itbis;
    const total = posTotals.total;
    const paidAmount = (docType === 'invoice') ? (method === 'credit' ? 0 : total) : 0;
    const cleanClientRnc = String(posClient.rnc || '').replace(/\D/g, '');
    if (docType === 'invoice' && ['B01', 'B12', 'B14', 'B15'].includes(ncfType) && ![9, 11].includes(cleanClientRnc.length)) {
      isProcessingPosSale = false;
      showToast('Este comprobante requiere seleccionar un cliente con RNC o cédula válido.', 'danger');
      return;
    }
    if (docType === 'invoice' && ncfType === 'B02' && total >= 250000 && ![9, 11].includes(cleanClientRnc.length)) {
      isProcessingPosSale = false;
      showToast('Las facturas de consumo desde RD$250,000 requieren identificar al cliente.', 'danger');
      return;
    }

    const localDate = BillingCore.toLocalDateInput();

    const invoiceData = {
      docType: docType,
      companyCode: activeCompanyCode,
      type: docType,
      clientId: posClient.id || 'anonymous',
      clientName: posClient.name,
      clientRnc: posClient.rnc,
      customerSnapshot: invoiceCustomerSnapshot(posClient.id, { name: posClient.name, rnc: posClient.rnc }),
      issuerSnapshot: invoiceIssuerSnapshot('general'),
      fiscalSchemaVersion: 2,
      date: localDate,
      dueDate: localDate,
      subtotal: subtotal,
      discountPct: 0,
      discountAmount: 0,
      taxableAmount: posTotals.taxableAmount,
      itbis: itbis,
      total: total,
      paidAmount: paidAmount,
      status: status,
      ncfType: (docType === 'quote' || docType === 'proforma') ? 'none' : ncfType,
      ncf: '',
      items: items,
      paymentTerms: method === 'credit' ? 'Crédito' : 'Contado',
      paymentMethod: method,
      createdBy: currentUser.uid,
      updatedBy: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    let restaurantTable = '';
    if (isPanitas && docType === 'invoice') {
      const rawTable = document.getElementById('pos-restaurant-table').value.trim();
      if (rawTable) {
        try {
          restaurantTable = BillingCore.normalizeTableName(rawTable);
        } catch (error) {
          isProcessingPosSale = false;
          showToast(error.message, 'danger');
          return;
        }
      }
    }

    try {
      const dbRef = getDB();
      const settingsDocRef = dbRef.collection(collectionSettings).doc('general');
      const invoicesCollRef = dbRef.collection(collectionInvoices);
      const newInvoiceDocRef = invoicesCollRef.doc();
      const createdDocId = newInvoiceDocRef.id;
      const paymentRef = docType === 'invoice' && paidAmount > 0
        ? dbRef.collection(collectionPayments).doc()
        : null;
      if (paymentRef) invoiceData.lastPaymentId = paymentRef.id;
      const sessionRef = activeCashSession && docType === 'invoice'
        ? dbRef.collection(collectionCashSessions).doc(activeCashSession.id)
        : null;
      const restaurantOrderRef = restaurantTable
        ? dbRef.collection('panitas_table_orders').doc(restaurantTable)
        : null;
      const restaurantEventRef = restaurantOrderRef
        ? dbRef.collection('panitas_order_events').doc()
        : null;

      await dbRef.runTransaction(async (transaction) => {
        // Firestore exige completar todas las lecturas antes de cualquier escritura.
        const stockDocuments = [];
        for (const item of (docType === 'invoice' ? aggregateInventoryItems(posCart) : [])) {
          const target = inventoryProductTarget(dbRef, item.productId);
          if (!target) throw new Error(`El producto "${item.name}" no tiene un origen válido.`);
          const productDoc = await transaction.get(target.ref);
          if (!productDoc.exists) throw new Error(`El producto "${item.name}" ya no existe.`);
          stockDocuments.push({ item, target, data: productDoc.data() });
        }

        const settingsDoc = await transaction.get(settingsDocRef);
        if (!settingsDoc.exists) {
          throw new Error("El documento de configuración de la empresa no existe.");
        }
        const restaurantOrderSnapshot = restaurantOrderRef ? await transaction.get(restaurantOrderRef) : null;
        const freshSettings = settingsDoc.data();
        let freshInvoiceNum = '';
        let freshNcf = '';
        const settingsUpdates = {};

        if (docType === 'quote') {
          freshInvoiceNum = (freshSettings.quotePrefix || 'COT-') + String(freshSettings.nextQuoteNum || 1001);
          settingsUpdates.nextQuoteNum = (freshSettings.nextQuoteNum || 1001) + 1;
        } else if (docType === 'proforma') {
          freshInvoiceNum = (freshSettings.proformaPrefix || 'PROF-') + String(freshSettings.nextProformaNum || 1001);
          settingsUpdates.nextProformaNum = (freshSettings.nextProformaNum || 1001) + 1;
        } else {
          freshInvoiceNum = (freshSettings.invoicePrefix || 'CRE-') + String(freshSettings.nextInvoiceNum || 1001);
          settingsUpdates.nextInvoiceNum = (freshSettings.nextInvoiceNum || 1001) + 1;

          if (NCF_FIELDS[ncfType]) {
            const fields = NCF_FIELDS[ncfType];
            BillingCore.assertNcfRangeAvailable(freshSettings, ncfType, localDate);
            freshNcf = BillingCore.buildNcf(ncfType, freshSettings[fields.prefix] || ncfType, freshSettings[fields.sequence] || 1);
            settingsUpdates[fields.sequence] = Number(freshSettings[fields.sequence] || 1) + 1;
          }
        }

        let ncfRegistryRef = null;
        if (freshNcf) {
          ncfRegistryRef = dbRef.collection(collectionNcfRegistry).doc(freshNcf);
          const registryDoc = await transaction.get(ncfRegistryRef);
          if (registryDoc.exists) throw new Error(`El NCF ${freshNcf} ya fue utilizado.`);
        }

        invoiceData.invoiceNumber = freshInvoiceNum;
        invoiceData.ncf = (docType === 'quote' || docType === 'proforma') ? '' : freshNcf;

        const inventoryEffects = [];
        stockDocuments.forEach(({ item, target, data }) => {
          if (data.stock !== undefined && data.stock !== null) {
            const currentStock = Number(data.stock) || 0;
            if (currentStock < item.qty) {
              throw new Error(`Stock insuficiente para "${data.name || data.title}". Disponible: ${currentStock}, Solicitado: ${item.qty}`);
            }
            const movementRef = dbRef.collection(collectionInventoryMovements).doc();
            transaction.update(target.ref, {
              stock: currentStock - item.qty,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              lastInventoryMovementId: movementRef.id
            });
            inventoryEffects.push({
              productId: target.productId,
              documentId: target.documentId,
              collection: target.collection,
              quantity: item.qty,
              movementRef
            });
          }
        });

        if (docType === 'invoice') {
          invoiceData.inventoryEffects = inventoryEffects.map(({ movementRef, ...effect }) => effect);
          invoiceData.inventoryPostedAt = firebase.firestore.FieldValue.serverTimestamp();
        }

        transaction.set(newInvoiceDocRef, invoiceData);
        if (ncfRegistryRef) {
          transaction.set(ncfRegistryRef, {
            ncf: freshNcf,
            invoiceId: createdDocId,
            companyCode: activeCompanyCode,
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        inventoryEffects.forEach(effect => {
          transaction.set(effect.movementRef, {
            type: 'sale',
            invoiceId: createdDocId,
            invoiceNumber: freshInvoiceNum,
            productId: effect.productId,
            productDocumentId: effect.documentId,
            productCollection: effect.collection,
            quantity: -effect.quantity,
            createdBy: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        });
        transaction.update(settingsDocRef, settingsUpdates);

        if (paymentRef) {
          transaction.set(paymentRef, {
          invoiceId: createdDocId,
          amount: paidAmount,
          method: method === 'cash' ? 'Efectivo' : 'Tarjeta',
          notes: method === 'nfc'
            ? 'Pago contactless verificado manualmente. Ref: ' + pendingPosManualReference
            : 'Pago POS',
          createdBy: currentUser.uid,
          companyCode: activeCompanyCode,
          cashSessionId: activeCashSession ? activeCashSession.id : '',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        }

        if (sessionRef) {
          const sessionUpdates = { transactionsCount: firebase.firestore.FieldValue.increment(1) };
          if (method === 'credit') {
            sessionUpdates.salesCredit = firebase.firestore.FieldValue.increment(total);
          } else if (method === 'cash') {
            sessionUpdates.salesCash = firebase.firestore.FieldValue.increment(paidAmount);
          } else if (method === 'nfc') {
            sessionUpdates.salesNfc = firebase.firestore.FieldValue.increment(paidAmount);
          } else if (method === 'card') {
            sessionUpdates.salesCard = firebase.firestore.FieldValue.increment(paidAmount);
          }
          transaction.update(sessionRef, sessionUpdates);
        }

        if (restaurantOrderSnapshot && restaurantOrderSnapshot.exists) {
          const order = restaurantOrderSnapshot.data();
          const previousStatus = order.status || 'pending';
          if (!BillingCore.isActiveRestaurantOrder(order)) {
            throw new Error('La orden de la mesa ya fue cerrada o cancelada por otro usuario.');
          }
          const billedRestaurantItems = posCart.map(item => ({
            productId: String(item.productId || '').slice(0, 150),
            name: String(item.name || '').trim().slice(0, 150),
            price: BillingCore.roundMoney(item.price),
            qty: Number(item.qty),
            tax: Number(item.tax || 0),
            notes: String(item.notes || '').trim().slice(0, 300),
            modifiers: Array.isArray(item.modifiers) ? item.modifiers.map(String).slice(0, 10) : [],
            allergyWarning: Boolean(item.allergyWarning)
          }));
          if (BillingCore.restaurantItemsChanged(order.items, billedRestaurantItems)) {
            throw new Error('La comanda cambió desde que fue cargada. Actualiza la mesa antes de cobrar.');
          }
          const revision = Number(order.revision || 0) + 1;
          const cycle = Number(order.cycle || 1);
          const now = firebase.firestore.FieldValue.serverTimestamp();
          transaction.set(restaurantOrderRef, {
            table: restaurantTable,
            clientName: String(order.clientName || 'Consumidor Final').slice(0, 150),
            items: Array.isArray(order.items) && order.items.length ? order.items : [{
              productId: 'legacy',
              name: 'Orden migrada',
              price: total,
              qty: 1,
              tax: 0,
              notes: '',
              modifiers: [],
              allergyWarning: false
            }],
            notes: String(order.notes || '').slice(0, 500),
            priority: ['normal', 'high', 'urgent'].includes(order.priority) ? order.priority : 'normal',
            status: 'closed',
            waiterName: String(order.waiterName || currentUser.displayName || currentUser.email || 'Mesero').slice(0, 150),
            createdBy: order.createdBy || currentUser.uid,
            updatedBy: currentUser.uid,
            revision,
            cycle,
            createdAt: order.createdAt || now,
            statusChangedAt: now,
            updatedAt: now,
            linkedInvoiceId: createdDocId,
            closedAt: now,
            closedBy: currentUser.uid
          });
          transaction.set(restaurantEventRef, restaurantEventData(
            restaurantTable,
            previousStatus,
            'closed',
            'invoiced_and_closed',
            revision,
            cycle
          ));
        }
      });

      if (sessionRef) {
        const freshDoc = await sessionRef.get();
        activeCashSession = { id: freshDoc.id, ...freshDoc.data() };
        updateCashSessionUI();
      }

      await loadSettings();
      await fetchAllData();
      renderInvoicesTable();

      showToast('Transacción procesada con éxito. Emitiendo ticket...', 'success');
      
      const invoiceId = createdDocId;
      
      clearPosCart();
      await viewInvoice(invoiceId);
      const printFormatSelect = document.getElementById('print-format-select');
      if (printFormatSelect) {
        printFormatSelect.value = 'ticket';
        handlePrintFormatChange('ticket');
      }
      
      setTimeout(() => {
        window.print();
      }, 500);

    } catch (err) {
      console.error(err);
      showToast('Error al registrar venta POS: ' + err.message, 'danger');
    } finally {
      isProcessingPosSale = false;
    }
  }

  async function simulateNfcCardTap() {
    const statusEl = document.getElementById('nfc-payment-status');
    const tapBtn = document.getElementById('btn-nfc-tap-action');
    const referenceInput = document.getElementById('nfc-manual-reference');
    const reference = String(referenceInput?.value || '').trim();
    if (!statusEl || reference.length < 4) {
      showToast('Escribe una referencia válida del voucher físico.', 'warning');
      referenceInput?.focus();
      return;
    }

    pendingPosManualReference = reference.slice(0, 100);
    statusEl.innerHTML = '<span style="color:#10b981;font-weight:bold;">✓ REGISTRO MANUAL CONFIRMADO</span>';
    if (tapBtn) tapBtn.disabled = true;
    playBeepTone(1200, 0.15);
    closeModal('modal-nfc-payment');
    await processPosSale('nfc');
  }

  function playBeepTone(freq, duration) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn("AudioContext not permitted or supported:", err);
    }
  }

  function openSimulatedBarcodeModal() {
    const select = document.getElementById('barcode-simulator-select');
    if (!select) return;
    select.innerHTML = '';

    let list = [].concat(creaticosProducts).concat(futunetProducts);
    
    const seen = new Set();
    list = list.filter(p => {
      const id = p.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return p.barcode || p.sku;
    });

    if (list.length === 0) {
      select.innerHTML = '<option value="">(No hay productos con códigos en la base de datos)</option>';
    } else {
      list.forEach(p => {
        const option = document.createElement('option');
        const code = p.barcode || p.sku;
        const name = p.name || p.title || '';
        option.value = code;
        option.textContent = `${name} [Código: ${code}]`;
        select.appendChild(option);
      });
    }

    document.getElementById('barcode-simulator-manual').value = '';
    openModal('modal-barcode-scan');
  }

  function triggerSimulatedScan() {
    const select = document.getElementById('barcode-simulator-select');
    const manualInput = document.getElementById('barcode-simulator-manual');
    
    let scannedCode = '';
    if (manualInput && manualInput.value.trim()) {
      scannedCode = manualInput.value.trim();
    } else if (select && select.value) {
      scannedCode = select.value;
    }

    if (!scannedCode) {
      showToast('Selecciona o introduce un código.', 'warning');
      return;
    }

    closeModal('modal-barcode-scan');
    handleScannedBarcode(scannedCode);
  }

  function handleScannedBarcode(code) {
    const searchCode = code.trim().toLowerCase();
    
    let match = creaticosProducts.find(p => 
      (p.barcode && p.barcode.toLowerCase() === searchCode) || 
      (p.sku && p.sku.toLowerCase() === searchCode)
    );

    if (!match) {
      match = futunetProducts.find(p => 
        (p.barcode && p.barcode.toLowerCase() === searchCode) || 
        (p.sku && p.sku.toLowerCase() === searchCode)
      );
    }

    if (match) {
      addPosCartItem(match);
      playBeepTone(1500, 0.04);
      setTimeout(() => playBeepTone(1500, 0.04), 60);
    } else {
      playBeepTone(300, 0.25);
      showToast(`Código de barras "${code}" no encontrado en el catálogo.`, 'warning');
    }
  }

  const LETTER_PAGE_WIDTH_MM = 215.9;
  const LETTER_PAGE_HEIGHT_MM = 279.4;
  const LETTER_PAGE_MARGIN_MM = 7;
  const INVOICE_FIT_CLASSES = [
    'print-fit-standard',
    'print-fit-compact',
    'print-fit-dense',
    'print-fit-minimum',
    'print-fit-multipage',
    'print-compact-medium',
    'print-compact-high',
    'print-compact-ultra'
  ];
  const INVOICE_FIT_PROFILES = [
    { className: 'print-fit-standard', label: '8.25 pt' },
    { className: 'print-fit-compact', label: '7.9 pt' },
    { className: 'print-fit-dense', label: '7.55 pt' },
    { className: 'print-fit-minimum', label: '7.4 pt' }
  ];

  function clearAdaptivePrintClasses(element) {
    if (element) element.classList.remove(...INVOICE_FIT_CLASSES);
  }

  function setInvoiceFitStatus(message, state) {
    const status = document.getElementById('invoice-print-fit-status');
    if (!status) return;
    status.className = `invoice-print-fit-bar${state ? ` ${state}` : ''}`;
    const text = status.querySelector('span:last-child');
    if (text) text.textContent = message;
  }

  async function waitForInvoiceAssets(root) {
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 1600))
      ]);
    }
    const pendingImages = Array.from(root.querySelectorAll('img')).filter(image => !image.complete);
    if (!pendingImages.length) return;
    await Promise.race([
      Promise.all(pendingImages.map(image => new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))),
      new Promise(resolve => setTimeout(resolve, 1600))
    ]);
  }

  async function applyAdaptivePrintLayout() {
    const printArea = document.getElementById('invoice-print-area');
    if (!printArea) return null;
    if (printArea.classList.contains('print-format-ticket')) {
      clearAdaptivePrintClasses(printArea);
      setInvoiceFitStatus('Formato ticket de 80 mm seleccionado.', '');
      return { profile: 'ticket', pages: null, fitsOnePage: false };
    }

    setInvoiceFitStatus('Calculando el tamaño más legible que cabe en una página…', 'is-fitting');
    await waitForInvoiceAssets(printArea);

    const measurement = printArea.cloneNode(true);
    measurement.removeAttribute('id');
    measurement.setAttribute('aria-hidden', 'true');
    measurement.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    clearAdaptivePrintClasses(measurement);
    measurement.classList.remove('print-format-ticket', 'print-pdf-export');
    measurement.classList.add('invoice-print-measure');
    document.body.appendChild(measurement);

    let selectedProfile = INVOICE_FIT_PROFILES[INVOICE_FIT_PROFILES.length - 1];
    let selectedHeight = 0;
    let targetHeight = 0;
    let fitsOnePage = false;

    try {
      await waitForInvoiceAssets(measurement);
      for (const profile of INVOICE_FIT_PROFILES) {
        clearAdaptivePrintClasses(measurement);
        measurement.classList.add('invoice-print-measure', profile.className);
        void measurement.offsetHeight;

        const measuredWidth = measurement.getBoundingClientRect().width || 760;
        targetHeight = measuredWidth *
          ((LETTER_PAGE_HEIGHT_MM - (LETTER_PAGE_MARGIN_MM * 2)) /
           (LETTER_PAGE_WIDTH_MM - (LETTER_PAGE_MARGIN_MM * 2))) * 0.975;
        selectedHeight = Math.max(measurement.scrollHeight, measurement.getBoundingClientRect().height);
        selectedProfile = profile;
        if (selectedHeight <= targetHeight) {
          fitsOnePage = true;
          break;
        }
      }
    } finally {
      measurement.remove();
    }

    const pageCount = fitsOnePage ? 1 : Math.max(2, Math.ceil(selectedHeight / Math.max(targetHeight, 1)));
    clearAdaptivePrintClasses(printArea);
    printArea.classList.add(selectedProfile.className);
    if (!fitsOnePage) printArea.classList.add('print-fit-multipage');
    printArea.dataset.printFitProfile = selectedProfile.className;
    printArea.dataset.printPageCount = String(pageCount);

    if (fitsOnePage) {
      const wording = selectedProfile.className === 'print-fit-standard'
        ? 'Documento optimizado para una página con tipografía cómoda.'
        : `Ajuste automático: una página, cuerpo principal de ${selectedProfile.label}.`;
      setInvoiceFitStatus(wording, 'is-single-page');
    } else {
      setInvoiceFitStatus(
        `Este contenido requiere aproximadamente ${pageCount} páginas para conservar un cuerpo principal legible de ${selectedProfile.label}.`,
        'is-multipage'
      );
    }

    return {
      profile: selectedProfile.className,
      pages: pageCount,
      fitsOnePage,
      fontSize: selectedProfile.label,
      measuredHeight: Math.round(selectedHeight),
      targetHeight: Math.round(targetHeight)
    };
  }

  async function printCurrentInvoice() {
    const printArea = document.getElementById('invoice-print-area');
    if (!printArea) return;
    if (!printArea.classList.contains('print-format-ticket')) await applyAdaptivePrintLayout();
    const previousScroll = { x: window.scrollX || 0, y: window.scrollY || 0 };
    let restored = false;
    const restorePrintState = () => {
      if (restored) return;
      restored = true;
      document.body.classList.remove('invoice-printing');
      window.scrollTo(previousScroll.x, previousScroll.y);
    };
    document.body.classList.add('invoice-printing');
    window.addEventListener('afterprint', restorePrintState, { once: true });
    window.scrollTo(0, 0);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      window.print();
    } catch (error) {
      restorePrintState();
      throw error;
    }
    window.setTimeout(restorePrintState, 120000);
  }

  async function printInvoiceDirectly(id) {
    await viewInvoice(id);
    await printCurrentInvoice();
  }

  function createInvoicePdfSource(element) {
    const host = document.createElement('div');
    host.className = 'invoice-pdf-export-host';
    host.setAttribute('aria-hidden', 'true');

    const source = element.cloneNode(true);
    source.removeAttribute('id');
    source.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    source.classList.add('print-pdf-export');
    source.style.margin = '0';

    host.appendChild(source);
    document.body.appendChild(host);
    return {
      source,
      remove: () => host.remove()
    };
  }

  async function downloadInvoicePDF() {
    const element = document.getElementById('invoice-print-area');
    if (!element) return;

    const invoiceNum = document.getElementById('view-invoice-number').textContent || 'Documento';
    const documentTitle = String(document.querySelector('.billing-meta-box h3')?.textContent || 'Factura').toLocaleLowerCase('es');
    const filenamePrefix = documentTitle.includes('cotiz') ? 'Cotizacion' : (documentTitle.includes('proforma') ? 'Proforma' : 'Factura');
    if (!element.classList.contains('print-format-ticket')) await applyAdaptivePrintLayout();

    const opt = {
      margin: [LETTER_PAGE_MARGIN_MM, LETTER_PAGE_MARGIN_MM, LETTER_PAGE_MARGIN_MM, LETTER_PAGE_MARGIN_MM],
      filename: `${filenamePrefix}_${invoiceNum}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 760,
        width: 760,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        removeContainer: true
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['.invoice-header', '.invoice-billing-details', '.invoice-footer-wrapper', '.invoice-signatures-area', 'tr']
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    showToast('Generando PDF optimizado...', 'info');
    const pdfExport = createInvoicePdfSource(element);
    try {
      await waitForInvoiceAssets(pdfExport.source);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await html2pdf().set(opt).from(pdfExport.source).save();
      showToast('PDF descargado con éxito.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al generar PDF: ' + err.message, 'danger');
    } finally {
      pdfExport.remove();
    }
  }

  function handlePrintFormatChange(format, options = {}) {
    const printArea = document.getElementById('invoice-print-area');
    if (!printArea) return Promise.resolve(null);
    if (format === 'ticket') {
      clearAdaptivePrintClasses(printArea);
      printArea.classList.add('print-format-ticket');
      setInvoiceFitStatus('Formato ticket de 80 mm seleccionado.', '');
      return Promise.resolve({ profile: 'ticket' });
    }
    printArea.classList.remove('print-format-ticket');
    return options.skipFit ? Promise.resolve(null) : applyAdaptivePrintLayout();
  }

  function editQuote(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    if (inv.status === 'converted' || ['accepted', 'converted'].includes(inv.workflowStatus)) {
      showToast('Este documento está bloqueado por aceptación o conversión. Puedes duplicarlo para continuar.', 'warning');
      return;
    }
    if (inv.docType === 'invoice' && (inv.ncf || Number(inv.paidAmount || 0) > 0)) {
      showToast('Una factura fiscal o con cobros no puede editarse.', 'danger');
      return;
    }

    editingInvoiceId = id;
    editingInvoiceNumber = inv.invoiceNumber || inv.number || id;

    switchPanel('invoices');
    switchSubTab('invoices', 'form');

    const titleEl = document.getElementById('invoice-form-title');
    if (titleEl) {
      if (inv.docType === 'quote') {
        titleEl.textContent = 'Editar Cotización';
      } else if (inv.docType === 'proforma') {
        titleEl.textContent = 'Editar Proforma';
      } else {
        titleEl.textContent = 'Editar Factura';
      }
    }

    const submitBtn = document.querySelector('#invoice-editor-form button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Guardar Cambios';
    }

    // Populate fields
    document.getElementById('form-invoice-id').value = inv.id;
    document.getElementById('form-invoice-client-name').value = inv.clientName;
    document.getElementById('form-invoice-client-id').value = inv.clientId;
    document.getElementById('form-invoice-client-rnc').value = inv.clientRnc || '';
    document.getElementById('form-invoice-date').value = inv.date;
    document.getElementById('form-invoice-due-date').value = inv.dueDate;

    const divisionSelect = document.getElementById('form-invoice-division');
    if (divisionSelect) {
      divisionSelect.value = inv.division || 'general';
    }

    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = inv.docType;
      handleDocTypeChange(inv.docType);
    }

    const ncfTypeSelect = document.getElementById('form-invoice-ncf-type');
    if (ncfTypeSelect) {
      ncfTypeSelect.value = inv.ncfType || 'none';
    }
    
    const ncfInput = document.getElementById('form-invoice-ncf');
    if (ncfInput) {
      ncfInput.value = inv.ncf || '';
    }

    // Populate discount, terms, notes
    const paymentTermsSelect = document.getElementById('form-invoice-payment-terms');
    if (paymentTermsSelect) paymentTermsSelect.value = inv.paymentTerms || 'Contado';

    const invoiceNotesInput = document.getElementById('form-invoice-notes');
    if (invoiceNotesInput) invoiceNotesInput.value = inv.notes || '';

    const discountPctInput = document.getElementById('form-invoice-discount-pct');
    if (discountPctInput) discountPctInput.value = inv.discountPct || 0;

    // Populate items
    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';

    if (inv.items && inv.items.length > 0) {
      inv.items.forEach(item => {
        addInvoiceFormItemRow(item);
      });
    } else {
      addInvoiceFormItemRow();
    }

    calculateInvoiceFormTotals();
  }

  function populateInvoiceForm(source, options = {}) {
    const documentData = source || {};
    clearInvoiceForm();
    switchPanel('invoices');
    switchSubTab('invoices', 'form');

    const docType = ['invoice', 'quote', 'proforma'].includes(documentData.docType) ? documentData.docType : 'quote';
    const today = BillingCore.toLocalDateInput();
    const validityDays = Math.max(1, Number(settings && settings.quoteValidityDays || 15));
    const due = new Date();
    due.setDate(due.getDate() + validityDays);

    document.getElementById('form-invoice-client-name').value = documentData.clientName || '';
    document.getElementById('form-invoice-client-id').value = documentData.clientId || '';
    document.getElementById('form-invoice-client-rnc').value = documentData.clientRnc || '';
    document.getElementById('form-invoice-date').value = options.refreshDates ? today : (documentData.date || today);
    document.getElementById('form-invoice-due-date').value = options.refreshDates
      ? BillingCore.toLocalDateInput(due)
      : (documentData.dueDate || BillingCore.toLocalDateInput(due));

    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = docType;
      handleDocTypeChange(docType);
    }
    const divisionSelect = document.getElementById('form-invoice-division');
    if (divisionSelect) divisionSelect.value = documentData.division || 'general';
    const paymentTermsSelect = document.getElementById('form-invoice-payment-terms');
    if (paymentTermsSelect) paymentTermsSelect.value = documentData.paymentTerms || 'Contado';
    const notesInput = document.getElementById('form-invoice-notes');
    if (notesInput) notesInput.value = documentData.notes || '';
    const discountInput = document.getElementById('form-invoice-discount-pct');
    if (discountInput) discountInput.value = Number(documentData.discountPct || 0);

    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';
    const sourceItems = Array.isArray(documentData.items) ? documentData.items : [];
    sourceItems.forEach(item => addInvoiceFormItemRow(item));
    if (!sourceItems.length) addInvoiceFormItemRow();

    const title = document.getElementById('invoice-form-title');
    if (title) title.textContent = options.title || (docType === 'quote' ? 'Nueva Cotización' : (docType === 'proforma' ? 'Nueva Proforma' : 'Nueva Factura'));
    const submitButton = document.querySelector('#invoice-editor-form button[type="submit"]');
    if (submitButton) submitButton.textContent = docType === 'quote' ? 'Guardar Cotización' : (docType === 'proforma' ? 'Guardar Proforma' : 'Guardar Factura');
    calculateInvoiceFormTotals();
  }

  function duplicateDocument(id) {
    const source = invoices.find(item => item.id === id);
    if (!source) {
      showToast('No se encontró el documento que deseas duplicar.', 'danger');
      return;
    }
    populateInvoiceForm(source, {
      refreshDates: true,
      title: `Duplicado de ${source.invoiceNumber || 'documento'}`
    });
    showToast('Se creó una copia editable. Revisa fechas, precios y condiciones antes de guardarla.', 'success');
  }

  function getBillingSnapshot() {
    return {
      companyCode: activeCompanyCode,
      prefix: isCreaticos ? 'creaticos' : (isPanitas ? 'panitas' : 'futunet'),
      settings,
      invoices,
      clients,
      products,
      creaticosProducts,
      futunetProducts,
      payments,
      currentUser,
      isUserAdmin,
      history: {
        hasMoreInvoices: hasMoreInvoiceHistory,
        hasMorePayments: hasMorePaymentHistory
      }
    };
  }

  function convertQuoteFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    if (!['quote', 'proforma'].includes(inv.docType) || inv.status === 'converted' || inv.convertedTo) {
      showToast('Este documento no puede convertirse nuevamente.', 'warning');
      return;
    }

    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    conversionSourceId = id;
    const isProforma = inv.docType === 'proforma';
    document.getElementById('invoice-form-title').textContent = isProforma ? 'Convertir Proforma a Factura' : 'Convertir Cotización a Factura';
    
    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = inv.clientName;
    document.getElementById('form-invoice-client-id').value = inv.clientId;
    document.getElementById('form-invoice-client-rnc').value = inv.clientRnc || '';
    
    const today = new Date();
    document.getElementById('form-invoice-date').value = BillingCore.toLocalDateInput(today);
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    document.getElementById('form-invoice-due-date').value = BillingCore.toLocalDateInput(dueDate);

    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = 'invoice';
      handleDocTypeChange('invoice');
    }

    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';

    const paymentTermsSelect = document.getElementById('form-invoice-payment-terms');
    if (paymentTermsSelect) paymentTermsSelect.value = inv.paymentTerms || inv.paymentTerm || 'Contado';
    const notesInput = document.getElementById('form-invoice-notes');
    if (notesInput) notesInput.value = inv.notes || '';
    const discountInput = document.getElementById('form-invoice-discount-pct');
    if (discountInput) discountInput.value = inv.discountPct || 0;

    inv.items.forEach(item => {
      addInvoiceFormItemRow({
        productId: item.productId,
        description: item.description,
        price: item.price,
        qty: item.qty,
        tax: item.tax,
        taxMode: item.taxMode,
        taxRate: item.taxRate,
        discount: item.discount
      });
    });
    calculateInvoiceFormTotals();
  }

  function openRegisterPaymentFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    if (inv.docType !== 'invoice' || inv.status === 'cancelled') {
      showToast('Este documento no admite cobros.', 'warning');
      return;
    }

    const total = Number(inv.total);
    const paid = Number(inv.paidAmount || 0);
    const balance = invoiceBalance(inv);
    if (balance <= 0) {
      showToast('La factura no tiene balance pendiente.', 'info');
      return;
    }

    document.getElementById('form-payment-invoice-id').value = id;
    document.getElementById('payment-info-total').textContent = formatMoney(total);
    document.getElementById('payment-info-paid').textContent = formatMoney(paid);
    document.getElementById('payment-info-balance').textContent = formatMoney(balance);

    document.getElementById('form-payment-amount').value = balance.toFixed(2);
    document.getElementById('form-payment-amount').setAttribute('max', balance.toFixed(2));
    document.getElementById('form-payment-notes').value = '';

    openModal('modal-payment');
  }

  // ─── HELPER FUNCTIONS FOR ROW TAX & ITBIS ───
  function handleRowPriceQtyChange(el) {
    const tr = el.closest('tr');
    const price = Number(tr.querySelector('.row-price').value) || 0;
    const qty = Number(tr.querySelector('.row-qty').value) || 1;
    const taxInput = tr.querySelector('.row-tax');
    const discountInput = tr.querySelector('.row-discount');
    
    const discountPct = discountInput ? (Number(discountInput.value) || 0) : 0;
    const lineSubtotal = price * qty;
    const discountAmount = lineSubtotal * (discountPct / 100);
    const netAmount = lineSubtotal - discountAmount;

    if (taxInput && taxInput.dataset.override !== 'true') {
      const taxPercent = Number(taxInput.dataset.percent) || (settings ? Number(settings.defaultTax) : 18);
      taxInput.value = (netAmount * (taxPercent / 100)).toFixed(2);
    }
    calculateInvoiceFormTotals();
  }

  function handleRowTaxChange(el) {
    el.dataset.override = 'true';
    calculateInvoiceFormTotals();
  }

  function removeAllRowTaxes() {
    const tbody = document.getElementById('invoice-form-items-body');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(tr => {
      const taxInput = tr.querySelector('.row-tax');
      if (taxInput) {
        taxInput.value = '0.00';
        taxInput.dataset.override = 'true';
      }
    });
    calculateInvoiceFormTotals();
  }

  async function searchClientByRnc(rnc, context = 'invoice-form') {
    const cleanRnc = String(rnc).replace(/[^0-9]/g, '');
    if (!cleanRnc || (cleanRnc.length !== 9 && cleanRnc.length !== 11)) {
      showToast('Introduce un RNC válido de 9 u 11 dígitos.', 'warning');
      return;
    }

    // Find the button inside the event target context
    const btn = window.event ? window.event.currentTarget : null;
    let originalText = '';
    if (btn) {
      originalText = btn.innerHTML;
      btn.innerHTML = '⚡ Consultando...';
      btn.disabled = true;
    }

    try {
      const data = await lookupRncSecure(cleanRnc);

      if (data.nombre_razon_social) {
        const nombre = data.nombre_razon_social;
        const nombreComercial = data.nombre_comercial ? ` (${data.nombre_comercial})` : '';
        const fullName = nombre + (data.nombre_comercial && data.nombre_comercial !== nombre ? nombreComercial : '');

        if (context === 'client-form') {
          const nameInput = document.getElementById('form-client-name');
          const rncInput = document.getElementById('form-client-rnc');
          if (nameInput) nameInput.value = fullName;
          if (rncInput) rncInput.value = data.cedula_rnc || cleanRnc;
        } else {
          const nameInput = document.getElementById('form-invoice-client-name');
          const idInput = document.getElementById('form-invoice-client-id');
          const rncInput = document.getElementById('form-invoice-client-rnc');
          if (nameInput) nameInput.value = fullName;
          if (idInput) idInput.value = 'custom';
          if (rncInput) rncInput.value = data.cedula_rnc || cleanRnc;
        }
        showToast('Cliente encontrado en DGII: ' + fullName, 'success');
      } else {
        showToast('No se encontraron registros para este RNC o cédula.', 'info');
      }
    } catch (e) {
      console.error('RNC Lookup Error:', e);
      showToast('Error en consulta RNC: ' + e.message, 'danger');
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  }

  // Expose API methods globally inside module wrapper
  return {
    init: init,
    initDashboard: initDashboard,
    switchPanel: switchPanel,
    switchSubTab: switchSubTab,
    
    // Invoices
    renderInvoicesTable: renderInvoicesTable,
    loadMoreBillingHistory: loadMoreBillingHistory,
    openNewInvoiceForm: openNewInvoiceForm,
    editQuote: editQuote,
    populateInvoiceForm: populateInvoiceForm,
    duplicateDocument: duplicateDocument,
    getBillingSnapshot: getBillingSnapshot,
    reloadData: fetchAllData,
    addInvoiceFormItemRow: addInvoiceFormItemRow,
    deleteInvoiceFormItemRow: deleteInvoiceFormItemRow,
    searchRowProductAutocomplete: searchRowProductAutocomplete,
    calculateInvoiceFormTotals: calculateInvoiceFormTotals,
    searchClientAutocomplete: searchClientAutocomplete,
    handleNcfTypeChange: handleNcfTypeChange,
    handleDocTypeChange: handleDocTypeChange,
    saveInvoice: saveInvoice,
    viewInvoice: viewInvoice,
    cancelInvoice: cancelInvoice,
    openFiscalAdjustment: openFiscalAdjustment,
    handleFiscalAdjustmentTypeChange: handleFiscalAdjustmentTypeChange,
    handleFiscalAdjustmentResolutionChange: handleFiscalAdjustmentResolutionChange,
    saveFiscalAdjustment: saveFiscalAdjustment,
    convertQuoteToInvoice: convertQuoteToInvoice,
    printInvoiceDirectly: printInvoiceDirectly,
    printCurrentInvoice: printCurrentInvoice,
    applyAdaptivePrintLayout: applyAdaptivePrintLayout,
    downloadInvoicePDF: downloadInvoicePDF,
    convertQuoteFromList: convertQuoteFromList,
    openRegisterPaymentFromList: openRegisterPaymentFromList,
    handlePrintFormatChange: handlePrintFormatChange,
    handleRowPriceQtyChange: handleRowPriceQtyChange,
    handleRowTaxChange: handleRowTaxChange,
    removeAllRowTaxes: removeAllRowTaxes,
    searchClientByRnc: searchClientByRnc,

    // POS exports
    clearPosCart: clearPosCart,
    searchPosClient: searchPosClient,
    openNewClientFormFromPos: openNewClientFormFromPos,
    handlePosNcfTypeChange: handlePosNcfTypeChange,
    handlePosDocTypeChange: handlePosDocTypeChange,
    checkoutPos: checkoutPos,
    searchPosProducts: searchPosProducts,
    filterPosCategory: filterPosCategory,
    openSimulatedBarcodeModal: openSimulatedBarcodeModal,
    triggerSimulatedScan: triggerSimulatedScan,
    simulateNfcCardTap: simulateNfcCardTap,
    addPosCartItem: addPosCartItem,
    changePosCartItemQty: changePosCartItemQty,
    removePosCartItem: removePosCartItem,
    calculatePosCashChange: calculatePosCashChange,
    confirmPosCashPayment: confirmPosCashPayment,
    handleCashSessionAction: handleCashSessionAction,
    openCashSession: openCashSession,
    closeCashSession: closeCashSession,
    calculateCashDifference: calculateCashDifference,
    checkActiveCashSession: checkActiveCashSession,
    renderSessionsHistoryTable: renderSessionsHistoryTable,
    exportInvoicesToCSV: exportInvoicesToCSV,
    exportDGII606ToCSV: exportDGII606ToCSV,
    exportDGII607ToCSV: exportDGII607ToCSV,
    exportDGII608: exportDGII608,
    exportClientsToCSV: exportClientsToCSV,
    exportProductsToCSV: exportProductsToCSV,
    printKitchenTicket: printKitchenTicket,
    saveTableOrder: saveTableOrder,
    refreshActiveTables: refreshActiveTables,
    loadTableOrder: loadTableOrder,
    selectFreeTable: selectFreeTable,
    refreshKds: refreshKds,
    updateKdsStatus: updateKdsStatus,

    // Payments
    openRegisterPaymentModal: openRegisterPaymentModal,
    registerPayment: registerPayment,

    // Clients
    renderClientsTable: renderClientsTable,
    viewClientProfile: viewClientProfile,
    openNewClientForm: openNewClientForm,
    openEditClientForm: openEditClientForm,
    openNewClientModal: openNewClientForm, // backward compatibility
    openEditClientModal: openEditClientForm, // backward compatibility
    saveClient: saveClient,
    deleteClient: deleteClient,
    openGeneralAbonoModal: openGeneralAbonoModal,
    submitGeneralAbono: submitGeneralAbono,

    // Products
    renderProductsTable: renderProductsTable,
    openNewProductForm: openNewProductForm,
    openEditProductForm: openEditProductForm,
    openNewProductModal: openNewProductForm, // backward compatibility
    openEditProductModal: openEditProductForm, // backward compatibility
    saveProduct: saveProduct,
    deleteProduct: deleteProduct,
    handleModalSourceChange: handleModalSourceChange,

    // Settings
    loadSettingsForm: loadSettingsForm,
    saveSettings: saveSettings,

    // General modals
    closeModal: closeModal,
    showToast: showToast,
    confirmAction: confirmAction,
    promptAction: promptAction
  };
})();
