import React, { useEffect, useState } from 'react';

interface HelloResponse {
  message: string;
  project: string;
  version: string;
}

const HelloWorld: React.FC = () => {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/hello');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(`Error fetching data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="hello-world-container">
      <h2>API Connection Test</h2>
      {loading && <p>Loading data from API...</p>}
      {error && <p className="error">Error: {error}</p>}
      {data && (
        <div className="api-response">
          <p className="message">{data.message}</p>
          <p className="project">Project: {data.project}</p>
          <p className="version">Version: {data.version}</p>
        </div>
      )}
    </div>
  );
};

export default HelloWorld;
