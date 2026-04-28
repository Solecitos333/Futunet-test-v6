const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');

// Setup JSDOM to provide a real DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="catalog-grid-container"></div></body></html>', {
  url: "http://localhost" // Provide a URL to avoid opaque origin errors for localStorage
});
global.document = dom.window.document;
global.window = dom.window;

// Use vm module to evaluate the file cleanly
const vm = require('vm');
const catalogCode = fs.readFileSync('js/catalog.js', 'utf8');

const script = new vm.Script(catalogCode);
const context = vm.createContext({
  document: global.document,
  window: global.window,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  console: console,
  Intl: Intl,
  URLSearchParams: URLSearchParams,
  mockDatabase: [] // Mock the expected database
});
script.runInContext(context);

// Extract the function from the context
const escapeHTML = context.escapeHTML;

test('escapeHTML handles empty strings', () => {
  assert.strictEqual(escapeHTML(''), '');
});

test('escapeHTML returns normal text unchanged', () => {
  assert.strictEqual(escapeHTML('Hello world'), 'Hello world');
});

test('escapeHTML escapes basic HTML tags', () => {
  assert.strictEqual(escapeHTML('<div>test</div>'), '&lt;div&gt;test&lt;/div&gt;');
  assert.strictEqual(escapeHTML('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('escapeHTML escapes multiple tags and attributes', () => {
  const input = '<a href="javascript:alert(\'xss\')">Click & see</a>';
  // Note: browser textContent -> innerHTML does NOT escape quotes!
  const expected = '&lt;a href="javascript:alert(\'xss\')"&gt;Click &amp; see&lt;/a&gt;';
  assert.strictEqual(escapeHTML(input), expected);
});

test('escapeHTML escapes ampersands', () => {
  assert.strictEqual(escapeHTML('Tom & Jerry'), 'Tom &amp; Jerry');
});

test('escapeHTML does NOT escape single and double quotes (browser behavior)', () => {
  assert.strictEqual(escapeHTML('"double" and \'single\''), '"double" and \'single\'');
});

test('escapeHTML handles numeric values gracefully by stringifying them', () => {
  assert.strictEqual(escapeHTML(123), '123');
  assert.strictEqual(escapeHTML(0), '0');
});

test('escapeHTML handles null and undefined by converting them to empty string in jsdom', () => {
  assert.strictEqual(escapeHTML(null), '');
  assert.strictEqual(escapeHTML(undefined), '');
});
