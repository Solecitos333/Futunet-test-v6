/**
 * Futunet SuperAdmin AI Server & Web App Studio Logic v2.1
 * Fixed: CORS errors, expired tunnel URL, added Gemini fallback,
 * streaming support, improved error handling.
 */
(function () {
  'use strict';

  var deferredPrompt = null;
  var isInitialized = false;
  var unsubscribeChats = null;

  var LIVE_TUNNEL_URL = 'https://continually-dairy-aim-accompanying.trycloudflare.com';

  var DEFAULT_CONFIG = {
    remoteUrl: LIVE_TUNNEL_URL,
    proxyUrl: LIVE_TUNNEL_URL,
    ollamaUrl: 'http://localhost:11434',
    comfyUrl: 'http://localhost:8188'
  };

  var config = Object.assign({}, DEFAULT_CONFIG);
  var activeProxyUrl = ''; // Will be determined by connectivity check

  // ─── Gemini Fallback (uses same key as ai/js/ai-gemini.js) ───
  var GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
  var GEMINI_KEY_B64  = 'QVEuQWI4Uk42SW16UXU2MlNrdmROOXdiOTFUaUlmTnVzSEpyMXBablZOWEZfS0Z3NWVNN1E=';

  function getGeminiKey() {
    return localStorage.getItem('futunet_gemini_key') ||
           (typeof atob === 'function' ? atob(GEMINI_KEY_B64) : '');
  }

  // Chat State
  var chatThreads = [];
  var activeThreadId = null;
  var selectedModel = 'gemma4:latest';
  var activeSkill = 'inventory';
  var isGenerating = false;
  var abortController = null;

  // System Personas
  var PERSONAS = {
    inventory: 'Eres el Asistente de Inventario y Ventas de Futunet República Dominicana. Tu objetivo es ayudar al Administrador a redactar cotizaciones, verificar especificaciones y consultar productos. Responde siempre en español.',
    copywriter: 'Eres un Copywriter Experto en Tecnología para Futunet. Creas descripciones persuasivas, títulos optimizados para SEO y publicaciones de marketing atractivas. Responde siempre en español.',
    tech_support: 'Eres un Ingeniero de Soporte Técnico Senior en Futunet. Especialista en redes, fibra óptica, cámaras Hikvision/Dahua, servidores y equipos corporativos. Responde siempre en español.',
    developer: 'Eres un Desarrollador Senior Full-Stack. Proporcionas código limpio en HTML, CSS, JavaScript, Python y automatizaciones para la plataforma Futunet. Responde siempre en español.'
  };

  // PWA event
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById('ai-pwa-install-btn');
    if (btn) btn.style.display = 'inline-flex';
  });

  // ─── Init ───
  function init() {
    if (isInitialized) {
      // Re-render in case DOM was reset
      renderChatThreadsList();
      renderActiveThreadMessages();
      loadStoredConfig();
      return;
    }
    isInitialized = true;

    loadStoredConfig();
    loadChatHistory();
    setupEventListeners();

    // Find a working proxy endpoint
    discoverProxy().then(function(url) {
      activeProxyUrl = url;
      checkAllServicesHealth();
      if (url) {
        fetchOllamaModels(url);
      } else {
        updateModelListGeminiOnly();
      }
    });

    if (!activeThreadId || chatThreads.length === 0) {
      createNewChat();
    } else {
      renderChatThreadsList();
      renderActiveThreadMessages();
    }
  }

  // ─── Proxy Discovery ───
  async function discoverProxy() {
    var candidates = [
      config.remoteUrl,
      config.proxyUrl,
      LIVE_TUNNEL_URL,
      'http://10.0.0.117:3000',
      'http://localhost:3000'
    ].filter(Boolean);

    var unique = candidates.filter(function(v, i, a) { return a.indexOf(v) === i; });

    for (var i = 0; i < unique.length; i++) {
      var ep = unique[i];
      try {
        var ctrl = new AbortController();
        var tid = setTimeout(function() { ctrl.abort(); }, 4000);
        var res = await fetch(ep + '/api/health', { signal: ctrl.signal });
        clearTimeout(tid);
        if (res.ok) {
          console.log('[AI Admin] Proxy found at:', ep);
          updateStatusIndicator('remote', true);
          return ep;
        }
      } catch(e) { /* try next */ }
    }

    console.warn('[AI Admin] No proxy found, will use Gemini only.');
    updateStatusIndicator('remote', false);
    return '';
  }

  // ─── Config ───
  function loadStoredConfig() {
    try {
      var saved = localStorage.getItem('futunet_ai_server_config');
      if (saved) config = Object.assign({}, DEFAULT_CONFIG, JSON.parse(saved));
    } catch (e) {}

    var inputRemote = document.getElementById('ai-config-remote');
    var inputOllama = document.getElementById('ai-config-ollama');
    var inputComfy  = document.getElementById('ai-config-comfy');
    if (inputRemote) inputRemote.value = config.remoteUrl || config.proxyUrl || '';
    if (inputOllama) inputOllama.value = config.ollamaUrl || '';
    if (inputComfy)  inputComfy.value  = config.comfyUrl  || '';
  }

  function saveConfig() {
    var inputRemote = document.getElementById('ai-config-remote');
    var inputOllama = document.getElementById('ai-config-ollama');
    var inputComfy  = document.getElementById('ai-config-comfy');

    if (inputRemote) config.remoteUrl = inputRemote.value.trim().replace(/\/$/, '');
    if (inputOllama) config.ollamaUrl = inputOllama.value.trim().replace(/\/$/, '');
    if (inputComfy)  config.comfyUrl  = inputComfy.value.trim().replace(/\/$/, '');

    // The proxy URL can be the remote URL if it's our Node proxy
    if (config.remoteUrl) config.proxyUrl = config.remoteUrl;

    try {
      localStorage.setItem('futunet_ai_server_config', JSON.stringify(config));
      showAdminToast('Configuración guardada', 'success');
      discoverProxy().then(function(url) {
        activeProxyUrl = url;
        checkAllServicesHealth();
        if (url) fetchOllamaModels(url);
      });
    } catch (e) {
      showAdminToast('Error al guardar configuración', 'error');
    }
  }

  // ─── Health Checks ───
  function updateStatusIndicator(type, isOk) {
    var map = { ollama: 'ai-status-ollama', comfy: 'ai-status-comfy', remote: 'ai-status-remote' };
    var el = document.getElementById(map[type]);
    if (el) el.className = 'ai-dot-indicator ' + (isOk ? 'active' : 'error');
  }

  async function checkService(url, ms) {
    try {
      var ctrl = new AbortController();
      var tid = setTimeout(function() { ctrl.abort(); }, ms || 3000);
      await fetch(url, { mode: 'no-cors', signal: ctrl.signal });
      clearTimeout(tid);
      return true;
    } catch(e) { return false; }
  }

  async function checkAllServicesHealth() {
    // Check proxy (our Node server)
    var proxyOk = activeProxyUrl ? true : false;
    if (!proxyOk) {
      var newProxy = await discoverProxy();
      if (newProxy) { activeProxyUrl = newProxy; proxyOk = true; }
    }

    updateStatusIndicator('remote', proxyOk);

    // Check Ollama (only works if admin runs on same PC)
    var ollamaOk = await checkService(config.ollamaUrl + '/api/tags', 2000);
    updateStatusIndicator('ollama', ollamaOk || proxyOk);

    // Check ComfyUI
    var comfyOk = await checkService(config.comfyUrl, 2000);
    updateStatusIndicator('comfy', comfyOk);

    var badge = document.getElementById('ai-live-badge');
    if (badge) {
      var isLive = proxyOk || ollamaOk;
      badge.textContent = isLive ? 'CONECTADO' : (getGeminiKey() ? 'GEMINI CLOUD' : 'OFFLINE');
      badge.style.color  = isLive ? '#10b981' : (getGeminiKey() ? '#f59e0b' : '#ef4444');
    }
  }

  // ─── Fetch Ollama Models via Proxy ───
  async function fetchOllamaModels(proxyUrl) {
    var select = document.getElementById('ai-model-select');
    if (!select) return;

    try {
      var ctrl = new AbortController();
      setTimeout(function() { ctrl.abort(); }, 5000);
      var res = await fetch((proxyUrl || activeProxyUrl) + '/api/models', { signal: ctrl.signal });
      if (res.ok) {
        var data = await res.json();
        var models = data.models || [];
        if (models.length > 0) {
          select.innerHTML = '';

          // Local Ollama models
          var localGrp = document.createElement('optgroup');
          localGrp.label = '🖥️ Local (Ollama)';
          models.forEach(function(m) {
            var size = m.size ? ' (' + (Math.round(m.size / (1024*1024*1024) * 10) / 10) + ' GB)' : '';
            var opt = new Option(m.name + size, m.name);
            localGrp.appendChild(opt);
          });
          select.appendChild(localGrp);

          selectedModel = models[0].name;
          addGeminiOptions(select);
          return;
        }
      }
    } catch(e) {
      console.warn('[AI Admin] Could not fetch models from proxy:', e.message);
    }

    updateModelListGeminiOnly();
  }

  function addGeminiOptions(select) {
    var cloudGrp = document.createElement('optgroup');
    cloudGrp.label = '☁️ Cloud (Gemini)';
    [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro' }
    ].forEach(function(m) {
      cloudGrp.appendChild(new Option(m.label, m.value));
    });
    select.appendChild(cloudGrp);
  }

  function updateModelListGeminiOnly() {
    var select = document.getElementById('ai-model-select');
    if (!select) return;
    select.innerHTML = '';
    addGeminiOptions(select);
    selectedModel = 'gemini-2.0-flash';
    if (select.options.length > 0) select.value = selectedModel;
  }

  // ─── Chat History ───
  function loadChatHistory() {
    try {
      var stored = localStorage.getItem('futunet_ai_chats');
      if (stored) chatThreads = JSON.parse(stored);
    } catch(e) { chatThreads = []; }
    renderChatThreadsList();
  }

  function saveChatHistory() {
    try { localStorage.setItem('futunet_ai_chats', JSON.stringify(chatThreads)); } catch(e) {}
  }

  function createNewChat() {
    var id = 'chat_' + Date.now();
    chatThreads.unshift({ id: id, title: 'Nueva Conversación', createdAt: new Date().toISOString(), messages: [] });
    activeThreadId = id;
    saveChatHistory();
    renderChatThreadsList();
    renderActiveThreadMessages();
  }

  function switchThread(id) {
    activeThreadId = id;
    renderChatThreadsList();
    renderActiveThreadMessages();
  }

  function deleteThread(id, e) {
    if (e) e.stopPropagation();
    if (!confirm('¿Eliminar esta conversación?')) return;
    chatThreads = chatThreads.filter(function(t) { return t.id !== id; });
    if (activeThreadId === id) activeThreadId = chatThreads.length ? chatThreads[0].id : null;
    saveChatHistory();
    if (!activeThreadId) createNewChat();
    else { renderChatThreadsList(); renderActiveThreadMessages(); }
  }

  function getActiveThread() {
    return chatThreads.find(function(t) { return t.id === activeThreadId; });
  }

  function renderChatThreadsList() {
    var container = document.getElementById('ai-chats-list');
    if (!container) return;

    if (chatThreads.length === 0) {
      container.innerHTML = '<div style="color:rgba(255,255,255,0.3);font-size:0.8rem;text-align:center;padding:12px;">Sin conversaciones</div>';
      return;
    }

    container.innerHTML = '';
    chatThreads.forEach(function(thread) {
      var item = document.createElement('div');
      item.className = 'ai-chat-item' + (thread.id === activeThreadId ? ' is-active' : '');

      item.innerHTML =
        '<div class="ai-chat-title-text">' + escapeHtml(thread.title) + '</div>' +
        '<button class="ai-chat-del-btn" title="Eliminar">🗑️</button>';

      item.querySelector('.ai-chat-title-text').onclick = function() { switchThread(thread.id); };
      item.querySelector('.ai-chat-del-btn').onclick = function(e) { deleteThread(thread.id, e); };

      container.appendChild(item);
    });
  }

  function renderActiveThreadMessages() {
    var container = document.getElementById('ai-chat-messages');
    if (!container) return;

    var thread = getActiveThread();
    if (!thread || thread.messages.length === 0) {
      container.innerHTML =
        '<div style="text-align:center;margin:auto;color:#64748b;">' +
        '<div style="font-size:2.5rem;margin-bottom:12px;">🤖</div>' +
        '<div style="font-weight:700;color:#fff;font-size:1.1rem;margin-bottom:8px;">Futunet AI Listo</div>' +
        '<div style="font-size:0.88rem;max-width:380px;margin:0 auto;line-height:1.6;color:#94a3b8;">Escribe tu pregunta o selecciona una Skill. La IA mantiene el contexto de la conversación.</div>' +
        '</div>';
      return;
    }

    container.innerHTML = '';
    thread.messages.forEach(function(msg) {
      if (msg.role !== 'system') appendMessageToUI(msg.role, msg.content, false);
    });
    container.scrollTop = container.scrollHeight;
  }

  function appendMessageToUI(role, content, animate) {
    var container = document.getElementById('ai-chat-messages');
    if (!container) return null;

    // Clear welcome screen if present
    if (container.querySelector('[style*="margin:auto"]')) container.innerHTML = '';

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

    return bubble;
  }

  // ─── Inventory Skill Context ───
  async function fetchInventoryContext() {
    if (activeSkill !== 'inventory') return '';
    try {
      if (window.FutunetFirebase && window.FutunetFirebase.db) {
        var snapshot = await window.FutunetFirebase.db.collection('products').limit(20).get();
        if (!snapshot.empty) {
          var rows = [];
          snapshot.forEach(function(doc) {
            var d = doc.data();
            rows.push('- ' + (d.name||'Producto') + ' | Precio: RD$' + (d.price||0) + ' | Stock: ' + (d.stock||0) + ' | Cat: ' + (d.category||'Gral'));
          });
          return '\n\n[INVENTARIO EN VIVO DE FUTUNET]:\n' + rows.join('\n') + '\n\n';
        }
      }
    } catch(e) { console.warn('Inventory fetch error:', e); }
    return '';
  }

  // ─── Send Message ───
  async function sendMessage() {
    var textarea = document.getElementById('ai-chat-input');
    if (!textarea || isGenerating) return;

    var text = textarea.value.trim();
    if (!text) return;

    textarea.value = '';
    textarea.style.height = 'auto';
    isGenerating = true;
    setSendBtnState(true);

    var thread = getActiveThread();
    if (!thread) { createNewChat(); thread = getActiveThread(); }

    // Auto-title
    if (thread.messages.filter(function(m){ return m.role==='user'; }).length === 0) {
      thread.title = text.length > 30 ? text.substring(0, 30) + '…' : text;
      renderChatThreadsList();
    }

    thread.messages.push({ role: 'user', content: text });
    appendMessageToUI('user', text, true);
    saveChatHistory();

    // Build system prompt
    var inventoryCtx = await fetchInventoryContext();
    var systemPrompt = (PERSONAS[activeSkill] || PERSONAS.inventory) + inventoryCtx;

    // Show typing indicator
    var container = document.getElementById('ai-chat-messages');
    var thinkingRow = document.createElement('div');
    thinkingRow.className = 'ai-msg-row assistant';
    thinkingRow.innerHTML =
      '<div class="ai-msg-avatar">IA</div>' +
      '<div class="ai-msg-bubble ai-thinking-bubble"><span></span><span></span><span></span></div>';
    container.appendChild(thinkingRow);
    container.scrollTop = container.scrollHeight;

    var replyText = '';

    try {
      var isGeminiModel = selectedModel.startsWith('gemini-');

      if (isGeminiModel || !activeProxyUrl) {
        // ── Gemini API ──
        replyText = await callGemini(systemPrompt, thread.messages, thinkingRow);
      } else {
        // ── Ollama via Proxy ──
        replyText = await callOllamaProxy(systemPrompt, thread.messages, thinkingRow);
      }

      thread.messages.push({ role: 'assistant', content: replyText });
      saveChatHistory();

    } catch(err) {
      if (err.name === 'AbortError') {
        if (replyText) thread.messages.push({ role: 'assistant', content: replyText });
        else thinkingRow.remove();
      } else {
        console.error('[AI Admin] Error:', err);
        thinkingRow.querySelector('.ai-msg-bubble').innerHTML =
          '<span style="color:#ef4444;">⚠️ Error: ' + escapeHtml(err.message) + '</span>';
      }
      saveChatHistory();
    } finally {
      isGenerating = false;
      abortController = null;
      setSendBtnState(false);
      container.scrollTop = container.scrollHeight;
    }
  }

  // ─── Ollama via Proxy (streaming) ───
  async function callOllamaProxy(systemPrompt, messages, thinkingRow) {
    abortController = new AbortController();
    var bubble = thinkingRow.querySelector('.ai-msg-bubble');

    var ollamamsgs = [{ role: 'system', content: systemPrompt }].concat(
      messages.slice(-10).map(function(m) {
        return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content };
      })
    );

    // Get Firebase token for proxy auth
    var token = '';
    try {
      var user = firebase.auth().currentUser;
      if (user) token = await user.getIdToken();
    } catch(e) {}

    var res = await fetch(activeProxyUrl + '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : ''
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: ollamamsgs,
        stream: true
      }),
      signal: abortController.signal
    });

    if (!res.ok) {
      var errText = await res.text();
      throw new Error('Proxy error ' + res.status + ': ' + errText);
    }

    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var fullText = '';
    var buffer = '';
    bubble.innerHTML = '';

    while (true) {
      var read = await reader.read();
      if (read.done) break;
      buffer += decoder.decode(read.value, { stream: true });
      var lines = buffer.split('\n');
      buffer = lines.pop();

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        try {
          var data = JSON.parse(line);
          if (data.message && data.message.content) {
            fullText += data.message.content;
            bubble.innerHTML = formatMarkdown(fullText) + '<span class="ai-stream-cursor"></span>';
            thinkingRow.parentElement && (thinkingRow.parentElement.scrollTop = thinkingRow.parentElement.scrollHeight);
          }
        } catch(e) { /* partial JSON */ }
      }
    }

    bubble.innerHTML = formatMarkdown(fullText);
    return fullText;
  }

  // ─── Gemini API (streaming) ───
  async function callGemini(systemPrompt, messages, thinkingRow) {
    var apiKey = getGeminiKey();
    if (!apiKey) throw new Error('No hay API Key de Gemini configurada. Ve a Ajustes → AI.');

    abortController = new AbortController();
    var bubble = thinkingRow.querySelector('.ai-msg-bubble');

    // Build contents (filter empty, alternate roles)
    var rawContents = messages.slice(-10)
      .filter(function(m){ return m.content && m.content.trim() && m.role !== 'system'; })
      .map(function(m){ return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{text: m.content}] }; });

    // Merge consecutive same-role
    var contents = [];
    rawContents.forEach(function(msg) {
      if (contents.length > 0 && contents[contents.length-1].role === msg.role) {
        contents[contents.length-1].parts[0].text += '\n' + msg.parts[0].text;
      } else {
        contents.push(msg);
      }
    });

    if (contents.length === 0 || contents[0].role !== 'user') {
      throw new Error('La conversación debe comenzar con un mensaje de usuario.');
    }

    var model = selectedModel.startsWith('gemini-') ? selectedModel : 'gemini-2.0-flash';
    var url = GEMINI_API_BASE + '/models/' + model + ':streamGenerateContent?alt=sse&key=' + apiKey;

    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: contents,
        generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 8192 }
      }),
      signal: abortController.signal
    });

    if (!res.ok) {
      var errData = {};
      try { errData = await res.json(); } catch(e) {}
      throw new Error(errData.error && errData.error.message ? errData.error.message : 'Gemini error ' + res.status);
    }

    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var fullText = '';
    var buf = '';
    bubble.innerHTML = '';

    while (true) {
      var read = await reader.read();
      if (read.done) break;
      buf += decoder.decode(read.value, { stream: true });
      var lines = buf.split('\n');
      buf = lines.pop() || '';

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line.startsWith('data: ')) continue;
        try {
          var chunk = JSON.parse(line.slice(6));
          var parts = chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content && chunk.candidates[0].content.parts;
          if (parts) {
            parts.forEach(function(p) {
              if (p.text && !p.thought) {
                fullText += p.text;
                bubble.innerHTML = formatMarkdown(fullText) + '<span class="ai-stream-cursor"></span>';
                thinkingRow.parentElement && (thinkingRow.parentElement.scrollTop = thinkingRow.parentElement.scrollHeight);
              }
            });
          }
        } catch(e) { /* skip */ }
      }
    }

    bubble.innerHTML = formatMarkdown(fullText);
    return fullText;
  }

  // ─── UI Helpers ───
  function setSendBtnState(generating) {
    var sendBtn = document.getElementById('ai-send-btn');
    var stopBtn = document.getElementById('ai-stop-btn');
    if (sendBtn) sendBtn.style.display = generating ? 'none' : 'flex';
    if (stopBtn) stopBtn.style.display = generating ? 'flex' : 'none';
  }

  // ─── ComfyUI Image Generator ───
  async function generateComfyImage() {
    var promptInput = document.getElementById('comfy-prompt-input');
    var previewBox  = document.getElementById('comfy-preview-box');
    var btn         = document.getElementById('comfy-generate-btn');
    if (!promptInput || !promptInput.value.trim() || !previewBox) return;

    var promptText = promptInput.value.trim();
    if (btn) btn.disabled = true;

    var targetProxy = activeProxyUrl || config.proxyUrl || LIVE_TUNNEL_URL;

    previewBox.innerHTML =
      '<div style="text-align:center; padding: 24px; color:#00d2ff;">' +
      '  <div style="font-size:1.5rem; margin-bottom:8px;">🎨</div>' +
      '  <div style="font-weight:700; color:#fff; margin-bottom:4px;">Enviando trabajo a ComfyUI...</div>' +
      '  <div style="font-size:0.85rem; color:#94a3b8;">Generando render con Stable Diffusion</div>' +
      '</div>';

    // Get Firebase token
    var token = '';
    try {
      var user = firebase.auth().currentUser;
      if (user) token = await user.getIdToken();
    } catch(e) {}

    try {
      var promptPayload = {
        prompt: {
          "3": {
            inputs: {
              seed: Math.floor(Math.random() * 1e9),
              steps: 20,
              cfg: 7,
              sampler_name: "euler",
              scheduler: "normal",
              denoise: 1,
              model: ["4", 0],
              positive: ["6", 0],
              negative: ["7", 0],
              latent_image: ["5", 0]
            },
            class_type: "KSampler"
          },
          "4": { inputs: { ckpt_name: "v1-5-pruned-emaonly.safetensors" }, class_type: "CheckpointLoaderSimple" },
          "5": { inputs: { width: 512, height: 512, batch_size: 1 }, class_type: "EmptyLatentImage" },
          "6": { inputs: { text: promptText, clip: ["4", 1] }, class_type: "CLIPTextEncode" },
          "7": { inputs: { text: "ugly, blurry, distorted, low quality, bad resolution", clip: ["4", 1] }, class_type: "CLIPTextEncode" },
          "8": { inputs: { samples: ["3", 0], vae: ["4", 2] }, class_type: "VAEDecode" },
          "9": { inputs: { filename_prefix: "Futunet_AI", images: ["8", 0] }, class_type: "SaveImage" }
        }
      };

      var res = await fetch(targetProxy + '/api/comfy/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? 'Bearer ' + token : ''
        },
        body: JSON.stringify(promptPayload)
      });

      if (!res.ok) {
        var errText = await res.text();
        throw new Error('ComfyUI error ' + res.status + ': ' + errText);
      }

      var data = await res.json();
      var promptId = data.prompt_id;

      if (!promptId) {
        throw new Error('No se recibió ID de trabajo de ComfyUI.');
      }

      previewBox.innerHTML =
        '<div style="text-align:center; padding: 24px; color:#00d2ff;">' +
        '  <div style="font-size:2rem; margin-bottom:8px;">🎨</div>' +
        '  <div style="font-weight:700; color:#fff; margin-bottom:4px;">Procesando imagen (ID: ' + escapeHtml(promptId.slice(0, 8)) + ')...</div>' +
        '  <div style="font-size:0.85rem; color:#94a3b8;">Renderizando difusión estable en GPU local...</div>' +
        '</div>';

      // Poll history for completion
      var checkHistory = async function(attemptsLeft) {
        if (attemptsLeft <= 0) {
          previewBox.innerHTML = '<div style="color:#f59e0b; padding:16px; text-align:center;">⏱️ El render tarda más de lo habitual. Revisa la consola de ComfyUI.</div>';
          return;
        }

        try {
          var histRes = await fetch(targetProxy + '/api/comfy/history/' + promptId, {
            headers: { 'Authorization': token ? 'Bearer ' + token : '' }
          });

          if (histRes.ok) {
            var histData = await histRes.json();
            var entry = histData[promptId];
            if (entry && entry.outputs && entry.outputs["9"] && entry.outputs["9"].images && entry.outputs["9"].images.length > 0) {
              var imgInfo = entry.outputs["9"].images[0];
              var imgUrl = targetProxy + '/api/comfy/view?filename=' + encodeURIComponent(imgInfo.filename) +
                '&subfolder=' + encodeURIComponent(imgInfo.subfolder || '') +
                '&type=' + encodeURIComponent(imgInfo.type || 'output');

              previewBox.innerHTML =
                '<div style="text-align:center; padding:12px;">' +
                '  <img src="' + imgUrl + '" alt="Generado con ComfyUI" style="max-width:100%; max-height:420px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5); margin-bottom:12px; border:1px solid rgba(255,255,255,0.15);" />' +
                '  <div style="font-size:0.88rem; color:#10b981; font-weight:700;">✅ Imagen generada exitosamente con ComfyUI</div>' +
                '</div>';
              return;
            }
          }
        } catch(e) {}

        setTimeout(function() { checkHistory(attemptsLeft - 1); }, 2500);
      };

      checkHistory(35);

    } catch(e) {
      console.error('[ComfyUI Error]', e);
      previewBox.innerHTML = '<div style="color:#ef4444; padding:16px; text-align:center;">⚠️ Error al conectar con ComfyUI: ' + escapeHtml(e.message) + '</div>';
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // ─── PWA ───
  async function installPwaApp() {
    if (!deferredPrompt) {
      showAdminToast('Abre el menú del navegador → "Instalar aplicación" o "Añadir a pantalla de inicio".', 'info');
      return;
    }
    deferredPrompt.prompt();
    var choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') showAdminToast('¡Web App instalada!', 'success');
    deferredPrompt = null;
  }

  // ─── Markdown ───
  function formatMarkdown(text) {
    if (!text) return '';
    
    // Preserve code blocks
    var codeBlocks = [];
    var result = text.replace(/```([\w-]*)\n?([\s\S]*?)```/g, function(_, lang, code) {
      var idx = codeBlocks.length;
      codeBlocks.push('<pre style="background:#1e1e2e;padding:12px;border-radius:8px;overflow-x:auto;font-size:0.85rem;"><code>' + escapeHtml(code.trim()) + '</code></pre>');
      return '\x00CODE' + idx + '\x00';
    });

    result = escapeHtml(result);

    result = result
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 5px;border-radius:4px;font-size:0.9em;">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 style="margin:12px 0 6px;color:#e2e8f0;">$1</h3>')
      .replace(/^## (.*$)/gim,  '<h2 style="margin:12px 0 6px;color:#f1f5f9;">$1</h2>')
      .replace(/^# (.*$)/gim,   '<h1 style="margin:12px 0 6px;color:#fff;">$1</h1>')
      .replace(/^[-*] (.+)/gm, '<li style="margin-bottom:4px;">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, function(m){ return '<ul style="padding-left:1.25rem;margin:8px 0;">' + m + '</ul>'; })
      .replace(/\n\n/g, '</p><p style="margin:8px 0;">')
      .replace(/\n/g, '<br>');

    result = result.replace(/\x00CODE(\d+)\x00/g, function(_, idx) { return codeBlocks[parseInt(idx)]; });

    return '<p style="margin:0 0 4px;">' + result + '</p>';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function showAdminToast(msg, type) {
    // Try to use the admin's showToast if available, otherwise console
    if (typeof showToast === 'function') { showToast(msg, type); return; }
    console.log('[AI Admin]', type, msg);
  }

  // ─── Event Listeners ───
  function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.ai-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var target = this.getAttribute('data-ai-tab');
        document.querySelectorAll('.ai-tab-btn').forEach(function(b){ b.classList.remove('is-active'); });
        document.querySelectorAll('.ai-view-pane').forEach(function(p){ p.classList.remove('is-active'); });
        this.classList.add('is-active');
        var pane = document.getElementById('ai-pane-' + target);
        if (pane) pane.classList.add('is-active');
      });
    });

    // Skill chips
    document.querySelectorAll('.ai-skill-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.ai-skill-chip').forEach(function(c){ c.classList.remove('is-active'); });
        this.classList.add('is-active');
        activeSkill = this.getAttribute('data-skill');
        showAdminToast('Skill: ' + this.textContent.trim(), 'info');
      });
    });

    // Send button
    var sendBtn = document.getElementById('ai-send-btn');
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    // Stop button
    var stopBtn = document.getElementById('ai-stop-btn');
    if (stopBtn) stopBtn.addEventListener('click', function() {
      if (abortController) { abortController.abort(); }
    });

    // Textarea enter
    var textarea = document.getElementById('ai-chat-input');
    if (textarea) {
      textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
      });
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 160) + 'px';
      });
    }

    // New chat
    var newChatBtn = document.getElementById('ai-new-chat-btn');
    if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);

    // Save config
    var saveConfigBtn = document.getElementById('ai-save-config-btn');
    if (saveConfigBtn) saveConfigBtn.addEventListener('click', saveConfig);

    // Ping
    var pingBtn = document.getElementById('ai-ping-btn');
    if (pingBtn) pingBtn.addEventListener('click', function() {
      discoverProxy().then(function(url) {
        activeProxyUrl = url;
        checkAllServicesHealth();
        if (url) fetchOllamaModels(url);
      });
    });

    // Model select
    var modelSelect = document.getElementById('ai-model-select');
    if (modelSelect) modelSelect.addEventListener('change', function() { selectedModel = this.value; });

    // PWA
    var pwaBtn = document.getElementById('ai-pwa-install-btn');
    if (pwaBtn) pwaBtn.addEventListener('click', installPwaApp);

    // ComfyUI
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
