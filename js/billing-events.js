/** CSP-safe delegated event router for the billing workspace. */
(function () {
  'use strict';

  const allowedMethods = {
    ERPBilling: new Set([
      'initDashboard', 'exportInvoicesToCSV', 'exportDGII607ToCSV', 'exportDGII608',
      'openNewInvoiceForm', 'switchSubTab', 'renderInvoicesTable', 'saveInvoice',
      'handleDocTypeChange', 'searchClientAutocomplete', 'searchClientByRnc',
      'handleNcfTypeChange', 'removeAllRowTaxes', 'addInvoiceFormItemRow',
      'calculateInvoiceFormTotals', 'handleCashSessionAction', 'clearPosCart',
      'searchPosClient', 'openNewClientFormFromPos', 'printKitchenTicket',
      'saveTableOrder', 'handlePosNcfTypeChange', 'handlePosDocTypeChange',
      'checkoutPos', 'searchPosProducts', 'openSimulatedBarcodeModal', 'filterPosCategory',
      'renderSessionsHistoryTable', 'switchPanel', 'openRegisterPaymentModal',
      'convertQuoteToInvoice', 'handlePrintFormatChange', 'downloadInvoicePDF',
      'printCurrentInvoice', 'openGeneralAbonoModal', 'exportClientsToCSV',
      'renderClientsTable', 'saveClient', 'exportProductsToCSV', 'renderProductsTable',
      'saveProduct', 'handleModalSourceChange', 'saveSettings', 'closeModal',
      'registerPayment', 'saveFiscalAdjustment', 'handleFiscalAdjustmentTypeChange',
      'handleFiscalAdjustmentResolutionChange', 'triggerSimulatedScan', 'simulateNfcCardTap',
      'openCashSession', 'closeCashSession', 'calculateCashDifference',
      'confirmPosCashPayment', 'calculatePosCashChange', 'submitGeneralAbono',
      'viewInvoice', 'printInvoiceDirectly', 'duplicateDocument', 'editQuote',
      'convertQuoteFromList', 'openRegisterPaymentFromList', 'openFiscalAdjustment',
      'cancelInvoice', 'searchRowProductAutocomplete', 'handleRowPriceQtyChange',
      'handleRowTaxChange', 'deleteInvoiceFormItemRow', 'viewClientProfile',
      'openEditClientForm', 'deleteClient', 'openEditProductForm', 'deleteProduct',
      'changePosCartItemQty', 'removePosCartItem'
    ]),
    ERPExtensions: new Set([
      'openPanel', 'loadAlerts', 'loadReceivables', 'export606', 'savePurchase',
      'saveBankMovement', 'loadInventoryAudit', 'markPurchasePaid', 'reconcileBankMovement'
    ]),
    ERPBillingWorkflows: new Set([
      'load', 'restoreLatestDraft', 'discardLatestDraft', 'saveDraftNow',
      'openTemplateDialog', 'openStatementDialog', 'openReminderDialog',
      'openShareDialog', 'setQuoteStatus', 'reviewApproval', 'prepareReminder',
      'completeReminder', 'loadTemplate', 'deleteTemplate', 'generateRecurringDraft',
      'recordStockReview', 'openHistoryDialog'
    ])
  };

  function splitArguments(source) {
    const args = [];
    let current = '';
    let quote = '';
    let depth = 0;
    for (let index = 0; index < source.length; index += 1) {
      const char = source[index];
      if (quote) {
        current += char;
        if (char === quote && source[index - 1] !== '\\') quote = '';
      } else if (char === '"' || char === "'") {
        quote = char;
        current += char;
      } else if (char === '(') {
        depth += 1;
        current += char;
      } else if (char === ')') {
        depth -= 1;
        current += char;
      } else if (char === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) args.push(current.trim());
    return args;
  }

  function parseArgument(token, element, event) {
    if (token === 'event') return event;
    if (token === 'this') return element;
    if (token === 'this.value') return element.value;
    if (token === 'true') return true;
    if (token === 'false') return false;
    if (token === 'null') return null;
    if (/^-?\d+(?:\.\d+)?$/.test(token)) return Number(token);
    const elementValue = token.match(/^document\.getElementById\(['"]([^'"]+)['"]\)\.value$/);
    if (elementValue) return document.getElementById(elementValue[1])?.value || '';
    if ((token.startsWith("'") && token.endsWith("'")) || (token.startsWith('"') && token.endsWith('"'))) {
      return token.slice(1, -1).replace(/\\(['"\\])/g, '$1');
    }
    throw new Error(`Argumento de evento no permitido: ${token}`);
  }

  function invoke(expression, element, event) {
    const match = String(expression || '').trim().match(/^(ERPBilling|ERPExtensions|ERPBillingWorkflows)\.([A-Za-z0-9_]+)\((.*)\)$/s);
    if (!match) throw new Error(`Acción de interfaz no válida: ${expression}`);
    const [, namespace, method, rawArguments] = match;
    if (!allowedMethods[namespace] || !allowedMethods[namespace].has(method)) {
      throw new Error(`Acción no autorizada: ${namespace}.${method}`);
    }
    const target = window[namespace];
    if (!target || typeof target[method] !== 'function') throw new Error(`Acción no disponible: ${namespace}.${method}`);
    const args = rawArguments.trim()
      ? splitArguments(rawArguments).map(token => parseArgument(token, element, event))
      : [];
    return target[method](...args);
  }

  function handle(type, event) {
    const attribute = `data-erp-${type}`;
    const element = type === 'submit'
      ? event.target.closest(`[${attribute}]`)
      : event.target.closest(`[${attribute}]`);
    if (!element) return;
    if (type === 'click' || type === 'submit') event.preventDefault();
    try {
      const result = invoke(element.getAttribute(attribute), element, event);
      if (result && typeof result.catch === 'function') {
        result.catch(error => {
          console.error('Billing action failed', error);
          if (window.ERPBilling) window.ERPBilling.showToast(error.message || 'No se pudo completar la acción.', 'danger');
        });
      }
    } catch (error) {
      console.error('Billing action routing failed', error);
      if (window.ERPBilling) window.ERPBilling.showToast(error.message || 'Acción no disponible.', 'danger');
    }
  }

  document.addEventListener('click', event => handle('click', event));
  document.addEventListener('change', event => handle('change', event));
  document.addEventListener('input', event => handle('input', event));
  document.addEventListener('submit', event => handle('submit', event));
})();
