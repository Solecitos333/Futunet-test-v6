/* =============================================================
   PROMO-CAROUSEL.JS — Hero Carousel integrado
   Slide 0 = Hero original. Slides 1+ = Banners.
   Cuando se muestra un banner, navbar muestra logo+buscador.
   Cuando se muestra hero, navbar oculta logo+buscador.
   ============================================================= */
(function () {
  'use strict';

  const carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.hero-carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.hero-carousel-slide'));
  const prevBtn = carousel.querySelector('.hero-carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.hero-carousel-arrow--next');
  const dotsContainer = carousel.querySelector('.hero-carousel-dots');
  const navbar = document.getElementById('navbar');

  if (!track || slides.length < 2) return;

  let current = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 6000;
  let startX = 0;
  let isDragging = false;

  // ── Build Dots ──
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
    const isHeroSlide = slide && slide.dataset.slide === 'hero';

    if (navbar) {
      // When hero slide is active: hide navbar logo+search (hero has its own)
      // When banner slide is active: show navbar logo+search
      navbar.classList.toggle('hero-slide-active', isHeroSlide);
      navbar.classList.toggle('banner-slide-active', !isHeroSlide);
    }
  }

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;

    // Fade transition: hide all, show current
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      s.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Update navbar based on which slide type
    updateNavbarState(current);

    resetAutoPlay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // ── Arrow Buttons ──
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // ── Keyboard ──
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // ── Auto-Play ──
  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(next, AUTO_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause on hover (desktop, only on banners)
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // ── Touch/Swipe ──
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

  // ── Init ──
  goTo(0);
  startAutoPlay();

  // Pause when not visible
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAutoPlay();
        else stopAutoPlay();
      });
    }, { threshold: 0.15 });
    obs.observe(carousel);
  }
})();
