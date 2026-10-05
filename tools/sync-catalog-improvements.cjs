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
  },
  {
    id: 'lap_dell_lat_5480',
    department: 'equipos',
    category: 'Computadoras',
    brand: 'Dell',
    title: 'Laptop Dell Latitude 5480 Core i5, 8 GB RAM, 128 GB SSD, 14 pulgadas',
    desc: 'Laptop corporativa resistente para oficina, digitación continua y labores administrativas con chasis reforzado.',
    price: 'RD$ 15,900.00',
    img: 'img/productos/laptops/17-dell-latitude-5480.webp',
    gallery: [
      'img/productos/laptops/17-dell-latitude-5480.webp',
      'img/productos/laptops/17-dell-latitude-5480-02.webp',
      'img/productos/laptops/17-dell-latitude-5480-03.webp'
    ],
    specs: ['Procesador: Intel Core i5 de 7.ª/8.ª generación', 'Memoria RAM: 8 GB DDR4', 'Almacenamiento: SSD M.2 de 128 GB', 'Pantalla: 14 pulgadas antirreflejo', 'Garantía local Futunet']
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
  },
  {
    id: 'cctv_ezviz_c6n_camara_wifi_360',
    department: 'seguridad',
    category: 'Cámaras de Seguridad',
    brand: 'Ezviz',
    title: 'Cámara Wi-Fi Ezviz C6N 1080p Full HD Pan & Tilt 360° con Visión Nocturna Inteligente y Audio Bidireccional',
    desc: 'Cámara de seguridad inteligente inalámbrica Ezviz C6N con resolución Full HD 1080p y movimiento robotizado Pan & Tilt que ofrece una cobertura panorámica de 360 grados sin puntos ciegos. Cuenta con seguimiento inteligente de movimiento (Smart Tracking), visión nocturna por infrarrojos Smart IR de hasta 10 metros que ajusta automáticamente la intensidad para evitar sobreexposiciones, audio bidireccional en tiempo real con micrófono y altavoz para comunicación remota, modo de privacidad con obturador motorizado y ranura para tarjeta MicroSD de hasta 256 GB. Configuración sencilla en minutos mediante la aplicación Ezviz para teléfonos móviles y compatible con Alexa y Google Assistant.',
    price: 'RD$ 2,350.00',
    img: 'img/productos/catalogo/ezviz-c6n.webp',
    gallery: [
      'img/productos/catalogo/ezviz-c6n.webp'
    ],
    specs: [
      'Resolución Full HD 1080p (1920 x 1080) a 15/30 fps con compresión eficiente H.264',
      'Rotación Pan & Tilt motorizada: 340° horizontal y 55° vertical para cobertura 360° total',
      'Seguimiento inteligente (Smart Tracking): sigue automáticamente a personas u objetos en movimiento',
      'Visión nocturna Smart IR de hasta 10 metros (33 pies) con ajuste dinámico de iluminación',
      'Audio bidireccional claro con micrófono con cancelación de ruido y altavoz integrado',
      'Almacenamiento flexible: Ranura para tarjeta MicroSD hasta 256 GB y opción a nube Ezviz CloudPlay',
      'Conectividad Wi-Fi 2.4 GHz y puerto Ethernet RJ45 para conexión por cable de red',
      'Garantía oficial Ezviz de 1 año con soporte local y despacho en Santiago'
    ]
  },
  {
    id: 'cctv_ezviz_h3c_camara_wifi_exterior',
    department: 'seguridad',
    category: 'Cámaras de Seguridad',
    brand: 'Ezviz',
    title: 'Cámara Wi-Fi Ezviz H3c 1080p para Exterior con Protección IP67 y Detección de Personas con IA',
    desc: 'Cámara de videovigilancia Wi-Fi para intemperie Ezviz H3c con resolución Full HD 1080p, chasis de alta durabilidad con certificación de protección IP67 contra lluvia, polvo y calor extremo de Santiago. Equipada con algoritmo de inteligencia artificial integrado que distingue con precisión siluetas de personas frente a mascotas u hojas en movimiento reduciendo falsas alarmas, visión nocturna por infrarrojos nítida de hasta 30 metros, antena Wi-Fi dual de largo alcance que atraviesa paredes, micrófono con captación nítida de audio hasta 5 metros y ranura MicroSD hasta 512 GB.',
    price: 'RD$ 2,850.00',
    img: 'img/productos/catalogo/ezviz-h3c.webp',
    gallery: [
      'img/productos/catalogo/ezviz-h3c.webp'
    ],
    specs: [
      'Resolución Full HD 1080p (1920 x 1080) con tecnología de imagen de alta fidelidad',
      'Certificación IP67 a prueba de intemperie: resistente a fuertes lluvias, sol y tormentas',
      'Detección inteligente de personas basada en IA para alertas precisas al teléfono',
      'Visión nocturna por infrarrojos de largo alcance de hasta 30 metros (98 pies)',
      'Micrófono con cancelación de ruido ambiental con alcance de captación de hasta 5 metros',
      'Antena Wi-Fi dual de alta ganancia con transmisión estable a través de muros',
      'Ranura para tarjeta MicroSD de hasta 512 GB y compresión H.265 para maximizar espacio',
      'Garantía oficial Ezviz de 1 año con factura con comprobante fiscal NCF'
    ]
  }
];

const audioItems = [
  {
    id: 'prod_ad1d2a977b',
    department: 'equipos',
    category: 'Periféricos y Partes',
    brand: 'Apple',
    title: 'Air Pod 2da Generacion Original APPLE',
    desc: 'Auriculares inalámbricos Apple AirPods (2.ª generación) originales con estuche de carga Lightning. Conexión Bluetooth instantánea con chip Apple H1, audio de alta fidelidad, controles táctiles y micrófonos duales beamforming para llamadas nítidas.',
    price: 'RD$ 5,400.00',
    img: 'img/productos/catalogo/airpods-2gen.jpg',
    gallery: ['img/productos/catalogo/airpods-2gen.jpg'],
    specs: [
      'Chip Apple H1 para enlace inalámbrico ultraestable y baja latencia',
      'Estuche de carga Lightning con más de 24 horas de autonomía total',
      'Acceso por voz «Oye Siri» y controles táctiles de doble toque',
      'Micrófonos duales beamforming con cancelación de ruido ambiental',
      'Compatibilidad universal con iOS, Android, Windows y macOS'
    ]
  }
];

