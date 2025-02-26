import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { useNavigation } from '../routes/config';
import { ThemeProvider } from '@mui/material';
import { appTheme } from '../themes/AppTheme';
import { Avatar, Box, Typography } from '@mui/material';
import { useLogoutMutation } from '../services/AuthApi';
import { useNavigate } from 'react-router-dom';
const MainLayout = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  // Mock user session data
  const mockSession = {
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/assets/avatar.png"
    },
    isAuthenticated: true
  };

  // Mock authentication provider
  const mockAuthentication = {
    profile: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar src="/assets/avatar.png" alt="User" />
      <Typography>John Doe</Typography>
    </Box>,
    signIn: () => console.log("Sign in"),
    signOut: async () => {
      if (isLoading) return; // Prevent multiple logout attempts
      try {
        await logout().unwrap();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    logout:  () =>  console.log("Sign out"),
    loading: isLoading, // Add loading state to authentication object
  };

  return (
    <ThemeProvider theme={appTheme}>
      <AppProvider
        navigation={useNavigation()}
        branding={{
          logo: <img src="/assets/logo.png" alt="DWARPAL logo" />,
          title: 'DWARPAL',
          homeUrl: '/dashboard',
        }}
        authentication={mockAuthentication}
        session={mockSession}
      >
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
};

export default MainLayout;