(function () {
  'use strict';
  const C = window.FutunetSupportCore;
  const db = () => window.FutunetFirebase.db;
  const stamp = () => firebase.firestore.FieldValue.serverTimestamp();
  function identity() {
    const user = window.FutunetAuth?.getCurrentUser();
    if (!user || !user.emailVerified || window.FutunetAuth.getUserData()?.status === 'disabled') throw new Error('Inicia sesión con una cuenta verificada para enviar y consultar tickets.');
    if (navigator.onLine === false) throw new Error('No hay conexión. Tu formulario sigue aquí; vuelve a intentar cuando tengas Internet.');
    return user;
  }
  // Re-encode screenshots: strips EXIF and embedded content. Separate documents keep
  // list queries small; ticket and all screenshots commit in one atomic transaction.
  async function screenshot(file) {
    C.validateFiles([file]);
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (!img.naturalWidth || img.naturalWidth * img.naturalHeight > 40000000) throw new Error('La captura tiene dimensiones demasiado grandes. Recórtala e inténtalo de nuevo.');
      const canvas = document.createElement('canvas');
      let scale = Math.min(1, 1800 / Math.max(img.naturalWidth, img.naturalHeight));
      for (let attempt = 0; attempt < 5; attempt++) {
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82 - attempt * 0.08);
        if (dataUrl.length <= 350000) return { name: file.name.slice(0, 120), dataUrl };
        scale *= 0.8;
      }
      throw new Error('No pudimos preparar la captura. Recórtala o utiliza otra imagen.');
    } catch (error) {
      if (error.name === 'EncodingError') throw new Error('Una de las capturas está dañada o no es una imagen válida.');
      throw error;
    } finally { URL.revokeObjectURL(url); }
  }
  function newId() { return db().collection('support_tickets').doc().id; }
  async function create(id, input, files) {
    const user = identity();
    const data = C.draft(input);
    if (data.source === 'internal' && !C.isStaff(FutunetAuth.getUserData())) throw new Error('No tienes acceso a reportes internos.');
    C.validateFiles(files);
    const attachments = await Promise.all(files.map(screenshot));
    const ref = db().collection('support_tickets').doc(id);
    const rateRef = db().collection('support_rate_limits').doc(user.uid);
    await db().runTransaction(async tx => {
      const [existing, rate] = await Promise.all([tx.get(ref), tx.get(rateRef)]);
      // The same form keeps its ID until confirmed: retries cannot duplicate cases.
      if (existing.exists) {
        if (existing.data().ownerId !== user.uid) throw new Error('No puedes modificar este caso.');
        return;
      }
      if (rate.exists && Date.now() - rate.data().createdAt.toMillis() < 30000) throw new Error('Acabas de enviar un caso. Espera 30 segundos antes de crear otro.');
      tx.set(rateRef, { createdAt: stamp(), ticketId: id });
      tx.set(ref, { ...data, ownerId: user.uid, ownerName: (user.displayName || user.email || 'Usuario').slice(0, 150),
        ownerEmail: user.email, status: 'open', priority: 'normal', assignedTo: '', assignedName: '',
        attachmentCount: attachments.length, createdAt: stamp(), updatedAt: stamp(), updatedBy: user.uid,
        lastMessageId: '', revision: 0 });
      attachments.forEach((item, index) => tx.set(ref.collection('attachments').doc(String(index)), item));
    });
    return id;
  }
  function watchTickets(admin, next, fail) {
    const user = identity(), collection = db().collection('support_tickets');
    let query = collection;
    if (!admin) query = query.where('ownerId', '==', user.uid);
    else if (!C.isSupport(FutunetAuth.getUserData())) query = query.where('source', '==', 'internal');
    // Composite indexes are versioned in firestore.indexes.json. Limit is explicit in UI.
    return query.orderBy('createdAt', 'desc').limit(200).onSnapshot({ includeMetadataChanges: true }, next, fail);
  }
  async function update(id, changes, expectedRevision) {
    const user = identity(), ref = db().collection('support_tickets').doc(id);
    await db().runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Este ticket ya no está disponible.');
      if (!C.canManage(FutunetAuth.getUserData(), snap.data())) throw new Error('No tienes permiso para gestionar este caso.');
      if (snap.data().revision !== expectedRevision) throw new Error('El caso cambió mientras lo editabas. Revisa los datos actualizados y vuelve a guardar.');
      tx.update(ref, { ...changes, updatedAt: stamp(), updatedBy: user.uid, revision: expectedRevision + 1 });
    });
  }
  async function reply(id, messageId, body, internal) {
    const user = identity(), ref = db().collection('support_tickets').doc(id);
    body = C.clean(body, 5000, 'Mensaje', 1);
    const messageRef = ref.collection(internal ? 'notes' : 'messages').doc(messageId);
    await db().runTransaction(async tx => {
      const [snap, existing] = await Promise.all([tx.get(ref), tx.get(messageRef)]);
      if (existing.exists) return;
      if (!snap.exists) throw new Error('Este ticket ya no está disponible.');
      const ticket = snap.data(), manager = C.canManage(FutunetAuth.getUserData(), ticket);
      if (internal && !manager) throw new Error('No puedes añadir notas internas.');
      if (!internal && ticket.status === 'closed') throw new Error('El ticket está cerrado. Crea otro caso si necesitas más ayuda.');
      tx.set(messageRef, { body, authorId: user.uid, authorName: (user.displayName || user.email || 'Usuario').slice(0, 150),
        authorRole: manager ? 'staff' : 'customer', createdAt: stamp() });
      if (!internal) tx.update(ref, { updatedAt: stamp(), updatedBy: user.uid, lastMessageId: messageId,
        revision: ticket.revision + 1, status: !manager && ['waiting', 'resolved'].includes(ticket.status) ? 'open' : ticket.status });
    });
  }
  window.FutunetSupportService = { identity, newId, create, update, reply, watchTickets, screenshot };
})();
