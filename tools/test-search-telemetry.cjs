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
  'brio 4k'
];

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
  }
});
