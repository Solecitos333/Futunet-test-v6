const fs = require('fs');
const brandFiles = fs.readdirSync('.').filter(f => f.startsWith('marca-') && f.endsWith('.html'));
console.log('Total brand HTML files:', brandFiles.length);

for (const file of brandFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/data-brand-name=["']([^"']+)["']/);
  const brandName = match ? match[1] : null;
  const hasContainer = content.includes('id="brand-products-container"');
  const hasLoader = content.includes('brand-page-loader.js');
  const hasCatalogJs = content.includes('catalog.js');
  const hasBackupData = content.includes('backup_data.js');
  if (!brandName || !hasContainer || !hasLoader || !hasCatalogJs || !hasBackupData) {
    console.log('WARNING in', file, ':', { brandName, hasContainer, hasLoader, hasCatalogJs, hasBackupData });
  }
}
console.log('Audit completed successfully.');
