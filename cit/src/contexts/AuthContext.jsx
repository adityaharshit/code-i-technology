// cit/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_CHECK_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_CHECK_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'AUTH_CHECK_FAILURE':
      return { ...state, loading: false, user: null, isAuthenticated: false, error: null };

    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };

    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'REGISTER_SUCCESS':
      // On successful registration, stop loading but don't log the user in.
      return { ...state, loading: false, error: null };
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload };

    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true, // true until we check session
    error: null
  });

  const checkAuthStatus = useCallback(async () => {
    dispatch({ type: 'AUTH_CHECK_START' });
    try {
      // Use longer timeout for auth check
      const response = await authAPI.getCurrentUser();
      dispatch({ type: 'AUTH_CHECK_SUCCESS', payload: response.data.user });
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch({ type: 'AUTH_CHECK_FAILURE' });
      } else if (error.isTimeout || error.isNetworkError) {
        console.warn('Auth check timeout/network error, will retry on next request');
        dispatch({ type: 'AUTH_CHECK_FAILURE' });
      } else {
        console.error('Auth check error:', error);
        dispatch({ type: 'AUTH_CHECK_FAILURE' });
      }
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      return response;
    } catch (error) {
      let message = 'Login failed';
      
      if (error.isTimeout) {
        message = 'Login request timed out. Please try again.';
      } else if (error.isNetworkError) {
        message = 'Network error. Please check your connection and try again.';
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
      return response;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (state.isAuthenticated) {
      await checkAuthStatus();
    }
  }, [checkAuthStatus, state.isAuthenticated]);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    checkAuthStatus,
    refreshUser
  }), [state, login, register, logout, checkAuthStatus, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
