// API Configuration and Timeout Settings
export const API_CONFIG = {
  // Timeout configurations (in milliseconds)
  TIMEOUTS: {
    // Standard operations
    DEFAULT: 30000,        // 30 seconds
    QUICK: 15000,          // 15 seconds for simple operations
    
    // Authentication operations
    AUTH_LOGIN: 45000,     // 45 seconds for login
    AUTH_REGISTER: 60000,  // 1 minute for registration
    AUTH_CHECK: 30000,     // 30 seconds for auth check
    
    // Database operations
    DATABASE_READ: 45000,  // 45 seconds for reading data
    DATABASE_WRITE: 60000, // 1 minute for writing data
    DATABASE_HEAVY: 90000, // 1.5 minutes for heavy operations
    
    // File operations
    FILE_UPLOAD: 120000,   // 2 minutes for file uploads
    FILE_DOWNLOAD: 90000,  // 1.5 minutes for downloads
    
    // Admin operations
    ADMIN_OPERATIONS: 120000, // 2 minutes for admin operations
    REPORTS: 180000,       // 3 minutes for report generation
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_BASE: 1000,      // Base delay between retries (1 second)
    DELAY_MULTIPLIER: 1.5, // Exponential backoff multiplier
    MAX_DELAY: 10000,      // Maximum delay between retries (10 seconds)
  },

  // Error messages
  ERROR_MESSAGES: {
    TIMEOUT: 'Request timed out. Please check your connection and try again.',
    NETWORK: 'Network error. Please check your internet connection.',
    SERVER: 'Server error. Please try again in a moment.',
    UNAUTHORIZED: 'Session expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    GENERIC: 'An unexpected error occurred. Please try again.',
  },

  // Request headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  // Environment-specific settings
  getEnvironmentConfig: () => {
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;

    return {
      enableLogging: isDev,
      enableRetry: true,
      enableProgressTracking: isDev,
      maxConcurrentRequests: isProd ? 10 : 5,
      requestDelay: isDev ? 0 : 100, // Add small delay in production to prevent overwhelming server
    };
  },

  // Operation-specific timeout mappings
  getTimeoutForOperation: (operation) => {
    const timeouts = API_CONFIG.TIMEOUTS;
    
    const operationMap = {
      // Auth operations
      'auth/login': timeouts.AUTH_LOGIN,
      'auth/register': timeouts.AUTH_REGISTER,
      'auth/me': timeouts.AUTH_CHECK,
      
      // Course operations
      'courses/my-courses': timeouts.DATABASE_READ,
      'courses/enroll': timeouts.DATABASE_WRITE,
      'courses/create': timeouts.DATABASE_WRITE,
      'courses/update': timeouts.DATABASE_WRITE,
      'courses/delete': timeouts.DATABASE_WRITE,
      
      // Admin operations
      'admin/': timeouts.ADMIN_OPERATIONS,
      'admin/stats': timeouts.DATABASE_HEAVY,
      'admin/reports': timeouts.REPORTS,
      
      // File operations
      'upload': timeouts.FILE_UPLOAD,
      'download': timeouts.FILE_DOWNLOAD,
      
      // User operations
      'users/profile': timeouts.DATABASE_READ,
      'users/update': timeouts.DATABASE_WRITE,
      
      // Payment operations
      'payments/': timeouts.DATABASE_WRITE,
      'transactions/': timeouts.DATABASE_READ,
    };

    // Find matching operation
    for (const [pattern, timeout] of Object.entries(operationMap)) {
      if (operation.includes(pattern)) {
        return timeout;
      }
    }

    return timeouts.DEFAULT;
  }
};

export default API_CONFIG;