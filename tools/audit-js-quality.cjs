const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');

// 1. Check all JS files for syntax errors
const jsFiles = [];
function findJs(dir) {
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'tmp') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findJs(full);
    } else if (item.endsWith('.js') || item.endsWith('.cjs') || item.endsWith('.mjs')) {
      jsFiles.push(full);
    }
  }
}
findJs(projectRoot);

console.log('Testing syntax of', jsFiles.length, 'JavaScript files...');
const syntaxErrors = [];
for (const file of jsFiles) {
  try {
    const code = fs.readFileSync(file, 'utf8');
    // If it's an ES module or contains import/export, wrap or check accordingly
    if (file.endsWith('.mjs') || code.includes('import ') || code.includes('export ')) {
      // standard VM Script might fail on import/export if not module
      new vm.SourceTextModule(code, { initializeImportMeta() {} });
    } else {
      new vm.Script(code);
    }
  } catch (err) {
    // If SourceTextModule is experimental or fails due to module type
    if (err.message && err.message.includes('Cannot use import statement') || err.message.includes('Unexpected token \'export\'')) {
      try {
        // Try module parsing
        new vm.SourceTextModule(fs.readFileSync(file, 'utf8'), { initializeImportMeta() {} });
      } catch (err2) {
        syntaxErrors.push({ file: path.relative(projectRoot, file), error: err2.message });
      }
    } else {
      syntaxErrors.push({ file: path.relative(projectRoot, file), error: err.message });
    }
  }
}
console.log('Syntax errors:', syntaxErrors.length, syntaxErrors);

// 2. Check HTML files for duplicate IDs
const htmlFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'));
const duplicateIds = [];
for (const f of htmlFiles) {
  const content = fs.readFileSync(path.join(projectRoot, f), 'utf8');
  const idRegex = /\bid=["']([^"']+)["']/gi;
  const ids = new Map();
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    const id = m[1];
    if (ids.has(id)) {
      ids.set(id, ids.get(id) + 1);
    } else {
      ids.set(id, 1);
    }
  }
  for (const [id, count] of ids.entries()) {
    if (count > 1) {
      duplicateIds.push({ file: f, id, count });
    }
  }
}
console.log('Duplicate IDs found in HTML files:', duplicateIds.length, duplicateIds);
