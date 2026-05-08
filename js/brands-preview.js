/* =============================================================
   BRANDS-PREVIEW.JS — Preview de productos por marca (hover/tap)
   Desktop: hover muestra popup. Mobile: tap toggle.
   ============================================================= */
(function () {
  'use strict';

  const brandsSection = document.getElementById('marcas');
  if (!brandsSection) return;

  const brandItems = brandsSection.querySelectorAll('.brand-item[data-brand-preview]');
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

      // If tapping the "Ver productos" button, let it navigate
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

        // Scroll into view on mobile
        setTimeout(() => {
          popup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!activePopup) return;
    if (!e.target.closest('.brand-item[data-brand-preview]')) {
      closeAllPopups();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPopups();
  });
})();
