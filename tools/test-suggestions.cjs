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

test('Mejora demandada por usuarios: Computadoras de escritorio Dell OptiPlex SFF Core i5 (SUG-D3050)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-D3050'") && seedCjs.includes("status: 'implemented'"), 'SUG-D3050 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-D3050') && sugJs.includes('Dell OptiPlex SFF'), 'SUG-D3050 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('pc_dell_optiplex_7050_sff'), 'backup_data.js debe contener pc_dell_optiplex_7050_sff');
  assert.ok(backupJs.includes('pc_dell_optiplex_5050_sff'), 'backup_data.js debe contener pc_dell_optiplex_5050_sff');
  assert.ok(backupJs.includes('pc_dell_optiplex_3050_sff'), 'backup_data.js debe contener pc_dell_optiplex_3050_sff');

  const imgDesktop = path.join(projectRoot, 'img', 'productos', 'dell-optiplex-i7.jpg');
  assert.ok(fs.existsSync(imgDesktop), 'La imagen de la Dell OptiPlex SFF debe existir en disco');
});

test('Mejora demandada por usuarios: Monitores LG y pantallas IPS FHD (SUG-M2480) y filtro de marca LG', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M2480'") && seedCjs.includes("status: 'implemented'"), 'SUG-M2480 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M2480') && /monitores\s+LG/i.test(sugJs), 'SUG-M2480 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('mon_lg_24mp400_b_fhd'), 'backup_data.js debe contener mon_lg_24mp400_b_fhd');
  assert.ok(backupJs.includes('mon_lg_27mp400_b_fhd'), 'backup_data.js debe contener mon_lg_27mp400_b_fhd');
  assert.ok(backupJs.includes('mon_dell_se2422h_fhd'), 'backup_data.js debe contener mon_dell_se2422h_fhd');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("lg: 'LG'"), 'catalog.js debe mapear lg a LG en preferredNames');
  assert.ok(catJs.includes("'LG'"), 'catalog.js debe incluir LG en priorityList');
});

test('Mejora demandada por usuarios: Cámaras de videovigilancia Hikvision y kits DVR (SUG-H7200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-H7200'") && seedCjs.includes("status: 'implemented'"), 'SUG-H7200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-H7200') && sugJs.includes('Hikvision ColorVu'), 'SUG-H7200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('sec_hikvision_cam_colorvu_1080p'), 'backup_data.js debe contener sec_hikvision_cam_colorvu_1080p');
  assert.ok(backupJs.includes('sec_hikvision_kit_dvr_4ch'), 'backup_data.js debe contener sec_hikvision_kit_dvr_4ch');

  const camImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'camara-ip.jpg');
  assert.ok(fs.existsSync(camImg), 'La imagen de la cámara Hikvision ColorVu debe existir en disco');

  const dvrImg = path.join(projectRoot, 'img', 'productos', 'hikvision-dvr-8ch.webp');
  assert.ok(fs.existsSync(dvrImg), 'La imagen del DVR Hikvision debe existir en disco');
});

test('Filtros de categoría del muro comunitario en sugerencias.html, CSS y JS', () => {
  const sugHtml = fs.readFileSync(path.join(projectRoot, 'sugerencias.html'), 'utf8');
  assert.ok(sugHtml.includes('id="sug-comm-filters"'), 'sugerencias.html debe contener el contenedor sug-comm-filters');
  assert.ok(sugHtml.includes('data-cat="catalog_products"'), 'sugerencias.html debe tener el botón para productos');

  const sugCss = fs.readFileSync(path.join(projectRoot, 'css', 'suggestions.css'), 'utf8');
  assert.ok(sugCss.includes('.sug-comm-filters'), 'suggestions.css debe contener estilos para .sug-comm-filters');
  assert.ok(sugCss.includes('.sug-comm-filter-btn.is-active'), 'suggestions.css debe contener estilos para botones activos');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('initCommunityFilters'), 'suggestions.js debe contener la función initCommunityFilters');
  assert.ok(sugJs.includes('filterCommunityByCategory'), 'suggestions.js debe contener la función filterCommunityByCategory');
});

test('Mejora demandada por usuarios: Laptop Dell Latitude 5480 Core i5 (SUG-L5480)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L5480'") && seedCjs.includes("status: 'implemented'"), 'SUG-L5480 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L5480') && sugJs.includes('Dell Latitude 5480'), 'SUG-L5480 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('lap_dell_lat_5480'), 'backup_data.js debe contener lap_dell_lat_5480');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'laptops', '17-dell-latitude-5480.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen de la Dell Latitude 5480 debe existir en disco');
});

test('Mejora demandada por usuarios: Laptop ejecutiva Dell Latitude 5330 Core i7 12.ª Gen (SUG-L5330)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L5330'") && seedCjs.includes("status: 'implemented'"), 'SUG-L5330 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L5330') && sugJs.includes('Dell Latitude 5330'), 'SUG-L5330 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('lap_dell_lat_5330'), 'backup_data.js debe contener lap_dell_lat_5330');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'laptops', '03-dell-latitude-5330.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen de la Dell Latitude 5330 debe existir en disco');
});

test('Mejora demandada por usuarios: Suministros de oficina, papelería corporativa y equipamiento B2B (SUG-S4120)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S4120'") && seedCjs.includes("status: 'implemented'"), 'SUG-S4120 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S4120') && sugJs.includes('suministros de oficina'), 'SUG-S4120 debe figurar en el muro y lista canónica de suggestions.js');

  const mobHtml = fs.readFileSync(path.join(projectRoot, 'mobiliario-suministros.html'), 'utf8');
  assert.ok(mobHtml.includes('id="service-request-form"'), 'mobiliario-suministros.html debe contener el formulario service-request-form');
  assert.ok(mobHtml.includes('name="_hp_security_check"'), 'mobiliario-suministros.html debe contener honeypot antispam');
  assert.ok(mobHtml.includes('id="req-privacy-consent"'), 'mobiliario-suministros.html debe contener consentimiento de privacidad');
});

test('Mejora demandada por usuarios: Proyectores Epson, pantallas retráctiles y climatización TGM (SUG-P9240)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P9240'") && seedCjs.includes("status: 'implemented'"), 'SUG-P9240 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P9240') && sugJs.includes('Epson PowerLite'), 'SUG-P9240 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('cec_proyector_epson_powerlite_e20'), 'backup_data.js debe contener cec_proyector_epson_powerlite_e20');
  assert.ok(backupJs.includes('prod_pantalla_proyeccion_100'), 'backup_data.js debe contener prod_pantalla_proyeccion_100');
  assert.ok(backupJs.includes('tgm_mwfot_18000_btu'), 'backup_data.js debe contener tgm_mwfot_18000_btu');

  const epsonImg = path.join(projectRoot, 'img', 'productos', 'epson-co-fh02.jpg');
  assert.ok(fs.existsSync(epsonImg), 'La imagen del proyector Epson debe existir en disco');

  const tgmImg = path.join(projectRoot, 'img', 'productos', 'tgm', 'tgm-fixed-speed-18000-btu.webp');
  assert.ok(fs.existsSync(tgmImg), 'La imagen del aire acondicionado TGM debe existir en disco');

  // Validar scoring en catalog.js
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes('queryVariants.some'), 'catalog.js debe utilizar variantes de stem para búsquedas en plural');
  assert.ok(catJs.includes('titleMatchesDirectly'), 'catalog.js debe evaluar titleMatchesDirectly');
});

test('Mejora demandada por usuarios: Switches empresariales Cisco y puntos de acceso Ubiquiti UniFi (SUG-R7520)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-R7520'") && seedCjs.includes("status: 'implemented'"), 'SUG-R7520 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-R7520') && sugJs.includes('Cisco Business'), 'SUG-R7520 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('cisco_cbs110_16t'), 'backup_data.js debe contener cisco_cbs110_16t');
  assert.ok(backupJs.includes('cisco_cbs250_24p'), 'backup_data.js debe contener cisco_cbs250_24p');
  assert.ok(backupJs.includes('ubiquiti_unifi_u6_plus'), 'backup_data.js debe contener ubiquiti_unifi_u6_plus');
  assert.ok(backupJs.includes('ubiquiti_unifi_lite_8_poe'), 'backup_data.js debe contener ubiquiti_unifi_lite_8_poe');

  const ciscoImg = path.join(projectRoot, 'img', 'brands-preview', 'cisco.webp');
  assert.ok(fs.existsSync(ciscoImg), 'La imagen preview de Cisco debe existir en disco');

  const ubiImg = path.join(projectRoot, 'img', 'brands-preview', 'ubiquiti.webp');
  assert.ok(fs.existsSync(ubiImg), 'La imagen preview de Ubiquiti debe existir en disco');

  // Validar marcas preferidas y chips en catalog.js
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("cisco: 'Cisco'"), 'catalog.js debe incluir Cisco en preferredNames');
  assert.ok(catJs.includes("ubiquiti: 'Ubiquiti'"), 'catalog.js debe incluir Ubiquiti en preferredNames');
  assert.ok(catJs.includes("'Cisco'") && catJs.includes("'Ubiquiti'"), 'catalog.js debe incluir Cisco y Ubiquiti en priorityList');
});

test('Mejora demandada por usuarios: Selección interactiva de horario y fecha para visitas técnicas (SUG-N3210)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N3210'") && seedCjs.includes("status: 'implemented'"), 'SUG-N3210 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N3210') && sugJs.includes('visitas técnicas'), 'SUG-N3210 debe figurar en el muro y lista canónica de suggestions.js');

  const internetHtml = fs.readFileSync(path.join(projectRoot, 'internet.html'), 'utf8');
  assert.ok(internetHtml.includes('id="hiring-modal"') || internetHtml.includes('hiring-step'), 'internet.html debe contar con flujo de contratación');
});

test('Mejora demandada por usuarios: Sillas ergonómicas ejecutivas y mobiliario de oficina (SUG-S8320)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S8320'") && seedCjs.includes("status: 'implemented'"), 'SUG-S8320 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S8320') && sugJs.includes('Sillas Ergonómicas Ejecutivas'), 'SUG-S8320 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('mob_silla_ergonomica_ejecutiva'), 'backup_data.js debe contener mob_silla_ergonomica_ejecutiva');
  assert.ok(backupJs.includes('Silla de Oficina Ergonómica de Malla Negra'), 'backup_data.js debe contener Silla de Oficina Ergonómica de Malla Negra corregida');
  assert.ok(!backupJs.includes('Silla De Mayita Negrsa'), 'backup_data.js no debe contener la falta ortográfica Silla De Mayita Negrsa');
  assert.ok(backupJs.includes('Sillas de Visitas con Brazos para Oficina'), 'backup_data.js debe contener Sillas de Visitas con Brazos');

  const sillonImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'sillon-ejecutivo.jpg');
  assert.ok(fs.existsSync(sillonImg), 'La imagen del sillón ejecutivo debe existir en disco');

  const visitaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'silla-visita.jpg');
  assert.ok(fs.existsSync(visitaImg), 'La imagen de la silla de visita debe existir en disco');
});

