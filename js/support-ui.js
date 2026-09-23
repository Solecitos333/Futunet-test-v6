(function () {
  'use strict';
  const C = window.FutunetSupportCore, S = window.FutunetSupportService;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const options = values => Object.entries(values).map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
  const date = value => value?.toDate ? value.toDate().toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Confirmando…';
  let user = null, profile = null, listStop = null, records = [], activeDialog = null, admin = false, formId = null;
  let detailStops = [], previews = [], authEpoch = 0, listGeneration = 0;
  let sessionReady = false;
  const $ = id => document.getElementById(id);
  function errorText(error) {
    if (/permission-denied/.test(error.code || '')) return 'No tienes acceso a esta acción o las reglas de soporte aún no están publicadas. Contacta al administrador.';
    if (/failed-precondition/.test(error.code || '')) return 'El servicio necesita terminar su configuración. Contacta al administrador e inténtalo más tarde.';
    if (/unavailable|deadline-exceeded/.test(error.code || '')) return 'No pudimos confirmar la operación. Revisa tu conexión y vuelve a intentar; no se duplicará el envío.';
    return error.message || 'No se pudo completar la operación. Vuelve a intentar.';
  }
  function notice(id, text, error = false) {
    const el = $(id); if (!el) return;
    el.textContent = text; el.classList.toggle('sp-error', error); el.hidden = !text;
  }
  function focus(id) { const el = $(id); if (el) el.focus(); }
  function clearPreviews() { previews.forEach(URL.revokeObjectURL); previews = []; }
  function closeDetail() {
    detailStops.forEach(stop => stop()); detailStops = [];
    if (activeDialog) { const dialog = activeDialog; activeDialog = null; dialog.close(); dialog.remove(); }
  }
  function formMarkup(internal) {
    return `<section class="sp-card" id="sp-new-case" aria-labelledby="sp-form-heading">
      <div class="sp-section-heading"><div><span class="sp-eyebrow">${internal ? 'REPORTE INTERNO' : 'ASISTENTE DE SOPORTE'}</span><h2 id="sp-form-heading">${internal ? 'Reportar un error' : 'Cuéntanos qué sucede'}</h2></div><span class="sp-pill">${internal ? 'Equipo Futunet' : 'Asistente automatizado'}</span></div>
      <p class="sp-muted">${internal ? 'Describe el problema para que otro miembro del equipo pueda reproducirlo y corregirlo.' : 'Te ayudaré a organizar el caso. Si necesitas a una persona, puedes crear el ticket directamente.'}</p>
      <form id="sp-form">
        <div id="sp-edit-fields">
          <label class="sp-field">Tipo de caso<select id="sp-type" ${internal ? 'disabled' : ''}>${options(internal ? { bug: C.TYPES.bug } : C.TYPES)}</select></label>
          <div class="sp-bot"><span class="sp-bot-avatar" aria-hidden="true">F</span><p id="sp-question"></p></div>
          <label class="sp-field">Asunto<input id="sp-title" required minlength="5" maxlength="120" placeholder="Ej.: El botón de cotizar no responde"></label>
          <label class="sp-field">Descripción del caso<textarea id="sp-description" required minlength="20" maxlength="5000" rows="5" placeholder="Qué ocurrió, cuándo, pasos para repetirlo y resultado esperado…"></textarea></label>
          <div class="sp-two"><label class="sp-field">Página afectada <span class="sp-optional">(opcional)</span><input id="sp-page" maxlength="1000" placeholder="https://futunet.com.do/catalogo.html"></label>
          <label class="sp-field">Pedido, factura o servicio <span class="sp-optional">(opcional)</span><input id="sp-reference" maxlength="100" placeholder="Número de referencia"></label></div>
          <div class="sp-guide" id="sp-guide" hidden><strong>Una primera orientación</strong><p id="sp-tip"></p><p>¿Continúa el problema? Añade lo que probaste y enviaremos el caso al equipo.</p></div>
          <label class="sp-field">Qué has intentado <span class="sp-optional">(opcional)</span><textarea id="sp-attempted" rows="2" maxlength="1000" placeholder="Ej.: Recargué la página y volvió a ocurrir."></textarea></label>
          <label class="sp-field">Capturas de pantalla <span class="sp-optional">(opcional)</span><input id="sp-files" type="file" multiple accept="image/png,image/jpeg,image/webp" aria-describedby="sp-file-help"></label>
          <p class="sp-help" id="sp-file-help">Hasta 3 imágenes JPG, PNG o WebP de 5 MB cada una. Se optimizan para el ticket. Oculta contraseñas, tarjetas y datos que no sean necesarios.</p>
          <div id="sp-previews" class="sp-previews"></div>
          <label class="sp-check"><input id="sp-environment" type="checkbox" ${internal ? 'checked' : ''}> Incluir navegador y tamaño de pantalla para facilitar el diagnóstico</label>
          <div class="sp-actions"><button type="button" id="sp-guidance" class="sp-btn">Ver orientación inicial</button><button type="submit" class="sp-btn sp-primary">Revisar y crear ticket →</button></div>
        </div>
        <div id="sp-review" hidden tabindex="-1"><span class="sp-eyebrow">REVISA TU CASO</span><h3>Esto recibirá el equipo</h3><pre id="sp-summary"></pre><p id="sp-review-files"></p><p class="sp-help">Podrás seguir el estado y responder desde esta página. El envío no garantiza una resolución inmediata.</p>
          <div class="sp-actions"><button type="button" id="sp-back" class="sp-btn">Editar</button><button type="button" id="sp-send" class="sp-btn sp-primary">Enviar ticket a soporte</button></div>
        </div>
        <p id="sp-form-notice" role="status" aria-live="polite" hidden></p>
      </form>
      <p id="sp-signin" class="sp-signin" hidden>Para enviar y consultar casos necesitas una cuenta verificada. <a href="login.html?redirect=soporte.html" target="_blank" rel="noopener noreferrer">Iniciar sesión o registrarte (otra pestaña)</a>. Tu formulario permanecerá aquí.</p>
    </section>`;
  }
  function listMarkup() {
    return `<section class="sp-card" id="sp-cases" aria-labelledby="sp-list-heading"><div class="sp-section-heading"><div><span class="sp-eyebrow">SEGUIMIENTO</span><h2 id="sp-list-heading">${admin ? 'Bandeja de tickets' : 'Mis casos'}</h2></div><button class="sp-btn" id="sp-refresh" type="button">Actualizar</button></div>
      <p id="sp-list-description" class="sp-muted">${admin ? 'Gestiona los casos de clientes y los errores reportados por el equipo.' : 'Consulta las respuestas del equipo y continúa la conversación.'}</p>
      <div class="sp-filters"><label class="sp-field">Buscar<input type="search" id="sp-search" placeholder="Asunto, referencia o número de ticket"></label><label class="sp-field">Estado<select id="sp-status"><option value="all">Todos los estados</option>${options(C.STATUSES)}</select></label>
      ${admin ? '<label class="sp-field">Origen<select id="sp-source"><option value="all">Todos</option><option value="external">Clientes</option><option value="internal">Equipo interno</option></select></label>' : ''}</div>
      <p id="sp-list-notice" role="status" aria-live="polite"></p><div id="sp-list" class="sp-ticket-list"></div><p id="sp-limit" class="sp-help" hidden>Se muestran los 200 casos más recientes. Usa el enlace o número completo del ticket para abrir uno anterior.</p>
      <form id="sp-find-form" class="sp-actions"><label class="sp-field">Abrir por número completo<input id="sp-find-id" required pattern="[A-Za-z0-9]{20}" maxlength="20" placeholder="ID de 20 caracteres"></label><button class="sp-btn" type="submit">Abrir ticket</button></form>
    </section>`;
  }
  function collect() {
    return C.draft({ type: $('sp-type').value, source: admin ? 'internal' : 'external', title: $('sp-title').value,
      description: $('sp-description').value, page: $('sp-page').value, reference: $('sp-reference').value,
      attempted: $('sp-attempted').value, guided: !$('sp-guide').hidden,
      environment: $('sp-environment').checked ? `${navigator.userAgent.slice(0, 440)} · ${innerWidth}×${innerHeight}` : '' });
  }
  function setupForm() {
    const updateQuestion = () => { $('sp-question').textContent = C.GUIDES[$('sp-type').value].question; $('sp-guide').hidden = true; };
    $('sp-type').addEventListener('change', updateQuestion); updateQuestion();
    $('sp-guidance').addEventListener('click', () => {
      $('sp-tip').textContent = C.GUIDES[$('sp-type').value].tip; $('sp-guide').hidden = false;
      $('sp-guide').scrollIntoView({ block: 'nearest' });
    });
    $('sp-files').addEventListener('change', () => {
      clearPreviews(); $('sp-previews').replaceChildren(); notice('sp-form-notice', '');
      try {
        C.validateFiles([...$('sp-files').files]);
        [...$('sp-files').files].forEach(file => {
          const url = URL.createObjectURL(file); previews.push(url);
          const figure = document.createElement('figure'), img = document.createElement('img'), caption = document.createElement('figcaption');
          img.src = url; img.alt = 'Vista previa de ' + file.name; caption.textContent = file.name;
          figure.append(img, caption); $('sp-previews').append(figure);
        });
      } catch (e) { $('sp-files').value = ''; notice('sp-form-notice', errorText(e), true); }
    });
    $('sp-form').addEventListener('submit', event => {
      event.preventDefault(); notice('sp-form-notice', '');
      try {
        const data = collect(); C.validateFiles([...$('sp-files').files]);
        $('sp-summary').textContent = C.summary(data);
        $('sp-review-files').textContent = `${$('sp-files').files.length} captura(s) adjunta(s).`;
        $('sp-edit-fields').hidden = true; $('sp-review').hidden = false; focus('sp-review');
      } catch (e) { notice('sp-form-notice', errorText(e), true); }
    });
    $('sp-back').addEventListener('click', () => { $('sp-review').hidden = true; $('sp-edit-fields').hidden = false; focus('sp-title'); });
    $('sp-send').addEventListener('click', async () => {
      if (!user?.emailVerified) { notice('sp-form-notice', 'Inicia sesión en el enlace de abajo. El caso está preparado y aún no se ha enviado.', true); return; }
      const epoch = authEpoch;
      $('sp-send').disabled = true; $('sp-back').disabled = true; notice('sp-form-notice', 'Preparando las capturas y confirmando el ticket…');
      try {
        formId ||= S.newId();
        const id = await S.create(formId, collect(), [...$('sp-files').files]);
        if (epoch !== authEpoch) return;
        formId = null; $('sp-form').reset(); clearPreviews(); $('sp-previews').replaceChildren(); updateQuestion();
        $('sp-review').hidden = true; $('sp-edit-fields').hidden = false;
        notice('sp-form-notice', 'Ticket creado y confirmado. Número: ' + id + '. Ya puedes consultar su seguimiento.');
        openDetail(id);
      } catch (e) { if (epoch === authEpoch) notice('sp-form-notice', errorText(e), true); }
      finally { $('sp-send').disabled = false; $('sp-back').disabled = false; }
    });
  }
  function renderList() {
    const search = $('sp-search').value.toLocaleLowerCase('es').trim(), status = $('sp-status').value, source = $('sp-source')?.value || 'all';
    const filtered = records.filter(t => (status === 'all' || t.status === status) && (source === 'all' || t.source === source) &&
      [t.title, t.id, t.reference, t.ownerName].join(' ').toLocaleLowerCase('es').includes(search));
    $('sp-list').innerHTML = filtered.length ? filtered.map(t => `<button class="sp-ticket" type="button" data-ticket="${esc(t.id)}"><span class="sp-ticket-main"><span class="sp-ticket-kicker">${t.source === 'internal' ? 'INTERNO · ERROR WEB' : esc(C.TYPES[t.type])} · ${esc(date(t.createdAt))}</span><strong>${esc(t.title)}</strong><span class="sp-ticket-code">${esc(t.id)}${admin ? ' · ' + esc(t.ownerName) : ''}</span></span><span class="sp-ticket-badges"><span class="sp-pill sp-status-${esc(t.status)}">${esc(C.STATUSES[t.status])}</span>${t.priority !== 'normal' ? `<span class="sp-pill sp-priority">Prioridad ${esc(C.PRIORITIES[t.priority]).toLowerCase()}</span>` : ''}</span><span aria-hidden="true">→</span></button>`).join('') : '<div class="sp-empty"><strong>No hay casos para mostrar</strong><p>Los tickets aparecerán aquí. Si aplicaste filtros, prueba cambiarlos.</p></div>';
    $('sp-limit').hidden = records.length < 200;
    const badge = $('badge-support');
    if (badge) { const open = records.filter(t => !['closed', 'resolved'].includes(t.status)).length; badge.textContent = open; badge.style.display = open ? '' : 'none'; }
  }
  function watchList() {
    const generation = ++listGeneration;
    if (listStop) { listStop(); listStop = null; }
    records = []; $('sp-list').replaceChildren();
    if (!user?.emailVerified) { notice('sp-list-notice', 'Inicia sesión con una cuenta verificada para ver tus casos.'); return; }
    notice('sp-list-notice', 'Cargando tickets…');
    try {
      listStop = S.watchTickets(admin, snapshot => {
        if (generation !== listGeneration) return;
        records = snapshot.docs.filter(doc => !doc.metadata.hasPendingWrites).map(doc => ({ id: doc.id, ...doc.data() }));
        notice('sp-list-notice', snapshot.metadata.fromCache ? 'Sin confirmación del servidor. Mostrando los datos disponibles; comprueba tu conexión.' : `${records.length} caso(s). Actualización en tiempo real.`);
        renderList();
      }, error => { if (generation !== listGeneration) return; records = []; $('sp-list').replaceChildren(); notice('sp-list-notice', errorText(error), true); });
    } catch (e) { notice('sp-list-notice', errorText(e), true); }
  }
  function threadMarkup(items) {
    return items.map(doc => { const m = doc.data(); return `<article class="sp-message ${m.authorRole === 'staff' ? 'sp-message-staff' : ''}"><header><strong>${esc(m.authorName)}</strong><span>${m.authorRole === 'staff' ? 'Equipo' : 'Cliente'} · ${esc(date(m.createdAt))}</span></header><p>${esc(m.body)}</p></article>`; }).join('') || '<p class="sp-muted">Todavía no hay mensajes.</p>';
  }
  function openDetail(id) {
    if (!/^[a-zA-Z0-9]{20}$/.test(id)) { notice('sp-list-notice', 'El número de ticket debe tener 20 letras y números.', true); return; }
    closeDetail();
    const dialog = document.createElement('dialog'); activeDialog = dialog;
    dialog.className = 'sp-dialog sp'; dialog.setAttribute('aria-labelledby', 'sp-detail-title');
    dialog.innerHTML = `<div class="sp-dialog-head"><div><span class="sp-eyebrow">DETALLE DEL CASO</span><h2 id="sp-detail-title">Cargando ticket…</h2></div><button id="sp-close" class="sp-btn" type="button" aria-label="Cerrar ticket">Cerrar ×</button></div><div class="sp-dialog-body"><p id="sp-detail-notice" role="status" aria-live="polite"></p><div id="sp-detail-content" hidden></div></div>`;
    document.body.append(dialog); dialog.showModal();
    $('sp-close').addEventListener('click', closeDetail); dialog.addEventListener('close', () => { if (activeDialog === dialog) closeDetail(); });
    let initialized = false, current = null, editRevision = null, replyId = null;
    const ref = FutunetFirebase.db.collection('support_tickets').doc(id);
    const fail = error => {
      if (activeDialog !== dialog) return;
      $('sp-detail-content').hidden = true; $('sp-detail-title').textContent = 'Ticket no disponible';
      notice('sp-detail-notice', errorText(error), true);
    };
    detailStops.push(ref.onSnapshot(snap => {
      if (activeDialog !== dialog) return;
      if (!snap.exists) { fail(new Error('No encontramos ese ticket o no tienes acceso.')); return; }
      current = snap.data(); const manager = C.canManage(profile, current);
      $('sp-detail-title').textContent = current.title;
      if (!initialized) {
        initialized = true; $('sp-detail-content').hidden = false;
        $('sp-detail-content').innerHTML = `<p class="sp-ticket-code">${esc(id)} · <a href="${admin ? 'admin.html' : 'soporte.html'}?ticket=${esc(id)}${admin ? '#support' : ''}">Enlace al ticket</a></p><div id="sp-detail-meta" class="sp-actions"></div><pre class="sp-case-summary">${esc(C.summary(current))}</pre><p class="sp-muted">Enviado por ${esc(current.ownerName)} · ${esc(date(current.createdAt))}${manager ? '<br>Contacto: ' + esc(current.ownerEmail) : ''}</p>
          <div id="sp-attachments" class="sp-previews"></div><p id="sp-attachments-notice" role="status"></p>
          ${manager ? `<section class="sp-management"><h3>Gestión del caso</h3><div class="sp-two"><label class="sp-field">Estado<select id="sp-manage-status">${options(C.STATUSES)}</select></label><label class="sp-field">Prioridad<select id="sp-manage-priority">${options(C.PRIORITIES)}</select></label></div><p id="sp-assigned"></p><div class="sp-actions"><button class="sp-btn" type="button" id="sp-claim">Asignarme</button><button class="sp-btn" type="button" id="sp-release">Liberar responsable</button><button class="sp-btn sp-primary" type="button" id="sp-save-status">Guardar cambios</button></div><p id="sp-manage-notice" role="status"></p></section>` : ''}
          <h3>Conversación con soporte</h3><div id="sp-messages" class="sp-messages"></div><p id="sp-messages-notice" role="status"></p>
          ${manager ? '<details class="sp-notes"><summary>Notas privadas del equipo</summary><p class="sp-help">Estas notas solo son visibles para el equipo autorizado.</p><div id="sp-notes-list"></div><p id="sp-notes-notice" role="status"></p></details>' : ''}
          <form id="sp-reply-form"><label class="sp-field">${manager ? 'Mensaje' : 'Añadir información o responder'}<textarea id="sp-reply-body" rows="3" required maxlength="5000"></textarea></label>${manager ? '<label class="sp-check"><input type="checkbox" id="sp-private-note"> Guardar como nota privada (no se envía al cliente)</label>' : ''}<p id="sp-closed-help" class="sp-help" hidden>Este caso está cerrado.${manager ? ' Reábrelo para responder o añade una nota privada.' : ' Crea un nuevo ticket si necesitas más ayuda.'}</p><button class="sp-btn sp-primary" id="sp-reply-send" type="submit">Enviar respuesta</button><p id="sp-reply-notice" role="status"></p></form>`;
        if (current.attachmentCount) {
          notice('sp-attachments-notice', 'Cargando capturas…');
          ref.collection('attachments').get({ source: 'server' }).then(attachments => {
            if (activeDialog !== dialog) return;
            $('sp-attachments').replaceChildren();
            attachments.forEach(doc => {
              const a = doc.data();
              if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(a.dataUrl) || a.dataUrl.length > 350000) return;
              const link = document.createElement('a'), img = document.createElement('img'), caption = document.createElement('span');
              link.href = a.dataUrl; link.download = 'captura-' + doc.id + '.jpg'; img.src = a.dataUrl; img.alt = a.name;
              caption.textContent = a.name + ' · Descargar'; link.append(img, caption); $('sp-attachments').append(link);
            });
            notice('sp-attachments-notice', '');
          }).catch(error => { if (activeDialog === dialog) notice('sp-attachments-notice', 'No se pudieron cargar las capturas. Cierra y vuelve a abrir el ticket. ' + errorText(error), true); });
        }
        detailStops.push(ref.collection('messages').orderBy('createdAt', 'desc').limit(100).onSnapshot(snapshot => {
          if (activeDialog !== dialog) return;
          $('sp-messages').innerHTML = threadMarkup([...snapshot.docs].reverse());
          notice('sp-messages-notice', snapshot.size === 100 ? 'Se muestran los últimos 100 mensajes.' : '');
        }, error => { if (activeDialog === dialog) notice('sp-messages-notice', errorText(error), true); }));
        if (manager) {
          detailStops.push(ref.collection('notes').orderBy('createdAt', 'desc').limit(100).onSnapshot(snapshot => {
            if (activeDialog !== dialog) return;
            $('sp-notes-list').innerHTML = threadMarkup([...snapshot.docs].reverse());
          }, error => { if (activeDialog === dialog) notice('sp-notes-notice', errorText(error), true); }));
          ['sp-manage-status', 'sp-manage-priority'].forEach(key => $(key).addEventListener('change', () => { editRevision ??= current.revision; }));
          const manage = async (changes, button, revision) => {
            button.disabled = true;
            try { await S.update(id, changes, revision); editRevision = null; if (activeDialog === dialog) notice('sp-manage-notice', 'Cambios guardados.'); }
            catch (e) { if (activeDialog === dialog) { editRevision = null; $('sp-manage-status').value = current.status; $('sp-manage-priority').value = current.priority; notice('sp-manage-notice', errorText(e), true); } }
            finally { button.disabled = false; }
          };
          $('sp-save-status').addEventListener('click', event => manage({ status: $('sp-manage-status').value, priority: $('sp-manage-priority').value }, event.currentTarget, editRevision ?? current.revision));
          $('sp-claim').addEventListener('click', event => manage({ assignedTo: user.uid, assignedName: (user.displayName || user.email || 'Usuario').slice(0, 150) }, event.currentTarget, current.revision));
          $('sp-release').addEventListener('click', event => manage({ assignedTo: '', assignedName: '' }, event.currentTarget, current.revision));
        }
        $('sp-private-note')?.addEventListener('change', () => { $('sp-reply-send').textContent = $('sp-private-note').checked ? 'Guardar nota privada' : 'Enviar respuesta'; });
        $('sp-reply-form').addEventListener('submit', async event => {
          event.preventDefault(); const button = $('sp-reply-send'); button.disabled = true;
          try {
            replyId ||= S.newId();
            await S.reply(id, replyId, $('sp-reply-body').value, $('sp-private-note')?.checked === true);
            if (activeDialog !== dialog) return;
            replyId = null; $('sp-reply-body').value = ''; notice('sp-reply-notice', 'Mensaje guardado.');
          } catch (e) { if (activeDialog === dialog) notice('sp-reply-notice', errorText(e), true); }
          finally { button.disabled = false; }
        });
      }
      $('sp-detail-meta').innerHTML = `<span class="sp-pill sp-status-${esc(current.status)}">${esc(C.STATUSES[current.status])}</span><span class="sp-pill">Prioridad ${esc(C.PRIORITIES[current.priority])}</span><span class="sp-muted">Actualizado: ${esc(date(current.updatedAt))}</span>`;
      $('sp-closed-help').hidden = current.status !== 'closed';
      if (manager) {
        if (editRevision === null) { $('sp-manage-status').value = current.status; $('sp-manage-priority').value = current.priority; }
        $('sp-assigned').textContent = current.assignedName ? 'Responsable: ' + current.assignedName : 'Sin responsable asignado';
      }
    }, fail));
  }
  function sessionChanged() {
    const nextProfile = FutunetAuth.getUserData();
    const nextUser = nextProfile?.status === 'disabled' ? null : FutunetAuth.getCurrentUser();
    if (user?.uid !== nextUser?.uid) {
      authEpoch++; closeDetail(); formId = null;
      // Keep a guest's prepared form after sign-in, but clear a previous account's draft.
      if (user) { $('sp-form').reset(); clearPreviews(); $('sp-previews').replaceChildren(); $('sp-review').hidden = true; $('sp-edit-fields').hidden = false; notice('sp-form-notice', ''); }
    }
    user = nextUser; profile = nextProfile;
    sessionReady = true;
    $('sp-signin').hidden = !!user?.emailVerified;
    if (admin && !C.isStaff(profile)) { listGeneration++; if (listStop) listStop(); closeDetail(); $('sp-root').hidden = true; return; }
    $('sp-root').hidden = false;
    if (admin && !C.isSupport(profile)) { $('sp-source').value = 'internal'; $('sp-source').disabled = true; $('sp-list-description').textContent = 'El equipo puede reportar y gestionar errores internos. Los casos de clientes están reservados a soporte y administración.'; }
    watchList();
    importChatDraft();
    const requested = new URLSearchParams(location.search).get('ticket');
    if (requested && user?.emailVerified) openDetail(requested);
  }
  function importChatDraft() {
    if (admin || !sessionReady) return;
    const key = 'futunet_support_handoff';
    let data;
    try {
      const raw = sessionStorage.getItem(key); if (!raw) return;
      if (raw.length > 20000) throw new Error('Borrador demasiado largo');
      const saved = JSON.parse(raw);
      if (!Number.isFinite(saved.createdAt) || Date.now() - saved.createdAt > 1200000 || saved.createdAt > Date.now() + 5000 || (saved.ownerId && saved.ownerId !== user?.uid)) {
        sessionStorage.removeItem(key); return;
      }
      data = C.draft({ ...saved.fields, source: 'external', environment: '', guided: false });
    } catch (_) { try { sessionStorage.removeItem(key); } catch (_) {} return; }
    const apply = () => {
      ['type', 'title', 'description', 'attempted', 'reference', 'page'].forEach(name => { $('sp-' + name).value = data[name]; });
      $('sp-type').dispatchEvent(new Event('change'));
      formId = null; clearPreviews(); $('sp-previews').replaceChildren(); $('sp-files').value = '';
      $('sp-review').hidden = true; $('sp-edit-fields').hidden = false;
      sessionStorage.removeItem(key);
      notice('sp-form-notice', 'Borrador preparado desde tu conversación. Revisa los datos y añade capturas; todavía no se ha enviado ningún ticket.');
      $('sp-new-case').scrollIntoView({ block: 'start' }); focus('sp-title');
    };
    if ($('sp-title').value || $('sp-description').value || $('sp-send').disabled) {
      notice('sp-form-notice', 'Hay un borrador del asistente listo. Puedes reemplazar el formulario actual cuando termines de revisarlo.');
      const button = document.createElement('button'); button.type = 'button'; button.className = 'sp-btn';
      button.textContent = 'Usar borrador del asistente';
      button.addEventListener('click', () => { if (!$('sp-send')?.disabled) apply(); });
      $('sp-form-notice')?.append(button);
    } else apply();
  }
  function init() {
    const root = $('sp-root'); if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true'; admin = root.dataset.mode === 'admin';
    root.innerHTML = `<div class="sp-workspace">${formMarkup(admin)}${listMarkup()}</div>`;
    setupForm();
    window.addEventListener('futunet-support-draft', importChatDraft);
    document.querySelectorAll('[data-open-assistant]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); window.dispatchEvent(new Event('futunet-open-chat')); }));
    ['sp-search', 'sp-status', 'sp-source'].forEach(id => $(id)?.addEventListener('input', renderList));
    $('sp-refresh')?.addEventListener('click', watchList);
    $('sp-list')?.addEventListener('click', event => { const button = event.target.closest('[data-ticket]'); if (button) openDetail(button.dataset.ticket); });
    $('sp-find-form')?.addEventListener('submit', event => { event.preventDefault(); try { S.identity(); openDetail($('sp-find-id')?.value.trim()); } catch (e) { notice('sp-list-notice', errorText(e), true); } });
    document.querySelectorAll('[data-support-topic]').forEach(button => button.addEventListener('click', () => {
      const typeEl = $('sp-type');
      if (typeEl) {
        typeEl.value = button.dataset.supportTopic;
        typeEl.dispatchEvent(new Event('change'));
      }
      const revEl = $('sp-review'); if (revEl) revEl.hidden = true;
      const editEl = $('sp-edit-fields'); if (editEl) editEl.hidden = false;
      $('sp-new-case')?.scrollIntoView({ block: 'start' }); focus('sp-title');
    }));
    if (window.FutunetAuth) {
      FutunetAuth.authReady.then(sessionChanged);
      window.addEventListener('futunet-auth-ready', sessionChanged);
    } else {
      notice('sp-list-notice', 'No se pudo conectar con el servicio. Recarga la página o utiliza WhatsApp.', true);
      const signin = $('sp-signin'); if (signin) signin.hidden = false;
    }
    if (location.hash === '#sp-cases') {
      setTimeout(() => $('sp-cases')?.scrollIntoView({ behavior: 'smooth' }), 60);
    } else if (location.hash === '#sp-new-case') {
      setTimeout(() => $('sp-new-case')?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
    window.addEventListener('online', watchList);
    window.addEventListener('offline', () => notice('sp-list-notice', 'Sin conexión. Los envíos requieren Internet; el formulario permanece abierto.', true));
    window.addEventListener('pagehide', () => { closeDetail(); clearPreviews(); if (listStop) listStop(); });
    window.addEventListener('pageshow', event => { if (event.persisted) watchList(); });
  }
  window.FutunetSupportUI = { init };
  document.addEventListener('DOMContentLoaded', init);
})();
