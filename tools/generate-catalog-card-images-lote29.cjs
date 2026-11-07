const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'hp-pro-sff-400-g9-desktop.webp',
    brand: 'HP',
    brandBadge: 'HP PRO SFF ENTERPRISE COMPUTING',
    badgeColor: '#0284c7',
    model: 'HP Pro SFF 400 G9',
    subtitle: 'Computadora Corporativa SFF • Core i7-13700, 16GB RAM, 512GB SSD NVMe',
    specs: [
      'Intel Core i7-13700 13ª Gen (16 Núcleos, hasta 5.2 GHz)',
      '16 GB RAM DDR4-3200 (Hasta 64 GB) y SSD NVMe 512 GB',
      'Protección de Hardware HP Wolf Pro Security y TPM 2.0',
      'Salidas DisplayPort 1.4a, HDMI 1.4b y Ethernet Gigabit'
    ],
    priceTag: 'RD$ 52,900.00',
    warranty: 'Garantía Oficial HP 3 Años On-Site en República Dominicana',
    accentColor: '#38bdf8',
    iconType: 'hp_desktop'
  },
  {
    fileName: 'juniper-ap43-access-point-wifi6-mist.webp',
    brand: 'Juniper',
    brandBadge: 'JUNIPER MIST AI WI-FI 6',
    badgeColor: '#059669',
    model: 'Juniper Mist AP43',
    subtitle: 'Punto de Acceso Empresarial Wi-Fi 6 • 4x4 MU-MIMO con IA Mist y vBLE',
    specs: [
      'Wi-Fi 6 (802.11ax) 4x4:4 de Alta Densidad en 5 GHz y 2.4 GHz',
      'Motor de Inteligencia Artificial Mist AI y Asistente Marvis VNA',
      'Arreglo Direccional vBLE de 16 Elementos para Geolocalización',
      'Radio Dedicada WIDS/WIPS 24/7 y Puerto Uplink 2.5G PoE+'
    ],
    priceTag: 'RD$ 46,500.00',
    warranty: 'Garantía Oficial Juniper Networks con Soporte en Santiago',
    accentColor: '#10b981',
    iconType: 'juniper_ap'
  },
  {
    fileName: 'lg-32un880-ergo-4k-monitor.webp',
    brand: 'LG',
    brandBadge: 'LG ULTRAFINE ERGO 4K UHD',
    badgeColor: '#dc2626',
    model: 'LG UltraFine 32UN880-B Ergo',
    subtitle: 'Monitor Profesional Ergonómico 31.5" IPS 4K UHD • USB-C 60W y Brazo C-Clamp',
    specs: [
      'Panel IPS 31.5" 4K UHD (3840x2160) HDR10 y DCI-P3 95%',
      'Soporte Articulado LG Ergo con C-Clamp (Giro ±280°, Pivote, Altura)',
      'Conexión USB-C con Transmisión de Video y Carga 60W Power Delivery',
      'Doble HDMI 2.0, DisplayPort 1.4 y Altavoces Waves MaxxAudio'
    ],
    priceTag: 'RD$ 38,900.00',
    warranty: 'Garantía Oficial LG Dominicana con Calibración de Fábrica',
    accentColor: '#ef4444',
    iconType: 'lg_monitor'
  },
  {
    fileName: 'linksys-lgs352mpc-smart-poe-switch.webp',
    brand: 'Linksys',
    brandBadge: 'LINKSYS ENTERPRISE POE+ 740W',
    badgeColor: '#2563eb',
    model: 'Linksys LGS352MPC',
    subtitle: 'Switch Smart Managed 48 Puertos Gigabit PoE+ (740W) + 4x 10G SFP+',
    specs: [
      '48 Puertos Gigabit PoE+ (802.3at/af) con Presupuesto Masivo 740W',
      '4 Enlaces Dedicados 10G SFP+ para Conexión Troncal de Fibra',
      'Capacidad de Conmutación de 176 Gbps sin Bloqueo de Paquetes',
      'Gestión Layer 2+, Enrutamiento Estático, VLANs y Seguridad 802.1X'
    ],
    priceTag: 'RD$ 41,500.00',
    warranty: 'Garantía Oficial Linksys de 5 Años con Soporte en RD',
    accentColor: '#60a5fa',
    iconType: 'linksys_switch'
  },
  {
    fileName: 'netgear-m4250-10g2f-poe-switch.webp',
    brand: 'Netgear',
    brandBadge: 'NETGEAR PRO AV LINE M4250',
    badgeColor: '#d97706',
    model: 'Netgear AV M4250-10G2F-PoE+',
    subtitle: 'Switch Administrable AV Line • 8x PoE+ (125W), 2x GbE y 2x SFP para AV over IP',
    specs: [
      'Diseñado para Audio/Video sobre IP (AV over IP), Dante y NDI',
      '8 Puertos Gigabit PoE+ (125W) + 2 Puertos 1G + 2 Enlaces 1G SFP',
      'Interfaz Netgear AV UI con Perfiles de Audio y Video Preconfigurados',
      'Chasis Silencioso Reversible para Rack con Ventiladores Inteligentes'
    ],
    priceTag: 'RD$ 37,800.00',
    warranty: 'Garantía de por Vida Netgear ProSAFE con Reemplazo NBD',
    accentColor: '#fbbf24',
    iconType: 'netgear_av_switch'
  }
];

