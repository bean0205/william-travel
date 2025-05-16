// Define all application routes here
// This can be used for navigation and dynamic route building

interface AppRoute {
  path: string;
  label: string;
  isNavItem?: boolean; // Whether to show in main navigation
}

export const APP_ROUTES: Record<string, AppRoute> = {
  HOME: {
    path: '/',
    label: 'Home',
    isNavItem: true,
  },
  MAP: {
    path: '/map',
    label: 'Map Explorer',
    isNavItem: true,
  },
  LOCATIONS: {
    path: '/locations',
    label: 'Locations',
    isNavItem: true,
  },
  LOCATION_DETAILS: {
    path: '/locations/:id',
    label: 'Location Details',
  },
  GUIDES: {
    path: '/guides',
    label: 'Travel Guides',
    isNavItem: true,
  },
  GUIDE_DETAILS: {
    path: '/guides/:id',
    label: 'Guide Details',
  },
  PROFILE: {
    path: '/profile',
    label: 'My Profile',
  },
  FAVORITES: {
    path: '/favorites',
    label: 'My Favorites',
  },
  NOT_FOUND: {
    path: '*',
    label: 'Not Found',
  },
};

// Helper to get route paths
export const getRoutePath = (routeKey: keyof typeof APP_ROUTES): string => {
  return APP_ROUTES[routeKey].path;
};

// Helper to get navigation items
export const getNavItems = (): AppRoute[] => {
  return Object.values(APP_ROUTES).filter((route) => route.isNavItem);
};

export default APP_ROUTES;
