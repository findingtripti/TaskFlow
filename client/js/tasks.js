// ============================================================
// client/js/tasks.js
// Tasks page: full CRUD, filtering, search, pagination
// ============================================================

let currentView     = 'table'; // 'table' | 'cards'
let currentPage     = 1;
let searchTimeout   = null;
let editingTaskId   = null;
let deletingTaskId  = null;

// Bootstrap modal instances
let taskModalInst   = null;
let deleteModalInst = null;

// ── Initialize ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  taskModalInst   = new bootstrap.Modal(document.getElementById('taskModal'));
  deleteModalInst = new bootstrap.Modal(document.getElementById('deleteModal'));

  loadTasks();

  // Task form submit
  document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);

  // Confirm delete
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
});

// ── Load Tasks ─────────────────────────────────────────────
async function loadTasks(page = 1) {
  currentPage = page;
  const params = buildQueryParams(page);
  showLoadingState(true);

  try {
    const data = await api.get('/tasks', params);
    renderTasks(data.tasks || [], data.total || 0);
    renderPagination(data.page, data.pages);
  } catch (err) {
    showToast('Failed to load tasks: ' + err.message, 'error');
    renderTasks([], 0);
  } finally {
    showLoadingState(false);
  }
}

function buildQueryParams(page) {
  const params = { page, limit: 15 };
  const status   = document.getElementById('filterStatus')?.value;
  const priority = document.getElementById('filterPriority')?.value;
  const sort     = document.getElementById('sortBy')?.value;
  const search   = document.getElementById('searchInput')?.value.trim();
  if (status)   params.status   = status;
  if (priority) params.priority = priority;
  if (sort)     params.sort     = sort;
  if (search)   params.search   = search;
  return params;
}

function showLoadingState(show) {
  const wrapper = document.getElementById('tasksWrapper');
  let overlay = wrapper.querySelector('.loading-overlay');
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="tf-spinner"></div>';
      wrapper.appendChild(overlay);
    }
  } else {
    overlay?.remove();
  }
}

