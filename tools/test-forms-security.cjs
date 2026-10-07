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
