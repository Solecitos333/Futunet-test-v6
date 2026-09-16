const fs = require('node:fs');
const path = require('node:path');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, '../../futunet-backend/firebase-service-account.json');
if (!fs.existsSync(saPath)) {
  console.log('Aviso: No se encontró la credencial de servicio de Firebase en:', saPath);
  console.log('Para sembrar sugerencias en producción o staging, define GOOGLE_APPLICATION_CREDENTIALS o ubica firebase-service-account.json.');
  process.exit(0);
}
const serviceAccount = require(saPath);

if (!admin.getApps().length) {
  admin.initializeApp({ credential: admin.cert(serviceAccount) });
}
const db = getFirestore();

const suggestions = [
  {
    refCode: 'SUG-W8421',
    title: 'Poder consultar el estado y la respuesta de mi sugerencia con mi código de referencia',
    description: 'Sería excelente poder ingresar en la misma página de sugerencias o en Mi Cuenta el código único que nos dan al enviar una sugerencia, para ver si fue leída, en qué estado está y si el equipo nos dejó una respuesta.',
    category: 'web_platform',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Carlos Méndez',
    authorEmail: 'carlos.mendez@empresa-ejemplo.com',
    authorPhone: '809-555-0142',
    rating: 5,
    benefit: 'Transparencia para los usuarios y seguimiento en tiempo real de las solicitudes de mejora.',
    adminNotes: 'Revisado y priorizado por el equipo DevSecOps. Se habilitó buscador por refCode y muro comunitario en sugerencias.html y panel admin.',
    officialResponse: '¡Excelente noticia, Carlos! Hemos implementado la herramienta de seguimiento por código de referencia. Ahora cualquier usuario puede ingresar su código SUG-XXXXX en el buzón para consultar el estado en tiempo real y leer la respuesta oficial de nuestro equipo.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/sugerencias.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-C9130',
    title: 'Añadir proyectores Epson de alta luminosidad para salas de reuniones al catálogo',
    description: 'En nuestra empresa requerimos adquirir proyectores para dos salas de conferencias corporativas. Vimos impresoras Epson en su web, pero no encontramos proyectores multimedia con garantía local.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Ramón Alcántara',
    authorEmail: 'ralcantara@serviciosrd.com',
    rating: 5,
    benefit: 'Equipamiento integral audiovisual para clientes corporativos y centros educativos.',
    adminNotes: 'Coincide con la necesidad detectada en búsquedas. Integrados los modelos Epson PowerLite E20 3400 lúmenes y Epson CO-FH02 Full HD en Equipos de Oficina.',
    officialResponse: '¡Hola Ramón! Tu sugerencia ha sido implementada con éxito. Ya incorporamos al catálogo corporativo de Equipos de Oficina los proyectores Epson PowerLite E20 (3,400 lúmenes) y Epson CO-FH02 Full HD 1080p con tecnología 3LCD y garantía oficial de Futunet.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/equipos-oficina.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-M5204',
    title: 'Filtros rápidos de marcas y disponibilidad en dispositivos móviles',
    description: 'Cuando entro desde el teléfono móvil a buscar laptops o accesorios, la lista es muy extensa y me gustaría tener botones rápidos de filtro por marca arriba de los productos.',
    category: 'web_platform',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Laura Santana',
    authorEmail: 'laura.santana@gmail.com',
    rating: 4,
    benefit: 'Mejor experiencia móvil y menor tasa de abandono en compras.',
    adminNotes: 'Implementada barra táctil horizontal de filtros rápidos por marca y disponibilidad sobre la cuadrícula del catálogo en catalogo.html, catalog.js y catalog.css, con soporte fluido en smartphones y sincronización bidireccional.',
    officialResponse: '¡Hola Laura! Tu sugerencia ha sido implementada con éxito. Ya incorporamos al catálogo una barra horizontal de filtros táctiles rápidos por marca (con acceso directo a Dell, HP, Lenovo, Epson y más) y selector de disponibilidad en stock para smartphones y ordenadores. Ahora puedes filtrar al instante sin desplazarte ni abrir menús complejos. ¡Gracias por ayudarnos a mejorar Futunet!',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/index.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-F3819',
    title: 'Descarga directa de comprobantes de pago e internet en PDF',
    description: 'Añadir botón para descargar el comprobante de pago de mensualidad de internet residencial directamente en PDF tras registrar el pago.',
    category: 'customer_service',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Marcos Rosario',
    rating: 5,
    benefit: 'Comodidad para usuarios que reportan gastos mensuales a contabilidad.',
    adminNotes: 'Implementado y validado en el portal de clientes con generación y visor de comprobantes PDF.',
    officialResponse: '¡Implementado! Ahora los usuarios pueden previsualizar y descargar su comprobante de pago en PDF inmediatamente desde el módulo de pagos de internet.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/portal-servicios.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];

async function seed() {
  for (const s of suggestions) {
    const docRef = db.collection('suggestions').doc(s.refCode);
    await docRef.set(s);
    console.log('Saved & responded:', s.refCode, '->', s.title);
  }
  console.log('All suggestions seeded and responded successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding suggestions:', err);
  process.exit(1);
});
