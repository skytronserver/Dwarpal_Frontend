import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MinimalHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#0d5c63',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
          }}
        >
          <img 
            src="/assets/dwarpal.png" 
            alt="Dwarpal Logo" 
            style={{ 
              height: '80px', 
              width: 'auto'
            }} 
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MinimalHeader; 