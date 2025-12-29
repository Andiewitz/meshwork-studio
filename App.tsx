import React from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // indigo-600
    },
    secondary: {
      main: '#f43f5e', // rose-500
    },
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
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