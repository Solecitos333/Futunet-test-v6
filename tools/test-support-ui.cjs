const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../js/support-core.js');
const tick = () => new Promise(resolve => setImmediate(resolve));
async function setup(mode = 'public', initialUser = null) {
  const dom = new JSDOM(`<div id="sp-root" data-mode="${mode}"></div>`, { url: 'https://example.test/soporte.html', runScripts: 'outside-only' });
  const w = dom.window;
  w.URL.revokeObjectURL = () => {};
  w.URL.createObjectURL = () => 'blob:test-preview';
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  let user = initialUser, profile = { role: initialUser?.role || 'user' }, callback, failed, calls = 0, snapshots = [];
  w.FutunetSupportCore = C;
  w.FutunetAuth = { getCurrentUser: () => user, getUserData: () => profile, authReady: Promise.resolve() };
  w.FutunetSupportService = {
    watchTickets(admin, next) { callback = next; snapshots.push(next); next({ docs: [], metadata: { fromCache: false } }); return () => {}; },
    newId: () => 'A'.repeat(20),
    identity: () => { if (!user) throw new Error('Inicia sesión.'); },
    create: async () => { calls++; throw Object.assign(new Error('unavailable'), { code: 'unavailable' }); }
  };
  w.eval(fs.readFileSync(path.join(__dirname, '../js/support-ui.js'), 'utf8'));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  await tick();
  return { dom, w, $: id => w.document.getElementById(id), calls: () => calls, snapshots,
    records: data => callback({ docs: data.map(t => ({ id: t.id, metadata: {}, data: () => t })), metadata: { fromCache: false } }),
    session: async (u, p = { role: 'user' }) => { user = u; profile = p; w.dispatchEvent(new w.Event('futunet-auth-ready')); await tick(); } };
}
function prepare(ui) {
  ui.$('sp-title').value = 'No funciona el botón';
  ui.$('sp-description').value = 'Al pulsar el botón de cotizar no ocurre nada.';
  ui.$('sp-form').dispatchEvent(new ui.w.Event('submit', { cancelable: true }));
}

test('borrador del chat exige revisión y no reemplaza un formulario escrito sin acción explícita', async () => {
  const ui = await setup('public', { uid: 'customer', emailVerified: true });
  prepare(ui);
  const saved = { createdAt: Date.now(), ownerId: 'customer', fields: { type: 'complaint', title: 'Caso preparado por el asistente', description: 'Mi pedido llegó incompleto y necesito que revisen la entrega.' } };
  ui.w.sessionStorage.setItem('futunet_support_handoff', JSON.stringify(saved));
  ui.w.dispatchEvent(new ui.w.Event('futunet-support-draft'));
  assert.equal(ui.$('sp-title').value, 'No funciona el botón');
  ui.$('sp-form-notice').querySelector('button').click();
  assert.equal(ui.$('sp-title').value, saved.fields.title); assert.equal(ui.$('sp-review').hidden, true);
  assert.equal(ui.calls(), 0); assert.equal(ui.w.sessionStorage.getItem('futunet_support_handoff'), null);
  assert.match(ui.$('sp-form-notice').textContent, /todavía no se ha enviado/);
  ui.dom.window.close();
});

test('descarta borradores vencidos y de otra cuenta', async () => {
  const ui = await setup('public', { uid: 'customer', emailVerified: true });
  for (const saved of [{ ownerId: 'other', createdAt: Date.now() }, { ownerId: 'customer', createdAt: Date.now() - 1200001 }]) {
    ui.w.sessionStorage.setItem('futunet_support_handoff', JSON.stringify({ ...saved, fields: { type: 'bug', title: 'Caso de otra persona', description: 'Datos que no deben pasar a otro usuario.' } }));
    ui.w.dispatchEvent(new ui.w.Event('futunet-support-draft'));
    assert.equal(ui.$('sp-title').value, ''); assert.equal(ui.w.sessionStorage.getItem('futunet_support_handoff'), null);
  }
  ui.dom.window.close();
});
test('invitado recibe orientación y resumen sin crear un ticket ni perder texto al iniciar sesión', async () => {
  const ui = await setup();
  ui.$('sp-guidance').click(); assert.equal(ui.$('sp-guide').hidden, false);
  prepare(ui); assert.equal(ui.$('sp-review').hidden, false);
  ui.$('sp-send').click(); await tick(); assert.equal(ui.calls(), 0);
  assert.match(ui.$('sp-form-notice').textContent, /no se ha enviado/);
  await ui.session({ uid: 'customer', emailVerified: true });
  assert.equal(ui.$('sp-title').value, 'No funciona el botón');
  assert.equal(ui.$('sp-signin').hidden, true);
  ui.dom.window.close();
});
test('fallo de envío conserva datos y permite reintentar sin mostrar éxito', async () => {
  const ui = await setup('public', { uid: 'customer', emailVerified: true });
  prepare(ui); ui.$('sp-send').click(); await tick();
  assert.equal(ui.calls(), 1); assert.equal(ui.$('sp-send').disabled, false);
  assert.match(ui.$('sp-form-notice').textContent, /no se duplicará/);
  assert.equal(ui.$('sp-title').value, 'No funciona el botón');
  assert.equal(ui.$('sp-review').hidden, false);
  ui.dom.window.close();
});
test('contenido del ticket se muestra como texto y los filtros funcionan', async () => {
  const ui = await setup('public', { uid: 'customer', emailVerified: true });
  ui.records([{ id: 'A'.repeat(20), title: '<img src=x onerror=alert(1)>', type: 'bug', source: 'external', status: 'open', priority: 'normal' },
    { id: 'B'.repeat(20), title: 'Reclamación de pedido', type: 'complaint', source: 'external', status: 'resolved', priority: 'normal' }]);
  assert.equal(ui.$('sp-list').querySelector('img'), null);
  assert.match(ui.$('sp-list').textContent, /<img/);
  ui.$('sp-status').value = 'resolved'; ui.$('sp-status').dispatchEvent(new ui.w.Event('input'));
  assert.equal(ui.$('sp-list').querySelectorAll('button').length, 1);
  assert.match(ui.$('sp-list').textContent, /Reclamación/);
  ui.dom.window.close();
});
test('cambio de cuenta borra borrador y descarta resultados tardíos de la cuenta anterior', async () => {
  const ui = await setup('public', { uid: 'customer', emailVerified: true });
  prepare(ui); const oldCallback = ui.snapshots.at(-1);
  await ui.session({ uid: 'other', emailVerified: true });
  assert.equal(ui.$('sp-title').value, '');
  oldCallback({ docs: [{ id: 'A'.repeat(20), metadata: {}, data: () => ({ title: 'privado anterior' }) }], metadata: {} });
  assert.doesNotMatch(ui.$('sp-list').textContent, /privado anterior/);
  ui.dom.window.close();
});
test('editor tiene reportes internos; usuario sin permiso no ve el módulo administrativo', async () => {
  const ui = await setup('admin', { uid: 'editor', role: 'editor', emailVerified: true });
  assert.equal(ui.$('sp-type').disabled, true); assert.equal(ui.$('sp-source').value, 'internal');
  await ui.session({ uid: 'customer', emailVerified: true });
  assert.equal(ui.$('sp-root').hidden, true);
  ui.dom.window.close();
});
