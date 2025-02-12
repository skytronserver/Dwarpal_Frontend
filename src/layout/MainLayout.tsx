import { useMemo } from 'react';
import { adminRoutes, RouteConfig } from '../routes/index';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiPlusCircle, FiSettings } from 'react-icons/fi';

const MainLayout = () => {  
  const { user } = useAuth();

  const navigation = useMemo(() => {
    const filteredRoutes = adminRoutes.filter((route: RouteConfig) => 
      route.allowedRoles.includes(user.role)
    );

    const dashboardRoute = filteredRoutes.find(route => route.path === '/dashboard');

    return [
      {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: dashboardRoute ? <dashboardRoute.icon size={20} /> : null,
        iconProps: { fontSize: 'small' }
      },
      {
        title: 'Create',
        icon: <FiPlusCircle size={20} />,
        iconProps: { fontSize: 'small' },
        defaultExpanded: true,
        children: filteredRoutes
          .filter((route) => route.group === 'create')
          .map((route) => ({
            segment: route.path.replace('/', ''),
            title: route.title,
            icon: <route.icon size={20} />,
            iconProps: { fontSize: 'small' }
          }))
      },
      {
        title: 'Manage',
        icon: <FiSettings size={20} />,
        iconProps: { fontSize: 'small' },
        defaultExpanded: true,
        children: filteredRoutes
          .filter((route) => route.group === 'manage')
          .map((route) => ({
            segment: route.path.replace('/', ''),
            title: route.title,
            icon: <route.icon size={20} />,
            iconProps: { fontSize: 'small' }
          }))
      }
    ];
  }, [user.role]);

  console.log(navigation);

  return (
    <AppProvider
      navigation={navigation}
      branding={{
        logo: <img src="/assets/logo.png" alt="DWARPAL logo" style={{ height: '32px' }} />,
        title: 'DWARPAL',
        homeUrl: '/dashboard',
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
};

export default MainLayout;
