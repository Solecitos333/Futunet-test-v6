/* =============================================================
   PROMO-CAROUSEL.JS — Carrusel de Promociones (Homepage)
   Auto-play, flechas, dots, touch/swipe support.
   ============================================================= */
(function () {
  'use strict';

  const carousel = document.getElementById('promo-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.promo-track');
  const slides = Array.from(carousel.querySelectorAll('.promo-slide'));
  const prevBtn = carousel.querySelector('.promo-arrow--prev');
  const nextBtn = carousel.querySelector('.promo-arrow--next');
  const dotsContainer = carousel.querySelector('.promo-dots');

  if (!track || slides.length === 0) return;

  let current = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 5000;
  let startX = 0;
  let isDragging = false;

  // ── Build Dots ──
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'promo-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a promoción ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.promo-dot'));

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;

    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== current ? 'true' : 'false'));

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

  // Pause on hover (desktop)
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // ── Touch/Swipe ──
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
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
    }, { threshold: 0.3 });
    obs.observe(carousel);
  }
})();
