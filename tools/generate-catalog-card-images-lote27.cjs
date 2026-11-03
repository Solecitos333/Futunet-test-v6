const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'schneider-compact-nsx100f-interruptor.webp',
    brand: 'Schneider Electric',
    brandBadge: 'SCHNEIDER ELECTRIC INDUSTRIAL POWER',
    badgeColor: '#059669',
    model: 'Compact NSX100F (100A)',
    subtitle: 'Interruptor de Caja Moldeada 3P3D 36kA con Micrologic 2.2',
    specs: [
      'Capacidad Nominal 100A (Regulable 40A a 100A) • 3 Polos 3D',
      'Poder de Corte Icu 36 kA a 380/415V AC • Tensión hasta 690V',
      'Unidad Electrónica Micrologic 2.2 con Protección LSoI',
      'Apto para Acometidas Principales y Tableros Industriales'
    ],
    priceTag: 'RD$ 19,450.00',
    warranty: 'Garantía Oficial Schneider Electric Dominicana',
    accentColor: '#10b981',
    iconType: 'breaker'
  },
  {
    fileName: 'cisco-catalyst-9105ax-access-point.webp',
    brand: 'Cisco',
    brandBadge: 'CISCO CATALYST ENTERPRISE WI-FI 6',
    badgeColor: '#0284c7',
    model: 'Cisco Catalyst 9105AX',
    subtitle: 'Punto de Acceso Empresarial Wi-Fi 6 (AX1800) PoE 802.3af',
    specs: [
      'Estándar Wi-Fi 6 (802.11ax) • Doble Banda MU-MIMO 2x2:2',
      'Velocidad Agregada hasta 1.77 Gbps • OFDMA y Target Wake Time',
      'Gestión Catalyst Center / DNA o Modo Autónomo Clustered',
      'Alimentación PoE 802.3af • Seguridad WPA3 Enterprise Integrada'
    ],
    priceTag: 'RD$ 24,900.00',
    warranty: 'Garantía Oficial Cisco Limited Lifetime Warranty (LLW)',
    accentColor: '#38bdf8',
    iconType: 'ap'
  },
  {
    fileName: 'ubiquiti-usw-pro-24-poe-switch.webp',
    brand: 'Ubiquiti',
    brandBadge: 'UBIQUITI UNIFI PRO SWITCHING',
    badgeColor: '#2563eb',
    model: 'UniFi Switch Pro 24 PoE',
    subtitle: 'Switch Administrable Layer 3 • 24P PoE+ / PoE++ (400W) + 2x 10G SFP+',
    specs: [
      '16 Puertos GbE PoE+ (802.3at) + 8 Puertos GbE PoE++ (802.3bt)',
      'Presupuesto PoE Total 400W • 2 Puertos Uplink 10G SFP+',
      'Enrutamiento Layer 3 • Pantalla Táctil LCM 1.3" con Realidad Aumentada',
      'Chasis Metálico Silver 1U para Rack • Enfriamiento Silencioso'
    ],
    priceTag: 'RD$ 41,500.00',
    warranty: 'Garantía Corporativa Ubiquiti Networks',
    accentColor: '#0ea5e9',
    iconType: 'unifi_switch'
  },
  {
    fileName: 'dahua-nvr4216-16p-wizsense-4k.webp',
    brand: 'Dahua Technology',
    brandBadge: 'DAHUA WIZSENSE AI SURVEILLANCE',
    badgeColor: '#dc2626',
    model: 'Dahua WizSense 16P 4K',
    subtitle: 'Grabador NVR 16 Canales 4K con 16 Puertos PoE Integrados + IA',
    specs: [
      '16 Canales IP hasta 4K UHD (12MP) • 16 Puertos PoE Independientes',
      'Inteligencia Artificial WizSense: Reconocimiento Facial y SMD Plus',
      'Soporte de 2 Discos Duros SATA hasta 10TB c/u (20TB Total)',
      'Salidas de Video Duales HDMI 4K + VGA • App DMSS Móvil'
    ],
    priceTag: 'RD$ 26,750.00',
    warranty: 'Garantía Oficial Dahua Technology Dominicana',
    accentColor: '#ef4444',
    iconType: 'nvr'
  },
  {
    fileName: 'tplink-er7206-omada-vpn-router.webp',
    brand: 'TP-Link',
    brandBadge: 'TP-LINK OMADA SDN BUSINESS',
    badgeColor: '#0d9488',
    model: 'Omada ER7206 Multi-WAN',
    subtitle: 'Router VPN Gigabit Multi-WAN con Balanceo de Carga y Omada SDN',
    specs: [
      'Hasta 4 Puertos WAN Gigabit (1 WAN SFP, 1 WAN RJ45, 2 WAN/LAN RJ45)',
      'Túneles VPN de Alta Seguridad: IPsec, OpenVPN, L2TP/PPTP',
      'Balanceo de Carga Multi-Línea y Failover Automático Sin Caídas',
      'Gestión en la Nube 100% Centralizada con Omada SDN y App Móvil'
    ],
    priceTag: 'RD$ 9,850.00',
    warranty: 'Garantía Limitada de por Vida TP-Link Enterprise',
    accentColor: '#14b8a6',
    iconType: 'router'
  }
];

