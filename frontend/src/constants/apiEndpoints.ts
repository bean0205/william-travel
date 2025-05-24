// Base API endpoints for different resources
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register', 
    RESET_PASSWORD: '/v1/auth/password-reset',
    REFRESH_TOKEN: '/v1/auth/refresh',
    LOGOUT: '/v1/auth/logout',
    VERIFY: '/v1/auth/verify',
  },

  // User endpoints
  USERS: {
    BASE: '/v1/users',
    ME: '/v1/users/me',
    PASSWORD: '/v1/users/me/password',
  },

  // Locations endpoints
  LOCATIONS: {
    BASE: '/v1/locations',
    CONTINENTS: '/v1/locations/continents',
    COUNTRIES: '/v1/locations/countries',
    REGIONS: '/v1/locations/regions',
    DISTRICTS: '/v1/locations/districts',
    WARDS: '/v1/locations/wards',
    CATEGORIES: '/v1/locations/location-categories',
  },

  // Content endpoints
  CONTENT: {
    ARTICLES: '/v1/articles',
    GUIDES: '/v1/guides',
    TIPS: '/v1/tips',
    WARNINGS: '/v1/warnings',
  },

  // Reviews
  REVIEWS: {
    BASE: '/v1/reviews',
  },

  // Events
  EVENTS: {
    BASE: '/v1/events',
  },

  // Media endpoints
  MEDIA: {
    BASE: '/v1/media',
    UPLOAD: '/v1/media/upload',
  },

  // Analytics endpoints
  ANALYTICS: {
    BASE: '/v1/analytics',
    USERS: '/v1/analytics/users',
    CONTENT: '/v1/analytics/content',
    TRAFFIC: '/v1/analytics/traffic',
  },

  // System settings
  SYSTEM: {
    SETTINGS: '/v1/system/settings',
    LOGS: '/v1/system/logs',
  },

  // Admin endpoints
  ADMIN: {
    BASE: '/v1/admin',
    SETTINGS: '/v1/admin/settings',
    DASHBOARD: '/v1/admin/dashboard',
  },

  // Roles and permissions
  ROLES: {
    BASE: '/v1/roles',
  },
  PERMISSIONS: {
    BASE: '/v1/permissions',
  },
};
