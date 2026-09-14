(function () {
  'use strict';
  const API = 'https://futunet-backend.onrender.com/api/chatbot/settings';
  function init() {
    const root = document.getElementById('chatbot-settings');
    if (!root || !window.FutunetAuth || root.dataset.ready) return;
    root.dataset.ready = 'true';
    let epoch = 0, user = null;
    root.innerHTML = `<details class="sp-card"><summary>Asistente inteligente · Gemini</summary>
      <p class="sp-muted">Configura la asistencia pública. La clave se guarda en el servidor y nunca se entrega a los visitantes.</p>
      <form id="cg-form"><div class="sp-two">
        <label class="sp-field">Clave de Gemini <span class="sp-optional">(dejar vacía conserva la actual)</span><input id="cg-key" type="password" autocomplete="new-password" maxlength="160"></label>
        <label class="sp-field">Modelo<select id="cg-model"><option value="gemini-3.6-flash">Gemini 3.6 Flash</option><option value="gemini-3.8-flash">Gemini 3.8 Flash</option><option value="gemini-2.5-flash">Gemini 2.5 Flash</option></select></label>
      </div><label class="sp-check"><input id="cg-enabled" type="checkbox" checked> Activar asistencia inteligente</label>
      <p class="sp-help">Puedes reutilizar la clave que configuraste para el asistente del panel. El bot público solo recibe información pública del catálogo; no consulta cuentas ni pedidos.</p>
      <div class="sp-actions"><button class="sp-btn sp-primary" type="submit">Guardar configuración</button><button class="sp-btn" id="cg-reuse" type="button">Usar la clave de este navegador</button><button class="sp-btn" id="cg-refresh" type="button">Consultar estado</button></div></form>
      <p id="cg-status" role="status" aria-live="polite"></p></details>`;
    const $ = id => document.getElementById(id);
    const status = (text, error = false) => { $('cg-status').textContent = text; $('cg-status').classList.toggle('sp-error', error); };
    const busy = value => root.querySelectorAll('input, select, button').forEach(el => { el.disabled = value; });
    async function request(method, data, actor) {
      const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 30000);
      try {
        const token = await actor.getIdToken();
        const response = await fetch(API, { method, credentials: 'omit', cache: 'no-store', signal: controller.signal,
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          ...(data ? { body: JSON.stringify(data) } : {}) });
        if (!response.ok) throw new Error(response.status === 403 || response.status === 401 ? 'La sesión no tiene permiso para configurar Gemini.' : response.status === 422 ? 'Revisa la clave. Para activar el bot debes configurar una clave válida.' : 'No se pudo conectar con la configuración. Comprueba que el backend actualizado esté publicado e inténtalo de nuevo.');
        return await response.json();
      } finally { clearTimeout(timer); }
    }
    async function load() {
      if (!user) return;
      const version = epoch; busy(true); status('Consultando configuración…');
      try {
        const data = await request('GET', null, user); if (version !== epoch) return;
        $('cg-model').value = data.model; $('cg-enabled').checked = data.enabled;
        status((data.configured ? (data.enabled ? 'Clave configurada · asistente activado.' : 'Clave configurada · asistente desactivado.') : 'Falta configurar la clave de Gemini.') +
          (data.environment_key ? ' Se utiliza la clave del entorno del servidor; esa clave tiene prioridad.' : '') +
          (data.environment_model ? ' El modelo está fijado por el entorno del servidor.' : ''));
        $('cg-model').dataset.environment = String(!!data.environment_model);
      } catch (error) { if (version === epoch) status(error.name === 'AbortError' ? 'La consulta tardó demasiado. Vuelve a intentar.' : error.message, true); }
      finally { if (version === epoch) { busy(false); $('cg-model').disabled = $('cg-model').dataset.environment === 'true'; } }
    }
    async function save(reuse) {
      if (!user) return;
      let key = $('cg-key').value.trim();
      try {
        if (reuse) { key = (localStorage.getItem('futunet_gemini_key') || '').trim(); if (!key) throw new Error('No hay una clave de Gemini guardada en este navegador. Introduce la clave en el campo superior.'); }
        if (key && !/^[A-Za-z0-9_-]{20,160}$/.test(key)) throw new Error('La clave no tiene un formato válido.');
      } catch (error) { status(error.message, true); return; }
      const version = epoch; busy(true); status('Guardando configuración…');
      try {
        await request('PUT', { api_key: key, model: $('cg-model').value, enabled: $('cg-enabled').checked }, user);
        if (version !== epoch) return;
        $('cg-key').value = ''; await load();
      } catch (error) { if (version === epoch) status(error.name === 'AbortError' ? 'No se pudo confirmar el guardado. Consulta el estado antes de volver a intentar.' : error.message, true); }
      finally { key = ''; if (version === epoch) { busy(false); $('cg-model').disabled = $('cg-model').dataset.environment === 'true'; } }
    }
    $('cg-form').addEventListener('submit', event => { event.preventDefault(); save(false); });
    $('cg-reuse').addEventListener('click', () => save(true));
    $('cg-refresh').addEventListener('click', load);
    function session() {
      epoch++; $('cg-key').value = ''; status('');
      const profile = FutunetAuth.getUserData(), current = FutunetAuth.getCurrentUser();
      const roles = [profile?.role, ...(Array.isArray(profile?.roles) ? profile.roles : [])];
      user = current?.emailVerified && profile?.status !== 'disabled' && !profile?.companyCode && roles.includes('superadmin') ? current : null;
      root.hidden = !user;
      if (user) load();
    }
    FutunetAuth.authReady.then(session); window.addEventListener('futunet-auth-ready', session);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
