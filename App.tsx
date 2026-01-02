import React, { useMemo } from 'react';
import { Layout } from './components/Layout';
import { FlowEditor } from './components/FlowEditor';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { DevLogsPage } from './pages/DevLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TemplateSelectorPage } from './pages/TemplateSelectorPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const App: React.FC = () => {
  // Define a brutalist-inspired theme to match the app aesthetic
  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: '#4f46e5', // Indigo 600
      },
      secondary: {
        main: '#f43f5e', // Rose 500
      },
      background: {
        default: '#fdfbf7',
      },
    },
    typography: {
      fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: 'Plus Jakarta Sans' },
      h2: { fontFamily: 'Plus Jakarta Sans' },
      h3: { fontFamily: 'Plus Jakarta Sans' },
      h4: { fontFamily: 'Plus Jakarta Sans' },
      h5: { fontFamily: 'Plus Jakarta Sans' },
      h6: { fontFamily: 'Plus Jakarta Sans' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* New Flow Template Selector */}
            <Route path="/flow/new" element={
              <ProtectedRoute>
                <TemplateSelectorPage />
              </ProtectedRoute>
            } />

            {/* Immersive Editor Route */}
            <Route path="/flow/:flowId" element={
              <ProtectedRoute>
                <FlowEditor />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Routes - Uses Standard Layout */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dev-logs" element={<DevLogsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;