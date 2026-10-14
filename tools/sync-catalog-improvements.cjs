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

const lenovoItems = [
  {
    id: 'oficina_laptop_lenovo_thinkpad_l14',
    department: 'oficina',
    category: 'Laptops y Portátiles',
    brand: 'Lenovo',
    title: 'Laptop Lenovo ThinkPad L14 14" Full HD Core i5 16GB RAM 256GB SSD NVMe Corporativa',
    desc: 'Laptop empresarial de máxima durabilidad Lenovo ThinkPad L14 diseñada para resistir las exigencias del entorno de trabajo corporativo y móvil. Equipada con procesador Intel Core i5 de alta velocidad, 16 GB de memoria RAM DDR4 para multitarea fluida, unidad de almacenamiento de estado sólido de 256 GB SSD NVMe de respuesta inmediata y pantalla antirreflejo de 14 pulgadas Full HD IPS (1920x1080). Incorpora el legendario teclado ergonómico ThinkPad resistente a salpicaduras con botón de navegación TrackPoint, lector de huellas dactilares para inicio de sesión seguro, cámara web HD con obturador de privacidad ThinkShutter y certificación de grado militar MIL-STD-810H contra golpes, caídas y temperaturas extremas. Sistema operativo Windows 11 Pro en español con garantía oficial y comprobante fiscal NCF.',
    price: 'RD$ 26,850.00',
    img: 'img/productos/catalogo/lenovo-thinkpad-l14.webp',
    gallery: [
      'img/productos/catalogo/lenovo-thinkpad-l14.webp'
    ],
    specs: [
      'Procesador: Intel Core i5 Quad-Core con tecnología Intel Turbo Boost',
      'Memoria RAM: 16 GB DDR4 a 3200 MHz para multitarea intensiva y software contable',
      'Almacenamiento: Unidad de estado sólido de 256 GB SSD M.2 NVMe PCIe',
      'Pantalla: 14.0 pulgadas Full HD IPS (1920x1080) antirreflejo de amplio ángulo de visión',
      'Teclado ThinkPad ergonómico con TrackPoint central resistente a derrames accidentales',
      'Seguridad y privacidad: Lector de huellas dactilares y obturador ThinkShutter en webcam',
      'Conectividad completa: Puertos USB-C con Power Delivery, USB 3.2, HDMI, RJ45 Ethernet y Wi-Fi 6',
      'Garantía corporativa Futunet de 1 año y comprobante fiscal formal NCF'
    ]
  }
];

const netgearItems = [
  {
    id: 'redes_switch_netgear_gs308_8p',
    department: 'redes',
    category: 'Switches y Enrutadores',
    brand: 'Netgear',
    title: 'Switch Netgear GS308 Gigabit Ethernet 8 Puertos Metálico Plug & Play Fanless',
    desc: 'Switch de red no administrable Netgear GS308 Gigabit Ethernet de 8 puertos 10/100/1000 Mbps en chasis metálico compacto de escritorio o montaje en pared. Ofrece conectividad de red Gigabit de alta velocidad para conectar computadoras, impresoras de red, cámaras IP, consolas y dispositivos de almacenamiento NAS en oficinas y pymes de Santiago. Arquitectura de conmutación sin bloqueo con rendimiento de hasta 16 Gbps que transfiere y filtra paquetes a la máxima velocidad del cable. Funcionamiento 100% silencioso sin ventilador (diseño Fanless), auto-negociación en todos los puertos, soporte Auto-MDI/MDIX (sin necesidad de cables cruzados) y tecnología ecológica IEEE 802.3az que reduce el consumo de energía eléctrica.',
    price: 'RD$ 2,250.00',
    img: 'img/productos/catalogo/netgear-gs308.webp',
    gallery: [
      'img/productos/catalogo/netgear-gs308.webp'
    ],
    specs: [
      '8 puertos Gigabit Ethernet RJ-45 de detección automática 10/100/1000 Mbps',
      'Chasis robusto en acero metálico resistente con soporte para escritorio o anclaje mural',
      'Configuración Plug and Play inmediata: sin software, configuración ni instalación previa',
      'Diseño Fanless silencioso: cero ruido de funcionamiento, ideal para escritorios y salas de reuniones',
      'Arquitectura sin bloqueo: ancho de banda de reenvío de 16 Gbps',
      'Eficiencia energética IEEE 802.3az para bajo consumo eléctrico',
      'Garantía oficial Netgear de 2 años y comprobante fiscal formal NCF'
    ]
  }
];

const schneiderItems = [
  {
    id: 'energia_ups_apc_schneider_bv1000',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Schneider Electric',
    title: 'Sistema UPS APC Easy UPS BV1000I-MS 1000VA / 600W con Regulación AVR Schneider Electric',
    desc: 'Sistema de alimentación ininterrumpida (UPS) interactivo APC Easy UPS BV1000I-MS de 1000VA / 600W de Schneider Electric diseñado para brindar protección eléctrica de alta confiabilidad en hogares, oficinas y puestos de trabajo en Santiago. Proporciona respaldo de batería y regulación automática de voltaje (AVR con corrección de caídas de tensión Boost and Trim) protegiendo computadoras, servidores, sistemas POS, routers de fibra óptica y equipos electrónicos sensibles contra apagones, sobretensiones y fluctuaciones bruscas de energía de la red. Cuenta con 4 tomas de salida universales tipo Schuko/NEMA protegidas con respaldo de batería y supresión de picos, arranque en frío (Cold-Start) para encender cargas con batería sin suministro eléctrico y orificios para montaje mural.',
    price: 'RD$ 5,950.00',
    img: 'img/productos/catalogo/apc-schneider-bv1000.webp',
    gallery: [
      'img/productos/catalogo/apc-schneider-bv1000.webp'
    ],
    specs: [
      'Capacidad de potencia: 1000 VA / 600 Watts de respaldo continuo',
      'Regulación automática de voltaje (AVR): corrige caídas y subidas de tensión sin agotar la batería',
      '4 tomas de salida universales protegidas con batería y supresión de sobretensiones',
      'Protección contra picos eléctricos, rayos y ruido electromagnético de red',
      'Función Cold-Start: encendido del UPS y dispositivos conectados usando solo batería',
      'Diseño estilizado con orificios posteriores para montaje seguro en pared',
      'Garantía oficial de 2 años de Schneider Electric / APC con soporte local Futunet'
    ]
  }
];

const linksysItems = [
  {
    id: 'redes_linksys_hydra_pro_6',
    department: 'redes',
    category: 'Enrutadores y Balanceadores',
    brand: 'Linksys',
    title: 'Router Wi-Fi 6 Linksys Hydra Pro 6 AX5400 Doble Banda con Malla Intelligent Mesh',
    desc: 'Router Wi-Fi 6 de ultra alto rendimiento Linksys Hydra Pro 6 con velocidades combinadas de hasta 5.4 Gbps (AX5400) y canales ultra anchos de 160 MHz. Proporciona cobertura inalámbrica de hasta 2,700 pies cuadrados (250 m²) para más de 30 dispositivos concurrentes sin latencia en streaming 4K/8K, videoconferencias corporativas y transferencias de gran volumen. Equipado con procesador Qualcomm Dual-Core de 1 GHz, 4 puertos Gigabit Ethernet LAN más 1 puerto Gigabit WAN para conexiones de fibra óptica de alta velocidad, puerto USB 3.0 para almacenamiento en red compartida y tecnología Intelligent Mesh que permite expandir la red con cualquier nodo Linksys compatible. Configuración fácil y segura desde la aplicación Linksys App con control parental y cifrado WPA3.',
    price: 'RD$ 8,950.00',
    img: 'img/productos/catalogo/linksys-hydra-pro6.webp',
    gallery: [
      'img/productos/catalogo/linksys-hydra-pro6.webp'
    ],
    specs: [
      'Estándar Wi-Fi 6: 802.11ax con canales de 160 MHz para máxima velocidad de enlace',
      'Velocidad total AX5400: hasta 4804 Mbps en 5 GHz + 574 Mbps en 2.4 GHz',
      'Cobertura estimada: hasta 250 m² (2,700 sq ft) para más de 30 equipos simultáneos',
      'Puertos: 1 Gigabit WAN + 4 Gigabit LAN con negociación automática 10/100/1000 Mbps',
      'Puerto USB 3.0 para compartir discos duros e impresoras en red local',
      'Tecnología Intelligent Mesh escalable y administración remota desde app móvil',
      'Garantía oficial Linksys de 2 años con comprobante fiscal formal NCF'
    ]
  }
];

