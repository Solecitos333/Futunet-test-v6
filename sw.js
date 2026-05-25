const CACHE_NAME = 'futunet-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './catalogo.html',
  './producto.html',
  './mi-cuenta.html',
  './login.html',
  './manifest.json',
  './css/main.css',
  './css/navbar.css',
  './css/catalog.css',
  './css/sections.css',
  './css/auth.css',
  './css/producto.css',
  './img/logo.png',
  './img/logo-navbar.png',
  './img/placeholder.svg',
  './js/firebase-config.js',
  './js/auth.js',
  './js/cart.js',
  './js/main.js',
  './js/config.js',
  './js/inventory_data.js',
  './js/catalog.js',
  './js/producto.js'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell');
        return cache.addAll(ASSETS_TO_CACHE);
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
  // Skip cross-origin requests, POST requests, and firebase/firestore API calls
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('firebaseinstallations.googleapis.com') ||
    event.request.url.includes('identitytoolkit.googleapis.com')
  ) {
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
      }).catch(() => {
        // Fallback for offline catalog or image if network fails
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
          return caches.match('./img/placeholder.svg');
        }
      });
    })
  );
});
