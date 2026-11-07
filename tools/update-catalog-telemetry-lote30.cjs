const fs = require('fs');
const path = require('path');

const catPath = path.resolve(__dirname, '../js/catalog.js');
let content = fs.readFileSync(catPath, 'utf8');

// 1. Stem variants
const targetStem = "if (word === 'm4250' || word === 'gsm4212p' || word === 'm4250-10g2f') variants.push('netgear', 'av', 'line', 'switch', 'poe', 'dante', 'ndi', 'sfp', 'redes');";
if (!content.includes(targetStem)) {
  console.error('Target stem not found in catalog.js');
  process.exit(1);
}

const newStems = `${targetStem}
  if (word === 'pcam36' || word === 'pca-m36' || word === 'pca36') variants.push('mitsubishi', 'electric', 'piso', 'techo', 'consola', 'aire', 'inverter', '36000', 'btu', 'energia');
  if (word === 'hdv800' || word === 'kxhdv800' || word === 'kx-hdv800') variants.push('panasonic', 'conferencia', 'sip', 'telefono', 'omnisound', '360', 'oficina');
  if (word === 'nvx80' || word === 'nvx-80') variants.push('paradox', 'detector', 'sensor', 'exterior', 'seetrue', 'oled', 'pir', 'microondas', 'seguridad');
  if (word === '3va11' || word === '3va1' || word === '3va1112') variants.push('siemens', 'sentron', 'breaker', 'interruptor', 'caja', 'moldeada', '125a', '25ka', 'energia');
  if (word === 'solarinverter' || word === 'tesla-solar' || word === 'tesla-inverter') variants.push('tesla', 'solar', 'inverter', 'inversor', '7.6kw', '7600w', 'mppt', 'energia');
  if (word === 'ipc6854' || word === 'ipc6854sr' || word === 'ptz33x' || word === 'ptz-33x') variants.push('uniview', 'unv', 'ptz', 'camara', 'lighthunter', '33x', '4mp', 'deep', 'learning', 'seguridad');`;

content = content.replace(targetStem, newStems);

// 2. Score boosting
const targetBoost = `  // Priorizar Netgear Pro AV M4250-10G2F-PoE+ al buscar m4250, gsm4212p, netgear av, switch dante (SUG-N4250)
  if (/\\b(m4250|gsm4212p|netgear\\s*av|switch\\s*dante|switch\\s*netgear\\s*av|m4250-10g2f)\\b/i.test(normalizedQuery) || (/\\b(netgear)\\b/i.test(normalizedQuery) && /\\b(m4250|gsm4212p|dante|pro\\s*av)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('netgear')) {
      if (/m4250/i.test(title)) {
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

  // Priorizar Mitsubishi Electric PCA-M 36K Piso-Techo al buscar pca-m36, mitsubishi piso techo, aire piso techo mitsubishi (SUG-M3600)
  if (/\\b(pca-m36|pca\\s*m36|pcam36|mitsubishi\\s*piso\\s*techo|aire\\s*piso\\s*techo\\s*mitsubishi|piso\\s*techo\\s*mitsubishi|consola\\s*mitsubishi)\\b/i.test(normalizedQuery) || (/\\b(mitsubishi)\\b/i.test(normalizedQuery) && /\\b(pca|piso|techo|36k|36000)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('mitsubishi')) {
      if (/pca-m|piso-techo/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Panasonic KX-HDV800 al buscar hdv800, kx-hdv800, panasonic conferencia, telefono conferencia panasonic (SUG-P8000)
  if (/\\b(hdv800|kx-hdv800|kxhdv800|panasonic\\s*conferencia|telefono\\s*conferencia\\s*panasonic|conferencia\\s*panasonic)\\b/i.test(normalizedQuery) || (/\\b(panasonic)\\b/i.test(normalizedQuery) && /\\b(hdv800|conferencia|omnisound)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('panasonic')) {
      if (/hdv800|conferencia/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Paradox NVX80 SeeTrue Exterior al buscar nvx80, paradox nvx80, detector exterior paradox, seetrue paradox (SUG-P8080)
  if (/\\b(nvx80|nvx-80|paradox\\s*nvx80|detector\\s*exterior\\s*paradox|sensor\\s*nvx80|seetrue\\s*paradox)\\b/i.test(normalizedQuery) || (/\\b(paradox)\\b/i.test(normalizedQuery) && /\\b(nvx80|seetrue|detector\\s*exterior)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('paradox')) {
      if (/nvx80/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Siemens Sentron 3VA11 (125A) al buscar 3va11, sentron 3va1, breaker siemens 125a, interruptor caja moldeada siemens (SUG-S3125)
  if (/\\b(3va11|3va1|sentron\\s*3va|breaker\\s*siemens\\s*125a|interruptor\\s*caja\\s*moldeada\\s*siemens|3va1112)\\b/i.test(normalizedQuery) || (/\\b(siemens)\\b/i.test(normalizedQuery) && /\\b(3va11|3va1|125a|caja\\s*moldeada)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('siemens')) {
      if (/3va11/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Tesla Solar Inverter 7.6 kW al buscar tesla solar inverter, inversor tesla, tesla 7.6kw, tesla mppt (SUG-T7600)
  if (/\\b(tesla\\s*solar\\s*inverter|inversor\\s*tesla|tesla\\s*7\\.6kw|tesla\\s*mppt|tesla\\s*inverter|solar\\s*inverter\\s*tesla)\\b/i.test(normalizedQuery) || (/\\b(tesla)\\b/i.test(normalizedQuery) && /\\b(solar\\s*inverter|inversor|7\\.6kw|mppt)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('tesla')) {
      if (/solar\\s*inverter|7\\.6\\s*kw/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Uniview LightHunter PTZ 33x al buscar ipc6854, uniview ptz, camara ptz uniview, ptz 33x uniview, lighthunter ptz (SUG-U4330)
  if (/\\b(ipc6854|ipc6854sr|uniview\\s*ptz|camara\\s*ptz\\s*uniview|ptz\\s*33x\\s*uniview|lighthunter\\s*ptz|ptz\\s*uniview)\\b/i.test(normalizedQuery) || (/\\b(uniview|unv)\\b/i.test(normalizedQuery) && /\\b(ptz|33x|lighthunter|ipc6854)\\b/i.test(normalizedQuery))) {
    if (product.brand && (product.brand.toLowerCase().includes('uniview') || product.brand.toLowerCase() === 'unv')) {
      if (/ptz|33x|ipc6854/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }`;

content = content.replace(targetBoost, newBoosts);

fs.writeFileSync(catPath, content, 'utf8');
console.log('[OK] js/catalog.js actualizado con variantes stem y relevancia de Lote 30.');
