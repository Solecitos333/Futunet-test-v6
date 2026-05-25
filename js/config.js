/**
 * Futunet Global Configuration
 * Contiene variables globales que se usan a lo largo del sitio (contactos, emails, etc.)
 * Se sincroniza dinámicamente con Firestore si está disponible.
 */
var FUTUNET_CONFIG = {
  WHATSAPP_NUMBER: '18297411041',
  SITE_NAME: 'Futunet',
  ADVISOR_NAME: 'Orbis Espinal',
  ADDRESS: 'Santiago, República Dominicana',
  MAP_URL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.2701467439566!2d-70.6869408!3d19.4547464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI3JzE3LjEiTiA3MMKwNDEnMTMuMCJX!5e0!3m2!1ses!2sdo!4v1655000000000!5m2!1ses!2sdo',
  INSTAGRAM_URL: '',
  FACEBOOK_URL: '',
  MAINTENANCE_MODE: false,
  MAINTENANCE_MESSAGE: 'Estamos realizando mejoras en nuestra tienda online. Por favor, vuelve más tarde o contáctanos por WhatsApp.',
  GEMINI_API_KEY: 'AIzaSyA9ei4VUYIE7hk-M8dpBD3awjdWEpgrmLA'
};

(function () {
  'use strict';

  var resolveConfig;
  window.FutunetConfigReady = new Promise(function (resolve) {
    resolveConfig = resolve;
  });

  // Helper to wait until window.FutunetFirebase is available (max 1 second)
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
    try {
      var firebaseReady = await waitFirebase();
      if (firebaseReady) {
        var db = window.FutunetFirebase.db;
        var doc = await db.collection('config').doc('site').get();
        if (doc.exists) {
          var data = doc.data();
          if (data.whatsappNumber) FUTUNET_CONFIG.WHATSAPP_NUMBER = data.whatsappNumber;
          if (data.siteName) FUTUNET_CONFIG.SITE_NAME = data.siteName;
          if (data.advisorName) FUTUNET_CONFIG.ADVISOR_NAME = data.advisorName;
          if (data.address) FUTUNET_CONFIG.ADDRESS = data.address;
          if (data.mapUrl) FUTUNET_CONFIG.MAP_URL = data.mapUrl;
          if (data.instagramUrl) FUTUNET_CONFIG.INSTAGRAM_URL = data.instagramUrl;
          if (data.facebookUrl) FUTUNET_CONFIG.FACEBOOK_URL = data.facebookUrl;
          if (data.maintenanceMessage) FUTUNET_CONFIG.MAINTENANCE_MESSAGE = data.maintenanceMessage;
          if (data.maintenanceMode !== undefined) FUTUNET_CONFIG.MAINTENANCE_MODE = data.maintenanceMode;
          if (data.geminiApiKey) FUTUNET_CONFIG.GEMINI_API_KEY = data.geminiApiKey;
        }
      }
    } catch (e) {
      console.warn('Failed to load dynamic config, using defaults:', e);
    } finally {
      handleMaintenance();
      updateDOMDetails();
      resolveConfig();
    }
  });

  function handleMaintenance() {
    var path = window.location.pathname.toLowerCase();
    var isAdmin = path.includes('admin.html') || path.includes('login.html');
    
    if (FUTUNET_CONFIG.MAINTENANCE_MODE && !isAdmin) {
      var bypass = false;
      try {
        var authData = localStorage.getItem('futunet_auth_user');
        if (authData) {
          var userObj = JSON.parse(authData);
          if (userObj.role === 'admin' || userObj.role === 'superadmin' || userObj.role === 'editor') {
            bypass = true;
          }
        }
      } catch (err) {}

      if (!bypass) {
        document.body.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; background:#0f1923; color:white; font-family:\'Outfit\', sans-serif; text-align:center; padding:20px; box-sizing:border-box;">' +
          '<img src="img/logo-navbar.png" style="max-height:80px; margin-bottom:32px;">' +
          '<h1 style="font-family:\'Space Grotesk\', sans-serif; font-size:2rem; font-weight:700; margin-bottom:16px;">Sitio en Mantenimiento</h1>' +
          '<p style="color:#a0b0c4; max-width:500px; font-size:1rem; line-height:1.6; margin-bottom:32px;">' + escapeHtml(FUTUNET_CONFIG.MAINTENANCE_MESSAGE) + '</p>' +
          '<a href="https://wa.me/' + FUTUNET_CONFIG.WHATSAPP_NUMBER + '" style="display:inline-flex; align-items:center; gap:8px; background:#0A70A2; color:white; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:600; transition: background 0.2s;">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
          'Contactar por WhatsApp' +
          '</a>' +
          '</div>';
        document.title = 'Mantenimiento — ' + FUTUNET_CONFIG.SITE_NAME;
      }
    }
  }

  function updateDOMDetails() {
    // 1. Rewrite WhatsApp Links
    var links = document.querySelectorAll('a[href*="wa.me"]');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      var textMatch = href.match(/text=([^&]+)/);
      var text = textMatch ? textMatch[1] : '';
      
      var newHref = 'https://wa.me/' + FUTUNET_CONFIG.WHATSAPP_NUMBER;
      if (text) {
        newHref += '?text=' + text;
      }
      link.setAttribute('href', newHref);
    });

    // 2. Rewrite Advisor Name in Footer/Contacts
    var footerLinks = document.querySelectorAll('footer a, .footer a, .contact-details a');
    footerLinks.forEach(function (el) {
      if (el.textContent.includes('Orbis Espinal') || el.textContent.includes('Asesor')) {
        var iconHtml = el.querySelector('i') ? el.querySelector('i').outerHTML + ' ' : '';
        el.innerHTML = iconHtml + escapeHtml(FUTUNET_CONFIG.ADVISOR_NAME);
      }
    });

    // 3. Rewrite Address
    var addressEl = document.getElementById('footer-address');
    if (addressEl) {
      addressEl.textContent = FUTUNET_CONFIG.ADDRESS;
    }
    var footerSpans = document.querySelectorAll('footer span, .footer span');
    footerSpans.forEach(function (span) {
      if (span.textContent.includes('Santiago, República Dominicana')) {
        span.textContent = FUTUNET_CONFIG.ADDRESS;
      }
    });

    // 4. Google Maps Iframe
    var mapIframe = document.querySelector('.contact-map-frame');
    if (mapIframe && FUTUNET_CONFIG.MAP_URL) {
      mapIframe.setAttribute('data-src', FUTUNET_CONFIG.MAP_URL);
      if (mapIframe.getAttribute('src')) {
        mapIframe.setAttribute('src', FUTUNET_CONFIG.MAP_URL);
      }
    }

    // 5. Social Links
    if (FUTUNET_CONFIG.INSTAGRAM_URL) {
      var instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
      instagramLinks.forEach(function (link) {
        link.setAttribute('href', FUTUNET_CONFIG.INSTAGRAM_URL);
      });
    }
    
    if (FUTUNET_CONFIG.FACEBOOK_URL) {
      var facebookLinks = document.querySelectorAll('a[href*="facebook.com"]');
      facebookLinks.forEach(function (link) {
        link.setAttribute('href', FUTUNET_CONFIG.FACEBOOK_URL);
      });
    }
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
})();
