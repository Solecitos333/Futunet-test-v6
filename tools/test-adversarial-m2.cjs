/**
 * Adversarial Test Suite for Milestone M2:
 * Division Identity Rebranding ("Futunet") & Numerical / Client Validations
 *
 * Executed by Challenger 1 (empiric verification)
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const core = require('../js/billing-core.js');

/**
 * Creates an isolated JSDOM test environment simulating the billing workspace.
 */
async function createTestEnv(options = {}) {
  const companyCode = options.companyCode || 'FUTUNETSRL';
  const user = options.user || {
    uid: 'challenger-operator',
    email: 'challenger@futunet.com.do',
    role: 'admin',
    displayName: 'Adversarial Challenger'
  };

  const htmlPath = path.join(projectRoot, 'facturacion.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent, {
    url: 'https://futunet.test/facturacion.html',
    runScripts: 'outside-only'
  });
  const win = dom.window;

  // Stubs for browser APIs
  win.scrollTo = () => {};
  win.Chart = function () { return { destroy: () => {}, update: () => {} }; };
  win.URL.createObjectURL = () => 'blob:test-preview';
  win.URL.revokeObjectURL = () => {};
  if (win.HTMLElement && win.HTMLElement.prototype) {
    win.HTMLElement.prototype.scrollIntoView = () => {};
  }
  win.confirm = () => (options.confirmResponse !== undefined ? options.confirmResponse : true);

  // In-Memory Firestore Mock
  const mockDatabase = new Map();
  const recordedSaves = [];

  const createMockDocRef = (collName, docId) => ({
    id: docId,
    get: async () => {
      const key = `${collName}/${docId}`;
      const exists = mockDatabase.has(key);
      return { id: docId, exists, data: () => (exists ? mockDatabase.get(key) : {}) };
    },
    set: async (data, setOpts) => {
      const key = `${collName}/${docId}`;
      const existing = (setOpts && setOpts.merge && mockDatabase.has(key)) ? mockDatabase.get(key) : {};
      const merged = Object.assign({}, existing, data);
      mockDatabase.set(key, merged);
      recordedSaves.push({ action: 'set', collection: collName, id: docId, data: merged });
    },
    delete: async () => { mockDatabase.delete(`${collName}/${docId}`); },
    update: async (data) => {
      const key = `${collName}/${docId}`;
      const existing = mockDatabase.get(key) || {};
      const merged = Object.assign({}, existing, data);
      mockDatabase.set(key, merged);
      recordedSaves.push({ action: 'update', collection: collName, id: docId, data: merged });
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
            for (const [key, itemVal] of mockDatabase.entries()) {
              if (key.startsWith(prefix)) {
                if (op === '==' && itemVal && itemVal[field] === val) {
                  docs.push({ id: key.slice(prefix.length), data: () => itemVal });
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
        recordedSaves.push({ action: 'add', collection: name, id, data });
        return createMockDocRef(name, id);
      },
      get: async () => {
        const prefix = `${name}/`;
        const docs = [];
        for (const [key, val] of mockDatabase.entries()) {
          if (key.startsWith(prefix)) {
            docs.push({ id: key.slice(prefix.length), data: () => val });
          }
        }
        return { docs, empty: docs.length === 0, size: docs.length, forEach: (cb) => docs.forEach(cb) };
      },
      onSnapshot: (cb) => { cb({ docs: [] }); return () => {}; }
    };
    return coll;
  };

  win.FutunetFirebase = {
    db: {
      collection: (name) => createMockCollectionRef(name),
      runTransaction: async (callback) => {
        const tx = {
          get: async (docRef) => docRef.get(),
          set: (docRef, data, opts) => docRef.set(data, opts),
          update: (docRef, data) => docRef.update(data),
          delete: (docRef) => docRef.delete()
        };
        return callback(tx);
      }
    }
  };

  win.firebase = {
    firestore: {
      FieldValue: {
        serverTimestamp: () => new Date().toISOString(),
        increment: (n) => n
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

  // Pre-seed default settings doc so transactions don't fail for lack of settings
  const settingsColl = companyCode === 'CREATICOS' ? 'creaticos_settings' : 'futunet_settings';
  mockDatabase.set(`${settingsColl}/general`, Object.assign({
    name: companyCode === 'CREATICOS' ? 'Creaticos Group' : 'Futunet',
    rnc: '132-70207-7',
    defaultTax: 18,
    invoiceSequence: 1,
    b01Sequence: 1,
    b02Sequence: 1
  }, options.initialSettings || {}));

  // Load implementation scripts
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'facturacion.js'), 'utf8'));
  win.ERPBilling.confirmAction = async () => (options.confirmResponse !== undefined ? options.confirmResponse : true);

  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'billing-workflows.js'), 'utf8'));
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'billing-events.js'), 'utf8'));

  await win.ERPBilling.init(user);
  await win.ERPBillingWorkflows.init(user);

  const getToasts = () => {
    const container = win.document.getElementById('toast-container');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.erp-toast')).map(el => {
      let type = 'info';
      if (el.classList.contains('toast-danger')) type = 'danger';
      else if (el.classList.contains('toast-warning')) type = 'warning';
      else if (el.classList.contains('toast-success')) type = 'success';
      return { type, message: el.textContent.trim(), element: el };
    });
  };

  const clearToasts = () => {
    const container = win.document.getElementById('toast-container');
    if (container) container.innerHTML = '';
  };

  const lastToast = () => {
    const toasts = getToasts();
    return toasts.length ? toasts[toasts.length - 1] : null;
  };

  return {
    dom,
    win,
    $: (id) => win.document.getElementById(id),
    $$: (sel) => Array.from(win.document.querySelectorAll(sel)),
    user,
    companyCode,
    mockDatabase,
    recordedSaves,
    recordedInvoices: () => recordedSaves.filter(s => s.collection === 'futunet_invoices' || s.collection === 'creaticos_invoices'),
    getToasts,
    lastToast,
    clearToasts,
    close: () => dom.window.close()
  };
}

