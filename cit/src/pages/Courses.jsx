// Enhanced Futuristic Courses Page
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Search, Filter, Grid, List, Clock, Users, Star, Zap, Code, BookOpen, Trophy, ChevronRight } from 'lucide-react';

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
        return 'bg-gradient-to-r from-matrix-500 to-matrix-600 text-white shadow-glow-green animate-neural-pulse';
      case 'upcoming':
        return 'bg-gradient-to-r from-electric-500 to-electric-600 text-white shadow-glow ';
      case 'completed':
        return 'bg-gradient-to-r from-quantum-500 to-quantum-600 text-white shadow-quantum';
      default:
        return 'bg-gradient-to-r from-cyber-500 to-cyber-600 text-white shadow-glow-purple';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <Zap className="w-3 h-3 mr-1" />;
      case 'upcoming':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'completed':
        return <Trophy className="w-3 h-3 mr-1" />;
      default:
        return <BookOpen className="w-3 h-3 mr-1" />;
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
    <Card 
       
      interactive 
      
      className="group relative overflow-hidden transition-all duration-500 hover:scale-102 animate-fade-in-up" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Floating particles */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-electric-400 rounded-full animate-particle-float" />
      <div className="absolute bottom-6 left-6 w-2 h-2 bg-cyber-400 rounded-full animate-float" />
      
      <div className="relative p-6 sm:p-8 flex flex-col h-full">
        {/* Enhanced Status Badge */}
        <div className="absolute -top-2 -right-2 z-10">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transform rotate-3 group-hover:rotate-0 transition-all duration-300 ${getStatusBadgeColor(course.status)}`}>
            {getStatusIcon(course.status)}
            {course.status}
          </div>
        </div>

        {/* Course Title with Gradient */}
        <h2 className="text-xl sm:text-2xl font-display font-bold mb-3 mt-6 bg-gradient-to-r from-white to-electric-200 bg-clip-text text-transparent group-hover:from-electric-400 group-hover:to-cyber-400 transition-all duration-300 leading-tight">
          {course.title}
        </h2>

        {/* Enhanced Start Date */}
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-4 h-4 text-electric-400" />
          <p className="text-gray-300 text-sm group-hover:text-electric-300 transition-colors duration-300">
            Starts: {new Date(course.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        

        {/* Enhanced Course Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
              ₹{course.feePerMonth}
            </span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-matrix-400">
              <Clock className="w-4 h-4" />
              <span>{course.duration} months</span>
            </div>
            {/* <div className="flex items-center space-x-1 text-neural-400">
              <Users className="w-4 h-4" />
              <span>50+ enrolled</span>
            </div> */}
          </div>
        </div>

        

        {/* Enhanced Action Button */}
        <div className="relative overflow-hidden">
          {course.isEnrolled ? (
            <Button 
              variant="success"
              className="w-full cursor-not-allowed" 
              disabled
            >
              <Trophy className="w-4 h-4 mr-2" />
              Already Enrolled
            </Button>
          ) : (
            <Link to={`/courses/${course.id}`}>
              <Button 
                variant="primary" 
                className="w-full group"
              >
                <span className="flex items-center justify-center">
                  <BookOpen className="w-4 h-4 mr-2 group-hover:" />
                  View Details
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  const CourseCardList = ({ course, index }) => (
    <Card 
      variant="cyber" 
      interactive
      className="group relative overflow-hidden transition-all duration-500 animate-fade-in-left"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 gap-4">
        {/* Enhanced Status Badge */}
        <div className="shrink-0">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${getStatusBadgeColor(course.status)}`}>
            {getStatusIcon(course.status)}
            {course.status}
          </div>
        </div>

        {/* Enhanced Course Info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg sm:text-xl font-display font-bold bg-gradient-to-r from-white to-electric-200 bg-clip-text text-transparent group-hover:from-electric-400 group-hover:to-cyber-400 transition-all duration-300 mb-2 truncate">
            {course.title}
          </h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-electric-400" />
            <p className="text-gray-300 text-sm">
              Starts: {new Date(course.startDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-electric-400 font-bold">₹{course.feePerMonth}</span>
              <span className="text-gray-400">/month</span>
            </div>
            <div className="flex items-center space-x-1 text-matrix-400">
              <Clock className="w-3 h-3" />
              <span>{course.duration} months</span>
            </div>
            {/* <div className="flex items-center space-x-1 text-neural-400">
              <Users className="w-3 h-3" />
              <span>50+ enrolled</span>
            </div> */}
          </div>
          
          
        </div>

        {/* Enhanced Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          {course.isEnrolled ? (
            <Button size="sm" variant="success" className="w-full sm:w-auto" disabled>
              <Trophy className="w-3 h-3 mr-1" />
              Enrolled
            </Button>
          ) : (
            <Link to={`/courses/${course.id}`}>
              <Button size="sm" variant="primary" glow className="w-full sm:w-auto group">
                <BookOpen className="w-3 h-3 mr-1" />
                View Details
                <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
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
        
        {/* Enhanced Header Section */}
        <div className="text-center space-y-6 animate-fade-in-down relative">
          {/* Floating tech icons */}
          <div className="absolute inset-0 pointer-events-none">
            <Code className="absolute top-10 left-10 w-6 h-6 text-electric-500/30 animate-float" style={{ animationDelay: '0s' }} />
            <BookOpen className="absolute top-20 right-16 w-5 h-5 text-cyber-500/30 animate-particle-float" style={{ animationDelay: '2s' }} />
            <Star className="absolute bottom-10 left-20 w-4 h-4 text-matrix-500/30 animate-neural-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
            Our Courses
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of{' '}
            <span className="text-electric-400 font-semibold">cutting-edge courses</span>{' '}
            designed to accelerate your learning journey in{' '}
            <span className="text-cyber-400 font-semibold">Computer Science</span>
          </p>
          
          {/* Course statistics */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-400 animate-neural-pulse">50+</div>
              <div className="text-sm text-gray-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyber-400 ">500+</div>
              <div className="text-sm text-gray-400">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-matrix-400 ">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <Card variant="hologram" className="p-4 sm:p-6 animate-fade-in-up animate-delay-200">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center">
            
            {/* Enhanced Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-electric-400 w-5 h-5 " />
              <input
                type="text"
                placeholder="Search courses, technologies, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-quantum-800/50 border border-electric-500/30 rounded-xl text-white placeholder-gray-400 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              />
              {/* Search suggestions indicator */}
              {searchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-matrix-400 rounded-full animate-neural-pulse" />
                </div>
              )}
            </div>

            {/* Enhanced View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-quantum-800/50 backdrop-blur-sm rounded-xl p-1 border border-cyber-500/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 group ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-electric-500 to-cyber-500 text-white shadow-glow' 
                    : 'text-gray-400 hover:text-white hover:bg-quantum-700/50'
                }`}
              >
                <Grid className="w-5 h-5 group-hover:" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 group ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-electric-500 to-cyber-500 text-white shadow-glow' 
                    : 'text-gray-400 hover:text-white hover:bg-quantum-700/50'
                }`}
              >
                <List className="w-5 h-5 group-hover:" />
              </button>
            </div>

            {/* Enhanced Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-cyber-500 hover:to-electric-500 transition-all duration-300 rounded-xl text-white font-medium shadow-glow group"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Enhanced Filter Pills */}
          <div className={`mt-6 transition-all duration-300 overflow-hidden ${showFilters || 'max-lg:hidden'}`}>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-electric-500 to-cyber-500 text-white shadow-glow '
                      : 'bg-quantum-800/50 text-gray-300 hover:bg-quantum-700/70 hover:text-white border border-electric-500/20 hover:border-electric-500/40 backdrop-blur-sm'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {filter}
                  {activeFilter === filter && (
                    <div className="inline-block w-2 h-2 bg-white rounded-full ml-2 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Enhanced Results Count */}
        <div className="flex justify-between items-center animate-fade-in-up animate-delay-300">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-electric-400 rounded-full animate-neural-pulse" />
              <p className="text-gray-300 text-sm sm:text-base font-medium">
                <span className="text-electric-400 font-bold">{filteredCourses.length}</span>{' '}
                {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </p>
            </div>
            {activeFilter !== 'All' && (
              <div className="px-2 py-1 bg-cyber-500/20 border border-cyber-400/30 rounded text-xs text-cyber-300">
                {activeFilter}
              </div>
            )}
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="flex items-center space-x-1 text-electric-400 hover:text-cyber-400 transition-colors duration-300 text-sm font-medium group"
            >
              <span>Clear search</span>
              <div className="w-1 h-1 bg-electric-400 rounded-full group-hover:" />
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
          <Card variant="hologram" className="p-12 sm:p-16 text-center animate-fade-in-up animate-delay-300">
            <div className="max-w-md mx-auto space-y-6">
              {/* Enhanced empty state icon */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-2xl flex items-center justify-center animate-float">
                  <Search className="w-10 h-10 text-electric-400" />
                </div>
                {/* Floating particles around icon */}
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyber-400 rounded-full animate-particle-float" />
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-matrix-400 rounded-full animate-neural-pulse" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
                No Courses Found
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {searchTerm 
                  ? (
                    <>
                      No courses match your search for{' '}
                      <span className="text-electric-400 font-semibold">"{searchTerm}"</span>
                    </>
                  )
                  : "No courses available for the selected filter"
                }
              </p>
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-cyber-500 hover:to-electric-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-glow group"
                >
                  <Search className="w-4 h-4 mr-2 group-hover:animate-spin" />
                  Clear Search
                </button>
              )}
              
              {/* Suggestion text */}
              <p className="text-sm text-gray-400 mt-4">
                Try searching for{' '}
                <span className="text-cyber-400">React</span>,{' '}
                <span className="text-electric-400">Node.js</span>, or{' '}
                <span className="text-matrix-400">Python</span>
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;