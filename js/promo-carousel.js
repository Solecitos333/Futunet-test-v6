/* =============================================================
   PROMO-CAROUSEL.JS — Hero Carousel integrado
   Slide 0 = Hero original. Slides 1+ = Banners dinámicos (de Firestore).
   Cuando se muestra un banner, navbar muestra logo+buscador.
   Cuando se muestra hero, navbar oculta logo+buscador.
   ============================================================= */
(async function () {
  'use strict';

  // Wait for config script to fetch dynamic numbers
  if (window.FutunetConfigReady) {
    await window.FutunetConfigReady;
  }

  const carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.hero-carousel-track');
  const prevBtn = carousel.querySelector('.hero-carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.hero-carousel-arrow--next');
  const dotsContainer = carousel.querySelector('.hero-carousel-dots');
  const navbar = document.getElementById('navbar');

  if (!track) return;

  // Query banners from Firestore if available
  let dynamicBanners = [];
  try {
    if (window.FutunetFirebase && window.FutunetFirebase.db) {
      const db = window.FutunetFirebase.db;
      const snapshot = await db.collection('banners').where('isActive', '==', true).orderBy('order').get();
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          dynamicBanners.push({ id: doc.id, ...doc.data() });
        });
      }
    }
  } catch (e) {
    console.warn('Failed to load dynamic banners, using HTML static fallback:', e);
  }

  // If we found dynamic banners in Firestore, replace the static ones in HTML
  if (dynamicBanners.length > 0) {
    // Keep only the first slide (the original Hero)
    const originalHero = track.querySelector('.hero-carousel-slide[data-slide="hero"]');
    track.innerHTML = '';
    if (originalHero) {
      track.appendChild(originalHero);
    }

    // Append dynamic banner slides
    dynamicBanners.forEach(banner => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'hero-carousel-slide hero-carousel-slide--banner';
      slideDiv.setAttribute('data-slide', 'banner');
      
      const linkUrl = banner.link || '#';
      const cleanWaMsg = `Hola Futunet, me interesa la promoción: ${banner.title.replace(/<[^>]*>/g, '')}`;
      const waUrl = `https://wa.me/${FUTUNET_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(cleanWaMsg)}`;

      slideDiv.innerHTML = `
        <div class="hb-bg" style="background-image:url('${banner.image || 'img/logo.png'}')"></div>
        <div class="hb-overlay"></div>
        <div class="hb-body">
          <span class="hb-label"><i data-lucide="tag"></i> Promoción</span>
          <h2 class="hb-title">${banner.title}</h2>
          <p class="hb-desc">${banner.subtitle || ''}</p>
          <div class="hb-actions">
            <a href="${linkUrl}" class="btn btn-primary">Ver detalles</a>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-wa">
              <svg width="16" height="16"><use href="#wa-icon"/></svg> Consultar ahora
            </a>
          </div>
        </div>
      `;
      track.appendChild(slideDiv);
    });
  }

  // Re-fetch slides now that the DOM has been modified
  const slides = Array.from(carousel.querySelectorAll('.hero-carousel-slide'));
  if (slides.length < 2) return;

  let current = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 6000;
  let startX = 0;
  let isDragging = false;
  let isSearching = false;

  // Build Dots dynamically based on the final slides count
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', i === 0 ? 'Inicio' : `Promoción ${i}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.hero-carousel-dot'));

  function updateNavbarState(slideIndex) {
    const slide = slides[slideIndex];
    const isHeroSlide = slide && slide.getAttribute('data-slide') === 'hero';

    if (navbar) {
      navbar.classList.toggle('hero-slide-active', isHeroSlide);
      navbar.classList.toggle('banner-slide-active', !isHeroSlide);
    }
  }

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      s.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    updateNavbarState(current);
    resetAutoPlay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  function startAutoPlay() {
    stopAutoPlay();
    if (isSearching) return;
    autoTimer = setInterval(next, AUTO_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    startAutoPlay();
  }, { passive: true });

  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.type === 'search') {
      isSearching = true;
      stopAutoPlay();
    }
  });

  document.addEventListener('focusout', (e) => {
    if (e.target && e.target.type === 'search') {
      isSearching = false;
      startAutoPlay();
    }
  });

  goTo(0);
  startAutoPlay();

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAutoPlay();
        else stopAutoPlay();
      });
    }, { threshold: 0.15 });
    obs.observe(carousel);
  }

  // Refresh Lucide Icons inside dynamic slides
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
})();
