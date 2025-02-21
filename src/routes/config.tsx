import type { ReactNode } from 'react';
import { LayoutDashboardIcon, Building2Icon, UsersIcon, BuildingIcon, ClockIcon, CalendarIcon, DoorClosed as DoorClosedIcon } from "lucide-react";
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
      icon: <LayoutDashboardIcon />,
    },
    {
      kind: 'header',
      title: 'Create',
    },
    {
      segment: 'organisations/new/:id',
      title: 'Create Organisation',
      icon: <Building2Icon />,
      show: hasPermission('create:organization'),
    },
    {
      segment: 'departments/new/:id',
      title: 'Create Department',
      icon: <BuildingIcon />,
      show: hasPermission('create:department'),
    },
    {
      segment: 'users/new/:id',
      title: 'Create User',
      icon: <UsersIcon />,
      show: hasPermission('create:user'),
    },
    {
      segment: 'shifts/new/:id',
      title: 'Create Shift',
      icon: <ClockIcon />,
      show: hasPermission('create:shift'),
    },
    {
      segment: 'gate-passes/new/:id',
      title: 'Create Gate Pass',
      icon: <DoorClosedIcon />,
      show: hasPermission('create:gate-pass'),
    },
    {
      kind: 'header',
      title: 'Manage',
    },
    {
      segment: 'organisations',
      title: 'Manage Organisations',
      icon: <Building2Icon />,
      show: hasPermission('manage:organizations'),
    },
    {
      segment: 'departments',
      title: 'Manage Departments',
      icon: <BuildingIcon />,
      show: hasPermission('manage:departments'),
    },
    {
      segment: 'users',
      title: 'Manage Users',
      icon: <UsersIcon />,
      show: hasPermission('manage:users'),
    },
    {
      segment: 'shifts',
      title: 'Manage Shifts',
      icon: <ClockIcon />,
      show: hasPermission('manage:shifts'),
    },
    {
      segment: 'holidays',
      title: 'Manage Holidays',
      icon: <CalendarIcon />,
      show: hasPermission('manage:holidays'),
    },
    {
      segment: 'gate-passes',
      title: 'Manage Gate Passes',
      icon: <DoorClosedIcon />,
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