test('Mejora demandada por usuarios: Sistemas UPS y protección eléctrica Forza (SUG-U6140)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U6140'") && seedCjs.includes("status: 'implemented'"), 'SUG-U6140 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U6140') && sugJs.includes('Sistemas UPS'), 'SUG-U6140 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('ups_forza_nt1002'), 'backup_data.js debe contener ups_forza_nt1002');
  assert.ok(backupJs.includes('prod_bh5vuj6df'), 'backup_data.js debe contener prod_bh5vuj6df');
  assert.ok(backupJs.includes('prod_u9fo22vhb'), 'backup_data.js debe contener prod_u9fo22vhb');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("forza: 'Forza'"), 'catalog.js debe incluir Forza en preferredNames');
  assert.ok(catJs.includes("'Forza'"), 'catalog.js debe incluir Forza en priorityList');

  const ups600Img = path.join(projectRoot, 'img', 'productos', 'hikvision-ups600.jpg');
  assert.ok(fs.existsSync(ups600Img), 'La imagen del UPS 600VA debe existir en disco');

  const ups1000Img = path.join(projectRoot, 'img', 'productos', 'hikvision-ups1000.jpg');
  assert.ok(fs.existsSync(ups1000Img), 'La imagen del UPS 1000VA debe existir en disco');
});

test('Mejora demandada por usuarios: Insignias de conteo y filtros dinámicos en Muro Comunitario (SUG-C2850)', () => {
  const sugHtml = fs.readFileSync(path.join(projectRoot, 'sugerencias.html'), 'utf8');
  assert.ok(sugHtml.includes('id="sug-count-all"'), 'sugerencias.html debe contener el badge id="sug-count-all"');
  assert.ok(sugHtml.includes('id="sug-count-products"'), 'sugerencias.html debe contener el badge id="sug-count-products"');
  assert.ok(sugHtml.includes('id="sug-count-web"'), 'sugerencias.html debe contener el badge id="sug-count-web"');
  assert.ok(sugHtml.includes('id="sug-count-services"'), 'sugerencias.html debe contener el badge id="sug-count-services"');

  const sugCss = fs.readFileSync(path.join(projectRoot, 'css', 'suggestions.css'), 'utf8');
  assert.ok(sugCss.includes('.sug-comm-count-badge'), 'suggestions.css debe definir estilos para .sug-comm-count-badge');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('updateCommunityFilterCounts'), 'suggestions.js debe contener la función updateCommunityFilterCounts');
  assert.ok(sugJs.includes('SUG-C2850'), 'suggestions.js debe incluir SUG-C2850 en la lista canónica');

  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C2850'") && seedCjs.includes("status: 'implemented'"), 'SUG-C2850 debe figurar como implemented en seed-suggestions.cjs');
});

test('Mejora demandada por usuarios: Lectores de Códigos de Barra 1D/2D y Gavetas de Dinero POS (SUG-P8210)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P8210'") && seedCjs.includes("status: 'implemented'"), 'SUG-P8210 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P8210') && sugJs.includes('Códigos de Barra 1D/2D'), 'SUG-P8210 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('pos_lector_codigo_barra_2d'), 'backup_data.js debe contener pos_lector_codigo_barra_2d');
  assert.ok(backupJs.includes('pos_gaveta_dinero_metalica'), 'backup_data.js debe contener pos_gaveta_dinero_metalica');

  const barcodeImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'pos-lector-barcode.webp');
  assert.ok(fs.existsSync(barcodeImg), 'La imagen del lector de código de barras debe existir en disco');

  const drawerImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'pos-gaveta-dinero.webp');
  assert.ok(fs.existsSync(drawerImg), 'La imagen de la gaveta de dinero debe existir en disco');
});

test('Mejora demandada por usuarios: Cámaras Dahua 1080p y DVR XVR Cooper (SUG-D4910)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-D4910'") && seedCjs.includes("status: 'implemented'"), 'SUG-D4910 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-D4910') && sugJs.includes('Dahua HDCVI 1080p'), 'SUG-D4910 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('cctv_dahua_camara_domo_1080p'), 'backup_data.js debe contener cctv_dahua_camara_domo_1080p');
  assert.ok(backupJs.includes('cctv_dahua_camara_bala_1080p'), 'backup_data.js debe contener cctv_dahua_camara_bala_1080p');
  assert.ok(backupJs.includes('cctv_dahua_xvr_cooper_4ch'), 'backup_data.js debe contener cctv_dahua_xvr_cooper_4ch');

  const domoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dahua-camara-domo.webp');
  assert.ok(fs.existsSync(domoImg), 'La imagen de la cámara domo Dahua debe existir en disco');

  const balaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dahua-camara-bala.jpg');
  assert.ok(fs.existsSync(balaImg), 'La imagen de la cámara bala Dahua debe existir en disco');

  const dvrImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dahua-xvr-cooper.jpg');
  assert.ok(fs.existsSync(dvrImg), 'La imagen del XVR Dahua debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("dahua: 'Dahua'"), 'catalog.js debe incluir Dahua en preferredNames');
  assert.ok(catJs.includes("'Dahua'"), 'catalog.js debe incluir Dahua en priorityList');
});

test('Mejora demandada por usuarios: Optimización de búsqueda por sinónimos (scanner, cajón, bobinas) (SUG-K9530)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-K9530'") && seedCjs.includes("status: 'implemented'"), 'SUG-K9530 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-K9530') && sugJs.includes('Optimización del buscador'), 'SUG-K9530 debe figurar en el muro y lista canónica de suggestions.js');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'scanner'"), 'catalog.js debe incluir scanner en stem variants');
  assert.ok(catJs.includes("'cajon'"), 'catalog.js debe incluir cajon en stem variants');
  assert.ok(catJs.includes("'bobina'"), 'catalog.js debe incluir bobina en stem variants');
});

test('Mejora demandada por usuarios: Terminal Biométrica ZKTeco y Reloj Ponchador (SUG-Z5180)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-Z5180'") && seedCjs.includes("status: 'implemented'"), 'SUG-Z5180 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-Z5180') && sugJs.includes('terminales biométricas ZKTeco'), 'SUG-Z5180 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('zkteco_mb20_terminal_biometrica'), 'backup_data.js debe contener zkteco_mb20_terminal_biometrica');

  const zkImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'zkteco-mb20-biometrico.webp');
  assert.ok(fs.existsSync(zkImg), 'La imagen del biométrico ZKTeco debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("zkteco: 'ZKTeco'"), 'catalog.js debe incluir ZKTeco en preferredNames');
  assert.ok(catJs.includes("'ZKTeco'"), 'catalog.js debe incluir ZKTeco en priorityList');
  assert.ok(catJs.includes("'ponchador'"), 'catalog.js debe incluir ponchador en stem variants');
});

test('Mejora demandada por usuarios: Discos Duros WD Purple para Videovigilancia (SUG-W3250)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-W3250'") && seedCjs.includes("status: 'implemented'"), 'SUG-W3250 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-W3250') && sugJs.includes('WD Purple'), 'SUG-W3250 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('cctv_wd_purple_2tb_hdd'), 'backup_data.js debe contener cctv_wd_purple_2tb_hdd');

  const purpleImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'wd-purple-2tb.webp');
  assert.ok(fs.existsSync(purpleImg), 'La imagen del disco duro WD Purple debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'Western Digital'"), 'catalog.js debe incluir Western Digital en priorityList');
  assert.ok(catJs.includes("'purple'"), 'catalog.js debe incluir purple en stem variants');
});

test('Mejora demandada por usuarios: Gabinetes de Pared y Racks de 9U con cerradura (SUG-R6090)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-R6090'") && seedCjs.includes("status: 'implemented'"), 'SUG-R6090 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-R6090') && sugJs.includes('Gabinetes de pared'), 'SUG-R6090 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_gabinete_rack_9u'), 'backup_data.js debe contener redes_gabinete_rack_9u');

  const rackImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'gabinete-9u.jpg');
  assert.ok(fs.existsSync(rackImg), 'La imagen del gabinete de pared 9U debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("/gabinete.*(9u|12u|42u|red|pared)|rack/i.test(title)"), 'catalog.js debe priorizar gabinetes y racks');
});

test('Mejora demandada por usuarios: Cerraduras Electromagnéticas 600 lbs y Pulsador No Touch Infrarrojo (SUG-C600M)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C600M'") && seedCjs.includes("status: 'implemented'"), 'SUG-C600M debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C600M') && sugJs.includes('Cerradura Electromagnética'), 'SUG-C600M debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('sec_boton_salida_no_touch'), 'backup_data.js debe contener sec_boton_salida_no_touch');
  assert.ok(backupJs.includes('prod_8ymxsbgt5'), 'backup_data.js debe contener cerradura prod_8ymxsbgt5');

  const btnImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'boton-salida-notouch.webp');
  assert.ok(fs.existsSync(btnImg), 'La imagen del botón No Touch debe existir en disco');

  const lockImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'cerradura-magnetica.jpg');
  assert.ok(fs.existsSync(lockImg), 'La imagen de la cerradura electromagnética debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'electroiman'"), 'catalog.js debe incluir electroiman en stem variants');
  assert.ok(catJs.includes("'chapa'"), 'catalog.js debe incluir chapa en stem variants');
  assert.ok(catJs.includes("'cerradura'"), 'catalog.js debe incluir cerradura en stem variants');
  assert.ok(catJs.includes("'notouch'"), 'catalog.js debe incluir notouch en stem variants');
});

test('Mejora demandada por usuarios: Bobinas de Cable UTP Cat 6 100% Cobre Puro 305m (SUG-B305C)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-B305C'") && seedCjs.includes("status: 'implemented'"), 'SUG-B305C debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-B305C') && sugJs.includes('Bobina de Cable UTP Cat 6'), 'SUG-B305C debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_cable_utp_cat6_cobre_305m'), 'backup_data.js debe contener redes_cable_utp_cat6_cobre_305m');

  const utpImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'bobina-utp-cat6.webp');
  assert.ok(fs.existsSync(utpImg), 'La imagen de la bobina de cable UTP Cat 6 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'cobre'"), 'catalog.js debe incluir cobre en stem variants');
  assert.ok(catJs.includes("'rollo'"), 'catalog.js debe incluir rollo en stem variants');
});

test('Mejora demandada por usuarios: Red Mesh Wi-Fi 6 TP-Link Deco X20 AX1800 (SUG-T8260)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T8260'") && seedCjs.includes("status: 'implemented'"), 'SUG-T8260 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T8260') && sugJs.includes('TP-Link Deco X20'), 'SUG-T8260 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_tplink_deco_x20_mesh'), 'backup_data.js debe contener redes_tplink_deco_x20_mesh');

  const decoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tplink-deco-x20.webp');
  assert.ok(fs.existsSync(decoImg), 'La imagen del sistema Mesh Deco X20 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'deco'"), 'catalog.js debe incluir deco en stem variants');
  assert.ok(catJs.includes("'mesh'"), 'catalog.js debe incluir mesh en stem variants');
});

test('Mejora demandada por usuarios: Patch Panels de 24 Puertos Cat 6 y Patch Cords Gigabit (SUG-P2400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P2400'") && seedCjs.includes("status: 'implemented'"), 'SUG-P2400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P2400') && sugJs.includes('Patch Panels de 24 Puertos'), 'SUG-P2400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_patch_panel_24p_cat6'), 'backup_data.js debe contener redes_patch_panel_24p_cat6');
  assert.ok(backupJs.includes('redes_patch_cord_cat6_2m'), 'backup_data.js debe contener redes_patch_cord_cat6_2m');

  const panelImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'patch-panel-24p.webp');
  assert.ok(fs.existsSync(panelImg), 'La imagen del patch panel de 24 puertos debe existir en disco');

  const cordImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'patch-cord-cat6.webp');
  assert.ok(fs.existsSync(cordImg), 'La imagen del patch cord Cat 6 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'patch'"), 'catalog.js debe incluir patch en stem variants');
  assert.ok(catJs.includes("'latiguillo'"), 'catalog.js debe incluir latiguillo en stem variants');
  assert.ok(catJs.includes("/(patch.*panel|panel.*parcheo)/i.test(normalizedQuery)"), 'catalog.js debe priorizar patch panels');
  assert.ok(catJs.includes("/(patch.*cord|patchcord|latiguillo)/i.test(normalizedQuery)"), 'catalog.js debe priorizar patch cords');
});

