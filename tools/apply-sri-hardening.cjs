const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('=== APLICANDO SUBRESOURCE INTEGRITY (SRI) DEVSECOPS ===');
console.log('Procesando', htmlFiles.length, 'archivos HTML...');

const LUCIDE_HASH = 'sha384-ieG+IKD0d/ZPXyCBTMVAbqsQdns8QGJR/e26WMw7M4fkaI/rHcS/YIoi+ah9WGge';
const FA_HASH = 'sha384-iw3OoTErCYJJB9mCa8LNS2hbsQ7M3C0EpIsO/H5+EGAkPGc6rk+V8i04oW/K5xq0';
const FB_APP_HASH = 'sha384-sEVIly94UBRLKWdkYoPpSG7GD/e79YHMrxVyZaOk712Ga7+EAw6w1EFi+xBzBdd+';
const FB_AUTH_HASH = 'sha384-EkqK+ezBWJuvO3hfrSx2iVqr3YQbhmnzn8kPhOpBZ+0GMVU5oGSgptwIu8D84HjE';
const FB_FS_HASH = 'sha384-M481iNZJtbpypKgvlvZ+78Giq0BsewFLk5r2k+MOcGXlwKCc27DQRZ+WCV/zpmpC';
const FB_ST_HASH = 'sha384-6I0gWsz4FIAr30c0TxIxJnPQuJiZ1FfILdZrgJdjxTH3R8dgPGTvexbyqTvReV6Z';

let modifiedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. In 404.html, replace lucide@latest
  if (content.includes('https://unpkg.com/lucide@latest/dist/umd/lucide.min.js')) {
    content = content.replace(
      'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js',
      'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js'
    );
  }

  // 2. Lucide script tags without integrity
  content = content.replace(
    /<script defer src="https:\/\/unpkg\.com\/lucide@0\.460\.0\/dist\/umd\/lucide\.min\.js"><\/script>/g,
    `<script defer src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" integrity="${LUCIDE_HASH}" crossorigin="anonymous"></script>`
  );

  // 3. In gaming.html, replace old Firebase 8.10.1 scripts
  if (content.includes('firebasejs/8.10.1/firebase-app.js')) {
    const oldGamingFb = ` <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>`;

    const newGamingFb = ` <script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js" integrity="${FB_APP_HASH}" crossorigin="anonymous"></script>
 <script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js" integrity="${FB_AUTH_HASH}" crossorigin="anonymous"></script>
 <script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js" integrity="${FB_FS_HASH}" crossorigin="anonymous"></script>
 <script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js" integrity="${FB_ST_HASH}" crossorigin="anonymous"></script>`;

    content = content.replace(oldGamingFb, newGamingFb);
  }

  // 4. Firebase 10.12.0 scripts without integrity
  content = content.replace(
    /<script defer src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.12\.0\/firebase-app-compat\.js"><\/script>/g,
    `<script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js" integrity="${FB_APP_HASH}" crossorigin="anonymous"></script>`
  );
  content = content.replace(
    /<script defer src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.12\.0\/firebase-auth-compat\.js"><\/script>/g,
    `<script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js" integrity="${FB_AUTH_HASH}" crossorigin="anonymous"></script>`
  );
  content = content.replace(
    /<script defer src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.12\.0\/firebase-firestore-compat\.js"><\/script>/g,
    `<script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js" integrity="${FB_FS_HASH}" crossorigin="anonymous"></script>`
  );
  content = content.replace(
    /<script defer src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.12\.0\/firebase-storage-compat\.js"><\/script>/g,
    `<script defer src="https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js" integrity="${FB_ST_HASH}" crossorigin="anonymous"></script>`
  );

  // 5. FontAwesome links without integrity
  // Case A: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'" />
  content = content.replace(
    /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" media="print" onload="this\.media='all'" \/>/g,
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="${FA_HASH}" crossorigin="anonymous" media="print" onload="this.media='all'" />`
  );
  // Case B: <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" /></noscript>
  content = content.replace(
    /<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" \/><\/noscript>/g,
    `<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="${FA_HASH}" crossorigin="anonymous" /></noscript>`
  );
  // Case C: direct link without media: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  content = content.replace(
    /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">/g,
    `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="${FA_HASH}" crossorigin="anonymous">`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`[OK] SRI aplicado con éxito en ${modifiedCount} archivos HTML.`);
