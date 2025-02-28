import { User, UserRole } from '../types/auth.types';
import { hasPermission } from '../config/permissions';

export const useAuth = () => {
  const userData: User = JSON.parse(
    localStorage.getItem('user_data') || 
    sessionStorage.getItem('user_data') || 
    '{}'
  );

  console.log(userData,'userData');
  
  const hasRole = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(userData.role.toUpperCase() as UserRole);
  };

  const checkPermission = (requiredPermission: string): boolean => {
    if (!userData.role) return false;
    return hasPermission(userData.role.toUpperCase() as UserRole, requiredPermission, userData.assigned_permissions);
  };

  const canCreateGatePass = (): boolean => {
    return !!(userData?.assigned_permissions?.includes('can_create_guest_pass') && checkPermission('create:gate-pass'));
  };

  return {
    user: userData,
    hasRole,
    hasPermission: checkPermission,
    canCreateGatePass,
    isAuthenticated: !!userData.role,
  };
}; 