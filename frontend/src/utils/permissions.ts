import { UserRole } from '@/store/authStore';
import { User } from '@/services/api/userService';

// Define all available permissions in the system
export enum Permission {
  // General user permissions
  VIEW_LOCATIONS = 'view_locations',
  VIEW_GUIDES = 'view_guides',
  ADD_FAVORITE = 'add_favorite',
  
  // Content permissions
  CONTENT_VIEW = 'content_view',
  CONTENT_CREATE = 'content_create',
  CONTENT_EDIT = 'content_edit',
  CONTENT_DELETE = 'content_delete',
  
  // Guide permissions
  CREATE_GUIDE = 'create_guide',
  EDIT_OWN_GUIDE = 'edit_own_guide',
  
  // Admin permissions
  EDIT_ANY_GUIDE = 'edit_any_guide',
  ADD_LOCATION = 'add_location',
  EDIT_LOCATION = 'edit_location',
  DELETE_LOCATION = 'delete_location',
  MANAGE_USERS = 'manage_users',
  
  // Role and Permission management
  ROLE_VIEW = 'role_view',
  ROLE_CREATE = 'role_create',
  ROLE_EDIT = 'role_edit',
  ROLE_DELETE = 'role_delete',
  ROLE_MANAGE = 'role_manage',
  PERMISSION_VIEW = 'permission_view',
  PERMISSION_MANAGE = 'permission_manage',
}

// Role-based permission mapping (default permissions per role)
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CONTENT_VIEW,
  ],
  [UserRole.GUIDE]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CONTENT_VIEW,
    Permission.CREATE_GUIDE,
    Permission.EDIT_OWN_GUIDE,
  ],
  [UserRole.MODERATOR]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.CREATE_GUIDE,
    Permission.EDIT_OWN_GUIDE,
    Permission.EDIT_ANY_GUIDE,
  ],  [UserRole.ADMIN]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_DELETE,
    Permission.CREATE_GUIDE,
    Permission.EDIT_OWN_GUIDE,
    Permission.EDIT_ANY_GUIDE,
    Permission.ADD_LOCATION,
    Permission.EDIT_LOCATION,
    Permission.DELETE_LOCATION,
    Permission.MANAGE_USERS,
    Permission.ROLE_VIEW,
    Permission.ROLE_MANAGE,
  ],
  [UserRole.SUPERUSER]: [
    Permission.VIEW_LOCATIONS,
    Permission.VIEW_GUIDES,
    Permission.ADD_FAVORITE,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_EDIT,
    Permission.CONTENT_DELETE,
    Permission.CREATE_GUIDE,
    Permission.EDIT_OWN_GUIDE,
    Permission.EDIT_ANY_GUIDE,
    Permission.ADD_LOCATION,
    Permission.EDIT_LOCATION,
    Permission.DELETE_LOCATION,
    Permission.MANAGE_USERS,
    Permission.ROLE_VIEW,
    Permission.ROLE_CREATE,
    Permission.ROLE_EDIT,
    Permission.ROLE_DELETE,
    Permission.ROLE_MANAGE,
    Permission.PERMISSION_VIEW,
    Permission.PERMISSION_MANAGE,
  ],
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  // Check role-based permissions
  // return rolePermissions[user.role as UserRole]?.includes(permission) || false;
  return true; // For now, assume all permissions are granted
  // In a real application, you would check against the user's permissions
};

/**
 * Check if user has ANY of the provided permissions
 */
export const hasAnyPermission = (
  user: User | null, 
  permissions: Permission[]
): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has ALL of the provided permissions
 */
export const hasAllPermissions = (
  user: User | null, 
  permissions: Permission[]
): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if user has ANY of the provided roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role as UserRole);
};
