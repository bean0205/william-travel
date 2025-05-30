import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserRole, useAuthStore } from '@/store/authStore';
import { Permission } from '@/utils/permissions';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { hasAnyPermission, hasAnyRole } from '@/utils/permissions';

interface ProtectedRouteProps {
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ requiredPermissions, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, checkAuth, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuth]);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="auth/login" state={{ from: location.pathname }} replace />;
  }

  // Check for required permissions if specified
  // if (requiredPermissions && requiredPermissions.length > 0) {
  //   if (!hasAnyPermission(user, requiredPermissions)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  // Check for required roles if specified
  // if (requiredRoles && requiredRoles.length > 0) {
  //   if (!hasAnyRole(user, requiredRoles)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  return <Outlet />;
};

export default ProtectedRoute;
