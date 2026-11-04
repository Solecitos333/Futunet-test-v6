/* =============================================================================
   🛡️ FUTUNET DEVSECOPS & CYBERSECURITY AUDIT LEDGER (BITÁCORA EN CÓDIGO)
   =============================================================================
   Rol: Ingeniero DevSecOps & Especialista en Ciberseguridad Senior
   Objetivo Diario: Auditoría continua de código, frontend, formularios, OWASP Top 10
                    y privacidad (Ley 172-13 / RGPD), aplicando mitigaciones seguras.
   Documento Maestro: docs/DEVSECOPS_SECURITY_LEDGER.md

   DIAGRAMA DE FLUJO DE AUDITORÍA Y MITIGACIÓN INCREMENTAL:
   +-----------------------+     +-----------------------+
   | 1. Detección Estática | --> | 2. Clasificación      |
   |    (OWASP / PII)      |     |    (CVSS / ASVS v4.0) |
   +-----------------------+     +-----------------------+
               |
               v
   +-----------------------+     +-----------------------+
   | 3. Mitigación Segura  | --> | 4. Verificación       |
   |    (Incremental)      |     |    (Regresión Zero)   |
   +-----------------------+     +-----------------------+
               |
               v
   +-----------------------------------------------------+
   | 5. Actualización de Bitácora & Memoria de Seguridad |
   +-----------------------------------------------------+

   ESTADO ACTUAL DE DEFENSAS AUDITADAS (ACTUALIZADO 2026-09-23):
   [OK] Formularios Públicos: Trampas Honeypot activas en formularios clave (incluyendo las 7 páginas B2B y checkout).
   [OK] Privacidad (Ley 172-13): Consentimiento obligatorio en todos los formularios con PII y enlaces seguros con rel="noopener noreferrer".
   [OK] Rate Limiting en Cliente: Cooldowns en checkout (10s), sugerencias (15s), cotizaciones (10s), soporte, pagos y registro (10s), lockout en login.
   [OK] Sanitización Contextual: Neutralización de tags HTML y caracteres de control ASCII invisibles en formularios.
   [OK] Autenticación & Redirección: Protección contra Open Redirect con allowlist estricta de origen.
   [OK] Cabeceras & Enlaces: HSTS, X-Frame-Options DENY, nosniff, COOP, CORP, CSP y cero presencia de enlaces con noopener solitario en HTMLs y JS.
   [OK] Reglas de Storage: Restricción estricta de tipos MIME (img/pdf) y tamaños máximos (5MB/8MB).
   [OK] Backend API: Extracción robusta get_safe_client_ip contra spoofing de cabeceras de IP y rate limit activo.

   PRÓXIMOS PASOS / BACKLOG PRIORITARIO:
   1. Endurecimiento de CSP (analizar reducción de 'unsafe-inline' en scripts/estilos).
   2. Auditoría exhaustiva de 'innerHTML' dinámico en renderers (posible DOM XSS).
   3. Pruebas continuas de jailbreak / prompt injection en endpoints de chatbot_api.py.

   COMANDO DE VERIFICACIÓN RÁPIDA:
   node tools/test-forms-security.cjs
   =============================================================================
   MAIN.JS — Futunet SRL
   Funcionalidad global del sitio:
   - Efecto de scroll en el navbar (opacidad al bajar)
   - Toggle del menú mobile (hamburguesa)
   - Animación de revelado en scroll (IntersectionObserver)
   - Botón "Volver Arriba"
   - Preloader suave
   ============================================================================= */


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

  if (!('IntersectionObserver' in window)) return;

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

let cachedLogoImg = null;
let cachedNavbar = null;
let cachedMobileMenu = null;
let cachedBackToTop = null;

function applyLogoFlip(currentScrollY) {
  if (!logoAnimState.active) return;
  
  if (!cachedLogoImg) {
    cachedLogoImg = document.querySelector('.nav-logo img');
  }
  const logoImg = cachedLogoImg;
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

// Debounce helper for resize events
function debounce(fn, delay) {
  let timer;
  return function() { clearTimeout(timer); timer = setTimeout(fn, delay); };
}

const onResize = debounce(function() {
  initLogoFlip();
  syncViewportUIVars();
  syncHomeTrustBarPlacement();
}, 150);

window.addEventListener('resize', onResize);
window.addEventListener('load', syncViewportUIVars);
window.addEventListener('load', syncHomeTrustBarPlacement);

function initInternalNavLinks() {
  const navbar = document.getElementById('navbar');
  const internalNavLinks = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

  internalNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navHoldVisibleUntil = Date.now() + 900;
      if (navbar) navbar.classList.remove('nav-hidden');
    });
  });
}

let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      if (!cachedNavbar) cachedNavbar = document.getElementById('navbar');
      if (!cachedMobileMenu) cachedMobileMenu = document.getElementById('mobileMenu');
      
      const navbar = cachedNavbar;
      const mobileMenu = cachedMobileMenu;
      
      if (navbar) {
        // Scrolled class for opacity and shadow
        navbar.classList.toggle('scrolled', currentScrollY > 40);
        
        // Hide/Show animation logic
        if (Date.now() < navHoldVisibleUntil) {
          navbar.classList.remove('nav-hidden');
        } else if (mobileMenu && mobileMenu.classList.contains('open')) {
          navbar.classList.remove('nav-hidden');
        } else if (currentScrollY > (window.innerWidth < 1024 ? 210 : 150) && currentScrollY > lastScrollY) {
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
      }
      
      // Apply FLIP for logo
      applyLogoFlip(currentScrollY);

      // Back to top button visibility
      if (!cachedBackToTop) cachedBackToTop = document.getElementById('back-to-top');
      const backToTop = cachedBackToTop;
      if (backToTop) {
        backToTop.classList.toggle('visible', currentScrollY > 400);
      }
      
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* Focus Trap Utility */
function setupFocusTrap(container, closeCallback) {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      const focusables = Array.from(container.querySelectorAll(focusableSelectors))
        .filter(el => !el.disabled && el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    } else if (e.key === 'Escape' && typeof closeCallback === 'function') {
      closeCallback();
    }
  }
  
  container.addEventListener('keydown', handleKeyDown);
  return function cleanup() {
    container.removeEventListener('keydown', handleKeyDown);
  };
}
window.FutunetFocusTrap = setupFocusTrap;

/* -------------------------------------------------------------
   2. MENÚ MOBILE — Toggle, cierre y accesibilidad
   ------------------------------------------------------------- */

