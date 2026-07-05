/* =============================================================
   BRANDS-PREVIEW.JS — Preview de productos por marca (hover/tap)
   Desktop: hover muestra popup. Mobile: tap toggle.
   Cargado dinámicamente desde Firestore si está disponible.
   ============================================================= */
(async function () {
  'use strict';

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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
      
      const logoUrl = b.logo || 'img/logo.webp';
      itemLink.innerHTML = `
        <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(b.name)}" loading="lazy" />
        <div class="brand-preview-popup">
          <img src="${escapeHtml(logoUrl)}" alt="Productos ${escapeHtml(b.name)}" class="brand-preview-img" style="object-fit:contain; background:#ffffff; padding:10px; border-radius:8px;" loading="lazy" />
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

      if (e.target.closest('.brand-preview-popup')) return;

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

  // Lógica del botón de expansión de marcas
  const btnToggle = document.getElementById('btn-toggle-brands');
  const extendedGrid = document.getElementById('extended-brands-grid');
  
  if (btnToggle && extendedGrid) {
    btnToggle.addEventListener('click', function() {
      const isExpanded = extendedGrid.classList.contains('expanded');
      
      if (!isExpanded) {
        // Expandir
        const displayStyle = window.matchMedia('(max-width: 767px)').matches ? 'grid' : 'flex';
        extendedGrid.style.display = displayStyle;
        // Forzar reflow
        void extendedGrid.offsetWidth;
        extendedGrid.classList.add('expanded');
        extendedGrid.setAttribute('aria-hidden', 'false');
        btnToggle.setAttribute('aria-expanded', 'true');
        const textSpan = btnToggle.querySelector('span');
        if (textSpan) textSpan.textContent = 'Ver menos marcas';
        const icon = btnToggle.querySelector('.toggle-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        // Colapsar
        extendedGrid.classList.remove('expanded');
        extendedGrid.setAttribute('aria-hidden', 'true');
        btnToggle.setAttribute('aria-expanded', 'false');
        const textSpan = btnToggle.querySelector('span');
        if (textSpan) textSpan.textContent = '¡Y muchas más marcas!';
        const icon = btnToggle.querySelector('.toggle-icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
        
        // Ocultar display después de la transición de CSS (500ms)
        setTimeout(() => {
          if (!extendedGrid.classList.contains('expanded')) {
            extendedGrid.style.display = 'none';
          }
        }, 500);
      }
    });
  }

})();