// Helper to fill basic valid form data
function setupValidInvoiceForm(env, overrides = {}) {
  const win = env.win;
  env.$('form-invoice-doc-type').value = overrides.docType || 'invoice';
  env.$('form-invoice-client-name').value = overrides.clientName !== undefined ? overrides.clientName : 'Cliente Prueba SRL';
  env.$('form-invoice-client-rnc').value = overrides.clientRnc !== undefined ? overrides.clientRnc : '132-70207-7';
  env.$('form-invoice-client-email').value = overrides.clientEmail !== undefined ? overrides.clientEmail : 'contacto@cliente.com';
  env.$('form-invoice-date').value = overrides.date || '2026-11-07';
  env.$('form-invoice-due-date').value = overrides.dueDate || '2026-11-20';
  env.$('form-invoice-ncf-type').value = overrides.ncfType || 'B02';
  env.$('form-invoice-ncf').value = overrides.ncf || '';

  const discountEl = env.$('form-invoice-discount-pct');
  if (discountEl) discountEl.value = overrides.discountPct !== undefined ? overrides.discountPct : '0';

  const tbody = env.$('invoice-form-items-body');
  tbody.innerHTML = '';

  const items = overrides.items || [
    { description: 'Router Gigabit AX3000', price: 3500, qty: 1, tax: 18, discount: 0 }
  ];

  items.forEach(item => {
    win.ERPBilling.addInvoiceFormItemRow();
    const rows = tbody.querySelectorAll('tr');
    const tr = rows[rows.length - 1];
    tr.querySelector('.row-product-search').value = item.description;
    tr.querySelector('.row-price').value = item.price;
    tr.querySelector('.row-qty').value = item.qty;
    const taxEl = tr.querySelector('.row-tax');
    if (taxEl) {
      taxEl.value = ((item.price * item.qty) * (item.tax / 100)).toFixed(2);
      taxEl.dataset.percent = item.tax;
    }
    const discEl = tr.querySelector('.row-discount');
    if (discEl) discEl.value = item.discount;
  });

  win.ERPBilling.calculateInvoiceTotals();
}

// ============================================================================
// 1. REBRANDING STRESS TESTS ("Futunet" vs "Futunet Suministros")
// ============================================================================

