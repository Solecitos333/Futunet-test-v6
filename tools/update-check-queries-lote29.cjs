const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'check-queries.cjs');
let content = fs.readFileSync(filePath, 'utf8');

const target = "  'neo 50s',\n  'lenovo neo'];";
const replacement = `  'neo 50s',
  'lenovo neo',
  'pro sff 400',
  'hp 400 g9',
  'mist ap43',
  'juniper mist',
  '32un880',
  'lg ergo 32',
  'lgs352mpc',
  'linksys 48',
  'm4250',
  'netgear av'];`;

if (!content.includes(target)) {
  console.error('Target not found in check-queries.cjs');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('[OK] tools/check-queries.cjs actualizado.');
