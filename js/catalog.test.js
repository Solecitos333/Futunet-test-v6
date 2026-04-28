const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

test('catalog.js - loadCartState error path', () => {
  const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><body></body></html>`, {
    url: "http://localhost"
  });

  const sandbox = {
    window: dom.window,
    document: dom.window.document,
    console: {
      warn: (msg, err) => {
        sandbox._warnArgs = [msg, err];
      }
    },
    // Required globals for catalog.js
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Intl: Intl,
    URLSearchParams: dom.window.URLSearchParams,
    Number: Number,
    Math: Math,
    Object: Object,
    String: String,
    JSON: JSON,
    parseFloat: parseFloat,
    encodeURIComponent: encodeURIComponent,
    mockDatabase: [],
    updateInlineCartButtons: () => {}
  };

  vm.createContext(sandbox);

  const code = fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8');
  const script = new vm.Script(code);
  script.runInContext(sandbox);

  // Set up mock window.localStorage to throw error
  Object.defineProperty(sandbox.window, 'localStorage', {
    value: {
      getItem: () => {
        throw new Error('Storage access denied');
      },
      setItem: () => {}
    },
    writable: true
  });

  // Verify cartState before
  const cartStateBeforeStr = vm.runInContext('JSON.stringify(cartState.items)', sandbox);
  assert.strictEqual(cartStateBeforeStr, '{}');

  // Run the function
  vm.runInContext('loadCartState()', sandbox);

  // Verify the warning was logged correctly
  assert.strictEqual(sandbox._warnArgs[0], 'No se pudo cargar el carrito:');
  assert.strictEqual(sandbox._warnArgs[1].message, 'Storage access denied');

  // Verify cartState remains unchanged
  const cartStateAfterStr = vm.runInContext('JSON.stringify(cartState.items)', sandbox);
  assert.strictEqual(cartStateAfterStr, '{}');
});
