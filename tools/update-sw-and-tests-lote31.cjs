const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// 1. sw.js
const swPath = path.join(projectRoot, 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

if (swContent.includes("const CACHE_NAME = 'futunet-cache-v65';")) {
  swContent = swContent.replace(
    "const CACHE_NAME = 'futunet-cache-v65';",
    "const CACHE_NAME = 'futunet-cache-v66';"
  );
}

const targetSwAsset = "  './img/productos/catalogo/uniview-ptz-4mp-33x-lighthunter.webp',";
const newSwAssets = `${targetSwAsset}
  './img/productos/catalogo/cisco-catalyst-9200l-24p-4x-switch.webp',
  './img/productos/catalogo/ubiquiti-unifi-u6-enterprise-ap.webp',
  './img/productos/catalogo/mikrotik-ccr2004-16g-2s-router.webp',
  './img/productos/catalogo/tplink-omada-eap670-wifi6-ap.webp',
  './img/productos/catalogo/epson-powerlite-l530u-proyector-laser.webp',
  './img/productos/catalogo/apc-easy-ups-srv-6kva-rack-online.webp',`;

if (swContent.includes(targetSwAsset) && !swContent.includes('cisco-catalyst-9200l-24p-4x-switch.webp')) {
  swContent = swContent.replace(targetSwAsset, newSwAssets);
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('[OK] sw.js actualizado a futunet-cache-v66 con los 6 activos de Lote 31.');
} else {
  console.log('[INFO] sw.js ya contiene los activos de Lote 31.');
}

// 2. tools/test-dom-safety.cjs
const testDomPath = path.join(projectRoot, 'tools', 'test-dom-safety.cjs');
let testDomContent = fs.readFileSync(testDomPath, 'utf8');
if (testDomContent.includes('futunet-cache-v65')) {
  testDomContent = testDomContent.replace('futunet-cache-v65', 'futunet-cache-v66');
  fs.writeFileSync(testDomPath, testDomContent, 'utf8');
  console.log('[OK] tools/test-dom-safety.cjs actualizado con futunet-cache-v66.');
}

// 3. tools/test-forms-security.cjs
const testFormsPath = path.join(projectRoot, 'tools', 'test-forms-security.cjs');
let testFormsContent = fs.readFileSync(testFormsPath, 'utf8');
if (testFormsContent.includes('futunet-cache-v65')) {
  testFormsContent = testFormsContent.replace('futunet-cache-v65', 'futunet-cache-v66');
  fs.writeFileSync(testFormsPath, testFormsContent, 'utf8');
  console.log('[OK] tools/test-forms-security.cjs actualizado con futunet-cache-v66.');
}

// 4. tools/test-search-telemetry.cjs
const testSearchPath = path.join(projectRoot, 'tools', 'test-search-telemetry.cjs');
let testSearchContent = fs.readFileSync(testSearchPath, 'utf8');

const targetSearchQuery = "  'ipc6854'];";
const newSearchQueries = `  'ipc6854',
  'c9200',
  'u6-enterprise',
  'ccr2004',
  'eap670',
  'l530u',
  'srv6k'];`;

if (testSearchContent.includes(targetSearchQuery)) {
  testSearchContent = testSearchContent.replace(targetSearchQuery, newSearchQueries);
}

const targetSearchAssert = `    if (q === 'ipc6854') {
      assert.strictEqual(
        scored[0].p.brand,
        'Uniview',
        'La búsqueda "ipc6854" debe priorizar la Cámara Uniview LightHunter PTZ 33x'
      );
      assert.ok(
        /ptz|33x|ipc6854/i.test(scored[0].p.title),
        'El producto top para "ipc6854" debe ser Uniview PTZ 33x'
      );
    }`;

const newSearchAsserts = `${targetSearchAssert}

    if (q === 'c9200') {
      assert.strictEqual(
        scored[0].p.brand,
        'Cisco',
        'La búsqueda "c9200" debe priorizar el Switch Cisco Catalyst 9200L'
      );
      assert.ok(
        /9200|catalyst/i.test(scored[0].p.title),
        'El producto top para "c9200" debe ser Cisco Catalyst 9200L'
      );
    }

    if (q === 'u6-enterprise') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ubiquiti',
        'La búsqueda "u6-enterprise" debe priorizar el AP Ubiquiti UniFi U6 Enterprise'
      );
      assert.ok(
        /enterprise|u6/i.test(scored[0].p.title),
        'El producto top para "u6-enterprise" debe ser Ubiquiti UniFi U6 Enterprise'
      );
    }

    if (q === 'ccr2004') {
      assert.strictEqual(
        scored[0].p.brand,
        'MikroTik',
        'La búsqueda "ccr2004" debe priorizar el Cloud Core Router MikroTik CCR2004'
      );
      assert.ok(
        /ccr2004|cloud\\s*core/i.test(scored[0].p.title),
        'El producto top para "ccr2004" debe ser MikroTik CCR2004'
      );
    }

    if (q === 'eap670') {
      assert.strictEqual(
        scored[0].p.brand,
        'TP-Link',
        'La búsqueda "eap670" debe priorizar el Punto de Acceso TP-Link Omada EAP670'
      );
      assert.ok(
        /eap670|ax5400/i.test(scored[0].p.title),
        'El producto top para "eap670" debe ser TP-Link Omada EAP670'
      );
    }

    if (q === 'l530u') {
      assert.strictEqual(
        scored[0].p.brand,
        'Epson',
        'La búsqueda "l530u" debe priorizar el Proyector Láser Epson PowerLite L530U'
      );
      assert.ok(
        /l530u|laser/i.test(scored[0].p.title),
        'El producto top para "l530u" debe ser Epson PowerLite L530U'
      );
    }

    if (q === 'srv6k') {
      assert.strictEqual(
        scored[0].p.brand,
        'Schneider Electric',
        'La búsqueda "srv6k" debe priorizar el UPS Online en Rack APC Easy UPS SRV 6kVA'
      );
      assert.ok(
        /srv\\s*6kva|6000va|srv6k/i.test(scored[0].p.title),
        'El producto top para "srv6k" debe ser APC Easy UPS SRV 6kVA'
      );
    }`;

if (!testSearchContent.includes(targetSearchAssert)) {
  console.error('Target assert not found in test-search-telemetry.cjs');
  process.exit(1);
}
testSearchContent = testSearchContent.replace(targetSearchAssert, newSearchAsserts);
fs.writeFileSync(testSearchPath, testSearchContent, 'utf8');
console.log('[OK] tools/test-search-telemetry.cjs actualizado con aserciones de Lote 31.');

// 5. tools/test-suggestions.cjs
const testSugPath = path.join(projectRoot, 'tools', 'test-suggestions.cjs');
let testSugContent = fs.readFileSync(testSugPath, 'utf8');

const targetSugTest = `test('Mejora demandada por usuarios: Cámara PTZ IP Uniview LightHunter 4MP 33x Zoom (SUG-U4330)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U4330'") && seedCjs.includes("status: 'implemented'"), 'SUG-U4330 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U4330') && sugJs.includes('Uniview LightHunter 4MP'), 'SUG-U4330 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_uniview_ptz_4mp_33x_lighthunter'), 'backup_data.js debe contener seguridad_uniview_ptz_4mp_33x_lighthunter');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'uniview-ptz-4mp-33x-lighthunter.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen de la Cámara Uniview PTZ 33x debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ipc6854'") && catJs.includes("'ptz33x'"), 'catalog.js debe incluir ipc6854 en stem variants');
  assert.ok(catJs.includes('ipc6854'), 'catalog.js debe priorizar Uniview PTZ 33x');
});`;

const newSugTests = `${targetSugTest}

test('Mejora demandada por usuarios: Switch Administrable Layer 3 Cisco Catalyst 9200L 24P PoE+ 4X 10G (SUG-C9200)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-C9200'") && seedCjs.includes("status: 'implemented'"), 'SUG-C9200 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-C9200') && sugJs.includes('Cisco Catalyst 9200L'), 'SUG-C9200 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_cisco_catalyst_9200l_24p_4x_poe'), 'backup_data.js debe contener redes_cisco_catalyst_9200l_24p_4x_poe');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'cisco-catalyst-9200l-24p-4x-switch.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Switch Cisco Catalyst 9200L debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'c9200'") && catJs.includes("'c9200l'"), 'catalog.js debe incluir c9200 en stem variants');
  assert.ok(catJs.includes('c9200'), 'catalog.js debe priorizar Cisco Catalyst 9200L');
});

test('Mejora demandada por usuarios: Punto de Acceso Wi-Fi 6E Tri-Banda Ubiquiti UniFi U6 Enterprise 2.5G (SUG-U6ENT)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-U6ENT'") && seedCjs.includes("status: 'implemented'"), 'SUG-U6ENT debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-U6ENT') && sugJs.includes('Ubiquiti UniFi U6 Enterprise'), 'SUG-U6ENT debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_ubiquiti_unifi_u6_enterprise_ap'), 'backup_data.js debe contener redes_ubiquiti_unifi_u6_enterprise_ap');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'ubiquiti-unifi-u6-enterprise-ap.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Ubiquiti UniFi U6 Enterprise debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'u6ent'") && catJs.includes("'u6-enterprise'"), 'catalog.js debe incluir u6ent en stem variants');
  assert.ok(catJs.includes('u6-enterprise'), 'catalog.js debe priorizar Ubiquiti UniFi U6 Enterprise');
});

test('Mejora demandada por usuarios: Cloud Core Router MikroTik CCR2004-16G-2S+PC Silencioso (SUG-M2004)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M2004'") && seedCjs.includes("status: 'implemented'"), 'SUG-M2004 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M2004') && sugJs.includes('MikroTik CCR2004'), 'SUG-M2004 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_mikrotik_ccr2004_16g_2s_cloud_core_router'), 'backup_data.js debe contener redes_mikrotik_ccr2004_16g_2s_cloud_core_router');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mikrotik-ccr2004-16g-2s-router.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del MikroTik CCR2004 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'ccr2004'") && catJs.includes("'ccr2004-16g'"), 'catalog.js debe incluir ccr2004 en stem variants');
  assert.ok(catJs.includes('ccr2004'), 'catalog.js debe priorizar MikroTik CCR2004');
});

test('Mejora demandada por usuarios: Punto de Acceso Wi-Fi 6 TP-Link Omada EAP670 AX5400 2.5G (SUG-T6700)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T6700'") && seedCjs.includes("status: 'implemented'"), 'SUG-T6700 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T6700') && sugJs.includes('TP-Link Omada EAP670'), 'SUG-T6700 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_tplink_omada_eap670_wifi6_ap'), 'backup_data.js debe contener redes_tplink_omada_eap670_wifi6_ap');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tplink-omada-eap670-wifi6-ap.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del TP-Link Omada EAP670 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'eap670'") && catJs.includes("'omada-eap670'"), 'catalog.js debe incluir eap670 en stem variants');
  assert.ok(catJs.includes('eap670'), 'catalog.js debe priorizar TP-Link Omada EAP670');
});

test('Mejora demandada por usuarios: Proyector Láser Corporativo Full HD WUXGA Epson PowerLite L530U 5200lm (SUG-E5300)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-E5300'") && seedCjs.includes("status: 'implemented'"), 'SUG-E5300 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-E5300') && sugJs.includes('Epson PowerLite L530U'), 'SUG-E5300 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_epson_powerlite_l530u_proyector_laser'), 'backup_data.js debe contener oficina_epson_powerlite_l530u_proyector_laser');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'epson-powerlite-l530u-proyector-laser.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Epson PowerLite L530U debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'l530u'") && catJs.includes("'powerlite-l530u'"), 'catalog.js debe incluir l530u en stem variants');
  assert.ok(catJs.includes('l530u'), 'catalog.js debe priorizar Epson PowerLite L530U');
});

test('Mejora demandada por usuarios: UPS Online Doble Conversión en Rack APC Easy UPS SRV 6kVA 208/240V SNMP (SUG-A6000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-A6000'") && seedCjs.includes("status: 'implemented'"), 'SUG-A6000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-A6000') && sugJs.includes('APC Easy UPS SRV 6kVA'), 'SUG-A6000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_apc_schneider_easy_ups_srv_6000va_rack_online'), 'backup_data.js debe contener energia_apc_schneider_easy_ups_srv_6000va_rack_online');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'apc-easy-ups-srv-6kva-rack-online.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del APC Easy UPS SRV 6kVA debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'srv6k'") && catJs.includes("'srv6krilrk'"), 'catalog.js debe incluir srv6k en stem variants');
  assert.ok(catJs.includes('srv6k'), 'catalog.js debe priorizar APC Easy UPS SRV 6kVA');
});`;

if (!testSugContent.includes(targetSugTest)) {
  console.error('Target suggestion test not found in test-suggestions.cjs');
  process.exit(1);
}
testSugContent = testSugContent.replace(targetSugTest, newSugTests);
fs.writeFileSync(testSugPath, testSugContent, 'utf8');
console.log('[OK] tools/test-suggestions.cjs actualizado con las 6 pruebas de Lote 31.');