const victronItems = [
  {
    id: 'energia_victron_multiplus_24_3000_70',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Victron Energy',
    title: 'Inversor/Cargador Victron Energy MultiPlus 24/3000/70 Senoidal Puro 24V 3000VA con Función UPS',
    desc: 'Inversor y cargador de grado industrial Victron Energy MultiPlus 24/3000/70 con salida de onda senoidal pura de 3000 VA (2400 W continuo, pico de 6000 W) y cargador adaptativo de 4 etapas de 70A para bancos de baterías de 24V (LiFePO4, Gel, AGM y plomo-ácido). Integra conmutador de transferencia ultrarrápido de menos de 20 milisegundos con función UPS ininterrumpida para servidores, telecomunicaciones y sistemas críticos. Cuenta con tecnología exclusiva PowerAssist que previene la sobrecarga de generadores o inversores limitados añadiendo potencia instantánea de la batería, doble salida de CA para cargas críticas y no críticas, y puerto de comunicación VE.Bus para monitoreo local o remoto mediante Cerbo GX y portal VRM. Diseñado para instalaciones solares, comerciales y residenciales de alta exigencia en República Dominicana.',
    price: 'RD$ 68,500.00',
    img: 'img/productos/catalogo/victron-multiplus-24v.webp',
    gallery: [
      'img/productos/catalogo/victron-multiplus-24v.webp'
    ],
    specs: [
      'Potencia nominal continua: 3000 VA / 2400 Watts a 25°C (pico máximo de 6000 W)',
      'Voltaje de banco de baterías: 24V DC con cargador inteligente adaptativo de 70A',
      'Función UPS ultrarrápida: transferencia de red a batería en menos de 20 ms sin reinicios',
      'Tecnología PowerAssist: previene sobrecargas eléctricas suplementando potencia desde baterías',
      'Onda senoidal pura certificada apta para motores, aires acondicionados, servidores y audio',
      'Puerto de comunicación VE.Bus para integración con Cerbo GX, pantallas y portal VRM',
      'Garantía oficial Victron Energy de 5 años con respaldo técnico en Santiago'
    ]
  }
];

const paradoxItems = [
  {
    id: 'seguridad_paradox_spectra_sp4000_kit',
    department: 'seguridad',
    category: 'Sistemas de Seguridad CCTV',
    brand: 'Paradox',
    title: 'Kit de Alarma Contra Intrusión Paradox Spectra SP4000 con Teclado LCD K32+ y Sensor PIR Antimascota',
    desc: 'Sistema integral de seguridad electrónica y alarma contra intrusiones Paradox Spectra SP4000 de 4 a 32 zonas cableadas e inalámbricas. El kit incluye central de alarma Paradox SP4000 en gabinete metálico reforzado con cerradura, transformador de 16.5V AC, teclado de supervisión LCD Paradox K32+ en español con retroiluminación azul y visualización en tiempo real de zonas abiertas, detector de movimiento infrarrojo digital antimascota Paradox NV5 de alta inmunidad a falsas alarmas, batería sellada de respaldo de 12V 7Ah para autonomía ante cortes eléctricos y potente sirena de 30 Watts con doble tono disuasivo. Diseñado para protección perimetral e interior de comercios, almacenes, industrias y residencias en Santiago.',
    price: 'RD$ 11,850.00',
    img: 'img/productos/catalogo/paradox-spectra-sp4000.webp',
    gallery: [
      'img/productos/catalogo/paradox-spectra-sp4000.webp'
    ],
    specs: [
      'Central de alarma Paradox Spectra SP4000 de 4 zonas en placa (expandible hasta 32 zonas)',
      'Teclado LCD de 32 zonas Paradox K32+ con menú en español y teclas de pánico directo',
      'Sensor de movimiento digital Paradox NV5 con lente híbrido cilíndrico-esférico e inmunidad pet',
      'Batería de respaldo recargable de 12V / 7Ah para operación ininterrumpida ante apagones',
      'Sirena exterior/interior de 30W y 118 dB con gabinete de protección y tamper antisabotaje',
      'Comunicación hacia central de monitoreo o llamada telefónica de alerta inmediata',
      'Garantía oficial Paradox de 1 año con asesoría técnica de instalación en Santiago'
    ]
  }
];

const panasonicItems = [
  {
    id: 'oficina_panasonic_kx_hdv130_telefono_ip',
    department: 'oficina',
    category: 'Equipos de Oficina',
    brand: 'Panasonic',
    title: 'Teléfono IP Panasonic KX-HDV130B de 2 Líneas SIP con Audio HD y Pantalla LCD Retroiluminada PoE',
    desc: 'Teléfono de escritorio IP estándar Panasonic KX-HDV130B diseñado para entornos empresariales, recepciones, consultorios médicos y despachos en Santiago. Cuenta con soporte para 2 cuentas SIP, audio de banda ancha HD Sonic (G.722) para máxima claridad de voz, pantalla gráfica LCD de 2.3 pulgadas retroiluminada de 132x64 píxeles, 2 puertos Fast Ethernet 10/100 con alimentación PoE integrada (IEEE 802.3af), altavoz manos libres full dúplex, directorio local para 500 contactos e indicador LED de mensaje en espera / llamada entrante. Compatible con servidores de telefonía IP Asterisk, FreePBX, conmutadores Panasonic KX-NS500 y centrales PBX virtuales.',
    price: 'RD$ 4,950.00',
    img: 'img/productos/catalogo/panasonic-kx-hdv130.webp',
    gallery: [
      'img/productos/catalogo/panasonic-kx-hdv130.webp'
    ],
    specs: [
      'Soporte de telefonía IP: 2 líneas SIP y 2 puertos Fast Ethernet 10/100 Mbps',
      'Audio HD de alta definición: Códec de banda ancha G.722 y altavoz manos libres full dúplex',
      'Alimentación: PoE integrado (Power over Ethernet) o adaptador de corriente CA opcional',
      'Pantalla: LCD monocromática retroiluminada de 2.3 pulgadas con contraste regulable',
      'Funciones PBX: Transferencia de llamada, conferencia a 3 vías, retención, desvío y llamada en espera',
      'Directorio telefónico: Capacidad de hasta 500 registros y registro de últimas 30 llamadas',
      'Garantía oficial Panasonic de 1 año con soporte técnico y factura formal con NCF'
    ]
  }
];

const mitsubishiItems = [
  {
    id: 'energia_mitsubishi_msz_gl18_aire_inverter',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Mitsubishi',
    title: 'Aire Acondicionado Mini-Split Inverter Mitsubishi Electric MSZ-GL 18,000 BTU Ultra Silencioso 24.6 SEER',
    desc: 'Sistema de aire acondicionado Mini-Split de ultra alta eficiencia Mitsubishi Electric MSZ-GL18NA de 18,000 BTU (1.5 Toneladas) con tecnología Inverter PAM de compresor de velocidad variable y certificación hasta 24.6 SEER. Diseñado para climatización continua y exigente de cuartos de servidores (data centers), oficinas gerenciales y residencias en Santiago, asegurando un ahorro de hasta el 40% en consumo eléctrico comercial. Cuenta con funcionamiento ultra silencioso Whisper Quiet de solo 19 dB, filtro purificador Nano Platinum con enzimas antibacteriales y desodorizantes, control de flujo Smart Set y compatibilidad con monitoreo Wi-Fi Kumo Cloud. Utiliza refrigerante ecológico R410A.',
    price: 'RD$ 54,900.00',
    img: 'img/productos/catalogo/mitsubishi-msz-gl18.webp',
    gallery: [
      'img/productos/catalogo/mitsubishi-msz-gl18.webp'
    ],
    specs: [
      'Capacidad de enfriamiento: 18,000 BTU/h (1.5 Toneladas de refrigeración)',
      'Eficiencia energética superior: Calificación hasta 24.6 SEER y certificación Energy Star',
      'Tecnología Inverter PAM: Ajuste continuo de velocidad del compresor para mínimo consumo de energía',
      'Operación ultra silenciosa: Nivel sonoro Whisper Quiet desde 19 dB(A) para máxima concentración',
      'Filtro purificador avanzado: Filtro Nano Platinum lavable que absorbe polvos, bacterias y alérgenos',
      'Refrigerante ecológico R410A precargado de fábrica con protección anticorrosiva Blue Fin',
      'Garantía de 5 años en compresor y 1 año en piezas con instalación técnica certificada en Santiago'
    ]
  }
];

