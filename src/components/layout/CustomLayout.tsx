import React, { useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useLogoutMutation } from '../../services/AuthApi';
import Sidebar from './Sidebar';
import { ThemeProvider } from '@mui/material';
import { appTheme } from '../../themes/AppTheme';

interface UserData {
  user_id: string;
  user_name: string;
  role: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  employee_code: string;
}

const CustomLayout = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const [user, setUser] = useState<UserData | null>(null);

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

  return (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AppBar 
            position="static" 
            color="default" 
            elevation={1}
            sx={{ 
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Toolbar>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {user && (
                  <>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2">
                        {user.user_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.role}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32
                      }}
                    >
                      {user.user_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </>
                )}
                <Tooltip title="Logout">
                  <IconButton 
                    onClick={handleLogout}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <LogOut size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>

          <Box 
            component="main" 
            sx={{ 
              flex: 1,
              p: 3,
              bgcolor: 'background.default',
              overflowY: 'auto'
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomLayout;
