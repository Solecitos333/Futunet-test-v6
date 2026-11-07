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

  let activeCoupon = null;
  const COUPONS = {
    BACKTOSCHOOL2026: {
      code: 'BACKTOSCHOOL2026',
      discount: 0.10,
      departments: ['equipos', 'redes', 'oficina'],
      validFrom: '2026-07-26',
      validUntil: '2026-08-31',
      description: '10% de descuento en Laptops, Impresión y Conectividad Escolar/Universitaria'
    },
    RESTAURACION2026: {
      code: 'RESTAURACION2026',
      discount: 0.10,
      departments: ['equipos', 'redes', 'oficina', 'energia', 'seguridad'],
      validFrom: '2026-08-15',
      validUntil: '2026-08-23',
      description: '10% de descuento Especial Semana de la Restauración Dominicana'
    },
    PAPASMART2026: {
      code: 'PAPASMART2026',
      discount: 0.10,
      departments: ['equipos', 'redes'],
      validFrom: '2026-07-01',
      validUntil: '2026-07-31',
      description: '10% de descuento en Cómputo y Conectividad (Julio 2026)'
    },
    RESPALDO2026: {
      code: 'RESPALDO2026',
      discount: 0.10,
      departments: ['energia'],
      validFrom: '2026-06-01',
      validUntil: '2026-09-30',
      description: '10% de descuento en Energía y Respaldo Ciclónico'
    },
    INFRA2026: {
      code: 'INFRA2026',
      discount: 0.15,
      departments: ['redes', 'seguridad', 'energia', 'equipos', 'oficina'],
      validFrom: '2026-09-01',
      validUntil: '2026-09-30',
      description: '15% de descuento en Redes, Infraestructura y Seguridad (Septiembre 2026)'
    },
    SEGURIDAD2026: {
      code: 'SEGURIDAD2026',
      discount: 0.15,
      departments: ['seguridad', 'redes', 'equipos'],
      validFrom: '2026-09-27',
      validUntil: '2026-11-30',
      description: '15% de descuento en Seguridad Electrónica, CCTV y Control de Acceso (Octubre / Noviembre 2026)'
    },
    GAMING2026: {
      code: 'GAMING2026',
      discount: 0.10,
      departments: ['gaming', 'equipos', 'redes'],
      validFrom: '2026-09-01',
      validUntil: '2026-12-31',
      description: '10% de descuento en Zona Gaming, Periféricos y Routers de Baja Latencia'
    },
    POS2026: {
      code: 'POS2026',
      discount: 0.12,
      departments: ['equipos', 'oficina', 'redes'],
      validFrom: '2026-09-01',
      validUntil: '2026-12-31',
      description: '12% de descuento en Sistemas de Punto de Venta (POS) y Facturación Comercial'
    },
    OCTUBRE2026: {
      code: 'OCTUBRE2026',
      discount: 0.10,
      departments: ['equipos', 'redes', 'oficina', 'energia', 'seguridad', 'gaming', 'infra'],
      validFrom: '2026-10-01',
      validUntil: '2026-10-31',
      description: '10% de descuento en Soluciones Tecnológicas y Equipamiento (Octubre 2026)'
    },
    CONTINUIDAD2026: {
      code: 'CONTINUIDAD2026',
      discount: 0.15,
      departments: ['energia', 'redes', 'seguridad', 'equipos'],
      validFrom: '2026-10-12',
      validUntil: '2026-11-30',
      description: '15% de descuento en Continuidad Operativa, Respaldo Energético y Enlaces Redundantes (Octubre / Noviembre 2026)'
    },
    BLACKTI2026: {
      code: 'BLACKTI2026',
      discount: 0.15,
      departments: ['energia', 'redes', 'seguridad', 'equipos', 'oficina', 'gaming', 'infra'],
      validFrom: '2026-10-24',
      validUntil: '2026-11-30',
      description: '15% de descuento en Black Month TI 2026 (Infraestructura, Fibra Óptica, Servidores y Respaldo)'
    },
    EARLYBIRD2026: {
      code: 'EARLYBIRD2026',
      discount: 0.12,
      departments: ['equipos', 'oficina', 'redes', 'gaming', 'energia'],
      validFrom: '2026-10-24',
      validUntil: '2026-11-15',
      description: '12% de descuento en Preventa Exclusiva Q4 y Equipamiento Tecnológico'
    },
    NOVIEMBRE2026: {
      code: 'NOVIEMBRE2026',
      discount: 0.10,
      departments: ['equipos', 'redes', 'oficina', 'energia', 'seguridad', 'gaming', 'infra'],
      validFrom: '2026-11-01',
      validUntil: '2026-11-30',
      description: '10% de descuento en Soluciones Empresariales y Tecnología (Noviembre 2026)'
    },
    BLACKFRIDAY2026: {
      code: 'BLACKFRIDAY2026',
      discount: 0.18,
      departments: ['equipos', 'redes', 'oficina', 'energia', 'seguridad', 'gaming', 'infra'],
      validFrom: '2026-11-15',
      validUntil: '2026-11-30',
      description: '18% de descuento Especial Black Friday TI 2026 en Catálogo Completo'
    },
    CYBERTI2026: {
      code: 'CYBERTI2026',
      discount: 0.15,
      departments: ['equipos', 'redes', 'oficina', 'energia', 'seguridad', 'gaming', 'infra'],
      validFrom: '2026-11-25',
      validUntil: '2026-12-05',
      description: '15% de descuento Especial Cyber Week TI 2026 en Catálogo Completo'
    }
  };

  // Utilidades internas si no existen globalmente
  function escapeHTML(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parsePriceToNumber(priceString) {
    const normalized = String(priceString || '').replace(/[^0-9.-]+/g, '');
    const value = parseFloat(normalized);
    return Number.isFinite(value) ? value : 0;
  }

  function formatCurrency(value) {
    const num = Number(value);
    const safeNum = Number.isFinite(num) ? num : 0;
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(safeNum);
  }

  function formatCartQuantity(count) {
    return `${count} artículo${count !== 1 ? 's' : ''}`;
  }

  function safeOpenWhatsApp(url) {
    if (typeof window !== 'undefined' && typeof window.safeOpenWhatsApp === 'function') {
      return window.safeOpenWhatsApp(url);
    }
    if (!url) return;
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { if (link.parentNode) link.parentNode.removeChild(link); }, 200);
    } catch (e) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // Permite obtener el producto independientemente de si estamos en catalog.js o producto.js
  function findProduct(productId) {
    if (productId === 'custom_office_bundle') {
      try {
        const saved = window.localStorage.getItem('futunetCustomOfficeBundle');
        if (saved) {
          const parsedBundle = JSON.parse(saved);
          if (parsedBundle && typeof parsedBundle === 'object' && !parsedBundle.department) {
            parsedBundle.department = 'oficina';
          }
          return parsedBundle;
        }
      } catch (e) {
        console.warn('Error reading custom bundle:', e);
      }
      return {
        id: 'custom_office_bundle',
        title: 'Configuración Personalizada de Oficina',
        department: 'oficina',
        category: 'Equipos de Oficina',
        brand: 'FUTUNET B2B',
        price: 'RD$ 0',
        img: 'images/oficina/sim_office_pro.webp',
        description: 'Combo configurado a medida en el Estimador Tecnológico.',
        specs: []
      };
    }
    if (typeof productId === 'object' && productId !== null && productId.id) {
      return productId;
    }
    if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
      const found = mockDatabase.find(p => p && p.id === productId);
      if (found) return found;
    }
    if (typeof window !== 'undefined' && Array.isArray(window.mockDatabase)) {
      const found = window.mockDatabase.find(p => p && p.id === productId);
      if (found) return found;
    }
    if (typeof window !== 'undefined' && Array.isArray(window.backupDatabase)) {
      const found = window.backupDatabase.find(p => p && p.id === productId);
      if (found) return found;
    }
    if (window.FutunetProductDetail && typeof window.FutunetProductDetail.getCatalogData === 'function') {
      const found = window.FutunetProductDetail.getCatalogData().find(p => p && p.id === productId);
      if (found) return found;
    }
    if (window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      const found = window.supplierInventory.getMergedCatalog().find(p => p && p.id === productId);
      if (found) return found;
    }
    if (typeof window !== 'undefined' && window.FutunetData && Array.isArray(window.FutunetData.products)) {
      const found = window.FutunetData.products.find(p => p && p.id === productId);
      if (found) return found;
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
        if (parsed && typeof parsed === 'object' && parsed.items && typeof parsed.items === 'object') {
          const cleanItems = {};
          Object.keys(parsed.items).forEach(id => {
            const raw = parsed.items[id];
            const q = parseInt(typeof raw === 'object' && raw ? raw.qty : raw, 10);
            if (!isNaN(q) && q > 0) {
              cleanItems[id] = { qty: q };
            }
          });
          cartState.items = cleanItems;
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
        const nowTs = (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
          ? firebase.firestore.FieldValue.serverTimestamp()
          : new Date();
        db.collection('carts').doc(user.uid).set({
          items: cartState.items,
          updatedAt: nowTs
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
            const rawVal = typeof value === 'object' && value !== null ? value.qty : value;
            const parsedVal = parseInt(rawVal, 10);
            if (!isNaN(parsedVal) && parsedVal > 0) {
              if (merged[id]) {
                const currentQty = parseInt(merged[id].qty, 10) || 1;
                merged[id].qty = Math.max(currentQty, parsedVal);
              } else {
                merged[id] = { qty: parsedVal };
              }
            }
          }
          cartState.items = merged;
          window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
          updateCartCount();
          renderCartDrawer();
        }
      }
      
      const nowTs = (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue)
        ? firebase.firestore.FieldValue.serverTimestamp()
        : new Date();
      await docRef.set({
        items: cartState.items,
        updatedAt: nowTs
      });
    } catch (e) {
      console.warn('Error al sincronizar el carrito con Firestore:', e);
    }
  }

  function getCartItemCount() {
    return Object.values(cartState.items).reduce((total, item) => {
      const q = parseInt(typeof item === 'object' && item ? item.qty : item, 10);
      return total + (!isNaN(q) && q > 0 ? q : 0);
    }, 0);
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
    const currentQty = parseInt(cartState.items[productId]?.qty, 10) || 0;
    const parsedQty = parseInt(qty, 10);
    const safeQty = (!isNaN(parsedQty) && parsedQty > 0) ? parsedQty : 1;
    cartState.items[productId] = { qty: Math.min(currentQty + safeQty, 999) };
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
    const current = parseInt(cartState.items[productId]?.qty, 10) || 0;
    const parsedDelta = parseInt(delta, 10) || 0;
    const next = Math.min(999, Math.max(0, current + parsedDelta));
    if (next === 0) {
      removeFromCart(productId);
      return;
    }
    cartState.items[productId] = { qty: next };
    saveCartState();
    updateCartCount();
    renderCartDrawer();
    
    if (typeof window.updateInlineCartButtons === 'function') {
      window.updateInlineCartButtons();
    }
  }

  // Funciones de UI del Drawer
  let cartDrawerCleanup = null;
  let cartDrawerPreviousActiveElement = null;

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
    
    // Focus Trap
    cartDrawerPreviousActiveElement = document.activeElement;
    if (cartDrawerCleanup) cartDrawerCleanup();
    if (window.FutunetFocusTrap) {
      cartDrawerCleanup = window.FutunetFocusTrap(drawer, closeCartDrawer);
    }
    
    setTimeout(() => {
      const focusables = drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length > 0) focusables[0].focus();
    }, 100);
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
    
    if (cartDrawerCleanup) {
      cartDrawerCleanup();
      cartDrawerCleanup = null;
    }
    if (cartDrawerPreviousActiveElement && typeof cartDrawerPreviousActiveElement.focus === 'function') {
      cartDrawerPreviousActiveElement.focus();
      cartDrawerPreviousActiveElement = null;
    }
  }

  function toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    return drawer.classList.contains('is-open') ? closeCartDrawer() : openCartDrawer();
  }

  function buildCheckoutMessage(items, serverSummary = null) {
    const lines = ['Hola Futunet, quiero solicitar este carrito:'];
    const chkName = document.getElementById('chk-name')?.value?.trim();
    const chkPhone = document.getElementById('chk-phone')?.value?.trim();
    const chkDocType = document.getElementById('chk-document-type')?.value || 'cedula';
    const chkDocNum = document.getElementById('chk-document-number')?.value?.trim();
    const chkAddress = document.getElementById('chk-address')?.value?.trim();

    if (chkName) lines.push(`👤 Cliente: ${chkName}`);
    if (chkDocNum) lines.push(`📄 ${chkDocType === 'passport' ? 'Pasaporte' : 'Cédula'}: ${chkDocNum}`);
    if (chkPhone) lines.push(`📞 Teléfono: ${chkPhone}`);
    if (chkAddress) lines.push(`📍 Dirección: ${chkAddress}`);
    lines.push('');
    lines.push('📦 Detalle del pedido:');

    let total = 0;
    let totalLease = 0;
    let discountAmount = 0;

    items.forEach((product, index) => {
      const qty = cartState.items[product.id]?.qty || 0;
      const unitPrice = parsePriceToNumber(product.price);
      const lineTotal = unitPrice * qty;
      const isLease = String(product.price).includes('/ mes');
      
      if (isLease) {
        totalLease += lineTotal;
      } else {
        total += lineTotal;
      }
      
      lines.push(`${index + 1}. ${product.title}`);
      lines.push(`   Cantidad: ${qty}`);
      lines.push(`   Precio ref.: ${product.price}`);
      if (product.id === 'custom_office_bundle' && product.description) {
        lines.push(`   Detalle:\n${product.description.split('\n').map(l => '     ' + l).join('\n')}`);
      }
    });

    if (activeCoupon) {
      items.forEach(product => {
        const qty = cartState.items[product.id]?.qty || 0;
        const unitPrice = parsePriceToNumber(product.price);
        const isLease = String(product.price).includes('/ mes');
        if (!isLease && Array.isArray(activeCoupon.departments) && activeCoupon.departments.includes(product.department)) {
          discountAmount += (unitPrice * qty) * activeCoupon.discount;
        }
      });
    }

    if (serverSummary) {
      total = Number(serverSummary.subtotal ?? total);
      totalLease = Number(serverSummary.lease_total ?? totalLease);
      discountAmount = Number(serverSummary.discount_amount ?? 0);
    }

    const appliedCouponCode = serverSummary?.coupon_code || activeCoupon?.code || '';

    if (total > 0 || totalLease > 0) {
      lines.push('');
      if (total > 0) {
        if (discountAmount > 0) {
          lines.push(`Subtotal Compra: ${formatCurrency(total)}`);
          lines.push(`Descuento${appliedCouponCode ? ` (Cupón ${appliedCouponCode})` : ''}: -${formatCurrency(discountAmount)}`);
          lines.push(`Total Compra (CapEx): ${formatCurrency(serverSummary?.total ?? (total - discountAmount))}`);
        } else {
          lines.push(`Total Compra (CapEx): ${formatCurrency(total)}`);
        }
      }
      if (totalLease > 0) {
        lines.push(`Total Leasing Mensual (OpEx): ${formatCurrency(totalLease)} / mes`);
      }
    }

    lines.push('');
    lines.push('Quedo atento a disponibilidad y forma de entrega.');
    return lines.join('\n');
  }

  var selectedCheckoutFile = null;
  var checkoutFinancingApproved = false;

  function showCartToast(msg, type = 'info') {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cart-toast cart-toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
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
    toast.style.zIndex = '99999';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    toast.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
    toast.style.backgroundColor = type === 'success' ? '#0e8a5f' : type === 'error' ? '#c0392b' : '#0A70A2';
    toast.style.color = '#ffffff';

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function updateDocumentFieldUI() {
    const docTypeSelect = document.getElementById('chk-document-type');
    const docLabel = document.querySelector('label[for="chk-document-number"]');
    const docInput = document.getElementById('chk-document-number');
    const hintEl = document.getElementById('chk-document-hint');
    if (!docTypeSelect || !docInput) return;

    const val = docTypeSelect.value;
    if (val === 'passport') {
      if (docLabel) docLabel.textContent = 'Número de Pasaporte *';
      docInput.placeholder = 'Ej. RD1234567 o A12345678';
      docInput.maxLength = 20;
      if (hintEl) hintEl.textContent = 'Requerido para facturación e identificación de clientes extranjeros';
    } else {
      if (docLabel) docLabel.textContent = 'Número de Cédula Dominicana *';
      docInput.placeholder = 'Ej. 001-1234567-8';
      docInput.maxLength = 15;
      if (hintEl) hintEl.textContent = '11 dígitos requeridos para facturación legal de tu primera compra';
    }
  }

  let currentStep = 1;

  function updateWizardUI() {
    updateDocumentFieldUI();
    document.querySelectorAll('#cart-checkout-form .checkout-step').forEach((el, index) => {
      el.style.display = (index + 1 === currentStep) ? 'block' : 'none';
    });

    document.querySelectorAll('.wizard-step-node').forEach((node) => {
      const stepVal = parseInt(node.dataset.step, 10);
      node.classList.toggle('active', stepVal === currentStep);
      node.classList.toggle('completed', stepVal < currentStep);
    });

    const progressFill = document.getElementById('wizard-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${((currentStep - 1) / 2) * 100}%`;
    }

    const btnPrev = document.getElementById('btn-prev-checkout');
    const btnNext = document.getElementById('btn-next-checkout');
    const btnSubmit = document.getElementById('btn-submit-checkout');

    if (currentStep === 1) {
      btnPrev.textContent = 'Cancelar';
      btnNext.style.display = 'inline-flex';
      btnSubmit.style.display = 'none';
    } else if (currentStep === 2) {
      btnPrev.textContent = 'Atrás';
      btnNext.style.display = 'inline-flex';
      btnSubmit.style.display = 'none';
      
      const paymentMethod = document.querySelector('input[name="chk-payment-method"]:checked')?.value;
      const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
      if ((paymentMethod === 'bank_transfer' && !user) || (paymentMethod === 'financing' && (!user || !checkoutFinancingApproved))) {
        btnNext.disabled = true;
      } else {
        btnNext.disabled = false;
      }
    } else if (currentStep === 3) {
      btnPrev.textContent = 'Atrás';
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'inline-flex';
      renderStep3Summary();
    }
  }

  function renderStep3Summary() {
    const summaryCard = document.getElementById('checkout-step3-summary-card');
    if (!summaryCard) return;

    const name = (document.getElementById('chk-name')?.value || '').trim();
    const phone = (document.getElementById('chk-phone')?.value || '').trim();
    const email = (document.getElementById('chk-email')?.value || '').trim();
    const address = (document.getElementById('chk-address')?.value || '').trim();
    const notes = (document.getElementById('chk-notes')?.value || '').trim();
    const checkedMethod = document.querySelector('input[name="chk-payment-method"]:checked');
    const paymentMethod = checkedMethod ? checkedMethod.value : 'whatsapp';
    const pmDisplay = paymentMethod === 'bank_transfer' ? 'Transferencia Bancaria' : (paymentMethod === 'financing' ? 'Solicitud de financiamiento' : 'WhatsApp (Pedido Rápido)');

    const items = getCartItems();
    let total = 0;
    let totalLease = 0;
    let discountAmount = 0;

    items.forEach(product => {
      const qty = cartState.items[product.id]?.qty || 0;
      const unitPrice = parsePriceToNumber(product.price);
      const lineTotal = unitPrice * qty;
      const isLease = String(product.price).includes('/ mes');
      if (isLease) {
        totalLease += lineTotal;
      } else {
        total += lineTotal;
      }
    });

    if (activeCoupon) {
      items.forEach(product => {
        const qty = cartState.items[product.id]?.qty || 0;
        const unitPrice = parsePriceToNumber(product.price);
        const isLease = String(product.price).includes('/ mes');
        if (!isLease && Array.isArray(activeCoupon.departments) && activeCoupon.departments.includes(product.department)) {
          discountAmount += (unitPrice * qty) * activeCoupon.discount;
        }
      });
    }

    const docType = document.getElementById('chk-document-type')?.value || 'cedula';
    const docNum = (document.getElementById('chk-document-number')?.value || '').trim();
    const docLabel = docType === 'passport' ? 'Pasaporte' : 'Cédula';

    summaryCard.innerHTML = `
      <div class="summary-field"><strong>Nombre:</strong> <span>${escapeHTML(name)}</span></div>
      <div class="summary-field"><strong>${escapeHTML(docLabel)}:</strong> <span>${escapeHTML(docNum || 'No especificado')}</span></div>
      <div class="summary-field"><strong>Teléfono:</strong> <span>${escapeHTML(phone)}</span></div>
      <div class="summary-field"><strong>Correo:</strong> <span>${escapeHTML(email)}</span></div>
      <div class="summary-field"><strong>Dirección:</strong> <span>${escapeHTML(address)}</span></div>
      ${notes ? `<div class="summary-field"><strong>Notas:</strong> <span>${escapeHTML(notes)}</span></div>` : ''}
      <div class="summary-field"><strong>Método de Pago:</strong> <span class="badge-payment-method">${escapeHTML(pmDisplay)}</span></div>
      
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:12px 0;">
      
      <div class="summary-field"><strong>Resumen del Carrito:</strong></div>
      ${items.map(p => `
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#475569; margin-bottom:4px; padding-left:8px;">
          <span>${escapeHTML(p.title)} (x${cartState.items[p.id].qty})</span>
          <span>${escapeHTML(p.price)}</span>
        </div>
      `).join('')}
      
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:12px 0;">
      
      ${total > 0 && discountAmount > 0 ? `
        <div class="summary-field">
          <strong>Subtotal Compra:</strong>
          <span>${formatCurrency(total)}</span>
        </div>
      ` : ''}
      
      ${discountAmount > 0 ? `
        <div class="summary-field" style="color:#2ecc71;">
          <strong>Descuento (${escapeHTML(activeCoupon.code)}):</strong>
          <span>-${formatCurrency(discountAmount)}</span>
        </div>
        <div class="summary-field" style="font-size:1.1rem; color:#0A70A2;">
          <strong>Total Compra:</strong>
          <strong>${formatCurrency(total - discountAmount)}</strong>
        </div>
      ` : total > 0 ? `
        <div class="summary-field" style="font-size:1.1rem; color:#0A70A2;">
          <strong>Total Compra:</strong>
          <strong>${formatCurrency(total)}</strong>
        </div>
      ` : ''}
      
      ${totalLease > 0 ? `
        <div class="summary-field" style="color:#e67e22; font-size:0.95rem; margin-top:4px;">
          <strong>Leasing Mensual:</strong>
          <span>${formatCurrency(totalLease)} / mes</span>
        </div>
      ` : ''}
    `;

    const bankSection = document.getElementById('checkout-step3-bank-details');
    const whatsappSection = document.getElementById('checkout-step3-whatsapp-details');
    const financingSection = document.getElementById('checkout-step3-financing-details');
    const submitBtn = document.getElementById('btn-submit-checkout');

    if (paymentMethod === 'bank_transfer') {
      if (bankSection) bankSection.style.display = 'block';
      if (whatsappSection) whatsappSection.style.display = 'none';
      if (financingSection) financingSection.style.display = 'none';
      if (submitBtn) submitBtn.disabled = !selectedCheckoutFile;
    } else if (paymentMethod === 'financing') {
      if (bankSection) bankSection.style.display = 'none';
      if (whatsappSection) whatsappSection.style.display = 'none';
      if (financingSection) financingSection.style.display = 'block';
      if (submitBtn) submitBtn.disabled = !checkoutFinancingApproved;
    } else {
      if (bankSection) bankSection.style.display = 'none';
      if (whatsappSection) whatsappSection.style.display = 'block';
      if (financingSection) financingSection.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  function injectCheckoutModal() {
    if (document.getElementById('cart-checkout-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'cart-checkout-modal';
    modal.className = 'cart-checkout-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'cart-checkout-title');
    modal.innerHTML = `
      <div class="cart-checkout-modal-card">
        <div class="cart-checkout-modal-header">
          <h3 id="cart-checkout-title">Detalles de Entrega y Pago</h3>
          <button type="button" class="cart-checkout-modal-close" id="close-checkout-modal" aria-label="Cerrar pago">&times;</button>
        </div>
        
        <!-- Wizard Progress Navigation -->
        <div class="checkout-wizard-nav">
          <div class="wizard-progress-bar">
            <div class="wizard-progress-fill" id="wizard-progress-fill" style="width: 0%;"></div>
          </div>
          <div class="wizard-step-node active" data-step="1">
            <div class="step-number">1</div>
            <div class="step-label">Envío</div>
          </div>
          <div class="wizard-step-node" data-step="2">
            <div class="step-number">2</div>
            <div class="step-label">Pago</div>
          </div>
          <div class="wizard-step-node" data-step="3">
            <div class="step-number">3</div>
            <div class="step-label">Confirmación</div>
          </div>
        </div>

        <form id="cart-checkout-form" class="cart-checkout-modal-body">
          <!-- Paso 1: Envío -->
          <div class="checkout-step" id="step-1-content">
            <h4>1. Información de Envío</h4>
            <div class="checkout-form-grid">
              <div class="checkout-form-group full-width">
                <label for="chk-name">Nombre de Contacto *</label>
                <input type="text" id="chk-name" placeholder="Ej. Juan Pérez" maxlength="100" autocomplete="name" required>
              </div>
              <div class="checkout-form-group">
                <label for="chk-phone">Teléfono de Contacto *</label>
                <input type="tel" id="chk-phone" placeholder="Ej. 809-555-5555" maxlength="30" autocomplete="tel" required>
              </div>
              <div class="checkout-form-group">
                <label for="chk-email">Correo Electrónico *</label>
                <input type="email" id="chk-email" placeholder="Ej. juan.perez@correo.com" maxlength="100" autocomplete="email" required>
              </div>
              <div class="checkout-form-group">
                <label for="chk-document-type">Tipo de Documento *</label>
                <select id="chk-document-type" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-family: inherit; font-size: 0.9rem; background: #fff;">
                  <option value="cedula">Cédula Dominicana</option>
                  <option value="passport">Pasaporte</option>
                </select>
              </div>
              <div class="checkout-form-group">
                <label for="chk-document-number">Número de Cédula o Documento *</label>
                <input type="text" id="chk-document-number" placeholder="Ej. 001-1234567-8" maxlength="30" autocomplete="off" spellcheck="false" required>
                <small id="chk-document-hint" style="display: block; margin-top: 4px; font-size: 0.72rem; color: #64748b;">Requerido para facturación legal de tu primera compra</small>
              </div>
              <div class="checkout-form-group full-width">
                <label for="chk-address">Dirección de Entrega *</label>
                <textarea id="chk-address" placeholder="Calle, Número, Sector, Ciudad..." rows="2" maxlength="300" autocomplete="street-address" required></textarea>
              </div>
              <div class="checkout-form-group full-width">
                <label for="chk-notes">Notas / Referencias (Opcional)</label>
                <textarea id="chk-notes" placeholder="Ej. Casa de dos niveles frente al parque..." rows="1" maxlength="500"></textarea>
              </div>
              <div class="checkout-form-group full-width" style="margin-top: 8px;">
                <label for="chk-coupon">Código de Descuento (Opcional)</label>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <input type="text" id="chk-coupon" placeholder="Ej. BLACKTI2026" maxlength="50" autocomplete="off" spellcheck="false" style="flex: 1; text-transform: uppercase; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; font-family:inherit;">
                  <button type="button" class="btn btn-ghost" id="btn-apply-coupon" style="min-width: 90px; padding: 0 12px; height: 42px; border: 1px solid #cbd5e1; border-radius: 8px; font-weight:600; background:#f8fafc;">Aplicar</button>
                </div>
                <small id="coupon-feedback" style="display: block; margin-top: 4px; font-weight: 600; font-size: 0.8rem;"></small>
              </div>
            </div>
          </div>

          <!-- Paso 2: Método de Pago -->
          <div class="checkout-step" id="step-2-content" style="display:none;">
            <h4>2. Método de Pago</h4>
            <div class="checkout-methods">
              <label class="checkout-method-option">
                <input type="radio" name="chk-payment-method" value="whatsapp" checked>
                <div class="method-card">
                  <div class="method-icon"><i data-lucide="message-square"></i></div>
                  <div class="method-text">
                    <strong>WhatsApp (Pedido Rápido)</strong>
                    <span>Envía tu pedido y coordina el pago con un asesor.</span>
                  </div>
                </div>
              </label>

              <label class="checkout-method-option" id="transfer-option-label">
                <input type="radio" name="chk-payment-method" value="bank_transfer">
                <div class="method-card">
                  <div class="method-icon"><i data-lucide="landmark"></i></div>
                  <div class="method-text">
                    <strong>Transferencia Bancaria Directa</strong>
                    <span>Paga por transferencia y sube tu comprobante aquí.</span>
                  </div>
                </div>
              </label>

              <label class="checkout-method-option" id="financing-option-label">
                <input type="radio" name="chk-payment-method" value="financing">
                <div class="method-card">
                  <div class="method-icon"><i data-lucide="calendar-check"></i></div>
                  <div class="method-text">
                    <strong>Solicitar financiamiento</strong>
                    <span>Envía el pedido para evaluación y asignación de cuotas.</span>
                  </div>
                </div>
              </label>
            </div>
            
            <div id="checkout-guest-warning" class="checkout-warning-box" style="display:none; margin-top:12px;">
              <p>Para pagar mediante transferencia y subir tu comprobante directamente en la web, debes <a href="login.html" style="text-decoration:underline; font-weight:600; color:#0A70A2;">iniciar sesión</a> o registrarte. De lo contrario, puedes solicitar tu pedido por WhatsApp y acordar el pago allí.</p>
            </div>
          </div>

          <!-- Paso 3: Confirmación y comprobante -->
          <div class="checkout-step" id="step-3-content" style="display:none;">
            <h4>3. Confirmación del Pedido</h4>
            
            <div class="checkout-summary-card" id="checkout-step3-summary-card">
              <!-- Renderizado dinámicamente en JS -->
            </div>

            <!-- Detalles específicos por método de pago -->
            <div id="checkout-step3-whatsapp-details" style="display:none; margin-top:16px;">
              <div class="checkout-info-box">
                <p><strong>Pedido por WhatsApp:</strong> Al confirmar, abriremos un chat con nuestro asesor para coordinar los detalles finales de entrega y facturación con todo el listado de tu carrito listo.</p>
              </div>
            </div>

            <div id="checkout-step3-bank-details" class="checkout-subpanel" style="display:none; margin-top:16px;">
              <div class="bank-accounts-info">
                <h5>Datos de Cuenta Oficial Futunet SRL:</h5>
                <div class="bank-account-card">
                  <div><strong>Titular:</strong> <span class="copyable" tabindex="0" role="button" aria-label="Copiar titular de cuenta" onclick="FutunetCart.copyText('FUTUNET.SRL')">FUTUNET.SRL</span></div>
                  <div><strong>Tipo:</strong> Corriente</div>
                  <div><strong>Banco:</strong> Banreservas</div>
                  <div><strong>Cuenta:</strong> <span class="copyable font-mono" tabindex="0" role="button" aria-label="Copiar número de cuenta Banreservas" onclick="FutunetCart.copyText('9605759674')">9605759674</span></div>
                  <div><strong>RNC:</strong> <span class="copyable font-mono" tabindex="0" role="button" aria-label="Copiar número de RNC de Futunet" onclick="FutunetCart.copyText('132702077')">132702077</span></div>
                </div>
                <small class="click-to-copy-hint">Toca o presiona Enter sobre el titular, cuenta o RNC para copiarlos al portapapeles.</small>
              </div>

              <div class="checkout-upload-area" style="margin-top:16px;">
                <label>Sube tu comprobante de pago *</label>
                <div class="checkout-dropzone" id="checkout-voucher-dropzone">
                  <i data-lucide="upload-cloud"></i>
                  <p>Arrastra o haz clic para subir tu comprobante de pago (Imagen o PDF, máx. 5MB)</p>
                  <input type="file" id="chk-voucher-file" accept="image/*,application/pdf" style="display:none;">
                </div>
                
                <div class="checkout-preview-box" id="checkout-voucher-preview-box" style="display:none;">
                  <span id="checkout-voucher-filename">archivo.jpg</span>
                  <button type="button" class="btn-remove-file" id="btn-remove-chk-file">&times; Eliminar</button>
                </div>
              </div>
            </div>
            <div id="checkout-step3-financing-details" class="checkout-subpanel" style="display:none; margin-top:16px;">
              <div class="checkout-info-box">
                <p><strong>Solicitud protegida:</strong> Tu expediente de identidad ya fue aprobado. Un administrador revisará el pedido y, si procede, te asignará la cuenta con el detalle de cuotas en “Mi cuenta”.</p>
              </div>
            </div>
            <!-- Campo trampa antispam (Honeypot para bots) -->
            <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;pointer-events:none;" aria-hidden="true">
              <label for="chk-hp-check">No llenar este campo</label>
              <input type="text" id="chk-hp-check" name="_hp_security_check" tabindex="-1" autocomplete="off" maxlength="50" />
            </div>

            <div class="checkout-privacy-consent" style="margin-top: 16px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <label style="display:flex;align-items:flex-start;gap:8px;font-size:0.82rem;color:#475569;line-height:1.45;cursor:pointer;">
                <input type="checkbox" id="chk-accept-terms" required style="width:16px;height:16px;margin-top:2px;flex:0 0 auto;accent-color:#0B7EB5;" />
                <span>He leído y acepto los <a href="terminos.html" target="_blank" rel="noopener noreferrer" style="color:#0A70A2;text-decoration:underline;font-weight:600;">Términos y Condiciones</a> y la <a href="privacidad.html" target="_blank" rel="noopener noreferrer" style="color:#0A70A2;text-decoration:underline;font-weight:600;">Política de Privacidad</a> de Futunet.</span>
              </label>
            </div>
          </div>

          <div class="cart-checkout-modal-footer">
            <button type="button" class="btn btn-ghost" id="btn-prev-checkout">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-next-checkout">Siguiente</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-checkout" style="display:none;">
              Confirmar y Enviar Pedido
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind events
    document.getElementById('close-checkout-modal')?.addEventListener('click', closeCheckoutModal);

    // Coupon logic
    const btnApplyCoupon = document.getElementById('btn-apply-coupon');
    const couponInput = document.getElementById('chk-coupon');
    const couponFeedback = document.getElementById('coupon-feedback');

    if (btnApplyCoupon && couponInput && couponFeedback) {
      couponInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btnApplyCoupon.click();
        }
      });
      btnApplyCoupon.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (!code) {
          activeCoupon = null;
          couponFeedback.textContent = '';
          return;
        }

        const coupon = COUPONS[code];
        if (!coupon) {
          activeCoupon = null;
          couponFeedback.textContent = 'Código de cupón inválido o expirado.';
          couponFeedback.style.color = '#e74c3c';
          return;
        }

        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (today < coupon.validFrom || today > coupon.validUntil) {
          activeCoupon = null;
          couponFeedback.textContent = 'Este cupón todavía no está activo o ya expiró.';
          couponFeedback.style.color = '#e74c3c';
          return;
        }

        const items = getCartItems();
        const hasQualifyingItems = items.some(p => {
          const isLease = String(p.price).includes('/ mes');
          return !isLease && coupon.departments.includes(p.department);
        });

        if (!hasQualifyingItems) {
          activeCoupon = null;
          couponFeedback.textContent = `El cupón no aplica a los productos en tu carrito.`;
          couponFeedback.style.color = '#f39c12';
          return;
        }

        activeCoupon = coupon;
        couponFeedback.textContent = `Cupón ${coupon.code} aplicado: ${coupon.description}`;
        couponFeedback.style.color = '#2ecc71';
        showCartToast(`Cupón ${coupon.code} aplicado con éxito.`, 'success');
      });
    }

    // Navigation buttons
    const btnPrev = document.getElementById('btn-prev-checkout');
    const btnNext = document.getElementById('btn-next-checkout');

    btnPrev.addEventListener('click', () => {
      if (currentStep === 1) {
        closeCheckoutModal();
      } else {
        currentStep--;
        updateWizardUI();
      }
    });

    btnNext.addEventListener('click', () => {
      if (currentStep === 1) {
        const fields = ['chk-name', 'chk-phone', 'chk-email', 'chk-document-number', 'chk-address'];
        let isValid = true;
        fields.forEach(fid => {
          const el = document.getElementById(fid);
          if (el && !el.reportValidity()) {
            isValid = false;
          }
        });
        if (!isValid) return;

        const docType = document.getElementById('chk-document-type')?.value || 'cedula';
        const docNum = (document.getElementById('chk-document-number')?.value || '').trim();

        if (docType === 'cedula') {
          const cleanCedula = docNum.replace(/\D/g, '');
          if (cleanCedula.length !== 11) {
            showCartToast('La cédula debe contener exactamente 11 dígitos.', 'error');
            const docInput = document.getElementById('chk-document-number');
            if (docInput) docInput.focus();
            return;
          }
        } else if (docNum.length < 6 || docNum.length > 20) {
          showCartToast('El pasaporte debe contener entre 6 y 20 caracteres.', 'error');
          const docInput = document.getElementById('chk-document-number');
          if (docInput) docInput.focus();
          return;
        }

        currentStep = 2;
        updateWizardUI();
      } else if (currentStep === 2) {
        currentStep = 3;
        updateWizardUI();
      }
    });

    // Document type toggle
    const chkDocTypeEl = document.getElementById('chk-document-type');
    if (chkDocTypeEl) {
      chkDocTypeEl.addEventListener('change', updateDocumentFieldUI);
    }

    // Payment method toggle
    const methods = modal.querySelectorAll('input[name="chk-payment-method"]');
    methods.forEach(m => {
      m.addEventListener('change', function () {
        togglePaymentSubpanels(this.value);
      });
    });

    // File Dropzone events
    const dropzone = document.getElementById('checkout-voucher-dropzone');
    const fileInput = document.getElementById('chk-voucher-file');
    const removeBtn = document.getElementById('btn-remove-chk-file');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) handleCheckoutFile(this.files[0]);
      });

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
      });
      ['dragleave', 'drop'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.remove('is-dragover');
        });
      });
      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleCheckoutFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', removeCheckoutFile);
    }

    // Submit handler
    const form = document.getElementById('cart-checkout-form');
    form.addEventListener('submit', handleCheckoutSubmit);

    modal.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('copyable')) {
        e.preventDefault();
        e.target.click();
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function togglePaymentSubpanels(method) {
    const warningBox = document.getElementById('checkout-guest-warning');
    const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
    const btnNext = document.getElementById('btn-next-checkout');

    if (method === 'financing') {
      if (!user) {
        warningBox.innerHTML = '<p>Para solicitar financiamiento debes <a href="login.html?redirect=mi-cuenta.html%3Ftab%3Dfinancing" style="text-decoration:underline;font-weight:600;color:#0A70A2;">iniciar sesión o crear una cuenta</a>.</p>';
        warningBox.style.display = 'block';
        if (btnNext) btnNext.disabled = true;
      } else if (!checkoutFinancingApproved) {
        warningBox.innerHTML = '<p>Antes de financiar debes completar y obtener aprobación de tu expediente: foto del documento, selfie con el documento y firma. <a href="mi-cuenta.html?tab=financing" style="text-decoration:underline;font-weight:600;color:#0A70A2;">Completar expediente</a>.</p>';
        warningBox.style.display = 'block';
        if (btnNext) btnNext.disabled = true;
      } else {
        warningBox.style.display = 'none';
        if (btnNext) btnNext.disabled = false;
      }
    } else if (method === 'bank_transfer') {
      if (user) {
        warningBox.style.display = 'none';
        if (btnNext) btnNext.disabled = false;
      } else {
        warningBox.style.display = 'block';
        if (btnNext) btnNext.disabled = true;
      }
    } else {
      warningBox.style.display = 'none';
      if (btnNext) btnNext.disabled = false;
    }
  }

  function handleCheckoutFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExt)) {
      showCartToast('Solo se permiten imágenes (JPG, PNG, WEBP) o archivos PDF.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showCartToast('El archivo supera los 5MB permitidos.', 'error');
      return;
    }
    selectedCheckoutFile = file;
    
    const filenameSpan = document.getElementById('checkout-voucher-filename');
    filenameSpan.textContent = file.name;
    
    const previewBox = document.getElementById('checkout-voucher-preview-box');
    const dropzone = document.getElementById('checkout-voucher-dropzone');
    
    let previewImg = document.getElementById('checkout-voucher-img-preview');
    if (!previewImg) {
      previewImg = document.createElement('img');
      previewImg.id = 'checkout-voucher-img-preview';
      previewImg.className = 'checkout-voucher-preview-img';
      previewBox.insertBefore(previewImg, filenameSpan);
    }
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      // PDF
      previewImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%230A70A2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
      previewImg.style.display = 'block';
    }
    
    previewBox.style.display = 'flex';
    dropzone.style.display = 'none';
    
    const submitBtn = document.getElementById('btn-submit-checkout');
    if (submitBtn) submitBtn.disabled = false;
  }

  function removeCheckoutFile() {
    selectedCheckoutFile = null;
    const fileInput = document.getElementById('chk-voucher-file');
    if (fileInput) fileInput.value = '';
    
    const previewBox = document.getElementById('checkout-voucher-preview-box');
    const dropzone = document.getElementById('checkout-voucher-dropzone');
    const previewImg = document.getElementById('checkout-voucher-img-preview');
    if (previewImg) previewImg.remove();
    
    previewBox.style.display = 'none';
    dropzone.style.display = 'block';
    
    const paymentMethod = document.querySelector('input[name="chk-payment-method"]:checked')?.value;
    if (paymentMethod === 'bank_transfer') {
      const submitBtn = document.getElementById('btn-submit-checkout');
      if (submitBtn) submitBtn.disabled = true;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCartToast('Copiado al portapapeles', 'success');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    try {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-9999px';
      tempInput.style.top = '-9999px';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(tempInput);
      if (successful) {
        showCartToast('Copiado al portapapeles', 'success');
      } else {
        showCartToast('Error al copiar', 'error');
      }
    } catch (e) {
      showCartToast('Error al copiar', 'error');
    }
  }

  let checkoutModalCleanup = null;
  let checkoutModalPreviousActiveElement = null;

  async function openCheckoutModal() {
    const items = getCartItems();
    if (!items.length) return;
    
    injectCheckoutModal();
    
    const modal = document.getElementById('cart-checkout-modal');
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Reset form
    const chkForm = document.getElementById('cart-checkout-form');
    if (chkForm) chkForm.reset();
    removeCheckoutFile();
    activeCoupon = null;
    const couponFeedback = document.getElementById('coupon-feedback');
    if (couponFeedback) couponFeedback.textContent = '';
    
    // Check if user is logged in and autofill
    const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
    const db = window.FutunetFirebase && window.FutunetFirebase.db ? window.FutunetFirebase.db : null;
    
    const transferOption = document.getElementById('transfer-option-label');
    const financingOption = document.getElementById('financing-option-label');
    checkoutFinancingApproved = false;
    if (!user) {
      if (transferOption) transferOption.style.opacity = '0.5';
      if (financingOption) financingOption.style.opacity = '0.5';
    } else {
      if (transferOption) transferOption.style.opacity = '1';
      
      const emailField = document.getElementById('chk-email');
      if (emailField) emailField.value = user.email || '';
      
      // Load user profile details from Firestore
      if (db) {
        try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            const chkName = document.getElementById('chk-name');
            if (chkName) chkName.value = data.displayName || '';
            const chkPhone = document.getElementById('chk-phone');
            if (chkPhone) chkPhone.value = data.phone || '';
            const chkAddress = document.getElementById('chk-address');
            if (chkAddress) chkAddress.value = data.address || '';
            if (data.email && emailField) {
              emailField.value = data.email;
            }
            const chkDocType = document.getElementById('chk-document-type');
            if (data.documentType && chkDocType) {
              chkDocType.value = data.documentType;
            }
            const chkDocNum = document.getElementById('chk-document-number');
            if (data.documentNumber && chkDocNum) {
              chkDocNum.value = data.documentNumber;
              const hintEl = document.getElementById('chk-document-hint');
              if (hintEl) hintEl.textContent = 'Documento guardado en tu cuenta';
            }
          }
          const financingDoc = await db.collection('financing_profiles').doc(user.uid).get();
          checkoutFinancingApproved = financingDoc.exists && financingDoc.data().status === 'approved';
          if (financingOption) financingOption.style.opacity = checkoutFinancingApproved ? '1' : '0.65';
        } catch (e) {
          console.warn('Error autofilling checkout fields:', e);
        }
      }
    }
    
    // Reset radio selection
    const radioWhatsApp = document.querySelector('input[name="chk-payment-method"][value="whatsapp"]');
    if (radioWhatsApp) radioWhatsApp.checked = true;
    
    togglePaymentSubpanels('whatsapp'); // default option
    closeCartDrawer();
    
    currentStep = 1;
    updateWizardUI();

    // Focus Trap
    checkoutModalPreviousActiveElement = cartDrawerPreviousActiveElement || document.activeElement;
    if (checkoutModalCleanup) checkoutModalCleanup();
    if (window.FutunetFocusTrap) {
      checkoutModalCleanup = window.FutunetFocusTrap(modal, closeCheckoutModal);
    }
    
    setTimeout(() => {
      const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length > 0) focusables[0].focus();
    }, 100);
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('cart-checkout-modal');
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';

    if (checkoutModalCleanup) {
      checkoutModalCleanup();
      checkoutModalCleanup = null;
    }
    if (checkoutModalPreviousActiveElement && typeof checkoutModalPreviousActiveElement.focus === 'function') {
      checkoutModalPreviousActiveElement.focus();
      checkoutModalPreviousActiveElement = null;
    }
  }

  async function handleCheckoutSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    const items = getCartItems();
    if (!items.length) return;
    
    const submitBtn = document.getElementById('btn-submit-checkout');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "Confirmar y Enviar Pedido";

    // 1. Verificación Honeypot (Trampa antispam para bots)
    const hpVal = (document.getElementById('chk-hp-check')?.value || '').trim();
    if (hpVal) {
      console.warn('Bot detected via honeypot in checkout.');
      showCartToast('Pedido registrado con éxito.', 'success');
      closeCheckoutModal();
      return;
    }

    // 2. Cooldown de envío de pedidos (Rate-limiting en cliente 10s contra flooding / doble submit)
    const orderCooldownKey = 'futunet_last_order_ts';
    const now = Date.now();
    let lastOrder = null;
    try {
      lastOrder = sessionStorage.getItem(orderCooldownKey);
    } catch (_) {}
    if (lastOrder && (now - Number(lastOrder)) < 10000) {
      const waitSecs = Math.ceil((10000 - (now - Number(lastOrder))) / 1000);
      showCartToast(`Por favor espera ${waitSecs} segundo(s) antes de confirmar otro pedido.`, 'info');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }

    // 3. Verificación de Consentimiento de Términos y Privacidad (Ley 172-13 / RGPD)
    const acceptTerms = document.getElementById('chk-accept-terms');
    if (acceptTerms && !acceptTerms.checked) {
      showCartToast('Debes aceptar los Términos y Condiciones y la Política de Privacidad para confirmar tu pedido.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      acceptTerms.focus();
      return;
    }
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando pedido...';
    }

    const sanitizeText = (val) => String(val || '')
      .replace(/<[^>]*>/g, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
    
    const name = sanitizeText(document.getElementById('chk-name')?.value);
    const phone = sanitizeText(document.getElementById('chk-phone')?.value);
    const email = sanitizeText(document.getElementById('chk-email')?.value);
    const address = sanitizeText(document.getElementById('chk-address')?.value);
    const notes = sanitizeText(document.getElementById('chk-notes')?.value);
    const checkedMethod = document.querySelector('input[name="chk-payment-method"]:checked');
    const paymentMethod = checkedMethod ? checkedMethod.value : 'whatsapp';
    
    // Validaciones de formato y longitud en frontend para mitigar envío de datos inválidos (OWASP ASVS V5)
    if (name.length < 2 || name.length > 100) {
      showCartToast('El nombre de contacto debe tener entre 2 y 100 caracteres.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/;
    
    if (!emailRegex.test(email) || email.length > 100) {
      showCartToast('Por favor introduce un correo electrónico válido (máx. 100 caracteres).', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }
    
    if (!phoneRegex.test(phone) || phone.length > 30) {
      showCartToast('Por favor introduce un número de teléfono válido (mín. 7 dígitos, máx. 30 caracteres).', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }

    if (address.length < 2 || address.length > 300) {
      showCartToast('La dirección de entrega debe tener entre 2 y 300 caracteres.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }

    if (notes.length > 500) {
      showCartToast('Las notas de entrega no deben superar los 500 caracteres.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }
    
    const docType = document.getElementById('chk-document-type')?.value || 'cedula';
    let docNum = (document.getElementById('chk-document-number')?.value || '').trim();
    if (docType === 'cedula') docNum = docNum.replace(/\D/g, '');
    else docNum = sanitizeText(docNum).toUpperCase().slice(0, 30);

    const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
    const db = window.FutunetFirebase && window.FutunetFirebase.db ? window.FutunetFirebase.db : null;
    const storage = window.FutunetFirebase && window.FutunetFirebase.storage ? window.FutunetFirebase.storage : null;
    
    // Auto-guardar documento en el perfil del usuario en su primera compra
    if (user && db && docNum) {
      try {
        await db.collection('users').doc(user.uid).update({
          documentType: docType,
          documentNumber: docNum,
          identityProfileComplete: true
        });
      } catch (docSaveErr) {
        console.warn('No se pudo auto-guardar documento en perfil:', docSaveErr);
      }
    }

    let downloadUrl = null;
    let storagePath = null;
    
    try {
      if (paymentMethod === 'financing' && (!user || !checkoutFinancingApproved)) {
        showCartToast('Necesitas un expediente de financiamiento aprobado para continuar.', 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }
        return;
      }
      if (paymentMethod === 'bank_transfer') {
        if (!user || !storage) {
          showCartToast('Error: Debes iniciar sesión para pagar mediante transferencia bancaria.', 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
          return;
        }
        
        if (!selectedCheckoutFile) {
          showCartToast('Por favor, sube tu comprobante de pago.', 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
          return;
        }
        
        showCartToast('Subiendo comprobante...', 'info');
        
        const fileExt = selectedCheckoutFile.name.split('.').pop().toLowerCase();
        const randomId = Math.random().toString(36).substring(2, 10);
        storagePath = 'vouchers/' + user.uid + '/order_' + randomId + '_' + Date.now() + '.' + fileExt;
        
        const fileRef = storage.ref().child(storagePath);
        const uploadTask = await fileRef.put(selectedCheckoutFile);
        downloadUrl = await uploadTask.ref.getDownloadURL();
      }
      
      const form = (e && e.currentTarget && e.currentTarget.id === 'cart-checkout-form')
        ? e.currentTarget
        : document.getElementById('cart-checkout-form');
      if (form && !form.dataset.requestId) {
        form.dataset.requestId = window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }

      // Construir payload para el API del backend
      const orderPayload = {
        user_id: user ? user.uid : 'guest',
        user_name: name,
        user_email: email,
        user_phone: phone,
        user_document_type: docType,
        user_document_number: docNum,
        shipping_address: address,
        shipping_notes: notes,
        payment_method: paymentMethod,
        request_id: form.dataset.requestId,
        coupon_code: activeCoupon ? activeCoupon.code : null,
        items: items.map(p => ({
          id: p.id,
          title: p.title,
          price: parsePriceToNumber(p.price),
          qty: cartState.items[p.id].qty,
          brand: p.brand || '',
          category: p.category || '',
          department: p.department || '',
          is_lease: String(p.price).includes('/ mes')
        })),
        payment_voucher_url: downloadUrl,
        payment_storage_path: storagePath
      };

      // Configurar cabeceras y obtener JWT de Firebase para autenticación
      const headers = {
        'Content-Type': 'application/json'
      };
      if (user) {
        try {
          const idToken = await user.getIdToken();
          headers['Authorization'] = `Bearer ${idToken}`;
        } catch (tokenErr) {
          console.warn('No se pudo obtener el token ID del usuario:', tokenErr);
        }
      }

      showCartToast('Registrando pedido...', 'info');

      let resData = null;
      let backendFailed = false;

      // Usar AbortController con timeout de 12 segundos para no bloquear al usuario si el backend está en cold-start
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const response = await fetch('https://futunet-backend.onrender.com/api/order', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(orderPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          resData = await response.json();
          if (!resData.success) {
            throw new Error(resData.detail || 'El servidor rechazó el pedido.');
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `Error en el servidor (${response.status})`);
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        if (paymentMethod !== 'whatsapp') {
          // Para transferencia bancaria y financiamiento es mandatoria la persistencia en servidor
          throw fetchErr;
        }
        backendFailed = true;
        console.warn('Backend order sync no completado en tiempo; procesando pedido por WhatsApp directo:', fetchErr);
      }

      if (paymentMethod === 'bank_transfer') {
        showCartToast(resData?.message || 'Pedido por transferencia registrado con éxito.', 'success');

        // Vaciar carrito
        cartState.items = {};
        saveCartState();
        updateCartCount();
        closeCheckoutModal();
      } else if (paymentMethod === 'financing') {
        showCartToast(resData?.message || 'Solicitud de financiamiento registrada para evaluación.', 'success');

        // Vaciar carrito
        cartState.items = {};
        saveCartState();
        updateCartCount();
        closeCheckoutModal();
      } else {
        // Método WhatsApp
        if (backendFailed) {
          showCartToast('Abriendo WhatsApp para coordinar tu pedido...', 'success');
        } else {
          showCartToast(resData?.message || 'Pedido registrado. Abriendo WhatsApp...', 'success');
        }

        const message = buildCheckoutMessage(items, resData);
        const phoneNo = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
        const waUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(message)}`;

        safeOpenWhatsApp(waUrl);

        cartState.items = {};
        saveCartState();
        updateCartCount();
        closeCheckoutModal();
      }

      try {
        sessionStorage.setItem('futunet_last_order_ts', String(Date.now()));
      } catch (_) {}
      if (form && form.dataset) delete form.dataset.requestId;
    } catch (err) {
      console.error('Error during checkout processing:', err);
      showCartToast('Error al procesar el pedido: ' + err.message, 'error');
    }
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
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
          <div class="cart-item__image"><img src="${escapeHTML(product.img)}" alt="${escapeHTML(product.title)}" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.svg'" /></div>
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
      let totalPurchase = 0;
      let totalLease = 0;
      items.forEach((product) => {
        const qty = cartState.items[product.id]?.qty || 0;
        const val = parsePriceToNumber(product.price) * qty;
        if (String(product.price).includes('/ mes')) {
          totalLease += val;
        } else {
          totalPurchase += val;
        }
      });
      
      let summaryText = formatCartQuantity(totalCount);
      if (totalPurchase > 0 && totalLease > 0) {
        summaryText += ` · Compra: ${formatCurrency(totalPurchase)} + Lease: ${formatCurrency(totalLease)}/mes`;
      } else if (totalPurchase > 0) {
        summaryText += ` · Total: ${formatCurrency(totalPurchase)}`;
      } else if (totalLease > 0) {
        summaryText += ` · Total Lease: ${formatCurrency(totalLease)}/mes`;
      }
      
      summary.textContent = summaryText;
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i data-lucide="shopping-bag"></i> Tramitar pedido';
    }
    
    if (window.lucide) window.lucide.createIcons();
  }

  function bindCartUI() {
    loadCartState();
    
    const cartFab = document.getElementById('cart-fab');
    const cartLink = document.getElementById('product-cart-link'); 
    const drawer = document.getElementById('cart-drawer');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    if (cartFab) cartFab.addEventListener('click', toggleCartDrawer);
    if (cartLink) cartLink.addEventListener('click', toggleCartDrawer);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);

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
      if (event.key === 'Escape') {
        closeCartDrawer();
        closeCheckoutModal();
      }
    });
  }

  // Exponer al scope global
  window.FutunetCart = {
    state: cartState,
    load: loadCartState,
    add: addToCart,
    addItem: function (productOrId, qty) {
      const quantity = Math.max(1, Number(qty) || 1);
      if (typeof productOrId === 'object' && productOrId !== null && productOrId.id) {
        if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
          if (!mockDatabase.some(p => p && p.id === productOrId.id)) {
            mockDatabase.push(productOrId);
          }
        }
        addToCart(productOrId.id, quantity);
      } else {
        addToCart(productOrId, quantity);
      }
    },
    remove: removeFromCart,
    changeQty: changeCartQuantity,
    toggleDrawer: toggleCartDrawer,
    openDrawer: openCartDrawer,
    closeDrawer: closeCartDrawer,
    bindUI: bindCartUI,
    getItemQty: (id) => cartState.items[id]?.qty || 0,
    copyText: copyText
  };

  // Inicialización automática resiliente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCartUI);
  } else {
    bindCartUI();
  }

  // Sincronizar carrito cuando la autenticación esté lista o cambie
  window.addEventListener('futunet-auth-ready', async function(event) {
    const user = event.detail.user;
    if (user) {
      await syncCartToFirestore(user);
    }
  });

  // Sincronizar reactivamente cuando otro script (p. ej. Mi Cuenta) o pestaña actualice el carrito
  function handleExternalCartUpdate() {
    loadCartState();
    renderCartDrawer();
    if (typeof window.updateInlineCartButtons === 'function') {
      window.updateInlineCartButtons();
    }
  }
  window.addEventListener('futunet-cart-updated', handleExternalCartUpdate);
  window.addEventListener('storage', function(event) {
    if (event.key === CART_STORAGE_KEY) {
      handleExternalCartUpdate();
    }
  });
})();