const networkingItems = [
  {
    id: 'cisco_cbs110_16t',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Cisco',
    title: 'Switch Cisco Business CBS110 16 Puertos Gigabit Ethernet (10/100/1000 Mbps)',
    desc: 'Switch Gigabit Ethernet Cisco Business CBS110 no administrable de 16 puertos para oficinas y empresas. Conectividad plug-and-play de alta velocidad y bajo consumo con chasis metálico para rack o sobremesa.',
    price: 'RD$ 11,850.00',
    img: 'img/brands-preview/cisco.webp',
    gallery: ['img/brands-preview/cisco.webp'],
    specs: [
      '16 puertos Gigabit Ethernet RJ-45 (10/100/1000 Mbps)',
      'Capacidad de conmutación de 32 Gbps sin bloqueo',
      'Configuración Plug-and-Play instantánea sin mantenimiento',
      'QoS 802.1p integrado para optimización de videollamadas y voz IP',
      'Diseño metálico resistente con montaje en rack o escritorio',
      'Garantía oficial y soporte corporativo Futunet en Santiago'
    ]
  },
  {
    id: 'cisco_cbs250_24p',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Cisco',
    title: 'Switch Administrable Cisco Business CBS250 24 Puertos Gigabit PoE+ con 4 Enlaces SFP',
    desc: 'Switch inteligente gestionable Cisco Business CBS250 con 24 puertos Gigabit PoE+ (presupuesto 195W) y 4 puertos uplink SFP dedicados para fibra óptica. Diseñado para alimentar cámaras IP, puntos de acceso y telefonía VoIP corporativa.',
    price: 'RD$ 34,500.00',
    img: 'img/brands-preview/cisco.webp',
    gallery: ['img/brands-preview/cisco.webp'],
    specs: [
      '24 puertos Gigabit 10/100/1000 Mbps PoE+ (802.3at/af, 195W)',
      '4 puertos SFP Gigabit para enlaces ascendentes de fibra óptica',
      'Interfaz web amigable con asistente de configuración intuitivo',
      'Seguridad avanzada: 802.1X, VLANs, ACLs y defensa contra ataques DoS',
      'Gestión centralizada mediante Cisco Business Dashboard',
      'Garantía oficial y servicio de configuración por ingenieros de Futunet'
    ]
  },
  {
    id: 'ubiquiti_unifi_u6_plus',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Ubiquiti',
    title: 'Punto de Acceso Ubiquiti UniFi 6 Plus (U6+) Access Point WiFi 6 Doble Banda 3.0 Gbps PoE',
    desc: 'Punto de acceso compacto WiFi 6 de doble banda Ubiquiti UniFi 6 Plus (U6+). Rendimiento de hasta 3.0 Gbps en 5 GHz y 2.4 GHz, ideal para oficinas, naves comerciales y residencias que demandan roaming fluido y alta densidad de usuarios.',
    price: 'RD$ 9,950.00',
    img: 'img/brands-preview/ubiquiti.webp',
    gallery: ['img/brands-preview/ubiquiti.webp'],
    specs: [
      'Tecnología WiFi 6 (802.11ax) de ultra-alta velocidad hasta 2975 Mbps',
      'Antena MIMO 2x2 de alta ganancia con cobertura extendida',
      'Alimentación Power over Ethernet (PoE 802.3af)',
      'Capacidad para más de 300 dispositivos concurrentes sin latencia',
      'Gestión integral en la nube con UniFi Network Controller o app UniFi',
      'Montaje estético y discreto para techo o pared con kit incluido'
    ]
  },
  {
    id: 'ubiquiti_unifi_lite_8_poe',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Ubiquiti',
    title: 'Switch Ubiquiti UniFi Lite 8 Puertos Gigabit con 4 Puertos PoE+ (52W)',
    desc: 'Switch gestionado de capa 2 Ubiquiti UniFi Switch Lite 8 PoE con 8 puertos Gigabit (4 puertos 802.3at PoE+ con presupuesto total de 52W). Perfecto para alimentar puntos de acceso UniFi y cámaras en oficinas pequeñas y medianas.',
    price: 'RD$ 8,750.00',
    img: 'img/brands-preview/ubiquiti.webp',
    gallery: ['img/brands-preview/ubiquiti.webp'],
    specs: [
      '8 puertos Gigabit RJ-45 (4 puertos PoE+ 802.3at/af)',
      'Presupuesto PoE total de 52W (hasta 30W por puerto)',
      'Diseño compacto de sobremesa sin ventilador (operación silenciosa)',
      'Totalmente gestionable desde la plataforma UniFi Network',
      'Montaje en pared o escritorio con accesorios de fijación',
      'Garantía oficial y entrega inmediata en Santiago'
    ]
  },
  {
    id: 'redes_patch_panel_24p_cat6',
    department: 'redes',
    category: 'Cableado Estructurado',
    brand: 'Futunet Redes',
    title: 'Patch Panel Cat 6 de 24 Puertos 1U para Rack de 19" con Barra de Gestión Trasera',
    desc: 'Patch panel de 24 puertos RJ45 Categoría 6 estándar de 19 pulgadas (1U) para montaje en racks y gabinetes de telecomunicaciones. Fabricado en acero laminado en frío de alta resistencia con acabado electrostático negro, contactos chapados en oro de 50 micras y bloques de terminación tipo 110/Krone codificados por color según normas T568A y T568B. Incluye barra posterior desmontable para soporte y amarre ordenado de cables UTP, numeración serigrafiada clara y conectores a tierra para instalaciones corporativas e industriales en Santiago.',
    price: 'RD$ 2,950.00',
    img: 'img/productos/catalogo/patch-panel-24p.webp',
    gallery: [
      'img/productos/catalogo/patch-panel-24p.webp'
    ],
    specs: [
      'Capacidad: 24 puertos RJ45 Cat 6 sin blindar (1000BASE-T)',
      'Formato de montaje: 1U estándar 19 pulgadas para rack o gabinete de pared',
      'Terminación: Bloques IDC duales tipo 110 y Krone (cable 22 a 26 AWG)',
      'Diagrama de cableado: Normas universales T568A y T568B serigrafiadas',
      'Barra organizadora: Soporte metálico trasero desmontable para alivio de tensión',
      'Chasis: Acero laminado de alta durabilidad con recubrimiento en polvo anticorrosivo'
    ]
  },
  {
    id: 'redes_patch_cord_cat6_2m',
    department: 'redes',
    category: 'Cableado Estructurado',
    brand: 'Futunet Redes',
    title: 'Patch Cord UTP Cat 6 de 2 Metros 100% Cobre con Conectores RJ45 Moldeados',
    desc: 'Cable de parcheo (Patch Cord) de red UTP Categoría 6 de 2 metros (6.6 pies) fabricado con conductores multifilares 100% cobre puro de 24 AWG para máxima flexibilidad y durabilidad en gabinetes y estaciones de trabajo. Conectores RJ45 macho con terminales dorados y bota moldeada con protector de pestaña (snagless) que evita atascos y roturas durante el conexionado en switches y paneles de parcheo en racks de telecomunicaciones.',
    price: 'RD$ 250.00',
    img: 'img/productos/catalogo/patch-cord-cat6.webp',
    gallery: [
      'img/productos/catalogo/patch-cord-cat6.webp'
    ],
    specs: [
      'Longitud: 2 metros (6.6 pies)',
      'Categoría: UTP Cat 6 para enlaces Gigabit Ethernet hasta 250 MHz',
      'Conductor: 100% Cobre multifilar 24 AWG de alta flexibilidad',
      'Conectores: RJ45 8P8C con pines dorados de 50 micras',
      'Diseño: Bota moldeada snagless anti-enganche y alivio de tensión',
      'Color: Azul corporativo para rápida identificación en armarios de red'
    ]
  },
  {
    id: 'redes_conectores_rj45_cat6_pack',
    department: 'redes',
    category: 'Cableado Estructurado',
    brand: 'Futunet Redes',
    title: 'Pack de 100 Conectores RJ45 Cat 6 con Botas Protectoras para Cable UTP',
    desc: 'Paquete de 100 conectores modulares RJ45 macho Categoría 6 de alta precisión con 100 botas o capuchones protectores de goma flexible. Diseñados con pines de tres puntas bañados en oro de 50 micras compatibles con conductores sólidos de 23 AWG y multifilares de 24 AWG. Proporcionan inserción fluida, excelente conductividad eléctrica, cero atenuación y protección integral de la lengüeta de fijación para tendidos de red y conexiones de videovigilancia CCTV.',
    price: 'RD$ 1,450.00',
    img: 'img/productos/catalogo/conectores-rj45-cat6.webp',
    gallery: [
      'img/productos/catalogo/conectores-rj45-cat6.webp'
    ],
    specs: [
      'Cantidad: 100 conectores RJ45 Cat 6 + 100 botas protectoras',
      'Compatibilidad: Cables UTP Cat 6 (conductores 23 y 24 AWG)',
      'Contactos: Cobre fosforado con baño de oro de 50 micras y 3 puntas',
      'Carcasa: Policarbonato transparente de alto impacto y retardante a la llama',
      'Botas: Goma de alivio de tensión flexible que previene fatiga del cable',
      'Uso: Redes Gigabit Ethernet, cámaras IP PoE y telefonía IP'
    ]
  },
  {
    id: 'redes_crimpadora_rj45_tester_kit',
    department: 'redes',
    category: 'Cableado Estructurado',
    brand: 'Futunet Redes',
    title: 'Kit de Herramientas de Red: Crimpadora RJ45/RJ11 Multifunción con Pelacables y Tester de Cable de Red',
    desc: 'Kit profesional de herramientas de red indispensable para instaladores, técnicos de cableado estructurado y CCTV. Incluye tenaza crimpadora multifunción de alta resistencia para conectores modulares RJ45 (8P8C) y RJ11/RJ12 (6P6C/6P4C/6P2C) con cuchilla de corte y pelador integrado de cable UTP/STP, más probador (tester) de cable de red maestro y remoto desmontable con indicador LED secuencial del 1 al 8 y masa (G) para verificación inmediata de continuidad, cortocircuitos, pares cruzados y circuito abierto.',
    price: 'RD$ 1,850.00',
    img: 'img/productos/catalogo/crimpadora-tester-kit.webp',
    gallery: [
      'img/productos/catalogo/crimpadora-tester-kit.webp'
    ],
    specs: [
      'Crimpadora 3 en 1 para conectores RJ45 (8P8C), RJ11 (6P4C) y RJ12 (6P6C)',
      'Cuchillas de acero templado para corte limpio y pelado rápido de cables UTP/STP Cat 5e / Cat 6',
      'Tester de red maestro y remoto desmontable para pruebas de cables en pared o racks distantes',
      'Diagnóstico instantáneo: continuidad de hilos, cables cruzados, circuitos abiertos y cortocircuitos',
      'Indicadores LED luminosos numerados del 1 al 8 y tierra (G) para escaneo automático',
      'Incluye herramienta pelacables mini de impacto y estuche compacto',
      'Garantía oficial Futunet de 1 año con soporte técnico y facturación formal NCF'
    ]
  }
];