// ── Render Tasks ───────────────────────────────────────────
function renderTasks(tasks, total) {
  const container = document.getElementById('tasksContainer');
  const countEl   = document.getElementById('taskCount');

  if (countEl) countEl.textContent = `${total} task${total !== 1 ? 's' : ''} found`;

  if (!tasks.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h5>No tasks found</h5>
        <p>Try adjusting your filters or create a new task.</p>
        <button class="btn-tf-primary mt-3" onclick="openTaskModal()" style="padding:.5rem 1.25rem;">+ Create Task</button>
      </div>`;
    return;
  }

  container.innerHTML = currentView === 'table'
    ? renderTableView(tasks)
    : renderCardView(tasks);
}

function renderTableView(tasks) {
  const rows = tasks.map((t) => {
    const due    = t.dueDate ? formatRelativeDate(t.dueDate) : '—';
    const dueCls = isOverdue(t.dueDate) && t.status !== 'Completed' ? 'overdue'
                 : isDueSoon(t.dueDate) ? 'due-soon' : '';
    return `
      <tr>
        <td>
          <div style="font-weight:600;max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${t.status==='Completed'?'text-decoration:line-through;color:#94a3b8;':''}"
               title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>
          ${t.description ? `<div style="font-size:.75rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;">${escapeHtml(t.description.substring(0,60))}${t.description.length>60?'…':''}</div>` : ''}
        </td>
        <td>${statusBadge(t.status)}</td>
        <td>${priorityBadge(t.priority)}</td>
        <td style="font-size:.8125rem;">${t.category ? escapeHtml(t.category) : '—'}</td>
        <td style="font-size:.8125rem;" class="${dueCls}">${due}</td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn-icon" onclick="quickStatusCycle('${t._id}','${t.status}')" title="Change status">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            </button>
            <button class="btn-icon" onclick="openTaskModal('${t._id}')" title="Edit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon danger" onclick="openDeleteModal('${t._id}','${escapeHtml(t.title)}')" title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  return `
    <div style="overflow-x:auto;">
      <table class="tf-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderCardView(tasks) {
  const cards = tasks.map((t) => {
    const due    = t.dueDate ? formatRelativeDate(t.dueDate) : null;
    const dueCls = isOverdue(t.dueDate) && t.status !== 'Completed' ? 'overdue'
                 : isDueSoon(t.dueDate) ? 'due-soon' : '';
    return `
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="tf-card h-100" style="display:flex;flex-direction:column;">
          <div style="padding:1rem 1.25rem;flex:1;">
            <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
              <div class="d-flex align-items-center gap-2">
                <span class="priority-dot ${t.priority.toLowerCase()}"></span>
                <span style="font-size:.8rem;color:var(--text-muted);">${escapeHtml(t.category || 'General')}</span>
              </div>
              ${statusBadge(t.status)}
            </div>
            <h5 style="font-size:.9375rem;font-weight:700;margin-bottom:.5rem;${t.status==='Completed'?'text-decoration:line-through;color:#94a3b8;':''}">${escapeHtml(t.title)}</h5>
            ${t.description ? `<p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.75rem;">${escapeHtml(t.description.substring(0,100))}${t.description.length>100?'…':''}</p>` : ''}
            ${due ? `<div style="font-size:.78rem;" class="${dueCls}">📅 ${due}</div>` : ''}
          </div>
          <div style="padding:.75rem 1.25rem;border-top:1px solid var(--border-color);display:flex;gap:.5rem;justify-content:flex-end;">
            <button class="btn-icon" onclick="quickStatusCycle('${t._id}','${t.status}')" title="Change status">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            </button>
            <button class="btn-icon" onclick="openTaskModal('${t._id}')" title="Edit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon danger" onclick="openDeleteModal('${t._id}','${escapeHtml(t.title)}')" title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
  return `<div class="row g-3 p-3">${cards}</div>`;
}

// ── Pagination ─────────────────────────────────────────────
function renderPagination(page, pages) {
  const container = document.getElementById('paginationContainer');
  const list      = document.getElementById('paginationList');
  if (!container || !list) return;

  if (pages <= 1) { container.classList.add('d-none'); return; }
  container.classList.remove('d-none');

  let html = '';
  html += `<li class="page-item ${page<=1?'disabled':''}">
    <a class="page-link" href="#" onclick="loadTasks(${page-1});return false;">«</a></li>`;
  for (let i = 1; i <= pages; i++) {
    html += `<li class="page-item ${i===page?'active':''}">
      <a class="page-link" href="#" onclick="loadTasks(${i});return false;">${i}</a></li>`;
  }
  html += `<li class="page-item ${page>=pages?'disabled':''}">
    <a class="page-link" href="#" onclick="loadTasks(${page+1});return false;">»</a></li>`;
  list.innerHTML = html;
}

// ── View Toggle ────────────────────────────────────────────
function setView(view) {
  currentView = view;
  document.getElementById('viewTable')?.classList.toggle('active', view === 'table');
  document.getElementById('viewCards')?.classList.toggle('active', view === 'cards');
  loadTasks(currentPage);
}

// ── Search (debounced) ─────────────────────────────────────
function onSearchChange(val) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => loadTasks(1), 400);
}

// ── Apply Filters ──────────────────────────────────────────
function applyFilters() { loadTasks(1); }

function resetFilters() {
  document.getElementById('filterStatus').value   = '';
  document.getElementById('filterPriority').value = '';
  document.getElementById('sortBy').value         = '';
  document.getElementById('searchInput').value    = '';
  loadTasks(1);
}

