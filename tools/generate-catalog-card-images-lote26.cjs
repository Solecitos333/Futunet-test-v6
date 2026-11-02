const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'linksys-lgs328pc-switch-smart-poe.webp',
    brand: 'Linksys',
    brandBadge: 'LINKSYS BUSINESS SMART MANAGED',
    badgeColor: '#0284c7',
    model: 'Linksys LGS328PC 24P PoE+',
    subtitle: 'Switch Smart Administrable 24 Puertos PoE+ (250W) + 4x 10G SFP+',
    specs: [
      '24 Puertos Gigabit PoE+ (Presupuesto total 250 Watts)',
      '4 Puertos Uplink 10G SFP+ para Enlaces de Alta Velocidad',
      'VLAN 802.1Q • QoS Avanzado • Enrutamiento Estático IPv4/IPv6',
      'Gestión Web Segura • Port Security • IGMP Snooping'
    ],
    priceTag: 'RD$ 22,850.00',
    warranty: 'Garantía Corporativa Linksys ProSupport',
    accentColor: '#0284c7',
    iconType: 'switch'
  },
  {
    fileName: 'mitsubishi-msz-gl09-aire-inverter.webp',
    brand: 'Mitsubishi Electric',
    brandBadge: 'MITSUBISHI ELECTRIC INVERTER',
    badgeColor: '#dc2626',
    model: 'Mitsubishi Electric MSZ-GL 9K',
    subtitle: 'Aire Acondicionado Inverter 9,000 BTU Ultra Silencioso 24.6 SEER',
    specs: [
      'Capacidad 9,000 BTU/h Inverter de Ultra Alta Eficiencia',
      'Certificación 24.6 SEER • Ahorro Energético de hasta 65%',
      'Operación Ultra Silenciosa 19 dB • Filtro Nano-Platinum',
      'Auto-Reinicio tras Fallo de Energía • Modo Econocool'
    ],
    priceTag: 'RD$ 38,900.00',
    warranty: '5 Años Garantía Compresor Mitsubishi Electric',
    accentColor: '#059669',
    iconType: 'ac'
  },
  {
    fileName: 'panasonic-kx-hdv430-telefono-ip-video.webp',
    brand: 'Panasonic',
    brandBadge: 'PANASONIC HD IP COMMUNICATIONS',
    badgeColor: '#2563eb',
    model: 'Panasonic KX-HDV430 Video IP',
    subtitle: 'Teléfono IP Ejecutivo con Cámara HD y Pantalla Táctil 4.3"',
    specs: [
      'Pantalla Táctil Color 4.3" • Cámara de Video HD Integrada',
      'Hasta 16 Cuentas SIP Simultáneas • Audio Sonic HD Full Duplex',
      'Doble Puerto Gigabit Ethernet con Alimentación PoE (802.3af)',
      'Bluetooth Integrado • Integración con PBX KX-NS500'
    ],
    priceTag: 'RD$ 15,900.00',
    warranty: 'Garantía Oficial Panasonic Dominicana',
    accentColor: '#3b82f6',
    iconType: 'ipphone'
  },
  {
    fileName: 'paradox-evo192-panel-seguridad-alarma.webp',
    brand: 'Paradox',
    brandBadge: 'PARADOX DIGIPLEX HIGH SECURITY',
    badgeColor: '#d97706',
    model: 'Paradox EVO192 Grado 3',
    subtitle: 'Central de Alarma y Control de Acceso 192 Zonas / 8 Particiones',
    specs: [
      'Hasta 192 Zonas Direccionables Multiplexadas y 8 Particiones',
      'Control de Acceso Integrado para 32 Puertas y 999 Usuarios',
      'Bus de Supervisión Multiplexado • Certificación Grado 3 Bancaria',
      'Compatible con App BlueEye, Módulo IP150+ y Teclado TM70'
    ],
    priceTag: 'RD$ 18,500.00',
    warranty: 'Garantía Oficial Paradox Security Systems',
    accentColor: '#f59e0b',
    iconType: 'alarm'
  },
  {
    fileName: 'siemens-sirius-3rw30-arrancador-suave.webp',
    brand: 'Siemens',
    brandBadge: 'SIEMENS SIRIUS INDUSTRIAL CONTROL',
    badgeColor: '#0d9488',
    model: 'Siemens Sirius 3RW30 (15 kW)',
    subtitle: 'Arrancador Suave Electrónico 32A / 20 HP para Motores Trifásicos',
    specs: [
      'Potencia 15 kW / 20 HP (32A) para Motores Trifásicos 200-480V',
      'Contactos de Bypass Integrados para Mínima Disipación Térmica',
      'Reducción de Picos de Corriente hasta 60% • Sin Golpe de Ariete',
      'Tensión de Control 110-230V AC/DC • Montaje en Riel DIN'
    ],
    priceTag: 'RD$ 19,850.00',
    warranty: 'Garantía Oficial Siemens Industrial',
    accentColor: '#0d9488',
    iconType: 'softstarter'
  }
];

