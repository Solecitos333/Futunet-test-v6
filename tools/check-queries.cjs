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

const queries = [
  'pos',
  'lector de codigo de barra',
  'lector',
  'scanner',
  'gaveta de dinero',
  'cajon',
  'cajon de dinero',
  'cable utp',
  'bobina',
  'rj45',
  'disco duro',
  'ssd',
  'servidor',
  'rack',
  'gabinete de red',
  'dahua',
  'inversor',
  'bateria'
];

for (const q of queries) {
  const normQ = normalizeSearch(q);
  const scored = mockDatabase
    .map(p => ({ p, score: scoreProductMatch(p, normQ) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  console.log(`Query: "${q}" -> ${scored.length} results.`);
  if (scored.length > 0) {
    console.log(`   Top: [${scored[0].p.brand}] ${scored[0].p.title} (score: ${scored[0].score})`);
  } else {
    console.log(`   *** ZERO RESULTS ***`);
  }
}
