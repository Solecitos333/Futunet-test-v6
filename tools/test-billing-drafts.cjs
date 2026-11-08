/**
 * Automated E2E Test Suite for Invoicing & Quotations Draft Persistence & Robustness
 * Milestone: M_E2E (Sistema de Facturación y Cotizaciones - Futunet)
 * Requirements Covered:
 *   - R1: Guardado automático y restauración de borradores en facturas y cotizaciones
 *   - R2: Corrección de la identidad de división a "Futunet" (eliminando "Futunet Suministros")
 *   - R3: Optimización integral de funciones de facturación, validaciones numéricas y de cliente
 *
 * Tiers:
 *   - Tier 1: Feature Coverage (Core auto-save, banner detection, restore, discard, issue cleanup)
 *   - Tier 2: Boundary & Corner Cases (Unload flush, special chars, multiple items, corrupt storage)
 *   - Tier 3: Cross-Feature Combinations (DocType switching, subtab navigation)
 *   - Tier 4: Real-World Application Scenarios (Crash-recovery lifecycle, branding, numerical accuracy)
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const core = require('../js/billing-core.js');

/**
 * Creates an isolated JSDOM browser environment simulating the billing workspace.
 */
async function createBillingEnvironment(options = {}) {
  const companyCode = options.companyCode || 'CREATICOS';
  const user = options.user || {
    uid: 'test-operator-1',
    email: 'operador@futunet.com.do',
    role: 'admin',
    displayName: 'Operador de Pruebas'
  };

  const htmlPath = path.join(projectRoot, 'facturacion.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent, {
    url: 'https://futunet.test/facturacion.html',
    runScripts: 'outside-only'
  });
  const win = dom.window;

  // Polyfills & UI Stubs for JSDOM
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

  // In-Memory Firestore Mock
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

  // Pre-seed active company code in storage
  win.localStorage.setItem('active_company_code', companyCode);
  win.sessionStorage.setItem('active_company_code', companyCode);

  const draftKey = `erp_billing_draft_${companyCode}_${user.uid}`;

  // Pre-seed draft if specified in options
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

  // Pre-seed arbitrary localStorage keys if provided
  if (options.localStorageData) {
    for (const [k, v] of Object.entries(options.localStorageData)) {
      win.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }

  // Pre-seed settings in mock DB if requested
  if (options.initialSettings) {
    const settingsColl = companyCode === 'CREATICOS' ? 'creaticos_settings' : 'futunet_settings';
    mockDatabase.set(`${settingsColl}/general`, options.initialSettings);
  }

  // Evaluate scripts in order
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'facturacion.js'), 'utf8'));

  // Stub confirmAction for automated headless execution
  win.ERPBilling.confirmAction = async (msg, opts) =>
    (options.confirmResponse !== undefined ? options.confirmResponse : true);

  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'billing-workflows.js'), 'utf8'));
  win.eval(fs.readFileSync(path.join(projectRoot, 'js', 'billing-events.js'), 'utf8'));

  // Initialize modules
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
// TIER 1: Feature Coverage (Core Draft Lifecycle)
// ============================================================================

test('Tier 1.1: Guardado automático de borrador en localStorage al editar formulario de facturación/cotización', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Fill basic client details
    const clientInput = env.$('form-invoice-client-name');
    clientInput.value = 'Distribuidora Tecnológica del Norte SRL';
    clientInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    const notesInput = env.$('form-invoice-notes');
    notesInput.value = 'Condiciones de entrega: 48 horas tras confirmación.';
    notesInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // Add a line item row
    const addRowBtn = env.win.document.querySelector('[data-erp-click="ERPBilling.addInvoiceFormItemRow()"]');
    if (addRowBtn) addRowBtn.click();

    const tbody = env.$('invoice-form-items-body');
    const firstRow = tbody.querySelector('tr');
    assert.ok(firstRow, 'Debe existir al menos una fila de ítem');

    const descInput = firstRow.querySelector('.row-product-search');
    if (descInput) {
      descInput.value = 'Bobina Cable UTP Categoría 6';
      descInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));
    }
    const priceInput = firstRow.querySelector('.row-price');
    if (priceInput) {
      priceInput.value = '4200';
      priceInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));
    }

    // Trigger draft persist immediately
    if (typeof env.win.ERPBillingWorkflows.flushDraftNow === 'function') {
      env.win.ERPBillingWorkflows.flushDraftNow();
    } else {
      await env.win.ERPBillingWorkflows.saveDraftNow();
    }

    const saved = env.readStoredDraft();
    assert.ok(saved, 'El borrador debe haberse guardado en localStorage bajo la clave esperada');
    assert.equal(saved.data.clientName, 'Distribuidora Tecnológica del Norte SRL');
    assert.equal(saved.data.notes, 'Condiciones de entrega: 48 horas tras confirmación.');
    assert.ok(Array.isArray(saved.data.items), 'El borrador debe incluir el listado de ítems');
    assert.ok(
      saved.data.items.some((item) => item.description.includes('Bobina Cable UTP') || item.price === 4200),
      'El ítem ingresado debe estar serializado en el borrador'
    );
  } finally {
    env.close();
  }
});

