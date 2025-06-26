import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddLabResult from '../pages/AddLabResult';
import { labResultService } from '../services/labResultService';
import { TestRouterProvider } from '../router/router';

// Import act directly from React to avoid deprecation warnings
import { act } from 'react';

// Mock dependencies
jest.mock('../services/labResultService', () => ({
  labResultService: {
    createLabResult: jest.fn(),
    uploadDocument: jest.fn()
  }
}));

// Mock window.alert since it's not implemented in JSDOM
const originalAlert = window.alert;
beforeAll(() => {
  window.alert = jest.fn();
});

afterAll(() => {
  window.alert = originalAlert;
});

// Mock router navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('AddLabResult Component', () => {
  // Mock the lab result service before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (labResultService.createLabResult as jest.Mock).mockResolvedValue({
      id: 1,
      test_name: 'Blood Test',
      test_date: '2025-06-23'
    });
  });
  
  // Ensure cleanup after each test
  afterEach(cleanup);
  
  const renderComponent = () => render(
    <TestRouterProvider>
      <AddLabResult />
    </TestRouterProvider>
  );

  // Helper function to fill out all required fields
  const fillRequiredFields = async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Test Name/i), {
        target: { value: 'Blood Test' },
      });
      
      fireEvent.change(screen.getByLabelText(/Test Date/i), {
        target: { value: '2025-06-23' },
      });
      
      fireEvent.change(screen.getByLabelText(/Category/i), {
        target: { value: 'Blood' },
      });
      
      fireEvent.change(screen.getByLabelText(/Result Value/i), {
        target: { value: '120' },
      });
      
      fireEvent.change(screen.getByLabelText(/Unit/i), {
        target: { value: 'mg/dL' },
      });
      
      fireEvent.change(screen.getByLabelText(/Reference Range/i), {
        target: { value: '80-120' },
      });
    });
  };

  test('renders the form with all fields', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Check if all form sections are present
    expect(screen.getByText('Add New Lab Result')).toBeInTheDocument();
    expect(screen.getByText('Test Information')).toBeInTheDocument();
    expect(screen.getByText('Result Details')).toBeInTheDocument();
    expect(screen.getByText('Original Document')).toBeInTheDocument();
    
    // Check for required fields
    expect(screen.getByLabelText(/Test Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Test Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Result Value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Submit the form without filling any fields
    await act(async () => {
      fireEvent.click(screen.getByText('Save Lab Result'));
    });
    
    // Wait for validation messages to appear using waitFor
    await waitFor(() => {
      // Check for required field validation messages using queryByText
      // Look for either exact messages or partial matches
      const nameError = screen.queryByText(/name.*required/i) || 
                      screen.queryByText('Test name is required');
      const dateError = screen.queryByText(/date.*required/i) || 
                      screen.queryByText('Test date is required');
      const valueError = screen.queryByText(/value.*required/i) || 
                      screen.queryByText('Result value is required');
      
      // Check that at least some validation errors are shown
      expect(nameError || dateError || valueError).not.toBeNull();
    });
    
    // API should not be called
    expect(labResultService.createLabResult).not.toHaveBeenCalled();
  });

  test('submits the form when all required fields are filled', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Fill out the required fields
    await fillRequiredFields();
    
    // Set up successful response
    (labResultService.createLabResult as jest.Mock).mockResolvedValue({
      id: 1,
      test_name: 'Blood Test',
      test_date: '2025-06-23'
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText('Save Lab Result'));
    });
    
    // Check that the API was called with expected data using waitFor
    await waitFor(() => {
      expect(labResultService.createLabResult).toHaveBeenCalled();
    });
    
    // Extract the arguments from the first call
    const callArgs = (labResultService.createLabResult as jest.Mock).mock.calls[0][0];
    
    // Check important fields individually
    expect(callArgs.test_name).toBe('Blood Test');
    expect(callArgs.test_date).toBe('2025-06-23');
    expect(callArgs.category).toBe('Blood');
  });

  test('handles document upload checkbox toggle', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Initially, document upload section should not show file input
    expect(screen.queryByLabelText(/Upload Document \(PDF, JPG, PNG\)/i)).not.toBeInTheDocument();
    
    // Toggle the checkbox to enable document upload
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Attach Original Document/i));
    });
    
    // Check if file upload input appears
    expect(screen.getByLabelText(/Upload Document \(PDF, JPG, PNG\)/i)).toBeInTheDocument();
    
    // Toggle checkbox again to disable document upload
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Attach Original Document/i));
    });
    
    // Check if file upload input disappears
    expect(screen.queryByLabelText(/Upload Document \(PDF, JPG, PNG\)/i)).not.toBeInTheDocument();
  });

  test('shows loading state during form submission', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Fill out the required fields
    await fillRequiredFields();
    
    // Set up a delayed response
    (labResultService.createLabResult as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => {
        resolve({ id: 1, test_name: 'Blood Test' });
      }, 500));
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText('Save Lab Result'));
    });
    
    // Check for loading indicator immediately after submit
    expect(screen.getByText(/saving|submitting|loading/i)).toBeInTheDocument();
    
    // Wait for loading state to finish using waitFor
    await waitFor(() => {
      expect(screen.queryByText(/saving|submitting|loading/i)).not.toBeInTheDocument();
    }, { timeout: 1000 }); // Increased timeout to account for the delay
  });

  test('displays error message when API call fails', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Fill out the required fields
    await fillRequiredFields();
    
    // Set up a rejected promise for the API call
    const errorMessage = 'Failed to save lab result';
    (labResultService.createLabResult as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText('Save Lab Result'));
    });
    
    // Check that the API was called and error is displayed using waitFor
    await waitFor(() => {
      expect(labResultService.createLabResult).toHaveBeenCalled();
    });
    
    // Wait for error to be displayed
    await waitFor(() => {
      // Look for error message in the document
      const errorElement = screen.queryByText(errorMessage) || 
                           screen.queryByText(/error|failed/i) || 
                           screen.queryByRole('alert');
      
      // If we find an error element or some indication of failure, test passes
      expect(errorElement).not.toBeNull();
    });
  });
});