const mikrotikItems = [
  {
    id: 'redes_mikrotik_hex_rb750gr3',
    department: 'redes',
    category: 'Enrutadores y Balanceadores',
    brand: 'MikroTik',
    title: 'Router MikroTik hEX RB750Gr3 Gigabit Ethernet 5 Puertos con RouterOS L4 (Balanceador Multi-WAN)',
    desc: 'Router Gigabit Ethernet compacto de alta potencia MikroTik hEX (RB750Gr3) equipado con procesador Dual-Core de 880 MHz (4 hilos), 256 MB de memoria RAM, 5 puertos Gigabit Ethernet 10/100/1000 Mbps, ranura para memoria MicroSD y puerto USB de tamaño completo. Incluye licencia oficial RouterOS Nivel 4 con capacidades avanzadas para balanceo de carga multi-WAN (PCC), failover automático para múltiples líneas de fibra óptica (Claro / Altice), servidor y cliente VPN (WireGuard, OpenVPN, IPsec con aceleración por hardware), firewall de filtrado de paquetes y limitación de ancho de banda por IP o departamento. Ideal para pequeñas y medianas empresas, proveedores WISP y administradores de red en Santiago.',
    price: 'RD$ 4,850.00',
    img: 'img/productos/catalogo/mikrotik-hex-rb750gr3.webp',
    gallery: [
      'img/productos/catalogo/mikrotik-hex-rb750gr3.webp'
    ],
    specs: [
      '5 puertos Gigabit Ethernet 10/100/1000 Mbps con soporte Auto-MDI/X',
      'Procesador MediaTek Dual-Core MT7621A a 880 MHz (4 hilos) con aceleración de cifrado IPsec por hardware (~470 Mbps)',
      'Memoria RAM de 256 MB y almacenamiento flash de 16 MB con ranura MicroSD para logs y caché',
      'Sistema operativo RouterOS v7 con licencia Nivel 4 completa y soporte de actualizaciones continuas',
      'Capacidad Multi-WAN: Balanceo de carga PCC (Per Connection Classifier), bonding y failover automático',
      'Puerto USB 2.0 tipo A para conexión de módem 4G/LTE de respaldo o almacenamiento externo',
      'Alimentación versátil: Jack DC (8-30V) o entrada PoE Pasivo en puerto 1 (adaptador 24V incluido)',
      'Garantía oficial MikroTik de 1 año con soporte técnico local y factura con NCF en Santiago'
    ]
  }
];

