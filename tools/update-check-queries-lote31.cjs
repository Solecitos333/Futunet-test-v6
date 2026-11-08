const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'check-queries.cjs');
let content = fs.readFileSync(filePath, 'utf8');

const target = "  'ipc6854',\n  'uniview ptz'];";
const replacement = `  'ipc6854',
  'uniview ptz',
  'c9200',
  'catalyst 9200',
  'u6-enterprise',
  'unifi enterprise',
  'ccr2004',
  'mikrotik ccr',
  'eap670',
  'omada eap670',
  'l530u',
  'proyector epson laser',
  'srv6k',
  'ups rack apc 6000va'];`;

if (!content.includes(target)) {
  console.error('Target not found in check-queries.cjs');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('[OK] tools/check-queries.cjs actualizado con las consultas de Lote 31.');