const juniperItems = [
  {
    id: 'redes_juniper_ex2300_24p_switch',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'Juniper',
    title: 'Switch Empresarial Juniper Networks EX2300-24P Gigabit Ethernet 24 Puertos PoE+ con 4 Uplinks 10GbE SFP+',
    desc: 'Switch administrable de acceso y distribución empresarial de grado carrier Juniper Networks EX2300-24P. Cuenta con 24 puertos Gigabit Ethernet 10/100/1000Base-T con soporte PoE+ (Power over Ethernet IEEE 802.3at) y presupuesto de potencia total de 370 Watts para alimentar teléfonos IP, cámaras CCTV 4K y puntos de acceso Wi-Fi 6 de alta densidad. Incorpora 4 puertos de enlace ascendente (uplink) fijos SFP+ de 10 GbE para interconexión a troncales de fibra óptica o data centers a 10 Gbps. Impulsado por el sistema operativo Junos OS, tecnología Virtual Chassis que permite gestionar hasta 4 switches como un solo dispositivo lógico, enrutamiento L2/L3 avanzado (RIP, OSPF) y conmutación de paquetes sin bloqueo con ancho de banda de 128 Gbps.',
    price: 'RD$ 48,500.00',
    img: 'img/productos/catalogo/juniper-ex2300-24p.webp',
    gallery: [
      'img/productos/catalogo/juniper-ex2300-24p.webp'
    ],
    specs: [
      '24 puertos Gigabit 10/100/1000Base-T PoE+ con presupuesto de potencia total de 370W',
      '4 puertos uplink SFP/SFP+ fijos de 10 Gbps para enlaces de fibra óptica de alta velocidad',
      'Capacidad de conmutación: 128 Gbps sin bloqueo y tasa de reenvío de 95 Mpps',
      'Sistema operativo Junos OS: Misma base de código y consistencia de enrutamiento que routers carrier-grade',
      'Tecnología Virtual Chassis: Gestión centralizada de hasta 4 switches interconectados en un solo plano lógico',
      'Enrutamiento estático y dinámico Layer 2 y Layer 3 con soporte IPv4/IPv6, ACLs y 802.1X',
      'Garantía de por vida limitada (Enhanced Limited Lifetime Warranty) y comprobante fiscal NCF en Santiago'
    ]
  }
];

const siemensItems = [
  {
    id: 'energia_siemens_breaker_industrial_sentron_3p',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Siemens',
    title: 'Interruptor Termomagnético Industrial Siemens Sentron 3 Polos 100A Protección Eléctrica de Tableros',
    desc: 'Interruptor automático en caja moldeada / riel DIN industrial Siemens Sentron de 3 polos (3P) y capacidad nominal de 100 Amperios para protección eléctrica de acometidas comerciales, salas de servidores, bancos de condensadores y tableros de distribución en Santiago. Diseñado para soportar capacidades de interrupción de cortocircuito de hasta 25 kA a 415V/480V con mecanismo de disparo térmico-magnético de alta precisión (calibración fija contra sobrecargas y disparo instantáneo magnético). Cumple con las exigencias de las normas internacionales IEC/EN 60947-2 y UL 489, garantizando máxima continuidad de servicio y seguridad operativa ante fallas eléctricas severas.',
    price: 'RD$ 12,900.00',
    img: 'img/productos/catalogo/siemens-breaker-sentron.webp',
    gallery: [
      'img/productos/catalogo/siemens-breaker-sentron.webp'
    ],
    specs: [
      'Configuración: Tripolar (3 Polos / 3P) para sistemas trifásicos industriales',
      'Corriente nominal: 100 Amperios (In) continua para tableros de potencia',
      'Capacidad de corte en cortocircuito: Hasta 25 kA a 415V/480V AC según IEC 60947-2',
      'Disparo térmico y magnético calibrado para respuesta ultrarrápida ante fallas',
      'Montaje estándar en riel DIN / placa de montaje en gabinete metálico de distribución',
      'Contactos de aleación de plata resistentes al arco eléctrico con larga vida útil',
      'Garantía oficial Siemens de 2 años con soporte técnico especializado y factura con NCF'
    ]
  }
];

const teslaItems = [
  {
    id: 'energia_tesla_powerwall_2_bateria_solar',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Tesla',
    title: 'Sistema de Batería de Respaldo Residencial y Comercial Tesla Powerwall 2 (13.5 kWh) con Backup Gateway',
    desc: 'Sistema avanzado de almacenamiento y respaldo energético residencial y comercial Tesla Powerwall 2 con capacidad útil de 13.5 kWh de iones de litio y Backup Gateway 2 para conmutación automática ante cortes del tendido eléctrico sin parpadeo. Entrega potencia continua de 5 kW (hasta 7 kW de potencia pico) e integra inversor bidireccional AC acoplado, compatible con cualquier instalación solar existente o recarga directa de la red comercial. Monitoreo inteligente en tiempo real de consumo, generación y reserva de energía a través de la aplicación móvil Tesla. Diseñado con refrigeración líquida térmica y chasis con certificación IP67 para instalación en interiores o exteriores protegidos.',
    price: 'Cotizar',
    img: 'img/productos/catalogo/tesla-powerwall-2.webp',
    gallery: [
      'img/productos/catalogo/tesla-powerwall-2.webp'
    ],
    specs: [
      'Capacidad de almacenamiento utilizable: 13.5 kWh con profundidad de descarga (DoD) del 100%',
      'Potencia de salida continua: 5.0 kW (pico de 7.0 kW durante 10 segundos)',
      'Inversor integrado AC acoplado con eficiencia de ciclo completo (Round-Trip) del 90%',
      'Tesla Backup Gateway 2: Detección instantánea de corte y transición a respaldo en milisegundos',
      'Monitoreo inteligente en tiempo real vía app Tesla con modos de autoconsumo y respaldo',
      'Construcción resistente al clima con refrigeración líquida interna y protección IP67',
      'Garantía de fábrica de 10 años con soporte técnico e instalación certificada en Santiago'
    ]
  }
];

const dellServerItems = [
  {
    id: 'computo_dell_poweredge_t150_servidor',
    department: 'equipos',
    category: 'Equipos de Oficina y Cómputo',
    brand: 'DELL',
    title: 'Servidor en Torre Dell PowerEdge T150 Intel Xeon E-2314 32GB RAM ECC 2x2TB RAID 1 iDRAC9',
    desc: 'Servidor en torre empresarial Dell PowerEdge T150 diseñado para centros de datos empresariales, consultorios clínicos, cooperativas, industrias en zonas francas y firmas corporativas en Santiago. Equipado con procesador Intel Xeon E-2314 Quad-Core de 2.80 GHz (hasta 4.50 GHz Turbo, 8 MB Cache), 32 GB de memoria RAM DDR4 a 3200 MT/s ECC UDIMM con corrección de errores para máxima estabilidad operativa continua 24/7 sin caídas de sistema. Incluye arreglo de almacenamiento redundante con 2 discos duros mecánicos empresariales de 2 TB SATA de 7.2K RPM configurados en RAID 1 (espejo con tolerancia a fallos de disco), controladora RAID PERC H355 de hardware, tarjeta de gestión remota fuera de banda iDRAC9 Basic para monitoreo de salud del servidor y reinicio remoto, y fuente de alimentación cableada de 300W con certificación 80 PLUS Bronze. Compatible con Windows Server 2022/2025, VMware ESXi, Proxmox VE, Ubuntu Server y plataformas ERP de facturación y bases de datos SQL.',
    price: 'RD$ 89,500.00',
    img: 'img/productos/catalogo/dell-poweredge-t150.webp',
    gallery: [
      'img/productos/catalogo/dell-poweredge-t150.webp'
    ],
    specs: [
      'Procesador de servidor: Intel Xeon E-2314 Quad-Core 4 hilos a 2.8 GHz (Turbo 4.5 GHz, 8 MB Caché)',
      'Memoria del sistema: 32 GB DDR4 3200 MT/s ECC UDIMM con protección contra corrupción de datos',
      'Almacenamiento redundante: 2 discos duros empresariales de 2 TB SATA 3.5" (4 TB brutos, 2 TB útiles en RAID 1)',
      'Controladora RAID: PERC H355 por hardware con soporte de RAID 0, 1 y 10 para máxima velocidad y seguridad',
      'Administración remota: iDRAC9 Basic con interfaz web HTML5 para encendido, apagado y telemetría remota',
      'Conectividad de red: 2 puertos Gigabit Ethernet 10/100/1000 Mbps integrados con soporte LACP y balanceo',
      'Garantía corporativa Dell ProSupport de 3 años en sitio e incluye comprobante fiscal formal con NCF'
    ]
  }
];

