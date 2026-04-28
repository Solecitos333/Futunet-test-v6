const { JSDOM } = require('jsdom');
const { performance } = require('perf_hooks');

const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <img id="product-detail-main-img" />
  <div id="product-detail-thumbs"></div>
</body></html>`);

const document = dom.window.document;

function escapeHTML(str) { return str; }

function renderGalleryOld(detail) {
  const mainImg = document.getElementById('product-detail-main-img');
  const thumbs = document.getElementById('product-detail-thumbs');
  if (!mainImg || !thumbs) return;

  const images = detail.gallery.length ? detail.gallery : [detail.img];
  mainImg.src = images[0] || 'img/placeholder.svg';
  thumbs.innerHTML = '';

  images.forEach((url, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `product-detail-thumb${index === 0 ? ' is-active' : ''}`;
    button.addEventListener('click', () => {
      mainImg.src = url;
      thumbs.querySelectorAll('.product-detail-thumb').forEach((thumb) => thumb.classList.remove('is-active'));
      button.classList.add('is-active');
    });
    thumbs.appendChild(button);
  });
}

function renderGalleryNew(detail) {
  const mainImg = document.getElementById('product-detail-main-img');
  const thumbs = document.getElementById('product-detail-thumbs');
  if (!mainImg || !thumbs) return;

  const images = detail.gallery.length ? detail.gallery : [detail.img];
  mainImg.src = images[0] || 'img/placeholder.svg';
  thumbs.innerHTML = '';

  let activeThumb = null;

  images.forEach((url, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `product-detail-thumb${index === 0 ? ' is-active' : ''}`;
    if (index === 0) activeThumb = button;

    button.addEventListener('click', () => {
      mainImg.src = url;
      if (activeThumb) activeThumb.classList.remove('is-active');
      button.classList.add('is-active');
      activeThumb = button;
    });
    thumbs.appendChild(button);
  });
}

function renderGalleryCacheArray(detail) {
  const mainImg = document.getElementById('product-detail-main-img');
  const thumbs = document.getElementById('product-detail-thumbs');
  if (!mainImg || !thumbs) return;

  const images = detail.gallery.length ? detail.gallery : [detail.img];
  mainImg.src = images[0] || 'img/placeholder.svg';
  thumbs.innerHTML = '';

  const buttons = [];

  images.forEach((url, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `product-detail-thumb${index === 0 ? ' is-active' : ''}`;

    button.addEventListener('click', () => {
      mainImg.src = url;
      buttons.forEach((thumb) => thumb.classList.remove('is-active'));
      button.classList.add('is-active');
    });
    thumbs.appendChild(button);
    buttons.push(button);
  });
}

const detail = {
  gallery: Array(100).fill('img.jpg'),
  title: 'test'
};

function runBenchmark(fn, name) {
  fn(detail);
  const thumbs = document.querySelectorAll('.product-detail-thumb');
  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    thumbs[i % 100].click();
  }
  const end = performance.now();
  console.log(`${name} time:`, end - start, 'ms');
}

runBenchmark(renderGalleryOld, 'Old (querySelectorAll)');
runBenchmark(renderGalleryCacheArray, 'Cache Array (forEach)');
runBenchmark(renderGalleryNew, 'New (Track activeThumb)');
