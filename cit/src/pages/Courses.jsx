// cit/src/pages/Courses.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Search, Filter, Grid, List } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getAll();
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 animate-pulse-glow';
      case 'upcoming':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
      case 'completed':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const filteredCourses = useMemo(() => {
    let filtered = courses;
    
    if (activeFilter !== 'All') {
      filtered = filtered.filter(course => 
        course.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [courses, activeFilter, searchTerm]);

  const filters = ['All', 'Upcoming', 'Live', 'Completed'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const CourseCardGrid = ({ course, index }) => (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 hover:border-secondary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-secondary/20 animate-fade-in-up" 
          style={{ animationDelay: `${index * 100}ms` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6 sm:p-8 flex flex-col h-full">
        {/* Status Badge */}
        <div className="absolute -top-2 -right-2 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transform rotate-3 group-hover:rotate-0 transition-transform duration-300 ${getStatusBadgeColor(course.status)}`}>
            {course.status}
          </span>
        </div>

        {/* Course Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 mt-4 text-white group-hover:text-secondary transition-colors duration-300 leading-tight">
          {course.title}
        </h2>

        {/* Start Date */}
        <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-300">
          Starts: {new Date(course.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* Course Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-secondary group-hover:text-white transition-colors duration-300">
              ₹{course.feePerMonth}
            </span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span>{course.duration} months</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative overflow-hidden">
          {course.isEnrolled ? (
            <Button 
              className="w-full relative overflow-hidden bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed" 
              disabled
            >
              <span className="relative z-10">Already Enrolled</span>
            </Button>
          ) : (
            <Link to={`/courses/${course.id}`}>
              <Button className="w-full relative overflow-hidden bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-secondary/25">
                <span className="relative z-10 font-semibold">View Details</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  const CourseCardList = ({ course, index }) => (
    <Card className="group relative overflow-hidden bg-gradient-to-r from-dark-800/60 to-dark-700/40 border border-dark-600/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-xl hover:shadow-secondary/20 animate-fade-in-left"
          style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 gap-4">
        {/* Status Badge */}
        <div className="shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeColor(course.status)}`}>
            {course.status}
          </span>
        </div>

        {/* Course Info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-secondary transition-colors duration-300 mb-1 truncate">
            {course.title}
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            Starts: {new Date(course.startDate).toLocaleDateString()}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="text-secondary font-bold">₹{course.feePerMonth}/month</span>
            <span>{course.duration} months</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          {course.isEnrolled ? (
            <Button size="sm" className="w-full sm:w-auto bg-gray-600" disabled>
              Enrolled
            </Button>
          ) : (
            <Link to={`/courses/${course.id}`}>
              <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-all duration-300">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
            Our Courses
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover our comprehensive range of courses designed to accelerate your learning journey
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-dark-800/40 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-dark-600/50 animate-fade-in-up animate-delay-200">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center">
            
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder-gray-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-dark-700/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-dark-600/50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-dark-600/50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-secondary hover:bg-primary transition-all duration-300 rounded-xl text-white font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className={`mt-4 transition-all duration-300 overflow-hidden ${showFilters || 'max-lg:hidden'}`}>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                      : 'bg-dark-700/50 text-gray-300 hover:bg-dark-600/50 hover:text-white border border-dark-600/50 hover:border-dark-500/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center animate-fade-in-up animate-delay-300">
          <p className="text-gray-400 text-sm sm:text-base">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-secondary hover:text-primary transition-colors duration-300 text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8' 
              : 'space-y-4 sm:space-y-6'
          }`}>
            {filteredCourses.map((course, index) => 
              viewMode === 'grid' ? (
                <CourseCardGrid key={course.id} course={course} index={index} />
              ) : (
                <CourseCardList key={course.id} course={course} index={index} />
              )
            )}
          </div>
        ) : (
          <Card className="p-12 sm:p-16 text-center bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-up animate-delay-300">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">No Courses Found</h3>
              <p className="text-gray-400 leading-relaxed">
                {searchTerm 
                  ? `No courses match your search for "${searchTerm}"`
                  : "No courses available for the selected filter"
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Clear Search
                </button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;