function generateSvg(p) {
  let illustration = '';

  if (p.iconType === 'breaker') {
    illustration = `
      <!-- Schneider Molded Case Circuit Breaker (NSX100F) -->
      <g transform="translate(290, 240)">
        <!-- Breaker body -->
        <rect x="20" y="30" width="260" height="230" rx="12" fill="#1e293b" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="35" y="45" width="230" height="200" rx="8" fill="#0f172a"/>

        <!-- Top terminals 3-pole -->
        <rect x="50" y="10" width="40" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <rect x="130" y="10" width="40" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <rect x="210" y="10" width="40" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <circle cx="70" cy="25" r="7" fill="#cbd5e1"/>
        <circle cx="150" cy="25" r="7" fill="#cbd5e1"/>
        <circle cx="230" cy="25" r="7" fill="#cbd5e1"/>

        <!-- Bottom terminals 3-pole -->
        <rect x="50" y="250" width="40" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <rect x="130" y="250" width="40" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <rect x="210" y="250" width="40" height="30" rx="4" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <circle cx="70" cy="265" r="7" fill="#cbd5e1"/>
        <circle cx="150" cy="265" r="7" fill="#cbd5e1"/>
        <circle cx="230" cy="265" r="7" fill="#cbd5e1"/>

        <!-- Operating Toggle Handle -->
        <rect x="120" y="80" width="60" height="80" rx="6" fill="#334155" stroke="#64748b" stroke-width="2"/>
        <path d="M135 120 L150 90 L165 120 Z" fill="#10b981"/>
        <rect x="140" y="95" width="20" height="45" rx="3" fill="#ffffff"/>
        <text x="150" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#10b981" text-anchor="middle">I - ON</text>

        <!-- Micrologic 2.2 Electronic Trip Dial Unit -->
        <rect x="50" y="175" width="200" height="55" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
        <circle cx="85" cy="202" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <line x1="85" y1="202" x2="93" y2="195" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
        <circle cx="150" cy="202" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <line x1="150" y1="202" x2="155" y2="192" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
        <circle cx="215" cy="202" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <line x1="215" y1="202" x2="210" y2="192" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
        <text x="85" y="224" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#94a3b8" text-anchor="middle">Ir (A)</text>
        <text x="150" y="224" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#94a3b8" text-anchor="middle">Isd</text>
        <text x="215" y="224" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#94a3b8" text-anchor="middle">Test</text>

        <!-- Brand inscription -->
        <text x="50" y="70" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#10b981">Schneider</text>
        <text x="50" y="84" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#94a3b8">Compact NSX100F</text>
        <text x="250" y="72" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#38bdf8" text-anchor="end">100A</text>
        <text x="250" y="86" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="end">36kA • 415V</text>

        <!-- Floor reflection -->
        <ellipse cx="150" cy="285" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.2"/>
      </g>
    `;
  } else if (p.iconType === 'ap') {
    illustration = `
      <!-- Cisco Catalyst 9105AX Access Point -->
      <g transform="translate(290, 240)">
        <!-- AP Body (Sleek curved enterprise squircle) -->
        <rect x="25" y="30" width="250" height="240" rx="36" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="35" y="40" width="230" height="220" rx="30" fill="#ffffff"/>

        <!-- Cisco Brand Center Badge -->
        <g transform="translate(150, 130)">
          <!-- Cisco Bridge Icon Bars -->
          <line x1="-30" y1="5" x2="-30" y2="-5" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <line x1="-20" y1="10" x2="-20" y2="-10" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <line x1="-10" y1="15" x2="-10" y2="-15" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <line x1="0" y1="20" x2="0" y2="-20" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <line x1="10" y1="15" x2="10" y2="-15" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <line x1="20" y1="10" x2="20" y2="-10" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <line x1="30" y1="5" x2="30" y2="-5" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          <text x="0" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="2">CISCO</text>
          <text x="0" y="54" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#0284c7" text-anchor="middle">Catalyst 9105AX</text>
        </g>

        <!-- Status LED Indicator Light -->
        <circle cx="150" cy="55" r="5" fill="#10b981"/>
        <circle cx="150" cy="55" r="9" fill="#10b981" fill-opacity="0.3"/>

        <!-- Subtle Wi-Fi 6 Wave Arcs -->
        <path d="M100 215 A 60 60 0 0 1 200 215" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
        <path d="M120 225 A 35 35 0 0 1 180 225" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
        <circle cx="150" cy="235" r="4" fill="#0284c7"/>

        <!-- Floor reflection -->
        <ellipse cx="150" cy="285" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.2"/>
      </g>
    `;
  } else if (p.iconType === 'unifi_switch') {
    illustration = `
      <!-- Ubiquiti UniFi Pro 24 PoE Switch -->
      <g transform="translate(240, 260)">
        <!-- 1U Silver Chassis Body -->
        <rect x="10" y="50" width="380" height="150" rx="8" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="20" y="60" width="360" height="130" rx="6" fill="#e2e8f0"/>

        <!-- Rack ears -->
        <rect x="0" y="60" width="10" height="130" rx="2" fill="#94a3b8"/>
        <circle cx="5" cy="80" r="3" fill="#0f172a"/>
        <circle cx="5" cy="170" r="3" fill="#0f172a"/>
        <rect x="390" y="60" width="10" height="130" rx="2" fill="#94a3b8"/>
        <circle cx="395" cy="80" r="3" fill="#0f172a"/>
        <circle cx="395" cy="170" r="3" fill="#0f172a"/>

        <!-- Ubiquiti 1.3" LCM Color Touchscreen -->
        <rect x="32" y="78" width="56" height="56" rx="6" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>
        <circle cx="60" cy="98" r="10" fill="none" stroke="#0ea5e9" stroke-width="2"/>
        <circle cx="60" cy="98" r="3" fill="#0ea5e9"/>
        <text x="60" y="122" font-family="system-ui, sans-serif" font-size="7" font-weight="900" fill="#38bdf8" text-anchor="middle">PRO 24 PoE</text>

        <!-- Brand / Model label -->
        <text x="34" y="152" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#0284c7">UBIQUITI</text>
        <text x="34" y="165" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#475569">400W PoE++</text>

        <!-- 24 Ports Matrix -->
        <g transform="translate(105, 78)">
          <!-- Top Row (12 ports) -->
          ${Array.from({ length: 12 }).map((_, i) => `
            <rect x="${i * 18}" y="0" width="15" height="24" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1"/>
            <circle cx="${i * 18 + 7.5}" cy="-4" r="1.5" fill="${i < 4 ? '#38bdf8' : '#10b981'}"/>
          `).join('')}
          <!-- Bottom Row (12 ports) -->
          ${Array.from({ length: 12 }).map((_, i) => `
            <rect x="${i * 18}" y="32" width="15" height="24" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1"/>
            <circle cx="${i * 18 + 7.5}" cy="60" r="1.5" fill="${i < 4 ? '#38bdf8' : '#10b981'}"/>
          `).join('')}
        </g>

        <!-- 2x 10G SFP+ Cages -->
        <g transform="translate(330, 80)">
          <rect x="0" y="0" width="18" height="52" rx="3" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>
          <rect x="22" y="0" width="18" height="52" rx="3" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>
          <text x="20" y="68" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#0284c7" text-anchor="middle">10G SFP+</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="225" rx="180" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'nvr') {
    illustration = `
      <!-- Dahua WizSense 4K 16P PoE NVR -->
      <g transform="translate(240, 260)">
        <!-- NVR Chassis -->
        <rect x="15" y="40" width="370" height="170" rx="10" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="25" y="50" width="350" height="150" rx="6" fill="#1e293b"/>

        <!-- Front Brushed Faceplate -->
        <rect x="35" y="60" width="330" height="70" rx="4" fill="#020617"/>
        
        <!-- Dahua Branding & WizSense Logo -->
        <text x="50" y="90" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="1">alhua</text>
        <circle cx="45" cy="85" r="4" fill="#ef4444"/>
        <text x="110" y="90" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#ef4444">WizSense</text>
        <text x="50" y="112" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#94a3b8">NVR4216-16P-4KS2/I • 4K AI NVR</text>

        <!-- Front Status LEDs and USB -->
        <g transform="translate(280, 80)">
          <circle cx="0" cy="5" r="3" fill="#10b981"/>
          <circle cx="12" cy="5" r="3" fill="#ef4444"/>
          <circle cx="24" cy="5" r="3" fill="#38bdf8"/>
          <rect x="42" y="0" width="22" height="10" rx="2" fill="#334155" stroke="#64748b" stroke-width="1"/>
        </g>

        <!-- Rear 16 PoE Ports Preview -->
        <g transform="translate(50, 145)">
          <text x="0" y="16" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#ef4444">16x PoE CHANNELS:</text>
          ${Array.from({ length: 8 }).map((_, i) => `
            <rect x="${i * 18 + 110}" y="2" width="14" height="18" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
            <circle cx="${i * 18 + 117}" cy="-2" r="1.5" fill="#10b981"/>
          `).join('')}
          ${Array.from({ length: 8 }).map((_, i) => `
            <rect x="${i * 18 + 110}" y="24" width="14" height="18" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
          `).join('')}
        </g>

        <!-- AI Chip Badge -->
        <g transform="translate(320, 142)">
          <rect x="0" y="0" width="38" height="40" rx="4" fill="#020617" stroke="#ef4444" stroke-width="1.5"/>
          <text x="19" y="18" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#ef4444" text-anchor="middle">AI</text>
          <text x="19" y="32" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#ffffff" text-anchor="middle">SMD+</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="225" rx="180" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'router') {
    illustration = `
      <!-- TP-Link Omada ER7206 VPN Router -->
      <g transform="translate(240, 260)">
        <!-- Metal Router Chassis -->
        <rect x="20" y="50" width="360" height="150" rx="8" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="30" y="60" width="340" height="130" rx="6" fill="#1e293b"/>

        <!-- Front panel -->
        <rect x="40" y="70" width="320" height="110" rx="4" fill="#020617"/>

        <!-- TP-Link & Omada Logo -->
        <text x="55" y="96" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#14b8a6">tp-link</text>
        <circle cx="115" cy="92" r="3" fill="#14b8a6"/>
        <text x="125" y="96" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff">omada</text>
        <text x="55" y="112" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8">ER7206 • Multi-WAN VPN Router</text>

        <!-- Status LEDs -->
        <g transform="translate(55, 125)">
          <circle cx="0" cy="0" r="3" fill="#10b981"/>
          <circle cx="10" cy="0" r="3" fill="#10b981"/>
          <circle cx="20" cy="0" r="3" fill="#14b8a6"/>
          <circle cx="30" cy="0" r="3" fill="#38bdf8"/>
          <text x="0" y="12" font-family="system-ui, sans-serif" font-size="6" font-weight="700" fill="#64748b">PWR</text>
          <text x="10" y="12" font-family="system-ui, sans-serif" font-size="6" font-weight="700" fill="#64748b">SYS</text>
          <text x="20" y="12" font-family="system-ui, sans-serif" font-size="6" font-weight="700" fill="#64748b">SFP</text>
          <text x="30" y="12" font-family="system-ui, sans-serif" font-size="6" font-weight="700" fill="#64748b">WAN</text>
        </g>

        <!-- Ports: 1x SFP WAN + 1x RJ45 WAN + 2x WAN/LAN + 2x LAN -->
        <g transform="translate(140, 105)">
          <!-- 1 SFP WAN Cage -->
          <rect x="0" y="0" width="16" height="38" rx="2" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5"/>
          <text x="8" y="48" font-family="system-ui, sans-serif" font-size="6" font-weight="800" fill="#14b8a6" text-anchor="middle">SFP</text>

          <!-- 5 RJ45 Gigabit Ports -->
          ${[
            { label: 'WAN', color: '#38bdf8' },
            { label: 'WAN/L', color: '#10b981' },
            { label: 'WAN/L', color: '#10b981' },
            { label: 'LAN', color: '#94a3b8' },
            { label: 'LAN', color: '#94a3b8' }
          ].map((pt, i) => `
            <g transform="translate(${i * 32 + 30}, 6)">
              <rect x="0" y="0" width="22" height="26" rx="2" fill="#0f172a" stroke="${pt.color}" stroke-width="1.5"/>
              <circle cx="11" cy="-4" r="1.5" fill="${pt.color}"/>
              <text x="11" y="38" font-family="system-ui, sans-serif" font-size="6" font-weight="800" fill="${pt.color}" text-anchor="middle">${pt.label}</text>
            </g>
          `).join('')}
        </g>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="225" rx="180" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
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

  console.log('Todas las imágenes WebP de Lote 27 fueron creadas exitosamente.');
}

run().catch(err => {
  console.error('Error generando imágenes:', err);
  process.exit(1);
});
