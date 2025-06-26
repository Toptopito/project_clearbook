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
