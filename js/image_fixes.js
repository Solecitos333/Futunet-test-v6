/**
 * IMAGE FIXES — Mapeo de imágenes correctas para productos del catálogo.
 * Este script se ejecuta después de inventory_data.js y corrige las
 * imágenes genéricas reemplazándolas con fotos reales de los productos.
 * 
 * Usa wsrv.nl como proxy de imágenes para evitar problemas de CORS
 * y para servir WebP optimizado automáticamente.
 */
(function() {
  if (typeof mockDatabase === 'undefined') return;

  // Mapeo: ID del producto → URL de imagen corregida
  const imageCorrections = {
    // ─── TECNOLOGÍA Y ELECTRÓNICOS ───
    'prod_ad1d2a977b': 'https://wsrv.nl/?url=store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1551489688005&w=400&output=webp&q=75', // AirPods 2da Gen
    'prod_ppho60uwv': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71d5fMDvq9L._AC_SX679_.jpg&w=400&output=webp&q=75', // TV KTC 43
    'prod_tubkzzpxi': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71d5fMDvq9L._AC_SX679_.jpg&w=400&output=webp&q=75', // TV KTC 32
    'prod_fvb5vixvg': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/31T1dFDBd4L._AC_.jpg&w=400&output=webp&q=75', // Mouse USB
    'prod_w5fl5uh6a': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51D0gRBrDpL._AC_SX679_.jpg&w=400&output=webp&q=75', // Mouse Inalámbrico
    'prod_xrhbe3kbc': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71JN7Q5ab4L._AC_SX679_.jpg&w=400&output=webp&q=75', // Mouse Pad
    'prod_jfwxxu99l': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71VB8cpXhnL._AC_SX679_.jpg&w=400&output=webp&q=75', // Memoria USB Sandisk 32GB
    'prod_jsn83vpc6': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71I2oMp-a8L._AC_SX679_.jpg&w=400&output=webp&q=75', // Monitor 19
    'prod_bbdw9woh3': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61CGUyoySQL._AC_SX679_.jpg&w=400&output=webp&q=75', // Regleta 6 enchufes
    'prod_4zs3vjzp7': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71RjORsVOsL._AC_SX679_.jpg&w=400&output=webp&q=75', // Regulador voltaje
    'prod_3giupevua': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51NHdivRJzL._AC_SX679_.jpg&w=400&output=webp&q=75', // Micrófono alámbrico
    'prod_ubp9oyvaq': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/614Tsdv2DxL._AC_SX679_.jpg&w=400&output=webp&q=75', // Micrófono inalámbrico
    'prod_zetp0ct03': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61t08vbzMGL._AC_SX679_.jpg&w=400&output=webp&q=75', // Intercom
    'prod_lg95td0ov': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51TnpKrzXmL._AC_SX679_.jpg&w=400&output=webp&q=75', // Timbre campana
    'prod_irpyxjvid': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61JtK7UANYL._AC_SX679_.jpg&w=400&output=webp&q=75', // Video Balun AHD
    'prod_alqh8rvsc': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71FPOY2QJnL._AC_SX679_.jpg&w=400&output=webp&q=75', // RJ45

    // ─── IMPRESORAS ───
    'prod_tk6it44v0': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51H1b0cdFZL._AC_SX679_.jpg&w=400&output=webp&q=75', // Impresora térmica POS
    'prod_p0wqnr5bc': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71RVtqdqZKL._AC_SX679_.jpg&w=400&output=webp&q=75', // Brother T720
    'prod_oh55hargc': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71LfZGj5JcL._AC_SX679_.jpg&w=400&output=webp&q=75', // Canon Pixma 2110
    'prod_3bma5wlf5': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71E7mPM77pL._AC_SX679_.jpg&w=400&output=webp&q=75', // Tinta Canon G190

    // ─── SEGURIDAD ───
    'prod_8ymxsbgt5': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51TF4p2JCbL._AC_SX679_.jpg&w=400&output=webp&q=75', // Cerradura magnética
    'prod_0v1wm22fq': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71p4s8s3RAL._AC_SX679_.jpg&w=400&output=webp&q=75', // Alambre cerco
    'prod_hcr6riule': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61wYeAV5CgL._AC_SX679_.jpg&w=400&output=webp&q=75', // Letrero cerco
    'prod_dgb61tzu9': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61wQHRcHhDL._AC_SX679_.jpg&w=400&output=webp&q=75', // NVR UNV 8 POE
    'prod_57nl0tl7s': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61JtK7UANYL._AC_SX679_.jpg&w=400&output=webp&q=75', // Registro cámaras
    'prod_f754nr1g1': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61N-gHxMURL._AC_SX679_.jpg&w=400&output=webp&q=75', // Switch POE

    // ─── REDES Y GABINETES ───
    'prod_fy2c5keb5': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71cQtYr7tRL._AC_SX679_.jpg&w=400&output=webp&q=75', // Gabinete 9U
    'prod_e9yrvwgwu': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61Y-m3y6oTL._AC_SX679_.jpg&w=400&output=webp&q=75', // Gabinete 4U
    'prod_d2i5bt9x4': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51szcB0ChtL._AC_SX679_.jpg&w=400&output=webp&q=75', // Fuente 12V 5A

    // ─── MOBILIARIO DE OFICINA ───
    'prod_rlch8e9bx': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71PUGnXKb+L._AC_SX679_.jpg&w=400&output=webp&q=75', // Silla mayita
    'prod_3s7mmtjdr': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81tAy5c8y7L._AC_SX679_.jpg&w=400&output=webp&q=75', // Silla visitas
    'prod_0r5dh65ow': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71gkLRF+3VL._AC_SX679_.jpg&w=400&output=webp&q=75', // Sillón ejecutivo
    'prod_16sjt1g9y': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71gkLRF+3VL._AC_SX679_.jpg&w=400&output=webp&q=75', // Sillón ejecutivo negro
    'prod_4kju1p7bm': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71S1t5m7DSL._AC_SX679_.jpg&w=400&output=webp&q=75', // Nevera ejecutiva
    'prod_4f7stivlu': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61Y-h+5FJFL._AC_SX679_.jpg&w=400&output=webp&q=75', // Zafacón con tapa
    'prod_hmeic6hvu': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51x0a1mKshL._AC_SX679_.jpg&w=400&output=webp&q=75', // Greca 12 tazas
    'prod_p4yre7qrr': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Qi3JWh11L._AC_SX679_.jpg&w=400&output=webp&q=75', // Termo café

    // ─── PAPELERÍA Y OFICINA ───
    'prod_qch1yu72k': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71uEgJV5xJL._AC_SX679_.jpg&w=400&output=webp&q=75', // Resma papel
    'prod_apm0zzqc5': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71uEgJV5xJL._AC_SX679_.jpg&w=400&output=webp&q=75', // Resma 8.5x14
    'prod_iq0yf8kja': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71dCrNi8JXL._AC_SX679_.jpg&w=400&output=webp&q=75', // Caja resmas
    'prod_epv6q7mid': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/819F3gxuE4L._AC_SX679_.jpg&w=400&output=webp&q=75', // Papel colores
    'prod_fwntni0z7': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61tNNpXdJQL._AC_SX679_.jpg&w=400&output=webp&q=75', // Grapadora
    'prod_vh2jmdv9d': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51FMhGBmKKL._AC_SX679_.jpg&w=400&output=webp&q=75', // Grapas
    'prod_77oec80bi': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51tqoQ5+ooL._AC_SX679_.jpg&w=400&output=webp&q=75', // Saca grapas
    'prod_tdx0fs91j': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61qj-SXYYvL._AC_SX679_.jpg&w=400&output=webp&q=75', // Perforadora 1 hoyo
    'prod_dplst0sx8': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61sSQXTk20L._AC_SX679_.jpg&w=400&output=webp&q=75', // Perforadora 2 hoyos
    'prod_7jxkdrt2x': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71GJe6AV0GL._AC_SX679_.jpg&w=400&output=webp&q=75', // Guillotina
    'prod_tdxrolpob': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Hm78uJ0EL._AC_SX679_.jpg&w=400&output=webp&q=75', // Tijera 8
    'prod_73hwgt99t': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Hm78uJ0EL._AC_SX679_.jpg&w=400&output=webp&q=75', // Tijera 17cm
    'prod_bve20u216': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81S5cFHfMhL._AC_SX679_.jpg&w=400&output=webp&q=75', // Lápiz HB
    'prod_omulmjuur': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61G5JkB5eNL._AC_SX679_.jpg&w=400&output=webp&q=75', // Marcador pizarra
    'prod_wmqmv9ymn': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71gcXswc3-L._AC_SX679_.jpg&w=400&output=webp&q=75', // Marcador permanente
    'prod_qou4rnok2': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81oe4iHiGNL._AC_SX679_.jpg&w=400&output=webp&q=75', // Resaltador
    'prod_v76v94fhn': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81ZQxUj-D6L._AC_SX679_.jpg&w=400&output=webp&q=75', // Post-it adhesivo
    'prod_aqu76wluk': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Gb2gDlQiL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pendaflex
    'prod_r22feluqh': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Z5G8WuT7L._AC_SX679_.jpg&w=400&output=webp&q=75', // Pinza jumbo
    'prod_69o7lkyyd': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/31WXm7v2gNL._AC_.jpg&w=400&output=webp&q=75', // Folder amarillo
    'prod_wcboxk58r': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/41a1cShxDML._AC_SX679_.jpg&w=400&output=webp&q=75', // Lupa
    'prod_4o6g79ztp': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51rLRfjGjQL._AC_SX679_.jpg&w=400&output=webp&q=75', // Tinta para sello
    'prod_wdtm2bvlm': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71tAWLUVpBL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pegacol
    'prod_w0xr1czq3': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51FxJf8iEfL._AC_SX679_.jpg&w=400&output=webp&q=75', // Silicon líquido

    // ─── PIZARRAS Y EDUCACIÓN ───
    'prod_i8dch05mb': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81g4RfVBbKL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pizarra corcho 24x36
    'prod_1kwnqvdge': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81g4RfVBbKL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pizarra corcho 36x48
    'prod_gowax7pqx': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71d+WQeGDhL._AC_SX679_.jpg&w=400&output=webp&q=75', // Globo terráqueo
    'prod_dlcn0dvbw': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71KBwJFVGeL._AC_SX679_.jpg&w=400&output=webp&q=75', // Microscopio
    'prod_0n2ezucck': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71KBwJFVGeL._AC_SX679_.jpg&w=400&output=webp&q=75', // Microscopio elite
    'prod_n18qsxc52': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71p-3RhvjcL._AC_SX679_.jpg&w=400&output=webp&q=75', // Rompecabezas
    'prod_ljvqvr6k5': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81vNY4CU5ML._AC_SX679_.jpg&w=400&output=webp&q=75', // Bingo
    'prod_9fwdeomcv': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71R-fPa1sKL._AC_SX679_.jpg&w=400&output=webp&q=75', // Ajedrez
    'prod_elc2mu2jc': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61g3pGhVlLL._AC_SX679_.jpg&w=400&output=webp&q=75', // Tiza

    // ─── DEPORTES ───
    'prod_pafvgei9p': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/91Zpm6grJxL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pelota basket
    'prod_6ybvfg94c': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71c+4voaQiL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pelota tenis
    'prod_qm547qt8g': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81jlHs+OFDL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pelota voleibol
    'prod_oi6ahed1d': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61c3s-R2uyL._AC_SX679_.jpg&w=400&output=webp&q=75', // Silbato

    // ─── LIMPIEZA ───
    'prod_964ur4qe3': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61RKQiCY2mL._AC_SX679_.jpg&w=400&output=webp&q=75', // Jabón cuaba
    'prod_660w2f5s9': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71qxz0nF4CL._AC_SX679_.jpg&w=400&output=webp&q=75', // Jabón líquido fregar
    'prod_4bzwrmga6': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81h7REHwgYL._AC_SX679_.jpg&w=400&output=webp&q=75', // Papel higiénico
    'prod_0ye7xtbtg': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Z+1O5TXoL._AC_SX679_.jpg&w=400&output=webp&q=75', // Papel toalla jumbo
    'prod_b8vtelpjw': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/81YeYKKvg-L._AC_SX679_.jpg&w=400&output=webp&q=75', // Papel toalla fardo
    'prod_4pamj5g19': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Fwrl+V6eL._AC_SX679_.jpg&w=400&output=webp&q=75', // Suavizante
    'prod_2v644exsk': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71-aQ9tsMxL._AC_SX679_.jpg&w=400&output=webp&q=75', // Toalla multifibra

    // ─── PISTOLAS Y HERRAMIENTAS ───
    'prod_m54v413vd': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61YY6SFu9HL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pistola pegamento 60W
    'prod_4fmctb6nd': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/51Z-P-R3FjL._AC_SX679_.jpg&w=400&output=webp&q=75', // Pistola silicón fina
    'prod_3pe40yw5r': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71Ai+E7v5dL._AC_SX679_.jpg&w=400&output=webp&q=75', // Laminador

    // ─── BEBEDERO ───
    'prod_f63uo2uj1': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61gU-Gr8KoL._AC_SX679_.jpg&w=400&output=webp&q=75', // Bebedero Daiwa

    // ─── MOTOR / CERCO ───
    'prod_62c0mi985': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/71E+LKVpxQL._AC_SX679_.jpg&w=400&output=webp&q=75', // Kit motor 800kg

    // ─── DVR / NVR ───
    'prod_v4n47vlw2': 'https://wsrv.nl/?url=m.media-amazon.com/images/I/61X4GhSRSQL._AC_SX679_.jpg&w=400&output=webp&q=75', // DVR 16 CH Hikvision
  };

  // Aplicar correcciones
  let fixed = 0;
  mockDatabase.forEach(product => {
    if (imageCorrections[product.id]) {
      product.img = imageCorrections[product.id];
      product.gallery = [imageCorrections[product.id]];
      fixed++;
    }
  });

  console.log(`[Futunet] ${fixed} imágenes de productos corregidas.`);
})();
