import re
import os

html_src = r"c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\facturacion-creaticos.html"
css_src = r"c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\css\facturacion-creaticos.css"
js_src = r"c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\facturacion-creaticos.js"

html_dst = r"c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\facturacion-futunet.html"
css_dst = r"c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\css\facturacion-futunet.css"
js_dst = r"c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\facturacion-futunet.js"

print("Reading source files...")

with open(html_src, "r", encoding="utf-8") as f:
    html_content = f.read()

with open(css_src, "r", encoding="utf-8") as f:
    css_content = f.read()

with open(js_src, "r", encoding="utf-8") as f:
    js_content = f.read()

# ──────────────────────────────────────────────────────────
# 1. Modify HTML
# ──────────────────────────────────────────────────────────
print("Modifying HTML for Futunet...")
html_mod = html_content
# Replace links
html_mod = html_mod.replace("css/facturacion-creaticos.css", "css/facturacion-futunet.css")
html_mod = html_mod.replace("js/facturacion-creaticos.js", "js/facturacion-futunet.js")
# Replace global namespace
html_mod = html_mod.replace("CreaticosBilling", "FutunetBilling")
# Replace Title and headers
html_mod = html_mod.replace("Sistema de Facturación — Creaticos", "Sistema de Facturación — Futunet Suministros")
html_mod = html_mod.replace("Sistema de facturación interno y administración para Creaticos.", "Sistema de facturación interno y administración para Futunet Suministros.")
html_mod = html_mod.replace("Creaticos Facturación", "Futunet Facturación")
html_mod = html_mod.replace("Ajustes Creaticos", "Ajustes Futunet")
html_mod = html_mod.replace("Dashboard Creaticos", "Dashboard Futunet")
html_mod = html_mod.replace("Creaticos Papelería", "Futunet Suministros")
html_mod = html_mod.replace("Creaticos Group", "Futunet Suministros")
html_mod = html_mod.replace("Configuración de Creaticos", "Configuración de Futunet")
html_mod = html_mod.replace("logo-creaticos-icon.png", "logo-navbar.webp")
html_mod = html_mod.replace("logo-creaticos-full.png", "futunet-logo-clean.png")
html_mod = html_mod.replace('alt="Creaticos"', 'alt="Futunet Suministros"')
html_mod = html_mod.replace('alt="Creaticos Logo" id="view-company-logo"', 'alt="Futunet Suministros Logo" id="view-company-logo"')

# Remove division selector and its form grid from Futunet POS since it is specific to Creaticos
# We can hide it or replace it
html_mod = html_mod.replace(
    '<div class="form-group">\n                  <label for="form-invoice-division">División Emisora (Creaticos Group)</label>\n                  <select id="form-invoice-division" class="form-input">\n                    <option value="general">Creaticos Group (General)</option>\n                    <option value="papeleria">Creaticos Papelería y Suministros</option>\n                    <option value="sublimacion">Creaticos Sublimación</option>\n                  </select>\n                </div>',
    '<!-- División Emisora no requerida en Futunet Suministros -->'
)

# Swap default selection in products-source-filter
html_mod = html_mod.replace(
    '<option value="creaticos">Catálogo Creaticos</option>\n                   <option value="futunet">Catálogo Futunet</option>',
    '<option value="futunet" selected>Catálogo Futunet</option>\n                   <option value="creaticos">Catálogo Creaticos</option>'
)
# Swap default selection in form-product-source
html_mod = html_mod.replace(
    '<option value="creaticos">Catálogo Creaticos</option>\n                   <option value="futunet">Catálogo Futunet</option>',
    '<option value="futunet" selected>Catálogo Futunet</option>\n                   <option value="creaticos">Catálogo Creaticos</option>'
)

# ──────────────────────────────────────────────────────────
# 2. Modify CSS
# ──────────────────────────────────────────────────────────
print("Modifying CSS for Futunet...")
css_mod = css_content
css_mod = css_mod.replace("CREATICOS BILLING SYSTEM STYLES", "FUTUNET BILLING SYSTEM STYLES")
# Replace root colors
old_root = """:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-rgb: 99, 102, 241;
  --secondary: #14b8a6;
  --secondary-hover: #0d9488;
  --dark-sidebar: #0f1923;
  --bg-layout: linear-gradient(180deg, #f8faff 0%, #eef2ff 100%);
  --card-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.08), 0 1px 3px rgba(99, 102, 241, 0.03);
  --input-focus: rgba(99, 102, 241, 0.15);
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;"""

new_root = """:root {
  --primary: #0a70a2;
  --primary-hover: #085d88;
  --primary-rgb: 10, 112, 162;
  --secondary: #00bcd4;
  --secondary-hover: #00acc1;
  --dark-sidebar: #0f1923;
  --bg-layout: linear-gradient(180deg, #f3f7fc 0%, #eaf2fb 100%);
  --card-shadow: 0 10px 30px -10px rgba(10, 112, 162, 0.08), 0 1px 3px rgba(10, 112, 162, 0.03);
  --input-focus: rgba(10, 112, 162, 0.15);
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;"""

css_mod = css_mod.replace(old_root, new_root)

