const fs = require('fs');
const inventoryCode = fs.readFileSync('./js/inventory_data.js', 'utf8').replace(/^\uFEFF/, '').replace('const mockDatabase =', 'global.mockDatabase =');
eval(inventoryCode);

const mockDatabaseLength = global.mockDatabase.length;
console.log('Database size:', mockDatabaseLength);

// simulate cartState
const cartState = { items: {} };
for (let i = 0; i < 100; i++) {
  const item = global.mockDatabase[i % mockDatabaseLength];
  cartState.items[item.id] = { qty: 1 };
}

function baseline_getCartItems() {
  return Object.keys(cartState.items).map((id) => {
    const product = global.mockDatabase.find((item) => item.id === id);
    return product ? { ...product, qty: cartState.items[id].qty } : null;
  }).filter(Boolean);
}

function baseline_addToCart(productId, qty = 1) {
  const product = global.mockDatabase.find(p => p.id === productId);
  if (!product) return;
  const currentQty = cartState.items[productId]?.qty || 0;
  cartState.items[productId] = { qty: currentQty + qty };
}

const startBaseline = performance.now();
for (let i = 0; i < 1000; i++) {
  baseline_getCartItems();
  for(let j=0; j<10; j++) {
      baseline_addToCart(global.mockDatabase[j].id, 1);
  }
}
const endBaseline = performance.now();
console.log('Baseline:', endBaseline - startBaseline, 'ms');

// Setup map
const productMap = new Map();
global.mockDatabase.forEach(p => productMap.set(p.id, p));

function optimized_getCartItems() {
  return Object.keys(cartState.items).map((id) => {
    const product = productMap.get(id);
    return product ? { ...product, qty: cartState.items[id].qty } : null;
  }).filter(Boolean);
}

function optimized_addToCart(productId, qty = 1) {
  const product = productMap.get(productId);
  if (!product) return;
  const currentQty = cartState.items[productId]?.qty || 0;
  cartState.items[productId] = { qty: currentQty + qty };
}

const startOptimized = performance.now();
for (let i = 0; i < 1000; i++) {
  optimized_getCartItems();
  for(let j=0; j<10; j++) {
      optimized_addToCart(global.mockDatabase[j].id, 1);
  }
}
const endOptimized = performance.now();
console.log('Optimized:', endOptimized - startOptimized, 'ms');
