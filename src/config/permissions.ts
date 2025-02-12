import { UserRole } from '../types/auth.types';

export const ROLE_PERMISSIONS = {
  SUPERADMIN: [
    'view:dashboard',
    'manage:organizations',
    'manage:departments',
    'manage:users',
    'manage:settings',
    'create:organization',
    'edit:organization',
    'delete:organization',
    'create:department',
    'edit:department',
    'delete:department',
    'create:user',
    'edit:user',
    'delete:user'
  ],
  ADMIN: [
    'view:dashboard',
    'view:organizations',
    'manage:departments',
    'manage:users',
    'create:department',
    'edit:department',
    'create:user',
    'edit:user'
  ],
  HR: [
    'view:dashboard',
    'view:departments',
    'manage:users',
    'create:user',
    'edit:user'
  ],
  ACCOUNTS: [
    'view:dashboard',
    'view:users'
  ],
  FRONTDESK: ['view:dashboard'],
  HELPDESK: ['view:dashboard'],
  SECURITY: ['view:dashboard'],
  OTHERS: ['view:dashboard']
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS;

export const hasPermission = (userRole: UserRole, requiredPermission: string): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(requiredPermission as any) ?? false;
}; 