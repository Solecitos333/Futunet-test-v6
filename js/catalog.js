/* =============================================================
   CATALOG.JS — Futunet E-Commerce Platform
   Funcionalidad del catálogo de servicios:
   - Renderizado dinámico de cuadrícula de productos
   - Paginación "Load More" con IntersectionObserver
   - Filtrado de productos por categoría
   - Búsqueda con debounce y autocompletado
   - Sanitización de HTML para prevenir XSS
   - Mensaje de WhatsApp dinámico por producto
   ============================================================= */

/* -------------------------------------------------------------
   0. UTILIDADES (Sanitización, Debounce)
   ------------------------------------------------------------- */

/**
 * Escapa caracteres HTML especiales para prevenir XSS
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Debounce: retrasa la ejecución de una función hasta que
 * pase un tiempo sin nuevas llamadas.
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Normaliza texto para búsqueda tolerante:
 * - Minúsculas
 * - Elimina acentos (á→a, é→e, í→i, ó→o, ú→u, ñ→n)
 * - Elimina caracteres especiales
 */
function normalizeSearch(str) {
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00f1/g, 'n').replace(/\u00d1/g, 'n')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Genera variantes de un término de búsqueda quitando terminaciones
 * comunes del español (plurales, género, diminutivos).
 */
function getStemVariants(word) {
  const variants = [word];
  if (word.endsWith('es') && word.length > 3) variants.push(word.slice(0, -2));
  if (word.endsWith('s') && word.length > 2) variants.push(word.slice(0, -1));
  if (word.endsWith('a') && word.length > 2) variants.push(word.slice(0, -1) + 'o');
  if (word.endsWith('o') && word.length > 2) variants.push(word.slice(0, -1) + 'a');
  if (word.endsWith('iones') && word.length > 5) variants.push(word.slice(0, -2));
  return [...new Set(variants)];
}

/**
 * Búsqueda fuzzy: devuelve true si el query coincide
 * de forma tolerante con el texto objetivo.
 */
function fuzzyMatch(normalizedTarget, normalizedQuery) {
  if (normalizedTarget.includes(normalizedQuery)) return true;
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length >= 2);
  if (queryWords.length === 0) return false;
  return queryWords.every(qWord => {
    const variants = getStemVariants(qWord);
    return variants.some(variant => normalizedTarget.includes(variant));
  });
}

/**
 * Filtra un producto contra un query normalizado.
 * Devuelve un score (0 = no match, mayor = mejor match).
 */
function scoreProductMatch(product, normalizedQuery) {
  const title = normalizeSearch(product.title);
  const desc = normalizeSearch(product.desc);
  const category = normalizeSearch(product.category);
  const brand = normalizeSearch(product.brand);
  let score = 0;
  if (title.includes(normalizedQuery)) score += 100;
  else if (fuzzyMatch(title, normalizedQuery)) score += 60;
  if (brand.includes(normalizedQuery)) score += 80;
  else if (fuzzyMatch(brand, normalizedQuery)) score += 40;
  if (category.includes(normalizedQuery)) score += 70;
  else if (fuzzyMatch(category, normalizedQuery)) score += 35;
  if (fuzzyMatch(desc, normalizedQuery)) score += 20;
  return score;
}


/* -------------------------------------------------------------
   1. ESTADO GLOBAL Y CONFIGURACIÓN
   ------------------------------------------------------------- */

// Estado de la UI
const state = {
  dept: 'all',
  category: 'all',
  brand: 'all',
  searchQuery: null,
  page: 0,
  pageSize: 20,
  currentProducts: [], // productos actualmente visibles
  allFilteredProducts: [], // todos los productos filtrados
  minPrice: 0,
  maxPrice: 9999999
};

function renderInlineAddButtonHTML(productId, variant = 'default') {
  const qty = window.FutunetCart ? window.FutunetCart.getItemQty(productId) : 0;
  const compact = variant === 'compact';
  if (qty > 0) {
    if (compact) {
      return `
        <div class="inline-cart-control inline-cart-control--compact">
          <button class="inline-qty-btn inline-qty-btn--compact" type="button" data-inline-change="-1" data-product-id="${escapeHTML(productId)}" aria-label="Quitar una unidad"><i data-lucide="minus"></i></button>
          <span class="inline-qty-readout inline-qty-readout--compact">
            <span class="inline-qty-count">${qty}</span>
          </span>
          <button class="inline-qty-btn inline-qty-btn--compact" type="button" data-inline-change="1" data-product-id="${escapeHTML(productId)}" aria-label="Agregar una unidad"><i data-lucide="plus"></i></button>
        </div>
      `;
    }
    return `
      <div class="inline-cart-control">
        <button class="inline-qty-btn" type="button" data-inline-change="-1" data-product-id="${escapeHTML(productId)}" aria-label="Quitar una unidad"><i data-lucide="minus"></i></button>
        <span class="inline-qty-readout">
          <span class="inline-qty-count">${qty}</span>
          <span class="inline-qty-label">en carrito</span>
        </span>
        <button class="inline-qty-btn" type="button" data-inline-change="1" data-product-id="${escapeHTML(productId)}" aria-label="Agregar una unidad"><i data-lucide="plus"></i></button>
      </div>
    `;
  }
  if (compact) {
    return `
      <button class="inline-add-btn product-add-btn product-add-btn--compact" type="button" data-product-id="${escapeHTML(productId)}" aria-label="Agregar al carrito">
        <span class="product-add-btn__icon-wrap product-add-btn__icon-wrap--compact"><i data-lucide="shopping-cart"></i></span>
        <span class="product-add-btn__text product-add-btn__text--compact">Agregar</span>
      </button>
    `;
  }

  return `
    <button class="inline-add-btn product-add-btn" type="button" data-product-id="${escapeHTML(productId)}" aria-label="Agregar al carrito">
      <span class="product-add-btn__icon-wrap"><i data-lucide="shopping-cart"></i></span>
      <span class="product-add-btn__text">Agregar al carrito</span>
    </button>
  `;
}

function updateInlineCartButtons() {
  document.querySelectorAll('[data-product-add]').forEach(container => {
    const productId = container.dataset.productAdd;
    const variant = container.dataset.productAddVariant || 'default';
    container.innerHTML = renderInlineAddButtonHTML(productId, variant);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ root: container });
    }
  });
}

