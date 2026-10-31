const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function hpBlock(id) {
  return `\n     <!-- Trampa Honeypot anti-bots -->\n     <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;pointer-events:none;" aria-hidden="true">\n      <label for="${id}">No llenar este campo</label>\n      <input type="text" id="${id}" name="_hp_security_check" maxlength="50" tabindex="-1" autocomplete="off" />\n     </div>`;
}

console.log('=== APLICANDO HARDENING DE SEGURIDAD DEVSECOPS ===');

// 1. admin-panel.js
const adminPanelPath = path.join(rootDir, 'js', 'admin-panel.js');
let adminPanel = fs.readFileSync(adminPanelPath, 'utf8');

// 1.1 safeCsvCell regex
adminPanel = adminPanel.replace(
  'if (/^\\s*[=+\\-@]/.test(text)) text = "\'" + text;',
  'if (/^\\s*[=+\\-@\\t\\r%]/.test(text)) text = "\'" + text;'
);

// 1.2 Section title and subtitle inputs
adminPanel = adminPanel.replace(
  '<input type="text" value="${escapeAttr(sec.title)}" oninput="AdminPanel.updateSectionTitle(',
  '<input type="text" value="${escapeAttr(sec.title)}" maxlength="150" oninput="AdminPanel.updateSectionTitle('
);
adminPanel = adminPanel.replace(
  '<textarea rows="2" oninput="AdminPanel.updateSectionSubtitle(',
  '<textarea rows="2" maxlength="300" oninput="AdminPanel.updateSectionSubtitle('
);

// 1.3 setDashboardUpdated
adminPanel = adminPanel.replace(
  'updated.innerHTML = \'<span class="admin-live-dot" aria-hidden="true"></span> Datos actualizados a las \' + formatted;',
  'updated.innerHTML = \'<span class="admin-live-dot" aria-hidden="true"></span> Datos actualizados a las \' + escapeHtml(formatted);'
);

// 1.4 exportCompetitorsToWord escaping
const oldWordTable = `      competitorsList.forEach(function (c) {
        html += '<tr>' +
                  '<td>#' + c.rank + '</td>' +
                  '<td><strong>' + c.name + '</strong></td>' +
                  '<td>' + c.relevance + '</td>' +
                  '<td>' + c.marketShare + '%</td>' +
                  '<td>' + c.priceIndex + '/100</td>' +
                  '<td>' + c.techIndex + '/100</td>' +
                  '<td>' + c.serviceIndex + '/100</td>' +
                '</tr>';
      });`;

const newWordTable = `      competitorsList.forEach(function (c) {
        html += '<tr>' +
                  '<td>#' + escapeHtml(String(c.rank || '')) + '</td>' +
                  '<td><strong>' + escapeHtml(c.name || '') + '</strong></td>' +
                  '<td>' + escapeHtml(c.relevance || '') + '</td>' +
                  '<td>' + escapeHtml(String(c.marketShare || '0')) + '%</td>' +
                  '<td>' + escapeHtml(String(c.priceIndex || '0')) + '/100</td>' +
                  '<td>' + escapeHtml(String(c.techIndex || '0')) + '/100</td>' +
                  '<td>' + escapeHtml(String(c.serviceIndex || '0')) + '/100</td>' +
                '</tr>';
      });`;

