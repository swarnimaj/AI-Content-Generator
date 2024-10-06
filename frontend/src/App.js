import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ContentGenerator from './components/ContentGenerator';
import LandingPageGenerator from './components/LandingPageGenerator';
import LogoutFab from './components/LogoutFab';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#80cbc4',
    },
    secondary: {
      main: '#ff8a65',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const showLogoutButton = isAuthenticated && location.pathname !== '/auth';

  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/content-generator" element={isAuthenticated ? <ContentGenerator /> : <Navigate to="/auth" />} />
        <Route path="/landing-page-generator" element={isAuthenticated ? <LandingPageGenerator /> : <Navigate to="/auth" />} />
      </Routes>
      {showLogoutButton && <LogoutFab onLogout={handleLogout} />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;