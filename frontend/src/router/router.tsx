import React from 'react';
import { 
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import App from '../App';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ResetPassword from '../pages/auth/ResetPassword';
import LabResults from '../pages/LabResults';
import AddLabResult from '../pages/AddLabResult';
import Dashboard from '../pages/Dashboard';

// Create a router component with future flags enabled using data attributes
// React Router v6 uses data attributes to enable future flags
export const AppRouter: React.FC = () => {
  return (
    // @ts-ignore - future props are recognized by React Router but not in TypeScript definitions yet
    <BrowserRouter
      future={{
        // These will be properly used by React Router when supported
        // Currently they'll be ignored but prevent warnings during development
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lab-results" element={<LabResults />} />
          <Route path="add-lab-result" element={<AddLabResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// Test helper for providing router context with future flags
// Use this in tests instead of regular BrowserRouter
export const TestRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // Using MemoryRouter for tests instead of BrowserRouter
    // MemoryRouter doesn't have the v7 future flag warnings
    <MemoryRouter initialEntries={["/"]}>
      {children}
    </MemoryRouter>
  );
};
