const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'));

console.log('Auditing', htmlFiles.length, 'HTML files in', projectRoot);

const missingScripts = [];
const missingStylesheets = [];
const missingImages = [];
const brokenLinks = [];

for (const f of htmlFiles) {
  const content = fs.readFileSync(path.join(projectRoot, f), 'utf8');

  // Check script src
  const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
      const cleanSrc = src.split('?')[0].split('#')[0];
      const fullPath = path.join(projectRoot, cleanSrc);
      if (!fs.existsSync(fullPath)) {
        missingScripts.push({ file: f, src, fullPath });
      }
    }
  }

  // Check stylesheet href
  const linkRegex = /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
  while ((match = linkRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const href = match[1];
    if (fullTag.includes('rel="stylesheet"') || fullTag.includes("rel='stylesheet'")) {
      if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('data:')) {
        const cleanHref = href.split('?')[0].split('#')[0];
        const fullPath = path.join(projectRoot, cleanHref);
        if (!fs.existsSync(fullPath)) {
          missingStylesheets.push({ file: f, href, fullPath });
        }
      }
    }
  }

  // Check img src
  const imgRegex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
      const cleanSrc = src.split('?')[0].split('#')[0];
      const fullPath = path.join(projectRoot, cleanSrc);
      if (!fs.existsSync(fullPath)) {
        missingImages.push({ file: f, src, fullPath });
      }
    }
  }

  // Check internal href links (a href="...")
  const aRegex = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
  while ((match = aRegex.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:') && !href.startsWith('#')) {
      const cleanHref = href.split('?')[0].split('#')[0];
      if (cleanHref) {
        const fullPath = path.join(projectRoot, cleanHref);
        if (!fs.existsSync(fullPath)) {
          brokenLinks.push({ file: f, href, fullPath });
        }
      }
    }
  }
}

console.log('--- AUDIT RESULTS ---');
console.log('Missing scripts:', missingScripts.length, missingScripts);
console.log('Missing stylesheets:', missingStylesheets.length, missingStylesheets);
console.log('Missing static images in HTML:', missingImages.length, missingImages);
console.log('Broken internal HTML links:', brokenLinks.length, brokenLinks);
