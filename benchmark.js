const fs = require('fs');
const code = fs.readFileSync('js/catalog.js', 'utf8');

// Mock DOM
global.document = {
  createElement: () => ({ textContent: '', innerHTML: '' }),
  getElementById: () => null,
  addEventListener: () => {}
};
global.window = {
  innerWidth: 1024,
  addEventListener: () => {}
};
global.setTimeout = setTimeout;
global.clearTimeout = clearTimeout;

// Extract functions to test
const script = new (require('vm').Script)(code);
const ctx = require('vm').createContext(global);
script.runInContext(ctx);

// Mock database
global.mockDatabase = [];
for (let i = 0; i < 5000; i++) {
  global.mockDatabase.push({
    id: 'prod_' + i,
    title: 'Producto de prueba ' + i + (i % 2 === 0 ? ' especial' : ''),
    desc: 'Descripción del producto de prueba que contiene detalles.',
    category: 'Categoría ' + (i % 10),
    brand: 'Marca ' + (i % 5),
    price: 'RD$ 1,000.00'
  });
}

function runBenchmark(name, fn) {
  const start = process.hrtime.bigint();
  for(let i=0; i<50; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  console.log(`${name}: ${Number(end - start) / 1e6}ms`);
}

// Current implementation
function currentSearch(q) {
  return global.mockDatabase
    .map(p => ({ product: p, score: global.scoreProductMatch(p, q) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.product);
}

const q = global.normalizeSearch('especial marca 1');
runBenchmark('currentSearch', () => currentSearch(q));


const normalizeCache = new WeakMap();
function getNormalized(obj, key) {
  let objCache = normalizeCache.get(obj);
  if (!objCache) {
    objCache = {};
    normalizeCache.set(obj, objCache);
  }
  if (objCache[key] === undefined) {
    objCache[key] = global.normalizeSearch(obj[key]);
  }
  return objCache[key];
}

function scoreProductMatchOptimized(product, normalizedQuery) {
  const title = getNormalized(product, 'title');
  const desc = getNormalized(product, 'desc');
  const category = getNormalized(product, 'category');
  const brand = getNormalized(product, 'brand');
  let score = 0;
  if (title.includes(normalizedQuery)) score += 100;
  else if (global.fuzzyMatch(title, normalizedQuery)) score += 60;
  if (brand.includes(normalizedQuery)) score += 80;
  else if (global.fuzzyMatch(brand, normalizedQuery)) score += 40;
  if (category.includes(normalizedQuery)) score += 70;
  else if (global.fuzzyMatch(category, normalizedQuery)) score += 35;
  if (global.fuzzyMatch(desc, normalizedQuery)) score += 20;
  return score;
}

function optimizedSearch(q) {
  const scored = [];
  for (let i = 0; i < global.mockDatabase.length; i++) {
    const p = global.mockDatabase[i];
    const score = scoreProductMatchOptimized(p, q);
    if (score > 0) {
      scored.push({ product: p, score });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const results = new Array(scored.length);
  for (let i = 0; i < scored.length; i++) {
    results[i] = scored[i].product;
  }
  return results;
}

runBenchmark('optimizedSearch', () => optimizedSearch(q));
