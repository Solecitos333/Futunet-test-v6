const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// 1. sw.js
const swPath = path.join(projectRoot, 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

swContent = swContent.replace(
  "const CACHE_NAME = 'futunet-cache-v64';",
  "const CACHE_NAME = 'futunet-cache-v65';"
);

const targetSwAsset = "  './img/productos/catalogo/netgear-m4250-10g2f-poe-switch.webp',";
const newSwAssets = `${targetSwAsset}
  './img/productos/catalogo/mitsubishi-pca-m36-piso-techo-inverter.webp',
  './img/productos/catalogo/panasonic-kx-hdv800-conferencia-sip.webp',
  './img/productos/catalogo/paradox-nvx80-detector-exterior.webp',
  './img/productos/catalogo/siemens-sentron-3va11-breaker-125a.webp',
  './img/productos/catalogo/tesla-solar-inverter-76kw.webp',
  './img/productos/catalogo/uniview-ptz-4mp-33x-lighthunter.webp',`;

if (!swContent.includes(targetSwAsset)) {
  console.error('Target SW asset not found in sw.js');
  process.exit(1);
}
swContent = swContent.replace(targetSwAsset, newSwAssets);
fs.writeFileSync(swPath, swContent, 'utf8');
console.log('[OK] sw.js actualizado a futunet-cache-v65 con los 6 activos de Lote 30.');

// 2. tools/test-dom-safety.cjs
const testDomPath = path.join(projectRoot, 'tools', 'test-dom-safety.cjs');
let testDomContent = fs.readFileSync(testDomPath, 'utf8');
testDomContent = testDomContent.replace('futunet-cache-v64', 'futunet-cache-v65');
fs.writeFileSync(testDomPath, testDomContent, 'utf8');
console.log('[OK] tools/test-dom-safety.cjs actualizado con futunet-cache-v65.');

// 3. tools/test-forms-security.cjs
const testFormsPath = path.join(projectRoot, 'tools', 'test-forms-security.cjs');
let testFormsContent = fs.readFileSync(testFormsPath, 'utf8');
testFormsContent = testFormsContent.replace('futunet-cache-v64', 'futunet-cache-v65');
fs.writeFileSync(testFormsPath, testFormsContent, 'utf8');
console.log('[OK] tools/test-forms-security.cjs actualizado con futunet-cache-v65.');

// 4. tools/test-search-telemetry.cjs
const testSearchPath = path.join(projectRoot, 'tools', 'test-search-telemetry.cjs');
let testSearchContent = fs.readFileSync(testSearchPath, 'utf8');

const targetSearchQuery = "  'm4250'];";
const newSearchQueries = `  'm4250',
  'pca-m36',
  'hdv800',
  'nvx80',
  '3va11',
  'tesla solar inverter',
  'ipc6854'];`;

if (!testSearchContent.includes(targetSearchQuery)) {
  console.error('Target query not found in test-search-telemetry.cjs');
  process.exit(1);
}
testSearchContent = testSearchContent.replace(targetSearchQuery, newSearchQueries);

const targetSearchAssert = `    if (q === 'm4250') {
      assert.strictEqual(
        scored[0].p.brand,
        'Netgear',
        'La búsqueda "m4250" debe priorizar el Switch Netgear Pro AV M4250'
      );
      assert.ok(
        /m4250/i.test(scored[0].p.title),
        'El producto top para "m4250" debe ser Netgear Pro AV M4250'
      );
    }`;

const newSearchAsserts = `${targetSearchAssert}

    if (q === 'pca-m36') {
      assert.strictEqual(
        scored[0].p.brand,
        'Mitsubishi Electric',
        'La búsqueda "pca-m36" debe priorizar la Consola Mitsubishi PCA-M 36K'
      );
      assert.ok(
        /pca-m|piso-techo/i.test(scored[0].p.title),
        'El producto top para "pca-m36" debe ser Mitsubishi PCA-M 36K'
      );
    }

    if (q === 'hdv800') {
      assert.strictEqual(
        scored[0].p.brand,
        'Panasonic',
        'La búsqueda "hdv800" debe priorizar el Teléfono Panasonic KX-HDV800'
      );
      assert.ok(
        /hdv800|conferencia/i.test(scored[0].p.title),
        'El producto top para "hdv800" debe ser Panasonic KX-HDV800'
      );
    }

    if (q === 'nvx80') {
      assert.strictEqual(
        scored[0].p.brand,
        'Paradox',
        'La búsqueda "nvx80" debe priorizar el Sensor Paradox NVX80'
      );
      assert.ok(
        /nvx80/i.test(scored[0].p.title),
        'El producto top para "nvx80" debe ser Paradox NVX80'
      );
    }

    if (q === '3va11') {
      assert.strictEqual(
        scored[0].p.brand,
        'Siemens',
        'La búsqueda "3va11" debe priorizar el Interruptor Siemens Sentron 3VA11'
      );
      assert.ok(
        /3va11/i.test(scored[0].p.title),
        'El producto top para "3va11" debe ser Siemens Sentron 3VA11'
      );
    }

    if (q === 'tesla solar inverter') {
      assert.strictEqual(
        scored[0].p.brand,
        'Tesla',
        'La búsqueda "tesla solar inverter" debe priorizar el Tesla Solar Inverter 7.6 kW'
      );
      assert.ok(
        /solar\\s*inverter|7\\.6\\s*kw/i.test(scored[0].p.title),
        'El producto top para "tesla solar inverter" debe ser Tesla Solar Inverter'
      );
    }

    if (q === 'ipc6854') {
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

if (!testSearchContent.includes(targetSearchAssert)) {
  console.error('Target assert not found in test-search-telemetry.cjs');
  process.exit(1);
}
testSearchContent = testSearchContent.replace(targetSearchAssert, newSearchAsserts);
fs.writeFileSync(testSearchPath, testSearchContent, 'utf8');
console.log('[OK] tools/test-search-telemetry.cjs actualizado con aserciones de Lote 30.');

// 5. tools/test-suggestions.cjs
const testSugPath = path.join(projectRoot, 'tools', 'test-suggestions.cjs');
let testSugContent = fs.readFileSync(testSugPath, 'utf8');

const targetSugTest = `test('Mejora demandada por usuarios: Switch Administrable AV Line Netgear Pro AV M4250-10G2F-PoE+ (SUG-N4250)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-N4250'") && seedCjs.includes("status: 'implemented'"), 'SUG-N4250 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-N4250') && sugJs.includes('Netgear Pro AV M4250'), 'SUG-N4250 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('redes_netgear_m4250_10g2f_poe_switch_av'), 'backup_data.js debe contener redes_netgear_m4250_10g2f_poe_switch_av');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'netgear-m4250-10g2f-poe-switch.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Switch Netgear M4250 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'m4250'") && catJs.includes("'gsm4212p'"), 'catalog.js debe incluir m4250 en stem variants');
  assert.ok(catJs.includes('m4250'), 'catalog.js debe priorizar Netgear Pro AV M4250');
});`;

const newSugTests = `${targetSugTest}

