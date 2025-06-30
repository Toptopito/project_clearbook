import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--danger)' }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--success)' }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} viewBox="0 0 20 20" fill="currentColor">
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
              <Link to="/dashboard" className="text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}>
                Dashboard
              </Link>
            </div>
          </li>
          <li className="flex">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5" style={{ color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/lab-results" className="text-sm hover:underline ml-4" style={{ color: 'var(--text-secondary)' }}>
                Lab Results
              </Link>
            </div>
          </li>
          <li className="flex">
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5" style={{ color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium font-inter ml-4" style={{ color: 'var(--text)' }} aria-current="page">
                {result.test_name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Metadata card */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium font-inter" style={{ color: 'var(--text-secondary)' }}>Test Date</h4>
            <p style={{ color: 'var(--text)' }} className="font-inter">{result.test_date}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium font-inter" style={{ color: 'var(--text-secondary)' }}>Category</h4>
            <p style={{ color: 'var(--text)' }} className="font-inter">{result.category}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium font-inter" style={{ color: 'var(--text-secondary)' }}>Lab Name</h4>
            <p style={{ color: 'var(--text)' }} className="font-inter">{result.lab_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium font-inter" style={{ color: 'var(--text-secondary)' }}>Provider</h4>
            <p style={{ color: 'var(--text)' }} className="font-inter">{result.provider_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium font-inter" style={{ color: 'var(--text-secondary)' }}>Status</h4>
            <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`} 
               style={{ 
                 backgroundColor: result.is_abnormal ? 'var(--danger-light)' : 'var(--success-light)', 
                 color: result.is_abnormal ? 'var(--danger)' : 'var(--success)' 
               }}>
              {result.is_abnormal ? 'Abnormal' : 'Normal'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium font-inter" style={{ color: 'var(--text-secondary)' }}>Notes</h4>
            <p style={{ color: 'var(--text)' }} className="font-inter">{result.notes}</p>
          </div>
        </div>
      </Card>

      {/* Tabs navigation */}
      <Card className="mb-6">
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('results')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm font-inter`}
              style={{ 
                borderColor: activeTab === 'results' ? 'var(--primary)' : 'transparent', 
                color: activeTab === 'results' ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              Test Results
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm font-inter`}
              style={{ 
                borderColor: activeTab === 'trends' ? 'var(--primary)' : 'transparent', 
                color: activeTab === 'trends' ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              Trends & History
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm font-inter`}
              style={{ 
                borderColor: activeTab === 'document' ? 'var(--primary)' : 'transparent', 
                color: activeTab === 'document' ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              Original Document
            </button>
          </nav>
        </div>
      </Card>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'results' && (
          <Card className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.results.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.value} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reference_range}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`} 
                            style={{ 
                              backgroundColor: item.is_abnormal ? 'var(--danger-light)' : 'var(--success-light)', 
                              color: item.is_abnormal ? 'var(--danger)' : 'var(--success)' 
                            }}>
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
          </Card>
        )}
        
        {activeTab === 'trends' && (
          <Card className="p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-medium" style={{ color: 'var(--text)' }}>Historical Trends</h3>
              <div>
                <Button variant="outline" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Export
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2" style={{ color: 'var(--text)' }}>Total Cholesterol Trend</h4>
              <div className="h-64 bg-gray-50 rounded-lg border flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Chart visualization would appear here</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Showing trends for cholesterol levels over time</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-medium mb-3" style={{ color: 'var(--text)' }}>Historical Data</h4>
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
          </Card>
        )}
        
        {activeTab === 'document' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium" style={{ color: 'var(--text)' }}>Original Document</h3>
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </Button>
            </div>
            
            {/* PDF document preview */}
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>PDF Document Preview</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Click the download button to save a copy</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default LabResultDetail;
