import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { coursesAPI } from '../services/courses';

// Create the context
const CourseContext = createContext();

/**
 * Provides course-related data and functions to its children components.
 * Manages fetching, loading, and error states for all courses.
 */
export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coursesAPI.getAll();
      setCourses(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch courses.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch courses on initial render
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const value = useMemo(() => ({
    courses,
    loading,
    error,
    refetchCourses: fetchCourses,
  }), [courses, loading, error, fetchCourses]);

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

/**
 * Custom hook to easily access the CourseContext.
 * @returns {Object} The course context value.
 */
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