test('ADV-1.1: Division selector under FUTUNETSRL contains strictly "Futunet"', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    const divisionSelect = env.$('form-invoice-division');
    assert.ok(divisionSelect, '#form-invoice-division must exist');
    const options = Array.from(divisionSelect.options).map(o => ({ value: o.value, text: o.text.trim() }));

    assert.equal(options.length, 1, 'Futunet must have exactly 1 division option');
    assert.equal(options[0].value, 'general');
    assert.equal(options[0].text, 'Futunet');

    // Confirm complete absence of legacy text
    assert.ok(!divisionSelect.innerHTML.includes('Futunet Suministros'), 'Selector must not contain "Futunet Suministros"');
    assert.ok(!divisionSelect.innerHTML.includes('Suministros'), 'Selector must not contain "Suministros"');
  } finally {
    env.close();
  }
});

test('ADV-1.2: Settings migration sanitizes legacy "Futunet Suministros" variants', async () => {
  const legacyVariants = [
    'Futunet Suministros',
    'Futunet Suministros SRL',
    '  FUTUNET   SUMINISTROS  ',
    'futunet suministros',
    'Futunet Suministros, S.R.L.'
  ];

  for (const variant of legacyVariants) {
    const env = await createTestEnv({
      companyCode: 'FUTUNETSRL',
      initialSettings: { name: variant, rnc: '132-70207-7' }
    });
    try {
      const pageTitle = env.$('page-title');
      const sidebarName = env.$('sidebar-company-name');
      assert.equal(pageTitle ? pageTitle.textContent.trim() : 'Futunet', 'Futunet', `Page title must normalize "${variant}" to "Futunet"`);
      assert.equal(sidebarName ? sidebarName.textContent.trim() : 'Futunet', 'Futunet', `Sidebar name must normalize "${variant}" to "Futunet"`);
    } finally {
      env.close();
    }
  }
});

test('ADV-1.3: Document header and view modal normalize legacy issuer name', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    const legacyDoc = {
      id: 'doc-historic-legacy',
      docType: 'invoice',
      invoiceNumber: 'B0200000042',
      date: '2025-01-10',
      dueDate: '2025-01-20',
      clientName: 'Cliente Antiguo',
      clientRnc: '132702077',
      items: [{ description: 'Cable UTP Cat6', price: 100, qty: 5, tax: 90, total: 590 }],
      subtotal: 500,
      itbis: 90,
      total: 590,
      issuer: {
        companyCode: 'FUTUNETSRL',
        displayName: 'Futunet Suministros SRL',
        legalName: 'Futunet Suministros SRL'
      }
    };

    env.win.ERPBilling.viewInvoice(legacyDoc);

    const modalNameEl = env.$('view-company-name');
    assert.ok(modalNameEl, '#view-company-name must exist in modal');
    assert.equal(modalNameEl.textContent.trim(), 'Futunet', 'View modal company name must be strictly "Futunet"');
    assert.ok(!modalNameEl.textContent.includes('Suministros'), 'Modal company name must not contain "Suministros"');
  } finally {
    env.close();
  }
});