let mobileMenuCleanup = null;
let mobileMenuPreviousActiveElement = null;

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

  if (isOpen) {
    mobileMenuPreviousActiveElement = document.activeElement;
    if (mobileMenuCleanup) mobileMenuCleanup();
    mobileMenuCleanup = setupFocusTrap(menu, () => setMobileMenuOpen(false));
    // Enfocar el primer elemento
    setTimeout(() => {
      const focusables = menu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length > 0) focusables[0].focus();
    }, 100);
  } else {
    if (mobileMenuCleanup) {
      mobileMenuCleanup();
      mobileMenuCleanup = null;
    }
    if (mobileMenuPreviousActiveElement && typeof mobileMenuPreviousActiveElement.focus === 'function') {
      mobileMenuPreviousActiveElement.focus();
      mobileMenuPreviousActiveElement = null;
    }
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
  const isCatalogPage = window.location.pathname.toLowerCase().includes('catalogo');

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

  const loadSingleScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.fetchPriority = 'low';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Error cargando ' + src));
    document.body.appendChild(script);
  });

  window.inventoryDataPromise = (async () => {
    try {
      if (!window.backupDatabase && !window.mockDatabase) {
        await loadSingleScript('js/backup_data.js').catch((err) => {
          console.warn('Fallback backup_data no cargado:', err);
        });
      }
      await loadSingleScript('js/inventory_data.js');
      window.inventoryDataLoaded = true;
      window.loadingInventoryData = false;
    } catch (err) {
      window.loadingInventoryData = false;
      window.inventoryDataPromise = null;
      throw err;
    }
  })();

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
function initScrollReveal() {
  initNavigationBindings();
  initBrandImageFallbacks();
  initTrustBarDetails();
  initHomeHeroLogoSync();
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => observer.observe(el));
}


/* -------------------------------------------------------------
   4. BACK TO TOP — Botón de volver arriba
   ------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);
}



/* -------------------------------------------------------------
   5. HOME SEARCH — Redirect logic for hero search
   ------------------------------------------------------------- */
function initHomeSearch() {
  const searchInput = document.getElementById('search-home');
  const searchBtn = document.querySelector('[data-search-trigger][data-search-input="search-home"]');

  if (!searchInput || !searchBtn) return;

  function handleSearch() {
    const q = searchInput.value.trim();
    if (q) {
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
}


/* -------------------------------------------------------------
   6. TYPING ANIMATION — Search placeholder rotator (Optimized)
   ------------------------------------------------------------- */
function initTypingAnimation() {
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
  let lastTime = 0;
  let delay = 2000;
  let isIntersecting = true;
  let frameId = null;

  if (!('IntersectionObserver' in window)) {
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    isIntersecting = entry ? entry.isIntersecting : true;
    if (isIntersecting) {
      if (!frameId) {
        lastTime = performance.now();
        frameId = requestAnimationFrame(tick);
      }
    } else {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }
  }, { threshold: 0 });
  observer.observe(searchInput);

  function tick(timestamp) {
    if (!isIntersecting) {
      frameId = null;
      return;
    }

    const elapsed = timestamp - lastTime;
    if (elapsed >= delay) {
      lastTime = timestamp;
      
      if (document.activeElement === searchInput || searchInput.value.length > 0) {
        searchInput.setAttribute('placeholder', phrases[0]);
        delay = 1000;
        frameId = requestAnimationFrame(tick);
        return;
      }

      const current = phrases[phraseIndex];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        delay = 60;
      } else if (!isDeleting) {
        charIndex++;
        searchInput.setAttribute('placeholder', current.substring(0, charIndex));
        if (charIndex === current.length) {
          isPaused = true;
          delay = 2000;
        } else {
          delay = 70 + Math.random() * 40;
        }
      } else {
        charIndex--;
        searchInput.setAttribute('placeholder', current.substring(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 400;
        } else {
          delay = 35;
        }
      }
    }
    frameId = requestAnimationFrame(tick);
  }
}


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

let preloaderTimeout = null;

function hidePagePreloader() {
  if (preloaderTimeout) clearTimeout(preloaderTimeout);
  const preloader = document.getElementById('page-preloader');
  if (preloader) preloader.classList.add('hidden');
  document.body.classList.remove('is-loading');
}

window.addEventListener('load', hidePagePreloader);
// Fallback timeout in case resources (images, large scripts) hang the load event on mobile
preloaderTimeout = setTimeout(hidePagePreloader, 1500);

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
    "image": window.location.origin + "/img/logo.webp",
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
      "latitude": 19.4819,
      "longitude": -70.7200
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

// Lógica de inyección de schema del LocalBusiness
function handleLocalBusinessSchema() {
  if (typeof injectLocalBusinessSchema === 'function') {
    injectLocalBusinessSchema();
  }
}

// Inyección dinámica del año actual en el footer
function initFooterYear() {
  const currentYear = new Date().getFullYear();
  const footerYears = document.querySelectorAll('#footer-year, .footer-year');
  footerYears.forEach(function(el) {
    el.textContent = currentYear;
  });
}

// Función de notificación Toast compartida globalmente
window.showToast = function(msg, type) {
  var existing = document.querySelector('.up-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'up-toast up-toast-' + (type || 'info');
  toast.textContent = msg;
  
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%) translateY(20px)';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '14px';
  toast.style.fontFamily = 'Outfit, sans-serif';
  toast.style.fontSize = '0.85rem';
  toast.style.fontWeight = '600';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.3s ease';
  toast.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
  toast.style.backgroundColor = type === 'success' ? '#0e8a5f' : (type === 'error' ? '#c0392b' : '#0B7EB5');
  toast.style.color = '#ffffff';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  document.body.appendChild(toast);
  requestAnimationFrame(function () {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(function () { toast.remove(); }, 300);
  }, 4000);
};

// Apertura segura de enlaces externos (WhatsApp / cotizaciones) sin interferir con la página activa
window.safeOpenWhatsApp = function (url) {
  if (!url) return;
  try {
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 200);
  } catch (err) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// Resaltado dinámico del menú superior (Personas, Corporativo)
function initTopMenuHighlight() {
  var pathname = window.location.pathname;
  var filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';

  var topLinks = document.querySelectorAll('.claro-top-links a');
  topLinks.forEach(function (a) {
    a.classList.remove('active');
  });

  if (filename === 'corporativo.html' || filename === 'corporativo') {
    var corpLink = document.querySelector('.top-link-corporativo');
    if (corpLink) corpLink.classList.add('active');
  } else {
    var personasLink = document.querySelector('.top-link-personas');
    if (personasLink) personasLink.classList.add('active');
  }
}

function initEstimatorAccessibility() {
  const cards = Array.from(document.querySelectorAll('.workstation-card'));
  if (!cards.length) return;

  const syncGroup = (name) => {
    cards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      if (!input || input.name !== name) return;
      card.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  };

  cards.forEach((card) => {
    const input = card.querySelector('input[type="radio"]');
    if (!input) return;

    card.setAttribute('role', 'radio');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    input.setAttribute('tabindex', '-1');

    card.addEventListener('click', () => {
      window.requestAnimationFrame(() => syncGroup(input.name));
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.click();
    });
  });
}

// =============================================================
// BOOTSTRAPPING CENTRALIZADO - LISTENER RESILIENTE
// =============================================================
function bootstrapFutunetMain() {
  // Inicialización de logo, navbar, anuncio y vistas adaptables
  normalizeSiteNavigation();
  initAnnouncementBar();
  initLogoFlip();
  syncViewportUIVars();
  syncHomeTrustBarPlacement();
  initInternalNavLinks();
  
  // Inicializaciones visuales y observers de scroll
  initScrollReveal();
  initBackToTop();
  
  // Buscadores y placeholders animados
  initHomeSearch();
  initTypingAnimation();
  
  // Inyección de Schemas SEO y metadatos
  if (typeof window !== 'undefined' && typeof window.FutunetConfigReady !== 'undefined') {
    window.FutunetConfigReady.then(handleLocalBusinessSchema);
  } else {
    handleLocalBusinessSchema();
  }
  
  initFooterYear();
  initTopMenuHighlight();
  initEstimatorAccessibility();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapFutunetMain);
  } else {
    bootstrapFutunetMain();
  }
}

