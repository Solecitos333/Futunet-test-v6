const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'cisco-catalyst-9200l-24p-4x-switch.webp',
    brand: 'Cisco',
    brandBadge: 'CISCO CATALYST LAYER 3 GIGABIT POE+',
    badgeColor: '#0284c7',
    model: 'Cisco Catalyst 9200L 24P',
    subtitle: 'Switch Administrable Layer 3 • 24P Gigabit PoE+ (370W) + 4 Uplinks 10G SFP+',
    specs: [
      '24 Puertos Gigabit 10/100/1000 con PoE+ (Presupuesto 370W)',
      '4 Enlaces de Fibra Troncal 10G SFP+ Fijos de Alta Capacidad',
      'Enrutamiento Layer 3 Completo (OSPF, RIP, EIGRP Stub)',
      'Garantía Oficial Cisco Enhanced Limited Lifetime (E-LLW)'
    ],
    priceTag: 'RD$ 145,000.00',
    warranty: 'Garantía Corporativa Oficial Cisco Systems en RD',
    accentColor: '#0284c7',
    iconType: 'cisco_switch'
  },
  {
    fileName: 'ubiquiti-unifi-u6-enterprise-ap.webp',
    brand: 'Ubiquiti',
    brandBadge: 'UBIQUITI UNIFI 6E ULTRA HIGH DENSITY',
    badgeColor: '#2563eb',
    model: 'UniFi U6 Enterprise',
    subtitle: 'Punto de Acceso Wi-Fi 6E Tri-Banda • 10.2 Gbps Agregados • Puerto 2.5 GbE PoE+',
    specs: [
      'Tecnología Tri-Banda Wi-Fi 6E (6 GHz, 5 GHz y 2.4 GHz)',
      'Tasa de Transferencia Agregada de 10.2 Gbps Ultrarrápida',
      'Puerto de Enlace Ascendente 2.5 GbE con Alimentación PoE+',
      'Capacidad de más de 600 Clientes Concurrentes por AP'
    ],
    priceTag: 'RD$ 24,900.00',
    warranty: 'Garantía Oficial Ubiquiti Networks en Santiago',
    accentColor: '#3b82f6',
    iconType: 'ubiquiti_ap'
  },
  {
    fileName: 'mikrotik-ccr2004-16g-2s-router.webp',
    brand: 'MikroTik',
    brandBadge: 'MIKROTIK CLOUD CORE ROUTER PASSIVE',
    badgeColor: '#b45309',
    model: 'MikroTik CCR2004-16G-2S+PC',
    subtitle: 'Router de Borde de Alta Densidad • 16x GbE + 2x 10G SFP+ • Silencioso 0 dB',
    specs: [
      'Procesador Quad-Core Annapurna Labs AL32400 a 1.7 GHz',
      '16 Puertos Gigabit Ethernet + 2 Bahías de Fibra 10G SFP+',
      'Refrigeración Pasiva 100% Silenciosa (0 dB) con Chasis Disipador',
      'Sistema Operativo RouterOS v7 con Licencia Nivel 6 Completa'
    ],
    priceTag: 'RD$ 42,500.00',
    warranty: 'Garantía Oficial MikroTik RouterBoard en RD',
    accentColor: '#f59e0b',
    iconType: 'mikrotik_router'
  },
  {
    fileName: 'tplink-omada-eap670-wifi6-ap.webp',
    brand: 'TP-Link',
    brandBadge: 'TP-LINK OMADA AX5400 CEILING MOUNT',
    badgeColor: '#0d9488',
    model: 'TP-Link Omada EAP670',
    subtitle: 'Punto de Acceso Wi-Fi 6 AX5400 • Puerto 2.5 GbE PoE+ • Ancho de Canal 160 MHz',
    specs: [
      'Velocidad Inalámbrica Ultrarrápida AX5400 (4804 Mbps 5G + 574 Mbps 2.4G)',
      'Canal HE160 de 160 MHz para Máximo Rendimiento Wi-Fi 6',
      'Puerto de Red 2.5 Gbps PoE+ para Eliminar Cuellos de Botella',
      'Gestión Centralizada en la Nube mediante Controlador Omada SDN'
    ],
    priceTag: 'RD$ 13,800.00',
    warranty: 'Garantía Oficial TP-Link en República Dominicana',
    accentColor: '#14b8a6',
    iconType: 'tplink_ap'
  },
  {
    fileName: 'epson-powerlite-l530u-proyector-laser.webp',
    brand: 'Epson',
    brandBadge: 'EPSON 3LCD LASER CORPORATE DISPLAY',
    badgeColor: '#4338ca',
    model: 'Epson PowerLite L530U',
    subtitle: 'Proyector Láser Corporativo 5,200 Lúmenes • WUXGA Full HD • Fuente 20,000 Horas',
    specs: [
      'Tecnología 3LCD de 3 Chips con 5,200 Lúmenes en Blanco y Color',
      'Resolución Nativa WUXGA Full HD (1920 x 1200) Formato 16:10',
      'Fuente de Luz Láser de Estado Sólido de 20,000 Horas sin Lámpara',
      'Tamaño de Proyección desde 50 hasta 500 Pulgadas con Zoom 1.6x'
    ],
    priceTag: 'RD$ 115,000.00',
    warranty: 'Garantía Oficial Epson de 3 Años con Soporte en RD',
    accentColor: '#6366f1',
    iconType: 'epson_projector'
  },
  {
    fileName: 'apc-easy-ups-srv-6kva-rack-online.webp',
    brand: 'Schneider Electric',
    brandBadge: 'APC BY SCHNEIDER ELECTRIC ONLINE UPS',
    badgeColor: '#15803d',
    model: 'APC Easy UPS SRV 6kVA Rack',
    subtitle: 'UPS Online Doble Conversión 6000VA / 6kW • 208/240V 4U • Tarjeta de Red SNMP',
    specs: [
      'Tecnología Online de Doble Conversión con 0 ms de Transferencia',
      'Capacidad de Potencia de 6,000 VA / 6,000 W (Factor de Potencia 1.0)',
      'Formato para Rack de 4U con Bypass Automático y Manual',
      'Tarjeta de Gestión de Red SNMP / Web para Monitoreo Remoto'
    ],
    priceTag: 'RD$ 168,000.00',
    warranty: 'Garantía Oficial Schneider Electric de 2 Años en RD',
    accentColor: '#22c55e',
    iconType: 'apc_ups'
  }
];

