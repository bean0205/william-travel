// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/App.tsx
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
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
const ForgotPasswordPage = lazy(
  () => import('@/pages/auth/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const LocationManagement = lazy(
  () => import('@/pages/admin/LocationManagement')
);
const GuideManagement = lazy(() => import('@/pages/admin/GuideManagement'));

// Guide pages
const GuideDashboard = lazy(() => import('@/pages/guide/Dashboard'));
const CreateGuidePage = lazy(() => import('@/pages/guide/CreateGuidePage'));
const MyGuidesPage = lazy(() => import('@/pages/guide/MyGuidesPage'));
const EditGuidePage = lazy(() => import('@/pages/guide/EditGuidePage'));

// Wrap each component with PageTransition
const withPageTransition =
  (Component: React.ComponentType<any>) => (props: any) => (
    <PageTransition>
      <Component {...props} />
    </PageTransition>
  );

function App() {
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
              <Route path="/admin" element={<MainLayout />}>
                <Route index element={withPageTransition(AdminDashboard)()} />
                <Route
                  path="users"
                  element={withPageTransition(UserManagement)()}
                />
                <Route
                  path="locations/manage"
                  element={withPageTransition(LocationManagement)()}
                />
                <Route
                  path="guides/manage"
                  element={withPageTransition(GuideManagement)()}
                />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
