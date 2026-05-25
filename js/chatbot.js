document.addEventListener('DOMContentLoaded', () => {
  const INFO = {
    whatsapp: '18297411041',
    horario: 'Nuestro horario es de lunes a sábado de 8:00 AM a 6:00 PM.',
    ubicacion: 'Estamos en Avenida Cuesta Colorada, sector Las Colinas, Santiago de los Caballeros, República Dominicana.',
    envios: 'Podemos orientarte con entregas y envíos según el producto y tu zona.',
    intro: 'Hola. Soy el asistente virtual de Futunet. ¿En qué te puedo ayudar hoy? Puedes elegir una de las opciones rápidas o escribirme directamente lo que buscas.'
  };

  const CONFIG = {
    avatar: 'img/chatbot/assistant-avatar.svg'
  };

  const QUICK_ACTIONS = {
    main: [
      { label: 'Horario', key: 'horario' },
      { label: 'Ubicación', key: 'ubicacion' },
      { label: 'Envíos', key: 'envios' },
      { label: 'Proyectores', key: 'proyectores' },
      { label: 'Impresoras Epson', key: 'impresoras-epson' },
      { label: 'Cámaras', key: 'camaras' },
      { label: 'Servicios', key: 'servicios' }
    ],
    catalogo: [
      { label: 'Catálogo completo', key: 'catalogo' },
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
    .chatbot-footer{padding:14px 14px 16px;background:#fff;border-top:1px solid #e1eaf5;display:flex;flex-direction:column;gap:12px}
    .chatbot-chips{display:flex;gap:10px;overflow:auto;padding-bottom:2px}
    .chatbot-chip{min-height:42px;padding:0 16px;border-radius:999px;border:1px solid #cfe0fb;background:#f5f9ff;color:#0d5abf;white-space:nowrap;font:600 14px/1 'Outfit',sans-serif;cursor:pointer}
    .chatbot-chip:hover{background:#edf5ff}
    .chatbot-divider{height:1px;background:#e1eaf5}
    .chatbot-wa{min-height:56px;border:0;border-radius:18px;background:#25d366;color:#fff;font:700 16px/1 'Outfit',sans-serif;cursor:pointer;box-shadow:0 12px 24px rgba(37,211,102,.18);width:100%}
    
    /* AI Input Styles */
    .cb-input-container{display:flex;gap:8px;align-items:center;background:#f0f4f9;border-radius:16px;padding:6px 14px;border:1px solid #cfe0fb;transition:all 0.2s}
    .cb-input-container:focus-within{border-color:#0b5fc6;background:#fff;box-shadow:0 0 0 3px rgba(11,95,198,0.12)}
    .cb-input-text{flex:1;border:0;background:transparent;outline:none;font:500 14px/1.5 'Outfit',sans-serif;color:#233246;padding:6px 0}
    .cb-send-btn{border:0;background:#0b5fc6;color:#fff;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;cursor:pointer;transition:all 0.2s;flex-shrink:0}
    .cb-send-btn:hover{background:#084896;transform:scale(1.04)}
    .cb-send-btn:disabled{background:#a0b0c4;cursor:not-allowed;transform:none}
    
    @keyframes cb-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    
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
      .chatbot-wa{min-height:46px;font-size:14px;border-radius:14px}
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
              <span>Inteligencia Artificial activa</span>
            </div>
          </div>
        </div>
        <button class="chatbot-close" id="cb-close" aria-label="Cerrar">&times;</button>
      </div>
      <div class="chatbot-messages" id="cb-messages" aria-live="polite"></div>
      <div class="chatbot-footer">
        <div class="chatbot-chips" id="cb-chips"></div>
        
        <!-- Input para la IA -->
        <div class="cb-input-container">
          <input type="text" id="cb-input" class="cb-input-text" placeholder="Pregúntame algo..." autocomplete="off" />
          <button type="button" id="cb-send" class="cb-send-btn" aria-label="Enviar mensaje">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        
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
  const inputEl = document.getElementById('cb-input');
  const sendBtn = document.getElementById('cb-send');

  let initialized = false;
  let productsContext = '';
  let chatHistory = [];

  // Background context loaders
  async function loadProductsContext() {
    try {
      // Wait for Firebase to load
      var count = 0;
      var interval = setInterval(async function () {
        if (window.FutunetFirebase && window.FutunetFirebase.db) {
          clearInterval(interval);
          try {
            var snap = await window.FutunetFirebase.db.collection('products').where('isActive', '==', true).get();
            var arr = [];
            snap.forEach(function (doc) {
              var p = doc.data();
              arr.push(`* ${p.title} - Marca: ${p.brand || 'Genérico'}, Categoría: ${p.category}, Precio: RD$ ${p.price}, Stock: ${p.stock || 0}`);
            });
            productsContext = arr.join('\n');
          } catch (err) {
            console.warn('Failed loading products context for AI:', err);
          }
        } else {
          count++;
          if (count > 40) clearInterval(interval); // 2 second timeout
        }
      }, 50);
    } catch (e) {
      console.warn('Config checker error in chatbot:', e);
    }
  }

  loadProductsContext();

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
    var waNum = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || INFO.whatsapp;
    return `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function formatBotResponse(text) {
    let safeText = escapeHtml(text);
    // Bold formats
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet lists
    safeText = safeText.replace(/^\*\s(.*)/gm, '• $1');
    // Newlines to breaks
    safeText = safeText.replace(/\n/g, '<br>');
    return safeText;
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
    addRow('user', escapeHtml(text));
  }

  function addBotMessage(text, actions = [], isHtml = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cb-row cb-row--bot';

    const avatar = document.createElement('img');
    avatar.className = 'cb-mini-avatar';
    avatar.src = CONFIG.avatar;
    avatar.alt = 'Asistente Futunet';
    wrapper.appendChild(avatar);

    const bubble = document.createElement('div');
    bubble.className = `cb-bubble cb-bubble--bot`;

    const textBlock = document.createElement('div');
    textBlock.className = 'cb-part';
    if (isHtml) {
      textBlock.innerHTML = text;
    } else {
      textBlock.textContent = text;
    }
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
        text: (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.HORARIO) || INFO.horario,
        actions: [
          { kind: 'wa', label: 'Confirmar por WhatsApp', message: 'Hola Futunet, quisiera confirmar su horario de atención.' }
        ],
        chips: QUICK_ACTIONS.main
      },
      ubicacion: {
        text: `${(window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.ADDRESS) || INFO.ubicacion} Si quieres, te paso con un asesor para darte la ubicación exacta.`,
        actions: [
          { kind: 'wa', label: 'Pedir ubicación exacta', message: 'Hola Futunet, quisiera su ubicación exacta.' }
        ],
        chips: QUICK_ACTIONS.main
      },
      envios: {
        text: `${INFO.envios} Si quieres, te paso con un asesor para validar disponibilidad y entrega.`,
        actions: [
          { kind: 'wa', label: 'Consultar envío', message: 'Hola Futunet, quisiera consultar opciones de envío.' }
        ],
        chips: QUICK_ACTIONS.main
      },
      proyectores: {
        text: 'Puedo llevarte directo a los proyectores disponibles en el catálogo y también ayudarte a cotizar uno por WhatsApp.',
        actions: [
          { kind: 'catalog', label: 'Ver proyectores', query: 'proyector' },
          { kind: 'wa', label: 'Cotizar proyector', message: 'Hola Futunet, estoy interesado en un proyector.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      'impresoras-epson': {
        text: 'Si buscas una impresora Epson, te llevo directo a esa búsqueda para que revises opciones y precios.',
        actions: [
          { kind: 'catalog', label: 'Ver impresoras Epson', query: 'impresora Epson' },
          { kind: 'wa', label: 'Cotizar Epson', message: 'Hola Futunet, estoy buscando una impresora Epson.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      camaras: {
        text: 'Puedo llevarte a cámaras de seguridad o pasarte con un asesor para orientarte según tu necesidad.',
        actions: [
          { kind: 'catalog', label: 'Ver cámaras', query: 'camara' },
          { kind: 'wa', label: 'Asesoría de cámaras', message: 'Hola Futunet, quiero asesoría para cámaras de seguridad.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      servicios: {
        text: 'Futunet también ofrece servicios. Si quieres, te llevo al catálogo o te paso directo con un asesor para cotizar.',
        actions: [
          { kind: 'catalog', label: 'Ver servicios', query: 'servicios' },
          { kind: 'wa', label: 'Cotizar servicio', message: 'Hola Futunet, quiero cotizar un servicio.' }
        ],
        chips: QUICK_ACTIONS.catalogo
      },
      catalogo: {
        text: 'Te llevo al catálogo completo para que explores todo con calma.',
        actions: [
          { kind: 'catalog', label: 'Abrir catálogo', query: '' }
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

  // Google Gemini integration
  async function callGeminiChat(userText) {
    const apiKey = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.GEMINI_API_KEY) || '';
    if (!apiKey) {
      return "Lo siento, la tienda no tiene configurada la clave de IA todavía. Puedes contactar a un asesor mediante el botón de WhatsApp abajo.";
    }

    chatHistory.push({ role: 'user', parts: [{ text: userText }] });

    // Limit history memory size
    if (chatHistory.length > 12) {
      chatHistory = chatHistory.slice(chatHistory.length - 12);
    }

    const whatsappNum = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.WHATSAPP_NUMBER) || INFO.whatsapp;
    const siteName = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.SITE_NAME) || 'Futunet';
    const address = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.ADDRESS) || INFO.ubicacion;
    const advisor = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.ADVISOR_NAME) || 'Orbis Espinal';

    const systemPrompt = `Eres un Asistente Virtual experto en ventas para la tienda ${siteName} (República Dominicana).
Tu objetivo es ayudar a los clientes a encontrar productos, responder preguntas y dar asesoría amigable en español.

Información sobre la tienda ${siteName}:
- WhatsApp de contacto: ${whatsappNum}
- Dirección física: ${address}
- Horario de atención: Lunes a Sábado de 8:00 AM a 6:00 PM.
- Asesor Comercial a cargo: ${advisor}
- Envíos: Se realizan envíos a nivel nacional coordinando con el asesor.

Nuestros Productos Disponibles en Catálogo:
${productsContext || 'Cargando catálogo...'}

Instrucciones de Respuesta:
- Sé extremadamente amable, servicial y profesional.
- Utiliza un tono cálido y respetuoso.
- Si un cliente te pregunta por un producto que tenemos en la lista anterior, recomiéndaselo, indícale el precio (RD$) y confírmale el stock.
- Si el cliente quiere hablar con un agente o finalizar la compra, indícale amablemente que puede hacer clic en el botón de WhatsApp de abajo para hablar con ${advisor}.
- No inventes productos ni des precios de cosas que no estén en la lista anterior. Si no lo tenemos, sugiérele contactar al asesor por si se puede ordenar.
- Intenta que tus respuestas sean cortas, estructuradas y fáciles de leer en un chat de móvil (máximo 2-3 párrafos cortos).`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: chatHistory,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servicio de IA');
      }

      const resData = await response.json();
      if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts[0]) {
        const botResponse = resData.candidates[0].content.parts[0].text.trim();
        chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });
        return botResponse;
      } else {
        throw new Error('Respuesta vacía del servidor');
      }
    } catch (err) {
      console.error('Gemini call error:', err);
      chatHistory.pop(); // remove user text from failed state
      return "Disculpa, he tenido un inconveniente de conexión. ¿Podrías volver a intentarlo o presionar el botón inferior de WhatsApp?";
    }
  }

  // Handle Dynamic User Inputs
  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    addUserMessage(text);
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;

    // Show typing indicator
    const typingId = 'cb-typing-indicator';
    const typingRow = document.createElement('div');
    typingRow.className = 'cb-row cb-row--bot';
    typingRow.id = typingId;
    typingRow.innerHTML = `
      <img class="cb-mini-avatar" src="${CONFIG.avatar}" alt="Asistente Futunet">
      <div class="cb-bubble cb-bubble--bot" style="display:flex; align-items:center; gap:4px; padding:12px 16px;">
        <span class="dot" style="width:6px; height:6px; background:#8a9bb4; border-radius:50%; animation: cb-bounce 1.4s infinite both;"></span>
        <span class="dot" style="width:6px; height:6px; background:#8a9bb4; border-radius:50%; animation: cb-bounce 1.4s infinite both; animation-delay: .2s;"></span>
        <span class="dot" style="width:6px; height:6px; background:#8a9bb4; border-radius:50%; animation: cb-bounce 1.4s infinite both; animation-delay: .4s;"></span>
      </div>
    `;
    messages.appendChild(typingRow);
    messages.scrollTop = messages.scrollHeight;

    const rawResponse = await callGeminiChat(text);

    // Remove typing indicator
    const indicator = document.getElementById(typingId);
    if (indicator) indicator.remove();

    addBotMessage(formatBotResponse(rawResponse), [], true);

    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
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
    var advisor = (window.FUTUNET_CONFIG && window.FUTUNET_CONFIG.ADVISOR_NAME) || 'Orbis Espinal';
    window.open(waLink(`Hola Futunet, quiero hablar con un asesor (${advisor}).`), '_blank', 'noopener');
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

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSend();
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
