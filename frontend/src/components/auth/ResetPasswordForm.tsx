import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './AuthForms.css';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Clear API error when component unmounts or when form values change
  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, email]);

  const validateForm = () => {
    const errors: { email?: string } = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address';
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

    // Dispatch reset password action
    const resultAction = await dispatch(resetPassword({ email }));
    
    // In tests or when using mocks, resetPassword.fulfilled might not exist
    // Check both the RTK way and by looking at the action type directly
    if ((resetPassword.fulfilled && resetPassword.fulfilled.match(resultAction)) || 
        (resultAction && resultAction.type === 'auth/resetPassword/fulfilled')) {
      // Success - show confirmation message
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2>Check your email</h2>
          <p>
            We've sent instructions to reset your password to {email}. Please check your inbox.
          </p>
        </div>
        <div className="auth-form-footer" style={{ marginTop: '2rem' }}>
          <Link to="/login" className="button w-full bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100 rounded px-4 py-2 font-medium transition-all flex items-center justify-center gap-2">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Reset your password</h2>
        <p>Enter your email to receive password reset instructions</p>
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

        <Button type="submit" fullWidth loading={isLoading}>
          Reset Password
        </Button>

        <div className="auth-form-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="auth-form-link">
              Back to Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
