/**
 * FIXES — Corrige imágenes, marcas, categorías y departamentos.
 * Imágenes locales en img/productos/catalogo/ (~6-34KB c/u).
 */
(function() {
  if (typeof mockDatabase === 'undefined') return;
  var b = 'img/productos/catalogo/';

  var fixes = {
    // ── TECNOLOGÍA (dept: equipos) ──
    'prod_ad1d2a977b': {img:b+'airpods-2gen.jpg', brand:'Apple', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_ppho60uwv':  {img:b+'tv-smart.jpg', brand:'KTC', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_tubkzzpxi':  {img:b+'tv-smart.jpg', brand:'KTC', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_jfwxxu99l':  {img:b+'sandisk-32gb.jpg', brand:'SanDisk', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_fvb5vixvg':  {img:b+'papeleria-oficina.jpg', brand:'Genérico', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_w5fl5uh6a':  {img:b+'papeleria-oficina.jpg', brand:'Genérico', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_xrhbe3kbc':  {img:b+'papeleria-oficina.jpg', brand:'Genérico', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_jsn83vpc6':  {img:b+'tv-smart.jpg', brand:'Genérico', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_bbdw9woh3':  {img:b+'regleta.jpg', dept:'energia', cat:'Energía y Respaldo'},
    'prod_4zs3vjzp7':  {img:b+'regleta.jpg', dept:'energia', cat:'Energía y Respaldo'},
    'prod_3giupevua':  {img:b+'papeleria-oficina.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_ubp9oyvaq':  {img:b+'papeleria-oficina.jpg', dept:'equipos', cat:'Periféricos y Partes'},
    'prod_lg95td0ov':  {img:b+'papeleria-oficina.jpg', dept:'seguridad', cat:'Control de Accesos'},

    // ── IMPRESORAS (dept: equipos) ──
    'prod_tk6it44v0':  {img:b+'papeleria-oficina.jpg', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_p0wqnr5bc':  {img:b+'brother-t720dw.jpg', brand:'Brother', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_oh55hargc':  {img:b+'canon-pixma-g2110.jpg', brand:'Canon', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_3bma5wlf5':  {brand:'Canon', dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_dsu2skor9':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_ypa1lutg8':  {dept:'equipos', cat:'Impresoras y Consumibles'},
    'prod_9l3ruezvt':  {dept:'equipos', cat:'Impresoras y Consumibles'},

    // ── SEGURIDAD (dept: seguridad) ──
    'prod_v4n47vlw2':  {img:b+'dvr-hikvision.jpg', brand:'Hikvision'},
    'prod_8ymxsbgt5':  {img:b+'cerradura-magnetica.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_dgb61tzu9':  {img:b+'dvr-hikvision.jpg', dept:'seguridad', cat:'Control de Accesos'},
    'prod_f754nr1g1':  {img:b+'gabinete-9u.jpg', dept:'redes', cat:'Redes'},
    'prod_irpyxjvid':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_57nl0tl7s':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_zetp0ct03':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_0v1wm22fq':  {dept:'seguridad', cat:'Control de Accesos'},
    'prod_hcr6riule':  {dept:'seguridad', cat:'Control de Accesos'},

    // ── REDES (dept: redes) ──
    'prod_fy2c5keb5':  {img:b+'gabinete-9u.jpg', dept:'redes', cat:'Redes'},
    'prod_e9yrvwgwu':  {img:b+'gabinete-9u.jpg', dept:'redes', cat:'Redes'},
    'prod_d2i5bt9x4':  {dept:'redes', cat:'Redes'},
    'prod_alqh8rvsc':  {dept:'redes', cat:'Redes'},

    // ── MOBILIARIO (dept: oficina, cat: Mobiliario) ──
    'prod_0r5dh65ow':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_16sjt1g9y':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_rlch8e9bx':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_3s7mmtjdr':  {img:b+'sillon-ejecutivo.jpg', cat:'Mobiliario'},
    'prod_4kju1p7bm':  {cat:'Mobiliario'},
    'prod_4f7stivlu':  {cat:'Mobiliario'},
    'prod_hmeic6hvu':  {cat:'Mobiliario'},
    'prod_p4yre7qrr':  {cat:'Mobiliario'},

    // ── LIMPIEZA (dept: oficina, cat: Limpieza) ──
    'prod_964ur4qe3':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_660w2f5s9':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_4bzwrmga6':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_0ye7xtbtg':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_b8vtelpjw':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_4pamj5g19':  {img:b+'limpieza.jpg', cat:'Limpieza'},
    'prod_2v644exsk':  {img:b+'limpieza.jpg', cat:'Limpieza'},

    // ── DEPORTES Y RECREACIÓN ──
    'prod_pafvgei9p':  {img:b+'pelota-basket.jpg', cat:'Deportes y Recreación'},
    'prod_6ybvfg94c':  {img:b+'pelota-basket.jpg', cat:'Deportes y Recreación'},
    'prod_qm547qt8g':  {img:b+'pelota-basket.jpg', cat:'Deportes y Recreación'},
    'prod_omekh9gfz':  {img:b+'pelota-basket.jpg', cat:'Deportes y Recreación'},
    'prod_oi6ahed1d':  {img:b+'pelota-basket.jpg', cat:'Deportes y Recreación'},
    'prod_5sy71o0vo':  {img:b+'pelota-basket.jpg', cat:'Deportes y Recreación'},

    // ── EDUCACIÓN ──
    'prod_gowax7pqx':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_dlcn0dvbw':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_0n2ezucck':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_n18qsxc52':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_ljvqvr6k5':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_9fwdeomcv':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_elc2mu2jc':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_wsrub1azp':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_spbbxw09m':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_1rf7qqoys':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_mdop22fgw':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_sn48ozk7o':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_56w2s4xg5':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_cabuhpj5f':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_r4w6v9y3k':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_j7zfzz9mx':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_n7wz60o0l':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},
    'prod_106fbm7mx':  {img:b+'educacion.jpg', cat:'Educación y Didáctica'},

    // ── PAPELERÍA (se quedan donde están, solo imagen) ──
    'prod_qch1yu72k':  {img:b+'resma-papel.jpg'},
    'prod_apm0zzqc5':  {img:b+'resma-papel.jpg'},
    'prod_iq0yf8kja':  {img:b+'resma-papel.jpg'},
    'prod_fwntni0z7':  {img:b+'papeleria-oficina.jpg'},
    'prod_vh2jmdv9d':  {img:b+'papeleria-oficina.jpg'},
    'prod_77oec80bi':  {img:b+'papeleria-oficina.jpg'},
    'prod_tdx0fs91j':  {img:b+'papeleria-oficina.jpg'},
    'prod_dplst0sx8':  {img:b+'papeleria-oficina.jpg'},
    'prod_tdxrolpob':  {img:b+'papeleria-oficina.jpg'},
    'prod_73hwgt99t':  {img:b+'papeleria-oficina.jpg'},
    'prod_bve20u216':  {img:b+'papeleria-oficina.jpg'},
    'prod_omulmjuur':  {img:b+'papeleria-oficina.jpg'},
    'prod_wmqmv9ymn':  {img:b+'papeleria-oficina.jpg'},
    'prod_qou4rnok2':  {img:b+'papeleria-oficina.jpg'},
    'prod_v76v94fhn':  {img:b+'papeleria-oficina.jpg'},
    'prod_aqu76wluk':  {img:b+'papeleria-oficina.jpg'},
    'prod_r22feluqh':  {img:b+'papeleria-oficina.jpg'},
    'prod_69o7lkyyd':  {img:b+'papeleria-oficina.jpg'},
    'prod_wcboxk58r':  {img:b+'papeleria-oficina.jpg'},
    'prod_4o6g79ztp':  {img:b+'papeleria-oficina.jpg'},
    'prod_wdtm2bvlm':  {img:b+'papeleria-oficina.jpg'},
    'prod_w0xr1czq3':  {img:b+'papeleria-oficina.jpg'},
    'prod_7jxkdrt2x':  {img:b+'papeleria-oficina.jpg'},
    'prod_3pe40yw5r':  {img:b+'papeleria-oficina.jpg'},
    'prod_fo6bsjf2r':  {img:b+'papeleria-oficina.jpg'},
    'prod_epv6q7mid':  {img:b+'papeleria-oficina.jpg'},
    'prod_cfdaqyzhq':  {img:b+'papeleria-oficina.jpg'},
    'prod_dnluchszx':  {img:b+'papeleria-oficina.jpg'},

    // ── HERRAMIENTAS / PISTOLAS → infra ──
    'prod_m54v413vd':  {img:b+'papeleria-oficina.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_4fmctb6nd':  {img:b+'papeleria-oficina.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_etnks90ht':  {dept:'infra', cat:'Remozamiento Profesional'},
    'prod_4conwdbfb':  {dept:'infra', cat:'Remozamiento Profesional'},

    // ── EMT/REGISTROS → infra ──
    'prod_iyd1fr1g0':  {img:b+'tubo-emt.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_95tpqs7sz':  {img:b+'tubo-emt.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_2rv556wr1':  {img:b+'abrazadera-emt.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_uivpv4jpm':  {img:b+'abrazadera-emt.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_cf3ymk8i3':  {img:b+'abrazadera-emt.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_zyrnr5dpn':  {img:b+'tubo-emt.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_up2hhi8yx':  {dept:'infra', cat:'Remozamiento Profesional'},
    'prod_um44r64yv':  {dept:'infra', cat:'Remozamiento Profesional'},
    'prod_jsmff34ie':  {dept:'infra', cat:'Remozamiento Profesional'},
    'prod_keb7b4o5x':  {img:b+'pintura-acrilica.jpg', dept:'infra', cat:'Remozamiento Profesional', brand:'Tropical'},
    'prod_mvb48hib2':  {img:b+'pintura-aceite.jpg', dept:'infra', cat:'Remozamiento Profesional', brand:'Tropical'},
    'prod_eebfxjcbf':  {img:b+'bandeja-pintar.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_vacxxprz0':  {img:b+'bandeja-pintar.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_69h9nvus8':  {img:b+'bandeja-pintar.jpg', dept:'infra', cat:'Remozamiento Profesional'},
    'prod_r2n83myqm':  {dept:'infra', cat:'Remozamiento Profesional'},

    // ── REMOZAMIENTO (pinturas) ──
    'prod_8rfkpfrr5':  {img:b+'masilla-pared.jpg'},
    'prod_eb42bviah':  {img:b+'cemento-blanco.jpg'},
    'prod_g7qgkxtxx':  {img:b+'tubo-emt.jpg'},
    'prod_9np542ifb':  {img:b+'tubo-emt.jpg'},
    'prod_az3no4o95':  {img:b+'abrazadera-emt.jpg'},
    'prod_fcy8mcikv':  {img:b+'abrazadera-emt.jpg'},
    'prod_eo19bm16r':  {img:b+'canaleta.jpg'},
    'prod_oqlew24le':  {img:b+'canaleta.jpg'},
    'prod_f1q0qx6zu':  {img:b+'bandeja-pintar.jpg'},
    'prod_ezp1r691s':  {img:b+'abrazadera-emt.jpg'},
    'prod_y2gfa14aq':  {img:b+'abrazadera-emt.jpg'},
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

    // ── BEBEDERO → energia ──
    'prod_f63uo2uj1':  {dept:'energia', cat:'Energía y Respaldo', brand:'Daiwa'},
  };

  var imgF=0, brandF=0, catF=0, deptF=0;
  mockDatabase.forEach(function(p) {
    var f = fixes[p.id];
    if (!f) return;
    if (f.img)   { p.img = f.img; p.gallery = [f.img]; imgF++; }
    if (f.brand) { p.brand = f.brand; brandF++; }
    if (f.cat)   { p.category = f.cat; catF++; }
    if (f.dept)  { p.department = f.dept; deptF++; }
  });

  console.log('[Futunet] Fixes: ' + imgF + ' imgs, ' + brandF + ' brands, ' + catF + ' cats, ' + deptF + ' depts');
})();
