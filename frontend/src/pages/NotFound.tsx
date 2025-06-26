import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Page Not Found</h2>
      <p className="mb-4">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
    </div>
  );
};

export default NotFound;
