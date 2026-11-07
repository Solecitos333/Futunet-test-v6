const fs = require('fs');
const path = require('path');

const sugPath = path.resolve(__dirname, '../js/suggestions.js');
let sugContent = fs.readFileSync(sugPath, 'utf8');

const regex = /(\n\s*\}\s*\n\s*\];)(\r?\n\r?\n\s*function getFallbackSuggestionByCode)/;
if (!regex.test(sugContent)) {
  console.error('Target not found in js/suggestions.js');
  process.exit(1);
}

const newSugItems = `,
    {
      "refCode": "SUG-H4090",
      "title": "Disponibilidad de Computadoras Corporativas de Escritorio HP Pro SFF 400 G9 (Intel Core i7-13700, 16GB RAM, 512GB SSD NVMe)",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Computadora de escritorio empresarial Small Form Factor HP Pro SFF 400 G9 equipada con procesador Intel Core i7-13700 de 13ª generación (16 núcleos hasta 5.2 GHz), 16 GB de RAM DDR4, SSD M.2 NVMe de 512 GB, gráficos Intel UHD 770 y suite de seguridad por hardware HP Wolf Pro Security con TPM 2.0.",
      "officialResponse": "Aprobado e integrado al catálogo de Oficina y a marca-hp.html la Computadora Corporativa HP Pro SFF 400 G9 (Core i7-13700, 16GB RAM, 512GB NVMe, HP Wolf Security) con 3 años de garantía oficial HP On-Site en República Dominicana."
    },
    {
      "refCode": "SUG-J4300",
      "title": "Disponibilidad de Puntos de Acceso Empresariales Wi-Fi 6 Juniper Mist AP43 con Inteligencia Artificial Mist AI y vBLE",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Punto de acceso Wi-Fi 6 (802.11ax) de grado corporativo Juniper Mist AP43 con tecnología 4x4 MU-MIMO en doble banda, radio dedicada de seguridad WIDS/WIPS, antena vBLE de 16 elementos integrada y gestión en la nube con IA de Mist AI y asistente virtual Marvis.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-juniper.html el Punto de Acceso Wi-Fi 6 Juniper Mist AP43 con motor de Inteligencia Artificial Mist AI, radio de escaneo continuo y antena direccional vBLE de 16 elementos con garantía oficial Juniper Networks en Santiago."
    },
    {
      "refCode": "SUG-L8800",
      "title": "Disponibilidad de Monitores Profesionales Ergonómicos 4K UHD LG UltraFine 32UN880-B Ergo 31.5\" IPS con USB-C 60W",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Monitor profesional 4K UHD de 31.5 pulgadas LG UltraFine 32UN880-B con panel IPS (3840 x 2160), 95% DCI-P3, HDR10, brazo articulado ergonómico LG Ergo Stand con C-Clamp y puerto USB-C con soporte de video y carga Power Delivery de 60W.",
      "officialResponse": "Aprobado e integrado al catálogo de Oficina y a marca-lg.html el Monitor Profesional 4K UHD LG UltraFine 32UN880-B Ergo 31.5\" IPS con brazo articulado C-Clamp, cobertura 95% DCI-P3, USB-C 60W y garantía oficial LG en Santiago."
    },
    {
      "refCode": "SUG-L3520",
      "title": "Disponibilidad de Switches Smart Administrables PoE+ Linksys LGS352MPC de 48 Puertos Gigabit con 4 Enlaces 10G SFP+ (740W)",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Switch de distribución Layer 2+ Linksys LGS352MPC con 48 puertos Gigabit PoE+ (presupuesto de potencia de 740W), 4 enlaces troncales de 10 Gbps SFP+ de fibra óptica, capacidad de 176 Gbps y seguridad 802.1X/ACL para racks corporativos.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-linksys.html el Switch Smart Administrable Linksys LGS352MPC con 48 puertos Gigabit PoE+ (740W) y 4 enlaces 10G SFP+ de fibra con 5 años de garantía oficial Linksys en Santiago."
    },
    {
      "refCode": "SUG-N4250",
      "title": "Disponibilidad de Switches Administrables AV Line Netgear Pro AV M4250-10G2F-PoE+ para Audio/Video sobre IP y Redes Dante",
      "category": "catalog_products",
      "status": "implemented",
      "description": "Switch administrable de la línea Netgear AV Line M4250-10G2F-PoE+ optimizado de fábrica para audio y video sobre IP (AV over IP), Dante, NDI y AES67 con 8 puertos Gigabit PoE+ (125W), 2 puertos Gigabit de cobre, 2 bahías SFP 1G y chasis reversible ultrasilencioso.",
      "officialResponse": "Aprobado e integrado al catálogo de Redes y a marca-netgear.html el Switch Administrable AV Line Netgear Pro AV M4250-10G2F-PoE+ con perfiles automatizados para Dante y NDI, 8 puertos PoE+ (125W) y garantía de por vida Netgear ProSAFE en Santiago."
    }
  ];`;

sugContent = sugContent.replace(regex, `$1${newSugItems}$2`.replace('\n  ];\n  ];', '\n  ];'));
// Wait, regex group 1 is `\n    }\n  ];`
// So replace should be:
sugContent = fs.readFileSync(sugPath, 'utf8');
sugContent = sugContent.replace(regex, (match, p1, p2) => {
  // p1 is "\n    }\n  ];"
  // remove the "  ];" from p1 and add newSugItems + "\n  ];"
  const base = p1.replace(/\s*\];\s*$/, '');
  return `${base}${newSugItems}${p2}`;
});

fs.writeFileSync(sugPath, sugContent, 'utf8');
console.log('[OK] js/suggestions.js actualizado con las 5 sugerencias de Lote 29.');
