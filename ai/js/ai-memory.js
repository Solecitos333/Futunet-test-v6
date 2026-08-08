/**
 * Futunet AI Memory Module
 * Manages chat conversations in Firestore
 * Uses: window.FutunetFirebase.db (Firestore compat)
 */
(function() {
  'use strict';
  
  // Wait for Firebase to be ready
  function getDB() { return window.FutunetFirebase && window.FutunetFirebase.db; }
  function getAuth() { return window.FutunetFirebase && window.FutunetFirebase.auth; }
  function getUid() {
    const auth = getAuth();
    return auth && auth.currentUser ? auth.currentUser.uid : null;
  }
  
  // Collection path: ai_conversations/{uid}/chats/{chatId}
  function chatsRef() {
    const uid = getUid();
    if (!uid) throw new Error('Not authenticated');
    return getDB().collection('ai_conversations').doc(uid).collection('chats');
  }
  
  // Settings path: ai_settings/{uid}
  function settingsRef() {
    const uid = getUid();
    if (!uid) throw new Error('Not authenticated');
    return getDB().collection('ai_settings').doc(uid);
  }
  
  const AiMemory = {
    // Create a new chat
    createChat: async function(model) {
      const ref = await chatsRef().add({
        title: 'Nuevo chat',
        model: model || 'gemma4:latest',
        messages: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return ref.id;
    },
    
    // Add message to chat
    addMessage: async function(chatId, message) {
      // message = { role, content, thinking, images, timestamp }
      const chatRef = chatsRef().doc(chatId);
      await chatRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          ...message,
          timestamp: Date.now()
        }),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    },
    
    // Update full messages array (for edits/regeneration)
    updateMessages: async function(chatId, messages) {
      await chatsRef().doc(chatId).update({
        messages: messages,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    },
    
    // Load a specific chat
    loadChat: async function(chatId) {
      const doc = await chatsRef().doc(chatId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    },
    
    // List all chats (ordered by updatedAt desc)
    listChats: async function() {
      const snapshot = await chatsRef()
        .orderBy('updatedAt', 'desc')
        .limit(50)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    
    // Delete a chat
    deleteChat: async function(chatId) {
      await chatsRef().doc(chatId).delete();
    },
    
    // Rename a chat
    renameChat: async function(chatId, title) {
      await chatsRef().doc(chatId).update({ title: title });
    },
    
    // Auto-generate title from first message
    autoTitle: function(firstMessage) {
      if (!firstMessage) return 'Nuevo chat';
      const text = firstMessage.substring(0, 50);
      return text.length < firstMessage.length ? text + '...' : text;
    },
    
    // Listen to chat list changes in realtime
    onChatsChanged: function(callback) {
      return chatsRef()
        .orderBy('updatedAt', 'desc')
        .limit(50)
        .onSnapshot(snapshot => {
          const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(chats);
        });
    },
    
    // Save user settings
    saveSettings: async function(settings) {
      await settingsRef().set(settings, { merge: true });
    },
    
    // Load user settings
    loadSettings: async function() {
      const doc = await settingsRef().get();
      return doc.exists ? doc.data() : {};
    }
  };
  
  window.AiMemory = AiMemory;
})();
