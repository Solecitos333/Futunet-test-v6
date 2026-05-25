/**
 * Futunet Auth Module
 * Maneja login, registro, roles y estado de autenticación
 */
(function () {
  'use strict';

  const ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    USER: 'user'
  };

  const ROLE_HIERARCHY = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EDITOR, ROLES.USER];

  let currentUserData = null;
  let authReadyResolve;
  const authReady = new Promise(function (resolve) { authReadyResolve = resolve; });

  function getAuth() { return window.FutunetFirebase.auth; }
  function getDB() { return window.FutunetFirebase.db; }

  // ─── Sign Up ───
  async function signUp(email, password, displayName) {
    const auth = getAuth();
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: displayName });

    // Create user document in Firestore
    await getDB().collection('users').doc(cred.user.uid).set({
      displayName: displayName,
      email: email,
      phone: '',
      address: '',
      role: ROLES.USER,
      status: 'active',
      favorites: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });

    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Sign In with Email ───
  async function signIn(email, password) {
    const cred = await getAuth().signInWithEmailAndPassword(email, password);
    await getDB().collection('users').doc(cred.user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () { });
    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Sign In with Google ───
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const cred = await getAuth().signInWithPopup(provider);

    const userDoc = await getDB().collection('users').doc(cred.user.uid).get();
    if (!userDoc.exists) {
      await getDB().collection('users').doc(cred.user.uid).set({
        displayName: cred.user.displayName || '',
        email: cred.user.email || '',
        phone: cred.user.phoneNumber || '',
        address: '',
        role: ROLES.USER,
        status: 'active',
        favorites: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await getDB().collection('users').doc(cred.user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Password Reset ───
  async function sendPasswordReset(email) {
    return getAuth().sendPasswordResetEmail(email);
  }

  // ─── Sign Out ───
  async function signOut() {
    currentUserData = null;
    return getAuth().signOut();
  }

  // ─── Fetch user data from Firestore ───
  async function fetchUserData(uid) {
    const doc = await getDB().collection('users').doc(uid).get();
    if (doc.exists) {
      return { uid: uid, ...doc.data() };
    }
    return null;
  }

  // ─── Role checks ───
  function getUserRole() {
    return currentUserData ? currentUserData.role : null;
  }

  function hasRole(requiredRole) {
    var userRole = getUserRole();
    if (!userRole) return false;
    var userLevel = ROLE_HIERARCHY.indexOf(userRole);
    var requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
    return userLevel >= 0 && userLevel <= requiredLevel;
  }

  function isSuperAdmin() { return getUserRole() === ROLES.SUPERADMIN; }
  function isAdmin() { return hasRole(ROLES.ADMIN); }
  function isEditor() { return hasRole(ROLES.EDITOR); }
  function isLoggedIn() { return !!getAuth().currentUser; }

  // ─── Auth State Listener ───
  function onAuthChanged(callback) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        currentUserData = await fetchUserData(user.uid);
        // Check if user is disabled
        if (currentUserData && currentUserData.status === 'disabled') {
          await signOut();
          callback(null, null);
          return;
        }
      } else {
        currentUserData = null;
      }
      callback(user, currentUserData);
    });
  }

  // ─── Initialize auth state listener ───
  getAuth().onAuthStateChanged(async function (user) {
    if (user) {
      currentUserData = await fetchUserData(user.uid);
    } else {
      currentUserData = null;
    }
    authReadyResolve();
    // Dispatch custom event for navbar etc.
    window.dispatchEvent(new CustomEvent('futunet-auth-ready', {
      detail: { user: user, userData: currentUserData }
    }));
  });

  // ─── Navbar Auth UI ───
  function renderNavbarAuth() {
    var container = document.getElementById('navbar-auth');
    if (!container) return;

    var user = getAuth().currentUser;
    if (user && currentUserData) {
      var initials = (currentUserData.displayName || user.email || '?').charAt(0).toUpperCase();
      var name = currentUserData.displayName || user.email;
      var isAdminUser = hasRole(ROLES.EDITOR);

      container.innerHTML =
        '<div class="nav-auth-user" id="nav-auth-toggle">' +
        '  <div class="nav-auth-avatar">' + initials + '</div>' +
        '  <span class="nav-auth-name">' + name + '</span>' +
        '  <i data-lucide="chevron-down" class="nav-auth-chevron"></i>' +
        '</div>' +
        '<div class="nav-auth-dropdown" id="nav-auth-dropdown">' +
        (isAdminUser ? '<a href="admin.html" class="nav-auth-dropdown-item"><i data-lucide="layout-dashboard"></i> Dashboard</a>' : '') +
        '  <a href="mi-cuenta.html" class="nav-auth-dropdown-item"><i data-lucide="user"></i> Mi cuenta</a>' +
        '  <div class="nav-auth-dropdown-divider"></div>' +
        '  <button class="nav-auth-dropdown-item nav-auth-logout" id="nav-auth-logout"><i data-lucide="log-out"></i> Cerrar sesión</button>' +
        '</div>';

      // Bind events
      var toggle = document.getElementById('nav-auth-toggle');
      var dropdown = document.getElementById('nav-auth-dropdown');
      var logoutBtn = document.getElementById('nav-auth-logout');

      if (toggle && dropdown) {
        toggle.addEventListener('click', function (e) {
          e.stopPropagation();
          dropdown.classList.toggle('is-open');
        });
        document.addEventListener('click', function () {
          dropdown.classList.remove('is-open');
        });
      }
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
          await signOut();
          window.location.href = 'index.html';
        });
      }

      if (window.lucide) window.lucide.createIcons();
    } else {
      container.innerHTML =
        '<a href="login.html" class="nav-auth-login">' +
        '  <i data-lucide="log-in"></i>' +
        '  <span>Iniciar sesión</span>' +
        '</a>';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // Listen for auth ready to render navbar
  window.addEventListener('futunet-auth-ready', renderNavbarAuth);

  // ─── Public API ───
  window.FutunetAuth = {
    signUp: signUp,
    signIn: signIn,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    sendPasswordReset: sendPasswordReset,
    onAuthChanged: onAuthChanged,
    getUserRole: getUserRole,
    getUserData: function () { return currentUserData; },
    getCurrentUser: function () { return getAuth().currentUser; },
    hasRole: hasRole,
    isSuperAdmin: isSuperAdmin,
    isAdmin: isAdmin,
    isEditor: isEditor,
    isLoggedIn: isLoggedIn,
    renderNavbarAuth: renderNavbarAuth,
    authReady: authReady,
    ROLES: ROLES
  };
})();
