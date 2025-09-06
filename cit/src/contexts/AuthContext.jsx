import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    dispatch({ type: 'AUTH_CHECK_START' });
    try {
      const response = await authAPI.getCurrentUser();
      dispatch({ type: 'AUTH_CHECK_SUCCESS', payload: response.data.user });
    } catch (error) {
      // Don't treat 401 as an error - just means user is not logged in
      if (error.response?.status === 401) {
        dispatch({ type: 'AUTH_CHECK_FAILURE' });
      } else {
        console.error('Auth check error:', error);
        dispatch({ type: 'AUTH_CHECK_FAILURE' });
      }
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      return response;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(userData);
      dispatch({ type: 'CLEAR_ERROR' });
      return response;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAuthStatus
  };

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

export default useAuth;
