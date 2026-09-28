const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, '../../futunet-backend/firebase-service-account.json');
const serviceAccount = require(saPath);

if (!admin.getApps().length) {
  admin.initializeApp({ credential: admin.cert(serviceAccount) });
}
const db = getFirestore();

async function run() {
  const snap = await db.collection('suggestions').get();
  console.log('=== TOTAL SUGGESTIONS IN FIRESTORE ===', snap.size);
  const items = [];
  snap.forEach(doc => {
    const data = doc.data();
    items.push({
      id: doc.id,
      refCode: data.refCode || doc.id,
      title: data.title,
      description: data.description,
      status: data.status,
      category: data.category,
      hasResponse: Boolean(data.officialResponse),
      officialResponse: data.officialResponse,
      adminNotes: data.adminNotes,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      authorPhone: data.authorPhone,
      benefit: data.benefit,
      rating: data.rating,
      createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : null
    });
  });
  
  items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  
  const pending = items.filter(x => x.status === 'pending' || !x.hasResponse || x.status === 'in_review');
  console.log(`\n=== PENDING / UNANSWERED / IN REVIEW SUGGESTIONS (${pending.length}) ===`);
  pending.forEach((item, idx) => {
    console.log(`\n[${idx + 1}] ID: ${item.id} | Ref: ${item.refCode} | Status: ${item.status} | Responded: ${item.hasResponse}`);
    console.log(`Title: ${item.title}`);
    console.log(`Category: ${item.category} | Author: ${item.authorName || 'Anónimo'} (${item.authorEmail || 'N/A'}, ${item.authorPhone || 'N/A'})`);
    console.log(`Date: ${item.createdAt}`);
    console.log(`Description: ${item.description}`);
    if (item.benefit) console.log(`Benefit: ${item.benefit}`);
    if (item.adminNotes) console.log(`AdminNotes: ${item.adminNotes}`);
    if (item.officialResponse) console.log(`OfficialResponse: ${item.officialResponse}`);
  });

  console.log(`\n=== ALL SUGGESTIONS SUMMARY (${items.length}) ===`);
  items.forEach((item, idx) => {
    console.log(`- [${item.status}] ${item.refCode}: "${item.title}" (Author: ${item.authorName || 'Anónimo'}) Responded: ${item.hasResponse}`);
  });
}

run().catch(err => {
  console.error('Error querying Firestore:', err);
  process.exit(1);
});
