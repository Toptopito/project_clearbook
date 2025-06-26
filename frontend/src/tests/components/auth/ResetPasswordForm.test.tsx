import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { act } from 'react';
import ResetPasswordForm from '../../../components/auth/ResetPasswordForm';
import { TestRouterProvider } from '../../../router/router';

// Mock the auth slice
const mockResetPassword = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../store/slices/authSlice', () => ({
  resetPassword: (data: { email: string }) => {
    mockResetPassword(data);
    return { type: 'auth/resetPassword/fulfilled', payload: { success: true } };
  },
  clearError: () => {
    mockClearError();
    return { type: 'auth/clearError' };
  }
}));

// Reset mocks before each test
beforeEach(() => {
  mockResetPassword.mockClear();
  mockClearError.mockClear();
});

// Create mock store without middlewares - we'll handle actions directly in tests
const mockStore = configureStore([]);

describe('ResetPasswordForm Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoading: false,
        error: null,
      },
    });
    
    // Reset mocks
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <TestRouterProvider>
          <ResetPasswordForm />
        </TestRouterProvider>
      </Provider>
    );
  };

  test('renders password reset form with all fields', async () => {
    await act(async () => {
      renderComponent();
    });
    
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/remember your password/i)).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });

  test('shows validation error for empty email field', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Submit without filling the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });
    
    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email format', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Fill with invalid email
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' },
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });
    
    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  test('dispatches reset password action with valid email', async () => {
    await act(async () => {
      renderComponent();
    });
    
    const testEmail = 'test@example.com';
    
    // Fill the form correctly
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: testEmail },
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({ email: testEmail });
    });
  });

  test('displays success message after successful submission', async () => {
    // Reset the mock implementation for this specific test
    mockResetPassword.mockImplementation(() => ({
      type: 'auth/resetPassword/fulfilled',
      payload: { success: true },
    }));
    
    await act(async () => {
      renderComponent();
    });
    
    const testEmail = 'test@example.com';
    
    // Fill the form correctly
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: testEmail },
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      expect(screen.getByText(/we've sent instructions to reset your password/i)).toBeInTheDocument();
    });
  });

  test('displays API error message', async () => {
    store = mockStore({
      auth: {
        isLoading: false,
        error: 'Email not found',
      },
    });
    
    await act(async () => {
      renderComponent();
    });
    
    expect(screen.getByText(/email not found/i)).toBeInTheDocument();
  });

  test('shows loading state during form submission', async () => {
    store = mockStore({
      auth: {
        isLoading: true,
        error: null,
      },
    });
    
    await act(async () => {
      renderComponent();
    });
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    expect(resetButton).toBeDisabled();
  });
});