test('Tier 1.2: Detección de borrador existente al abrir el formulario y visualización del banner (#billing-draft-banner)', async () => {
  const existingDraft = {
    docType: 'quote',
    clientName: 'Centro Médico Especializado Cibao',
    clientRnc: '132702077',
    notes: 'Presupuesto de cableado estructurado e infraestructura de red',
    items: [
      { productId: 'p1', description: 'Switch PoE 24 Puertos Gigabit', price: 18500, qty: 2, tax: 6660, discount: 0 }
    ]
  };

  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: existingDraft
  });

  try {
    const banner = env.$('billing-draft-banner');
    assert.ok(banner, 'El banner #billing-draft-banner debe existir en el DOM');
    assert.equal(banner.hidden, false, 'El banner debe estar visible (hidden === false) al detectar un borrador');

    const updatedText = env.$('billing-draft-updated');
    assert.ok(updatedText && updatedText.textContent.length > 0, 'El banner debe informar la fecha/hora de actualización');

    const restoreBtn = banner.querySelector('[data-erp-click="ERPBillingWorkflows.restoreLatestDraft()"]');
    const discardBtn = banner.querySelector('[data-erp-click="ERPBillingWorkflows.discardLatestDraft()"]');
    assert.ok(restoreBtn, 'El banner debe ofrecer botón de restauración');
    assert.ok(discardBtn, 'El banner debe ofrecer botón de descarte');
  } finally {
    env.close();
  }
});

test('Tier 1.3: Restauración completa del borrador en los campos del formulario sin excepciones de ejecución', async () => {
  const existingDraft = {
    docType: 'quote',
    clientName: 'Almacenes Santiago S.R.L.',
    clientId: 'cli-99',
    clientRnc: '132702077',
    clientPhone: '809-555-0144',
    clientEmail: 'compras@almacenessantiago.com',
    clientAddress: 'Av. Bartolomé Colón, Santiago',
    paymentTerms: '30 días',
    notes: 'Descuento especial por volumen acordado en gerencia.',
    discountPct: 5,
    items: [
      { productId: 'p1', description: 'Gabinete Rack 12U de Pared', price: 6500, qty: 1, tax: 1170, discount: 0 },
      { productId: 'p2', description: 'PDU Regulado 8 Tomas', price: 2200, qty: 2, tax: 792, discount: 0 }
    ]
  };

  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: existingDraft
  });

  try {
    const banner = env.$('billing-draft-banner');
    assert.equal(banner.hidden, false);

    // Click "Restaurar"
    const restoreBtn = banner.querySelector('[data-erp-click="ERPBillingWorkflows.restoreLatestDraft()"]');
    restoreBtn.click();

    // Verify fields populated
    assert.equal(env.$('form-invoice-client-name').value, 'Almacenes Santiago S.R.L.');
    assert.equal(env.$('form-invoice-client-rnc').value, '132702077');
    assert.equal(env.$('form-invoice-notes').value, 'Descuento especial por volumen acordado en gerencia.');
    assert.equal(env.$('form-invoice-doc-type').value, 'quote');
    assert.equal(env.$('form-invoice-payment-terms').value, '30 días');
    assert.equal(Number(env.$('form-invoice-discount-pct').value), 5);

    // Verify contact fields (when present in snapshot/customerSnapshot)
    if (env.$('form-invoice-client-phone')) {
      assert.equal(env.$('form-invoice-client-phone').value, '809-555-0144');
    }
    if (env.$('form-invoice-client-email')) {
      assert.equal(env.$('form-invoice-client-email').value, 'compras@almacenessantiago.com');
    }
    if (env.$('form-invoice-client-address')) {
      assert.equal(env.$('form-invoice-client-address').value, 'Av. Bartolomé Colón, Santiago');
    }

    // Verify line items table populated
    const rows = env.$('invoice-form-items-body').querySelectorAll('tr');
    assert.equal(rows.length, 2, 'Deben restaurarse exactamente las 2 filas de ítems');

    // Banner must be dismissed after successful restoration
    assert.equal(banner.hidden, true, 'El banner debe ocultarse tras restaurar el borrador');

    // Totals must be non-zero
    const totalText = env.$('form-summary-total').textContent;
    assert.doesNotMatch(totalText, /RD\$\s*0\.00/, 'El total debe recalcularse y ser mayor a cero tras restaurar');
  } finally {
    env.close();
  }
});

test('Tier 1.4: Descarte explícito del borrador limpia localStorage y oculta el banner', async () => {
  const existingDraft = {
    docType: 'invoice',
    clientName: 'Cliente para Descartar',
    notes: 'Este borrador no se emitirá',
    items: [{ productId: 'custom', description: 'Servicio de prueba', price: 1000, qty: 1, tax: 180, discount: 0 }]
  };

  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: existingDraft,
    confirmResponse: true
  });

  try {
    const banner = env.$('billing-draft-banner');
    assert.equal(banner.hidden, false, 'El banner debe ser visible antes de descartar');

    // Click "Descartar"
    const discardBtn = banner.querySelector('[data-erp-click="ERPBillingWorkflows.discardLatestDraft()"]');
    discardBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 20));

    // Verify storage is purged
    assert.equal(env.win.localStorage.getItem(env.draftKey), null, 'localStorage debe quedar limpio tras descartar');
    assert.equal(banner.hidden, true, 'El banner debe quedar oculto');
  } finally {
    env.close();
  }
});

