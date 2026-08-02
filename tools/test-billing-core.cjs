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
  assert.throws(() => core.resolveCompanyCode({ companyCode: 'PANITAS' }, 'CREATICOS'), /no está habilitada/);
  assert.equal(core.resolveCompanyCode({}, 'CREATICOS'), 'CREATICOS');
  assert.equal(core.resolveCompanyCode({}, 'PANITAS'), 'CREATICOS');
  assert.equal(core.resolveCompanyCode({}, 'EMPRESA_INVALIDA'), 'CREATICOS');
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

test('calcula descuentos globales reduciendo base e ITBIS en centavos', () => {
  const result = core.calculateInvoiceTotals([
    { price: 1000, qty: 1, discount: 10, tax: 162, taxMode: 'amount', taxRate: 18 }
  ], 10);
  assert.equal(result.subtotal, 1000);
  assert.equal(result.discountAmount, 190);
  assert.equal(result.taxableAmount, 810);
  assert.equal(result.itbis, 145.8);
  assert.equal(result.total, 955.8);
  assert.equal(result.items[0].total, 955.8);
});

test('controla inicio, fin, vencimiento y alerta de rangos NCF', () => {
  const settings = {
    ncfB01Seq: 98,
    ncfB01Start: 1,
    ncfB01End: 100,
    ncfB01Expiry: '2026-12-31',
    ncfLowStockWarning: 5
  };
  const status = core.ncfRangeStatus(settings, 'B01', '2026-07-29');
  assert.equal(status.remaining, 3);
  assert.equal(status.low, true);
  assert.equal(status.valid, true);
  assert.throws(() => core.assertNcfRangeAvailable(settings, 'B01', '2027-01-01'), /venció/);
});

test('genera registros DGII 606 y 608 con sus estructuras completas', () => {
  const record606 = core.build606Record({
    supplierRnc: '132702077',
    expenseType: '09',
    ncf: 'B0100000001',
    date: '2026-07-10',
    paymentDate: '2026-07-20',
    goodsAmount: 1000,
    servicesAmount: 500,
    total: 1770,
    itbis: 270,
    paymentMethod: '04'
  });
  assert.equal(record606.length, 23);
  assert.equal(record606[7], 500);
  assert.equal(record606[8], 1000);
  assert.equal(record606[9], 1500);
  assert.deepEqual(core.build608Record({
    docType: 'invoice',
    status: 'cancelled',
    ncf: 'B0100000001',
    date: '2026-07-10',
    cancellationDate: '2026-07-29',
    cancellationType: '04'
  }), ['B0100000001', '20260710', '04']);
});

test('filtra registros por período fiscal válido', () => {
  assert.equal(core.recordBelongsToPeriod({ date: '2026-07-31' }, '2026-07'), true);
  assert.equal(core.recordBelongsToPeriod({ date: '2026-06-30' }, '2026-07'), false);
  assert.throws(() => core.normalizeFiscalPeriod('07-2026'));
});

test('calcula margen, cobertura de costos y excepciones comerciales', () => {
  const metrics = core.calculateCommercialMetrics([
    { price: 1000, qty: 2, discount: 10, unitCost: 600 },
    { price: 500, qty: 1, discount: 0, unitCost: 200 }
  ], 5);
  assert.equal(metrics.netSales, 2185);
  assert.equal(metrics.totalCost, 1400);
  assert.equal(metrics.grossProfit, 785);
  assert.equal(metrics.marginPct, 35.93);
  assert.equal(metrics.costCoveragePct, 100);
  assert.deepEqual(core.commercialApprovalReasons(metrics, {
    minimumMarginPct: 40,
    minimumCostCoveragePct: 80,
    maxOperatorDiscountPct: 8
  }), [
    'Descuento de 10% supera el máximo operativo de 8%',
    'Margen de 35.93% queda por debajo del mínimo de 40%'
  ]);
});

test('resuelve el ciclo de cotizaciones y fechas recurrentes', () => {
  assert.equal(core.quoteWorkflowMeta('sent', '2026-08-01', new Date('2026-08-02T12:00:00')).status, 'expired');
  assert.equal(core.quoteWorkflowMeta('accepted', '2026-08-01', new Date('2026-08-02T12:00:00')).status, 'accepted');
  assert.equal(core.nextRecurringDate('2026-01-31', 'monthly'), '2026-02-28');
  assert.equal(core.nextRecurringDate('2026-08-02', 'weekly'), '2026-08-09');
  assert.equal(core.stableCommercialFingerprint({ clientId: 'c1', items: [{ description: 'A', qty: 1, price: 10 }] }),
    core.stableCommercialFingerprint({ clientId: 'c1', items: [{ description: 'A', qty: 1, price: 10 }] }));
});