function buildVisualTileGrid(items, compact = false) {
  const grid = document.createElement('div');
  grid.className = `cubiculos-grid reveal in${compact ? ' cubiculos-grid--compact' : ''}`;

  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `cubiculo-card${compact ? ' cubiculo-card--compact' : ''}`;
    card.style.backgroundImage = `url('${item.image}')`;
    card.style.animationDelay = `${i * 80}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', item.ariaLabel || item.title);
    card.addEventListener('click', item.onSelect);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.onSelect();
      }
    });
    card.innerHTML = `
      <div class="cubiculo-info">
        <h4 class="cubiculo-title">${escapeHTML(item.title)}</h4>
        <span class="cubiculo-count">${escapeHTML(item.meta)}</span>
      </div>
    `;
    grid.appendChild(card);
  });

  return grid;
}

function buildSubcategoryGrid(categoriesGroups, compact = false) {
  return buildVisualTileGrid(
    Object.keys(categoriesGroups).map((catName) => ({
      title: catName,
      meta: getCategoryCountLabel(catName, categoriesGroups[catName]),
      image: getFallbackImg(catName),
      onSelect: () => setCategory(catName),
      ariaLabel: `Abrir subcategoria ${catName}`
    })),
    compact
  );
}

function renderMobileVisualBrowserSection({ title, description, items }) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !items.length) return;

  const section = document.createElement('section');
  section.className = 'catalog-mobile-explorer reveal in';
  section.innerHTML = `
    <div class="catalog-mobile-explorer__header">
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
    </div>
  `;
  section.appendChild(buildVisualTileGrid(items, true));
  container.appendChild(section);
}

function renderCompactMobileCatalogView() {
  if (!isCompactMobileViewport()) return false;

  if (state.searchQuery) {
    const q = normalizeSearch(state.searchQuery);
    const results = mockDatabase
      .map(p => ({ product: p, score: scoreProductMatch(p, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.product);

    updateCatalogContextBar({
      title: 'Resultados',
      description: `${results.length} coincidencia${results.length !== 1 ? 's' : ''} para "${state.searchQuery}".`,
      resultsLabel: `${results.length} coincidencia${results.length !== 1 ? 's' : ''}`,
      activeLabel: `Busqueda activa: ${state.searchQuery}`,
      canReset: true
    });

    if (results.length === 0) {
      renderEmptyState(
        'Sin resultados',
        'No encontramos productos con esos terminos. Intenta con otras palabras o explora las categorias.'
      );
    } else {
      state.allFilteredProducts = results;
      state.page = 0;
      renderPaginatedProducts();
    }
    return true;
  }

  let db = mockDatabase;
  if (state.dept !== 'all') db = db.filter(p => p.department === state.dept);

  if (state.category === 'all') {
    if (state.dept === 'all') {
      const deptItems = mobileDeptOrder
        .map((deptKey) => {
          const deptProducts = db.filter((product) => product.department === deptKey);
          if (!deptProducts.length) return null;
          return {
            title: getDeptDisplayName(deptKey),
            meta: getDeptCountLabel(deptProducts.length),
            image: getDeptFallbackImg(deptKey),
            onSelect: () => {
              filterCat(deptKey, null);
              scrollCatalogToTop();
            },
            ariaLabel: `Abrir area ${getDeptDisplayName(deptKey)}`
          };
        })
        .filter(Boolean);

      updateCatalogContextBar({
        title: 'Areas del catalogo',
        description: 'Entra por departamento y luego navega por subcategorias con una vista mas limpia.',
        resultsLabel: `${deptItems.length} areas`,
        activeLabel: `${db.length} articulos listos para explorar`,
        canReset: false
      });

      renderMobileVisualBrowserSection({
        title: 'Explora por area',
        description: 'Toca un departamento para abrir sus subcategorias y navegar de forma mas ordenada.',
        items: deptItems
      });
      return true;
    }

    const categoriesGroups = {};
    db.forEach((product) => {
      if (!categoriesGroups[product.category]) categoriesGroups[product.category] = [];
      categoriesGroups[product.category].push(product);
    });

    const sortedCategories = sortEntriesBySize(categoriesGroups);

    updateCatalogContextBar({
      title: getDeptDisplayName(state.dept),
      description: 'Selecciona una subcategoria y luego entra a sus productos con una vista mas clara.',
      resultsLabel: `${sortedCategories.length} subcategorias`,
      activeLabel: `${db.length} articulos en ${getDeptDisplayName(state.dept)}`,
      canReset: true
    });

    renderMobileVisualBrowserSection({
      title: 'Explora por subcategoria',
      description: 'Entra al grupo exacto que necesitas antes de ver los productos.',
      items: sortedCategories.map(([categoryName, products]) => ({
        title: categoryName,
        meta: getCategoryCountLabel(categoryName, products.length),
        image: getFallbackImg(categoryName),
        onSelect: () => setCategory(categoryName),
        ariaLabel: `Abrir subcategoria ${categoryName}`
      }))
    });
    return true;
  }

  const catDb = db.filter(p => p.category === state.category);

  updateCatalogContextBar({
    title: state.category,
    description: getCategoryHeaderDescription(state.category, catDb.length),
    resultsLabel: `${catDb.length} resultado${catDb.length !== 1 ? 's' : ''}`,
    activeLabel: `En ${getDeptDisplayName(state.dept)}`,
    canReset: true
  });

  const brandsGroups = {};
  catDb.forEach(p => {
    if (!brandsGroups[p.brand]) brandsGroups[p.brand] = [];
    brandsGroups[p.brand].push(p);
  });

  for (const [brandName, brandProducts] of sortEntriesBySize(brandsGroups)) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'brand-header reveal in';
    headerDiv.innerHTML = `
      <div class="brand-header-tag">
        ${getGroupHeaderLabel(brandName)} <span>${escapeHTML(brandName.toUpperCase())}</span>
      </div>
    `;
    const container = document.getElementById('catalog-grid-container');
    if (container) container.appendChild(headerDiv);
    renderProductsGrid(brandProducts, { compactMobile: true });
  }

  return true;
}

function initCartUI() {
  if (window.FutunetCart) {
    // The FutunetCart module automatically binds drawer interactions.
    // We only need to bind the inline buttons inside the catalog.
    document.addEventListener('click', (event) => {
      const inlineAdd = event.target.closest('.inline-add-btn');
      if (inlineAdd) {
        event.stopPropagation();
        window.FutunetCart.add(inlineAdd.dataset.productId);
        return;
      }
      const inlineChange = event.target.closest('[data-inline-change]');
      if (inlineChange) {
        event.stopPropagation();
        window.FutunetCart.changeQty(inlineChange.dataset.productId, Number(inlineChange.dataset.inlineChange));
        return;
      }
    });
  }
}

function setModalCartHandler(productId) {
  const btnAddCart = document.getElementById('modal-add-cart-btn');
  if (!btnAddCart) return;
  btnAddCart.onclick = (event) => {
    event.stopPropagation();
    if (window.FutunetCart) {
      window.FutunetCart.add(productId);
    }
  };
}

function initModalCartButton() {
  const cartBtn = document.getElementById('modal-add-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const currentProductId = cartBtn.dataset.productId;
      if (currentProductId && window.FutunetCart) {
        window.FutunetCart.add(currentProductId);
      }
    });
  }
}

function setModalCartProduct(productId) {
  const cartBtn = document.getElementById('modal-add-cart-btn');
  if (cartBtn) {
    cartBtn.dataset.productId = productId;
  }
}

function initPageCart() {
  initCartUI();
}

function isMobileViewport() {
  return window.innerWidth <= 1023;
}

function isCompactMobileViewport() {
  return window.innerWidth <= 767;
}

function getCatalogContentAnchor() {
  return document.querySelector('#catalog-grid-container .catalog-mobile-explorer');
}

function appendCatalogContent(node) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !node) return;
  const anchor = getCatalogContentAnchor();
  if (anchor) {
    container.insertBefore(node, anchor);
    return;
  }
  container.appendChild(node);
}

function getMobileFilterSheet() {
  return document.getElementById('mobile-filter-sheet');
}

function isMobileFilterSheetOpen() {
  return Boolean(getMobileFilterSheet()?.classList.contains('is-open'));
}

function isProductModalOpen() {
  const modal = document.getElementById('product-modal');
  if (!modal) return false;
  return modal.classList.contains('show') || (modal.style.display && modal.style.display !== 'none');
}

function isMobileMenuOpen() {
  return Boolean(document.getElementById('mobileMenu')?.classList.contains('open'));
}

function syncCatalogScrollLock() {
  const shouldLock = isMobileFilterSheetOpen() || isProductModalOpen() || isMobileMenuOpen();
  document.body.style.overflow = shouldLock ? 'hidden' : '';
}

function syncFilterButtons(activeDept = 'all') {
  document
    .querySelectorAll('.cat-btn[data-filter-dept], .cat-btn[data-dept], .mobile-filter-clear-btn[data-filter-dept], .mobile-filter-clear-btn[data-dept]')
    .forEach((button) => {
      const buttonDept = button.dataset.filterDept || button.dataset.dept;
      button.classList.toggle('active', buttonDept === activeDept);
    });
}

function scrollCatalogToTop() {
  const container = document.getElementById('catalog-grid-container');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function openMobileFilters() {
  const sheet = getMobileFilterSheet();
  if (!sheet || !isMobileViewport()) return;
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  syncCatalogScrollLock();
}

function closeMobileFilters() {
  const sheet = getMobileFilterSheet();
  if (!sheet) return;
  sheet.classList.remove('is-open');
  sheet.setAttribute('aria-hidden', 'true');
  syncCatalogScrollLock();
}

// Configuración de Imágenes default para Cubículos (Subcategorías)
const categoryImages = {
  'cámaras de seguridad': 'img/camaras.jpg',
  'control de accesos': 'img/accesos.jpg',
  'cerraduras': 'img/cerraduras.jpg',
  'laptops corporativas': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=75',
  'desktop': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=75',
  'computadoras': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=75',
  'impresoras y consumibles': 'img/impresoras.jpg',
  'periféricos y partes': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=400&q=75',
  'componentes de red wifi': 'img/redes.jpg',
  'infraestructura de datos': 'img/redes.jpg',
  'cristalería y divisiones': 'img/cristal.jpg',
  'remozamiento profesional': 'img/sheetrock.jpg',
  'papelería y suministros': 'img/papeleria.jpg',
  'escritorios': 'img/mobiliario.jpg',
  'sillas y sillones': 'img/mobiliario.jpg',
  'estantes y archivos': 'img/mobiliario.jpg',
  'mobiliario': 'img/mobiliario.jpg',
  'energía y respaldo': 'img/ups.jpg',
  'servicios': 'img/redes.jpg'
};

const deptImages = {
  seguridad: 'img/camaras.jpg',
  redes: 'img/redes.jpg',
  energia: 'img/ups.jpg',
  equipos: 'img/laptops.jpg',
  oficina: 'img/papeleria.jpg',
  infra: 'img/sheetrock.jpg'
};

function isServiceItem(product) {
  return Boolean(product) && (
    String(product.brand || '').toLowerCase() === 'servicios' ||
    String(product.category || '').toLowerCase() === 'servicios'
  );
}

function getCategoryCountLabel(categoryName, count) {
  if (String(categoryName || '').toLowerCase() === 'servicios') {
    return `${count} servicio${count !== 1 ? 's' : ''} disponibles`;
  }
  return `${count} Artículos registrados`;
}

function getCategoryHeaderDescription(categoryName, count) {
  if (String(categoryName || '').toLowerCase() === 'servicios') {
    return `${count} servicio${count !== 1 ? 's' : ''} disponibles para cotización y ejecución.`;
  }
  return `${count} producto${count !== 1 ? 's' : ''} organizados por marca.`;
}

function getGroupHeaderLabel(brandName) {
  return String(brandName || '').toLowerCase() === 'servicios' ? 'TIPO:' : 'MARCA:';
}

function getFallbackImg(key) {
  const normalized = key.toLowerCase();
  return categoryImages[normalized] || 'img/placeholder.svg';
}

function getDeptFallbackImg(dept) {
  return deptImages[dept] || 'img/placeholder.svg';
}

function getDeptCountLabel(count) {
  return `${count} articulo${count !== 1 ? 's' : ''} registrados`;
}

// Nombres legibles de departamentos
const deptNames = {
  all: 'Catálogo Completo',
  seguridad: 'Seguridad Electrónica',
  redes: 'Redes & Datos',
  energia: 'Energía & Climatización',
  equipos: 'Computación',
  oficina: 'Papelería y Mobiliario',
  infra: 'Infraestructura'
};

const mobileDeptOrder = ['seguridad', 'redes', 'energia', 'equipos', 'oficina', 'infra'];
const mobileDeptIcons = {
  seguridad: 'shield-check',
  redes: 'wifi',
  energia: 'battery-charging',
  equipos: 'monitor',
  oficina: 'briefcase',
  infra: 'building-2'
};
const MOBILE_PREVIEW_LIMIT = 4;

function getDeptDisplayName(dept) {
  return deptNames[dept] || 'Catálogo Completo';
}

function sortEntriesBySize(groupedItems) {
  return Object.entries(groupedItems).sort((a, b) => {
    const sizeDiff = b[1].length - a[1].length;
    if (sizeDiff !== 0) return sizeDiff;
    return String(a[0]).localeCompare(String(b[0]), 'es');
  });
}

function renderMobileStackBrowser({ title, description, items }) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !items.length) return;

  const section = document.createElement('section');
  section.className = 'catalog-mobile-stack-browser reveal in';
  section.innerHTML = `
    <div class="catalog-mobile-stack-browser__header">
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'catalog-stack-grid';

  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'catalog-stack-card';
    button.style.animationDelay = `${index * 35}ms`;
    button.setAttribute('aria-label', item.ariaLabel || item.title);
    button.innerHTML = `
      <span class="catalog-stack-card__icon"><i data-lucide="${escapeHTML(item.icon)}"></i></span>
      <span class="catalog-stack-card__title">${escapeHTML(item.title)}</span>
      <span class="catalog-stack-card__meta">${escapeHTML(item.meta)}</span>
    `;
    button.addEventListener('click', item.onSelect);
    grid.appendChild(button);
  });

  section.appendChild(grid);
  container.appendChild(section);
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: section });
}

