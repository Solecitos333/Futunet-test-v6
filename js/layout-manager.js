/**
 * Futunet Website Layout Manager
 * Dynamically reorders sections, sets visibility, and overrides text based on Firestore config
 */
var FUTUNET_LAYOUT = {
  sections: [
    { id: 'inicio', name: 'Banner Rotativo', visible: true, title: 'La tecnología del<br><span class="hero-title-accent">futuro</span>', subtitle: '' },
    { id: 'productos-categoria', name: 'Productos por Categoría', visible: true, title: 'Productos por categoría', subtitle: 'Explora nuestro catálogo organizado por departamento y encuentra lo que necesitas.' },
    { id: 'destacados-catalogo', name: 'Artículos Destacados', visible: true, title: 'Artículos destacados del catálogo', subtitle: 'Descubre productos listos para cotizar y entra directo al detalle que más se parezca a lo que estás buscando.' },
    { id: 'servicios', name: 'Nuestros Servicios / Soluciones', visible: true, title: 'Soluciones para vender, operar y proteger mejor', subtitle: 'Explora las áreas en las que acompañamos a empresas, instituciones y hogares con equipos, instalación y soporte.' },
    { id: 'equipa-oficina', name: 'Equipa tu Oficina', visible: true, title: 'Equipa tu oficina', subtitle: 'Encuentra desde computadoras hasta mobiliario. Todo para que tu espacio de trabajo funcione al máximo.' },
    { id: 'marcas', name: 'Logos de Marcas', visible: true, title: 'Marcas con las que trabajamos', subtitle: 'Pasa el cursor sobre una marca para descubrir sus productos destacados.' },
    { id: 'nosotros', name: 'Quiénes Somos', visible: true, title: 'Tecnología con criterio, servicio con respaldo', subtitle: '' },
    { id: 'contacto', name: 'Contacto / Mensaje', visible: true, title: 'Conversemos sobre lo que necesitas', subtitle: 'Escríbenos y recibe una orientación clara para tu compra, tu instalación o tu próximo proyecto.' }
  ]
};

