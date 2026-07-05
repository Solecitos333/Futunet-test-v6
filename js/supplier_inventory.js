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
    {
      id: 'laptop_selektronic_dell_5410_i5',
      title: 'Laptop Dell Latitude 5410 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/01-dell-latitude-5410.webp', gallery: ['img/productos/laptops/01-dell-latitude-5410.webp'],
      desc: 'Laptop empresarial reacondicionada de décima generación, compacta y preparada para trabajo de oficina.',
      specs: ['Procesador: Intel Core i5 de 10.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5410-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_7400_i5',
      title: 'Laptop Dell Latitude 7400 Core i5, 8 GB RAM, SSD de 120/256 GB y HDD de 500 GB',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/02-dell-latitude-7400.webp', gallery: ['img/productos/laptops/02-dell-latitude-7400.webp'],
      desc: 'Laptop empresarial reacondicionada de octava generación con almacenamiento combinado sujeto a configuración disponible.',
      specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 120/256 GB + HDD de 500 GB', 'Condición: Reacondicionada', 'Configuración sujeta a inventario', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-7400-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5330_i7',
      title: 'Laptop Dell Latitude 5330 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/03-dell-latitude-5330.webp', gallery: ['img/productos/laptops/03-dell-latitude-5330.webp'],
      desc: 'Laptop empresarial reacondicionada de duodécima generación con formato portátil de 13.3 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 12.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-5330-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5490_i5_gen8',
      title: 'Laptop Dell Latitude 5490 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas, generación 8',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/04-dell-latitude-5490-gen8.webp', gallery: ['img/productos/laptops/04-dell-latitude-5490-gen8.webp'],
      desc: 'Laptop empresarial reacondicionada para productividad diaria y trabajo de oficina.',
      specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5490-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_7390_i7',
      title: 'Laptop Dell Latitude 7390 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/05-dell-latitude-7390.webp', gallery: ['img/productos/laptops/05-dell-latitude-7390.webp'],
      desc: 'Laptop empresarial reacondicionada de octava generación con diseño compacto de 13.3 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-7390-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_7390_touch_i7',
      title: 'Laptop Dell Latitude 7390 Touch Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/06-dell-latitude-7390-touch.webp', gallery: ['img/productos/laptops/06-dell-latitude-7390-touch.webp'],
      desc: 'Versión táctil reacondicionada de la Latitude 7390, orientada a movilidad y productividad empresarial.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-7390-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5401_i7',
      title: 'Laptop Dell Latitude 5401 Core i7, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/07-dell-latitude-5401.webp', gallery: ['img/productos/laptops/07-dell-latitude-5401.webp'],
      desc: 'Laptop empresarial reacondicionada de novena generación con pantalla de 14 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 9.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5401-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_3380',
      title: 'Laptop Dell Latitude 3380, 4 GB RAM, SSD de 120/128 GB, 13.3 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/08-dell-latitude-3380.webp', gallery: ['img/productos/laptops/08-dell-latitude-3380.webp'],
      desc: 'Laptop compacta reacondicionada para tareas educativas, navegación y ofimática básica.',
      specs: ['Generación del procesador: 6.ª', 'Memoria RAM: 4 GB', 'Almacenamiento: SSD de 120/128 GB', 'Pantalla: 13.3 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-13-3380-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_precision_7510',
      title: 'Laptop Dell Precision 7510 Core i7, 16 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/09-dell-precision-7510.webp', gallery: ['img/productos/laptops/09-dell-precision-7510.webp'],
      desc: 'Estación de trabajo móvil reacondicionada con gráficos profesionales para aplicaciones técnicas.',
      specs: ['Procesador: Intel Core i7 de 6.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 15.6 pulgadas', 'Gráficos profesionales AMD', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/precision-m7510-workstation/overview'
    },
    {
      id: 'laptop_selektronic_hp_zbook_15_g5',
      title: 'Laptop HP ZBook 15 G5 Core i7, 32 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'HP', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/10-hp-zbook-15-g5.webp', gallery: ['img/productos/laptops/10-hp-zbook-15-g5.webp'],
      desc: 'Estación de trabajo móvil reacondicionada con memoria ampliada para aplicaciones profesionales exigentes.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 32 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 15.6 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://support.hp.com/lamerica_nsc_cnt_amer-es/product/product-specs/undefined/18865644/'
    },
    {
      id: 'laptop_selektronic_lenovo_p53s',
      title: 'Laptop Lenovo ThinkPad P53s Core i7, 20 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/11-lenovo-thinkpad-p53s.webp', gallery: ['img/productos/laptops/11-lenovo-thinkpad-p53s.webp'],
      desc: 'Estación de trabajo móvil reacondicionada para productividad avanzada y flujos profesionales.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 20 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 15.6 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadp/p53s/22ws2wpp53s'
    },
    {
      id: 'laptop_selektronic_dell_5400_i7',
      title: 'Laptop Dell Latitude 5400 Core i7, 16 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/12-dell-latitude-5400.webp', gallery: ['img/productos/laptops/12-dell-latitude-5400.webp'],
      desc: 'Laptop empresarial reacondicionada de octava generación con memoria de 16 GB.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5400-laptop/overview'
    },
    {
      id: 'laptop_selektronic_lenovo_x1_carbon_gen6',
      title: 'Laptop Lenovo ThinkPad X1 Carbon Gen 6 Core i7, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/13-lenovo-x1-carbon-gen6.webp', gallery: ['img/productos/laptops/13-lenovo-x1-carbon-gen6.webp'],
      desc: 'Ultrabook empresarial reacondicionada, ligera y orientada a profesionales en movimiento.',
      specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Modelo: X1 Carbon de 6.ª generación', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/us/en/laptops/thinkpad/thinkpad-x/thinkpad-x1-carbon-6th-gen-/p/20KH002KUS'
    },
    {
      id: 'laptop_selektronic_dell_e5450_i7',
      title: 'Laptop Dell Latitude E5450 Core i7, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/14-dell-latitude-e5450.webp', gallery: ['img/productos/laptops/14-dell-latitude-e5450.webp'],
      desc: 'Laptop empresarial reacondicionada para ofimática, navegación y operaciones administrativas.',
      specs: ['Procesador: Intel Core i7 de 4.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-e5450-laptop/overview'
    },
    {
      id: 'laptop_selektronic_lenovo_p50',
      title: 'Laptop Lenovo ThinkPad P50 Core i7, 8 GB RAM, 128 GB SSD, 15.6 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/15-lenovo-thinkpad-p50.webp', gallery: ['img/productos/laptops/15-lenovo-thinkpad-p50.webp'],
      desc: 'Estación de trabajo móvil reacondicionada con gráficos dedicados para aplicaciones profesionales.',
      specs: ['Procesador: Intel Core i7 de 6.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 15.6 pulgadas', 'Gráficos dedicados: 2 GB', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/gb/en/p/laptops/thinkpad/thinkpadp/thinkpad-p50/22tp2wpwp50'
    },
    {
      id: 'laptop_selektronic_dell_e5570_touch',
      title: 'Laptop Dell Latitude E5570 Touch Core i7, 16 GB RAM, 256 GB SSD, 15.6 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/16-dell-latitude-e5570.webp', gallery: ['img/productos/laptops/16-dell-latitude-e5570.webp'],
      desc: 'Laptop empresarial táctil reacondicionada con gráficos dedicados y pantalla de 15.6 pulgadas.',
      specs: ['Procesador: Intel Core i7 de 6.ª generación', 'Memoria RAM: 16 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 15.6 pulgadas', 'Gráficos dedicados: 2 GB', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-e5570-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_5480_i5',
      title: 'Laptop Dell Latitude 5480 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/17-dell-latitude-5480.webp', gallery: ['img/productos/laptops/17-dell-latitude-5480.webp'],
      desc: 'Laptop empresarial reacondicionada de séptima generación para productividad cotidiana.',
      specs: ['Procesador: Intel Core i5 de 7.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5480-laptop/overview'
    },
    {
      id: 'laptop_selektronic_dell_chromebook_3180',
      title: 'Laptop Dell Chromebook 11 3180, 4 GB RAM, 16 GB eMMC, 11.6 pulgadas',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/18-dell-chromebook-3180.webp', gallery: ['img/productos/laptops/18-dell-chromebook-3180.webp'],
      desc: 'Chromebook reacondicionada y compacta para navegación, educación y trabajo en la nube.',
      specs: ['Procesador: Intel Celeron N3060', 'Memoria RAM: 4 GB', 'Almacenamiento: 16 GB eMMC', 'Pantalla: 11.6 pulgadas', 'Sistema: Chrome OS', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/manuals/en-us/chromebook-11-3180-laptop/chrome3180_om_pub/product-specification'
    },
    {
      id: 'laptop_selektronic_lenovo_x380_yoga',
      title: 'Laptop Lenovo ThinkPad X380 Yoga 2 en 1 Touch Core i5, 8 GB RAM, 256 GB SSD',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/19-lenovo-x380-yoga.webp', gallery: ['img/productos/laptops/19-lenovo-x380-yoga.webp'],
      desc: 'Convertible empresarial reacondicionada con pantalla táctil de 13.3 pulgadas y formato 2 en 1.',
      specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 13.3 pulgadas', 'Formato: 2 en 1', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.lenovo.com/nl/nl/p/laptops/thinkpad/thinkpadx/thinkpad-x380-yoga/22tp2txx380'
    },
    {
      id: 'laptop_selektronic_lenovo_e14_i5',
      title: 'Laptop Lenovo ThinkPad E14 Core i5, 8 GB RAM, 256 GB SSD, 14 pulgadas',
      brand: 'Lenovo', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/20-lenovo-thinkpad-e14.webp', gallery: ['img/productos/laptops/20-lenovo-thinkpad-e14.webp'],
      desc: 'Laptop empresarial reacondicionada de décima generación para productividad y trabajo híbrido.',
      specs: ['Procesador: Intel Core i5 de 10.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 256 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_E14/ThinkPad_E14_Spec.html'
    },
    {
      id: 'laptop_selektronic_dell_5490_i5_gen7',
      title: 'Laptop Dell Latitude 5490 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas, generación 7',
      brand: 'Dell', category: 'Laptops', price: 'Consultar precio',
      img: 'img/productos/laptops/21-dell-latitude-5490-gen7.webp', gallery: ['img/productos/laptops/21-dell-latitude-5490-gen7.webp'],
      desc: 'Laptop empresarial reacondicionada de séptima generación para tareas administrativas y trabajo de oficina.',
      specs: ['Procesador: Intel Core i5 de 7.ª generación', 'Memoria RAM: 8 GB', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Condición: Reacondicionada', 'Sujeto a disponibilidad'],
      sourceUrl: 'https://www.dell.com/support/product-details/en-us/product/latitude-14-5490-laptop/overview'
    },
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
      imagePosition: normalizeCopy(item.imagePosition || '50% 50%'),
      sourceUrl: normalizeCopy(item.sourceUrl || ''),
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


