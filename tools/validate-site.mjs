import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const htmlFiles = (await fs.readdir(projectRoot)).filter(name => name.endsWith('.html'));
const cssDirectory = path.join(projectRoot, 'css');
const cssFiles = (await fs.readdir(cssDirectory)).filter(name => name.endsWith('.css'));
const errors = [];

function isLocalReference(value) {
  return value && !value.includes('${') && !value.includes('{{') &&
    !/^(?:[a-z]+:|#|\/\/|data:|javascript:)/i.test(value);
}

async function validateReference(sourceFile, rawReference) {
  const reference = rawReference.trim().split(/[?#]/, 1)[0];
  if (!isLocalReference(reference)) return;
  const resolved = reference.startsWith('/')
    ? path.join(projectRoot, reference.slice(1))
    : path.resolve(path.dirname(sourceFile), reference);
  try {
    await fs.access(resolved);
  } catch {
    errors.push(`${path.relative(projectRoot, sourceFile)}: falta ${rawReference}`);
  }
}

for (const fileName of htmlFiles) {
  const fullPath = path.join(projectRoot, fileName);
  const content = await fs.readFile(fullPath, 'utf8');
  if (content.includes('</noscript></noscript>')) errors.push(`${fileName}: cierre noscript duplicado`);
  if (/\b(?:src|href)\s*=\s*["']\s*["']/i.test(content)) errors.push(`${fileName}: referencia src/href vacía`);

  const attributePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  for (const match of content.matchAll(attributePattern)) {
    await validateReference(fullPath, match[1]);
  }
}

for (const fileName of cssFiles) {
  const fullPath = path.join(cssDirectory, fileName);
  const content = await fs.readFile(fullPath, 'utf8');
  const urlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of content.matchAll(urlPattern)) {
    await validateReference(fullPath, match[1]);
  }
}

for (const privatePage of ['admin.html', 'facturacion.html', 'login.html', 'mi-cuenta.html', 'marca-template.html']) {
  const content = await fs.readFile(path.join(projectRoot, privatePage), 'utf8');
  if (!/<meta\s+name=["']robots["'][^>]*noindex/i.test(content)) {
    errors.push(`${privatePage}: falta noindex`);
  }
}

const sitemap = await fs.readFile(path.join(projectRoot, 'sitemap.xml'), 'utf8');
for (const privatePage of ['admin.html', 'facturacion.html', 'login.html', 'mi-cuenta.html', 'marca-template.html']) {
  if (sitemap.includes(privatePage)) errors.push(`sitemap.xml: contiene página privada ${privatePage}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Sitio validado: ${htmlFiles.length} páginas HTML y ${cssFiles.length} hojas de estilo sin referencias locales rotas.`);
}
