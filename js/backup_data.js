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
    "category": "Control de Acceso y Asistencia",
    "brand": "ZKTeco",
    "title": "Cerradura Electromagnética (Electroimán) 600 lbs (280 kg) con Sensor LED y Soporte ZL para Control de Acceso",
    "desc": "Cerradura electromagnética de alta retención de 600 lbs (280 kg) de fuerza para puertas de madera, vidrio, metal y cortafuegos. Incluye sensor de estado con indicador LED bicolor, protección contra corriente residual (MOV) y juego completo de soporte en L y Z (Soporte ZL) para instalación universal. Compatible al 100% con terminales biométricas ZKTeco MB20, teclados de acceso y botones liberadores de salida. Con garantía oficial y soporte técnico de Futunet en Santiago y la región Norte.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/cerradura-magnetica.jpg",
    "gallery": [
      "img/productos/catalogo/cerradura-magnetica.jpg"
    ],
    "specs": [
      "Fuerza de sujeción: 600 lbs (280 kg / 2800N) para alta seguridad",
      "Voltaje de operación: 12V DC / 24V DC seleccionable",
      "Sensor de estado de puerta: Relé con contactos NO/NC/COM y LED indicador",
      "Incluye kit de herrajes: Soporte ZL regulable y placa de armadura",
      "Aplicación: Puertas batientes de madera, metal, vidrio con marco y cortafuegos",
      "Garantía oficial ZKTeco de 1 año con comprobante fiscal formal NCF"
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
    "department": "seguridad",
    "category": "Almacenamiento CCTV",
    "brand": "Western Digital",
    "title": "Disco Duro Western Digital WD Purple 2TB 3.5\" SATA III Especializado para Videovigilancia 24/7",
    "desc": "Disco duro interno Western Digital Purple de 2 Terabytes especialmente diseñado para sistemas de seguridad y videovigilancia de alta definición en funcionamiento ininterrumpido 24 horas al día, 7 días a la semana. Equipado con la tecnología exclusiva AllFrame que reduce la pérdida de cuadros de video y optimiza la reproducción en grabadores DVR y NVR de hasta 64 cámaras de seguridad en simultáneo.",
    "price": "RD$ 4,250.00",
    "img": "img/productos/catalogo/wd-purple-2tb.webp",
    "gallery": [
      "img/productos/catalogo/wd-purple-2tb.webp"
    ],
    "specs": [
      "Capacidad real de 2 TB (2,000 GB) optimizada para grabación continua de alta definición",
      "Tecnología AllFrame exclusiva de WD para cero pérdidas de fotogramas",
      "Factor de forma estándar 3.5 pulgadas con interfaz SATA III a 6.0 Gb/s",
      "Garantía oficial Western Digital de 3 años y comprobante fiscal formal NCF"
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
    "category": "Racks y Gabinetes de Red",
    "brand": "Futunet Redes",
    "title": "Gabinete Rack de Pared 9U 600x450mm con Puerta de Vidrio Templado y Cerradura con Llave",
    "desc": "Gabinete metálico de pared (Wall Mount) formato estándar 19 pulgadas de 9 Unidades de rack (9U) con profundidad de 450 mm. Construido en acero laminado en frío con puerta frontal de vidrio templado, cerradura de seguridad y ranuras de ventilación para switches y DVRs.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/gabinete-9u.jpg",
    "gallery": [
      "img/productos/catalogo/gabinete-9u.jpg"
    ],
    "specs": [
      "Capacidad de 9 Unidades de Rack (9U) estándar 19 pulgadas",
      "Puerta frontal de cristal templado reversible con cerradura y llaves",
      "Paneles laterales desmontables y ranuras para ventilación",
      "Garantía oficial Futunet de 2 años e incluye tornillería enjaulada"
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
    "title": "Punto de Acceso Ubiquiti UniFi 6 Plus (U6+) Access Point WiFi 6 Doble Banda 3.0 Gbps PoE",
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
  },
  {
    "id": "pos_lector_codigo_barra_2d",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Lector de Códigos de Barra 1D/2D USB con Soporte Manos Libres para POS",
    "desc": "Lector omnidireccional de códigos de barras 1D y 2D (códigos QR, DataMatrix, PDF417, UPC, EAN) con conexión USB Plug & Play y base con soporte manos libres articulado con auto-inducción. Diseñado para optimizar el cobro rápido en puntos de venta, farmacias, supermercados y almacenes en Santiago.",
    "price": "RD$ 2,450.00",
    "img": "img/productos/catalogo/pos-lector-barcode.webp",
    "gallery": [
      "img/productos/catalogo/pos-lector-barcode.webp"
    ],
    "specs": [
      "Lectura de códigos 1D (UPC, EAN, Code 128) y 2D (QR Code, Data Matrix, PDF417)",
      "Conexión USB Plug & Play compatible con Windows, Linux, macOS y Android POS",
      "Base soporte manos libres ajustable con sensor de detección automática de objetos",
      "Capacidad de lectura nítida en pantallas de teléfonos móviles y etiquetas dañadas",
      "Garantía local Futunet de 1 año y factura formal con NCF"
    ]
  },
  {
    "id": "pos_gaveta_dinero_metalica",
    "department": "equipos",
    "category": "Periféricos y Partes",
    "brand": "Genérico",
    "title": "Gaveta de Dinero Metálica con Apertura Automática RJ11 para POS",
    "desc": "Cajón monedero metálico de alta durabilidad para terminales y sistemas de punto de venta. Construcción en acero laminado con 5 divisiones para billetes equipadas con pisadores metálicos y 8 bandejas para monedas. Incluye conector estándar RJ11 para apertura automática con impresoras térmicas de tickets y cerradura de seguridad de 3 posiciones.",
    "price": "RD$ 3,650.00",
    "img": "img/productos/catalogo/pos-gaveta-dinero.webp",
    "gallery": [
      "img/productos/catalogo/pos-gaveta-dinero.webp"
    ],
    "specs": [
      "Chasis metálico reforzado en acero laminado en frío para tráfico pesado comercial",
      "5 ranuras para billetes con pisadores de alambre metálico y 8 compartimentos para monedas",
      "Apertura automática con solenoide de impulsos estándar RJ11/RJ12 (12V / 24V)",
      "Cerradura de 3 posiciones con 2 llaves: apertura manual, apertura automática electrónica y bloqueo",
      "Ranura frontal exterior para inserción rápida de cheques o billetes grandes sin abrir",
      "Garantía directa Futunet de 1 año y despacho inmediato en República Dominicana"
    ]
  },
  {
    "id": "cctv_dahua_camara_domo_1080p",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Dahua",
    "title": "Cámara Domo Dahua HDCVI 1080p 2MP con Visión Nocturna Smart IR",
    "desc": "Cámara de videovigilancia Dahua formato Domo con resolución Full HD 1080p (2 Megapíxeles) y lente gran angular de 2.8mm (campo de visión de 103°). Cuenta con iluminación infrarroja Smart IR de hasta 20 metros para visión nocturna clara en total oscuridad sin sobreexponer rostros. Ideal para interiores de oficinas, tiendas, pasillos, consultorios y hogares.",
    "price": "RD$ 1,450.00",
    "img": "img/productos/catalogo/dahua-camara-domo.webp",
    "gallery": [
      "img/productos/catalogo/dahua-camara-domo.webp"
    ],
    "specs": [
      "Resolución Full HD 1080p (1920x1080) a 30 cuadros por segundo",
      "Lente fijo de 2.8 mm con ángulo de visión gran angular de 103 grados",
      "Visión nocturna Smart IR inteligente de hasta 20 metros",
      "Salida de video 4 en 1 conmutable (HDCVI / TVI / AHD / CVBS)",
      "Chasis compacto para montaje en techo o pared con ajuste multidireccional",
      "Garantía oficial Dahua de 2 años y soporte de instalación profesional"
    ]
  },
  {
    "id": "cctv_dahua_camara_bala_1080p",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Dahua",
    "title": "Cámara Bala Dahua HDCVI 1080p 2MP Exterior IP67 Smart IR",
    "desc": "Cámara de seguridad Dahua formato Bala metálica para intemperie con certificación IP67 contra lluvia torrencial, polvo y calor. Resolución Full HD 1080p de 2 Megapíxeles, lente de 3.6mm y visión nocturna Smart IR de 20 metros. Especialmente diseñada para fachadas, entradas, estacionamientos, almacenes y áreas perimetrales en Santiago y todo el Cibao.",
    "price": "RD$ 1,550.00",
    "img": "img/productos/catalogo/dahua-camara-bala.jpg",
    "gallery": [
      "img/productos/catalogo/dahua-camara-bala.jpg"
    ],
    "specs": [
      "Resolución Full HD 1080p (1920x1080) de alta fidelidad cromática",
      "Certificación IP67 resistente al agua, intemperie y ambientes industriales",
      "Visión nocturna por infrarrojos Smart IR con alcance de 20 metros",
      "Soporte articulado de 3 ejes para orientación precisa en paredes o techos",
      "Garantía oficial Dahua de 2 años y facturación con comprobante fiscal"
    ]
  },
  {
    "id": "cctv_dahua_xvr_cooper_4ch",
    "department": "seguridad",
    "category": "Sistemas de Seguridad CCTV",
    "brand": "Dahua",
    "title": "Grabador DVR Dahua XVR Cooper 4 Canales 1080N con App Móvil DMSS",
    "desc": "Grabador de video digital pentahíbrido Dahua XVR Cooper de 4 canales analógicos HD más 1 canal IP adicional (4+1). Incorpora codificación inteligente H.265+ que reduce el consumo de ancho de banda y multiplica por 3 el tiempo de grabación en disco duro. Permite monitoreo remoto en vivo y reproducción de grabaciones desde smartphones y computadoras a través de la aplicación oficial DMSS.",
    "price": "RD$ 3,850.00",
    "img": "img/productos/catalogo/dahua-xvr-cooper.jpg",
    "gallery": [
      "img/productos/catalogo/dahua-xvr-cooper.jpg"
    ],
    "specs": [
      "4 Canales BNC HDCVI / AHD / TVI / CVBS hasta 1080N + 1 Canal IP hasta 2MP",
      "Compresión de video de doble flujo H.265+ / H.265 / H.264",
      "Salidas simultáneas HDMI y VGA en alta definición Full HD",
      "Monitoreo remoto 24/7 mediante aplicación móvil Dahua DMSS (iOS / Android)",
      "Bahía para 1 disco duro SATA interno de hasta 6 TB",
      "Garantía oficial Dahua de 2 años y asesoría técnica de configuración"
    ]
  },
  {
    "id": "zkteco_mb20_terminal_biometrica",
    "department": "seguridad",
    "category": "Control de Acceso y Asistencia",
    "brand": "ZKTeco",
    "title": "Terminal Biométrica ZKTeco MB20 Facial, Huella Digital y RFID para Asistencia y Control de Acceso (Reloj Ponchador)",
    "desc": "Terminal biométrica multiespectral ZKTeco MB20 con reconocimiento facial por luz visible, lector de huella digital de alta precisión y lector de tarjetas RFID para control de asistencia de personal y control de acceso de puertas. Integra relevador para cerradura magnética, botón de salida y sensor de puerta. Conectividad TCP/IP de red y puerto USB para descarga de reportes de ponches en Excel sin necesidad de software complejo. Compatible con software ZKTime.Net y BioTime para gestión automatizada de horarios, turnos y nóminas en República Dominicana.",
    "price": "RD$ 8,450.00",
    "img": "img/productos/catalogo/zkteco-mb20-biometrico.webp",
    "gallery": [
      "img/productos/catalogo/zkteco-mb20-biometrico.webp"
    ],
    "specs": [
      "Capacidad: 200 rostros, 500 huellas digitales, 1,000 tarjetas RFID y 50,000 registros",
      "Reconocimiento facial rápido en menos de 0.5 segundos con cámara infrarroja antisuplantación",
      "Función Reloj Ponchador: exportación directa de reportes y ponches a memoria USB en Excel",
      "Conectividad: Puerto de red Ethernet TCP/IP y puerto USB Host para descarga inmediata",
      "Control de acceso integrado: Relevador directo para cerradura magnética, electroimán y botón de salida",
      "Pantalla TFT a color de 2.8 pulgadas con interfaz gráfica intuitiva en español",
      "Garantía oficial ZKTeco de 1 año con soporte técnico y asesoría de configuración en Santiago"
    ]
  },
  {
    "id": "cctv_wd_purple_2tb_hdd",
    "department": "seguridad",
    "category": "Almacenamiento CCTV",
    "brand": "Western Digital",
    "title": "Disco Duro Western Digital WD Purple 2TB 3.5\" SATA III Especializado para Videovigilancia 24/7",
    "desc": "Disco duro interno Western Digital Purple de 2 Terabytes especialmente diseñado para sistemas de seguridad y videovigilancia de alta definición en funcionamiento ininterrumpido 24 horas al día, 7 días a la semana. Equipado con la tecnología exclusiva AllFrame que reduce la pérdida de cuadros de video y optimiza la reproducción en grabadores DVR y NVR de hasta 64 cámaras de seguridad en simultáneo. Resiste fluctuaciones térmicas extremas y vibraciones en entornos comerciales e industriales de Santiago.",
    "price": "RD$ 4,250.00",
    "img": "img/productos/catalogo/wd-purple-2tb.webp",
    "gallery": [
      "img/productos/catalogo/wd-purple-2tb.webp"
    ],
    "specs": [
      "Capacidad real de 2 TB (2,000 GB) optimizada para grabación continua de alta definición",
      "Tecnología AllFrame exclusiva de WD para cero pérdidas de fotogramas y compresión H.265+",
      "Factor de forma estándar 3.5 pulgadas con interfaz SATA III a 6.0 Gb/s y 64 MB de caché",
      "Diseñado para soportar hasta 64 cámaras de video HD en DVRs Dahua, Hikvision y NVRs IP",
      "Carga de trabajo de hasta 180 TB/año, triplicando la resistencia de un disco duro convencional de PC",
      "Garantía oficial Western Digital de 3 años y comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "redes_gabinete_rack_9u",
    "department": "redes",
    "category": "Racks y Gabinetes de Red",
    "brand": "Futunet Redes",
    "title": "Gabinete Rack de Pared 9U 600x450mm con Puerta de Vidrio Templado y Cerradura con Llave",
    "desc": "Gabinete metálico de pared (Wall Mount) formato estándar 19 pulgadas de 9 Unidades de rack (9U) con profundidad de 450 mm. Construido en acero laminado en frío de alta resistencia con acabado en pintura electrostática negra anticorrosión. Cuenta con puerta frontal de vidrio templado con cerradura de seguridad y dos llaves, paneles laterales desmontables para fácil acceso al cableado, ranuras de ventilación superior e inferior para flujo de aire y orificios troquelados pasacables. Diseñado para alojar ordenadamente switches Cisco/Ubiquiti, patch panels, bandejas de fibra óptica y DVRs de videovigilancia en oficinas, cuartos de telecomunicaciones y comercios.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/gabinete-9u.jpg",
    "gallery": [
      "img/productos/catalogo/gabinete-9u.jpg"
    ],
    "specs": [
      "Capacidad de 9 Unidades de Rack (9U) estándar internacional EIA-310 de 19 pulgadas",
      "Dimensiones compactas: 600 mm de ancho x 450 mm de profundidad x 500 mm de altura",
      "Puerta frontal de cristal templado reversible con marco metálico y cerradura con llave",
      "Paneles laterales desmontables con pestillo rápido para inspección y mantenimiento de cables",
      "Fabricación en acero SPCC de alta resistencia con capacidad de carga estática de hasta 60 kg",
      "Ranuras para instalación de ventiladores extractores de 120mm y perforaciones pasacables",
      "Garantía oficial de 2 años e incluye tornillería tuercas enjauladas para montaje inmediato"
    ]
  },
  {
    "id": "sec_boton_salida_no_touch",
    "department": "seguridad",
    "category": "Control de Acceso y Asistencia",
    "brand": "ZKTeco",
    "title": "Botón Pulsador de Salida Infrarrojo No Touch de Acero Inoxidable para Control de Acceso",
    "desc": "Pulsador de salida con sensor óptico infrarrojo No Touch (sin contacto) diseñado para apertura higiénica y rápida de cerraduras electromagnéticas y cerraduras de perno. Fabricado en placa frontal de acero inoxidable 304 de alta durabilidad, detección de proximidad ajustable de 4 a 10 cm, indicador LED bicolor (Azul en reposo / Verde en apertura) y relevador con contactos NO/NC/COM apto para alto tráfico comercial, corporativo y hospitalario en Santiago.",
    "price": "RD$ 1,850.00",
    "img": "img/productos/catalogo/boton-salida-notouch.webp",
    "gallery": [
      "img/productos/catalogo/boton-salida-notouch.webp"
    ],
    "specs": [
      "Tecnología: Sensor óptico infrarrojo No Touch (sin contacto físico)",
      "Rango de detección: 4 a 10 cm ajustable",
      "Material: Placa frontal de acero inoxidable SUS 304 resistente a la corrosión",
      "Indicador luminoso: LED Azul (reposo) / Verde (activado)",
      "Salida de contacto: NO / NC / COM conmutado (3A a 36V DC)",
      "Vida útil: Más de 500,000 ciclos continuos de apertura"
    ]
  },
  {
    "id": "redes_cable_utp_cat6_cobre_305m",
    "department": "redes",
    "category": "Cableado Estructurado",
    "brand": "Futunet Redes",
    "title": "Bobina de Cable de Red UTP Cat 6 (305 Metros / 1000 ft) 100% Cobre Puro 23 AWG para Redes y Cámaras",
    "desc": "Bobina de cable de red de 4 pares trenzados UTP Categoría 6 sin blindar en caja dispensadora Easy Pull de 305 metros (1000 pies). Conductores sólidos de 100% cobre electrolítico de calibre 23 AWG con cruceta separadora central que reduce la diafonía (NEXT). Certificado para transmisiones Gigabit Ethernet (1000BASE-T) hasta 250 MHz y soporte total de alimentación remota PoE / PoE+ (IEEE 802.3af/at) para cámaras IP de seguridad, telefonía VoIP y puntos de acceso Wi-Fi 6. Chaqueta de PVC retardante a la llama con metraje marcado secuencialmente para tendidos en oficinas, locales comerciales e industrias de Santiago.",
    "price": "RD$ 8,950.00",
    "img": "img/productos/catalogo/bobina-utp-cat6.webp",
    "gallery": [
      "img/productos/catalogo/bobina-utp-cat6.webp"
    ],
    "specs": [
      "Categoría: UTP Cat 6 (250 MHz) estándar ANSI/TIA-568-C.2 e ISO/IEC 11801",
      "Conductor: 100% Cobre sólido recocido de 23 AWG (cero aleaciones CCA)",
      "Longitud: Caja dispensadora auto-desenrollable de 305 metros (1000 pies)",
      "Estructura interna: Cruceta plástica spline central anti-diafonía (NEXT)",
      "Alimentación PoE: Apto para PoE y PoE+ (IEEE 802.3af/at) sin sobrecalentamiento",
      "Marcaje de metraje: Impresión métrica secuencial decreciente en la chaqueta",
      "Garantía oficial y entrega inmediata en Santiago"
    ]
  },
  {
    "id": "redes_tplink_deco_x20_mesh",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "TP-Link",
    "title": "Sistema Wi-Fi 6 Mesh TP-Link Deco X20 AX1800 (Pack de 2 Unidades) Cobertura Integral",
    "desc": "Sistema Wi-Fi 6 en malla (Mesh) de doble banda TP-Link Deco X20 con velocidades de hasta 1800 Mbps (1201 Mbps en 5 GHz + 574 Mbps en 2.4 GHz). Proporciona cobertura fluida sin cortes de hasta 4,000 pies cuadrados (370 m²) en residencias de varios niveles, villas y oficinas corporativas en Santiago. Equipado con roaming continuo con un solo nombre de red (SSID), 2 puertos Gigabit Ethernet por unidad para backhaul cableado o computadoras, capacidad para más de 150 dispositivos conectados con OFDMA y MU-MIMO, y seguridad avanzada TP-Link HomeShield con control parental.",
    "price": "RD$ 9,850.00",
    "img": "img/productos/catalogo/tplink-deco-x20.webp",
    "gallery": [
      "img/productos/catalogo/tplink-deco-x20.webp"
    ],
    "specs": [
      "Estándar inalámbrico: Wi-Fi 6 IEEE 802.11ax/ac/n/a (5 GHz) y 802.11ax/n/b/g (2.4 GHz)",
      "Velocidad combinada: Hasta 1800 Mbps (AX1800)",
      "Puertos cableados: 2 puertos Gigabit LAN/WAN con detección automática por unidad Deco",
      "Cobertura estimada: Hasta 370 m² (4,000 ft²) con el paquete de 2 unidades",
      "Capacidad multi-dispositivo: Conexión simultánea fluida para más de 150 equipos",
      "Tecnología Mesh: Roaming fluido inteligente 802.11k/v/r y selección automática de ruta",
      "Garantía oficial TP-Link de 2 años y comprobante fiscal NCF"
    ]
  },
  {
    "id": "redes_patch_panel_24p_cat6",
    "department": "redes",
    "category": "Cableado Estructurado",
    "brand": "Futunet Redes",
    "title": "Patch Panel Cat 6 de 24 Puertos 1U para Rack de 19\" con Barra de Gestión Trasera",
    "desc": "Patch panel de 24 puertos RJ45 Categoría 6 estándar de 19 pulgadas (1U) para montaje en racks y gabinetes de telecomunicaciones. Fabricado en acero laminado en frío de alta resistencia con acabado electrostático negro, contactos chapados en oro de 50 micras y bloques de terminación tipo 110/Krone codificados por color según normas T568A y T568B. Incluye barra posterior desmontable para soporte y amarre ordenado de cables UTP, numeración serigrafiada clara y conectores a tierra para instalaciones corporativas e industriales en Santiago.",
    "price": "RD$ 2,950.00",
    "img": "img/productos/catalogo/patch-panel-24p.webp",
    "gallery": [
      "img/productos/catalogo/patch-panel-24p.webp"
    ],
    "specs": [
      "Capacidad: 24 puertos RJ45 Cat 6 sin blindar (1000BASE-T)",
      "Formato de montaje: 1U estándar 19 pulgadas para rack o gabinete de pared",
      "Terminación: Bloques IDC duales tipo 110 y Krone (cable 22 a 26 AWG)",
      "Diagrama de cableado: Normas universales T568A y T568B serigrafiadas",
      "Barra organizadora: Soporte metálico trasero desmontable para alivio de tensión",
      "Chasis: Acero laminado de alta durabilidad con recubrimiento en polvo anticorrosivo"
    ]
  },
  {
    "id": "redes_patch_cord_cat6_2m",
    "department": "redes",
    "category": "Cableado Estructurado",
    "brand": "Futunet Redes",
    "title": "Patch Cord UTP Cat 6 de 2 Metros 100% Cobre con Conectores RJ45 Moldeados",
    "desc": "Cable de parcheo (Patch Cord) de red UTP Categoría 6 de 2 metros (6.6 pies) fabricado con conductores multifilares 100% cobre puro de 24 AWG para máxima flexibilidad y durabilidad en gabinetes y estaciones de trabajo. Conectores RJ45 macho con terminales dorados y bota moldeada con protector de pestaña (snagless) que evita atascos y roturas durante el conexionado en switches y paneles de parcheo en racks de telecomunicaciones.",
    "price": "RD$ 250.00",
    "img": "img/productos/catalogo/patch-cord-cat6.webp",
    "gallery": [
      "img/productos/catalogo/patch-cord-cat6.webp"
    ],
    "specs": [
      "Longitud: 2 metros (6.6 pies)",
      "Categoría: UTP Cat 6 para enlaces Gigabit Ethernet hasta 250 MHz",
      "Conductor: 100% Cobre multifilar 24 AWG de alta flexibilidad",
      "Conectores: RJ45 8P8C con pines dorados de 50 micras",
      "Diseño: Bota moldeada snagless anti-enganche y alivio de tensión",
      "Color: Azul corporativo para rápida identificación en armarios de red"
    ]
  },
  {
    "id": "redes_conectores_rj45_cat6_pack",
    "department": "redes",
    "category": "Cableado Estructurado",
    "brand": "Futunet Redes",
    "title": "Pack de 100 Conectores RJ45 Cat 6 con Botas Protectoras para Cable UTP",
    "desc": "Paquete de 100 conectores modulares RJ45 macho Categoría 6 de alta precisión con 100 botas o capuchones protectores de goma flexible. Diseñados con pines de tres puntas bañados en oro de 50 micras compatibles con conductores sólidos de 23 AWG y multifilares de 24 AWG. Proporcionan inserción fluida, excelente conductividad eléctrica, cero atenuación y protección integral de la lengüeta de fijación para tendidos de red y conexiones de videovigilancia CCTV.",
    "price": "RD$ 1,450.00",
    "img": "img/productos/catalogo/conectores-rj45-cat6.webp",
    "gallery": [
      "img/productos/catalogo/conectores-rj45-cat6.webp"
    ],
    "specs": [
      "Cantidad: 100 conectores RJ45 Cat 6 + 100 botas protectoras",
      "Compatibilidad: Cables UTP Cat 6 (conductores 23 y 24 AWG)",
      "Contactos: Cobre fosforado con baño de oro de 50 micras y 3 puntas",
      "Carcasa: Policarbonato transparente de alto impacto y retardante a la llama",
      "Botas: Goma de alivio de tensión flexible que previene fatiga del cable",
      "Uso: Redes Gigabit Ethernet, cámaras IP PoE y telefonía IP"
    ]
  },
  {
    "id": "cctv_ezviz_c6n_camara_wifi_360",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Ezviz",
    "title": "Cámara Wi-Fi Ezviz C6N 1080p Full HD Pan & Tilt 360° con Visión Nocturna Inteligente y Audio Bidireccional",
    "desc": "Cámara de seguridad inteligente inalámbrica Ezviz C6N con resolución Full HD 1080p y movimiento robotizado Pan & Tilt que ofrece una cobertura panorámica de 360 grados sin puntos ciegos. Cuenta con seguimiento inteligente de movimiento (Smart Tracking), visión nocturna por infrarrojos Smart IR de hasta 10 metros que ajusta automáticamente la intensidad para evitar sobreexposiciones, audio bidireccional en tiempo real con micrófono y altavoz para comunicación remota, modo de privacidad con obturador motorizado y ranura para tarjeta MicroSD de hasta 256 GB. Configuración sencilla en minutos mediante la aplicación Ezviz para teléfonos móviles y compatible con Alexa y Google Assistant.",
    "price": "RD$ 2,350.00",
    "img": "img/productos/catalogo/ezviz-c6n.webp",
    "gallery": [
      "img/productos/catalogo/ezviz-c6n.webp"
    ],
    "specs": [
      "Resolución Full HD 1080p (1920 x 1080) a 15/30 fps con compresión eficiente H.264",
      "Rotación Pan & Tilt motorizada: 340° horizontal y 55° vertical para cobertura 360° total",
      "Seguimiento inteligente (Smart Tracking): sigue automáticamente a personas u objetos en movimiento",
      "Visión nocturna Smart IR de hasta 10 metros (33 pies) con ajuste dinámico de iluminación",
      "Audio bidireccional claro con micrófono con cancelación de ruido y altavoz integrado",
      "Almacenamiento flexible: Ranura para tarjeta MicroSD hasta 256 GB y opción a nube Ezviz CloudPlay",
      "Conectividad Wi-Fi 2.4 GHz y puerto Ethernet RJ45 para conexión por cable de red",
      "Garantía oficial Ezviz de 1 año con soporte local y despacho en Santiago"
    ]
  },
  {
    "id": "cctv_ezviz_h3c_camara_wifi_exterior",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Ezviz",
    "title": "Cámara Wi-Fi Ezviz H3c 1080p para Exterior con Protección IP67 y Detección de Personas con IA",
    "desc": "Cámara de videovigilancia Wi-Fi para intemperie Ezviz H3c con resolución Full HD 1080p, chasis de alta durabilidad con certificación de protección IP67 contra lluvia, polvo y calor extremo de Santiago. Equipada con algoritmo de inteligencia artificial integrado que distingue con precisión siluetas de personas frente a mascotas u hojas en movimiento reduciendo falsas alarmas, visión nocturna por infrarrojos nítida de hasta 30 metros, antena Wi-Fi dual de largo alcance que atraviesa paredes, micrófono con captación nítida de audio hasta 5 metros y ranura MicroSD hasta 512 GB.",
    "price": "RD$ 2,850.00",
    "img": "img/productos/catalogo/ezviz-h3c.webp",
    "gallery": [
      "img/productos/catalogo/ezviz-h3c.webp"
    ],
    "specs": [
      "Resolución Full HD 1080p (1920 x 1080) con tecnología de imagen de alta fidelidad",
      "Certificación IP67 a prueba de intemperie: resistente a fuertes lluvias, sol y tormentas",
      "Detección inteligente de personas basada en IA para alertas precisas al teléfono",
      "Visión nocturna por infrarrojos de largo alcance de hasta 30 metros (98 pies)",
      "Micrófono con cancelación de ruido ambiental con alcance de captación de hasta 5 metros",
      "Antena Wi-Fi dual de alta ganancia con transmisión estable a través de muros",
      "Ranura para tarjeta MicroSD de hasta 512 GB y compresión H.265 para maximizar espacio",
      "Garantía oficial Ezviz de 1 año con factura con comprobante fiscal NCF"
    ]
  },
  {
    "id": "redes_crimpadora_rj45_tester_kit",
    "department": "redes",
    "category": "Cableado Estructurado",
    "brand": "Futunet Redes",
    "title": "Kit de Herramientas de Red: Crimpadora RJ45/RJ11 Multifunción con Pelacables y Tester de Cable de Red",
    "desc": "Kit profesional de herramientas de red indispensable para instaladores, técnicos de cableado estructurado y CCTV. Incluye tenaza crimpadora multifunción de alta resistencia para conectores modulares RJ45 (8P8C) y RJ11/RJ12 (6P6C/6P4C/6P2C) con cuchilla de corte y pelador integrado de cable UTP/STP, más probador (tester) de cable de red maestro y remoto desmontable con indicador LED secuencial del 1 al 8 y masa (G) para verificación inmediata de continuidad, cortocircuitos, pares cruzados y circuito abierto.",
    "price": "RD$ 1,850.00",
    "img": "img/productos/catalogo/crimpadora-tester-kit.webp",
    "gallery": [
      "img/productos/catalogo/crimpadora-tester-kit.webp"
    ],
    "specs": [
      "Crimpadora 3 en 1 para conectores RJ45 (8P8C), RJ11 (6P4C) y RJ12 (6P6C)",
      "Cuchillas de acero templado para corte limpio y pelado rápido de cables UTP/STP Cat 5e / Cat 6",
      "Tester de red maestro y remoto desmontable para pruebas de cables en pared o racks distantes",
      "Diagnóstico instantáneo: continuidad de hilos, cables cruzados, circuitos abiertos y cortocircuitos",
      "Indicadores LED luminosos numerados del 1 al 8 y tierra (G) para escaneo automático",
      "Incluye herramienta pelacables mini de impacto y estuche compacto",
      "Garantía oficial Futunet de 1 año con soporte técnico y facturación formal NCF"
    ]
  },
  {
    "id": "redes_mikrotik_hex_rb750gr3",
    "department": "redes",
    "category": "Enrutadores y Balanceadores",
    "brand": "MikroTik",
    "title": "Router MikroTik hEX RB750Gr3 Gigabit Ethernet 5 Puertos con RouterOS L4 (Balanceador Multi-WAN)",
    "desc": "Router Gigabit Ethernet compacto de alta potencia MikroTik hEX (RB750Gr3) equipado con procesador Dual-Core de 880 MHz (4 hilos), 256 MB de memoria RAM, 5 puertos Gigabit Ethernet 10/100/1000 Mbps, ranura para memoria MicroSD y puerto USB de tamaño completo. Incluye licencia oficial RouterOS Nivel 4 con capacidades avanzadas para balanceo de carga multi-WAN (PCC), failover automático para múltiples líneas de fibra óptica (Claro / Altice), servidor y cliente VPN (WireGuard, OpenVPN, IPsec con aceleración por hardware), firewall de filtrado de paquetes y limitación de ancho de banda por IP o departamento. Ideal para pequeñas y medianas empresas, proveedores WISP y administradores de red en Santiago.",
    "price": "RD$ 4,850.00",
    "img": "img/productos/catalogo/mikrotik-hex-rb750gr3.webp",
    "gallery": [
      "img/productos/catalogo/mikrotik-hex-rb750gr3.webp"
    ],
    "specs": [
      "5 puertos Gigabit Ethernet 10/100/1000 Mbps con soporte Auto-MDI/X",
      "Procesador MediaTek Dual-Core MT7621A a 880 MHz (4 hilos) con aceleración de cifrado IPsec por hardware (~470 Mbps)",
      "Memoria RAM de 256 MB y almacenamiento flash de 16 MB con ranura MicroSD para logs y caché",
      "Sistema operativo RouterOS v7 con licencia Nivel 4 completa y soporte de actualizaciones continuas",
      "Capacidad Multi-WAN: Balanceo de carga PCC (Per Connection Classifier), bonding y failover automático",
      "Puerto USB 2.0 tipo A para conexión de módem 4G/LTE de respaldo o almacenamiento externo",
      "Alimentación versátil: Jack DC (8-30V) o entrada PoE Pasivo en puerto 1 (adaptador 24V incluido)",
      "Garantía oficial MikroTik de 1 año con soporte técnico local y factura con NCF en Santiago"
    ]
  },
  {
    "id": "oficina_logitech_mk270_combo_inalambrico",
    "department": "oficina",
    "category": "Periféricos y Accesorios",
    "brand": "Logitech",
    "title": "Combo Teclado y Mouse Inalámbrico Logitech MK270 con Receptor USB 2.4 GHz para Oficina",
    "desc": "Combo inalámbrico confiable y duradero Logitech MK270 que combina un teclado de tamaño normal y un mouse óptico compacto y ergonómico. Conexión inalámbrica avanzada de 2.4 GHz sin retrasos ni interferencias con alcance de hasta 10 metros mediante un único nano-receptor USB \"conectar y olvidar\". El teclado incorpora distribución en español con teclado numérico completo, 8 teclas de acceso rápido multimedia, diseño resistente a salpicaduras y patas inclinables ajustables. El mouse ambidiestro ofrece seguimiento óptico fluido y suave. Eficiencia energética de clase mundial con hasta 36 meses de duración de batería en el teclado y 12 meses en el mouse con interruptor de encendido/apagado.",
    "price": "RD$ 1,950.00",
    "img": "img/productos/catalogo/logitech-mk270.webp",
    "gallery": [
      "img/productos/catalogo/logitech-mk270.webp"
    ],
    "specs": [
      "Conexión inalámbrica fiable de 2.4 GHz de largo alcance (hasta 10 metros) sin retardos ni pérdidas de señal",
      "Receptor USB Nano único \"Plug and Play\" que vincula simultáneamente el teclado y el mouse",
      "Teclado de tamaño completo con teclado numérico integrado y 8 teclas de acceso rápido para control multimedia y volumen",
      "Diseño resistente a derrames accidentales de líquidos con canales de drenaje y patas inclinables ajustables",
      "Mouse inalámbrico contorneado de diseño ambidiestro con sensor óptico de 1000 DPI de alta precisión",
      "Extraordinaria autonomía: hasta 36 meses en el teclado (2 baterías AAA) y hasta 12 meses en el mouse (1 batería AA)",
      "Compatible con Windows 10/11, macOS, ChromeOS y Linux sin necesidad de controladores adicionales",
      "Garantía oficial Logitech de 1 año con comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "oficina_logitech_c920_webcam_hd_pro",
    "department": "oficina",
    "category": "Equipos de Oficina",
    "brand": "Logitech",
    "title": "Cámara Web Logitech C920 HD Pro 1080p con Micrófono Estéreo Dual y Corrección de Luz para Videoconferencias",
    "desc": "Cámara web profesional Logitech C920 HD Pro con resolución Full HD 1080p a 30 fps para videollamadas nítidas y fluidas en plataformas corporativas como Zoom, Microsoft Teams, Google Meet y Skype. Cuenta con lente de cristal de cinco elementos Full HD con enfoque automático de alta precisión, campo visual diagonal de 78 grados ideal para encuadrar a una o dos personas, corrección automática de iluminación RightLight 2 que ajusta los niveles de brillo y contraste en salas poco iluminadas, y dos micrófonos omnidireccionales integrados a cada lado para capturar audio estéreo natural con reducción de ruido de fondo. Incluye clip universal con rosca para trípode estándar.",
    "price": "RD$ 5,400.00",
    "img": "img/productos/catalogo/logitech-c920.webp",
    "gallery": [
      "img/productos/catalogo/logitech-c920.webp"
    ],
    "specs": [
      "Resolución de video Full HD 1080p (1920 x 1080) a 30 fps y HD 720p a 60/30 fps",
      "Lente de cristal Full HD de 5 elementos con enfoque automático suave y preciso (Autofocus)",
      "Campo visual diagonal (dFOV) de 78° que ofrece un encuadre amplio y profesional para salas y oficinas",
      "Tecnología RightLight 2 para ajuste automático de luz en condiciones de iluminación deficiente o contraluz",
      "Dos micrófonos estéreo omnidireccionales con reducción de ruido ambiental para transmisión de voz transparente",
      "Clip de montaje universal adaptable a pantallas de laptops, monitores LCD y trípodes estándar (rosca 1/4 pulgada)",
      "Conexión directa USB-A Plug and Play con cable de 1.5 metros compatible con Windows, macOS y ChromeOS",
      "Garantía oficial Logitech de 1 año con respaldo técnico y comprobante fiscal NCF"
    ]
  },
  {
    "id": "oficina_laptop_lenovo_thinkpad_l14",
    "department": "oficina",
    "category": "Laptops y Portátiles",
    "brand": "Lenovo",
    "title": "Laptop Lenovo ThinkPad L14 14\" Full HD Core i5 16GB RAM 256GB SSD NVMe Corporativa",
    "desc": "Laptop empresarial de máxima durabilidad Lenovo ThinkPad L14 diseñada para resistir las exigencias del entorno de trabajo corporativo y móvil. Equipada con procesador Intel Core i5 de alta velocidad, 16 GB de memoria RAM DDR4 para multitarea fluida, unidad de almacenamiento de estado sólido de 256 GB SSD NVMe de respuesta inmediata y pantalla antirreflejo de 14 pulgadas Full HD IPS (1920x1080). Incorpora el legendario teclado ergonómico ThinkPad resistente a salpicaduras con botón de navegación TrackPoint, lector de huellas dactilares para inicio de sesión seguro, cámara web HD con obturador de privacidad ThinkShutter y certificación de grado militar MIL-STD-810H contra golpes, caídas y temperaturas extremas. Sistema operativo Windows 11 Pro en español con garantía oficial y comprobante fiscal NCF.",
    "price": "RD$ 26,850.00",
    "img": "img/productos/catalogo/lenovo-thinkpad-l14.webp",
    "gallery": [
      "img/productos/catalogo/lenovo-thinkpad-l14.webp"
    ],
    "specs": [
      "Procesador: Intel Core i5 Quad-Core con tecnología Intel Turbo Boost",
      "Memoria RAM: 16 GB DDR4 a 3200 MHz para multitarea intensiva y software contable",
      "Almacenamiento: Unidad de estado sólido de 256 GB SSD M.2 NVMe PCIe",
      "Pantalla: 14.0 pulgadas Full HD IPS (1920x1080) antirreflejo de amplio ángulo de visión",
      "Teclado ThinkPad ergonómico con TrackPoint central resistente a derrames accidentales",
      "Seguridad y privacidad: Lector de huellas dactilares y obturador ThinkShutter en webcam",
      "Conectividad completa: Puertos USB-C con Power Delivery, USB 3.2, HDMI, RJ45 Ethernet y Wi-Fi 6",
      "Garantía corporativa Futunet de 1 año y comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "redes_switch_netgear_gs308_8p",
    "department": "redes",
    "category": "Switches y Enrutadores",
    "brand": "Netgear",
    "title": "Switch Netgear GS308 Gigabit Ethernet 8 Puertos Metálico Plug & Play Fanless",
    "desc": "Switch de red no administrable Netgear GS308 Gigabit Ethernet de 8 puertos 10/100/1000 Mbps en chasis metálico compacto de escritorio o montaje en pared. Ofrece conectividad de red Gigabit de alta velocidad para conectar computadoras, impresoras de red, cámaras IP, consolas y dispositivos de almacenamiento NAS en oficinas y pymes de Santiago. Arquitectura de conmutación sin bloqueo con rendimiento de hasta 16 Gbps que transfiere y filtra paquetes a la máxima velocidad del cable. Funcionamiento 100% silencioso sin ventilador (diseño Fanless), auto-negociación en todos los puertos, soporte Auto-MDI/MDIX (sin necesidad de cables cruzados) y tecnología ecológica IEEE 802.3az que reduce el consumo de energía eléctrica.",
    "price": "RD$ 2,250.00",
    "img": "img/productos/catalogo/netgear-gs308.webp",
    "gallery": [
      "img/productos/catalogo/netgear-gs308.webp"
    ],
    "specs": [
      "8 puertos Gigabit Ethernet RJ-45 de detección automática 10/100/1000 Mbps",
      "Chasis robusto en acero metálico resistente con soporte para escritorio o anclaje mural",
      "Configuración Plug and Play inmediata: sin software, configuración ni instalación previa",
      "Diseño Fanless silencioso: cero ruido de funcionamiento, ideal para escritorios y salas de reuniones",
      "Arquitectura sin bloqueo: ancho de banda de reenvío de 16 Gbps",
      "Eficiencia energética IEEE 802.3az para bajo consumo eléctrico",
      "Garantía oficial Netgear de 2 años y comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "energia_ups_apc_schneider_bv1000",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Schneider Electric",
    "title": "Sistema UPS APC Easy UPS BV1000I-MS 1000VA / 600W con Regulación AVR Schneider Electric",
    "desc": "Sistema de alimentación ininterrumpida (UPS) interactivo APC Easy UPS BV1000I-MS de 1000VA / 600W de Schneider Electric diseñado para brindar protección eléctrica de alta confiabilidad en hogares, oficinas y puestos de trabajo en Santiago. Proporciona respaldo de batería y regulación automática de voltaje (AVR con corrección de caídas de tensión Boost and Trim) protegiendo computadoras, servidores, sistemas POS, routers de fibra óptica y equipos electrónicos sensibles contra apagones, sobretensiones y fluctuaciones bruscas de energía de la red. Cuenta con 4 tomas de salida universales tipo Schuko/NEMA protegidas con respaldo de batería y supresión de picos, arranque en frío (Cold-Start) para encender cargas con batería sin suministro eléctrico y orificios para montaje mural.",
    "price": "RD$ 5,950.00",
    "img": "img/productos/catalogo/apc-schneider-bv1000.webp",
    "gallery": [
      "img/productos/catalogo/apc-schneider-bv1000.webp"
    ],
    "specs": [
      "Capacidad de potencia: 1000 VA / 600 Watts de respaldo continuo",
      "Regulación automática de voltaje (AVR): corrige caídas y subidas de tensión sin agotar la batería",
      "4 tomas de salida universales protegidas con batería y supresión de sobretensiones",
      "Protección contra picos eléctricos, rayos y ruido electromagnético de red",
      "Función Cold-Start: encendido del UPS y dispositivos conectados usando solo batería",
      "Diseño estilizado con orificios posteriores para montaje seguro en pared",
      "Garantía oficial de 2 años de Schneider Electric / APC con soporte local Futunet"
    ]
  },
  {
    "id": "redes_linksys_hydra_pro_6",
    "department": "redes",
    "category": "Enrutadores y Balanceadores",
    "brand": "Linksys",
    "title": "Router Wi-Fi 6 Linksys Hydra Pro 6 AX5400 Doble Banda con Malla Intelligent Mesh",
    "desc": "Router Wi-Fi 6 de ultra alto rendimiento Linksys Hydra Pro 6 con velocidades combinadas de hasta 5.4 Gbps (AX5400) y canales ultra anchos de 160 MHz. Proporciona cobertura inalámbrica de hasta 2,700 pies cuadrados (250 m²) para más de 30 dispositivos concurrentes sin latencia en streaming 4K/8K, videoconferencias corporativas y transferencias de gran volumen. Equipado con procesador Qualcomm Dual-Core de 1 GHz, 4 puertos Gigabit Ethernet LAN más 1 puerto Gigabit WAN para conexiones de fibra óptica de alta velocidad, puerto USB 3.0 para almacenamiento en red compartida y tecnología Intelligent Mesh que permite expandir la red con cualquier nodo Linksys compatible. Configuración fácil y segura desde la aplicación Linksys App con control parental y cifrado WPA3.",
    "price": "RD$ 8,950.00",
    "img": "img/productos/catalogo/linksys-hydra-pro6.webp",
    "gallery": [
      "img/productos/catalogo/linksys-hydra-pro6.webp"
    ],
    "specs": [
      "Estándar Wi-Fi 6: 802.11ax con canales de 160 MHz para máxima velocidad de enlace",
      "Velocidad total AX5400: hasta 4804 Mbps en 5 GHz + 574 Mbps en 2.4 GHz",
      "Cobertura estimada: hasta 250 m² (2,700 sq ft) para más de 30 equipos simultáneos",
      "Puertos: 1 Gigabit WAN + 4 Gigabit LAN con negociación automática 10/100/1000 Mbps",
      "Puerto USB 3.0 para compartir discos duros e impresoras en red local",
      "Tecnología Intelligent Mesh escalable y administración remota desde app móvil",
      "Garantía oficial Linksys de 2 años con comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "energia_victron_multiplus_24_3000_70",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Victron Energy",
    "title": "Inversor/Cargador Victron Energy MultiPlus 24/3000/70 Senoidal Puro 24V 3000VA con Función UPS",
    "desc": "Inversor y cargador de grado industrial Victron Energy MultiPlus 24/3000/70 con salida de onda senoidal pura de 3000 VA (2400 W continuo, pico de 6000 W) y cargador adaptativo de 4 etapas de 70A para bancos de baterías de 24V (LiFePO4, Gel, AGM y plomo-ácido). Integra conmutador de transferencia ultrarrápido de menos de 20 milisegundos con función UPS ininterrumpida para servidores, telecomunicaciones y sistemas críticos. Cuenta con tecnología exclusiva PowerAssist que previene la sobrecarga de generadores o inversores limitados añadiendo potencia instantánea de la batería, doble salida de CA para cargas críticas y no críticas, y puerto de comunicación VE.Bus para monitoreo local o remoto mediante Cerbo GX y portal VRM. Diseñado para instalaciones solares, comerciales y residenciales de alta exigencia en República Dominicana.",
    "price": "RD$ 68,500.00",
    "img": "img/productos/catalogo/victron-multiplus-24v.webp",
    "gallery": [
      "img/productos/catalogo/victron-multiplus-24v.webp"
    ],
    "specs": [
      "Potencia nominal continua: 3000 VA / 2400 Watts a 25°C (pico máximo de 6000 W)",
      "Voltaje de banco de baterías: 24V DC con cargador inteligente adaptativo de 70A",
      "Función UPS ultrarrápida: transferencia de red a batería en menos de 20 ms sin reinicios",
      "Tecnología PowerAssist: previene sobrecargas eléctricas suplementando potencia desde baterías",
      "Onda senoidal pura certificada apta para motores, aires acondicionados, servidores y audio",
      "Puerto de comunicación VE.Bus para integración con Cerbo GX, pantallas y portal VRM",
      "Garantía oficial Victron Energy de 5 años con respaldo técnico en Santiago"
    ]
  },
  {
    "id": "seguridad_paradox_spectra_sp4000_kit",
    "department": "seguridad",
    "category": "Sistemas de Seguridad CCTV",
    "brand": "Paradox",
    "title": "Kit de Alarma Contra Intrusión Paradox Spectra SP4000 con Teclado LCD K32+ y Sensor PIR Antimascota",
    "desc": "Sistema integral de seguridad electrónica y alarma contra intrusiones Paradox Spectra SP4000 de 4 a 32 zonas cableadas e inalámbricas. El kit incluye central de alarma Paradox SP4000 en gabinete metálico reforzado con cerradura, transformador de 16.5V AC, teclado de supervisión LCD Paradox K32+ en español con retroiluminación azul y visualización en tiempo real de zonas abiertas, detector de movimiento infrarrojo digital antimascota Paradox NV5 de alta inmunidad a falsas alarmas, batería sellada de respaldo de 12V 7Ah para autonomía ante cortes eléctricos y potente sirena de 30 Watts con doble tono disuasivo. Diseñado para protección perimetral e interior de comercios, almacenes, industrias y residencias en Santiago.",
    "price": "RD$ 11,850.00",
    "img": "img/productos/catalogo/paradox-spectra-sp4000.webp",
    "gallery": [
      "img/productos/catalogo/paradox-spectra-sp4000.webp"
    ],
    "specs": [
      "Central de alarma Paradox Spectra SP4000 de 4 zonas en placa (expandible hasta 32 zonas)",
      "Teclado LCD de 32 zonas Paradox K32+ con menú en español y teclas de pánico directo",
      "Sensor de movimiento digital Paradox NV5 con lente híbrido cilíndrico-esférico e inmunidad pet",
      "Batería de respaldo recargable de 12V / 7Ah para operación ininterrumpida ante apagones",
      "Sirena exterior/interior de 30W y 118 dB con gabinete de protección y tamper antisabotaje",
      "Comunicación hacia central de monitoreo o llamada telefónica de alerta inmediata",
      "Garantía oficial Paradox de 1 año con asesoría técnica de instalación en Santiago"
    ]
  },
  {
    "id": "oficina_panasonic_kx_hdv130_telefono_ip",
    "department": "oficina",
    "category": "Equipos de Oficina",
    "brand": "Panasonic",
    "title": "Teléfono IP Panasonic KX-HDV130B de 2 Líneas SIP con Audio HD y Pantalla LCD Retroiluminada PoE",
    "desc": "Teléfono de escritorio IP estándar Panasonic KX-HDV130B diseñado para entornos empresariales, recepciones, consultorios médicos y despachos en Santiago. Cuenta con soporte para 2 cuentas SIP, audio de banda ancha HD Sonic (G.722) para máxima claridad de voz, pantalla gráfica LCD de 2.3 pulgadas retroiluminada de 132x64 píxeles, 2 puertos Fast Ethernet 10/100 con alimentación PoE integrada (IEEE 802.3af), altavoz manos libres full dúplex, directorio local para 500 contactos e indicador LED de mensaje en espera / llamada entrante. Compatible con servidores de telefonía IP Asterisk, FreePBX, conmutadores Panasonic KX-NS500 y centrales PBX virtuales.",
    "price": "RD$ 4,950.00",
    "img": "img/productos/catalogo/panasonic-kx-hdv130.webp",
    "gallery": [
      "img/productos/catalogo/panasonic-kx-hdv130.webp"
    ],
    "specs": [
      "Soporte de telefonía IP: 2 líneas SIP y 2 puertos Fast Ethernet 10/100 Mbps",
      "Audio HD de alta definición: Códec de banda ancha G.722 y altavoz manos libres full dúplex",
      "Alimentación: PoE integrado (Power over Ethernet) o adaptador de corriente CA opcional",
      "Pantalla: LCD monocromática retroiluminada de 2.3 pulgadas con contraste regulable",
      "Funciones PBX: Transferencia de llamada, conferencia a 3 vías, retención, desvío y llamada en espera",
      "Directorio telefónico: Capacidad de hasta 500 registros y registro de últimas 30 llamadas",
      "Garantía oficial Panasonic de 1 año con soporte técnico y factura formal con NCF"
    ]
  },
  {
    "id": "energia_mitsubishi_msz_gl18_aire_inverter",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Mitsubishi",
    "title": "Aire Acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 18,000 BTU Ultra Silencioso 24.6 SEER",
    "desc": "Sistema de aire acondicionado Mini-Split de ultra alta eficiencia Mitsubishi Electric MSZ-GL18NA de 18,000 BTU (1.5 Toneladas) con tecnología Inverter PAM de compresor de velocidad variable y certificación hasta 24.6 SEER. Diseñado para climatización continua y exigente de cuartos de servidores (data centers), oficinas gerenciales y residencias en Santiago, asegurando un ahorro de hasta el 40% en consumo eléctrico comercial. Cuenta con funcionamiento ultra silencioso Whisper Quiet de solo 19 dB, filtro purificador Nano Platinum con enzimas antibacteriales y desodorizantes, control de flujo Smart Set y compatibilidad con monitoreo Wi-Fi Kumo Cloud. Utiliza refrigerante ecológico R410A.",
    "price": "RD$ 54,900.00",
    "img": "img/productos/catalogo/mitsubishi-msz-gl18.webp",
    "gallery": [
      "img/productos/catalogo/mitsubishi-msz-gl18.webp"
    ],
    "specs": [
      "Capacidad de enfriamiento: 18,000 BTU/h (1.5 Toneladas de refrigeración)",
      "Eficiencia energética superior: Calificación hasta 24.6 SEER y certificación Energy Star",
      "Tecnología Inverter PAM: Ajuste continuo de velocidad del compresor para mínimo consumo de energía",
      "Operación ultra silenciosa: Nivel sonoro Whisper Quiet desde 19 dB(A) para máxima concentración",
      "Filtro purificador avanzado: Filtro Nano Platinum lavable que absorbe polvos, bacterias y alérgenos",
      "Refrigerante ecológico R410A precargado de fábrica con protección anticorrosiva Blue Fin",
      "Garantía de 5 años en compresor y 1 año en piezas con instalación técnica certificada en Santiago"
    ]
  },
  {
    "id": "redes_juniper_ex2300_24p_switch",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Juniper",
    "title": "Switch Empresarial Juniper Networks EX2300-24P Gigabit Ethernet 24 Puertos PoE+ con 4 Uplinks 10GbE SFP+",
    "desc": "Switch administrable de acceso y distribución empresarial de grado carrier Juniper Networks EX2300-24P. Cuenta con 24 puertos Gigabit Ethernet 10/100/1000Base-T con soporte PoE+ (Power over Ethernet IEEE 802.3at) y presupuesto de potencia total de 370 Watts para alimentar teléfonos IP, cámaras CCTV 4K y puntos de acceso Wi-Fi 6 de alta densidad. Incorpora 4 puertos de enlace ascendente (uplink) fijos SFP+ de 10 GbE para interconexión a troncales de fibra óptica o data centers a 10 Gbps. Impulsado por el sistema operativo Junos OS, tecnología Virtual Chassis que permite gestionar hasta 4 switches como un solo dispositivo lógico, enrutamiento L2/L3 avanzado (RIP, OSPF) y conmutación de paquetes sin bloqueo con ancho de banda de 128 Gbps.",
    "price": "RD$ 48,500.00",
    "img": "img/productos/catalogo/juniper-ex2300-24p.webp",
    "gallery": [
      "img/productos/catalogo/juniper-ex2300-24p.webp"
    ],
    "specs": [
      "24 puertos Gigabit 10/100/1000Base-T PoE+ con presupuesto de potencia total de 370W",
      "4 puertos uplink SFP/SFP+ fijos de 10 Gbps para enlaces de fibra óptica de alta velocidad",
      "Capacidad de conmutación: 128 Gbps sin bloqueo y tasa de reenvío de 95 Mpps",
      "Sistema operativo Junos OS: Misma base de código y consistencia de enrutamiento que routers carrier-grade",
      "Tecnología Virtual Chassis: Gestión centralizada de hasta 4 switches interconectados en un solo plano lógico",
      "Enrutamiento estático y dinámico Layer 2 y Layer 3 con soporte IPv4/IPv6, ACLs y 802.1X",
      "Garantía de por vida limitada (Enhanced Limited Lifetime Warranty) y comprobante fiscal NCF en Santiago"
    ]
  },
  {
    "id": "energia_siemens_breaker_industrial_sentron_3p",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Siemens",
    "title": "Interruptor Termomagnético Industrial Siemens Sentron 3 Polos 100A Protección Eléctrica de Tableros",
    "desc": "Interruptor automático en caja moldeada / riel DIN industrial Siemens Sentron de 3 polos (3P) y capacidad nominal de 100 Amperios para protección eléctrica de acometidas comerciales, salas de servidores, bancos de condensadores y tableros de distribución en Santiago. Diseñado para soportar capacidades de interrupción de cortocircuito de hasta 25 kA a 415V/480V con mecanismo de disparo térmico-magnético de alta precisión (calibración fija contra sobrecargas y disparo instantáneo magnético). Cumple con las exigencias de las normas internacionales IEC/EN 60947-2 y UL 489, garantizando máxima continuidad de servicio y seguridad operativa ante fallas eléctricas severas.",
    "price": "RD$ 12,900.00",
    "img": "img/productos/catalogo/siemens-breaker-sentron.webp",
    "gallery": [
      "img/productos/catalogo/siemens-breaker-sentron.webp"
    ],
    "specs": [
      "Configuración: Tripolar (3 Polos / 3P) para sistemas trifásicos industriales",
      "Corriente nominal: 100 Amperios (In) continua para tableros de potencia",
      "Capacidad de corte en cortocircuito: Hasta 25 kA a 415V/480V AC según IEC 60947-2",
      "Disparo térmico y magnético calibrado para respuesta ultrarrápida ante fallas",
      "Montaje estándar en riel DIN / placa de montaje en gabinete metálico de distribución",
      "Contactos de aleación de plata resistentes al arco eléctrico con larga vida útil",
      "Garantía oficial Siemens de 2 años con soporte técnico especializado y factura con NCF"
    ]
  },
  {
    "id": "energia_tesla_powerwall_2_bateria_solar",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Tesla",
    "title": "Sistema de Batería de Respaldo Residencial y Comercial Tesla Powerwall 2 (13.5 kWh) con Backup Gateway",
    "desc": "Sistema avanzado de almacenamiento y respaldo energético residencial y comercial Tesla Powerwall 2 con capacidad útil de 13.5 kWh de iones de litio y Backup Gateway 2 para conmutación automática ante cortes del tendido eléctrico sin parpadeo. Entrega potencia continua de 5 kW (hasta 7 kW de potencia pico) e integra inversor bidireccional AC acoplado, compatible con cualquier instalación solar existente o recarga directa de la red comercial. Monitoreo inteligente en tiempo real de consumo, generación y reserva de energía a través de la aplicación móvil Tesla. Diseñado con refrigeración líquida térmica y chasis con certificación IP67 para instalación en interiores o exteriores protegidos.",
    "price": "Cotizar",
    "img": "img/productos/catalogo/tesla-powerwall-2.webp",
    "gallery": [
      "img/productos/catalogo/tesla-powerwall-2.webp"
    ],
    "specs": [
      "Capacidad de almacenamiento utilizable: 13.5 kWh con profundidad de descarga (DoD) del 100%",
      "Potencia de salida continua: 5.0 kW (pico de 7.0 kW durante 10 segundos)",
      "Inversor integrado AC acoplado con eficiencia de ciclo completo (Round-Trip) del 90%",
      "Tesla Backup Gateway 2: Detección instantánea de corte y transición a respaldo en milisegundos",
      "Monitoreo inteligente en tiempo real vía app Tesla con modos de autoconsumo y respaldo",
      "Construcción resistente al clima con refrigeración líquida interna y protección IP67",
      "Garantía de fábrica de 10 años con soporte técnico e instalación certificada en Santiago"
    ]
  },
  {
    "id": "computo_dell_poweredge_t150_servidor",
    "department": "equipos",
    "category": "Equipos de Oficina y Cómputo",
    "brand": "DELL",
    "title": "Servidor en Torre Dell PowerEdge T150 Intel Xeon E-2314 32GB RAM ECC 2x2TB RAID 1 iDRAC9",
    "desc": "Servidor en torre empresarial Dell PowerEdge T150 diseñado para centros de datos empresariales, consultorios clínicos, cooperativas, industrias en zonas francas y firmas corporativas en Santiago. Equipado con procesador Intel Xeon E-2314 Quad-Core de 2.80 GHz (hasta 4.50 GHz Turbo, 8 MB Cache), 32 GB de memoria RAM DDR4 a 3200 MT/s ECC UDIMM con corrección de errores para máxima estabilidad operativa continua 24/7 sin caídas de sistema. Incluye arreglo de almacenamiento redundante con 2 discos duros mecánicos empresariales de 2 TB SATA de 7.2K RPM configurados en RAID 1 (espejo con tolerancia a fallos de disco), controladora RAID PERC H355 de hardware, tarjeta de gestión remota fuera de banda iDRAC9 Basic para monitoreo de salud del servidor y reinicio remoto, y fuente de alimentación cableada de 300W con certificación 80 PLUS Bronze. Compatible con Windows Server 2022/2025, VMware ESXi, Proxmox VE, Ubuntu Server y plataformas ERP de facturación y bases de datos SQL.",
    "price": "RD$ 89,500.00",
    "img": "img/productos/catalogo/dell-poweredge-t150.webp",
    "gallery": [
      "img/productos/catalogo/dell-poweredge-t150.webp"
    ],
    "specs": [
      "Procesador de servidor: Intel Xeon E-2314 Quad-Core 4 hilos a 2.8 GHz (Turbo 4.5 GHz, 8 MB Caché)",
      "Memoria del sistema: 32 GB DDR4 3200 MT/s ECC UDIMM con protección contra corrupción de datos",
      "Almacenamiento redundante: 2 discos duros empresariales de 2 TB SATA 3.5\" (4 TB brutos, 2 TB útiles en RAID 1)",
      "Controladora RAID: PERC H355 por hardware con soporte de RAID 0, 1 y 10 para máxima velocidad y seguridad",
      "Administración remota: iDRAC9 Basic con interfaz web HTML5 para encendido, apagado y telemetría remota",
      "Conectividad de red: 2 puertos Gigabit Ethernet 10/100/1000 Mbps integrados con soporte LACP y balanceo",
      "Garantía corporativa Dell ProSupport de 3 años en sitio e incluye comprobante fiscal formal con NCF"
    ]
  },
  {
    "id": "redes_ont_gpon_wifi6_terminal_optica",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "TP-Link",
    "title": "Terminal Óptica ONT GPON Wi-Fi 6 AX1800 Doble Banda con 4 Puertos Gigabit SC/APC y Puerto FXS VoIP",
    "desc": "Terminal de red óptica (ONT/ONU) de nueva generación TP-Link GPON Wi-Fi 6 AX1800 diseñada para enlaces residenciales y corporativos de fibra óptica FTTH de alta velocidad de Futunet en Santiago. Incorpora estándar Wi-Fi 6 (802.11ax) de doble banda simultánea con velocidades de hasta 1201 Mbps en la banda de 5 GHz y 574 Mbps en 2.4 GHz, tecnología OFDMA y MU-MIMO 2x2 para conectar más de 64 dispositivos sin saturación. Cuenta con 1 puerto óptico GPON SC/APC clase B+ (recepción 1490nm / transmisión 1310nm) con velocidad downstream de hasta 2.488 Gbps, 4 puertos Gigabit Ethernet LAN 10/100/1000 Mbps para computadoras y consolas, 1 puerto telefónico RJ11 FXS para llamadas de telefonía IP VoIP y antenas omnidireccionales de alta ganancia de 5 dBi con Beamforming. Compatible con OLTs estándar ITU-T G.984.",
    "price": "RD$ 4,850.00",
    "img": "img/productos/catalogo/tplink-ont-gpon-wifi6.webp",
    "gallery": [
      "img/productos/catalogo/tplink-ont-gpon-wifi6.webp"
    ],
    "specs": [
      "Puerto óptico GPON: 1 puerto SC/APC estándar ITU-T G.984.1/.2/.3/.4 con alcance de hasta 20 km",
      "Conectividad Wi-Fi 6 ultrarrápida: Doble banda AX1800 (1201 Mbps en 5 GHz + 574 Mbps en 2.4 GHz)",
      "Puertos cableados: 4 puertos Gigabit Ethernet LAN 10/100/1000 Mbps para conexión directa sin latencia",
      "Telefonía sobre IP: 1 puerto telefónico RJ11 FXS con soporte de protocolos SIP y códecs G.711/G.729",
      "Tecnología de señal avanzada: 4 antenas de 5 dBi con Beamforming, EasyMesh y cifrado de seguridad WPA3",
      "Gestión y aprovisionamiento: OMCI remoto, TR-069 y consola web intuitiva en español",
      "Garantía oficial de 2 años con reemplazo local inmediato y soporte técnico de fibra óptica en Santiago"
    ]
  },
  {
    "id": "seguridad_camara_solar_4g_autonoma",
    "department": "seguridad",
    "category": "Seguridad y Vigilancia",
    "brand": "Hikvision",
    "title": "Cámara de Seguridad Solar 4G LTE Autónoma con Batería de Litio y Sensor PIR Exterior IP66",
    "desc": "Cámara de videovigilancia 100% inalámbrica y autónoma Hikvision con panel solar fotovoltaico integrado de alta eficiencia y batería recargable de litio de gran capacidad. Diseñada especialmente para fincas agrícolas, obras de construcción, casas de campo, naves industriales y terrenos en Santiago y la región del Cibao donde no existe suministro eléctrico ni conexión a internet cableada. Integra módem celular 4G LTE compatible con tarjetas SIM de Claro, Altice y Viva para transmisión en vivo a través de la app móvil Hik-Connect. Equipada con sensor de imagen Full HD 1080p, sensor infrarrojo pasivo PIR para detección precisa de personas sin falsas alarmas, visión nocturna inteligente a color con reflectores LED blancos y alcance infrarrojo de 30 metros, audio bidireccional con micrófono y altavoz para disuasión, ranura para tarjeta MicroSD de hasta 256 GB y chasis con certificación IP66 resistente a lluvias torrenciales y calor caribeño.",
    "price": "RD$ 8,650.00",
    "img": "img/productos/catalogo/hikvision-camara-solar-4g.webp",
    "gallery": [
      "img/productos/catalogo/hikvision-camara-solar-4g.webp"
    ],
    "specs": [
      "Alimentación 100% solar: Panel solar de 5W integrado y batería de litio de alta densidad de ciclo profundo",
      "Conectividad móvil 4G LTE: Ranura Micro SIM para datos móviles de Claro/Altice sin requerir internet fijo",
      "Resolución de video: Sensor CMOS 1080p (1920x1080) a 30 fps con compresión eficiente H.265+",
      "Detección inteligente PIR: Detección térmica humana de hasta 12 metros que reduce falsas alarmas por viento u hojas",
      "Iluminación dual: Infrarrojo nocturno de 30 metros y luz blanca para captura a todo color en la oscuridad",
      "Audio bidireccional: Micrófono y altavoz de alta potencia para comunicación remota y sirena disuasoria",
      "Protección ambiental: Carcasa reforzada IP66 para intemperie extrema y 1 año de garantía oficial Futunet con NCF"
    ]
  },
  {
    "id": "oficina_samsung_pantalla_55_crystal_uhd",
    "department": "equipos",
    "category": "Equipos de Oficina y Cómputo",
    "brand": "Samsung",
    "title": "Pantalla Comercial Samsung Crystal UHD 55\" 4K Serie Business BE55T para Salas de Juntas y Cartelería Digital",
    "desc": "Pantalla profesional de 55 pulgadas Samsung Business Display (BE55T) con resolución 4K Ultra HD (3840 x 2160 píxeles), procesador Crystal 4K y tecnología HDR10+ diseñada para entornos corporativos, salas de conferencias, clínicas, recepciones y comercios en Santiago. Certificada para operación comercial continua de 16 horas diarias, 7 días a la semana (16/7), con panel antirreflejo y brillo uniforme de 250 nits para visualización perfecta en salones iluminados. Integra 3 puertos HDMI para computadoras y proyectores auxiliares, puerto USB, conexión Wi-Fi y Bluetooth, altavoces estéreo de 20W integrados, temporizador programable de encendido/apagado, y montaje estándar VESA 200x200 para soporte de pared o pedestal móvil.",
    "price": "RD$ 34,950.00",
    "img": "img/productos/catalogo/samsung-pantalla-55-crystal-uhd.webp",
    "gallery": [
      "img/productos/catalogo/samsung-pantalla-55-crystal-uhd.webp"
    ],
    "specs": [
      "Tamaño y resolución: Pantalla comercial de 55 pulgadas 4K UHD (3840 x 2160) con procesador Crystal 4K",
      "Régimen de funcionamiento: Grado profesional 16/7 continuo (16 horas/día, 7 días a la semana)",
      "Tecnología de imagen: HDR10+, contraste Mega Contrast y panel antirreflejo para salas iluminadas",
      "Conectividad múltiple: 3x HDMI, 1x USB, puerto RJ-45 LAN, Wi-Fi 5 y Bluetooth bidireccional",
      "Audio y multimedia: Altavoces estéreo integrados de 20W (10W+10W) y sintonizador digital ATSC/QAM",
      "Montaje y estructura: Compatibilidad con soporte de pared estándar VESA 200 x 200 mm",
      "Garantía comercial Samsung de 3 años con soporte técnico oficial y comprobante fiscal NCF"
    ]
  },
  {
    "id": "redes_ubiquiti_unifi_cloud_gateway_ultra",
    "department": "redes",
    "category": "Redes y Telecomunicaciones",
    "brand": "Ubiquiti",
    "title": "Gateway de Red Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra) Multi-WAN Gigabit con Pantalla LCM",
    "desc": "Consola de red y gateway todo en uno Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra) compacta y de ultra alto rendimiento. Equipada con capacidad de enrutamiento de 1 Gbps con firewall de inspección profunda de paquetes (IDS/IPS) activo, puerto WAN 2.5 GbE con soporte Multi-WAN para balanceo de carga y tolerancia a fallos (Failover), 4 puertos Gigabit Ethernet LAN (10/100/1000 Mbps) reconfigurables, pantalla LCM frontal de 0.96 pulgadas para telemetría en tiempo real y servidor UniFi Network Application integrado para gestionar switches, puntos de acceso AP UniFi 6 y clientes sin requerir Cloud Key externo ni cuotas de suscripción.",
    "price": "RD$ 9,850.00",
    "img": "img/productos/catalogo/ubiquiti-cloud-gateway-ultra.webp",
    "gallery": [
      "img/productos/catalogo/ubiquiti-cloud-gateway-ultra.webp"
    ],
    "specs": [
      "Rendimiento de enrutamiento: 1 Gbps de ruteo completo con detección y prevención de intrusiones (IDS/IPS)",
      "Conectividad Multi-WAN: 1x puerto WAN 2.5 GbE (RJ-45) y 1x WAN secundario reconfigurable con failover",
      "Puertos de red LAN: 4 puertos Gigabit Ethernet RJ-45 (10/100/1000 Mbps) con detección automática",
      "Gestión UniFi completa: Aloja la aplicación UniFi Network completa para gestionar más de 30 dispositivos y 300 clientes",
      "Pantalla frontal: Pantalla de estado LCM monocromática de 0.96\" para monitoreo de tráfico, IP y alertas",
      "Alimentación eficiente: Conector USB-C (5V DC / 3A) de bajo consumo con adaptador original incluido",
      "Garantía oficial Ubiquiti de 1 año con soporte técnico y entrega inmediata en Santiago"
    ]
  },
  {
    "id": "seguridad_uniview_nvr_8ch_poe_4k",
    "department": "seguridad",
    "category": "Seguridad y Vigilancia",
    "brand": "Uniview",
    "title": "Grabador NVR Uniview 4K Ultra HD de 8 Canales con Switch PoE de 8 Puertos Integrados (NVR301-08S3-P8)",
    "desc": "Grabador de video en red (NVR) profesional Uniview NVR301-08S3-P8 de 8 canales IP con switch PoE de 8 puertos independientes integrados con tecnología Plug & Play. Admite cámaras de seguridad IP de resolución hasta 8 Megapíxeles (4K Ultra HD) con un ancho de banda entrante de 64 Mbps. Incorpora compresión de video avanzada Ultra 265 / H.265 / H.264 que reduce hasta un 75% el uso de almacenamiento y ancho de banda en red. Cuenta con salida de video independiente HDMI 4K (3840x2160) y VGA simultánea, soporte para 1 disco duro SATA de hasta 6 TB, audio bidireccional, y visualización remota en tiempo real en iOS y Android a través de la aplicación oficial EZView.",
    "price": "RD$ 13,950.00",
    "img": "img/productos/catalogo/uniview-nvr-8ch-poe-4k.webp",
    "gallery": [
      "img/productos/catalogo/uniview-nvr-8ch-poe-4k.webp"
    ],
    "specs": [
      "Capacidad de canales: 8 Canales IP con soporte para cámaras de hasta 8 MP (4K Ultra HD)",
      "Switch PoE integrado: 8 puertos independientes RJ-45 10/100 Mbps con estándar IEEE 802.3af/at (Plug & Play)",
      "Compresión de video: Ultra 265 / H.265 / H.264 para máximo ahorro de disco y transmisión fluida",
      "Salidas de video: 1x HDMI 4K (3840 x 2160 a 30Hz) y 1x VGA (1920 x 1080) simultáneas",
      "Almacenamiento SATA: 1 interfaz SATA interna para discos duros de hasta 6 TB (soporta WD Purple)",
      "Acceso móvil y red: Protocolo P2P con app móvil EZView (código QR instantáneo) y software EZStation para PC",
      "Garantía oficial Uniview de 2 años con soporte técnico e instalación en Santiago y el Cibao"
    ]
  },
  {
    "id": "hp_probook_450_g10_laptop",
    "department": "equipos",
    "category": "Laptops y Portátiles",
    "brand": "HP",
    "title": "Laptop Corporativa HP ProBook 450 G10 Core i7 (15.6\" FHD IPS, 16 GB RAM, 512 GB SSD NVMe, Numpad)",
    "desc": "Laptop empresarial de grado profesional HP ProBook 450 G10 diseñada para despachos corporativos, firmas de contabilidad, constructoras y directivos en Santiago. Equipada con procesador Intel Core i7-1355U de 10 núcleos (hasta 5.0 GHz con Intel Turbo Boost), 16 GB de memoria RAM DDR4 3200 MHz en doble canal (expandible a 32 GB), 512 GB de almacenamiento SSD PCIe NVMe M.2 ultrarrápido, y pantalla de 15.6 pulgadas Full HD (1920x1080) IPS con marco angosto y acabado antirreflejo de 250 nits. Incorpora teclado completo resistente a salpicaduras con bloque numérico dedicado (numpad), suite de seguridad avanzada HP Wolf Pro Security Edition con chip TPM 2.0 y lector de huellas dactilares. Conectividad completa con 2x USB-C (soporta Power Delivery y DisplayPort), 2x USB-A 3.2, puerto HDMI 2.1, Ethernet Gigabit RJ-45, Wi-Fi 6E y Bluetooth 5.3, con chasis de aluminio duradero certificado bajo pruebas militares MIL-STD-810H.",
    "price": "RD$ 54,800.00",
    "img": "img/productos/catalogo/hp-probook-450-g10.webp",
    "gallery": [
      "img/productos/catalogo/hp-probook-450-g10.webp"
    ],
    "specs": [
      "Procesador: Intel Core i7-1355U de 13.ª generación (10 núcleos, 12 hilos, hasta 5.0 GHz con Turbo Boost)",
      "Memoria RAM: 16 GB DDR4-3200 MHz en doble canal (expandible hasta 32 GB)",
      "Almacenamiento: Unidad de estado sólido SSD de 512 GB PCIe NVMe M.2 ultrarrápida",
      "Pantalla: 15.6 pulgadas Full HD (1920 x 1080) IPS antirreflejo con biseles delgados y 250 nits",
      "Teclado y ergonomía: Teclado numérico completo numpad resistente a derrames menores de líquidos",
      "Seguridad corporativa: HP Wolf Pro Security, sensor biométrico de huellas digitales y TPM 2.0",
      "Puertos y red: 2x USB Type-C, 2x USB Type-A, HDMI 2.1, RJ-45 Gigabit, Wi-Fi 6E y Bluetooth 5.3",
      "Garantía oficial HP de 1 año con respaldo corporativo Futunet y comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "oficina_hp_laserjet_pro_m428fdw_multifuncional",
    "department": "equipos",
    "category": "Impresoras y Escáneres",
    "brand": "HP",
    "title": "Impresora Multifuncional Láser HP LaserJet Pro MFP M428fdw (40 ppm, Dúplex, Wi-Fi, Ethernet, Fax)",
    "desc": "Impresora láser multifuncional monocromática 4 en 1 de alta productividad HP LaserJet Pro MFP M428fdw (imprime, escanea, copia y envía fax) diseñada para oficinas, notarías, consultorios médicos, empresas e instituciones en Santiago con alta carga de trabajo documental. Imprime a velocidades de hasta 40 páginas por minuto con resolución nítida HP FastRes 1200. Cuenta con impresión a doble cara automática (dúplex) y alimentador automático de documentos (ADF) de 50 hojas para escaneo dúplex de doble cara en una sola pasada. Equipada con pantalla táctil intuitiva a color de 2.7 pulgadas con accesos directos configurables, conectividad inalámbrica Wi-Fi de doble banda autorreparable, puerto Gigabit Ethernet de red, USB 2.0 de alta velocidad e impresión móvil mediante Apple AirPrint, Mopria y app HP Smart. Capacidad de entrada de hasta 350 hojas (bandeja multiuso de 100 hojas + bandeja principal de 250 hojas) y compatibilidad con cartuchos de tóner de alta capacidad HP CF258A y CF258X.",
    "price": "RD$ 32,500.00",
    "img": "img/productos/catalogo/hp-laserjet-pro-mfp-m428fdw.webp",
    "gallery": [
      "img/productos/catalogo/hp-laserjet-pro-mfp-m428fdw.webp"
    ],
    "specs": [
      "Funciones 4 en 1: Impresión láser monocromática, copiado de alta nitidez, escáner y fax de oficina",
      "Velocidad de impresión: Hasta 40 ppm (A4 / Carta) con salida de primera página en apenas 6.1 segundos",
      "Doble cara automático (Dúplex): Impresión y escaneo a dos caras simultáneo con ADF de 50 hojas",
      "Pantalla y control: Pantalla táctil gráfica a color de 2.7 pulgadas (6.8 cm) con accesos directos táctiles",
      "Conectividad de red: Wi-Fi de doble banda 2.4/5 GHz, Ethernet Gigabit 10/100/1000 y USB 2.0",
      "Capacidad de papel: Bandeja 1 multipropósito de 100 hojas y Bandeja 2 de 250 hojas (350 hojas estándar)",
      "Consumibles: Cartuchos originales HP CF258A (3,000 páginas) y HP CF258X de alto rendimiento (10,000 páginas)",
      "Garantía oficial HP de 1 año con soporte técnico local y factura con NCF corporativo"
    ]
  },
  {
    "id": "redes_cisco_business_cbs350_24t_switch",
    "department": "redes",
    "category": "Switches y Redes",
    "brand": "Cisco",
    "title": "Switch Administrable Gigabit Cisco Business CBS350-24T-4G (24 Puertos GbE + 4 Uplinks SFP, Capa 3)",
    "desc": "Switch administrable empresarial de capa 2 y capa 3 Cisco Business 350 Series (CBS350-24T-4G) para infraestructura de telecomunicaciones, naves industriales, centros de datos y redes corporativas de alto rendimiento en Santiago. Cuenta con 24 puertos Gigabit Ethernet 10/100/1000 Mbps con arquitectura sin bloqueo y 4 puertos dedicados SFP Gigabit para enlaces ascendentes de fibra óptica troncal hacia servidores u otros edificios. Proporciona una capacidad de conmutación de 56 Gbps y tasa de reenvío de 41.66 Mpps. Incorpora capacidades avanzadas de enrutamiento estático IPv4/IPv6 de capa 3 para interconectar segmentos y VLANs (hasta 4,094 IDs de VLAN) sin sobrecargar el router perimetral. Ofrece seguridad de red robusta con listas de control de acceso (ACLs), seguridad de puertos IEEE 802.1X, prevención contra ataques DoS, soporte QoS de 8 colas de prioridad y gestión simplificada mediante interfaz web en español, SNMP y la consola en la nube Cisco Business Dashboard sin requerir pago de licencias recurrentes. Formato metálico de montaje en rack de 19 pulgadas (1U) con garantía oficial Cisco y comprobante fiscal formal NCF.",
    "price": "RD$ 28,900.00",
    "img": "img/productos/catalogo/cisco-cbs350-24t-switch.webp",
    "gallery": [
      "img/productos/catalogo/cisco-cbs350-24t-switch.webp"
    ],
    "specs": [
      "Puertos de red: 24 puertos Gigabit Ethernet RJ-45 (10/100/1000 Mbps) con autodetección MDI/MDIX",
      "Puertos de fibra óptica: 4 puertos dedicados SFP Gigabit (1 Gbps) para módulos transceptores de fibra",
      "Rendimiento y capacidad: Capacidad de conmutación de 56 Gbps y reenvío de 41.66 millones de paquetes/seg (Mpps)",
      "Enrutamiento de Capa 3: Enrutamiento estático IPv4/IPv6 para segmentación directa de tráfico entre VLANs",
      "Seguridad de red: IEEE 802.1X, listas de control de acceso (ACLs), inspección ARP dinámica e IP Source Guard",
      "Administración empresarial: Cisco Business Dashboard, interfaz gráfica Web GUI intuitiva en español y SNMP v1/v2c/v3",
      "Estructura física: Chasis de acero para montaje en rack estándar de 19\" (1U) con brackets de sujeción incluidos",
      "Garantía oficial Cisco de 2 años con soporte técnico especializado de Futunet en República Dominicana"
    ]
  },
  {
    "id": "energia_apc_schneider_easy_ups_srv_3000va_online",
    "department": "energia",
    "category": "Sistemas UPS y Baterías",
    "brand": "Schneider Electric",
    "title": "UPS Online Doble Conversión APC by Schneider Electric Easy UPS SRV 3000VA 120V (2400W, 0 ms Transferencia, LCD, SNMP)",
    "desc": "Sistema de Alimentación Ininterrumpida (UPS) Online de Doble Conversión de alto rendimiento APC by Schneider Electric Easy UPS SRV 3000VA (SRV3000XLA / SRV3KA) de 2,400 Watts de potencia real con factor de potencia 0.8 / onda senoidal pura y tiempo de conmutación cero (0 ms). Diseñado especialmente para servidores de misión crítica, centros de datos, equipamiento médico y racks de telecomunicaciones en Santiago ante cortes o fluctuaciones extremas de la red eléctrica. Incorpora pantalla LCD gráfica multifunción para monitoreo en tiempo real de voltaje, carga y autonomía en minutos, ranura inteligente Mini-Slot para tarjeta de gestión de red SNMP/Web, bypass automático y tomas de salida profesionales NEMA 5-20R y NEMA L5-30R de alta capacidad.",
    "price": "RD$ 78,900.00",
    "img": "img/productos/catalogo/apc-schneider-easy-ups-srv-3000va.webp",
    "gallery": [
      "img/productos/catalogo/apc-schneider-easy-ups-srv-3000va.webp"
    ],
    "specs": [
      "Capacidad y potencia: 3,000 VA / 2,400 Watts de potencia real con factor de potencia elevado",
      "Topología eléctrica: Online Doble Conversión verdadera con tiempo de transferencia cero (0 ms)",
      "Forma de onda: Onda senoidal pura en salida de 120V CA (±1% de regulación precisa de voltaje)",
      "Tomas de salida: 6 tomas NEMA 5-20R de 20A + 1 toma de bloqueo industrial NEMA L5-30R de 30A",
      "Pantalla y gestión: Pantalla LCD gráfica multifunción con estado de carga, batería y alarmas sonoras",
      "Conectividad inteligente: Ranura Mini-Slot para tarjeta de red SNMP/Web y puerto USB/RS-232",
      "Protección avanzada: Bypass automático y manual, modo ECO de alta eficiencia energética del 94%",
      "Garantía oficial Schneider Electric / APC de 2 años con soporte técnico directo de Futunet en Santiago"
    ]
  },
  {
    "id": "redes_mikrotik_rb5009_router_multiwan",
    "department": "redes",
    "category": "Routers y Telecomunicaciones",
    "brand": "MikroTik",
    "title": "Router de Alto Rendimiento MikroTik RB5009UG+S+IN Multi-WAN (7x GbE + 1x 2.5 GbE + 1x 10G SFP+, Quad-Core 1.4 GHz)",
    "desc": "Router corporativo de alta capacidad de enrutamiento MikroTik RB5009UG+S+IN diseñado para balanceo de carga Multi-WAN, enlaces de fibra óptica dedicados de alta velocidad y failover automático en zonas francas, empresas y proveedores en Santiago y el Cibao. Equipado con potente procesador Marvell Armada Quad-Core de 64 bits a 1.4 GHz, 1 GB de memoria RAM DDR4, 1 GB de almacenamiento NAND y chip de conmutación de alto rendimiento. Ofrece 7 puertos Gigabit Ethernet 10/100/1000, 1 puerto 2.5 Gigabit Ethernet para enlaces WAN de ultra banda ancha y 1 jaula 10G SFP+ para fibra óptica troncal a 10 Gbps. Chasis metálico compacto de aleación pesada que actúa como disipador térmico pasivo silencioso sin ventiladores ruidosos, con soporte para montaje en rack de 19 pulgadas y licencia RouterOS v7 Nivel 5 para enrutamiento BGP, OSPF, túneles WireGuard, IPsec acelerado por hardware y colas QoS avanzadas.",
    "price": "RD$ 17,950.00",
    "img": "img/productos/catalogo/mikrotik-rb5009-router-multiwan.webp",
    "gallery": [
      "img/productos/catalogo/mikrotik-rb5009-router-multiwan.webp"
    ],
    "specs": [
      "Procesador y memoria: Marvell Armada 88F7040 Quad-Core a 1.4 GHz con 1 GB RAM DDR4 y 1 GB NAND",
      "Puertos Ethernet: 7 puertos Gigabit Ethernet (10/100/1000 Mbps) + 1 puerto 2.5 Gigabit Ethernet (2.5 GbE)",
      "Puerto de fibra óptica: 1 jaula SFP+ de 10 Gbps (10G SFP+) compatible con módulos de fibra mono/multimodo",
      "Alimentación redundante: Entrada PoE-In 802.3af/at en puerto 1, DC Jack estándar y terminal bloque de 2 pines (24-57V)",
      "Sistema operativo: MikroTik RouterOS v7 con Licencia Nivel 5 (soporte WireGuard, BGP, OSPF y VLANs)",
      "Diseño térmico: Chasis disipador de aluminio macizo para operación 24/7 sin ventiladores y opción rack 1U",
      "Rendimiento: Capacidad de enrutamiento de hasta 10 Gbps sin cuello de botella y aceleración IPsec",
      "Garantía oficial MikroTik de 1 año con respaldo técnico y asesoría en Santiago de los Caballeros"
    ]
  },
  {
    "id": "oficina_lenovo_thinkcentre_m70q_tiny_desktop",
    "department": "equipos",
    "category": "Computadoras y Servidores",
    "brand": "Lenovo",
    "title": "Computadora Corporativa Ultracompacta Lenovo ThinkCentre M70q Tiny Gen 4 Mini PC (Intel Core i5-13400T, 16 GB RAM, 512 GB SSD, Wi-Fi 6E)",
    "desc": "Computadora de escritorio empresarial ultracompacta Mini PC formato Tiny de 1 litro Lenovo ThinkCentre M70q Gen 4 diseñada para mostradores comerciales, cajas de punto de venta (POS), consultorios, firmas corporativas y espacios reducidos en Santiago. Equipada con procesador Intel Core i5-13400T de 13.ª generación con 10 núcleos y 16 hilos (hasta 4.40 GHz con Intel Max Turbo), 16 GB de memoria RAM DDR4 en doble canal (expandible a 64 GB), unidad de estado sólido de 512 GB SSD M.2 PCIe 4.0 NVMe de alta velocidad y gráficos integrados Intel UHD Graphics 730 con soporte para hasta 3 pantallas independientes vía HDMI 2.1 y DisplayPort 1.4. Cuenta con conectividad inalámbrica de última generación Wi-Fi 6E (802.11ax), Bluetooth 5.1, puerto de red Gigabit Ethernet RJ-45, puerto frontal USB-C 3.2 Gen 1, 5 puertos USB 3.2 Gen 2 y chasis de grado militar certificado bajo pruebas de resistencia extremas MIL-STD-810H. Compatible con montaje VESA detrás de monitores o bajo escritorios. Incluye teclado y mouse óptico Lenovo USB originales en español y Windows 11 Pro preinstalado.",
    "price": "RD$ 44,500.00",
    "img": "img/productos/catalogo/lenovo-thinkcentre-m70q-tiny.webp",
    "gallery": [
      "img/productos/catalogo/lenovo-thinkcentre-m70q-tiny.webp"
    ],
    "specs": [
      "Procesador: Intel Core i5-13400T de 13.ª generación (10 núcleos: 6 Performance + 4 Efficient, 16 hilos, hasta 4.4 GHz)",
      "Memoria RAM: 16 GB DDR4-3200 MHz de grado corporativo (expandible hasta 64 GB en dos ranuras SODIMM)",
      "Almacenamiento: 512 GB SSD M.2 2280 PCIe 4.0 x4 NVMe Opal 2.0 de lectura y escritura ultrarrápida",
      "Factor de forma Tiny: Chasis ultracompacto Mini PC de 1 Litro (17.9 cm x 18.2 cm x 3.6 cm) y apenas 1.25 kg de peso",
      "Salidas gráficas multi-monitor: 1 puerto HDMI 2.1 TMDS + 1 puerto DisplayPort 1.4a con soporte 4K",
      "Puertos y expansión: 1x USB-C 3.2 Gen 1 frontal, 3x USB 3.2 Gen 2, 2x USB 3.2 Gen 1, RJ-45 Gigabit y combo audio",
      "Conectividad: Intel Wi-Fi 6E AX211 (2x2 ax) + Bluetooth 5.1 con antena externa de alta ganancia",
      "Periféricos y SO: Incluye teclado USB tradicional Lenovo y mouse óptico USB en español, con Windows 11 Pro",
      "Garantía oficial Lenovo de 3 años en sitio con factura formal con valor fiscal NCF en Santiago"
    ]
  },
  {
    "id": "seguridad_uniview_colorhunter_4k_poe_camera",
    "department": "seguridad",
    "category": "Seguridad y Vigilancia",
    "brand": "Uniview",
    "title": "Cámara IP Uniview ColorHunter 4K 8MP PoE con Visión Nocturna a Color 24/7, Micrófono y Analítica Inteligente (IPC2128SB-ADF28KMC-I0)",
    "desc": "Cámara de seguridad IP tipo Bullet profesional Uniview ColorHunter 4K Ultra HD de 8 Megapíxeles (resolución 3840 x 2160) con tecnología ColorHunter para visión nocturna a todo color real las 24 horas del día. Equipada con lente de gran apertura F1.0 que capta 4 veces más luz que lentes convencionales y reflectores de luz cálida suave con alcance de hasta 30 metros sin deslumbrar. Incorpora prevención inteligente de intrusiones (SIP) con clasificación basada en inteligencia artificial de humanos y vehículos para reducir falsas alarmas provocadas por lluvia, viento, ramas o animales pequeños. Dispone de micrófono integrado de alta fidelidad con reducción de ruido ambiental para registro de audio, ranura para tarjeta de memoria MicroSD de hasta 256 GB para almacenamiento redundante local y alimentación estándar PoE 802.3af (o 12V DC). Chasis metálico de alta resistencia con certificación IP67 contra polvo, lluvia y chorros de agua a presión y protección contra sobretensiones transitorias de 4 kV. Compatible 100% con grabadores NVR Uniview y aplicación móvil gratuita Uniarch / EZView para visualización remota en vivo desde cualquier smartphone.",
    "price": "RD$ 8,450.00",
    "img": "img/productos/catalogo/uniview-colorhunter-4k-poe-camera.webp",
    "gallery": [
      "img/productos/catalogo/uniview-colorhunter-4k-poe-camera.webp"
    ],
    "specs": [
      "Resolución Ultra HD 4K (3840 x 2160) a 20 fps con sensor CMOS de 1/2.8\" de alta sensibilidad lumínica",
      "Tecnología ColorHunter: Visión nocturna a todo color 24/7 con lente F1.0 de gran apertura y luz cálida de 30m",
      "Analítica Inteligente SIP: Clasificación precisa de humanos y vehículos para filtros de cruce de línea e intrusión perimetral",
      "Micrófono integrado de alta fidelidad con cancelación de ruido ambiental para audio forense claro",
      "Alimentación Power over Ethernet (PoE 802.3af) y entrada 12V DC con consumo ultra eficiente de energía",
      "Almacenamiento local redundante: Ranura MicroSD integrada con soporte de hasta 256 GB",
      "Chasis metálico resistente a intemperie con certificación IP67 y protección contra sobretensiones de 4 kV",
      "Garantía oficial Uniview de 1 año con soporte técnico y facturación formal NCF en Santiago"
    ]
  },
  {
    "id": "redes_netgear_gs308pp_switch_8p_poe",
    "department": "redes",
    "category": "Switches y Enrutadores",
    "brand": "Netgear",
    "title": "Switch Netgear ProSAFE GS308PP 8 Puertos Gigabit Ethernet Metálico Fanless con 8 Puertos PoE+ (Presupuesto 83W)",
    "desc": "Switch Gigabit Ethernet no administrable de alta potencia Netgear ProSAFE GS308PP de 8 puertos 10/100/1000 Mbps con soporte completo PoE+ (Power over Ethernet IEEE 802.3at/af) en los 8 puertos y un presupuesto total de potencia PoE de 83 Watts (hasta 30W por puerto). Diseñado para conectar y energizar simultáneamente cámaras de videovigilancia IP 4K, puntos de acceso Wi-Fi 6 de doble banda y teléfonos VoIP sin requerir inyectores de corriente externos ni tomas eléctricas adicionales. Construido en chasis metálico de alta resistencia con diseño Fanless silencioso sin ventiladores, ideal para oficinas ejecutivas, salas de juntas, clínicas y cajas de cobro. Cuenta con arquitectura de conmutación sin bloqueo con 16 Gbps de ancho de banda, soporte de tramas Jumbo de 9 KB, priorización de tráfico QoS 802.1p por hardware para transmisión fluida de voz y video, eficiencia energética IEEE 802.3az e instalación instantánea Plug & Play sin configuración.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/netgear-gs308pp-switch-8p-poe.webp",
    "gallery": [
      "img/productos/catalogo/netgear-gs308pp-switch-8p-poe.webp"
    ],
    "specs": [
      "8 puertos Gigabit Ethernet 10/100/1000 Mbps RJ-45 con auto-negociación y Auto MDI/MDIX",
      "8 puertos PoE+ IEEE 802.3at/af con presupuesto total de potencia PoE de 83 Watts",
      "Diseño Fanless silencioso: Chasis metálico compacto para disipación térmica pasiva sin ruido",
      "Capacidad de conmutación de 16 Gbps sin bloqueo y soporte para tramas Jumbo de hasta 9 KB",
      "Priorización de tráfico QoS 802.1p basada en hardware para llamadas VoIP y streaming 4K continuo",
      "Indicadores LED por puerto para estado de enlace, velocidad Gigabit y activación de alimentación PoE+",
      "Instalación Plug & Play sin requerir software ni configuración, con soporte para montaje en pared o escritorio",
      "Garantía oficial Netgear de 2 años con soporte técnico y factura con comprobante fiscal NCF en Santiago"
    ]
  },
  {
    "id": "energia_victron_smartsolar_mppt_100_30",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Victron Energy",
    "title": "Controlador de Carga Solar Victron Energy SmartSolar MPPT 100/30 (100V / 30A) con Bluetooth Integrado y Monitoreo VictronConnect",
    "desc": "Controlador y regulador de carga solar fotovoltaica inteligente Victron Energy SmartSolar MPPT 100/30 de 30 Amperios de corriente de carga nominal y hasta 100 Voltios de tensión máxima de circuito abierto FV. Incorpora la tecnología exclusiva Ultra-Fast MPPT (Maximum Power Point Tracking) que maximiza la captación de energía de los paneles solares hasta un 30% más rápido en comparación con reguladores PWM y hasta un 10% más eficiente frente a otros controladores MPPT en condiciones de cielo nublado o radiación solar cambiante en República Dominicana. Dispone de conectividad inalámbrica Bluetooth Smart integrada de fábrica para configurar, monitorear y actualizar el sistema en tiempo real desde la aplicación móvil VictronConnect (iOS y Android), visualizando gráficas de generación solar histórica y estado de batería. Cuenta con algoritmo de carga inteligente de 3 etapas y gestión avanzada BatteryLife que previene la degradación prematura de baterías de ciclo profundo, AGM, gel o litio LiFePO4, salida de carga inteligente programable y puerto de comunicación VE.Direct.",
    "price": "RD$ 14,200.00",
    "img": "img/productos/catalogo/victron-smartsolar-mppt-100-30.webp",
    "gallery": [
      "img/productos/catalogo/victron-smartsolar-mppt-100-30.webp"
    ],
    "specs": [
      "Tensión máxima de circuito abierto fotovoltaico (Voc): 100 Voltios para arreglos de paneles solares en serie",
      "Corriente de carga de batería nominal: 30 Amperios con detección automática de bancos de 12V y 24V (hasta 440W en 12V / 880W en 24V)",
      "Tecnología Ultra-Fast MPPT: Optimización de punto de máxima potencia ultra rápida ante sombras parciales y días nublados",
      "Bluetooth Smart integrado: Monitoreo inalámbrico en vivo, registro de datos de 30 días y control desde la app VictronConnect",
      "Algoritmo inteligente BatteryLife: Monitoreo del estado de carga para evitar descargas profundas y prolongar la vida útil de baterías",
      "Compatibilidad universal: Perfiles de carga configurables para baterías de Litio (LiFePO4), Gel, AGM y Plomo-Ácido",
      "Salida de consumo inteligente con desconexión automática por baja tensión para proteger el banco de baterías",
      "Garantía oficial del fabricante Victron Energy de 5 años con soporte técnico especializado de Futunet en Santiago"
    ]
  },
  {
    "id": "oficina_panasonic_kxhdv230_ip_phone",
    "department": "oficina",
    "category": "Equipos de Oficina",
    "brand": "Panasonic",
    "title": "Teléfono IP Ejecutivo Panasonic KX-HDV230 de 6 Líneas SIP con Pantalla Dual LCD, Teclas BLF/DSS Programables y Audio Sonic HD",
    "desc": "Teléfono IP corporativo y ejecutivo Panasonic KX-HDV230 de alta gama con capacidad para hasta 6 cuentas o líneas SIP simultáneas. Equipado con pantalla principal LCD gráfica monocromática retroiluminada de 2.3 pulgadas y una segunda pantalla LCD para etiquetas digitales de auto-etiquetado con 12 teclas de función rápida flexibles y teclas DSS/BLF (Busy Lamp Field) programables en dos páginas virtuales para un total de 24 extensiones supervisadas con LED bicolor (verde/rojo). Incorpora tecnología de audio HD de banda ancha Sonic HD con altavoz manos libres full dúplex, doble puerto Gigabit Ethernet 10/100/1000Base-T con alimentación PoE (Power over Ethernet 802.3af) integrada para evitar fuentes externas y conector RJ9 para cintillo telefónico de operador. Soporta agenda de hasta 500 contactos, registro de 30 llamadas entrantes y salientes, conferencia a 3 vías y compatibilidad total con centrales IP PBX Asterisk, FreePBX, Grandstream, Yeastar y Panasonic KX-NS500 / KX-HTS32 para recepciones, gerencias y centros de llamadas en Santiago y República Dominicana.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/panasonic-kxhdv230-ip-phone.webp",
    "gallery": [
      "img/productos/catalogo/panasonic-kxhdv230-ip-phone.webp"
    ],
    "specs": [
      "6 cuentas o líneas SIP simultáneas con registro independiente y audio HD de banda ancha",
      "Pantalla principal LCD gráfica retroiluminada de 2.3 pulgadas con ajuste de contraste",
      "Segunda pantalla LCD con 12 teclas flexibles BLF / DSS de auto-etiquetado (hasta 24 funciones en 2 páginas)",
      "Doble puerto Gigabit Ethernet 10/100/1000 Mbps con soporte de alimentación PoE integrado",
      "Altavoz manos libres full dúplex y puerto dedicado RJ9 para cintillo de operadora telefónica",
      "Agenda de 500 contactos, registro de llamadas, conferencia tripartita y códecs G.722, G.711, G.729a",
      "Garantía oficial corporativa Panasonic de 1 año y comprobante fiscal formal NCF en Santiago"
    ]
  },
  {
    "id": "redes_juniper_srx300_security_gateway",
    "department": "redes",
    "category": "Switches y Enrutadores",
    "brand": "Juniper",
    "title": "Firewall y Gateway de Seguridad Empresarial Juniper Networks SRX300 (8 Puertos Gigabit Ethernet, VPN IPsec 250 Mbps, Junos OS)",
    "desc": "Gateway de servicios de seguridad y firewall empresarial de próxima generación Juniper Networks SRX300 (SRX300-SYS-JB) diseñado para sucursales corporativas, instituciones bancarias, oficinas gubernamentales y plantas en zonas francas de Santiago. Equipado con 8 puertos Gigabit Ethernet 10/100/1000 Mbps (incluyendo 6 puertos RJ-45 de cobre y 2 puertos combo RJ-45 / SFP para enlaces de fibra óptica dedicados o redundantes). Ofrece un rendimiento de firewall de inspección de estado de hasta 1 Gbps, 250 Mbps de throughput en VPNs IPsec seguras de sitio a sitio con cifrado AES-256, hasta 64,000 sesiones concurrentes y sistema de prevención de intrusiones (IPS/IDP). Funciona con el robusto sistema operativo de clase portadora Junos OS, brindando enrutamiento dinámico avanzado (BGP, OSPF, RIP, MPLS), filtrado web UTM, políticas de seguridad basadas en aplicaciones (AppSecure) y chasis compacto metálico silencioso sin ventilador (fanless) con certificación de grado carrier para operación continua 24/7 sin caídas.",
    "price": "RD$ 26,500.00",
    "img": "img/productos/catalogo/juniper-srx300-security-gateway.webp",
    "gallery": [
      "img/productos/catalogo/juniper-srx300-security-gateway.webp"
    ],
    "specs": [
      "8 puertos Gigabit Ethernet (6 puertos 10/100/1000Base-T RJ-45 + 2 puertos combo RJ-45 / SFP para fibra óptica)",
      "Rendimiento de Firewall Stateful de hasta 1 Gbps y rendimiento de túneles VPN IPsec de 250 Mbps",
      "Capacidad para hasta 64,000 sesiones concurrentes de red y 2,048 túneles VPN de sitio a sitio y acceso remoto",
      "Sistema operativo Junos OS con arquitectura modular, enrutamiento dinámico BGP, OSPF, NAT y QoS",
      "Seguridad UTM integrada: Filtrado web, control de aplicaciones AppSecure, antivirus y prevención de intrusiones (IPS)",
      "Diseño Fanless silencioso de grado industrial para instalación en rack, pared o escritorio sin ruido acústico",
      "Garantía oficial Juniper Networks de 2 años con soporte técnico de ingeniería y facturación con NCF en Santiago"
    ]
  },
  {
    "id": "energia_siemens_sirius_contactor_3rt_25a",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Siemens",
    "title": "Contactor Magnético Industrial Siemens Sirius 3RT2026-1AK60 Trifásico 25A (11 kW a 400V) Bobina 110V/120V AC con Contactos Auxiliares 1NA+1NC",
    "desc": "Contactor magnético industrial tripolar Siemens Sirius serie 3RT (tamaño constructivo S0, modelo 3RT2026-1AK60) para conmutación, arranque suave y protección de motores eléctricos trifásicos de hasta 25 Amperios en categoría AC-3 (11 kW / 15 HP a 400V / 480V) y hasta 40 Amperios en categoría AC-1 para cargas resistivas y bancos de resistencias. Equipado con bobina de accionamiento de control de alta resistencia a 110V / 120V AC a 50/60 Hz habitual en cuadros industriales dominicanos y contactos auxiliares integrados de fábrica 1NA (normalmente abierto) + 1NC (normalmente cerrado) para enclavamiento de seguridad y señalización luminosa. Diseñado con mecanismo de contactos de aleación de plata resistente al arco eléctrico con vida útil mecánica de más de 10 millones de ciclos de maniobra, bornes de conexión por tornillo a prueba de vibraciones y montaje rápido en riel DIN de 35 mm o mediante placa de montaje con tornillos. Compatible con relés de sobrecarga térmicos y electrónicos Siemens Sirius para la protección integral de bombas de agua, compresores de climatización, extractores de aire y maquinaria de zonas francas en Santiago.",
    "price": "RD$ 3,850.00",
    "img": "img/productos/catalogo/siemens-sirius-contactor-3rt-25a.webp",
    "gallery": [
      "img/productos/catalogo/siemens-sirius-contactor-3rt-25a.webp"
    ],
    "specs": [
      "Corriente nominal de empleo: 25 Amperios (AC-3 a 400V / 11 kW / 15 HP) y hasta 40A en cargas resistivas (AC-1)",
      "Tensión nominal de control (bobina): 110V - 120V AC a 50/60 Hz de bajo consumo de atracción y retención",
      "Configuración de polos: 3 polos principales de potencia (3P) con tensión asignada de aislamiento de 690V",
      "Contactos auxiliares incorporados: 1 Normal Abierto (1NA) + 1 Normal Cerrado (1NC) con contactos de espejo",
      "Vida útil mecánica superior: Hasta 10,000,000 de ciclos continuos de operación industrial pesada",
      "Fijación versátil: Montaje universal a presión en riel DIN estándar de 35 mm o atornillado directo a placa",
      "Garantía oficial Siemens de 2 años con despacho inmediato y factura con comprobante fiscal NCF en Santiago"
    ]
  },
  {
    "id": "energia_tesla_wall_connector_gen3",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Tesla",
    "title": "Cargador de Vehículos Eléctricos Tesla Wall Connector Gen 3 (48A / 11.5 kW) con Wi-Fi",
    "desc": "Estación de recarga inteligente de alta potencia para vehículos eléctricos (EV) Tesla Wall Connector Gen 3. Ofrece hasta 48 Amperios (11.5 kW a 240V) permitiendo recuperar hasta 44 millas de autonomía por hora. Equipado con conectividad Wi-Fi de 2.4 GHz para actualizaciones de firmware automáticas, cable liviano y flexible de 24 pies (7.3 metros) de longitud para fácil alcance, gestión inteligente de carga Power Sharing para hasta 6 unidades compartiendo un circuito y monitoreo en tiempo real desde la aplicación móvil Tesla. Con certificación NEMA 3R para instalación en pared interior o exterior protegida.",
    "price": "RD$ 42,500.00",
    "img": "img/productos/catalogo/tesla-wall-connector-gen3.webp",
    "gallery": [
      "img/productos/catalogo/tesla-wall-connector-gen3.webp"
    ],
    "specs": [
      "Potencia máxima de carga: hasta 48A / 11.5 kW en alimentación monofásica o bifásica a 240V",
      "Cable de recarga integrado de 24 pies (7.3 metros) con conector estándar Tesla",
      "Conectividad Wi-Fi 802.11 b/g/n para control de acceso, estadísticas y firmware OTA",
      "Tecnología Power Sharing para equilibrar la potencia entre múltiples estaciones de carga",
      "Certificación NEMA 3R resistente a intemperie para montaje mural en residencial o comercial",
      "Garantía oficial Tesla de 4 años para uso residencial (1 año comercial) con factura NCF"
    ]
  },
  {
    "id": "energia_mitsubishi_cassette_inverter_36k",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Mitsubishi",
    "title": "Aire Acondicionado Comercial Tipo Cassette Inverter Mitsubishi Electric PLA-M 36,000 BTU 4 Vías",
    "desc": "Sistema de climatización comercial tipo cassette de 4 vías para empotrar en falso techo Mitsubishi Electric Serie PLA-M de 36,000 BTU (3 Toneladas de refrigeración). Equipado con tecnología Inverter PAM de compresor rotativo de velocidad variable y calificación de eficiencia estacional hasta 21 SEER. Incorpora el sensor térmico inteligente 3D i-See Sensor que mide la temperatura a nivel del piso y detecta la presencia humana para dirigir el flujo de aire de forma personalizada. Cuenta con bomba de drenaje de condensado de alto levante integrada (hasta 850 mm), panel decorativo ultra delgado con aletas independientes y operación silenciosa con refrigerante ecológico.",
    "price": "RD$ 145,000.00",
    "img": "img/productos/catalogo/mitsubishi-cassette-inverter-36k.webp",
    "gallery": [
      "img/productos/catalogo/mitsubishi-cassette-inverter-36k.webp"
    ],
    "specs": [
      "Capacidad de enfriamiento comercial: 36,000 BTU/h (3.0 Toneladas TR de refrigeración)",
      "Tecnología Inverter PAM ultra eficiente con calificación hasta 21.0 SEER",
      "Diseño para falso techo de 4 vías con control de flujo de aire individual por aleta",
      "Sensor infrarrojo inteligente 3D i-See Sensor para escaneo térmico y ahorro energético",
      "Bomba de condensado de alto levante incorporada de fábrica (850 mm de elevación)",
      "Garantía oficial Mitsubishi Electric de 3 años en compresor y facturación NCF en Santiago"
    ]
  },
  {
    "id": "seguridad_paradox_ip150_modulo_comunicador",
    "department": "seguridad",
    "category": "Sistemas de Seguridad CCTV",
    "brand": "Paradox",
    "title": "Módulo Comunicador de Red IP / Internet Paradox IP150+ para Paneles Spectra y EVO",
    "desc": "Módulo de comunicación IP / Ethernet de alta seguridad Paradox IP150+ diseñado para conectar centrales de alarma Paradox Spectra SP, Magellan y EVO directamente a la red de datos local e Internet. Permite a los usuarios armar, desarmar y verificar el estado del sistema en tiempo real desde la aplicación móvil Insite Gold mediante notificaciones push inmediatas de alarmas, fallas o pánicos. Admite reporte a estaciones centrales de monitoreo receptoras vía protocolo IP/GPRS con cifrado de grado bancario AES-256 / MD5, actualización remota de firmware y conexión plug-and-play con puerto Ethernet 10/100.",
    "price": "RD$ 8,950.00",
    "img": "img/productos/catalogo/paradox-ip150-modulo-comunicador.webp",
    "gallery": [
      "img/productos/catalogo/paradox-ip150-modulo-comunicador.webp"
    ],
    "specs": [
      "Compatibilidad universal con paneles Paradox Spectra SP, Magellan MG5000/MG5050 y EVO192",
      "Conexión Ethernet 10/100 Mbps con indicadores LED de enlace, alimentación y actividad de bus",
      "Soporte completo para app móvil Insite Gold (iOS y Android) y software BabyWare",
      "Transmisión de eventos por correo electrónico y reportes a central receptora por IP",
      "Cifrado de datos AES-256 bits y MD5 para máxima protección contra interceptaciones",
      "Garantía oficial Paradox de 1 año con soporte técnico y configuración en Santiago"
    ]
  },
  {
    "id": "redes_linksys_velop_pro_6e_mesh",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Linksys",
    "title": "Sistema Wi-Fi 6E Mesh Tri-Banda Linksys Velop Pro 6E AXE5400 con Banda de 6 GHz",
    "desc": "Sistema de red inalámbrica en malla (Mesh) de nueva generación Linksys Velop Pro 6E con tecnología Cognitive Mesh y velocidad total combinada AXE5400. Incorpora la nueva banda limpia de 6 GHz libre de interferencias para dispositivos compatibles, complementada por bandas de 5 GHz y 2.4 GHz concurrentes. Cada nodo proporciona una cobertura uniforme de hasta 3,000 pies cuadrados (aproximadamente 275 m²) y gestiona más de 200 dispositivos simultáneos con latencia ultra baja. Incluye 1 puerto Gigabit WAN y 1 puerto Gigabit LAN para conexiones cableadas de alta velocidad y configuración en minutos mediante la app Linksys.",
    "price": "RD$ 18,900.00",
    "img": "img/productos/catalogo/linksys-velop-pro-6e-mesh.webp",
    "gallery": [
      "img/productos/catalogo/linksys-velop-pro-6e-mesh.webp"
    ],
    "specs": [
      "Velocidad Tri-Banda AXE5400: hasta 2402 Mbps en 6 GHz + 2402 Mbps en 5 GHz + 574 Mbps en 2.4 GHz",
      "Banda exclusiva de 6 GHz con canales amplios para streaming 8K y videoconferencias sin congestión",
      "Tecnología Cognitive Mesh para optimización automática de frecuencias y canales en tiempo real",
      "Cobertura continua de hasta 3,000 pies cuadrados y soporte para más de 200 conexiones",
      "Puertos Gigabit Ethernet 10/100/1000 para backhaul cableado o equipos de red de alto consumo",
      "Garantía corporativa Linksys de 2 años con entrega y soporte técnico de Futunet en Santiago"
    ]
  },
  {
    "id": "seguridad_ezviz_h8c_camara_ptz_exterior",
    "department": "seguridad",
    "category": "Sistemas de Seguridad CCTV",
    "brand": "Ezviz",
    "title": "Cámara de Seguridad Wi-Fi PTZ Exterior Ezviz H8c 1080p con Visión Nocturna a Color y Seguimiento IA",
    "desc": "Cámara de seguridad para exteriores tipo domo PTZ motorizada Ezviz H8c con rotación horizontal panorámica de 350 grados e inclinación vertical de 80 grados, eliminando puntos ciegos en patios, estacionamientos y fachadas comerciales en Santiago. Cuenta con resolución Full HD 1080p con compresión de video H.265, visión nocturna a color real las 24 horas del día mediante reflectores LED integrados, detección inteligente de siluetas humanas con seguimiento automático (Auto-Tracking), defensa activa con sirena de advertencia y luz estroboscópica, audio bidireccional para hablar y escuchar, diseño resistente a la intemperie IP65 y ranura para tarjeta microSD de hasta 512 GB.",
    "price": "RD$ 4,850.00",
    "img": "img/productos/catalogo/ezviz-h8c-camara-ptz-exterior.webp",
    "gallery": [
      "img/productos/catalogo/ezviz-h8c-camara-ptz-exterior.webp"
    ],
    "specs": [
      "Cobertura panorámica de 360° con giro horizontal motorizado de 350° e inclinación vertical de 80°",
      "Resolución Full HD 1080p a 30 fps con compresión de video eficiente H.265 / H.264",
      "Detección inteligente de siluetas humanas asistida por IA con seguimiento automático de objetivos",
      "Visión nocturna a color en tiempo real con 4 luces LED y alcance nocturno infrarrojo de hasta 30 metros",
      "Defensa activa con sirena de alta potencia y luz estroboscópica disuasoria ante intrusiones",
      "Comunicación de audio bidireccional con micrófono y altavoz integrados de alta fidelidad",
      "Diseño resistente al agua y polvo IP65 con ranura para tarjeta microSD de hasta 512 GB y almacenamiento en la nube EZVIZ CloudPlay",
      "Garantía oficial Ezviz de 1 año con comprobante fiscal formal NCF y entrega inmediata en Santiago"
    ]
  },
  {
    "id": "oficina_logitech_meetup_videoconferencia_4k",
    "department": "equipos",
    "category": "Equipos de Oficina",
    "brand": "Logitech",
    "title": "Cámara de Videoconferencia Todo en Uno Logitech MeetUp 4K Ultra HD con Micrófonos Integrados",
    "desc": "Sistema de videoconferencia profesional Todo en Uno Logitech MeetUp especialmente diseñado para salas de juntas pequeñas, medianas y despachos ejecutivos (huddle rooms) en Santiago. Cuenta con óptica 4K Ultra HD con campo visual superancho de 120 grados que encuadra perfectamente a todos los asistentes en la mesa sin distorsión. Incorpora cámara motorizada con panorámica (+/- 25°) e inclinación (+/- 15°) con zoom digital 5x HD, tecnología Logitech RightSight de encuadre automático por IA, matriz de 3 micrófonos con formación de haces y tecnología RightSound con cancelación de eco y supresión de ruidos, y potente altavoz optimizado para frecuencias vocales. Certificada para Microsoft Teams, Zoom, Google Meet y Skype for Business.",
    "price": "RD$ 58,900.00",
    "img": "img/productos/catalogo/logitech-meetup-videoconferencia-4k.webp",
    "gallery": [
      "img/productos/catalogo/logitech-meetup-videoconferencia-4k.webp"
    ],
    "specs": [
      "Óptica Ultra HD 4K (hasta 3840 x 2160 a 30 fps) con lente gran angular de 120° libre de distorsión",
      "Panorámica motorizada (+/- 25°) e inclinación (+/- 15°) con zoom digital 5x de alta definición",
      "Tecnología Logitech RightSight para encuadre automático inteligente de los participantes en la sala",
      "Matriz integrada de 3 micrófonos con formación de haces y tecnología RightSound con supresión de eco y ruido ambiente",
      "Altavoz de rango completo afinado acústicamente para máxima inteligibilidad en frecuencias de voz humana",
      "Conectividad Plug and Play USB 2.0 / 3.0 certificada para Microsoft Teams, Zoom, Google Meet y Cisco Webex",
      "Conectividad Bluetooth integrada para emparejamiento de llamadas móviles desde smartphones corporativos",
      "Garantía oficial Logitech de 2 años con comprobante fiscal formal NCF y soporte técnico en Santiago"
    ]
  },
  {
    "id": "seguridad_zkteco_tl400b_cerradura_inteligente",
    "department": "seguridad",
    "category": "Control de Acceso y Asistencia",
    "brand": "ZKTeco",
    "title": "Cerradura Digital Inteligente ZKTeco TL400B Biométrica con Huella, Teclado Táctil y Tarjeta RFID",
    "desc": "Cerradura digital inteligente de alta gama ZKTeco TL400B para puertas principales de oficinas, salas de servidores, despachos ejecutivos y residencias en Santiago. Diseñada con lector biométrico semiconductor de huella digital de respuesta instantánea (menos de 0.5 segundos), teclado táctil capacitivo retroiluminado con soporte de contraseña aleatoria anti-espía, lector de tarjetas de proximidad RFID Mifare (13.56 MHz), llave física oculta de alta seguridad y pestillo embutido europeo de acero inoxidable. Dispone de manija reversible universal, aviso sonoro de batería baja, puerto micro USB externo para alimentación de emergencia con power bank y voz interactiva en español para administración fluida de accesos.",
    "price": "RD$ 12,850.00",
    "img": "img/productos/catalogo/zkteco-tl400b-cerradura-inteligente.webp",
    "gallery": [
      "img/productos/catalogo/zkteco-tl400b-cerradura-inteligente.webp"
    ],
    "specs": [
      "Sensor biométrico semiconductor de huella digital con verificación ultra rápida (< 0.5 segundos)",
      "Teclado táctil capacitivo de alta durabilidad con función de dígitos aleatorios anti-espía",
      "Lector de tarjetas RFID de proximidad Mifare estándar de 13.56 MHz y llave física de emergencia oculta",
      "Capacidad para 100 huellas digitales, 100 contraseñas de usuario y 100 tarjetas RFID",
      "Manija reversible e intercambiable compatible con puertas de madera y metal de 35 mm a 55 mm de espesor",
      "Alimentación autónoma con 4 baterías alcalinas AA de 1.5V con autonomía de más de 12 meses",
      "Puerto micro USB inferior para energización de respaldo con batería externa portátil ante descarga total",
      "Garantía oficial ZKTeco de 1 año con soporte técnico y asesoría de instalación en Santiago"
    ]
  },
  {
    "id": "redes_ubiquiti_unifi_u6_pro_access_point",
    "department": "redes",
    "category": "Redes y Conectividad",
    "brand": "Ubiquiti",
    "title": "Punto de Acceso Wi-Fi 6 Ubiquiti UniFi 6 Pro (U6-Pro) Doble Banda 5.3 Gbps PoE+ para Alta Densidad",
    "desc": "Punto de acceso inalámbrico de grado empresarial y alto rendimiento Ubiquiti UniFi 6 Pro (U6-Pro) diseñado para entornos corporativos de alta densidad en Santiago como naves de zonas francas (PIVEM), centros de convenciones, centros médicos, colegios y oficinas con cientos de dispositivos concurrentes. Ofrece una tasa de transferencia agregada de hasta 5.3 Gbps combinando 4x4 MU-MIMO en la banda de 5 GHz con canales de 160 MHz (hasta 4.8 Gbps) y 2x2 MU-MIMO en la banda de 2.4 GHz (hasta 573.5 Mbps). Soporta más de 350 clientes simultáneos, puerto Gigabit Ethernet PoE+, aislamiento de invitados por VLANs, balanceo de clientes y gestión centralizada sin licencias a través de UniFi Network Application.",
    "price": "RD$ 13,950.00",
    "img": "img/productos/catalogo/ubiquiti-unifi-u6-pro-access-point.webp",
    "gallery": [
      "img/productos/catalogo/ubiquiti-unifi-u6-pro-access-point.webp"
    ],
    "specs": [
      "Tecnología Wi-Fi 6 (802.11ax) de ultra alta velocidad con tasa inalámbrica agregada de hasta 5.3 Gbps",
      "Banda de 5 GHz con 4x4 MU-MIMO y OFDMA con soporte de canales anchos de 160 MHz (tasa de 4.8 Gbps)",
      "Banda de 2.4 GHz con 2x2 MU-MIMO y OFDMA para dispositivos IoT y legado (tasa de 573.5 Mbps)",
      "Capacidad masiva de conexión concurrente para más de 350 dispositivos sin degradación de velocidad",
      "Puerto Gigabit Ethernet 10/100/1000 con alimentación PoE / PoE+ estándar 802.3at",
      "Gestión centralizada en la nube mediante UniFi Network Application (sin suscripciones ni licencias periódicas)",
      "Carcasa con certificación climática IP54 para instalación versátil en techo o pared con herrajes incluidos",
      "Garantía corporativa Ubiquiti de 1 año con soporte técnico y facturación con comprobante fiscal NCF en Santiago"
    ]
  },
  {
    "id": "oficina_samsung_flip_pro_65_interactiva",
    "department": "equipos",
    "category": "Equipos de Oficina",
    "brand": "Samsung",
    "title": "Pantalla Interactiva Táctil Samsung Flip Pro 65\" 4K UHD para Salas de Juntas y Colaboración",
    "desc": "Pantalla táctil interactiva profesional de 65 pulgadas Samsung Flip Pro (serie WM65B) diseñada para salas de conferencias ejecutivas, centros de diseño, aulas universitarias y espacios de coworking en Santiago. Ofrece resolución 4K Ultra HD con panel antirreflejo y tecnología táctil de vanguardia que admite hasta 20 puntos táctiles simultáneos y escritura suave y fluida con lápiz interactivo de baja latencia (26 ms). Dispone de conectividad avanzada USB-C 3-en-1 (video, control táctil y suministro de energía PD de 65W a laptops), puertos HDMI, DisplayPort, salida de audio, conectividad Wi-Fi y Bluetooth, altavoces estéreo de 40W (4 canales x 10W), sensor de luz ambiental y ranura para módulo OPS estándar para integración con PC Windows empresarial.",
    "price": "RD$ 115,000.00",
    "img": "img/productos/catalogo/samsung-flip-pro-65-pantalla-interactiva.webp",
    "gallery": [
      "img/productos/catalogo/samsung-flip-pro-65-pantalla-interactiva.webp"
    ],
    "specs": [
      "Pantalla interactiva de 65 pulgadas con panel IPS 4K Ultra HD (3840 x 2160) y revestimiento antirreflejo",
      "Tecnología táctil capacitiva infrarroja con hasta 20 puntos multitoque simultáneos y latencia mínima de 26 ms",
      "Lápiz táctil pasivo de precisión con detección de punta y borrado magnético sin baterías",
      "Puerto USB-C multifunción con transmisión de pantalla 4K, retorno táctil y carga rápida Power Delivery de 65W",
      "Duplicación de pantalla inalámbrica hasta 4 dispositivos simultáneos con Samsung SmartView+, Apple AirPlay 2 y Miracast",
      "Sistema de sonido envolvente de 40W (4 x 10W) integrado y matriz de sensores de presencia y luminosidad ambiental",
      "Ranura estándar OPS (Open Pluggable Specification) para instalación de módulo PC con Windows empresarial",
      "Garantía comercial Samsung de 3 años con comprobante fiscal formal NCF y entrega directa en Santiago"
    ]
  },
  {
    "id": "oficina_dell_precision_3660_workstation",
    "department": "equipos",
    "category": "Equipos de Oficina",
    "brand": "Dell",
    "title": "Estación de Trabajo en Torre Dell Precision 3660 Workstation (Core i7-13700, 32GB DDR5, NVIDIA RTX, 1TB SSD)",
    "desc": "Estación de trabajo profesional de alto rendimiento en formato torre Dell Precision 3660 diseñada para arquitectos, ingenieros civiles, diseñadores industriales y creadores de contenido 3D en Santiago. Potenciada por procesador Intel Core i7-13700 (16 núcleos, 24 hilos, hasta 5.2 GHz), 32 GB de memoria RAM DDR5 de alta velocidad (expandible a 128 GB), tarjeta gráfica profesional dedicada NVIDIA RTX con certificación ISV para máxima estabilidad en AutoCAD, Revit, ArchiCAD, 3ds Max y SolidWorks, unidad de almacenamiento de estado sólido M.2 PCIe Gen4 NVMe de 1 TB para arranque instantáneo de proyectos masivos y disco duro complementario de 2 TB a 7200 RPM para archivo de planos. Chasis con flujo de aire optimizado, puertos frontales USB-C y USB 3.2 de alta velocidad, lector de tarjetas SD y sistema operativo Windows 11 Pro con Dell Optimizer for Precision.",
    "price": "RD$ 89,500.00",
    "img": "img/productos/catalogo/dell-precision-3660-tower-workstation.webp",
    "gallery": [
      "img/productos/catalogo/dell-precision-3660-tower-workstation.webp"
    ],
    "specs": [
      "Procesador Intel Core i7-13700 de 13.ª generación (16 núcleos: 8 de rendimiento + 8 de eficiencia, 24 subprocesos, hasta 5.2 GHz)",
      "Memoria RAM de 32 GB DDR5 a 4400 MHz en doble canal (ampliable hasta 128 GB con soporte ECC)",
      "Tarjeta gráfica profesional dedicada NVIDIA RTX con 12 GB de VRAM GDDR6 y certificación de software independiente ISV",
      "Almacenamiento híbrido de alta velocidad: 1 TB SSD M.2 NVMe PCIe 4.0 Class 40 + 2 TB HDD SATA de 7200 RPM",
      "Chasis torre industrial Dell con enfriamiento avanzado silencioso y fuente de poder de 500W 80 Plus Platinum",
      "Conectividad frontal USB 3.2 Gen 2x2 Type-C (20 Gbps), 3x USB 3.2 Gen 1, lector de tarjetas SD y conector de audio universal",
      "Conectividad de red Ethernet Gigabit Intel I219-LM con soporte de administración remota",
      "Garantía empresarial Dell ProSupport de 3 años con servicio técnico en sitio al siguiente día hábil en Santiago"
    ]
  },
  {
    "id": "energia_apc_metered_rack_pdu_120v",
    "department": "energia",
    "category": "Protección Eléctrica",
    "brand": "Schneider Electric",
    "title": "Unidad PDU Administrable para Rack APC by Schneider Electric Metered 120V 20A con Pantalla LCD y Red SNMP",
    "desc": "Unidad de distribución de energía inteligente para rack (Rack PDU Metered) APC by Schneider Electric de grado data center diseñada para centros de datos, cuartos de cableado y salas de servidores en Santiago. Proporciona distribución de energía confiable a 120V con capacidad de corriente de 20A a través de 16 salidas NEMA 5-20R con retención segura de cables. Incorpora pantalla digital LCD frontal para monitoreo local en tiempo real del amperaje consumido, previniendo sobrecargas de circuito antes de que ocurran fallas. Cuenta con tarjeta de gestión de red integrada con interfaz web HTTP/HTTPS, compatibilidad SNMP v1/v2c/v3, registro de eventos, alarmas auditivas y compatibilidad con plataformas de gestión de infraestructura de centros de datos (DCIM) como StruxureWare Data Center Expert.",
    "price": "RD$ 22,400.00",
    "img": "img/productos/catalogo/apc-schneider-metered-rack-pdu-120v.webp",
    "gallery": [
      "img/productos/catalogo/apc-schneider-metered-rack-pdu-120v.webp"
    ],
    "specs": [
      "Voltaje nominal de entrada y salida: 120V AC monofásico (50/60 Hz) con capacidad de 20A (desclasificado a 16A continuo)",
      "Distribución de energía mediante 16 tomas de corriente NEMA 5-20R protegidas contra desconexión accidental",
      "Conector de entrada de alta corriente NEMA 5-20P / L5-20P con cable de alimentación de 3 metros (10 pies)",
      "Pantalla digital LCD integrada que indica la corriente consumida en amperios (A) con precisión de ±2%",
      "Puerto de red Ethernet 10/100 Base-T para administración remota vía navegador Web, SNMP v1/v3 y Telnet/SSH",
      "Configuración de umbrales de alarma de sobrecarga para recibir notificaciones preventivas por correo electrónico y traps SNMP",
      "Factor de forma universal apto para montaje horizontal 1U / 2U en rack de 19 pulgadas o montaje vertical 0U",
      "Garantía oficial de 2 años de APC by Schneider Electric con comprobante fiscal formal NCF en Santiago"
    ]
  },
  {
    "id": "seguridad_dahua_terminal_facial_acceso_ia",
    "department": "seguridad",
    "category": "Control de Acceso y Asistencia",
    "brand": "Dahua",
    "title": "Terminal Biométrica de Control de Acceso Facial Dahua con Inteligencia Artificial y Pantalla Táctil 4.3\"",
    "desc": "Terminal autónoma inteligente de control de acceso y asistencia de personal Dahua Technology (modelo ASI3213G-W) para empresas, instituciones médicas, naves industriales y residencias en Santiago. Equipada con algoritmo de aprendizaje profundo (Deep Learning) con reconocimiento facial ultra veloz (menos de 0.2 segundos por persona) a distancias de 0.3 a 1.5 metros, sin requerir contacto físico. Integra óptica dual de 2 megapíxeles (lente de color con WDR real de 120 dB y lente infrarroja) con potente algoritmo de detección de vida real que bloquea intentos de suplantación con fotografías, pantallas de celular o máscaras. Dispone de pantalla táctil capacitiva a color de 4.3 pulgadas (480 x 272), lector de tarjetas de proximidad Mifare/IC, conectividad Wi-Fi integrada y Ethernet TCP/IP, entrada y salida Wiegand/RS-485, y relé de contacto seco para apertura de cerraduras electromagnéticas y torniquetes.",
    "price": "RD$ 14,900.00",
    "img": "img/productos/catalogo/dahua-terminal-reconocimiento-facial-ia.webp",
    "gallery": [
      "img/productos/catalogo/dahua-terminal-reconocimiento-facial-ia.webp"
    ],
    "specs": [
      "Pantalla táctil LCD capacitiva a color de 4.3 pulgadas con resolución de 480 x 272 píxeles",
      "Cámara dual de 2 MP con sensor CMOS progresivo de luz estelar, WDR amplio de 120 dB e iluminación infrarroja automática",
      "Algoritmo de reconocimiento facial asistido por IA con precisión superior al 99.5% y velocidad < 0.2 segundos",
      "Detección de presencia real (Liveness Detection) que previene eficazmente fraudes con fotos impresas o videos digitales",
      "Capacidad de almacenamiento local para 1,500 rostros, 3,000 tarjetas de proximidad IC Mifare (13.56 MHz) y 150,000 registros",
      "Conectividad de red flexible con puerto Ethernet 10/100 Mbps y conexión inalámbrica Wi-Fi 2.4 GHz integrada",
      "Múltiples interfaces de control: relé de cerradura de puerta, sensor de puerta magnético, botón de salida y alarma de tamper",
      "Garantía oficial Dahua Technology de 1 año con comprobante fiscal formal NCF y asesoría de configuración en Santiago"
    ]
  },
  {
    "id": "oficina_lg_34wp500_ultrawide_34_ips",
    "department": "equipos",
    "category": "Monitores",
    "brand": "LG",
    "title": "Monitor UltraWide LG 34WP500-B 34 Pulgadas IPS WFHD (2560x1080) 75Hz HDR10 con Doble HDMI y Control en Pantalla",
    "desc": "Monitor profesional panorámico UltraWide de 34 pulgadas LG (modelo 34WP500-B) con relación de aspecto 21:9 para estaciones de trabajo corporativas, firmas de contabilidad, programación y edición audiovisual en Santiago. Su panel IPS de resolución WFHD (2560 x 1080) ofrece ángulos de visión de 178 grados y una fidelidad de color excepcional con cobertura del 95% del espectro sRGB y soporte HDR10. La amplitud panorámica permite reemplazar configuraciones de doble pantalla sin marcos divisorios molestos, optimizando la multitarea mediante el software LG OnScreen Control con división de pantalla personalizable en hasta 4 cuadrantes. Incorpora frecuencia de actualización de 75 Hz con AMD FreeSync, modo Dynamic Action Sync para respuesta inmediata, estabilizador de negros y tecnologías Flicker Safe y Modo Lectura que reducen el cansancio ocular en jornadas laborales prolongadas.",
    "price": "RD$ 22,500.00",
    "img": "img/productos/catalogo/lg-34wp500-monitor-ultrawide-34.webp",
    "gallery": [
      "img/productos/catalogo/lg-34wp500-monitor-ultrawide-34.webp"
    ],
    "specs": [
      "Pantalla UltraWide de 34 pulgadas en formato 21:9 con panel IPS antirreflejo y ángulos de visión de 178°/178°",
      "Resolución WFHD de 2560 x 1080 píxeles con un 33% más de espacio de visualización que un monitor Full HD estándar",
      "Compatibilidad con HDR10 (High Dynamic Range) y gama cromática 95% sRGB con calibración de color de fábrica",
      "Frecuencia de refresco fluida de 75 Hz con soporte de sincronización adaptativa AMD FreeSync para eliminar el desgarro de imagen",
      "Conectividad con doble puerto HDMI 2.0 y salida para auriculares estéreo de 3.5 mm",
      "Software LG OnScreen Control con función Screen Split para segmentación eficiente de ventanas de trabajo",
      "Protección ocular con tecnologías Flicker Safe y Reader Mode para lectura confortable de documentos",
      "Soporte de inclinación ergonómico y compatibilidad total con montaje en brazo o pared VESA (100 x 100 mm)",
      "Garantía oficial LG de 3 años con comprobante fiscal formal NCF y entrega garantizada en Santiago"
    ]
  },
  {
    "id": "redes_mikrotik_hap_ax3_wifi6_router",
    "department": "redes",
    "category": "Routers y Redes",
    "brand": "MikroTik",
    "title": "Router Inalámbrico Wi-Fi 6 MikroTik hAP ax³ (C53UiG+5HPaxD2HPaxD) AX1800 Dual-Band Gigabit con 1x 2.5 GbE y RouterOS v7",
    "desc": "Router inalámbrico corporativo de alta gama MikroTik hAP ax³ (código C53UiG+5HPaxD2HPaxD) equipado con el estándar Wi-Fi 6 (802.11ax) y radio de alta potencia para oficinas exigentes, residencias premium y proveedores de servicios de internet en Santiago. Impulsado por un procesador Quad-Core Qualcomm IPQ-6010 a 1.8 GHz de arquitectura ARM de 64 bits con 1 GB de memoria RAM DDR3L y 128 MB de almacenamiento NAND, diseñado para manejar balanceo de carga Multi-WAN masivo, túneles VPN WireGuard e IPsec a velocidad de enlace, cortafuegos con inspección profunda de paquetes y contenedores Docker integrados. Cuenta con 4 puertos Gigabit Ethernet 10/100/1000, 1 puerto 2.5 Gigabit Ethernet (2.5G) para troncales de fibra de alta velocidad, 1 puerto USB 3.0 tipo A para almacenamiento o módem LTE, y antenas omnidireccionales externas de alta ganancia (hasta 5.5 dBi) para cobertura óptima en 2.4 GHz y 5 GHz.",
    "price": "RD$ 9,850.00",
    "img": "img/productos/catalogo/mikrotik-hap-ax3-wifi6-router.webp",
    "gallery": [
      "img/productos/catalogo/mikrotik-hap-ax3-wifi6-router.webp"
    ],
    "specs": [
      "Procesador Quad-Core ARM de 64 bits IPQ-6010 a 1.8 GHz con aceleración de cifrado por hardware",
      "Memoria de trabajo de 1 GB RAM DDR3L y 128 MB de almacenamiento flash NAND para RouterOS v7 nivel 6",
      "Wi-Fi 6 de doble banda concurrente: hasta 1201 Mbps en 5 GHz (802.11ax) y hasta 574 Mbps en 2.4 GHz (802.11ax)",
      "Antenas omnidireccionales desmontables externas con ganancia de hasta 5.5 dBi y tecnología MU-MIMO 2x2",
      "1 Puerto 2.5 Gigabit Ethernet (100M/1G/2.5G) compatible con enlaces WAN de ultra alta velocidad",
      "4 Puertos Gigabit Ethernet RJ-45 independientes (10/100/1000 Mbps) para conectividad LAN y switches",
      "Soporte de PoE-in pasivo (puerto 1) y PoE-out pasivo (puerto 5) para energizar otros equipos de red",
      "Puerto USB 3.0 tipo A multifunción para almacenamiento en red, servidores SMB o módems 4G/5G de contingencia",
      "Garantía oficial MikroTik de 1 año con soporte de configuración RouterOS y factura formal NCF en Santiago"
    ]
  },
  {
    "id": "redes_cisco_business_cbs350_8p_poe_switch",
    "department": "redes",
    "category": "Switches",
    "brand": "Cisco",
    "title": "Switch Administrable Cisco Business CBS350-8P-E-2G de 8 Puertos Gigabit PoE+ (Presupuesto 67W) con 2 Puertos Combo SFP Capa 3",
    "desc": "Switch administrable empresarial compacto de Capa 3 Cisco Business 350 Series (modelo CBS350-8P-E-2G) diseñado para sucursales corporativas, clínicas, salas de servidores y centros de monitoreo en Santiago. Ofrece 8 puertos Gigabit Ethernet 10/100/1000 con soporte Power over Ethernet Plus (PoE+ 802.3at/af) que entregan hasta 30 Watts por puerto con un presupuesto total de alimentación de 67W para energizar teléfonos IP ejecutivos, cámaras de seguridad de alta resolución y puntos de acceso Wi-Fi 6. Incluye 2 puertos de enlace ascendente combinados Gigabit RJ-45 / ranuras SFP para enlaces de fibra óptica de larga distancia. Proporciona enrutamiento estático IPv4/IPv6 de Capa 3, listas de control de acceso (ACL), inspección ARP dinámica, protección de puertos 802.1X, calidad de servicio avanzada (QoS) y administración centralizada mediante interfaz web en español o Cisco Business Dashboard.",
    "price": "RD$ 19,500.00",
    "img": "img/productos/catalogo/cisco-business-cbs350-8p-poe-switch.webp",
    "gallery": [
      "img/productos/catalogo/cisco-business-cbs350-8p-poe-switch.webp"
    ],
    "specs": [
      "8 Puertos Gigabit Ethernet 10/100/1000 Mbps con soporte completo PoE+ IEEE 802.3at/af con presupuesto total de 67W",
      "2 Puertos uplink combo de cobre Gigabit RJ-45 o fibra óptica SFP para interconexión troncal de red",
      "Capacidad de conmutación de 20 Gbps con una tasa de reenvío de 14.88 millones de paquetes por segundo (Mpps)",
      "Capacidades de enrutamiento estático de Capa 3 para segmentación de tráfico eficiente entre VLANs sin saturar el router de borde",
      "Seguridad perimetral integrada: seguridad de primer salto IPv6, inspección dinámica ARP, DHCP Snooping y 802.1X",
      "Calidad de servicio avanzada (QoS) con colas de prioridad estricta para tráfico de voz sobre IP (VoIP) y video en tiempo real",
      "Diseño de chasis metálico compacto sin ventilador (fanless) para operación 100% silenciosa en escritorios o racks",
      "Gestión simplificada a través de panel Web intuitivo con asistente en español, soporte SNMP v1/v2c/v3 y CLI",
      "Garantía oficial limitada de por vida de Cisco con soporte técnico empresarial y facturación formal con NCF en Santiago"
    ]
  },
  {
    "id": "energia_apc_smart_ups_smt1500c_1500va",
    "department": "energia",
    "category": "Protección Eléctrica",
    "brand": "Schneider Electric",
    "title": "Sistema UPS Interactivo APC Smart-UPS SMT1500C 1440VA / 1000W Onda Senoidal Pura con Pantalla LCD y Monitoreo Cloud SmartConnect",
    "desc": "Sistema de alimentación ininterrumpida (UPS) de línea interactiva de grado corporativo APC Smart-UPS SMT1500C fabricado por Schneider Electric para servidores de virtualización, almacenamiento NAS empresarial, conmutadores troncales y equipos médicos sensibles en Santiago. Entrega una capacidad de 1440VA / 1000 Watts con salida de onda senoidal pura sin distorsión armónica, garantizando compatibilidad total con fuentes de poder modernas de corrección de factor de potencia activo (PFC). Incorpora pantalla LCD alfanumérica interactiva frontal con navegación intuitiva para consultar voltaje de entrada/salida, porcentaje de carga, autonomía estimada y estado de baterías. Destaca por su conectividad en la nube APC SmartConnect mediante puerto Ethernet dedicado que proporciona monitoreo remoto seguro y notificaciones automáticas proactivas de mantenimiento. Cuenta con 8 tomas NEMA 5-15R con grupos de tomas conmutables independientes, regulación automática de voltaje AVR y ranura SmartSlot para tarjetas de gestión SNMP opcionales.",
    "price": "RD$ 38,900.00",
    "img": "img/productos/catalogo/apc-smart-ups-smt1500c-senoidal-puro.webp",
    "gallery": [
      "img/productos/catalogo/apc-smart-ups-smt1500c-senoidal-puro.webp"
    ],
    "specs": [
      "Capacidad de potencia de 1440VA / 1000 Watts en topología de línea interactiva con salida de onda senoidal pura",
      "8 Tomas de corriente protegidas NEMA 5-15R divididas en grupos conmutados para reinicio remoto selectivo de cargas",
      "Regulación Automática de Voltaje (AVR) Boost & Trim que estabiliza caídas de tensión (hasta 82V) y sobrevoltajes (hasta 144V) sin consumir batería",
      "Pantalla LCD gráfica frontal con teclas de menú y luces LED de estado para supervisión inmediata de energía y fallas",
      "Función APC SmartConnect con puerto Ethernet integrado para monitoreo remoto automatizado en la nube sin costo adicional",
      "Gestión de batería inteligente (Battery Management) con compensación de temperatura que prolonga la vida útil de los acumuladores",
      "Puertos de comunicación serial DB-9 y USB compatibles con el software de apagado seguro desatendido PowerChute Business Edition",
      "Ranura SmartSlot para instalación de tarjetas accesorias de administración de red (AP9630/AP9640/AP9641)",
      "Garantía oficial de 3 años para el equipo y 2 años para la batería con comprobante fiscal formal NCF en Santiago"
    ]
  },
  {
    "id": "oficina_lenovo_thinkpad_e16_corporativa",
    "department": "oficina",
    "category": "Laptops y Portátiles",
    "brand": "Lenovo",
    "title": "Laptop Corporativa Lenovo ThinkPad E16 Gen 1 16\" WUXGA 16:10 Intel Core i7-1355U 16GB RAM 512GB SSD Teclado Numérico",
    "desc": "Laptop corporativa de alto rendimiento Lenovo ThinkPad E16 Gen 1 diseñada para firmas contables, analistas financieros, despachos legales y gerencias en Santiago. Equipada con pantalla de 16 pulgadas IPS WUXGA (1920 x 1200) antirreflejo en formato de productividad 16:10 y procesador Intel Core i7-1355U de 13.ª generación (10 núcleos, 12 hilos, hasta 5.0 GHz con gráficos Intel Iris Xe). Cuenta con 16 GB de memoria RAM DDR4 a 3200 MHz (expandible hasta 40 GB) y almacenamiento ultra rápido de 512 GB SSD NVMe M.2 PCIe Gen4 con ranura M.2 libre adicional para expansión. Integra teclado ergonómico ThinkPad resistente a salpicaduras en español con bloque numérico completo independiente para digitación veloz de balances y comprobantes fiscales NCF, icónico botón de navegación TrackPoint rojo, cámara web FHD 1080p con obturador de privacidad ThinkShutter, lector de huella dactilar integrado en el botón de encendido y certificación militar MIL-STD-810H de durabilidad extrema.",
    "price": "RD$ 62,500.00",
    "img": "img/productos/catalogo/lenovo-thinkpad-e16-laptop-corporativa.webp",
    "gallery": [
      "img/productos/catalogo/lenovo-thinkpad-e16-laptop-corporativa.webp"
    ],
    "specs": [
      "Pantalla IPS antirreflejo de 16 pulgadas WUXGA (1920 x 1200) formato 16:10 con 300 nits de brillo",
      "Procesador Intel Core i7-1355U de 13.ª generación (10 núcleos, hasta 5.0 GHz con 12 MB Intel Smart Cache)",
      "Memoria RAM de 16 GB DDR4 3200 MHz (expandible hasta 40 GB para multitarea pesada)",
      "Almacenamiento de 512 GB SSD M.2 PCIe 4.0 NVMe con bahía libre secundaria M.2 para expansión futura",
      "Teclado ergonómico retroiluminado en español con teclado numérico dedicado y TrackPoint",
      "Seguridad corporativa: Chip dTPM 2.0, lector de huellas en botón y obturador físico ThinkShutter",
      "Conectividad integral: USB-C Thunderbolt 4 / USB 3.2 Gen 2, HDMI 2.1, RJ-45 Gigabit Ethernet y Wi-Fi 6",
      "Chasis reforzado con tapa de aluminio y certificación de resistencia militar MIL-STD-810H",
      "Garantía oficial Lenovo de 1 año con soporte empresarial y comprobante fiscal formal NCF en Santiago"
    ]
  },
  {
    "id": "redes_tplink_omada_eap653_wifi6_ap",
    "department": "redes",
    "category": "Puntos de Acceso Wi-Fi",
    "brand": "TP-Link",
    "title": "Punto de Acceso Wi-Fi 6 TP-Link Omada EAP653 AX3000 de Techo Gigabit PoE+ con Gestión Cloud Centralizada SDN",
    "desc": "Punto de acceso inalámbrico empresarial de montaje en techo o pared TP-Link Omada EAP653 con tecnología Wi-Fi 6 (802.11ax) de doble banda y diseño ultra delgado (ultra-slim) para hoteles, restaurantes, clínicas y oficinas corporativas en Santiago. Proporciona velocidades inalámbricas combinadas de hasta 2976 Mbps (2402 Mbps en 5 GHz y 574 Mbps en 2.4 GHz) con tecnologías avanzadas OFDMA, MU-MIMO y 1024-QAM para entornos de alta densidad de usuarios concurrentes. Cuenta con un puerto Gigabit Ethernet 10/100/1000 compatible con alimentación Power over Ethernet Plus (PoE+ 802.3at) o fuente directa 12V DC. Totalmente integrado en el ecosistema Omada SDN con gestión centralizada gratuita en la nube, portal cautivo personalizable para clientes e invitados con vouchers y autenticación por SMS, roaming continuo y transparente (802.11k/v) y seguridad empresarial WPA3.",
    "price": "RD$ 8,950.00",
    "img": "img/productos/catalogo/tplink-omada-eap653-wifi6-ap.webp",
    "gallery": [
      "img/productos/catalogo/tplink-omada-eap653-wifi6-ap.webp"
    ],
    "specs": [
      "Velocidades Wi-Fi 6 ultra rápidas AX3000: 2402 Mbps simultáneos en 5 GHz y 574 Mbps en 2.4 GHz",
      "Puerto de red Gigabit Ethernet 10/100/1000 Mbps con alimentación PoE+ 802.3at estándar",
      "Diseño ultra compacto y elegante de perfil bajo para montaje estético en techos o muros",
      "Integración total en plataforma Omada SDN para monitoreo y administración masiva remota en la nube",
      "Capacidad de alta densidad con balanceo de carga automático, Band Steering y Airtime Fairness",
      "Portal cautivo profesional multi-método (Voucher, SMS, Facebook Wi-Fi) para redes de invitados",
      "Roaming fluido y transparente 802.11k/v que evita caídas al desplazarse entre áreas de cobertura",
      "Cifrado de máxima seguridad empresarial WPA3-Personal y WPA3-Enterprise",
      "Garantía oficial TP-Link de 3 años con comprobante fiscal formal NCF y entrega directa en Santiago"
    ]
  },
  {
    "id": "oficina_epson_ecotank_l5590_multifuncional",
    "department": "equipos",
    "category": "Impresoras y Escáneres",
    "brand": "Epson",
    "title": "Impresora Multifuncional Epson EcoTank L5590 4-en-1 Tinta Continua con ADF 30 Hojas Red Ethernet y Wi-Fi Direct",
    "desc": "Impresora multifuncional 4-en-1 de tanque de tinta continua original Epson EcoTank L5590 (impresora, copiadora, escáner y fax) de alta productividad para oficinas, consultorios médicos, notarías y departamentos contables en Santiago. Cuenta con un alimentador automático de documentos (ADF) de 30 páginas para digitalizar y copiar contratos, facturas y expedientes de múltiples hojas de forma desatendida. Incorpora conectividad de red por cable Ethernet 10/100 RJ-45 más Wi-Fi y Wi-Fi Direct para compartir en red local sin depender de una PC intermediaria, pantalla LCD a color de 1.44 pulgadas para manejo autónomo sin computadora y compatibilidad con botellas de tinta originales Epson serie 544 de llenado EcoFit antiderrame, con un rendimiento de hasta 4,500 páginas en negro y 7,500 páginas a color para un costo de impresión por página ultra reducido.",
    "price": "RD$ 19,800.00",
    "img": "img/productos/catalogo/epson-ecotank-l5590-multifuncional.webp",
    "gallery": [
      "img/productos/catalogo/epson-ecotank-l5590-multifuncional.webp"
    ],
    "specs": [
      "Multifuncional 4-en-1 de tanque continuo: Imprime, copia, escanea y envía fax de forma profesional",
      "Alimentador Automático de Documentos (ADF) de 30 hojas para copiado y digitalización continua",
      "Conexión de red dual: Cableada Ethernet 10/100 Mbps y red inalámbrica Wi-Fi con Wi-Fi Direct",
      "Pantalla LCD a color de 1.44 pulgadas con botonera intuitiva para copiado autónomo rápido",
      "Velocidad de impresión de hasta 33 páginas por minuto (ppm) en negro y 15 ppm en color",
      "Tecnología Heat-Free MicroPiezo que no requiere calentamiento, ahorrando energía y desgaste de piezas",
      "Rendimiento extraordinario: Botellas EcoFit 544 para hasta 4,500 páginas en negro y 7,500 a color",
      "Soporte completo de impresión móvil con Epson Smart Panel, Apple AirPrint y Mopria Print Service",
      "Garantía oficial Epson de hasta 2 años registrando el equipo con factura formal NCF en Santiago"
    ]
  },
  {
    "id": "seguridad_hikvision_acusense_4k_camara_ip",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Hikvision",
    "title": "Cámara IP Domo Hikvision AcuSense 4K 8MP (DS-2CD2183G2-IU) con Clasificación IA de Humanos y Vehículos y Micrófono Integrado",
    "desc": "Cámara de seguridad IP formato domo antivandálico de ultra alta definición 4K (8 Megapíxeles) Hikvision AcuSense (modelo DS-2CD2183G2-IU) con Inteligencia Artificial basada en algoritmos de Deep Learning para clasificación precisa de objetivos humanos y vehiculares, filtrando más del 90% de falsas alarmas causadas por lluvia, viento, hojas, insectos o mascotas en condominios, naves industriales y plazas comerciales en Santiago. Ofrece una resolución cristalina de 3840 x 2160 píxeles a 20 cuadros por segundo con sensor CMOS de barrido progresivo de 1/2.8\", lente fijo gran angular de 2.8 mm (campo de visión de 107°), iluminación infrarroja avanzada EXIR 2.0 con alcance de hasta 30 metros, amplio rango dinámico WDR de 120 dB para compensar contraluces intensos, micrófono de alta fidelidad incorporado para audio ambiental en tiempo real, ranura para memoria microSD de hasta 512 GB para almacenamiento local autónomo, compresión inteligente H.265+ y robusto chasis metálico con certificación IP67 contra agua y polvo y protección antivandálica IK10.",
    "price": "RD$ 10,950.00",
    "img": "img/productos/catalogo/hikvision-acusense-4k-camara-ip.webp",
    "gallery": [
      "img/productos/catalogo/hikvision-acusense-4k-camara-ip.webp"
    ],
    "specs": [
      "Sensor de imagen de 8 Megapíxeles (3840 x 2160) con calidad de video 4K Ultra HD de máxima nitidez",
      "Tecnología AcuSense con Deep Learning para detección y clasificación selectiva de humanos y vehículos",
      "Micrófono ambiental integrado de alta sensibilidad con filtro de ruido para evidencia de audio en directo",
      "Lente fijo de 2.8 mm con cobertura panorámica de 107° en horizontal y 57° en vertical",
      "Visión nocturna por infrarrojos EXIR 2.0 con alcance efectivo de hasta 30 metros en oscuridad total",
      "Tecnología True WDR de 120 dB y 3D DNR para imágenes nítidas ante fuertes contraluces y reflejos",
      "Ranura interna para tarjeta de memoria MicroSD / MicroSDHC / MicroSDXC de hasta 512 GB",
      "Protección extrema para exteriores: Certificación IP67 intemperie y chasis antivandálico IK10",
      "Garantía oficial Hikvision de 2 años con asesoría técnica y facturación formal con NCF en Santiago"
    ]
  },
  {
    "id": "redes_linksys_lrt224_dualwan_vpn_router",
    "department": "redes",
    "category": "Routers y Redes",
    "brand": "Linksys",
    "title": "Router VPN Empresarial Dual-WAN Gigabit Linksys LRT224 con Balanceo de Carga y Failover Automático",
    "desc": "Router VPN de nivel empresarial Linksys LRT224 con doble puerto WAN Gigabit Ethernet para balanceo de carga y respaldo redundante con conmutación por error automática entre dos proveedores de internet (Claro y Altice) en empresas, despachos y oficinas de Santiago. Dispone de 4 puertos LAN Gigabit Ethernet 10/100/1000 con soporte de VLAN 802.1Q para segmentación de tráfico de red, servidor OpenVPN integrado con soporte para hasta 5 túneles de empleados remotos y hasta 50 túneles VPN IPSec de sitio a sitio acelerados por hardware con cifrado DES, 3DES y AES. Incorpora un avanzado cortafuegos SPI con inspección exhaustiva de paquetes (DoS/DDoS), filtrado web por URL y control de acceso por IP/MAC. Chasis metálico robusto y silencioso sin ventilador (fanless) ideal para montaje en pared o escritorio corporativo.",
    "price": "RD$ 14,850.00",
    "img": "img/productos/catalogo/linksys-lrt224-dualwan-vpn-router.webp",
    "gallery": [
      "img/productos/catalogo/linksys-lrt224-dualwan-vpn-router.webp"
    ],
    "specs": [
      "Doble puerto WAN Gigabit Ethernet 10/100/1000 con balanceo de carga y failover automático Claro/Altice",
      "4 puertos LAN Gigabit Ethernet con soporte de VLAN 802.1Q para segmentación departamental segura",
      "Servidor VPN empresarial: Hasta 50 túneles IPSec sitio a sitio y 5 túneles OpenVPN concurrentes",
      "Aceleración VPN por hardware con soporte de cifrado avanzado DES, 3DES, AES-128, AES-192 y AES-256",
      "Cortafuegos SPI integrado con prevención contra ataques de denegación de servicio (DoS / DDoS)",
      "Filtrado de contenidos URL por dominios y control de acceso seguro por direcciones IP y MAC",
      "Gestión intuitiva mediante interfaz web HTTPS con estadísticas de tráfico en tiempo real y diagnóstico",
      "Chasis metálico industrial Fanless silencioso para operación continua 24/7 en empresas y oficinas",
      "Garantía corporativa oficial Linksys de 2 años con comprobante fiscal formal NCF en Santiago"
    ]
  },
  {
    "id": "redes_netgear_gs724tp_24p_gigabit_poe_switch",
    "department": "redes",
    "category": "Switches de Red",
    "brand": "Netgear",
    "title": "Switch Administrable Netgear Smart Managed Pro GS724TPv2 24 Puertos Gigabit PoE+ (190W) con 2 Puertos SFP para Rack",
    "desc": "Switch administrable de 24 puertos Gigabit Ethernet Netgear Smart Managed Pro GS724TPv2 con alimentación PoE+ (802.3at) en todos los 24 puertos y un presupuesto total de energía de 190 Watts, ideal para alimentar cámaras de seguridad IP, domos PTZ, puntos de acceso Wi-Fi 6 y teléfonos VoIP en redes corporativas en Santiago. Incluye 2 puertos de fibra óptica SFP Gigabit 1000Base-X dedicados para enlaces troncales de largo alcance a centros de datos o racks secundarios. Ofrece amplias capacidades de capa 2/2+ (L2/L2+), incluyendo VLANs 802.1Q, priorización de tráfico QoS avanzada, snooping IGMP para transmisiones de video multicast, listas de control de acceso (ACL L2/L3/L4), autenticación de puertos 802.1X y prevención de tormentas. Chasis metálico de 1U para montaje en rack de 19 pulgadas con ventiladores inteligentes de enfriamiento silencioso.",
    "price": "RD$ 26,500.00",
    "img": "img/productos/catalogo/netgear-gs724tp-24p-gigabit-poe-switch.webp",
    "gallery": [
      "img/productos/catalogo/netgear-gs724tp-24p-gigabit-poe-switch.webp"
    ],
    "specs": [
      "24 puertos Gigabit Ethernet 10/100/1000 con alimentación PoE+ 802.3at de hasta 30W por puerto",
      "Presupuesto total de potencia PoE de 190 Watts con monitoreo de consumo en tiempo real",
      "2 puertos SFP Gigabit 1000Base-X dedicados para enlaces de fibra óptica de larga distancia",
      "Gestión inteligente Smart Pro Web GUI con soporte para VLAN 802.1Q, DiffServ QoS y LACP LAG",
      "Seguridad empresarial avanzada: ACLs L2-L4, filtrado MAC/IP, 802.1X RADIUS y protección DoS",
      "Capacidad de conmutación no bloqueante de 52 Gbps y tasa de reenvío de 38.6 Mpps",
      "Enfriamiento inteligente con control térmico acústico ultra silencioso para entornos de oficina",
      "Chasis metálico resistente estándar de 1U para rack de 19 pulgadas con kit de montaje incluido",
      "Garantía limitada de por vida Netgear ProSAFE con reemplazo anticipado y factura formal NCF"
    ]
  },
  {
    "id": "energia_victron_smartshunt_500a_monitor_bateria",
    "department": "energia",
    "category": "Energía Solar y Respaldo",
    "brand": "Victron Energy",
    "title": "Monitor de Baterías Victron Energy SmartShunt 500A / 50mV con Bluetooth Integrado para Sistemas Solares y Respaldo",
    "desc": "Monitor de baterías inteligente todo-en-uno Victron Energy SmartShunt 500A / 50mV con tecnología Bluetooth Smart integrada, diseñado para el monitoreo preciso del estado de bancos de baterías en sistemas solares fotovoltaicos, inversores de respaldo y telecomunicaciones en Santiago. El dispositivo mide continuamente la corriente que entra y sale de la batería mediante un shunt de manganina de 500A, calculando en tiempo real el Estado de Carga (SoC %) con precisión milimétrica, los amperios-hora consumidos, la tensión (voltios), la corriente neta (amperios), la potencia (vatios) y el tiempo restante de autonomía con la carga actual. Se conecta directamente a cualquier teléfono o tableta Android/iOS a través de la app gratuita VictronConnect sin cables adicionales ni pantallas secundarias. Cuenta además con una entrada auxiliar configurable para monitorear la tensión de una segunda batería (como la de arranque del generador), la temperatura del banco o el voltaje del punto medio, y un puerto de comunicación VE.Direct para integración con consolas Cerbo GX y el portal VRM.",
    "price": "RD$ 9,800.00",
    "img": "img/productos/catalogo/victron-smartshunt-500a-monitor-bateria.webp",
    "gallery": [
      "img/productos/catalogo/victron-smartshunt-500a-monitor-bateria.webp"
    ],
    "specs": [
      "Shunt industrial de alta precisión de 500 Amperios / 50 mV con pernos terminales de latón M10",
      "Cálculo exacto del Estado de Carga (SoC %) mediante algoritmo patentado de integración de amperios-hora",
      "Bluetooth Smart integrado: Monitoreo completo y configuración inalámbrica con la app VictronConnect",
      "Lecturas en tiempo real: Voltaje, corriente instantánea, potencia consumida y tiempo de autonomía restante",
      "Entrada auxiliar versátil: Monitoreo de tensión de batería secundaria, punto medio o sensor de temperatura",
      "Amplio rango de tensión de operación de 6.5 V a 70 V DC (bancos de 12V, 24V y 48V)",
      "Compatibilidad química universal: Baterías de Litio LiFePO4, AGM, GEL, Plomo-Ácido y Ciclo Profundo",
      "Puerto de comunicación VE.Direct para integración con centros de control Cerbo GX y monitoreo en la nube VRM",
      "Garantía oficial Victron Energy de 5 años con soporte técnico especializado y NCF formal en Santiago"
    ]
  },
  {
    "id": "oficina_panasonic_kxtgp600_dect_ip_inalambrico",
    "department": "oficina",
    "category": "Telefonía y Comunicaciones",
    "brand": "Panasonic",
    "title": "Sistema Telefónico Inalámbrico DECT IP Panasonic KX-TGP600 con Base y Terminal para 8 Líneas SIP Simultáneas",
    "desc": "Sistema de telefonía inalámbrica corporativa DECT IP Panasonic KX-TGP600 compuesto por estación base PoE y terminal inalámbrico ergonómico para oficinas, consultorios médicos, almacenes, naves comerciales y restaurantes en Santiago. La base admite hasta 8 cuentas SIP simultáneas y permite gestionar hasta 8 llamadas de voz paralelas sin interferencias ni saturación. Cuenta con pantalla LCD a color de 1.8 pulgadas retroiluminada de fácil lectura, calidad de sonido superior HD Voice con códec de banda ancha G.722 y tecnología de reducción de ruido ambiental acústico. Ofrece un alcance inalámbrico de hasta 50 metros en interiores y hasta 300 metros en exteriores con tecnología DECT 6.0 segura. Es escalable hasta 8 auriculares inalámbricos (modelo KX-TPA60) o teléfonos de sobremesa DECT inalámbricos (KX-TPA65), y compatible con repetidores de señal Panasonic para coberturas de múltiples pisos.",
    "price": "RD$ 11,250.00",
    "img": "img/productos/catalogo/panasonic-kxtgp600-dect-ip-inalambrico.webp",
    "gallery": [
      "img/productos/catalogo/panasonic-kxtgp600-dect-ip-inalambrico.webp"
    ],
    "specs": [
      "Estación base DECT IP con capacidad para hasta 8 líneas/cuentas SIP y 8 llamadas simultáneas",
      "Terminal inalámbrico con pantalla gráfica LCD a color de 1.8 pulgadas con retroiluminación nítida",
      "Audio HD Voice de banda ancha (códec G.722) con cancelación de eco y supresión de ruido ambiente",
      "Gran cobertura inalámbrica: Hasta 50 metros en interiores y 300 metros en exteriores (DECT 6.0)",
      "Capacidad de expansión: Admite hasta 8 terminales inalámbricos asociados a la misma base y repetidores",
      "Puerto Ethernet 10/100 Mbps con alimentación Power over Ethernet (PoE 802.3af) en la estación base",
      "Agenda telefónica compartida de hasta 500 registros con registro de las últimas 20 llamadas realizadas/recibidas",
      "Autonomía de batería excepcional: Hasta 11 horas de conversación continua y 200 horas en espera",
      "Garantía oficial Panasonic de 1 año con soporte de configuración SIP y comprobante fiscal formal NCF"
    ]
  },
  {
    "id": "redes_juniper_ex2300_c_12p_switch",
    "department": "redes",
    "category": "Switches de Red",
    "brand": "Juniper",
    "title": "Switch Empresarial Juniper Networks EX2300-C-12P Gigabit Ethernet 12 Puertos PoE+ Fanless con 2 Uplinks 10GbE SFP+",
    "desc": "Switch de capa de acceso empresarial compacto Juniper Networks EX2300-C-12P de alto rendimiento, diseñado para despliegues silenciosos en consultorios médicos, sucursales bancarias, oficinas corporativas y aulas en Santiago. Dispone de 12 puertos Gigabit Ethernet 10/100/1000 con alimentación PoE+ (802.3at) y un presupuesto total de potencia de 124 Watts para energizar teléfonos VoIP, puntos de acceso Wi-Fi 6 y cámaras de vigilancia, acompañado de 2 puertos uplink dedicados de 10GbE SFP+ para interconexión por fibra óptica de ultra alta velocidad al núcleo de red. Su arquitectura fanless 100% silenciosa sin ventiladores permite montaje en escritorio, pared o rack sin emitir ruido. Funciona con el sistema operativo de grado operador Junos OS, ofreciendo enrutamiento avanzado L2/L3 (RIP, OSPF, IPv6), calidad de servicio QoS y gestión unificada.",
    "price": "RD$ 32,500.00",
    "img": "img/productos/catalogo/juniper-ex2300-c-12p.webp",
    "gallery": [
      "img/productos/catalogo/juniper-ex2300-c-12p.webp"
    ],
    "specs": [
      "12 puertos Gigabit Ethernet 10/100/1000 con alimentación PoE+ 802.3at hasta 30W por puerto (124W total)",
      "2 puertos de fibra óptica dedicados 10GbE SFP+ / 1GbE SFP para uplinks troncales de alta velocidad",
      "Diseño Fanless 100% silencioso y compacto sin partes móviles para oficinas y consultorios",
      "Sistema operativo Junos OS con plano de control protegido y enrutamiento L2/L3 (OSPF, RIP, IPv6)",
      "Capacidad de conmutación de 64 Gbps y tasa de reenvío de 47 Mpps para tráfico empresarial denso",
      "Compatibilidad con tecnología Juniper Virtual Chassis para interconectar múltiples unidades",
      "Seguridad integral de puertos: 802.1X, DAI (Dynamic ARP Inspection), DHCP Snooping y ACLs L2-L4",
      "Opciones de instalación versátiles: Montaje en pared, sobremesa o rack de 19\" mediante adaptadores",
      "Garantía corporativa oficial Juniper Networks con soporte técnico local y factura fiscal NCF en Santiago"
    ]
  },
  {
    "id": "energia_mitsubishi_msz_gl12_aire_inverter",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Mitsubishi",
    "title": "Aire Acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 12,000 BTU Ultra Silencioso 23.1 SEER con Filtro Nano-Platinum",
    "desc": "Unidad de climatización Mini-Split de pared Inverter Mitsubishi Electric MSZ-GL de 12,000 BTU (conjunto MSZ-GL12NA / MUZ-GL12NA), referente mundial en eficiencia energética, durabilidad y confort acústico para residencias exclusivas, consultorios médicos, dormitorios y salas de telecomunicaciones en Santiago. Con una sobresaliente calificación de eficiencia de 23.1 SEER y refrigerante ecológico R-410A, reduce significativamente el consumo en la factura eléctrica. Su modo silencioso opera a tan solo 19 dB, emitiendo un sonido prácticamente inaudible. Cuenta con filtro desodorizante catalítico de Nano-Platino que descompone bacterias, moho y alérgenos microscópicos en suspensión, modo inteligente Econo Cool para ahorro adicional, control remoto ergonómico y compatibilidad con interfaces Wi-Fi Kumo Cloud para monitoreo remoto.",
    "price": "RD$ 44,900.00",
    "img": "img/productos/catalogo/mitsubishi-msz-gl12.webp",
    "gallery": [
      "img/productos/catalogo/mitsubishi-msz-gl12.webp"
    ],
    "specs": [
      "Capacidad de enfriamiento de 12,000 BTU/h con compresor de velocidad variable Inverter de alta eficiencia",
      "Eficiencia energética certificada de 23.1 SEER y 12.5 EER para ahorro drástico en consumo eléctrico",
      "Operación ultra silenciosa a solo 19 dB(A) en velocidad mínima para descanso y trabajo sin distracciones",
      "Filtro avanzado Nano-Platinum antibacteriano y desodorizante para purificación constante del aire interior",
      "Modo Econo Cool con modulación automática de flujo de aire que optimiza la sensación térmica ahorrando energía",
      "Control de aleta oscilante inteligente con amplia dispersión de aire en toda la habitación",
      "Unidad exterior tratada con revestimiento anticorrosivo Blue Fin resistente a salinidad e intemperie",
      "Compatibilidad con adaptador Wi-Fi Mitsubishi Kumo Cloud para control desde smartphone y automatizaciones",
      "Garantía oficial directa Mitsubishi Electric de 5 años en compresor y soporte calificado en Santiago"
    ]
  },
  {
    "id": "seguridad_paradox_magellan_mg5050_panel",
    "department": "seguridad",
    "category": "Alarmas y Sensores",
    "brand": "Paradox",
    "title": "Panel de Alarma Híbrido Inalámbrico Paradox Magellan MG5050+ de 32 Zonas con Transceptor Integrado 433 MHz y Modo StayD",
    "desc": "Panel central de control de alarma híbrido Paradox Magellan MG5050+ (MG5050 Plus) con transceptor de radiofrecuencia de 433 MHz integrado directamente en placa, ideal para residencias, negocios, plazas y almacenes en Santiago donde se requiere una instalación rápida y estética sin necesidad de canaletas ni cables expuestos. Admite hasta 32 zonas inalámbricas o cableadas (5 zonas cableadas en tarjeta ampliables mediante doblado de zonas o módulos expansores ZX82), 2 particiones independientes para controlar áreas separadas con una sola tarjeta, soporte para hasta 32 mandos a distancia (llaveros REM2/REM25) y hasta 15 teclados inalámbricos o cableados. Incorpora la exclusiva tecnología StayD que mantiene el sistema permanentemente armado protegiendo el perímetro 24 horas al día, y es 100% compatible con el comunicador IP150+ y la app móvil BlueEye para notificaciones push en tiempo real.",
    "price": "RD$ 13,850.00",
    "img": "img/productos/catalogo/paradox-magellan-mg5050.webp",
    "gallery": [
      "img/productos/catalogo/paradox-magellan-mg5050.webp"
    ],
    "specs": [
      "Transceptor RF de 433 MHz integrado en placa base con supervisión de señal inalámbrica y batería baja",
      "Capacidad para 32 zonas (inalámbricas o cableadas) con 5 zonas cableadas en tarjeta ampliables a 10/32",
      "2 particiones independientes para seguridad perimetral y zonal separada (ej. almacén y oficinas)",
      "Tecnología de protección perimetral continua StayD exclusiva de Paradox sin tiempos vulnerables",
      "Soporta hasta 32 llaveros remotos bidireccionales, 15 teclados (LCD, táctil o LED) y sirenas inalámbricas",
      "Memoria de eventos de hasta 256 registros con fecha y hora exactas para auditoría de seguridad",
      "Salidas programables PGM en placa para disparo de luces, electroimanes, portones o estrobos",
      "Conectividad total con comunicador IP150+ para alertas instantáneas y control desde app BlueEye",
      "Garantía oficial Paradox de 2 años con soporte técnico e ingeniería de alarmas en Santiago"
    ]
  },
  {
    "id": "energia_siemens_logo_230rce_plc_controlador",
    "department": "energia",
    "category": "Automatización y Tableros",
    "brand": "Siemens",
    "title": "Micro-PLC y Controlador Lógico Programable Siemens LOGO! 230RCE (8 Entradas / 4 Salidas Relé) con Pantalla LCD y Servidor Web Ethernet",
    "desc": "Módulo lógico programable inteligente Siemens LOGO! 230RCE (referencia 6ED1052-1FB08-0BA1) para automatización de cuadros eléctricos, transferencias automáticas de plantas eléctricas, sistemas de bombeo hidroneumático, iluminación programada y climatización en torres comerciales, industrias y residencias en Santiago. Alimentación directa a 115V / 230V AC sin requerir fuentes auxiliares externas. Cuenta con 8 entradas digitales, 4 salidas de relé de 10 Amperios para conmutación de cargas inductivas, pantalla gráfica LCD retroiluminada con tres colores de alerta seleccionables (blanco, naranja y rojo), teclado frontal para configuración local, puerto de red Ethernet RJ-45 con servidor web HTML5 integrado para monitoreo desde cualquier navegador o celular, soporte del protocolo industrial Modbus TCP/IP y ranura estándar para memoria MicroSD para almacenamiento de programas y datalogging.",
    "price": "RD$ 16,900.00",
    "img": "img/productos/catalogo/siemens-logo-230rce-plc.webp",
    "gallery": [
      "img/productos/catalogo/siemens-logo-230rce-plc.webp"
    ],
    "specs": [
      "Alimentación directa 115V / 230V AC (rango amplio 85V - 265V AC) para conexión directa en tableros",
      "8 entradas digitales AC (115V/230V) y 4 salidas a relé con capacidad de corte de hasta 10A inductivo/resistivo",
      "Pantalla LCD gráfica integrada de 6 líneas con iluminación de fondo personalizable para diagnósticos",
      "Servidor web HTML5 integrado: Monitoreo y control interactivo de variables desde computadoras o celulares",
      "Puerto Ethernet RJ-45 integrado con comunicación S7, Modbus TCP/IP y conexión directa a la nube IoT",
      "Ranura para tarjeta MicroSD estándar para respaldo de programas, clonación rápida y registro de datos",
      "Reloj en tiempo real integrado con reserva de marcha para programación horaria y semanal autónoma",
      "Montaje estándar en riel DIN de 35 mm (formato compacto de 4 módulos) para tableros eléctricos",
      "Garantía oficial Siemens de fábrica con comprobante fiscal formal NCF y asesoría técnica en Santiago"
    ]
  },
  {
    "id": "redes_ubiquiti_uk_ultra_wifi_ap",
    "department": "redes",
    "category": "Routers y Repetidores WiFi",
    "brand": "Ubiquiti",
    "title": "Punto de Acceso Compacto para Exteriores e Interiores Ubiquiti UniFi Swiss Army Knife Ultra (UK-Ultra) Resistente a la Intemperie IPX6 PoE",
    "desc": "Punto de acceso Wi-Fi versátil y ultracompacto para interiores y exteriores Ubiquiti UniFi Swiss Army Knife Ultra (UK-Ultra), diseñado para ofrecer cobertura inalámbrica de alto rendimiento en terrazas, patios residenciales, jardines, restaurantes y naves comerciales en Santiago. Cuenta con certificación de resistencia al agua IPX6 para soportar condiciones climáticas adversas y lluvia directa. Incorpora antenas omnidireccionales internas de alta eficiencia y dispone de 2 conectores RP-SMA protegidos para acoplar antenas externas directivas o sectoriales cuando se requiere alcance extendido. Alimentación mediante Power over Ethernet (PoE 802.3af) a través de su puerto Gigabit Ethernet, y montaje sumamente flexible en pared, poste o riel DIN. Se integra de forma nativa a la plataforma UniFi Network para gestión centralizada, roaming transparente y métricas avanzadas de tráfico.",
    "price": "RD$ 6,850.00",
    "img": "img/productos/catalogo/ubiquiti-uk-ultra-ap.webp",
    "gallery": [
      "img/productos/catalogo/ubiquiti-uk-ultra-ap.webp"
    ],
    "specs": [
      "Certificación de impermeabilidad IPX6 para exteriores expuestos a lluvia directa y sol",
      "Factor de forma ultra compacto con múltiples opciones de montaje: pared, mástil o riel DIN",
      "Antenas internas omnidireccionales con cobertura optimizada para áreas abiertas y terrazas",
      "2 conectores RP-SMA para acoplar antenas omnidireccionales o sectoriales de alta ganancia opcionales",
      "Puerto Gigabit Ethernet 10/100/1000 Mbps con alimentación PoE 802.3af estándar",
      "Capacidad para más de 200 dispositivos concurrentes y soporte multi-SSID con aislamiento VLAN",
      "Integración nativa con UniFi Network Controller para configuración en un clic y roaming rápido",
      "Bajo consumo energético de tan solo 8W para máxima eficiencia operativa",
      "Garantía oficial Ubiquiti Networks de 1 año con respaldo y soporte técnico en Santiago"
    ]
  },
  {
    "id": "seguridad_dahua_tioc_4mp_camara_ip",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Dahua",
    "title": "Cámara IP Domo Dahua TiOC 2.0 4MP (DH-IPC-HDW3449HP-AS-PV) con Disuasión Activa, Luces Estroboscópicas Rojo/Azul, Sirena 110dB y Full-Color 24/7",
    "desc": "Cámara IP tipo domo/torreta Dahua TiOC 2.0 (Three-in-One Camera) de 4 Megapíxeles serie WizSense (modelo DH-IPC-HDW3449HP-AS-PV), la cúspide en videovigilancia preventiva para residencias, negocios, plazas y almacenes en Santiago. Combina tres tecnologías fundamentales: monitoreo a todo color 24/7 con apertura F1.0 de gran luminosidad y luz cálida inteligente, disuasión activa inmediata mediante luces estroboscópicas destellantes en rojo y azul junto a una potente sirena programable de hasta 110 dB para repeler intrusos antes de que consuman el delito, e inteligencia artificial WizSense SMD Plus que clasifica con precisión humanos y vehículos eliminando falsas alarmas provocadas por lluvia, animales o follaje. Incorpora además micrófono de alta sensibilidad y altavoz integrado para comunicación de audio bidireccional desde la app móvil DMSS.",
    "price": "RD$ 8,450.00",
    "img": "img/productos/catalogo/dahua-tioc-4mp-camara-ip.webp",
    "gallery": [
      "img/productos/catalogo/dahua-tioc-4mp-camara-ip.webp"
    ],
    "specs": [
      "Resolución de 4 Megapíxeles (2688 x 1520 a 30 fps) con sensor CMOS de barrido progresivo de 1/2.7\"",
      "Tecnología Full-Color 24/7 con lente de apertura F1.0 y LED cálido inteligente para imágenes nítidas a color",
      "Disuasión activa con luces estroboscópicas intermitentes en rojo y azul y sirena disuasoria de 110 dB",
      "Inteligencia Artificial WizSense con protección perimetral, cruce de línea y clasificación precisa humano/vehículo",
      "Audio bidireccional integrado con micrófono dual anti-ruido y altavoz de alta potencia",
      "Armado y desarmado de alarmas con un solo toque desde la app móvil DMSS o entradas de alarma",
      "Compresión de video ultra eficiente Smart H.265+ para ahorrar hasta un 70% de ancho de banda y disco",
      "Carcasa metálica antivandálica con protección IP67 para intemperie resistente a lluvia y polvo",
      "Garantía oficial Dahua Technology de 2 años con soporte técnico e instalación en Santiago"
    ]
  },
  {
    "id": "redes_cisco_cbs350_24p_4g_switch",
    "department": "redes",
    "category": "Routers y Repetidores WiFi",
    "brand": "Cisco",
    "title": "Switch Administrable Cisco Business CBS350-24P-4G de 24 Puertos Gigabit PoE+ (195W) con 4 Puertos SFP Gigabit y Enrutamiento Capa 3",
    "desc": "Switch de conmutación gestionable de alto rendimiento para montaje en rack Cisco Business CBS350-24P-4G (CBS350-24P-4G-NA), diseñado como la columna vertebral de red para corporaciones, clínicas, hoteles y centros educativos en Santiago. Equipado con 24 puertos Gigabit Ethernet 10/100/1000 PoE+ 802.3at con una potencia total disponible de 195W para energizar teléfonos VoIP, puntos de acceso Wi-Fi 6 y cámaras de seguridad IP, además de 4 puertos uplink dedicados SFP Gigabit para interconexiones por fibra óptica de alta velocidad hacia otros switches o servidores. Cuenta con capacidades avanzadas de enrutamiento estático de Capa 3 (L3), listas de control de acceso (ACL), seguridad de puertos IEEE 802.1X, VLANs de voz automáticas y una interfaz web moderna y ágil en español.",
    "price": "RD$ 32,800.00",
    "img": "img/productos/catalogo/cisco-cbs350-24p-4g.webp",
    "gallery": [
      "img/productos/catalogo/cisco-cbs350-24p-4g.webp"
    ],
    "specs": [
      "24 puertos Gigabit Ethernet 10/100/1000 con soporte PoE+ 802.3at/af (presupuesto de 195W)",
      "4 puertos de fibra SFP Gigabit dedicados para enlaces ascendentes a larga distancia sin cuellos de botella",
      "Capacidad de conmutación de 56 Gbps y tasa de reenvío de 41.66 Mpps para tráfico empresarial continuo",
      "Enrutamiento estático IPv4/IPv6 de Capa 3 para segmentación de red eficiente entre departamentos",
      "VLANs de voz automáticas con priorización QoS para telefonía IP cristalina y sin cortes",
      "Seguridad avanzada: Autenticación 802.1X, ACLs multicapa, DoS prevention y DHCP Snooping",
      "Gestión simplificada: Interfaz gráfica web moderna, soporte SNMP, CLI y Cisco Business Dashboard",
      "Formato estándar de montaje en rack de 19\" 1U con orejas de fijación incluidas",
      "Garantía oficial Cisco de por vida limitada (Enhanced Limited Lifetime Warranty) y soporte local Futunet"
    ]
  },
  {
    "id": "energia_apc_smart_ups_2200_rack",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Schneider Electric",
    "title": "Sistema UPS para Rack APC Smart-UPS SMT2200RM2U de 2200VA / 1980W 2U Onda Senoidal Pura con LCD y Monitoreo Cloud SmartConnect",
    "desc": "Sistema de alimentación ininterrumpida (UPS) de grado profesional y misión crítica en formato rack de 2U APC Smart-UPS SMT2200RM2U de Schneider Electric, diseñado para brindar protección eléctrica total a servidores, switches de red, sistemas de almacenamiento y equipos médicos en Santiago. Ofrece una potencia nominal de 2200VA / 1980 Watts con salida de onda senoidal pura garantizada, compatible con fuentes de alimentación de servidores con PFC activo. Cuenta con regulación automática de voltaje (AVR) Boost and Trim que corrige caídas y alzas de voltaje sin agotar la batería, pantalla gráfica LCD frontal con teclas de navegación para visualización en tiempo real de carga y autonomía, grupos de tomas de salida conmutables para reiniciar equipos de forma remota, ranura SmartSlot para tarjeta de gestión de red SNMP, y tecnología APC SmartConnect para supervisión y alertas proactivas en la nube.",
    "price": "RD$ 58,900.00",
    "img": "img/productos/catalogo/apc-smart-ups-2200-rack.webp",
    "gallery": [
      "img/productos/catalogo/apc-smart-ups-2200-rack.webp"
    ],
    "specs": [
      "Potencia de salida continua de 2200 VA / 1980 Watts con salida de onda senoidal pura garantizada",
      "Formato para montaje en rack de 2U (incluye kit de rieles para rack de 19\" de 4 postes)",
      "Regulación Automática de Voltaje (AVR) Boost & Trim de doble etapa (rango 82V - 144V sin batería)",
      "Pantalla LCD gráfica con retroiluminación y menú intuitivo para diagnósticos locales y consumo energético",
      "APC SmartConnect: Monitoreo remoto automático en la nube desde cualquier dispositivo con alertas proactivas",
      "Grupos de tomas de salida conmutadas independientes para reinicio secuencial o apagado de cargas no críticas",
      "Baterías de plomo-ácido selladas libres de mantenimiento con cambio en caliente (Hot-Swap) por el frente",
      "Ranura SmartSlot para tarjeta opcional de gestión de red (NMC AP9641 / AP9640)",
      "Garantía oficial Schneider Electric de 3 años en electrónica y 2 años en baterías con factura formal NCF"
    ]
  },
  {
    "id": "energia_tesla_universal_wall_connector",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Tesla",
    "title": "Cargador Universal de Vehículos Eléctricos Tesla Universal Wall Connector (48A / 11.5 kW) con Adaptador J1772 Integrado (Magic Dock) y Wi-Fi",
    "desc": "Cargador residencial y comercial de nivel 2 para vehículos eléctricos Tesla Universal Wall Connector, la solución definitiva de recarga eléctrica de alta velocidad compatible con el 100% de los autos eléctricos en Santiago y República Dominicana. Gracias a su revolucionario adaptador Magic Dock integrado, permite cargar de forma nativa tanto vehículos con conector NACS (Tesla) como cualquier vehículo eléctrico de otras marcas americanas, europeas o asiáticas con conector J1772 sin necesidad de adaptadores externos sueltos. Suministra hasta 48A (11.5 kW a 240V), proporcionando hasta 70 km de autonomía por cada hora de carga. Incorpora conectividad Wi-Fi para control en tiempo real desde la aplicación móvil Tesla, programación de horarios de carga para aprovechar tarifas eléctricas reducidas, tecnología Power Sharing para balancear la carga entre hasta 6 estaciones simultáneas sin sobrecargar la acometida eléctrica principal, y cable ultra flexible de 24 pies (7.3 metros) con sellado IP55 para instalación tanto bajo techo como a la intemperie.",
    "price": "RD$ 54,900.00",
    "img": "img/productos/catalogo/tesla-universal-wall-connector.webp",
    "gallery": [
      "img/productos/catalogo/tesla-universal-wall-connector.webp"
    ],
    "specs": [
      "Potencia de carga rápida de hasta 48A / 11.5 kW a 240V monofásico (recupera hasta 70 km por hora)",
      "Tecnología Magic Dock integrada: conector dual NACS nativo y J1772 para máxima compatibilidad universal",
      "Conectividad Wi-Fi 2.4 GHz (802.11 b/g/n) para control remoto, estadísticas de consumo y actualizaciones OTA",
      "Power Sharing inteligente entre hasta 6 cargadores conectados en paralelo para protección de la red eléctrica",
      "Cable de carga ultra resistente y flexible de 24 pies (7.3 m) para fácil maniobra en cualquier plaza de parqueo",
      "Certificación climática IP55 para operación continua bajo lluvia, humedad tropical y sol intenso",
      "Barra luminosa LED frontal con códigos de estado dinámicos y diagnóstico automático",
      "Compatible con instalaciones eléctricas residenciales y comerciales en 208V y 240V con interruptores de 60A",
      "Garantía oficial residencial de 4 años y comercial de 2 años con soporte técnico e instalación certificada en Santiago"
    ]
  },
  {
    "id": "redes_mikrotik_crs326_24g_2s_switch_rack",
    "department": "redes",
    "category": "Routers y Repetidores WiFi",
    "brand": "MikroTik",
    "title": "Switch Administrable de Distribución MikroTik CRS326-24G-2S+RM (24 Puertos Gigabit + 2 Puertos 10G SFP+) Montaje en Rack Dual Boot SwOS/RouterOS",
    "desc": "Switch de conmutación gestionable empresarial para montaje en rack de 19 pulgadas 1U MikroTik Cloud Router Switch modelo CRS326-24G-2S+RM, diseñado para redes de distribución troncal en proveedores de internet (WISPs/ISPs), empresas de telecomunicaciones y campus corporativos en Santiago. Cuenta con 24 puertos Gigabit Ethernet 10/100/1000 Mbps y 2 jaulas de fibra óptica dedicadas SFP+ de 10 Gbps (10 Gigabit) para uplinks de ultra alta velocidad. Su arquitectura Dual Boot exclusiva le permite arrancar a elección del administrador en SwOS (un sistema operativo ligero optimizado para switching de capa 2 sin bloqueo con VLANs 802.1Q, Port Isolation, Port Mirroring, Link Aggregation LACP y snooping IGMP) o en el prestigioso RouterOS v7 con licencia Level 5 para enrutamiento estático, firewall y servicios avanzados. Su potente procesador y switch chip Marvell entregan un rendimiento sin bloqueo de 56 Gbps con un consumo excepcionalmente bajo de tan solo 24W.",
    "price": "RD$ 16,850.00",
    "img": "img/productos/catalogo/mikrotik-crs326-24g-2s-switch.webp",
    "gallery": [
      "img/productos/catalogo/mikrotik-crs326-24g-2s-switch.webp"
    ],
    "specs": [
      "24 puertos Gigabit Ethernet 10/100/1000 Mbps con auto-negociación y compatibilidad PoE-In pasivo en puerto 1",
      "2 jaulas dedicadas SFP+ de 10 Gbps para módulos de fibra óptica monomodo o multimodo de 10G y 1.25G",
      "Tecnología Dual Boot: arranque flexible y conmutable entre SwOS (L2 puro) y RouterOS v7 Licencia Level 5",
      "Capacidad de switching sin bloqueo de 56 Gbps, capacidad de conmutación de 102 Gbps y reenvío de 76 Mpps",
      "Funciones L2 avanzadas: tabla de reenvío de 16K MACs, VLANs IEEE 802.1Q, broadcast storm control y aislamiento",
      "Chasis metálico resistente para montaje en rack estándar de 19 pulgadas 1U (incluye orejas de rack)",
      "Fuente de alimentación interna y doble entrada de alimentación redundante (jack DC 10-30V y PoE pasivo)",
      "Operación silenciosa con disipación pasiva de calor y consumo energético ultra eficiente de 24W máx.",
      "Garantía oficial MikroTik de 1 año con soporte técnico y configuración certificada por Futunet"
    ]
  },
  {
    "id": "seguridad_ezviz_db2_pro_timbre_inteligente",
    "department": "seguridad",
    "category": "Cámaras de Seguridad",
    "brand": "Ezviz",
    "title": "Timbre Inteligente Inalámbrico con Video 2K+ 5MP Ezviz DB2 Pro con Batería Recargable, Chime Interior y Detección PIR de Personas",
    "desc": "Kit de timbre inteligente con videoportero inalámbrico a batería Ezviz DB2 Pro 2K+ (5 Megapíxeles / 2544 x 1888), la solución más avanzada y conveniente para control de accesos residencial y comercial en Santiago. Su instalación 100% libre de cables permite colocarlo en minutos sobre cualquier puerta, marco o pared sin necesidad de perforaciones complicadas ni instalaciones eléctricas. Incorpora una potente batería de litio recargable de 5,200 mAh que ofrece hasta 115 días de funcionamiento ininterrumpido con una sola recarga. Equipado con óptica ultra gran angular de 176° de visión vertical completa para ver a los visitantes de pies a cabeza y los paquetes dejados en el suelo. Cuenta con sensor térmico PIR asistido por algoritmos de inteligencia artificial para detectar personas y enviar notificaciones instantáneas al móvil sin falsas alarmas. Incluye en la caja una campana interior Wi-Fi (Chime) con diversos tonos y ranura MicroSD de hasta 256GB para almacenamiento local seguro sin cuotas mensuales obligatorias.",
    "price": "RD$ 8,450.00",
    "img": "img/productos/catalogo/ezviz-db2-pro-timbre-camara.webp",
    "gallery": [
      "img/productos/catalogo/ezviz-db2-pro-timbre-camara.webp"
    ],
    "specs": [
      "Resolución de video ultra nítida 2K+ de 5 Megapíxeles (2544 x 1888 a 15 fps) con compresión H.265",
      "Campo visual ultra panorámico de 176° en diagonal para cobertura completa de la entrada y paquetes",
      "Batería recargable integrada de 5,200 mAh con hasta 115 días de autonomía por recarga (modo eco)",
      "Timbre acústico interior Wi-Fi (Chime) incluido en el empaque con tonos personalizables y altavoz potente",
      "Detección inteligente de movimiento humano mediante sensor PIR y filtro de inteligencia artificial",
      "Visión nocturna por infrarrojos de hasta 5 metros con activación automática al anochecer",
      "Comunicación de audio bidireccional en tiempo real con micrófono anti-eco y función de modulador de voz",
      "Diseño resistente al agua y polvo con certificación climática IP65 para exteriores",
      "Almacenamiento dual: admite tarjetas MicroSD locales de hasta 256GB en el timbre interior y nube EZVIZ CloudPlay",
      "Garantía oficial Ezviz de 1 año con respaldo y soporte técnico local en Santiago"
    ]
  },
  {
    "id": "equipos_logitech_brio_4k_pro_webcam",
    "department": "oficina",
    "category": "Monitores y Proyectores",
    "brand": "Logitech",
    "title": "Cámara Web Empresarial 4K Ultra HD Logitech BRIO con HDR, RightLight 3, Doble Micrófono con Cancelación de Ruido y Windows Hello",
    "desc": "Cámara web ejecutiva de alta gama Logitech BRIO 4K Pro Ultra HD, el estándar de oro en videoconferencias profesionales para directores, ejecutivos, salas de juntas y creadores de contenido en Santiago. Capaz de transmitir y grabar en deslumbrante resolución 4K Ultra HD a 30 fps, Full HD 1080p a 60 fps fluidos o 720p hasta 90 fps. Integra la avanzada tecnología RightLight 3 con HDR (High Dynamic Range) que calibra automáticamente la exposición y el contraste para garantizar una imagen profesional impecable ante contraluces severos, oficinas con luz solar directa o salas con iluminación tenue. Equipada con sensores infrarrojos duales certificados para inicio de sesión biométrico ultrarrápido y seguro mediante Windows Hello de Microsoft sin necesidad de escribir contraseñas. Incorpora dos micrófonos omnidireccionales con tecnología de cancelación de ruido ambiental que capturan la voz con claridad cristalina hasta a 1 metro de distancia, tres configuraciones de campo visual seleccionables (65°, 78° y 90° con zoom digital 5x en HD), obturador de privacidad físico integrado y conexión versátil USB-C Plug and Play.",
    "price": "RD$ 13,950.00",
    "img": "img/productos/catalogo/logitech-brio-4k-pro-webcam.webp",
    "gallery": [
      "img/productos/catalogo/logitech-brio-4k-pro-webcam.webp"
    ],
    "specs": [
      "Resolución de video ultra nítida: 4K UHD (3840x2160 @ 30 fps), 1080p FHD (@ 30 o 60 fps) y 720p (@ hasta 90 fps)",
      "Tecnología RightLight 3 con HDR para una iluminación perfecta en cualquier condición de luz y contraluz",
      "Sensores óptico e infrarrojo compatibles con Microsoft Windows Hello para desbloqueo facial seguro",
      "Campo visual ajustable de 65° (primer plano enfocado), 78° (estándar de oficina) y 90° (sala de reuniones amplia)",
      "Zoom digital de 5x en resolución HD para enfocar detalles con nitidez mediante software Logi Tune",
      "Dos micrófonos omnidireccionales con supresión acústica de ruido para captar la voz sin eco ambiental",
      "Obturador de privacidad extraíble incluido para tapar la lente de forma física al terminar las llamadas",
      "Conexión USB-C a USB-A desmontable de 2.2 metros y rosca universal de 1/4\" para montaje en trípodes",
      "Certificación oficial para Microsoft Teams, Zoom, Google Meet y compatibilidad con OBS y Cisco Webex",
      "Garantía oficial Logitech de 2 años con comprobante fiscal formal NCF y entrega inmediata en Santiago"
    ]
  },
  {
    "id": "oficina_samsung_smart_monitor_m7_32_4k",
    "department": "oficina",
    "category": "Monitores y Proyectores",
    "brand": "Samsung",
    "title": "Monitor Inteligente Samsung Smart Monitor M7 32\" 4K UHD con USB-C, HDR10, Smart TV y Soporte VESA",
    "desc": "Monitor inteligente de productividad y entretenimiento Samsung Smart Monitor M7 de 32 pulgadas (resolución 4K Ultra HD 3840x2160 con HDR10). Diseñado para directivos, puestos ejecutivos y oficinas modernas en Santiago que demandan máxima productividad sin saturar el escritorio con cables. Incorpora puerto USB-C multifunción con suministro de energía de 65W (Power Delivery) que permite cargar laptops modernas y transmitir video simultáneamente con un solo cable. Integra sistema operativo Tizen con Smart TV Hub (Netflix, YouTube, Prime Video) y aplicaciones nativas de productividad como Microsoft 365, navegación web e inicio de sesión remoto a servidores corporativos sin necesidad de encender una PC. Incluye altavoces estéreo integrados de alta claridad, control remoto ergonómico, conectividad Wi-Fi 5 de doble banda, Bluetooth 5.2, múltiples puertos HDMI y compatibilidad con montaje VESA 100x100 para brazos articulados.",
    "price": "RD$ 23,900.00",
    "img": "img/productos/catalogo/samsung-smart-monitor-m7-32-4k.webp",
    "gallery": [
      "img/productos/catalogo/samsung-smart-monitor-m7-32-4k.webp"
    ],
    "specs": [
      "Pantalla VA de 32 pulgadas con resolución 4K Ultra HD (3840 x 2160) y compatibilidad con alto rango dinámico HDR10",
      "Conectividad USB-C todo en uno con suministro de energía de 65W (carga tu laptop y transmite video 4K con 1 solo cable)",
      "Hub de productividad integrado: acceso directo a Microsoft 365, navegación web y escritorio remoto sin encender una PC",
      "Plataforma Smart TV Hub con aplicaciones de streaming y control por voz con control remoto recargable incluido",
      "Altavoces estéreo integrados de 10W (2x 5W) para videollamadas claras y contenido multimedia sin parlantes externos",
      "Conectividad inalámbrica: Wi-Fi 5 (802.11ac) de doble banda y Bluetooth 5.2 para teclado, mouse y auriculares",
      "Puertos físicos: 1x USB-C (DisplayPort Alt Mode, 65W PD, datos), 2x HDMI 2.0 y 3x puertos USB-A 2.0 de bajada",
      "Tecnología de confort visual: Flicker Free y modo Eye Saver con certificación TÜV Rheinland para largas jornadas",
      "Soporte de inclinación ajustable y compatibilidad con montaje VESA estándar 100x100 mm para brazos de escritorio",
      "Garantía oficial Samsung de 1 año con respaldo y soporte técnico autorizado en Santiago"
    ]
  },
  {
    "id": "oficina_lenovo_tab_m11_tablet_corporativa",
    "department": "oficina",
    "category": "Laptops y Computadoras",
    "brand": "Lenovo",
    "title": "Tablet Corporativa Lenovo Tab M11 de 11\" 90Hz WUXGA con Lápiz Lenovo Tab Pen y Cuatro Altavoces Dolby Atmos",
    "desc": "Tablet empresarial Lenovo Tab M11 (pantalla IPS de 11 pulgadas WUXGA 1920x1200 a 90Hz fluidos), ideal para auditorías en almacén, firmas digitales de contratos, puntos de venta móviles y ejecutivos en movimiento en Santiago. Incluye de fábrica el lápiz óptico digital de alta precisión Lenovo Tab Pen (4096 niveles de presión) para anotaciones y firmas legales en PDF. Equipada con procesador MediaTek Helio G88 de 8 núcleos, 4GB de memoria RAM, 128GB de almacenamiento interno expandible mediante tarjeta MicroSD hasta 1TB, y potente batería de 7040 mAh con hasta 10 horas de reproducción continua. Integra cuatro altavoces optimizados con Dolby Atmos para videoconferencias cristalinas, cámaras frontal y trasera de 8 MP, conectividad Wi-Fi dual band, Bluetooth 5.1 y modo de lectura inmersivo con certificación TÜV Low Blue Light.",
    "price": "RD$ 13,850.00",
    "img": "img/productos/catalogo/lenovo-tab-m11-tablet-corporativa.webp",
    "gallery": [
      "img/productos/catalogo/lenovo-tab-m11-tablet-corporativa.webp"
    ],
    "specs": [
      "Pantalla táctil IPS de 11 pulgadas con resolución WUXGA (1920 x 1200) y tasa de refresco ultra fluida de 90Hz",
      "Lápiz óptico de alta precisión Lenovo Tab Pen incluido de serie (4096 niveles de presión para firmas y notas)",
      "Procesador MediaTek Helio G88 Octa-Core de alto rendimiento y bajo consumo para multitarea corporativa",
      "Memoria: 4GB RAM LPDDR4x y almacenamiento de 128GB expandible mediante MicroSD hasta 1TB",
      "Cuatro altavoces estéreo frontales de 1W sintonizados con tecnología envolvente Dolby Atmos",
      "Sistema de cámaras: cámara principal de 8 MP con autofoco y cámara frontal de 8 MP para videollamadas",
      "Batería de larga duración de 7,040 mAh con hasta 10 horas de autonomía y carga rápida USB-C",
      "Chasis metálico delgado de 7.15 mm con certificación IP52 resistente a salpicaduras y polvo",
      "Modo lectura inmersivo con simulación cromática de papel y certificación TÜV Rheinland de baja emisión azul",
      "Garantía oficial Lenovo de 1 año con soporte empresarial y entrega inmediata en Santiago"
    ]
  },
  {
    "id": "oficina_lg_27qn880_ergo_qhd_monitor",
    "department": "oficina",
    "category": "Monitores y Proyectores",
    "brand": "LG",
    "title": "Monitor Profesional Ergonómico LG 27QN880-B Ergo 27\" QHD IPS con Brazo Articulado C-Clamp y USB-C 60W",
    "desc": "Monitor ergonómico profesional de vanguardia LG Ergo modelo 27QN880-B de 27 pulgadas, diseñado para programadores, arquitectos, diseñadores gráficos y directores ejecutivos en Santiago. Incorpora un innovador brazo ergonómico articulado con mordaza C-Clamp de fácil montaje en el borde de cualquier escritorio, liberando el 100% del espacio de la mesa. El brazo Ergo permite extender, retraer, girar hasta 280°, pivotar 90° a orientación vertical, inclinar ±25° y ajustar la altura con suavidad milimétrica. Cuenta con panel IPS de resolución QHD (2560x1440 píxeles, 77% más resolución que Full HD), cobertura del 99% del espacio de color sRGB, HDR10 y conectividad USB-C con suministro de energía de 60W (Power Delivery) para cargar portátiles con un único cable. Dispone de dos altavoces estéreo MaxxAudio de 5W y organizador de cables integrado en el poste.",
    "price": "RD$ 26,400.00",
    "img": "img/productos/catalogo/lg-27qn880-ergo-qhd-monitor.webp",
    "gallery": [
      "img/productos/catalogo/lg-27qn880-ergo-qhd-monitor.webp"
    ],
    "specs": [
      "Pantalla IPS de 27 pulgadas con resolución Quad HD (2560 x 1440 píxeles) con fidelidad cromática 99% sRGB y HDR10",
      "Brazo ergonómico Ergo C-Clamp incluido: extensión/retracción de 180 mm, giro de ±280°, pivote 90° vertical y ajuste de altura 130 mm",
      "Conectividad USB-C todo en uno con 60W Power Delivery para alimentar laptops ejecutivas con un único cable",
      "Libera por completo la superficie de trabajo del escritorio gracias al montaje en borde por prensa C-Clamp o pasacables",
      "Dos altavoces estéreo integrados de 5W con tecnología Waves MaxxAudio para audio balanceado sin parlantes externos",
      "Puertos de conectividad: 1x USB-C (DisplayPort, 60W PD, datos), 2x HDMI, 1x DisplayPort 1.4 y hub de 2 puertos USB 3.0",
      "Compatibilidad con AMD FreeSync, modo Dynamic Action Sync y Black Stabilizer para fluidez visual total",
      "Calibración de color de fábrica y modos de imagen dedicados para diseño, lectura y oficina",
      "Sistema de gestión de cables oculto dentro del poste para mantener el espacio de trabajo 100% limpio",
      "Garantía oficial LG de 3 años con factura con crédito fiscal (NCF) y entrega corporativa en Santiago"
    ]
  },
  {
    "id": "redes_netgear_nighthawk_m6_pro_5g_router",
    "department": "redes",
    "category": "Routers y Repetidores WiFi",
    "brand": "Netgear",
    "title": "Router Móvil Hotspot 5G / Wi-Fi 6E Netgear Nighthawk M6 Pro (MR6500) con Puerto 2.5G Multigigabit y Pantalla Táctil",
    "desc": "El router móvil hotspot más avanzado del mundo, Netgear Nighthawk M6 Pro (modelo MR6500), diseñado para respaldo de contingencia de conexión a internet para empresas, sucursales bancarias móviles, transmisiones en vivo y ejecutivos en República Dominicana. Equipado con el módem 5G mmWave y Sub-6GHz Qualcomm Snapdragon X65 que alcanza velocidades de descarga móviles de hasta 8 Gbps, liberado para todas las prestadoras telefónicas locales (Claro, Altice). Ofrece tecnología Wi-Fi 6E de triple banda con la nueva frecuencia de 6 GHz, capaz de brindar hasta 3.6 Gbps inalámbricos para conectar hasta 32 dispositivos simultáneamente con latencia ultra baja. Integra un puerto Ethernet 2.5G multigigabit para conectarlo directamente a switches corporativos o routers WAN como respaldo automático de internet, pantalla táctil LCD a color de 2.8 pulgadas para monitoreo de datos y batería recargable extraíble de 5,040 mAh con hasta 13 horas de uso continuo o funcionamiento sin batería conectado directamente a la corriente.",
    "price": "RD$ 48,900.00",
    "img": "img/productos/catalogo/netgear-nighthawk-m6-pro-5g-router.webp",
    "gallery": [
      "img/productos/catalogo/netgear-nighthawk-m6-pro-5g-router.webp"
    ],
    "specs": [
      "Módem 5G ultra rápido Qualcomm Snapdragon X65 con compatibilidad Sub-6 GHz y mmWave (hasta 8 Gbps de descarga celular)",
      "Tecnología Wi-Fi 6E Tri-Banda (6 GHz, 5 GHz y 2.4 GHz) con velocidades inalámbricas combinadas de hasta 3.6 Gbps",
      "Puerto Ethernet 2.5G Multigigabit (2.5 Gbps / 1 Gbps) para enlazar redes cableadas corporativas o routers balanceadores",
      "Pantalla táctil LCD a color de 2.8 pulgadas para ver consumo de datos, calidad de señal celular y administrar la red",
      "Soporte para conectar hasta 32 dispositivos simultáneos sin degradación de velocidad ni pérdida de paquetes",
      "Batería de iones de litio de 5,040 mAh extraíble con hasta 13 horas de autonomía y modo Home Router (opera sin batería conectado a la pared)",
      "Desbloqueado para todas las redes celulares 5G/4G LTE de República Dominicana (Claro, Altice) y operadoras internacionales",
      "Conectores duales TS-9 para antenas externas 5G para maximizar la recepción en áreas de señal débil o soterradas",
      "Seguridad empresarial WPA3, filtrado de direcciones MAC, aislamiento de invitados y servidor VPN integrado",
      "Garantía oficial Netgear de 1 año con factura corporativa con valor fiscal NCF y soporte técnico en Santiago"
    ]
  },
  {
    "id": "energia_victron_cerbo_gx_comunicador",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Victron Energy",
    "title": "Centro de Comunicación y Monitoreo Victron Energy Cerbo GX con Portal VRM, Bluetooth y Soporte GX Touch",
    "desc": "El Victron Cerbo GX es el centro de control y monitoreo definitivo para sistemas solares fotovoltaicos, bancos de baterías y respaldo energético de alta confiabilidad en República Dominicana. Permite supervisar y comandar en tiempo real inversores MultiPlus y Quattro, controladores de carga solar SmartSolar MPPT y monitores SmartShunt desde cualquier parte del mundo a través del portal en la nube VRM (Victron Remote Management) o localmente mediante pantallas táctiles GX Touch 50 y GX Touch 70. Cuenta con conectividad Wi-Fi, Ethernet y Bluetooth LE, 3 puertos VE.Direct, 2 puertos VE.Can / BMS-Can dedicados para baterías de litio inteligentes, 2 puertos VE.Bus, 4 entradas para sensores analógicos (temperatura y nivel de tanques de agua/combustible) y 2 salidas de relé programables para encendido y apagado automático de generadores eléctricos (plantas de emergencia).",
    "price": "RD$ 24,850.00",
    "img": "img/productos/catalogo/victron-cerbo-gx-monitoreo-solar.webp",
    "gallery": [
      "img/productos/catalogo/victron-cerbo-gx-monitoreo-solar.webp"
    ],
    "specs": [
      "3 Puertos VE.Direct dedicados para controladores solares SmartSolar MPPT y monitores de batería",
      "2 Puertos VE.Can / BMS-Can para interconexión digital con baterías de litio inteligentes y redes CAN-bus",
      "2 Puertos VE.Bus para comunicación directa con inversores/cargadores MultiPlus y Quattro",
      "Conectividad de red completa: Ethernet RJ45, Wi-Fi 2.4 GHz y Bluetooth Low Energy integrados",
      "Integración total con el Portal en la Nube VRM (Victron Remote Management) gratuito para telemetría global",
      "Compatibilidad nativa con pantallas táctiles a color montables en pared GX Touch 50 y GX Touch 70",
      "4 Entradas analógicas para sensores de temperatura y niveles de tanques (resistivos)",
      "2 Salidas de relé libres de potencial para control automatizado de generadores o alertas",
      "Rango amplio de alimentación de 8V a 70V DC y montaje seguro en carril DIN o atornillado a pared",
      "Garantía oficial Victron Energy de 5 años con respaldo técnico certificado en Santiago"
    ]
  },
  {
    "id": "redes_linksys_velop_pro_7_wifi7_mesh",
    "department": "redes",
    "category": "Routers y Repetidores WiFi",
    "brand": "Linksys",
    "title": "Sistema Wi-Fi 7 Mesh Tri-Banda Linksys Velop Pro 7 (Cognitive Mesh BE11000) con Puerto WAN 2.5G Multigigabit",
    "desc": "El Linksys Velop Pro 7 introduce el nuevo estándar Wi-Fi 7 (802.11be) con tecnología Cognitive Mesh en República Dominicana, ofreciendo velocidades combinadas ultra rápidas de hasta 11 Gbps (BE11000). Diseñado para empresas, consultorías de diseño, creadores de video en 8K y residencias de alta densidad en Santiago que demandan mínima latencia y máximo ancho de banda. Incorpora la banda ultra ancha de 6 GHz con canales limpios de 320 MHz y modulación 4096-QAM, junto con tecnología Multi-Link Operation (MLO) que transmite y recibe paquetes simultáneamente a través de múltiples frecuencias para erradicar el buffering. Dispone de un puerto Ethernet WAN multigigabit de 2.5 Gbps para aprovechar conexiones de fibra óptica de ultra alta velocidad, 4 puertos LAN Gigabit, cobertura de hasta 3,000 pies cuadrados por nodo y soporte para conectar más de 200 dispositivos concurrentes sin degradación de señal.",
    "price": "RD$ 26,950.00",
    "img": "img/productos/catalogo/linksys-velop-pro-7-wifi7-mesh.webp",
    "gallery": [
      "img/productos/catalogo/linksys-velop-pro-7-wifi7-mesh.webp"
    ],
    "specs": [
      "Estándar Wi-Fi 7 de Próxima Generación (802.11be) con tecnología de autooptimización Cognitive Mesh",
      "Velocidad combinada Tri-Banda BE11000 de hasta 11 Gbps (6 GHz hasta 5765 Mbps, 5 GHz hasta 4324 Mbps, 2.4 GHz hasta 574 Mbps)",
      "Banda ultra ancha de 6 GHz con canales de 320 MHz y modulación avanzada 4096-QAM",
      "Multi-Link Operation (MLO): conexión simultánea en varias bandas para latencia ultrabaja en streaming y videoconferencias",
      "1 Puerto Ethernet WAN 2.5G Multigigabit + 4 Puertos LAN Gigabit para conexiones cableadas de alto rendimiento",
      "Cobertura inalámbrica de hasta 3,000 pies cuadrados por nodo y soporte para más de 200 clientes simultáneos",
      "Configuración rápida e intuitiva desde la app móvil Linksys con red de invitados y controles parentales",
      "Diseño en torre vertical premium con ventilación pasiva optimizada y LED superior indicador de estado",
      "Seguridad avanzada WPA3 Personal/Enterprise y actualizaciones de firmware automáticas seguras",
      "Garantía oficial Linksys de 3 años con factura con crédito fiscal NCF en República Dominicana"
    ]
  },
  {
    "id": "energia_siemens_sinamics_v20_variador_frecuencia",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Siemens",
    "title": "Variador de Frecuencia Industrial Siemens SINAMICS V20 de 2.2 kW / 3 HP 230V con Panel BOP y Modbus RTU",
    "desc": "El convertidor de frecuencia industrial Siemens SINAMICS V20 (referencia 6SL3210-5BB22-2AV0) de 2.2 kW (3 HP) a 200V-240V monofásico/trifásico es la solución económica, robusta y eficiente para el control de velocidad y arranque suave de motores eléctricos trifásicos en Santiago y parques industriales de la región norte. Optimizado para sistemas de bombeo hidroneumático, compresores, torres de enfriamiento, ventilación forzada en parqueos y transportadores mecánicos. Incorpora panel básico de operador (BOP) integrado con visualizador digital y potenciómetro para ajuste intuitivo en campo, interfaz de comunicación serial RS485 nativa con protocolos Modbus RTU y USS para enlace con PLCs Siemens LOGO! o SIMATIC S7, modo ECO automático que reduce el consumo de energía en cargas variables de bombas y ventiladores, y tarjetas de circuito barnizadas según especificación 3C2/3S2 para resistir ambientes corrosivos, polvo y humedad tropical.",
    "price": "RD$ 28,500.00",
    "img": "img/productos/catalogo/siemens-sinamics-v20-variador-frecuencia.webp",
    "gallery": [
      "img/productos/catalogo/siemens-sinamics-v20-variador-frecuencia.webp"
    ],
    "specs": [
      "Potencia nominal: 2.2 kW (3 HP) con sobrecarga de 150% durante 60 segundos",
      "Tensión de entrada: 200V a 240V AC monofásica/trifásica (47 Hz a 63 Hz) con filtro integrado",
      "Panel Básico de Operador (BOP) integrado en la carátula frontal con display LED y teclas de control directo",
      "Modos de control: V/f lineal, cuadrático, configurable y Control de Compensación de Flujo de Corriente (FCC)",
      "Comunicación serial RS485 nativa con compatibilidad directa para protocolos industriales Modbus RTU y USS",
      "Modo ECO automático y modo de hibernación para reducción óptima del gasto eléctrico en bombas y sopladores",
      "Entradas y Salidas: 4 entradas digitales, 2 entradas analógicas (0-10V / 4-20mA), 1 salida a transistor y 1 salida relé",
      "Protección avanzada: sobrecorriente, sobretensión, subtensión, sobretemperatura y cortocircuito a tierra",
      "Recubrimiento de barniz 3C2 y 3S2 en tarjetas electrónicas para máxima resistencia a la humedad del Cibao",
      "Garantía oficial Siemens de 2 años con soporte técnico especializado para automatización en Santiago"
    ]
  },
  {
    "id": "oficina_panasonic_kx_ns500_central_telefonica_pbx",
    "department": "oficina",
    "category": "Equipos de Oficina",
    "brand": "Panasonic",
    "title": "Central Telefónica IP PBX Híbrida Inteligente Panasonic KX-NS500 para Comunicaciones Unificadas Corporativas",
    "desc": "El servidor de comunicaciones corporativas Panasonic KX-NS500 es el conmutador híbrido inteligente de referencia para centros médicos, clínicas, despachos jurídicos, colegios y empresas en Santiago que desean combinar telefonía tradicional analógica con enlaces IP VoIP modernos sin desperdiciar inversiones previas. Viene preconfigurado de fábrica con 6 líneas analógicas de entrada con identificación de llamadas y 18 extensiones (16 digitales para teléfonos ejecutivos de la serie KX-DT y 2 analógicas con soporte de fax), siendo expandible de manera modular hasta 288 extensiones y 128 troncales SIP. Dispone de operadora automática multinivel (DISA), buzón de voz integrado de alta capacidad con envío automático de mensajes de voz al correo electrónico (Voice Mail to Email) en formato WAV, servidor CTI integrado para enlace con sistemas CRM y chasis metálico para instalación en rack estándar de 19 pulgadas (2U) con máxima confiabilidad operativa.",
    "price": "RD$ 49,900.00",
    "img": "img/productos/catalogo/panasonic-kx-ns500-central-pbx.webp",
    "gallery": [
      "img/productos/catalogo/panasonic-kx-ns500-central-pbx.webp"
    ],
    "specs": [
      "Capacidad inicial de fábrica: 6 Líneas Analógicas entrantes + 18 Extensiones (16 Digitales + 2 Analógicas)",
      "Escalabilidad modular corporativa: expandible hasta 288 extensiones de usuario y 128 troncales SIP VoIP",
      "Operadora Automática Multinivel (DISA de 2 canales preinstalada, ampliable a 24 canales)",
      "Sistema de Mensajería Unificada: Correo de Voz Inteligente con reenvío de audios al email (Voice Mail to Email)",
      "Compatibilidad total con teléfonos IP SIP Panasonic KX-HDV y sistemas inalámbricos DECT multizona KX-TGP600",
      "Servidor de Comunicaciones CTI integrado con soporte para marcación desde PC y visualización de llamadas en CRM",
      "Puertos de red: interfaz LAN Ethernet 10/100 Mbps para gestión web intuitiva y telefonía IP",
      "Chasis metálico para montaje en rack de telecomunicaciones estándar de 19 pulgadas (altura 2U)",
      "Funciones avanzadas: grupos de timbrado, desvío automático de llamadas, música en espera y conferencias múltiples",
      "Garantía oficial Panasonic con respaldo, repuestos y servicio de programación profesional en Santiago"
    ]
  },
  {
    "id": "redes_juniper_ex3400_24t_switch",
    "department": "redes",
    "category": "Switches de Red",
    "brand": "Juniper",
    "title": "Switch de Agregación Layer 3 Juniper Networks EX3400-24T con 4 Puertos Uplink 10GbE SFP+ y 2 Puertos 40GbE QSFP+ (Virtual Chassis)",
    "desc": "El conmutador empresarial de capa de agregación y núcleo Layer 3 Juniper Networks EX3400-24T es la plataforma de interconexión Ethernet de alto rendimiento ideal para salas de servidores, distribución de red en edificios corporativos y enlaces troncales en zonas francas de Santiago. Dispone de 24 puertos Gigabit Ethernet 10/100/1000BASE-T RJ45, 4 puertos uplink dedicados de 10GbE SFP+ para fibra óptica y 2 puertos de 40GbE QSFP+ para tecnología de apilamiento Virtual Chassis, permitiendo gestionar hasta 10 switches interconectados como un único dispositivo lógico con una sola IP de gestión. Ejecuta el sistema operativo Junos OS con arquitectura de alta disponibilidad, enrutamiento L3 dinámico completo IPv4 e IPv6 (OSPF, RIP, BGP y VRRP), calidad de servicio QoS granular, fuentes de alimentación modulares y ventiladores redundantes con capacidad de conmutación total de 144 Gbps.",
    "price": "RD$ 58,900.00",
    "img": "img/productos/catalogo/juniper-ex3400-24t.webp",
    "gallery": [
      "img/productos/catalogo/juniper-ex3400-24t.webp"
    ],
    "specs": [
      "24 Puertos Gigabit Ethernet 10/100/1000BASE-T RJ45 para distribución y acceso empresarial",
      "4 Puertos Uplink dedicados 10GbE SFP+ para enlaces de fibra óptica de alta capacidad",
      "2 Puertos de alta velocidad 40GbE QSFP+ para tecnología de apilamiento Virtual Chassis (hasta 10 conmutadores)",
      "Capacidad de conmutación de 144 Gbps y rendimiento de reenvío de 108 Mpps",
      "Enrutamiento Layer 3 completo: IPv4/IPv6, OSPF, RIP v1/v2, BGP, VRRP y rutas estáticas avanzadas",
      "Sistema Operativo Junos OS con arquitectura modular resistente a fallos y actualizaciones sin caída de servicio",
      "Gestión centralizada mediante CLI Junos, interfaz Web J-Web y compatibilidad con Juniper Mist Cloud AI",
      "Fuentes de alimentación y ventiladores modulares redundantes con flujo de aire optimizado",
      "Chasis metálico para montaje en rack de 19 pulgadas estándar (altura 1U)",
      "Garantía oficial corporativa Juniper Networks con soporte técnico y configuración en Santiago"
    ]
  },
  {
    "id": "energia_mitsubishi_msz_gl24_aire_inverter",
    "department": "energia",
    "category": "Aires Acondicionados",
    "brand": "Mitsubishi Electric",
    "title": "Aire Acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 24,000 BTU Ultra Silencioso 20.5 SEER con Filtro Nano-Platinum",
    "desc": "El mini-split inverter Mitsubishi Electric MSZ-GL24NA de 24,000 BTU (2 Toneladas de refrigeración) es el sistema de climatización de ultra alta eficiencia por excelencia para salas de juntas, oficinas ejecutivas amplias, auditorios, restaurantes y suites corporativas en Santiago que exigen máximo poder de enfriamiento continuo con consumo energético mínimo. Dotado de compresor inverter de velocidad variable certificado con 20.5 SEER y 12.5 EER, ahorra hasta un 50% de electricidad en comparación con equipos tradicionales. Dispone de tecnología Whisper-Quiet con nivel de ruido tan bajo como 34 dB en la unidad interior, filtro purificador avanzado Nano-Platinum lavable para atrapar partículas microscópicas y neutralizar bacterias, deflector motorizado Multi-Vane para distribución tridimensional homogénea del aire en espacios de hasta 60 metros cuadrados, modo EconoCool inteligente y recubrimiento anticorrosivo Blue Fin en el serpentín de la unidad exterior condensadora para máxima protección frente a la humedad tropical de República Dominicana.",
    "price": "RD$ 68,500.00",
    "img": "img/productos/catalogo/mitsubishi-msz-gl24-aire-inverter.webp",
    "gallery": [
      "img/productos/catalogo/mitsubishi-msz-gl24-aire-inverter.webp"
    ],
    "specs": [
      "Capacidad nominal de enfriamiento: 24,000 BTU/h (2 Toneladas) con compresor Inverter de velocidad variable",
      "Alta eficiencia energética con certificación 20.5 SEER y 12.5 EER para ahorro drástico de electricidad",
      "Operación ultra silenciosa con tecnología Whisper-Quiet de hasta 34 dB en la unidad interior",
      "Filtro purificador avanzado Nano-Platinum lavable con absorción de partículas microscópicas y olores",
      "Función EconoCool que ajusta el flujo de aire basándose en la temperatura de salida ahorrando hasta 20%",
      "Flujo de aire inteligente Multi-Vane con deflector amplio para distribución uniforme en áreas de hasta 60 m²",
      "Revestimiento anticorrosivo Blue Fin en condensador exterior para resistencia al clima tropical dominicano",
      "Control remoto inalámbrico inteligente con programación de temporizador semanal 24/7",
      "Alimentación eléctrica: 208V/230V monofásica 60 Hz ideal para redes residenciales y comerciales del Cibao",
      "Garantía oficial Mitsubishi Electric de 7 años en compresor y 5 años en piezas con soporte en Santiago"
    ]
  },
  {
    "id": "seguridad_paradox_tm70_teclado_tactil",
    "department": "seguridad",
    "category": "Sistemas de Alarmas",
    "brand": "Paradox",
    "title": "Teclado Táctil Interactivo Paradox Touch TM70 de 7 Pulgadas a Color con Ranura microSD para Alarmas Magellan y Spectra",
    "desc": "El teclado interactivo táctil Paradox TM70 es la interfaz de control de última generación para paneles de alarma de intrusión Paradox Magellan (MG5000, MG5050+, MG5075) y Spectra SP (SP4000, SP5500, SP6000) en República Dominicana. Incorpora una vibrante pantalla LCD táctil a color de 7.0 pulgadas con resolución de 800 x 480 píxeles y navegación completamente intuitiva basada en íconos gráficos y menús guiados paso a paso. Permite controlar hasta 8 particiones independientes y 64 zonas con armado instantáneo StayD, armado de noche Sleep y desarmado mediante código numérico de seguridad. Su función más innovadora es la visualización gráfica de planos interactivos de planta (Floor Plans) de la propiedad residencial o comercial, permitiendo al usuario identificar visualmente qué sensor de movimiento o contacto magnético ha sido activado. Incluye sensor de temperatura ambiental interior, entrada auxiliar de zona cableada, ranura para tarjetas de memoria microSD para carga personalizada de planos o fotos y chasis ultra delgado de montaje en pared con acabado elegante.",
    "price": "RD$ 14,900.00",
    "img": "img/productos/catalogo/paradox-tm70-teclado-tactil.webp",
    "gallery": [
      "img/productos/catalogo/paradox-tm70-teclado-tactil.webp"
    ],
    "specs": [
      "Pantalla táctil a color brillante de 7.0 pulgadas (800 x 480 píxeles) con interfaz intuitiva basada en íconos",
      "Compatibilidad total con paneles Paradox Magellan (MG5000, MG5050+, MG5075) y Spectra SP (SP4000, SP5500, SP6000)",
      "Sensor de temperatura interior integrado con visualización en tiempo real en la pantalla de inicio",
      "Visualización gráfica de planos interactivos de la instalación (Floor Plans) para identificar zonas activadas",
      "Ranura para tarjeta microSD incluida para carga personalizada de planos de casas u oficinas y fotos protectoras",
      "Control de hasta 8 particiones independientes y 64 zonas con armado rápido StayD y armados totales",
      "1 Entrada de zona en teclado / sensor de temperatura exterior conmutable",
      "Diseño ultra delgado y elegante de montaje en superficie sobre pared para residencias y comercios modernos",
      "Actualización sencilla de firmware in situ mediante la tarjeta microSD",
      "Garantía oficial Paradox con soporte técnico calificado y programación en Santiago y la región Norte"
    ]
  },
  {
    "id": "energia_tesla_powerwall_3_bateria_solar_inversor",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Tesla",
    "title": "Sistema de Batería Solar Todo-en-Uno Tesla Powerwall 3 (13.5 kWh) con Inversor Solar Integrado de 11.5 kW y 6 Entradas MPPT",
    "desc": "El Tesla Powerwall 3 es la solución integrada de almacenamiento y energía solar de próxima generación para residencias, fincas de descanso y negocios en Santiago y toda República Dominicana. Combina en una sola estructura compacta y elegante una batería de litio ferrofosfato (LFP) de 13.5 kWh de capacidad neta y un potente inversor solar fotovoltaico de 11.5 kW de potencia continua, eliminando por completo la compra de inversores solares adicionales. Incorpora 6 seguidores de máxima potencia (MPPT) para conectar hasta 20 kW de módulos solares con captación óptima ante sombras parciales, capacidad de arranque de motores y acondicionadores de aire sin requerir soft-starters (LRA alto), conmutación instantánea a respaldo en menos de 100 ms ante cortes de la red eléctrica, diseño sellado con clasificación IP67 resistente a intemperie extrema y gestión inteligente total desde la aplicación móvil oficial de Tesla.",
    "price": "Cotizar",
    "img": "img/productos/catalogo/tesla-powerwall-3.webp",
    "gallery": [
      "img/productos/catalogo/tesla-powerwall-3.webp"
    ],
    "specs": [
      "Capacidad de energía almacenable neta: 13.5 kWh con química de celdas de Litio Ferro-Fosfato (LFP) de máxima seguridad y vida útil",
      "Inversor solar fotovoltaico integrado de 11.5 kW continuos: no requiere inversor solar externo, instalación todo-en-uno",
      "6 Entradas y seguidores independientes de máxima potencia (MPPT) para conectar hasta 20 kW DC de módulos fotovoltaicos",
      "Potencia de salida continua: 11.5 kW en red y fuera de red (backup) con capacidad de sobrecarga pico para arranque de motores",
      "Arranque de acondicionadores de aire de hasta 5 toneladas sin necesidad de kit soft-starter adicional (capacidad LRA ultra alta)",
      "Tiempo de transferencia ante corte eléctrico: respaldo automático instantáneo en menos de 100 milisegundos",
      "Eficiencia solar-a-batería-a-red del 97.5% líder en la industria de energías renovables",
      "Protección climática IP67 certificada: apto para instalación interior o exterior resistente a inundaciones y polvo",
      "Monitoreo 24/7 y gestión inteligente de tarifas, tormentas (Storm Watch) y autoconsumo desde la aplicación móvil oficial Tesla",
      "Garantía oficial Tesla de 10 años con retención de capacidad y servicio técnico certificado por Futunet en República Dominicana"
    ]
  },
  {
    "id": "redes_juniper_srx320_security_gateway",
    "department": "redes",
    "category": "Routers y Repetidores WiFi",
    "brand": "Juniper Networks",
    "title": "Firewall y Gateway de Servicios Juniper Networks SRX320 con 8 Puertos Gigabit (PoE+), VPN IPsec y SD-WAN",
    "desc": "El Juniper Networks SRX320 (SRX320-JSB-L) es la plataforma de seguridad, conectividad y conmutación unificada de referencia para sucursales corporativas, bancos, centros médicos y sedes empresariales en Santiago y la región del Cibao. Integra un firewall stateful de inspección profunda con rendimiento de hasta 1 Gbps, VPN IPsec acelerada por hardware de 300 Mbps y hasta 64,000 sesiones concurrentes. Incorpora 8 puertos Gigabit Ethernet: 6 puertos RJ45 10/100/1000 (con 4 puertos PoE 802.3at con presupuesto de energía integrado para alimentar teléfonos IP VoIP y puntos de acceso Wi-Fi sin cableado eléctrico adicional) más 2 puertos combo Gigabit SFP/RJ45 para enlaces troncales de fibra óptica de alta velocidad. Gestionado por el reconocido sistema operativo Junos OS, ofrece prevención de intrusiones, ruteo dinámico empresarial BGP/OSPF/MPLS, políticas de seguridad avanzadas y compatibilidad con Juniper Mist Cloud AI y redes SD-WAN seguras.",
    "price": "RD$ 42,900.00",
    "img": "img/productos/catalogo/juniper-srx320-firewall-poe.webp",
    "gallery": [
      "img/productos/catalogo/juniper-srx320-firewall-poe.webp"
    ],
    "specs": [
      "Rendimiento de firewall Stateful: hasta 1 Gbps con inspección profunda de paquetes y políticas Junos OS",
      "8 Puertos Gigabit Ethernet: 6x RJ45 10/100/1000 + 2x Combo SFP/RJ45 para enlaces troncales de fibra",
      "4 Puertos PoE 802.3at integrados para alimentación directa de terminales VoIP y puntos de acceso inalámbricos",
      "Rendimiento VPN IPsec: hasta 300 Mbps con cifrado AES-256 por hardware y hasta 256 túneles simultáneos",
      "Capacidad corporativa: hasta 64,000 sesiones concurrentes para medianas empresas y clínicas",
      "Sistema operativo de clase portadora Junos OS con CLI potente, scripting y configuración a prueba de fallos",
      "Enrutamiento dinámico avanzado: soporte completo de protocolos BGP, OSPF, RIP, IS-IS y MPLS",
      "Soporte nativo para SD-WAN seguro con dirección inteligente de tráfico por aplicación",
      "Diseño compacto y silencioso para montaje en rack estándar de 19 pulgadas (altura 1U) o sobremesa",
      "Garantía oficial Juniper Networks con soporte técnico de ingeniería calificada en Santiago"
    ]
  },
  {
    "id": "energia_tesla_backup_gateway_2",
    "department": "energia",
    "category": "Energía y Climatización",
    "brand": "Tesla",
    "title": "Controlador Inteligente de Energía y Microrred Tesla Backup Gateway 2 para Monitoreo y Conmutación Instantánea",
    "desc": "El Tesla Backup Gateway 2 es el centro neurálgico inteligente para la gestión de microrredes, integración de energía solar fotovoltaica y sistemas de almacenamiento con baterías Tesla Powerwall en República Dominicana. Se instala como el punto de interconexión entre la red eléctrica comercial (Edenorte) y la propiedad residencial o empresarial, supervisando de forma continua la calidad del suministro. Ante un corte de energía, desconecta de manera segura el inmueble de la red comercial y conmuta al modo de respaldo de la batería en menos de 100 milisegundos, garantizando continuidad absoluta y cero apagado de equipos electrónicos sensibles, servidores o sistemas de refrigeración. Incorpora un interruptor de aislamiento de red de 200A continuo para respaldo total del hogar, medición bidireccional de consumo con precisión de Grado 1%, conectividad triple (Wi-Fi, Ethernet Gigabit y celular integrada para enlace constante con la Tesla App), gestión automática de reservas energéticas frente a alertas meteorológicas mediante la función Storm Watch y gabinete NEMA 3R sellado para intemperie.",
    "price": "Cotizar",
    "img": "img/productos/catalogo/tesla-backup-gateway-2.webp",
    "gallery": [
      "img/productos/catalogo/tesla-backup-gateway-2.webp"
    ],
    "specs": [
      "Gestor inteligente de microrred y enlace con la red eléctrica comercial para sistemas Tesla Powerwall",
      "Conmutación instantánea ante fallos eléctricos de la red (Grid Outage) en menos de 100 milisegundos sin microcortes",
      "Medición de energía y monitoreo de consumo en tiempo real de toda la casa/edificio comercial con precisión Grado 1%",
      "Conectividad integral: Wi-Fi, Ethernet Gigabit y conectividad celular integrada para telemetría continua en la Tesla App",
      "Interruptor de aislamiento de red (Grid Disconnect Switch) de 200A continuo para respaldo total de la propiedad",
      "Integración nativa con paneles solares, inversores fotovoltaicos y cargadores Tesla Wall Connector",
      "Gabinete con clasificación NEMA 3R para instalación en exteriores o interiores resistente a lluvias y polvo",
      "Gestión automática de reservas energéticas para tormentas mediante la función Storm Watch de Tesla",
      "Voltaje de operación nominal: 120/240V AC monofásica 60 Hz compatible con la red eléctrica dominicana",
      "Garantía oficial Tesla de 10 años con certificación de ingeniería de respaldo energético en Santiago"
    ]
  },
  {
    "id": "redes_mikrotik_crs328_24p_4s_switch_poe",
    "department": "redes",
    "category": "Switches de Red",
    "brand": "MikroTik",
    "title": "Switch Administrable PoE+ de Distribución MikroTik CRS328-24P-4S+RM (24 Puertos Gigabit PoE+ 500W con 4 Puertos 10G SFP+)",
    "desc": "El conmutador administrable de alta densidad MikroTik CRS328-24P-4S+RM es la plataforma de conmutación y alimentación PoE por excelencia para cuartos de telecomunicaciones, sistemas de videovigilancia IP masiva, telefonía VoIP y redes corporativas de alto tráfico en Santiago y parques industriales de la región Norte. Cuenta con 24 puertos Gigabit Ethernet 10/100/1000BASE-T con salida PoE automática y configurable en cada puerto (soporta estándares 802.3af/at PoE/PoE+ y Passive PoE de 24V) respaldados por una fuente de alimentación masiva integrada de 500W, permitiendo alimentar cámaras de seguridad PTZ, puntos de acceso Wi-Fi 6 de alta potencia y teléfonos IP sin requerir inyectores individuales. Incorpora 4 puertos de enlace ascendente de ultra alta velocidad 10GbE SFP+ para fibra óptica que garantizan cero cuellos de botella en la distribución hacia el núcleo de la red. Viene equipado con arquitectura de arranque Dual Boot que permite al administrador seleccionar entre RouterOS v7 (para enrutamiento Layer 3 dinámico, cortafuegos con inspección de estado, VLANs avanzadas y túneles VPN) o SwOS (para administración web intuitiva y liviana de funciones de capa 2), chasis metálico para montaje en rack de 19 pulgadas (1U) y doble fuente de poder para redundancia de servicio.",
    "price": "RD$ 34,900.00",
    "img": "img/productos/catalogo/mikrotik-crs328-24p-4s-switch-poe.webp",
    "gallery": [
      "img/productos/catalogo/mikrotik-crs328-24p-4s-switch-poe.webp"
    ],
    "specs": [
      "24 Puertos Gigabit Ethernet RJ45 con autodetección de salida PoE (802.3af/at PoE/PoE+ y Passive PoE 24V)",
      "Presupuesto de potencia PoE total masivo de hasta 500W (hasta 30W por puerto 802.3at y 450mA en 24V)",
      "4 Puertos Uplink dedicados de fibra óptica 10GbE SFP+ para enlaces troncales de 10 Gbps sin congestión",
      "Selector Dual Boot: arranque flexible entre RouterOS v7 (enrutamiento L3, VPNs y firewall) y SwOS (conmutación L2)",
      "Capacidad de conmutación sin bloqueo (Non-blocking throughput): 64 Gbps, con capacidad total de switching de 128 Gbps",
      "Tasa de reenvío de paquetes: 95.2 Mpps para tráfico empresarial de alta densidad sin saturación",
      "Doble fuente de alimentación interna redundante (100-240V AC) para máxima confiabilidad operativa y cero desconexión",
      "Funciones Layer 2 y Layer 3 completas: Port Isolation, Storm Control, Mirroring, VLAN 802.1Q, IGMP Snooping y ACLs",
      "Chasis metálico profesional para montaje en rack estándar de 19 pulgadas (altura 1U) con ventilación termo-regulada",
      "Garantía oficial MikroTik con respaldo, soporte técnico especializado y configuración profesional en Santiago"
    ]
  },
  {
    "id": "energia_victron_lynx_distributor_1000a",
    "department": "energia",
    "category": "Energía y Respaldo",
    "brand": "Victron Energy",
    "title": "Bloque de Distribución Modular y Barra Colectora Victron Energy Lynx Distributor (1000A DC) con Monitoreo de Fusibles LED",
    "desc": "El Victron Energy Lynx Distributor (M10) es una barra colectora modular de corriente continua (DC Busbar) de grado profesional diseñada para salas de energía solar, cuartos técnicos de baterías de litio LiFePO4 e instalaciones de inversores de alta potencia Victron MultiPlus o Quattro en Santiago y República Dominicana. Clasificada para manejar corrientes masivas continuas de hasta 1000A en sistemas de 9V a 60V DC (12V, 24V o 48V), permite conectar de forma limpia, segura y estandarizada hasta 4 conexiones de fusibles individuales tipo MEGA-fuse en los circuitos de inversores, controladores solares MPPT y bancos de baterías. Integra una placa de telemetría con 4 indicadores LED bicolores en el panel frontal que proporcionan monitoreo visual inmediato del estado de cada fusible (iluminación verde fija cuando el circuito está operativo y rojo intermitente cuando un fusible se ha fundido). Dispone de pernos de cobre estañado M10 de alta resistencia para terminales de cable de gran calibre y conector RJ10 para comunicación directa con módulos Lynx Shunt VE.Can o Lynx Smart BMS, logrando una instalación de energía solar certificada, modular y visualmente impecable.",
    "price": "RD$ 18,500.00",
    "img": "img/productos/catalogo/victron-lynx-distributor-1000a.webp",
    "gallery": [
      "img/productos/catalogo/victron-lynx-distributor-1000a.webp"
    ],
    "specs": [
      "Barra colectora modular de alta capacidad de corriente continua (DC Busbar) clasificada hasta 1000A continuos",
      "Rango de voltaje de operación amplio: de 9V a 60V DC (compatible con sistemas de 12V, 24V y 48V de litio y plomo)",
      "Conexión para hasta 4 fusibles individuales de alta corriente tipo MEGA-fuse (de 40A hasta 500A por circuito)",
      "Indicadores LED bicolores de monitoreo de estado para cada fusible (Verde = Operativo, Rojo = Fusible fundido)",
      "Terminaciones de pernos de cobre estañado M10 de alta resistencia para terminales de cable de gran sección",
      "Conexión RJ10 integrada para alimentación de telemetría y comunicación con módulos Lynx Shunt o Smart BMS",
      "Diseño modular en gabinete sellado ABS autoextinguible para acoplamiento directo lado a lado sin cables intermedios",
      "Simplifica drásticamente el cableado de corriente continua eliminando bornes desordenados y riesgos de cortocircuito",
      "Ideal para integraciones con inversores Victron MultiPlus, Quattro y controladores solares SmartSolar MPPT",
      "Garantía oficial Victron Energy de 5 años con respaldo de ingeniería y diagramado de conexión en Santiago"
    ]
  },
  {
    "id": "seguridad_ezviz_eb8_4g_camara_solar_ptz",
    "department": "seguridad",
    "category": "CCTV y Seguridad Electrónica",
    "brand": "Ezviz",
    "title": "Cámara de Seguridad Solar 4G LTE PTZ Ezviz EB8 4G (2K 3MP) con Batería Recargable de 10,400 mAh y Panel Solar",
    "desc": "La cámara de seguridad motorizada exterior Ezviz EB8 4G con panel solar es la solución definitiva de videovigilancia 100% inalámbrica y autónoma para fincas, casas de campo en Jarabacoa y San José de las Matas, proyectos en construcción y zonas agrícolas del Cibao donde no llega la red eléctrica ni cobertura Wi-Fi. Incorpora módem celular 4G LTE compatible con tarjetas microSIM de Claro y Altice en República Dominicana, batería de litio recargable masiva de 10,400 mAh y panel solar fotovoltaico de acoplamiento continuo para funcionamiento ininterrumpido 24/7 sin recargas manuales. Ofrece resolución 2K cristalina (2304x1296), rotación motorizada panorámica de 360° con inclinación de 80°, visión nocturna a todo color con focos LED integrados, sensor PIR y algoritmo de inteligencia artificial para detección y seguimiento automático de figuras humanas sin falsas alarmas, sirena disuasoria con luz estroboscópica, audio bidireccional de alta fidelidad, GPS integrado para localización del dispositivo en campo y certificación climática IP65 resistente a lluvias tropicales.",
    "price": "RD$ 13,900.00",
    "img": "img/productos/catalogo/ezviz-eb8-4g-camara-solar-ptz.webp",
    "gallery": [
      "img/productos/catalogo/ezviz-eb8-4g-camara-solar-ptz.webp"
    ],
    "specs": [
      "Conectividad celular directa 4G LTE: funciona con tarjeta MicroSIM (Claro/Altice) sin necesidad de Wi-Fi ni enrutadores",
      "Batería recargable integrada de 10,400 mAh con panel solar incluido para energía solar limpia e ininterrumpida",
      "Resolución 2K (3 Megapíxeles 2304x1296) a 15 fps con compresión ultra eficiente H.265 / H.264",
      "Cobertura visual total de 360°: rotación panorámica motorizada de 340° e inclinación vertical de 80° con auto-tracking",
      "Doble sistema de visión nocturna: infrarroja de largo alcance (hasta 15m) y visión nocturna a todo color con reflectores LED",
      "Detección inteligente de siluetas humanas asistida por IA y sensor PIR térmico para eliminar falsas alertas por vegetación",
      "Defensa activa automática: activa potente sirena sonora y dos reflectores estroboscópicos ante intrusiones no autorizadas",
      "Audio bidireccional en vivo con micrófono y altavoz de alta potencia para comunicación remota y advertencias de voz",
      "Ranura para tarjeta microSD de hasta 512 GB y almacenamiento cifrado en la nube EZVIZ CloudPlay",
      "Gabinete para intemperie con certificación IP65 y garantía oficial Ezviz en República Dominicana"
    ]
  },
  {
    "id": "equipos_logitech_rally_plus_videoconferencia_4k",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Logitech",
    "title": "Sistema Modular de Videoconferencia Empresarial Logitech Rally Plus Ultra HD 4K con 2 Bocinas y 2 Mic Pods",
    "desc": "El Logitech Rally Plus es el sistema insignia de videoconferencia modular de ultra alta definición diseñado para salas de juntas ejecutivas, auditorios corporativos, salas de conferencias y salones de consejo en empresas e instituciones de Santiago y República Dominicana. Su avanzada cámara Rally PTZ motorizada cuenta con lente de cristal con óptica ultra nítida 4K UHD, zoom digital y óptico combinado de 15X y tecnología de encuadre automático RightSight de Logitech que ajusta el encuadre dinámicamente para incluir a todos los participantes en la mesa de forma elegante. Incluye 2 bocinas frontales independientes de alta fidelidad que proyectan voces claras y naturales con tecnología antivibración RightSound, y 2 bases de micrófonos Rally Mic Pod de mesa con matrices beamforming de captación omnidireccional de 360 grados que nivelan automáticamente las voces y suprimen el ruido ambiental. Su arquitectura de cableado simplificada mediante concentrador de mesa (Table Hub) y concentrador de pantalla (Display Hub) interconectados por un único cable Cat 6A elimina el desorden de cables en la mesa de juntas, siendo compatible nativo con Microsoft Teams Rooms, Zoom Rooms, Google Meet y Cisco Webex.",
    "price": "RD$ 145,000.00",
    "img": "img/productos/catalogo/logitech-rally-plus-videoconferencia-4k.webp",
    "gallery": [
      "img/productos/catalogo/logitech-rally-plus-videoconferencia-4k.webp"
    ],
    "specs": [
      "Cámara Ultra-HD 4K PTZ motorizada con movimiento horizontal ±90°, inclinación +50°/-90° y zoom 15X HD",
      "Tecnología RightSight de encuadre automático por IA que detecta y centra a los participantes en la sala",
      "Tecnología RightLight con amplio rango dinámico (WDR) para optimizar el tono de piel y rostros en contraluz",
      "Sistema de audio modular de alta fidelidad: incluye 2 bocinas Rally frontales de 76 mm con suspensión anti-vibración",
      "Incluye 2 bases de micrófonos Rally Mic Pod de mesa con 4 micrófonos beamforming cada uno (ampliable hasta 7 Mic Pods)",
      "Tecnología RightSound con nivelación automática de voces suaves/altas y supresión activa de ruido y eco",
      "Concentrador de mesa (Table Hub) y Concentrador de pantalla (Display Hub) conectados por un único cable Cat 6A",
      "Compatibilidad certificada Plug-and-Play USB con Microsoft Teams Rooms, Zoom Rooms, Google Meet y Webex",
      "Control remoto por radiofrecuencia (RF) de largo alcance con botones de preajustes de cámara y silenciamiento",
      "Diseño prémium en acabados de aluminio y tela acústica gris carbón para salas de consejo corporativas",
      "Garantía oficial Logitech de 2 años con soporte técnico e instalación certificada en Santiago"
    ]
  },
  {
    "id": "oficina_samsung_the_frame_pro_55_qled_4k",
    "department": "equipos",
    "category": "Computadoras",
    "brand": "Samsung",
    "title": "Pantalla Comercial Profesional Samsung The Frame Pro de 55 Pulgadas QLED 4K UHD con Acabado Mate y Modo Arte",
    "desc": "La pantalla comercial Samsung The Frame Pro de 55 pulgadas combina la tecnología de visualización más avanzada con una estética de galería de arte contemporáneo para oficinas de alta dirección, salas de juntas ejecutivas, lobbies corporativos, centros médicos y suites de hotel en Santiago de los Caballeros. Diseñada para lucir como un cuadro artístico en la pared cuando no se utiliza para presentaciones o videoconferencias, incorpora la innovadora pantalla mate antirreflejo (Matte Display) con certificación antideslumbrante que dispersa la luz ambiental eliminando por completo los reflejos de ventanas y luminarias de techo. Su panel Quantum Dot QLED 4K (3840 x 2160) con tasa de refresco nativa de 120Hz reproduce el 100% del volumen de color cinematográfico con precisión validada por Pantone. Cuenta con la caja de conexiones externa One Connect Box y cable casi invisible de un solo hilo que transmite energía y señal 4K ocultando los cables, soporte de pared ultrafino Slim Fit Wall-Mount incluido para un montaje completamente pegado a la pared, sensores inteligentes de movimiento y brillo que activan el Modo Arte en presencia de personas, y plataforma empresarial Samsung Tizen OS con protección de seguridad Knox.",
    "price": "RD$ 68,500.00",
    "img": "img/productos/catalogo/samsung-the-frame-pro-55-qled-4k.webp",
    "gallery": [
      "img/productos/catalogo/samsung-the-frame-pro-55-qled-4k.webp"
    ],
    "specs": [
      "Pantalla de 55 pulgadas QLED 4K Ultra HD (3840 x 2160) con tasa de refresco nativa ultra fluida de 120Hz",
      "Acabado Matte Display Antirreflejo certificado por UL que elimina reflejos de lámparas y luz solar directa",
      "Modo Arte Profesional (Art Mode): exhibe obras de arte, cuadros o señalización digital corporativa al suspenderse",
      "Sensor de brillo ambiental y sensor de movimiento que apaga la pantalla cuando la habitación está vacía",
      "Caja de conexión externa One Connect Box con cable único casi invisible de 5 metros para energía y datos 4K",
      "Soporte de pared ultrafino Slim Fit Wall-Mount incluido que adhiere la pantalla al ras de la pared sin separación",
      "Tecnología Quantum Dot con 100% de volumen de color DCI-P3 y validación oficial de fidelidad de color Pantone",
      "Procesador Quantum 4K con escalado inteligente por inteligencia artificial y sonido en movimiento OTS",
      "Marcos magnéticos personalizables intercambiables (estilo teca, nogal, blanco o bronce) disponibles",
      "Plataforma inteligente Tizen para presentaciones inalámbricas desde laptops Windows/Mac (AirPlay 2 / Miracast)",
      "Garantía oficial Samsung de 1 año con servicio de instalación y montaje profesional en Santiago"
    ]
  },
  {
    "id": "seguridad_zkteco_cmp200_barrera_vehicular_automatica",
    "department": "seguridad",
    "category": "Seguridad Electrónica & Control de Acceso",
    "brand": "ZKTeco",
    "title": "Barrera Vehicular Automática de Alta Velocidad ZKTeco CMP200 con Brazo Telescópico de 3 a 6 Metros y Motor Brushless DC",
    "desc": "La barrera electromecánica de acceso vehicular ZKTeco CMP200 es la solución líder de alta confiabilidad y respuesta ultra rápida para control de tránsito y acceso vehicular en residenciales cerrados, torres departamentales, centros comerciales, zonas francas y estacionamientos corporativos en Santiago y toda la región Norte. Equipada con motor sin escobillas Brushless DC (BLDC) de 24V de alta eficiencia energética y estructura mecánica de fundición a presión, soporta ciclos de trabajo intensivo continuo 24/7 sin sobrecalentamiento y con una vida útil superior a 5 millones de aperturas y cierres (MCBF). Cuenta con brazo telescópico de aleación de aluminio reforzado con longitud ajustable desde 3 hasta 6 metros y tira de iluminación LED indicadora integrada, permitiendo programar velocidades de apertura ultra rápidas desde 1.5 segundos (para carriles de 3m) hasta 6 segundos (para carriles anchos de 6m). Su mecanismo reversible permite intercambiar fácilmente la dirección de apertura del brazo (izquierda o derecha) directamente en obra sin necesidad de sustituir piezas. Dispone de indicador visual frontal tipo semáforo LED (cruz roja de alto y flecha verde de pase), soporte para detección de vehículos mediante lazo magnético o radar anti-impacto VR10, y compatibilidad nativa con lectores RFID de largo alcance UHF ZKTeco y paneles de control de acceso IP inBio y C3.",
    "price": "RD$ 52,500.00",
    "img": "img/productos/catalogo/zkteco-cmp200-barrera-vehicular-automatica.webp",
    "gallery": [
      "img/productos/catalogo/zkteco-cmp200-barrera-vehicular-automatica.webp"
    ],
    "specs": [
      "Motor Brushless DC (BLDC 24V) de alto torque y libre de mantenimiento: ciclo de trabajo continuo 100% y vida útil de 5 millones de ciclos",
      "Brazo telescópico de aluminio reforzado extensible de 3 a 6 metros con tira de luz LED de advertencia nocturna incorporada",
      "Velocidad de apertura y cierre rápida programable: de 1.5 a 6 segundos según la longitud configurada del brazo vehicular",
      "Dirección de brazo intercambiable en campo: convertible a mano izquierda o mano derecha según la disposición del carril",
      "Gabinete robusto de acero galvanizado con pintura en polvo horneada electrostática apta para lluvia tropical y sol exterior (IP54)",
      "Indicador luminoso frontal integrado tipo semáforo LED: luz verde indicadora de acceso permitido y luz roja de detención",
      "Función de protección anti-impacto y rebote automático: retroceso inmediato al entrar en contacto con un obstáculo o vehículo",
      "Compatibilidad universal con radar de detección vehicular ZKTeco VR10, sensores fotoeléctricos infrarrojos y lazos inductivos",
      "Apertura manual mediante llave de emergencia en caso de corte del suministro eléctrico",
      "Garantía oficial ZKTeco con repuestos originales, asesoría de instalación y soporte técnico en Santiago"
    ]
  },
  {
    "id": "equipos_logitech_rally_plus_videoconferencia_4k",
    "department": "oficina",
    "category": "Equipos y Periféricos de Oficina",
    "brand": "Logitech",
    "title": "Sistema Modular de Videoconferencia Premium Logitech Rally Plus con Cámara 4K Ultra HD y Tecnologías RightSense AI",
    "desc": "El sistema de videoconferencia modular de clase mundial Logitech Rally Plus es la solución premier para salas de conferencias corporativas, salones de capacitación y salas de juntas ejecutivas en zonas francas y centros de negocios de Santiago. Diseñado para salas grandes y extra grandes de 16 a 20 o más participantes, incluye una cámara motorizada Rally Ultra-HD 4K PTZ con óptica prémium, zoom HD de 15X (5x óptico + 3x digital) y campo visual diagonal de 90°. El sistema de audio profesional desacoplado cuenta con 2 altavoces frontales antivibración de distorsión ultra baja y 2 bases de micrófonos de mesa Mic Pod con tecnología de conformación de haces acústicos adaptativos RightSound (capta voces con claridad cristalina hasta a 4.5 metros y suprime ecos y ruido ambiental). Integra el paquete de tecnologías de inteligencia artificial Logitech RightSense: RightSight encuadra automáticamente a los asistentes ajustando el zoom dinámicamente; RightLight optimiza la exposición y balance de color en rostros sin importar contraluces de ventanas; y RightSound nivela la intensidad de voces suaves y fuertes para una acústica perfecta. Incluye concentradores Display Hub y Table Hub interconectados por un único cable CAT6A para una instalación limpia sin cables cruzando la sala de reuniones.",
    "price": "RD$ 145,000.00",
    "img": "img/productos/catalogo/logitech-rally-plus-videoconferencia-4k.webp",
    "gallery": [
      "img/productos/catalogo/logitech-rally-plus-videoconferencia-4k.webp"
    ],
    "specs": [
      "Cámara PTZ motorizada con sensor 4K Ultra HD, panorámica ±90°, inclinación +50°/-90° y zoom óptico-digital 15X",
      "Tecnología RightSight AI: detecta participantes y ajusta el encuadre y zoom automáticamente durante toda la sesión",
      "Tecnología RightLight AI: balance de color y luminancia facial natural incluso en salas con iluminación deficiente o contraluz",
      "Tecnología RightSound AI: cancelación avanzada de eco acústico, supresión de ruidos y nivelación automática de volumen de voz",
      "Sistema de sonido desacoplado: 2 altavoces de alta fidelidad con carcasa antivibratoria que no interfiere con la cámara",
      "Captación de voz 360°: 2 bases de micrófonos Mic Pod con 8 micrófonos beamforming (ampliable hasta 7 Mic Pods para 46 personas)",
      "Conexión simplificada mediante Table Hub y Display Hub interconectados por un solo cable de red CAT6A",
      "Compatibilidad nativa Plug and Play vía USB con Microsoft Teams Rooms, Zoom Rooms, Google Meet y Cisco Webex",
      "Mando a distancia por radiofrecuencia con 3 preajustes programables de cámara que funciona sin apuntar directamente",
      "Garantía oficial empresarial Logitech de 2 años con soporte técnico corporativo en República Dominicana"
    ]
  },
  {
    "id": "oficina_samsung_the_frame_pro_55_qled_4k",
    "department": "oficina",
    "category": "Equipos y Periféricos de Oficina",
    "brand": "Samsung",
    "title": "Pantalla Profesional QLED 4K Samsung The Frame Pro 55\" (Modo Arte, Antirreflejo Mate, Slim Fit y One Connect)",
    "desc": "La pantalla profesional comercial Samsung The Frame Pro de 55 pulgadas es el televisor y monitor de cartelería digital de diseño más exclusivo del mercado para despachos ejecutivos, salas de juntas premium, recepciones corporativas, consultorios médicos y estudios de arquitectura en Santiago y República Dominicana. Gracias a su pantalla con acabado Matte Display antirreflejo patentado, neutraliza por completo los reflejos de luces de oficina y ventanas soleadas, logrando una textura idéntica al lienzo de una pintura tradicional. Cuando no está en uso para presentaciones corporativas o videoconferencias, activa su galardonado Modo Arte con sensor de brillo y presencia humana integrado para exhibir más de 2,500 obras de arte internacionales o la identidad gráfica de su empresa con consumo energético ultra bajo. Su panel QLED 4K UHD ofrece 100% de volumen de color con tecnología Quantum Dot, frecuencia de actualización nativa de 120Hz con Motion Xcelerator Turbo+ y procesador Quantum 4K con escalado mediante IA. Incluye la caja de conexiones externa One Connect Box con un cable casi transparente que transporta tanto la alimentación eléctrica como la señal de video, marco magnético personalizable y el soporte de pared ultraplano Slim Fit Wall Mount que deja la pantalla completamente pegada a la pared sin separación.",
    "price": "RD$ 78,900.00",
    "img": "img/productos/catalogo/samsung-the-frame-pro-55-qled-4k.webp",
    "gallery": [
      "img/productos/catalogo/samsung-the-frame-pro-55-qled-4k.webp"
    ],
    "specs": [
      "Pantalla QLED 4K UHD de 55 pulgadas (3840 x 2160) con panel Mate Antirreflejo (Matte Display) certificado anti-brillo",
      "Modo Arte con sensor de iluminación y presencia: exhibe cuadros y cartelería corporativa ahorrando energía cuando la sala está vacía",
      "Tecnología Quantum Dot con 100% de volumen de color validado por Pantone para una precisión cromática absoluta",
      "Frecuencia de actualización nativa ultra fluida de 120Hz con soporte HDMI 2.1 y tecnología Motion Xcelerator Turbo Pro",
      "Caja de conexiones externa One Connect Box con cable único casi invisible de 5 metros para datos y electricidad",
      "Soporte de pared Slim Fit Wall Mount incluido: instalación al ras de la pared como un cuadro de galería de arte real",
      "Marcos magnéticos biselados intercambiables (teca, nogal, blanco o bronce) para armonizar con el diseño arquitectónico",
      "Sistema operativo Tizen con plataforma comercial Samsung VXT CMS, modo de seguridad multicapa Samsung Knox y Wi-Fi 5",
      "Potente sistema de audio 2.0.2 canales de 40W con Object Tracking Sound (OTS) y sincronización Q-Symphony",
      "Garantía oficial Samsung corporativa con respaldo y homologación técnica en Santiago"
    ]
  }
];
if (typeof module !== 'undefined') module.exports = mockDatabase;
if (typeof window !== 'undefined') {
  window.mockDatabase = mockDatabase;
  window.backupDatabase = mockDatabase;
}
