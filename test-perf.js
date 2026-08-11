const fs = require('fs');
let code = fs.readFileSync('js/inventory_data.js', 'utf8');
code = code.replace(/^\uFEFF/, '');
code = code.replace('const mockDatabase', 'global.mockDatabase');
eval(code);

function normalizeText(value) {
    return String(value || '')
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã/g, 'Á')
      .replace(/Ã‰/g, 'É')
      .replace(/Ã/g, 'Í')
      .replace(/Ã“/g, 'Ó')
      .replace(/Ãš/g, 'Ú')
      .replace(/â€“/g, '–')
      .replace(/â€”/g, '—')
      .replace(/â€œ/g, '“')
      .replace(/â€/g, '”')
      .replace(/Â/g, '')
      .trim();
  }

function scoreProduct(item) {
    let score = 0;
    const title = String(item.title || '');
    const brand = String(item.brand || '').toLowerCase();

    if (brand && brand !== 'genérico') score += 5;
    if (['equipos', 'redes', 'seguridad', 'oficina'].includes(item.department)) score += 4;
    if (Array.isArray(item.gallery) && item.gallery.length > 1) score += 2;
    if (/laptop|computadora|monitor|impresora|cámara|camera|router|switch|televisor|proyector|tv/i.test(title)) score += 3;
    if (String(item.img || '').includes('placeholder')) score -= 4;

    return score;
}

let items = global.mockDatabase;
// Multiply to ~5000 items
while(items.length < 5000) {
    items = items.concat(global.mockDatabase.map(x => ({...x, id: x.id + Math.random()})));
}
console.log('Items count:', items.length);

const start = Date.now();
for (let i = 0; i < 10; i++) {
  [...items].sort((a, b) => scoreProduct(b) - scoreProduct(a) || normalizeText(a.title).localeCompare(normalizeText(b.title)));
}
console.log('Old sort time (10x):', Date.now() - start, 'ms');

const start2 = Date.now();
for (let i = 0; i < 10; i++) {
  const scoredItems = items.map(item => ({
      item,
      score: scoreProduct(item),
      titleNormalized: normalizeText(item.title)
  }));
  scoredItems.sort((a, b) => b.score - a.score || a.titleNormalized.localeCompare(b.titleNormalized));
  scoredItems.map(x => x.item);
}
console.log('New sort time (10x):', Date.now() - start2, 'ms');
