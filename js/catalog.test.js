const fs = require('fs');
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');

// Load the source code
const code = fs.readFileSync('./js/catalog.js', 'utf8');

// Create a sandbox environment mapping required global browser APIs
const sandbox = {
  document: {
    createElement: () => ({}),
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  },
  window: {
    addEventListener: () => {},
    localStorage: { getItem: () => null, setItem: () => {} },
    location: { search: '', pathname: '' }
  },
  console: console,
  Intl: Intl,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  URLSearchParams: URLSearchParams,
  parseFloat: parseFloat,
  Number: Number,
  String: String,
  encodeURIComponent: encodeURIComponent,
  Boolean: Boolean
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

test('catalog.js utility functions', async (t) => {
  await t.test('parsePriceToNumber should correctly extract numbers from price strings', () => {
    const { parsePriceToNumber } = sandbox;
    assert.strictEqual(parsePriceToNumber('RD$ 1,500.50'), 1500.50);
    assert.strictEqual(parsePriceToNumber('USD$ 99.99'), 99.99);
    assert.strictEqual(parsePriceToNumber('500'), 500);
    assert.strictEqual(parsePriceToNumber('Invalid Price'), 0);
    assert.strictEqual(parsePriceToNumber(null), 0);
    assert.strictEqual(parsePriceToNumber(undefined), 0);
  });

  await t.test('formatCurrency should correctly format numbers as DOP currency', () => {
    const { formatCurrency } = sandbox;
    const result = formatCurrency(1500.5);
    const cleanedResult = result.replace(/\s| /g, '');
    assert.ok(cleanedResult.includes('1500.50') || cleanedResult.includes('1,500.50') || cleanedResult.includes('1.500,50'), 'Unexpected formatting: ' + result);
  });

  await t.test('getFallbackImg should return correct image or fallback placeholder', () => {
    const { getFallbackImg } = sandbox;
    assert.strictEqual(getFallbackImg('cámaras de seguridad'), 'img/camaras.jpg');
    assert.strictEqual(getFallbackImg('CÁMARAS DE SEGURIDAD'), 'img/camaras.jpg');
    assert.strictEqual(getFallbackImg('unknown category'), 'img/placeholder.svg');
    assert.strictEqual(getFallbackImg(''), 'img/placeholder.svg');
  });

  await t.test('getDeptFallbackImg should return correct image or default fallback', () => {
    const { getDeptFallbackImg } = sandbox;
    assert.strictEqual(getDeptFallbackImg('seguridad'), 'img/camaras.jpg');
    assert.strictEqual(getDeptFallbackImg('redes'), 'img/redes.jpg');
    assert.strictEqual(getDeptFallbackImg('unknown'), 'img/placeholder.svg');
    assert.strictEqual(getDeptFallbackImg(''), 'img/placeholder.svg');
  });
});
