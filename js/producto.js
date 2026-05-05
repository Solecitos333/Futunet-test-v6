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
        const phone = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
        if (detail.isService) {
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(getQuoteMessage(detail))}`, '_blank');
          return;
        }
        if (window.FutunetCart) {
          window.FutunetCart.add(detail.id, selectedQuantity);
          window.FutunetCart.openDrawer();
        }
      };
    }

    if (quoteAction) {
      if (detail.isService) {
        quoteAction.hidden = true;
      } else {
        quoteAction.hidden = false;
        quoteAction.innerHTML = '<i data-lucide="message-circle"></i> Cotizar por WhatsApp';
        quoteAction.onclick = () => {
          const phone = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(getQuoteMessage(detail))}`, '_blank');
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