// ── Quick Status Cycle ─────────────────────────────────────
const statusCycle = { 'Pending': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Pending' };

async function quickStatusCycle(taskId, currentStatus) {
  const newStatus = statusCycle[currentStatus] || 'Pending';
  try {
    await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    showToast(`Status → ${newStatus}`, 'success');
    loadTasks(currentPage);
  } catch (err) {
    showToast('Failed to update status: ' + err.message, 'error');
  }
}

// ── Open Task Modal (create or edit) ──────────────────────
async function openTaskModal(taskId = null) {
  editingTaskId = taskId;
  clearFormErrors(['taskTitle']);
  document.getElementById('task-form-error')?.classList.add('d-none');
  document.getElementById('taskForm').reset();

  const title = document.getElementById('taskModalTitle');

  if (taskId) {
    title.textContent = 'Edit Task';
    document.getElementById('taskSubmitBtn').textContent = 'Update Task';
    try {
      const data = await api.get(`/tasks/${taskId}`);
      const t = data.task;
      document.getElementById('taskTitle').value    = t.title || '';
      document.getElementById('taskDesc').value     = t.description || '';
      document.getElementById('taskPriority').value = t.priority || 'Medium';
      document.getElementById('taskStatus').value   = t.status || 'Pending';
      document.getElementById('taskCategory').value = t.category || '';
      document.getElementById('taskDueDate').value  = t.dueDate ? t.dueDate.split('T')[0] : '';
      document.getElementById('taskTags').value     = (t.tags || []).join(', ');
    } catch (err) {
      showToast('Failed to load task: ' + err.message, 'error');
      return;
    }
  } else {
    title.textContent = 'New Task';
    document.getElementById('taskSubmitBtn').textContent = 'Save Task';
  }

  taskModalInst.show();
}

// ── Handle Task Form Submit ────────────────────────────────
async function handleTaskSubmit(e) {
  e.preventDefault();
  clearFormErrors(['taskTitle']);
  document.getElementById('task-form-error')?.classList.add('d-none');

  const title    = document.getElementById('taskTitle').value.trim();
  const desc     = document.getElementById('taskDesc').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const status   = document.getElementById('taskStatus').value;
  const category = document.getElementById('taskCategory').value.trim();
  const dueDate  = document.getElementById('taskDueDate').value;
  const tagsRaw  = document.getElementById('taskTags').value;
  const tags     = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!title || title.length < 3) {
    showFieldError('taskTitle', 'Title must be at least 3 characters.');
    return;
  }

  const btn = document.getElementById('taskSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="tf-spinner me-2"></span> Saving…';

  const payload = { title, description: desc, priority, status, category, dueDate: dueDate || null, tags };

  try {
    if (editingTaskId) {
      await api.put(`/tasks/${editingTaskId}`, payload);
      showToast('Task updated successfully!', 'success');
    } else {
      await api.post('/tasks', payload);
      showToast('Task created successfully!', 'success');
    }
    taskModalInst.hide();
    loadTasks(currentPage);
  } catch (err) {
    const errEl = document.getElementById('task-form-error');
    if (errEl) { errEl.textContent = err.message; errEl.classList.remove('d-none'); }
  } finally {
    btn.disabled = false;
    btn.textContent = editingTaskId ? 'Update Task' : 'Save Task';
  }
}

// ── Delete Task ────────────────────────────────────────────
function openDeleteModal(taskId, taskTitle) {
  deletingTaskId = taskId;
  document.getElementById('deleteTaskTitle').textContent = taskTitle;
  deleteModalInst.show();
}

async function confirmDelete() {
  if (!deletingTaskId) return;
  const btn = document.getElementById('confirmDeleteBtn');
  btn.disabled = true;
  btn.textContent = 'Deleting…';
  try {
    await api.delete(`/tasks/${deletingTaskId}`);
    showToast('Task deleted.', 'success');
    deleteModalInst.hide();
    loadTasks(currentPage);
  } catch (err) {
    showToast('Failed to delete task: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Delete';
    deletingTaskId = null;
  }
}
