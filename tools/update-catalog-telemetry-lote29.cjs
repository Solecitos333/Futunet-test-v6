const fs = require('fs');
const path = require('path');

const catPath = path.resolve(__dirname, '../js/catalog.js');
let content = fs.readFileSync(catPath, 'utf8');

// 1. Stem variants
const targetStem = "if (word === 'neo50s' || word === 'neo-50s' || word === 'thinkcentre-neo') variants.push('lenovo', 'thinkcentre', 'neo', '50s', 'desktop', 'computadora', 'sff', 'i7', 'oficina');";
if (!content.includes(targetStem)) {
  console.error('Target stem not found in catalog.js');
  process.exit(1);
}

const newStems = `if (word === 'neo50s' || word === 'neo-50s' || word === 'thinkcentre-neo') variants.push('lenovo', 'thinkcentre', 'neo', '50s', 'desktop', 'computadora', 'sff', 'i7', 'oficina');
  if (word === 'pro400' || word === 'sff400' || word === 'prodesk400' || word === 'pro-sff-400') variants.push('hp', 'pro', 'sff', '400', 'g9', 'computadora', 'desktop', 'i7', 'oficina');
  if (word === 'ap43' || word === 'mistap43' || word === 'mist-ap43') variants.push('juniper', 'mist', 'ai', 'wifi', 'access', 'point', 'ap43', 'vble', 'redes');
  if (word === '32un880' || word === '32un880-b' || word === 'ergo32' || word === 'ergo-32') variants.push('lg', 'ultrafine', 'ergo', 'monitor', '4k', 'ips', '32', 'usb-c', 'oficina');
  if (word === 'lgs352mpc' || word === 'lgs352' || word === 'lgs-352mpc') variants.push('linksys', 'switch', 'poe', '740w', '48', 'puertos', 'sfp+', '10g', 'redes');
  if (word === 'm4250' || word === 'gsm4212p' || word === 'm4250-10g2f') variants.push('netgear', 'av', 'line', 'switch', 'poe', 'dante', 'ndi', 'sfp', 'redes');`;

content = content.replace(targetStem, newStems);

// 2. Score boosting
const targetBoost = `  // Priorizar Lenovo ThinkCentre Neo 50s SFF al buscar neo 50s, thinkcentre neo, lenovo neo, desktop lenovo i7 (SUG-L5040)
  if (/\\b(neo\\s*50s|thinkcentre\\s*neo|lenovo\\s*neo|thinkcentre\\s*neo\\s*50s|desktop\\s*lenovo\\s*i7|sff\\s*lenovo)\\b/i.test(normalizedQuery) || (/\\b(lenovo)\\b/i.test(normalizedQuery) && /\\b(neo\\s*50s|neo|thinkcentre\\s*sff|i7-13700)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('lenovo')) {
      if (/neo\\s*50s/i.test(title)) {
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

  // Priorizar HP Pro SFF 400 G9 al buscar pro sff 400, hp 400 g9, prodesk 400, desktop hp i7 (SUG-H4090)
  if (/\\b(pro\\s*sff\\s*400|hp\\s*400\\s*g9|prodesk\\s*400|pro\\s*400\\s*g9|desktop\\s*hp\\s*i7|hp\\s*sff\\s*400)\\b/i.test(normalizedQuery) || (/\\b(hp)\\b/i.test(normalizedQuery) && /\\b(pro\\s*sff|400\\s*g9|prodesk|i7-13700)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('hp')) {
      if (/pro\\s*sff\\s*400|400\\s*g9/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Juniper Mist AP43 al buscar mist ap43, juniper ap43, ap43, mist ai, wifi 6 juniper (SUG-J4300)
  if (/\\b(mist\\s*ap43|juniper\\s*ap43|ap43|mist\\s*ai|wifi\\s*6\\s*juniper|juniper\\s*mist)\\b/i.test(normalizedQuery) || (/\\b(juniper)\\b/i.test(normalizedQuery) && /\\b(mist|ap43|wifi|access\\s*point)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('juniper')) {
      if (/ap43|mist/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar LG UltraFine 32UN880-B Ergo al buscar 32un880, lg ergo 32, ultrafine 32, monitor 4k lg (SUG-L8800)
  if (/\\b(32un880|32un880-b|lg\\s*ergo\\s*32|ultrafine\\s*32|monitor\\s*4k\\s*lg|lg\\s*32\\s*ergo)\\b/i.test(normalizedQuery) || (/\\b(lg)\\b/i.test(normalizedQuery) && /\\b(32un880|ergo|31\\.5|ultrafine\\s*32)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('lg')) {
      if (/32un880/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Linksys LGS352MPC 48P PoE+ al buscar lgs352mpc, linksys 48 puertos, switch poe 48 linksys, linksys 740w (SUG-L3520)
  if (/\\b(lgs352mpc|linksys\\s*48|switch\\s*poe\\s*48\\s*linksys|linksys\\s*740w|lgs352)\\b/i.test(normalizedQuery) || (/\\b(linksys)\\b/i.test(normalizedQuery) && /\\b(lgs352|48\\s*puertos|740w)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('linksys')) {
      if (/lgs352mpc/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }

  // Priorizar Netgear Pro AV M4250-10G2F-PoE+ al buscar m4250, gsm4212p, netgear av, switch dante (SUG-N4250)
  if (/\\b(m4250|gsm4212p|netgear\\s*av|switch\\s*dante|switch\\s*netgear\\s*av|m4250-10g2f)\\b/i.test(normalizedQuery) || (/\\b(netgear)\\b/i.test(normalizedQuery) && /\\b(m4250|gsm4212p|dante|pro\\s*av)\\b/i.test(normalizedQuery))) {
    if (product.brand && product.brand.toLowerCase().includes('netgear')) {
      if (/m4250/i.test(title)) {
        score += 280;
      } else {
        score += 150;
      }
    }
  }`;

content = content.replace(targetBoost, newBoosts);

fs.writeFileSync(catPath, content, 'utf8');
console.log('[OK] js/catalog.js actualizado con stems y boosting de Lote 29.');
