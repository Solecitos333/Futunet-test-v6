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

test('Anchor & PWA: soporte.html contiene ancla estática #sp-cases y sw.js está en v22 con cobertura ampliada', () => {
  const soporteHtml = fs.readFileSync(path.join(projectRoot, 'soporte.html'), 'utf8');
  assert.ok(
    soporteHtml.includes('id="sp-cases"'),
    'soporte.html debe contener el id="sp-cases" para navegación estática accesible'
  );

  const swJs = fs.readFileSync(path.join(projectRoot, 'sw.js'), 'utf8');
  assert.ok(swJs.includes("const CACHE_NAME = 'futunet-cache-v22';"), 'sw.js debe estar en la versión futunet-cache-v22');
  assert.ok(swJs.includes("'./gaming.html'"), 'sw.js debe incluir gaming.html en OPTIONAL_ASSETS');
  assert.ok(swJs.includes("'./corporativo.html'"), 'sw.js debe incluir corporativo.html en OPTIONAL_ASSETS');
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
});

test('Forms & Security: Las 6 páginas de servicios B2B incluyen honeypot y consentimiento de privacidad estático', () => {
  const serviceFiles = [
    'corporativo.html',
    'energia-climatizacion.html',
    'equipos-oficina.html',
    'redes-datos.html',
    'infraestructura-remozamiento.html',
    'seguridad-electronica.html'
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

test('DOM Safety: suggestions, chatbot y public-quote manejan elementos null defensivamente', () => {
  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes("document.getElementById('sug-title')?.value"), 'suggestions.js debe usar optional chaining');

  const chatJs = fs.readFileSync(path.join(projectRoot, 'js', 'chatbot.js'), 'utf8');
  assert.ok(chatJs.includes("document.getElementById('cb-ticket')?.addEventListener"), 'chatbot.js debe proteger listener de tickets');

  const quoteJs = fs.readFileSync(path.join(projectRoot, 'js', 'public-quote.js'), 'utf8');
  assert.ok(quoteJs.includes("document.getElementById('quote-response-form')?.addEventListener"), 'public-quote.js debe proteger listener del formulario');
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

