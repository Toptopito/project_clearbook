import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  // Mock data for UI demonstration
  const recentLabResults = [
    { id: 1, name: 'Complete Blood Count', date: '2025-06-15', isAbnormal: false },
    { id: 2, name: 'Lipid Panel', date: '2025-06-10', isAbnormal: true },
    { id: 3, name: 'Metabolic Panel', date: '2025-05-22', isAbnormal: false },
  ];

  const healthMetrics = {
    totalResults: 12,
    abnormalResults: 3,
    lastUpload: '2025-06-15',
    documentCount: 8
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Main Content Area - Dashboard uses Layout component for navigation */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h1 className="text-xl md:text-2xl font-bold font-poppins" style={{ color: 'var(--primary-dark)' }}>Health Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="primary" as={Link} to="/lab-results/new" className="w-full sm:w-auto text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Result
            </Button>
          </div>
        </div>

        {/* Health Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card p-4 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-base font-medium text-gray-700 font-inter">Total Results</h2>
                <p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--primary-dark)' }}>{healthMetrics.totalResults}</p>
              </div>
              <div className="rounded-full p-1.5" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="metric-card p-4 border-l-4" style={{ borderLeftColor: 'var(--accent-yellow)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-base font-medium text-gray-700">Abnormal Results</h2>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{healthMetrics.abnormalResults}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: 'var(--accent-yellow)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="metric-card p-4 border-l-4" style={{ borderLeftColor: 'var(--accent-green)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-base font-medium text-gray-700">Last Upload</h2>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{healthMetrics.lastUpload}</p>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" style={{ color: 'var(--accent-green)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="metric-card p-4 border-l-4" style={{ borderLeftColor: 'var(--primary-light)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-base font-medium text-gray-700">Documents</h2>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{healthMetrics.documentCount}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Lab Results */}
        <Card 
          className="mb-8"
          title={
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold font-poppins">Recent Lab Results</h2>
              <span className="text-xs md:text-sm text-gray-500">{recentLabResults.length} results</span>
            </div>
          }
          bodyClassName="p-0"
          footerContent={
            <Button as={Link} to="/lab-results" variant="text" className="text-sm">
              View All Lab Results
            </Button>
          }
        >
          <div className="divide-y divide-gray-200">
            {recentLabResults.map(result => (
              <div key={result.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-start sm:items-center">
                  <div className="flex-shrink-0">
                    {result.isAbnormal ? (
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--error)' }}></span>
                    ) : (
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium font-inter" style={{ color: 'var(--text)' }}>{result.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500">Date: {result.date}</p>
                  </div>
                </div>
                <Button
                  as={Link}
                  to={`/lab-results/${result.id}`}
                  variant="secondary"
                  className="text-xs md:text-sm w-full sm:w-auto"
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Health Trends Section */}
        <Card
          title="Health Trends"
        >
            <div className="flex justify-center items-center h-48 md:h-64 bg-gray-50 rounded-lg">
              <div className="text-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="mt-3 text-sm md:text-base text-gray-600">Trend graphs will appear here as you add more lab results</p>
                <Button variant="primary" className="mt-3 text-xs md:text-sm">
                  Learn More
                </Button>
              </div>
            </div>
        </Card>
      </main>

      {/* No Footer Needed - provided by Layout component */}
    </div>
  );
};

export default Dashboard;