test('ADV-1.4: Public Quote standalone view sanitizes legacy issuer names and displays slogan', async () => {
  const quoteHtmlPath = path.join(projectRoot, 'cotizacion.html');
  const quoteHtml = fs.readFileSync(quoteHtmlPath, 'utf8');

  const testToken = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6'; // 48 chars
  const dom = new JSDOM(quoteHtml, {
    url: `https://futunet.test/cotizacion.html?token=${testToken}`,
    runScripts: 'outside-only'
  });
  const win = dom.window;

  const testQuoteDoc = {
    docType: 'quote',
    invoiceNumber: 'COT-2026-0099',
    validUntil: '2026-12-01',
    date: '2026-11-01',
    clientName: 'Empresa Test SRL',
    items: [{ description: 'Servicio Fibra Dedicada', qty: 1, price: 15000, total: 15000 }],
    subtotal: 15000,
    itbis: 2700,
    total: 17700,
    issuer: {
      companyCode: 'FUTUNETSRL',
      displayName: 'Futunet Suministros SRL',
      legalName: 'Futunet Suministros SRL',
      slogan: 'La Tecnología del Futuro'
    }
  };

  win.FutunetFirebase = {
    db: {
      collection: (name) => ({
        doc: (id) => ({
          get: async () => ({
            exists: id === testToken,
            data: () => testQuoteDoc,
            ref: { update: async () => {} }
          })
        })
      })
    }
  };

  // Run public-quote.js
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'public-quote.js'), 'utf8'));

  // Allow async init() in DOMContentLoaded to complete
  await new Promise(resolve => setTimeout(resolve, 50));

  const nameEl = win.document.getElementById('quote-company-name');
  const sloganEl = win.document.getElementById('quote-company-slogan');

  assert.ok(nameEl, '#quote-company-name must exist in cotizacion.html');
  assert.equal(nameEl.textContent.trim(), 'Futunet', 'Public quote must render "Futunet"');
  assert.equal(sloganEl.textContent.trim(), 'La Tecnología del Futuro', 'Public quote must display slogan');
  assert.ok(!win.document.title.includes('Suministros'), 'Document title must not contain Suministros');
  assert.ok(win.document.title.includes('Futunet'), 'Document title must contain Futunet');

  dom.window.close();
});

test('ADV-1.5: Multi-tenant safety: CREATICOS retains "Creaticos Group" and division options', async () => {
  const env = await createTestEnv({ companyCode: 'CREATICOS' });
  try {
    const divisionSelect = env.$('form-invoice-division');
    assert.ok(divisionSelect);
    const options = Array.from(divisionSelect.options).map(o => o.value);
    assert.ok(options.includes('general'), 'Creaticos must include general');
    assert.ok(options.includes('papeleria'), 'Creaticos must include papeleria');
    assert.ok(options.includes('sublimacion'), 'Creaticos must include sublimacion');
  } finally {
    env.close();
  }
});

// ============================================================================
// 2. ADVERSARIAL EMAIL VALIDATION
// ============================================================================

test('ADV-2.1: saveInvoice() rejects malformed emails with danger toast', async () => {
  const malformedEmails = [
    'bad@',
    '@bad.com',
    'plain',
    'user@domain',
    'user@.com',
    'spaces in@email.com',
    'double@@domain.com',
    'missing-tld@domain.'
  ];

  for (const email of malformedEmails) {
    const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
    try {
      setupValidInvoiceForm(env, { clientEmail: email });
      env.clearToasts();

      await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

      assert.equal(env.recordedInvoices().length, 0, `Malformed email "${email}" must NOT be saved to Firestore`);
      const toast = env.lastToast();
      assert.ok(toast, `Malformed email "${email}" must trigger a toast in DOM`);
      assert.equal(toast.type, 'danger');
      assert.ok(toast.message.includes('Introduce un correo electrónico válido'));
    } finally {
      env.close();
    }
  }
});

test('ADV-2.2: saveInvoice() accepts well-formed emails and empty/omitted email', async () => {
  const validEmails = [
    'cliente@futunet.com.do',
    'juan.perez+alias@gmail.com',
    'ventas-corporativas@sub.dominio.org',
    '' // Empty email is valid (optional client contact)
  ];

  for (const email of validEmails) {
    const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
    try {
      setupValidInvoiceForm(env, { clientEmail: email });
      env.clearToasts();

      await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

      assert.equal(env.recordedInvoices().length, 1, `Valid email "${email}" must be saved`);
      const savedDoc = env.recordedInvoices()[0].data;
      assert.equal(savedDoc.clientEmail, email);
    } finally {
      env.close();
    }
  }
});

// ============================================================================
// 3. ADVERSARIAL RNC VALIDATION
// ============================================================================