/* -------------------------------------------------------------
   8. PORTAL RAPIDO — Interacciones del portal de inicio
   ------------------------------------------------------------- */
function switchPortalTab(tabName) {
  const tabHogar = document.getElementById('tab-hogar');
  const tabEmpresas = document.getElementById('tab-empresas');
  const panelHogar = document.getElementById('panel-hogar');
  const panelEmpresas = document.getElementById('panel-empresas');
  
  if (!tabHogar || !tabEmpresas || !panelHogar || !panelEmpresas) return;
  
  if (tabName === 'hogar') {
    tabHogar.classList.add('active');
    tabHogar.setAttribute('aria-selected', 'true');
    tabEmpresas.classList.remove('active');
    tabEmpresas.setAttribute('aria-selected', 'false');
    
    panelHogar.classList.add('active');
    panelEmpresas.classList.remove('active');
  } else if (tabName === 'empresas') {
    tabEmpresas.classList.add('active');
    tabEmpresas.setAttribute('aria-selected', 'true');
    tabHogar.classList.remove('active');
    tabHogar.setAttribute('aria-selected', 'false');
    
    panelEmpresas.classList.add('active');
    panelHogar.classList.remove('active');
  }

  // Refrescar carruseles de planes en móvil si cambian de tab
  if (typeof window.refreshHogarCarousel === 'function') window.refreshHogarCarousel();
  if (typeof window.refreshEmpresasCarousel === 'function') window.refreshEmpresasCarousel();
}
window.switchPortalTab = switchPortalTab;

