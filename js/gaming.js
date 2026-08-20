/**
 * FUTUNET - ZONA GAMING INTERACTIVE LOGIC (gaming.js)
 */

(function () {
  'use strict';

  var gamingState = {
    products: [],
    filteredProducts: [],
    activeCategory: 'all',
    searchQuery: '',
    sortOrder: 'featured'
  };

  // Fallback gaming catalogue in case of network latency
  var FALLBACK_GAMING_PRODUCTS = [
    {
      id: 'gm_laptop_asus_tuf_f15',
      title: 'Laptop Gamer ASUS TUF Gaming F15 Core i7 13va Gen 16GB RTX 4060 144Hz',
      brand: 'ASUS',
      category: 'Laptops Gamer',
      price: 'RD$ 68,900.00',
      img: 'https://wsrv.nl/?url=dlcdnwebimgs.asus.com/gain/497e685f-eb5e-49b0-9a3b-2ea3954f9a0c/w800&w=720&output=webp&q=75',
      specs: ['Intel Core i7-13620H', '16GB DDR5', '512GB SSD NVMe', 'RTX 4060 8GB GDDR6', '15.6" 144Hz FHD']
    },
    {
      id: 'gm_laptop_lenovo_legion_5',
      title: 'Laptop Gamer Lenovo Legion Pro 5 Ryzen 7 16GB 1TB RTX 4070 165Hz WQXGA',
      brand: 'LENOVO',
      category: 'Laptops Gamer',
      price: 'RD$ 89,500.00',
      img: 'https://wsrv.nl/?url=p3-ofp.static.pub//fes/cms/2024/02/20/dckq1kdr1u66v6q569u1n29q7p12u3175815.png&w=720&output=webp&q=75',
      specs: ['AMD Ryzen 7 7735H', '16GB DDR5', '1TB SSD NVMe', 'RTX 4070 8GB', '16" 165Hz 2K']
    },
    {
      id: 'gm_pc_starter_ryzen5',
      title: 'PC Gamer Futunet Starter Edition Ryzen 5 5600GT 16GB RGB 500GB SSD 550W',
      brand: 'FUTUNET GAMING',
      category: 'PCs Gamer',
      price: 'RD$ 28,900.00',
      img: 'https://wsrv.nl/?url=c1.neweggimages.com/ProductImageCompressAll1280/83-360-525-01.jpg&w=720&output=webp&q=75',
      specs: ['AMD Ryzen 5 5600GT', '16GB RAM RGB', '500GB SSD NVMe', 'Case Cristal 4 Fans RGB', 'Fuente 550W 80+']
    },
    {
      id: 'gm_pc_esports_rtx4060',
      title: 'PC Gamer Futunet Esports Pro Core i5 13400F 16GB DDR5 1TB RTX 4060 8GB',
      brand: 'FUTUNET GAMING',
      category: 'PCs Gamer',
      price: 'RD$ 58,400.00',
      img: 'https://wsrv.nl/?url=c1.neweggimages.com/ProductImageCompressAll1280/83-360-534-01.jpg&w=720&output=webp&q=75',
      specs: ['Intel Core i5-13400F', '16GB DDR5', '1TB SSD Gen4', 'RTX 4060 8GB OC', 'Fuente 650W Bronze']
    },
    {
      id: 'gm_pc_streamer_ultra_rtx4070ti',
      title: 'PC Gamer Futunet Streamer Ultra Ryzen 7 7800X3D 32GB DDR5 1TB RTX 4070 Ti Super',
      brand: 'FUTUNET GAMING',
      category: 'PCs Gamer',
      price: 'RD$ 119,000.00',
      img: 'https://wsrv.nl/?url=c1.neweggimages.com/ProductImageCompressAll1280/83-360-536-01.jpg&w=720&output=webp&q=75',
      specs: ['AMD Ryzen 7 7800X3D', 'Líquida AIO 240mm', '32GB DDR5 6000MHz', 'RTX 4070 Ti SUPER 16GB', 'Fuente 750W Gold']
    },
    {
      id: 'gm_gpu_asus_rtx4060',
      title: 'Tarjeta Gráfica ASUS Dual GeForce RTX 4060 EVO OC Edition 8GB GDDR6',
      brand: 'ASUS',
      category: 'Componentes Gaming',
      price: 'RD$ 26,500.00',
      img: 'https://wsrv.nl/?url=dlcdnwebimgs.asus.com/gain/3bf441ad-ae52-4752-bf62-31e97dc2b406/w800&w=720&output=webp&q=75',
      specs: ['8GB GDDR6 128-bit', 'DLSS 3 & Ray Tracing', 'Dual Fan 0dB Tech', 'HDMI 2.1a + 3x DP 1.4a']
    },
    {
      id: 'gm_monitor_asus_tuf_165hz',
      title: 'Monitor Gamer ASUS TUF Gaming 24" VG249Q1A IPS Full HD 165Hz 1ms',
      brand: 'ASUS',
      category: 'Monitores Gaming',
      price: 'RD$ 13,900.00',
      img: 'https://wsrv.nl/?url=dlcdnwebimgs.asus.com/gain/28b8cf4f-4d2b-426c-941a-68a83eeecae2/w800&w=720&output=webp&q=75',
      specs: ['23.8" IPS Full HD', '165Hz Refresh Rate', '1ms MPRT ELMB', 'FreeSync Premium']
    },
    {
      id: 'gm_monitor_samsung_odyssey_g4_240hz',
      title: 'Monitor Gamer Samsung Odyssey G4 27" IPS FHD 240Hz 1ms G-Sync Pivot',
      brand: 'SAMSUNG',
      category: 'Monitores Gaming',
      price: 'RD$ 21,500.00',
      img: 'https://wsrv.nl/?url=images.samsung.com/is/image/samsung/p6pim/latin/ls27bg400elxzl/gallery/latin-odyssey-g4-g40b-432822-ls27bg400elxzl-533471018?$720_576_PNG$&w=720&output=webp&q=75',
      specs: ['27" IPS Full HD', '240Hz Ultra Fast', '1ms GtG Response', 'G-Sync + FreeSync', 'Base Ergonomica Pivot']
    },
    {
      id: 'gm_teclado_redragon_kumara',
      title: 'Teclado Mecánico Redragon Kumara K552 RGB Switches Red/Blue Español',
      brand: 'REDRAGON',
      category: 'Periféricos Gaming',
      price: 'RD$ 2,650.00',
      img: 'https://wsrv.nl/?url=redragon.es/content/uploads/2021/04/KUMARA-K552-RGB-1.png&w=720&output=webp&q=75',
      specs: ['Formato Compacto TKL', 'Switches Mecanicos Hot-Swap', 'RGB Chroma Configurable', 'Layout Español']
    },
    {
      id: 'gm_mouse_logitech_g502_hero',
      title: 'Mouse Gamer Logitech G502 HERO 25K DPI RGB con Pesas Ajustables',
      brand: 'LOGITECH',
      category: 'Periféricos Gaming',
      price: 'RD$ 3,450.00',
      img: 'https://wsrv.nl/?url=resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png?v=1&w=720&output=webp&q=75',
      specs: ['Sensor HERO 25,600 DPI', '11 Botones Programables', '5 Pesas de 3.6g extraibles', 'RGB LIGHTSYNC']
    },
    {
      id: 'gm_headset_hyperx_cloud2',
      title: 'Headset Gamer HyperX Cloud II Sonido Envolvente 7.1 Almohadillas Memory Foam',
      brand: 'HYPERX',
      category: 'Periféricos Gaming',
      price: 'RD$ 5,400.00',
      img: 'https://wsrv.nl/?url=hyperx.com/cdn/shop/products/hyperx_cloud_ii_red_1_main.jpg?v=1661434316&w=720&output=webp&q=75',
      specs: ['Drivers de 53mm', 'Audio 7.1 Surround DSP', 'Almohadillas Memory Foam', 'Microfono Cancelacion Ruido']
    },
    {
      id: 'gm_fibra_gamer_200mb',
      title: 'Plan Internet Fibra Gamer Futunet 200 Mbps Simétricos Low Ping',
      brand: 'FUTUNET FIBRA',
      category: 'Internet Gamer',
      price: 'RD$ 2,495.00 / mes',
      img: 'img/productos/tp-link-deco-x50.webp',
      specs: ['200 Mbps Descarga + 200 Mbps Subida', 'Rutas BGP Low Ping (<25ms)', 'Router Wi-Fi 6 Gigabit', 'Soporte VIP 24/7']
    }
  ];

  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    var clean = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  }

  function formatDOP(num) {
    return 'RD$ ' + Number(num).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function estimateInstallment(priceStr) {
    if (String(priceStr).includes('/ mes')) return 'Plan mensual recurrente';
    var price = parsePrice(priceStr);
    if (price <= 0) return 'Consulta financiamiento';
    // Estimated 18 months installment calculation (approx with nominal interest)
    var monthly = Math.round((price * 1.18) / 18);
    return 'o desde ' + formatDOP(monthly) + ' / mes (hasta 18 cuotas)';
  }

  function initGamingCatalog() {
    var rawProducts = [];

    // Check if supplierFeeds or FutunetData is loaded
    if (window.FutunetData && Array.isArray(window.FutunetData.products) && window.FutunetData.products.length > 0) {
      rawProducts = window.FutunetData.products.filter(function (p) {
        var txt = (p.title + ' ' + (p.category || '') + ' ' + (p.department || '')).toLowerCase();
        return txt.includes('gamer') || txt.includes('gaming') || txt.includes('rtx') || txt.includes('ryzen') || p.supplier === 'gaming';
      });
    }

    if (rawProducts.length === 0) {
      rawProducts = FALLBACK_GAMING_PRODUCTS;
    }

    gamingState.products = rawProducts;
    applyFilters();
    setupEventListeners();
  }

  function applyFilters() {
    var list = gamingState.products.slice();

    // 1. Category Filter
    if (gamingState.activeCategory !== 'all') {
      list = list.filter(function (p) {
        var cat = (p.category || '').toLowerCase();
        var filter = gamingState.activeCategory.toLowerCase();
        return cat.includes(filter) || filter.includes(cat);
      });
    }

    // 2. Search Query
    if (gamingState.searchQuery) {
      var q = gamingState.searchQuery.toLowerCase().trim();
      list = list.filter(function (p) {
        var searchTarget = (p.title + ' ' + p.brand + ' ' + (p.category || '') + ' ' + (p.specs ? p.specs.join(' ') : '')).toLowerCase();
        return searchTarget.includes(q);
      });
    }

    // 3. Sorting
    if (gamingState.sortOrder === 'price-asc') {
      list.sort(function (a, b) { return parsePrice(a.price) - parsePrice(b.price); });
    } else if (gamingState.sortOrder === 'price-desc') {
      list.sort(function (a, b) { return parsePrice(b.price) - parsePrice(a.price); });
    } else if (gamingState.sortOrder === 'name-asc') {
      list.sort(function (a, b) { return (a.title || '').localeCompare(b.title || ''); });
    }

    gamingState.filteredProducts = list;
    renderProducts();
  }

  function renderProducts() {
    var grid = document.getElementById('gaming-products-grid');
    var empty = document.getElementById('gaming-empty-state');
    if (!grid) return;

    if (gamingState.filteredProducts.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';

    grid.innerHTML = gamingState.filteredProducts.map(function (p) {
      var isLease = String(p.price).includes('/ mes');
      var installmentText = estimateInstallment(p.price);
      var specsHtml = '';
      if (Array.isArray(p.specs) && p.specs.length > 0) {
        specsHtml = p.specs.slice(0, 3).map(function (s) {
          return '<span class="spec-chip">' + escapeHTML(s) + '</span>';
        }).join('');
      }

      var escapedTitle = escapeHTML(p.title);
      var escapedId = escapeHTML(p.id);

      return [
        '<div class="gaming-card" data-id="' + escapedId + '">',
        '  <div class="gaming-card-top">',
        '    <span class="card-tag-badge">' + escapeHTML(p.category || 'Gaming') + '</span>',
        '    <img src="' + escapeHTML(p.img || 'img/laptops.jpg') + '" alt="' + escapedTitle + '" loading="lazy" />',
        '  </div>',
        '  <div class="gaming-card-body">',
        '    <div class="card-brand">' + escapeHTML(p.brand || 'Futunet') + '</div>',
        '    <h3 class="card-title" title="' + escapedTitle + '">' + escapedTitle + '</h3>',
        '    <div class="card-specs-summary">' + specsHtml + '</div>',
        '    <div class="card-price-container">',
        '      <div class="card-main-price">' + escapeHTML(p.price) + '</div>',
        '      <div class="card-installment-estimate">' + installmentText + '</div>',
        '    </div>',
        '    <div class="gaming-card-actions">',
        '      <button type="button" class="btn-card-cart" onclick="window.FutunetGaming.addToCart(\'' + escapedId + '\')">',
        '        <i data-lucide="shopping-cart" style="width:14px; height:14px;"></i> Agregar',
        '      </button>',
        '      <button type="button" class="btn-card-cuotas" onclick="window.FutunetGaming.requestFinancing(\'' + escapedId + '\')">',
        '        <i data-lucide="calendar-check" style="width:14px; height:14px;"></i> Cuotas',
        '      </button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('\n');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupEventListeners() {
    // Category pills click
    var pillsContainer = document.getElementById('gaming-category-pills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-pill');
        if (!btn) return;

        pillsContainer.querySelectorAll('.filter-pill').forEach(function (el) {
          el.classList.remove('active');
        });
        btn.classList.add('active');

        gamingState.activeCategory = btn.getAttribute('data-category') || 'all';
        applyFilters();
      });
    }

    // Search input
    var searchInput = document.getElementById('gaming-search-input');
    var clearBtn = document.getElementById('gaming-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        gamingState.searchQuery = this.value;
        if (clearBtn) clearBtn.style.display = this.value ? 'block' : 'none';
        applyFilters();
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        gamingState.searchQuery = '';
        this.style.display = 'none';
        applyFilters();
      });
    }

    // Sort selector
    var sortSelect = document.getElementById('gaming-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        gamingState.sortOrder = this.value;
        applyFilters();
      });
    }
  }

  // Public Interface
  window.FutunetGaming = {
    init: initGamingCatalog,
    addToCart: function (productId) {
      var item = gamingState.products.find(function (p) { return p.id === productId; });
      if (!item) {
        item = FALLBACK_GAMING_PRODUCTS.find(function (p) { return p.id === productId; });
      }
      if (item && window.FutunetCart && typeof window.FutunetCart.addItem === 'function') {
        window.FutunetCart.addItem(item);
      } else {
        alert('Producto agregado al carrito.');
      }
    },
    addFeaturedToCart: function (productId) {
      this.addToCart(productId);
      if (window.FutunetCart && typeof window.FutunetCart.openDrawer === 'function') {
        window.FutunetCart.openDrawer();
      }
    },
    requestFinancing: function (productId) {
      var item = gamingState.products.find(function (p) { return p.id === productId; });
      if (!item) item = FALLBACK_GAMING_PRODUCTS.find(function (p) { return p.id === productId; });
      
      if (item) {
        var msg = 'Hola Futunet, me interesa solicitar financiamiento en cuotas para el equipo: ' + item.title + ' (' + item.price + ').';
        window.open('https://wa.me/18095874000?text=' + encodeURIComponent(msg), '_blank');
      }
    },
    resetFilters: function () {
      gamingState.activeCategory = 'all';
      gamingState.searchQuery = '';
      var searchInput = document.getElementById('gaming-search-input');
      if (searchInput) searchInput.value = '';
      var pills = document.querySelectorAll('.filter-pill');
      pills.forEach(function (p) { p.classList.remove('active'); });
      var allPill = document.querySelector('.filter-pill[data-category="all"]');
      if (allPill) allPill.classList.add('active');
      applyFilters();
    }
  };

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGamingCatalog);
  } else {
    setTimeout(initGamingCatalog, 100);
  }
})();
