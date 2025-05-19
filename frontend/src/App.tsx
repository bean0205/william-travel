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

// Location detail page
const LocationDetailPage = lazy(() => import('@/pages/LocationDetailPage'));

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

              {/* Auth routes */}
              <Route path="login" element={withPageTransition(LoginPage)()} />
              <Route
                path="register"
                element={withPageTransition(RegisterPage)()}
              />
              <Route
                path="forgot-password"
                element={withPageTransition(ForgotPasswordPage)()}
              />
              <Route
                path="reset-password/:token"
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
                  element={withPageTransition(() => (
                    <div>Profile Page (Coming Soon)</div>
                  ))()}
                />
                <Route
                  path="favorites"
                  element={withPageTransition(() => (
                    <div>Favorites Page (Coming Soon)</div>
                  ))()}
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
