const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const jsDir = path.join(rootDir, 'js');
const aiJsDir = path.join(rootDir, 'ai', 'js');

console.log('=== DEEP DEVSECOPS & OWASP AUDIT ===\n');

// 1. Audit string concatenations and template literals in innerHTML
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
if (fs.existsSync(aiJsDir)) {
  fs.readdirSync(aiJsDir).filter(f => f.endsWith('.js')).forEach(f => jsFiles.push(path.join('..', 'ai', 'js', f)));
}

let innerHtmlIssues = [];
jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('.innerHTML') && (line.includes('=') || line.includes('+='))) {
      // Check if it's just clearing: .innerHTML = '' or .innerHTML = ""
      if (/\.innerHTML\s*=\s*['"]\s*['"];?/.test(line)) return;
      // Check if it's static HTML without variables
      const hasInterpolation = line.includes('${');
      const hasPlusConcat = line.includes('+') && !line.includes('+= \'') && !line.includes('+= "') && !line.includes('++');
      if (hasInterpolation || hasPlusConcat) {
        const hasSanitization = /escapeHtml|escapeXml|escapeAttr|sanitize|encodeURIComponent|Number\(|parseInt\(|parseFloat\(|Math\./i.test(line);
        if (!hasSanitization) {
          innerHtmlIssues.push({ file, line: idx + 1, code: line.trim() });
        }
      }
    }
  });
});

console.log(`--- 1. innerHTML potential unescaped sinks (${innerHtmlIssues.length}) ---`);
innerHtmlIssues.slice(0, 30).forEach(i => console.log(`[${i.file}:${i.line}] ${i.code}`));

// 2. Audit eval(), Function(), setTimeout/setInterval with string
let evalIssues = [];
jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split('\n');
  lines.forEach((line, idx) => {
    if (/\beval\s*\(/.test(line) && !line.includes('//')) {
      evalIssues.push({ file, line: idx + 1, type: 'eval', code: line.trim() });
    }
    if (/new\s+Function\s*\(/.test(line)) {
      evalIssues.push({ file, line: idx + 1, type: 'Function constructor', code: line.trim() });
    }
    if (/setTimeout\s*\(\s*['"`]/.test(line) || /setInterval\s*\(\s*['"`]/.test(line)) {
      evalIssues.push({ file, line: idx + 1, type: 'timer string exec', code: line.trim() });
    }
  });
});

console.log(`\n--- 2. Code Execution Sinks (eval/Function/timer string): ${evalIssues.length} ---`);
evalIssues.forEach(i => console.log(`[${i.file}:${i.line}] (${i.type}) ${i.code}`));

// 3. Audit LocalStorage Secrets
console.log('\n--- 3. LocalStorage Keys and Usage ---');
const storageMap = {};
jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const matches = code.matchAll(/localStorage\.(setItem|getItem|removeItem)\s*\(\s*['"]([^'"]+)['"]/g);
  for (const m of matches) {
    const key = m[2];
    if (!storageMap[key]) storageMap[key] = [];
    storageMap[key].push({ file, action: m[1] });
  }
});
for (const [key, usages] of Object.entries(storageMap)) {
  console.log(`Key: "${key}" used in ${usages.map(u => `${u.file} (${u.action})`).join(', ')}`);
}

// 4. Audit Open Redirect vectors
console.log('\n--- 4. Location Redirects and URL Params ---');
let redirectIssues = [];
jsFiles.forEach(file => {
  const filePath = path.join(jsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split('\n');
  lines.forEach((line, idx) => {
    if (/(?:window\.)?location(?:\.href)?\s*=\s*/.test(line) || /location\.replace\s*\(/.test(line) || /location\.assign\s*\(/.test(line)) {
      redirectIssues.push({ file, line: idx + 1, code: line.trim() });
    }
  });
});
console.log(`Total location assignments: ${redirectIssues.length}`);
redirectIssues.slice(0, 15).forEach(i => console.log(`[${i.file}:${i.line}] ${i.code}`));

// 5. Audit Subresource Integrity (SRI) on external scripts & styles
console.log('\n--- 5. Subresource Integrity (SRI) Audit ---');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
let externalScripts = [];
let externalStyles = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const scriptRegex = /<script\b([^>]*src=['"]https?:\/\/[^'"]+['"][^>]*)>/gi;
  let m;
  while ((m = scriptRegex.exec(content)) !== null) {
    const fullTag = m[1];
    const srcMatch = fullTag.match(/src=['"]([^'"]+)['"]/i);
    const src = srcMatch ? srcMatch[1] : '';
    const hasIntegrity = fullTag.includes('integrity=');
    externalScripts.push({ file, src, hasIntegrity });
  }

  const linkRegex = /<link\b([^>]*href=['"]https?:\/\/[^'"]+['"][^>]*)>/gi;
  while ((m = linkRegex.exec(content)) !== null) {
    const fullTag = m[1];
    const hrefMatch = fullTag.match(/href=['"]([^'"]+)['"]/i);
    const href = hrefMatch ? hrefMatch[1] : '';
    if (fullTag.includes('rel="stylesheet"') || fullTag.includes("rel='stylesheet'")) {
      const hasIntegrity = fullTag.includes('integrity=');
      externalStyles.push({ file, href, hasIntegrity });
    }
  }
});

const scriptsNoSRI = externalScripts.filter(s => !s.hasIntegrity);
const stylesNoSRI = externalStyles.filter(s => !s.hasIntegrity);
console.log(`External scripts without SRI: ${scriptsNoSRI.length} (out of ${externalScripts.length})`);
const uniqueScriptsNoSRI = [...new Set(scriptsNoSRI.map(s => s.src))];
console.log('Unique external script URLs without SRI:', uniqueScriptsNoSRI);

console.log(`External stylesheets without SRI: ${stylesNoSRI.length} (out of ${externalStyles.length})`);
const uniqueStylesNoSRI = [...new Set(stylesNoSRI.map(s => s.href))];
console.log('Unique external stylesheet URLs without SRI:', uniqueStylesNoSRI);

