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
    { file: 'login.html', id: 'reg-hp-check', name: 'Formulario de registro de cuenta' },
    { file: 'login.html', id: 'reset-hp-check', name: 'Formulario de recuperación de contraseña' },
    { file: 'login.html', id: 'magic-hp-check', name: 'Formulario de acceso sin contraseña' },
    { file: 'cotizacion.html', id: 'quote-hp-check', name: 'Formulario de cotización pública' },
    { file: 'mi-cuenta.html', id: 'profile-hp-check', name: 'Formulario de perfil de usuario' },
    { file: 'mi-cuenta.html', id: 'fin-hp-check', name: 'Formulario de expediente de financiamiento' }
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
});

test('Privacidad y Ley 172-13: casillas de consentimiento explícito e informado en formularios con PII', () => {
  const privacyChecks = [
    { file: 'index.html', id: 'f-privacy-consent', label: 'Contacto principal' },
    { file: 'sugerencias.html', id: 'sug-privacy-consent', label: 'Buzón de sugerencias' },
    { file: 'internet.html', id: 'p-hir-privacy-consent', label: 'Contratación portal cliente' },
    { file: 'internet.html', id: 'p-guest-privacy-consent', label: 'Contratación modal express' },
    { file: 'punto-de-venta.html', id: 'pos-privacy-consent', label: 'Cotizador POS' },
    { file: 'login.html', id: 'register-terms', label: 'Registro de usuario' },
    { file: 'cotizacion.html', id: 'quote-accept-terms', label: 'Respuesta de cotización pública' },
    { file: 'mi-cuenta.html', id: 'profile-terms', label: 'Consentimiento en perfil de usuario' },
    { file: 'mi-cuenta.html', id: 'financing-terms', label: 'Consentimiento en financiamiento' }
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
