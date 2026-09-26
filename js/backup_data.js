const mockDatabase = [
  {
    "id": "prod_67gy3rahd",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
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
    "desc": "Calidad Premium. 1/4 Masilla De Pared. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 438.00",
    "img": "img/productos/catalogo/masilla-pared.jpg",
    "gallery": [
      "img/productos/catalogo/masilla-pared.jpg"
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
    "desc": "Calidad Premium. ABRAZADERAS DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 35.00",
    "img": "img/productos/catalogo/abrazadera-emt.jpg",
    "gallery": [
      "img/productos/catalogo/abrazadera-emt.jpg"
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
    "desc": "Calidad Premium. ABRAZADERAS DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 40.00",
    "img": "img/productos/catalogo/abrazadera-emt.jpg",
    "gallery": [
      "img/productos/catalogo/abrazadera-emt.jpg"
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
    "desc": "Calidad Premium. Abanico pared. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Apple",
    "title": "Air Pod 2da Generacion Original APPLE",
    "desc": "Auriculares inalámbricos Apple AirPods (2.ª generación) originales con estuche de carga Lightning. Conexión Bluetooth instantánea con chip Apple H1, audio de alta fidelidad, controles táctiles y micrófonos duales beamforming para llamadas nítidas.",
    "price": "RD$ 5,400.00",
    "img": "img/productos/catalogo/airpods-2gen.jpg",
    "gallery": [
      "img/productos/catalogo/airpods-2gen.jpg"
    ],
    "specs": [
      "Chip Apple H1 para enlace inalámbrico ultraestable y baja latencia",
      "Estuche de carga Lightning con más de 24 horas de autonomía total",
      "Acceso por voz «Oye Siri» y controles táctiles de doble toque",
      "Micrófonos duales beamforming con cancelación de ruido ambiental",
      "Compatibilidad universal con iOS, Android, Windows y macOS"
    ]
  },
  {
    "id": "prod_v0u1qvzs2",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Aislador de esquina",
    "desc": "Calidad Premium. Aislador de esquina. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,552.50",
    "img": "img/productos/catalogo/abrazadera-emt.jpg",
    "gallery": [
      "img/productos/catalogo/abrazadera-emt.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_j1ixov27m",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Aislador de paso plano",
    "desc": "Calidad Premium. Aislador de paso plano. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,282.50",
    "img": "img/productos/catalogo/abrazadera-emt.jpg",
    "gallery": [
      "img/productos/catalogo/abrazadera-emt.jpg"
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
    "desc": "Calidad Premium. Ajedrez. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 450.00",
    "img": "img/productos/catalogo/ajedrez.jpg",
    "gallery": [
      "img/productos/catalogo/ajedrez.jpg"
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
    "desc": "Calidad Premium. Alambre cerco S-fire. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,497.50",
    "img": "img/productos/catalogo/abrazadera-emt.jpg",
    "gallery": [
      "img/productos/catalogo/abrazadera-emt.jpg"
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
    "desc": "Calidad Premium. Archivo acordeon Plastico. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 405.00",
    "img": "img/productos/catalogo/carpeta-anillos.jpg",
    "gallery": [
      "img/productos/catalogo/carpeta-anillos.jpg"
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
    "title": "Archivo de Metal 8 1/2 X 13, 4 gavetas",
    "desc": "Calidad Premium. Archivo de Metal 8 1/2 X 13, 4 gavetas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,935.00",
    "img": "img/productos/catalogo/armario-metal.jpg",
    "gallery": [
      "img/productos/catalogo/armario-metal.jpg"
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
    "desc": "Calidad Premium. Armario Metal 2 Puertas 18X36X32 pulgadas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 14,175.00",
    "img": "img/productos/catalogo/armario-metal.jpg",
    "gallery": [
      "img/productos/catalogo/armario-metal.jpg"
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
    "desc": "Calidad Premium. Armario metal 72''. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 19,064.00",
    "img": "img/productos/catalogo/armario-metal.jpg",
    "gallery": [
      "img/productos/catalogo/armario-metal.jpg"
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
    "desc": "Calidad Premium. Aro Ula Ula Grande. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 127.50",
    "img": "img/productos/catalogo/aro-hula.jpg",
    "gallery": [
      "img/productos/catalogo/aro-hula.jpg"
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
    "desc": "Calidad Premium. Aspiradora/Sopladora Inalambrica con cargador y bateria. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. BASE PARA TV CON BRAZO DE 14 A 55. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 600.00",
    "img": "img/productos/catalogo/base-tv.jpg",
    "gallery": [
      "img/productos/catalogo/base-tv.jpg"
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
    "desc": "Calidad Premium. Bandeja de Pintar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/bandeja-pintar.jpg",
    "gallery": [
      "img/productos/catalogo/bandeja-pintar.jpg"
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
    "desc": "Calidad Premium. Bandera 4X6 Oficial. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 945.00",
    "img": "img/productos/catalogo/bandera.jpg",
    "gallery": [
      "img/productos/catalogo/bandera.jpg"
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
    "desc": "Calidad Premium. Barniz Marino Tropical. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Base de Pared Para TV. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 975.00",
    "img": "img/productos/catalogo/base-tv.jpg",
    "gallery": [
      "img/productos/catalogo/base-tv.jpg"
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
    "desc": "Calidad Premium. Bateria 12V 4 AH. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Bloques Educativos grande. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/productos/catalogo/bloques-educativos.jpg",
    "gallery": [
      "img/productos/catalogo/bloques-educativos.jpg"
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
    "desc": "Calidad Premium. Bocina Portatil bluetooth, usb. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,625.00",
    "img": "img/productos/catalogo/bocina.jpg",
    "gallery": [
      "img/productos/catalogo/bocina.jpg"
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
    "desc": "Calidad Premium. Bocina SMT Led mic/control. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,670.00",
    "img": "img/productos/catalogo/bocina.jpg",
    "gallery": [
      "img/productos/catalogo/bocina.jpg"
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
    "desc": "Calidad Premium. Borrante para pizzaras lotos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 81.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "desc": "Calidad Premium. Brocha Prismo Edge 2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Brocha Prismo Edge 3. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Brocha Prismo Edge 4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. CABLE HDMI 25 FT. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. CABLES AC Y VGA PARA COMPUTADORAS. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. CAMARA AHD BULLET 2 MP HYBRID. Equipado con un diseño avanzado y complementado con resolución nítida de 2 megapíxeles, dándote la mejor relación de valor y tecnología. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "CAMARAS IP BULLET 2 MP HYBRID",
    "desc": "Calidad Premium. CAMARAS IP BULLET 2 MP HYBRID. Equipado con un diseño avanzado y complementado con resolución nítida de 2 megapíxeles, dándote la mejor relación de valor y tecnología. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,220.00",
    "img": "img/productos/catalogo/camara-ip.jpg",
    "gallery": [
      "img/productos/catalogo/camara-ip.jpg"
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
    "desc": "Calidad Premium. CANALETAS PLASTICAS. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 225.00",
    "img": "img/productos/catalogo/canaleta.jpg",
    "gallery": [
      "img/productos/catalogo/canaleta.jpg"
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
    "desc": "Calidad Premium. CARTULINAS COLORES 25/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 33.75",
    "img": "img/productos/catalogo/cartulina.jpg",
    "gallery": [
      "img/productos/catalogo/cartulina.jpg"
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
    "desc": "Calidad Premium. CINTA DOBLE CARA TRANSPARENTE. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 310.50",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. CLAVOS DE PARED P/ FULMINANTE. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4.00",
    "img": "img/productos/catalogo/clavos-fulminante.webp",
    "gallery": [
      "img/productos/catalogo/clavos-fulminante.webp"
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
    "brand": "Dell",
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
    "brand": "Dell",
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
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "CONECTOR EMT DE 1/2",
    "desc": "Calidad Premium. CONECTOR EMT DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 37.00",
    "img": "img/productos/catalogo/conector-emt.webp",
    "gallery": [
      "img/productos/catalogo/conector-emt.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_yv5qir42u",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "CONECTOR EMT DE 3/4",
    "desc": "Calidad Premium. CONECTOR EMT DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/catalogo/conector-emt.webp",
    "gallery": [
      "img/productos/catalogo/conector-emt.webp"
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
    "desc": "Calidad Premium. Cable Display Port male/male usd. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Cable HDMI 10 FT. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Cable UTP CAT 5E CCA. Construido con materiales de gran pureza para reducir las interferencias de señal y garantizar una infraestructura veloz y robusta. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Cable UTP Cat 6 cca. Construido con materiales de gran pureza para reducir las interferencias de señal y garantizar una infraestructura veloz y robusta. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Cable bujia p/cerco 25 mt. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Cable de poder para pc. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Caja Organizador peq 11 lt. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 495.00",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "brand": "Sharp",
    "title": "Calcul. de mesa sharp 2630PII GRANDE",
    "desc": "Calidad Premium. Calcul. de mesa sharp 2630PII GRANDE. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,500.00",
    "img": "img/productos/catalogo/calculadora.jpg",
    "gallery": [
      "img/productos/catalogo/calculadora.jpg"
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
    "img": "img/productos/unv-2mp-bullet.webp",
    "gallery": [
      "img/productos/unv-2mp-bullet.webp",
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
    "img": "img/productos/unv-2mp-bullet.webp",
    "gallery": [
      "img/productos/unv-2mp-bullet.webp",
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
      "Video 2K 3 MP (2304 × 1296)",
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
    "desc": "Calidad Premium. Canaletas Blancas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 202.50",
    "img": "img/productos/catalogo/canaleta.jpg",
    "gallery": [
      "img/productos/catalogo/canaleta.jpg"
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
    "desc": "Calidad Premium. Carpeta de 1.5 pulgadas de 3 anillos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 240.00",
    "img": "img/productos/catalogo/carpeta-anillos.jpg",
    "gallery": [
      "img/productos/catalogo/carpeta-anillos.jpg"
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
    "desc": "Calidad Premium. Carpeta de 4 pulgadas y 3 anillos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 607.50",
    "img": "img/productos/catalogo/carpeta-anillos.jpg",
    "gallery": [
      "img/productos/catalogo/carpeta-anillos.jpg"
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
    "desc": "Calidad Premium. Cartulina Blanca. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 13.50",
    "img": "img/productos/catalogo/cartulina.jpg",
    "gallery": [
      "img/productos/catalogo/cartulina.jpg"
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
    "desc": "Calidad Premium. Cartulina Metalica dorada. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 87.75",
    "img": "img/productos/catalogo/cartulina.jpg",
    "gallery": [
      "img/productos/catalogo/cartulina.jpg"
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
    "desc": "Calidad Premium. Cemento Blanco Funda 5 lb. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 97.50",
    "img": "img/productos/catalogo/cemento-blanco.jpg",
    "gallery": [
      "img/productos/catalogo/cemento-blanco.jpg"
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
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Cerradura magnetica completa",
    "desc": "Calidad Premium. Cerradura magnetica completa. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 11,512.50",
    "img": "img/productos/catalogo/cerradura-magnetica.jpg",
    "gallery": [
      "img/productos/catalogo/cerradura-magnetica.jpg"
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
    "desc": "Calidad Premium. Cincheta. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 90.00",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
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
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. Cinta Merleto Invisible 18X33 MM. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 60.75",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. Cinta Satin tricolor ancha 2 pulgadas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 661.50",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. Cinta color bandera 3/4 ft x 2 --- 50 yardas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 452.25",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. Cinta empaque ancha 2x100 worker. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. Cinta tricolor 1/2 x 50 fina. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 378.00",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ywokd9kjb",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Clear Protector B. Aceite",
    "desc": "Calidad Premium. Clear Protector B. Aceite. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,507.20",
    "img": "img/productos/catalogo/pintura-aceite.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-aceite.jpg"
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
    "desc": "Calidad Premium. Clic Caja 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 27.00",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
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
    "desc": "Calidad Premium. Clic Niquelados 5MM 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 60.75",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ys6kcahet",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Cono de Senalizacion",
    "desc": "Calidad Premium. Cono de Senalizacion. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "brand": "Hikvision",
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
    "brand": "Talbot",
    "title": "Corrector talbot 11 ml",
    "desc": "Calidad Premium. Corrector talbot 11 ml. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 47.25",
    "img": "img/productos/catalogo/corrector.jpg",
    "gallery": [
      "img/productos/catalogo/corrector.jpg"
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
    "desc": "Calidad Premium. Cuaderno Cocido Ofi-Nota 200 paguinas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 42.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Cuaderno Cuadriculado 144 pag. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 78.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Cuardo Cuadriculado 144 paguinas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 74.25",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_bkl2rdbja",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "Cuchilla Limpieza sharp mx m365",
    "desc": "Calidad Premium. Cuchilla Limpieza sharp mx m365. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "DC Hembra a Presion",
    "desc": "Calidad Premium. DC Hembra a Presion. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "DC Macho a Presion",
    "desc": "Calidad Premium. DC Macho a Presion. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. DISCO DURO 2 TB WD PURPURA. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. DISCO DURO 4TB WD PULPURA P/VIDEO VIGILANCIA. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. DISCO DURO 8 TB WD PULPURA P/VIDEO VIGILANCIA. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. DISCO DURO DE 500 GB HDD P/VIDEO VIGILANCIA. Equipado con un diseño avanzado y complementado con un disco de 500GB de almacenamiento masivo, dándote la mejor relación de valor y tecnología. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. DISCO SSD SATA PATROIT 128 GB 2.5 NUEVO. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. DISCO SSD SATA PATROIT 256 GB 2.5 NUEVO. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "brand": "Hikvision",
    "title": "DVR 16 CH Hikvision",
    "desc": "Calidad Premium. DVR 16 CH Hikvision. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,175.00",
    "img": "img/productos/catalogo/dvr-hikvision.jpg",
    "gallery": [
      "img/productos/catalogo/dvr-hikvision.jpg"
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
    "brand": "Hikvision",
    "title": "DVR 8CH HIKVISION 1080 P",
    "desc": "Grabador DVR Hikvision de 8 canales para sistemas Turbo HD y cámaras analógicas compatibles. Es una base sólida para instalaciones de seguridad pequeñas y medianas con grabación centralizada y salida de video para monitoreo local.",
    "price": "RD$ 3,047.50",
    "img": "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000061727%2FiDS-8116HQHI-M8S%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=assets.hikvision.com%2Fprd%2Fnormal%2Fall%2Fimage%2Fm000061727%2FiDS-8116HQHI-M8S%E6%B8%B2%E6%9F%93%E5%9B%BE.png&w=720&output=webp&q=72",
      "img/productos/hikvision-dvr-8ch.webp"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Desinfectante Macier",
    "desc": "Calidad Premium. Desinfectante Macier. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/jabon-cuaba.jpg",
    "gallery": [
      "img/productos/catalogo/jabon-cuaba.jpg"
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
    "desc": "Calidad Premium. Disco Duro 1 TB SEAGATE. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Eagle Paint",
    "title": "Disolvente Industrial Eagle Paint",
    "desc": "Calidad Premium. Disolvente Industrial Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,072.50",
    "img": "img/productos/catalogo/pintura-aceite.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-aceite.jpg"
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
    "desc": "Calidad Premium. ESTANTE PARA LIBROS DE 4 NIVELES. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 148,500.00",
    "img": "img/productos/catalogo/armario-metal.jpg",
    "gallery": [
      "img/productos/catalogo/armario-metal.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_37431uj9f",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Electrificador AGL",
    "desc": "Calidad Premium. Electrificador AGL. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Encuadernadora de espiral continuo 20h. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,500.00",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
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
    "desc": "Calidad Premium. Escritorio Corporativo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 13,500.00",
    "img": "img/productos/catalogo/escritorio.jpg",
    "gallery": [
      "img/productos/catalogo/escritorio.jpg"
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
    "desc": "Calidad Premium. Escritorio Importado. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 14,242.50",
    "img": "img/productos/catalogo/escritorio.jpg",
    "gallery": [
      "img/productos/catalogo/escritorio.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Esponja Bonbril",
    "desc": "Calidad Premium. Esponja Bonbril. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 141.75",
    "img": "img/productos/catalogo/jabon-cuaba.jpg",
    "gallery": [
      "img/productos/catalogo/jabon-cuaba.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Estopa",
    "desc": "Calidad Premium. Estopa. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/productos/catalogo/papel-toalla.jpg",
    "gallery": [
      "img/productos/catalogo/papel-toalla.jpg"
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
    "desc": "Calidad Premium. Etiquetas para folder label. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "img": "img/productos/catalogo/camara-ip.jpg",
    "gallery": [
      "img/productos/catalogo/camara-ip.jpg"
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
    "desc": "Calidad Premium. FOAMY BRIILO PAQ 10/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. FOLDER C/BOLSILLOS 25/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,485.00",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "desc": "Calidad Premium. FULMINANTE P/ PISTOLA CLAVO. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3.00",
    "img": "img/productos/catalogo/fulminante.webp",
    "gallery": [
      "img/productos/catalogo/fulminante.webp"
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
    "desc": "Calidad Premium. Foamy Liso 9x12 sin brillo 10/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 118.50",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Foamy de letras y numeros (Alfombras). Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 510.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "desc": "Calidad Premium. Folder Manila 8 1/2 X 14. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 607.50",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "desc": "Calidad Premium. Folder amarillo 8 1/2 x 11 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 391.50",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_d2i5bt9x4",
    "department": "redes",
    "category": "Redes",
    "brand": "Genérico",
    "title": "Fuente 12 V 5A DNV",
    "desc": "Calidad Premium. Fuente 12 V 5A DNV. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Funda Mediana 17x22 1/100",
    "desc": "Calidad Premium. Funda Mediana 17x22 1/100. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 162.00",
    "img": "img/productos/catalogo/limpieza.jpg",
    "gallery": [
      "img/productos/catalogo/limpieza.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Funda para basura 55 gl 100/1 36x54",
    "desc": "Calidad Premium. Funda para basura 55 gl 100/1 36x54. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 796.50",
    "img": "img/productos/catalogo/limpieza.jpg",
    "gallery": [
      "img/productos/catalogo/limpieza.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Fundas 55 gal 100/1",
    "desc": "Calidad Premium. Fundas 55 gal 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 803.96",
    "img": "img/productos/catalogo/limpieza.jpg",
    "gallery": [
      "img/productos/catalogo/limpieza.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Fundas Para Basura 28X35 100/1 30",
    "desc": "Calidad Premium. Fundas Para Basura 28X35 100/1 30. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 526.50",
    "img": "img/productos/catalogo/limpieza.jpg",
    "gallery": [
      "img/productos/catalogo/limpieza.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_fy2c5keb5",
    "department": "redes",
    "category": "Redes",
    "brand": "Genérico",
    "title": "GABINETE DE 9U 600X600MM",
    "desc": "Calidad Premium. GABINETE DE 9U 600X600MM. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,950.00",
    "img": "img/productos/catalogo/gabinete-9u.jpg",
    "gallery": [
      "img/productos/catalogo/gabinete-9u.jpg"
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
    "desc": "Calidad Premium. GOMITAS ELASTICAS #18. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 67.50",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_e9yrvwgwu",
    "department": "redes",
    "category": "Redes",
    "brand": "Genérico",
    "title": "Gabinete 4U 600X450",
    "desc": "Calidad Premium. Gabinete 4U 600X450. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,277.50",
    "img": "img/productos/catalogo/gabinete-9u.jpg",
    "gallery": [
      "img/productos/catalogo/gabinete-9u.jpg"
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
    "category": "Servicios",
    "brand": "Genérico",
    "title": "Garantia de 30 dias en inperfecto de fabrica",
    "desc": "Calidad Premium. Garantia de 30 dias en inperfecto de fabrica. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Globo terraqueo 32 cm b/metal. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,375.00",
    "img": "img/productos/catalogo/globo-terraqueo.jpg",
    "gallery": [
      "img/productos/catalogo/globo-terraqueo.jpg"
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
    "desc": "Calidad Premium. Grapadora. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 307.50",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
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
    "desc": "Calidad Premium. Grapas Standar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
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
    "desc": "Calidad Premium. Greca de 12. Tazas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,012.50",
    "img": "img/productos/catalogo/greca.jpg",
    "gallery": [
      "img/productos/catalogo/greca.jpg"
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
    "desc": "Calidad Premium. Guillotina 12 Tradicional. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,100.00",
    "img": "img/productos/catalogo/guillotina.jpg",
    "gallery": [
      "img/productos/catalogo/guillotina.jpg"
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
    "desc": "Calidad Premium. Hojas protectora 8.5 x 11. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 240.00",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "brand": "Epson",
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Iman tipo herradura 100x12x5mm",
    "desc": "Calidad Premium. Iman tipo herradura 100x12x5mm. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 553.50",
    "img": "img/productos/catalogo/papeleria-oficina.jpg",
    "gallery": [
      "img/productos/catalogo/papeleria-oficina.jpg"
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
    "desc": "Calidad Premium. Impresora 2 connect termico usb 2c pos 80. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,900.00",
    "img": "img/impresoras.jpg",
    "gallery": [
      "img/impresoras.jpg"
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
    "brand": "Brother",
    "title": "Impresora Brother T720 copia adf/scaner",
    "desc": "Calidad Premium. Impresora Brother T720 copia adf/scaner. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 23,017.50",
    "img": "img/productos/catalogo/brother-t720dw.jpg",
    "gallery": [
      "img/productos/catalogo/brother-t720dw.jpg"
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
    "brand": "Canon",
    "title": "Impresora Canon Pixma 2110 Multifuncional y copiadora",
    "desc": "Calidad Premium. Impresora Canon Pixma 2110 Multifuncional y copiadora. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 14,850.00",
    "img": "img/productos/catalogo/canon-pixma-g2110.jpg",
    "gallery": [
      "img/productos/catalogo/canon-pixma-g2110.jpg"
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
    "desc": "Calidad Premium. Jabon De Cuaba Antibacterial. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/jabon-cuaba.jpg",
    "gallery": [
      "img/productos/catalogo/jabon-cuaba.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Jabon liquido de fregar",
    "desc": "Calidad Premium. Jabon liquido de fregar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/limpieza.jpg",
    "gallery": [
      "img/productos/catalogo/limpieza.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Juego Elite microscopio",
    "desc": "Calidad Premium. Juego Elite microscopio. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,645.00",
    "img": "img/productos/catalogo/microscopio.jpg",
    "gallery": [
      "img/productos/catalogo/microscopio.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Juego Stopwacht cronometro",
    "desc": "Calidad Premium. Juego Stopwacht cronometro. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 150.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "desc": "Calidad Premium. Juego de Bingo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/bingo.jpg",
    "gallery": [
      "img/productos/catalogo/bingo.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Juego de balanza c/cubos",
    "desc": "Calidad Premium. Juego de balanza c/cubos. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,700.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_62c0mi985",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Kit Completo Motor 800 kg Motormatic",
    "desc": "Calidad Premium. Kit Completo Motor 800 kg Motormatic. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "Kit Recarga sharp mx 365",
    "desc": "Calidad Premium. Kit Recarga sharp mx 365. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "LAMINADOR POINTER",
    "desc": "Calidad Premium. LAMINADOR POINTER. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 8,775.00",
    "img": "img/productos/catalogo/laminador.webp",
    "gallery": [
      "img/productos/catalogo/laminador.webp"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Lamina Adaptacion de las plantas",
    "desc": "Calidad Premium. Lamina Adaptacion de las plantas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 175.50",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Lamina Plantas",
    "desc": "Calidad Premium. Lamina Plantas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 182.25",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Lamina de fotosintesis 17x22",
    "desc": "Calidad Premium. Lamina de fotosintesis 17x22. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 168.75",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Lamina flores 17x22",
    "desc": "Calidad Premium. Lamina flores 17x22. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 162.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_r2n83myqm",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Laminados para cristales",
    "desc": "Calidad Premium. Laminados para cristales. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,000.00",
    "img": "img/productos/catalogo/laminados-cristales.webp",
    "gallery": [
      "img/productos/catalogo/laminados-cristales.webp"
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
    "img": "img/productos/catalogo/lapiz-hb.jpg",
    "gallery": [
      "img/productos/catalogo/lapiz-hb.jpg"
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
    "brand": "Pointer",
    "title": "Lapiz HB NO. 2 Pointer 12/1",
    "desc": "Calidad Premium. Lapiz HB NO. 2 Pointer 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/catalogo/lapiz-hb.jpg",
    "gallery": [
      "img/productos/catalogo/lapiz-hb.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Letras ABC Sueltas",
    "desc": "Calidad Premium. Letras ABC Sueltas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 285.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_hcr6riule",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Letrero para cerco",
    "desc": "Calidad Premium. Letrero para cerco. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Libro experimentos para principiante",
    "desc": "Calidad Premium. Libro experimentos para principiante. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 837.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_um44r64yv",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Lija De Agua #120",
    "desc": "Calidad Premium. Lija De Agua #120. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Lupa",
    "desc": "Calidad Premium. Lupa. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 90.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "desc": "Calidad Premium. MOUSE ORIGINALES USADO MIXTO USB. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Mango de Pintar",
    "desc": "Calidad Premium. Mango de Pintar. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 465.00",
    "img": "img/productos/catalogo/bandeja-pintar.jpg",
    "gallery": [
      "img/productos/catalogo/bandeja-pintar.jpg"
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
    "brand": "Estabilo",
    "title": "Marcador estabilo para pizarra",
    "desc": "Calidad Premium. Marcador estabilo para pizarra. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 67.50",
    "img": "img/productos/catalogo/marcador-pizarra.jpg",
    "gallery": [
      "img/productos/catalogo/marcador-pizarra.jpg"
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
    "brand": "Talbot",
    "title": "Marcador permanente talbot",
    "desc": "Calidad Premium. Marcador permanente talbot. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 37.80",
    "img": "img/productos/catalogo/marcador-permanente.jpg",
    "gallery": [
      "img/productos/catalogo/marcador-permanente.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_jsmff34ie",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Materiales ferreteros",
    "desc": "Calidad Premium. Materiales ferreteros. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45,000.00",
    "img": "img/productos/catalogo/materiales-ferreteros.webp",
    "gallery": [
      "img/productos/catalogo/materiales-ferreteros.webp"
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
    "brand": "SanDisk",
    "title": "Memoria USB Sandisk 32 GB",
    "desc": "Calidad Premium. Memoria USB Sandisk 32 GB. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 675.00",
    "img": "img/productos/catalogo/sandisk-32gb.jpg",
    "gallery": [
      "img/productos/catalogo/sandisk-32gb.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3giupevua",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Microfono Alambrico",
    "desc": "Calidad Premium. Microfono Alambrico. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,260.00",
    "img": "img/productos/catalogo/microfono.jpg",
    "gallery": [
      "img/productos/catalogo/microfono.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ubp9oyvaq",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Microfono profesional inalambrico",
    "desc": "Calidad Premium. Microfono profesional inalambrico. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,545.00",
    "img": "img/productos/catalogo/microfono.jpg",
    "gallery": [
      "img/productos/catalogo/microfono.jpg"
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
    "brand": "Stem",
    "title": "Microscopio 150x450x900 stem",
    "desc": "Calidad Premium. Microscopio 150x450x900 stem. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 3,847.50",
    "img": "img/productos/catalogo/microscopio.jpg",
    "gallery": [
      "img/productos/catalogo/microscopio.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_69h9nvus8",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Mini Rolo/ C Porta rolo",
    "desc": "Calidad Premium. Mini Rolo/ C Porta rolo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 210.00",
    "img": "img/productos/catalogo/bandeja-pintar.jpg",
    "gallery": [
      "img/productos/catalogo/bandeja-pintar.jpg"
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
    "desc": "Calidad Premium. Monitor USD De 19. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Mouse Inalambrico. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Mouse Pad. Construcción de primera categoría. Eleva el nivel en tu oficina con una herramienta pensada para durar en entornos exigentes. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Hikvision",
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
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Hikvision",
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
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "UNV",
    "title": "NVR UNV 8PORT POE",
    "desc": "NVR Uniview con PoE integrado, pensado para instalaciones compactas donde se desea alimentar y grabar cámaras IP desde el mismo equipo. Es una solución práctica para negocios pequeños, residencias y proyectos de entrada profesional.",
    "price": "RD$ 8,250.00",
    "img": "img/productos/catalogo/dvr-hikvision.jpg",
    "gallery": [
      "img/productos/catalogo/dvr-hikvision.jpg"
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
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Nevera Ejecutiva",
    "desc": "Calidad Premium. Nevera Ejecutiva. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 12,375.00",
    "img": "img/productos/catalogo/nevera-mini.jpg",
    "gallery": [
      "img/productos/catalogo/nevera-mini.jpg"
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
    "desc": "Calidad Premium. PAPELOGRAFO ROLLO VARIOS COLORES. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 128.25",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_m54v413vd",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "PISTOLA PEGAMENTO HJ 014. 60W",
    "desc": "Calidad Premium. PISTOLA PEGAMENTO HJ 014. 60W. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 405.00",
    "img": "img/productos/catalogo/pistola-pegamento.webp",
    "gallery": [
      "img/productos/catalogo/pistola-pegamento.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4fmctb6nd",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "PISTOLA SILICON FINA HJ 007",
    "desc": "Calidad Premium. PISTOLA SILICON FINA HJ 007. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/pistola-pegamento.webp",
    "gallery": [
      "img/productos/catalogo/pistola-pegamento.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_oyigj4so7",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "PLASTICO PARA LAMINAR #5",
    "desc": "Calidad Premium. PLASTICO PARA LAMINAR #5. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Papel Adesivo blanco 230 michra 30/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 283.50",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Papel FOTOGRAFICO 25/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 283.50",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "brand": "Faldo",
    "title": "Papel Higienico Faldo 12/1",
    "desc": "Calidad Premium. Papel Higienico Faldo 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,012.50",
    "img": "img/productos/catalogo/papel-higienico.jpg",
    "gallery": [
      "img/productos/catalogo/papel-higienico.jpg"
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
    "desc": "Calidad Premium. Papel Kraft rollo x libra marron. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Papel Toalla Jumbo 6/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,012.50",
    "img": "img/productos/catalogo/papel-toalla.jpg",
    "gallery": [
      "img/productos/catalogo/papel-toalla.jpg"
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
    "desc": "Calidad Premium. Papel Toalla faldo 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,430.00",
    "img": "img/productos/catalogo/papel-toalla.jpg",
    "gallery": [
      "img/productos/catalogo/papel-toalla.jpg"
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
    "desc": "Calidad Premium. Papel construcion 96/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 236.25",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Pegacol. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 420.00",
    "img": "img/productos/catalogo/corrector.jpg",
    "gallery": [
      "img/productos/catalogo/corrector.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Pelota Basketball",
    "desc": "Calidad Premium. Pelota Basketball. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,350.00",
    "img": "img/productos/catalogo/pelota-basket-real.jpg",
    "gallery": [
      "img/productos/catalogo/pelota-basket-real.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Pelota de Tennis",
    "desc": "Calidad Premium. Pelota de Tennis. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 135.00",
    "img": "img/productos/catalogo/pelota-tenis.jpg",
    "gallery": [
      "img/productos/catalogo/pelota-tenis.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Pelota voleyball",
    "desc": "Calidad Premium. Pelota voleyball. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 225.00",
    "img": "img/productos/catalogo/pelota-voley.jpg",
    "gallery": [
      "img/productos/catalogo/pelota-voley.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Pelotas plasticas fundas 100/1",
    "desc": "Calidad Premium. Pelotas plasticas fundas 100/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,417.50",
    "img": "img/productos/catalogo/pelota-basket-real.jpg",
    "gallery": [
      "img/productos/catalogo/pelota-basket-real.jpg"
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
    "desc": "Calidad Premium. Pendaflex PFI-FEX 8 1/2 X 13. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,282.50",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "desc": "Calidad Premium. Perforadora 15 hojas un hoyo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 285.00",
    "img": "img/productos/catalogo/perforadora.jpg",
    "gallery": [
      "img/productos/catalogo/perforadora.jpg"
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
    "desc": "Calidad Premium. Perforadora de 2 hoyos 7 cm. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 525.00",
    "img": "img/productos/catalogo/perforadora.jpg",
    "gallery": [
      "img/productos/catalogo/perforadora.jpg"
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
    "brand": "Popular",
    "title": "Pintura Aceite Colores Nivel Inicial",
    "desc": "Calidad Premium. Pintura Aceite Colores Nivel Inicial. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,100.00",
    "img": "img/productos/catalogo/pintura-aceite.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-aceite.jpg"
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
    "brand": "Popular",
    "title": "Pintura Aceite Popular Crema 51",
    "desc": "Calidad Premium. Pintura Aceite Popular Crema 51. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,875.00",
    "img": "img/productos/catalogo/pintura-aceite.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-aceite.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Aceite Tropical Contractor Bambu",
    "desc": "Calidad Premium. Pintura Aceite Tropical Contractor Bambu. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,012.00",
    "img": "img/productos/catalogo/pintura-tropical.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-tropical.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Aceite Tropical Contractor Blanco 00",
    "desc": "Calidad Premium. Pintura Aceite Tropical Contractor Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,010.00",
    "img": "img/productos/catalogo/pintura-tropical.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-tropical.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Aceite Tropical Contractor Crema 51",
    "desc": "Calidad Premium. Pintura Aceite Tropical Contractor Crema 51. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,010.00",
    "img": "img/productos/catalogo/pintura-tropical.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-tropical.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Aceite Tropical Contractor Verde Limon 52",
    "desc": "Calidad Premium. Pintura Aceite Tropical Contractor Verde Limon 52. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,010.00",
    "img": "img/productos/catalogo/pintura-tropical.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-tropical.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Aceite Tropical Plateada",
    "desc": "Calidad Premium. Pintura Aceite Tropical Plateada. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,025.00",
    "img": "img/productos/catalogo/pintura-tropical.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-tropical.jpg"
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
    "brand": "Popular",
    "title": "Pintura Acrilica Popular Maiz17/ Canario",
    "desc": "Calidad Premium. Pintura Acrilica Popular Maiz17/ Canario. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Azul Positivo",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Azul Positivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Rojo Positivo",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Rojo Positivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Acrilica Blanco Paz Eagle Paint",
    "desc": "Calidad Premium. Pintura Acrilica Blanco Paz Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 972.40",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Acrilica Canario 70 Tarro Eagle Paint",
    "desc": "Calidad Premium. Pintura Acrilica Canario 70 Tarro Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,402.53",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Gris Educacion Tropical Contractor",
    "desc": "Calidad Premium. Pintura Acrilica Gris Educacion Tropical Contractor. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Popular",
    "title": "Pintura Acrilica Popular Blanco 00",
    "desc": "Calidad Premium. Pintura Acrilica Popular Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,275.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical contractor Colonial 66",
    "desc": "Calidad Premium. Pintura Acrilica Tropical contractor Colonial 66. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,637.88",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Azul Claro 05",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Azul Claro 05. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Blanco 00",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Maiz 17/Canario 70",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Maiz 17/Canario 70. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,230.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Verde Amanecer",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Verde Amanecer. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,228.94",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Acrilica Tropical Contractor Verde Positivo",
    "desc": "Calidad Premium. Pintura Acrilica Tropical Contractor Verde Positivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "desc": "Calidad Premium. Pintura Acrilico Gen Tarro Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 4,305.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "desc": "Calidad Premium. Pintura Acrilico Gen Tarro Canario 70/Maiz 17. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,765.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Anticorrosivo AAA Tropical Oxido Gris acer",
    "desc": "Calidad Premium. Pintura Anticorrosivo AAA Tropical Oxido Gris acer. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,050.00",
    "img": "img/productos/catalogo/pintura-aceite.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-aceite.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Azul Positivo Especial Para Cancha Eagle Paint",
    "desc": "Calidad Premium. Pintura Azul Positivo Especial Para Cancha Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,628.60",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Industrial Esmalte Blanco Paz Eagle Paint",
    "desc": "Calidad Premium. Pintura Industrial Esmalte Blanco Paz Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,161.60",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Rojo Positivo Especial Para Cancha Eagle Paint",
    "desc": "Calidad Premium. Pintura Rojo Positivo Especial Para Cancha Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,628.60",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Satinada Azul Claro 67 Eagle Paint",
    "desc": "Calidad Premium. Pintura Satinada Azul Claro 67 Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,871.70",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura SemiGloss Blanco Hueso Sarai Eagle Paint",
    "desc": "Calidad Premium. Pintura SemiGloss Blanco Hueso Sarai Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,023.00",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura SemiGloss Blanco Hueso Sarai Tarro Eagle Paint",
    "desc": "Calidad Premium. Pintura SemiGloss Blanco Hueso Sarai Tarro Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,084.40",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "desc": "Calidad Premium. Pintura SemiGloss Crema 51 Tarro. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,491.20",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura SemiGloss Verde Amanecer 85 Eagle Paint",
    "desc": "Calidad Premium. Pintura SemiGloss Verde Amanecer 85 Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 10,084.40",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "desc": "Calidad Premium. Pintura Tarro Semiglo Gen Crema 51. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,765.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Tropical",
    "title": "Pintura Tropical Contractor Semiglo Blanco 00",
    "desc": "Calidad Premium. Pintura Tropical Contractor Semiglo Blanco 00. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 2,160.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
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
    "brand": "Eagle Paint",
    "title": "Pintura Verde Especial Para Cancha Eagle Paint",
    "desc": "Calidad Premium. Pintura Verde Especial Para Cancha Eagle Paint. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,628.60",
    "img": "img/productos/catalogo/pintura-eagle.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-eagle.jpg"
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
    "desc": "Calidad Premium. Pinza jumbo 12/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,957.50",
    "img": "img/productos/catalogo/grapadora.jpg",
    "gallery": [
      "img/productos/catalogo/grapadora.jpg"
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
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Pizarra de corcho 24x36 marco aluminio",
    "desc": "Calidad Premium. Pizarra de corcho 24x36 marco aluminio. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Pizarra de corcho 36x48 marco aluminio",
    "desc": "Calidad Premium. Pizarra de corcho 36x48 marco aluminio. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Postin Adhesivo Surtidas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 43.20",
    "img": "img/productos/catalogo/post-it.jpg",
    "gallery": [
      "img/productos/catalogo/post-it.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_keb7b4o5x",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Tropical",
    "title": "Primer Tropical Fresh Cement",
    "desc": "Calidad Premium. Primer Tropical Fresh Cement. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 960.00",
    "img": "img/productos/catalogo/pintura-acrilica.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-acrilica.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_q8ul4kpio",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Epson",
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
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Pulpito 1 A 4 Para Fuentes",
    "desc": "Calidad Premium. Pulpito 1 A 4 Para Fuentes. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "REGISTRO METAL 8X10X10",
    "desc": "Calidad Premium. REGISTRO METAL 8X10X10. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 850.00",
    "img": "img/productos/catalogo/registro-metal-8x10.webp",
    "gallery": [
      "img/productos/catalogo/registro-metal-8x10.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_uivpv4jpm",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "REGISTRO OCTAGONAL",
    "desc": "Calidad Premium. REGISTRO OCTAGONAL. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 120.00",
    "img": "img/productos/catalogo/registro-octagonal.webp",
    "gallery": [
      "img/productos/catalogo/registro-octagonal.webp"
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
    "desc": "Calidad Premium. RESMA DE PAPEL 8 1/2 X 11 500 HOJAS. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 270.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_9l3ruezvt",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "ROLLO TERMICO DE PAPEL 3 1/2",
    "desc": "Calidad Premium. ROLLO TERMICO DE PAPEL 3 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Red Voleyball negra cable de acero",
    "desc": "Calidad Premium. Red Voleyball negra cable de acero. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Registro P/ Camaras",
    "desc": "Calidad Premium. Registro P/ Camaras. Diseñado para ofrecer máxima seguridad con tecnología de vanguardia. Ideal para instalaciones profesionales, garantizando monitoreo prolongado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 337.50",
    "img": "img/productos/catalogo/registro-camaras.webp",
    "gallery": [
      "img/productos/catalogo/registro-camaras.webp"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Regla de madera 36 pizarra",
    "desc": "Calidad Premium. Regla de madera 36 pizarra. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 256.50",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "desc": "Calidad Premium. Regleta 6 enchufes. Eficiencia probada para cuidar tus dispositivos sensibles y mantener cada área vital trabajando de manera correcta las 24 horas. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 442.50",
    "img": "img/productos/catalogo/regleta.jpg",
    "gallery": [
      "img/productos/catalogo/regleta.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4zs3vjzp7",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Genérico",
    "title": "Regulador Protector de Voltaje",
    "desc": "Calidad Premium. Regulador Protector de Voltaje. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 13,500.00",
    "img": "img/productos/catalogo/regleta.jpg",
    "gallery": [
      "img/productos/catalogo/regleta.jpg"
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
    "desc": "Calidad Premium. Resaltador Colores varios. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 27.00",
    "img": "img/productos/catalogo/resaltador.jpg",
    "gallery": [
      "img/productos/catalogo/resaltador.jpg"
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
    "desc": "Calidad Premium. Resma Cartulina de Hilo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,822.50",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Resma de papel 8 1/2 x 14 blanco. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 472.50",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Resma de papel bond (Cajas de 10 resma). Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 243.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Resma de papel de colores 500/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 765.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Rj45 Terminales. Construido con materiales de gran pureza para reducir las interferencias de señal y garantizar una infraestructura veloz y robusta. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 7.50",
    "img": "img/redes.jpg",
    "gallery": [
      "img/redes.jpg",
      "img/productos/hikvision-switch-poe-8-2.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_ypa1lutg8",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Genérico",
    "title": "Rodillo de presion sharp mx m365",
    "desc": "Calidad Premium. Rodillo de presion sharp mx m365. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Rollo Adhesivo 10 mts forrar libros. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 390.00",
    "img": "img/productos/catalogo/cinta-scotch.jpg",
    "gallery": [
      "img/productos/catalogo/cinta-scotch.jpg"
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
    "desc": "Calidad Premium. Rollo de papel Bond Blanco. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 286.20",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
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
    "desc": "Calidad Premium. Rollos b-20 36 400 ft (papelografo). Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,800.00",
    "img": "img/productos/catalogo/resma-papel.jpg",
    "gallery": [
      "img/productos/catalogo/resma-papel.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_eebfxjcbf",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Rolo De Pintar Con Mazorca",
    "desc": "Calidad Premium. Rolo De Pintar Con Mazorca. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 450.00",
    "img": "img/productos/catalogo/bandeja-pintar.jpg",
    "gallery": [
      "img/productos/catalogo/bandeja-pintar.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Rompe Cabeza",
    "desc": "Calidad Premium. Rompe Cabeza. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 285.00",
    "img": "img/productos/catalogo/rompecabezas.jpg",
    "gallery": [
      "img/productos/catalogo/rompecabezas.jpg"
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
    "brand": "TP-Link",
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
    "department": "redes",
    "category": "Redes",
    "brand": "Genérico",
    "title": "Switch PoE 4 Port + 2 10/100",
    "desc": "Calidad Premium. Switch PoE 4 Port + 2 10/100. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 1,380.00",
    "img": "img/productos/hikvision-switch-poe-8-2.webp",
    "gallery": [
      "img/productos/hikvision-switch-poe-8-2.webp"
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
    "desc": "Calidad Premium. Saca Grapas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 52.50",
    "img": "img/productos/catalogo/sacagrapas.jpg",
    "gallery": [
      "img/productos/catalogo/sacagrapas.jpg"
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
    "img": "img/productos/catalogo/camara-ip.jpg",
    "gallery": [
      "img/productos/catalogo/camara-ip.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Set maraca de 6 happy band",
    "desc": "Calidad Premium. Set maraca de 6 happy band. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 108.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Silbato",
    "desc": "Calidad Premium. Silbato. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Silicon Liquido 250 ml. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 189.00",
    "img": "img/productos/catalogo/silicon-liquido.webp",
    "gallery": [
      "img/productos/catalogo/silicon-liquido.webp"
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
    "brand": "Futunet Mobiliario",
    "title": "Silla de Oficina Ergonómica de Malla Negra",
    "desc": "Silla ejecutiva de malla ergonómica en color negro, con diseño transpirable, soporte lumbar y ajuste de altura por pistón de gas. Ideal para oficinas, recepciones y puestos operativos. Respaldo y garantía oficial Futunet.",
    "price": "RD$ 5,197.50",
    "img": "img/productos/catalogo/sillon-ejecutivo.jpg",
    "gallery": [
      "img/productos/catalogo/sillon-ejecutivo.jpg"
    ],
    "specs": [
      "Malla transpirable en espaldar con estructura de alta durabilidad",
      "Asiento acolchado de espuma de alta densidad con tapizado antitranspirante",
      "Mecanismo de elevación a gas regulable",
      "Base giratoria de 5 ruedas para movilidad fluida",
      "Garantía corporativa de 1 año y entrega en Santiago"
    ]
  },
  {
    "id": "prod_3s7mmtjdr",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Sillas de Visitas con Brazos para Oficina",
    "desc": "Silla fija para visitantes y salas de espera con estructura metálica tubular reforzada, asiento y espaldar acolchados con descansabrazos integrados.",
    "price": "RD$ 4,002.75",
    "img": "img/productos/catalogo/silla-visita.jpg",
    "gallery": [
      "img/productos/catalogo/silla-visita.jpg"
    ],
    "specs": [
      "Estructura metálica tubular de alta resistencia",
      "Asiento y respaldo acolchados en tela de uso rudo",
      "Brazos ergonómicos integrados",
      "Topes antideslizantes para protección del suelo",
      "Garantía directa Futunet"
    ]
  },
  {
    "id": "prod_0r5dh65ow",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Sillon Ejecutivo",
    "desc": "Calidad Premium. Sillon Ejecutivo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 5,270.20",
    "img": "img/productos/catalogo/sillon-ejecutivo.jpg",
    "gallery": [
      "img/productos/catalogo/sillon-ejecutivo.jpg"
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
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Sillon ejecutivo negro",
    "desc": "Calidad Premium. Sillon ejecutivo negro. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 6,868.00",
    "img": "img/productos/catalogo/sillon-ejecutivo.jpg",
    "gallery": [
      "img/productos/catalogo/sillon-ejecutivo.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_zetp0ct03",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Sistema De Intercom completo",
    "desc": "Calidad Premium. Sistema De Intercom completo. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "desc": "Calidad Premium. Sobre Plastico 10 X 15. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 43.20",
    "img": "img/productos/catalogo/folder-manila.jpg",
    "gallery": [
      "img/productos/catalogo/folder-manila.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Suavizante",
    "desc": "Calidad Premium. Suavizante. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 472.50",
    "img": "img/productos/catalogo/jabon-cuaba.jpg",
    "gallery": [
      "img/productos/catalogo/jabon-cuaba.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_i07dob6kp",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Hikvision",
    "title": "Switch PoE 8 Port + 2 Hikvision",
    "desc": "Switch PoE Hikvision para cámaras IP, teléfonos o dispositivos compatibles que requieran alimentación por red. Su combinación de ocho puertos PoE y dos uplinks facilita la instalación ordenada de sistemas de videovigilancia y redes perimetrales.",
    "price": "RD$ 3,750.00",
    "img": "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2Fasset%2FM000001164%2Fimages%2Fdarkfighter-X_1.png%3Ff%3Dwebp&w=720&output=webp&q=72",
    "gallery": [
      "https://wsrv.nl/?url=www.hikvision.com%2Fcontent%2Fdam%2Fhikvision%2Fproducts%2Fasset%2FM000001164%2Fimages%2Fdarkfighter-X_1.png%3Ff%3Dwebp&w=720&output=webp&q=72",
      "img/productos/hikvision-switch-poe-8-2.webp"
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
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "TAPA P/ REGISTRO OCTAGONAL",
    "desc": "Calidad Premium. TAPA P/ REGISTRO OCTAGONAL. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/productos/catalogo/tapa-registro.webp",
    "gallery": [
      "img/productos/catalogo/tapa-registro.webp"
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
    "brand": "Dell",
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
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "KTC",
    "title": "TELEVISOR KTC 43 SMART TV ANDROID",
    "desc": "Calidad Premium. TELEVISOR KTC 43 SMART TV ANDROID. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 18,125.00",
    "img": "img/productos/catalogo/tv-smart.jpg",
    "gallery": [
      "img/productos/catalogo/tv-smart.jpg"
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
    "desc": "Calidad Premium. TUBO EMT DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 325.00",
    "img": "img/productos/catalogo/tubo-emt.jpg",
    "gallery": [
      "img/productos/catalogo/tubo-emt.jpg"
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
    "desc": "Calidad Premium. TUBO EMT DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 360.00",
    "img": "img/productos/catalogo/tubo-emt.jpg",
    "gallery": [
      "img/productos/catalogo/tubo-emt.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_up2hhi8yx",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Tabla 1X4 de 16 Pulgadas Bruta",
    "desc": "Calidad Premium. Tabla 1X4 de 16 Pulgadas Bruta. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 487.50",
    "img": "img/productos/catalogo/tabla-bruta.webp",
    "gallery": [
      "img/productos/catalogo/tabla-bruta.webp"
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
    "desc": "Calidad Premium. Tabla acrilica clipboard. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 155.25",
    "img": "img/productos/catalogo/tabla-acrilica.webp",
    "gallery": [
      "img/productos/catalogo/tabla-acrilica.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_tubkzzpxi",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "KTC",
    "title": "Televisor KTC 32 SMART TV",
    "desc": "Calidad Premium. Televisor KTC 32 SMART TV. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 9,200.00",
    "img": "img/productos/catalogo/tv-smart.jpg",
    "gallery": [
      "img/productos/catalogo/tv-smart.jpg"
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
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Termo cafe 1.9 litros",
    "desc": "Calidad Premium. Termo cafe 1.9 litros. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Tropical",
    "title": "Thinner Tropical TH-1000",
    "desc": "Calidad Premium. Thinner Tropical TH-1000. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 705.00",
    "img": "img/productos/catalogo/pintura-aceite.jpg",
    "gallery": [
      "img/productos/catalogo/pintura-aceite.jpg"
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
    "desc": "Calidad Premium. Tijera #8. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 85.50",
    "img": "img/productos/catalogo/tijera.jpg",
    "gallery": [
      "img/productos/catalogo/tijera.jpg"
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
    "desc": "Calidad Premium. Tijera 17 cm 6 pulgadas. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 78.00",
    "img": "img/productos/catalogo/tijera.jpg",
    "gallery": [
      "img/productos/catalogo/tijera.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_lg95td0ov",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Timbre Campana",
    "desc": "Calidad Premium. Timbre Campana. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 255.00",
    "img": "img/productos/catalogo/materiales-ferreteros.webp",
    "gallery": [
      "img/productos/catalogo/materiales-ferreteros.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_3bma5wlf5",
    "department": "equipos",
    "category": "Impresoras y Consumibles",
    "brand": "Canon",
    "title": "Tinta Canon G190 Colores Varios",
    "desc": "Calidad Premium. Tinta Canon G190 Colores Varios. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "brand": "Epson",
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
    "desc": "Calidad Premium. Tinta para sello. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 202.50",
    "img": "img/productos/catalogo/corrector.jpg",
    "gallery": [
      "img/productos/catalogo/corrector.jpg"
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
    "category": "Educación y Didáctica",
    "brand": "Genérico",
    "title": "Tiza Mariposa 144/1",
    "desc": "Calidad Premium. Tiza Mariposa 144/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 187.50",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Limpieza",
    "brand": "Genérico",
    "title": "Toalla multifibra",
    "desc": "Calidad Premium. Toalla multifibra. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/productos/catalogo/papel-toalla.jpg",
    "gallery": [
      "img/productos/catalogo/papel-toalla.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_zyrnr5dpn",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "Tuberia Flexible VX",
    "desc": "Calidad Premium. Tuberia Flexible VX. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 75.00",
    "img": "img/productos/catalogo/tuberia-flexible.webp",
    "gallery": [
      "img/productos/catalogo/tuberia-flexible.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_iyd1fr1g0",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "UNION COUPLING EMT DE 1/2",
    "desc": "Calidad Premium. UNION COUPLING EMT DE 1/2. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 37.00",
    "img": "img/productos/catalogo/union-coupling.webp",
    "gallery": [
      "img/productos/catalogo/union-coupling.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_95tpqs7sz",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "UNION COUPLING EMT DE 3/4",
    "desc": "Calidad Premium. UNION COUPLING EMT DE 3/4. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 45.00",
    "img": "img/productos/catalogo/union-coupling.webp",
    "gallery": [
      "img/productos/catalogo/union-coupling.webp"
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
    "brand": "Hikvision",
    "title": "UPS HIKVISION 600 VA",
    "desc": "UPS Hikvision de 600 VA para proteger equipos de red, cajas, cámaras, routers y estaciones ligeras frente a apagones y picos de tensión. Es una solución compacta para oficinas pequeñas, puestos individuales o respaldo puntual de seguridad electrónica.",
    "price": "RD$ 2,220.00",
    "img": "img/productos/hikvision-ups600.jpg",
    "gallery": [
      "img/productos/hikvision-ups600.jpg"
    ],
    "specs": [
      "Capacidad nominal: 600 VA / 360 W",
      "Batería interna sellada de 12 V / 7 Ah",
      "Tiempo de transferencia ≤ 10 ms",
      "Protección contra sobrecarga, descarga profunda y picos de voltaje"
    ]
  },
  {
    "id": "prod_etnks90ht",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "VELA SILICON FINA #12 FINA",
    "desc": "Calidad Premium. VELA SILICON FINA #12 FINA. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 40.50",
    "img": "img/productos/catalogo/velas-silicon.webp",
    "gallery": [
      "img/productos/catalogo/velas-silicon.webp"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_4conwdbfb",
    "department": "infra",
    "category": "Remozamiento Profesional",
    "brand": "Genérico",
    "title": "VELA SILICON GRUESA",
    "desc": "Calidad Premium. VELA SILICON GRUESA. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 33.75",
    "img": "img/productos/catalogo/velas-silicon.webp",
    "gallery": [
      "img/productos/catalogo/velas-silicon.webp"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Vejigas Buffone 144/1",
    "desc": "Calidad Premium. Vejigas Buffone 144/1. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 378.00",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Vejigas Globos #5",
    "desc": "Calidad Premium. Vejigas Globos #5. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 337.50",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
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
    "category": "Deportes y Recreación",
    "brand": "Genérico",
    "title": "Vejigas Tripita #10",
    "desc": "Calidad Premium. Vejigas Tripita #10. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 607.50",
    "img": "img/productos/catalogo/educacion.jpg",
    "gallery": [
      "img/productos/catalogo/educacion.jpg"
    ],
    "specs": [
      "Garantía premium directa: Genérico",
      "Soporte técnico preferencial Futunet",
      "Calidad y manufactura comprobada"
    ]
  },
  {
    "id": "prod_irpyxjvid",
    "department": "seguridad",
    "category": "Control de Accesos",
    "brand": "Genérico",
    "title": "Video Balum AHD",
    "desc": "Calidad Premium. Video Balum AHD. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
    "price": "RD$ 150.00",
    "img": "img/camaras.jpg",
    "gallery": [
      "img/camaras.jpg"
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
    "category": "Mobiliario",
    "brand": "Genérico",
    "title": "Zafacon con tapa vaiven",
    "desc": "Calidad Premium. Zafacon con tapa vaiven. Un artículo de excelentes materiales fabricado para durar y cubrir a plenitud los estándares estéticos y funcionales de uso pesado. Cuenta con la garantía directa y respaldo oficial en República Dominicana de Futunet.",
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
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Apple",
    "title": "Apple AirPods (2.ª generación) con estuche de carga",
    "desc": "Auriculares y audífonos inalámbricos Apple AirPods de segunda generación con estuche de carga Lightning. Integran el chip H1 para emparejamiento rápido con dispositivos Apple, control por voz con \"Oye Siri\" y un perfil de uso cómodo para llamadas, música y videollamadas.",
    "price": "RD$ 5,400.00",
    "img": "img/productos/catalogo/airpods-2gen.jpg",
    "gallery": [
      "img/productos/catalogo/airpods-2gen.jpg"
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
    "brand": "Hikvision",
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
    "brand": "Hikvision",
    "title": "UPS Hikvision DS-UPS1000, 1000 VA / 600 W",
    "desc": "UPS Hikvision de 1000 VA orientado a respaldo eléctrico para DVR, NVR, routers, estaciones de trabajo y periféricos de oficina. Su capacidad de 600 W lo hace adecuado para cargas moderadas que requieren continuidad ante cortes o fluctuaciones.",
    "price": "RD$ 3,350.00",
    "img": "img/productos/hikvision-ups1000.jpg",
    "gallery": [
      "img/productos/hikvision-ups1000.jpg"
    ],
    "specs": [
      "Capacidad: 1000 VA / 600 W",
      "Batería interna de 12 V / 9 Ah",
      "Tiempo de transferencia ≤ 10 ms",
      "Protección contra sobrecarga, descarga y sobrevoltaje"
    ]
  },
  {
    "id": "mob_oficina_1",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo blanco con panel frontal",
    "desc": "Superficie amplia, pasacables integrado y panel frontal para mayor privacidad. Ideal para oficinas ejecutivas y corporativas.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-1.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-1.jpeg"
    ],
    "specs": [
      "Escritorio ejecutivo",
      "Panel frontal",
      "Pasacables integrado"
    ]
  },
  {
    "id": "mob_oficina_2",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio gerencial en L con credenza lateral",
    "desc": "Cubierta acabado madera, estructura gris y módulo lateral de almacenamiento para ejecutivos.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-2.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-2.jpeg"
    ],
    "specs": [
      "Configuración en L",
      "Credenza lateral",
      "Acabado madera y gris"
    ]
  },
  {
    "id": "mob_oficina_3",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo con retorno auxiliar",
    "desc": "Diseño gerencial con superficie principal, retorno lateral y acabado combinado.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-3.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-3.jpeg"
    ],
    "specs": [
      "Retorno lateral",
      "Superficie ejecutiva",
      "Acabado combinado"
    ]
  },
  {
    "id": "mob_oficina_4",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Estación ejecutiva en L con pedestal",
    "desc": "Escritorio acabado madera con estructura metálica y gavetas laterales.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-4.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-4.jpeg"
    ],
    "specs": [
      "Configuración en L",
      "Pedestal con gavetas",
      "Estructura metálica"
    ]
  },
  {
    "id": "mob_oficina_5",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio operativo rectangular gris",
    "desc": "Estación compacta con superficie texturizada y estructura metálica.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-5.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-5.jpeg"
    ],
    "specs": [
      "Formato rectangular",
      "Superficie texturizada",
      "Estructura metálica"
    ]
  },
  {
    "id": "mob_oficina_6",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo blanco con cubierta de vidrio",
    "desc": "Diseño contemporáneo con vidrio, pasacables y módulo lateral.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-6.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-6.jpeg"
    ],
    "specs": [
      "Cubierta de vidrio",
      "Pasacables",
      "Módulo lateral"
    ]
  },
  {
    "id": "mob_oficina_7",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Librero de madera ejecutivo para oficina",
    "desc": "Librero y estantería de madera para archivo de expedientes, carpetas y libros ejecutivos.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-7.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-7.jpeg"
    ],
    "specs": [
      "Estructura de madera resistente",
      "Estantes reforzados para archivo y libros",
      "Acabado ejecutivo de alta durabilidad",
      "Instalación corporativa disponible"
    ]
  },
  {
    "id": "mob_oficina_8",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio gerencial en L con vidrio y madera",
    "desc": "Combinación de vidrio negro, detalles de madera y estructura metálica.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-8.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-8.jpeg"
    ],
    "specs": [
      "Configuración en L",
      "Vidrio negro y madera",
      "Estructura metálica"
    ]
  },
  {
    "id": "mob_oficina_9",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo blanco con panel metálico",
    "desc": "Cubierta de vidrio blanco, pasacables y panel frontal perforado.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-9.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-9.jpeg"
    ],
    "specs": [
      "Cubierta de vidrio blanco",
      "Panel frontal perforado",
      "Pasacables"
    ]
  },
  {
    "id": "mob_oficina_10",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio modular en L blanco y gris",
    "desc": "Retorno lateral, compartimientos abiertos y pedestal de tres gavetas.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-10.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-10.jpeg"
    ],
    "specs": [
      "Configuración modular en L",
      "Compartimientos abiertos",
      "Pedestal de tres gavetas"
    ]
  },
  {
    "id": "mob_oficina_11",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo acabado madera con patas metálicas",
    "desc": "Superficie amplia, panel frontal y estructura metálica moderna.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-11.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-11.jpeg"
    ],
    "specs": [
      "Acabado madera",
      "Panel frontal",
      "Patas metálicas"
    ]
  },
  {
    "id": "mob_oficina_12",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo blanco y madera con cubierta de vidrio",
    "desc": "Cubierta de vidrio, estructura blanca y panel frontal acabado madera.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-12.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-12.jpeg"
    ],
    "specs": [
      "Cubierta de vidrio",
      "Estructura blanca",
      "Panel frontal acabado madera"
    ]
  },
  {
    "id": "mob_oficina_13",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Escritorio ejecutivo negro con cubierta de vidrio",
    "desc": "Diseño sobrio con panel frontal metálico y estructura negra.",
    "price": "Cotizar",
    "img": "img/productos/mobiliario/mob-13.jpeg",
    "gallery": [
      "img/productos/mobiliario/mob-13.jpeg"
    ],
    "specs": [
      "Cubierta de vidrio negro",
      "Panel frontal metálico",
      "Estructura negra"
    ]
  },
  {
    "id": "lap_dell_lat_5410",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 5410 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas",
    "desc": "Laptop empresarial reacondicionada de décima generación para oficina y teletrabajo.",
    "price": "RD$ 18,500.00",
    "img": "img/productos/laptops/01-dell-latitude-5410.webp",
    "gallery": [
      "img/productos/laptops/01-dell-latitude-5410.webp",
      "img/productos/laptops/01-dell-latitude-5410-02.webp",
      "img/productos/laptops/01-dell-latitude-5410-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i5 de 10.ª generación",
      "Memoria RAM: 8 GB DDR4",
      "Almacenamiento: SSD M.2 de 128 GB",
      "Pantalla: 14 pulgadas HD/FHD",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "lap_dell_lat_7400",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 7400 Core i5, 8 GB RAM, SSD de 120/256 GB y HDD de 500 GB",
    "desc": "Equipo corporativo serie 7000 ultradelgado con chasis de magnesio y alto rendimiento.",
    "price": "RD$ 19,800.00",
    "img": "img/productos/laptops/02-dell-latitude-7400.webp",
    "gallery": [
      "img/productos/laptops/02-dell-latitude-7400.webp",
      "img/productos/laptops/02-dell-latitude-7400-02.webp",
      "img/productos/laptops/02-dell-latitude-7400-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i5 de 8.ª generación",
      "Memoria RAM: 8 GB DDR4",
      "Almacenamiento híbrido SSD + HDD",
      "Pantalla: 14 pulgadas FHD",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "lap_dell_lat_5330",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 5330 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas",
    "desc": "Portátil empresarial premium de 12.ª generación con chasis compacto, gran autonomía y seguridad corporativa TPM 2.0.",
    "price": "RD$ 28,500.00",
    "img": "img/productos/laptops/03-dell-latitude-5330.webp",
    "gallery": [
      "img/productos/laptops/03-dell-latitude-5330.webp",
      "img/productos/laptops/03-dell-latitude-5330-02.webp",
      "img/productos/laptops/03-dell-latitude-5330-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i7 de 12.ª generación",
      "Memoria RAM: 16 GB DDR4",
      "Almacenamiento: SSD NVMe de 256 GB",
      "Pantalla: 13.3 pulgadas Full HD antirreflejo",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "lap_dell_lat_5490",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 5490 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas, generación 8",
    "desc": "Laptop corporativa confiable de octava generación con teclado en español y alta durabilidad para empresas.",
    "price": "RD$ 16,900.00",
    "img": "img/productos/laptops/04-dell-latitude-5490-gen8.webp",
    "gallery": [
      "img/productos/laptops/04-dell-latitude-5490-gen8.webp",
      "img/productos/laptops/04-dell-latitude-5490-gen8-02.webp",
      "img/productos/laptops/04-dell-latitude-5490-gen8-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i5 de 8.ª generación quad-core",
      "Memoria RAM: 8 GB DDR4",
      "Almacenamiento: SSD de 128 GB",
      "Pantalla: 14 pulgadas",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "lap_dell_lat_7390",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 7390 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas",
    "desc": "Ultraligera empresarial de la prestigiosa serie Latitude 7000 para profesionales móviles y ejecutivos.",
    "price": "RD$ 23,500.00",
    "img": "img/productos/laptops/05-dell-latitude-7390.webp",
    "gallery": [
      "img/productos/laptops/05-dell-latitude-7390.webp",
      "img/productos/laptops/05-dell-latitude-7390-02.webp",
      "img/productos/laptops/05-dell-latitude-7390-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i7 de 8.ª generación",
      "Memoria RAM: 16 GB DDR4",
      "Almacenamiento: SSD M.2 de 256 GB",
      "Pantalla: 13.3 pulgadas Full HD",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "lap_dell_lat_7390_touch",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 7390 Touch Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas",
    "desc": "Versión táctil interactiva reacondicionada de la Latitude 7390, orientada a movilidad y presentaciones ejecutivas.",
    "price": "RD$ 25,900.00",
    "img": "img/productos/laptops/06-dell-latitude-7390-touch.webp",
    "gallery": [
      "img/productos/laptops/06-dell-latitude-7390-touch.webp",
      "img/productos/laptops/06-dell-latitude-7390-touch-02.webp",
      "img/productos/laptops/06-dell-latitude-7390-touch-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i7 de 8.ª generación",
      "Memoria RAM: 16 GB DDR4",
      "Almacenamiento: SSD de 256 GB",
      "Pantalla táctil: 13.3 pulgadas Full HD Touchscreen",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "gm_cooler_tryx_panorama_360",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "TRYX",
    "title": "Enfriamiento Líquido TRYX PANORAMA 360 ARGB Pantalla AMOLED Curva 6.5\"",
    "desc": "Refrigeración líquida All-in-One revolucionaria con pantalla AMOLED curvada de 6.5 pulgadas en el bloque para visualizar animaciones GIF, imágenes y temperaturas del sistema en tiempo real.",
    "price": "RD$ 16,915.00",
    "img": "img/gaming/componentes/cooler-tryx-panorama-360-argb.jpg",
    "gallery": [
      "img/gaming/componentes/cooler-tryx-panorama-360-argb.jpg"
    ],
    "specs": [
      "Pantalla curva AMOLED de 6.5 pulgadas personalizable",
      "3 ventiladores ARGB de 120mm silenciosos de alto flujo",
      "Radiador de 360mm de máxima disipación térmica",
      "Fácil montaje compatible con sockets Intel y AMD"
    ]
  },
  {
    "id": "gm_cooler_nzxt_kraken_elite_360",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "NZXT",
    "title": "Cooler Líquido NZXT Kraken Elite 360 RGB White Pantalla LCD 2.36\"",
    "desc": "Disipador líquido AIO premium en elegante color blanco. Incluye pantalla LCD circular de 2.36 pulgadas personalizable vía NZXT CAM y 3 ventiladores RGB de alto rendimiento.",
    "price": "RD$ 18,530.00",
    "img": "img/gaming/componentes/cooler-nzxt-kraken-elite-360.jpg",
    "gallery": [
      "img/gaming/componentes/cooler-nzxt-kraken-elite-360.jpg"
    ],
    "specs": [
      "Pantalla LCD circular de 2.36\" de resolución 640x640",
      "Radiador de 360mm con ventiladores RGB de 120mm incluidos",
      "Bomba Asetek silenciosa de alto caudal",
      "Soporte universal Intel y AMD con garantía local"
    ]
  },
  {
    "id": "gm_case_lian_li_o11_dynamic_evo",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "LIAN LI",
    "title": "Gabinete Gaming ATX Lian Li O11 Dynamic EVO Black Cristal Templado",
    "desc": "Chasis de doble cámara referencial para entusiastas. Doble panel de cristal templado, soporte de múltiples radiadores de 360mm y diseño modular invertible.",
    "price": "RD$ 12,490.00",
    "img": "img/gaming/componentes/case-lian-li-o11-dynamic-evo.jpg",
    "gallery": [
      "img/gaming/componentes/case-lian-li-o11-dynamic-evo.jpg"
    ],
    "specs": [
      "Diseño modular de doble cámara en cristal templado",
      "Soporte para placas E-ATX, ATX, Micro-ATX y Mini-ITX",
      "Capacidad para hasta 3 radiadores simultáneos de 360mm",
      "Gestión de cableado oculta y máxima compatibilidad con GPU vertical"
    ]
  },
  {
    "id": "gm_case_msi_mag_pano_100r",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "MSI",
    "title": "Gabinete Panorámico MSI MAG Pano 100R PZ White ARGB",
    "desc": "Gabinete panorámico blanco con vista panorámica de 270 grados en cristal templado curvado. Compatible con motherboards Project Zero de conectores traseros ocultos.",
    "price": "RD$ 11,200.00",
    "img": "img/gaming/componentes/case-msi-mag-pano-100r.jpg",
    "gallery": [
      "img/gaming/componentes/case-msi-mag-pano-100r.jpg"
    ],
    "specs": [
      "Vista panorámica de 270 grados sin pilares divisorios",
      "Compatibilidad con placas base Back-Connect (Project Zero / BTF)",
      "Ventiladores ARGB inversos preinstalados para flujo óptimo",
      "Estructura robusta con filtros antipolvo magnéticos"
    ]
  },
  {
    "id": "gm_psu_msi_mag_a1000gs",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "MSI",
    "title": "Fuente de Poder MSI MAG A1000GS 1000W 80 Plus Gold Full Modular PCIe 5.0 ATX 3.1",
    "desc": "Fuente de poder de alta potencia y certificación 80 Plus Gold, nativa con estándar PCIe 5.1 y cable 12V-2x6 para alimentar tarjetas gráficas RTX Serie 40 y Serie 50.",
    "price": "RD$ 13,850.00",
    "img": "img/gaming/componentes/psu-msi-mag-a1000gs-pcie5.jpg",
    "gallery": [
      "img/gaming/componentes/psu-msi-mag-a1000gs-pcie5.jpg"
    ],
    "specs": [
      "Potencia real de 1000W con certificación 80 Plus Gold",
      "Estándar ATX 3.1 y PCIe 5.1 nativo con conector 12V-2x6",
      "Condensadores 100% japoneses de 105°C para máxima vida útil",
      "Ventilador con rodamiento FDB de 135mm ultra silencioso"
    ]
  },
  {
    "id": "gm_ram_kingston_fury_64gb_ddr5",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "KINGSTON",
    "title": "Memoria RAM Kingston Fury Beast RGB DDR5 64GB (2x32GB) 6000MT/s CL30",
    "desc": "Kit de memoria RAM DDR5 de alta capacidad y latencia ultra baja CL30 para estaciones de trabajo, streaming y gaming extremo en plataformas AMD AM5 e Intel LGA1700/1851.",
    "price": "RD$ 15,600.00",
    "img": "img/gaming/componentes/ram-kingston-fury-beast-ddr5-64gb.jpg",
    "gallery": [
      "img/gaming/componentes/ram-kingston-fury-beast-ddr5-64gb.jpg"
    ],
    "specs": [
      "Capacidad total de 64 GB (2 módulos de 32 GB)",
      "Frecuencia de 6000 MT/s con latencia optimizada CL30",
      "Soporte para perfiles Intel XMP 3.0 y AMD EXPO",
      "Iluminación RGB personalizable con tecnología Infrared Sync"
    ]
  },
  {
    "id": "gm_ssd_samsung_9100_pro_2tb",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "SAMSUNG",
    "title": "SSD Samsung 9100 PRO 2TB M.2 NVMe PCIe Gen5 x4 Lectura 14,000 MB/s",
    "desc": "Unidad de estado sólido buque insignia PCIe Gen5 con velocidades de lectura de hasta 14,000 MB/s, ideal para renderizado 3D, edición 8K y cargas instantáneas.",
    "price": "RD$ 21,900.00",
    "img": "img/gaming/componentes/ssd-samsung-9100-pro-2tb.jpg",
    "gallery": [
      "img/gaming/componentes/ssd-samsung-9100-pro-2tb.jpg"
    ],
    "specs": [
      "Capacidad de 2 TB en factor M.2 2280 NVMe PCIe 5.0 x4",
      "Velocidad de lectura secuencial hasta 14,000 MB/s",
      "Velocidad de escritura secuencial hasta 12,000 MB/s",
      "Controlador de última generación con eficiencia térmica superior"
    ]
  },
  {
    "id": "gm_ssd_crucial_p310_2tb",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "CRUCIAL",
    "title": "SSD Crucial P310 2TB M.2 NVMe PCIe Gen4 x4 Lectura 7,100 MB/s",
    "desc": "Almacenamiento NVMe PCIe 4.0 de alta capacidad y velocidad, perfecto para expandir consolas PS5, laptops de alto rendimiento y PCs de escritorio.",
    "price": "RD$ 13,950.00",
    "img": "img/gaming/componentes/ssd-crucial-p310-2tb.jpg",
    "gallery": [
      "img/gaming/componentes/ssd-crucial-p310-2tb.jpg"
    ],
    "specs": [
      "Capacidad de 2 TB M.2 2280 PCIe Gen4",
      "Lectura secuencial hasta 7,100 MB/s",
      "Escritura secuencial hasta 6,000 MB/s",
      "Tecnología Micron 3D NAND para alta confiabilidad"
    ]
  },
  {
    "id": "gm_ssd_crucial_p310_1tb",
    "department": "equipos",
    "category": "Componentes Gaming",
    "brand": "CRUCIAL",
    "title": "SSD Crucial P310 1TB M.2 NVMe PCIe Gen4 x4 Lectura 7,100 MB/s",
    "desc": "Unidad SSD NVMe de 1TB de alta velocidad para dar un salto notable de fluidez y reducir los tiempos de carga en cualquier PC gaming o portátil compatible con PCIe Gen4.",
    "price": "RD$ 10,125.00",
    "img": "img/gaming/componentes/ssd-crucial-p310-1tb.jpg",
    "gallery": [
      "img/gaming/componentes/ssd-crucial-p310-1tb.jpg"
    ],
    "specs": [
      "Capacidad de 1TB M.2 2280 PCIe Gen4",
      "Lectura secuencial hasta 7,100 MB/s",
      "Escritura secuencial hasta 6,000 MB/s",
      "Durabilidad y confiabilidad comprobada Micron"
    ]
  },
  {
    "id": "pc_dell_optiplex_7050_sff",
    "department": "equipos",
    "category": "Computadoras de Escritorio",
    "brand": "DELL",
    "title": "PC de Escritorio Dell OptiPlex 7050 SFF Intel Core i5-7500 3.4GHz, 16GB RAM, 256GB SSD NVMe",
    "desc": "Computadora corporativa de escritorio Dell OptiPlex 7050 Small Form Factor (SFF) de alto rendimiento. Diseñada para oficinas ejecutivas, estaciones contables, laboratorios y puestos de atención continua con chasis compacto ultra resistente y bajo consumo energético.",
    "price": "RD$ 16,500.00",
    "img": "img/productos/dell-optiplex-i7.jpg",
    "gallery": [
      "img/productos/dell-optiplex-i7.jpg"
    ],
    "specs": [
      "Procesador Intel Core i5-7500 (3.40 GHz hasta 3.80 GHz Turbo, 4 núcleos)",
      "16 GB Memoria RAM DDR4 (ampliable a 64 GB en 4 ranuras DIMM)",
      "256 GB Almacenamiento SSD M.2 NVMe ultrarrápido",
      "Gráficos integrados Intel HD Graphics 630",
      "Conectividad: 2x DisplayPort 1.2, 1x HDMI, 6x USB 3.0, 4x USB 2.0, Gigabit Ethernet RJ-45",
      "Factor de forma SFF compacto ideal para espacios reducidos",
      "Sistema operativo Windows 10/11 Pro 64-bit preinstalado con licencia corporativa",
      "Garantía local de 1 año con respaldo y soporte técnico Futunet"
    ]
  },
  {
    "id": "pc_dell_optiplex_5050_sff",
    "department": "equipos",
    "category": "Computadoras de Escritorio",
    "brand": "DELL",
    "title": "PC de Escritorio Dell OptiPlex 5050 SFF Intel Core i5-7500 3.4GHz, 8GB RAM, 256GB SSD",
    "desc": "Equipo de escritorio Dell OptiPlex 5050 SFF generación 7. Excelente equilibrio entre potencia, fiabilidad corporativa y coste operativo para farmacias, supermercados, call centers y despachos profesionales.",
    "price": "RD$ 13,800.00",
    "img": "img/productos/dell-optiplex-i7.jpg",
    "gallery": [
      "img/productos/dell-optiplex-i7.jpg"
    ],
    "specs": [
      "Procesador Intel Core i5-7500 3.4 GHz Quad-Core",
      "8 GB Memoria RAM DDR4",
      "256 GB SSD de estado sólido de alta velocidad",
      "Salidas de video duales DisplayPort y HDMI",
      "Chasis SFF silencioso con ventilación inteligente de flujo directo",
      "6 puertos USB 3.0 de alta velocidad y salida de audio frontal",
      "Garantía y despacho inmediato en Santiago y todo el país"
    ]
  },
  {
    "id": "pc_dell_optiplex_3050_sff",
    "department": "equipos",
    "category": "Computadoras de Escritorio",
    "brand": "DELL",
    "title": "PC de Escritorio Dell OptiPlex 3050 SFF Intel Core i5 8GB RAM, 500GB HDD + 128GB SSD",
    "desc": "Solución de computación confiable y económica para puestos de digitación, cajas y oficinas. Configuración híbrida con disco SSD para arranque instantáneo de Windows y disco duro secundario de 500GB para almacenamiento masivo de datos.",
    "price": "RD$ 11,900.00",
    "img": "img/productos/dell-optiplex-i7.jpg",
    "gallery": [
      "img/productos/dell-optiplex-i7.jpg"
    ],
    "specs": [
      "Procesador Intel Core i5 (7ma Generación) 3.4 GHz",
      "8 GB Memoria RAM DDR4",
      "Almacenamiento híbrido: 128 GB SSD (Sistema rápido) + 500 GB HDD (Archivos)",
      "Conexiones: HDMI, DisplayPort, puertos USB 3.0 y audio frontal",
      "Formato compacto Small Form Factor (SFF)",
      "Bajo consumo eléctrico y chasis de fácil mantenimiento sin herramientas"
    ]
  },
  {
    "id": "mon_lg_24mp400_b_fhd",
    "department": "equipos",
    "category": "Monitores y Pantallas",
    "brand": "LG",
    "title": "Monitor LG 24MP400-B 24 Pulgadas IPS Full HD (1920x1080) 75Hz HDMI AMD FreeSync",
    "desc": "Monitor LG de 24 pulgadas con panel IPS Full HD y diseño prácticamente sin bordes en 3 lados. Ofrece una reproducción precisa del color desde cualquier ángulo, tecnología Flicker Safe para evitar fatiga ocular y compatibilidad con AMD FreeSync.",
    "price": "RD$ 8,950.00",
    "img": "img/productos/hp-monitor-widescreen.jpg",
    "gallery": [
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Pantalla 23.8 pulgadas IPS con resolución Full HD (1920 x 1080)",
      "Frecuencia de actualización de 75Hz con AMD FreeSync",
      "Ángulo de visión ultra ancho de 178º horizontal y vertical",
      "Protección ocular: Flicker Safe y Modo Lectura antirreflejo",
      "Entradas: 1x HDMI y 1x VGA (D-Sub)",
      "Montaje en pared VESA 75 x 75 mm compatible",
      "Control de ajustes en pantalla OnScreen Control de LG"
    ]
  },
  {
    "id": "mon_lg_27mp400_b_fhd",
    "department": "equipos",
    "category": "Monitores y Pantallas",
    "brand": "LG",
    "title": "Monitor LG 27MP400-B 27 Pulgadas IPS Full HD (1920x1080) 75Hz HDMI FreeSync",
    "desc": "Pantalla panorámica LG de 27 pulgadas IPS ideal para entornos ejecutivos, diseño gráfico, edición de documentos en paralelo y programación. Colores vivos y ángulo visual amplio para máxima productividad.",
    "price": "RD$ 11,800.00",
    "img": "img/productos/hp-monitor-widescreen.jpg",
    "gallery": [
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Pantalla amplia de 27 pulgadas IPS Full HD (1920 x 1080)",
      "Tasa de refresco 75Hz con tecnología Dynamic Action Sync y Black Stabilizer",
      "Acabado mate antirreflejos 3H",
      "Conexión versátil: HDMI y D-Sub VGA",
      "Certificación de eficiencia energética y bajo consumo",
      "Soporte para inclinación ergonómica y anclaje VESA"
    ]
  },
  {
    "id": "mon_dell_se2422h_fhd",
    "department": "equipos",
    "category": "Monitores y Pantallas",
    "brand": "DELL",
    "title": "Monitor Dell SE2422H 24 Pulgadas Full HD 1080p 75Hz HDMI/VGA Antirreflejo",
    "desc": "Monitor empresarial Dell de 24 pulgadas diseñado para jornadas laborales prolongadas. Incluye tecnología ComfortView para reducir la emisión de luz azul perjudicial y una base compacta que libera espacio en el escritorio.",
    "price": "RD$ 9,400.00",
    "img": "img/productos/hp-monitor-widescreen.jpg",
    "gallery": [
      "img/productos/hp-monitor-widescreen.jpg"
    ],
    "specs": [
      "Pantalla 23.8 pulgadas Full HD (1920 x 1080) con tecnología LED",
      "Frecuencia de 75Hz con compatibilidad AMD FreeSync",
      "Tratamiento antirreflejo con dureza 3H",
      "Puertos: 1x HDMI 1.4 y 1x VGA",
      "Tecnología Dell ComfortView con certificación TÜV Rheinland",
      "Organizador de cables integrado en la base"
    ]
  },
  {
    "id": "sec_hikvision_cam_colorvu_1080p",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "HIKVISION",
    "title": "Cámara Hikvision ColorVu Turbo HD 1080p Domo/Bala Visión Nocturna 24/7 a Color",
    "desc": "Cámara de videovigilancia profesional Hikvision con revolucionaria tecnología ColorVu. Proporciona imágenes brillantes y en color vivo las 24 horas del día, incluso en completa oscuridad exterior o interior, superando a las cámaras infrarrojas tradicionales.",
    "price": "RD$ 2,450.00",
    "img": "img/productos/catalogo/camara-ip.jpg",
    "gallery": [
      "img/productos/catalogo/camara-ip.jpg",
      "img/camaras.jpg"
    ],
    "specs": [
      "Resolución 2 Megapíxeles Full HD 1080p (1920 x 1080)",
      "Tecnología ColorVu con apertura F1.0 para captar máxima luz ambiental",
      "Iluminador de luz blanca suave hasta 20 metros para visión nocturna a todo color",
      "Lente fija de 2.8 mm con gran ángulo de cobertura (106°)",
      "Protección IP67 resistente al agua, polvo y sol caribeño para exteriores",
      "Micrófono integrado con transmisión de audio sobre coaxial (Audio over Coax)",
      "Compatible con todos los DVRs Turbo HD y formatos TVI/AHD/CVI/CVBS"
    ]
  },
  {
    "id": "sec_hikvision_kit_dvr_4ch",
    "department": "seguridad",
    "category": "Sistemas de Seguridad CCTV",
    "brand": "HIKVISION",
    "title": "Kit de Videovigilancia Hikvision DVR 4 Canales 1080p + 4 Cámaras con App Móvil",
    "desc": "Sistema integral de seguridad y monitoreo Hikvision de 4 cámaras Full HD y grabador DVR digital con compresión H.265+. Permite visualizar en vivo y revisar grabaciones desde cualquier parte del mundo a través de la aplicación gratuita Hik-Connect en teléfonos iPhone y Android.",
    "price": "RD$ 12,900.00",
    "img": "img/productos/hikvision-dvr-8ch.webp",
    "gallery": [
      "img/productos/hikvision-dvr-8ch.webp",
      "img/camaras.jpg"
    ],
    "specs": [
      "1 Grabador Digital DVR Hikvision de 4 canales 1080p Lite con compresión ultra H.265+",
      "4 Cámaras de alta resolución 1080p para interior y exterior con visión nocturna infrarroja EXIR",
      "Visualización remota gratuita P2P con Hik-Connect en iOS y Android sin costo mensual",
      "Detección de movimiento inteligente con notificaciones instantáneas push al móvil",
      "Salidas de video simultáneas HDMI Full HD y VGA",
      "Incluye cables de video y poder de 18 metros por cámara, divisor y fuente de poder certificada",
      "Asesoría de instalación y configuración de red por técnicos especializados de Futunet"
    ]
  },
  {
    "id": "lap_dell_lat_5480",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Dell",
    "title": "Laptop Dell Latitude 5480 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas",
    "desc": "Laptop corporativa resistente para oficina, digitación continua y labores administrativas con chasis reforzado.",
    "price": "RD$ 15,900.00",
    "img": "img/productos/laptops/17-dell-latitude-5480.webp",
    "gallery": [
      "img/productos/laptops/17-dell-latitude-5480.webp",
      "img/productos/laptops/17-dell-latitude-5480-02.webp",
      "img/productos/laptops/17-dell-latitude-5480-03.webp"
    ],
    "specs": [
      "Procesador: Intel Core i5 de 7.ª/8.ª generación",
      "Memoria RAM: 8 GB DDR4",
      "Almacenamiento: SSD M.2 de 128 GB",
      "Pantalla: 14 pulgadas antirreflejo",
      "Garantía local Futunet"
    ]
  },
  {
    "id": "cec_proyector_epson_powerlite_e20",
    "department": "equipos",
    "category": "Equipos de Oficina",
    "brand": "Epson",
    "title": "Proyector Epson PowerLite E20 3LCD 3400 Lúmenes XGA HDMI",
    "desc": "El proyector Epson PowerLite E20 es ideal para aulas, centros educativos y salas de reuniones de empresas. Ofrece 3.400 lúmenes de brillo en blanco y color con tecnología 3LCD, larga vida útil de lámpara (hasta 12.000 horas en modo Eco) y conectividad HDMI versátil.",
    "price": "RD$ 38,900.00",
    "img": "img/productos/epson-co-fh02.jpg",
    "gallery": [
      "img/productos/epson-co-fh02.jpg"
    ],
    "specs": [
      "Tecnología: 3LCD de 3 chips de alto contraste",
      "Luminosidad: 3,400 lúmenes en color y blanco",
      "Resolución: XGA (1024 x 768) con escalado a Full HD",
      "Lámpara de larga duración: hasta 12,000 horas en modo Eco",
      "Altavoz integrado de 5W y puertos HDMI, VGA y USB",
      "Garantía oficial de 2 años en equipos para empresas en Futunet"
    ]
  },
  {
    "id": "prod_pantalla_proyeccion_100",
    "department": "equipos",
    "category": "Equipos de Oficina",
    "brand": "Epson",
    "title": "Pantalla de Proyección Retráctil 100 Pulgadas para Proyector (16:9 / 4:3) con Trípode y Montaje Mural",
    "desc": "Pantalla de proyección retráctil para proyector en salas de conferencias, aulas y eventos corporativos con trípode metálico y anclaje mural.",
    "price": "RD$ 7,850.00",
    "img": "img/productos/epson-co-fh02.jpg",
    "gallery": [
      "img/productos/epson-co-fh02.jpg"
    ],
    "specs": [
      "Diagonal: 100 pulgadas formato panorámico 16:9 y estándar 4:3",
      "Material: Tela blanco mate de alta reflectancia y borde negro para contraste óptimo",
      "Estructura: Sistema retráctil con resorte de alta durabilidad",
      "Montaje: Trípode telescópico graduable de acero + argollas para instalación fija en techo o pared",
      "Fácil transporte y despliegue rápido para presentaciones ejecutivas"
    ]
  },
  {
    "id": "tgm_mwfot_12000_btu",
    "department": "energia",
    "category": "Aires Acondicionados",
    "brand": "TGM",
    "title": "Aire acondicionado TGM Mini-Split 12,000 BTU",
    "desc": "Mini-Split TGM de velocidad fija y alta eficiencia para climatización residencial y oficinas medianas.",
    "price": "RD$ 26,500.00",
    "img": "img/productos/tgm/tgm-fixed-speed-12000-btu.webp",
    "gallery": [
      "img/productos/tgm/tgm-fixed-speed-12000-btu.webp",
      "img/productos/tgm/tgm-mwfot-official-specs.webp",
      "img/productos/tgm/tgm-mwfot-official-features.webp"
    ],
    "specs": [
      "Marca: TGM",
      "Capacidad: 12,000 BTU/h",
      "Tipo: Mini-Split de alta eficiencia",
      "Voltaje: 220-230 V, 60 Hz",
      "Refrigerante ecológico R410A",
      "Filtro de alta densidad y bajo nivel de ruido",
      "Garantía oficial y servicio de instalación disponible"
    ]
  },
  {
    "id": "tgm_mwfot_18000_btu",
    "department": "energia",
    "category": "Aires Acondicionados",
    "brand": "TGM",
    "title": "Aire acondicionado TGM Mini-Split 18,000 BTU",
    "desc": "Mini-Split TGM de 18,000 BTU para climatización residencial amplia y áreas corporativas de alta exigencia.",
    "price": "RD$ 37,800.00",
    "img": "img/productos/tgm/tgm-fixed-speed-18000-btu.webp",
    "gallery": [
      "img/productos/tgm/tgm-fixed-speed-18000-btu.webp",
      "img/productos/tgm/tgm-mwfot-official-specs.webp",
      "img/productos/tgm/tgm-mwfot-official-features.webp"
    ],
    "specs": [
      "Marca: TGM",
      "Capacidad: 18,000 BTU/h",
      "Tipo: Mini-Split de climatización continua",
      "Voltaje: 220-230 V, 60 Hz",
      "Refrigerante ecológico R410A",
      "Modo silencioso y detección inteligente",
      "Garantía oficial y servicio de instalación disponible"
    ]
  },
  {
    "id": "tgm_mwfot_24000_btu",
    "department": "energia",
    "category": "Aires Acondicionados",
    "brand": "TGM",
    "title": "Aire acondicionado TGM Mini-Split 24,000 BTU",
    "desc": "Mini-Split TGM de 24,000 BTU de máxima potencia para áreas abiertas, locales comerciales y oficinas grandes.",
    "price": "RD$ 49,900.00",
    "img": "img/productos/tgm/tgm-fixed-speed-24000-btu.webp",
    "gallery": [
      "img/productos/tgm/tgm-fixed-speed-24000-btu.webp",
      "img/productos/tgm/tgm-mwfot-official-specs.webp",
      "img/productos/tgm/tgm-mwfot-official-features.webp"
    ],
    "specs": [
      "Marca: TGM",
      "Capacidad: 24,000 BTU/h",
      "Tipo: Mini-Split de alto rendimiento",
      "Voltaje: 220-230 V, 60 Hz",
      "Refrigerante ecológico R410A",
      "Flujo de aire de amplio alcance y bajo consumo",
      "Garantía oficial y servicio de instalación disponible"
    ]
  },
  {
    "id": "cisco_cbs110_16t",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Cisco",
    "title": "Switch Cisco Business CBS110 16 Puertos Gigabit Ethernet (10/100/1000 Mbps)",
    "desc": "Switch Gigabit Ethernet Cisco Business CBS110 no administrable de 16 puertos para oficinas y empresas. Conectividad plug-and-play de alta velocidad y bajo consumo con chasis metálico para rack o sobremesa.",
    "price": "RD$ 11,850.00",
    "img": "img/brands-preview/cisco.webp",
    "gallery": [
      "img/brands-preview/cisco.webp"
    ],
    "specs": [
      "16 puertos Gigabit Ethernet RJ-45 (10/100/1000 Mbps)",
      "Capacidad de conmutación de 32 Gbps sin bloqueo",
      "Configuración Plug-and-Play instantánea sin mantenimiento",
      "QoS 802.1p integrado para optimización de videollamadas y voz IP",
      "Diseño metálico resistente con montaje en rack o escritorio",
      "Garantía oficial y soporte corporativo Futunet en Santiago"
    ]
  },
  {
    "id": "cisco_cbs250_24p",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Cisco",
    "title": "Switch Administrable Cisco Business CBS250 24 Puertos Gigabit PoE+ con 4 Enlaces SFP",
    "desc": "Switch inteligente gestionable Cisco Business CBS250 con 24 puertos Gigabit PoE+ (presupuesto 195W) y 4 puertos uplink SFP dedicados para fibra óptica. Diseñado para alimentar cámaras IP, puntos de acceso y telefonía VoIP corporativa.",
    "price": "RD$ 34,500.00",
    "img": "img/brands-preview/cisco.webp",
    "gallery": [
      "img/brands-preview/cisco.webp"
    ],
    "specs": [
      "24 puertos Gigabit 10/100/1000 Mbps PoE+ (802.3at/af, 195W)",
      "4 puertos SFP Gigabit para enlaces ascendentes de fibra óptica",
      "Interfaz web amigable con asistente de configuración intuitivo",
      "Seguridad avanzada: 802.1X, VLANs, ACLs y defensa contra ataques DoS",
      "Gestión centralizada mediante Cisco Business Dashboard",
      "Garantía oficial y servicio de configuración por ingenieros de Futunet"
    ]
  },
  {
    "id": "ubiquiti_unifi_u6_plus",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Ubiquiti",
    "title": "Punto de Acceso Ubiquiti UniFi 6 Plus (U6+) WiFi 6 Doble Banda 3.0 Gbps PoE",
    "desc": "Punto de acceso compacto WiFi 6 de doble banda Ubiquiti UniFi 6 Plus (U6+). Rendimiento de hasta 3.0 Gbps en 5 GHz y 2.4 GHz, ideal para oficinas, naves comerciales y residencias que demandan roaming fluido y alta densidad de usuarios.",
    "price": "RD$ 9,950.00",
    "img": "img/brands-preview/ubiquiti.webp",
    "gallery": [
      "img/brands-preview/ubiquiti.webp"
    ],
    "specs": [
      "Tecnología WiFi 6 (802.11ax) de ultra-alta velocidad hasta 2975 Mbps",
      "Antena MIMO 2x2 de alta ganancia con cobertura extendida",
      "Alimentación Power over Ethernet (PoE 802.3af)",
      "Capacidad para más de 300 dispositivos concurrentes sin latencia",
      "Gestión integral en la nube con UniFi Network Controller o app UniFi",
      "Montaje estético y discreto para techo o pared con kit incluido"
    ]
  },
  {
    "id": "ubiquiti_unifi_lite_8_poe",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Ubiquiti",
    "title": "Switch Ubiquiti UniFi Lite 8 Puertos Gigabit con 4 Puertos PoE+ (52W)",
    "desc": "Switch gestionado de capa 2 Ubiquiti UniFi Switch Lite 8 PoE con 8 puertos Gigabit (4 puertos 802.3at PoE+ con presupuesto total de 52W). Perfecto para alimentar puntos de acceso UniFi y cámaras en oficinas pequeñas y medianas.",
    "price": "RD$ 8,750.00",
    "img": "img/brands-preview/ubiquiti.webp",
    "gallery": [
      "img/brands-preview/ubiquiti.webp"
    ],
    "specs": [
      "8 puertos Gigabit RJ-45 (4 puertos PoE+ 802.3at/af)",
      "Presupuesto PoE total de 52W (hasta 30W por puerto)",
      "Diseño compacto de sobremesa sin ventilador (operación silenciosa)",
      "Totalmente gestionable desde la plataforma UniFi Network",
      "Montaje en pared o escritorio con accesorios de fijación",
      "Garantía oficial y entrega inmediata en Santiago"
    ]
  },
  {
    "id": "mob_silla_ergonomica_ejecutiva",
    "department": "oficina",
    "category": "Mobiliario",
    "brand": "Futunet Mobiliario",
    "title": "Silla Ergonómica Ejecutiva de Malla Transpirable con Soporte Lumbar",
    "desc": "Silla ergonómica de gama ejecutiva con espaldar de malla antitranspirante, soporte lumbar anatómico regulable, apoyabrazos ergonómicos, cabecero y mecanismo basculante con control de tensión. Especialmente diseñada para jornadas de trabajo intensivo en oficinas y despachos de Santiago.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/sillon-ejecutivo.jpg",
    "gallery": [
      "img/productos/catalogo/sillon-ejecutivo.jpg"
    ],
    "specs": [
      "Diseño ergonómico certificado para jornadas intensivas de 8+ horas",
      "Respaldo de malla transpirable de alta resistencia con soporte lumbar regulable",
      "Reposabrazos ergonómicos y mecanismo basculante con bloqueo de inclinación",
      "Pistón neumático de gas clase 3 con ajuste de altura suave",
      "Base estrella cromada reforzada de 5 radios con ruedas silenciosas de poliuretano",
      "Garantía corporativa de 1 año y factura fiscal formal en Santiago"
    ]
  },
  {
    "id": "ups_forza_nt1002",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Forza",
    "title": "UPS Interactivo Forza NT-1002 1000VA / 500W con Regulación AVR",
    "desc": "Sistema UPS Interactivo Forza NT-1002 de 1000VA / 500W diseñado para brindar respaldo confiable de energía y regulación automática de voltaje (AVR) para computadoras de escritorio, servidores de red, equipos de telecomunicaciones y puntos de venta. Protege contra apagones, caídas de tensión y sobrevoltajes en oficinas y comercios de Santiago.",
    "price": "RD$ 3,850.00",
    "img": "img/productos/hikvision-ups1000.jpg",
    "gallery": [
      "img/productos/hikvision-ups1000.jpg"
    ],
    "specs": [
      "Capacidad: 1000 VA / 500 W con sistema interactivo y regulación AVR",
      "6 salidas tipo NEMA 5-15R (4 con respaldo y regulación + 2 contra sobretensión)",
      "Protección integral contra apagones, sobrevoltaje, subtensión y picos de red",
      "Protección de red telefónica / datos RJ-11 y RJ-45",
      "Arranque en frío (Cold-Start) con batería y alarma sonora inteligente",
      "Garantía oficial de 2 años y comprobante fiscal formal en República Dominicana"
    ]
  }
];
if (typeof module !== 'undefined') module.exports = mockDatabase;
if (typeof window !== 'undefined') window.backupDatabase = mockDatabase;
