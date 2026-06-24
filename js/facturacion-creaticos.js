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

  // Pagination for Invoices
  let invoiceCurrentPage = 1;
  const invoicePageSize = 10;

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
      // Backward compatibility for quote settings
      if (settings.quotePrefix === undefined) settings.quotePrefix = 'COT-';
      if (settings.nextQuoteNum === undefined) settings.nextQuoteNum = 1001;
      if (settings.ncfB14Prefix === undefined) settings.ncfB14Prefix = 'B1400000';
      if (settings.ncfB14Seq === undefined) settings.ncfB14Seq = 1;
      if (settings.ncfB15Prefix === undefined) settings.ncfB15Prefix = 'B1500000';
      if (settings.ncfB15Seq === undefined) settings.ncfB15Seq = 1;
      if (settings.ncfB12Prefix === undefined) settings.ncfB12Prefix = 'B1200000';
      if (settings.ncfB12Seq === undefined) settings.ncfB12Seq = 1;
    } else {
      // Default initial settings
      settings = {
        name: 'Creaticos Papelería y Sublimados',
        rnc: '131-78945-2',
        phone: '809-541-2367',
        email: 'info@creaticos.com.do',
        address: 'Av. Gustavo Mejía Ricart #83, Santo Domingo, R.D.',
        invoicePrefix: 'CRE-',
        nextInvoiceNum: 1001,
        quotePrefix: 'COT-',
        nextQuoteNum: 1001,
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
        if (inv.docType === 'quote') {
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

  // Reset form and view Create Panel
  function openNewInvoiceForm() {
    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    document.getElementById('invoice-form-title').textContent = 'Crear Nueva Factura';
    
    // Clear fields
    document.getElementById('form-invoice-id').value = '';
    document.getElementById('form-invoice-client-name').value = '';
    document.getElementById('form-invoice-client-id').value = '';
    document.getElementById('form-invoice-client-rnc').value = '';
    
    // Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('form-invoice-date').value = todayStr;
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15); // Default due date in 15 days
    document.getElementById('form-invoice-due-date').value = dueDate.toISOString().split('T')[0];

    document.getElementById('form-invoice-ncf-type').value = 'none';
    document.getElementById('form-invoice-ncf').value = '';
    document.getElementById('form-invoice-ncf').setAttribute('readonly', 'true');

    // Reset doc type to invoice
    const docTypeSelect = document.getElementById('form-invoice-doc-type');
    if (docTypeSelect) {
      docTypeSelect.value = 'invoice';
      handleDocTypeChange('invoice');
    }

    // Clean body table
    const tbody = document.getElementById('invoice-form-items-body');
    tbody.innerHTML = '';

    // Add first row
    addInvoiceFormItemRow();
  }

  function handleDocTypeChange(val) {
    const ncfTypeSelect = document.getElementById('form-invoice-ncf-type');
    const ncfInput = document.getElementById('form-invoice-ncf');
    const docNotes = document.getElementById('form-invoice-doc-notes');

    if (val === 'quote') {
      ncfTypeSelect.value = 'none';
      ncfTypeSelect.setAttribute('disabled', 'true');
      ncfInput.value = '';
      ncfInput.setAttribute('readonly', 'true');
      if (docNotes) {
        docNotes.innerHTML = '📝 <strong>Modo Cotización:</strong> No se generan NCFs ni se afecta la contabilidad de ingresos reales.';
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

    // Build product options grouping by catalog source
    let prodOptions = `<option value="custom">— Concepto Personalizado —</option>`;
    
    prodOptions += `<optgroup label="Creaticos Papelería">`;
    creaticosProducts.forEach(p => {
      let isSelected = false;
      if (itemData) {
        isSelected = itemData.productId === 'creaticos_' + p.id || itemData.productId === p.id;
      }
      prodOptions += `<option value="creaticos_${p.id}" ${isSelected ? 'selected' : ''}>${p.name} (${formatMoney(p.price)})</option>`;
    });
    prodOptions += `</optgroup>`;

    prodOptions += `<optgroup label="Futunet Suministros">`;
    futunetProducts.forEach(p => {
      let isSelected = false;
      if (itemData) {
        isSelected = itemData.productId === 'futunet_' + p.id;
      }
      prodOptions += `<option value="futunet_${p.id}" ${isSelected ? 'selected' : ''}>${p.title} (${formatMoney(p.price)})</option>`;
    });
    prodOptions += `</optgroup>`;

    tr.innerHTML = `
      <td>
        <select class="form-input row-product-select" onchange="CreaticosBilling.handleFormProductSelect(this, '${rowId}')" style="margin-bottom:4px;">
          ${prodOptions}
        </select>
        <input type="text" class="form-input row-desc" placeholder="Detalle / Descripción del servicio..." value="${itemData ? itemData.description : ''}" required />
      </td>
      <td>
        <input type="number" class="form-input row-price" step="0.01" min="0" value="${itemData ? itemData.price : '0.00'}" required oninput="CreaticosBilling.calculateInvoiceFormTotals()" />
      </td>
      <td>
        <input type="number" class="form-input row-qty" min="1" value="${itemData ? itemData.qty : '1'}" required oninput="CreaticosBilling.calculateInvoiceFormTotals()" />
      </td>
      <td>
        <select class="form-input row-tax" onchange="CreaticosBilling.calculateInvoiceFormTotals()">
          <option value="18" ${!itemData || itemData.tax === 18 ? 'selected' : ''}>18% ITBIS</option>
          <option value="16" ${itemData && itemData.tax === 16 ? 'selected' : ''}>16% ITBIS</option>
          <option value="0" ${itemData && itemData.tax === 0 ? 'selected' : ''}>Exento (0%)</option>
        </select>
      </td>
      <td style="text-align:right; font-weight:600; padding-right:10px;" class="row-total">RD$ 0.00</td>
      <td>
        <button type="button" class="table-btn table-btn-danger" title="Quitar Fila" onclick="CreaticosBilling.deleteInvoiceFormItemRow('${rowId}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    
    // Fire initial select handling
    const select = tr.querySelector('.row-product-select');
    if (!itemData) {
      handleFormProductSelect(select, rowId);
    } else {
      calculateInvoiceFormTotals();
    }
  }

  // Quitar fila
  function deleteInvoiceFormItemRow(rowId) {
    const tr = document.getElementById(rowId);
    if (tr) {
      tr.remove();
      calculateInvoiceFormTotals();
    }
  }

  // Handle product prefilled selections
  function handleFormProductSelect(select, rowId) {
    const tr = document.getElementById(rowId);
    if (!tr) return;

    const val = select.value;
    const descInput = tr.querySelector('.row-desc');
    const priceInput = tr.querySelector('.row-price');
    const taxSelect = tr.querySelector('.row-tax');

    if (val === 'custom') {
      priceInput.removeAttribute('readonly');
    } else {
      let prod = null;
      let isCreaticos = true;
      if (val.startsWith('creaticos_')) {
        const cleanId = val.substring('creaticos_'.length);
        prod = creaticosProducts.find(p => p.id === cleanId);
      } else if (val.startsWith('futunet_')) {
        const cleanId = val.substring('futunet_'.length);
        prod = futunetProducts.find(p => p.id === cleanId);
        isCreaticos = false;
      }

      if (prod) {
        const name = prod.name || prod.title || '';
        const desc = prod.description || prod.desc || '';
        descInput.value = name + (desc ? ' - ' + desc : '');
        priceInput.value = Number(prod.price).toFixed(2);
        // Default tax for Futunet items is the defaultTax from settings, for Creaticos it is stored in the item
        taxSelect.value = (prod.tax !== undefined) ? prod.tax.toString() : (settings ? settings.defaultTax.toString() : '18');
      }
    }
    calculateInvoiceFormTotals();
  }

  // Calculate Subtotal, Taxes, and Totals inside creation form
  function calculateInvoiceFormTotals() {
    const tbody = document.getElementById('invoice-form-items-body');
    const rows = tbody.querySelectorAll('tr');

    let subtotal = 0;
    let totalItbis = 0;

    rows.forEach(tr => {
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const taxRate = Number(tr.querySelector('.row-tax').value) || 0;

      const lineSubtotal = price * qty;
      const lineItbis = lineSubtotal * (taxRate / 100);
      const lineTotal = lineSubtotal + lineItbis;

      subtotal += lineSubtotal;
      totalItbis += lineItbis;

      // Update text in row total column
      tr.querySelector('.row-total').textContent = formatMoney(lineTotal);
    });

    const grandTotal = subtotal + totalItbis;

    document.getElementById('form-summary-subtotal').textContent = formatMoney(subtotal);
    document.getElementById('form-summary-itbis').textContent = formatMoney(totalItbis);
    document.getElementById('form-summary-total').textContent = formatMoney(grandTotal);
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
    const clientId = document.getElementById('form-invoice-client-id').value;
    const clientName = document.getElementById('form-invoice-client-name').value;
    const clientRnc = document.getElementById('form-invoice-client-rnc').value;
    
    if (!clientId) {
      alert('Por favor selecciona un cliente válido de la lista auto-completada.');
      return;
    }

    const date = document.getElementById('form-invoice-date').value;
    const dueDate = document.getElementById('form-invoice-due-date').value;
    const ncfType = document.getElementById('form-invoice-ncf-type').value;
    const ncf = document.getElementById('form-invoice-ncf').value.trim();

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
      const productSelect = tr.querySelector('.row-product-select');
      const description = tr.querySelector('.row-desc').value.trim();
      const price = Number(tr.querySelector('.row-price').value) || 0;
      const qty = Number(tr.querySelector('.row-qty').value) || 1;
      const taxRate = Number(tr.querySelector('.row-tax').value) || 0;

      if (!description) {
        alert('Todos los ítems agregados deben tener una descripción.');
        return;
      }

      const lineSub = price * qty;
      const lineTax = lineSub * (taxRate / 100);

      items.push({
        productId: productSelect.value,
        description: description,
        price: price,
        qty: qty,
        tax: taxRate,
        total: lineSub + lineTax
      });

      subtotal += lineSub;
      totalItbis += lineTax;
    }

    const total = subtotal + totalItbis;
    
    // Generate document ID number
    let invoiceNum = '';
    let status = 'pending';
    
    if (docType === 'quote') {
      invoiceNum = (settings.quotePrefix || 'COT-') + String(settings.nextQuoteNum || 1001);
      status = 'quote';
    } else {
      invoiceNum = settings.invoicePrefix + String(settings.nextInvoiceNum);
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
      ncfType: docType === 'quote' ? 'none' : ncfType,
      ncf: docType === 'quote' ? '' : ncf,
      items: items,
      subtotal: subtotal,
      itbis: totalItbis,
      total: total,
      paidAmount: 0,
      status: status, // paid, pending, cancelled, quote
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const newDoc = await getDB().collection('creaticos_invoices').add(invoiceData);

    // Update settings sequences
    const settingsUpdates = {};
    
    if (docType === 'quote') {
      settingsUpdates.nextQuoteNum = (settings.nextQuoteNum || 1001) + 1;
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

    // Fetch client contact details if available
    let client = clients.find(c => c.id === inv.clientId);
    if (!client) {
      client = { address: 'Dirección no registrada', phone: 'N/D', email: 'N/D' };
    }

    // Target the printable title (Factura vs Cotización)
    const headerTitle = document.querySelector('.billing-meta-box h3');
    if (headerTitle) {
      headerTitle.textContent = inv.docType === 'quote' ? 'COTIZACIÓN' : 'FACTURA';
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
      const sub = line.price * line.qty;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${line.description}</td>
        <td style="text-align:right;">${formatMoney(line.price)}</td>
        <td style="text-align:center;">${line.qty}</td>
        <td style="text-align:center;">${line.tax}%</td>
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
    
    if (inv.docType === 'quote') {
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

    if (returnToInvoice) {
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
      nextQuoteNum: Number(document.getElementById('set-quote-seq').value) || 1001
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function printInvoiceDirectly(id) {
    await viewInvoice(id);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  function convertQuoteFromList(id) {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    switchPanel('invoices');
    switchSubTab('invoices', 'form');
    document.getElementById('invoice-form-title').textContent = 'Convertir Cotización a Factura';
    
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

  // Expose API methods globally inside module wrapper
  return {
    init: init,
    initDashboard: initDashboard,
    switchPanel: switchPanel,
    switchSubTab: switchSubTab,
    
    // Invoices
    renderInvoicesTable: renderInvoicesTable,
    openNewInvoiceForm: openNewInvoiceForm,
    addInvoiceFormItemRow: addInvoiceFormItemRow,
    deleteInvoiceFormItemRow: deleteInvoiceFormItemRow,
    handleFormProductSelect: handleFormProductSelect,
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
