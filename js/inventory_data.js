window.mockDatabase = [];
window.FutunetData = { products: [], readyPromise: null };
window.FutunetData.readyPromise = new Promise(async (resolve, reject) => {
  try {
    const db = window.FutunetFirebase.db;
    const snapshot = await db.collection('products').get();
    let list = [];
    snapshot.forEach(doc => {
      if (doc.data().isActive !== false) {
        list.push({ id: doc.id, ...doc.data() });
      }
    });

    if (typeof window.applyImageFixes === 'function') {
      window.applyImageFixes(list);
    }

    window.FutunetData.products = list;
    window.mockDatabase = list;
    resolve(list);
  } catch (error) {
    console.error('Error cargando base de datos:', error);
    window.FutunetData.products = [];
    window.mockDatabase = [];
    resolve([]);
  }
});