# ──────────────────────────────────────────────────────────
# 3. Modify JS
# ──────────────────────────────────────────────────────────
print("Modifying JS for Futunet...")
js_mod = js_content
# Replace namespaces
js_mod = js_mod.replace("const CreaticosBilling = (function () {", "const FutunetBilling = (function () {")
js_mod = js_mod.replace("return CreaticosBilling;", "return FutunetBilling;")
js_mod = js_mod.replace("CreaticosBilling", "FutunetBilling")

# Replace collection names
js_mod = js_mod.replace("'creaticos_clients'", "'futunet_clients'")
js_mod = js_mod.replace("'creaticos_invoices'", "'futunet_invoices'")
js_mod = js_mod.replace("'creaticos_payments'", "'futunet_payments'")
js_mod = js_mod.replace("'creaticos_settings'", "'futunet_settings'")

# Modify defaults in loadSettings()
js_mod = js_mod.replace(
    "name: 'Creaticos Group',",
    "name: 'Futunet Suministros',"
)
js_mod = js_mod.replace(
    "settings.name === 'Creaticos Papelería y Sublimados' || settings.name === 'Creaticos Papelería'",
    "settings.name === 'Futunet Suministros SRL' || settings.name === 'Futunet'"
)
js_mod = js_mod.replace(
    "settings.name = 'Creaticos Group';",
    "settings.name = 'Futunet Suministros';"
)
js_mod = js_mod.replace(
    "await docRef.update({ name: 'Creaticos Group' });",
    "await docRef.update({ name: 'Futunet Suministros' });"
)
js_mod = js_mod.replace(
    "rnc: '133-73669-1',",
    "rnc: '132-70207-7',"
)
js_mod = js_mod.replace(
    "settings.rnc = '133-73669-1';",
    "settings.rnc = '132-70207-7';"
)
js_mod = js_mod.replace(
    "await docRef.update({ rnc: '133-73669-1' });",
    "await docRef.update({ rnc: '132-70207-7' });"
)
js_mod = js_mod.replace(
    "phone: '849-342-8525',",
    "phone: '829-741-1041',"
)
js_mod = js_mod.replace(
    "email: '',",
    "email: 'info@futunet.com.do',"
)
js_mod = js_mod.replace(
    "invoicePrefix: 'CRE-',",
    "invoicePrefix: 'FUT-',"
)

# Modify default source filter in fetchAllData()
js_mod = js_mod.replace(
    "const source = sourceEl ? sourceEl.value : 'creaticos';\n    products = source === 'creaticos' ? creaticosProducts : futunetProducts;",
    "const source = sourceEl ? sourceEl.value : 'futunet';\n    products = source === 'futunet' ? futunetProducts : creaticosProducts;"
)

# Modify default source in handleModalSourceChange()
js_mod = js_mod.replace(
    "const source = sourceEl ? sourceEl.value : 'creaticos';\n    \n    products = source === 'creaticos' ? creaticosProducts : futunetProducts;",
    "const source = sourceEl ? sourceEl.value : 'futunet';\n    \n    products = source === 'futunet' ? futunetProducts : creaticosProducts;"
)

# Modify openNewProductForm activeSource logic
js_mod = js_mod.replace(
    "const activeSource = sourceFilter ? sourceFilter.value : 'creaticos';",
    "const activeSource = sourceFilter ? sourceFilter.value : 'futunet';"
)

# Modify openEditProductForm defaults
js_mod = js_mod.replace(
    "sourceSelect.value = isCreaticos ? 'creaticos' : 'futunet';",
    "sourceSelect.value = isCreaticos ? 'creaticos' : 'futunet';"
)

# Modify audit log messages
js_mod = js_mod.replace(
    "action: 'Anulación Factura Creaticos',",
    "action: 'Anulación Factura Futunet',"
)
js_mod = js_mod.replace(
    "details: `Factura ${number} anulada en el panel de Creaticos`,",
    "details: `Factura ${number} anulada en el panel de Futunet`,"
)

# Remove division name setter from Futunet viewInvoice logic
old_view_branding = """    // Set company name based on division in invoice
    const nameEl = document.getElementById('view-company-name');
    if (nameEl) {
      if (inv.division === 'papeleria') {
        nameEl.textContent = 'Creaticos Papelería y Suministros';
      } else if (inv.division === 'sublimacion') {
        nameEl.textContent = 'Creaticos Sublimación';
      } else {
        nameEl.textContent = 'Creaticos Group';
      }
    }"""

new_view_branding = """    // Set company name to Futunet Suministros
    const nameEl = document.getElementById('view-company-name');
    if (nameEl) {
      nameEl.textContent = settings.name || 'Futunet Suministros';
    }"""

js_mod = js_mod.replace(old_view_branding, new_view_branding)

# Replace console logs
js_mod = js_mod.replace(
    "console.log('%c\u270f\ufe0f Initializing Creaticos Billing System...', 'color: #6366f1; font-weight: bold;');",
    "console.log('%c\u270f\ufe0f Initializing Futunet Billing System...', 'color: #0a70a2; font-weight: bold;');"
)
js_mod = js_mod.replace(
    "console.error('Error initializing Creaticos Billing:', err);",
    "console.error('Error initializing Futunet Billing:', err);"
)

# Write output files
print("Writing modified files...")
with open(html_dst, "w", encoding="utf-8") as f:
    f.write(html_mod)

with open(css_dst, "w", encoding="utf-8") as f:
    f.write(css_mod)

with open(js_dst, "w", encoding="utf-8") as f:
    f.write(js_mod)

print("Done! Futunet POS files generated successfully.")
