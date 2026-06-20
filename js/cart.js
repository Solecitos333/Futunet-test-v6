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
    if (productId === 'custom_office_bundle') {
      try {
        const saved = window.localStorage.getItem('futunetCustomOfficeBundle');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Error reading custom bundle:', e);
      }
      return {
        id: 'custom_office_bundle',
        title: 'Configuración Personalizada de Oficina',
        category: 'Equipos de Oficina',
        brand: 'FUTUNET B2B',
        price: 'RD$ 0',
        img: 'images/oficina/sim_office_pro.png',
        description: 'Combo configurado a medida en el Estimador Tecnológico.',
        specs: []
      };
    }
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

  function buildCheckoutMessage(items) {
    const lines = ['Hola Futunet, quiero solicitar este carrito:'];
    let total = 0;
    let totalLease = 0;

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

    if (total > 0 || totalLease > 0) {
      lines.push('');
      if (total > 0) {
        lines.push(`Total Compra (CapEx): ${formatCurrency(total)}`);
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

  function showCartToast(msg, type = 'info') {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cart-toast cart-toast-${type}`;
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

  function injectCheckoutModal() {
    if (document.getElementById('cart-checkout-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'cart-checkout-modal';
    modal.className = 'cart-checkout-modal-overlay';
    modal.innerHTML = `
      <div class="cart-checkout-modal-card">
        <div class="cart-checkout-modal-header">
          <h3>Detalles de Entrega y Pago</h3>
          <button type="button" class="cart-checkout-modal-close" id="close-checkout-modal">&times;</button>
        </div>
        <form id="cart-checkout-form" class="cart-checkout-modal-body">
          <div class="checkout-step">
            <h4>1. Información de Envío</h4>
            <div class="checkout-form-grid">
              <div class="checkout-form-group full-width">
                <label for="chk-name">Nombre de Contacto *</label>
                <input type="text" id="chk-name" placeholder="Ej. Juan Pérez" required>
              </div>
              <div class="checkout-form-group">
                <label for="chk-phone">Teléfono de Contacto *</label>
                <input type="tel" id="chk-phone" placeholder="Ej. 809-555-5555" required>
              </div>
              <div class="checkout-form-group">
                <label for="chk-email">Correo Electrónico *</label>
                <input type="email" id="chk-email" placeholder="Ej. juan.perez@correo.com" required>
              </div>
              <div class="checkout-form-group full-width">
                <label for="chk-address">Dirección de Entrega *</label>
                <textarea id="chk-address" placeholder="Calle, Número, Sector, Ciudad..." rows="2" required></textarea>
              </div>
              <div class="checkout-form-group full-width">
                <label for="chk-notes">Notas / Referencias (Opcional)</label>
                <textarea id="chk-notes" placeholder="Ej. Casa de dos niveles frente al parque..." rows="1"></textarea>
              </div>
            </div>
          </div>

          <div class="checkout-step">
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
            </div>
            
            <div id="checkout-guest-warning" class="checkout-warning-box" style="display:none; margin-top:12px;">
              <p>⚠️ Para pagar mediante transferencia y subir tu comprobante directamente en la web, debes <a href="login.html" style="text-decoration:underline; font-weight:600; color:#0A70A2;">iniciar sesión</a> o registrarte. De lo contrario, puedes solicitar tu pedido por WhatsApp y acordar el pago allí.</p>
            </div>

            <!-- Sección de transferencia -->
            <div id="checkout-bank-details" class="checkout-subpanel" style="display:none; margin-top:12px;">
              <div class="bank-accounts-info">
                <h5>Datos de Cuenta Oficial Futunet SRL:</h5>
                <div class="bank-account-card">
                  <div><strong>Titular:</strong> <span class="copyable" onclick="FutunetCart.copyText('FUTUNET.SRL')">FUTUNET.SRL</span></div>
                  <div><strong>Tipo:</strong> Corriente</div>
                  <div><strong>Banco:</strong> Banreservas</div>
                  <div><strong>Cuenta:</strong> <span class="copyable font-mono" onclick="FutunetCart.copyText('9605759674')">9605759674</span></div>
                  <div><strong>RNC:</strong> <span class="copyable font-mono" onclick="FutunetCart.copyText('132702077')">132702077</span></div>
                </div>
                <small class="click-to-copy-hint">💡 Toca el titular, cuenta o RNC para copiarlos al portapapeles.</small>
              </div>

              <div class="checkout-upload-area">
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
          </div>

          <div class="cart-checkout-modal-footer">
            <button type="button" class="btn btn-ghost" id="btn-cancel-checkout">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-checkout">
              Confirmar y Enviar Pedido
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind events
    document.getElementById('close-checkout-modal').addEventListener('click', closeCheckoutModal);
    document.getElementById('btn-cancel-checkout').addEventListener('click', closeCheckoutModal);

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

    if (window.lucide) window.lucide.createIcons();
  }

  function togglePaymentSubpanels(method) {
    const bankDetails = document.getElementById('checkout-bank-details');
    const warningBox = document.getElementById('checkout-guest-warning');
    const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;

    if (method === 'bank_transfer') {
      if (user) {
        bankDetails.style.display = 'block';
        warningBox.style.display = 'none';
        const submitBtn = document.getElementById('btn-submit-checkout');
        if (submitBtn) submitBtn.disabled = !selectedCheckoutFile;
      } else {
        bankDetails.style.display = 'none';
        warningBox.style.display = 'block';
        const submitBtn = document.getElementById('btn-submit-checkout');
        if (submitBtn) submitBtn.disabled = true;
      }
    } else {
      bankDetails.style.display = 'none';
      warningBox.style.display = 'none';
      const submitBtn = document.getElementById('btn-submit-checkout');
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  function handleCheckoutFile(file) {
    // Validar tipo MIME
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showCartToast('Solo se permiten imágenes (JPG, PNG, WEBP) o archivos PDF.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showCartToast('El archivo supera los 5MB permitidos.', 'error');
      return;
    }
    selectedCheckoutFile = file;
    document.getElementById('checkout-voucher-filename').textContent = file.name;
    document.getElementById('checkout-voucher-preview-box').style.display = 'flex';
    document.getElementById('checkout-voucher-dropzone').style.display = 'none';
    
    // Enable submit button
    const submitBtn = document.getElementById('btn-submit-checkout');
    if (submitBtn) submitBtn.disabled = false;
  }

  function removeCheckoutFile() {
    selectedCheckoutFile = null;
    const fileInput = document.getElementById('chk-voucher-file');
    if (fileInput) fileInput.value = '';
    document.getElementById('checkout-voucher-preview-box').style.display = 'none';
    document.getElementById('checkout-voucher-dropzone').style.display = 'block';
    
    // If bank transfer selected, disable submit until file is re-selected
    const paymentMethod = document.querySelector('input[name="chk-payment-method"]:checked')?.value;
    if (paymentMethod === 'bank_transfer') {
      const submitBtn = document.getElementById('btn-submit-checkout');
      if (submitBtn) submitBtn.disabled = true;
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      showCartToast('Copiado al portapapeles', 'success');
    }).catch(() => {
      showCartToast('Error al copiar', 'error');
    });
  }

  let checkoutModalCleanup = null;
  let checkoutModalPreviousActiveElement = null;

  async function openCheckoutModal() {
    const items = getCartItems();
    if (!items.length) return;
    
    injectCheckoutModal();
    
    const modal = document.getElementById('cart-checkout-modal');
    modal.classList.add('is-active');
    
    // Reset form
    document.getElementById('cart-checkout-form').reset();
    removeCheckoutFile();
    
    // Check if user is logged in and autofill
    const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
    const db = window.FutunetFirebase && window.FutunetFirebase.db ? window.FutunetFirebase.db : null;
    
    const transferOption = document.getElementById('transfer-option-label');
    if (!user) {
      if (transferOption) transferOption.style.opacity = '0.5';
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
            document.getElementById('chk-name').value = data.displayName || '';
            document.getElementById('chk-phone').value = data.phone || '';
            document.getElementById('chk-address').value = data.address || '';
            if (data.email && emailField) {
              emailField.value = data.email;
            }
          }
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
    }

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
    e.preventDefault();
    
    const items = getCartItems();
    if (!items.length) return;
    
    const submitBtn = document.getElementById('btn-submit-checkout');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "Confirmar y Enviar Pedido";
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando cotización...';
    }
    
    const name = escapeHTML(document.getElementById('chk-name').value.trim());
    const phone = escapeHTML(document.getElementById('chk-phone').value.trim());
    const email = escapeHTML(document.getElementById('chk-email').value.trim());
    const address = escapeHTML(document.getElementById('chk-address').value.trim());
    const notes = escapeHTML(document.getElementById('chk-notes').value.trim());
    const paymentMethod = document.querySelector('input[name="chk-payment-method"]:checked').value;
    
    const user = window.FutunetAuth && typeof window.FutunetAuth.getCurrentUser === 'function' ? window.FutunetAuth.getCurrentUser() : null;
    const db = window.FutunetFirebase && window.FutunetFirebase.db ? window.FutunetFirebase.db : null;
    const storage = window.FutunetFirebase && window.FutunetFirebase.storage ? window.FutunetFirebase.storage : null;
    
    let totalPurchase = 0;
    let totalLease = 0;
    items.forEach(p => {
      const qty = cartState.items[p.id].qty;
      const val = parsePriceToNumber(p.price) * qty;
      if (String(p.price).includes('/ mes')) {
        totalLease += val;
      } else {
        totalPurchase += val;
      }
    });
    
    const orderData = {
      userId: user ? user.uid : 'guest',
      userName: name,
      userPhone: phone,
      userEmail: email,
      shippingAddress: address,
      shippingNotes: notes,
      items: items.map(p => ({
        id: p.id,
        title: p.title,
        price: parsePriceToNumber(p.price),
        priceLabel: String(p.price),
        qty: cartState.items[p.id].qty,
        img: p.img || '',
        brand: p.brand || '',
        category: p.category || '',
        isLease: String(p.price).includes('/ mes')
      })),
      total: totalPurchase,
      leaseTotal: totalLease,
      status: 'pending',
      paymentMethod: paymentMethod,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Generar PDF y enviar correo llamando al backend en Render
    let quoteBackendSuccess = false;
    let quoteBackendMsg = "";
    
    try {
      const quotePayload = {
        client_name: name,
        client_email: email,
        client_phone: phone,
        shipping_address: address,
        shipping_notes: notes,
        payment_method: paymentMethod,
        products: items.map(p => ({
          id: p.id,
          title: p.title,
          price: parsePriceToNumber(p.price),
          price_label: String(p.price),
          qty: cartState.items[p.id].qty,
          brand: p.brand || '',
          category: p.category || '',
          is_lease: String(p.price).includes('/ mes')
        })),
        total: totalPurchase,
        lease_total: totalLease
      };
      
      const response = await fetch('https://futunet-backend.onrender.com/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotePayload)
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        quoteBackendSuccess = true;
        quoteBackendMsg = resData.message;
      } else {
        console.warn('El backend respondió con error al generar cotización:', resData);
      }
    } catch (apiErr) {
      console.warn('No se pudo comunicar con el backend de cotización:', apiErr);
    }
    
    try {
      if (paymentMethod === 'bank_transfer') {
        if (!user || !db || !storage) {
          showCartToast('Error de autenticación o base de datos.', 'error');
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
        
        const fileExt = selectedCheckoutFile.name.split('.').pop();
        const randomId = Math.random().toString(36).substring(2, 10);
        const storagePath = 'vouchers/' + user.uid + '/order_' + randomId + '_' + Date.now() + '.' + fileExt;
        
        const fileRef = storage.ref().child(storagePath);
        const uploadTask = await fileRef.put(selectedCheckoutFile);
        const downloadUrl = await uploadTask.ref.getDownloadURL();
        
        orderData.paymentVoucherUrl = downloadUrl;
        orderData.paymentStoragePath = storagePath;
        orderData.paymentStatus = 'pending_review';
        
        const docRef = await db.collection('orders').add(orderData);
        
        // Registrar log de auditoría
        await db.collection('audit_logs').add({
          action: 'Pedido por Transferencia',
          details: 'Cliente realizó pedido ID: ' + docRef.id + ' por valor de RD$ ' + totalValue,
          userId: user.uid,
          userEmail: user.email,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        if (quoteBackendSuccess) {
          showCartToast(quoteBackendMsg, 'success');
        } else {
          showCartToast('Pedido registrado con éxito. Se procesará vía transferencia.', 'success');
        }
        
        // Vaciar carrito
        cartState.items = {};
        saveCartState();
        updateCartCount();
        closeCheckoutModal();
        
      } else {
        // WhatsApp method
        if (user && db) {
          try {
            await db.collection('orders').add(orderData);
          } catch (e) {
            console.warn('Error saving WhatsApp order to Firestore:', e);
          }
        }
        
        if (quoteBackendSuccess) {
          showCartToast(quoteBackendMsg, 'success');
        } else {
          showCartToast('Abriendo WhatsApp para completar tu pedido...', 'info');
        }
        
        const message = buildCheckoutMessage(items);
        const phoneNo = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
        
        // Esperar un momento breve para que el usuario pueda ver el Toast de éxito
        setTimeout(() => {
          window.open(`https://wa.me/${phoneNo}?text=${encodeURIComponent(message)}`, '_blank');
        }, 1000);
        
        cartState.items = {};
        saveCartState();
        updateCartCount();
        closeCheckoutModal();
      }
    } catch (err) {
      console.error('Error during checkout processing:', err);
      showCartToast('Error al procesar el pedido. Intenta nuevamente.', 'error');
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
    remove: removeFromCart,
    changeQty: changeCartQuantity,
    toggleDrawer: toggleCartDrawer,
    openDrawer: openCartDrawer,
    closeDrawer: closeCartDrawer,
    bindUI: bindCartUI,
    getItemQty: (id) => cartState.items[id]?.qty || 0,
    copyText: copyText
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
