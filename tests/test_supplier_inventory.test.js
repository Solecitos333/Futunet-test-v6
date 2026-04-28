const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Read the source file
const sourceCode = fs.readFileSync(path.join(__dirname, '../js/supplier_inventory.js'), 'utf-8');

// Extract the slugify function using regex to test it in isolation without polluting globals or modifying the original file
const match = sourceCode.match(/function slugify\s*\([^)]*\)\s*\{[\s\S]*?^  \}/m);
if (!match) throw new Error("Could not find slugify function");

const context = vm.createContext({});
vm.runInContext(match[0] + '\nthis.slugify = slugify;', context);
const slugify = context.slugify;

test('slugify tests', async (t) => {
  await t.test('converts basic string to lowercase and spaces to hyphens', () => {
    assert.strictEqual(slugify('Hello World'), 'hello-world');
  });

  await t.test('removes accents and diacritics', () => {
    assert.strictEqual(slugify('Café au Lait'), 'cafe-au-lait');
    assert.strictEqual(slugify('mañana será otro día'), 'manana-sera-otro-dia');
  });

  await t.test('removes special characters', () => {
    assert.strictEqual(slugify('Product #123! @Discount'), 'product-123-discount');
  });

  await t.test('handles empty and null values', () => {
    assert.strictEqual(slugify(''), '');
    assert.strictEqual(slugify(null), '');
    assert.strictEqual(slugify(undefined), '');
  });

  await t.test('removes leading and trailing hyphens', () => {
    assert.strictEqual(slugify('---hello---world---'), 'hello-world');
  });

  await t.test('collapses multiple hyphens', () => {
    assert.strictEqual(slugify('hello     world'), 'hello-world');
    assert.strictEqual(slugify('hello---world'), 'hello-world');
  });

  await t.test('keeps numbers intact', () => {
    assert.strictEqual(slugify('Product 2024 V2.0'), 'product-2024-v2-0');
  });
});
