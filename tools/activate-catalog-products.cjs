const path = require('node:path');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, '../../futunet-backend/firebase-service-account.json');
const serviceAccount = require(saPath);

if (!admin.getApps().length) {
  admin.initializeApp({ credential: admin.cert(serviceAccount) });
}
const db = getFirestore();

async function run() {
  const updates = [
    {
      id: 'prod_ev8mssce4',
      data: {
        isActive: true,
        brand: 'Epson',
        category: 'Impresoras y Escáneres',
        department: 'equipos'
      }
    },
    {
      id: 'prod_p0wqnr5bc',
      data: {
        isActive: true,
        brand: 'Brother',
        category: 'Impresoras y Escáneres',
        department: 'equipos'
      }
    },
    {
      id: 'prod_oh55hargc',
      data: {
        isActive: true,
        brand: 'Canon',
        category: 'Impresoras y Escáneres',
        department: 'equipos'
      }
    },
    {
      id: 'prod_tk6it44v0',
      data: {
        isActive: true,
        brand: '2Connect',
        category: 'Punto de Venta',
        department: 'equipos'
      }
    },
    {
      id: 'prod_yny47xadr',
      data: {
        isActive: true,
        brand: 'Apple',
        title: 'Apple AirPods (2.ª generación) con estuche de carga',
        desc: 'Auriculares y audífonos inalámbricos Apple AirPods de segunda generación con estuche de carga Lightning. Integran el chip H1 para emparejamiento rápido con dispositivos Apple, control por voz con "Oye Siri" y un perfil de uso cómodo para llamadas, música y videollamadas.',
        department: 'equipos',
        category: 'Periféricos y Partes'
      }
    },
    {
      id: 'prod_9p6f6zzh6',
      data: {
        isActive: true,
        brand: 'DELL',
        title: 'Teclado Dell KB216 USB',
        desc: 'Teclado Dell KB216 con conexión USB y formato completo, apto para digitación continua en oficinas, recepción y estaciones administrativas. Es una opción confiable para reemplazo o equipamiento de escritorios corporativos.',
        department: 'equipos',
        category: 'Periféricos y Partes'
      }
    }
  ];

  for (const item of updates) {
    await db.collection('products').doc(item.id).update(item.data);
    console.log('Updated & activated in Firestore:', item.id);
  }
  console.log('All 6 products updated and activated in Firestore.');
}

run().catch((err) => {
  console.error('Error updating products:', err);
  process.exit(1);
});
