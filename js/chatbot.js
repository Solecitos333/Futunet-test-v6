document.addEventListener('DOMContentLoaded', () => {
  const INFO = {
    whatsapp: '18297411041',
    horario: 'Nuestro horario es de lunes a sabado de 8:00 AM a 6:00 PM.',
    ubicacion: 'Estamos en Avenida Cuesta Colorada, sector Las Colinas, Santiago de los Caballeros, Republica Dominicana.',
    envios: 'Podemos orientarte con entregas y envios segun el producto y tu zona.',
    intro: 'Hola. Soy el asistente virtual de Futunet. Elige una opcion y te ayudo a llegar mas rapido a lo que necesitas.'
  };

  const CONFIG = {
    avatar: 'img/chatbot/assistant-avatar.svg'
  };

  const QUICK_ACTIONS = {
    main: [
      { label: 'Horario', key: 'horario' },
      { label: 'Ubicacion', key: 'ubicacion' },
      { label: 'Envios', key: 'envios' },
      { label: 'Proyectores', key: 'proyectores' },
      { label: 'Impresoras Epson', key: 'impresoras-epson' },
      { label: 'Camaras', key: 'camaras' },
      { label: 'Servicios', key: 'servicios' }
    ],
    catalogo: [
      { label: 'Catalogo completo', key: 'catalogo' },
      { label: 'Hablar con un agente', key: 'agente' }
    ]
  };

  // Chatbot styles loaded from css/chatbot.css

  const root = document.createElement('div');
  root.innerHTML = `
    <div class="chatbot-window" id="cb-window" aria-hidden="true">
      <div class="chatbot-header">
        <div class="chatbot-header-main">
          <img class="chatbot-avatar" src="${CONFIG.avatar}" alt="Asistente Futunet">
          <div>
            <div class="chatbot-title">Asistente Futunet</div>
            <div class="chatbot-status">
              <span class="chatbot-status-dot"></span>
              <span>En linea 24/7</span>
            </div>
          </div>
        </div>
        <button class="chatbot-close" id="cb-close" aria-label="Cerrar">&times;</button>
      </div>
      <div class="chatbot-messages" id="cb-messages" aria-live="polite"></div>
      <div class="chatbot-footer">
        <div class="chatbot-chips" id="cb-chips"></div>
        <div class="chatbot-divider"></div>
        
        <!-- Entrada de texto libre -->
        <div class="chatbot-input-container">
          <input type="text" id="cb-input-text" placeholder="Escribe tu pregunta aquí..." autocomplete="off" aria-label="Escribe tu mensaje" />
          <button type="button" id="cb-send-btn" aria-label="Enviar" class="chatbot-send-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <button class="chatbot-wa" id="cb-wa" type="button">Hablar con un Agente (WhatsApp)</button>
      </div>
    </div>
    <button class="chatbot-fab" id="cb-fab" aria-label="Abrir asistente">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"></path>
      </svg>
    </button>
  `;
  document.body.appendChild(root);

  const fab = document.getElementById('cb-fab');
  const win = document.getElementById('cb-window');
  const closeBtn = document.getElementById('cb-close');
  const messages = document.getElementById('cb-messages');
  const chips = document.getElementById('cb-chips');
  const waBtn = document.getElementById('cb-wa');
  const cbInputText = document.getElementById('cb-input-text');
  const cbSendBtn = document.getElementById('cb-send-btn');

  let initialized = false;

  function syncChatViewportState() {
    const viewport = window.visualViewport;
    const viewportHeight = viewport ? Math.round(viewport.height) : window.innerHeight;
    const offsetTop = viewport ? Math.round(viewport.offsetTop) : 0;
    const keyboardInset = viewport
      ? Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop))
      : 0;
    const shouldCompact = window.innerWidth <= 767 && (keyboardInset > 120 || viewportHeight < 560);

    document.documentElement.style.setProperty('--chatbot-viewport-height', `${viewportHeight}px`);
    document.documentElement.style.setProperty('--chatbot-keyboard-inset', `${keyboardInset}px`);
    win.classList.toggle('chatbot-window--compact', shouldCompact);
    fab.classList.toggle('chatbot-fab--compact', shouldCompact);

    if (viewport && win.classList.contains('active')) {
      const viewportBottom = offsetTop + viewport.height;
      const winRect = win.getBoundingClientRect();
      if (winRect.bottom > viewportBottom - 8) {
        messages.scrollTop = messages.scrollHeight;
      }
    }
  }

  function waLink(message) {
    return `https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function addRow(sender, text, includeAvatar = false) {
    const row = document.createElement('div');
    row.className = `cb-row cb-row--${sender}`;

    if (includeAvatar) {
      const avatar = document.createElement('img');
      avatar.className = 'cb-mini-avatar';
      avatar.src = CONFIG.avatar;
      avatar.alt = 'Asistente Futunet';
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = `cb-bubble cb-bubble--${sender}`;
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUserMessage(text) {
    addRow('user', text);
  }

  function addBotMessage(text, actions = []) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cb-row cb-row--bot';

    const avatar = document.createElement('img');
    avatar.className = 'cb-mini-avatar';
    avatar.src = CONFIG.avatar;
    avatar.alt = 'Asistente Futunet';
    wrapper.appendChild(avatar);

    const bubble = document.createElement('div');
    bubble.className = 'cb-bubble cb-bubble--bot';

    const textBlock = document.createElement('div');
    textBlock.className = 'cb-part';
    textBlock.textContent = text;
    bubble.appendChild(textBlock);

    if (actions.length) {
      const actionWrap = document.createElement('div');
      actionWrap.className = 'cb-part cb-actions';

      actions.forEach((action) => {
        const node = document.createElement(action.kind === 'link' ? 'a' : 'button');
        node.className = `cb-action${action.kind === 'wa' ? ' cb-action--wa' : ''}`;
        node.textContent = action.label;

        if (action.kind === 'link') {
          node.href = action.href;
        } else {
          node.type = 'button';
          node.dataset.kind = action.kind;
          if (action.query) node.dataset.query = action.query;
          if (action.id) node.dataset.id = action.id;
          if (action.message) node.dataset.message = action.message;
        }

        actionWrap.appendChild(node);
      });

      bubble.appendChild(actionWrap);
    }

    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderChips(list) {
    chips.innerHTML = '';
    list.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chatbot-chip';
      button.dataset.key = item.key;
      button.textContent = item.label;
      chips.appendChild(button);
    });
  }

  function openCatalogSearch(query) {
    const onCatalog = window.location.pathname.toLowerCase().includes('catalogo.html');
    if (onCatalog && typeof window.executeSearch === 'function' && query) {
      window.executeSearch(query);
      closeChat();
      return;
    }

    window.location.href = query
      ? `catalogo.html?q=${encodeURIComponent(query)}`
      : 'catalogo.html';
  }

  function getResponseByKey(key) {
    const responses = {
      horario: {
        text: INFO.horario,
        actions: [
          { kind: 'wa', label: 'Confirmar por WhatsApp', message: 'Hola Futunet, quisiera confirmar su horario de atencion.' }
        ],
        chips: QUICK_ACTIONS.main
      },
      ubicacion: {
        text: `${INFO.ubicacion} Si quieres, te paso con un asesor para darte la ubicacion exacta.`,
        actions: [
          { kind: 'wa', label: 'Pedir ubicacion', message: 'Hola Futunet, quisiera su ubicacion exacta.' }
        ],
        chips: QUICK_ACTIONS.main
      },
      envios: {
        text: `${INFO.envios} Si quieres, te paso con un asesor para validar disponibilidad y entrega.`,
        actions: [
          { kind: 'wa', label: 'Consultar envio', message: 'Hola Futunet, quisiera consultar opciones de envio.' }
        ],
        chips: QUICK_ACTIONS.main
      },
      proyectores: {
        text: 'Puedo llevarte directo a los proyectores disponibles en el catalogo y tambien ayudarte a cotizar uno por WhatsApp.',
        actions: [
          { kind: 'catalog', label: 'Ver proyectores', query: 'proyector' },
          { kind: 'wa', label: 'Cotizar proyector', message: 'Hola Futunet, estoy interesado en un proyector.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      'impresoras-epson': {
        text: 'Si buscas una impresora Epson, te llevo directo a esa busqueda para que revises opciones y precio.',
        actions: [
          { kind: 'catalog', label: 'Ver impresoras Epson', query: 'impresora Epson' },
          { kind: 'wa', label: 'Cotizar Epson', message: 'Hola Futunet, estoy buscando una impresora Epson.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      camaras: {
        text: 'Puedo llevarte a camaras de seguridad o pasarte con un asesor para orientarte segun tu necesidad.',
        actions: [
          { kind: 'catalog', label: 'Ver camaras', query: 'camara' },
          { kind: 'wa', label: 'Asesoria de camaras', message: 'Hola Futunet, quiero asesoria para camaras de seguridad.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      servicios: {
        text: 'Futunet tambien ofrece servicios. Si quieres, te llevo al catalogo o te paso directo con un asesor para cotizar.',
        actions: [
          { kind: 'catalog', label: 'Ver servicios', query: 'servicios' },
          { kind: 'wa', label: 'Cotizar servicio', message: 'Hola Futunet, quiero cotizar un servicio.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      catalogo: {
        text: 'Te llevo al catalogo completo para que explores todo con calma.',
        actions: [
          { kind: 'catalog', label: 'Abrir catalogo', query: '' }
        ],
        chips: QUICK_ACTIONS.main
      },
      agente: {
        text: 'Perfecto. Te paso directo con un asesor por WhatsApp.',
        actions: [
          { kind: 'wa', label: 'Abrir WhatsApp', message: 'Hola Futunet, quiero hablar con un asesor.' }
        ],
        chips: QUICK_ACTIONS.main
      }
    };

    return responses[key] || responses.agente;
  }

  function showResponse(key, label) {
    const response = getResponseByKey(key);
    addUserMessage(label);
    addBotMessage(response.text, response.actions);
    renderChips(response.chips || QUICK_ACTIONS.main);
  }

  function initConversation() {
    addBotMessage(INFO.intro);
    renderChips(QUICK_ACTIONS.main);
  }

  function setFabIcon(isOpen) {
    fab.innerHTML = isOpen
      ? `
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">
          <path d="M6 6l12 12"></path>
          <path d="M18 6L6 18"></path>
        </svg>
      `
      : `
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"></path>
        </svg>
      `;
  }

  function openChat() {
    win.classList.add('active');
    win.setAttribute('aria-hidden', 'false');
    fab.classList.add('is-hidden');
    setFabIcon(true);
    syncChatViewportState();

    if (!initialized) {
      initialized = true;
      initConversation();
    }
  }

  function closeChat() {
    win.classList.remove('active');
    win.setAttribute('aria-hidden', 'true');
    fab.classList.remove('is-hidden');
    setFabIcon(false);
    syncChatViewportState();
  }

  function toggleChat() {
    if (win.classList.contains('active')) closeChat();
    else openChat();
  }

  function botSearchProducts(query) {
    const products = window.mockDatabase || [];
    if (!products.length) return [];
    
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
    if (!words.length) return [];
    
    const scored = products.map(p => {
      let score = 0;
      const title = (p.title || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const desc = (p.desc || '').toLowerCase();
      
      words.forEach(w => {
        if (title.includes(w)) score += 10;
        if (brand.includes(w)) score += 5;
        if (cat.includes(w)) score += 3;
        if (desc.includes(w)) score += 1;
      });
      
      return { product: p, score };
    }).filter(item => item.score > 0);
    
    scored.sort((a, b) => b.score - a.score);
    return scored.map(item => item.product).slice(0, 3);
  }

  function handleFreeTextInput() {
    const text = cbInputText.value.trim();
    if (!text) return;
    
    cbInputText.value = '';
    addUserMessage(text);
    
    const query = text.toLowerCase();
    
    // Saludo
    if (query.match(/\b(hola|buenos|buenas|buen|holaa|saludos|que tal)\b/)) {
      addBotMessage("¡Hola! ¿Cómo puedo ayudarte hoy? Puedes preguntarme por productos específicos (como proyectores, impresoras, cámaras) o sobre nuestro horario y ubicación.", QUICK_ACTIONS.main);
      renderChips(QUICK_ACTIONS.main);
      return;
    }
    
    // Redirecciones rápidas
    if (query.includes("horario") || query.includes("hora") || query.includes("abierto")) {
      const response = getResponseByKey('horario');
      addBotMessage(response.text, response.actions);
      renderChips(response.chips || QUICK_ACTIONS.main);
      return;
    }
    if (query.includes("ubicacion") || query.includes("donde") || query.includes("direccion") || query.includes("sucursal") || query.includes("mapa")) {
      const response = getResponseByKey('ubicacion');
      addBotMessage(response.text, response.actions);
      renderChips(response.chips || QUICK_ACTIONS.main);
      return;
    }
    if (query.includes("envio") || query.includes("entrega") || query.includes("delivery") || query.includes("domicilio")) {
      const response = getResponseByKey('envios');
      addBotMessage(response.text, response.actions);
      renderChips(response.chips || QUICK_ACTIONS.main);
      return;
    }
    if (query.includes("servicio") || query.includes("instalacion") || query.includes("soporte") || query.includes("mantenimiento")) {
      const response = getResponseByKey('servicios');
      addBotMessage(response.text, response.actions);
      renderChips(response.chips || QUICK_ACTIONS.main);
      return;
    }
    
    // Búsqueda de Productos
    const matchingProducts = botSearchProducts(query);
    if (matchingProducts.length > 0) {
      let botResponse = `He encontrado estos productos que coinciden con tu consulta:`;
      const actions = matchingProducts.map(p => ({
        kind: 'product',
        label: p.title.length > 25 ? p.title.substring(0, 22) + '...' : p.title,
        id: p.id
      }));
      actions.push({
        kind: 'wa',
        label: 'Consultar con Asesor',
        message: `Hola Futunet, me interesa el producto: ${matchingProducts[0].title}`
      });
      
      addBotMessage(botResponse, actions);
      renderChips(QUICK_ACTIONS.catalogo);
    } else {
      addBotMessage("Disculpa, no encontré productos específicos para tu búsqueda. ¿Te gustaría ver el catálogo de la tienda o hablar con un asesor por WhatsApp?", [
        { kind: 'catalog', label: 'Ver catálogo', query: '' },
        { kind: 'wa', label: 'Hablar con Asesor', message: `Hola Futunet, necesito información sobre: ${text}` }
      ]);
      renderChips(QUICK_ACTIONS.main);
    }
  }

  setFabIcon(false);
  syncChatViewportState();

  fab.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleChat();
  });

  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeChat();
  });

  waBtn.addEventListener('click', () => {
    window.open(waLink('Hola Futunet, quiero hablar con un asesor.'), '_blank', 'noopener');
  });

  chips.addEventListener('click', (event) => {
    const button = event.target.closest('[data-key]');
    if (!button) return;
    showResponse(button.dataset.key, button.textContent.trim());
  });

  messages.addEventListener('click', (event) => {
    const button = event.target.closest('[data-kind]');
    if (!button) return;

    const kind = button.dataset.kind;
    if (kind === 'catalog') {
      openCatalogSearch(button.dataset.query || '');
      return;
    }

    if (kind === 'product') {
      window.location.href = `producto.html?id=${encodeURIComponent(button.dataset.id)}`;
      closeChat();
      return;
    }

    if (kind === 'wa') {
      window.open(waLink(button.dataset.message || 'Hola Futunet, quisiera ayuda con una consulta.'), '_blank', 'noopener');
    }
  });

  cbSendBtn.addEventListener('click', handleFreeTextInput);
  cbInputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleFreeTextInput();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && win.classList.contains('active')) closeChat();
  });

  let viewportTicking = false;
  function throttledSyncChatViewportState() {
    if (!viewportTicking) {
      window.requestAnimationFrame(() => {
        syncChatViewportState();
        viewportTicking = false;
      });
      viewportTicking = true;
    }
  }

  window.addEventListener('resize', throttledSyncChatViewportState);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', throttledSyncChatViewportState);
    window.visualViewport.addEventListener('scroll', throttledSyncChatViewportState);
  }

  document.addEventListener('click', (event) => {
    if (!win.classList.contains('active')) return;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (path.includes(win) || path.includes(fab) || win.contains(event.target) || fab.contains(event.target)) return;
    closeChat();
  });
});
