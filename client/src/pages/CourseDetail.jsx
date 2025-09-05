import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await coursesAPI.getById(id);
        setCourse(response.data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to enroll.');
      navigate('/login');
      return;
    }
    try {
      await coursesAPI.enroll(id);
      toast.success('Enrolled successfully!');
      navigate('/my-courses');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enroll.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return <div className="text-center text-2xl">Course not found.</div>;
  }

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-300 mb-6">{course.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-bold">Duration</h3>
          <p>{course.duration} months</p>
        </div>
        <div>
          <h3 className="font-bold">Fee</h3>
          <p>₹{course.feePerMonth} / month</p>
        </div>
        <div>
          <h3 className="font-bold">Start Date</h3>
          <p>{new Date(course.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="font-bold">Status</h3>
          <p className="capitalize">{course.status}</p>
        </div>
      </div>
      {(course.status === 'live' || course.status === 'upcoming') && (
        <Button onClick={handleEnroll} size="lg">
          Enroll Now
        </Button>
      )}
    </Card>
  );
};

export default CourseDetail;