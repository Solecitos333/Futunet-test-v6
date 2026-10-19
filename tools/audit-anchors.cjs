const fs = require('fs');
const path = require('path');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const fileAnchors = new Map();

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const ids = new Set();
  const idMatches = c.matchAll(/id=["']([^"']+)["']/g);
  for (const m of idMatches) ids.add(m[1]);
  fileAnchors.set(f, ids);
});

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const hrefMatches = c.matchAll(/href=["']([^"']+)["']/g);
  for (const m of hrefMatches) {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href === '#') continue;
    
    // Internal link
    const noHash = href.split('#')[0];
    const hash = href.split('#')[1];
    const targetFile = noHash.split('?')[0];
    
    if (targetFile) {
      if (!fs.existsSync(targetFile)) {
        console.log(`Broken file link in ${f}: href="${href}"`);
      } else if (hash && fileAnchors.has(targetFile)) {
        if (!fileAnchors.get(targetFile).has(hash)) {
          console.log(`Broken anchor in ${f}: ${targetFile}#${hash}`);
        }
      }
    } else if (hash) {
      if (!fileAnchors.get(f).has(hash)) {
        console.log(`Broken anchor in ${f}: #${hash}`);
      }
    }
  }
});
