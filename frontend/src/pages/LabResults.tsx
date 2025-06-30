import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import labResultService, { LabResult } from '../services/labResultService';

const categories = ['All', 'Blood', 'Urine', 'Imaging', 'Other'];
const labs = ['All', 'Central Lab', 'City Medical Center', 'University Hospital', 'Community Clinic'];

const LabResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLab, setSelectedLab] = useState('All');
  const [showAbnormalOnly, setShowAbnormalOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lab results on component mount
  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await labResultService.getAllLabResults();
        setLabResults(data);
      } catch (err: any) {
        console.error('Failed to fetch lab results:', err);
        setError(err.response?.data?.message || 'Failed to load lab results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLabResults();
  }, []);

  // Filter and sort the lab results
  const filteredResults = labResults
    .filter(result => {
      // Apply text search
      if (searchTerm && !result.test_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      if (selectedCategory !== 'All' && result.category !== selectedCategory) {
        return false;
      }
      
      // Apply lab filter
      if (selectedLab !== 'All' && result.lab_name !== selectedLab) {
        return false;
      }
      
      // Apply abnormal only filter
      if (showAbnormalOnly && !result.is_abnormal) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'date') {
        return sortDir === 'asc' 
          ? new Date(a.test_date).getTime() - new Date(b.test_date).getTime()
          : new Date(b.test_date).getTime() - new Date(a.test_date).getTime();
      } else if (sortBy === 'name') {
        return sortDir === 'asc'
          ? a.test_name.localeCompare(b.test_name)
          : b.test_name.localeCompare(a.test_name);
      }
      return 0;
    });

  // Toggle sort direction or change sort column
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    
    return sortDir === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <Layout title="Lab Results">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold font-poppins" style={{ color: 'var(--primary-dark)' }}>Lab Results</h1>
          <p className="text-sm font-inter mt-1" style={{ color: 'var(--text-muted)' }}>Manage and review your lab test records</p>
        </div>
        <div>
          <Button
            variant="primary"
            as={Link}
            to="/lab-results/add"
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Result
          </Button>
        </div>
      </div>
      
      {/* Search and filter section */}
      <Card className="mb-6" variant="outlined" bodyClassName="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search box */}
          <div>
            <Input
              type="text"
              placeholder="Search test name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Lab</label>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
            >
              {labs.map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              id="abnormal-only"
              name="abnormal-only"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={showAbnormalOnly}
              onChange={(e) => setShowAbnormalOnly(e.target.checked)}
            />
            <label htmlFor="abnormal-only" className="ml-2 block text-xs md:text-sm text-gray-700">
              Show abnormal results only
            </label>
          </div>
        </div>
        <div className="flex justify-between items-start mt-4">
          <span className="text-xs md:text-sm text-gray-500">{filteredResults.length} results found</span>
        </div>
      </Card>
      
      {/* Results Table/List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Loading lab results...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load results</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredResults.length > 0 ? (
            <div>
              {/* Table view for desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead style={{ backgroundColor: 'var(--background-light)' }}>
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer font-inter" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('name')}>
                        Test Name {renderSortIcon('name')}
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider font-inter" style={{ color: 'var(--text-muted)' }}>
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer font-inter" style={{ color: 'var(--text-muted)' }} onClick={() => handleSort('date')}>
                        Date {renderSortIcon('date')}
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider font-inter" style={{ color: 'var(--text-muted)' }}>
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider font-inter" style={{ color: 'var(--text-muted)' }}>
                        Lab
                      </th>
                      <th scope="col" className="relative px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map(result => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.test_name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{result.category}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{result.test_date}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.is_abnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {result.is_abnormal ? 'Abnormal' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {result.lab_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            as={Link}
                            to={`/lab-results/${result.id}`}
                            variant="text"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Card view for mobile */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredResults.map(result => (
                  <div key={result.id} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-gray-900">{result.test_name}</div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${result.is_abnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {result.is_abnormal ? 'Abnormal' : 'Normal'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-2">
                      <div>
                        <span className="font-medium">Category:</span> {result.category}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {result.test_date}
                      </div>
                      <div>
                        <span className="font-medium">Lab:</span> {result.lab_name}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        as={Link}
                        to={`/lab-results/${result.id}`}
                        variant="text"
                        className="text-xs text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              <div className="mt-6">
                <Button variant="primary" as={Link} to="/lab-results/add">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Result
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LabResults;
