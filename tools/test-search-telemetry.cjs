const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const mockDatabase = require('../js/backup_data.js');
const catalogJs = fs.readFileSync(path.resolve(__dirname, '../js/catalog.js'), 'utf8');

const sandbox = { console };
vm.createContext(sandbox);

const start = catalogJs.indexOf('function normalizeSearch');
const end = catalogJs.indexOf('function getExplicitAvailability');
const snippet = catalogJs.substring(start, end);

vm.runInContext(snippet, sandbox);

const normalizeSearch = sandbox.normalizeSearch;
const scoreProductMatch = sandbox.scoreProductMatch;

const testQueries = [
  'proyector',
  'proyectores',
  'computadoras',
  'computadora',
  'laptop',
  'laptops',
  'aire acondicionado',
  'aire acondicionado tgm mini-split 18,000 btu',
  'aire',
  'tgm',
  'dell',
  'monitor',
  'airpods',
  'teclado',
  'escritorio',
  'papeleria',
  'suministros',
  'hikvision',
  'cisco',
  'ubiquiti',
  'ups',
  'silla',
  'sillas',
  'silla ergonomica',
  'forza',
  'mini pc',
  'hdv230',
  'panasonic',
  'srx300',
  'juniper',
  'sirius',
  'contactor',
  'wall connector',
  'cassette',
  'ip150',
  'velop',
  'h8c',
  'meetup',
  'tl400b',
  'u6 pro',
  'flip pro',
  'precision 3660',
  'apc pdu',
  'dahua facial',
  'ultrawide',
  'hap ax3',
  'cbs350 8p',
  'smt1500c',
  'thinkpad e16',
  'omada',
  'l5590',
  'acusense',
  'lrt224',
  'gs724tp',
  'smartshunt',
  'tgp600',
  'ex2300-c',
  'msz-gl12',
  'mg5050',
  'logo 230rce',
  'uk-ultra',
  'tioc',
  'cbs350-24p',
  'smt2200',
  'universal wall connector',
  'crs326',
  'db2 pro',
  'brio 4k',
  'm7',
  'tab m11',
  '27qn880',
  'm6 pro',
  'cerbo gx',
  'velop pro 7',
  'sinamics v20',
  'kx-ns500',
  'srx320',
  'msz-gl24',
  'tm70',
  'backup gateway',
  'ex3400',
  'powerwall 3',
  'crs328',
  'lynx distributor',
  'eb8',
  'rally plus',
  'the frame',  'cmp200',
  'elitebook',
  'thinkpad t14',
  'ultrafine',
  'wax630',
  'lgs328pc',
  'switch linksys poe',
  'mitsubishi 9000',
  'aire mitsubishi 9k',
  'hdv430',
  'telefono video panasonic',
  'evo192',
  'paradox evo',
  '3rw30',
  'arrancador suave siemens'
,
  'nsx100f',
  'c9105ax',
  'usw-pro-24',
  'nvr4216',
  'er7206',
  'crs305',
  'multiplus-ii',
  'speedface',
  'h8 pro',
  'neo 50s',
  'pro sff 400',
  'mist ap43',
  '32un880',
  'lgs352mpc',
  'm4250'];

