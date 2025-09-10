import axios from "axios";
import { API_CONFIG } from "../config/api.js";

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send session cookies
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: API_CONFIG.HEADERS,
});

// Get environment-specific configuration
const envConfig = API_CONFIG.getEnvironmentConfig();

// Log the API URL in development for debugging
// if (envConfig.enableLogging) {
//   // console.log("API Base URL:", import.meta.env.VITE_API_URL || "http://localhost:5000/api (fallback)");
// }

// Enhanced request interceptor with dynamic timeout and retry logic
api.interceptors.request.use(
  (config) => {
    // Set dynamic timeout based on operation type
    const operationTimeout = API_CONFIG.getTimeoutForOperation(
      config.url || ""
    );
    config.timeout = operationTimeout;

    // Add request metadata for debugging and retry logic
    config.metadata = {
      startTime: new Date(),
      retryCount: 0,
      originalTimeout: operationTimeout,
    };



    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic and better error handling
api.interceptors.response.use(
  (response) => {

    return response;
  },
  async (error) => {
    const originalRequest = error.config;



    // Handle timeout errors with retry logic
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      // Don't retry if we've already retried
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Increase timeout for retry
        originalRequest.timeout = Math.min(
          originalRequest.timeout * 1.5,
          180000
        ); // Max 3 minutes



        try {
          return await api(originalRequest);
        } catch (retryError) {

          // Return a more user-friendly error
          return Promise.reject({
            ...retryError,
            message:
              "Request timed out. Please check your connection and try again.",
            isTimeout: true,
          });
        }
      }
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK" || !error.response) {
      return Promise.reject({
        ...error,
        message: "Network error. Please check your internet connection.",
        isNetworkError: true,
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Don't redirect if already on login page or checking auth
      if (
        !window.location.pathname.includes("/login") &&
        !error.config?.url?.includes("/auth/me")
      ) {
        console.warn("🔐 Unauthorized access, redirecting to login...");
        window.location.href = "/login";
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      return Promise.reject({
        ...error,
        message: "Server error. Please try again in a moment.",
        isServerError: true,
      });
    }

    // Handle 503 Service Unavailable
    if (error.response?.status === 503) {
      return Promise.reject({
        ...error,
        message: "Service temporarily unavailable. Please try again later.",
        isServiceUnavailable: true,
      });
    }

    return Promise.reject(error);
  }
);

// Helper function to create requests with custom timeout
api.withTimeout = (timeout) => {
  return axios.create({
    ...api.defaults,
    timeout,
  });
};

// Helper function for long-running operations
api.longRequest = (config) => {
  return api({
    ...config,
    timeout: API_CONFIG.TIMEOUTS.DATABASE_HEAVY,
  });
};

// Helper function for authentication operations
api.authRequest = (config) => {
  return api({
    ...config,
    timeout: API_CONFIG.TIMEOUTS.AUTH_LOGIN,
  });
};

// Helper function for file upload operations
api.uploadRequest = (config) => {
  return api({
    ...config,
    timeout: API_CONFIG.TIMEOUTS.FILE_UPLOAD,
  });
};

// Helper function for quick operations
api.quickRequest = (config) => {
  return api({
    ...config,
    timeout: API_CONFIG.TIMEOUTS.QUICK,
  });
};

export default api;
