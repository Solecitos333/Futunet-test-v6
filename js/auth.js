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
  // Fallback seguro: lee /config/setup para verificar si la BD requiere inicialización,
  // evitando el listado global de usuarios que ahora está denegado por reglas de seguridad.
  async function determineNewUserRole() {
    try {
      var doc = await getDB().collection('config').doc('setup').get();
      if (!doc.exists) {
        return ROLES.SUPERADMIN; // El documento centinela no existe → primer usuario = superadmin
      }
    } catch (e) {
      console.warn('No se pudo comprobar el estado de instalación, usando rol estándar:', e);
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

      // Si el rol creado fue superadmin, inicializamos el centinela
      if (role === ROLES.SUPERADMIN) {
        await getDB().collection('config').doc('setup').set({
          initialized: true,
          initializedAt: firebase.firestore.FieldValue.serverTimestamp(),
          initializedBy: uid
        }).catch(function (e) {
          console.warn('No se pudo inicializar el documento centinela /config/setup:', e);
        });
      }

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

    // Send verification email
    await cred.user.sendEmailVerification();

    // Create user document (resilient - won't block if Firestore fails)
    await ensureUserDoc(cred.user.uid, {
      displayName: displayName,
      email: email
    });

    // Sign out immediately so they must verify and log in
    await auth.signOut();
    currentUserData = null;
    return cred.user;
  }

  // ─── Sign In with Email ───
  async function signIn(email, password) {
    var cred = await getAuth().signInWithEmailAndPassword(email, password);
    
    // Check if email is verified
    if (!cred.user.emailVerified) {
      await getAuth().signOut();
      currentUserData = null;
      var err = new Error('Por favor verifica tu correo electrónico antes de iniciar sesión.');
      err.code = 'auth/email-not-verified';
      throw err;
    }

    // Update last login (best effort)
    getDB().collection('users').doc(cred.user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () { });

    // Write audit log
    getDB().collection('audit_logs').add({
      action: 'Inicio de sesión',
      details: 'Inicio de sesión con correo y contraseña',
      userEmail: cred.user.email || 'Anónimo',
      userId: cred.user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

    currentUserData = await fetchUserData(cred.user.uid);
    return cred.user;
  }

  // ─── Resend Verification Email (Manual) ───
  async function resendVerification(email, password) {
    var auth = getAuth();
    var cred = await auth.signInWithEmailAndPassword(email, password);
    await cred.user.sendEmailVerification();
    await auth.signOut();
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

    // Write audit log
    getDB().collection('audit_logs').add({
      action: 'Inicio de sesión',
      details: 'Inicio de sesión con Google',
      userEmail: cred.user.email || 'Anónimo',
      userId: cred.user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

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

    // Write audit log
    getDB().collection('audit_logs').add({
      action: 'Inicio de sesión',
      details: 'Inicio de sesión con enlace de correo',
      userEmail: cred.user.email || email,
      userId: cred.user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

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
  function isLoggedIn() {
    var user = getAuth().currentUser;
    return !!(user && user.emailVerified);
  }

  // ─── Auth State Listener ───
  function onAuthChanged(callback) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user && user.emailVerified) {
        currentUserData = await fetchUserData(user.uid);
        if (currentUserData && currentUserData.status === 'disabled') {
          await signOut();
          callback(null, null);
          return;
        }
        callback(user, currentUserData);
      } else {
        currentUserData = null;
        callback(null, null);
      }
    });
  }

  // ─── Initialize auth state listener ───
  getAuth().onAuthStateChanged(async function (user) {
    if (user && user.emailVerified) {
      currentUserData = await fetchUserData(user.uid);
    } else {
      currentUserData = null;
    }
    authReadyResolve();
    window.dispatchEvent(new CustomEvent('futunet-auth-ready', {
      detail: { user: (user && user.emailVerified) ? user : null, userData: currentUserData }
    }));
  });

  // ─── Navbar Auth UI ───
  function renderNavbarAuth() {
    var containers = document.querySelectorAll('.navbar-auth-container');
    if (containers.length === 0) return;

    var user = getAuth().currentUser;
    var initials = '?';
    var name = 'Invitado';
    var isAdminUser = false;
    
    if (user && currentUserData) {
      initials = (currentUserData.displayName || user.email || '?').charAt(0).toUpperCase();
      name = currentUserData.displayName || user.email;
      isAdminUser = hasRole(ROLES.EDITOR);
    }

    containers.forEach(function(container, index) {
      var idSuffix = '-' + index;
      if (user && currentUserData) {
        container.innerHTML =
          '<div class="nav-auth-user" id="nav-auth-toggle' + idSuffix + '">' +
          '  <div class="nav-auth-avatar">' + initials + '</div>' +
          '  <span class="nav-auth-name">' + name + '</span>' +
          '  <i data-lucide="chevron-down" class="nav-auth-chevron"></i>' +
          '</div>' +
          '<div class="nav-auth-dropdown" id="nav-auth-dropdown' + idSuffix + '">' +
          (isAdminUser ? '<a href="admin.html" class="nav-auth-dropdown-item"><i data-lucide="layout-dashboard"></i> Dashboard</a>' : '') +
          '  <a href="mi-cuenta.html" class="nav-auth-dropdown-item"><i data-lucide="user"></i> Mi cuenta</a>' +
          '  <div class="nav-auth-dropdown-divider"></div>' +
          '  <button class="nav-auth-dropdown-item nav-auth-logout" id="nav-auth-logout' + idSuffix + '"><i data-lucide="log-out"></i> Cerrar sesión</button>' +
          '</div>';

        var toggle = document.getElementById('nav-auth-toggle' + idSuffix);
        var dropdown = document.getElementById('nav-auth-dropdown' + idSuffix);
        var logoutBtn = document.getElementById('nav-auth-logout' + idSuffix);

        if (toggle && dropdown) {
          toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isActive = dropdown.classList.contains('is-open');
            document.querySelectorAll('.nav-auth-dropdown.is-open').forEach(function(d){ d.classList.remove('is-open'); });
            if (!isActive) dropdown.classList.add('is-open');
          });
          document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
              dropdown.classList.remove('is-open');
            }
          });
        }

        if (logoutBtn) {
          logoutBtn.addEventListener('click', async function () {
            await signOut();
            window.location.href = 'index.html';
          });
        }
      } else {
        container.innerHTML =
          '<a href="login.html" class="nav-auth-btn-login">' +
          '  <i data-lucide="log-in"></i> Iniciar sesión' +
          '</a>';
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  window.addEventListener('futunet-auth-ready', renderNavbarAuth);

  // ─── Public API ───
  window.FutunetAuth = {
    signUp: signUp,
    signIn: signIn,
    resendVerification: resendVerification,
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