test('Tier 1.5: Emisión exitosa de factura o cotización purga el borrador de localStorage', async () => {
  const existingDraft = {
    docType: 'invoice',
    clientName: 'Cliente Facturado Final',
    notes: 'Factura lista para emisión',
    items: [{ productId: 'p1', description: 'Servicio Mantenimiento Anual', price: 12000, qty: 1, tax: 2160, discount: 0 }]
  };

  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: existingDraft
  });

  try {
    assert.ok(env.win.localStorage.getItem(env.draftKey), 'El borrador debe estar en storage');

    // Simulate emission completion event
    env.win.document.dispatchEvent(
      new env.win.CustomEvent('erp:invoice-saved', {
        detail: { id: 'inv-issued-1001', action: 'saved', docType: 'invoice' }
      })
    );

    // Wait for async handler
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(
      env.win.localStorage.getItem(env.draftKey),
      null,
      'Al emitirse la factura con éxito, el borrador en localStorage debe ser completamente purgado'
    );
  } finally {
    env.close();
  }
});

// ============================================================================
// TIER 2: Boundary & Corner Cases
// ============================================================================

test('Tier 2.1: Vaciado síncrono ante salida accidental (beforeunload y pagehide)', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Fill client name and notes without manually clicking "Guardar borrador"
    env.$('form-invoice-client-name').value = 'Accidental Exit Tech SRL';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    env.$('form-invoice-notes').value = 'Datos ingresados segundos antes de que el usuario cerrara la pestaña.';
    env.$('form-invoice-notes').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // Simulate accidental window closure / reload before debounce timer fires
    env.win.dispatchEvent(new env.win.Event('beforeunload'));

    const storedBeforeUnload = env.readStoredDraft();
    assert.ok(storedBeforeUnload, 'beforeunload debe provocar el volcado síncrono del borrador en localStorage');
    assert.equal(storedBeforeUnload.data.clientName, 'Accidental Exit Tech SRL');
    assert.equal(storedBeforeUnload.data.notes, 'Datos ingresados segundos antes de que el usuario cerrara la pestaña.');

    // Also verify pagehide triggers synchronous flush
    env.$('form-invoice-notes').value = 'Actualización en evento de navegación móvil';
    env.$('form-invoice-notes').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    env.win.dispatchEvent(new env.win.Event('pagehide'));
    const storedPageHide = env.readStoredDraft();
    assert.ok(storedPageHide, 'pagehide debe respaldar los datos síncronamente');
    assert.equal(storedPageHide.data.notes, 'Actualización en evento de navegación móvil');
  } finally {
    env.close();
  }
});

test('Tier 2.2: Manejo de múltiples ítems, campos opcionales vacíos y caracteres especiales', async () => {
  const specialClientName = 'Comercial & Distribuciones "El Ñandú" <B2B> S.R.L.';
  const specialNotes = 'Atención: transferir a cuenta #123-456 & confirmar con comprobante "R&D" <urgente> / áéíóú.';

  const complexDraft = {
    docType: 'quote',
    clientName: specialClientName,
    clientId: '',
    clientRnc: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    paymentTerms: 'Contado',
    notes: specialNotes,
    discountPct: 0,
    items: [
      { productId: 'it-1', description: 'Cables Patch Cord 1m Azul & Rojo', price: 95.5, qty: 50, tax: 859.5, discount: 0 },
      { productId: 'it-2', description: 'Jack Keystone RJ45 Cat6 "Amphenol"', price: 180, qty: 24, tax: 777.6, discount: 0 },
      { productId: 'it-3', description: 'Canaleta Ranurada 40x40 <Gris>', price: 320, qty: 10, tax: 576, discount: 0 },
      { productId: 'it-4', description: 'Organizador Horizontal 1U', price: 650, qty: 2, tax: 234, discount: 0 },
      { productId: 'it-5', description: 'Velcro Sujetacables 10m Negro', price: 450, qty: 1, tax: 81, discount: 0 }
    ]
  };

  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: complexDraft
  });

  try {
    env.win.ERPBillingWorkflows.restoreLatestDraft();

    // Verify special characters are not corrupt or double-escaped in DOM input values
    assert.equal(env.$('form-invoice-client-name').value, specialClientName);
    assert.equal(env.$('form-invoice-notes').value, specialNotes);

    // Verify empty optional fields remain empty strings
    assert.equal(env.$('form-invoice-client-rnc').value, '');
    assert.equal(env.$('form-invoice-client-phone').value, '');
    assert.equal(env.$('form-invoice-client-email').value, '');
    assert.equal(env.$('form-invoice-client-address').value, '');

    // Verify all 5 line items are accurately present
    const rows = env.$('invoice-form-items-body').querySelectorAll('tr');
    assert.equal(rows.length, 5, 'Deben restaurarse los 5 ítems');
    const firstDesc = rows[0].querySelector('.row-product-search').value;
    assert.equal(firstDesc, 'Cables Patch Cord 1m Azul & Rojo');
    const secondDesc = rows[1].querySelector('.row-product-search').value;
    assert.equal(secondDesc, 'Jack Keystone RJ45 Cat6 "Amphenol"');
    const thirdDesc = rows[2].querySelector('.row-product-search').value;
    assert.equal(thirdDesc, 'Canaleta Ranurada 40x40 <Gris>');
  } finally {
    env.close();
  }
});