test('ADV-3.1: saveInvoice() rejects invalid RNC lengths and non-numeric inputs', async () => {
  const invalidRncs = [
    '12345',              // 5 digits (too short)
    '12345678',           // 8 digits (too short)
    '1234567890',         // 10 digits (neither 9 nor 11)
    '123456789012',       // 12 digits (too long)
    'ABCDEFGH',           // 8 letters (cleanClientId length 0, clientRnc length > 0)
    '12-ABC-34'           // alphanumeric
  ];

  for (const rnc of invalidRncs) {
    const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
    try {
      setupValidInvoiceForm(env, { clientRnc: rnc });
      env.clearToasts();

      await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

      assert.equal(env.recordedInvoices().length, 0, `Invalid RNC "${rnc}" must NOT be saved`);
      const toast = env.lastToast();
      assert.ok(toast, `Invalid RNC "${rnc}" must trigger a toast`);
      assert.equal(toast.type, 'danger');
      assert.ok(toast.message.includes('El RNC o cédula debe contener 9 u 11 dígitos'));
    } finally {
      env.close();
    }
  }
});

test('ADV-3.2: saveInvoice() accepts valid 9-digit RNC and 11-digit Cédula (with and without dashes)', async () => {
  const validRncs = [
    '132-70207-7',     // 9 digits formatted
    '132702077',       // 9 digits raw
    '402-1234567-8',   // 11 digits formatted
    '40212345678'      // 11 digits raw
  ];

  for (const rnc of validRncs) {
    const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
    try {
      setupValidInvoiceForm(env, { clientRnc: rnc });
      env.clearToasts();

      await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

      assert.equal(env.recordedInvoices().length, 1, `Valid RNC "${rnc}" must save successfully`);
    } finally {
      env.close();
    }
  }
});

test('ADV-3.3: Fiscal NCF B01 strictly enforces RNC existence and validity', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    setupValidInvoiceForm(env, { ncfType: 'B01', clientRnc: '' });
    env.clearToasts();

    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

    assert.equal(env.recordedInvoices().length, 0, 'B01 with empty RNC must not be saved');
    const toast = env.lastToast();
    assert.ok(toast);
    assert.equal(toast.type, 'danger');
    assert.ok(toast.message.includes('requiere un RNC o cédula válido'));
  } finally {
    env.close();
  }
});

// ============================================================================
// 4. QUANTITY AND NUMERICAL INTEGRITY STRESS TESTS
// ============================================================================

test('ADV-4.1: Fractional line item quantities (0.005, 1.5, 99.99) are accurately calculated and saved', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    setupValidInvoiceForm(env, {
      items: [
        { description: 'Cable Fibra por Metro', price: 25.50, qty: 1.5, tax: 0, discount: 0 },
        { description: 'Conector Especial', price: 1000.00, qty: 0.005, tax: 0, discount: 0 },
        { description: 'Canaleta PVC', price: 12.00, qty: 99.99, tax: 0, discount: 0 }
      ]
    });

    // Check HTML input attributes
    const qtyInputs = env.$$('.row-qty');
    assert.equal(qtyInputs.length, 3);
    for (const input of qtyInputs) {
      assert.equal(input.getAttribute('min'), '0.001', 'min attribute must allow fractional values down to 0.001');
      assert.equal(input.getAttribute('step'), 'any', 'step attribute must be "any" to allow arbitrary decimals');
    }

    // Save and verify exact numbers in saved document
    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

    assert.equal(env.recordedInvoices().length, 1);
    const saved = env.recordedInvoices()[0].data;
    assert.equal(saved.items[0].qty, 1.5);
    assert.equal(saved.items[0].price, 25.50);
    assert.equal(saved.items[0].total, 38.25); // 25.5 * 1.5

    assert.equal(saved.items[1].qty, 0.005);
    assert.equal(saved.items[1].total, 5.00); // 1000 * 0.005

    assert.equal(saved.items[2].qty, 99.99);
    assert.equal(saved.items[2].total, 1199.88); // 12 * 99.99
  } finally {
    env.close();
  }
});

