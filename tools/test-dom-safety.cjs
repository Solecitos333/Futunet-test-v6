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

test('Anchor & PWA: soporte.html contiene ancla estática #sp-cases y sw.js está en v35 con offline backup_data', () => {
  const soporteHtml = fs.readFileSync(path.join(projectRoot, 'soporte.html'), 'utf8');
  assert.ok(
    soporteHtml.includes('id="sp-cases"'),
    'soporte.html debe contener el id="sp-cases" para navegación estática accesible'
  );

  const swJs = fs.readFileSync(path.join(projectRoot, 'sw.js'), 'utf8');
  assert.ok(swJs.includes("const CACHE_NAME = 'futunet-cache-v37';"), 'sw.js debe estar en la versión futunet-cache-v37');
  assert.ok(swJs.includes("'./gaming.html'"), 'sw.js debe incluir gaming.html en OPTIONAL_ASSETS');
  assert.ok(swJs.includes("'./corporativo.html'"), 'sw.js debe incluir corporativo.html en OPTIONAL_ASSETS');
  assert.ok(swJs.includes("'./mi-cuenta.html'"), 'sw.js debe incluir mi-cuenta.html en OPTIONAL_ASSETS');
  assert.ok(swJs.includes("'./js/user-panel.js'"), 'sw.js debe incluir user-panel.js en OPTIONAL_ASSETS');
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

  // 3. cart.js incluye cupones OCTUBRE2026 y CONTINUIDAD2026 y comprobación de array de departamentos
  const cartJs = fs.readFileSync(path.join(projectRoot, 'js', 'cart.js'), 'utf8');
  assert.ok(cartJs.includes('OCTUBRE2026'), 'cart.js debe incluir el cupón OCTUBRE2026 para octubre 2026');
  assert.ok(cartJs.includes('CONTINUIDAD2026'), 'cart.js debe incluir el cupón CONTINUIDAD2026 para la semana de continuidad');
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

test('Resiliencia de Ciclo de Vida: Inicialización universal con document.readyState y control de carga diferida', () => {
  const filesToCheck = [
    { path: 'login.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'punto-de-venta.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'sugerencias.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'mi-cuenta.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'facturacion.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'admin.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'index.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'energia-climatizacion.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'equipos-oficina.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'redes-datos.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'seguridad-electronica.html', pattern: "if (document.readyState === 'loading')" },
    { path: '404.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'catalogo.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'producto.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'corporativo.html', pattern: "if (document.readyState === 'loading')" },
    { path: 'js/form.js', pattern: "if (document.readyState === 'loading')" },
    { path: 'js/admin-financing.js', pattern: "if (document.readyState === 'loading')" },
    { path: 'js/chatbot-settings.js', pattern: "if (document.readyState === 'loading')" },
    { path: 'js/internet-plans.js', pattern: "if (document.readyState === 'loading')" }
  ];

  filesToCheck.forEach(({ path: filePath, pattern }) => {
    const content = fs.readFileSync(path.join(projectRoot, filePath), 'utf8');
    assert.ok(
      content.includes(pattern),
      `${filePath} debe implementar inicialización resiliente verificando document.readyState`
    );
  });
});

test('Precisión de Búsqueda Biométrica y Sincronización de Perfil: ZKTeco, cupones y checkout', () => {
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  const fn = new Function(`
    ${catJs.slice(catJs.indexOf('function normalizeSearch'), catJs.indexOf('const state ='))}
    return { normalizeSearch, scoreProductMatch };
  `);
  const { normalizeSearch, scoreProductMatch } = fn();
  const cat = require('../js/backup_data.js');

  // 1. "biometrico" prioriza terminal biométrica sobre cerraduras o accesorios
  const bioMatches = cat
    .map(p => ({ p, score: scoreProductMatch(p, normalizeSearch('biometrico')) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  assert.ok(bioMatches.length > 0, 'La búsqueda "biometrico" debe arrojar resultados');
  assert.ok(
    bioMatches[0].p.id === 'zkteco_mb20_terminal_biometrica',
    'El resultado prioritario para "biometrico" debe ser la terminal biométrica ZKTeco'
  );
  assert.ok(
    !bioMatches[0].p.title.toLowerCase().includes('cerradura'),
    'El primer resultado para "biometrico" no debe ser una cerradura'
  );

  // 2. "zkteco" prioriza equipos biométricos principales
  const zkMatches = cat
    .map(p => ({ p, score: scoreProductMatch(p, normalizeSearch('zkteco')) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  assert.ok(zkMatches.length > 0, 'La búsqueda "zkteco" debe arrojar resultados');
  assert.ok(
    zkMatches[0].p.id === 'zkteco_mb20_terminal_biometrica',
    'El resultado prioritario para "zkteco" debe ser la terminal biométrica ZKTeco MB20'
  );

  // 3. cart.js maneja Enter en cupón y verifica defensivamente secciones del step 3
  const cartJs = fs.readFileSync(path.join(projectRoot, 'js', 'cart.js'), 'utf8');
  assert.ok(
    cartJs.includes("couponInput.addEventListener('keydown'"),
    'cart.js debe manejar el evento keydown en couponInput para aplicar cupones con Enter'
  );
  assert.ok(
    cartJs.includes('if (bankSection) bankSection.style.display') &&
    cartJs.includes('if (whatsappSection) whatsappSection.style.display') &&
    cartJs.includes('if (financingSection) financingSection.style.display'),
    'cart.js debe verificar la existencia de secciones bancaria, whatsapp y financiamiento de forma defensiva'
  );

  // 4. user-panel.js sincroniza userData en memoria
  const userPanelJs = fs.readFileSync(path.join(projectRoot, 'js', 'user-panel.js'), 'utf8');
  assert.ok(
    userPanelJs.includes('Object.assign(userData, updateData);'),
    'user-panel.js debe actualizar userData en memoria con updateData antes de renderProfile()'
  );

  // 5. producto.js implementa fallbackCopy sin ventanas emergentes redundantes
  const prodJs = fs.readFileSync(path.join(projectRoot, 'js', 'producto.js'), 'utf8');
  assert.ok(
    prodJs.includes('function fallbackCopy(text)'),
    'producto.js debe definir fallbackCopy para copiado en portapapeles sin popup inesperado'
  );
});

test('Robustez & Mantenimiento Continuo: public-quote setText, image_fixes global export, fallbacks y accesibilidad', () => {
  // 1. public-quote.js define setText y gestiona visibilidad de documentView
  const quoteJs = fs.readFileSync(path.join(projectRoot, 'js', 'public-quote.js'), 'utf8');
  assert.ok(
    quoteJs.includes('function setText(id, text)'),
    'public-quote.js debe definir la función setText para evitar ReferenceError en render y fail'
  );
  assert.ok(
    quoteJs.includes('if (documentView) documentView.hidden = false;'),
    'public-quote.js debe mostrar documentView al renderizar cotización'
  );
  assert.ok(
    quoteJs.includes('if (docEl) docEl.hidden = true;'),
    'public-quote.js debe ocultar el documento al fallar la carga'
  );

  // 2. image_fixes.js exporta applyImageFixes sin return prematuro
  const imgFixesJs = fs.readFileSync(path.join(projectRoot, 'js', 'image_fixes.js'), 'utf8');
  assert.ok(
    !imgFixesJs.includes("if (typeof mockDatabase === 'undefined') return;"),
    'image_fixes.js no debe abortar prematuramente si mockDatabase aún no se ha declarado'
  );
  assert.ok(
    imgFixesJs.includes('window.applyImageFixes = applyFixes;'),
    'image_fixes.js debe exportar applyImageFixes globalmente para sincronización de Firestore'
  );

  // 3. product_detail_shared.js y cart.js contemplan FutunetData.products
  const prodSharedJs = fs.readFileSync(path.join(projectRoot, 'js', 'product_detail_shared.js'), 'utf8');
  assert.ok(
    prodSharedJs.includes('window.FutunetData.products'),
    'product_detail_shared.js debe consultar window.FutunetData.products en getCatalogData'
  );
  const cartJs = fs.readFileSync(path.join(projectRoot, 'js', 'cart.js'), 'utf8');
  assert.ok(
    cartJs.includes('window.FutunetData.products'),
    'cart.js debe consultar window.FutunetData.products en findProduct'
  );

  // 4. financing.js valida la existencia de button en el bloque finally
  const finJs = fs.readFileSync(path.join(projectRoot, 'js', 'financing.js'), 'utf8');
  assert.ok(
    /if\s*\(\s*button\s*\)\s*\{\s*button\.disabled\s*=\s*false;/.test(finJs),
    'financing.js debe verificar la existencia de button en el bloque finally de forma defensiva'
  );

  // 5. Soporte de tecla Escape en internet-portal, catalog y user-panel
  const portalJs = fs.readFileSync(path.join(projectRoot, 'js', 'internet-portal.js'), 'utf8');
  assert.ok(
    /e\.key\s*===\s*'Escape'\s*\)\s*\{\s*window\.closePortalModals\(\);/.test(portalJs),
    'internet-portal.js debe permitir cerrar modales con la tecla Escape'
  );
  const userPanelJs = fs.readFileSync(path.join(projectRoot, 'js', 'user-panel.js'), 'utf8');
  assert.ok(
    /e\.key\s*===\s*'Escape'\s*\)\s*\{\s*window\.closeUserOrderModal\(\);/.test(userPanelJs),
    'user-panel.js debe permitir cerrar el modal de detalle de pedido con Escape'
  );
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(
    catJs.includes("drop.classList.remove('active');") && catJs.includes("else if (e.key === 'Escape')"),
    'catalog.js debe cerrar el menú desplegable de búsqueda con Escape y al ejecutar búsqueda'
  );

  // 6. Resiliencia contra bloqueadores de popups en WhatsApp
  const formJs = fs.readFileSync(path.join(projectRoot, 'js', 'form.js'), 'utf8');
  assert.ok(
    /if\s*\(!win\s*\|\|\s*win\.closed/.test(formJs) && formJs.includes('window.location.href = waUrl;'),
    'form.js debe incorporar fallback de redirección para bloqueadores de ventanas emergentes'
  );
  const srvJs = fs.readFileSync(path.join(projectRoot, 'js', 'service-page.js'), 'utf8');
  assert.ok(
    /if\s*\(!win\s*\|\|\s*win\.closed/.test(srvJs) && srvJs.includes('window.location.href = waUrl;'),
    'service-page.js debe incorporar fallback de redirección para bloqueadores de ventanas emergentes'
  );

  // 7. login.html alterna icono de visibilidad de contraseña
  const loginHtml = fs.readFileSync(path.join(projectRoot, 'login.html'), 'utf8');
  assert.ok(
    loginHtml.includes('M17.94 17.94A10.07 10.07'),
    'login.html debe alternar visualmente al icono de ojo tachado al mostrar contraseña'
  );
});

test('DOM Safety & Resiliencia: internet-portal.js maneja vistas, modales y formularios de forma 100% null-safe', () => {
  const portalJs = fs.readFileSync(path.join(projectRoot, 'js', 'internet-portal.js'), 'utf8');

  // Vistas públicas y del cliente
  assert.ok(portalJs.includes('if (pubView) pubView.style.display'), 'showPublicView/showPortalView debe verificar pubView');
  assert.ok(portalJs.includes('if (portView) portView.style.display'), 'showPublicView/showPortalView debe verificar portView');
  assert.ok(portalJs.includes('if (card) card.style.display'), 'showPortalView/showNoClientView debe verificar card');
  assert.ok(portalJs.includes('if (noClient) noClient.style.display'), 'showPortalView/showNoClientView debe verificar noClient');

  // Modales
  assert.ok(portalJs.includes('window.openPaymentReportModal = function () {\n    var modal = document.getElementById(\'payment-report-modal\');\n    if (!modal) return;'), 'openPaymentReportModal debe verificar existencia del modal');
  assert.ok(portalJs.includes('window.openSupportModal = function (type) {\n    var modal = document.getElementById(\'support-modal\');\n    if (!modal) return;'), 'openSupportModal debe verificar existencia del modal');

  // Formulario y Stepper
  assert.ok(portalJs.includes('if (pName) pName.value = planName;'), 'selectHiringPlan debe verificar pName antes de asignar valor');
  assert.ok(portalJs.includes('if (pId) pId.value = planId;'), 'selectHiringPlan debe verificar pId antes de asignar valor');
  assert.ok(portalJs.includes('if (pLabel) pLabel.textContent = planName'), 'selectHiringPlan debe verificar pLabel antes de asignar textContent');

  // Buscador de FAQ
  assert.ok(portalJs.includes('var qText = qSpan ? qSpan.textContent.toLowerCase() : \'\';'), 'applyFaqFilters debe verificar qSpan');
  assert.ok(portalJs.includes('var aText = aP ? aP.textContent.toLowerCase() : \'\';'), 'applyFaqFilters debe verificar aP');
});

test('Brand Page Loader: reactividad a futunet:inventory-ready, aliases de marcas y banner único', () => {
  const loaderJs = fs.readFileSync(path.join(projectRoot, 'js', 'brand-page-loader.js'), 'utf8');

  // Reactividad
  assert.ok(loaderJs.includes("window.addEventListener('futunet:inventory-ready'"), 'brand-page-loader.js debe escuchar el evento futunet:inventory-ready');

  // Aliases de marcas
  assert.ok(loaderJs.includes("normP === 'zkteco' && normT === 'zk'"), 'matchesBrandLocal debe soportar equivalencia ZKTeco / ZK');
  assert.ok(loaderJs.includes("normP === 'westerndigital' && normT === 'wd'"), 'matchesBrandLocal debe soportar equivalencia Western Digital / WD');
  assert.ok(loaderJs.includes("normP.includes('schneider') || normP.includes('apc')"), 'matchesBrandLocal debe soportar equivalencia Schneider / APC');

  // Prevención de duplicados en banner
  assert.ok(loaderJs.includes("!document.querySelector('.cross-selling-banner')"), 'brand-page-loader.js debe evitar insertar banners de venta cruzada duplicados');
});

test('Estándares Web & CSP: Cero presencia de document.write en los 52 archivos HTML del sitio', () => {
  const htmlFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'));
  assert.ok(htmlFiles.length >= 50, `Deben existir al menos 50 archivos HTML (encontrados: ${htmlFiles.length})`);

  const filesWithDocWrite = [];
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
    if (content.includes('document.write')) {
      filesWithDocWrite.push(file);
    }
  });

  assert.strictEqual(
    filesWithDocWrite.length,
    0,
    `Archivos con document.write detectados: ${filesWithDocWrite.join(', ')}`
  );
});

test('Resiliencia URL & DOM: syncCatalogUrl, initFooterYear y escapeHTML global en marcas', () => {
  // 1. main.js usa querySelectorAll para actualizar todos los footer-year
  const mainJs = fs.readFileSync(path.join(projectRoot, 'js', 'main.js'), 'utf8');
  assert.ok(
    mainJs.includes("querySelectorAll('#footer-year, .footer-year')"),
    'main.js initFooterYear debe usar querySelectorAll para abarcar todos los elementos de año'
  );

  // 2. catalog.js syncCatalogUrl es resiliente a subrutas y pathname
  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(
    catJs.includes("window.location.pathname.toLowerCase().includes('catalogo')"),
    'catalog.js syncCatalogUrl debe admitir rutas con y sin extensión .html'
  );
  assert.ok(
    catJs.includes('${window.location.pathname}${query ? `?${query}` : \'\'}'),
    'catalog.js syncCatalogUrl debe preservar window.location.pathname en replaceState'
  );

  // 3. producto.js protege la construcción de imageUrl
  const prodJs = fs.readFileSync(path.join(projectRoot, 'js', 'producto.js'), 'utf8');
  assert.ok(
    prodJs.includes("imageUrl = new URL(detail.img || 'img/logo.webp', 'https://futunet.com.do/').href;"),
    'producto.js debe construir imageUrl usando base canónica con try/catch'
  );

  // 4. brand-page-loader.js normaliza aliases de Victron y Mitsubishi
  const loaderJs = fs.readFileSync(path.join(projectRoot, 'js', 'brand-page-loader.js'), 'utf8');
  assert.ok(
    loaderJs.includes("normP === 'victron' && normT === 'victronenergy'"),
    'brand-page-loader.js debe normalizar equivalencia Victron / Victron Energy'
  );
  assert.ok(
    loaderJs.includes("normP === 'mitsubishi' && normT === 'mitsubishielectric'"),
    'brand-page-loader.js debe normalizar equivalencia Mitsubishi / Mitsubishi Electric'
  );
});

test('Cobertura de marcas: las 26 páginas de marca cuentan con productos en catálogo y sin páginas huérfanas', () => {
  const brandFiles = fs.readdirSync(projectRoot).filter(f => f.startsWith('marca-') && f.endsWith('.html') && f !== 'marca-template.html');
  assert.equal(brandFiles.length, 26, 'Deben existir 26 páginas de marca en la plataforma');

  const products = require('../js/backup_data.js');
  const catJsContent = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');

  const vm = require('vm');
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  const start = catJsContent.indexOf('function matchesBrand');
  const end = catJsContent.indexOf('function fuzzyMatch');
  vm.runInContext(catJsContent.substring(start, end), sandbox);
  const matchesBrand = sandbox.matchesBrand;

  const emptyBrands = [];
  brandFiles.forEach(f => {
    const html = fs.readFileSync(path.join(projectRoot, f), 'utf8');
    const m = html.match(/data-brand-name="([^"]+)"/);
    assert.ok(m, `${f} debe incluir data-brand-name en document.body`);
    const brandName = m[1];
    const brandProducts = products.filter(p => matchesBrand(p.brand, brandName));
    if (brandProducts.length === 0) {
      emptyBrands.push({ file: f, brand: brandName });
    }
  });

  assert.equal(emptyBrands.length, 0, `Ninguna página de marca debe estar vacía. Encontradas vacías: ${JSON.stringify(emptyBrands)}`);
});

test('DOM Safety: admin-panel.js, erp-extensions.js, facturacion.js y ai-server.js libres de accesos no protegidos getElementById', () => {
  const filesToCheck = ['admin-panel.js', 'erp-extensions.js', 'ai-server.js', 'cart.js', 'form.js', 'internet-portal.js', 'facturacion.js'];
  const unsafePattern = /getElementById\([^)]+\)\.(value|innerText|innerHTML|addEventListener|focus|click)/;

  filesToCheck.forEach(filename => {
    const code = fs.readFileSync(path.join(projectRoot, 'js', filename), 'utf8');
    const lines = code.split('\n');
    const violations = [];
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      if (unsafePattern.test(line)) {
        violations.push({ line: index + 1, content: trimmed });
      }
    });
    assert.equal(violations.length, 0, `Archivo js/${filename} contiene accesos DOM no protegidos: ${JSON.stringify(violations)}`);
  });
});

test('Seguridad & DOM Safety: admin-financing.js abre documentos con noopener,noreferrer y facturacion.js implementa helpers null-safe', () => {
  const finJs = fs.readFileSync(path.join(projectRoot, 'js', 'admin-financing.js'), 'utf8');
  assert.ok(
    finJs.includes("window.open('', '_blank', 'noopener,noreferrer')"),
    'admin-financing.js debe abrir documentos protegidos con noopener,noreferrer'
  );

  const factJs = fs.readFileSync(path.join(projectRoot, 'js', 'facturacion.js'), 'utf8');
  assert.ok(
    factJs.includes('function getVal(id)') &&
    factJs.includes('function setVal(id, val)') &&
    factJs.includes('function getText(id)') &&
    factJs.includes('function setText(id, text)') &&
    factJs.includes('function setHTML(id, html)'),
    'facturacion.js debe definir los helpers utilitarios getVal, setVal, getText, setText y setHTML'
  );
});