test('Mejora demandada por usuarios: Access Points Wi-Fi 6 y Búsqueda de Puntos de Acceso (SUG-A1200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-A1200'") && seedCjs.includes("status: 'implemented'"), 'SUG-A1200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-A1200') && sugJs.includes('Puntos de Acceso Wi-Fi'), 'SUG-A1200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('ubiquiti_unifi_u6_plus'), 'backup_data.js debe contener ubiquiti_unifi_u6_plus');
  assert.ok(backupJs.includes('Access Point WiFi 6'), 'ubiquiti_unifi_u6_plus debe incluir Access Point en el título');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'access'"), 'catalog.js debe incluir access en stem variants');
  assert.ok(catJs.includes("'point'"), 'catalog.js debe incluir point en stem variants');
  assert.ok(catJs.includes("'ap'"), 'catalog.js debe incluir ap en stem variants');
  assert.ok(catJs.includes("/(access.*point|\\bap\\b|punto.*acceso|unifi.*u6)/i.test(normalizedQuery)"), 'catalog.js debe priorizar access points');
});

test('Mejora demandada por usuarios: Conectores RJ45 Cat 6 con Botas Protectoras (SUG-C4500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C4500'") && seedCjs.includes("status: 'implemented'"), 'SUG-C4500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C4500') && sugJs.includes('Conectores RJ45 Cat 6'), 'SUG-C4500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_conectores_rj45_cat6_pack'), 'backup_data.js debe contener redes_conectores_rj45_cat6_pack');

  const connImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'conectores-rj45-cat6.webp');
  assert.ok(fs.existsSync(connImg), 'La imagen de los conectores RJ45 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'conector'"), 'catalog.js debe incluir conector en stem variants');
  assert.ok(catJs.includes("'plug'"), 'catalog.js debe incluir plug en stem variants');
  assert.ok(catJs.includes("/(conector|plug|terminales).*rj45|\\b(conector|conectores|plugs?)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar conectores RJ45');
});

test('Mejora demandada por usuarios: Kit de Herramientas de Red: Crimpadora RJ45 y Tester de Cable (SUG-T3040)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T3040'") && seedCjs.includes("status: 'implemented'"), 'SUG-T3040 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T3040') && sugJs.includes('Crimpadora RJ45 Multifunción'), 'SUG-T3040 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_crimpadora_rj45_tester_kit'), 'backup_data.js debe contener redes_crimpadora_rj45_tester_kit');

  const toolImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'crimpadora-tester-kit.webp');
  assert.ok(fs.existsSync(toolImg), 'La imagen del kit de crimpadora y tester debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'crimpadora'"), 'catalog.js debe incluir crimpadora en stem variants');
  assert.ok(catJs.includes("'tester'"), 'catalog.js debe incluir tester en stem variants');
  assert.ok(catJs.includes("/\\b(crimpadora|crimpador|crimpar|tester|probador|pelacable|pelacables)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar kit de herramientas de red');
});

test('Mejora demandada por usuarios: Cámaras Wi-Fi Ezviz C6N y H3c en Catálogo y Marca (SUG-E3600)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-E3600'") && seedCjs.includes("status: 'implemented'"), 'SUG-E3600 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-E3600') && sugJs.includes('Cámaras Wi-Fi de Seguridad Ezviz'), 'SUG-E3600 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('cctv_ezviz_c6n_camara_wifi_360'), 'backup_data.js debe contener cctv_ezviz_c6n_camara_wifi_360');
  assert.ok(backupJs.includes('cctv_ezviz_h3c_camara_wifi_exterior'), 'backup_data.js debe contener cctv_ezviz_h3c_camara_wifi_exterior');

  const c6nImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ezviz-c6n.webp');
  assert.ok(fs.existsSync(c6nImg), 'La imagen de la cámara Ezviz C6N debe existir en disco');
  const h3cImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ezviz-h3c.webp');
  assert.ok(fs.existsSync(h3cImg), 'La imagen de la cámara Ezviz H3c debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ezviz'"), 'catalog.js debe incluir ezviz en stem variants');
  assert.ok(catJs.includes("'Ezviz'"), 'catalog.js debe incluir Ezviz en priorityList');
  assert.ok(catJs.includes("/\\b(ezviz|c6n|h3c)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar cámaras Ezviz y Wi-Fi');
});

test('Mejora demandada por usuarios: Optimización y Priorización de Terminales Biométricas (SUG-B9100)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-B9100'") && seedCjs.includes("status: 'implemented'"), 'SUG-B9100 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-B9100') && sugJs.includes('Terminales Biométricas'), 'SUG-B9100 debe figurar en el muro y lista canónica de suggestions.js');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("biometrico") && catJs.includes("biometrica"), 'catalog.js debe contemplar variantes biométricas');
  assert.ok(catJs.includes("terminal\\s+biometrica|reloj\\s+ponchador|facial|huella"), 'catalog.js debe priorizar terminales biométricas sobre cerraduras mecánicas');
});

test('Mejora demandada por usuarios: Routers MikroTik hEX y Balanceo Multi-WAN (SUG-M750G)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M750G'") && seedCjs.includes("status: 'implemented'"), 'SUG-M750G debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M750G') && sugJs.includes('Routers MikroTik hEX'), 'SUG-M750G debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_mikrotik_hex_rb750gr3'), 'backup_data.js debe contener redes_mikrotik_hex_rb750gr3');

  const mikrotikImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mikrotik-hex-rb750gr3.webp');
  assert.ok(fs.existsSync(mikrotikImg), 'La imagen del Router MikroTik hEX debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'mikrotik'"), 'catalog.js debe incluir mikrotik en stem variants');
  assert.ok(catJs.includes("'MikroTik'"), 'catalog.js debe incluir MikroTik en priorityList');
  assert.ok(catJs.includes("/\\b(mikrotik|routerboard|hex|rb750|rb750gr3|balanceador|balanceadores|multiwan)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar routers MikroTik y balanceadores');
});

test('Mejora demandada por usuarios: Combo Inalámbrico Logitech MK270 (SUG-L2700)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L2700'") && seedCjs.includes("status: 'implemented'"), 'SUG-L2700 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L2700') && sugJs.includes('Combo Teclado y Mouse Inalámbrico Logitech MK270'), 'SUG-L2700 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_logitech_mk270_combo_inalambrico'), 'backup_data.js debe contener oficina_logitech_mk270_combo_inalambrico');

  const mk270Img = path.join(projectRoot, 'img', 'productos', 'catalogo', 'logitech-mk270.webp');
  assert.ok(fs.existsSync(mk270Img), 'La imagen del combo Logitech MK270 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'logitech'"), 'catalog.js debe incluir logitech en stem variants');
  assert.ok(catJs.includes("'Logitech'"), 'catalog.js debe incluir Logitech en priorityList');
  assert.ok(catJs.includes("/\\b(teclado.*inalambrico|mouse.*inalambrico|combo.*teclado|combo.*inalambrico)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar combo inalámbrico');
});

test('Mejora demandada por usuarios: Cámara Web Logitech C920 HD Pro (SUG-W9200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-W9200'") && seedCjs.includes("status: 'implemented'"), 'SUG-W9200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-W9200') && sugJs.includes('Cámara Web Logitech C920 HD Pro'), 'SUG-W9200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_logitech_c920_webcam_hd_pro'), 'backup_data.js debe contener oficina_logitech_c920_webcam_hd_pro');

  const c920Img = path.join(projectRoot, 'img', 'productos', 'catalogo', 'logitech-c920.webp');
  assert.ok(fs.existsSync(c920Img), 'La imagen de la webcam Logitech C920 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'webcam'"), 'catalog.js debe incluir webcam en stem variants');
  assert.ok(catJs.includes("'c920'"), 'catalog.js debe incluir c920 en stem variants');
  assert.ok(catJs.includes("/\\b(logitech|mk270|c920|webcam|camara\\s+web)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Logitech y webcam C920');
});

test('Mejora demandada por usuarios: Laptop Corporativa Lenovo ThinkPad L14 (SUG-T1400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T1400'") && seedCjs.includes("status: 'implemented'"), 'SUG-T1400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T1400') && sugJs.includes('Lenovo ThinkPad L14'), 'SUG-T1400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_laptop_lenovo_thinkpad_l14'), 'backup_data.js debe contener oficina_laptop_lenovo_thinkpad_l14');

  const lenovoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'lenovo-thinkpad-l14.webp');
  assert.ok(fs.existsSync(lenovoImg), 'La imagen de la laptop Lenovo ThinkPad debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'lenovo'"), 'catalog.js debe incluir lenovo en stem variants');
  assert.ok(catJs.includes("'thinkpad'"), 'catalog.js debe incluir thinkpad en stem variants');
  assert.ok(catJs.includes("'Lenovo'"), 'catalog.js debe incluir Lenovo en priorityList');
  assert.ok(catJs.includes("/\\b(lenovo|thinkpad|ideapad|l14)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Lenovo y ThinkPad');
});

test('Mejora demandada por usuarios: Switch Gigabit Netgear GS308 (SUG-N308G)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N308G'") && seedCjs.includes("status: 'implemented'"), 'SUG-N308G debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N308G') && sugJs.includes('Netgear GS308'), 'SUG-N308G debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_switch_netgear_gs308_8p'), 'backup_data.js debe contener redes_switch_netgear_gs308_8p');

  const netgearImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'netgear-gs308.webp');
  assert.ok(fs.existsSync(netgearImg), 'La imagen del switch Netgear GS308 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'netgear'"), 'catalog.js debe incluir netgear en stem variants');
  assert.ok(catJs.includes("'gs308'"), 'catalog.js debe incluir gs308 en stem variants');
  assert.ok(catJs.includes("'Netgear'"), 'catalog.js debe incluir Netgear en priorityList');
  assert.ok(catJs.includes("/\\b(netgear|gs308)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Netgear GS308');
});

test('Mejora demandada por usuarios: Sistema UPS APC Schneider Electric BV1000 (SUG-S1000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S1000'") && seedCjs.includes("status: 'implemented'"), 'SUG-S1000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S1000') && sugJs.includes('APC Easy UPS BV1000I-MS'), 'SUG-S1000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_ups_apc_schneider_bv1000'), 'backup_data.js debe contener energia_ups_apc_schneider_bv1000');

  const apcImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'apc-schneider-bv1000.webp');
  assert.ok(fs.existsSync(apcImg), 'La imagen del UPS APC Schneider Electric debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'schneider'"), 'catalog.js debe incluir schneider en stem variants');
  assert.ok(catJs.includes("'apc'"), 'catalog.js debe incluir apc en stem variants');
  assert.ok(catJs.includes("'Schneider Electric'"), 'catalog.js debe incluir Schneider Electric en priorityList');
  assert.ok(catJs.includes("/\\b(schneider|apc|bv1000|easy\\s*ups)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Schneider Electric y APC');
});

test('Mejora demandada por usuarios: Router Wi-Fi 6 Linksys Hydra Pro 6 y Red Mesh (SUG-L8400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L8400'") && seedCjs.includes("status: 'implemented'"), 'SUG-L8400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L8400') && sugJs.includes('Linksys Hydra Pro 6'), 'SUG-L8400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_linksys_hydra_pro_6'), 'backup_data.js debe contener redes_linksys_hydra_pro_6');

  const linksysImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'linksys-hydra-pro6.webp');
  assert.ok(fs.existsSync(linksysImg), 'La imagen del router Linksys Hydra Pro 6 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'linksys'"), 'catalog.js debe incluir linksys en stem variants');
  assert.ok(catJs.includes("'Linksys'"), 'catalog.js debe incluir Linksys en priorityList');
  assert.ok(catJs.includes("/\\b(linksys|hydra|velop|ax5400)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Linksys Hydra Pro 6');
});

test('Mejora demandada por usuarios: Inversor/Cargador Victron Energy MultiPlus y Solar MPPT (SUG-V2400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-V2400'") && seedCjs.includes("status: 'implemented'"), 'SUG-V2400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-V2400') && sugJs.includes('Victron Energy MultiPlus'), 'SUG-V2400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_victron_multiplus_24_3000_70'), 'backup_data.js debe contener energia_victron_multiplus_24_3000_70');

  const victronImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'victron-multiplus-24v.webp');
  assert.ok(fs.existsSync(victronImg), 'La imagen del inversor Victron MultiPlus debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'victron'"), 'catalog.js debe incluir victron en stem variants');
  assert.ok(catJs.includes("'Victron Energy'"), 'catalog.js debe incluir Victron Energy en priorityList');
  assert.ok(catJs.includes("/\\b(victron|multiplus|mppt|senoidal)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Victron Energy MultiPlus');
});

test('Mejora demandada por usuarios: Kit de Alarma Contra Intrusión Paradox Spectra SP4000 (SUG-P5800)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P5800'") && seedCjs.includes("status: 'implemented'"), 'SUG-P5800 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P5800') && sugJs.includes('Paradox Spectra'), 'SUG-P5800 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_paradox_spectra_sp4000_kit'), 'backup_data.js debe contener seguridad_paradox_spectra_sp4000_kit');

  const paradoxImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'paradox-spectra-sp4000.webp');
  assert.ok(fs.existsSync(paradoxImg), 'La imagen del kit Paradox Spectra debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'paradox'"), 'catalog.js debe incluir paradox en stem variants');
  assert.ok(catJs.includes("'Paradox'"), 'catalog.js debe incluir Paradox en priorityList');
  assert.ok(catJs.includes("/\\b(paradox|spectra|sp4000)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Paradox Spectra');
});

test('Mejora demandada por usuarios: Teléfono IP Panasonic KX-HDV130B (SUG-P1300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P1300'") && seedCjs.includes("status: 'implemented'"), 'SUG-P1300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P1300') && sugJs.includes('Panasonic KX-HDV130B'), 'SUG-P1300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_panasonic_kx_hdv130_telefono_ip'), 'backup_data.js debe contener oficina_panasonic_kx_hdv130_telefono_ip');

  const panasonicImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'panasonic-kx-hdv130.webp');
  assert.ok(fs.existsSync(panasonicImg), 'La imagen del teléfono IP Panasonic debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'panasonic'"), 'catalog.js debe incluir panasonic en stem variants');
  assert.ok(catJs.includes("'Panasonic'"), 'catalog.js debe incluir Panasonic en priorityList');
  assert.ok(catJs.includes("/\\b(panasonic|hdv130|kxhdv130|pbx)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Panasonic KX-HDV130B');
});

test('Mejora demandada por usuarios: Aire Acondicionado Inverter Mitsubishi Electric (SUG-M1800)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M1800'") && seedCjs.includes("status: 'implemented'"), 'SUG-M1800 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M1800') && sugJs.includes('Mitsubishi Electric MSZ-GL'), 'SUG-M1800 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_mitsubishi_msz_gl18_aire_inverter'), 'backup_data.js debe contener energia_mitsubishi_msz_gl18_aire_inverter');

  const mitsubishiImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mitsubishi-msz-gl18.webp');
  assert.ok(fs.existsSync(mitsubishiImg), 'La imagen del aire acondicionado Mitsubishi debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'mitsubishi'"), 'catalog.js debe incluir mitsubishi en stem variants');
  assert.ok(catJs.includes("'Mitsubishi'"), 'catalog.js debe incluir Mitsubishi en priorityList');
  assert.ok(catJs.includes("/\\b(mitsubishi|msz|mszgl18)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Mitsubishi Electric');
});

test('Mejora demandada por usuarios: Switch Empresarial Juniper Networks EX2300 (SUG-J2300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-J2300'") && seedCjs.includes("status: 'implemented'"), 'SUG-J2300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-J2300') && sugJs.includes('Juniper Networks EX2300'), 'SUG-J2300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_juniper_ex2300_24p_switch'), 'backup_data.js debe contener redes_juniper_ex2300_24p_switch');

  const juniperImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'juniper-ex2300-24p.webp');
  assert.ok(fs.existsSync(juniperImg), 'La imagen del switch Juniper debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'juniper'"), 'catalog.js debe incluir juniper en stem variants');
  assert.ok(catJs.includes("'Juniper'"), 'catalog.js debe incluir Juniper en priorityList');
  assert.ok(catJs.includes("/\\b(juniper|ex2300|junos)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Juniper Networks EX2300');
});

test('Mejora demandada por usuarios: Interruptor Termomagnético Industrial Siemens Sentron (SUG-S3100)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S3100'") && seedCjs.includes("status: 'implemented'"), 'SUG-S3100 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S3100') && sugJs.includes('Siemens Sentron 3P 100A'), 'SUG-S3100 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_siemens_breaker_industrial_sentron_3p'), 'backup_data.js debe contener energia_siemens_breaker_industrial_sentron_3p');

  const siemensImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'siemens-breaker-sentron.webp');
  assert.ok(fs.existsSync(siemensImg), 'La imagen del interruptor Siemens debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'siemens'"), 'catalog.js debe incluir siemens en stem variants');
  assert.ok(catJs.includes("'Siemens'"), 'catalog.js debe incluir Siemens en priorityList');
  assert.ok(catJs.includes("/\\b(siemens|sentron|disyuntor)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Siemens Sentron');
});

test('Mejora demandada por usuarios: Batería Solar Tesla Powerwall 2 (SUG-T1350)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T1350'") && seedCjs.includes("status: 'implemented'"), 'SUG-T1350 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T1350') && sugJs.includes('Tesla Powerwall 2'), 'SUG-T1350 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_tesla_powerwall_2_bateria_solar'), 'backup_data.js debe contener energia_tesla_powerwall_2_bateria_solar');

  const teslaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tesla-powerwall-2.webp');
  assert.ok(fs.existsSync(teslaImg), 'La imagen de Tesla Powerwall debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'tesla'"), 'catalog.js debe incluir tesla en stem variants');
  assert.ok(catJs.includes("'Tesla'"), 'catalog.js debe incluir Tesla en priorityList');
  assert.ok(catJs.includes("/\\b(tesla|powerwall)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Tesla Powerwall');
});

test('Mejora demandada por usuarios: Servidor en Torre Dell PowerEdge T150 con Intel Xeon y RAID (SUG-D1500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-D1500'") && seedCjs.includes("status: 'implemented'"), 'SUG-D1500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-D1500') && sugJs.includes('Dell PowerEdge T150'), 'SUG-D1500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('computo_dell_poweredge_t150_servidor'), 'backup_data.js debe contener computo_dell_poweredge_t150_servidor');

  const serverImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dell-poweredge-t150.webp');
  assert.ok(fs.existsSync(serverImg), 'La imagen del servidor Dell PowerEdge debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'poweredge'"), 'catalog.js debe incluir poweredge en stem variants');
  assert.ok(catJs.includes("/\\b(servidor|servidores|poweredge|t150|xeon)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar servidores PowerEdge');
});

test('Mejora demandada por usuarios: Terminal Óptica ONT GPON Wi-Fi 6 AX1800 (SUG-O6100)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-O6100'") && seedCjs.includes("status: 'implemented'"), 'SUG-O6100 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-O6100') && sugJs.includes('ONT GPON Wi-Fi 6'), 'SUG-O6100 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_ont_gpon_wifi6_terminal_optica'), 'backup_data.js debe contener redes_ont_gpon_wifi6_terminal_optica');

  const ontImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tplink-ont-gpon-wifi6.webp');
  assert.ok(fs.existsSync(ontImg), 'La imagen de la terminal ONT GPON debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'onu'"), 'catalog.js debe incluir onu en stem variants');
  assert.ok(catJs.includes("/\\b(onu|ont|gpon|ftth|scapc|terminal\\s*optica)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar terminales ópticas GPON');
});

test('Mejora demandada por usuarios: Cámara de Seguridad Solar 4G LTE Autónoma (SUG-C4000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C4000'") && seedCjs.includes("status: 'implemented'"), 'SUG-C4000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C4000') && sugJs.includes('Cámara de Seguridad Solar 4G LTE'), 'SUG-C4000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_camara_solar_4g_autonoma'), 'backup_data.js debe contener seguridad_camara_solar_4g_autonoma');

  const camImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'hikvision-camara-solar-4g.webp');
  assert.ok(fs.existsSync(camImg), 'La imagen de la cámara solar 4G debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'solar'"), 'catalog.js debe incluir solar en stem variants');
  assert.ok(catJs.includes("/\\b(camara\\s*solar|solar\\s*4g|camara\\s*4g)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar cámaras solares 4G');
});

test('Mejora demandada por usuarios: Pantalla Comercial Samsung Crystal UHD 55" 4K (SUG-S5500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S5500'") && seedCjs.includes("status: 'implemented'"), 'SUG-S5500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S5500') && sugJs.includes('Samsung Crystal UHD 55" 4K'), 'SUG-S5500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_samsung_pantalla_55_crystal_uhd'), 'backup_data.js debe contener oficina_samsung_pantalla_55_crystal_uhd');

  const samsungImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'samsung-pantalla-55-crystal-uhd.webp');
  assert.ok(fs.existsSync(samsungImg), 'La imagen de la pantalla Samsung debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'samsung'"), 'catalog.js debe incluir samsung en stem variants');
  assert.ok(catJs.includes("/\\b(samsung|crystal|be55t|signage)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar pantallas Samsung');
});

test('Mejora demandada por usuarios: Gateway Ubiquiti UniFi Cloud Gateway Ultra (SUG-U1000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U1000'") && seedCjs.includes("status: 'implemented'"), 'SUG-U1000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U1000') && sugJs.includes('Ubiquiti UniFi Cloud Gateway Ultra'), 'SUG-U1000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_ubiquiti_unifi_cloud_gateway_ultra'), 'backup_data.js debe contener redes_ubiquiti_unifi_cloud_gateway_ultra');

  const ucgImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ubiquiti-cloud-gateway-ultra.webp');
  assert.ok(fs.existsSync(ucgImg), 'La imagen del gateway Ubiquiti debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ubiquiti'"), 'catalog.js debe incluir ubiquiti en stem variants');
  assert.ok(catJs.includes("/\\b(ubiquiti|unifi|ucg|cloud\\s*gateway)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Ubiquiti Cloud Gateway');
});

test('Mejora demandada por usuarios: Grabador NVR Uniview 4K 8 Canales PoE (SUG-N3010)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N3010'") && seedCjs.includes("status: 'implemented'"), 'SUG-N3010 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N3010') && sugJs.includes('NVR Uniview Ultra HD 4K de 8 Canales'), 'SUG-N3010 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_uniview_nvr_8ch_poe_4k'), 'backup_data.js debe contener seguridad_uniview_nvr_8ch_poe_4k');

  const nvrImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'uniview-nvr-8ch-poe-4k.webp');
  assert.ok(fs.existsSync(nvrImg), 'La imagen del grabador NVR Uniview debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'uniview'"), 'catalog.js debe incluir uniview en stem variants');
  assert.ok(catJs.includes("/\\b(uniview|unv|nvr301)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar grabadores NVR Uniview');
});

test('Mejora demandada por usuarios: Laptop Corporativa HP ProBook 450 G10 (SUG-H4500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-H4500'") && seedCjs.includes("status: 'implemented'"), 'SUG-H4500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-H4500') && sugJs.includes('HP ProBook 450 G10'), 'SUG-H4500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('hp_probook_450_g10_laptop'), 'backup_data.js debe contener hp_probook_450_g10_laptop');

  const probookImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'hp-probook-450-g10.webp');
  assert.ok(fs.existsSync(probookImg), 'La imagen de la laptop HP ProBook debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'probook'"), 'catalog.js debe incluir probook en stem variants');
  assert.ok(catJs.includes("/\\b(probook|450\\s*g10|probook\\s*450)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar HP ProBook 450 G10');
});

test('Mejora demandada por usuarios: Impresora Multifuncional Láser HP LaserJet Pro MFP M428fdw (SUG-H4280)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-H4280'") && seedCjs.includes("status: 'implemented'"), 'SUG-H4280 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-H4280') && sugJs.includes('HP LaserJet Pro MFP M428fdw'), 'SUG-H4280 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_hp_laserjet_pro_m428fdw_multifuncional'), 'backup_data.js debe contener oficina_hp_laserjet_pro_m428fdw_multifuncional');

  const laserjetImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'hp-laserjet-pro-mfp-m428fdw.webp');
  assert.ok(fs.existsSync(laserjetImg), 'La imagen de la impresora HP LaserJet debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'laserjet'"), 'catalog.js debe incluir laserjet en stem variants');
  assert.ok(catJs.includes("/\\b(laserjet|m428|m428fdw)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar HP LaserJet Pro');
});

test('Mejora demandada por usuarios: Switch Administrable Cisco Business CBS350-24T-4G (SUG-C3500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C3500'") && seedCjs.includes("status: 'implemented'"), 'SUG-C3500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C3500') && sugJs.includes('Cisco Business CBS350-24T-4G'), 'SUG-C3500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_cisco_business_cbs350_24t_switch'), 'backup_data.js debe contener redes_cisco_business_cbs350_24t_switch');

  const switchImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'cisco-cbs350-24t-switch.webp');
  assert.ok(fs.existsSync(switchImg), 'La imagen del switch Cisco debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'cbs350'"), 'catalog.js debe incluir cbs350 en stem variants');
  assert.ok(catJs.includes("/\\b(cbs350|cbs35024t)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar switches Cisco CBS350');
});

test('Mejora demandada por usuarios: UPS Online Doble Conversión APC by Schneider Electric Easy UPS SRV 3000VA (SUG-S3000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S3000'") && seedCjs.includes("status: 'implemented'"), 'SUG-S3000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S3000') && sugJs.includes('APC by Schneider Electric Easy UPS SRV 3000VA'), 'SUG-S3000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_apc_schneider_easy_ups_srv_3000va_online'), 'backup_data.js debe contener energia_apc_schneider_easy_ups_srv_3000va_online');

  const upsImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'apc-schneider-easy-ups-srv-3000va.webp');
  assert.ok(fs.existsSync(upsImg), 'La imagen del UPS Online APC Schneider debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'srv'"), 'catalog.js debe incluir srv en stem variants');
  assert.ok(catJs.includes("/\\b(srv|srv3000|srv3ka|srv3000xla)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar UPS Online APC SRV 3000VA');
});

test('Mejora demandada por usuarios: Router MikroTik RB5009UG+S+IN Multi-WAN 2.5G + 10G SFP+ (SUG-M5009)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M5009'") && seedCjs.includes("status: 'implemented'"), 'SUG-M5009 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M5009') && sugJs.includes('MikroTik RB5009UG+S+IN'), 'SUG-M5009 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_mikrotik_rb5009_router_multiwan'), 'backup_data.js debe contener redes_mikrotik_rb5009_router_multiwan');

  const routerImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mikrotik-rb5009-router-multiwan.webp');
  assert.ok(fs.existsSync(routerImg), 'La imagen del router MikroTik RB5009 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'rb5009'"), 'catalog.js debe incluir rb5009 en stem variants');
  assert.ok(catJs.includes("/\\b(rb5009|rb5009ug|multiwan)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Router MikroTik RB5009');
});

test('Mejora demandada por usuarios: Computadora Corporativa Lenovo ThinkCentre M70q Tiny Gen 4 (SUG-L7000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L7000'") && seedCjs.includes("status: 'implemented'"), 'SUG-L7000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L7000') && sugJs.includes('Lenovo ThinkCentre M70q Tiny Gen 4'), 'SUG-L7000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_lenovo_thinkcentre_m70q_tiny_desktop'), 'backup_data.js debe contener oficina_lenovo_thinkcentre_m70q_tiny_desktop');

  const tinyImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'lenovo-thinkcentre-m70q-tiny.webp');
  assert.ok(fs.existsSync(tinyImg), 'La imagen del Tiny Lenovo debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'m70q'"), 'catalog.js debe incluir m70q en stem variants');
  assert.ok(catJs.includes("'minipc'"), 'catalog.js debe incluir minipc en stem variants');
  assert.ok(catJs.includes("/\\b(m70q|thinkcentre|tiny)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Lenovo ThinkCentre M70q Tiny');
  assert.ok(catJs.includes("/\\b(mini\\s*pc|micro\\s*pc|tiny\\s*pc|minipc)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Lenovo ThinkCentre M70q Tiny al buscar mini pc');
});


test('Mejora demandada por usuarios: Cámara IP Uniview ColorHunter 4K 8MP PoE Color 24/7 (SUG-U4080)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U4080'") && seedCjs.includes("status: 'implemented'"), 'SUG-U4080 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U4080') && sugJs.includes('Uniview ColorHunter 4K 8MP PoE'), 'SUG-U4080 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_uniview_colorhunter_4k_poe_camera'), 'backup_data.js debe contener seguridad_uniview_colorhunter_4k_poe_camera');

  const camImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'uniview-colorhunter-4k-poe-camera.webp');
  assert.ok(fs.existsSync(camImg), 'La imagen de la cámara Uniview ColorHunter 4K debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'colorhunter'"), 'catalog.js debe incluir colorhunter en stem variants');
  assert.ok(catJs.includes("/\\b(colorhunter|ipc2128|color\\s*24\\/7)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Cámara Uniview ColorHunter');
});

test('Mejora demandada por usuarios: Switch Netgear ProSAFE GS308PP 8P Gigabit PoE+ (83W) (SUG-N308P)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N308P'") && seedCjs.includes("status: 'implemented'"), 'SUG-N308P debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N308P') && sugJs.includes('Netgear ProSAFE GS308PP'), 'SUG-N308P debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_netgear_gs308pp_switch_8p_poe'), 'backup_data.js debe contener redes_netgear_gs308pp_switch_8p_poe');

  const switchImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'netgear-gs308pp-switch-8p-poe.webp');
  assert.ok(fs.existsSync(switchImg), 'La imagen del switch Netgear GS308PP debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'gs308pp'"), 'catalog.js debe incluir gs308pp en stem variants');
  assert.ok(catJs.includes("/\\b(gs308pp|gs308p)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Switch Netgear GS308PP');
});

test('Mejora demandada por usuarios: Controlador de Carga Solar Victron Energy SmartSolar MPPT 100/30 (SUG-V1030)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-V1030'") && seedCjs.includes("status: 'implemented'"), 'SUG-V1030 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-V1030') && sugJs.includes('Victron Energy SmartSolar MPPT 100/30'), 'SUG-V1030 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_victron_smartsolar_mppt_100_30'), 'backup_data.js debe contener energia_victron_smartsolar_mppt_100_30');

  const mpptImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'victron-smartsolar-mppt-100-30.webp');
  assert.ok(fs.existsSync(mpptImg), 'La imagen del controlador solar Victron MPPT debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'smartsolar'"), 'catalog.js debe incluir smartsolar en stem variants');
  assert.ok(catJs.includes("/\\b(smartsolar|mppt)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Controlador Solar Victron SmartSolar MPPT');
});

test('Mejora demandada por usuarios: Teléfono IP Ejecutivo Panasonic KX-HDV230 (SUG-P2300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P2300'") && seedCjs.includes("status: 'implemented'"), 'SUG-P2300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P2300') && sugJs.includes('Panasonic KX-HDV230'), 'SUG-P2300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_panasonic_kxhdv230_ip_phone'), 'backup_data.js debe contener oficina_panasonic_kxhdv230_ip_phone');

  const phoneImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'panasonic-kxhdv230-ip-phone.webp');
  assert.ok(fs.existsSync(phoneImg), 'La imagen del teléfono IP Panasonic KX-HDV230 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'hdv230'"), 'catalog.js debe incluir hdv230 en stem variants');
  assert.ok(catJs.includes("/\\b(kxhdv230|hdv230)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Teléfono IP Panasonic KX-HDV230');
});

test('Mejora demandada por usuarios: Firewall y Gateway Juniper Networks SRX300 (SUG-J3000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-J3000'") && seedCjs.includes("status: 'implemented'"), 'SUG-J3000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-J3000') && sugJs.includes('Juniper Networks SRX300'), 'SUG-J3000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_juniper_srx300_security_gateway'), 'backup_data.js debe contener redes_juniper_srx300_security_gateway');

  const srxImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'juniper-srx300-security-gateway.webp');
  assert.ok(fs.existsSync(srxImg), 'La imagen del gateway Juniper SRX300 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'srx300'"), 'catalog.js debe incluir srx300 en stem variants');
  assert.ok(catJs.includes("/\\b(srx300|srx)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Gateway Juniper SRX300');
});

test('Mejora demandada por usuarios: Contactor Industrial Siemens Sirius 3RT 25A (SUG-S2500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S2500'") && seedCjs.includes("status: 'implemented'"), 'SUG-S2500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S2500') && sugJs.includes('Siemens Sirius 3RT'), 'SUG-S2500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_siemens_sirius_contactor_3rt_25a'), 'backup_data.js debe contener energia_siemens_sirius_contactor_3rt_25a');

  const contactorImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'siemens-sirius-contactor-3rt-25a.webp');
  assert.ok(fs.existsSync(contactorImg), 'La imagen del contactor Siemens Sirius debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'sirius'"), 'catalog.js debe incluir sirius en stem variants');
  assert.ok(catJs.includes("/\\b(sirius|3rt|3rt2026)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Contactor Siemens Sirius 3RT');
});

test('Mejora demandada por usuarios: Cargador de Vehículos Eléctricos Tesla Wall Connector Gen 3 (SUG-T4800)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T4800'") && seedCjs.includes("status: 'implemented'"), 'SUG-T4800 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T4800') && sugJs.includes('Tesla Wall Connector'), 'SUG-T4800 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_tesla_wall_connector_gen3'), 'backup_data.js debe contener energia_tesla_wall_connector_gen3');

  const teslaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tesla-wall-connector-gen3.webp');
  assert.ok(fs.existsSync(teslaImg), 'La imagen del cargador Tesla Wall Connector debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'connector'"), 'catalog.js debe incluir connector en stem variants');
  assert.ok(catJs.includes("/\\b(wall\\s*connector|cargador\\s*tesla|tesla\\s*charger|cargador\\s*ev)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Tesla Wall Connector');
});

test('Mejora demandada por usuarios: Aire Acondicionado Cassette Inverter Mitsubishi Electric PLA-M 36K (SUG-M3600)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M3600'") && seedCjs.includes("status: 'implemented'"), 'SUG-M3600 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M3600') && sugJs.includes('Mitsubishi Electric PLA-M'), 'SUG-M3600 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_mitsubishi_cassette_inverter_36k'), 'backup_data.js debe contener energia_mitsubishi_cassette_inverter_36k');

  const mitsubishiImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mitsubishi-cassette-inverter-36k.webp');
  assert.ok(fs.existsSync(mitsubishiImg), 'La imagen del cassette Mitsubishi debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'cassette'"), 'catalog.js debe incluir cassette en stem variants');
  assert.ok(catJs.includes("/\\b(cassette|plam|pla-m)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Cassette Mitsubishi Electric');
});

test('Mejora demandada por usuarios: Módulo Comunicador IP Paradox IP150+ (SUG-P1500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P1500'") && seedCjs.includes("status: 'implemented'"), 'SUG-P1500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P1500') && sugJs.includes('Paradox IP150+'), 'SUG-P1500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_paradox_ip150_modulo_comunicador'), 'backup_data.js debe contener seguridad_paradox_ip150_modulo_comunicador');

  const paradoxImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'paradox-ip150-modulo-comunicador.webp');
  assert.ok(fs.existsSync(paradoxImg), 'La imagen del módulo Paradox IP150+ debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ip150'"), 'catalog.js debe incluir ip150 en stem variants');
  assert.ok(catJs.includes("/\\b(ip150|ip150\\+|insite\\s*gold)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Paradox IP150+');
});

test('Mejora demandada por usuarios: Sistema Mesh Wi-Fi 6E Tri-Banda Linksys Velop Pro 6E (SUG-L6400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L6400'") && seedCjs.includes("status: 'implemented'"), 'SUG-L6400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L6400') && sugJs.includes('Linksys Velop Pro 6E'), 'SUG-L6400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_linksys_velop_pro_6e_mesh'), 'backup_data.js debe contener redes_linksys_velop_pro_6e_mesh');

  const linksysImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'linksys-velop-pro-6e-mesh.webp');
  assert.ok(fs.existsSync(linksysImg), 'La imagen del router Linksys Velop Pro 6E debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'velop'"), 'catalog.js debe incluir velop en stem variants');
  assert.ok(catJs.includes("/\\b(velop|axe5400|wifi\\s*6e)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Linksys Velop Pro 6E');
});

test('Mejora demandada por usuarios: Cámara Wi-Fi de Seguridad PTZ Exterior Ezviz H8c (SUG-E8200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-E8200'") && seedCjs.includes("status: 'implemented'"), 'SUG-E8200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-E8200') && sugJs.includes('Ezviz H8c'), 'SUG-E8200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_ezviz_h8c_camara_ptz_exterior'), 'backup_data.js debe contener seguridad_ezviz_h8c_camara_ptz_exterior');

  const ezvizImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ezviz-h8c-camara-ptz-exterior.webp');
  assert.ok(fs.existsSync(ezvizImg), 'La imagen de la cámara Ezviz H8c debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'h8c'"), 'catalog.js debe incluir h8c en stem variants');
  assert.ok(catJs.includes("/\\b(h8c)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Cámara Ezviz H8c');
});

test('Mejora demandada por usuarios: Cámara de Videoconferencia Todo en Uno Logitech MeetUp 4K (SUG-L9500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L9500'") && seedCjs.includes("status: 'implemented'"), 'SUG-L9500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L9500') && sugJs.includes('Logitech MeetUp'), 'SUG-L9500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_logitech_meetup_videoconferencia_4k'), 'backup_data.js debe contener oficina_logitech_meetup_videoconferencia_4k');

  const logitechImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'logitech-meetup-videoconferencia-4k.webp');
  assert.ok(fs.existsSync(logitechImg), 'La imagen de la cámara Logitech MeetUp debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'meetup'"), 'catalog.js debe incluir meetup en stem variants');
  assert.ok(catJs.includes("/\\b(meetup)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Logitech MeetUp');
});

test('Mejora demandada por usuarios: Cerradura Digital Inteligente ZKTeco TL400B Biométrica (SUG-Z400B)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-Z400B'") && seedCjs.includes("status: 'implemented'"), 'SUG-Z400B debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-Z400B') && sugJs.includes('ZKTeco TL400B'), 'SUG-Z400B debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_zkteco_tl400b_cerradura_inteligente'), 'backup_data.js debe contener seguridad_zkteco_tl400b_cerradura_inteligente');

  const zktecoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'zkteco-tl400b-cerradura-inteligente.webp');
  assert.ok(fs.existsSync(zktecoImg), 'La imagen de la cerradura ZKTeco TL400B debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'tl400b'"), 'catalog.js debe incluir tl400b en stem variants');
  assert.ok(catJs.includes("/\\b(tl400b|tl400)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar ZKTeco TL400B');
});

test('Mejora demandada por usuarios: Punto de Acceso Wi-Fi 6 Ubiquiti UniFi 6 Pro (U6-Pro) (SUG-U6800)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U6800'") && seedCjs.includes("status: 'implemented'"), 'SUG-U6800 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U6800') && sugJs.includes('UniFi 6 Pro'), 'SUG-U6800 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_ubiquiti_unifi_u6_pro_access_point'), 'backup_data.js debe contener redes_ubiquiti_unifi_u6_pro_access_point');

  const ubiquitiImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ubiquiti-unifi-u6-pro-access-point.webp');
  assert.ok(fs.existsSync(ubiquitiImg), 'La imagen del Access Point Ubiquiti U6-Pro debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'u6pro'"), 'catalog.js debe incluir u6pro en stem variants');
  assert.ok(catJs.includes("/\\b(u6\\s*pro|u6-pro|u6pro)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Ubiquiti UniFi 6 Pro');
});

test('Mejora demandada por usuarios: Pantalla Interactiva Táctil Samsung Flip Pro 65" 4K UHD (SUG-S6500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S6500'") && seedCjs.includes("status: 'implemented'"), 'SUG-S6500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S6500') && sugJs.includes('Samsung Flip Pro'), 'SUG-S6500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_samsung_flip_pro_65_interactiva'), 'backup_data.js debe contener oficina_samsung_flip_pro_65_interactiva');

  const samsungImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'samsung-flip-pro-65-pantalla-interactiva.webp');
  assert.ok(fs.existsSync(samsungImg), 'La imagen de la pantalla Samsung Flip Pro debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'flip'"), 'catalog.js debe incluir flip en stem variants');
  assert.ok(catJs.includes("/\\b(flip\\s*pro|samsung\\s*flip|wm65b)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Samsung Flip Pro');
});

test('Mejora demandada por usuarios: Estación de Trabajo Profesional Dell Precision 3660 Workstation (SUG-D3660)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-D3660'") && seedCjs.includes("status: 'implemented'"), 'SUG-D3660 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-D3660') && sugJs.includes('Dell Precision 3660'), 'SUG-D3660 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_dell_precision_3660_workstation'), 'backup_data.js debe contener oficina_dell_precision_3660_workstation');

  const dellImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dell-precision-3660-tower-workstation.webp');
  assert.ok(fs.existsSync(dellImg), 'La imagen de la workstation Dell Precision 3660 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'precision'"), 'catalog.js debe incluir precision en stem variants');
  assert.ok(catJs.includes("/\\b(precision|precision\\s*3660)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Dell Precision 3660');
});

test('Mejora demandada por usuarios: Unidad PDU Administrable para Rack APC by Schneider Electric (SUG-A7900)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-A7900'") && seedCjs.includes("status: 'implemented'"), 'SUG-A7900 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-A7900') && sugJs.includes('APC by Schneider Electric Metered'), 'SUG-A7900 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_apc_metered_rack_pdu_120v'), 'backup_data.js debe contener energia_apc_metered_rack_pdu_120v');

  const apcImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'apc-schneider-metered-rack-pdu-120v.webp');
  assert.ok(fs.existsSync(apcImg), 'La imagen de la PDU APC Schneider debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'pdu'"), 'catalog.js debe incluir pdu en stem variants');
  assert.ok(catJs.includes("/\\b(pdu|rack\\s*pdu|metered\\s*pdu|ap7900)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar APC Metered PDU');
});

test('Mejora demandada por usuarios: Terminal Biométrica de Acceso Facial Dahua IA (SUG-D4300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-D4300'") && seedCjs.includes("status: 'implemented'"), 'SUG-D4300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-D4300') && sugJs.includes('Terminal Biométrica de Control de Acceso Facial Dahua'), 'SUG-D4300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_dahua_terminal_facial_acceso_ia'), 'backup_data.js debe contener seguridad_dahua_terminal_facial_acceso_ia');

  const dahuaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dahua-terminal-reconocimiento-facial-ia.webp');
  assert.ok(fs.existsSync(dahuaImg), 'La imagen de la terminal facial Dahua debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'facial'"), 'catalog.js debe incluir facial en stem variants');
  assert.ok(catJs.includes("/\\b(asi3213g|dahua\\s*facial)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Terminal Facial Dahua');
});

test('Mejora demandada por usuarios: Monitor UltraWide LG 34WP500-B 34" IPS WFHD (SUG-L3400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L3400'") && seedCjs.includes("status: 'implemented'"), 'SUG-L3400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L3400') && sugJs.includes('Monitor UltraWide LG 34WP500-B'), 'SUG-L3400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_lg_34wp500_ultrawide_34_ips'), 'backup_data.js debe contener oficina_lg_34wp500_ultrawide_34_ips');

  const lgImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'lg-34wp500-monitor-ultrawide-34.webp');
  assert.ok(fs.existsSync(lgImg), 'La imagen del monitor LG 34 UltraWide debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ultrawide'"), 'catalog.js debe incluir ultrawide en stem variants');
  assert.ok(catJs.includes("/\\b(ultrawide|34wp500|34wp500-b)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Monitor UltraWide LG');
});

test('Mejora demandada por usuarios: Router Inalámbrico Wi-Fi 6 MikroTik hAP ax³ (SUG-M5300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M5300'") && seedCjs.includes("status: 'implemented'"), 'SUG-M5300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M5300') && sugJs.includes('MikroTik hAP ax³'), 'SUG-M5300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_mikrotik_hap_ax3_wifi6_router'), 'backup_data.js debe contener redes_mikrotik_hap_ax3_wifi6_router');

  const mikrotikImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mikrotik-hap-ax3-wifi6-router.webp');
  assert.ok(fs.existsSync(mikrotikImg), 'La imagen del router MikroTik hAP ax3 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ax3'"), 'catalog.js debe incluir ax3 en stem variants');
  assert.ok(catJs.includes("/\\b(hap\\s*ax3|hap\\s*ax³|ax3|ax³|c53uig)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar MikroTik hAP ax3');
});

test('Mejora demandada por usuarios: Switch Administrable Cisco Business CBS350-8P PoE+ (SUG-C3508)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C3508'") && seedCjs.includes("status: 'implemented'"), 'SUG-C3508 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C3508') && sugJs.includes('Cisco Business CBS350-8P-E-2G'), 'SUG-C3508 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_cisco_business_cbs350_8p_poe_switch'), 'backup_data.js debe contener redes_cisco_business_cbs350_8p_poe_switch');

  const ciscoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'cisco-business-cbs350-8p-poe-switch.webp');
  assert.ok(fs.existsSync(ciscoImg), 'La imagen del switch Cisco CBS350-8P debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'cbs3508p'"), 'catalog.js debe incluir cbs3508p en stem variants');
  assert.ok(catJs.includes("/\\b(cbs350-8p|cbs350\\s*8p|cbs350-8p-e-2g)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Cisco CBS350-8P');
});

test('Mejora demandada por usuarios: Sistema UPS APC Smart-UPS SMT1500C Onda Senoidal Pura (SUG-A1500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-A1500'") && seedCjs.includes("status: 'implemented'"), 'SUG-A1500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-A1500') && sugJs.includes('APC Smart-UPS SMT1500C'), 'SUG-A1500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_apc_smart_ups_smt1500c_1500va'), 'backup_data.js debe contener energia_apc_smart_ups_smt1500c_1500va');

  const apcImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'apc-smart-ups-smt1500c-senoidal-puro.webp');
  assert.ok(fs.existsSync(apcImg), 'La imagen del UPS APC Smart-UPS SMT1500C debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'smt1500c'"), 'catalog.js debe incluir smt1500c en stem variants');
  assert.ok(catJs.includes("/\\b(smt1500c|smt1500|smart-ups\\s*1500|smart\\s*ups\\s*1500|apc\\s*1500)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar APC Smart-UPS SMT1500C');
});

test('Mejora demandada por usuarios: Laptop Corporativa Lenovo ThinkPad E16 Gen 1 (SUG-L1600)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L1600'") && seedCjs.includes("status: 'implemented'"), 'SUG-L1600 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L1600') && sugJs.includes('ThinkPad E16 Gen 1'), 'SUG-L1600 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_lenovo_thinkpad_e16_corporativa'), 'backup_data.js debe contener oficina_lenovo_thinkpad_e16_corporativa');

  const lenovoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'lenovo-thinkpad-e16-laptop-corporativa.webp');
  assert.ok(fs.existsSync(lenovoImg), 'La imagen de la ThinkPad E16 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'e16'"), 'catalog.js debe incluir e16 en stem variants');
  assert.ok(catJs.includes("/\\b(thinkpad\\s*e16|e16|lenovo\\s*16|e16\\s*gen)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Lenovo ThinkPad E16');
});

test('Mejora demandada por usuarios: Punto de Acceso Wi-Fi 6 TP-Link Omada EAP653 AX3000 (SUG-T6530)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T6530'") && seedCjs.includes("status: 'implemented'"), 'SUG-T6530 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T6530') && sugJs.includes('TP-Link Omada EAP653'), 'SUG-T6530 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_tplink_omada_eap653_wifi6_ap'), 'backup_data.js debe contener redes_tplink_omada_eap653_wifi6_ap');

  const tplinkImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tplink-omada-eap653-wifi6-ap.webp');
  assert.ok(fs.existsSync(tplinkImg), 'La imagen del AP TP-Link Omada EAP653 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'omada'"), 'catalog.js debe incluir omada en stem variants');
  assert.ok(catJs.includes("/\\b(omada|eap653|eap-653)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar TP-Link Omada EAP653');
});

test('Mejora demandada por usuarios: Impresora Multifuncional Epson EcoTank L5590 ADF (SUG-E5590)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-E5590'") && seedCjs.includes("status: 'implemented'"), 'SUG-E5590 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-E5590') && sugJs.includes('Epson EcoTank L5590'), 'SUG-E5590 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_epson_ecotank_l5590_multifuncional'), 'backup_data.js debe contener oficina_epson_ecotank_l5590_multifuncional');

  const epsonImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'epson-ecotank-l5590-multifuncional.webp');
  assert.ok(fs.existsSync(epsonImg), 'La imagen de la Epson EcoTank L5590 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'l5590'"), 'catalog.js debe incluir l5590 en stem variants');
  assert.ok(catJs.includes("/\\b(l5590|epson\\s*l5590|ecotank\\s*l5590)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Epson EcoTank L5590');
});

test('Mejora demandada por usuarios: Cámara IP Domo Hikvision AcuSense 4K 8MP IA (SUG-H8240)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-H8240'") && seedCjs.includes("status: 'implemented'"), 'SUG-H8240 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-H8240') && sugJs.includes('Hikvision AcuSense 4K 8MP'), 'SUG-H8240 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_hikvision_acusense_4k_camara_ip'), 'backup_data.js debe contener seguridad_hikvision_acusense_4k_camara_ip');

  const hikvisionImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'hikvision-acusense-4k-camara-ip.webp');
  assert.ok(fs.existsSync(hikvisionImg), 'La imagen de la cámara Hikvision AcuSense 4K debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'acusense'"), 'catalog.js debe incluir acusense en stem variants');
  assert.ok(catJs.includes("/\\b(acusense|2cd2183g2|ds-2cd2183g2|2cd2183g2-iu)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Hikvision AcuSense 4K');
});

test('Mejora demandada por usuarios: Router VPN Dual-WAN Gigabit Linksys LRT224 (SUG-L2240)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L2240'") && seedCjs.includes("status: 'implemented'"), 'SUG-L2240 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L2240') && sugJs.includes('Linksys LRT224'), 'SUG-L2240 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_linksys_lrt224_dualwan_vpn_router'), 'backup_data.js debe contener redes_linksys_lrt224_dualwan_vpn_router');

  const linksysImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'linksys-lrt224-dualwan-vpn-router.webp');
  assert.ok(fs.existsSync(linksysImg), 'La imagen del router Linksys LRT224 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'lrt224'"), 'catalog.js debe incluir lrt224 en stem variants');
  assert.ok(catJs.includes("/\\b(lrt224|lrt-224|dualwan|dual-wan)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Linksys LRT224');
});

test('Mejora demandada por usuarios: Switch Administrable Netgear ProSAFE GS724TPv2 24P PoE+ (SUG-N7240)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N7240'") && seedCjs.includes("status: 'implemented'"), 'SUG-N7240 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N7240') && sugJs.includes('Netgear Smart Managed Pro GS724TPv2'), 'SUG-N7240 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_netgear_gs724tp_24p_gigabit_poe_switch'), 'backup_data.js debe contener redes_netgear_gs724tp_24p_gigabit_poe_switch');

  const netgearImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'netgear-gs724tp-24p-gigabit-poe-switch.webp');
  assert.ok(fs.existsSync(netgearImg), 'La imagen del switch Netgear GS724TPv2 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'gs724tp'"), 'catalog.js debe incluir gs724tp en stem variants');
  assert.ok(catJs.includes("/\\b(gs724tp|gs724tpv2|gs724)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Netgear GS724TPv2');
});

test('Mejora demandada por usuarios: Monitor de Baterías Victron Energy SmartShunt 500A Bluetooth (SUG-V5000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-V5000'") && seedCjs.includes("status: 'implemented'"), 'SUG-V5000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-V5000') && sugJs.includes('Victron Energy SmartShunt 500A'), 'SUG-V5000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_victron_smartshunt_500a_monitor_bateria'), 'backup_data.js debe contener energia_victron_smartshunt_500a_monitor_bateria');

  const victronImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'victron-smartshunt-500a-monitor-bateria.webp');
  assert.ok(fs.existsSync(victronImg), 'La imagen del monitor Victron SmartShunt 500A debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'smartshunt'"), 'catalog.js debe incluir smartshunt en stem variants');
  assert.ok(catJs.includes("/\\b(smartshunt|shunt|500a)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Victron SmartShunt');
});

test('Mejora demandada por usuarios: Sistema Telefónico Inalámbrico DECT IP Panasonic KX-TGP600 (SUG-P6000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P6000'") && seedCjs.includes("status: 'implemented'"), 'SUG-P6000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P6000') && sugJs.includes('Panasonic KX-TGP600'), 'SUG-P6000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_panasonic_kxtgp600_dect_ip_inalambrico'), 'backup_data.js debe contener oficina_panasonic_kxtgp600_dect_ip_inalambrico');

  const panasonicImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'panasonic-kxtgp600-dect-ip-inalambrico.webp');
  assert.ok(fs.existsSync(panasonicImg), 'La imagen del teléfono Panasonic KX-TGP600 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'tgp600'"), 'catalog.js debe incluir tgp600 en stem variants');
  assert.ok(catJs.includes("/\\b(tgp600|kxtgp600|kx-tgp600)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Panasonic KX-TGP600');
});

test('Mejora demandada por usuarios: Switch Fanless Juniper Networks EX2300-C-12P PoE+ (SUG-J2312)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-J2312'") && seedCjs.includes("status: 'implemented'"), 'SUG-J2312 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-J2312') && sugJs.includes('Juniper Networks EX2300-C-12P'), 'SUG-J2312 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_juniper_ex2300_c_12p_switch'), 'backup_data.js debe contener redes_juniper_ex2300_c_12p_switch');

  const juniperImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'juniper-ex2300-c-12p.webp');
  assert.ok(fs.existsSync(juniperImg), 'La imagen del switch Juniper EX2300-C-12P debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ex2300c'"), 'catalog.js debe incluir ex2300c en stem variants');
  assert.ok(catJs.includes("/\\b(ex2300-c|ex2300c|ex2300-c-12p)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Juniper EX2300-C-12P');
});

test('Mejora demandada por usuarios: Aire Inverter Mitsubishi Electric MSZ-GL 12,000 BTU (SUG-M1200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M1200'") && seedCjs.includes("status: 'implemented'"), 'SUG-M1200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M1200') && sugJs.includes('Mitsubishi Electric MSZ-GL 12,000 BTU'), 'SUG-M1200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_mitsubishi_msz_gl12_aire_inverter'), 'backup_data.js debe contener energia_mitsubishi_msz_gl12_aire_inverter');

  const mitsubishiImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mitsubishi-msz-gl12.webp');
  assert.ok(fs.existsSync(mitsubishiImg), 'La imagen del aire Mitsubishi MSZ-GL 12k debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'msz-gl12'"), 'catalog.js debe incluir msz-gl12 en stem variants');
  assert.ok(catJs.includes("/\\b(msz-gl12|mszgl12|gl12)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Mitsubishi MSZ-GL 12,000 BTU');
});

test('Mejora demandada por usuarios: Panel de Alarma Híbrido Paradox Magellan MG5050+ (SUG-P5050)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P5050'") && seedCjs.includes("status: 'implemented'"), 'SUG-P5050 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P5050') && sugJs.includes('Paradox Magellan MG5050+'), 'SUG-P5050 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_paradox_magellan_mg5050_panel'), 'backup_data.js debe contener seguridad_paradox_magellan_mg5050_panel');

  const paradoxImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'paradox-magellan-mg5050.webp');
  assert.ok(fs.existsSync(paradoxImg), 'La imagen del panel Paradox Magellan MG5050+ debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'mg5050'"), 'catalog.js debe incluir mg5050 en stem variants');
  assert.ok(catJs.includes("/\\b(mg5050|mg5050\\+|magellan)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Paradox Magellan MG5050+');
});

test('Mejora demandada por usuarios: Micro-PLC Siemens LOGO! 230RCE Ethernet (SUG-S8300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S8300'") && seedCjs.includes("status: 'implemented'"), 'SUG-S8300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S8300') && sugJs.includes('Siemens LOGO! 230RCE'), 'SUG-S8300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_siemens_logo_230rce_plc_controlador'), 'backup_data.js debe contener energia_siemens_logo_230rce_plc_controlador');

  const siemensImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'siemens-logo-230rce-plc.webp');
  assert.ok(fs.existsSync(siemensImg), 'La imagen del micro-PLC Siemens LOGO! 230RCE debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'230rce'"), 'catalog.js debe incluir 230rce en stem variants');
  assert.ok(catJs.includes("/\\b(230rce|logo230rce)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Siemens LOGO! 230RCE');
});

test('Mejora demandada por usuarios: Punto de Acceso Ubiquiti UniFi Swiss Army Knife Ultra (SUG-U5400)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U5400'") && seedCjs.includes("status: 'implemented'"), 'SUG-U5400 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U5400') && sugJs.includes('Swiss Army Knife Ultra'), 'SUG-U5400 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_ubiquiti_uk_ultra_wifi_ap'), 'backup_data.js debe contener redes_ubiquiti_uk_ultra_wifi_ap');

  const ubiImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ubiquiti-uk-ultra-ap.webp');
  assert.ok(fs.existsSync(ubiImg), 'La imagen del AP Ubiquiti UK-Ultra debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'uk-ultra'"), 'catalog.js debe incluir uk-ultra en stem variants');
  assert.ok(catJs.includes("/\\b(uk-ultra|ukultra|swiss\\s*army)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Ubiquiti UK-Ultra');
});

test('Mejora demandada por usuarios: Cámara IP Dahua TiOC 2.0 4MP Disuasión Activa (SUG-D3449)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-D3449'") && seedCjs.includes("status: 'implemented'"), 'SUG-D3449 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-D3449') && sugJs.includes('Dahua TiOC 2.0'), 'SUG-D3449 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_dahua_tioc_4mp_camara_ip'), 'backup_data.js debe contener seguridad_dahua_tioc_4mp_camara_ip');

  const dahuaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'dahua-tioc-4mp-camara-ip.webp');
  assert.ok(fs.existsSync(dahuaImg), 'La imagen de la cámara Dahua TiOC 2.0 4MP debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'tioc'"), 'catalog.js debe incluir tioc en stem variants');
  assert.ok(catJs.includes("/\\b(tioc|3449|hdw3449)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Dahua TiOC 2.0');
});

test('Mejora demandada por usuarios: Switch Administrable Cisco Business CBS350-24P-4G (SUG-C3524)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C3524'") && seedCjs.includes("status: 'implemented'"), 'SUG-C3524 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C3524') && sugJs.includes('Cisco Business CBS350-24P-4G'), 'SUG-C3524 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_cisco_cbs350_24p_4g_switch'), 'backup_data.js debe contener redes_cisco_cbs350_24p_4g_switch');

  const ciscoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'cisco-cbs350-24p-4g.webp');
  assert.ok(fs.existsSync(ciscoImg), 'La imagen del switch Cisco CBS350-24P-4G debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'cbs350-24p'"), 'catalog.js debe incluir cbs350-24p en stem variants');
  assert.ok(catJs.includes("/\\b(cbs350-24p|cbs350-24|cbs3524)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Cisco CBS350-24P-4G');
});

test('Mejora demandada por usuarios: Sistema UPS para Rack APC Smart-UPS SMT2200RM2U 2200VA (SUG-A2200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-A2200'") && seedCjs.includes("status: 'implemented'"), 'SUG-A2200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-A2200') && sugJs.includes('APC Smart-UPS SMT2200RM2U'), 'SUG-A2200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_apc_smart_ups_2200_rack'), 'backup_data.js debe contener energia_apc_smart_ups_2200_rack');

  const apcImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'apc-smart-ups-2200-rack.webp');
  assert.ok(fs.existsSync(apcImg), 'La imagen del UPS APC Smart-UPS 2200RM2U debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'smt2200'"), 'catalog.js debe incluir smt2200 en stem variants');
  assert.ok(catJs.includes("/\\b(smt2200|smt2200rm2u|smart-ups\\s*2200)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar APC Smart-UPS 2200RM2U');
});

test('Mejora demandada por usuarios: Cargador Universal de Vehículos Eléctricos Tesla Universal Wall Connector (SUG-T1150)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T1150'") && seedCjs.includes("status: 'implemented'"), 'SUG-T1150 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T1150') && sugJs.includes('Tesla Universal Wall Connector'), 'SUG-T1150 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_tesla_universal_wall_connector'), 'backup_data.js debe contener energia_tesla_universal_wall_connector');

  const teslaImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tesla-universal-wall-connector.webp');
  assert.ok(fs.existsSync(teslaImg), 'La imagen del cargador Tesla Universal Wall Connector debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'universal'") && catJs.includes("'magic'"), 'catalog.js debe incluir universal y magic en stem variants');
  assert.ok(catJs.includes("/\\b(universal\\s*wall\\s*connector|magic\\s*dock|j1772)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Tesla Universal Wall Connector');
});

test('Mejora demandada por usuarios: Switch Administrable MikroTik CRS326-24G-2S+RM (SUG-M3260)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M3260'") && seedCjs.includes("status: 'implemented'"), 'SUG-M3260 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M3260') && sugJs.includes('MikroTik CRS326-24G-2S+RM'), 'SUG-M3260 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_mikrotik_crs326_24g_2s_switch_rack'), 'backup_data.js debe contener redes_mikrotik_crs326_24g_2s_switch_rack');

  const mikrotikImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mikrotik-crs326-24g-2s-switch.webp');
  assert.ok(fs.existsSync(mikrotikImg), 'La imagen del switch MikroTik CRS326-24G-2S+RM debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'crs326'"), 'catalog.js debe incluir crs326 en stem variants');
  assert.ok(catJs.includes("/\\b(crs326|crs326-24g|crs32624g)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar MikroTik CRS326-24G-2S+RM');
});

test('Mejora demandada por usuarios: Timbre Inteligente 2K+ 5MP Ezviz DB2 Pro Batería (SUG-E2500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-E2500'") && seedCjs.includes("status: 'implemented'"), 'SUG-E2500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-E2500') && sugJs.includes('Ezviz DB2 Pro'), 'SUG-E2500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_ezviz_db2_pro_timbre_inteligente'), 'backup_data.js debe contener seguridad_ezviz_db2_pro_timbre_inteligente');

  const ezvizImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ezviz-db2-pro-timbre-camara.webp');
  assert.ok(fs.existsSync(ezvizImg), 'La imagen del timbre Ezviz DB2 Pro debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'db2'"), 'catalog.js debe incluir db2 en stem variants');
  assert.ok(catJs.includes("/\\b(db2|db2\\s*pro|db2pro)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Ezviz DB2 Pro');
});

test('Mejora demandada por usuarios: Cámara Web Empresarial Logitech BRIO 4K Pro Ultra HD (SUG-L4000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L4000'") && seedCjs.includes("status: 'implemented'"), 'SUG-L4000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L4000') && sugJs.includes('Logitech BRIO 4K Pro Ultra HD'), 'SUG-L4000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('equipos_logitech_brio_4k_pro_webcam'), 'backup_data.js debe contener equipos_logitech_brio_4k_pro_webcam');

  const brioImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'logitech-brio-4k-pro-webcam.webp');
  assert.ok(fs.existsSync(brioImg), 'La imagen de la webcam Logitech BRIO 4K Pro debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'brio'"), 'catalog.js debe incluir brio en stem variants');
  assert.ok(catJs.includes("/\\b(brio|brio\\s*4k|brio4k)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Logitech BRIO 4K Pro');
});

test('Mejora demandada por usuarios: Monitor Inteligente Samsung Smart Monitor M7 32" 4K UHD (SUG-S7320)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S7320'") && seedCjs.includes("status: 'implemented'"), 'SUG-S7320 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S7320') && sugJs.includes('Samsung Smart Monitor M7'), 'SUG-S7320 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_samsung_smart_monitor_m7_32_4k'), 'backup_data.js debe contener oficina_samsung_smart_monitor_m7_32_4k');

  const samsungImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'samsung-smart-monitor-m7-32-4k.webp');
  assert.ok(fs.existsSync(samsungImg), 'La imagen del Samsung Smart Monitor M7 32 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'m7'"), 'catalog.js debe incluir m7 en stem variants');
  assert.ok(catJs.includes("/\\b(m7|smart\\s*monitor\\s*m7|ls32dm702)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Samsung Smart Monitor M7 32');
});

test('Mejora demandada por usuarios: Tablet Corporativa Lenovo Tab M11 11" 90Hz WUXGA + Tab Pen (SUG-L1100)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L1100'") && seedCjs.includes("status: 'implemented'"), 'SUG-L1100 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L1100') && sugJs.includes('Lenovo Tab M11'), 'SUG-L1100 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_lenovo_tab_m11_tablet_corporativa'), 'backup_data.js debe contener oficina_lenovo_tab_m11_tablet_corporativa');

  const lenovoImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'lenovo-tab-m11-tablet-corporativa.webp');
  assert.ok(fs.existsSync(lenovoImg), 'La imagen de la tablet Lenovo Tab M11 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'tabm11'") && catJs.includes("'tabpen'"), 'catalog.js debe incluir tabm11 y tabpen en stem variants');
  assert.ok(catJs.includes("/\\b(tab\\s*m11|tabm11|m11)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Lenovo Tab M11');
});

test('Mejora demandada por usuarios: Monitor Profesional Ergonómico LG 27QN880-B Ergo 27" QHD IPS (SUG-L2788)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-L2788'") && seedCjs.includes("status: 'implemented'"), 'SUG-L2788 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-L2788') && sugJs.includes('LG 27QN880-B Ergo'), 'SUG-L2788 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_lg_27qn880_ergo_qhd_monitor'), 'backup_data.js debe contener oficina_lg_27qn880_ergo_qhd_monitor');

  const lgImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'lg-27qn880-ergo-qhd-monitor.webp');
  assert.ok(fs.existsSync(lgImg), 'La imagen del monitor LG Ergo 27QN880-B debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ergo'") && catJs.includes("'27qn880'"), 'catalog.js debe incluir ergo y 27qn880 en stem variants');
  assert.ok(catJs.includes("/\\b(27qn880|27qn880-b|ergo)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar LG Ergo 27QN880-B');
});

test('Mejora demandada por usuarios: Router Móvil Hotspot 5G Wi-Fi 6E Netgear Nighthawk M6 Pro (SUG-N6500)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N6500'") && seedCjs.includes("status: 'implemented'"), 'SUG-N6500 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N6500') && sugJs.includes('Netgear Nighthawk M6 Pro'), 'SUG-N6500 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_netgear_nighthawk_m6_pro_5g_router'), 'backup_data.js debe contener redes_netgear_nighthawk_m6_pro_5g_router');

  const netgearImg = path.join(projectRoot, 'img', 'productos', 'catalogo', 'netgear-nighthawk-m6-pro-5g-router.webp');
  assert.ok(fs.existsSync(netgearImg), 'La imagen del hotspot Netgear Nighthawk M6 Pro debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'m6pro'") && catJs.includes("'mr6500'"), 'catalog.js debe incluir m6pro y mr6500 en stem variants');
  assert.ok(catJs.includes("/\\b(m6\\s*pro|m6pro|mr6500)\\b/i.test(normalizedQuery)"), 'catalog.js debe priorizar Netgear Nighthawk M6 Pro');
});
