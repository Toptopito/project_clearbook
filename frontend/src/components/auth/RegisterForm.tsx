import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './AuthForms.css';

interface RegisterFormProps {
  redirectTo?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ redirectTo = '/dashboard' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
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
  }, [dispatch, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

    // Dispatch register action
    const { firstName, lastName, email, password } = formData;
    dispatch(registerUser({ email, password, firstName, lastName }));
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Create your account</h2>
        <p>Join Clearbook to manage your health records</p>
      </div>

      {error && <div className="auth-form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            error={formErrors.firstName}
            autoComplete="given-name"
            required
          />

          <Input
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            error={formErrors.lastName}
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          autoComplete="email"
          required
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password (min. 8 characters)"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          autoComplete="new-password"
          required
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <Button type="submit" fullWidth loading={isLoading}>
          Create Account
        </Button>

        <div className="auth-form-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-form-link">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
