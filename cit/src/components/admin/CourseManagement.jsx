import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../services/courses';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import { Eye, Plus, Edit, Trash2, Calendar, DollarSign, Clock, Users, TrendingUp } from 'lucide-react';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    startDate: '',
    feePerMonth: '',
    qrCodeUrl: '',
    discountPercentage: 0,
  });

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
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      startDate: '',
      feePerMonth: '',
      qrCodeUrl: '',
      discountPercentage: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, formData);
      } else {
        await coursesAPI.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      setError('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      duration: course.duration.toString(),
      startDate: course.startDate ? course.startDate.split('T')[0] : '',
      feePerMonth: course.feePerMonth.toString(),
      qrCodeUrl: course.qrCodeUrl || '',
      discountPercentage: course.discountPercentage || 0
    });
    setIsModalOpen(true);
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
      case 'Live':
        return {
          color: 'bg-green-500 bg-opacity-20 text-green-400 border-green-400',
          icon: '🟢',
          pulse: true
        };
      case 'Upcoming':
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
            <div className="skeleton-line h-10 w-full sm:w-40"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4 sm:p-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-paragraph">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
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
          onClick={() => setIsModalOpen(true)}
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
            <Button onClick={() => setIsModalOpen(true)} className="hover-scale">
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
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} ${
                        statusConfig.pulse ? 'animate-pulse-subtle' : ''
                      }`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Course Description */}
                  <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3 min-h-[4.5rem]">
                    {course.description || 'No description available'}
                  </p>
                  
                  {/* Course Stats */}
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-700">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                    className="flex-1 hover-scale group"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:inline">Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(course)}
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
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <div className="animate-fade-in-up">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Course Title */}
            <div className="animate-fade-in-up animate-delay-100">
              <Input
                label="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="glass-input"
                placeholder="Enter course title..."
              />
            </div>
            
            {/* Description */}
            <div className="animate-fade-in-up animate-delay-200">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Course Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 ease-out glass-input resize-none"
                rows="4"
                placeholder="Describe your course..."
              />
            </div>

            {/* Duration and Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="animate-fade-in-up animate-delay-300">
                <Input
                  label="Duration (months)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  min="1"
                  className="glass-input"
                  placeholder="6"
                />
              </div>
              
              <div className="animate-fade-in-up animate-delay-400">
                <Input
                  label="Fee per Month (₹)"
                  type="number"
                  step="0.01"
                  value={formData.feePerMonth}
                  onChange={(e) => setFormData({ ...formData, feePerMonth: e.target.value })}
                  required
                  min="0"
                  className="glass-input"
                  placeholder="5000"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="animate-fade-in-up animate-delay-500">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="glass-input"
              />
            </div>

            {/* QR Code URL */}
            <div className="animate-fade-in-up animate-delay-600">
              <Input
                label="QR Code URL (Optional)"
                value={formData.qrCodeUrl}
                onChange={(e) => setFormData({ ...formData, qrCodeUrl: e.target.value })}
                placeholder="https://example.com/qr-code.png"
                className="glass-input"
              />
            </div>

            {/* Discount */}
            <div className="animate-fade-in-up animate-delay-700">
              <Input
                label="Discount Percentage (%)"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                placeholder="10"
                className="glass-input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 animate-fade-in-up animate-delay-800">
              <Button 
                type="submit" 
                className="flex-1 hover-scale"
                disabled={!formData.title.trim()}
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="flex-1 hover-scale"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CourseManagement;