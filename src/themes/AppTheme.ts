import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#FF8361', // Coral
      light: '#ff9b7a',
      dark: '#e66b4c',
    },
    secondary: {
      main: '#899EE8', // Periwinkle Blue
      light: '#a4b5ff',
      dark: '#6f85cc',
    },
    info: {
      main: '#BDEDE0', // Mint
      light: '#d4fff3',
      dark: '#9ad3c7',
    },
    error: {
      main: '#2E0219', // Dark Purple
      light: '#441a2f',
      dark: '#1a0110',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#32213A', // Dark Navy
      secondary: '#4a3751',
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
        },
      },
    },
  },
}); 