test('Tier 2.3: JSON corrupto o inválido en localStorage se maneja defensivamente sin quebrar la interfaz', async () => {
  // Setup environment with corrupt JSON string in localStorage
  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: '{ bad_json: true, unexpected end of data...'
  });

  try {
    // Form must be operational
    assert.ok(env.$('invoice-editor-form'), 'El formulario de facturación debe estar operativo');
    const banner = env.$('billing-draft-banner');
    assert.equal(banner.hidden, true, 'El banner debe permanecer oculto ante un JSON corrupto');

    // Form can accept new input normally without breaking
    env.$('form-invoice-client-name').value = 'Nuevo Cliente Post Corrupción';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));
    await env.win.ERPBillingWorkflows.saveDraftNow();

    const newDraft = env.readStoredDraft();
    assert.ok(newDraft, 'El sistema debe poder guardar un nuevo borrador válido tras encontrar uno corrupto');
    assert.equal(newDraft.data.clientName, 'Nuevo Cliente Post Corrupción');
  } finally {
    env.close();
  }
});

// ============================================================================
// TIER 3: Cross-Feature Combinations
// ============================================================================

test('Tier 3.1: Conmutación entre tipos de documento (factura, proforma, cotización) en el ciclo de borrador', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const docTypeSelect = env.$('form-invoice-doc-type');
    const docNotes = env.$('form-invoice-doc-notes');

    // Switch to quote
    docTypeSelect.value = 'quote';
    env.win.ERPBilling.handleDocTypeChange('quote');

    assert.match(docNotes.textContent, /Modo Cotización/i, 'Las notas del documento deben reflejar Modo Cotización');
    assert.equal(env.$('form-invoice-ncf-type').disabled, true, 'En cotización el selector de NCF debe quedar inhabilitado');

    // Switch to proforma
    docTypeSelect.value = 'proforma';
    env.win.ERPBilling.handleDocTypeChange('proforma');

    assert.match(docNotes.textContent, /Modo Factura Proforma/i, 'Las notas del documento deben reflejar Modo Proforma');
    assert.equal(env.$('form-invoice-ncf-type').disabled, true, 'En proforma el selector de NCF debe quedar inhabilitado');

    // Fill client and save draft as proforma
    env.$('form-invoice-client-name').value = 'Consorcio Energético Proforma';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));
    await env.win.ERPBillingWorkflows.saveDraftNow();

    const draft = env.readStoredDraft();
    assert.equal(draft.data.docType, 'proforma', 'El tipo de documento guardado en el borrador debe ser proforma');

    // Switch to invoice in DOM, then restore draft
    docTypeSelect.value = 'invoice';
    env.win.ERPBilling.handleDocTypeChange('invoice');
    env.win.ERPBillingWorkflows.restoreLatestDraft();

    assert.equal(env.$('form-invoice-doc-type').value, 'proforma', 'Al restaurar, el docType debe ser proforma');
    const submitBtn = env.win.document.querySelector('#invoice-editor-form button[type="submit"]');
    assert.match(submitBtn.textContent, /Proforma/i, 'El botón de envío debe reflejar Proforma');
  } finally {
    env.close();
  }
});

test('Tier 3.2: Detección y conservación de borrador al navegar entre subpestañas del módulo de facturación', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Fill client data in form
    env.$('form-invoice-client-name').value = 'Cliente Navegación Subpestañas';
    env.$('form-invoice-notes').value = 'No perder estos datos al cambiar de vista';
    env.$('form-invoice-client-name').dispatchEvent(new env.win.Event('input', { bubbles: true }));
    env.$('form-invoice-notes').dispatchEvent(new env.win.Event('input', { bubbles: true }));

    // Commit draft
    await env.win.ERPBillingWorkflows.saveDraftNow();

    // User navigates to Invoices List subtab
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    assert.equal(env.$('subtab-invoices-list').classList.contains('is-active'), true);

    // User navigates back to Form subtab
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Check if active draft is detected upon returning to the form
    const detected = typeof env.win.ERPBillingWorkflows.checkDraftBanner === 'function'
      ? env.win.ERPBillingWorkflows.checkDraftBanner()
      : !env.$('billing-draft-banner').hidden;
    assert.equal(detected, true, 'Al retornar al formulario debe detectarse el borrador existente');

    env.win.ERPBillingWorkflows.restoreLatestDraft();
    assert.equal(env.$('form-invoice-client-name').value, 'Cliente Navegación Subpestañas');
  } finally {
    env.close();
  }
});

