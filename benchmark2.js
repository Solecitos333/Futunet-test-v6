const fs = require('fs');
const inventoryCode = fs.readFileSync('./js/inventory_data.js', 'utf8').replace(/^\uFEFF/, '').replace('const mockDatabase =', 'global.mockDatabase =');
eval(inventoryCode);

const mockDatabaseLength = global.mockDatabase.length;

// simulate cartState
const cartState = { items: {} };
for (let i = 0; i < 100; i++) {
  const item = global.mockDatabase[i % mockDatabaseLength];
  cartState.items[item.id] = { qty: 1 };
}

let _productMapCache = null;
let _lastMockDatabaseLength = -1;

function getProductById(id) {
  if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
    if (!_productMapCache || mockDatabase.length !== _lastMockDatabaseLength) {
      _productMapCache = new Map();
      mockDatabase.forEach(p => _productMapCache.set(p.id, p));
      _lastMockDatabaseLength = mockDatabase.length;
    }
    return _productMapCache.get(id);
  }
  return undefined;
}

function optimized_getCartItems() {
  return Object.keys(cartState.items).map((id) => {
    const product = getProductById(id);
    return product ? { ...product, qty: cartState.items[id].qty } : null;
  }).filter(Boolean);
}

function optimized_addToCart(productId, qty = 1) {
  const product = getProductById(productId);
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
console.log('Optimized with new implementation:', endOptimized - startOptimized, 'ms');
