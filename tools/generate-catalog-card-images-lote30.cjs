const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.resolve(__dirname, '../img/productos/catalogo');
const distDir = path.resolve(__dirname, '../dist/img/productos/catalogo');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const products = [
  {
    fileName: 'mitsubishi-pca-m36-piso-techo-inverter.webp',
    brand: 'Mitsubishi Electric',
    brandBadge: 'MITSUBISHI ELECTRIC INVERTER CLIMATE',
    badgeColor: '#dc2626',
    model: 'Mitsubishi Electric PCA-M 36K',
    subtitle: 'Consola Piso-Techo Comercial 36,000 BTU • Compresor Inverter Ultra Silencioso',
    specs: [
      'Capacidad 36,000 BTU/h Inverter de Alta Eficiencia Energética',
      'Instalación Versátil Bajo Techo o Sobre Piso sin Falso Techo',
      'Flujo de Aire Horizontal 12m con 4 Velocidades (37 dB)',
      'Garantía Oficial Mitsubishi Electric 5 Años en Compresor'
    ],
    priceTag: 'RD$ 89,500.00',
    warranty: 'Garantía Oficial Mitsubishi Electric en República Dominicana',
    accentColor: '#ef4444',
    iconType: 'mitsubishi_ac'
  },
  {
    fileName: 'panasonic-kx-hdv800-conferencia-sip.webp',
    brand: 'Panasonic',
    brandBadge: 'PANASONIC ENTERPRISE SIP CONFERENCE',
    badgeColor: '#2563eb',
    model: 'Panasonic KX-HDV800',
    subtitle: 'Teléfono SIP para Salas de Conferencia • Audio HD Full Duplex y Micrófonos 360°',
    specs: [
      'Tecnología OmniSound Full Duplex con Cobertura 360° hasta 30 m²',
      'Conectividad SIP Nativa con Puente de Conferencia 5 Vías',
      'Grabación de Llamadas Directa en Ranura de Tarjeta SD',
      'Pantalla LCD Retroiluminada y Teclado Táctil Intuitivo'
    ],
    priceTag: 'RD$ 34,900.00',
    warranty: 'Garantía Oficial Panasonic con Soporte en Santiago',
    accentColor: '#3b82f6',
    iconType: 'panasonic_conf'
  },
  {
    fileName: 'paradox-nvx80-detector-exterior.webp',
    brand: 'Paradox',
    brandBadge: 'PARADOX COMMERCIAL HIGH-SECURITY SENSOR',
    badgeColor: '#b91c1c',
    model: 'Paradox NVX80 SeeTrue',
    subtitle: 'Detector Exterior Grado Comercial 8 Canales • Inmunidad Mascotas y Pantalla OLED',
    specs: [
      '8 Canales de Sensado (4x PIR + 2x Microondas + 2x Anti-spray)',
      'Tecnología SeeTrue antimascota y pantalla OLED de configuración',
      'Detección perimetral de 15m con protección activa antienmascaramiento',
      'Gabinete resistente intemperie IP55 e integración nativa a paneles EVO'
    ],
    priceTag: 'RD$ 19,800.00',
    warranty: 'Garantía Oficial Paradox Security en República Dominicana',
    accentColor: '#f87171',
    iconType: 'paradox_sensor'
  },
  {
    fileName: 'siemens-sentron-3va11-breaker-125a.webp',
    brand: 'Siemens',
    brandBadge: 'SIEMENS SENTRON INDUSTRIAL PROTECTION',
    badgeColor: '#0d9488',
    model: 'Siemens Sentron 3VA11 (125A)',
    subtitle: 'Interruptor Automático de Caja Moldeada 3P 125A • Capacidad de Corte 25 kA',
    specs: [
      'Interruptor 3 Polos 125A con disparador termomagnético TM210',
      'Capacidad de corte en cortocircuito Icu de 25 kA a 415V (IEC 60947-2)',
      'Formato ultra compacto para tableros y centros de distribución',
      'Borna frontal de alta seguridad para conductores de cobre y aluminio'
    ],
    priceTag: 'RD$ 14,900.00',
    warranty: 'Garantía Oficial Siemens Industrial en Santiago y RD',
    accentColor: '#14b8a6',
    iconType: 'siemens_breaker'
  },
  {
    fileName: 'tesla-solar-inverter-76kw.webp',
    brand: 'Tesla',
    brandBadge: 'TESLA ENERGY SMART SOLAR INVERTER',
    badgeColor: '#dc2626',
    model: 'Tesla Solar Inverter 7.6 kW',
    subtitle: 'Inversor Solar Residencial/Comercial • 4 Entradas MPPT y Gestión por Tesla App',
    specs: [
      'Potencia nominal 7.6 kW con eficiencia de conversión máxima del 98%',
      '4 Seguidores MPPT independientes para múltiples techos y orientaciones',
      'Integración nativa con Powerwall y conmutación Backup Gateway',
      'Monitoreo en vivo OTA por Wi-Fi, Ethernet y Celular en la App Tesla'
    ],
    priceTag: 'RD$ 115,000.00',
    warranty: 'Garantía Oficial Tesla Energy 10 Años con Soporte Certificado',
    accentColor: '#f43f5e',
    iconType: 'tesla_inverter'
  },
  {
    fileName: 'uniview-ptz-4mp-33x-lighthunter.webp',
    brand: 'Uniview',
    brandBadge: 'UNIVIEW LIGHTHUNTER 4MP PTZ 33X',
    badgeColor: '#0284c7',
    model: 'Uniview LightHunter PTZ 33x',
    subtitle: 'Cámara PTZ IP 4MP Zoom Óptico 33x • Infrarrojos 150m y Analítica Deep Learning',
    specs: [
      'Sensor CMOS 1/2.8" 4MP LightHunter con zoom óptico 33x (4.5-148.5mm)',
      'Iluminación infrarroja inteligente adaptativa hasta 150 metros de alcance',
      'Analítica Deep Learning con autoseguimiento inteligente de objetivos',
      'Chasis antivandálico metálico IP66 / IK10 con alimentación PoE+'
    ],
    priceTag: 'RD$ 49,900.00',
    warranty: 'Garantía Oficial Uniview con Soporte Técnico en Santiago',
    accentColor: '#38bdf8',
    iconType: 'uniview_ptz'
  }
];