const oldWordDetails = `        html += '<div style="border-bottom: 1px solid #ccc; padding-bottom: 16px; margin-bottom: 16px;">';
        html += '<h3>' + c.name + ' (Rango #' + c.rank + ' - <span class="badge ' + badgeColor + '">' + c.relevance + '</span>)</h3>';
        html += '<p><strong>Diferenciador Clave:</strong> ' + c.differentiator + '</p>';
        
        html += '<table>';
        html += '<tr>';
        html += '<td style="width:50%; background-color:#f4fbf7;">';
        html += '<strong>Fortalezas:</strong><ul>' + (c.strengths || '').split('\\n').filter(Boolean).map(function(s){ return '<li>' + s + '</li>'; }).join('') + '</ul>';
        html += '</td>';
        html += '<td style="width:50%; background-color:#fff5f5;">';
        html += '<strong>Debilidades:</strong><ul>' + (c.weaknesses || '').split('\\n').filter(Boolean).map(function(w){ return '<li>' + w + '</li>'; }).join('') + '</ul>';
        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<p style="background-color:#eaf2fb; padding: 10px; border-left: 4px solid #0b7eb5; border-radius: 4px;">';
        html += '<strong>Estrategia de Mejora Futunet:</strong> ' + c.improvements;
        html += '</p>';
        html += '</div>';`;

const newWordDetails = `        html += '<div style="border-bottom: 1px solid #ccc; padding-bottom: 16px; margin-bottom: 16px;">';
        html += '<h3>' + escapeHtml(c.name || '') + ' (Rango #' + escapeHtml(String(c.rank || '')) + ' - <span class="badge ' + badgeColor + '">' + escapeHtml(c.relevance || '') + '</span>)</h3>';
        html += '<p><strong>Diferenciador Clave:</strong> ' + escapeHtml(c.differentiator || '') + '</p>';
        
        html += '<table>';
        html += '<tr>';
        html += '<td style="width:50%; background-color:#f4fbf7;">';
        html += '<strong>Fortalezas:</strong><ul>' + (c.strengths || '').split('\\n').filter(Boolean).map(function(s){ return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ul>';
        html += '</td>';
        html += '<td style="width:50%; background-color:#fff5f5;">';
        html += '<strong>Debilidades:</strong><ul>' + (c.weaknesses || '').split('\\n').filter(Boolean).map(function(w){ return '<li>' + escapeHtml(w) + '</li>'; }).join('') + '</ul>';
        html += '</td>';
        html += '</tr>';
        html += '</table>';

        html += '<p style="background-color:#eaf2fb; padding: 10px; border-left: 4px solid #0b7eb5; border-radius: 4px;">';
        html += '<strong>Estrategia de Mejora Futunet:</strong> ' + escapeHtml(c.improvements || '');
        html += '</p>';
        html += '</div>';`;

// Normalize \r\n for replacement
const normAdmin = adminPanel.replace(/\r\n/g, '\n');
const normOldTable = oldWordTable.replace(/\r\n/g, '\n');
const normNewTable = newWordTable.replace(/\r\n/g, '\n');
const normOldDetails = oldWordDetails.replace(/\r\n/g, '\n');
const normNewDetails = newWordDetails.replace(/\r\n/g, '\n');

let replacedAdmin = normAdmin.replace(normOldTable, normNewTable).replace(normOldDetails, normNewDetails);
fs.writeFileSync(adminPanelPath, replacedAdmin, 'utf8');
console.log('[OK] js/admin-panel.js endurecido.');

// 2. facturacion.js
const factPath = path.join(rootDir, 'js', 'facturacion.js');
let factContent = fs.readFileSync(factPath, 'utf8');

factContent = factContent.replace(
  '<input type="text" class="form-input row-product-search" placeholder="Escribe para buscar..."',
  '<input type="text" class="form-input row-product-search" maxlength="250" placeholder="Escribe para buscar..."'
);
factContent = factContent.replace(
  '<input type="number" class="form-input row-price" step="0.01" min="0" value="${itemData ? itemData.price : \'0.00\'}" required',
  '<input type="number" class="form-input row-price" step="0.01" min="0" max="999999999" value="${itemData ? itemData.price : \'0.00\'}" required'
);
factContent = factContent.replace(
  '<input type="number" class="form-input row-qty" min="1" value="${itemData ? itemData.qty : \'1\'}" required',
  '<input type="number" class="form-input row-qty" min="1" max="999999" value="${itemData ? itemData.qty : \'1\'}" required'
);
factContent = factContent.replace(
  '<input type="number" class="form-input row-tax" step="0.01" min="0" value="${rowTaxAmount.toFixed(2)}"',
  '<input type="number" class="form-input row-tax" step="0.01" min="0" max="999999999" value="${rowTaxAmount.toFixed(2)}"'
);
fs.writeFileSync(factPath, factContent, 'utf8');
console.log('[OK] js/facturacion.js endurecido (bounds dinámicos).');