function generateSvg(p) {
  let illustration = '';

  if (p.iconType === 'hp_desktop') {
    illustration = `
      <!-- HP Pro SFF 400 G9 Chassis -->
      <g transform="translate(260, 230)">
        <!-- SFF Tower Base -->
        <rect x="30" y="30" width="220" height="270" rx="12" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="40" y="40" width="200" height="250" rx="8" fill="#1e293b"/>

        <!-- Front Bezel Textured Grille -->
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
          <line x1="55" y1="${60 + i * 16}" x2="160" y2="${60 + i * 16}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        `).join('')}

        <!-- HP Slash Logo Circle -->
        <circle cx="195" cy="80" r="18" fill="#0284c7"/>
        <path d="M190 68 L197 92 M196 68 L203 92" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>

        <!-- Power Button LED -->
        <circle cx="195" cy="120" r="6" fill="#0f172a" stroke="${p.accentColor}" stroke-width="2"/>
        <circle cx="195" cy="120" r="2.5" fill="#38bdf8"/>

        <!-- Front USB & Audio Ports -->
        <g transform="translate(185, 140)">
          <rect x="0" y="0" width="20" height="6" rx="1.5" fill="#0284c7"/>
          <rect x="0" y="12" width="20" height="6" rx="1.5" fill="#0284c7"/>
          <rect x="0" y="24" width="20" height="6" rx="1.5" fill="#0284c7"/>
          <circle cx="10" cy="40" r="4" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        </g>

        <!-- Slim Optical Drive Slot (Dummy / Sleek Line) -->
        <rect x="55" y="200" width="160" height="4" rx="2" fill="#475569"/>

        <!-- HP Wolf Security Badge -->
        <g transform="translate(55, 230)">
          <rect x="0" y="0" width="125" height="24" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1.5"/>
          <text x="62" y="16" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="#38bdf8" text-anchor="middle">HP WOLF PRO SECURITY</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="140" cy="315" rx="120" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'juniper_ap') {
    illustration = `
      <!-- Juniper Mist AP43 Enterprise Access Point -->
      <g transform="translate(250, 220)">
        <!-- Clean White Square Rounded Casing -->
        <rect x="25" y="25" width="280" height="280" rx="36" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="35" y="35" width="260" height="260" rx="28" fill="#ffffff"/>

        <!-- Inner Circular Wave Accent (Mist Radar) -->
        <circle cx="165" cy="165" r="95" fill="none" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="165" cy="165" r="70" fill="none" stroke="${p.accentColor}" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="6,4"/>
        <circle cx="165" cy="165" r="45" fill="none" stroke="${p.accentColor}" stroke-opacity="0.5" stroke-width="2"/>

        <!-- Center Juniper Logo Emblem -->
        <circle cx="165" cy="165" r="28" fill="#059669"/>
        <!-- Stylized J Cedar Mark -->
        <path d="M158 152 L172 152 L172 170 C172 176 168 180 162 180 C156 180 154 176 154 174" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Status Multi-color LED on Edge -->
        <circle cx="165" cy="55" r="5" fill="#10b981"/>
        <circle cx="165" cy="55" r="8" fill="none" stroke="#10b981" stroke-opacity="0.5" stroke-width="2"/>

        <!-- vBLE 16-element Array Markers -->
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const cx = 165 + 110 * Math.cos(rad);
          const cy = 165 + 110 * Math.sin(rad);
          return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3" fill="#059669"/>`;
        }).join('')}

        <!-- Mist AI Badge -->
        <g transform="translate(110, 248)">
          <rect x="0" y="0" width="110" height="22" rx="4" fill="#0f172a"/>
          <text x="55" y="15" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#34d399" text-anchor="middle">MIST AI • Wi-Fi 6</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="165" cy="325" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'lg_monitor') {
    illustration = `
      <!-- LG 32UN880-B Ergo Monitor with Articulated C-Clamp Arm -->
      <g transform="translate(200, 215)">
        <!-- Articulated Arm / Desk Clamp -->
        <g transform="translate(240, 150)">
          <!-- C-Clamp at Desk Level -->
          <rect x="-16" y="110" width="32" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
          <rect x="-24" y="130" width="48" height="10" rx="2" fill="#0f172a"/>
          <circle cx="0" cy="144" r="6" fill="#64748b"/>

          <!-- Vertical Swivel Column -->
          <rect x="-8" y="0" width="16" height="115" rx="3" fill="#1e293b"/>
          <circle cx="0" cy="15" r="9" fill="#0f172a" stroke="${p.accentColor}" stroke-width="2"/>

          <!-- Horizontal Extension Arm -->
          <path d="M0 15 L-40 -20" stroke="#334155" stroke-width="12" stroke-linecap="round"/>
          <circle cx="-40" cy="-20" r="8" fill="#0f172a" stroke="${p.accentColor}" stroke-width="2"/>
        </g>

        <!-- Monitor Screen Frame (Ultra-thin bezel) -->
        <rect x="20" y="20" width="360" height="210" rx="6" fill="#0f172a" stroke="${p.accentColor}" stroke-width="3"/>
        <!-- Vivid IPS 4K Display Surface -->
        <rect x="25" y="25" width="350" height="200" rx="4" fill="#020617"/>

        <!-- Display Graphic Gradient / 4K Visual Art -->
        <defs>
          <linearGradient id="lgScreenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
            <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#db2777" stop-opacity="0.9"/>
          </linearGradient>
        </defs>
        <rect x="32" y="32" width="336" height="186" rx="3" fill="url(#lgScreenGrad)"/>

        <!-- Subtle Screen Details -->
        <text x="200" y="115" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">4K IPS UHD</text>
        <text x="200" y="140" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="rgba(255,255,255,0.85)" text-anchor="middle">DCI-P3 95% • HDR10 • USB-C 60W</text>

        <!-- Bottom LG Center Mark -->
        <circle cx="200" cy="226" r="3" fill="#ef4444"/>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="305" rx="160" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'linksys_switch') {
    illustration = `
      <!-- Linksys LGS352MPC 48P PoE+ 740W Switch -->
      <g transform="translate(190, 240)">
        <!-- 1U Steel Rackmount Chassis -->
        <rect x="20" y="45" width="460" height="130" rx="8" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="30" y="55" width="440" height="110" rx="4" fill="#1e293b"/>

        <!-- Rack Ears on Left and Right -->
        <rect x="5" y="45" width="15" height="130" rx="3" fill="#334155"/>
        <circle cx="12" cy="65" r="4" fill="#0f172a"/>
        <circle cx="12" cy="155" r="4" fill="#0f172a"/>

        <rect x="480" y="45" width="15" height="130" rx="3" fill="#334155"/>
        <circle cx="488" cy="65" r="4" fill="#0f172a"/>
        <circle cx="488" cy="155" r="4" fill="#0f172a"/>

        <!-- Linksys Branding Badge -->
        <rect x="45" y="65" width="75" height="20" rx="3" fill="#0284c7"/>
        <text x="82" y="79" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">LINKSYS</text>
        <text x="128" y="79" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#94a3b8">LGS352MPC • 740W</text>

        <!-- 48-port RJ45 Grid Representation (4 banks of 12 ports) -->
        <g transform="translate(45, 95)">
          ${[0, 1, 2, 3].map(bank => `
            <g transform="translate(${bank * 72}, 0)">
              <rect x="0" y="0" width="66" height="52" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1"/>
              <!-- Top row 6 ports -->
              ${[0, 1, 2, 3, 4, 5].map(pIdx => `
                <rect x="${4 + pIdx * 10}" y="4" width="8" height="18" rx="1.5" fill="#1e293b" stroke="#0284c7" stroke-width="1"/>
                <circle cx="${8 + pIdx * 10}" cy="2" r="1.5" fill="#22c55e"/>
              `).join('')}
              <!-- Bottom row 6 ports -->
              ${[0, 1, 2, 3, 4, 5].map(pIdx => `
                <rect x="${4 + pIdx * 10}" y="28" width="8" height="18" rx="1.5" fill="#1e293b" stroke="#0284c7" stroke-width="1"/>
                <circle cx="${8 + pIdx * 10}" cy="50" r="1.5" fill="#22c55e"/>
              `).join('')}
            </g>
          `).join('')}
        </g>

        <!-- 4x 10G SFP+ Uplink Cages on Right -->
        <g transform="translate(345, 95)">
          <rect x="0" y="0" width="115" height="52" rx="3" fill="#0f172a" stroke="${p.accentColor}" stroke-width="1.5"/>
          ${[0, 1, 2, 3].map(i => `
            <g transform="translate(${8 + i * 26}, 8)">
              <rect x="0" y="0" width="22" height="34" rx="2" fill="#334155" stroke="${p.accentColor}" stroke-width="1"/>
              <rect x="4" y="6" width="14" height="22" rx="1" fill="#0f172a"/>
              <circle cx="11" cy="3" r="1.8" fill="#10b981"/>
              <text x="11" y="46" font-family="system-ui, sans-serif" font-size="7" font-weight="800" fill="#94a3b8" text-anchor="middle">10G</text>
            </g>
          `).join('')}
        </g>

        <!-- Floor reflection -->
        <ellipse cx="250" cy="205" rx="200" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'netgear_av_switch') {
    illustration = `
      <!-- Netgear Pro AV M4250-10G2F-PoE+ Switch -->
      <g transform="translate(200, 240)">
        <!-- Sleek AV Line Black Enclosure -->
        <rect x="25" y="45" width="440" height="130" rx="10" fill="#090d16" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="35" y="55" width="420" height="110" rx="6" fill="#111827"/>

        <!-- Netgear Pro AV Branding Tag -->
        <rect x="50" y="68" width="115" height="22" rx="4" fill="#d97706"/>
        <text x="107" y="83" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle">NETGEAR AV LINE</text>
        <text x="175" y="83" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#9ca3af">M4250-10G2F (GSM4212P)</text>

        <!-- 8x PoE+ Gigabit Ports with AV Profile Rings -->
        <g transform="translate(50, 102)">
          ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
            <g transform="translate(${i * 32}, 0)">
              <rect x="0" y="0" width="26" height="42" rx="3" fill="#1f2937" stroke="${p.accentColor}" stroke-width="1.5"/>
              <rect x="4" y="8" width="18" height="26" rx="1.5" fill="#090d16"/>
              <circle cx="13" cy="4" r="2" fill="#10b981"/>
              <text x="13" y="52" font-family="system-ui, sans-serif" font-size="7" font-weight="800" fill="#fbbf24" text-anchor="middle">P${i+1}</text>
            </g>
          `).join('')}
        </g>

        <!-- 2x Copper Gigabit Ports + 2x SFP Cages on Right -->
        <g transform="translate(315, 102)">
          <!-- 2x GbE Copper -->
          <rect x="0" y="0" width="26" height="42" rx="3" fill="#1f2937" stroke="#60a5fa" stroke-width="1.5"/>
          <rect x="4" y="8" width="18" height="26" rx="1.5" fill="#090d16"/>
          <text x="13" y="52" font-family="system-ui, sans-serif" font-size="7" font-weight="800" fill="#93c5fd" text-anchor="middle">1G</text>

          <rect x="30" y="0" width="26" height="42" rx="3" fill="#1f2937" stroke="#60a5fa" stroke-width="1.5"/>
          <rect x="34" y="8" width="18" height="26" rx="1.5" fill="#090d16"/>
          <text x="43" y="52" font-family="system-ui, sans-serif" font-size="7" font-weight="800" fill="#93c5fd" text-anchor="middle">1G</text>

          <!-- 2x SFP Fiber -->
          <rect x="65" y="0" width="30" height="42" rx="3" fill="#1f2937" stroke="${p.accentColor}" stroke-width="1.5"/>
          <rect x="70" y="6" width="20" height="30" rx="1.5" fill="#090d16"/>
          <text x="80" y="52" font-family="system-ui, sans-serif" font-size="7" font-weight="800" fill="#fbbf24" text-anchor="middle">SFP1</text>

          <rect x="100" y="0" width="30" height="42" rx="3" fill="#1f2937" stroke="${p.accentColor}" stroke-width="1.5"/>
          <rect x="105" y="6" width="20" height="30" rx="1.5" fill="#090d16"/>
          <text x="115" y="52" font-family="system-ui, sans-serif" font-size="7" font-weight="800" fill="#fbbf24" text-anchor="middle">SFP2</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="245" cy="205" rx="190" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 880" width="880" height="880">
      <defs>
        <!-- Card Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a101d"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>

        <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${p.accentColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${p.accentColor}" stop-opacity="0"/>
        </linearGradient>

        <!-- Pattern Grid -->
        <pattern id="cardGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
        </pattern>
      </defs>

      <!-- Background Plate -->
      <rect width="880" height="880" fill="url(#bgGrad)"/>
      <rect width="880" height="880" fill="url(#cardGrid)"/>

      <!-- Ambient Glow Behind Illustration -->
      <circle cx="440" cy="330" r="230" fill="${p.accentColor}" fill-opacity="0.12"/>

      <!-- Header Area -->
      <g transform="translate(50, 45)">
        <!-- Brand Badge Pill -->
        <rect x="0" y="0" width="370" height="38" rx="19" fill="${p.badgeColor}" fill-opacity="0.2" stroke="${p.badgeColor}" stroke-width="1.5"/>
        <circle cx="20" cy="19" r="6" fill="${p.badgeColor}"/>
        <text x="36" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#ffffff" letter-spacing="1">${p.brandBadge}</text>

        <!-- Official Seal Tag -->
        <g transform="translate(640, 0)">
          <rect x="0" y="0" width="140" height="38" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <text x="70" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#38bdf8" text-anchor="middle">STOCK SANTIAGO</text>
        </g>
      </g>

      <!-- Center Illustration Area -->
      ${illustration}

      <!-- Bottom Product Info Card Area -->
      <g transform="translate(50, 560)">
        <!-- Info Card Background Plate -->
        <rect x="0" y="0" width="780" height="270" rx="20" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>

        <!-- Product Model Title -->
        <text x="36" y="44" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff">${p.model}</text>
        <text x="36" y="72" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#94a3b8">${p.subtitle}</text>

        <!-- Price & Warranty Pill -->
        <g transform="translate(540, 24)">
          <rect x="0" y="0" width="204" height="48" rx="12" fill="${p.accentColor}" fill-opacity="0.15" stroke="${p.accentColor}" stroke-width="1.5"/>
          <text x="102" y="32" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="${p.accentColor}" text-anchor="middle">${p.priceTag}</text>
        </g>

        <!-- Specifications Checklist -->
        <g transform="translate(36, 106)">
          ${p.specs.map((spec, i) => `
            <g transform="translate(0, ${i * 32})">
              <circle cx="6" cy="6" r="5" fill="${p.accentColor}"/>
              <path d="M4 6 L6 8 L9 4" fill="none" stroke="#0a101d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <text x="22" y="10" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#cbd5e1">${spec}</text>
            </g>
          `).join('')}
        </g>

        <!-- Warranty Bottom Banner -->
        <g transform="translate(36, 236)">
          <rect x="0" y="0" width="708" height="26" rx="6" fill="rgba(255,255,255,0.04)"/>
          <text x="12" y="17" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#64748b">🛡️ ${p.warranty} • Factura con Comprobante Fiscal (NCF) y Soporte Técnico</text>
        </g>
      </g>
    </svg>
  `;
}

async function run() {
  console.log(`Generando ${products.length} imágenes WebP de catálogo en alta resolución...`);

  for (const p of products) {
    const svg = generateSvg(p);
    const targetFile = path.join(targetDir, p.fileName);
    const distFile = path.join(distDir, p.fileName);

    await sharp(Buffer.from(svg))
      .webp({ quality: 92, effort: 6 })
      .toFile(targetFile);

    fs.copyFileSync(targetFile, distFile);
    console.log(`[OK] Generada: ${p.fileName}`);
  }

  console.log('Todas las imágenes WebP de Lote 29 fueron creadas exitosamente.');
}

run().catch(err => {
  console.error('Error generando imágenes:', err);
  process.exit(1);
});
