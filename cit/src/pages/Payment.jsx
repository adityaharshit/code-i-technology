// cit/src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PaymentForm from '../components/payments/PaymentForm'; // <-- Import the component
import toast from 'react-hot-toast';

const Payment = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getById(courseId);
        setCourse(response.data);
      } catch (error) {
        toast.error('Failed to fetch course details.');
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-ternary1">Course Not Found</h2>
        <p className="text-gray-400 mt-2">
          We couldn't find the course you're trying to pay for. Please go back to your courses and try again.
        </p>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Payment for {course?.title}</h1>
      <p className="text-gray-400 mb-6">Complete the form below to submit your payment.</p>
      
      {/* Render the new PaymentForm component */}
      <PaymentForm course={course} />

    </Card>
  );
};

export default Payment;
