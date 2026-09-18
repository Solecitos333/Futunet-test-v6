document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cb-window')) return;
  const INFO = {
    whatsapp: '18297411041',
    intro: 'Hola, soy el asistente virtual de Futunet. Cuéntame qué necesitas: productos, ayuda con la web o una reclamación. Puedo preparar tu caso para soporte. Tus mensajes se procesan con Gemini; no compartas contraseñas ni datos de pago.'
  };
  const CONFIG = { avatar: 'img/chatbot/assistant-avatar.svg' };
  const QUICK_ACTIONS = { main: [
    { label: 'Tengo un problema', key: 'soporte' },
    { label: 'Hacer una reclamación', key: 'reclamacion' },
    { label: 'Elegir un producto', key: 'productos' }
  ] };
  const HANDOFF = 'futunet_support_handoff';
  let history = [], userMessages = [], ticketDraft = null, pending = null, epoch = 0;
  let owner = window.FutunetAuth?.getCurrentUser()?.uid || null;

  // Chatbot styles loaded from css/chatbot.css

  const root = document.createElement('div');
  root.innerHTML = `
    <div class="chatbot-window" id="cb-window" aria-hidden="true" inert>
      <div class="chatbot-header">
        <div class="chatbot-header-main">
          <img class="chatbot-avatar" src="${CONFIG.avatar}" alt="Asistente Futunet">
          <div>
            <div class="chatbot-title">Asistente Futunet</div>
            <div class="chatbot-status">
              <span class="chatbot-status-dot"></span>
              <span id="cb-status">Asistente virtual · Gemini</span>
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
          <input type="text" id="cb-input-text" maxlength="1500" placeholder="Escribe tu pregunta aquí..." autocomplete="off" aria-label="Escribe tu mensaje" />
          <button type="button" id="cb-send-btn" aria-label="Enviar" class="chatbot-send-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <button class="cb-support-button" id="cb-ticket" type="button">Preparar ticket para soporte</button>
        <div class="cb-footer-links"><button class="cb-reset" id="cb-reset" type="button">Nueva conversación</button>
        <button class="cb-reset" id="cb-wa" type="button">Agente por WhatsApp ↗</button></div>
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

  function showResponse(key, label) { sendMessage(label); }

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
    win.inert = false;
    win.setAttribute('aria-hidden', 'false');
    fab.classList.add('is-hidden');
    fab.tabIndex = -1;
    setFabIcon(true);
    syncChatViewportState();

    if (!initialized) {
      initialized = true;
      initConversation();
    }
  }

  function closeChat() {
    win.classList.remove('active');
    win.inert = true;
    win.setAttribute('aria-hidden', 'true');
    fab.classList.remove('is-hidden');
    fab.tabIndex = 0;
    setFabIcon(false);
    syncChatViewportState();
  }

  function toggleChat() {
    if (win.classList.contains('active')) closeChat();
    else openChat();
  }

  function setBusy(busy) {
    cbSendBtn.disabled = busy;
    chips.querySelectorAll('button').forEach(button => { button.disabled = busy; });
    messages.setAttribute('aria-busy', String(busy));
    const statusEl = document.getElementById('cb-status');
    if (statusEl) statusEl.textContent = busy ? 'Preparando respuesta…' : 'Asistente virtual · Gemini';
  }

  async function sendMessage(value) {
    const text = value.trim().slice(0, 1500);
    if (!text || pending) return;
    cbInputText.value = '';
    addUserMessage(text);
    userMessages.push(text);
    userMessages = userMessages.slice(-12);
    ticketDraft = null; // A new fact makes an earlier generated draft stale.
    const currentEpoch = epoch;
    const controller = new AbortController(); pending = controller;
    const timer = setTimeout(() => controller.abort(), 32000);
    setBusy(true);
    try {
      const transport = window.FutunetChatTransport || await import('./chatbot-firebase.mjs?v=20260914firebase2');
      const result = await Promise.race([
        transport.send({ message: text, history, page: location.pathname.split('/').pop() || 'index.html' }, controller.signal),
        new Promise((_, reject) => {
          if (controller.signal.aborted) reject(new Error('aborted'));
          else controller.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
        })
      ]);
      if (currentEpoch !== epoch) return;
      if (typeof result.reply !== 'string' || !result.reply.trim() || result.reply.length > 3500) throw new Error('invalid');
      const actions = (Array.isArray(result.products) ? result.products : []).slice(0, 5)
        .filter(p => typeof p.title === 'string' && /^[A-Za-z0-9_-]{1,150}$/.test(p.id))
        .map(p => ({ kind: 'product', label: p.title.slice(0, 80), id: p.id }));
      if (result.ticket && ['bug', 'complaint', 'help'].includes(result.ticket.type)
          && typeof result.ticket.title === 'string' && result.ticket.title.length >= 5
          && typeof result.ticket.description === 'string' && result.ticket.description.length >= 20) {
        ticketDraft = result.ticket;
      }
      if (ticketDraft || ['support', 'complaint'].includes(result.intent)) actions.push({ kind: 'ticket', label: 'Revisar caso y adjuntar capturas' });
      addBotMessage(result.reply, actions);
      history.push({ role: 'user', text }, { role: 'model', text: result.reply });
      trimHistory();
    } catch (error) {
      if (currentEpoch !== epoch) return;
      const reply = error.message === 'busy'
        ? 'El asistente está ocupado. Espera un minuto para volver a consultar. Puedes preparar tu ticket ahora con lo que ya escribiste.'
        : 'No pude conectar con la asistencia inteligente. Puedes volver a preguntar o continuar con un ticket: conservaré lo que explicaste para que lo revises y añadas capturas.';
      addBotMessage(reply, [{ kind: 'ticket', label: 'Continuar con soporte' }, { kind: 'catalog', label: 'Ver catálogo' }]);
      // Keep the user's report even when the provider fails; later turns retain context.
      history.push({ role: 'user', text }, { role: 'model', text: reply });
      trimHistory();
      const statusEl = document.getElementById('cb-status');
      if (statusEl) statusEl.textContent = 'Soporte disponible';
    } finally {
      clearTimeout(timer);
      if (currentEpoch === epoch) { pending = null; setBusy(false); }
    }
  }

  function trimHistory() {
    while (history.length > 12 || history.reduce((total, item) => total + item.text.length, 0) > 10000) history.splice(0, 2);
  }

  function handleFreeTextInput() { sendMessage(cbInputText.value); }

  function prepareTicket() {
    const transcript = userMessages.join('\n\n').slice(-3900);
    if (!transcript) { location.href = 'soporte.html#sp-new-case'; return; }
    const draft = ticketDraft || {
      type: /reclama|devoluci|reembolso/i.test(transcript) ? 'complaint' : /error|falla|no funciona|bot[oó]n/i.test(transcript) ? 'bug' : 'help',
      title: 'Consulta desde el asistente de Futunet',
      description: 'Lo que expliqué al asistente:\n\n' + transcript
    };
    const handoff = { createdAt: Date.now(), ownerId: owner, fields: {
      type: draft.type, title: draft.title.slice(0, 120), description: draft.description.slice(0, 4000),
      attempted: String(draft.attempted || '').slice(0, 800), reference: String(draft.reference || '').slice(0, 100),
      page: location.origin + location.pathname
    } };
    try {
      sessionStorage.setItem(HANDOFF, JSON.stringify(handoff));
      if (document.getElementById('sp-root')?.dataset.mode === 'public') {
        window.dispatchEvent(new Event('futunet-support-draft')); closeChat();
      } else { location.href = 'soporte.html#sp-new-case'; }
    } catch (_) {
      addBotMessage('No pude trasladar el borrador. Copia tu descripción y abre soporte para enviarla.', [{ kind: 'link', label: 'Abrir soporte', href: 'soporte.html' }]);
    }
  }

  function resetConversation() {
    epoch++; pending?.abort(); pending = null; history = []; userMessages = []; ticketDraft = null;
    cbInputText.value = ''; messages.replaceChildren(); setBusy(false);
    try { sessionStorage.removeItem(HANDOFF); } catch (_) {}
    initialized = true; initConversation();
  }

  document.getElementById('cb-ticket')?.addEventListener('click', prepareTicket);
  document.getElementById('cb-reset')?.addEventListener('click', resetConversation);
  function sendPrompt(promptText) {
    if (!promptText || typeof promptText !== 'string') return;
    openChat();
    setTimeout(() => {
      if (cbInputText) cbInputText.value = promptText;
      sendMessage(promptText);
    }, 200);
  }

  window.addEventListener('futunet-open-chat', (event) => {
    openChat();
    if (event && event.detail && event.detail.prompt) {
      sendPrompt(event.detail.prompt);
    }
  });

  window.FutunetAI = {
    open(prompt) {
      openChat();
      if (prompt) sendPrompt(prompt);
    },
    ask(prompt) {
      sendPrompt(prompt);
    },
    askInternet(customPrompt) {
      const p = customPrompt || 'Hola, quisiera que me asesores para elegir el mejor plan de Internet de fibra óptica según mis necesidades.';
      sendPrompt(p);
    },
    askProduct(product) {
      const title = product?.title || 'este producto';
      const price = product?.price ? ` (precio: RD$ ${Number(product.price).toLocaleString('es-DO')})` : '';
      const cat = product?.category ? ` en la categoría ${product.category}` : '';
      const p = `Hola, me interesa obtener más detalles y asesoría sobre ${title}${price}${cat}. ¿Qué características técnicas tiene y cómo es el proceso de entrega o instalación?`;
      sendPrompt(p);
    },
    close: closeChat,
    toggle: toggleChat
  };
  const syncOwner = () => {
    const next = window.FutunetAuth?.getCurrentUser()?.uid || null;
    if (owner && next !== owner) resetConversation();
    owner = next;
  };
  window.FutunetAuth?.authReady?.then(syncOwner);
  window.addEventListener('futunet-auth-ready', syncOwner);
  window.addEventListener('pagehide', () => { epoch++; pending?.abort(); pending = null; setBusy(false); });

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
    if (kind === 'ticket') { prepareTicket(); return; }
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
