/**
 * sync-catalog-improvements-lote31.cjs
 * Sincroniza los 6 nuevos productos de Lote 31 (Cisco, Ubiquiti, MikroTik, TP-Link, Epson, Schneider Electric)
 * tanto en js/backup_data.js como en la colección 'products' de Firestore.
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.resolve(projectRoot, '..', 'futunet-backend', 'firebase-service-account.json');

const ciscoCatalyst9200lItems = [
  {
    id: 'redes_cisco_catalyst_9200l_24p_4x_poe',
    department: 'redes',
    category: 'Redes y Telecomunicaciones',
    brand: 'Cisco',
    title: 'Switch Administrable Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Enlaces 10G SFP+ (C9200L-24P-4X-E)',
    desc: 'Switch administrable Layer 3 de alto rendimiento Cisco Catalyst 9200L con 24 puertos Gigabit Ethernet 10/100/1000 PoE+ con presupuesto de potencia de 370W, 4 puertos troncales fijos de 10 Gbps SFP+ para fibra óptica de ultra alta velocidad, capacidad de conmutación de 128 Gbps, tasa de reenvío de 95.23 Mpps, enrutamiento estático y dinámico Layer 3 (RIP, OSPF, EIGRP Stub), soporte Cisco DNA Center, fuentes de poder redundantes opcionales y seguridad integral de hardware Cisco Trustworthy. Diseñado para redes empresariales críticas, clínicas, hospitales y centros corporativos en Santiago. Garantía oficial Cisco Enhanced Limited Lifetime Warranty (E-LLW).',
    price: 'RD$ 145,000.00',
    img: 'img/productos/catalogo/cisco-catalyst-9200l-24p-4x-switch.webp',
    gallery: ['img/productos/catalogo/cisco-catalyst-9200l-24p-4x-switch.webp'],
    specs: [
      '24 Puertos Gigabit Ethernet con alimentación PoE+ (presupuesto 370W)',
      '4 Enlaces troncales de fibra óptica de 10 Gbps SFP+ de alta capacidad',
      'Enrutamiento estático y dinámico Layer 3 completo (OSPF, RIP, EIGRP)',
      'Capacidad de conmutación de 128 Gbps y tasa de reenvío de 95.23 Mpps',
      'Seguridad Trustworthy de Cisco con arranque seguro y verificación de firmware',
      'Garantía oficial Cisco Enhanced Limited Lifetime (E-LLW) en Santiago'
    ]
  }
];

const ubiquitiU6EnterpriseItems = [
  {
    id: 'redes_ubiquiti_unifi_u6_enterprise_ap',
    department: 'redes',
    category: 'Redes y Telecomunicaciones',
    brand: 'Ubiquiti',
    title: 'Punto de Acceso Wi-Fi 6E Tri-Banda de Ultra Alta Densidad Ubiquiti UniFi U6 Enterprise con Puerto 2.5 GbE PoE+ (U6-Enterprise)',
    desc: 'Punto de acceso empresarial de ultra alta densidad Ubiquiti UniFi U6 Enterprise equipado con tecnología Wi-Fi 6E de tres bandas independientes que aprovecha la nueva banda de 6 GHz para velocidades extremas sin interferencias. Ofrece una tasa de transferencia combinada agregada de 10.2 Gbps (4.8 Gbps en 6 GHz con canales de 160 MHz, 4.8 Gbps en 5 GHz y 573.5 Mbps en 2.4 GHz), puerto uplink RJ45 de 2.5 Gbps con alimentación PoE+ 802.3at, soporte para más de 600 clientes concurrentes sin degradación y gestión centralizada mediante la controladora UniFi Network. Ideal para auditorios, clínicas, campus educativos y naves logísticas en Santiago. Garantía oficial Ubiquiti en República Dominicana.',
    price: 'RD$ 24,900.00',
    img: 'img/productos/catalogo/ubiquiti-unifi-u6-enterprise-ap.webp',
    gallery: ['img/productos/catalogo/ubiquiti-unifi-u6-enterprise-ap.webp'],
    specs: [
      'Tecnología Wi-Fi 6E Tri-Banda (banda ultra limpia de 6 GHz, 5 GHz y 2.4 GHz)',
      'Velocidad combinada agregada de 10.2 Gbps con canales de 160 MHz',
      'Puerto de enlace ascendente de 2.5 Gbps Ethernet con alimentación PoE+',
      'Capacidad de conexión simultánea para más de 600 clientes activos',
      'Gestión centralizada en tiempo real mediante software UniFi Network',
      'Garantía oficial Ubiquiti Networks con soporte corporativo en Santiago'
    ]
  }
];

const mikrotikCcr2004Items = [
  {
    id: 'redes_mikrotik_ccr2004_16g_2s_cloud_core_router',
    department: 'redes',
    category: 'Redes y Telecomunicaciones',
    brand: 'MikroTik',
    title: 'Cloud Core Router MikroTik CCR2004-16G-2S+PC con 16 Puertos Gigabit y 2 Bahías 10G SFP+ Refrigeración Silenciosa',
    desc: 'Router de agregación y borde para telecomunicaciones de alta demanda MikroTik CCR2004-16G-2S+PC. Equipado con un potente procesador Annapurna Labs Alpine AL32400 Quad-Core a 1.7 GHz de arquitectura ARM de 64 bits con el mayor rendimiento mononúcleo de toda la serie CCR, 4 GB de memoria RAM DDR4, 16 puertos Gigabit Ethernet 10/100/1000, 2 jaulas de fibra óptica 10G SFP+, puerto de consola RJ45 y chasis de aluminio blanco con refrigeración pasiva de 0 dB (sin ventiladores) para operación completamente silenciosa en oficinas ejecutivas y cuartos de telecomunicaciones. Viene con sistema operativo RouterOS v7 y licencia Nivel 6. Garantía oficial MikroTik en Santiago.',
    price: 'RD$ 42,500.00',
    img: 'img/productos/catalogo/mikrotik-ccr2004-16g-2s-router.webp',
    gallery: ['img/productos/catalogo/mikrotik-ccr2004-16g-2s-router.webp'],
    specs: [
      'Procesador Quad-Core Annapurna Labs AL32400 a 1.7 GHz (ARM 64-bit)',
      '16 Puertos Gigabit Ethernet + 2 Bahías troncales de fibra óptica 10G SFP+',
      'Refrigeración pasiva disipadora 100% silenciosa (0 dB, sin ruidos de ventilador)',
      'Memoria RAM DDR4 de 4 GB y almacenamiento NAND de alto rendimiento',
      'Sistema operativo RouterOS v7 con licencia permanente Nivel 6 incluida',
      'Garantía oficial MikroTik con asistencia técnica en República Dominicana'
     ]
  }
];

const tplinkEap670Items = [
  {
    id: 'redes_tplink_omada_eap670_wifi6_ap',
    department: 'redes',
    category: 'Redes y Telecomunicaciones',
    brand: 'TP-Link',
    title: 'Punto de Acceso Wi-Fi 6 AX5400 de Techo TP-Link Omada EAP670 con Puerto 2.5 GbE PoE+ y Canal de 160 MHz',
    desc: 'Punto de acceso empresarial para montaje en techo o pared TP-Link Omada EAP670. Diseñado con tecnología Wi-Fi 6 que entrega velocidades ultra rápidas de hasta 4804 Mbps en la banda de 5 GHz y 574 Mbps en la banda de 2.4 GHz (total AX5400), canal extendido HE160 de 160 MHz que duplica el ancho de banda por cliente, puerto Ethernet de 2.5 Gbps que supera la barrera Gigabit para eliminar cuellos de botella con alimentación PoE+ 802.3at, roaming continuo 802.11k/v sin desconexiones al desplazarse por el edificio y portal cautivo con autenticación por SMS/Facebook. Totalmente integrado a la plataforma de gestión centralizada Omada SDN en la nube. Garantía oficial TP-Link en Santiago.',
    price: 'RD$ 13,800.00',
    img: 'img/productos/catalogo/tplink-omada-eap670-wifi6-ap.webp',
    gallery: ['img/productos/catalogo/tplink-omada-eap670-wifi6-ap.webp'],
    specs: [
      'Velocidad combinada ultra rápida AX5400 (4804 Mbps en 5 GHz + 574 Mbps en 2.4 GHz)',
      'Canal de transmisión HE160 de 160 MHz para duplicar el rendimiento Wi-Fi 6',
      'Puerto Ethernet multi-gigabit de 2.5 Gbps con alimentación PoE+ 802.3at',
      'Roaming continuo 802.11k/v y balanceo de carga automático entre bandas',
      'Gestión centralizada en la nube mediante controladores de red Omada SDN',
      'Garantía oficial TP-Link con soporte corporativo en República Dominicana'
    ]
  }
];

const epsonPowerliteL530uItems = [
  {
    id: 'oficina_epson_powerlite_l530u_proyector_laser',
    department: 'oficina',
    category: 'Equipos de Oficina',
    brand: 'Epson',
    title: 'Proyector Láser Corporativo Full HD WUXGA Epson PowerLite L530U de 5,200 Lúmenes con Fuente Láser de 20,000 Horas',
    desc: 'Proyector láser profesional de alta gama Epson PowerLite L530U para salas de directorio, centros de eventos corporativos, aulas magistrales y templos en Santiago. Incorpora tecnología 3LCD de 3 chips con una luminosidad de 5,200 lúmenes tanto en color como en blanco, resolución nativa panorámica WUXGA Full HD (1920 x 1200 en relación 16:10), relación de contraste dinámico de hasta 2,500,000:1 y una fuente de luz láser de estado sólido con hasta 20,000 horas de funcionamiento continuo sin cambios de lámpara ni filtros. Soporta proyección desde 50 hasta 500 pulgadas con zoom óptico manual de 1.6x, desplazamiento de lente horizontal y vertical, conectividad HDMI dual, HDBaseT para transmisión de video y control por un solo cable de red UTP Cat 6 de hasta 100 metros y red inalámbrica opcional. Garantía oficial Epson de 3 años en República Dominicana.',
    price: 'RD$ 115,000.00',
    img: 'img/productos/catalogo/epson-powerlite-l530u-proyector-laser.webp',
    gallery: ['img/productos/catalogo/epson-powerlite-l530u-proyector-laser.webp'],
    specs: [
      'Tecnología 3LCD de 3 chips con brillo de 5,200 lúmenes en blanco y color',
      'Resolución nativa WUXGA Full HD (1920 x 1200) y contraste 2,500,000:1',
      'Fuente de luz láser de estado sólido con vida útil de hasta 20,000 horas',
      'Tamaño de pantalla flexible desde 50 hasta 500 pulgadas con zoom de 1.6x',
      'Conectividad avanzada con entradas HDMI duales y puerto de red HDBaseT',
      'Garantía corporativa oficial Epson de 3 años con soporte técnico en Santiago'
    ]
  }
];

const apcEasyUpsSrv6kItems = [
  {
    id: 'energia_apc_schneider_easy_ups_srv_6000va_rack_online',
    department: 'energia',
    category: 'Energía y Climatización',
    brand: 'Schneider Electric',
    title: 'UPS Online Doble Conversión en Rack APC by Schneider Electric Easy UPS SRV 6kVA / 6000VA 208/240V 4U con Tarjeta SNMP (SRV6KRILRK)',
    desc: 'Sistema UPS industrial Online de doble conversión para montaje en rack de 19 pulgadas APC by Schneider Electric Easy UPS SRV de 6kVA / 6kW (SRV6KRILRK). Ofrece cero tiempo de transferencia (0 ms) ante anomalías en la red eléctrica, factor de potencia unitario (1.0) entregando 6000 vatios reales de protección ininterrumpida para servidores empresariales, switches de núcleo, almacenamiento SAN y sistemas de telecomunicaciones críticas. Diseñado para voltaje nominal de entrada y salida bifásico/trifásico de 208/240V con regulación de tensión de ultra alta precisión de +/- 1%, pantalla LCD multifunción de alta resolución para supervisión de parámetros en tiempo real, bypass estático automático y manual, y tarjeta de gestión de red SNMP/Web preinstalada para control y apagado graceful por red. Garantía oficial Schneider Electric de 2 años en Santiago.',
    price: 'RD$ 168,000.00',
    img: 'img/productos/catalogo/apc-easy-ups-srv-6kva-rack-online.webp',
    gallery: ['img/productos/catalogo/apc-easy-ups-srv-6kva-rack-online.webp'],
    specs: [
      'Topología Online Doble Conversión de grado industrial con 0 ms de transferencia',
      'Potencia nominal de 6,000 VA / 6,000 W con factor de potencia unitario 1.0',
      'Voltaje de operación de 208/240V para centros de datos y cargas industriales',
      'Formato compacto para rack de 4U con rieles de montaje de alta carga incluidos',
      'Tarjeta de gestión de red SNMP preinstalada con monitoreo web y alertas email',
      'Garantía oficial APC by Schneider Electric de 2 años con soporte en República Dominicana'
    ]
  }
];

const allNewItems = [
  ...ciscoCatalyst9200lItems,
  ...ubiquitiU6EnterpriseItems,
  ...mikrotikCcr2004Items,
  ...tplinkEap670Items,
  ...epsonPowerliteL530uItems,
  ...apcEasyUpsSrv6kItems
];

// 1. Inyectar en js/backup_data.js
const backupPath = path.resolve(projectRoot, 'js', 'backup_data.js');
let backupContent = fs.readFileSync(backupPath, 'utf8');

for (const item of allNewItems) {
  if (backupContent.includes(item.id)) {
    console.log(`[SKIP] El producto ${item.id} ya existe en js/backup_data.js`);
    continue;
  }

  const exportIndex = backupContent.lastIndexOf('if (typeof module !==');
  if (exportIndex === -1) {
    console.error('No se encontró el bloque de exportación en js/backup_data.js');
    process.exit(1);
  }

  const beforeExport = backupContent.substring(0, exportIndex);
  const afterExport = backupContent.substring(exportIndex);
  const closingBracketIndex = beforeExport.lastIndexOf('];');

  if (closingBracketIndex === -1) {
    console.error('No se encontró el cierre de array ]; en js/backup_data.js');
    process.exit(1);
  }

  const jsonSnippet = ',\n  ' + JSON.stringify(item, null, 2).replace(/\n/g, '\n  ') + '\n';
  backupContent = beforeExport.substring(0, closingBracketIndex) + jsonSnippet + beforeExport.substring(closingBracketIndex) + afterExport;
  console.log(`[APPEND] Añadido ${item.id} a js/backup_data.js`);
}

fs.writeFileSync(backupPath, backupContent, 'utf8');
console.log('[OK] js/backup_data.js sincronizado exitosamente.');

// 2. Sincronizar en Firestore
async function syncFirestore() {
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn('[WARN] No se encontró el archivo de credenciales de Firebase en:', serviceAccountPath);
    return;
  }

  if (!admin.getApps().length) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.cert(serviceAccount)
    });
  }

  const db = getFirestore();
  const productsCol = db.collection('products');

  for (const item of allNewItems) {
    const docRef = productsCol.doc(item.id);
    await docRef.set({
      ...item,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`[FIRESTORE] Producto ${item.id} sincronizado en la colección 'products'.`);
  }

  console.log('Todos los productos de Lote 31 fueron sincronizados en Firestore.');
}

syncFirestore().catch(err => {
  console.error('Error sincronizando con Firestore:', err);
  process.exit(1);
});
