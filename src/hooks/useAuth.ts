import { User, UserRole } from '../types/auth.types';
import { hasPermission } from '../config/permissions';

export const useAuth = () => {
  const userData: User = JSON.parse(
    localStorage.getItem('user_data') || 
    sessionStorage.getItem('user_data') || 
    '{}'
  );
  
  console.log(userData, 'userData');
  const hasRole = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(userData.role.toUpperCase() as UserRole);
  };

  const checkPermission = (requiredPermission: string): boolean => {
    if (!userData.role) return false;
    return hasPermission(userData.role.toUpperCase() as UserRole, requiredPermission, userData.permissions);
  };

  const canCreateGatePass = (): boolean => {
    return userData.can_create_gatepass || checkPermission('create:gate-pass');
  };

  const canManageShifts = (): boolean => {
    return userData.can_manage_shifts || checkPermission('manage:shifts');
  };

  return {
    user: userData,
    hasRole,
    hasPermission: checkPermission,
    canCreateGatePass,
    canManageShifts,
    isAuthenticated: !!userData.role,
  };
}; 