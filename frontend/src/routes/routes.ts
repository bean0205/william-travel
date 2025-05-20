// Define all application routes here
// This can be used for navigation and dynamic route building

interface AppRoute {
  path: string;
  label: string;
  isNavItem?: boolean; // Whether to show in main navigation
}

export const APP_ROUTES: Record<string, AppRoute> = {
  COUNTRY_SELECTION: {
    path: '/',
    label: 'Select Country',
  },
  HOME: {
    path: '/home',
    label: 'home',
    isNavItem: true,
  },
  MAP: {
    path: '/map',
    label: 'mapExplorer',
    isNavItem: true,
  },
  LOCATIONS: {
    path: '/locations',
    label: 'locations',
    isNavItem: true,
  },
  LOCATION_DETAILS: {
    path: '/locations/:id',
    label: 'Location Details',
  },
  ACCOMMODATIONS: {
    path: '/accommodations',
    label: 'accommodations',
    isNavItem: true,
  },
  ACCOMMODATION_DETAILS: {
    path: '/accommodations/:id',
    label: 'Accommodation Details',
  },
  FOOD: {
    path: '/food',
    label: 'food',
    isNavItem: true,
  },
  FOOD_DETAILS: {
    path: '/food/:id',
    label: 'Food Details',
  },
  ARTICLES: {
    path: '/articles',
    label: 'articles',
    isNavItem: true,
  },
  ARTICLE_DETAILS: {
    path: '/articles/:id',
    label: 'Article Details',
  },
  EVENTS: {
    path: '/events',
    label: 'events',
    isNavItem: true,
  },
  EVENT_DETAILS: {
    path: '/events/:id',
    label: 'Event Details',
  },
  GUIDES: {
    path: '/guides',
    label: 'travelGuides',
    isNavItem: true,
  },
  GUIDE_DETAILS: {
    path: '/guides/:id',
    label: 'Guide Details',
  },
  TRANSPORTATION: {
    path: '/transportation',
    label: 'transportation',
    isNavItem: true,
  },
  TRANSPORTATION_DETAILS: {
    path: '/transportation/:id',
    label: 'Transportation Details',
  },
  SHOPPING: {
    path: '/shopping',
    label: 'shopping',
    isNavItem: true,
  },
  SHOPPING_DETAILS: {
    path: '/shopping/:id',
    label: 'Shopping Details',
  },
  TIPS_WARNINGS: {
    path: '/tips-warnings',
    label: 'tipsWarnings',
    isNavItem: true,
  },
  TIPS_WARNINGS_DETAILS: {
    path: '/tips-warnings/:id',
    label: 'Tips & Warnings Details',
  },
  GALLERY: {
    path: '/gallery',
    label: 'gallery',
    isNavItem: true,
  },
  PROFILE: {
    path: '/profile',
    label: 'profile',
  },
  FAVORITES: {
    path: '/favorites',
    label: 'favorites',
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
