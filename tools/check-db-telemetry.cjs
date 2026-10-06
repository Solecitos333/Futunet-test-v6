const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const serviceAccount = require('../../futunet-backend/firebase-service-account.json');

if (!admin.getApps().length) {
  admin.initializeApp({ credential: admin.cert(serviceAccount) });
}
const db = getFirestore();

async function checkCollections() {
  const collections = await db.listCollections();
  console.log('Collections in Firestore:', collections.map(c => c.id));

  for (const col of collections) {
    const snap = await col.limit(10).get();
    console.log('Collection:', col.id, 'Docs sampled:', snap.size);
    if (col.id === 'support_tickets') {
      snap.forEach(d => console.log('  Ticket:', d.id, d.data().status, d.data().title));
    }
    if (col.id === 'search_queries') {
      snap.forEach(d => console.log('  Query:', d.id, d.data().query, 'count:', d.data().count));
    }
  }
}
checkCollections().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
