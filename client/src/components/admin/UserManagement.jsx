import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await adminAPI.deleteStudent(id);
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      setError('Failed to delete student');
      console.error('Error deleting student:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <Button onClick={fetchStudents}>Refresh</Button>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-ternary2 bg-opacity-20 border border-ternary1">
          <p className="text-ternary1">{error}</p>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Roll No</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">College</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-4 px-4 text-white">{student.rollNumber}</td>
                  <td className="py-4 px-4 text-white">{student.fullName}</td>
                  <td className="py-4 px-4 text-gray-400">{student.email}</td>
                  <td className="py-4 px-4 text-gray-400">{student.collegeName || 'N/A'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.isVerified 
                        ? 'bg-green-500 bg-opacity-20 text-green-400' 
                        : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                    }`}>
                      {student.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No students found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserManagement;