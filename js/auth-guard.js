/**
 * Futunet Auth Guard
 * Protección de rutas según rol de usuario
 */
(function () {
  'use strict';

  window.FutunetGuard = {
    /**
     * Require authentication. Redirects to login if not logged in.
     * @param {Function} callback - Called with (user, userData) when authenticated
     */
    requireAuth: function (callback) {
      FutunetAuth.authReady.then(function () {
        if (!FutunetAuth.isLoggedIn()) {
          window.location.href = 'login.html';
          return;
        }
        var userData = FutunetAuth.getUserData();
        if (userData && userData.status === 'disabled') {
          FutunetAuth.signOut().then(function () {
            window.location.href = 'login.html';
          });
          return;
        }
        callback(FutunetAuth.getCurrentUser(), userData);
      });
    },

    /**
     * Require a minimum role. Redirects if insufficient.
     * @param {string} minRole - Minimum role required
     * @param {Function} callback - Called with (user, userData) when authorized
     */
    requireRole: function (minRole, callback) {
      this.requireAuth(function (user, userData) {
        if (!FutunetAuth.hasRole(minRole)) {
          window.location.href = 'mi-cuenta.html';
          return;
        }
        callback(user, userData);
      });
    },

    requireEditor: function (callback) { this.requireRole('editor', callback); },
    requireAdmin: function (callback) { this.requireRole('admin', callback); },
    requireSuperAdmin: function (callback) { this.requireRole('superadmin', callback); }
  };
})();
