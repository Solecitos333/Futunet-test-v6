const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');

test('Buzón de sugerencias: integridad del documento HTML y elementos clave', () => {
  const htmlPath = path.join(projectRoot, 'sugerencias.html');
  assert.ok(fs.existsSync(htmlPath), 'sugerencias.html debe existir');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Formulario y campos requeridos
  assert.ok(doc.getElementById('sug-form'), 'Debe contener el formulario #sug-form');
  assert.ok(doc.getElementById('sug-title'), 'Debe contener el campo #sug-title');
  assert.ok(doc.getElementById('sug-desc'), 'Debe contener el campo #sug-desc');
  assert.ok(doc.getElementById('sug-benefit'), 'Debe contener el campo #sug-benefit');
  assert.ok(doc.getElementById('sug-anon-checkbox'), 'Debe contener el checkbox #sug-anon-checkbox');
  assert.ok(doc.getElementById('sug-submit-btn'), 'Debe contener el botón #sug-submit-btn');
  assert.ok(doc.getElementById('sug-hp-check'), 'Debe contener el honeypot antispam #sug-hp-check');

  // Categorías interactivas
  const categoryCards = doc.querySelectorAll('.sug-category-card');
  assert.ok(categoryCards.length >= 5, 'Debe contar con al menos 5 tarjetas de categorías');

  const expectedCategories = ['web_platform', 'services_support', 'catalog_products', 'customer_service', 'other'];
  const actualCategories = Array.from(categoryCards).map(c => c.getAttribute('data-cat'));
  for (const cat of expectedCategories) {
    assert.ok(actualCategories.includes(cat), `Debe incluir la categoría ${cat}`);
  }

  // Tarjeta de éxito y código de referencia
  assert.ok(doc.getElementById('sug-success-card'), 'Debe incluir la tarjeta de éxito #sug-success-card');
  assert.ok(doc.getElementById('sug-ref-code'), 'Debe incluir el display de código #sug-ref-code');
});

test('Buzón de sugerencias: enlaces de navegación en Navbar, Footer, Soporte y Mi Cuenta', () => {
  // 1. js/main.js
  const mainJs = fs.readFileSync(path.join(projectRoot, 'js', 'main.js'), 'utf8');
  assert.ok(mainJs.includes('sugerencias.html'), 'js/main.js debe incluir el enlace a sugerencias.html');

  // 2. index.html
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('href="sugerencias.html"'), 'index.html debe enlazar a sugerencias.html en el footer');

  // 3. soporte.html
  const soporteHtml = fs.readFileSync(path.join(projectRoot, 'soporte.html'), 'utf8');
  assert.ok(soporteHtml.includes('href="sugerencias.html"'), 'soporte.html debe enlazar a sugerencias.html');

  // 4. mi-cuenta.html
  const miCuentaHtml = fs.readFileSync(path.join(projectRoot, 'mi-cuenta.html'), 'utf8');
  assert.ok(miCuentaHtml.includes('href="sugerencias.html"'), 'mi-cuenta.html debe enlazar a sugerencias.html');

  // 5. login.html
  const loginHtml = fs.readFileSync(path.join(projectRoot, 'login.html'), 'utf8');
  assert.ok(loginHtml.includes("'sugerencias.html'"), 'login.html debe permitir sugerencias.html en allowedRedirects');
});

test('Buzón de sugerencias: reglas de Firestore validan esquema y rechazan campos no autorizados', () => {
  const rules = fs.readFileSync(path.join(projectRoot, 'firestore.rules'), 'utf8');
  assert.ok(rules.includes('match /suggestions/{suggestionId}'), 'firestore.rules debe contener match /suggestions/{suggestionId}');
  assert.ok(rules.includes("d.category in ['web_platform', 'services_support', 'catalog_products', 'customer_service', 'other']"), 'firestore.rules debe validar categorías permitidas');
  assert.ok(rules.includes("d.status == 'pending'"), 'firestore.rules debe forzar estado pending al crear');
  assert.ok(rules.includes("d.createdAt == request.time"), 'firestore.rules debe forzar createdAt al crear');
});

