// Enhanced API Call Hook with Better Loading and Error Handling
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useApiCall = (options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    loadingMessage = 'Loading...',
    retryAttempts = 1,
    onSuccess,
    onError
  } = options;

  const execute = useCallback(async (apiCall, customOptions = {}) => {
    const {
      showLoading = true,
      customLoadingMessage,
      customSuccessMessage,
      customErrorMessage
    } = customOptions;

    setLoading(showLoading);
    setError(null);

    // Show loading toast for long operations
    let loadingToastId;
    if (showLoading && (customLoadingMessage || loadingMessage)) {
      loadingToastId = toast.loading(customLoadingMessage || loadingMessage);
    }

    let attempts = 0;
    const maxAttempts = retryAttempts;

    while (attempts < maxAttempts) {
      try {
        const result = await apiCall();
        setData(result.data || result);
        setLoading(false);

        // Dismiss loading toast
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        // Show success toast
        if (showSuccessToast) {
          toast.success(customSuccessMessage || successMessage);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(result.data || result);
        }

        return result;
      } catch (err) {
        attempts++;
        console.error(`API call attempt ${attempts} failed:`, err);

        // If this was the last attempt or it's not a retryable error
        if (attempts >= maxAttempts || !isRetryableError(err)) {
          setError(err);
          setLoading(false);

          // Dismiss loading toast
          if (loadingToastId) {
            toast.dismiss(loadingToastId);
          }

          // Show error toast
          if (showErrorToast) {
            const errorMessage = customErrorMessage || 
                               err.message || 
                               err.response?.data?.error || 
                               'An error occurred';
            
            if (err.isTimeout) {
              toast.error('Request timed out. Please try again.', {
                duration: 5000,
                icon: '⏰'
              });
            } else if (err.isNetworkError) {
              toast.error('Network error. Please check your connection.', {
                duration: 5000,
                icon: '🌐'
              });
            } else if (err.isServerError) {
              toast.error('Server error. Please try again later.', {
                duration: 5000,
                icon: '🔧'
              });
            } else {
              toast.error(errorMessage, {
                duration: 4000
              });
            }
          }

          // Call error callback
          if (onError) {
            onError(err);
          }

          throw err;
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
  }, [
    showSuccessToast,
    showErrorToast,
    successMessage,
    loadingMessage,
    retryAttempts,
    onSuccess,
    onError
  ]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};

// Helper function to determine if an error is retryable
const isRetryableError = (error) => {
  // Retry on timeout, network errors, and 5xx server errors
  return (
    error.isTimeout ||
    error.isNetworkError ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    (error.response?.status >= 500 && error.response?.status < 600)
  );
};

export default useApiCall;