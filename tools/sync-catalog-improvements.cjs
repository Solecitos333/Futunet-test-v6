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

async function updateBackupData() {
  const backupPath = path.join(projectRoot, 'js', 'backup_data.js');
  const code = fs.readFileSync(backupPath, 'utf8');

  let mockDatabase;
  global.window = {};
  eval(code.replace('const mockDatabase =', 'mockDatabase ='));
  console.log(`[backup_data] Registros iniciales: ${mockDatabase.length}`);

  // Actualizar mob items
  mobItems.forEach(item => {
    const idx = mockDatabase.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      mockDatabase[idx] = item;
    } else {
      mockDatabase.push(item);
    }
  });

  // Agregar Dell Laptops
  dellLaptops.forEach(item => {
    const idx = mockDatabase.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      mockDatabase[idx] = item;
    } else {
      mockDatabase.push(item);
    }
  });

  // Agregar Gaming items
  gamingItems.forEach(item => {
    const idx = mockDatabase.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      mockDatabase[idx] = item;
    } else {
      mockDatabase.push(item);
    }
  });

  console.log(`[backup_data] Registros finales: ${mockDatabase.length}`);

  const newContent = `const mockDatabase = ${JSON.stringify(mockDatabase, null, 2)};\nif (typeof module !== 'undefined') module.exports = mockDatabase;\nwindow.backupDatabase = mockDatabase;\n`;
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
  const allProducts = [...mobItems, ...dellLaptops, ...gamingItems];

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
