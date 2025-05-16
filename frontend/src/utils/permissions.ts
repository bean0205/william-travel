import { UserRole, AuthUser } from '@/store/authStore';

// Define all available permissions in the system
export enum Permission {
  // General user permissions
  VIEW_LOCATIONS = 'view_locations',
  VIEW_GUIDES = 'view_guides',
  ADD_FAVORITE = 'add_favorite',
  
  // Guide permissions
  CREATE_GUIDE = 'create_guide',
  EDIT_OWN_GUIDE = 'edit_own_guide',
  
  // Admin permissions
  EDIT_ANY_GUIDE = 'edit_any_guide',
  ADD_LOCATION = 'add_location',
  EDIT_LOCATION = 'edit_location',
  DELETE_LOCATION = 'delete_location',
  MANAGE_USERS = 'manage_users',
}

// Role-based permission mapping (default permissions per role)
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
  ],
  [UserRole.GUIDE]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CREATE_GUIDE,
    Permission.EDIT_OWN_GUIDE,
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CREATE_GUIDE,
    Permission.EDIT_OWN_GUIDE,
    Permission.EDIT_ANY_GUIDE,
    Permission.ADD_LOCATION,
    Permission.EDIT_LOCATION,
    Permission.DELETE_LOCATION,
    Permission.MANAGE_USERS,
  ],
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: AuthUser | null, permission: Permission): boolean => {
  if (!user) return false;

  // If user has specific permissions list, check there first
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }

  // Fallback to role-based permissions
  return rolePermissions[user.role]?.includes(permission) || false;
};

/**
 * Check if user has ANY of the provided permissions
 */
export const hasAnyPermission = (
  user: AuthUser | null, 
  permissions: Permission[]
): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has ALL of the provided permissions
 */
export const hasAllPermissions = (
  user: AuthUser | null, 
  permissions: Permission[]
): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: AuthUser | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if user has ANY of the provided roles
 */
export const hasAnyRole = (user: AuthUser | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};
