const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const reviewed = JSON.parse(read('docs/gaming-image-sources.json')).products;

function renderGaming(feed) {
  const grid = { style: {}, innerHTML: '' };
  const window = { SUPPLIER_INVENTORY_FEED: feed };
  const document = {
    readyState: 'loading',
    addEventListener() {},
    getElementById(id) { return id === 'gaming-products-grid' ? grid : null; }
  };
  vm.runInNewContext(read('js/gaming.js'), { window, document });
  window.FutunetGaming.init();
  return grid.innerHTML;
}

function supplierFeed() {
  const window = {};
  vm.runInNewContext(read('js/supplier_inventory.js'), { window });
  return window.supplierInventory.getMergedCatalog().filter(p => p.supplier === 'gaming');
}

test('Gaming y las galerías del catálogo conservan las fotos revisadas por producto', () => {
  const feed = supplierFeed();
  assert.equal(feed.length, 12);
  for (const item of feed) {
    const source = reviewed.find(p => p.id === item.id);
    assert.ok(source, item.id);
    assert.equal(item.img, source.image, item.id);
    assert.ok(item.gallery.every(img => img === source.image), item.id);
    const raw = fs.readFileSync(path.join(root, source.image));
    const bytes = source.image.endsWith('.svg') ? raw.toString('utf8').replace(/\r\n/g, '\n') : raw;
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), source.sha256);
    if (source.status === 'manufacturer') assert.ok(source.page && source.sourceImage);
  }
  for (const html of [renderGaming(), renderGaming(feed)]) {
    const cards = [...html.matchAll(/data-id="([^"]+)"[\s\S]*?<img src="([^"]+)"/g)];
    assert.equal(cards.length, 12);
    for (const [, id, image] of cards) {
      assert.equal(image, reviewed.find(p => p.id === id).image, id);
    }
  }
});

test('una foto ausente o fallida nunca se sustituye por otro producto', () => {
  const feed = Array.from({ length: 6 }, (_, i) => ({
    id: `test_${i}`, title: 'Tarjeta gráfica de prueba', category: 'Componentes Gaming',
    img: i ? 'img/no-existe.webp' : undefined
  }));
  const html = renderGaming(feed);
  const tags = [...html.matchAll(/<img\b[^>]+>/g)].map(m => m[0]);
  assert.equal(tags.length, 6);
  assert.match(tags[0], /src="img\/gaming\/foto-pendiente.svg"/);
  for (const tag of tags) {
    const handler = tag.match(/onerror="([^"]+)"/)[1];
    const image = { src: 'img/no-existe.webp', alt: 'Tarjeta gráfica de prueba', onerror() {} };
    vm.runInNewContext(`(function () { ${handler} }).call(image)`, { image });
    assert.equal(image.src, 'img/gaming/foto-pendiente.svg');
    assert.equal(image.alt, 'Foto del producto pendiente');
    assert.equal(image.onerror, null);
  }
});

test('el destacado y los equipos sin foto propia se identifican como pendientes', () => {
  const pending = supplierFeed().filter(p => p.img.endsWith('/foto-pendiente.svg'));
  assert.equal(pending.length, 4);
  assert.ok(pending.some(p => p.id === 'gm_laptop_lenovo_legion_5'));
  const featured = read('gaming.html').match(/<img[^>]+class="featured-img"[^>]*>/)[0];
  assert.match(featured, /src="img\/gaming\/foto-pendiente.svg"/);
  assert.match(featured, /alt="Foto pendiente/);
});
