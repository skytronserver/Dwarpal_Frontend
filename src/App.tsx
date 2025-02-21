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

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
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
  );
};

export default App;
