import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import { UserRole } from '../types/auth.types';

export interface RouteConfig {
  path: string;
  element: FC;
  title: string;
  icon?: LucideIcon;
  allowedRoles: UserRole[];
  permission?: string;
  showInNav?: boolean;
  children?: RouteConfig[];
}
