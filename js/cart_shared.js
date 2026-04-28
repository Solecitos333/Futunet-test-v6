(function () {
  const CART_STORAGE_KEY = 'futunetCatalogCart';
  const cartState = { items: {} };

  function loadCartState() {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.items) {
        cartState.items = parsed.items;
      }
    } catch (error) {
      console.warn('No se pudo cargar el carrito:', error);
    }
  }

  function saveCartState() {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (error) {
      console.warn('No se pudo guardar el carrito:', error);
    }
  }

  function getCartItemCount() {
    return Object.values(cartState.items).reduce((total, item) => total + (item.qty || 0), 0);
  }

  window.FutunetCart = {
    cartState,
    loadCartState,
    saveCartState,
    getCartItemCount,
    CART_STORAGE_KEY
  };
})();
