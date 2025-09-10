// /cit/src/components/admin/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../services/courses';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Eye, Plus, Edit, Trash2, Calendar, DollarSign, Clock, BookOpen, TrendingUp } from 'lucide-react';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await coursesAPI.delete(id);
      fetchCourses();
    } catch (error) {
      setError('Failed to delete course');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'live':
        return {
          color: 'bg-green-500 bg-opacity-20 text-green-400 border-green-400',
          icon: '🟢',
          pulse: true
        };
      case 'upcoming':
        return {
          color: 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-400',
          icon: '🔵',
          pulse: false
        };
      default:
        return {
          color: 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-400',
          icon: '⚫',
          pulse: false
        };
    }
  };
  
  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="animate-fade-in-down">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Course Management</h2>
            <p className="text-sm sm:text-base text-gray-400 mt-1">Create and manage your courses</p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="h-10 bg-gray-700 rounded-lg w-full sm:w-40 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
             <Card key={i} className="p-4 sm:p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-full mt-4"></div>
             </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 animate-fade-in-down">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Course Management</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Create and manage your courses</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/course/add')}
          className="w-full sm:w-auto hover-scale animate-fade-in-up animate-delay-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 mb-6 bg-red-500 bg-opacity-20 border border-red-400 animate-fade-in-up">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center animate-fade-in-up animate-delay-300">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Courses Yet</h3>
            <p className="text-gray-400 mb-6">Create your first course to get started with your learning platform.</p>
            <Button onClick={() => navigate('/admin/course/add')} className="hover-scale">
              <Plus className="w-4 h-4 mr-2" />
              Create First Course
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course, index) => {
            const statusConfig = getStatusConfig(course.status);
            return (
              <Card 
                key={course.id} 
                className={`p-4 sm:p-6 flex flex-col justify-between hover-lift glass-interactive animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 line-clamp-2 flex-1 mr-3">
                      {course.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${statusConfig.color} ${
                      statusConfig.pulse ? 'animate-pulse-subtle' : ''
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3 min-h-[4.5rem]">
                    {course.description || 'No description available'}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">{course.duration} months</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">₹{course.feePerMonth}/month</span>
                    </div>
                    {course.discountPercentage > 0 && (
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-400">{course.discountPercentage}% off</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400">
                        {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBA'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-700">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                    className="flex-1 hover-scale group"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/admin/course/edit/${course.id}`)}
                    className="flex-1 hover-scale group"
                  >
                    <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleDelete(course.id)}
                    className="flex-1 hover-scale group"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
