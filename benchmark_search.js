const fs = require('fs');
const catalogCode = fs.readFileSync('js/catalog.js', 'utf8');

// We need to execute the catalog code to get the normalizeSearch function.
// But we can just copy it for benchmarking.

function normalizeSearch(str) {
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00f1/g, 'n').replace(/\u00d1/g, 'n')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

const mockDatabase = [];
for (let i = 0; i < 5000; i++) {
  mockDatabase.push({
    title: `Producto de prueba con ácentos y ñ ${i}`,
    desc: `Descripción del producto de prueba con varios caracteres ${i}`,
    category: `Categoría ${i % 10}`,
    brand: `Marca ${i % 5}`
  });
}

const normalizedCache = new WeakMap();
function getNormalized(obj, key) {
  let cache = normalizedCache.get(obj);
  if (!cache) {
    cache = {};
    normalizedCache.set(obj, cache);
  }
  if (cache[key] === undefined) {
    cache[key] = normalizeSearch(obj[key]);
  }
  return cache[key];
}

console.time('Sin cache (1era vez)');
mockDatabase.forEach(p => {
  normalizeSearch(p.title);
  normalizeSearch(p.desc);
  normalizeSearch(p.category);
  normalizeSearch(p.brand);
});
console.timeEnd('Sin cache (1era vez)');

console.time('Sin cache (2da vez)');
mockDatabase.forEach(p => {
  normalizeSearch(p.title);
  normalizeSearch(p.desc);
  normalizeSearch(p.category);
  normalizeSearch(p.brand);
});
console.timeEnd('Sin cache (2da vez)');

console.time('Con cache (1era vez)');
mockDatabase.forEach(p => {
  getNormalized(p, 'title');
  getNormalized(p, 'desc');
  getNormalized(p, 'category');
  getNormalized(p, 'brand');
});
console.timeEnd('Con cache (1era vez)');

console.time('Con cache (2da vez)');
mockDatabase.forEach(p => {
  getNormalized(p, 'title');
  getNormalized(p, 'desc');
  getNormalized(p, 'category');
  getNormalized(p, 'brand');
});
console.timeEnd('Con cache (2da vez)');
