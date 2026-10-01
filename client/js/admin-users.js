// ============================================================
// client/js/admin-users.js
// Admin User Management: list, search, toggle status, delete
// ============================================================

let usersCurrentPage = 1;
let usersSearchTimeout = null;
let userDeleteId = null;
let deleteUserModalInst = null;

document.addEventListener('DOMContentLoaded', () => {
  deleteUserModalInst = new bootstrap.Modal(document.getElementById('deleteUserModal'));
  document.getElementById('confirmDeleteUserBtn').addEventListener('click', confirmDeleteUser);
  loadUsers();
});

async function loadUsers(page = 1) {
  usersCurrentPage = page;
  const search = document.getElementById('userSearchInput')?.value.trim();
  const params = { page, limit: 15 };
  if (search) params.search = search;

  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);"><div class="tf-spinner" style="margin:0 auto .75rem;"></div>Loading…</td></tr>`;

  try {
    const data = await api.get('/admin/users', params);
    renderUsersTable(data.users || []);
    renderUsersPagination(data.page, data.pages);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load users: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No users found.</td></tr>`;
    return;
  }

  const currentUserId = getCurrentUser()?._id;

  tbody.innerHTML = users.map((u) => {
    const isSelf   = u._id === currentUserId;
    const isActive = u.isActive;
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:.75rem;">
            <div class="user-avatar-sm">${(u.name||'U')[0].toUpperCase()}</div>
            <div>
              <div style="font-weight:600;font-size:.875rem;">${escapeHtml(u.name)}</div>
              ${isSelf ? '<span style="font-size:.7rem;color:#4f46e5;">(you)</span>' : ''}
            </div>
          </div>
        </td>
        <td style="font-size:.8125rem;">${escapeHtml(u.email)}</td>
        <td>
          <span class="badge-status ${u.role==='admin' ? '' : 'badge-inprogress'}" style="${u.role==='admin'?'background:var(--badge-pending-bg);color:var(--badge-pending-fg);':''}">
            ${u.role === 'admin' ? '👑 admin' : u.role}
          </span>
        </td>
        <td>
          <span class="badge-status ${isActive ? 'badge-completed' : 'badge-high'}">
            ${isActive ? '● Active' : '○ Inactive'}
          </span>
        </td>
        <td style="font-size:.8125rem;">${formatDate(u.createdAt)}</td>
        <td style="font-size:.8125rem;">${u.lastLogin ? formatDate(u.lastLogin) : '—'}</td>
        <td>
          <div style="display:flex;gap:.5rem;">
            ${!isSelf ? `
              <button class="btn-icon" onclick="toggleUserStatus('${u._id}','${isActive}')"
                      title="${isActive ? 'Deactivate' : 'Activate'}" style="${isActive?'color:#f59e0b;':'color:#10b981;'}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  ${isActive
                    ? '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'
                    : '<polyline points="20 6 9 17 4 12"/>'}
                </svg>
              </button>
              <button class="btn-icon danger" onclick="openDeleteUserModal('${u._id}','${escapeHtml(u.name)}')" title="Delete user">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              </button>
            ` : '<span style="font-size:.75rem;color:#94a3b8;">—</span>'}
          </div>
        </td>
      </tr>`;
  }).join('');
}

async function toggleUserStatus(userId, currentActive) {
  try {
    const data = await api.patch(`/admin/users/${userId}/status`);
    showToast(data.message, 'success');
    loadUsers(usersCurrentPage);
  } catch (err) {
    showToast('Failed to update user: ' + err.message, 'error');
  }
}

function openDeleteUserModal(userId, userName) {
  userDeleteId = userId;
  document.getElementById('deleteUserName').textContent = userName;
  deleteUserModalInst.show();
}

async function confirmDeleteUser() {
  if (!userDeleteId) return;
  const btn = document.getElementById('confirmDeleteUserBtn');
  btn.disabled = true;
  btn.textContent = 'Deleting…';
  try {
    await api.delete(`/admin/users/${userDeleteId}`);
    showToast('User deleted successfully.', 'success');
    deleteUserModalInst.hide();
    loadUsers(usersCurrentPage);
  } catch (err) {
    showToast('Failed to delete user: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Delete';
    userDeleteId = null;
  }
}

function searchUsers(val) {
  clearTimeout(usersSearchTimeout);
  usersSearchTimeout = setTimeout(() => loadUsers(1), 400);
}

function renderUsersPagination(page, pages) {
  const container = document.getElementById('usersPagination');
  const list      = document.getElementById('usersPaginationList');
  if (!container || !list) return;
  if (pages <= 1) { container.classList.add('d-none'); return; }
  container.classList.remove('d-none');

  let html = '';
  html += `<li class="page-item ${page<=1?'disabled':''}"><a class="page-link" href="#" onclick="loadUsers(${page-1});return false;">«</a></li>`;
  for (let i = 1; i <= pages; i++) {
    html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#" onclick="loadUsers(${i});return false;">${i}</a></li>`;
  }
  html += `<li class="page-item ${page>=pages?'disabled':''}"><a class="page-link" href="#" onclick="loadUsers(${page+1});return false;">»</a></li>`;
  list.innerHTML = html;
}
