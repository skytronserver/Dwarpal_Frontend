import { User, UserRole } from '../types/auth.types';
import { hasPermission } from '../config/permissions';

export const useAuth = () => {
  let userData: User;
  try {
    const storedData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    console.log('Stored User Data in useAuth:', storedData);
    
    if (!storedData) {
      userData = {} as User;
    } else {
      userData = JSON.parse(storedData);
      console.log('Parsed User Data:', userData);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    userData = {} as User;
  }

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!userData.role) return false;
    const userRole = userData.role.toUpperCase() as UserRole;
    console.log('Checking role:', userRole, 'against:', allowedRoles);
    return allowedRoles.includes(userRole);
  };

  const checkPermission = (requiredPermission: string): boolean => {
    if (!userData.role) return false;
    const userRole = userData.role.toUpperCase() as UserRole;
    console.log('Checking permission:', requiredPermission, 'for role:', userRole);
    return hasPermission(userRole, requiredPermission, userData.assigned_permissions);
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