function renderMobilePreviewSection({ eyebrow, title, actionLabel, onAction, products }) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !products.length) return;

  const section = document.createElement('section');
  section.className = 'catalog-mobile-product-section reveal in';

  const header = document.createElement('div');
  header.className = 'catalog-mobile-product-section__header';

  const heading = document.createElement('div');
  heading.className = 'catalog-mobile-product-section__heading';
  heading.innerHTML = `
    <span class="catalog-mobile-product-section__eyebrow">${escapeHTML(eyebrow)}</span>
    <h3>${escapeHTML(title)}</h3>
  `;
  header.appendChild(heading);

  if (typeof onAction === 'function') {
    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = 'catalog-mobile-product-section__action';
    actionButton.textContent = actionLabel;
    actionButton.addEventListener('click', onAction);
    header.appendChild(actionButton);
  }

  section.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'products-grid products-grid--compact-mobile';
  section.appendChild(grid);
  container.appendChild(section);

  renderProductsGrid(products.slice(0, MOBILE_PREVIEW_LIMIT), {
    target: grid,
    compactMobile: true,
    previewMobile: true
  });

  if (products.length > MOBILE_PREVIEW_LIMIT && typeof onAction === 'function') {
    const footer = document.createElement('div');
    footer.className = 'catalog-mobile-product-section__footer';
    const footerButton = document.createElement('button');
    footerButton.type = 'button';
    footerButton.className = 'catalog-mobile-product-section__more';
    footerButton.textContent = `Ver ${products.length} resultados`;
    footerButton.addEventListener('click', onAction);
    footer.appendChild(footerButton);
    section.appendChild(footer);
  }
}

