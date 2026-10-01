// ============================================================
// client/js/auth.js
// Authentication helpers: guard, logout, sidebar population
// Runs on every protected page
// ============================================================

// ── Guard: redirect to login if no token ──────────────────
// NOTE: Theme is managed exclusively by theme.js (loaded before this file).
(function requireAuth() {
  const publicPages = ['login.html', 'register.html', '404.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (publicPages.includes(currentPage)) return;

  const token = localStorage.getItem('tf_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Populate sidebar with stored user info immediately (no extra API call)
  const userRaw = localStorage.getItem('tf_user');
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      populateSidebar(user);

      // Admin guard: non-admins cannot access admin pages
      const adminPages = ['admin.html', 'admin-users.html'];
      if (adminPages.includes(currentPage) && user.role !== 'admin') {
        showToast('Access denied. Admin only.', 'error');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
      }
    } catch (_) {}
  }
})();

// ── Populate Sidebar User Info ─────────────────────────────
function populateSidebar(user) {
  const avatarEl = document.getElementById('sidebarAvatar');
  const nameEl   = document.getElementById('sidebarName');
  const roleEl   = document.getElementById('sidebarRole');

  if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
  if (nameEl)   nameEl.textContent   = user.name || 'User';
  if (roleEl)   roleEl.textContent   = user.role || 'user';
}

// ── Logout ─────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('tf_token');
  localStorage.removeItem('tf_user');
  showToast('Logged out successfully.', 'info');
  setTimeout(() => { window.location.href = 'login.html'; }, 500);
}

// ── Get current user from localStorage ────────────────────
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('tf_user')) || null;
  } catch (_) {
    return null;
  }
}
