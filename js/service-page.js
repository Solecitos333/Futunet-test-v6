/**
 * Futunet Service Page Controller
 * Handles dynamic content synchronization, related products integration, and request forms.
 */
(function () {
  'use strict';

  var db = null;
  var serviceId = '';

  // Inicialización de la Página de Servicio
  async function init() {
    // Si estamos en la página de seguridad electrónica, inicializar y disparar la carga inicial
    if (window.currentServiceCategory === 'seguridad_electronica') {
      if (window.FutunetFirebase && window.FutunetFirebase.db) {
        db = window.FutunetFirebase.db;
      }
      serviceId = 'seguridad';
      setupRequestForm();
      var event = new CustomEvent('filterSubcategory', { detail: 'all' });
      document.dispatchEvent(event);
      return;
    }

    var container = document.getElementById('service-page-container');
    if (!container) return;

    serviceId = container.getAttribute('data-service-id');
    if (!serviceId) return;

    // Esperar a que Firebase esté listo
    if (window.FutunetFirebase && window.FutunetFirebase.db) {
      db = window.FutunetFirebase.db;
      
      // Sincronizar datos dinámicos del servicio desde Firestore
      await syncServiceContent();
      
      // Configurar el formulario de solicitudes
      setupRequestForm();
    } else {
      console.warn('Firebase no inicializado. Utilizando contenido estático base.');
      setupRequestForm(); // Fallback sin Firebase directo
    }
  }

  // Sincroniza textos, imágenes y productos relacionados de Firestore
  async function syncServiceContent() {
    try {
      // 1. Obtener los datos del servicio
      var doc = await db.collection('services').doc(serviceId).get();
      var serviceData = doc.exists ? doc.data() : null;

      if (serviceData) {
        // Reemplazar textos si el administrador los ha editado
        if (serviceData.title) {
          setText('service-title', serviceData.title);
        }
        if (serviceData.subtitle) {
          setText('service-subtitle', serviceData.subtitle);
        }
        if (serviceData.description) {
          setText('service-long-description', serviceData.description);
        }

        // Cambiar imagen de banner
        if (serviceData.bannerImg) {
          var banner = document.getElementById('service-hero-banner');
          if (banner) banner.style.backgroundImage = "url('" + serviceData.bannerImg + "')";
        }

        // Renderizar características si el admin las configuró
        if (serviceData.features && serviceData.features.length > 0) {
          renderFeaturesList(serviceData.features);
        }

        // 2. Cargar e Inyectar los productos asociados
        if (serviceData.products && serviceData.products.length > 0) {
          await loadRelatedProducts(serviceData.products);
        }
      } else {
        // Si no existe el documento en Firestore aún, intentamos buscar si hay productos predeterminados por categoría
        // Mapeo básico de serviceId a categoría del catálogo para mostrar productos iniciales
        var catMapping = {
          seguridad: 'Cámaras de seguridad',
          redes: 'Componentes de red wifi',
          energia: 'Energía y respaldo',
          equipos: 'Laptops corporativas',
          oficina: 'Mobiliario',
          infra: 'remozamiento profesional'
        };
        var defaultCategory = catMapping[serviceId];
        if (defaultCategory) {
          await loadProductsByCategory(defaultCategory);
        }
      }

      // 3. Cargar subcategorías de servicio si existen en la página
      var subcategoryContainers = document.querySelectorAll('[data-service-section]');
      if (subcategoryContainers.length > 0) {
        for (var i = 0; i < subcategoryContainers.length; i++) {
          var container = subcategoryContainers[i];
          var subcategory = container.getAttribute('data-service-section');
          if (subcategory) {
            await loadProductsBySubcategory(subcategory, container);
          }
        }
      }
    } catch (err) {
      console.error('Error al sincronizar contenidos de servicio:', err);
    }

    // Carga inicial para la página de seguridad electrónica
    if (window.currentServiceCategory === 'seguridad_electronica') {
      var event = new CustomEvent('filterSubcategory', { detail: 'all' });
      document.dispatchEvent(event);
    }
  }

  // Renderiza el bloque de características
  function renderFeaturesList(features) {
    var container = document.getElementById('service-features-list');
    if (!container) return;

    var html = '';
    features.forEach(function (feat) {
      var icon = feat.icon || 'check-circle-2';
      html += '<div class="feature-item">' +
        '  <div class="feature-icon-wrapper"><i data-lucide="' + icon + '"></i></div>' +
        '  <div class="feature-text">' +
        '    <h4>' + escapeHtml(feat.title || '') + '</h4>' +
        '    <p>' + escapeHtml(feat.desc || '') + '</p>' +
        '  </div>' +
        '</div>';
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  // Carga productos específicos asignados por sus IDs
  async function loadRelatedProducts(productIds) {
    var section = document.getElementById('related-products-section');
    var grid = document.getElementById('service-products-grid');
    if (!section || !grid) return;

    try {
      var products = [];
      // Firestore no permite consultas de 'in' con más de 30 elementos, lo cual es suficiente aquí
      var chunks = [];
      var tempIds = productIds.slice(0, 30); // Limitar a 30 productos relacionados
      
      var snapshot = await db.collection('products')
        .where('isActive', '==', true)
        .get();

      snapshot.forEach(function (doc) {
        var prod = doc.data();
        prod.id = doc.id;
        if (tempIds.includes(doc.id)) {
          products.push(prod);
        }
      });

      if (products.length > 0) {
        renderProductsGrid(products, grid);
        section.style.display = 'block';
      }
    } catch (err) {
      console.error('Error al cargar productos relacionados:', err);
    }
  }

  // Carga fallback: Busca productos de esa categoría
  async function loadProductsByCategory(categoryName) {
    var section = document.getElementById('related-products-section');
    var grid = document.getElementById('service-products-grid');
    if (!section || !grid) return;

    try {
      var snapshot = await db.collection('products')
        .where('isActive', '==', true)
        .where('category', '==', categoryName)
        .limit(8)
        .get();

      var products = [];
      snapshot.forEach(function (doc) {
        var prod = doc.data();
        prod.id = doc.id;
        products.push(prod);
      });

      if (products.length > 0) {
        renderProductsGrid(products, grid);
        section.style.display = 'block';
      }
    } catch (err) {
      console.error('Error al cargar productos fallback:', err);
    }
  }

  // Carga productos filtrados por subcategoría de servicio
  async function loadProductsBySubcategory(subcategory, container) {
    try {
      var snapshot = await db.collection('products')
        .where('isActive', '==', true)
        .where('serviceSubcategory', '==', subcategory)
        .get();

      var products = [];
      snapshot.forEach(function (doc) {
        var prod = doc.data();
        prod.id = doc.id;
        products.push(prod);
      });

      if (products.length > 0) {
        renderProductsGrid(products, container);
        container.style.display = 'grid';
      } else {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:20px; background:#f9fafc; border:1px dashed #e5eef8; border-radius:16px; color:#76889e; font-size:0.8rem; font-weight:500; display:flex; align-items:center; justify-content:center; gap:6px; margin: 10px 0;">' +
          '<i data-lucide="check" style="width:14px; height:14px; color:#2ecc71;"></i> Equipos disponibles bajo cotización y pedido. Completa el formulario al final de la página o contáctanos por WhatsApp para recibir asesoría técnica.' +
          '</div>';
        if (window.lucide) window.lucide.createIcons();
      }
    } catch (err) {
      console.error('Error al cargar subcategoría ' + subcategory + ':', err);
    }
  }

  // Renderiza la cuadrícula de productos en formato de tarjeta premium
  function renderProductsGrid(products, container) {
    var html = '';
    products.forEach(function (p) {
      var priceLabel = p.price ? 'RD$ ' + parseFloat(p.price).toLocaleString('es-DO', { minimumFractionDigits: 2 }) : 'A cotizar';
      var imgUrl = p.img || 'img/placeholder.svg';
      
      html += '<div class="product-card reveal in">' +
        '  <div class="product-card-badge ' + (p.stock > 0 ? 'badge-in-stock' : 'badge-out-of-stock') + '">' +
        '    ' + (p.stock > 0 ? 'DISPONIBLE' : 'COTIZAR') +
        '  </div>' +
        '  <a href="producto.html?id=' + p.id + '" class="product-card-img-wrapper">' +
        '    <img src="' + imgUrl + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' +
        '  </a>' +
        '  <div class="product-card-body">' +
        '    <span class="product-card-brand">' + escapeHtml(p.brand || 'Futunet') + '</span>' +
        '    <h4 class="product-card-title">' +
        '      <a href="producto.html?id=' + p.id + '">' + escapeHtml(p.title) + '</a>' +
        '    </h4>' +
        '    <div class="product-card-footer">' +
        '      <span class="product-card-price">' + priceLabel + '</span>' +
        '      <a href="producto.html?id=' + p.id + '" class="btn btn-primary btn-sm product-card-btn" aria-label="Ver detalles de ' + escapeHtml(p.title) + '">Ver equipo</a>' +
        '    </div>' +
        '  </div>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  // Configura el formulario de envío de solicitudes
  function setupRequestForm() {
    var form = document.getElementById('service-request-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      var btn = document.getElementById('req-submit-btn');
      if (btn) btn.disabled = true;

      var name = document.getElementById('req-name').value.trim();
      var phone = document.getElementById('req-phone').value.trim();
      var email = document.getElementById('req-email').value.trim();
      var company = document.getElementById('req-company').value.trim();
      var message = document.getElementById('req-message').value.trim();

      var requestData = {
        name: name,
        phone: phone,
        email: email,
        company: company,
        message: message,
        serviceId: serviceId,
        serviceTitle: document.getElementById('service-title').textContent,
        status: 'pending',
        type: 'standard_service',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        if (db) {
          await db.collection('service_requests').add(requestData);
        } else {
          // Si por alguna razón la BD falla, simulamos envío por WhatsApp como respaldo
          var waText = encodeURIComponent('Hola Futunet, me interesa el servicio de ' + requestData.serviceTitle + '.\n\nNombre: ' + name + '\nTeléfono: ' + phone + '\nEmail: ' + email + '\nDetalles: ' + message);
          window.open('https://wa.me/18297411041?text=' + waText, '_blank');
          showToast('Enviando solicitud por WhatsApp...', 'success');
          return;
        }

        showToast('Solicitud enviada exitosamente. Nos pondremos en contacto contigo.', 'success');
        form.reset();
      } catch (err) {
        console.error('Error al registrar solicitud de servicio:', err);
        showToast('Ocurrió un error al enviar. Por favor intenta de nuevo.', 'error');
      }

      if (btn) btn.disabled = false;
    });
  }

  // Helpers de UI
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(msg, type) {
    var existing = document.querySelector('.up-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'up-toast up-toast-' + (type || 'info');
    toast.textContent = msg;
    
    // Aplicar estilos rápidos a la toast si no están cargados
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '14px';
    toast.style.fontFamily = 'Outfit, sans-serif';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';
    toast.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
    toast.style.backgroundColor = type === 'success' ? '#0e8a5f' : '#c0392b';
    toast.style.color = '#ffffff';

    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
  }

  // Escuchar eventos de filtro desde la landing de seguridad
  document.addEventListener('filterSubcategory', async function(e) {
    var subcategory = e.detail;
    var container = document.getElementById('service-products-grid');
    var noProductsMsg = document.getElementById('no-products-msg');
    
    if (!container) return;
    
    container.innerHTML = '<div class="loading-products" style="grid-column: 1/-1; text-align:center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Cargando catálogo...</div>';
    container.style.display = 'grid';
    if(noProductsMsg) noProductsMsg.style.display = 'none';

    try {
      // Esperar a que la base de datos en memoria cargue desde inventory_data.js
      if (window.FutunetData && window.FutunetData.readyPromise) {
        await window.FutunetData.readyPromise;
      }

      var localProducts = [];
      if (window.mockDatabase && window.mockDatabase.length > 0) {
        localProducts = window.mockDatabase;
      } else if (window.FutunetData && window.FutunetData.products && window.FutunetData.products.length > 0) {
        localProducts = window.FutunetData.products;
      }

      // Fallback si no hay productos cargados en memoria aún, intentar recuperarlos de firestore
      if (localProducts.length === 0 && window.FutunetFirebase && window.FutunetFirebase.db) {
        if (!db) db = window.FutunetFirebase.db;
        var snapshot = await db.collection('products')
          .where('isActive', '==', true)
          .get();
        snapshot.forEach(function (doc) {
          var prod = doc.data();
          prod.id = doc.id;
          localProducts.push(prod);
        });
      }

      var products = [];
      localProducts.forEach(function (prod) {
        var catLower = String(prod.category || '').toLowerCase().trim();
        var subCatLower = String(prod.serviceSubcategory || '').toLowerCase().trim();
        
        if (subcategory === 'seguridad_cctv') {
          if (subCatLower === 'seguridad_cctv' || catLower === 'cámaras de seguridad' || catLower === 'cámara de seguridad' || catLower === 'cctv') {
            products.push(prod);
          }
        } else if (subcategory === 'seguridad_control_accesos') {
          if (subCatLower === 'seguridad_control_accesos' || catLower === 'control de accesos' || catLower === 'acceso' || catLower === 'accesos') {
            products.push(prod);
          }
        } else if (subcategory === 'seguridad_video_porteros') {
          if (subCatLower === 'seguridad_video_porteros' || catLower === 'video portero' || catLower === 'video porteros' || catLower === 'video porteros inteligentes') {
            products.push(prod);
          }
        } else if (subcategory === 'seguridad_cercos') {
          if (subCatLower === 'seguridad_cercos' || catLower === 'cercos eléctricos' || catLower === 'cercos') {
            products.push(prod);
          }
        } else if (subcategory === 'seguridad_motores') {
          if (subCatLower === 'seguridad_motores' || catLower === 'motores' || catLower === 'motores de portón') {
            products.push(prod);
          }
        } else if (subcategory === 'seguridad_alarmas') {
          if (subCatLower === 'seguridad_alarmas' || catLower === 'alarmas' || catLower === 'sistemas de alarma' || catLower === 'alarmas inteligentes') {
            products.push(prod);
          }
        } else {
          // 'all': Mostrar cualquier producto de seguridad
          var isSecurity = 
            subCatLower.indexOf('seguridad_') === 0 ||
            catLower === 'cámaras de seguridad' ||
            catLower === 'cámara de seguridad' ||
            catLower === 'cctv' ||
            catLower === 'control de accesos' ||
            catLower === 'cerraduras' ||
            catLower === 'seguridad electrónica' ||
            catLower === 'seguridad electronica';
          
          if (isSecurity) {
            products.push(prod);
          }
        }
      });

      if (products.length > 0) {
        if (typeof window.renderProductsGrid === 'function') {
          container.innerHTML = '';
          window.renderProductsGrid(products, { target: container });
          if (typeof window.updateInlineCartButtons === 'function') {
            window.updateInlineCartButtons();
          }
        } else {
          renderProductsGrid(products, container);
        }
        container.style.display = 'grid';
      } else {
        container.innerHTML = '';
        container.style.display = 'none';
        if(noProductsMsg) noProductsMsg.style.display = 'block';
      }
    } catch (err) {
      console.error('Error al filtrar productos:', err);
      container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:20px;">Error al cargar los productos.</div>';
    }
  });

  // Auto-inicializar cuando el DOM esté listo
  window.addEventListener('DOMContentLoaded', init);
})();
