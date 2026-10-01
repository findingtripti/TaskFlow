// ============================================================
// client/js/theme.js
// Theme management – single source of truth for dark/light mode.
// Must be the FIRST script on every page (loaded in <head>).
// ============================================================

// ── Immediate apply (prevents flash) ──────────────────────
// Runs synchronously before any paint.
(function () {
  var saved = localStorage.getItem('tf_theme') || 'light';
  if (saved === 'dark') {
    // Apply to both <html> and <body> (body may not exist yet at this point,
    // but we also re-apply on DOMContentLoaded below).
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
})();

// ── Re-apply once body exists ──────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  _applyTheme(localStorage.getItem('tf_theme') || 'light');
  _updateToggleIcons();
});

// ── Internal helpers ───────────────────────────────────────
function _applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
    document.body.classList.remove('dark-mode');
  }
}

function _updateToggleIcons() {
  var isDark = document.body.classList.contains('dark-mode');
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.innerHTML = isDark
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

// ── Public API ─────────────────────────────────────────────
// Called by onclick="toggleTheme()" on every toggle button.
function toggleTheme() {
  var isDark = document.body.classList.contains('dark-mode');
  var next   = isDark ? 'light' : 'dark';
  localStorage.setItem('tf_theme', next);
  _applyTheme(next);
  _updateToggleIcons();
}

// Kept for backward compatibility (sidebar action buttons call updateToggleButtons).
function updateToggleButtons() {
  _updateToggleIcons();
}
