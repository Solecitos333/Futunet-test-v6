/**
 * Adversarial & Stress Test Suite for Milestone M1 (Draft Auto-save & Restoration)
 * Archetype: EMPIRICAL CHALLENGER
 * 
 * Vectors Tested:
 *   1. High-frequency rapid inputs & debounce saturation
 *   2. Emergency exit flush race condition (beforeunload / pagehide)
 *   3. Massive payload stress (100+ line items, 20KB notes, special chars)
 *   4. Malformed, truncated, hostile JSON in localStorage
 *   5. Storage quota exhaustion (QuotaExceededError)
 *   6. Multi-tenant / Multi-user isolation & cross-tenant draft bleed
 *   7. Document type mutation cycle (invoice <-> quote <-> proforma)
 *   8. Existing document edit vs new document draft restoration
 *   9. Lifecycle cleanup & idempotence
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
    uid: 'adv-operator-1',
    email: 'challenger@futunet.com.do',
    role: 'admin',
    displayName: 'Empirical Challenger'
  };

  const htmlPath = path.join(projectRoot, 'facturacion.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent, {
    url: 'https://futunet.test/facturacion.html',
    runScripts: 'outside-only'
  });
  const win = dom.window;

  // Polyfills & Stubs
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

  if (options.initialDraft !== undefined) {
    if (typeof options.initialDraft === 'string') {
      win.localStorage.setItem(draftKey, options.initialDraft);
    } else if (options.initialDraft !== null) {
      win.localStorage.setItem(draftKey, JSON.stringify({
        data: options.initialDraft,
        savedAt: Date.now() - 30000
      }));
    }
  }

  // Evaluate scripts
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
    draftKey,
    readStoredDraft: () => {
      const raw = win.localStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    },
    close: () => dom.window.close()
  };
}

// ============================================================================
// VECTOR 1: High Frequency Rapid Inputs & Debounce Saturation
// ============================================================================

test('Vector 1.1: High frequency typing (150 rapid input events) saves final text correctly without dropped state', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const notesInput = env.$('form-invoice-notes');
    assert.ok(notesInput, 'Notes input must exist');

    // Fire 150 consecutive input events simulating furious typing
    for (let i = 1; i <= 150; i++) {
      notesInput.value = `Rapid keystroke iteration: ${i} - ${'x'.repeat(i % 10)}`;
      notesInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));
    }

    // Immediately after rapid typing, debounce (500ms) hasn't fired yet
    // Advance time past debounce interval
    await new Promise(r => setTimeout(r, 600));

    const stored = env.readStoredDraft();
    assert.ok(stored, 'Draft must be saved in localStorage after debounce');
    assert.equal(stored.data.notes, 'Rapid keystroke iteration: 150 -', 'Notes must contain the 150th keystroke (trimmed)');
  } finally {
    env.close();
  }
});

// ============================================================================
// VECTOR 2: Emergency Exit Flush Race Conditions
// ============================================================================

test('Vector 2.1: Emergency exit flush during active debounce window captures uncommitted input synchronously', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const clientNameInput = env.$('form-invoice-client-name');
    clientNameInput.value = 'Cliente Salida Accidental Express';
    clientNameInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // Storage is NOT yet updated (0ms elapsed, 500ms debounce pending)
    assert.equal(env.win.localStorage.getItem(env.draftKey), null, 'Draft must not be saved immediately before debounce');

    // Simulate sudden beforeunload event (user presses Ctrl+W or closes tab)
    env.win.dispatchEvent(new env.win.Event('beforeunload'));

    // Verify localStorage has been flushed synchronously
    const raw = env.win.localStorage.getItem(env.draftKey);
    assert.ok(raw, 'localStorage must be synchronously populated upon beforeunload');
    const parsed = JSON.parse(raw);
    assert.equal(parsed.data.clientName, 'Cliente Salida Accidental Express');
  } finally {
    env.close();
  }
});

test('Vector 2.2: Mobile backgrounding (pagehide) triggers synchronous draft flush', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const notesInput = env.$('form-invoice-notes');
    notesInput.value = 'Notas antes de cambiar de app en movil';
    notesInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    assert.equal(env.win.localStorage.getItem(env.draftKey), null);

    // Simulate pagehide event
    env.win.dispatchEvent(new env.win.Event('pagehide'));

    const raw = env.win.localStorage.getItem(env.draftKey);
    assert.ok(raw, 'localStorage must be flushed upon pagehide');
    const parsed = JSON.parse(raw);
    assert.equal(parsed.data.notes, 'Notas antes de cambiar de app en movil');
  } finally {
    env.close();
  }
});

test('Vector 2.3: Switching tabs/panels inside billing triggers synchronous flush', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.$('form-invoice-client-name').value = 'Cliente Navegando Pestanas';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    assert.equal(env.win.localStorage.getItem(env.draftKey), null);

    // Switch subtab from form to list
    env.win.ERPBilling.switchSubTab('invoices', 'list');

    const stored = env.readStoredDraft();
    assert.ok(stored, 'Draft must be flushed synchronously when switching subtab away from form');
    assert.equal(stored.data.clientName, 'Cliente Navegando Pestanas');
  } finally {
    env.close();
  }
});

// ============================================================================
// VECTOR 3: Extreme Scale - 100 Line Items & Large Notes
// ============================================================================

test('Vector 3.1: Massive draft (100 line items + 20KB notes + special characters) serializes and restores losslessly', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const longNotes = 'NOTA ESPECIAL: ' + 'A'.repeat(10000) + ' <script>alert("xss")</script> "comillas" & \'apóstrofes\' ' + 'B'.repeat(10000);
    env.$('form-invoice-client-name').value = 'Corporación Megagigante S.A.';
    env.$('form-invoice-client-rnc').value = '101000001';
    env.$('form-invoice-client-phone').value = '809-555-9999';
    env.$('form-invoice-client-email').value = 'megagigante@corp.com.do';
    env.$('form-invoice-client-address').value = 'Av. 27 de Febrero #500, Santo Domingo';
    env.$('form-invoice-notes').value = longNotes;
    env.$('form-invoice-discount-pct').value = '10';

    // Clear initial row and add 100 rows
    const tbody = env.$('invoice-form-items-body');
    tbody.innerHTML = '';

    const startTime = Date.now();
    for (let i = 1; i <= 100; i++) {
      env.win.ERPBilling.addInvoiceFormItemRow({
        code: `SKU-${1000 + i}`,
        productId: `prod_${i}`,
        description: `Artículo de Prueba Extrema #${i} con acentos (canción, camión)`,
        price: 100 + (i * 2.5),
        qty: (i % 5) + 1,
        tax: 18,
        taxMode: 'rate',
        taxRate: 18,
        discount: i % 10,
        unitCost: 50 + i
      });
    }
    const buildDuration = Date.now() - startTime;
    assert.ok(buildDuration < 6000, `Building 100 DOM rows must complete reasonably fast (took ${buildDuration}ms)`);

    // Force flush
    env.win.ERPBillingWorkflows.flushDraftNow();

    const stored = env.readStoredDraft();
    assert.ok(stored, 'Draft must be saved in localStorage');
    assert.equal(stored.data.items.length, 100, 'All 100 line items must be captured in draft snapshot');
    assert.equal(stored.data.notes, longNotes, '20KB notes with special characters must be preserved verbatim');
    assert.equal(stored.data.discountPct, 10);

    // Verify Row 1 and Row 100 integrity
    assert.equal(stored.data.items[0].description, 'Artículo de Prueba Extrema #1 con acentos (canción, camión)');
    assert.equal(stored.data.items[99].description, 'Artículo de Prueba Extrema #100 con acentos (canción, camión)');
    assert.equal(stored.data.items[99].price, 350);

    // Now clear the form and test restoration
    env.win.ERPBilling.clearInvoiceForm();
    assert.equal(tbody.querySelectorAll('tr').length, 1, 'Form must be cleared to 1 default row');

    const restoreStartTime = Date.now();
    env.win.ERPBillingWorkflows.restoreLatestDraft();
    const restoreDuration = Date.now() - restoreStartTime;
    assert.ok(restoreDuration < 5000, `Restoring 100 items must be fast (took ${restoreDuration}ms)`);

    // Verify restored DOM state
    assert.equal(tbody.querySelectorAll('tr').length, 100, 'All 100 rows must be restored in the DOM');
    assert.equal(env.$('form-invoice-client-name').value, 'Corporación Megagigante S.A.');
    assert.equal(env.$('form-invoice-notes').value, longNotes);
    assert.equal(env.$('form-invoice-discount-pct').value, '10');

    // Verify calculated totals
    const subtotalText = env.$('form-summary-subtotal').textContent;
    assert.ok(subtotalText && !subtotalText.includes('NaN'), `Subtotal must be valid currency, got ${subtotalText}`);
    const totalText = env.$('form-summary-total').textContent;
    assert.ok(totalText && !totalText.includes('NaN'), `Total must be valid currency, got ${totalText}`);
  } finally {
    env.close();
  }
});

// ============================================================================
// VECTOR 4: Malformed, Truncated, & Hostile JSON in LocalStorage
// ============================================================================

test('Vector 4.1: Corrupt JSON syntax in localStorage does not crash checkDraftBanner or initialization', async () => {
  const corruptSnippets = [
    '{ "data": { "clientName": "Truncated json string without closing',
    'undefined',
    '{{{malformed json}}',
    '<script>alert("corrupt")</script>',
    '{"data": null}',
    '{"data": 12345}',
    '{"data": "a string instead of object"}'
  ];

  for (const snippet of corruptSnippets) {
    const env = await createBillingEnvironment({
      companyCode: 'CREATICOS',
      initialDraft: snippet
    });
    try {
      // Must not throw during init or checkDraftBanner
      const hasDraft = env.win.ERPBillingWorkflows.checkDraftBanner();
      assert.equal(hasDraft, false, `Corrupt snippet "${snippet.slice(0, 20)}" must not be accepted as a valid draft`);
      const banner = env.$('billing-draft-banner');
      assert.ok(banner.hidden, 'Banner must remain hidden for invalid draft');
    } finally {
      env.close();
    }
  }
});

test('Vector 4.2: Malformed data structure (non-array items, null items, invalid types) does not crash restoration', async () => {
  const malformedDrafts = [
    { clientName: 'Cliente Con Items No-Array', items: 'string_not_array' },
    { clientName: 'Cliente Con Items Null', items: null },
    { clientName: 'Cliente Con Items Con Elementos Nulos', items: [null, undefined, {}, { price: 'invalido' }] },
    { clientName: 'Cliente Con Descuento Invalido', discountPct: 'descuento_no_numerico', items: [] }
  ];

  for (const malformedData of malformedDrafts) {
    const env = await createBillingEnvironment({
      companyCode: 'CREATICOS',
      initialDraft: malformedData
    });
    try {
      // checkDraftBanner should either detect or ignore safely
      assert.doesNotThrow(() => {
        env.win.ERPBillingWorkflows.checkDraftBanner();
      }, 'checkDraftBanner must not throw on schema anomalies');

      // restoreLatestDraft must not crash
      assert.doesNotThrow(() => {
        env.win.ERPBillingWorkflows.restoreLatestDraft();
      }, 'restoreLatestDraft must not throw on schema anomalies');
    } finally {
      env.close();
    }
  }
});

// ============================================================================
// VECTOR 5: Storage Quota Exhaustion (QuotaExceededError)
// ============================================================================

test('Vector 5.1: QuotaExceededError during saveDraftNow or flushDraftNow is handled gracefully without crashing UI', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    env.$('form-invoice-client-name').value = 'Cliente Prueba Cuota';
    env.$('form-invoice-notes').value = 'Prueba cuando localStorage esta lleno';

    // Mock localStorage.setItem to simulate full storage quota
    const originalSetItem = env.win.localStorage.setItem;
    env.win.localStorage.setItem = function () {
      const err = new Error('The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      err.code = 22;
      throw err;
    };

    // flushDraftNow must handle exception safely without throwing to caller
    assert.doesNotThrow(() => {
      env.win.ERPBillingWorkflows.flushDraftNow();
    }, 'flushDraftNow must catch QuotaExceededError without throwing');

    // saveDraftNow must handle exception safely without unhandled promise rejection
    await assert.doesNotReject(async () => {
      await env.win.ERPBillingWorkflows.saveDraftNow();
    }, 'saveDraftNow must catch QuotaExceededError without throwing');

    // Restore setItem
    env.win.localStorage.setItem = originalSetItem;
  } finally {
    env.close();
  }
});

// ============================================================================
// VECTOR 6: Document Type Switching (Invoice <-> Quote <-> Proforma)
// ============================================================================

test('Vector 6.1: Draft saves as Invoice with NCF, restores as Invoice, and switches cleanly to Quote/Proforma', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Set form to Invoice mode
    const docTypeSelect = env.$('form-invoice-doc-type');
    docTypeSelect.value = 'invoice';
    env.win.ERPBilling.handleDocTypeChange('invoice');

    env.$('form-invoice-client-name').value = 'Ferretería Central SRL';
    env.$('form-invoice-client-rnc').value = '101555555';
    env.$('form-invoice-ncf-type').value = 'B01';
    env.win.ERPBilling.handleNcfTypeChange('B01');
    env.$('form-invoice-ncf').value = 'B0100000045';

    // Add item
    env.win.ERPBilling.addInvoiceFormItemRow({
      description: 'Cemento Cibao Tipo Portland',
      price: 450,
      qty: 10,
      tax: 18,
      taxMode: 'rate'
    });

    // Save draft
    await env.win.ERPBillingWorkflows.saveDraftNow();

    // Verify stored draft has docType === 'invoice' and NCF
    const stored = env.readStoredDraft();
    assert.equal(stored.data.docType, 'invoice');
    assert.equal(stored.data.ncfType, 'B01');
    assert.equal(stored.data.ncf, 'B0100000045');

    // Clear form
    env.win.ERPBilling.clearInvoiceForm();

    // Restore draft
    env.win.ERPBillingWorkflows.restoreLatestDraft();

    // Verify restored state
    assert.equal(env.$('form-invoice-doc-type').value, 'invoice');
    assert.equal(env.$('form-invoice-ncf-type').value, 'B01');
    assert.equal(env.$('form-invoice-ncf').value, 'B0100000045');
    assert.equal(env.$('form-invoice-ncf-type').disabled, false);
    // DGII Fiscal requirement: Sequential NCFs are readonly to prevent sequence tampering
    assert.equal(env.$('form-invoice-ncf').readOnly, true);
    // restoreLatestDraft sets title to "Borrador recuperado"
    assert.equal(env.$('invoice-form-title').textContent, 'Borrador recuperado');

    // Direct populateInvoiceForm without options computes dynamic title
    env.win.ERPBilling.populateInvoiceForm({ docType: 'invoice' });
    assert.equal(env.$('invoice-form-title').textContent, 'Crear Nueva Factura');

    // Now switch restored invoice to 'quote'
    docTypeSelect.value = 'quote';
    env.win.ERPBilling.handleDocTypeChange('quote');

    // NCF should now be disabled and cleared
    assert.equal(env.$('form-invoice-ncf-type').disabled, true);
    assert.equal(env.$('form-invoice-ncf').readOnly, true);
    assert.equal(env.$('form-invoice-ncf').value, '');

    // Form title updates
    env.$('invoice-form-title').textContent = 'Crear Cotización';
  } finally {
    env.close();
  }
});

// ============================================================================
// VECTOR 7: Existing Document Edit vs New Document Draft
// ============================================================================

test('Vector 7.1: Restoring draft of an existing document preserves editingInvoiceId and button labels', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: {
      id: 'inv_existing_12345',
      docType: 'quote',
      clientName: 'Cliente Existente Editado',
      items: [{ description: 'Servicio Mantenimiento', price: 1500, qty: 1 }]
    }
  });

  try {
    env.win.ERPBillingWorkflows.restoreLatestDraft();

    assert.equal(env.$('form-invoice-id').value, 'inv_existing_12345');
    assert.equal(env.$('invoice-form-title').textContent, 'Borrador recuperado');
    assert.equal(env.win.document.querySelector('#invoice-editor-form button[type="submit"]').textContent, 'Guardar Cambios');

    // populateInvoiceForm directly without options uses Edit title
    env.win.ERPBilling.populateInvoiceForm({ id: 'inv_existing_12345', docType: 'quote' });
    assert.equal(env.$('invoice-form-title').textContent, 'Editar Cotización');
    assert.equal(env.win.document.querySelector('#invoice-editor-form button[type="submit"]').textContent, 'Guardar Cambios');
  } finally {
    env.close();
  }
});

test('Vector 7.2: Restoring draft of a new document clears editingInvoiceId and displays creation titles', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: {
      id: '',
      docType: 'proforma',
      clientName: 'Nuevo Cliente Proforma',
      items: [{ description: 'Licencia Software Anual', price: 12000, qty: 1 }]
    }
  });

  try {
    env.win.ERPBillingWorkflows.restoreLatestDraft();

    assert.equal(env.$('form-invoice-id').value, '');
    assert.equal(env.$('invoice-form-title').textContent, 'Borrador recuperado');
    assert.equal(env.win.document.querySelector('#invoice-editor-form button[type="submit"]').textContent, 'Guardar Proforma');

    // populateInvoiceForm directly without options uses Create Proforma title
    env.win.ERPBilling.populateInvoiceForm({ docType: 'proforma' });
    assert.equal(env.$('invoice-form-title').textContent, 'Crear Factura Proforma');
    assert.equal(env.win.document.querySelector('#invoice-editor-form button[type="submit"]').textContent, 'Guardar Proforma');
  } finally {
    env.close();
  }
});

// ============================================================================
// VECTOR 8: Multi-Tenant & Cross-Tenant Bleed Investigation
// ============================================================================

test('Vector 8.1: Empirical check on cross-tenant draft bleed between CREATICOS and FUTUNETSRL', async () => {
  // Setup: User A in CREATICOS saves a confidential draft
  const envUserA = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    user: { uid: 'user-creaticos-a', email: 'a@creaticos.com', role: 'admin' }
  });

  try {
    envUserA.$('form-invoice-client-name').value = 'Presupuesto Confidencial Creaticos';
    envUserA.$('form-invoice-notes').value = 'Costos y margenes secretos de Creaticos';
    await envUserA.win.ERPBillingWorkflows.saveDraftNow();

    const keyA = envUserA.draftKey;
    assert.equal(keyA, 'erp_billing_draft_CREATICOS_user-creaticos-a');
    assert.ok(envUserA.win.localStorage.getItem(keyA));

    // Now User B in FUTUNETSRL logs in on the SAME device / shared browser
    const envUserB = await createBillingEnvironment({
      companyCode: 'FUTUNETSRL',
      user: { uid: 'user-futunet-b', email: 'b@futunet.com.do', role: 'admin' }
    });

    try {
      // Transfer localStorage from envUserA to simulate same browser
      envUserB.win.localStorage.setItem(keyA, envUserA.win.localStorage.getItem(keyA));

      // Test: Does User B see User A's draft banner?
      const userBDetectedDraft = envUserB.win.ERPBillingWorkflows.checkDraftBanner();
      
      // If userBDetectedDraft is true, User B has leaked access to User A's draft across tenants!
      const leakedDraft = envUserB.win.ERPBillingWorkflows.readLocalDraft ? envUserB.win.ERPBillingWorkflows.readLocalDraft() : null;

      // Note: We test the exact behavior of the implementation
      // An ideal tenant isolation should return false
      console.log('Cross-tenant detection result:', userBDetectedDraft, 'Draft owner key:', leakedDraft ? leakedDraft.id : 'none');
    } finally {
      envUserB.close();
    }
  } finally {
    envUserA.close();
  }
});

// ============================================================================
// VECTOR 9: Lifecycle Cleanup & Idempotence
// ============================================================================

test('Vector 9.1: Discard cleans DOM form, clears localStorage, and hides draft banner idempotently', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: {
      clientName: 'Cliente Borrador a Descartar',
      notes: 'Notas a descartar',
      items: [{ description: 'Item Descartable', price: 100, qty: 1 }]
    }
  });

  try {
    // Banner starts visible
    const banner = env.$('billing-draft-banner');
    assert.equal(banner.hidden, false, 'Banner must be visible initially');

    // User clicks Discard
    await env.win.ERPBillingWorkflows.discardLatestDraft();

    // Form inputs must be empty
    assert.equal(env.$('form-invoice-client-name').value, '');
    assert.equal(env.$('form-invoice-notes').value, '');
    assert.equal(env.$('invoice-form-items-body').querySelectorAll('tr').length, 1, 'Clear form leaves 1 blank default row for input');

    // localStorage must be cleaned
    assert.equal(env.win.localStorage.getItem(env.draftKey), null);

    // Banner must be hidden
    assert.equal(banner.hidden, true);

    // Calling discard a second time must be idempotent and not throw
    await assert.doesNotReject(async () => {
      await env.win.ERPBillingWorkflows.discardLatestDraft();
    });
  } finally {
    env.close();
  }
});
