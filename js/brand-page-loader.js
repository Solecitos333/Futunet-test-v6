/* =============================================================
   BRAND-PAGE-LOADER.JS — Cargador de productos para páginas de marca
   Filtra los productos globales por la marca definida en document.body.dataset.brandName
   y los inyecta utilizando el motor de renderizado de catalog.js.
   También enriquece el hero con la imagen representativa del producto.
   ============================================================= */

// Mapa de imagen preview por marca (clave en minúsculas)
const BRAND_PREVIEW_IMAGES = {
  'dell':              'img/brands-preview/dell.webp',
  'lenovo':            'img/brands-preview/lenovo.webp',
  'epson':             'img/brands-preview/epson.webp',
  'hikvision':         'img/brands-preview/hikvision.webp',
  'samsung':           'img/brands-preview/samsung.webp',
  'hp':                'img/brands-preview/hp.webp',
  'tp-link':           'img/brands-preview/tplink.webp',
  'logitech':          'img/brands-preview/logitech.webp',
  'cisco':             'img/brands-preview/cisco.png',
  'dahua':             'img/brands-preview/dahua.png',
  'ezviz':             'img/brands-preview/ezviz.png',
  'ubiquiti':          'img/brands-preview/ubiquiti.png',
  'mikrotik':          'img/brands-preview/mikrotik.png',
  'zkteco':            'img/brands-preview/zkteco.png',
  'juniper':           'img/brands-preview/juniper.png',
  'lg':                'img/brands-preview/lg.png',
  'linksys':           'img/brands-preview/linksys.png',
  'netgear':           'img/brands-preview/netgear.png',
  'panasonic':         'img/brands-preview/panasonic.png',
  'paradox':           'img/brands-preview/paradox.png',
  'schneider electric':'img/brands-preview/schneiderelectric.png',
  'siemens':           'img/brands-preview/siemens.png',
  'tesla':             'img/brands-preview/tesla.png',
  'uniview':           'img/brands-preview/uniview.png',
  'victron energy':    'img/brands-preview/victronenergy.png',
  'mitsubishi':        'img/brands-preview/mitsubishi.png',
};

// Mapa de logos de marcas por nombre (clave en minúsculas)
const BRAND_LOGOS = {
  'dell':              'img/marcas/dell.svg',
  'lenovo':            'img/marcas/lenovo.svg',
  'epson':             'img/marcas/epson.svg',
  'hikvision':         'img/marcas/hikvision.svg',
  'samsung':           'img/marcas/samsung.svg',
  'hp':                'img/marcas/hp.svg',
  'tp-link':           'img/marcas/tp-link.svg',
  'logitech':          'img/marcas/logitech.svg',
  'cisco':             'img/marcas/cisco.svg',
  'dahua':             'img/marcas/dahua.svg',
  'ezviz':             'img/marcas/ezviz.svg',
  'ubiquiti':          'img/marcas/ubiquiti.svg',
  'mikrotik':          'img/marcas/mikrotik.svg',
  'zkteco':            'img/marcas/zkteco.png',
  'juniper':           'img/marcas/juniper.svg',
  'lg':                'img/marcas/lg.svg',
  'linksys':           'img/marcas/linksys.svg',
  'netgear':           'img/marcas/netgear.svg',
  'panasonic':         'img/marcas/panasonic.svg',
  'paradox':           'img/marcas/paradox.svg',
  'schneider electric':'img/marcas/schneiderelectric.svg',
  'siemens':           'img/marcas/siemens.svg',
  'tesla':             'img/marcas/tesla.svg',
  'uniview':           'img/marcas/uniview.svg',
  'victron energy':    'img/marcas/victronenergy.svg',
  'mitsubishi':        'img/marcas/mitsubishi.svg',
};

/**
 * Enriquece el hero de la página de marca con la imagen de producto
 * y el logo de la marca flotante.
 */
