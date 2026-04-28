(function () {
  const SUPPLIER_POLICIES = {
    cecomsa: {
      label: 'Mayorista de tecnología',
      allowedConcepts: ['laptop', 'computadora', 'monitor', 'periferico', 'televisor'],
      defaultDepartment: 'equipos',
      defaultCategory: 'Equipos de Oficina'
    },
    selektronic: { label: 'Equipos Usados Selektronic', allowedConcepts: ['computadoras', 'generico'], defaultDepartment: 'equipos', defaultCategory: 'Computadoras' },
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
],

    improoficinas: []
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
    const candidates = [];

    if (item.img) candidates.push(item.img);
    if (Array.isArray(item.gallery)) {
      item.gallery.forEach((img) => candidates.push(img));
    }

    const images = Array.from(new Set(
      candidates
        .map((img) => String(img || '').trim())
        .filter(Boolean)
    ));

    if (images.length === 1) images.push(images[0]);
    return images;
  }

  function normalizePrice(price) {
    const value = normalizeCopy(price || 'Cotizar');
    return value || 'Cotizar';
  }

  function normalizeSpecs(item) {
    if (Array.isArray(item.specs) && item.specs.length) {
      return item.specs.map(normalizeCopy).filter(Boolean).slice(0, 6);
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
    const brand = normalizeCopy(item.brand || 'Genérico');
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
    const existingIds = new Set(mockDatabase.map((item) => item.id));
    products.forEach((product) => {
      if (!existingIds.has(product.id)) {
        mockDatabase.unshift(product);
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
  mergeIntoCatalog(initialProducts);

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


