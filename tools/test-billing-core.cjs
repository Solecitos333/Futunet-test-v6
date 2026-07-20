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

test('normaliza mesas y rechaza identificadores inseguros', () => {
  assert.equal(core.normalizeTableName('  Mesa   4  '), 'Mesa 4');
  assert.deepEqual(core.normalizeRestaurantTables('Mesa 1\nMesa 2\nmesa 1'), ['Mesa 1', 'Mesa 2']);
  assert.throws(() => core.normalizeTableName("Mesa 1');alert(1)//"));
  assert.throws(() => core.normalizeTableName('Salón/Mesa 1'));
});

test('controla la máquina de estados de cocina', () => {
  assert.equal(core.canTransitionRestaurantOrder('pending', 'preparing'), true);
  assert.equal(core.canTransitionRestaurantOrder('pending', 'ready'), false);
  assert.equal(core.canTransitionRestaurantOrder('preparing', 'pending'), true);
  assert.equal(core.canTransitionRestaurantOrder('ready', 'served'), true);
  assert.equal(core.canTransitionRestaurantOrder('served', 'closed'), true);
  assert.equal(core.canTransitionRestaurantOrder('closed', 'pending'), true);
  assert.equal(core.canTransitionRestaurantOrder('closed', 'ready'), false);
});

test('detecta modificaciones de cocina y calcula el total de la orden', () => {
  const original = [{ productId: 'p1', name: 'Chimi', price: 100, qty: 2, tax: 18, notes: '' }];
  const modified = [{ ...original[0], notes: 'Sin cebolla' }];
  assert.equal(core.restaurantItemsChanged(original, original), false);
  assert.equal(core.restaurantItemsChanged(original, modified), true);
  assert.equal(core.restaurantOrderTotal(original), 236);
});

test('clasifica estados activos y medios de pago con cheque', () => {
  assert.equal(core.isActiveRestaurantOrder({ status: 'served' }), true);
  assert.equal(core.isActiveRestaurantOrder({ status: 'closed' }), false);
  const buckets = core.paymentBucketsFor607({ id: 'i1', total: 1000 }, [
    { invoiceId: 'i1', method: 'Cheque', amount: 1000 }
  ]);
  assert.equal(buckets.transfer, 1000);
  assert.equal(buckets.credit, 0);
});

test('resuelve la empresa asignada sin depender de una selección local obsoleta', () => {
  assert.equal(core.resolveCompanyCode({ companyCode: 'FUTUNET' }, 'CREATICOS'), 'FUTUNETSRL');
  assert.equal(core.resolveCompanyCode({ companyCode: 'PANITAS' }, 'CREATICOS'), 'PANITAS');
  assert.equal(core.resolveCompanyCode({}, 'CREATICOS'), 'CREATICOS');
  assert.throws(() => core.resolveCompanyCode({}, 'EMPRESA_INVALIDA'));
});

test('clasifica cheques y condiciones de crédito de forma consistente', () => {
  assert.equal(core.paymentMethodGroup('Cheque'), 'transfer');
  assert.equal(core.paymentMethodGroup('Transferencia Bancaria'), 'transfer');
  assert.equal(core.paymentMethodGroup('Efectivo'), 'cash');
  assert.equal(core.paymentMethodGroup('NFC'), 'card');
  assert.equal(core.isCreditTerms('Crédito'), true);
  assert.equal(core.isCreditTerms('15 días'), true);
  assert.equal(core.isCreditTerms('30 días'), true);
  assert.equal(core.isCreditTerms('Contado'), false);
});
