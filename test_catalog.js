const fs = require('fs');
const vm = require('vm');
const test = require('node:test');
const assert = require('node:assert');

const source = fs.readFileSync('js/catalog.js', 'utf8');

test('getNormalized caching works correctly', () => {
  const context = {
    document: { addEventListener: () => {} },
    window: { addEventListener: () => {} },
    mockDatabase: [
      { id: '1', title: 'Laptop Pro', desc: 'Powerful laptop', brand: 'TechBrand', category: 'Laptops' }
    ],
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    console: global.console
  };
  vm.createContext(context);
  vm.runInContext(source, context);

  const p = context.mockDatabase[0];
  const t1 = context.getNormalized(p, 'title');
  const t2 = context.getNormalized(p, 'title');

  assert.strictEqual(t1, 'laptop pro');
  assert.strictEqual(t1, t2); // Should be the exact same returned from cache

  const score = context.scoreProductMatch(p, 'laptop');
  assert.ok(score > 0);
});