function getCatalogResetLabel() {
  if (state.searchQuery) return 'Limpiar búsqueda';
  if (state.category !== 'all') return 'Volver a categorías';
  if (state.dept !== 'all') return 'Ver todo';
  return 'Reiniciar vista';
}

function handleCatalogResetAction() {
  closeMobileFilters();

  if (state.searchQuery) {
    clearSearch();
    return;
  }

  if (state.category !== 'all') {
    setCategory('all');
    return;
  }

  clearSearch();
}

function updateCatalogContextBar({ resultsLabel, activeLabel, canReset = false, title, description }) {
  const titleEl = document.getElementById('current-category-title');
  const descEl = document.querySelector('.cat-desc');
  const resultsEl = document.getElementById('catalog-results-pill');
  const activeEl = document.getElementById('catalog-active-pill');
  const resetBtn = document.getElementById('catalog-reset-trigger');

  if (titleEl && title) titleEl.textContent = title;
  if (descEl && description) descEl.textContent = description;
  if (resultsEl && resultsLabel) resultsEl.textContent = resultsLabel;
  if (activeEl && activeLabel) activeEl.textContent = activeLabel;
  if (resetBtn) {
    resetBtn.hidden = !canReset;
    resetBtn.textContent = getCatalogResetLabel();
  }
}
function parsePrice(priceString) {
  const normalized = String(priceString || '').replace(/[^0-9.-]+/g, '');
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

/* -------------------------------------------------------------
   2. RENDERIZADO PRINCIPAL
   ------------------------------------------------------------- */

function updateContextualBanner() {
  const bannerEl = document.getElementById('catalog-context-banner');
  if (!bannerEl) return;

  const dept = state.dept;
  
  if (dept === 'all') {
    bannerEl.style.display = 'none';
    bannerEl.innerHTML = '';
    return;
  }

  let bannerHTML = '';
  
  if (dept === 'redes') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-wifi"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">¿Tienes el internet ideal para alimentar tu red?</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Un cableado estructurado necesita la mejor salida al exterior. Contrata internet de fibra óptica simétrica de alta velocidad con nosotros.</p>
          </div>
        </div>
        <a href="internet.html" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Planes de Internet
        </a>
      </div>
    `;
  } else if (dept === 'seguridad') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-network-wired"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">Complementa tu sistema con una red estructurada</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Las cámaras IP y sistemas de control de acceso requieren una infraestructura de red sólida y conmutadores PoE confiables para operar sin caídas.</p>
          </div>
        </div>
        <a href="redes-datos.html" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Redes y Datos
        </a>
      </div>
    `;
  } else if (dept === 'equipos') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-handshake"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">Instala, conecta y administra con un solo proveedor</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Te ayudamos con la configuración, el licenciamiento y la conexión de tus nuevos equipos de cómputo en la red de tu oficina local.</p>
          </div>
        </div>
        <a href="https://wa.me/18297411041" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Contactar Soporte B2B
        </a>
      </div>
    `;
  } else if (dept === 'energia') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-bolt"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">¿Ya tienes respaldo para tu red y seguridad?</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Un apagón puede desconfigurar tus switches o apagar tus cámaras de vigilancia. Cotiza sistemas solares o UPS industriales de respaldo.</p>
          </div>
        </div>
        <a href="energia-climatizacion.html" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Energía y Clima
        </a>
      </div>
    `;
  }

  if (bannerHTML) {
    bannerEl.innerHTML = bannerHTML;
    bannerEl.style.display = 'block';
  } else {
    bannerEl.style.display = 'none';
    bannerEl.innerHTML = '';
  }
}

function renderUI() {
  const container = document.getElementById('catalog-grid-container');
  if (!container) return;
  updateContextualBanner();
  container.innerHTML = '';
  const compactMobile = isCompactMobileViewport();
  if (compactMobile && renderCompactMobileCatalogView()) {
    return;
  }

  const isServiceItemLocal = (p) => {
    return typeof isServiceItem === 'function' ? isServiceItem(p) : (p.isService || p.department === 'infra' || String(p.brand || '').toLowerCase() === 'servicios');
  };

  // 1. Manejo de Búsqueda Directa
  if (state.searchQuery) {
    const q = normalizeSearch(state.searchQuery);
    let results = mockDatabase
      .map(p => ({ product: p, score: scoreProductMatch(p, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.product);

    // Apply Price Range Filter
    results = results.filter(p => {
      if (isServiceItemLocal(p)) return true;
      const price = parsePrice(p.price);
      return price >= state.minPrice && price <= state.maxPrice;
    });

    updateCatalogContextBar({
      title: 'Resultados de búsqueda',
      description: `Mostrando coincidencias relacionadas con “${state.searchQuery}”.`,
      resultsLabel: `${results.length} coincidencia${results.length !== 1 ? 's' : ''}`,
      activeLabel: `Búsqueda activa: ${state.searchQuery}`,
      canReset: true
    });

    renderHeader(
      'Resultados de búsqueda',
      `${results.length} coincidencia${results.length !== 1 ? 's' : ''} para "${state.searchQuery}"`
    );

    if (results.length === 0) {
      renderEmptyState(
        'Sin resultados',
        'No encontramos productos con esos términos dentro del rango de precio seleccionado. Intenta con otras palabras o limpia los filtros.'
      );
    } else {
      state.allFilteredProducts = results;
      state.page = 0;
      renderPaginatedProducts();
    }
    return;
  }

  // 2. Filtrado Base por Departamento
  let db = mockDatabase;
  if (state.dept !== 'all') db = db.filter(p => p.department === state.dept);

  // Apply Price Range Filter
  db = db.filter(p => {
    if (isServiceItemLocal(p)) return true;
    const price = parsePrice(p.price);
    return price >= state.minPrice && price <= state.maxPrice;
  });

  // NIVEL 1: CUBÍCULOS DE SUBCATEGORÍAS
  if (state.category === 'all') {
    const categoriesGroups = {};
    db.forEach(p => {
      if (!categoriesGroups[p.category]) categoriesGroups[p.category] = 0;
      categoriesGroups[p.category]++;
    });

    updateCatalogContextBar({
      title: getDeptDisplayName(state.dept),
      description: state.dept === 'all'
        ? 'Explora por departamento o entra directo a la subcategoría que necesitas.'
        : 'Selecciona un área específica para ver resultados más precisos.',
      resultsLabel: state.dept === 'all'
        ? `${db.length} artículos y servicios`
        : `${Object.keys(categoriesGroups).length} subcategorías disponibles`,
      activeLabel: state.dept === 'all'
        ? 'Vista general del catálogo'
        : `Departamento activo: ${getDeptDisplayName(state.dept)}`,
      canReset: state.dept !== 'all'
    });

    renderHeader('Explora por Subcategoría', 'Selecciona el área de tu interés dentro de este departamento.');

    const subGrid = document.createElement('div');
    subGrid.className = 'cubiculos-grid reveal in';

    Object.keys(categoriesGroups).forEach((catName, i) => {
      const card = document.createElement('div');
      card.className = 'cubiculo-card';
      card.style.backgroundImage = `url('${getFallbackImg(catName)}')`;
      card.style.animationDelay = `${i * 80}ms`;
      card.addEventListener('click', () => setCategory(catName));
      card.innerHTML = `
        <div class="cubiculo-info">
          <h4 class="cubiculo-title">${escapeHTML(catName)}</h4>
          <span class="cubiculo-count">${getCategoryCountLabel(catName, categoriesGroups[catName])}</span>
        </div>
      `;
      subGrid.appendChild(card);
    });

    container.appendChild(subGrid);
    return;
  }

  // NIVEL 2: PRODUCTOS AGRUPADOS POR MARCAS
  const catDb = db.filter(p => p.category === state.category);

  updateCatalogContextBar({
    title: state.category,
    description: getCategoryHeaderDescription(state.category, catDb.length),
    resultsLabel: `${catDb.length} resultado${catDb.length !== 1 ? 's' : ''}`,
    activeLabel: `En ${getDeptDisplayName(state.dept)}`,
    canReset: true
  });

  renderHeader(
    state.category,
    getCategoryHeaderDescription(state.category, catDb.length),
    true,
    () => setCategory('all')
  );

  // Flatten all products in brand order for pagination
  const brandsGroups = {};
  catDb.forEach(p => {
    if (!brandsGroups[p.brand]) brandsGroups[p.brand] = [];
    brandsGroups[p.brand].push(p);
  });

  // For brand-grouped view, render all with brand headers
  for (const brandName in brandsGroups) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'brand-header reveal in';
    headerDiv.innerHTML = `
      <div class="brand-header-tag">
        ${getGroupHeaderLabel(brandName)} <span>${escapeHTML(brandName.toUpperCase())}</span>
      </div>
    `;
    container.appendChild(headerDiv);

    renderProductsGrid(brandsGroups[brandName]);
  }
}


/**
 * Renderiza un encabezado de sección dentro del catálogo
 */
function renderHeader(title, desc, showBack = false, backAction = null) {
  const container = document.getElementById('catalog-grid-container');
  const wrapper = document.createElement('div');
  wrapper.className = 'catalog-inner-header reveal in';

  let html = '';
  if (showBack) {
    html += `<button class="catalog-back-btn catalog-back-btn--spaced" id="temp-back-btn" type="button"><i data-lucide="arrow-left"></i> Regresar</button>`;
  }
  html += `
    <div class="catalog-inner-header-border">
      <h2>${escapeHTML(title)}</h2>
      <p>${escapeHTML(desc)}</p>
    </div>
  `;
  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  if (showBack && backAction) {
    const btn = wrapper.querySelector('#temp-back-btn');
    if (btn) btn.addEventListener('click', backAction);
  }
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: wrapper });
}


