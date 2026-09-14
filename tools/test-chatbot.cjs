const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const tick = () => new Promise(resolve => setImmediate(resolve));
const reply = { reply: '¿En qué página ocurre el error?', intent: 'support', products: [], ticket: null };
const draft = { type: 'bug', title: 'El botón de cotizar falla', description: 'En catálogo, al pulsar Cotizar no aparece ninguna respuesta.', attempted: 'Recargué la página.', reference: '' };
async function setup(fetcher, settings = false, role = 'superadmin') {
  const dom = new JSDOM(settings ? '<div id="chatbot-settings" hidden></div>' : '', { url: 'https://example.test/soporte.html', runScripts: 'outside-only' });
  const w = dom.window, calls = [];
  let user = { uid: 'u1', emailVerified: true, getIdToken: async () => 'test-token' }, profile = { role };
  w.FutunetAuth = { getCurrentUser: () => user, getUserData: () => profile, authReady: Promise.resolve() };
  w.fetch = async (url, options) => { calls.push({ url, ...options, data: options.body ? JSON.parse(options.body) : null }); return fetcher ? fetcher(url, options) : { ok: true, json: async () => reply }; };
  w.FutunetChatTransport = { send: async (data, signal) => {
    const r = await w.fetch('mock:firebase', { method: 'POST', body: JSON.stringify(data), signal, credentials: 'omit', headers: {} });
    if (!r.ok) throw new Error(r.status === 429 ? 'busy' : 'unavailable');
    return r.json();
  } };
  w.eval(fs.readFileSync(path.join(__dirname, settings ? '../js/chatbot-settings.js' : '../js/chatbot.js'), 'utf8'));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded')); await tick();
  const $ = id => w.document.getElementById(id);
  if (!settings) $('cb-fab').click();
  return { dom, w, $, calls, send: async text => { $('cb-input-text').value = text; $('cb-send-btn').click(); await tick(); },
    session: async (next, p = { role: 'user' }) => { user = next; profile = p; w.dispatchEvent(new w.Event('futunet-auth-ready')); await tick(); } };
}

test('Gemini recibe contexto acotado, sin tokens de sesión ni claves del navegador', async () => {
  const ui = await setup(); ui.w.localStorage.setItem('futunet_gemini_key', 'private-marker');
  await ui.send('El botón no funciona'); await ui.send('Ocurre en catálogo');
  assert.equal(ui.calls[1].data.history[0].text, 'El botón no funciona');
  assert.equal(ui.calls[1].credentials, 'omit'); assert.equal(ui.calls[1].headers.Authorization, undefined);
  assert.doesNotMatch(JSON.stringify(ui.calls), /private-marker|test-token/);
  for (let i = 0; i < 10; i++) await ui.send('x'.repeat(1400));
  const history = ui.calls.at(-1).data.history;
  assert.ok(history.length <= 12); assert.ok(history.reduce((n, t) => n + t.text.length, 0) <= 10000);
  assert.equal(history[0].role, 'user'); assert.equal(history.at(-1).role, 'model');
  ui.dom.window.close();
});

test('respuestas se pintan como texto y los productos manipulados no generan enlaces', async () => {
  const ui = await setup(() => ({ ok: true, json: async () => ({ ...reply, reply: '<img src=x onerror=alert(1)>', products: [{ id: 'javascript:bad', title: 'Malo' }, { id: 'p1', title: '<b>Epson</b>' }] }) }));
  await ui.send('Impresoras');
  assert.equal(ui.$('cb-messages').querySelector('[onerror]'), null);
  assert.match(ui.$('cb-messages').textContent, /<img/);
  assert.equal(ui.$('cb-messages').querySelectorAll('[data-kind="product"]').length, 1);
  ui.dom.window.close();
});

test('fallo de Gemini permite traspasar lo explicado sin crear automáticamente un ticket', async () => {
  const ui = await setup(() => ({ ok: false, status: 503 }));
  const root = ui.w.document.createElement('div'); root.id = 'sp-root'; root.dataset.mode = 'public'; ui.w.document.body.append(root);
  let transfers = 0; ui.w.addEventListener('futunet-support-draft', () => transfers++);
  await ui.send('No funciona el botón de cotizar');
  assert.match(ui.$('cb-messages').textContent, /No pude conectar/);
  assert.equal(ui.w.sessionStorage.getItem('futunet_support_handoff'), null);
  ui.$('cb-ticket').click();
  const saved = JSON.parse(ui.w.sessionStorage.getItem('futunet_support_handoff'));
  assert.match(saved.fields.description, /No funciona el botón/); assert.equal(saved.ownerId, 'u1'); assert.equal(transfers, 1);
  assert.equal(ui.calls.length, 1); ui.dom.window.close();
});

