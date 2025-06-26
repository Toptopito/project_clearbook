import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
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
          <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and review your lab test records</p>
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
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-grow">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search test name"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Category filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="category" className="sr-only">Category</label>
            <select
              id="category"
              name="category"
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Lab filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="lab" className="sr-only">Lab</label>
            <select
              id="lab"
              name="lab"
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
            >
              {labs.map((lab) => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
          
          {/* Show abnormal only */}
          <div className="w-full md:w-auto flex items-center">
            <input
              id="abnormal-only"
              name="abnormal-only"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={showAbnormalOnly}
              onChange={(e) => setShowAbnormalOnly(e.target.checked)}
            />
            <label htmlFor="abnormal-only" className="ml-2 block text-sm text-gray-900">
              Abnormal Only
            </label>
          </div>
        </div>
      </div>
      
      {/* Results table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <Button 
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <span className="flex items-center">Test Name {renderSortIcon('name')}</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <span className="flex items-center">Date {renderSortIcon('date')}</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map(result => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.test_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{result.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{result.test_date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.is_abnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {result.is_abnormal ? 'Abnormal' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.lab_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
