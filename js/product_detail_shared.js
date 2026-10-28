(function () {
  const DEPARTMENT_LABELS = {
    all: 'Catálogo',
    seguridad: 'Cámaras y Seguridad',
    redes: 'Internet y Redes',
    energia: 'Energía y Climatización',
    equipos: 'Computadoras y Tecnología',
    oficina: 'Oficina y Papelería',
    infra: 'Remodelación de Oficina'
  };

  const SPEC_PREFIX_PATTERNS = [
    { label: 'Modelo', pattern: /^(?:modelo)\s*:?\s*(.+)$/i },
    { label: 'Procesador', pattern: /^(?:procesador)\s*:?\s*(.+)$/i },
    { label: 'Memoria RAM', pattern: /^(?:memoria ram|ram)\s*:?\s*(.+)$/i },
    { label: 'Almacenamiento', pattern: /^(?:almacenamiento|ssd|disco duro|capacidad)\s*:?\s*(.+)$/i },
    { label: 'Pantalla', pattern: /^(?:pantalla)\s*:?\s*(.+)$/i },
    { label: 'Resolucion', pattern: /^(?:resolucion)\s*:?\s*(.+)$/i },
    { label: 'Puertos', pattern: /^(?:puertos?)\s*:?\s*(.+)$/i },
    { label: 'Tamano', pattern: /^(?:tamano)\s*:?\s*(.+)$/i },
    { label: 'Garantia', pattern: /^(?:garantia)\s*:?\s*(.+)$/i },
    { label: 'Color', pattern: /^(?:color)\s*:?\s*(.+)$/i },
    { label: 'Conectividad', pattern: /^(?:conectividad)\s*:?\s*(.+)$/i },
    { label: 'Compatibilidad', pattern: /^(?:compatible con|compatibilidad)\s*:?\s*(.+)$/i },
    { label: 'Formato', pattern: /^(?:formato)\s*:?\s*(.+)$/i },
    { label: 'Tipo', pattern: /^(?:tipo|tipos)\s*:?\s*(.+)$/i },
    { label: 'Condicion', pattern: /^(?:equipo usado)\s*(.+)$/i },
    { label: 'Uso recomendado', pattern: /^(?:ideal para|disenado para)\s*(.+)$/i }
  ];

  function normalizeCopy(value) {
    return String(value || '')
      .replace(/ÃƒÆ’Ã‚Â¡/g, 'a')
      .replace(/ÃƒÆ’Ã‚Â©/g, 'e')
      .replace(/ÃƒÆ’Ã‚Â­/g, 'i')
      .replace(/ÃƒÆ’Ã‚Â³/g, 'o')
      .replace(/ÃƒÆ’Ã‚Âº/g, 'u')
      .replace(/ÃƒÆ’Ã‚Â±/g, 'n')
      .replace(/ÃƒÆ’Ã‚Â /g, 'A')
      .replace(/ÃƒÆ’Ã¢â‚¬Â°/g, 'E')
      .replace(/ÃƒÆ’Ã‚Â /g, 'I')
      .replace(/ÃƒÆ’Ã¢â‚¬Å“/g, 'O')
      .replace(/ÃƒÆ’Ã…¡/g, 'U')
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â /g, '-')
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â /g, '-')
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â /g, '"')
      .replace(/Ã£â‚¬Â |Ã£â‚¬â€˜/g, '')
      .replace(/Ãƒâ€š/g, '')
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã /g, 'Á')
      .replace(/Ã‰/g, 'É')
      .replace(/Ã /g, 'Í')
      .replace(/Ã“/g, 'Ó')
      .replace(/Ãš/g, 'Ú')
      .replace(/â€“/g, '–')
      .replace(/â€”/g, '—')
      .replace(/â€œ/g, '“')
      .replace(/â€ /g, '”')
      .replace(/Â/g, '')
      .trim();
  }

  function dedupe(values) {
    const seen = new Set();
    return values.filter((value) => {
      const key = normalizeCopy(value).toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getCatalogData() {
    if (typeof window !== 'undefined' && window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      const merged = window.supplierInventory.getMergedCatalog();
      if (Array.isArray(merged) && merged.length > 0) return merged;
    }

    if (typeof window.mockDatabase !== 'undefined' && Array.isArray(window.mockDatabase) && window.mockDatabase.length > 0) {
      return window.mockDatabase;
    }

    if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase) && mockDatabase.length > 0) {
      return mockDatabase;
    }

    if (typeof window.backupDatabase !== 'undefined' && Array.isArray(window.backupDatabase) && window.backupDatabase.length > 0) {
      return window.backupDatabase;
    }

    if (typeof window !== 'undefined' && window.FutunetData && Array.isArray(window.FutunetData.products) && window.FutunetData.products.length > 0) {
      return window.FutunetData.products;
    }

    if (typeof window.mockDatabase !== 'undefined' && Array.isArray(window.mockDatabase)) {
      return window.mockDatabase;
    }

    return [];
  }

  function getDepartmentLabel(dept) {
    return DEPARTMENT_LABELS[String(dept || '').toLowerCase()] || 'Catalogo';
  }

  function isServiceItem(product) {
    return Boolean(product) && (
      String(product.brand || '').toLowerCase() === 'servicios' ||
      String(product.category || '').toLowerCase() === 'servicios'
    );
  }

  function isQuoteOnlyProduct(product) {
    if (!product || isServiceItem(product)) return false;
    const priceStr = normalizeCopy(product.price).toLowerCase();
    if (priceStr.includes('cotiz') || priceStr.includes('consultar')) return true;
    const category = normalizeCopy(product.category).toLowerCase();
    return category === 'computadoras' ||
      category === 'laptops' ||
      category === 'mobiliario' ||
      String(product.id || '').startsWith('mob_oficina_') ||
      String(product.id || '').startsWith('laptop_selektronic_');
  }

  function findProductById(productId) {
    return getCatalogData().find((item) => item.id === productId) || null;
  }

  function buildProductDetailUrl(productId, fromUrl) {
    const params = new URLSearchParams();
    params.set('id', productId);
    if (fromUrl) params.set('from', fromUrl);
    return `producto.html?${params.toString()}`;
  }

  function getSafeReturnUrl(candidate) {
    if (!candidate) return 'catalogo.html';
    let decoded = normalizeCopy(candidate).trim();
    try {
      if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
        const parsed = new URL(decoded);
        if (typeof window !== 'undefined' && window.location && parsed.origin === window.location.origin) {
          decoded = parsed.pathname.replace(/^\/+/, '') + parsed.search + parsed.hash;
        } else {
          return 'catalogo.html';
        }
      }
    } catch (_) {
      return 'catalogo.html';
    }
    decoded = decoded.replace(/^\/+/, '');
    if (/^[a-z0-9_-]+(?:\.html)?(?:[?#][a-zA-Z0-9_\-=&%#.]*)?$/i.test(decoded)) {
      return decoded;
    }
    return 'catalogo.html';
  }

  function getProductCode(product) {
    const explicitCode = normalizeCopy(product?.sku || product?.code || '');
    if (explicitCode && explicitCode.toUpperCase() !== 'FT-SUPPLIER') return explicitCode.toUpperCase();

    const raw = String(product?.id || 'item');
    let hash = 2166136261;
    for (let index = 0; index < raw.length; index += 1) {
      hash ^= raw.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `FT-${(hash >>> 0).toString(36).toUpperCase().padStart(7, '0')}`;
  }

  function toSentenceCase(label) {
    const clean = normalizeCopy(label)
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return '';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  function parseSpecLine(line) {
    const text = normalizeCopy(line);
    if (!text) return null;

    const colonMatch = text.match(/^([^:]{2,40}):\s*(.+)$/);
    if (colonMatch) {
      return {
        label: toSentenceCase(colonMatch[1]),
        value: normalizeCopy(colonMatch[2])
      };
    }

    for (const rule of SPEC_PREFIX_PATTERNS) {
      const match = text.match(rule.pattern);
      if (match) {
        const value = normalizeCopy(match[1] || '');
        if (!value) return null;
        return { label: rule.label, value };
      }
    }

    return null;
  }

  function buildSpecsModel(product, override) {
    const originalSpecs = Array.isArray(product.specs)
      ? product.specs.map(normalizeCopy).filter(Boolean)
      : [];

    const structuredMap = new Map();
    const supportSpecs = [];

    originalSpecs.forEach((spec) => {
      const parsed = parseSpecLine(spec);
      if (parsed) {
        structuredMap.set(parsed.label.toLowerCase(), parsed);
      } else {
        supportSpecs.push(spec);
      }
    });

    if (Array.isArray(override.structuredSpecs)) {
      override.structuredSpecs.forEach((item) => {
        if (!item || !item.label || !item.value) return;
        const parsed = {
          label: toSentenceCase(item.label),
          value: normalizeCopy(item.value)
        };
        structuredMap.set(parsed.label.toLowerCase(), parsed);
      });
    }

    const structuredSpecs = Array.from(structuredMap.values());
    const showTable = structuredSpecs.length >= 2;

    const supportFromOverride = Array.isArray(override.supportSpecs)
      ? override.supportSpecs.map(normalizeCopy).filter(Boolean)
      : [];

    const finalSupportSpecs = showTable
      ? dedupe([...supportFromOverride, ...supportSpecs])
      : dedupe([...supportFromOverride, ...originalSpecs]);

    return {
      showTable,
      structuredSpecs,
      supportSpecs: finalSupportSpecs
    };
  }

  function getProductDetailData(productOrId) {
    const product = typeof productOrId === 'string'
      ? findProductById(productOrId)
      : productOrId;

    if (!product) return null;

    const override = ((typeof window !== 'undefined' && window.FutunetProductOverrides) || (typeof globalThis !== 'undefined' && globalThis.FutunetProductOverrides) || {})[product.id] || {};
    const serviceItem = isServiceItem(product);
    const quoteOnlyProduct = isQuoteOnlyProduct(product);
    const gallery = dedupe(
      [product.img].concat(Array.isArray(product.gallery) ? product.gallery : [])
        .map(normalizeCopy)
        .filter(Boolean)
    );
    const specsModel = buildSpecsModel(product, override);
    const description = normalizeCopy(product.desc);
    const priceValue = quoteOnlyProduct
      ? 0
      : Number.parseFloat(String(product.price || '').replace(/[^0-9.-]+/g, '')) || 0;

    return {
      id: product.id,
      product,
      isService: serviceItem,
      isQuoteOnly: quoteOnlyProduct,
      brand: normalizeCopy(serviceItem ? 'SERVICIO' : product.brand),
      category: normalizeCopy(product.category),
      department: String(product.department || '').toLowerCase(),
      departmentLabel: getDepartmentLabel(product.department),
      title: normalizeCopy(product.title),
      description,
      summary: normalizeCopy(override.summary || description),
      price: quoteOnlyProduct ? 'Consultar precio' : normalizeCopy(product.price || 'Cotizar'),
      priceValue,
      requiresQuote: serviceItem || quoteOnlyProduct || priceValue <= 0,
      img: normalizeCopy(product.img),
      gallery,
      availabilityLabel: serviceItem ? 'A medida' : quoteOnlyProduct ? 'Sujeto a disponibilidad' : 'Disponible',
      productCode: getProductCode(product),
      specTabLabel: normalizeCopy(override.specTabLabel || (serviceItem ? 'Alcance' : 'Especificaciones')),
      descriptionTabLabel: 'Descripción',
      primaryActionLabel: quoteOnlyProduct ? 'Consultar precio' : serviceItem || priceValue <= 0 ? 'Solicitar cotización' : 'Agregar al carrito',
      quoteActionLabel: serviceItem ? 'Solicitar por WhatsApp' : 'Cotizar por WhatsApp',
      detailActionLabel: serviceItem ? 'Ver detalle del servicio' : 'Ver ficha completa',
      showSpecsTable: specsModel.showTable,
      structuredSpecs: specsModel.structuredSpecs,
      supportSpecs: specsModel.supportSpecs
    };
  }

  const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
  root.FutunetProductDetail = {
    normalizeCopy,
    getCatalogData,
    getDepartmentLabel,
    isServiceItem,
    isQuoteOnlyProduct,
    findProductById,
    buildProductDetailUrl,
    getSafeReturnUrl,
    getProductDetailData
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.FutunetProductDetail;
  }
})();

