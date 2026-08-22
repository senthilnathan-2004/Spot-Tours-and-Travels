// Base URL: in production always use same origin (''), in dev use VITE_API_BASE_URL or fallback to localhost:3001
const BASE = import.meta.env.PROD 
  ? '' 
  : (import.meta.env.VITE_API_BASE_URL || '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),

  // Packages
  getPackages: () => request('/api/packages/all'),
  createPackage: (data) => request('/api/packages', { method: 'POST', body: JSON.stringify(data) }),
  updatePackage: (id, data) => request(`/api/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePackage: (id) => request(`/api/packages/${id}`, { method: 'DELETE' }),

  // Bookings
  getBookings: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/bookings${q ? '?' + q : ''}`);
  },
  getBookingStats: () => request('/api/bookings/stats'),
  getBooking: (id) => request(`/api/bookings/${id}`),
  updateBookingStatus: (id, status) => request(`/api/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createBooking: (data) => request('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),

  // Enquiries
  getEnquiries: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/enquiries${q ? '?' + q : ''}`);
  },
  getEnquiryStats: () => request('/api/enquiries/stats'),
  updateEnquiryStatus: (id, status) => request(`/api/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createEnquiry: (data) => request('/api/enquiries', { method: 'POST', body: JSON.stringify(data) }),

  // Content
  getContent: () => request('/api/content'),
  updateContent: (section, key, value) => request(`/api/content/${section}/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),

  // Team
  getTeam: () => request('/api/team'),
  createTeamMember: (data) => request('/api/team', { method: 'POST', body: JSON.stringify(data) }),
  updateTeamMember: (id, data) => request(`/api/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeamMember: (id) => request(`/api/team/${id}`, { method: 'DELETE' }),
};
