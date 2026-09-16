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
