import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">Our Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-400 mb-4 flex-grow">{course.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary font-bold">₹{course.feePerMonth}/month</span>
              <span className="text-sm text-gray-400">{course.duration} months</span>
            </div>
            <Link to={`/courses/${course.id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;