function generateSvg(p) {
  let illustration = '';

  if (p.iconType === 'cisco_switch') {
    illustration = `
      <!-- Cisco Catalyst 9200L 24P Switch 1U Rack Chassis -->
      <g transform="translate(230, 240)">
        <rect x="20" y="70" width="360" height="90" rx="6" fill="#0f172a" stroke="${p.accentColor}" stroke-width="3"/>
        <rect x="25" y="75" width="350" height="80" rx="4" fill="#1e293b"/>
        
        <!-- Rack Mount Ears -->
        <rect x="6" y="65" width="14" height="100" rx="3" fill="#334155" stroke="#475569" stroke-width="1.5"/>
        <circle cx="13" cy="78" r="3" fill="#0f172a"/>
        <circle cx="13" cy="152" r="3" fill="#0f172a"/>
        <rect x="380" y="65" width="14" height="100" rx="3" fill="#334155" stroke="#475569" stroke-width="1.5"/>
        <circle cx="387" cy="78" r="3" fill="#0f172a"/>
        <circle cx="387" cy="152" r="3" fill="#0f172a"/>

        <!-- Cisco Brand mark and LED Status -->
        <text x="45" y="96" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#38bdf8">CISCO</text>
        <text x="45" y="108" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8">Catalyst 9200L PoE+</text>
        <circle cx="45" cy="125" r="4" fill="#22c55e"/>
        <circle cx="58" cy="125" r="4" fill="#22c55e"/>
        <circle cx="71" cy="125" r="4" fill="#38bdf8"/>
        <circle cx="84" cy="125" r="4" fill="#f59e0b"/>

        <!-- 24 Gigabit Ethernet Ports Matrix (2 rows of 12) -->
        <g transform="translate(105, 90)">
          <!-- Top row (12 ports) -->
          <rect x="0" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="16" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="32" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="48" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="68" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="84" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="100" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="116" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="136" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="152" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="168" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="184" y="0" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>

          <!-- Bottom row (12 ports) -->
          <rect x="0" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="16" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="32" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="48" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="68" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="84" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="100" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="116" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="136" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="152" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="168" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>
          <rect x="184" y="18" width="12" height="14" rx="2" fill="#020617" stroke="#0284c7" stroke-width="1"/>

          <!-- Port Activity LEDs -->
          <circle cx="6" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="22" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="38" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="54" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="74" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="90" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="106" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="122" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="142" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="158" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="174" cy="-4" r="1.5" fill="#22c55e"/>
          <circle cx="190" cy="-4" r="1.5" fill="#22c55e"/>
        </g>

        <!-- 4x 10G SFP+ Uplink Ports -->
        <g transform="translate(315, 90)">
          <rect x="0" y="0" width="22" height="15" rx="2" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
          <rect x="26" y="0" width="22" height="15" rx="2" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
          <rect x="0" y="17" width="22" height="15" rx="2" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
          <rect x="26" y="17" width="22" height="15" rx="2" fill="#020617" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="24" y="42" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#f59e0b" text-anchor="middle">4x 10G SFP+</text>
        </g>

        <!-- Ambient Rack Glow -->
        <ellipse cx="200" cy="180" rx="170" ry="14" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'ubiquiti_ap') {
    illustration = `
      <!-- Ubiquiti UniFi U6 Enterprise Circular Dome AP -->
      <g transform="translate(240, 230)">
        <!-- Outer Dome Ring -->
        <circle cx="200" cy="120" r="105" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <circle cx="200" cy="120" r="98" fill="#ffffff"/>
        
        <!-- Subtle concentric contours -->
        <circle cx="200" cy="120" r="80" fill="none" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="200" cy="120" r="60" fill="none" stroke="#f1f5f9" stroke-width="2"/>

        <!-- Iconic UniFi Center Glow Ring (Electric Blue for Wi-Fi 6E) -->
        <circle cx="200" cy="120" r="38" fill="none" stroke="#0284c7" stroke-width="4" filter="drop-shadow(0 0 8px #38bdf8)"/>
        <circle cx="200" cy="120" r="30" fill="#0f172a"/>
        
        <!-- UniFi "U" Logo Mark -->
        <text x="200" y="128" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#38bdf8" text-anchor="middle">U</text>

        <!-- Wi-Fi 6E Tri-Band Badge Under AP -->
        <rect x="140" y="180" width="120" height="26" rx="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="200" y="197" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">Wi-Fi 6E • 10.2 Gbps</text>

        <!-- Radio Waves Radiating -->
        <path d="M70 120 A130 130 0 0 1 330 120" fill="none" stroke="${p.accentColor}" stroke-width="3" stroke-dasharray="8,6" opacity="0.6"/>
        <path d="M50 120 A150 150 0 0 1 350 120" fill="none" stroke="${p.accentColor}" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>

        <!-- Ceiling Glow -->
        <ellipse cx="200" cy="240" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'mikrotik_router') {
    illustration = `
      <!-- MikroTik CCR2004-16G-2S+PC Fanless Router -->
      <g transform="translate(230, 235)">
        <!-- Heavy Aluminium Heatsink Fins (Top) -->
        <g fill="#475569">
          <rect x="50" y="45" width="6" height="20" rx="1"/>
          <rect x="65" y="45" width="6" height="20" rx="1"/>
          <rect x="80" y="45" width="6" height="20" rx="1"/>
          <rect x="95" y="45" width="6" height="20" rx="1"/>
          <rect x="110" y="45" width="6" height="20" rx="1"/>
          <rect x="125" y="45" width="6" height="20" rx="1"/>
          <rect x="140" y="45" width="6" height="20" rx="1"/>
          <rect x="155" y="45" width="6" height="20" rx="1"/>
          <rect x="170" y="45" width="6" height="20" rx="1"/>
          <rect x="185" y="45" width="6" height="20" rx="1"/>
          <rect x="200" y="45" width="6" height="20" rx="1"/>
          <rect x="215" y="45" width="6" height="20" rx="1"/>
          <rect x="230" y="45" width="6" height="20" rx="1"/>
          <rect x="245" y="45" width="6" height="20" rx="1"/>
          <rect x="260" y="45" width="6" height="20" rx="1"/>
          <rect x="275" y="45" width="6" height="20" rx="1"/>
          <rect x="290" y="45" width="6" height="20" rx="1"/>
          <rect x="305" y="45" width="6" height="20" rx="1"/>
          <rect x="320" y="45" width="6" height="20" rx="1"/>
          <rect x="335" y="45" width="6" height="20" rx="1"/>
        </g>

        <!-- Router Metal Case -->
        <rect x="30" y="65" width="340" height="95" rx="6" fill="#0f172a" stroke="${p.accentColor}" stroke-width="3"/>
        <rect x="36" y="71" width="328" height="83" rx="4" fill="#1e293b"/>

        <!-- MikroTik Branding & White Case Identity -->
        <text x="55" y="96" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#f59e0b">MikroTik</text>
        <text x="55" y="108" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8">CCR2004-16G-2S+PC</text>
        <text x="55" y="130" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#22c55e">PASSIVE 0 dB</text>

        <!-- 16 Gigabit Ethernet Ports (2 blocks of 8) -->
        <g transform="translate(130, 85)">
          <rect x="0" y="0" width="90" height="42" rx="3" fill="#020617" stroke="#334155" stroke-width="1.5"/>
          <!-- 8 ports in 2 rows -->
          <g fill="#0f172a" stroke="#f59e0b" stroke-width="1">
            <rect x="5" y="4" width="16" height="14" rx="2"/>
            <rect x="26" y="4" width="16" height="14" rx="2"/>
            <rect x="47" y="4" width="16" height="14" rx="2"/>
            <rect x="68" y="4" width="16" height="14" rx="2"/>
            <rect x="5" y="22" width="16" height="14" rx="2"/>
            <rect x="26" y="22" width="16" height="14" rx="2"/>
            <rect x="47" y="22" width="16" height="14" rx="2"/>
            <rect x="68" y="22" width="16" height="14" rx="2"/>
          </g>

          <rect x="100" y="0" width="90" height="42" rx="3" fill="#020617" stroke="#334155" stroke-width="1.5"/>
          <g fill="#0f172a" stroke="#f59e0b" stroke-width="1">
            <rect x="105" y="4" width="16" height="14" rx="2"/>
            <rect x="126" y="4" width="16" height="14" rx="2"/>
            <rect x="147" y="4" width="16" height="14" rx="2"/>
            <rect x="168" y="4" width="16" height="14" rx="2"/>
            <rect x="105" y="22" width="16" height="14" rx="2"/>
            <rect x="126" y="22" width="16" height="14" rx="2"/>
            <rect x="147" y="22" width="16" height="14" rx="2"/>
            <rect x="168" y="22" width="16" height="14" rx="2"/>
          </g>
        </g>

        <!-- 2x 10G SFP+ Cages -->
        <g transform="translate(330, 85)">
          <rect x="0" y="0" width="26" height="18" rx="2" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="0" y="22" width="26" height="18" rx="2" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="13" y="47" font-family="system-ui, sans-serif" font-size="6" font-weight="700" fill="#38bdf8" text-anchor="middle">10G SFP+</text>
        </g>

        <!-- Desktop Glow -->
        <ellipse cx="200" cy="180" rx="170" ry="14" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'tplink_ap') {
    illustration = `
      <!-- TP-Link Omada EAP670 Sleek Round Ceiling AP -->
      <g transform="translate(240, 230)">
        <!-- Outer Disk -->
        <circle cx="200" cy="120" r="105" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <circle cx="200" cy="120" r="96" fill="#ffffff"/>

        <!-- Subtle geometric vents -->
        <circle cx="200" cy="120" r="75" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="8,6"/>

        <!-- Center Inset with TP-Link / Omada Logo -->
        <circle cx="200" cy="120" r="42" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="200" cy="120" r="32" fill="#0f172a"/>
        <text x="200" y="117" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#14b8a6" text-anchor="middle">omada</text>
        <text x="200" y="128" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#94a3b8" text-anchor="middle">TP-Link</text>

        <!-- Soft status LED bar -->
        <rect x="180" y="142" width="40" height="4" rx="2" fill="#14b8a6"/>

        <!-- Spec Pill -->
        <rect x="135" y="180" width="130" height="26" rx="6" fill="#0d9488" stroke="#14b8a6" stroke-width="1.5"/>
        <text x="200" y="197" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">AX5400 • 2.5G Port</text>

        <!-- Wi-Fi Propagation Waves -->
        <path d="M70 120 A130 130 0 0 1 330 120" fill="none" stroke="${p.accentColor}" stroke-width="3" stroke-dasharray="6,6" opacity="0.5"/>
        <path d="M50 120 A150 150 0 0 1 350 120" fill="none" stroke="${p.accentColor}" stroke-width="2" stroke-dasharray="4,6" opacity="0.3"/>

        <!-- Ceiling Glow -->
        <ellipse cx="200" cy="240" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'epson_projector') {
    illustration = `
      <!-- Epson PowerLite L530U Laser Projector -->
      <g transform="translate(230, 230)">
        <!-- Projector Main Chassis (Matte White Corporate Box) -->
        <rect x="40" y="60" width="320" height="110" rx="12" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="48" y="68" width="304" height="94" rx="8" fill="#e2e8f0"/>

        <!-- High-Precision Glass Laser Lens (Left) -->
        <circle cx="110" cy="115" r="38" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
        <circle cx="110" cy="115" r="30" fill="#1e293b"/>
        <!-- Multi-coated glass reflection (Cyan/Violet laser glow) -->
        <circle cx="110" cy="115" r="22" fill="#0284c7" fill-opacity="0.6"/>
        <circle cx="110" cy="115" r="14" fill="#6366f1" fill-opacity="0.8"/>
        <circle cx="106" cy="111" r="5" fill="#ffffff"/>

        <!-- Laser Light Beam (Powerful 5,200 Lumens Cone) -->
        <path d="M72 115 L-60 60 L-60 170 Z" fill="url(#laserGrad)" opacity="0.45"/>

        <!-- Top Focus / Zoom Rings Recess -->
        <rect x="90" y="52" width="40" height="14" rx="2" fill="#334155"/>
        <line x1="98" y1="52" x2="98" y2="66" stroke="#64748b" stroke-width="1.5"/>
        <line x1="106" y1="52" x2="106" y2="66" stroke="#64748b" stroke-width="1.5"/>
        <line x1="114" y1="52" x2="114" y2="66" stroke="#64748b" stroke-width="1.5"/>
        <line x1="122" y1="52" x2="122" y2="66" stroke="#64748b" stroke-width="1.5"/>

        <!-- Ventilation Louvers / Heat Dissipation (Right) -->
        <g stroke="#94a3b8" stroke-width="2">
          <line x1="175" y1="85" x2="270" y2="85"/>
          <line x1="175" y1="95" x2="270" y2="95"/>
          <line x1="175" y1="105" x2="270" y2="105"/>
          <line x1="175" y1="115" x2="270" y2="115"/>
          <line x1="175" y1="125" x2="270" y2="125"/>
          <line x1="175" y1="135" x2="270" y2="135"/>
        </g>

        <!-- Epson Logo & Laser Badge -->
        <text x="290" y="95" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#0f172a">EPSON</text>
        <text x="290" y="112" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#4338ca">3LCD LASER</text>
        <text x="290" y="125" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#22c55e">5,200 lm</text>

        <!-- Projector Feet -->
        <rect x="70" y="170" width="16" height="8" rx="2" fill="#334155"/>
        <rect x="315" y="170" width="16" height="8" rx="2" fill="#334155"/>

        <!-- Table Glow -->
        <ellipse cx="200" cy="190" rx="160" ry="14" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'apc_ups') {
    illustration = `
      <!-- APC by Schneider Electric Easy UPS SRV 6kVA 4U Rack Chassis -->
      <g transform="translate(230, 230)">
        <!-- 4U Rack Housing -->
        <rect x="20" y="45" width="360" height="135" rx="6" fill="#0f172a" stroke="${p.accentColor}" stroke-width="3"/>
        <rect x="26" y="51" width="348" height="123" rx="4" fill="#1e293b"/>

        <!-- Rack Mount Brackets -->
        <rect x="6" y="40" width="14" height="145" rx="3" fill="#334155" stroke="#475569" stroke-width="1.5"/>
        <circle cx="13" cy="55" r="3" fill="#0f172a"/>
        <circle cx="13" cy="112" r="3" fill="#0f172a"/>
        <circle cx="13" cy="170" r="3" fill="#0f172a"/>
        <rect x="380" y="40" width="14" height="145" rx="3" fill="#334155" stroke="#475569" stroke-width="1.5"/>
        <circle cx="387" cy="55" r="3" fill="#0f172a"/>
        <circle cx="387" cy="112" r="3" fill="#0f172a"/>
        <circle cx="387" cy="170" r="3" fill="#0f172a"/>

        <!-- High-Contrast Multi-function LCD Display (Left) -->
        <rect x="42" y="70" width="105" height="75" rx="4" fill="#020617" stroke="${p.accentColor}" stroke-width="2"/>
        <text x="94" y="88" font-family="system-ui, sans-serif" font-size="9" font-weight="900" fill="#22c55e" text-anchor="middle">ONLINE 208V</text>
        <text x="94" y="103" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#38bdf8" text-anchor="middle">6.0 kVA</text>
        <text x="94" y="117" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#cbd5e1" text-anchor="middle">LOAD 42% • BATT 100%</text>
        <text x="94" y="132" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#22c55e" text-anchor="middle">SNMP WEB ACTIVE</text>

        <!-- Navigation Buttons below LCD -->
        <circle cx="56" cy="155" r="4" fill="#334155"/>
        <circle cx="72" cy="155" r="4" fill="#334155"/>
        <circle cx="88" cy="155" r="4" fill="#334155"/>
        <circle cx="104" cy="155" r="4" fill="#334155"/>

        <!-- Ventilation Louvers & High-Capacity Battery Pack Module (Right) -->
        <g stroke="#334155" stroke-width="2">
          <line x1="165" y1="70" x2="350" y2="70"/>
          <line x1="165" y1="82" x2="350" y2="82"/>
          <line x1="165" y1="94" x2="350" y2="94"/>
          <line x1="165" y1="106" x2="350" y2="106"/>
          <line x1="165" y1="118" x2="350" y2="118"/>
          <line x1="165" y1="130" x2="350" y2="130"/>
          <line x1="165" y1="142" x2="350" y2="142"/>
        </g>

        <!-- APC Brand Badge -->
        <rect x="240" y="56" width="115" height="24" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
        <text x="297" y="72" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">APC by Schneider</text>

        <!-- Rack Glow -->
        <ellipse cx="200" cy="195" rx="170" ry="14" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 850" width="850" height="850">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#050b14"/>
          <stop offset="50%" stop-color="#0b1728"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="laserGrad" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.9"/>
          <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </linearGradient>
        <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.75" opacity="0.4"/>
        </pattern>
      </defs>

      <!-- Background Base -->
      <rect width="850" height="850" fill="url(#bgGrad)"/>
      <rect width="850" height="850" fill="url(#techGrid)"/>

      <!-- Ambient Glow Behind Device -->
      <circle cx="425" cy="330" r="230" fill="${p.accentColor}" fill-opacity="0.12" filter="blur(50px)"/>

      <!-- Top Header: Brand Badge & Catalog Division -->
      <g transform="translate(56, 50)">
        <!-- Brand Category Pill -->
        <rect x="0" y="0" width="390" height="34" rx="17" fill="${p.badgeColor}" fill-opacity="0.2" stroke="${p.badgeColor}" stroke-width="1.5"/>
        <circle cx="16" cy="17" r="5" fill="${p.badgeColor}"/>
        <text x="30" y="22" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#f8fafc" letter-spacing="1.2">${p.brandBadge}</text>

        <!-- Authorized Distributor Badge -->
        <g transform="translate(490, 0)">
          <rect x="0" y="0" width="248" height="34" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <circle cx="16" cy="17" r="4" fill="#22c55e"/>
          <text x="28" y="21" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#cbd5e1" letter-spacing="1">DISTRIBUIDOR AUTORIZADO</text>
        </g>
      </g>

      <!-- Product Visual Illustration -->
      ${illustration}

      <!-- Bottom Card Info Container -->
      <g transform="translate(56, 510)">
        <!-- Card Background -->
        <rect x="0" y="0" width="738" height="225" rx="18" fill="#091220" fill-opacity="0.95" stroke="#1e293b" stroke-width="2"/>

        <!-- Title & Subtitle -->
        <text x="24" y="38" font-family="system-ui, sans-serif" font-size="23" font-weight="900" fill="#ffffff">${p.model}</text>
        <text x="24" y="62" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#94a3b8">${p.subtitle}</text>

        <!-- Divider Line -->
        <line x1="24" y1="76" x2="714" y2="76" stroke="#1e293b" stroke-width="1.5"/>

        <!-- 4 Bullet Specifications Grid -->
        <g transform="translate(24, 88)">
          <!-- Spec 1 -->
          <circle cx="8" cy="18" r="5" fill="${p.accentColor}"/>
          <text x="24" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#f1f5f9">${p.specs[0]}</text>

          <!-- Spec 2 -->
          <circle cx="8" cy="54" r="5" fill="${p.accentColor}"/>
          <text x="24" y="58" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#f1f5f9">${p.specs[1]}</text>

          <!-- Spec 3 -->
          <circle cx="8" cy="90" r="5" fill="${p.accentColor}"/>
          <text x="24" y="94" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#f1f5f9">${p.specs[2]}</text>

          <!-- Spec 4 -->
          <circle cx="8" cy="126" r="5" fill="${p.accentColor}"/>
          <text x="24" y="130" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#f1f5f9">${p.specs[3]}</text>
        </g>
      </g>

      <!-- Footer Bar: Price, Stock & Warranty -->
      <g transform="translate(56, 755)">
        <!-- Price Pill -->
        <rect x="0" y="0" width="280" height="65" rx="14" fill="#0284c7" fill-opacity="0.15" stroke="#0284c7" stroke-width="2"/>
        <text x="20" y="25" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#38bdf8" letter-spacing="1">PRECIO DE REFERENCIA RD</text>
        <text x="20" y="52" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#ffffff">${p.priceTag}</text>

        <!-- Stock and Delivery Badge -->
        <g transform="translate(296, 0)">
          <rect x="0" y="0" width="220" height="65" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <circle cx="22" cy="32" r="6" fill="#22c55e"/>
          <text x="36" y="28" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#22c55e">DISPONIBLE EN STOCK</text>
          <text x="36" y="48" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#cbd5e1">Envío a Todo el Cibao y RD</text>
        </g>

        <!-- Warranty Badge -->
        <g transform="translate(532, 0)">
          <rect x="0" y="0" width="236" height="65" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <circle cx="20" cy="32" r="6" fill="#eab308"/>
          <text x="34" y="28" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#eab308">GARANTÍA CORPORATIVA</text>
          <text x="34" y="47" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#cbd5e1">Soporte Técnico Especializado</text>
        </g>
      </g>
    </svg>
  `;
}

async function run() {
  console.log(`Generando ${products.length} imágenes WebP de catálogo en alta resolución para Lote 31...`);

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

  console.log('Todas las imágenes WebP de Lote 31 fueron creadas exitosamente.');
}

run().catch(err => {
  console.error('Error generando imágenes:', err);
  process.exit(1);
});
