const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const jsDir = path.join(rootDir, 'js');
const aiJsDir = path.join(rootDir, 'ai', 'js');

console.log('=== FUTUNET DEVSECOPS DEEP SECURITY & PRIVACY AUDIT ===\n');

// 1. Audit target="_blank" without rel="noopener noreferrer"
console.log('--- 1. Auditing target="_blank" Links ---');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
let missingRel = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const targetRegex = /<a\s+[^>]*target\s*=\s*["']_blank["'][^>]*>/gi;
  let match;
  while ((match = targetRegex.exec(content)) !== null) {
    const tag = match[0];
    const relMatch = tag.match(/rel\s*=\s*["']([^"']+)["']/i);
    if (!relMatch) {
      missingRel.push({ file, tag, reason: 'Missing rel attribute' });
    } else {
      const relVal = relMatch[1].toLowerCase();
      if (!relVal.includes('noopener') || !relVal.includes('noreferrer')) {
        missingRel.push({ file, tag, reason: `Incomplete rel attribute: "${relVal}"` });
      }
    }
  }
}
console.log(`Missing or incomplete rel in HTML files: ${missingRel.length}`);
if (missingRel.length > 0) {
  missingRel.forEach(m => console.log(`  [${m.file}] ${m.reason} -> ${m.tag}`));
}

// 2. Audit postMessage handlers
console.log('\n--- 2. Auditing postMessage handlers ---');
const allJsFiles = [];
function collectJsFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      collectJsFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      allJsFiles.push(fullPath);
    }
  }
}
collectJsFiles(rootDir);

let postMessageIssues = [];
for (const filePath of allJsFiles) {
  const relPath = path.relative(rootDir, filePath);
  if (relPath.startsWith('dist') || relPath.startsWith('node_modules')) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("addEventListener('message'") || content.includes('addEventListener("message"')) {
    if (!content.includes('event.origin') && !content.includes('e.origin')) {
      postMessageIssues.push({ file: relPath, reason: 'message event listener without origin validation' });
    }
  }
}
console.log(`postMessage origin issues: ${postMessageIssues.length}`);
postMessageIssues.forEach(i => console.log(`  [${i.file}] ${i.reason}`));

// 3. Audit window.open calls
console.log('\n--- 3. Auditing window.open calls ---');
let windowOpenIssues = [];
for (const filePath of allJsFiles) {
  const relPath = path.relative(rootDir, filePath);
  if (relPath.startsWith('dist') || relPath.startsWith('node_modules') || relPath.startsWith('tools')) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('window.open(')) {
      if (!line.includes('noopener') || !line.includes('noreferrer')) {
        windowOpenIssues.push({ file: relPath, line: idx + 1, code: line.trim() });
      }
    }
  });
}
console.log(`window.open without noopener/noreferrer: ${windowOpenIssues.length}`);
windowOpenIssues.forEach(i => console.log(`  [${i.file}:${i.line}] ${i.code}`));

// 4. Audit innerHTML usage in JS files
console.log('\n--- 4. Auditing innerHTML in JS files ---');
let innerHTMLCount = 0;
let potentialXSS = [];
for (const filePath of allJsFiles) {
  const relPath = path.relative(rootDir, filePath);
  if (relPath.startsWith('dist') || relPath.startsWith('node_modules') || relPath.startsWith('tools')) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('.innerHTML =') || line.includes('.innerHTML+=')) {
      innerHTMLCount++;
      // Check if variables or template literals are interpolated without escape
      if (line.includes('${') && !line.includes('escape') && !line.includes('sanitize')) {
        // Sample check
        potentialXSS.push({ file: relPath, line: idx + 1, code: line.trim().slice(0, 100) });
      }
    }
  });
}
console.log(`Total innerHTML assignments: ${innerHTMLCount}`);
console.log(`Potentially unescaped template interpolations: ${potentialXSS.length}`);
potentialXSS.slice(0, 10).forEach(i => console.log(`  [${i.file}:${i.line}] ${i.code}`));

// 5. Audit sensitive info in localStorage
console.log('\n--- 5. Auditing localStorage keys ---');
const storageKeys = new Set();
for (const filePath of allJsFiles) {
  const relPath = path.relative(rootDir, filePath);
  if (relPath.startsWith('dist') || relPath.startsWith('node_modules') || relPath.startsWith('tools')) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.matchAll(/localStorage\.(?:setItem|getItem)\s*\(\s*['"]([^'"]+)['"]/g);
  for (const m of matches) {
    storageKeys.add(m[1]);
  }
}
console.log('localStorage keys found:', Array.from(storageKeys));

console.log('\n=== AUDIT COMPLETE ===');
