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

test('Seguridad en Formularios: trampas Honeypot en todos los formularios públicos clave', () => {
  const checks = [
    { file: 'index.html', id: 'f-hp-check', name: 'Formulario de contacto principal' },
    { file: 'sugerencias.html', id: 'sug-hp-check', name: 'Buzón de sugerencias' },
    { file: 'internet.html', id: 'support-hp-check', name: 'Portal: formulario de soporte técnico' },
    { file: 'internet.html', id: 'pay-hp-check', name: 'Portal: reporte de transferencias' },
    { file: 'internet.html', id: 'p-hir-hp-check', name: 'Portal: contratación de plan cliente' },
    { file: 'internet.html', id: 'p-guest-hp-check', name: 'Modal público: contratación express' },
    { file: 'punto-de-venta.html', id: 'pos-hp-check', name: 'Cotizador directo POS' },
    { file: 'login.html', id: 'reg-hp-check', name: 'Formulario de registro de cuenta' },
    { file: 'cotizacion.html', id: 'quote-hp-check', name: 'Formulario de cotización pública' }
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
});

test('Privacidad y Ley 172-13: casillas de consentimiento explícito e informado en formularios con PII', () => {
  const privacyChecks = [
    { file: 'index.html', id: 'f-privacy-consent', label: 'Contacto principal' },
    { file: 'sugerencias.html', id: 'sug-privacy-consent', label: 'Buzón de sugerencias' },
    { file: 'internet.html', id: 'p-hir-privacy-consent', label: 'Contratación portal cliente' },
    { file: 'internet.html', id: 'p-guest-privacy-consent', label: 'Contratación modal express' },
    { file: 'punto-de-venta.html', id: 'pos-privacy-consent', label: 'Cotizador POS' },
    { file: 'login.html', id: 'register-terms', label: 'Registro de usuario' },
    { file: 'cotizacion.html', id: 'quote-accept-terms', label: 'Respuesta de cotización pública' }
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
});

test('Rate Limiting & Cooldown: protección contra flooding / DoS de formularios en cliente', () => {
  // 1. Sugerencias
  const sugJs = readJs('js/suggestions.js');
  assert.ok(
    sugJs.includes('futunet_last_sug_ts'),
    'js/suggestions.js debe usar futunet_last_sug_ts para cooldown de envíos'
  );
  assert.ok(
    sugJs.includes('15000'),
    'js/suggestions.js debe aplicar una ventana de cooldown de al menos 15 segundos'
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

  // 4. Registro de Usuario
  const loginHtml = readHtml('login.html');
  assert.ok(
    loginHtml.includes('futunet_last_register_ts'),
    'login.html debe implementar futunet_last_register_ts para registro'
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
});

test('Seguridad de Enlaces: cero presencia de rel="noopener" solitario sin noreferrer en HTMLs', () => {
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
});
