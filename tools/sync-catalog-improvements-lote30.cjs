/**
 * sync-catalog-improvements-lote30.cjs
 * Sincroniza los 6 nuevos productos de Lote 30 (Mitsubishi, Panasonic, Paradox, Siemens, Tesla, Uniview)
 * tanto en js/backup_data.js como en la colección 'products' de Firestore.
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.resolve(projectRoot, '..', 'futunet-backend', 'firebase-service-account.json');

const mitsubishiPcaM36Items = [
  {
    id: 'energia_mitsubishi_pca_m36_piso_techo_inverter',
    department: 'energia',
    category: 'Energía y Climatización',
    brand: 'Mitsubishi Electric',
    title: 'Consola Comercial Tipo Piso-Techo Inverter Mitsubishi Electric PCA-M 36,000 BTU de Alta Eficiencia (PCA-M36KA2 / PUZ-A36NHA7)',
    desc: 'Consola de climatización comercial versátil para montaje horizontal bajo techo o vertical sobre el piso, ideal para restaurantes, bancos, salas de servidores, tiendas y oficinas que no cuentan con cielo raso. Equipada con compresor Inverter de 36,000 BTU/h (3 Toneladas) de ultra alta durabilidad, flujo de aire de largo alcance de hasta 12 metros con aletas motorizadas automáticas oscilantes, operación ultra silenciosa desde 37 dB, ventilador centrífugo de 4 velocidades y filtro lavable de larga vida útil resistente a grasas y polvo. Garantía oficial Mitsubishi Electric de 5 años en compresor con soporte técnico especializado en Santiago y República Dominicana.',
    price: 'RD$ 89,500.00',
    img: 'img/productos/catalogo/mitsubishi-pca-m36-piso-techo-inverter.webp',
    gallery: ['img/productos/catalogo/mitsubishi-pca-m36-piso-techo-inverter.webp'],
    specs: [
      'Capacidad frigorífica de 36,000 BTU/h con compresor Inverter de alta eficiencia',
      'Instalación versátil bajo techo o sobre piso para espacios sin cielo raso',
      'Flujo de aire optimizado de 4 velocidades con alcance horizontal de 12 metros',
      'Operación ultra silenciosa desde 37 dB con aletas oscilantes automáticas',
      'Filtro lavable de larga duración contra polvo y partículas contaminantes',
      'Garantía oficial Mitsubishi Electric de 5 años en compresor con soporte en Santiago'
    ]
  }
];

const panasonicKxhdv800Items = [
  {
    id: 'oficina_panasonic_kx_hdv800_conferencia_sip',
    department: 'oficina',
    category: 'Equipos de Oficina',
    brand: 'Panasonic',
    title: 'Teléfono SIP para Salas de Conferencia Panasonic KX-HDV800 con Micrófonos 360° y Audio HD Full Duplex',
    desc: 'Teléfono de conferencia empresarial de diseño triangular tri-lobe con tecnología patentada OmniSound Full Duplex para captura de voz cristalina de 360 grados en salas de reuniones y directorios de hasta 30 m² (ampliable a 70 m² con micrófonos de extensión). Soporta 1 cuenta SIP nativa, puente de conferencia local de 5 vías simultáneas, ranura para tarjeta microSD con función de grabación de audio de reuniones, pantalla LCD retroiluminada de 128x64 píxeles, agenda telefónica interna de 1000 contactos, puerto Ethernet PoE 802.3af y compatibilidad total con centrales telefónicas Panasonic KX-NS500, FreePBX y Asterisk. Garantía oficial Panasonic con soporte corporativo en República Dominicana.',
    price: 'RD$ 34,900.00',
    img: 'img/productos/catalogo/panasonic-kx-hdv800-conferencia-sip.webp',
    gallery: ['img/productos/catalogo/panasonic-kx-hdv800-conferencia-sip.webp'],
    specs: [
      'Tecnología de audio patentada OmniSound Full Duplex con supresión de eco',
      'Arreglo de 3 micrófonos omnidireccionales con cobertura 360° hasta 30 m²',
      'Conectividad SIP nativa para 1 cuenta con puente de conferencia local de 5 vías',
      'Ranura para tarjeta de memoria SD con grabación de llamadas integrada',
      'Pantalla LCD retroiluminada de fácil lectura y teclado ergonómico intuitivo',
      'Garantía oficial Panasonic con configuración y soporte corporativo en Santiago'
    ]
  }
];

const paradoxNvx80Items = [
  {
    id: 'seguridad_paradox_nvx80_detector_exterior',
    department: 'seguridad',
    category: 'Sistemas de Seguridad',
    brand: 'Paradox',
    title: 'Detector de Movimiento Exterior Grado Comercial Paradox NVX80 con 8 Canales de Detección y Tecnología SeeTrue',
    desc: 'Detector de movimiento perimetral exterior para entornos de alta seguridad comercial e industrial con 8 canales de detección independientes: 4 sensores infrarrojos pasivos (PIR) de doble elemento, 2 canales de microondas Doppler y 2 canales de antienmascaramiento activo IR anti-spray. Incorpora el revolucionario procesador SeeTrue que detecta intrusos incluso cuando intentan ocultar su firma térmica tras mantas aislantes o paraguas, con alcance de 15 metros en 90 grados, inmunidad a mascotas de hasta 20 kg, pantalla OLED a color integrada para calibración intuitiva en el propio sensor sin herramientas externas y gabinete hermético IP55 con protección antisabotaje en pared y tapa. Garantía oficial Paradox Security en Santiago y RD.',
    price: 'RD$ 19,800.00',
    img: 'img/productos/catalogo/paradox-nvx80-detector-exterior.webp',
    gallery: ['img/productos/catalogo/paradox-nvx80-detector-exterior.webp'],
    specs: [
      '8 Canales de detección independientes: 4x PIR dobles + 2x Microondas + 2x Anti-spray',
      'Tecnología SeeTrue que detecta intrusos incluso bajo camuflaje térmico a 15 metros',
      'Pantalla OLED a color y menú intuitivo de calibración sin necesidad de jumpers',
      'Inmunidad para mascotas de hasta 20 kg y discriminación de ráfagas de viento',
      'Gabinete sellado de alta resistencia con protección intemperie certificada IP55',
      'Garantía oficial Paradox con integración nativa a paneles Spectra y EVO'
    ]
  }
];

const siemensSentron3va11Items = [
  {
    id: 'energia_siemens_sentron_3va11_breaker_125a',
    department: 'energia',
    category: 'Energía y Climatización',
    brand: 'Siemens',
    title: 'Interruptor Automático de Caja Moldeada Siemens Sentron 3VA11 de 3 Polos 125A 25kA (3VA1112-4ED32-0AA0)',
    desc: 'Interruptor termomagnético industrial de caja moldeada (MCCB) trifásico de 3 polos para protección de tableros generales de distribución, subestaciones eléctricas, centros de control de motores y transformadores de potencia. Diseñado con una corriente nominal In de 125 Amperios, capacidad de corte en cortocircuito Icu de 25 kA a 415V AC según norma internacional IEC 60947-2, unidad de disparo termomagnética fija TM210 (protección contra sobrecargas y cortocircuitos instantáneos), diseño ultra compacto optimizado para ahorro de espacio en cuadros eléctricos y bornas de conexión frontal de alta seguridad para conductores de cobre o aluminio. Garantía oficial Siemens Industrial en República Dominicana.',
    price: 'RD$ 14,900.00',
    img: 'img/productos/catalogo/siemens-sentron-3va11-breaker-125a.webp',
    gallery: ['img/productos/catalogo/siemens-sentron-3va11-breaker-125a.webp'],
    specs: [
      'Interruptor de caja moldeada 3 Polos (3P) con corriente nominal de 125A',
      'Capacidad de corte en cortocircuito Icu de 25 kA a 415V AC (IEC 60947-2)',
      'Unidad de disparo termomagnética fija TM210 (protección térmica y magnética)',
      'Diseño ultra compacto ideal para montaje en riel DIN o placa de montaje',
      'Borna de conexión frontal de alta seguridad para conductores de cobre y aluminio',
      'Garantía oficial Siemens Industrial con certificación y soporte en República Dominicana'
    ]
  }
];

const teslaSolarInverterItems = [
  {
    id: 'energia_tesla_solar_inverter_76kw',
    department: 'energia',
    category: 'Energía y Climatización',
    brand: 'Tesla',
    title: 'Inversor Solar Residencial y Comercial Tesla Solar Inverter 7.6 kW con 4 Entradas MPPT y Gestión Inteligente por App',
    desc: 'Inversor solar fotovoltaico de alto rendimiento con una potencia nominal de 7.6 kW (7,600W) a 240V y una eficiencia de conversión líder en la industria del 98%. Equipado con 4 seguidores independientes del punto de máxima potencia (MPPT) que permiten maximizar la captación solar en techos con múltiples orientaciones y sombreados parciales. Integra conectividad inalámbrica Wi-Fi, Ethernet y conectividad celular con actualizaciones remotas de software Over-The-Air (OTA). Totalmente compatible y preparado para conexión directa con baterías Tesla Powerwall 2/3 y controladores Tesla Backup Gateway para una transición imperceptible ante apagones eléctricos. Garantía oficial Tesla Energy de 10 años en República Dominicana.',
    price: 'RD$ 115,000.00',
    img: 'img/productos/catalogo/tesla-solar-inverter-76kw.webp',
    gallery: ['img/productos/catalogo/tesla-solar-inverter-76kw.webp'],
    specs: [
      'Potencia nominal de salida de 7.6 kW con una eficiencia máxima de conversión del 98%',
      '4 Entradas de seguimiento del punto de máxima potencia (MPPT) independientes',
      'Integración nativa con baterías Tesla Powerwall y Tesla Backup Gateway',
      'Monitoreo continuo de producción y consumo en tiempo real mediante la App Tesla',
      'Conectividad Wi-Fi, Ethernet y Celular integrada con actualizaciones automáticas OTA',
      'Garantía oficial Tesla Energy de 10 años con certificación de instalador en Santiago'
    ]
  }
];

const univiewPtz33xItems = [
  {
    id: 'seguridad_uniview_ptz_4mp_33x_lighthunter',
    department: 'seguridad',
    category: 'Sistemas de Seguridad',
    brand: 'Uniview',
    title: 'Cámara PTZ IP Uniview LightHunter 4MP con Zoom Óptico 33x, Infrarrojos de 150m y Analítica Deep Learning (IPC6854SR-X33-VF)',
    desc: 'Cámara domo PTZ IP de alta velocidad para exteriores con sensor CMOS de 1/2.8" de 4 Megapíxeles (2688 x 1520 a 30 fps) y tecnología de ultra baja iluminación LightHunter. Incorpora lente motorizado con zoom óptico potente de 33 aumentos (4.5 a 148.5 mm), iluminación infrarroja adaptativa Smart IR con alcance de hasta 150 metros, motor de analítica inteligente basada en Deep Learning con prevención de intrusión inteligente (SIP) que clasifica personas y vehículos reduciendo falsas alarmas, autoseguimiento automático PTZ inteligente (Auto-tracking), rotación continua de 360° sin fin y carcasa metálica antivandálica con protección climática IP66, resistencia a impactos IK10 y alimentación PoE+ (802.3at). Garantía de 3 años con soporte oficial Uniview en Santiago.',
    price: 'RD$ 49,900.00',
    img: 'img/productos/catalogo/uniview-ptz-4mp-33x-lighthunter.webp',
    gallery: ['img/productos/catalogo/uniview-ptz-4mp-33x-lighthunter.webp'],
    specs: [
      'Sensor CMOS 1/2.8" de 4 Megapíxeles con tecnología LightHunter para baja luz',
      'Potente zoom óptico motorizado de 33x (4.5 mm ~ 148.5 mm) con enfoque automático rápido',
      'Iluminación infrarroja inteligente adaptativa de hasta 150 metros de alcance',
      'Analítica inteligente Deep Learning con prevención de intrusión y autoseguimiento PTZ',
      'Rotación horizontal continua de 360° y vertical de -15° a 90° con presets de 300°/s',
      'Gabinete metálico con clasificación climática IP66, protección antivandálica IK10 y PoE+'
    ]
  }
];

const lote30Items = [
  ...mitsubishiPcaM36Items,
  ...panasonicKxhdv800Items,
  ...paradoxNvx80Items,
  ...siemensSentron3va11Items,
  ...teslaSolarInverterItems,
  ...univiewPtz33xItems
];

function updateBackupData() {
  const backupPath = path.join(projectRoot, 'js', 'backup_data.js');
  const code = fs.readFileSync(backupPath, 'utf8');

  let mockDatabase;
  global.window = {};
  eval(code.replace('const mockDatabase =', 'mockDatabase ='));
  console.log(`[backup_data] Registros iniciales: ${mockDatabase.length}`);

  let addedCount = 0;
  for (const item of lote30Items) {
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
  console.log(`[Firestore] Sincronizando ${lote30Items.length} productos de Lote 30 en la colección 'products'...`);
  const batch = db.batch();

  for (const prod of lote30Items) {
    const docRef = db.collection('products').doc(prod.id);
    batch.set(docRef, {
      ...prod,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  }

  await batch.commit();
  console.log('[Firestore] Todos los productos de Lote 30 fueron sincronizados exitosamente en Firestore.');
}

async function main() {
  updateBackupData();
  await updateFirestore();
}

main().catch(err => {
  console.error('Error fatal durante sincronización:', err);
  process.exit(1);
});
