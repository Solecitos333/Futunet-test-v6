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

test('Mejora demandada por usuarios: Librero de madera en catálogo y búsquedas (SUG-L4920)', () => {
  const code = fs.readFileSync(path.join(projectRoot, 'js', 'supplier_inventory.js'), 'utf8');
  let window = {};
  var mockDatabase = [];
  eval(code);

  const catalog = window.supplierInventory.getMergedCatalog();
  const librero = catalog.find(p => p.id === 'mob_oficina_7');
  assert.ok(librero, 'Debe existir el producto mob_oficina_7 en el catálogo');
  assert.ok(librero.title.toLowerCase().includes('librero de madera'), 'mob_oficina_7 debe titularse Librero de madera');
  assert.strictEqual(librero.category, 'Mobiliario', 'mob_oficina_7 debe pertenecer a categoría Mobiliario');

  // Búsqueda por término "librero"
  const searchResults = catalog.filter(p => {
    const text = ((p.title || '') + ' ' + (p.desc || '')).toLowerCase();
    return text.includes('librero');
  });
  assert.ok(searchResults.length >= 1, 'Debe haber al menos 1 resultado para búsqueda de librero');
  assert.strictEqual(searchResults[0].id, 'mob_oficina_7');

  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L4920'") && seedCjs.includes("status: 'implemented'"), 'SUG-L4920 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes("Libreros de madera ejecutivos para oficina en el catálogo"), 'Libreros de madera debe figurar en el muro de suggestions.js');
});

test('Mejora demandada por usuarios: Prioridad de marcas TGM y Mini-Split en catálogo (SUG-T1802)', () => {
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'TGM'"), 'catalog.js debe priorizar la marca TGM en priorityList');

  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T1802'") && seedCjs.includes("status: 'implemented'"), 'SUG-T1802 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes("Aires acondicionados TGM Mini-Split"), 'TGM Mini-Split debe figurar en el muro de suggestions.js');
});

test('Mejora demandada por usuarios: Botón de copiar código de seguimiento y respuesta rápida a solicitudes (SUG-B6410)', () => {
  // Botón de copiado en sugerencias.html
  const sugHtml = fs.readFileSync(path.join(projectRoot, 'sugerencias.html'), 'utf8');
  assert.ok(sugHtml.includes('id="sug-copy-code-btn"'), 'sugerencias.html debe incluir #sug-copy-code-btn');

  // Lógica de copiado y extracción en suggestions.js
  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('initCopyCode'), 'suggestions.js debe incluir función initCopyCode');
  assert.ok(sugJs.includes('/SUG-[A-Z0-9]{5}/i'), 'suggestions.js debe admitir regex para códigos SUG');

  // Botones de WhatsApp y Correo para solicitudes de servicio en admin.html y admin-panel.js
  const adminHtml = fs.readFileSync(path.join(projectRoot, 'admin.html'), 'utf8');
  assert.ok(adminHtml.includes('id="sr-whatsapp-btn"'), 'admin.html debe tener botón WhatsApp en modal de servicio');
  assert.ok(adminHtml.includes('id="sr-email-btn"'), 'admin.html debe tener botón Correo en modal de servicio');

  const adminJs = fs.readFileSync(path.join(projectRoot, 'js', 'admin-panel.js'), 'utf8');
  assert.ok(adminJs.includes('sr-whatsapp-btn'), 'admin-panel.js debe configurar el botón WhatsApp');
  assert.ok(adminJs.includes('sr-email-btn'), 'admin-panel.js debe configurar el botón Correo');

  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-B6410'") && seedCjs.includes("status: 'implemented'"), 'SUG-B6410 debe figurar como implemented en seed-suggestions.cjs');
});

test('Mejora demandada por usuarios: Disponibilidad de impresoras multifuncionales y térmicas POS (SUG-P5512)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P5512'") && seedCjs.includes("status: 'implemented'"), 'SUG-P5512 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('Impresoras multifuncionales EcoTank y térmicas POS'), 'Impresoras multifuncionales debe figurar en el muro de suggestions.js');

  const fixesJs = fs.readFileSync(path.join(projectRoot, 'js', 'image_fixes.js'), 'utf8');
  assert.ok(fixesJs.includes('prod_ev8mssce4') && fixesJs.includes('prod_tk6it44v0'), 'image_fixes.js debe mapear imagen y categoría para Epson y 2Connect');

  const suppJs = fs.readFileSync(path.join(projectRoot, 'js', 'supplier_inventory.js'), 'utf8');
  assert.ok(suppJs.includes('impresora') && suppJs.includes('Impresoras y Consumibles'), 'supplier_inventory.js debe inferir categoría de impresoras');
});

