import { createTheme} from '@mui/material';
import { cyan, deepPurple } from '@mui/material/colors';

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[700],
      dark: deepPurple[800],
      light: deepPurple[500],
      contrastText: '#ffffff',
    },
    secondary: {
      main: cyan[500],
      dark: cyan[400],
      light: cyan[300],
      contrastText: '#ffffff',
    },
    background: {
      default: '#303134',
      paper: '#202124',
    }
  },
  typography: {
    allVariants: {
      color: 'white',
    },
  }
});