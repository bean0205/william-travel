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
  TRIP_PLANNER: {
    path: '/trip-planner',
    label: 'tripPlanner',
    isNavItem: true,
  },
  REVIEWS: {
    path: '/reviews',
    label: 'reviews',
    isNavItem: true,
  },
  COMMUNITY: {
    path: '/community',
    label: 'community',
    isNavItem: true,
  },
  COMMUNITY_DETAILS: {
    path: '/community/:id',
    label: 'Community Post Details',
  },
  RECOMMENDATIONS: {
    path: '/recommendations',
    label: 'recommendations',
    isNavItem: true,
  },
  RECOMMENDATION_DETAILS: {
    path: '/recommendations/:id',
    label: 'Recommendation Details',
  },
  ANALYTICS: {
    path: '/analytics',
    label: 'analytics',
    isNavItem: true,
  },
  SUPPORT: {
    path: '/support',
    label: 'support',
    isNavItem: true,
  },
  SUPPORT_DETAILS: {
    path: '/support/:id',
    label: 'Support Ticket Details',
  },
  // Admin Dashboard Routes
  ADMIN_DASHBOARD: {
    path: '/admin',
    label: 'Admin Dashboard',
  },
  ADMIN_MODERN_DASHBOARD: {
    path: '/admin/modern',
    label: 'Modern Dashboard',
  },
  ADMIN_USERS: {
    path: '/admin/users',
    label: 'User Management',
  },
  ADMIN_ROLES: {
    path: '/admin/roles',
    label: 'Role Management',
  },
  ADMIN_PERMISSIONS: {
    path: '/admin/permissions',
    label: 'Permission Management',
  },
  ADMIN_CONTENT: {
    path: '/admin/content',
    label: 'Content Management',
  },
  ADMIN_LOCATIONS: {
    path: '/admin/locations',
    label: 'Location Management',
  },
  ADMIN_LOCATIONS_CONTINENTS: {
    path: '/admin/locations/continents',
    label: 'Continent Management',
  },
  ADMIN_LOCATIONS_COUNTRIES: {
    path: '/admin/locations/countries',
    label: 'Country Management',
  },
  ADMIN_LOCATIONS_REGIONS: {
    path: '/admin/locations/regions',
    label: 'Region Management',
  },
  ADMIN_LOCATIONS_DISTRICTS: {
    path: '/admin/locations/districts',
    label: 'District Management',
  },
  ADMIN_LOCATIONS_WARDS: {
    path: '/admin/locations/wards',
    label: 'Ward Management',
  },
  ADMIN_LOCATIONS_CATEGORIES: {
    path: '/admin/locations/categories',
    label: 'Location Categories',
  },
  ADMIN_MEDIA: {
    path: '/admin/media',
    label: 'Media Management',
  },
  // Các routes cho các trang admin mới
  ADMIN_ARTICLES: {
    path: '/admin/articles',
    label: 'Article Management',
  },
  ADMIN_EVENTS: {
    path: '/admin/events',
    label: 'Event Management',
  },
  ADMIN_REVIEWS: {
    path: '/admin/reviews',
    label: 'Review Management',
  },
  ADMIN_REPORTS: {
    path: '/admin/reports',
    label: 'Reports & Analytics',
  },
  ADMIN_SYSTEM_SETTINGS: {
    path: '/admin/settings',
    label: 'System Settings',
  },
  ADMIN_GUIDES: {
    path: '/admin/guides',
    label: 'Guide Management',
  },
  // Accommodation management routes
  ADMIN_ACCOMMODATIONS: {
    path: '/admin/accommodations',
    label: 'Accommodation Management',
  },
  ADMIN_ACCOMMODATION_CATEGORIES: {
    path: '/admin/accommodations/categories',
    label: 'Accommodation Categories',
  },
  ADMIN_ACCOMMODATION_CREATE: {
    path: '/admin/accommodations/create',
    label: 'Create Accommodation',
  },
  ADMIN_ACCOMMODATION_EDIT: {
    path: '/admin/accommodations/edit/:id',
    label: 'Edit Accommodation',
  },
  // Food management routes
  ADMIN_FOODS: {
    path: '/admin/foods',
    label: 'Food & Restaurant Management',
  },
  ADMIN_FOOD_CATEGORIES: {
    path: '/admin/foods/categories',
    label: 'Food Categories',
  },
  ADMIN_FOOD_CREATE: {
    path: '/admin/foods/create',
    label: 'Create Food Listing',
  },
  ADMIN_FOOD_EDIT: {
    path: '/admin/foods/edit/:id',
    label: 'Edit Food Listing',
  },
  // Article management routes
  ADMIN_ARTICLE_CREATE: {
    path: '/admin/articles/create',
    label: 'Create Article',
  },
  ADMIN_ARTICLE_EDIT: {
    path: '/admin/articles/edit/:id',
    label: 'Edit Article',
  },  // Event management routes
  ADMIN_EVENT_CREATE: {
    path: '/admin/events/create',
    label: 'Create Event',
  },
  ADMIN_EVENT_EDIT: {
    path: '/admin/events/edit/:id',
    label: 'Edit Event',
  },
  // Community Posts management route
  ADMIN_COMMUNITY_POSTS: {
    path: '/admin/community-posts',
    label: 'Community Posts Management',
  },
  // Ratings management route
  ADMIN_RATINGS: {
    path: '/admin/ratings',
    label: 'Ratings Management',
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
