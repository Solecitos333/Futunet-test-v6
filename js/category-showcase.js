/* =============================================================
   CATEGORY-SHOWCASE.JS — Productos por Categoría (Tabs + Carrusel)
   Carga productos del inventario real, tabs interactivos, carrusel.
   ============================================================= */
(function () {
  'use strict';

  const section = document.getElementById('productos-categoria');
  if (!section) return;

  const tabsContainer = section.querySelector('.category-tabs');
  const grid = section.querySelector('.catshowcase-grid');
  const prevBtn = section.querySelector('.catshowcase-arrow--prev');
  const nextBtn = section.querySelector('.catshowcase-arrow--next');

  if (!tabsContainer || !grid) return;

  const TABS = [
    { key: 'seguridad', label: 'Seguridad', department: 'seguridad' },
    { key: 'redes', label: 'Redes', department: 'redes' },
    { key: 'equipos', label: 'Equipos', department: 'equipos' },
    { key: 'oficina', label: 'Oficina', department: 'oficina' },
    { key: 'energia', label: 'Energía', department: 'energia' }
  ];

  let currentTab = 'seguridad';

  function getCatalogData() {
    if (window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      return window.supplierInventory.getMergedCatalog();
    }
    if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
      return mockDatabase;
    }
    return [];
  }

  function normalizeText(value) {
    return String(value || '')
      .replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã±/g, 'ñ')
      .replace(/â€"/g, '–').replace(/â€"/g, '—')
      .replace(/Â/g, '').trim();
  }

  function getProductsByDepartment(dept) {
    const data = getCatalogData();
    return data.filter(item => {
      if (!item || !item.id || !item.title || !item.img) return false;
      if (String(item.img || '').includes('placeholder')) return false;
      return item.department === dept;
    }).slice(0, 8);
  }

  function buildProductCard(item) {
    const title = normalizeText(item.title);
    const brand = normalizeText(item.brand || item.category || 'Catálogo');
    const price = normalizeText(item.price || 'Cotizar');

    return `
      <a class="catshowcase-card" href="producto.html?id=${encodeURIComponent(item.id)}" aria-label="Ver ${title}">
        <div class="catshowcase-card__media">
          <img src="${item.img}" alt="${title}" loading="lazy" decoding="async"
               onerror="this.src='img/placeholder.svg'" />
        </div>
        <div class="catshowcase-card__body">
          <span class="catshowcase-card__brand">${brand}</span>
          <h3 class="catshowcase-card__title">${title}</h3>
          <span class="catshowcase-card__price">${price}</span>
        </div>
        <div class="catshowcase-card__action">
          <span>Ver producto</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </a>
    `;
  }

  function renderProducts(dept) {
    const products = getProductsByDepartment(dept);
    if (products.length === 0) {
      grid.innerHTML = '<p class="catshowcase-empty">No hay productos disponibles en esta categoría.</p>';
      return;
    }
    grid.innerHTML = products.map(buildProductCard).join('');
    grid.scrollLeft = 0;
  }

  function setActiveTab(key) {
    currentTab = key;
    tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === key);
    });
    renderProducts(key);
  }

  // ── Build Tabs ──
  TABS.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'category-tab' + (tab.key === currentTab ? ' active' : '');
    btn.textContent = tab.label;
    btn.dataset.tab = tab.key;
    btn.addEventListener('click', () => setActiveTab(tab.key));
    tabsContainer.appendChild(btn);
  });

  // ── Scroll Arrows ──
  const SCROLL_AMOUNT = 280;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    });
  }

  // ── Init (wait for data) ──
  function init() {
    const data = getCatalogData();
    if (data.length < 5) {
      section.setAttribute('hidden', '');
      return;
    }
    section.removeAttribute('hidden');
    renderProducts(currentTab);
  }

  function tryInit() {
    if (typeof window.loadInventoryDataScript === 'function') {
      window.loadInventoryDataScript().then(init).catch(() => init());
    } else {
      init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      if (window.FutunetData && window.FutunetData.readyPromise) {
        await window.FutunetData.readyPromise;
      }
      tryInit();
    });
  } else {
    (async () => {
      if (window.FutunetData && window.FutunetData.readyPromise) {
        await window.FutunetData.readyPromise;
      }
      tryInit();
    })();
  }
})();