test('el borrador de Gemini se vuelve revisable y los datos nuevos invalidan resúmenes anteriores', async () => {
  const ui = await setup(() => ({ ok: true, json: async () => ({ ...reply, ticket: draft }) }));
  const root = ui.w.document.createElement('div'); root.id = 'sp-root'; root.dataset.mode = 'public'; ui.w.document.body.append(root);
  await ui.send('El botón Cotizar falla'); ui.$('cb-ticket').click();
  assert.equal(JSON.parse(ui.w.sessionStorage.getItem('futunet_support_handoff')).fields.title, draft.title);
  ui.w.fetch = async () => ({ ok: false, status: 429 });
  await ui.send('También falla al usar Firefox'); ui.$('cb-ticket').click();
  assert.match(JSON.parse(ui.w.sessionStorage.getItem('futunet_support_handoff')).fields.description, /Firefox/);
  ui.dom.window.close();
});

test('evita consultas duplicadas y descarta respuestas tardías al cambiar de cuenta', async () => {
  let resolve;
  const ui = await setup(() => new Promise(r => { resolve = r; }));
  await ui.send('Reporte privado del cliente anterior'); await ui.send('Duplicado'); assert.equal(ui.calls.length, 1);
  await ui.session({ uid: 'u2', emailVerified: true });
  resolve({ ok: true, json: async () => ({ ...reply, reply: 'Respuesta de la cuenta anterior' }) }); await tick();
  assert.doesNotMatch(ui.$('cb-messages').textContent, /cliente anterior|cuenta anterior/);
  assert.equal(ui.$('cb-send-btn').disabled, false); ui.dom.window.close();
});

test('configuración de Firebase solo visible para superadmin y no lee claves privadas', async () => {
  const ui = await setup(null, true);
  ui.w.localStorage.setItem('futunet_gemini_key', 'test-key-never-used-with-google');
  assert.equal(ui.$('chatbot-settings').hidden, false); assert.equal(ui.calls.length, 0);
  assert.equal(ui.$('cg-reuse'), null);
  assert.match(ui.$('chatbot-settings').textContent, /Firebase AI Logic/);
  assert.doesNotMatch(ui.$('chatbot-settings').textContent, /test-key/);
  await ui.session({ uid: 'u2', emailVerified: true }, { role: 'admin' }); assert.equal(ui.$('chatbot-settings').hidden, true);
  ui.dom.window.close();
  const limited = await setup(null, true, 'support_agent'); assert.equal(limited.calls.length, 0); limited.dom.window.close();
});

test('abrir el asistente desde soporte no lo cierra por propagación del mismo clic', async () => {
  const ui = await setup(); ui.$('cb-close').click();
  ui.w.FutunetSupportCore = require('../js/support-core.js');
  ui.w.FutunetSupportService = { watchTickets: () => () => {} };
  const root = ui.w.document.createElement('div'); root.id = 'sp-root'; root.dataset.mode = 'public';
  const button = ui.w.document.createElement('button'); button.dataset.openAssistant = ''; button.textContent = 'Conversar';
  ui.w.document.body.append(root, button);
  ui.w.eval(fs.readFileSync(path.join(__dirname, '../js/support-ui.js'), 'utf8'));
  ui.w.FutunetSupportUI.init(); await tick(); button.click();
  assert.equal(ui.$('cb-window').getAttribute('aria-hidden'), 'false');
  assert.equal(ui.$('cb-window').inert, false); ui.dom.window.close();
});

test('window.FutunetAI expone API pública y responde a eventos globales con mensaje predeterminado', async () => {
  const ui = await setup(); ui.$('cb-close').click();
  assert.ok(ui.w.FutunetAI, 'window.FutunetAI debe existir');
  assert.equal(typeof ui.w.FutunetAI.open, 'function');
  assert.equal(typeof ui.w.FutunetAI.ask, 'function');
  assert.equal(typeof ui.w.FutunetAI.askInternet, 'function');
  assert.equal(typeof ui.w.FutunetAI.askProduct, 'function');

  // Test askProduct
  ui.w.FutunetAI.askProduct({ title: 'Terminal POS Touch', price: 26500, category: 'punto-de-venta' });
  await new Promise(r => setTimeout(r, 260));
  await tick();
  assert.equal(ui.$('cb-window').getAttribute('aria-hidden'), 'false');
  assert.match(ui.$('cb-messages').textContent, /Terminal POS Touch/);

  // Test close
  ui.w.FutunetAI.close();
  assert.equal(ui.$('cb-window').getAttribute('aria-hidden'), 'true');

  ui.dom.window.close();
});