const ontFiberItems = [
  {
    id: 'redes_ont_gpon_wifi6_terminal_optica',
    department: 'redes',
    category: 'Redes y Conectividad',
    brand: 'TP-Link',
    title: 'Terminal Óptica ONT GPON Wi-Fi 6 AX1800 Doble Banda con 4 Puertos Gigabit SC/APC y Puerto FXS VoIP',
    desc: 'Terminal de red óptica (ONT/ONU) de nueva generación TP-Link GPON Wi-Fi 6 AX1800 diseñada para enlaces residenciales y corporativos de fibra óptica FTTH de alta velocidad de Futunet en Santiago. Incorpora estándar Wi-Fi 6 (802.11ax) de doble banda simultánea con velocidades de hasta 1201 Mbps en la banda de 5 GHz y 574 Mbps en 2.4 GHz, tecnología OFDMA y MU-MIMO 2x2 para conectar más de 64 dispositivos sin saturación. Cuenta con 1 puerto óptico GPON SC/APC clase B+ (recepción 1490nm / transmisión 1310nm) con velocidad downstream de hasta 2.488 Gbps, 4 puertos Gigabit Ethernet LAN 10/100/1000 Mbps para computadoras y consolas, 1 puerto telefónico RJ11 FXS para llamadas de telefonía IP VoIP y antenas omnidireccionales de alta ganancia de 5 dBi con Beamforming. Compatible con OLTs estándar ITU-T G.984.',
    price: 'RD$ 4,850.00',
    img: 'img/productos/catalogo/tplink-ont-gpon-wifi6.webp',
    gallery: [
      'img/productos/catalogo/tplink-ont-gpon-wifi6.webp'
    ],
    specs: [
      'Puerto óptico GPON: 1 puerto SC/APC estándar ITU-T G.984.1/.2/.3/.4 con alcance de hasta 20 km',
      'Conectividad Wi-Fi 6 ultrarrápida: Doble banda AX1800 (1201 Mbps en 5 GHz + 574 Mbps en 2.4 GHz)',
      'Puertos cableados: 4 puertos Gigabit Ethernet LAN 10/100/1000 Mbps para conexión directa sin latencia',
      'Telefonía sobre IP: 1 puerto telefónico RJ11 FXS con soporte de protocolos SIP y códecs G.711/G.729',
      'Tecnología de señal avanzada: 4 antenas de 5 dBi con Beamforming, EasyMesh y cifrado de seguridad WPA3',
      'Gestión y aprovisionamiento: OMCI remoto, TR-069 y consola web intuitiva en español',
      'Garantía oficial de 2 años con reemplazo local inmediato y soporte técnico de fibra óptica en Santiago'
    ]
  }
];

const solarCamItems = [
  {
    id: 'seguridad_camara_solar_4g_autonoma',
    department: 'seguridad',
    category: 'Seguridad y Vigilancia',
    brand: 'Hikvision',
    title: 'Cámara de Seguridad Solar 4G LTE Autónoma con Batería de Litio y Sensor PIR Exterior IP66',
    desc: 'Cámara de videovigilancia 100% inalámbrica y autónoma Hikvision con panel solar fotovoltaico integrado de alta eficiencia y batería recargable de litio de gran capacidad. Diseñada especialmente para fincas agrícolas, obras de construcción, casas de campo, naves industriales y terrenos en Santiago y la región del Cibao donde no existe suministro eléctrico ni conexión a internet cableada. Integra módem celular 4G LTE compatible con tarjetas SIM de Claro, Altice y Viva para transmisión en vivo a través de la app móvil Hik-Connect. Equipada con sensor de imagen Full HD 1080p, sensor infrarrojo pasivo PIR para detección precisa de personas sin falsas alarmas, visión nocturna inteligente a color con reflectores LED blancos y alcance infrarrojo de 30 metros, audio bidireccional con micrófono y altavoz para disuasión, ranura para tarjeta MicroSD de hasta 256 GB y chasis con certificación IP66 resistente a lluvias torrenciales y calor caribeño.',
    price: 'RD$ 8,650.00',
    img: 'img/productos/catalogo/hikvision-camara-solar-4g.webp',
    gallery: [
      'img/productos/catalogo/hikvision-camara-solar-4g.webp'
    ],
    specs: [
      'Alimentación 100% solar: Panel solar de 5W integrado y batería de litio de alta densidad de ciclo profundo',
      'Conectividad móvil 4G LTE: Ranura Micro SIM para datos móviles de Claro/Altice sin requerir internet fijo',
      'Resolución de video: Sensor CMOS 1080p (1920x1080) a 30 fps con compresión eficiente H.265+',
      'Detección inteligente PIR: Detección térmica humana de hasta 12 metros que reduce falsas alarmas por viento u hojas',
      'Iluminación dual: Infrarrojo nocturno de 30 metros y luz blanca para captura a todo color en la oscuridad',
      'Audio bidireccional: Micrófono y altavoz de alta potencia para comunicación remota y sirena disuasoria',
      'Protección ambiental: Carcasa reforzada IP66 para intemperie extrema y 1 año de garantía oficial Futunet con NCF'
    ]
  }
];

const samsungDisplayItems = [
  {
    id: 'oficina_samsung_pantalla_55_crystal_uhd',
    department: 'equipos',
    category: 'Equipos de Oficina y Cómputo',
    brand: 'Samsung',
    title: 'Pantalla Comercial Samsung Crystal UHD 55" 4K Serie Business BE55T para Salas de Juntas y Cartelería Digital',
    desc: 'Pantalla profesional de 55 pulgadas Samsung Business Display (BE55T) con resolución 4K Ultra HD (3840 x 2160 píxeles), procesador Crystal 4K y tecnología HDR10+ diseñada para entornos corporativos, salas de conferencias, clínicas, recepciones y comercios en Santiago. Certificada para operación comercial continua de 16 horas diarias, 7 días a la semana (16/7), con panel antirreflejo y brillo uniforme de 250 nits para visualización perfecta en salones iluminados. Integra 3 puertos HDMI para computadoras y proyectores auxiliares, puerto USB, conexión Wi-Fi y Bluetooth, altavoces estéreo de 20W integrados, temporizador programable de encendido/apagado, y montaje estándar VESA 200x200 para soporte de pared o pedestal móvil.',
    price: 'RD$ 34,950.00',
    img: 'img/productos/catalogo/samsung-pantalla-55-crystal-uhd.webp',
    gallery: [
      'img/productos/catalogo/samsung-pantalla-55-crystal-uhd.webp'
    ],
    specs: [
      'Tamaño y resolución: Pantalla comercial de 55 pulgadas 4K UHD (3840 x 2160) con procesador Crystal 4K',
      'Régimen de funcionamiento: Grado profesional 16/7 continuo (16 horas/día, 7 días a la semana)',
      'Tecnología de imagen: HDR10+, contraste Mega Contrast y panel antirreflejo para salas iluminadas',
      'Conectividad múltiple: 3x HDMI, 1x USB, puerto RJ-45 LAN, Wi-Fi 5 y Bluetooth bidireccional',
      'Audio y multimedia: Altavoces estéreo integrados de 20W (10W+10W) y sintonizador digital ATSC/QAM',
      'Montaje y estructura: Compatibilidad con soporte de pared estándar VESA 200 x 200 mm',
      'Garantía comercial Samsung de 3 años con soporte técnico oficial y comprobante fiscal NCF'
    ]
  }
];

