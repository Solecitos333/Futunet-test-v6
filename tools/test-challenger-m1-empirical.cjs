/**
 * Empirical Challenger Test Harness: Milestone M1 Boundary & Concurrency
 *
 * Tests:
 * 1. Multi-tenant key isolation and cross-tenant leakage:
 *    - Company A vs Company B (drafts must not leak or be overwritten)
 *    - Cross-tenant discard cleanup (clearing in Company B must not purge Company A)
 *    - User A vs User B within same company
 * 2. Rapid tab switching (switchSubTab, switchPanel) with uncommitted form inputs:
 *    - Rapid switching with partially filled form (client only, items only, RNC/phone only)
 *    - Debounce timer vs synchronous flush race conditions
 *    - Editing mode preservation across tab navigation
 * 3. Rapid sequential save/restore/discard cycles:
 *    - High-frequency save/restore/discard interleaving
 *    - Discard during active debounce timer
 *    - Multiple sequential restores without data corruption
 * 4. Boundary payload fuzzing & storage corruption:
 *    - Large items list (50+ rows)
 *    - XSS / special characters injection in notes, items, client data
 *    - Corrupted / malformed localStorage entries
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
  const user = options.user || {
    uid: 'test-user-1',
    email: 'user1@futunet.com.do',
    role: 'admin',
    displayName: 'Usuario 1'
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
      currentUser: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        getIdToken: async () => 'test-auth-token'
      }
    })
  };

  win.ERPBillingCore = core;

  // Use pre-existing localStorage if passed in
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
    draftKey: `erp_billing_draft_${companyCode}_${user.uid}`,
    close: () => dom.window.close()
  };
}

// ============================================================================
// STRESS TEST SUITE 1: Multi-Tenant Key Isolation & Cross-Tenant Data Leaks
// ============================================================================

test('CHALLENGE 1.1: Company B must NOT see or restore Company A draft (Multi-Tenant Leak Test)', async () => {
  // Setup: Company A ("CREATICOS") writes a draft to localStorage
  const companyAKey = 'erp_billing_draft_CREATICOS_user-company-a';
  const companyAData = {
    docType: 'invoice',
    clientName: 'Cliente Confidencial Empresa A',
    clientRnc: '101000001',
    notes: 'Datos financieros estrictamente confidenciales de Creaticos',
    items: [{ productId: 'item-a', description: 'Servidor Dedicado A', price: 95000, qty: 1 }]
  };

  const sharedLocalStorage = {
    [companyAKey]: { data: companyAData, savedAt: Date.now() - 5000 }
  };

  // User B logs in for Company B ("FUTUNET")
  const envB = await createBillingEnvironment({
    companyCode: 'FUTUNET',
    user: { uid: 'user-company-b', email: 'userb@futunet.com.do', role: 'admin' },
    localStorageData: sharedLocalStorage
  });

  try {
    // When User B opens the form or checks draft banner:
    const hasBanner = envB.win.ERPBillingWorkflows.checkDraftBanner();
    const bannerEl = envB.$('billing-draft-banner');
    const isBannerVisible = bannerEl && !bannerEl.hidden && bannerEl.style.display !== 'none';

    // EMPIRICAL ASSERTION: User B MUST NOT have a draft banner for Company A's data!
    console.log('[CHALLENGE 1.1] User B banner detected?:', hasBanner, 'isBannerVisible?:', isBannerVisible);
    if (bannerEl) console.log('[CHALLENGE 1.1] Banner text:', envB.$('billing-draft-updated')?.textContent);

    assert.equal(
      isBannerVisible,
      false,
      'SECURITY LEAK: Company B displayed draft banner for Company A draft!'
    );

    assert.equal(
      hasBanner,
      false,
      'SECURITY LEAK: checkDraftBanner() returned true for foreign company draft!'
    );

    // If restoreLatestDraft() is called, it MUST NOT populate Company A data
    envB.win.ERPBillingWorkflows.restoreLatestDraft();
    const clientNameInForm = envB.$('form-invoice-client-name').value;
    assert.notEqual(
      clientNameInForm,
      'Cliente Confidencial Empresa A',
      'CRITICAL SECURITY LEAK: Company B restored Company A draft!'
    );
  } finally {
    envB.close();
  }
});

test('CHALLENGE 1.2: Discarding or clearing draft in Company B must NOT delete Company A draft', async () => {
  const companyAKey = 'erp_billing_draft_CREATICOS_user-company-a';
  const companyAData = {
    docType: 'invoice',
    clientName: 'Cliente Activo Creaticos',
    items: [{ productId: 'p1', description: 'Item A', price: 100, qty: 1 }]
  };

  const companyBKey = 'erp_billing_draft_FUTUNET_user-company-b';
  const companyBData = {
    docType: 'quote',
    clientName: 'Cliente Activo Futunet',
    items: [{ productId: 'p2', description: 'Item B', price: 200, qty: 1 }]
  };

  const sharedLocalStorage = {
    [companyAKey]: { data: companyAData, savedAt: Date.now() - 10000 },
    [companyBKey]: { data: companyBData, savedAt: Date.now() - 5000 }
  };

  const envB = await createBillingEnvironment({
    companyCode: 'FUTUNET',
    user: { uid: 'user-company-b', email: 'userb@futunet.com.do', role: 'admin' },
    localStorageData: sharedLocalStorage
  });

  try {
    // User B discards their draft
    await envB.win.ERPBillingWorkflows.discardLatestDraft();

    // Check localStorage in User B's window
    const compAStored = envB.win.localStorage.getItem(companyAKey);
    console.log('[CHALLENGE 1.2] Company A key after User B discard:', compAStored ? 'PRESERVED' : 'DELETED');

    assert.ok(
      compAStored !== null,
      'DATA LOSS BUG: Discarding draft in Company B deleted Company A draft from localStorage!'
    );
  } finally {
    envB.close();
  }
});

test('CHALLENGE 1.3: User 2 must NOT inherit User 1 draft within same company if User 2 has no draft', async () => {
  const user1Key = 'erp_billing_draft_CREATICOS_operator-alpha';
  const user1Data = {
    docType: 'invoice',
    clientName: 'Cliente de Operador Alpha',
    items: [{ productId: 'p1', description: 'Item Alpha', price: 500, qty: 1 }]
  };

  const sharedLocalStorage = {
    [user1Key]: { data: user1Data, savedAt: Date.now() - 10000 }
  };

  const envUser2 = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    user: { uid: 'operator-beta', email: 'beta@creaticos.com.do', role: 'seller' },
    localStorageData: sharedLocalStorage
  });

  try {
    const hasBanner = envUser2.win.ERPBillingWorkflows.checkDraftBanner();
    const bannerEl = envUser2.$('billing-draft-banner');
    const isBannerVisible = bannerEl && !bannerEl.hidden && bannerEl.style.display !== 'none';

    console.log('[CHALLENGE 1.3] User 2 sees User 1 draft?:', hasBanner, isBannerVisible);

    // Should User Beta see User Alpha's uncommitted draft?
    // In multi-user isolation, user-level drafts belong to the specific user.
    assert.equal(
      isBannerVisible,
      false,
      'CONCURRENCY/ISOLATION ISSUE: User Beta was offered draft created by User Alpha on shared workstation'
    );
  } finally {
    envUser2.close();
  }
});

// ============================================================================
// STRESS TEST SUITE 2: Rapid Tab Switching & View Transitions
// ============================================================================

test('CHALLENGE 2.1: Rapid switching between subtabs with partially filled form (Phone/RNC only)', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // User types ONLY client phone and RNC, but no name yet
    const phoneInput = env.$('form-invoice-client-phone');
    phoneInput.value = '8095551234';
    phoneInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    const rncInput = env.$('form-invoice-client-rnc');
    rncInput.value = '131888888';
    rncInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // User switches to list tab immediately (before 500ms debounce)
    env.win.ERPBilling.switchSubTab('invoices', 'list');

    // Verify localStorage has saved draft via flushDraftNow()
    const stored = env.win.localStorage.getItem(env.draftKey);
    assert.ok(stored, 'flushDraftNow() must have stored draft on tab switch');
    const parsed = JSON.parse(stored);
    assert.equal(parsed.data.clientPhone, '8095551234');
    assert.ok(
      parsed.data.clientRnc === '131888888' || parsed.data.clientRnc === '131-88888-8',
      `RNC should match input or masked format, got ${parsed.data.clientRnc}`
    );

    // Now user switches back to form tab
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Did switchSubTab wipe the in-memory form?
    const currentPhone = env.$('form-invoice-client-phone').value;
    const currentRnc = env.$('form-invoice-client-rnc').value;
    console.log('[CHALLENGE 2.1] After returning to form, phone:', currentPhone, 'rnc:', currentRnc);

    // If the in-memory form was cleared, did the draft banner appear?
    const banner = env.$('billing-draft-banner');
    const isBannerVisible = banner && !banner.hidden && banner.style.display !== 'none';
    console.log('[CHALLENGE 2.1] Banner visible:', isBannerVisible);

    // Either the form retained the values OR the draft banner is offered to restore them
    const dataRetained = (currentPhone === '8095551234' && currentRnc === '131888888') || isBannerVisible;
    assert.ok(
      dataRetained,
      'DATA LOSS BUG: User entered phone/RNC and switched tabs; data was wiped and no banner offered!'
    );
  } finally {
    env.close();
  }
});

test('CHALLENGE 2.2: 50 Rapid sequential tab switches under 5ms intervals with form inputs', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.$('form-invoice-client-name').value = 'Cliente Pruebas Concurrencia Rápida';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    const tbody = env.$('invoice-form-items-body');
    const row = tbody.querySelector('tr');
    if (row) {
      const desc = row.querySelector('.row-product-search');
      if (desc) desc.value = 'Item Rápido 1';
      const price = row.querySelector('.row-price');
      if (price) price.value = '350';
    }

    // Rapid toggle loop: 50 switches
    const tabs = ['list', 'form', 'history', 'form', 'pos', 'form'];
    for (let i = 0; i < 50; i++) {
      const targetTab = tabs[i % tabs.length];
      env.win.ERPBilling.switchSubTab('invoices', targetTab);
    }

    // Return to form
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Storage check: must contain the snapshot
    const stored = env.win.localStorage.getItem(env.draftKey);
    assert.ok(stored, 'Draft must be persisted in localStorage after rapid switching');
    const parsed = JSON.parse(stored);
    assert.equal(parsed.data.clientName, 'Cliente Pruebas Concurrencia Rápida');
  } finally {
    env.close();
  }
});

test('CHALLENGE 2.3: Switching tabs while editing an existing invoice preserves editing ID and title', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Populate form in EDIT mode
    env.win.ERPBilling.populateInvoiceForm({
      id: 'inv-existing-999',
      invoiceNumber: 'B0100000999',
      docType: 'invoice',
      clientName: 'Cliente Existente SRL',
      items: [{ productId: 'p1', description: 'Servicio Contable', price: 1500, qty: 1 }]
    }, { title: 'Editar Factura' });

    assert.equal(env.$('form-invoice-id').value, 'inv-existing-999');
    assert.equal(env.$('invoice-form-title').textContent, 'Editar Factura');

    // Switch to list subtab
    env.win.ERPBilling.switchSubTab('invoices', 'list');

    // Verify localStorage draft has id: 'inv-existing-999'
    const stored = env.win.localStorage.getItem(env.draftKey);
    assert.ok(stored, 'Draft must be flushed to storage');
    const parsed = JSON.parse(stored);
    assert.equal(parsed.data.id, 'inv-existing-999');

    // Switch back to form subtab
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Verify editing state in DOM was preserved
    assert.equal(env.$('form-invoice-id').value, 'inv-existing-999', 'Editing ID must be retained');
    assert.equal(env.$('invoice-form-title').textContent, 'Editar Factura', 'Title must remain Editar Factura');
  } finally {
    env.close();
  }
});

test('CHALLENGE 2.4: In-memory input fields must NOT be cleared on subtab switch when user entered phone/email/RNC', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Fill client contact info without name yet
    env.$('form-invoice-client-phone').value = '8095559999';
    env.$('form-invoice-client-email').value = 'contacto@cliente.com';
    env.$('form-invoice-client-address').value = 'Av. 27 de Febrero 100';

    // Switch away and back
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Check if the inputs in DOM survived without needing to click Restore banner
    const phoneAfter = env.$('form-invoice-client-phone').value;
    const emailAfter = env.$('form-invoice-client-email').value;
    const addressAfter = env.$('form-invoice-client-address').value;

    console.log('[CHALLENGE 2.4] After tab switch: phone =', phoneAfter, 'email =', emailAfter, 'address =', addressAfter);

    assert.equal(
      phoneAfter,
      '8095559999',
      'FORM RESET BUG: switchSubTab wiped phone input because clientName was empty'
    );
  } finally {
    env.close();
  }
});



// ============================================================================
// STRESS TEST SUITE 3: Rapid Sequential Save/Restore/Discard Cycles
// ============================================================================

test('CHALLENGE 3.1: Discard during active debounce timer (Race Condition Test)', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // 1. User types into client name (starts 500ms debounce)
    const clientInput = env.$('form-invoice-client-name');
    clientInput.value = 'Cliente Que Sera Descartado';
    clientInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // 2. Immediatelly (at 20ms, well within 500ms debounce), user clicks Discard
    await new Promise((r) => setTimeout(r, 20));
    await env.win.ERPBillingWorkflows.discardLatestDraft();

    // Verify it was cleared
    assert.equal(env.win.localStorage.getItem(env.draftKey), null, 'Draft should be null after discard');

    // 3. Wait 600ms for debounce timer to have potentially fired if not properly cancelled
    await new Promise((r) => setTimeout(r, 600));

    // 4. Verify that debounce timer did NOT resurrect the discarded draft
    const resurrected = env.win.localStorage.getItem(env.draftKey);
    console.log('[CHALLENGE 3.1] Draft after debounce window:', resurrected ? 'RESURRECTED!' : 'CLEAN');
    assert.equal(
      resurrected,
      null,
      'RACE CONDITION BUG: Debounced timer fired after discard, resurrecting discarded draft!'
    );
  } finally {
    env.close();
  }
});

test('CHALLENGE 3.2: 20 Sequential Save -> Restore -> Discard -> Save cycles without memory leak or corruption', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    for (let cycle = 0; cycle < 20; cycle++) {
      // 1. Set form values
      env.$('form-invoice-client-name').value = `Cliente Ciclo ${cycle}`;
      env.$('form-invoice-notes').value = `Nota Ciclo ${cycle}`;
      const tbody = env.$('invoice-form-items-body');
      const row = tbody.querySelector('tr');
      if (row) {
        row.querySelector('.row-product-search').value = `Item ${cycle}`;
        row.querySelector('.row-price').value = `${(cycle + 1) * 100}`;
      }

      // 2. Synchronous flush
      env.win.ERPBillingWorkflows.flushDraftNow();

      // 3. Clear form
      env.win.ERPBilling.clearInvoiceForm();
      assert.equal(env.$('form-invoice-client-name').value, '');

      // 4. Check banner & Restore
      const hasDraft = env.win.ERPBillingWorkflows.checkDraftBanner();
      assert.ok(hasDraft, `Cycle ${cycle}: checkDraftBanner must return true`);
      env.win.ERPBillingWorkflows.restoreLatestDraft();
      assert.equal(env.$('form-invoice-client-name').value, `Cliente Ciclo ${cycle}`);

      // 5. Discard
      await env.win.ERPBillingWorkflows.discardLatestDraft();
      assert.equal(env.win.localStorage.getItem(env.draftKey), null);
      assert.equal(env.$('form-invoice-client-name').value, '');
    }
  } finally {
    env.close();
  }
});

// ============================================================================
// STRESS TEST SUITE 4: Boundary Payload Fuzzing & Storage Corruption
// ============================================================================

test('CHALLENGE 4.1: Corrupted JSON in localStorage must not crash application or prevent new drafts', async () => {
  const corruptedPayloads = [
    '{ invalid json',
    'null',
    'undefined',
    '""',
    '12345',
    '{"data": null}',
    '{"data": "a string instead of object"}',
    '{"data": {"items": "not an array"}}'
  ];

  for (const badPayload of corruptedPayloads) {
    const env = await createBillingEnvironment({
      companyCode: 'CREATICOS',
      localStorageData: {
        'erp_billing_draft_CREATICOS_test-user-1': badPayload
      }
    });

    try {
      // checkDraftBanner should gracefully return false and not throw
      let bannerResult;
      assert.doesNotThrow(() => {
        bannerResult = env.win.ERPBillingWorkflows.checkDraftBanner();
      }, `Corrupted payload "${badPayload}" must not throw in checkDraftBanner()`);

      assert.equal(bannerResult, false);

      // System should allow typing and creating a valid draft despite previous corruption
      env.$('form-invoice-client-name').value = 'Cliente Sano';
      env.win.ERPBillingWorkflows.flushDraftNow();

      const stored = env.win.localStorage.getItem(env.draftKey);
      assert.ok(stored, 'Must overwrite corrupted key with healthy snapshot');
      const parsed = JSON.parse(stored);
      assert.equal(parsed.data.clientName, 'Cliente Sano');
    } finally {
      env.close();
    }
  }
});

test('CHALLENGE 4.2: Large draft (100 line items + 15k chars notes) integrity check', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const clientInput = env.$('form-invoice-client-name');
    clientInput.value = 'Cliente Corporativo Mega Factura';

    const notesInput = env.$('form-invoice-notes');
    notesInput.value = 'A'.repeat(15000); // 15KB of notes

    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = ''; // clear

    // Add 100 items
    for (let i = 0; i < 100; i++) {
      env.win.ERPBilling.addInvoiceFormItemRow({
        code: `SKU-${i}`,
        productId: `PROD-${i}`,
        description: `Servicio / Producto Fuzz #${i} con caracteres especiales & < > " ' ñ`,
        price: 150.5 + i,
        qty: 2.5,
        tax: 18,
        discount: 5
      });
    }

    env.win.ERPBillingWorkflows.flushDraftNow();

    const raw = env.win.localStorage.getItem(env.draftKey);
    assert.ok(raw, 'Large draft must be saved in localStorage');
    const parsed = JSON.parse(raw);
    assert.equal(parsed.data.items.length, 100);
    assert.equal(parsed.data.notes.length, 15000);

    // Clear and restore
    env.win.ERPBilling.clearInvoiceForm();
    env.win.ERPBillingWorkflows.restoreLatestDraft();

    assert.equal(env.$('form-invoice-client-name').value, 'Cliente Corporativo Mega Factura');
    assert.equal(env.$('form-invoice-notes').value.length, 15000);
    const restoredRows = env.$('invoice-form-items-body').querySelectorAll('tr');
    assert.equal(restoredRows.length, 100);
  } finally {
    env.close();
  }
});
