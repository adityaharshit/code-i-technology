// cit/src/components/admin/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { coursesAPI } from '../../services/courses';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import { Eye } from 'lucide-react';

const CourseManagement = () => {
  const navigate = useNavigate(); // Initialize navigate
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Course Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add New Course</Button>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-500 bg-opacity-20 border border-red-400">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  course.status === 'Live' 
                    ? 'bg-green-500 bg-opacity-20 text-green-400' 
                    : course.status === 'Upcoming'
                    ? 'bg-blue-500 bg-opacity-20 text-blue-400'
                    : 'bg-gray-500 bg-opacity-20 text-gray-400'
                }`}>
                  {course.status}
                </span>
              </div>
              
              <p className="text-gray-400 mb-4 line-clamp-3 h-20">{course.description}</p>
              
              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <p>Duration: {course.duration} months</p>
                <p>Fee: ₹{course.feePerMonth}/month</p>
                <p>Discount: {course.discountPercentage}%</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="primary" size="sm" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                <Eye size={16} className="mr-2"/>
                Details
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleDelete(course.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-400">No courses found. Create your first course!</p>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        resetForm();
      }}>
        <h2 className="text-2xl font-bold text-white mb-6">
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Course Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (months)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
            
            <Input
              label="Fee per Month (₹)"
              type="number"
              step="0.01"
              value={formData.feePerMonth}
              onChange={(e) => setFormData({ ...formData, feePerMonth: e.target.value })}
              required
            />
          </div>

          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />

          <Input
            label="QR Code URL"
            value={formData.qrCodeUrl}
            onChange={(e) => setFormData({ ...formData, qrCodeUrl: e.target.value })}
            placeholder="https://cloudinary.com/example.png"
          />

          <Input
              label="Discount Percentage (%)"
              type="number"
              step="0.01"
              value={formData.discountPercentage}
              onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
              placeholder="e.g., 10 for 10%"
            />

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1">
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManagement;