test('Telemetría y Relevancia de Búsquedas en Catálogo Real: todas las consultas clave tienen resultados pertinentes', () => {
  for (const q of testQueries) {
    const normQ = normalizeSearch(q);
    const scored = mockDatabase
      .map(p => ({ p, score: scoreProductMatch(p, normQ) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    assert.ok(scored.length > 0, `La consulta "${q}" no debe arrojar 0 resultados en el catálogo`);

    if (q === 'mini pc') {
      assert.strictEqual(
        scored[0].p.brand,
        'Lenovo',
        'La búsqueda "mini pc" debe priorizar el Mini PC Lenovo ThinkCentre M70q Tiny'
      );
      assert.ok(
        /m70q|thinkcentre|tiny/i.test(scored[0].p.title),
        'El producto top para "mini pc" debe ser Lenovo ThinkCentre M70q Tiny'
      );
    }

    if (q === 'hdv230') {
      assert.strictEqual(
        scored[0].p.brand,
        'Panasonic',
        'La búsqueda "hdv230" debe priorizar el Teléfono IP Panasonic KX-HDV230'
      );
      assert.ok(
        /hdv230/i.test(scored[0].p.title),
        'El producto top para "hdv230" debe ser Panasonic KX-HDV230'
      );
    }

    if (q === 'srx300') {
      assert.strictEqual(
        scored[0].p.brand,
        'Juniper',
        'La búsqueda "srx300" debe priorizar el Gateway Juniper Networks SRX300'
      );
      assert.ok(
        /srx300/i.test(scored[0].p.title),
        'El producto top para "srx300" debe ser Juniper Networks SRX300'
      );
    }

    if (q === 'sirius') {
      assert.strictEqual(
        scored[0].p.brand,
        'Siemens',
        'La búsqueda "sirius" debe priorizar el Contactor Siemens Sirius 3RT'
      );
      assert.ok(
        /sirius|3rt/i.test(scored[0].p.title),
        'El producto top para "sirius" debe ser Siemens Sirius 3RT'
      );
    }

    if (q === 'wall connector') {
      assert.strictEqual(
        scored[0].p.brand,
        'Tesla',
        'La búsqueda "wall connector" debe priorizar el Cargador Tesla Wall Connector Gen 3'
      );
      assert.ok(
        /wall\s*connector/i.test(scored[0].p.title),
        'El producto top para "wall connector" debe ser Tesla Wall Connector'
      );
    }

    if (q === 'cassette') {
      assert.strictEqual(
        scored[0].p.brand,
        'Mitsubishi',
        'La búsqueda "cassette" debe priorizar el Aire Acondicionado Cassette Mitsubishi Electric'
      );
      assert.ok(
        /cassette/i.test(scored[0].p.title),
        'El producto top para "cassette" debe ser Cassette Mitsubishi Electric'
      );
    }

    if (q === 'ip150') {
      assert.strictEqual(
        scored[0].p.brand,
        'Paradox',
        'La búsqueda "ip150" debe priorizar el Módulo Comunicador Paradox IP150+'
      );
      assert.ok(
        /ip150/i.test(scored[0].p.title),
        'El producto top para "ip150" debe ser Paradox IP150+'
      );
    }

    if (q === 'velop') {
      assert.strictEqual(
        scored[0].p.brand,
        'Linksys',
        'La búsqueda "velop" debe priorizar el Sistema Mesh Linksys Velop Pro 6E'
      );
      assert.ok(
        /velop/i.test(scored[0].p.title),
        'El producto top para "velop" debe ser Linksys Velop Pro 6E'
      );
    }

    if (q === 'h8c') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ezviz',
        'La búsqueda "h8c" debe priorizar la Cámara PTZ Exterior Ezviz H8c'
      );
      assert.ok(
        /h8c/i.test(scored[0].p.title),
        'El producto top para "h8c" debe ser Ezviz H8c'
      );
    }

    if (q === 'meetup') {
      assert.strictEqual(
        scored[0].p.brand,
        'Logitech',
        'La búsqueda "meetup" debe priorizar la Cámara de Videoconferencia Logitech MeetUp'
      );
      assert.ok(
        /meetup/i.test(scored[0].p.title),
        'El producto top para "meetup" debe ser Logitech MeetUp'
      );
    }

    if (q === 'tl400b') {
      assert.strictEqual(
        scored[0].p.brand,
        'ZKTeco',
        'La búsqueda "tl400b" debe priorizar la Cerradura Digital Inteligente ZKTeco TL400B'
      );
      assert.ok(
        /tl400b/i.test(scored[0].p.title),
        'El producto top para "tl400b" debe ser ZKTeco TL400B'
      );
    }

    if (q === 'u6 pro') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ubiquiti',
        'La búsqueda "u6 pro" debe priorizar el Punto de Acceso Ubiquiti UniFi 6 Pro'
      );
      assert.ok(
        /u6-pro|u6\s*pro/i.test(scored[0].p.title),
        'El producto top para "u6 pro" debe ser Ubiquiti UniFi 6 Pro'
      );
    }

    if (q === 'flip pro') {
      assert.strictEqual(
        scored[0].p.brand,
        'Samsung',
        'La búsqueda "flip pro" debe priorizar la Pantalla Interactiva Samsung Flip Pro'
      );
      assert.ok(
        /flip\s*pro|interactiva/i.test(scored[0].p.title),
        'El producto top para "flip pro" debe ser Samsung Flip Pro'
      );
    }

    if (q === 'precision 3660') {
      assert.strictEqual(
        scored[0].p.brand,
        'Dell',
        'La búsqueda "precision 3660" debe priorizar la Workstation Dell Precision 3660'
      );
      assert.ok(
        /precision\s*3660/i.test(scored[0].p.title),
        'El producto top para "precision 3660" debe ser Dell Precision 3660'
      );
    }

    if (q === 'apc pdu') {
      assert.strictEqual(
        scored[0].p.brand,
        'Schneider Electric',
        'La búsqueda "apc pdu" debe priorizar la Unidad PDU APC by Schneider Electric'
      );
      assert.ok(
        /pdu|metered/i.test(scored[0].p.title),
        'El producto top para "apc pdu" debe ser APC Metered Rack PDU'
      );
    }

    if (q === 'dahua facial') {
      assert.strictEqual(
        scored[0].p.brand,
        'Dahua',
        'La búsqueda "dahua facial" debe priorizar la Terminal Facial Dahua IA'
      );
      assert.ok(
        /facial|reconocimiento\s*facial/i.test(scored[0].p.title),
        'El producto top para "dahua facial" debe ser la Terminal Facial Dahua'
      );
    }

    if (q === 'ultrawide') {
      assert.strictEqual(
        scored[0].p.brand,
        'LG',
        'La búsqueda "ultrawide" debe priorizar el Monitor UltraWide LG 34WP500-B'
      );
      assert.ok(
        /ultrawide|34wp500/i.test(scored[0].p.title),
        'El producto top para "ultrawide" debe ser Monitor UltraWide LG'
      );
    }

    if (q === 'hap ax3') {
      assert.strictEqual(
        scored[0].p.brand,
        'MikroTik',
        'La búsqueda "hap ax3" debe priorizar el Router MikroTik hAP ax³'
      );
      assert.ok(
        /hap\s*ax|ax1800/i.test(scored[0].p.title),
        'El producto top para "hap ax3" debe ser MikroTik hAP ax³'
      );
    }

    if (q === 'cbs350 8p') {
      assert.strictEqual(
        scored[0].p.brand,
        'Cisco',
        'La búsqueda "cbs350 8p" debe priorizar el Switch Cisco Business CBS350-8P'
      );
      assert.ok(
        /cbs350-8p|8\s*puertos\s*gigabit\s*poe/i.test(scored[0].p.title),
        'El producto top para "cbs350 8p" debe ser Cisco Business CBS350-8P'
      );
    }

    if (q === 'smt1500c') {
      assert.strictEqual(
        scored[0].p.brand,
        'Schneider Electric',
        'La búsqueda "smt1500c" debe priorizar el UPS APC Smart-UPS SMT1500C'
      );
      assert.ok(
        /smart-ups|smt1500/i.test(scored[0].p.title),
        'El producto top para "smt1500c" debe ser APC Smart-UPS SMT1500C'
      );
    }

    if (q === 'thinkpad e16') {
      assert.strictEqual(
        scored[0].p.brand,
        'Lenovo',
        'La búsqueda "thinkpad e16" debe priorizar la Laptop Lenovo ThinkPad E16'
      );
      assert.ok(
        /thinkpad\s*e16/i.test(scored[0].p.title),
        'El producto top para "thinkpad e16" debe ser Lenovo ThinkPad E16'
      );
    }

    if (q === 'omada') {
      assert.strictEqual(
        scored[0].p.brand,
        'TP-Link',
        'La búsqueda "omada" debe priorizar el Punto de Acceso TP-Link Omada EAP653'
      );
      assert.ok(
        /omada|eap653/i.test(scored[0].p.title),
        'El producto top para "omada" debe ser TP-Link Omada EAP653'
      );
    }

    if (q === 'l5590') {
      assert.strictEqual(
        scored[0].p.brand,
        'Epson',
        'La búsqueda "l5590" debe priorizar la Impresora Epson EcoTank L5590'
      );
      assert.ok(
        /l5590|ecotank/i.test(scored[0].p.title),
        'El producto top para "l5590" debe ser Epson EcoTank L5590'
      );
    }

    if (q === 'acusense') {
      assert.strictEqual(
        scored[0].p.brand,
        'Hikvision',
        'La búsqueda "acusense" debe priorizar la Cámara Hikvision AcuSense 4K'
      );
      assert.ok(
        /acusense|2cd2183g2/i.test(scored[0].p.title),
        'El producto top para "acusense" debe ser Hikvision AcuSense 4K'
      );
    }

    if (q === 'lrt224') {
      assert.strictEqual(
        scored[0].p.brand,
        'Linksys',
        'La búsqueda "lrt224" debe priorizar el Router VPN Dual-WAN Linksys LRT224'
      );
      assert.ok(
        /lrt224|dual-wan/i.test(scored[0].p.title),
        'El producto top para "lrt224" debe ser Linksys LRT224'
      );
    }

    if (q === 'gs724tp') {
      assert.strictEqual(
        scored[0].p.brand,
        'Netgear',
        'La búsqueda "gs724tp" debe priorizar el Switch Netgear ProSAFE GS724TPv2 24P PoE+'
      );
      assert.ok(
        /gs724tp/i.test(scored[0].p.title),
        'El producto top para "gs724tp" debe ser Netgear GS724TPv2'
      );
    }

    if (q === 'smartshunt') {
      assert.strictEqual(
        scored[0].p.brand,
        'Victron Energy',
        'La búsqueda "smartshunt" debe priorizar el Monitor Victron SmartShunt 500A'
      );
      assert.ok(
        /smartshunt|shunt/i.test(scored[0].p.title),
        'El producto top para "smartshunt" debe ser Victron Energy SmartShunt'
      );
    }

    if (q === 'tgp600') {
      assert.strictEqual(
        scored[0].p.brand,
        'Panasonic',
        'La búsqueda "tgp600" debe priorizar el Teléfono DECT IP Panasonic KX-TGP600'
      );
      assert.ok(
        /tgp600|dect/i.test(scored[0].p.title),
        'El producto top para "tgp600" debe ser Panasonic KX-TGP600'
      );
    }

    if (q === 'ex2300-c') {
      assert.strictEqual(
        scored[0].p.brand,
        'Juniper',
        'La búsqueda "ex2300-c" debe priorizar el Switch Fanless Juniper EX2300-C-12P'
      );
      assert.ok(
        /ex2300-c|12\s*puertos/i.test(scored[0].p.title),
        'El producto top para "ex2300-c" debe ser Juniper Networks EX2300-C-12P'
      );
    }

    if (q === 'msz-gl12') {
      assert.strictEqual(
        scored[0].p.brand,
        'Mitsubishi',
        'La búsqueda "msz-gl12" debe priorizar el Aire Inverter Mitsubishi MSZ-GL 12,000 BTU'
      );
      assert.ok(
        /12,000\s*btu|msz-gl\s*12/i.test(scored[0].p.title),
        'El producto top para "msz-gl12" debe ser Mitsubishi MSZ-GL 12,000 BTU'
      );
    }

    if (q === 'mg5050') {
      assert.strictEqual(
        scored[0].p.brand,
        'Paradox',
        'La búsqueda "mg5050" debe priorizar el Panel de Alarma Paradox Magellan MG5050+'
      );
      assert.ok(
        /mg5050|magellan/i.test(scored[0].p.title),
        'El producto top para "mg5050" debe ser Paradox Magellan MG5050+'
      );
    }

    if (q === 'logo 230rce') {
      assert.strictEqual(
        scored[0].p.brand,
        'Siemens',
        'La búsqueda "logo 230rce" debe priorizar el Micro-PLC Siemens LOGO! 230RCE'
      );
      assert.ok(
        /logo!?|230rce/i.test(scored[0].p.title),
        'El producto top para "logo 230rce" debe ser Siemens LOGO! 230RCE'
      );
    }

    if (q === 'uk-ultra') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ubiquiti',
        'La búsqueda "uk-ultra" debe priorizar el AP Ubiquiti UK-Ultra'
      );
      assert.ok(
        /uk-ultra|swiss\s*army\s*knife/i.test(scored[0].p.title),
        'El producto top para "uk-ultra" debe ser Ubiquiti UniFi Swiss Army Knife Ultra'
      );
    }

    if (q === 'tioc') {
      assert.strictEqual(
        scored[0].p.brand,
        'Dahua',
        'La búsqueda "tioc" debe priorizar la Cámara Dahua TiOC 2.0 4MP'
      );
      assert.ok(
        /tioc|disuasion\s*activa|3449/i.test(scored[0].p.title),
        'El producto top para "tioc" debe ser Dahua TiOC 2.0'
      );
    }

    if (q === 'cbs350-24p') {
      assert.strictEqual(
        scored[0].p.brand,
        'Cisco',
        'La búsqueda "cbs350-24p" debe priorizar el Switch Cisco CBS350-24P-4G'
      );
      assert.ok(
        /cbs350-24p|24\s*puertos\s*gigabit\s*poe/i.test(scored[0].p.title),
        'El producto top para "cbs350-24p" debe ser Cisco CBS350-24P-4G'
      );
    }

    if (q === 'smt2200') {
      assert.strictEqual(
        scored[0].p.brand,
        'Schneider Electric',
        'La búsqueda "smt2200" debe priorizar el UPS APC Smart-UPS SMT2200RM2U'
      );
      assert.ok(
        /smt2200|2200va/i.test(scored[0].p.title),
        'El producto top para "smt2200" debe ser APC Smart-UPS SMT2200RM2U'
      );
    }

    if (q === 'universal wall connector') {
      assert.strictEqual(
        scored[0].p.brand,
        'Tesla',
        'La búsqueda "universal wall connector" debe priorizar el cargador Tesla Universal Wall Connector'
      );
      assert.ok(
        /universal\s*wall\s*connector|magic\s*dock/i.test(scored[0].p.title),
        'El producto top para "universal wall connector" debe ser Tesla Universal Wall Connector'
      );
    }

    if (q === 'crs326') {
      assert.strictEqual(
        scored[0].p.brand,
        'MikroTik',
        'La búsqueda "crs326" debe priorizar el Switch MikroTik CRS326'
      );
      assert.ok(
        /crs326/i.test(scored[0].p.title),
        'El producto top para "crs326" debe ser MikroTik CRS326-24G-2S+RM'
      );
    }

    if (q === 'db2 pro') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ezviz',
        'La búsqueda "db2 pro" debe priorizar el timbre inteligente Ezviz DB2 Pro'
      );
      assert.ok(
        /db2\s*pro/i.test(scored[0].p.title),
        'El producto top para "db2 pro" debe ser Ezviz DB2 Pro'
      );
    }

    if (q === 'brio 4k') {
      assert.strictEqual(
        scored[0].p.brand,
        'Logitech',
        'La búsqueda "brio 4k" debe priorizar la cámara web Logitech BRIO 4K Pro'
      );
      assert.ok(
        /brio/i.test(scored[0].p.title),
        'El producto top para "brio 4k" debe ser Logitech BRIO 4K Pro'
      );
    }
    if (q === 'm7') {
      assert.strictEqual(
        scored[0].p.brand,
        'Samsung',
        'La búsqueda "m7" debe priorizar el Samsung Smart Monitor M7 32"'
      );
      assert.ok(
        /m7|smart\s*monitor/i.test(scored[0].p.title),
        'El producto top para "m7" debe ser Samsung Smart Monitor M7 32"'
      );
    }

    if (q === 'tab m11') {
      assert.strictEqual(
        scored[0].p.brand,
        'Lenovo',
        'La búsqueda "tab m11" debe priorizar la Tablet Lenovo Tab M11'
      );
      assert.ok(
        /tab\s*m11/i.test(scored[0].p.title),
        'El producto top para "tab m11" debe ser Lenovo Tab M11'
      );
    }

    if (q === '27qn880') {
      assert.strictEqual(
        scored[0].p.brand,
        'LG',
        'La búsqueda "27qn880" debe priorizar el Monitor LG Ergo 27QN880-B'
      );
      assert.ok(
        /27qn880|ergo/i.test(scored[0].p.title),
        'El producto top para "27qn880" debe ser LG Ergo 27QN880-B'
      );
    }

    if (q === 'm6 pro') {
      assert.strictEqual(
        scored[0].p.brand,
        'Netgear',
        'La búsqueda "m6 pro" debe priorizar el Router Móvil Netgear Nighthawk M6 Pro'
      );
      assert.ok(
        /m6\s*pro|mr6500|nighthawk/i.test(scored[0].p.title),
        'El producto top para "m6 pro" debe ser Netgear Nighthawk M6 Pro'
      );
    }
    if (q === 'cerbo gx') {
      assert.strictEqual(
        scored[0].p.brand,
        'Victron Energy',
        'La búsqueda "cerbo gx" debe priorizar el Victron Cerbo GX'
      );
      assert.ok(
        /cerbo/i.test(scored[0].p.title),
        'El producto top para "cerbo gx" debe ser Victron Cerbo GX'
      );
    }

    if (q === 'velop pro 7') {
      assert.strictEqual(
        scored[0].p.brand,
        'Linksys',
        'La búsqueda "velop pro 7" debe priorizar el Linksys Velop Pro 7'
      );
      assert.ok(
        /velop\s*pro\s*7|wifi\s*7/i.test(scored[0].p.title),
        'El producto top para "velop pro 7" debe ser Linksys Velop Pro 7'
      );
    }

    if (q === 'sinamics v20') {
      assert.strictEqual(
        scored[0].p.brand,
        'Siemens',
        'La búsqueda "sinamics v20" debe priorizar el Siemens SINAMICS V20'
      );
      assert.ok(
        /sinamics|v20|variador/i.test(scored[0].p.title),
        'El producto top para "sinamics v20" debe ser Siemens SINAMICS V20'
      );
    }

    if (q === 'kx-ns500') {
      assert.strictEqual(
        scored[0].p.brand,
        'Panasonic',
        'La búsqueda "kx-ns500" debe priorizar la Central Telefónica Panasonic KX-NS500'
      );
      assert.ok(
        /ns500|central|pbx/i.test(scored[0].p.title),
        'El producto top para "kx-ns500" debe ser Panasonic KX-NS500'
      );
    }
    if (q === 'srx320') {
      assert.ok(
        /Juniper/i.test(scored[0].p.brand),
        'La búsqueda "srx320" debe priorizar el Firewall Juniper SRX320'
      );
      assert.ok(
        /srx320/i.test(scored[0].p.title),
        'El producto top para "srx320" debe ser Juniper SRX320'
      );
    }

    if (q === 'msz-gl24') {
      assert.ok(
        /Mitsubishi/i.test(scored[0].p.brand),
        'La búsqueda "msz-gl24" debe priorizar el Aire Inverter Mitsubishi MSZ-GL 24K'
      );
      assert.ok(
        /24,?000|gl24/i.test(scored[0].p.title),
        'El producto top para "msz-gl24" debe ser Mitsubishi MSZ-GL 24K'
      );
    }

    if (q === 'tm70') {
      assert.strictEqual(
        scored[0].p.brand,
        'Paradox',
        'La búsqueda "tm70" debe priorizar el Teclado Táctil Paradox TM70'
      );
      assert.ok(
        /tm70/i.test(scored[0].p.title),
        'El producto top para "tm70" debe ser Paradox TM70'
      );
    }

    if (q === 'backup gateway') {
      assert.strictEqual(
        scored[0].p.brand,
        'Tesla',
        'La búsqueda "backup gateway" debe priorizar el Tesla Backup Gateway 2'
      );
      assert.ok(
        /backup\s*gateway/i.test(scored[0].p.title),
        'El producto top para "backup gateway" debe ser Tesla Backup Gateway 2'
      );
    }

    if (q === 'ex3400') {
      assert.ok(
        /Juniper/i.test(scored[0].p.brand),
        'La búsqueda "ex3400" debe priorizar el Switch Juniper EX3400-24T'
      );
      assert.ok(
        /ex3400/i.test(scored[0].p.title),
        'El producto top para "ex3400" debe ser Juniper EX3400-24T'
      );
    }

    if (q === 'powerwall 3') {
      assert.strictEqual(
        scored[0].p.brand,
        'Tesla',
        'La búsqueda "powerwall 3" debe priorizar el Tesla Powerwall 3'
      );
      assert.ok(
        /powerwall\s*3/i.test(scored[0].p.title),
        'El producto top para "powerwall 3" debe ser Tesla Powerwall 3'
      );
    }

    if (q === 'crs328') {
      assert.strictEqual(
        scored[0].p.brand,
        'MikroTik',
        'La búsqueda "crs328" debe priorizar el Switch MikroTik CRS328-24P-4S+RM'
      );
      assert.ok(
        /crs328/i.test(scored[0].p.title),
        'El producto top para "crs328" debe ser MikroTik CRS328'
      );
    }

    if (q === 'lynx distributor') {
      assert.ok(
        /Victron/i.test(scored[0].p.brand),
        'La búsqueda "lynx distributor" debe priorizar el Victron Lynx Distributor'
      );
      assert.ok(
        /lynx.*distributor/i.test(scored[0].p.title),
        'El producto top para "lynx distributor" debe ser Victron Lynx Distributor'
      );
    }

    if (q === 'eb8') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ezviz',
        'La búsqueda "eb8" debe priorizar la Cámara Solar Ezviz EB8 4G'
      );
      assert.ok(
        /eb8/i.test(scored[0].p.title),
        'El producto top para "eb8" debe ser Ezviz EB8 4G'
      );
    }

    if (q === 'rally plus') {
      assert.strictEqual(
        scored[0].p.brand,
        'Logitech',
        'La búsqueda "rally plus" debe priorizar el Sistema Logitech Rally Plus'
      );
      assert.ok(
        /rally\s*plus/i.test(scored[0].p.title),
        'El producto top para "rally plus" debe ser Logitech Rally Plus'
      );
    }

    if (q === 'the frame') {
      assert.strictEqual(
        scored[0].p.brand,
        'Samsung',
        'La búsqueda "the frame" debe priorizar la Pantalla Samsung The Frame Pro'
      );
      assert.ok(
        /the\s*frame/i.test(scored[0].p.title),
        'El producto top para "the frame" debe ser Samsung The Frame Pro'
      );
    }

    if (q === 'cmp200') {
      assert.strictEqual(
        scored[0].p.brand,
        'ZKTeco',
        'La búsqueda "cmp200" debe priorizar la Barrera Vehicular ZKTeco CMP200'
      );
      assert.ok(
        /cmp200/i.test(scored[0].p.title),
        'El producto top para "cmp200" debe ser ZKTeco CMP200'
      );
    }
  
    if (q === 'nsx100f') {
      assert.ok(
        /Schneider/i.test(scored[0].p.brand),
        'La búsqueda "nsx100f" debe priorizar el Interruptor Schneider Compact NSX100F'
      );
      assert.ok(
        /nsx100f/i.test(scored[0].p.title),
        'El producto top para "nsx100f" debe ser Schneider Compact NSX100F'
      );
    }

    if (q === 'c9105ax') {
      assert.strictEqual(
        scored[0].p.brand,
        'Cisco',
        'La búsqueda "c9105ax" debe priorizar el Cisco Catalyst 9105AX'
      );
      assert.ok(
        /9105ax/i.test(scored[0].p.title),
        'El producto top para "c9105ax" debe ser Cisco Catalyst 9105AX'
      );
    }

    if (q === 'usw-pro-24') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ubiquiti',
        'La búsqueda "usw-pro-24" debe priorizar el Ubiquiti UniFi Switch Pro 24 PoE'
      );
      assert.ok(
        /pro\s*24/i.test(scored[0].p.title),
        'El producto top para "usw-pro-24" debe ser Ubiquiti UniFi Switch Pro 24 PoE'
      );
    }

    if (q === 'nvr4216') {
      assert.strictEqual(
        scored[0].p.brand,
        'Dahua',
        'La búsqueda "nvr4216" debe priorizar el Grabador Dahua WizSense NVR4216'
      );
      assert.ok(
        /nvr4216/i.test(scored[0].p.title),
        'El producto top para "nvr4216" debe ser Dahua NVR4216 WizSense'
      );
    }

    if (q === 'er7206') {
      assert.strictEqual(
        scored[0].p.brand,
        'TP-Link',
        'La búsqueda "er7206" debe priorizar el Router TP-Link Omada ER7206'
      );
      assert.ok(
        /er7206/i.test(scored[0].p.title),
        'El producto top para "er7206" debe ser TP-Link Omada ER7206'
      );
    }

    if (q === 'crs305') {
      assert.strictEqual(
        scored[0].p.brand,
        'MikroTik',
        'La búsqueda "crs305" debe priorizar el Switch MikroTik CRS305'
      );
      assert.ok(
        /crs305/i.test(scored[0].p.title),
        'El producto top para "crs305" debe ser MikroTik CRS305'
      );
    }

    if (q === 'multiplus-ii') {
      assert.strictEqual(
        scored[0].p.brand,
        'Victron Energy',
        'La búsqueda "multiplus-ii" debe priorizar el Inversor Victron MultiPlus-II'
      );
      assert.ok(
        /multiplus-ii/i.test(scored[0].p.title),
        'El producto top para "multiplus-ii" debe ser Victron MultiPlus-II'
      );
    }

    if (q === 'speedface') {
      assert.strictEqual(
        scored[0].p.brand,
        'ZKTeco',
        'La búsqueda "speedface" debe priorizar la Terminal ZKTeco SpeedFace-V5L'
      );
      assert.ok(
        /speedface/i.test(scored[0].p.title),
        'El producto top para "speedface" debe ser ZKTeco SpeedFace-V5L'
      );
    }

    if (q === 'h8 pro') {
      assert.strictEqual(
        scored[0].p.brand,
        'Ezviz',
        'La búsqueda "h8 pro" debe priorizar la Cámara Ezviz H8 Pro 3K'
      );
      assert.ok(
        /h8\s*pro/i.test(scored[0].p.title),
        'El producto top para "h8 pro" debe ser Ezviz H8 Pro 3K'
      );
    }

    if (q === 'neo 50s') {
      assert.strictEqual(
        scored[0].p.brand,
        'Lenovo',
        'La búsqueda "neo 50s" debe priorizar la Computadora Lenovo ThinkCentre Neo 50s'
      );
      assert.ok(
        /neo\s*50s/i.test(scored[0].p.title),
        'El producto top para "neo 50s" debe ser Lenovo ThinkCentre Neo 50s'
      );
    }

    if (q === 'pro sff 400') {
      assert.strictEqual(
        scored[0].p.brand,
        'HP',
        'La búsqueda "pro sff 400" debe priorizar la Computadora HP Pro SFF 400 G9'
      );
      assert.ok(
        /pro\s*sff\s*400/i.test(scored[0].p.title),
        'El producto top para "pro sff 400" debe ser HP Pro SFF 400 G9'
      );
    }

    if (q === 'mist ap43') {
      assert.strictEqual(
        scored[0].p.brand,
        'Juniper',
        'La búsqueda "mist ap43" debe priorizar el Punto de Acceso Juniper Mist AP43'
      );
      assert.ok(
        /ap43|mist/i.test(scored[0].p.title),
        'El producto top para "mist ap43" debe ser Juniper Mist AP43'
      );
    }

    if (q === '32un880') {
      assert.strictEqual(
        scored[0].p.brand,
        'LG',
        'La búsqueda "32un880" debe priorizar el Monitor LG UltraFine 32UN880-B Ergo'
      );
      assert.ok(
        /32un880/i.test(scored[0].p.title),
        'El producto top para "32un880" debe ser LG UltraFine 32UN880-B Ergo'
      );
    }

    if (q === 'lgs352mpc') {
      assert.strictEqual(
        scored[0].p.brand,
        'Linksys',
        'La búsqueda "lgs352mpc" debe priorizar el Switch Linksys LGS352MPC 48P'
      );
      assert.ok(
        /lgs352mpc/i.test(scored[0].p.title),
        'El producto top para "lgs352mpc" debe ser Linksys LGS352MPC 48P'
      );
    }

    if (q === 'm4250') {
      assert.strictEqual(
        scored[0].p.brand,
        'Netgear',
        'La búsqueda "m4250" debe priorizar el Switch Netgear Pro AV M4250'
      );
      assert.ok(
        /m4250/i.test(scored[0].p.title),
        'El producto top para "m4250" debe ser Netgear Pro AV M4250'
      );
    }
  }
});
