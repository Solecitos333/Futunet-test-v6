const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, getDoc, getDocs, collection, query, where, orderBy, limit, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, Timestamp } = require('firebase/firestore');
const fs = require('node:fs');
const path = require('node:path');
const compat = require('firebase/compat/app');
require('firebase/compat/firestore');
const C = require('../js/support-core.js');
let env;
const profiles = {
  superadmin: { role: 'superadmin', roles: [] },
  customer: { role: 'user', roles: [] }, other: { role: 'user', roles: [] },
  support: { role: 'support_agent', roles: [] }, admin: { role: 'admin', roles: [] },
  editor: { role: 'editor', roles: [] }, billing: { role: 'billing_clerk', roles: [] },
  marketing: { role: 'marketing_manager', roles: [] },
  tenant: { role: 'admin', roles: ['support_agent'], companyCode: 'PANITAS' },
  disabled: { role: 'support_agent', roles: [], status: 'disabled' },
  mixed: { role: 'user', roles: ['support_agent'] }, unverified: { role: 'user', roles: [] }
};
const dbFor = uid => env.authenticatedContext(uid, { email: uid + '@test.local', email_verified: uid !== 'unverified' }).firestore();
let serial = 0;
const id = () => String(++serial).padStart(20, 'T');
function ticket(uid = 'customer', changes = {}) {
  return { type: 'bug', source: 'external', title: 'No funciona el botón', description: 'Al intentar cotizar el botón no hace nada.', page: '', reference: '', attempted: '', environment: '', guided: true,
    ownerId: uid, ownerName: uid, ownerEmail: uid + '@test.local', status: 'open', priority: 'normal', assignedTo: '', assignedName: '', attachmentCount: 0,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(), updatedBy: uid, lastMessageId: '', revision: 0, ...changes };
}
async function seed(changes = {}) {
  const key = id();
  await env.withSecurityRulesDisabled(async context => setDoc(doc(context.firestore(), 'support_tickets', key), ticket('customer', changes)));
  return key;
}
async function resetRate(uid) { await env.withSecurityRulesDisabled(async context => deleteDoc(doc(context.firestore(), 'support_rate_limits', uid))); }
function create(db, uid, changes = {}, attachments = []) {
  const key = id(), batch = writeBatch(db);
  batch.set(doc(db, 'support_tickets', key), ticket(uid, changes));
  batch.set(doc(db, 'support_rate_limits', uid), { ticketId: key, createdAt: serverTimestamp() });
  attachments.forEach((data, index) => batch.set(doc(db, 'support_tickets', key, 'attachments', String(index)), data));
  return batch.commit().then(() => key);
}
function message(uid, changes = {}) { return { body: 'Aquí hay más información.', authorId: uid, authorName: uid, authorRole: ['customer', 'other'].includes(uid) ? 'customer' : 'staff', createdAt: serverTimestamp(), ...changes }; }
async function reply(uid, key, changes = {}, bodyChanges = {}) {
  const db = dbFor(uid), batch = writeBatch(db), messageId = id();
  batch.set(doc(db, 'support_tickets', key, 'messages', messageId), message(uid, bodyChanges));
  batch.update(doc(db, 'support_tickets', key), { lastMessageId: messageId, updatedBy: uid, updatedAt: serverTimestamp(), revision: 1, ...changes });
  return batch.commit();
}
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-futunet-support', firestore: { host: '127.0.0.1', port: 8088, rules: fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8') } });
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async context => Promise.all(Object.entries(profiles).map(([uid, data]) => setDoc(doc(context.firestore(), 'users', uid), data))));
});
after(async () => { if (env) await env.cleanup(); });

