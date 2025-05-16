import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { UserRole, useAuthStore } from '@/store/authStore';
import { Permission } from '@/utils/permissions';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const MapExplorerPage = lazy(() => import('@/pages/MapExplorerPage'));
const LocationsPage = lazy(() => import('@/pages/LocationsPage'));
const GuidesPage = lazy(() => import('@/pages/GuidesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const LocationManagement = lazy(() => import('@/pages/admin/LocationManagement'));
const GuideManagement = lazy(() => import('@/pages/admin/GuideManagement'));

// Guide pages
const GuideDashboard = lazy(() => import('@/pages/guide/Dashboard'));
const CreateGuidePage = lazy(() => import('@/pages/guide/CreateGuidePage'));
const MyGuidesPage = lazy(() => import('@/pages/guide/MyGuidesPage'));
const EditGuidePage = lazy(() => import('@/pages/guide/EditGuidePage'));

function App() {
  const { checkAuth } = useAuthStore();

  // Check auth status when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapExplorerPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="guides" element={<GuidesPage />} />
          
          {/* Auth routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Basic user protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
            <Route path="favorites" element={<div>Favorites Page (Coming Soon)</div>} />
          </Route>
        </Route>

        {/* Guide protected routes */}
        <Route element={
          <ProtectedRoute 
            requiredRoles={[UserRole.GUIDE, UserRole.ADMIN]} 
            requiredPermissions={[Permission.CREATE_GUIDE]} 
          />
        }>
          <Route path="/" element={<MainLayout />}>
            <Route path="guide" element={<GuideDashboard />} />
            <Route path="guides/create" element={<CreateGuidePage />} />
            <Route path="guides/my-guides" element={<MyGuidesPage />} />
            <Route path="guides/edit/:guideId" element={<EditGuidePage />} />
          </Route>
        </Route>

        {/* Admin protected routes */}
        <Route element={
          <ProtectedRoute 
            requiredRoles={[UserRole.ADMIN]} 
            requiredPermissions={[Permission.MANAGE_USERS]} 
          />
        }>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="locations/manage" element={<LocationManagement />} />
            <Route path="guides/manage" element={<GuideManagement />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
