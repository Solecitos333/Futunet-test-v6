const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const sugPath = path.resolve(projectRoot, 'js', 'suggestions.js');
const seedPath = path.resolve(projectRoot, 'tools', 'seed-suggestions.cjs');

// 1. Actualizar js/suggestions.js
let sugContent = fs.readFileSync(sugPath, 'utf8');
const sugRegex = /(\n\s*\}\s*\n\s*\];)(\r?\n\r?\n\s*function getFallbackSuggestionByCode)/;

if (!sugRegex.test(sugContent)) {
  console.error('Target regex not found in js/suggestions.js');
  process.exit(1);
}

const newSugItems = `,
    {
      "refCode": "SUG-M3600",
      "title": "Disponibilidad de Aires Acondicionados Comerciales Tipo Piso-Techo Inverter Mitsubishi Electric PCA-M 36,000 BTU de Alta Eficiencia",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Consola comercial tipo Piso-Techo Inverter Mitsubishi Electric PCA-M de 36,000 BTU/h (3 Toneladas) para montaje en cielo raso o sobre piso, ideal para oficinas, bancos y centros de cómputo con flujo de aire horizontal de 12 metros, operación ultra silenciosa desde 37 dB y compresor Inverter de larga duración.",
      "officialResponse": "Aprobado e integrado al catálogo de Energía/Climatización y a marca-mitsubishi.html la Consola Comercial Tipo Piso-Techo Inverter Mitsubishi Electric PCA-M 36,000 BTU con flujo de aire extendido, operación ultrasilenciosa de 37 dB y 5 años de garantía oficial en compresor con soporte técnico en Santiago."
    },
    {
      "refCode": "SUG-P8000",
      "title": "Disponibilidad de Teléfonos SIP para Salas de Conferencia Panasonic KX-HDV800 con Micrófonos 360° y Audio HD Full Duplex",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Teléfono empresarial para conferencias SIP Panasonic KX-HDV800 con arreglo de 3 micrófonos 360° OmniSound con cobertura hasta 30 m², cancelación de eco, puente de conferencia de 5 vías integrado, pantalla LCD y ranura SD para grabación de llamadas.",
      "officialResponse": "Aprobado e integrado al catálogo de Oficina y a marca-panasonic.html el Teléfono de Conferencia SIP Panasonic KX-HDV800 con tecnología OmniSound HD Full Duplex, micrófonos omnidireccionales de 360° (alcance hasta 30 m²), grabación directa en SD y garantía oficial Panasonic en República Dominicana."
    },
    {
      "refCode": "SUG-P8080",
      "title": "Disponibilidad de Detectores de Movimiento Exterior Grado Comercial Paradox NVX80 con 8 Canales de Detección y Tecnología SeeTrue",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Detector perimetral exterior Paradox NVX80 con 8 canales independientes (4x PIR dobles + 2x Microondas + 2x Anti-spray), procesador SeeTrue antimascotas de hasta 20 kg, pantalla OLED a color integrada y gabinete hermético IP55 con protección antienmascaramiento activo.",
      "officialResponse": "Aprobado e integrado al catálogo de Seguridad y a marca-paradox.html el Detector Exterior Grado Comercial Paradox NVX80 con 8 canales de sensado, procesador SeeTrue antimascotas, pantalla OLED a color, antienmascaramiento activo IR y garantía oficial Paradox en Santiago."
    },
    {
      "refCode": "SUG-S3125",
      "title": "Disponibilidad de Interruptores Automáticos de Caja Moldeada Siemens Sentron 3VA11 de 3 Polos 125A 25kA para Protección de Tableros Eléctricos",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Interruptor termomagnético industrial de caja moldeada Siemens Sentron 3VA11 de 3 polos 125A con capacidad de ruptura de 25 kA a 415V, disparador termomagnético fijo TM210 y bornas frontales para protección de tableros eléctricos y transformadores bajo norma IEC 60947-2.",
      "officialResponse": "Aprobado e integrado al catálogo de Energía e Industrial y a marca-siemens.html el Interruptor Automático de Caja Moldeada Siemens Sentron 3VA11 de 3 Polos 125A (25 kA a 415V) con unidad de disparo TM210, certificación IEC 60947-2 y garantía oficial Siemens en Santiago."
    },
    {
      "refCode": "SUG-T7600",
      "title": "Disponibilidad de Inversores Solares Residenciales y Comerciales Tesla Solar Inverter 7.6 kW con 4 Entradas MPPT y Gestión Inteligente por App",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Inversor solar fotovoltaico de conexión a red Tesla Solar Inverter de 7.6 kW con 4 seguidores MPPT independientes, eficiencia del 98%, conectividad Wi-Fi/celular con actualizaciones OTA e integración nativa con sistemas de batería Tesla Powerwall.",
      "officialResponse": "Aprobado e integrado al catálogo de Energía Solar y a marca-tesla.html el Inversor Solar Tesla Solar Inverter 7.6 kW con 4 entradas MPPT independientes, eficiencia del 98%, monitoreo OTA por la Tesla App y 10 años de garantía oficial Tesla Energy con soporte certificado en Santiago."
    },
    {
      "refCode": "SUG-U4330",
      "title": "Disponibilidad de Cámaras PTZ IP Uniview LightHunter 4MP con Zoom Óptico 33x, Infrarrojos de 150m y Analítica Inteligente Deep Learning",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Cámara domo PTZ de exterior Uniview LightHunter 4MP con potente zoom óptico motorizado 33x, iluminación infrarroja adaptativa de 150 metros, analítica Deep Learning con clasificación humana/vehicular, autoseguimiento inteligente (Auto-tracking) y chasis antivandálico IP66/IK10.",
      "officialResponse": "Aprobado e integrado al catálogo de Seguridad y a marca-uniview.html la Cámara PTZ IP Uniview LightHunter 4MP con Zoom Óptico 33x (IPC6854SR-X33-VF), iluminación IR inteligente de 150 metros, analítica Deep Learning con autoseguimiento, chasis antivandálico IP66/IK10 y garantía oficial Uniview en Santiago."
    }
  ];`;

