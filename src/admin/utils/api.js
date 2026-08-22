function getBaseUrl() {
  const custom = import.meta.env.VITE_API_BASE_URL;
  if (custom && typeof custom === 'string' && custom.trim() !== '') {
    const trimmed = custom.trim().replace(/\/+$/, '');
    if (import.meta.env.DEV) {
      return trimmed;
    }
    if (typeof window !== 'undefined' && trimmed.startsWith('http') && !trimmed.includes(window.location.host)) {
      return trimmed;
    }
  }
  return '';
}

async function request(path, options = {}) {
  const BASE = getBaseUrl();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('spot_admin_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data.token && typeof localStorage !== 'undefined') {
      localStorage.setItem('spot_admin_token', data.token);
    }
    return data;
  },
  logout: async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('spot_admin_token');
    }
    return request('/api/auth/logout', { method: 'POST' });
  },
  me: () => request('/api/auth/me'),

  // Packages
  getPackages: () => request('/api/packages'),
  getAllPackages: () => request('/api/packages/all'),
  getPackage: (id) => request(`/api/packages/${id}`),
  createPackage: (data) => request('/api/packages', { method: 'POST', body: JSON.stringify(data) }),
  updatePackage: (id, data) => request(`/api/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePackage: (id) => request(`/api/packages/${id}`, { method: 'DELETE' }),

  // Destinations
  getDestinations: () => request('/api/destinations'),
  getAllDestinations: () => request('/api/destinations/all'),
  getDestination: (id) => request(`/api/destinations/${id}`),
  createDestination: (data) => request('/api/destinations', { method: 'POST', body: JSON.stringify(data) }),
  updateDestination: (id, data) => request(`/api/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDestination: (id) => request(`/api/destinations/${id}`, { method: 'DELETE' }),

  // Blogs
  getBlogs: () => request('/api/blogs'),
  getAllBlogs: () => request('/api/blogs/all'),
  getBlog: (slug) => request(`/api/blogs/${slug}`),
  createBlog: (data) => request('/api/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (id, data) => request(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (id) => request(`/api/blogs/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: () => request('/api/reviews'),
  getAllReviews: () => request('/api/reviews/all'),
  createReview: (data) => request('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateReview: (id, data) => request(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReview: (id) => request(`/api/reviews/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => request('/api/services'),
  getAllServices: () => request('/api/services/all'),
  createService: (data) => request('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/api/services/${id}`, { method: 'DELETE' }),

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
  updateBulkContent: (updates) => request('/api/content/batch', { method: 'PUT', body: JSON.stringify({ updates }) }),

  // Team
  getTeam: () => request('/api/team'),
  createTeamMember: (data) => request('/api/team', { method: 'POST', body: JSON.stringify(data) }),
  updateTeamMember: (id, data) => request(`/api/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeamMember: (id) => request(`/api/team/${id}`, { method: 'DELETE' }),
};
