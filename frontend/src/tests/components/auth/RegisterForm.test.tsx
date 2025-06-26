import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../../../components/auth/RegisterForm';

// Import the action creators first before mocking them
import { registerUser, clearError } from '../../../store/slices/authSlice';

// Mock the authSlice and its actions
const mockRegisterUser = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../store/slices/authSlice', () => ({
  registerUser: (data: { username: string; email: string; password: string; confirmPassword: string }) => {
    mockRegisterUser(data);
    return { 
      type: 'auth/register/fulfilled',
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
  mockRegisterUser.mockClear();
  mockClearError.mockClear();
});

// Create mock store without middleware - we'll handle actions directly in the tests
const mockStore = configureStore([]);

describe('RegisterForm Component', () => {
  let store: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new instance of the mock store for each test
    store = mockStore({
      auth: {
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders registration form with all fields', async () => {
    await renderComponent();
    
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    await renderComponent();
    
    // Submit without filling the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email format', async () => {
    await renderComponent();
    
    // Fill with invalid email and valid other fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });
    
    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for password less than 8 characters', async () => {
    await renderComponent();
    
    // Fill with short password and valid other fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'short' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for passwords not matching', async () => {
    await renderComponent();
    
    // Fill with non-matching passwords and valid other fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });
    
    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('dispatches register action with valid form data', async () => {
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };
    
    await renderComponent();
    
    // Wrap all form interactions in act
    await act(async () => {
      // Fill the form correctly
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: testData.firstName } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: testData.lastName } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: testData.email } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: testData.password } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: testData.confirmPassword } });
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });
    
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        firstName: testData.firstName,
        lastName: testData.lastName,
        email: testData.email,
        password: testData.password,
      });
    });
  });

  test('displays error message after failed submission', async () => {
    // Create a special mock store with an error state for this test
    const errorStore = mockStore({
      auth: {
        isAuthenticated: false,
        isLoading: false,
        error: 'Email already exists',
      },
    });
    
    // Override registerUser mock just for this test
    mockRegisterUser.mockImplementation(() => ({ 
      type: 'auth/registerUser/rejected', 
      error: { message: 'Email already exists' }
    }));

    // Render with the error store instead of the regular store
    render(
      <Provider store={errorStore}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
  });

  test('shows loading state during form submission', async () => {
    store = mockStore({
      auth: {
        isLoading: true,
        error: null,
      },
    });
    
    await renderComponent();
    
    const registerButton = screen.getByRole('button', { name: /create account/i });
    expect(registerButton).toBeDisabled();
    // Check for the spinner SVG instead of loading text
    expect(screen.getByRole('button', { name: /create account/i }).querySelector('svg.animate-spin')).toBeInTheDocument();
  });
});
