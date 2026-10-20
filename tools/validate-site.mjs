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
  const markupOnly = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  if (content.includes('</noscript></noscript>')) errors.push(`${fileName}: cierre noscript duplicado`);
  const noscriptOpens = (content.match(/<noscript\b[^>]*>/gi) || []).length;
  const noscriptCloses = (content.match(/<\/noscript>/gi) || []).length;
  if (noscriptOpens !== noscriptCloses) {
    errors.push(`${fileName}: etiquetas noscript desbalanceadas (${noscriptOpens} aperturas vs ${noscriptCloses} cierres)`);
  }
  for (const match of content.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    if (!match[0].includes('rel=') || !match[0].includes('noopener')) {
      errors.push(`${fileName}: enlace target="_blank" sin rel="noopener" seguro (${match[0].slice(0, 80)})`);
    }
  }
  if (/\b(?:src|href)\s*=\s*(["'])\s*\1/i.test(markupOnly)) errors.push(`${fileName}: referencia src/href vacía`);

  const ids = [...markupOnly.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) errors.push(`${fileName}: IDs duplicados (${duplicateIds.join(', ')})`);

  let formDepth = 0;
  for (const match of markupOnly.matchAll(/<\/?form\b[^>]*>/gi)) {
    if (/^<\/form/i.test(match[0])) {
      formDepth--;
      if (formDepth < 0) errors.push(`${fileName}: cierre de formulario sin apertura`);
    } else {
      formDepth++;
      if (formDepth > 1) errors.push(`${fileName}: formularios anidados`);
    }
  }
  if (formDepth !== 0) errors.push(`${fileName}: etiquetas form desbalanceadas`);

  const attributePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  for (const match of markupOnly.matchAll(attributePattern)) {
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

const privatePages = ['admin.html', 'facturacion.html', 'login.html', 'mi-cuenta.html', 'marca-template.html', 'cotizacion.html'];
for (const privatePage of privatePages) {
  const content = await fs.readFile(path.join(projectRoot, privatePage), 'utf8');
  if (!/<meta\s+name=["']robots["'][^>]*noindex/i.test(content)) {
    errors.push(`${privatePage}: falta noindex`);
  }
}

const sitemap = await fs.readFile(path.join(projectRoot, 'sitemap.xml'), 'utf8');
for (const privatePage of privatePages) {
  if (sitemap.includes(privatePage)) errors.push(`sitemap.xml: contiene página privada ${privatePage}`);
}

// Comprobación DevSecOps: asegurar integridad de imágenes (sin HTML masquerading o MIME confusion)
const imgDirectory = path.join(projectRoot, 'img');
async function scanImageIntegrity(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanImageIntegrity(full);
    } else if (/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) {
      const handle = await fs.open(full, 'r');
      const buf = Buffer.alloc(16);
      await handle.read(buf, 0, 16, 0);
      await handle.close();
      const headerStr = buf.toString('utf8', 0, 16).trimStart();
      if (headerStr.startsWith('<!DOCTYPE') || headerStr.startsWith('<html') || headerStr.startsWith('<?xml')) {
        errors.push(`${path.relative(projectRoot, full)}: archivo corrupto con contenido HTML/XML en lugar de binario`);
      }
    }
  }
}
await scanImageIntegrity(imgDirectory);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Sitio validado: ${htmlFiles.length} páginas HTML y ${cssFiles.length} hojas de estilo sin referencias locales rotas.`);
}
