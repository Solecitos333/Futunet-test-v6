/**
 * Challenger 2 Empirical Test Suite: Milestone M1 Iteration 2
 *
 * Direct empirical verification of:
 * 1. Strict Multi-Tenant Draft Isolation across Save, Reload, Discard, and Emit operations.
 * 2. Boundary Conditions of hasInvoiceFormUserData() & Subtab Navigation:
 *    - Whitespace-only strings
 *    - Discount edge cases (0, null, undefined, negative, fractional)
 *    - Empty vs whitespace vs filled notes
 *    - Single contact field isolation (phone, email, address, rnc, ncf)
 *    - Item row variations (search, price, cost, discount, productId, multi-row)
 * 3. Tenant alias symmetry (FUTUNET <-> FUTUNETSRL) vs tenant isolation (CREATICOS).
 * 4. Window listener deduplication.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const core = require('../js/billing-core.js');

async function createBillingEnvironment(options = {}) {
  const companyCode = options.companyCode || 'CREATICOS';
  const user = options.user !== undefined ? options.user : {
    uid: 'challenger2-user-1',
    email: 'user1@futunet.com.do',
    role: 'admin',
    displayName: 'Challenger User 1'
  };

  const htmlPath = path.join(projectRoot, 'facturacion.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent, {
    url: 'https://futunet.test/facturacion.html',
    runScripts: 'outside-only',
    storageQuota: 10000000
  });
  const win = dom.window;

  win.scrollTo = () => {};
  win.Chart = function () {
    return { destroy: () => {}, update: () => {} };
  };
  win.URL.createObjectURL = () => 'blob:test-preview';
  win.URL.revokeObjectURL = () => {};
  if (win.HTMLElement && win.HTMLElement.prototype) {
    win.HTMLElement.prototype.scrollIntoView = () => {};
  }
  win.confirm = (msg) => (options.confirmResponse !== undefined ? options.confirmResponse : true);

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
      where: () => coll,
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
            docs.push({ id: docId, data: () => val });
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
      runTransaction: async (callback) => callback({
        get: async (docRef) => docRef.get(),
        set: (docRef, data, opts) => docRef.set(data, opts),
        update: (docRef, data) => docRef.update(data),
        delete: (docRef) => docRef.delete()
      })
    }
  };

  win.firebase = {
    firestore: {
      FieldValue: {
        serverTimestamp: () => new Date().toISOString()
      }
    },
    auth: () => ({
      currentUser: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        getIdToken: async () => 'test-auth-token'
      } : null
    })
  };

  win.ERPBillingCore = core;

  // Pre-seed localStorage if passed
  if (options.localStorageData) {
    for (const [k, v] of Object.entries(options.localStorageData)) {
      win.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }

  win.localStorage.setItem('active_company_code', companyCode);
  win.sessionStorage.setItem('active_company_code', companyCode);

  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'facturacion.js'), 'utf8'));

  win.ERPBilling.confirmAction = async (msg, opts) =>
    (options.confirmResponse !== undefined ? options.confirmResponse : true);

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
    draftKey: `erp_billing_draft_${companyCode}_${user ? user.uid : 'local'}`,
    close: () => dom.window.close()
  };
}

// ============================================================================
// SUITE 1: STRICT CROSS-TENANT ISOLATION ACROSS SAVE, RELOAD, DISCARD, EMIT
// ============================================================================

test('C2-T1.1: Shared Origin Storage: FUTUNETSRL cannot read CREATICOS draft upon reload', async () => {
  const creaticosKey = 'erp_billing_draft_CREATICOS_user-creaticos-1';
  const creaticosData = {
    docType: 'invoice',
    clientName: 'Creaticos VIP Client',
    clientRnc: '101888999',
    notes: 'Información confidencial de facturación Creaticos',
    items: [{ productId: 'p1', description: 'Diseño Gráfico Identidad', price: 15000, qty: 1 }]
  };

  const sharedStorage = {
    [creaticosKey]: { data: creaticosData, savedAt: Date.now() - 3000 }
  };

  const envFutunet = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-futunet-1', email: 'seller@futunet.do', role: 'seller' },
    localStorageData: sharedStorage
  });

  try {
    const hasBanner = envFutunet.win.ERPBillingWorkflows.checkDraftBanner();
    const bannerEl = envFutunet.$('billing-draft-banner');
    const isBannerVisible = bannerEl && !bannerEl.hidden && bannerEl.style.display !== 'none';

    assert.equal(hasBanner, false, 'FUTUNETSRL must NOT detect CREATICOS draft in shared localStorage');
    assert.equal(isBannerVisible, false, 'Draft banner must remain hidden for foreign tenant');

    envFutunet.win.ERPBillingWorkflows.restoreLatestDraft();
    assert.notEqual(
      envFutunet.$('form-invoice-client-name').value,
      'Creaticos VIP Client',
      'FUTUNETSRL must never populate CREATICOS draft data'
    );
  } finally {
    envFutunet.close();
  }
});

test('C2-T1.2: Shared Origin Storage: Saving in FUTUNETSRL strictly writes to scoped key without corrupting CREATICOS', async () => {
  const creaticosKey = 'erp_billing_draft_CREATICOS_user-creaticos-1';
  const creaticosData = {
    docType: 'invoice',
    clientName: 'Creaticos Original Draft',
    items: [{ productId: 'p1', description: 'Item Creaticos', price: 500, qty: 1 }]
  };

  const sharedStorage = {
    [creaticosKey]: { data: creaticosData, savedAt: Date.now() - 60000 }
  };

  const envFutunet = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-futunet-1', email: 'seller@futunet.do', role: 'seller' },
    localStorageData: sharedStorage
  });

  try {
    // Fill in FUTUNETSRL draft data
    envFutunet.$('form-invoice-client-name').value = 'Futunet Nuevo Cliente';
    envFutunet.$('form-invoice-client-name').dispatchEvent(new envFutunet.win.Event('input', { bubbles: true }));

    // Flush draft to storage
    envFutunet.win.ERPBillingWorkflows.flushDraftNow();

    const futunetKey = 'erp_billing_draft_FUTUNETSRL_user-futunet-1';
    const futunetStored = envFutunet.win.localStorage.getItem(futunetKey);
    assert.ok(futunetStored, 'FUTUNETSRL draft must be saved under scoped key');
    const parsedFutunet = JSON.parse(futunetStored);
    assert.equal(parsedFutunet.data.clientName, 'Futunet Nuevo Cliente');

    // Verify CREATICOS draft is completely intact
    const creaticosStored = envFutunet.win.localStorage.getItem(creaticosKey);
    assert.ok(creaticosStored, 'CREATICOS draft must NOT be overwritten by FUTUNETSRL save');
    const parsedCreaticos = JSON.parse(creaticosStored);
    assert.equal(parsedCreaticos.data.clientName, 'Creaticos Original Draft');
  } finally {
    envFutunet.close();
  }
});

test('C2-T1.3: Shared Origin Storage: Discarding in FUTUNETSRL does NOT delete CREATICOS draft or third-company drafts', async () => {
  const creaticosKey = 'erp_billing_draft_CREATICOS_user-c';
  const futunetKey = 'erp_billing_draft_FUTUNETSRL_user-f';
  const otherKey = 'erp_billing_draft_OTRAEMPRESA_user-o';

  const sharedStorage = {
    [creaticosKey]: { data: { clientName: 'Empresa Creaticos' }, savedAt: Date.now() },
    [futunetKey]: { data: { clientName: 'Empresa Futunet' }, savedAt: Date.now() },
    [otherKey]: { data: { clientName: 'Tercera Empresa' }, savedAt: Date.now() }
  };

  const envFutunet = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-f', email: 'user@futunet.do', role: 'seller' },
    localStorageData: sharedStorage
  });

  try {
    await envFutunet.win.ERPBillingWorkflows.discardLatestDraft();

    // FUTUNET key must be purged
    assert.equal(envFutunet.win.localStorage.getItem(futunetKey), null, 'Active tenant draft must be cleared');

    // CREATICOS key must remain completely intact
    assert.ok(envFutunet.win.localStorage.getItem(creaticosKey) !== null, 'CREATICOS draft must NOT be deleted');

    // OTRAEMPRESA key must remain completely intact
    assert.ok(envFutunet.win.localStorage.getItem(otherKey) !== null, 'OTRAEMPRESA draft must NOT be deleted');
  } finally {
    envFutunet.close();
  }
});

test('C2-T1.4: Shared Origin Storage: Invoice Emission (saveInvoice / clearActiveDraft) does NOT purge other tenants', async () => {
  const creaticosKey = 'erp_billing_draft_CREATICOS_user-c';
  const futunetKey = 'erp_billing_draft_FUTUNETSRL_user-f';

  const sharedStorage = {
    [creaticosKey]: { data: { clientName: 'Borrador Creaticos Protegido' }, savedAt: Date.now() },
    [futunetKey]: { data: { clientName: 'Borrador Futunet a Emitir' }, savedAt: Date.now() }
  };

  const envFutunet = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-f', email: 'user@futunet.do', role: 'seller' },
    localStorageData: sharedStorage
  });

  try {
    // Open new form to populate rows
    envFutunet.win.ERPBilling.openNewInvoiceForm();

    envFutunet.$('form-invoice-client-name').value = 'Borrador Futunet a Emitir';
    envFutunet.$('form-invoice-date').value = '2026-11-07';
    const tbody = envFutunet.$('invoice-form-items-body');
    const row = tbody.querySelector('tr');
    if (row) {
      row.querySelector('.row-product-search').value = 'Servicio Redes';
      row.querySelector('.row-price').value = '1000';
      row.querySelector('.row-qty').value = '1';
    }

    // Call clearActiveDraft directly as facturacion.js does after saving
    envFutunet.win.ERPBillingWorkflows.clearActiveDraft();

    // Verify FUTUNET draft is cleared
    assert.equal(envFutunet.win.localStorage.getItem(futunetKey), null, 'Futunet draft must be cleared after emission');

    // Verify CREATICOS draft survives intact
    const creaticosVal = envFutunet.win.localStorage.getItem(creaticosKey);
    assert.ok(creaticosVal !== null, 'CREATICOS draft must survive FUTUNET invoice emission');
    assert.equal(JSON.parse(creaticosVal).data.clientName, 'Borrador Creaticos Protegido');
  } finally {
    envFutunet.close();
  }
});

test('C2-T1.5: Tenant Alias Symmetry: FUTUNET and FUTUNETSRL access the same user draft, but NEVER CREATICOS', async () => {
  const futunetKey = 'erp_billing_draft_FUTUNET_operator-1';
  const creaticosKey = 'erp_billing_draft_CREATICOS_operator-1';

  const sharedStorage = {
    [futunetKey]: {
      data: { clientName: 'Cliente Fibra Óptica', items: [{ description: 'Instalación', price: 2500 }] },
      savedAt: Date.now() - 5000
    },
    [creaticosKey]: {
      data: { clientName: 'Cliente Creaticos Papelería', items: [{ description: 'Impresión', price: 800 }] },
      savedAt: Date.now() - 5000
    }
  };

  // Log in under FUTUNETSRL alias with same user
  const envSrl = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'operator-1', email: 'op@futunet.do', role: 'seller' },
    localStorageData: sharedStorage
  });

  try {
    // Should detect the draft created under FUTUNET alias
    const detected = envSrl.win.ERPBillingWorkflows.checkDraftBanner();
    assert.equal(detected, true, 'FUTUNETSRL must detect draft created under alias FUTUNET for same user');

    // Restore draft
    envSrl.win.ERPBillingWorkflows.restoreLatestDraft();
    assert.equal(envSrl.$('form-invoice-client-name').value, 'Cliente Fibra Óptica');
    assert.notEqual(envSrl.$('form-invoice-client-name').value, 'Cliente Creaticos Papelería');

    // Clearing in FUTUNETSRL must purge the alias key
    await envSrl.win.ERPBillingWorkflows.clearLatestDraft();
    assert.equal(envSrl.win.localStorage.getItem(futunetKey), null, 'Alias draft must be cleared on discard/clear');

    // But CREATICOS must remain untouched
    assert.ok(envSrl.win.localStorage.getItem(creaticosKey) !== null, 'CREATICOS draft must not be touched by alias clear');
  } finally {
    envSrl.close();
  }
});

// ============================================================================
// SUITE 2: BOUNDARY CONDITIONS OF hasInvoiceFormUserData() & SUBTAB SWITCHES
// ============================================================================

test('C2-T2.1: hasInvoiceFormUserData() returns FALSE on fresh empty form', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const hasData = env.win.ERPBilling.hasInvoiceFormUserData();
    assert.equal(hasData, false, 'Freshly opened form must report hasInvoiceFormUserData() === false');
  } finally {
    env.close();
  }
});

test('C2-T2.2: hasInvoiceFormUserData() returns FALSE for whitespace-only fields', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.win.ERPBilling.openNewInvoiceForm();

    env.$('form-invoice-client-name').value = '   ';
    env.$('form-invoice-client-rnc').value = ' \t ';
    env.$('form-invoice-client-phone').value = '  \n  ';
    env.$('form-invoice-client-email').value = '     ';
    env.$('form-invoice-client-address').value = '  \r\n ';
    env.$('form-invoice-notes').value = '       ';
    env.$('form-invoice-ncf').value = '   ';

    const row = env.$('invoice-form-items-body').querySelector('tr');
    if (row) {
      row.querySelector('.row-product-search').value = '    ';
      row.querySelector('.row-price').value = '0';
      row.querySelector('.row-cost').value = '0';
      row.querySelector('.row-discount').value = '0';
    }

    const hasData = env.win.ERPBilling.hasInvoiceFormUserData();
    assert.equal(hasData, false, 'Whitespace-only inputs must be treated as empty (false)');

    // Subtab switch should recognize empty form and reset cleanly
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Values should be cleared/reset back to empty string
    assert.equal(env.$('form-invoice-client-name').value, '', 'Whitespace clientName should be reset');
    assert.equal(env.$('form-invoice-notes').value, '', 'Whitespace notes should be reset');
  } finally {
    env.close();
  }
});

test('C2-T2.3: Discount boundary conditions (0 vs null vs -5 vs 0.01 vs 10)', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.win.ERPBilling.openNewInvoiceForm();
    const discountEl = env.$('form-invoice-discount-pct');

    // 1. discount = "0"
    discountEl.value = '0';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), false, 'Discount = 0 must NOT count as user data');

    // 2. discount = "" (empty string / null-like)
    discountEl.value = '';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), false, 'Empty discount must NOT count as user data');

    // 3. discount = "-10" (negative)
    discountEl.value = '-10';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), false, 'Negative discount must NOT count as user data');

    // 4. discount = "0.01" (fractional positive)
    discountEl.value = '0.01';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Fractional discount 0.01 MUST count as user data');

    // 5. discount = "15" (standard discount)
    discountEl.value = '15';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Discount 15% MUST count as user data');

    // When discount > 0, subtab switch must PRESERVE the form
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');
    assert.equal(env.$('form-invoice-discount-pct').value, '15', 'Discount percentage must be preserved across subtab switch');
  } finally {
    env.close();
  }
});

test('C2-T2.4: Empty vs populated notes boundary', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.win.ERPBilling.openNewInvoiceForm();
    const notesEl = env.$('form-invoice-notes');

    // Empty notes
    notesEl.value = '';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), false, 'Empty notes -> false');

    // Whitespace notes
    notesEl.value = '   \n\t  ';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), false, 'Whitespace notes -> false');

    // Text notes
    notesEl.value = 'Condiciones: Entrega en almacén central';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Filled notes -> true');

    // Subtab switch preserves notes
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');
    assert.equal(env.$('form-invoice-notes').value, 'Condiciones: Entrega en almacén central', 'Notes must survive subtab switch');
  } finally {
    env.close();
  }
});

test('C2-T2.5: Single contact fields in isolation each prevent subtab wipeout', async () => {
  const fieldsToTest = [
    { id: 'form-invoice-client-name', val: 'Juan Pérez' },
    { id: 'form-invoice-client-rnc', val: '131888888' },
    { id: 'form-invoice-client-phone', val: '8095551234' },
    { id: 'form-invoice-client-email', val: 'juan@correo.com' },
    { id: 'form-invoice-client-address', val: 'Calle Las Damas #12' },
    { id: 'form-invoice-ncf', val: 'B0100000005' }
  ];

  for (const field of fieldsToTest) {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      env.$(field.id).value = field.val;
      assert.equal(
        env.win.ERPBilling.hasInvoiceFormUserData(),
        true,
        `Field ${field.id} entered in isolation MUST trigger hasInvoiceFormUserData() === true`
      );

      // Subtab switch
      env.win.ERPBilling.switchSubTab('invoices', 'list');
      env.win.ERPBilling.switchSubTab('invoices', 'form');

      assert.equal(
        env.$(field.id).value,
        field.val,
        `Field ${field.id} value must be preserved after switching tabs and back`
      );
    } finally {
      env.close();
    }
  }
});

test('C2-T2.6: Item row variations triggering hasInvoiceFormUserData()', async () => {
  // Case A: Row with only search description, price = 0
  {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      const row = env.$('invoice-form-items-body').querySelector('tr');
      row.querySelector('.row-product-search').value = 'Servicio Técnico';
      assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Item with description must trigger hasInvoiceFormUserData');
    } finally {
      env.close();
    }
  }

  // Case B: Row with only price > 0, no description
  {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      const row = env.$('invoice-form-items-body').querySelector('tr');
      row.querySelector('.row-price').value = '150';
      assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Item with price > 0 must trigger hasInvoiceFormUserData');
    } finally {
      env.close();
    }
  }

  // Case C: Row with only cost > 0
  {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      const row = env.$('invoice-form-items-body').querySelector('tr');
      row.querySelector('.row-cost').value = '80';
      assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Item with unit cost > 0 must trigger hasInvoiceFormUserData');
    } finally {
      env.close();
    }
  }

  // Case D: Row with only row discount > 0
  {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      const row = env.$('invoice-form-items-body').querySelector('tr');
      row.querySelector('.row-discount').value = '5';
      assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Item with row discount > 0 must trigger hasInvoiceFormUserData');
    } finally {
      env.close();
    }
  }

  // Case E: Row with selected product from catalog (productId !== 'custom')
  {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      const row = env.$('invoice-form-items-body').querySelector('tr');
      row.querySelector('.row-product-id').value = 'prod-catalog-999';
      assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Catalog productId must trigger hasInvoiceFormUserData');
    } finally {
      env.close();
    }
  }

  // Case F: Multiple rows (rows.length > 1)
  {
    const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
    try {
      env.win.ERPBilling.openNewInvoiceForm();
      env.win.ERPBilling.addInvoiceFormItemRow();
      assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true, 'Multiple rows (rows.length > 1) must trigger hasInvoiceFormUserData');

      env.win.ERPBilling.switchSubTab('invoices', 'list');
      env.win.ERPBilling.switchSubTab('invoices', 'form');
      const rows = env.$('invoice-form-items-body').querySelectorAll('tr');
      assert.equal(rows.length, 2, '2 item rows must be preserved across subtab switch');
    } finally {
      env.close();
    }
  }
});

// ============================================================================
// SUITE 3: LISTENER DEDUPLICATION & RE-INITIALIZATION
// ============================================================================

test('C2-T3.1: Calling ERPBillingWorkflows.init() multiple times does NOT accumulate redundant listeners', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    let windowBeforeunloadListeners = 0;
    let windowPagehideListeners = 0;

    const originalAddEventListener = env.win.addEventListener;
    env.win.addEventListener = function (type, listener, options) {
      if (type === 'beforeunload') windowBeforeunloadListeners++;
      if (type === 'pagehide') windowPagehideListeners++;
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Re-call init 5 times
    await env.win.ERPBillingWorkflows.init(env.user);
    await env.win.ERPBillingWorkflows.init(env.user);
    await env.win.ERPBillingWorkflows.init(env.user);
    await env.win.ERPBillingWorkflows.init(env.user);
    await env.win.ERPBillingWorkflows.init(env.user);

    assert.equal(
      windowBeforeunloadListeners,
      0,
      `beforeunload listener must NOT be attached again on re-init (attached ${windowBeforeunloadListeners} times)`
    );
    assert.equal(
      windowPagehideListeners,
      0,
      `pagehide listener must NOT be attached again on re-init (attached ${windowPagehideListeners} times)`
    );
  } finally {
    env.close();
  }
});


// ============================================================================
// SUITE 4: MULTI-TENANT CONCURRENCY STRESS & LIFECYCLE
// ============================================================================

test('C2-T1.6: Multi-Tenant & Multi-User Concurrency Matrix in Shared Storage', async () => {
  // Test matrix of 8 keys in shared origin storage:
  // 1. CREATICOS user A
  // 2. CREATICOS user B
  // 3. CREATICOS unauthenticated (local)
  // 4. FUTUNETSRL user 1
  // 5. FUTUNETSRL user 2
  // 6. FUTUNET alias user 1
  // 7. FUTUNETSRL unauthenticated (local)
  // 8. Foreign legacy draft key (erp_billing_draft_LEGACY_001)

  const keys = {
    c_userA: 'erp_billing_draft_CREATICOS_user-c-a',
    c_userB: 'erp_billing_draft_CREATICOS_user-c-b',
    c_local: 'erp_billing_draft_CREATICOS_local',
    f_user1: 'erp_billing_draft_FUTUNETSRL_user-f-1',
    f_user2: 'erp_billing_draft_FUTUNETSRL_user-f-2',
    f_alias: 'erp_billing_draft_FUTUNET_user-f-1',
    f_local: 'erp_billing_draft_FUTUNETSRL_local',
    legacy: 'erp_billing_draft_LEGACY_001'
  };

  const initialStorage = {
    [keys.c_userA]: { data: { clientName: 'Creaticos User A' }, savedAt: Date.now() },
    [keys.c_userB]: { data: { clientName: 'Creaticos User B' }, savedAt: Date.now() },
    [keys.c_local]: { data: { clientName: 'Creaticos Local' }, savedAt: Date.now() },
    [keys.f_user1]: { data: { clientName: 'Futunet User 1' }, savedAt: Date.now() },
    [keys.f_user2]: { data: { clientName: 'Futunet User 2' }, savedAt: Date.now() },
    [keys.f_alias]: { data: { clientName: 'Futunet User 1 Alias' }, savedAt: Date.now() },
    [keys.f_local]: { data: { clientName: 'Futunet Local' }, savedAt: Date.now() },
    [keys.legacy]: { data: { clientName: 'Legacy System' }, savedAt: Date.now() }
  };

  // 1. Session: FUTUNETSRL User 1 logs in
  const envF1 = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-f-1', email: 'f1@futunet.do', role: 'seller' },
    localStorageData: initialStorage
  });

  try {
    // User F1 discards draft
    await envF1.win.ERPBillingWorkflows.discardLatestDraft();

    // F1's keys should be cleared (both primary and alias)
    assert.equal(envF1.win.localStorage.getItem(keys.f_user1), null, 'F1 primary draft must be deleted');
    assert.equal(envF1.win.localStorage.getItem(keys.f_alias), null, 'F1 alias draft must be deleted');

    // EVERY other key must remain 100% intact!
    assert.ok(envF1.win.localStorage.getItem(keys.c_userA) !== null, 'CREATICOS User A draft must survive');
    assert.ok(envF1.win.localStorage.getItem(keys.c_userB) !== null, 'CREATICOS User B draft must survive');
    assert.ok(envF1.win.localStorage.getItem(keys.c_local) !== null, 'CREATICOS local draft must survive');
    assert.ok(envF1.win.localStorage.getItem(keys.f_user2) !== null, 'FUTUNETSRL User 2 draft must survive F1 discard');
    assert.ok(envF1.win.localStorage.getItem(keys.legacy) !== null, 'Legacy draft must survive');

    // 2. Session: CREATICOS User B emits invoice
    const envCB = await createBillingEnvironment({
      companyCode: 'CREATICOS',
      user: { uid: 'user-c-b', email: 'cb@creaticos.do', role: 'admin' },
      localStorageData: Object.fromEntries(
        Object.values(keys).map(k => [k, envF1.win.localStorage.getItem(k)]).filter(([_, v]) => v !== null)
      )
    });

    try {
      envCB.win.ERPBillingWorkflows.clearActiveDraft();

      // CB's key must be deleted
      assert.equal(envCB.win.localStorage.getItem(keys.c_userB), null, 'CB draft must be deleted on emit');

      // CA's key, F2's key, legacy key must survive
      assert.ok(envCB.win.localStorage.getItem(keys.c_userA) !== null, 'CREATICOS User A draft must survive CB emit');
      assert.ok(envCB.win.localStorage.getItem(keys.f_user2) !== null, 'FUTUNETSRL User 2 draft must survive CB emit');
      assert.ok(envCB.win.localStorage.getItem(keys.legacy) !== null, 'Legacy draft must survive CB emit');
    } finally {
      envCB.close();
    }
  } finally {
    envF1.close();
  }
});

test('C2-T2.7: Full Lifecycle: Type -> Subtab switch -> Preserved in DOM & Storage -> Discard -> Tab switch -> Clean reset', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.win.ERPBilling.openNewInvoiceForm();

    // 1. User types in client info
    env.$('form-invoice-client-name').value = 'Farmacia San Rafael SRL';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // 2. User switches to list
    env.win.ERPBilling.switchSubTab('invoices', 'list');

    // Storage check: must be saved via flushDraftNow
    const draftInStorage = env.win.localStorage.getItem(env.draftKey);
    assert.ok(draftInStorage, 'Form must be flushed to localStorage on subtab switch');
    assert.equal(JSON.parse(draftInStorage).data.clientName, 'Farmacia San Rafael SRL');

    // 3. User switches back to form
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // In-memory DOM check: value must still be Farmacia San Rafael SRL
    assert.equal(
      env.$('form-invoice-client-name').value,
      'Farmacia San Rafael SRL',
      'Active DOM inputs must NOT be wiped when returning to form'
    );

    // Banner check: banner should be displayed
    const banner = env.$('billing-draft-banner');
    assert.equal(!banner.hidden && banner.style.display !== 'none', true, 'Draft banner should be visible');

    // 4. User explicitly discards the draft
    await env.win.ERPBillingWorkflows.discardLatestDraft();

    // DOM should be cleared
    assert.equal(env.$('form-invoice-client-name').value, '', 'Form input should be empty after discard');

    // Storage should be cleared
    assert.equal(env.win.localStorage.getItem(env.draftKey), null, 'Draft should be removed from localStorage');

    // Banner should be hidden
    assert.equal(banner.hidden || banner.style.display === 'none', true, 'Banner must be hidden after discard');

    // 5. User switches to list and back to form again
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Since form is empty, hasInvoiceFormUserData() === false, so openNewInvoiceForm() initializes fresh form
    assert.equal(env.$('form-invoice-client-name').value, '', 'Form must stay clean');
    assert.equal(banner.hidden || banner.style.display === 'none', true, 'Banner must stay hidden');
  } finally {
    env.close();
  }
});

test('C2-T2.8: Unicode, accents, and special characters handling in hasInvoiceFormUserData()', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.win.ERPBilling.openNewInvoiceForm();

    // Accents & Latin-1: "Asociación Quisqueyana & Cía. S.A.S."
    env.$('form-invoice-client-name').value = 'Asociación Quisqueyana & Cía. S.A.S.';
    assert.equal(env.win.ERPBilling.hasInvoiceFormUserData(), true);

    // Subtab switch
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    assert.equal(
      env.$('form-invoice-client-name').value,
      'Asociación Quisqueyana & Cía. S.A.S.',
      'Accented characters must survive subtab switch'
    );
  } finally {
    env.close();
  }
});
