const fs = require('fs');
const vm = require('vm');

// Extract the relevant functions to test independently
const code = fs.readFileSync('js/catalog.js', 'utf8');

const mockDatabase = [
  { id: 1, title: 'Laptop Dell', desc: '16GB RAM', category: 'Computadoras', brand: 'Dell' },
  { id: 2, title: 'Laptop HP', desc: '8GB RAM', category: 'Computadoras', brand: 'HP' },
];

const sandbox = {
  mockDatabase,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  lucide: { createIcons: () => {} },
  document: {
    createElement: () => ({ textContent: '', innerHTML: '' }),
    getElementById: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {}
  }
};

vm.createContext(sandbox);

try {
  vm.runInContext(code, sandbox);

  // Test if getNormalized works and caches properly
  const p1 = sandbox.mockDatabase[0];
  const p2 = sandbox.mockDatabase[1];

  const norm1_1 = sandbox.getNormalized(p1, 'title');
  const norm1_2 = sandbox.getNormalized(p1, 'title');

  if (norm1_1 !== norm1_2) {
      console.error("Test failed: cache returned different strings for same obj/key");
      process.exit(1);
  }

  if (norm1_1 !== 'laptop dell') {
      console.error("Test failed: getNormalized did not return expected value: " + norm1_1);
      process.exit(1);
  }

  // Test scoreProductMatch to ensure it works with the cache
  const score = sandbox.scoreProductMatch(p1, 'laptop');
  if (score === 0) {
      console.error("Test failed: scoreProductMatch returned 0 for a matching query");
      process.exit(1);
  }

  console.log("Tests passed!");
} catch (e) {
  console.error("Test failed due to exception:", e);
  process.exit(1);
}
