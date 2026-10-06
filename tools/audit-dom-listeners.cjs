const fs = require('fs');
const path = require('path');

const jsDir = path.resolve(__dirname, '../js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

const unsafeProps = ['classList', 'style', 'value', 'innerHTML', 'innerText', 'textContent', 'setAttribute', 'getAttribute', 'removeAttribute', 'focus', 'click'];
const fileCounts = {};
const issuesByFile = {};

for (const f of files) {
  const content = fs.readFileSync(path.join(jsDir, f), 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    for (const prop of unsafeProps) {
      const regexGetEl = new RegExp(`document\\.getElementById\\(['"][^'"]+['"]\\)\\.${prop}\\b`);
      if (regexGetEl.test(line)) {
        fileCounts[f] = (fileCounts[f] || 0) + 1;
        if (!issuesByFile[f]) issuesByFile[f] = [];
        issuesByFile[f].push({ line: idx + 1, code: line.trim() });
      }

      const regexQuery = new RegExp(`document\\.querySelector\\(['"][^'"]+['"]\\)\\.${prop}\\b`);
      if (regexQuery.test(line)) {
        fileCounts[f] = (fileCounts[f] || 0) + 1;
        if (!issuesByFile[f]) issuesByFile[f] = [];
        issuesByFile[f].push({ line: idx + 1, code: line.trim() });
      }
    }
  });
}

console.log('Unchecked accesses by file:', fileCounts);

// Look specifically in public-facing client pages (not admin)
const publicFiles = ['main.js', 'catalog.js', 'cart.js', 'brand-page-loader.js', 'service-page.js', 'user-panel.js', 'public-quote.js', 'suggestions.js', 'chatbot.js', 'internet-portal.js', 'form.js', 'producto.js'];

for (const pf of publicFiles) {
  if (issuesByFile[pf]) {
    console.log(`\n--- ${pf} (${issuesByFile[pf].length} occurrences) ---`);
    issuesByFile[pf].slice(0, 10).forEach(i => console.log(`  Line ${i.line}: ${i.code}`));
  }
}
