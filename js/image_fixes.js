/**
 * IMAGE FIXES — Mapeo de imágenes verificadas para productos del catálogo.
 * Cada URL fue verificada manualmente a través de wsrv.nl proxy.
 * 
 * Este script se ejecuta después de inventory_data.js y supplier_inventory.js,
 * y corrige las imágenes genéricas con fotos reales de los productos.
 */
(function() {
  if (typeof mockDatabase === 'undefined') return;

  const imageCorrections = {
    // ─── TECNOLOGÍA Y ELECTRÓNICOS ───
    'prod_ad1d2a977b': 'https://wsrv.nl/?url=as-images.apple.com/is/MV7N2?wid=1000&hei=1000&fmt=jpeg&qlt=95&w=400&output=webp&q=75', // AirPods 2da Gen
    'prod_ppho60uwv': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-10077-01.jpg&w=400&output=webp&q=75', // TV - usando DVR placeholder por ahora
    'prod_fvb5vixvg': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-10149-01.jpg&w=400&output=webp&q=75', // Mouse USB
    'prod_w5fl5uh6a': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-10149-01.jpg&w=400&output=webp&q=75', // Mouse Inalámbrico
    'prod_jfwxxu99l': 'https://wsrv.nl/?url=i5.walmartimages.com/seo/SanDisk-Cruzer-Blade-32GB-USB-2-0-Flash-Drive-SDCZ50-032G-B35_89efbfd2-cabf-4061-9fc1-dcd34b671f66.2bfdfcd0c6a33912684484f44528f7f9.jpeg&w=400&output=webp&q=75', // SanDisk 32GB USB
    'prod_bbdw9woh3': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-13860-01.jpg&w=400&output=webp&q=75', // Regleta / Regulador
    'prod_4zs3vjzp7': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-13860-01.jpg&w=400&output=webp&q=75', // Regulador voltaje

    // ─── IMPRESORAS ───
    'prod_tk6it44v0': 'https://wsrv.nl/?url=meldim.com.ar/wp-content/uploads/2025/07/TP-POS80-USB.jpg&w=400&output=webp&q=75', // Impresora térmica POS
    'prod_p0wqnr5bc': 'https://wsrv.nl/?url=www.idcmayoristas.com/wp-content/uploads/2024/10/Impresora-Brother-Dcp-t720dw-008160-1.png&w=400&output=webp&q=75', // Brother T720
    'prod_oh55hargc': 'https://wsrv.nl/?url=i5.walmartimages.com/asr/81eda8b3-2ab7-4464-b3c0-73a2c7b0fa18.f3ae14f4a79da5edda886b66587465eb.jpeg&w=400&output=webp&q=75', // Canon Pixma G2110

    // ─── SEGURIDAD Y REDES ───
    'prod_v4n47vlw2': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-10077-01.jpg&w=400&output=webp&q=75', // DVR 16 CH Hikvision
    'prod_8ymxsbgt5': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-8688-01.jpg&w=400&output=webp&q=75', // Cerradura magnética
    'prod_dgb61tzu9': 'https://wsrv.nl/?url=down-id.img.susercontent.com/file/bc7de2feda5dcd87265588eb76664e29&w=400&output=webp&q=75', // NVR UNV 8 POE
    'prod_f754nr1g1': 'https://wsrv.nl/?url=cctvyalarmas.com/wp-content/uploads/2025/05/DS-3E1505P-EI.png&w=400&output=webp&q=75', // Switch POE
    'prod_fy2c5keb5': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-4285-01.jpg&w=400&output=webp&q=75', // Gabinete 9U

    // ─── MOBILIARIO DE OFICINA ───
    'prod_0r5dh65ow': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-4988-01.jpg&w=400&output=webp&q=75', // Sillón ejecutivo
    'prod_16sjt1g9y': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-4988-01.jpg&w=400&output=webp&q=75', // Sillón ejecutivo negro

    // ─── PAPELERÍA ───
    'prod_qch1yu72k': 'https://wsrv.nl/?url=cymcomputer.com/wp-content/uploads/2025/10/RESMA-DE-PAPEL-printon-8-12-x-11.jpg&w=400&output=webp&q=75', // Resma papel 8.5x11
    'prod_apm0zzqc5': 'https://wsrv.nl/?url=cymcomputer.com/wp-content/uploads/2025/10/RESMA-DE-PAPEL-printon-8-12-x-11.jpg&w=400&output=webp&q=75', // Resma 8.5x14
    'prod_fwntni0z7': 'https://wsrv.nl/?url=computodo.com.sv/wp-content/uploads/2024/09/Grapadora-Metal.png&w=400&output=webp&q=75', // Grapadora
    'prod_tdxrolpob': 'https://wsrv.nl/?url=computodo.com.sv/wp-content/uploads/2024/09/Tijera-8.png&w=400&output=webp&q=75', // Tijera 8
    'prod_73hwgt99t': 'https://wsrv.nl/?url=computodo.com.sv/wp-content/uploads/2024/09/Tijera-8.png&w=400&output=webp&q=75', // Tijera 17cm

    // ─── EDUCACIÓN Y JUEGOS ───
    'prod_gowax7pqx': 'https://wsrv.nl/?url=tonypapelerias.vtexassets.com/arquivos/ids/271239/00120209.jpg&w=400&output=webp&q=75', // Globo terráqueo

    // ─── DEPORTES ───
    'prod_pafvgei9p': 'https://wsrv.nl/?url=www.shoppingchina.com.py/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdzgyREE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--b38d830a568b17f3729e26ba9029ad5f920ba8a1/894192.jpg&w=400&output=webp&q=75', // Pelota basket
    'prod_qm547qt8g': 'https://wsrv.nl/?url=computodo.com.sv/wp-content/uploads/2024/09/Pelota-Voleibol.png&w=400&output=webp&q=75', // Pelota voleibol

    // ─── LIMPIEZA ───
    'prod_4bzwrmga6': 'https://wsrv.nl/?url=cdn.leroymerlin.com.br/products/papel_higienico_folha_dupla_30m_fardo_96_rolos__8x12__ness_1572274082_c0a8_600x600.jpg&w=400&output=webp&q=75', // Papel higiénico

    // ─── BEBEDERO ───
    'prod_f63uo2uj1': 'https://wsrv.nl/?url=baynao.com.do/baynao_images/1/product-4285-01.jpg&w=400&output=webp&q=75', // Bebedero (placeholder)
  };

  // Aplicar correcciones
  let fixed = 0;
  mockDatabase.forEach(product => {
    if (imageCorrections[product.id]) {
      product.img = imageCorrections[product.id];
      // Mantener la primera imagen de la galería original como secundaria si existe
      const originalGallery = product.gallery || [];
      product.gallery = [imageCorrections[product.id], ...originalGallery.slice(0, 1)];
      fixed++;
    }
  });

  console.log('[Futunet] ' + fixed + ' imágenes de productos corregidas.');
})();
