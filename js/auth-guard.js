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
          var currentPage = window.location.pathname.split('/').pop() + window.location.search;
          window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
          return;
        }
        var userData = FutunetAuth.getUserData();
        if (userData && userData.status === 'disabled') {
          FutunetAuth.signOut().then(function () {
            window.location.href = 'login.html';
          });
          return;
        }

        // Tenant-restricted users are strictly locked to their assigned companyCode
        if (userData && userData.companyCode) {
          localStorage.setItem('active_company_code', userData.companyCode.toUpperCase());
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

    /**
     * Require platform access (must be platform editor/admin and NOT have a companyCode restriction)
     */
    requirePlatformEditor: function (callback) {
      this.requireAuth(function (user, userData) {
        if (userData && userData.companyCode) {
          // Tenant ERP users cannot access global platform admin panel
          window.location.href = 'mi-cuenta.html';
          return;
        }
        if (userData && userData.role !== 'superadmin' && userData.role !== 'admin' && userData.role !== 'editor') {
          window.location.href = 'mi-cuenta.html';
          return;
        }
        callback(user, userData);
      });
    },

    /**
     * Require ERP Access (either erp_admin, erp_operator, or general admin/editor with a companyCode)
     */
    requireErpAccess: function (minRole, callback) {
      this.requireAuth(function (user, userData) {
        const roles = Array.from(new Set([
          userData ? (userData.role || 'user') : 'user',
          ...((userData && Array.isArray(userData.roles)) ? userData.roles : [])
        ]));
        const assignedCompany = userData && userData.companyCode
          ? String(userData.companyCode).toLowerCase().replace(/^futunet$/, 'futunetsrl')
          : '';
        const activeCompany = assignedCompany || (localStorage.getItem('active_company_code') || 'CREATICOS').toLowerCase();
        const supportedCompanies = ['creaticos', 'futunetsrl', 'panitas'];

        if (!supportedCompanies.includes(activeCompany)) {
          window.location.href = 'mi-cuenta.html';
          return;
        }
        if (assignedCompany) localStorage.setItem('active_company_code', activeCompany.toUpperCase());

        // Platform superadmins can access any ERP
        if (roles.includes('superadmin') && userData && !userData.companyCode) {
          callback(user, userData);
          return;
        }

        // Tenant users must have a company code to access the ERP
        if (userData && !userData.companyCode) {
          window.location.href = 'mi-cuenta.html';
          return;
        }

        // Validate roles
        const tenantAdminRole = activeCompany + '_admin';
        const tenantOperatorRole = activeCompany + '_operator';
        const tenantUserRole = activeCompany + '_user';
        const tenantUsuarioRole = activeCompany + '_usuario';

        const hasAdminPrivilege = roles.includes('superadmin') || 
                                  roles.includes('admin') || 
                                  roles.includes('erp_admin') || 
                                  roles.includes(tenantAdminRole);

        const hasOperatorPrivilege = hasAdminPrivilege || 
                                     roles.includes('editor') || 
                                     roles.includes('erp_operator') || 
                                     roles.includes(tenantOperatorRole) ||
                                     roles.includes(tenantUserRole) ||
                                     roles.includes(tenantUsuarioRole);

        if (minRole === 'erp_admin') {
          if (!hasAdminPrivilege) {
            window.location.href = 'mi-cuenta.html';
            return;
          }
        } else if (minRole === 'erp_operator') {
          if (!hasOperatorPrivilege) {
            window.location.href = 'mi-cuenta.html';
            return;
          }
        } else {
          // General fallback
          if (!hasOperatorPrivilege) {
            window.location.href = 'mi-cuenta.html';
            return;
          }
        }

        callback(user, userData);
      });
    },

    requireEditor: function (callback) { this.requireRole('editor', callback); },
    requireAdmin: function (callback) { this.requireRole('admin', callback); },
    requireSuperAdmin: function (callback) { this.requireRole('superadmin', callback); }
  };
})();
