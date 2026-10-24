/* =============================================================
   CATALOG.JS — Futunet E-Commerce Platform
   Funcionalidad del catálogo de servicios:
   - Renderizado dinámico de cuadrícula de productos
   - Paginación "Load More" con IntersectionObserver
   - Filtrado de productos por categoría
   - Búsqueda con debounce y autocompletado
   - Sanitización de HTML para prevenir XSS
   - Mensaje de WhatsApp dinámico por producto
   ============================================================= */

/* -------------------------------------------------------------
   0. UTILIDADES (Sanitización, Debounce, Acceso a Catálogo)
   ------------------------------------------------------------- */

/**
 * Accesor seguro y resiliente del catálogo:
 * Consulta proveedores integrados, mockDatabase en memoria, window.backupDatabase o fallback
 */
function getCatalogDb() {
  if (typeof window !== 'undefined') {
    if (window.supplierInventory && typeof window.supplierInventory.getMergedCatalog === 'function') {
      const merged = window.supplierInventory.getMergedCatalog();
      if (Array.isArray(merged) && merged.length > 0) return merged;
    }
    if (Array.isArray(window.mockDatabase) && window.mockDatabase.length > 0) {
      return window.mockDatabase;
    }
    if (Array.isArray(window.backupDatabase) && window.backupDatabase.length > 0) {
      return window.backupDatabase;
    }
    if (Array.isArray(window.mockDatabase)) {
      return window.mockDatabase;
    }
  }
  if (typeof mockDatabase !== 'undefined' && Array.isArray(mockDatabase)) {
    return mockDatabase;
  }
  return [];
}

if (typeof mockDatabase === 'undefined') {
  var mockDatabase = (typeof window !== 'undefined' && window.mockDatabase) ? window.mockDatabase : [];
}


/**
 * Escapa caracteres HTML especiales para prevenir XSS
 */
function escapeHTML(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Debounce: retrasa la ejecución de una función hasta que
 * pase un tiempo sin nuevas llamadas.
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Normaliza texto para búsqueda tolerante:
 * - Minúsculas
 * - Elimina acentos (á→a, é→e, í→i, ó→o, ú→u, ñ→n)
 * - Elimina caracteres especiales
 */
function normalizeSearch(str) {
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00f1/g, 'n').replace(/\u00d1/g, 'n')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Genera variantes de un término de búsqueda quitando terminaciones
 * comunes del español (plurales, género, diminutivos).
 */
function getStemVariants(word) {
  const variants = [word];
  if (word === 'gamer' || word === 'gamers') variants.push('gaming');
  if (word === 'gaming') variants.push('gamer', 'gamers');
  if (word === 'pc' || word === 'pcs') variants.push('computadora', 'computadoras', 'desktop');
  if (word === 'laptop' || word === 'laptops') variants.push('portatil', 'notebook');
  if (word === 'pantalla' || word === 'pantallas') variants.push('monitor', 'monitores');
  if (word === 'monitor' || word === 'monitores') variants.push('pantalla', 'pantallas');
  if (word === 'audifono' || word === 'audifonos') variants.push('auricular', 'auriculares', 'headset', 'airpod', 'airpods');
  if (word === 'auricular' || word === 'auriculares') variants.push('audifono', 'audifonos', 'headset', 'airpod', 'airpods');
  if (word === 'airpod' || word === 'airpods') variants.push('auricular', 'auriculares', 'audifonos', 'apple');
  if (word === 'cisco') variants.push('switch', 'switches', 'redes');
  if (word === 'ubiquiti' || word === 'unifi') variants.push('ubiquiti', 'unifi', 'wifi', 'switch');
  if (word === 'switch' || word === 'switches') variants.push('swicht', 'swichts', 'cisco', 'ubiquiti', 'conmutador', 'poe');
  if (word === 'swicht' || word === 'swichts') variants.push('switch', 'switches', 'poe');
  if (word === 'router' || word === 'routers') variants.push('enrutador', 'wifi', 'red');
  if (word === 'red' || word === 'redes') variants.push('router', 'switch', 'cisco', 'ubiquiti', 'conectividad');
  if (word === 'inversor' || word === 'inversores') variants.push('ups', 'regulador', 'forza', 'nobreak');
  if (word === 'ups') variants.push('nobreak', 'bateria', 'inversor', 'regulador', 'forza');
  if (word === 'nobreak') variants.push('ups', 'regulador', 'bateria', 'inversor');
  if (word === 'forza') variants.push('ups', 'regulador', 'inversor');
  if (word === 'scanner' || word === 'scanners' || word === 'escaner' || word === 'escaneres') variants.push('lector', 'barcode', 'codigo', 'codigos');
  if (word === 'lector' || word === 'lectores') variants.push('scanner', 'escaner', 'barcode');
  if (word === 'barcode') variants.push('lector', 'scanner', 'escaner', 'codigo');
  if (word === 'cajon' || word === 'cajones' || word === 'gaveta' || word === 'gavetas') variants.push('monedero', 'dinero', 'pos');
  if (word === 'monedero' || word === 'monederos') variants.push('gaveta', 'cajon', 'pos');
  if (word === 'bobina' || word === 'bobinas') variants.push('cable', 'utp', 'cca', 'cobre', 'cat5e', 'cat6', 'rollo');
  if (word === 'rollo' || word === 'rollos') variants.push('bobina', 'cable', 'utp');
  if (word === 'cobre') variants.push('utp', 'cable', 'cat6', 'bobina');
  if (word === 'electroiman' || word === 'electroimanes') variants.push('cerradura', 'magnetica', 'chapa', 'bloqueo');
  if (word === 'chapa' || word === 'chapas') variants.push('cerradura', 'magnetica', 'electroiman');
  if (word === 'cerradura' || word === 'cerraduras') variants.push('magnetica', 'electroiman', 'chapa', 'acceso');
  if (word === 'pulsador' || word === 'pulsadores' || word === 'boton' || word === 'botones') variants.push('liberador', 'salida', 'touch', 'sensor');
  if (word === 'liberador' || word === 'liberadores') variants.push('pulsador', 'boton', 'salida', 'cerradura');
  if (word === 'notouch' || word === 'touch') variants.push('infrarrojo', 'sensor', 'pulsador', 'boton', 'salida');
  if (word === 'deco') variants.push('mesh', 'tplink', 'tp-link', 'wifi');
  if (word === 'mesh') variants.push('deco', 'malla', 'wifi', 'tplink');
  if (word === 'tplink' || word === 'tp-link') variants.push('deco', 'router', 'wifi', 'mesh');
  if (word === 'gabinete' || word === 'gabinetes') variants.push('rack', 'chasis', 'servidor', 'enclosure');
  if (word === 'rack' || word === 'racks') variants.push('gabinete', 'bastidor', 'servidor', 'patch');
  if (word === 'access' || word === 'point') variants.push('access', 'point', 'ap', 'punto', 'acceso', 'unifi', 'omada');
  if (word === 'ap') variants.push('access', 'point', 'punto', 'acceso', 'unifi', 'omada', 'wifi');
  if (word === 'patch') variants.push('panel', 'cord', 'patchcord', 'parcheo', 'latiguillo');
  if (word === 'patchcord') variants.push('patch', 'cord', 'latiguillo', 'cable');
  if (word === 'latiguillo' || word === 'latiguillos') variants.push('patch', 'cord', 'patchcord', 'cable');
  if (word === 'conector' || word === 'conectores') variants.push('plug', 'plugs', 'rj45', 'terminal', 'terminales', 'bota');
  if (word === 'plug' || word === 'plugs') variants.push('conector', 'conectores', 'rj45', 'terminal');
  if (word === 'servidor' || word === 'servidores') variants.push('server', 'servers', 'rack', 'workstation');
  if (word === 'dahua') variants.push('cctv', 'camara', 'xvr', 'dvr', 'hdcvi');
  if (word === 'dvr' || word === 'xvr') variants.push('grabador', 'cctv', 'seguridad', 'camara');
  if (word === 'silla' || word === 'sillas') variants.push('sillon', 'sillones', 'asiento', 'ergonomica', 'ergonomico');
  if (word === 'sillon' || word === 'sillones') variants.push('silla', 'sillas', 'asiento');
  if (word === 'ergonomica' || word === 'ergonomicas' || word === 'ergonomico' || word === 'ergonomicos') variants.push('ergonomia', 'silla', 'sillas');
  if (word === 'mouse' || word === 'mouses') variants.push('raton', 'ratones');
  if (word === 'raton' || word === 'ratones') variants.push('mouse', 'mouses');
  if (word === 'teclado' || word === 'teclados') variants.push('keyboard');
  if (word === 'keyboard' || word === 'keyboards') variants.push('teclado', 'teclados');
  if (word === 'zkteco' || word === 'zk') variants.push('biometrico', 'acceso', 'asistencia', 'ponchador', 'facial', 'reloj', 'electroiman', 'cerradura');
  if (word === 'biometrico' || word === 'biometricos' || word === 'biometrica' || word === 'biometricas') variants.push('zkteco', 'huella', 'facial', 'asistencia', 'ponchador', 'terminal', 'reloj');
  if (word === 'ponchador' || word === 'ponchadores' || word === 'ponche' || word === 'ponches') variants.push('asistencia', 'reloj', 'biometrico', 'zkteco', 'horario');
  if (word === 'asistencia') variants.push('ponchador', 'reloj', 'biometrico', 'zkteco');
  if (word === 'purple' || word === 'purpura') variants.push('western', 'wd', 'disco', 'cctv', 'surveillance');
  if (word === 'western' || word === 'wd') variants.push('purple', 'purpura', 'disco', 'almacenamiento');
  if (word === 'camara' || word === 'camaras') variants.push('cctv', 'videovigilancia');
  if (word === 'cctv') variants.push('camara', 'camaras', 'videovigilancia', 'dvr');
  if (word === 'disco' || word === 'discos') variants.push('ssd', 'hdd', 'purple', 'purpura');
  if (word === 'ssd') variants.push('disco', 'solido');
  if (word === 'tapo') variants.push('tplink', 'tp-link');
  if (word === 'proyector' || word === 'proyectores') variants.push('proyeccion');
  if (word === 'proyeccion') variants.push('proyector', 'proyectores');
  if (word === 'crimpadora' || word === 'crimpadoras' || word === 'crimpar' || word === 'crimpador') variants.push('ponchadora', 'herramienta', 'pelacable', 'pelacables', 'rj45', 'conector', 'red', 'tester');
  if (word === 'tester' || word === 'testers' || word === 'probador' || word === 'probadores') variants.push('red', 'rj45', 'utp', 'continuidad', 'led', 'cable', 'crimpadora');
  if (word === 'pelacable' || word === 'pelacables') variants.push('crimpadora', 'corte', 'herramienta', 'cable');
  if (word === 'ezviz') variants.push('cctv', 'camara', 'wifi', 'c6n', 'h3c', 'seguridad', 'inalambrica');
  if (word === 'c6n') variants.push('ezviz', 'camara', 'wifi', 'pan', 'tilt', '360');
  if (word === 'h3c') variants.push('ezviz', 'camara', 'wifi', 'exterior', 'ip67');
  if (word === 'mikrotik' || word === 'routerboard') variants.push('router', 'hex', 'rb750', 'balanceador', 'red', 'enrutador');
  if (word === 'hex' || word === 'rb750' || word === 'rb750gr3') variants.push('mikrotik', 'routerboard', 'router', 'balanceador');
  if (word === 'balanceador' || word === 'balanceadores') variants.push('mikrotik', 'router', 'multiwan', 'pcc', 'red');
  if (word === 'logitech') variants.push('teclado', 'mouse', 'combo', 'webcam', 'c920', 'mk270');
  if (word === 'webcam' || word === 'webcams') variants.push('camara', 'logitech', 'c920', 'video', 'reunion', 'conferencia');
  if (word === 'c920') variants.push('webcam', 'logitech', 'camara', 'hd', '1080p');
  if (word === 'mk270') variants.push('logitech', 'combo', 'teclado', 'mouse', 'inalambrico');
  if (word === 'lenovo') variants.push('thinkpad', 'ideapad', 'laptop', 'computadora', 'portatil');
  if (word === 'thinkpad') variants.push('lenovo', 'laptop', 'l14', 'portatil');
  if (word === 'ideapad') variants.push('lenovo', 'laptop', 'portatil');
  if (word === 'netgear') variants.push('switch', 'gs308', 'gigabit', 'red', 'conmutador');
  if (word === 'gs308') variants.push('netgear', 'switch', 'gigabit');
  if (word === 'schneider') variants.push('apc', 'ups', 'energia', 'respaldo', 'bv1000', 'surge');
  if (word === 'apc') variants.push('schneider', 'ups', 'bateria', 'respaldo', 'bv1000');
  if (word === 'bv1000') variants.push('apc', 'schneider', 'ups', 'easy');
  if (word === 'linksys') variants.push('router', 'wifi', 'mesh', 'hydra', 'velop', 'red');
  if (word === 'hydra') variants.push('linksys', 'router', 'wifi', 'ax5400');
  if (word === 'velop') variants.push('linksys', 'mesh', 'wifi');
  if (word === 'victron') variants.push('inversor', 'multiplus', 'mppt', 'solar', 'energia', 'cargador');
  if (word === 'multiplus') variants.push('victron', 'inversor', 'ups', 'senoidal', 'cargador');
  if (word === 'mppt') variants.push('victron', 'solar', 'controlador', 'carga');
  if (word === 'paradox') variants.push('alarma', 'spectra', 'sp4000', 'seguridad', 'sensor', 'pir');
  if (word === 'spectra' || word === 'sp4000') variants.push('paradox', 'alarma', 'seguridad');
  if (word === 'alarma' || word === 'alarmas') variants.push('paradox', 'spectra', 'intrusor', 'sirena', 'pir', 'seguridad');
  if (word === 'pir') variants.push('sensor', 'movimiento', 'paradox', 'nv5', 'alarma');
  if (word === 'panasonic') variants.push('telefono', 'hdv130', 'pbx', 'conmutador', 'central');
  if (word === 'hdv130' || word === 'kxhdv130') variants.push('panasonic', 'telefono', 'sip', 'kxhdv130b');
  if (word === 'pbx' || word === 'conmutador') variants.push('panasonic', 'telefono', 'central');
  if (word === 'mitsubishi') variants.push('aire', 'climatizacion', 'inverter', 'msz', 'seer');
  if (word === 'msz' || word === 'mszgl18') variants.push('mitsubishi', 'aire', 'inverter');
  if (word === 'juniper') variants.push('switch', 'ex2300', 'junos', 'redes', 'enrutador');
  if (word === 'ex2300') variants.push('juniper', 'switch', 'poe', 'junos');
  if (word === 'junos') variants.push('juniper', 'switch', 'routing');
  if (word === 'siemens') variants.push('breaker', 'sentron', 'industrial', 'termomagnetico', 'energia', 'tablero');
  if (word === 'sentron') variants.push('siemens', 'breaker', 'termomagnetico', '3p', 'industrial');
  if (word === 'breaker' || word === 'breakers') variants.push('siemens', 'sentron', 'termomagnetico', 'interruptor', 'disyuntor', 'cuchilla');
  if (word === 'disyuntor' || word === 'disyuntores') variants.push('breaker', 'termomagnetico', 'siemens', 'interruptor');
  if (word === 'tesla') variants.push('powerwall', 'bateria', 'solar', 'energia', 'acumulador');
  if (word === 'powerwall') variants.push('tesla', 'bateria', 'solar', 'almacenamiento', 'litio');
  if (word === 'poweredge' || word === 't150') variants.push('servidor', 'dell', 'xeon', 'rack', 'server');
  if (word === 'servidor' || word === 'servidores' || word === 'server' || word === 'servers') variants.push('poweredge', 't150', 'xeon', 'rack', 'workstation', 'dell');
  if (word === 'onu' || word === 'ont') variants.push('gpon', 'ftth', 'fibra', 'optica', 'terminal', 'wifi6', 'scapc');
  if (word === 'gpon' || word === 'ftth') variants.push('ont', 'onu', 'fibra', 'optica', 'terminal');
  if (word === 'estabilizador' || word === 'estabilizadores') variants.push('regulador', 'voltaje', 'protector', 'ups', 'forza');
  if (word === 'regulador' || word === 'reguladores') variants.push('estabilizador', 'voltaje', 'protector', 'ups');
  if (word === 'solar' || word === 'solares') variants.push('panel', 'bateria', 'autonoma', 'tesla', 'camara', 'fotovoltaico');
  if (word === 'samsung') variants.push('pantalla', 'crystal', 'uhd', 'signage', 'be55t', 'tv');
  if (word === 'crystal') variants.push('samsung', 'pantalla', 'uhd', '4k');
  if (word === 'signage') variants.push('samsung', 'pantalla', 'comercial', 'carteleria');
  if (word === 'ubiquiti' || word === 'unifi') variants.push('gateway', 'ucg', 'cloud', 'ultra', 'ap', 'ap6', 'antena');
  if (word === 'ucg' || word === 'ultra') variants.push('ubiquiti', 'unifi', 'gateway', 'cloud');
  if (word === 'uniview' || word === 'unv') variants.push('nvr', 'camara', 'poe', 'ezview', 'ultra265', 'nvr301');
  if (word === 'nvr' || word === 'nvrs') variants.push('uniview', 'grabador', 'poe', 'ip', 'dvr', 'canales', 'hikvision', 'dahua', 'nvr301');
  if (word === 'probook') variants.push('hp', 'laptop', 'portatil', '450', 'g10');
  if (word === 'laserjet') variants.push('hp', 'impresora', 'multifuncional', 'toner', 'm428', 'm428fdw');
  if (word === 'm428' || word === 'm428fdw') variants.push('laserjet', 'hp', 'impresora', 'mfp');
  if (word === 'cbs350' || word === 'cbs35024t') variants.push('cisco', 'switch', 'cbs', 'gigabit', 'sfp');
  if (word === 'srv' || word === 'srv3000' || word === 'srv3ka') variants.push('apc', 'schneider', 'ups', 'online', 'conversion');
  if (word === 'rb5009' || word === 'rb5009ug') variants.push('mikrotik', 'router', 'multiwan', 'sfp');
  if (word === 'm70q' || word === 'thinkcentre') variants.push('lenovo', 'tiny', 'desktop', 'computadora', 'minipc');
  if (word === 'tiny') variants.push('lenovo', 'thinkcentre', 'm70q', 'desktop', 'minipc');
  if (word === 'minipc' || word === 'mini') variants.push('tiny', 'm70q', 'thinkcentre', 'lenovo', 'computadora', 'desktop');
  if (word === 'multiwan') variants.push('router', 'mikrotik', 'rb5009', 'failover', 'balanceador');
  if (word === 'colorhunter' || word === 'ipc2128') variants.push('uniview', 'camara', '4k', 'poe', 'color');
  if (word === 'gs308pp' || word === 'gs308p') variants.push('netgear', 'switch', 'poe', 'prosafe', 'gigabit');
  if (word === 'smartsolar' || word === 'mppt') variants.push('victron', 'controlador', 'solar', 'bluetooth', 'bateria');
  if (word === 'hdv230' || word === 'kxhdv230') variants.push('panasonic', 'telefono', 'ip', 'sip', 'blf');
  if (word === 'srx300' || word === 'srx') variants.push('juniper', 'firewall', 'gateway', 'vpn', 'junos');
  if (word === 'sirius' || word === '3rt' || word === '3rt2026') variants.push('siemens', 'contactor', 'trifasico', 'motor', 'rele');
  if (word === 'connector' || word === 'charger') variants.push('tesla', 'wall', 'ev', 'cargador', 'recarga');
  if (word === 'cassette' || word === 'plam') variants.push('mitsubishi', 'inverter', 'techo', 'aire', 'climatizacion');
  if (word === 'ip150' || word === 'ip150plus') variants.push('paradox', 'modulo', 'comunicador', 'internet', 'alarma', 'insite');
  if (word === 'velop' || word === 'axe5400') variants.push('linksys', 'mesh', 'wifi', 'wifi6e', 'tribanda');
  if (word === 'h8c') variants.push('ezviz', 'camara', 'ptz', 'exterior', '360');
  if (word === 'meetup') variants.push('logitech', 'videoconferencia', 'camara', '4k', 'conferencia', 'reunion');
  if (word === 'tl400b' || word === 'tl400') variants.push('zkteco', 'cerradura', 'inteligente', 'biometrica', 'huella');
  if (word === 'u6pro' || word === 'u6-pro') variants.push('ubiquiti', 'unifi', 'access', 'point', 'wifi6', 'poe');
  if (word === 'flip' || word === 'wm65b') variants.push('samsung', 'pantalla', 'interactiva', 'tactil', 'pizarra');
  if (word === 'precision' || word === '3660') variants.push('dell', 'workstation', 'estacion', 'rtx', 'cad');
  if (word === 'pdu' || word === 'ap7900' || word === 'metered') variants.push('apc', 'schneider', 'rack', 'regleta', 'amperios');
  if (word === 'facial' || word === 'asi3213g') variants.push('dahua', 'rostro', 'biometrico', 'acceso', 'asistencia', 'camara');
  if (word === 'ultrawide' || word === '34wp500' || word === '34wp500b') variants.push('lg', 'monitor', 'panoramica', 'ips', 'wfhd', '2560x1080', 'splitscreen');
  if (word === 'ax3' || word === 'hap' || word === 'c53uig') variants.push('mikrotik', 'router', 'wifi6', 'ax1800', 'qualcomm', 'inalambrico');
  if (word === 'cbs3508p' || word === 'cbs3508pe2g') variants.push('cisco', 'switch', 'poe', 'gigabit', 'sfp', 'cbs350');
  if (word === 'smt1500c' || word === 'smt1500' || word === 'smartconnect') variants.push('apc', 'schneider', 'ups', 'senoidal', '1500va', 'smartups');
  if (word === 'e16' || word === 'thinkpad e16' || word === 'e16gen1') variants.push('lenovo', 'thinkpad', 'laptop', 'wuxga', 'numpad', 'i7');
  if (word === 'omada' || word === 'eap653' || word === 'eap') variants.push('tplink', 'ap', 'wifi6', 'ax3000', 'sdn', 'poe', 'techo');
  if (word === 'l5590' || word === 'ecotank l5590') variants.push('epson', 'ecotank', 'impresora', 'multifuncional', 'adf', 'ethernet', 'tinta');
  if (word === 'acusense' || word === '2cd2183g2' || word === 'ds2cd2183g2') variants.push('hikvision', 'camara', 'domo', '4k', '8mp', 'ia', 'microfono');
  if (word === 'lrt224' || word === 'lrt' || word === 'dualwan') variants.push('linksys', 'router', 'vpn', 'balanceador', 'failover', 'ipsec', 'openvpn');
  if (word === 'gs724tp' || word === 'gs724' || word === 'gs724tpv2') variants.push('netgear', 'switch', 'poe', 'prosafe', 'gigabit', 'sfp', 'rack');
  if (word === 'smartshunt' || word === 'shunt') variants.push('victron', 'bateria', 'monitor', 'bluetooth', 'soc', '500a', 'vedirect');
  if (word === 'tgp600' || word === 'kxtgp600') variants.push('panasonic', 'telefono', 'inalambrico', 'dect', 'sip', 'ip', 'base');
  if (word === 'ex2300c' || word === 'ex2300-c' || word === 'ex2300') variants.push('juniper', 'switch', 'poe', '12p', 'fanless', 'sfp', 'junos');
  if (word === 'gl12' || word === 'msz-gl12' || word === 'mszgl12') variants.push('mitsubishi', 'aire', 'inverter', 'split', '12000', 'seer', 'silencioso');
  if (word === 'mg5050' || word === 'magellan' || word === 'mg5050+') variants.push('paradox', 'alarma', 'inalambrico', 'panel', 'stayd', 'blueeye', '433mhz');
  if (word === 'logo' || word === '230rce' || word === 'logo230rce') variants.push('siemens', 'plc', 'controlador', 'rele', 'ethernet', 'modbus', 'automatizacion');
  if (word.endsWith('es') && word.length > 3) variants.push(word.slice(0, -2));
  if (word.endsWith('s') && word.length > 2) variants.push(word.slice(0, -1));
  if (word.endsWith('a') && word.length > 2) variants.push(word.slice(0, -1) + 'o');
  if (word.endsWith('o') && word.length > 2) variants.push(word.slice(0, -1) + 'a');
  if (word.endsWith('iones') && word.length > 5) variants.push(word.slice(0, -2));
  return [...new Set(variants)];
}

/**
 * Comparación resiliente de marcas:
 * - Insensible a mayúsculas/minúsculas y caracteres especiales/espacios
 * - Soporta equivalencias conocidas (UNV <-> Uniview, TP LINK <-> TP-Link)
 */
function matchesBrand(productBrand, targetBrand) {
  if (!targetBrand || targetBrand === 'all') return true;
  if (!productBrand) return false;
  const pb = String(productBrand).toLowerCase().trim();
  const tb = String(targetBrand).toLowerCase().trim();
  if (pb === tb) return true;
  const normP = pb.replace(/[^a-z0-9]/g, '');
  const normT = tb.replace(/[^a-z0-9]/g, '');
  if (normP === normT) return true;
  if ((normP === 'unv' && normT === 'uniview') || (normP === 'uniview' && normT === 'unv')) return true;
  if (normP === 'tplink' && normT === 'tplink') return true;
  if ((normP === 'tapo' && normT === 'tplink') || (normP === 'tplink' && normT === 'tapo')) return true;
  if ((normP === 'zkteco' && normT === 'zk') || (normP === 'zk' && normT === 'zkteco')) return true;
  if ((normP === 'westerndigital' && normT === 'wd') || (normP === 'wd' && normT === 'westerndigital')) return true;
  if ((normP.includes('schneider') || normP.includes('apc')) && (normT.includes('schneider') || normT.includes('apc'))) return true;
  if ((normP === 'victron' && normT === 'victronenergy') || (normP === 'victronenergy' && normT === 'victron')) return true;
  if ((normP === 'mitsubishi' && normT === 'mitsubishielectric') || (normP === 'mitsubishielectric' && normT === 'mitsubishi')) return true;
  if ((normP === 'juniper' && normT === 'junipernetworks') || (normP === 'junipernetworks' && normT === 'juniper')) return true;
  if ((normP === 'siemens' && normT === 'siemens') || (normP.includes('siemens') && normT.includes('siemens'))) return true;
  if ((normP === 'tesla' && normT === 'tesla') || (normP.includes('tesla') && normT.includes('tesla'))) return true;
  return false;
}
if (typeof window !== 'undefined') window.matchesBrand = matchesBrand;


/**
 * Búsqueda fuzzy: devuelve true si el query coincide
 * de forma tolerante con el texto objetivo.
 */
function fuzzyMatch(normalizedTarget, normalizedQuery) {
  if (normalizedQuery.length <= 3) {
    const targetWords = normalizedTarget.split(/\s+/);
    if (targetWords.includes(normalizedQuery)) return true;
  } else if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length >= 2);
  if (queryWords.length === 0) return false;
  return queryWords.every(qWord => {
    const variants = getStemVariants(qWord);
    return variants.some(variant => {
      if (variant.length <= 3) {
        const words = normalizedTarget.split(/\s+/);
        return words.includes(variant);
      }
      return normalizedTarget.includes(variant);
    });
  });
}

