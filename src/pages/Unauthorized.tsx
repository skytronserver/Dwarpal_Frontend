import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: 3
      }}
    >
      <Lock size={64} color="#f44336" />
      <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You don't have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard')}
        sx={{ mt: 2 }}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;