const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'mikrotik-crs305-switch-fibra-10g.webp',
    brand: 'MikroTik',
    brandBadge: 'MIKROTIK 10G FIBER SWITCHING',
    badgeColor: '#dc2626',
    model: 'MikroTik CRS305-1G-4S+IN',
    subtitle: 'Switch de Fibra 10G • 4 Puertos SFP+ (10 Gbps) + 1 GbE PoE In',
    specs: [
      '4 Jaulas SFP+ de 10 Gbps para Enlaces de Fibra y SAN/NAS',
      '1 Puerto Gigabit Ethernet con Entrada PoE 802.3af/at',
      'Doble Conector DC para Alimentación Eléctrica Redundante',
      'Chasis Metálico Fanless Silencioso y Dual Boot RouterOS/SwOS'
    ],
    priceTag: 'RD$ 13,800.00',
    warranty: 'Garantía Oficial MikroTik Enterprise Dominicana',
    accentColor: '#ef4444',
    iconType: 'mikrotik_switch'
  },
  {
    fileName: 'victron-multiplus-ii-48-5000-inversor.webp',
    brand: 'Victron Energy',
    brandBadge: 'VICTRON ENERGY SOLAR ESS POWER',
    badgeColor: '#0284c7',
    model: 'MultiPlus-II 48/5000/70-50',
    subtitle: 'Inversor/Cargador Senoidal Puro 48V • 5000VA con Función ESS y UPS',
    specs: [
      'Potencia Continua 5000VA (4000W) • Onda Senoidal Pura 120V AC',
      'Cargador Inteligente de Baterías de 70A y Conmutación UPS &lt; 20 ms',
      'Soporte Nativo ESS para Autoconsumo Solar e Inyección Regulada',
      'Monitoreo Total en Tiempo Real con Cerbo GX y Portal VRM Cloud'
    ],
    priceTag: 'RD$ 115,000.00',
    warranty: 'Garantía Oficial Victron Energy de 5 Años en RD',
    accentColor: '#38bdf8',
    iconType: 'victron_inverter'
  },
  {
    fileName: 'zkteco-speedface-v5l-terminal-biometrica.webp',
    brand: 'ZKTeco',
    brandBadge: 'ZKTECO VISIBLE LIGHT BIOMETRICS',
    badgeColor: '#16a34a',
    model: 'ZKTeco SpeedFace-V5L',
    subtitle: 'Terminal Biométrica Facial con Luz Visible y Lectura de Palma',
    specs: [
      'Reconocimiento Facial Visible Light en &lt; 0.3s a 2 Metros',
      'Lectura Biométrica de Palma 3-en-1 y Antifalsificación con IA',
      'Capacidad: 6,000 Rostros, 3,000 Palmas y 10,000 Tarjetas RFID',
      'Pantalla Táctil a Color 5", TCP/IP, Wi-Fi y Relé de Control de Acceso'
    ],
    priceTag: 'RD$ 26,500.00',
    warranty: 'Garantía Oficial ZKTeco con Soporte Técnico en Santiago',
    accentColor: '#22c55e',
    iconType: 'zkteco_terminal'
  },
  {
    fileName: 'ezviz-h8-pro-3k-camara-ptz.webp',
    brand: 'Ezviz',
    brandBadge: 'EZVIZ 3K PANORAMIC SMART AI',
    badgeColor: '#2563eb',
    model: 'Ezviz H8 Pro 3K (5MP)',
    subtitle: 'Cámara Wi-Fi Exterior PTZ 360° con Visión Nocturna en Color y Defensa Activa',
    specs: [
      'Resolución Ultra HD 3K (2880 x 1620, 5 Megapíxeles) y Giro 360°',
      'Detección de Personas y Vehículos con Inteligencia Artificial',
      'Visión Nocturna en Color hasta 30m y Defensa con Sirena y Flash',
      'Resistencia a Intemperie IP65, Audio Bidireccional y MicroSD 512GB'
    ],
    priceTag: 'RD$ 7,950.00',
    warranty: 'Garantía Oficial Ezviz con Entrega Inmediata en Santiago',
    accentColor: '#60a5fa',
    iconType: 'ezviz_ptz'
  },
  {
    fileName: 'lenovo-thinkcentre-neo-50s-gen4-desktop.webp',
    brand: 'Lenovo',
    brandBadge: 'LENOVO THINKCENTRE ENTERPRISE',
    badgeColor: '#b91c1c',
    model: 'ThinkCentre Neo 50s Gen 4',
    subtitle: 'Computadora Corporativa SFF • Core i7-13700, 16GB RAM, 512GB SSD NVMe',
    specs: [
      'Procesador Intel Core i7-13700 13ª Gen (16 Núcleos, hasta 5.2 GHz)',
      '16 GB RAM DDR4 (Hasta 64 GB) y SSD M.2 PCIe 4.0 NVMe de 512 GB',
      'Gráficos Intel UHD 770 con Salidas HDMI, DisplayPort y VGA',
      'Seguridad Empresarial dTPM 2.0 por Hardware y Chasis Ecológico SFF'
    ],
    priceTag: 'RD$ 52,900.00',
    warranty: 'Garantía Oficial Lenovo Premier Support 3 Años On-Site',
    accentColor: '#f87171',
    iconType: 'lenovo_desktop'
  }
];

