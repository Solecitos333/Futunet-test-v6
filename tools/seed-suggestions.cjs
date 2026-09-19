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
  },
  {
    refCode: 'SUG-L4920',
    title: 'Libreros de madera ejecutivos y estanterías modulares para archivo y oficina en el catálogo',
    description: 'Estuvimos buscando en la sección de mobiliario de oficina libreros de madera o estanterías ejecutivas para carpetas y expedientes corporativos, pero las búsquedas de "librero de madera" no arrojaban resultados. Sería de gran utilidad tener opciones de libreros y estanterías de madera ejecutiva para complementar los escritorios.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Lic. Domingo Rodríguez',
    authorEmail: 'd.rodriguez@bufeterd.com',
    authorPhone: '809-555-0871',
    rating: 5,
    benefit: 'Permite a despachos legales, empresas e instituciones adquirir mobiliario documental de madera y archivo ejecutivo.',
    adminNotes: 'Sincronizado mob_oficina_7 en el inventario como Librero de madera ejecutivo para oficina con especificaciones completas para resolver búsquedas de librero y archivo.',
    officialResponse: '¡Hola Lic. Rodríguez! Hemos atendido su sugerencia. Ya se encuentra disponible en el catálogo de Mobiliario el Librero de madera ejecutivo para oficina (código mob_oficina_7) con estantes reforzados para archivo y expedientes corporativos. Ahora las búsquedas por "librero de madera" muestran de inmediato este modelo con opción a cotización directa.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/catalogo.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-T1802',
    title: 'Aires acondicionados TGM Mini-Split y climatización con filtro directo en el catálogo',
    description: 'Notamos que tienen servicios de climatización y energía, pero al buscar aires acondicionados TGM mini-split (especialmente 18,000 BTU) no había un chip rápido de marca TGM en la barra ni acceso directo a la ficha técnica con cotización.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Héctor Valdez',
    authorEmail: 'hvaldez@solucionesclima.do',
    authorPhone: '829-555-3490',
    rating: 5,
    benefit: 'Facilita a empresas y hogares encontrar soluciones de climatización de alta demanda con especificaciones claras y cotización inmediata.',
    adminNotes: 'Priorizada la marca TGM en la barra táctil de filtros rápidos de catalog.js y optimizada la respuesta de búsqueda de climatización.',
    officialResponse: '¡Hola Héctor! Tu sugerencia ha sido implementada. Hemos integrado la marca TGM con filtro rápido prioritario en la barra táctil del catálogo, permitiendo filtrar directamente los modelos TGM Mini-Split de 12,000 BTU, 18,000 BTU y 24,000 BTU, consultar sus especificaciones técnicas de alta eficiencia y solicitar cotización formal o paquete de instalación con un solo toque.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/catalogo.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-B6410',
    title: 'Botón de copiar código de seguimiento al enviar una sugerencia',
    description: 'Al enviar una sugerencia en el buzón web aparece el código SUG-XXXXX, pero en smartphones es incómodo seleccionarlo para copiarlo. Deberían poner un botón de un clic para copiar el código directamente al portapapeles.',
    category: 'web_platform',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Pamela Castro',
    authorEmail: 'pamela.castro@techrd.com',
    rating: 5,
    benefit: 'Mejora la usabilidad táctil móvil y agiliza la consulta del estado de la propuesta.',
    adminNotes: 'Implementado botón #sug-copy-code-btn en la tarjeta de éxito con retroalimentación visual táctil y prellenado del campo de seguimiento.',
    officialResponse: '¡Excelente sugerencia, Pamela! Hemos añadido un botón de un toque "Copiar código" junto al código de referencia tras enviar cualquier propuesta en sugerencias.html, con confirmación visual de copiado al portapapeles. ¡Gracias por ayudarnos a brindar una experiencia más ágil!',
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
    refCode: 'SUG-P5512',
    title: 'Disponibilidad de impresoras multifuncionales EcoTank y térmicas POS en el catálogo',
    description: 'Al pulsar en el enlace de impresoras desde la página principal o buscar "impresora" no se mostraban modelos en stock. Solicitamos habilitar las multifuncionales Epson de tinta continua y térmicas para puntos de venta.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Lic. Carlos Tavárez',
    authorEmail: 'c.tavarez@serviciosrd.com',
    authorPhone: '809-555-0912',
    rating: 5,
    benefit: 'Equipamiento completo de impresión corporativa, escolar y comercial para clientes y negocios de Santiago.',
    adminNotes: 'Activadas y sincronizadas en Firestore las impresoras prod_ev8mssce4 (Epson EcoTank L3250), prod_p0wqnr5bc (Brother T720), prod_oh55hargc (Canon G2110) y prod_tk6it44v0 (Térmica POS 80mm).',
    officialResponse: '¡Hola Carlos! Muchas gracias por escribirnos. Ya hemos activado y verificado en el catálogo las impresoras multifuncionales Epson EcoTank L3250 con sistema continuo WiFi, Brother T720 con alimentador automático ADF, Canon Pixma e impresoras térmicas POS de 80mm para puntos de venta, listas para cotización y pedido en línea.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/catalogo.html?cat=equipos&q=impresora',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-A7291',
    title: 'Disponibilidad de Apple AirPods y accesorios de audio en el catálogo',
    description: 'Estuve buscando AirPods originales de Apple en el buscador de la tienda y no aparecían resultados activos. Sería genial que estuvieran habilitados con entrega inmediata y garantía local en Santiago.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Katherine Morales',
    authorEmail: 'kmorales@techsolutions.do',
    authorPhone: '849-555-7821',
    rating: 5,
    benefit: 'Permite a profesionales y usuarios adquirir auriculares inalámbricos de alta fidelidad para videollamadas, productividad y estudio.',
    adminNotes: 'Activado prod_yny47xadr en Firestore, corregida la codificación de caracteres a UTF-8 y verificado el soporte a términos de audio en el buscador.',
    officialResponse: '¡Hola Katherine! Gracias por tu sugerencia. Ya se encuentran habilitados y disponibles en el catálogo los Apple AirPods (2.ª generación) originales con estuche de carga Lightning, garantía oficial y despacho inmediato. Puedes encontrarlos buscando "airpods" o en la sección de Periféricos y Accesorios.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/catalogo.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-K3844',
    title: 'Teclados de oficina Dell USB y periféricos cableados en el catálogo',
    description: 'Buscamos reemplazar teclados en nuestra oficina y al buscar "teclado" no aparecían resultados de teclados cableados económicos y resistentes para oficina.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Marcos Guzmán',
    authorEmail: 'mguzman@operacionesrd.com',
    authorPhone: '809-555-6430',
    rating: 5,
    benefit: 'Reemplazo rápido y económico de periféricos para empresas, despachos e instituciones.',
    adminNotes: 'Activado prod_9p6f6zzh6 en Firestore como Teclado Dell KB216 USB full-size con teclado numérico para digitación continua.',
    officialResponse: '¡Hola Marcos! Gracias por escribirnos. Ya se encuentra activo en el catálogo el Teclado Dell KB216 USB formato completo con teclado numérico, ideal para uso rudo y digitación continua en oficinas, listo para despacho inmediato.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/catalogo.html',
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
