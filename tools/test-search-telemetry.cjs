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
  'forza'
];

console.log('Testing REAL catalog scoring for queries:');
for (const q of testQueries) {
  const normQ = normalizeSearch(q);
  const scored = mockDatabase
    .map(p => ({ p, score: scoreProductMatch(p, normQ) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  console.log(`Query "${q}" (normalized: "${normQ}") -> ${scored.length} results.`);
  if (scored.length > 0) {
    console.log(`   Top 1 (score ${scored[0].score}): [${scored[0].p.brand}] ${scored[0].p.title} (${scored[0].p.category})`);
    if (scored.length > 1) {
      console.log(`   Top 2 (score ${scored[1].score}): [${scored[1].p.brand}] ${scored[1].p.title}`);
    }
  } else {
    console.log(`   *** ZERO RESULTS ***`);
  }
}
