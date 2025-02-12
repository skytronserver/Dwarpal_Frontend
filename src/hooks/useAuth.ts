import { User, UserRole } from '../types/auth.types';

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

  return {
    user: userData,
    hasRole,
    isAuthenticated: !!userData.role,
  };
}; 