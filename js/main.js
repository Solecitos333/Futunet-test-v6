/* =============================================================
   MAIN.JS — Futunet SRL
   Funcionalidad global del sitio:
   - Efecto de scroll en el navbar (opacidad al bajar)
   - Toggle del menú mobile (hamburguesa)
   - Animación de revelado en scroll (IntersectionObserver)
   - Botón "Volver Arriba"
   - Preloader suave
   ============================================================= */


/* -------------------------------------------------------------
   1. NAVBAR — Efecto de scroll y animación Hide/Show
   ------------------------------------------------------------- */
let lastScrollY = window.scrollY;
let navHoldVisibleUntil = 0;

// FLIP Logo Animation Variables
let logoAnimState = {
  dx: 0,
  dy: 0,
  scale: 1,
  active: false
};

function resetLogoFlip() {
  const logoImg = document.querySelector('.nav-logo img');
  if (logoImg) {
    logoImg.style.transition = '';
    logoImg.style.transform = 'none';
  }
  logoAnimState.active = false;
}

const SCROLL_ANIM_HEIGHT = 150; // Scroll strictly between 0 and this value

function syncViewportUIVars() {
  const navbar = document.getElementById('navbar');
  const mobileBar = document.querySelector('.mobile-bottom-bar');
  const navHeight = navbar ? `${Math.round(navbar.offsetHeight)}px` : '76px';
  const mobileBarHeight = mobileBar ? `${Math.round(mobileBar.offsetHeight)}px` : '74px';

  document.documentElement.style.setProperty('--navbar-height-mobile', navHeight);
  document.documentElement.style.setProperty('--mobile-bottom-bar-height', mobileBarHeight);
  document.body.classList.toggle('has-mobile-bottom-bar', Boolean(mobileBar));
}

function syncHomeTrustBarPlacement() {
  const trustBar = document.getElementById('home-trust-bar');
  const anchor = document.getElementById('trust-bar-home-anchor');
  const servicesSection = document.getElementById('servicios');
  if (!trustBar || !anchor || !servicesSection) return;

  const showcaseDivider = servicesSection.previousElementSibling;
  const shouldMoveAfterShowcase = window.innerWidth <= 767;

  if (shouldMoveAfterShowcase && showcaseDivider?.classList.contains('section-divider')) {
    showcaseDivider.parentNode.insertBefore(trustBar, showcaseDivider);
    trustBar.classList.add('trust-bar--after-showcase');
    return;
  }

  if (anchor.nextElementSibling !== trustBar) {
    anchor.parentNode.insertBefore(trustBar, anchor.nextSibling);
  }
  trustBar.classList.remove('trust-bar--after-showcase');
}

function initLogoFlip() {
  resetLogoFlip();
}

function initHomeHeroLogoSync() {
  const navbar = document.getElementById('navbar');
  const navLogo = document.querySelector('.nav-logo');
  const heroBrandMark = document.querySelector('.hero-brand-mark');

  if (!navbar || !navLogo || !heroBrandMark) return;

  const setHeroLogoState = (isHeroLogoVisible) => {
    const heroSlide = document.querySelector('.hero-carousel-slide[data-slide="hero"]');
    const isHeroActive = heroSlide ? heroSlide.classList.contains('active') : true;
    const shouldHideLogo = isHeroLogoVisible && isHeroActive;

    navbar.classList.toggle('nav-hero-logo-hidden', shouldHideLogo);
    if (shouldHideLogo) {
      navLogo.setAttribute('aria-hidden', 'true');
      navLogo.setAttribute('tabindex', '-1');
    } else {
      navLogo.removeAttribute('aria-hidden');
      navLogo.removeAttribute('tabindex');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      const isVisible = Boolean(entry?.isIntersecting) && entry.intersectionRatio > 0.18;
      setHeroLogoState(isVisible);
    },
    {
      threshold: [0, 0.18, 0.45],
      rootMargin: '-72px 0px 0px 0px'
    }
  );

  observer.observe(heroBrandMark);
}

function applyLogoFlip(currentScrollY) {
  if (!logoAnimState.active) return;
  
  const logoImg = document.querySelector('.nav-logo img');
  if (!logoImg) return;
  
  const scrollPos = (currentScrollY !== undefined) ? currentScrollY : window.scrollY;
  
  // Calculate progress from 0 to 1
  let progress = scrollPos / SCROLL_ANIM_HEIGHT;
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;
  
  // Interpolate: when progress is 0, we want max transform.
  // When progress is 1, we want 0 transform.
  const invProgress = 1 - progress;
  
  // Apply a slight easing to the progress curve (ease-out effect)
  const ease = Math.sin(invProgress * (Math.PI / 2));
  
  const currentDx = logoAnimState.dx * ease;
  const currentDy = logoAnimState.dy * ease;
  // Scale interpolates between target scale and 1
  const currentScale = 1 + ((logoAnimState.scale - 1) * ease);
  
  logoImg.style.transform = `translate(${currentDx}px, ${currentDy}px) scale(${currentScale})`;
}

