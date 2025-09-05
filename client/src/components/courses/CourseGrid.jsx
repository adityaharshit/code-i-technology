import React from 'react';
import CourseCard from './CourseCard';
import Card from '../ui/Card';
import { ServerCrash } from 'lucide-react';

const CourseGrid = ({ courses, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Skeleton loaders for better UX */}
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-6 h-80 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-8"></div>
            <div className="h-10 bg-gray-600 rounded mt-auto"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center flex flex-col items-center">
        <ServerCrash size={48} className="text-ternary1 mb-4" />
        <h3 className="text-xl font-semibold text-white">An Error Occurred</h3>
        <p className="text-gray-400 mt-2">{error}</p>
      </Card>
    );
  }
  
  if (!courses || courses.length === 0) {
    return (
      <Card className="p-12 text-center flex flex-col items-center">
        <h3 className="text-xl font-semibold text-white">No Courses Found</h3>
        <p className="text-gray-400 mt-2">There are currently no courses available. Please check back later.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