const ubiquitiGatewayItems = [
  {
    id: 'redes_ubiquiti_unifi_cloud_gateway_ultra',
    department: 'redes',
    category: 'Redes y Telecomunicaciones',
    brand: 'Ubiquiti',
    title: 'Gateway de Red Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra) Multi-WAN Gigabit con Pantalla LCM',
    desc: 'Consola de red y gateway todo en uno Ubiquiti UniFi Cloud Gateway Ultra (UCG-Ultra) compacta y de ultra alto rendimiento. Equipada con capacidad de enrutamiento de 1 Gbps con firewall de inspección profunda de paquetes (IDS/IPS) activo, puerto WAN 2.5 GbE con soporte Multi-WAN para balanceo de carga y tolerancia a fallos (Failover), 4 puertos Gigabit Ethernet LAN (10/100/1000 Mbps) reconfigurables, pantalla LCM frontal de 0.96 pulgadas para telemetría en tiempo real y servidor UniFi Network Application integrado para gestionar switches, puntos de acceso AP UniFi 6 y clientes sin requerir Cloud Key externo ni cuotas de suscripción.',
    price: 'RD$ 9,850.00',
    img: 'img/productos/catalogo/ubiquiti-cloud-gateway-ultra.webp',
    gallery: [
      'img/productos/catalogo/ubiquiti-cloud-gateway-ultra.webp'
    ],
    specs: [
      'Rendimiento de enrutamiento: 1 Gbps de ruteo completo con detección y prevención de intrusiones (IDS/IPS)',
      'Conectividad Multi-WAN: 1x puerto WAN 2.5 GbE (RJ-45) y 1x WAN secundario reconfigurable con failover',
      'Puertos de red LAN: 4 puertos Gigabit Ethernet RJ-45 (10/100/1000 Mbps) con detección automática',
      'Gestión UniFi completa: Aloja la aplicación UniFi Network completa para gestionar más de 30 dispositivos y 300 clientes',
      'Pantalla frontal: Pantalla de estado LCM monocromática de 0.96" para monitoreo de tráfico, IP y alertas',
      'Alimentación eficiente: Conector USB-C (5V DC / 3A) de bajo consumo con adaptador original incluido',
      'Garantía oficial Ubiquiti de 1 año con soporte técnico y entrega inmediata en Santiago'
    ]
  }
];

const univiewNvrItems = [
  {
    id: 'seguridad_uniview_nvr_8ch_poe_4k',
    department: 'seguridad',
    category: 'Seguridad y Vigilancia',
    brand: 'Uniview',
    title: 'Grabador NVR Uniview 4K Ultra HD de 8 Canales con Switch PoE de 8 Puertos Integrados (NVR301-08S3-P8)',
    desc: 'Grabador de video en red (NVR) profesional Uniview NVR301-08S3-P8 de 8 canales IP con switch PoE de 8 puertos independientes integrados con tecnología Plug & Play. Admite cámaras de seguridad IP de resolución hasta 8 Megapíxeles (4K Ultra HD) con un ancho de banda entrante de 64 Mbps. Incorpora compresión de video avanzada Ultra 265 / H.265 / H.264 que reduce hasta un 75% el uso de almacenamiento y ancho de banda en red. Cuenta con salida de video independiente HDMI 4K (3840x2160) y VGA simultánea, soporte para 1 disco duro SATA de hasta 6 TB, audio bidireccional, y visualización remota en tiempo real en iOS y Android a través de la aplicación oficial EZView.',
    price: 'RD$ 13,950.00',
    img: 'img/productos/catalogo/uniview-nvr-8ch-poe-4k.webp',
    gallery: [
      'img/productos/catalogo/uniview-nvr-8ch-poe-4k.webp'
    ],
    specs: [
      'Capacidad de canales: 8 Canales IP con soporte para cámaras de hasta 8 MP (4K Ultra HD)',
      'Switch PoE integrado: 8 puertos independientes RJ-45 10/100 Mbps con estándar IEEE 802.3af/at (Plug & Play)',
      'Compresión de video: Ultra 265 / H.265 / H.264 para máximo ahorro de disco y transmisión fluida',
      'Salidas de video: 1x HDMI 4K (3840 x 2160 a 30Hz) y 1x VGA (1920 x 1080) simultáneas',
      'Almacenamiento SATA: 1 interfaz SATA interna para discos duros de hasta 6 TB (soporta WD Purple)',
      'Acceso móvil y red: Protocolo P2P con app móvil EZView (código QR instantáneo) y software EZStation para PC',
      'Garantía oficial Uniview de 2 años con soporte técnico e instalación en Santiago y el Cibao'
    ]
  }
];

const hpLaptopItems = [
  {
    id: 'hp_probook_450_g10_laptop',
    department: 'equipos',
    category: 'Laptops y Portátiles',
    brand: 'HP',
    title: 'Laptop Corporativa HP ProBook 450 G10 Core i7 (15.6" FHD IPS, 16 GB RAM, 512 GB SSD NVMe, Numpad)',
    desc: 'Laptop empresarial de grado profesional HP ProBook 450 G10 diseñada para despachos corporativos, firmas de contabilidad, constructoras y directivos en Santiago. Equipada con procesador Intel Core i7-1355U de 10 núcleos (hasta 5.0 GHz con Intel Turbo Boost), 16 GB de memoria RAM DDR4 3200 MHz en doble canal (expandible a 32 GB), 512 GB de almacenamiento SSD PCIe NVMe M.2 ultrarrápido, y pantalla de 15.6 pulgadas Full HD (1920x1080) IPS con marco angosto y acabado antirreflejo de 250 nits. Incorpora teclado completo resistente a salpicaduras con bloque numérico dedicado (numpad), suite de seguridad avanzada HP Wolf Pro Security Edition con chip TPM 2.0 y lector de huellas dactilares. Conectividad completa con 2x USB-C (soporta Power Delivery y DisplayPort), 2x USB-A 3.2, puerto HDMI 2.1, Ethernet Gigabit RJ-45, Wi-Fi 6E y Bluetooth 5.3, con chasis de aluminio duradero certificado bajo pruebas militares MIL-STD-810H.',
    price: 'RD$ 54,800.00',
    img: 'img/productos/catalogo/hp-probook-450-g10.webp',
    gallery: [
      'img/productos/catalogo/hp-probook-450-g10.webp'
    ],
    specs: [
      'Procesador: Intel Core i7-1355U de 13.ª generación (10 núcleos, 12 hilos, hasta 5.0 GHz con Turbo Boost)',
      'Memoria RAM: 16 GB DDR4-3200 MHz en doble canal (expandible hasta 32 GB)',
      'Almacenamiento: Unidad de estado sólido SSD de 512 GB PCIe NVMe M.2 ultrarrápida',
      'Pantalla: 15.6 pulgadas Full HD (1920 x 1080) IPS antirreflejo con biseles delgados y 250 nits',
      'Teclado y ergonomía: Teclado numérico completo numpad resistente a derrames menores de líquidos',
      'Seguridad corporativa: HP Wolf Pro Security, sensor biométrico de huellas digitales y TPM 2.0',
      'Puertos y red: 2x USB Type-C, 2x USB Type-A, HDMI 2.1, RJ-45 Gigabit, Wi-Fi 6E y Bluetooth 5.3',
      'Garantía oficial HP de 1 año con respaldo corporativo Futunet y comprobante fiscal formal NCF'
    ]
  }
];

