// cit/src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      toast.success('Enrolled successfully! Redirecting to payment...');
      navigate(`/payment/${id}`);
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

  const isFullyPaid = course.isEnrolled && course.monthsPaid >= course.duration;

  const renderActionButtons = () => {
    if (course.status === 'completed') {
      return <Button size="lg" disabled>Course Completed</Button>;
    }

    if (course.isEnrolled) {
      return (
        <div className="flex items-center space-x-4">
          <Button size="lg" disabled>Already Enrolled</Button>
          {!isFullyPaid && (
            <Link to={`/payment/${course.id}`}>
              <Button size="lg" variant="secondary">Pay Fees</Button>
            </Link>
          )}
        </div>
      );
    }
    
    if (course.status === 'live' || course.status === 'upcoming') {
      return (
        <Button onClick={handleEnroll} size="lg">
          Enroll Now
        </Button>
      );
    }

    return null;
  };

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
          <p>{course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBA'}</p>
        </div>
        <div>
          <h3 className="font-bold">Status</h3>
          <p className="capitalize">{course.status}</p>
        </div>
      </div>
      {renderActionButtons()}
    </Card>
  );
};

export default CourseDetail;