/**
 * Filtra un producto contra un query normalizado.
 * Devuelve un score (0 = no match, mayor = mejor match).
 */
function scoreProductMatch(product, normalizedQuery) {
  const title = normalizeSearch(product.title);
  const desc = normalizeSearch(product.desc);
  const category = normalizeSearch(product.category);
  const brand = normalizeSearch(product.brand);
  const specs = Array.isArray(product.specs) ? normalizeSearch(product.specs.join(' ')) : '';
  const combined = `${title} ${brand} ${category} ${desc} ${specs}`.trim();

  let score = 0;
  if (normalizedQuery.length <= 3) {
    const titleWords = title.split(/\s+/);
    const brandWords = brand.split(/\s+/);
    const catWords = category.split(/\s+/);
    if (brandWords.includes(normalizedQuery)) score += 100;
    if (titleWords.includes(normalizedQuery)) score += 80;
    if (catWords.includes(normalizedQuery)) score += 70;
  } else {
    const queryVariants = getStemVariants(normalizedQuery);
    const titleMatchesDirectly = title.includes(normalizedQuery) || queryVariants.some(v => v.length >= 4 && title.includes(v));

    if (titleMatchesDirectly) score += 100;
    else if (fuzzyMatch(title, normalizedQuery)) score += 60;
    if (title.startsWith(normalizedQuery)) score += 15;
    if (brand.includes(normalizedQuery)) score += 80;
    else if (fuzzyMatch(brand, normalizedQuery)) score += 40;
    if (category.includes(normalizedQuery) || queryVariants.some(v => v.length >= 4 && category.includes(v))) score += 70;
    else if (fuzzyMatch(category, normalizedQuery)) score += 35;
  }
  if (fuzzyMatch(desc, normalizedQuery)) score += 20;
  if (specs && fuzzyMatch(specs, normalizedQuery)) score += 25;

  // Si los términos de búsqueda están repartidos en varios campos (ej. "laptop dell", "teclado usb")
  if (score === 0 && fuzzyMatch(combined, normalizedQuery)) {
    score += 50;
  } else if (score > 0 && fuzzyMatch(combined, normalizedQuery)) {
    score += 15;
  }

  // Priorizar productos de energía reales al buscar "ups", "no break" o "inversor"
  if (/\b(ups|nobreak|inversor|inversores)\b/i.test(normalizedQuery)) {
    if (/\bups\b|regulaci|avr|forza|no-break|nobreak|inversor/i.test(title) || category.includes('energia') || brand.includes('forza')) {
      score += 75;
    }
    if (/aspiradora|sopladora|herramienta|taladro/i.test(title)) {
      score -= 100;
    }
  }

  // Priorizar lectores y gavetas al buscar términos de POS o códigos de barra
  if (/\b(pos|scanner|escaner|barcode|lector|cajon|gaveta)\b/i.test(normalizedQuery)) {
    if (/pos|lector|barcode|gaveta|cajon|termic/i.test(title) || category.includes('perifericos')) {
      score += 35;
    }
  }

  // Priorizar terminales biométricas y reloj ponchador al buscar biometrico, ponchador, reloj o asistencia
  if (/\b(biometrico|biometrica|biometricos|biometricas|ponchador|ponche|reloj|asistencia|facial|huella)\b/i.test(normalizedQuery)) {
    if (/terminal\s+biometrica|reloj\s+ponchador|facial|huella/i.test(title)) {
      score += 150;
    } else if (/biometric|asistencia/i.test(title)) {
      score += 90;
    } else if (brand.includes('zkteco') || category.includes('acceso')) {
      score += 30;
    }
  } else if (/\b(zkteco|zk)\b/i.test(normalizedQuery)) {
    if (/terminal\s+biometrica|reloj\s+ponchador|facial|huella/i.test(title)) {
      score += 90;
    } else if (brand.includes('zkteco')) {
      score += 70;
    }
  }

  // Priorizar discos duros de videovigilancia al buscar purple o almacenamiento cctv
  if (/\b(purple|purpura|cctv|surveillance)\b/i.test(normalizedQuery) || (/\b(disco|hdd)\b/i.test(normalizedQuery) && /\b(camara|camaras|cctv|dvr|xvr|seguridad)\b/i.test(normalizedQuery))) {
    if (/purple|purpura|surveillance|disco duro.*(cctv|videovigilancia)/i.test(title) || brand.includes('western')) {
      score += 70;
    }
  }

  // Priorizar gabinetes de red y racks de comunicaciones sobre PCs
  if (/\b(rack|gabinete)\b/i.test(normalizedQuery)) {
    if (/gabinete.*(9u|12u|42u|red|pared)|rack/i.test(title) || category.includes('redes') || category.includes('racks')) {
      score += 65;
    }
  }

  // Priorizar cerraduras magnéticas y electroimanes al buscar cerradura o electroimán
  if (/\b(electroiman|electroimanes|chapa|chapas)\b/i.test(normalizedQuery)) {
    if (/cerradura.*electromagnetica|electroiman|chapa\s*magnetica/i.test(title)) {
      score += 150;
    } else if (category.includes('acceso')) {
      score += 30;
    }
  } else if (/\b(cerradura|cerraduras)\b/i.test(normalizedQuery)) {
    if (/cerradura.*electromagnetica|electroiman|chapa\s*magnetica/i.test(title)) {
      score += 135;
    } else if (/\bcerradura\b/i.test(title)) {
      score += 90;
    } else if (category.includes('acceso')) {
      score += 30;
    }
  }

  // Priorizar pulsadores de salida No Touch al buscar pulsador o liberador
  if (/\b(pulsador|liberador|no touch|notouch|boton.*salida)\b/i.test(normalizedQuery)) {
    if (/pulsador.*salida|no touch|boton.*salida|liberador/i.test(title)) {
      score += 125;
    } else if (category.includes('acceso')) {
      score += 30;
    }
  }


  // Priorizar bobinas físicas de cable de red UTP Cat 6 (100% cobre) sobre CCA y servicios de reinstalación
  if (/\b(bobina|cable utp|rollo)\b/i.test(normalizedQuery) || (/\b(cable)\b/i.test(normalizedQuery) && /\b(cat6|cat 6|cobre|red|utp)\b/i.test(normalizedQuery))) {
    if (/bobina.*cable|cable.*utp.*cat\s*6.*cobre|cobre.*puro/i.test(title)) {
      score += 115;
    } else if (/bobina|cobre/i.test(title)) {
      score += 90;
    }
    if (/reinstalacion|servicio\s+de/i.test(title)) {
      score -= 80;
    }
  }

  // Priorizar sistemas Mesh TP-Link Deco al buscar deco, mesh o tplink
  if (/\b(deco|mesh|tplink|tp-link)\b/i.test(normalizedQuery)) {
    if (/deco.*x20|mesh.*tp-link|sistema.*mesh/i.test(title) || brand.includes('tp-link')) {
      score += 85;
    }
  }

  // Priorizar Patch Panels al buscar patch panel o panel de parcheo
  if (/(patch.*panel|panel.*parcheo)/i.test(normalizedQuery)) {
    if (/patch.*panel|panel.*parcheo/i.test(title)) {
      score += 120;
    } else if (category.includes('cableado') || category.includes('redes')) {
      score += 30;
    }
  }

  // Priorizar Patch Cords al buscar patch cord o latiguillo
  if (/(patch.*cord|patchcord|latiguillo)/i.test(normalizedQuery)) {
    if (/patch.*cord|patchcord|latiguillo/i.test(title)) {
      score += 120;
    } else if (category.includes('cableado') || category.includes('redes')) {
      score += 30;
    }
  }

  // Priorizar Puntos de Acceso / Access Points al buscar access point, ap o punto de acceso
  if (/(access.*point|\bap\b|punto.*acceso|unifi.*u6)/i.test(normalizedQuery)) {
    if (/punto.*acceso|access.*point|unifi.*u6/i.test(title) || /punto.*acceso/i.test(desc)) {
      score += 120;
    }
  }

  // Priorizar Conectores RJ45 al buscar conector rj45, plug rj45 o conectores
  if (/(conector|plug|terminales).*rj45|\b(conector|conectores|plugs?)\b/i.test(normalizedQuery)) {
    if (/pack.*100.*conector|conectores.*rj45.*cat/i.test(title)) {
      score += 180;
    } else if (/conector|rj45.*terminales/i.test(title) && !/patch\s*cord/i.test(title)) {
      score += 100;
    }
  }

  // Priorizar Kit de herramientas de red (crimpadora y tester) al buscar crimpadora, tester o herramienta de red
  if (/\b(crimpadora|crimpador|crimpar|tester|probador|pelacable|pelacables)\b/i.test(normalizedQuery) || (/\b(herramienta|kit)\b/i.test(normalizedQuery) && /\b(red|redes|rj45|cable)\b/i.test(normalizedQuery))) {
    if (/crimpadora|tester.*cable|kit.*herramientas.*red/i.test(title)) {
      score += 160;
    } else if (/herramienta|rj45.*tester/i.test(title)) {
      score += 80;
    }
  }

  // Priorizar cámaras Ezviz y cámaras Wi-Fi inteligentes al buscar ezviz, c6n, h3c o camara wifi
  if (/\b(ezviz|c6n|h3c)\b/i.test(normalizedQuery) || (/\b(camara|camaras)\b/i.test(normalizedQuery) && /\b(wifi|inalambrica|360)\b/i.test(normalizedQuery))) {
    if (/ezviz.*c6n|ezviz.*h3c|camara.*wi-?fi/i.test(title) || brand.toLowerCase().includes('ezviz')) {
      score += 150;
    }
  }

  // Priorizar MikroTik, RouterBOARD y balanceadores al buscar mikrotik, routerboard, hex o balanceador (SUG-M750G)
  if (/\b(mikrotik|routerboard|hex|rb750|rb750gr3|balanceador|balanceadores|multiwan)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'mikrotik') {
      score += 180;
    } else if (/mikrotik|rb750/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar periféricos Logitech (combo MK270 y webcam C920) al buscar logitech, combo inalámbrico, webcam o c920 (SUG-L2700, SUG-W9200)
  if (/\b(logitech|mk270|c920|webcam|camara\s+web)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'logitech') {
      score += 150;
    }
    if (/c920|webcam/i.test(normalizedQuery) && /c920|webcam/i.test(title)) {
      score += 100;
    }
    if (/mk270|combo/i.test(normalizedQuery) && /mk270|combo/i.test(title)) {
      score += 100;
    }
  }
  if (/\b(teclado.*inalambrico|mouse.*inalambrico|combo.*teclado|combo.*inalambrico)\b/i.test(normalizedQuery)) {
    if (/logitech.*mk270/i.test(title)) {
      score += 140;
    }
  }

  // Priorizar Lenovo y laptops ThinkPad al buscar lenovo, thinkpad, l14 (SUG-T1400)
  if (/\b(lenovo|thinkpad|ideapad|l14)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'lenovo') {
      score += 170;
    } else if (/lenovo|thinkpad/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Netgear y switches Gigabit al buscar netgear, gs308 (SUG-N308G)
  if (/\b(netgear|gs308)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'netgear') {
      score += 170;
    } else if (/netgear|gs308/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Schneider Electric / APC al buscar schneider, apc, bv1000, easy ups (SUG-S1000)
  if (/\b(schneider|apc|bv1000|easy\s*ups)\b/i.test(normalizedQuery)) {
    if (product.brand && (product.brand.toLowerCase().includes('schneider') || product.brand.toLowerCase().includes('apc'))) {
      score += 170;
    } else if (/schneider|apc|bv1000/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Linksys y routers Hydra Pro 6 al buscar linksys, hydra, velop (SUG-L8400)
  if (/\b(linksys|hydra|velop|ax5400)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'linksys') {
      score += 170;
    } else if (/linksys|hydra/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Victron Energy e inversores solares MultiPlus al buscar victron, multiplus, mppt (SUG-V2400)
  if (/\b(victron|multiplus|mppt|senoidal)\b/i.test(normalizedQuery) || (/\b(inversor|inversores)\b/i.test(normalizedQuery) && /\b(solar|solares|puro|onda)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('victron') || product.brand.toLowerCase().includes('energy'))) {
      score += 170;
    } else if (/victron|multiplus/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Paradox y sistemas de alarma Spectra al buscar paradox, spectra, sp4000, alarma, sensor pir (SUG-P5800)
  if (/\b(paradox|spectra|sp4000)\b/i.test(normalizedQuery) || (/\b(alarma|alarmas)\b/i.test(normalizedQuery) && !/\b(reloj)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'paradox') {
      score += 170;
    } else if (/paradox|spectra.*sp4000/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Panasonic y teléfonos IP al buscar panasonic, hdv130, kx-hdv130, telefono ip, pbx (SUG-P1300)
  if (/\b(panasonic|hdv130|kxhdv130|pbx)\b/i.test(normalizedQuery) || (/\b(telefono|telefonos)\b/i.test(normalizedQuery) && /\b(ip|sip)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'panasonic') {
      score += 170;
    } else if (/panasonic|hdv130/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Mitsubishi Electric y aires Inverter al buscar mitsubishi, msz, aire acondicionado, seer (SUG-M1800)
  if (/\b(mitsubishi|msz|mszgl18)\b/i.test(normalizedQuery) || (/\b(aire|aires)\b/i.test(normalizedQuery) && /\b(mitsubishi|inverter)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('mitsubishi')) {
      score += 170;
    } else if (/mitsubishi|msz-gl/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Juniper Networks y switches EX2300 al buscar juniper, ex2300, junos (SUG-J2300)
  if (/\b(juniper|ex2300|junos)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'juniper') {
      score += 170;
    } else if (/juniper|ex2300/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Siemens y breakers Sentron al buscar siemens, sentron, breaker, disyuntor (SUG-S3100)
  if (/\b(siemens|sentron|disyuntor)\b/i.test(normalizedQuery) || (/\b(breaker|breakers)\b/i.test(normalizedQuery) && /\b(siemens|industrial|sentron)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'siemens') {
      score += 170;
    } else if (/siemens|sentron/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Tesla y sistemas Powerwall al buscar tesla, powerwall, bateria solar (SUG-T1350)
  if (/\b(tesla|powerwall)\b/i.test(normalizedQuery) || (/\b(bateria|baterias)\b/i.test(normalizedQuery) && /\b(tesla|solar|powerwall)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'tesla') {
      score += 170;
    } else if (/tesla|powerwall/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Servidores Dell PowerEdge al buscar servidor, poweredge, t150, xeon (SUG-D1500)
  if (/\b(servidor|servidores|poweredge|t150|xeon)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'dell' && /poweredge|t150|servidor/i.test(title)) {
      score += 170;
    } else if (/poweredge|t150|servidor/i.test(title)) {
      score += 150;
    }
  }

  // Priorizar Terminales Ópticas ONT / ONU GPON al buscar onu, ont, gpon, terminal optica (SUG-O6100)
  if (/\b(onu|ont|gpon|ftth|scapc|terminal\s*optica)\b/i.test(normalizedQuery)) {
    if (/ont.*gpon|terminal.*optica/i.test(title)) {
      score += 170;
    } else if (/gpon|fibra/i.test(title)) {
      score += 140;
    }
  }

  // Priorizar Cámaras Solares 4G Autónomas al buscar camara solar, solar 4g, camara 4g (SUG-C4000)
  if (/\b(camara\s*solar|solar\s*4g|camara\s*4g)\b/i.test(normalizedQuery) || (/\b(camara|camaras)\b/i.test(normalizedQuery) && /\b(solar|4g|autonoma)\b/i.test(normalizedQuery))) {
    if (/camara.*solar.*4g/i.test(title)) {
      score += 170;
    } else if (/solar.*4g|camara.*solar/i.test(title)) {
      score += 140;
    }
  }

  // Priorizar Pantallas Comerciales Samsung Crystal UHD al buscar samsung, crystal, be55t, signage o pantalla 55 (SUG-S5500)
  if (/\b(samsung|crystal|be55t|signage)\b/i.test(normalizedQuery) || (/\b(pantalla|pantallas)\b/i.test(normalizedQuery) && /\b(samsung|55|comercial)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'samsung') {
      score += 170;
    }
  }

  // Priorizar Ubiquiti UniFi Cloud Gateway Ultra al buscar ubiquiti, unifi, ucg, cloud gateway o ultra (SUG-U1000)
  if (/\b(ubiquiti|unifi|ucg|cloud\s*gateway)\b/i.test(normalizedQuery)) {
    if (product.brand && product.brand.toLowerCase() === 'ubiquiti') {
      if (/ucg|cloud\s*gateway|ultra/i.test(title)) {
        score += 220;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Grabadores NVR Uniview al buscar uniview, unv, nvr, nvr301, poe 8ch o grabador ip (SUG-N3010)
  if (/\b(uniview|unv|nvr301)\b/i.test(normalizedQuery) || (/\b(nvr|grabador\s*ip)\b/i.test(normalizedQuery) && /\b(uniview|poe|8\s*canales)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('uniview') || product.brand.toLowerCase().includes('unv'))) {
      score += 170;
    }
  }

  // Priorizar Reguladores y Estabilizadores de voltaje al buscar estabilizador o regulador
  if (/\b(estabilizador|estabilizadores|regulador\s*de\s*voltaje)\b/i.test(normalizedQuery)) {
    if (/regulador.*voltaje|estabilizador/i.test(title)) {
      score += 160;
    }
  }

  // Priorizar HP ProBook 450 G10 al buscar hp, probook, 450 g10 (SUG-H4500)
  if (/\b(probook|450\s*g10|probook\s*450)\b/i.test(normalizedQuery) || (/\b(laptop|laptops)\b/i.test(normalizedQuery) && /\b(hp|probook)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'hp' && /probook/i.test(title)) {
      score += 220;
    } else if (/probook/i.test(title)) {
      score += 170;
    }
  }

  // Priorizar Impresora Láser HP LaserJet Pro MFP M428fdw al buscar laserjet, m428, m428fdw, hp laserjet (SUG-H4280)
  if (/\b(laserjet|m428|m428fdw)\b/i.test(normalizedQuery) || (/\b(impresora|impresoras|laser)\b/i.test(normalizedQuery) && /\b(hp|laserjet)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'hp' && /laserjet/i.test(title)) {
      score += 220;
    } else if (/laserjet|m428/i.test(title)) {
      score += 170;
    }
  }

  // Priorizar Switch Cisco Business CBS350 al buscar cbs350, cisco switch, switch cisco (SUG-C3500)
  if (/\b(cbs350|cbs35024t)\b/i.test(normalizedQuery) || (/\b(switch|switches)\b/i.test(normalizedQuery) && /\b(cisco|cbs350|administrable)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'cisco') {
      if (/cbs350/i.test(title)) {
        score += 220;
      } else {
        score += 160;
      }
    }
  }

  // Priorizar APC by Schneider Electric Easy UPS Online SRV 3000VA al buscar srv, srv3000, ups online, doble conversion (SUG-S3000)
  if (/\b(srv|srv3000|srv3ka|srv3000xla)\b/i.test(normalizedQuery) || (/\b(ups|nobreak)\b/i.test(normalizedQuery) && /\b(online|doble\s*conversion|3000va|2400w)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('schneider') || product.brand.toLowerCase().includes('apc'))) {
      if (/srv|online.*doble.*conversion/i.test(title)) {
        score += 230;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar MikroTik RB5009 Multi-WAN al buscar rb5009, rb5009ug, mikrotik router, router mikrotik, multiwan (SUG-M5009)
  if (/\b(rb5009|rb5009ug|multiwan)\b/i.test(normalizedQuery) || (/\b(router|enrutador)\b/i.test(normalizedQuery) && /\b(mikrotik|2\.5g|10g|sfp\+)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'mikrotik') {
      if (/rb5009/i.test(title)) {
        score += 230;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Lenovo ThinkCentre M70q Tiny Gen 4 al buscar m70q, thinkcentre, lenovo tiny, mini pc (SUG-L7000)
  if (/\b(m70q|thinkcentre|tiny)\b/i.test(normalizedQuery) || /\b(mini\s*pc|micro\s*pc|tiny\s*pc|minipc)\b/i.test(normalizedQuery) || (/\b(mini|micro|desktop|computadora)\b/i.test(normalizedQuery) && /\b(lenovo|tiny|m70q)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'lenovo') {
      if (/m70q|thinkcentre|tiny/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Cámara IP Uniview ColorHunter 4K al buscar colorhunter, uniview camara, camara uniview, ipc2128 (SUG-U4080)
  if (/\b(colorhunter|ipc2128|color\s*24\/7)\b/i.test(normalizedQuery) || (/\b(camara|camaras|ip)\b/i.test(normalizedQuery) && /\b(uniview|unv|colorhunter)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase() === 'uniview' || product.brand.toLowerCase() === 'unv')) {
      if (/colorhunter/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Switch Netgear ProSAFE GS308PP PoE+ al buscar gs308pp, gs308p, netgear poe, switch netgear (SUG-N308P)
  if (/\b(gs308pp|gs308p)\b/i.test(normalizedQuery) || (/\b(switch|switches)\b/i.test(normalizedQuery) && /\b(netgear|prosafe|poe\+?)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'netgear') {
      if (/gs308pp|poe\+/i.test(title)) {
        score += 230;
      } else {
        score += 160;
      }
    }
  }

  // Priorizar Controlador Solar Victron SmartSolar MPPT al buscar smartsolar, mppt, victron solar, victron mppt (SUG-V1030)
  if (/\b(smartsolar|mppt)\b/i.test(normalizedQuery) || (/\b(controlador|regulador)\b/i.test(normalizedQuery) && /\b(solar|mppt|victron)\b/i.test(normalizedQuery)) || (/\b(victron)\b/i.test(normalizedQuery) && /\b(solar|mppt)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('victron')) {
      if (/smartsolar|mppt/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Teléfono IP Ejecutivo Panasonic KX-HDV230 al buscar kxhdv230, hdv230, panasonic telefono, telefono panasonic (SUG-P2300)
  if (/\b(kxhdv230|hdv230)\b/i.test(normalizedQuery) || (/\b(telefono|telefonos)\b/i.test(normalizedQuery) && /\b(panasonic|ip|sip)\b/i.test(normalizedQuery)) || (/\b(panasonic)\b/i.test(normalizedQuery) && /\b(telefono|ip|sip)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'panasonic') {
      if (/hdv230/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Firewall y Gateway Juniper Networks SRX300 al buscar srx300, srx, juniper firewall, firewall juniper (SUG-J3000)
  if (/\b(srx300|srx)\b/i.test(normalizedQuery) || (/\b(firewall|gateway)\b/i.test(normalizedQuery) && /\b(juniper|srx|junos)\b/i.test(normalizedQuery)) || (/\b(juniper)\b/i.test(normalizedQuery) && /\b(firewall|gateway|vpn)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'juniper') {
      if (/srx300|firewall/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Contactor Industrial Siemens Sirius 3RT al buscar sirius, 3rt, siemens contactor, contactor siemens (SUG-S2500)
  if (/\b(sirius|3rt|3rt2026)\b/i.test(normalizedQuery) || (/\b(contactor|contactores)\b/i.test(normalizedQuery) && /\b(siemens|sirius|trifasico)\b/i.test(normalizedQuery)) || (/\b(siemens)\b/i.test(normalizedQuery) && /\b(contactor|sirius|motor)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'siemens') {
      if (/sirius|contactor/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Cargador Tesla Wall Connector Gen 3 al buscar wall connector, cargador tesla, tesla charger, cargador ev (SUG-T4800)
  if (/\b(wall\s*connector|cargador\s*tesla|tesla\s*charger|cargador\s*ev)\b/i.test(normalizedQuery) || (/\b(cargador|charger)\b/i.test(normalizedQuery) && /\b(tesla|ev|electrico)\b/i.test(normalizedQuery)) || (/\b(tesla)\b/i.test(normalizedQuery) && /\b(cargador|connector|wall)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'tesla') {
      if (/wall\s*connector/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Aire Acondicionado Cassette Mitsubishi Electric al buscar cassette mitsubishi, mitsubishi cassette, aire cassette, pla-m (SUG-M3600)
  if (/\b(cassette|plam|pla-m)\b/i.test(normalizedQuery) || (/\b(cassette)\b/i.test(normalizedQuery) && /\b(mitsubishi|aire|inverter|techo)\b/i.test(normalizedQuery)) || (/\b(mitsubishi)\b/i.test(normalizedQuery) && /\b(cassette|techo|36000)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'mitsubishi') {
      if (/cassette/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Módulo Comunicador IP Paradox IP150+ al buscar ip150, comunicador ip, paradox ip, modulo ip, insite gold (SUG-P1500)
  if (/\b(ip150|ip150\+|insite\s*gold)\b/i.test(normalizedQuery) || (/\b(comunicador|modulo)\b/i.test(normalizedQuery) && /\b(paradox|ip|internet)\b/i.test(normalizedQuery)) || (/\b(paradox)\b/i.test(normalizedQuery) && /\b(ip|comunicador|modulo)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'paradox') {
      if (/ip150/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Sistema Mesh Linksys Velop Pro 6E al buscar velop, velop pro, linksys velop, axe5400, wifi 6e (SUG-L6400)
  if (/\b(velop|axe5400|wifi\s*6e)\b/i.test(normalizedQuery) || (/\b(mesh)\b/i.test(normalizedQuery) && /\b(linksys|velop|6e)\b/i.test(normalizedQuery)) || (/\b(linksys)\b/i.test(normalizedQuery) && /\b(velop|mesh|6e)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'linksys') {
      if (/velop/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Cámara PTZ Exterior Ezviz H8c al buscar h8c, ptz ezviz, camara ptz, ezviz ptz, ezviz exterior (SUG-E8200)
  if (/\b(h8c)\b/i.test(normalizedQuery) || (/\b(ptz)\b/i.test(normalizedQuery) && /\b(ezviz|exterior|360)\b/i.test(normalizedQuery)) || (/\b(ezviz)\b/i.test(normalizedQuery) && /\b(ptz|h8c|exterior)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'ezviz') {
      if (/h8c|ptz/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Cámara de Videoconferencia Logitech MeetUp al buscar meetup, logitech meetup, videoconferencia (SUG-L9500)
  if (/\b(meetup)\b/i.test(normalizedQuery) || (/\b(videoconferencia|conferencia)\b/i.test(normalizedQuery) && /\b(logitech|meetup|sala)\b/i.test(normalizedQuery)) || (/\b(logitech)\b/i.test(normalizedQuery) && /\b(meetup|videoconferencia)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'logitech') {
      if (/meetup/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Cerradura Digital Inteligente ZKTeco TL400B al buscar tl400b, tl400, cerradura inteligente, cerradura zkteco (SUG-Z400B)
  if (/\b(tl400b|tl400)\b/i.test(normalizedQuery) || (/\b(cerradura)\b/i.test(normalizedQuery) && /\b(zkteco|inteligente|biometrica|tl400)\b/i.test(normalizedQuery)) || (/\b(zkteco)\b/i.test(normalizedQuery) && /\b(cerradura|tl400|puerta)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'zkteco') {
      if (/tl400b|cerradura\s*digital|cerradura\s*inteligente/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Punto de Acceso Ubiquiti UniFi 6 Pro al buscar u6 pro, u6-pro, unifi 6 pro, access point pro (SUG-U6800)
  if (/\b(u6\s*pro|u6-pro|u6pro)\b/i.test(normalizedQuery) || (/\b(pro)\b/i.test(normalizedQuery) && /\b(unifi|ubiquiti|u6)\b/i.test(normalizedQuery)) || (/\b(unifi\s*6\s*pro|unifi\s*pro)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'ubiquiti') {
      if (/u6-pro|unifi\s*6\s*pro/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Pantalla Interactiva Táctil Samsung Flip Pro al buscar flip pro, samsung flip, pantalla interactiva (SUG-S6500)
  if (/\b(flip\s*pro|samsung\s*flip|wm65b)\b/i.test(normalizedQuery) || (/\b(interactiva|tactil)\b/i.test(normalizedQuery) && /\b(samsung|pantalla|flip)\b/i.test(normalizedQuery)) || (/\b(samsung)\b/i.test(normalizedQuery) && /\b(flip|interactiva|pizarra)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'samsung') {
      if (/flip\s*pro|interactiva/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Estación de Trabajo Dell Precision 3660 al buscar precision, precision 3660, workstation, dell workstation (SUG-D3660)
  if (/\b(precision|precision\s*3660)\b/i.test(normalizedQuery) || (/\b(workstation|estacion\s*de\s*trabajo)\b/i.test(normalizedQuery) && /\b(dell|precision|rtx)\b/i.test(normalizedQuery)) || (/\b(dell)\b/i.test(normalizedQuery) && /\b(precision|workstation)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'dell') {
      if (/precision\s*3660|workstation/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Unidad PDU Administrable APC by Schneider Electric al buscar pdu, rack pdu, apc pdu, metered pdu (SUG-A7900)
  if (/\b(pdu|rack\s*pdu|metered\s*pdu|ap7900)\b/i.test(normalizedQuery) || (/\b(pdu)\b/i.test(normalizedQuery) && /\b(apc|schneider|rack|120v)\b/i.test(normalizedQuery)) || (/\b(apc|schneider)\b/i.test(normalizedQuery) && /\b(pdu|regleta\s*rack)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('schneider') || product.brand.toLowerCase().includes('apc'))) {
      if (/pdu|metered/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Terminal Facial Dahua IA al buscar dahua facial, reconocimiento facial, acceso facial, asi3213g (SUG-D4300)
  if (/\b(asi3213g|dahua\s*facial)\b/i.test(normalizedQuery) || (/\b(facial|rostro)\b/i.test(normalizedQuery) && /\b(dahua|acceso|asistencia|terminal)\b/i.test(normalizedQuery)) || (/\b(dahua)\b/i.test(normalizedQuery) && /\b(facial|reconocimiento\s*facial)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'dahua') {
      if (/facial|reconocimiento\s*facial/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Monitor UltraWide LG 34" al buscar ultrawide, monitor ultrawide, lg 34, 34wp500 (SUG-L3400)
  if (/\b(ultrawide|34wp500|34wp500-b)\b/i.test(normalizedQuery) || (/\b(ultrawide|panoramica)\b/i.test(normalizedQuery) && /\b(lg|monitor|pantalla)\b/i.test(normalizedQuery)) || (/\b(lg)\b/i.test(normalizedQuery) && /\b(34|ultrawide)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'lg') {
      if (/ultrawide|34wp500/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Router MikroTik hAP ax³ Wi-Fi 6 al buscar hap ax3, ax3, mikrotik wifi 6, c53uig (SUG-M5300)
  if (/\b(hap\s*ax3|hap\s*ax³|ax3|ax³|c53uig)\b/i.test(normalizedQuery) || (/\b(wifi\s*6|ax1800)\b/i.test(normalizedQuery) && /\b(mikrotik|hap)\b/i.test(normalizedQuery)) || (/\b(mikrotik)\b/i.test(normalizedQuery) && /\b(ax3|wifi\s*6|inalambrico)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'mikrotik') {
      if (/hap\s*ax|ax1800/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Switch Cisco Business CBS350-8P al buscar cbs350 8p, cbs350-8p, switch cisco poe 8 puertos (SUG-C3508)
  if (/\b(cbs350-8p|cbs350\s*8p|cbs350-8p-e-2g)\b/i.test(normalizedQuery) || (/\b(cbs350)\b/i.test(normalizedQuery) && /\b(8p|poe|67w)\b/i.test(normalizedQuery)) || (/\b(cisco)\b/i.test(normalizedQuery) && /\b(8p|8\s*puertos)\b/i.test(normalizedQuery) && /\b(poe|cbs350)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'cisco') {
      if (/cbs350-8p|8\s*puertos\s*gigabit\s*poe/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Sistema UPS APC Smart-UPS SMT1500C al buscar smt1500c, smart-ups 1500, apc 1500, ups senoidal puro (SUG-A1500)
  if (/\b(smt1500c|smt1500|smart-ups\s*1500|smart\s*ups\s*1500|apc\s*1500)\b/i.test(normalizedQuery) || (/\b(senoidal|pfc)\b/i.test(normalizedQuery) && /\b(apc|ups|smart-ups)\b/i.test(normalizedQuery)) || (/\b(smartconnect)\b/i.test(normalizedQuery) && /\b(apc|ups|schneider)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('schneider') || product.brand.toLowerCase().includes('apc'))) {
      if (/smart-ups|smt1500/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Laptop Corporativa Lenovo ThinkPad E16 al buscar thinkpad e16, e16, lenovo 16, laptop teclado numerico (SUG-L1600)
  if (/\b(thinkpad\s*e16|e16|lenovo\s*16|e16\s*gen)\b/i.test(normalizedQuery) || (/\b(thinkpad)\b/i.test(normalizedQuery) && /\b(16|e16|numerico)\b/i.test(normalizedQuery)) || (/\b(lenovo)\b/i.test(normalizedQuery) && /\b(e16|16\s*pulgadas|teclado\s*numerico)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'lenovo') {
      if (/thinkpad\s*e16|e16\s*gen/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Punto de Acceso TP-Link Omada EAP653 al buscar omada, eap653, omada wifi 6, ap techo (SUG-T6530)
  if (/\b(omada|eap653|eap-653)\b/i.test(normalizedQuery) || (/\b(omada)\b/i.test(normalizedQuery) && /\b(ap|wifi\s*6|ax3000|techo)\b/i.test(normalizedQuery)) || (/\b(tp-link|tplink)\b/i.test(normalizedQuery) && /\b(omada|eap653)\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('tp-link') || product.brand.toLowerCase().includes('tplink'))) {
      if (/omada\s*eap653|eap653/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Impresora Epson EcoTank L5590 al buscar l5590, epson l5590, ecotank adf, impresora con adf (SUG-E5590)
  if (/\b(l5590|epson\s*l5590|ecotank\s*l5590)\b/i.test(normalizedQuery) || (/\b(ecotank|epson)\b/i.test(normalizedQuery) && /\b(adf|l5590|ethernet)\b/i.test(normalizedQuery)) || (/\b(impresora)\b/i.test(normalizedQuery) && /\b(l5590|adf\s*red)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'epson') {
      if (/l5590|ecotank\s*l5590/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Cámara IP Hikvision AcuSense 4K al buscar acusense, 2cd2183g2, hikvision 4k, camara acusense (SUG-H8240)
  if (/\b(acusense|2cd2183g2|ds-2cd2183g2|2cd2183g2-iu)\b/i.test(normalizedQuery) || (/\b(acusense)\b/i.test(normalizedQuery) && /\b(4k|hikvision|domo|camara)\b/i.test(normalizedQuery)) || (/\b(hikvision)\b/i.test(normalizedQuery) && /\b(acusense|4k\s*8mp|domo\s*ia)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'hikvision') {
      if (/acusense|2cd2183g2/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Router VPN Dual-WAN Linksys LRT224 al buscar lrt224, linksys vpn, dual wan, router balanceador (SUG-L2240)
  if (/\b(lrt224|lrt-224|dualwan|dual-wan)\b/i.test(normalizedQuery) || (/\b(balanceador|failover)\b/i.test(normalizedQuery) && /\b(linksys|router|vpn)\b/i.test(normalizedQuery)) || (/\b(linksys)\b/i.test(normalizedQuery) && /\b(vpn|lrt224|dual\s*wan)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'linksys') {
      if (/lrt224|dual-wan/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Switch Netgear Smart Pro GS724TPv2 24P PoE+ al buscar gs724tp, gs724, netgear 24, switch 24 puertos poe (SUG-N7240)
  if (/\b(gs724tp|gs724tpv2|gs724)\b/i.test(normalizedQuery) || (/\b(switch|switches)\b/i.test(normalizedQuery) && /\b(netgear)\b/i.test(normalizedQuery) && /\b(24|poe|sfp)\b/i.test(normalizedQuery)) || (/\b(netgear)\b/i.test(normalizedQuery) && /\b(24\s*puertos|gs724|poe\+?)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'netgear') {
      if (/gs724tp|24\s*puertos\s*gigabit\s*poe/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Monitor de Baterías Victron SmartShunt al buscar smartshunt, shunt victron, monitor bateria, shunt 500a (SUG-V5000)
  if (/\b(smartshunt|shunt|500a)\b/i.test(normalizedQuery) || (/\b(monitor|medidor)\b/i.test(normalizedQuery) && /\b(bateria|baterias|victron|soc)\b/i.test(normalizedQuery)) || (/\b(victron)\b/i.test(normalizedQuery) && /\b(shunt|smartshunt|bateria|soc)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('victron')) {
      if (/smartshunt|shunt/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Teléfono Inalámbrico DECT IP Panasonic KX-TGP600 al buscar tgp600, kxtgp600, panasonic dect, telefono inalambrico ip (SUG-P6000)
  if (/\b(tgp600|kxtgp600|kx-tgp600)\b/i.test(normalizedQuery) || (/\b(dect|inalambrico)\b/i.test(normalizedQuery) && /\b(panasonic|sip|ip|telefono)\b/i.test(normalizedQuery)) || (/\b(panasonic)\b/i.test(normalizedQuery) && /\b(tgp600|dect|inalambrico)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'panasonic') {
      if (/tgp600|dect\s*ip/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Switch Fanless Juniper Networks EX2300-C-12P al buscar ex2300-c, ex2300c, juniper 12, switch juniper poe (SUG-J2312)
  if (/\b(ex2300-c|ex2300c|ex2300-c-12p)\b/i.test(normalizedQuery) || (/\b(juniper)\b/i.test(normalizedQuery) && /\b(12|fanless|poe|switch)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'juniper') {
      if (/ex2300-c|12\s*puertos/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Aire Acondicionado Mitsubishi MSZ-GL 12,000 BTU al buscar msz-gl12, gl12, mitsubishi 12000, aire mitsubishi 12k (SUG-M1200)
  if (/\b(msz-gl12|mszgl12|gl12)\b/i.test(normalizedQuery) || (/\b(mitsubishi)\b/i.test(normalizedQuery) && /\b(12000|12k|gl12|gl-12)\b/i.test(normalizedQuery)) || (/\b(aire|inverter)\b/i.test(normalizedQuery) && /\b(mitsubishi)\b/i.test(normalizedQuery) && /\b(12|12000|12k)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'mitsubishi') {
      if (/12000|12k|gl12|mszgl.*12/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Panel de Alarma Inalámbrico Paradox Magellan MG5050+ al buscar mg5050, magellan, paradox inalambrico (SUG-P5050)
  if (/\b(mg5050|mg5050\+|magellan)\b/i.test(normalizedQuery) || (/\b(paradox)\b/i.test(normalizedQuery) && /\b(magellan|mg5050|inalambrico|alarma)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'paradox') {
      if (/mg5050|magellan/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar Micro-PLC Siemens LOGO! 230RCE al buscar logo 230rce, 230rce, siemens logo, plc siemens, controlador logo (SUG-S8300)
  if (/\b(230rce|logo230rce)\b/i.test(normalizedQuery) || (/\b(siemens)\b/i.test(normalizedQuery) && /\b(logo|plc|controlador|automatizacion)\b/i.test(normalizedQuery)) || (/\b(logo)\b/i.test(normalizedQuery) && /\b(siemens|plc|controlador|rele)\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase() === 'siemens') {
      if (/logo!?|230rce|micro-plc/i.test(title)) {
        score += 240;
      } else {
        score += 170;
      }
    }
  }

  // Priorizar sillas y asientos reales sobre materiales auxiliares (ej. masilla de pared)
  if (/\b(sillas?|sillones?|ergonomica?s?)\b/i.test(normalizedQuery)) {
    if (/\b(sillas?|sillones?|ergonomica?s?)\b/i.test(title)) {
      score += 50;
    }
    if (/masilla/i.test(title)) {
      score -= 60;
    }
  }

  // Priorizar máquinas y computadoras principales sobre accesorios (cables, conectores) si la búsqueda es de computadoras
  if (/computador|laptop|escritorio|desktop|pc/i.test(normalizedQuery)) {
    if (/computadora|desktop|laptop|optiplex|latitude|thinkcentre|elitebook/i.test(title)) {
      score += 35;
    }
    if (/^cables?\b|^adaptador|^convertidor|^patch\s*cord/i.test(title) || /cables?\s+y\s+adaptadores/i.test(category)) {
      score -= 30;
    }
  }

  // Para consultas largas (3 o más palabras), puntuar según la proporción de términos coincidentes
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length >= 2);
  if (queryWords.length >= 3) {
    let matchedWords = 0;
    queryWords.forEach(qWord => {
      const variants = getStemVariants(qWord);
      const matched = variants.some(variant => {
        if (variant.length <= 3) {
          return combined.split(/\s+/).includes(variant);
        }
        return combined.includes(variant);
      });
      if (matched) matchedWords++;
    });

    const matchRatio = matchedWords / queryWords.length;
    if (matchedWords >= 3 && matchRatio >= 0.35) {
      score += Math.round(matchRatio * 90) + (matchedWords * 8);
    }
  }

  return score;
}


/* -------------------------------------------------------------
   1. ESTADO GLOBAL Y CONFIGURACIÓN
   ------------------------------------------------------------- */

// Estado de la UI
const state = {
  dept: 'all',
  category: 'all',
  brand: 'all',
  availability: 'all',
  sort: 'relevance',
  searchQuery: null,
  page: 0,
  pageSize: 20,
  currentProducts: [], // productos actualmente visibles
  allFilteredProducts: [], // todos los productos filtrados
  minPrice: 0,
  maxPrice: 9999999
};

function getExplicitAvailability(product) {
  const raw = normalizeSearch(product?.availability || product?.stockStatus || product?.status || '');
  const stock = Number(product?.stock);
  if (Number.isFinite(stock) && stock > 0) return 'available';
  if (/(disponible|en stock|instock)/.test(raw)) return 'available';
  if (/(agotado|sin stock|outofstock)/.test(raw) || stock === 0) return 'unavailable';
  return 'unknown';
}

function getAvailabilityLabel(product) {
  if (isServiceItem(product)) return 'Evaluación previa';
  const availability = getExplicitAvailability(product);
  if (availability === 'available') return 'Disponible';
  if (availability === 'unavailable') return 'No disponible';
  return 'Consultar disponibilidad';
}

function sortCatalogProducts(products) {
  const list = products.slice();
  if (state.sort === 'name-asc') {
    list.sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'es'));
  } else if (state.sort === 'name-desc') {
    list.sort((a, b) => String(b.title || '').localeCompare(String(a.title || ''), 'es'));
  } else if (state.sort === 'price-asc') {
    list.sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      const hasA = Number.isFinite(priceA) && priceA > 0;
      const hasB = Number.isFinite(priceB) && priceB > 0;
      if (!hasA && !hasB) return String(a.title || '').localeCompare(String(b.title || ''), 'es');
      if (!hasA) return 1;
      if (!hasB) return -1;
      if (priceA !== priceB) return priceA - priceB;
      return String(a.title || '').localeCompare(String(b.title || ''), 'es');
    });
  } else if (state.sort === 'price-desc') {
    list.sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      const valA = Number.isFinite(priceA) && priceA > 0 ? priceA : 0;
      const valB = Number.isFinite(priceB) && priceB > 0 ? priceB : 0;
      if (valB !== valA) return valB - valA;
      return String(a.title || '').localeCompare(String(b.title || ''), 'es');
    });
  }
  return list;
}

function applyAvailabilityFilter(products) {
  if (state.availability === 'all') return products;
  return products.filter((product) => getExplicitAvailability(product) === state.availability);
}

function syncCatalogUrl() {
  if (!window.location.pathname.toLowerCase().includes('catalogo')) return;
  const params = new URLSearchParams();
  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.dept !== 'all') params.set('cat', state.dept);
  if (state.category !== 'all') params.set('category', state.category);
  if (state.brand !== 'all') params.set('brand', state.brand);
  if (state.availability !== 'all') params.set('availability', state.availability);
  if (state.sort !== 'relevance') params.set('sort', state.sort);
  if (state.minPrice > 0) params.set('min', String(state.minPrice));
  if (state.maxPrice < 9999999) params.set('max', String(state.maxPrice));
  const query = params.toString();
  try {
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  } catch (e) {}
}

function populateBrandFilter() {
  const selects = document.querySelectorAll('[data-catalog-brand-filter]');
  const preferredNames = {
    dell: 'Dell',
    hp: 'HP',
    lenovo: 'Lenovo',
    epson: 'Epson',
    tgm: 'TGM',
    lg: 'LG',
    asus: 'ASUS',
    acer: 'Acer',
    apple: 'Apple',
    intel: 'Intel',
    gigabyte: 'Gigabyte',
    dahua: 'Dahua',
    hikvision: 'Hikvision',
    cisco: 'Cisco',
    ubiquiti: 'Ubiquiti',
    forza: 'Forza',
    samsung: 'Samsung',
    'tp link': 'TP-Link',
    tplink: 'TP-Link',
    unv: 'Uniview',
    uniview: 'Uniview',
    grandstream: 'Grandstream',
    zkteco: 'ZKTeco',
    zk: 'ZKTeco',
    westerndigital: 'Western Digital',
    wd: 'Western Digital',
    ezviz: 'Ezviz',
    mikrotik: 'MikroTik',
    logitech: 'Logitech',
    lenovo: 'Lenovo',
    netgear: 'Netgear',
    'schneider electric': 'Schneider Electric',
    schneiderelectric: 'Schneider Electric',
    schneider: 'Schneider Electric',
    apc: 'Schneider Electric',
    linksys: 'Linksys',
    'victron energy': 'Victron Energy',
    victronenergy: 'Victron Energy',
    victron: 'Victron Energy',
    paradox: 'Paradox',
    panasonic: 'Panasonic',
    mitsubishi: 'Mitsubishi',
    'mitsubishi electric': 'Mitsubishi',
    mitsubishielectric: 'Mitsubishi',
    juniper: 'Juniper',
    'juniper networks': 'Juniper',
    junipernetworks: 'Juniper',
    siemens: 'Siemens',
    tesla: 'Tesla'
  };
  const rawBrands = getCatalogDb().map((product) => String(product.brand || '').trim()).filter(Boolean);
  const brandMap = new Map();
  rawBrands.forEach((b) => {
    const key = b.toLowerCase();
    const cleanKey = key.replace(/[^a-z0-9]/g, '');
    const preferred = preferredNames[key] || preferredNames[cleanKey] || b;
    const prefKey = preferred.toLowerCase();
    if (!brandMap.has(prefKey)) {
      brandMap.set(prefKey, preferred);
    }
  });
  const brands = Array.from(brandMap.values()).sort((a, b) => a.localeCompare(b, 'es'));
  if (selects.length) {
    selects.forEach((select) => {
      const current = select.value || state.brand;
      select.innerHTML = '<option value="all">Todas las marcas</option>' + brands
        .map((brand) => `<option value="${escapeHTML(brand)}">${escapeHTML(brand)}</option>`)
        .join('');
      select.value = brands.includes(current) ? current : 'all';
    });
  }
  renderQuickFilterChips(brands);
}

function renderQuickFilterChips(brands) {
  const container = document.getElementById('catalog-quick-chips');
  const sheetContainer = document.getElementById('mobile-sheet-brand-chips');
  if (!container && !sheetContainer) return;

  const currentBrand = (state.brand || 'all').toLowerCase();
  const isAvail = state.availability === 'available';

  const priorityList = ['Dell', 'HP', 'Lenovo', 'Apple', 'LG', 'Epson', 'TGM', 'Cisco', 'Ubiquiti', 'MikroTik', 'Netgear', 'Logitech', 'Forza', 'Schneider Electric', 'Linksys', 'Victron Energy', 'Siemens', 'Tesla', 'Paradox', 'Panasonic', 'Mitsubishi', 'Juniper', 'TP-Link', 'Hikvision', 'Dahua', 'ZKTeco', 'Western Digital', 'Ezviz', 'Samsung', 'Uniview'];
  const orderedBrands = [...brands].sort((a, b) => {
    const idxA = priorityList.findIndex((p) => p.toLowerCase() === a.toLowerCase());
    const idxB = priorityList.findIndex((p) => p.toLowerCase() === b.toLowerCase());
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b, 'es');
  });

  if (container) {
    let html = `
      <button type="button" class="catalog-chip catalog-chip--avail ${isAvail ? 'is-active' : ''}" data-quick-avail="available" aria-pressed="${isAvail}" title="Ver solo productos registrados como disponibles">
        <i data-lucide="check-circle-2"></i>
        <span>En Stock</span>
      </button>
      <div class="catalog-quick-divider" aria-hidden="true"></div>
      <button type="button" class="catalog-chip ${currentBrand === 'all' ? 'is-active' : ''}" data-quick-brand="all" aria-pressed="${currentBrand === 'all'}">
        <span>Todas las marcas</span>
      </button>
    `;

    orderedBrands.forEach((brand) => {
      const active = currentBrand === brand.toLowerCase();
      html += `
        <button type="button" class="catalog-chip ${active ? 'is-active' : ''}" data-quick-brand="${escapeHTML(brand)}" aria-pressed="${active}">
          <span>${escapeHTML(brand)}</span>
        </button>
      `;
    });

    container.innerHTML = html;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ root: container });
    }
  }

  if (sheetContainer) {
    let sheetHtml = `
      <button type="button" class="catalog-chip ${currentBrand === 'all' ? 'is-active' : ''}" data-quick-brand="all" aria-pressed="${currentBrand === 'all'}">
        <span>Todas</span>
      </button>
    `;
    orderedBrands.forEach((brand) => {
      const active = currentBrand === brand.toLowerCase();
      sheetHtml += `
        <button type="button" class="catalog-chip ${active ? 'is-active' : ''}" data-quick-brand="${escapeHTML(brand)}" aria-pressed="${active}">
          <span>${escapeHTML(brand)}</span>
        </button>
      `;
    });
    sheetContainer.innerHTML = sheetHtml;
  }

  bindQuickFilterEvents();
}

function bindQuickFilterEvents() {
  document.querySelectorAll('[data-quick-brand]').forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const targetBrand = btn.dataset.quickBrand;
      if (state.brand.toLowerCase() === targetBrand.toLowerCase() && targetBrand !== 'all') {
        state.brand = 'all';
      } else {
        state.brand = targetBrand;
      }
      state.page = 0;
      const selects = document.querySelectorAll('[data-catalog-brand-filter]');
      selects.forEach(s => { s.value = state.brand; });
      syncQuickFilterChips();
      renderUI();
      if (isMobileFilterSheetOpen()) closeMobileFilters();
    };
  });

  document.querySelectorAll('[data-quick-avail]').forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      if (state.availability === 'available') {
        state.availability = 'all';
      } else {
        state.availability = 'available';
      }
      state.page = 0;
      const selects = document.querySelectorAll('[data-catalog-availability-filter]');
      selects.forEach(s => { s.value = state.availability; });
      syncQuickFilterChips();
      renderUI();
    };
  });
}

function syncQuickFilterChips() {
  const currentBrand = (state.brand || 'all').toLowerCase();
  const isAvail = state.availability === 'available';

  document.querySelectorAll('[data-quick-brand]').forEach((btn) => {
    const b = (btn.dataset.quickBrand || 'all').toLowerCase();
    const isActive = b === currentBrand;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('[data-quick-avail]').forEach((btn) => {
    btn.classList.toggle('is-active', isAvail);
    btn.setAttribute('aria-pressed', isAvail ? 'true' : 'false');
  });
}

function renderInlineAddButtonHTML(productId, variant = 'default') {
  const qty = window.FutunetCart ? window.FutunetCart.getItemQty(productId) : 0;
  const compact = variant === 'compact';
  if (qty > 0) {
    if (compact) {
      return `
        <div class="inline-cart-control inline-cart-control--compact">
          <button class="inline-qty-btn inline-qty-btn--compact" type="button" data-inline-change="-1" data-product-id="${escapeHTML(productId)}" aria-label="Quitar una unidad"><i data-lucide="minus"></i></button>
          <span class="inline-qty-readout inline-qty-readout--compact">
            <span class="inline-qty-count">${qty}</span>
          </span>
          <button class="inline-qty-btn inline-qty-btn--compact" type="button" data-inline-change="1" data-product-id="${escapeHTML(productId)}" aria-label="Agregar una unidad"><i data-lucide="plus"></i></button>
        </div>
      `;
    }
    return `
      <div class="inline-cart-control">
        <button class="inline-qty-btn" type="button" data-inline-change="-1" data-product-id="${escapeHTML(productId)}"><i data-lucide="minus"></i></button>
        <span class="inline-qty-readout">
          <span class="inline-qty-count">${qty}</span>
          <span class="inline-qty-label">en carrito</span>
        </span>
        <button class="inline-qty-btn" type="button" data-inline-change="1" data-product-id="${escapeHTML(productId)}"><i data-lucide="plus"></i></button>
      </div>
    `;
  }
  if (compact) {
    return `
      <button class="inline-add-btn product-add-btn product-add-btn--compact" type="button" data-product-id="${escapeHTML(productId)}" aria-label="Agregar al carrito">
        <span class="product-add-btn__icon-wrap product-add-btn__icon-wrap--compact"><i data-lucide="shopping-cart"></i></span>
        <span class="product-add-btn__text product-add-btn__text--compact">Agregar</span>
      </button>
    `;
  }

  return `
    <button class="inline-add-btn product-add-btn" type="button" data-product-id="${escapeHTML(productId)}">
      <span class="product-add-btn__icon-wrap"><i data-lucide="shopping-cart"></i></span>
      <span class="product-add-btn__text">Agregar al carrito</span>
    </button>
  `;
}

function updateInlineCartButtons() {
  document.querySelectorAll('[data-product-add]').forEach(container => {
    const productId = container.dataset.productAdd;
    const variant = container.dataset.productAddVariant || 'default';
    container.innerHTML = renderInlineAddButtonHTML(productId, variant);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ root: container });
    }
  });
}

function buildVisualTileGrid(items, compact = false) {
  const grid = document.createElement('div');
  grid.className = `cubiculos-grid reveal in${compact ? ' cubiculos-grid--compact' : ''}`;

  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `cubiculo-card${compact ? ' cubiculo-card--compact' : ''}`;
    card.style.backgroundImage = `url('${item.image}')`;
    card.style.animationDelay = `${i * 80}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', item.ariaLabel || item.title);
    card.addEventListener('click', item.onSelect);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.onSelect();
      }
    });
    card.innerHTML = `
      <div class="cubiculo-info">
        <h4 class="cubiculo-title">${escapeHTML(item.title)}</h4>
        <span class="cubiculo-count">${escapeHTML(item.meta)}</span>
      </div>
    `;
    grid.appendChild(card);
  });

  return grid;
}

function buildSubcategoryGrid(categoriesGroups, compact = false) {
  return buildVisualTileGrid(
    Object.keys(categoriesGroups).map((catName) => ({
      title: catName,
      meta: getCategoryCountLabel(catName, categoriesGroups[catName]),
      image: getFallbackImg(catName),
      onSelect: () => setCategory(catName),
      ariaLabel: `Abrir subcategoría ${catName}`
    })),
    compact
  );
}

function renderMobileVisualBrowserSection({ title, description, items }) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !items.length) return;

  const section = document.createElement('section');
  section.className = 'catalog-mobile-explorer reveal in';
  section.innerHTML = `
    <div class="catalog-mobile-explorer__header">
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
    </div>
  `;
  section.appendChild(buildVisualTileGrid(items, true));
  container.appendChild(section);
}

function renderCompactMobileCatalogView() {
  if (!isCompactMobileViewport()) return false;

  if (state.searchQuery) {
    const q = normalizeSearch(state.searchQuery);
    let results = getCatalogDb()
      .map(p => ({ product: p, score: scoreProductMatch(p, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.product);

    if (state.dept !== 'all') results = results.filter(p => p.department === state.dept);
    if (state.category !== 'all') results = results.filter(p => p.category === state.category);
    if (state.brand !== 'all') results = results.filter(p => matchesBrand(p.brand, state.brand));
    results = results.filter((product) => {
      if (isServiceItem(product)) return true;
      const price = parsePrice(product.price);
      return price >= state.minPrice && price <= state.maxPrice;
    });
    results = sortCatalogProducts(applyAvailabilityFilter(results));

    updateCatalogContextBar({
      title: 'Resultados',
      description: `${results.length} coincidencia${results.length !== 1 ? 's' : ''} para "${state.searchQuery}".`,
      resultsLabel: `${results.length} coincidencia${results.length !== 1 ? 's' : ''}`,
      activeLabel: `Busqueda activa: ${state.searchQuery}`,
      canReset: true
    });

    if (results.length === 0) {
      renderEmptyState(
        'Sin resultados',
        'No encontramos productos con esos terminos. Intenta con otras palabras o explora las categorias.'
      );
    } else {
      state.allFilteredProducts = results;
      state.page = 0;
      renderPaginatedProducts();
    }
    return true;
  }

  let db = getCatalogDb();
  if (state.dept !== 'all') db = db.filter(p => p.department === state.dept);
  if (state.brand !== 'all') db = db.filter(p => matchesBrand(p.brand, state.brand));
  db = db.filter((product) => {
    if (isServiceItem(product)) return true;
    const price = parsePrice(product.price);
    return price >= state.minPrice && price <= state.maxPrice;
  });
  db = sortCatalogProducts(applyAvailabilityFilter(db));

  // Si hay una marca filtrada o filtro de disponibilidad activo, mostrar productos directamente
  if (state.brand !== 'all' || (state.availability !== 'all' && state.dept === 'all' && state.category === 'all')) {
    const brandLabel = state.brand !== 'all' ? `Marca: ${state.brand}` : 'Disponibles';
    updateCatalogContextBar({
      title: state.brand !== 'all' ? state.brand : 'Productos Disponibles',
      description: `${db.length} producto${db.length !== 1 ? 's' : ''} para tu selección.`,
      resultsLabel: `${db.length} producto${db.length !== 1 ? 's' : ''}`,
      activeLabel: brandLabel,
      canReset: true
    });

    if (db.length === 0) {
      renderEmptyState(
        'Sin resultados',
        'No encontramos productos con los filtros seleccionados. Prueba con otra marca o limpia los filtros.'
      );
    } else {
      state.allFilteredProducts = db;
      state.page = 0;
      renderPaginatedProducts();
    }
    return true;
  }

  if (state.category === 'all') {
    if (state.dept === 'all') {
      const deptItems = mobileDeptOrder
        .map((deptKey) => {
          const deptProducts = db.filter((product) => product.department === deptKey);
          if (!deptProducts.length) return null;
          return {
            title: getDeptDisplayName(deptKey),
            meta: getDeptCountLabel(deptProducts.length),
            image: getDeptFallbackImg(deptKey),
            onSelect: () => {
              filterCat(deptKey, null);
              scrollCatalogToTop();
            },
            ariaLabel: `Abrir área ${getDeptDisplayName(deptKey)}`
          };
        })
        .filter(Boolean);

      updateCatalogContextBar({
        title: 'Áreas del catálogo',
        description: 'Entra por departamento y luego navega por subcategorías con una vista más limpia.',
        resultsLabel: `${deptItems.length} áreas`,
        activeLabel: `${db.length} artículos listos para explorar`,
        canReset: false
      });

      renderMobileVisualBrowserSection({
        title: 'Explora por área',
        description: 'Toca un departamento para abrir sus subcategorías y navegar de forma más ordenada.',
        items: deptItems
      });
      return true;
    }

    const categoriesGroups = {};
    db.forEach((product) => {
      if (!categoriesGroups[product.category]) categoriesGroups[product.category] = [];
      categoriesGroups[product.category].push(product);
    });

    const sortedCategories = sortEntriesBySize(categoriesGroups);

    updateCatalogContextBar({
      title: getDeptDisplayName(state.dept),
      description: 'Selecciona una subcategoría y luego entra a sus productos con una vista más clara.',
      resultsLabel: `${sortedCategories.length} subcategorías`,
      activeLabel: `${db.length} artículos en ${getDeptDisplayName(state.dept)}`,
      canReset: true
    });

    renderMobileVisualBrowserSection({
      title: 'Explora por subcategoría',
      description: 'Entra al grupo exacto que necesitas antes de ver los productos.',
      items: sortedCategories.map(([categoryName, products]) => ({
        title: categoryName,
        meta: getCategoryCountLabel(categoryName, products.length),
        image: getFallbackImg(categoryName),
        onSelect: () => setCategory(categoryName),
        ariaLabel: `Abrir subcategoría ${categoryName}`
      }))
    });
    return true;
  }

  const catDb = db.filter(p => p.category === state.category);

  updateCatalogContextBar({
    title: state.category,
    description: getCategoryHeaderDescription(state.category, catDb.length),
    resultsLabel: `${catDb.length} resultado${catDb.length !== 1 ? 's' : ''}`,
    activeLabel: `En ${getDeptDisplayName(state.dept)}`,
    canReset: true
  });

  const brandsGroups = {};
  catDb.forEach(p => {
    if (!brandsGroups[p.brand]) brandsGroups[p.brand] = [];
    brandsGroups[p.brand].push(p);
  });

  for (const [brandName, brandProducts] of sortEntriesBySize(brandsGroups)) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'brand-header reveal in';
    headerDiv.innerHTML = `
      <div class="brand-header-tag">
        ${getGroupHeaderLabel(brandName)} <span>${escapeHTML(brandName.toUpperCase())}</span>
      </div>
    `;
    const container = document.getElementById('catalog-grid-container');
    if (container) container.appendChild(headerDiv);
    renderProductsGrid(brandProducts, { compactMobile: true });
  }

  return true;
}

function initCartUI() {
  if (window.FutunetCart) {
    // The FutunetCart module automatically binds drawer interactions.
    // We only need to bind the inline buttons inside the catalog.
    document.addEventListener('click', (event) => {
      const inlineAdd = event.target.closest('.inline-add-btn');
      if (inlineAdd) {
        event.stopPropagation();
        window.FutunetCart.add(inlineAdd.dataset.productId);
        return;
      }
      const inlineChange = event.target.closest('[data-inline-change]');
      if (inlineChange) {
        event.stopPropagation();
        window.FutunetCart.changeQty(inlineChange.dataset.productId, Number(inlineChange.dataset.inlineChange));
        return;
      }
    });
  }
}

function setModalCartHandler(productId) {
  const btnAddCart = document.getElementById('modal-add-cart-btn');
  if (!btnAddCart) return;
  btnAddCart.onclick = (event) => {
    event.stopPropagation();
    if (window.FutunetCart) {
      window.FutunetCart.add(productId);
    }
  };
}

function initModalCartButton() {
  const cartBtn = document.getElementById('modal-add-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const currentProductId = cartBtn.dataset.productId;
      if (currentProductId && window.FutunetCart) {
        window.FutunetCart.add(currentProductId);
      }
    });
  }
}

function setModalCartProduct(productId) {
  const cartBtn = document.getElementById('modal-add-cart-btn');
  if (cartBtn) {
    cartBtn.dataset.productId = productId;
  }
}

function initPageCart() {
  initCartUI();
}

function isMobileViewport() {
  return window.innerWidth <= 1023;
}

function isCompactMobileViewport() {
  return window.innerWidth <= 767;
}

function getCatalogContentAnchor() {
  return document.querySelector('#catalog-grid-container .catalog-mobile-explorer');
}

function appendCatalogContent(node) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !node) return;
  const anchor = getCatalogContentAnchor();
  if (anchor) {
    container.insertBefore(node, anchor);
    return;
  }
  container.appendChild(node);
}

function getMobileFilterSheet() {
  return document.getElementById('mobile-filter-sheet');
}

function isMobileFilterSheetOpen() {
  return Boolean(getMobileFilterSheet()?.classList.contains('is-open'));
}

function isProductModalOpen() {
  const modal = document.getElementById('product-modal');
  if (!modal) return false;
  return modal.classList.contains('show') || (modal.style.display && modal.style.display !== 'none');
}

function isMobileMenuOpen() {
  return Boolean(document.getElementById('mobileMenu')?.classList.contains('open'));
}

function syncCatalogScrollLock() {
  const shouldLock = isMobileFilterSheetOpen() || isProductModalOpen() || isMobileMenuOpen();
  document.body.style.overflow = shouldLock ? 'hidden' : '';
}

function syncFilterButtons(activeDept = 'all') {
  document
    .querySelectorAll('.cat-btn[data-filter-dept], .cat-btn[data-dept], .mobile-filter-clear-btn[data-filter-dept], .mobile-filter-clear-btn[data-dept]')
    .forEach((button) => {
      const buttonDept = button.dataset.filterDept || button.dataset.dept;
      button.classList.toggle('active', buttonDept === activeDept);
    });
}

function scrollCatalogToTop() {
  const container = document.getElementById('catalog-grid-container');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function openMobileFilters() {
  const sheet = getMobileFilterSheet();
  if (!sheet || !isMobileViewport()) return;
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  syncCatalogScrollLock();
}

function closeMobileFilters() {
  const sheet = getMobileFilterSheet();
  if (!sheet) return;
  sheet.classList.remove('is-open');
  sheet.setAttribute('aria-hidden', 'true');
  syncCatalogScrollLock();
}

// Configuración de Imágenes default para Cubículos (Subcategorías)
const categoryImages = {
  'cámaras de seguridad': 'img/camaras.jpg',
  'control de accesos': 'img/accesos.jpg',
  'cerraduras': 'img/cerraduras.jpg',
  'laptops corporativas': 'img/laptops.png',
  'laptops': 'img/laptops.png',
  'desktop': 'img/computadoras.png',
  'computadoras': 'img/computadoras.png',
  'aires acondicionados': 'img/aires-acondicionados.png',
  'impresoras y consumibles': 'img/impresoras.jpg',
  'periféricos y partes': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=400&q=75',
  'componentes de red wifi': 'img/redes.jpg',
  'infraestructura de datos': 'img/redes.jpg',
  'cristalería y divisiones': 'img/cristal.jpg',
  'remozamiento profesional': 'img/sheetrock.jpg',
  'papelería y suministros': 'img/papeleria-suministros.png',
  'equipos de oficina': 'img/equipos-oficina.png',
  'escritorios': 'img/mobiliario.png',
  'sillas y sillones': 'img/mobiliario.png',
  'estantes y archivos': 'img/mobiliario.png',
  'mobiliario': 'img/mobiliario.png',
  'energía y respaldo': 'img/ups.jpg',
  'servicios': 'img/redes.jpg'
};

const deptImages = {
  seguridad: 'img/camaras.jpg',
  redes: 'img/redes.jpg',
  energia: 'img/ups.jpg',
  equipos: 'img/laptops.jpg',
  oficina: 'img/papeleria.jpg',
  infra: 'img/sheetrock.jpg'
};

function isServiceItem(product) {
  return Boolean(product) && (
    String(product.brand || '').toLowerCase() === 'servicios' ||
    String(product.category || '').toLowerCase() === 'servicios'
  );
}

function isQuoteOnlyCatalogItem(product) {
  if (!product || isServiceItem(product)) return false;
  const category = normalizeSearch(product.category);
  return category === 'computadoras' ||
    category === 'laptops' ||
    category === 'mobiliario' ||
    String(product.id || '').startsWith('mob_oficina_') ||
    String(product.id || '').startsWith('laptop_selektronic_');
}

function getCategoryCountLabel(categoryName, count) {
  if (String(categoryName || '').toLowerCase() === 'servicios') {
    return `${count} servicio${count !== 1 ? 's' : ''} disponibles`;
  }
  return `${count} Artículos registrados`;
}

function getCategoryHeaderDescription(categoryName, count) {
  if (String(categoryName || '').toLowerCase() === 'servicios') {
    return `${count} servicio${count !== 1 ? 's' : ''} disponibles para cotización y ejecución.`;
  }
  return `${count} producto${count !== 1 ? 's' : ''} organizados por marca.`;
}

function getGroupHeaderLabel(brandName) {
  return String(brandName || '').toLowerCase() === 'servicios' ? 'TIPO:' : 'MARCA:';
}

function getFallbackImg(key) {
  const normalized = key.toLowerCase();
  return categoryImages[normalized] || 'img/placeholder.svg';
}

function getDeptFallbackImg(dept) {
  return deptImages[dept] || 'img/placeholder.svg';
}

function getDeptCountLabel(count) {
  return `${count} articulo${count !== 1 ? 's' : ''} registrados`;
}

// Nombres legibles de departamentos
const deptNames = {
  all: 'Catálogo Completo',
  seguridad: 'Cámaras y Seguridad',
  redes: 'Internet y Redes',
  energia: 'Energía y Climatización',
  equipos: 'Computadoras y Tecnología',
  oficina: 'Oficina y Papelería',
  infra: 'Remodelación de Oficina'
};

const mobileDeptOrder = ['seguridad', 'redes', 'energia', 'equipos', 'oficina', 'infra'];
const mobileDeptIcons = {
  seguridad: 'shield-check',
  redes: 'wifi',
  energia: 'battery-charging',
  equipos: 'monitor',
  oficina: 'briefcase',
  infra: 'building-2'
};
const MOBILE_PREVIEW_LIMIT = 4;

function getDeptDisplayName(dept) {
  return deptNames[dept] || 'Catálogo Completo';
}

function sortEntriesBySize(groupedItems) {
  return Object.entries(groupedItems).sort((a, b) => {
    const sizeDiff = b[1].length - a[1].length;
    if (sizeDiff !== 0) return sizeDiff;
    return String(a[0]).localeCompare(String(b[0]), 'es');
  });
}

function renderMobileStackBrowser({ title, description, items }) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !items.length) return;

  const section = document.createElement('section');
  section.className = 'catalog-mobile-stack-browser reveal in';
  section.innerHTML = `
    <div class="catalog-mobile-stack-browser__header">
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'catalog-stack-grid';

  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'catalog-stack-card';
    button.style.animationDelay = `${index * 35}ms`;
    button.setAttribute('aria-label', item.ariaLabel || item.title);
    button.innerHTML = `
      <span class="catalog-stack-card__icon"><i data-lucide="${escapeHTML(item.icon)}"></i></span>
      <span class="catalog-stack-card__title">${escapeHTML(item.title)}</span>
      <span class="catalog-stack-card__meta">${escapeHTML(item.meta)}</span>
    `;
    button.addEventListener('click', item.onSelect);
    grid.appendChild(button);
  });

  section.appendChild(grid);
  container.appendChild(section);
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: section });
}

function renderMobilePreviewSection({ eyebrow, title, actionLabel, onAction, products }) {
  const container = document.getElementById('catalog-grid-container');
  if (!container || !products.length) return;

  const section = document.createElement('section');
  section.className = 'catalog-mobile-product-section reveal in';

  const header = document.createElement('div');
  header.className = 'catalog-mobile-product-section__header';

  const heading = document.createElement('div');
  heading.className = 'catalog-mobile-product-section__heading';
  heading.innerHTML = `
    <span class="catalog-mobile-product-section__eyebrow">${escapeHTML(eyebrow)}</span>
    <h3>${escapeHTML(title)}</h3>
  `;
  header.appendChild(heading);

  if (typeof onAction === 'function') {
    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = 'catalog-mobile-product-section__action';
    actionButton.textContent = actionLabel;
    actionButton.addEventListener('click', onAction);
    header.appendChild(actionButton);
  }

  section.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'products-grid products-grid--compact-mobile';
  section.appendChild(grid);
  container.appendChild(section);

  renderProductsGrid(products.slice(0, MOBILE_PREVIEW_LIMIT), {
    target: grid,
    compactMobile: true,
    previewMobile: true
  });

  if (products.length > MOBILE_PREVIEW_LIMIT && typeof onAction === 'function') {
    const footer = document.createElement('div');
    footer.className = 'catalog-mobile-product-section__footer';
    const footerButton = document.createElement('button');
    footerButton.type = 'button';
    footerButton.className = 'catalog-mobile-product-section__more';
    footerButton.textContent = `Ver ${products.length} resultados`;
    footerButton.addEventListener('click', onAction);
    footer.appendChild(footerButton);
    section.appendChild(footer);
  }
}

function getCatalogResetLabel() {
  if (state.searchQuery) return 'Limpiar búsqueda';
  if (state.brand !== 'all' || state.availability !== 'all') return 'Limpiar filtros';
  if (state.category !== 'all') return 'Volver a categorías';
  if (state.dept !== 'all') return 'Ver todo';
  return 'Reiniciar vista';
}

function handleCatalogResetAction() {
  closeMobileFilters();

  if (state.searchQuery) {
    clearSearch();
    return;
  }

  if (state.brand !== 'all' || state.availability !== 'all') {
    state.brand = 'all';
    state.availability = 'all';
    const brandSelects = document.querySelectorAll('[data-catalog-brand-filter]');
    brandSelects.forEach(s => { s.value = 'all'; });
    const availSelects = document.querySelectorAll('[data-catalog-availability-filter]');
    availSelects.forEach(s => { s.value = 'all'; });
    syncQuickFilterChips();
    renderUI();
    return;
  }

  if (state.category !== 'all') {
    setCategory('all');
    return;
  }

  clearSearch();
}

function updateCatalogContextBar({ resultsLabel, activeLabel, canReset = false, title, description }) {
  const titleEl = document.getElementById('current-category-title');
  const descEl = document.querySelector('.cat-desc');
  const resultsEl = document.getElementById('catalog-results-pill');
  const activeEl = document.getElementById('catalog-active-pill');
  const resetBtn = document.getElementById('catalog-reset-trigger');

  if (titleEl && title) titleEl.textContent = title;
  if (descEl && description) descEl.textContent = description;
  if (resultsEl && resultsLabel) resultsEl.textContent = resultsLabel;
  if (activeEl && activeLabel) activeEl.textContent = activeLabel;
  if (resetBtn) {
    resetBtn.hidden = !canReset;
    resetBtn.textContent = getCatalogResetLabel();
  }
}
function parsePrice(priceString) {
  const normalized = String(priceString || '').replace(/[^0-9.-]+/g, '');
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

/* -------------------------------------------------------------
   2. RENDERIZADO PRINCIPAL
   ------------------------------------------------------------- */

function updateContextualBanner() {
  const bannerEl = document.getElementById('catalog-context-banner');
  if (!bannerEl) return;

  const dept = state.dept;
  
  if (dept === 'all') {
    bannerEl.style.display = 'none';
    bannerEl.innerHTML = '';
    return;
  }

  let bannerHTML = '';
  
  if (dept === 'redes') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-wifi"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">¿Tienes el internet ideal para alimentar tu red?</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Un cableado estructurado necesita la mejor salida al exterior. Contrata internet de fibra óptica simétrica de alta velocidad con nosotros.</p>
          </div>
        </div>
        <a href="internet.html" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Planes de Internet
        </a>
      </div>
    `;
  } else if (dept === 'seguridad') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-network-wired"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">Complementa tu sistema con una red estructurada</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Las cámaras IP y sistemas de control de acceso requieren una infraestructura de red sólida y conmutadores PoE confiables para operar sin caídas.</p>
          </div>
        </div>
        <a href="redes-datos.html" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Redes y Datos
        </a>
      </div>
    `;
  } else if (dept === 'equipos') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-handshake"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">Instala, conecta y administra con un solo proveedor</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Te ayudamos con la configuración, el licenciamiento y la conexión de tus nuevos equipos de cómputo en la red de tu oficina local.</p>
          </div>
        </div>
        <a href="https://wa.me/18297411041" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Contactar Soporte B2B
        </a>
      </div>
    `;
  } else if (dept === 'energia') {
    bannerHTML = `
      <div style="background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(13,30,54,0.85) 100%); border: 1.5px dashed rgba(11,126,181,0.3); border-radius: 20px; padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        <div style="display: flex; gap: 15px; align-items: center; text-align: left; max-width: 700px; flex-grow: 1;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(11, 126, 181, 0.15); display: flex; align-items: center; justify-content: center; color: #0EA5E9; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fas fa-bolt"></i>
          </div>
          <div>
            <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: white; margin: 0 0 4px;">¿Ya tienes respaldo para tu red y seguridad?</h4>
            <p style="color: #94a3b8; font-size: 0.82rem; margin: 0; line-height: 1.4;">Un apagón puede desconfigurar tus switches o apagar tus cámaras de vigilancia. Cotiza sistemas solares o UPS industriales de respaldo.</p>
          </div>
        </div>
        <a href="energia-climatizacion.html" class="btn btn-outline" style="border-radius: 50px; padding: 10px 24px; font-weight: 700; border: 2px solid var(--brand); color: var(--brand); background: transparent; transition: all 0.3s; white-space: nowrap; font-size: 0.82rem; text-decoration: none;">
          Ver Energía y Clima
        </a>
      </div>
    `;
  }

  if (bannerHTML) {
    bannerEl.innerHTML = bannerHTML;
    bannerEl.style.display = 'block';
  } else {
    bannerEl.style.display = 'none';
    bannerEl.innerHTML = '';
  }
}

function renderUI() {
  const container = document.getElementById('catalog-grid-container');
  if (!container) return;
  syncCatalogUrl();
  updateContextualBanner();
  container.innerHTML = '';
  const compactMobile = isCompactMobileViewport();
  if (compactMobile && renderCompactMobileCatalogView()) {
    return;
  }

  const isServiceItemLocal = (p) => {
    return typeof isServiceItem === 'function' ? isServiceItem(p) : (p.isService || p.department === 'infra' || String(p.brand || '').toLowerCase() === 'servicios');
  };

  // 1. Manejo de Búsqueda Directa
  if (state.searchQuery) {
    const q = normalizeSearch(state.searchQuery);
    let results = getCatalogDb()
      .map(p => ({ product: p, score: scoreProductMatch(p, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.product);

    // Apply Price Range Filter
    results = results.filter(p => {
      if (isServiceItemLocal(p)) return true;
      const price = parsePrice(p.price);
      return price >= state.minPrice && price <= state.maxPrice;
    });

    if (state.brand !== 'all') results = results.filter(p => matchesBrand(p.brand, state.brand));
    results = sortCatalogProducts(applyAvailabilityFilter(results));

    updateCatalogContextBar({
      title: 'Resultados de búsqueda',
      description: `Mostrando coincidencias relacionadas con “${state.searchQuery}”.`,
      resultsLabel: `${results.length} coincidencia${results.length !== 1 ? 's' : ''}`,
      activeLabel: `Búsqueda activa: ${state.searchQuery}`,
      canReset: true
    });

    renderHeader(
      'Resultados de búsqueda',
      `${results.length} coincidencia${results.length !== 1 ? 's' : ''} para "${state.searchQuery}"`
    );

    if (results.length === 0) {
      renderEmptyState(
        'Sin resultados',
        'No encontramos productos con esos términos dentro del rango de precio seleccionado. Intenta con otras palabras o limpia los filtros.'
      );
    } else {
      state.allFilteredProducts = results;
      state.page = 0;
      renderPaginatedProducts();
    }
    return;
  }

  // 2. Filtrado Base por Departamento
  let db = getCatalogDb();
  if (state.dept !== 'all') db = db.filter(p => p.department === state.dept);
  if (state.brand !== 'all') db = db.filter(p => matchesBrand(p.brand, state.brand));

  // Apply Price Range Filter
  db = db.filter(p => {
    if (isServiceItemLocal(p)) return true;
    const price = parsePrice(p.price);
    return price >= state.minPrice && price <= state.maxPrice;
  });
  db = sortCatalogProducts(applyAvailabilityFilter(db));

  // NIVEL 1: CUBÍCULOS DE SUBCATEGORÍAS
  if (state.category === 'all') {
    if (state.brand !== 'all') {
      updateCatalogContextBar({
        title: `Productos ${state.brand}`,
        description: `${db.length} producto${db.length !== 1 ? 's' : ''} disponibles de la marca ${state.brand}.`,
        resultsLabel: `${db.length} artículo${db.length !== 1 ? 's' : ''}`,
        activeLabel: `Marca: ${state.brand}`,
        canReset: true
      });

      renderHeader(
        `Marca: ${state.brand}`,
        `${db.length} producto${db.length !== 1 ? 's' : ''} registrado${db.length !== 1 ? 's' : ''}`,
        true,
        () => {
          state.brand = 'all';
          const brandSelects = document.querySelectorAll('[data-catalog-brand-filter]');
          brandSelects.forEach(s => { s.value = 'all'; });
          syncQuickFilterChips();
          renderUI();
        }
      );

      if (db.length === 0) {
        renderEmptyState('Sin resultados', `No encontramos productos para la marca ${state.brand}.`);
      } else {
        state.allFilteredProducts = db;
        state.page = 0;
        renderPaginatedProducts();
      }
      return;
    }

    const categoriesGroups = {};
    db.forEach(p => {
      if (!categoriesGroups[p.category]) categoriesGroups[p.category] = 0;
      categoriesGroups[p.category]++;
    });

    updateCatalogContextBar({
      title: getDeptDisplayName(state.dept),
      description: state.dept === 'all'
        ? 'Explora por departamento o entra directo a la subcategoría que necesitas.'
        : 'Selecciona un área específica para ver resultados más precisos.',
      resultsLabel: state.dept === 'all'
        ? `${db.length} artículos y servicios`
        : `${Object.keys(categoriesGroups).length} subcategorías disponibles`,
      activeLabel: state.dept === 'all'
        ? 'Vista general del catálogo'
        : `Departamento activo: ${getDeptDisplayName(state.dept)}`,
      canReset: state.dept !== 'all'
    });

    renderHeader('Explora por Subcategoría', 'Selecciona el área de tu interés dentro de este departamento.');

    const subGrid = document.createElement('div');
    subGrid.className = 'cubiculos-grid reveal in';

    Object.keys(categoriesGroups).forEach((catName, i) => {
      const card = document.createElement('div');
      card.className = 'cubiculo-card';
      card.style.backgroundImage = `url('${getFallbackImg(catName)}')`;
      card.style.animationDelay = `${i * 80}ms`;
      card.addEventListener('click', () => setCategory(catName));
      card.innerHTML = `
        <div class="cubiculo-info">
          <h4 class="cubiculo-title">${escapeHTML(catName)}</h4>
          <span class="cubiculo-count">${getCategoryCountLabel(catName, categoriesGroups[catName])}</span>
        </div>
      `;
      subGrid.appendChild(card);
    });

    container.appendChild(subGrid);
    return;
  }

  // NIVEL 2: PRODUCTOS AGRUPADOS POR MARCAS
  const catDb = db.filter(p => p.category === state.category);

  updateCatalogContextBar({
    title: state.category,
    description: getCategoryHeaderDescription(state.category, catDb.length),
    resultsLabel: `${catDb.length} resultado${catDb.length !== 1 ? 's' : ''}`,
    activeLabel: `En ${getDeptDisplayName(state.dept)}`,
    canReset: true
  });

  renderHeader(
    state.category,
    getCategoryHeaderDescription(state.category, catDb.length),
    true,
    () => setCategory('all')
  );

  // Flatten all products in brand order for pagination
  const brandsGroups = {};
  catDb.forEach(p => {
    if (!brandsGroups[p.brand]) brandsGroups[p.brand] = [];
    brandsGroups[p.brand].push(p);
  });

  // For brand-grouped view, render all with brand headers
  for (const brandName in brandsGroups) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'brand-header reveal in';
    headerDiv.innerHTML = `
      <div class="brand-header-tag">
        ${getGroupHeaderLabel(brandName)} <span>${escapeHTML(brandName.toUpperCase())}</span>
      </div>
    `;
    container.appendChild(headerDiv);

    renderProductsGrid(brandsGroups[brandName]);
  }
}


/**
 * Renderiza un encabezado de sección dentro del catálogo
 */
function renderHeader(title, desc, showBack = false, backAction = null) {
  const container = document.getElementById('catalog-grid-container');
  const wrapper = document.createElement('div');
  wrapper.className = 'catalog-inner-header reveal in';

  let html = '';
  if (showBack) {
    html += `<button class="catalog-back-btn catalog-back-btn--spaced" id="temp-back-btn" type="button"><i data-lucide="arrow-left"></i> Regresar</button>`;
  }
  html += `
    <div class="catalog-inner-header-border">
      <h2>${escapeHTML(title)}</h2>
      <p>${escapeHTML(desc)}</p>
    </div>
  `;
  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  if (showBack && backAction) {
    const btn = wrapper.querySelector('#temp-back-btn');
    if (btn) btn.addEventListener('click', backAction);
  }
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: wrapper });
}


/**
 * Renderiza un estado vacío atractivo
 */
function renderEmptyState(title, description) {
  const container = document.getElementById('catalog-grid-container');
  const div = document.createElement('div');
  div.className = 'empty-state reveal in';
  div.innerHTML = `
    <div class="empty-state-icon"><i data-lucide="search-x"></i></div>
    <h3>${escapeHTML(title)}</h3>
    <p>${escapeHTML(description)}</p>
    <div class="empty-state-actions" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
      <button class="btn btn-outline empty-state-reset-btn" type="button">
        <i data-lucide="arrow-left"></i> Ver Catálogo Completo
      </button>
      <button class="btn empty-state-ai-btn" type="button" style="background: linear-gradient(135deg, #0b5fc6, #0284c7); color: #fff; border: none; padding: 10px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
        <i data-lucide="sparkles"></i> Preguntar a Futunet AI
      </button>
      <a class="btn btn-wa empty-state-wa-btn" href="https://wa.me/18297411041?text=Hola%20Futunet%2C%20no%20encontr%C3%A9%20lo%20que%20buscaba%20en%20el%20cat%C3%A1logo%20y%20quisiera%20ayuda." target="_blank" rel="noopener noreferrer">
        <i data-lucide="message-circle"></i> Pedir ayuda por WhatsApp
      </a>
    </div>
  `;
  container.appendChild(div);
  const resetButton = div.querySelector('.empty-state-reset-btn');
  if (resetButton) resetButton.addEventListener('click', clearSearch);
  const aiButton = div.querySelector('.empty-state-ai-btn');
  if (aiButton) {
    aiButton.addEventListener('click', () => {
      const searchInput = document.getElementById('search-catalog-page');
      const query = searchInput ? searchInput.value.trim() : '';
      if (window.FutunetAI) {
        window.FutunetAI.ask(query ? `Hola, busqué "${query}" en el catálogo de Futunet y no lo encontré, ¿qué opciones o equipos compatibles me recomiendas?` : 'Hola, ¿qué opciones de productos me recomiendas en el catálogo de Futunet?');
      }
    });
  }
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: div });
}


/**
 * Limpia la búsqueda y vuelve al catálogo
 */
function resetPriceSliders() {
  state.minPrice = 0;
  state.maxPrice = 9999999;
  
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minVal = document.getElementById('price-min-val');
  const maxVal = document.getElementById('price-max-val');
  const track = document.getElementById('price-track');

  const mMinInput = document.getElementById('mobile-price-min');
  const mMaxInput = document.getElementById('mobile-price-max');
  const mMinVal = document.getElementById('mobile-price-min-val');
  const mMaxVal = document.getElementById('mobile-price-max-val');
  const mTrack = document.getElementById('mobile-price-track');

  if (minInput) minInput.value = 0;
  if (maxInput) maxInput.value = 150000;
  if (minVal) minVal.textContent = 'RD$ 0';
  if (maxVal) maxVal.textContent = 'RD$ 150,000+';

  if (mMinInput) mMinInput.value = 0;
  if (mMaxInput) mMaxInput.value = 150000;
  if (mMinVal) mMinVal.textContent = 'RD$ 0';
  if (mMaxVal) mMaxVal.textContent = 'RD$ 150,000+';

  if (minInput && maxInput && track) {
    track.style.background = `linear-gradient(to right, var(--brand) 0%, var(--brand) 100%)`;
  }
  if (mMinInput && mMaxInput && mTrack) {
    mTrack.style.background = `linear-gradient(to right, var(--brand) 0%, var(--brand) 100%)`;
  }
}

function syncPriceControlsFromState() {
  const sliderMin = Math.max(0, Math.min(150000, Number(state.minPrice) || 0));
  const sliderMax = state.maxPrice >= 9999999
    ? 150000
    : Math.max(sliderMin + 5000, Math.min(150000, Number(state.maxPrice) || 150000));
  const formatValue = (value) => value >= 150000
    ? 'RD$ 150,000+'
    : new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

  [['price-min', sliderMin], ['mobile-price-min', sliderMin], ['price-max', sliderMax], ['mobile-price-max', sliderMax]]
    .forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) input.value = value;
    });
  [['price-min-val', sliderMin], ['mobile-price-min-val', sliderMin], ['price-max-val', sliderMax], ['mobile-price-max-val', sliderMax]]
    .forEach(([id, value]) => {
      const label = document.getElementById(id);
      if (label) label.textContent = formatValue(value);
    });

  const minPercent = (sliderMin / 150000) * 100;
  const maxPercent = (sliderMax / 150000) * 100;
  ['price-track', 'mobile-price-track'].forEach((id) => {
    const track = document.getElementById(id);
    if (track) track.style.background = `linear-gradient(to right, #e5eef8 ${minPercent}%, var(--brand) ${minPercent}%, var(--brand) ${maxPercent}%, #e5eef8 ${maxPercent}%)`;
  });
}

function clearSearch() {
  state.searchQuery = null;
  state.dept = 'all';
  state.category = 'all';
  state.brand = 'all';
  state.availability = 'all';
  state.sort = 'relevance';
  closeMobileFilters();

  const brandFilter = document.querySelector('[data-catalog-brand-filter]');
  if (brandFilter) brandFilter.value = 'all';
  const availabilityFilter = document.querySelector('[data-catalog-availability-filter]');
  if (availabilityFilter) availabilityFilter.value = 'all';
  const sortFilter = document.querySelector('[data-catalog-sort]');
  if (sortFilter) sortFilter.value = 'relevance';

  const catalogSearch = document.getElementById('search-catalog-page');
  if (catalogSearch) catalogSearch.value = '';

  syncFilterButtons('all');
  resetPriceSliders();
  renderUI();
}


/* -------------------------------------------------------------
   3. PAGINACIÓN — "Load More" con IntersectionObserver
   ------------------------------------------------------------- */

function renderPaginatedProducts() {
  const products = state.allFilteredProducts;
  const start = 0;
  const end = Math.min((state.page + 1) * state.pageSize, products.length);
  const visible = products.slice(start, end);

  renderProductsGrid(visible);

  // Show "Load More" or "All loaded"
  if (end < products.length) {
    renderLoadMoreButton(end, products.length);
  } else if (products.length > state.pageSize) {
    // All loaded message
    const msg = document.createElement('div');
    msg.className = 'load-more-container reveal in';
    const counterP = document.createElement('p');
    counterP.className = 'results-counter';
    counterP.textContent = `Mostrando todos los ${Number(products.length)} productos`;
    msg.appendChild(counterP);
    appendCatalogContent(msg);
  }
}

function renderLoadMoreButton(shown, total) {
  const div = document.createElement('div');
  div.className = 'load-more-container reveal in';
  div.innerHTML = `
    <button class="load-more-btn" id="load-more-btn">
      <i data-lucide="chevrons-down"></i> Cargar más productos
    </button>
  `;
  const counterP = document.createElement('p');
  counterP.className = 'results-counter';
  counterP.textContent = `Mostrando ${Number(shown)} de ${Number(total)} productos`;
  div.appendChild(counterP);
  appendCatalogContent(div);

  const btn = div.querySelector('#load-more-btn');
  btn.addEventListener('click', () => {
    state.page++;
    // Remove the load more button
    div.remove();
    // Render next batch
    const nextEnd = Math.min((state.page + 1) * state.pageSize, total);
    const nextProducts = state.allFilteredProducts.slice(shown, nextEnd);

    renderProductsGrid(nextProducts);

    // Re-add load more if needed
    if (nextEnd < total) {
      renderLoadMoreButton(nextEnd, total);
    } else {
      const msg = document.createElement('div');
      msg.className = 'load-more-container reveal in';
      const endCounterP = document.createElement('p');
      endCounterP.className = 'results-counter';
      endCounterP.textContent = `Mostrando todos los ${Number(total)} productos`;
      msg.appendChild(endCounterP);
      appendCatalogContent(msg);
    }
  });

  if (typeof lucide !== 'undefined') lucide.createIcons({ root: div });
}


/* -------------------------------------------------------------
   4. RENDERIZADO DE PRODUCTOS (Cards)
   ------------------------------------------------------------- */

// renderProductsGridLegacy removed to optimize code size.

function renderProductsGrid(productsList, options = {}) {
  const fragment = document.createDocumentFragment();
  const target = options.target || null;
  const compactCard = typeof options.compactMobile === 'boolean' ? options.compactMobile : isCompactMobileViewport();
  const previewCard = Boolean(options.previewMobile) && compactCard;

  productsList.forEach((product, idx) => {
    const serviceItem = isServiceItem(product);
    const furnitureItem = !serviceItem && (
      product.category === 'Mobiliario' || String(product.id || '').startsWith('mob_oficina_')
    );
    const computerItem = !serviceItem && normalizeSearch(product.category) === 'computadoras';
    const laptopItem = !serviceItem && normalizeSearch(product.category) === 'laptops';
    const quoteOnlyItem = isQuoteOnlyCatalogItem(product);
    const purchasableProduct = !serviceItem && !quoteOnlyItem && parsePrice(product.price) > 0;
    const badgeText = serviceItem ? 'SERVICIO' : product.brand;
    const actionText = compactCard
      ? 'Ver'
      : serviceItem
        ? 'Ver Detalles del Servicio'
        : 'Ver ficha técnica';
    const metaText = furnitureItem
      ? 'Mobiliario de oficina'
      : serviceItem
      ? `${getDeptDisplayName(product.department)} · Servicio`
      : `${product.brand} · ${product.category}`;
    const availabilityText = serviceItem ? 'A medida' : purchasableProduct ? 'Disponible' : 'Bajo cotización';
    const productUrl = 'producto.html?id=' + encodeURIComponent(product.id);
    const whatsappNumber = typeof FUTUNET_CONFIG !== 'undefined' && FUTUNET_CONFIG.WHATSAPP_NUMBER
      ? FUTUNET_CONFIG.WHATSAPP_NUMBER
      : '18297411041';
    const quoteMessage = `Hola Futunet, quiero consultar el precio y la disponibilidad de: *${product.title}*.`;
    const quoteUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(quoteMessage)}`;
    const card = document.createElement('article');
    card.className = `product-card reveal in${serviceItem ? ' product-card--service' : ''}${quoteOnlyItem ? ' product-card--quote-only' : ''}${furnitureItem ? ' product-card--furniture' : ''}${computerItem || laptopItem ? ' product-card--computer-quote' : ''}${previewCard ? ' product-card--preview-mobile' : compactCard ? ' product-card--compact-mobile' : ''}`;
    card.style.animationDelay = `${idx * 40}ms`;

    card.innerHTML = `
      <a class="product-card__image-link" href="${productUrl}" aria-label="Ver detalles de ${escapeHTML(product.title)}">
        <div class="product-img-wrapper${previewCard ? ' product-img-wrapper--preview-mobile' : compactCard ? ' product-img-wrapper--compact-mobile' : ''}">
          <img src="${escapeHTML(product.img)}" alt="${escapeHTML(product.title)}" loading="lazy" width="400" height="300" onerror="this.onerror=null;this.src='img/placeholder.svg'">
          ${quoteOnlyItem ? '' : `<span class="product-badge">${escapeHTML(badgeText)}</span>`}
          ${quoteOnlyItem || previewCard ? '' : `<span class="product-available">${escapeHTML(availabilityText)}</span>`}
        </div>
      </a>
      <div class="product-info${previewCard ? ' product-info--preview-mobile' : compactCard ? ' product-info--compact-mobile' : ''}">
        <div class="product-meta${previewCard ? ' product-meta--preview-mobile' : compactCard ? ' product-meta--compact-mobile' : ''}">${escapeHTML(metaText)}</div>
        <h4 class="product-title${previewCard ? ' product-title--preview-mobile' : compactCard ? ' product-title--compact-mobile' : ''}"><a href="${productUrl}">${escapeHTML(product.title)}</a></h4>
        ${quoteOnlyItem ? '' : `<div class="product-price${previewCard ? ' product-price--preview-mobile' : compactCard ? ' product-price--compact-mobile' : ''}">${escapeHTML(product.price)}</div>`}
        ${compactCard ? '' : `<p class="product-desc">${escapeHTML(product.desc)}</p>`}
        ${previewCard ? '' : `
        <div class="product-actions${compactCard ? ' product-actions--compact-mobile' : ''}">
          ${quoteOnlyItem ? `
          <a class="product-quote-btn${compactCard ? ' product-quote-btn--compact-mobile' : ''}" href="${escapeHTML(quoteUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar precio de ${escapeHTML(product.title)} por WhatsApp">
            <i data-lucide="message-circle"></i> Consultar precio
          </a>` : `
          <button class="product-view-btn${compactCard ? ' product-view-btn--compact-mobile' : ''}" type="button">
            <i data-lucide="eye"></i> ${actionText}
          </button>`}
          ${purchasableProduct ? `<div class="product-add-container${compactCard ? ' product-add-container--compact-mobile' : ''}" data-product-add="${escapeHTML(product.id)}" data-product-add-variant="${compactCard ? 'compact' : 'default'}">
            ${renderInlineAddButtonHTML(product.id, compactCard ? 'compact' : 'default')}
          </div>` : ''}
        </div>
        `}
      </div>
    `;

    const imgEl = card.querySelector('.product-img-wrapper img');
    if (imgEl) {
      if (product.imagePosition) imgEl.style.objectPosition = product.imagePosition;
      imgEl.addEventListener('error', function onError() {
        handleImageError(this, product.id, 0);
      }, { once: true });
    }

    const actionButton = card.querySelector('.product-view-btn');
    if (actionButton) {
      actionButton.addEventListener('click', () => {
        window.location.href = productUrl;
      });
    }

    fragment.appendChild(card);
  });

  if (target) {
    target.appendChild(fragment);
  } else {
    appendCatalogContent(fragment);
  }
  if (typeof lucide !== 'undefined') {
    const rootEl = target || document.getElementById('catalog-grid-container');
    if (rootEl) {
      lucide.createIcons({ root: rootEl });
    } else {
      lucide.createIcons();
    }
  }
}
if (typeof window !== 'undefined') window.renderProductsGrid = renderProductsGrid;


function handleImageError(imgEl, productId, currentIndex) {
  const product = getCatalogDb().find(p => p.id === productId);
  if (product && product.gallery && currentIndex + 1 < product.gallery.length) {
    // Try the next image in the gallery
    const nextIndex = currentIndex + 1;
    imgEl.onerror = function () { handleImageError(this, productId, nextIndex); };
    imgEl.src = product.gallery[nextIndex];
  } else {
    // No more images to try, show placeholder
    imgEl.onerror = null;
    imgEl.src = 'img/placeholder.svg';
  }
}


/* -------------------------------------------------------------
   5. CONTROLADORES DE ESTADO UI
   ------------------------------------------------------------- */

function filterCat(dept, btn) {
  syncFilterButtons(dept);

  state.dept = dept;
  state.category = 'all';
  state.brand = 'all';
  state.searchQuery = null;
  state.page = 0;

  // Si hay input en catálogo, limpiarlo
  const catalogSearch = document.getElementById('search-catalog-page');
  if (catalogSearch) catalogSearch.value = '';

  closeMobileFilters();
  renderUI();
  if (btn && isMobileViewport()) scrollCatalogToTop();
}

function setCategory(catName) {
  state.category = catName;
  state.brand = 'all';
  state.page = 0;
  closeMobileFilters();
  renderUI();
  scrollCatalogToTop();
}

function setBrand(brandName) {
  state.brand = brandName;
  state.page = 0;
  renderUI();
}


/* -------------------------------------------------------------
   6. PRODUCT MODAL (MARKETPLACE)
   ------------------------------------------------------------- */

let lastModalTrigger = null;

function openProductModal(id) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  const product = getCatalogDb().find(p => p.id === id);
  if (!product) return;
  const serviceItem = isServiceItem(product);
  const quoteOnlyItem = isQuoteOnlyCatalogItem(product);
  const purchasableProduct = !serviceItem && !quoteOnlyItem && parsePrice(product.price) > 0;
  closeMobileFilters();
  lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (purchasableProduct) setModalCartProduct(id);

  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = product.title;

  const priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = quoteOnlyItem ? 'Consultar precio' : product.price;

  const brandEl = document.getElementById('modal-brand');
  if (brandEl) brandEl.textContent = serviceItem ? 'SERVICIO' : product.brand;

  const availabilityPill = document.getElementById('modal-availability');
  if (availabilityPill) {
    availabilityPill.textContent = serviceItem ? 'A medida' : quoteOnlyItem ? 'Sujeto a disponibilidad' : 'Disponible';
    availabilityPill.classList.toggle('modal-availability-pill--service', serviceItem);
  }

  const descEl = document.getElementById('modal-desc');
  if (descEl) descEl.textContent = product.desc;

  const metaSummary = document.getElementById('modal-meta-summary');
  if (metaSummary) {
    metaSummary.textContent = serviceItem
      ? `${getDeptDisplayName(product.department)} · ${product.category}`
      : `${product.brand} · ${product.category}`;
  }

  const specsTitle = document.querySelector('.specs-title');
  if (specsTitle) {
    specsTitle.textContent = serviceItem ? 'Alcance del Servicio' : 'Especificaciones Técnicas';
  }

  const mainImg = document.getElementById('modal-main-img');
  if (mainImg) {
    mainImg.src = product.img;
    mainImg.style.objectPosition = product.imagePosition || '50% 50%';
    mainImg.onerror = function () { this.onerror = null; this.src = 'img/placeholder.svg'; };
  }

  const thumbsContainer = document.getElementById('modal-thumbnails');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    thumbsContainer.hidden = !product.gallery || product.gallery.length <= 1;

    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((url, i) => {
        const thumb = document.createElement('img');
        thumb.className = i === 0 ? 'thumb-img active' : 'thumb-img';
        thumb.src = url;
        thumb.alt = `${product.title} - Imagen ${i + 1}`;
        thumb.onerror = function () { this.style.display = 'none'; };
        thumb.addEventListener('click', () => {
          if (mainImg) {
            mainImg.src = url;
            mainImg.onerror = function () { this.onerror = null; this.src = 'img/placeholder.svg'; };
          }
          document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        thumbsContainer.appendChild(thumb);
      });
    }
  }

  const specsList = document.getElementById('modal-specs');
  if (specsList) {
    specsList.innerHTML = '';
    if (product.specs && product.specs.length > 0) {
      product.specs.forEach(spec => {
        const li = document.createElement('li');
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'check-circle-2');
        const span = document.createElement('span');
        span.textContent = spec;
        li.appendChild(icon);
        li.appendChild(span);
        specsList.appendChild(li);
      });
    }
  }

  const btnQuote = document.getElementById('modal-quote-btn');
  if (btnQuote) {
    btnQuote.textContent = '';
    const quoteIcon = document.createElement('i');
    quoteIcon.setAttribute('data-lucide', 'message-circle');
    btnQuote.appendChild(quoteIcon);
    btnQuote.appendChild(document.createTextNode(' ' + (serviceItem ? 'Solicitar este servicio' : quoteOnlyItem ? 'Consultar precio' : 'Cotizar Modelo Exacto')));
    btnQuote.onclick = () => { requestQuote(product.title, product.brand, product.price, serviceItem, quoteOnlyItem); };
  }

  const btnAddCart = document.getElementById('modal-add-cart-btn');
  if (btnAddCart) {
    btnAddCart.hidden = !purchasableProduct;
    if (!purchasableProduct) delete btnAddCart.dataset.productId;
    btnAddCart.setAttribute('aria-label', `Agregar ${product.title} al carrito`);
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ root: modal });
  }

  const modalContent = modal.querySelector('.modal-content');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  if (modalContent) modalContent.scrollTop = 0;
  setTimeout(() => modal.classList.add('show'), 10);
  const closeButton = modal.querySelector('[data-close-product-modal]');
  if (closeButton) closeButton.focus();
  syncCatalogScrollLock();
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal || modal.style.display === 'none') return;
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    syncCatalogScrollLock();
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }, 300);
}

// Cerrar modal con Escape o click fuera
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (isMobileFilterSheetOpen()) {
    closeMobileFilters();
    return;
  }
  if (isProductModalOpen()) closeProductModal();
});
document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (modal && e.target === modal) closeProductModal();
});

function safeOpenWhatsApp(url) {
  if (typeof window !== 'undefined' && typeof window.safeOpenWhatsApp === 'function') {
    return window.safeOpenWhatsApp(url);
  }
  if (!url) return;
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { if (link.parentNode) link.parentNode.removeChild(link); }, 200);
  } catch (e) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function requestQuote(product, brand, price, serviceItem = false, quoteOnlyItem = false) {
  const isService = serviceItem || String(brand || '').toLowerCase() === 'servicios';
  const text = quoteOnlyItem
    ? `Hola Futunet, quiero consultar el precio y la disponibilidad de: *${product}*.`
    : isService
    ? `Hola Futunet, deseo solicitar el servicio: *${product}* con precio de referencia ${price}. Favor brindarme información y disponibilidad.`
    : `Hola Futunet, deseo comprar o cotizar el producto: *${product}* (Marca: ${brand}) listado al precio de: ${price}. Favor brindarme información.`;
  const phone = typeof FUTUNET_CONFIG !== 'undefined' && FUTUNET_CONFIG.WHATSAPP_NUMBER
    ? FUTUNET_CONFIG.WHATSAPP_NUMBER
    : '18297411041';
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  safeOpenWhatsApp(waUrl);
}


function bindCatalogInterface() {
  document.addEventListener('click', (event) => {
    const filterButton = event.target.closest('[data-filter-dept]');
    if (filterButton) {
      filterCat(filterButton.dataset.filterDept || 'all', filterButton);
      return;
    }

    const searchTrigger = event.target.closest('[data-search-trigger]');
    if (searchTrigger) {
      const inputId = searchTrigger.dataset.searchInput;
      const input = inputId ? document.getElementById(inputId) : null;
      if (input) executeSearch(input.value.trim());
      return;
    }

    if (event.target.closest('[data-close-product-modal]')) {
      closeProductModal();
    }
  });
}


/* -------------------------------------------------------------
   7. SMART SEARCH (RUTEO Y AUTOCOMPLETADO CON DEBOUNCE)
   ------------------------------------------------------------- */

function initSmartSearch(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const drop = document.getElementById(dropdownId);
  if (!input || !drop) return;

  const handleSearch = debounce((q) => {
    if (q.length < 2) {
      drop.classList.remove('active');
      return;
    }

    // Algoritmo de coincidencias B2B
    const resultCats = new Set();
    const resultBrands = new Set();
    const resultModels = [];

    const nq = normalizeSearch(q);
    getCatalogDb().forEach(p => {
      const nCat = normalizeSearch(p.category);
      const nBrand = normalizeSearch(p.brand);
      const nTitle = normalizeSearch(p.title);
      const nDesc = normalizeSearch(p.desc);
      if (fuzzyMatch(nCat, nq)) resultCats.add(p.category);
      if (fuzzyMatch(nBrand, nq)) resultBrands.add(p.brand);
      if (fuzzyMatch(nTitle, nq) || fuzzyMatch(nDesc, nq) || scoreProductMatch(p, nq) > 0) {
        resultModels.push(p);
      }
    });

    let html = '';

    // 1. Mostrar Categorías
    if (resultCats.size > 0) {
      html += `<div class="search-group-title">Sistemas & Categorías</div>`;
      resultCats.forEach(c => {
        html += `<div class="search-item" data-search="${escapeHTML(c)}" role="option" tabindex="0"><i data-lucide="layers"></i> ${escapeHTML(c)}</div>`;
      });
    }

    // 2. Mostrar Marcas
    if (resultBrands.size > 0) {
      html += `<div class="search-group-title">Marcas Recomendadas</div>`;
      resultBrands.forEach(b => {
        html += `<div class="search-item" data-search="${escapeHTML(b)}" role="option" tabindex="0"><i data-lucide="tag"></i> Todo sobre ${escapeHTML(b)}</div>`;
      });
    }

    // 3. Mostrar Modelos Exactos (Max 5)
    if (resultModels.length > 0) {
      html += `<div class="search-group-title">Modelos Específicos</div>`;
      resultModels.slice(0, 5).forEach(m => {
        html += `<div class="search-item search-item--product" data-product-id="${escapeHTML(m.id)}" data-search="${escapeHTML(m.title)}" role="option" tabindex="0">` +
                `  <img src="${escapeHTML(m.img || 'img/placeholder.svg')}" class="search-item-thumb" alt="" onerror="this.src='img/placeholder.svg'" />` +
                `  <div class="search-item-info">` +
                `    <span class="search-item-name">${escapeHTML(m.title)}</span>` +
                `    <span class="search-item-brand">${escapeHTML(m.brand)}</span>` +
                `  </div>` +
                (isQuoteOnlyCatalogItem(m) ? '' : `  <span class="search-item-price">${escapeHTML(m.price)}</span>`) +
                `</div>`;
      });
    }

    if (html === '') {
      html = `<div class="search-item search-item--muted" role="option" aria-disabled="true"><i data-lucide="search-x"></i> Sin resultados</div>`;
    }

    drop.innerHTML = html;

    // Attach click handlers to search items (instead of inline onclick)
    drop.querySelectorAll('.search-item').forEach(item => {
      const handler = () => {
        const prodId = item.getAttribute('data-product-id');
        if (prodId) {
          window.location.href = `producto.html?id=${encodeURIComponent(prodId)}`;
        } else {
          const q = item.getAttribute('data-search');
          if (q) executeSearch(q);
        }
      };
      item.addEventListener('click', handler);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handler();
        }
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons({ root: drop });
    drop.classList.add('active');
  }, 250); // 250ms debounce

  input.addEventListener('input', (e) => {
    handleSearch(e.target.value.toLowerCase().trim());
  });

  // Ejecutar con Enter o cerrar con Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      drop.classList.remove('active');
      if (q) executeSearch(q);
    } else if (e.key === 'Escape') {
      drop.classList.remove('active');
    }
  });

  // Cerrar si hace click afuera
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !drop.contains(e.target)) {
      drop.classList.remove('active');
    }
  });
}

const debouncedLogSearch = debounce(async (clean) => {
  try {
    const db = window.FutunetFirebase?.db;
    if (db && window.FutunetAuth?.isLoggedIn()) {
      await db.collection('search_queries').add({
        query: clean,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (e) {
    console.warn('Error saving search query:', e);
  }
}, 1500);

async function logSearchQuery(query) {
  const clean = String(query || '').trim().toLowerCase();
  if (!clean || clean.length < 2) return;
  debouncedLogSearch(clean);
}

function executeSearch(query) {
  const normalizedQuery = String(query || '').trim();
  if (!normalizedQuery) return;

  // Log to Firestore
  logSearchQuery(normalizedQuery);

  // Check if we are in Catalog Page
  const path = window.location.pathname.toLowerCase();
  if (path.includes('catalogo')) {
    // We are inside Catalog, just trigger state
    state.searchQuery = normalizedQuery;
    state.dept = 'all';
    state.category = 'all';
    state.brand = 'all';
    state.page = 0;
    syncFilterButtons('all');

    const input = document.getElementById('search-catalog-page');
    if (input) input.value = normalizedQuery;
    const drop = document.getElementById('search-drop-catalog');
    if (drop) drop.classList.remove('active');

    closeMobileFilters();
    renderUI();
  } else {
    // Redirect to Catalog page with parameter
    window.location.href = `catalogo.html?q=${encodeURIComponent(normalizedQuery)}`;
  }
}


function initPriceFilter() {
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minVal = document.getElementById('price-min-val');
  const maxVal = document.getElementById('price-max-val');
  const track = document.getElementById('price-track');

  const mMinInput = document.getElementById('mobile-price-min');
  const mMaxInput = document.getElementById('mobile-price-max');
  const mMinVal = document.getElementById('mobile-price-min-val');
  const mMaxVal = document.getElementById('mobile-price-max-val');
  const mTrack = document.getElementById('mobile-price-track');

  if (!minInput || !maxInput) return;

  function formatDop(val) {
    if (val >= 150000) return 'RD$ 150,000+';
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  }

  function updateTrack(sliderMin, sliderMax, trackEl) {
    if (!trackEl) return;
    const minVal = parseInt(sliderMin.value);
    const maxVal = parseInt(sliderMax.value);
    const minPercent = (minVal / sliderMin.max) * 100;
    const maxPercent = (maxVal / sliderMax.max) * 100;
    trackEl.style.background = `linear-gradient(to right, #e5eef8 ${minPercent}%, var(--brand) ${minPercent}%, var(--brand) ${maxPercent}%, #e5eef8 ${maxPercent}%)`;
  }

  const handlePriceChange = debounce(() => {
    renderUI();
  }, 200);

  function syncSliders(isMobileSource) {
    const srcMin = isMobileSource ? mMinInput : minInput;
    const srcMax = isMobileSource ? mMaxInput : maxInput;
    const destMin = isMobileSource ? minInput : mMinInput;
    const destMax = isMobileSource ? maxInput : mMaxInput;

    if (!srcMin || !srcMax) return;

    let minV = parseInt(srcMin.value);
    let maxV = parseInt(srcMax.value);

    const gap = 5000;
    if (maxV - minV < gap) {
      if (srcMin === document.activeElement || (mMinInput && mMinInput === document.activeElement)) {
        srcMin.value = maxV - gap;
        minV = maxV - gap;
      } else {
        srcMax.value = minV + gap;
        maxV = minV + gap;
      }
    }

    if (destMin) destMin.value = minV;
    if (destMax) destMax.value = maxV;

    state.minPrice = minV;
    state.maxPrice = maxV >= 150000 ? 9999999 : maxV;

    if (minVal) minVal.textContent = formatDop(minV);
    if (maxVal) maxVal.textContent = formatDop(maxV);
    if (mMinVal) mMinVal.textContent = formatDop(minV);
    if (mMaxVal) mMaxVal.textContent = formatDop(maxV);

    updateTrack(minInput, maxInput, track);
    if (mMinInput && mMaxInput) updateTrack(mMinInput, mMaxInput, mTrack);

    handlePriceChange();
  }

  minInput.addEventListener('input', () => syncSliders(false));
  maxInput.addEventListener('input', () => syncSliders(false));

  if (mMinInput && mMaxInput) {
    mMinInput.addEventListener('input', () => syncSliders(true));
    mMaxInput.addEventListener('input', () => syncSliders(true));
  }

  updateTrack(minInput, maxInput, track);
  if (mMinInput && mMaxInput) updateTrack(mMinInput, mMaxInput, mTrack);
}

/* -------------------------------------------------------------
   8. BOOTSTRAPPING
   ------------------------------------------------------------- */

async function initCatalogApp() {
  if (window.FutunetData && window.FutunetData.readyPromise) {
    await window.FutunetData.readyPromise;
  }
  bindCatalogInterface();
  initPriceFilter();
  populateBrandFilter();

  const brandFilter = document.querySelector('[data-catalog-brand-filter]');
  if (brandFilter) {
    brandFilter.addEventListener('change', (e) => {
      state.brand = e.target.value;
      state.page = 0;
      syncQuickFilterChips();
      renderUI();
    });
  }

  const availabilityFilter = document.querySelector('[data-catalog-availability-filter]');
  if (availabilityFilter) {
    availabilityFilter.addEventListener('change', (e) => {
      state.availability = e.target.value;
      state.page = 0;
      syncQuickFilterChips();
      renderUI();
    });
  }

  const sortFilter = document.querySelector('[data-catalog-sort]');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      state.sort = e.target.value;
      state.page = 0;
      renderUI();
    });
  }

  const mobileFilterTrigger = document.getElementById('catalog-mobile-filter-trigger');
  const mobileFilterBarTrigger = document.getElementById('catalog-mobile-filter-bar-trigger');
  const mobileFilterClosers = document.querySelectorAll('[data-close-mobile-filters]');

  if (mobileFilterTrigger) {
    mobileFilterTrigger.addEventListener('click', openMobileFilters);
  }
  if (mobileFilterBarTrigger) {
    mobileFilterBarTrigger.addEventListener('click', openMobileFilters);
  }
  mobileFilterClosers.forEach((button) => {
    button.addEventListener('click', closeMobileFilters);
  });
  window.addEventListener('resize', () => {
    if (!isMobileViewport()) closeMobileFilters();
  });

  const catalogResetTrigger = document.getElementById('catalog-reset-trigger');
  if (catalogResetTrigger) {
    catalogResetTrigger.addEventListener('click', handleCatalogResetAction);
  }

  if (document.getElementById('catalog-grid-container')) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const brand = params.get('brand');
    const availability = params.get('availability');
    const sort = params.get('sort');
    const minParam = Number(params.get('min'));
    const maxParam = Number(params.get('max'));

    state.dept = params.get('cat') || params.get('dept') || 'all';
    state.category = params.get('category') || 'all';
    state.brand = brand || 'all';
    state.availability = availability || 'all';
    state.sort = sort || 'relevance';
    state.searchQuery = q || null;
    state.minPrice = Number.isFinite(minParam) && minParam >= 0 ? minParam : 0;
    state.maxPrice = Number.isFinite(maxParam) && maxParam > 0 ? maxParam : 9999999;

    syncFilterButtons(state.dept);
    syncPriceControlsFromState();
    syncQuickFilterChips();

    const initialInput = document.getElementById('search-catalog-page');
    if (initialInput && q) initialInput.value = q;
    const navInput = document.getElementById('search-navbar');
    if (navInput && q) navInput.value = q;
    const brandControl = document.querySelector('[data-catalog-brand-filter]');
    if (brandControl) brandControl.value = state.brand;
    const availabilityControl = document.querySelector('[data-catalog-availability-filter]');
    if (availabilityControl) availabilityControl.value = state.availability;
    const sortControl = document.querySelector('[data-catalog-sort]');
    if (sortControl) sortControl.value = state.sort;
    if (q) logSearchQuery(q);

    renderUI();
  }

  initPageCart();
  initModalCartButton();

  // Inicializar Buscadores si existen en el DOM
  initSmartSearch('search-home', 'search-drop-home');
  initSmartSearch('search-navbar', 'search-drop-navbar');
  initSmartSearch('search-catalog-page', 'search-drop-catalog');

  // Sincronización reactiva cuando el inventario esté listo o se actualice
  window.addEventListener('futunet:inventory-ready', () => {
    if (document.getElementById('catalog-grid-container')) {
      syncQuickFilterChips();
      renderUI();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalogApp);
} else {
  initCatalogApp();
}

