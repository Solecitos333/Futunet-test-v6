const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const carousel = fs.readFileSync(path.join(root, 'js', 'promo-carousel.js'), 'utf8');
const contactForm = fs.readFileSync(path.join(root, 'js', 'form.js'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

function readPngSize(filePath) {
  const image = fs.readFileSync(filePath);
  assert.equal(image.toString('ascii', 1, 4), 'PNG', `${filePath} no es un PNG válido`);
  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20)
  };
}

test('la página inicial no bloquea el contenido con un precargador artificial', () => {
  assert.doesNotMatch(indexHtml, /<body[^>]*\bis-loading\b/);
  assert.doesNotMatch(indexHtml, /id="page-preloader"/);
});

test('el carrusel puede pausarse y oculta del teclado las diapositivas inactivas', () => {
  assert.match(indexHtml, /id="hero-carousel-toggle"[^>]+aria-pressed="false"/);
  assert.match(indexHtml, /hero-carousel-arrow--prev" type="button"/);
  assert.match(indexHtml, /hero-carousel-arrow--next" type="button"/);
  assert.match(carousel, /setAttribute\('inert', ''\)/);
  assert.match(carousel, /setAttribute\('aria-current'/);
  assert.match(carousel, /userPaused = reduceMotion/);
  assert.match(carousel, /visibilitychange/);
});

test('los banners dinámicos validan protocolos y toleran títulos incompletos', () => {
  assert.match(carousel, /parsed\.protocol !== 'http:' && parsed\.protocol !== 'https:'/);
  assert.match(carousel, /String\(banner\.title \|\| 'Promoción Futunet'\)/);
  assert.doesNotMatch(carousel, /style="background-image:url\(/);
  assert.doesNotMatch(carousel, /banner\.title\.replace/);
});

test('la promoción estacional vencida ya no forma parte del fallback público', () => {
  assert.doesNotMatch(indexHtml, /PAPASMART2026/);
  assert.doesNotMatch(indexHtml, /Papá Smart & Gaming/);
});

test('el formulario enfoca errores y abre WhatsApp sin acceso a window.opener', () => {
  assert.match(contactForm, /setAttribute\('aria-invalid', 'true'\)/);
  assert.match(contactForm, /field\.focus\(\)/);
  assert.match(contactForm, /'noopener,noreferrer'/);
  assert.match(contactForm, /whatsappWindow\.opener = null/);
});

test('el app shell resuelve recursos versionados y el manifiesto declara iconos reales', () => {
  assert.match(serviceWorker, /futunet-cache-v13/);
  assert.ok((serviceWorker.match(/ignoreSearch: true/g) || []).length >= 2);
  assert.deepEqual(
    manifest.icons.map(({ src, sizes }) => [src, sizes]),
    [
      ['favicon.png', '192x192'],
      ['img/icon-512.png', '512x512']
    ]
  );
  manifest.icons.forEach(({ src, sizes }) => {
    const iconPath = path.join(root, src);
    assert.equal(fs.existsSync(iconPath), true, `Falta el icono ${src}`);
    const expected = Number(sizes.split('x')[0]);
    assert.deepEqual(readPngSize(iconPath), { width: expected, height: expected });
  });
});

test('la vista social principal usa una imagen panorámica optimizada', () => {
  assert.match(indexHtml, /og-futunet-2026\.jpg/);
  assert.match(indexHtml, /property="og:image:width" content="1200"/);
  assert.match(indexHtml, /property="og:image:height" content="630"/);
  const socialCard = path.join(root, 'img', 'og-futunet-2026.jpg');
  assert.equal(fs.existsSync(socialCard), true);
  assert.ok(fs.statSync(socialCard).size < 300_000, 'La tarjeta social debe pesar menos de 300 KB');
});
