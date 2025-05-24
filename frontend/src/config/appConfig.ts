// Configuration for the app, pulling from environment variables
// with sensible defaults when env vars are not available

// Export API_URL and API_BASE_URL for backwards compatibility
export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000, // 10 seconds
  },
  map: {
    styleUrl: import.meta.env.VITE_MAPLIBRE_STYLE_URL,
    defaultCenter: {
      latitude: 40.7128, // New York
      longitude: -74.0060,
    },
    defaultZoom: 3,
  },
  features: {
    enableGeolocation: true,
    enableOfflineMode: false, // Future feature
  },
  // Add other configuration categories as needed
};

export default config;