test('ADV-4.2: Zero quantity typing does NOT snap back to 1 and is blocked on save', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    setupValidInvoiceForm(env);
    const tr = env.$('invoice-form-items-body').querySelector('tr');
    const qtyInput = tr.querySelector('.row-qty');
    const priceInput = tr.querySelector('.row-price');

    priceInput.value = '500';
    qtyInput.value = '0'; // User enters 0

    // Trigger handleRowPriceQtyChange
    env.win.ERPBilling.handleRowPriceQtyChange(qtyInput);

    // Assert qty does NOT snap back to 1 in memory/DOM
    assert.equal(qtyInput.value, '0', 'Zero quantity should remain 0 while user is typing');

    // Attempting to submit form with zero quantity must be blocked
    env.clearToasts();
    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

    assert.equal(env.recordedInvoices().length, 0, 'Form with qty 0 must NOT be saved');
    const toast = env.lastToast();
    assert.ok(toast);
    assert.equal(toast.type, 'danger');
    assert.ok(toast.message.includes('Revisa precio, cantidad, ITBIS y descuento'));
  } finally {
    env.close();
  }
});

test('ADV-4.3: Negative prices and negative quantities are blocked', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    setupValidInvoiceForm(env, {
      items: [{ description: 'Producto Negativo', price: -500, qty: 1, tax: 0, discount: 0 }]
    });

    env.clearToasts();
    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

    assert.equal(env.recordedInvoices().length, 0, 'Negative price must be blocked');
    assert.equal(env.lastToast().type, 'danger');

    // Test negative quantity
    setupValidInvoiceForm(env, {
      items: [{ description: 'Cantidad Negativa', price: 100, qty: -5, tax: 0, discount: 0 }]
    });

    env.clearToasts();
    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

    assert.equal(env.recordedInvoices().length, 0, 'Negative quantity must be blocked');
    assert.equal(env.lastToast().type, 'danger');
  } finally {
    env.close();
  }
});

// ============================================================================
// 5. DISCOUNT BOUNDARY AND LIMIT STRESS TESTS
// ============================================================================

test('ADV-5.1: Line-item discount is clamped between 0 and 100 in live calculation', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    setupValidInvoiceForm(env);
    const tr = env.$('invoice-form-items-body').querySelector('tr');
    const priceInput = tr.querySelector('.row-price');
    const qtyInput = tr.querySelector('.row-qty');
    const discountInput = tr.querySelector('.row-discount');

    priceInput.value = '1000';
    qtyInput.value = '1';

    // Test negative discount input (-15%)
    discountInput.value = '-15';
    env.win.ERPBilling.handleRowPriceQtyChange(discountInput);
    env.win.ERPBilling.calculateInvoiceTotals();

    const subtotalEl = env.$('form-summary-subtotal');
    const totalEl = env.$('form-summary-total');
    assert.ok(subtotalEl, '#form-summary-subtotal must exist');
    assert.ok(totalEl, '#form-summary-total must exist');

    // Subtotal must remain 1000, not increased by negative discount
    assert.ok(subtotalEl.textContent.includes('1,000') || subtotalEl.textContent.includes('1000'));

    // Test discount > 100% (150%)
    discountInput.value = '150';
    env.win.ERPBilling.handleRowPriceQtyChange(discountInput);
    env.win.ERPBilling.calculateInvoiceTotals();
    // Net total cannot be negative
    assert.ok(!totalEl.textContent.includes('-'), 'Total must not become negative under 150% discount');
  } finally {
    env.close();
  }
});

test('ADV-5.2: Global discount bounds (-5, 150) and non-numeric inputs are strictly validated on save', async () => {
  const invalidGlobalDiscounts = ['-5', '-0.01', '100.01', '150'];

  for (const discount of invalidGlobalDiscounts) {
    const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
    try {
      setupValidInvoiceForm(env, { discountPct: discount });
      env.clearToasts();

      await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));

      assert.equal(env.recordedInvoices().length, 0, `Global discount "${discount}" must NOT be saved`);
      const toast = env.lastToast();
      assert.ok(toast);
      assert.equal(toast.type, 'danger');
      assert.ok(toast.message.includes('El porcentaje de descuento global debe estar entre 0 y 100'));
    } finally {
      env.close();
    }
  }

  // Non-numeric string via text input (bypassing native HTML5 number sanitization)
  const envText = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    setupValidInvoiceForm(envText);
    const discountEl = envText.$('form-invoice-discount-pct');
    discountEl.setAttribute('type', 'text');
    discountEl.value = 'descuento_invalido';
    envText.clearToasts();

    await envText.win.ERPBilling.saveInvoice(new envText.win.Event('submit'));

    assert.equal(envText.recordedInvoices().length, 0, 'Non-numeric discount text must NOT be saved');
    const toast = envText.lastToast();
    assert.ok(toast);
    assert.equal(toast.type, 'danger');
    assert.ok(toast.message.includes('El porcentaje de descuento global debe estar entre 0 y 100'));
  } finally {
    envText.close();
  }
});

