const fs = require('fs');
const path = require('path');

const catPath = path.resolve(__dirname, '../js/catalog.js');
let content = fs.readFileSync(catPath, 'utf8');

// 1. Stem variants
const targetStem = "if (word === 'ipc6854' || word === 'ipc6854sr' || word === 'ptz33x' || word === 'ptz-33x') variants.push('uniview', 'unv', 'ptz', 'camara', 'lighthunter', '33x', '4mp', 'deep', 'learning', 'seguridad');";
if (!content.includes(targetStem)) {
  console.error('Target stem not found in catalog.js');
  process.exit(1);
}

const newStems = `${targetStem}
  if (word === 'c9200' || word === 'c9200l' || word === 'catalyst9200') variants.push('cisco', 'catalyst', 'switch', 'layer3', 'poe', 'sfp', '10g', 'redes');
  if (word === 'u6ent' || word === 'u6-enterprise' || word === 'u6enterprise') variants.push('ubiquiti', 'unifi', 'enterprise', 'wifi6e', '6ghz', 'ap', 'access', 'point', 'redes');
  if (word === 'ccr2004' || word === 'ccr2004-16g') variants.push('mikrotik', 'ccr', 'cloud', 'core', 'router', 'pasivo', 'silencioso', 'sfp', 'redes');
  if (word === 'eap670' || word === 'omada-eap670') variants.push('tplink', 'tp-link', 'omada', 'eap', 'ax5400', 'ap', 'wifi6', 'redes');
  if (word === 'l530u' || word === 'powerlite-l530u') variants.push('epson', 'powerlite', 'proyector', 'laser', '3lcd', '5200', 'wuxga', 'oficina');
  if (word === 'srv6k' || word === 'srv6krilrk' || word === 'srv6000') variants.push('apc', 'schneider', 'easy', 'ups', 'srv', '6kva', '6000va', 'online', 'rack', 'energia');`;

content = content.replace(targetStem, newStems);

// 2. Score boosting
const targetBoost = `  // Priorizar Uniview LightHunter PTZ 33x al buscar ipc6854, uniview ptz, camara ptz uniview, ptz 33x uniview, lighthunter ptz (SUG-U4330)
  if (/\\b(ipc6854|ipc6854sr|uniview\\s*ptz|camara\\s*ptz\\s*uniview|ptz\\s*33x\\s*uniview|lighthunter\\s*ptz|ptz\\s*uniview)\\b/i.test(normalizedQuery) || (/\\b(uniview|unv)\\b/i.test(normalizedQuery) && /\\b(ptz|33x|lighthunter|ipc6854)\\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('uniview') || product.brand.toLowerCase() === 'unv')) {
      if (/ptz|33x|ipc6854/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }`;

if (!content.includes(targetBoost)) {
  console.error('Target boost not found in catalog.js');
  process.exit(1);
}

const newBoosts = `${targetBoost}

  // Priorizar Cisco Catalyst 9200L al buscar c9200, c9200l, catalyst 9200, switch cisco layer 3 (SUG-C9200)
  if (/\\b(c9200|c9200l|catalyst\\s*9200|switch\\s*cisco\\s*layer\\s*3|c9200l-24p|cisco\\s*9200)\\b/i.test(normalizedQuery) || (/\\b(cisco)\\b/i.test(normalizedQuery) && /\\b(9200|catalyst|layer\\s*3|c9200l)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('cisco')) {
      if (/9200|catalyst\\s*9200/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Ubiquiti UniFi U6 Enterprise al buscar u6-enterprise, u6 enterprise, u6ent, unifi enterprise, ap wifi 6e (SUG-U6ENT)
  if (/\\b(u6-enterprise|u6\\s*enterprise|u6ent|unifi\\s*enterprise|ap\\s*wifi\\s*6e|u6\\s*ent)\\b/i.test(normalizedQuery) || (/\\b(ubiquiti|unifi)\\b/i.test(normalizedQuery) && /\\b(enterprise|u6|6e)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('ubiquiti')) {
      if (/u6\\s*enterprise|enterprise/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar MikroTik CCR2004-16G-2S+PC al buscar ccr2004, mikrotik ccr2004, router ccr mikrotik, ccr pasivo (SUG-M2004)
  if (/\\b(ccr2004|ccr\\s*2004|ccr2004-16g|mikrotik\\s*ccr|router\\s*ccr|ccr\\s*pasivo)\\b/i.test(normalizedQuery) || (/\\b(mikrotik)\\b/i.test(normalizedQuery) && /\\b(ccr|ccr2004|cloud\\s*core)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('mikrotik')) {
      if (/ccr2004|cloud\\s*core/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar TP-Link Omada EAP670 al buscar eap670, omada eap670, tplink eap670, ap ax5400 (SUG-T6700)
  if (/\\b(eap670|omada\\s*eap670|tplink\\s*eap670|eap-670|ap\\s*ax5400)\\b/i.test(normalizedQuery) || (/\\b(tp-link|tplink|omada)\\b/i.test(normalizedQuery) && /\\b(eap670|ax5400|eap)\\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('tp-link') || product.brand.toLowerCase().includes('tplink'))) {
      if (/eap670|ax5400/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Epson PowerLite L530U Láser al buscar l530u, epson l530u, proyector epson laser, powerlite l530u (SUG-E5300)
  if (/\\b(l530u|epson\\s*l530u|proyector\\s*epson\\s*laser|powerlite\\s*l530u|l530|proyector\\s*laser\\s*epson)\\b/i.test(normalizedQuery) || (/\\b(epson)\\b/i.test(normalizedQuery) && /\\b(l530u|laser|powerlite|5200)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('epson')) {
      if (/l530u|laser/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar APC Easy UPS SRV 6kVA al buscar srv6k, srv6krilrk, apc 6kva, ups 6kva online, ups rack apc 6000va (SUG-A6000)
  if (/\\b(srv6k|srv6krilrk|apc\\s*6kva|ups\\s*6kva|ups\\s*rack\\s*apc\\s*6000va|srv\\s*6000)\\b/i.test(normalizedQuery) || (/\\b(apc|schneider)\\b/i.test(normalizedQuery) && /\\b(srv6k|6kva|6000va|srv6krilrk)\\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('schneider') || product.brand.toLowerCase().includes('apc'))) {
      if (/srv\\s*6kva|6000va|srv6k/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }`;

content = content.replace(targetBoost, newBoosts);

fs.writeFileSync(catPath, content, 'utf8');
console.log('[OK] js/catalog.js actualizado con stems y boosts de Lote 31.');
