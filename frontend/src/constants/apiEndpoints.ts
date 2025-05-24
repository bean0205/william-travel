// Base API endpoints for different resources
const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE}/auth/login`,
    passwordReset: `${API_BASE}/auth/password-reset`,
    passwordResetConfirm: `${API_BASE}/auth/password-reset/confirm`,
    refresh: `${API_BASE}/auth/refresh`,
    logout: `${API_BASE}/auth/logout`,
  },

  // User endpoints
  users: {
    me: `${API_BASE}/users/me`,
    password: `${API_BASE}/users/me/password`,
    list: `${API_BASE}/users/`,
    detail: (userId: number) => `${API_BASE}/users/${userId}`,
  },

  // Role endpoints
  roles: {
    list: `${API_BASE}/roles/`,
    detail: (roleId: number) => `${API_BASE}/roles/${roleId}`,
  },

  // Permission endpoints
  permissions: {
    list: `${API_BASE}/permissions/`,
    detail: (permissionId: number) => `${API_BASE}/permissions/${permissionId}`,
  },

  // Locations endpoints
  locations: {
    continents: {
      list: `${API_BASE}/locations/continents/`,
      detail: (id: number) => `${API_BASE}/locations/continents/${id}`,
    },
    countries: {
      list: `${API_BASE}/locations/countries/`,
      detail: (id: number) => `${API_BASE}/locations/countries/${id}`,
    },
    regions: {
      list: `${API_BASE}/locations/regions/`,
      detail: (id: number) => `${API_BASE}/locations/regions/${id}`,
    },
    districts: {
      list: `${API_BASE}/locations/districts/`,
      detail: (id: number) => `${API_BASE}/locations/districts/${id}`,
    },
    wards: {
      list: `${API_BASE}/locations/wards/`,
      detail: (id: number) => `${API_BASE}/locations/wards/${id}`,
    },
    categories: {
      list: `${API_BASE}/locations/location-categories/`,
      detail: (id: number) => `${API_BASE}/locations/location-categories/${id}`,
    },
  },

  // Accommodations endpoints
  accommodations: {
    list: `${API_BASE}/accommodations/`,
    detail: (id: number) => `${API_BASE}/accommodations/${id}`,
    categories: {
      list: `${API_BASE}/accommodations/categories/`,
      detail: (id: number) => `${API_BASE}/accommodations/categories/${id}`,
    }
  },

  // Foods endpoints
  foods: {
    list: `${API_BASE}/foods/`,
    detail: (id: number) => `${API_BASE}/foods/${id}`,
    categories: {
      list: `${API_BASE}/foods/categories/`,
      detail: (id: number) => `${API_BASE}/foods/categories/${id}`,
    }
  },

  // Add other endpoints as needed...
};