const logitechItems = [
  {
    id: 'oficina_logitech_mk270_combo_inalambrico',
    department: 'oficina',
    category: 'Periféricos y Accesorios',
    brand: 'Logitech',
    title: 'Combo Teclado y Mouse Inalámbrico Logitech MK270 con Receptor USB 2.4 GHz para Oficina',
    desc: 'Combo inalámbrico confiable y duradero Logitech MK270 que combina un teclado de tamaño normal y un mouse óptico compacto y ergonómico. Conexión inalámbrica avanzada de 2.4 GHz sin retrasos ni interferencias con alcance de hasta 10 metros mediante un único nano-receptor USB "conectar y olvidar". El teclado incorpora distribución en español con teclado numérico completo, 8 teclas de acceso rápido multimedia, diseño resistente a salpicaduras y patas inclinables ajustables. El mouse ambidiestro ofrece seguimiento óptico fluido y suave. Eficiencia energética de clase mundial con hasta 36 meses de duración de batería en el teclado y 12 meses en el mouse con interruptor de encendido/apagado.',
    price: 'RD$ 1,950.00',
    img: 'img/productos/catalogo/logitech-mk270.webp',
    gallery: [
      'img/productos/catalogo/logitech-mk270.webp'
    ],
    specs: [
      'Conexión inalámbrica fiable de 2.4 GHz de largo alcance (hasta 10 metros) sin retardos ni pérdidas de señal',
      'Receptor USB Nano único "Plug and Play" que vincula simultáneamente el teclado y el mouse',
      'Teclado de tamaño completo con teclado numérico integrado y 8 teclas de acceso rápido para control multimedia y volumen',
      'Diseño resistente a derrames accidentales de líquidos con canales de drenaje y patas inclinables ajustables',
      'Mouse inalámbrico contorneado de diseño ambidiestro con sensor óptico de 1000 DPI de alta precisión',
      'Extraordinaria autonomía: hasta 36 meses en el teclado (2 baterías AAA) y hasta 12 meses en el mouse (1 batería AA)',
      'Compatible con Windows 10/11, macOS, ChromeOS y Linux sin necesidad de controladores adicionales',
      'Garantía oficial Logitech de 1 año con comprobante fiscal formal NCF'
    ]
  },
  {
    id: 'oficina_logitech_c920_webcam_hd_pro',
    department: 'oficina',
    category: 'Equipos de Oficina',
    brand: 'Logitech',
    title: 'Cámara Web Logitech C920 HD Pro 1080p con Micrófono Estéreo Dual y Corrección de Luz para Videoconferencias',
    desc: 'Cámara web profesional Logitech C920 HD Pro con resolución Full HD 1080p a 30 fps para videollamadas nítidas y fluidas en plataformas corporativas como Zoom, Microsoft Teams, Google Meet y Skype. Cuenta con lente de cristal de cinco elementos Full HD con enfoque automático de alta precisión, campo visual diagonal de 78 grados ideal para encuadrar a una o dos personas, corrección automática de iluminación RightLight 2 que ajusta los niveles de brillo y contraste en salas poco iluminadas, y dos micrófonos omnidireccionales integrados a cada lado para capturar audio estéreo natural con reducción de ruido de fondo. Incluye clip universal con rosca para trípode estándar.',
    price: 'RD$ 5,400.00',
    img: 'img/productos/catalogo/logitech-c920.webp',
    gallery: [
      'img/productos/catalogo/logitech-c920.webp'
    ],
    specs: [
      'Resolución de video Full HD 1080p (1920 x 1080) a 30 fps y HD 720p a 60/30 fps',
      'Lente de cristal Full HD de 5 elementos con enfoque automático suave y preciso (Autofocus)',
      'Campo visual diagonal (dFOV) de 78° que ofrece un encuadre amplio y profesional para salas y oficinas',
      'Tecnología RightLight 2 para ajuste automático de luz en condiciones de iluminación deficiente o contraluz',
      'Dos micrófonos estéreo omnidireccionales con reducción de ruido ambiental para transmisión de voz transparente',
      'Clip de montaje universal adaptable a pantallas de laptops, monitores LCD y trípodes estándar (rosca 1/4 pulgada)',
      'Conexión directa USB-A Plug and Play con cable de 1.5 metros compatible con Windows, macOS y ChromeOS',
      'Garantía oficial Logitech de 1 año con respaldo técnico y comprobante fiscal NCF'
    ]
  }
];

const sillasItems = [
  {
    id: 'mob_silla_ergonomica_ejecutiva',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Futunet Mobiliario',
    title: 'Silla Ergonómica Ejecutiva de Malla Transpirable con Soporte Lumbar',
    desc: 'Silla ergonómica de gama ejecutiva con espaldar de malla antitranspirante, soporte lumbar anatómico regulable, apoyabrazos ergonómicos, cabecero y mecanismo basculante con control de tensión. Especialmente diseñada para jornadas de trabajo intensivo en oficinas y despachos de Santiago.',
    price: 'RD$ 6,850.00',
    img: 'img/productos/catalogo/sillon-ejecutivo.jpg',
    gallery: [
      'img/productos/catalogo/sillon-ejecutivo.jpg'
    ],
    specs: [
      'Diseño ergonómico certificado para jornadas intensivas de 8+ horas',
      'Respaldo de malla transpirable de alta resistencia con soporte lumbar regulable',
      'Reposabrazos ergonómicos y mecanismo basculante con bloqueo de inclinación',
      'Pistón neumático de gas clase 3 con ajuste de altura suave',
      'Base estrella cromada reforzada de 5 radios con ruedas silenciosas de poliuretano',
      'Garantía corporativa de 1 año y factura fiscal formal en Santiago'
    ]
  },
  {
    id: 'prod_rlch8e9bx',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Futunet Mobiliario',
    title: 'Silla de Oficina Ergonómica de Malla Negra',
    desc: 'Silla ejecutiva de malla ergonómica en color negro, con diseño transpirable, soporte lumbar y ajuste de altura por pistón de gas. Ideal para oficinas, recepciones y puestos operativos. Respaldo y garantía oficial Futunet.',
    price: 'RD$ 5,197.50',
    img: 'img/productos/catalogo/sillon-ejecutivo.jpg',
    gallery: [
      'img/productos/catalogo/sillon-ejecutivo.jpg'
    ],
    specs: [
      'Malla transpirable en espaldar con estructura de alta durabilidad',
      'Asiento acolchado de espuma de alta densidad con tapizado antitranspirante',
      'Mecanismo de elevación a gas regulable',
      'Base giratoria de 5 ruedas para movilidad fluida',
      'Garantía corporativa de 1 año y entrega en Santiago'
    ]
  },
  {
    id: 'prod_3s7mmtjdr',
    department: 'oficina',
    category: 'Mobiliario',
    brand: 'Genérico',
    title: 'Sillas de Visitas con Brazos para Oficina',
    desc: 'Silla fija para visitantes y salas de espera con estructura metálica tubular reforzada, asiento y espaldar acolchados con descansabrazos integrados.',
    price: 'RD$ 4,002.75',
    img: 'img/productos/catalogo/silla-visita.jpg',
    gallery: [
      'img/productos/catalogo/silla-visita.jpg'
    ],
    specs: [
      'Estructura metálica tubular de alta resistencia',
      'Asiento y respaldo acolchados en tela de uso rudo',
      'Brazos ergonómicos integrados',
      'Topes antideslizantes para protección del suelo',
      'Garantía directa Futunet'
    ]
  }
];

