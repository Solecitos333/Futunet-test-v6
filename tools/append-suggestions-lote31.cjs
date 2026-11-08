const fs = require('fs');
const path = require('path');

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
      "refCode": "SUG-C9200",
      "title": "Disponibilidad de Switches Administrables Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Enlaces 10G SFP+",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Switch administrable corporativo Layer 3 Cisco Catalyst 9200L-24P-4X-E con 24 puertos Gigabit Ethernet PoE+ (presupuesto total de 370W), 4 enlaces ascendentes fijos de 10 Gbps SFP+, enrutamiento estático, RIP, OSPF y EIGRP Stub, ventiladores y fuentes redundantes de alta resiliencia.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-cisco.html el Switch Administrable Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Uplinks 10G SFP+ (C9200L-24P-4X-E), enrutamiento dinámico avanzado y garantía oficial Cisco Enhanced Limited Lifetime (E-LLW) en Santiago."
    },
    {
      "refCode": "SUG-U6ENT",
      "title": "Disponibilidad de Puntos de Acceso Wi-Fi 6E Tri-Banda de Ultra Alta Densidad Ubiquiti UniFi U6 Enterprise con Puerto 2.5 GbE PoE+",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Punto de acceso empresarial de ultra alta densidad Ubiquiti UniFi U6 Enterprise (U6-Enterprise) con tecnología tri-banda Wi-Fi 6E (bandas de 2.4 GHz, 5 GHz y 6 GHz sin interferencias), throughput agregado de 10.2 Gbps, puerto de subida RJ45 de 2.5 Gbps PoE+ y soporte para más de 600 clientes concurrentes.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-ubiquiti.html el Punto de Acceso Wi-Fi 6E Tri-Banda Ubiquiti UniFi U6 Enterprise con espectro limpio de 6 GHz, tasa agregada de 10.2 Gbps, puerto 2.5 GbE PoE+ y garantía oficial Ubiquiti Networks en Santiago."
    },
    {
      "refCode": "SUG-M2004",
      "title": "Disponibilidad de Cloud Core Routers MikroTik CCR2004-16G-2S+PC con 16 Puertos Gigabit y 2 Bahías 10G SFP+ Silenciosos",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Router de borde y agregación de alta densidad MikroTik CCR2004-16G-2S+PC con procesador Annapurna Labs AL32400 Quad-Core a 1.7 GHz, 16 puertos Gigabit Ethernet, 2 bahías de fibra 10G SFP+, chasis disipador de aluminio con refrigeración pasiva de 0 dB (completamente silencioso) y licencia RouterOS Nivel 6.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-mikrotik.html el Cloud Core Router MikroTik CCR2004-16G-2S+PC con 16 puertos Gigabit, 2 enlaces 10G SFP+, arquitectura silenciosa de 0 dB por refrigeración pasiva y garantía oficial MikroTik en Santiago."
    },
    {
      "refCode": "SUG-T6700",
      "title": "Disponibilidad de Puntos de Acceso Wi-Fi 6 AX5400 de Techo TP-Link Omada EAP670 con Puerto 2.5 GbE PoE+ y Canal de 160 MHz",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Punto de acceso Wi-Fi 6 de montaje en techo o pared TP-Link Omada EAP670 con velocidades simultáneas de hasta 4804 Mbps en 5 GHz y 574 Mbps en 2.4 GHz (AX5400), canal extendido HE160 de 160 MHz, puerto 2.5 Gbps PoE+, roaming continuo 802.11k/v y gestión cloud SDN centralizada.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-tp-link.html el Punto de Acceso Wi-Fi 6 TP-Link Omada EAP670 AX5400 con ancho de banda de 160 MHz, puerto de alta velocidad 2.5 GbE PoE+, integración a Omada Cloud SDN y garantía oficial TP-Link en República Dominicana."
    },
    {
      "refCode": "SUG-E5300",
      "title": "Disponibilidad de Proyectores Láser Corporativos Full HD WUXGA Epson PowerLite L530U de 5,200 Lúmenes con Fuente Láser de 20,000 Horas",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Proyector láser empresarial de alta luminosidad Epson PowerLite L530U con tecnología 3LCD de 3 chips, 5,200 lúmenes de brillo en color y blanco, resolución nativa WUXGA Full HD (1920x1200 en formato 16:10), fuente de luz láser de estado sólido con 20,000 horas de vida útil libre de mantenimiento, zoom óptico 1.6x y proyección de hasta 500 pulgadas.",
      "officialResponse": "Aprobado e integrado al catálogo de Equipos de Oficina y a marca-epson.html el Proyector Láser Corporativo Epson PowerLite L530U de 5,200 Lúmenes WUXGA con fuente de luz láser de 20,000 horas, tecnología 3LCD de colores vivos y 3 años de garantía oficial Epson en Santiago."
    },
    {
      "refCode": "SUG-A6000",
      "title": "Disponibilidad de UPS Online Doble Conversión en Rack APC by Schneider Electric Easy UPS SRV 6kVA / 6000VA 208/240V con Tarjeta SNMP",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Sistema de alimentación ininterrumpida de grado crítico para telecomunicaciones y servidores APC by Schneider Electric Easy UPS SRV 6000VA / 6000W 208/240V Online de doble conversión con cero tiempo de transferencia (0 ms), factor de potencia unitario (1.0), formato rack 4U con rieles incluidos, bypass automático y tarjeta de gestión de red SNMP/Web incorporada.",
      "officialResponse": "Aprobado e integrado al catálogo de Energía y Climatización y a marca-schneiderelectric.html el UPS Online Doble Conversión en Rack APC Easy UPS SRV 6kVA / 6kW (SRV6KRILRK) con factor de potencia 1.0, 0 ms de transferencia, tarjeta de monitoreo de red SNMP y garantía oficial Schneider Electric en Santiago."
    }
  ];`;

sugContent = sugContent.replace(sugRegex, (match, p1, p2) => {
  const base = p1.replace(/\s*\];\s*$/, '');
  return `${base}${newSugItems}${p2}`;
});

fs.writeFileSync(sugPath, sugContent, 'utf8');
console.log('[OK] js/suggestions.js actualizado con las 6 sugerencias de Lote 31.');

// 2. Actualizar tools/seed-suggestions.cjs
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Disambiguate line 1759 if not already disambiguated
seedContent = seedContent.replace(
  /refCode:\s*'SUG-M3600',\s*\r?\n\s*title:\s*'Disponibilidad de Aires Acondicionados Comerciales Tipo Cassette/g,
  "refCode: 'SUG-M360C',\n    title: 'Disponibilidad de Aires Acondicionados Comerciales Tipo Cassette"
);

const seedRegex = /(\n\s*\}\s*\n\s*\];)(\r?\n\s*async function seed)/;

if (!seedRegex.test(seedContent)) {
  console.error('Target regex not found in tools/seed-suggestions.cjs');
  process.exit(1);
}

const newSeedItems = `,
  {
    refCode: 'SUG-C9200',
    title: 'Disponibilidad de Switches Administrables Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Enlaces 10G SFP+',
    description: 'Para adecuaciones de cableado estructurado Cat 6A y enlaces troncales de fibra óptica en centros hospitalarios, torres corporativas y parques industriales en Santiago (PIVEM, Tamboril) que necesitan reemplazar switches antiguos por equipos Cisco Catalyst de última generación con capacidad Layer 3, alimentación PoE+ de 370W para telefonía IP y cámaras de alta potencia, y 4 puertos fijos de 10 Gbps SFP+, solicitamos la disponibilidad del Cisco Catalyst C9200L-24P-4X-E.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Ramón Emilio Peralta (Redes & Telecomunicaciones Corporativas Cibao / PIVEM)',
    authorEmail: 'rperalta@cibaoredes.com',
    authorPhone: '809-582-9200',
    rating: 5,
    benefit: 'Conectividad troncal empresarial sin cuellos de botella con 4 uplinks de 10 Gbps de fibra, seguridad de red Trustworthy Solutions de Cisco, ventiladores redundantes y enrutamiento Layer 3 dinámico.',
    adminNotes: 'Sincronizado redes_cisco_catalyst_9200l_24p_4x_poe en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para c9200, c9200l, catalyst 9200, switch cisco layer 3, c9200l-24p, cisco 24p poe 10g. Habilitado en marca Cisco y Redes/Telecomunicaciones.',
    officialResponse: '¡Hola Ing. Ramón! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Redes y a marca-cisco.html el Switch Administrable Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Uplinks 10G SFP+ (C9200L-24P-4X-E), enrutamiento dinámico avanzado y garantía oficial Cisco Enhanced Limited Lifetime (E-LLW) en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-cisco.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-U6ENT',
    title: 'Disponibilidad de Puntos de Acceso Wi-Fi 6E Tri-Banda de Ultra Alta Densidad Ubiquiti UniFi U6 Enterprise con Puerto 2.5 GbE PoE+',
    description: 'Para auditorios, clínicas médicas, salones de conferencias universitarios y naves de producción en Santiago con alta densidad de dispositivos móviles y laptops con tarjetas Wi-Fi 6E, solicitamos la disponibilidad del punto de acceso insignia Ubiquiti UniFi U6 Enterprise (U6-Enterprise), que opera simultáneamente en las tres bandas de frecuencia (2.4, 5 y 6 GHz) con puerto de subida de 2.5 Gbps para aprovechar el ancho de banda simétrico de los enlaces dedicados de fibra de Futunet.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Lisandro Taveras (Infraestructura de Datos & Redes Médicas Santiago)',
    authorEmail: 'ltaveras@redesmedicas.do',
    authorPhone: '809-583-6600',
    rating: 5,
    benefit: 'Espectro limpio libre de congestión en 6 GHz, velocidad agregada de 10.2 Gbps y conexión fluida para más de 600 clientes concurrentes administrado centralmente mediante UniFi Network.',
    adminNotes: 'Sincronizado redes_ubiquiti_unifi_u6_enterprise_ap en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para u6-enterprise, u6ent, unifi enterprise, ap wifi 6e ubiquiti, unifi u6 enterprise. Habilitado en marca Ubiquiti y Redes/Telecomunicaciones.',
    officialResponse: '¡Hola Ing. Lisandro! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Redes y a marca-ubiquiti.html el Punto de Acceso Wi-Fi 6E Tri-Banda Ubiquiti UniFi U6 Enterprise con espectro limpio de 6 GHz, tasa agregada de 10.2 Gbps, puerto 2.5 GbE PoE+ y garantía oficial Ubiquiti Networks en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-ubiquiti.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-M2004',
    title: 'Disponibilidad de Cloud Core Routers MikroTik CCR2004-16G-2S+PC con 16 Puertos Gigabit y 2 Bahías 10G SFP+ Silenciosos',
    description: 'Para salas de servidores en oficinas ejecutivas, bufetes corporativos y centros de datos en Santiago que requieren un enrutador de núcleo con capacidad de procesamiento masivo BGP, OSPF y túneles VPN WireGuard/IPsec pero sin la contaminación acústica de ventiladores ruidosos, solicitamos el Cloud Core Router MikroTik CCR2004-16G-2S+PC con enfriamiento pasivo de 0 dB, 16 puertos GbE y 2 bahías 10G SFP+.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Winston Almonte (Ingeniería de Enlaces Dedicados & WISP Santiago)',
    authorEmail: 'walmonte@enlacescibao.net',
    authorPhone: '809-581-2004',
    rating: 5,
    benefit: 'Rendimiento de enrutamiento mononúcleo líder en su clase gracias a su CPU Quad-Core Annapurna AL32400 a 1.7 GHz con chasis disipador pasivo 100% silencioso para instalaciones críticas.',
    adminNotes: 'Sincronizado redes_mikrotik_ccr2004_16g_2s_cloud_core_router en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para ccr2004, ccr2004-16g, mikrotik ccr2004, router ccr mikrotik, ccr pasivo. Habilitado en marca MikroTik y Redes/Telecomunicaciones.',
    officialResponse: '¡Hola Ing. Winston! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Redes y a marca-mikrotik.html el Cloud Core Router MikroTik CCR2004-16G-2S+PC con 16 puertos Gigabit, 2 enlaces 10G SFP+, arquitectura silenciosa de 0 dB por refrigeración pasiva y garantía oficial MikroTik en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-mikrotik.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-T6700',
    title: 'Disponibilidad de Puntos de Acceso Wi-Fi 6 AX5400 de Techo TP-Link Omada EAP670 con Puerto 2.5 GbE PoE+ y Canal de 160 MHz',
    description: 'Para hoteles, restaurantes, salones de eventos y centros corporativos en Santiago gestionados bajo el ecosistema Omada SDN que precisan la mayor velocidad inalámbrica posible para cientos de clientes simultáneos con canal ultra ancho HE160 de 160 MHz y puerto de red de 2.5 Gbps que supera el límite Gigabit estándar, solicitamos el punto de acceso TP-Link Omada EAP670 AX5400.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Lic. Carlos Manuel Fernández (Gestión de Redes & Conectividad Hotelera Santiago)',
    authorEmail: 'cfernandez@conectividadcibao.com',
    authorPhone: '809-583-6700',
    rating: 5,
    benefit: 'Velocidades inalámbricas combinadas de 5.4 Gbps, roaming fluido sin cortes entre pisos y salas, y administración remota en la nube 100% centralizada mediante controladores Omada OC200/Software.',
    adminNotes: 'Sincronizado redes_tplink_omada_eap670_wifi6_ap en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para eap670, omada eap670, tplink eap670, ap wifi 6 tplink, ap ax5400. Habilitado en marca TP-Link y Redes/Telecomunicaciones.',
    officialResponse: '¡Hola Lic. Carlos! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Redes y a marca-tp-link.html el Punto de Acceso Wi-Fi 6 TP-Link Omada EAP670 AX5400 con ancho de banda de 160 MHz, puerto de alta velocidad 2.5 GbE PoE+, integración a Omada Cloud SDN y garantía oficial TP-Link en República Dominicana.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-tp-link.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-E5300',
    title: 'Disponibilidad de Proyectores Láser Corporativos Full HD WUXGA Epson PowerLite L530U de 5,200 Lúmenes con Fuente Láser de 20,000 Horas',
    description: 'Para salones de reuniones ejecutivas, auditorios corporativos, salas de capacitación técnica y aulas universitarias en Santiago con luz ambiental intensa que requieren proyecciones nítidas de gran tamaño sin el costo recurrente de reemplazo de lámparas de mercurio ni tiempos de calentamiento, solicitamos el proyector láser Epson PowerLite L530U de 5,200 lúmenes WUXGA.',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Arq. Patricia Del Monte (Salas de Conferencias & Proyectos Audiovisuales Santiago)',
    authorEmail: 'pdelmonte@audiovisualescibao.com',
    authorPhone: '809-582-5300',
    rating: 5,
    benefit: 'Proyección láser brillante y nítida de 5,200 lúmenes en blanco y color, fuente de iluminación libre de mantenimiento de 20,000 horas, tamaño de pantalla de hasta 500 pulgadas y conectividad inalámbrica y HDBaseT.',
    adminNotes: 'Sincronizado oficina_epson_powerlite_l530u_proyector_laser en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para l530u, epson l530u, proyector epson laser, powerlite l530u, proyector laser 5200 lúmenes. Habilitado en marca Epson y Equipos de Oficina.',
    officialResponse: '¡Hola Arq. Patricia! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Equipos de Oficina y a marca-epson.html el Proyector Láser Corporativo Epson PowerLite L530U de 5,200 Lúmenes WUXGA con fuente de luz láser de 20,000 horas, tecnología 3LCD de colores vivos y 3 años de garantía oficial Epson en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-epson.html',
    createdAt: FieldValue.serverTimestamp(),
    respondedAt: FieldValue.serverTimestamp(),
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  {
    refCode: 'SUG-A6000',
    title: 'Disponibilidad de UPS Online Doble Conversión en Rack APC by Schneider Electric Easy UPS SRV 6kVA / 6000VA 208/240V con Tarjeta SNMP',
    description: 'Para naves de manufactura en zonas francas, subestaciones eléctricas y salas de servidores centrales en Santiago que necesitan proteger cargas críticas trifásicas o bifásicas de 208/240V con potencia nominal de 6 kVA / 6 kW mediante tecnología Online de doble conversión con cero milisegundos de tiempo de transferencia y monitoreo remoto continuo vía tarjeta de red SNMP, solicitamos el sistema para rack APC Easy UPS SRV 6kVA (SRV6KRILRK).',
    category: 'catalog_products',
    targetAudience: 'client',
    status: 'implemented',
    isAnonymous: false,
    authorName: 'Ing. Fernando Méndez (Continuidad Operativa & Energía Crítica Zona Franca)',
    authorEmail: 'fmendez@energiacritica.do',
    authorPhone: '809-581-6000',
    rating: 5,
    benefit: 'Factor de potencia unitario 1.0 (6,000W reales), cero tiempo de transferencia a batería ante apagones o variaciones de voltaje, tarjeta de red SNMP incluida para gestión web y formato rack 4U de alta densidad.',
    adminNotes: 'Sincronizado energia_apc_schneider_easy_ups_srv_6000va_rack_online en catálogo, backup_data.js y Firestore products. Incorporadas variantes stem en catalog.js para srv6k, srv6krilrk, apc 6kva, ups 6kva online, ups rack apc 6000va. Habilitado en marca Schneider Electric y Energía/Climatización.',
    officialResponse: '¡Hola Ing. Fernando! Nos complace informarte que tu solicitud fue aprobada e implementada en su totalidad. Incorporamos al catálogo de Energía y Climatización y a marca-schneiderelectric.html el UPS Online Doble Conversión en Rack APC Easy UPS SRV 6kVA / 6kW (SRV6KRILRK) con factor de potencia 1.0, 0 ms de transferencia, tarjeta de monitoreo de red SNMP y garantía oficial Schneider Electric en Santiago.',
    respondedBy: 'Equipo Futunet',
    reviewedBy: 'Admin Futunet',
    source: 'web_public',
    pageUrl: 'https://futunet.com.do/marca-schneiderelectric.html',
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
console.log('[OK] tools/seed-suggestions.cjs actualizado con las 6 sugerencias de Lote 31 (y SUG-M360C desambiguado).');