// 3. ai/js/ai-gemini.js
const aiGeminiPath = path.join(rootDir, 'ai', 'js', 'ai-gemini.js');
let aiGemini = fs.readFileSync(aiGeminiPath, 'utf8');
aiGemini = aiGemini.replace(
  'const url = `${GEMINI_API_BASE}/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;',
  'const url = `${GEMINI_API_BASE}/models/${geminiModel}:streamGenerateContent?alt=sse`;'
);
aiGemini = aiGemini.replace(
  "fetch(url, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },",
  "fetch(url, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n          'x-goog-api-key': apiKey\n        },"
);
fs.writeFileSync(aiGeminiPath, aiGemini, 'utf8');
console.log('[OK] ai/js/ai-gemini.js endurecido (API key en header HTTP).');

// 4. js/ai-server.js
const aiServerPath = path.join(rootDir, 'js', 'ai-server.js');
let aiServer = fs.readFileSync(aiServerPath, 'utf8');
aiServer = aiServer.replace(
  "var url = GEMINI_API_BASE + '/models/' + model + ':streamGenerateContent?alt=sse&key=' + apiKey;",
  "var url = GEMINI_API_BASE + '/models/' + model + ':streamGenerateContent?alt=sse';"
);
aiServer = aiServer.replace(
  "var res = await fetch(url, {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },",
  "var res = await fetch(url, {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n        'x-goog-api-key': apiKey\n      },"
);
fs.writeFileSync(aiServerPath, aiServer, 'utf8');
console.log('[OK] js/ai-server.js endurecido (API key en header HTTP).');

// 5. Honeypots en admin.html
const adminHtmlPath = path.join(rootDir, 'admin.html');
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');

const adminForms = [
  { id: 'tech-map-form', hpId: 'tech-map-hp-check' },
  { id: 'config-form', hpId: 'config-hp-check' },
  { id: 'banner-form', hpId: 'banner-hp-check' },
  { id: 'category-form', hpId: 'cat-hp-check' },
  { id: 'brand-form', hpId: 'brand-hp-check' },
  { id: 'product-form', hpId: 'prod-hp-check' },
  { id: 'user-form', hpId: 'edit-user-hp-check' },
  { id: 'financing-account-form', hpId: 'fin-acc-hp-check' },
  { id: 'financing-payment-form', hpId: 'fin-pay-hp-check' },
  { id: 'discount-form', hpId: 'disc-hp-check' },
  { id: 'internet-client-form', hpId: 'inet-client-hp-check' },
  { id: 'competitor-form', hpId: 'comp-hp-check' }
];

adminForms.forEach(f => {
  const formRegex = new RegExp(`(<form\\b[^>]*id=["']${f.id}["'][^>]*>)`, 'i');
  if (formRegex.test(adminHtml) && !adminHtml.includes(f.hpId)) {
    adminHtml = adminHtml.replace(formRegex, `$1${hpBlock(f.hpId)}`);
  }
});

