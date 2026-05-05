/**
 * FIXES — Corrige imágenes, marcas, categorías, departamentos y texto corrupto.
 * Imágenes locales en img/productos/catalogo/ (~6-34KB c/u).
 */
(function() {
  if (typeof mockDatabase === 'undefined') return;
  var b = 'img/productos/catalogo/';

  var fixes = {
    // ═══════════════════════════════════════════════════════
    // PRODUCTOS QUE DEBEN SALIR DE "Papelería y Suministros"
    // ═══════════════════════════════════════════════════════

    // ── TECNOLOGÍA → dept:equipos, cat:Periféricos y Partes ──
    'prod_ad1d2a977b': {img:b+'airpods-2gen.jpg', brand:'Apple', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_yny47xadr':  {img:b+'airpods-2gen.jpg', brand:'Apple', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_ppho60uwv':  {img:b+'tv-smart.jpg', brand:'KTC', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_tubkzzpxi':  {img:b+'tv-smart.jpg', brand:'KTC', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_jfwxxu99l':  {img:b+'sandisk-32gb.jpg', brand:'SanDisk', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_ubp9oyvaq':  {img:b+'papeleria-oficina.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_q8ul4kpio':  {brand:'Epson', dept:'equipos', cat:'Periféricos y Partes'},

    // ── ENERGÍA → dept:energia, cat:Energía y Respaldo ──
    'prod_bbdw9woh3':  {img:b+'regleta.jpg', dept:'energia', cat:'Energía y Respaldo'},
    'prod_4zs3vjzp7':  {img:b+'regleta.jpg', dept:'energia', cat:'Energía y Respaldo'},
    'prod_37431uj9f':  {dept:'energia', cat:'Energía y Respaldo'},
    'prod_j7viwqx46':  {dept:'energia', cat:'Energía y Respaldo'},

    // ── IMPRESORAS → dept:equipos, cat:Impresoras y Consumibles ──
    'prod_p0wqnr5bc':  {img:b+'brother-t720dw.jpg', brand:'Brother', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_oh55hargc':  {img:b+'canon-pixma-g2110.jpg', brand:'Canon', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_3bma5wlf5':  {brand:'Canon', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_dsu2skor9':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_ypa1lutg8':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_bkl2rdbja':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_9l3ruezvt':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_3pe40yw5r':  {img:b+'laminador.png', dept:'equipos', cat:'Impresoras y Consumibles'},

    // ── SEGURIDAD → dept:seguridad, cat:Control de Accesos ──
    'prod_v4n47vlw2':  {img:b+'dvr-hikvision.jpg', brand:'Hikvision'},
    'prod_2jgqsnmhb':  {brand:'Hikvision', dept:'seguridad', cat:'Control de Accesos'},
    'prod_ggflojr4r':  {brand:'Hikvision', dept:'seguridad', cat:'Control de Accesos'},
    'prod_i07dob6kp':  {brand:'Hikvision', dept:'seguridad', cat:'Control de Accesos'},
    'prod_dgb61tzu9':  {img:b+'dvr-hikvision.jpg', brand:'UNV', dept:'seguridad', cat:'Control de Accesos'},
    'prod_8ymxsbgt5':  {img:b+'cerradura-magnetica.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_irpyxjvid':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_zetp0ct03':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_hcr6riule':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_lg95td0ov':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_62c0mi985':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_ys6kcahet':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_pxexmmvn1':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_xz31q2ui7':  {dept:'seguridad', cat:'Control de Accesos'},

    // ── REDES → dept:redes, cat:Redes ──
    'prod_fy2c5keb5':  {img:b+'gabinete-9u.jpg', dept:'redes', cat:'Redes'},
    'prod_e9yrvwgwu':  {img:b+'gabinete-9u.jpg', dept:'redes', cat:'Redes'},
    'prod_f754nr1g1':  {img:'img/productos/hikvision-switch-poe-8-2.png', dept:'redes', cat:'Redes'},
    'prod_d2i5bt9x4':  {dept:'redes', cat:'Redes'},

    // ── MOBILIARIO → cat:Mobiliario ──
    'prod_0r5dh65ow':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_16sjt1g9y':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_4kju1p7bm':  {img:b+'nevera-mini.jpg', cat:'Mobiliario'},
    'prod_hmeic6hvu':  {img:b+'greca.jpg', cat:'Mobiliario'},
    'prod_p4yre7qrr':  {cat:'Mobiliario'},
    'prod_4f7stivlu':  {cat:'Mobiliario'},
    'prod_i8dch05mb':  {cat:'Mobiliario'},
    'prod_1kwnqvdge':  {cat:'Mobiliario'},

    // ── LIMPIEZA → cat:Limpieza ──
    'prod_964ur4qe3':  {img:b+'jabon-cuaba.jpg', cat:'Limpieza'},
    'prod_660w2f5s9':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_4bzwrmga6':  {img:b+'papel-higienico.jpg', cat:'Limpieza'},
    'prod_0ye7xtbtg':  {img:b+'papel-toalla.jpg', cat:'Limpieza'},
    'prod_b8vtelpjw':  {img:b+'papel-toalla.jpg', cat:'Limpieza'},
    'prod_4pamj5g19':  {img:b+'jabon-cuaba.jpg', cat:'Limpieza'},
    'prod_2v644exsk':  {img:b+'papel-toalla.jpg', cat:'Limpieza'},
    'prod_cyc8mnsl0':  {img:b+'jabon-cuaba.jpg', cat:'Limpieza'},
    'prod_jrtuzvr2y':  {img:b+'jabon-cuaba.jpg', cat:'Limpieza'},
    'prod_3ck218d0f':  {img:b+'papel-toalla.jpg', cat:'Limpieza'},
    'prod_ux1v86dkh':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_ad02p61re':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_sd5ukzzlw':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_8dqiwsp5y':  {img:b+'limpieza.jpg', cat:'Limpieza'},

    // ── DEPORTES → cat:Deportes y Recreación ──
    'prod_pafvgei9p':  {img:b+'pelota-basket-real.jpg', cat:'Deportes y Recreación'},
    'prod_6ybvfg94c':  {img:b+'pelota-tenis.jpg', cat:'Deportes y Recreación'},
    'prod_qm547qt8g':  {img:b+'pelota-voley.jpg', cat:'Deportes y Recreación'},
    'prod_omekh9gfz':  {img:b+'pelota-basket-real.jpg', cat:'Deportes y Recreación'},
    'prod_oi6ahed1d':  {cat:'Deportes y Recreación'},
    'prod_2m9na4jqf':  {cat:'Deportes y Recreación'},
    'prod_t154b8elk':  {cat:'Deportes y Recreación'},
    'prod_0seb4g8lv':  {cat:'Deportes y Recreación'},
    'prod_6k2wjm6lo':  {cat:'Deportes y Recreación'},

    // ── EDUCACIÓN → cat:Educación y Didáctica ──
    'prod_gowax7pqx':  {img:b+'globo-terraqueo.jpg', cat:'Educación y Didáctica'},
    'prod_dlcn0dvbw':  {img:b+'microscopio.jpg', cat:'Educación y Didáctica'},
    'prod_0n2ezucck':  {img:b+'microscopio.jpg', cat:'Educación y Didáctica'},
    'prod_n18qsxc52':  {img:b+'rompecabezas.jpg', cat:'Educación y Didáctica'},
    'prod_ljvqvr6k5':  {img:b+'bingo.jpg', cat:'Educación y Didáctica'},
    'prod_wsrub1azp':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_spbbxw09m':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_1rf7qqoys':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_mdop22fgw':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_sn48ozk7o':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_56w2s4xg5':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_cabuhpj5f':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_r4w6v9y3k':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_j7zfzz9mx':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_n7wz60o0l':  {img:b+'papeleria-oficina.jpg', cat:'Educación y Didáctica'},
    'prod_106fbm7mx':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_elc2mu2jc':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_wcboxk58r':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},

    // ── REMOZAMIENTO → dept:infra, cat:Remozamiento Profesional ──
    'prod_m54v413vd':  {img:b+'pistola-pegamento.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_4fmctb6nd':  {img:b+'pistola-pegamento.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_etnks90ht':  {img:b+'velas-silicon.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_4conwdbfb':  {img:b+'velas-silicon.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_iyd1fr1g0':  {img:b+'union-coupling.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_95tpqs7sz':  {img:b+'union-coupling.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_2rv556wr1':  {img:b+'registro-metal-8x10.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_uivpv4jpm':  {img:b+'registro-octagonal.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_cf3ymk8i3':  {img:b+'tapa-registro.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_zyrnr5dpn':  {img:b+'tuberia-flexible.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_xkna6ugad':  {img:b+'conector-emt.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_yv5qir42u':  {img:b+'conector-emt.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_up2hhi8yx':  {img:b+'tabla-bruta.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_um44r64yv':  {dept:'infra', cat:'Remozamiento Profesional'},
    'prod_jsmff34ie':  {img:b+'materiales-ferreteros.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_keb7b4o5x':  {img:b+'pintura-acrilica.jpg', dept:'infra', cat:'Remozamiento Profesional', brand:'Tropical'},
    'prod_mvb48hib2':  {img:b+'pintura-aceite.jpg', dept:'infra', cat:'Remozamiento Profesional', brand:'Tropical'},
    'prod_eebfxjcbf':  {img:b+'bandeja-pintar.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_vacxxprz0':  {img:b+'bandeja-pintar.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_69h9nvus8':  {img:b+'bandeja-pintar.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_r2n83myqm':  {img:b+'laminados-cristales.png', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_12im6c9yo':  {img:b+'pintura-aceite.jpg', dept:'infra', cat:'Remozamiento Profesional', brand:'Eagle Paint'},
    'prod_ywokd9kjb':  {img:b+'pintura-aceite.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_oyigj4so7':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_n57ur7vgu':  {cat:'Servicios'},

    // ═══════════════════════════════════════
    // PRODUCTOS QUE SE QUEDAN EN PAPELERÍA
    // (solo corregir imágenes y marcas)
    // ═══════════════════════════════════════
    'prod_qch1yu72k':  {img:b+'resma-papel.jpg'},
    'prod_apm0zzqc5':  {img:b+'resma-papel.jpg'},
    'prod_iq0yf8kja':  {img:b+'resma-papel.jpg'},
    'prod_epv6q7mid':  {img:b+'resma-papel.jpg'},
    'prod_cfdaqyzhq':  {img:b+'resma-papel.jpg'},
    'prod_ehgxkm40o':  {img:b+'resma-papel.jpg'},
    'prod_mi92wpmph':  {img:b+'resma-papel.jpg'},
    'prod_3mmcv0sgo':  {img:b+'resma-papel.jpg'},
    'prod_fwntni0z7':  {img:b+'grapadora.jpg'},
    'prod_vh2jmdv9d':  {img:b+'grapadora.jpg'},
    'prod_77oec80bi':  {img:b+'sacagrapas.jpg'},
    'prod_tdx0fs91j':  {img:b+'perforadora.jpg'},
    'prod_dplst0sx8':  {img:b+'perforadora.jpg'},
    'prod_tdxrolpob':  {img:b+'tijera.jpg'},
    'prod_73hwgt99t':  {img:b+'tijera.jpg'},
    'prod_bve20u216':  {img:b+'lapiz-hb.jpg'},
    'prod_omulmjuur':  {img:b+'marcador-pizarra.jpg'},
    'prod_wmqmv9ymn':  {img:b+'marcador-permanente.jpg'},
    'prod_qou4rnok2':  {img:b+'resaltador.jpg'},
    'prod_v76v94fhn':  {img:b+'post-it.jpg'},
    'prod_aqu76wluk':  {img:b+'folder-manila.jpg'},
    'prod_r22feluqh':  {img:b+'grapadora.jpg'},
    'prod_69o7lkyyd':  {img:b+'folder-manila.jpg'},
    'prod_4o6g79ztp':  {img:b+'corrector.jpg'},
    'prod_wdtm2bvlm':  {img:b+'corrector.jpg'},
    'prod_w0xr1czq3':  {img:b+'silicon-liquido.png'},
    'prod_7jxkdrt2x':  {img:b+'guillotina.jpg'},
    'prod_fo6bsjf2r':  {img:b+'grapadora.jpg'},
    'prod_dnluchszx':  {img:b+'cinta-scotch.jpg'},
    'prod_y9id01bvc':  {img:b+'folder-manila.jpg'},
    'prod_fc6um05pc':  {img:b+'resma-papel.jpg'},
    'prod_3ub9sjdda':  {img:b+'resma-papel.jpg'},
    'prod_niysooqbl':  {img:b+'resma-papel.jpg'},
    'prod_wd9o2f0gk':  {img:b+'resma-papel.jpg'},
    'prod_uu5gqjyp6':  {img:b+'grapadora.jpg'},
    'prod_xomuyjeig':  {img:b+'grapadora.jpg'},
    'prod_hhdf2sbhw':  {img:b+'corrector.jpg'},
    'prod_j678gzz2e':  {img:b+'resma-papel.jpg'},
    'prod_2qw2dl3k3':  {img:b+'resma-papel.jpg'},
    'prod_hn72fkg6t':  {img:b+'resma-papel.jpg'},
    'prod_drsbrwqov':  {img:b+'folder-manila.jpg'},
    'prod_h3dpf48x5':  {img:b+'resma-papel.jpg'},
    'prod_72dz82us1':  {img:b+'folder-manila.jpg'},
    'prod_1hwg9veqw':  {img:b+'resma-papel.jpg'},
    'prod_i7e87pop8':  {img:b+'educacion.jpg'},
    'prod_6cw69dkjz':  {img:b+'folder-manila.jpg'},
    'prod_yw467f1gv':  {img:b+'folder-manila.jpg'},
    'prod_y1lodb30x':  {img:b+'tabla-acrilica.png'},
    'prod_jgilr42mx':  {img:b+'grapadora.jpg'},
    'prod_oyqspxnap':  {img:b+'lapiz-hb.jpg', brand:'BIC'},
    'prod_j8osyd5by':  {img:b+'cinta-scotch.jpg', brand:'3M'},
    'prod_xa3myztu6':  {img:b+'cinta-scotch.jpg'},
    'prod_6wzdwza5a':  {img:b+'cinta-scotch.jpg'},
    'prod_axp7tgy7b':  {img:b+'cinta-scotch.jpg'},
    'prod_ggjbeu4gz':  {img:b+'cinta-scotch.jpg'},
    'prod_zerbf6n8a':  {img:b+'cinta-scotch.jpg'},

    // ═══════════════════════════════════════
    // REMOZAMIENTO PROFESIONAL (pinturas)
    // ═══════════════════════════════════════
    'prod_8rfkpfrr5':  {img:b+'masilla-pared.jpg'},
    'prod_eb42bviah':  {img:b+'cemento-blanco.jpg'},
    'prod_g7qgkxtxx':  {img:b+'tubo-emt.jpg'},
    'prod_9np542ifb':  {img:b+'tubo-emt.jpg'},
    'prod_az3no4o95':  {img:b+'abrazadera-emt.jpg'},
    'prod_fcy8mcikv':  {img:b+'abrazadera-emt.jpg'},
    'prod_eo19bm16r':  {img:b+'canaleta.jpg'},
    'prod_oqlew24le':  {img:b+'canaleta.jpg'},
    'prod_f1q0qx6zu':  {img:b+'bandeja-pintar.jpg'},
    'prod_ezp1r691s':  {img:b+'clavos-fulminante.png'},
    'prod_y2gfa14aq':  {img:b+'fulminante.png'},
    'prod_n7bai88lr':  {img:b+'pintura-tropical.jpg', brand:'Tropical'},
    'prod_93stq2iho':  {img:b+'pintura-tropical.jpg', brand:'Tropical'},
    'prod_40moje7n1':  {img:b+'pintura-tropical.jpg', brand:'Tropical'},
    'prod_4oeze720s':  {img:b+'pintura-tropical.jpg', brand:'Tropical'},
    'prod_s6k2b2ryv':  {img:b+'pintura-tropical.jpg', brand:'Tropical'},
    'prod_z9tchehec':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_q3nyu1krp':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_md19tjedi':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_n3ztv716j':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_t1bmccu62':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_p8lzfw2vt':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_9xnj1gt0v':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_pjadtbhcu':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_s7d6mohv1':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_b1stfwogk':  {img:b+'pintura-acrilica.jpg', brand:'Tropical'},
    'prod_mdd2eayir':  {img:b+'pintura-aceite.jpg', brand:'Tropical'},
    'prod_2myrj6khg':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_xxweuj8jv':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_zy76m8zd6':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_rmyxcpakp':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_xazd3zzyh':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_wybmj5f8n':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_oaw5ld8vk':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_nfq7ja7e9':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_tgyesgpad':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_bn9537a85':  {img:b+'pintura-eagle.jpg', brand:'Eagle Paint'},
    'prod_bgetiqf59':  {img:b+'pintura-aceite.jpg', brand:'Popular'},
    'prod_aqczvi4c0':  {img:b+'pintura-aceite.jpg', brand:'Popular'},
    'prod_jl92gbzbz':  {img:b+'pintura-acrilica.jpg', brand:'Popular'},
    'prod_od0le1w47':  {img:b+'pintura-acrilica.jpg', brand:'Popular'},
    'prod_pmt5gobeh':  {img:b+'pintura-acrilica.jpg'},
    'prod_vf9g9ypru':  {img:b+'pintura-acrilica.jpg'},
    'prod_bqs26gjpy':  {img:b+'pintura-acrilica.jpg'},
    'prod_wu9zt66ic':  {img:b+'pintura-acrilica.jpg'},

    // ═══════════════════════════════════════
    // ÚLTIMOS 39 PRODUCTOS CON IMAGEN GENÉRICA
    // ═══════════════════════════════════════

    // Educación
    'prod_9fwdeomcv':  {img:b+'ajedrez.jpg', cat:'Educación y Didáctica'},
    'prod_y9fn9qw5p':  {img:b+'bloques-educativos.jpg', cat:'Educación y Didáctica'},
    'prod_hzx5k891t':  {img:b+'educacion.jpg'},

    // Deportes
    'prod_5sy71o0vo':  {img:b+'aro-hula.jpg', cat:'Deportes y Recreación'},

    // Oficina / Papelería
    'prod_do7scjyqx':  {img:b+'carpeta-anillos.jpg'},
    'prod_0sbd2t214':  {img:b+'cartulina.jpg'},
    'prod_sz47q4qhy':  {img:b+'cartulina.jpg'},
    'prod_ws4sk3zhg':  {img:b+'cartulina.jpg'},
    'prod_43xoob4nt':  {img:b+'grapadora.jpg'},
    'prod_ca3i5l5vx':  {img:b+'calculadora.jpg', brand:'Sharp'},
    'prod_9i3rntl7a':  {img:b+'carpeta-anillos.jpg'},
    'prod_kkvhvx121':  {img:b+'carpeta-anillos.jpg'},
    'prod_8yhmripoe':  {img:b+'folder-manila.jpg'},
    'prod_ajmwyngxz':  {img:b+'bandera.jpg'},
    'prod_akvr1ewvy':  {img:b+'cinta-scotch.jpg'},
    'prod_rg3m6r2bb':  {img:b+'bocina.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_mmffzpx11':  {img:b+'bocina.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_3giupevua':  {img:b+'microfono.jpg', dept:'equipos', cat:'Periféricos y Partes'},

    // Mobiliario
    'prod_jn0r7zygh':  {img:b+'armario-metal.jpg', cat:'Mobiliario'},
    'prod_pv4k4dixy':  {img:b+'armario-metal.jpg', cat:'Mobiliario'},
    'prod_r6n2atzcv':  {img:b+'armario-metal.jpg', cat:'Mobiliario'},
    'prod_elgtfyda4':  {img:b+'armario-metal.jpg', cat:'Mobiliario'},
    'prod_7fxzhrsl1':  {img:b+'escritorio.jpg', cat:'Mobiliario'},
    'prod_ldt8qpyqd':  {img:b+'escritorio.jpg', cat:'Mobiliario'},
    'prod_rlch8e9bx':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_3s7mmtjdr':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},

    // Equipos / TV
    'prod_vgdtwk69e':  {img:b+'base-tv.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_sx997vnsv':  {img:b+'base-tv.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_tk6it44v0':  {img:'img/impresoras.jpg', dept:'equipos', cat:'Impresoras y Consumibles'},

    // Seguridad
    'prod_hup4kfqpz':  {img:b+'camara-ip.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_v0u1qvzs2':  {img:b+'abrazadera-emt.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_j1ixov27m':  {img:b+'abrazadera-emt.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_0v1wm22fq':  {img:b+'abrazadera-emt.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_57nl0tl7s':  {img:b+'registro-camaras.png', dept:'seguridad', cat:'Control de Accesos'},
    'prod_c5fqoo8ym':  {img:b+'camara-ip.jpg', dept:'seguridad', cat:'Servicios'},
    'prod_pb8eucs66':  {img:b+'camara-ip.jpg', dept:'seguridad', cat:'Servicios'},

    // Mobiliario y Oficina
    'prod_pv4k4dixy':  {img:b+'armario-metal.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_r6n2atzcv':  {img:b+'armario-metal.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_flgtfyda4':  {img:b+'armario-metal.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_7fxzhrsl1':  {img:b+'escritorio.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_ldt8qpyqd':  {img:b+'escritorio.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_72dz82us1':  {img:b+'folder-manila.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_6cw69dkjz':  {img:b+'folder-manila.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_69o7lkyyd':  {img:b+'folder-manila.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_silla_visita': {img:b+'sillon-ejecutivo.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_ldt8qpyqd':  {img:b+'escritorio.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},

    // Papelería y Suministros Específicos
    'prod_9fwdeomcv':  {img:b+'ajedrez.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_5sy71o0vo':  {img:b+'aro-hula.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_ajmwyngxz':  {img:b+'bandera.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_vgdtwk69e':  {img:b+'base-tv.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_sx997vnsv':  {img:b+'base-tv.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_ljvqvr6k5':  {img:b+'bingo.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_y9fn9qw5p':  {img:b+'bloques-educativos.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_rg3m6r2bb':  {img:b+'bocina.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_mmffzpx11':  {img:b+'bocina.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_ca3i5l5vx':  {img:b+'calculadora.jpg', brand:'Sharp', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_9i3rntl7a':  {img:b+'carpeta-anillos.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_kkvhvx121':  {img:b+'carpeta-anillos.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_0sbd2t214':  {img:b+'cartulina.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_sz47q4qhy':  {img:b+'cartulina.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_ws4sk3zhg':  {img:b+'cartulina.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_3lpi00w1u':  {img:b+'cinta-scotch.jpg', brand:'3M', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_j8osyd5by':  {img:b+'cinta-scotch.jpg', brand:'3M', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_hhdf2sbhw':  {img:b+'corrector.jpg', brand:'Talbot', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_gowax7pqx':  {img:b+'globo-terraqueo.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_fwntni0z7':  {img:b+'grapadora.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_hmeic6hvu':  {img:b+'greca.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_7jxkdrt2x':  {img:b+'guillotina.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_tk6it44v0':  {img:'img/impresoras.jpg', brand:'Genérico', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_964ur4qe3':  {img:b+'jabon-cuaba.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_bve20u216':  {img:b+'lapiz-hb.jpg', brand:'Pointer', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_wmqmv9ymn':  {img:b+'marcador-permanente.jpg', brand:'Talbot', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_omulmjuur':  {img:b+'marcador-pizarra.jpg', brand:'Estabilo', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_3giupevua':  {img:b+'microfono.jpg', brand:'Genérico', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_ubp9oyvaq':  {img:b+'microfono.jpg', brand:'Genérico', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_dlcn0dvbw':  {img:b+'microscopio.jpg', brand:'Stem', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_4kju1p7bm':  {img:b+'nevera-mini.jpg', brand:'Genérico', dept:'oficina', cat:'Mobiliario'},
    'prod_4bzwrmga6':  {img:b+'papel-higienico.jpg', brand:'Faldo', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_0ye7xtbtg':  {img:b+'papel-toalla.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
    'prod_b8vtelpjw':  {img:b+'papel-toalla.jpg', brand:'Genérico', dept:'oficina', cat:'Papelería y Suministros'},
  };

  // ── Aplicar correcciones ──
  var imgF=0, brandF=0, catF=0, deptF=0;
  mockDatabase.forEach(function(p) {
    var f = fixes[p.id];
    if (f) {
      if (f.img)   { p.img = f.img; p.gallery = [f.img]; imgF++; }
      if (f.brand) { p.brand = f.brand; brandF++; }
      if (f.cat)   { p.category = f.cat; catF++; }
      if (f.dept)  { p.department = f.dept; deptF++; }
    }


  });

  console.log('[Futunet] Fixes: ' + imgF + ' imgs, ' + brandF + ' brands, ' + catF + ' cats, ' + deptF + ' depts');
})();
