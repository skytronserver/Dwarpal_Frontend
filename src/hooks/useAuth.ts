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
    return allowedRoles.includes(userData.role);
  };

  const checkPermission = (requiredPermission: string): boolean => {
    if (!userData.role) return false;
    return hasPermission(userData.role, requiredPermission);
  };

  return {
    user: userData,
    hasRole,
    hasPermission: checkPermission,
    isAuthenticated: !!userData.role,
  };
}; 