function selectHomePlan(planName, planId, price) {
  if (price === undefined && typeof planId === 'number') {
    price = planId;
    planId = String(planName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  try {
    sessionStorage.setItem('pending_hiring_plan_name', String(planName || ''));
    sessionStorage.setItem('pending_hiring_plan_id', String(planId || ''));
    sessionStorage.setItem('pending_hiring_plan_price', String(price || ''));
  } catch (err) {
    console.warn('Storage no disponible para pending_hiring_plan:', err);
  }
  
  if (window.showToast) {
    window.showToast('Redirigiendo al portal para completar tu solicitud...', 'info');
  }
  
  setTimeout(function() {
    window.location.href = 'internet.html';
  }, 1000);
}
window.selectHomePlan = selectHomePlan;

/* -------------------------------------------------------------
   NAVEGACION GLOBAL — una sola arquitectura para todo el sitio
   ------------------------------------------------------------- */
function normalizeSiteNavigation() {
  const header = document.querySelector('.site-header');
  const navbar = document.getElementById('navbar');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!header || !navbar || !mobileMenu) return;

  const waNum = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || '18297411041';
  const waNumFormatted = waNum === '18297411041' ? '829-741-1041' : waNum;

  const topBar = header.querySelector('.claro-top-bar');
  if (topBar) {
    topBar.innerHTML = `
      <div class="container site-utility-inner">
        <nav class="site-utility-links" aria-label="Navegación de utilidad">
          <a href="index.html">Hogar</a>
          <a href="corporativo.html">Empresas</a>
          <a href="nosotros.html">Nosotros</a>
          <a href="login.html">Área de clientes</a>
          <a href="https://maps.app.goo.gl/mySNxSfamvRfFqZA9" target="_blank" rel="noopener noreferrer">Ubicación</a>
          <a href="https://wa.me/${waNum}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </nav>
        <span class="site-utility-location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Santiago, RD</span>
      </div>`;
  }

  const navInner = navbar.querySelector('.nav-inner');
  if (navInner) {
    navInner.innerHTML = `
      <a href="index.html" class="nav-logo" aria-label="Volver al inicio de Futunet">
        <img src="img/logo-navbar.webp" alt="Futunet" width="972" height="303" />
      </a>
      <form class="nav-search-compact" id="nav-search-compact" role="search" aria-label="Buscador rápido" action="catalogo.html" method="GET">
        <i class="fas fa-search nav-search-compact__icon" aria-hidden="true"></i>
        <input type="search" id="search-navbar" name="q" class="nav-search-compact__input" placeholder="Buscar productos..." autocomplete="off" maxlength="100" aria-label="Buscar productos" />
        <div id="search-drop-navbar" class="search-dropdown" aria-label="Resultados" role="listbox" aria-live="polite"></div>
      </form>
      <ul class="nav-menu" aria-label="Navegación principal">
        <li><a href="index.html">Inicio</a></li>
        <li class="has-mega">
          <a href="internet.html" class="mega-trigger" aria-haspopup="true">Internet <i class="fas fa-chevron-down" aria-hidden="true"></i></a>
          <div class="mega-menu-container mega-menu-container--compact">
            <div class="mega-menu-grid mega-menu-grid--single">
              <div class="mega-menu-col">
                <div class="mega-menu-title">Internet Futunet</div>
                <ul>
                  <li><a href="internet.html#planes">Planes para el hogar</a></li>
                  <li><a href="internet.html#planes">Internet para empresas</a></li>
                  <li><a href="internet.html#cobertura">Prevalidar cobertura</a></li>
                  <li><a href="internet.html#planes">Comparar planes</a></li>
                  <li><a href="internet.html#faqs">Preguntas frecuentes</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="has-mega">
          <a href="index.html#servicios" class="mega-trigger" aria-haspopup="true">Soluciones <i class="fas fa-chevron-down" aria-hidden="true"></i></a>
          <div class="mega-menu-container">
            <div class="mega-menu-grid mega-menu-grid--two">
              <div class="mega-menu-col">
                <div class="mega-menu-title">Tecnología e infraestructura</div>
                <ul>
                  <li><a href="seguridad-electronica.html">Seguridad electrónica</a></li>
                  <li><a href="redes-datos.html">Redes y conectividad</a></li>
                  <li><a href="energia-climatizacion.html">Energía y climatización</a></li>
                </ul>
              </div>
              <div class="mega-menu-col">
                <div class="mega-menu-title">Espacios de trabajo</div>
                <ul>
                  <li><a href="equipos-oficina.html">Equipos de oficina</a></li>
                  <li><a href="mobiliario-suministros.html">Mobiliario y suministros</a></li>
                  <li><a href="infraestructura-remozamiento.html">Infraestructura y remozamiento</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="has-mega">
          <a href="catalogo.html" class="mega-trigger" aria-haspopup="true">Tienda <i class="fas fa-chevron-down" aria-hidden="true"></i></a>
          <div class="mega-menu-container">
            <div class="mega-menu-grid mega-menu-grid--two">
              <div class="mega-menu-col">
                <div class="mega-menu-title">Productos</div>
                <ul>
                  <li><a href="catalogo.html?cat=equipos">Computadoras y laptops</a></li>
                  <li><a href="catalogo.html?cat=redes">Redes y WiFi</a></li>
                  <li><a href="catalogo.html?cat=seguridad">Cámaras y seguridad</a></li>
                </ul>
              </div>
              <div class="mega-menu-col">
                <div class="mega-menu-title">Más categorías</div>
                <ul>
                  <li><a href="catalogo.html?cat=energia">Energía y climatización</a></li>
                  <li><a href="catalogo.html?cat=oficina">Impresoras, oficina y mobiliario</a></li>
                  <li><a href="catalogo.html">Ver catálogo completo</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="has-mega">
          <a href="soporte.html" class="mega-trigger" aria-haspopup="true">Soporte <i class="fas fa-chevron-down" aria-hidden="true"></i></a>
          <div class="mega-menu-container mega-menu-container--compact">
            <div class="mega-menu-grid mega-menu-grid--single">
              <div class="mega-menu-col">
                <div class="mega-menu-title">Ayuda y autogestión</div>
                <ul>
                  <li><a href="soporte.html">Soporte, errores y reclamaciones</a></li>
                  <li><a href="soporte.html#sp-cases">Consultar mis tickets</a></li>
                  <li><a href="sugerencias.html">💡 Buzón de sugerencias e ideas</a></li>
                  <li><a href="https://wa.me/${waNum}" target="_blank" rel="noopener noreferrer">WhatsApp de soporte</a></li>
                  <li><a href="internet.html#faqs">Preguntas frecuentes</a></li>
                  <li><a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer">Medir velocidad</a></li>
                  <li><a href="login.html">Área de clientes</a></li>
                  <li><a href="login.html?redirect=internet.html">Reportar avería</a></li>
                  <li><a href="login.html?redirect=internet.html">Ver factura y reportar pago</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li><a href="index.html#contacto" class="nav-quote-link">Cotizar proyecto</a></li>
      </ul>
      <div class="nav-actions">
        <div class="navbar-auth-container"></div>
        <a href="https://wa.me/${waNum}" target="_blank" rel="noopener noreferrer" class="nav-wa-btn" aria-label="Hablar con Futunet por WhatsApp">
          <i class="fab fa-whatsapp" aria-hidden="true"></i><span>${waNumFormatted}</span>
        </a>
      </div>
      <button class="hamburger" type="button" data-mobile-toggle aria-controls="mobileMenu" aria-expanded="false" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>`;
  }

  mobileMenu.innerHTML = `
    <div class="mobile-menu__head">
      <strong>Menú</strong>
      <button type="button" class="mobile-menu__close" data-close-mobile-menu aria-label="Cerrar menú"><i class="fas fa-times" aria-hidden="true"></i></button>
    </div>
    <a href="index.html" data-close-mobile-menu>Inicio</a>
    <details class="mobile-details">
      <summary class="mobile-summary">Internet <i class="fas fa-chevron-down" aria-hidden="true"></i></summary>
      <div class="mobile-details-content">
        <a href="internet.html#planes" data-close-mobile-menu>Planes para el hogar</a>
        <a href="internet.html#planes" data-close-mobile-menu>Internet para empresas</a>
        <a href="internet.html#cobertura" data-close-mobile-menu>Prevalidar cobertura</a>
        <a href="internet.html#planes" data-close-mobile-menu>Comparar planes</a>
        <a href="internet.html#faqs" data-close-mobile-menu>Preguntas frecuentes</a>
      </div>
    </details>
    <details class="mobile-details">
      <summary class="mobile-summary">Soluciones <i class="fas fa-chevron-down" aria-hidden="true"></i></summary>
      <div class="mobile-details-content">
        <a href="seguridad-electronica.html" data-close-mobile-menu>Seguridad electrónica</a>
        <a href="redes-datos.html" data-close-mobile-menu>Redes y conectividad</a>
        <a href="energia-climatizacion.html" data-close-mobile-menu>Energía y climatización</a>
        <a href="equipos-oficina.html" data-close-mobile-menu>Equipos de oficina</a>
        <a href="mobiliario-suministros.html" data-close-mobile-menu>Mobiliario y suministros</a>
        <a href="infraestructura-remozamiento.html" data-close-mobile-menu>Infraestructura y remozamiento</a>
      </div>
    </details>
    <details class="mobile-details">
      <summary class="mobile-summary">Tienda <i class="fas fa-chevron-down" aria-hidden="true"></i></summary>
      <div class="mobile-details-content">
        <a href="catalogo.html?cat=equipos" data-close-mobile-menu>Computadoras y laptops</a>
        <a href="catalogo.html?cat=redes" data-close-mobile-menu>Redes y WiFi</a>
        <a href="catalogo.html?cat=seguridad" data-close-mobile-menu>Cámaras y seguridad</a>
        <a href="catalogo.html?cat=energia" data-close-mobile-menu>Energía y climatización</a>
        <a href="catalogo.html?cat=oficina" data-close-mobile-menu>Impresoras, oficina y mobiliario</a>
        <a href="catalogo.html" data-close-mobile-menu>Ver catálogo completo</a>
      </div>
    </details>
    <details class="mobile-details">
      <summary class="mobile-summary">Soporte <i class="fas fa-chevron-down" aria-hidden="true"></i></summary>
      <div class="mobile-details-content">
        <a href="soporte.html" data-close-mobile-menu>Soporte, errores y reclamaciones</a>
        <a href="soporte.html#sp-cases" data-close-mobile-menu>Consultar mis tickets</a>
        <a href="sugerencias.html" data-close-mobile-menu>💡 Buzón de sugerencias</a>
        <a href="https://wa.me/${waNum}" target="_blank" rel="noopener noreferrer" data-close-mobile-menu>WhatsApp de soporte</a>
        <a href="internet.html#faqs" data-close-mobile-menu>Preguntas frecuentes</a>
        <a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer" data-close-mobile-menu>Medir velocidad</a>
        <a href="login.html" data-close-mobile-menu>Área de clientes</a>
        <a href="login.html?redirect=internet.html" data-close-mobile-menu>Reportar avería</a>
        <a href="login.html?redirect=internet.html" data-close-mobile-menu>Ver factura y reportar pago</a>
      </div>
    </details>
    <a href="index.html#contacto" class="mobile-menu__quote" data-close-mobile-menu>Cotizar proyecto</a>
    <div class="mobile-menu__utility">
      <a href="corporativo.html" data-close-mobile-menu>Empresas</a>
      <a href="nosotros.html" data-close-mobile-menu>Nosotros</a>
      <a href="login.html" data-close-mobile-menu>Área de clientes</a>
      <a href="https://maps.app.goo.gl/mySNxSfamvRfFqZA9" target="_blank" rel="noopener noreferrer" data-close-mobile-menu>Ubicación</a>
    </div>
    <a href="https://wa.me/${waNum}" target="_blank" rel="noopener noreferrer" class="mobile-menu-wa-link" data-close-mobile-menu>
      <i class="fab fa-whatsapp" aria-hidden="true"></i> ${waNumFormatted}
    </a>
    <div class="navbar-auth-container mobile-auth-container"></div>`;

  const pathPart = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const filename = pathPart.endsWith('.html') ? pathPart : (pathPart ? pathPart + '.html' : 'index.html');
  const activeGroup = filename === 'internet.html' ? 'internet.html'
    : filename === 'catalogo.html' || filename === 'producto.html' || filename.startsWith('marca-') ? 'catalogo.html'
    : ['seguridad-electronica.html', 'redes-datos.html', 'energia-climatizacion.html', 'equipos-oficina.html', 'mobiliario-suministros.html', 'infraestructura-remozamiento.html', 'corporativo.html'].includes(filename) ? 'index.html#servicios'
    : filename === 'index.html' ? 'index.html' : '';

  if (activeGroup) {
    const safeActiveGroup = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
      ? CSS.escape(activeGroup)
      : String(activeGroup).replace(/["\\]/g, '');
    try {
      document.querySelectorAll(`.nav-menu > li > a[href="${safeActiveGroup}"], .mobile-menu > a[href="${safeActiveGroup}"]`).forEach((link) => {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      });
    } catch (_) {}
  }

  // Ensure navbar auth UI is rendered if auth session already initialized
  if (window.FutunetAuth && typeof window.FutunetAuth.renderNavbarAuth === 'function') {
    window.FutunetAuth.renderNavbarAuth();
  }

  // Enable clicking the navbar search icon to submit query or focus input
  const searchForm = document.getElementById('nav-search-compact');
  const searchIcon = searchForm?.querySelector('.nav-search-compact__icon');
  if (searchIcon && searchForm) {
    searchIcon.style.cursor = 'pointer';
    searchIcon.addEventListener('click', () => {
      const input = searchForm.querySelector('input[name="q"]') || searchForm.querySelector('input[type="search"]') || document.getElementById('search-navbar');
      if (input && input.value.trim()) {
        if (typeof searchForm.submit === 'function') {
          searchForm.submit();
        } else {
          window.location.href = 'catalogo.html?q=' + encodeURIComponent(input.value.trim());
        }
      } else if (input) {
        input.focus();
      }
    });
  }

  // Ensure Enter key on navbar search input submits cleanly on all page layouts
  const navSearchInput = document.getElementById('search-navbar');
  if (navSearchInput) {
    navSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = navSearchInput.value.trim();
        if (val) {
          const form = navSearchInput.closest('form');
          if (form && typeof form.submit === 'function') {
            return;
          }
          e.preventDefault();
          window.location.href = 'catalogo.html?q=' + encodeURIComponent(val);
        }
      }
    });
  }
}