test('Mejora demandada por usuarios: Consola Comercial Inverter Tipo Piso-Techo Mitsubishi Electric PCA-M 36,000 BTU (SUG-M3600)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-M3600'") && seedCjs.includes("status: 'implemented'"), 'SUG-M3600 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-M3600') && sugJs.includes('Mitsubishi Electric PCA-M'), 'SUG-M3600 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_mitsubishi_pca_m36_piso_techo_inverter'), 'backup_data.js debe contener energia_mitsubishi_pca_m36_piso_techo_inverter');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'mitsubishi-pca-m36-piso-techo-inverter.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Mitsubishi PCA-M 36K debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'pcam36'") && catJs.includes("'pca-m36'"), 'catalog.js debe incluir pcam36 en stem variants');
  assert.ok(catJs.includes('pca-m36'), 'catalog.js debe priorizar Mitsubishi PCA-M 36K');
});

test('Mejora demandada por usuarios: Teléfono SIP para Salas de Conferencia Panasonic KX-HDV800 (SUG-P8000)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P8000'") && seedCjs.includes("status: 'implemented'"), 'SUG-P8000 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P8000') && sugJs.includes('Panasonic KX-HDV800'), 'SUG-P8000 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('oficina_panasonic_kx_hdv800_conferencia_sip'), 'backup_data.js debe contener oficina_panasonic_kx_hdv800_conferencia_sip');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'panasonic-kx-hdv800-conferencia-sip.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Panasonic KX-HDV800 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'hdv800'") && catJs.includes("'kx-hdv800'"), 'catalog.js debe incluir hdv800 en stem variants');
  assert.ok(catJs.includes('hdv800'), 'catalog.js debe priorizar Panasonic KX-HDV800');
});