/**
 * Renderiza un estado vacío atractivo
 */
function renderEmptyState(title, description) {
  const container = document.getElementById('catalog-grid-container');
  const div = document.createElement('div');
  div.className = 'empty-state reveal in';
  div.innerHTML = `
    <div class="empty-state-icon"><i data-lucide="search-x"></i></div>
    <h3>${escapeHTML(title)}</h3>
    <p>${escapeHTML(description)}</p>
    <div class="empty-state-actions">
      <button class="btn btn-outline empty-state-reset-btn" type="button">
        <i data-lucide="arrow-left"></i> Ver Catálogo Completo
      </button>
      <a class="btn btn-wa empty-state-wa-btn" href="https://wa.me/18297411041?text=Hola%20Futunet%2C%20no%20encontr%C3%A9%20lo%20que%20buscaba%20en%20el%20cat%C3%A1logo%20y%20quisiera%20ayuda." target="_blank">
        <i data-lucide="message-circle"></i> Pedir ayuda por WhatsApp
      </a>
    </div>
  `;
  container.appendChild(div);
  const resetButton = div.querySelector('.empty-state-reset-btn');
  if (resetButton) resetButton.addEventListener('click', clearSearch);
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: div });
}


/**
 * Limpia la búsqueda y vuelve al catálogo
 */
function resetPriceSliders() {
  state.minPrice = 0;
  state.maxPrice = 9999999;
  
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minVal = document.getElementById('price-min-val');
  const maxVal = document.getElementById('price-max-val');
  const track = document.getElementById('price-track');

  const mMinInput = document.getElementById('mobile-price-min');
  const mMaxInput = document.getElementById('mobile-price-max');
  const mMinVal = document.getElementById('mobile-price-min-val');
  const mMaxVal = document.getElementById('mobile-price-max-val');
  const mTrack = document.getElementById('mobile-price-track');

  if (minInput) minInput.value = 0;
  if (maxInput) maxInput.value = 150000;
  if (minVal) minVal.textContent = 'RD$ 0';
  if (maxVal) maxVal.textContent = 'RD$ 150,000+';

  if (mMinInput) mMinInput.value = 0;
  if (mMaxInput) mMaxInput.value = 150000;
  if (mMinVal) mMinVal.textContent = 'RD$ 0';
  if (mMaxVal) mMaxVal.textContent = 'RD$ 150,000+';

  if (minInput && maxInput && track) {
    track.style.background = `linear-gradient(to right, var(--brand) 0%, var(--brand) 100%)`;
  }
  if (mMinInput && mMaxInput && mTrack) {
    mTrack.style.background = `linear-gradient(to right, var(--brand) 0%, var(--brand) 100%)`;
  }
}

function clearSearch() {
  state.searchQuery = null;
  state.dept = 'all';
  state.category = 'all';
  state.brand = 'all';
  closeMobileFilters();

  const catalogSearch = document.getElementById('search-catalog-page');
  if (catalogSearch) catalogSearch.value = '';

  syncFilterButtons('all');
  resetPriceSliders();
  renderUI();
}


/* -------------------------------------------------------------
   3. PAGINACIÓN — "Load More" con IntersectionObserver
   ------------------------------------------------------------- */

function renderPaginatedProducts() {
  const products = state.allFilteredProducts;
  const start = 0;
  const end = Math.min((state.page + 1) * state.pageSize, products.length);
  const visible = products.slice(start, end);

  renderProductsGrid(visible);

  // Show "Load More" or "All loaded"
  if (end < products.length) {
    renderLoadMoreButton(end, products.length);
  } else if (products.length > state.pageSize) {
    // All loaded message
    const msg = document.createElement('div');
    msg.className = 'load-more-container reveal in';
    msg.innerHTML = `<p class="results-counter">Mostrando todos los ${products.length} productos</p>`;
    appendCatalogContent(msg);
  }
}

function renderLoadMoreButton(shown, total) {
  const div = document.createElement('div');
  div.className = 'load-more-container reveal in';
  div.innerHTML = `
    <button class="load-more-btn" id="load-more-btn">
      <i data-lucide="chevrons-down"></i> Cargar más productos
    </button>
    <p class="results-counter">Mostrando ${shown} de ${total} productos</p>
  `;
  appendCatalogContent(div);

  const btn = div.querySelector('#load-more-btn');
  btn.addEventListener('click', () => {
    state.page++;
    // Remove the load more button
    div.remove();
    // Render next batch
    const nextEnd = Math.min((state.page + 1) * state.pageSize, total);
    const nextProducts = state.allFilteredProducts.slice(shown, nextEnd);

    renderProductsGrid(nextProducts);

    // Re-add load more if needed
    if (nextEnd < total) {
      renderLoadMoreButton(nextEnd, total);
    } else {
      const msg = document.createElement('div');
      msg.className = 'load-more-container reveal in';
      msg.innerHTML = `<p class="results-counter">Mostrando todos los ${total} productos</p>`;
      appendCatalogContent(msg);
    }
  });

  if (typeof lucide !== 'undefined') lucide.createIcons({ root: div });
}


