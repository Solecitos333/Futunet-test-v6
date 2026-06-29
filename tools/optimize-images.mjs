import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = path.resolve(import.meta.dirname, '..');
const assetRoots = ['img', 'images'];
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.webmanifest']);
const minimumBytes = 500 * 1024;
const excludedNames = /^(?:favicon|icon-|apple-touch)/i;

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const allFiles = await walk(projectRoot);
const textFiles = allFiles.filter(file => textExtensions.has(path.extname(file).toLowerCase()));
const candidates = allFiles.filter(file => {
  const relative = path.relative(projectRoot, file).replaceAll('\\', '/');
  const extension = path.extname(file).toLowerCase();
  return assetRoots.some(root => relative.startsWith(`${root}/`)) &&
    ['.png', '.jpg', '.jpeg'].includes(extension) &&
    !excludedNames.test(path.basename(file));
});

let totalBefore = 0;
let totalAfter = 0;
let convertedCount = 0;

for (const inputPath of candidates) {
  const inputStat = await fs.stat(inputPath);
  if (inputStat.size < minimumBytes) continue;

  const oldRelative = path.relative(projectRoot, inputPath).replaceAll('\\', '/');
  const newRelative = oldRelative.replace(/\.(?:png|jpe?g)$/i, '.webp');
  const outputPath = path.join(projectRoot, newRelative);
  const temporaryPath = `${outputPath}.tmp`;

  let references = 0;
  for (const textFile of textFiles) {
    if (textFile === inputPath) continue;
    const content = await fs.readFile(textFile, 'utf8');
    references += content.split(oldRelative).length - 1;
    references += content.split(`../${oldRelative}`).length - 1;
  }
  if (references === 0) continue;

  await sharp(inputPath)
    .rotate()
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(temporaryPath);

  const outputStat = await fs.stat(temporaryPath);
  if (outputStat.size >= inputStat.size * 0.9) {
    await fs.unlink(temporaryPath);
    continue;
  }

  await fs.rename(temporaryPath, outputPath).catch(async () => {
    await fs.rm(outputPath, { force: true });
    await fs.rename(temporaryPath, outputPath);
  });

  for (const textFile of textFiles) {
    let content = await fs.readFile(textFile, 'utf8');
    const updated = content
      .replaceAll(`../${oldRelative}`, `../${newRelative}`)
      .replaceAll(oldRelative, newRelative);
    if (updated !== content) await fs.writeFile(textFile, updated, 'utf8');
  }

  await fs.unlink(inputPath);
  totalBefore += inputStat.size;
  totalAfter += outputStat.size;
  convertedCount += 1;
  console.log(`${oldRelative} -> ${newRelative} (${Math.round(inputStat.size / 1024)} KB -> ${Math.round(outputStat.size / 1024)} KB)`);
}

console.log(`Optimización terminada: ${convertedCount} imágenes, ahorro de ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB.`);