function enrichBrandHero(brandName) {
  const heroSection = document.querySelector('.brand-hero');
  if (!heroSection) return;

  const brandKey = brandName.toLowerCase().trim();
  const previewSrc = BRAND_PREVIEW_IMAGES[brandKey];
  const logoSrc = BRAND_LOGOS[brandKey];

  if (!previewSrc) return;

  // Cambiar el layout del hero para soportar imagen de producto
  const heroContent = heroSection.querySelector('.brand-hero-content');
  if (!heroContent) return;

  // Reestructurar el hero con un layout flex que muestre texto e imagen
  heroSection.style.cssText = `
    position: relative;
    height: auto;
    min-height: 320px;
    display: flex;
    align-items: center;
    background-size: cover;
    background-position: center;
    color: #fff;
    overflow: hidden;
    background-image: url('img/hero-tech-bg.webp');
  `;

  // Crear el contenedor interno con layout de dos columnas
  const innerWrapper = document.createElement('div');
  innerWrapper.className = 'container';
  innerWrapper.style.cssText = `
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    padding: 40px 20px;
    width: 100%;
  `;

  // Clonar el contenido original de texto
  const textClone = heroContent.cloneNode(true);
  textClone.style.cssText = `
    position: static;
    z-index: auto;
    flex: 1;
    min-width: 0;
    max-width: 560px;
  `;

  // Crear la sección de imagen de producto
  const imgWrapper = document.createElement('div');
  imgWrapper.style.cssText = `
    flex-shrink: 0;
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  `;

  const productImg = document.createElement('img');
  productImg.src = previewSrc;
  productImg.alt = `Productos ${brandName}`;
  productImg.loading = 'eager';
  productImg.decoding = 'async';
  productImg.style.cssText = `
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.12);
  `;
  imgWrapper.appendChild(productImg);

  // Agregar el logo de la marca sobre la imagen de producto
  if (logoSrc) {
    const logoImg = document.createElement('img');
    logoImg.src = logoSrc;
    logoImg.alt = `Logo ${brandName}`;
    logoImg.loading = 'eager';
    logoImg.decoding = 'async';
    logoImg.style.cssText = `
      height: 36px;
      width: auto;
      max-width: 160px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      opacity: 0.9;
    `;
    imgWrapper.appendChild(logoImg);
  }

  innerWrapper.appendChild(textClone);
  innerWrapper.appendChild(imgWrapper);

  // Reemplazar el contenido del hero
  heroSection.innerHTML = `
    <div style="content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(9,16,24,0.85) 0%,rgba(9,16,24,0.45) 100%);z-index:1;"></div>
  `;
  heroSection.appendChild(innerWrapper);

  // Media query JS para ocultar la imagen en móvil
  const mq = window.matchMedia('(max-width: 768px)');
  const applyMobile = (e) => {
    if (e.matches) {
      imgWrapper.style.display = 'none';
    } else {
      imgWrapper.style.display = 'flex';
    }
  };
  mq.addEventListener('change', applyMobile);
  applyMobile(mq);
}

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  const container = document.getElementById('brand-products-container');
  if (!container) return;

  const brandName = document.body.dataset.brandName;
  if (!brandName) {
    console.error('No brand name defined on document.body.dataset.brandName');
    return;
  }

  // Enriquecer el hero con imagen del producto
  enrichBrandHero(brandName);

  // 1. Esperar a que la base de datos esté cargada
  if (window.FutunetData && window.FutunetData.readyPromise) {
    await window.FutunetData.readyPromise;
  }

  const products = window.mockDatabase || window.FutunetData?.products || [];
  
  // 2. Filtrar productos de la marca (insensible a mayúsculas/minúsculas)
  const brandProducts = products.filter(p => {
    return String(p.brand || '').toLowerCase().trim() === brandName.toLowerCase().trim();
  });

  // Actualizar contador de productos si existe
  const counterEl = document.getElementById('brand-products-count');
  if (counterEl) {
    counterEl.textContent = `${brandProducts.length} producto${brandProducts.length !== 1 ? 's' : ''} registrado${brandProducts.length !== 1 ? 's' : ''}`;
  }

  // 3. Renderizar productos o Empty State
  if (brandProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-state reveal in" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
        <div class="empty-state-icon" style="font-size: 3rem; color: #94a3b8; margin-bottom: 15px;">
          <i data-lucide="package-open"></i>
        </div>
        <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #0a101d; margin: 0 0 10px;">
          Sin productos en stock
        </h3>
        <p style="color: #64748b; max-width: 480px; margin: 0 auto 20px; font-size: 0.95rem; line-height: 1.6;">
          Actualmente no tenemos artículos de <strong>${escapeHTML(brandName)}</strong> en el catálogo en línea. Sin embargo, somos distribuidores oficiales y podemos importar y cotizar cualquier equipo bajo pedido.
        </p>
        <div class="empty-state-actions" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a class="btn btn-wa" href="https://wa.me/18297411041?text=Hola%20Futunet%2C%20quisiera%20cotizar%20equipos%20de%20la%20marca%20${encodeURIComponent(brandName)}." target="_blank" style="display: inline-flex; align-items: center; gap: 8px;">
            <i data-lucide="message-circle"></i> Cotizar ${escapeHTML(brandName)} por WhatsApp
          </a>
          <a class="btn btn-outline" href="catalogo.html" style="display: inline-flex; align-items: center; gap: 8px;">
            <i data-lucide="arrow-left"></i> Ver Catálogo Completo
          </a>
        </div>
      </div>
    `;
  } else {
    // Usar el renderizador oficial de catalog.js
    if (typeof window.renderProductsGrid === 'function') {
      window.renderProductsGrid(brandProducts, { target: container });
      
      // Si la UI del carrito tiene que inicializarse para los botones nuevos
      if (typeof window.updateInlineCartButtons === 'function') {
        window.updateInlineCartButtons();
      }
    } else {
      console.error('renderProductsGrid function is not defined in window');
    }
  }

  // Inicializar los iconos de Lucide cargados dinámicamente
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ root: container });
  }

  function escapeHTML(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
});
