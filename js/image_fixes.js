/**
 * IMAGE FIXES — Imágenes locales optimizadas para productos del catálogo.
 * Todas las imágenes están en img/productos/catalogo/ y fueron
 * optimizadas a 400px max, JPEG calidad 75% (~6-16KB c/u).
 */
(function() {
  if (typeof mockDatabase === 'undefined') return;

  var base = 'img/productos/catalogo/';

  var imageCorrections = {
    // ─── TECNOLOGÍA ───
    'prod_ad1d2a977b': base + 'airpods-2gen.jpg',       // AirPods 2da Gen Apple
    'prod_jfwxxu99l':  base + 'sandisk-32gb.jpg',       // Memoria USB SanDisk 32GB
    'prod_bbdw9woh3':  base + 'regleta.jpg',            // Regleta 6 enchufes
    'prod_4zs3vjzp7':  base + 'regleta.jpg',            // Regulador voltaje

    // ─── IMPRESORAS ───
    'prod_p0wqnr5bc':  base + 'brother-t720dw.jpg',     // Brother DCP-T720DW
    'prod_oh55hargc':  base + 'canon-pixma-g2110.jpg',  // Canon Pixma G2110

    // ─── SEGURIDAD ───
    'prod_v4n47vlw2':  base + 'dvr-hikvision.jpg',      // DVR 16 CH Hikvision
    'prod_8ymxsbgt5':  base + 'cerradura-magnetica.jpg', // Cerradura magnética
    'prod_dgb61tzu9':  base + 'dvr-hikvision.jpg',      // NVR UNV 8 POE (similar)

    // ─── REDES ───
    'prod_fy2c5keb5':  base + 'gabinete-9u.jpg',        // Gabinete 9U
    'prod_e9yrvwgwu':  base + 'gabinete-9u.jpg',        // Gabinete 4U (similar)

    // ─── MOBILIARIO ───
    'prod_0r5dh65ow':  base + 'sillon-ejecutivo.jpg',   // Sillón ejecutivo
    'prod_16sjt1g9y':  base + 'sillon-ejecutivo.jpg',   // Sillón ejecutivo negro

    // ─── PAPELERÍA ───
    'prod_qch1yu72k':  base + 'resma-papel.jpg',        // Resma 8.5x11
    'prod_apm0zzqc5':  base + 'resma-papel.jpg',        // Resma 8.5x14
    'prod_iq0yf8kja':  base + 'resma-papel.jpg',        // Caja resmas
  };

  // Aplicar correcciones
  var fixed = 0;
  mockDatabase.forEach(function(product) {
    if (imageCorrections[product.id]) {
      product.img = imageCorrections[product.id];
      product.gallery = [imageCorrections[product.id]];
      fixed++;
    }
  });

  console.log('[Futunet] ' + fixed + ' imagenes corregidas con archivos locales.');
})();
