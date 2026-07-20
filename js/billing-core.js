(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ERPBillingCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const NCF_TYPES = ['B01', 'B02', 'B12', 'B14', 'B15'];
  const RESTAURANT_ORDER_STATUSES = ['pending', 'preparing', 'ready', 'served', 'pending_payment', 'closed', 'cancelled'];
  const RESTAURANT_ACTIVE_STATUSES = ['pending', 'preparing', 'ready', 'served', 'pending_payment', 'delivered'];
  const RESTAURANT_STATUS_TRANSITIONS = {
    pending: ['preparing', 'closed', 'cancelled'],
    preparing: ['pending', 'ready', 'closed', 'cancelled'],
    ready: ['pending', 'served', 'closed', 'cancelled'],
    served: ['pending_payment', 'closed', 'cancelled'],
    pending_payment: ['closed', 'cancelled'],
    delivered: ['closed', 'cancelled'],
    closed: ['pending'],
    cancelled: ['pending']
  };

  const SUPPORTED_COMPANY_CODES = ['CREATICOS', 'FUTUNETSRL'];

  function normalizeCompanyCode(value) {
    const normalized = String(value || '').trim().toUpperCase();
    return normalized === 'FUTUNET' ? 'FUTUNETSRL' : normalized;
  }

  function resolveCompanyCode(userData, storedCompanyCode = 'CREATICOS') {
    const assigned = normalizeCompanyCode(userData && userData.companyCode);
    if (assigned && !SUPPORTED_COMPANY_CODES.includes(assigned)) {
      throw new Error('La empresa seleccionada no está habilitada en este sistema.');
    }
    if (assigned) return assigned;
    const stored = normalizeCompanyCode(storedCompanyCode);
    return SUPPORTED_COMPANY_CODES.includes(stored) ? stored : 'CREATICOS';
  }

  function paymentMethodGroup(value) {
    const method = String(value || '').trim().toLowerCase();
    if (method.includes('efectivo') || method === 'cash') return 'cash';
    if (method.includes('tarjeta') || method === 'card' || method === 'nfc') return 'card';
    if (method.includes('transferencia') || method.includes('cheque') || method === 'transfer') return 'transfer';
    if (method.includes('crédito') || method.includes('credito') || method === 'credit') return 'credit';
    return 'other';
  }

  function isCreditTerms(value) {
    const terms = String(value || '').trim().toLowerCase();
    return terms.includes('crédito') || terms.includes('credito') || /^\d+\s*d[ií]as?$/.test(terms);
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function roundMoney(value) {
    return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
  }

  function toLocalDateInput(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseDateOnly(value) {
    if (value instanceof Date) return new Date(value.getTime());
    if (value && typeof value === 'object' && Number.isFinite(value.seconds)) {
      return new Date(value.seconds * 1000);
    }
    const raw = String(value || '').trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatDate(value, locale = 'es-DO') {
    const date = parseDateOnly(value);
    if (!date) return '';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  function isOverdue(dueDate, balance, now = new Date()) {
    if (toNumber(balance) <= 0) return false;
    const due = String(dueDate || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(due) && due < toLocalDateInput(now);
  }

  function normalizeNcfPrefix(value, expectedType) {
    const type = String(expectedType || '').toUpperCase();
    if (!NCF_TYPES.includes(type)) throw new Error('Tipo de NCF no soportado.');
    const normalized = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return normalized.startsWith(type) ? type : type;
  }

  function buildNcf(type, prefix, sequence) {
    const normalizedType = String(type || '').toUpperCase();
    const seq = Number(sequence);
    if (!NCF_TYPES.includes(normalizedType)) throw new Error('Tipo de NCF no soportado.');
    if (!Number.isInteger(seq) || seq < 1 || seq > 99999999) {
      throw new Error('La secuencia NCF debe ser un entero entre 1 y 99,999,999.');
    }
    return normalizeNcfPrefix(prefix, normalizedType) + String(seq).padStart(8, '0');
  }

  function isValidNcf(value, options = {}) {
    const ncf = String(value || '').trim().toUpperCase();
    if (/^B\d{10}$/.test(ncf)) return true;
    return options.allowElectronic !== false && /^E\d{12}$/.test(ncf);
  }

  function resolveLineTax(line = {}) {
    const price = Math.max(0, toNumber(line.price));
    const qty = Math.max(0, toNumber(line.qty, 1));
    const discount = Math.min(100, Math.max(0, toNumber(line.discount)));
    const net = price * qty * (1 - discount / 100);
    const tax = Math.max(0, toNumber(line.tax));
    const explicitRate = Math.max(0, toNumber(line.taxRate, NaN));

    if (line.taxMode === 'amount') {
      return { amount: roundMoney(tax), rate: Number.isFinite(explicitRate) ? explicitRate : (net > 0 ? tax / net * 100 : 0), mode: 'amount' };
    }
    if (line.taxMode === 'rate') {
      const rate = Number.isFinite(explicitRate) ? explicitRate : tax;
      return { amount: roundMoney(net * rate / 100), rate: rate, mode: 'rate' };
    }

    const storedTotal = Number(line.total);
    if (Number.isFinite(storedTotal)) {
      const asAmount = net + tax;
      const asRate = net + (net * tax / 100);
      if (Math.abs(storedTotal - asAmount) <= Math.abs(storedTotal - asRate)) {
        return { amount: roundMoney(tax), rate: net > 0 ? tax / net * 100 : 0, mode: 'amount' };
      }
      return { amount: roundMoney(net * tax / 100), rate: tax, mode: 'rate' };
    }

    if (tax > 0 && tax <= 100) {
      return { amount: roundMoney(net * tax / 100), rate: tax, mode: 'rate' };
    }
    return { amount: roundMoney(tax), rate: net > 0 ? tax / net * 100 : 0, mode: 'amount' };
  }

  function paymentStatus(total, paidAmount) {
    const totalValue = Math.max(0, roundMoney(total));
    const paid = Math.max(0, roundMoney(paidAmount));
    if (totalValue > 0 && paid >= totalValue - 0.01) return 'paid';
    if (paid > 0) return 'partial';
    return 'pending';
  }

  function normalizeTableName(value) {
    const name = String(value || '').replace(/\s+/g, ' ').trim();
    if (!name || name.length > 50) {
      throw new Error('La mesa debe tener entre 1 y 50 caracteres.');
    }
    if (!/^[\p{L}\p{N}\s#()._-]+$/u.test(name)) {
      throw new Error('La mesa contiene caracteres no permitidos.');
    }
    return name;
  }

  function normalizeRestaurantTables(value) {
    const source = Array.isArray(value) ? value : String(value || '').split(/[\n,]+/);
    const result = [];
    const seen = new Set();
    source.forEach(item => {
      const normalized = normalizeTableName(item);
      const key = normalized.toLocaleLowerCase('es-DO');
      if (!seen.has(key)) {
        seen.add(key);
        result.push(normalized);
      }
    });
    if (result.length < 1 || result.length > 50) {
      throw new Error('Configura entre 1 y 50 mesas.');
    }
    return result;
  }

  function restaurantItemsFingerprint(items) {
    if (!Array.isArray(items)) return '[]';
    return JSON.stringify(items.map(item => ({
      productId: String(item.productId || ''),
      name: String(item.name || ''),
      price: roundMoney(item.price),
      qty: Math.max(0, toNumber(item.qty)),
      tax: Math.max(0, toNumber(item.tax)),
      notes: String(item.notes || ''),
      modifiers: Array.isArray(item.modifiers) ? item.modifiers.map(String) : [],
      allergyWarning: Boolean(item.allergyWarning)
    })));
  }

  function restaurantItemsChanged(previousItems, nextItems) {
    return restaurantItemsFingerprint(previousItems) !== restaurantItemsFingerprint(nextItems);
  }

  function canTransitionRestaurantOrder(fromStatus, toStatus) {
    const from = String(fromStatus || '');
    const to = String(toStatus || '');
    if (from === to) return RESTAURANT_ORDER_STATUSES.includes(from);
    return Boolean(RESTAURANT_STATUS_TRANSITIONS[from] && RESTAURANT_STATUS_TRANSITIONS[from].includes(to));
  }

  function isActiveRestaurantOrder(order) {
    return Boolean(order && RESTAURANT_ACTIVE_STATUSES.includes(String(order.status || 'pending')));
  }

  function restaurantOrderTotal(items) {
    if (!Array.isArray(items)) return 0;
    return roundMoney(items.reduce((sum, item) => {
      const base = Math.max(0, toNumber(item.price)) * Math.max(0, toNumber(item.qty));
      return sum + base + (base * Math.max(0, toNumber(item.tax)) / 100);
    }, 0));
  }

  function restaurantStatusMeta(status) {
    const values = {
      pending: { label: 'Pendiente', tone: 'warning' },
      preparing: { label: 'Preparando', tone: 'info' },
      ready: { label: 'Lista', tone: 'success' },
      served: { label: 'Servida', tone: 'purple' },
      delivered: { label: 'Servida', tone: 'purple' },
      pending_payment: { label: 'Por cobrar', tone: 'purple' },
      closed: { label: 'Cerrada', tone: 'neutral' },
      cancelled: { label: 'Cancelada', tone: 'danger' }
    };
    return values[status] || values.pending;
  }

  function csvCell(value) {
    let text = value === undefined || value === null ? '' : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function paymentBucketsFor607(invoice, allPayments = []) {
    const total = Math.max(0, roundMoney(invoice && invoice.total));
    const buckets = { cash: 0, transfer: 0, card: 0, credit: 0, gift: 0, barter: 0, other: 0 };
    const invoicePayments = allPayments.filter(payment => payment.invoiceId === invoice.id);

    invoicePayments.forEach(payment => {
      const amount = Math.max(0, roundMoney(payment.amount));
      const method = String(payment.method || '').toLowerCase();
      if (method.includes('efectivo')) buckets.cash += amount;
      else if (method.includes('transfer') || method.includes('cheque') || method.includes('depósito') || method.includes('deposito')) buckets.transfer += amount;
      else if (method.includes('tarjeta') || method.includes('nfc') || method.includes('contactless')) buckets.card += amount;
      else if (method.includes('bono') || method.includes('certificado')) buckets.gift += amount;
      else if (method.includes('permuta')) buckets.barter += amount;
      else buckets.other += amount;
    });

    let allocated = Object.values(buckets).reduce((sum, value) => sum + value, 0);
    if (allocated === 0 && toNumber(invoice.paidAmount) > 0) {
      const legacyPaid = Math.min(total, Math.max(0, roundMoney(invoice.paidAmount)));
      const legacyMethod = String(invoice.paymentMethod || invoice.paymentTerms || invoice.paymentTerm || '').toLowerCase();
      if (legacyMethod.includes('transfer') || legacyMethod.includes('cheque')) buckets.transfer = legacyPaid;
      else if (legacyMethod.includes('tarjeta') || legacyMethod.includes('nfc')) buckets.card = legacyPaid;
      else buckets.cash = legacyPaid;
      allocated = legacyPaid;
    }

    if (allocated > total && allocated > 0) {
      const factor = total / allocated;
      Object.keys(buckets).forEach(key => { buckets[key] = roundMoney(buckets[key] * factor); });
      allocated = Object.values(buckets).reduce((sum, value) => sum + value, 0);
    }
    buckets.credit = roundMoney(Math.max(0, total - allocated));
    Object.keys(buckets).forEach(key => { buckets[key] = roundMoney(buckets[key]); });
    return buckets;
  }

  function classify607Invoice(invoice) {
    if (!invoice || invoice.docType !== 'invoice' || invoice.status === 'cancelled') return 'excluded';
    const ncf = String(invoice.ncf || '').trim().toUpperCase();
    if (/^E\d{12}$/.test(ncf)) return 'electronic';
    if (!/^B\d{10}$/.test(ncf)) return 'invalid';
    const total = Math.max(0, toNumber(invoice.total));
    if (ncf.startsWith('B02') && total < 250000) return 'consumer-summary';
    const rnc = String(invoice.clientRnc || '').replace(/\D/g, '');
    if (ncf.startsWith('B02') && total >= 250000 && ![9, 11].includes(rnc.length)) return 'invalid';
    return 'detail';
  }

  function build607Record(invoice, allPayments = []) {
    if (classify607Invoice(invoice) !== 'detail') return null;
    const rnc = String(invoice.clientRnc || '').replace(/\D/g, '');
    const typeId = rnc.length === 9 ? 1 : (rnc.length === 11 ? 2 : 3);
    const buckets = paymentBucketsFor607(invoice, allPayments);
    return [
      rnc,
      typeId,
      String(invoice.ncf || '').trim().toUpperCase(),
      String(invoice.modifiedNcf || ''),
      Number(invoice.incomeType) || 1,
      String(invoice.date || '').replace(/\D/g, '').slice(0, 8),
      String(invoice.retentionDate || '').replace(/\D/g, '').slice(0, 8),
      roundMoney(invoice.subtotal),
      roundMoney(invoice.itbis),
      roundMoney(invoice.itbisWithheld),
      roundMoney(invoice.itbisPerceived),
      roundMoney(invoice.incomeTaxWithheld),
      roundMoney(invoice.incomeTaxPerceived),
      roundMoney(invoice.selectiveTax),
      roundMoney(invoice.otherTaxes),
      roundMoney(invoice.legalTip),
      buckets.cash,
      buckets.transfer,
      buckets.card,
      buckets.credit,
      buckets.gift,
      buckets.barter,
      buckets.other
    ];
  }

  return {
    NCF_TYPES,
    SUPPORTED_COMPANY_CODES,
    RESTAURANT_ORDER_STATUSES,
    RESTAURANT_ACTIVE_STATUSES,
    normalizeCompanyCode,
    resolveCompanyCode,
    paymentMethodGroup,
    isCreditTerms,
    roundMoney,
    toLocalDateInput,
    parseDateOnly,
    formatDate,
    isOverdue,
    normalizeNcfPrefix,
    buildNcf,
    isValidNcf,
    resolveLineTax,
    paymentStatus,
    normalizeTableName,
    normalizeRestaurantTables,
    restaurantItemsFingerprint,
    restaurantItemsChanged,
    canTransitionRestaurantOrder,
    isActiveRestaurantOrder,
    restaurantOrderTotal,
    restaurantStatusMeta,
    csvCell,
    paymentBucketsFor607,
    classify607Invoice,
    build607Record
  };
});
