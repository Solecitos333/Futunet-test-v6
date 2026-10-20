const CACHE_NAME = 'futunet-cache-v47';

// Assets críticos que deben cachearse (verificados como existentes)
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './catalogo.html',
  './internet.html',
  './energia-climatizacion.html',
  './equipos-oficina.html',
  './infraestructura-remozamiento.html',
  './mobiliario-suministros.html',
  './redes-datos.html',
  './seguridad-electronica.html',
  './punto-de-venta.html',
  './nosotros.html',
  './manifest.json',
  './css/main.css',
  './css/navbar.css',
  './css/sections.css',
  './css/auth.css',
  './css/chatbot.css',
  './css/hero.css',
  './css/portal-rapido.css',
  './css/catalog.css',
  './css/energia-climatizacion.css',
  './css/equipos-oficina.css',
  './css/redes-datos.css',
  './css/seguridad-electronica.css',
  './css/punto-de-venta.css',
  './css/b2b-subpage-base.css',
  './css/nosotros.css',
  './css/service-polish.css',
  './css/internet.css',
  './css/internet-elite.css',
  './css/producto.css',
  './img/logo.webp',
  './img/logo-navbar.webp',
  './img/placeholder.svg',
  './js/main.js',
  './js/config.js',
  './js/brands-preview.js',
  './js/form.js',
  './js/cart.js',
  './js/chatbot.js',
  './js/layout-manager.js',
  './js/internet-portal.js',
  './js/internet-plans.js',
  './js/brand-page-loader.js',
  './js/catalog.js',
  './js/home_showcase.js',
  './js/promo-carousel.js',
  './js/category-showcase.js',
  './js/image_fixes.js',
  './js/inventory_data.js',
  './js/supplier_inventory.js',
  './js/service-page.js',
  './js/product_detail_shared.js',
  './js/product_detail_overrides.js',
  './js/producto.js'
];

// Assets opcionales (si fallan, no se rompe la instalación)
const OPTIONAL_ASSETS = [
  './producto.html',
  './soporte.html',
  './sugerencias.html',
  './mi-cuenta.html',
  './cotizacion.html',
  './gaming.html',
  './corporativo.html',
  './privacidad.html',
  './terminos.html',
  './css/suggestions.css',
  './css/gaming.css',
  './js/user-panel.js',
  './js/public-quote.js',
  './js/gaming.js',
  './js/suggestions.js',
  './js/backup_data.js',
  './js/chatbot-firebase.mjs',
  './css/support.css',
  './js/support-core.js',
  './js/support-service.js',
  './js/support-ui.js',
  './img/gaming/componentes/case-lian-li-o11-dynamic-evo.jpg',
  './img/gaming/componentes/case-msi-mag-pano-100r.jpg',
  './img/gaming/componentes/cooler-nzxt-kraken-elite-360.jpg',
  './img/gaming/componentes/cooler-tryx-panorama-360-argb.jpg',
  './img/gaming/componentes/cpu-amd-ryzen-7-7800x3d.jpg',
  './img/gaming/componentes/cpu-amd-ryzen-9-9950x.jpg',
  './img/gaming/componentes/motherboard-asus-tuf-x870e-plus-wifi7.jpg',
  './img/gaming/componentes/psu-msi-mag-a1000gs-pcie5.jpg',
  './img/gaming/componentes/ram-kingston-fury-beast-ddr5-64gb.jpg',
  './img/gaming/componentes/ssd-crucial-p310-1tb.jpg',
  './img/gaming/componentes/ssd-crucial-p310-2tb.jpg',
  './img/gaming/componentes/ssd-samsung-9100-pro-2tb.jpg',
  './img/productos/catalogo/panasonic-kxhdv230-ip-phone.webp',
  './img/productos/catalogo/juniper-srx300-security-gateway.webp',
  './img/productos/catalogo/siemens-sirius-contactor-3rt-25a.webp',
  './img/productos/catalogo/uniview-colorhunter-4k-poe-camera.webp',
  './img/productos/catalogo/netgear-gs308pp-switch-8p-poe.webp',
  './img/productos/catalogo/victron-smartsolar-mppt-100-30.webp',
  './img/productos/catalogo/ezviz-h8c-camara-ptz-exterior.webp',
  './img/productos/catalogo/logitech-meetup-videoconferencia-4k.webp',
  './img/productos/catalogo/zkteco-tl400b-cerradura-inteligente.webp',
  './img/productos/catalogo/ubiquiti-unifi-u6-pro-access-point.webp',
  './img/productos/catalogo/tesla-wall-connector-gen3.webp',
  './img/productos/catalogo/mitsubishi-cassette-inverter-36k.webp',
  './img/productos/catalogo/paradox-ip150-modulo-comunicador.webp',
  './img/productos/catalogo/linksys-velop-pro-6e-mesh.webp',
  './img/productos/catalogo/samsung-flip-pro-65-pantalla-interactiva.webp',
  './img/productos/catalogo/dell-precision-3660-tower-workstation.webp',
  './img/productos/catalogo/apc-schneider-metered-rack-pdu-120v.webp',
  './img/productos/catalogo/dahua-terminal-reconocimiento-facial-ia.webp',
  './img/productos/catalogo/lg-34wp500-monitor-ultrawide-34.webp',
  './img/productos/catalogo/mikrotik-hap-ax3-wifi6-router.webp',
  './img/productos/catalogo/cisco-business-cbs350-8p-poe-switch.webp',
  './img/productos/catalogo/apc-smart-ups-smt1500c-senoidal-puro.webp',
  './img/productos/catalogo/lenovo-thinkpad-e16-laptop-corporativa.webp',
  './img/productos/catalogo/tplink-omada-eap653-wifi6-ap.webp',
  './img/productos/catalogo/epson-ecotank-l5590-multifuncional.webp',
  './img/productos/catalogo/hikvision-acusense-4k-camara-ip.webp'
];