const powerItems = [
  {
    id: 'prod_bh5vuj6df',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Hikvision',
    title: 'UPS HIKVISION 600 VA',
    desc: 'UPS Hikvision de 600 VA para proteger equipos de red, cajas, cámaras, routers y estaciones ligeras frente a apagones y picos de tensión. Es una solución compacta para oficinas pequeñas, puestos individuales o respaldo puntual de seguridad electrónica.',
    price: 'RD$ 2,220.00',
    img: 'img/productos/hikvision-ups600.jpg',
    gallery: [
      'img/productos/hikvision-ups600.jpg'
    ],
    specs: [
      'Capacidad nominal: 600 VA / 360 W',
      'Batería interna sellada de 12 V / 7 Ah',
      'Tiempo de transferencia ≤ 10 ms',
      'Protección contra sobrecarga, descarga profunda y picos de voltaje'
    ]
  },
  {
    id: 'prod_u9fo22vhb',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Hikvision',
    title: 'UPS Hikvision DS-UPS1000, 1000 VA / 600 W',
    desc: 'UPS Hikvision de 1000 VA orientado a respaldo eléctrico para DVR, NVR, routers, estaciones de trabajo y periféricos de oficina. Su capacidad de 600 W lo hace adecuado para cargas moderadas que requieren continuidad ante cortes o fluctuaciones.',
    price: 'RD$ 3,350.00',
    img: 'img/productos/hikvision-ups1000.jpg',
    gallery: [
      'img/productos/hikvision-ups1000.jpg'
    ],
    specs: [
      'Capacidad: 1000 VA / 600 W',
      'Batería interna de 12 V / 9 Ah',
      'Tiempo de transferencia ≤ 10 ms',
      'Protección contra sobrecarga, descarga y sobrevoltaje'
    ]
  },
  {
    id: 'ups_forza_nt1002',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Forza',
    title: 'UPS Interactivo Forza NT-1002 1000VA / 500W con Regulación AVR',
    desc: 'Sistema UPS Interactivo Forza NT-1002 de 1000VA / 500W diseñado para brindar respaldo confiable de energía y regulación automática de voltaje (AVR) para computadoras de escritorio, servidores de red, equipos de telecomunicaciones y puntos de venta. Protege contra apagones, caídas de tensión y sobrevoltajes en oficinas y comercios de Santiago.',
    price: 'RD$ 3,850.00',
    img: 'img/productos/hikvision-ups1000.jpg',
    gallery: [
      'img/productos/hikvision-ups1000.jpg'
    ],
    specs: [
      'Capacidad: 1000 VA / 500 W con sistema interactivo y regulación AVR',
      '6 salidas tipo NEMA 5-15R (4 con respaldo y regulación + 2 contra sobretensión)',
      'Protección integral contra apagones, sobrevoltaje, subtensión y picos de red',
      'Protección de red telefónica / datos RJ-11 y RJ-45',
      'Arranque en frío (Cold-Start) con batería y alarma sonora inteligente',
      'Garantía oficial de 2 años y comprobante fiscal formal en República Dominicana'
    ]
  }
];

const posItems = [
  {
    id: 'pos_lector_codigo_barra_2d',
    department: 'equipos',
    category: 'Periféricos y Partes',
    brand: 'Genérico',
    title: 'Lector de Códigos de Barra 1D/2D USB con Soporte Manos Libres para POS',
    desc: 'Lector omnidireccional de códigos de barras 1D y 2D (códigos QR, DataMatrix, PDF417, UPC, EAN) con conexión USB Plug & Play y base con soporte manos libres articulado con auto-inducción. Diseñado para optimizar el cobro rápido en puntos de venta, farmacias, supermercados y almacenes en Santiago.',
    price: 'RD$ 2,450.00',
    img: 'img/productos/catalogo/pos-lector-barcode.webp',
    gallery: [
      'img/productos/catalogo/pos-lector-barcode.webp'
    ],
    specs: [
      'Lectura de códigos 1D (UPC, EAN, Code 128) y 2D (QR Code, Data Matrix, PDF417)',
      'Conexión USB Plug & Play compatible con Windows, Linux, macOS y Android POS',
      'Base soporte manos libres ajustable con sensor de detección automática de objetos',
      'Capacidad de lectura nítida en pantallas de teléfonos móviles y etiquetas dañadas',
      'Garantía local Futunet de 1 año y factura formal con NCF'
    ]
  },
  {
    id: 'pos_gaveta_dinero_metalica',
    department: 'equipos',
    category: 'Periféricos y Partes',
    brand: 'Genérico',
    title: 'Gaveta de Dinero Metálica con Apertura Automática RJ11 para POS',
    desc: 'Cajón monedero metálico de alta durabilidad para terminales y sistemas de punto de venta. Construcción en acero laminado con 5 divisiones para billetes equipadas con pisadores metálicos y 8 bandejas para monedas. Incluye conector estándar RJ11 para apertura automática con impresoras térmicas de tickets y cerradura de seguridad de 3 posiciones.',
    price: 'RD$ 3,650.00',
    img: 'img/productos/catalogo/pos-gaveta-dinero.webp',
    gallery: [
      'img/productos/catalogo/pos-gaveta-dinero.webp'
    ],
    specs: [
      'Chasis metálico reforzado en acero laminado en frío para tráfico pesado comercial',
      '5 ranuras para billetes con pisadores de alambre metálico y 8 compartimentos para monedas',
      'Apertura automática con solenoide de impulsos estándar RJ11/RJ12 (12V / 24V)',
      'Cerradura de 3 posiciones con 2 llaves: apertura manual, apertura automática electrónica y bloqueo',
      'Ranura frontal exterior para inserción rápida de cheques o billetes grandes sin abrir',
      'Garantía directa Futunet de 1 año y despacho inmediato en República Dominicana'
    ]
  }
];

