import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Check if the current route matches the link
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: 'var(--primary)' }} className="text-white shadow-md">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="flex flex-col items-start">
              <div className="flex items-center">
                <svg width="32" height="32" viewBox="0 0 80 80" className="mr-2">
                  <path d="M50,20 C30,20 25,40 25,50 C25,70 50,85 50,85 C50,85 75,70 75,50 C75,40 70,20 50,20 Z" fill="#2563EB" />
                  <path d="M25,50 L35,50 L40,30 L45,70 L50,40 L55,60 L60,50 L75,50" fill="none" stroke="#10B981" strokeWidth="3" />
                </svg>
                <span className="text-lg md:text-xl font-bold font-poppins">ClearBook</span>
              </div>
              <span className="text-xs text-gray-200 font-light hidden md:block">The heartbeat of health and technology.</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 font-inter">
            <Link 
              to="/dashboard" 
              className={`py-2 px-3 rounded-md font-medium transition-colors ${isActive('/dashboard') ? '' : 'hover:bg-opacity-75'}`}
              style={isActive('/dashboard') ? { backgroundColor: 'var(--primary-dark)' } : { backgroundColor: 'var(--primary)' }}
            >
              Dashboard
            </Link>
            <Link 
              to="/lab-results" 
              className={`py-2 px-3 rounded-md font-medium transition-colors ${isActive('/lab-results') ? '' : 'hover:bg-opacity-75'}`}
              style={isActive('/lab-results') ? { backgroundColor: 'var(--primary-dark)' } : { backgroundColor: 'var(--primary)' }}
            >
              Lab Results
            </Link>
            <Link 
              to="/profile" 
              className={`py-2 px-3 rounded-md font-medium transition-colors ${isActive('/profile') ? '' : 'hover:bg-opacity-75'}`}
              style={isActive('/profile') ? { backgroundColor: 'var(--primary-dark)' } : { backgroundColor: 'var(--primary)' }}
            >
              Profile
            </Link>
          </div>
          
          {/* Navigation Actions */}
          <div className="flex items-center space-x-3">
            {/* Logout button for desktop */}
            <Link to="/login" className="hidden md:flex items-center py-2 px-3 rounded-md font-medium bg-red-600 hover:bg-red-700 transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
            
            <button style={{ backgroundColor: 'var(--primary-light)' }} className="rounded-full p-1.5 transition-colors hover:opacity-80" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-white active:bg-blue-700 transition-colors"
              aria-expanded={mobileMenuOpen ? 'true' : 'false'}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - with transition */}
        <div 
          style={{ backgroundColor: 'var(--primary-dark)' }}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}
        >
          <div className="px-2 py-3 space-y-1 border-t border-blue-800">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium ${isActive('/dashboard') ? 'bg-primary-dark' : ''}`}
              style={isActive('/dashboard') ? { backgroundColor: 'var(--primary-dark)' } : {}} 
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link 
              to="/lab-results" 
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium ${isActive('/lab-results') ? 'bg-primary-dark' : ''}`}
              style={isActive('/lab-results') ? { backgroundColor: 'var(--primary-dark)' } : {}} 
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Lab Results
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium ${isActive('/profile') ? 'bg-primary-dark' : ''}`}
              style={isActive('/profile') ? { backgroundColor: 'var(--primary-dark)' } : {}} 
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            
            {/* Logout for mobile */}
            <Link 
              to="/login" 
              className="flex items-center px-4 py-3 rounded-md text-base font-medium text-white bg-red-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8" style={{ backgroundColor: 'var(--background)' }}>
        {title && (
          <h1 className="text-3xl font-bold font-poppins mb-6" style={{ color: 'var(--primary-dark)' }}>{title}</h1>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t mt-auto" style={{ backgroundColor: 'var(--primary-dark)', color: 'white' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg width="28" height="28" viewBox="0 0 80 80" className="text-white mr-2">
                <path d="M50,20 C30,20 25,40 25,50 C25,70 50,85 50,85 C50,85 75,70 75,50 C75,40 70,20 50,20 Z" fill="#FFFFFF" />
                <path d="M25,50 L35,50 L40,30 L45,70 L50,40 L55,60 L60,50 L75,50" fill="none" stroke="#10B981" strokeWidth="3" />
              </svg>
              <span className="text-lg font-bold ml-2 font-poppins text-white">ClearBook</span>
              <p className="text-gray-300 ml-2">The heartbeat of health and technology.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400">
            <p>&copy; 2025 Clearbook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
