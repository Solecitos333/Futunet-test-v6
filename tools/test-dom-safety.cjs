const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');

test('DOM Safety: openProductModal es seguro y no arroja excepciones en páginas sin modal', () => {
  const catalogJsPath = path.join(projectRoot, 'js', 'catalog.js');
  const catalogJsCode = fs.readFileSync(catalogJsPath, 'utf8');

  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="catalog-grid-container"></div></body></html>', {
    runScripts: 'outside-only'
  });
  const win = dom.window;

  win.mockDatabase = [{
    id: 'test-item-1',
    title: 'Producto de Prueba',
    brand: 'Futunet',
    price: 'RD$ 1,500.00',
    desc: 'Descripción de prueba'
  }];
  win.parsePrice = () => 1500;
  win.isServiceItem = () => false;
  win.isQuoteOnlyCatalogItem = () => false;
  win.closeMobileFilters = () => {};

  win.eval(catalogJsCode);

  assert.equal(typeof win.openProductModal, 'function');
  assert.doesNotThrow(() => {
    win.openProductModal('test-item-1');
  }, 'openProductModal no debe lanzar TypeError si #product-modal no existe en la página');
});

test('DOM Safety: checkout y renderStep3Summary en cart.js manejan ausencia de radios y campos de forma defensiva', () => {
  const cartJsPath = path.join(projectRoot, 'js', 'cart.js');
  const cartJsCode = fs.readFileSync(cartJsPath, 'utf8');

  assert.ok(
    cartJsCode.includes("const paymentMethod = checkedMethod ? checkedMethod.value : 'whatsapp';"),
    'cart.js debe verificar que el método de pago esté seleccionado sin acceder directamente a.value sobre null'
  );
  assert.ok(
    cartJsCode.includes("const chkForm = document.getElementById('cart-checkout-form');") &&
    cartJsCode.includes("if (chkForm) chkForm.reset();"),
    'cart.js debe verificar que cart-checkout-form exista antes de resetearlo'
  );
});

test('DOM Safety: facturacion.js maneja contenedor de paginación null sin excepción', () => {
  const factJsPath = path.join(projectRoot, 'js', 'facturacion.js');
  const factJsCode = fs.readFileSync(factJsPath, 'utf8');

  assert.ok(
    factJsCode.includes("const container = document.getElementById('invoices-pagination');") &&
    factJsCode.includes("if (!container) return;"),
    'renderPaginationControls debe verificar que invoices-pagination exista antes de manipularlo'
  );
});

test('Anchor & PWA: soporte.html contiene ancla estática #sp-cases y sw.js está en v32 con offline backup_data', () => {
  const soporteHtml = fs.readFileSync(path.join(projectRoot, 'soporte.html'), 'utf8');
  assert.ok(
    soporteHtml.includes('id="sp-cases"'),
    'soporte.html debe contener el id="sp-cases" para navegación estática accesible'
  );

  const swJs = fs.readFileSync(path.join(projectRoot, 'sw.js'), 'utf8');
  assert.ok(swJs.includes("const CACHE_NAME = 'futunet-cache-v32';"), 'sw.js debe estar en la versión futunet-cache-v32');
  assert.ok(swJs.includes("'./gaming.html'"), 'sw.js debe incluir gaming.html en OPTIONAL_ASSETS');
  assert.ok(swJs.includes("'./corporativo.html'"), 'sw.js debe incluir corporativo.html en OPTIONAL_ASSETS');
  assert.ok(swJs.includes("'./js/backup_data.js'"), 'sw.js debe incluir backup_data.js en OPTIONAL_ASSETS para resiliencia offline');
  assert.ok(!swJs.includes("event.request.url.includes('backup_data.js')"), 'sw.js no debe excluir backup_data.js de la respuesta de caché');
  assert.ok(swJs.includes("'./img/gaming/componentes/cpu-amd-ryzen-7-7800x3d.jpg'"), 'sw.js debe incluir componentes gaming en OPTIONAL_ASSETS');
});