test('ADV-5.3: Global discount 0% is accepted; 100% discount resulting in total 0 is blocked', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    // 0% discount must save normally
    setupValidInvoiceForm(env, { discountPct: '0' });
    env.clearToasts();
    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));
    assert.equal(env.recordedInvoices().length, 1, '0% global discount must save');

    // 100% discount yields grandTotal 0, which cannot be issued as a valid fiscal invoice
    setupValidInvoiceForm(env, { discountPct: '100' });
    env.clearToasts();
    await env.win.ERPBilling.saveInvoice(new env.win.Event('submit'));
    assert.equal(env.recordedInvoices().length, 1, '100% discount resulting in total 0 must not produce a second save');
    assert.equal(env.lastToast().type, 'danger');
    assert.ok(env.lastToast().message.includes('El total del documento debe ser mayor que cero'));
  } finally {
    env.close();
  }
});

// ============================================================================
// 6. POS EMPTY CART AND BOUNDARY GUARDS
// ============================================================================

test('ADV-6.1: processPosSale via confirmPosCashPayment blocks empty cart with warning toast', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    // Ensure POS cart is cleared
    env.win.ERPBilling.clearPosCart();
    env.clearToasts();

    // Call confirmPosCashPayment with empty cart
    await env.win.ERPBilling.confirmPosCashPayment(new env.win.Event('submit'));

    assert.equal(env.recordedInvoices().length, 0, 'Empty POS cart must not save');
    const toast = env.lastToast();
    assert.ok(toast);
    assert.equal(toast.type, 'warning');
    assert.ok(toast.message.includes('El carrito está vacío'));
  } finally {
    env.close();
  }
});

test('ADV-6.2: checkoutPos() blocks invocation if cart is empty before opening payment modals', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    // Pre-seed active cash session in DB
    env.mockDatabase.set('futunet_cash_sessions/active-sess-1', {
      openedByUid: env.user.uid,
      status: 'open',
      initialCash: 1000
    });
    await env.win.ERPBilling.checkActiveCashSession();

    env.win.ERPBilling.clearPosCart();
    env.clearToasts();

    await env.win.ERPBilling.checkoutPos('cash');

    const toast = env.lastToast();
    assert.ok(toast);
    assert.equal(toast.type, 'warning');
    assert.ok(toast.message.includes('El carrito está vacío'));
  } finally {
    env.close();
  }
});

test('ADV-6.3: addPosCartItem rejects invalid prices and taxes', async () => {
  const env = await createTestEnv({ companyCode: 'FUTUNETSRL' });
  try {
    env.mockDatabase.set('futunet_cash_sessions/active-sess-1', {
      openedByUid: env.user.uid,
      status: 'open',
      initialCash: 1000
    });
    await env.win.ERPBilling.checkActiveCashSession();

    env.clearToasts();
    // Negative price
    env.win.ERPBilling.addPosCartItem({ id: 'p-bad-1', name: 'Malo 1', price: -50, tax: 18 });
    assert.equal(env.lastToast().type, 'danger');
    assert.ok(env.lastToast().message.includes('precio o impuesto inválido'));

    // Non-finite price
    env.clearToasts();
    env.win.ERPBilling.addPosCartItem({ id: 'p-bad-2', name: 'Malo 2', price: 'invalid', tax: 18 });
    assert.equal(env.lastToast().type, 'danger');
    assert.ok(env.lastToast().message.includes('precio o impuesto inválido'));

    // Excessive tax rate
    env.clearToasts();
    env.win.ERPBilling.addPosCartItem({ id: 'p-bad-3', name: 'Malo 3', price: 100, tax: 150 });
    assert.equal(env.lastToast().type, 'danger');
    assert.ok(env.lastToast().message.includes('precio o impuesto inválido'));
  } finally {
    env.close();
  }
});
