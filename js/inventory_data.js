(function () {
  'use strict';

  const products = Array.isArray(window.mockDatabase) ? window.mockDatabase : [];
  window.mockDatabase = products;
  window.inventoryDataLoaded = true;

  function publishProducts(list, source) {
    products.splice(0, products.length, ...list);
    window.FutunetData.products = products;
    window.FutunetData.source = source;
    window.dispatchEvent(new CustomEvent('futunet:inventory-ready', {
      detail: { products, source }
    }));
    return products;
  }

  function getFirebaseServices() {
    const services = window.FutunetFirebase;
    return services && services.db ? services : null;
  }

  function waitForFirebase(timeoutMs = 5000) {
    const available = getFirebaseServices();
    if (available) return Promise.resolve(available);

    return new Promise((resolve) => {
      let settled = false;
      let intervalId;
      let timeoutId;

      const finish = (services) => {
        if (settled) return;
        settled = true;
        window.removeEventListener('futunet:firebase-ready', onReady);
        window.removeEventListener('futunet:firebase-error', onError);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        resolve(services);
      };

      const onReady = () => finish(getFirebaseServices());
      const onError = () => finish(null);

      window.addEventListener('futunet:firebase-ready', onReady, { once: true });
      window.addEventListener('futunet:firebase-error', onError, { once: true });
      intervalId = window.setInterval(() => {
        const services = getFirebaseServices();
        if (services) finish(services);
      }, 50);
      timeoutId = window.setTimeout(() => finish(null), timeoutMs);
    });
  }

  window.FutunetData = {
    products,
    source: 'loading',
    readyPromise: null
  };

  window.FutunetData.readyPromise = (async () => {
    const services = await waitForFirebase();
    if (!services) {
      console.warn('Firebase no estuvo disponible; se usará el inventario local de proveedores.');
      return publishProducts([], 'local-fallback');
    }

    try {
      const snapshot = await services.db.collection('products').get();
      const list = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive !== false) list.push({ id: doc.id, ...data });
      });

      if (typeof window.applyImageFixes === 'function') {
        window.applyImageFixes(list);
      }

      return publishProducts(list, 'firestore');
    } catch (error) {
      console.error('No se pudo cargar el catálogo de Firestore:', error);
      return publishProducts([], 'local-fallback');
    }
  })();
})();