const hpPrinterItems = [
  {
    id: 'oficina_hp_laserjet_pro_m428fdw_multifuncional',
    department: 'equipos',
    category: 'Impresoras y Escáneres',
    brand: 'HP',
    title: 'Impresora Multifuncional Láser HP LaserJet Pro MFP M428fdw (40 ppm, Dúplex, Wi-Fi, Ethernet, Fax)',
    desc: 'Impresora láser multifuncional monocromática 4 en 1 de alta productividad HP LaserJet Pro MFP M428fdw (imprime, escanea, copia y envía fax) diseñada para oficinas, notarías, consultorios médicos, empresas e instituciones en Santiago con alta carga de trabajo documental. Imprime a velocidades de hasta 40 páginas por minuto con resolución nítida HP FastRes 1200. Cuenta con impresión a doble cara automática (dúplex) y alimentador automático de documentos (ADF) de 50 hojas para escaneo dúplex de doble cara en una sola pasada. Equipada con pantalla táctil intuitiva a color de 2.7 pulgadas con accesos directos configurables, conectividad inalámbrica Wi-Fi de doble banda autorreparable, puerto Gigabit Ethernet de red, USB 2.0 de alta velocidad e impresión móvil mediante Apple AirPrint, Mopria y app HP Smart. Capacidad de entrada de hasta 350 hojas (bandeja multiuso de 100 hojas + bandeja principal de 250 hojas) y compatibilidad con cartuchos de tóner de alta capacidad HP CF258A y CF258X.',
    price: 'RD$ 32,500.00',
    img: 'img/productos/catalogo/hp-laserjet-pro-mfp-m428fdw.webp',
    gallery: [
      'img/productos/catalogo/hp-laserjet-pro-mfp-m428fdw.webp'
    ],
    specs: [
      'Funciones 4 en 1: Impresión láser monocromática, copiado de alta nitidez, escáner y fax de oficina',
      'Velocidad de impresión: Hasta 40 ppm (A4 / Carta) con salida de primera página en apenas 6.1 segundos',
      'Doble cara automático (Dúplex): Impresión y escaneo a dos caras simultáneo con ADF de 50 hojas',
      'Pantalla y control: Pantalla táctil gráfica a color de 2.7 pulgadas (6.8 cm) con accesos directos táctiles',
      'Conectividad de red: Wi-Fi de doble banda 2.4/5 GHz, Ethernet Gigabit 10/100/1000 y USB 2.0',
      'Capacidad de papel: Bandeja 1 multipropósito de 100 hojas y Bandeja 2 de 250 hojas (350 hojas estándar)',
      'Consumibles: Cartuchos originales HP CF258A (3,000 páginas) y HP CF258X de alto rendimiento (10,000 páginas)',
      'Garantía oficial HP de 1 año con soporte técnico local y factura con NCF corporativo'
    ]
  }
];

const ciscoSwitchItems = [
  {
    id: 'redes_cisco_business_cbs350_24t_switch',
    department: 'redes',
    category: 'Switches y Redes',
    brand: 'Cisco',
    title: 'Switch Administrable Gigabit Cisco Business CBS350-24T-4G (24 Puertos GbE + 4 Uplinks SFP, Capa 3)',
    desc: 'Switch administrable empresarial de capa 2 y capa 3 Cisco Business 350 Series (CBS350-24T-4G) para infraestructura de telecomunicaciones, naves industriales, centros de datos y redes corporativas de alto rendimiento en Santiago. Cuenta con 24 puertos Gigabit Ethernet 10/100/1000 Mbps con arquitectura sin bloqueo y 4 puertos dedicados SFP Gigabit para enlaces ascendentes de fibra óptica troncal hacia servidores u otros edificios. Proporciona una capacidad de conmutación de 56 Gbps y tasa de reenvío de 41.66 Mpps. Incorpora capacidades avanzadas de enrutamiento estático IPv4/IPv6 de capa 3 para interconectar segmentos y VLANs (hasta 4,094 IDs de VLAN) sin sobrecargar el router perimetral. Ofrece seguridad de red robusta con listas de control de acceso (ACLs), seguridad de puertos IEEE 802.1X, prevención contra ataques DoS, soporte QoS de 8 colas de prioridad y gestión simplificada mediante interfaz web en español, SNMP y la consola en la nube Cisco Business Dashboard sin requerir pago de licencias recurrentes. Formato metálico de montaje en rack de 19 pulgadas (1U) con garantía oficial Cisco y comprobante fiscal formal NCF.',
    price: 'RD$ 28,900.00',
    img: 'img/productos/catalogo/cisco-cbs350-24t-switch.webp',
    gallery: [
      'img/productos/catalogo/cisco-cbs350-24t-switch.webp'
    ],
    specs: [
      'Puertos de red: 24 puertos Gigabit Ethernet RJ-45 (10/100/1000 Mbps) con autodetección MDI/MDIX',
      'Puertos de fibra óptica: 4 puertos dedicados SFP Gigabit (1 Gbps) para módulos transceptores de fibra',
      'Rendimiento y capacidad: Capacidad de conmutación de 56 Gbps y reenvío de 41.66 millones de paquetes/seg (Mpps)',
      'Enrutamiento de Capa 3: Enrutamiento estático IPv4/IPv6 para segmentación directa de tráfico entre VLANs',
      'Seguridad de red: IEEE 802.1X, listas de control de acceso (ACLs), inspección ARP dinámica e IP Source Guard',
      'Administración empresarial: Cisco Business Dashboard, interfaz gráfica Web GUI intuitiva en español y SNMP v1/v2c/v3',
      'Estructura física: Chasis de acero para montaje en rack estándar de 19" (1U) con brackets de sujeción incluidos',
      'Garantía oficial Cisco de 2 años con soporte técnico especializado de Futunet en República Dominicana'
    ]
  }
];

const apcUpsOnlineItems = [
  {
    id: 'energia_apc_schneider_easy_ups_srv_3000va_online',
    department: 'energia',
    category: 'Sistemas UPS y Baterías',
    brand: 'Schneider Electric',
    title: 'UPS Online Doble Conversión APC by Schneider Electric Easy UPS SRV 3000VA 120V (2400W, 0 ms Transferencia, LCD, SNMP)',
    desc: 'Sistema de Alimentación Ininterrumpida (UPS) Online de Doble Conversión de alto rendimiento APC by Schneider Electric Easy UPS SRV 3000VA (SRV3000XLA / SRV3KA) de 2,400 Watts de potencia real con factor de potencia 0.8 / onda senoidal pura y tiempo de conmutación cero (0 ms). Diseñado especialmente para servidores de misión crítica, centros de datos, equipamiento médico y racks de telecomunicaciones en Santiago ante cortes o fluctuaciones extremas de la red eléctrica. Incorpora pantalla LCD gráfica multifunción para monitoreo en tiempo real de voltaje, carga y autonomía en minutos, ranura inteligente Mini-Slot para tarjeta de gestión de red SNMP/Web, bypass automático y tomas de salida profesionales NEMA 5-20R y NEMA L5-30R de alta capacidad.',
    price: 'RD$ 78,900.00',
    img: 'img/productos/catalogo/apc-schneider-easy-ups-srv-3000va.webp',
    gallery: [
      'img/productos/catalogo/apc-schneider-easy-ups-srv-3000va.webp'
    ],
    specs: [
      'Capacidad y potencia: 3,000 VA / 2,400 Watts de potencia real con factor de potencia elevado',
      'Topología eléctrica: Online Doble Conversión verdadera con tiempo de transferencia cero (0 ms)',
      'Forma de onda: Onda senoidal pura en salida de 120V CA (±1% de regulación precisa de voltaje)',
      'Tomas de salida: 6 tomas NEMA 5-20R de 20A + 1 toma de bloqueo industrial NEMA L5-30R de 30A',
      'Pantalla y gestión: Pantalla LCD gráfica multifunción con estado de carga, batería y alarmas sonoras',
      'Conectividad inteligente: Ranura Mini-Slot para tarjeta de red SNMP/Web y puerto USB/RS-232',
      'Protección avanzada: Bypass automático y manual, modo ECO de alta eficiencia energética del 94%',
      'Garantía oficial Schneider Electric / APC de 2 años con soporte técnico directo de Futunet en Santiago'
    ]
  }
];

