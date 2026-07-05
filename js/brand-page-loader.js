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
  'cisco':             'img/brands-preview/cisco.webp',
  'dahua':             'img/brands-preview/dahua.webp',
  'ezviz':             'img/brands-preview/ezviz.webp',
  'ubiquiti':          'img/brands-preview/ubiquiti.webp',
  'mikrotik':          'img/brands-preview/mikrotik.webp',
  'zkteco':            'img/brands-preview/zkteco.webp',
  'juniper':           'img/brands-preview/juniper.webp',
  'lg':                'img/brands-preview/lg.webp',
  'linksys':           'img/brands-preview/linksys.webp',
  'netgear':           'img/brands-preview/netgear.webp',
  'panasonic':         'img/brands-preview/panasonic.webp',
  'paradox':           'img/brands-preview/paradox.webp',
  'schneider electric':'img/brands-preview/schneiderelectric.webp',
  'siemens':           'img/brands-preview/siemens.webp',
  'tesla':             'img/brands-preview/tesla.webp',
  'uniview':           'img/brands-preview/uniview.webp',
  'victron energy':    'img/brands-preview/victronenergy.webp',
  'mitsubishi':        'img/brands-preview/mitsubishi.png',
};

// Mapa de servicios sugeridos y descripciones de venta cruzada por marca
const BRAND_SERVICE_MAPPING = {
  'cisco': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'Cisco es nuestro proveedor de confianza para redes y switches de nivel empresarial.' },
  'juniper': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'Juniper equipa nuestras infraestructuras de enrutamiento y seguridad de datos robustas.' },
  'mikrotik': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'MikroTik es ideal para balanceo de carga de internet y administración de redes inalámbricas.' },
  'tp-link': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'TP-Link es nuestra marca de elección para redes Mesh y conectividad rápida.' },
  'netgear': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'Netgear es el estándar de conectividad confiable para oficinas inteligentes.' },
  'linksys': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'Linksys ofrece enrutadores residenciales y de oficina ágiles y sencillos.' },
  'ubiquiti': { name: 'Redes y Datos', url: 'redes-datos.html', icon: 'fa-network-wired', text: 'Ubiquiti (UniFi) es nuestra plataforma favorita de WiFi Mesh de alta gama.' },
  'hikvision': { name: 'Seguridad Electrónica', url: 'seguridad-electronica.html', icon: 'fa-shield-alt', text: 'Hikvision es líder en equipamiento para nuestros sistemas de videovigilancia y cámaras IP.' },
  'dahua': { name: 'Seguridad Electrónica', url: 'seguridad-electronica.html', icon: 'fa-shield-alt', text: 'Dahua destaca en cámaras inteligentes e integración de CCTV de alta definición.' },
  'ezviz': { name: 'Seguridad Electrónica', url: 'seguridad-electronica.html', icon: 'fa-shield-alt', text: 'Ezviz equipa nuestros hogares con cámaras inteligentes inalámbricas autogestionables.' },
  'paradox': { name: 'Seguridad Electrónica', url: 'seguridad-electronica.html', icon: 'fa-shield-alt', text: 'Paradox es nuestra marca de referencia para sistemas de alarma contra intrusión.' },
  'zkteco': { name: 'Seguridad Electrónica', url: 'seguridad-electronica.html', icon: 'fa-shield-alt', text: 'ZKTeco provee los biométricos y controladores de asistencia para nuestros accesos.' },
  'uniview': { name: 'Seguridad Electrónica', url: 'seguridad-electronica.html', icon: 'fa-shield-alt', text: 'Uniview destaca en cámaras IP de seguridad activa y monitoreo 24/7.' },
  'mitsubishi': { name: 'Energía y Climatización', url: 'energia-climatizacion.html', icon: 'fa-solar-panel', text: 'Mitsubishi Electric provee sistemas de aire acondicionado eficientes de alta gama.' },
  'victron energy': { name: 'Energía y Climatización', url: 'energia-climatizacion.html', icon: 'fa-solar-panel', text: 'Victron Energy es nuestra marca de elección para inversores y cargadores solares.' },
  'schneider electric': { name: 'Energía y Climatización', url: 'energia-climatizacion.html', icon: 'fa-solar-panel', text: 'Schneider Electric ofrece el mejor respaldo y supresión de picos eléctricos.' },
  'tesla': { name: 'Energía y Climatización', url: 'energia-climatizacion.html', icon: 'fa-solar-panel', text: 'Tesla Powerwall e inversores proveen el respaldo energético definitivo.' },
  'dell': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-laptop', text: 'Dell es nuestro estándar de laptops corporativas, servidores de datos y estaciones de trabajo.' },
  'hp': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-laptop', text: 'HP provee laptops robustas, ordenadores de escritorio e impresoras comerciales.' },
  'lenovo': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-laptop', text: 'Lenovo es el líder de fiabilidad y laptops ThinkPad para oficinas de alto ritmo.' },
  'epson': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-laptop', text: 'Epson es la marca que integra nuestros sistemas de impresión y proyectores.' },
  'logitech': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-keyboard', text: 'Logitech ofrece teclados, mouses y periféricos para colaboración y videollamadas.' },
  'lg': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-desktop', text: 'LG equipa salas de conferencias y oficinas con pantallas y monitores premium.' },
  'samsung': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-hdd', text: 'Samsung destaca en almacenamiento SSD ultra-rápido y monitores de oficina.' },
  'siemens': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-network-wired', text: 'Siemens es ideal para control industrial e infraestructura automatizada de oficinas.' },
  'panasonic': { name: 'Equipos de Oficina', url: 'equipos-oficina.html', icon: 'fa-phone-alt', text: 'Panasonic es nuestro proveedor para telefonía IP y centrales analógicas híbridas.' }
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

  // Insertar banner de venta cruzada si la marca tiene un servicio sugerido
  const serviceInfo = BRAND_SERVICE_MAPPING[brandName.toLowerCase().trim()];
  if (serviceInfo) {
    const bannerDiv = document.createElement('div');
    bannerDiv.className = 'cross-selling-banner reveal';
    bannerDiv.style.cssText = 'max-width: 1200px; margin: 0 auto 30px; padding: 0 20px;';
    bannerDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas ${serviceInfo.icon}"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">Instalación técnica de equipos ${brandName}</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">${serviceInfo.text} Además de la venta, proveemos servicios especializados de diseño y soporte en República Dominicana.</p>
          </div>
        </div>
        <a href="${serviceInfo.url}" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Servicio de ${serviceInfo.name}
        </a>
      </div>
    `;
    container.parentNode.insertBefore(bannerDiv, container);
  }

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
          Actualmente no tenemos artículos de <strong>${escapeHTML(brandName)}</strong> publicados en el catálogo en línea. Podemos consultar disponibilidad y preparar una cotización bajo pedido.
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

  function escapeHTML(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
