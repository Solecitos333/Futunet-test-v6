(function () {
  const shell = document.getElementById('home-showcase');
  if (!shell) return;

  const SHOWCASE_SECTION = shell.closest('.showcase-section') || shell;
  const ROW_CONFIGS = [
    { selector: '[data-showcase-row="left"]', direction: 1 },
    { selector: '[data-showcase-row="right"]', direction: -1 }
  ];

  let rows = [];
  let hasInitialized = false;
  let hasQueuedInit = false;

  function normalizeText(value) {
    return String(value || '')
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã/g, 'Á')
      .replace(/Ã‰/g, 'É')
      .replace(/Ã/g, 'Í')
      .replace(/Ã“/g, 'Ó')
      .replace(/Ãš/g, 'Ú')
      .replace(/â€“/g, '–')
      .replace(/â€”/g, '—')
      .replace(/â€œ/g, '“')
      .replace(/â€/g, '”')
      .replace(/Â/g, '')
      .trim();
  }

  function getCatalogData() {
    if (window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      return window.supplierInventory.getMergedCatalog();
    }
    if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
      return mockDatabase;
    }
    return [];
  }

  function isCandidate(item) {
    if (!item || !item.id || !item.title || !item.img) return false;
    const brand = String(item.brand || '').toLowerCase();
    const category = String(item.category || '').toLowerCase();
    return brand !== 'servicios' && category !== 'servicios';
  }

  function scoreProduct(item) {
    let score = 0;
    const title = String(item.title || '');
    const brand = String(item.brand || '').toLowerCase();

    if (brand && brand !== 'genérico') score += 5;
    if (['equipos', 'redes', 'seguridad', 'oficina'].includes(item.department)) score += 4;
    if (Array.isArray(item.gallery) && item.gallery.length > 1) score += 2;
    if (/laptop|computadora|monitor|impresora|cámara|camera|router|switch|televisor|proyector|tv/i.test(title)) score += 3;
    if (String(item.img || '').includes('placeholder')) score -= 4;

    return score;
  }

  function uniqueById(items) {
    const seen = new Set();
    return items.filter((item) => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  function buildCard(item) {
    const title = normalizeText(item.title);
    const meta = normalizeText(item.brand || item.category || 'Catálogo');
    const price = normalizeText(item.price || 'Cotizar');

    return `
      <a class="showcase-card" href="catalogo.html?q=${encodeURIComponent(item.title)}" aria-label="Ver ${title} en el catálogo">
        <div class="showcase-card__media">
          <img src="${item.img}" alt="${title}" loading="lazy" decoding="async" />
        </div>
        <div class="showcase-card__body">
          <span class="showcase-card__meta">${meta}</span>
          <h3 class="showcase-card__title">${title}</h3>
          <span class="showcase-card__price">${price}</span>
        </div>
      </a>
    `;
  }

  function buildTrackMarkup(items) {
    return items.map(buildCard).join('');
  }

  function attachFallbacks(container) {
    container.querySelectorAll('img').forEach((image) => {
      image.addEventListener(
        'error',
        () => {
          image.src = 'img/placeholder.svg';
        },
        { once: true }
      );
    });
  }

  function renderRow(container, items, config, { duplicateCards = true } = {}) {
    if (!container || !items.length) return null;

    const cardsMarkup = buildTrackMarkup(items);
    container.classList.toggle('showcase-row--interactive', !duplicateCards);
    container.innerHTML = `
      <div class="showcase-track">
        <div class="showcase-group">${cardsMarkup}</div>
        ${duplicateCards ? `<div class="showcase-group">${cardsMarkup}</div>` : ''}
      </div>
    `;
    attachFallbacks(container);

    const track = container.querySelector('.showcase-track');
    const primaryGroup = container.querySelector('.showcase-group');

    if (config.direction < 0) {
      container.classList.add('showcase-row--reverse');
    } else {
      container.classList.remove('showcase-row--reverse');
    }

    return {
      container,
      track,
      primaryGroup,
      direction: config.direction
    };
  }

  function refreshMeasurements() {
    rows.forEach((row) => {
      if (!row.primaryGroup) return;
      const duration = row.direction > 0 ? '304s' : '336s';

      row.container.style.setProperty('--showcase-duration', duration);
    });
  }

  function bindResizeRefresh() {
    window.addEventListener('resize', () => {
      window.clearTimeout(bindResizeRefresh.resizeTimer);
      bindResizeRefresh.resizeTimer = window.setTimeout(refreshMeasurements, 120);
    });
  }

  function splitItems(items) {
    const left = [];
    const right = [];

    items.forEach((item, index) => {
      if (index % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    });

    return {
      left,
      right: right.length ? right : left.slice().reverse()
    };
  }

  function executeInit() {
    if (hasInitialized) return;
    hasInitialized = true;

    const items = uniqueById(getCatalogData())
      .filter(isCandidate)
      .sort((a, b) => scoreProduct(b) - scoreProduct(a) || normalizeText(a.title).localeCompare(normalizeText(b.title)));

    if (items.length < 8) {
      if (!window.inventoryDataLoaded && typeof window.loadInventoryDataScript === 'function') {
        hasInitialized = false;
        window.loadInventoryDataScript().then(executeInit).catch(() => {
          SHOWCASE_SECTION.setAttribute('hidden', 'hidden');
        });
        return;
      }
      SHOWCASE_SECTION.setAttribute('hidden', 'hidden');
      return;
    }

    SHOWCASE_SECTION.removeAttribute('hidden');
    shell.classList.remove('showcase-shell--static');

    const { left, right } = splitItems(items);
    rows = ROW_CONFIGS.map((config) => {
      const container = shell.querySelector(config.selector);
      const sourceItems = config.direction > 0 ? left : right;
      return renderRow(container, sourceItems, config, { duplicateCards: true });
    }).filter(Boolean);

    refreshMeasurements();
    bindResizeRefresh();
  }

  function initShowcase() {
    if (typeof window.loadInventoryDataScript === 'function') {
      window.loadInventoryDataScript().then(executeInit).catch(() => executeInit());
    } else {
      executeInit();
    }
  }

  function queueShowcaseInit() {
    if (hasQueuedInit || hasInitialized) return;
    hasQueuedInit = true;
    initShowcase();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queueShowcaseInit);
  } else {
    queueShowcaseInit();
  }
})();
