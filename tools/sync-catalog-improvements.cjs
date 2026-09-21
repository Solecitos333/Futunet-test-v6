/**
 * sync-catalog-improvements.cjs
 * Sincroniza la información precisa de mobiliario de oficina, laptops Dell Latitude y
 * componentes Gaming tanto en js/backup_data.js como en la colección 'products' de Firestore.
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const projectRoot = path.resolve(__dirname, '..');
const serviceAccountPath = path.resolve(projectRoot, '..', 'futunet-backend', 'firebase-service-account.json');

const mobItems = [
  {
    id: 'mob_oficina_1',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Futunet Mobiliario',
    title: 'Escritorio ejecutivo blanco con panel frontal',
    desc: 'Superficie amplia, pasacables integrado y panel frontal para mayor privacidad. Ideal para oficinas ejecutivas y corporativas.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-1.jpeg',
    gallery: ['img/productos/mobiliario/mob-1.jpeg'],
    specs: ['Escritorio ejecutivo', 'Panel frontal', 'Pasacables integrado']
  },
  {
    id: 'mob_oficina_2',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Futunet Mobiliario',
    title: 'Escritorio gerencial en L con credenza lateral',
    desc: 'Cubierta acabado madera, estructura gris y módulo lateral de almacenamiento para ejecutivos.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-2.jpeg',
    gallery: ['img/productos/mobiliario/mob-2.jpeg'],
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
    specs: ['Cubierta de vidrio', 'Pasacables', 'Módulo lateral']
  },
  {
    id: 'mob_oficina_7',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Futunet Mobiliario',
    title: 'Librero de madera ejecutivo para oficina',
    desc: 'Librero y estantería de madera para archivo de expedientes, carpetas y libros ejecutivos.',
    price: 'Cotizar',
    img: 'img/productos/mobiliario/mob-7.jpeg',
    gallery: ['img/productos/mobiliario/mob-7.jpeg'],
    specs: ['Estructura de madera resistente', 'Estantes reforzados para archivo y libros', 'Acabado ejecutivo de alta durabilidad', 'Instalación corporativa disponible']
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
    specs: ['Cubierta de vidrio negro', 'Panel frontal metálico', 'Estructura negra']
  }
];

const dellLaptops = [
  {
    id: 'lap_dell_lat_5410',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 5410 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas',
    desc: 'Laptop empresarial reacondicionada de décima generación para oficina y teletrabajo.',
    price: 'RD$ 18,500.00',
    img: 'img/productos/laptops/01-dell-latitude-5410.webp',
    gallery: [
      'img/productos/laptops/01-dell-latitude-5410.webp',
      'img/productos/laptops/01-dell-latitude-5410-02.webp',
      'img/productos/laptops/01-dell-latitude-5410-03.webp'
    ],
    specs: ['Procesador: Intel Core i5 de 10.ª generación', 'Memoria RAM: 8 GB DDR4', 'Almacenamiento: SSD M.2 de 128 GB', 'Pantalla: 14 pulgadas HD/FHD', 'Garantía local Futunet']
  },
  {
    id: 'lap_dell_lat_7400',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 7400 Core i5, 8 GB RAM, SSD de 120/256 GB y HDD de 500 GB',
    desc: 'Equipo corporativo serie 7000 ultradelgado con chasis de magnesio y alto rendimiento.',
    price: 'RD$ 19,800.00',
    img: 'img/productos/laptops/02-dell-latitude-7400.webp',
    gallery: [
      'img/productos/laptops/02-dell-latitude-7400.webp',
      'img/productos/laptops/02-dell-latitude-7400-02.webp',
      'img/productos/laptops/02-dell-latitude-7400-03.webp'
    ],
    specs: ['Procesador: Intel Core i5 de 8.ª generación', 'Memoria RAM: 8 GB DDR4', 'Almacenamiento híbrido SSD + HDD', 'Pantalla: 14 pulgadas FHD', 'Garantía local Futunet']
  },
  {
    id: 'lap_dell_lat_5330',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 5330 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
    desc: 'Portátil empresarial premium de 12.ª generación con chasis compacto, gran autonomía y seguridad corporativa TPM 2.0.',
    price: 'RD$ 28,500.00',
    img: 'img/productos/laptops/03-dell-latitude-5330.webp',
    gallery: [
      'img/productos/laptops/03-dell-latitude-5330.webp',
      'img/productos/laptops/03-dell-latitude-5330-02.webp',
      'img/productos/laptops/03-dell-latitude-5330-03.webp'
    ],
    specs: ['Procesador: Intel Core i7 de 12.ª generación', 'Memoria RAM: 16 GB DDR4', 'Almacenamiento: SSD NVMe de 256 GB', 'Pantalla: 13.3 pulgadas Full HD antirreflejo', 'Garantía local Futunet']
  },
  {
    id: 'lap_dell_lat_5490',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 5490 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas, generación 8',
    desc: 'Laptop corporativa confiable de octava generación con teclado en español y alta durabilidad para empresas.',
    price: 'RD$ 16,900.00',
    img: 'img/productos/laptops/04-dell-latitude-5490-gen8.webp',
    gallery: [
      'img/productos/laptops/04-dell-latitude-5490-gen8.webp',
      'img/productos/laptops/04-dell-latitude-5490-gen8-02.webp',
      'img/productos/laptops/04-dell-latitude-5490-gen8-03.webp'
    ],
    specs: ['Procesador: Intel Core i5 de 8.ª generación quad-core', 'Memoria RAM: 8 GB DDR4', 'Almacenamiento: SSD de 128 GB', 'Pantalla: 14 pulgadas', 'Garantía local Futunet']
  },
  {
    id: 'lap_dell_lat_7390',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 7390 Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
    desc: 'Ultraligera empresarial de la prestigiosa serie Latitude 7000 para profesionales móviles y ejecutivos.',
    price: 'RD$ 23,500.00',
    img: 'img/productos/laptops/05-dell-latitude-7390.webp',
    gallery: [
      'img/productos/laptops/05-dell-latitude-7390.webp',
      'img/productos/laptops/05-dell-latitude-7390-02.webp',
      'img/productos/laptops/05-dell-latitude-7390-03.webp'
    ],
    specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB DDR4', 'Almacenamiento: SSD M.2 de 256 GB', 'Pantalla: 13.3 pulgadas Full HD', 'Garantía local Futunet']
  },
  {
    id: 'lap_dell_lat_7390_touch',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 7390 Touch Core i7, 16 GB RAM, 256 GB SSD, 13.3 pulgadas',
    desc: 'Versión táctil interactiva reacondicionada de la Latitude 7390, orientada a movilidad y presentaciones ejecutivas.',
    price: 'RD$ 25,900.00',
    img: 'img/productos/laptops/06-dell-latitude-7390-touch.webp',
    gallery: [
      'img/productos/laptops/06-dell-latitude-7390-touch.webp',
      'img/productos/laptops/06-dell-latitude-7390-touch-02.webp',
      'img/productos/laptops/06-dell-latitude-7390-touch-03.webp'
    ],
    specs: ['Procesador: Intel Core i7 de 8.ª generación', 'Memoria RAM: 16 GB DDR4', 'Almacenamiento: SSD de 256 GB', 'Pantalla táctil: 13.3 pulgadas Full HD Touchscreen', 'Garantía local Futunet']
  }
];

const gamingItems = [
  {
    id: 'gm_cooler_tryx_panorama_360',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'TRYX',
    title: 'Enfriamiento Líquido TRYX PANORAMA 360 ARGB Pantalla AMOLED Curva 6.5"',
    desc: 'Refrigeración líquida All-in-One revolucionaria con pantalla AMOLED curvada de 6.5 pulgadas en el bloque para visualizar animaciones GIF, imágenes y temperaturas del sistema en tiempo real.',
    price: 'RD$ 16,915.00',
    img: 'img/gaming/componentes/cooler-tryx-panorama-360-argb.jpg',
    gallery: ['img/gaming/componentes/cooler-tryx-panorama-360-argb.jpg'],
    specs: ['Pantalla curva AMOLED de 6.5 pulgadas personalizable', '3 ventiladores ARGB de 120mm silenciosos de alto flujo', 'Radiador de 360mm de máxima disipación térmica', 'Fácil montaje compatible con sockets Intel y AMD']
  },
  {
    id: 'gm_cooler_nzxt_kraken_elite_360',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'NZXT',
    title: 'Cooler Líquido NZXT Kraken Elite 360 RGB White Pantalla LCD 2.36"',
    desc: 'Disipador líquido AIO premium en elegante color blanco. Incluye pantalla LCD circular de 2.36 pulgadas personalizable vía NZXT CAM y 3 ventiladores RGB de alto rendimiento.',
    price: 'RD$ 18,530.00',
    img: 'img/gaming/componentes/cooler-nzxt-kraken-elite-360.jpg',
    gallery: ['img/gaming/componentes/cooler-nzxt-kraken-elite-360.jpg'],
    specs: ['Pantalla LCD circular de 2.36" de resolución 640x640', 'Radiador de 360mm con ventiladores RGB de 120mm incluidos', 'Bomba Asetek silenciosa de alto caudal', 'Soporte universal Intel y AMD con garantía local']
  },
  {
    id: 'gm_case_lian_li_o11_dynamic_evo',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'LIAN LI',
    title: 'Gabinete Gaming ATX Lian Li O11 Dynamic EVO Black Cristal Templado',
    desc: 'Chasis de doble cámara referencial para entusiastas. Doble panel de cristal templado, soporte de múltiples radiadores de 360mm y diseño modular invertible.',
    price: 'RD$ 12,490.00',
    img: 'img/gaming/componentes/case-lian-li-o11-dynamic-evo.jpg',
    gallery: ['img/gaming/componentes/case-lian-li-o11-dynamic-evo.jpg'],
    specs: ['Diseño modular de doble cámara en cristal templado', 'Soporte para placas E-ATX, ATX, Micro-ATX y Mini-ITX', 'Capacidad para hasta 3 radiadores simultáneos de 360mm', 'Gestión de cableado oculta y máxima compatibilidad con GPU vertical']
  },
  {
    id: 'gm_case_msi_mag_pano_100r',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'MSI',
    title: 'Gabinete Panorámico MSI MAG Pano 100R PZ White ARGB',
    desc: 'Gabinete panorámico blanco con vista panorámica de 270 grados en cristal templado curvado. Compatible con motherboards Project Zero de conectores traseros ocultos.',
    price: 'RD$ 11,200.00',
    img: 'img/gaming/componentes/case-msi-mag-pano-100r.jpg',
    gallery: ['img/gaming/componentes/case-msi-mag-pano-100r.jpg'],
    specs: ['Vista panorámica de 270 grados sin pilares divisorios', 'Compatibilidad con placas base Back-Connect (Project Zero / BTF)', 'Ventiladores ARGB inversos preinstalados para flujo óptimo', 'Estructura robusta con filtros antipolvo magnéticos']
  },
  {
    id: 'gm_psu_msi_mag_a1000gs',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'MSI',
    title: 'Fuente de Poder MSI MAG A1000GS 1000W 80 Plus Gold Full Modular PCIe 5.0 ATX 3.1',
    desc: 'Fuente de poder de alta potencia y certificación 80 Plus Gold, nativa con estándar PCIe 5.1 y cable 12V-2x6 para alimentar tarjetas gráficas RTX Serie 40 y Serie 50.',
    price: 'RD$ 13,850.00',
    img: 'img/gaming/componentes/psu-msi-mag-a1000gs-pcie5.jpg',
    gallery: ['img/gaming/componentes/psu-msi-mag-a1000gs-pcie5.jpg'],
    specs: ['Potencia real de 1000W con certificación 80 Plus Gold', 'Estándar ATX 3.1 y PCIe 5.1 nativo con conector 12V-2x6', 'Condensadores 100% japoneses de 105°C para máxima vida útil', 'Ventilador con rodamiento FDB de 135mm ultra silencioso']
  },
  {
    id: 'gm_ram_kingston_fury_64gb_ddr5',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'KINGSTON',
    title: 'Memoria RAM Kingston Fury Beast RGB DDR5 64GB (2x32GB) 6000MT/s CL30',
    desc: 'Kit de memoria RAM DDR5 de alta capacidad y latencia ultra baja CL30 para estaciones de trabajo, streaming y gaming extremo en plataformas AMD AM5 e Intel LGA1700/1851.',
    price: 'RD$ 15,600.00',
    img: 'img/gaming/componentes/ram-kingston-fury-beast-ddr5-64gb.jpg',
    gallery: ['img/gaming/componentes/ram-kingston-fury-beast-ddr5-64gb.jpg'],
    specs: ['Capacidad total de 64 GB (2 módulos de 32 GB)', 'Frecuencia de 6000 MT/s con latencia optimizada CL30', 'Soporte para perfiles Intel XMP 3.0 y AMD EXPO', 'Iluminación RGB personalizable con tecnología Infrared Sync']
  },
  {
    id: 'gm_ssd_samsung_9100_pro_2tb',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'SAMSUNG',
    title: 'SSD Samsung 9100 PRO 2TB M.2 NVMe PCIe Gen5 x4 Lectura 14,000 MB/s',
    desc: 'Unidad de estado sólido buque insignia PCIe Gen5 con velocidades de lectura de hasta 14,000 MB/s, ideal para renderizado 3D, edición 8K y cargas instantáneas.',
    price: 'RD$ 21,900.00',
    img: 'img/gaming/componentes/ssd-samsung-9100-pro-2tb.jpg',
    gallery: ['img/gaming/componentes/ssd-samsung-9100-pro-2tb.jpg'],
    specs: ['Capacidad de 2 TB en factor M.2 2280 NVMe PCIe 5.0 x4', 'Velocidad de lectura secuencial hasta 14,000 MB/s', 'Velocidad de escritura secuencial hasta 12,000 MB/s', 'Controlador de última generación con eficiencia térmica superior']
  },
  {
    id: 'gm_ssd_crucial_p310_2tb',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'CRUCIAL',
    title: 'SSD Crucial P310 2TB M.2 NVMe PCIe Gen4 x4 Lectura 7,100 MB/s',
    desc: 'Almacenamiento NVMe PCIe 4.0 de alta capacidad y velocidad, perfecto para expandir consolas PS5, laptops de alto rendimiento y PCs de escritorio.',
    price: 'RD$ 13,950.00',
    img: 'img/gaming/componentes/ssd-crucial-p310-2tb.jpg',
    gallery: ['img/gaming/componentes/ssd-crucial-p310-2tb.jpg'],
    specs: ['Capacidad de 2 TB M.2 2280 PCIe Gen4', 'Lectura secuencial hasta 7,100 MB/s', 'Escritura secuencial hasta 6,000 MB/s', 'Tecnología Micron 3D NAND para alta confiabilidad']
  },
  {
    id: 'gm_ssd_crucial_p310_1tb',
    department: 'equipos',
    category: 'Componentes Gaming',
    brand: 'CRUCIAL',
    title: 'SSD Crucial P310 1TB M.2 NVMe PCIe Gen4 x4 Lectura 7,100 MB/s',
    desc: 'Unidad SSD NVMe de 1TB de alta velocidad para dar un salto notable de fluidez y reducir los tiempos de carga en cualquier PC gaming o portátil compatible con PCIe Gen4.',
    price: 'RD$ 10,125.00',
    img: 'img/gaming/componentes/ssd-crucial-p310-1tb.jpg',
    gallery: ['img/gaming/componentes/ssd-crucial-p310-1tb.jpg'],
    specs: ['Capacidad de 1TB M.2 2280 PCIe Gen4', 'Lectura secuencial hasta 7,100 MB/s', 'Escritura secuencial hasta 6,000 MB/s', 'Durabilidad y confiabilidad comprobada Micron']
  }
];

const dellOptiplexDesktops = [
  {
    id: 'pc_dell_optiplex_7050_sff',
    department: 'equipos',
    category: 'Computadoras de Escritorio',
    brand: 'DELL',
    title: 'PC de Escritorio Dell OptiPlex 7050 SFF Intel Core i5-7500 3.4GHz, 16GB RAM, 256GB SSD NVMe',
    desc: 'Computadora corporativa de escritorio Dell OptiPlex 7050 Small Form Factor (SFF) de alto rendimiento. Diseñada para oficinas ejecutivas, estaciones contables, laboratorios y puestos de atención continua con chasis compacto ultra resistente y bajo consumo energético.',
    price: 'RD$ 16,500.00',
    img: 'img/productos/dell-optiplex-i7.jpg',
    gallery: ['img/productos/dell-optiplex-i7.jpg'],
    specs: [
      'Procesador Intel Core i5-7500 (3.40 GHz hasta 3.80 GHz Turbo, 4 núcleos)',
      '16 GB Memoria RAM DDR4 (ampliable a 64 GB en 4 ranuras DIMM)',
      '256 GB Almacenamiento SSD M.2 NVMe ultrarrápido',
      'Gráficos integrados Intel HD Graphics 630',
      'Conectividad: 2x DisplayPort 1.2, 1x HDMI, 6x USB 3.0, 4x USB 2.0, Gigabit Ethernet RJ-45',
      'Factor de forma SFF compacto ideal para espacios reducidos',
      'Sistema operativo Windows 10/11 Pro 64-bit preinstalado con licencia corporativa',
      'Garantía local de 1 año con respaldo y soporte técnico Futunet'
    ]
  },
  {
    id: 'pc_dell_optiplex_5050_sff',
    department: 'equipos',
    category: 'Computadoras de Escritorio',
    brand: 'DELL',
    title: 'PC de Escritorio Dell OptiPlex 5050 SFF Intel Core i5-7500 3.4GHz, 8GB RAM, 256GB SSD',
    desc: 'Equipo de escritorio Dell OptiPlex 5050 SFF generación 7. Excelente equilibrio entre potencia, fiabilidad corporativa y coste operativo para farmacias, supermercados, call centers y despachos profesionales.',
    price: 'RD$ 13,800.00',
    img: 'img/productos/dell-optiplex-i7.jpg',
    gallery: ['img/productos/dell-optiplex-i7.jpg'],
    specs: [
      'Procesador Intel Core i5-7500 3.4 GHz Quad-Core',
      '8 GB Memoria RAM DDR4',
      '256 GB SSD de estado sólido de alta velocidad',
      'Salidas de video duales DisplayPort y HDMI',
      'Chasis SFF silencioso con ventilación inteligente de flujo directo',
      '6 puertos USB 3.0 de alta velocidad y salida de audio frontal',
      'Garantía y despacho inmediato en Santiago y todo el país'
    ]
  },
  {
    id: 'pc_dell_optiplex_3050_sff',
    department: 'equipos',
    category: 'Computadoras de Escritorio',
    brand: 'DELL',
    title: 'PC de Escritorio Dell OptiPlex 3050 SFF Intel Core i5 8GB RAM, 500GB HDD + 128GB SSD',
    desc: 'Solución de computación confiable y económica para puestos de digitación, cajas y oficinas. Configuración híbrida con disco SSD para arranque instantáneo de Windows y disco duro secundario de 500GB para almacenamiento masivo de datos.',
    price: 'RD$ 11,900.00',
    img: 'img/productos/dell-optiplex-i7.jpg',
    gallery: ['img/productos/dell-optiplex-i7.jpg'],
    specs: [
      'Procesador Intel Core i5 (7ma Generación) 3.4 GHz',
      '8 GB Memoria RAM DDR4',
      'Almacenamiento híbrido: 128 GB SSD (Sistema rápido) + 500 GB HDD (Archivos)',
      'Conexiones: HDMI, DisplayPort, puertos USB 3.0 y audio frontal',
      'Formato compacto Small Form Factor (SFF)',
      'Bajo consumo eléctrico y chasis de fácil mantenimiento sin herramientas'
    ]
  }
];

const monitorItems = [
  {
    id: 'mon_lg_24mp400_b_fhd',
    department: 'equipos',
    category: 'Monitores y Pantallas',
    brand: 'LG',
    title: 'Monitor LG 24MP400-B 24 Pulgadas IPS Full HD (1920x1080) 75Hz HDMI AMD FreeSync',
    desc: 'Monitor LG de 24 pulgadas con panel IPS Full HD y diseño prácticamente sin bordes en 3 lados. Ofrece una reproducción precisa del color desde cualquier ángulo, tecnología Flicker Safe para evitar fatiga ocular y compatibilidad con AMD FreeSync.',
    price: 'RD$ 8,950.00',
    img: 'img/productos/hp-monitor-widescreen.jpg',
    gallery: ['img/productos/hp-monitor-widescreen.jpg'],
    specs: [
      'Pantalla 23.8 pulgadas IPS con resolución Full HD (1920 x 1080)',
      'Frecuencia de actualización de 75Hz con AMD FreeSync',
      'Ángulo de visión ultra ancho de 178º horizontal y vertical',
      'Protección ocular: Flicker Safe y Modo Lectura antirreflejo',
      'Entradas: 1x HDMI y 1x VGA (D-Sub)',
      'Montaje en pared VESA 75 x 75 mm compatible',
      'Control de ajustes en pantalla OnScreen Control de LG'
    ]
  },
  {
    id: 'mon_lg_27mp400_b_fhd',
    department: 'equipos',
    category: 'Monitores y Pantallas',
    brand: 'LG',
    title: 'Monitor LG 27MP400-B 27 Pulgadas IPS Full HD (1920x1080) 75Hz HDMI FreeSync',
    desc: 'Pantalla panorámica LG de 27 pulgadas IPS ideal para entornos ejecutivos, diseño gráfico, edición de documentos en paralelo y programación. Colores vivos y ángulo visual amplio para máxima productividad.',
    price: 'RD$ 11,800.00',
    img: 'img/productos/hp-monitor-widescreen.jpg',
    gallery: ['img/productos/hp-monitor-widescreen.jpg'],
    specs: [
      'Pantalla amplia de 27 pulgadas IPS Full HD (1920 x 1080)',
      'Tasa de refresco 75Hz con tecnología Dynamic Action Sync y Black Stabilizer',
      'Acabado mate antirreflejos 3H',
      'Conexión versátil: HDMI y D-Sub VGA',
      'Certificación de eficiencia energética y bajo consumo',
      'Soporte para inclinación ergonómica y anclaje VESA'
    ]
  },
  {
    id: 'mon_dell_se2422h_fhd',
    department: 'equipos',
    category: 'Monitores y Pantallas',
    brand: 'DELL',
    title: 'Monitor Dell SE2422H 24 Pulgadas Full HD 1080p 75Hz HDMI/VGA Antirreflejo',
    desc: 'Monitor empresarial Dell de 24 pulgadas diseñado para jornadas laborales prolongadas. Incluye tecnología ComfortView para reducir la emisión de luz azul perjudicial y una base compacta que libera espacio en el escritorio.',
    price: 'RD$ 9,400.00',
    img: 'img/productos/hp-monitor-widescreen.jpg',
    gallery: ['img/productos/hp-monitor-widescreen.jpg'],
    specs: [
      'Pantalla 23.8 pulgadas Full HD (1920 x 1080) con tecnología LED',
      'Frecuencia de 75Hz con compatibilidad AMD FreeSync',
      'Tratamiento antirreflejo con dureza 3H',
      'Puertos: 1x HDMI 1.4 y 1x VGA',
      'Tecnología Dell ComfortView con certificación TÜV Rheinland',
      'Organizador de cables integrado en la base'
    ]
  }
];

const cctvItems = [
  {
    id: 'sec_hikvision_cam_colorvu_1080p',
    department: 'seguridad',
    category: 'Cámaras de Seguridad',
    brand: 'HIKVISION',
    title: 'Cámara Hikvision ColorVu Turbo HD 1080p Domo/Bala Visión Nocturna 24/7 a Color',
    desc: 'Cámara de videovigilancia profesional Hikvision con revolucionaria tecnología ColorVu. Proporciona imágenes brillantes y en color vivo las 24 horas del día, incluso en completa oscuridad exterior o interior, superando a las cámaras infrarrojas tradicionales.',
    price: 'RD$ 2,450.00',
    img: 'img/productos/catalogo/camara-ip.jpg',
    gallery: ['img/productos/catalogo/camara-ip.jpg', 'img/camaras.jpg'],
    specs: [
      'Resolución 2 Megapíxeles Full HD 1080p (1920 x 1080)',
      'Tecnología ColorVu con apertura F1.0 para captar máxima luz ambiental',
      'Iluminador de luz blanca suave hasta 20 metros para visión nocturna a todo color',
      'Lente fija de 2.8 mm con gran ángulo de cobertura (106°)',
      'Protección IP67 resistente al agua, polvo y sol caribeño para exteriores',
      'Micrófono integrado con transmisión de audio sobre coaxial (Audio over Coax)',
      'Compatible con todos los DVRs Turbo HD y formatos TVI/AHD/CVI/CVBS'
    ]
  },
  {
    id: 'sec_hikvision_kit_dvr_4ch',
    department: 'seguridad',
    category: 'Sistemas de Seguridad CCTV',
    brand: 'HIKVISION',
    title: 'Kit de Videovigilancia Hikvision DVR 4 Canales 1080p + 4 Cámaras con App Móvil',
    desc: 'Sistema integral de seguridad y monitoreo Hikvision de 4 cámaras Full HD y grabador DVR digital con compresión H.265+. Permite visualizar en vivo y revisar grabaciones desde cualquier parte del mundo a través de la aplicación gratuita Hik-Connect en teléfonos iPhone y Android.',
    price: 'RD$ 12,900.00',
    img: 'img/productos/hikvision-dvr-8ch.webp',
    gallery: ['img/productos/hikvision-dvr-8ch.webp', 'img/camaras.jpg'],
    specs: [
      '1 Grabador Digital DVR Hikvision de 4 canales 1080p Lite con compresión ultra H.265+',
      '4 Cámaras de alta resolución 1080p para interior y exterior con visión nocturna infrarroja EXIR',
      'Visualización remota gratuita P2P con Hik-Connect en iOS y Android sin costo mensual',
      'Detección de movimiento inteligente con notificaciones instantáneas push al móvil',
      'Salidas de video simultáneas HDMI Full HD y VGA',
      'Incluye cables de video y poder de 18 metros por cámara, divisor y fuente de poder certificada',
      'Asesoría de instalación y configuración de red por técnicos especializados de Futunet'
    ]
  }
];

async function updateBackupData() {
  const backupPath = path.join(projectRoot, 'js', 'backup_data.js');
  const code = fs.readFileSync(backupPath, 'utf8');

  let mockDatabase;
  global.window = {};
  eval(code.replace('const mockDatabase =', 'mockDatabase ='));
  console.log(`[backup_data] Registros iniciales: ${mockDatabase.length}`);

  const itemsToSync = [
    ...mobItems,
    ...dellLaptops,
    ...gamingItems,
    ...dellOptiplexDesktops,
    ...monitorItems,
    ...cctvItems
  ];

  itemsToSync.forEach(item => {
    const idx = mockDatabase.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      mockDatabase[idx] = item;
    } else {
      mockDatabase.push(item);
    }
  });

  console.log(`[backup_data] Registros finales: ${mockDatabase.length}`);

  const newContent = `const mockDatabase = ${JSON.stringify(mockDatabase, null, 2)};\nif (typeof module !== 'undefined') module.exports = mockDatabase;\nif (typeof window !== 'undefined') window.backupDatabase = mockDatabase;\n`;
  fs.writeFileSync(backupPath, newContent, 'utf8');
  console.log('[backup_data] Archivo js/backup_data.js actualizado con éxito.');
}

async function updateFirestore() {
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn(`[Firestore] No se encontró credencial en ${serviceAccountPath}. Omitiendo sincronización remota.`);
    return;
  }

  admin.initializeApp({ credential: admin.cert(require(serviceAccountPath)) });
  const db = getFirestore();
  const allProducts = [
    ...mobItems,
    ...dellLaptops,
    ...gamingItems,
    ...dellOptiplexDesktops,
    ...monitorItems,
    ...cctvItems
  ];

  console.log(`[Firestore] Sincronizando ${allProducts.length} productos en la colección 'products'...`);
  const batch = db.batch();

  for (const prod of allProducts) {
    const docRef = db.collection('products').doc(prod.id);
    batch.set(docRef, {
      ...prod,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  }

  await batch.commit();
  console.log('[Firestore] Todos los productos fueron sincronizados exitosamente en Firestore.');
}

async function main() {
  await updateBackupData();
  await updateFirestore();
}

main().catch(err => {
  console.error('Error fatal durante sincronización:', err);
  process.exit(1);
});
