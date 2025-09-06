// cit/src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import UserDetailModal from './UserDetailModal'; 
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAllStudents(debouncedSearchTerm);
        setStudents(response.data);
      } catch (error) {
        setError('Failed to fetch students');
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [debouncedSearchTerm]);

  const handleRowClick = async (studentId) => {
    try {
      const response = await adminAPI.getStudentDetails(studentId);
      setSelectedStudent(response.data);
    } catch (err) {
      toast.error("Could not fetch student details.");
      console.error("Error fetching student details:", err);
    }
  };

  const handleDeleteStudent = async (e, id) => {
    e.stopPropagation(); // Prevent modal from opening
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await adminAPI.deleteStudent(id);
        toast.success('Student deleted successfully.');
        setStudents(students.filter(student => student.id !== id));
      } catch (error) {
        toast.error('Failed to delete student.');
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <Input 
            placeholder="Search by name, email, roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-500 bg-opacity-20 border border-red-400">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Roll No</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr 
                    key={student.id} 
                    className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleRowClick(student.id)}
                  >
                    <td className="py-4 px-4 text-white font-mono">{student.rollNumber}</td>
                    <td className="py-4 px-4 text-white font-semibold">{student.fullName}</td>
                    <td className="py-4 px-4 text-gray-400">{student.email}</td>
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
                        onClick={(e) => handleDeleteStudent(e, student.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && students.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No students found for "{debouncedSearchTerm}"</p>
          </div>
        )}
      </Card>

      <UserDetailModal 
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        user={selectedStudent}
      />
    </div>
  );
};

export default UserManagement;

