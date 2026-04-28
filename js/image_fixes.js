/**
 * IMAGE & BRAND FIXES — Correcciones de imágenes y marcas del catálogo.
 * Imágenes locales optimizadas en img/productos/catalogo/ (~6-34KB c/u).
 * También corrige el campo "brand" donde estaba como "Genérico" pero
 * el producto claramente pertenece a una marca conocida.
 */
(function() {
  if (typeof mockDatabase === 'undefined') return;

  var base = 'img/productos/catalogo/';

  // ── Mapeo de imágenes: id → ruta local ──
  var imageCorrections = {
    // TECNOLOGÍA
    'prod_ad1d2a977b': base + 'airpods-2gen.jpg',
    'prod_jfwxxu99l':  base + 'sandisk-32gb.jpg',
    'prod_bbdw9woh3':  base + 'regleta.jpg',
    'prod_4zs3vjzp7':  base + 'regleta.jpg',

    // IMPRESORAS
    'prod_p0wqnr5bc':  base + 'brother-t720dw.jpg',
    'prod_oh55hargc':  base + 'canon-pixma-g2110.jpg',

    // SEGURIDAD
    'prod_v4n47vlw2':  base + 'dvr-hikvision.jpg',
    'prod_8ymxsbgt5':  base + 'cerradura-magnetica.jpg',
    'prod_dgb61tzu9':  base + 'dvr-hikvision.jpg',

    // REDES
    'prod_fy2c5keb5':  base + 'gabinete-9u.jpg',
    'prod_e9yrvwgwu':  base + 'gabinete-9u.jpg',

    // MOBILIARIO
    'prod_0r5dh65ow':  base + 'sillon-ejecutivo.jpg',
    'prod_16sjt1g9y':  base + 'sillon-ejecutivo.jpg',

    // PAPELERÍA
    'prod_qch1yu72k':  base + 'resma-papel.jpg',
    'prod_apm0zzqc5':  base + 'resma-papel.jpg',
    'prod_iq0yf8kja':  base + 'resma-papel.jpg',

    // ── REMOZAMIENTO PROFESIONAL ──
    // Masilla y cemento
    'prod_8rfkpfrr5':  base + 'masilla-pared.jpg',
    'prod_eb42bviah':  base + 'cemento-blanco.jpg',

    // Tubos EMT
    'prod_g7qgkxtxx':  base + 'tubo-emt.jpg',
    'prod_9np542ifb':  base + 'tubo-emt.jpg',

    // Abrazaderas
    'prod_az3no4o95':  base + 'abrazadera-emt.jpg',
    'prod_fcy8mcikv':  base + 'abrazadera-emt.jpg',

    // Canaletas
    'prod_eo19bm16r':  base + 'canaleta.jpg',
    'prod_oqlew24le':  base + 'canaleta.jpg',

    // Bandeja de pintar
    'prod_f1q0qx6zu':  base + 'bandeja-pintar.jpg',

    // Clavos y fulminantes
    'prod_ezp1r691s':  base + 'abrazadera-emt.jpg',
    'prod_y2gfa14aq':  base + 'abrazadera-emt.jpg',

    // Pinturas Tropical Contractor - ACEITE
    'prod_n7bai88lr':  base + 'pintura-tropical.jpg',
    'prod_93stq2iho':  base + 'pintura-tropical.jpg',
    'prod_40moje7n1':  base + 'pintura-tropical.jpg',
    'prod_4oeze720s':  base + 'pintura-tropical.jpg',
    'prod_s6k2b2ryv':  base + 'pintura-tropical.jpg',

    // Pinturas Tropical Contractor - ACRÍLICA
    'prod_z9tchehec':  base + 'pintura-acrilica.jpg',
    'prod_q3nyu1krp':  base + 'pintura-acrilica.jpg',
    'prod_md19tjedi':  base + 'pintura-acrilica.jpg',
    'prod_n3ztv716j':  base + 'pintura-acrilica.jpg',
    'prod_t1bmccu62':  base + 'pintura-acrilica.jpg',
    'prod_p8lzfw2vt':  base + 'pintura-acrilica.jpg',
    'prod_9xnj1gt0v':  base + 'pintura-acrilica.jpg',
    'prod_pjadtbhcu':  base + 'pintura-acrilica.jpg',
    'prod_s7d6mohv1':  base + 'pintura-acrilica.jpg',
    'prod_b1stfwogk':  base + 'pintura-acrilica.jpg',

    // Pinturas Eagle Paint
    'prod_2myrj6khg':  base + 'pintura-eagle.jpg',
    'prod_xxweuj8jv':  base + 'pintura-eagle.jpg',
    'prod_zy76m8zd6':  base + 'pintura-eagle.jpg',
    'prod_rmyxcpakp':  base + 'pintura-eagle.jpg',
    'prod_xazd3zzyh':  base + 'pintura-eagle.jpg',
    'prod_wybmj5f8n':  base + 'pintura-eagle.jpg',
    'prod_oaw5ld8vk':  base + 'pintura-eagle.jpg',
    'prod_nfq7ja7e9':  base + 'pintura-eagle.jpg',
    'prod_tgyesgpad':  base + 'pintura-eagle.jpg',
    'prod_bn9537a85':  base + 'pintura-eagle.jpg',

    // Pinturas Popular
    'prod_bgetiqf59':  base + 'pintura-aceite.jpg',
    'prod_aqczvi4c0':  base + 'pintura-aceite.jpg',
    'prod_jl92gbzbz':  base + 'pintura-acrilica.jpg',
    'prod_od0le1w47':  base + 'pintura-acrilica.jpg',

    // Pinturas genéricas / Anticorrosivo
    'prod_mdd2eayir':  base + 'pintura-aceite.jpg',
    'prod_pmt5gobeh':  base + 'pintura-acrilica.jpg',
    'prod_vf9g9ypru':  base + 'pintura-acrilica.jpg',
    'prod_bqs26gjpy':  base + 'pintura-acrilica.jpg',
    'prod_wu9zt66ic':  base + 'pintura-acrilica.jpg',
  };

  // ── Corrección de marcas: id → marca real ──
  var brandCorrections = {
    // Apple
    'prod_ad1d2a977b': 'Apple',

    // SanDisk
    'prod_jfwxxu99l': 'SanDisk',

    // Brother
    'prod_p0wqnr5bc': 'Brother',

    // Canon
    'prod_oh55hargc': 'Canon',
    'prod_3bma5wlf5': 'Canon',

    // Hikvision
    'prod_v4n47vlw2': 'Hikvision',

    // Tropical Contractor
    'prod_n7bai88lr':  'Tropical',
    'prod_93stq2iho':  'Tropical',
    'prod_40moje7n1':  'Tropical',
    'prod_4oeze720s':  'Tropical',
    'prod_s6k2b2ryv':  'Tropical',
    'prod_z9tchehec':  'Tropical',
    'prod_q3nyu1krp':  'Tropical',
    'prod_md19tjedi':  'Tropical',
    'prod_n3ztv716j':  'Tropical',
    'prod_t1bmccu62':  'Tropical',
    'prod_p8lzfw2vt':  'Tropical',
    'prod_9xnj1gt0v':  'Tropical',
    'prod_pjadtbhcu':  'Tropical',
    'prod_s7d6mohv1':  'Tropical',
    'prod_b1stfwogk':  'Tropical',
    'prod_mdd2eayir':  'Tropical',

    // Eagle Paint
    'prod_2myrj6khg':  'Eagle Paint',
    'prod_xxweuj8jv':  'Eagle Paint',
    'prod_zy76m8zd6':  'Eagle Paint',
    'prod_rmyxcpakp':  'Eagle Paint',
    'prod_xazd3zzyh':  'Eagle Paint',
    'prod_wybmj5f8n':  'Eagle Paint',
    'prod_oaw5ld8vk':  'Eagle Paint',
    'prod_nfq7ja7e9':  'Eagle Paint',
    'prod_tgyesgpad':  'Eagle Paint',
    'prod_bn9537a85':  'Eagle Paint',

    // Popular
    'prod_bgetiqf59':  'Popular',
    'prod_aqczvi4c0':  'Popular',
    'prod_jl92gbzbz':  'Popular',
    'prod_od0le1w47':  'Popular',
  };

  // Aplicar correcciones
  var imgFixed = 0;
  var brandFixed = 0;
  mockDatabase.forEach(function(product) {
    if (imageCorrections[product.id]) {
      product.img = imageCorrections[product.id];
      product.gallery = [imageCorrections[product.id]];
      imgFixed++;
    }
    if (brandCorrections[product.id]) {
      product.brand = brandCorrections[product.id];
      brandFixed++;
    }
  });

  console.log('[Futunet] ' + imgFixed + ' imagenes corregidas, ' + brandFixed + ' marcas corregidas.');
})();
