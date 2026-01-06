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
import * as ReactRouterDOM from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CommandPalette } from './components/CommandPalette';

const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

const App: React.FC = () => {
  // Dark mode theme configuration
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#6366f1', // Indigo 500
      },
      secondary: {
        main: '#f43f5e', // Rose 500
      },
      background: {
        default: '#020617', // Slate 950
        paper: '#0f172a',   // Slate 900
      },
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
      }
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
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#0f172a',
            backgroundImage: 'none',
          }
        }
      }
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <HashRouter>
          {/* Global Command Palette available on all routes */}
          <CommandPalette />
          
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