test('clave de Gemini nunca accesible directamente desde clientes, incluido superadmin', async () => {
  await env.withSecurityRulesDisabled(async context => setDoc(doc(context.firestore(), 'chatbot_secrets', 'gemini'), { api_key: 'test-only-secret' }));
  for (const db of [env.unauthenticatedContext().firestore(), dbFor('customer'), dbFor('admin'), dbFor('superadmin')]) {
    await assertFails(getDoc(doc(db, 'chatbot_secrets', 'gemini')));
    await assertFails(setDoc(doc(db, 'chatbot_secrets', 'gemini'), { api_key: 'replace-secret' }));
  }
});
test('cliente verificado crea un caso con tres capturas atómicamente', async () => {
  const db = dbFor('customer');
  const key = await assertSucceeds(create(db, 'customer', { attachmentCount: 3 }, Array.from({ length: 3 }, () => ({ name: 'captura.jpg', dataUrl: 'data:image/jpeg;base64,YWJjZA==' }))));
  assert.equal((await getDoc(doc(db, 'support_tickets', key))).data().attachmentCount, 3);
  assert.equal((await getDocs(collection(db, 'support_tickets', key, 'attachments'))).size, 3);
  await assertFails(create(db, 'customer')); // server-enforced creation throttle
  await resetRate('customer');
});
test('creación rechaza suplantación, campos extra, estado, prioridad y asignación manipulados', async () => {
  for (const changes of [{ ownerId: 'other' }, { ownerEmail: 'other@test.local' }, { source: 'internal' }, { privateNote: 'leak' }, { status: 'resolved' }, { priority: 'urgent' }, { assignedTo: 'admin' }, { title: 'x' }, { description: '' }, { page: 'javascript:alert(1)' }, { page: 'https://example.com/?token=secret' }, { revision: 1 }]) await assertFails(create(dbFor('customer'), 'customer', changes));
});
test('invitados, cuentas sin verificar y deshabilitadas no crean ni leen casos', async () => {
  const key = await seed();
  for (const db of [env.unauthenticatedContext().firestore(), dbFor('unverified'), dbFor('disabled')]) {
    await assertFails(getDoc(doc(db, 'support_tickets', key)));
    await assertFails(create(db, 'customer'));
  }
});
test('cada cliente consulta solo sus tickets; soporte consulta todos; editores solo internos', async () => {
  await seed(); await seed({ source: 'internal' });
  const own = dbFor('customer');
  await assertSucceeds(getDocs(query(collection(own, 'support_tickets'), where('ownerId', '==', 'customer'), orderBy('createdAt', 'desc'), limit(200))));
  await assertFails(getDocs(query(collection(own, 'support_tickets'), limit(200))));
  for (const uid of ['support', 'admin', 'mixed']) await assertSucceeds(getDocs(query(collection(dbFor(uid), 'support_tickets'), orderBy('createdAt', 'desc'), limit(200))));
  for (const uid of ['editor', 'billing', 'marketing']) {
    const db = dbFor(uid);
    await assertSucceeds(getDocs(query(collection(db, 'support_tickets'), where('source', '==', 'internal'), orderBy('createdAt', 'desc'), limit(200))));
    await assertFails(getDocs(query(collection(db, 'support_tickets'), limit(200))));
  }
  await assertFails(getDocs(query(collection(dbFor('tenant'), 'support_tickets'), limit(200))));
});
test('el ID del ticket no permite acceder a casos, mensajes ni capturas de otro cliente', async () => {
  const key = await seed(); const db = dbFor('other');
  for (const parts of [[], ['attachments', '0'], ['messages', 'm']]) await assertFails(getDoc(doc(db, 'support_tickets', key, ...parts)));
  await assertSucceeds(getDoc(doc(dbFor('customer'), 'support_tickets', id()))); // missing-ID transaction read
});
test('capturas rechazan contenido activo, tamaño excesivo, faltantes y documentos huérfanos', async () => {
  const db = dbFor('customer');
  for (const attachments of [[{ name: 'x', dataUrl: 'data:image/svg+xml,<svg/>' }], [{ name: 'x', dataUrl: 'data:image/jpeg;base64,' + 'a'.repeat(350000) }], []]) await assertFails(create(db, 'customer', { attachmentCount: 1 }, attachments));
  await assertFails(setDoc(doc(db, 'support_tickets', id(), 'attachments', '0'), { name: 'x', dataUrl: 'data:image/jpeg;base64,YQ==' }));
  await assertFails(create(db, 'customer', { attachmentCount: 0 }, [{ name: 'x', dataUrl: 'data:image/jpeg;base64,YQ==' }]));
});
test('las notas privadas quedan fuera de las lecturas y escrituras del cliente', async () => {
  const key = await seed();
  await assertSucceeds(setDoc(doc(dbFor('support'), 'support_tickets', key, 'notes', 'note'), message('support')));
  await assertFails(getDoc(doc(dbFor('customer'), 'support_tickets', key, 'notes', 'note')));
  await assertFails(getDocs(collection(dbFor('customer'), 'support_tickets', key, 'notes')));
  await assertFails(setDoc(doc(dbFor('customer'), 'support_tickets', key, 'notes', 'new'), message('customer')));
  await assertFails(getDoc(doc(dbFor('editor'), 'support_tickets', key, 'notes', 'note')));
});
test('respuestas quedan vinculadas a la identidad y al ticket, con auditoría', async () => {
  const key = await seed(); await assertSucceeds(reply('customer', key));
  const fresh = await seed();
  await assertFails(reply('other', fresh));
  await assertFails(reply('customer', fresh, {}, { authorId: 'support' }));
  await assertFails(reply('customer', fresh, {}, { authorRole: 'staff' }));
  await assertFails(reply('customer', fresh, {}, { body: '' }));
  await assertFails(setDoc(doc(dbFor('customer'), 'support_tickets', fresh, 'messages', 'orphan'), message('customer')));
  await assertSucceeds(reply('support', fresh));
});
test('respuesta del cliente reabre resueltos/en espera pero nunca cierra o resuelve su caso', async () => {
  for (const status of ['waiting', 'resolved']) { const key = await seed({ status }); await assertSucceeds(reply('customer', key, { status: 'open' })); }
  const key = await seed();
  for (const status of ['resolved', 'closed', 'in_progress']) await assertFails(reply('customer', key, { status }));
  await assertFails(reply('customer', await seed({ status: 'closed' })));
});
test('soporte gestiona prioridad, estado y responsable sin reescribir al reportante', async () => {
  const key = await seed(), db = dbFor('support');
  const change = { updatedBy: 'support', updatedAt: serverTimestamp(), revision: 1 };
  await assertFails(updateDoc(doc(db, 'support_tickets', key), { ...change, ownerId: 'support' }));
  await assertFails(updateDoc(doc(db, 'support_tickets', key), { ...change, description: 'reescrita' }));
  await assertFails(updateDoc(doc(db, 'support_tickets', key), { ...change, assignedTo: 'other', assignedName: 'Other' }));
  await assertSucceeds(updateDoc(doc(db, 'support_tickets', key), { ...change, status: 'in_progress', priority: 'high', assignedTo: 'support', assignedName: 'Support' }));
  await assertFails(updateDoc(doc(db, 'support_tickets', key), { ...change, status: 'closed' })); // stale revision
  await assertFails(deleteDoc(doc(db, 'support_tickets', key)));
});
test('personal de plataforma colabora en errores internos, empresas no reciben ese privilegio', async () => {
  for (const uid of ['editor', 'billing', 'marketing']) {
    const key = await assertSucceeds(create(dbFor(uid), uid, { source: 'internal' }));
    await assertSucceeds(reply('editor', key));
  }
  await assertFails(create(dbFor('tenant'), 'tenant', { source: 'internal' }));
  const key = await seed();
  await assertFails(updateDoc(doc(dbFor('editor'), 'support_tickets', key), { status: 'closed', updatedBy: 'editor', updatedAt: serverTimestamp(), revision: 1 }));
});
function serviceFor(uid, online = true) {
  const auth = { getCurrentUser: () => ({ uid, email: uid + '@test.local', displayName: uid, emailVerified: uid !== 'unverified' }), getUserData: () => profiles[uid] };
  const window = { FutunetAuth: auth, FutunetFirebase: { db: dbFor(uid) }, FutunetSupportCore: C };
  new Function('window', 'FutunetAuth', 'firebase', 'navigator', fs.readFileSync(path.join(__dirname, '../js/support-service.js'), 'utf8'))(window, auth, compat, { onLine: online });
  return window.FutunetSupportService;
}
test('servicio real: crea, reintenta sin duplicar, responde y gestiona con transacciones', async () => {
  await resetRate('customer');
  const service = serviceFor('customer'), support = serviceFor('support'), key = service.newId();
  const input = { type: 'complaint', source: 'external', title: 'Pedido incompleto', description: 'Mi pedido llegó incompleto; falta uno de los artículos.' };
  assert.equal(await service.create(key, input, []), key);
  assert.equal(await service.create(key, input, []), key);
  const messageId = service.newId();
  await service.reply(key, messageId, 'Aquí está la referencia del pedido.', false);
  await service.reply(key, messageId, 'Aquí está la referencia del pedido.', false);
  assert.equal((await getDocs(collection(dbFor('customer'), 'support_tickets', key, 'messages'))).size, 1);
  await support.update(key, { status: 'waiting', priority: 'high' }, 1);
  await assert.rejects(support.update(key, { status: 'closed' }, 1), /cambió/);
  await service.reply(key, service.newId(), 'Información adicional solicitada.', false);
  assert.equal((await getDoc(doc(dbFor('customer'), 'support_tickets', key))).data().status, 'open');
  await support.reply(key, support.newId(), 'Nota privada de revisión.', true);
  await assertFails(getDocs(collection(dbFor('customer'), 'support_tickets', key, 'notes')));
  await assert.rejects(serviceFor('customer', false).create(service.newId(), input, []), /conexión/);
});