test('Cart & Bundle: custom_office_bundle incluye department oficina y sincronización reactiva de eventos', () => {
  const cartJs = fs.readFileSync(path.join(projectRoot, 'js', 'cart.js'), 'utf8');
  assert.ok(
    cartJs.includes("department: 'oficina'"),
    'custom_office_bundle en cart.js debe incluir department oficina para cupones'
  );
  assert.ok(
    cartJs.includes("window.addEventListener('futunet-cart-updated'"),
    'cart.js debe escuchar futunet-cart-updated para sincronizar con el panel de usuario'
  );
  assert.ok(
    cartJs.includes("document.getElementById('close-checkout-modal')?.addEventListener"),
    'cart.js debe proteger el listener de close-checkout-modal'
  );
  assert.ok(
    cartJs.includes("addItem: function"),
    'cart.js debe exponer addItem en FutunetCart'
  );
  assert.ok(
    cartJs.includes("supplierInventory.getMergedCatalog"),
    'cart.js findProduct debe resolver productos desde supplierInventory'
  );
});

test('Forms & Security: Las 7 páginas de servicios B2B incluyen honeypot y consentimiento de privacidad estático', () => {
  const serviceFiles = [
    'corporativo.html',
    'energia-climatizacion.html',
    'equipos-oficina.html',
    'redes-datos.html',
    'infraestructura-remozamiento.html',
    'seguridad-electronica.html',
    'mobiliario-suministros.html'
  ];

  serviceFiles.forEach(file => {
    const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
    assert.ok(
      content.includes('name="_hp_security_check"'),
      `${file} debe contener el campo honeypot _hp_security_check estático`
    );
    assert.ok(
      content.includes('id="req-privacy-consent"'),
      `${file} debe contener la casilla de privacidad req-privacy-consent estática`
    );
  });
});

test('DOM Safety: suggestions, chatbot, public-quote, facturacion y gaming manejan elementos null defensivamente', () => {
  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes("document.getElementById('sug-title')?.value"), 'suggestions.js debe usar optional chaining');

  const chatJs = fs.readFileSync(path.join(projectRoot, 'js', 'chatbot.js'), 'utf8');
  assert.ok(chatJs.includes("document.getElementById('cb-ticket')?.addEventListener"), 'chatbot.js debe proteger listener de tickets');

  const quoteJs = fs.readFileSync(path.join(projectRoot, 'js', 'public-quote.js'), 'utf8');
  assert.ok(quoteJs.includes("document.getElementById('quote-response-form')?.addEventListener"), 'public-quote.js debe proteger listener del formulario');

  const facturacionJs = fs.readFileSync(path.join(projectRoot, 'js', 'facturacion.js'), 'utf8');
  assert.ok(facturacionJs.includes("if (shareButton)"), 'facturacion.js debe comprobar que shareButton exista antes de replaceWith');
  assert.ok(facturacionJs.includes("if (historyButton)"), 'facturacion.js debe comprobar que historyButton exista antes de replaceWith');

  const gamingJs = fs.readFileSync(path.join(projectRoot, 'js', 'gaming.js'), 'utf8');
  assert.ok(gamingJs.includes("window.FutunetCart.openDrawer()"), 'gaming.js addToCart debe abrir el drawer del carrito');
});

