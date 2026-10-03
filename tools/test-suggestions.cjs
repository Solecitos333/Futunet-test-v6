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