sugContent = sugContent.replace(sugRegex, (match, p1, p2) => {
  const base = p1.replace(/\s*\];\s*$/, '');
  return `${base}${newSugItems}${p2}`;
});

fs.writeFileSync(sugPath, sugContent, 'utf8');
console.log('[OK] js/suggestions.js actualizado con las 6 sugerencias de Lote 30.');

// 2. Actualizar tools/seed-suggestions.cjs
let seedContent = fs.readFileSync(seedPath, 'utf8');
const seedRegex = /(\n\s*\}\s*\n\s*\];)(\r?\n\s*async function seed)/;

if (!seedRegex.test(seedContent)) {
  console.error('Target regex not found in tools/seed-suggestions.cjs');
  process.exit(1);
}

const newSeedItems = `,
  {
    refCode: 'SUG-M3600',
    title: 'Disponibilidad de Aires Acondicionados Comerciales Tipo Piso-Techo Inverter Mitsubishi Electric PCA-M 36,000 BTU de Alta Eficiencia',
    description: 'Para restaurantes, locales comerciales, salas de servidores y oficinas ejecutivas en Santiago y la región norte que no cuentan con falso techo o requieren una distribución de aire de largo alcance con bajo nivel sonoro y tecnología Inverter de ultra bajo consumo eléctrico, solicitamos la disponibilidad de la consola comercial tipo Piso-Techo Mitsubishi Electric PCA-M 36,000 BTU (PCA-M36KA2 / PUZ-A36NHA7).',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Marcos Aurelio Peña (Climatización & Eficiencia Energética Cibao)',
    authorEmail: 'mpena@climatizacioncibao.com',
    authorPhone: '809-582-3600',
    rating: 5,
    benefit: 'Climatización comercial potente y silenciosa con flujo de aire horizontal de hasta 12 metros, flujo de 4 velocidades y compresor Inverter con gas ecológico R-410A de máxima durabilidad.',
    adminNotes: 'Sincronizado energia_mitsubishi_pca_m36_piso_techo_inverter en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para pca-m36, mitsubishi piso techo, aire piso techo mitsubishi, pca m36. Habilitado en marca Mitsubishi Electric y Climatización/Energía.',
    officialResponse: '¡Hola Ing. Marcos! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Energía/Climatización y a marca-mitsubishi.html la Consola Comercial Tipo Piso-Techo Inverter Mitsubishi Electric PCA-M 36,000 BTU con flujo de aire extendido, operación ultrasilenciosa de 37 dB y 5 años de garantía oficial en compresor con soporte técnico en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-mitsubishi.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-P8000',
    title: 'Disponibilidad de Teléfonos SIP para Salas de Conferencia Panasonic KX-HDV800 con Micrófonos 360° y Audio HD Full Duplex',
    description: 'Para salas de juntas directivas, centros de comando y salas de reuniones corporativas en empresas de telecomunicaciones y zonas francas de Santiago que necesitan realizar audioconferencias nítidas con cobertura de 360 grados, cancelación activa de eco y conectividad SIP nativa sin requerir sistemas complejos de microfonía externa, solicitamos el teléfono de conferencia Panasonic KX-HDV800.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Lic. Roberto Gómez Peña (Comunicaciones Unificadas & Call Centers Santiago)',
    authorEmail: 'rgomez@unificadasrd.com',
    authorPhone: '809-583-8000',
    rating: 5,
    benefit: 'Reuniones ejecutivas con captura de voz Omnisound de 360°, grabación de reuniones en tarjetas SD, puente de conferencia de hasta 5 vías integrado y compatibilidad SIP con plantas Panasonic KX-NS500 y Asterisk.',
    adminNotes: 'Sincronizado oficina_panasonic_kx_hdv800_conferencia_sip en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para kx-hdv800, hdv800, panasonic conferencia, telefono conferencia panasonic, kxhdv800. Habilitado en marca Panasonic y Equipos de Oficina.',
    officialResponse: '¡Hola Lic. Roberto! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Oficina y a marca-panasonic.html el Teléfono de Conferencia SIP Panasonic KX-HDV800 con tecnología OmniSound HD Full Duplex, micrófonos omnidireccionales de 360° (alcance hasta 30 m²), grabación directa en SD y garantía oficial Panasonic en República Dominicana.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-panasonic.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-P8080',
    title: 'Disponibilidad de Detectores de Movimiento Exterior Grado Comercial Paradox NVX80 con 8 Canales de Detección y Tecnología SeeTrue',
    description: 'Para proyectos de seguridad perimetral exterior en plantas industriales, almacenes fiscales, torres residenciales y subestaciones eléctricas en Santiago que sufren de falsas alarmas por viento, vegetación o animales, solicitamos la incorporación del detector exterior de movimiento Paradox NVX80 con 8 canales independientes (4 sensores infrarrojos pasivos + 2 microondas + 2 antienmascaramiento activo) y tecnología SeeTrue.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Nelson Batista Valdez (Seguridad Electrónica Perimetral & Blindaje Cibao)',
    authorEmail: 'nbatista@seguridadcibao.com.do',
    authorPhone: '809-581-8080',
    rating: 5,
    benefit: 'Detección perimetral infalible con discriminación de mascotas, pantalla OLED a color integrada para calibración rápida y máxima resistencia climática IP55 con inmunidad a sabotajes físicos o con sprays.',
    adminNotes: 'Sincronizado seguridad_paradox_nvx80_detector_exterior en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para nvx80, paradox nvx80, detector exterior paradox, sensor nvx80, seetrue paradox. Habilitado en marca Paradox y Sistemas de Seguridad.',
    officialResponse: '¡Hola Ing. Nelson! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Seguridad y a marca-paradox.html el Detector Exterior Grado Comercial Paradox NVX80 con 8 canales de sensado, procesador SeeTrue antimascotas, pantalla OLED a color, antienmascaramiento activo IR y garantía oficial Paradox en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-paradox.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-S3125',
    title: 'Disponibilidad de Interruptores Automáticos de Caja Moldeada Siemens Sentron 3VA11 de 3 Polos 125A 25kA para Protección de Tableros Eléctricos',
    description: 'Para centros de control de motores, tableros de distribución comercial, centros de datos y plantas procesadoras en el Cibao que precisan una protección magnetotérmica confiable y compacta para líneas trifásicas con corriente nominal de 125A y capacidad de corte de 25 kA a 415V con unidad de disparo termomagnética fija TM210, solicitamos el interruptor de caja moldeada Siemens Sentron 3VA1112-4ED32-0AA0.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Domingo Antonio Tavares (Automatización & Cuadros de Distribución Industrial Santiago)',
    authorEmail: 'dtavares@tavaresindustrial.com',
    authorPhone: '809-582-3125',
    rating: 5,
    benefit: 'Protección magnetotérmica robusta de grado industrial con tamaño extremadamente compacto, terminales de conexión frontal para barras y cables, y certificación internacional IEC 60947-2 para tableros críticos.',
    adminNotes: 'Sincronizado energia_siemens_sentron_3va11_breaker_125a en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para 3va11, sentron 3va1, breaker siemens 125a, interruptor caja moldeada siemens, 3va1112. Habilitado en marca Siemens y Energía/Industrial.',
    officialResponse: '¡Hola Ing. Domingo! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Energía e Industrial y a marca-siemens.html el Interruptor Automático de Caja Moldeada Siemens Sentron 3VA11 de 3 Polos 125A (25 kA a 415V) con unidad de disparo TM210, certificación IEC 60947-2 y garantía oficial Siemens en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-siemens.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-T7600',
    title: 'Disponibilidad de Inversores Solares Residenciales y Comerciales Tesla Solar Inverter 7.6 kW con 4 Entradas MPPT y Gestión Inteligente por App',
    description: 'Para instalaciones fotovoltaicas residenciales de alto consumo y techos comerciales en Santiago que buscan integrar paneles solares de alta potencia con la plataforma de energía de Tesla, optimizando la generación con 4 seguidores MPPT independientes y conmutación transparente con sistemas Powerwall sin requerir microinversores costosos, solicitamos la disponibilidad del Tesla Solar Inverter de 7.6 kW.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Juan Carlos Balcácer (Energía Renovable & Sistemas Fotovoltaicos del Cibao)',
    authorEmail: 'jbalcacer@renovablescibao.com',
    authorPhone: '809-583-7600',
    rating: 5,
    benefit: 'Eficiencia máxima de conversión del 98%, 4 canales MPPT independientes para techos con múltiples orientaciones, monitoreo en tiempo real por la app móvil de Tesla y sincronización directa con baterías Powerwall.',
    adminNotes: 'Sincronizado energia_tesla_solar_inverter_76kw en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para tesla solar inverter, inversor tesla, tesla 7.6kw, tesla mppt, tesla inverter. Habilitado en marca Tesla y Energía Solar.',
    officialResponse: '¡Hola Ing. Juan Carlos! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Energía Solar y a marca-tesla.html el Inversor Solar Tesla Solar Inverter 7.6 kW con 4 entradas MPPT independientes, eficiencia del 98%, monitoreo OTA por la Tesla App y 10 años de garantía oficial Tesla Energy con soporte certificado en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-tesla.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-U4330',
    title: 'Disponibilidad de Cámaras PTZ IP Uniview LightHunter 4MP con Zoom Óptico 33x, Infrarrojos de 150m y Analítica Inteligente Deep Learning',
    description: 'Para proyectos de seguridad ciudadana, monitoreo de avenidas, condominios cerrados, perímetros industriales y naves logísticas en Santiago y la región del Cibao que demandan patrullaje óptico de largo alcance con zoom óptico de 33 aumentos, visión nocturna LightHunter de ultra baja iluminación hasta 150 metros y seguimiento automático inteligente de humanos y vehículos por Deep Learning, solicitamos la cámara domo PTZ Uniview IPC6854SR-X33-VF.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Lic. Alberto Morales Bisonó (Vigilancia Urbana & Seguridad Perimetral Santiago)',
    authorEmail: 'amorales@vigilanciacibao.do',
    authorPhone: '809-581-4330',
    rating: 5,
    benefit: 'Zoom óptico de largo alcance 33x con estabilización de imagen, autoseguimiento automático inteligente de objetivos, rotación 360° continua sin límites y protección intemperie extrema IP66 e impacto IK10.',
    adminNotes: 'Sincronizado seguridad_uniview_ptz_4mp_33x_lighthunter en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para ipc6854, uniview ptz, camara ptz uniview, ptz 33x uniview, lighthunter ptz. Habilitado en marca Uniview y Sistemas de Seguridad.',
    officialResponse: '¡Hola Lic. Alberto! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Seguridad y a marca-uniview.html la Cámara PTZ IP Uniview LightHunter 4MP con Zoom Óptico 33x (IPC6854SR-X33-VF), iluminación IR inteligente de 150 metros, analítica Deep Learning con autoseguimiento, chasis antivandálico IP66/IK10 y garantía oficial Uniview en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-uniview.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }
];`;

seedContent = seedContent.replace(seedRegex, (match, p1, p2) => {
  const base = p1.replace(/\s*\];\s*$/, '');
  return `${base}${newSeedItems}${p2}`;
});

fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log('[OK] tools/seed-suggestions.cjs actualizado con las 6 sugerencias de Lote 30.');

// 3. Ejecutar seed-suggestions.cjs para poblar Firestore
console.log('Sembrando y sincronizando sugerencias en Firestore...');
execSync('node tools/seed-suggestions.cjs', { cwd: projectRoot, stdio: 'inherit' });
console.log('[OK] Sugerencias sembradas exitosamente en Firestore.');