function generateSvg(p) {
  let illustration = '';

  if (p.iconType === 'mikrotik_switch') {
    illustration = `
      <!-- MikroTik CRS305 10G SFP+ Switch -->
      <g transform="translate(240, 250)">
        <!-- Switch Body Metallic White Chassis -->
        <rect x="20" y="50" width="360" height="150" rx="10" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="30" y="60" width="340" height="130" rx="6" fill="#f1f5f9"/>

        <!-- Top branding bar -->
        <rect x="45" y="70" width="80" height="24" rx="4" fill="#0f172a"/>
        <text x="85" y="86" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ef4444" text-anchor="middle">MikroTik</text>
        <text x="135" y="86" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#475569">CRS305-1G-4S+IN</text>

        <!-- 1x Gigabit RJ45 Port (with PoE in indicator) -->
        <g transform="translate(45, 106)">
          <rect x="0" y="0" width="36" height="38" rx="4" fill="#1e293b" stroke="#0ea5e9" stroke-width="2"/>
          <rect x="6" y="8" width="24" height="22" rx="2" fill="#0284c7"/>
          <text x="18" y="50" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#0284c7" text-anchor="middle">ETH 1</text>
          <circle cx="18" cy="4" r="2.5" fill="#10b981"/>
        </g>

        <!-- 4x SFP+ 10G Cages -->
        ${[0, 1, 2, 3].map(i => `
          <g transform="translate(${105 + i * 56}, 106)">
            <rect x="0" y="0" width="48" height="38" rx="4" fill="#1e293b" stroke="${p.accentColor}" stroke-width="2"/>
            <rect x="6" y="6" width="36" height="26" rx="2" fill="#334155"/>
            <rect x="12" y="12" width="24" height="14" rx="1" fill="#0f172a"/>
            <circle cx="12" cy="3" r="2" fill="#10b981"/>
            <circle cx="36" cy="3" r="2" fill="#f59e0b"/>
            <text x="24" y="50" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#64748b" text-anchor="middle">SFP+ ${i+1}</text>
          </g>
        `).join('')}

        <!-- Dual DC jacks on right -->
        <circle cx="345" cy="118" r="7" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="345" cy="138" r="7" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <text x="345" y="156" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#64748b" text-anchor="middle">DC 1/2</text>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="215" rx="170" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'victron_inverter') {
    illustration = `
      <!-- Victron MultiPlus-II Inverter -->
      <g transform="translate(265, 230)">
        <!-- Main Blue Victron Steel Enclosure -->
        <rect x="25" y="25" width="300" height="260" rx="16" fill="#0284c7" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="35" y="35" width="280" height="240" rx="12" fill="#0369a1"/>

        <!-- Top Grille Vent -->
        ${[0, 1, 2, 3, 4].map(i => `
          <line x1="55" y1="${55 + i * 8}" x2="295" y2="${55 + i * 8}" stroke="#075985" stroke-width="3" stroke-linecap="round"/>
        `).join('')}

        <!-- Center Inscription Area -->
        <g transform="translate(175, 130)">
          <!-- Victron Energy Blue Logo and Text -->
          <circle cx="0" cy="-20" r="16" fill="#ffffff"/>
          <path d="M-8 -26 L0 -14 L8 -26" stroke="#0284c7" stroke-width="4" fill="none" stroke-linecap="round"/>
          <text x="0" y="8" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">victron energy</text>
          <text x="0" y="26" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#38bdf8" text-anchor="middle">MultiPlus-II</text>
          <text x="0" y="42" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#bae6fd" text-anchor="middle">48V | 5000VA | 70A | 50A</text>
        </g>

        <!-- Status LED Column -->
        <g transform="translate(60, 185)">
          <rect x="0" y="0" width="230" height="50" rx="6" fill="#075985"/>
          <circle cx="30" cy="25" r="5" fill="#10b981"/>
          <text x="42" y="29" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#ffffff">Inverter On</text>
          <circle cx="110" cy="25" r="5" fill="#38bdf8"/>
          <text x="122" y="29" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#ffffff">Mains On</text>
          <circle cx="180" cy="25" r="5" fill="#f59e0b"/>
          <text x="192" y="29" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#ffffff">Bulk/Float</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="175" cy="295" rx="150" ry="14" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'zkteco_terminal') {
    illustration = `
      <!-- ZKTeco SpeedFace-V5L Facial Terminal -->
      <g transform="translate(290, 230)">
        <!-- Body Housing -->
        <rect x="30" y="20" width="240" height="270" rx="28" fill="#1e293b" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="40" y="30" width="220" height="250" rx="22" fill="#0f172a"/>

        <!-- Top Dual Camera Bar + Infrared Sensor -->
        <rect x="60" y="44" width="180" height="34" rx="8" fill="#1e293b"/>
        <circle cx="85" cy="61" r="9" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="85" cy="61" r="4" fill="#0f172a"/>
        <circle cx="120" cy="61" r="5" fill="#ef4444"/>
        <circle cx="155" cy="61" r="9" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="155" cy="61" r="4" fill="#0f172a"/>
        <circle cx="215" cy="61" r="3" fill="#10b981"/>

        <!-- 5-Inch Touch Screen Display -->
        <rect x="55" y="90" width="190" height="135" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <rect x="62" y="96" width="176" height="123" rx="6" fill="#0f172a"/>

        <!-- Face mesh targeting graphic on screen -->
        <circle cx="150" cy="145" r="30" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 3"/>
        <path d="M135 135 L142 135 M158 135 L165 135 M150 142 L150 150 M142 158 Q150 164 158 158" stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round"/>
        <text x="150" y="195" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#22c55e" text-anchor="middle">ACCESO PERMITIDO</text>
        <text x="150" y="208" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8" text-anchor="middle">SpeedFace-V5L [TI]</text>

        <!-- Palm sensor / RFID zone at bottom -->
        <g transform="translate(150, 248)">
          <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
          <!-- Palm icon -->
          <path d="M-8 4 L-8 -2 Q-8 -6 -5 -6 Q-2 -6 -2 -2 L-2 4 M-2 -2 L-2 -8 Q-2 -12 1 -12 Q4 -12 4 -8 L4 4 M4 -8 L4 -7 Q4 -11 7 -11 Q10 -11 10 -7 L10 5" stroke="#22c55e" stroke-width="1.5" fill="none"/>
          <text x="0" y="20" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#64748b" text-anchor="middle">PALMA / RFID</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="150" cy="300" rx="130" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'ezviz_ptz') {
    illustration = `
      <!-- Ezviz H8 Pro 3K PTZ Camera -->
      <g transform="translate(290, 230)">
        <!-- Wall / Ceiling Mount Arm -->
        <path d="M70 30 L150 30 L150 70 L130 90 L110 90 Z" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <rect x="40" y="20" width="35" height="50" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>

        <!-- Dual High-Gain Antennas -->
        <line x1="80" y1="80" x2="30" y2="40" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
        <line x1="220" y1="80" x2="270" y2="40" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>

        <!-- PTZ Motor Turret Base -->
        <rect x="100" y="80" width="100" height="40" rx="10" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="3"/>
        <text x="150" y="105" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1">EZVIZ</text>

        <!-- Spherical Camera Globe -->
        <circle cx="150" cy="180" r="75" fill="#ffffff" stroke="${p.accentColor}" stroke-width="3"/>

        <!-- Black Lens Shield Area -->
        <ellipse cx="150" cy="180" rx="55" ry="58" fill="#0f172a"/>

        <!-- 3K 5MP Glass Lens -->
        <circle cx="150" cy="170" r="26" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="150" cy="170" r="16" fill="#0284c7"/>
        <circle cx="145" cy="165" r="6" fill="#ffffff" fill-opacity="0.6"/>

        <!-- Dual Spotlight LEDs -->
        <circle cx="120" cy="210" r="8" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
        <circle cx="180" cy="210" r="8" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
        <text x="150" y="215" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#60a5fa" text-anchor="middle">3K 5MP</text>

        <!-- Floor reflection -->
        <ellipse cx="150" cy="290" rx="140" ry="14" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'lenovo_desktop') {
    illustration = `
      <!-- Lenovo ThinkCentre Neo 50s Gen 4 SFF PC -->
      <g transform="translate(280, 230)">
        <!-- Small Form Factor Tower Case -->
        <rect x="40" y="20" width="220" height="260" rx="10" fill="#1e293b" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="50" y="30" width="200" height="240" rx="6" fill="#0f172a"/>

        <!-- Front Bezel Textured Grille -->
        <g transform="translate(60, 45)">
          <!-- Lenovo Red Accent Tag -->
          <rect x="0" y="0" width="60" height="18" rx="2" fill="#b91c1c"/>
          <text x="30" y="13" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">Lenovo</text>
          
          <text x="70" y="14" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#cbd5e1">ThinkCentre</text>
        </g>

        <!-- Power Button with Red LED Ring -->
        <g transform="translate(215, 52)">
          <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
          <path d="M0 -5 L0 0 M-3 -3 A4 4 0 1 0 3 -3" stroke="#ef4444" stroke-width="2" fill="none"/>
        </g>

        <!-- Front Slim Optical / Bay Line -->
        <line x1="60" y1="85" x2="240" y2="85" stroke="#334155" stroke-width="2"/>

        <!-- Front USB & Audio Ports -->
        <g transform="translate(60, 105)">
          <rect x="0" y="0" width="26" height="12" rx="2" fill="#334155" stroke="#0ea5e9" stroke-width="1.5"/>
          <rect x="34" y="0" width="26" height="12" rx="2" fill="#334155" stroke="#0ea5e9" stroke-width="1.5"/>
          <circle cx="75" cy="6" r="5" fill="#334155"/>
          <circle cx="92" cy="6" r="5" fill="#334155"/>
          <rect x="110" y="2" width="16" height="8" rx="2" fill="#38bdf8"/>
          <text x="135" y="10" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8">USB 3.2 / C</text>
        </g>

        <!-- Intel Core i7 Badge -->
        <g transform="translate(60, 140)">
          <rect x="0" y="0" width="55" height="42" rx="4" fill="#0068b5" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="27" y="16" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle">intel</text>
          <text x="27" y="28" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">CORE</text>
          <text x="27" y="38" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#fbbf24" text-anchor="middle">i7</text>
        </g>

        <!-- Specs Badge -->
        <g transform="translate(130, 145)">
          <text x="0" y="12" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ffffff">Neo 50s Gen 4</text>
          <text x="0" y="26" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#94a3b8">16GB RAM • 512GB NVMe</text>
          <text x="0" y="38" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#10b981">dTPM 2.0 • Win 11 Pro</text>
        </g>

        <!-- Vertical Air Intake Slits -->
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `
          <line x1="${75 + i * 20}" y1="205" x2="${75 + i * 20}" y2="250" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
        `).join('')}

        <!-- Floor reflection -->
        <ellipse cx="150" cy="295" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  }

  return `
    <svg width="880" height="880" viewBox="0 0 880 880" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a101d"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>

        <!-- Glow Effect Filter -->
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Canvas Background -->
      <rect width="880" height="880" rx="32" fill="url(#bgGrad)"/>
      <rect x="8" y="8" width="864" height="864" rx="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>

      <!-- Ambient Glow Behind Product -->
      <circle cx="440" cy="360" r="240" fill="${p.accentColor}" fill-opacity="0.12"/>

      <!-- Top Header Bar -->
      <g transform="translate(50, 50)">
        <!-- Brand Badge Pill -->
        <rect x="0" y="0" width="360" height="38" rx="19" fill="${p.badgeColor}" fill-opacity="0.2" stroke="${p.badgeColor}" stroke-width="1.5"/>
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

  console.log('Todas las imágenes WebP de Lote 28 fueron creadas exitosamente.');
}

run().catch(err => {
  console.error('Error generando imágenes:', err);
  process.exit(1);
});
