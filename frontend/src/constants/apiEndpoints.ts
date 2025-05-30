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
    list: `${API_BASE}/locations/locations/`,
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

  // Media endpoints
  MEDIA: {
    BASE: `${API_BASE}/media`,
    TYPES: `${API_BASE}/media/types`,
    TYPE_DETAIL: (id: number) => `${API_BASE}/media/types/${id}`,
    CATEGORIES: `${API_BASE}/media/categories`,
    CATEGORY_DETAIL: (id: number) => `${API_BASE}/media/categories/${id}`,
  },

  // Content endpoints
  CONTENT: {
    ARTICLES: `${API_BASE}/articles`,
    ARTICLE_BY_ID: (id: number) => `${API_BASE}/articles/${id}`,
    ARTICLE_BY_SLUG: (slug: string) => `${API_BASE}/articles/slug/${slug}`,
    ARTICLE_CATEGORIES: `${API_BASE}/articles/categories`,
    ARTICLE_CATEGORY_BY_ID: (id: number) => `${API_BASE}/articles/categories/${id}`,
    ARTICLE_TAGS: `${API_BASE}/articles/tags`,
    ARTICLE_TAG_BY_ID: (id: number) => `${API_BASE}/articles/tags/${id}`,
    GUIDES: `${API_BASE}/guides`,
    GUIDE_BY_ID: (id: string) => `${API_BASE}/guides/${id}`,
  },

  // Events endpoints
  EVENTS: {
    BASE: `${API_BASE}/events`,
    DETAIL: (id: number) => `${API_BASE}/events/${id}`,
    CATEGORIES: `${API_BASE}/events/categories`,
    CATEGORY_DETAIL: (id: number) => `${API_BASE}/events/categories/${id}`,
    ORGANIZERS: `${API_BASE}/events/organizers`,
    ORGANIZER_DETAIL: (id: number) => `${API_BASE}/events/organizers/${id}`,
  },

  // Community Posts endpoints
  COMMUNITY: {
    POSTS: `${API_BASE}/community-posts`,
    POST_DETAIL: (id: number) => `${API_BASE}/community-posts/${id}`,
    LIKE_POST: (id: number) => `${API_BASE}/community-posts/${id}/like`,
    POST_COMMENTS: (id: number) => `${API_BASE}/community-posts/${id}/comments`,
  },

  // Ratings endpoints
  RATINGS: {
    BASE: `${API_BASE}/ratings`,
    AVERAGE: `${API_BASE}/ratings/average`,
    USER: `${API_BASE}/ratings/mine`,
  },

  // Admin endpoints
  ADMIN: {
    BASE: `${API_BASE}/admin`,
    DASHBOARD: `${API_BASE}/admin/dashboard`,
    STATS: `${API_BASE}/admin/stats`,
  },

  // System endpoints
  SYSTEM: {
    BASE: `${API_BASE}/system`,
    LOGS: `${API_BASE}/system/logs`,
    SETTINGS: `${API_BASE}/system/settings`,
    HEALTH: `${API_BASE}/system/health`,
  },

  // Analytics endpoints
  ANALYTICS: {
    BASE: `${API_BASE}/analytics`,
    DASHBOARD_STATS: `${API_BASE}/analytics/dashboard-stats`,
    SYSTEM_STATUS: `${API_BASE}/analytics/system-status`,
    API_USAGE: `${API_BASE}/analytics/api-usage`,
  },
};