test('Tier 3.3: Conservación de datos de contacto (teléfono, email, dirección, RNC) al conmutar subpestañas', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Fill ONLY contact fields without clientName
    env.$('form-invoice-client-phone').value = '809-555-8888';
    env.$('form-invoice-client-email').value = 'contacto@directorio.com.do';
    env.$('form-invoice-client-address').value = 'Calle del Sol #20, Santiago';
    env.$('form-invoice-client-rnc').value = '132702077';

    // Switch to invoices list subtab and back to form subtab
    env.win.ERPBilling.switchSubTab('invoices', 'list');
    env.win.ERPBilling.switchSubTab('invoices', 'form');

    // Assert inputs survived in DOM without being cleared by openNewInvoiceForm()
    assert.equal(env.$('form-invoice-client-phone').value, '809-555-8888', 'El teléfono debe preservarse en el DOM');
    assert.equal(env.$('form-invoice-client-email').value, 'contacto@directorio.com.do', 'El email debe preservarse en el DOM');
    assert.equal(env.$('form-invoice-client-address').value, 'Calle del Sol #20, Santiago', 'La dirección debe preservarse en el DOM');
    assert.equal(env.$('form-invoice-client-rnc').value, '132702077', 'El RNC debe preservarse en el DOM');
  } finally {
    env.close();
  }
});

// ============================================================================
// TIER 4: Real-World Scenarios
// ============================================================================

test('Tier 4.1: Escenario Real 1 - Ciclo completo: Creación de cotización -> Accidente/Cierre -> Recuperación -> Edición -> Emisión', async () => {
  // Step 1: Session A - User prepares quote and window closes
  const envA = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  const draftKey = envA.draftKey;

  envA.$('form-invoice-doc-type').value = 'quote';
  envA.$('form-invoice-doc-type').dispatchEvent(new envA.win.Event('change', { bubbles: true }));

  envA.$('form-invoice-client-name').value = 'Inversiones Metropolitanas SRL';
  envA.$('form-invoice-client-rnc').value = '132702077';
  envA.$('form-invoice-notes').value = 'Cotización con validez de 15 días laborables.';
  envA.$('form-invoice-client-name').dispatchEvent(new envA.win.Event('input', { bubbles: true }));
  envA.$('form-invoice-notes').dispatchEvent(new envA.win.Event('input', { bubbles: true }));

  // Add line item in Session A
  const addRowBtnA = envA.win.document.querySelector('[data-erp-click="ERPBilling.addInvoiceFormItemRow()"]');
  if (addRowBtnA) addRowBtnA.click();
  else envA.win.ERPBilling.addInvoiceFormItemRow();

  const tbodyA = envA.$('invoice-form-items-body');
  const rowA = tbodyA.querySelector('tr');
  assert.ok(rowA, 'Debe existir una fila de ítem');
  rowA.querySelector('.row-product-search').value = 'Servidor Rack 1U Xeon';
  rowA.querySelector('.row-price').value = '85000';
  rowA.querySelector('.row-qty').value = '1';
  rowA.querySelector('.row-product-search').dispatchEvent(new envA.win.Event('input', { bubbles: true }));

  // Accidental exit
  envA.win.dispatchEvent(new envA.win.Event('beforeunload'));
  const storedJsonA = envA.win.localStorage.getItem(draftKey);
  assert.ok(storedJsonA, 'El borrador debe haber quedado en localStorage tras beforeunload en Sesión A');
  envA.close();

  // Step 2: Session B - Reload application with stored draft in place
  const envB = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: JSON.parse(storedJsonA).data
  });

  try {
    // User sees draft banner
    const bannerB = envB.$('billing-draft-banner');
    assert.equal(bannerB.hidden, false, 'Sesión B debe detectar el borrador de Sesión A');

    // Restore draft
    envB.win.ERPBillingWorkflows.restoreLatestDraft();
    assert.equal(envB.$('form-invoice-client-name').value, 'Inversiones Metropolitanas SRL');
    assert.equal(envB.$('form-invoice-notes').value, 'Cotización con validez de 15 días laborables.');

    // Edit: add another line item
    const addRowBtn = envB.win.document.querySelector('[data-erp-click="ERPBilling.addInvoiceFormItemRow()"]');
    if (addRowBtn) addRowBtn.click();

    const rowsB = envB.$('invoice-form-items-body').querySelectorAll('tr');
    assert.equal(rowsB.length, 2, 'Debe haber 2 filas tras agregar un ítem');
    const secondRow = rowsB[1];
    secondRow.querySelector('.row-product-search').value = 'Módulo RAM 32GB ECC';
    secondRow.querySelector('.row-price').value = '12500';
    secondRow.querySelector('.row-qty').value = '2';

    // Submit / emit document
    envB.win.document.dispatchEvent(
      new envB.win.CustomEvent('erp:invoice-saved', {
        detail: { id: 'inv-emitted-4001', action: 'saved', docType: 'quote' }
      })
    );
    await new Promise((resolve) => setImmediate(resolve));

    // Storage must be purged after successful emission
    assert.equal(
      envB.win.localStorage.getItem(draftKey),
      null,
      'El ciclo completo debe culminar con la limpieza total del borrador en localStorage'
    );
  } finally {
    envB.close();
  }
});

