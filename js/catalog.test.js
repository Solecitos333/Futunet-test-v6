const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

test('formatCartQuantity correctly formats quantities', (t) => {
  const code = fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8');

  // Set up a basic DOM environment so that browser-specific API calls don't fail when evaling catalog.js
  const dom = new JSDOM(`<!DOCTYPE html><html><body>
    <div id="cart-fab"></div>
    <div id="cart-count"></div>
    <div id="cart-fab-label"></div>
    <div id="cart-fab-label-count"></div>
    <div id="cart-fab-label-copy"></div>
    <div id="cart-drawer"></div>
  </body></html>`, { url: 'http://localhost/' });

  // Mock global objects that catalog.js expects
  global.document = dom.window.document;
  global.window = dom.window;
  global.localStorage = dom.window.localStorage;
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Evaluate the code in the current context so formatCartQuantity becomes globally available
  eval(code);

  assert.strictEqual(typeof formatCartQuantity, 'function', 'formatCartQuantity should be defined');

  // Test cases covering 0, 1, 2, 10, and negative numbers
  assert.strictEqual(formatCartQuantity(0), '0 artículos', 'Should handle zero correctly (plural)');
  assert.strictEqual(formatCartQuantity(1), '1 artículo', 'Should handle exactly one correctly (singular)');
  assert.strictEqual(formatCartQuantity(2), '2 artículos', 'Should handle plural correctly');
  assert.strictEqual(formatCartQuantity(10), '10 artículos', 'Should handle larger numbers correctly');
  assert.strictEqual(formatCartQuantity(-1), '-1 artículos', 'Should handle negative numbers correctly');
});
