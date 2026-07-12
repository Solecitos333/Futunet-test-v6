(function () {
  const SUPPLIER_POLICIES = {
    cecomsa: {
      label: 'Mayorista de tecnología',
      allowedConcepts: ['laptop', 'computadora', 'monitor', 'periferico', 'televisor'],
      defaultDepartment: 'equipos',
      defaultCategory: 'Equipos de Oficina'
    },
    selektronic: { label: 'Equipos Usados Selektronic', allowedConcepts: ['computadoras', 'generico'], defaultDepartment: 'equipos', defaultCategory: 'Computadoras' },
    tgm: { label: 'TGM Air Conditioning', allowedConcepts: ['aire', 'climatizacion'], defaultDepartment: 'energia', defaultCategory: 'Aires Acondicionados' },
    improoficinas: {
      label: 'Mayorista de oficina',
      allowedConcepts: ['mobiliario', 'papeleria', 'suministros', 'impresora', 'archivo', 'silla', 'escritorio'],
      defaultDepartment: 'oficina',
      defaultCategory: 'Papelería y Suministros'
    }
  };

  // Agrega aquí solo productos e imágenes que tengas derecho a revender y publicar.
  // Formato recomendado por item:
  // {
  //   title: 'Laptop Lenovo ThinkPad E14',
  //   brand: 'LENOVO',
  //   category: 'Laptops corporativas',
  //   price: 'RD$ 42,900.00',
  //   img: 'https://...',
  //   gallery: ['https://...', 'https://...'],
  //   desc: 'Descripción comercial breve',
  //   specs: ['Intel Core i5', '8 GB RAM', 'SSD 512 GB']
  // }
  const supplierFeeds = {
    cecomsa: [],
    selektronic: [    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  160/250GB DD USADOS DELL SFF - DESKTOP GENERACION 3',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 4,960.00',
      img: 'img/productos/selektronic/sel_0.jpg',
      gallery: ['img/productos/selektronic/sel_0.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  250/500GB DD USADOS DELL SFF - DESKTOP GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 11,760.00',
      img: 'img/productos/selektronic/sel_1.jpg',
      gallery: ['img/productos/selektronic/sel_1.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL TOWER TORRE GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 12,400.00',
      img: 'img/productos/selektronic/sel_2.jpg',
      gallery: ['img/productos/selektronic/sel_2.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL / SFF-DESKTOP GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 14,000.00',
      img: 'img/productos/selektronic/sel_3.jpg',
      gallery: ['img/productos/selektronic/sel_3.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL /TORRE GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 13,600.00',
      img: 'img/productos/selektronic/sel_4.jpg',
      gallery: ['img/productos/selektronic/sel_4.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL / SFF-DESKTOP GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 14,800.00',
      img: 'img/productos/selektronic/sel_5.jpg',
      gallery: ['img/productos/selektronic/sel_5.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM 500GB DD USADOS HP DESKTOP GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 11,200.00',
      img: 'img/productos/selektronic/sel_6.jpg',
      gallery: ['img/productos/selektronic/sel_6.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM 500GB DD USADOS HP DESKTOP GENERACION 8',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 16,074.24',
      img: 'img/productos/selektronic/sel_7.jpg',
      gallery: ['img/productos/selektronic/sel_7.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM 1TB DD USADOS HP DESKTOP GENERACION 8',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 16,074.24',
      img: 'img/productos/selektronic/sel_8.jpg',
      gallery: ['img/productos/selektronic/sel_8.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  1TB HDD USADOS HP SFF - DESKTOP GENERACION 9',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 18,400.00',
      img: 'img/productos/selektronic/sel_9.jpg',
      gallery: ['img/productos/selektronic/sel_9.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 4GB RAM  500GB DD USADOS HP DESKTOP GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 6,000.00',
      img: 'img/productos/selektronic/sel_10.jpg',
      gallery: ['img/productos/selektronic/sel_10.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i3 2.7/3.1 Mhz 8GB RAM  500GB DD USADOS DELL SFF - DESKTOP GENERACION 9',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 15,200.00',
      img: 'img/productos/selektronic/sel_11.jpg',
      gallery: ['img/productos/selektronic/sel_11.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 4GB RAM  250GB DD USADOS DELL SFF - DESKTOP GENERACION 2',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 4,240.00',
      img: 'img/productos/selektronic/sel_12.jpg',
      gallery: ['img/productos/selektronic/sel_12.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  250GB DD USADOS DELL SFF - DESKTOP GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 5,200.00',
      img: 'img/productos/selektronic/sel_13.jpg',
      gallery: ['img/productos/selektronic/sel_13.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  250GB DD USADOS DELL MICRO GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 6,000.00',
      img: 'img/productos/selektronic/sel_14.jpg',
      gallery: ['img/productos/selektronic/sel_14.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 4GB RAM 250/320GB DD USADOS DELL TORRE GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 3,987.20',
      img: 'img/productos/selektronic/sel_15.jpg',
      gallery: ['img/productos/selektronic/sel_15.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  128GB SSD USADOS DELL TORRE GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 10,800.00',
      img: 'img/productos/selektronic/sel_16.jpg',
      gallery: ['img/productos/selektronic/sel_16.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 4GB RAM  500GB DD USADOS DELL SFF - DESKTOP GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 7,259.52',
      img: 'img/productos/selektronic/sel_17.jpg',
      gallery: ['img/productos/selektronic/sel_17.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM 500GB DD USADOS DELL TORRE GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 10,800.00',
      img: 'img/productos/selektronic/sel_18.jpg',
      gallery: ['img/productos/selektronic/sel_18.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  1TB DD USADOS DELL TOWER GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 11,200.00',
      img: 'img/productos/selektronic/sel_19.jpg',
      gallery: ['img/productos/selektronic/sel_19.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  250/500GB DD USADOS DELL SFF - DESKTOP GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 13,200.00',
      img: 'img/productos/selektronic/sel_20.jpg',
      gallery: ['img/productos/selektronic/sel_20.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL SFF - DESKTOP GENERACION 8',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 17,080.32',
      img: 'img/productos/selektronic/sel_21.jpg',
      gallery: ['img/productos/selektronic/sel_21.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM 500GB DD DELL TOWER TORRE GENERACION 8',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 16,000.00',
      img: 'img/productos/selektronic/sel_22.jpg',
      gallery: ['img/productos/selektronic/sel_22.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL TORRE GENERACION 9',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 18,400.00',
      img: 'img/productos/selektronic/sel_23.jpg',
      gallery: ['img/productos/selektronic/sel_23.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  250/320GB DD USADOS DELL / SFF-DESKTOP GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 6,400.00',
      img: 'img/productos/selektronic/sel_24.jpg',
      gallery: ['img/productos/selektronic/sel_24.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  250/320GB DD USADOS DELL / TORRE GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 6,000.00',
      img: 'img/productos/selektronic/sel_25.jpg',
      gallery: ['img/productos/selektronic/sel_25.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 4GB RAM  250GB DD USADOS DELL /TORRE GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 5,600.00',
      img: 'img/productos/selektronic/sel_26.jpg',
      gallery: ['img/productos/selektronic/sel_26.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 4GB RAM  160/250GB DD USADOS DELL /  USFF GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 5,200.00',
      img: 'img/productos/selektronic/sel_27.jpg',
      gallery: ['img/productos/selektronic/sel_27.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  1TB DD USADOS DELL / SFF-DESKTOP GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 14,000.00',
      img: 'img/productos/selektronic/sel_28.jpg',
      gallery: ['img/productos/selektronic/sel_28.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  128GB SSD USADOS DELL / TOWER GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 12,000.00',
      img: 'img/productos/selektronic/sel_29.jpg',
      gallery: ['img/productos/selektronic/sel_29.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  1TB DD USADOS DELL / TOWER GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 10,800.00',
      img: 'img/productos/selektronic/sel_30.jpg',
      gallery: ['img/productos/selektronic/sel_30.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL USFF GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 11,200.00',
      img: 'img/productos/selektronic/sel_31.jpg',
      gallery: ['img/productos/selektronic/sel_31.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL / TOWER TORRE GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 14,400.00',
      img: 'img/productos/selektronic/sel_32.jpg',
      gallery: ['img/productos/selektronic/sel_32.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS DELL USFF GENERACION 8',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 20,000.00',
      img: 'img/productos/selektronic/sel_33.jpg',
      gallery: ['img/productos/selektronic/sel_33.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  1TB DD USADOS DELL SFF - DESKTOP GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 12,400.00',
      img: 'img/productos/selektronic/sel_34.jpg',
      gallery: ['img/productos/selektronic/sel_34.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i3 2.7/3.1 Mhz 16GB RAM  500GB HDD USADOS DELL MICRO GENERACION 9',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 16,000.00',
      img: 'img/productos/selektronic/sel_35.jpg',
      gallery: ['img/productos/selektronic/sel_35.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i3 2.7/3.1 Mhz 8GB RAM  256GB SSD USADOS DELL MICRO GENERACION 9',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 12,800.00',
      img: 'img/productos/selektronic/sel_36.jpg',
      gallery: ['img/productos/selektronic/sel_36.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i3 2.7/3.1 Mhz 4GB RAM  500GB DD USADOS DELL SFF - DESKTOP GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 9,714.56',
      img: 'img/productos/selektronic/sel_37.jpg',
      gallery: ['img/productos/selektronic/sel_37.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i3 2.7/3.1 Mhz 8GB RAM  500GB DD USADOS DELL MICRO GENERACION 9',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 15,200.00',
      img: 'img/productos/selektronic/sel_38.jpg',
      gallery: ['img/productos/selektronic/sel_38.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM 160/250GB DD USADOS DELL TORRE GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 4,880.00',
      img: 'img/productos/selektronic/sel_39.jpg',
      gallery: ['img/productos/selektronic/sel_39.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  256GB SSD USADOS DELL MICRO GENERACION 6',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 13,200.00',
      img: 'img/productos/selektronic/sel_40.jpg',
      gallery: ['img/productos/selektronic/sel_40.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  128GB SSD USADOS DELL SFF - DESKTOP GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 13,600.00',
      img: 'img/productos/selektronic/sel_41.jpg',
      gallery: ['img/productos/selektronic/sel_41.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  120GB SSD GIGABYTE MICRO GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 7,600.00',
      img: 'img/productos/selektronic/sel_42.jpg',
      gallery: ['img/productos/selektronic/sel_42.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  128GB SSD INTEL NUC KITS GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 12,000.00',
      img: 'img/productos/selektronic/sel_43.jpg',
      gallery: ['img/productos/selektronic/sel_43.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  256GB SSD INTEL NUC KITS GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 13,600.00',
      img: 'img/productos/selektronic/sel_44.jpg',
      gallery: ['img/productos/selektronic/sel_44.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i5 2.7/3.4 Mhz 8GB RAM  500GB DD USADOS HP MICRO GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 12,000.00',
      img: 'img/productos/selektronic/sel_45.jpg',
      gallery: ['img/productos/selektronic/sel_45.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE DUAL - P4-  PD - PR 2.3 A 2.7 1-2GB DDR2  80/160GB MOD. MIX USADAS',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 2,360.32',
      img: 'img/productos/selektronic/sel_46.jpg',
      gallery: ['img/productos/selektronic/sel_46.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i3 2.7/3.1 Mhz 8GB RAM  160/250GB DD USADOS DELL SFF - DESKTOP GENERACION 4',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 4,480.00',
      img: 'img/productos/selektronic/sel_47.jpg',
      gallery: ['img/productos/selektronic/sel_47.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  160GB DD USADOS DELL / SFF-DESKTOP GENERACION 3',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 5,760.00',
      img: 'img/productos/selektronic/sel_48.jpg',
      gallery: ['img/productos/selektronic/sel_48.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE 2 DUO 2.6 A 3.3 2GB 80/160DD DDR3 MOD. 780-380-HP-VARIAS USADAS',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 2,360.32',
      img: 'img/productos/selektronic/sel_49.jpg',
      gallery: ['img/productos/selektronic/sel_49.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE 2 DUO 2.8 A 3.3 1GB-2GB DDR2 80GB-160GB MOD.MIX USADAS',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 2,360.32',
      img: 'img/productos/selektronic/sel_50.jpg',
      gallery: ['img/productos/selektronic/sel_50.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      title: 'CORE i7 2.7/3.4 Mhz 8GB RAM  128GB SSD USADOS LENOVO DESKTOP GENERACION 7',
      brand: 'Usadas',
      category: 'Computadoras',
      price: 'RD$ 9,120.00',
      img: 'img/productos/selektronic/sel_51.jpg',
      gallery: ['img/productos/selektronic/sel_51.jpg'],
      desc: 'Equipo reacondicionado, ideal para oficina.',
      specs: ['Equipo Usado / Reacondicionado', 'Garantía limitada', 'Sujeto a disponibilidad']
    },
    {
      id: 'laptop_selektronic_dell_5410_i5',
      title: 'Laptop Dell Latitude 5410 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/01-dell-latitude-5410.webp', gallery: ['img/productos/laptops/01-dell-latitude-5410.webp', 'img/productos/laptops/01-dell-latitude-5410-02.webp', 'img/productos/laptops/01-dell-latitude-5410-03.webp'],
      imageSources: ['https://c1.neweggimages.com/productimage/nb640/34-833-765-04.jpg', 'https://i.ebayimg.com/images/g/OxwAAOSw0vxi1xWC/s-l500.jpg', 'https://coretekcomputers.com/cdn/shop/products/54108_1024x1024.jpg?v=1608152010'],
      desc: 'Laptop empresarial reacondicionada de décima generación, compacta y preparada para trabajo de oficina.',
      specs: ['Procesador: Intel Core i5 de 10.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5410-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_7400_i5',
      title: 'Laptop Dell Latitude 7400 Core i5, 8 GB RAM, SSD de 120/256 GB y HDD de 500 GB',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/02-dell-latitude-7400.webp', gallery: ['img/productos/laptops/02-dell-latitude-7400.webp', 'img/productos/laptops/02-dell-latitude-7400-02.webp', 'img/productos/laptops/02-dell-latitude-7400-03.webp'],
      imageSources: ['https://m.media-amazon.com/images/I/41wlAKXkewL.jpg', 'https://systemliquidation.com/cdn/shop/files/dell_7400_4_535x.png?v=1745943368', 'https://cdn11.bigcommerce.com/s-w5trgcbv/images/stencil/608x608/products/13422/77238/Dell_Latitude_7400_Front_Center__61314.1736258950.jpg?c=2'],
      desc: 'Laptop empresarial reacondicionada de octava generación con almacenamiento combinado sujeto a configuración disponible.',
      specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 120/256 GB + HDD de 500 GB', 'Condición: Reacondicionada', 'Configuración sujeta a inventario', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-7400-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5330_i7',
      title: 'Laptop Dell Latitude 5330 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/03-dell-latitude-5330.webp', gallery: ['img/productos/laptops/03-dell-latitude-5330.webp', 'img/productos/laptops/03-dell-latitude-5330-02.webp', 'img/productos/laptops/03-dell-latitude-5330-03.webp'],
      imageSources: ['https://cdn.cs.1worldsync.com/83/23/83238b5a-10f2-48de-ad3c-d831025b26e0.jpg', 'https://www.notebookcheck.net/fileadmin/_processed_/6/9/csm_Latitude_5330_Module_1_3_56f0a4e33d.jpg', 'https://m.media-amazon.com/images/I/71ENi73duuL.jpg'],
      desc: 'Laptop empresarial reacondicionada de duodécima generación con formato portátil de 13.3 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 12.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-5330-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5490_i5_gen8',
      title: 'Laptop Dell Latitude 5490 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas, generación 8',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/04-dell-latitude-5490-gen8.webp', gallery: ['img/productos/laptops/04-dell-latitude-5490-gen8.webp', 'img/productos/laptops/04-dell-latitude-5490-gen8-02.webp', 'img/productos/laptops/04-dell-latitude-5490-gen8-03.webp'],
      imageSources: ['https://i.ebayimg.com/images/g/T0wAAOSwjZBoLM6n/s-l500.jpg', 'https://m.media-amazon.com/images/I/71C3nDouAcL.jpg', 'https://coretekcomputers.com/cdn/shop/products/5490_A3_ad0b0d49-e3f7-4874-a939-19eae548a5df_1024x1024.png?v=1602266406'],
      desc: 'Laptop empresarial reacondicionada para productividad diaria y trabajo de oficina.',
      specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5490-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_7390_i7',
      title: 'Laptop Dell Latitude 7390 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/05-dell-latitude-7390.webp', gallery: ['img/productos/laptops/05-dell-latitude-7390.webp', 'img/productos/laptops/05-dell-latitude-7390-02.webp', 'img/productos/laptops/05-dell-latitude-7390-03.webp'],
      imageSources: ['https://c1.neweggimages.com/productimage/nb640/ADK7D22060616NYFT2C.jpg', 'https://i5.walmartimages.com/seo/Restored-Dell-Latitude-7390-2-in-1-Business-Laptop-13-3-FHD-1920-X-1080-Touchscreen-Intel-Core-i5-16GB-RAM-512GB-SSD-Refurbished_6428969d-bebe-42d8-96cd-35dabe7d4e02.a5a67d97b17cee8ed9fadc50309aa01b.jpeg', 'https://images.pcliquidations.com/images/isaac/151/151334t550.jpg'],
      desc: 'Laptop empresarial reacondicionada de octava generación con diseño compacto de 13.3 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-7390-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_7390_touch_i7',
      title: 'Laptop Dell Latitude 7390 Touch Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/06-dell-latitude-7390-touch.webp', gallery: ['img/productos/laptops/06-dell-latitude-7390-touch.webp', 'img/productos/laptops/06-dell-latitude-7390-touch-02.webp', 'img/productos/laptops/06-dell-latitude-7390-touch-03.webp'],
      imageSources: ['https://c1.neweggimages.com/productimage/nb640/ADK7D22060616NYFT2C.jpg', 'https://i5.walmartimages.com/seo/Restored-Dell-Latitude-7390-2-in-1-Business-Laptop-13-3-FHD-1920-X-1080-Touchscreen-Intel-Core-i5-16GB-RAM-512GB-SSD-Refurbished_6428969d-bebe-42d8-96cd-35dabe7d4e02.a5a67d97b17cee8ed9fadc50309aa01b.jpeg', 'https://images.pcliquidations.com/images/isaac/151/151334t550.jpg'],
      desc: 'Versión táctil reacondicionada de la Latitude 7390, orientada a movilidad y productividad empresarial.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-7390-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5401_i7',
      title: 'Laptop Dell Latitude 5401 Core i7, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/07-dell-latitude-5401.webp', gallery: ['img/productos/laptops/07-dell-latitude-5401.webp', 'img/productos/laptops/07-dell-latitude-5401-02.webp', 'img/productos/laptops/07-dell-latitude-5401-03.webp'],
      imageSources: ['https://m.media-amazon.com/images/I/41I97t7DEZL.jpg', 'https://c1.neweggimages.com/productimage/nb640/A24G_1_201907131965542505.jpg', 'https://cdn.cs.1worldsync.com/ef/36/ef367e26-25d4-4671-9d2b-d39a8b9ce3d2.jpg'],
      desc: 'Laptop empresarial reacondicionada de novena generación con pantalla de 14 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 9.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5401-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_3380',
      title: 'Laptop Dell Latitude 3380, 4 GB RAM, SSD de 120/128 GB, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/08-dell-latitude-3380.webp', gallery: ['img/productos/laptops/08-dell-latitude-3380.webp', 'img/productos/laptops/08-dell-latitude-3380-02.webp', 'img/productos/laptops/08-dell-latitude-3380-03.webp'],
      imageSources: ['https://systemliquidation.com/cdn/shop/files/Untitleddesign_44_56efffbd-c55e-4bfc-9bf3-caec1a42fd04_535x.png?v=1745943033', 'https://m.media-amazon.com/images/I/419B-w5cczL.jpg', 'https://srtrader.net/wp-content/uploads/2023/06/dell-3380-7th-gen3.png'],
      desc: 'Laptop compacta reacondicionada para tareas educativas, navegación y ofimática básica.',
      specs: ['Generación del procesador: 6.ª', 'Memoria RAM: 4 GB', 'Almacenamiento: SSD de 120/128 GB', 'Pantalla: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-3380-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_precision_7510',
      title: 'Laptop Dell Precision 7510 Core i7, 16 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/09-dell-precision-7510.webp', gallery: ['img/productos/laptops/09-dell-precision-7510.webp', 'img/productos/laptops/09-dell-precision-7510-02.webp', 'img/productos/laptops/09-dell-precision-7510-03.webp'],
      imageSources: ['https://images-na.ssl-images-amazon.com/images/I/61fTZQHT1ML.jpg', 'https://i.ebayimg.com/images/g/UJEAAeSwMm1qOCq8/s-l960.webp', 'https://coretekcomputers.com/cdn/shop/products/DellPrecision75104_1024x1024.jpg?v=1594266960'],
      desc: 'Estación de trabajo móvil reacondicionada con gráficos profesionales para aplicaciones técnicas.',
      specs: ['Procesador: Intel Core i7 de 6.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 15.6 pulgadas', 'Gráficos profesionales AMD', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/precision-m7510-workstation/overview'
    },
    {
      id: 'laptop_selektronic_hp_zbook_15_g5',
      title: 'Laptop HP ZBook 15 G5 Core i7, 32 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'HP', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/10-hp-zbook-15-g5.webp', gallery: ['img/productos/laptops/10-hp-zbook-15-g5.webp', 'img/productos/laptops/10-hp-zbook-15-g5-02.webp', 'img/productos/laptops/10-hp-zbook-15-g5-03.webp'],
      imageSources: ['https://www.notebookcheck.net/uploads/tx_nbc2/HPZBook15G5__7_.JPG', 'https://c1.neweggimages.com/productimage/nb640/ADT2S230726zBqcz.jpg', 'https://m.media-amazon.com/images/I/41oLaQLM8gL.jpg'],
      desc: 'Estación de trabajo móvil reacondicionada con memoria ampliada para aplicaciones profesionales exigentes.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 32 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 15.6 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://support.hp.com/lamerica_nsc_cnt_amer-es/product/product-specs/undefined/18865644/'
    },
    {
      id: 'laptop_selektronic_lenovo_p53s',
      title: 'Laptop Lenovo ThinkPad P53s Core i7, 20 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/11-lenovo-thinkpad-p53s.webp', gallery: ['img/productos/laptops/11-lenovo-thinkpad-p53s.webp', 'img/productos/laptops/11-lenovo-thinkpad-p53s-02.webp', 'img/productos/laptops/11-lenovo-thinkpad-p53s-03.webp'],
      imageSources: ['https://m.media-amazon.com/images/I/51yh-t8wIIL.jpg', 'https://systemliquidation.com/cdn/shop/files/Lenovo_P53s_2_535x.png?v=1778598177', 'https://images-na.ssl-images-amazon.com/images/I/51-pPJqvlIL.jpg'],
      desc: 'Estación de trabajo móvil reacondicionada para productividad avanzada y flujos profesionales.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 20 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 15.6 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadp/p53s/22ws2wpp53s'
    },
    {
      id: 'laptop_selektronic_dell_5400_i7',
      title: 'Laptop Dell Latitude 5400 Core i7, 16 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/12-dell-latitude-5400.webp', gallery: ['img/productos/laptops/12-dell-latitude-5400.webp', 'img/productos/laptops/12-dell-latitude-5400-02.webp', 'img/productos/laptops/12-dell-latitude-5400-03.webp'],
      imageSources: ['https://cdn.mos.cms.futurecdn.net/95WEqd8io6SteTDNTDzuXo.jpg', 'https://c1.neweggimages.com/productimage/nb640/34-343-982-05.jpg', 'https://systemliquidation.com/cdn/shop/products/DELL5400_3_3c55c18a-2bdb-4e63-978b-d24d2aabd96a_535x.png?v=1745943234'],
      desc: 'Laptop empresarial reacondicionada de octava generación con memoria de 16 GB.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5400-laptop/overview'
    },
    {
      id: 'laptop_selektronic_lenovo_x1_carbon_gen6',
      title: 'Laptop Lenovo ThinkPad X1 Carbon Gen 6 Core i7, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/13-lenovo-x1-carbon-gen6.webp', gallery: ['img/productos/laptops/13-lenovo-x1-carbon-gen6.webp', 'img/productos/laptops/13-lenovo-x1-carbon-gen6-02.webp', 'img/productos/laptops/13-lenovo-x1-carbon-gen6-03.webp'],
      imageSources: ['https://images-na.ssl-images-amazon.com/images/I/71AT5YblvJL.jpg', 'https://coretekcomputers.com/cdn/shop/products/X1Carbon6thGen2_1024x1024.jpg?v=1642325148', 'https://legacy-us-images.foundryco.app/images/article/2018/08/right-ports-2-2-100769116-large.jpg'],
      desc: 'Ultrabook empresarial reacondicionada, ligera y orientada a profesionales en movimiento.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Modelo: X1 Carbon de 6.ª generación', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/us/en/laptops/thinkpad/thinkpad-x/thinkpad-x1-carbon-6th-gen-/p/20KH002KUS'
    },
    {
      id: 'laptop_selektronic_dell_e5450_i7',
      title: 'Laptop Dell Latitude E5450 Core i7, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/14-dell-latitude-e5450.webp', gallery: ['img/productos/laptops/14-dell-latitude-e5450.webp', 'img/productos/laptops/14-dell-latitude-e5450-02.webp', 'img/productos/laptops/14-dell-latitude-e5450-03.webp'],
      imageSources: ['https://oliveinnovative.com/wp-content/uploads/2020/12/61l2za2YdCL._AC_SL1500_.jpg', 'https://coretekcomputers.com/cdn/shop/products/E5450_2_d177e2c0-0aa3-42c7-a346-3338308256dd_1024x1024.jpg?v=1585341693', 'https://i.ebayimg.com/images/g/4nIAAeSwFc5qQqlD/s-l960.webp'],
      desc: 'Laptop empresarial reacondicionada para ofimática, navegación y operaciones administrativas.',
      specs: ['Procesador: Intel Core i7 de 4.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-e5450-laptop/overview'
    },
    {
      id: 'laptop_selektronic_lenovo_p50',
      title: 'Laptop Lenovo ThinkPad P50 Core i7, 8 GB RAM, 128 GB SSD, 15.6 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/15-lenovo-thinkpad-p50.webp', gallery: ['img/productos/laptops/15-lenovo-thinkpad-p50.webp', 'img/productos/laptops/15-lenovo-thinkpad-p50-02.webp', 'img/productos/laptops/15-lenovo-thinkpad-p50-03.webp'],
      imageSources: ['https://systemliquidation.com/cdn/shop/files/Lenovo_P50_2_535x.png?v=1778531536', 'https://i.ebayimg.com/images/g/Uf0AAeSwo9lqUxiV/s-l960.webp', 'https://designandmotion.net/blog/wp-content/uploads/2016/06/Thinkpad_P50_Close-up_Shot_0004.png'],
      desc: 'Estación de trabajo móvil reacondicionada con gráficos dedicados para aplicaciones profesionales.',
      specs: ['Procesador: Intel Core i7 de 6.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 15.6 pulgadas', 'Gráficos dedicados: 2 GB', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/gb/en/p/laptops/thinkpad/thinkpadp/thinkpad-p50/22tp2wpwp50'
    },
    {
      id: 'laptop_selektronic_dell_e5570_touch',
      title: 'Laptop Dell Latitude E5570 Touch Core i7, 16 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/16-dell-latitude-e5570.webp', gallery: ['img/productos/laptops/16-dell-latitude-e5570.webp', 'img/productos/laptops/16-dell-latitude-e5570-02.webp', 'img/productos/laptops/16-dell-latitude-e5570-03.webp'],
      imageSources: ['https://images.pcliquidations.com/images/isaac/151/151379t550.jpg', 'https://m.media-amazon.com/images/I/41CVYsfsYdL.jpg', 'https://c1.neweggimages.com/productimage/nb640/ACPJ_1_201810232011086786.jpg'],
      desc: 'Laptop empresarial táctil reacondicionada con gráficos dedicados y pantalla de 15.6 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 6.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 15.6 pulgadas', 'Gráficos dedicados: 2 GB', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-e5570-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5480_i5',
      title: 'Laptop Dell Latitude 5480 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/17-dell-latitude-5480.webp', gallery: ['img/productos/laptops/17-dell-latitude-5480.webp', 'img/productos/laptops/17-dell-latitude-5480-02.webp', 'img/productos/laptops/17-dell-latitude-5480-03.webp'],
      imageSources: ['https://coretekcomputers.com/cdn/shop/products/5480_0_1024x1024.jpg?v=1589835820', 'https://c1.neweggimages.com/productimage/nb640/AF9SS2204070VNWTZ98.jpg', 'https://www.laptoparena.net/images/DELL_Latitude_5480_992c95.jpg'],
      desc: 'Laptop empresarial reacondicionada de séptima generación para productividad cotidiana.',
      specs: ['Procesador: Intel Core i5 de 7.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5480-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_chromebook_3180',
      title: 'Laptop Dell Chromebook 11 3180, 4 GB RAM, 16 GB eMMC, 11.6 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/18-dell-chromebook-3180.webp', gallery: ['img/productos/laptops/18-dell-chromebook-3180.webp', 'img/productos/laptops/18-dell-chromebook-3180-02.webp', 'img/productos/laptops/18-dell-chromebook-3180-03.webp'],
      imageSources: ['https://m.media-amazon.com/images/I/61qyoO6XzrL.jpg', 'https://coretekcomputers.com/cdn/shop/products/DELL31808_1024x1024.jpg?v=1595477478', 'https://cdn.cs.1worldsync.com/a9/a9/a9a99849-6636-4ab6-8faa-5f4f16ccdee8.jpg'],
      desc: 'Chromebook reacondicionada y compacta para navegación, educación y trabajo en la nube.',
      specs: ['Procesador: Intel Celeron N3060', 'Memoria RAM: 4 GB', 'Almacenamiento: 16 GB eMMC', 'Pantalla: 11.6 pulgadas', 'Sistema: Chrome OS', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/manuals/en-us/chromebook-11-3180-laptop/chrome3180_om_pub/product-specification'
    },
    {
      id: 'laptop_selektronic_lenovo_x380_yoga',
      title: 'Laptop Lenovo ThinkPad X380 Yoga 2 en 1 Touch Core i5, 8 GB RAM, 256 GB SSD',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/19-lenovo-x380-yoga.webp', gallery: ['img/productos/laptops/19-lenovo-x380-yoga.webp', 'img/productos/laptops/19-lenovo-x380-yoga-02.webp', 'img/productos/laptops/19-lenovo-x380-yoga-03.webp'],
      imageSources: ['https://www.notebookcheck.net/uploads/tx_nbc2/LenovoThinkPadX380Yoga__6__01.JPG', 'https://i.pcmag.com/imagery/reviews/02C1t0ewRwNQL5UxxA0l0bB-1.fit_lim.size_810x456.v_1569469936.jpg', 'https://c1.neweggimages.com/productimage/nb640/A6ABD21102111ZT80.jpg'],
      desc: 'Convertible empresarial reacondicionada con pantalla táctil de 13.3 pulgadas y formato 2 en 1.',
      specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 13.3 pulgadas', 'Formato: 2 en 1', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/nl/nl/p/laptops/thinkpad/thinkpadx/thinkpad-x380-yoga/22tp2txx380'
    },
    {
      id: 'laptop_selektronic_lenovo_e14_i5',
      title: 'Laptop Lenovo ThinkPad E14 Core i5, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/20-lenovo-thinkpad-e14.webp', gallery: ['img/productos/laptops/20-lenovo-thinkpad-e14.webp', 'img/productos/laptops/20-lenovo-thinkpad-e14-02.webp', 'img/productos/laptops/20-lenovo-thinkpad-e14-03.webp'],
      imageSources: ['https://techtoschool.com/cdn/shop/files/Product_Listing_12_2048x2048.png?v=1726853187', 'https://m.media-amazon.com/images/I/616jSAon1fL.jpg', 'https://i.ebayimg.com/images/g/I0YAAeSw4ABp9q0P/s-l500.jpg'],
      desc: 'Laptop empresarial reacondicionada de décima generación para productividad y trabajo híbrido.',
      specs: ['Procesador: Intel Core i5 de 10.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_E14/ThinkPad_E14_Spec.html'
    },
    {
      id: 'laptop_selektronic_dell_5490_i5_gen7',
      title: 'Laptop Dell Latitude 5490 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas, generación 7',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/21-dell-latitude-5490-gen7.webp', gallery: ['img/productos/laptops/21-dell-latitude-5490-gen7.webp', 'img/productos/laptops/21-dell-latitude-5490-gen7-02.webp', 'img/productos/laptops/21-dell-latitude-5490-gen7-03.webp'],
      imageSources: ['https://i.ebayimg.com/images/g/T0wAAOSwjZBoLM6n/s-l500.jpg', 'https://m.media-amazon.com/images/I/71C3nDouAcL.jpg', 'https://coretekcomputers.com/cdn/shop/products/5490_A3_ad0b0d49-e3f7-4874-a939-19eae548a5df_1024x1024.png?v=1602266406'],
      desc: 'Laptop empresarial reacondicionada de séptima generación para tareas administrativas y trabajo de oficina.',
      specs: ['Procesador: Intel Core i5 de 7.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5490-laptop/overview'
    },
  ],

  tgm: [
    {
      id: 'tgm_mwfot_12000_btu',
      title: 'Aire acondicionado TGM Mini-Split 12,000 BTU',
      brand: 'TGM', category: 'Aires Acondicionados', price: 'Consultar precio',
      img: 'img/productos/tgm/tgm-fixed-speed-12000-btu.webp', gallery: ['img/productos/tgm/tgm-fixed-speed-12000-btu.webp', 'img/productos/tgm/tgm-mwfot-official-specs.webp', 'img/productos/tgm/tgm-mwfot-official-features.webp'],
      imageSources: [
        { src: 'img/productos/tgm/tgm-fixed-speed-12000-btu.webp', alt: 'Unidad interior TGM MWFOT12S de 12,000 BTU', type: 'front', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' },
        { src: 'img/productos/tgm/tgm-mwfot-official-specs.webp', alt: 'Ficha técnica oficial de la serie TGM MWFOT', type: 'specification', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' },
        { src: 'img/productos/tgm/tgm-mwfot-official-features.webp', alt: 'Funciones registradas en la ficha oficial TGM MWFOT', type: 'detail', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' }
      ],
      desc: 'Mini-Split TGM de velocidad fija para climatización residencial y comercial ligera.',
      specs: ['Marca: TGM', 'Modelo: MWFOT12S / MRFOT12AS', 'Capacidad: 12,000 BTU/h', 'Tipo: Mini-Split de velocidad fija (convencional)', 'Eficiencia energética: EER 2.8 W/W; SEER no indicado en la ficha', 'Voltaje y frecuencia: 220-230 V, 60 Hz, 1 fase', 'Corriente nominal / máxima: 5.7 A / 9.0 A', 'Refrigerante: R410A, carga indicada de 0.46 kg', 'Área de aplicación estimada por el fabricante: 16-23 m²', 'Nivel de ruido interior (alto/medio/bajo): 39 / 31.5 / 26.5 dB(A)', 'Nivel de ruido exterior: 53 dB(A)', 'Funciones documentadas: modo silencioso, memoria de posición de aleta, encendido manual y detección de fuga de refrigerante', 'Filtro: alta densidad', 'WiFi y funciones inteligentes: no documentadas en la ficha oficial', 'Dimensiones unidad interior (ancho × fondo × alto): 805 × 194 × 285 mm', 'Dimensiones unidad exterior (ancho × fondo × alto): 681 × 285 × 434 mm', 'Peso neto interior / exterior: 8.0 / 23.7 kg', 'Tubería líquido / gas: 6.35 / 9.52 mm (1/4 / 3/8 pulgadas)', 'Longitud máxima de tubería / desnivel: 20 m / 8 m', 'Accesorios: kit de tubería indicado como incluido por el fabricante', 'Instalación: requiere alimentación compatible y validación del recorrido, drenaje y soportes', 'Garantía: confirmar al cotizar', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf'
    },
    {
      id: 'tgm_mwfot_18000_btu',
      title: 'Aire acondicionado TGM Mini-Split 18,000 BTU',
      brand: 'TGM', category: 'Aires Acondicionados', price: 'Consultar precio',
      img: 'img/productos/tgm/tgm-fixed-speed-18000-btu.webp', gallery: ['img/productos/tgm/tgm-fixed-speed-18000-btu.webp', 'img/productos/tgm/tgm-mwfot-official-specs.webp', 'img/productos/tgm/tgm-mwfot-official-features.webp'],
      imageSources: [
        { src: 'img/productos/tgm/tgm-fixed-speed-18000-btu.webp', alt: 'Unidad interior TGM MWFOT18S de 18,000 BTU', type: 'front', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' },
        { src: 'img/productos/tgm/tgm-mwfot-official-specs.webp', alt: 'Ficha técnica oficial de la serie TGM MWFOT', type: 'specification', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' },
        { src: 'img/productos/tgm/tgm-mwfot-official-features.webp', alt: 'Funciones registradas en la ficha oficial TGM MWFOT', type: 'detail', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' }
      ],
      desc: 'Mini-Split TGM de velocidad fija con mayor capacidad para espacios medianos.',
      specs: ['Marca: TGM', 'Modelo: MWFOT18S / MRFOT18AS', 'Capacidad: 18,000 BTU/h', 'Tipo: Mini-Split de velocidad fija (convencional)', 'Eficiencia energética: EER 2.8 W/W; SEER no indicado en la ficha', 'Voltaje y frecuencia: 220-230 V, 60 Hz, 1 fase', 'Corriente nominal / máxima: 8.4 A / 11.9 A', 'Refrigerante: R410A, carga indicada de 560 g', 'Área de aplicación estimada por el fabricante: 24-35 m²', 'Nivel de ruido interior (alto/medio/bajo): 42.9 / 38.2 / 34.6 dB(A)', 'Nivel de ruido exterior: 58.4 dB(A)', 'Funciones documentadas: modo silencioso, memoria de posición de aleta, encendido manual y detección de fuga de refrigerante', 'Filtro: alta densidad', 'WiFi y funciones inteligentes: no documentadas en la ficha oficial', 'Dimensiones unidad interior (ancho × fondo × alto): 957 × 213 × 302 mm', 'Dimensiones unidad exterior (ancho × fondo × alto): 770 × 300 × 555 mm', 'Peso neto interior / exterior: 10 / 31.9 kg', 'Tubería líquido / gas: 6.35 / 12.7 mm (1/4 / 1/2 pulgadas)', 'Longitud máxima de tubería / desnivel: 25 m / 10 m', 'Accesorios: kit de tubería indicado como incluido por el fabricante', 'Instalación: requiere alimentación compatible y validación del recorrido, drenaje y soportes', 'Garantía: confirmar al cotizar', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf'
    },
    {
      id: 'tgm_mwfot_24000_btu',
      title: 'Aire acondicionado TGM Mini-Split 24,000 BTU',
      brand: 'TGM', category: 'Aires Acondicionados', price: 'Consultar precio',
      img: 'img/productos/tgm/tgm-fixed-speed-24000-btu.webp', gallery: ['img/productos/tgm/tgm-fixed-speed-24000-btu.webp', 'img/productos/tgm/tgm-mwfot-official-specs.webp', 'img/productos/tgm/tgm-mwfot-official-features.webp'],
      imageSources: [
        { src: 'img/productos/tgm/tgm-fixed-speed-24000-btu.webp', alt: 'Unidad interior TGM MWFOT24S de 24,000 BTU', type: 'front', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' },
        { src: 'img/productos/tgm/tgm-mwfot-official-specs.webp', alt: 'Ficha técnica oficial de la serie TGM MWFOT', type: 'specification', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' },
        { src: 'img/productos/tgm/tgm-mwfot-official-features.webp', alt: 'Funciones registradas en la ficha oficial TGM MWFOT', type: 'detail', source: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf' }
      ],
      desc: 'Mini-Split TGM de velocidad fija para áreas amplias y necesidades de climatización exigentes.',
      specs: ['Marca: TGM', 'Modelo: MWFOT24S / MRFOT24AS', 'Capacidad: 24,000 BTU/h', 'Tipo: Mini-Split de velocidad fija (convencional)', 'Eficiencia energética: EER 2.8 W/W; SEER no indicado en la ficha', 'Voltaje y frecuencia: 220-230 V, 60 Hz, 1 fase', 'Corriente nominal / máxima: 11.4 A / 17 A', 'Refrigerante: R410A, carga indicada de 910 g', 'Área de aplicación estimada por el fabricante: 32-47 m²', 'Nivel de ruido interior (alto/medio/bajo): 47.7 / 41.3 / 38.1 dB(A)', 'Nivel de ruido exterior: 57.6 dB(A)', 'Funciones documentadas: modo silencioso, memoria de posición de aleta, encendido manual y detección de fuga de refrigerante', 'Filtro: alta densidad', 'WiFi y funciones inteligentes: no documentadas en la ficha oficial', 'Dimensiones unidad interior (ancho × fondo × alto): 1040 × 220 × 327 mm', 'Dimensiones unidad exterior (ancho × fondo × alto): 845 × 363 × 702 mm', 'Peso neto interior / exterior: 13 / 40.8 kg', 'Tubería líquido / gas: 9.52 / 15.9 mm (3/8 / 5/8 pulgadas)', 'Longitud máxima de tubería / desnivel: 25 m / 10 m', 'Accesorios: kit de tubería indicado como incluido por el fabricante', 'Instalación: requiere alimentación compatible y validación del recorrido, drenaje y soportes', 'Garantía: confirmar al cotizar', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://tgmairconditioning.com/wp-content/uploads/2018/07/MWFOTSpecs.pdf'
    }
  ],

  improoficinas: [
      {
        id: 'mob_oficina_1',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo blanco con panel frontal',
        desc: 'Superficie amplia, pasacables integrado y panel frontal para mayor privacidad.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-1.jpeg',
        gallery: ['img/productos/mobiliario/mob-1.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Escritorio ejecutivo', 'Panel frontal', 'Pasacables integrado']
      },
      {
        id: 'mob_oficina_2',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio gerencial en L con credenza lateral',
        desc: 'Cubierta acabado madera, estructura gris y módulo lateral de almacenamiento.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-2.jpeg',
        gallery: ['img/productos/mobiliario/mob-2.jpeg'],
        imagePosition: '50% 48%',
        specs: ['Configuración en L', 'Credenza lateral', 'Acabado madera y gris']
      },
      {
        id: 'mob_oficina_3',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo con retorno auxiliar',
        desc: 'Diseño gerencial con superficie principal, retorno lateral y acabado combinado.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-3.jpeg',
        gallery: ['img/productos/mobiliario/mob-3.jpeg'],
        imagePosition: '50% 48%',
        specs: ['Retorno lateral', 'Superficie ejecutiva', 'Acabado combinado']
      },
      {
        id: 'mob_oficina_4',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Estación ejecutiva en L con pedestal',
        desc: 'Escritorio acabado madera con estructura metálica y gavetas laterales.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-4.jpeg',
        gallery: ['img/productos/mobiliario/mob-4.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Configuración en L', 'Pedestal con gavetas', 'Estructura metálica']
      },
      {
        id: 'mob_oficina_5',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio operativo rectangular gris',
        desc: 'Estación compacta con superficie texturizada y estructura metálica.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-5.jpeg',
        gallery: ['img/productos/mobiliario/mob-5.jpeg'],
        imagePosition: '50% 48%',
        specs: ['Formato rectangular', 'Superficie texturizada', 'Estructura metálica']
      },
      {
        id: 'mob_oficina_6',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo blanco con cubierta de vidrio',
        desc: 'Diseño contemporáneo con vidrio, pasacables y módulo lateral.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-6.jpeg',
        gallery: ['img/productos/mobiliario/mob-6.jpeg'],
        imagePosition: '50% 49%',
        specs: ['Cubierta de vidrio', 'Pasacables', 'Módulo lateral']
      },
      {
        id: 'mob_oficina_7',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo negro con cubierta de vidrio',
        desc: 'Superficie de vidrio negro y almacenamiento lateral integrado.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-7.jpeg',
        gallery: ['img/productos/mobiliario/mob-7.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Cubierta de vidrio negro', 'Almacenamiento lateral', 'Diseño ejecutivo']
      },
      {
        id: 'mob_oficina_8',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio gerencial en L con vidrio y madera',
        desc: 'Combinación de vidrio negro, detalles de madera y estructura metálica.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-8.jpeg',
        gallery: ['img/productos/mobiliario/mob-8.jpeg'],
        imagePosition: '50% 47%',
        specs: ['Configuración en L', 'Vidrio negro y madera', 'Estructura metálica']
      },
      {
        id: 'mob_oficina_9',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo blanco con panel metálico',
        desc: 'Cubierta de vidrio blanco, pasacables y panel frontal perforado.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-9.jpeg',
        gallery: ['img/productos/mobiliario/mob-9.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Cubierta de vidrio blanco', 'Panel frontal perforado', 'Pasacables']
      },
      {
        id: 'mob_oficina_10',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio modular en L blanco y gris',
        desc: 'Retorno lateral, compartimientos abiertos y pedestal de tres gavetas.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-10.jpeg',
        gallery: ['img/productos/mobiliario/mob-10.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Configuración modular en L', 'Compartimientos abiertos', 'Pedestal de tres gavetas']
      },
      {
        id: 'mob_oficina_11',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo acabado madera con patas metálicas',
        desc: 'Superficie amplia, panel frontal y estructura metálica moderna.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-11.jpeg',
        gallery: ['img/productos/mobiliario/mob-11.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Acabado madera', 'Panel frontal', 'Patas metálicas']
      },
      {
        id: 'mob_oficina_12',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo blanco y madera con cubierta de vidrio',
        desc: 'Cubierta de vidrio, estructura blanca y panel frontal acabado madera.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-12.jpeg',
        gallery: ['img/productos/mobiliario/mob-12.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Cubierta de vidrio', 'Estructura blanca', 'Panel frontal acabado madera']
      },
      {
        id: 'mob_oficina_13',
        department: 'oficina',
        category: 'Mobiliario',
        brand: 'Futunet Mobiliario',
        title: 'Escritorio ejecutivo negro con cubierta de vidrio',
        desc: 'Diseño sobrio con panel frontal metálico y estructura negra.',
        price: 'Cotizar',
        img: 'img/productos/mobiliario/mob-13.jpeg',
        gallery: ['img/productos/mobiliario/mob-13.jpeg'],
        imagePosition: '50% 50%',
        specs: ['Cubierta de vidrio negro', 'Panel frontal metálico', 'Estructura negra']
      }
    ]
  };

  function slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function normalizeCopy(value) {
    return String(value || '')
      .replace(/Ãƒ¡/g, 'á')
      .replace(/ÃƒÂ©/g, 'é')
      .replace(/ÃƒÂ­/g, 'í')
      .replace(/ÃƒÂ³/g, 'ó')
      .replace(/ÃƒÂº/g, 'ú')
      .replace(/ÃƒÂ±/g, 'ñ')
      .replace(/ÃƒÂ/g, 'Á')
      .replace(/Ãƒâ€°/g, 'Ã‰')
      .replace(/ÃƒÂ/g, 'Í')
      .replace(/Ãƒâ€œ/g, 'Ã“')
      .replace(/ÃƒÅ¡/g, 'Ãš')
      .replace(/Ã¢â‚¬â€œ/g, 'â€“')
      .replace(/Ã¢â‚¬â€/g, 'â€”')
      .replace(/Ã¢â‚¬Å“/g, 'â€œ')
      .replace(/Ã¢â‚¬Â/g, 'â€')
      .replace(/Ã‚/g, '')
      .trim();
  }

  function inferDepartment(item, policy) {
    const category = slugify(item.category || '');
    const title = slugify(item.title || '');

    if (/(laptop|computadora|monitor|periferico|teclado|mouse|televisor)/.test(`${category} ${title}`)) {
      return 'equipos';
    }
    if (/(papeleria|archivo|silla|escritorio|mobiliario|suministro)/.test(`${category} ${title}`)) {
      return 'oficina';
    }
    return policy.defaultDepartment;
  }

  function inferCategory(item, policy) {
    const explicitCategory = normalizeCopy(item.category || '');
    if (explicitCategory) return explicitCategory;

    const title = slugify(item.title || '');
    if (/(laptop|computadora|monitor|televisor)/.test(title)) {
      return 'Equipos de Oficina';
    }
    if (/(teclado|mouse|periferico|audifono|webcam)/.test(title)) {
      return 'Periféricos y Partes';
    }
    if (/(papeleria|archivo|silla|escritorio|mobiliario)/.test(title)) {
      return 'Papelería y Suministros';
    }
    return policy.defaultCategory;
  }

  function normalizeGallery(item) {
    const images = [];
    const candidates = [];

    if (item.img) candidates.push(item.img);
    if (Array.isArray(item.gallery)) {
      item.gallery.forEach((img) => candidates.push(img));
    }

    candidates
      .map((img) => String(img || '').trim())
      .filter(Boolean)
      .forEach((img) => {
        if (!images.includes(img)) images.push(img);
      });

    if (images.length === 1) images.push(images[0]);
    return images;
  }

  function normalizePrice(price) {
    const value = normalizeCopy(price || 'Cotizar');
    return value || 'Cotizar';
  }

  function inferBrand(source, item, title) {
    const explicitBrand = normalizeCopy(item.brand || '');
    const genericBrands = ['usadas', 'usados', 'genérico', 'generico', 'sin marca'];
    if (source !== 'selektronic' || !genericBrands.includes(explicitBrand.toLowerCase())) {
      return explicitBrand || 'Genérico';
    }

    const normalizedTitle = String(title || '').toUpperCase();
    const knownBrands = ['LENOVO', 'GIGABYTE', 'INTEL', 'DELL', 'HP', 'ACER', 'ASUS'];
    return knownBrands.find((brand) => new RegExp(`\\b${brand}\\b`).test(normalizedTitle)) || 'Reacondicionado';
  }

  function normalizeSpecs(item) {
    if (Array.isArray(item.specs) && item.specs.length) {
      return item.specs.map(normalizeCopy).filter(Boolean).slice(0, 40);
    }

    const fallbackSpecs = [];
    if (item.delivery) fallbackSpecs.push(`Entrega: ${normalizeCopy(item.delivery)}`);
    if (item.warranty) fallbackSpecs.push(`Garantía: ${normalizeCopy(item.warranty)}`);
    if (item.availability) fallbackSpecs.push(`Disponibilidad: ${normalizeCopy(item.availability)}`);
    if (!fallbackSpecs.length) {
      fallbackSpecs.push('Producto sujeto a cotización y disponibilidad.');
      fallbackSpecs.push('Asesoría personalizada para compra o reposición.');
    }
    return fallbackSpecs;
  }

  function isAllowedByPolicy(source, item) {
    const policy = SUPPLIER_POLICIES[source];
    if (!policy) return false;

    if (source !== 'cecomsa') return true;

    const haystack = slugify(`${item.title || ''} ${item.category || ''}`);
    return policy.allowedConcepts.some((concept) => haystack.includes(concept));
  }

  function normalizeSupplierProduct(source, item, index) {
    const policy = SUPPLIER_POLICIES[source];
    if (!policy || !isAllowedByPolicy(source, item)) return null;

    const title = normalizeCopy(item.title);
    const gallery = normalizeGallery(item);
    if (!title || gallery.length < 2) return null;

    const category = inferCategory(item, policy);
    const department = inferDepartment(item, policy);
    const brand = inferBrand(source, item, title);
    const desc = normalizeCopy(
      item.desc ||
        item.summary ||
        `Artículo disponible por cotización para ${category.toLowerCase()}, integrado al catálogo de Futunet con asesoría comercial.`
    );

    return {
      id: item.id || `supplier_${source}_${slugify(title)}_${index + 1}`,
      department,
      category,
      brand,
      title,
      desc,
      price: normalizePrice(item.price),
      img: gallery[0],
      gallery,
      imageSources: Array.isArray(item.imageSources) ? item.imageSources.map((source) => ({ ...source })) : [],
      imagePosition: normalizeCopy(item.imagePosition || '50% 50%'),
      sourceUrl: normalizeCopy(item.sourceUrl || ''),
      availability: normalizeCopy(item.availability || ''),
      stock: Number.isFinite(Number(item.stock)) ? Number(item.stock) : undefined,
      warranty: normalizeCopy(item.warranty || ''),
      specs: normalizeSpecs(item),
      supplier: source,
      supplierLabel: policy.label,
      sourceVisibility: 'internal'
    };
  }

  function buildSupplierProducts() {
    return Object.entries(supplierFeeds).flatMap(([source, items]) => {
      if (!Array.isArray(items)) return [];
      return items
        .map((item, index) => normalizeSupplierProduct(source, item, index))
        .filter(Boolean);
    });
  }

  function mergeIntoCatalog(products) {
    if (typeof mockDatabase === 'undefined' || !Array.isArray(mockDatabase) || !products.length) return;
    const existingById = new Map(mockDatabase.map((item) => [item.id, item]));
    products.forEach((product) => {
      const existing = existingById.get(product.id);
      if (existing) {
        // El feed local contiene normalizaciones editoriales (marca, textos y galería)
        // que también deben corregir documentos antiguos ya sincronizados en Firestore.
        Object.assign(existing, product);
      } else {
        mockDatabase.unshift(product);
        existingById.set(product.id, product);
      }
    });
  }

  function registerSupplierFeed(source, items) {
    if (!SUPPLIER_POLICIES[source] || !Array.isArray(items)) return [];
    supplierFeeds[source] = items;
    const products = buildSupplierProducts();
    mergeIntoCatalog(products);
    return products;
  }

  const initialProducts = buildSupplierProducts();
  if (window.FutunetData && window.FutunetData.readyPromise) {
    window.FutunetData.readyPromise.then(() => {
      mergeIntoCatalog(initialProducts);
    });
  } else {
    mergeIntoCatalog(initialProducts);
  }

  window.supplierInventory = {
    policies: SUPPLIER_POLICIES,
    feeds: supplierFeeds,
    register: registerSupplierFeed,
    normalizeSupplierProduct,
    getMergedCatalog() {
      return typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)
        ? mockDatabase
        : initialProducts.slice();
    }
  };
})();


