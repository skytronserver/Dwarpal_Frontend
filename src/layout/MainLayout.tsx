import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { useNavigation } from '../routes/config';
import { ThemeProvider } from '@mui/material';
import { appTheme } from '../themes/AppTheme';

const MainLayout = () => {  
  return (
    <ThemeProvider theme={appTheme}>
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
    </ThemeProvider>
  );
};

export default MainLayout;
