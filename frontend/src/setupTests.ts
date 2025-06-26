// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock for window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Fix for chalk RangeError issue
process.env.CI = 'true';
process.env.TERM = 'dumb';

// Enable React Router future flags to avoid warnings
// We do this by adding a property to window.__reactRouterConfig
Object.defineProperty(window, '__reactRouterConfig', {
  value: {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  },
  configurable: true,
  writable: true
});

// Silence console warnings for tests
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out React Router warnings about future flags
  if (args[0] && typeof args[0] === 'string' && 
     (args[0].includes('future flag') || 
      args[0].includes('React.startTransition') || 
      args[0].includes('v7_relativeSplatPath'))) {
    return;
  }
  originalWarn(...args);
};
