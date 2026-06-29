const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
const billing = fs.readFileSync(path.join(root, 'js', 'facturacion.js'), 'utf8');
const hosting = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));

test('las reglas de comandas no conceden escritura total a operadores', () => {
  const block = rules.match(/match \/panitas_table_orders\/\{tableId\} \{([\s\S]*?)\n    \}/);
  assert.ok(block, 'falta el bloque panitas_table_orders');
  assert.doesNotMatch(block[1], /allow read, create, update, delete/);
  assert.match(block[1], /isValidRestaurantTransition\(\)/);
  assert.match(block[1], /isValidRestaurantOrderVersion\(\)/);
  assert.match(block[1], /allow delete: if isPanitasAdmin\(\)/);
});

test('los eventos de comandas son inmutables', () => {
  assert.match(rules, /match \/panitas_order_events\/\{eventId\}/);
  assert.match(rules, /allow update: if false/);
  assert.match(rules, /data\.timestamp == request\.time/);
  assert.match(rules, /getAfter\(\/databases\/\$\(database\)\/documents\/panitas_table_orders\/\$\(data\.orderId\)\)/);
});

test('el KDS no construye onclick con identificadores de mesa', () => {
  assert.doesNotMatch(billing, /onclick=["'][^"']*updateKdsStatus\('\$\{table\}/);
  assert.match(billing, /addEventListener\('click', \(\) => updateKdsStatus\(table/);
});

test('la venta cierra la mesa dentro de la transacción', () => {
  assert.match(billing, /invoiced_and_closed/);
  assert.match(billing, /linkedInvoiceId: createdDocId/);
  assert.match(billing, /restaurantItemsChanged\(order\.items, billedRestaurantItems\)/);
  assert.doesNotMatch(billing, /collection\('panitas_table_orders'\)\.doc\(table\)\.delete\(\)/);
});

test('Hosting publica un artefacto aislado', () => {
  assert.equal(hosting.hosting.public, 'dist');
  assert.ok(hosting.hosting.predeploy.some(command => command.includes('prepare-hosting.mjs')));
  const csp = hosting.hosting.headers.flatMap(rule => rule.headers || [])
    .find(header => header.key === 'Content-Security-Policy').value;
  assert.match(csp, /https:\/\/rnc\.megaplus\.com\.do/);
  assert.match(csp, /https:\/\/cdnjs\.cloudflare\.com/);
  assert.match(csp, /tile\.openstreetmap\.org/);
  assert.doesNotMatch(csp, /localhost|127\.0\.0\.1/);
  const assetCache = hosting.hosting.headers
    .find(rule => rule.source.includes('css|js'))?.headers
    .find(header => header.key === 'Cache-Control')?.value || '';
  assert.doesNotMatch(assetCache, /immutable/);
});
