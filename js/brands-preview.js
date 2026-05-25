/* =============================================================
   BRANDS-PREVIEW.JS — Preview de productos por marca (hover/tap)
   Desktop: hover muestra popup. Mobile: tap toggle.
   Cargado dinámicamente desde Firestore si está disponible.
   ============================================================= */
(async function () {
  'use strict';

  const brandsSection = document.getElementById('marcas');
  if (!brandsSection) return;

  const grid = brandsSection.querySelector('.brands-grid');
  if (!grid) return;

  // 1. Fetch from Firestore if available
  let dynamicBrands = [];
  try {
    if (window.FutunetFirebase && window.FutunetFirebase.db) {
      const db = window.FutunetFirebase.db;
      const snapshot = await db.collection('brands').orderBy('name').get();
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          dynamicBrands.push({ id: doc.id, ...doc.data() });
        });
      }
    }
  } catch (e) {
    console.warn('Failed to load dynamic brands, using HTML static fallback:', e);
  }

  // 2. Render dynamic brands if we found any
  if (dynamicBrands.length > 0) {
    grid.innerHTML = '';
    dynamicBrands.forEach(b => {
      const itemLink = document.createElement('a');
      itemLink.href = `catalogo.html?brand=${encodeURIComponent(b.name)}`;
      itemLink.className = 'brand-item';
      itemLink.setAttribute('data-brand-preview', b.name.toLowerCase());
      itemLink.setAttribute('title', `Ver productos ${b.name}`);
      itemLink.setAttribute('aria-label', `Ver productos ${b.name}`);
      
      const logoUrl = b.logo || 'img/logo.png';
      itemLink.innerHTML = `
        <img src="${logoUrl}" alt="${escapeHtml(b.name)}" loading="lazy" />
        <div class="brand-preview-popup">
          <img src="${logoUrl}" alt="Productos ${escapeHtml(b.name)}" class="brand-preview-img" style="object-fit:contain; background:#ffffff; padding:10px; border-radius:8px;" loading="lazy" />
          <span class="brand-preview-btn">Ver productos ${escapeHtml(b.name)}</span>
        </div>
      `;
      grid.appendChild(itemLink);
    });
  }

  // 3. Re-bind hover/tap interactions
  const brandItems = brandsSection.querySelectorAll('.brand-item');
  if (!brandItems.length) return;

  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  let activePopup = null;
  let activeItem = null;

  function closeAllPopups() {
    document.querySelectorAll('.brand-preview-popup.visible').forEach(p => {
      p.classList.remove('visible');
    });
    document.querySelectorAll('.brand-item.brand-active').forEach(b => {
      b.classList.remove('brand-active');
    });
    activePopup = null;
    activeItem = null;
  }

  brandItems.forEach(item => {
    const popup = item.querySelector('.brand-preview-popup');
    if (!popup) return;

    // Desktop: Hover
    item.addEventListener('mouseenter', () => {
      if (isTouchDevice()) return;
      closeAllPopups();
      popup.classList.add('visible');
      item.classList.add('brand-active');
      activePopup = popup;
      activeItem = item;
    });

    item.addEventListener('mouseleave', () => {
      if (isTouchDevice()) return;
      popup.classList.remove('visible');
      item.classList.remove('brand-active');
      if (activePopup === popup) { activePopup = null; activeItem = null; }
    });

    // Mobile: Tap toggle
    item.addEventListener('click', (e) => {
      if (!isTouchDevice()) return;

      if (e.target.closest('.brand-preview-btn')) return;

      e.preventDefault();
      e.stopPropagation();

      const isActive = popup.classList.contains('visible');

      closeAllPopups();

      if (!isActive) {
        popup.classList.add('visible');
        item.classList.add('brand-active');
        activePopup = popup;
        activeItem = item;

        setTimeout(() => {
          popup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!activePopup) return;
    if (!e.target.closest('.brand-item')) {
      closeAllPopups();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
})();
