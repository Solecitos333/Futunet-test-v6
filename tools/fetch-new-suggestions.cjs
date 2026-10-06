const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, '../../futunet-backend/firebase-service-account.json');
if (!fs.existsSync(saPath)) {
  console.log('No credential found.');
  process.exit(0);
}
const serviceAccount = require(saPath);
if (!admin.getApps().length) {
  admin.initializeApp({ credential: admin.cert(serviceAccount) });
}
const db = getFirestore();

async function checkNew() {
  const snapshot = await db.collection('suggestions').get();
  console.log('Total suggestions in Firestore:', snapshot.size);
  const pending = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.status !== 'implemented' && data.status !== 'resolved') {
      pending.push({ id: doc.id, ...data });
    }
  });
  console.log('Pending suggestions:', pending.length);
  pending.forEach(p => console.log('Pending:', p.refCode || p.id, p.status, p.title));
  process.exit(0);
}

checkNew().catch(e => {
  console.error(e);
  process.exit(1);
});
