/**
 * Futunet Firebase Configuration
 * Inicializa Firebase App, Auth, Firestore y Storage
 * Usa Firebase Compat SDK (cargado via CDN en HTML)
 */
(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyC5hG5oVqO0aIBf57X8VYY_U25VhCH0lI4",
    authDomain: "futunet-web.firebaseapp.com",
    projectId: "futunet-web",
    storageBucket: "futunet-web.firebasestorage.app",
    messagingSenderId: "1085809050604",
    appId: "1:1085809050604:web:a2e3733348e7fc09da76c9",
    measurementId: "G-6W0SZ2ZDTV"
  };

  // Initialize Firebase (compat SDK)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Export references globally
  window.FutunetFirebase = {
    app: firebase.app(),
    auth: firebase.auth(),
    db: firebase.firestore(),
    storage: firebase.storage(),
    config: firebaseConfig
  };

  // Enable Firestore offline persistence (best-effort)
  firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(function (err) {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence: not supported in this browser');
    }
  });

  console.log('%c🔥 Firebase initialized', 'color: #0B7EB5; font-weight: bold;');
})();
