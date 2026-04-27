const mockDatabase = [
  {
    "id": "prod_67gy3rahd",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "DELL",
    "title": "Computadora DELL procesador i5/ 8 GB Ram/ Disco duro SSD 256GB",
    "desc": "Equipo de escritorio Dell orientado a trabajo administrativo, facturación, navegación y multitarea ligera. La combinación de procesador Intel Core i5, 8 GB de memoria y unidad SSD de 256 GB ofrece una experiencia más ágil que un equipo con disco duro mecánico tradicional.",
    "price": "RD$ 10,613.90",
    "img": "img/productos/dell-optiplex-i7.jpg",
    "gallery": [
      "img/productos/dell-optiplex-i7.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Procesador Intel Core i5",
      "Memoria RAM: 8 GB",
      "Almacenamiento SSD: 256 GB",
      "Formato de escritorio para oficina y recepción"
    ]
  },
  {
    "id": "prod_8rfkpfrr5",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "1/4 Masilla De Pared",
    "desc": "ã€Calidad Premiumã€‘ 1/4 Masilla De Pared. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 438.00",
    "img": "img/sheetrock.jpg",
    "gallery": [
      "img/sheetrock.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_az3no4o95",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "ABRAZADERAS DE 1/2",
    "desc": "ã€Calidad Premiumã€‘ ABRAZADERAS DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 35.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fcy8mcikv",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "ABRAZADERAS DE 3/4",
    "desc": "ã€Calidad Premiumã€‘ ABRAZADERAS DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 40.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_rox1a1r0g",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Abanico pared",
    "desc": "ã€Calidad Premiumã€‘ Abanico pared. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4,350.00",
    "img": "img/aire.jpg",
    "gallery": [
      "img/aire.jpg",
      "img/solar.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ad1d2a977b",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "APPLE",
    "title": "Air Pod 2da Generacion Original APPLE",
    "desc": "Air Pod 2da Generacion Original APPLE. Artículo de papelería o suministro para el día a día administrativo, escolar u operativo, seleccionado para cubrir necesidades frecuentes de oficina.",
    "price": "RD$ 5,400.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Suministro de oficina o uso escolar",
      "Presentación apta para consumo frecuente"
    ]
  },
  {
    "id": "prod_v0u1qvzs2",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Aislador de esquina",
    "desc": "ã€Calidad Premiumã€‘ Aislador de esquina. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,552.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_j1ixov27m",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Aislador de paso plano",
    "desc": "ã€Calidad Premiumã€‘ Aislador de paso plano. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,282.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9fwdeomcv",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Ajedrez",
    "desc": "ã€Calidad Premiumã€‘ Ajedrez. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 450.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0v1wm22fq",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Alambre cerco S-fire",
    "desc": "ã€Calidad Premiumã€‘ Alambre cerco S-fire. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,497.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_do7scjyqx",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Archivo acordeon Plastico",
    "desc": "ã€Calidad Premiumã€‘ Archivo acordeon Plastico. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 405.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jn0r7zygh",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Archivo de Metal 8 1/2 X 13, 4 gabetas",
    "desc": "ã€Calidad Premiumã€‘ Archivo de Metal 8 1/2 X 13, 4 gabetas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,935.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_pv4k4dixy",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Armario Metal 2 Puertas 18X36X32 pulgadas",
    "desc": "ã€Calidad Premiumã€‘ Armario Metal 2 Puertas 18X36X32 pulgadas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 14,175.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_r6n2atzcv",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Armario metal 72''",
    "desc": "ã€Calidad Premiumã€‘ Armario metal 72''. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 19,064.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_5sy71o0vo",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Aro Ula Ula Grande",
    "desc": "ã€Calidad Premiumã€‘ Aro Ula Ula Grande. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 127.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4sb7loj4n",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Aspiradora/Sopladora Inalambrica con cargador y bateria",
    "desc": "ã€Calidad Premiumã€‘ Aspiradora/Sopladora Inalambrica con cargador y bateria. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 7,200.00",
    "img": "img/aire.jpg",
    "gallery": [
      "img/aire.jpg",
      "img/solar.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_vgdtwk69e",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "BASE PARA TV CON BRAZO DE 14 A 55",
    "desc": "ã€Calidad Premiumã€‘ BASE PARA TV CON BRAZO DE 14 A 55. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 600.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_f1q0qx6zu",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Bandeja de Pintar",
    "desc": "ã€Calidad Premiumã€‘ Bandeja de Pintar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/sheetrock.jpg",
    "gallery": [
      "img/sheetrock.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ajmwyngxz",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Bandera 4X6 Oficial",
    "desc": "ã€Calidad Premiumã€‘ Bandera 4X6 Oficial. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 945.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_543wvp27p",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Barniz Marino Tropical",
    "desc": "ã€Calidad Premiumã€‘ Barniz Marino Tropical. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,875.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_sx997vnsv",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Base de Pared Para TV",
    "desc": "ã€Calidad Premiumã€‘ Base de Pared Para TV. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 975.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_7lkyxnuss",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Bateria 12V 4 AH",
    "desc": "ã€Calidad Premiumã€‘ Bateria 12V 4 AH. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,115.10",
    "img": "img/productos/conceptos/electrico-generico.jpg",
    "gallery": [
      "img/productos/conceptos/electrico-generico.jpg",
      "img/ups.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_f63uo2uj1",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "DAIWA",
    "title": "Bebedero Daiwa Blanco",
    "desc": "Bebedero Daiwa de piso color blanco, pensado para oficinas, recepciones y áreas comunes. El modelo DW-1189 ofrece suministro de agua a dos temperaturas y un formato práctico para uso diario en espacios corporativos o educativos.",
    "price": "RD$ 8,505.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/daiwa-dw-1189.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F71TRUOeGs1L._AC_UF1000%2C1000_QL80_.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Modelo: Daiwa DW-1189",
      "Dos temperaturas: fría y caliente",
      "Formato de piso con carga superior",
      "Color blanco para uso residencial u oficina"
    ]
  },
  {
    "id": "prod_y9fn9qw5p",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Bloques Educativos grande",
    "desc": "ã€Calidad Premiumã€‘ Bloques Educativos grande. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_rg3m6r2bb",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Bocina Portatil bluetooth, usb",
    "desc": "ã€Calidad Premiumã€‘ Bocina Portatil bluetooth, usb. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,625.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_mmffzpx11",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Bocina SMT Led mic/control",
    "desc": "ã€Calidad Premiumã€‘ Bocina SMT Led mic/control. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,670.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hzx5k891t",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Borrante para pizzaras lotos",
    "desc": "ã€Calidad Premiumã€‘ Borrante para pizzaras lotos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 81.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_vf4g4x8qr",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Brocha Prismo Edge 2",
    "desc": "ã€Calidad Premiumã€‘ Brocha Prismo Edge 2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 57.21",
    "img": "img/productos/conceptos/brocha-generico.jpg",
    "gallery": [
      "img/productos/conceptos/brocha-generico.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jtaae1bo2",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Brocha Prismo Edge 3",
    "desc": "ã€Calidad Premiumã€‘ Brocha Prismo Edge 3. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.26",
    "img": "img/productos/conceptos/brocha-generico.jpg",
    "gallery": [
      "img/productos/conceptos/brocha-generico.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_23swvjws9",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Brocha Prismo Edge 4",
    "desc": "ã€Calidad Premiumã€‘ Brocha Prismo Edge 4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 123.30",
    "img": "img/productos/conceptos/brocha-generico.jpg",
    "gallery": [
      "img/productos/conceptos/brocha-generico.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_79yfzhbol",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "CABLE HDMI 25 FT",
    "desc": "ã€Calidad Premiumã€‘ CABLE HDMI 25 FT. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 900.00",
    "img": "img/productos/displayport-cable.jpg",
    "gallery": [
      "img/productos/displayport-cable.jpg",
      "img/redes.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_lrk0tcvfc",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Genérico",
    "title": "CABLES AC Y VGA PARA COMPUTADORAS",
    "desc": "ã€Calidad Premiumã€‘ CABLES AC Y VGA PARA COMPUTADORAS. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 180.00",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/productos/displayport-cable.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9jexoy67x",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Genérico",
    "title": "CAMARA AHD BULLET 2 MP HYBRID",
    "desc": "ã€Calidad Premiumã€‘ CAMARA AHD BULLET 2 MP HYBRID. Equipado con un diseño avanzado y complementado con resolución nítida de 2 megapíxeles, dándote la mejor relación de valor y tecnología. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,322.50",
    "img": "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2Fasset%2FM000002423%2Fimages%2FHiLook-THC-B1X0-Fixed-Lens-Bullet.png%3Ff%3Dwebp&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2Fasset%2FM000002423%2Fimages%2FHiLook-THC-B1X0-Fixed-Lens-Bullet.png%3Ff%3Dwebp&w=720&output=webp&q=72",
      "img/camaras.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hup4kfqpz",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Genérico",
    "title": "CAMARAS IP BULLET 2 MP HYBRID",
    "desc": "ã€Calidad Premiumã€‘ CAMARAS  IP BULLET 2 MP HYBRID. Equipado con un diseño avanzado y complementado con resolución nítida de 2 megapíxeles, dándote la mejor relación de valor y tecnología. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,220.00",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg",
      "img/productos/tapo-c210.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_eo19bm16r",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "CANALETAS PLASTICAS",
    "desc": "ã€Calidad Premiumã€‘ CANALETAS PLASTICAS. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 225.00",
    "img": "img/sheetrock.jpg",
    "gallery": [
      "img/sheetrock.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0sbd2t214",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "CARTULINAS COLORES 25/1",
    "desc": "ã€Calidad Premiumã€‘ CARTULINAS COLORES 25/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 33.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_akvr1ewvy",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "CINTA DOBLE CARA TRANSPARENTE",
    "desc": "ã€Calidad Premiumã€‘ CINTA DOBLE CARA TRANSPARENTE. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 310.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ezp1r691s",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "CLAVOS DE PARED P/ FULMINANTE",
    "desc": "ã€Calidad Premiumã€‘ CLAVOS DE PARED P/ FULMINANTE. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4.00",
    "img": "img/sheetrock.jpg",
    "gallery": [
      "img/sheetrock.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_dwjbbd8gy",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "DELL",
    "title": "COMPUTADORA DELL CORE i7 /3.4 MHZ/ 8 GB RAM/250 GB DD USADAS 4TA GEN",
    "desc": "Computadora Dell usada de línea empresarial, adecuada para tareas de oficina, navegación, paquetes de productividad y estaciones administrativas. Su procesador Core i7 de cuarta generación y 8 GB de RAM ofrecen mejor margen de trabajo que un equipo básico de entrada.",
    "price": "RD$ 4,875.00",
    "img": "img/productos/dell-optiplex-i7.jpg",
    "gallery": [
      "img/productos/dell-optiplex-i7.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Procesador Intel Core i7 de 4ta generación",
      "Memoria RAM: 8 GB",
      "Almacenamiento HDD: 250 GB",
      "Equipo usado / reacondicionado para entorno corporativo"
    ]
  },
  {
    "id": "prod_is3v61eky",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "DELL",
    "title": "COMPUTADORA DELL CORE i5/ 4 GB RAM/250 GB DD USADAS 4TA GEN",
    "desc": "Desktop Dell de uso corporativo con procesador Intel Core i5 de cuarta generación. Es una opción práctica para digitación, navegación, sistemas de oficina y puestos de trabajo básicos que no requieren software pesado.",
    "price": "RD$ 3,630.00",
    "img": "img/productos/dell-optiplex-i7.jpg",
    "gallery": [
      "img/productos/dell-optiplex-i7.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Procesador Intel Core i5 de 4ta generación",
      "Memoria RAM: 4 GB",
      "Almacenamiento HDD: 250 GB",
      "Equipo usado / reacondicionado"
    ]
  },
  {
    "id": "prod_xkna6ugad",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "CONECTOR EMT DE 1/2",
    "desc": "ã€Calidad Premiumã€‘ CONECTOR  EMT DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 37.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_yv5qir42u",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "CONECTOR EMT DE 3/4",
    "desc": "ã€Calidad Premiumã€‘ CONECTOR  EMT DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_od3q4fwxz",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cable Display Port male/male usd",
    "desc": "ã€Calidad Premiumã€‘ Cable Display Port male/male usd. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 178.50",
    "img": "img/productos/displayport-cable.jpg",
    "gallery": [
      "img/productos/displayport-cable.jpg",
      "img/redes.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0by6q3y4l",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Cable HDMI 10 FT",
    "desc": "ã€Calidad Premiumã€‘ Cable HDMI 10 FT. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 337.50",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F615z2-QyJIL._AC_UF894%2C1000_QL80_.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_u8kryxru8",
    "department": "redes",
    "category": "Componentes de red",
    "brand": "Genérico",
    "title": "Cable UTP CAT 5E CCA",
    "desc": "ã€Calidad Premiumã€‘ Cable UTP CAT 5E CCA. Construido con materiales de gran pureza para reducir las interferencias de señal y garantizar una infraestructura veloz y robusta. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,902.50",
    "img": "img/productos/displayport-cable.jpg",
    "gallery": [
      "img/productos/displayport-cable.jpg",
      "img/redes.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_my3x094wj",
    "department": "redes",
    "category": "Componentes de red",
    "brand": "Genérico",
    "title": "Cable UTP Cat 6 cca",
    "desc": "ã€Calidad Premiumã€‘ Cable UTP Cat 6 cca. Construido con materiales de gran pureza para reducir las interferencias de señal y garantizar una infraestructura veloz y robusta. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 11,070.00",
    "img": "img/productos/displayport-cable.jpg",
    "gallery": [
      "img/productos/displayport-cable.jpg",
      "img/redes.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_u1oqr0mu2",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cable bujia p/cerco 25 mt",
    "desc": "ã€Calidad Premiumã€‘ Cable bujia p/cerco 25 mt. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,150.55",
    "img": "img/productos/displayport-cable.jpg",
    "gallery": [
      "img/productos/displayport-cable.jpg",
      "img/cerco.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fq5zbj3ed",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Cable de poder para pc",
    "desc": "ã€Calidad Premiumã€‘ Cable de poder para pc. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 187.00",
    "img": "img/productos/conceptos/electrico-generico.jpg",
    "gallery": [
      "img/productos/conceptos/electrico-generico.jpg",
      "img/productos/displayport-cable.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_8yhmripoe",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Caja Organizador peq 11 lt",
    "desc": "ã€Calidad Premiumã€‘ Caja Organizador peq 11 lt. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 495.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ca3i5l5vx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Calcul. de mesa sharp 2630PII GRANDE",
    "desc": "ã€Calidad Premiumã€‘ Calcul. de mesa sharp 2630PII GRANDE. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,500.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_1bo57yqq8",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "UNV",
    "title": "Camara UNV 2 MP",
    "desc": "Cámara Uniview de 2 MP con línea ColorHunter para escenarios donde se requiere mejor desempeño nocturno y captura de color en baja iluminación. Es una alternativa atractiva para residencias, comercios y proyectos que buscan más detalle visual fuera del horario diurno.",
    "price": "RD$ 2,385.00",
    "img": "img/productos/unv-2mp-bullet.png",
    "gallery": [
      "img/productos/unv-2mp-bullet.png",
      "img/camaras.jpg"
    ],
    "specs": [
      "Resolución de video: 2 MP",
      "Tecnología de imagen a color en baja iluminación",
      "Diseñada para monitoreo continuo 24/7",
      "Integrable a grabadores NVR Uniview"
    ]
  },
  {
    "id": "prod_hzrvubz6i",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "UNV",
    "title": "Camara UNV 2MP COLOR VU",
    "desc": "Cámara IP Uniview de 2 megapíxeles diseñada para proyectos de videovigilancia residencial y comercial. Ofrece resolución Full HD, compresión de video eficiente y una presentación profesional para instalaciones con grabación por NVR.",
    "price": "RD$ 4,500.00",
    "img": "img/productos/unv-2mp-bullet.png",
    "gallery": [
      "img/productos/unv-2mp-bullet.png",
      "img/camaras.jpg"
    ],
    "specs": [
      "Resolución de video: 2 MP (Full HD 1080p)",
      "Compresión Ultra 265 / H.265 / H.264",
      "Alimentación PoE para instalación simplificada",
      "Uso recomendado en sistemas IP de seguridad"
    ]
  },
  {
    "id": "prod_xaqvtv846",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "TAPO",
    "title": "Camara WIFI Tapo C210 Tp Link",
    "desc": "Cámara Wiâ€‘Fi TP-Link Tapo C210 para interiores con video 2K de 3 MP, paneo e inclinación motorizados y acceso remoto desde la app Tapo. Es ideal para monitoreo de oficinas pequeñas, habitaciones, recepción, pasillos y control visual de áreas internas.",
    "price": "RD$ 2,990.00",
    "img": "https://wsrv.nl/?url=static.tp-link.com%2Fupload%2Fimage-line%2FTapo_C500_EU_2.0_overview_2406_English_01-4_large_20240620080121y.jpg&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=static.tp-link.com%2Fupload%2Fimage-line%2FTapo_C500_EU_2.0_overview_2406_English_01-4_large_20240620080121y.jpg&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=static.tp-link.com%2Fupload%2Fimage-line%2FTapoC210_04_large_20251119200031h.jpg&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=static.tp-link.com%2Fupload%2Fimage-header%2FD230_normal_20241101063325n.png&w=720&output=webp&q=72"
    ],
    "specs": [
      "Video 2K 3 MP (2304 Ã— 1296)",
      "Paneo horizontal amplio y movimiento vertical motorizado",
      "Visión nocturna de hasta 30 ft",
      "Audio bidireccional y almacenamiento microSD hasta 512 GB"
    ]
  },
  {
    "id": "prod_oqlew24le",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Canaletas Blancas",
    "desc": "ã€Calidad Premiumã€‘ Canaletas Blancas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 202.50",
    "img": "img/sheetrock.jpg",
    "gallery": [
      "img/sheetrock.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9i3rntl7a",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Carpeta de 1.5 pulgadas de 3 anillos",
    "desc": "ã€Calidad Premiumã€‘ Carpeta de 1.5 pulgadas de  3 anillos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 240.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_kkvhvx121",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Carpeta de 4 pulgadas y 3 anillos",
    "desc": "ã€Calidad Premiumã€‘ Carpeta de 4 pulgadas y 3 anillos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 607.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_sz47q4qhy",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cartulina Blanca",
    "desc": "ã€Calidad Premiumã€‘ Cartulina Blanca. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 13.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ws4sk3zhg",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cartulina Metalica dorada",
    "desc": "ã€Calidad Premiumã€‘ Cartulina Metalica dorada. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 87.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_eb42bviah",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Cemento Blanco Funda 5 lb",
    "desc": "ã€Calidad Premiumã€‘ Cemento Blanco Funda 5 lb. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 97.50",
    "img": "img/productos/conceptos/cemento-generico.jpg",
    "gallery": [
      "img/productos/conceptos/cemento-generico.jpg",
      "img/sheetrock.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_8ymxsbgt5",
    "department": "seguridad",
    "category": "Cerraduras",
    "brand": "Genérico",
    "title": "Cerradura magnetica completa",
    "desc": "ã€Calidad Premiumã€‘ Cerradura magnetica completa. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 11,512.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_43xoob4nt",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cincheta",
    "desc": "ã€Calidad Premiumã€‘ Cincheta. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 90.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3lpi00w1u",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "3M",
    "title": "Cinta Masking Tape 3M Scotch",
    "desc": "Cinta de enmascarar Scotch 3M para trabajos de pintura, protección temporal, etiquetado y uso general en mantenimiento. Su respaldo de papel facilita el rasgado a mano y ofrece una presentación mucho más consistente que una cinta genérica de oficina.",
    "price": "RD$ 255.00",
    "img": "https://wsrv.nl/?url=multimedia.3m.com%2Fmws%2Fmedia%2F787742J%2Fscotch.jpg%3Fwidth%3D506&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=multimedia.3m.com%2Fmws%2Fmedia%2F787742J%2Fscotch.jpg%3Fwidth%3D506&w=720&output=webp&q=72",
      "img/productos/3m-masking-tape.jpg",
      "https://wsrv.nl/?url=multimedia.3m.com%2Fmws%2Fmedia%2F1806378J%2Fscotch-basic-masking-tape-24mm-x-50m-grp01.jpg%3Fwidth%3D506&w=720&output=webp&q=72"
    ],
    "specs": [
      "Marca: Scotch 3M",
      "Ancho nominal: 3/4 pulg.",
      "Respaldo de papel tipo crepé",
      "Remoción más limpia en aplicaciones generales"
    ]
  },
  {
    "id": "prod_zerbf6n8a",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cinta Merleto Invisible 18X33 MM",
    "desc": "ã€Calidad Premiumã€‘ Cinta Merleto Invisible 18X33 MM. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 60.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_6wzdwza5a",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cinta Satin tricolor ancha 2 pulgadas",
    "desc": "ã€Calidad Premiumã€‘ Cinta Satin tricolor ancha 2 pulgadas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 661.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_axp7tgy7b",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cinta color bandera 3/4 ft x 2 --- 50 yardas",
    "desc": "ã€Calidad Premiumã€‘ Cinta color bandera 3/4 ft x 2 --- 50 yardas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 452.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_j8osyd5by",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "3M",
    "title": "Cinta doble cara 3/4 x 38 3M Scott",
    "desc": "Cinta doble cara Scotch 3M para montaje ligero, manualidades, presentaciones, fijación y aplicaciones de oficina. Su diseño adhesivo por ambas caras permite una sujeción más limpia y estética en comparación con soluciones improvisadas de pegado.",
    "price": "RD$ 3,645.00",
    "img": "img/productos/3m-double-sided-tape.jpg",
    "gallery": [
      "img/productos/3m-double-sided-tape.jpg",
      "https://wsrv.nl/?url=i.ebayimg.com%2Fimages%2Fg%2FFs0AAeSw7IJon6g9%2Fs-l1200.webp&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F61Ae9YDWXNL.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Marca: Scotch 3M",
      "Ancho: 3/4 pulg.",
      "Longitud comercial: 38 yd",
      "Adhesivo doble cara para fijación y montaje ligero"
    ]
  },
  {
    "id": "prod_xa3myztu6",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cinta empaque ancha 2x100 worker",
    "desc": "ã€Calidad Premiumã€‘ Cinta empaque ancha 2x100 worker. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ggjbeu4gz",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cinta tricolor 1/2 x 50 fina",
    "desc": "ã€Calidad Premiumã€‘ Cinta tricolor 1/2 x 50 fina. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 378.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ywokd9kjb",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Clear Protector B. Aceite",
    "desc": "ã€Calidad Premiumã€‘ Clear Protector B. Aceite. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,507.20",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_uu5gqjyp6",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Clic Caja 100/1",
    "desc": "ã€Calidad Premiumã€‘ Clic Caja 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 27.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_xomuyjeig",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Clic Niquelados 5MM 100/1",
    "desc": "ã€Calidad Premiumã€‘ Clic Niquelados 5MM 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 60.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ys6kcahet",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cono de Senalizacion",
    "desc": "ã€Calidad Premiumã€‘ Cono de Senalizacion. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 159.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0242510cdb",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "HIKVISION",
    "title": "Control De Acceso Biometrico HIKVISION",
    "desc": "Control De Acceso Biometrico HIKVISION. Solución de videovigilancia pensada para monitoreo, control y refuerzo de seguridad en hogares, oficinas y negocios.",
    "price": "RD$ 7,700.00",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000060523%2FS-%E7%AD%92%E6%9C%BA102-%E6%8A%93%E6%8B%8D%E6%AC%BE-%E5%B7%A6%E4%BE%A7-%E6%B5%B7%E5%A4%96-%E5%8F%8C%E9%89%B4%E7%89%88.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000060523%2FS-%E7%AD%92%E6%9C%BA102-%E6%8A%93%E6%8B%8D%E6%AC%BE-%E5%B7%A6%E4%BE%A7-%E6%B5%B7%E5%A4%96-%E5%8F%8C%E9%89%B4%E7%89%88.png&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fen%2Fmarketing%2Fimage%2Fproducts%2Faccess-control-products%2Fspeed-gate-and-turnstiles%2FPreview-Gate-Opener-image.png&w=720&output=webp&q=72"
    ],
    "specs": [
      "Orientado a videovigilancia y monitoreo",
      "Compatible con instalaciones residenciales y comerciales"
    ]
  },
  {
    "id": "prod_hhdf2sbhw",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Corrector talbot 11 ml",
    "desc": "ã€Calidad Premiumã€‘ Corrector talbot 11 ml. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 47.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_j678gzz2e",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cuaderno Cocido Ofi-Nota 200 paguinas",
    "desc": "ã€Calidad Premiumã€‘ Cuaderno Cocido Ofi-Nota 200 paguinas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 42.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_2qw2dl3k3",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cuaderno Cuadriculado 144 pag",
    "desc": "ã€Calidad Premiumã€‘ Cuaderno Cuadriculado 144 pag. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 78.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hn72fkg6t",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cuardo Cuadriculado 144 paguinas",
    "desc": "ã€Calidad Premiumã€‘ Cuardo Cuadriculado 144 paguinas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 74.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bkl2rdbja",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Cuchilla Limpieza sharp mx m365",
    "desc": "ã€Calidad Premiumã€‘ Cuchilla Limpieza sharp mx m365. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,755.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_pxexmmvn1",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "DC Hembra a Presion",
    "desc": "ã€Calidad Premiumã€‘ DC Hembra a Presion. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 40.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_xz31q2ui7",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "DC Macho a Presion",
    "desc": "ã€Calidad Premiumã€‘ DC Macho a Presion. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 40.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_i1wfrc7vh",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "DISCO DURO 2 TB WD PURPURA",
    "desc": "ã€Calidad Premiumã€‘ DISCO DURO 2 TB WD PURPURA. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4,628.75",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ry8bjs9cb",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "DISCO DURO 4TB WD PULPURA P/VIDEO VIGILANCIA",
    "desc": "ã€Calidad Premiumã€‘ DISCO DURO 4TB WD PULPURA P/VIDEO VIGILANCIA. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 8,438.00",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_xt0bc2nd2",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "DISCO DURO 8 TB WD PULPURA P/VIDEO VIGILANCIA",
    "desc": "ã€Calidad Premiumã€‘ DISCO DURO 8 TB WD PULPURA P/VIDEO VIGILANCIA. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 19,375.00",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_n5tqqtuma",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "DISCO DURO DE 500 GB HDD P/VIDEO VIGILANCIA",
    "desc": "ã€Calidad Premiumã€‘ DISCO DURO DE 500 GB HDD P/VIDEO VIGILANCIA. Equipado con un diseño avanzado y complementado con un disco de 500GB de almacenamiento masivo, dándote la mejor relación de valor y tecnología. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,160.00",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hsxxhrb4j",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "DISCO SSD SATA PATROIT 128 GB 2.5 NUEVO",
    "desc": "ã€Calidad Premiumã€‘ DISCO SSD SATA PATROIT 128 GB  2.5 NUEVO. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,027.00",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_zu8fswens",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "DISCO SSD SATA PATROIT 256 GB 2.5 NUEVO",
    "desc": "ã€Calidad Premiumã€‘ DISCO SSD SATA PATROIT 256 GB  2.5 NUEVO. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,575.00",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_v4n47vlw2",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "DVR 16 CH Hikvison",
    "desc": "ã€Calidad Premiumã€‘ DVR 16 CH Hikvison. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,175.00",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg",
      "img/productos/tapo-c210.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4xvhvwoam",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "HIKVISION",
    "title": "DVR 8CH HIKVISION 1080 P",
    "desc": "Grabador DVR Hikvision de 8 canales para sistemas Turbo HD y cámaras analógicas compatibles. Es una base sólida para instalaciones de seguridad pequeñas y medianas con grabación centralizada y salida de video para monitoreo local.",
    "price": "RD$ 3,047.50",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000061727%2FiDS-8116HQHI-M8S%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000061727%2FiDS-8116HQHI-M8S%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
      "img/productos/hikvision-dvr-8ch.png"
    ],
    "specs": [
      "Modelo sugerido por la línea: DS-7108HGHI-K1",
      "8 entradas BNC para video analógico HD",
      "Soporta video 1080p y compresión H.265+/H.265/H.264",
      "Salida HDMI y VGA para monitoreo local"
    ]
  },
  {
    "id": "prod_cyc8mnsl0",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Desinfectante Macier",
    "desc": "ã€Calidad Premiumã€‘ Desinfectante Macier. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_trr8i21ms",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Disco Duro 1 TB SEAGATE",
    "desc": "ã€Calidad Premiumã€‘ Disco Duro 1 TB SEAGATE. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,129.80",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_12im6c9yo",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Disolvente Industrial Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Disolvente Industrial Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,072.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_elgtfyda4",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "ESTANTE PARA LIBROS DE 4 NIVELES",
    "desc": "ã€Calidad Premiumã€‘ ESTANTE PARA LIBROS DE 4 NIVELES. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 148,500.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_37431uj9f",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Electrificador AGL",
    "desc": "ã€Calidad Premiumã€‘ Electrificador AGL. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,133.05",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jgilr42mx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Encuadernadora de espiral continuo 20h",
    "desc": "ã€Calidad Premiumã€‘ Encuadernadora de espiral continuo 20h. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,500.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_7fxzhrsl1",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Escritorio Corporativo",
    "desc": "ã€Calidad Premiumã€‘ Escritorio Corporativo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 13,500.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ldt8qpyqd",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Escritorio Importado",
    "desc": "ã€Calidad Premiumã€‘ Escritorio Importado. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 14,242.50",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jrtuzvr2y",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Esponja Bonbril",
    "desc": "ã€Calidad Premiumã€‘ Esponja Bonbril. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 141.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3ck218d0f",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Estopa",
    "desc": "ã€Calidad Premiumã€‘ Estopa. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_drsbrwqov",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Etiquetas para folder label",
    "desc": "ã€Calidad Premiumã€‘ Etiquetas para folder label. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_c5fqoo8ym",
    "department": "seguridad",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Evaluacion, Medicion y Cotizacion de sistema de camaras",
    "desc": "Servicio de visita técnica para levantar requerimientos de videovigilancia en residencias, oficinas, comercios o proyectos institucionales. Incluye evaluación del área, recomendación de puntos de cámara y propuesta económica preliminar según el alcance identificado.",
    "price": "RD$ 1,000.00",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg",
      "img/productos/tapo-c210.jpg"
    ],
    "specs": [
      "Levantamiento técnico en sitio",
      "Evaluación de cobertura, puntos y canalización",
      "Recomendación inicial de equipos y materiales",
      "Entrega de cotización según el alcance del proyecto"
    ]
  },
  {
    "id": "prod_h3dpf48x5",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "FOAMY BRIILO PAQ 10/1",
    "desc": "ã€Calidad Premiumã€‘ FOAMY BRIILO PAQ 10/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_72dz82us1",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "FOLDER C/BOLSILLOS 25/1",
    "desc": "ã€Calidad Premiumã€‘ FOLDER C/BOLSILLOS 25/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,485.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_y2gfa14aq",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "FULMINANTE P/ PISTOLA CLAVO",
    "desc": "ã€Calidad Premiumã€‘ FULMINANTE P/ PISTOLA CLAVO. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3.00",
    "img": "img/sheetrock.jpg",
    "gallery": [
      "img/sheetrock.jpg",
      "img/pintura.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_1hwg9veqw",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Foamy Liso 9x12 sin brillo 10/1",
    "desc": "ã€Calidad Premiumã€‘ Foamy Liso 9x12 sin brillo 10/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 118.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_i7e87pop8",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Foamy de letras y numeros (Alfombras)",
    "desc": "ã€Calidad Premiumã€‘ Foamy de letras y numeros (Alfombras). Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 510.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_6cw69dkjz",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Folder Manila 8 1/2 X 14",
    "desc": "ã€Calidad Premiumã€‘ Folder Manila 8 1/2 X 14. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 607.50",
    "img": "https://wsrv.nl/?url=media.officedepot.com%2Fimages%2Ft_enlarge%2Cf_auto%2Fproducts%2F9819996%2F1.jpg&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=media.officedepot.com%2Fimages%2Ft_enlarge%2Cf_auto%2Fproducts%2F9819996%2F1.jpg&w=720&output=webp&q=72",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_69o7lkyyd",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Folder amarillo 8 1/2 x 11 100/1",
    "desc": "ã€Calidad Premiumã€‘ Folder amarillo 8 1/2 x 11 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 391.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_d2i5bt9x4",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Fuente 12 V 5A DNV",
    "desc": "ã€Calidad Premiumã€‘ Fuente 12 V  5A DNV. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 675.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_8dqiwsp5y",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Funda Mediana 17x22 1/100",
    "desc": "ã€Calidad Premiumã€‘ Funda Mediana 17x22 1/100. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 162.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ux1v86dkh",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Funda para basura 55 gl 100/1 36x54",
    "desc": "ã€Calidad Premiumã€‘ Funda para basura 55 gl 100/1 36x54. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 796.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ad02p61re",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Fundas 55 gal 100/1",
    "desc": "ã€Calidad Premiumã€‘ Fundas 55 gal 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 803.96",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_sd5ukzzlw",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Fundas Para Basura 28X35 100/1 30",
    "desc": "ã€Calidad Premiumã€‘ Fundas Para Basura 28X35 100/1 30. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 526.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fy2c5keb5",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "GABINETE DE 9U 600X600MM",
    "desc": "ã€Calidad Premiumã€‘ GABINETE DE 9U 600X600MM. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,950.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fo6bsjf2r",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "GOMITAS ELASTICAS #18",
    "desc": "ã€Calidad Premiumã€‘ GOMITAS ELASTICAS #18. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 67.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_e9yrvwgwu",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Gabinete 4U 600X450",
    "desc": "ã€Calidad Premiumã€‘ Gabinete 4U  600X450. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,277.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_n57ur7vgu",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Garantia de 30 dias en inperfecto de fabrica",
    "desc": "ã€Calidad Premiumã€‘ Garantia de 30 dias en inperfecto de fabrica. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 0.10",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_gowax7pqx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Globo terraqueo 32 cm b/metal",
    "desc": "ã€Calidad Premiumã€‘ Globo terraqueo 32 cm b/metal. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,375.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fwntni0z7",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Grapadora",
    "desc": "ã€Calidad Premiumã€‘ Grapadora. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 307.50",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_vh2jmdv9d",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Grapas Standar",
    "desc": "ã€Calidad Premiumã€‘ Grapas Standar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hmeic6hvu",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Greca de 12. Tazas",
    "desc": "ã€Calidad Premiumã€‘ Greca de 12. Tazas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,012.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_7jxkdrt2x",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Guillotina 12 Tradicional",
    "desc": "ã€Calidad Premiumã€‘ Guillotina 12 Tradicional. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,100.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_yw467f1gv",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Hojas protectora 8.5 x 11",
    "desc": "ã€Calidad Premiumã€‘ Hojas protectora 8.5 x 11. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 240.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ev8mssce4",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "EPSON",
    "title": "IMPRESORA MULTIFUNCIONAL C/SISTEMA DE TINTA L3250 EPSON",
    "desc": "Impresora multifuncional Epson EcoTank L3250 con funciones de impresión, copiado y escaneo. Está orientada a hogares y oficinas que buscan bajo costo por página, conectividad inalámbrica y un sistema de tinta recargable más conveniente que el cartucho tradicional.",
    "price": "RD$ 20,625.00",
    "img": "img/productos/epson-l3250.jpg",
    "gallery": [
      "img/productos/epson-l3250.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F71JQhUJVbJL.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Modelo: Epson EcoTank L3250",
      "Funciones: imprimir, copiar y escanear",
      "Conectividad USB, Wiâ€‘Fi y Wiâ€‘Fi Direct",
      "Sistema EcoTank recargable de alto rendimiento"
    ]
  },
  {
    "id": "prod_n7wz60o0l",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Iman tipo herradura 100x12x5mm",
    "desc": "ã€Calidad Premiumã€‘ Iman tipo herradura 100x12x5mm. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 553.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_tk6it44v0",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "Impresora 2 connect termico usb 2c pos 80",
    "desc": "ã€Calidad Premiumã€‘ Impresora 2 connect termico usb 2c pos 80. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,900.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_p0wqnr5bc",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "Impresora Brother T720 copia adf/scaner",
    "desc": "ã€Calidad Premiumã€‘ Impresora Brother T720 copia adf/scaner. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 23,017.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_oh55hargc",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "Impresora Canon Pixma 2110 Multifuncional y copiadora",
    "desc": "ã€Calidad Premiumã€‘ Impresora Canon Pixma 2110 Multifuncional y copiadora. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 14,850.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_964ur4qe3",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Jabon De Cuaba Antibacterial",
    "desc": "ã€Calidad Premiumã€‘ Jabon De Cuaba Antibacterial. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_660w2f5s9",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Jabon liquido de fregar",
    "desc": "ã€Calidad Premiumã€‘ Jabon liquido de fregar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0n2ezucck",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Juego Elite microscopio",
    "desc": "ã€Calidad Premiumã€‘ Juego Elite microscopio. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,645.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_spbbxw09m",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Juego Stopwacht cronometro",
    "desc": "ã€Calidad Premiumã€‘ Juego Stopwacht cronometro. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 150.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ljvqvr6k5",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Juego de Bingo",
    "desc": "ã€Calidad Premiumã€‘ Juego de Bingo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wsrub1azp",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Juego de balanza c/cubos",
    "desc": "ã€Calidad Premiumã€‘ Juego de balanza c/cubos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,700.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_62c0mi985",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Kit Completo Motor 800 kg Motormatic",
    "desc": "ã€Calidad Premiumã€‘ Kit Completo Motor 800 kg Motormatic. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 17,550.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_dsu2skor9",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Kit Recarga sharp mx 365",
    "desc": "ã€Calidad Premiumã€‘ Kit Recarga sharp mx 365. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,075.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3pe40yw5r",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "LAMINADOR POINTER",
    "desc": "ã€Calidad Premiumã€‘ LAMINADOR POINTER. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 8,775.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_56w2s4xg5",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lamina Adaptacion de las plantas",
    "desc": "ã€Calidad Premiumã€‘ Lamina Adaptacion de las plantas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 175.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_cabuhpj5f",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lamina Plantas",
    "desc": "ã€Calidad Premiumã€‘ Lamina Plantas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 182.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_r4w6v9y3k",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lamina de fotosintesis 17x22",
    "desc": "ã€Calidad Premiumã€‘ Lamina de fotosintesis 17x22. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 168.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_j7zfzz9mx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lamina flores 17x22",
    "desc": "ã€Calidad Premiumã€‘ Lamina flores 17x22. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 162.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_r2n83myqm",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Laminados para cristales",
    "desc": "ã€Calidad Premiumã€‘ Laminados para cristales. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,000.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_oyqspxnap",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "BIC",
    "title": "Lapicero BIC round stic caja 12/1",
    "desc": "Caja de lapiceros BIC Round Stic para uso escolar, institucional y de oficina. Son bolígrafos de escritura diaria reconocidos por su trazo constante, cuerpo liviano y presentación práctica para compras por volumen.",
    "price": "RD$ 155.25",
    "img": "https://wsrv.nl/?url=media.officedepot.com%2Fimages%2Ff_auto%2Cq_auto%2Ce_sharpen%2Ch_450%2Fproducts%2F112266%2F112266_o58_010821%2F112266&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=media.officedepot.com%2Fimages%2Ff_auto%2Cq_auto%2Ce_sharpen%2Ch_450%2Fproducts%2F112266%2F112266_o58_010821%2F112266&w=720&output=webp&q=72",
      "img/productos/bic-round-stic-box.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F71SctVjjPjL.jpg_BO30%2C255%2C255%2C255_UF900%2C850_SR1910%2C1000%2C0%2CC_QL100_.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Marca: BIC",
      "Presentación: caja de 12 unidades",
      "Modelo de línea: Round Stic",
      "Uso recomendado para oficina, escuela y recepción"
    ]
  },
  {
    "id": "prod_bve20u216",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lapiz HB NO. 2 Pointer 12/1",
    "desc": "ã€Calidad Premiumã€‘ Lapiz HB NO. 2  Pointer 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_mdop22fgw",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Letras ABC Sueltas",
    "desc": "ã€Calidad Premiumã€‘ Letras ABC Sueltas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 285.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hcr6riule",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Letrero para cerco",
    "desc": "ã€Calidad Premiumã€‘ Letrero para cerco. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 101.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_1rf7qqoys",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Libro experimentos para principiante",
    "desc": "ã€Calidad Premiumã€‘ Libro experimentos para principiante. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 837.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_um44r64yv",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lija De Agua #120",
    "desc": "ã€Calidad Premiumã€‘ Lija De Agua #120. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 60.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wcboxk58r",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Lupa",
    "desc": "ã€Calidad Premiumã€‘ Lupa. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 90.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_x507x0hp7",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "HP",
    "title": "MONITOR LCD 19 HP CUADRADO GRADO A USADOS",
    "desc": "Monitor HP LCD usado de formato tradicional, útil para cajas, recepción, digitación y estaciones administrativas donde se prioriza funcionalidad sobre diseño moderno. La condición grado A indica un equipo revisado para uso operativo.",
    "price": "RD$ 1,856.00",
    "img": "img/productos/hp-monitor-19-square.webp",
    "gallery": [
      "img/productos/hp-monitor-19-square.webp",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Pantalla LCD de 19 pulg.",
      "Formato cuadrado / oficina tradicional",
      "Equipo usado grado A",
      "Ideal para sistemas administrativos y digitación"
    ]
  },
  {
    "id": "prod_fvb5vixvg",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "MOUSE ORIGINALES USADO MIXTO USB",
    "desc": "ã€Calidad Premiumã€‘ MOUSE ORIGINALES USADO MIXTO USB. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 112.50",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_vacxxprz0",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Mango de Pintar",
    "desc": "ã€Calidad Premiumã€‘ Mango de Pintar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 465.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_omulmjuur",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Marcador estabilo para pizarra",
    "desc": "ã€Calidad Premiumã€‘ Marcador estabilo para pizarra. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 67.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wmqmv9ymn",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Marcador permanente talbot",
    "desc": "ã€Calidad Premiumã€‘ Marcador permanente talbot. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 37.80",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jsmff34ie",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Materiales ferreteros",
    "desc": "ã€Calidad Premiumã€‘ Materiales ferreteros. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45,000.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jfwxxu99l",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Memoria USB Sandisk 32 GB",
    "desc": "ã€Calidad Premiumã€‘ Memoria USB Sandisk 32 GB. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 675.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3giupevua",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Microfono Alambrico",
    "desc": "ã€Calidad Premiumã€‘ Microfono Alambrico. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,260.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/mobiliario.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ubp9oyvaq",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Microfono profesional inalambrico",
    "desc": "ã€Calidad Premiumã€‘ Microfono profesional inalambrico. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,545.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_dlcn0dvbw",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Microscopio 150x450x900 stem",
    "desc": "ã€Calidad Premiumã€‘ Microscopio 150x450x900 stem. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,847.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_69h9nvus8",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Mini Rolo/ C Porta rolo",
    "desc": "ã€Calidad Premiumã€‘ Mini Rolo/ C Porta rolo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 210.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4ssxgv5ti",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "HP",
    "title": "Monitor LCD 21/22 HP Widescreen usd",
    "desc": "Monitor HP widescreen usado para puestos de oficina, vigilancia, ventas y estaciones multitarea. El formato panorámico mejora el área útil en pantalla frente a monitores antiguos de proporción cuadrada.",
    "price": "RD$ 3,139.50",
    "img": "img/productos/hp-monitor-widescreen.jpg",
    "gallery": [
      "img/productos/hp-monitor-widescreen.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Tamaño comercial: 21.5 a 22 pulg.",
      "Formato widescreen",
      "Equipo usado para entorno corporativo",
      "Adecuado para ofimática y monitoreo"
    ]
  },
  {
    "id": "prod_jsn83vpc6",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Monitor USD De 19",
    "desc": "ã€Calidad Premiumã€‘ Monitor USD De 19. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,242.50",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_w5fl5uh6a",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Mouse Inalambrico",
    "desc": "ã€Calidad Premiumã€‘ Mouse Inalambrico. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,050.00",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_xrhbe3kbc",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Mouse Pad",
    "desc": "ã€Calidad Premiumã€‘ Mouse Pad. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 127.50",
    "img": "img/laptops.jpg",
    "gallery": [
      "img/laptops.jpg",
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_2jgqsnmhb",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "HIKVISION",
    "title": "NVR 16 CH Hikvision NO Poe",
    "desc": "Grabador de video en red Hikvision para hasta 16 canales IP, pensado para proyectos donde el suministro PoE se resuelve con switches externos. Es una pieza central para grabación, visualización y administración de cámaras IP en instalaciones medianas.",
    "price": "RD$ 5,520.00",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000019268%2FK24G%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000019268%2FK24G%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2FS000000001%2FS000000002%2FS000000007%2FS000000008%2FOFR000006%2FM000000677%2Fimages%2FMB-123HHE-P-HIKVISION.png%3Ff%3Dwebp&w=720&output=webp&q=72"
    ],
    "specs": [
      "Grabador NVR para 16 canales IP",
      "Versión sin PoE integrado",
      "Compatibilidad con H.265/H.265+/H.264",
      "Salida de video local para monitoreo y configuración"
    ]
  },
  {
    "id": "prod_ggflojr4r",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "HIKVISION",
    "title": "NVR 32 CH HIKVISION 4K NO POE",
    "desc": "Grabador NVR Hikvision de 32 canales con soporte 4K para proyectos de videovigilancia medianos y grandes. El modelo DS-7732NI-K4 está diseñado para redes IP con cámaras de mayor resolución y gestión centralizada de múltiples puntos de grabación.",
    "price": "RD$ 29,375.00",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000065341%2FiDS-96NXI-M8X%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000065341%2FiDS-96NXI-M8X%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
      "img/productos/hikvision-nvr-k-series.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F61TEYNEUqnL._AC_UF894%2C1000_QL80_.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Modelo: DS-7732NI-K4",
      "Hasta 32 canales de video IP",
      "Grabación y salida 4K",
      "Versión sin PoE integrado, orientada a switches externos"
    ]
  },
  {
    "id": "prod_dgb61tzu9",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "UNV",
    "title": "NVR UNV 8PORT POE",
    "desc": "NVR Uniview con PoE integrado, pensado para instalaciones compactas donde se desea alimentar y grabar cámaras IP desde el mismo equipo. Es una solución práctica para negocios pequeños, residencias y proyectos de entrada profesional.",
    "price": "RD$ 8,250.00",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg",
      "img/productos/unv-nvr-poe.png"
    ],
    "specs": [
      "Grabador NVR para 8 canales IP",
      "8 puertos PoE integrados",
      "Compatibilidad con compresión Ultra 265/H.265/H.264",
      "Salidas de video para monitoreo local"
    ]
  },
  {
    "id": "prod_4kju1p7bm",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Nevera Ejecutiva",
    "desc": "ã€Calidad Premiumã€‘ Nevera Ejecutiva. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 12,375.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3mmcv0sgo",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "PAPELOGRAFO ROLLO VARIOS COLORES",
    "desc": "ã€Calidad Premiumã€‘ PAPELOGRAFO ROLLO VARIOS COLORES. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 128.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_m54v413vd",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "PISTOLA PEGAMENTO HJ 014. 60W",
    "desc": "ã€Calidad Premiumã€‘ PISTOLA PEGAMENTO HJ 014. 60W. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 405.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4fmctb6nd",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "PISTOLA SILICON FINA HJ 007",
    "desc": "ã€Calidad Premiumã€‘ PISTOLA SILICON FINA HJ 007. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_oyigj4so7",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "PLASTICO PARA LAMINAR #5",
    "desc": "ã€Calidad Premiumã€‘ PLASTICO PARA LAMINAR #5. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,350.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fc6um05pc",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel Adesivo blanco 230 michra 30/1",
    "desc": "ã€Calidad Premiumã€‘ Papel Adesivo blanco 230 michra 30/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 283.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3ub9sjdda",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel FOTOGRAFICO 25/1",
    "desc": "ã€Calidad Premiumã€‘ Papel FOTOGRAFICO 25/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 283.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4bzwrmga6",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel Higienico Faldo 12/1",
    "desc": "ã€Calidad Premiumã€‘ Papel Higienico Faldo 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,012.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_niysooqbl",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel Kraft rollo x libra marron",
    "desc": "ã€Calidad Premiumã€‘ Papel Kraft rollo x libra marron. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0ye7xtbtg",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel Toalla Jumbo 6/1",
    "desc": "ã€Calidad Premiumã€‘ Papel Toalla Jumbo 6/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,012.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_b8vtelpjw",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel Toalla faldo 12/1",
    "desc": "ã€Calidad Premiumã€‘ Papel Toalla faldo 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,430.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wd9o2f0gk",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Papel construcion 96/1",
    "desc": "ã€Calidad Premiumã€‘ Papel construcion 96/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 236.25",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wdtm2bvlm",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pegacol",
    "desc": "ã€Calidad Premiumã€‘ Pegacol. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 420.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_pafvgei9p",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pelota Basketball",
    "desc": "ã€Calidad Premiumã€‘ Pelota Basketball. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,350.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_6ybvfg94c",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pelota de Tennis",
    "desc": "ã€Calidad Premiumã€‘ Pelota de Tennis. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 135.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_qm547qt8g",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pelota voleyball",
    "desc": "ã€Calidad Premiumã€‘ Pelota voleyball. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 225.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_omekh9gfz",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pelotas plasticas fundas 100/1",
    "desc": "ã€Calidad Premiumã€‘ Pelotas plasticas fundas 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,417.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_aqu76wluk",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pendaflex PFI-FEX 8 1/2 X 13",
    "desc": "ã€Calidad Premiumã€‘ Pendaflex PFI-FEX 8 1/2 X 13. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,282.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_tdx0fs91j",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Perforadora 15 hojas un hoyo",
    "desc": "ã€Calidad Premiumã€‘ Perforadora 15 hojas un hoyo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 285.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_dplst0sx8",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Perforadora de 2 hoyos 7 cm",
    "desc": "ã€Calidad Premiumã€‘ Perforadora de 2 hoyos 7 cm. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 525.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bgetiqf59",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Colores Nivel Inicial",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Colores Nivel Inicial. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,100.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_aqczvi4c0",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Popular Crema 51",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Popular Crema 51. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,875.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_n7bai88lr",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Tropical Contractor Bambu",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Tropical Contractor Bambu. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,012.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_93stq2iho",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Tropical Contractor Blanco 00",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Tropical Contractor Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,010.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_40moje7n1",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Tropical Contractor Crema 51",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Tropical Contractor Crema 51. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,010.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4oeze720s",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Tropical Contractor Verde Limon 52",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Tropical Contractor Verde Limon 52. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,010.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_s6k2b2ryv",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Aceite Tropical Plateada",
    "desc": "ã€Calidad Premiumã€‘ Pintura Aceite Tropical Plateada. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,025.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jl92gbzbz",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Popular Maiz17/ Canario",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica  Popular Maiz17/ Canario. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_z9tchehec",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Azul Positivo",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica  Tropical Contractor Azul Positivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_q3nyu1krp",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Rojo Positivo",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica  Tropical Contractor Rojo Positivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_2myrj6khg",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Blanco Paz Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Blanco Paz Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 972.40",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_xxweuj8jv",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Canario 70 Tarro Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Canario 70 Tarro Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,402.53",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F81QdbcWlpeL.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_md19tjedi",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Gris Educacion Tropical Contractor",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Gris Educacion Tropical Contractor. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_od0le1w47",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Popular Blanco 00",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Popular Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_n3ztv716j",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical contractor Colonial 66",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Tropical  contractor Colonial 66. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,637.88",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_t1bmccu62",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Azul Claro 05",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Tropical Contractor Azul Claro 05. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_p8lzfw2vt",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Blanco 00",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Tropical Contractor Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9xnj1gt0v",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Maiz 17/Canario 70",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Tropical Contractor Maiz 17/Canario 70. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_pjadtbhcu",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Verde Amanecer",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Tropical Contractor Verde Amanecer. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,228.94",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_s7d6mohv1",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilica Tropical Contractor Verde Positivo",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilica Tropical Contractor Verde Positivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_pmt5gobeh",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilico Gen Tarro Blanco 00",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilico Gen Tarro Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4,305.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_vf9g9ypru",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Acrilico Gen Tarro Canario 70/Maiz 17",
    "desc": "ã€Calidad Premiumã€‘ Pintura Acrilico Gen Tarro Canario 70/Maiz 17. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,765.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_mdd2eayir",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Anticorrosivo AAA Tropical Oxido Gris acer",
    "desc": "ã€Calidad Premiumã€‘ Pintura Anticorrosivo AAA Tropical Oxido Gris acer. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,050.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_zy76m8zd6",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Azul Positivo Especial Para Cancha Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Azul Positivo Especial Para Cancha Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,628.60",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_rmyxcpakp",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Industrial Esmalte Blanco Paz Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Industrial Esmalte Blanco Paz Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,161.60",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_xazd3zzyh",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Rojo Positivo Especial Para Cancha Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Rojo Positivo Especial Para Cancha Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,628.60",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wybmj5f8n",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Satinada Azul Claro 67 Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Satinada Azul Claro 67 Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,871.70",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F61hxya-4pxL._AC_UF894%2C1000_QL80_.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_oaw5ld8vk",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura SemiGloss Blanco Hueso Sarai Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura SemiGloss Blanco Hueso Sarai Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,023.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_nfq7ja7e9",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura SemiGloss Blanco Hueso Sarai Tarro Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura SemiGloss Blanco Hueso Sarai Tarro Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,084.40",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bqs26gjpy",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura SemiGloss Crema 51 Tarro",
    "desc": "ã€Calidad Premiumã€‘ Pintura SemiGloss Crema 51 Tarro. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,491.20",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_tgyesgpad",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura SemiGloss Verde Amanecer 85 Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura SemiGloss Verde Amanecer 85 Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,084.40",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "https://wsrv.nl/?url=i.ebayimg.com%2Fimages%2Fg%2FlWgAAeSw-Z9om-ub%2Fs-l1200.webp&w=720&output=webp&q=72",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_wu9zt66ic",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Tarro Semiglo Gen Crema 51",
    "desc": "ã€Calidad Premiumã€‘ Pintura Tarro Semiglo Gen Crema 51. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,765.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_b1stfwogk",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Tropical Contractor Semiglo Blanco 00",
    "desc": "ã€Calidad Premiumã€‘ Pintura Tropical Contractor Semiglo Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,160.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bn9537a85",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Pintura Verde Especial Para Cancha Eagle Paint",
    "desc": "ã€Calidad Premiumã€‘ Pintura Verde Especial Para Cancha Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,628.60",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_r22feluqh",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pinza jumbo 12/1",
    "desc": "ã€Calidad Premiumã€‘ Pinza jumbo 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,957.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_i8dch05mb",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pizarra de corcho 24x36 marco aluminio",
    "desc": "ã€Calidad Premiumã€‘ Pizarra de corcho 24x36 marco aluminio. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,147.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_1kwnqvdge",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pizarra de corcho 36x48 marco aluminio",
    "desc": "ã€Calidad Premiumã€‘ Pizarra de corcho 36x48 marco aluminio. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,430.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_v76v94fhn",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Postin Adhesivo Surtidas",
    "desc": "ã€Calidad Premiumã€‘ Postin Adhesivo Surtidas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 43.20",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_keb7b4o5x",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Primer Tropical Fresh Cement",
    "desc": "ã€Calidad Premiumã€‘ Primer Tropical Fresh Cement. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 960.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_q8ul4kpio",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "EPSON",
    "title": "Proyector Epson Portatil Full HD con Android tv",
    "desc": "Proyector Epson CO-FH02 con resolución Full HD y compatibilidad con Android TV para entretenimiento, presentaciones y proyección en aulas o salas de reuniones. Su formato portátil facilita montajes rápidos sin depender de un televisor tradicional.",
    "price": "RD$ 53,152.50",
    "img": "img/productos/epson-co-fh02.jpg",
    "gallery": [
      "img/productos/epson-co-fh02.jpg",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FI%2F71utQyFDbRL._AC_SL1500_.jpg&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=m.media-amazon.com%2Fimages%2FS%2Faplus-media-library-service-media%2F9e3941d8-3d04-42c0-886f-8f0c2dc9b59c.__CR0%2C0%2C600%2C450_PT0_SX600_V1___.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Modelo: Epson CO-FH02",
      "Resolución Full HD 1080p",
      "Compatible con Android TV",
      "Diseñado para proyección portátil en hogar u oficina"
    ]
  },
  {
    "id": "prod_j7viwqx46",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Pulpito 1 A 4 Para Fuentes",
    "desc": "ã€Calidad Premiumã€‘ Pulpito  1 A 4 Para Fuentes. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 225.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_2rv556wr1",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "REGISTRO METAL 8X10X10",
    "desc": "ã€Calidad Premiumã€‘ REGISTRO METAL 8X10X10. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 850.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_uivpv4jpm",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "REGISTRO OCTAGONAL",
    "desc": "ã€Calidad Premiumã€‘ REGISTRO OCTAGONAL. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 120.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_qch1yu72k",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "RESMA DE PAPEL 8 1/2 X 11 500 HOJAS",
    "desc": "ã€Calidad Premiumã€‘ RESMA DE PAPEL 8 1/2 X 11 500 HOJAS. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9l3ruezvt",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "ROLLO TERMICO DE PAPEL 3 1/2",
    "desc": "ã€Calidad Premiumã€‘ ROLLO TERMICO DE PAPEL 3 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_2m9na4jqf",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Red Voleyball negra cable de acero",
    "desc": "ã€Calidad Premiumã€‘ Red Voleyball negra cable de acero. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4,335.00",
    "img": "img/productos/conceptos/red-voleibol-generica.jpg",
    "gallery": [
      "img/productos/conceptos/red-voleibol-generica.jpg",
      "img/productos/displayport-cable.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_57nl0tl7s",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Genérico",
    "title": "Registro P/ Camaras",
    "desc": "ã€Calidad Premiumã€‘ Registro P/ Camaras. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 337.50",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg",
      "img/productos/tapo-c210.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_sn48ozk7o",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Regla de madera 36 pizarra",
    "desc": "ã€Calidad Premiumã€‘ Regla de madera 36 pizarra. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 256.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bbdw9woh3",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Regleta 6 enchufes",
    "desc": "ã€Calidad Premiumã€‘ Regleta 6 enchufes. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 442.50",
    "img": "img/productos/conceptos/electrico-generico.jpg",
    "gallery": [
      "img/productos/conceptos/electrico-generico.jpg",
      "img/ups.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4zs3vjzp7",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Regulador Protector de Voltaje",
    "desc": "ã€Calidad Premiumã€‘ Regulador Protector de Voltaje. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 13,500.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_qou4rnok2",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Resaltador Colores varios",
    "desc": "ã€Calidad Premiumã€‘ Resaltador Colores varios. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 27.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_cfdaqyzhq",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Resma Cartulina de Hilo",
    "desc": "ã€Calidad Premiumã€‘ Resma Cartulina de Hilo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,822.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_apm0zzqc5",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Resma de papel 8 1/2 x 14 blanco",
    "desc": "ã€Calidad Premiumã€‘ Resma de papel 8 1/2  x 14 blanco. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 472.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_iq0yf8kja",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Resma de papel bond (Cajas de 10 resma)",
    "desc": "ã€Calidad Premiumã€‘ Resma de papel bond (Cajas de 10 resma). Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 243.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_epv6q7mid",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Resma de papel de colores 500/1",
    "desc": "ã€Calidad Premiumã€‘ Resma de papel de colores 500/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 765.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_alqh8rvsc",
    "department": "redes",
    "category": "Componentes de red",
    "brand": "Genérico",
    "title": "Rj45 Terminales",
    "desc": "ã€Calidad Premiumã€‘ Rj45 Terminales. Construido con materiales de gran pureza para reducir las interferencias de señal y garantizar una infraestructura veloz y robusta. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 7.50",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/productos/hikvision-switch-poe-8-2.png"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ypa1lutg8",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Rodillo de presion sharp mx m365",
    "desc": "ã€Calidad Premiumã€‘ Rodillo de presion sharp mx m365. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,750.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_dnluchszx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Rollo Adhesivo 10 mts forrar libros",
    "desc": "ã€Calidad Premiumã€‘ Rollo Adhesivo 10 mts forrar libros. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 390.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ehgxkm40o",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Rollo de papel Bond Blanco",
    "desc": "ã€Calidad Premiumã€‘ Rollo de papel Bond Blanco. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 286.20",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_mi92wpmph",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Rollos b-20 36 400 ft (papelografo)",
    "desc": "ã€Calidad Premiumã€‘ Rollos b-20 36 400 ft (papelografo). Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,800.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_eebfxjcbf",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Rolo De Pintar Con Mazorca",
    "desc": "ã€Calidad Premiumã€‘ Rolo De Pintar Con Mazorca. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 450.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_n18qsxc52",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Rompe Cabeza",
    "desc": "ã€Calidad Premiumã€‘ Rompe Cabeza. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 285.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_24w6hvt7f",
    "department": "redes",
    "category": "Componentes de red",
    "brand": "TP LINK",
    "title": "Router TP Link 960",
    "desc": "Router inalámbrico TP-Link de escritorio con tres antenas externas, orientado a hogares y oficinas pequeñas que necesitan cobertura básica en 2.4 GHz. El TL-WR940N es una referencia popular para navegación, impresoras en red y equipos de uso diario.",
    "price": "RD$ 1,424.25",
    "img": "img/productos/tp-link-wr940n.jpg",
    "gallery": [
      "img/productos/tp-link-wr940n.jpg",
      "img/redes.jpg"
    ],
    "specs": [
      "Modelo asumido por la línea: TL-WR940N",
      "Red inalámbrica 2.4 GHz de hasta 450 Mbps",
      "Tres antenas externas para mejor cobertura",
      "1 puerto WAN + 4 puertos LAN Fast Ethernet"
    ]
  },
  {
    "id": "prod_9f39e0257d",
    "department": "seguridad",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "SERVICIO INSTALACION DE TUBERIAS EMT, CONEXION DE CABLEADO CONFIGURACION Y ENTRENAMIENTO DE SISTEMA DE CAMARAS",
    "desc": "Servicio profesional de servicio instalacion de tuberias emt, conexion de cableado configuracion y entrenamiento de sistema de camaras gestionado por el equipo técnico de Futunet, con coordinación, ejecución y seguimiento orientados a resolver necesidades reales del cliente.",
    "price": "RD$ 3,500.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Coordinación por el equipo técnico de Futunet",
      "Aplicación según alcance y necesidad del cliente",
      "Seguimiento comercial por WhatsApp o visita"
    ]
  },
  {
    "id": "prod_f754nr1g1",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "SWICHT POE 4 PORT + 2 10/100",
    "desc": "ã€Calidad Premiumã€‘ SWICHT POE 4 PORT + 2 10/100. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_77oec80bi",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Saca Grapas",
    "desc": "ã€Calidad Premiumã€‘ Saca Grapas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 52.50",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_u08vmvcf3",
    "department": "infra",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Servicio General Incluido 30 dias de garantia",
    "desc": "Servicio técnico general para ajustes, instalación ligera o soporte presencial según el trabajo aprobado. Incluye ejecución del alcance acordado y garantía de servicio por 30 días sobre la labor realizada por Futunet.",
    "price": "RD$ 2,700.00",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/camaras.jpg"
    ],
    "specs": [
      "Atención técnica presencial según diagnóstico",
      "Aplicable a labores generales de instalación o ajuste",
      "Garantía de servicio por 30 días",
      "Alcance final sujeto a revisión y validación previa"
    ]
  },
  {
    "id": "prod_pb8eucs66",
    "department": "seguridad",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Servicio Instalacion De Camaras",
    "desc": "Instalación básica de cámaras de seguridad con montaje, conexión y verificación operativa del sistema. Recomendado para proyectos que ya cuentan con los equipos y necesitan mano de obra especializada para la puesta en marcha.",
    "price": "RD$ 1,500.00",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg",
      "img/productos/tapo-c210.jpg"
    ],
    "specs": [
      "Montaje físico de cámaras en puntos definidos",
      "Conexión y pruebas de funcionamiento",
      "Ajuste inicial de ángulos de cobertura",
      "Validación básica del sistema al finalizar la visita"
    ]
  },
  {
    "id": "prod_sz08xa5c5",
    "department": "infra",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Servicio Mano De Obra Pintura",
    "desc": "Servicio de mano de obra para trabajos de pintura en espacios residenciales, comerciales u oficinas. Orientado a remozamiento de paredes y superficies interiores con preparación básica del área y aplicación profesional del acabado.",
    "price": "RD$ 3,900.00",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Aplicación de pintura en paredes y superficies interiores",
      "Preparación básica del área de trabajo",
      "Cobertura sujeta a metraje y condiciones del espacio",
      "Ideal para remozamientos de oficinas y locales"
    ]
  },
  {
    "id": "prod_ofxdkrxzm",
    "department": "infra",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Servicio de Instalacion",
    "desc": "Servicio de instalación general para equipos, accesorios o soluciones complementarias según la necesidad del proyecto. Se adapta a trabajos puntuales donde se requiere soporte técnico de Futunet para montaje y puesta en operación.",
    "price": "RD$ 1,800.00",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/camaras.jpg"
    ],
    "specs": [
      "Instalación presencial por personal técnico",
      "Aplica a equipos o accesorios suministrados por el cliente",
      "Configuración inicial cuando corresponda",
      "Alcance definido según evaluación previa"
    ]
  },
  {
    "id": "prod_rzu1wqoe1",
    "department": "seguridad",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Servicio de reinstalacion de cableados de sistema de camaras",
    "desc": "Servicio orientado a corregir, reorganizar o reinstalar cableado existente de un sistema de videovigilancia. Ayuda a recuperar estabilidad, mejorar terminaciones y dejar la infraestructura lista para un funcionamiento más confiable.",
    "price": "RD$ 2,700.00",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/productos/displayport-cable.jpg"
    ],
    "specs": [
      "Revisión del cableado existente del sistema",
      "Reinstalación o reordenamiento de tramos afectados",
      "Pruebas básicas de continuidad y funcionamiento",
      "Recomendado para sistemas con fallas o cableado deteriorado"
    ]
  },
  {
    "id": "prod_yeozrasot",
    "department": "infra",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Servicios De Instalacion",
    "desc": "Servicio de instalación para proyectos que requieren apoyo técnico de Futunet en montaje, ajustes y puesta en servicio. Puede aplicarse a diferentes tipos de infraestructura según el alcance confirmado durante la cotización.",
    "price": "RD$ 5,130.00",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/camaras.jpg"
    ],
    "specs": [
      "Soporte de instalación para proyectos comerciales o corporativos",
      "Montaje y ajuste de elementos según el alcance aprobado",
      "Coordinación de trabajos en sitio con el cliente",
      "Servicio sujeto a evaluación y cotización previa"
    ]
  },
  {
    "id": "prod_106fbm7mx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Set maraca de 6 happy band",
    "desc": "ã€Calidad Premiumã€‘ Set maraca de 6 happy band. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_oi6ahed1d",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Silbato",
    "desc": "ã€Calidad Premiumã€‘ Silbato. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_w0xr1czq3",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Silicon Liquido 250 ml",
    "desc": "ã€Calidad Premiumã€‘ Silicon Liquido 250 ml. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 189.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_rlch8e9bx",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Silla De Mayita Negrsa",
    "desc": "ã€Calidad Premiumã€‘ Silla De Mayita Negrsa. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,197.50",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3s7mmtjdr",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Sillas de visitas con brazo",
    "desc": "ã€Calidad Premiumã€‘ Sillas de visitas con brazo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4,002.75",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0r5dh65ow",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Sillon Ejecutivo",
    "desc": "ã€Calidad Premiumã€‘ Sillon Ejecutivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,270.20",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_16sjt1g9y",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Sillon ejecutivo negro",
    "desc": "ã€Calidad Premiumã€‘ Sillon ejecutivo negro. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,868.00",
    "img": "img/mobiliario.jpg",
    "gallery": [
      "img/mobiliario.jpg",
      "img/laptops.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_zetp0ct03",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Sistema De Intercom completo",
    "desc": "ã€Calidad Premiumã€‘ Sistema De Intercom completo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1.35",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_y9id01bvc",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Sobre Plastico 10 X 15",
    "desc": "ã€Calidad Premiumã€‘ Sobre Plastico 10 X 15. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 43.20",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4pamj5g19",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Suavizante",
    "desc": "ã€Calidad Premiumã€‘ Suavizante. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 472.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_i07dob6kp",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "HIKVISION",
    "title": "Swicht Poe 8 Port + 2 Hikvision",
    "desc": "Switch PoE Hikvision para cámaras IP, teléfonos o dispositivos compatibles que requieran alimentación por red. Su combinación de ocho puertos PoE y dos uplinks facilita la instalación ordenada de sistemas de videovigilancia y redes perimetrales.",
    "price": "RD$ 3,750.00",
    "img": "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2Fasset%2FM000001164%2Fimages%2Fdarkfighter-X_1.png%3Ff%3Dwebp&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2Fasset%2FM000001164%2Fimages%2Fdarkfighter-X_1.png%3Ff%3Dwebp&w=720&output=webp&q=72",
      "img/productos/hikvision-switch-poe-8-2.png"
    ],
    "specs": [
      "8 puertos PoE para dispositivos compatibles",
      "2 puertos uplink adicionales",
      "Diseñado para instalaciones de CCTV y red",
      "Reduce uso de adaptadores de corriente individuales"
    ]
  },
  {
    "id": "prod_cf3ymk8i3",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "TAPA P/ REGISTRO OCTAGONAL",
    "desc": "ã€Calidad Premiumã€‘ TAPA P/ REGISTRO OCTAGONAL. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9p6f6zzh6",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "DELL",
    "title": "TECLADOS USADOS DELL USB",
    "desc": "Teclado Dell KB216 con conexión USB y formato completo, apto para digitación continua en oficinas, recepción y estaciones administrativas. Es una opción confiable para reemplazo o equipamiento de escritorios corporativos.",
    "price": "RD$ 225.00",
    "img": "https://wsrv.nl/?url=snpi.dell.com%2Fsnp%2Fimages%2Fproducts%2Flarge%2Fen-us~570-ABKY%2F570-ABKY.jpg&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=snpi.dell.com%2Fsnp%2Fimages%2Fproducts%2Flarge%2Fen-us~570-ABKY%2F570-ABKY.jpg&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=snpi.dell.com%2Fsnp%2Fimages%2Fproducts%2Flarge%2Fen-us~580-BDLW%2F580-BDLW.jpg&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=snpi.dell.com%2Fsnp%2Fimages%2Fproducts%2Flarge%2Fen-us~332-1571_v1%2F332-1571_v1.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Modelo: Dell KB216",
      "Conexión USB",
      "Diseño full-size con teclado numérico",
      "Formato cableado para uso continuo de oficina"
    ]
  },
  {
    "id": "prod_ppho60uwv",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "TELEVISOR KTC 43 SMART TV ANDROID",
    "desc": "ã€Calidad Premiumã€‘ TELEVISOR KTC 43 SMART TV ANDROID. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 18,125.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_g7qgkxtxx",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "TUBO EMT DE 1/2",
    "desc": "ã€Calidad Premiumã€‘ TUBO EMT DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 325.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9np542ifb",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "TUBO EMT DE 3/4",
    "desc": "ã€Calidad Premiumã€‘ TUBO EMT DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 360.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_up2hhi8yx",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tabla 1X4 de 16 Pulgadas Bruta",
    "desc": "ã€Calidad Premiumã€‘ Tabla 1X4 de 16 Pulgadas Bruta. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 487.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_y1lodb30x",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tabla acrilica clipboard",
    "desc": "ã€Calidad Premiumã€‘ Tabla acrilica clipboard. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 155.25",
    "img": "img/pintura.jpg",
    "gallery": [
      "img/pintura.jpg",
      "img/productos/conceptos/brocha-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_tubkzzpxi",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Televisor KTC 32 SMART TV",
    "desc": "ã€Calidad Premiumã€‘ Televisor KTC 32 SMART TV. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,200.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_p4yre7qrr",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Termo cafe 1.9 litros",
    "desc": "ã€Calidad Premiumã€‘ Termo cafe 1.9 litros. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,215.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_mvb48hib2",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Thinner Tropical TH-1000",
    "desc": "ã€Calidad Premiumã€‘ Thinner Tropical TH-1000. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 705.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_tdxrolpob",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tijera #8",
    "desc": "ã€Calidad Premiumã€‘ Tijera #8. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 85.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_73hwgt99t",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tijera 17 cm 6 pulgadas",
    "desc": "ã€Calidad Premiumã€‘ Tijera 17 cm 6 pulgadas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 78.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_lg95td0ov",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Timbre Campana",
    "desc": "ã€Calidad Premiumã€‘ Timbre Campana. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 255.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3bma5wlf5",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tinta Canon G190 Colores Varios",
    "desc": "ã€Calidad Premiumã€‘ Tinta Canon G190  Colores Varios. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 405.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_6syre0tmd",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "EPSON",
    "title": "Tinta Impresora 1litro EPSON",
    "desc": "Presentación de tinta de alto volumen destinada a sistemas de impresión Epson o compatibles, según color y aplicación. Es una solución orientada a usuarios con alto consumo que desean reducir la frecuencia de recarga frente a botellas pequeñas.",
    "price": "RD$ 2,565.00",
    "img": "img/productos/epson-tinta-1l.jpg",
    "gallery": [
      "img/productos/epson-tinta-1l.jpg",
      "img/papeleria.jpg"
    ],
    "specs": [
      "Presentación: 1 litro",
      "Uso orientado a sistemas de tinta Epson o compatibles",
      "Formato para recarga de alto volumen",
      "Verificar color y compatibilidad antes de cotizar"
    ]
  },
  {
    "id": "prod_4o6g79ztp",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tinta para sello",
    "desc": "ã€Calidad Premiumã€‘ Tinta para sello. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 202.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_elc2mu2jc",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tiza Mariposa 144/1",
    "desc": "ã€Calidad Premiumã€‘ Tiza Mariposa 144/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 187.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_2v644exsk",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Toalla multifibra",
    "desc": "ã€Calidad Premiumã€‘ Toalla multifibra. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_zyrnr5dpn",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Tuberia Flexible VX",
    "desc": "ã€Calidad Premiumã€‘ Tuberia Flexible VX. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_iyd1fr1g0",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "UNION COUPLING EMT DE 1/2",
    "desc": "ã€Calidad Premiumã€‘ UNION COUPLING EMT DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 37.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_95tpqs7sz",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "UNION COUPLING EMT DE 3/4",
    "desc": "ã€Calidad Premiumã€‘ UNION COUPLING EMT DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bh5vuj6df",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "HIKVISION",
    "title": "UPS HIKVISION 1000VA",
    "desc": "UPS Hikvision de 600 VA para proteger equipos de red, cajas, cámaras, routers y estaciones ligeras frente a apagones y picos de tensión. Es una solución compacta para oficinas pequeñas, puestos individuales o respaldo puntual de seguridad electrónica.",
    "price": "RD$ 3,350.00",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000162286%2F2.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000162286%2F2.png&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fen%2Fmarketing%2Fimage%2Fproducts%2Ftransmission-and-display-products%2Fcables%2FNetwork-cables-1.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Capacidad nominal: 600 VA",
      "Batería interna de 12 V / 7 Ah",
      "Tiempo de transferencia â‰¤ 10 ms",
      "Protección contra sobrecarga, sobrecarga de batería y picos"
    ]
  },
  {
    "id": "prod_bh5vuj6df",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "HIKVISION",
    "title": "UPS HIKVISION 600 VA",
    "desc": "UPS Hikvision de 600 VA para proteger equipos de red, cajas, cámaras, routers y estaciones ligeras frente a apagones y picos de tensión. Es una solución compacta para oficinas pequeñas, puestos individuales o respaldo puntual de seguridad electrónica.",
    "price": "RD$ 2,220.00",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000162286%2F2.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000162286%2F2.png&w=720&output=webp&q=72",
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fen%2Fmarketing%2Fimage%2Fproducts%2Ftransmission-and-display-products%2Fcables%2FNetwork-cables-1.jpg&w=720&output=webp&q=72"
    ],
    "specs": [
      "Capacidad nominal: 600 VA",
      "Batería interna de 12 V / 7 Ah",
      "Tiempo de transferencia â‰¤ 10 ms",
      "Protección contra sobrecarga, sobrecarga de batería y picos"
    ]
  },
  {
    "id": "prod_etnks90ht",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "VELA SILICON FINA #12 FINA",
    "desc": "ã€Calidad Premiumã€‘ VELA SILICON FINA #12 FINA. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 40.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4conwdbfb",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "VELA SILICON GRUESA",
    "desc": "ã€Calidad Premiumã€‘ VELA SILICON GRUESA. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 33.75",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_t154b8elk",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Vejigas Buffone 144/1",
    "desc": "ã€Calidad Premiumã€‘ Vejigas Buffone 144/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 378.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_0seb4g8lv",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Vejigas Globos #5",
    "desc": "ã€Calidad Premiumã€‘ Vejigas Globos #5. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 337.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_6k2wjm6lo",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Vejigas Tripita #10",
    "desc": "ã€Calidad Premiumã€‘ Vejigas Tripita #10. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 607.50",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_irpyxjvid",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Video Balum AHD",
    "desc": "ã€Calidad Premiumã€‘ Video Balum AHD. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 150.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4f7stivlu",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "Genérico",
    "title": "Zafacon con tapa vaiven",
    "desc": "ã€Calidad Premiumã€‘ Zafacon con tapa vaiven. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 505.00",
    "img": "img/papeleria.jpg",
    "gallery": [
      "img/papeleria.jpg",
      "img/productos/bic-round-stic-box.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_yny47xadr",
    "department": "oficina",
    "category": "Papelería y Suministros",
    "brand": "APPLE",
    "title": "Apple AirPods (2.Âª generación) con estuche de carga",
    "desc": "Auriculares inalámbricos Apple AirPods de segunda generación con estuche de carga Lightning. Integran el chip H1 para emparejamiento rápido con dispositivos Apple, control por voz con â€œOye Siriâ€ y un perfil de uso cómodo para llamadas, música y videollamadas.",
    "price": "RD$ 5,400.00",
    "img": "https://wsrv.nl/?url=www.apple.com%2Fv%2Fairpods-pro%2Fr%2Fimages%2Foverview%2Fproduct-viewer%2Fcloser_look_initial__cksqga5hm77m_large.jpg&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=www.apple.com%2Fv%2Fairpods-pro%2Fr%2Fimages%2Foverview%2Fproduct-viewer%2Fcloser_look_initial__cksqga5hm77m_large.jpg&w=720&output=webp&q=72",
      "img/productos/apple-airpods-2.png",
      "https://wsrv.nl/?url=i.ebayimg.com%2Fimages%2Fg%2FXa4AAeSw7PFp0xVL%2Fs-l1200.png&w=720&output=webp&q=72"
    ],
    "specs": [
      "Chip Apple H1 para conexión rápida y estable",
      "Hasta 5 horas de audio por carga",
      "Más de 24 horas de autonomía total con el estuche",
      "Estuche con carga por conector Lightning"
    ]
  },
  {
    "id": "prod_fxlphqtk3",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "HIKVISION",
    "title": "Terminal biométrica Hikvision DS-K1T201EF-C",
    "desc": "Terminal biométrica Hikvision para control de acceso y asistencia, adecuada para oficinas, negocios y entradas controladas. El modelo DS-K1T201EF-C ofrece autenticación local, integración con puertas y almacenamiento de eventos para operación diaria.",
    "price": "RD$ 7,700.00",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fspecicon%2FIK08.png%3Ff%3Dwebp&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fspecicon%2FIK08.png%3Ff%3Dwebp&w=720&output=webp&q=72",
      "img/productos/hikvision-k1t201ef-c.jpg"
    ],
    "specs": [
      "Modelo: DS-K1T201EF-C",
      "Pantalla LCD de 2.8 pulg.",
      "Capacidad para huellas, tarjetas y registro de eventos",
      "Interfaces de red, RS-485 y Wiegand para integración"
    ]
  },
  {
    "id": "prod_ajvh0runp",
    "department": "seguridad",
    "category": "Servicios",
    "brand": "Servicios",
    "title": "Instalación integral de sistema de cámaras con tubería EMT",
    "desc": "Servicio de instalación profesional de sistema de cámaras con canalización en tubería EMT, tendido de cableado, configuración inicial y explicación básica de uso. Pensado para proyectos que requieren una terminación más ordenada y duradera.",
    "price": "RD$ 3,500.00",
    "img": "img/productos/conceptos/tubo-emt-generico.jpg",
    "gallery": [
      "img/productos/conceptos/tubo-emt-generico.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Instalación de tubería EMT y accesorios de fijación",
      "Tendido y conexión de cableado para cámaras",
      "Configuración inicial del sistema",
      "Orientación básica al cliente sobre operación y monitoreo"
    ]
  },
  {
    "id": "prod_u9fo22vhb",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "HIKVISION",
    "title": "UPS Hikvision DS-UPS1000, 1000 VA / 600 W",
    "desc": "UPS Hikvision de 1000 VA orientado a respaldo eléctrico para DVR, NVR, routers, estaciones de trabajo y periféricos de oficina. Su capacidad de 600 W lo hace adecuado para cargas moderadas que requieren continuidad ante cortes o fluctuaciones.",
    "price": "RD$ 3,350.00",
    "img": "img/productos/hikvision-ups1000.jpg",
    "gallery": [
      "img/productos/hikvision-ups1000.jpg",
      "img/productos/conceptos/electrico-generico.jpg"
    ],
    "specs": [
      "Capacidad: 1000 VA / 600 W",
      "Batería interna de 12 V / 9 Ah",
      "Tiempo de transferencia â‰¤ 10 ms",
      "Protección contra sobrecarga, descarga y sobrevoltaje"
    ]
  }
,  {
    id: 'mob_oficina_1',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 1',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-1.jpeg',
    gallery: ['img/productos/mobiliario/mob-1.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_2',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 2',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-2.jpeg',
    gallery: ['img/productos/mobiliario/mob-2.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_3',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 3',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-3.jpeg',
    gallery: ['img/productos/mobiliario/mob-3.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_4',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 4',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-4.jpeg',
    gallery: ['img/productos/mobiliario/mob-4.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_5',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 5',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-5.jpeg',
    gallery: ['img/productos/mobiliario/mob-5.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_6',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 6',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-6.jpeg',
    gallery: ['img/productos/mobiliario/mob-6.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_7',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 7',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-7.jpeg',
    gallery: ['img/productos/mobiliario/mob-7.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_8',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 8',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-8.jpeg',
    gallery: ['img/productos/mobiliario/mob-8.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_9',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 9',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-9.jpeg',
    gallery: ['img/productos/mobiliario/mob-9.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_10',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 10',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-10.jpeg',
    gallery: ['img/productos/mobiliario/mob-10.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_11',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 11',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-11.jpeg',
    gallery: ['img/productos/mobiliario/mob-11.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_12',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 12',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-12.jpeg',
    gallery: ['img/productos/mobiliario/mob-12.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
  {
    id: 'mob_oficina_13',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Escritorio Nuevo Modelo 13',
    desc: 'Mobiliario de alta calidad para optimizar tu espacio de trabajo.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-13.jpeg',
    gallery: ['img/productos/mobiliario/mob-13.jpeg'],
    specs: ['Diseño ergonómico', 'Materiales de alta durabilidad', 'Instalación disponible']
  },
];

if (typeof module !== 'undefined') module.exports = mockDatabase;

