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
  const progressBar = document.getElementById('hero-progress-bar');

  if (!track) return;

  // Query banners from Firestore if available
  let dynamicBanners = [];
  try {
    if (window.FutunetFirebase && window.FutunetFirebase.db) {
      const db = window.FutunetFirebase.db;
      // Ordenar en el cliente evita depender de un índice compuesto solo para este carrusel.
      const snapshot = await db.collection('banners').where('isActive', '==', true).get();
      if (!snapshot.empty) {
        const now = new Date();
        snapshot.forEach(doc => {
          const data = doc.data();
          let shouldShow = true;
          
          if (data.startDate) {
            const start = new Date(data.startDate);
            if (now < start) shouldShow = false;
          }
          if (data.endDate) {
            // If it's a simple YYYY-MM-DD, default to the end of that day (23:59:59)
            const endLimit = data.endDate.includes('T') ? new Date(data.endDate) : new Date(data.endDate + 'T23:59:59');
            if (now > endLimit) shouldShow = false;
          }
          
          if (shouldShow) {
            dynamicBanners.push({ id: doc.id, ...data });
          }
        });
        dynamicBanners.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
      }
    }
  } catch (e) {
    console.warn('Failed to load dynamic banners, using HTML static fallback:', e);
  }

  function escapeAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function sanitizeUrl(url, fallback = '#') {
    const rawUrl = String(url || '').trim();
    if (!rawUrl) return fallback;

    try {
      const parsed = new URL(rawUrl, window.location.href);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return fallback;
      return rawUrl;
    } catch (error) {
      return fallback;
    }
  }

  function sanitizeHtml(htmlString) {
    if (!htmlString) return '';
    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(htmlString, 'text/html');
      var clean = sanitizeNode(doc.body);
      return clean.innerHTML;
    } catch (e) {
      console.warn('HTML sanitization failed, returning escaped text:', e);
      var div = document.createElement('div');
      div.textContent = htmlString;
      return div.innerHTML;
    }
  }

  function sanitizeNode(node) {
    var allowedTags = ['br', 'span', 'b', 'i', 'strong', 'em', 'p'];
    var allowedClasses = ['hero-title-accent', 'section-title', 'section-sub', 'hb-title', 'hb-desc'];
    
    var doc = node.ownerDocument;
    var cleanNode = doc.createElement(node.tagName);
    
    if (node.hasAttributes()) {
      var attrs = node.attributes;
      for (var i = 0; i < attrs.length; i++) {
        var attrName = attrs[i].name.toLowerCase();
        var attrVal = attrs[i].value;
        if (attrName === 'class') {
          var classes = attrVal.split(/\s+/).filter(function (c) {
            return allowedClasses.indexOf(c) !== -1;
          }).join(' ');
          if (classes) {
            cleanNode.setAttribute('class', classes);
          }
        }
      }
    }
    
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) {
        cleanNode.appendChild(doc.createTextNode(child.nodeValue));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        var tag = child.tagName.toLowerCase();
        if (allowedTags.indexOf(tag) !== -1) {
          var cleanChild = sanitizeNode(child);
          cleanNode.appendChild(cleanChild);
        }
      }
    }
    return cleanNode;
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
      
      const title = String(banner.title || 'Promoción Futunet');
      const linkUrl = sanitizeUrl(banner.link, 'catalogo.html');
      const imageUrl = sanitizeUrl(banner.image, 'img/logo.webp');
      const cleanWaMsg = `Hola Futunet, me interesa la promoción: ${title.replace(/<[^>]*>/g, '')}`;
      const whatsappNumber = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || '18297411041';
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(cleanWaMsg)}`;

      slideDiv.innerHTML = `
        <div class="hb-bg"></div>
        <div class="hb-overlay"></div>
        <div class="hb-body">
          <span class="hb-label"><i data-lucide="tag"></i> Promoción</span>
          <h2 class="hb-title">${sanitizeHtml(title)}</h2>
          <p class="hb-desc">${sanitizeHtml(banner.subtitle || '')}</p>
          <div class="hb-actions">
            <a href="${escapeAttr(linkUrl)}" class="btn btn-primary">Ver detalles</a>
            <a href="${escapeAttr(waUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-wa">
              <svg width="16" height="16"><use href="#wa-icon"/></svg> Consultar ahora
            </a>
          </div>
        </div>
      `;
      const background = slideDiv.querySelector('.hb-bg');
      if (background) background.style.backgroundImage = `url(${JSON.stringify(imageUrl)})`;
      track.appendChild(slideDiv);
    });
  }

  // Re-fetch slides now that the DOM has been modified
  const slides = Array.from(carousel.querySelectorAll('.hero-carousel-slide'));
  if (slides.length < 2) return;

  let current = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 6000;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let progressVal = 0;
  let isPaused = false;
  let userPaused = reduceMotion;
  let startX = 0;
  let isDragging = false;
  let isSearching = false;

  // Build Dots dynamically based on the final slides count
  dotsContainer.innerHTML = '';
  slides.forEach((slide, i) => {
    const slideId = `hero-carousel-slide-${i + 1}`;
    slide.id = slideId;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
    slide.setAttribute('aria-label', `${i + 1} de ${slides.length}`);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', i === 0 ? 'Mostrar inicio' : `Mostrar promoción ${i}`);
    dot.setAttribute('aria-controls', slideId);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.hero-carousel-dot'));
  const toggleButton = carousel.querySelector('#hero-carousel-toggle');

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
      const isActive = i === current;
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      if (isActive) s.removeAttribute('inert');
      else s.setAttribute('inert', '');
    });

    dots.forEach((d, i) => {
      const isActive = i === current;
      d.classList.toggle('active', isActive);
      d.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    updateNavbarState(current);
    resetAutoPlay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  carousel.addEventListener('keydown', (e) => {
    const target = e.target;
    const isEditable = target && (
      target.matches('input, textarea, select, [contenteditable="true"]') ||
      target.getAttribute('role') === 'textbox'
    );
    if (isEditable) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  });

  function updateProgressBar() {
    if (progressBar) {
      progressBar.style.width = progressVal + '%';
      progressBar.setAttribute('aria-valuenow', String(Math.round(progressVal)));
    }
  }

  function updateToggleButton() {
    if (!toggleButton) return;
    const label = userPaused ? 'Reanudar rotación automática' : 'Pausar rotación automática';
    toggleButton.setAttribute('aria-pressed', String(userPaused));
    toggleButton.setAttribute('aria-label', label);
    const icon = toggleButton.querySelector('.hero-carousel-toggle__icon');
    if (icon) icon.textContent = userPaused ? '▶' : 'Ⅱ';
    const accessibleLabel = toggleButton.querySelector('.sr-only');
    if (accessibleLabel) accessibleLabel.textContent = label;
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (isSearching || userPaused || document.hidden) return;
    isPaused = false;

    let startTime = Date.now() - (progressVal / 100) * AUTO_INTERVAL;

    autoTimer = setInterval(function () {
      if (isPaused) return;

      let elapsed = Date.now() - startTime;
      progressVal = (elapsed / AUTO_INTERVAL) * 100;

      if (progressVal >= 100) {
        progressVal = 0;
        updateProgressBar();
        next();
      } else {
        updateProgressBar();
      }
    }, 100);
  }

  function stopAutoPlay() {
    isPaused = true;
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    progressVal = 0;
    updateProgressBar();
    startAutoPlay();
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      userPaused = !userPaused;
      updateToggleButton();
      if (userPaused) stopAutoPlay();
      else startAutoPlay();
    });
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

  carousel.addEventListener('focusin', () => {
    isSearching = true;
    stopAutoPlay();
  });

  carousel.addEventListener('focusout', (e) => {
    if (e.relatedTarget && carousel.contains(e.relatedTarget)) return;
    isSearching = false;
    startAutoPlay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  });

  goTo(0);
  updateToggleButton();
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
