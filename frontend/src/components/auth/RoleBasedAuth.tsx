import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/authStore';
import { parseJwt } from '@/utils/jwt';

interface RoleBasedAuthProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

const RoleBasedAuth = ({ children, allowedRoles, fallback }: RoleBasedAuthProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuthStore();
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated || !token) {
      navigate('/auth/login', { replace: true });
      return;
    }

    // Check role from JWT token or user object
    let userRole: UserRole | null = null;

    // First try to get role from user object if available
    if (user?.role) {
      userRole = user.role as UserRole;
    } else {
      // Otherwise try to extract from JWT
      try {
        const decodedToken = parseJwt(token);
        if (decodedToken?.role) {
          userRole = decodedToken.role as UserRole;
        }
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    }

    // Check if user has at least one of the allowed roles
    if (userRole && allowedRoles.includes(userRole)) {
      setHasRequiredRole(true);
    } else {
      setHasRequiredRole(false);
      // If not authorized, redirect to unauthorized page
      navigate('/unauthorized', { replace: true });
    }
  }, [isAuthenticated, user, token, allowedRoles, navigate]);

  if (!isAuthenticated || !hasRequiredRole) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default RoleBasedAuth;
