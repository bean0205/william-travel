import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';

// Page imports
import HomePage from '@/pages/HomePage';
import CountrySelectionPage from '@/pages/CountrySelectionPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
// Import các trang admin mới
import ContentManagement from '@/pages/admin/ContentManagement';
import ArticleManagement from '@/pages/admin/ArticleManagement';
import EventManagement from '@/pages/admin/EventManagement';
import ReviewManagement from '@/pages/admin/ReviewManagement';
import ReportsAnalytics from '@/pages/admin/ReportsAnalytics';
import SystemSettings from '@/pages/admin/SystemSettings';
import UserManagement from '@/pages/admin/UserManagement';
import LocationManagement from '@/pages/admin/LocationManagement';
import GuideManagement from '@/pages/admin/GuideManagement';

// Auth is needed for admin routes
import { useAuthStore } from '@/store/authStore';

const AppRouter = () => {
  const { isAuthenticated, user } = useAuthStore();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={APP_ROUTES.COUNTRY_SELECTION.path} element={<CountrySelectionPage />} />
        <Route path={APP_ROUTES.HOME.path} element={<HomePage />} />

        {/* Add other public routes... */}

        {/* Admin Routes - all protected requiring admin role */}
        <Route
          path={APP_ROUTES.ADMIN_DASHBOARD.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Routes cho các trang admin */}
        <Route
          path={APP_ROUTES.ADMIN_CONTENT.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <ContentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ARTICLES.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <ArticleManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_EVENTS.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <EventManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_REVIEWS.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <ReviewManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_REPORTS.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <ReportsAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <SystemSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_USERS.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <LocationManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_GUIDES.path}
          element={
            <ProtectedRoute isAllowed={isAdmin} redirectPath="/unauthorized">
              <GuideManagement />
            </ProtectedRoute>
          }
        />

        {/* Fallback routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path={APP_ROUTES.NOT_FOUND.path} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
