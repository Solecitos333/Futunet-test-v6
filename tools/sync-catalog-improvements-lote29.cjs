/**
 * sync-catalog-improvements-lote29.cjs
 * Sincroniza los 5 nuevos productos de Lote 29 (HP, Juniper, LG, Linksys, Netgear)
 * tanto en js/backup_data.js como en la colección 'products' de Firestore.
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.resolve(projectRoot, '..', 'futunet-backend', 'firebase-service-account.json');

const hpProSff400Items = [
  {
    id: 'oficina_hp_pro_sff_400_g9_desktop',
    department: 'oficina',
    category: 'Equipos de Oficina',
    brand: 'HP',
    title: 'Computadora Corporativa de Escritorio HP Pro SFF 400 G9 (Intel Core i7-13700, 16GB RAM, 512GB SSD NVMe, HP Wolf Security)',
    desc: 'Computadora de escritorio empresarial en formato compacto Small Form Factor (SFF) con procesador Intel Core i7-13700 de 13ª generación (16 núcleos / 24 hilos hasta 5.2 GHz), 16 GB de memoria RAM DDR4-3200 expandible a 64 GB, unidad de estado sólido SSD M.2 PCIe NVMe de 512 GB, gráficos Intel UHD 770 con salidas DisplayPort 1.4a y HDMI 1.4b, conectividad Ethernet Gigabit, suite de protección de seguridad por hardware HP Wolf Pro Security Edition y chip TPM 2.0. Garantía oficial HP de 3 años On-Site en República Dominicana.',
    price: 'RD$ 52,900.00',
    img: 'img/productos/catalogo/hp-pro-sff-400-g9-desktop.webp',
    gallery: ['img/productos/catalogo/hp-pro-sff-400-g9-desktop.webp'],
    specs: [
      'Procesador Intel Core i7-13700 (16 núcleos, hasta 5.2 GHz)',
      '16 GB RAM DDR4-3200 (2 slots DIMM expandibles a 64 GB)',
      'SSD M.2 PCIe NVMe de 512 GB de alta velocidad',
      'Seguridad HP Wolf Pro Security y chip dTPM 2.0',
      'Salidas de video DisplayPort 1.4a y HDMI 1.4b',
      'Garantía oficial HP de 3 años On-Site en Santiago y RD'
    ]
  }
];

const juniperMistAp43Items = [
  {
    id: 'redes_juniper_ap43_access_point_wifi6_mist_ai',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Juniper',
    title: 'Punto de Acceso Empresarial Wi-Fi 6 Juniper Mist AP43 con Inteligencia Artificial Mist AI y Antena vBLE Integrada',
    desc: 'Punto de acceso de alto rendimiento Wi-Fi 6 (802.11ax) de grado empresarial impulsado por la nube de Inteligencia Artificial Mist AI con asistente de red virtual Marvis. Diseñado para entornos de ultra alta densidad corporativa, centros de convenciones, hospitales y universidades. Incorpora tecnología 4x4:4 MU-MIMO simultáneo en 5 GHz y 2.4 GHz, radio dedicada para escaneo y seguridad WIDS/WIPS 24/7, arreglo de antena direccional de 16 elementos vBLE (Virtual Bluetooth Low Energy) para servicios de localización en interiores sin balizas físicas, y puerto de enlace Ethernet Multigigabit de 2.5 Gbps con alimentación PoE+ (802.3at). Garantía oficial Juniper Networks en República Dominicana.',
    price: 'RD$ 46,500.00',
    img: 'img/productos/catalogo/juniper-ap43-access-point-wifi6-mist.webp',
    gallery: ['img/productos/catalogo/juniper-ap43-access-point-wifi6-mist.webp'],
    specs: [
      'Estándar Wi-Fi 6 (802.11ax) 4x4:4 MU-MIMO de 4 flujos en 5 GHz y 2.4 GHz',
      'Gestión y analítica basada en Inteligencia Artificial Mist AI con Marvis VNA',
      'Arreglo de antena direccional vBLE de 16 elementos patentado por Juniper',
      'Radio dedicada de escaneo espectral continuo, seguridad WIDS/WIPS y BLE',
      'Puerto Ethernet Multigigabit 2.5G con soporte PoE+ 802.3at',
      'Garantía oficial Juniper Networks con soporte especializado en Santiago'
    ]
  }
];

const lg32un880ErgoItems = [
  {
    id: 'oficina_lg_32un880_ergo_4k_monitor',
    department: 'oficina',
    category: 'Equipos de Oficina',
    brand: 'LG',
    title: 'Monitor Profesional Ergonómico 4K UHD LG UltraFine 32UN880-B Ergo 31.5" IPS (3840x2160, DCI-P3 95%, HDR10, USB-C 60W, Brazo C-Clamp)',
    desc: 'Monitor profesional 4K UHD de 31.5 pulgadas LG UltraFine 32UN880-B con panel IPS de resolución 3840 x 2160 y fidelidad de color DCI-P3 95% con soporte HDR10. Incluye soporte articulado ergonómico LG Ergo Stand con abrazadera C-Clamp que permite extensión, retracción, giro de ±280°, pivote a 90° vertical, ajuste de altura de 130 mm e inclinación de ±25°. Conectividad USB-C con video 4K, transferencia de datos y carga Power Delivery de 60W para laptops con un solo cable, doble entrada HDMI 2.0, DisplayPort 1.4, hub USB 3.0 y altavoces estéreo de 5W integrados con Waves MaxxAudio. Garantía oficial LG en República Dominicana.',
    price: 'RD$ 38,900.00',
    img: 'img/productos/catalogo/lg-32un880-ergo-4k-monitor.webp',
    gallery: ['img/productos/catalogo/lg-32un880-ergo-4k-monitor.webp'],
    specs: [
      'Panel IPS 31.5 pulgadas Ultra HD 4K (3840 x 2160) con soporte HDR10',
      'Gama de color profesional DCI-P3 95% calibrado de fábrica',
      'Soporte ergonómico premium Ergo Stand con abrazadera C-Clamp (giro, pivote, altura)',
      'Puerto USB-C multifunción con carga Power Delivery de 60W y modo DP Alt',
      'Doble puerto HDMI 2.0, DisplayPort 1.4 y concentrador USB 3.0',
      'Altavoces estéreo integrados de 5W con calibración Waves MaxxAudio'
    ]
  }
];

const linksysLgs352mpcItems = [
  {
    id: 'redes_linksys_lgs352mpc_smart_poe_switch_48p',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Linksys',
    title: 'Switch Smart Administrable Gigabit PoE+ Linksys LGS352MPC de 48 Puertos Gigabit PoE+ con 4 Enlaces 10G SFP+ (Presupuesto 740W)',
    desc: 'Switch empresarial Layer 2+ para montaje en rack de 19 pulgadas con 48 puertos Gigabit Ethernet 10/100/1000 Mbps con alimentación PoE+ IEEE 802.3at/af y un presupuesto total de potencia PoE de 740W. Cuenta con 4 puertos de enlace ascendente dedicados de 10 Gbps SFP+ para agregación de fibra óptica hacia el centro de datos. Capacidad de conmutación de 176 Gbps, soporte de enrutamiento estático IPv4/IPv6, calidad de servicio QoS avanzada, VLANs con etiquetado 802.1Q, snooping IGMP/DHCP, autenticación de seguridad 802.1X y listas de control de acceso ACL. Chasis metálico ventilado con protección contra sobretensiones para despliegues masivos de telefonía IP, cámaras de seguridad y puntos de acceso Wi-Fi 6. Garantía de 5 años con soporte oficial Linksys en Santiago.',
    price: 'RD$ 41,500.00',
    img: 'img/productos/catalogo/linksys-lgs352mpc-smart-poe-switch.webp',
    gallery: ['img/productos/catalogo/linksys-lgs352mpc-smart-poe-switch.webp'],
    specs: [
      '48 Puertos Gigabit PoE+ (802.3at/af) con presupuesto de alimentación de 740W',
      '4 Jaulas dedicadas 10G SFP+ para enlaces de agregación y fibra óptica',
      'Capacidad de conmutación de 176 Gbps sin bloqueo de paquetes',
      'Enrutamiento estático Layer 2+, VLANs 802.1Q, QoS y snooping IGMP',
      'Seguridad robusta con autenticación 802.1X, ACLs y DHCP Snooping',
      'Garantía oficial Linksys de 5 años con soporte corporativo en Santiago'
    ]
  }
];

const netgearM4250Items = [
  {
    id: 'redes_netgear_m4250_10g2f_poe_switch_av',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Netgear',
    title: 'Switch Administrable AV Line Netgear Pro AV M4250-10G2F-PoE+ (GSM4212P) de 8 Puertos Gigabit PoE+ (125W), 2x 1GbE y 2x 1G SFP',
    desc: 'Switch administrable especializado de la línea Netgear AV Line diseñado desde cero para instalaciones de Audio y Video sobre IP (AV over IP), audio digital en red Dante, AES67, Q-SYS y video sin compresión NDI. Equipado con 8 puertos Gigabit PoE+ (802.3at) con presupuesto de potencia de 125W, 2 puertos Gigabit de cobre adicionales y 2 ranuras de fibra óptica SFP de 1G para uplinks. Integra interfaz de usuario basada en perfiles AV preconfigurados que eliminan la complejidad de configuración de multidifusión IGMP y PTPv2 en redes audiovisuales. Chasis de diseño reversible con opciones de montaje frontal o trasero en rack, puertos con orientación limpia y ventiladores controlados térmicamente ultra silenciosos con modo Fanless o bajo ruido en producciones en vivo. Garantía de por vida Netgear ProSAFE con reemplazo al siguiente día hábil en República Dominicana.',
    price: 'RD$ 37,800.00',
    img: 'img/productos/catalogo/netgear-m4250-10g2f-poe-switch.webp',
    gallery: ['img/productos/catalogo/netgear-m4250-10g2f-poe-switch.webp'],
    specs: [
      'Optimizado para AV over IP, Dante, NDI, AES67 y Q-SYS con perfiles AV dedicados',
      '8 Puertos Gigabit PoE+ (802.3at) con presupuesto total de 125W',
      '2 Puertos Gigabit Ethernet estándar y 2 ranuras SFP de 1G para fibra óptica',
      'Interfaz gráfica especializada Netgear AV UI con asignación de perfiles por puerto',
      'Operación ultra silenciosa con control inteligente de ventiladores (< 27.4 dBA)',
      'Garantía de por vida Netgear ProSAFE con soporte especializado en Santiago'
    ]
  }
];

const lote29Items = [
  ...hpProSff400Items,
  ...juniperMistAp43Items,
  ...lg32un880ErgoItems,
  ...linksysLgs352mpcItems,
  ...netgearM4250Items
];

function updateBackupData() {
  const backupPath = path.join(projectRoot, 'js', 'backup_data.js');
  const code = fs.readFileSync(backupPath, 'utf8');

  let mockDatabase;
  global.window = {};
  eval(code.replace('const mockDatabase =', 'mockDatabase ='));
  console.log(`[backup_data] Registros iniciales: ${mockDatabase.length}`);

  let addedCount = 0;
  for (const item of lote29Items) {
    const existingIndex = mockDatabase.findIndex(p => p.id === item.id);
    if (existingIndex >= 0) {
      mockDatabase[existingIndex] = { ...mockDatabase[existingIndex], ...item };
      console.log(`[backup_data] Actualizado: ${item.id}`);
    } else {
      mockDatabase.push(item);
      addedCount++;
      console.log(`[backup_data] Agregado: ${item.id}`);
    }
  }

  console.log(`[backup_data] Nuevos productos añadidos: ${addedCount}. Total: ${mockDatabase.length}`);

  const newContent = `const mockDatabase = ${JSON.stringify(mockDatabase, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = mockDatabase;\n}\nif (typeof window !== 'undefined') {\n  window.mockDatabase = mockDatabase;\n  window.backupDatabase = mockDatabase;\n}\n`;
  fs.writeFileSync(backupPath, newContent, 'utf8');
  console.log('[backup_data] Archivo js/backup_data.js actualizado con éxito.');
}

async function updateFirestore() {
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn(`[Firestore] No se encontró credencial en ${serviceAccountPath}. Omitiendo sincronización remota.`);
    return;
  }

  const serviceAccount = require(serviceAccountPath);
  if (!admin.getApps().length) {
    admin.initializeApp({
      credential: admin.cert(serviceAccount)
    });
  }

  const db = getFirestore();
  console.log(`[Firestore] Sincronizando ${lote29Items.length} productos de Lote 29 en la colección 'products'...`);
  const batch = db.batch();

  for (const prod of lote29Items) {
    const docRef = db.collection('products').doc(prod.id);
    batch.set(docRef, {
      ...prod,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  }

  await batch.commit();
  console.log('[Firestore] Todos los productos de Lote 29 fueron sincronizados exitosamente en Firestore.');
}

async function main() {
  updateBackupData();
  await updateFirestore();
}

main().catch(err => {
  console.error('Error fatal durante sincronización:', err);
  process.exit(1);
});