const dahuaItems = [
  {
    id: 'cctv_dahua_camara_domo_1080p',
    department: 'seguridad',
    category: 'Cámaras de Seguridad',
    brand: 'Dahua',
    title: 'Cámara Domo Dahua HDCVI 1080p 2MP con Visión Nocturna Smart IR',
    desc: 'Cámara de videovigilancia Dahua formato Domo con resolución Full HD 1080p (2 Megapíxeles) y lente gran angular de 2.8mm (campo de visión de 103°). Cuenta con iluminación infrarroja Smart IR de hasta 20 metros para visión nocturna clara en total oscuridad sin sobreexponer rostros. Ideal para interiores de oficinas, tiendas, pasillos, consultorios y hogares.',
    price: 'RD$ 1,450.00',
    img: 'img/productos/catalogo/dahua-camara-domo.webp',
    gallery: [
      'img/productos/catalogo/dahua-camara-domo.webp'
    ],
    specs: [
      'Resolución Full HD 1080p (1920x1080) a 30 cuadros por segundo',
      'Lente fijo de 2.8 mm con ángulo de visión gran angular de 103 grados',
      'Visión nocturna Smart IR inteligente de hasta 20 metros',
      'Salida de video 4 en 1 conmutable (HDCVI / TVI / AHD / CVBS)',
      'Chasis compacto para montaje en techo o pared con ajuste multidireccional',
      'Garantía oficial Dahua de 2 años y soporte de instalación profesional'
    ]
  },
  {
    id: 'cctv_dahua_camara_bala_1080p',
    department: 'seguridad',
    category: 'Cámaras de Seguridad',
    brand: 'Dahua',
    title: 'Cámara Bala Dahua HDCVI 1080p 2MP Exterior IP67 Smart IR',
    desc: 'Cámara de seguridad Dahua formato Bala metálica para intemperie con certificación IP67 contra lluvia torrencial, polvo y calor. Resolución Full HD 1080p de 2 Megapíxeles, lente de 3.6mm y visión nocturna Smart IR de 20 metros. Especialmente diseñada para fachadas, entradas, estacionamientos, almacenes y áreas perimetrales en Santiago y todo el Cibao.',
    price: 'RD$ 1,550.00',
    img: 'img/productos/catalogo/dahua-camara-bala.jpg',
    gallery: [
      'img/productos/catalogo/dahua-camara-bala.jpg'
    ],
    specs: [
      'Resolución Full HD 1080p (1920x1080) de alta fidelidad cromática',
      'Certificación IP67 resistente al agua, intemperie y ambientes industriales',
      'Visión nocturna por infrarrojos Smart IR con alcance de 20 metros',
      'Soporte articulado de 3 ejes para orientación precisa en paredes o techos',
      'Garantía oficial Dahua de 2 años y facturación con comprobante fiscal'
    ]
  },
  {
    id: 'cctv_dahua_xvr_cooper_4ch',
    department: 'seguridad',
    category: 'Sistemas de Seguridad CCTV',
    brand: 'Dahua',
    title: 'Grabador DVR Dahua XVR Cooper 4 Canales 1080N con App Móvil DMSS',
    desc: 'Grabador de video digital pentahíbrido Dahua XVR Cooper de 4 canales analógicos HD más 1 canal IP adicional (4+1). Incorpora codificación inteligente H.265+ que reduce el consumo de ancho de banda y multiplica por 3 el tiempo de grabación en disco duro. Permite monitoreo remoto en vivo y reproducción de grabaciones desde smartphones y computadoras a través de la aplicación oficial DMSS.',
    price: 'RD$ 3,850.00',
    img: 'img/productos/catalogo/dahua-xvr-cooper.jpg',
    gallery: [
      'img/productos/catalogo/dahua-xvr-cooper.jpg'
    ],
    specs: [
      '4 Canales BNC HDCVI / AHD / TVI / CVBS hasta 1080N + 1 Canal IP hasta 2MP',
      'Compresión de video de doble flujo H.265+ / H.265 / H.264',
      'Salidas simultáneas HDMI y VGA en alta definición Full HD',
      'Monitoreo remoto 24/7 mediante aplicación móvil Dahua DMSS (iOS / Android)',
      'Bahía para 1 disco duro SATA interno de hasta 6 TB',
      'Garantía oficial Dahua de 2 años y asesoría técnica de configuración'
    ]
  }
];

