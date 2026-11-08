/**
 * Empirical Challenger 2 Test Harness for Milestone M2
 * Focus: Multi-Tenant Division Switching, Document Lifecycle, issuerSnapshot Creation, and Print Views
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const core = require('../js/billing-core.js');

function getLatestToast(env) {
  const container = env.$('toast-container');
  if (!container) return null;
  const toasts = container.querySelectorAll('.erp-toast');
  if (!toasts.length) return null;
  const last = toasts[toasts.length - 1];
  const typeMatch = last.className.match(/toast-([a-z]+)/);
  const type = typeMatch ? typeMatch[1] : 'info';
  return { msg: last.textContent.trim(), type };
}

function clearToasts(env) {
  const container = env.$('toast-container');
  if (container) container.innerHTML = '';
}

async function createBillingEnvironment(options = {}) {
  const companyCode = options.companyCode || 'CREATICOS';
  const user = options.user || {
    uid: 'challenger2-tester',
    email: 'challenger2@futunet.com.do',
    role: 'superadmin',
    displayName: 'Challenger 2 Superadmin'
  };

  const htmlPath = path.join(projectRoot, 'facturacion.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent, {
    url: 'https://futunet.test/facturacion.html',
    runScripts: 'outside-only',
    storageQuota: 10000000
  });
  const win = dom.window;

  globalThis.window = win;
  globalThis.document = win.document;

  win.scrollTo = () => {};
  win.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  win.cancelAnimationFrame = (id) => clearTimeout(id);
  win.Chart = function () {
    return { destroy: () => {}, update: () => {} };
  };
  win.URL.createObjectURL = () => 'blob:test-preview';
  win.URL.revokeObjectURL = () => {};
  if (win.HTMLElement && win.HTMLElement.prototype) {
    win.HTMLElement.prototype.scrollIntoView = () => {};
  }
  win.confirm = (msg) => (options.confirmResponse !== undefined ? options.confirmResponse : true);

  // In-Memory Mock Firestore
  const mockDatabase = new Map();
  const createMockDocRef = (collectionName, docId) => ({
    id: docId,
    get: async () => {
      const fullKey = `${collectionName}/${docId}`;
      const exists = mockDatabase.has(fullKey);
      return {
        id: docId,
        exists,
        data: () => (exists ? mockDatabase.get(fullKey) : {})
      };
    },
    set: async (data, setOptions) => {
      const fullKey = `${collectionName}/${docId}`;
      const existing = (setOptions && setOptions.merge && mockDatabase.has(fullKey))
        ? mockDatabase.get(fullKey)
        : {};
      mockDatabase.set(fullKey, Object.assign({}, existing, data));
    },
    delete: async () => {
      mockDatabase.delete(`${collectionName}/${docId}`);
    },
    update: async (data) => {
      const fullKey = `${collectionName}/${docId}`;
      const existing = mockDatabase.get(fullKey) || {};
      mockDatabase.set(fullKey, Object.assign({}, existing, data));
    }
  });

  const createMockCollectionRef = (name) => {
    const coll = {
      doc: (id) => createMockDocRef(name, id || 'doc_' + Math.random().toString(36).slice(2)),
      where: (field, op, val) => {
        return {
          ...coll,
          get: async () => {
            const prefix = `${name}/`;
            const docs = [];
            for (const [key, item] of mockDatabase.entries()) {
              if (key.startsWith(prefix)) {
                if (op === '==' && item[field] === val) {
                  docs.push({ id: key.slice(prefix.length), data: () => item, ref: createMockDocRef(name, key.slice(prefix.length)) });
                }
              }
            }
            return { docs, empty: docs.length === 0, size: docs.length, forEach: (cb) => docs.forEach(cb) };
          }
        };
      },
      orderBy: () => coll,
      limit: () => coll,
      startAfter: () => coll,
      add: async (data) => {
        const id = 'auto_' + Math.random().toString(36).slice(2);
        mockDatabase.set(`${name}/${id}`, data);
        return createMockDocRef(name, id);
      },
      get: async () => {
        const prefix = `${name}/`;
        const docs = [];
        for (const [key, val] of mockDatabase.entries()) {
          if (key.startsWith(prefix)) {
            const docId = key.slice(prefix.length);
            docs.push({ id: docId, data: () => val, ref: createMockDocRef(name, docId) });
          }
        }
        return { docs, empty: docs.length === 0, size: docs.length, forEach: (cb) => docs.forEach(cb) };
      },
      onSnapshot: (callback) => {
        callback({ docs: [] });
        return () => {};
      }
    };
    return coll;
  };

  win.FutunetFirebase = {
    db: {
      collection: (name) => createMockCollectionRef(name),
      runTransaction: async (callback) => {
        const transaction = {
          get: async (docRef) => docRef.get(),
          set: (docRef, data, opts) => docRef.set(data, opts),
          update: (docRef, data) => docRef.update(data),
          delete: (docRef) => docRef.delete()
        };
        return callback(transaction);
      }
    }
  };

  win.firebase = {
    firestore: {
      FieldValue: {
        serverTimestamp: () => new Date().toISOString()
      }
    },
    auth: () => ({
      currentUser: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        getIdToken: async () => 'test-auth-token'
      }
    })
  };

  win.ERPBillingCore = core;

  win.localStorage.setItem('active_company_code', companyCode);
  win.sessionStorage.setItem('active_company_code', companyCode);

  const draftKey = `erp_billing_draft_${companyCode}_${user.uid}`;
  if (options.localStorageData) {
    for (const [k, v] of Object.entries(options.localStorageData)) {
      win.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }

  // Pre-seed default settings
  const defaultFutunetSettings = {
    name: 'Futunet',
    ticketSlogan: 'La Tecnología del Futuro',
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
    defaultTax: 18
  };
  const defaultCreaticosSettings = {
    name: 'Creaticos Group',
    rnc: '133-73669-1',
    phone: '849-342-8525',
    email: 'holacreaticos@gmail.com',
    address: 'Las Colinas, Santiago',
    invoicePrefix: 'CRE-',
    nextInvoiceNum: 1001,
    quotePrefix: 'COT-',
    nextQuoteNum: 1001,
    proformaPrefix: 'PROF-',
    nextProformaNum: 1001,
    defaultTax: 18
  };

  mockDatabase.set('futunet_settings/general', Object.assign({}, defaultFutunetSettings, options.initialFutunetSettings || {}));
  mockDatabase.set('creaticos_settings/general', Object.assign({}, defaultCreaticosSettings, options.initialCreaticosSettings || {}));

  // Seed sample products
  mockDatabase.set('products/prod_1', { name: 'Router Empresarial Wi-Fi 6', stock: 15, price: 9500 });
  mockDatabase.set('products/prod_2', { name: 'Bobina Cable UTP Cat 6', stock: 20, price: 4200 });

  // Pre-seed open cash session if requested
  if (options.withOpenCashSession) {
    const cashColl = companyCode === 'CREATICOS' ? 'creaticos_cash_sessions' : 'futunet_cash_sessions';
    mockDatabase.set(`${cashColl}/session_active`, {
      status: 'open',
      openedByUid: user.uid,
      openedBy: user.email,
      openedAt: new Date().toISOString(),
      initialCash: 1000,
      salesCash: 0,
      salesCard: 0
    });
  }

  // Load scripts
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'facturacion.js'), 'utf8'));
  win.ERPBilling.confirmAction = async () => (options.confirmResponse !== undefined ? options.confirmResponse : true);
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'billing-workflows.js'), 'utf8'));
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'billing-events.js'), 'utf8'));

  await win.ERPBilling.init(user);
  await win.ERPBillingWorkflows.init(user);

  return {
    dom,
    win,
    $: (id) => win.document.getElementById(id),
    $$: (sel) => Array.from(win.document.querySelectorAll(sel)),
    user,
    companyCode,
    draftKey,
    mockDatabase,
    submitInvoiceForm: async () => {
      const fakeEvent = { preventDefault: () => {} };
      return win.ERPBilling.saveInvoice(fakeEvent);
    },
    close: () => {
      dom.window.close();
      globalThis.window = undefined;
      globalThis.document = undefined;
    }
  };
}

// ============================================================================
// SUITE 1: Static HTML & Cross-Tenant Division Switching
// ============================================================================

test('CHALLENGE 1.1: facturacion.html markup strictly identifies Futunet without legacy strings', () => {
  const html = fs.readFileSync(path.join(projectRoot, 'facturacion.html'), 'utf8');

  // Verify static division selector
  const divMatch = html.match(/<select id="form-invoice-division"[\s\S]*?<\/select>/);
  assert.ok(divMatch, '#form-invoice-division select element must exist in facturacion.html');
  const divSelect = divMatch[0];
  assert.match(divSelect, /value="general">Futunet<\/option>/, 'Static option must be Futunet');
  assert.doesNotMatch(divSelect, /Futunet\s+Suministros/i, 'Static option must NOT contain Futunet Suministros');
  assert.doesNotMatch(divSelect, /Creaticos/, 'Static option in facturacion.html must default to Futunet, not Creaticos');

  // Verify superadmin company selector
  const switcherMatch = html.match(/<select id="superadmin-company-select"[\s\S]*?<\/select>/);
  assert.ok(switcherMatch, '#superadmin-company-select must exist');
  const switcher = switcherMatch[0];
  assert.match(switcher, /value="FUTUNETSRL">Futunet<\/option>/, 'Switcher must display Futunet for FUTUNETSRL');
  assert.doesNotMatch(switcher, /Futunet\s+Suministros/i, 'Switcher must NOT display Futunet Suministros');
});

test('CHALLENGE 1.2: Dynamic division selector options update correctly across CREATICOS <-> FUTUNETSRL switching', async () => {
  // 1. Start with CREATICOS
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const divisionSelect = env.$('form-invoice-division');
    const divisionGroup = env.$('division-form-group');

    assert.ok(divisionSelect, '#form-invoice-division must exist in CREATICOS');
    assert.equal(divisionGroup.style.display, 'block', 'Division selector must be visible for CREATICOS');

    let options = Array.from(divisionSelect.options).map(o => ({ value: o.value, text: o.text.trim() }));
    assert.equal(options.length, 3, 'CREATICOS must expose exactly 3 divisions');
    assert.deepEqual(options, [
      { value: 'general', text: 'Creaticos Group (General)' },
      { value: 'papeleria', text: 'Creaticos Papelería y Suministros' },
      { value: 'sublimacion', text: 'Creaticos Sublimación' }
    ]);

    // 2. Switch to FUTUNETSRL
    env.win.localStorage.setItem('active_company_code', 'FUTUNETSRL');
    env.win.sessionStorage.setItem('active_company_code', 'FUTUNETSRL');
    await env.win.ERPBilling.init(Object.assign({}, env.user, { companyCode: 'FUTUNETSRL' }));

    assert.equal(divisionGroup.style.display, 'block', 'Division selector must be visible for FUTUNETSRL');
    options = Array.from(divisionSelect.options).map(o => ({ value: o.value, text: o.text.trim() }));
    assert.equal(options.length, 1, 'FUTUNETSRL must expose exactly 1 division option');
    assert.equal(options[0].value, 'general');
    assert.equal(options[0].text, 'Futunet');
    assert.doesNotMatch(options[0].text, /Futunet\s+Suministros/i);
    assert.doesNotMatch(divisionSelect.innerHTML, /Creaticos/);

    // 3. Switch back to CREATICOS
    env.win.localStorage.setItem('active_company_code', 'CREATICOS');
    env.win.sessionStorage.setItem('active_company_code', 'CREATICOS');
    await env.win.ERPBilling.init(Object.assign({}, env.user, { companyCode: 'CREATICOS' }));

    assert.equal(divisionGroup.style.display, 'block');
    options = Array.from(divisionSelect.options).map(o => ({ value: o.value, text: o.text.trim() }));
    assert.equal(options.length, 3);
    assert.equal(options[0].text, 'Creaticos Group (General)');
    assert.equal(options[1].text, 'Creaticos Papelería y Suministros');
    assert.equal(options[2].text, 'Creaticos Sublimación');

    // 4. Switch back to FUTUNETSRL again to ensure idempotency
    env.win.localStorage.setItem('active_company_code', 'FUTUNETSRL');
    env.win.sessionStorage.setItem('active_company_code', 'FUTUNETSRL');
    await env.win.ERPBilling.init(Object.assign({}, env.user, { companyCode: 'FUTUNETSRL' }));

    options = Array.from(divisionSelect.options).map(o => ({ value: o.value, text: o.text.trim() }));
    assert.equal(options.length, 1);
    assert.equal(options[0].text, 'Futunet');
  } finally {
    env.close();
  }
});

// ============================================================================
// SUITE 2: Document Lifecycle & issuerSnapshot Creation under FUTUNETSRL
// ============================================================================

test('CHALLENGE 2.1: Issuing document under FUTUNETSRL saves immutable issuerSnapshot with displayName Futunet and slogan', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-futunet', email: 'ventas@futunet.com.do', role: 'admin' }
  });

  try {
    // Fill out invoice form
    env.$('form-invoice-doc-type').value = 'invoice';
    env.$('form-invoice-client-name').value = 'Soluciones Tecnológicas del Caribe';
    env.$('form-invoice-client-rnc').value = '132-70207-7';
    env.$('form-invoice-date').value = '2026-11-07';
    env.$('form-invoice-due-date').value = '2026-11-20';
    env.$('form-invoice-ncf-type').value = 'none';

    // Clear items and add one with seeded product ID
    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow({
      productId: 'futunet_prod_1',
      description: 'Router Empresarial Wi-Fi 6',
      price: 9500,
      qty: 1,
      tax: 1710,
      discount: 0
    });

    // Save invoice
    await env.submitInvoiceForm();

    // Look for saved document in mock database
    let savedInvoice = null;
    for (const [key, val] of env.mockDatabase.entries()) {
      if (key.startsWith('futunet_invoices/')) {
        savedInvoice = val;
        break;
      }
    }

    assert.ok(savedInvoice, 'Document must be persisted into futunet_invoices');
    assert.equal(savedInvoice.companyCode, 'FUTUNETSRL');
    assert.ok(savedInvoice.issuerSnapshot, 'Document must contain immutable issuerSnapshot');

    const issuer = savedInvoice.issuerSnapshot;
    assert.equal(issuer.companyCode, 'FUTUNETSRL');
    assert.equal(issuer.displayName, 'Futunet', 'displayName must be strictly "Futunet"');
    assert.equal(issuer.legalName, 'Futunet', 'legalName must be "Futunet"');
    assert.equal(issuer.slogan, 'La Tecnología del Futuro', 'slogan must be "La Tecnología del Futuro"');
    assert.equal(issuer.rnc, '132-70207-7', 'RNC must be 132-70207-7');
    assert.equal(issuer.email, 'ventas@futunet.com.do');
    assert.equal(issuer.phone, '829-741-1041');
    assert.equal(issuer.address, 'Calle 7 Las Colinas, Santiago');
    assert.equal(issuer.instagram, 'futunetsrl');
    assert.equal(issuer.logo, 'img/futunet-logo-clean.png');

    // Strict legacy string scan
    const issuerJson = JSON.stringify(issuer);
    assert.doesNotMatch(issuerJson, /Futunet\s+Suministros/i, 'issuerSnapshot must NOT contain legacy brand "Futunet Suministros"');
  } finally {
    env.close();
  }
});

test('CHALLENGE 2.2: Issuing quote and proforma under FUTUNETSRL saves consistent issuerSnapshot', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-futunet', email: 'ventas@futunet.com.do', role: 'admin' }
  });

  try {
    for (const docType of ['quote', 'proforma']) {
      env.$('form-invoice-doc-type').value = docType;
      env.$('form-invoice-client-name').value = `Cliente Cotización ${docType}`;
      env.$('form-invoice-date').value = '2026-11-07';
      env.$('form-invoice-due-date').value = '2026-11-20';

      const tbody = env.$('invoice-form-items-body');
      tbody.innerHTML = '';
      env.win.ERPBilling.addInvoiceFormItemRow({
        productId: 'custom',
        description: `Servicio de Consultoría ${docType}`,
        price: 5000,
        qty: 2,
        tax: 0,
        discount: 0
      });

      await env.submitInvoiceForm();

      let persisted = null;
      for (const [key, val] of env.mockDatabase.entries()) {
        if (key.startsWith('futunet_invoices/') && val.docType === docType) {
          persisted = val;
        }
      }

      assert.ok(persisted, `persisted document for ${docType} must exist`);
      assert.equal(persisted.issuerSnapshot.displayName, 'Futunet');
      assert.equal(persisted.issuerSnapshot.slogan, 'La Tecnología del Futuro');
      assert.doesNotMatch(JSON.stringify(persisted.issuerSnapshot), /Futunet\s+Suministros/i);
    }
  } finally {
    env.close();
  }
});

test('CHALLENGE 2.3: Legacy settings with "Futunet Suministros" are sanitized in issuerSnapshot and loadSettings', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    initialFutunetSettings: {
      name: 'Futunet Suministros SRL',
      ticketSlogan: '',
      rnc: '131-78945-2', // legacy rnc
      invoicePrefix: 'FUT-',
      nextInvoiceNum: 2000
    }
  });

  try {
    // Check loadSettings migration
    const updatedSettings = env.mockDatabase.get('futunet_settings/general');
    assert.equal(updatedSettings.name, 'Futunet', 'Settings name must be migrated to "Futunet"');
    assert.equal(updatedSettings.ticketSlogan, 'La Tecnología del Futuro', 'Empty slogan must be migrated');
    assert.equal(updatedSettings.rnc, '132-70207-7', 'Legacy RNC must be migrated');

    // Trigger an invoice creation and inspect snapshot
    env.$('form-invoice-doc-type').value = 'invoice';
    env.$('form-invoice-client-name').value = 'Cliente Prueba Migración';
    env.$('form-invoice-date').value = '2026-11-07';
    env.$('form-invoice-due-date').value = '2026-11-20';
    env.$('form-invoice-ncf-type').value = 'none';

    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow({
      productId: 'custom',
      description: 'Servicio Mantenimiento Servidor',
      price: 8000,
      qty: 1,
      tax: 1440,
      discount: 0
    });

    await env.submitInvoiceForm();

    let saved = null;
    for (const [key, val] of env.mockDatabase.entries()) {
      if (key.startsWith('futunet_invoices/')) saved = val;
    }

    assert.ok(saved);
    assert.equal(saved.issuerSnapshot.displayName, 'Futunet');
    assert.equal(saved.issuerSnapshot.slogan, 'La Tecnología del Futuro');
    assert.doesNotMatch(JSON.stringify(saved.issuerSnapshot), /Futunet\s+Suministros/i);
  } finally {
    env.close();
  }
});

// ============================================================================
// SUITE 3: Print Views & Voucher DOM Rendering
// ============================================================================

test('CHALLENGE 3.1: viewInvoice properly renders Futunet voucher header with slogan and contact info', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    const testDoc = {
      id: 'inv_fut_101',
      invoiceNumber: 'FUT-1001',
      companyCode: 'FUTUNETSRL',
      docType: 'invoice',
      clientName: 'Industrias Gráficas del Norte',
      clientRnc: '132702077',
      date: '2026-11-07',
      dueDate: '2026-11-25',
      division: 'general',
      items: [{ description: 'Servidor Dell PowerEdge', price: 150000, qty: 1, total: 177000, tax: 27000 }],
      subtotal: 150000,
      itbis: 27000,
      total: 177000,
      issuerSnapshot: {
        companyCode: 'FUTUNETSRL',
        legalName: 'Futunet',
        displayName: 'Futunet',
        slogan: 'La Tecnología del Futuro',
        rnc: '132-70207-7',
        phone: '829-741-1041',
        email: 'ventas@futunet.com.do',
        address: 'Calle 7 Las Colinas, Santiago',
        logo: 'img/futunet-logo-clean.png'
      }
    };

    env.win.ERPBilling.viewInvoice(testDoc);

    const nameEl = env.$('view-company-name');
    const sloganEl = env.$('view-company-slogan');
    const rncEl = env.$('view-company-rnc');
    const phoneEl = env.$('view-company-phone');
    const emailEl = env.$('view-company-email');
    const addressEl = env.$('view-company-address');
    const logoEl = env.$('view-company-logo');

    assert.equal(nameEl.textContent.trim(), 'Futunet');
    assert.equal(sloganEl.textContent.trim(), 'La Tecnología del Futuro');
    assert.notEqual(sloganEl.style.display, 'none');
    assert.equal(rncEl.textContent.trim(), '132-70207-7');
    assert.equal(phoneEl.textContent.trim(), '829-741-1041');
    assert.equal(emailEl.textContent.trim(), 'ventas@futunet.com.do');
    assert.equal(addressEl.textContent.trim(), 'Calle 7 Las Colinas, Santiago');
    assert.equal(logoEl.getAttribute('src'), 'img/futunet-logo-clean.png');

    // Verify voucher print container has NO occurrences of 'Futunet Suministros'
    const printArea = env.$('invoice-print-area');
    assert.doesNotMatch(printArea.innerHTML, /Futunet\s+Suministros/i);
  } finally {
    env.close();
  }
});

test('CHALLENGE 3.2: viewInvoice sanitizes historical legacy documents containing "Futunet Suministros"', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    const legacyDoc = {
      id: 'inv_legacy_999',
      invoiceNumber: 'FUT-999',
      companyCode: 'FUTUNETSRL',
      docType: 'invoice',
      clientName: 'Cliente Antiguo SRL',
      date: '2025-01-15',
      dueDate: '2025-01-30',
      division: 'general',
      items: [{ description: 'Cable UTP 305m', price: 3500, qty: 1, total: 4130, tax: 630 }],
      issuerSnapshot: {
        companyCode: 'FUTUNETSRL',
        legalName: 'Futunet Suministros SRL',
        displayName: 'Futunet Suministros',
        slogan: '', // empty slogan in legacy snapshot
        rnc: '131-78945-2'
      }
    };

    env.win.ERPBilling.viewInvoice(legacyDoc);

    const nameEl = env.$('view-company-name');
    const sloganEl = env.$('view-company-slogan');

    assert.equal(nameEl.textContent.trim(), 'Futunet', 'viewInvoice must normalize legacy name to "Futunet"');
    assert.equal(sloganEl.textContent.trim(), 'La Tecnología del Futuro', 'viewInvoice must fall back to institutional slogan');
    assert.notEqual(sloganEl.style.display, 'none');

    const printArea = env.$('invoice-print-area');
    assert.doesNotMatch(printArea.innerHTML, /Futunet\s+Suministros/i, 'Print voucher must not display legacy brand string');
  } finally {
    env.close();
  }
});

test('CHALLENGE 3.3: cotizacion.html and public-quote.js render Futunet branding and institutional slogan without legacy text', async () => {
  const publicQuotePath = path.join(projectRoot, 'cotizacion.html');
  const quoteHtml = fs.readFileSync(publicQuotePath, 'utf8');

  const tokenHex = 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0';
  const dom = new JSDOM(quoteHtml, {
    url: `https://futunet.test/cotizacion.html?token=${tokenHex}`,
    runScripts: 'outside-only'
  });
  const win = dom.window;

  // Mock public quote database
  const quoteData = {
    invoiceNumber: 'COT-2005',
    docType: 'quote',
    companyCode: 'FUTUNETSRL',
    clientName: 'Grupo Hospitalario Metropolitano',
    validUntil: '2026-12-01',
    issuer: {
      companyCode: 'FUTUNETSRL',
      displayName: 'Futunet',
      slogan: 'La Tecnología del Futuro',
      rnc: '132-70207-7',
      phone: '829-741-1041',
      email: 'ventas@futunet.com.do',
      address: 'Calle 7 Las Colinas, Santiago'
    },
    items: [{ description: 'Sistema de Respaldo UPS 3kVA', price: 45000, qty: 1, total: 45000 }],
    subtotal: 45000,
    itbis: 0,
    total: 45000
  };

  win.FutunetFirebase = {
    db: {
      collection: (name) => ({
        doc: (id) => ({
          get: async () => ({
            exists: id === tokenHex,
            data: () => quoteData,
            ref: { update: async () => {} }
          })
        })
      })
    }
  };

  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'public-quote.js'), 'utf8'));

  // Allow async init() in public-quote.js to complete
  await new Promise(r => setTimeout(r, 50));

  assert.equal(win.document.getElementById('quote-company-name').textContent.trim(), 'Futunet');
  assert.equal(win.document.getElementById('quote-company-slogan').textContent.trim(), 'La Tecnología del Futuro');
  assert.equal(win.document.getElementById('quote-company-slogan').style.display, 'block');
  assert.match(win.document.title, /^Futunet · Cotización COT-2005/);

  dom.window.close();
});

// ============================================================================
// SUITE 4: Numerical & Client Validations (R3 Stress Tests)
// ============================================================================

test('CHALLENGE 4.1: Client email validation strictly rejects invalid email patterns and accepts valid emails', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    env.$('form-invoice-doc-type').value = 'invoice';
    env.$('form-invoice-client-name').value = 'Cliente Validaciones';
    env.$('form-invoice-date').value = '2026-11-07';
    env.$('form-invoice-due-date').value = '2026-11-20';
    env.$('form-invoice-ncf-type').value = 'none';

    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow({ productId: 'custom', description: 'Item Test', price: 100, qty: 1 });

    const invalidEmails = [
      'usuario_sin_arroba',
      'usuario@',
      '@dominio.com',
      'usuario@dominio',
      'usuario con espacios@dominio.com',
      'usuario@dominio .com'
    ];

    for (const email of invalidEmails) {
      clearToasts(env);
      env.$('form-invoice-client-email').value = email;
      await env.submitInvoiceForm();
      const toast = getLatestToast(env);
      assert.ok(toast, `Invalid email "${email}" must trigger a validation error toast`);
      assert.equal(toast.type, 'danger');
      assert.match(toast.msg, /correo electrónico válido/i);
    }

    // Valid email must pass
    clearToasts(env);
    env.$('form-invoice-client-email').value = 'contacto@empresa.com.do';
    await env.submitInvoiceForm();
    const validToast = getLatestToast(env);
    assert.ok(!validToast || validToast.type !== 'danger', 'Valid email must be accepted without danger toast');

    // Empty email must pass (optional field)
    clearToasts(env);
    env.$('form-invoice-client-email').value = '';
    await env.submitInvoiceForm();
    const emptyToast = getLatestToast(env);
    assert.ok(!emptyToast || emptyToast.type !== 'danger', 'Empty email must be allowed');
  } finally {
    env.close();
  }
});

test('CHALLENGE 4.2: Client RNC validation enforces 9 or 11 numeric digits across all document types', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    env.$('form-invoice-doc-type').value = 'quote';
    env.$('form-invoice-client-name').value = 'Cliente RNC Check';
    env.$('form-invoice-date').value = '2026-11-07';
    env.$('form-invoice-due-date').value = '2026-11-20';

    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow({ productId: 'custom', description: 'Item Cotización', price: 1000, qty: 1 });

    const invalidRncs = [
      '12345678',       // 8 digits
      '1234567890',     // 10 digits
      '123456789012',   // 12 digits
      'ABC123456',      // 6 digits cleaned
      '132-7020'        // 7 digits
    ];

    for (const rnc of invalidRncs) {
      clearToasts(env);
      env.$('form-invoice-client-rnc').value = rnc;
      await env.submitInvoiceForm();
      const toast = getLatestToast(env);
      assert.ok(toast, `Invalid RNC "${rnc}" must trigger validation error toast`);
      assert.equal(toast.type, 'danger');
      assert.match(toast.msg, /9 u 11 dígitos/i);
    }

    // Valid 9 digits (RNC)
    clearToasts(env);
    env.$('form-invoice-client-rnc').value = '132-70207-7';
    await env.submitInvoiceForm();
    const toast9 = getLatestToast(env);
    assert.ok(!toast9 || toast9.type !== 'danger', 'Valid 9-digit formatted RNC must pass');

    // Valid 11 digits (Cédula)
    clearToasts(env);
    env.$('form-invoice-client-rnc').value = '031-0123456-7';
    await env.submitInvoiceForm();
    const toast11 = getLatestToast(env);
    assert.ok(!toast11 || toast11.type !== 'danger', 'Valid 11-digit formatted Cédula must pass');

    // Empty RNC should be allowed for standard quotes / consumidor final
    clearToasts(env);
    env.$('form-invoice-client-rnc').value = '';
    await env.submitInvoiceForm();
    const toastEmpty = getLatestToast(env);
    assert.ok(!toastEmpty || toastEmpty.type !== 'danger', 'Empty RNC must be allowed for quote');
  } finally {
    env.close();
  }
});

test('CHALLENGE 4.3: Fractional quantities and step="any" allow decimal line item quantities', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow();

    const row = tbody.querySelector('tr');
    const qtyInput = row.querySelector('.row-qty');
    assert.equal(qtyInput.getAttribute('step'), 'any', 'row-qty must have step="any"');
    assert.equal(qtyInput.getAttribute('min'), '0.001', 'row-qty must have min="0.001"');

    // Test calculation with fractional qty (2.5 units at 400 = 1000)
    row.querySelector('.row-price').value = '400';
    qtyInput.value = '2.5';
    qtyInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    env.win.ERPBilling.calculateInvoiceFormTotals();

    const totalEl = env.$('form-summary-total');
    // Subtotal 1000 + 18% tax 180 = 1180
    assert.match(totalEl.textContent, /1,180|1180/);
  } finally {
    env.close();
  }
});

test('CHALLENGE 4.4: Zero quantity fix computes 0 subtotal without defaulting to 1', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow();

    const row = tbody.querySelector('tr');
    const priceInput = row.querySelector('.row-price');
    const qtyInput = row.querySelector('.row-qty');

    priceInput.value = '500';
    qtyInput.value = '0';
    qtyInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    env.win.ERPBilling.calculateInvoiceFormTotals();

    const totalEl = env.$('form-summary-total');
    assert.equal(totalEl.textContent.trim(), 'RD$ 0.00', 'Qty 0 must yield RD$ 0.00 without reverting to 1');
  } finally {
    env.close();
  }
});

test('CHALLENGE 4.5: Global discount validation rejects values outside 0-100 range and clamps live calculation', async () => {
  const env = await createBillingEnvironment({ companyCode: 'FUTUNETSRL' });

  try {
    env.$('form-invoice-doc-type').value = 'invoice';
    env.$('form-invoice-client-name').value = 'Cliente Descuento';
    env.$('form-invoice-date').value = '2026-11-07';
    env.$('form-invoice-due-date').value = '2026-11-20';
    env.$('form-invoice-ncf-type').value = 'none';

    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';
    env.win.ERPBilling.addInvoiceFormItemRow({ productId: 'custom', description: 'Item Descuento', price: 1000, qty: 1 });

    // Negative discount
    env.$('form-invoice-discount-pct').value = '-10';
    clearToasts(env);
    await env.submitInvoiceForm();
    const negToast = getLatestToast(env);
    assert.ok(negToast, 'Negative discount must be rejected');
    assert.equal(negToast.type, 'danger');
    assert.match(negToast.msg, /entre 0 y 100/i);

    // Over 100% discount
    env.$('form-invoice-discount-pct').value = '150';
    clearToasts(env);
    await env.submitInvoiceForm();
    const overToast = getLatestToast(env);
    assert.ok(overToast, 'Discount > 100% must be rejected');
    assert.equal(overToast.type, 'danger');
    assert.match(overToast.msg, /entre 0 y 100/i);
  } finally {
    env.close();
  }
});

test('CHALLENGE 4.6: POS empty cart guard halts checkoutPos cleanly', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    withOpenCashSession: true
  });

  try {
    clearToasts(env);

    // Call checkoutPos with empty cart
    await env.win.ERPBilling.checkoutPos('card');

    const toast = getLatestToast(env);
    assert.ok(toast, 'Empty POS cart must trigger warning toast');
    assert.equal(toast.type, 'warning');
    assert.match(toast.msg, /carrito está vacío/i);
  } finally {
    env.close();
  }
});