const mikrotikMultiwanItems = [
  {
    id: 'redes_mikrotik_rb5009_router_multiwan',
    department: 'redes',
    category: 'Routers y Telecomunicaciones',
    brand: 'MikroTik',
    title: 'Router de Alto Rendimiento MikroTik RB5009UG+S+IN Multi-WAN (7x GbE + 1x 2.5 GbE + 1x 10G SFP+, Quad-Core 1.4 GHz)',
    desc: 'Router corporativo de alta capacidad de enrutamiento MikroTik RB5009UG+S+IN diseñado para balanceo de carga Multi-WAN, enlaces de fibra óptica dedicados de alta velocidad y failover automático en zonas francas, empresas y proveedores en Santiago y el Cibao. Equipado con potente procesador Marvell Armada Quad-Core de 64 bits a 1.4 GHz, 1 GB de memoria RAM DDR4, 1 GB de almacenamiento NAND y chip de conmutación de alto rendimiento. Ofrece 7 puertos Gigabit Ethernet 10/100/1000, 1 puerto 2.5 Gigabit Ethernet para enlaces WAN de ultra banda ancha y 1 jaula 10G SFP+ para fibra óptica troncal a 10 Gbps. Chasis metálico compacto de aleación pesada que actúa como disipador térmico pasivo silencioso sin ventiladores ruidosos, con soporte para montaje en rack de 19 pulgadas y licencia RouterOS v7 Nivel 5 para enrutamiento BGP, OSPF, túneles WireGuard, IPsec acelerado por hardware y colas QoS avanzadas.',
    price: 'RD$ 17,950.00',
    img: 'img/productos/catalogo/mikrotik-rb5009-router-multiwan.webp',
    gallery: [
      'img/productos/catalogo/mikrotik-rb5009-router-multiwan.webp'
    ],
    specs: [
      'Procesador y memoria: Marvell Armada 88F7040 Quad-Core a 1.4 GHz con 1 GB RAM DDR4 y 1 GB NAND',
      'Puertos Ethernet: 7 puertos Gigabit Ethernet (10/100/1000 Mbps) + 1 puerto 2.5 Gigabit Ethernet (2.5 GbE)',
      'Puerto de fibra óptica: 1 jaula SFP+ de 10 Gbps (10G SFP+) compatible con módulos de fibra mono/multimodo',
      'Alimentación redundante: Entrada PoE-In 802.3af/at en puerto 1, DC Jack estándar y terminal bloque de 2 pines (24-57V)',
      'Sistema operativo: MikroTik RouterOS v7 con Licencia Nivel 5 (soporte WireGuard, BGP, OSPF y VLANs)',
      'Diseño térmico: Chasis disipador de aluminio macizo para operación 24/7 sin ventiladores y opción rack 1U',
      'Rendimiento: Capacidad de enrutamiento de hasta 10 Gbps sin cuello de botella y aceleración IPsec',
      'Garantía oficial MikroTik de 1 año con respaldo técnico y asesoría en Santiago de los Caballeros'
    ]
  }
];

const lenovoTinyItems = [
  {
    id: 'oficina_lenovo_thinkcentre_m70q_tiny_desktop',
    department: 'equipos',
    category: 'Computadoras y Servidores',
    brand: 'Lenovo',
    title: 'Computadora Corporativa Ultracompacta Lenovo ThinkCentre M70q Tiny Gen 4 Mini PC (Intel Core i5-13400T, 16 GB RAM, 512 GB SSD, Wi-Fi 6E)',
    desc: 'Computadora de escritorio empresarial ultracompacta Mini PC formato Tiny de 1 litro Lenovo ThinkCentre M70q Gen 4 diseñada para mostradores comerciales, cajas de punto de venta (POS), consultorios, firmas corporativas y espacios reducidos en Santiago. Equipada con procesador Intel Core i5-13400T de 13.ª generación con 10 núcleos y 16 hilos (hasta 4.40 GHz con Intel Max Turbo), 16 GB de memoria RAM DDR4 en doble canal (expandible a 64 GB), unidad de estado sólido de 512 GB SSD M.2 PCIe 4.0 NVMe de alta velocidad y gráficos integrados Intel UHD Graphics 730 con soporte para hasta 3 pantallas independientes vía HDMI 2.1 y DisplayPort 1.4. Cuenta con conectividad inalámbrica de última generación Wi-Fi 6E (802.11ax), Bluetooth 5.1, puerto de red Gigabit Ethernet RJ-45, puerto frontal USB-C 3.2 Gen 1, 5 puertos USB 3.2 Gen 2 y chasis de grado militar certificado bajo pruebas de resistencia extremas MIL-STD-810H. Compatible con montaje VESA detrás de monitores o bajo escritorios. Incluye teclado y mouse óptico Lenovo USB originales en español y Windows 11 Pro preinstalado.',
    price: 'RD$ 44,500.00',
    img: 'img/productos/catalogo/lenovo-thinkcentre-m70q-tiny.webp',
    gallery: [
      'img/productos/catalogo/lenovo-thinkcentre-m70q-tiny.webp'
    ],
    specs: [
      'Procesador: Intel Core i5-13400T de 13.ª generación (10 núcleos: 6 Performance + 4 Efficient, 16 hilos, hasta 4.4 GHz)',
      'Memoria RAM: 16 GB DDR4-3200 MHz de grado corporativo (expandible hasta 64 GB en dos ranuras SODIMM)',
      'Almacenamiento: 512 GB SSD M.2 2280 PCIe 4.0 x4 NVMe Opal 2.0 de lectura y escritura ultrarrápida',
      'Factor de forma Tiny: Chasis ultracompacto Mini PC de 1 Litro (17.9 cm x 18.2 cm x 3.6 cm) y apenas 1.25 kg de peso',
      'Salidas gráficas multi-monitor: 1 puerto HDMI 2.1 TMDS + 1 puerto DisplayPort 1.4a con soporte 4K',
      'Puertos y expansión: 1x USB-C 3.2 Gen 1 frontal, 3x USB 3.2 Gen 2, 2x USB 3.2 Gen 1, RJ-45 Gigabit y combo audio',
      'Conectividad: Intel Wi-Fi 6E AX211 (2x2 ax) + Bluetooth 5.1 con antena externa de alta ganancia',
      'Periféricos y SO: Incluye teclado USB tradicional Lenovo y mouse óptico USB en español, con Windows 11 Pro',
      'Garantía oficial Lenovo de 3 años en sitio con factura formal con valor fiscal NCF en Santiago'
    ]
  }
];

const univiewCameraItems = [
  {
    id: 'seguridad_uniview_colorhunter_4k_poe_camera',
    department: 'seguridad',
    category: 'Seguridad y Vigilancia',
    brand: 'Uniview',
    title: 'Cámara IP Uniview ColorHunter 4K 8MP PoE con Visión Nocturna a Color 24/7, Micrófono y Analítica Inteligente (IPC2128SB-ADF28KMC-I0)',
    desc: 'Cámara de seguridad IP tipo Bullet profesional Uniview ColorHunter 4K Ultra HD de 8 Megapíxeles (resolución 3840 x 2160) con tecnología ColorHunter para visión nocturna a todo color real las 24 horas del día. Equipada con lente de gran apertura F1.0 que capta 4 veces más luz que lentes convencionales y reflectores de luz cálida suave con alcance de hasta 30 metros sin deslumbrar. Incorpora prevención inteligente de intrusiones (SIP) con clasificación basada en inteligencia artificial de humanos y vehículos para reducir falsas alarmas provocadas por lluvia, viento, ramas o animales pequeños. Dispone de micrófono integrado de alta fidelidad con reducción de ruido ambiental para registro de audio, ranura para tarjeta de memoria MicroSD de hasta 256 GB para almacenamiento redundante local y alimentación estándar PoE 802.3af (o 12V DC). Chasis metálico de alta resistencia con certificación IP67 contra polvo, lluvia y chorros de agua a presión y protección contra sobretensiones transitorias de 4 kV. Compatible 100% con grabadores NVR Uniview y aplicación móvil gratuita Uniarch / EZView para visualización remota en vivo desde cualquier smartphone.',
    price: 'RD$ 8,450.00',
    img: 'img/productos/catalogo/uniview-colorhunter-4k-poe-camera.webp',
    gallery: [
      'img/productos/catalogo/uniview-colorhunter-4k-poe-camera.webp'
    ],
    specs: [
      'Resolución Ultra HD 4K (3840 x 2160) a 20 fps con sensor CMOS de 1/2.8" de alta sensibilidad lumínica',
      'Tecnología ColorHunter: Visión nocturna a todo color 24/7 con lente F1.0 de gran apertura y luz cálida de 30m',
      'Analítica Inteligente SIP: Clasificación precisa de humanos y vehículos para filtros de cruce de línea e intrusión perimetral',
      'Micrófono integrado de alta fidelidad con cancelación de ruido ambiental para audio forense claro',
      'Alimentación Power over Ethernet (PoE 802.3af) y entrada 12V DC con consumo ultra eficiente de energía',
      'Almacenamiento local redundante: Ranura MicroSD integrada con soporte de hasta 256 GB',
      'Chasis metálico resistente a intemperie con certificación IP67 y protección contra sobretensiones de 4 kV',
      'Garantía oficial Uniview de 1 año con soporte técnico y facturación formal NCF en Santiago'
    ]
  }
];

