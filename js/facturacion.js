/**
 * Creaticos Billing System Lógica JS
 * Maneja estadísticas (Chart.js), CRUD de facturas, clientes, productos y cobros con Firestore.
 */

window.ERPBilling = (function () {
  'use strict';

  // Tenant Config
  const activeCompanyCode = (localStorage.getItem('active_company_code') || 'CREATICOS').toUpperCase();
  const isCreaticos = activeCompanyCode === 'CREATICOS';
  const isPanitas = activeCompanyCode === 'PANITAS';

  const collectionClients = isCreaticos ? 'creaticos_clients' : (isPanitas ? 'panitas_clients' : 'futunet_clients');
  const collectionInvoices = isCreaticos ? 'creaticos_invoices' : (isPanitas ? 'panitas_invoices' : 'futunet_invoices');
  const collectionPayments = isCreaticos ? 'creaticos_payments' : (isPanitas ? 'panitas_payments' : 'futunet_payments');
  const collectionSettings = isCreaticos ? 'creaticos_settings' : (isPanitas ? 'panitas_settings' : 'futunet_settings');
  const collectionCashSessions = isCreaticos ? 'creaticos_cash_sessions' : (isPanitas ? 'panitas_cash_sessions' : 'futunet_cash_sessions');
  const collectionProducts = isCreaticos ? 'creaticos_products' : (isPanitas ? 'panitas_products' : 'products');

  // Firestore DB reference
  function getDB() { return window.FutunetFirebase.db; }

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

  // System State Caches
  let settings = null;
  let activeCashSession = null;
  let invoices = [];
  let clients = [];
  let products = [];
  let creaticosProducts = [];
  let futunetProducts = [];
  let payments = [];
  
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

  // Pagination for Invoices
  let invoiceCurrentPage = 1;
  const invoicePageSize = 10;

  // Edit State
  let editingInvoiceId = null;
  let editingInvoiceNumber = null;
  let isInitializingForm = false;

  // Security Context
  let currentUser = null;
  let isUserAdmin = false;

  async function init(userData) {
    currentUser = userData;
    const roles = (userData && Array.isArray(userData.roles)) ? userData.roles : [userData ? (userData.role || 'user') : 'user'];
    const activeCompany = activeCompanyCode.toLowerCase();
    const tenantAdminRole = activeCompany + '_admin';
    isUserAdmin = roles.includes('superadmin') || 
                  roles.includes('admin') || 
                  roles.includes('erp_admin') || 
                  roles.includes(tenantAdminRole);

    console.log('%c✏️ Initializing ERP Billing System for ' + activeCompanyCode + '...', 'color: #0a70a2; font-weight: bold;');
    try {
      applyTenantTheme();
      await loadSettings();
      await fetchAllData();
      await checkActiveCashSession();
      initDashboard();
      setupEventListeners();
      if (isPanitas) {
        refreshActiveTables();
      }
    } catch (err) {
      console.error('Error initializing ERP Billing:', err);
      alert('Error al inicializar la base de datos de facturación: ' + err.message);
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
        pageTitle.textContent = 'Sistema de Facturación — Creaticos Group';
      } else if (isPanitas) {
        pageTitle.textContent = 'Sistema de Facturación — Los Panitas By Nechy';
      } else {
        pageTitle.textContent = 'Sistema de Facturación — Futunet Suministros';
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
      if (isCreaticos) viewLogoEl.src = 'img/logo-creaticos-full.png';
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
          <button type="button" class="pos-category-btn is-active" id="pos-cat-all" onclick="ERPBilling.filterPosCategory('all')">Todos</button>
          <button type="button" class="pos-category-btn" id="pos-cat-comida" onclick="ERPBilling.filterPosCategory('comida')">Comida</button>
          <button type="button" class="pos-category-btn" id="pos-cat-bebidas" onclick="ERPBilling.filterPosCategory('bebidas')">Bebidas</button>
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
          await docRef.update({ name: 'Creaticos Group' });
        }
        // Ensure RNC is updated to the real one
        if (settings.rnc === '131-78945-2') {
          settings.rnc = '133-73669-1';
          await docRef.update({ rnc: '133-73669-1' });
        }
      } else {
        // Futunet migration check
        if (settings.name === 'Futunet' || settings.name === 'Futunet Suministros SRL') {
          settings.name = 'Futunet Suministros';
          await docRef.update({ name: 'Futunet Suministros' });
        }
        if (settings.rnc === '131-78945-2') {
          settings.rnc = '132-70207-7';
          await docRef.update({ rnc: '132-70207-7' });
        }
      }
      // Backward compatibility for quote settings
      if (settings.quotePrefix === undefined) settings.quotePrefix = 'COT-';
      if (settings.nextQuoteNum === undefined) settings.nextQuoteNum = 1001;
      if (settings.proformaPrefix === undefined) settings.proformaPrefix = 'PROF-';
      if (settings.nextProformaNum === undefined) settings.nextProformaNum = 1001;
      if (settings.ncfB14Prefix === undefined) settings.ncfB14Prefix = 'B1400000';
      if (settings.ncfB14Seq === undefined) settings.ncfB14Seq = 1;
      if (settings.ncfB15Prefix === undefined) settings.ncfB15Prefix = 'B1500000';
      if (settings.ncfB15Seq === undefined) settings.ncfB15Seq = 1;
      if (settings.ncfB12Prefix === undefined) settings.ncfB12Prefix = 'B1200000';
      if (settings.ncfB12Seq === undefined) settings.ncfB12Seq = 1;
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
          ncfB01Prefix: 'B0100000',
          ncfB01Seq: 1,
          ncfB02Prefix: 'B0200000',
          ncfB02Seq: 1,
          ncfB14Prefix: 'B1400000',
          ncfB14Seq: 1,
          ncfB15Prefix: 'B1500000',
          ncfB15Seq: 1,
          ncfB12Prefix: 'B1200000',
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
          ncfB01Prefix: 'B0100000',
          ncfB01Seq: 1,
          ncfB02Prefix: 'B0200000',
          ncfB02Seq: 1,
          ncfB14Prefix: 'B1400000',
          ncfB14Seq: 1,
          ncfB15Prefix: 'B1500000',
          ncfB15Seq: 1,
          ncfB12Prefix: 'B1200000',
          ncfB12Seq: 1,
          defaultTax: 0
        };
      } else {
        settings = {
          name: 'Futunet Suministros',
          rnc: '132-70207-7',
          phone: '829-741-1041',
          email: 'info@futunet.com.do',
          address: 'Calle 7 Las Colinas, Santiago',
          invoicePrefix: 'FUT-',
          nextInvoiceNum: 1001,
          quotePrefix: 'COT-',
          nextQuoteNum: 1001,
          proformaPrefix: 'PROF-',
          nextProformaNum: 1001,
          ncfB01Prefix: 'B0100000',
          ncfB01Seq: 1,
          ncfB02Prefix: 'B0200000',
          ncfB02Seq: 1,
          ncfB14Prefix: 'B1400000',
          ncfB14Seq: 1,
          ncfB15Prefix: 'B1500000',
          ncfB15Seq: 1,
          ncfB12Prefix: 'B1200000',
          ncfB12Seq: 1,
          defaultTax: 18
        };
      }
      // Save it directly to Firestore so the document is created
      await docRef.set(settings);
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
  async function fetchAllData() {
    showTableSkeletons();
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
    } else {
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
    }

    const invoicesSnap = await getDB().collection(collectionInvoices).orderBy('createdAt', 'desc').limit(200).get();
    invoices = [];
    invoicesSnap.forEach(doc => {
      invoices.push({ id: doc.id, ...doc.data() });
    });

    const paymentsSnap = await getDB().collection(collectionPayments).orderBy('timestamp', 'desc').limit(200).get();
    payments = [];
    paymentsSnap.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });
  }

  // Setup general DOM action listeners
  function setupEventListeners() {
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
            const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://rnc.megaplus.com.do/api/consulta?rnc=' + cleanRnc);
            const res = await fetch(url);
            if (!res.ok) throw new Error('Error API');
            const data = await res.json();
            if (data && !data.error && data.nombre_razon_social) {
              const nombre = data.nombre_razon_social;
              const nombreComercial = data.nombre_comercial ? ` (${data.nombre_comercial})` : '';
              const fullName = nombre + (data.nombre_comercial && data.nombre_comercial !== nombre ? nombreComercial : '');

              sugBox.style.background = 'rgba(16, 185, 129, 0.1)';
              sugBox.style.border = '1px solid rgba(16, 185, 129, 0.2)';
              sugBox.style.color = '#10b981';
              sugBox.innerHTML = `💡 DGII: ${escapeHTML(fullName)} <span style="text-decoration:underline;margin-left:5px;color:var(--primary);">[Haga clic aquí para autocompletar]</span>`;
              sugBox.onclick = function() {
                const nameEl = document.getElementById(cfg.nameId);
                const idEl = document.getElementById(cfg.idId);
                if (nameEl) nameEl.value = fullName;
                if (idEl) idEl.value = 'custom';
                rncEl.value = data.cedula_rnc || rncEl.value;
                sugBox.style.display = 'none';
              };
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
    if (!timestamp) return '';
    // Handle Firestore timestamp vs JS Date/string
    let date = timestamp;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // ═══════════════════════════════════════════
  // 1. DASHBOARD & STATS LÓGICA
  // ═══════════════════════════════════════════
  function initDashboard() {
    switchPanel('dashboard');

    let totalBilled = 0;
    let totalPaid = 0;

    // Filter cancelled invoices from total calculations
    invoices.forEach(inv => {
      if (inv.status !== 'cancelled') {
        totalBilled += Number(inv.total || 0);
        totalPaid += Number(inv.paidAmount || 0);
      }
    });

    const totalPending = totalBilled - totalPaid;

    // Set stats text
    document.getElementById('stat-total-billed').textContent = formatMoney(totalBilled);
    document.getElementById('stat-total-paid').textContent = formatMoney(totalPaid);
    document.getElementById('stat-total-pending').textContent = formatMoney(totalPending);
    document.getElementById('stat-total-clients').textContent = clients.length.toString();

    // Populate recent invoices table
    const recentBody = document.getElementById('db-recent-invoices-body');
    recentBody.innerHTML = '';
    
    const recent = invoices.slice(0, 5);
    if (recent.length === 0) {
      recentBody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">No hay facturas registradas</td></tr>`;
    } else {
      recent.forEach(inv => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => viewInvoice(inv.id);
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
    renderCategoryChart();
    renderPaymentBreakdown();
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
      if (inv.status === 'cancelled') return;
      let date = null;
      if (inv.createdAt && inv.createdAt.seconds) {
        date = new Date(inv.createdAt.seconds * 1000);
      } else if (inv.date) {
        date = new Date(inv.date);
      }
      if (date) {
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (monthlySales[key] !== undefined) {
          monthlySales[key] += Number(inv.total || 0);
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

  function renderCategoryChart() {
    const ctx = document.getElementById('chart-category-distribution');
    if (!ctx) return;

    if (categoryChart) {
      categoryChart.destroy();
    }

    const categorySales = {};

    invoices.forEach(inv => {
      if (inv.status === 'cancelled') return;
      if (Array.isArray(inv.items)) {
        inv.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId) ||
                       creaticosProducts.find(p => p.id === item.productId) ||
                       futunetProducts.find(p => p.id === item.productId);
          
          let category = 'Otros';
          if (prod && prod.category) {
            category = prod.category;
          } else if (isPanitas) {
            category = 'Comida';
          } else {
            const isCr = creaticosProducts.some(p => p.id === item.productId);
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

  function renderPaymentBreakdown() {
    let cashSales = 0;
    let cardSales = 0;
    let transferSales = 0;
    let creditSales = 0;

    payments.forEach(pay => {
      const method = String(pay.method || 'Efectivo').toLowerCase();
      const amount = Number(pay.amount || 0);

      if (method.includes('efectivo')) {
        cashSales += amount;
      } else if (method.includes('tarjeta')) {
        cardSales += amount;
      } else if (method.includes('transferencia')) {
        transferSales += amount;
      } else {
        cashSales += amount;
      }
    });

    invoices.forEach(inv => {
      if (inv.status === 'cancelled') return;
      if (inv.paymentTerm === 'Crédito') {
        const total = Number(inv.total || 0);
        const paid = Number(inv.paidAmount || 0);
        const balance = total - paid;
        if (balance > 0) {
          creditSales += balance;
        }
      }
    });

    const cashEl = document.getElementById('db-ops-cash');
    const cardEl = document.getElementById('db-ops-card');
    const transferEl = document.getElementById('db-ops-transfer');
    const creditEl = document.getElementById('db-ops-credit');

    if (cashEl) cashEl.textContent = formatMoney(cashSales);
    if (cardEl) cardEl.textContent = formatMoney(cardSales);
    if (transferEl) transferEl.textContent = formatMoney(transferSales);
    if (creditEl) creditEl.textContent = formatMoney(creditSales);
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
        matchStatus = (inv.status === statusFilter);
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
        invDate = new Date(inv.date);
      }
      if (invDate) {
        invDate.setHours(0,0,0,0);
        if (startDateVal) {
          const startDate = new Date(startDateVal);
          startDate.setHours(0,0,0,0);
          if (invDate < startDate) matchDate = false;
        }
        if (endDateVal) {
          const endDate = new Date(endDateVal);
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
        statusBadge = '<span class="admin-badge" style="background:#e0f2fe; color:#0369a1; border: 1px solid #bae6fd;">Cotización</span>';
      } else if (inv.docType === 'proforma') {
        statusBadge = '<span class="admin-badge" style="background:#fef3c7; color:#d97706; border: 1px solid #fde68a;">Proforma</span>';
      } else if (inv.status === 'paid') {
        statusBadge = '<span class="admin-badge badge-paid">Pagada</span>';
      } else if (inv.status === 'pending') {
        const isOverdue = new Date(inv.dueDate) < new Date() && inv.paidAmount < inv.total;
        statusBadge = isOverdue 
          ? '<span class="admin-badge badge-overdue">Vencida</span>' 
          : '<span class="admin-badge badge-pending">Pendiente</span>';
      } else if (inv.status === 'cancelled') {
        statusBadge = '<span class="admin-badge badge-cancelled">Anulada</span>';
      }

      const balance = Number(inv.total) - Number(inv.paidAmount || 0);

      let actionsHtml = `
        <div class="table-actions">
          <button class="table-btn table-btn-primary" title="Ver Detalle" onclick="ERPBilling.viewInvoice('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="table-btn table-btn-secondary" title="Imprimir / PDF" onclick="ERPBilling.printInvoiceDirectly('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          </button>
      `;

      if (inv.status !== 'cancelled') {
        // Edit button is available for all documents (quotes, proformas, invoices)
        actionsHtml += `
          <button class="table-btn table-btn-secondary" title="Editar" onclick="ERPBilling.editQuote('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
          </button>
        `;

        if (inv.docType === 'quote' || inv.docType === 'proforma') {
          actionsHtml += `
            <button class="table-btn table-btn-success" title="Convertir a Factura" onclick="ERPBilling.convertQuoteFromList('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          `;
        } else if (inv.status === 'pending' && balance > 0) {
          actionsHtml += `
            <button class="table-btn table-btn-success" title="Registrar Cobro" onclick="ERPBilling.openRegisterPaymentFromList('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 14h.01M10 14h.01"/></svg>
            </button>
          `;
        }

        actionsHtml += `
          <button class="table-btn table-btn-danger" title="Anular Factura" onclick="ERPBilling.cancelInvoice('${inv.id}')">
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
        <td>${escapeHTML(formatMoney(inv.total))}</td>
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
    `;

    container.appendChild(div);

    document.getElementById('btn-page-prev').onclick = () => {
      if (invoiceCurrentPage > 1) {
        invoiceCurrentPage--;
        renderInvoicesTable();
      }
    };
    document.getElementById('btn-page-next').onclick = () => {
      if (invoiceCurrentPage < totalPages) {
        invoiceCurrentPage++;
        renderInvoicesTable();
      }
    };
  }

  // Reset form helper
  function clearInvoiceForm() {
    editingInvoiceId = null;
    editingInvoiceNumber = null;

    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = '';
    document.getElementById('form-invoice-client-id').value = '';
    document.getElementById('form-invoice-client-rnc').value = '';
    
    // Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('form-invoice-date').value = todayStr;
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    document.getElementById('form-invoice-due-date').value = dueDate.toISOString().split('T')[0];

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
      const price = Number(itemData.price) || 0;
      const qty = Number(itemData.qty) || 1;
      const taxVal = Number(itemData.tax) || 0;
      if (taxVal > 0 && taxVal <= 100) {
        // Old document percentage format (e.g. 18 or 16), calculate it
        rowTaxAmount = price * qty * (taxVal / 100);
        overrideStr = 'false';
        taxPercent = taxVal;
      } else {
        // New document amount format
        rowTaxAmount = taxVal;
        overrideStr = 'true';
        taxPercent = price * qty > 0 ? Math.round((taxVal / (price * qty)) * 100) : (settings ? Number(settings.defaultTax) : 18);
      }
    }

    tr.innerHTML = `
      <td>
        <div class="autocomplete-wrapper" style="position:relative; margin-bottom:4px;">
          <input type="text" class="form-input row-product-search" placeholder="Escribe para buscar..." oninput="ERPBilling.searchRowProductAutocomplete(this, '${rowId}')" value="${itemData ? escapeAttr(itemData.description) : ''}" required autocomplete="off" />
          <input type="hidden" class="row-product-id" value="${itemData ? itemData.productId : 'custom'}" />
          <div class="autocomplete-dropdown row-autocomplete-list" style="display:none; position:absolute; left:0; right:0; z-index:100; max-height:200px; overflow-y:auto; background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px;"></div>
        </div>
      </td>
      <td>
        <input type="number" class="form-input row-price" step="0.01" min="0" value="${itemData ? itemData.price : '0.00'}" required oninput="ERPBilling.handleRowPriceQtyChange(this)" />
      </td>
      <td>
        <input type="number" class="form-input row-qty" min="1" value="${itemData ? itemData.qty : '1'}" required oninput="ERPBilling.handleRowPriceQtyChange(this)" />
      </td>
      <td>
        <input type="number" class="form-input row-tax" step="0.01" min="0" value="${rowTaxAmount.toFixed(2)}" oninput="ERPBilling.handleRowTaxChange(this)" data-override="${overrideStr}" data-percent="${taxPercent}" />
      </td>
      <td>
        <input type="number" class="form-input row-discount" min="0" max="100" value="${itemData && itemData.discount ? itemData.discount : '0'}" oninput="ERPBilling.handleRowPriceQtyChange(this)" style="text-align: right;" />
      </td>
      <td style="text-align:right; font-weight:600; padding-right:10px;" class="row-total">RD$ 0.00</td>
      <td>
        <button type="button" class="table-btn table-btn-danger" title="Quitar Fila" onclick="ERPBilling.deleteInvoiceFormItemRow('${rowId}')">
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

    const allProds = [].concat(
      creaticosProducts.map(p => ({ ...p, _src: 'creaticos' })),
      futunetProducts.map(p => ({ ...p, _src: 'futunet' }))
    );

    const seen = new Set();
    const uniqueProds = allProds.filter(p => {
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
      const srcLabel = p._src === 'creaticos' ? 'Creaticos' : 'Futunet';
      const codeLabel = p.sku ? ` [SKU: ${p.sku}]` : '';

      item.textContent = `${pName} (${formatMoney(pPrice)}) - ${srcLabel}${codeLabel}`;
      
      item.onclick = () => {
        input.value = pName;
        idInput.value = p._src + '_' + p.id;
        
        const priceInput = tr.querySelector('.row-price');
        const taxInput = tr.querySelector('.row-tax');

        if (priceInput) priceInput.value = pPrice.toFixed(2);
        if (taxInput) {
          const productTaxPercent = (p.tax !== undefined) ? Number(p.tax) : 18;
          const qty = Number(tr.querySelector('.row-qty').value) || 1;
          taxInput.value = (pPrice * qty * (productTaxPercent / 100)).toFixed(2);
          taxInput.dataset.override = 'false';
        }

        listEl.style.display = 'none';
        calculateInvoiceFormTotals();
      };
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
    customItem.onclick = () => {
      idInput.value = 'custom';
      listEl.style.display = 'none';
    };
    listEl.appendChild(customItem);

    const createItem = document.createElement('div');
    createItem.className = 'autocomplete-item';
    createItem.style.padding = '8px 12px';
    createItem.style.cursor = 'pointer';
    createItem.style.fontSize = '0.82rem';
    createItem.style.fontWeight = '600';
    createItem.style.color = 'var(--primary)';
    createItem.textContent = `➕ Crear nuevo producto: "${val}"`;
    createItem.onclick = () => {
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
    };
    listEl.appendChild(createItem);
  }

  // Calculate Subtotal, Taxes, and Totals inside creation form
  function calculateInvoiceFormTotals() {
    const tbody = document.getElementById('invoice-form-items-body');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');

    let subtotal = 0;
    let totalDiscount = 0;
    let totalItbis = 0;

    rows.forEach(tr => {
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const lineItbis = Number(tr.querySelector('.row-tax').value) || 0;
      const discountInput = tr.querySelector('.row-discount');
      const discountPct = discountInput ? (Number(discountInput.value) || 0) : 0;

      const lineSubtotal = price * qty;
      const lineDiscount = lineSubtotal * (discountPct / 100);
      const lineNet = lineSubtotal - lineDiscount;
      const lineTotal = lineNet + lineItbis;

      subtotal += lineSubtotal;
      totalDiscount += lineDiscount;
      totalItbis += lineItbis;

      // Update text in row total column
      const totalCol = tr.querySelector('.row-total');
      if (totalCol) totalCol.textContent = formatMoney(lineTotal);
    });

    // Apply global discount if set
    const globalDiscountPctInput = document.getElementById('form-invoice-discount-pct');
    const globalDiscountPct = globalDiscountPctInput ? (Number(globalDiscountPctInput.value) || 0) : 0;
    const globalDiscountAmount = (subtotal - totalDiscount) * (globalDiscountPct / 100);
    totalDiscount += globalDiscountAmount;

    const grandTotal = subtotal - totalDiscount + totalItbis;

    const subtotalEl = document.getElementById('form-summary-subtotal');
    const discountEl = document.getElementById('form-summary-discount');
    const itbisEl = document.getElementById('form-summary-itbis');
    const totalEl = document.getElementById('form-summary-total');

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (discountEl) discountEl.textContent = formatMoney(totalDiscount);
    if (itbisEl) itbisEl.textContent = formatMoney(totalItbis);
    if (totalEl) totalEl.textContent = formatMoney(grandTotal);
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
      dgiiItem.onclick = function() {
        dropdown.style.display = 'none';
        searchClientByRnc(cleanVal, 'invoice-form');
      };
      dropdown.appendChild(dgiiItem);
    }

    if (filtered.length === 0) {
      // Option to quickly register a new client
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.fontWeight = 'bold';
      item.style.color = 'var(--primary)';
      item.innerHTML = `<span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg> + Registrar "${escapeHTML(val)}" como nuevo cliente</span>`;
      item.onclick = function() {
        dropdown.style.display = 'none';
        openNewClientForm(val);
      };
      dropdown.appendChild(item);
    } else {
      filtered.forEach(c => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = `${c.name} ${c.rnc ? `(RNC: ${c.rnc})` : ''}`;
        item.onclick = function() {
          document.getElementById('form-invoice-client-name').value = c.name;
          document.getElementById('form-invoice-client-id').value = c.id;
          document.getElementById('form-invoice-client-rnc').value = c.rnc || 'No registrado';
          dropdown.style.display = 'none';
        };
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
    } else if (type === 'B01') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB01Seq).padStart(8, '0');
      ncfInput.value = settings.ncfB01Prefix + sequence;
    } else if (type === 'B02') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB02Seq).padStart(8, '0');
      ncfInput.value = settings.ncfB02Prefix + sequence;
    } else if (type === 'B14') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB14Seq || 1).padStart(8, '0');
      ncfInput.value = (settings.ncfB14Prefix || 'B1400000') + sequence;
    } else if (type === 'B15') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB15Seq || 1).padStart(8, '0');
      ncfInput.value = (settings.ncfB15Prefix || 'B1500000') + sequence;
    } else if (type === 'B12') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB12Seq || 1).padStart(8, '0');
      ncfInput.value = (settings.ncfB12Prefix || 'B1200000') + sequence;
    }
  }

  // Submit and Save Invoice
  async function saveInvoice(e) {
    e.preventDefault();

    const docType = document.getElementById('form-invoice-doc-type').value;
    let clientId = document.getElementById('form-invoice-client-id').value;
    const clientName = document.getElementById('form-invoice-client-name').value.trim();
    const clientRnc = document.getElementById('form-invoice-client-rnc').value.trim();
    
    if (!clientName) {
      alert('Por favor, introduzca el nombre del cliente.');
      return;
    }
    if (!clientId) {
      clientId = 'custom';
    }

    const date = document.getElementById('form-invoice-date').value;
    const dueDate = document.getElementById('form-invoice-due-date').value;
    const ncfType = document.getElementById('form-invoice-ncf-type').value;
    const ncf = document.getElementById('form-invoice-ncf').value.trim();
    
    const divisionEl = document.getElementById('form-invoice-division');
    const division = divisionEl ? divisionEl.value : 'general';

    // Check if items table is empty
    const tbody = document.getElementById('invoice-form-items-body');
    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) {
      alert('Debes agregar al menos un ítem a la factura.');
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
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const lineTax = Number(tr.querySelector('.row-tax').value) || 0;
      
      const discountInput = tr.querySelector('.row-discount');
      const discountPct = discountInput ? (Number(discountInput.value) || 0) : 0;

      if (!description) {
        showToast('Todos los ítems agregados deben tener una descripción.', 'danger');
        return;
      }

      const lineSub = price * qty;
      const lineDiscount = lineSub * (discountPct / 100);

      items.push({
        productId: productIdInput ? productIdInput.value : 'custom',
        description: description,
        price: price,
        qty: qty,
        tax: lineTax,
        discount: discountPct,
        total: lineSub - lineDiscount + lineTax
      });

      subtotal += lineSub;
      totalItbis += lineTax;
      totalRowDiscount += lineDiscount;
    }

    const globalDiscountPctEl = document.getElementById('form-invoice-discount-pct');
    const globalDiscountPct = globalDiscountPctEl ? (Number(globalDiscountPctEl.value) || 0) : 0;
    const globalDiscountAmount = (subtotal - totalRowDiscount) * (globalDiscountPct / 100);
    const totalDiscountAmount = totalRowDiscount + globalDiscountAmount;
    
    const grandTotal = subtotal - totalDiscountAmount + totalItbis;
    
    // Generate document ID number
    let invoiceNum = '';
    let status = 'pending';
    let paidAmount = 0;
    
    if (editingInvoiceId && editingInvoiceNumber) {
      invoiceNum = editingInvoiceNumber;
      status = docType === 'quote' ? 'quote' : (docType === 'proforma' ? 'proforma' : 'pending');
      const originalDoc = invoices.find(i => i.id === editingInvoiceId);
      if (originalDoc) {
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

    // Document Data
    const paymentTermsEl = document.getElementById('form-invoice-payment-terms');
    const paymentTerms = paymentTermsEl ? paymentTermsEl.value : 'Contado';

    const invoiceNotesEl = document.getElementById('form-invoice-notes');
    const invoiceNotes = invoiceNotesEl ? invoiceNotesEl.value.trim() : '';

    const invoiceData = {
      docType: docType,
      invoiceNumber: invoiceNum,
      clientId: clientId,
      clientName: clientName,
      clientRnc: clientRnc,
      date: date,
      dueDate: dueDate,
      division: division,
      ncfType: (docType === 'quote' || docType === 'proforma') ? 'none' : ncfType,
      ncf: (docType === 'quote' || docType === 'proforma') ? '' : ncf,
      items: items,
      subtotal: subtotal,
      discountPct: globalDiscountPct,
      discountAmount: totalDiscountAmount,
      itbis: totalItbis,
      total: grandTotal,
      paidAmount: paidAmount,
      status: status,
      paymentTerms: paymentTerms,
      notes: invoiceNotes,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (editingInvoiceId) {
      // Save updates to Firestore
      await getDB().collection(collectionInvoices).doc(editingInvoiceId).update(invoiceData);
    } else {
      // Save new document to Firestore using a transaction for NCF and invoice sequences
      const dbRef = getDB();
      const settingsDocRef = dbRef.collection(collectionSettings).doc('general');
      const invoicesCollRef = dbRef.collection(collectionInvoices);

      await dbRef.runTransaction(async (transaction) => {
        const settingsDoc = await transaction.get(settingsDocRef);
        if (!settingsDoc.exists) {
          throw new Error("El documento de configuración de la empresa no existe.");
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

          if (ncfType !== 'none' && ncfType !== 'manual') {
            let prefix = '';
            let seq = 1;
            if (ncfType === 'B01') {
              prefix = freshSettings.ncfB01Prefix || 'B0100000';
              seq = freshSettings.ncfB01Seq || 1;
              settingsUpdates.ncfB01Seq = seq + 1;
            } else if (ncfType === 'B02') {
              prefix = freshSettings.ncfB02Prefix || 'B0200000';
              seq = freshSettings.ncfB02Seq || 1;
              settingsUpdates.ncfB02Seq = seq + 1;
            } else if (ncfType === 'B14') {
              prefix = freshSettings.ncfB14Prefix || 'B1400000';
              seq = freshSettings.ncfB14Seq || 1;
              settingsUpdates.ncfB14Seq = seq + 1;
            } else if (ncfType === 'B15') {
              prefix = freshSettings.ncfB15Prefix || 'B1500000';
              seq = freshSettings.ncfB15Seq || 1;
              settingsUpdates.ncfB15Seq = seq + 1;
            } else if (ncfType === 'B12') {
              prefix = freshSettings.ncfB12Prefix || 'B1200000';
              seq = freshSettings.ncfB12Seq || 1;
              settingsUpdates.ncfB12Seq = seq + 1;
            }
            freshNcf = prefix + String(seq).padStart(8, '0');
          } else if (ncfType === 'manual') {
            freshNcf = ncf; // Keep the manually entered NCF
          }
        }

        invoiceData.invoiceNumber = freshInvoiceNum;
        invoiceData.ncf = (docType === 'quote' || docType === 'proforma') ? '' : freshNcf;
        invoiceData.createdAt = firebase.firestore.FieldValue.serverTimestamp();

        // Perform writes in the transaction
        const newInvoiceDocRef = invoicesCollRef.doc();
        transaction.set(newInvoiceDocRef, invoiceData);
        transaction.update(settingsDocRef, settingsUpdates);
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
  }

  // Cancel/Anular Invoice
  async function cancelInvoice(id, number) {
    if (!isUserAdmin) {
      alert('No tienes permisos (Admin) para anular facturas.');
      return;
    }
    let actualNumber = number;
    if (!actualNumber) {
      const inv = invoices.find(i => i.id === id);
      actualNumber = inv ? inv.invoiceNumber : 'desconocida';
    }
    if (!confirm(`¿Está seguro de que desea ANULAR la factura ${actualNumber}? Esta acción no se puede deshacer y registrará una auditoría.`)) {
      return;
    }

    try {
      await getDB().collection(collectionInvoices).doc(id).update({
        status: 'cancelled'
      });

      // Write Audit Log
      await getDB().collection('audit_logs').add({
        action: `Anulación Factura ${activeCompanyCode}`,
        details: `Factura ${actualNumber} anulada en el panel de ${activeCompanyCode}`,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: firebase.auth().currentUser.uid,
        userEmail: firebase.auth().currentUser.email
      });

      await fetchAllData();
      renderInvoicesTable();
    } catch (err) {
      console.error(err);
      alert('Error al anular la factura.');
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
    handlePrintFormatChange('letter');

    // Fetch client contact details if available
    let client = clients.find(c => c.id === inv.clientId);
    if (!client) {
      client = { address: 'Dirección no registrada', phone: 'N/D', email: 'N/D' };
    }

    // Set company name based on division in invoice
    const nameEl = document.getElementById('view-company-name');
    if (nameEl) {
      if (inv.division === 'papeleria') {
        nameEl.textContent = 'Creaticos Papelería y Suministros';
      } else if (inv.division === 'sublimacion') {
        nameEl.textContent = 'Creaticos Sublimación';
      } else {
        nameEl.textContent = 'Creaticos Group';
      }
    }

    // Target the printable title (Factura vs Cotización vs Proforma)
    const headerTitle = document.querySelector('.billing-meta-box h3');
    if (headerTitle) {
      if (inv.docType === 'quote') {
        headerTitle.textContent = 'COTIZACIÓN';
      } else if (inv.docType === 'proforma') {
        headerTitle.textContent = 'FACTURA PROFORMA';
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

    if (inv.docType === 'quote') {
      statusEl.style.background = '#e0f2fe';
      statusEl.style.color = '#0369a1';
      statusEl.style.border = '1px solid #bae6fd';
      statusEl.textContent = 'Cotización';
    } else if (inv.docType === 'proforma') {
      statusEl.style.background = '#fef3c7';
      statusEl.style.color = '#d97706';
      statusEl.style.border = '1px solid #fde68a';
      statusEl.textContent = 'Proforma';
    } else if (inv.status === 'paid') {
      statusEl.classList.add('badge-paid');
      statusEl.textContent = 'Pagada';
    } else if (inv.status === 'pending') {
      const isOverdue = new Date(inv.dueDate) < new Date() && inv.paidAmount < inv.total;
      statusEl.classList.add(isOverdue ? 'badge-overdue' : 'badge-pending');
      statusEl.textContent = isOverdue ? 'Vencida' : 'Pendiente';
    } else if (inv.status === 'cancelled') {
      statusEl.classList.add('badge-cancelled');
      statusEl.textContent = 'Anulada';
    }

    // Client details
    document.getElementById('view-client-name').textContent = inv.clientName;
    document.getElementById('view-client-rnc').textContent = inv.clientRnc || 'N/D';
    document.getElementById('view-client-phone').textContent = client.phone || 'N/D';
    document.getElementById('view-client-email').textContent = client.email || 'N/D';
    document.getElementById('view-client-address').textContent = client.address || 'N/D';

    // Populate items preview table
    const itemsTbody = document.getElementById('view-invoice-items-body');
    itemsTbody.innerHTML = '';
    
    inv.items.forEach(line => {
      let lineTaxAmount = 0;
      const price = Number(line.price) || 0;
      const qty = Number(line.qty) || 1;
      const taxVal = Number(line.tax) || 0;
      if (taxVal > 0 && taxVal <= 100) {
        // Old document percentage format (e.g. 18 or 16), calculate it
        lineTaxAmount = price * qty * (taxVal / 100);
      } else {
        // New document amount format
        lineTaxAmount = taxVal;
      }

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
    const balance = Number(inv.total) - Number(inv.paidAmount || 0);
    const discountAmount = inv.discountAmount || 0;

    document.getElementById('view-summary-subtotal').textContent = formatMoney(inv.subtotal);
    document.getElementById('view-summary-discount').textContent = formatMoney(discountAmount);
    document.getElementById('view-summary-itbis').textContent = formatMoney(inv.itbis);
    document.getElementById('view-summary-total').textContent = formatMoney(inv.total);
    document.getElementById('view-summary-paid').textContent = formatMoney(inv.paidAmount);
    document.getElementById('view-summary-balance').textContent = formatMoney(balance);

    // Populate payment terms and notes
    const viewTermsEl = document.getElementById('view-invoice-payment-terms');
    if (viewTermsEl) viewTermsEl.textContent = inv.paymentTerms || 'Contado';
    
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
    
    if (inv.docType === 'quote' || inv.docType === 'proforma') {
      payBtn.style.display = 'none';
      if (convertBtn && inv.status !== 'cancelled') {
        convertBtn.style.display = 'inline-flex';
        convertBtn.setAttribute('data-quote-id', inv.id);
      } else if (convertBtn) {
        convertBtn.style.display = 'none';
      }
    } else {
      if (convertBtn) convertBtn.style.display = 'none';
      if (inv.status === 'pending' && balance > 0) {
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

    if (amount <= 0) {
      alert('El monto debe ser superior a cero.');
      return;
    }

    try {
      // 1. Save payment registry document
      const paymentData = {
        invoiceId: invoiceId,
        amount: amount,
        method: method,
        notes: notes,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      await getDB().collection(collectionPayments).add(paymentData);

      // 2. Fetch current invoice paid amount
      const invRef = getDB().collection(collectionInvoices).doc(invoiceId);
      const invSnap = await invRef.get();
      if (invSnap.exists) {
        const inv = invSnap.data();
        const newPaidAmount = Number(inv.paidAmount || 0) + amount;
        
        let status = 'pending';
        // Check if balance paid in full (floating point precision safe)
        if (Math.abs(inv.total - newPaidAmount) < 0.05 || newPaidAmount >= inv.total) {
          status = 'paid';
        }

        // Update invoice document
        await invRef.update({
          paidAmount: newPaidAmount,
          status: status
        });

        // Update Cash Register session totals if active
        if (activeCashSession) {
          const sessRef = getDB().collection(collectionCashSessions).doc(activeCashSession.id);
          const updates = {};
          if (method === 'Efectivo') {
            updates.salesCash = firebase.firestore.FieldValue.increment(amount);
          } else if (method === 'Tarjeta') {
            updates.salesCard = firebase.firestore.FieldValue.increment(amount);
          } else if (method === 'Transferencia') {
            updates.salesTransfer = firebase.firestore.FieldValue.increment(amount);
          }
          await sessRef.update(updates);

          // Refresh local cache of cash session
          const freshDoc = await sessRef.get();
          activeCashSession = { id: freshDoc.id, ...freshDoc.data() };
          updateCashSessionUI();
        }
      }

      // Reload references
      await fetchAllData();
      closeModal('modal-payment');
      
      // Update details view
      viewInvoice(invoiceId);
    } catch (err) {
      console.error(err);
      alert('Error al registrar el cobro en la base de datos.');
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
            <button class="table-btn table-btn-secondary" title="Ver Perfil" onclick="ERPBilling.viewClientProfile('${c.id}')" style="color: var(--primary);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </button>
            <button class="table-btn table-btn-primary" title="Editar" onclick="ERPBilling.openEditClientForm('${c.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="table-btn table-btn-danger" title="Eliminar" onclick="ERPBilling.deleteClient('${c.id}')">
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

    const tbody = document.getElementById('profile-invoices-body');
    tbody.innerHTML = '';

    if (clientInvoices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text-muted);">Este cliente no tiene facturas registradas.</td></tr>';
    } else {
      clientInvoices.forEach(inv => {
        const isCancelled = inv.status === 'cancelled';
        const isQuote = inv.docType === 'quote';
        const isProforma = inv.docType === 'proforma';

        if (!isCancelled && !isQuote && !isProforma) {
          totalPurchases += Number(inv.total) || 0;
          totalPaid += Number(inv.paidAmount || 0);
        }

        const balance = (Number(inv.total) || 0) - (Number(inv.paidAmount || 0));

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
        } else {
          const isOverdue = new Date(inv.dueDate) < new Date();
          if (isOverdue) {
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
            <button class="table-btn table-btn-secondary" title="Ver Factura" onclick="ERPBilling.viewInvoice('${inv.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    const totalBalance = Math.max(0, totalPurchases - totalPaid);

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
        const isUnpaid = inv.status === 'unpaid' || (Number(inv.total || 0) > Number(inv.paidAmount || 0));
        return !isCancelled && !isQuote && !isProforma && isUnpaid;
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
              <td><span style="cursor:pointer; color:var(--primary); text-decoration:underline;" onclick="ERPBilling.viewInvoice('${inv.id}')">${escapeHTML(inv.invoiceNumber)}</span></td>
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
    const clientData = {
      name: document.getElementById('form-client-name').value.trim(),
      rnc: document.getElementById('form-client-rnc').value.trim(),
      phone: document.getElementById('form-client-phone').value.trim(),
      email: document.getElementById('form-client-email').value.trim(),
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
      alert('No tienes permisos (Admin) para eliminar clientes.');
      return;
    }
    let actualName = name;
    if (!actualName) {
      const client = clients.find(c => c.id === id);
      actualName = client ? client.name : 'desconocido';
    }
    if (!confirm(`¿Está seguro de que desea eliminar al cliente "${actualName}"? Las facturas asociadas seguirán existiendo.`)) {
      return;
    }

    try {
      await getDB().collection(collectionClients).doc(id).delete();
      await fetchAllData();
      renderClientsTable();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar cliente de la base de datos.');
    }
  }

  // ═══════════════════════════════════════════
  // 6. PRODUCTOS / SERVICIOS DIRECTORY
  // ═══════════════════════════════════════════
  function renderProductsTable() {
    switchPanel('products');

    const sourceEl = document.getElementById('products-source-filter');
    const source = sourceEl ? sourceEl.value : 'creaticos';
    
    products = source === 'creaticos' ? creaticosProducts : futunetProducts;

    const searchVal = document.getElementById('products-search').value.toLowerCase();
    
    const filtered = products.filter(p => {
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
        if (p.sku) codes.push(`SKU: <span class="admin-code-badge">${p.sku}</span>`);
        if (p.reference || p.ref) codes.push(`Ref: <span class="admin-code-badge">${p.reference || p.ref}</span>`);
        codesHtml = `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; display:flex; gap:8px;">${codes.join(' | ')}</div>`;
      }

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
            <button class="table-btn table-btn-primary" title="Editar" onclick="ERPBilling.openEditProductForm('${p.id}', ${isCreaticosVal})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="table-btn table-btn-danger" title="Eliminar" onclick="ERPBilling.deleteProduct('${p.id}', '', ${isCreaticosVal})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
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
    const titleEl = document.getElementById('product-form-title');
    if (titleEl) titleEl.textContent = 'Agregar Producto / Servicio';

    document.getElementById('form-product-id').value = '';
    document.getElementById('form-product-name').value = '';
    document.getElementById('form-product-description').value = '';
    document.getElementById('form-product-price').value = '';
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
    document.getElementById('form-product-category').value = 'Otros';

    handleModalSourceChange();
    switchPanel('products');
    switchSubTab('products', 'form');
  }

  function openEditProductForm(productId, isCreaticos) {
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
      document.getElementById('form-product-category').value = p.category || 'Otros';
    }

    handleModalSourceChange();
    switchPanel('products');
    switchSubTab('products', 'form');
  }

  async function saveProduct(e) {
    e.preventDefault();

    const id = document.getElementById('form-product-id').value;
    const source = document.getElementById('form-product-source').value;
    const isCreaticos = source === 'creaticos';

    const skuVal = document.getElementById('form-product-sku').value.trim();
    const referenceVal = document.getElementById('form-product-reference').value.trim();
    const barcodeVal = document.getElementById('form-product-barcode').value.trim();

    try {
      if (isCreaticos) {
        const prodData = {
          name: document.getElementById('form-product-name').value.trim(),
          description: document.getElementById('form-product-description').value.trim(),
          price: Number(document.getElementById('form-product-price').value) || 0,
          tax: Number(document.getElementById('form-product-tax').value) || 0,
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
        const priceVal = Number(document.getElementById('form-product-price').value) || 0;
        const stockVal = parseInt(document.getElementById('form-product-stock').value) || 0;
        const categoryVal = document.getElementById('form-product-category').value;

        const prodData = {
          title: nameVal,
          desc: descVal,
          price: priceVal,
          stock: stockVal,
          category: categoryVal,
          department: categoryVal.toLowerCase(),
          condition: 'Nuevo',
          isActive: true,
          sku: skuVal,
          reference: referenceVal,
          barcode: barcodeVal,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (id) {
          await getDB().collection(collectionProducts).doc(id).update(prodData);
        } else {
          prodData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await getDB().collection(collectionProducts).add(prodData);
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
      alert('Error al guardar el producto en la base de datos: ' + err.message);
    }
  }

  async function deleteProduct(id, name, isCreaticos) {
    if (!isUserAdmin) {
      alert('No tienes permisos (Admin) para eliminar ítems.');
      return;
    }
    let actualName = name;
    if (!actualName) {
      const list = isPanitas ? products : (isCreaticos ? creaticosProducts : futunetProducts);
      const prod = list.find(p => p.id === id);
      actualName = prod ? (prod.name || prod.title) : 'desconocido';
    }
    if (!confirm(`¿Está seguro de que desea eliminar el ítem "${actualName}"?`)) {
      return;
    }

    try {
      const coll = isCreaticos ? 'creaticos_products' : collectionProducts;
      await getDB().collection(coll).doc(id).delete();
      await fetchAllData();
      renderProductsTable();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar ítem de la base de datos.');
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
    
    document.getElementById('set-ncf-b01-prefix').value = settings.ncfB01Prefix;
    document.getElementById('set-ncf-b01-seq').value = settings.ncfB01Seq;
    document.getElementById('set-ncf-b02-prefix').value = settings.ncfB02Prefix;
    document.getElementById('set-ncf-b02-seq').value = settings.ncfB02Seq;
    
    document.getElementById('set-ncf-b14-prefix').value = settings.ncfB14Prefix || 'B1400000';
    document.getElementById('set-ncf-b14-seq').value = settings.ncfB14Seq || 1;
    document.getElementById('set-ncf-b15-prefix').value = settings.ncfB15Prefix || 'B1500000';
    document.getElementById('set-ncf-b15-seq').value = settings.ncfB15Seq || 1;
    document.getElementById('set-ncf-b12-prefix').value = settings.ncfB12Prefix || 'B1200000';
    document.getElementById('set-ncf-b12-seq').value = settings.ncfB12Seq || 1;

    document.getElementById('set-invoice-prefix').value = settings.invoicePrefix;
    document.getElementById('set-invoice-seq').value = settings.nextInvoiceNum;
    document.getElementById('set-default-tax').value = settings.defaultTax.toString();
    
    document.getElementById('set-quote-prefix').value = settings.quotePrefix || 'COT-';
    document.getElementById('set-quote-seq').value = settings.nextQuoteNum || 1001;
    
    document.getElementById('set-proforma-prefix').value = settings.proformaPrefix || 'PROF-';
    document.getElementById('set-proforma-seq').value = settings.nextProformaNum || 1001;

    // Ticket Customization
    document.getElementById('set-ticket-slogan').value = settings.ticketSlogan || '';
    document.getElementById('set-ticket-instagram').value = settings.ticketInstagram || '';
    document.getElementById('set-ticket-footer').value = settings.ticketFooter || '';

    // RNC API Key
    document.getElementById('set-rnc-api-key').value = settings.rncApiKey || '';
  }

  async function saveSettings(e) {
    e.preventDefault();

    if (!isUserAdmin) {
      alert('No tienes permisos (Admin) para guardar configuraciones.');
      return;
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
      
      ncfB14Prefix: document.getElementById('set-ncf-b14-prefix').value.trim(),
      ncfB14Seq: Number(document.getElementById('set-ncf-b14-seq').value) || 1,
      ncfB15Prefix: document.getElementById('set-ncf-b15-prefix').value.trim(),
      ncfB15Seq: Number(document.getElementById('set-ncf-b15-seq').value) || 1,
      ncfB12Prefix: document.getElementById('set-ncf-b12-prefix').value.trim(),
      ncfB12Seq: Number(document.getElementById('set-ncf-b12-seq').value) || 1,

      invoicePrefix: document.getElementById('set-invoice-prefix').value.trim(),
      nextInvoiceNum: Number(document.getElementById('set-invoice-seq').value) || 1001,
      defaultTax: Number(document.getElementById('set-default-tax').value) || 18,
      
      quotePrefix: document.getElementById('set-quote-prefix').value.trim(),
      nextQuoteNum: Number(document.getElementById('set-quote-seq').value) || 1001,
      
      proformaPrefix: document.getElementById('set-proforma-prefix').value.trim(),
      nextProformaNum: Number(document.getElementById('set-proforma-seq').value) || 1001,

      ticketSlogan: document.getElementById('set-ticket-slogan').value.trim(),
      ticketInstagram: document.getElementById('set-ticket-instagram').value.trim(),
      ticketFooter: document.getElementById('set-ticket-footer').value.trim(),

      rncApiKey: document.getElementById('set-rnc-api-key').value.trim()
    };

    try {
      await getDB().collection(collectionSettings).doc('general').set(updated, { merge: true });
      
      // Reload settings in cache
      await loadSettings();
      alert('Configuración guardada exitosamente.');
      
      initDashboard();
    } catch (err) {
      console.error(err);
      alert('Error al guardar configuración.');
    }
  }

  // ═══════════════════════════════════════════
  // 8. MODALS OPEN/CLOSE HELPERS
  // ═══════════════════════════════════════════
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-open');
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
        
        const realCash = s.closedAt ? (Number(s.realCashCount) || 0) : null;
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
        const notes = s.closeNotes || '—';
        
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

      card.onclick = () => addPosCartItem(p);
      card.innerHTML = `
        <div class="pos-prod-info">
          <div style="display:flex; align-items:center; width:100%; gap:4px; margin-bottom:4px;">
            <span class="pos-prod-badge ${badgeClass}">${badgeLabel}</span>
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
      const sourceBadge = item.isCreaticos ? ' (C)' : ' (F)';

      itemEl.innerHTML = `
        <div class="pos-item-info">
          <div class="pos-item-title">${escapeHTML(item.name)}</div>
          <div class="pos-item-meta">${escapeHTML(formatMoney(item.price))} c/u${sourceBadge}</div>
        </div>
        <div class="pos-item-qty-controls">
          <button type="button" class="pos-qty-btn" onclick="ERPBilling.changePosCartItemQty(${index}, -1)">-</button>
          <span class="pos-qty-val">${item.qty}</span>
          <button type="button" class="pos-qty-btn" onclick="ERPBilling.changePosCartItemQty(${index}, 1)">+</button>
        </div>
        <div class="pos-item-price">${escapeHTML(formatMoney(sub))}</div>
        <button type="button" class="pos-btn-icon" onclick="ERPBilling.removePosCartItem(${index})" style="padding:4px; margin-left:4px;" title="Quitar item">
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
      alert('Debes abrir una sesión de caja antes de agregar productos al carrito.');
      handleCashSessionAction();
      return;
    }

    if (p.stock !== undefined && p.stock !== null && Number(p.stock) <= 0) {
      showToast(`El producto "${p.name || p.title}" está agotado.`, 'warning');
      return;
    }

    const isCr = p._isCreaticos;
    const pId = isCr ? 'creaticos_' + p.id : 'futunet_' + p.id;
    
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
        price: Number(p.price),
        qty: 1,
        tax: p.tax !== undefined ? Number(p.tax) : (settings ? Number(settings.defaultTax) : 18),
        isCreaticos: isCr
      });
    }
    renderPosCart();
    playBeepTone(800, 0.05);
  }

  function changePosCartItemQty(index, delta) {
    if (index < 0 || index >= posCart.length) return;
    const item = posCart[index];
    if (delta > 0) {
      const originalId = item.productId.replace(/^(creaticos_|futunet_)/, '');
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
    const table = document.getElementById('pos-restaurant-table').value.trim();
    const clientName = document.getElementById('pos-restaurant-client-name').value.trim();
    if (!table) {
      showToast('Por favor, especifique la mesa antes de imprimir el ticket de cocina.', 'warning');
      return;
    }
    if (posCart.length === 0) {
      showToast('El carrito está vacío.', 'warning');
      return;
    }

    const ticketEl = document.getElementById('kitchen-ticket-print');
    if (!ticketEl) return;

    let itemsHtml = '';
    posCart.forEach(item => {
      itemsHtml += `
        <div style="display:flex; justify-content:space-between; font-size:12pt; border-bottom:1px dashed #ccc; padding:4px 0;">
          <span style="font-weight:bold;">${item.qty}x ${escapeHTML(item.name)}</span>
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

  async function saveTableOrder() {
    const table = document.getElementById('pos-restaurant-table').value.trim();
    const clientName = document.getElementById('pos-restaurant-client-name').value.trim();
    if (!table) {
      showToast('Por favor, especifique la mesa para guardar la orden.', 'warning');
      return;
    }
    if (posCart.length === 0) {
      showToast('El carrito está vacío.', 'warning');
      return;
    }

    try {
      const orderData = {
        table: table,
        clientName: clientName || 'Consumidor Final',
        items: posCart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          tax: item.tax || 0
        })),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await getDB().collection('panitas_table_orders').doc(table).set(orderData);
      showToast(`Orden de ${table} guardada con éxito.`, 'success');
      clearPosCart();
      await refreshActiveTables();
    } catch (e) {
      console.error('Error saving table order:', e);
      showToast('Error al guardar la orden de la mesa.', 'danger');
    }
  }

  async function refreshActiveTables() {
    const listEl = document.getElementById('pos-restaurant-tables-list');
    if (!listEl) return;

    try {
      const snap = await getDB().collection('panitas_table_orders').orderBy('updatedAt', 'desc').get();
      listEl.innerHTML = '';

      if (snap.empty) {
        listEl.innerHTML = '<div style="font-size:0.8rem; color:var(--text-muted);">No hay mesas activas.</div>';
        return;
      }

      snap.forEach(doc => {
        const order = doc.data();
        let total = 0;
        order.items.forEach(item => {
          total += item.price * item.qty * (1 + (item.tax || 0) / 100);
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'admin-btn';
        btn.style.cssText = 'background:#ffedd5; border:1px solid #fed7aa; color:#ea580c; border-radius:10px; padding: 6px 12px; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px; cursor:pointer; font-weight:600;';
        btn.onclick = () => loadTableOrder(order.table);
        btn.innerHTML = `
          <span>🍽️ ${escapeHTML(order.table)} (${escapeHTML(order.clientName)})</span>
          <strong style="color:#c2410c;">${formatMoney(total)}</strong>
        `;
        listEl.appendChild(btn);
      });
    } catch (e) {
      console.error('Error refreshing active tables:', e);
      listEl.innerHTML = '<div style="font-size:0.8rem; color:#ef4444;">Error al cargar mesas activas.</div>';
    }
  }

  async function loadTableOrder(tableName) {
    try {
      const doc = await getDB().collection('panitas_table_orders').doc(tableName).get();
      if (!doc.exists) {
        showToast('La orden no existe.', 'danger');
        return;
      }

      const order = doc.data();
      posCart = order.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        tax: item.tax || 0
      }));

      renderPosCart();

      const tableInput = document.getElementById('pos-restaurant-table');
      const clientNameInput = document.getElementById('pos-restaurant-client-name');
      if (tableInput) tableInput.value = order.table;
      if (clientNameInput) clientNameInput.value = order.clientName;

      showToast(`Orden de ${tableName} cargada en el carrito.`, 'success');
    } catch (e) {
      console.error('Error loading table order:', e);
      showToast('Error al cargar la orden de la mesa.', 'danger');
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
    const currentClientId = clients.find(c => c.name === clientName)?.id || '';
    if (!currentClientId) {
      showToast('Error al identificar el cliente activo.', 'danger');
      return;
    }

    if (clientId) clientId.value = currentClientId;
    if (nameEl) nameEl.textContent = clientName;
    if (debtEl) debtEl.textContent = formatMoney(balanceVal);
    if (amountInput) amountInput.value = balanceVal.toFixed(2);
    if (notesInput) notesInput.value = '';

    openModal('modal-general-abono');
  }

  async function submitGeneralAbono(e) {
    e.preventDefault();

    const clientId = document.getElementById('form-abono-client-id').value;
    const amountVal = Number(document.getElementById('form-abono-amount').value) || 0;
    const method = document.getElementById('form-abono-method').value;
    const notes = document.getElementById('form-abono-notes').value.trim();

    if (!clientId || amountVal <= 0) {
      showToast('Por favor, ingrese un monto válido.', 'warning');
      return;
    }

    try {
      // Fetch all invoices for this client
      const snap = await getDB().collection(collectionInvoices)
        .where('clientId', '==', clientId)
        .where('docType', '==', 'invoice')
        .get();

      let clientInvoices = [];
      snap.forEach(doc => {
        const data = doc.data();
        const total = Number(data.total) || 0;
        const paid = Number(data.paidAmount) || 0;
        const pending = total - paid;
        if (data.status !== 'cancelled' && pending > 0) {
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

      let remainingAbono = amountVal;
      const db = getDB();

      // We will perform updates in a Batch
      const batch = db.batch();

      for (let inv of clientInvoices) {
        if (remainingAbono <= 0) break;

        const payAmountForThisInvoice = Math.min(remainingAbono, inv.pending);
        const newPaidAmount = (Number(inv.paidAmount) || 0) + payAmountForThisInvoice;
        const fullyPaid = newPaidAmount >= inv.total;

        // Update Invoice
        const invRef = db.collection(collectionInvoices).doc(inv.id);
        batch.update(invRef, {
          paidAmount: newPaidAmount,
          status: fullyPaid ? 'paid' : 'partial',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Add Payment Doc
        const paymentRef = db.collection(collectionPayments).doc();
        batch.set(paymentRef, {
          invoiceId: inv.id,
          amount: payAmountForThisInvoice,
          method: method,
          notes: (notes ? notes + ' - ' : '') + 'Abono general prorrateado',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // If Cash Register session is active, increment session cash/card/nfc/transfer totals
        if (activeCashSession) {
          const sessRef = db.collection(collectionCashSessions).doc(activeCashSession.id);
          const updates = {};
          if (method === 'Efectivo') {
            updates.salesCash = firebase.firestore.FieldValue.increment(payAmountForThisInvoice);
          } else if (method === 'Tarjeta') {
            updates.salesCard = firebase.firestore.FieldValue.increment(payAmountForThisInvoice);
          } else if (method === 'Transferencia') {
            updates.salesTransfer = firebase.firestore.FieldValue.increment(payAmountForThisInvoice);
          }
          batch.update(sessRef, updates);
        }

        remainingAbono -= payAmountForThisInvoice;
      }

      await batch.commit();

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
      if (restTable) restTable.value = '';
      if (restClient) restClient.value = '';
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
      item.onclick = () => {
        document.getElementById('pos-client-search').value = c.name;
        document.getElementById('pos-client-id').value = c.id;
        document.getElementById('pos-client-rnc').value = c.rnc || '';
        posClient = { id: c.id, name: c.name, rnc: c.rnc || '' };
        listEl.style.display = 'none';
      };
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
  async function checkActiveCashSession() {
    if (!currentUser) return;
    try {
      const email = currentUser.email || '';
      const snap = await getDB().collection(collectionCashSessions)
        .where('status', '==', 'open')
        .where('openedBy', '==', email)
        .limit(1)
        .get();

      if (!snap.empty) {
        const doc = snap.docs[0];
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
      const totalSession = activeCashSession.initialCash + (activeCashSession.salesCash || 0) + (activeCashSession.salesCard || 0) + (activeCashSession.salesNfc || 0) + (activeCashSession.salesTransfer || 0);
      label.textContent = `Caja Abierta: ${formatMoney(totalSession)}`;
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
    const initialCash = Number(amountInput ? amountInput.value : 0) || 0;

    try {
      const email = currentUser.email || '';
      const docData = {
        openedBy: email,
        openedAt: firebase.firestore.FieldValue.serverTimestamp(),
        initialCash: initialCash,
        status: 'open',
        salesCash: 0,
        salesCard: 0,
        salesNfc: 0,
        salesTransfer: 0,
        transactionsCount: 0
      };

      const ref = await getDB().collection(collectionCashSessions).add(docData);
      activeCashSession = { id: ref.id, ...docData };
      updateCashSessionUI();
      closeModal('modal-cash-open');
      alert('Caja abierta correctamente.');
    } catch (err) {
      console.error('Error opening cash session:', err);
      alert('Error al abrir la caja: ' + err.message);
    }
  }

  function calculateCashDifference() {
    if (!activeCashSession) return;
    const realInput = document.getElementById('form-cash-close-real');
    const realVal = Number(realInput ? realInput.value : 0) || 0;
    const expected = activeCashSession.initialCash + (activeCashSession.salesCash || 0);
    const diff = realVal - expected;

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
    const realVal = Number(realInput ? realInput.value : 0) || 0;
    const notes = notesInput ? notesInput.value.trim() : '';

    const expected = activeCashSession.initialCash + (activeCashSession.salesCash || 0);
    const diff = realVal - expected;

    try {
      await getDB().collection(collectionCashSessions).doc(activeCashSession.id).update({
        closedAt: firebase.firestore.FieldValue.serverTimestamp(),
        realCash: realVal,
        difference: diff,
        notes: notes,
        status: 'closed'
      });

      activeCashSession = null;
      updateCashSessionUI();
      closeModal('modal-cash-close');
      alert('Caja cerrada con éxito. El arqueo ha sido registrado.');
    } catch (err) {
      console.error('Error closing cash session:', err);
      alert('Error al cerrar la caja: ' + err.message);
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
    }
  }

  function exportInvoicesToCSV() {
    if (invoices.length === 0) {
      alert('No hay facturas registradas para exportar.');
      return;
    }

    let csv = 'No. Factura,Tipo,NCF,Cliente,RNC/Cédula,Fecha Emisión,Subtotal,ITBIS,Total,Pagado,Estado\n';
    invoices.forEach(inv => {
      const ncf = inv.ncf || 'N/D';
      const rnc = inv.clientRnc || 'N/D';
      const cleanName = (inv.clientName || 'Consumidor Final').replace(/"/g, '""');
      
      csv += `"${inv.invoiceNumber}","${inv.docType}","${ncf}","${cleanName}","${rnc}","${inv.date}",${inv.subtotal || 0},${inv.itbis || 0},${inv.total || 0},${inv.paidAmount || 0},"${inv.status}"\n`;
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`Facturas_${companyName}_${new Date().toISOString().split('T')[0]}.csv`, csv);
  }

  function exportDGII607ToCSV() {
    const validInvoices = invoices.filter(inv => inv.docType === 'invoice' && inv.status !== 'cancelled');
    if (validInvoices.length === 0) {
      showToast('No hay facturas válidas registradas para exportar Formato 607.', 'warning');
      return;
    }

    let csv = 'RNC o Cedula,Tipo Identificacion,NCF,NCF Modificado,Tipo Ingreso,Fecha Comprobante,Fecha Retencion,Monto Facturado,ITBIS Facturado,ITBIS Retenido por Terceros,ITBIS Percibido,Retencion Impuesto sobre la Renta,Impuesto Selectivo al Consumo,Otros Impuestos Tasas,Propina Legal,Monto Efectivo,Monto Tarjeta Credito,Monto Transferencia Cheque,Monto Venta a Credito\n';
    
    validInvoices.forEach(inv => {
      const rawRnc = (inv.clientRnc || '').replace(/[^0-9]/g, '');
      let tipoId = 3; // Pasaporte/Otro/Consumidor Final
      if (rawRnc.length === 9) tipoId = 1; // RNC
      else if (rawRnc.length === 11) tipoId = 2; // Cédula

      const ncf = inv.ncf || '';
      const dateStr = (inv.date || '').replace(/[^0-9]/g, ''); // YYYYMMDD
      
      const subtotal = Number(inv.subtotal) || 0;
      const itbis = Number(inv.itbis) || 0;
      const total = Number(inv.total) || 0;

      let cashAmt = 0;
      let cardAmt = 0;
      let transferAmt = 0;
      let creditAmt = 0;

      if (inv.status === 'paid') {
        if (inv.paymentTerms === 'Contado') {
          cashAmt = total;
        } else {
          transferAmt = total;
        }
      } else {
        creditAmt = total;
      }

      csv += `"${rawRnc}",${tipoId},"${ncf}","",01,"${dateStr}","",${subtotal.toFixed(2)},${itbis.toFixed(2)},0.00,0.00,0.00,0.00,0.00,0.00,${cashAmt.toFixed(2)},${cardAmt.toFixed(cardAmt)},${transferAmt.toFixed(2)},${creditAmt.toFixed(2)}\n`;
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`DGII_607_${companyName}_${new Date().toISOString().split('T')[0]}.csv`, csv);
    showToast('Reporte DGII 607 exportado con éxito.', 'success');
  }

  function exportDGII606ToCSV() {
    let csv = 'RNC o Cedula,Tipo Identificacion,Tipo Gasto,NCF,NCF Modificado,Fecha Comprobante,Fecha Pago,Monto Facturado,ITBIS Facturado,ITBIS Retenido,ITBIS Sujeto a Proporcionalidad,ITBIS Total Gasto,ITBIS por Adelantar,Retencion Renta,ISR Percibido,Impuesto Selectivo al Consumo,Otros Impuestos Tasas,Propina Legal,Forma Pago\n';
    csv += `"999999999",1,01,"B0100000001","",20260101,20260101,1000.00,180.00,0.00,0.00,180.00,180.00,0.00,0.00,0.00,0.00,0.00,01\n`;

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`DGII_606_Plantilla_${companyName}_${new Date().toISOString().split('T')[0]}.csv`, csv);
    showToast('Plantilla DGII 606 exportada con éxito.', 'success');
  }

  function exportClientsToCSV() {
    if (clients.length === 0) {
      alert('No hay clientes registrados para exportar.');
      return;
    }

    let csv = 'Nombre,RNC/Cédula,Teléfono,Email,Dirección\n';
    clients.forEach(c => {
      const cleanName = (c.name || '').replace(/"/g, '""');
      const cleanAddr = (c.address || '').replace(/"/g, '""');
      csv += `"${cleanName}","${c.rnc || ''}","${c.phone || ''}","${c.email || ''}","${cleanAddr}"\n`;
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`Clientes_${companyName}_${new Date().toISOString().split('T')[0]}.csv`, csv);
  }

  function exportProductsToCSV() {
    if (products.length === 0) {
      alert('No hay productos registrados para exportar.');
      return;
    }

    let csv = 'Código/ID,Descripción,Precio,Impuesto (%),Origen\n';
    products.forEach(p => {
      const cleanDesc = (p.name || p.title || p.description || '').replace(/"/g, '""');
      const origin = p._isCreaticos ? 'Creaticos' : 'Futunet';
      csv += `"${p.id}","${cleanDesc}",${p.price || 0},${p.tax || 0},"${origin}"\n`;
    });

    const companyName = settings ? settings.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
    downloadCSV(`Productos_${companyName}_${new Date().toISOString().split('T')[0]}.csv`, csv);
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
      document.getElementById('nfc-payment-status').textContent = 'ESPERANDO DISPOSITIVO O TARJETA...';
      const tapBtn = document.getElementById('btn-nfc-tap-action');
      if (tapBtn) {
        tapBtn.style.display = 'block';
        tapBtn.textContent = 'Simular Contacto (Tap)';
      }
      openModal('modal-nfc-payment');
      return;
    }

    if (method === 'credit') {
      if (!posClient || !posClient.id) {
        showToast('Debe seleccionar un cliente registrado para realizar una venta a crédito.', 'warning');
        return;
      }
      if (!confirm(`¿Desea registrar esta venta a crédito para ${posClient.name}?`)) {
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
      
      let cleanProdId = item.productId;
      if (cleanProdId.startsWith('creaticos_')) cleanProdId = cleanProdId.substring('creaticos_'.length);
      else if (cleanProdId.startsWith('futunet_')) cleanProdId = cleanProdId.substring('futunet_'.length);
      else if (cleanProdId.startsWith('panitas_')) cleanProdId = cleanProdId.substring('panitas_'.length);

      return {
        productId: cleanProdId,
        description: item.name,
        price: item.price,
        qty: item.qty,
        tax: item.tax,
        total: lineSub + lineTax
      };
    });

    const total = subtotal + itbis;
    const paidAmount = (docType === 'invoice') ? (method === 'credit' ? 0 : total) : 0;

    const invoiceData = {
      docType: docType,
      clientId: posClient.id || 'anonymous',
      clientName: posClient.name,
      clientRnc: posClient.rnc,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      subtotal: subtotal,
      itbis: itbis,
      total: total,
      paidAmount: paidAmount,
      status: status,
      items: items,
      paymentTerm: method === 'credit' ? 'Crédito' : 'Contado',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      const collectionName = collectionInvoices;
      const settingsColl = collectionSettings;
      const paymentsColl = collectionPayments;
      const dbRef = getDB();
      const settingsDocRef = dbRef.collection(settingsColl).doc('general');
      const invoicesCollRef = dbRef.collection(collectionName);
      
      let createdDocId = '';

      await dbRef.runTransaction(async (transaction) => {
        // Stock Validation & Decrement
        for (let item of posCart) {
          let cleanProdId = item.productId;
          if (cleanProdId.startsWith('creaticos_')) cleanProdId = cleanProdId.substring('creaticos_'.length);
          else if (cleanProdId.startsWith('futunet_')) cleanProdId = cleanProdId.substring('futunet_'.length);
          else if (cleanProdId.startsWith('panitas_')) cleanProdId = cleanProdId.substring('panitas_'.length);

          const productDocRef = dbRef.collection(collectionProducts).doc(cleanProdId);
          const productDoc = await transaction.get(productDocRef);

          if (productDoc.exists) {
            const data = productDoc.data();
            if (data.stock !== undefined && data.stock !== null) {
              const currentStock = Number(data.stock) || 0;
              if (currentStock < item.qty) {
                throw new Error(`Stock insuficiente para "${data.name || data.title}". Disponible: ${currentStock}, Solicitado: ${item.qty}`);
              }
              transaction.update(productDocRef, {
                stock: currentStock - item.qty
              });
            }
          }
        }

        const settingsDoc = await transaction.get(settingsDocRef);
        if (!settingsDoc.exists) {
          throw new Error("El documento de configuración de la empresa no existe.");
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

          if (ncfType !== 'none') {
            let prefix = '';
            let seq = 1;

            if (ncfType === 'B01') {
              prefix = freshSettings.ncfB01Prefix || 'B0100000';
              seq = freshSettings.ncfB01Seq || 1;
              settingsUpdates.ncfB01Seq = seq + 1;
            } else if (ncfType === 'B02') {
              prefix = freshSettings.ncfB02Prefix || 'B0200000';
              seq = freshSettings.ncfB02Seq || 1;
              settingsUpdates.ncfB02Seq = seq + 1;
            } else if (ncfType === 'B14') {
              prefix = freshSettings.ncfB14Prefix || 'B1400000';
              seq = freshSettings.ncfB14Seq || 1;
              settingsUpdates.ncfB14Seq = seq + 1;
            } else if (ncfType === 'B15') {
              prefix = freshSettings.ncfB15Prefix || 'B1500000';
              seq = freshSettings.ncfB15Seq || 1;
              settingsUpdates.ncfB15Seq = seq + 1;
            } else if (ncfType === 'B12') {
              prefix = freshSettings.ncfB12Prefix || 'B1200000';
              seq = freshSettings.ncfB12Seq || 1;
              settingsUpdates.ncfB12Seq = seq + 1;
            }

            freshNcf = prefix + String(seq).padStart(8, '0');
          }
        }

        invoiceData.invoiceNumber = freshInvoiceNum;
        invoiceData.ncf = (docType === 'quote' || docType === 'proforma') ? '' : freshNcf;

        // Perform writes in transaction
        const newInvoiceDocRef = invoicesCollRef.doc();
        createdDocId = newInvoiceDocRef.id;
        
        transaction.set(newInvoiceDocRef, invoiceData);
        transaction.update(settingsDocRef, settingsUpdates);
      });

      // After transaction succeeds, register payments if needed
      if (docType === 'invoice' && paidAmount > 0) {
        const paymentData = {
          invoiceId: createdDocId,
          amount: paidAmount,
          method: method === 'cash' ? 'Efectivo' : 'Tarjeta',
          notes: 'Pago POS ' + (method === 'nfc' ? 'Contactless NFC' : ''),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        await getDB().collection(paymentsColl).add(paymentData);
      }

      // Update Cash Register session totals if active
      if (activeCashSession && docType === 'invoice') {
        const sessRef = getDB().collection(collectionCashSessions).doc(activeCashSession.id);
        const updates = {
          transactionsCount: firebase.firestore.FieldValue.increment(1)
        };
        if (method === 'credit') {
          updates.salesCredit = firebase.firestore.FieldValue.increment(total);
        } else if (paidAmount > 0) {
          if (method === 'cash') {
            updates.salesCash = firebase.firestore.FieldValue.increment(paidAmount);
          } else if (method === 'nfc') {
            updates.salesNfc = firebase.firestore.FieldValue.increment(paidAmount);
          } else {
            updates.salesCard = firebase.firestore.FieldValue.increment(paidAmount);
          }
        }
        await sessRef.update(updates);
        
        // Refresh local cache of cash session
        const freshDoc = await sessRef.get();
        activeCashSession = { id: freshDoc.id, ...freshDoc.data() };
        updateCashSessionUI();
      }

      await loadSettings();
      await fetchAllData();
      renderInvoicesTable();

      showToast('Transacción procesada con éxito. Emitiendo ticket...', 'success');
      
      const invoiceId = createdDocId;
      
      // Delete table order if active in restaurant mode
      if (isPanitas) {
        const tableInput = document.getElementById('pos-restaurant-table');
        const table = tableInput ? tableInput.value.trim() : '';
        if (table) {
          try {
            await getDB().collection('panitas_table_orders').doc(table).delete();
            await refreshActiveTables();
          } catch (errTable) {
            console.error('Error cleaning table order:', errTable);
          }
        }
      }

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
    }
  }

  function simulateNfcCardTap() {
    const statusEl = document.getElementById('nfc-payment-status');
    const tapBtn = document.getElementById('btn-nfc-tap-action');
    if (!statusEl) return;

    statusEl.textContent = 'PROCESANDO PAGO CON EL BANCO...';
    if (tapBtn) tapBtn.style.display = 'none';

    playBeepTone(1200, 0.15);

    setTimeout(() => {
      statusEl.innerHTML = '<span style="color:#10b981; font-weight:bold;">✔ PAGO APROBADO</span>';
      
      setTimeout(async () => {
        closeModal('modal-nfc-payment');
        await processPosSale('nfc');
      }, 1200);
    }, 1800);
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
      alert('Por favor, selecciona o introduce un código.');
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
      alert(`Código de barras "${code}" no encontrado en el catálogo.`);
    }
  }

  async function printInvoiceDirectly(id) {
    await viewInvoice(id);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  function downloadInvoicePDF() {
    const element = document.getElementById('invoice-print-area');
    if (!element) return;

    const invoiceNum = document.getElementById('view-invoice-number').textContent || 'Invoice';
    
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `Factura_${invoiceNum}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    showToast('Generando PDF para descarga...', 'info');
    
    html2pdf().set(opt).from(element).save()
      .then(() => {
        showToast('PDF descargado con éxito.', 'success');
      })
      .catch((err) => {
        console.error(err);
        showToast('Error al generar PDF: ' + err.message, 'danger');
      });
  }

  function handlePrintFormatChange(format) {
    const printArea = document.getElementById('invoice-print-area');
    if (!printArea) return;
    if (format === 'ticket') {
      printArea.classList.add('print-format-ticket');
    } else {
      printArea.classList.remove('print-format-ticket');
    }
  }

  function editQuote(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    editingInvoiceId = id;
    editingInvoiceNumber = inv.invoiceNumber;

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

  function convertQuoteFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    const isProforma = inv.docType === 'proforma';
    document.getElementById('invoice-form-title').textContent = isProforma ? 'Convertir Proforma a Factura' : 'Convertir Cotización a Factura';
    
    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = inv.clientName;
    document.getElementById('form-invoice-client-id').value = inv.clientId;
    document.getElementById('form-invoice-client-rnc').value = inv.clientRnc || '';
    
    const today = new Date();
    document.getElementById('form-invoice-date').value = today.toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    document.getElementById('form-invoice-due-date').value = dueDate.toISOString().split('T')[0];

    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = 'invoice';
      handleDocTypeChange('invoice');
    }

    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';

    inv.items.forEach(item => {
      addInvoiceFormItemRow({
        productId: item.productId,
        description: item.description,
        price: item.price,
        qty: item.qty,
        tax: item.tax
      });
    });
  }

  function openRegisterPaymentFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    const total = Number(inv.total);
    const paid = Number(inv.paidAmount || 0);
    const balance = total - paid;

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
      alert('Por favor, introduzca un RNC válido de 9 o 11 dígitos.');
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

    const apiKey = (settings && settings.rncApiKey) ? settings.rncApiKey.trim() : '';
    if (!apiKey) {
      alert('Por favor, configure su Token de Megaplus API en los Ajustes de la empresa (sección Servicios Externos) para habilitar la consulta automática de RNC.');
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
      return;
    }

    try {
      const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://rnc.megaplus.com.do/api/consulta?rnc=' + cleanRnc + '&token=' + apiKey);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al consultar RNC en el servidor externo.');
      const data = await res.json();
      
      if (data && data.error) {
        throw new Error(data.error);
      }

      if (data && data.nombre_razon_social) {
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
        alert('Cliente encontrado en DGII: ' + fullName);
      } else {
        alert('No se encontraron registros para este RNC/Cédula.');
      }
    } catch (e) {
      console.error('RNC Lookup Error:', e);
      alert('Error en consulta RNC: ' + e.message);
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
    openNewInvoiceForm: openNewInvoiceForm,
    editQuote: editQuote,
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
    convertQuoteToInvoice: convertQuoteToInvoice,
    printInvoiceDirectly: printInvoiceDirectly,
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
    exportClientsToCSV: exportClientsToCSV,
    exportProductsToCSV: exportProductsToCSV,
    printKitchenTicket: printKitchenTicket,
    saveTableOrder: saveTableOrder,
    refreshActiveTables: refreshActiveTables,
    loadTableOrder: loadTableOrder,

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
    showToast: showToast
  };
})();
