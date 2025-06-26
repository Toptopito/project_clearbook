import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages (will create these next)
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const LabResults = React.lazy(() => import('../pages/LabResults'));
const LabResultDetail = React.lazy(() => import('../pages/LabResultDetail'));
const AddLabResult = React.lazy(() => import('../pages/AddLabResult'));
const Profile = React.lazy(() => import('../pages/Profile'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Auth guard for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/lab-results" element={
          <ProtectedRoute>
            <LabResults />
          </ProtectedRoute>
        } />
        
        <Route path="/lab-results/add" element={
          <ProtectedRoute>
            <AddLabResult />
          </ProtectedRoute>
        } />
        
        <Route path="/lab-results/:id" element={
          <ProtectedRoute>
            <LabResultDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
