/**
 * Suite de Pruebas Automatizadas de Seguridad y Privacidad en Formularios Web
 * Futunet - OWASP Top 10 & Ley 172-13 / RGPD Compliance Verification
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

function readHtml(filename) {
  return fs.readFileSync(path.join(rootDir, filename), 'utf8');
}

function readJs(filename) {
  return fs.readFileSync(path.join(rootDir, filename), 'utf8');
}

test('Seguridad en Formularios: trampas Honeypot en todos los formularios públicos y de autenticación/cuenta', () => {
  const checks = [
    { file: 'index.html', id: 'f-hp-check', name: 'Formulario de contacto principal' },
    { file: 'sugerencias.html', id: 'sug-hp-check', name: 'Buzón de sugerencias' },
    { file: 'internet.html', id: 'support-hp-check', name: 'Portal: formulario de soporte técnico' },
    { file: 'internet.html', id: 'pay-hp-check', name: 'Portal: reporte de transferencias' },
    { file: 'internet.html', id: 'p-hir-hp-check', name: 'Portal: contratación de plan cliente' },
    { file: 'internet.html', id: 'p-guest-hp-check', name: 'Modal público: contratación express' },
    { file: 'punto-de-venta.html', id: 'pos-hp-check', name: 'Cotizador directo POS' },
    { file: 'login.html', id: 'login-hp-check', name: 'Formulario de inicio de sesión' },
    { file: 'login.html', id: 'reg-hp-check', name: 'Formulario de registro de cuenta' },
    { file: 'login.html', id: 'reset-hp-check', name: 'Formulario de recuperación de contraseña' },
    { file: 'login.html', id: 'magic-hp-check', name: 'Formulario de acceso sin contraseña' },
    { file: 'cotizacion.html', id: 'quote-hp-check', name: 'Formulario de cotización pública' },
    { file: 'mi-cuenta.html', id: 'profile-hp-check', name: 'Formulario de perfil de usuario' },
    { file: 'mi-cuenta.html', id: 'fin-hp-check', name: 'Formulario de expediente de financiamiento' },
    { file: 'sugerencias.html', id: 'sug-track-hp-check', name: 'Consulta y tracking de sugerencia' },
    { file: 'admin.html', id: 'internal-sug-hp-check', name: 'Formulario de propuesta interna de personal' },
    { file: 'admin.html', id: 'create-user-hp-check', name: 'Formulario de creación de usuario en administración' },
    { file: 'corporativo.html', id: 'req-hp-check', name: 'Formulario B2B Corporativo' },
    { file: 'energia-climatizacion.html', id: 'req-hp-check', name: 'Formulario B2B Energía y Climatización' },
    { file: 'equipos-oficina.html', id: 'req-hp-check', name: 'Formulario B2B Equipos de Oficina' },
    { file: 'infraestructura-remozamiento.html', id: 'req-hp-check', name: 'Formulario B2B Infraestructura y Remozamiento' },
    { file: 'mobiliario-suministros.html', id: 'req-hp-check', name: 'Formulario B2B Mobiliario y Suministros' },
    { file: 'redes-datos.html', id: 'req-hp-check', name: 'Formulario B2B Redes y Datos' },
    { file: 'seguridad-electronica.html', id: 'req-hp-check', name: 'Formulario B2B Seguridad Electrónica' }
  ];

  for (const item of checks) {
    const html = readHtml(item.file);
    assert.ok(
      html.includes(`id="${item.id}"`),
      `El campo Honeypot ${item.id} debe estar presente en ${item.file} (${item.name})`
    );
    assert.ok(
      html.includes('name="_hp_security_check"'),
      `El campo Honeypot en ${item.file} debe usar el atributo name="_hp_security_check"`
    );
    const hpRegex = new RegExp(`<(?:input|textarea)[^>]*id=["']${item.id}["'][^>]*>`, 'i');
    const hpMatch = html.match(hpRegex);
    assert.ok(hpMatch, `Etiqueta del honeypot ${item.id} debe encontrarse en ${item.file}`);
    assert.ok(
      hpMatch[0].includes('maxlength="50"'),
      `El campo Honeypot ${item.id} en ${item.file} debe tener maxlength="50"`
    );
  }

  // Verificación adicional de Honeypot en el modal de checkout (cart.js)
  const cartJs = readJs('js/cart.js');
  assert.ok(
    cartJs.includes('id="chk-hp-check"'),
    'cart.js debe incluir el campo honeypot chk-hp-check en el modal de checkout'
  );
  assert.ok(
    cartJs.includes('name="_hp_security_check"'),
    'cart.js debe usar name="_hp_security_check" en el campo honeypot'
  );
  assert.ok(
    cartJs.includes('id="chk-hp-check"') && cartJs.includes('maxlength="50"'),
    'cart.js debe acotar chk-hp-check con maxlength="50"'
  );

  // Verificación de Honeypot en el widget de Chatbot (chatbot.js)
  const chatJs = readJs('js/chatbot.js');
  assert.ok(
    chatJs.includes('id="cb-hp-check"'),
    'chatbot.js debe incluir el campo honeypot cb-hp-check en la interfaz de chat'
  );
  assert.ok(
    chatJs.includes('name="_hp_security_check"'),
    'chatbot.js debe usar name="_hp_security_check" en el campo honeypot'
  );
  assert.ok(
    chatJs.includes('id="cb-hp-check"') && chatJs.includes('maxlength="50"'),
    'chatbot.js debe acotar cb-hp-check con maxlength="50"'
  );

  // Verificación de Honeypot en formularios de soporte y respuestas (support-ui.js)
  const supportUiJs = readJs('js/support-ui.js');
  assert.ok(
    supportUiJs.includes('id="sp-hp-check"'),
    'support-ui.js debe incluir el campo honeypot sp-hp-check en el formulario de creación de ticket'
  );
  assert.ok(
    supportUiJs.includes('id="sp-reply-hp-check"'),
    'support-ui.js debe incluir el campo honeypot sp-reply-hp-check en el formulario de respuestas'
  );
  assert.ok(
    supportUiJs.includes('name="_hp_security_check"'),
    'support-ui.js debe usar name="_hp_security_check" en los campos honeypot'
  );
  assert.ok(
    supportUiJs.includes('id="sp-hp-check"') && supportUiJs.includes('maxlength="50"'),
    'support-ui.js debe acotar sp-hp-check con maxlength="50"'
  );
  assert.ok(
    supportUiJs.includes('id="sp-reply-hp-check"') && supportUiJs.includes('maxlength="50"'),
    'support-ui.js debe acotar sp-reply-hp-check con maxlength="50"'
  );
});

test('Privacidad y Ley 172-13: casillas de consentimiento explícito e informado en formularios con PII', () => {
  const privacyChecks = [
    { file: 'index.html', id: 'f-privacy-consent', label: 'Contacto principal' },
    { file: 'sugerencias.html', id: 'sug-privacy-consent', label: 'Buzón de sugerencias' },
    { file: 'internet.html', id: 'p-hir-privacy-consent', label: 'Contratación portal cliente' },
    { file: 'internet.html', id: 'p-guest-privacy-consent', label: 'Contratación modal express' },
    { file: 'internet.html', id: 'pay-privacy-consent', label: 'Reporte de transferencias bancarias' },
    { file: 'internet.html', id: 'support-privacy-consent', label: 'Solicitud de soporte técnico portal' },
    { file: 'punto-de-venta.html', id: 'pos-privacy-consent', label: 'Cotizador POS' },
    { file: 'login.html', id: 'register-terms', label: 'Registro de usuario' },
    { file: 'cotizacion.html', id: 'quote-accept-terms', label: 'Respuesta de cotización pública' },
    { file: 'mi-cuenta.html', id: 'profile-terms', label: 'Consentimiento en perfil de usuario' },
    { file: 'mi-cuenta.html', id: 'financing-terms', label: 'Consentimiento en financiamiento' },
    { file: 'corporativo.html', id: 'req-privacy-consent', label: 'Formulario B2B Corporativo' },
    { file: 'energia-climatizacion.html', id: 'req-privacy-consent', label: 'Formulario B2B Energía y Climatización' },
    { file: 'equipos-oficina.html', id: 'req-privacy-consent', label: 'Formulario B2B Equipos de Oficina' },
    { file: 'infraestructura-remozamiento.html', id: 'req-privacy-consent', label: 'Formulario B2B Infraestructura y Remozamiento' },
    { file: 'mobiliario-suministros.html', id: 'req-privacy-consent', label: 'Formulario B2B Mobiliario y Suministros' },
    { file: 'redes-datos.html', id: 'req-privacy-consent', label: 'Formulario B2B Redes y Datos' },
    { file: 'seguridad-electronica.html', id: 'req-privacy-consent', label: 'Formulario B2B Seguridad Electrónica' }
  ];

  for (const item of privacyChecks) {
    const html = readHtml(item.file);
    assert.ok(
      html.includes(`id="${item.id}"`),
      `La casilla de consentimiento ${item.id} debe existir en ${item.file} (${item.label})`
    );
    assert.ok(
      html.includes('privacidad.html'),
      `El formulario en ${item.file} debe vincular a privacidad.html con enlace seguro`
    );
    assert.ok(
      html.includes('rel="noopener noreferrer"'),
      `Los enlaces a privacidad o términos en ${item.file} deben usar rel="noopener noreferrer"`
    );
  }

  // Verificación en modal de checkout
  const cartJs = readJs('js/cart.js');
  assert.ok(
    cartJs.includes('id="chk-accept-terms"'),
    'cart.js debe incluir la casilla de consentimiento chk-accept-terms en el checkout'
  );
  assert.ok(
    cartJs.includes('privacidad.html'),
    'cart.js debe vincular a privacidad.html en el checkout'
  );

  // Verificación en centro de soporte (support-ui.js)
  const supportUiJs = readJs('js/support-ui.js');
  assert.ok(
    supportUiJs.includes('id="sp-privacy-consent"'),
    'support-ui.js debe incluir la casilla de consentimiento sp-privacy-consent en creación de tickets'
  );
  assert.ok(
    supportUiJs.includes('privacidad.html'),
    'support-ui.js debe vincular a privacidad.html en la creación de tickets'
  );
  assert.ok(
    supportUiJs.includes('rel="noopener noreferrer"'),
    'support-ui.js debe vincular a privacidad.html con rel="noopener noreferrer"'
  );
});

test('Rate Limiting & Cooldown: protección contra flooding / DoS de formularios en cliente', () => {
  // 1. Sugerencias (envío y tracking)
  const sugJs = readJs('js/suggestions.js');
  assert.ok(
    sugJs.includes('futunet_last_sug_ts'),
    'js/suggestions.js debe usar futunet_last_sug_ts para cooldown de envíos'
  );
  assert.ok(
    sugJs.includes('15000'),
    'js/suggestions.js debe aplicar una ventana de cooldown de al menos 15 segundos'
  );
  assert.ok(
    sugJs.includes('futunet_last_sug_track_ts'),
    'js/suggestions.js debe usar futunet_last_sug_track_ts para cooldown de tracking'
  );
  assert.ok(
    sugJs.includes('3000'),
    'js/suggestions.js debe aplicar una ventana de cooldown de 3 segundos en tracking'
  );

  // 2. Portal de Internet: Tickets de soporte y reporte de pagos
  const portalJs = readJs('js/internet-portal.js');
  assert.ok(
    portalJs.includes('futunet_last_support_ticket_ts'),
    'js/internet-portal.js debe usar futunet_last_support_ticket_ts para tickets de soporte'
  );
  assert.ok(
    portalJs.includes('futunet_last_payment_report_ts'),
    'js/internet-portal.js debe usar futunet_last_payment_report_ts para pagos'
  );

  // 3. Punto de Venta
  const posHtml = readHtml('punto-de-venta.html');
  assert.ok(
    posHtml.includes('futunet_last_pos_contact_ts'),
    'punto-de-venta.html debe implementar futunet_last_pos_contact_ts para cotizaciones'
  );

  // 4. Registro y recuperación en login.html
  const loginHtml = readHtml('login.html');
  assert.ok(
    loginHtml.includes('futunet_last_register_ts'),
    'login.html debe implementar futunet_last_register_ts para registro'
  );
  assert.ok(
    loginHtml.includes('futunet_reset_cooldown_until'),
    'login.html debe implementar futunet_reset_cooldown_until para reset de contraseña'
  );
  assert.ok(
    loginHtml.includes('futunet_magic_cooldown_until'),
    'login.html debe implementar futunet_magic_cooldown_until para magic link'
  );

  // 5. Cotización Pública
  const quoteJs = readJs('js/public-quote.js');
  assert.ok(
    quoteJs.includes('futunet_last_quote_response_ts'),
    'js/public-quote.js debe usar futunet_last_quote_response_ts para cooldown'
  );
  assert.ok(
    quoteJs.includes('10000'),
    'js/public-quote.js debe aplicar una ventana de cooldown de al menos 10 segundos'
  );

  // 6. Checkout de Catálogo (cart.js)
  const cartJs = readJs('js/cart.js');
  assert.ok(
    cartJs.includes('futunet_last_order_ts'),
    'js/cart.js debe usar futunet_last_order_ts para cooldown de envíos en checkout'
  );
  assert.ok(
    cartJs.includes('10000'),
    'js/cart.js debe aplicar una ventana de cooldown de al menos 10 segundos'
  );

  // 7. Contacto Principal (js/form.js)
  const formJs = readJs('js/form.js');
  assert.ok(
    formJs.includes('futunet_last_contact_ts'),
    'js/form.js debe usar futunet_last_contact_ts para cooldown de envíos'
  );
  assert.ok(
    formJs.includes('10000'),
    'js/form.js debe aplicar una ventana de cooldown de al menos 10 segundos'
  );

  // 8. Solicitud de Servicios Corporativos B2B (js/service-page.js)
  const serviceJs = readJs('js/service-page.js');
  assert.ok(
    serviceJs.includes('futunet_last_service_req_ts'),
    'js/service-page.js debe usar futunet_last_service_req_ts para cooldown de solicitudes'
  );
  assert.ok(
    serviceJs.includes('15000'),
    'js/service-page.js debe aplicar una ventana de cooldown de al menos 15 segundos'
  );

  // 9. Actualización de perfil de usuario (js/user-panel.js)
  const userPanelJs = readJs('js/user-panel.js');
  assert.ok(
    userPanelJs.includes('futunet_last_profile_update_ts'),
    'js/user-panel.js debe usar futunet_last_profile_update_ts para cooldown'
  );
  assert.ok(
    userPanelJs.includes('5000'),
    'js/user-panel.js debe aplicar una ventana de cooldown de 5 segundos'
  );

  // 10. Expediente de financiamiento (js/financing.js)
  const finJs = readJs('js/financing.js');
  assert.ok(
    finJs.includes('futunet_last_financing_ts'),
    'js/financing.js debe usar futunet_last_financing_ts para cooldown'
  );
  assert.ok(
    finJs.includes('15000'),
    'js/financing.js debe aplicar una ventana de cooldown de al menos 15 segundos'
  );

  // 11. Chatbot (js/chatbot.js)
  const chatJs = readJs('js/chatbot.js');
  assert.ok(
    chatJs.includes('futunet_last_chat_msg_ts'),
    'js/chatbot.js debe implementar futunet_last_chat_msg_ts para cooldown de consultas'
  );

  // 12. Tickets y Respuestas de Soporte (js/support-ui.js)
  const supportUiJs = readJs('js/support-ui.js');
  assert.ok(
    supportUiJs.includes('futunet_last_support_create_ts'),
    'js/support-ui.js debe implementar futunet_last_support_create_ts para creación de tickets'
  );
  assert.ok(
    supportUiJs.includes('15000'),
    'js/support-ui.js debe aplicar una ventana de cooldown de 15 segundos en tickets'
  );
  assert.ok(
    supportUiJs.includes('futunet_last_support_reply_ts'),
    'js/support-ui.js debe implementar futunet_last_support_reply_ts para respuestas'
  );
  assert.ok(
    supportUiJs.includes('5000'),
    'js/support-ui.js debe aplicar una ventana de cooldown de 5 segundos en respuestas'
  );

  // 13. Propuesta interna admin (js/admin-panel.js)
  const adminPanelJs = readJs('js/admin-panel.js');
  assert.ok(
    adminPanelJs.includes('futunet_last_internal_sug_ts'),
    'js/admin-panel.js debe implementar futunet_last_internal_sug_ts para cooldown'
  );
  assert.ok(
    adminPanelJs.includes('5000'),
    'js/admin-panel.js debe aplicar una ventana de cooldown de 5 segundos en propuesta interna'
  );

  // 14. Creación de usuario en admin (js/admin-panel.js)
  assert.ok(
    adminPanelJs.includes('futunet_last_user_create_ts'),
    'js/admin-panel.js debe implementar futunet_last_user_create_ts para cooldown de creación de usuarios'
  );
});

test('Sanitización e Inyecciones: remoción de tags y caracteres de control invisibles', () => {
  const sugJs = readJs('js/suggestions.js');
  assert.ok(
    sugJs.includes('replace(/<[^>]*>/g') || sugJs.includes('replace(/<[^>]*>/g, \'\')'),
    'js/suggestions.js debe eliminar tags HTML de los campos de entrada'
  );
  assert.ok(
    sugJs.includes('\\x00-\\x08'),
    'js/suggestions.js debe neutralizar caracteres de control ASCII'
  );

  const portalJs = readJs('js/internet-portal.js');
  assert.ok(
    portalJs.includes('sanitizePortalInput'),
    'js/internet-portal.js debe contar con la función de sanitización sanitizePortalInput'
  );

  const posHtml = readHtml('punto-de-venta.html');
  assert.ok(
    posHtml.includes('sanitizePosInput'),
    'punto-de-venta.html debe implementar sanitizePosInput para depurar campos'
  );
  assert.ok(
    posHtml.includes('.slice(0, 1000)'),
    'punto-de-venta.html debe acotar el mensaje a 1000 caracteres antes de enviar a WhatsApp'
  );

  const quoteJs = readJs('js/public-quote.js');
  assert.ok(
    quoteJs.includes('sanitizeQuoteInput'),
    'js/public-quote.js debe implementar la función sanitizeQuoteInput'
  );
  assert.ok(
    quoteJs.includes('\\x00-\\x08'),
    'js/public-quote.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const formJs = readJs('js/form.js');
  assert.ok(
    formJs.includes('sanitizeInputText'),
    'js/form.js debe implementar sanitizeInputText'
  );
  assert.ok(
    formJs.includes('\\x00-\\x08'),
    'js/form.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const serviceJs = readJs('js/service-page.js');
  assert.ok(
    serviceJs.includes('sanitizeField'),
    'js/service-page.js debe implementar sanitizeField'
  );
  assert.ok(
    serviceJs.includes('\\x00-\\x08'),
    'js/service-page.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const loginHtml = readHtml('login.html');
  assert.ok(
    loginHtml.includes('sanitizeAuthInput'),
    'login.html debe implementar la función sanitizeAuthInput'
  );
  assert.ok(
    loginHtml.includes('\\x00-\\x08'),
    'login.html debe neutralizar caracteres de control ASCII invisibles'
  );

  const userPanelJs = readJs('js/user-panel.js');
  assert.ok(
    userPanelJs.includes('sanitizeProfileInput'),
    'js/user-panel.js debe implementar sanitizeProfileInput'
  );
  assert.ok(
    userPanelJs.includes('\\x00-\\x08'),
    'js/user-panel.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const finJs = readJs('js/financing.js');
  assert.ok(
    finJs.includes('sanitizeFinancingInput'),
    'js/financing.js debe implementar sanitizeFinancingInput'
  );
  assert.ok(
    finJs.includes('\\x00-\\x08'),
    'js/financing.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const chatJs = readJs('js/chatbot.js');
  assert.ok(
    chatJs.includes('sanitizeChatInput'),
    'js/chatbot.js debe implementar sanitizeChatInput'
  );
  assert.ok(
    chatJs.includes('\\x00-\\x08'),
    'js/chatbot.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const supportCoreJs = readJs('js/support-core.js');
  assert.ok(
    supportCoreJs.includes('\\x00-\\x08'),
    'js/support-core.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const adminPanelJs = readJs('js/admin-panel.js');
  assert.ok(
    adminPanelJs.includes('sanitizeAdminSuggestionInput'),
    'js/admin-panel.js debe implementar sanitizeAdminSuggestionInput'
  );
  assert.ok(
    adminPanelJs.includes('sanitizeAdminUserInput'),
    'js/admin-panel.js debe implementar sanitizeAdminUserInput para creación y edición de usuarios'
  );
  assert.ok(
    adminPanelJs.includes("title: sanitizeAdminUserInput(getVal('product-title')"),
    'js/admin-panel.js debe sanitizar el título del producto en productForm'
  );
  assert.ok(
    adminPanelJs.includes("var name = sanitizeAdminUserInput(getVal('category-name')"),
    'js/admin-panel.js debe sanitizar el nombre de categoría en saveCategory'
  );
  assert.ok(
    adminPanelJs.includes("var name = sanitizeAdminUserInput(getVal('brand-name')"),
    'js/admin-panel.js debe sanitizar el nombre de marca en saveBrand'
  );
  assert.ok(
    adminPanelJs.includes('\\x00-\\x08'),
    'js/admin-panel.js debe neutralizar caracteres de control ASCII invisibles'
  );

  const erpJs = readJs('js/facturacion.js');
  assert.ok(
    erpJs.includes('sanitizeErpInput'),
    'js/facturacion.js debe implementar la función sanitizeErpInput'
  );
  assert.ok(
    erpJs.includes('\\x00-\\x08'),
    'js/facturacion.js debe neutralizar caracteres de control ASCII invisibles'
  );
  assert.ok(
    erpJs.includes('escapeAttr'),
    'js/facturacion.js debe contar con la función escapeAttr para atributos HTML'
  );
});

test('Seguridad de Enlaces: cero presencia de rel="noopener" solitario sin noreferrer en HTMLs y JS', () => {
  const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const matches = content.match(/rel\s*=\s*["']noopener["']/gi);
    assert.strictEqual(
      matches,
      null,
      `El archivo ${file} no debe contener rel="noopener" solitario sin noreferrer`
    );
  }

  // Verificar scripts en js/ y ai/js/
  const jsDirs = [path.join(rootDir, 'js'), path.join(rootDir, 'ai', 'js')];
  for (const dir of jsDirs) {
    if (!fs.existsSync(dir)) continue;
    const jsFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const matches = content.match(/rel\s*=\s*\\?["']noopener\\?["']/gi);
      assert.strictEqual(
        matches,
        null,
        `El script ${file} no debe contener rel="noopener" solitario sin noreferrer`
      );
    }
  }
});

test('Seguridad de Autenticación & Redirecciones: allowlist estricta de rutas locales en login.html', () => {
  const loginHtml = readHtml('login.html');
  assert.ok(
    loginHtml.includes('cotizacion.html'),
    'login.html debe incluir cotizacion.html en allowedRedirects'
  );
  assert.ok(
    loginHtml.includes('redirectTarget.origin === window.location.origin'),
    'login.html debe verificar estrictamente la coincidencia de origen en redirecciones'
  );
  assert.ok(
    loginHtml.includes('adminRedirects') && loginHtml.includes('isStaff'),
    'login.html debe restringir redirecciones a paneles de administración exclusivamente a usuarios con roles de staff'
  );
});

test('Defensa en Profundidad: límites de longitud (maxlength) en todos los campos de formularios públicos (OWASP ASVS V5 / CWE-20)', () => {
  function assertFieldHasMaxLength(htmlContent, fieldId, expectedMax, fileName) {
    const tagRegex = new RegExp(`<(?:input|textarea)[^>]*id=["']${fieldId}["'][^>]*>`, 'i');
    const match = htmlContent.match(tagRegex);
    assert.ok(match, `Elemento con id="${fieldId}" debe existir en ${fileName}`);
    const tagHtml = match[0];
    const maxMatch = tagHtml.match(/maxlength=["']([0-9]+)["']/i);
    assert.ok(maxMatch, `Elemento con id="${fieldId}" en ${fileName} debe tener atributo maxlength`);
    if (expectedMax !== undefined) {
      assert.strictEqual(
        parseInt(maxMatch[1], 10),
        expectedMax,
        `Elemento con id="${fieldId}" en ${fileName} debe tener maxlength="${expectedMax}", pero tiene ${maxMatch[1]}`
      );
    }
  }

  // 1. index.html
  const indexHtml = readHtml('index.html');
  assertFieldHasMaxLength(indexHtml, 'f-nombre', 100, 'index.html');
  assertFieldHasMaxLength(indexHtml, 'f-tel', 30, 'index.html');
  assertFieldHasMaxLength(indexHtml, 'f-msg', 1500, 'index.html');

  // 2. login.html
  const loginHtml = readHtml('login.html');
  assertFieldHasMaxLength(loginHtml, 'login-company', 50, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'login-email', 100, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'login-password', 128, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'register-name', 100, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'register-email', 100, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'register-password', 128, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'reset-email', 100, 'login.html');
  assertFieldHasMaxLength(loginHtml, 'magic-email', 100, 'login.html');

  // 3. punto-de-venta.html
  const posHtml = readHtml('punto-de-venta.html');
  assertFieldHasMaxLength(posHtml, 'pos-name', 100, 'punto-de-venta.html');
  assertFieldHasMaxLength(posHtml, 'pos-phone', 30, 'punto-de-venta.html');
  assertFieldHasMaxLength(posHtml, 'pos-msg', 1000, 'punto-de-venta.html');

  // 4. internet.html
  const internetHtml = readHtml('internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-hir-name', 100, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-hir-email', 100, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-hir-phone', 30, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-hir-address', 300, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-hir-notes', 500, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-guest-name', 100, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-guest-phone', 30, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-guest-email', 100, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'p-guest-address', 300, 'internet.html');
  assertFieldHasMaxLength(internetHtml, 'support-details', 1500, 'internet.html');

  // 5. mi-cuenta.html
  const accountHtml = readHtml('mi-cuenta.html');
  assertFieldHasMaxLength(accountHtml, 'profile-name', 100, 'mi-cuenta.html');
  assertFieldHasMaxLength(accountHtml, 'profile-email', 100, 'mi-cuenta.html');
  assertFieldHasMaxLength(accountHtml, 'profile-phone', 30, 'mi-cuenta.html');
  assertFieldHasMaxLength(accountHtml, 'profile-address', 300, 'mi-cuenta.html');
  assertFieldHasMaxLength(accountHtml, 'fin-phone', 30, 'mi-cuenta.html');

  // 6. Formularios B2B (7 páginas)
  const b2bPages = [
    'corporativo.html',
    'energia-climatizacion.html',
    'equipos-oficina.html',
    'infraestructura-remozamiento.html',
    'mobiliario-suministros.html',
    'redes-datos.html',
    'seguridad-electronica.html'
  ];
  for (const page of b2bPages) {
    const b2bHtml = readHtml(page);
    assertFieldHasMaxLength(b2bHtml, 'req-name', 100, page);
    assertFieldHasMaxLength(b2bHtml, 'req-phone', 50, page);
    assertFieldHasMaxLength(b2bHtml, 'req-email', 100, page);
    assertFieldHasMaxLength(b2bHtml, 'req-company', 100, page);
    assertFieldHasMaxLength(b2bHtml, 'req-message', 1500, page);
  }

  // 7. Modal de checkout en cart.js
  const cartJs = readJs('js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-name', 100, 'js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-phone', 30, 'js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-email', 100, 'js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-document-number', 30, 'js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-address', 300, 'js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-notes', 500, 'js/cart.js');
  assertFieldHasMaxLength(cartJs, 'chk-coupon', 50, 'js/cart.js');
});

test('Validación Defensiva en Cliente: límites de longitud en handleSubmitOrder (cart.js) (OWASP ASVS V5)', () => {
  const cartJs = readJs('js/cart.js');
  assert.ok(
    cartJs.includes('name.length < 2 || name.length > 100'),
    'cart.js debe validar que name tenga longitud entre 2 y 100'
  );
  assert.ok(
    cartJs.includes('email.length > 100'),
    'cart.js debe validar que email no exceda 100 caracteres'
  );
  assert.ok(
    cartJs.includes('phone.length > 30'),
    'cart.js debe validar que phone no exceda 30 caracteres'
  );
  assert.ok(
    cartJs.includes('address.length < 2 || address.length > 300'),
    'cart.js debe validar que address tenga longitud entre 2 y 300'
  );
  assert.ok(
    cartJs.includes('notes.length > 500'),
    'cart.js debe validar que notes no exceda 500 caracteres'
  );
});

test('Seguridad XSS & Renderizado Seguro: mitigación DOM en catalog.js (CWE-79)', () => {
  const catalogJs = readJs('js/catalog.js');
  assert.ok(
    catalogJs.includes("counterP.textContent = `Mostrando ${Number(shown)} de ${Number(total)} productos`"),
    'catalog.js debe asignar el contador de productos usando textContent seguro en lugar de innerHTML'
  );
  assert.ok(
    catalogJs.includes("counterP.textContent = `Mostrando todos los ${Number(products.length)} productos`") ||
    catalogJs.includes("counterP.textContent = `Mostrando todos los ${Number(total)} productos`"),
    'catalog.js debe asignar mensajes de fin de catálogo con textContent seguro'
  );
  assert.ok(
    !catalogJs.includes('div.innerHTML = `<p class="results-counter">Mostrando'),
    'catalog.js no debe inyectar contadores sin sanitizar directamente en innerHTML'
  );
});

test('Defensa en Profundidad: límites de longitud (maxlength) en módulos administrativos y de facturación (admin.html, facturacion.html) (OWASP ASVS V5 / CWE-20)', () => {
  function assertFieldHasMaxLength(htmlContent, fieldId, expectedMax, fileName) {
    const tagRegex = new RegExp(`<(?:input|textarea)[^>]*id=["']${fieldId}["'][^>]*>`, 'i');
    const match = htmlContent.match(tagRegex);
    assert.ok(match, `Elemento con id="${fieldId}" debe existir en ${fileName}`);
    const tagHtml = match[0];
    const maxMatch = tagHtml.match(/maxlength=["']([0-9]+)["']/i);
    assert.ok(maxMatch, `Elemento con id="${fieldId}" en ${fileName} debe tener atributo maxlength`);
    if (expectedMax !== undefined) {
      assert.strictEqual(
        parseInt(maxMatch[1], 10),
        expectedMax,
        `Elemento con id="${fieldId}" en ${fileName} debe tener maxlength="${expectedMax}", pero tiene ${maxMatch[1]}`
      );
    }
  }

  // 1. admin.html
  const adminHtml = readHtml('admin.html');
  const adminChecks = [
    { id: 'inventory-search', max: 100 },
    { id: 'users-search', max: 100 },
    { id: 'discounts-search', max: 100 },
    { id: 'orders-search', max: 100 },
    { id: 'audit-search', max: 100 },
    { id: 'requests-search', max: 100 },
    { id: 'suggestions-search', max: 100 },
    { id: 'product-title', max: 150 },
    { id: 'product-sku', max: 50 },
    { id: 'product-reference', max: 50 },
    { id: 'product-barcode', max: 50 },
    { id: 'product-brand', max: 50 },
    { id: 'product-desc', max: 2000 },
    { id: 'product-specs', max: 1500 },
    { id: 'category-name', max: 100 },
    { id: 'category-icon', max: 50 },
    { id: 'brand-name', max: 100 },
    { id: 'user-name-input', max: 100 },
    { id: 'user-roles-list-input', max: 200 },
    { id: 'create-user-hp-check', max: 50 },
    { id: 'create-user-name', max: 100 },
    { id: 'create-user-email', max: 100 },
    { id: 'create-user-password', max: 128 },
    { id: 'discount-code', max: 30 },
    { id: 'ic-client-code', max: 50 },
    { id: 'competitor-name', max: 100 },
    { id: 'competitor-differentiator', max: 500 },
    { id: 'competitor-strengths', max: 1000 },
    { id: 'competitor-weaknesses', max: 1000 },
    { id: 'competitor-improvements', max: 1000 },
    { id: 'competitor-logo', max: 500 },
    { id: 'sug-modal-official-response', max: 2000 },
    { id: 'sug-modal-admin-notes', max: 1500 },
    { id: 'internal-sug-hp-check', max: 50 }
  ];
  for (const c of adminChecks) {
    assertFieldHasMaxLength(adminHtml, c.id, c.max, 'admin.html');
  }

  // 2. facturacion.html
  const erpHtml = readHtml('facturacion.html');
  const erpChecks = [
    { id: 'invoice-search', max: 100 },
    { id: 'pos-client-search', max: 100 },
    { id: 'pos-product-search', max: 100 },
    { id: 'clients-search', max: 100 },
    { id: 'products-search', max: 100 },
    { id: 'form-client-name', max: 100 },
    { id: 'form-client-rnc', max: 20 },
    { id: 'form-client-phone', max: 30 },
    { id: 'form-client-email', max: 100 },
    { id: 'form-client-address', max: 300 },
    { id: 'form-invoice-client-name', max: 100 },
    { id: 'form-invoice-client-rnc', max: 20 },
    { id: 'form-invoice-client-phone', max: 30 },
    { id: 'form-invoice-client-email', max: 100 },
    { id: 'form-invoice-client-address', max: 300 },
    { id: 'form-invoice-ncf', max: 20 },
    { id: 'form-invoice-notes', max: 500 },
    { id: 'form-product-name', max: 150 },
    { id: 'form-product-description', max: 500 },
    { id: 'form-product-sku', max: 50 },
    { id: 'form-product-reference', max: 50 },
    { id: 'form-product-barcode', max: 50 },
    { id: 'set-company-name', max: 100 },
    { id: 'set-company-rnc', max: 20 },
    { id: 'set-company-phone', max: 30 },
    { id: 'set-company-email', max: 100 },
    { id: 'set-company-address', max: 300 },
    { id: 'set-invoice-prefix', max: 10 },
    { id: 'set-quote-prefix', max: 10 },
    { id: 'set-proforma-prefix', max: 10 },
    { id: 'set-restaurant-tables', max: 1000 },
    { id: 'set-ticket-slogan', max: 150 },
    { id: 'set-ticket-instagram', max: 50 },
    { id: 'set-ticket-footer', max: 250 },
    { id: 'set-rnc-api-key', max: 100 },
    { id: 'pos-restaurant-table', max: 30 },
    { id: 'pos-restaurant-client-name', max: 100 },
    { id: 'fiscal-adjustment-reason', max: 500 },
    { id: 'barcode-simulator-manual', max: 50 },
    { id: 'form-payment-notes', max: 300 },
    { id: 'form-cash-close-notes', max: 500 },
    { id: 'form-abono-notes', max: 300 }
  ];
  for (const c of erpChecks) {
    assertFieldHasMaxLength(erpHtml, c.id, c.max, 'facturacion.html');
  }
});

test('Protección de Credenciales e Identificadores Sensibles (OWASP ASVS V2 / V5 / Ley 172-13)', () => {
  // 1. Password fields deben tener spellcheck="false" y autocomplete explícito
  const adminHtml = readHtml('admin.html');
  const loginHtml = readHtml('login.html');
  const factHtml = readHtml('facturacion.html');

  assert.ok(
    adminHtml.includes('id="create-user-password"') &&
    adminHtml.includes('autocomplete="new-password"') &&
    adminHtml.includes('spellcheck="false"'),
    'admin.html debe tener autocomplete="new-password" y spellcheck="false" en create-user-password'
  );

  assert.ok(
    loginHtml.includes('id="login-password"') &&
    loginHtml.includes('autocomplete="current-password"') &&
    loginHtml.includes('spellcheck="false"'),
    'login.html debe tener autocomplete="current-password" y spellcheck="false" en login-password'
  );

  assert.ok(
    loginHtml.includes('id="register-password"') &&
    loginHtml.includes('autocomplete="new-password"') &&
    loginHtml.includes('spellcheck="false"'),
    'login.html debe tener autocomplete="new-password" y spellcheck="false" en register-password'
  );

  assert.ok(
    factHtml.includes('id="set-rnc-api-key"') &&
    factHtml.includes('autocomplete="new-password"') &&
    factHtml.includes('spellcheck="false"'),
    'facturacion.html debe tener autocomplete="new-password" y spellcheck="false" en set-rnc-api-key'
  );

  // 2. Identificadores fiscales (RNC / Cédula) con spellcheck="false" y autocomplete="off"
  const rncChecks = [
    { html: factHtml, id: 'form-invoice-client-rnc', file: 'facturacion.html' },
    { html: factHtml, id: 'form-client-rnc', file: 'facturacion.html' },
    { html: factHtml, id: 'purchase-supplier-rnc', file: 'facturacion.html' },
    { html: factHtml, id: 'set-company-rnc', file: 'facturacion.html' }
  ];
  for (const c of rncChecks) {
    const tagMatch = c.html.match(new RegExp('<input[^>]*id=["\']' + c.id + '["\'][^>]*>', 'i'));
    assert.ok(tagMatch, `${c.id} debe existir en ${c.file}`);
    assert.ok(tagMatch[0].includes('spellcheck="false"'), `${c.id} en ${c.file} debe tener spellcheck="false"`);
    assert.ok(tagMatch[0].includes('autocomplete="off"'), `${c.id} en ${c.file} debe tener autocomplete="off"`);
  }

  // 3. Documentos de usuario en mi-cuenta.html
  const miCuentaHtml = readHtml('mi-cuenta.html');
  const accountDocChecks = ['profile-document-number', 'fin-document-number'];
  for (const docId of accountDocChecks) {
    const tagMatch = miCuentaHtml.match(new RegExp('<input[^>]*id=["\']' + docId + '["\'][^>]*>', 'i'));
    assert.ok(tagMatch, `${docId} debe existir en mi-cuenta.html`);
    assert.ok(tagMatch[0].includes('spellcheck="false"'), `${docId} debe tener spellcheck="false"`);
    assert.ok(tagMatch[0].includes('autocomplete="off"'), `${docId} debe tener autocomplete="off"`);
  }

  // 4. Modal de Checkout (cart.js)
  const cartJs = readJs('js/cart.js');
  assert.ok(
    cartJs.includes('id="chk-document-number"') &&
    cartJs.includes('autocomplete="off"') &&
    cartJs.includes('spellcheck="false"'),
    'cart.js debe proteger chk-document-number con autocomplete="off" y spellcheck="false"'
  );
  assert.ok(
    cartJs.includes('id="chk-coupon"') &&
    cartJs.includes('autocomplete="off"') &&
    cartJs.includes('spellcheck="false"'),
    'cart.js debe proteger chk-coupon con autocomplete="off" y spellcheck="false"'
  );
  assert.ok(
    cartJs.includes('autocomplete="name"') &&
    cartJs.includes('autocomplete="tel"') &&
    cartJs.includes('autocomplete="email"') &&
    cartJs.includes('autocomplete="street-address"'),
    'cart.js debe configurar autocompletado estándar seguro para datos de contacto de envío'
  );
});

test('Seguridad de Service Worker & Protección de Credenciales en Caché', () => {
  const swJs = readJs('sw.js');
  assert.ok(
    swJs.includes("const CACHE_NAME = 'futunet-cache-v54';"),
    'sw.js debe estar en la versión futunet-cache-v54'
  );
  assert.ok(
    swJs.includes("'/cotizacion'") && swJs.includes("'/cotizacion.html'"),
    'sw.js debe proteger cotización excluyéndola de la navegación en caché (privatePaths)'
  );
  assert.ok(
    swJs.includes("'/js/public-quote.js'"),
    'sw.js debe incluir public-quote.js en privateScripts'
  );
  // Verificar que firebase-config.js y auth.js NO están presentes en OPTIONAL_ASSETS
  const optionalAssetsMatch = swJs.match(/const OPTIONAL_ASSETS = \[([\s\S]*?)\];/);
  assert.ok(optionalAssetsMatch, 'sw.js debe definir OPTIONAL_ASSETS');
  const optionalAssetsBody = optionalAssetsMatch[1];
  assert.ok(
    !optionalAssetsBody.includes('firebase-config.js'),
    'sw.js NO debe cachear firebase-config.js en OPTIONAL_ASSETS'
  );
  assert.ok(
    !optionalAssetsBody.includes('auth.js'),
    'sw.js NO debe cachear auth.js en OPTIONAL_ASSETS'
  );
  assert.ok(
    !optionalAssetsBody.includes('public-quote.js'),
    'sw.js NO debe cachear public-quote.js confidencial en OPTIONAL_ASSETS'
  );
  assert.ok(
    !optionalAssetsBody.includes('cotizacion.html'),
    'sw.js NO debe cachear cotizacion.html en OPTIONAL_ASSETS'
  );
});

test('Validación Numérica Defensiva & Cotas Superiores (OWASP ASVS V5 / CWE-20)', () => {
  const factHtml = readHtml('facturacion.html');
  const seqChecks = [
    'set-invoice-seq',
    'set-quote-seq',
    'set-proforma-seq',
    'set-ncf-b01-start',
    'set-ncf-b01-end',
    'set-ncf-b02-start',
    'set-ncf-b02-end',
    'set-ncf-b03-start',
    'set-ncf-b03-end',
    'set-ncf-b04-start',
    'set-ncf-b04-end',
    'set-ncf-b12-start',
    'set-ncf-b12-end',
    'set-ncf-b14-start',
    'set-ncf-b14-end',
    'set-ncf-b15-start',
    'set-ncf-b15-end'
  ];
  for (const seqId of seqChecks) {
    const match = factHtml.match(new RegExp('<input[^>]*id=["\']' + seqId + '["\'][^>]*>', 'i'));
    assert.ok(match, `${seqId} debe existir en facturacion.html`);
    assert.ok(match[0].includes('max="99999999"'), `${seqId} debe tener max="99999999" conforme al estándar DGII`);
  }

  const adminHtml = readHtml('admin.html');
  assert.ok(
    adminHtml.includes('id="discount-min"') && adminHtml.includes('max="10000000"'),
    'admin.html debe acotar discount-min con max="10000000"'
  );
  assert.ok(
    adminHtml.includes('id="discount-max-uses"') && adminHtml.includes('max="1000000"'),
    'admin.html debe acotar discount-max-uses con max="1000000"'
  );
});

test('Mitigación de Subdominio Efímero & Fuga de Red Privada (CWE-494 / CWE-1188)', () => {
  const adminHtml = readHtml('admin.html');
  const aiServerJs = readJs('js/ai-server.js');

  // 1. Cero presencia de subdominios efímeros de Cloudflare o túneles públicos no controlados
  assert.ok(
    !adminHtml.includes('trycloudflare.com'),
    'admin.html no debe contener subdominios efímeros trycloudflare.com'
  );
  assert.ok(
    !aiServerJs.includes('trycloudflare.com'),
    'js/ai-server.js no debe contener subdominios efímeros trycloudflare.com'
  );

  // 2. Cero presencia de IPs privadas RFC 1918 cableadas en código cliente
  assert.ok(
    !aiServerJs.includes('10.0.0.117'),
    'js/ai-server.js no debe contener IPs privadas locales cableadas (10.0.0.117)'
  );

  // 3. Validación de candidatos en discoverProxy
  assert.ok(
    aiServerJs.includes("ep.startsWith('https://')") && aiServerJs.includes("ep.startsWith('http://localhost')"),
    'js/ai-server.js discoverProxy debe validar esquemas seguros (https o localhost) antes de emitir sondeos'
  );
});

