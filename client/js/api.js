// ============================================================
// client/js/api.js
// Centralized Fetch API wrapper
// Automatically attaches JWT token and handles errors
// ============================================================

const api = {
  _getHeaders(extra = {}) {
    const token = localStorage.getItem('tf_token');
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  async _handleResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // If 401, token is expired/invalid – force logout
      if (res.status === 401) {
        localStorage.removeItem('tf_token');
        localStorage.removeItem('tf_user');
        window.location.href = 'login.html';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  },

  async get(endpoint, params = {}) {
    const qs = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    const res = await fetch(`${API_BASE}${endpoint}${qs}`, {
      method: 'GET',
      headers: this._getHeaders(),
    });
    return this._handleResponse(res);
  },

  async post(endpoint, body = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    });
    return this._handleResponse(res);
  },

  async put(endpoint, body = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    });
    return this._handleResponse(res);
  },

  async patch(endpoint, body = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    });
    return this._handleResponse(res);
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    });
    return this._handleResponse(res);
  },
};
