import * as React from 'react';
import { AppProvider, type Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { useNavigation } from '../routes/config';
import { ThemeProvider } from '@mui/material';
import { appTheme } from '../themes/AppTheme';
import { Avatar, Box, Typography, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogoutMutation } from '../services/AuthApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


interface UserData {
  user_id: string;
  user_name: string;
  role: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  employee_code: string;
  // ... you can add other fields if needed
}

const MainLayout = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const [user, setUser] = useState<UserData | null>(null);
  const [pathname, setPathname] = useState('/dashboard');

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = async () => {
    if (isLoading) return;
    try {
      await logout().unwrap();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        const newPath = String(path);
        setPathname(newPath);
        navigate(newPath);
      },
    };
  }, [pathname, navigate]);
  

  const authentication = {
    profile: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar src={'/assets/avatar.png'} alt={user?.user_name || 'User'} />
        {user && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{user.user_name}</Typography>
              <Typography variant="caption" color="text.secondary">{user.role}</Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="error">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    ),
    signIn: () => console.log('Sign in'),
    signOut: handleLogout,
    logout: handleLogout,
    loading: isLoading,
  };

  const sessionUser = user ? {
    name: user.user_name,
    email: user.role,
    image: '/assets/avatar.png'
  } : undefined;

  return (
    <ThemeProvider theme={appTheme}>
      <AppProvider
        navigation={useNavigation()}
        router={router}
        theme={appTheme}
        branding={{
          logo: (
            <img
              src="/assets/dwarpal2.png"
              alt="DWARPAL logo"
              style={{ width: '180px', height: 'auto', maxHeight: '80px', objectFit: 'contain',position:'relative',top:'-42%' }}
            />
          ),
          title: '',
          homeUrl: '/dashboard',
        }}
        authentication={authentication}
        session={{ user: sessionUser }}
      >
        <DashboardLayout >
          <Outlet />
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
};

export default MainLayout;