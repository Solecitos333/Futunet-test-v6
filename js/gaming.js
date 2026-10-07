/**
 * FUTUNET - ZONA GAMING INTERACTIVE LOGIC (gaming.js)
 * Clean Corporate Light Edition
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
      img: 'img/gaming/verified/laptop-asus-tuf-f15-2023.webp',
      specs: ['Intel Core i7-13620H', '16GB DDR5', '512GB SSD NVMe', 'RTX 4060 8GB GDDR6', '15.6" 144Hz FHD']
    },
    {
      id: 'gm_laptop_lenovo_legion_5',
      title: 'Laptop Gamer Lenovo Legion Pro 5 Ryzen 7 16GB 1TB RTX 4070 165Hz WQXGA',
      brand: 'LENOVO',
      category: 'Laptops Gamer',
      price: 'RD$ 89,500.00',
      img: 'img/gaming/foto-pendiente.svg',
      specs: ['AMD Ryzen 7 7735H', '16GB DDR5', '1TB SSD NVMe', 'RTX 4070 8GB', '16" 165Hz 2K']
    },
    {
      id: 'gm_pc_starter_ryzen5',
      title: 'PC Gamer Futunet Starter Edition Ryzen 5 5600GT 16GB RGB 500GB SSD 550W',
      brand: 'FUTUNET GAMING',
      category: 'PCs Gamer',
      price: 'RD$ 28,900.00',
      img: 'img/gaming/foto-pendiente.svg',
      specs: ['AMD Ryzen 5 5600GT', '16GB RAM RGB', '500GB SSD NVMe', 'Case Cristal 4 Fans', 'Fuente 550W 80+']
    },
    {
      id: 'gm_pc_esports_rtx4060',
      title: 'PC Gamer Futunet Esports Pro Core i5 13400F 16GB DDR5 1TB RTX 4060 8GB',
      brand: 'FUTUNET GAMING',
      category: 'PCs Gamer',
      price: 'RD$ 58,400.00',
      img: 'img/gaming/foto-pendiente.svg',
      specs: ['Intel Core i5-13400F', '16GB DDR5', '1TB SSD Gen4', 'RTX 4060 8GB OC', 'Fuente 650W Bronze']
    },
    {
      id: 'gm_pc_streamer_ultra_rtx4070ti',
      title: 'PC Gamer Futunet Streamer Ultra Ryzen 7 7800X3D 32GB DDR5 1TB RTX 4070 Ti Super',
      brand: 'FUTUNET GAMING',
      category: 'PCs Gamer',
      price: 'RD$ 119,000.00',
      img: 'img/gaming/foto-pendiente.svg',
      specs: ['AMD Ryzen 7 7800X3D', 'Líquida AIO 240mm', '32GB DDR5 6000MHz', 'RTX 4070 Ti SUPER 16GB', 'Fuente 750W Gold']
    },
    {
      id: 'gm_gpu_asus_rtx4060',
      title: 'Tarjeta Gráfica ASUS Dual GeForce RTX 4060 EVO OC Edition 8GB GDDR6',
      brand: 'ASUS',
      category: 'Componentes Gaming',
      price: 'RD$ 26,500.00',
      img: 'img/gaming/verified/gpu-asus-rtx4060-evo.webp',
      specs: ['8GB GDDR6 128-bit', 'DLSS 3 & Ray Tracing', 'Dual Fan 0dB Tech', 'HDMI 2.1a + 3x DP 1.4a']
    },
    {
      id: 'gm_monitor_asus_tuf_165hz',
      title: 'Monitor Gamer ASUS TUF Gaming 24" VG249Q1A IPS Full HD 165Hz 1ms',
      brand: 'ASUS',
      category: 'Monitores Gaming',
      price: 'RD$ 13,900.00',
      img: 'img/gaming/verified/monitor-asus-vg249q1a.webp',
      specs: ['23.8" IPS Full HD', '165Hz Refresh Rate', '1ms MPRT ELMB', 'FreeSync Premium']
    },
    {
      id: 'gm_monitor_samsung_odyssey_g4_240hz',
      title: 'Monitor Gamer Samsung Odyssey G4 27" IPS FHD 240Hz 1ms G-Sync Pivot',
      brand: 'SAMSUNG',
      category: 'Monitores Gaming',
      price: 'RD$ 21,500.00',
      img: 'img/gaming/verified/monitor-samsung-g4-27.webp',
      specs: ['27" IPS Full HD', '240Hz Ultra Fast', '1ms GtG Response', 'G-Sync + FreeSync', 'Base Pivot']
    },
    {
      id: 'gm_teclado_redragon_kumara',
      title: 'Teclado Mecánico Redragon Kumara K552 RGB Switches Red/Blue Español',
      brand: 'REDRAGON',
      category: 'Periféricos Gaming',
      price: 'RD$ 2,650.00',
      img: 'img/gaming/verified/keyboard-redragon-kumara-k552.webp',
      specs: ['Formato Compacto TKL', 'Switches Mecánicos', 'RGB Configurable', 'Layout Español']
    },
    {
      id: 'gm_mouse_logitech_g502_hero',
      title: 'Mouse Gamer Logitech G502 HERO Sensor 25K 25,600 DPI Pesas Ajustables',
      brand: 'LOGITECH G',
      category: 'Periféricos Gaming',
      price: 'RD$ 3,450.00',
      img: 'img/gaming/verified/mouse-logitech-g502-hero.webp',
      specs: ['Sensor HERO 25K', '11 Botones Programables', 'Pesas Ajustables 3.6g', 'LIGHTSYNC RGB']
    },
    {
      id: 'gm_headset_hyperx_cloud2',
      title: 'Auriculares Gamer HyperX Cloud II Sonido Envolvente 7.1 Micrófono Cancelación',
      brand: 'HYPERX',
      category: 'Periféricos Gaming',
      price: 'RD$ 4,890.00',
      img: 'img/gaming/verified/headset-hyperx-cloud-ii.webp',
      specs: ['Sonido Virtual 7.1', 'Almohadillas Memory Foam', 'Micrófono Desmontable', 'Estructura de Aluminio']
    },
    {
      id: 'gm_fibra_gamer_200m',
      title: 'Internet Fibra Gamer 200 Mbps Simétricos con Baja Latencia QoS y Wi-Fi 6',
      brand: 'FUTUNET FIBRA',
      category: 'Internet Gamer',
      price: 'RD$ 2,495.00 / mes',
      img: 'img/gaming/servicio-fibra.svg',
      specs: ['200M Bajada / 200M Subida', 'Rutas BGP Prioritarias', 'Ping < 25ms en Servidores', 'Router Wi-Fi 6 Gigabit']
    },
    {
      id: 'gm_cpu_amd_ryzen7_7800x3d',
      title: 'Procesador AMD Ryzen 7 7800X3D 8 Núcleos 16 Hilos 5.0GHz AM5 con 3D V-Cache',
      brand: 'AMD',
      category: 'Componentes Gaming',
      price: 'RD$ 21,955.00',
      img: 'img/gaming/componentes/cpu-amd-ryzen-7-7800x3d.jpg',
      specs: ['8 núcleos / 16 hilos Zen 4', 'AMD 3D V-Cache 96MB L3', 'Boost hasta 5.0 GHz', 'Socket AM5']
    },
    {
      id: 'gm_cpu_amd_ryzen9_9950x',
      title: 'Procesador AMD Ryzen 9 9950X 16 Núcleos 32 Hilos 5.7GHz AM5 Arquitectura Zen 5',
      brand: 'AMD',
      category: 'Componentes Gaming',
      price: 'RD$ 31,875.00',
      img: 'img/gaming/componentes/cpu-amd-ryzen-9-9950x.jpg',
      specs: ['16 núcleos / 32 hilos Zen 5', 'Boost hasta 5.7 GHz', '80MB caché total', 'Socket AM5']
    },
    {
      id: 'gm_mob_asus_tuf_x870e',
      title: 'Tarjeta Madre ASUS TUF GAMING X870E-PLUS WIFI7 ATX Socket AM5 DDR5 PCIe 5.0',
      brand: 'ASUS',
      category: 'Componentes Gaming',
      price: 'RD$ 15,130.00',
      img: 'img/gaming/componentes/motherboard-asus-tuf-x870e-plus-wifi7.jpg',
      specs: ['Socket AM5 Ryzen 7000/8000/9000', 'DDR5 hasta 192GB', 'PCIe 5.0 GPUs y M.2', 'Wi-Fi 7 + ATX']
    },
    {
      id: 'gm_ram_kingston_fury_64gb',
      title: 'Memoria RAM Kingston Fury Beast DDR5 RGB 64GB (2x32GB) 6000 MT/s CL30',
      brand: 'KINGSTON',
      category: 'Componentes Gaming',
      price: 'RD$ 69,700.00',
      img: 'img/gaming/componentes/ram-kingston-fury-beast-ddr5-64gb.jpg',
      specs: ['Kit 64GB (2x32GB) DDR5', '6000 MT/s CL30 ultra baja latencia', 'RGB Infrared Sync', 'Intel XMP / AMD EXPO']
    },
    {
      id: 'gm_ssd_samsung_9100_pro_2tb',
      title: 'SSD Samsung 9100 PRO 2TB M.2 NVMe PCIe 5.0 x4 Lectura 14,700 MB/s',
      brand: 'SAMSUNG',
      category: 'Componentes Gaming',
      price: 'RD$ 24,300.00',
      img: 'img/gaming/componentes/ssd-samsung-9100-pro-2tb.jpg',
      specs: ['2TB NVMe PCIe 5.0 x4', 'Lectura hasta 14,700 MB/s', 'Escritura hasta 13,400 MB/s', 'Open Box con garantía']
    },
    {
      id: 'gm_ssd_crucial_p310_2tb',
      title: 'SSD Crucial P310 2TB M.2 NVMe PCIe Gen4 x4 Lectura 7,100 MB/s',
      brand: 'CRUCIAL',
      category: 'Componentes Gaming',
      price: 'RD$ 18,240.00',
      img: 'img/gaming/componentes/ssd-crucial-p310-2tb.jpg',
      specs: ['2TB M.2 2280 PCIe 4.0', 'Lectura 7,100 MB/s', 'Escritura 6,000 MB/s', 'Compatible PC & PS5']
    },
    {
      id: 'gm_ssd_crucial_p310_1tb',
      title: 'SSD Crucial P310 1TB M.2 NVMe PCIe Gen4 x4 Lectura 7,100 MB/s',
      brand: 'CRUCIAL',
      category: 'Componentes Gaming',
      price: 'RD$ 10,125.00',
      img: 'img/gaming/componentes/ssd-crucial-p310-1tb.jpg',
      specs: ['1TB M.2 2280 PCIe 4.0', 'Lectura 7,100 MB/s', 'Escritura 6,000 MB/s', 'Micron Quality']
    },
    {
      id: 'gm_cooler_tryx_panorama_360',
      title: 'Enfriamiento Líquido TRYX PANORAMA 360 ARGB Pantalla AMOLED Curva 6.5"',
      brand: 'TRYX',
      category: 'Componentes Gaming',
      price: 'RD$ 16,915.00',
      img: 'img/gaming/componentes/cooler-tryx-panorama-360-argb.jpg',
      specs: ['Pantalla curva AMOLED 6.5"', '3 fans ARGB 120mm', 'Radiador 360mm', 'Intel y AMD universal']
    },
    {
      id: 'gm_cooler_nzxt_kraken_elite_360',
      title: 'Cooler Líquido NZXT Kraken Elite 360 RGB White Pantalla LCD 2.36"',
      brand: 'NZXT',
      category: 'Componentes Gaming',
      price: 'RD$ 18,530.00',
      img: 'img/gaming/componentes/cooler-nzxt-kraken-elite-360.jpg',
      specs: ['Pantalla LCD 2.36" 640x640', 'Radiador 360mm blanco', '3 fans RGB 120mm', 'NZXT CAM Control']
    },
    {
      id: 'gm_case_lian_li_o11_dynamic_evo',
      title: 'Gabinete Gaming ATX Lian Li O11 Dynamic EVO Black Cristal Templado',
      brand: 'LIAN LI',
      category: 'Componentes Gaming',
      price: 'RD$ 20,640.00',
      img: 'img/gaming/componentes/case-lian-li-o11-dynamic-evo.jpg',
      specs: ['Vidrio templado panorámico', 'Modular doble cámara', 'Soporta radiadores 360mm', 'ATX / Micro-ATX']
    },
    {
      id: 'gm_case_msi_mag_pano_100r',
      title: 'Gabinete Gaming ATX MSI MAG Pano 100R White Panorámico 4 Fans ARGB',
      brand: 'MSI',
      category: 'Componentes Gaming',
      price: 'RD$ 10,400.00',
      img: 'img/gaming/componentes/case-msi-mag-pano-100r.jpg',
      specs: ['Panorámico 270° sin pilar', '4 fans ARGB incluidos', 'Color blanco estético', 'ATX / Micro-ATX']
    },
    {
      id: 'gm_psu_msi_mag_a1000gs',
      title: 'Fuente de Poder MSI MAG A1000GS PCIe 5.0 1000W 80 Plus Gold ATX 3.1 Modular',
      brand: 'MSI',
      category: 'Componentes Gaming',
      price: 'RD$ 6,120.00',
      img: 'img/gaming/componentes/psu-msi-mag-a1000gs-pcie5.jpg',
      specs: ['1000W 80 Plus Gold', 'ATX 3.1 conector PCIe 5.0 12V-2x6', '100% modular plana', 'Protección industrial']
    }
  ];

  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    var cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  function estimateInstallment(priceStr) {
    var val = parsePrice(priceStr);
    if (val <= 0 || String(priceStr).includes('/ mes')) {
      return 'Plan mensual';
    }
    // Estimated 12-month installment with basic interest
    var monthly = Math.round((val * 1.15) / 12);
    return 'o cuotas desde RD$ ' + monthly.toLocaleString('es-DO') + ' / mes';
  }

  function initGamingCatalog() {
    var supplierProducts = [];
    if (window.SUPPLIER_INVENTORY_FEED && Array.isArray(window.SUPPLIER_INVENTORY_FEED)) {
      supplierProducts = window.SUPPLIER_INVENTORY_FEED.filter(function (item) {
        return item.supplier === 'gaming' ||
          (item.category && item.category.toLowerCase().includes('gaming')) ||
          (item.title && /rtx|gtx|gamer|gaming|144hz|240hz|ryzen 5|ryzen 7|esports/i.test(item.title));
      });
    } else if (window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      supplierProducts = window.supplierInventory.getMergedCatalog().filter(function (item) {
        return item.supplier === 'gaming' ||
          (item.category && item.category.toLowerCase().includes('gaming')) ||
          (item.title && /rtx|gtx|gamer|gaming|144hz|240hz|ryzen 5|ryzen 7|esports/i.test(item.title));
      });
    }

    if (supplierProducts.length >= 6) {
      gamingState.products = supplierProducts;
    } else {
      gamingState.products = FALLBACK_GAMING_PRODUCTS;
    }

    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        var urlParams = new URLSearchParams(window.location.search);
        var requestedCat = urlParams.get('cat');
        if (requestedCat) {
          var norm = requestedCat.toLowerCase();
          var pills = document.querySelectorAll('.filter-pill');
          pills.forEach(function (pill) {
            var cat = (pill.getAttribute('data-category') || '').toLowerCase();
            if (cat === norm || (norm === 'componentes' && cat.includes('componentes')) || (norm === 'laptops' && cat.includes('laptops')) || (norm === 'pcs' && cat.includes('pcs')) || (norm === 'monitores' && cat.includes('monitores'))) {
              pills.forEach(function (p) { p.classList.remove('active'); });
              pill.classList.add('active');
              gamingState.activeCategory = pill.getAttribute('data-category');
            }
          });
        }
      }
    } catch (e) {}

    gamingState.filteredProducts = gamingState.products.slice();
    applyFilters();
    setupEventListeners();
  }

  function applyFilters() {
    var list = gamingState.products.slice();

    // 1. Category Filter
    if (gamingState.activeCategory !== 'all') {
      list = list.filter(function (p) {
        if (!p.category) return false;
        return p.category.toLowerCase() === gamingState.activeCategory.toLowerCase();
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
      var installmentText = estimateInstallment(p.price);
      var specsText = Array.isArray(p.specs) ? p.specs.slice(0, 4).join(' • ') : '';
      var escapedTitle = escapeHTML(p.title);
      var escapedId = escapeHTML(p.id);
      var image = p.img || 'img/gaming/foto-pendiente.svg';
      var imageAlt = image.includes('foto-pendiente.svg') ? 'Foto pendiente: ' + p.title : p.title;

      return [
        '<div class="gaming-product-card" data-id="' + escapedId + '">',
        '  <span class="g-card-badge">' + escapeHTML(p.category || 'Gaming') + '</span>',
        '  <div class="g-card-img-wrap">',
        '    <img src="' + escapeHTML(image) + '" alt="' + escapeHTML(imageAlt) + '" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'img/gaming/foto-pendiente.svg\';this.alt=\'Foto del producto pendiente\';" />',
        '  </div>',
        '  <div class="g-card-category">' + escapeHTML(p.brand || 'Futunet') + '</div>',
        '  <h3 class="g-card-title" title="' + escapedTitle + '">' + escapedTitle + '</h3>',
        '  <p class="g-card-specs">' + escapeHTML(specsText) + '</p>',
        '  <div class="g-card-bottom">',
        '    <div>',
        '      <span class="g-card-price">' + escapeHTML(p.price) + '</span>',
        '      <span class="g-card-installment">' + installmentText + '</span>',
        '    </div>',
        '    <button type="button" class="g-card-btn" onclick="window.FutunetGaming.addToCart(\'' + escapedId + '\')">',
        '      <i data-lucide="shopping-cart" style="width:14px; height:14px;"></i> Agregar',
        '    </button>',
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
      if (item && window.FutunetCart) {
        if (typeof window.FutunetCart.addItem === 'function') {
          window.FutunetCart.addItem(item);
        } else if (typeof window.FutunetCart.add === 'function') {
          window.FutunetCart.add(item.id || productId);
        }
        if (typeof window.FutunetCart.openDrawer === 'function') {
          window.FutunetCart.openDrawer();
        }
      } else if (window.FutunetCart && typeof window.FutunetCart.add === 'function') {
        window.FutunetCart.add(productId);
        if (typeof window.FutunetCart.openDrawer === 'function') {
          window.FutunetCart.openDrawer();
        }
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
        var waUrl = 'https://wa.me/18297411041?text=' + encodeURIComponent(msg);
        var win = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = waUrl;
        }
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
