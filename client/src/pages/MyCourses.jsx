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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Courses</h1>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="p-6">
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-400 mb-4">{course.description}</p>
              <Link to={`/payment/${course.id}`}>
                <Button variant="secondary">Pay Fees</Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <p>You have not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default MyCourses;