test('Buzón de sugerencias: módulo administrativo y protección XSS', () => {
  const adminHtml = fs.readFileSync(path.join(projectRoot, 'admin.html'), 'utf8');
  assert.ok(adminHtml.includes('data-admin-nav="suggestions"'), 'admin.html debe tener el botón de navegación suggestions');
  assert.ok(adminHtml.includes('data-admin-panel="suggestions"'), 'admin.html debe tener el panel suggestions');
  assert.ok(adminHtml.includes('id="suggestion-detail-modal"'), 'admin.html debe tener el modal suggestion-detail-modal');
  assert.ok(adminHtml.includes('id="internal-suggestion-modal"'), 'admin.html debe tener el modal internal-suggestion-modal');
  assert.ok(adminHtml.includes('id="sug-modal-refcode"'), 'admin.html debe incluir el display de refCode');
  assert.ok(adminHtml.includes('id="sug-modal-official-response"'), 'admin.html debe incluir el campo de respuesta oficial');

  const adminJs = fs.readFileSync(path.join(projectRoot, 'js', 'admin-panel.js'), 'utf8');
  assert.ok(adminJs.includes('loadSuggestions: loadSuggestions'), 'admin-panel.js debe exportar loadSuggestions');
  assert.ok(adminJs.includes('copySuggestionRefCode: copySuggestionRefCode'), 'admin-panel.js debe exportar copySuggestionRefCode');
  assert.ok(adminJs.includes('officialResponse: newOfficialResponse'), 'admin-panel.js debe persistir officialResponse');
  assert.ok(adminJs.includes('escapeHtml(sug.title)'), 'admin-panel.js debe escapar el título contra XSS');
  assert.ok(adminJs.includes('escapeHtml(searchStr)'), 'admin-panel.js debe escapar atributos de búsqueda');
});

test('Buzón de sugerencias: seguimiento por refCode y muro comunitario en sugerencias.html y js/suggestions.js', () => {
  const htmlContent = fs.readFileSync(path.join(projectRoot, 'sugerencias.html'), 'utf8');
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Seguimiento por refCode
  assert.ok(doc.getElementById('sug-track-box'), 'Debe incluir la caja de seguimiento #sug-track-box');
  assert.ok(doc.getElementById('sug-track-input'), 'Debe incluir el input #sug-track-input');
  assert.ok(doc.getElementById('sug-track-btn'), 'Debe incluir el botón #sug-track-btn');
  assert.ok(doc.getElementById('sug-track-result'), 'Debe incluir el contenedor #sug-track-result');

  // Muro comunitario
  assert.ok(doc.getElementById('sug-community-showcase'), 'Debe incluir la sección #sug-community-showcase');
  assert.ok(doc.getElementById('sug-community-grid'), 'Debe incluir el grid #sug-community-grid');

  // Lógica en suggestions.js
  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('refCode: refCode'), 'js/suggestions.js debe enviar refCode a Firestore');
  assert.ok(sugJs.includes('handleTrackSuggestion'), 'js/suggestions.js debe incluir handleTrackSuggestion');
  assert.ok(sugJs.includes('officialResponse'), 'js/suggestions.js debe renderizar officialResponse');
  assert.ok(sugJs.includes('initCommunityWall'), 'js/suggestions.js debe incluir initCommunityWall');
});

test('Buzón de sugerencias: integración en Mi Cuenta (mi-cuenta.html y js/user-panel.js)', () => {
  const miCuentaHtml = fs.readFileSync(path.join(projectRoot, 'mi-cuenta.html'), 'utf8');
  assert.ok(miCuentaHtml.includes('data-up-tab="suggestions"'), 'mi-cuenta.html debe incluir pestaña suggestions');
  assert.ok(miCuentaHtml.includes('data-up-panel="suggestions"'), 'mi-cuenta.html debe incluir panel suggestions');
  assert.ok(miCuentaHtml.includes('id="user-suggestions-list"'), 'mi-cuenta.html debe incluir contenedor #user-suggestions-list');

  const userPanelJs = fs.readFileSync(path.join(projectRoot, 'js', 'user-panel.js'), 'utf8');
  assert.ok(userPanelJs.includes('loadUserSuggestions(user)'), 'user-panel.js debe invocar loadUserSuggestions');
  assert.ok(userPanelJs.includes('officialResponse'), 'user-panel.js debe mostrar officialResponse del equipo');
});

