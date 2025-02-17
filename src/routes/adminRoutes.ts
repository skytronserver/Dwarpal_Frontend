import { ElementType } from 'react';
import { UserRole } from '../types/auth.types';

export interface RouteConfig {
  path: string;
  element: ElementType;
  title: string;
  icon?: ElementType;
  allowedRoles: UserRole[];
  permission?: string;
  showInNav?: boolean;
  children?: RouteConfig[];
}