// SRI en admin.html
adminHtml = adminHtml.replace(
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"></script>',
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js" integrity="sha384-b0GXujLkk9eYYSmcSfoyZbfyElGAQnDyY0skCHSG6w3JgTMFnz11ggrTAr7seu9f" crossorigin="anonymous"></script>'
);
adminHtml = adminHtml.replace(
  '<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>',
  '<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" integrity="sha384-vtjasyidUo0kW94K5MXDXntzOJpQgBKXmE7e2Ga4LG0skTTLeBi97eFAXsqewJjw" crossorigin="anonymous"></script>'
);
adminHtml = adminHtml.replace(
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha384-Yv5O+t3uE3hunW8uyrbpPW3iw6/5/Y7HitWJBLgqfMoA36NogMmy+8wWZMpn3HWc" crossorigin="anonymous"></script>'
);
adminHtml = adminHtml.replace(
  '<script defer src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>',
  '<script defer src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" integrity="sha384-ieG+IKD0d/ZPXyCBTMVAbqsQdns8QGJR/e26WMw7M4fkaI/rHcS/YIoi+ah9WGge" crossorigin="anonymous"></script>'
);

fs.writeFileSync(adminHtmlPath, adminHtml, 'utf8');
console.log('[OK] admin.html endurecido (12 honeypots + SRI CDN).');

// 6. Honeypots en facturacion.html
const factHtmlPath = path.join(rootDir, 'facturacion.html');
let factHtml = fs.readFileSync(factHtmlPath, 'utf8');

const factForms = [
  { id: 'invoice-editor-form', hpId: 'inv-editor-hp-check' },
  { id: 'client-editor-form', hpId: 'client-editor-hp-check' },
  { id: 'product-editor-form', hpId: 'prod-editor-hp-check' },
  { id: 'erp-purchase-form', hpId: 'erp-purchase-hp-check' },
  { id: 'erp-bank-form', hpId: 'erp-bank-hp-check' },
  { id: 'settings-editor-form', hpId: 'settings-editor-hp-check' },
  { id: 'payment-register-form', hpId: 'pay-reg-hp-check' },
  { id: 'fiscal-adjustment-form', hpId: 'fisc-adj-hp-check' },
  { id: 'cash-open-form', hpId: 'cash-open-hp-check' },
  { id: 'cash-close-form', hpId: 'cash-close-hp-check' },
  { id: 'pos-cash-payment-form', hpId: 'pos-cash-hp-check' },
  { id: 'general-abono-form', hpId: 'gen-abono-hp-check' }
];

factForms.forEach(f => {
  const formRegex = new RegExp(`(<form\\b[^>]*id=["']${f.id}["'][^>]*>)`, 'i');
  if (formRegex.test(factHtml) && !factHtml.includes(f.hpId)) {
    factHtml = factHtml.replace(formRegex, `$1${hpBlock(f.hpId)}`);
  }
});

// SRI en facturacion.html
factHtml = factHtml.replace(
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"></script>',
  '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js" integrity="sha384-b0GXujLkk9eYYSmcSfoyZbfyElGAQnDyY0skCHSG6w3JgTMFnz11ggrTAr7seu9f" crossorigin="anonymous"></script>'
);
factHtml = factHtml.replace(
  '<script defer src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>',
  '<script defer src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" integrity="sha384-ieG+IKD0d/ZPXyCBTMVAbqsQdns8QGJR/e26WMw7M4fkaI/rHcS/YIoi+ah9WGge" crossorigin="anonymous"></script>'
);
factHtml = factHtml.replace(
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha384-Yv5O+t3uE3hunW8uyrbpPW3iw6/5/Y7HitWJBLgqfMoA36NogMmy+8wWZMpn3HWc" crossorigin="anonymous"></script>'
);

fs.writeFileSync(factHtmlPath, factHtml, 'utf8');
console.log('[OK] facturacion.html endurecido (12 honeypots + SRI CDN).');

// 7. Bump sw.js a v56
const swPath = path.join(rootDir, 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(
  "const CACHE_NAME = 'futunet-cache-v55';",
  "const CACHE_NAME = 'futunet-cache-v56';"
);
fs.writeFileSync(swPath, swContent, 'utf8');
console.log('[OK] sw.js bump a futunet-cache-v56.');

console.log('=== HARDENING APLICADO EXITOSAMENTE ===');