function generateSvg(p) {
  let illustration = '';

  if (p.iconType === 'mitsubishi_ac') {
    illustration = `
      <!-- Mitsubishi Ceiling / Floor Console Unit -->
      <g transform="translate(190, 240)">
        <!-- Ceiling mounting plane hint -->
        <rect x="20" y="30" width="460" height="12" rx="2" fill="#334155" opacity="0.6"/>

        <!-- Main Floor/Ceiling Console Body -->
        <rect x="30" y="45" width="440" height="135" rx="12" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="40" y="55" width="420" height="115" rx="8" fill="#e2e8f0"/>

        <!-- Front Air Intake Grille -->
        <g transform="translate(60, 65)">
          ${[0, 15, 30, 45, 60, 75].map(y => `
            <line x1="0" y1="${y}" x2="300" y2="${y}" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
          `).join('')}
        </g>

        <!-- Right Side Control & Display Panel -->
        <rect x="385" y="65" width="60" height="95" rx="6" fill="#0f172a"/>
        <!-- LED Status Indicators -->
        <circle cx="415" cy="80" r="5" fill="#22c55e"/>
        <circle cx="415" cy="98" r="4" fill="#38bdf8"/>
        <circle cx="415" cy="114" r="4" fill="#f59e0b"/>
        <!-- Digital Temperature Display -->
        <text x="415" y="145" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#38bdf8" text-anchor="middle">21°C</text>

        <!-- Bottom Air Discharge Vane (Motorized Louver) -->
        <rect x="40" y="152" width="330" height="14" rx="4" fill="#64748b"/>
        <!-- Cool Air Flow Waves -->
        <path d="M70 175 Q150 205 230 185 T380 200" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4" opacity="0.8"/>
        <path d="M90 190 Q170 220 250 200 T400 215" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>

        <!-- Mitsubishi Three Diamonds Logo Mark -->
        <g transform="translate(65, 48) scale(0.65)">
          <polygon points="12,0 6,10 18,10" fill="#dc2626"/>
          <polygon points="6,10 0,20 12,20" fill="#dc2626"/>
          <polygon points="18,10 12,20 24,20" fill="#dc2626"/>
        </g>
        <text x="95" y="58" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#0f172a">MITSUBISHI ELECTRIC</text>

        <!-- Shadow / Glow beneath unit -->
        <ellipse cx="250" cy="225" rx="180" ry="14" fill="${p.accentColor}" fill-opacity="0.2"/>
      </g>
    `;
  } else if (p.iconType === 'panasonic_conf') {
    illustration = `
      <!-- Panasonic KX-HDV800 Conference Phone Triangular/Tri-lobe Base -->
      <g transform="translate(240, 240)">
        <!-- Outer triangular disc with smooth corners -->
        <path d="M200 40 C280 40 330 140 290 200 C250 260 150 260 110 200 C70 140 120 40 200 40 Z" fill="#0f172a" stroke="${p.accentColor}" stroke-width="4"/>
        <path d="M200 50 C270 50 315 140 280 190 C245 240 155 240 120 190 C85 140 130 50 200 50 Z" fill="#1e293b"/>

        <!-- 3 Omnidirectional Microphone Pods on the 3 vertices -->
        <!-- Top mic -->
        <circle cx="200" cy="65" r="14" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <circle cx="200" cy="65" r="7" fill="#22c55e"/>
        <!-- Bottom Right mic -->
        <circle cx="275" cy="180" r="14" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <circle cx="275" cy="180" r="7" fill="#22c55e"/>
        <!-- Bottom Left mic -->
        <circle cx="125" cy="180" r="14" fill="#334155" stroke="${p.accentColor}" stroke-width="2"/>
        <circle cx="125" cy="180" r="7" fill="#22c55e"/>

        <!-- Central High-Definition Speaker Grille (OmniSound) -->
        <circle cx="200" cy="140" r="42" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        <circle cx="200" cy="140" r="34" fill="#1e293b"/>
        <g stroke="#64748b" stroke-width="1.5">
          <circle cx="200" cy="140" r="8" fill="none"/>
          <circle cx="200" cy="140" r="16" fill="none"/>
          <circle cx="200" cy="140" r="24" fill="none"/>
        </g>
        <circle cx="200" cy="140" r="3" fill="${p.accentColor}"/>

        <!-- Front/Lower Display & Keypad Pad -->
        <rect x="150" y="195" width="100" height="35" rx="4" fill="#020617" stroke="#334155" stroke-width="2"/>
        <text x="200" y="210" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="#38bdf8" text-anchor="middle">SIP 5-WAY CONF</text>
        <text x="200" y="222" font-family="system-ui, sans-serif" font-size="7" font-weight="600" fill="#94a3b8" text-anchor="middle">OmniSound HD • SD REC</text>

        <!-- Brand Name -->
        <text x="200" y="98" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">Panasonic</text>

        <!-- Table Glow -->
        <ellipse cx="200" cy="245" rx="140" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'paradox_sensor') {
    illustration = `
      <!-- Paradox NVX80 Outdoor Commercial Sensor -->
      <g transform="translate(240, 230)">
        <!-- Wall Mount Swivel Bracket -->
        <path d="M150 200 L170 180 L230 180 L250 200 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>
        <rect x="180" y="195" width="40" height="25" rx="3" fill="#1e293b"/>

        <!-- Sensor Housing (Rugged Outdoor IP55 Enclosure) -->
        <rect x="140" y="25" width="120" height="165" rx="18" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="148" y="33" width="104" height="149" rx="12" fill="#e2e8f0"/>

        <!-- Top Weather Protection Hood / Sunshield -->
        <path d="M130 35 L145 15 L255 15 L270 35 Z" fill="#cbd5e1" stroke="${p.accentColor}" stroke-width="2"/>

        <!-- Top Dual PIR Fresnel Lens Array (Pattern Texture) -->
        <rect x="156" y="42" width="88" height="42" rx="6" fill="#334155" stroke="#475569" stroke-width="2"/>
        <!-- Fresnel lens faceting -->
        <g stroke="#64748b" stroke-width="1">
          <line x1="165" y1="42" x2="165" y2="84"/>
          <line x1="175" y1="42" x2="175" y2="84"/>
          <line x1="185" y1="42" x2="185" y2="84"/>
          <line x1="195" y1="42" x2="195" y2="84"/>
          <line x1="205" y1="42" x2="205" y2="84"/>
          <line x1="215" y1="42" x2="215" y2="84"/>
          <line x1="225" y1="42" x2="225" y2="84"/>
          <line x1="235" y1="42" x2="235" y2="84"/>
        </g>

        <!-- Central OLED Color Display for Configuration -->
        <rect x="165" y="92" width="70" height="30" rx="4" fill="#020617" stroke="${p.accentColor}" stroke-width="2"/>
        <text x="200" y="105" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#22c55e" text-anchor="middle">SeeTrue OK</text>
        <text x="200" y="116" font-family="system-ui, sans-serif" font-size="7" font-weight="700" fill="#38bdf8" text-anchor="middle">8-CH MW+PIR</text>

        <!-- Bottom Microwave / Active Anti-Masking Zone -->
        <rect x="156" y="130" width="88" height="40" rx="6" fill="#1e293b"/>
        <circle cx="180" cy="150" r="6" fill="#ef4444"/>
        <circle cx="220" cy="150" r="6" fill="#38bdf8"/>
        <text x="200" y="153" font-family="system-ui, sans-serif" font-size="8" font-weight="800" fill="#94a3b8" text-anchor="middle">NVX80</text>

        <!-- Brand Name -->
        <text x="200" y="178" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1">PARADOX</text>

        <!-- Perimetral Detection Beams -->
        <path d="M120 70 L40 50" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4" opacity="0.7"/>
        <path d="M120 80 L35 90" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4" opacity="0.7"/>
        <path d="M280 70 L360 50" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4" opacity="0.7"/>
        <path d="M280 80 L365 90" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4" opacity="0.7"/>

        <!-- Shadow -->
        <ellipse cx="200" cy="235" rx="110" ry="10" fill="${p.accentColor}" fill-opacity="0.2"/>
      </g>
    `;
  } else if (p.iconType === 'siemens_breaker') {
    illustration = `
      <!-- Siemens Sentron 3VA11 Molded Case Circuit Breaker (MCCB) -->
      <g transform="translate(230, 230)">
        <!-- Heavy Industrial Molded Enclosure (3 Poles) -->
        <rect x="120" y="30" width="160" height="175" rx="8" fill="#1e293b" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="128" y="38" width="144" height="159" rx="4" fill="#0f172a"/>

        <!-- Top 3 Phase Terminals (L1, L2, L3) -->
        <rect x="135" y="15" width="30" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="2"/>
        <rect x="185" y="15" width="30" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="2"/>
        <rect x="235" y="15" width="30" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="2"/>

        <!-- Phase Separator Ribs -->
        <line x1="173" y1="38" x2="173" y2="197" stroke="#334155" stroke-width="3"/>
        <line x1="227" y1="38" x2="227" y2="197" stroke="#334155" stroke-width="3"/>

        <!-- Bottom 3 Load Terminals (T1, T2, T3) -->
        <rect x="135" y="195" width="30" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="2"/>
        <rect x="185" y="195" width="30" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="2"/>
        <rect x="235" y="195" width="30" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="2"/>

        <!-- Central Heavy Toggle Switch Mechanism -->
        <rect x="175" y="70" width="50" height="70" rx="4" fill="#334155"/>
        <rect x="182" y="80" width="36" height="35" rx="4" fill="#0d9488" stroke="#14b8a6" stroke-width="2"/>
        <text x="200" y="102" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">ON</text>

        <!-- Technical Rating Plate -->
        <rect x="138" y="148" width="124" height="42" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <text x="200" y="162" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#14b8a6" text-anchor="middle">3VA11 • 125A</text>
        <text x="200" y="174" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#cbd5e1" text-anchor="middle">Icu: 25kA @ 415V • TM210</text>
        <text x="200" y="184" font-family="system-ui, sans-serif" font-size="7" font-weight="600" fill="#94a3b8" text-anchor="middle">IEC 60947-2 • SIEMENS</text>

        <!-- Siemens Brand Badge on top -->
        <text x="200" y="58" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">SIEMENS</text>

        <!-- Floor reflection -->
        <ellipse cx="200" cy="230" rx="110" ry="10" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'tesla_inverter') {
    illustration = `
      <!-- Tesla Solar Inverter 7.6 kW Unit -->
      <g transform="translate(240, 220)">
        <!-- Sleek Tesla White Enclosure with rounded corners -->
        <rect x="125" y="25" width="150" height="200" rx="16" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="4"/>
        <rect x="135" y="35" width="130" height="180" rx="12" fill="#ffffff"/>

        <!-- Top Curved Accent / Grille -->
        <path d="M140 45 Q200 35 260 45" stroke="#e2e8f0" stroke-width="3" fill="none"/>

        <!-- Iconic Tesla 'T' Emblem -->
        <g transform="translate(200, 75) scale(0.9)">
          <path d="M-22 -14 C-10 -11 10 -11 22 -14 C20 -11 16 -8 13 -7 C7 -7 -7 -7 -13 -7 C-16 -8 -20 -11 -22 -14 Z" fill="#e11d48"/>
          <path d="M-18 -5 C-8 -4 8 -4 18 -5 C16 -2 14 0 11 1 C5 2 -5 2 -11 1 C-14 0 -16 -2 -18 -5 Z" fill="#e11d48"/>
          <path d="M-5 4 L5 4 L3 24 L0 27 L-3 24 Z" fill="#e11d48"/>
        </g>
        <text x="200" y="118" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="3">TESLA</text>
        <text x="200" y="132" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle">SOLAR INVERTER</text>

        <!-- Central Status LED Bar (Pulsing Green for solar generation) -->
        <rect x="160" y="145" width="80" height="6" rx="3" fill="#22c55e"/>
        <ellipse cx="200" cy="148" rx="42" ry="4" fill="#22c55e" fill-opacity="0.5"/>

        <!-- Technical Specs Box inside Unit -->
        <rect x="145" y="165" width="110" height="40" rx="6" fill="#0f172a"/>
        <text x="200" y="180" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle">7.6 kW • 98% EFF</text>
        <text x="200" y="194" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#f43f5e" text-anchor="middle">4 MPPT • TESLA APP</text>

        <!-- Solar Energy Flow Rays -->
        <path d="M125 50 L80 30" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" opacity="0.8"/>
        <path d="M125 70 L75 70" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" opacity="0.8"/>
        <path d="M275 50 L320 30" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" opacity="0.8"/>
        <path d="M275 70 L325 70" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" opacity="0.8"/>

        <!-- Shadow -->
        <ellipse cx="200" cy="240" rx="110" ry="12" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  } else if (p.iconType === 'uniview_ptz') {
    illustration = `
      <!-- Uniview IPC6854SR-X33 Speed Dome PTZ Camera -->
      <g transform="translate(240, 220)">
        <!-- Heavy Wall/Pole Mounting Arm -->
        <path d="M80 50 L150 50 L160 100 L180 100" fill="none" stroke="#334155" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="65" y="30" width="25" height="60" rx="4" fill="#1e293b" stroke="${p.accentColor}" stroke-width="2"/>

        <!-- PTZ Turret Base & Sunshield Dome Cap -->
        <ellipse cx="200" cy="100" rx="50" ry="18" fill="#f8fafc" stroke="${p.accentColor}" stroke-width="3"/>
        <path d="M150 100 Q200 80 250 100 L245 125 Q200 115 155 125 Z" fill="#e2e8f0"/>

        <!-- Spherical Camera Dome Body (Pan-Tilt Core) -->
        <circle cx="200" cy="155" r="50" fill="#0f172a" stroke="${p.accentColor}" stroke-width="3"/>

        <!-- Front Optical Glass Faceplate -->
        <ellipse cx="200" cy="155" rx="38" ry="38" fill="#020617"/>

        <!-- Large 33x Motorized Optical Lens Barrel -->
        <circle cx="200" cy="155" r="24" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="200" cy="155" r="16" fill="#020617" stroke="#60a5fa" stroke-width="2"/>
        <circle cx="200" cy="155" r="8" fill="#1e3a8a"/>
        <circle cx="197" cy="152" r="3" fill="#ffffff" opacity="0.8"/>

        <!-- Dual High-Power Adaptive IR Array (150m Range) -->
        <circle cx="172" cy="140" r="5" fill="#ef4444" opacity="0.9"/>
        <circle cx="228" cy="140" r="5" fill="#ef4444" opacity="0.9"/>
        <circle cx="172" cy="170" r="5" fill="#ef4444" opacity="0.9"/>
        <circle cx="228" cy="170" r="5" fill="#ef4444" opacity="0.9"/>

        <!-- Uniview Branding & Spec Mark -->
        <text x="200" y="220" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="1">UNIVIEW PTZ 33X</text>
        <text x="200" y="234" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8" text-anchor="middle">LightHunter 4MP • IR 150m • Deep Learning</text>

        <!-- Tracking Radar Field Hint -->
        <path d="M140 185 L100 220" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" opacity="0.7"/>
        <path d="M260 185 L300 220" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" opacity="0.7"/>

        <!-- Shadow -->
        <ellipse cx="200" cy="245" rx="90" ry="8" fill="${p.accentColor}" fill-opacity="0.25"/>
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 880" width="880" height="880">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0f1d"/>
          <stop offset="60%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <linearGradient id="specBoxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(30, 41, 59, 0.75)"/>
          <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)"/>
        </linearGradient>
        <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#334155" fill-opacity="0.45"/>
        </pattern>
      </defs>

      <!-- Background Base -->
      <rect width="880" height="880" rx="32" fill="url(#bgGrad)"/>
      <rect width="880" height="880" rx="32" fill="url(#dotGrid)"/>

      <!-- Ambient Glow Spotlights -->
      <circle cx="150" cy="150" r="180" fill="${p.accentColor}" fill-opacity="0.08" filter="blur(40px)"/>
      <circle cx="700" cy="400" r="220" fill="${p.accentColor}" fill-opacity="0.07" filter="blur(50px)"/>

      <!-- Header Section: Category Badge & Verified Stamp -->
      <g transform="translate(56, 56)">
        <!-- Brand / Category Badge Pill -->
        <rect x="0" y="0" width="410" height="36" rx="8" fill="${p.badgeColor}" fill-opacity="0.2" stroke="${p.badgeColor}" stroke-width="1.5"/>
        <circle cx="18" cy="18" r="5" fill="${p.accentColor}"/>
        <text x="32" y="23" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="1">${p.brandBadge}</text>

        <!-- Official Partner Stamp -->
        <g transform="translate(620, 0)">
          <rect x="0" y="0" width="148" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <circle cx="18" cy="18" r="6" fill="#22c55e"/>
          <text x="34" y="23" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#e2e8f0">FUTUNET RD</text>
        </g>
      </g>

      <!-- Product Title & Headline -->
      <g transform="translate(56, 125)">
        <text x="0" y="32" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="-0.5">${p.model}</text>
        <text x="0" y="62" font-family="system-ui, sans-serif" font-size="15" font-weight="600" fill="#94a3b8">${p.subtitle}</text>
      </g>

      <!-- Central Visual Representation -->
      ${illustration}

      <!-- Bottom Specs & Commercial Highlights Grid Box -->
      <g transform="translate(56, 550)">
        <rect x="0" y="0" width="768" height="180" rx="16" fill="url(#specBoxGrad)" stroke="#334155" stroke-width="1.5"/>

        <!-- Specs List (2 Columns of 2 items) -->
        <g transform="translate(32, 28)">
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

  console.log('Todas las imágenes WebP de Lote 30 fueron creadas exitosamente.');
}

run().catch(err => {
  console.error('Error generando imágenes:', err);
  process.exit(1);
});
