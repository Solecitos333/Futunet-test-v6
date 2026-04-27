(function () {
  const DEPARTMENT_LABELS = {
    all: 'Catalogo',
    seguridad: 'Seguridad electronica',
    redes: 'Redes y datos',
    energia: 'Energia y climatizacion',
    equipos: 'Computacion',
    oficina: 'Papeleria y mobiliario',
    infra: 'Infraestructura'
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
      .replace(/ÃƒÆ’Ã‚¡/g, 'a')
      .replace(/ÃƒÆ’Ã‚Â©/g, 'e')
      .replace(/ÃƒÆ’Ã‚Â­/g, 'i')
      .replace(/ÃƒÆ’Ã‚Â³/g, 'o')
      .replace(/ÃƒÆ’Ã‚Âº/g, 'u')
      .replace(/ÃƒÆ’Ã‚Â±/g, 'n')
      .replace(/ÃƒÆ’Ã‚Â/g, 'A')
      .replace(/ÃƒÆ’Ã¢â‚¬Â°/g, 'E')
      .replace(/ÃƒÆ’Ã‚Â/g, 'I')
      .replace(/ÃƒÆ’Ã¢â‚¬Å“/g, 'O')
      .replace(/ÃƒÆ’Ã…¡/g, 'U')
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“/g, '-')
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â/g, '-')
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â/g, '"')
      .replace(/Ã£â‚¬Â|Ã£â‚¬â€˜/g, '')
      .replace(/Ãƒâ€š/g, '')
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
    if (window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      return window.supplierInventory.getMergedCatalog();
    }

    if (typeof window.mockDatabase !== 'undefined' && Array.isArray(window.mockDatabase)) {
      return window.mockDatabase;
    }

    if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
      return mockDatabase;
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
    const decoded = normalizeCopy(candidate);
    if (/^catalogo\.html(?:[?#].*)?$/i.test(decoded)) {
      return decoded;
    }
    return 'catalogo.html';
  }

  function getProductCode(productId) {
    const raw = String(productId || '').replace(/^prod_/, '').toUpperCase();
    return raw ? `FT-${raw.slice(0, 8)}` : 'FT-ITEM';
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

    const override = (window.FutunetProductOverrides && window.FutunetProductOverrides[product.id]) || {};
    const serviceItem = isServiceItem(product);
    const gallery = dedupe(
      [product.img].concat(Array.isArray(product.gallery) ? product.gallery : [])
        .map(normalizeCopy)
        .filter(Boolean)
    );
    const specsModel = buildSpecsModel(product, override);
    const description = normalizeCopy(product.desc);

    return {
      id: product.id,
      product,
      isService: serviceItem,
      brand: normalizeCopy(serviceItem ? 'SERVICIO' : product.brand),
      category: normalizeCopy(product.category),
      department: String(product.department || '').toLowerCase(),
      departmentLabel: getDepartmentLabel(product.department),
      title: normalizeCopy(product.title),
      description,
      summary: normalizeCopy(override.summary || description),
      price: normalizeCopy(product.price || 'Cotizar'),
      img: normalizeCopy(product.img),
      gallery,
      availabilityLabel: serviceItem ? 'A medida' : 'Disponible',
      productCode: getProductCode(product.id),
      specTabLabel: normalizeCopy(override.specTabLabel || (serviceItem ? 'Alcance' : 'Especificaciones')),
      descriptionTabLabel: 'Descripcion',
      primaryActionLabel: serviceItem ? 'Solicitar servicio' : 'Agregar al carrito',
      quoteActionLabel: serviceItem ? 'Solicitar por WhatsApp' : 'Cotizar por WhatsApp',
      detailActionLabel: serviceItem ? 'Ver detalle del servicio' : 'Ver ficha completa',
      showSpecsTable: specsModel.showTable,
      structuredSpecs: specsModel.structuredSpecs,
      supportSpecs: specsModel.supportSpecs
    };
  }

  window.FutunetProductDetail = {
    normalizeCopy,
    getCatalogData,
    getDepartmentLabel,
    isServiceItem,
    findProductById,
    buildProductDetailUrl,
    getSafeReturnUrl,
    getProductDetailData
  };
})();

