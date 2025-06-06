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
      default: '#FFF6E9', // Very light cream for main content background
      paper: '#FFF9F3',   // Off-white for cards/paper
    },
    text: {
      primary: '#222', // Dark gray/black for primary text
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
          backgroundColor: '#FFF9F3', // Off-white main content
          color: '#222', // Dark text
          fontFamily: `'Poppins', 'Roboto', 'Segoe UI', 'Arial', sans-serif`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF9F3', // Off-white main content
          color: '#222', // Dark text
          fontFamily: `'Poppins', 'Roboto', 'Segoe UI', 'Arial', sans-serif`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#8fd3bb', // Even lighter sidebar color
          color: '#222', // Dark text
          '& .MuiListItemText-root, & .MuiListItemText-primary, & .MuiTypography-root': {
            color: '#222',
            fontFamily: `'Poppins', 'Roboto', 'Segoe UI', 'Arial', sans-serif`,
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.02em',
          },
          '& .MuiListItemIcon-root': {
            color: '#222',
            fontSize: '1.5rem',
          },
          '& .MuiListItem-root:hover': {
            backgroundColor: '#F5B041', // Deeper orange on hover
          },
          '& .MuiListItem-root.Mui-selected': {
            backgroundColor: '#F5B041', // Deeper orange for selected
            color: '#222',
            '& .MuiListItemText-root, & .MuiListItemIcon-root': {
              color: '#222',
            },
            '&:hover': {
              backgroundColor: '#F5B041',
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#222', // Dark text
          fontFamily: `'Poppins', 'Roboto', 'Segoe UI', 'Arial', sans-serif`,
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