const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
const billing = fs.readFileSync(path.join(root, 'js', 'facturacion.js'), 'utf8');
const extensions = fs.readFileSync(path.join(root, 'js', 'erp-extensions.js'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'js', 'admin-panel.js'), 'utf8');
const financing = fs.readFileSync(path.join(root, 'js', 'financing.js'), 'utf8');
const adminFinancing = fs.readFileSync(path.join(root, 'js', 'admin-financing.js'), 'utf8');
const cart = fs.readFileSync(path.join(root, 'js', 'cart.js'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'js', 'auth.js'), 'utf8');
const storageRules = fs.readFileSync(path.join(root, 'storage.rules'), 'utf8');
const authGuard = fs.readFileSync(path.join(root, 'js', 'auth-guard.js'), 'utf8');
const billingHtml = fs.readFileSync(path.join(root, 'facturacion.html'), 'utf8');
const billingCss = fs.readFileSync(path.join(root, 'css', 'facturacion.css'), 'utf8');
const workflows = fs.readFileSync(path.join(root, 'js', 'billing-workflows.js'), 'utf8');
const billingEvents = fs.readFileSync(path.join(root, 'js', 'billing-events.js'), 'utf8');
const publicQuote = fs.readFileSync(path.join(root, 'js', 'public-quote.js'), 'utf8');
const publicQuoteHtml = fs.readFileSync(path.join(root, 'cotizacion.html'), 'utf8');
const adminHtml = fs.readFileSync(path.join(root, 'admin.html'), 'utf8');
const adminCss = fs.readFileSync(path.join(root, 'css', 'admin.css'), 'utf8');
const hosting = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));

test('las reglas de comandas no conceden escritura total a operadores', () => {
  const block = rules.match(/match \/panitas_table_orders\/\{tableId\} \{([\s\S]*?)\n    \}/);
  assert.ok(block, 'falta el bloque panitas_table_orders');
  assert.doesNotMatch(block[1], /allow read, create, update, delete/);
  assert.match(block[1], /isValidRestaurantTransition\(\)/);
  assert.match(block[1], /isValidRestaurantOrderVersion\(\)/);
  assert.match(block[1], /allow delete: if isPanitasAdmin\(\)/);
});

test('los eventos de comandas son inmutables', () => {
  assert.match(rules, /match \/panitas_order_events\/\{eventId\}/);
  assert.match(rules, /allow update: if false/);
  assert.match(rules, /data\.timestamp == request\.time/);
  assert.match(rules, /getAfter\(\/databases\/\$\(database\)\/documents\/panitas_table_orders\/\$\(data\.orderId\)\)/);
});

