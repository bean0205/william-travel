// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/App.tsx
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { UserRole, useAuthStore } from '@/store/authStore';
import { Permission } from '@/utils/permissions';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { PageTransition } from '@/components/common/PageTransition';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const CountrySelectionPage = lazy(() => import('@/pages/CountrySelectionPage'));
const MapExplorerPage = lazy(() => import('@/pages/MapExplorerPage'));
const LocationsPage = lazy(() => import('@/pages/LocationsPage'));
const GuidesPage = lazy(() => import('@/pages/GuidesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

// New added pages
const AccommodationsPage = lazy(() => import('@/pages/AccommodationsPage'));
const FoodPage = lazy(() => import('@/pages/FoodPage'));
const ArticlesPage = lazy(() => import('@/pages/ArticlesPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));
const GuideDetailsPage = lazy(() => import('@/pages/GuideDetailsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const TransportationPage = lazy(() => import('@/pages/TransportationPage'));
const ShoppingPage = lazy(() => import('@/pages/ShoppingPage'));
const TipsWarningsPage = lazy(() => import('@/pages/TipsWarningsPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));

// New features pages
const TripPlannerPage = lazy(() => import('@/pages/TripPlannerPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const CommunityForumPage = lazy(() => import('@/pages/CommunityForumPage'));
const RecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));

// Detail pages
const LocationDetailPage = lazy(() => import('@/pages/LocationDetailPage'));
const AccommodationDetailPage = lazy(() => import('@/pages/AccommodationDetailPage'));
const FoodDetailPage = lazy(() => import('@/pages/FoodDetailPage'));
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage'));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage'));
const TransportationDetailPage = lazy(() => import('@/pages/TransportationDetailPage'));
const ShoppingDetailPage = lazy(() => import('@/pages/ShoppingDetailPage'));
const TipsWarningsDetailPage = lazy(() => import('@/pages/TipsWarningsDetailPage'));
const SupportDetailPage = lazy(() => import('@/pages/SupportDetailPage'));
const RecommendationDetailPage = lazy(() => import('@/pages/RecommendationDetailPage'));
const CommunityForumDetailPage = lazy(() => import('@/pages/CommunityForumDetailPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Admin pages
const ModernDashboard = lazy(() => import('@/pages/admin/ModernDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const LocationManagement = lazy(() => import('@/pages/admin/LocationManagement'));
const GuideManagement = lazy(() => import('@/pages/admin/GuideManagement'));
const ArticleManagement = lazy(() => import('@/pages/admin/ArticleManagement'));
const EventManagement = lazy(() => import('@/pages/admin/EventManagement'));
const ReviewManagement = lazy(() => import('@/pages/admin/ReviewManagement'));
const ReportsAnalytics = lazy(() => import('@/pages/admin/ReportsAnalytics'));
const SystemSettings = lazy(() => import('@/pages/admin/SystemSettings'));
const MediaManagement = lazy(() => import('@/pages/admin/MediaManagement'));
const RolesManagement = lazy(() => import('@/pages/admin/RolesManagement'));
const PermissionsManagement = lazy(() => import('@/pages/admin/PermissionsManagement'));
const ContentManagement = lazy(() => import('@/pages/admin/ContentManagement'));
const AdminTest = lazy(() => import('@/pages/AdminTest'));

// Location Management Admin Pages
const ContinentManagement = lazy(() => import('@/pages/admin/ContinentManagement'));
const CountryManagement = lazy(() => import('@/pages/admin/CountryManagement'));
const RegionManagement = lazy(() => import('@/pages/admin/RegionManagement'));
const DistrictManagement = lazy(() => import('@/pages/admin/DistrictManagement'));
const WardManagement = lazy(() => import('@/pages/admin/WardManagement'));
const LocationCategoryManagement = lazy(() => import('@/pages/admin/LocationCategoryManagement'));

// Accommodation & Food Management Admin Pages
const AccommodationManagement = lazy(() => import('@/pages/admin/AccommodationManagement'));
const AccommodationCategoryManagement = lazy(() => import('@/pages/admin/AccommodationCategoryManagement'));
const FoodManagement = lazy(() => import('@/pages/admin/FoodManagement'));
const FoodCategoryManagement = lazy(() => import('@/pages/admin/FoodCategoryManagement'));
const CommunityPostManagement = lazy(() => import('@/pages/admin/CommunityPostManagement'));
const RatingManagement = lazy(() => import('@/pages/admin/RatingManagement'));

// Guide pages
const GuideDashboard = lazy(() => import('@/pages/guide/Dashboard'));
const CreateGuidePage = lazy(() => import('@/pages/guide/CreateGuidePage'));
const MyGuidesPage = lazy(() => import('@/pages/guide/MyGuidesPage'));
const EditGuidePage = lazy(() => import('@/pages/guide/EditGuidePage'));

// Admin Route Wrapper Component
const AdminRouteWrapper = () => {
  const { isAuthenticated, user } = useAuthStore();

  // const isAdmin = isAuthenticated && user?.role === 'admin';
  const isAdmin = true;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <AdminLayout><Outlet /></AdminLayout>;
};

// Wrap each component with PageTransition
const withPageTransition =
  (Component: React.ComponentType) => () => (
    <PageTransition>
      <Component />
    </PageTransition>
  );

// Main App Router component
function AppRouter() {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  // Check auth status when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="william-travel-theme"
      enableAnimations={true}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Country selection page - the entry point */}
            <Route
              path="/"
              element={withPageTransition(CountrySelectionPage)()}
            />

            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route path="home" element={withPageTransition(HomePage)()} />
              <Route
                path="map"
                element={withPageTransition(MapExplorerPage)()}
              />
              <Route
                path="locations"
                element={withPageTransition(LocationsPage)()}
              />
              <Route
                path="locations/:id"
                element={withPageTransition(LocationDetailPage)()}
              />
              <Route path="guides" element={withPageTransition(GuidesPage)()} />
              
              {/* New added pages */}
              <Route 
                path="accommodations" 
                element={withPageTransition(AccommodationsPage)()} 
              />
              <Route
                path="accommodations/:id"
                element={withPageTransition(AccommodationDetailPage)()}
              />
              <Route
                path="food" 
                element={withPageTransition(FoodPage)()} 
              />
              <Route
                path="food/:id"
                element={withPageTransition(FoodDetailPage)()}
              />
              <Route
                path="articles" 
                element={withPageTransition(ArticlesPage)()} 
              />
              <Route
                path="articles/:id"
                element={withPageTransition(ArticleDetailPage)()}
              />
              <Route
                path="events" 
                element={withPageTransition(EventsPage)()} 
              />
              <Route
                path="events/:id"
                element={withPageTransition(EventDetailPage)()}
              />
              <Route
                path="guides/:id" 
                element={withPageTransition(GuideDetailsPage)()} 
              />
              <Route
                path="transportation"
                element={withPageTransition(TransportationPage)()}
              />
              <Route
                path="transportation/:id"
                element={withPageTransition(TransportationDetailPage)()}
              />
              <Route
                path="shopping"
                element={withPageTransition(ShoppingPage)()}
              />
              <Route
                path="shopping/:id"
                element={withPageTransition(ShoppingDetailPage)()}
              />
              <Route
                path="tips-warnings"
                element={withPageTransition(TipsWarningsPage)()}
              />
              <Route
                path="tips-warnings/:id"
                element={withPageTransition(TipsWarningsDetailPage)()}
              />
              <Route
                path="gallery"
                element={withPageTransition(GalleryPage)()}
              />

              {/* New feature routes */}
              <Route
                path="trip-planner"
                element={withPageTransition(TripPlannerPage)()}
              />
              <Route
                path="reviews"
                element={withPageTransition(ReviewsPage)()}
              />
              <Route
                path="community"
                element={withPageTransition(CommunityForumPage)()}
              />
              <Route
                path="community/:id"
                element={withPageTransition(CommunityForumDetailPage)()}
              />
              <Route
                path="recommendations"
                element={withPageTransition(RecommendationsPage)()}
              />
              <Route
                path="recommendations/:id"
                element={withPageTransition(RecommendationDetailPage)()}
              />
              <Route
                path="analytics"
                element={withPageTransition(AnalyticsPage)()}
              />
              <Route
                path="support"
                element={withPageTransition(SupportPage)()}
              />
              <Route
                path="support/:id"
                element={withPageTransition(SupportDetailPage)()}
              />

              {/* Auth routes */}
              <Route path="auth/login" element={withPageTransition(LoginPage)()} />
              <Route
                path="auth/register"
                element={withPageTransition(RegisterPage)()}
              />
              <Route
                path="auth/forgot-password"
                element={withPageTransition(ForgotPasswordPage)()}
              />
              <Route
                path="auth/reset-password/:token"
                element={withPageTransition(ResetPasswordPage)()}
              />
              <Route
                path="unauthorized"
                element={withPageTransition(UnauthorizedPage)()}
              />

              {/* Test route for admin functionality */}
              <Route path="/admin-test" element={withPageTransition(AdminTest)()} />

              {/* 404 route */}
              <Route path="*" element={withPageTransition(NotFoundPage)()} />
            </Route>

            {/* Basic user protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route
                  path="profile"
                  element={withPageTransition(ProfilePage)()}
                />
                <Route
                  path="favorites"
                  element={withPageTransition(FavoritesPage)()}
                />
              </Route>
            </Route>

            {/* Guide protected routes */}
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.GUIDE, UserRole.ADMIN]}
                  requiredPermissions={[Permission.CREATE_GUIDE]}
                />
              }
            >
              <Route path="/" element={<MainLayout />}>
                <Route
                  path="guide"
                  element={withPageTransition(GuideDashboard)()}
                />
                <Route
                  path="guides/create"
                  element={withPageTransition(CreateGuidePage)()}
                />
                <Route
                  path="guides/my-guides"
                  element={withPageTransition(MyGuidesPage)()}
                />
                <Route
                  path="guides/edit/:guideId"
                  element={withPageTransition(EditGuidePage)()}
                />
              </Route>
            </Route>

            {/* Admin protected routes */}
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN]}
                  requiredPermissions={[Permission.MANAGE_USERS]}
                />
              }
            >
              <Route path="/admin" element={<AdminRouteWrapper />}>
                <Route
                  path=""
                  element={withPageTransition(ModernDashboard)()}
                />
                <Route
                  path="users"
                  element={withPageTransition(UserManagement)()}
                />
                <Route
                  path="roles"
                  element={withPageTransition(RolesManagement)()}
                />
                <Route
                  path="permissions"
                  element={withPageTransition(PermissionsManagement)()}
                />
                <Route
                  path="content"
                  element={withPageTransition(ContentManagement)()}
                />
                <Route
                  path="locations"
                  element={withPageTransition(LocationManagement)()}
                />
                <Route
                  path="locations"
                  element={withPageTransition(LocationManagement)()}
                />
                <Route
                  path="continents"
                  element={withPageTransition(ContinentManagement)()}
                />
                <Route
                  path="countries"
                  element={withPageTransition(CountryManagement)()}
                />
                <Route
                  path="regions"
                  element={withPageTransition(RegionManagement)()}
                />
                <Route
                  path="districts"
                  element={withPageTransition(DistrictManagement)()}
                />
                <Route
                  path="wards"
                  element={withPageTransition(WardManagement)()}
                />
                <Route
                  path="categories"
                  element={withPageTransition(LocationCategoryManagement)()}
                />
                <Route
                  path="media"
                  element={withPageTransition(MediaManagement)()}
                />
                <Route
                  path="articles"
                  element={withPageTransition(ArticleManagement)()}
                />
                <Route
                  path="articles/create"
                  element={withPageTransition(ArticleManagement)()}
                />
                <Route
                  path="articles/edit/:id"
                  element={withPageTransition(ArticleManagement)()}
                />
                <Route
                  path="events"
                  element={withPageTransition(EventManagement)()}
                />
                <Route
                  path="events/create"
                  element={withPageTransition(EventManagement)()}
                />
                <Route
                  path="events/edit/:id"
                  element={withPageTransition(EventManagement)()}
                />
                <Route
                  path="reviews"
                  element={withPageTransition(ReviewManagement)()}
                />
                <Route
                  path="reports"
                  element={withPageTransition(ReportsAnalytics)()}
                />
                <Route
                  path="settings"
                  element={withPageTransition(SystemSettings)()}
                />
                <Route
                  path="guides"
                  element={withPageTransition(GuideManagement)()}
                />
                <Route
                  path="guides/manage"
                  element={withPageTransition(GuideManagement)()}
                />
                <Route
                  path="accommodations"
                  element={withPageTransition(AccommodationManagement)()}
                />
                <Route
                  path="accommodations/categories"
                  element={withPageTransition(AccommodationCategoryManagement)()}
                />
                <Route
                  path="accommodations/create"
                  element={withPageTransition(ContentManagement)()}
                />
                <Route
                  path="accommodations/edit/:id"
                  element={withPageTransition(ContentManagement)()}
                />
                <Route
                  path="foods"
                  element={withPageTransition(FoodManagement)()}
                />
                <Route
                  path="foods/categories"
                  element={withPageTransition(FoodCategoryManagement)()}
                />
                <Route
                  path="foods/create"
                  element={withPageTransition(ContentManagement)()}
                />
                <Route
                  path="foods/edit/:id"
                  element={withPageTransition(ContentManagement)()}
                />
                <Route
                  path="community-posts"
                  element={withPageTransition(CommunityPostManagement)()}
                />
                <Route
                  path="ratings"
                  element={withPageTransition(RatingManagement)()}
                />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ThemeProvider>
  );
}

// Main App component - uses the router context from main.tsx
function App() {
  return <AppRouter />;
}

export default App;
