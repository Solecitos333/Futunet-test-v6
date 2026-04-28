const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

describe('inferDepartment logic tests', () => {
  let context;

  function loadScript() {
    context = vm.createContext({
      window: {},
      mockDatabase: []
    });
    const code = fs.readFileSync('js/supplier_inventory.js', 'utf8');

    // Minimal mock for slugify utility which might be provided externally
    const mockSlugify = `
      function slugify(str) {
        return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
    `;

    vm.runInContext(mockSlugify + '\n' + code, context);
  }

  it('should infer "equipos" department based on keywords in title and category', () => {
    loadScript();

    const policy = { defaultDepartment: 'default_dept' };
    const inferDepartment = context.window.supplierInventory.inferDepartment;

    const testCases = [
      { item: { title: 'Laptop gaming', category: '' }, expected: 'equipos' },
      { item: { title: 'My new computadora', category: '' }, expected: 'equipos' },
      { item: { title: '', category: 'Monitor 4k' }, expected: 'equipos' },
      { item: { title: 'periferico', category: 'accs' }, expected: 'equipos' },
      { item: { title: 'teclado mecanico', category: 'gaming' }, expected: 'equipos' },
      { item: { title: 'mouse inalambrico', category: 'accesorios' }, expected: 'equipos' },
      { item: { title: 'televisor OLED', category: 'TVs' }, expected: 'equipos' },
      { item: { title: 'Laptop', category: 'Monitor' }, expected: 'equipos' }
    ];

    testCases.forEach(({ item, expected }) => {
      assert.strictEqual(inferDepartment(item, policy), expected, `Failed for title: "${item.title}" / category: "${item.category}"`);
    });
  });

  it('should infer "oficina" department based on keywords in title and category', () => {
    loadScript();

    const policy = { defaultDepartment: 'default_dept' };
    const inferDepartment = context.window.supplierInventory.inferDepartment;

    const testCases = [
      { item: { title: 'Papeleria variada', category: '' }, expected: 'oficina' },
      { item: { title: 'Archivo de documentos', category: '' }, expected: 'oficina' },
      { item: { title: '', category: 'Silla ergonomica' }, expected: 'oficina' },
      { item: { title: 'Escritorio moderno', category: 'muebles' }, expected: 'oficina' },
      { item: { title: 'Mobiliario corporativo', category: '' }, expected: 'oficina' },
      { item: { title: 'Suministro general', category: '' }, expected: 'oficina' }
    ];

    testCases.forEach(({ item, expected }) => {
      assert.strictEqual(inferDepartment(item, policy), expected, `Failed for title: "${item.title}" / category: "${item.category}"`);
    });
  });

  it('should fallback to policy.defaultDepartment when no keywords match', () => {
    loadScript();

    const policy = { defaultDepartment: 'default_dept' };
    const inferDepartment = context.window.supplierInventory.inferDepartment;

    const testCases = [
      { item: { title: 'Pelota', category: 'Deportes' }, expected: 'default_dept' },
      { item: { title: 'Camiseta', category: 'Ropa' }, expected: 'default_dept' },
      { item: { title: '', category: '' }, expected: 'default_dept' },
      { item: {}, expected: 'default_dept' } // Edge case: missing properties
    ];

    testCases.forEach(({ item, expected }) => {
      assert.strictEqual(inferDepartment(item, policy), expected, `Failed for title: "${item.title}" / category: "${item.category}"`);
    });
  });
});