const securityAccessItems = [
  {
    id: 'prod_8ymxsbgt5',
    department: 'seguridad',
    category: 'Control de Acceso y Asistencia',
    brand: 'ZKTeco',
    title: 'Cerradura Electromagnética (Electroimán) 600 lbs (280 kg) con Sensor LED y Soporte ZL para Control de Acceso',
    desc: 'Cerradura electromagnética de alta retención de 600 lbs (280 kg) de fuerza para puertas de madera, vidrio, metal y cortafuegos. Incluye sensor de estado con indicador LED bicolor, protección contra corriente residual (MOV) y juego completo de soporte en L y Z (Soporte ZL) para instalación universal. Compatible al 100% con terminales biométricas ZKTeco MB20, teclados de acceso y botones liberadores de salida. Con garantía oficial y soporte técnico de Futunet en Santiago y la región Norte.',
    price: 'RD$ 6,850.00',
    img: 'img/productos/catalogo/cerradura-magnetica.jpg',
    gallery: [
      'img/productos/catalogo/cerradura-magnetica.jpg'
    ],
    specs: [
      'Fuerza de sujeción: 600 lbs (280 kg / 2800N) para alta seguridad',
      'Voltaje de operación: 12V DC / 24V DC seleccionable',
      'Sensor de estado de puerta: Relé con contactos NO/NC/COM y LED indicador',
      'Incluye kit de herrajes: Soporte ZL regulable y placa de armadura',
      'Aplicación: Puertas batientes de madera, metal, vidrio con marco y cortafuegos',
      'Garantía oficial ZKTeco de 1 año con comprobante fiscal formal NCF'
    ]
  },
  {
    id: 'sec_boton_salida_no_touch',
    department: 'seguridad',
    category: 'Control de Acceso y Asistencia',
    brand: 'ZKTeco',
    title: 'Botón Pulsador de Salida Infrarrojo No Touch de Acero Inoxidable para Control de Acceso',
    desc: 'Pulsador de salida con sensor óptico infrarrojo No Touch (sin contacto) diseñado para apertura higiénica y rápida de cerraduras electromagnéticas y cerraduras de perno. Fabricado en placa frontal de acero inoxidable 304 de alta durabilidad, detección de proximidad ajustable de 4 a 10 cm, indicador LED bicolor (Azul en reposo / Verde en apertura) y relevador con contactos NO/NC/COM apto para alto tráfico comercial, corporativo y hospitalario en Santiago.',
    price: 'RD$ 1,850.00',
    img: 'img/productos/catalogo/boton-salida-notouch.webp',
    gallery: [
      'img/productos/catalogo/boton-salida-notouch.webp'
    ],
    specs: [
      'Tecnología: Sensor óptico infrarrojo No Touch (sin contacto físico)',
      'Rango de detección: 4 a 10 cm ajustable',
      'Material: Placa frontal de acero inoxidable SUS 304 resistente a la corrosión',
      'Indicador luminoso: LED Azul (reposo) / Verde (activado)',
      'Salida de contacto: NO / NC / COM conmutado (3A a 36V DC)',
      'Vida útil: Más de 500,000 ciclos continuos de apertura'
    ]
  },
  {
    id: 'redes_cable_utp_cat6_cobre_305m',
    department: 'redes',
    category: 'Cableado Estructurado',
    brand: 'Futunet Redes',
    title: 'Bobina de Cable de Red UTP Cat 6 (305 Metros / 1000 ft) 100% Cobre Puro 23 AWG para Redes y Cámaras',
    desc: 'Bobina de cable de red de 4 pares trenzados UTP Categoría 6 sin blindar en caja dispensadora Easy Pull de 305 metros (1000 pies). Conductores sólidos de 100% cobre electrolítico de calibre 23 AWG con cruceta separadora central que reduce la diafonía (NEXT). Certificado para transmisiones Gigabit Ethernet (1000BASE-T) hasta 250 MHz y soporte total de alimentación remota PoE / PoE+ (IEEE 802.3af/at) para cámaras IP de seguridad, telefonía VoIP y puntos de acceso Wi-Fi 6. Chaqueta de PVC retardante a la llama con metraje marcado secuencialmente para tendidos en oficinas, locales comerciales e industrias de Santiago.',
    price: 'RD$ 8,950.00',
    img: 'img/productos/catalogo/bobina-utp-cat6.webp',
    gallery: [
      'img/productos/catalogo/bobina-utp-cat6.webp'
    ],
    specs: [
      'Categoría: UTP Cat 6 (250 MHz) estándar ANSI/TIA-568-C.2 e ISO/IEC 11801',
      'Conductor: 100% Cobre sólido recocido de 23 AWG (cero aleaciones CCA)',
      'Longitud: Caja dispensadora auto-desenrollable de 305 metros (1000 pies)',
      'Estructura interna: Cruceta plástica spline central anti-diafonía (NEXT)',
      'Alimentación PoE: Apto para PoE y PoE+ (IEEE 802.3af/at) sin sobrecalentamiento',
      'Marcaje de metraje: Impresión métrica secuencial decreciente en la chaqueta',
      'Garantía oficial y entrega inmediata en Santiago'
    ]
  },
  {
    id: 'redes_tplink_deco_x20_mesh',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'TP-Link',
    title: 'Sistema Wi-Fi 6 Mesh TP-Link Deco X20 AX1800 (Pack de 2 Unidades) Cobertura Integral',
    desc: 'Sistema Wi-Fi 6 en malla (Mesh) de doble banda TP-Link Deco X20 con velocidades de hasta 1800 Mbps (1201 Mbps en 5 GHz + 574 Mbps en 2.4 GHz). Proporciona cobertura fluida sin cortes de hasta 4,000 pies cuadrados (370 m²) en residencias de varios niveles, villas y oficinas corporativas en Santiago. Equipado con roaming continuo con un solo nombre de red (SSID), 2 puertos Gigabit Ethernet por unidad para backhaul cableado o computadoras, capacidad para más de 150 dispositivos conectados con OFDMA y MU-MIMO, y seguridad avanzada TP-Link HomeShield con control parental.',
    price: 'RD$ 9,850.00',
    img: 'img/productos/catalogo/tplink-deco-x20.webp',
    gallery: [
      'img/productos/catalogo/tplink-deco-x20.webp'
    ],
    specs: [
      'Estándar inalámbrico: Wi-Fi 6 IEEE 802.11ax/ac/n/a (5 GHz) y 802.11ax/n/b/g (2.4 GHz)',
      'Velocidad combinada: Hasta 1800 Mbps (AX1800)',
      'Puertos cableados: 2 puertos Gigabit LAN/WAN con detección automática por unidad Deco',
      'Cobertura estimada: Hasta 370 m² (4,000 ft²) con el paquete de 2 unidades',
      'Capacidad multi-dispositivo: Conexión simultánea fluida para más de 150 equipos',
      'Tecnología Mesh: Roaming fluido inteligente 802.11k/v/r y selección automática de ruta',
      'Garantía oficial TP-Link de 2 años y comprobante fiscal NCF'
    ]
  },
  {
    id: 'zkteco_mb20_terminal_biometrica',
    department: 'seguridad',
    category: 'Control de Acceso y Asistencia',
    brand: 'ZKTeco',
    title: 'Terminal Biométrica ZKTeco MB20 Facial, Huella Digital y RFID para Asistencia y Control de Acceso (Reloj Ponchador)',
    desc: 'Terminal biométrica multiespectral ZKTeco MB20 con reconocimiento facial por luz visible, lector de huella digital de alta precisión y lector de tarjetas RFID para control de asistencia de personal y control de acceso de puertas. Integra relevador para cerradura magnética, botón de salida y sensor de puerta. Conectividad TCP/IP de red y puerto USB para descarga de reportes de ponches en Excel sin necesidad de software complejo. Compatible con software ZKTime.Net y BioTime para gestión automatizada de horarios, turnos y nóminas en República Dominicana.',
    price: 'RD$ 8,450.00',
    img: 'img/productos/catalogo/zkteco-mb20-biometrico.webp',
    gallery: [
      'img/productos/catalogo/zkteco-mb20-biometrico.webp'
    ],
    specs: [
      'Capacidad: 200 rostros, 500 huellas digitales, 1,000 tarjetas RFID y 50,000 registros',
      'Reconocimiento facial rápido en menos de 0.5 segundos con cámara infrarroja antisuplantación',
      'Función Reloj Ponchador: exportación directa de reportes y ponches a memoria USB en Excel',
      'Conectividad: Puerto de red Ethernet TCP/IP y puerto USB Host para descarga inmediata',
      'Control de acceso integrado: Relevador directo para cerradura magnética, electroimán y botón de salida',
      'Pantalla TFT a color de 2.8 pulgadas con interfaz gráfica intuitiva en español',
      'Garantía oficial ZKTeco de 1 año con soporte técnico y asesoría de configuración en Santiago'
    ]
  },
  {
    id: 'cctv_wd_purple_2tb_hdd',
    department: 'seguridad',
    category: 'Almacenamiento CCTV',
    brand: 'Western Digital',
    title: 'Disco Duro Western Digital WD Purple 2TB 3.5" SATA III Especializado para Videovigilancia 24/7',
    desc: 'Disco duro interno Western Digital Purple de 2 Terabytes especialmente diseñado para sistemas de seguridad y videovigilancia de alta definición en funcionamiento ininterrumpido 24 horas al día, 7 días a la semana. Equipado con la tecnología exclusiva AllFrame que reduce la pérdida de cuadros de video y optimiza la reproducción en grabadores DVR y NVR de hasta 64 cámaras de seguridad en simultáneo. Resiste fluctuaciones térmicas extremas y vibraciones en entornos comerciales e industriales de Santiago.',
    price: 'RD$ 4,250.00',
    img: 'img/productos/catalogo/wd-purple-2tb.webp',
    gallery: [
      'img/productos/catalogo/wd-purple-2tb.webp'
    ],
    specs: [
      'Capacidad real de 2 TB (2,000 GB) optimizada para grabación continua de alta definición',
      'Tecnología AllFrame exclusiva de WD para cero pérdidas de fotogramas y compresión H.265+',
      'Factor de forma estándar 3.5 pulgadas con interfaz SATA III a 6.0 Gb/s y 64 MB de caché',
      'Diseñado para soportar hasta 64 cámaras de video HD en DVRs Dahua, Hikvision y NVRs IP',
      'Carga de trabajo de hasta 180 TB/año, triplicando la resistencia de un disco duro convencional de PC',
      'Garantía oficial Western Digital de 3 años y comprobante fiscal formal NCF'
    ]
  },
  {
    id: 'redes_gabinete_rack_9u',
    department: 'redes',
    category: 'Racks y Gabinetes de Red',
    brand: 'Futunet Redes',
    title: 'Gabinete Rack de Pared 9U 600x450mm con Puerta de Vidrio Templado y Cerradura con Llave',
    desc: 'Gabinete metálico de pared (Wall Mount) formato estándar 19 pulgadas de 9 Unidades de rack (9U) con profundidad de 450 mm. Construido en acero laminado en frío de alta resistencia con acabado en pintura electrostática negra anticorrosión. Cuenta con puerta frontal de vidrio templado con cerradura de seguridad y dos llaves, paneles laterales desmontables para fácil acceso al cableado, ranuras de ventilación superior e inferior para flujo de aire y orificios troquelados pasacables. Diseñado para alojar ordenadamente switches Cisco/Ubiquiti, patch panels, bandejas de fibra óptica y DVRs de videovigilancia en oficinas, cuartos de telecomunicaciones y comercios.',
    price: 'RD$ 6,850.00',
    img: 'img/productos/catalogo/gabinete-9u.jpg',
    gallery: [
      'img/productos/catalogo/gabinete-9u.jpg'
    ],
    specs: [
      'Capacidad de 9 Unidades de Rack (9U) estándar internacional EIA-310 de 19 pulgadas',
      'Dimensiones compactas: 600 mm de ancho x 450 mm de profundidad x 500 mm de altura',
      'Puerta frontal de cristal templado reversible con marco metálico y cerradura con llave',
      'Paneles laterales desmontables con pestillo rápido para inspección y mantenimiento de cables',
      'Fabricación en acero SPCC de alta resistencia con capacidad de carga estática de hasta 60 kg',
      'Ranuras para instalación de ventiladores extractores de 120mm y perforaciones pasacables',
      'Garantía oficial de 2 años e incluye tornillería tuercas enjauladas para montaje inmediato'
    ]
  },
  {
    id: 'prod_i1wfrc7vh',
    department: 'seguridad',
    category: 'Almacenamiento CCTV',
    brand: 'Western Digital',
    title: 'Disco Duro Western Digital WD Purple 2TB 3.5" SATA III Especializado para Videovigilancia 24/7',
    desc: 'Disco duro interno Western Digital Purple de 2 Terabytes especialmente diseñado para sistemas de seguridad y videovigilancia de alta definición en funcionamiento ininterrumpido 24 horas al día, 7 días a la semana. Equipado con la tecnología exclusiva AllFrame que reduce la pérdida de cuadros de video y optimiza la reproducción en grabadores DVR y NVR de hasta 64 cámaras de seguridad en simultáneo.',
    price: 'RD$ 4,250.00',
    img: 'img/productos/catalogo/wd-purple-2tb.webp',
    gallery: [
      'img/productos/catalogo/wd-purple-2tb.webp'
    ],
    specs: [
      'Capacidad real de 2 TB (2,000 GB) optimizada para grabación continua de alta definición',
      'Tecnología AllFrame exclusiva de WD para cero pérdidas de fotogramas',
      'Factor de forma estándar 3.5 pulgadas con interfaz SATA III a 6.0 Gb/s',
      'Garantía oficial Western Digital de 3 años y comprobante fiscal formal NCF'
    ]
  },
  {
    id: 'prod_fy2c5keb5',
    department: 'redes',
    category: 'Racks y Gabinetes de Red',
    brand: 'Futunet Redes',
    title: 'Gabinete Rack de Pared 9U 600x450mm con Puerta de Vidrio Templado y Cerradura con Llave',
    desc: 'Gabinete metálico de pared (Wall Mount) formato estándar 19 pulgadas de 9 Unidades de rack (9U) con profundidad de 450 mm. Construido en acero laminado en frío con puerta frontal de vidrio templado, cerradura de seguridad y ranuras de ventilación para switches y DVRs.',
    price: 'RD$ 6,850.00',
    img: 'img/productos/catalogo/gabinete-9u.jpg',
    gallery: [
      'img/productos/catalogo/gabinete-9u.jpg'
    ],
    specs: [
      'Capacidad de 9 Unidades de Rack (9U) estándar 19 pulgadas',
      'Puerta frontal de cristal templado reversible con cerradura y llaves',
      'Paneles laterales desmontables y ranuras para ventilación',
      'Garantía oficial Futunet de 2 años e incluye tornillería enjaulada'
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
    ...sillasItems,
    ...powerItems,
    ...posItems,
    ...dahuaItems,
    ...securityAccessItems,
    ...dellLaptops,
    ...gamingItems,
    ...dellOptiplexDesktops,
    ...monitorItems,
    ...cctvItems,
    ...audioItems,
    ...networkingItems,
    ...mikrotikItems,
    ...logitechItems
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

  const newContent = `const mockDatabase = ${JSON.stringify(mockDatabase, null, 2)};\nif (typeof module !== 'undefined') module.exports = mockDatabase;\nif (typeof window !== 'undefined') {\n  window.mockDatabase = mockDatabase;\n  window.backupDatabase = mockDatabase;\n}\n`;
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
    ...sillasItems,
    ...powerItems,
    ...posItems,
    ...dahuaItems,
    ...securityAccessItems,
    ...dellLaptops,
    ...gamingItems,
    ...dellOptiplexDesktops,
    ...monitorItems,
    ...cctvItems,
    ...audioItems,
    ...networkingItems,
    ...mikrotikItems,
    ...logitechItems
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