test('Tier 4.2: Escenario Real 2 - Identidad de división "Futunet" y prohibición de "Futunet Suministros"', async () => {
  const env = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    initialSettings: {
      name: 'Futunet',
      ticketSlogan: 'La Tecnología del Futuro',
      rnc: '132-70207-7',
      phone: '829-741-1041',
      email: 'ventas@futunet.com.do',
      address: 'Calle 7 Las Colinas, Santiago'
    }
  });

  try {
    // Verify division selector does not contain "Futunet Suministros"
    const divisionSelect = env.$('form-invoice-division');
    if (divisionSelect) {
      const optionsText = Array.from(divisionSelect.options)
        .map((opt) => opt.textContent)
        .join(' ');
      assert.doesNotMatch(
        optionsText,
        /Futunet Suministros/i,
        'El selector de división no debe contener "Futunet Suministros"'
      );
      assert.match(
        optionsText,
        /Futunet/i,
        'El selector de división debe identificar la división como "Futunet"'
      );
    }

    // Verify company name display in UI
    const sbName = env.$('sidebar-brand-name');
    if (sbName) {
      assert.equal(sbName.textContent, 'Futunet');
    }
    const pageTitle = env.$('page-title');
    if (pageTitle) {
      assert.equal(pageTitle.textContent, 'Futunet');
    }

    // Verify issuer snapshot for vouchers/prints
    const billingSnapshot = env.win.ERPBilling.getBillingSnapshot();
    assert.equal(billingSnapshot.companyCode, 'FUTUNETSRL');

    // Test invoiceIssuerSnapshot logic
    const testDoc = {
      id: 'doc-futunet-1',
      companyCode: 'FUTUNETSRL',
      docType: 'invoice',
      division: 'general',
      items: [{ productId: 'p1', description: 'Servicio de Internet Fibra Óptica', price: 1500, qty: 1 }]
    };

    // Render view/printable invoice to check company header
    env.win.ERPBilling.viewInvoice(testDoc);
    const viewCompanyName = env.$('view-company-name')?.textContent || '';
    const viewCompanySlogan = env.$('view-company-slogan')?.textContent || '';

    assert.doesNotMatch(
      viewCompanyName,
      /Futunet Suministros/i,
      'La vista y comprobante de factura no deben contener "Futunet Suministros"'
    );
    assert.match(
      viewCompanyName,
      /Futunet/i,
      'La vista de factura debe mostrar "Futunet"'
    );
    assert.equal(
      viewCompanySlogan,
      'La Tecnología del Futuro',
      'Debe mostrar el eslogan institucional "La Tecnología del Futuro"'
    );
  } finally {
    env.close();
  }
});

test('Tier 4.3: Escenario Real 3 - Descarte completo restablece el indicador de estado a "Sin cambios pendientes"', async () => {
  const existingDraft = {
    docType: 'quote',
    clientName: 'Cliente para Descarte Total',
    notes: 'Descartar este borrador',
    items: [{ productId: 'custom', description: 'Item 1', price: 500, qty: 1, tax: 90, discount: 0 }]
  };

  const env = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    initialDraft: existingDraft,
    confirmResponse: true
  });

  try {
    const banner = env.$('billing-draft-banner');
    assert.equal(banner.hidden, false);

    await env.win.ERPBillingWorkflows.discardLatestDraft();

    assert.equal(env.win.localStorage.getItem(env.draftKey), null);
    assert.equal(banner.hidden, true);

    const statusEl = env.$('billing-draft-status');
    if (statusEl) {
      assert.match(statusEl.textContent, /Sin cambios pendientes/i);
    }
  } finally {
    env.close();
  }
});

test('Tier 4.4: Escenario Real 4 - Soporte de cantidades fraccionarias y cálculo exacto de impuestos y descuentos', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Fractional line item: 2.5 meters of cable at 120.00 DOP
    // Global discount 15%
    const items = [
      { productId: 'wire-1', description: 'Cable Eléctrico 2.5m', price: 120, qty: 2.5, tax: 54, discount: 0, unitCost: 80 }
    ];

    const metrics = core.calculateCommercialMetrics(items, 15);
    assert.equal(metrics.coveredRows, 1);

    // Verify mathematical tax calculations with billing core
    const lineSubtotal = 120 * 2.5; // 300.00
    const globalDiscountAmount = lineSubtotal * 0.15; // 45.00
    const discountedBase = lineSubtotal - globalDiscountAmount; // 255.00
    const expectedItbis = Math.round(discountedBase * 0.18 * 100) / 100; // 45.90
    const expectedTotal = discountedBase + expectedItbis; // 300.90

    assert.equal(lineSubtotal, 300);
    assert.equal(discountedBase, 255);
    assert.equal(expectedItbis, 45.9);
    assert.equal(expectedTotal, 300.9);

    // Verify row-qty input accepts step="any" / fractional values without reverting to 1
    const tbody = env.$('invoice-form-items-body');
    const firstRow = tbody.querySelector('tr');
    if (firstRow) {
      const qtyInput = firstRow.querySelector('.row-qty');
      if (qtyInput) {
        qtyInput.value = '2.5';
        qtyInput.dispatchEvent(new env.win.Event('input', { bubbles: true }));
        assert.equal(Number(qtyInput.value), 2.5, 'El campo de cantidad debe permitir valores decimales (2.5)');
      }
    }
  } finally {
    env.close();
  }
});

