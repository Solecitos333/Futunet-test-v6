const assert = require('node:assert/strict');
const test = require('node:test');
const core = require('../js/billing-core.js');

test('genera NCF físicos de once posiciones aunque exista el prefijo antiguo', () => {
  assert.equal(core.buildNcf('B01', 'B0100000', 42), 'B0100000042');
  assert.equal(core.buildNcf('B15', 'B15', 1).length, 11);
});

test('rechaza secuencias NCF fuera del rango de ocho dígitos', () => {
  assert.throws(() => core.buildNcf('B01', 'B01', 100000000));
});

test('interpreta correctamente ITBIS absoluto pequeño y porcentaje heredado', () => {
  assert.deepEqual(core.resolveLineTax({ price: 500, qty: 1, tax: 90, total: 590 }).mode, 'amount');
  assert.equal(core.resolveLineTax({ price: 500, qty: 1, tax: 18, total: 590 }).amount, 90);
});

test('distingue pagos parciales y completos', () => {
  assert.equal(core.paymentStatus(1000, 0), 'pending');
  assert.equal(core.paymentStatus(1000, 200), 'partial');
  assert.equal(core.paymentStatus(1000, 1000), 'paid');
});

test('no desplaza fechas ISO de solo fecha por zona horaria', () => {
  const parsed = core.parseDateOnly('2026-06-29');
  assert.equal(parsed.getFullYear(), 2026);
  assert.equal(parsed.getMonth(), 5);
  assert.equal(parsed.getDate(), 29);
});

test('una factura vence después del día indicado, no al comenzar ese día', () => {
  const noon = new Date(2026, 5, 29, 12, 0, 0);
  assert.equal(core.isOverdue('2026-06-29', 100, noon), false);
  assert.equal(core.isOverdue('2026-06-28', 100, noon), true);
});

test('neutraliza fórmulas al exportar CSV', () => {
  assert.equal(core.csvCell('=CMD()'), '"\'=CMD()"');
  assert.equal(core.csvCell('Cliente "A"'), '"Cliente ""A"""');
});

test('el detalle 607 usa 23 columnas y distribuye los medios reales de pago', () => {
  const invoice = {
    id: 'inv-1', docType: 'invoice', status: 'partial', ncf: 'B0100000001',
    clientRnc: '132702077', date: '2026-06-29', subtotal: 1000, itbis: 180, total: 1180
  };
  const record = core.build607Record(invoice, [
    { invoiceId: 'inv-1', method: 'Efectivo', amount: 300 },
    { invoiceId: 'inv-1', method: 'Tarjeta', amount: 400 }
  ]);
  assert.equal(record.length, 23);
  assert.equal(record[16], 300);
  assert.equal(record[18], 400);
  assert.equal(record[19], 480);
});

test('separa facturas de consumo menores al umbral y e-NCF del detalle 607', () => {
  assert.equal(core.classify607Invoice({ docType: 'invoice', status: 'paid', ncf: 'B0200000001', total: 1000 }), 'consumer-summary');
  assert.equal(core.classify607Invoice({ docType: 'invoice', status: 'paid', ncf: 'E320000000001', total: 1000 }), 'electronic');
  assert.equal(core.classify607Invoice({ docType: 'invoice', status: 'paid', ncf: 'B0200000001', total: 250000, clientRnc: '' }), 'invalid');
});