window.addEventListener('resize', initLogoFlip);
document.addEventListener('DOMContentLoaded', initLogoFlip);
window.addEventListener('resize', syncViewportUIVars);
window.addEventListener('load', syncViewportUIVars);
document.addEventListener('DOMContentLoaded', syncViewportUIVars);
window.addEventListener('resize', syncHomeTrustBarPlacement);
window.addEventListener('load', syncHomeTrustBarPlacement);
document.addEventListener('DOMContentLoaded', syncHomeTrustBarPlacement);

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const internalNavLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

  internalNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navHoldVisibleUntil = Date.now() + 900;
      if (navbar) navbar.classList.remove('nav-hidden');
    });
  });
});

let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const navbar = document.getElementById('navbar');
      const mobileMenu = document.getElementById('mobileMenu');
      
      if (navbar) {
        // Scrolled class for opacity and shadow
        navbar.classList.toggle('scrolled', currentScrollY > 40);
        
        // Hide/Show animation logic
        if (Date.now() < navHoldVisibleUntil) {
          navbar.classList.remove('nav-hidden');
        } else if (mobileMenu && mobileMenu.classList.contains('open')) {
          navbar.classList.remove('nav-hidden');
        } else if (currentScrollY > (window.innerWidth < 768 ? 220 : window.innerWidth < 1024 ? 210 : 150) && currentScrollY > lastScrollY) {
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
      }
      
      // Apply FLIP for logo
      applyLogoFlip(currentScrollY);

      // Back to top button visibility
      const backToTop = document.getElementById('back-to-top');
      if (backToTop) {
        backToTop.classList.toggle('visible', currentScrollY > 400);
      }
      
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* -------------------------------------------------------------
   2. MENÚ MOBILE — Toggle, cierre y accesibilidad
   ------------------------------------------------------------- */

/**
 * Abre o cierra el menú mobile.
 * Se llama desde el onclick del botón hamburguesa.
 */
function setMobileMenuOpen(isOpen) {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('[data-mobile-toggle]');
  if (!menu) return;

  menu.classList.toggle('open', isOpen);
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  }
  if (typeof syncCatalogScrollLock === 'function') {
    syncCatalogScrollLock();
  } else {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  syncViewportUIVars();
}

function toggleMobile() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  setMobileMenuOpen(!menu.classList.contains('open'));
}

/**
 * Cierra el menú mobile.
 * Se llama al hacer clic en un enlace del menú.
 */
function closeMobile() {
  setMobileMenuOpen(false);
}

function initNavigationBindings() {
  const menu = document.getElementById('mobileMenu');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileCloseLinks = document.querySelectorAll('[data-close-mobile-menu]');
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');
  const isCatalogPage = window.location.pathname.toLowerCase().includes('catalogo.html');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobile);
  }

  mobileCloseLinks.forEach((link) => {
    link.addEventListener('click', closeMobile);
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (isCatalogPage && href === 'catalogo.html') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  document.addEventListener('click', (event) => {
    if (!menu || !menu.classList.contains('open')) return;
    const path = event.composedPath ? event.composedPath() : [];
    if (path.includes(menu) || path.includes(mobileToggle)) return;
    closeMobile();
  });
}

function initBrandImageFallbacks() {
  document.querySelectorAll('.brand-item img').forEach((img) => {
    img.addEventListener('error', () => {
      img.hidden = true;
      const fallback = img.nextElementSibling;
      if (fallback) {
        fallback.hidden = false;
      }
    }, { once: true });
  });
}

function initTrustBarDetails() {
  const trustButtons = Array.from(document.querySelectorAll('.trust-toggle'));
  const detailTitle = document.getElementById('trust-mobile-detail-title');
  const detailCopy = document.getElementById('trust-mobile-detail-copy');

  if (!trustButtons.length || !detailTitle || !detailCopy) return;

  const setActiveTrust = (activeButton) => {
    trustButtons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-expanded', String(isActive));
    });

    detailTitle.textContent = activeButton.dataset.trustTitle || '';
    detailCopy.textContent = activeButton.dataset.trustCopy || '';
  };

  const initialButton = trustButtons.find((button) => button.classList.contains('is-active')) || trustButtons[0];
  if (initialButton) setActiveTrust(initialButton);

  trustButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveTrust(button);
    });
  });
}

function loadInventoryDataScript() {
  if (window.inventoryDataLoaded) return Promise.resolve();
  if (window.inventoryDataPromise) return window.inventoryDataPromise;
  window.loadingInventoryData = true;

  window.inventoryDataPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'js/inventory_data.js';
    script.defer = true;
    script.fetchPriority = 'low';
    script.onload = () => {
      window.inventoryDataLoaded = true;
      window.loadingInventoryData = false;
      resolve();
    };
    script.onerror = () => {
      window.loadingInventoryData = false;
      window.inventoryDataPromise = null;
      reject(new Error('Error cargando inventory_data.js'));
    };
    document.body.appendChild(script);
  });

  return window.inventoryDataPromise;
}

