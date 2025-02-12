import { UserRole } from "./auth.types";

export interface MenuItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapse';
  icon?: any;
  path?: string;
  element?: React.LazyExoticComponent<any>;
  allowedRoles: UserRole[];
  permission?: string;
  showInNav?: boolean;
  children?: MenuItem[];
}

export type RouteConfig = MenuItem; 