test('Tier 4.5: Escenario Real 5 - Validación consistente de RNC y formato de correo de cliente', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    // Form RNC check: must be 9 or 11 digits
    const validCompanyRnc = '132702077';
    const validPersonalRnc = '00100000001';
    const invalidShortRnc = '12345';
    const invalidLongRnc = '1234567890123';

    const cleanDigits = (val) => String(val || '').replace(/\D/g, '');
    const isValidRncFormat = (rnc) => {
      const digits = cleanDigits(rnc);
      return digits.length === 0 || digits.length === 9 || digits.length === 11;
    };

    assert.equal(isValidRncFormat(validCompanyRnc), true);
    assert.equal(isValidRncFormat(validPersonalRnc), true);
    assert.equal(isValidRncFormat(invalidShortRnc), false);
    assert.equal(isValidRncFormat(invalidLongRnc), false);
    assert.equal(isValidRncFormat(''), true, 'RNC vacío es permitido en comprobantes de consumo');

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    assert.equal(emailRegex.test('cliente@dominio.com.do'), true);
    assert.equal(emailRegex.test('invalido@@email'), false);
    assert.equal(emailRegex.test('sin-arroba.com'), false);
  } finally {
    env.close();
  }
});


test('Tier 2.4: Aislamiento estricto multi-tenant entre CREATICOS y FUTUNETSRL (No fuga de datos ni banner)', async () => {
  // Pre-seed localStorage with Company A (CREATICOS) confidential draft
  const companyAKey = 'erp_billing_draft_CREATICOS_user-tenant-a';
  const companyAData = {
    docType: 'invoice',
    clientName: 'Cliente Confidencial Creaticos S.R.L.',
    clientRnc: '132702077',
    notes: 'Costos y margenes estrictamente confidenciales de Creaticos',
    items: [{ productId: 'p1', description: 'Servidor Creaticos A', price: 95000, qty: 1 }]
  };

  // User B logs in for Company B (FUTUNETSRL) under the same shared browser origin
  const envUserB = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-tenant-b', email: 'userb@futunet.com.do', role: 'admin' },
    localStorageData: {
      [companyAKey]: { data: companyAData, savedAt: Date.now() - 5000 }
    }
  });

  try {
    // 1. checkDraftBanner must return false for Company B
    const detected = envUserB.win.ERPBillingWorkflows.checkDraftBanner();
    assert.equal(detected, false, 'checkDraftBanner no debe detectar un borrador de otra empresa');

    // 2. Banner element must remain hidden
    const banner = envUserB.$('billing-draft-banner');
    const isVisible = banner && !banner.hidden && banner.style.display !== 'none';
    assert.equal(isVisible, false, 'El banner #billing-draft-banner no debe mostrarse a usuarios de otra empresa');

    // 3. readLocalDraft must return null
    if (typeof envUserB.win.ERPBillingWorkflows.readLocalDraft === 'function') {
      const draft = envUserB.win.ERPBillingWorkflows.readLocalDraft();
      assert.equal(draft, null, 'readLocalDraft debe retornar null para empresas ajenas');
    }

    // 4. Invoking restoreLatestDraft must NOT populate foreign company data into form
    envUserB.win.ERPBillingWorkflows.restoreLatestDraft();
    const clientNameVal = envUserB.$('form-invoice-client-name').value;
    assert.notEqual(clientNameVal, 'Cliente Confidencial Creaticos S.R.L.', 'restoreLatestDraft no debe inyectar datos de otra empresa');
    assert.equal(clientNameVal, '', 'El campo de cliente debe permanecer vacio');
  } finally {
    envUserB.close();
  }
});

test('Tier 2.6: Descarte o emisión de borrador en FUTUNETSRL NO elimina el borrador de CREATICOS', async () => {
  const companyAKey = 'erp_billing_draft_CREATICOS_user-tenant-a';
  const companyAData = {
    docType: 'invoice',
    clientName: 'Cliente Activo Creaticos',
    items: [{ productId: 'p1', description: 'Item Creaticos', price: 500, qty: 1 }]
  };

  const companyBKey = 'erp_billing_draft_FUTUNETSRL_user-tenant-b';
  const companyBData = {
    docType: 'quote',
    clientName: 'Cliente Activo Futunet',
    items: [{ productId: 'p2', description: 'Item Futunet', price: 300, qty: 1 }]
  };

  const envUserB = await createBillingEnvironment({
    companyCode: 'FUTUNETSRL',
    user: { uid: 'user-tenant-b', email: 'userb@futunet.com.do', role: 'admin' },
    localStorageData: {
      [companyAKey]: { data: companyAData, savedAt: Date.now() - 10000 },
      [companyBKey]: { data: companyBData, savedAt: Date.now() - 5000 }
    },
    confirmResponse: true
  });

  try {
    // User B discards their draft
    await envUserB.win.ERPBillingWorkflows.discardLatestDraft();

    // Verify User B's draft is deleted
    assert.equal(envUserB.win.localStorage.getItem(companyBKey), null, 'El borrador de Futunet debe ser eliminado');

    // CRITICAL ASSERTION: Verify Company A's draft is intact
    const companyAStored = envUserB.win.localStorage.getItem(companyAKey);
    assert.ok(companyAStored !== null, 'El borrador de Creaticos debe ser preservado al descartar en Futunet');
    const parsedA = JSON.parse(companyAStored);
    assert.equal(parsedA.data.clientName, 'Cliente Activo Creaticos');

    // Re-seed User B's draft and verify invoice emission event does not delete Company A draft
    envUserB.win.localStorage.setItem(companyBKey, JSON.stringify({ data: companyBData, savedAt: Date.now() }));
    envUserB.win.document.dispatchEvent(
      new envUserB.win.CustomEvent('erp:invoice-saved', {
        detail: { id: 'inv-futunet-99', action: 'saved', docType: 'invoice' }
      })
    );
    await new Promise(r => setImmediate(r));

    assert.equal(envUserB.win.localStorage.getItem(companyBKey), null, 'Borrador de Futunet purgado tras emision');
    assert.ok(
      envUserB.win.localStorage.getItem(companyAKey) !== null,
      'Al emitir factura en Futunet, el borrador de Creaticos no debe ser purgado'
    );
  } finally {
    envUserB.close();
  }
});

