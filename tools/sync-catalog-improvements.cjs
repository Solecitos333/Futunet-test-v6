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
    title: 'Punto de Acceso Ubiquiti UniFi 6 Plus (U6+) WiFi 6 Doble Banda 3.0 Gbps PoE',
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
    ...dellLaptops,
    ...gamingItems,
    ...dellOptiplexDesktops,
    ...monitorItems,
    ...cctvItems,
    ...audioItems,
    ...networkingItems
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
    ...dellLaptops,
    ...gamingItems,
    ...dellOptiplexDesktops,
    ...monitorItems,
    ...cctvItems,
    ...audioItems,
    ...networkingItems
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
