import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import ProtectedRoute from './utils/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { adminRoutes } from './routes/index';
import MainLayout from './layout/MainLayout';
import Authentication from './pages/authentication/Authentication';
import Unauthorized from './pages/Unauthorized';
import { RouteConfig } from './routes/adminRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { CircularProgress } from '@mui/material';
import { ToastProvider } from './context/ToastContext';
import { PrivacyPolicy, TermsAndConditions } from './pages';
import Home from './pages/Home/Home';
import OTPVerification from './pages/authentication/OTPVerification';

const App = () => {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {adminRoutes.map((route: RouteConfig) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RoleRoute allowedRoles={route.allowedRoles}>
                    <Suspense fallback={
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                      </div>
                    }>
                      <route.element />
                    </Suspense>
                  </RoleRoute>
                }
              />
            ))}
          </Route>
        </Routes>
      </ErrorBoundary>
    </ToastProvider>
  );
};

export default App;
