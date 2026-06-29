import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const config = JSON.parse(await fs.readFile(path.join(root, 'firebase.json'), 'utf8'));
const errors = [];

if (config.hosting?.public !== 'dist') errors.push('firebase.json: hosting.public debe apuntar a dist');
for (const required of ['index.html', 'facturacion.html', 'login.html', 'sw.js', 'js/facturacion.js', 'css/facturacion.css']) {
  try { await fs.access(path.join(dist, required)); }
  catch { errors.push(`dist: falta ${required}`); }
}

for (const forbidden of ['firebase.json', 'firestore.rules', 'storage.rules', 'tools', 'scratch', 'calendario_comercial.md']) {
  try {
    await fs.access(path.join(dist, forbidden));
    errors.push(`dist: archivo interno publicado (${forbidden})`);
  } catch { /* expected */ }
}

const csp = config.hosting?.headers
  ?.flatMap(rule => rule.headers || [])
  .find(header => header.key === 'Content-Security-Policy')?.value || '';
for (const requiredOrigin of [
  'https://unpkg.com',
  'https://cdnjs.cloudflare.com',
  'https://rnc.megaplus.com.do',
  'https://*.tile.openstreetmap.org'
]) {
  if (!csp.includes(requiredOrigin)) errors.push(`CSP: falta ${requiredOrigin}`);
}

if (csp.includes('localhost') || csp.includes('127.0.0.1')) {
  errors.push('CSP: no debe permitir conexiones a servidores locales en producción');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Hosting validado: solo artefactos públicos y CSP compatible.');
}
