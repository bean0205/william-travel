// Configuration for the app, pulling from environment variables
// with sensible defaults when env vars are not available

const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
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