const netgearPoeItems = [
  {
    id: 'redes_netgear_gs308pp_switch_8p_poe',
    department: 'redes',
    category: 'Switches y Enrutadores',
    brand: 'Netgear',
    title: 'Switch Netgear ProSAFE GS308PP 8 Puertos Gigabit Ethernet Metálico Fanless con 8 Puertos PoE+ (Presupuesto 83W)',
    desc: 'Switch Gigabit Ethernet no administrable de alta potencia Netgear ProSAFE GS308PP de 8 puertos 10/100/1000 Mbps con soporte completo PoE+ (Power over Ethernet IEEE 802.3at/af) en los 8 puertos y un presupuesto total de potencia PoE de 83 Watts (hasta 30W por puerto). Diseñado para conectar y energizar simultáneamente cámaras de videovigilancia IP 4K, puntos de acceso Wi-Fi 6 de doble banda y teléfonos VoIP sin requerir inyectores de corriente externos ni tomas eléctricas adicionales. Construido en chasis metálico de alta resistencia con diseño Fanless silencioso sin ventiladores, ideal para oficinas ejecutivas, salas de juntas, clínicas y cajas de cobro. Cuenta con arquitectura de conmutación sin bloqueo con 16 Gbps de ancho de banda, soporte de tramas Jumbo de 9 KB, priorización de tráfico QoS 802.1p por hardware para transmisión fluida de voz y video, eficiencia energética IEEE 802.3az e instalación instantánea Plug & Play sin configuración.',
    price: 'RD$ 6,850.00',
    img: 'img/productos/catalogo/netgear-gs308pp-switch-8p-poe.webp',
    gallery: [
      'img/productos/catalogo/netgear-gs308pp-switch-8p-poe.webp'
    ],
    specs: [
      '8 puertos Gigabit Ethernet 10/100/1000 Mbps RJ-45 con auto-negociación y Auto MDI/MDIX',
      '8 puertos PoE+ IEEE 802.3at/af con presupuesto total de potencia PoE de 83 Watts',
      'Diseño Fanless silencioso: Chasis metálico compacto para disipación térmica pasiva sin ruido',
      'Capacidad de conmutación de 16 Gbps sin bloqueo y soporte para tramas Jumbo de hasta 9 KB',
      'Priorización de tráfico QoS 802.1p basada en hardware para llamadas VoIP y streaming 4K continuo',
      'Indicadores LED por puerto para estado de enlace, velocidad Gigabit y activación de alimentación PoE+',
      'Instalación Plug & Play sin requerir software ni configuración, con soporte para montaje en pared o escritorio',
      'Garantía oficial Netgear de 2 años con soporte técnico y factura con comprobante fiscal NCF en Santiago'
    ]
  }
];

const victronMpptItems = [
  {
    id: 'energia_victron_smartsolar_mppt_100_30',
    department: 'energia',
    category: 'Energía y Respaldo',
    brand: 'Victron Energy',
    title: 'Controlador de Carga Solar Victron Energy SmartSolar MPPT 100/30 (100V / 30A) con Bluetooth Integrado y Monitoreo VictronConnect',
    desc: 'Controlador y regulador de carga solar fotovoltaica inteligente Victron Energy SmartSolar MPPT 100/30 de 30 Amperios de corriente de carga nominal y hasta 100 Voltios de tensión máxima de circuito abierto FV. Incorpora la tecnología exclusiva Ultra-Fast MPPT (Maximum Power Point Tracking) que maximiza la captación de energía de los paneles solares hasta un 30% más rápido en comparación con reguladores PWM y hasta un 10% más eficiente frente a otros controladores MPPT en condiciones de cielo nublado o radiación solar cambiante en República Dominicana. Dispone de conectividad inalámbrica Bluetooth Smart integrada de fábrica para configurar, monitorear y actualizar el sistema en tiempo real desde la aplicación móvil VictronConnect (iOS y Android), visualizando gráficas de generación solar histórica y estado de batería. Cuenta con algoritmo de carga inteligente de 3 etapas y gestión avanzada BatteryLife que previene la degradación prematura de baterías de ciclo profundo, AGM, gel o litio LiFePO4, salida de carga inteligente programable y puerto de comunicación VE.Direct.',
    price: 'RD$ 14,200.00',
    img: 'img/productos/catalogo/victron-smartsolar-mppt-100-30.webp',
    gallery: [
      'img/productos/catalogo/victron-smartsolar-mppt-100-30.webp'
    ],
    specs: [
      'Tensión máxima de circuito abierto fotovoltaico (Voc): 100 Voltios para arreglos de paneles solares en serie',
      'Corriente de carga de batería nominal: 30 Amperios con detección automática de bancos de 12V y 24V (hasta 440W en 12V / 880W en 24V)',
      'Tecnología Ultra-Fast MPPT: Optimización de punto de máxima potencia ultra rápida ante sombras parciales y días nublados',
      'Bluetooth Smart integrado: Monitoreo inalámbrico en vivo, registro de datos de 30 días y control desde la app VictronConnect',
      'Algoritmo inteligente BatteryLife: Monitoreo del estado de carga para evitar descargas profundas y prolongar la vida útil de baterías',
      'Compatibilidad universal: Perfiles de carga configurables para baterías de Litio (LiFePO4), Gel, AGM y Plomo-Ácido',
      'Salida de consumo inteligente con desconexión automática por baja tensión para proteger el banco de baterías',
      'Garantía oficial del fabricante Victron Energy de 5 años con soporte técnico especializado de Futunet en Santiago'
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
    ...logitechItems,
    ...lenovoItems,
    ...netgearItems,
    ...schneiderItems,
    ...linksysItems,
    ...victronItems,
    ...paradoxItems,
    ...panasonicItems,
    ...mitsubishiItems,
    ...juniperItems,
    ...siemensItems,
    ...teslaItems,
    ...dellServerItems,
    ...ontFiberItems,
    ...solarCamItems,
    ...samsungDisplayItems,
    ...ubiquitiGatewayItems,
    ...univiewNvrItems,
    ...hpLaptopItems,
    ...hpPrinterItems,
    ...ciscoSwitchItems,
    ...apcUpsOnlineItems,
    ...mikrotikMultiwanItems,
    ...lenovoTinyItems,
    ...univiewCameraItems,
    ...netgearPoeItems,
    ...victronMpptItems
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
    ...logitechItems,
    ...lenovoItems,
    ...netgearItems,
    ...schneiderItems,
    ...linksysItems,
    ...victronItems,
    ...paradoxItems,
    ...panasonicItems,
    ...mitsubishiItems,
    ...juniperItems,
    ...siemensItems,
    ...teslaItems,
    ...dellServerItems,
    ...ontFiberItems,
    ...solarCamItems,
    ...samsungDisplayItems,
    ...ubiquitiGatewayItems,
    ...univiewNvrItems,
    ...hpLaptopItems,
    ...hpPrinterItems,
    ...ciscoSwitchItems,
    ...apcUpsOnlineItems,
    ...mikrotikMultiwanItems,
    ...lenovoTinyItems,
    ...univiewCameraItems,
    ...netgearPoeItems,
    ...victronMpptItems
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
