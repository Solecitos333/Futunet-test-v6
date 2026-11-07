const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// 5. tools/test-search-telemetry.cjs
const testSearchPath = path.join(projectRoot, 'tools', 'test-search-telemetry.cjs');
let testSearchContent = fs.readFileSync(testSearchPath, 'utf8');

const targetSearchQuery = "  'neo 50s'];";
const newSearchQueries = `  'neo 50s',
  'pro sff 400',
  'mist ap43',
  '32un880',
  'lgs352mpc',
  'm4250'];`;

if (!testSearchContent.includes(targetSearchQuery)) {
  console.error('Target query not found in test-search-telemetry.cjs');
  process.exit(1);
}
testSearchContent = testSearchContent.replace(targetSearchQuery, newSearchQueries);

const targetSearchAssert = `    if (q === 'neo 50s') {
      assert.strictEqual(
        scored[0].p.brand,
        'Lenovo',
        'La búsqueda "neo 50s" debe priorizar la Computadora Lenovo ThinkCentre Neo 50s'
      );
      assert.ok(
        /neo\\s*50s/i.test(scored[0].p.title),
        'El producto top para "neo 50s" debe ser Lenovo ThinkCentre Neo 50s'
      );
    }`;

const newSearchAsserts = `${targetSearchAssert}

    if (q === 'pro sff 400') {
      assert.strictEqual(
        scored[0].p.brand,
        'HP',
        'La búsqueda "pro sff 400" debe priorizar la Computadora HP Pro SFF 400 G9'
      );
      assert.ok(
        /pro\\s*sff\\s*400/i.test(scored[0].p.title),
        'El producto top para "pro sff 400" debe ser HP Pro SFF 400 G9'
      );
    }

    if (q === 'mist ap43') {
      assert.strictEqual(
        scored[0].p.brand,
        'Juniper',
        'La búsqueda "mist ap43" debe priorizar el Punto de Acceso Juniper Mist AP43'
      );
      assert.ok(
        /ap43|mist/i.test(scored[0].p.title),
        'El producto top para "mist ap43" debe ser Juniper Mist AP43'
      );
    }

    if (q === '32un880') {
      assert.strictEqual(
        scored[0].p.brand,
        'LG',
        'La búsqueda "32un880" debe priorizar el Monitor LG UltraFine 32UN880-B Ergo'
      );
      assert.ok(
        /32un880/i.test(scored[0].p.title),
        'El producto top para "32un880" debe ser LG UltraFine 32UN880-B Ergo'
      );
    }

    if (q === 'lgs352mpc') {
      assert.strictEqual(
        scored[0].p.brand,
        'Linksys',
        'La búsqueda "lgs352mpc" debe priorizar el Switch Linksys LGS352MPC 48P'
      );
      assert.ok(
        /lgs352mpc/i.test(scored[0].p.title),
        'El producto top para "lgs352mpc" debe ser Linksys LGS352MPC 48P'
      );
    }

    if (q === 'm4250') {
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

if (!testSearchContent.includes(targetSearchAssert)) {
  console.error('Target assert not found in test-search-telemetry.cjs');
  process.exit(1);
}
testSearchContent = testSearchContent.replace(targetSearchAssert, newSearchAsserts);
fs.writeFileSync(testSearchPath, testSearchContent, 'utf8');
console.log('[OK] tools/test-search-telemetry.cjs actualizado con aserciones de Lote 29.');