window.loadInventoryDataScript = loadInventoryDataScript;

// Close mobile menu with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      closeMobile();
    }
  }
});


/* -------------------------------------------------------------
   3. SCROLL REVEAL — Animación de entrada
   ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavigationBindings();
  initBrandImageFallbacks();
  initTrustBarDetails();
  initHomeHeroLogoSync();
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => observer.observe(el));
});


/* -------------------------------------------------------------
   4. BACK TO TOP — Botón de volver arriba
   ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Create Back to Top button
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);
});



/* -------------------------------------------------------------
   5. HOME SEARCH — Redirect logic for hero search
   ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-home');
  const searchBtn = document.querySelector('[data-search-trigger][data-search-input="search-home"]');

  if (!searchInput || !searchBtn) return;

  function handleSearch() {
    const q = searchInput.value.trim();
    if (q) {
      // Redirect to catalog page with search query
      window.location.href = `catalogo.html?q=${encodeURIComponent(q)}`;
    }
  }

  searchBtn.addEventListener('click', handleSearch);

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });
});


/* -------------------------------------------------------------
   6. TYPING ANIMATION — Search placeholder rotator
   ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-home');
  if (!searchInput) return;

  const phrases = [
    'Buscar c\u00e1maras de seguridad...',
    'Buscar laptops Dell...',
    'Buscar paneles solares...',
    'Buscar impresoras Epson...',
    'Buscar UPS y respaldo el\u00e9ctrico...',
    'Buscar routers TP-Link...'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function typeLoop() {
    // Don't animate if input is focused or has user content
    if (document.activeElement === searchInput || searchInput.value.length > 0) {
      searchInput.setAttribute('placeholder', phrases[0]);
      setTimeout(typeLoop, 1000);
      return;
    }

    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(typeLoop, 60);
      return;
    }

    if (!isDeleting) {
      charIndex++;
      searchInput.setAttribute('placeholder', current.substring(0, charIndex));
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(typeLoop, 2000); // pause at full text
        return;
      }
      setTimeout(typeLoop, 70 + Math.random() * 40);
    } else {
      charIndex--;
      searchInput.setAttribute('placeholder', current.substring(0, charIndex));
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 35);
    }
  }

  // Start after a brief delay
  setTimeout(typeLoop, 2000);
});


/* -------------------------------------------------------------
   7. PARALLAX — Subtle depth on hero background layers
   ------------------------------------------------------------- */
(function() {
  const heroSection = document.getElementById('inicio');
  if (!heroSection) return;

  const dots = heroSection.querySelector('.hero-dots');
  const glow = heroSection.querySelector('.hero-glow');
  const bg = heroSection.querySelector('.hero-bg');

  if (!dots && !glow && !bg) return;

  let parallaxTicking = false;

  function applyParallax() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    // Only apply within the hero section
    if (scrollY > heroHeight) {
      parallaxTicking = false;
      return;
    }

    const progress = scrollY / heroHeight;

    if (dots) dots.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (glow) glow.style.transform = `translateY(${scrollY * 0.25}px) scale(${1 + progress * 0.1})`;
    if (bg) bg.style.transform = `translateY(${scrollY * 0.08}px)`;

    parallaxTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      window.requestAnimationFrame(applyParallax);
      parallaxTicking = true;
    }
  }, { passive: true });
})();

function hidePagePreloader() {
  const preloader = document.getElementById('page-preloader');
  if (preloader) preloader.classList.add('hidden');
  document.body.classList.remove('is-loading');
  document.body.style.display = ''; // Fallback for safety
}

window.addEventListener('load', hidePagePreloader);
// Fallback timeout in case resources (images, large scripts) hang the load event on mobile
setTimeout(hidePagePreloader, 1250);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
  });
}

// Inject LocalBusiness Schema
function injectLocalBusinessSchema() {
  const existing = document.getElementById('localbusiness-jsonld');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = 'localbusiness-jsonld';
  script.type = 'application/ld+json';

  const address = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.ADDRESS : 'Santiago, República Dominicana';
  const phone = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Futunet",
    "image": window.location.origin + "/img/logo.png",
    "@id": window.location.origin + "/#localbusiness",
    "url": window.location.origin,
    "telephone": phone,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": "Santiago",
      "addressCountry": "DO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.476061,
      "longitude": -70.715163
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }
  };

  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

if (typeof window.FutunetConfigReady !== 'undefined') {
  window.FutunetConfigReady.then(injectLocalBusinessSchema);
} else {
  document.addEventListener('DOMContentLoaded', injectLocalBusinessSchema);
}
