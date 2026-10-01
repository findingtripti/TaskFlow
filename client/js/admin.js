// ============================================================
// client/js/admin.js
// Admin dashboard: platform stats, top users
// ============================================================

(async function initAdminDashboard() {
  try {
    const data = await api.get('/admin/stats');
    renderAdminStats(data.stats);
    renderTopUsers(data.topUsers || []);
  } catch (err) {
    showToast('Failed to load admin stats: ' + err.message, 'error');
  }
})();

function renderAdminStats(stats) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '0';
  };

  set('statTotalUsers',      stats.totalUsers);
  set('statActiveUsers',     stats.activeUsers);
  set('statNewUsers',        `${stats.newUsersThisMonth} new this month`);
  set('statTotalTasks',      stats.totalTasks);
  set('statTotalCompleted',  stats.completedTasks);
  set('statTotalHigh',       stats.highPriorityTasks);
  set('statTotalPending',    stats.pendingTasks);
  set('statTotalInProgress', stats.inProgressTasks);

  const total = stats.totalTasks || 1;
  const rate  = Math.round((stats.completedTasks / total) * 100);
  set('statCompletionRate',    `${rate}% completion rate`);
  set('statCompletionRatePct', `${rate}%`);

  // Progress bars
  const cp = Math.round((stats.completedTasks   / total) * 100);
  const ip = Math.round((stats.inProgressTasks  / total) * 100);
  const pp = Math.round((stats.pendingTasks      / total) * 100);

  setBar('a-completedBar',   'a-completedPct',   cp);
  setBar('a-inProgressBar',  'a-inProgressPct',  ip);
  setBar('a-pendingBar',     'a-pendingPct',      pp);
}

function setBar(barId, pctId, pct) {
  const bar = document.getElementById(barId);
  const lbl = document.getElementById(pctId);
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = pct + '%';
}

function renderTopUsers(users) {
  const container = document.getElementById('topUsersList');
  if (!container) return;

  if (!users.length) {
    container.innerHTML = `<div class="empty-state py-3"><p style="font-size:.8rem;">No user data available.</p></div>`;
    return;
  }

  container.innerHTML = users.map((u, i) => `
    <div class="task-item" style="padding:.75rem 1.25rem;">
      <div style="width:20px;font-size:.8rem;font-weight:700;color:var(--text-muted);flex-shrink:0;">#${i+1}</div>
      <div class="user-avatar-sm">${(u.name || 'U')[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.875rem;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(u.name)}</div>
        <div style="font-size:.75rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(u.email)}</div>
      </div>
      <span class="badge-status badge-inprogress" style="font-size:.69rem;font-weight:700;">
        ${u.taskCount} task${u.taskCount !== 1 ? 's' : ''}
      </span>
    </div>
  `).join('');
}
