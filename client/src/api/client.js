// Centralized API client service

const rawApiBase = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawApiBase.trim().replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${normalizedEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if present
  const token = localStorage.getItem('codechef_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If unauthorized, clear invalid token and notify
      if (response.status === 401 && token) {
        localStorage.removeItem('codechef_admin_token');
        localStorage.removeItem('codechef_admin_info');
        window.dispatchEvent(new Event('auth:logout'));
      }
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error: could not connect to server',
      0,
      null
    );
  }
}

export const api = {
  // Public Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/events${queryString}`);
  },

  getFeaturedEvent: () => request('/events/featured'),

  getClubOverviewStats: () => request('/events/overview-stats'),

  getEventById: (idOrSlug) => request(`/events/${idOrSlug}`),

  // Registrations
  registerForEvent: (data) =>
    request('/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin Auth
  adminLogin: (credentials) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getAdminMe: () => request('/admin/me'),

  getAdminStats: () => request('/admin/stats'),

  // Admin Event Management
  createEvent: (data) =>
    request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEvent: (id, data) =>
    request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteEvent: (id) =>
    request(`/events/${id}`, {
      method: 'DELETE',
    }),

  toggleFeaturedEvent: (id) =>
    request(`/events/${id}/toggle-featured`, {
      method: 'PATCH',
    }),

  // Admin Registration Management
  getRegistrations: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/registrations${queryString}`);
  },

  getRegistrationById: (id) => request(`/registrations/${id}`),

  deleteRegistration: (id) =>
    request(`/registrations/${id}`, {
      method: 'DELETE',
    }),

  // Health check
  checkHealth: () => request('/health'),
};
