import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#19b6b3', // Teal accent from logo
      light: '#4fd8d7',
      dark: '#0d5c63', // Logo background (header)
      contrastText: '#fff',
    },
    secondary: {
      main: '#0d5c63', // Logo background
      light: '#19b6b3',
      dark: '#0a4347',
      contrastText: '#fff',
    },
    info: {
      main: '#19b6b3',
      light: '#4fd8d7',
      dark: '#0d5c63',
      contrastText: '#fff',
    },
    error: {
      main: '#e74c3c',
      light: '#ff6f61',
      dark: '#c0392b',
      contrastText: '#fff',
    },
    success: {
      main: '#19b6b3',
      light: '#4fd8d7',
      dark: '#0d5c63',
      contrastText: '#fff',
    },
    warning: {
      main: '#F39C12',
      light: '#F5B041',
      dark: '#D68910',
      contrastText: '#fff',
    },
    background: {
      default: '#fff', // White background
      paper: '#fff',   // White for cards/paper
    },
    text: {
      primary: '#222', // Dark text for white backgrounds
      secondary: '#555', // Slightly lighter dark for secondary text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          color: '#fff',
          backgroundColor: '#19b6b3',
          '&:hover': {
            backgroundColor: '#0d5c63',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#fff', // White main content
          color: '#222',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', // White main content
          color: '#222',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fff', // White sidebar
          color: '#222',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#222',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d5c63', // Teal header
          color: '#fff',
        },
      },
    },
  },
}); 