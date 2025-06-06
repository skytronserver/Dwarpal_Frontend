import { UserRole } from '../types/auth.types';

export const ROLE_PERMISSIONS = {
  SUPERADMIN: [
    'view:dashboard',
    'create:service-provider',
    'manage:organizations',
    'view:organizations',
    'create:organization',
    'create:client',
    'edit:organization',
    'delete:organization',
    'manage:departments',
    'create:department',
    'edit:department',
    'delete:department',
    'manage:admin-users',
    'create:admin-user',
    'edit:admin-user',
    'delete:admin-user',
    'create:subscription',
  ],
  ADMIN: [
    'view:dashboard',
    'manage:user',
    'create:user',
    'manage:users',
    'edit:user',
    'create:guest-pass',
    'create:shift',
    'delete:user',
    'manage:holidays',
    'edit:holiday',
    'delete:holiday',
    'manage:shifts',
    'edit:shift',
    'delete:shift',
    'manage:gate-passes',
    'approve:gate-pass',
    'view:attendance',
    'manage:attendance',
    'approve:approval',
    'approver:comment',
    "settings:guest-pass",
    "create:guest-pass"
  ],
  EMPLOYEE: [
    'view:dashboard',
    'manage:holidays',
    'view:attendance',
  ]
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS;

export const hasPermission = (userRole: UserRole, requiredPermission: string, userPermissions?: string[]): boolean => {
  const roleHasPermission = ROLE_PERMISSIONS[userRole]?.includes(requiredPermission as any);
  const userHasPermission = userPermissions?.includes(requiredPermission);
  
  return roleHasPermission || !!userHasPermission;
}; 