import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../../../components/auth/LoginForm';
import { loginUser, clearError } from '../../../store/slices/authSlice';
import { TestRouterProvider } from '../../../router/router';

// Mock the auth slice
const mockLoginUser = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../store/slices/authSlice', () => ({
  loginUser: (data: { email: string; password: string }) => {
    mockLoginUser(data);
    return { 
      type: 'auth/login/fulfilled',
      payload: { token: 'test-token', user: data }
    };
  },
  clearError: () => {
    mockClearError();
    return { type: 'auth/clearError' };
  }
}));

// Reset mocks before each test
beforeEach(() => {
  mockLoginUser.mockClear();
  mockClearError.mockClear();
});

// Create mock store without middlewares - we'll handle actions directly in tests
const mockStore = configureStore([]);

describe('LoginForm Component', () => {
  let store: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <TestRouterProvider>
          <LoginForm />
        </TestRouterProvider>
      </Provider>
    );
  };

  test('renders login form with all fields', async () => {
    await act(async () => {
      renderComponent();
    });
    
    expect(screen.getByText(/log in to clearbook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Submit without filling the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
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
      
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });
    
    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  test('dispatches login action with valid credentials', async () => {
    await act(async () => {
      renderComponent();
    });
    
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    // Fill the form correctly
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: testEmail },
      });
      
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: testPassword },
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });
    
    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: testEmail,
        password: testPassword,
      });
    });
  });

  test('displays API error message', async () => {
    store = mockStore({
      auth: {
        isLoading: false,
        error: 'Invalid email or password',
        isAuthenticated: false,
      },
    });
    
    await act(async () => {
      renderComponent();
    });
    
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });

  test('shows loading state during form submission', async () => {
    store = mockStore({
      auth: {
        isLoading: true,
        error: null,
        isAuthenticated: false,
      },
    });
    
    await act(async () => {
      renderComponent();
    });
    
    const loginButton = screen.getByRole('button', { name: /log in/i });
    expect(loginButton).toBeDisabled();
  });
});
