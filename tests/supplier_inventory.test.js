const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { JSDOM } = require('jsdom');

test('normalizeCopy function from supplier_inventory.js', async (t) => {
  // Set up JSDOM environment
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

  // Set up sandbox context with a fake window and document to evaluate script
  const sandbox = {
    window: dom.window,
    document: dom.window.document,
    mockDatabase: [], // Mock global used in script
    console: console,
    Array: Array,
    Object: Object,
    String: String,
    Set: Set
  };

  vm.createContext(sandbox);

  // Read the script file
  const scriptContent = fs.readFileSync(path.join(__dirname, '../js/supplier_inventory.js'), 'utf-8');

  // Run the script in the context
  const script = new vm.Script(scriptContent);
  script.runInContext(sandbox);

  // Retrieve the exposed function
  const supplierInventory = sandbox.window.supplierInventory;
  const normalizeCopy = supplierInventory.normalizeCopy;

  await t.test('should return empty string for null, undefined or empty string', () => {
    assert.strictEqual(normalizeCopy(null), '');
    assert.strictEqual(normalizeCopy(undefined), '');
    assert.strictEqual(normalizeCopy(''), '');
  });

  await t.test('should correctly replace misencoded characters to correct accents', () => {
    assert.strictEqual(normalizeCopy('Ãƒ¡'), 'á');
    assert.strictEqual(normalizeCopy('ÃƒÂ©'), 'é');
    assert.strictEqual(normalizeCopy('ÃƒÂ­'), 'í');
    assert.strictEqual(normalizeCopy('ÃƒÂ³'), 'ó');
    assert.strictEqual(normalizeCopy('ÃƒÂº'), 'ú');
    assert.strictEqual(normalizeCopy('ÃƒÂ±'), 'ñ');
    assert.strictEqual(normalizeCopy('ÃƒÂ\x81'), 'Á'); // Using hex code for invisible chars might be needed, testing literal string from original source
    assert.strictEqual(normalizeCopy('Ãƒâ€°'), 'Ã‰');
    assert.strictEqual(normalizeCopy('ÃƒÂ\x8D'), 'Í'); // Í replacement
    assert.strictEqual(normalizeCopy('Ãƒâ€œ'), 'Ã“');
    assert.strictEqual(normalizeCopy('ÃƒÅ¡'), 'Ãš');
  });

  await t.test('should handle quotes properly', () => {
    assert.strictEqual(normalizeCopy('Ã¢â‚¬â€œ'), 'â€“');
    assert.strictEqual(normalizeCopy('Ã¢â‚¬â€\x9D'), 'â€”'); // Using matching replacement logic
  });

  await t.test('should strip Â characters completely', () => {
    assert.strictEqual(normalizeCopy('Ã‚'), '');
  });

  await t.test('should trim the string', () => {
    assert.strictEqual(normalizeCopy('  test string  '), 'test string');
  });

  await t.test('should handle mixed typical string with multiple fixes', () => {
    const input = '  Laptop con Ãƒ¡ y ÃƒÂ© en descripciÃƒÂ³n Ã‚  ';
    const expected = 'Laptop con á y é en descripción';
    assert.strictEqual(normalizeCopy(input), expected);
  });
});
