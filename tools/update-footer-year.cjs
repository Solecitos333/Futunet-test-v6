const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let count = 0;
for (const f of files) {
  const fileP = path.join(rootDir, f);
  let content = fs.readFileSync(fileP, 'utf8');
  let changed = false;

  if (content.includes('© <script>document.write(new Date().getFullYear())</script>Futunet')) {
    content = content.replace('© <script>document.write(new Date().getFullYear())</script>Futunet', '© <span id="footer-year">2026</span> Futunet');
    changed = true;
  }
  if (content.includes('© <script>document.write(new Date().getFullYear())</script> Futunet')) {
    content = content.replace('© <script>document.write(new Date().getFullYear())</script> Futunet', '© <span id="footer-year">2026</span> Futunet');
    changed = true;
  }
  if (content.includes('© <span id="footer-year"></span>Futunet')) {
    content = content.replace('© <span id="footer-year"></span>Futunet', '© <span id="footer-year">2026</span> Futunet');
    changed = true;
  }
  if (content.includes('© <span id="footer-year">2026</span>Futunet')) {
    content = content.replace('© <span id="footer-year">2026</span>Futunet', '© <span id="footer-year">2026</span> Futunet');
    changed = true;
  }
  if (content.includes('&copy; 2026 Futunet SRL.')) {
    content = content.replace('&copy; 2026 Futunet SRL.', '© <span id="footer-year">2026</span> Futunet SRL.');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fileP, content, 'utf8');
    count++;
  }
}

console.log('Successfully updated footer-year in', count, 'files.');
