const fs = require('fs');
const path = require('path');
const brandFiles = fs.readdirSync(path.resolve(__dirname, '..')).filter(f => f.startsWith('marca-') && f.endsWith('.html') && f !== 'marca-template.html');
const backupProducts = require('../js/backup_data.js');

function matchesBrandLocal(productBrand, targetBrand) {
  if (!targetBrand || targetBrand === 'all') return true;
  if (!productBrand) return false;
  const pb = String(productBrand).toLowerCase().trim();
  const tb = String(targetBrand).toLowerCase().trim();
  if (pb === tb) return true;
  const normP = pb.replace(/[^a-z0-9]/g, '');
  const normT = tb.replace(/[^a-z0-9]/g, '');
  if (normP === normT) return true;
  if ((normP === 'unv' && normT === 'uniview') || (normP === 'uniview' && normT === 'unv')) return true;
  if (normP === 'tplink' && normT === 'tplink') return true;
  if ((normP === 'tapo' && normT === 'tplink') || (normP === 'tplink' && normT === 'tapo')) return true;
  if ((normP.includes('schneider') || normP.includes('apc')) && (normT.includes('schneider') || normT.includes('apc'))) return true;
  if ((normP === 'victron' && normT === 'victronenergy') || (normP === 'victronenergy' && normT === 'victron')) return true;
  return false;
}

console.log('Total brand pages:', brandFiles.length);
for (const f of brandFiles) {
  const content = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  const m = content.match(/data-brand-name=["']([^"']+)["']/i);
  const brandName = m ? m[1] : 'UNKNOWN';
  const prods = backupProducts.filter(p => matchesBrandLocal(p.brand, brandName));
  console.log(f.padEnd(30), 'Brand:', brandName.padEnd(20), 'Products:', prods.length);
}