(function () {
  'use strict';

  function waitFirebase() {
    return new Promise(function (resolve) {
      var count = 0;
      var interval = setInterval(function () {
        if (window.FutunetFirebase && window.FutunetFirebase.db) {
          clearInterval(interval);
          resolve(true);
        } else {
          count++;
          if (count > 20) { // 1 second timeout
            clearInterval(interval);
            resolve(false);
          }
        }
      }, 50);
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    // Hide static dividers first
    var staticDividers = document.querySelectorAll('.section-divider');
    staticDividers.forEach(function (div) {
      div.style.display = 'none';
    });

    try {
      var firebaseReady = await waitFirebase();
      if (firebaseReady) {
        var db = window.FutunetFirebase.db;
        var doc = await db.collection('config').doc('layout').get();
        if (doc.exists) {
          var data = doc.data();
          if (data.sections && Array.isArray(data.sections)) {
            // Merge Firestore settings into FUTUNET_LAYOUT
            FUTUNET_LAYOUT.sections = data.sections;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load dynamic layout, using defaults:', e);
    } finally {
      applyLayout();
      setupPreviewMode();
    }
  });

  function applyLayout() {
    var main = document.getElementById('main-content');
    if (!main) return;

    var sectionsMap = {};
    FUTUNET_LAYOUT.sections.forEach(function (sec) {
      var el = document.getElementById(sec.id);
      if (el) {
        sectionsMap[sec.id] = el;
        el.remove(); // Detach from DOM temporarily
      }
    });

    var visibleElements = [];

    FUTUNET_LAYOUT.sections.forEach(function (sec) {
      var el = sectionsMap[sec.id];
      if (el) {
        if (sec.visible) {
          el.style.display = '';
          main.appendChild(el);
          visibleElements.push(el);

          // If it is 'inicio', also append the trust bar items
          if (sec.id === 'inicio') {
            var anchor = document.getElementById('trust-bar-home-anchor');
            var bar = document.getElementById('home-trust-bar');
            if (anchor) main.appendChild(anchor);
            if (bar) main.appendChild(bar);
          }

          updateSectionTexts(sec);
        } else {
          el.style.display = 'none';
          main.appendChild(el); // Re-append but hide it
        }
      }
    });

    // Remove any previous dynamic dividers
    var oldDynamicDividers = document.querySelectorAll('.dynamic-divider');
    oldDynamicDividers.forEach(function (d) { d.remove(); });

    // Inject dynamic dividers between visible elements (excluding after the last visible element)
    for (var i = 0; i < visibleElements.length - 1; i++) {
      var el = visibleElements[i];
      var divider = document.createElement('hr');
      divider.className = 'section-divider dynamic-divider';
      
      // If the current element is 'inicio', insert divider after the home-trust-bar
      if (el.id === 'inicio') {
        var bar = document.getElementById('home-trust-bar');
        if (bar) {
          bar.after(divider);
        } else {
          el.after(divider);
        }
      } else {
        el.after(divider);
      }
    }

    reorderNavbarLinks();
  }

  function updateSectionTexts(sec) {
    var el = document.getElementById(sec.id);
    if (!el) return;

    // Title mapping
    var titleEl = el.querySelector('.section-title');
    if (sec.id === 'inicio') {
      titleEl = el.querySelector('.hero-title');
    }
    if (titleEl && sec.title) {
      titleEl.innerHTML = sec.title;
    }

    // Subtitle mapping
    var subEl = el.querySelector('.section-sub');
    if (subEl && sec.subtitle) {
      subEl.textContent = sec.subtitle;
    }
  }

  function reorderNavbarLinks() {
    var desktopMenu = document.querySelector('.nav-menu');
    var mobileMenu = document.getElementById('mobileMenu');

    if (desktopMenu) {
      var lis = Array.from(desktopMenu.querySelectorAll('li'));
      var liMap = {};
      var otherLis = [];

      lis.forEach(function (li) {
        var a = li.querySelector('a');
        if (a) {
          var href = a.getAttribute('href') || '';
          if (href.startsWith('#')) {
            var id = href.substring(1);
            liMap[id] = li;
          } else {
            otherLis.push(li);
          }
        } else {
          otherLis.push(li);
        }
        li.remove();
      });

      // Append sections links in order
      FUTUNET_LAYOUT.sections.forEach(function (sec) {
        var li = liMap[sec.id];
        if (li) {
          if (sec.visible) {
            desktopMenu.appendChild(li);
          }
        }
      });

      // Append other static links
      otherLis.forEach(function (li) {
        desktopMenu.appendChild(li);
      });
    }

    if (mobileMenu) {
      var nodes = Array.from(mobileMenu.childNodes);
      var anchorsMap = {};
      var otherNodes = [];

      nodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          var href = node.getAttribute('href') || '';
          if (href.startsWith('#')) {
            var id = href.substring(1);
            anchorsMap[id] = node;
          } else {
            otherNodes.push(node);
          }
        } else {
          otherNodes.push(node);
        }
        node.remove();
      });

      // Append sections links in order
      FUTUNET_LAYOUT.sections.forEach(function (sec) {
        var a = anchorsMap[sec.id];
        if (a) {
          if (sec.visible) {
            mobileMenu.appendChild(a);
          }
        }
      });

      // Re-append other nodes
      otherNodes.forEach(function (node) {
        mobileMenu.appendChild(node);
      });
    }
  }

  function setupPreviewMode() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('preview') === 'true') {
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (a) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Preview mode: link click prevented.', a.getAttribute('href'));
        }
      }, true);
    }
  }

  // Export layout update API for real-time visual iframe communication
  window.FutunetLayout = {
    applyLiveChanges: function (sectionsConfig) {
      FUTUNET_LAYOUT.sections = sectionsConfig;
      applyLayout();
    }
  };
})();
