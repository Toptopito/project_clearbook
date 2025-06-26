import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

// Mock data for demo purposes
const mockResult = {
  id: 2,
  test_name: 'Lipid Panel',
  category: 'Biochemistry',
  test_date: '2025-06-10',
  lab_name: 'City Medical Center',
  provider_name: 'Dr. Elizabeth Chen',
  is_abnormal: true,
  notes: 'Patient should follow up in 3 months for a repeat test. Dietary modifications recommended.',
  document_url: '/sample-document.pdf',
  results: [
    {
      name: 'Total Cholesterol',
      value: 240,
      unit: 'mg/dL',
      reference_range: '< 200',
      is_abnormal: true,
      trend: 'up'
    },
    {
      name: 'HDL Cholesterol',
      value: 45,
      unit: 'mg/dL',
      reference_range: '> 40',
      is_abnormal: false,
      trend: 'stable'
    },
    {
      name: 'LDL Cholesterol',
      value: 170,
      unit: 'mg/dL',
      reference_range: '< 100',
      is_abnormal: true,
      trend: 'up'
    },
    {
      name: 'Triglycerides',
      value: 180,
      unit: 'mg/dL',
      reference_range: '< 150',
      is_abnormal: true,
      trend: 'up'
    },
    {
      name: 'Total Cholesterol/HDL Ratio',
      value: 5.3,
      unit: '',
      reference_range: '< 5.0',
      is_abnormal: true,
      trend: 'up'
    },
  ],
  historical_data: [
    { date: '2024-12-15', total_cholesterol: 220, hdl: 48, ldl: 150, triglycerides: 160 },
    { date: '2024-06-20', total_cholesterol: 210, hdl: 50, ldl: 140, triglycerides: 150 },
    { date: '2023-12-10', total_cholesterol: 205, hdl: 52, ldl: 135, triglycerides: 140 },
  ]
};

const LabResultDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'results' | 'trends' | 'document'>('results');
  
  // In a real application, we would fetch the result based on the ID
  // const result = fetchResultById(id);
  const result = mockResult; // Using mock data for now

  // Render trend icon based on trend direction
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 11a1 1 0 010-2h6a1 1 0 110 2H7z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <Layout title={result.test_name}>
      {/* Breadcrumb navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li className="flex">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">
                Dashboard
              </Link>
            </div>
          </li>
          <li className="flex">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/lab-results" className="ml-4 text-gray-500 hover:text-gray-700 text-sm">
                Lab Results
              </Link>
            </div>
          </li>
          <li className="flex">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-gray-700 font-medium text-sm">
                {result.test_name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Result header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap justify-between">
          <div className="mb-4 md:mb-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${result.is_abnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {result.is_abnormal ? 'Abnormal Results' : 'Normal Results'}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{result.test_name}</h1>
            <div className="mt-2 text-gray-600">
              <p><span className="font-medium">Category:</span> {result.category}</p>
              <p><span className="font-medium">Date:</span> {result.test_date}</p>
              <p><span className="font-medium">Lab:</span> {result.lab_name}</p>
              <p><span className="font-medium">Provider:</span> {result.provider_name}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Compare
            </Button>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download
            </Button>
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Button>
          </div>
        </div>
        
        {result.notes && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notes
            </h3>
            <p className="mt-1 text-sm text-yellow-700">{result.notes}</p>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${activeTab === 'results' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('results')}
          >
            Test Results
          </button>
          <button
            className={`${activeTab === 'trends' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('trends')}
          >
            Trend History
          </button>
          <button
            className={`${activeTab === 'document' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('document')}
          >
            Original Document
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.results.map((item, index) => (
                  <tr key={index} className={item.is_abnormal ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reference_range}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_abnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {item.is_abnormal ? 'Abnormal' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderTrendIcon(item.trend)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Historical Trends</h3>
              <div>
                <select 
                  className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>Last 3 years</option>
                  <option>All time</option>
                </select>
              </div>
            </div>
            
            {/* This would be a chart in a real implementation */}
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Chart visualization would appear here</p>
                <p className="text-xs text-gray-400">Showing trends for cholesterol levels over time</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-700 mb-3">Historical Data</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cholesterol</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HDL</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LDL</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triglycerides</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.historical_data.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_cholesterol} mg/dL</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hdl} mg/dL</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ldl} mg/dL</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.triglycerides} mg/dL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'document' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Original Document</h3>
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </Button>
            </div>
            
            {/* PDF document preview */}
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">PDF Document Preview</p>
                <p className="text-xs text-gray-400">Click the download button to save a copy</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LabResultDetail;
