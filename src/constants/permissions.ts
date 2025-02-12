export const PERMISSIONS = {
  // User Management
  CREATE_USER: 'create:user',
  READ_USER: 'read:user',
  UPDATE_USER: 'update:user',
  DELETE_USER: 'delete:user',
  
  // Order Management
  CREATE_ORDER: 'create:order',
  READ_ORDER: 'read:order',
  UPDATE_ORDER: 'update:order',
  DELETE_ORDER: 'delete:order',
  
  // Dashboard Access
  VIEW_DASHBOARD: 'view:dashboard',
  MANAGE_DASHBOARD: 'manage:dashboard',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS]; 