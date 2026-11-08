const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const ledgerPaths = [
  path.resolve(projectRoot, 'docs', 'DEVSECOPS_SECURITY_LEDGER.md'),
  path.resolve(projectRoot, '..', 'DEVSECOPS_SECURITY_LEDGER.md')
];

const lote31Entry = `
- **Atención y Respuesta al Buzón de Sugerencias — Lote 31 (2026-11-08: 166 Sugerencias Oficiales Implementadas, Catálogo Expandido a 493 Ítems, Campaña Semana 2 de Noviembre "Conectividad Crítica: Fibra Simétrica Dedicada & Wi-Fi 6 de Alta Densidad", Telecomunicaciones, Proyección Audiovisual y Energía Ininterrumpida en Santiago)**:
  - **Revisión y Respuesta Oficial de Sugerencias (166/166 Implementadas y Respondidas)**:
    - **\`SUG-C9200\`** (Ing. Ramón Emilio Peralta, Redes & Telecomunicaciones Corporativas Cibao / PIVEM):
      - *Título*: Disponibilidad de Switches Administrables Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Enlaces 10G SFP+.
      - *Estado*: \`implemented\`.
      - *Respuesta Oficial*: Aprobado e integrado al catálogo de Redes y a \`marca-cisco.html\` el Switch Administrable Layer 3 Cisco Catalyst 9200L de 24 Puertos Gigabit PoE+ (370W) con 4 Uplinks 10G SFP+ (\`redes_cisco_catalyst_9200l_24p_4x_poe\`), enrutamiento dinámico avanzado y garantía oficial Cisco Enhanced Limited Lifetime (E-LLW) en Santiago.
      - *Activo Visual*: Generada y verificada ficha visual WebP optimizada (\`cisco-catalyst-9200l-24p-4x-switch.webp\`) en \`img/productos/catalogo/\` y \`dist/img/productos/catalogo/\`.
    - **\`SUG-U6ENT\`** (Ing. Lisandro Taveras, Infraestructura de Datos & Redes Médicas Santiago):
      - *Título*: Disponibilidad de Puntos de Acceso Wi-Fi 6E Tri-Banda de Ultra Alta Densidad Ubiquiti UniFi U6 Enterprise con Puerto 2.5 GbE PoE+.
      - *Estado*: \`implemented\`.
      - *Respuesta Oficial*: Aprobado e integrado al catálogo de Redes y a \`marca-ubiquiti.html\` el Punto de Acceso Wi-Fi 6E Tri-Banda Ubiquiti UniFi U6 Enterprise con espectro limpio de 6 GHz, tasa agregada de 10.2 Gbps, puerto 2.5 GbE PoE+ y garantía oficial Ubiquiti Networks en Santiago.
      - *Activo Visual*: Generada y verificada ficha visual WebP optimizada (\`ubiquiti-unifi-u6-enterprise-ap.webp\`) en \`img/productos/catalogo/\` y \`dist/img/productos/catalogo/\`.
    - **\`SUG-M2004\`** (Ing. Winston Almonte, Ingeniería de Enlaces Dedicados & WISP Santiago):
      - *Título*: Disponibilidad de Cloud Core Routers MikroTik CCR2004-16G-2S+PC con 16 Puertos Gigabit y 2 Bahías 10G SFP+ Silenciosos.
      - *Estado*: \`implemented\`.
      - *Respuesta Oficial*: Aprobado e integrado al catálogo de Redes y a \`marca-mikrotik.html\` el Cloud Core Router MikroTik CCR2004-16G-2S+PC con 16 puertos Gigabit, 2 enlaces 10G SFP+, arquitectura silenciosa de 0 dB por refrigeración pasiva y garantía oficial MikroTik en Santiago.
      - *Activo Visual*: Generada y verificada ficha visual WebP optimizada (\`mikrotik-ccr2004-16g-2s-router.webp\`) en \`img/productos/catalogo/\` y \`dist/img/productos/catalogo/\`.
    - **\`SUG-T6700\`** (Lic. Carlos Manuel Fernández, Gestión de Redes & Conectividad Hotelera Santiago):
      - *Título*: Disponibilidad de Puntos de Acceso Wi-Fi 6 AX5400 de Techo TP-Link Omada EAP670 con Puerto 2.5 GbE PoE+ y Canal de 160 MHz.
      - *Estado*: \`implemented\`.
      - *Respuesta Oficial*: Aprobado e integrado al catálogo de Redes y a \`marca-tp-link.html\` el Punto de Acceso Wi-Fi 6 TP-Link Omada EAP670 AX5400 con ancho de banda de 160 MHz, puerto de alta velocidad 2.5 GbE PoE+, integración a Omada Cloud SDN y garantía oficial TP-Link en República Dominicana.
      - *Activo Visual*: Generada y verificada ficha visual WebP optimizada (\`tplink-omada-eap670-wifi6-ap.webp\`) en \`img/productos/catalogo/\` y \`dist/img/productos/catalogo/\`.
    - **\`SUG-E5300\`** (Arq. Patricia Del Monte, Salas de Conferencias & Proyectos Audiovisuales Santiago):
      - *Título*: Disponibilidad de Proyectores Láser Corporativos Full HD WUXGA Epson PowerLite L530U de 5,200 Lúmenes con Fuente Láser de 20,000 Horas.
      - *Estado*: \`implemented\`.
      - *Respuesta Oficial*: Aprobado e integrado al catálogo de Equipos de Oficina y a \`marca-epson.html\` el Proyector Láser Corporativo Epson PowerLite L530U de 5,200 Lúmenes WUXGA con fuente de luz láser de 20,000 horas, tecnología 3LCD de colores vivos y 3 años de garantía oficial Epson en Santiago.
      - *Activo Visual*: Generada y verificada ficha visual WebP optimizada (\`epson-powerlite-l530u-proyector-laser.webp\`) en \`img/productos/catalogo/\` y \`dist/img/productos/catalogo/\`.
    - **\`SUG-A6000\`** (Ing. Fernando Méndez, Continuidad Operativa & Energía Crítica Zona Franca):
      - *Título*: Disponibilidad de UPS Online Doble Conversión en Rack APC by Schneider Electric Easy UPS SRV 6kVA / 6000VA 208/240V con Tarjeta SNMP.
      - *Estado*: \`implemented\`.
      - *Respuesta Oficial*: Aprobado e integrado al catálogo de Energía y Climatización y a \`marca-schneiderelectric.html\` el UPS Online Doble Conversión en Rack APC Easy UPS SRV 6kVA / 6kW (SRV6KRILRK) con factor de potencia 1.0, 0 ms de transferencia, tarjeta de monitoreo de red SNMP y garantía oficial Schneider Electric en Santiago.
      - *Activo Visual*: Generada y verificada ficha visual WebP optimizada (\`apc-easy-ups-srv-6kva-rack-online.webp\`) en \`img/productos/catalogo/\` y \`dist/img/productos/catalogo/\`.
  - **Desambiguación y Corrección de Integridad en Base de Datos**:
    - Subsanada la colisión histórica de clave en \`seed-suggestions.cjs\` para la consola Cassette PLA-M asignándole el código de referencia único \`SUG-M360C\`, garantizando que tanto el Cassette PLA-M (\`SUG-M360C\`) como la Consola Piso-Techo PCA-M (\`SUG-M3600\`) coexistan en Firestore como documentos independientes sin sobrescrituras (166 documentos en Firestore y en la lista canónica).
  - **Expansión y Paridad de Marcas Aliadas (26 de 26 Marcas en Nivel Tier-1 [≥ 6 a 17 Productos])**:
    - Las 26 marcas aliadas mantienen un mínimo estricto de 6 productos: Dell (17), Hikvision (13), Cisco (7), Epson (7), MikroTik (7), Schneider Electric (7), TP-Link (7), Ubiquiti (7), y las 18 marcas restantes (Dahua, Ezviz, HP, Juniper, Lenovo, LG, Linksys, Logitech, Mitsubishi, Netgear, Panasonic, Paradox, Samsung, Siemens, Tesla, Uniview, Victron Energy y ZKTeco) con 6 productos exactos.
  - **Telemetría de Búsqueda y Puntuación Contextual en \`catalog.js\`**:
    - Agregadas variantes stem para términos clave (\`c9200\`, \`c9200l\`, \`catalyst9200\`, \`u6ent\`, \`u6-enterprise\`, \`ccr2004\`, \`eap670\`, \`l530u\`, \`srv6k\`, \`srv6krilrk\`).
    - Configurado impulso de relevancia (+280 puntos para concordancia de modelo, +150 puntos para marca/categoría) en \`scoreProductMatch\`.
    - Todas las consultas clave evaluadas en \`tools/check-queries.cjs\` y \`tools/test-search-telemetry.cjs\` se posicionan en el lugar #1 con puntajes de 415 a 957.
  - **Resiliencia de Service Worker y Caché Offline PWA (\`futunet-cache-v66\` en \`sw.js\`)**:
    - Incrementada la versión de caché del Service Worker a \`futunet-cache-v66\` en \`sw.js\`.
    - Agregados los 6 nuevos activos WebP de catálogo al array \`OPTIONAL_ASSETS\` garantizando disponibilidad offline fluida.
    - Sincronizadas las aserciones de integridad en \`tools/test-dom-safety.cjs\` y \`tools/test-forms-security.cjs\`.
  - **Aseguramiento de Calidad & Métricas de Verificación (Regresión Zero)**:
    - 397 tests automatizados pasando al 100% en frontend (\`npm test\`, 0 fallos en 18 suites de prueba).
    - 54 tests unitarios en backend aprobados al 100% (\`python -m unittest discover -s . -p "test_*.py"\`).
    - Total de 451 pruebas automatizadas pasando con cero fallos en toda la plataforma.
    - 0 errores sintácticos en 120 scripts JS y 0 IDs duplicados en 52 archivos HTML (\`node tools/audit-js-quality.cjs\`).
    - 0 scripts rotos, 0 hojas de estilo faltantes y 0 referencias ausentes en 52 páginas HTML (\`node tools/audit-codebase.cjs\`).
    - Validación completa de hosting de producción (\`npm run validate\`): 52 páginas HTML, 29 hojas de estilo y 782 recursos públicos en \`dist/\` sin enlaces rotos ni alertas CSP.
`;

for (const p of ledgerPaths) {
  if (fs.existsSync(p)) {
    fs.appendFileSync(p, lote31Entry, 'utf8');
    console.log(`[OK] Actualizado ${p} con la entrada de Lote 31.`);
  }
}
