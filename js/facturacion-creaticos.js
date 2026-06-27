/**
 * Creaticos Billing System Lógica JS
 * Maneja estadísticas (Chart.js), CRUD de facturas, clientes, productos y cobros con Firestore.
 */

window.CreaticosBilling = (function () {
  'use strict';

  // Firestore DB reference
  function getDB() { return window.FutunetFirebase.db; }

  // System State Caches
  let settings = null;
  let invoices = [];
  let clients = [];
  let products = [];
  let creaticosProducts = [];
  let futunetProducts = [];
  let payments = [];
  
  let currentInvoiceItems = [];
  let dashboardChart = null;
  let returnToInvoice = false;
  let returnToPos = false;
  let posCart = [];
  let posClient = { id: '', name: 'Consumidor Final', rnc: '' };
  let posNcfType = 'none';
  let posDocType = 'invoice';
  let posActiveCategory = 'all';

  // Pagination for Invoices
  let invoiceCurrentPage = 1;
  const invoicePageSize = 10;

  // Edit State
  let editingInvoiceId = null;
  let editingInvoiceNumber = null;

  // Initialize Module
  async function init() {
    console.log('%c✏️ Initializing Creaticos Billing System...', 'color: #6366f1; font-weight: bold;');
    try {
      await loadSettings();
      await fetchAllData();
      initDashboard();
      setupEventListeners();
    } catch (err) {
      console.error('Error initializing Creaticos Billing:', err);
      alert('Error al inicializar la base de datos de facturación.');
    }
  }

  // Load Settings (Ensure default document in Firestore if not existing)
  async function loadSettings() {
    const docRef = getDB().collection('creaticos_settings').doc('general');
    const doc = await docRef.get();
    if (doc.exists) {
      settings = doc.data();
      // Ensure name is updated to Creaticos Group in Firestore if it was the old one
      if (settings.name === 'Creaticos Papelería y Sublimados' || settings.name === 'Creaticos Papelería') {
        settings.name = 'Creaticos Group';
        await docRef.update({ name: 'Creaticos Group' });
      }
      // Backward compatibility for quote settings
      if (settings.quotePrefix === undefined) settings.quotePrefix = 'COT-';
      if (settings.nextQuoteNum === undefined) settings.nextQuoteNum = 1001;
      if (settings.proformaPrefix === undefined) settings.proformaPrefix = 'PROF-';
      if (settings.nextProformaNum === undefined) settings.nextProformaNum = 1001;
      if (settings.ncfB14Prefix === undefined) settings.ncfB14Prefix = 'B1400000';
      if (settings.ncfB14Seq === undefined) settings.ncfB14Seq = 1;
      if (settings.ncfB15Prefix === undefined) settings.ncfB15Prefix = 'B1500000';
      if (settings.ncfB15Seq === undefined) settings.ncfB15Seq = 1;
      if (settings.ncfB12Prefix === undefined) settings.ncfB12Prefix = 'B1200000';
      if (settings.ncfB12Seq === undefined) settings.ncfB12Seq = 1;
    } else {
      // Default initial settings
      settings = {
        name: 'Creaticos Group',
        rnc: '131-78945-2',
        phone: '849-342-8525',
        email: '',
        address: 'Calle 7 Las Colinas, Santiago',
        invoicePrefix: 'CRE-',
        nextInvoiceNum: 1001,
        quotePrefix: 'COT-',
        nextQuoteNum: 1001,
        proformaPrefix: 'PROF-',
        nextProformaNum: 1001,
        ncfB01Prefix: 'B0100000',
        ncfB01Seq: 1,
        ncfB02Prefix: 'B0200000',
        ncfB02Seq: 1,
        ncfB14Prefix: 'B1400000',
        ncfB14Seq: 1,
        ncfB15Prefix: 'B1500000',
        ncfB15Seq: 1,
        ncfB12Prefix: 'B1200000',
        ncfB12Seq: 1,
        defaultTax: 18
      };
      await docRef.set(settings);
    }
    updateBrandingText();
  }

  // Bind settings to UI details
  function updateBrandingText() {
    // Populate header details in printable invoice
    const rncEl = document.getElementById('view-company-rnc');
    const phoneEl = document.getElementById('view-company-phone');
    const emailEl = document.getElementById('view-company-email');
    const addressEl = document.getElementById('view-company-address');
    const nameEl = document.getElementById('view-company-name');

    if (rncEl) rncEl.textContent = settings.rnc;
    if (phoneEl) phoneEl.textContent = settings.phone;
    if (emailEl) emailEl.textContent = settings.email;
    if (addressEl) addressEl.textContent = settings.address;
    if (nameEl) nameEl.textContent = settings.name;
  }

  // Fetch all collections in background
  async function fetchAllData() {
    const clientsSnap = await getDB().collection('creaticos_clients').get();
    clients = [];
    clientsSnap.forEach(doc => {
      clients.push({ id: doc.id, ...doc.data() });
    });

    const productsSnap = await getDB().collection('creaticos_products').get();
    creaticosProducts = [];
    productsSnap.forEach(doc => {
      creaticosProducts.push({ id: doc.id, ...doc.data(), _isCreaticos: true });
    });

    const futunetSnap = await getDB().collection('products').get();
    futunetProducts = [];
    futunetSnap.forEach(doc => {
      futunetProducts.push({ id: doc.id, ...doc.data(), _isCreaticos: false });
    });

    // Update active products based on filter selection
    const sourceEl = document.getElementById('products-source-filter');
    const source = sourceEl ? sourceEl.value : 'creaticos';
    products = source === 'creaticos' ? creaticosProducts : futunetProducts;

    const invoicesSnap = await getDB().collection('creaticos_invoices').orderBy('createdAt', 'desc').get();
    invoices = [];
    invoicesSnap.forEach(doc => {
      invoices.push({ id: doc.id, ...doc.data() });
    });

    const paymentsSnap = await getDB().collection('creaticos_payments').orderBy('timestamp', 'desc').get();
    payments = [];
    paymentsSnap.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });
  }

  // Setup general DOM action listeners
  function setupEventListeners() {
    // Autocomplete list close on click outside
    document.addEventListener('click', function (e) {
      const dropdown = document.getElementById('client-autocomplete-dropdown');
      if (dropdown && !e.target.closest('.autocomplete-wrapper')) {
        dropdown.style.display = 'none';
      }
      const posDropdown = document.getElementById('pos-client-autocomplete-list');
      if (posDropdown && !e.target.closest('#pos-client-search')) {
        posDropdown.style.display = 'none';
      }
    });

    // Barcode scanner keyboard wedge global listener
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    window.addEventListener('keypress', (e) => {
      const posContent = document.getElementById('subtab-invoices-pos');
      if (!posContent || !posContent.classList.contains('is-active')) return;

      // Ignore if typing in text inputs (except search/sim inputs)
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        const id = document.activeElement.id;
        if (id !== 'pos-product-search' && id !== 'barcode-simulator-manual') {
          return;
        }
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) {
          handleScannedBarcode(barcodeBuffer);
          barcodeBuffer = '';
          e.preventDefault();
        }
      } else {
        barcodeBuffer += e.key;
      }
    });
  }

  // Switch Panel View
  function switchPanel(panelId) {
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach(p => p.classList.remove('is-active'));
    
    const panel = document.getElementById('panel-' + panelId);
    if (panel) panel.classList.add('is-active');

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Format Currencies
  function formatMoney(amount) {
    return 'RD$ ' + Number(amount || 0).toLocaleString('es-DO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Format Dates
  function formatDate(timestamp) {
    if (!timestamp) return '';
    // Handle Firestore timestamp vs JS Date/string
    let date = timestamp;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // ═══════════════════════════════════════════
  // 1. DASHBOARD & STATS LÓGICA
  // ═══════════════════════════════════════════
  function initDashboard() {
    switchPanel('dashboard');

    let totalBilled = 0;
    let totalPaid = 0;

    // Filter cancelled invoices from total calculations
    invoices.forEach(inv => {
      if (inv.status !== 'cancelled') {
        totalBilled += Number(inv.total || 0);
        totalPaid += Number(inv.paidAmount || 0);
      }
    });

    const totalPending = totalBilled - totalPaid;

    // Set stats text
    document.getElementById('stat-total-billed').textContent = formatMoney(totalBilled);
    document.getElementById('stat-total-paid').textContent = formatMoney(totalPaid);
    document.getElementById('stat-total-pending').textContent = formatMoney(totalPending);
    document.getElementById('stat-total-clients').textContent = clients.length.toString();

    // Populate recent invoices table
    const recentBody = document.getElementById('db-recent-invoices-body');
    recentBody.innerHTML = '';
    
    const recent = invoices.slice(0, 5);
    if (recent.length === 0) {
      recentBody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">No hay facturas registradas</td></tr>`;
    } else {
      recent.forEach(inv => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => viewInvoice(inv.id);
        tr.innerHTML = `
          <td><strong>${inv.invoiceNumber}</strong></td>
          <td>${inv.clientName}</td>
          <td style="text-align:right;">${formatMoney(inv.total)}</td>
        `;
        recentBody.appendChild(tr);
      });
    }

    // Build statistics charts
    renderMonthlyChart();
  }

  function renderMonthlyChart() {
    const ctx = document.getElementById('chart-billing-trend');
    if (!ctx) return;

    if (dashboardChart) {
      dashboardChart.destroy();
    }

    // Process last 6 months invoice statistics
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlySales = {};

    // Get current last 6 months list
    const labels = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      monthlySales[key] = 0;
      labels.push({ key: key, label: monthNames[d.getMonth()] + ' ' + d.getFullYear() });
    }

    invoices.forEach(inv => {
      if (inv.status === 'cancelled') return;
      let date = null;
      if (inv.createdAt && inv.createdAt.seconds) {
        date = new Date(inv.createdAt.seconds * 1000);
      } else if (inv.date) {
        date = new Date(inv.date);
      }
      if (date) {
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
        if (monthlySales[key] !== undefined) {
          monthlySales[key] += Number(inv.total || 0);
        }
      }
    });

    const data = labels.map(l => monthlySales[l.key]);

    dashboardChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(l => l.label),
        datasets: [{
          label: 'Facturado (RD$)',
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return 'RD$ ' + value.toLocaleString(); }
            }
          }
        }
      }
    });
  }

  // ═══════════════════════════════════════════
  // 2. FACTURAS (INVOICES) CRUD & LOGIC
  // ═══════════════════════════════════════════
  function renderInvoicesTable() {
    switchPanel('invoices');

    const startDateVal = document.getElementById('filter-invoice-start-date').value;
    const endDateVal = document.getElementById('filter-invoice-end-date').value;
    const statusFilter = document.getElementById('invoice-status-filter').value;
    const ncfFilter = document.getElementById('invoice-ncf-filter').value;
    const searchVal = document.getElementById('invoice-search').value.toLowerCase().trim();

    // Filter array
    let filtered = invoices.filter(inv => {
      // 1. Status Filter
      let matchStatus = true;
      if (statusFilter !== 'all') {
        matchStatus = (inv.status === statusFilter);
      }

      // 2. NCF Filter
      let matchNcf = true;
      if (ncfFilter !== 'all') {
        if (ncfFilter === 'none') {
          matchNcf = !inv.ncf || inv.ncf === '';
        } else {
          matchNcf = inv.ncf && inv.ncf.startsWith(ncfFilter);
        }
      }

      // 3. Date Filter
      let matchDate = true;
      let invDate = null;
      if (inv.date) {
        invDate = new Date(inv.date);
      }
      if (invDate) {
        invDate.setHours(0,0,0,0);
        if (startDateVal) {
          const startDate = new Date(startDateVal);
          startDate.setHours(0,0,0,0);
          if (invDate < startDate) matchDate = false;
        }
        if (endDateVal) {
          const endDate = new Date(endDateVal);
          endDate.setHours(0,0,0,0);
          if (invDate > endDate) matchDate = false;
        }
      } else if (startDateVal || endDateVal) {
        matchDate = false;
      }

      // 4. Search Filter
      let matchSearch = true;
      if (searchVal) {
        const clientName = (inv.clientName || '').toLowerCase();
        const clientRnc = (inv.clientRnc || '').toLowerCase();
        const invoiceNum = (inv.invoiceNumber || '').toLowerCase();
        const ncfVal = (inv.ncf || '').toLowerCase();
        matchSearch = clientName.includes(searchVal) ||
                      clientRnc.includes(searchVal) ||
                      invoiceNum.includes(searchVal) ||
                      ncfVal.includes(searchVal);
      }

      return matchStatus && matchNcf && matchDate && matchSearch;
    });

    // Pagination bounds
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / invoicePageSize) || 1;
    if (invoiceCurrentPage > totalPages) invoiceCurrentPage = totalPages;

    const startIdx = (invoiceCurrentPage - 1) * invoicePageSize;
    const paginated = filtered.slice(startIdx, startIdx + invoicePageSize);

    const tbody = document.getElementById('invoices-table-body');
    tbody.innerHTML = '';

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:32px;">No se encontraron facturas.</td></tr>`;
      document.getElementById('invoices-pagination').innerHTML = '';
      return;
    }

    paginated.forEach(inv => {
      const tr = document.createElement('tr');
      
      let statusBadge = '';
      if (inv.docType === 'quote') {
        statusBadge = '<span class="admin-badge" style="background:#e0f2fe; color:#0369a1; border: 1px solid #bae6fd;">Cotización</span>';
      } else if (inv.docType === 'proforma') {
        statusBadge = '<span class="admin-badge" style="background:#fef3c7; color:#d97706; border: 1px solid #fde68a;">Proforma</span>';
      } else if (inv.status === 'paid') {
        statusBadge = '<span class="admin-badge badge-paid">Pagada</span>';
      } else if (inv.status === 'pending') {
        const isOverdue = new Date(inv.dueDate) < new Date() && inv.paidAmount < inv.total;
        statusBadge = isOverdue 
          ? '<span class="admin-badge badge-overdue">Vencida</span>' 
          : '<span class="admin-badge badge-pending">Pendiente</span>';
      } else if (inv.status === 'cancelled') {
        statusBadge = '<span class="admin-badge badge-cancelled">Anulada</span>';
      }

      const balance = Number(inv.total) - Number(inv.paidAmount || 0);

      let actionsHtml = `
        <div class="table-actions">
          <button class="table-btn table-btn-primary" title="Ver Detalle" onclick="CreaticosBilling.viewInvoice('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="table-btn table-btn-secondary" title="Imprimir / PDF" onclick="CreaticosBilling.printInvoiceDirectly('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          </button>
      `;

      if (inv.status !== 'cancelled') {
        // Edit button is available for all documents (quotes, proformas, invoices)
        actionsHtml += `
          <button class="table-btn table-btn-secondary" title="Editar" onclick="CreaticosBilling.editQuote('${inv.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
          </button>
        `;

        if (inv.docType === 'quote' || inv.docType === 'proforma') {
          actionsHtml += `
            <button class="table-btn table-btn-success" title="Convertir a Factura" onclick="CreaticosBilling.convertQuoteFromList('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          `;
        } else if (inv.status === 'pending' && balance > 0) {
          actionsHtml += `
            <button class="table-btn table-btn-success" title="Registrar Cobro" onclick="CreaticosBilling.openRegisterPaymentFromList('${inv.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 14h.01M10 14h.01"/></svg>
            </button>
          `;
        }

        actionsHtml += `
          <button class="table-btn table-btn-danger" title="Anular Factura" onclick="CreaticosBilling.cancelInvoice('${inv.id}', '${inv.invoiceNumber}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          </button>
        `;
      }

      actionsHtml += `</div>`;

      tr.innerHTML = `
        <td><strong>${inv.invoiceNumber}</strong></td>
        <td>${inv.clientName}</td>
        <td>${formatDate(inv.date)}</td>
        <td>${formatDate(inv.dueDate)}</td>
        <td>${inv.ncf || '<span style="color:#cbd5e1;font-size:0.8rem;">Ninguno</span>'}</td>
        <td>${formatMoney(inv.total)}</td>
        <td>${statusBadge}</td>
        <td>${actionsHtml}</td>
      `;
      tbody.appendChild(tr);
    });

    renderPaginationControls(totalPages);
  }

  function renderPaginationControls(totalPages) {
    const container = document.getElementById('invoices-pagination');
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'admin-pagination';
    
    div.innerHTML = `
      <button class="pagination-btn" id="btn-page-prev" ${invoiceCurrentPage === 1 ? 'disabled' : ''}>Anterior</button>
      <span style="font-size: 0.85rem; font-weight: 500; color:var(--text-muted);">Pág. ${invoiceCurrentPage} de ${totalPages}</span>
      <button class="pagination-btn" id="btn-page-next" ${invoiceCurrentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;

    container.appendChild(div);

    document.getElementById('btn-page-prev').onclick = () => {
      if (invoiceCurrentPage > 1) {
        invoiceCurrentPage--;
        renderInvoicesTable();
      }
    };
    document.getElementById('btn-page-next').onclick = () => {
      if (invoiceCurrentPage < totalPages) {
        invoiceCurrentPage++;
        renderInvoicesTable();
      }
    };
  }

  // Reset form helper
  function clearInvoiceForm() {
    editingInvoiceId = null;
    editingInvoiceNumber = null;

    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = '';
    document.getElementById('form-invoice-client-id').value = '';
    document.getElementById('form-invoice-client-rnc').value = '';
    
    // Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('form-invoice-date').value = todayStr;
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    document.getElementById('form-invoice-due-date').value = dueDate.toISOString().split('T')[0];

    document.getElementById('form-invoice-ncf-type').value = 'none';
    document.getElementById('form-invoice-ncf').value = '';
    document.getElementById('form-invoice-ncf').setAttribute('readonly', 'true');

    // Reset division
    const divisionSelect = document.getElementById('form-invoice-division');
    if (divisionSelect) divisionSelect.value = 'general';

    // Reset doc type
    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = 'invoice';
      handleDocTypeChange('invoice');
    }

    // Clean body table
    const tbody = document.getElementById('invoice-form-items-body');
    if (tbody) tbody.innerHTML = '';

    // Add first row
    addInvoiceFormItemRow();
  }

  // Reset form and view Create Panel
  function openNewInvoiceForm() {
    clearInvoiceForm();
    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    
    const titleEl = document.getElementById('invoice-form-title');
    if (titleEl) titleEl.textContent = 'Crear Nueva Factura';

    const submitBtn = document.querySelector('#invoice-editor-form button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Guardar Factura';
  }

  function handleDocTypeChange(val) {
    const ncfTypeSelect = document.getElementById('form-invoice-ncf-type');
    const ncfInput = document.getElementById('form-invoice-ncf');
    const docNotes = document.getElementById('form-invoice-doc-notes');

    if (val === 'quote' || val === 'proforma') {
      ncfTypeSelect.value = 'none';
      ncfTypeSelect.setAttribute('disabled', 'true');
      ncfInput.value = '';
      ncfInput.setAttribute('readonly', 'true');
      if (docNotes) {
        docNotes.innerHTML = val === 'quote'
          ? '📝 <strong>Modo Cotización:</strong> No se generan NCFs ni se afecta la contabilidad de ingresos reales.'
          : '📄 <strong>Modo Factura Proforma:</strong> Borrador formalizado sin validez fiscal ni NCF. Útil previo a emitir la factura final.';
      }
    } else {
      ncfTypeSelect.removeAttribute('disabled');
      if (docNotes) {
        docNotes.innerHTML = 'Crea facturas comerciales estándar o presupuestos informativos para tus clientes.';
      }
      handleNcfTypeChange(ncfTypeSelect.value);
    }
  }

  // Dynamic row additions in Invoice Creator Form
  function addInvoiceFormItemRow(itemData = null) {
    const tbody = document.getElementById('invoice-form-items-body');
    const tr = document.createElement('tr');
    
    const rowId = 'row-' + Date.now() + '-' + Math.floor(Math.random()*1000);
    tr.id = rowId;

    let rowTaxAmount = 0.00;
    let overrideStr = 'false';
    if (itemData) {
      const price = Number(itemData.price) || 0;
      const qty = Number(itemData.qty) || 1;
      const taxVal = Number(itemData.tax) || 0;
      if (taxVal > 0 && taxVal <= 100) {
        // Old document percentage format (e.g. 18 or 16), calculate it
        rowTaxAmount = price * qty * (taxVal / 100);
        overrideStr = 'false';
      } else {
        // New document amount format
        rowTaxAmount = taxVal;
        overrideStr = 'true';
      }
    }

    tr.innerHTML = `
      <td>
        <div class="autocomplete-wrapper" style="position:relative; margin-bottom:4px;">
          <input type="text" class="form-input row-product-search" placeholder="Escribe para buscar..." oninput="CreaticosBilling.searchRowProductAutocomplete(this, '${rowId}')" value="${itemData ? itemData.description : ''}" required autocomplete="off" />
          <input type="hidden" class="row-product-id" value="${itemData ? itemData.productId : 'custom'}" />
          <div class="autocomplete-dropdown row-autocomplete-list" style="display:none; position:absolute; left:0; right:0; z-index:100; max-height:200px; overflow-y:auto; background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px;"></div>
        </div>
      </td>
      <td>
        <input type="number" class="form-input row-price" step="0.01" min="0" value="${itemData ? itemData.price : '0.00'}" required oninput="CreaticosBilling.handleRowPriceQtyChange(this)" />
      </td>
      <td>
        <input type="number" class="form-input row-qty" min="1" value="${itemData ? itemData.qty : '1'}" required oninput="CreaticosBilling.handleRowPriceQtyChange(this)" />
      </td>
      <td>
        <input type="number" class="form-input row-tax" step="0.01" min="0" value="${rowTaxAmount.toFixed(2)}" oninput="CreaticosBilling.handleRowTaxChange(this)" data-override="${overrideStr}" />
      </td>
      <td style="text-align:right; font-weight:600; padding-right:10px;" class="row-total">RD$ 0.00</td>
      <td>
        <button type="button" class="table-btn table-btn-danger" title="Quitar Fila" onclick="CreaticosBilling.deleteInvoiceFormItemRow('${rowId}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    
    const list = tr.querySelector('.row-autocomplete-list');
    document.addEventListener('click', function (e) {
      if (list && !e.target.closest('#' + rowId)) {
        list.style.display = 'none';
      }
    });

    calculateInvoiceFormTotals();
  }

  // Quitar fila
  function deleteInvoiceFormItemRow(rowId) {
    const tr = document.getElementById(rowId);
    if (tr) {
      tr.remove();
      calculateInvoiceFormTotals();
    }
  }

  // Row autocomplete search
  function searchRowProductAutocomplete(input, rowId) {
    const tr = document.getElementById(rowId);
    if (!tr) return;

    const listEl = tr.querySelector('.row-autocomplete-list');
    const idInput = tr.querySelector('.row-product-id');
    if (!listEl) return;

    const val = input.value.trim();
    if (!val) {
      listEl.style.display = 'none';
      idInput.value = 'custom';
      return;
    }

    const allProds = [].concat(
      creaticosProducts.map(p => ({ ...p, _src: 'creaticos' })),
      futunetProducts.map(p => ({ ...p, _src: 'futunet' }))
    );

    const seen = new Set();
    const uniqueProds = allProds.filter(p => {
      const compositeId = p._src + '_' + p.id;
      if (seen.has(compositeId)) return false;
      seen.add(compositeId);
      return true;
    });

    const matches = uniqueProds.filter(p => {
      const name = (p.name || p.title || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const ref = (p.reference || '').toLowerCase();
      const barcode = (p.barcode || '').toLowerCase();
      
      return name.includes(val.toLowerCase()) || 
             sku.includes(val.toLowerCase()) || 
             ref.includes(val.toLowerCase()) || 
             barcode.includes(val.toLowerCase());
    });

    listEl.innerHTML = '';
    listEl.style.display = 'block';

    matches.slice(0, 10).forEach(p => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.padding = '8px 12px';
      item.style.cursor = 'pointer';
      item.style.borderBottom = '1px solid var(--border-color)';
      item.style.fontSize = '0.82rem';

      const pName = p.name || p.title || '';
      const pPrice = isNaN(Number(p.price)) ? 0 : Number(p.price);
      const srcLabel = p._src === 'creaticos' ? 'Creaticos' : 'Futunet';
      const codeLabel = p.sku ? ` [SKU: ${p.sku}]` : '';

      item.textContent = `${pName} (${formatMoney(pPrice)}) - ${srcLabel}${codeLabel}`;
      
      item.onclick = () => {
        input.value = pName;
        idInput.value = p._src + '_' + p.id;
        
        const priceInput = tr.querySelector('.row-price');
        const taxInput = tr.querySelector('.row-tax');

        if (priceInput) priceInput.value = pPrice.toFixed(2);
        if (taxInput) {
          const productTaxPercent = (p.tax !== undefined) ? Number(p.tax) : 18;
          const qty = Number(tr.querySelector('.row-qty').value) || 1;
          taxInput.value = (pPrice * qty * (productTaxPercent / 100)).toFixed(2);
          taxInput.dataset.override = 'false';
        }

        listEl.style.display = 'none';
        calculateInvoiceFormTotals();
      };
      listEl.appendChild(item);
    });

    const customItem = document.createElement('div');
    customItem.className = 'autocomplete-item';
    customItem.style.padding = '8px 12px';
    customItem.style.cursor = 'pointer';
    customItem.style.borderBottom = '1px solid var(--border-color)';
    customItem.style.fontSize = '0.82rem';
    customItem.style.fontWeight = '600';
    customItem.style.color = 'var(--text-muted)';
    customItem.textContent = `✏️ Usar concepto temporal: "${val}"`;
    customItem.onclick = () => {
      idInput.value = 'custom';
      listEl.style.display = 'none';
    };
    listEl.appendChild(customItem);

    const createItem = document.createElement('div');
    createItem.className = 'autocomplete-item';
    createItem.style.padding = '8px 12px';
    createItem.style.cursor = 'pointer';
    createItem.style.fontSize = '0.82rem';
    createItem.style.fontWeight = '600';
    createItem.style.color = 'var(--primary)';
    createItem.textContent = `➕ Crear nuevo producto: "${val}"`;
    createItem.onclick = () => {
      listEl.style.display = 'none';
      localStorage.setItem('redirect_product_invoice_row', rowId);
      localStorage.setItem('redirect_product_invoice_name', val);

      switchPanel('products');
      switchSubTab('products', 'form');
      openNewProductForm();
      
      const formNameInput = document.getElementById('form-product-name');
      if (formNameInput) {
        formNameInput.value = val;
      }
    };
    listEl.appendChild(createItem);
  }

  // Calculate Subtotal, Taxes, and Totals inside creation form
  function calculateInvoiceFormTotals() {
    const tbody = document.getElementById('invoice-form-items-body');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');

    let subtotal = 0;
    let totalItbis = 0;

    rows.forEach(tr => {
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const lineItbis = Number(tr.querySelector('.row-tax').value) || 0;

      const lineSubtotal = price * qty;
      const lineTotal = lineSubtotal + lineItbis;

      subtotal += lineSubtotal;
      totalItbis += lineItbis;

      // Update text in row total column
      const totalCol = tr.querySelector('.row-total');
      if (totalCol) totalCol.textContent = formatMoney(lineTotal);
    });

    const grandTotal = subtotal + totalItbis;

    const subtotalEl = document.getElementById('form-summary-subtotal');
    const itbisEl = document.getElementById('form-summary-itbis');
    const totalEl = document.getElementById('form-summary-total');

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (itbisEl) itbisEl.textContent = formatMoney(totalItbis);
    if (totalEl) totalEl.textContent = formatMoney(grandTotal);
  }

  // Client Auto-Complete Dropdown Search
  function searchClientAutocomplete(val) {
    const dropdown = document.getElementById('client-autocomplete-dropdown');
    dropdown.innerHTML = '';

    if (!val) {
      dropdown.style.display = 'none';
      return;
    }

    const filtered = clients.filter(c => c.name.toLowerCase().includes(val.toLowerCase()));
    
    if (filtered.length === 0) {
      // Option to quickly register a new client
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.style.fontWeight = 'bold';
      item.style.color = 'var(--primary)';
      item.innerHTML = `<span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg> + Registrar "${val}" como nuevo cliente</span>`;
      item.onclick = function() {
        dropdown.style.display = 'none';
        openNewClientForm(val);
      };
      dropdown.appendChild(item);
    } else {
      filtered.forEach(c => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = `${c.name} ${c.rnc ? `(RNC: ${c.rnc})` : ''}`;
        item.onclick = function() {
          document.getElementById('form-invoice-client-name').value = c.name;
          document.getElementById('form-invoice-client-id').value = c.id;
          document.getElementById('form-invoice-client-rnc').value = c.rnc || 'No registrado';
          dropdown.style.display = 'none';
        };
        dropdown.appendChild(item);
      });
    }

    dropdown.style.display = 'block';
  }
  function handleNcfTypeChange(type) {
    const ncfInput = document.getElementById('form-invoice-ncf');
    if (type === 'none') {
      ncfInput.value = '';
      ncfInput.setAttribute('readonly', 'true');
    } else if (type === 'manual') {
      ncfInput.value = '';
      ncfInput.removeAttribute('readonly');
      ncfInput.focus();
    } else if (type === 'B01') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB01Seq).padStart(8, '0');
      ncfInput.value = settings.ncfB01Prefix + sequence;
    } else if (type === 'B02') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB02Seq).padStart(8, '0');
      ncfInput.value = settings.ncfB02Prefix + sequence;
    } else if (type === 'B14') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB14Seq || 1).padStart(8, '0');
      ncfInput.value = (settings.ncfB14Prefix || 'B1400000') + sequence;
    } else if (type === 'B15') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB15Seq || 1).padStart(8, '0');
      ncfInput.value = (settings.ncfB15Prefix || 'B1500000') + sequence;
    } else if (type === 'B12') {
      ncfInput.setAttribute('readonly', 'true');
      const sequence = String(settings.ncfB12Seq || 1).padStart(8, '0');
      ncfInput.value = (settings.ncfB12Prefix || 'B1200000') + sequence;
    }
  }

  // Submit and Save Invoice
  async function saveInvoice(e) {
    e.preventDefault();

    const docType = document.getElementById('form-invoice-doc-type').value;
    let clientId = document.getElementById('form-invoice-client-id').value;
    const clientName = document.getElementById('form-invoice-client-name').value.trim();
    const clientRnc = document.getElementById('form-invoice-client-rnc').value.trim();
    
    if (!clientName) {
      alert('Por favor, introduzca el nombre del cliente.');
      return;
    }
    if (!clientId) {
      clientId = 'custom';
    }

    const date = document.getElementById('form-invoice-date').value;
    const dueDate = document.getElementById('form-invoice-due-date').value;
    const ncfType = document.getElementById('form-invoice-ncf-type').value;
    const ncf = document.getElementById('form-invoice-ncf').value.trim();
    
    const divisionEl = document.getElementById('form-invoice-division');
    const division = divisionEl ? divisionEl.value : 'general';

    // Check if items table is empty
    const tbody = document.getElementById('invoice-form-items-body');
    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) {
      alert('Debes agregar al menos un ítem a la factura.');
      return;
    }

    // Build items object list
    const items = [];
    let subtotal = 0;
    let totalItbis = 0;

    for (let tr of rows) {
      const searchInput = tr.querySelector('.row-product-search');
      const productIdInput = tr.querySelector('.row-product-id');
      const description = searchInput ? searchInput.value.trim() : '';
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const lineTax = Number(tr.querySelector('.row-tax').value) || 0;

      if (!description) {
        alert('Todos los ítems agregados deben tener una descripción.');
        return;
      }

      const lineSub = price * qty;

      items.push({
        productId: productIdInput ? productIdInput.value : 'custom',
        description: description,
        price: price,
        qty: qty,
        tax: lineTax,
        total: lineSub + lineTax
      });

      subtotal += lineSub;
      totalItbis += lineTax;
    }

    const total = subtotal + totalItbis;
    
    // Generate document ID number
    let invoiceNum = '';
    let status = 'pending';
    let paidAmount = 0;
    
    if (editingInvoiceId && editingInvoiceNumber) {
      invoiceNum = editingInvoiceNumber;
      status = docType === 'quote' ? 'quote' : (docType === 'proforma' ? 'proforma' : 'pending');
      const originalDoc = invoices.find(i => i.id === editingInvoiceId);
      if (originalDoc) {
        paidAmount = originalDoc.paidAmount || 0;
        status = originalDoc.status || 'pending';
        if (docType !== 'quote' && docType !== 'proforma') {
          if (paidAmount >= total) {
            status = 'paid';
          } else {
            status = 'pending';
          }
        }
      }
    } else {
      if (docType === 'quote') {
        invoiceNum = (settings.quotePrefix || 'COT-') + String(settings.nextQuoteNum || 1001);
        status = 'quote';
      } else if (docType === 'proforma') {
        invoiceNum = (settings.proformaPrefix || 'PROF-') + String(settings.nextProformaNum || 1001);
        status = 'proforma';
      } else {
        invoiceNum = settings.invoicePrefix + String(settings.nextInvoiceNum);
      }
    }

    // Document Data
    const invoiceData = {
      docType: docType,
      invoiceNumber: invoiceNum,
      clientId: clientId,
      clientName: clientName,
      clientRnc: clientRnc,
      date: date,
      dueDate: dueDate,
      division: division,
      ncfType: (docType === 'quote' || docType === 'proforma') ? 'none' : ncfType,
      ncf: (docType === 'quote' || docType === 'proforma') ? '' : ncf,
      items: items,
      subtotal: subtotal,
      itbis: totalItbis,
      total: total,
      paidAmount: paidAmount,
      status: status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (editingInvoiceId) {
      // Save updates to Firestore
      await getDB().collection('creaticos_invoices').doc(editingInvoiceId).update(invoiceData);
    } else {
      // Save new document to Firestore
      invoiceData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await getDB().collection('creaticos_invoices').add(invoiceData);

      // Update settings sequences
      const settingsUpdates = {};
      
      if (docType === 'quote') {
        settingsUpdates.nextQuoteNum = (settings.nextQuoteNum || 1001) + 1;
      } else if (docType === 'proforma') {
        settingsUpdates.nextProformaNum = (settings.nextProformaNum || 1001) + 1;
      } else {
        settingsUpdates.nextInvoiceNum = settings.nextInvoiceNum + 1;
        if (ncfType === 'B01') {
          settingsUpdates.ncfB01Seq = settings.ncfB01Seq + 1;
        } else if (ncfType === 'B02') {
          settingsUpdates.ncfB02Seq = settings.ncfB02Seq + 1;
        } else if (ncfType === 'B14') {
          settingsUpdates.ncfB14Seq = (settings.ncfB14Seq || 1) + 1;
        } else if (ncfType === 'B15') {
          settingsUpdates.ncfB15Seq = (settings.ncfB15Seq || 1) + 1;
        } else if (ncfType === 'B12') {
          settingsUpdates.ncfB12Seq = (settings.ncfB12Seq || 1) + 1;
        }
      }

      await getDB().collection('creaticos_settings').doc('general').update(settingsUpdates);
    }

    // Clear form fields
    clearInvoiceForm();
    
    // Reload local settings and cache
    await loadSettings();
    await fetchAllData();
    
    // Go to Invoices list
    switchSubTab('invoices', 'list');
    renderInvoicesTable();
  }

  // Cancel/Anular Invoice
  async function cancelInvoice(id, number) {
    if (!confirm(`¿Está seguro de que desea ANULAR la factura ${number}? Esta acción no se puede deshacer y registrará una auditoría.`)) {
      return;
    }

    try {
      await getDB().collection('creaticos_invoices').doc(id).update({
        status: 'cancelled'
      });

      // Write Audit Log
      await getDB().collection('audit_logs').add({
        action: 'Anulación Factura Creaticos',
        details: `Factura ${number} anulada en el panel de Creaticos`,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: firebase.auth().currentUser.uid,
        userEmail: firebase.auth().currentUser.email
      });

      await fetchAllData();
      renderInvoicesTable();
    } catch (err) {
      console.error(err);
      alert('Error al anular la factura.');
    }
  }

  // ─── INVOICE DETAIL VIEW & PRINT ───
  async function viewInvoice(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    switchPanel('invoice-view');

    // Reset print format to Letter
    const formatSelect = document.getElementById('print-format-select');
    if (formatSelect) {
      formatSelect.value = 'letter';
    }
    handlePrintFormatChange('letter');

    // Fetch client contact details if available
    let client = clients.find(c => c.id === inv.clientId);
    if (!client) {
      client = { address: 'Dirección no registrada', phone: 'N/D', email: 'N/D' };
    }

    // Set company name based on division in invoice
    const nameEl = document.getElementById('view-company-name');
    if (nameEl) {
      if (inv.division === 'papeleria') {
        nameEl.textContent = 'Creaticos Papelería y Suministros';
      } else if (inv.division === 'sublimacion') {
        nameEl.textContent = 'Creaticos Sublimación';
      } else {
        nameEl.textContent = 'Creaticos Group';
      }
    }

    // Target the printable title (Factura vs Cotización vs Proforma)
    const headerTitle = document.querySelector('.billing-meta-box h3');
    if (headerTitle) {
      if (inv.docType === 'quote') {
        headerTitle.textContent = 'COTIZACIÓN';
      } else if (inv.docType === 'proforma') {
        headerTitle.textContent = 'FACTURA PROFORMA';
      } else {
        headerTitle.textContent = 'FACTURA';
      }
    }

    // Bind metadata
    document.getElementById('view-invoice-number').textContent = inv.invoiceNumber;
    document.getElementById('view-invoice-date').textContent = formatDate(inv.date);
    document.getElementById('view-invoice-due-date').textContent = formatDate(inv.dueDate);
    document.getElementById('view-invoice-ncf').textContent = inv.ncf || 'Sin Comprobante';

    // Badge status
    const statusEl = document.getElementById('view-invoice-status');
    statusEl.className = 'admin-badge';
    statusEl.removeAttribute('style');

    if (inv.docType === 'quote') {
      statusEl.style.background = '#e0f2fe';
      statusEl.style.color = '#0369a1';
      statusEl.style.border = '1px solid #bae6fd';
      statusEl.textContent = 'Cotización';
    } else if (inv.docType === 'proforma') {
      statusEl.style.background = '#fef3c7';
      statusEl.style.color = '#d97706';
      statusEl.style.border = '1px solid #fde68a';
      statusEl.textContent = 'Proforma';
    } else if (inv.status === 'paid') {
      statusEl.classList.add('badge-paid');
      statusEl.textContent = 'Pagada';
    } else if (inv.status === 'pending') {
      const isOverdue = new Date(inv.dueDate) < new Date() && inv.paidAmount < inv.total;
      statusEl.classList.add(isOverdue ? 'badge-overdue' : 'badge-pending');
      statusEl.textContent = isOverdue ? 'Vencida' : 'Pendiente';
    } else if (inv.status === 'cancelled') {
      statusEl.classList.add('badge-cancelled');
      statusEl.textContent = 'Anulada';
    }

    // Client details
    document.getElementById('view-client-name').textContent = inv.clientName;
    document.getElementById('view-client-rnc').textContent = inv.clientRnc || 'N/D';
    document.getElementById('view-client-phone').textContent = client.phone || 'N/D';
    document.getElementById('view-client-email').textContent = client.email || 'N/D';
    document.getElementById('view-client-address').textContent = client.address || 'N/D';

    // Populate items preview table
    const itemsTbody = document.getElementById('view-invoice-items-body');
    itemsTbody.innerHTML = '';
    
    inv.items.forEach(line => {
      let lineTaxAmount = 0;
      const price = Number(line.price) || 0;
      const qty = Number(line.qty) || 1;
      const taxVal = Number(line.tax) || 0;
      if (taxVal > 0 && taxVal <= 100) {
        // Old document percentage format (e.g. 18 or 16), calculate it
        lineTaxAmount = price * qty * (taxVal / 100);
      } else {
        // New document amount format
        lineTaxAmount = taxVal;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${line.description}</td>
        <td style="text-align:right;">${formatMoney(price)}</td>
        <td style="text-align:center;">${qty}</td>
        <td style="text-align:right;">${formatMoney(lineTaxAmount)}</td>
        <td style="text-align:right;">${formatMoney(line.total)}</td>
      `;
      itemsTbody.appendChild(tr);
    });

    // Populate mathematical totals
    const balance = Number(inv.total) - Number(inv.paidAmount || 0);

    document.getElementById('view-summary-subtotal').textContent = formatMoney(inv.subtotal);
    document.getElementById('view-summary-itbis').textContent = formatMoney(inv.itbis);
    document.getElementById('view-summary-total').textContent = formatMoney(inv.total);
    document.getElementById('view-summary-paid').textContent = formatMoney(inv.paidAmount);
    document.getElementById('view-summary-balance').textContent = formatMoney(balance);

    // Populate payment logs
    const paymentList = document.getElementById('view-invoice-payments-body');
    paymentList.innerHTML = '';

    const invPayments = payments.filter(p => p.invoiceId === invoiceId);
    if (invPayments.length === 0) {
      paymentList.innerHTML = '<li>No hay cobros registrados para esta factura.</li>';
    } else {
      invPayments.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${formatDate(p.timestamp)}</strong>: ${formatMoney(p.amount)} vía ${p.method} ${p.notes ? `(${p.notes})` : ''}`;
        paymentList.appendChild(li);
      });
    }

    // Set Payment and Convert Buttons Actions
    const payBtn = document.getElementById('btn-view-register-payment');
    const convertBtn = document.getElementById('btn-view-convert-invoice');
    
    if (inv.docType === 'quote' || inv.docType === 'proforma') {
      payBtn.style.display = 'none';
      if (convertBtn && inv.status !== 'cancelled') {
        convertBtn.style.display = 'inline-flex';
        convertBtn.setAttribute('data-quote-id', inv.id);
      } else if (convertBtn) {
        convertBtn.style.display = 'none';
      }
    } else {
      if (convertBtn) convertBtn.style.display = 'none';
      if (inv.status === 'pending' && balance > 0) {
        payBtn.style.display = 'inline-flex';
        // Pass data values to modal trigger
        payBtn.setAttribute('data-inv-id', inv.id);
        payBtn.setAttribute('data-inv-total', inv.total);
        payBtn.setAttribute('data-inv-paid', inv.paidAmount);
        payBtn.setAttribute('data-inv-balance', balance);
      } else {
        payBtn.style.display = 'none';
      }
    }
  }

  function convertQuoteToInvoice() {
    const convertBtn = document.getElementById('btn-view-convert-invoice');
    if (!convertBtn) return;
    const quoteId = convertBtn.getAttribute('data-quote-id');
    convertQuoteFromList(quoteId);
  }

  // ═══════════════════════════════════════════
  // 4. REGISTRO DE COBROS / PAGOS
  // ═══════════════════════════════════════════
  function openRegisterPaymentModal() {
    const payBtn = document.getElementById('btn-view-register-payment');
    const invId = payBtn.getAttribute('data-inv-id');
    openRegisterPaymentFromList(invId);
  }

  async function registerPayment(e) {
    e.preventDefault();

    const invoiceId = document.getElementById('form-payment-invoice-id').value;
    const amount = Number(document.getElementById('form-payment-amount').value);
    const method = document.getElementById('form-payment-method').value;
    const notes = document.getElementById('form-payment-notes').value.trim();

    if (amount <= 0) {
      alert('El monto debe ser superior a cero.');
      return;
    }

    try {
      // 1. Save payment registry document
      const paymentData = {
        invoiceId: invoiceId,
        amount: amount,
        method: method,
        notes: notes,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      await getDB().collection('creaticos_payments').add(paymentData);

      // 2. Fetch current invoice paid amount
      const invRef = getDB().collection('creaticos_invoices').doc(invoiceId);
      const invSnap = await invRef.get();
      if (invSnap.exists) {
        const inv = invSnap.data();
        const newPaidAmount = Number(inv.paidAmount || 0) + amount;
        
        let status = 'pending';
        // Check if balance paid in full (floating point precision safe)
        if (Math.abs(inv.total - newPaidAmount) < 0.05 || newPaidAmount >= inv.total) {
          status = 'paid';
        }

        // Update invoice document
        await invRef.update({
          paidAmount: newPaidAmount,
          status: status
        });
      }

      // Reload references
      await fetchAllData();
      closeModal('modal-payment');
      
      // Update details view
      viewInvoice(invoiceId);
    } catch (err) {
      console.error(err);
      alert('Error al registrar el cobro en la base de datos.');
    }
  }

  // ═══════════════════════════════════════════
  // 5. CLIENTES (CLIENTS) DIRECTORY
  // ═══════════════════════════════════════════
  function renderClientsTable() {
    switchPanel('clients');

    const searchVal = document.getElementById('clients-search').value.toLowerCase();
    
    const filtered = clients.filter(c => {
      return c.name.toLowerCase().includes(searchVal) ||
             (c.rnc && c.rnc.toLowerCase().includes(searchVal)) ||
             (c.email && c.email.toLowerCase().includes(searchVal));
    });

    const tbody = document.getElementById('clients-table-body');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">No se encontraron clientes.</td></tr>`;
      return;
    }

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>${c.rnc || '<span style="color:#cbd5e1;">Sin registro</span>'}</td>
        <td>${c.phone || '—'}</td>
        <td>${c.email || '—'}</td>
        <td>${c.address || '—'}</td>
        <td>
          <div class="table-actions">
            <button class="table-btn table-btn-primary" title="Editar" onclick="CreaticosBilling.openEditClientForm('${c.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="table-btn table-btn-danger" title="Eliminar" onclick="CreaticosBilling.deleteClient('${c.id}', '${c.name}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function openNewClientForm(prefilledName = '') {
    const titleEl = document.getElementById('client-form-title');
    if (titleEl) titleEl.textContent = 'Agregar Nuevo Cliente';

    document.getElementById('form-client-id').value = '';
    document.getElementById('form-client-name').value = prefilledName;
    document.getElementById('form-client-rnc').value = '';
    document.getElementById('form-client-phone').value = '';
    document.getElementById('form-client-email').value = '';
    document.getElementById('form-client-address').value = '';

    // Check if we are coming from invoice autocomplete
    const invoicePanel = document.getElementById('panel-invoices');
    const invoiceFormTab = document.getElementById('subtab-invoices-form');
    if (invoicePanel && invoicePanel.classList.contains('is-active') && invoiceFormTab && invoiceFormTab.classList.contains('is-active')) {
      returnToInvoice = true;
    } else {
      returnToInvoice = false;
    }

    switchPanel('clients');
    switchSubTab('clients', 'form');
  }

  function openEditClientForm(clientId) {
    const c = clients.find(item => item.id === clientId);
    if (!c) return;

    const titleEl = document.getElementById('client-form-title');
    if (titleEl) titleEl.textContent = 'Editar Cliente';

    document.getElementById('form-client-id').value = c.id;
    document.getElementById('form-client-name').value = c.name;
    document.getElementById('form-client-rnc').value = c.rnc || '';
    document.getElementById('form-client-phone').value = c.phone || '';
    document.getElementById('form-client-email').value = c.email || '';
    document.getElementById('form-client-address').value = c.address || '';

    returnToInvoice = false;

    switchPanel('clients');
    switchSubTab('clients', 'form');
  }

  async function saveClient(e) {
    e.preventDefault();

    const id = document.getElementById('form-client-id').value;
    const clientData = {
      name: document.getElementById('form-client-name').value.trim(),
      rnc: document.getElementById('form-client-rnc').value.trim(),
      phone: document.getElementById('form-client-phone').value.trim(),
      email: document.getElementById('form-client-email').value.trim(),
      address: document.getElementById('form-client-address').value.trim(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    let savedId = id;
    if (id) {
      // Update
      await getDB().collection('creaticos_clients').doc(id).update(clientData);
    } else {
      // Create
      clientData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      const newDoc = await getDB().collection('creaticos_clients').add(clientData);
      savedId = newDoc.id;
    }

    await fetchAllData();

    if (returnToPos) {
      returnToPos = false;
      document.getElementById('pos-client-search').value = clientData.name;
      document.getElementById('pos-client-id').value = savedId;
      document.getElementById('pos-client-rnc').value = clientData.rnc || '';
      posClient = { id: savedId, name: clientData.name, rnc: clientData.rnc || '' };
      
      switchPanel('invoices');
      switchSubTab('invoices', 'pos');
    } else if (returnToInvoice) {
      returnToInvoice = false;
      document.getElementById('form-invoice-client-name').value = clientData.name;
      document.getElementById('form-invoice-client-id').value = savedId;
      document.getElementById('form-invoice-client-rnc').value = clientData.rnc || 'No registrado';
      
      switchPanel('invoices');
      switchSubTab('invoices', 'form');
    } else {
      switchSubTab('clients', 'list');
      renderClientsTable();
    }
  }

  async function deleteClient(id, name) {
    if (!confirm(`¿Está seguro de que desea eliminar al cliente "${name}"? Las facturas asociadas seguirán existiendo.`)) {
      return;
    }

    try {
      await getDB().collection('creaticos_clients').doc(id).delete();
      await fetchAllData();
      renderClientsTable();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar cliente de la base de datos.');
    }
  }

  // ═══════════════════════════════════════════
  // 6. PRODUCTOS / SERVICIOS DIRECTORY
  // ═══════════════════════════════════════════
  function renderProductsTable() {
    switchPanel('products');

    const sourceEl = document.getElementById('products-source-filter');
    const source = sourceEl ? sourceEl.value : 'creaticos';
    
    products = source === 'creaticos' ? creaticosProducts : futunetProducts;

    const searchVal = document.getElementById('products-search').value.toLowerCase();
    
    const filtered = products.filter(p => {
      const name = p.name || p.title || '';
      const desc = p.description || p.desc || '';
      const sku = p.sku || '';
      const ref = p.reference || p.ref || '';
      const barcode = p.barcode || '';
      return name.toLowerCase().includes(searchVal) || 
             desc.toLowerCase().includes(searchVal) ||
             sku.toLowerCase().includes(searchVal) ||
             ref.toLowerCase().includes(searchVal) ||
             barcode.toLowerCase().includes(searchVal);
    });

    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted);">No se encontraron productos o servicios.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      const name = p.name || p.title || 'Sin nombre';
      const desc = p.description || p.desc || '—';
      const price = p.price || 0;
      const tax = p.tax !== undefined ? `${p.tax}% ITBIS` : '18% ITBIS (Al facturar)';
      const isCreaticosVal = p._isCreaticos ? 'true' : 'false';

      let codesHtml = '';
      if (p.sku || p.reference || p.ref) {
        const codes = [];
        if (p.sku) codes.push(`SKU: <span class="admin-code-badge">${p.sku}</span>`);
        if (p.reference || p.ref) codes.push(`Ref: <span class="admin-code-badge">${p.reference || p.ref}</span>`);
        codesHtml = `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; display:flex; gap:8px;">${codes.join(' | ')}</div>`;
      }

      tr.innerHTML = `
        <td>
          <strong>${name}</strong>
          ${codesHtml}
        </td>
        <td>${desc}</td>
        <td>${formatMoney(price)}</td>
        <td>${tax}</td>
        <td>
          <div class="table-actions">
            <button class="table-btn table-btn-primary" title="Editar" onclick="CreaticosBilling.openEditProductForm('${p.id}', ${isCreaticosVal})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="table-btn table-btn-danger" title="Eliminar" onclick="CreaticosBilling.deleteProduct('${p.id}', '${name.replace(/'/g, "\\'")}', ${isCreaticosVal})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function handleModalSourceChange() {
    const source = document.getElementById('form-product-source').value;
    const isFutunet = source === 'futunet';
    
    document.getElementById('futunet-only-fields').style.display = isFutunet ? 'block' : 'none';
    document.getElementById('form-product-tax-group').style.display = isFutunet ? 'none' : 'block';
    
    document.getElementById('label-product-name').textContent = isFutunet ? 'Título del producto (Futunet) *' : 'Concepto / Nombre del Ítem *';
    
    const stockInput = document.getElementById('form-product-stock');
    if (isFutunet) {
      stockInput.setAttribute('required', 'required');
    } else {
      stockInput.removeAttribute('required');
    }
  }

  function openNewProductForm() {
    const titleEl = document.getElementById('product-form-title');
    if (titleEl) titleEl.textContent = 'Agregar Producto / Servicio';

    document.getElementById('form-product-id').value = '';
    document.getElementById('form-product-name').value = '';
    document.getElementById('form-product-description').value = '';
    document.getElementById('form-product-price').value = '';
    document.getElementById('form-product-tax').value = settings.defaultTax.toString();
    
    document.getElementById('form-product-sku').value = '';
    document.getElementById('form-product-reference').value = '';
    document.getElementById('form-product-barcode').value = '';

    const sourceFilter = document.getElementById('products-source-filter');
    const activeSource = sourceFilter ? sourceFilter.value : 'creaticos';
    
    const sourceSelect = document.getElementById('form-product-source');
    if (sourceSelect) {
      sourceSelect.value = activeSource;
      sourceSelect.removeAttribute('disabled');
    }
    
    document.getElementById('form-product-stock').value = '0';
    document.getElementById('form-product-category').value = 'Otros';

    handleModalSourceChange();
    switchPanel('products');
    switchSubTab('products', 'form');
  }

  function openEditProductForm(productId, isCreaticos) {
    const activeProducts = isCreaticos ? creaticosProducts : futunetProducts;
    const p = activeProducts.find(item => item.id === productId);
    if (!p) return;

    const titleEl = document.getElementById('product-form-title');
    if (titleEl) {
      titleEl.textContent = isCreaticos ? 'Editar Producto / Servicio (Creaticos)' : 'Editar Producto (Futunet)';
    }

    document.getElementById('form-product-id').value = p.id;
    document.getElementById('form-product-name').value = p.name || p.title || '';
    document.getElementById('form-product-description').value = p.description || p.desc || '';
    document.getElementById('form-product-price').value = p.price;
    
    document.getElementById('form-product-sku').value = p.sku || '';
    document.getElementById('form-product-reference').value = p.reference || p.ref || '';
    document.getElementById('form-product-barcode').value = p.barcode || '';

    const sourceSelect = document.getElementById('form-product-source');
    if (sourceSelect) {
      sourceSelect.value = isCreaticos ? 'creaticos' : 'futunet';
      sourceSelect.setAttribute('disabled', 'disabled');
    }

    if (isCreaticos) {
      document.getElementById('form-product-tax').value = (p.tax !== undefined) ? p.tax.toString() : '18';
    } else {
      document.getElementById('form-product-stock').value = p.stock != null ? p.stock : '0';
      document.getElementById('form-product-category').value = p.category || 'Otros';
    }

    handleModalSourceChange();
    switchPanel('products');
    switchSubTab('products', 'form');
  }

  async function saveProduct(e) {
    e.preventDefault();

    const id = document.getElementById('form-product-id').value;
    const source = document.getElementById('form-product-source').value;
    const isCreaticos = source === 'creaticos';

    const skuVal = document.getElementById('form-product-sku').value.trim();
    const referenceVal = document.getElementById('form-product-reference').value.trim();
    const barcodeVal = document.getElementById('form-product-barcode').value.trim();

    try {
      if (isCreaticos) {
        const prodData = {
          name: document.getElementById('form-product-name').value.trim(),
          description: document.getElementById('form-product-description').value.trim(),
          price: Number(document.getElementById('form-product-price').value) || 0,
          tax: Number(document.getElementById('form-product-tax').value) || 0,
          sku: skuVal,
          reference: referenceVal,
          barcode: barcodeVal
        };

        if (id) {
          await getDB().collection('creaticos_products').doc(id).update(prodData);
        } else {
          await getDB().collection('creaticos_products').add(prodData);
        }
      } else {
        const nameVal = document.getElementById('form-product-name').value.trim();
        const descVal = document.getElementById('form-product-description').value.trim();
        const priceVal = Number(document.getElementById('form-product-price').value) || 0;
        const stockVal = parseInt(document.getElementById('form-product-stock').value) || 0;
        const categoryVal = document.getElementById('form-product-category').value;

        const prodData = {
          title: nameVal,
          desc: descVal,
          price: priceVal,
          stock: stockVal,
          category: categoryVal,
          department: categoryVal.toLowerCase(),
          condition: 'Nuevo',
          isActive: true,
          sku: skuVal,
          reference: referenceVal,
          barcode: barcodeVal,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (id) {
          await getDB().collection('products').doc(id).update(prodData);
        } else {
          prodData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await getDB().collection('products').add(prodData);
        }
      }

      await fetchAllData();

      // Check if redirecting back to invoice row
      const redirectRowId = localStorage.getItem('redirect_product_invoice_row');
      if (redirectRowId) {
        localStorage.removeItem('redirect_product_invoice_row');
        localStorage.removeItem('redirect_product_invoice_name');

        const tr = document.getElementById(redirectRowId);
        if (tr) {
          const savedName = document.getElementById('form-product-name').value.trim();
          
          let savedProd = null;
          let compositeId = 'custom';
          
          if (isCreaticos) {
            savedProd = creaticosProducts.find(p => p.name === savedName);
            if (savedProd) compositeId = 'creaticos_' + savedProd.id;
          } else {
            savedProd = futunetProducts.find(p => p.title === savedName);
            if (savedProd) compositeId = 'futunet_' + savedProd.id;
          }

          if (savedProd) {
            const searchInput = tr.querySelector('.row-product-search');
            const idInput = tr.querySelector('.row-product-id');
            const priceInput = tr.querySelector('.row-price');
            const taxSelect = tr.querySelector('.row-tax');

            if (searchInput) searchInput.value = savedName;
            if (idInput) idInput.value = compositeId;
            if (priceInput) priceInput.value = Number(savedProd.price).toFixed(2);
            if (taxSelect) {
              taxSelect.value = (savedProd.tax !== undefined) ? savedProd.tax.toString() : (settings ? settings.defaultTax.toString() : '18');
            }
          }
          
          switchPanel('invoices');
          switchSubTab('invoices', 'form');
          calculateInvoiceFormTotals();
          return;
        }
      }

      switchSubTab('products', 'list');
      renderProductsTable();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el producto en la base de datos: ' + err.message);
    }
  }

  async function deleteProduct(id, name, isCreaticos) {
    if (!confirm(`¿Está seguro de que desea eliminar el ítem "${name}"?`)) {
      return;
    }

    try {
      const coll = isCreaticos ? 'creaticos_products' : 'products';
      await getDB().collection(coll).doc(id).delete();
      await fetchAllData();
      renderProductsTable();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar ítem de la base de datos.');
    }
  }

  // ═══════════════════════════════════════════
  // 7. CONFIGURACIÓN (SETTINGS) PANEL
  // ═══════════════════════════════════════════
  function loadSettingsForm() {
    switchPanel('settings');

    document.getElementById('set-company-name').value = settings.name;
    document.getElementById('set-company-rnc').value = settings.rnc;
    document.getElementById('set-company-phone').value = settings.phone;
    document.getElementById('set-company-email').value = settings.email;
    document.getElementById('set-company-address').value = settings.address;
    
    document.getElementById('set-ncf-b01-prefix').value = settings.ncfB01Prefix;
    document.getElementById('set-ncf-b01-seq').value = settings.ncfB01Seq;
    document.getElementById('set-ncf-b02-prefix').value = settings.ncfB02Prefix;
    document.getElementById('set-ncf-b02-seq').value = settings.ncfB02Seq;
    
    document.getElementById('set-ncf-b14-prefix').value = settings.ncfB14Prefix || 'B1400000';
    document.getElementById('set-ncf-b14-seq').value = settings.ncfB14Seq || 1;
    document.getElementById('set-ncf-b15-prefix').value = settings.ncfB15Prefix || 'B1500000';
    document.getElementById('set-ncf-b15-seq').value = settings.ncfB15Seq || 1;
    document.getElementById('set-ncf-b12-prefix').value = settings.ncfB12Prefix || 'B1200000';
    document.getElementById('set-ncf-b12-seq').value = settings.ncfB12Seq || 1;

    document.getElementById('set-invoice-prefix').value = settings.invoicePrefix;
    document.getElementById('set-invoice-seq').value = settings.nextInvoiceNum;
    document.getElementById('set-default-tax').value = settings.defaultTax.toString();
    
    document.getElementById('set-quote-prefix').value = settings.quotePrefix || 'COT-';
    document.getElementById('set-quote-seq').value = settings.nextQuoteNum || 1001;
    
    document.getElementById('set-proforma-prefix').value = settings.proformaPrefix || 'PROF-';
    document.getElementById('set-proforma-seq').value = settings.nextProformaNum || 1001;
  }

  async function saveSettings(e) {
    e.preventDefault();

    const updated = {
      name: document.getElementById('set-company-name').value.trim(),
      rnc: document.getElementById('set-company-rnc').value.trim(),
      phone: document.getElementById('set-company-phone').value.trim(),
      email: document.getElementById('set-company-email').value.trim(),
      address: document.getElementById('set-company-address').value.trim(),
      
      ncfB01Prefix: document.getElementById('set-ncf-b01-prefix').value.trim(),
      ncfB01Seq: Number(document.getElementById('set-ncf-b01-seq').value) || 1,
      ncfB02Prefix: document.getElementById('set-ncf-b02-prefix').value.trim(),
      ncfB02Seq: Number(document.getElementById('set-ncf-b02-seq').value) || 1,
      
      ncfB14Prefix: document.getElementById('set-ncf-b14-prefix').value.trim(),
      ncfB14Seq: Number(document.getElementById('set-ncf-b14-seq').value) || 1,
      ncfB15Prefix: document.getElementById('set-ncf-b15-prefix').value.trim(),
      ncfB15Seq: Number(document.getElementById('set-ncf-b15-seq').value) || 1,
      ncfB12Prefix: document.getElementById('set-ncf-b12-prefix').value.trim(),
      ncfB12Seq: Number(document.getElementById('set-ncf-b12-seq').value) || 1,

      invoicePrefix: document.getElementById('set-invoice-prefix').value.trim(),
      nextInvoiceNum: Number(document.getElementById('set-invoice-seq').value) || 1001,
      defaultTax: Number(document.getElementById('set-default-tax').value) || 18,
      
      quotePrefix: document.getElementById('set-quote-prefix').value.trim(),
      nextQuoteNum: Number(document.getElementById('set-quote-seq').value) || 1001,
      
      proformaPrefix: document.getElementById('set-proforma-prefix').value.trim(),
      nextProformaNum: Number(document.getElementById('set-proforma-seq').value) || 1001
    };

    try {
      await getDB().collection('creaticos_settings').doc('general').update(updated);
      
      // Reload settings in cache
      await loadSettings();
      alert('Configuración guardada exitosamente.');
      
      initDashboard();
    } catch (err) {
      console.error(err);
      alert('Error al guardar configuración.');
    }
  }

  // ═══════════════════════════════════════════
  // 8. MODALS OPEN/CLOSE HELPERS
  // ═══════════════════════════════════════════
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-open');
    }
  }

  // Sub-tabs navigation & custom helper actions
  function switchSubTab(tabGroup, tabName) {
    const btns = document.querySelectorAll(`#panel-${tabGroup} .erp-subtab-btn`);
    btns.forEach(btn => btn.classList.remove('is-active'));

    const activeBtn = document.getElementById(`subtab-btn-${tabGroup}-${tabName}`);
    if (activeBtn) activeBtn.classList.add('is-active');

    const contents = document.querySelectorAll(`#panel-${tabGroup} .erp-tab-content`);
    contents.forEach(c => c.classList.remove('is-active'));

    const activeContent = document.getElementById(`subtab-${tabGroup}-${tabName}`);
    if (activeContent) activeContent.classList.add('is-active');

    // Auto-initialize form with clean defaults if manually switching to empty form tab
    if (tabName === 'form') {
      const idVal = document.getElementById(tabGroup === 'invoices' ? 'form-invoice-id' : (tabGroup === 'clients' ? 'form-client-id' : 'form-product-id')).value;
      if (!idVal) {
        if (tabGroup === 'invoices') {
          openNewInvoiceForm();
        } else if (tabGroup === 'clients') {
          openNewClientForm();
        } else if (tabGroup === 'products') {
          openNewProductForm();
        }
      }
    }

    if (tabGroup === 'invoices' && tabName === 'pos') {
      renderPosProducts();
      renderPosCart();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── TOUCH POS (PUNTO DE VENTA) METHODS ───
  function renderPosProducts() {
    const grid = document.getElementById('pos-products-grid-list');
    if (!grid) return;
    grid.innerHTML = '';

    const searchVal = document.getElementById('pos-product-search') ? document.getElementById('pos-product-search').value.toLowerCase() : '';

    let list = [];
    if (posActiveCategory === 'all' || posActiveCategory === 'creaticos') {
      list = list.concat(creaticosProducts);
    }
    if (posActiveCategory === 'all' || posActiveCategory === 'futunet') {
      list = list.concat(futunetProducts);
    }

    if (searchVal) {
      list = list.filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const ref = (p.reference || '').toLowerCase();
        const barcode = (p.barcode || '').toLowerCase();
        return name.includes(searchVal) || sku.includes(searchVal) || ref.includes(searchVal) || barcode.includes(searchVal);
      });
    }

    if (list.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No se encontraron productos.</div>';
      return;
    }

    list.forEach(p => {
      const isCr = p._isCreaticos;
      const badgeClass = isCr ? 'badge-creaticos' : 'badge-futunet';
      const badgeLabel = isCr ? 'Creaticos' : 'Futunet';
      const name = p.name || p.title || '';
      const code = p.sku || p.reference || 'S/C';
      const price = Number(p.price);

      const card = document.createElement('div');
      card.className = 'pos-product-card';
      card.onclick = () => addPosCartItem(p);
      card.innerHTML = `
        <div class="pos-prod-info">
          <span class="pos-prod-badge ${badgeClass}">${badgeLabel}</span>
          <h4 class="pos-prod-title" title="${name}">${name}</h4>
          <span class="pos-prod-code">Cod: ${code}</span>
        </div>
        <div class="pos-prod-footer">
          <span class="pos-prod-price">${formatMoney(price)}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderPosCart() {
    const cartList = document.getElementById('pos-cart-items-list');
    if (!cartList) return;
    cartList.innerHTML = '';

    if (posCart.length === 0) {
      cartList.innerHTML = '<div class="pos-cart-empty">Venta vacía. Selecciona productos a la derecha o escanea un código.</div>';
      updatePosTotals();
      return;
    }

    posCart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'pos-cart-item';
      const sub = item.price * item.qty;
      const sourceBadge = item.isCreaticos ? ' (C)' : ' (F)';

      itemEl.innerHTML = `
        <div class="pos-item-info">
          <div class="pos-item-title">${item.name}</div>
          <div class="pos-item-meta">${formatMoney(item.price)} c/u${sourceBadge}</div>
        </div>
        <div class="pos-item-qty-controls">
          <button type="button" class="pos-qty-btn" onclick="CreaticosBilling.changePosCartItemQty(${index}, -1)">-</button>
          <span class="pos-qty-val">${item.qty}</span>
          <button type="button" class="pos-qty-btn" onclick="CreaticosBilling.changePosCartItemQty(${index}, 1)">+</button>
        </div>
        <div class="pos-item-price">${formatMoney(sub)}</div>
        <button type="button" class="pos-btn-icon" onclick="CreaticosBilling.removePosCartItem(${index})" style="padding:4px; margin-left:4px;" title="Quitar item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      `;
      cartList.appendChild(itemEl);
    });

    updatePosTotals();
  }

  function updatePosTotals() {
    let subtotal = 0;
    let itbis = 0;

    posCart.forEach(item => {
      const itemSub = item.price * item.qty;
      const taxRate = item.tax || 0;
      subtotal += itemSub;
      itbis += itemSub * (taxRate / 100);
    });

    const grandTotal = subtotal + itbis;

    document.getElementById('pos-total-subtotal').textContent = formatMoney(subtotal);
    document.getElementById('pos-total-itbis').textContent = formatMoney(itbis);
    document.getElementById('pos-total-grand').textContent = formatMoney(grandTotal);

    const nfcAmountEl = document.getElementById('nfc-payment-amount');
    if (nfcAmountEl) {
      nfcAmountEl.textContent = formatMoney(grandTotal);
    }
  }

  function addPosCartItem(p) {
    const isCr = p._isCreaticos;
    const pId = isCr ? 'creaticos_' + p.id : 'futunet_' + p.id;
    
    const existingIndex = posCart.findIndex(item => item.productId === pId);
    if (existingIndex > -1) {
      posCart[existingIndex].qty += 1;
    } else {
      posCart.push({
        productId: pId,
        name: p.name || p.title || '',
        price: Number(p.price),
        qty: 1,
        tax: p.tax !== undefined ? Number(p.tax) : (settings ? Number(settings.defaultTax) : 18),
        isCreaticos: isCr
      });
    }
    renderPosCart();
    playBeepTone(800, 0.05);
  }

  function changePosCartItemQty(index, delta) {
    if (index < 0 || index >= posCart.length) return;
    posCart[index].qty += delta;
    if (posCart[index].qty <= 0) {
      posCart.splice(index, 1);
    }
    renderPosCart();
    playBeepTone(600, 0.04);
  }

  function removePosCartItem(index) {
    if (index < 0 || index >= posCart.length) return;
    posCart.splice(index, 1);
    renderPosCart();
    playBeepTone(400, 0.08);
  }

  function clearPosCart() {
    posCart = [];
    renderPosCart();
    document.getElementById('pos-client-search').value = '';
    document.getElementById('pos-client-id').value = '';
    document.getElementById('pos-client-rnc').value = '';
    document.getElementById('pos-ncf-type').value = 'none';
    document.getElementById('pos-doc-type').value = 'invoice';
    posClient = { id: '', name: 'Consumidor Final', rnc: '' };
    posNcfType = 'none';
    posDocType = 'invoice';
  }

  function filterPosCategory(cat) {
    posActiveCategory = cat;
    const btns = document.querySelectorAll('.pos-category-btn');
    btns.forEach(btn => btn.classList.remove('is-active'));
    
    const activeBtn = document.getElementById('pos-cat-' + cat);
    if (activeBtn) activeBtn.classList.add('is-active');

    renderPosProducts();
  }

  function searchPosProducts(val) {
    renderPosProducts();
  }

  function searchPosClient(val) {
    const listEl = document.getElementById('pos-client-autocomplete-list');
    if (!listEl) return;

    if (!val.trim()) {
      listEl.style.display = 'none';
      posClient = { id: '', name: 'Consumidor Final', rnc: '' };
      document.getElementById('pos-client-id').value = '';
      document.getElementById('pos-client-rnc').value = '';
      return;
    }

    const matches = clients.filter(c => 
      c.name.toLowerCase().includes(val.toLowerCase()) || 
      (c.rnc && c.rnc.includes(val))
    );

    if (matches.length === 0) {
      listEl.style.display = 'none';
      return;
    }

    listEl.innerHTML = '';
    listEl.style.display = 'block';

    matches.forEach(c => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = c.name + (c.rnc ? ` (RNC: ${c.rnc})` : '');
      item.onclick = () => {
        document.getElementById('pos-client-search').value = c.name;
        document.getElementById('pos-client-id').value = c.id;
        document.getElementById('pos-client-rnc').value = c.rnc || '';
        posClient = { id: c.id, name: c.name, rnc: c.rnc || '' };
        listEl.style.display = 'none';
      };
      listEl.appendChild(item);
    });
  }

  function openNewClientFormFromPos() {
    switchPanel('clients');
    switchSubTab('clients', 'form');
    openNewClientForm();
    returnToPos = true;
  }

  function handlePosNcfTypeChange(value) {
    posNcfType = value;
  }

  function handlePosDocTypeChange(value) {
    posDocType = value;
    const ncfSelect = document.getElementById('pos-ncf-type');
    if (value === 'quote' || value === 'proforma') {
      if (ncfSelect) {
        ncfSelect.value = 'none';
        ncfSelect.setAttribute('disabled', 'true');
      }
      posNcfType = 'none';
    } else {
      if (ncfSelect) {
        ncfSelect.removeAttribute('disabled');
      }
    }
  }

  async function checkoutPos(method) {
    if (posCart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    let subtotal = 0;
    let itbis = 0;
    posCart.forEach(item => {
      const itemSub = item.price * item.qty;
      const taxRate = item.tax || 0;
      subtotal += itemSub;
      itbis += itemSub * (taxRate / 100);
    });
    const total = subtotal + itbis;

    if (method === 'nfc') {
      document.getElementById('nfc-payment-amount').textContent = formatMoney(total);
      document.getElementById('nfc-payment-status').textContent = 'ESPERANDO DISPOSITIVO O TARJETA...';
      const tapBtn = document.getElementById('btn-nfc-tap-action');
      if (tapBtn) {
        tapBtn.style.display = 'block';
        tapBtn.textContent = 'Simular Contacto (Tap)';
      }
      openModal('modal-nfc-payment');
      return;
    }

    await processPosSale(method);
  }

  async function processPosSale(method) {
    let docType = posDocType;
    let ncfType = posNcfType;
    let status = (docType === 'quote' || docType === 'proforma') ? docType : 'paid';
    
    let invoiceNum = '';
    const settingsUpdates = {};

    if (docType === 'quote') {
      invoiceNum = (settings.quotePrefix || 'COT-') + String(settings.nextQuoteNum || 1001);
      settingsUpdates.nextQuoteNum = (settings.nextQuoteNum || 1001) + 1;
    } else if (docType === 'proforma') {
      invoiceNum = (settings.proformaPrefix || 'PROF-') + String(settings.nextProformaNum || 1001);
      settingsUpdates.nextProformaNum = (settings.nextProformaNum || 1001) + 1;
    } else {
      invoiceNum = (settings.invoicePrefix || 'CRE-') + String(settings.nextInvoiceNum || 1001);
      settingsUpdates.nextInvoiceNum = (settings.nextInvoiceNum || 1001) + 1;
    }

    let ncf = '';
    if (docType === 'invoice' && ncfType !== 'none') {
      let prefix = '';
      let seq = 1;

      if (ncfType === 'B01') {
        prefix = settings.ncfB01Prefix || 'B0100000';
        seq = settings.ncfB01Seq || 1;
        settingsUpdates.ncfB01Seq = seq + 1;
      } else if (ncfType === 'B02') {
        prefix = settings.ncfB02Prefix || 'B0200000';
        seq = settings.ncfB02Seq || 1;
        settingsUpdates.ncfB02Seq = seq + 1;
      } else if (ncfType === 'B14') {
        prefix = settings.ncfB14Prefix || 'B1400000';
        seq = settings.ncfB14Seq || 1;
        settingsUpdates.ncfB14Seq = seq + 1;
      } else if (ncfType === 'B15') {
        prefix = settings.ncfB15Prefix || 'B1500000';
        seq = settings.ncfB15Seq || 1;
        settingsUpdates.ncfB15Seq = seq + 1;
      } else if (ncfType === 'B12') {
        prefix = settings.ncfB12Prefix || 'B1200000';
        seq = settings.ncfB12Seq || 1;
        settingsUpdates.ncfB12Seq = seq + 1;
      }

      ncf = prefix + String(seq).padStart(8, '0');
    }

    let subtotal = 0;
    let itbis = 0;
    const items = posCart.map(item => {
      const lineSub = item.price * item.qty;
      const lineTax = lineSub * (item.tax / 100);
      subtotal += lineSub;
      itbis += lineTax;
      
      let cleanProdId = item.productId;
      if (cleanProdId.startsWith('creaticos_')) cleanProdId = cleanProdId.substring('creaticos_'.length);
      else if (cleanProdId.startsWith('futunet_')) cleanProdId = cleanProdId.substring('futunet_'.length);

      return {
        productId: cleanProdId,
        description: item.name,
        price: item.price,
        qty: item.qty,
        tax: item.tax,
        total: lineSub + lineTax
      };
    });

    const total = subtotal + itbis;
    const paidAmount = (docType === 'invoice') ? total : 0;

    const invoiceData = {
      invoiceNumber: invoiceNum,
      docType: docType,
      ncfType: (docType === 'quote' || docType === 'proforma') ? 'none' : ncfType,
      ncf: ncf,
      clientId: posClient.id || 'anonymous',
      clientName: posClient.name,
      clientRnc: posClient.rnc,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      subtotal: subtotal,
      itbis: itbis,
      total: total,
      paidAmount: paidAmount,
      status: status,
      items: items,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      const isFutunet = (settings.rnc === '132-70207-7');
      const collectionName = isFutunet ? 'futunet_invoices' : 'creaticos_invoices';
      const settingsColl = isFutunet ? 'futunet_settings' : 'creaticos_settings';
      const paymentsColl = isFutunet ? 'futunet_payments' : 'creaticos_payments';

      const docRef = await getDB().collection(collectionName).add(invoiceData);

      if (docType === 'invoice' && paidAmount > 0) {
        const paymentData = {
          invoiceId: docRef.id,
          amount: paidAmount,
          method: method === 'cash' ? 'Efectivo' : 'Tarjeta',
          notes: 'Pago POS ' + (method === 'nfc' ? 'Contactless NFC' : ''),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        await getDB().collection(paymentsColl).add(paymentData);
      }

      await getDB().collection(settingsColl).doc('general').update(settingsUpdates);

      await loadSettings();
      await fetchAllData();
      renderInvoicesTable();

      alert('Transacción procesada con éxito. Emitiendo ticket...');
      
      const invoiceId = docRef.id;
      clearPosCart();
      
      await viewInvoice(invoiceId);
      const printFormatSelect = document.getElementById('print-format-select');
      if (printFormatSelect) {
        printFormatSelect.value = 'ticket';
        handlePrintFormatChange('ticket');
      }
      
      setTimeout(() => {
        window.print();
      }, 500);

    } catch (err) {
      console.error(err);
      alert('Error al registrar venta POS: ' + err.message);
    }
  }

  function simulateNfcCardTap() {
    const statusEl = document.getElementById('nfc-payment-status');
    const tapBtn = document.getElementById('btn-nfc-tap-action');
    if (!statusEl) return;

    statusEl.textContent = 'PROCESANDO PAGO CON EL BANCO...';
    if (tapBtn) tapBtn.style.display = 'none';

    playBeepTone(1200, 0.15);

    setTimeout(() => {
      statusEl.innerHTML = '<span style="color:#10b981; font-weight:bold;">✔ PAGO APROBADO</span>';
      
      setTimeout(async () => {
        closeModal('modal-nfc-payment');
        await processPosSale('card');
      }, 1200);
    }, 1800);
  }

  function playBeepTone(freq, duration) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn("AudioContext not permitted or supported:", err);
    }
  }

  function openSimulatedBarcodeModal() {
    const select = document.getElementById('barcode-simulator-select');
    if (!select) return;
    select.innerHTML = '';

    let list = [].concat(creaticosProducts).concat(futunetProducts);
    
    const seen = new Set();
    list = list.filter(p => {
      const id = p.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return p.barcode || p.sku;
    });

    if (list.length === 0) {
      select.innerHTML = '<option value="">(No hay productos con códigos en la base de datos)</option>';
    } else {
      list.forEach(p => {
        const option = document.createElement('option');
        const code = p.barcode || p.sku;
        const name = p.name || p.title || '';
        option.value = code;
        option.textContent = `${name} [Código: ${code}]`;
        select.appendChild(option);
      });
    }

    document.getElementById('barcode-simulator-manual').value = '';
    openModal('modal-barcode-scan');
  }

  function triggerSimulatedScan() {
    const select = document.getElementById('barcode-simulator-select');
    const manualInput = document.getElementById('barcode-simulator-manual');
    
    let scannedCode = '';
    if (manualInput && manualInput.value.trim()) {
      scannedCode = manualInput.value.trim();
    } else if (select && select.value) {
      scannedCode = select.value;
    }

    if (!scannedCode) {
      alert('Por favor, selecciona o introduce un código.');
      return;
    }

    closeModal('modal-barcode-scan');
    handleScannedBarcode(scannedCode);
  }

  function handleScannedBarcode(code) {
    const searchCode = code.trim().toLowerCase();
    
    let match = creaticosProducts.find(p => 
      (p.barcode && p.barcode.toLowerCase() === searchCode) || 
      (p.sku && p.sku.toLowerCase() === searchCode)
    );

    if (!match) {
      match = futunetProducts.find(p => 
        (p.barcode && p.barcode.toLowerCase() === searchCode) || 
        (p.sku && p.sku.toLowerCase() === searchCode)
      );
    }

    if (match) {
      addPosCartItem(match);
      playBeepTone(1500, 0.04);
      setTimeout(() => playBeepTone(1500, 0.04), 60);
    } else {
      playBeepTone(300, 0.25);
      alert(`Código de barras "${code}" no encontrado en el catálogo.`);
    }
  }

  async function printInvoiceDirectly(id) {
    await viewInvoice(id);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  function handlePrintFormatChange(format) {
    const printArea = document.getElementById('invoice-print-area');
    if (!printArea) return;
    if (format === 'ticket') {
      printArea.classList.add('print-format-ticket');
    } else {
      printArea.classList.remove('print-format-ticket');
    }
  }

  function editQuote(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    editingInvoiceId = id;
    editingInvoiceNumber = inv.invoiceNumber;

    switchPanel('invoices');
    switchSubTab('invoices', 'form');

    const titleEl = document.getElementById('invoice-form-title');
    if (titleEl) {
      if (inv.docType === 'quote') {
        titleEl.textContent = 'Editar Cotización';
      } else if (inv.docType === 'proforma') {
        titleEl.textContent = 'Editar Proforma';
      } else {
        titleEl.textContent = 'Editar Factura';
      }
    }

    const submitBtn = document.querySelector('#invoice-editor-form button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Guardar Cambios';
    }

    // Populate fields
    document.getElementById('form-invoice-id').value = inv.id;
    document.getElementById('form-invoice-client-name').value = inv.clientName;
    document.getElementById('form-invoice-client-id').value = inv.clientId;
    document.getElementById('form-invoice-client-rnc').value = inv.clientRnc || '';
    document.getElementById('form-invoice-date').value = inv.date;
    document.getElementById('form-invoice-due-date').value = inv.dueDate;

    const divisionSelect = document.getElementById('form-invoice-division');
    if (divisionSelect) {
      divisionSelect.value = inv.division || 'general';
    }

    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = inv.docType;
      handleDocTypeChange(inv.docType);
    }

    const ncfTypeSelect = document.getElementById('form-invoice-ncf-type');
    if (ncfTypeSelect) {
      ncfTypeSelect.value = inv.ncfType || 'none';
    }
    
    const ncfInput = document.getElementById('form-invoice-ncf');
    if (ncfInput) {
      ncfInput.value = inv.ncf || '';
    }

    // Populate items
    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';

    if (inv.items && inv.items.length > 0) {
      inv.items.forEach(item => {
        addInvoiceFormItemRow(item);
      });
    } else {
      addInvoiceFormItemRow();
    }

    calculateInvoiceFormTotals();
  }

  function convertQuoteFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    const isProforma = inv.docType === 'proforma';
    document.getElementById('invoice-form-title').textContent = isProforma ? 'Convertir Proforma a Factura' : 'Convertir Cotización a Factura';
    
    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = inv.clientName;
    document.getElementById('form-invoice-client-id').value = inv.clientId;
    document.getElementById('form-invoice-client-rnc').value = inv.clientRnc || '';
    
    const today = new Date();
    document.getElementById('form-invoice-date').value = today.toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    document.getElementById('form-invoice-due-date').value = dueDate.toISOString().split('T')[0];

    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = 'invoice';
      handleDocTypeChange('invoice');
    }

    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';

    inv.items.forEach(item => {
      addInvoiceFormItemRow({
        productId: item.productId,
        description: item.description,
        price: item.price,
        qty: item.qty,
        tax: item.tax
      });
    });
  }

  function openRegisterPaymentFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    const total = Number(inv.total);
    const paid = Number(inv.paidAmount || 0);
    const balance = total - paid;

    document.getElementById('form-payment-invoice-id').value = id;
    document.getElementById('payment-info-total').textContent = formatMoney(total);
    document.getElementById('payment-info-paid').textContent = formatMoney(paid);
    document.getElementById('payment-info-balance').textContent = formatMoney(balance);

    document.getElementById('form-payment-amount').value = balance.toFixed(2);
    document.getElementById('form-payment-amount').setAttribute('max', balance.toFixed(2));
    document.getElementById('form-payment-notes').value = '';

    openModal('modal-payment');
  }

  // ─── HELPER FUNCTIONS FOR ROW TAX & ITBIS ───
  function handleRowPriceQtyChange(el) {
    const tr = el.closest('tr');
    const price = Number(tr.querySelector('.row-price').value) || 0;
    const qty = Number(tr.querySelector('.row-qty').value) || 1;
    const taxInput = tr.querySelector('.row-tax');
    
    if (taxInput && taxInput.dataset.override !== 'true') {
      taxInput.value = (price * qty * 0.18).toFixed(2);
    }
    calculateInvoiceFormTotals();
  }

  function handleRowTaxChange(el) {
    el.dataset.override = 'true';
    calculateInvoiceFormTotals();
  }

  function removeAllRowTaxes() {
    const tbody = document.getElementById('invoice-form-items-body');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(tr => {
      const taxInput = tr.querySelector('.row-tax');
      if (taxInput) {
        taxInput.value = '0.00';
        taxInput.dataset.override = 'true';
      }
    });
    calculateInvoiceFormTotals();
  }

  async function searchClientByRnc(rnc, context = 'invoice-form') {
    const cleanRnc = String(rnc).replace(/[^0-9]/g, '');
    if (!cleanRnc || (cleanRnc.length !== 9 && cleanRnc.length !== 11)) {
      alert('Por favor, introduzca un RNC válido de 9 o 11 dígitos.');
      return;
    }

    // Find the button inside the event target context
    const btn = window.event ? window.event.currentTarget : null;
    let originalText = '';
    if (btn) {
      originalText = btn.innerHTML;
      btn.innerHTML = '⚡ Consultando...';
      btn.disabled = true;
    }

    try {
      const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://rnc.megaplus.com.do/api/consulta?rnc=' + cleanRnc);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al consultar RNC');
      const data = await res.json();
      
      if (data && !data.error && data.nombre_razon_social) {
        const nombre = data.nombre_razon_social;
        const nombreComercial = data.nombre_comercial ? ` (${data.nombre_comercial})` : '';
        const fullName = nombre + (data.nombre_comercial && data.nombre_comercial !== nombre ? nombreComercial : '');

        if (context === 'client-form') {
          const nameInput = document.getElementById('form-client-name');
          const rncInput = document.getElementById('form-client-rnc');
          if (nameInput) nameInput.value = fullName;
          if (rncInput) rncInput.value = data.cedula_rnc || cleanRnc;
        } else {
          const nameInput = document.getElementById('form-invoice-client-name');
          const idInput = document.getElementById('form-invoice-client-id');
          const rncInput = document.getElementById('form-invoice-client-rnc');
          if (nameInput) nameInput.value = fullName;
          if (idInput) idInput.value = 'custom';
          if (rncInput) rncInput.value = data.cedula_rnc || cleanRnc;
        }
        alert('Cliente encontrado en DGII: ' + fullName);
      } else {
        alert('No se encontraron registros para este RNC/Cédula.');
      }
    } catch (e) {
      console.error('RNC Lookup Error:', e);
      alert('Error de conexión o RNC no encontrado. Por favor, digite los datos manualmente.');
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  }

  // Expose API methods globally inside module wrapper
  return {
    init: init,
    initDashboard: initDashboard,
    switchPanel: switchPanel,
    switchSubTab: switchSubTab,
    
    // Invoices
    renderInvoicesTable: renderInvoicesTable,
    openNewInvoiceForm: openNewInvoiceForm,
    editQuote: editQuote,
    addInvoiceFormItemRow: addInvoiceFormItemRow,
    deleteInvoiceFormItemRow: deleteInvoiceFormItemRow,
    searchRowProductAutocomplete: searchRowProductAutocomplete,
    calculateInvoiceFormTotals: calculateInvoiceFormTotals,
    searchClientAutocomplete: searchClientAutocomplete,
    handleNcfTypeChange: handleNcfTypeChange,
    handleDocTypeChange: handleDocTypeChange,
    saveInvoice: saveInvoice,
    viewInvoice: viewInvoice,
    cancelInvoice: cancelInvoice,
    convertQuoteToInvoice: convertQuoteToInvoice,
    printInvoiceDirectly: printInvoiceDirectly,
    convertQuoteFromList: convertQuoteFromList,
    openRegisterPaymentFromList: openRegisterPaymentFromList,
    handlePrintFormatChange: handlePrintFormatChange,
    handleRowPriceQtyChange: handleRowPriceQtyChange,
    handleRowTaxChange: handleRowTaxChange,
    removeAllRowTaxes: removeAllRowTaxes,
    searchClientByRnc: searchClientByRnc,

    // POS exports
    clearPosCart: clearPosCart,
    searchPosClient: searchPosClient,
    openNewClientFormFromPos: openNewClientFormFromPos,
    handlePosNcfTypeChange: handlePosNcfTypeChange,
    handlePosDocTypeChange: handlePosDocTypeChange,
    checkoutPos: checkoutPos,
    searchPosProducts: searchPosProducts,
    filterPosCategory: filterPosCategory,
    openSimulatedBarcodeModal: openSimulatedBarcodeModal,
    triggerSimulatedScan: triggerSimulatedScan,
    simulateNfcCardTap: simulateNfcCardTap,
    addPosCartItem: addPosCartItem,
    changePosCartItemQty: changePosCartItemQty,
    removePosCartItem: removePosCartItem,

    // Payments
    openRegisterPaymentModal: openRegisterPaymentModal,
    registerPayment: registerPayment,

    // Clients
    renderClientsTable: renderClientsTable,
    openNewClientForm: openNewClientForm,
    openEditClientForm: openEditClientForm,
    openNewClientModal: openNewClientForm, // backward compatibility
    openEditClientModal: openEditClientForm, // backward compatibility
    saveClient: saveClient,
    deleteClient: deleteClient,

    // Products
    renderProductsTable: renderProductsTable,
    openNewProductForm: openNewProductForm,
    openEditProductForm: openEditProductForm,
    openNewProductModal: openNewProductForm, // backward compatibility
    openEditProductModal: openEditProductForm, // backward compatibility
    saveProduct: saveProduct,
    deleteProduct: deleteProduct,
    handleModalSourceChange: handleModalSourceChange,

    // Settings
    loadSettingsForm: loadSettingsForm,
    saveSettings: saveSettings,

    // General modals
    closeModal: closeModal
  };
})();