/* -------------------------------------------------------------
   4. RENDERIZADO DE PRODUCTOS (Cards)
   ------------------------------------------------------------- */

// renderProductsGridLegacy removed to optimize code size.

function shouldIgnoreProductCardActivation(event, card) {
  const interactiveTarget = event.target.closest(
    'button, a, input, select, textarea, summary, [data-inline-change], .inline-add-btn, [data-cart-change], [data-cart-remove], [data-product-add], .product-actions, .inline-cart-control, .inline-qty-readout'
  );

  return Boolean(interactiveTarget && card.contains(interactiveTarget) && interactiveTarget !== card);
}

function bindProductCardActivation(card, productId) {
  card.addEventListener('click', (event) => {
    if (shouldIgnoreProductCardActivation(event, card)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

function renderProductsGrid(productsList, options = {}) {
  const fragment = document.createDocumentFragment();
  const target = options.target || null;
  const compactCard = typeof options.compactMobile === 'boolean' ? options.compactMobile : isCompactMobileViewport();
  const previewCard = Boolean(options.previewMobile) && compactCard;

  productsList.forEach((product, idx) => {
    const serviceItem = isServiceItem(product);
    const badgeText = serviceItem ? 'SERVICIO' : product.brand;
    const actionText = compactCard
      ? 'Ver'
      : serviceItem
        ? 'Ver Detalles del Servicio'
        : 'Ver Ficha Tecnica';
    const metaText = serviceItem
      ? `${getDeptDisplayName(product.department)} · Servicio`
      : `${product.brand} · ${product.category}`;
    const availabilityText = serviceItem ? 'A medida' : 'Disponible';
    const card = document.createElement('a');
    card.href = 'producto.html?id=' + product.id;
    card.className = `product-card reveal in${serviceItem ? ' product-card--service' : ''}${previewCard ? ' product-card--preview-mobile' : compactCard ? ' product-card--compact-mobile' : ''}`;
    card.style.animationDelay = `${idx * 40}ms`;
    card.setAttribute('aria-label', `Ver detalles de ${product.title}`);

    bindProductCardActivation(card, product.id);

    card.innerHTML = `
      <div class="product-img-wrapper${previewCard ? ' product-img-wrapper--preview-mobile' : compactCard ? ' product-img-wrapper--compact-mobile' : ''}">
        <img src="${escapeHTML(product.img)}" alt="${escapeHTML(product.title)}" loading="lazy" width="400" height="300">
        <span class="product-badge">${escapeHTML(badgeText)}</span>
        ${previewCard ? '' : `<span class="product-available">${escapeHTML(availabilityText)}</span>`}
      </div>
      <div class="product-info${previewCard ? ' product-info--preview-mobile' : compactCard ? ' product-info--compact-mobile' : ''}">
        <div class="product-meta${previewCard ? ' product-meta--preview-mobile' : compactCard ? ' product-meta--compact-mobile' : ''}">${escapeHTML(metaText)}</div>
        <h4 class="product-title${previewCard ? ' product-title--preview-mobile' : compactCard ? ' product-title--compact-mobile' : ''}">${escapeHTML(product.title)}</h4>
        <div class="product-price${previewCard ? ' product-price--preview-mobile' : compactCard ? ' product-price--compact-mobile' : ''}">${escapeHTML(product.price)}</div>
        ${compactCard ? '' : `<p class="product-desc">${escapeHTML(product.desc)}</p>`}
        ${previewCard ? '' : `
        <div class="product-actions${compactCard ? ' product-actions--compact-mobile' : ''}">
          <button class="product-view-btn${compactCard ? ' product-view-btn--compact-mobile' : ''}" type="button">
            <i data-lucide="eye"></i> ${actionText}
          </button>
          <div class="product-add-container${compactCard ? ' product-add-container--compact-mobile' : ''}" data-product-add="${escapeHTML(product.id)}" data-product-add-variant="${compactCard ? 'compact' : 'default'}">
            ${renderInlineAddButtonHTML(product.id, compactCard ? 'compact' : 'default')}
          </div>
        </div>
        `}
      </div>
    `;

    const imgEl = card.querySelector('.product-img-wrapper img');
    if (imgEl) {
      imgEl.addEventListener('error', function onError() {
        handleImageError(this, product.id, 0);
      }, { once: true });
    }

    const actionButton = card.querySelector('.product-view-btn');
    if (actionButton) {
      actionButton.addEventListener('click', (event) => {
        event.stopPropagation();
        window.location.href = 'producto.html?id=' + product.id;
      });
    }

    fragment.appendChild(card);
  });

  if (target) {
    target.appendChild(fragment);
  } else {
    appendCatalogContent(fragment);
  }
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ root: target || document.getElementById('catalog-grid-container') });
  }
}


function handleImageError(imgEl, productId, currentIndex) {
  const product = mockDatabase.find(p => p.id === productId);
  if (product && product.gallery && currentIndex + 1 < product.gallery.length) {
    // Try the next image in the gallery
    const nextIndex = currentIndex + 1;
    imgEl.onerror = function () { handleImageError(this, productId, nextIndex); };
    imgEl.src = product.gallery[nextIndex];
  } else {
    // No more images to try, show placeholder
    imgEl.onerror = null;
    imgEl.src = 'img/placeholder.svg';
  }
}


/* -------------------------------------------------------------
   5. CONTROLADORES DE ESTADO UI
   ------------------------------------------------------------- */

function filterCat(dept, btn) {
  syncFilterButtons(dept);

  state.dept = dept;
  state.category = 'all';
  state.brand = 'all';
  state.searchQuery = null;
  state.page = 0;

  // Si hay input en catálogo, limpiarlo
  const catalogSearch = document.getElementById('search-catalog-page');
  if (catalogSearch) catalogSearch.value = '';

  closeMobileFilters();
  renderUI();
  if (btn && isMobileViewport()) scrollCatalogToTop();
}

function setCategory(catName) {
  state.category = catName;
  state.brand = 'all';
  state.page = 0;
  closeMobileFilters();
  renderUI();
  scrollCatalogToTop();
}

function setBrand(brandName) {
  state.brand = brandName;
  state.page = 0;
  renderUI();
}


/* -------------------------------------------------------------
   6. PRODUCT MODAL (MARKETPLACE)
   ------------------------------------------------------------- */

let lastModalTrigger = null;

function openProductModal(id) {
  const product = mockDatabase.find(p => p.id === id);
  if (!product) return;
  const serviceItem = isServiceItem(product);
  closeMobileFilters();
  lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  setModalCartProduct(id);

  document.getElementById('modal-title').textContent = product.title;
  document.getElementById('modal-price').textContent = product.price;
  document.getElementById('modal-brand').textContent = serviceItem ? 'SERVICIO' : product.brand;
  const availabilityPill = document.getElementById('modal-availability');
  if (availabilityPill) {
    availabilityPill.textContent = serviceItem ? 'A medida' : 'Disponible';
    availabilityPill.classList.toggle('modal-availability-pill--service', serviceItem);
  }
  document.getElementById('modal-desc').textContent = product.desc;
  const metaSummary = document.getElementById('modal-meta-summary');
  if (metaSummary) {
    metaSummary.textContent = serviceItem
      ? `${getDeptDisplayName(product.department)} · ${product.category}`
      : `${product.brand} · ${product.category}`;
  }
  const specsTitle = document.querySelector('.specs-title');
  if (specsTitle) {
    specsTitle.textContent = serviceItem ? 'Alcance del Servicio' : 'Especificaciones Técnicas';
  }

  const mainImg = document.getElementById('modal-main-img');
  mainImg.src = product.img;
  mainImg.onerror = function () { this.onerror = null; this.src = 'img/placeholder.svg'; };

  const thumbsContainer = document.getElementById('modal-thumbnails');
  thumbsContainer.innerHTML = '';
  thumbsContainer.hidden = !product.gallery || product.gallery.length <= 1;

  if (product.gallery && product.gallery.length > 0) {
    product.gallery.forEach((url, i) => {
      const thumb = document.createElement('img');
      thumb.className = i === 0 ? 'thumb-img active' : 'thumb-img';
      thumb.src = url;
      thumb.alt = `${product.title} - Imagen ${i + 1}`;
      thumb.onerror = function () { this.style.display = 'none'; };
      thumb.addEventListener('click', () => {
        mainImg.src = url;
        mainImg.onerror = function () { this.onerror = null; this.src = 'img/placeholder.svg'; };
        document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      thumbsContainer.appendChild(thumb);
    });
  }

  const specsList = document.getElementById('modal-specs');
  specsList.innerHTML = '';
  if (product.specs && product.specs.length > 0) {
    product.specs.forEach(spec => {
      const li = document.createElement('li');
      li.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${escapeHTML(spec)}</span>`;
      specsList.appendChild(li);
    });
  }

  const btnQuote = document.getElementById('modal-quote-btn');
  btnQuote.innerHTML = `<i data-lucide="message-circle"></i> ${serviceItem ? 'Solicitar este servicio' : 'Cotizar Modelo Exacto'}`;
  btnQuote.onclick = () => { requestQuote(product.title, product.brand, product.price, serviceItem); };
  const btnAddCart = document.getElementById('modal-add-cart-btn');
  if (btnAddCart) {
    btnAddCart.setAttribute('aria-label', `Agregar ${product.title} al carrito`);
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ root: document.getElementById('product-modal') });
  }

  const modal = document.getElementById('product-modal');
  const modalContent = modal.querySelector('.modal-content');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  if (modalContent) modalContent.scrollTop = 0;
  setTimeout(() => modal.classList.add('show'), 10);
  const closeButton = modal.querySelector('[data-close-product-modal]');
  if (closeButton) closeButton.focus();
  syncCatalogScrollLock();
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal || modal.style.display === 'none') return;
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    syncCatalogScrollLock();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }, 300);
}

// Cerrar modal con Escape o click fuera
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (isMobileFilterSheetOpen()) {
    closeMobileFilters();
    return;
  }
  if (isProductModalOpen()) closeProductModal();
});
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (modal && e.target === modal) closeProductModal();
});

function requestQuote(product, brand, price, serviceItem = false) {
  const isService = serviceItem || String(brand || '').toLowerCase() === 'servicios';
  const text = isService
    ? `Hola Futunet, deseo solicitar el servicio: *${product}* con precio de referencia ${price}. Favor brindarme información y disponibilidad.`
    : `Hola Futunet, deseo comprar o cotizar el producto: *${product}* (Marca: ${brand}) listado al precio de: ${price}. Favor brindarme información.`;
  window.open(`https://wa.me/18297411041?text=${encodeURIComponent(text)}`, '_blank');
}


function bindCatalogInterface() {
  document.addEventListener('click', (event) => {
    const filterButton = event.target.closest('[data-filter-dept]');
    if (filterButton) {
      filterCat(filterButton.dataset.filterDept || 'all', filterButton);
      return;
    }

    const searchTrigger = event.target.closest('[data-search-trigger]');
    if (searchTrigger) {
      const inputId = searchTrigger.dataset.searchInput;
      const input = inputId ? document.getElementById(inputId) : null;
      if (input) executeSearch(input.value.trim());
      return;
    }

    if (event.target.closest('[data-close-product-modal]')) {
      closeProductModal();
    }
  });
}


/* -------------------------------------------------------------
   7. SMART SEARCH (RUTEO Y AUTOCOMPLETADO CON DEBOUNCE)
   ------------------------------------------------------------- */

function initSmartSearch(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const drop = document.getElementById(dropdownId);
  if (!input || !drop) return;

  const handleSearch = debounce((q) => {
    if (q.length < 2) {
      drop.classList.remove('active');
      return;
    }

    // Algoritmo de coincidencias B2B
    const resultCats = new Set();
    const resultBrands = new Set();
    const resultModels = [];

    const nq = normalizeSearch(q);
    mockDatabase.forEach(p => {
      const nCat = normalizeSearch(p.category);
      const nBrand = normalizeSearch(p.brand);
      const nTitle = normalizeSearch(p.title);
      const nDesc = normalizeSearch(p.desc);
      if (fuzzyMatch(nCat, nq)) resultCats.add(p.category);
      if (fuzzyMatch(nBrand, nq)) resultBrands.add(p.brand);
      if (fuzzyMatch(nTitle, nq) || fuzzyMatch(nDesc, nq)) {
        resultModels.push(p);
      }
    });

    let html = '';

    // 1. Mostrar Categorías
    if (resultCats.size > 0) {
      html += `<div class="search-group-title">Sistemas & Categorías</div>`;
      resultCats.forEach(c => {
        html += `<div class="search-item" data-search="${escapeHTML(c)}" role="option" tabindex="0"><i data-lucide="layers"></i> ${escapeHTML(c)}</div>`;
      });
    }

    // 2. Mostrar Marcas
    if (resultBrands.size > 0) {
      html += `<div class="search-group-title">Marcas Recomendadas</div>`;
      resultBrands.forEach(b => {
        html += `<div class="search-item" data-search="${escapeHTML(b)}" role="option" tabindex="0"><i data-lucide="tag"></i> Todo sobre ${escapeHTML(b)}</div>`;
      });
    }

    // 3. Mostrar Modelos Exactos (Max 5)
    if (resultModels.length > 0) {
      html += `<div class="search-group-title">Modelos Específicos</div>`;
      resultModels.slice(0, 5).forEach(m => {
        html += `<div class="search-item search-item--product" data-product-id="${escapeHTML(m.id)}" data-search="${escapeHTML(m.title)}" role="option" tabindex="0">` +
                `  <img src="${escapeHTML(m.img || 'img/placeholder.svg')}" class="search-item-thumb" alt="" onerror="this.src='img/placeholder.svg'" />` +
                `  <div class="search-item-info">` +
                `    <span class="search-item-name">${escapeHTML(m.title)}</span>` +
                `    <span class="search-item-brand">${escapeHTML(m.brand)}</span>` +
                `  </div>` +
                `  <span class="search-item-price">${escapeHTML(m.price)}</span>` +
                `</div>`;
      });
    }

    if (html === '') {
      html = `<div class="search-item search-item--muted" role="option" aria-disabled="true"><i data-lucide="search-x"></i> Sin resultados</div>`;
    }

    drop.innerHTML = html;

    // Attach click handlers to search items (instead of inline onclick)
    drop.querySelectorAll('.search-item').forEach(item => {
      const handler = () => {
        const prodId = item.getAttribute('data-product-id');
        if (prodId) {
          window.location.href = `producto.html?id=${encodeURIComponent(prodId)}`;
        } else {
          const q = item.getAttribute('data-search');
          if (q) executeSearch(q);
        }
      };
      item.addEventListener('click', handler);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handler();
        }
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons({ root: drop });
    drop.classList.add('active');
  }, 250); // 250ms debounce

  input.addEventListener('input', (e) => {
    handleSearch(e.target.value.toLowerCase().trim());
  });

  // Ejecutar con Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) executeSearch(q);
    }
  });

  // Cerrar si hace click afuera
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !drop.contains(e.target)) {
      drop.classList.remove('active');
    }
  });
}

const debouncedLogSearch = debounce(async (clean) => {
  try {
    const db = window.FutunetFirebase?.db;
    if (db) {
      await db.collection('search_queries').add({
        query: clean,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (e) {
    console.warn('Error saving search query:', e);
  }
}, 1500);

async function logSearchQuery(query) {
  const clean = String(query || '').trim().toLowerCase();
  if (!clean || clean.length < 2) return;
  debouncedLogSearch(clean);
}

function executeSearch(query) {
  const normalizedQuery = String(query || '').trim();
  if (!normalizedQuery) return;

  // Log to Firestore
  logSearchQuery(normalizedQuery);

  // Check if we are in Catalog Page
  const path = window.location.pathname.toLowerCase();
  if (path.includes('catalogo.html')) {
    // We are inside Catalog, just trigger state
    state.searchQuery = normalizedQuery;
    state.dept = 'all';
    state.category = 'all';
    state.brand = 'all';
    state.page = 0;
    syncFilterButtons('all');

    const input = document.getElementById('search-catalog-page');
    if (input) input.value = normalizedQuery;
    const drop = document.getElementById('search-drop-catalog');
    if (drop) drop.classList.remove('active');

    closeMobileFilters();
    renderUI();
  } else {
    // Redirect to Catalog page with parameter
    window.location.href = `catalogo.html?q=${encodeURIComponent(normalizedQuery)}`;
  }
}


function initPriceFilter() {
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minVal = document.getElementById('price-min-val');
  const maxVal = document.getElementById('price-max-val');
  const track = document.getElementById('price-track');

  const mMinInput = document.getElementById('mobile-price-min');
  const mMaxInput = document.getElementById('mobile-price-max');
  const mMinVal = document.getElementById('mobile-price-min-val');
  const mMaxVal = document.getElementById('mobile-price-max-val');
  const mTrack = document.getElementById('mobile-price-track');

  if (!minInput || !maxInput) return;

  function formatDop(val) {
    if (val >= 150000) return 'RD$ 150,000+';
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  }

  function updateTrack(sliderMin, sliderMax, trackEl) {
    if (!trackEl) return;
    const minVal = parseInt(sliderMin.value);
    const maxVal = parseInt(sliderMax.value);
    const minPercent = (minVal / sliderMin.max) * 100;
    const maxPercent = (maxVal / sliderMax.max) * 100;
    trackEl.style.background = `linear-gradient(to right, #e5eef8 ${minPercent}%, var(--brand) ${minPercent}%, var(--brand) ${maxPercent}%, #e5eef8 ${maxPercent}%)`;
  }

  const handlePriceChange = debounce(() => {
    renderUI();
  }, 200);

  function syncSliders(isMobileSource) {
    const srcMin = isMobileSource ? mMinInput : minInput;
    const srcMax = isMobileSource ? mMaxInput : maxInput;
    const destMin = isMobileSource ? minInput : mMinInput;
    const destMax = isMobileSource ? maxInput : mMaxInput;

    if (!srcMin || !srcMax) return;

    let minV = parseInt(srcMin.value);
    let maxV = parseInt(srcMax.value);

    const gap = 5000;
    if (maxV - minV < gap) {
      if (srcMin === document.activeElement || (mMinInput && mMinInput === document.activeElement)) {
        srcMin.value = maxV - gap;
        minV = maxV - gap;
      } else {
        srcMax.value = minV + gap;
        maxV = minV + gap;
      }
    }

    if (destMin) destMin.value = minV;
    if (destMax) destMax.value = maxV;

    state.minPrice = minV;
    state.maxPrice = maxV >= 150000 ? 9999999 : maxV;

    if (minVal) minVal.textContent = formatDop(minV);
    if (maxVal) maxVal.textContent = formatDop(maxV);
    if (mMinVal) mMinVal.textContent = formatDop(minV);
    if (mMaxVal) mMaxVal.textContent = formatDop(maxV);

    updateTrack(minInput, maxInput, track);
    if (mMinInput && mMaxInput) updateTrack(mMinInput, mMaxInput, mTrack);

    handlePriceChange();
  }

  minInput.addEventListener('input', () => syncSliders(false));
  maxInput.addEventListener('input', () => syncSliders(false));

  if (mMinInput && mMaxInput) {
    mMinInput.addEventListener('input', () => syncSliders(true));
    mMaxInput.addEventListener('input', () => syncSliders(true));
  }

  updateTrack(minInput, maxInput, track);
  if (mMinInput && mMaxInput) updateTrack(mMinInput, mMaxInput, mTrack);
}

/* -------------------------------------------------------------
   8. BOOTSTRAPPING
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', async () => {
  if (window.FutunetData && window.FutunetData.readyPromise) {
    await window.FutunetData.readyPromise;
  }
  bindCatalogInterface();
  initPriceFilter();
  const mobileFilterTrigger = document.getElementById('catalog-mobile-filter-trigger');
  const mobileFilterBarTrigger = document.getElementById('catalog-mobile-filter-bar-trigger');
  const mobileFilterClosers = document.querySelectorAll('[data-close-mobile-filters]');

  if (mobileFilterTrigger) {
    mobileFilterTrigger.addEventListener('click', openMobileFilters);
  }
  if (mobileFilterBarTrigger) {
    mobileFilterBarTrigger.addEventListener('click', openMobileFilters);
  }
  mobileFilterClosers.forEach((button) => {
    button.addEventListener('click', closeMobileFilters);
  });
  window.addEventListener('resize', () => {
    if (!isMobileViewport()) closeMobileFilters();
  });

  const catalogResetTrigger = document.getElementById('catalog-reset-trigger');
  if (catalogResetTrigger) {
    catalogResetTrigger.addEventListener('click', handleCatalogResetAction);
  }

  if (document.getElementById('catalog-grid-container')) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const brand = params.get('brand');

    if (q) {
      state.searchQuery = q;
      logSearchQuery(q);
      syncFilterButtons('all');
      const initialInput = document.getElementById('search-catalog-page');
      if (initialInput) initialInput.value = q;
      renderUI();
    } else if (brand) {
      // Filtrar por marca desde los logos del Index
      state.searchQuery = brand;
      logSearchQuery(brand);
      syncFilterButtons('all');
      const initialInput = document.getElementById('search-catalog-page');
      if (initialInput) initialInput.value = brand;
      renderUI();
    } else {
      const cat = params.get('cat') || 'all';
      filterCat(cat, null);
    }
  }

  initPageCart();
  initModalCartButton();

  // Inicializar Buscadores si existen en el DOM
  initSmartSearch('search-home', 'search-drop-home');
  initSmartSearch('search-navbar', 'search-drop-navbar');
  initSmartSearch('search-catalog-page', 'search-drop-catalog');
});
