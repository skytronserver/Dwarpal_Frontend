import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Matte Navy
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#7F8C8D', // Matte Gray
      light: '#95A5A6',
      dark: '#6C7A7D',
    },
    info: {
      main: '#3498DB', // Matte Blue
      light: '#5DADE2',
      dark: '#2874A6',
    },
    error: {
      main: '#8E44AD', // Matte Purple
      light: '#9B59B6',
      dark: '#7D3C98',
    },
    success: {
      main: '#3498DB', // Matte Blue
      light: '#5DADE2',
      dark: '#2874A6',
    },
    warning: {
      main: '#F39C12', // Matte Orange
      light: '#F5B041',
      dark: '#D68910',
    },
    background: {
      default: '#0d5c63',
      paper: '#0d5c63',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#0d5c63',
          color: '#fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d5c63',
          color: '#fff',
        },
      },
    },
  },
}); 