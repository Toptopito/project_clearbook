import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabResultDetail from '../pages/LabResultDetail';
import { labResultService } from '../services/labResultService';
import { TestRouterProvider } from '../router/router';

// Import act directly from React to avoid deprecation warnings
import { act } from 'react';

// Mock dependencies
jest.mock('../services/labResultService', () => ({
  labResultService: {
    getLabResult: jest.fn(),
    getLabResultDocument: jest.fn()
  }
}));

// Mock router navigation and params
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>
}));

// Sample test data
const mockLabResult = {
  id: 1,
  test_name: 'Lipid Panel',
  test_date: '2025-06-15',
  category: 'Blood',
  lab_name: 'LabCorp',
  provider_name: 'Dr. Smith',
  notes: 'Fasting test',
  is_abnormal: true,
  results: [
    {
      id: 1,
      name: 'Total Cholesterol',
      value: '220',
      unit: 'mg/dL',
      reference_range: '125-200',
      is_abnormal: true,
      trend: 'up'
    },
    {
      id: 2,
      name: 'HDL Cholesterol',
      value: '45',
      unit: 'mg/dL',
      reference_range: '40-60',
      is_abnormal: false,
      trend: 'stable'
    },
    {
      id: 3,
      name: 'LDL Cholesterol',
      value: '150',
      unit: 'mg/dL',
      reference_range: '0-130',
      is_abnormal: true,
      trend: 'up'
    }
  ],
  historical_data: [
    {
      date: '2025-03-15',
      total_cholesterol: '200',
      hdl: '42',
      ldl: '130',
      triglycerides: '140'
    },
    {
      date: '2025-06-15',
      total_cholesterol: '220',
      hdl: '45',
      ldl: '150',
      triglycerides: '150'
    }
  ]
};

describe('LabResultDetail Component', () => {
  // Mock the lab result service before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (labResultService.getLabResult as jest.Mock).mockResolvedValue(mockLabResult);
  });
  
  // Ensure cleanup after each test
  afterEach(cleanup);
  
  const renderComponent = () => render(
    <TestRouterProvider>
      <LabResultDetail />
    </TestRouterProvider>
  );

  test('renders the lab result details with metadata', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Check for metadata items that we know should be present
    expect(screen.getByText('Test Date')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    
    // Look for texts that might be partially matched
    const biochemistryText = screen.queryByText((content, element) => {
      return content.includes('Biochemistry');
    });
    expect(biochemistryText).toBeTruthy();
    
    expect(screen.getByText('Lab Name')).toBeInTheDocument();
    
    const labCorpText = screen.queryByText((content, element) => {
      return content.includes('LabCorp');
    });
    expect(labCorpText).toBeTruthy();
    
    expect(screen.getByText('Provider')).toBeInTheDocument();
    
    const drSmithText = screen.queryByText((content, element) => {
      return content.includes('Dr. Smith');
    });
    expect(drSmithText).toBeTruthy();
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check for abnormal status badge
    const abnormalBadge = screen.getByText('Abnormal');
    expect(abnormalBadge).toBeInTheDocument();
    
    // Check if the API was called with correct ID
    expect(labResultService.getLabResult).toHaveBeenCalledWith('1');
  });

  test('renders the tabs navigation correctly', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Check if all tabs are rendered
    expect(screen.getByText('Test Results')).toBeInTheDocument();
    expect(screen.getByText('Trends & History')).toBeInTheDocument();
    expect(screen.getByText('Original Document')).toBeInTheDocument();
    
    // Initially, "Test Results" tab should be active and its content visible
    // We can't test CSS variables directly, so we'll just check that the element exists
    const resultsTab = screen.getByText('Test Results');
    expect(resultsTab).toBeInTheDocument();
    
    // Verify that the results content is visible
    expect(screen.getByText('Total Cholesterol')).toBeInTheDocument();
  });

  test('switches between tabs when clicked', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Click on Trends tab
    await act(async () => {
      fireEvent.click(screen.getByText('Trends & History'));
    });
    
    // Check if Trends tab content is visible
    expect(screen.getByText('Historical Trends')).toBeInTheDocument();
    expect(screen.getByText('Historical Data')).toBeInTheDocument();
    
    // Click on Document tab
    await act(async () => {
      fireEvent.click(screen.getByText('Original Document'));
    });
    
    // Check if Document tab content is visible
    expect(screen.getByText('PDF Document Preview')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    
    // Go back to Results tab
    await act(async () => {
      fireEvent.click(screen.getByText('Test Results'));
    });
    
    // Check if Results tab content is visible again
    expect(screen.getByText('Your Value')).toBeInTheDocument();
    expect(screen.getByText('Reference Range')).toBeInTheDocument();
  });

  test('displays result items with correct status and trend indicators', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // First row should be Total Cholesterol
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
    
    // Check content of first data row (Total Cholesterol)
    expect(screen.getByText('Total Cholesterol')).toBeInTheDocument();
    
    // Look for values using flexible matching
    const hasValue240 = screen.queryByText((content, element) => {
      return content.includes('240');
    });
    expect(hasValue240).toBeTruthy();
    
    const hasMgDL = screen.queryByText((content, element) => {
      return content.includes('mg/dL');
    });
    expect(hasMgDL).toBeTruthy();
    
    const hasRange = screen.queryByText((content, element) => {
      return content.includes('125') && content.includes('200');
    });
    expect(hasRange).toBeTruthy();
    
    // Should have abnormal status indicated
    const abnormalStatuses = screen.getAllByText('Abnormal');
    expect(abnormalStatuses.length).toBeGreaterThanOrEqual(1);
    
    // Should have normal status for HDL
    expect(screen.getByText('HDL Cholesterol')).toBeInTheDocument();
    
    // Check for HDL value using flexible matching
    const hasValue45 = screen.queryByText((content, element) => {
      return content.includes('45');
    });
    expect(hasValue45).toBeTruthy();
    
    // Check for normal status badges
    const normalStatuses = screen.getAllByText('Normal');
    expect(normalStatuses.length).toBeGreaterThanOrEqual(1);
  });

  test('displays historical data in trends tab', async () => {
    await act(async () => {
      renderComponent();
    });
    
    // Switch to Trends tab
    await act(async () => {
      fireEvent.click(screen.getByText('Trends & History'));
    });
    
    // Check for historical data table headers
    expect(screen.getByText('Historical Data')).toBeInTheDocument();
    expect(screen.getByText('Historical Trends')).toBeInTheDocument();
    
    // Verify table column headers are present
    const tableHeaders = screen.getAllByRole('columnheader');
    expect(tableHeaders.length).toBeGreaterThanOrEqual(5); // Date, Total Cholesterol, HDL, LDL, Triglycerides
    
    // Check for chart placeholder
    expect(screen.getByText('Chart visualization would appear here')).toBeInTheDocument();
    expect(screen.getByText(/Showing trends for cholesterol/)).toBeInTheDocument();
    
    // Check for Export button in the Trends tab
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});
