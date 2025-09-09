import React from 'react';
import CourseCard from './CourseCard';
import Card from '../ui/Card';
import { ServerCrash, BookOpen, Search, RefreshCw } from 'lucide-react';

const CourseGrid = ({ 
  courses, 
  loading, 
  error, 
  variant = 'default', 
  columns = 3,
  onRetry,
  emptyTitle = "No Courses Available",
  emptyDescription = "There are currently no courses available. Please check back later."
}) => {
  // Loading State with Enhanced Skeletons
  if (loading) {
    return (
      <div className={`grid grid-cols-1 ${
        columns === 2 ? 'md:grid-cols-2' : 
        columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
        columns === 4 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
        'md:grid-cols-2 lg:grid-cols-3'
      } gap-6 lg:gap-8`}>
        {Array.from({ length: Math.min(columns * 2, 6) }).map((_, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden bg-gradient-to-br from-dark-800/40 to-dark-700/20 border border-dark-600/30 animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6 space-y-4">
              {/* Header Skeleton */}
              <div className="flex justify-between items-start">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  ))}
                </div>
                <div className="w-12 h-4 bg-gray-700 rounded"></div>
              </div>
              
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              
              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
              
              {/* Meta Skeleton */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <div className="w-16 h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <div className="w-20 h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
              
              {/* Button Skeleton */}
              <div className="h-10 bg-gray-600 rounded-lg mt-6"></div>
            </div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent loading-shimmer"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Error State with Enhanced Design
  if (error) {
    return (
      <Card className="p-12 sm:p-16 text-center bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 hover:border-red-400/30 transition-all duration-300 animate-fade-in-up">
        <div className="max-w-md mx-auto space-y-6">
          {/* Error Icon with Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center animate-pulse-ring">
              <ServerCrash className="w-10 h-10 text-red-400" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-red-500/10 rounded-full animate-ping"></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Something Went Wrong</h3>
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-gray-400 text-sm">
              We're experiencing technical difficulties. Please try again.
            </p>
          </div>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          )}
        </div>
      </Card>
    );
  }
  
  // Empty State with Enhanced Design
  if (!courses || courses.length === 0) {
    return (
      <Card className="p-12 sm:p-16 text-center bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 hover:border-dark-500/60 transition-all duration-300 animate-fade-in-up">
        <div className="max-w-md mx-auto space-y-6">
          {/* Empty State Icon with Floating Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center animate-float">
              <BookOpen className="w-10 h-10 text-secondary" />
            </div>
            {/* Floating Particles */}
            <div className="absolute top-2 left-8 w-2 h-2 bg-secondary/40 rounded-full  animate-delay-300"></div>
            <div className="absolute top-8 right-4 w-1 h-1 bg-primary/60 rounded-full  animate-delay-500"></div>
            <div className="absolute bottom-4 left-12 w-1.5 h-1.5 bg-secondary/50 rounded-full  animate-delay-700"></div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">{emptyTitle}</h3>
            <p className="text-gray-400 leading-relaxed">{emptyDescription}</p>
          </div>
          
          {/* Optional CTA */}
          <div className="pt-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Search className="w-4 h-4" />
              <span>Try adjusting your search or filters</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Course Grid with Enhanced Layout
  return (
    <div className={`grid grid-cols-1 ${
      columns === 2 ? 'md:grid-cols-2' : 
      columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
      columns === 4 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
      'md:grid-cols-2 lg:grid-cols-3'
    } gap-6 lg:gap-8`}>
      {courses.map((course, index) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          index={index}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default CourseGrid;