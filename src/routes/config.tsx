import type { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Building, 
  Clock, 
  Calendar, 
  DoorClosed,
  UserPlus,
  Plus,
  Timer,
  CalendarPlus,
  DoorOpen 
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface NavigationHeader {
  kind: 'header';
  title: string;
  show?: boolean;
}

interface NavigationLink {
  segment: string;
  title: string;
  icon: ReactNode;
  show?: boolean;
}

type NavigationItem = NavigationHeader | NavigationLink;

export const useNavigation = () => {
  const { hasPermission } = useAuth();
  
  const allRoutes: NavigationItem[] = [
    {
      kind: 'header',
      title: 'Dashboard',
    },
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard />,
    },
    {
      kind: 'header',
      title: 'Create',
    },
    {
      segment: 'organisations/new/:id',
      title: 'Create Organisation',
      icon: <Plus />,
      show: hasPermission('create:organization'),
    },
    {
      segment: 'departments/new/:id',
      title: 'Create Department',
      icon: <Plus />,
      show: hasPermission('create:department'),
    },
    {
      segment: 'users/new/:id',
      title: 'Create User',
      icon: <UserPlus />,
      show: hasPermission('create:user') || hasPermission('create:admin-user'),
    },
    {
      segment: 'shifts/new/:id',
      title: 'Create Shift',
      icon: <Timer />,
      show: hasPermission('create:shift'),
    },
    {
      segment: 'holidays/new/:id',
      title: 'Create Holiday',
      icon: <CalendarPlus />,
      show: hasPermission('create:holiday'),
    },
    {
      segment: 'gate-passes/new/:id',
      title: 'Create Gate Pass',
      icon: <DoorOpen />,
      show: hasPermission('create:gate-pass'),
    },
    {
      kind: 'header',
      title: 'Manage',
    },
    {
      segment: 'organisations',
      title: 'Manage Organisations',
      icon: <Building2 />,
      show: hasPermission('manage:organizations'),
    },
    {
      segment: 'departments',
      title: 'Manage Departments',
      icon: <Building />,
      show: hasPermission('manage:departments'),
    },
    {
      segment: 'users',
      title: 'Manage Users',
      icon: <Users />,
      show: hasPermission('manage:users') || hasPermission('manage:admin-users'),
    },
    {
      segment: 'shifts',
      title: 'Manage Shifts',
      icon: <Clock />,
      show: hasPermission('manage:shifts'),
    },
    {
      segment: 'holidays',
      title: 'Manage Holidays',
      icon: <Calendar />,
      show: hasPermission('manage:holidays'),
    },
    {
      segment: 'gate-passes',
      title: 'Manage Gate Passes',
      icon: <DoorClosed />,
      show: hasPermission('manage:gate-passes'),
    },
  ];

  return allRoutes.filter((route): route is NavigationItem => {
    if ('kind' in route && route.kind === 'header') {
      const nextItems = allRoutes.slice(allRoutes.indexOf(route) + 1);
      const hasVisibleItems = nextItems.some(item => 
        !('kind' in item) && item.show !== false
      );
      return hasVisibleItems;
    }
    return !('kind' in route) && route.show !== false;
  });
};