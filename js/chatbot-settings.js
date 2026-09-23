(function () {
  'use strict';
  function init() {
    const root = document.getElementById('chatbot-settings');
    if (!root || !window.FutunetAuth || root.dataset.ready) return;
    root.dataset.ready = 'true';
    root.innerHTML = `<details class="sp-card"><summary>Asistente inteligente · Gemini</summary>
      <p>El asistente público usa Gemini mediante Firebase AI Logic. Conserva el contexto de la conversación y prepara un borrador que el usuario revisa antes de enviar a soporte.</p>
      <p class="sp-muted">La conexión se gestiona en Firebase y está protegida con App Check. No necesitas copiar la clave del asistente privado del panel.</p>
      <div class="sp-actions"><a class="sp-btn sp-primary" href="soporte.html" target="_blank" rel="noopener noreferrer">Probar asistente</a>
      <a class="sp-btn" href="https://console.firebase.google.com/project/futunet-web/ailogic" target="_blank" rel="noopener noreferrer">Administrar en Firebase ↗</a></div>
      <p class="sp-help">Si Gemini no está disponible o se agota su cuota, los usuarios pueden continuar con un ticket. El modelo y las instrucciones se mantienen en la plantilla futunet-support-v1 de Firebase.</p></details>`;
    function session() {
      const profile = FutunetAuth.getUserData(), current = FutunetAuth.getCurrentUser();
      const roles = [profile?.role, ...(Array.isArray(profile?.roles) ? profile.roles : [])];
      root.hidden = !(current?.emailVerified && profile?.status !== 'disabled' && !profile?.companyCode && roles.includes('superadmin'));
    }
    FutunetAuth.authReady.then(session); window.addEventListener('futunet-auth-ready', session);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
