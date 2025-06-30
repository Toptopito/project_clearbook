import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold font-poppins" style={{ color: 'var(--primary-dark)' }}>Clearbook</h1>
            <div className="h-1 w-16 mx-auto mt-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
          </div>
          <LoginForm />
        </div>
      </div>
      <footer className="py-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Clearbook Health. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
