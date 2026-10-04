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
  'bateria',
  'zkteco',
  'biometrico',
  'ponchador',
  'reloj ponchador',
  'control de acceso',
  'control de asistencia',
  'disco duro purple',
  'wd purple',
  'gabinete de pared',
  'rack de pared',
  'cerradura magnetica',
  'electroiman',
  'chapa magnetica',
  'cerradura',
  'bobina utp',
  'cable utp cat 6',
  'bobina de cable',
  'boton no touch',
  'pulsador de salida',
  'tplink',
  'deco',
  'mesh',
  'wifi mesh',
  'patch panel',
  'patch cord',
  'latiguillo',
  'access point',
  'ap',
  'punto de acceso',
  'conector rj45',
  'plug rj45',
  'conectores',
  'crimpadora',
  'crimpadora rj45',
  'tester de red',
  'tester',
  'ezviz',
  'camara wifi',
  'c6n',
  'h3c'
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