function generateSvg(p) {
  let illustration = '';
  if (p.iconType === 'switch') {
    illustration = `
      <!-- Switch 24P PoE+ illustration -->
      <g transform="translate(240, 260)">
        <!-- Rack unit body -->
        <rect x="10" y="50" width="380" height="150" rx="10" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="22" y="62" width="356" height="126" rx="6" fill="#1e293b"/>
        
        <!-- Rack ears -->
        <rect x="0" y="60" width="10" height="130" rx="3" fill="#334155"/>
        <circle cx="5" cy="80" r="3" fill="#0f172a"/>
        <circle cx="5" cy="170" r="3" fill="#0f172a"/>
        <rect x="390" y="60" width="10" height="130" rx="3" fill="#334155"/>
        <circle cx="395" cy="80" r="3" fill="#0f172a"/>
        <circle cx="395" cy="170" r="3" fill="#0f172a"/>

        <!-- Brand / Model label -->
        <text x="36" y="86" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#38bdf8">LINKSYS</text>
        <text x="96" y="86" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#94a3b8">LGS328PC • 24G PoE+ (250W)</text>

        <!-- Status LEDs -->
        <circle cx="36" cy="104" r="3" fill="#10b981"/>
        <circle cx="48" cy="104" r="3" fill="#38bdf8"/>
        <circle cx="60" cy="104" r="3" fill="#f59e0b"/>

        <!-- 24 RJ45 Ports Matrix -->
        <g transform="translate(36, 120)">
          <!-- Top row 12 ports -->
          ${Array.from({ length: 12 }).map((_, i) => `
            <rect x="${i * 20}" y="0" width="16" height="18" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
            <circle cx="${i * 20 + 8}" cy="-4" r="1.5" fill="#10b981"/>
          `).join('')}
          <!-- Bottom row 12 ports -->
          ${Array.from({ length: 12 }).map((_, i) => `
            <rect x="${i * 20}" y="24" width="16" height="18" rx="2" fill="#020617" stroke="#475569" stroke-width="1"/>
            <circle cx="${i * 20 + 8}" cy="46" r="1.5" fill="#10b981"/>
          `).join('')}
        </g>

        <!-- 4 SFP+ 10G Cages -->
        <g transform="translate(290, 116)">
          <rect x="0" y="0" width="18" height="46" rx="3" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="22" y="0" width="18" height="46" rx="3" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="44" y="0" width="18" height="46" rx="3" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="66" y="0" width="18" height="46" rx="3" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="42" y="60" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#38bdf8" text-anchor="middle">4x 10G SFP+</text>
        </g>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="225" rx="180" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'ac') {
    illustration = `
      <!-- Mitsubishi Mini-Split Inverter Unit -->
      <g transform="translate(240, 250)">
        <!-- AC Indoor Chassis -->
        <rect x="20" y="40" width="360" height="150" rx="14" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="30" y="50" width="340" height="130" rx="10" fill="#f1f5f9"/>

        <!-- Front Panel Gloss & Lines -->
        <path d="M 30 70 L 370 70" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M 30 145 L 370 145" stroke="#cbd5e1" stroke-width="3"/>

        <!-- Air Discharge Vane -->
        <rect x="40" y="152" width="320" height="18" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>

        <!-- Mitsubishi Logo Three Diamonds -->
        <g transform="translate(50, 85)">
          <polygon points="12,0 6,10 18,10" fill="#dc2626"/>
          <polygon points="6,10 0,20 12,20" fill="#dc2626"/>
          <polygon points="18,10 12,20 24,20" fill="#dc2626"/>
        </g>
        <text x="80" y="100" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#0f172a">MITSUBISHI ELECTRIC</text>
        <text x="80" y="116" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#64748b">INVERTER MSZ-GL • NANO PLATINUM</text>

        <!-- Digital Temp Display -->
        <rect x="290" y="80" width="65" height="42" rx="6" fill="#0f172a"/>
        <text x="318" y="108" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#10b981" text-anchor="middle">21°</text>
        <circle cx="338" cy="94" r="2" fill="#10b981"/>

        <!-- Cool airflow waves -->
        <path d="M 60 190 Q 120 230 200 200 T 340 210" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4"/>
        <path d="M 80 210 Q 150 250 240 220 T 320 230" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-dasharray="8 6"/>

        <!-- Reflection -->
        <ellipse cx="200" cy="245" rx="170" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'ipphone') {
    illustration = `
      <!-- Panasonic KX-HDV430 IP Video Phone -->
      <g transform="translate(240, 240)">
        <!-- Base body -->
        <rect x="60" y="40" width="280" height="200" rx="16" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="72" y="52" width="256" height="176" rx="10" fill="#1e293b"/>

        <!-- Color Touch Screen with Video -->
        <rect x="88" y="64" width="140" height="100" rx="6" fill="#020617" stroke="#3b82f6" stroke-width="2"/>
        
        <!-- Video Caller Preview -->
        <circle cx="158" cy="100" r="22" fill="#334155"/>
        <circle cx="158" cy="94" r="10" fill="#94a3b8"/>
        <path d="M 144 116 Q 158 106 172 116 Z" fill="#94a3b8"/>
        <text x="158" y="132" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="#38bdf8" text-anchor="middle">HD VIDEO CALL • 1080P</text>
        <text x="158" y="148" font-family="system-ui, sans-serif" font-size="8" font-weight="600" fill="#94a3b8" text-anchor="middle">KX-HDV430 • 16 SIP</text>

        <!-- Camera lens top of screen -->
        <circle cx="158" cy="56" r="6" fill="#090d16" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="158" cy="56" r="2.5" fill="#38bdf8"/>

        <!-- Softkeys / Function buttons -->
        <g transform="translate(88, 172)">
          <rect x="0" y="0" width="28" height="12" rx="3" fill="#334155"/>
          <rect x="36" y="0" width="28" height="12" rx="3" fill="#334155"/>
          <rect x="72" y="0" width="28" height="12" rx="3" fill="#334155"/>
          <rect x="108" y="0" width="28" height="12" rx="3" fill="#334155"/>
        </g>

        <!-- Keypad matrix right side -->
        <g transform="translate(242, 68)">
          ${[0, 1, 2, 3].map(row => 
            [0, 1, 2].map(col => `
              <rect x="${col * 22}" y="${row * 24}" width="18" height="18" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
              <circle cx="${col * 22 + 9}" cy="${row * 24 + 9}" r="2" fill="#94a3b8"/>
            `).join('')
          ).join('')}
        </g>

        <!-- Handset on the left -->
        <rect x="30" y="30" width="36" height="220" rx="18" fill="#1e293b" stroke="#334155" stroke-width="3"/>
        <rect x="34" y="36" width="28" height="40" rx="14" fill="#0f172a"/>
        <rect x="34" y="204" width="28" height="40" rx="14" fill="#0f172a"/>

        <!-- Reflection -->
        <ellipse cx="200" cy="265" rx="160" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'alarm') {
    illustration = `
      <!-- Paradox EVO192 Panel illustration -->
      <g transform="translate(240, 240)">
        <!-- Heavy steel enclosure -->
        <rect x="30" y="20" width="340" height="230" rx="12" fill="#1e293b" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="42" y="32" width="316" height="206" rx="8" fill="#0f172a"/>

        <!-- Lock mechanism -->
        <circle cx="340" cy="135" r="8" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
        <rect x="338" y="132" width="4" height="6" fill="#020617"/>

        <!-- PCB inside panel -->
        <rect x="56" y="46" width="240" height="178" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        
        <!-- CPU Microcontroller chip -->
        <rect x="140" y="90" width="70" height="70" rx="4" fill="#020617" stroke="#34d399" stroke-width="2"/>
        <text x="175" y="122" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#34d399" text-anchor="middle">PARADOX</text>
        <text x="175" y="138" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#f8fafc" text-anchor="middle">EVO192</text>

        <!-- Multiplexed terminal screw blocks -->
        <g transform="translate(68, 56)">
          ${Array.from({ length: 16 }).map((_, i) => `
            <rect x="${i * 13}" y="0" width="10" height="14" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
            <circle cx="${i * 13 + 5}" cy="7" r="2.5" fill="#f59e0b"/>
          `).join('')}
        </g>
        <g transform="translate(68, 194)">
          ${Array.from({ length: 16 }).map((_, i) => `
            <rect x="${i * 13}" y="0" width="10" height="14" rx="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
            <circle cx="${i * 13 + 5}" cy="7" r="2.5" fill="#f59e0b"/>
          `).join('')}
        </g>

        <!-- Grade 3 Security Seal badge -->
        <g transform="translate(305, 52)">
          <rect x="0" y="0" width="42" height="75" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="21" y="24" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#fbbf24" text-anchor="middle">GRADO</text>
          <text x="21" y="44" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>
          <text x="21" y="62" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#fde68a" text-anchor="middle">EN50131</text>
        </g>

        <!-- Status LEDs -->
        <circle cx="80" cy="90" r="4" fill="#10b981"/>
        <circle cx="80" cy="106" r="4" fill="#38bdf8"/>
        <circle cx="80" cy="122" r="4" fill="#ef4444"/>

        <!-- Reflection -->
        <ellipse cx="200" cy="270" rx="160" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'softstarter') {
    illustration = `
      <!-- Siemens Sirius 3RW30 Soft Starter illustration -->
      <g transform="translate(240, 240)">
        <!-- DIN rail modular body -->
        <rect x="70" y="20" width="260" height="230" rx="10" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="82" y="32" width="236" height="206" rx="6" fill="#134e4a"/>

        <!-- Siemens Brand header -->
        <rect x="82" y="32" width="236" height="36" rx="4" fill="#0d9488"/>
        <text x="200" y="56" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="2" text-anchor="middle">SIEMENS</text>

        <!-- Top Power Terminals 1/L1, 3/L2, 5/L3 -->
        <g transform="translate(105, 76)">
          <rect x="0" y="0" width="50" height="22" rx="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="25" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ccfbf1" text-anchor="middle">1/L1</text>
          <rect x="70" y="0" width="50" height="22" rx="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="95" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ccfbf1" text-anchor="middle">3/L2</text>
          <rect x="140" y="0" width="50" height="22" rx="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="165" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ccfbf1" text-anchor="middle">5/L3</text>
        </g>

        <!-- Center Controls: Rotary potentiometers for ramp & voltage -->
        <g transform="translate(105, 112)">
          <rect x="0" y="0" width="190" height="65" rx="6" fill="#042f2e" stroke="#14b8a6" stroke-width="1"/>
          
          <!-- Potentiometer 1 (Ramp time) -->
          <circle cx="45" cy="32" r="16" fill="#134e4a" stroke="#2dd4bf" stroke-width="2"/>
          <line x1="45" y1="32" x2="55" y2="24" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
          <text x="45" y="58" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#a7f3d0" text-anchor="middle">RAMP (s)</text>

          <!-- Potentiometer 2 (Start voltage) -->
          <circle cx="145" cy="32" r="16" fill="#134e4a" stroke="#2dd4bf" stroke-width="2"/>
          <line x1="145" y1="32" x2="155" y2="40" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
          <text x="145" y="58" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#a7f3d0" text-anchor="middle">VOLT (%)</text>
        </g>

        <!-- Bottom Motor Terminals 2/T1, 4/T2, 6/T3 -->
        <g transform="translate(105, 192)">
          <rect x="0" y="0" width="50" height="22" rx="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="25" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ccfbf1" text-anchor="middle">2/T1</text>
          <rect x="70" y="0" width="50" height="22" rx="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="95" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ccfbf1" text-anchor="middle">4/T2</text>
          <rect x="140" y="0" width="50" height="22" rx="3" fill="#042f2e" stroke="#2dd4bf" stroke-width="1.5"/>
          <text x="165" y="16" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#ccfbf1" text-anchor="middle">6/T3</text>
        </g>

        <!-- Reflection -->
        <ellipse cx="200" cy="265" rx="150" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
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
    <rect x="0" y="0" width="340" height="36" rx="18" fill="#1e293b" stroke="${p.badgeColor}" stroke-width="2"/>
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
