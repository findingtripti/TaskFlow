// ============================================================
// client/js/utils.js
// Shared utility functions for all pages
// ============================================================

const API_BASE = '/api';

// ── Toast Notifications ────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `tf-toast ${type}`;
  toast.innerHTML = `
    <span class="tf-toast-icon">${icons[type] || icons.info}</span>
    <span class="tf-toast-msg">${message}</span>
    <button class="tf-toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Form Validation Helpers ────────────────────────────────
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + '-err');
  if (field) field.classList.add('field-error');
  if (errEl) { errEl.textContent = message; errEl.style.display = 'block'; }
}

function clearFormErrors(fieldIds) {
  fieldIds.forEach((id) => {
    const field = document.getElementById(id);
    const errEl = document.getElementById(id + '-err');
    if (field) field.classList.remove('field-error');
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
  });
}

// ── Password Toggle ────────────────────────────────────────
function togglePassword(fieldId, iconId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.type = field.type === 'password' ? 'text' : 'password';
}

// ── Date Formatting ────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && !isNaN(new Date(dateStr));
}

function isDueSoon(dateStr, days = 3) {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  const now = new Date();
  const diff = (due - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));
  if (diff < -1) return `${Math.abs(diff)} days overdue`;
  if (diff === -1) return 'Due yesterday';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff <= 7) return `Due in ${diff} days`;
  return formatDate(dateStr);
}

// ── Status Badge HTML ──────────────────────────────────────
function statusBadge(status) {
  const map = {
    'Pending':     'badge-status badge-pending',
    'In Progress': 'badge-status badge-inprogress',
    'Completed':   'badge-status badge-completed',
  };
  return `<span class="${map[status] || 'badge-status'}">${status}</span>`;
}

function priorityBadge(priority) {
  const map = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
  return `<span class="badge-status ${map[priority] || ''}">${priority}</span>`;
}

// ── Sidebar Mobile ─────────────────────────────────────────
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
}

// ── Greeting ───────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Safe Text (prevent XSS) ────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
