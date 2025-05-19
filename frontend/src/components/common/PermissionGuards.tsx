import React from 'react';
import { Permission, hasPermission, hasRole, hasAnyPermission, hasAnyRole } from '@/utils/permissions';
import { UserRole, useAuthStore } from '@/store/authStore';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render children only if user has the required permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children,
  fallback = null
}) => {
  const { user } = useAuthStore();
  
  if (hasPermission(user, permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

interface PermissionsGuardProps {
  permissions: Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render children only if user has the required permissions
 */
export const PermissionsGuard: React.FC<PermissionsGuardProps> = ({ 
  permissions, 
  requireAll = false,
  children,
  fallback = null
}) => {
  const { user } = useAuthStore();
  
  const hasRequiredPermissions = requireAll 
    ? permissions.every(permission => hasPermission(user, permission))
    : permissions.some(permission => hasPermission(user, permission));
  
  if (hasRequiredPermissions) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

interface RoleGuardProps {
  role: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render children only if user has the required role
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  role, 
  children,
  fallback = null
}) => {
  const { user } = useAuthStore();
  
  if (hasRole(user, role)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

interface RolesGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render children only if user has any of the required roles
 */
export const RolesGuard: React.FC<RolesGuardProps> = ({ 
  roles, 
  children,
  fallback = null
}) => {
  const { user } = useAuthStore();
  
  if (hasAnyRole(user, roles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render children only if user is authenticated
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children,
  fallback = null
}) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
