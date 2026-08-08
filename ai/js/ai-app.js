/**
 * Futunet AI Hub - Main Application Logic
 */
(function() {
  'use strict';

  // --- State ---
  const state = {
    currentChatId: null,
    currentModel: 'gemma4:latest',
    isGenerating: false,
    isOnline: false,
    messages: [],
    abortController: null,
    ollamaEndpoint: '',
    settings: {}
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

  // --- Utils ---
  function parseMarkdown(text) {
    if (!text) return '';
    
    // Simple markdown parser
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    // Code blocks
    html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${code}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Lists
    html = html.replace(/^\s*\n\*/gm, '<ul>\n*');
    html = html.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n$2');
    html = html.replace(/^\*(.+)/gm, '<li>$1</li>');
    
    // Paragraphs
    html = html.split('\n\n').map(p => {
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<ul')) return p;
      return `<p>${p}</p>`;
    }).join('');
    
    return html;
  }

  function scrollToBottom() {
    els.messagesContainer.scrollTop = els.messagesContainer.scrollHeight;
  }

  function autoResizeTextarea() {
    els.chatInput.style.height = 'auto';
    els.chatInput.style.height = (els.chatInput.scrollHeight) + 'px';
    const textLen = els.chatInput.value.length;
    els.charCount.textContent = `${textLen} caracteres`;
    els.sendBtn.disabled = textLen === 0;
  }

  // --- UI Rendering ---
  function updateConnectionStatus(isOnline) {
    state.isOnline = isOnline;
    if (isOnline) {
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
    
    let contentHtml = '';
    
    if (msg.thinking) {
      contentHtml += `
        <details class="thinking-block">
          <summary>Proceso de pensamiento</summary>
          <div class="thinking-content">${parseMarkdown(msg.thinking)}</div>
        </details>
      `;
    }
    
    contentHtml += `<div class="message-content">${parseMarkdown(msg.content)}</div>`;
    
    if (!isUser) {
      contentHtml += `
        <div class="message-actions">
          <button class="icon-btn copy-btn" data-index="${index}" title="Copiar">📋</button>
          <button class="icon-btn regen-btn" data-index="${index}" title="Regenerar">🔄</button>
        </div>
      `;
    }
    
    msgDiv.innerHTML = contentHtml;
    
    // Setup copy btn
    const copyBtn = msgDiv.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.content);
        copyBtn.textContent = '✅';
        setTimeout(() => copyBtn.textContent = '📋', 2000);
      });
    }
    
    return msgDiv;
  }

  function renderChatList(chats) {
    els.chatList.innerHTML = '';
    const filter = els.searchInput.value.toLowerCase();
    
    const filteredChats = chats.filter(c => c.title.toLowerCase().includes(filter));
    
    if (filteredChats.length === 0) {
      els.chatList.innerHTML = '<div class="chat-item" style="pointer-events: none; opacity: 0.5;">No hay chats</div>';
      return;
    }
    
    filteredChats.forEach(chat => {
      const chatEl = document.createElement('div');
      chatEl.className = `chat-item ${chat.id === state.currentChatId ? 'active' : ''}`;
      chatEl.textContent = chat.title || 'Chat sin título';
      chatEl.addEventListener('click', () => loadChat(chat.id));
      els.chatList.appendChild(chatEl);
    });
  }

  // --- Logic ---
  async function checkOllama() {
    if (!state.ollamaEndpoint) {
      updateConnectionStatus(false);
      return false;
    }
    try {
      const res = await fetch(`${state.ollamaEndpoint}/api/tags`);
      const isOnline = res.ok;
      updateConnectionStatus(isOnline);
      if (isOnline) {
        const data = await res.json();
        updateModelList(data.models);
      }
      return isOnline;
    } catch (e) {
      updateConnectionStatus(false);
      return false;
    }
  }

  function updateModelList(ollamaModels = []) {
    els.modelSelect.innerHTML = '';
    els.defaultModelSelect.innerHTML = '';
    
    ollamaModels.forEach(m => {
      const opt = new Option(`${m.name} (Local)`, m.name);
      els.modelSelect.add(opt);
      els.defaultModelSelect.add(opt.cloneNode(true));
    });
    
    AiGemini.models().forEach(m => {
      const opt = new Option(m.displayName, m.name);
      els.modelSelect.add(opt);
      els.defaultModelSelect.add(opt.cloneNode(true));
    });
    
    els.modelSelect.value = state.currentModel;
  }

  async function loadChat(chatId) {
    els.welcomeScreen.style.display = 'none';
    const chat = await AiMemory.loadChat(chatId);
    if (!chat) return;
    
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
    
    scrollToBottom();
    
    if (window.innerWidth <= 768) {
      els.sidebar.classList.remove('open');
    }
  }

  function startNewChat() {
    state.currentChatId = null;
    state.messages = [];
    els.messagesList.innerHTML = '';
    els.welcomeScreen.style.display = 'block';
    if (window.innerWidth <= 768) {
      els.sidebar.classList.remove('open');
    }
  }

  async function sendMessage(text) {
    if (!text.trim() || state.isGenerating) return;
    
    els.chatInput.value = '';
    autoResizeTextarea();
    
    const userMsg = { role: 'user', content: text };
    state.messages.push(userMsg);
    
    els.welcomeScreen.style.display = 'none';
    els.messagesList.appendChild(renderMessage(userMsg, state.messages.length - 1));
    scrollToBottom();
    
    if (!state.currentChatId) {
      state.currentChatId = await AiMemory.createChat(state.currentModel);
      await AiMemory.renameChat(state.currentChatId, AiMemory.autoTitle(text));
    }
    
    await AiMemory.addMessage(state.currentChatId, userMsg);
    
    generateResponse();
  }

  async function generateResponse() {
    state.isGenerating = true;
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

    const isCloudModel = els.modelSelect.options[els.modelSelect.selectedIndex].text.includes('☁️');

    try {
      if (isCloudModel || !state.isOnline) {
        state.abortController = AiGemini.chat({
          model: state.currentModel,
          messages: state.messages.slice(0, -1),
          onChunk: (text) => {
            assistantMsg.content += text;
            updateAssistantUI(msgEl, assistantMsg, true);
          },
          onThinking: (text) => {
            assistantMsg.thinking += text;
            updateAssistantUI(msgEl, assistantMsg, true);
          },
          onDone: async (fullText) => {
            assistantMsg.content = fullText;
            finishGeneration(msgEl, assistantMsg, msgIdx);
          },
          onError: (err) => {
            console.error(err);
            assistantMsg.content += '\n\n**Error:** ' + err.message;
            finishGeneration(msgEl, assistantMsg, msgIdx);
          }
        });
      } else {
        // Ollama streaming implementation
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
        
        if (!response.ok) throw new Error('Ollama error');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(l => l.trim());
          
          for (const line of lines) {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
               assistantMsg.content += data.message.content;
               updateAssistantUI(msgEl, assistantMsg, true);
            }
          }
        }
        finishGeneration(msgEl, assistantMsg, msgIdx);
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        assistantMsg.content += '\n\n**Error de conexión.**';
        finishGeneration(msgEl, assistantMsg, msgIdx);
      }
    }
  }

  function updateAssistantUI(el, msg, isTyping) {
    let html = '';
    if (msg.thinking) {
      html += `<details class="thinking-block" open><summary>Pensando...</summary><div class="thinking-content">${parseMarkdown(msg.thinking)}</div></details>`;
    }
    html += `<div class="message-content">${parseMarkdown(msg.content)}${isTyping ? '<span class="cursor"></span>' : ''}</div>`;
    el.innerHTML = html;
    scrollToBottom();
  }

  async function finishGeneration(el, msg, idx) {
    state.isGenerating = false;
    els.sendBtn.style.display = 'flex';
    els.stopBtn.style.display = 'none';
    state.abortController = null;
    
    // Final render with actions
    el.outerHTML = renderMessage(msg, idx).outerHTML;
    scrollToBottom();
    
    if (state.currentChatId) {
      await AiMemory.addMessage(state.currentChatId, msg);
    }
  }

  // --- Events ---
  els.chatInput.addEventListener('input', autoResizeTextarea);
  
  els.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(els.chatInput.value);
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
    card.addEventListener('click', () => {
      sendMessage(card.dataset.prompt);
    });
  });

  els.openSidebarBtn.addEventListener('click', () => els.sidebar.classList.add('open'));
  els.closeSidebarBtn.addEventListener('click', () => els.sidebar.classList.remove('open'));

  // Settings
  els.settingsBtn.addEventListener('click', () => els.settingsModal.style.display = 'flex');
  els.closeSettingsBtn.addEventListener('click', () => els.settingsModal.style.display = 'none');
  
  els.toggleKeyVisBtn.addEventListener('click', () => {
    els.geminiKeyInput.type = els.geminiKeyInput.type === 'password' ? 'text' : 'password';
  });

  els.saveSettingsBtn.addEventListener('click', async () => {
    const newSettings = {
      ollamaEndpoint: els.ollamaUrlInput.value.replace(/\/$/, ''),
      defaultModel: els.defaultModelSelect.value
    };
    
    if (els.geminiKeyInput.value) {
      AiGemini.setApiKey(els.geminiKeyInput.value);
    }
    
    await AiMemory.saveSettings(newSettings);
    state.ollamaEndpoint = newSettings.ollamaEndpoint;
    state.currentModel = newSettings.defaultModel;
    els.modelSelect.value = state.currentModel;
    
    checkOllama();
    els.settingsModal.style.display = 'none';
  });

  els.modelSelect.addEventListener('change', (e) => {
    state.currentModel = e.target.value;
  });

  // --- Init ---
  async function init() {
    // Wait for auth
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = '/login.html?redirect=/ai/';
        return;
      }
      
      // In a real scenario, check claims for superadmin
      
      els.userName.textContent = user.displayName || user.email.split('@')[0];
      els.userAvatar.textContent = (user.displayName || user.email)[0].toUpperCase();
      
      // Load Settings
      const userSettings = await AiMemory.loadSettings();
      state.settings = userSettings;
      state.ollamaEndpoint = userSettings.ollamaEndpoint || 'http://localhost:11434';
      state.currentModel = userSettings.defaultModel || 'gemma4:latest';
      
      els.ollamaUrlInput.value = state.ollamaEndpoint;
      els.geminiKeyInput.value = AiGemini.getApiKey();
      
      updateModelList();
      checkOllama();
      setInterval(checkOllama, 30000);
      
      // Setup realtime chats
      AiMemory.onChatsChanged(renderChatList);
      
      els.loadingScreen.style.display = 'none';
      els.app.style.display = 'grid';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Basic fallback if firebase not loaded (dev mode)
    setTimeout(init, 500);
  });

})();
