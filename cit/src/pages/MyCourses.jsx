// cit/src/pages/MyCourses.jsx
import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../services/courses';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await coursesAPI.getMyCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch my courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded animate-pulse">LIVE</span>;
      case 'upcoming':
        return <span className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded">UPCOMING</span>;
       case 'completed':
        return <span className="absolute top-4 right-4 bg-gray-500 text-white px-2 py-1 text-xs font-bold rounded">COMPLETED</span>;
      default:
        return null;
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Courses</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const monthsPaid = course.monthsPaid || 0;
            const monthsRemaining = course.duration - monthsPaid;
            const progressPercentage = Math.min((monthsPaid / course.duration) * 100, 100);

            return (
              <Card key={course.id} className="p-6 relative flex flex-col">
                {getStatusBadge(course.status)}
                <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                <p className="text-gray-400 mb-4 flex-grow line-clamp-3">{course.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Payment Progress</span>
                    <span className="font-medium">{monthsPaid} / {course.duration} months</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  {monthsRemaining > 0 ? (
                    <p className="text-right text-xs text-yellow-400 mt-1">{monthsRemaining} month(s) remaining</p>
                  ) : (
                     <p className="text-right text-xs text-green-400 mt-1">Fully Paid</p>
                  )}
                </div>

                <div className="flex space-x-2 mt-auto pt-4 border-t border-gray-700">
                  <Link to={`/courses/${course.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Details</Button>
                  </Link>
                  {monthsRemaining > 0 && course.status !== 'completed' && (
                     <Link to={`/payment/${course.id}`} className="flex-1">
                        <Button variant="secondary" className="w-full">Pay Fees</Button>
                      </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
         <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-white">No Courses Found</h3>
            <p className="text-gray-400 mt-2 mb-6">You haven't enrolled in any courses yet. Browse our available courses to get started!</p>
            <Link to="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </Card>
      )}
    </div>
  );
};

export default MyCourses;