test('Mejora demandada por usuarios: proyectores en el catálogo (supplier_inventory.js)', () => {
  const suppJs = fs.readFileSync(path.join(projectRoot, 'js', 'supplier_inventory.js'), 'utf8');
  assert.ok(suppJs.includes('cec_proyector_epson'), 'supplier_inventory.js debe incluir proyectores Epson');
  assert.ok(suppJs.includes("'proyector'"), 'allowedConcepts debe admitir proyector');

  let mockDatabase = [];
  let window = { mockDatabase, FutunetData: { readyPromise: Promise.resolve() } };
  eval(suppJs);

  const feeds = window.supplierInventory.feeds.cecomsa;
  assert.ok(feeds.length >= 2, 'cecomsa feed debe tener al menos 2 proyectores');

  const normalized = feeds.map((item, idx) => window.supplierInventory.normalizeSupplierProduct('cecomsa', item, idx));
  assert.ok(normalized.every(p => p !== null), 'Todos los proyectores deben normalizarse válidamente');
  assert.ok(normalized.some(p => p.title.toLowerCase().includes('proyector')), 'Debe haber productos con título proyector');
});

test('Mejora demandada por usuarios: filtros rápidos de marcas y disponibilidad en smartphones (catalogo.html, catalog.js, catalog.css, SUG-M5204)', () => {
  // catalogo.html
  const catHtml = fs.readFileSync(path.join(projectRoot, 'catalogo.html'), 'utf8');
  assert.ok(catHtml.includes('id="catalog-quick-bar"'), 'catalogo.html debe tener el contenedor #catalog-quick-bar');
  assert.ok(catHtml.includes('id="catalog-quick-chips"'), 'catalogo.html debe tener #catalog-quick-chips para píldoras horizontales');
  assert.ok(catHtml.includes('id="mobile-sheet-brand-chips"'), 'catalogo.html debe tener #mobile-sheet-brand-chips en el panel móvil');

  // css/catalog.css
  const catCss = fs.readFileSync(path.join(projectRoot, 'css', 'catalog.css'), 'utf8');
  assert.ok(catCss.includes('.catalog-quick-bar'), 'catalog.css debe definir estilos para .catalog-quick-bar');
  assert.ok(catCss.includes('.catalog-quick-chips-scroll'), 'catalog.css debe definir scroll horizontal .catalog-quick-chips-scroll');
  assert.ok(catCss.includes('.catalog-chip'), 'catalog.css debe definir estilos de chips táctiles .catalog-chip');
  assert.ok(catCss.includes('.catalog-chip--avail'), 'catalog.css debe definir píldoras de disponibilidad .catalog-chip--avail');

  // js/catalog.js
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes('renderQuickFilterChips'), 'catalog.js debe incluir renderQuickFilterChips');
  assert.ok(catJs.includes('syncQuickFilterChips'), 'catalog.js debe sincronizar píldoras con syncQuickFilterChips');
  assert.ok(catJs.includes('data-quick-brand'), 'catalog.js debe soportar data-quick-brand');
  assert.ok(catJs.includes('data-quick-avail'), 'catalog.js debe soportar data-quick-avail');

  // seed-suggestions.cjs y suggestions.js con estado implemented
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M5204'") && seedCjs.includes("status: 'implemented'"), 'SUG-M5204 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes("title: 'Filtro rápido por marcas y disponibilidad en smartphones'") && sugJs.includes("status: 'implemented'"), 'SUG-M5204 debe figurar como implemented en suggestions.js');
});