/* =============================================================
   PROMO ANNOUNCEMENT BAR — Lógica Dinámica de Campaña Global
   ============================================================= */
function initAnnouncementBar() {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem('futunet_promo_bar_closed') === 'true') return;
  } catch (e) {}

  const header = document.querySelector('.site-header');
  if (!header) return;

  // Evitar duplicados
  if (document.getElementById('promo-announcement-bar')) return;

  const waNum = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || '18297411041';
  const now = new Date();
  const currentMonth = now.getMonth(); // 8 = Sep, 9 = Oct
  const currentPath = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';

  const q3End = new Date('2026-09-30T23:59:59');
  const msToQ3 = q3End.getTime() - now.getTime();
  const hoursToQ3 = Math.max(0, Math.floor(msToQ3 / (1000 * 60 * 60)));
  const daysToQ3 = Math.ceil(msToQ3 / (1000 * 60 * 60 * 24));

  let q3Message = 'Auditoría de Red GRATIS + 15% OFF en Infraestructura con';
  if (msToQ3 > 0) {
    if (hoursToQ3 <= 72) {
      q3Message = `¡Últimas ${hoursToQ3} horas para Cierre Q3! Auditoría GRATIS + 15% OFF con`;
    } else {
      q3Message = `Últimos ${daysToQ3} días para comprometer presupuesto TI: Auditoría GRATIS + 15% OFF con`;
    }
  }

  // Campaña activa dinámica según vertical o calendario comercial 2026
  let campaign = {
    badge: '🚀 BLACK MONTH TI 2026: APERTURA OFICIAL',
    message: '15% de Descuento en Fibra Óptica, Servidores y Respaldo TI con',
    coupon: 'BLACKTI2026',
    endDate: new Date('2026-11-07T23:59:59'),
    ctaText: 'Asegurar Stock VIP',
    waMsg: 'Hola Futunet, quiero aprovechar la apertura oficial de Black Month TI con el código BLACKTI2026.'
  };

  // Contextualización inteligente por página y calendario comercial semanal
  const week3End = new Date('2026-10-18T23:59:59');
  const isWeek3 = now >= new Date('2026-10-12T00:00:00') && now <= week3End;
  const week4End = new Date('2026-10-25T23:59:59');
  const isWeek4 = now >= new Date('2026-10-19T00:00:00') && now < new Date('2026-10-24T00:00:00');
  const week5End = new Date('2026-11-01T23:59:59');
  const isWeek5 = now >= new Date('2026-10-24T00:00:00') && now <= week5End;

  // Temporada Noviembre 2026 (Black Month TI & Black Friday)
  const novStart = new Date('2026-11-01T00:00:00');
  const novEnd = new Date('2026-11-30T23:59:59');
  const isNov = now >= novStart && now <= novEnd;
  const isWeek1Nov = now >= novStart && now <= new Date('2026-11-07T23:59:59');
  const isWeek2Nov = now >= new Date('2026-11-08T00:00:00') && now <= new Date('2026-11-14T23:59:59');
  const isWeek3Nov = now >= new Date('2026-11-15T00:00:00') && now <= new Date('2026-11-21T23:59:59');
  const isBlackFridayWeek = now >= new Date('2026-11-22T00:00:00') && now <= novEnd;

  if (currentPath.includes('gaming.html')) {
    campaign = {
      badge: isBlackFridayWeek ? '🎮 BLACK FRIDAY: ZONA GAMING PRO' : (isNov ? '🎮 BLACK MONTH: ZONA GAMING PRO' : '🎮 ZONA GAMING PRO'),
      message: '10% de Descuento en Periféricos Pro y Enlaces de Baja Latencia con',
      coupon: 'GAMING2026',
      endDate: new Date('2026-12-31T23:59:59'),
      ctaText: 'Ver Setup Gamer',
      waMsg: 'Hola Futunet, quiero cotizar equipos y conectividad gamer con el código GAMING2026.'
    };
  } else if (currentPath.includes('punto-de-venta.html')) {
    campaign = {
      badge: isBlackFridayWeek ? '🛒 BLACK FRIDAY: RETAIL TECH & POS' : (isNov ? '🛒 BLACK MONTH: RETAIL TECH & POS' : '🛒 RETAIL TECH & POS'),
      message: '12% de Descuento en Terminales Táctiles e Impresoras Térmicas con',
      coupon: 'POS2026',
      endDate: new Date('2026-12-31T23:59:59'),
      ctaText: 'Cotizar POS',
      waMsg: 'Hola Futunet, quiero cotizar un kit de Punto de Venta con el código POS2026.'
    };
  } else if (currentPath.includes('energia-climatizacion.html')) {
    const isPromoBF = isBlackFridayWeek;
    const isPromoNov = isNov || isWeek5;
    campaign = {
      badge: isPromoBF
        ? '💥 BLACK FRIDAY: ENERGÍA CRÍTICA & UPS'
        : (isNov ? '⚡ BLACK MONTH: ENERGÍA CRÍTICA & UPS ONLINE' : (isWeek5 ? '⚡ ENERGÍA CRÍTICA & PREVENTA BLACK TI' : '⚡ CONTINUIDAD & ENERGÍA CRÍTICA')),
      message: isPromoBF
        ? '18% de Descuento en UPS Online de Doble Conversión con'
        : '15% de Descuento en UPS Online de Doble Conversión e Inversores con',
      coupon: isPromoBF ? 'BLACKFRIDAY2026' : (isPromoNov ? 'BLACKTI2026' : 'CONTINUIDAD2026'),
      endDate: isNov ? novEnd : (isWeek5 ? week5End : (isWeek3 ? week3End : (isWeek4 ? week4End : new Date('2026-10-31T23:59:59')))),
      ctaText: 'Proteger Servidores',
      waMsg: isPromoBF
        ? 'Hola Futunet, quiero cotizar UPS Online de respaldo con oferta Black Friday y código BLACKFRIDAY2026.'
        : (isPromoNov
          ? 'Hola Futunet, quiero cotizar UPS Online de respaldo en Black TI con el código BLACKTI2026.'
          : 'Hola Futunet, quiero cotizar UPS Online de respaldo con el código CONTINUIDAD2026.')
    };
  } else if (currentPath.includes('redes-datos.html')) {
    const isPromoBF = isBlackFridayWeek;
    const isPromoNov = isNov || isWeek5;
    campaign = {
      badge: isPromoBF
        ? '💥 BLACK FRIDAY: REDES GIGABIT & FIBRA'
        : (isNov ? '🌐 BLACK MONTH: REDES GIGABIT & CABLEADO' : (isWeek5 ? '🌐 REDES GIGABIT & PREVENTA BLACK TI' : '🌐 ALTA DISPONIBILIDAD & FAILOVER B2B')),
      message: isPromoBF
        ? '18% de Descuento en Switches Administrables y Enlaces Redundantes con'
        : '15% de Descuento en Switches Administrables y Cableado Cat 6A con',
      coupon: isPromoBF ? 'BLACKFRIDAY2026' : (isPromoNov ? 'BLACKTI2026' : 'CONTINUIDAD2026'),
      endDate: isNov ? novEnd : (isWeek5 ? week5End : (isWeek3 ? week3End : (isWeek4 ? week4End : new Date('2026-10-31T23:59:59')))),
      ctaText: 'Auditar Red',
      waMsg: isPromoBF
        ? 'Hola Futunet, quiero cotizar switches y cableado estructurado en Black Friday con el código BLACKFRIDAY2026.'
        : (isPromoNov
          ? 'Hola Futunet, quiero cotizar switches y enlaces de fibra en Black TI con el código BLACKTI2026.'
          : 'Hola Futunet, quiero cotizar switches y redundancia de red con el código CONTINUIDAD2026.')
    };
  } else if (currentPath.includes('seguridad-electronica.html')) {
    const isPromoBF = isBlackFridayWeek;
    campaign = {
      badge: isPromoBF
        ? '💥 BLACK FRIDAY: SEGURIDAD CCTV 4K'
        : (isNov ? '🛡️ BLACK MONTH: SEGURIDAD CCTV & BIOMETRÍA' : (isWeek5 ? '🛡️ REMATE DE OCTUBRE: SEGURIDAD TOTAL' : '🛡️ PROTECCIÓN CORPORATIVA')),
      message: isPromoBF
        ? '18% de Descuento en CCTV IP 4K y Control Biométrico con'
        : '15% de Descuento en Seguridad CCTV IP y Biometría Facial con',
      coupon: isPromoBF ? 'BLACKFRIDAY2026' : (isNov ? 'BLACKTI2026' : 'SEGURIDAD2026'),
      endDate: isNov ? novEnd : new Date('2026-10-31T23:59:59'),
      ctaText: 'Cotizar Seguridad',
      waMsg: isPromoBF
        ? 'Hola Futunet, me interesa cotizar seguridad electrónica en Black Friday con el código BLACKFRIDAY2026.'
        : (isNov
          ? 'Hola Futunet, me interesa cotizar seguridad electrónica en Black Month con el código BLACKTI2026.'
          : 'Hola Futunet, me interesa cotizar seguridad electrónica con el código SEGURIDAD2026.')
    };
  } else if (currentPath.includes('equipos-oficina.html')) {
    const isPromoBF = isBlackFridayWeek;
    campaign = {
      badge: isPromoBF
        ? '💥 BLACK FRIDAY: CÓMPUTO & WORKSTATIONS'
        : (isNov ? '💻 BLACK MONTH: LAPTOPS, CÓMPUTO & OFICINA' : (isWeek5 ? '💻 PREVENTA BLACK TI: CÓMPUTO EMPRESARIAL' : '💻 PRODUCTIVIDAD & CÓMPUTO CORPORATIVO')),
      message: isPromoBF
        ? '15% de Descuento en Laptops Corporativas, Servidores y Monitores con'
        : '12% de Descuento en Laptops Corporativas, Impresión y Cómputo con',
      coupon: isPromoBF ? 'BLACKFRIDAY2026' : (isNov ? 'BLACKTI2026' : 'NOVIEMBRE2026'),
      endDate: isNov ? novEnd : new Date('2026-11-30T23:59:59'),
      ctaText: 'Cotizar Laptops',
      waMsg: isPromoBF
        ? 'Hola Futunet, quiero cotizar laptops corporativas en Black Friday con el código BLACKFRIDAY2026.'
        : 'Hola Futunet, quiero cotizar laptops y computadoras de oficina en Black Month con el código BLACKTI2026.'
    };
  } else if (currentPath.includes('mobiliario-suministros.html')) {
    const isPromoBF = isBlackFridayWeek;
    campaign = {
      badge: isPromoBF
        ? '💥 BLACK FRIDAY: MOBILIARIO EJECUTIVO & SILLAS'
        : (isNov ? '🏢 BLACK MONTH: MOBILIARIO Y ESPACIOS' : '🏢 MOBILIARIO CORPORATIVO & ERGONOMÍA'),
      message: '10% de Descuento en Escritorios Ejecutivos, Sillas y Archivos con',
      coupon: isPromoBF ? 'BLACKFRIDAY2026' : (isNov ? 'BLACKTI2026' : 'NOVIEMBRE2026'),
      endDate: isNov ? novEnd : new Date('2026-11-30T23:59:59'),
      ctaText: 'Cotizar Mobiliario',
      waMsg: 'Hola Futunet, quiero cotizar mobiliario ejecutivo y suministros con el código BLACKTI2026.'
    };
  } else if (currentPath.includes('corporativo.html')) {
    const isPromoBF = isBlackFridayWeek;
    campaign = {
      badge: isPromoBF
        ? '💥 BLACK FRIDAY TI: OFERTAS HISTÓRICAS B2B'
        : (isNov
          ? (isWeek1Nov ? '🚀 BLACK MONTH B2B: RESERVA PRIORITARIA' : '🏢 BLACK MONTH B2B: INFRAESTRUCTURA & TI')
          : (isWeek5
            ? '🔥 EARLY BIRD BLACK TI: PREVENTA CORPORATIVA'
            : (isWeek3 ? '⚡ SEMANA DE CONTINUIDAD: ZERO DOWNTIME' : (isWeek4 ? '🏢 SEMANA DE INFRAESTRUCTURA & REDES B2B' : '🏢 Q4: BLINDAJE & REDES B2B')))),
      message: isPromoBF
        ? '18% de Descuento Especial en Enlaces Dedicados, Racks y Respaldo con'
        : '15% de Descuento en Enlaces Dedicados, Servidores y Respaldo Crítico con',
      coupon: isPromoBF ? 'BLACKFRIDAY2026' : (isNov || isWeek5 ? 'BLACKTI2026' : (isWeek3 ? 'CONTINUIDAD2026' : 'SEGURIDAD2026')),
      endDate: isNov ? novEnd : (isWeek5 ? week5End : (isWeek3 ? week3End : (isWeek4 ? week4End : new Date('2026-10-31T23:59:59')))),
      ctaText: isNov || isWeek5 ? 'Asegurar Stock VIP' : 'Auditoría B2B',
      waMsg: isPromoBF
        ? 'Hola Futunet, me interesa cotizar soluciones corporativas en Black Friday con el código BLACKFRIDAY2026.'
        : (isNov
          ? 'Hola Futunet, me interesa la reserva prioritaria de infraestructura y enlaces Black TI con el código BLACKTI2026.'
          : (isWeek5
            ? 'Hola Futunet, me interesa la Preventa Early Bird Black TI corporativa con el código BLACKTI2026.'
            : (isWeek3
              ? 'Hola Futunet, me interesa solicitar una auditoría técnica gratuita de continuidad operativa y respaldo con el código CONTINUIDAD2026.'
              : 'Hola Futunet, me interesa solicitar una auditoría técnica gratuita y cotizar servicios corporativos con el código SEGURIDAD2026.')))
    };
  } else if (isBlackFridayWeek) {
    // Semana de Black Friday Global
    campaign = {
      badge: '💥 BLACK FRIDAY 2026: OFERTAS HISTÓRICAS',
      message: '18% de Descuento Especial en todo el Catálogo Tecnológico con',
      coupon: 'BLACKFRIDAY2026',
      endDate: novEnd,
      ctaText: 'Comprar con Descuento',
      waMsg: 'Hola Futunet, quiero aprovechar las ofertas de Black Friday con el código BLACKFRIDAY2026.'
    };
  } else if (isWeek1Nov) {
    // Semana 1 de Noviembre: Apertura Oficial Black Month TI 2026
    campaign = {
      badge: '🚀 BLACK MONTH TI 2026: APERTURA OFICIAL',
      message: '15% de Descuento en Fibra Óptica, Servidores y Respaldo TI con',
      coupon: 'BLACKTI2026',
      endDate: new Date('2026-11-07T23:59:59'),
      ctaText: 'Asegurar Stock VIP',
      waMsg: 'Hola Futunet, quiero aprovechar la apertura oficial de Black Month TI con el código BLACKTI2026.'
    };
  } else if (isNov) {
    // Noviembre general / Black Month
    campaign = {
      badge: '🔥 NOVIEMBRE: BLACK MONTH TECNOLÓGICO',
      message: '15% de Descuento en Infraestructura TI, Redes y Respaldo con',
      coupon: 'BLACKTI2026',
      endDate: novEnd,
      ctaText: 'Ver Ofertas Black TI',
      waMsg: 'Hola Futunet, quiero cotizar equipamiento en Black Month con el código BLACKTI2026.'
    };
  } else if (isWeek5) {
    // Semana 5 / Transición: Early Bird Black TI + Remate Ciberseguridad & Infraestructura
    campaign = {
      badge: '🔥 PREVENTA BLACK TI & REMATE OCTUBRE',
      message: '15% de Descuento en Fibra Óptica, Infraestructura TI y Respaldo con',
      coupon: 'BLACKTI2026',
      endDate: week5End,
      ctaText: 'Bloquear Precio VIP',
      waMsg: 'Hola Futunet, quiero aprovechar la Preventa Early Bird Black TI con el código BLACKTI2026.'
    };
  } else if (isWeek3) {
    // Semana 3 de Octubre: Continuidad Operativa & Zero Downtime Global
    campaign = {
      badge: '⚡ SEMANA DE CONTINUIDAD OPERATIVA',
      message: '15% de Descuento en UPS Online, Enlaces Redundantes y Seguridad con',
      coupon: 'CONTINUIDAD2026',
      endDate: week3End,
      ctaText: 'Auditoría Zero Downtime',
      waMsg: 'Hola Futunet, me interesa solicitar la auditoría gratuita de continuidad operativa y respaldo con el código CONTINUIDAD2026.'
    };
  } else if (isWeek4) {
    // Semana 4 de Octubre: Infraestructura, Redes Gigabit y Seguridad B2B
    campaign = {
      badge: '🏢 SEMANA DE INFRAESTRUCTURA & SEGURIDAD B2B',
      message: '15% de Descuento en Seguridad CCTV, Redes Gigabit y Servidores con',
      coupon: 'SEGURIDAD2026',
      endDate: week4End,
      ctaText: 'Auditoría B2B Gratis',
      waMsg: 'Hola Futunet, me interesa la auditoría técnica y cotizar infraestructura y seguridad con el código SEGURIDAD2026.'
    };
  } else if (currentMonth === 9) {
    // Octubre general: Campaña de Seguridad Corporativa Global
    campaign = {
      badge: '🛡️ OCTUBRE: SEGURIDAD CORPORATIVA',
      message: '15% de Descuento en Seguridad CCTV IP y Biometría Facial con',
      coupon: 'SEGURIDAD2026',
      endDate: new Date('2026-10-31T23:59:59'),
      ctaText: 'Cotizar Seguridad',
      waMsg: 'Hola Futunet, me interesa cotizar seguridad electrónica con el código SEGURIDAD2026.'
    };
  }

  const bar = document.createElement('div');
  bar.id = 'promo-announcement-bar';
  bar.className = 'promo-announcement-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Anuncio de promoción comercial');

  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(campaign.waMsg)}`;

  bar.innerHTML = `
    <div class="pab-container">
      <span class="pab-badge"><span class="pab-badge-pulse"></span> ${campaign.badge}</span>
      <span class="pab-message">${campaign.message}</span>
      <span class="pab-coupon" id="pab-coupon-btn" title="Clic para copiar código de descuento" role="button" tabindex="0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span class="coupon-text">${campaign.coupon}</span>
      </span>
      <span class="pab-countdown" id="pab-countdown" aria-live="polite">
        <i class="fas fa-clock"></i> <span id="pab-timer-text">Calculando...</span>
      </span>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="pab-cta">
        ${campaign.ctaText} <i class="fas fa-arrow-right" style="font-size:0.65rem;"></i>
      </a>
      <button type="button" class="pab-close" id="pab-close-btn" aria-label="Cerrar anuncio">&times;</button>
    </div>
  `;

  // Insertar al inicio del header antes de cualquier otro elemento
  header.insertBefore(bar, header.firstChild);

  // Copiado interactivo de cupón
  const couponBtn = document.getElementById('pab-coupon-btn');
  if (couponBtn) {
    const couponSpan = couponBtn.querySelector('.coupon-text');
    const originalText = campaign.coupon;
    const showCopiedState = () => {
      if (couponSpan) couponSpan.textContent = '¡Copiado! ✓';
      couponBtn.style.background = '#dcfce7';
      couponBtn.style.color = '#15803d';
      setTimeout(() => {
        if (couponSpan) couponSpan.textContent = originalText;
        couponBtn.style.background = '';
        couponBtn.style.color = '';
      }, 2000);
    };

    const copyWithFallback = (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopiedState).catch(() => {
          fallbackPromoCopy(text);
        });
      } else {
        fallbackPromoCopy(text);
      }
    };

    const fallbackPromoCopy = (text) => {
      try {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(temp);
        if (ok) showCopiedState();
      } catch (err) {}
    };

    couponBtn.addEventListener('click', () => {
      copyWithFallback(originalText);
    });
    couponBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        couponBtn.click();
      }
    });
  }

  // Cerrar barra
  const closeBtn = document.getElementById('pab-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      bar.classList.add('is-hidden');
      try {
        sessionStorage.setItem('futunet_promo_bar_closed', 'true');
      } catch (e) {}
    });
  }

  // Temporizador en vivo
  function updateTimer() {
    const timerText = document.getElementById('pab-timer-text');
    if (!timerText) return;
    const diff = campaign.endDate.getTime() - new Date().getTime();
    if (diff <= 0) {
      timerText.textContent = '¡Últimas horas!';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    timerText.textContent = `${days}d ${hours}h ${mins}m restantes`;
  }

  updateTimer();
  setInterval(updateTimer, 60000);
}

/* -------------------------------------------------------------
   7. RUNTIME SAFETY & RESILIENCE SHIELD (DevSecOps)
   Captura excepciones asíncronas no controladas y previene 
   bloqueos de la interfaz de usuario en producción.
   ------------------------------------------------------------- */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', function (event) {
    if (event && event.reason) {
      var reasonStr = String(event.reason.message || event.reason);
      if (
        reasonStr.includes('Failed to fetch') ||
        reasonStr.includes('NetworkError') ||
        reasonStr.includes('aborted')
      ) {
        if (typeof event.preventDefault === 'function') event.preventDefault();
      }
      console.warn('Unhandled promise rejection safely caught:', event.reason);
    }
  });
}



