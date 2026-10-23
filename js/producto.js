(function () {
  const CART_STORAGE_KEY = 'futunetCatalogCart';
  const cartState = { items: {} };
  let currentDetail = null;
  let selectedQuantity = 1;

  function escapeHTML(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function setMetaContent(selector, content) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', content);
  }

  function updateDocumentMetadata(detail) {
    const canonicalUrl = `https://futunet.com.do/producto.html?id=${encodeURIComponent(detail.id)}`;
    const description = (detail.summary || detail.description || `Consulta ${detail.title} en Futunet`).slice(0, 160);
    let imageUrl = 'https://futunet.com.do/img/logo.webp';
    try {
      imageUrl = new URL(detail.img || 'img/logo.webp', 'https://futunet.com.do/').href;
    } catch (e) {}
    const canonical = document.querySelector('link[rel="canonical"]');
    const robots = document.querySelector('meta[name="robots"]');

    document.title = `${detail.title} | Futunet`;
    if (canonical) canonical.href = canonicalUrl;
    if (robots) robots.content = 'index, follow, max-image-preview:large';
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:type"]', 'product');
    setMetaContent('meta[property="og:title"]', `${detail.title} | Futunet`);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:image"]', imageUrl);
    setMetaContent('meta[property="og:image:alt"]', detail.title);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', `${detail.title} | Futunet`);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[name="twitter:image"]', imageUrl);
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
    const parsed = parseInt(nextValue, 10);
    selectedQuantity = (!isNaN(parsed) && parsed >= 1) ? parsed : 1;
    const valueEl = document.getElementById('product-detail-qty-value');
    if (valueEl) valueEl.textContent = selectedQuantity;
    const minusBtn = document.querySelector('[data-product-qty="-1"]');
    if (minusBtn) {
      minusBtn.disabled = selectedQuantity <= 1;
      minusBtn.setAttribute('aria-disabled', String(selectedQuantity <= 1));
    }
  }

  function getQuoteMessage(detail) {
    if (!detail) return '';

    if (detail.isQuoteOnly) {
      return [
        'Hola Futunet, quiero consultar el precio y la disponibilidad de:',
        detail.title,
        '',
        'Favor compartirme la información actualizada de este producto.'
      ].join('\n');
    }

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

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      if (success) return Promise.resolve();
    } catch (e) {}
    try {
      window.prompt('Copia este enlace:', text);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return fallbackCopy(text);
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

  function updateShareActions(detail) {
    const shareBtn = document.getElementById('product-share-btn');
    const copyBtn = document.getElementById('product-copy-link-btn');
    const whatsappShareBtn = document.getElementById('product-whatsapp-share-btn');
    const shareUrl = window.location.href;
    const shareText = detail.isQuoteOnly ? detail.title : `${detail.title} - ${detail.price}`;

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
          await copyTextToClipboard(shareUrl);
          shareBtn.innerHTML = '<i data-lucide="check"></i> Enlace copiado';
          refreshIcons();
          window.setTimeout(() => {
            shareBtn.innerHTML = '<i data-lucide="share-2"></i> Compartir';
            refreshIcons();
          }, 1800);
        } catch (error) {}
      };
    }

    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await copyTextToClipboard(shareUrl);
          copyBtn.innerHTML = '<i data-lucide="check"></i> Enlace copiado';
          refreshIcons();
          window.setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="link-2"></i> Copiar enlace';
            refreshIcons();
          }, 1800);
        } catch (error) {}
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
    mainImg.style.objectPosition = (detail.product && detail.product.imagePosition) || '50% 50%';
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

    updateDocumentMetadata(detail);

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

    const setElemText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
    const brandEl = document.getElementById('product-detail-brand');
    if (brandEl) {
      brandEl.textContent = detail.brand || '';
      const brandKey = String(detail.brand || '').toLowerCase().trim();
      const slugMap = {
        'cisco': 'marca-cisco.html',
        'dahua': 'marca-dahua.html',
        'dell': 'marca-dell.html',
        'epson': 'marca-epson.html',
        'ezviz': 'marca-ezviz.html',
        'hikvision': 'marca-hikvision.html',
        'hp': 'marca-hp.html',
        'juniper': 'marca-juniper.html',
        'lenovo': 'marca-lenovo.html',
        'lg': 'marca-lg.html',
        'linksys': 'marca-linksys.html',
        'logitech': 'marca-logitech.html',
        'mikrotik': 'marca-mikrotik.html',
        'mitsubishi': 'marca-mitsubishi.html',
        'netgear': 'marca-netgear.html',
        'panasonic': 'marca-panasonic.html',
        'paradox': 'marca-paradox.html',
        'samsung': 'marca-samsung.html',
        'schneider electric': 'marca-schneiderelectric.html',
        'siemens': 'marca-siemens.html',
        'tesla': 'marca-tesla.html',
        'tp-link': 'marca-tp-link.html',
        'ubiquiti': 'marca-ubiquiti.html',
        'uniview': 'marca-uniview.html',
        'victron energy': 'marca-victronenergy.html',
        'zkteco': 'marca-zkteco.html'
      };
      if (slugMap[brandKey]) {
        brandEl.href = slugMap[brandKey];
      } else if (detail.brand && detail.brand !== 'SERVICIO' && detail.brand !== 'Genérico') {
        brandEl.href = `catalogo.html?q=${encodeURIComponent(detail.brand)}`;
      } else {
        brandEl.href = 'catalogo.html';
      }
    }
    const availEl = document.getElementById('product-detail-availability');
    if (availEl) {
      availEl.textContent = detail.availabilityLabel || '';
      availEl.classList.toggle('modal-availability-pill--service', !!detail.isService);
    }
    setElemText('product-detail-title', detail.title);
    setElemText('product-detail-meta', detail.isService
      ? `${detail.departmentLabel} · Servicio`
      : `${detail.brand} · ${detail.category}`);
    setElemText('product-detail-price', detail.price);
    setElemText('product-detail-summary', detail.summary);
    setElemText('product-detail-code', detail.productCode);
    setElemText('product-description-text', detail.description);

    function injectProductJsonLd(detail) {
      const existingScript = document.getElementById('product-jsonld');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = 'product-jsonld';
      script.type = 'application/ld+json';

      const priceVal = parseFloat(String(detail.price || '').replace(/[^0-9.-]+/g, '')) || 0;

      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": detail.title,
        "image": detail.gallery && detail.gallery.length ? detail.gallery : [detail.img],
        "description": detail.description || detail.summary,
        "sku": detail.productCode || detail.id,
        "brand": {
          "@type": "Brand",
          "name": detail.brand
        }
      };

      if (priceVal > 0) {
        schema.offers = {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "DOP",
          "price": priceVal,
          "priceValidUntil": new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
          "itemCondition": "https://schema.org/NewCondition",
          "availability": detail.isService
            ? "https://schema.org/InStock"
            : (detail.availabilityLabel === 'Agotado' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"),
          "seller": {
            "@type": "LocalBusiness",
            "name": "Futunet"
          }
        };
      }

      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    function renderRelatedProducts(detail) {
      const section = document.getElementById('product-related-section');
      const grid = document.getElementById('product-related-grid');
      if (!section || !grid) return;

      grid.innerHTML = '';
      const allProducts = window.FutunetProductDetail ? window.FutunetProductDetail.getCatalogData() : [];
      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        section.hidden = true;
        return;
      }

      const currentId = String(detail.id || '');
      const currentBrand = String(detail.brand || '').toLowerCase().trim();
      const currentCategory = String(detail.category || '').toLowerCase().trim();
      const currentDept = String(detail.department || '').toLowerCase().trim();

      const candidates = [];
      allProducts.forEach((item) => {
        if (!item || !item.id || item.id === currentId) return;
        const b = String(item.brand || '').toLowerCase().trim();
        const c = String(item.category || '').toLowerCase().trim();
        const d = String(item.department || '').toLowerCase().trim();

        let score = 0;
        if (currentBrand && b === currentBrand && currentCategory && c === currentCategory) {
          score = 40;
        } else if (currentBrand && b === currentBrand) {
          score = 25;
        } else if (currentCategory && c === currentCategory) {
          score = 20;
        } else if (currentDept && d === currentDept) {
          score = 10;
        }

        if (score > 0) {
          candidates.push({ item, score });
        }
      });

      candidates.sort((a, b) => b.score - a.score);
      const topItems = candidates.slice(0, 4).map(c => c.item);

      if (topItems.length === 0) {
        section.hidden = true;
        return;
      }

      topItems.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-related-card';
        const detailUrl = window.FutunetProductDetail
          ? window.FutunetProductDetail.buildProductDetailUrl(product.id, window.location.href)
          : `producto.html?id=${encodeURIComponent(product.id)}`;
        const safeTitle = escapeHTML(product.title || 'Producto');
        const safeBrand = escapeHTML(product.brand || 'Futunet');
        const safePrice = escapeHTML(product.price || 'Cotizar');
        const safeImg = escapeHTML(product.img || 'img/placeholder.svg');

        card.innerHTML = `
          <a href="${escapeHTML(detailUrl)}" class="product-related-img-wrap" aria-label="${safeTitle}">
            <img src="${safeImg}" alt="${safeTitle}" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.svg';" />
          </a>
          <div class="product-related-content">
            <span class="product-badge">${safeBrand}</span>
            <h3 class="product-related-card-title">
              <a href="${escapeHTML(detailUrl)}">${safeTitle}</a>
            </h3>
            <div class="product-related-card-price">${safePrice}</div>
            <a href="${escapeHTML(detailUrl)}" class="product-related-action-btn">
              <span>Ver detalle</span>
              <i data-lucide="arrow-right"></i>
            </a>
          </div>
        `;
        grid.appendChild(card);
      });

      section.hidden = false;
      refreshIcons();
    }

    renderGallery(detail);
    renderSpecs(detail);
    bindTabs(detail);
    updateSelectedQuantity(1);
    updateShareActions(detail);
    injectProductJsonLd(detail);
    renderRelatedProducts(detail);

    const qtyBox = document.getElementById('product-detail-qty-box');
    const primaryAction = document.getElementById('product-primary-action');
    const quoteAction = document.getElementById('product-quote-action');

    if (qtyBox) qtyBox.hidden = detail.requiresQuote;

    if (primaryAction) {
      primaryAction.innerHTML = detail.requiresQuote
        ? `<i data-lucide="message-circle"></i> ${detail.isQuoteOnly ? 'Consultar precio' : 'Solicitar cotización'}`
        : '<i data-lucide="shopping-cart"></i> Agregar al carrito';
      primaryAction.onclick = () => {
        const phone = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
        if (detail.requiresQuote) {
          const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(getQuoteMessage(detail))}`;
          safeOpenWhatsApp(waUrl);
          return;
        }
        if (window.FutunetCart) {
          window.FutunetCart.add(detail.id, selectedQuantity);
          window.FutunetCart.openDrawer();
        } else if (typeof window.showToast === 'function') {
          window.showToast('Cargando carrito de compras...', 'info');
        }
      };
    }

    if (quoteAction) {
      if (detail.requiresQuote) {
        quoteAction.hidden = true;
      } else {
        quoteAction.hidden = false;
        quoteAction.innerHTML = '<i data-lucide="message-circle"></i> Cotizar por WhatsApp';
        quoteAction.onclick = () => {
          const phone = typeof FUTUNET_CONFIG !== 'undefined' ? FUTUNET_CONFIG.WHATSAPP_NUMBER : '18297411041';
          const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(getQuoteMessage(detail))}`;
          safeOpenWhatsApp(waUrl);
        };
      }
    }

    const aiAdvisorBtn = document.getElementById('product-ai-advisor-btn');
    if (aiAdvisorBtn) {
      aiAdvisorBtn.onclick = () => {
        if (window.FutunetAI) {
          window.FutunetAI.askProduct({
            id: detail.id,
            title: detail.title,
            price: detail.price,
            brand: detail.brand,
            category: detail.category,
            img: detail.img
          });
        }
      };
    }

    refreshIcons();
  }

  function showEmptyState() {
    const detailShell = document.getElementById('product-detail-shell');
    const emptyState = document.getElementById('product-detail-empty');
    const relSection = document.getElementById('product-related-section');
    if (detailShell) detailShell.hidden = true;
    if (emptyState) emptyState.hidden = false;
    if (relSection) relSection.hidden = true;
    document.title = 'Producto no encontrado | Futunet';
    const robots = document.querySelector('meta[name="robots"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (robots) robots.content = 'noindex, follow';
    if (canonical) canonical.href = 'https://futunet.com.do/producto.html';
    const jsonLd = document.getElementById('product-jsonld');
    if (jsonLd) jsonLd.remove();
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

  async function initProductPageLoader() {
    try {
      if (window.FutunetData && window.FutunetData.readyPromise) {
        await window.FutunetData.readyPromise;
      }
    } catch (err) {
      console.warn('initProductPageLoader: Fallo al esperar readyPromise, continuando con inventario local.', err);
    }
    initProductPage();
  }

  // Sincronización reactiva si el catálogo en la nube se rehidrata posteriormente
  window.addEventListener('futunet:inventory-ready', () => {
    if (!currentDetail) {
      initProductPage();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPageLoader);
  } else {
    initProductPageLoader();
  }
})();
