/**
 * Futunet SuperAdmin AI Server & Web App Studio Logic
 * Handles Ollama LLM integration, ComfyUI studio, conversation history & memory,
 * inventory skill querying, live server health ping, and PWA installation.
 */
(function () {
  'use strict';

  var deferredPrompt = null;
  var isInitialized = false;

  // Pre-configured server endpoints from Antigravity / PC Super-Server
  var DEFAULT_CONFIG = {
    remoteUrl: 'https://continually-dairy-aim-accompanying.trycloudflare.com',
    ollamaUrl: 'http://localhost:11434',
    comfyUrl: 'http://localhost:8188',
    localWifiUrl: 'http://10.0.0.117:3000'
  };

  var config = Object.assign({}, DEFAULT_CONFIG);

  // Chat State
  var chatThreads = [];
  var activeThreadId = null;
  var selectedModel = 'llama3';
  var activeSkill = 'inventory'; // Default skill
  var isGenerating = false;

  // System Persona Definitions
  var PERSONAS = {
    inventory: 'Eres el Asistente de Inventario y Ventas de Futunet República Dominicana. Tu objetivo es ayudar al Administrador a redactar cotizaciones, verificar especificaciones y consultar productos.',
    copywriter: 'Eres un Copywriter Experto en Tecnología para Futunet. Creas descripciones persuasivas, títulos optimizados para SEO y publicaciones de marketing atractivas.',
    tech_support: 'Eres un Ingeniero de Soporte Técnico Senior en Futunet. Especialista en redes, fibra óptica, cámaras Hikvision/Dahua, servidores y equipos corporativos.',
    developer: 'Eres un Desarrollador Senior Full-Stack. Proporcionas código limpio en HTML, CSS, JavaScript, Python y automatizaciones para la plataforma Futunet.'
  };

  // Listen for PWA installation event
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById('ai-pwa-install-btn');
    if (btn) btn.style.display = 'inline-flex';
  });

  function init() {
    if (!FutunetAuth.isSuperAdmin()) {
      console.warn('Acceso denegado: Servidor IA es exclusivo para SuperAdmin.');
      return;
    }
    if (isInitialized) return;
    isInitialized = true;

    loadStoredConfig();
    loadChatHistory();
    setupEventListeners();
    checkAllServicesHealth();
    fetchOllamaModels();

    if (!activeThreadId) {
      createNewChat();
    }
  }

  function loadStoredConfig() {
    try {
      var saved = localStorage.getItem('futunet_ai_server_config');
      if (saved) {
        config = Object.assign({}, DEFAULT_CONFIG, JSON.parse(saved));
      }
    } catch (e) { }
    
    // Fill config UI fields if present
    var inputRemote = document.getElementById('ai-config-remote');
    var inputOllama = document.getElementById('ai-config-ollama');
    var inputComfy = document.getElementById('ai-config-comfy');

    if (inputRemote) inputRemote.value = config.remoteUrl;
    if (inputOllama) inputOllama.value = config.ollamaUrl;
    if (inputComfy) inputComfy.value = config.comfyUrl;
  }

  function saveConfig() {
    var inputRemote = document.getElementById('ai-config-remote');
    var inputOllama = document.getElementById('ai-config-ollama');
    var inputComfy = document.getElementById('ai-config-comfy');

    if (inputRemote) config.remoteUrl = inputRemote.value.trim();
    if (inputOllama) config.ollamaUrl = inputOllama.value.trim();
    if (inputComfy) config.comfyUrl = inputComfy.value.trim();

    try {
      localStorage.setItem('futunet_ai_server_config', JSON.stringify(config));
      showToast('Configuración del Servidor IA guardada', 'success');
      checkAllServicesHealth();
      fetchOllamaModels();
    } catch (e) {
      showToast('Error al guardar la configuración', 'error');
    }
  }

  // ─── Health Checks ───
  async function checkService(url, timeoutMs) {
    try {
      var controller = new AbortController();
      var id = setTimeout(function () { controller.abort(); }, timeoutMs || 3000);
      var response = await fetch(url, { mode: 'no-cors', signal: controller.signal });
      clearTimeout(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function checkAllServicesHealth() {
    var statusOllama = document.getElementById('ai-status-ollama');
    var statusComfy = document.getElementById('ai-status-comfy');
    var statusRemote = document.getElementById('ai-status-remote');

    // Check Ollama
    var isOllamaOk = await checkService(config.ollamaUrl + '/api/tags', 2500);
    if (!isOllamaOk) isOllamaOk = await checkService(config.remoteUrl, 2500);

    if (statusOllama) {
      statusOllama.className = 'ai-dot-indicator ' + (isOllamaOk ? 'active' : 'error');
    }

    // Check ComfyUI
    var isComfyOk = await checkService(config.comfyUrl, 2500);
    if (statusComfy) {
      statusComfy.className = 'ai-dot-indicator ' + (isComfyOk ? 'active' : 'error');
    }

    // Check Remote HTTPS
    var isRemoteOk = await checkService(config.remoteUrl, 2500);
    if (statusRemote) {
      statusRemote.className = 'ai-dot-indicator ' + (isRemoteOk ? 'active' : 'error');
    }

    var liveChip = document.getElementById('ai-live-badge');
    if (liveChip) {
      liveChip.textContent = (isOllamaOk || isComfyOk) ? 'CONECTADO' : 'OFFLINE (Verificar Tunnel)';
      liveChip.style.color = (isOllamaOk || isComfyOk) ? '#10b981' : '#ef4444';
    }
  }

  // ─── Fetch Models from Ollama ───
  async function fetchOllamaModels() {
    var select = document.getElementById('ai-model-select');
    if (!select) return;

    try {
      var response = await fetch(config.ollamaUrl + '/api/tags');
      if (response.ok) {
        var data = await response.json();
        if (data.models && data.models.length > 0) {
          select.innerHTML = '';
          data.models.forEach(function (m) {
            var opt = document.createElement('option');
            opt.value = m.name;
            opt.textContent = m.name + ' (' + (Math.round((m.size / (1024 * 1024 * 1024)) * 10) / 10) + ' GB)';
            select.appendChild(opt);
          });
          selectedModel = data.models[0].name;
          return;
        }
      }
    } catch (e) {
      console.warn('Ollama direct API tag check failed, falling back to defaults');
    }

    // Fallback default options
    select.innerHTML =
      '<option value="llama3">Llama 3 (Servidor Local)</option>' +
      '<option value="mistral">Mistral 7B (Servidor Local)</option>' +
      '<option value="deepseek-r1">DeepSeek-R1 (Servidor Local)</option>' +
      '<option value="qwen2.5">Qwen 2.5 (Servidor Local)</option>';
  }

  // ─── Chat History & Persistence ───
  function loadChatHistory() {
    try {
      var stored = localStorage.getItem('futunet_ai_chats');
      if (stored) {
        chatThreads = JSON.parse(stored);
      }
    } catch (e) {
      chatThreads = [];
    }
    renderChatThreadsList();
  }

  function saveChatHistory() {
    try {
      localStorage.setItem('futunet_ai_chats', JSON.stringify(chatThreads));
    } catch (e) { }

    // Also sync to Firestore if user doc is active
    if (window.FutunetFirebase && window.FutunetFirebase.db && FutunetAuth.getCurrentUser()) {
      var uid = FutunetAuth.getCurrentUser().uid;
      window.FutunetFirebase.db.collection('users').doc(uid).collection('ai_threads').doc('history').set({
        threads: chatThreads,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function (err) {
        console.warn('Error syncing AI chat threads to Firestore:', err);
      });
    }
  }

  function createNewChat() {
    var threadId = 'chat_' + Date.now();
    var newThread = {
      id: threadId,
      title: 'Nueva Conversación',
      createdAt: new Date().toISOString(),
      messages: []
    };
    chatThreads.unshift(newThread);
    activeThreadId = threadId;
    saveChatHistory();
    renderChatThreadsList();
    renderActiveThreadMessages();
  }

  function switchThread(threadId) {
    activeThreadId = threadId;
    renderChatThreadsList();
    renderActiveThreadMessages();
  }

  function deleteThread(threadId, e) {
    if (e) e.stopPropagation();
    chatThreads = chatThreads.filter(function (t) { return t.id !== threadId; });
    if (activeThreadId === threadId) {
      activeThreadId = chatThreads.length ? chatThreads[0].id : null;
    }
    saveChatHistory();
    if (!activeThreadId) createNewChat();
    else {
      renderChatThreadsList();
      renderActiveThreadMessages();
    }
  }

  function getActiveThread() {
    return chatThreads.find(function (t) { return t.id === activeThreadId; });
  }

  function renderChatThreadsList() {
    var container = document.getElementById('ai-chats-list');
    if (!container) return;

    if (chatThreads.length === 0) {
      container.innerHTML = '<div style="color:rgba(255,255,255,0.3); font-size:0.8rem; text-align:center; padding:12px;">Sin conversaciones</div>';
      return;
    }

    container.innerHTML = '';
    chatThreads.forEach(function (thread) {
      var item = document.createElement('div');
      item.className = 'ai-chat-item' + (thread.id === activeThreadId ? ' is-active' : '');
      item.onclick = function () { switchThread(thread.id); };

      item.innerHTML =
        '<div class="ai-chat-title-text">' + escapeHtml(thread.title) + '</div>' +
        '<button class="ai-chat-del-btn" title="Eliminar conversación"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>';

      var delBtn = item.querySelector('.ai-chat-del-btn');
      if (delBtn) {
        delBtn.onclick = function (e) { deleteThread(thread.id, e); };
      }
      container.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function renderActiveThreadMessages() {
    var container = document.getElementById('ai-chat-messages');
    if (!container) return;

    var thread = getActiveThread();
    if (!thread || !thread.messages || thread.messages.length === 0) {
      container.innerHTML =
        '<div style="text-align:center; margin: auto 0; color:#64748b;">' +
        '  <div style="font-size: 2.2rem; margin-bottom:10px;">🤖</div>' +
        '  <div style="font-weight:700; color:#fff; font-size:1.1rem; margin-bottom:6px;">Servidor IA Futunet Listo</div>' +
        '  <div style="font-size:0.88rem; max-width:380px; margin:0 auto; line-height:1.5;">Escribe tu pregunta o selecciona una Skill. El servidor mantendrá el contexto de tu conversación.</div>' +
        '</div>';
      return;
    }

    container.innerHTML = '';
    thread.messages.forEach(function (msg) {
      appendMessageToUI(msg.role, msg.content, false);
    });

    container.scrollTop = container.scrollHeight;
  }

  function appendMessageToUI(role, content, animate) {
    var container = document.getElementById('ai-chat-messages');
    if (!container) return;

    var row = document.createElement('div');
    row.className = 'ai-msg-row ' + role;

    var avatar = document.createElement('div');
    avatar.className = 'ai-msg-avatar';
    avatar.textContent = role === 'user' ? 'TÚ' : 'IA';

    var bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = formatMarkdown(content);

    row.appendChild(avatar);
    row.appendChild(bubble);
    container.appendChild(row);

    container.scrollTop = container.scrollHeight;
  }

  // ─── Futunet Inventory Skill Engine ───
  async function fetchInventoryContext(userPrompt) {
    if (activeSkill !== 'inventory') return '';
    try {
      if (window.FutunetFirebase && window.FutunetFirebase.db) {
        var db = window.FutunetFirebase.db;
        var snapshot = await db.collection('products').limit(15).get();
        if (!snapshot.empty) {
          var productsInfo = [];
          snapshot.forEach(function (doc) {
            var data = doc.data();
            productsInfo.push('- ' + (data.name || 'Producto') + ' | Precio: RD$' + (data.price || 0) + ' | Stock: ' + (data.stock || 0) + ' | Cat: ' + (data.category || 'Gral'));
          });
          return '\n[CONTEXTO DE INVENTARIO EN VIVO DE FUTUNET]:\n' + productsInfo.join('\n') + '\n';
        }
      }
    } catch (e) {
      console.warn('Skill inventario fetch error:', e);
    }
    return '';
  }

  // ─── Send Message to Ollama ───
  async function sendMessage() {
    var textarea = document.getElementById('ai-chat-input');
    if (!textarea || isGenerating) return;

    var text = textarea.value.trim();
    if (!text) return;

    textarea.value = '';
    isGenerating = true;

    var thread = getActiveThread();
    if (!thread) {
      createNewChat();
      thread = getActiveThread();
    }

    // Auto update title on first message
    if (thread.messages.length === 0) {
      thread.title = text.length > 25 ? text.substring(0, 25) + '...' : text;
      renderChatThreadsList();
    }

    // Append user message
    thread.messages.push({ role: 'user', content: text });
    appendMessageToUI('user', text, true);
    saveChatHistory();

    // Prepare system prompt & memory history
    var inventoryContext = await fetchInventoryContext(text);
    var systemPrompt = (PERSONAS[activeSkill] || PERSONAS.inventory) + inventoryContext;

    // Show assistant placeholder/thinking
    var container = document.getElementById('ai-chat-messages');
    var row = document.createElement('div');
    row.className = 'ai-msg-row assistant';
    row.innerHTML =
      '<div class="ai-msg-avatar">IA</div>' +
      '<div class="ai-msg-bubble" id="ai-current-thinking"><span style="opacity:0.7;">Procesando en supercomputadora...</span></div>';
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;

    var targetUrl = config.ollamaUrl + '/api/generate';

    try {
      var requestBody = {
        model: selectedModel,
        prompt: systemPrompt + '\n\n' + thread.messages.map(m => (m.role === 'user' ? 'Usuario: ' : 'IA: ') + m.content).join('\n') + '\nIA:',
        stream: false
      };

      var response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        // Fallback to Cloudflare Remote Tunnel if local fails
        var fallbackUrl = config.remoteUrl + '/api/generate';
        response = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      }

      if (response.ok) {
        var data = await response.json();
        var reply = data.response || 'No se recibió respuesta del modelo.';

        thread.messages.push({ role: 'assistant', content: reply });
        saveChatHistory();

        var bubble = document.getElementById('ai-current-thinking');
        if (bubble) {
          bubble.removeAttribute('id');
          bubble.innerHTML = formatMarkdown(reply);
        }
      } else {
        throw new Error('Servidor devolvió error ' + response.status);
      }
    } catch (err) {
      var bubble = document.getElementById('ai-current-thinking');
      if (bubble) {
        bubble.removeAttribute('id');
        bubble.innerHTML = '<span style="color:#ef4444;">⚠️ Error de conexión con el Servidor IA. Verifica que Ollama/Tunnel esté activo. (' + escapeHtml(err.message) + ')</span>';
      }
    } finally {
      isGenerating = false;
      container.scrollTop = container.scrollHeight;
    }
  }

  // ─── ComfyUI Image Generator ───
  async function generateComfyImage() {
    var promptInput = document.getElementById('comfy-prompt-input');
    var previewBox = document.getElementById('comfy-preview-box');
    var btn = document.getElementById('comfy-generate-btn');

    if (!promptInput || !promptInput.value.trim() || !previewBox) return;

    var promptText = promptInput.value.trim();
    if (btn) btn.disabled = true;

    previewBox.innerHTML = '<div style="color:#00d2ff;">🎨 Generando arte con ComfyUI... Por favor espera.</div>';

    try {
      var response = await fetch(config.comfyUrl + '/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: {
            "3": {
              "inputs": {
                "seed": Math.floor(Math.random() * 1000000),
                "steps": 20,
                "cfg": 8,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0]
              },
              "class_type": "KSampler"
            }
          }
        })
      });

      if (response.ok) {
        previewBox.innerHTML = '<div style="color:#10b981;">✅ Trabajo enviado exitosamente a ComfyUI. Revisa la consola o activa el Iframe del estudio.</div>';
      } else {
        throw new Error('ComfyUI no respondió correctamente.');
      }
    } catch (e) {
      previewBox.innerHTML = '<div style="color:#ef4444; padding:16px; text-align:center;">⚠️ Conexión directa a ComfyUI en ' + config.comfyUrl + ' falló. Usa la solapa de Monitoreo o abre el enlace en vivo.</div>';
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // ─── PWA Installation Trigger ───
  async function installPwaApp() {
    if (!deferredPrompt) {
      showToast('Abre las opciones del navegador y selecciona "Añadir a la pantalla de inicio" o "Instalar aplicación".', 'info');
      return;
    }
    deferredPrompt.prompt();
    var choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      showToast('¡Web App IA Instalada con éxito en tu equipo!', 'success');
    }
    deferredPrompt = null;
  }

  // ─── Helper Utilities ───
  function formatMarkdown(text) {
    if (!text) return '';
    var escaped = escapeHtml(text);
    return escaped
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupEventListeners() {
    // Tab switching inside AI view
    document.querySelectorAll('.ai-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.getAttribute('data-ai-tab');
        document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.ai-view-pane').forEach(p => p.classList.remove('is-active'));

        this.classList.add('is-active');
        var pane = document.getElementById('ai-pane-' + target);
        if (pane) pane.classList.add('is-active');
      });
    });

    // Skill chip selector
    document.querySelectorAll('.ai-skill-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.ai-skill-chip').forEach(c => c.classList.remove('is-active'));
        this.classList.add('is-active');
        activeSkill = this.getAttribute('data-skill');
        showToast('Skill activa: ' + this.textContent.trim(), 'info');
      });
    });

    // Send button & enter key
    var sendBtn = document.getElementById('ai-send-btn');
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    var textarea = document.getElementById('ai-chat-input');
    if (textarea) {
      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    // New chat button
    var newChatBtn = document.getElementById('ai-new-chat-btn');
    if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);

    // Config save button
    var saveConfigBtn = document.getElementById('ai-save-config-btn');
    if (saveConfigBtn) saveConfigBtn.addEventListener('click', saveConfig);

    // Refresh status button
    var pingBtn = document.getElementById('ai-ping-btn');
    if (pingBtn) pingBtn.addEventListener('click', checkAllServicesHealth);

    // Model select change
    var modelSelect = document.getElementById('ai-model-select');
    if (modelSelect) {
      modelSelect.addEventListener('change', function () {
        selectedModel = this.value;
      });
    }

    // PWA Install Button
    var pwaBtn = document.getElementById('ai-pwa-install-btn');
    if (pwaBtn) pwaBtn.addEventListener('click', installPwaApp);

    // Comfy generate button
    var comfyBtn = document.getElementById('comfy-generate-btn');
    if (comfyBtn) comfyBtn.addEventListener('click', generateComfyImage);
  }

  // Public API
  window.AdminAIServer = {
    init: init,
    checkAllServicesHealth: checkAllServicesHealth,
    installPwaApp: installPwaApp
  };
})();
