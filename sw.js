const CACHE_NAME = 'futunet-cache-v8';

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
  './css/internet.css',
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
  './js/auth-guard.js'
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

  // Skip cross-origin requests, POST requests, and firebase/firestore API calls
  if (
    event.request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    privatePaths.has(normalizedPath) ||
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('firebaseinstallations.googleapis.com') ||
    event.request.url.includes('identitytoolkit.googleapis.com') ||
    event.request.url.includes('backup_data.js') ||
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
      }).catch(() => Response.error());
    })
  );
});