test('Mejora demandada por usuarios: Detector Exterior Grado Comercial Paradox NVX80 SeeTrue (SUG-P8080)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-P8080'") && seedCjs.includes("status: 'implemented'"), 'SUG-P8080 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-P8080') && sugJs.includes('Paradox NVX80'), 'SUG-P8080 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('seguridad_paradox_nvx80_detector_exterior'), 'backup_data.js debe contener seguridad_paradox_nvx80_detector_exterior');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'paradox-nvx80-detector-exterior.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Paradox NVX80 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'nvx80'") && catJs.includes("'nvx-80'"), 'catalog.js debe incluir nvx80 en stem variants');
  assert.ok(catJs.includes('nvx80'), 'catalog.js debe priorizar Paradox NVX80');
});

test('Mejora demandada por usuarios: Interruptor Automático de Caja Moldeada Siemens Sentron 3VA11 125A (SUG-S3125)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-S3125'") && seedCjs.includes("status: 'implemented'"), 'SUG-S3125 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-S3125') && sugJs.includes('Siemens Sentron 3VA11'), 'SUG-S3125 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_siemens_sentron_3va11_breaker_125a'), 'backup_data.js debe contener energia_siemens_sentron_3va11_breaker_125a');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'siemens-sentron-3va11-breaker-125a.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Siemens Sentron 3VA11 debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'3va11'") && catJs.includes("'3va1'"), 'catalog.js debe incluir 3va11 en stem variants');
  assert.ok(catJs.includes('3va11'), 'catalog.js debe priorizar Siemens Sentron 3VA11');
});

test('Mejora demandada por usuarios: Inversor Solar Residencial y Comercial Tesla Solar Inverter 7.6 kW (SUG-T7600)', () => {
  const seedCjs = fs.readFileSync(path.join(projectRoot, 'tools', 'seed-suggestions.cjs'), 'utf8');
  assert.ok(seedCjs.includes("refCode: 'SUG-T7600'") && seedCjs.includes("status: 'implemented'"), 'SUG-T7600 debe figurar como implemented en seed-suggestions.cjs');

  const sugJs = fs.readFileSync(path.join(projectRoot, 'js', 'suggestions.js'), 'utf8');
  assert.ok(sugJs.includes('SUG-T7600') && sugJs.includes('Tesla Solar Inverter'), 'SUG-T7600 debe figurar en el muro y lista canónica de suggestions.js');

  const backupJs = fs.readFileSync(path.join(projectRoot, 'js', 'backup_data.js'), 'utf8');
  assert.ok(backupJs.includes('energia_tesla_solar_inverter_76kw'), 'backup_data.js debe contener energia_tesla_solar_inverter_76kw');

  const imgPath = path.join(projectRoot, 'img', 'productos', 'catalogo', 'tesla-solar-inverter-76kw.webp');
  assert.ok(fs.existsSync(imgPath), 'La imagen del Tesla Solar Inverter debe existir en disco');

  const catJs = fs.readFileSync(path.join(projectRoot, 'js', 'catalog.js'), 'utf8');
  assert.ok(catJs.includes("'solarinverter'") && catJs.includes("'tesla-solar'"), 'catalog.js debe incluir solarinverter en stem variants');
  assert.ok(catJs.includes('tesla solar inverter'), 'catalog.js debe priorizar Tesla Solar Inverter');
});

test('Mejora demandada por usuarios: Cámara PTZ IP Uniview LightHunter 4MP 33x Zoom (SUG-U4330)', () => {
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

if (!testSugContent.includes(targetSugTest)) {
  console.error('Target suggestion test not found in test-suggestions.cjs');
  process.exit(1);
}
testSugContent = testSugContent.replace(targetSugTest, newSugTests);
fs.writeFileSync(testSugPath, testSugContent, 'utf8');
console.log('[OK] tools/test-suggestions.cjs actualizado con las 6 pruebas de Lote 30.');
