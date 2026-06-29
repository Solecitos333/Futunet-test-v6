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

  // ─── Create/ensure user document in Firestore ───
  // El registro público siempre crea usuarios sin privilegios.
  // Los administradores se aprovisionan exclusivamente desde un entorno confiable.
  async function ensureUserDoc(uid, data) {
    try {
      var userRef = getDB().collection('users').doc(uid);
      var role = ROLES.USER;

      await userRef.set({
        displayName: data.displayName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: '',
        role: role,
        roles: [ROLES.USER],
        status: data.status || 'active',
        favorites: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log('%c✅ User doc created with role: ' + role, 'color: #27ae60');
      return role;
    } catch (err) {
      console.error('Firestore transaction write failed:', err);
      return null;
    }
  }

  // ─── Sign Up ───
  async function signUp(email, password, displayName) {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_\.\-\/])[A-Za-z\d@$!%*?&#^_\.\-\/]{8,}$/;
    if (!passwordRegex.test(password)) {
      var err = new Error('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.');
      err.code = 'auth/weak-password';
      throw err;
    }
    var auth = getAuth();
    var cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: displayName });

    // Send verification email
    await cred.user.sendEmailVerification();

    // Create user document (resilient - won't block if Firestore fails)
    await ensureUserDoc(cred.user.uid, {
      displayName: displayName,
      email: email,
      status: 'pending_verification'
    });

    // Sign out immediately so they must verify and log in
    await auth.signOut();
    currentUserData = null;
    return cred.user;
  }

  // ─── Sign In with Email ───
  async function signIn(email, password, remember = true, companyCode = '') {
    var persistence = remember 
      ? firebase.auth.Auth.Persistence.LOCAL 
      : firebase.auth.Auth.Persistence.SESSION;
    await getAuth().setPersistence(persistence);
    var cred = await getAuth().signInWithEmailAndPassword(email, password);
    
    currentUserData = await fetchUserData(cred.user.uid);

    // Firestore exige correo verificado para cualquier operación privada.
    if (!cred.user.emailVerified) {
      await getAuth().signOut();
      currentUserData = null;
      var err = new Error('Por favor verifica tu correo electrónico antes de iniciar sesión.');
      err.code = 'auth/email-not-verified';
      throw err;
    }

    // Verify companyCode if provided
    if (companyCode) {
      const codeUpper = companyCode.trim().toUpperCase() === 'FUTUNET' ? 'FUTUNETSRL' : companyCode.trim().toUpperCase();
      const supportedCompanies = ['CREATICOS', 'FUTUNETSRL', 'PANITAS'];
      const roles = Array.from(new Set([
        currentUserData ? (currentUserData.role || 'user') : 'user',
        ...((currentUserData && Array.isArray(currentUserData.roles)) ? currentUserData.roles : [])
      ]));
      const isPlatformSuperAdmin = roles.includes('superadmin') && currentUserData && !currentUserData.companyCode;

      if (!supportedCompanies.includes(codeUpper)) {
        await getAuth().signOut();
        currentUserData = null;
        var unsupportedErr = new Error('El código de empresa no corresponde a una empresa habilitada.');
        unsupportedErr.code = 'auth/unsupported-company-code';
        throw unsupportedErr;
      }

      if ((!currentUserData || !currentUserData.companyCode) && !isPlatformSuperAdmin) {
        await getAuth().signOut();
        currentUserData = null;
        var unassignedErr = new Error('Esta cuenta todavía no ha sido asignada a una empresa. Solicita acceso a un administrador.');
        unassignedErr.code = 'auth/company-not-assigned';
        throw unassignedErr;
      } else if (currentUserData.companyCode &&
                 (currentUserData.companyCode.toUpperCase() === 'FUTUNET' ? 'FUTUNETSRL' : currentUserData.companyCode.toUpperCase()) !== codeUpper) {
        await getAuth().signOut();
        currentUserData = null;
        var err = new Error('El código de empresa es incorrecto para este usuario.');
        err.code = 'auth/invalid-company-code';
        throw err;
      } else if (isPlatformSuperAdmin) {
        localStorage.setItem('active_company_code', codeUpper);
      }
    }

    // Update last login (best effort) and activate status if verified
    var updateFields = {
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (currentUserData && currentUserData.status === 'pending_verification') {
      updateFields.status = 'active';
      currentUserData.status = 'active';
    }
    getDB().collection('users').doc(cred.user.uid).update(updateFields).catch(function () { });

    // Write audit log
    getDB().collection('audit_logs').add({
      action: 'Inicio de sesión',
      details: 'Inicio de sesión con correo y contraseña',
      userEmail: cred.user.email || 'Anónimo',
      userId: cred.user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function () {});

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
        phone: cred.user.phoneNumber || '',
        status: 'active'
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
    if (!currentUserData) return false;
    
    // Check in roles array if present
    if (Array.isArray(currentUserData.roles)) {
      // Direct match
      if (currentUserData.roles.includes(requiredRole)) return true;
      // Hierarchical match for standard roles
      for (var i = 0; i < currentUserData.roles.length; i++) {
        var r = currentUserData.roles[i];
        var userLevel = ROLE_HIERARCHY.indexOf(r);
        var requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
        if (userLevel >= 0 && requiredLevel >= 0 && userLevel <= requiredLevel) {
          return true;
        }
      }
    }

    // Fallback to legacy single role field
    var userRole = currentUserData.role;
    if (!userRole) return false;
    var userLevel = ROLE_HIERARCHY.indexOf(userRole);
    var requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
    return userLevel >= 0 && userLevel <= requiredLevel;
  }

  function isSuperAdmin() { return hasRole(ROLES.SUPERADMIN); }
  function isAdmin() { return hasRole(ROLES.ADMIN); }
  function isEditor() { return hasRole(ROLES.EDITOR); }
  function isLoggedIn() {
    var user = getAuth().currentUser;
    return !!user;
  }

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
        callback(user, currentUserData);
      } else {
        currentUserData = null;
        callback(null, null);
      }
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
      detail: { user: user ? user : null, userData: currentUserData }
    }));
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─── Navbar Auth UI ───
  function renderNavbarAuth() {
    var containers = document.querySelectorAll('.navbar-auth-container');
    if (containers.length === 0) return;

    var user = getAuth().currentUser;
    var initials = '?';
    var name = 'Invitado';
    var isAdminUser = false;
    
    if (user && currentUserData) {
      var rawInitials = (currentUserData.displayName || user.email || '?').charAt(0).toUpperCase();
      initials = escapeHtml(rawInitials);
      name = escapeHtml(currentUserData.displayName || user.email);
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
          '<a href="login.html" class="nav-auth-login">' +
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