test('Catalog Image Assets: Todas las imágenes de backup_data.js y supplier_inventory.js existen en disco', () => {
  const code = fs.readFileSync(path.join(projectRoot, 'js', 'supplier_inventory.js'), 'utf8');
  let window = {};
  var mockDatabase = [];
  eval(code);

  const catalog = window.supplierInventory.getMergedCatalog();
  const missing = [];
  catalog.forEach(p => {
    if (p.img && !p.img.startsWith('http') && !p.img.startsWith('data:')) {
      const imgPath = path.join(projectRoot, p.img.replace(/^\//, ''));
      if (!fs.existsSync(imgPath)) {
        missing.push({ id: p.id, img: p.img });
      }
    }
  });

  assert.strictEqual(missing.length, 0, `Imágenes faltantes encontradas: ${JSON.stringify(missing)}`);
});

test('Catalog Resilience & Offline Fallback: backup_data export y resiliencia de catálogo sin Firebase', () => {
  // 1. backup_data.js no debe fallar en Node (sin window global) y debe exportar un catálogo completo
  const backupProducts = require(path.join(projectRoot, 'js', 'backup_data.js'));
  assert.ok(Array.isArray(backupProducts), 'backup_data.js debe exportar un array');
  assert.ok(backupProducts.length >= 300, `backup_data debe contener al menos 300 productos (actual: ${backupProducts.length})`);

  // 2. inventory_data.js debe implementar getLocalFallbackList y no vaciar productos en offline fallback
  const invJs = fs.readFileSync(path.join(projectRoot, 'js', 'inventory_data.js'), 'utf8');
  assert.ok(invJs.includes('getLocalFallbackList()'), 'inventory_data.js debe implementar getLocalFallbackList()');
  assert.ok(!invJs.includes("publishProducts([], 'local-fallback')"), 'inventory_data.js no debe vaciar el catálogo con array vacío en local-fallback');

  // 3. index.html, catalogo.html, producto.html y páginas de marcas deben cargar backup_data.js antes de inventory_data.js
  const idxHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const catHtml = fs.readFileSync(path.join(projectRoot, 'catalogo.html'), 'utf8');
  const prodHtml = fs.readFileSync(path.join(projectRoot, 'producto.html'), 'utf8');
  assert.ok(idxHtml.includes('backup_data.js'), 'index.html debe cargar backup_data.js');
  assert.ok(catHtml.includes('backup_data.js'), 'catalogo.html debe cargar backup_data.js');
  assert.ok(prodHtml.includes('backup_data.js'), 'producto.html debe cargar backup_data.js');
  assert.ok(
    idxHtml.indexOf('backup_data.js') < idxHtml.indexOf('inventory_data.js'),
    'index.html debe cargar backup_data.js antes de inventory_data.js'
  );
  assert.ok(
    catHtml.indexOf('backup_data.js') < catHtml.indexOf('inventory_data.js'),
    'catalogo.html debe cargar backup_data.js antes de inventory_data.js'
  );
  assert.ok(
    prodHtml.indexOf('backup_data.js') < prodHtml.indexOf('inventory_data.js'),
    'producto.html debe cargar backup_data.js antes de inventory_data.js'
  );

  const brandFiles = fs.readdirSync(projectRoot).filter(f => f.startsWith('marca-') && f.endsWith('.html'));
  for (const bFile of brandFiles) {
    const bHtml = fs.readFileSync(path.join(projectRoot, bFile), 'utf8');
    assert.ok(bHtml.includes('backup_data.js'), `${bFile} debe cargar backup_data.js`);
    assert.ok(
      bHtml.indexOf('backup_data.js') < bHtml.indexOf('inventory_data.js'),
      `${bFile} debe cargar backup_data.js antes de inventory_data.js`
    );
  }

  // 4. cart.js debe consultar window.backupDatabase y proteger checkout con AbortController
  const cartJs = fs.readFileSync(path.join(projectRoot, 'js', 'cart.js'), 'utf8');
  assert.ok(cartJs.includes('window.backupDatabase'), 'cart.js findProduct debe buscar en window.backupDatabase');
  assert.ok(cartJs.includes('AbortController'), 'cart.js checkout debe usar AbortController contra demoras de red');
  assert.ok(cartJs.includes('backendFailed'), 'cart.js checkout debe permitir fallback a WhatsApp directo si backend demora');
});

test('Node.js & Data Integrity: supplier_inventory.js es modular sin window y prod_ad1d2a977b no contiene papelería', () => {
  // 1. supplier_inventory.js se puede requerir en Node.js de forma limpia
  const suppModule = require('../js/supplier_inventory.js');
  assert.ok(suppModule && suppModule.supplierInventory, 'supplier_inventory.js debe exportar supplierInventory');
  assert.ok(typeof suppModule.supplierInventory.getMergedCatalog === 'function', 'getMergedCatalog debe ser función');

  // 2. prod_ad1d2a977b tiene descripción técnica genuina de Apple AirPods (no papelería)
  const cat = require('../js/backup_data.js');
  const airpods = cat.find(p => p.id === 'prod_ad1d2a977b');
  assert.ok(airpods, 'prod_ad1d2a977b debe existir en el catálogo');
  assert.ok(airpods.brand === 'Apple', 'La marca debe ser Apple');
  assert.ok(airpods.desc.includes('AirPods'), 'La descripción debe mencionar AirPods');
  assert.ok(!airpods.desc.toLowerCase().includes('papelería'), 'No debe contener texto de papelería');
  assert.ok(!airpods.desc.toLowerCase().includes('escolar'), 'No debe contener texto escolar');
  assert.ok(Array.isArray(airpods.specs) && airpods.specs.some(s => s.includes('Apple H1')), 'Debe incluir specs de chip Apple H1');
});

test('Catalog Search Stemming: gamer, gamers, pc gamer y pantalla coinciden con productos relevantes', () => {
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  const fn = new Function(`
    ${catJs.slice(catJs.indexOf('function normalizeSearch'), catJs.indexOf('const state ='))}
    return { normalizeSearch, scoreProductMatch };
  `);
  const { normalizeSearch, scoreProductMatch } = fn();

  const cat = require('../js/backup_data.js');

  const gamerMatches = cat.filter(p => scoreProductMatch(p, normalizeSearch('gamer')) > 0);
  assert.ok(gamerMatches.length > 0, 'La búsqueda "gamer" debe arrojar resultados de gaming');

  const gamersMatches = cat.filter(p => scoreProductMatch(p, normalizeSearch('gamers')) > 0);
  assert.ok(gamersMatches.length > 0, 'La búsqueda "gamers" debe arrojar resultados de gaming');

  const pantallaMatches = cat.filter(p => scoreProductMatch(p, normalizeSearch('pantalla dell')) > 0);
  assert.ok(pantallaMatches.length > 0, 'La búsqueda "pantalla dell" debe arrojar monitores/laptops Dell');

  const airpodsMatches = cat.filter(p => scoreProductMatch(p, normalizeSearch('audifonos apple')) > 0);
  assert.ok(airpodsMatches.some(p => p.id === 'prod_ad1d2a977b'), 'La búsqueda "audifonos apple" debe incluir AirPods');
});

test('Catalog POS, Dahua & Energy Search Precision: scanner, gaveta, dahua e inversor', () => {
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  const fn = new Function(`
    ${catJs.slice(catJs.indexOf('function normalizeSearch'), catJs.indexOf('const state ='))}
    return { normalizeSearch, scoreProductMatch };
  `);
  const { normalizeSearch, scoreProductMatch } = fn();

  const cat = require('../js/backup_data.js');

  // 1. Escáner de código de barras
  const scannerMatches = cat
    .map(p => ({ p, score: scoreProductMatch(p, normalizeSearch('scanner')) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  assert.ok(scannerMatches.length > 0, 'La búsqueda "scanner" debe arrojar resultados');
  assert.ok(
    scannerMatches[0].p.id === 'pos_lector_codigo_barra_2d',
    'El primer resultado para "scanner" debe ser el lector de códigos de barra POS'
  );

  // 2. Gaveta de dinero
  const gavetaMatches = cat
    .map(p => ({ p, score: scoreProductMatch(p, normalizeSearch('gaveta de dinero')) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  assert.ok(gavetaMatches.length > 0, 'La búsqueda "gaveta de dinero" debe arrojar resultados');
  assert.ok(
    gavetaMatches[0].p.id === 'pos_gaveta_dinero_metalica',
    'El primer resultado para "gaveta de dinero" debe ser la gaveta metálica RJ11'
  );

  // 3. Dahua CCTV
  const dahuaMatches = cat
    .map(p => ({ p, score: scoreProductMatch(p, normalizeSearch('dahua')) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  assert.ok(dahuaMatches.length >= 3, 'La búsqueda "dahua" debe encontrar al menos 3 productos Dahua');
  assert.ok(dahuaMatches[0].p.brand === 'Dahua', 'El primer resultado para "dahua" debe ser de marca Dahua');

  // 4. Inversor y energía
  const inversorMatches = cat
    .map(p => ({ p, score: scoreProductMatch(p, normalizeSearch('inversor')) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  assert.ok(inversorMatches.length > 0, 'La búsqueda "inversor" debe arrojar resultados');
  assert.ok(
    !inversorMatches[0].p.title.toLowerCase().includes('aspiradora'),
    'El primer resultado para "inversor" no debe ser una aspiradora'
  );
  assert.ok(
    inversorMatches[0].p.title.includes('UPS') || inversorMatches[0].p.department === 'energia',
    'El primer resultado para "inversor" debe ser un equipo de respaldo/UPS'
  );
});

test('Estabilidad y Resiliencia: auth defensivo, cupones Q4, carga de producto y redirección a marcas', () => {
  // 1. auth.js protege contra getAuth() null y FieldValue sin error
  const authJs = fs.readFileSync(path.join(projectRoot, 'js', 'auth.js'), 'utf8');
  assert.ok(
    authJs.includes('var auth = getAuth();') && authJs.includes('var user = auth ? auth.currentUser : null;'),
    'auth.js isLoggedIn debe verificar auth antes de acceder a currentUser'
  );
  assert.ok(
    authJs.includes('var authInstance = getAuth();') && authJs.includes('(authInstance && authInstance.currentUser) || user'),
    'auth.js refreshAuthenticatedSession debe usar comprobación segura en currentUser'
  );

  // 2. producto.js implementa try/catch defensivo en initProductPageLoader
  const prodJs = fs.readFileSync(path.join(projectRoot, 'js', 'producto.js'), 'utf8');
  assert.ok(
    prodJs.includes('initProductPageLoader: Fallo al esperar readyPromise'),
    'producto.js debe manejar rechazos de readyPromise con try/catch defensivo'
  );

  // 3. cart.js incluye cupón OCTUBRE2026 y comprobación de array de departamentos
  const cartJs = fs.readFileSync(path.join(projectRoot, 'js', 'cart.js'), 'utf8');
  assert.ok(cartJs.includes('OCTUBRE2026'), 'cart.js debe incluir el cupón OCTUBRE2026 para octubre 2026');
  assert.ok(
    cartJs.includes('Array.isArray(activeCoupon.departments) && activeCoupon.departments.includes(product.department)'),
    'cart.js debe verificar que activeCoupon.departments sea un array'
  );

  // 4. login.html permite redirecciones a páginas de marcas
  const loginHtml = fs.readFileSync(path.join(projectRoot, 'login.html'), 'utf8');
  assert.ok(
    loginHtml.includes("redirectFile.startsWith('marca-') && redirectFile.endsWith('.html')"),
    'login.html debe permitir redirecciones locales a marca-*.html'
  );

  // 5. public-quote.js verifica elementos DOM de loading y error
  const quoteJs = fs.readFileSync(path.join(projectRoot, 'js', 'public-quote.js'), 'utf8');
  assert.ok(
    quoteJs.includes("const loadEl = document.getElementById('quote-loading');") &&
    quoteJs.includes('if (loadEl) loadEl.hidden = true;'),
    'public-quote.js fail() debe comprobar existencia de elementos DOM'
  );

  // 6. user-panel.js sanitiza el nombre de carritos guardados
  const userPanelJs = fs.readFileSync(path.join(projectRoot, 'js', 'user-panel.js'), 'utf8');
  assert.ok(
    userPanelJs.includes('sanitizeProfileInput(name.trim()).slice(0, 60)'),
    'user-panel.js debe sanitizar y delimitar la longitud del nombre del carrito'
  );
});


