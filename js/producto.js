(function () {
  const CART_STORAGE_KEY = 'futunetCatalogCart';
  const cartState = { items: {} };
  let currentDetail = null;
  let selectedQuantity = 1;

  function escapeHTML(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

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

  function getCatalogData() {
    if (window.FutunetProductDetail) {
      return window.FutunetProductDetail.getCatalogData();
    }
    return [];
  }

  function findProduct(productId) {
    return getCatalogData().find((item) => item.id === productId) || null;
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
    return `${count} articulo${count !== 1 ? 's' : ''}`;
  }

  function updateCartIndicators() {
    const count = getCartItemCount();
    const badgeEls = document.querySelectorAll('#cart-count, .cart-fab__count');
    badgeEls.forEach((el) => {
      el.textContent = count;
      el.hidden = count === 0;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    const label = document.getElementById('cart-fab-label');
    const labelCount = document.getElementById('cart-fab-label-count');
    const labelCopy = document.getElementById('cart-fab-label-copy');
    const cartFab = document.getElementById('cart-fab');
    const cartLinkCount = document.getElementById('product-cart-link-count');

    if (labelCount) labelCount.textContent = count;
    if (labelCopy) labelCopy.textContent = count === 1 ? 'articulo' : 'articulos';
    if (label) {
      label.hidden = count === 0;
      label.setAttribute('aria-hidden', count === 0 ? 'true' : 'false');
    }
    if (cartFab) {
      cartFab.classList.toggle('has-items', count > 0);
      cartFab.classList.toggle('is-empty', count === 0);
      cartFab.setAttribute(
        'aria-label',
        count > 0 ? `Abrir carrito de compra, ${formatCartQuantity(count)}` : 'Abrir carrito de compra'
      );
    }
    if (cartLinkCount) cartLinkCount.textContent = count;
  }

  function getCartItems() {
    return Object.keys(cartState.items).map((id) => {
      const product = findProduct(id);
      return product ? { ...product, qty: cartState.items[id].qty } : null;
    }).filter(Boolean);
  }

  function addToCart(productId, qty) {
    const product = findProduct(productId);
    if (!product) return;
    const currentQty = cartState.items[productId]?.qty || 0;
    cartState.items[productId] = { qty: currentQty + qty };
    saveCartState();
    updateCartIndicators();
    renderCartDrawer();
  }

  function removeFromCart(productId) {
    if (!cartState.items[productId]) return;
    delete cartState.items[productId];
    saveCartState();
    updateCartIndicators();
    renderCartDrawer();
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
    updateCartIndicators();
    renderCartDrawer();
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

  function renderCartDrawer() {
    const list = document.getElementById('cart-items-list');
    const summary = document.getElementById('cart-summary-count');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (!list || !summary || !checkoutBtn) return;

    const items = getCartItems();
    list.innerHTML = '';

    if (!items.length) {
      list.innerHTML = '<div class="cart-empty-state"><p>Aun no tienes productos en el carrito.</p><small>Agrega productos desde la ficha y vuelve aqui cuando quieras revisarlos.</small></div>';
      summary.textContent = '0 articulos';
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Agregar productos primero';
      return;
    }

    items.forEach((product) => {
      const qty = cartState.items[product.id]?.qty || 0;
      const card = document.createElement('div');
      card.className = 'cart-item';
      card.innerHTML = `
        <div class="cart-item__image"><img src="${escapeHTML(product.img)}" alt="${escapeHTML(product.title)}" loading="lazy" onerror="this.src='img/placeholder.svg'" /></div>
        <div class="cart-item__info">
          <div class="cart-item__title">${escapeHTML(product.title)}</div>
          <div class="cart-item__meta">${escapeHTML(product.brand)} · ${escapeHTML(product.category)}</div>
          <div class="cart-item__qty">
            <button type="button" class="cart-qty-btn" data-cart-change="-1" data-product-id="${escapeHTML(product.id)}" aria-label="Quitar una unidad">-</button>
            <span>${qty}</span>
            <button type="button" class="cart-qty-btn" data-cart-change="1" data-product-id="${escapeHTML(product.id)}" aria-label="Agregar una unidad">+</button>
          </div>
          <button type="button" class="cart-item__remove" data-cart-remove="${escapeHTML(product.id)}">Quitar</button>
        </div>
      `;
      list.appendChild(card);
    });

    summary.textContent = formatCartQuantity(getCartItemCount());
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = '<i data-lucide="credit-card"></i> Solicitar carrito por WhatsApp';
    refreshIcons();
  }

  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const fab = document.getElementById('cart-fab');
    if (!drawer) return;
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
    const fab = document.getElementById('cart-fab');
    if (!drawer) return;
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
    if (drawer.classList.contains('is-open')) {
      closeCartDrawer();
    } else {
      openCartDrawer();
    }
  }

  function checkoutCart() {
    const items = getCartItems();
    if (!items.length) return;
    const message = buildCheckoutMessage(items);
    window.open(`https://wa.me/18297411041?text=${encodeURIComponent(message)}`, '_blank');
  }

  function bindCartUI() {
    loadCartState();
    updateCartIndicators();
    renderCartDrawer();

    const cartFab = document.getElementById('cart-fab');
    const cartLink = document.getElementById('product-cart-link');
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

  function getCurrentReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    if (window.FutunetProductDetail) {
      return window.FutunetProductDetail.getSafeReturnUrl(from);
    }
    return 'catalogo.html';
  }

  function updateSelectedQuantity(nextValue) {
    selectedQuantity = Math.max(1, nextValue);
    const valueEl = document.getElementById('product-detail-qty-value');
    if (valueEl) valueEl.textContent = selectedQuantity;
  }

  function getQuoteMessage(detail) {
    if (!detail) return '';

    if (detail.isService) {
      return [
        'Hola Futunet, me interesa este servicio:',
        detail.title,
        `Precio referencial: ${detail.price}`,
        '',
        'Quiero recibir mas detalles y una propuesta para mi caso.'
      ].join('\n');
    }

    return [
      'Hola Futunet, me interesa este producto:',
      detail.title,
      `Cantidad: ${selectedQuantity}`,
      `Precio referencial: ${detail.price}`,
      '',
      'Quiero confirmar disponibilidad y cotizacion.'
    ].join('\n');
  }

  function updateShareActions(detail) {
    const shareBtn = document.getElementById('product-share-btn');
    const copyBtn = document.getElementById('product-copy-link-btn');
    const whatsappShareBtn = document.getElementById('product-whatsapp-share-btn');
    const shareUrl = window.location.href;
    const shareText = `${detail.title} - ${detail.price}`;

    if (shareBtn) {
      shareBtn.onclick = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: detail.title,
              text: shareText,
              url: shareUrl
            });
            return;
          } catch (error) {
            if (error && error.name === 'AbortError') return;
          }
        }

        try {
          await navigator.clipboard.writeText(shareUrl);
          shareBtn.innerHTML = '<i data-lucide="check"></i> Enlace copiado';
          refreshIcons();
          window.setTimeout(() => {
            shareBtn.innerHTML = '<i data-lucide="share-2"></i> Compartir';
            refreshIcons();
          }, 1800);
        } catch (error) {
          window.open(shareUrl, '_blank');
        }
      };
    }

    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          copyBtn.innerHTML = '<i data-lucide="check"></i> Enlace copiado';
          refreshIcons();
          window.setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="link-2"></i> Copiar enlace';
            refreshIcons();
          }, 1800);
        } catch (error) {
          window.open(shareUrl, '_blank');
        }
      };
    }

    if (whatsappShareBtn) {
      whatsappShareBtn.href = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    }
  }

  function renderGallery(detail) {
    const mainImg = document.getElementById('product-detail-main-img');
    const thumbs = document.getElementById('product-detail-thumbs');
    if (!mainImg || !thumbs) return;

    const images = detail.gallery.length ? detail.gallery : [detail.img];
    mainImg.src = images[0] || 'img/placeholder.svg';
    mainImg.alt = detail.title;
    mainImg.onerror = function () {
      this.onerror = null;
      this.src = 'img/placeholder.svg';
    };

    thumbs.innerHTML = '';
    thumbs.hidden = images.length <= 1;

    images.forEach((url, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `product-detail-thumb${index === 0 ? ' is-active' : ''}`;
      button.setAttribute('aria-label', `Ver imagen ${index + 1} de ${detail.title}`);
      button.innerHTML = `<img src="${escapeHTML(url)}" alt="${escapeHTML(detail.title)}" loading="lazy" />`;
      button.addEventListener('click', () => {
        mainImg.src = url;
        mainImg.onerror = function () {
          this.onerror = null;
          this.src = 'img/placeholder.svg';
        };
        thumbs.querySelectorAll('.product-detail-thumb').forEach((thumb) => thumb.classList.remove('is-active'));
        button.classList.add('is-active');
      });
      thumbs.appendChild(button);
    });
  }

  function renderSpecs(detail) {
    const specsTableCard = document.getElementById('product-specs-table-card');
    const specsTableBody = document.getElementById('product-specs-table-body');
    const specsSupportTitle = document.getElementById('product-specs-support-title');
    const specsSupportList = document.getElementById('product-specs-support-list');
    const specsEmpty = document.getElementById('product-specs-empty');
    const specsTab = document.getElementById('product-tab-specs');

    if (!specsTableCard || !specsTableBody || !specsSupportList || !specsEmpty || !specsTab) return;

    specsTab.textContent = detail.specTabLabel;
    specsTableBody.innerHTML = '';
    specsSupportList.innerHTML = '';
    specsEmpty.hidden = true;
    specsSupportTitle.hidden = true;

    if (detail.showSpecsTable) {
      specsTableCard.hidden = false;
      detail.structuredSpecs.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<th scope="row">${escapeHTML(item.label)}</th><td>${escapeHTML(item.value)}</td>`;
        specsTableBody.appendChild(row);
      });
    } else {
      specsTableCard.hidden = true;
    }

    if (detail.supportSpecs.length) {
      if (detail.showSpecsTable) specsSupportTitle.hidden = false;
      detail.supportSpecs.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<i data-lucide="check-circle-2"></i><span>${escapeHTML(item)}</span>`;
        specsSupportList.appendChild(li);
      });
    }

    if (!detail.showSpecsTable && !detail.supportSpecs.length) {
      specsEmpty.hidden = false;
    }

    refreshIcons();
  }

  function bindTabs(detail) {
    const tabs = document.querySelectorAll('[data-detail-tab]');
    const panels = {
      specs: document.getElementById('product-panel-specs'),
      description: document.getElementById('product-panel-description')
    };
    const descriptionTab = document.getElementById('product-tab-description');

    if (descriptionTab) descriptionTab.textContent = detail.descriptionTabLabel;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.detailTab;
        tabs.forEach((item) => {
          const isActive = item === tab;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-selected', String(isActive));
        });

        Object.entries(panels).forEach(([key, panel]) => {
          if (!panel) return;
          panel.hidden = key !== target;
          panel.classList.toggle('is-active', key === target);
        });
      });
    });
  }

  function renderProductDetail(detail) {
    currentDetail = detail;
    selectedQuantity = 1;

    document.title = `${detail.title} | Futunet`;

    const returnUrl = getCurrentReturnUrl();
    const backButton = document.getElementById('product-back-btn');
    const breadcrumbReturn = document.getElementById('product-breadcrumb-return');
    const breadcrumbSection = document.getElementById('product-breadcrumb-section');
    const breadcrumbCurrent = document.getElementById('product-breadcrumb-current');

    if (backButton) {
      backButton.onclick = () => {
        if (document.referrer && document.referrer.startsWith(window.location.origin)) {
          window.history.back();
          return;
        }
        window.location.href = returnUrl;
      };
    }

    if (breadcrumbReturn) breadcrumbReturn.href = returnUrl;
    if (breadcrumbSection) breadcrumbSection.textContent = detail.category || detail.departmentLabel;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = detail.title;

    document.getElementById('product-detail-brand').textContent = detail.brand;
    document.getElementById('product-detail-availability').textContent = detail.availabilityLabel;
    document.getElementById('product-detail-availability').classList.toggle('modal-availability-pill--service', detail.isService);
    document.getElementById('product-detail-title').textContent = detail.title;
    document.getElementById('product-detail-meta').textContent = detail.isService
      ? `${detail.departmentLabel} · Servicio`
      : `${detail.brand} · ${detail.category}`;
    document.getElementById('product-detail-price').textContent = detail.price;
    document.getElementById('product-detail-summary').textContent = detail.summary;
    document.getElementById('product-detail-code').textContent = detail.productCode;
    document.getElementById('product-description-text').textContent = detail.description;

    renderGallery(detail);
    renderSpecs(detail);
    bindTabs(detail);
    updateSelectedQuantity(1);
    updateShareActions(detail);

    const qtyBox = document.getElementById('product-detail-qty-box');
    const primaryAction = document.getElementById('product-primary-action');
    const quoteAction = document.getElementById('product-quote-action');

    if (qtyBox) qtyBox.hidden = detail.isService;

    if (primaryAction) {
      primaryAction.innerHTML = detail.isService
        ? '<i data-lucide="message-circle"></i> Solicitar servicio'
        : '<i data-lucide="shopping-cart"></i> Agregar al carrito';
      primaryAction.onclick = () => {
        if (detail.isService) {
          window.open(`https://wa.me/18297411041?text=${encodeURIComponent(getQuoteMessage(detail))}`, '_blank');
          return;
        }
        addToCart(detail.id, selectedQuantity);
        openCartDrawer();
      };
    }

    if (quoteAction) {
      if (detail.isService) {
        quoteAction.hidden = true;
      } else {
        quoteAction.hidden = false;
        quoteAction.innerHTML = '<i data-lucide="message-circle"></i> Cotizar por WhatsApp';
        quoteAction.onclick = () => {
          window.open(`https://wa.me/18297411041?text=${encodeURIComponent(getQuoteMessage(detail))}`, '_blank');
        };
      }
    }

    refreshIcons();
  }

  function showEmptyState() {
    const detailShell = document.getElementById('product-detail-shell');
    const emptyState = document.getElementById('product-detail-empty');
    if (detailShell) detailShell.hidden = true;
    if (emptyState) emptyState.hidden = false;
  }

  function showDetailShell() {
    const detailShell = document.getElementById('product-detail-shell');
    const emptyState = document.getElementById('product-detail-empty');
    if (detailShell) detailShell.hidden = false;
    if (emptyState) emptyState.hidden = true;
  }

  function initQuantityControls() {
    document.addEventListener('click', (event) => {
      const qtyButton = event.target.closest('[data-product-qty]');
      if (!qtyButton) return;
      updateSelectedQuantity(selectedQuantity + Number(qtyButton.dataset.productQty || 0));
    });
  }

  function initProductPage() {
    if (!window.FutunetProductDetail) {
      showEmptyState();
      return;
    }

    bindCartUI();
    initQuantityControls();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
      showEmptyState();
      return;
    }

    const detail = window.FutunetProductDetail.getProductDetailData(productId);
    if (!detail) {
      showEmptyState();
      return;
    }

    showDetailShell();
    renderProductDetail(detail);
  }

  document.addEventListener('DOMContentLoaded', initProductPage);
})();
