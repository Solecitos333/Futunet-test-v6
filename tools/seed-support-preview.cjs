// Disposable fixtures; never connects to production.
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8088';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9098';
const { initializeApp, deleteApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp({ projectId: 'demo-futunet-support' });
(async () => {
  for (const [actor, role] of [['customer', 'user'], ['support', 'support_agent'], ['editor', 'editor']]) {
    const uid = 'preview-' + actor;
    try { await getAuth().createUser({ uid, email: actor + '@support.test', password: 'local-preview-only', emailVerified: true, displayName: 'Prueba ' + actor }); }
    catch (e) { if (e.code !== 'auth/uid-already-exists') throw e; }
    await getFirestore().collection('users').doc(uid).set({ role, roles: [], status: 'active' });
  }
  console.log('Tres cuentas ficticias preparadas en los emuladores locales.');
  await deleteApp(app);
})().catch(error => { console.error(error); process.exitCode = 1; });
