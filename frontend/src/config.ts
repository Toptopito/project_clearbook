// API configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Other global configuration constants can be added here
export const APP_NAME = 'Clearbook';
export const APP_VERSION = '1.0.0';

// Pagination settings
export const DEFAULT_PAGE_SIZE = 10;

// File upload settings
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png'];
