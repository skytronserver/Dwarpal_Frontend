import { Navigate } from 'react-router-dom';
import { UserRole } from '../types/auth.types';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const userData = JSON.parse(localStorage.getItem('user_data') || sessionStorage.getItem('user_data') || '{}');
  
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute; 