test('Mejora demandada por usuarios: Disponibilidad de Apple AirPods y audio de calidad (SUG-A7291)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-A7291'") && seedCjs.includes("status: 'implemented'"), 'SUG-A7291 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('Apple AirPods y auriculares'), 'Apple AirPods debe figurar en el muro de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('prod_yny47xadr'), 'backup_data.js debe contener prod_yny47xadr');
  assert.ok(backupJs.includes('2.ª generación'), 'backup_data.js debe tener la codificación limpia UTF-8 para AirPods');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'Apple'"), 'catalog.js debe incluir Apple en priorityList');
});

test('Mejora demandada por usuarios: Teclados de oficina Dell USB y periféricos cableados (SUG-K3844)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-K3844'") && seedCjs.includes("status: 'implemented'"), 'SUG-K3844 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('Teclados cableados Dell USB'), 'Teclados cableados Dell USB debe figurar en el muro de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('prod_9p6f6zzh6'), 'backup_data.js debe contener prod_9p6f6zzh6');

  const fixesJs = fs.readFileSync(path.join(projectRoot, 'js', 'image_fixes.js'), 'utf8');
  assert.ok(fixesJs.includes('prod_9p6f6zzh6'), 'image_fixes.js debe registrar marca DELL y categoría para prod_9p6f6zzh6');
});

test('Mejora demandada por usuarios: Disponibilidad y visibilidad de escritorios ejecutivos blancos y mobiliario corporativo (SUG-E2835)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-E2835'") && seedCjs.includes("status: 'implemented'"), 'SUG-E2835 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('Escritorios ejecutivos blancos y mobiliario corporativo'), 'Escritorios ejecutivos debe figurar en el muro de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('mob_oficina_1'), 'backup_data.js debe contener mob_oficina_1');
  assert.ok(backupJs.includes('Escritorio ejecutivo blanco con panel frontal'), 'mob_oficina_1 debe tener título exacto de escritorio');
  assert.ok(!backupJs.includes('"title": "Silla Ergonómica Ejecutiva"'), 'mob_oficina_1 no debe tener título erróneo de silla');

  const suppJs = fs.readFileSync(path.join(projectRoot, 'js', 'supplier_inventory.js'), 'utf8');
  assert.ok(suppJs.includes('mob_oficina_1') && suppJs.includes('improoficinas'), 'supplier_inventory.js debe incluir mob_oficina_1 en improoficinas');
});

test('Mejora demandada por usuarios: Laptops corporativas Dell Latitude serie 5000 y 7000 (SUG-L7390)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L7390'") && seedCjs.includes("status: 'implemented'"), 'SUG-L7390 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('Laptops corporativas Dell Latitude'), 'Laptops corporativas Dell Latitude debe figurar en el muro de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('lap_dell_lat_5330'), 'backup_data.js debe contener lap_dell_lat_5330');
  assert.ok(backupJs.includes('lap_dell_lat_7390_touch'), 'backup_data.js debe contener lap_dell_lat_7390_touch');
  assert.ok(backupJs.includes('lap_dell_lat_5410'), 'backup_data.js debe contener lap_dell_lat_5410');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'laptops', '06-dell-latitude-7390-touch.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen de la Dell Latitude 7390 Touch debe existir en disco');
});

test('Mejora demandada por usuarios: Componentes Gaming de alto rendimiento y refrigeración 360 (SUG-G9420)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-G9420'") && seedCjs.includes("status: 'implemented'"), 'SUG-G9420 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('Componentes Gaming de alto rendimiento'), 'Componentes Gaming debe figurar en el muro de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('gm_cooler_tryx_panorama_360'), 'backup_data.js debe contener TRYX Panorama 360');
  assert.ok(backupJs.includes('gm_cooler_nzxt_kraken_elite_360'), 'backup_data.js debe contener NZXT Kraken Elite 360');
  assert.ok(backupJs.includes('gm_psu_msi_mag_a1000gs'), 'backup_data.js debe contener fuente MSI 1000W');

  const coolerImg = path.join(projectRoot, 'img', 'gaming', 'componentes', 'cooler-tryx-panorama-360-argb.jpg');
  assert.ok(fs.existsSync(coolerImg), 'La imagen del cooler TRYX Panorama debe existir en disco');
});




