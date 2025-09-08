import React, { createContext, useContext, useCallback, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Create the context
const ToastContext = createContext();

/**
 * Provides a centralized way to display toast notifications.
 * This acts as a wrapper around the `react-hot-toast` library.
 */
export const ToastProvider = ({ children }) => {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);
  
  const showLoading = useCallback((message) => {
    return toast.loading(message);
  }, []);
  
  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  const value = useMemo(() => ({
    showSuccess,
    showError,
    showLoading,
    dismissToast,
  }), [showSuccess, showError, showLoading, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            margin: '10px',
            background: '#334155', // dark-700
            color: '#FDF0D5', // ternary3
            border: '1px solid #475569', // dark-600
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#669BBC', // secondary
              secondary: '#0F172A', // dark-900
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#C1121F', // ternary1
              secondary: '#FDF0D5', // ternary3
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to easily access toast notification functions.
 * @returns {Object} An object with functions to show different types of toasts.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
