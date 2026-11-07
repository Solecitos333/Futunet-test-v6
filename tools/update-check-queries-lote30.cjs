const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'check-queries.cjs');
let content = fs.readFileSync(filePath, 'utf8');

const target = "  'm4250',\n  'netgear av'];";
const replacement = `  'm4250',
  'netgear av',
  'pca-m36',
  'mitsubishi piso techo',
  'hdv800',
  'panasonic conferencia',
  'nvx80',
  'paradox nvx80',
  '3va11',
  'breaker siemens 125a',
  'tesla solar inverter',
  'inversor tesla',
  'ipc6854',
  'uniview ptz'];`;

if (!content.includes(target)) {
  console.error('Target not found in check-queries.cjs');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('[OK] tools/check-queries.cjs actualizado con las consultas de Lote 30.');
