// ============================================================
// client/js/dashboard.js
// Dashboard page: load stats, recent tasks, upcoming tasks
// ============================================================

(async function initDashboard() {
  // Set greeting and date
  const user = getCurrentUser();
  const greetEl    = document.getElementById('greetingTitle');
  const subEl      = document.getElementById('greetingSubtitle');
  const dateEl     = document.getElementById('currentDate');

  if (greetEl && user) {
    greetEl.textContent = `${getGreeting()}, ${user.name.split(' ')[0]} 👋`;
  }
  if (subEl) {
    subEl.textContent = "Here's what's happening with your tasks today.";
  }
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  try {
    const data = await api.get('/tasks/stats');
    renderStats(data.stats);
    renderRecentTasks(data.recentTasks || []);
    renderUpcomingTasks(data.upcomingTasks || []);
  } catch (err) {
    showToast('Failed to load dashboard data: ' + err.message, 'error');
  }
})();

function renderStats(stats) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '0';
  };

  set('statTotal',        stats.total);
  set('statPending',      stats.pending);
  set('statInProgress',   stats.inProgress);
  set('statCompleted',    stats.completed);
  set('statHighPriority', stats.highPriority);
  const overdueEl = document.getElementById('statOverdue');
  if (overdueEl) {
    overdueEl.textContent = stats.overdue > 0 ? `⚠ ${stats.overdue} overdue` : '';
  }

  // Progress bars
  const total = stats.total || 1;
  const completedPct   = Math.round((stats.completed   / total) * 100);
  const inProgressPct  = Math.round((stats.inProgress  / total) * 100);
  const pendingPct     = Math.round((stats.pending      / total) * 100);

  setProgress('progressBar',    'progressPct',    completedPct);
  setProgress('inProgressBar',  'inProgressPct',  inProgressPct);
  setProgress('pendingBar',     'pendingPct',      pendingPct);
}

function setProgress(barId, pctId, pct) {
  const bar = document.getElementById(barId);
  const lbl = document.getElementById(pctId);
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = pct + '%';
}

function renderRecentTasks(tasks) {
  const container = document.getElementById('recentTasksList');
  if (!container) return;

  if (!tasks.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h5>No tasks yet</h5>
        <p>Create your first task to get started.</p>
        <a href="tasks.html" class="btn-tf-primary mt-3 d-inline-block" style="padding:.5rem 1.25rem;">+ Create Task</a>
      </div>`;
    return;
  }

  container.innerHTML = tasks.map((t) => {
    const due = t.dueDate ? formatRelativeDate(t.dueDate) : null;
    const dueCls = isOverdue(t.dueDate) && t.status !== 'Completed' ? 'overdue'
                 : isDueSoon(t.dueDate) ? 'due-soon' : '';
    return `
      <div class="task-item ${t.status === 'Completed' ? 'completed' : ''}">
        <div>
          <div class="task-title">${escapeHtml(t.title)}</div>
          <div class="task-meta">
            ${statusBadge(t.status)}
            ${priorityBadge(t.priority)}
            ${t.category ? `<span>${escapeHtml(t.category)}</span>` : ''}
            ${due ? `<span class="${dueCls}">📅 ${due}</span>` : ''}
          </div>
        </div>
        <a href="tasks.html" class="btn-icon ms-2" title="View tasks" style="flex-shrink:0;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>`;
  }).join('');
}

function renderUpcomingTasks(tasks) {
  const container = document.getElementById('upcomingList');
  if (!container) return;

  if (!tasks.length) {
    container.innerHTML = `
      <div class="empty-state py-3">
        <div class="empty-state-icon" style="font-size:1.5rem;">📅</div>
        <p style="font-size:.8rem;">No upcoming deadlines in the next 7 days.</p>
      </div>`;
    return;
  }

  container.innerHTML = tasks.map((t) => {
    const due = formatRelativeDate(t.dueDate);
    const dueCls = isDueSoon(t.dueDate, 1) ? 'overdue' : 'due-soon';
    return `
      <div class="task-item" style="padding:.75rem 1.25rem;">
        <div class="priority-dot ${t.priority.toLowerCase()}" style="margin-top:6px;flex-shrink:0;"></div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:.875rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(t.title)}</div>
          <div style="font-size:.75rem;" class="${dueCls}">${due}</div>
        </div>
        ${statusBadge(t.status)}
      </div>`;
  }).join('');
}
