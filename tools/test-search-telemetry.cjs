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
  'contactor',
  'wall connector',
  'cassette',
  'ip150',
  'velop',
  'h8c',
  'meetup',
  'tl400b',
  'u6 pro'
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

    if (q === 'wall connector') {
      assert.strictEqual(
        scored[0].p.brand,
        'Tesla',
        'La búsqueda "wall connector" debe priorizar el Cargador Tesla Wall Connector Gen 3'
      );
      assert.ok(
        /wall\s*connector/i.test(scored[0].p.title),
        'El producto top para "wall connector" debe ser Tesla Wall Connector'
      );
    }

    if (q === 'cassette') {
      assert.strictEqual(
        scored[0].p.brand,
        'Mitsubishi',
        'La búsqueda "cassette" debe priorizar el Aire Acondicionado Cassette Mitsubishi Electric'
      );
      assert.ok(
        /cassette/i.test(scored[0].p.title),
        'El producto top para "cassette" debe ser Cassette Mitsubishi Electric'
      );
    }

    if (q === 'ip150') {
      assert.strictEqual(
        scored[0].p.brand,
        'Paradox',
        'La búsqueda "ip150" debe priorizar el Módulo Comunicador Paradox IP150+'
      );
      assert.ok(
        /ip150/i.test(scored[0].p.title),
        'El producto top para "ip150" debe ser Paradox IP150+'
      );
    }

    if (q === 'velop') {
      assert.strictEqual(
        scored[0].p.brand,
        'Linksys',
        'La búsqueda "velop" debe priorizar el Sistema Mesh Linksys Velop Pro 6E'
      );
      assert.ok(
        /velop/i.test(scored[0].p.title),
        'El producto top para "velop" debe ser Linksys Velop Pro 6E'
      );
    }

    if (q === 'h8c') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ezviz',
        'La búsqueda "h8c" debe priorizar la Cámara PTZ Exterior Ezviz H8c'
      );
      assert.ok(
        /h8c/i.test(scored[0].p.title),
        'El producto top para "h8c" debe ser Ezviz H8c'
      );
    }

    if (q === 'meetup') {
      assert.strictEqual(
        scored[0].p.brand,
        'Logitech',
        'La búsqueda "meetup" debe priorizar la Cámara de Videoconferencia Logitech MeetUp'
      );
      assert.ok(
        /meetup/i.test(scored[0].p.title),
        'El producto top para "meetup" debe ser Logitech MeetUp'
      );
    }

    if (q === 'tl400b') {
      assert.strictEqual(
        scored[0].p.brand,
        'ZKTeco',
        'La búsqueda "tl400b" debe priorizar la Cerradura Digital Inteligente ZKTeco TL400B'
      );
      assert.ok(
        /tl400b/i.test(scored[0].p.title),
        'El producto top para "tl400b" debe ser ZKTeco TL400B'
      );
    }

    if (q === 'u6 pro') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ubiquiti',
        'La búsqueda "u6 pro" debe priorizar el Punto de Acceso Ubiquiti UniFi 6 Pro'
      );
      assert.ok(
        /u6-pro|u6\s*pro/i.test(scored[0].p.title),
        'El producto top para "u6 pro" debe ser Ubiquiti UniFi 6 Pro'
      );
    }
  }
});

