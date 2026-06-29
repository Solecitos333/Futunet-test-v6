const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'internet.html'), 'utf8');
const portal = fs.readFileSync(path.join(root, 'js', 'internet-portal.js'), 'utf8');
const catalogSource = fs.readFileSync(path.join(root, 'js', 'internet-plans.js'), 'utf8');
const eliteCss = fs.readFileSync(path.join(root, 'css', 'internet-elite.css'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

function loadCatalog() {
  const window = {};
  const document = { addEventListener() {} };
  vm.runInNewContext(catalogSource, { window, document, String, Number });
  return window.FutunetInternetCatalog;
}

test('el catálogo de Internet es único, consistente y conserva planes heredados', () => {
  const catalog = loadCatalog();
  const active = catalog.activePlans();
  assert.equal(active.length, 7);
  assert.equal(new Set(active.map(plan => plan.id)).size, active.length);
  assert.ok(active.every(plan => plan.price > 0 && plan.speed > 0));
  assert.equal(catalog.findById('400mb').legacy, true);
  assert.equal(catalog.findById('100mb').price, 1900);
});

test('la experiencia pública carga el diseño élite y sus rutas comerciales', () => {
  assert.match(html, /css\/internet-elite\.css/);
  assert.match(html, /js\/internet-plans\.js/);
  assert.match(html, /id="hero-coverage-input"/);
  assert.match(html, /data-internet-audience="hogar"/);
  assert.match(html, /data-internet-audience="empresas"/);
  assert.match(html, /internet-onboarding-grid/);
  assert.match(html, /id="claro-plans-grid" aria-live="polite"><\/div>/);
  assert.doesNotMatch(html, /class="claro-card claro-speedtest-card"/);
});

test('el portal diferencia invitado, prospecto y cliente activo', () => {
  assert.match(portal, /setInternetMode\('public'\)/);
  assert.match(portal, /setInternetMode\('prospect'\)/);
  assert.match(portal, /setInternetMode\('client'\)/);
  assert.match(portal, /FutunetInternetCatalog\.findById/);
  assert.match(portal, /getActiveCatalogPlan\(planId\)/);
  assert.match(portal, /loadPortalActivity\(\)/);
  assert.match(html, /id="portal-payments-list"/);
  assert.match(html, /id="portal-tickets-list"/);
});

test('los controles principales son accesibles y no dependen de tarjetas div clicables', () => {
  assert.doesNotMatch(html, /<div class="calc-activity-card"/);
  assert.doesNotMatch(html, /<div class="support-item"/);
  assert.match(html, /class="calc-activity-card"[^>]+aria-pressed="false"/);
  assert.doesNotMatch(catalogSource, /onclick=/);
  assert.match(catalogSource, /aria-expanded="false"/);
});

test('el diseño responde con cuatro, dos y una columna sin carrusel obligatorio', () => {
  assert.match(eliteCss, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(eliteCss, /grid-template-columns: repeat\(2, minmax\(0,1fr\)\)/);
  assert.match(eliteCss, /grid-template-columns: 1fr !important/);
  assert.match(eliteCss, /overflow: visible !important/);
  assert.match(eliteCss, /internet-mode-client #inicio/);
  assert.match(eliteCss, /prefers-reduced-motion/);
});

test('SEO comunica una oferta agregada sin precios de planes duplicados', () => {
  assert.match(html, /"@type": "AggregateOffer"/);
  assert.match(html, /"offerCount": "7"/);
  assert.doesNotMatch(html, /Plan Diamante 200 Megas/);
  assert.match(html, /property="og:title"/);
});

test('la experiencia renovada está disponible en el app shell offline', () => {
  assert.match(serviceWorker, /futunet-cache-v9/);
  assert.match(serviceWorker, /css\/internet-elite\.css/);
  assert.match(serviceWorker, /js\/internet-plans\.js/);
});
