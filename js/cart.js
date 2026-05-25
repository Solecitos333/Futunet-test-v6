/**
 * Futunet Global Cart Module
 * Maneja el estado y UI del carrito de forma centralizada para evitar duplicación
 * entre catalog.js y producto.js.
 */
(function() {
  const CART_STORAGE_KEY = 'futunetCatalogCart';
  
  const cartState = {
    items: {}
  };
  
  let hasInitializedCartCount = false;
  let lastCartItemCount = 0;

  // Utilidades internas si no existen globalmente
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function parsePriceToNumber(priceString) {
    const normalized = String(priceString || '').replace(/[^0-9.-]+/g, '');
    const value = parseFloat(normalized);
    return Number.isFinite(value) ? value : 0;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatCartQuantity(count) {
    return `${count} artículo${count !== 1 ? 's' : ''}`;
  }

  // Permite obtener el producto independientemente de si estamos en catalog.js o producto.js
  function findProduct(productId) {
    if (typeof mockDatabase !== 'undefined') {
      return mockDatabase.find(p => p.id === productId);
    }
    if (window.FutunetProductDetail) {
      return window.FutunetProductDetail.getCatalogData().find(p => p.id === productId);
    }
    return null;
  }

  function getCartFabElements() {
    return {
      fab: document.getElementById('cart-fab'),
      badge: document.getElementById('cart-count'),
      label: document.getElementById('cart-fab-label'),
      labelCount: document.getElementById('cart-fab-label-count'),
      labelCopy: document.getElementById('cart-fab-label-copy'),
      linkCount: document.getElementById('product-cart-link-count')
    };
  }

  function pulseCartFab(mode = 'add') {
    const { fab } = getCartFabElements();
    if (!fab) return;
    fab.classList.remove('cart-fab--pulse', 'cart-fab--settle');
    void fab.offsetWidth;
    fab.classList.add(mode === 'add' ? 'cart-fab--pulse' : 'cart-fab--settle');
  }

  function loadCartState() {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.items) {
          cartState.items = parsed.items;
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar el carrito:', error);
    }
    updateCartCount();
  }

  function saveCartState() {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      
      const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
      if (user && window.FutunetFirebase && window.FutunetFirebase.db) {
        const db = window.FutunetFirebase.db;
        db.collection('carts').doc(user.uid).set({
          items: cartState.items,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function(err) {
          console.warn('Error al guardar carrito en Firestore:', err);
        });
      }
    } catch (error) {
      console.warn('No se pudo guardar el carrito:', error);
    }
  }

  async function syncCartToFirestore(user) {
    if (!user || !window.FutunetFirebase || !window.FutunetFirebase.db) return;
    try {
      const db = window.FutunetFirebase.db;
      const docRef = db.collection('carts').doc(user.uid);
      const doc = await docRef.get();
      if (doc.exists) {
        const dbCart = doc.data();
        if (dbCart && dbCart.items) {
          let merged = { ...cartState.items };
          for (const [id, value] of Object.entries(dbCart.items)) {
            if (merged[id]) {
              merged[id].qty = Math.max(merged[id].qty, value.qty);
            } else {
              merged[id] = { qty: value.qty };
            }
          }
          cartState.items = merged;
          window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
          updateCartCount();
          renderCartDrawer();
        }
      }
      
      await docRef.set({
        items: cartState.items,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) {
      console.warn('Error al sincronizar el carrito con Firestore:', e);
    }
  }

  function getCartItemCount() {
    return Object.values(cartState.items).reduce((total, item) => total + (item.qty || 0), 0);
  }

  function getCartItems() {
    return Object.keys(cartState.items).map((id) => {
      const product = findProduct(id);
      return product ? { ...product, qty: cartState.items[id].qty } : null;
    }).filter(Boolean);
  }

  function updateCartCount() {
    const count = getCartItemCount();
    const { fab, label, labelCount, labelCopy, linkCount } = getCartFabElements();
    
    // Updates global count badges
    const countEls = document.querySelectorAll('#cart-count, .cart-fab__count');
    countEls.forEach(el => {
      el.textContent = count;
      el.hidden = count === 0;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    if (labelCount) labelCount.textContent = count;
    if (labelCopy) labelCopy.textContent = count === 1 ? 'artículo' : 'artículos';
    if (label) {
      label.hidden = count === 0;
      label.setAttribute('aria-hidden', count === 0 ? 'true' : 'false');
    }
    if (linkCount) linkCount.textContent = count; // Used in producto.html

    if (fab) {
      fab.classList.toggle('has-items', count > 0);
      fab.classList.toggle('is-empty', count === 0);
      fab.setAttribute(
        'aria-label',
        count > 0 ? `Abrir carrito de compra, ${formatCartQuantity(count)}` : 'Abrir carrito de compra'
      );
    }

    if (hasInitializedCartCount && count !== lastCartItemCount) {
      pulseCartFab(count > lastCartItemCount ? 'add' : 'remove');
    }
    lastCartItemCount = count;
    hasInitializedCartCount = true;
  }

  function addToCart(productId, qty = 1) {
    const product = findProduct(productId);
    if (!product) return;
    const currentQty = cartState.items[productId]?.qty || 0;
    cartState.items[productId] = { qty: currentQty + qty };
    saveCartState();
    updateCartCount();
    renderCartDrawer();
    
    // Si estamos en la página del catálogo, actualizamos los botones
    if (typeof window.updateInlineCartButtons === 'function') {
      window.updateInlineCartButtons();
    }
  }

  function removeFromCart(productId) {
    if (!cartState.items[productId]) return;
    delete cartState.items[productId];
    saveCartState();
    updateCartCount();
    renderCartDrawer();
    
    if (typeof window.updateInlineCartButtons === 'function') {
      window.updateInlineCartButtons();
    }
  }

  function changeCartQuantity(productId, delta) {
    const current = cartState.items[productId]?.qty || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) {
      removeFromCart(productId);
      return;
    }
    cartState.items[productId].qty = next;
    saveCartState();
    updateCartCount();
    renderCartDrawer();
    
    if (typeof window.updateInlineCartButtons === 'function') {
      window.updateInlineCartButtons();
    }
  }

  // Funciones de UI del Drawer
  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    const fab = document.getElementById('cart-fab');
    renderCartDrawer();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (fab) {
      fab.classList.add('is-active');
      fab.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    const fab = document.getElementById('cart-fab');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (fab) {
      fab.classList.remove('is-active');
      fab.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  function toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    return drawer.classList.contains('is-open') ? closeCartDrawer() : openCartDrawer();
  }

  function buildCheckoutMessage(items) {
    const lines = ['Hola Futunet, quiero solicitar este carrito:'];
    let total = 0;

    items.forEach((product, index) => {
      const qty = cartState.items[product.id]?.qty || 0;
      const unitPrice = parsePriceToNumber(product.price);
      const lineTotal = unitPrice * qty;
      total += lineTotal;
      lines.push(`${index + 1}. ${product.title}`);
      lines.push(`   Cantidad: ${qty}`);
      lines.push(`   Precio ref.: ${product.price}`);
    });

    if (total > 0) {
      lines.push('');
      lines.push(`Total referencial: ${formatCurrency(total)}`);
    }

    lines.push('');
    lines.push('Quedo atento a disponibilidad y forma de entrega.');
    return lines.join('\n');
  }

  function checkoutCart() {
    const items = getCartItems();
    if (!items.length) return;
    const message = buildCheckoutMessage(items);
    const phone = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }

  function renderCartDrawer() {
    const list = document.getElementById('cart-items-list');
    const summary = document.getElementById('cart-summary-count');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (!list || !summary || !checkoutBtn) return;

    const items = getCartItems();
    list.innerHTML = '';

    if (items.length === 0) {
      list.innerHTML = `<div class="cart-empty-state"><p>Aún no tienes productos en el carrito.</p><small>Agrega productos usando el carrito desde las tarjetas.</small></div>`;
      summary.textContent = '0 artículos';
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Agregar productos primero';
    } else {
      items.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'cart-item';
        const qty = cartState.items[product.id]?.qty || 0;
        card.innerHTML = `
          <div class="cart-item__image"><img src="${escapeHTML(product.img)}" alt="${escapeHTML(product.title)}" loading="lazy" onerror="this.src='img/placeholder.svg'" /></div>
          <div class="cart-item__info">
            <div class="cart-item__title">${escapeHTML(product.title)}</div>
            <div class="cart-item__meta">${escapeHTML(product.brand)} · ${escapeHTML(product.category)}</div>
            <div class="cart-item__qty">
              <button type="button" class="cart-qty-btn" data-cart-change="-1" data-product-id="${escapeHTML(product.id)}" aria-label="Disminuir cantidad">-</button>
              <span>${qty}</span>
              <button type="button" class="cart-qty-btn" data-cart-change="1" data-product-id="${escapeHTML(product.id)}" aria-label="Aumentar cantidad">+</button>
            </div>
            <div class="cart-item__meta">Precio: ${escapeHTML(product.price)}</div>
          </div>
          <button type="button" class="cart-item__remove" data-cart-remove="${escapeHTML(product.id)}" aria-label="Eliminar del carrito">Eliminar</button>
        `;
        list.appendChild(card);
      });
      
      const totalCount = items.reduce((sum, product) => sum + (cartState.items[product.id]?.qty || 0), 0);
      const totalValue = items.reduce((sum, product) => {
        const qty = cartState.items[product.id]?.qty || 0;
        return sum + parsePriceToNumber(product.price) * qty;
      }, 0);
      
      summary.textContent = `${formatCartQuantity(totalCount)} · Total ${formatCurrency(totalValue)}`;
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i data-lucide="credit-card"></i> Solicitar carrito por WhatsApp';
    }
    
    if (window.lucide) window.lucide.createIcons();
  }

  function bindCartUI() {
    loadCartState();
    
    // Bind global listeners
    const cartFab = document.getElementById('cart-fab');
    const cartLink = document.getElementById('product-cart-link'); // from producto.html
    const drawer = document.getElementById('cart-drawer');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    if (cartFab) cartFab.addEventListener('click', toggleCartDrawer);
    if (cartLink) cartLink.addEventListener('click', toggleCartDrawer);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutCart);

    if (drawer) {
      drawer.addEventListener('click', (event) => {
        if (event.target.closest('[data-close-cart]')) {
          closeCartDrawer();
          return;
        }

        const changeBtn = event.target.closest('[data-cart-change]');
        if (changeBtn) {
          changeCartQuantity(changeBtn.dataset.productId, Number(changeBtn.dataset.cartChange) || 0);
          return;
        }

        const removeBtn = event.target.closest('[data-cart-remove]');
        if (removeBtn) {
          removeFromCart(removeBtn.dataset.cartRemove);
        }
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeCartDrawer();
    });
  }

  // Exponer al scope global
  window.FutunetCart = {
    state: cartState,
    load: loadCartState,
    add: addToCart,
    remove: removeFromCart,
    changeQty: changeCartQuantity,
    toggleDrawer: toggleCartDrawer,
    openDrawer: openCartDrawer,
    closeDrawer: closeCartDrawer,
    bindUI: bindCartUI,
    getItemQty: (id) => cartState.items[id]?.qty || 0
  };

  // Inicialización automática
  document.addEventListener('DOMContentLoaded', bindCartUI);

  // Sincronizar carrito cuando la autenticación esté lista o cambie
  window.addEventListener('futunet-auth-ready', async function(event) {
    const user = event.detail.user;
    if (user) {
      await syncCartToFirestore(user);
    }
  });
})();
