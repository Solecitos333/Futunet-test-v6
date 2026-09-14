const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');

test('Buzón de sugerencias: integridad del documento HTML y elementos clave', () => {
  const htmlPath = path.join(projectRoot, 'sugerencias.html');
  assert.ok(fs.existsSync(htmlPath), 'sugerencias.html debe existir');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Formulario y campos requeridos
  assert.ok(doc.getElementById('sug-form'), 'Debe contener el formulario #sug-form');
  assert.ok(doc.getElementById('sug-title'), 'Debe contener el campo #sug-title');
  assert.ok(doc.getElementById('sug-desc'), 'Debe contener el campo #sug-desc');
  assert.ok(doc.getElementById('sug-benefit'), 'Debe contener el campo #sug-benefit');
  assert.ok(doc.getElementById('sug-anon-checkbox'), 'Debe contener el checkbox #sug-anon-checkbox');
  assert.ok(doc.getElementById('sug-submit-btn'), 'Debe contener el botón #sug-submit-btn');
  assert.ok(doc.getElementById('sug-hp-check'), 'Debe contener el honeypot antispam #sug-hp-check');

  // Categorías interactivas
  const categoryCards = doc.querySelectorAll('.sug-category-card');
  assert.ok(categoryCards.length >= 5, 'Debe contar con al menos 5 tarjetas de categorías');

  const expectedCategories = ['web_platform', 'services_support', 'catalog_products', 'customer_service', 'other'];
  const actualCategories = Array.from(categoryCards).map(c => c.getAttribute('data-cat'));
  for (const cat of expectedCategories) {
    assert.ok(actualCategories.includes(cat), `Debe incluir la categoría ${cat}`);
  }

  // Tarjeta de éxito y código de referencia
  assert.ok(doc.getElementById('sug-success-card'), 'Debe incluir la tarjeta de éxito #sug-success-card');
  assert.ok(doc.getElementById('sug-ref-code'), 'Debe incluir el display de código #sug-ref-code');
});

test('Buzón de sugerencias: enlaces de navegación en Navbar, Footer, Soporte y Mi Cuenta', () => {
  // 1. js/main.js
  const mainJs = fs.readFileSync(path.join(projectRoot, 'js', 'main.js'), 'utf8');
  assert.ok(mainJs.includes('sugerencias.html'), 'js/main.js debe incluir el enlace a sugerencias.html');

  // 2. index.html
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('href="sugerencias.html"'), 'index.html debe enlazar a sugerencias.html en el footer');

  // 3. soporte.html
  const soporteHtml = fs.readFileSync(path.join(projectRoot, 'soporte.html'), 'utf8');
  assert.ok(soporteHtml.includes('href="sugerencias.html"'), 'soporte.html debe enlazar a sugerencias.html');

  // 4. mi-cuenta.html
  const miCuentaHtml = fs.readFileSync(path.join(projectRoot, 'mi-cuenta.html'), 'utf8');
  assert.ok(miCuentaHtml.includes('href="sugerencias.html"'), 'mi-cuenta.html debe enlazar a sugerencias.html');

  // 5. login.html
  const loginHtml = fs.readFileSync(path.join(projectRoot, 'login.html'), 'utf8');
  assert.ok(loginHtml.includes("'sugerencias.html'"), 'login.html debe permitir sugerencias.html en allowedRedirects');
});

test('Buzón de sugerencias: reglas de Firestore validan esquema y rechazan campos no autorizados', () => {
  const rules = fs.readFileSync(path.join(projectRoot, 'firestore.rules'), 'utf8');
  assert.ok(rules.includes('match /suggestions/{suggestionId}'), 'firestore.rules debe contener match /suggestions/{suggestionId}');
  assert.ok(rules.includes("d.category in ['web_platform', 'services_support', 'catalog_products', 'customer_service', 'other']"), 'firestore.rules debe validar categorías permitidas');
  assert.ok(rules.includes("d.status == 'pending'"), 'firestore.rules debe forzar estado pending al crear');
  assert.ok(rules.includes("d.createdAt == request.time"), 'firestore.rules debe forzar createdAt al crear');
});

test('Buzón de sugerencias: módulo administrativo y protección XSS', () => {
  const adminHtml = fs.readFileSync(path.join(projectRoot, 'admin.html'), 'utf8');
  assert.ok(adminHtml.includes('data-admin-nav="suggestions"'), 'admin.html debe tener el botón de navegación suggestions');
  assert.ok(adminHtml.includes('data-admin-panel="suggestions"'), 'admin.html debe tener el panel suggestions');
  assert.ok(adminHtml.includes('id="suggestion-detail-modal"'), 'admin.html debe tener el modal suggestion-detail-modal');
  assert.ok(adminHtml.includes('id="internal-suggestion-modal"'), 'admin.html debe tener el modal internal-suggestion-modal');

  const adminJs = fs.readFileSync(path.join(projectRoot, 'js', 'admin-panel.js'), 'utf8');
  assert.ok(adminJs.includes('loadSuggestions: loadSuggestions'), 'admin-panel.js debe exportar loadSuggestions');
  assert.ok(adminJs.includes('escapeHtml(sug.title)'), 'admin-panel.js debe escapar el título contra XSS');
  assert.ok(adminJs.includes('escapeHtml(searchStr)'), 'admin-panel.js debe escapar atributos de búsqueda');
});
