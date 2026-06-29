import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const publicDirectories = ['css', 'images', 'img', 'js'];
const publicRootFiles = new Set([
  'CNAME', 'manifest.json', 'robots.txt', 'sitemap.xml', 'sw.js',
  'favicon.ico', 'favicon.png'
]);

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

for (const directory of publicDirectories) {
  await fs.cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}

const entries = await fs.readdir(root, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile()) continue;
  if (!entry.name.endsWith('.html') && !publicRootFiles.has(entry.name)) continue;
  await fs.copyFile(path.join(root, entry.name), path.join(output, entry.name));
}

const copied = await fs.readdir(output, { recursive: true });
console.log(`Hosting preparado en dist/ con ${copied.length} entradas públicas.`);
