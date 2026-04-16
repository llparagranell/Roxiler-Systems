const BASE_URL = import.meta.env.VITE_API_URL || 'https://roxiler-systems-7e9i.onrender.com';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload.message ||
      (Array.isArray(payload.errors)
        ? payload.errors.map((item) => item.msg || item.message).filter(Boolean).join(', ')
        : response.statusText || 'Request failed');
    const error = new Error(message);
    error.response = payload;
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const auth = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (credentials) => request('/auth/signup', { method: 'POST', body: JSON.stringify(credentials) }),
  me: () => request('/auth/me'),
  updatePassword: (password) => request('/auth/password', { method: 'PUT', body: JSON.stringify({ password }) }),
};

export const admin = {
  dashboard: () => request('/admin/dashboard'),
  users: (query) => request(`/admin/users?${new URLSearchParams(query)}`),
  userById: (id) => request(`/admin/users/${id}`),
  createUser: (payload) => request('/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  stores: (query) => request(`/admin/stores?${new URLSearchParams(query)}`),
  createStore: (payload) => request('/admin/stores', { method: 'POST', body: JSON.stringify(payload) }),
};

export const user = {
  stores: (query) => request(`/user/stores?${new URLSearchParams(query)}`),
  rate: (storeId, rating) => request(`/user/stores/${storeId}/rating`, { method: 'POST', body: JSON.stringify({ rating }) }),
  updateRating: (storeId, rating) => request(`/user/stores/${storeId}/rating`, { method: 'PUT', body: JSON.stringify({ rating }) }),
};

export const owner = {
  dashboard: (query = {}) => request(`/owner/dashboard?${new URLSearchParams(query)}`),
};
