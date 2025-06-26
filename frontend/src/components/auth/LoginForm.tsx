import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './AuthForms.css';

interface LoginFormProps {
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo = '/dashboard' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Clear API error when component unmounts or when form values change
  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, email, password]);

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
    } = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address';
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Dispatch login action
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Log in to Clearbook</h2>
        <p>Track and manage your health records in one place</p>
      </div>

      {error && <div className="auth-form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          autoComplete="email"
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          autoComplete="current-password"
          required
        />

        <div className="auth-form-options">
          <Link to="/reset-password" className="auth-form-link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isLoading}>
          Log In
        </Button>

        <div className="auth-form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-form-link">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