// Install Event — cachear assets críticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('[Service Worker] Caching App Shell');

        // Cachear críticos (fallo total si alguno falla)
        await cache.addAll(CRITICAL_ASSETS);

        // Cachear opcionales individualmente (sin romper la instalación)
        for (const asset of OPTIONAL_ASSETS) {
          try {
            await cache.add(asset);
          } catch (e) {
            console.warn('[Service Worker] Optional asset not cached:', asset, e.message);
          }
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/';
  const privatePaths = new Set([
    '/admin', '/admin.html',
    '/mi-cuenta', '/mi-cuenta.html',
    '/facturacion', '/facturacion.html',
    '/login', '/login.html'
  ]);
  const privateScripts = new Set([
    '/js/chatbot-settings.js',
    '/js/support-core.js',
    '/js/support-service.js',
    '/js/support-ui.js',
    '/js/auth.js',
    '/js/auth-guard.js',
    '/js/firebase-config.js',
    '/js/billing-core.js',
    '/js/facturacion.js',
    '/js/erp-extensions.js',
    '/js/billing-workflows.js',
    '/js/billing-events.js',
    '/js/admin-panel.js',
    '/js/admin-financing.js',
    '/js/user-panel.js',
    '/js/financing.js'
  ]);

  // Skip cross-origin requests, POST requests, and firebase/firestore API calls
  if (
    event.request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    privatePaths.has(normalizedPath) ||
    privateScripts.has(normalizedPath) ||
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('firebaseinstallations.googleapis.com') ||
    event.request.url.includes('identitytoolkit.googleapis.com') ||
    event.request.url.includes('admin-panel.js') ||
    // Excluir archivos de configuración de Firebase del caché por seguridad
    event.request.url.includes('firebase-config.js') ||
    event.request.url.includes('auth.js')
  ) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          return (await caches.match(event.request)) || caches.match('./offline.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return from cache, but fetch fresh in background for next time if it is a local asset
        if (event.request.url.startsWith(self.location.origin)) {
          fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
        }
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache new local dynamic assets
        if (event.request.url.startsWith(self.location.origin)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(async () => {
        if (event.request.destination === 'image' || event.request.url.match(/\.(png|jpe?g|webp|gif|svg)$/i)) {
          return (await caches.match('./img/placeholder.svg')) || Response.error();
        }
        return Response.error();
      });
    })
  );
});
