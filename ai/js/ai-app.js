/**
 * Futunet AI Hub - Main Application Logic
 * v2.1 - Bug fixes & improvements
 */
(function() {
  'use strict';

  // --- State ---
  const state = {
    currentChatId: null,
    currentModel: 'gemini-2.0-flash',
    isGenerating: false,
    isOnline: false,
    messages: [],
    abortController: null,
    ollamaEndpoint: '',
    settings: {},
    allChats: []
  };

  // --- DOM Elements ---
  const els = {
    loadingScreen: document.getElementById('loading-screen'),
    app: document.getElementById('app'),
    sidebar: document.getElementById('sidebar'),
    openSidebarBtn: document.getElementById('open-sidebar'),
    closeSidebarBtn: document.getElementById('close-sidebar'),
    newChatBtn: document.getElementById('new-chat-btn'),
    chatList: document.getElementById('chat-list'),
    searchInput: document.getElementById('search-input'),
    userName: document.getElementById('user-name'),
    userAvatar: document.getElementById('user-avatar'),
    settingsBtn: document.getElementById('settings-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    modelSelect: document.getElementById('model-select'),
    connectionStatus: document.getElementById('connection-status'),
    messagesContainer: document.getElementById('messages-container'),
    messagesList: document.getElementById('messages-list'),
    welcomeScreen: document.getElementById('welcome-screen'),
    chatInput: document.getElementById('chat-input'),
    sendBtn: document.getElementById('send-btn'),
    stopBtn: document.getElementById('stop-btn'),
    attachBtn: document.getElementById('attach-btn'),
    fileInput: document.getElementById('file-input'),
    imagePreviewContainer: document.getElementById('image-preview-container'),
    charCount: document.getElementById('char-count'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings'),
    ollamaUrlInput: document.getElementById('ollama-url'),
    testOllamaBtn: document.getElementById('test-ollama-btn'),
    geminiKeyInput: document.getElementById('gemini-key'),
    toggleKeyVisBtn: document.getElementById('toggle-key-vis'),
    defaultModelSelect: document.getElementById('default-model'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    clearChatsBtn: document.getElementById('clear-chats-btn'),
    promptCards: document.querySelectorAll('.prompt-card')
  };

  // --- Markdown Parser (improved) ---
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseMarkdown(text) {
    if (!text) return '';

    // Preserve code blocks before escaping
    const codeBlocks = [];
    let html = text.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      const langLabel = lang || 'code';
      const escapedCode = escapeHtml(code.trim());
      codeBlocks.push(`<div class="code-block-wrapper"><div class="code-block-header"><span class="code-lang">${langLabel}</span><button class="copy-code-btn" onclick="copyCode(this)">📋 Copiar</button></div><pre><code class="language-${langLabel}">${escapedCode}</code></pre></div>`);
      return `\x00CODE${idx}\x00`;
    });

    // Preserve inline code
    const inlineCodes = [];
    html = html.replace(/`([^`\n]+)`/g, (match, code) => {
      const idx = inlineCodes.length;
      inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
      return `\x00INLINE${idx}\x00`;
    });

    // Escape HTML in the rest
    html = escapeHtml(html);

    // Bold & Italic (order matters)
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_\n]+)_/g, '<em>$1</em>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)/gm, '<li>$1</li>');

    // Unordered lists
    html = html.replace(/^[-*] (.+)/gm, '<li>$1</li>');

    // Wrap consecutive li in ul
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Links
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Line breaks (double newlines → paragraph)
    html = html.split('\n\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (/^<(h[1-6]|pre|ul|ol|hr|div|blockquote)/.test(p)) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).filter(Boolean).join('\n');

    // Restore placeholders
    html = html.replace(/\x00CODE(\d+)\x00/g, (_, idx) => codeBlocks[parseInt(idx)]);
    html = html.replace(/\x00INLINE(\d+)\x00/g, (_, idx) => inlineCodes[parseInt(idx)]);

    return html;
  }

  // Global copy code helper (used inline in code blocks)
  window.copyCode = function(btn) {
    const code = btn.closest('.code-block-wrapper').querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = '✅ Copiado';
      setTimeout(() => btn.textContent = '📋 Copiar', 2000);
    });
  };

  function scrollToBottom(smooth = true) {
    els.messagesContainer.scrollTo({
      top: els.messagesContainer.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant'
    });
  }

  function autoResizeTextarea() {
    els.chatInput.style.height = 'auto';
    els.chatInput.style.height = Math.min(els.chatInput.scrollHeight, 200) + 'px';
    const textLen = els.chatInput.value.length;
    els.charCount.textContent = `${textLen} caracteres`;
    els.sendBtn.disabled = textLen === 0 || state.isGenerating;
  }

  // --- Model detection helper ---
  function isCloudModel(modelValue) {
    modelValue = modelValue || state.currentModel;
    return modelValue.startsWith('gemini-') || modelValue.includes('cloud');
  }

  // --- UI Rendering ---
  function updateConnectionStatus(online) {
    state.isOnline = online;
    if (online) {
      els.connectionStatus.className = 'status-badge local';
      els.connectionStatus.textContent = '🖥️ Local';
    } else {
      els.connectionStatus.className = 'status-badge cloud';
      els.connectionStatus.textContent = '☁️ Cloud';
    }
  }

  function renderMessage(msg, index) {
    const isUser = msg.role === 'user';
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${isUser ? 'user' : 'assistant'}`;
    msgDiv.dataset.index = index;

    let contentHtml = '';

    if (msg.thinking) {
      contentHtml += `
        <details class="thinking-block">
          <summary>💭 Proceso de pensamiento</summary>
          <div class="thinking-content">${parseMarkdown(msg.thinking)}</div>
        </details>
      `;
    }

    contentHtml += `<div class="message-content">${parseMarkdown(msg.content)}</div>`;

    if (!isUser) {
      contentHtml += `
        <div class="message-actions">
          <button class="icon-btn copy-btn" title="Copiar respuesta">📋</button>
          <button class="icon-btn regen-btn" title="Regenerar" data-index="${index}">🔄</button>
        </div>
      `;
    }

    msgDiv.innerHTML = contentHtml;

    // Setup copy btn
    const copyBtn = msgDiv.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.content).then(() => {
          copyBtn.textContent = '✅';
          setTimeout(() => copyBtn.textContent = '📋', 2000);
        });
      });
    }

    // Setup regen btn
    const regenBtn = msgDiv.querySelector('.regen-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        if (state.isGenerating) return;
        // Remove last assistant message and regenerate
        const idx = parseInt(regenBtn.dataset.index);
        state.messages = state.messages.slice(0, idx);
        // Remove all messages from that index onwards in the DOM
        const allMsgs = els.messagesList.querySelectorAll('.message');
        for (let i = idx; i < allMsgs.length; i++) {
          allMsgs[i].remove();
        }
        generateResponse();
      });
    }

    return msgDiv;
  }

  function renderChatList(chats) {
    state.allChats = chats;
    const filter = els.searchInput.value.toLowerCase();
    const filteredChats = chats.filter(c => (c.title || '').toLowerCase().includes(filter));

    els.chatList.innerHTML = '';

    if (filteredChats.length === 0) {
      els.chatList.innerHTML = '<div class="chat-item empty">Sin chats aún</div>';
      return;
    }

    filteredChats.forEach(chat => {
      const chatEl = document.createElement('div');
      chatEl.className = `chat-item ${chat.id === state.currentChatId ? 'active' : ''}`;
      chatEl.innerHTML = `<span class="chat-title">${escapeHtml(chat.title || 'Chat sin título')}</span><button class="delete-chat-btn" title="Eliminar">🗑️</button>`;

      chatEl.querySelector('.chat-title').addEventListener('click', () => loadChat(chat.id));

      chatEl.querySelector('.delete-chat-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta conversación?')) {
          await AiMemory.deleteChat(chat.id);
          if (state.currentChatId === chat.id) startNewChat();
        }
      });

      els.chatList.appendChild(chatEl);
    });
  }

  // --- Ollama Connection ---
  async function checkOllama() {
    const LIVE_TUNNEL = 'https://continually-dairy-aim-accompanying.trycloudflare.com';
    const endpointsToTry = [
      state.ollamaEndpoint,
      LIVE_TUNNEL,
      'http://10.0.0.117:3000',
      'http://localhost:3000'
    ].filter(Boolean);

    const uniqueEndpoints = [...new Set(endpointsToTry)];

    for (const ep of uniqueEndpoints) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000); // 3s timeout per attempt
        const res = await fetch(`${ep}/api/health`, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timer);

        if (res.ok) {
          state.ollamaEndpoint = ep;
          updateConnectionStatus(true);

          // Fetch models
          try {
            const modelsRes = await fetch(`${ep}/api/models`, { signal: AbortSignal.timeout(3000) });
            if (modelsRes.ok) {
              const data = await modelsRes.json();
              const models = data.models || [];
              updateModelList(models);
            } else {
              updateModelList([]);
            }
          } catch (e) {
            updateModelList([]);
          }
          return true;
        }
      } catch (e) {
        // Timeout or network error — try next
      }
    }

    updateConnectionStatus(false);
    updateModelList([]);
    return false;
  }

  function updateModelList(ollamaModels = []) {
    const prevValue = els.modelSelect.value || state.currentModel;

    els.modelSelect.innerHTML = '';
    els.defaultModelSelect.innerHTML = '';

    // Local Ollama models
    if (ollamaModels.length > 0) {
      const localGroup = document.createElement('optgroup');
      localGroup.label = '🖥️ Modelos Locales';
      ollamaModels.forEach(m => {
        const opt = new Option(`${m.name}`, m.name);
        localGroup.appendChild(opt);
      });
      els.modelSelect.appendChild(localGroup.cloneNode(true));
      els.defaultModelSelect.appendChild(localGroup);
    }

    // Cloud Gemini models
    const cloudGroup = document.createElement('optgroup');
    cloudGroup.label = '☁️ Modelos Cloud';
    AiGemini.models().forEach(m => {
      const opt = new Option(m.displayName, m.name);
      cloudGroup.appendChild(opt);
    });
    els.modelSelect.appendChild(cloudGroup.cloneNode(true));
    els.defaultModelSelect.appendChild(cloudGroup);

    // Restore selection
    if ([...els.modelSelect.options].some(o => o.value === prevValue)) {
      els.modelSelect.value = prevValue;
      state.currentModel = prevValue;
    } else if (els.modelSelect.options.length > 0) {
      state.currentModel = els.modelSelect.options[0].value;
      els.modelSelect.value = state.currentModel;
    }
  }

  async function loadChat(chatId) {
    const chat = await AiMemory.loadChat(chatId);
    if (!chat) return;

    els.welcomeScreen.style.display = 'none';
    state.currentChatId = chatId;
    state.messages = chat.messages || [];

    if (chat.model) {
      state.currentModel = chat.model;
      els.modelSelect.value = chat.model;
    }

    els.messagesList.innerHTML = '';
    state.messages.forEach((msg, idx) => {
      els.messagesList.appendChild(renderMessage(msg, idx));
    });

    // Mark active in sidebar
    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
    const activeItem = [...document.querySelectorAll('.chat-item')].find(el => {
      const title = el.querySelector('.chat-title');
      return title && chat.title && title.textContent === chat.title;
    });
    if (activeItem) activeItem.classList.add('active');

    scrollToBottom(false);

    if (window.innerWidth <= 768) {
      els.sidebar.classList.remove('open');
    }
  }

  function startNewChat() {
    state.currentChatId = null;
    state.messages = [];
    els.messagesList.innerHTML = '';
    els.welcomeScreen.style.display = 'block';
    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));

    if (window.innerWidth <= 768) {
      els.sidebar.classList.remove('open');
    }

    els.chatInput.focus();
  }

  async function sendMessage(text) {
    text = text.trim();
    if (!text || state.isGenerating) return;

    els.chatInput.value = '';
    autoResizeTextarea();

    const userMsg = { role: 'user', content: text };
    state.messages.push(userMsg);

    els.welcomeScreen.style.display = 'none';
    els.messagesList.appendChild(renderMessage(userMsg, state.messages.length - 1));
    scrollToBottom();

    // Create chat in Firestore if needed
    if (!state.currentChatId) {
      try {
        state.currentChatId = await AiMemory.createChat(state.currentModel);
        await AiMemory.renameChat(state.currentChatId, AiMemory.autoTitle(text));
      } catch (e) {
        console.warn('Could not save to Firestore:', e.message);
      }
    }

    // Save user message
    try {
      if (state.currentChatId) {
        await AiMemory.addMessage(state.currentChatId, userMsg);
      }
    } catch (e) {
      console.warn('Could not save message:', e.message);
    }

    generateResponse();
  }

  async function generateResponse() {
    state.isGenerating = true;
    els.sendBtn.disabled = true;
    els.sendBtn.style.display = 'none';
    els.stopBtn.style.display = 'flex';

    const assistantMsg = { role: 'assistant', content: '', thinking: '' };
    const msgIdx = state.messages.length;
    state.messages.push(assistantMsg);

    const msgEl = document.createElement('div');
    msgEl.className = 'message message-assistant';
    msgEl.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    els.messagesList.appendChild(msgEl);
    scrollToBottom();

    const useCloud = isCloudModel(state.currentModel) || !state.isOnline;

    try {
      if (useCloud) {
        // --- Gemini Cloud ---
        if (!AiGemini.available()) {
          assistantMsg.content = '⚠️ No hay API key de Gemini configurada. Ve a Ajustes para agregar una.';
          updateAssistantUI(msgEl, assistantMsg, false);
          finishGeneration(msgEl, assistantMsg, msgIdx);
          return;
        }

        state.abortController = AiGemini.chat({
          model: state.currentModel,
          messages: state.messages.slice(0, -1), // exclude placeholder
          onChunk: (chunk) => {
            assistantMsg.content += chunk;
            updateAssistantUI(msgEl, assistantMsg, true);
          },
          onThinking: (chunk) => {
            assistantMsg.thinking += chunk;
            updateAssistantUI(msgEl, assistantMsg, true);
          },
          onDone: (fullText) => {
            assistantMsg.content = fullText || assistantMsg.content;
            finishGeneration(msgEl, assistantMsg, msgIdx);
          },
          onError: (err) => {
            console.error('Gemini error:', err);
            assistantMsg.content += `\n\n⚠️ **Error:** ${err.message}`;
            finishGeneration(msgEl, assistantMsg, msgIdx);
          }
        });

      } else {
        // --- Ollama Local ---
        state.abortController = new AbortController();

        const response = await fetch(`${state.ollamaEndpoint}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: state.currentModel,
            messages: state.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
            stream: true
          }),
          signal: state.abortController.signal
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Ollama respondió con error ${response.status}: ${errText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete JSON lines
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep incomplete last line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const data = JSON.parse(trimmed);
              if (data.message && data.message.content) {
                assistantMsg.content += data.message.content;
                updateAssistantUI(msgEl, assistantMsg, true);
              }
              if (data.done) break;
            } catch (parseErr) {
              // Partial JSON - skip silently
            }
          }
        }

        finishGeneration(msgEl, assistantMsg, msgIdx);
      }

    } catch (e) {
      if (e.name === 'AbortError') {
        // User stopped generation - finalize what we have
        if (assistantMsg.content) {
          finishGeneration(msgEl, assistantMsg, msgIdx);
        } else {
          msgEl.remove();
          state.messages.pop();
          resetGenerationUI();
        }
      } else {
        console.error('Generation error:', e);
        assistantMsg.content = assistantMsg.content || '';
        assistantMsg.content += `\n\n⚠️ **Error de conexión:** ${e.message}`;
        finishGeneration(msgEl, assistantMsg, msgIdx);
      }
    }
  }

  function updateAssistantUI(el, msg, isTyping) {
    let html = '';
    if (msg.thinking) {
      html += `<details class="thinking-block" open><summary>💭 Pensando...</summary><div class="thinking-content">${parseMarkdown(msg.thinking)}</div></details>`;
    }
    html += `<div class="message-content">${parseMarkdown(msg.content)}${isTyping ? '<span class="cursor"></span>' : ''}</div>`;
    el.innerHTML = html;
    scrollToBottom();
  }

  function resetGenerationUI() {
    state.isGenerating = false;
    state.abortController = null;
    els.sendBtn.style.display = 'flex';
    els.sendBtn.disabled = els.chatInput.value.length === 0;
    els.stopBtn.style.display = 'none';
  }

  async function finishGeneration(el, msg, idx) {
    // Replace the streaming element with the full rendered message (with action buttons)
    const finalEl = renderMessage(msg, idx);
    el.replaceWith(finalEl); // Use replaceWith instead of outerHTML assignment
    scrollToBottom();
    resetGenerationUI();

    // Persist to Firestore
    try {
      if (state.currentChatId && msg.content) {
        await AiMemory.addMessage(state.currentChatId, {
          role: msg.role,
          content: msg.content,
          thinking: msg.thinking || undefined
        });
      }
    } catch (e) {
      console.warn('Could not save assistant message:', e.message);
    }
  }

  // --- Event Listeners ---
  els.chatInput.addEventListener('input', autoResizeTextarea);

  els.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!els.sendBtn.disabled) sendMessage(els.chatInput.value);
    }
  });

  els.sendBtn.addEventListener('click', () => sendMessage(els.chatInput.value));

  els.stopBtn.addEventListener('click', () => {
    if (state.abortController) {
      state.abortController.abort();
    }
  });

  els.newChatBtn.addEventListener('click', startNewChat);

  els.promptCards.forEach(card => {
    card.addEventListener('click', () => sendMessage(card.dataset.prompt));
  });

  els.openSidebarBtn.addEventListener('click', () => els.sidebar.classList.add('open'));
  els.closeSidebarBtn.addEventListener('click', () => els.sidebar.classList.remove('open'));

  // Close sidebar when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        els.sidebar.classList.contains('open') &&
        !els.sidebar.contains(e.target) &&
        e.target !== els.openSidebarBtn) {
      els.sidebar.classList.remove('open');
    }
  });

  // Settings modal
  els.settingsBtn.addEventListener('click', () => {
    els.settingsModal.style.display = 'flex';
    // Pre-fill current values
    els.ollamaUrlInput.value = state.ollamaEndpoint;
    els.geminiKeyInput.value = AiGemini.getApiKey();
  });

  els.closeSettingsBtn.addEventListener('click', () => els.settingsModal.style.display = 'none');

  // Close modal on backdrop click
  els.settingsModal.addEventListener('click', (e) => {
    if (e.target === els.settingsModal) els.settingsModal.style.display = 'none';
  });

  els.toggleKeyVisBtn.addEventListener('click', () => {
    els.geminiKeyInput.type = els.geminiKeyInput.type === 'password' ? 'text' : 'password';
  });

  // Test Ollama connection button
  if (els.testOllamaBtn) {
    els.testOllamaBtn.addEventListener('click', async () => {
      const url = els.ollamaUrlInput.value.trim().replace(/\/$/, '');
      if (!url) return;
      els.testOllamaBtn.textContent = '...';
      try {
        const res = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          els.testOllamaBtn.textContent = '✅';
          state.ollamaEndpoint = url;
          updateConnectionStatus(true);
        } else {
          els.testOllamaBtn.textContent = '❌';
        }
      } catch (e) {
        els.testOllamaBtn.textContent = '❌';
      }
      setTimeout(() => els.testOllamaBtn.textContent = 'Probar', 2000);
    });
  }

  els.saveSettingsBtn.addEventListener('click', async () => {
    const newSettings = {
      ollamaEndpoint: els.ollamaUrlInput.value.trim().replace(/\/$/, ''),
      defaultModel: els.defaultModelSelect.value
    };

    if (els.geminiKeyInput.value.trim()) {
      AiGemini.setApiKey(els.geminiKeyInput.value.trim());
    }

    try {
      await AiMemory.saveSettings(newSettings);
    } catch (e) {
      console.warn('Could not save settings to Firestore:', e.message);
    }

    state.ollamaEndpoint = newSettings.ollamaEndpoint;
    state.currentModel = newSettings.defaultModel;
    els.modelSelect.value = state.currentModel;

    checkOllama(); // Re-check with new endpoint
    els.settingsModal.style.display = 'none';
  });

  els.clearChatsBtn.addEventListener('click', async () => {
    if (!confirm('¿Estás seguro de que deseas borrar TODAS las conversaciones? Esta acción no se puede deshacer.')) return;
    try {
      for (const chat of state.allChats) {
        await AiMemory.deleteChat(chat.id);
      }
      startNewChat();
    } catch (e) {
      console.error('Error clearing chats:', e);
    }
  });

  els.modelSelect.addEventListener('change', (e) => {
    state.currentModel = e.target.value;
    // Update connection status label if switching between local and cloud
    if (isCloudModel(state.currentModel)) {
      els.connectionStatus.className = 'status-badge cloud';
      els.connectionStatus.textContent = '☁️ Cloud';
    } else if (state.isOnline) {
      els.connectionStatus.className = 'status-badge local';
      els.connectionStatus.textContent = '🖥️ Local';
    }
  });

  els.logoutBtn.addEventListener('click', async () => {
    if (confirm('¿Cerrar sesión?')) {
      try {
        await firebase.auth().signOut();
      } catch (e) {
        window.location.href = '/';
      }
    }
  });

  // --- Search ---
  els.searchInput.addEventListener('input', () => renderChatList(state.allChats));

  // --- Paste image support ---
  document.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        // TODO: handle image paste
        break;
      }
    }
  });

  // --- Init ---
  async function init() {
    // Check if firebase is available
    if (typeof firebase === 'undefined' || !firebase.auth) {
      console.error('Firebase not loaded. Make sure firebase-config.js is loaded first.');
      els.loadingScreen.innerHTML = '<p style="color:red;padding:2rem">Error: Firebase no disponible. Verifica la configuración.</p>';
      return;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        // Not logged in - redirect to login
        window.location.href = '/?redirect=ai';
        return;
      }

      // Set user info in UI
      const displayName = user.displayName || user.email.split('@')[0];
      els.userName.textContent = displayName;
      els.userAvatar.textContent = displayName[0].toUpperCase();

      // Load settings from Firestore
      let userSettings = {};
      try {
        userSettings = await AiMemory.loadSettings();
      } catch (e) {
        console.warn('Could not load settings:', e.message);
      }

      state.settings = userSettings;
      state.ollamaEndpoint = userSettings.ollamaEndpoint || 'https://continually-dairy-aim-accompanying.trycloudflare.com';
      state.currentModel = userSettings.defaultModel || 'gemini-2.0-flash';

      // Pre-fill settings form
      els.ollamaUrlInput.value = state.ollamaEndpoint;
      els.geminiKeyInput.value = AiGemini.getApiKey();

      // Build model list with defaults
      updateModelList([]);

      // Try to connect to local server (non-blocking)
      checkOllama();

      // Re-check connection every 45 seconds
      setInterval(checkOllama, 45000);

      // Listen for realtime chat updates
      try {
        AiMemory.onChatsChanged(renderChatList);
      } catch (e) {
        console.warn('Could not set up realtime chat listener:', e.message);
      }

      // Show the app
      els.loadingScreen.style.display = 'none';
      els.app.style.display = 'grid';

      // Focus input
      setTimeout(() => els.chatInput.focus(), 100);
    });
  }

  // Use DOMContentLoaded but also wait for firebase-config.js to run
  // firebase-config.js is loaded before this script, so firebase global is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

})();
