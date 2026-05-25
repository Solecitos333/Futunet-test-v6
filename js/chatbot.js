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

  const style = document.createElement('style');
  style.textContent = `
    .chatbot-fab{position:fixed;right:1.25rem;bottom:calc(1.25rem + var(--mobile-safe-bottom));width:66px;height:66px;border:0;border-radius:50%;background:linear-gradient(135deg,#0b5fc6,#084896);color:#fff;cursor:pointer;z-index:9999;box-shadow:0 18px 34px rgba(12,57,123,.28);display:grid;place-items:center;transition:transform .18s ease,box-shadow .18s ease,opacity .18s ease}
    .chatbot-fab:hover{transform:translateY(-2px);box-shadow:0 24px 40px rgba(12,57,123,.34)}
    .chatbot-fab.is-hidden{opacity:0;pointer-events:none;transform:translateY(6px) scale(.92)}
    .chatbot-window{position:fixed;right:1.5rem;bottom:calc(6.5rem + var(--mobile-safe-bottom));width:430px;max-width:calc(100vw - 24px);height:640px;max-height:calc(100vh - 7rem);background:linear-gradient(180deg,#f3f8fd 0%,#f8fbfe 100%);border-radius:28px;box-shadow:0 28px 60px rgba(13,41,79,.22);display:flex;flex-direction:column;overflow:hidden;opacity:0;pointer-events:none;transform:translateY(14px);transition:opacity .18s ease,transform .18s ease,height .18s ease,bottom .18s ease;z-index:9998}
    .chatbot-window.active{opacity:1;pointer-events:auto;transform:translateY(0)}
    .chatbot-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 22px;background:linear-gradient(135deg,#0b58b7,#084896);color:#fff}
    .chatbot-header-main{display:flex;align-items:center;gap:14px;min-width:0}
    .chatbot-avatar{width:50px;height:50px;border-radius:50%;background:#fff;object-fit:cover;padding:5px;box-shadow:0 10px 20px rgba(6,36,77,.18)}
    .chatbot-title{font:700 18px/1.2 'Space Grotesk',sans-serif}
    .chatbot-status{display:flex;align-items:center;gap:7px;margin-top:6px;font:600 13px/1 'Outfit',sans-serif;color:#dcecff}
    .chatbot-status-dot{width:9px;height:9px;border-radius:50%;background:#2ce39a}
    .chatbot-close{background:rgba(255,255,255,.14);border:0;border-radius:50%;width:38px;height:38px;color:#fff;font-size:22px;cursor:pointer}
    .chatbot-messages{flex:1;overflow:auto;padding:20px 18px 14px;background:transparent;display:flex;flex-direction:column;gap:14px}
    .cb-row{display:flex;gap:10px;align-items:flex-start}
    .cb-row--user{justify-content:flex-end}
    .cb-row--bot{justify-content:flex-start}
    .cb-mini-avatar{width:30px;height:30px;border-radius:50%;background:#fff;object-fit:cover;flex:0 0 30px;box-shadow:0 8px 16px rgba(13,41,79,.12)}
    .cb-bubble{max-width:82%;padding:14px 16px;border-radius:20px;font:500 15px/1.6 'Outfit',sans-serif;word-break:break-word}
    .cb-bubble--bot{background:#fff;color:#233246;border-bottom-left-radius:8px;box-shadow:0 12px 26px rgba(12,35,64,.08)}
    .cb-bubble--user{background:linear-gradient(135deg,#0b5fc6,#084896);color:#fff;border-bottom-right-radius:8px;box-shadow:0 14px 24px rgba(13,90,191,.18)}
    .cb-part + .cb-part{margin-top:12px}
    .cb-actions{display:flex;flex-wrap:wrap;gap:10px}
    .cb-action{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:9px 14px;border-radius:999px;border:1px solid #cfe0fb;background:#eef5ff;color:#0d5abf;text-decoration:none;font:600 13px/1 'Outfit',sans-serif;cursor:pointer}
    .cb-action:hover{background:#e6f1ff}
    .cb-action--wa{background:#25d366;border-color:#25d366;color:#fff}
    .cb-action--wa:hover{background:#20bf5b}
    .chatbot-footer{padding:14px 14px 16px;background:#fff;border-top:1px solid #e1eaf5;display:flex;flex-direction:column;gap:14px}
    .chatbot-chips{display:flex;gap:10px;overflow:auto;padding-bottom:2px}
    .chatbot-chip{min-height:42px;padding:0 16px;border-radius:999px;border:1px solid #cfe0fb;background:#f5f9ff;color:#0d5abf;white-space:nowrap;font:600 14px/1 'Outfit',sans-serif;cursor:pointer}
    .chatbot-chip:hover{background:#edf5ff}
    .chatbot-divider{height:4px;border-radius:999px;background:linear-gradient(90deg,#c6dafb 0%,#c6dafb 72%,transparent 72%)}
    .chatbot-wa{min-height:56px;border:0;border-radius:18px;background:#25d366;color:#fff;font:700 16px/1 'Outfit',sans-serif;cursor:pointer;box-shadow:0 12px 24px rgba(37,211,102,.18)}
    @media (max-width:767px){
      .chatbot-window{left:16px;right:16px;bottom:calc(var(--mobile-bottom-bar-height) + 20px + var(--mobile-safe-bottom) + var(--chatbot-keyboard-inset, 0px));width:auto;max-width:none;height:min(calc(var(--chatbot-viewport-height, 100svh) - var(--mobile-bottom-bar-height) - 34px - var(--mobile-safe-bottom) - var(--chatbot-keyboard-inset, 0px)),680px);border-radius:24px}
      .chatbot-header{padding:16px 18px}
      .chatbot-messages{padding:16px 14px 12px;gap:12px}
      .chatbot-footer{padding:12px 12px 14px;gap:10px}
      .chatbot-chips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;overflow:visible;padding-bottom:0}
      .chatbot-chip{min-height:40px;padding:8px 12px;border-radius:14px;white-space:normal;text-align:center;line-height:1.2;font-size:13px}
      .chatbot-wa{min-height:50px;border-radius:16px;font-size:15px}
      .chatbot-fab{right:.7rem;bottom:calc(var(--mobile-bottom-bar-height) + .7rem + var(--mobile-safe-bottom));width:52px;height:52px;box-shadow:0 14px 24px rgba(12,57,123,.22)}
      .chatbot-fab svg{width:24px;height:24px}
    }
    @media (max-width:560px){
      .chatbot-window{left:12px;right:12px;bottom:calc(var(--mobile-bottom-bar-height) + 60px + var(--mobile-safe-bottom) + var(--chatbot-keyboard-inset, 0px));height:min(calc(var(--chatbot-viewport-height, 100svh) - var(--mobile-bottom-bar-height) - 72px - var(--mobile-safe-bottom) - var(--chatbot-keyboard-inset, 0px)),620px);border-radius:22px}
      .chatbot-header{padding:14px 16px}
      .chatbot-avatar{width:44px;height:44px}
      .chatbot-title{font-size:17px}
      .chatbot-status{margin-top:4px;font-size:12px}
      .chatbot-messages{padding:14px 12px 10px;gap:10px}
      .cb-row{gap:8px}
      .cb-mini-avatar{width:26px;height:26px;flex:0 0 26px}
      .chatbot-fab{width:50px;height:50px}
      .cb-bubble{max-width:100%;padding:12px 14px;font-size:14px;line-height:1.5}
      .chatbot-footer{padding:10px 10px 12px;gap:8px}
      .chatbot-chip{min-height:36px;padding:8px 10px;font-size:12px}
      .chatbot-divider{display:none}
      .chatbot-wa{min-height:46px;font-size:14px;border-radius:14px}
    }
    .chatbot-window.chatbot-window--compact .chatbot-header{padding:12px 14px}
    .chatbot-window.chatbot-window--compact .chatbot-avatar{width:40px;height:40px}
    .chatbot-window.chatbot-window--compact .chatbot-title{font-size:16px}
    .chatbot-window.chatbot-window--compact .chatbot-status{margin-top:3px;font-size:11px}
    .chatbot-window.chatbot-window--compact .chatbot-messages{padding:10px 10px 8px;gap:8px}
    .chatbot-window.chatbot-window--compact .cb-row{gap:8px}
    .chatbot-window.chatbot-window--compact .cb-mini-avatar{width:24px;height:24px;flex:0 0 24px}
    .chatbot-window.chatbot-window--compact .cb-bubble{padding:10px 12px;font-size:13px;line-height:1.42}
    .chatbot-window.chatbot-window--compact .chatbot-footer{padding:8px 8px 10px;gap:6px}
    .chatbot-window.chatbot-window--compact .chatbot-chip{min-height:34px;padding:7px 8px;font-size:11px;border-radius:12px}
    .chatbot-window.chatbot-window--compact .chatbot-divider{display:none}
    .chatbot-window.chatbot-window--compact .chatbot-wa{min-height:42px;font-size:13px;border-radius:13px}
    @media (max-width:420px){
      .chatbot-chips{grid-template-columns:repeat(2,minmax(0,1fr))}
      .chatbot-window.chatbot-window--compact .chatbot-chips{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
  `;
  document.head.appendChild(style);

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

  function addRow(sender, html, includeAvatar = false) {
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
    bubble.innerHTML = html;
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

    if (kind === 'wa') {
      window.open(waLink(button.dataset.message || 'Hola Futunet, quisiera ayuda con una consulta.'), '_blank', 'noopener');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && win.classList.contains('active')) closeChat();
  });

  window.addEventListener('resize', syncChatViewportState);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncChatViewportState);
    window.visualViewport.addEventListener('scroll', syncChatViewportState);
  }

  document.addEventListener('click', (event) => {
    if (!win.classList.contains('active')) return;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (path.includes(win) || path.includes(fab) || win.contains(event.target) || fab.contains(event.target)) return;
    closeChat();
  });
});
