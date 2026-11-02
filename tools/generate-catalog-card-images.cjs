const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'hp-elitebook-840-g10-laptop-corporativa.webp',
    brand: 'HP',
    brandBadge: 'HP ELITEBOOK COMMERCIAL',
    badgeColor: '#0096d6',
    model: 'EliteBook 840 G10',
    subtitle: 'Laptop Corporativa Premium en Chasis de Aluminio',
    specs: [
      'Intel Core i7-1355U (10 Núcleos hasta 5.0 GHz)',
      '16 GB RAM DDR5-5200 MHz • 512 GB SSD NVMe Gen4',
      'Pantalla 14" WUXGA 16:10 Antirreflejo • HP Wolf Security',
      'Doble Thunderbolt 4 • Wi-Fi 6E • Teclado Retroiluminado'
    ],
    priceTag: 'RD$ 68,500.00',
    warranty: '3 Años Garantía Oficial HP ProSupport',
    accentColor: '#0284c7',
    iconType: 'laptop'
  },
  {
    fileName: 'lenovo-thinkpad-t14-gen4-laptop-corporativa.webp',
    brand: 'Lenovo',
    brandBadge: 'LENOVO THINKPAD T-SERIES',
    badgeColor: '#e2231a',
    model: 'ThinkPad T14 Gen 4',
    subtitle: 'Workstation Móvil Militar con Chasis de Magnesio',
    specs: [
      'Intel Core i7-1365U vPro (10 Núcleos hasta 5.2 GHz)',
      '32 GB RAM DDR5 • 1 TB SSD PCIe 4.0 NVMe Opal2',
      'Pantalla 14" WUXGA 400 nits Low Power • MIL-STD-810H',
      'RJ-45 Gigabit Nativo • TrackPoint • Doble Thunderbolt 4'
    ],
    priceTag: 'RD$ 74,900.00',
    warranty: 'Garantía Oficial Lenovo Premier Support',
    accentColor: '#dc2626',
    iconType: 'thinkpad'
  },
  {
    fileName: 'lg-ultrafine-32un650-monitor-4k-ips.webp',
    brand: 'LG',
    brandBadge: 'LG ULTRAFINE PROFESSIONAL DISPLAY',
    badgeColor: '#a50034',
    model: 'UltraFine 32UN650-W 4K',
    subtitle: 'Monitor Profesional 31.5" IPS HDR10 95% DCI-P3',
    specs: [
      'Panel 31.5" IPS 4K UHD (3840 x 2160) Ultra Alta Definición',
      'Gama de Color Cinematográfica DCI-P3 95% • HDR10',
      'Bocinas Estéreo Waves MaxxAudio 5W x 2 • AMD FreeSync',
      'Doble HDMI 2.0 • DisplayPort 1.4 • Base Ergonómica Regulable'
    ],
    priceTag: 'RD$ 29,800.00',
    warranty: 'Garantía Oficial LG Dominicana • Facturación NCF',
    accentColor: '#e11d48',
    iconType: 'monitor'
  },
  {
    fileName: 'netgear-wax630-access-point-wifi6-multigigabit.webp',
    brand: 'Netgear',
    brandBadge: 'NETGEAR INSIGHT MANAGED WI-FI 6',
    badgeColor: '#4f46e5',
    model: 'Insight WAX630 AX6000',
    subtitle: 'Punto de Acceso Tri-Banda 2.5G PoE++ Alta Densidad',
    specs: [
      'Tri-Banda Wi-Fi 6 (AX6000): 2.4 GHz + 5 GHz (1) + 5 GHz (2)',
      'Puerto 2.5G Multi-Gigabit Ethernet con Alimentación PoE++',
      'Hasta 600 Dispositivos Conectados • Roaming Fluido 802.11k/v/r',
      'Gestión Centralizada en la Nube Netgear Insight • WPA3'
    ],
    priceTag: 'RD$ 21,500.00',
    warranty: 'Garantía Corporativa Netgear Insight Pro',
    accentColor: '#6366f1',
    iconType: 'ap'
  }
];

