/**
 * Futunet Auth Module
 * Maneja login, registro, roles y estado de autenticación
 * Seguridad: Firebase Auth + Firestore Rules (NoSQL, inmune a SQL injection)
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

  // ─── Determine role for new user (first user = superadmin) ───
  async function determineNewUserRole() {
    try {
      var snapshot = await getDB().collection('users').limit(1).get();
      if (snapshot.empty) {
        return ROLES.SUPERADMIN; // First user ever → superadmin
      }
    } catch (e) {
      console.warn('Could not check user count, defaulting to user role:', e);
    }
    return ROLES.USER;
  }

  // ─── Create/ensure user document in Firestore ───
  async function ensureUserDoc(uid, data) {
    try {
      var role = await determineNewUserRole();
      await getDB().collection('users').doc(uid).set({
        displayName: data.displayName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: '',
        role: role,
        status: 'active',
        favorites: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('%c✅ User doc created with role: ' + role, 'color: #27ae60');
      return role;
    } catch (err) {
      console.error('Firestore write failed:', err);
      // Still allow auth to work even if Firestore fails
      return null;
    }
  }

  // ─── Sign Up ───
  async function signUp(email, password, displayName) {
    var auth = getAuth();
    var cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: displayName });

    // Create user document (resilient - won't block if Firestore fails)
    await ensureUserDoc(cred.user.uid, {
      displayName: displayName,
      email: email
    });

    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Sign In with Email ───
  async function signIn(email, password) {
    var cred = await getAuth().signInWithEmailAndPassword(email, password);
    // Update last login (best effort)
    getDB().collection('users').doc(cred.user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () { });
    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Sign In with Google ───
  async function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    var cred = await getAuth().signInWithPopup(provider);

    var userDoc;
    try {
      userDoc = await getDB().collection('users').doc(cred.user.uid).get();
    } catch (e) {
      userDoc = { exists: false };
    }

    if (!userDoc.exists) {
      await ensureUserDoc(cred.user.uid, {
        displayName: cred.user.displayName || '',
        email: cred.user.email || '',
        phone: cred.user.phoneNumber || ''
      });
    } else {
      getDB().collection('users').doc(cred.user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function () { });
    }

    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Password Reset ───
  async function sendPasswordReset(email) {
    return getAuth().sendPasswordResetEmail(email);
  }

  // ─── Passwordless Sign In (Email Link) ───
  async function sendSignInLink(email) {
    var auth = getAuth();
    // Use the current URL path as the redirect URL (without query/hashes)
    var redirectUrl = window.location.origin + window.location.pathname;

    var actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true
    };

    await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    console.log('%c✉️ Sign-in link sent to ' + email, 'color: #2980b9');
  }

  function isSignInWithEmailLink(link) {
    return getAuth().isSignInWithEmailLink(link || window.location.href);
  }

  async function signInWithEmailLink(email, link) {
    var auth = getAuth();
    var cred = await auth.signInWithEmailLink(email, link || window.location.href);

    // Clean up email from localStorage
    window.localStorage.removeItem('emailForSignIn');

    // Check if Firestore user document exists, create if not
    var userDoc;
    try {
      userDoc = await getDB().collection('users').doc(cred.user.uid).get();
    } catch (e) {
      userDoc = { exists: false };
    }

    if (!userDoc.exists) {
      await ensureUserDoc(cred.user.uid, {
        displayName: cred.user.displayName || '',
        email: cred.user.email || email,
        phone: cred.user.phoneNumber || ''
      });
    } else {
      getDB().collection('users').doc(cred.user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function () { });
    }

    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }


  // ─── Sign Out ───
  async function signOut() {
    currentUserData = null;
    return getAuth().signOut();
  }

  // ─── Fetch user data from Firestore ───
  async function fetchUserData(uid) {
    try {
      var doc = await getDB().collection('users').doc(uid).get();
      if (doc.exists) {
        return { uid: uid, ...doc.data() };
      }
    } catch (e) {
      console.warn('Could not fetch user data:', e);
    }
    // Return minimal data from Auth if Firestore unavailable
    var authUser = getAuth().currentUser;
    if (authUser) {
      return {
        uid: authUser.uid,
        displayName: authUser.displayName || '',
        email: authUser.email || '',
        role: ROLES.USER,
        status: 'active'
      };
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

  window.addEventListener('futunet-auth-ready', renderNavbarAuth);

  // ─── Public API ───
  window.FutunetAuth = {
    signUp: signUp,
    signIn: signIn,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    sendPasswordReset: sendPasswordReset,
    sendSignInLink: sendSignInLink,
    isSignInWithEmailLink: isSignInWithEmailLink,
    signInWithEmailLink: signInWithEmailLink,
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
