const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/support-core.js');
const valid = { type: 'bug', source: 'external', title: 'No puedo cotizar', description: 'Al pulsar Cotizar no ocurre nada en la página.', page: 'https://futunet.com.do/catalogo.html?token=secret#private' };
test('normaliza el caso y excluye tokens y fragmentos de la página', () => {
  const d = C.draft(valid);
  assert.equal(d.page, 'https://futunet.com.do/catalogo.html');
  assert.equal(C.safePage('https://user:password@example.com/path'), 'https://example.com/path');
  assert.match(C.summary(d), /No puedo cotizar/);
  assert.doesNotMatch(C.summary(d), /secret|private|undefined/);
});
test('rechaza tipos, descripciones vacías, asuntos largos y enlaces ejecutables', () => {
  for (const change of [{ type: 'toString' }, { source: 'admin' }, { description: ' ' }, { title: 'x'.repeat(121) }, { page: 'javascript:alert(1)' }, { page: 'data:text/html,x' }]) assert.throws(() => C.draft({ ...valid, ...change }));
});
test('reportes internos siempre son errores y el asistente no inventa resoluciones', () => {
  assert.equal(C.draft({ ...valid, source: 'internal', type: 'complaint' }).type, 'bug');
  assert.equal(Object.keys(C.GUIDES).length, 3);
  assert.match(C.GUIDES.complaint.tip, /no autoriza reembolsos/);
});
test('los roles combinados permiten soporte sin dar acceso a usuarios de empresas', () => {
  const support = { role: 'user', roles: ['support_agent'] };
  assert.equal(C.isSupport(support), true);
  assert.equal(C.isSupport({ ...support, companyCode: 'PANITAS' }), false);
  assert.equal(C.isSupport({ ...support, status: 'disabled' }), false);
  assert.equal(C.canManage({ role: 'editor' }, { source: 'internal' }), true);
  assert.equal(C.canManage({ role: 'editor' }, { source: 'external' }), false);
  assert.equal(C.isStaff(null), false);
});
test('archivos: 3 capturas máximo, 5 MiB, solo JPG PNG WebP y archivos no vacíos', () => {
  const image = { type: 'image/png', size: 5 * 1024 * 1024 };
  assert.equal(C.validateFiles([image, image, image]).length, 3);
  for (const files of [[image, image, image, image], [{ ...image, size: image.size + 1 }], [{ ...image, size: 0 }], [{ type: 'image/svg+xml', size: 100 }], [{ type: 'text/html', size: 100 }]]) assert.throws(() => C.validateFiles(files));
});