function generateSvg(p) {
  let illustration = '';
  if (p.iconType === 'laptop') {
    illustration = `
      <!-- Laptop illustration -->
      <g transform="translate(240, 260)">
        <rect x="30" y="20" width="340" height="215" rx="14" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="42" y="32" width="316" height="191" rx="8" fill="#1e293b"/>
        <!-- Screen inner content -->
        <rect x="52" y="42" width="296" height="171" rx="4" fill="#090d16"/>
        <circle cx="200" cy="37" r="3" fill="#38bdf8"/>
        <!-- Window mockup on screen -->
        <rect x="62" y="52" width="276" height="22" rx="3" fill="#1e293b"/>
        <circle cx="72" cy="63" r="3" fill="#ef4444"/>
        <circle cx="82" cy="63" r="3" fill="#f59e0b"/>
        <circle cx="92" cy="63" r="3" fill="#10b981"/>
        <rect x="110" y="58" width="120" height="10" rx="3" fill="#334155"/>
        <!-- Charts / code on screen -->
        <path d="M 72 170 L 120 130 L 160 145 L 210 100 L 260 120 L 320 80" fill="none" stroke="${p.accentColor}" stroke-width="3"/>
        <path d="M 72 170 L 120 130 L 160 145 L 210 100 L 260 120 L 320 80 L 320 185 L 72 185 Z" fill="${p.accentColor}" fill-opacity="0.15"/>
        <text x="200" y="195" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="middle">HP ELITEBOOK 840 G10 • 14&quot; WUXGA 16:10</text>
        <!-- Laptop Base -->
        <path d="M 0 240 L 400 240 L 380 262 L 20 262 Z" fill="#334155" stroke="${p.accentColor}" stroke-width="3"/>
        <rect x="160" y="242" width="80" height="14" rx="3" fill="#1e293b"/>
        <!-- Glow reflection -->
        <ellipse cx="200" cy="275" rx="190" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'thinkpad') {
    illustration = `
      <!-- ThinkPad illustration -->
      <g transform="translate(240, 260)">
        <rect x="30" y="20" width="340" height="215" rx="10" fill="#18181b" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="42" y="32" width="316" height="191" rx="6" fill="#09090b"/>
        <!-- Screen inner -->
        <circle cx="200" cy="37" r="3" fill="#ef4444"/>
        <rect x="52" y="42" width="296" height="171" rx="4" fill="#030712"/>
        <text x="200" y="110" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f8fafc" text-anchor="middle">ThinkPad</text>
        <circle cx="262" cy="98" r="4" fill="#ef4444"/>
        <text x="200" y="140" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#dc2626" text-anchor="middle">T14 GEN 4 • MIL-STD-810H</text>
        <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Intel Core i7 vPro • 32GB RAM • 1TB NVMe</text>
        <!-- Laptop Base -->
        <path d="M 0 240 L 400 240 L 380 264 L 20 264 Z" fill="#18181b" stroke="#3f3f46" stroke-width="3"/>
        <!-- Red TrackPoint on keyboard base -->
        <circle cx="200" cy="246" r="4.5" fill="#ef4444"/>
        <rect x="170" y="254" width="60" height="8" rx="2" fill="#27272a"/>
        <!-- Reflection -->
        <ellipse cx="200" cy="275" rx="190" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'monitor') {
    illustration = `
      <!-- Monitor illustration -->
      <g transform="translate(240, 250)">
        <!-- Screen bezel -->
        <rect x="20" y="10" width="360" height="235" rx="12" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <!-- Screen panel -->
        <rect x="30" y="20" width="340" height="215" rx="6" fill="#020617"/>
        <!-- 4K Content preview with vibrant color gradients -->
        <defs>
          <linearGradient id="monGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4f46e5"/>
            <stop offset="50%" stop-color="#ec4899"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>
        <rect x="36" y="26" width="328" height="203" rx="4" fill="url(#monGrad)" fill-opacity="0.35"/>
        <circle cx="200" cy="115" r="50" fill="url(#monGrad)" fill-opacity="0.6"/>
        <text x="200" y="115" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">4K UHD</text>
        <text x="200" y="140" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#fde047" text-anchor="middle">IPS • 95% DCI-P3 • HDR10</text>
        <text x="200" y="160" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1" text-anchor="middle">LG UltraFine 32UN650-W (31.5&quot;)</text>
        <!-- Stand neck -->
        <path d="M 185 245 L 215 245 L 210 290 L 190 290 Z" fill="#475569" stroke="#334155" stroke-width="2"/>
        <!-- Curved Base -->
        <path d="M 120 300 Q 200 275 280 300 L 265 305 Q 200 285 135 305 Z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Reflection -->
        <ellipse cx="200" cy="310" rx="170" ry="10" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'ap') {
    illustration = `
      <!-- Access Point illustration -->
      <g transform="translate(240, 240)">
        <!-- Dome shape AP body -->
        <circle cx="200" cy="140" r="120" fill="#0f172a" stroke="${p.accentColor}" stroke-width="5"/>
        <circle cx="200" cy="140" r="105" fill="#1e293b"/>
        <!-- Concentric wave rings -->
        <circle cx="200" cy="140" r="85" fill="none" stroke="${p.accentColor}" stroke-width="3" stroke-dasharray="8 6"/>
        <circle cx="200" cy="140" r="60" fill="none" stroke="#818cf8" stroke-width="2"/>
        <!-- Center core logo & LED -->
        <circle cx="200" cy="140" r="42" fill="#0f172a" stroke="${p.accentColor}" stroke-width="3"/>
        <text x="200" y="136" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">NETGEAR</text>
        <text x="200" y="152" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#a5b4fc" text-anchor="middle">WAX630</text>
        <!-- Status LED -->
        <circle cx="200" cy="168" r="4" fill="#10b981"/>
        <!-- Wi-Fi wave beams top -->
        <path d="M 160 50 Q 200 25 240 50" fill="none" stroke="#6366f1" stroke-width="4" stroke-linecap="round"/>
        <path d="M 140 32 Q 200 5 260 32" fill="none" stroke="#818cf8" stroke-width="3" stroke-linecap="round"/>
        <!-- 2.5G PoE++ indicator badge bottom -->
        <rect x="130" y="275" width="140" height="28" rx="14" fill="#1e1b4b" stroke="${p.accentColor}" stroke-width="2"/>
        <text x="200" y="293" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#c7d2fe" text-anchor="middle">2.5G PoE++ Multi-Gigabit</text>
        <!-- Reflection -->
        <ellipse cx="200" cy="315" rx="150" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  }

  return `
<svg width="880" height="880" viewBox="0 0 880 880" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0f1d"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="cardGlow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${p.accentColor}" stop-opacity="0.30"/>
      <stop offset="70%" stop-color="${p.accentColor}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="880" height="880" rx="32" fill="url(#bgGrad)"/>
  <rect width="880" height="880" rx="32" fill="url(#cardGlow)"/>

  <!-- Border Frame -->
  <rect x="16" y="16" width="848" height="848" rx="26" fill="none" stroke="#334155" stroke-width="2" stroke-opacity="0.5"/>

  <!-- Top Header Section -->
  <g transform="translate(48, 48)">
    <!-- Brand / Department Badge -->
    <rect x="0" y="0" width="310" height="36" rx="18" fill="#1e293b" stroke="${p.badgeColor}" stroke-width="2"/>
    <text x="20" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="900" letter-spacing="1.5" fill="${p.badgeColor}">${p.brandBadge}</text>

    <!-- Futunet Certified / Stock Seal -->
    <g transform="translate(560, 0)">
      <rect x="0" y="0" width="224" height="36" rx="18" fill="#042f2e" stroke="#14b8a6" stroke-width="1.5"/>
      <circle cx="20" cy="18" r="6" fill="#10b981"/>
      <text x="36" y="23" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#5eead4">DISPONIBLE EN STOCK</text>
    </g>

    <!-- Product Title & Subtitle -->
    <text x="0" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#f8fafc" letter-spacing="-0.5">${p.model}</text>
    <text x="0" y="112" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#94a3b8">${p.subtitle}</text>
  </g>

  <!-- Center Product Illustration -->
  ${illustration}

  <!-- Bottom Features & Specs Box -->
  <g transform="translate(48, 595)">
    <!-- Container Card -->
    <rect x="0" y="0" width="784" height="235" rx="20" fill="#0f172a" fill-opacity="0.9" stroke="#334155" stroke-width="1.5"/>

    <!-- 4 Bullet Specifications Grid -->
    <g transform="translate(24, 24)">
      <!-- Row 1 -->
      <g transform="translate(0, 0)">
        <circle cx="8" cy="12" r="5" fill="${p.accentColor}"/>
        <text x="24" y="16" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f1f5f9">${p.specs[0]}</text>
      </g>
      <g transform="translate(0, 36)">
        <circle cx="8" cy="12" r="5" fill="${p.accentColor}"/>
        <text x="24" y="16" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f1f5f9">${p.specs[1]}</text>
      </g>
      <!-- Row 2 -->
      <g transform="translate(0, 72)">
        <circle cx="8" cy="12" r="5" fill="${p.accentColor}"/>
        <text x="24" y="16" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f1f5f9">${p.specs[2]}</text>
      </g>
      <g transform="translate(0, 108)">
        <circle cx="8" cy="12" r="5" fill="${p.accentColor}"/>
        <text x="24" y="16" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f1f5f9">${p.specs[3]}</text>
      </g>
    </g>

    <!-- Price Tag & Official Warranty Footer -->
    <line x1="24" y1="170" x2="760" y2="170" stroke="#1e293b" stroke-width="2"/>
    <g transform="translate(24, 185)">
      <text x="0" y="24" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#38bdf8">${p.priceTag}</text>
      <text x="220" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#64748b">IVA / ITBIS e instalación disponibles</text>

      <g transform="translate(480, 2)">
        <rect x="0" y="0" width="256" height="28" rx="14" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <text x="128" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#cbd5e1" text-anchor="middle">🛡️ ${p.warranty}</text>
      </g>
    </g>
  </g>
</svg>
  `;
}

async function run() {
  for (const prod of products) {
    const svg = generateSvg(prod);
    const dest1 = path.join(targetDir, prod.fileName);
    const dest2 = path.join(distDir, prod.fileName);

    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(dest1);

    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(dest2);

    const stats = fs.statSync(dest1);
    console.log(`Generated ${prod.fileName} (${stats.size} bytes)`);
  }
}

run().catch(err => {
  console.error('Error generating catalog card images:', err);
  process.exit(1);
});
