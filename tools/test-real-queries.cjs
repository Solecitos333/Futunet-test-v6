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

const realQueries = [
  'escritorio',
  'computadoras',
  'impresora',
  'dell',
  'core',
  'librero de madera',
  'laptop dell latitude 5330 core i7, 16 gb ram, 256 gb ssd, 13.3 pulgadas',
  'suministro',
  'core i5 2.7/3.4 mhz 8gb ram  250/500gb dd usados dell sff - desktop generacion 7',
  'proyector',
  'aire',
  'aire acondicionado tgm mini-split 18,000 btu',
  'hikvision',
  'lg',
  'airpods',
  'escritorio ejecutivo blanco con panel frontal',
  'monitor',
  'pantalla',
  'mobiliario',
  'laptop',
  'laptop dell latitude 7390 touch core i7, 16 gb ram, 256 gb ssd, 13.3 pulgadas',
  'tgm',
  'laptop dell latitude 5480 core i5, 8 gb ram, 128 gb ssd, 14 pulgadas',
  'teclado'
];

realQueries.forEach(q => {
  const norm = normalizeSearch(q);
  const matches = mockDatabase
    .map(p => ({ p, score: scoreProductMatch(p, norm) }))
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score);
  const top = matches.length > 0 ? `Top: [${matches[0].p.brand}] ${matches[0].p.title.slice(0, 50)} (score: ${matches[0].score})` : '*** ZERO RESULTS ***';
  console.log(`Query: "${q}" -> Results: ${matches.length} | ${top}`);
});
