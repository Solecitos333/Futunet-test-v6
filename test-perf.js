const { performance } = require('perf_hooks');

function normalizeSearch(str) {
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00f1/g, 'n').replace(/\u00d1/g, 'n')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

const mockDatabase = Array.from({length: 1000}, (_, i) => ({
  title: "Laptop Dell Inspiron " + i,
  desc: "A great laptop with 16GB RAM and 512GB SSD " + i,
  category: "Computadoras",
  brand: "Dell"
}));

const normalizedCache = new WeakMap();

function getNormalized(obj, key) {
  let objCache = normalizedCache.get(obj);
  if (!objCache) {
    objCache = {};
    normalizedCache.set(obj, objCache);
  }
  if (objCache[key] === undefined) {
    objCache[key] = normalizeSearch(obj[key]);
  }
  return objCache[key];
}

// Old way
const startOld = performance.now();
for (let j = 0; j < 50; j++) {
  let score = 0;
  mockDatabase.forEach(p => {
    const nCat = normalizeSearch(p.category);
    const nBrand = normalizeSearch(p.brand);
    const nTitle = normalizeSearch(p.title);
    const nDesc = normalizeSearch(p.desc);
    score += nCat.length + nBrand.length + nTitle.length + nDesc.length;
  });
}
const timeOld = performance.now() - startOld;

// New way
const startNew = performance.now();
for (let j = 0; j < 50; j++) {
  let score = 0;
  mockDatabase.forEach(p => {
    const nCat = getNormalized(p, 'category');
    const nBrand = getNormalized(p, 'brand');
    const nTitle = getNormalized(p, 'title');
    const nDesc = getNormalized(p, 'desc');
    score += nCat.length + nBrand.length + nTitle.length + nDesc.length;
  });
}
const timeNew = performance.now() - startNew;

console.log(`Old: ${timeOld.toFixed(2)}ms, New: ${timeNew.toFixed(2)}ms`);
