const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const mockDatabase = require('../js/backup_data.js');
const catalogJs = fs.readFileSync(path.resolve(__dirname, '../js/catalog.js'), 'utf8');

const sandbox = { console };
vm.createContext(sandbox);

const start = catalogJs.indexOf('function normalizeSearch');
const end = catalogJs.indexOf('function getExplicitAvailability');
const snippet = catalogJs.substring(start, end);

vm.runInContext(snippet, sandbox);

const normalizeSearch = sandbox.normalizeSearch;
const scoreProductMatch = sandbox.scoreProductMatch;

const testQueries = [
  'proyector',
  'proyectores',
  'computadoras',
  'computadora',
  'laptop',
  'laptops',
  'aire acondicionado',
  'aire acondicionado tgm mini-split 18,000 btu',
  'aire',
  'tgm',
  'dell',
  'monitor',
  'airpods',
  'teclado',
  'escritorio',
  'papeleria',
  'suministros',
  'hikvision',
  'cisco',
  'ubiquiti',
  'ups',
  'silla',
  'sillas',
  'silla ergonomica',
  'forza',
  'mini pc',
  'hdv230',
  'panasonic',
  'srx300',
  'juniper',
  'sirius',
  'contactor'
];

test('Telemetría y Relevancia de Búsquedas en Catálogo Real: todas las consultas clave tienen resultados pertinentes', () => {
  for (const q of testQueries) {
    const normQ = normalizeSearch(q);
    const scored = mockDatabase
      .map(p => ({ p, score: scoreProductMatch(p, normQ) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    assert.ok(scored.length > 0, `La consulta "${q}" no debe arrojar 0 resultados en el catálogo`);

    if (q === 'mini pc') {
      assert.strictEqual(
        scored[0].p.brand,
        'Lenovo',
        'La búsqueda "mini pc" debe priorizar el Mini PC Lenovo ThinkCentre M70q Tiny'
      );
      assert.ok(
        /m70q|thinkcentre|tiny/i.test(scored[0].p.title),
        'El producto top para "mini pc" debe ser Lenovo ThinkCentre M70q Tiny'
      );
    }

    if (q === 'hdv230') {
      assert.strictEqual(
        scored[0].p.brand,
        'Panasonic',
        'La búsqueda "hdv230" debe priorizar el Teléfono IP Panasonic KX-HDV230'
      );
      assert.ok(
        /hdv230/i.test(scored[0].p.title),
        'El producto top para "hdv230" debe ser Panasonic KX-HDV230'
      );
    }

    if (q === 'srx300') {
      assert.strictEqual(
        scored[0].p.brand,
        'Juniper',
        'La búsqueda "srx300" debe priorizar el Gateway Juniper Networks SRX300'
      );
      assert.ok(
        /srx300/i.test(scored[0].p.title),
        'El producto top para "srx300" debe ser Juniper Networks SRX300'
      );
    }

    if (q === 'sirius') {
      assert.strictEqual(
        scored[0].p.brand,
        'Siemens',
        'La búsqueda "sirius" debe priorizar el Contactor Siemens Sirius 3RT'
      );
      assert.ok(
        /sirius|3rt/i.test(scored[0].p.title),
        'El producto top para "sirius" debe ser Siemens Sirius 3RT'
      );
    }
  }
});
