// ============================================================
// client/js/profile.js
// Profile page: display info, update profile, change password
// ============================================================

(async function initProfile() {
  try {
    // Fetch fresh user data from API
    const data = await api.get('/auth/me');
    const user = data.user;

    // Update localStorage with fresh data
    localStorage.setItem('tf_user', JSON.stringify(user));

    // Populate form fields
    document.getElementById('profileName').value        = user.name || '';
    document.getElementById('profileEmail').value       = user.email || '';
    document.getElementById('profileRole').value        = user.role || 'user';
    document.getElementById('profileCreated').value     = formatDate(user.createdAt);

    // Visual display
    document.getElementById('profileAvatar').textContent        = (user.name || 'U')[0].toUpperCase();
    document.getElementById('profileDisplayName').textContent   = user.name;
    document.getElementById('profileDisplayEmail').textContent  = user.email;
    document.getElementById('profileDisplayRole').textContent   = user.role;

    // Load task stats for the sidebar summary
    try {
      const stats = await api.get('/tasks/stats');
      document.getElementById('ps-total').textContent     = stats.stats.total;
      document.getElementById('ps-completed').textContent = stats.stats.completed;
      document.getElementById('ps-pending').textContent   = stats.stats.pending;
      document.getElementById('ps-high').textContent      = stats.stats.highPriority;
    } catch (_) {}
  } catch (err) {
    showToast('Failed to load profile: ' + err.message, 'error');
  }
})();

// ── Update Profile ─────────────────────────────────────────
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearFormErrors(['profileName']);
  document.getElementById('profile-success').classList.add('d-none');
  document.getElementById('profile-error').classList.add('d-none');

  const name = document.getElementById('profileName').value.trim();
  if (!name || name.length < 2) {
    showFieldError('profileName', 'Name must be at least 2 characters.');
    return;
  }

  const btn = document.getElementById('profileSaveBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="tf-spinner"></span> Saving…';

  try {
    const data = await api.put('/auth/profile', { name });

    // Update local storage
    const stored = JSON.parse(localStorage.getItem('tf_user') || '{}');
    stored.name = data.user.name;
    localStorage.setItem('tf_user', JSON.stringify(stored));

    document.getElementById('profileAvatar').textContent       = name[0].toUpperCase();
    document.getElementById('profileDisplayName').textContent  = name;
    document.getElementById('sidebarName').textContent         = name;
    document.getElementById('sidebarAvatar').textContent       = name[0].toUpperCase();

    document.getElementById('profile-success').textContent = 'Profile updated successfully!';
    document.getElementById('profile-success').classList.remove('d-none');
    showToast('Profile updated!', 'success');
  } catch (err) {
    document.getElementById('profile-error').textContent = err.message;
    document.getElementById('profile-error').classList.remove('d-none');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
});

// ── Change Password ────────────────────────────────────────
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearFormErrors(['currentPassword', 'newPassword', 'confirmNewPassword']);
  document.getElementById('pw-success').classList.add('d-none');
  document.getElementById('pw-error').classList.add('d-none');

  const currentPassword    = document.getElementById('currentPassword').value;
  const newPassword        = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  let valid = true;

  if (!currentPassword) {
    showFieldError('currentPassword', 'Current password is required.'); valid = false;
  }
  if (!newPassword || newPassword.length < 6) {
    showFieldError('newPassword', 'New password must be at least 6 characters.'); valid = false;
  }
  if (newPassword !== confirmNewPassword) {
    showFieldError('confirmNewPassword', 'Passwords do not match.'); valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById('pwSaveBtn');
  btn.disabled = true;
    btn.innerHTML = '<span class="tf-spinner"></span> Updating…';

  try {
    await api.put('/auth/change-password', { currentPassword, newPassword });
    document.getElementById('passwordForm').reset();
    document.getElementById('pw-success').textContent = 'Password changed successfully!';
    document.getElementById('pw-success').classList.remove('d-none');
    showToast('Password updated!', 'success');
  } catch (err) {
    document.getElementById('pw-error').textContent = err.message;
    document.getElementById('pw-error').classList.remove('d-none');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Update Password';
  }
});