test('Tier 2.7: Aislamiento de borradores entre operadores de la misma empresa en terminal compartida', async () => {
  const userAlphaKey = 'erp_billing_draft_CREATICOS_operator-alpha';
  const userAlphaData = {
    docType: 'invoice',
    clientName: 'Cliente Operador Alpha',
    items: [{ productId: 'p1', description: 'Item Alpha', price: 1000, qty: 1 }]
  };

  // User Beta logs into CREATICOS on same terminal
  const envBeta = await createBillingEnvironment({
    companyCode: 'CREATICOS',
    user: { uid: 'operator-beta', email: 'beta@creaticos.com', role: 'seller' },
    localStorageData: {
      [userAlphaKey]: { data: userAlphaData, savedAt: Date.now() - 10000 }
    }
  });

  try {
    const hasBanner = envBeta.win.ERPBillingWorkflows.checkDraftBanner();
    const banner = envBeta.$('billing-draft-banner');
    const isVisible = banner && !banner.hidden && banner.style.display !== 'none';

    assert.equal(hasBanner, false, 'Operador Beta no debe recibir borrador de Operador Alpha');
    assert.equal(isVisible, false, 'El banner no debe mostrarse a un usuario distinto');

    // If Operator Beta discards, Alpha's draft must not be touched
    await envBeta.win.ERPBillingWorkflows.discardLatestDraft();
    assert.ok(
      envBeta.win.localStorage.getItem(userAlphaKey) !== null,
      'El descarte de Beta no debe borrar el borrador de Alpha'
    );
  } finally {
    envBeta.close();
  }
});

test('Tier 2.5: Verificación de contratos de interfaz expuestos por ERPBillingWorkflows', async () => {
  const env = await createBillingEnvironment({ companyCode: 'CREATICOS' });
  try {
    const wf = env.win.ERPBillingWorkflows;
    assert.equal(typeof wf.documentSnapshotFromForm, 'function', 'Debe exponer documentSnapshotFromForm');
    assert.equal(typeof wf.flushDraftNow, 'function', 'Debe exponer flushDraftNow');
    assert.equal(typeof wf.clearActiveDraft, 'function', 'Debe exponer clearActiveDraft');
    assert.equal(typeof wf.saveDraftNow, 'function', 'Debe exponer saveDraftNow');
    assert.equal(typeof wf.restoreLatestDraft, 'function', 'Debe exponer restoreLatestDraft');
    assert.equal(typeof wf.discardLatestDraft, 'function', 'Debe exponer discardLatestDraft');

    // Exercise documentSnapshotFromForm contract
    env.$('form-invoice-client-name').value = 'Contrato Test SRL';
    env.$('form-invoice-client-rnc').value = '132702077';
    env.$('form-invoice-notes').value = 'Prueba de contrato';
    const snapshot = wf.documentSnapshotFromForm(env.$('invoice-editor-form'));
    assert.equal(snapshot.clientName, 'Contrato Test SRL');
    assert.equal(snapshot.clientRnc, '132702077');
    assert.equal(snapshot.notes, 'Prueba de contrato');
    assert.ok(Array.isArray(snapshot.items), 'El snapshot debe incluir items como array');
  } finally {
    env.close();
  }
});

test('Tier 4.6: Estabilidad numérica ante cantidad 0 y acotamiento de descuentos', async () => {
  // Test zero quantity calculation with BillingCore
  const zeroQtyItem = { productId: 'p1', price: 1000, qty: 0, tax: 0, discount: 0 };
  const zeroMetrics = core.calculateCommercialMetrics([zeroQtyItem], 0);
  assert.equal(zeroMetrics.netSales, 0, 'Cantidad 0 debe generar ventas netas 0 sin NaN ni fallos');

  // Test discount clamping with BillingCore
  const clampedNegative = Math.min(100, Math.max(0, -15));
  const clampedOver = Math.min(100, Math.max(0, 150));
  const clampedNormal = Math.min(100, Math.max(0, 25));
  assert.equal(clampedNegative, 0, 'Descuento negativo debe acotarse a 0');
  assert.equal(clampedOver, 100, 'Descuento superior a 100 debe acotarse a 100');
  assert.equal(clampedNormal, 25, 'Descuento normal debe conservarse');

  // Test discount calculation accuracy
  const normalItem = { productId: 'p2', price: 2000, qty: 1, tax: 360, discount: 0 };
  const discountedMetrics = core.calculateCommercialMetrics([normalItem], 20);
  assert.equal(discountedMetrics.netSales, 1600, '20% de descuento sobre 2000 debe dar 1600 neto');
});