test('el KDS no construye onclick con identificadores de mesa', () => {
  assert.doesNotMatch(billing, /onclick=["'][^"']*updateKdsStatus\('\$\{table\}/);
  assert.match(billing, /addEventListener\('click', \(\) => updateKdsStatus\(table/);
});

test('la venta cierra la mesa dentro de la transacción', () => {
  assert.match(billing, /invoiced_and_closed/);
  assert.match(billing, /linkedInvoiceId: createdDocId/);
  assert.match(billing, /restaurantItemsChanged\(order\.items, billedRestaurantItems\)/);
  assert.doesNotMatch(billing, /collection\('panitas_table_orders'\)\.doc\(table\)\.delete\(\)/);
});

test('Hosting publica un artefacto aislado', () => {
  assert.equal(hosting.hosting.public, 'dist');
  assert.ok(hosting.hosting.predeploy.some(command => command.includes('prepare-hosting.mjs')));
  const csp = hosting.hosting.headers.flatMap(rule => rule.headers || [])
    .find(header => header.key === 'Content-Security-Policy').value;
  assert.doesNotMatch(csp, /rnc\.megaplus\.com\.do|api\.allorigins\.win|corsproxy\.io|api\.codetabs\.com/);
  assert.match(csp, /https:\/\/futunet-backend\.onrender\.com/);
  assert.match(csp, /https:\/\/cdnjs\.cloudflare\.com/);
  assert.match(csp, /tile\.openstreetmap\.org/);
  assert.doesNotMatch(csp, /localhost|127\.0\.0\.1/);
  const assetCache = hosting.hosting.headers
    .find(rule => rule.source.includes('css|js'))?.headers
    .find(header => header.key === 'Cache-Control')?.value || '';
  assert.doesNotMatch(assetCache, /immutable/);
});

test('la consulta RNC usa únicamente el backend autenticado', () => {
  assert.doesNotMatch(billing, /api\.allorigins\.win|corsproxy\.io|api\.codetabs\.com/);
  assert.doesNotMatch(billing, /rnc\.megaplus\.com\.do\/api\/consulta/);
  assert.match(billing, /\/api\/rnc\/consulta\?rnc=/);
  assert.match(billing, /Authorization:\s*`Bearer \$\{idToken\}`/);
  assert.match(billing, /'X-Company-Code': activeCompanyCode/);
});

test('las sesiones de caja conservan propietario y no permiten editar cajas cerradas', () => {
  assert.match(rules, /function isCashSessionOwner\(\)/);
  assert.match(rules, /resource\.data\.status == 'open'/);
  assert.match(billing, /openedByUid: currentUser\.uid/);
});

test('facturación e inventario se contabilizan y reversan de forma transaccional', () => {
  assert.match(billing, /aggregateInventoryItems\(items\)/);
  assert.match(billing, /inventoryEffects/);
  assert.match(billing, /type: 'sale_reversal'/);
  assert.match(billing, /collectionInventoryMovements/);
  assert.match(billing, /lastInventoryMovementId: movementRef\.id/);
  assert.match(billing, /productDocumentId: effect\.documentId/);
  assert.match(rules, /function inventoryMovementMatchesStockUpdate\(/);
  assert.match(rules, /request\.resource\.data\.lastInventoryMovementId/);
  assert.match(rules, /match \/creaticos_inventory_movements\/\{movementId\}/);
  assert.match(rules, /allow update, delete: if false/);
});

test('los cobros son inmutables y quedan vinculados al usuario', () => {
  assert.match(billing, /createdBy: currentUser\.uid/);
  assert.match(billing, /lastPaymentId: paymentRef\.id/);
  assert.match(rules, /function isPaymentOnlyInvoiceUpdate\(\)/);
  assert.match(rules, /match \/futunet_payments\/\{paymentId\}[\s\S]*?allow update, delete: if false/);
});

test('el financiamiento exige identidad aprobada y conserva un libro de pagos inmutable', () => {
  assert.match(auth, /normalizeIdentityDocument/);
  assert.match(auth, /termsAcceptedAt/);
  assert.match(cart, /paymentMethod === 'financing'/);
  assert.match(financing, /financing_profiles/);
  assert.match(adminFinancing, /runTransaction/);
  assert.match(rules, /match \/financing_profiles\/\{userId\}/);
  assert.match(rules, /get\(\/databases\/\$\(database\)\/documents\/financing_profiles\/\$\(data\.userId\)\)\.data\.status == 'approved'/);
  assert.match(rules, /match \/financing_payments\/\{paymentId\}[\s\S]*?allow update, delete: if false/);
  assert.match(storageRules, /match \/financing-documents\/\{userId\}\/\{fileName\}/);
  assert.match(storageRules, /request\.auth\.uid == userId \|\| isAdminOrAbove\(\)/);
});

test('la auditoría puede escribirse pero no alterarse ni borrarse', () => {
  assert.equal((rules.match(/match \/audit_logs\/\{logId\}/g) || []).length, 1);
  assert.match(rules, /request\.resource\.data\.userId == request\.auth\.uid/);
  assert.match(rules, /allow update, delete: if false/);
});

test('un administrador no puede conceder el rol superadmin', () => {
  assert.match(rules, /!documentHasRole\(request\.resource\.data, 'superadmin'\)/);
  assert.match(admin, /Solo un superadministrador puede asignar el rol superadmin/);
  assert.match(admin, /isProtectedRole/);
});

test('los roles operativos tienen acceso limitado por especialidad', () => {
  for (const role of ['support_agent', 'billing_clerk', 'marketing_manager']) {
    assert.match(rules, new RegExp(role));
    assert.match(authGuard, new RegExp(role));
  }
  assert.match(rules, /function isPlatformSupport\(\)/);
  assert.match(rules, /function isPlatformBilling\(\)/);
  assert.match(rules, /function isPlatformMarketing\(\)/);
});

test('el pago NFC es un registro manual verificable y no simula aprobacion bancaria', () => {
  assert.match(billingHtml, /id="nfc-manual-reference"/);
  assert.match(billingHtml, /Registrar pago verificado/);
  assert.match(billing, /document\.getElementById\('nfc-manual-reference'\)/);
  assert.doesNotMatch(billing, /PROCESANDO PAGO CON EL BANCO|PAGO APROBADO/);
});

test('el panel administrativo carga secciones bajo demanda y limita los contadores en vivo', () => {
  assert.match(admin, /loadPanel\('dashboard'\)/);
  assert.match(admin, /function loadPanel\(panelName, forceReload\)/);
  assert.match(admin, /collection\('orders'\)\.where\('status', '==', 'pending'\)/);
  assert.match(admin, /collection\('internet_payments'\)\.where\('status', '==', 'pending'\)/);
});

test('el dashboard administrativo prioriza pendientes, accesos rápidos y navegación accesible', () => {
  for (const id of ['queue-orders', 'queue-requests', 'queue-internet', 'queue-financing', 'queue-stock']) {
    assert.match(adminHtml, new RegExp(`id="${id}"`));
  }
  assert.match(adminHtml, /id="btn-refresh-dashboard"/);
  assert.match(adminHtml, /id="admin-nav-search"/);
  assert.match(adminHtml, /class="admin-skip-link"/);
  assert.match(adminHtml, /data-admin-jump="financing-management"/);
  assert.match(admin, /function refreshDashboard\(\)/);
  assert.match(admin, /financing_profiles'\)\.where\('status', '==', 'pending_review'\)/);
  assert.match(admin, /\['superadmin', 'admin', 'support_agent'\]\.some\(currentUserHasRole\)/);
  assert.match(adminCss, /\.admin-work-queue/);
  assert.match(adminCss, /@media \(max-width: 1100px\) and \(min-width: 769px\)/);
});

test('facturas y cotizaciones ajustan su impresión por altura sin bajar de un tamaño legible', () => {
  assert.match(billing, /function applyAdaptivePrintLayout\(\)/);
  assert.match(billing, /LETTER_PAGE_HEIGHT_MM - \(LETTER_PAGE_MARGIN_MM \* 2\)/);
  assert.match(billing, /\{ className: 'print-fit-minimum', label: '7\.4 pt' \}/);
  assert.match(billing, /selectedHeight <= targetHeight/);
  assert.doesNotMatch(billing, /itemsCount > 14|itemsCount > 10|itemsCount > 6/);
  assert.match(billing, /await applyAdaptivePrintLayout\(\)/);
  assert.match(billingHtml, /ERPBilling\.printCurrentInvoice\(\)/);
  assert.match(billingHtml, /id="invoice-print-fit-status"/);
  assert.match(billingCss, /\.printable-invoice-wrapper\.print-fit-minimum/);
  assert.match(billingCss, /break-inside: auto !important/);
  assert.equal((billingCss.match(/^@media print/gm) || []).length, 2);
});

test('los productos vendidos se archivan sin romper reversos de inventario', () => {
  assert.match(billing, /isActive: false/);
  assert.match(billing, /archivedBy: currentUser\.uid/);
  assert.doesNotMatch(billing, /collection\(coll\)\.doc\(id\)\.delete\(\)/);
  assert.match(rules, /match \/creaticos_products\/\{productId\}[\s\S]*?allow delete: if false/);
});

test('facturación solo permite Creaticos y Futunet', () => {
  const switcher = billingHtml.match(/<select id="superadmin-company-select"[\s\S]*?<\/select>/)?.[0] || '';
  assert.match(switcher, /value="CREATICOS"/);
  assert.match(switcher, /value="FUTUNETSRL"/);
  assert.doesNotMatch(switcher, /PANITAS|Los Panitas/);
  assert.doesNotMatch(extensions, /companyCode === 'PANITAS'/);
});

test('los módulos ERP visibles registran compras, banco, alertas y auditoría', () => {
  for (const panel of ['alerts', 'receivables', 'purchases', 'banking', 'inventory-audit']) {
    assert.match(billingHtml, new RegExp(`id="panel-${panel}"`));
    assert.match(billingHtml, new RegExp(`data-nav="${panel}"`));
  }
  assert.match(extensions, /collection\(`\$\{prefix\}_purchases`\)/);
  assert.match(extensions, /collection\(`\$\{prefix\}_bank_movements`\)/);
  assert.match(extensions, /function export606\(\)/);
  assert.match(extensions, /function loadReceivables\(\)/);
  assert.match(rules, /match \/creaticos_purchases\/\{purchaseId\}/);
  assert.match(rules, /match \/futunet_bank_movements\/\{movementId\}/);
});

test('el ciclo comercial conserva borradores, aprobaciones y eventos inmutables', () => {
  assert.match(billingHtml, /id="panel-commercial"/);
  assert.match(workflows, /billing_drafts/);
  assert.match(workflows, /approval_requests/);
  assert.match(workflows, /document_events/);
  assert.match(workflows, /authorizeDocument/);
  assert.match(rules, /match \/creaticos_billing_drafts\/\{draftId\}/);
  assert.match(rules, /match \/futunet_approval_requests\/\{requestId\}/);
  assert.match(rules, /match \/creaticos_document_events\/\{eventId\}[\s\S]*?allow update, delete: if false/);
  assert.match(rules, /preservesAcceptedQuoteContent/);
});

test('las cotizaciones se comparten con token y respuesta acotada', () => {
  assert.match(workflows, /crypto\.getRandomValues/);
  assert.match(workflows, /public_quote_links/);
  assert.match(publicQuoteHtml, /meta name="robots" content="noindex,nofollow,noarchive"/);
  assert.match(publicQuote, /responseStatus: status/);
  assert.match(rules, /token\.matches\('\^\[a-f0-9\]\{48\}\$'\)/);
  assert.match(rules, /function isValidPublicQuoteResponse/);
  assert.match(rules, /function preservesFinalPublicQuoteResponse/);
  assert.match(rules, /request\.resource\.data\.workflowStatus in \['accepted', 'converted'\]/);
  assert.match(rules, /affectedKeys\(\)\.hasOnly\(\['responseStatus', 'signerName'/);
});

test('facturación usa paginación de servidor y evita eventos HTML ejecutables', () => {
  assert.match(billing, /\.limit\(DATA_PAGE_SIZE\)/);
  assert.match(billing, /\.startAfter\(invoiceHistoryCursor\)/);
  assert.match(billingHtml, /billing-events\.js/);
  assert.match(billingEvents, /allowedMethods/);
  assert.doesNotMatch(billingHtml, /\s(?:onclick|onchange|oninput|onsubmit)=/);
  assert.doesNotMatch(billing, /\s(?:onclick|onchange|oninput|onsubmit)=/);
  assert.doesNotMatch(extensions, /\s(?:onclick|onchange|oninput|onsubmit)=/);
});

test('la sesión de facturación renueva permisos y evita módulos privados obsoletos', () => {
  assert.match(auth, /getIdToken\(true\)/);
  assert.match(authGuard, /authUser\.emailVerified !== true/);
  assert.match(billingHtml, /facturacion\.js\?v=20260802-permissions-fix/);
  assert.match(billing, /billingInitializationErrorMessage/);
  const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  assert.match(serviceWorker, /privateScripts/);
  assert.match(serviceWorker, /'\/js\/facturacion\.js'/);
});

test('la cobranza incluye estados de cuenta, recordatorios y recurrencia revisable', () => {
  assert.match(workflows, /downloadStatement/);
  assert.match(workflows, /collection_reminders/);
  assert.match(workflows, /billing_templates/);
  assert.match(workflows, /nextRecurringDate/);
  assert.match(billingHtml, /id="commercial-reminders-list"/);
  assert.match(billingHtml, /id="commercial-stock-suggestions"/);
  assert.match(billingHtml, /id="commercial-compliance-checks"/);
});
