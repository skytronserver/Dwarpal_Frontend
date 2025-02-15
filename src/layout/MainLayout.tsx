import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { useNavigation } from '../routes/config';


const MainLayout = () => {  
  return (
    <AppProvider
      navigation={useNavigation()}
      branding={{
        logo: <img src="/assets/logo.png" alt="DWARPAL logo" />,
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
