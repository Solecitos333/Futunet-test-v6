/**
 * Catálogo único de planes de Internet.
 * Alimenta la vitrina pública, el recomendador y el flujo privado de contratación.
 */
(function (root) {
  'use strict';

  var plans = [
    {
      id: '20mb', name: 'Plan Bronce', fullName: 'Plan Bronce 20 Megas', audience: 'hogar',
      type: 'fijo', speed: 20, price: 1000, icon: 'wifi', badge: 'Esencial',
      description: 'Conectividad estable para navegación, estudios y redes sociales.',
      features: ['20 Mbps de subida y bajada', 'Ideal para 1–2 personas', 'Soporte técnico local'],
      promotion: 'Instalación 50% de descuento', active: true
    },
    {
      id: '50mb', name: 'Plan Plata', fullName: 'Plan Plata 50 Megas', audience: 'hogar',
      type: 'fijo', speed: 50, price: 1500, icon: 'house-signal', badge: 'Versátil',
      description: 'Teletrabajo, clases virtuales y streaming fluido para toda la familia.',
      features: ['50 Mbps simétricos', 'Ideal para hasta 4 personas', 'Router WiFi doble banda'],
      promotion: 'Instalación 50% de descuento', active: true
    },
    {
      id: '100mb', name: 'Plan Oro', fullName: 'Plan Oro 100 Megas', audience: 'hogar',
      type: 'simetrico', speed: 100, price: 1900, icon: 'network-wired', badge: 'Recomendado',
      description: 'El equilibrio ideal para hogares conectados, gaming y contenido 4K.',
      features: ['100 Mbps simétricos', 'Streaming 4K y gaming', 'Router WiFi de alta potencia'],
      promotion: 'Instalación incluida', recommended: true, active: true
    },
    {
      id: '150mb', name: 'Plan Titanio', fullName: 'Plan Titanio 150 Megas', audience: 'hogar',
      type: 'simetrico', speed: 150, price: 2200, icon: 'rocket', badge: 'Potencia Pro',
      description: 'Potencia adicional para familias activas y múltiples conexiones simultáneas.',
      features: ['150 Mbps simétricos', 'Múltiples pantallas 4K', 'Teletrabajo avanzado'],
      promotion: 'Instalación incluida', active: true
    },
    {
      id: '200mb', name: 'Plan Platino', fullName: 'Plan Platino 200 Megas', audience: 'empresas',
      type: 'ultra', speed: 200, price: 2400, icon: 'briefcase', badge: 'Negocios',
      description: 'Fibra para oficinas, puntos de venta y operaciones conectadas.',
      features: ['200 Mbps simétricos', 'Ideal para POS y oficinas', 'IP pública disponible'],
      promotion: 'Instalación incluida', active: true
    },
    {
      id: '300mb', name: 'Plan Ultra', fullName: 'Plan Ultra 300 Megas', audience: 'empresas',
      type: 'ultra', speed: 300, price: 3200, icon: 'gauge-high', badge: 'Más elegido',
      description: 'Rendimiento premium para equipos grandes, nube y videoconferencias.',
      features: ['300 Mbps simétricos', 'Alta concurrencia', 'WiFi 6 de alta cobertura'],
      promotion: 'Instalación incluida', recommended: true, active: true
    },
    {
      id: '500mb', name: 'Plan Élite', fullName: 'Plan Élite 500 Megas', audience: 'empresas',
      type: 'ultra', speed: 500, price: 4500, icon: 'building', badge: 'Máxima potencia',
      description: 'Conectividad de alto desempeño para operaciones críticas y trabajo en la nube.',
      features: ['500 Mbps simétricos', 'Máxima capacidad disponible', 'Soporte empresarial prioritario'],
      promotion: 'Evaluación técnica incluida', active: true
    },
    {
      id: '400mb', name: 'Plan Pro', fullName: 'Plan Pro 400 Megas', audience: 'empresas',
      type: 'ultra', speed: 400, price: 4100, description: 'Plan empresarial heredado.',
      features: ['400 Mbps simétricos'], active: false, legacy: true
    }
  ];

  function activePlans() {
    return plans.filter(function (plan) { return plan.active; });
  }

  function findById(id) {
    return plans.find(function (plan) { return plan.id === id; }) || null;
  }

  function money(value) {
    return 'RD$ ' + Number(value || 0).toLocaleString('es-DO');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function publicPlanCard(plan) {
    var features = plan.features.map(function (feature) {
      return '<li><i class="fas fa-check" aria-hidden="true"></i><span>' + escapeHtml(feature) + '</span></li>';
    }).join('');
    var popularClass = plan.recommended ? ' popular' : '';
    return '<article class="claro-card elite-plan-card' + popularClass + '"' +
      ' data-service="' + plan.audience + '" data-type="' + plan.type + '"' +
      ' data-price="' + plan.price + '" data-speed="' + plan.speed + '"' +
      ' data-name="' + escapeHtml(plan.fullName) + '" data-plan-id="' + plan.id + '">' +
      '<span class="claro-badge-top">' + escapeHtml(plan.badge) + '</span>' +
      '<div class="claro-card-header">' +
        '<div class="claro-card-header-icon"><i class="fas fa-' + escapeHtml(plan.icon) + '" aria-hidden="true"></i></div>' +
        '<div class="elite-plan-audience">' + (plan.audience === 'hogar' ? 'Internet Hogar' : 'Internet Empresas') + '</div>' +
        '<div class="claro-card-header-title">' + plan.speed + ' <small>Mbps</small></div>' +
        '<div class="claro-card-header-sub">Fibra óptica simétrica FTTH</div>' +
      '</div>' +
      '<div class="claro-card-body">' +
        '<h3 class="elite-plan-name">' + escapeHtml(plan.name) + '</h3>' +
        '<p class="elite-plan-description">' + escapeHtml(plan.description) + '</p>' +
        '<ul class="elite-plan-features">' + features + '</ul>' +
        '<button type="button" class="claro-detail-toggle" data-plan-detail aria-expanded="false">Ver todos los detalles <i class="fas fa-chevron-down" aria-hidden="true"></i></button>' +
        '<div class="claro-card-detail-content"><p>Conexión directa mediante fibra óptica. La instalación final está sujeta a factibilidad técnica.</p></div>' +
        '<div class="claro-price-block"><span class="claro-price-label">Mensualidad</span>' +
          '<strong class="claro-price-val">' + money(plan.price) + '</strong>' +
          '<span class="claro-price-taxes">Impuestos incluidos</span>' +
          '<span class="claro-price-promo">' + escapeHtml(plan.promotion) + '</span></div>' +
        '<div class="claro-card-actions"><button type="button" class="claro-btn-solicitar" data-plan-select="' + plan.id + '">Elegir este plan</button></div>' +
      '</div></article>';
  }

  function portalPlanCard(plan) {
    var category = plan.audience === 'hogar' ? 'hogar' : 'ultra';
    var hidden = category === 'ultra' ? ' hidden' : '';
    var features = plan.features.slice(0, 3).map(function (feature) {
      return '<li><i data-lucide="check" aria-hidden="true"></i>' + escapeHtml(feature) + '</li>';
    }).join('');
    return '<article class="portal-plan-item' + (plan.recommended ? ' popular' : '') + '" data-category="' + category + '" data-plan-id="' + plan.id + '"' + hidden + '>' +
      '<div class="pp-badge' + (plan.recommended ? ' popular' : '') + '">' + escapeHtml(plan.badge) + '</div>' +
      '<div class="pp-icon"><i data-lucide="' + (plan.audience === 'hogar' ? 'wifi' : 'building-2') + '"></i></div>' +
      '<span class="elite-portal-audience">' + (plan.audience === 'hogar' ? 'Hogar' : 'Empresas') + '</span>' +
      '<h4 class="pp-name">' + escapeHtml(plan.name) + '</h4>' +
      '<div class="pp-speed">' + plan.speed + ' <span>Mbps</span></div>' +
      '<div class="pp-price">' + money(plan.price) + ' <span>/ mes</span></div>' +
      '<ul class="pp-features">' + features + '</ul>' +
      '<button type="button" class="pp-btn" data-portal-plan-select="' + plan.id + '">Seleccionar plan</button>' +
    '</article>';
  }

  function renderPlans() {
    var publicGrid = document.getElementById('claro-plans-grid');
    if (publicGrid) {
      publicGrid.innerHTML = activePlans().map(publicPlanCard).join('');
      publicGrid.setAttribute('data-audience', 'hogar');
    }
    var portalGrid = document.querySelector('.portal-plans-grid');
    if (portalGrid) portalGrid.innerHTML = activePlans().map(portalPlanCard).join('');
    if (root.lucide) root.lucide.createIcons();
  }

  function selectAudience(audience) {
    document.querySelectorAll('[data-internet-audience]').forEach(function (button) {
      var selected = button.getAttribute('data-internet-audience') === audience;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    var radio = document.querySelector('input[name="filter-service"][value="' + audience + '"]');
    if (radio) radio.checked = true;
    var grid = document.getElementById('claro-plans-grid');
    if (grid) grid.setAttribute('data-audience', audience);
    if (typeof root.filterPlans === 'function') root.filterPlans();
  }

  function setupInteractions() {
    var publicGrid = document.getElementById('claro-plans-grid');
    if (publicGrid) {
      publicGrid.addEventListener('click', function (event) {
        var detailButton = event.target.closest('[data-plan-detail]');
        if (detailButton) {
          if (typeof root.toggleCardDetail === 'function') root.toggleCardDetail(detailButton);
          detailButton.setAttribute('aria-expanded', String(detailButton.classList.contains('active')));
          return;
        }
        var selectButton = event.target.closest('[data-plan-select]');
        if (selectButton) {
          var selected = findById(selectButton.getAttribute('data-plan-select'));
          if (selected && typeof root.selectClaroPlan === 'function') {
            root.selectClaroPlan(selected.fullName, selected.id, selected.price);
          }
        }
      });
    }

    var portalGrid = document.querySelector('.portal-plans-grid');
    if (portalGrid) {
      portalGrid.addEventListener('click', function (event) {
        var button = event.target.closest('[data-portal-plan-select]');
        if (!button) return;
        var selected = findById(button.getAttribute('data-portal-plan-select'));
        if (selected && typeof root.selectHiringPlan === 'function') {
          root.selectHiringPlan(selected.fullName, selected.id, selected.price);
        }
      });
    }

    document.querySelectorAll('[data-internet-audience]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectAudience(button.getAttribute('data-internet-audience'));
      });
    });
  }

  function checkHeroCoverage() {
    var input = document.getElementById('hero-coverage-input');
    var result = document.getElementById('hero-coverage-result');
    if (!input || !result) return;
    var value = input.value.trim();
    if (value.length < 3) {
      result.textContent = 'Escribe tu sector o dirección para continuar.';
      result.className = 'hero-coverage-result is-warning';
      return;
    }
    var target = document.getElementById('coverage-address-input');
    if (target) target.value = value;
    result.textContent = 'Validaremos la factibilidad técnica de tu dirección.';
    result.className = 'hero-coverage-result is-success';
    if (typeof root.checkCoverage === 'function') root.checkCoverage();
    window.setTimeout(function () {
      var coverage = document.getElementById('cobertura');
      if (coverage) coverage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
  }

  root.FutunetInternetCatalog = {
    plans: plans.slice(),
    activePlans: activePlans,
    findById: findById,
    formatMoney: money,
    renderPlans: renderPlans,
    selectAudience: selectAudience
  };
  root.checkHeroCoverage = checkHeroCoverage;

  document.addEventListener('DOMContentLoaded', function () {
    renderPlans();
    setupInteractions();
    selectAudience('hogar');
  });
})(window);
