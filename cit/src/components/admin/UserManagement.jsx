// cit/src/components/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/admin';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import UserDetailModal from './UserDetailModal';
import { Search, Users, UserCheck, UserX, AlertCircle, Eye, Trash2, Badge } from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';
import { generateIDCardPDF } from '../../utils/idCardGeneratorUtil';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingIdFor, setGeneratingIdFor] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchStudents = useCallback(async () => {
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
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
    e.stopPropagation();
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

  const handleGenerateIdCard = async (e, student) => {
    e.stopPropagation();
    if (!student.id) return;

    setGeneratingIdFor(student.id);
    const toastId = toast.loading(`Generating ID for ${student.fullName}...`);

    try {
      const response = await adminAPI.getIdCardInfoForStudent(student.id);
      const { user, course, expiryDate } = response.data;
      
      if (!user.photoUrl) {
        toast.error(`${user.fullName} does not have a profile photo.`, { id: toastId });
        return;
      }
      
      await generateIDCardPDF({ user, course, expiryDate });
      toast.success('ID Card downloaded!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate ID card.', { id: toastId });
      console.error('Error generating ID card for admin:', error);
    } finally {
      setGeneratingIdFor(null);
    }
  };

  const getStats = () => {
    const total = students.length;
    const verified = students.filter(s => s.isVerified).length;
    const unverified = students.filter(s => !s.isVerified).length;
    
    return { total, verified, unverified };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white animate-fade-in-down">User Management</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1 animate-fade-in-down animate-delay-100">
            Manage student accounts and information
          </p>
        </div>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="animate-fade-in-down">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">User Management</h2>
        <p className="text-sm sm:text-base text-gray-400">Manage student accounts and information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up animate-delay-100">
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-400">Total Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.verified}</div>
              <div className="text-xs sm:text-sm text-gray-400">Verified</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.unverified}</div>
              <div className="text-xs sm:text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-fade-in-up animate-delay-200">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search by name, email, roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {error && (
        <Card className="p-4 sm:p-6 bg-red-500 bg-opacity-20 border border-red-400 animate-fade-in-up animate-delay-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        </Card>
      )}

      {/* Desktop Table */}
      <Card className="p-0 hidden lg:block animate-fade-in-up animate-delay-400 glass-enhanced">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Roll No</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Email</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr 
                  key={student.id} 
                  className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer transition-all duration-200 hover-lift-subtle"
                  onClick={() => handleRowClick(student.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-6 text-white font-mono text-sm animate-fade-in-left">
                    {student.rollNumber}
                  </td>
                  <td className="py-4 px-6 text-white font-semibold text-sm animate-fade-in-left animate-delay-100">
                    {student.fullName}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm animate-fade-in-left animate-delay-200">
                    {student.email}
                  </td>
                  <td className="py-4 px-6 animate-fade-in-left animate-delay-300">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      student.isVerified 
                        ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30' 
                        : 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30'
                    }`}>
                      {student.isVerified ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 animate-fade-in-left animate-delay-400">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(student.id);
                        }}
                        className="hover-scale"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleDeleteStudent(e, student.id)}
                        className="hover-scale"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleGenerateIdCard(e, student)}
                        loading={generatingIdFor === student.id}
                        disabled={generatingIdFor !== null}
                        className="hover-scale border-cyber-500/50 text-cyber-400 hover:bg-cyber-500/20"
                      >
                        <Badge className="w-3 h-3 mr-1" />
                        ID Card
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-base">No students found for "{debouncedSearchTerm}"</p>
          </div>
        )}
      </Card>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 animate-fade-in-up animate-delay-400">
        {students.map((student, index) => (
          <Card 
            key={student.id}
            className="p-4 glass-card hover-lift cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleRowClick(student.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-base">{student.fullName}</h3>
                <p className="text-gray-400 text-sm font-mono">{student.rollNumber}</p>
                <p className="text-gray-400 text-sm">{student.email}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                student.isVerified 
                  ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30' 
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30'
              }`}>
                {student.isVerified ? (
                  <>
                    <UserCheck className="w-3 h-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <UserX className="w-3 h-3 mr-1" />
                    Pending
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(student.id);
                }}
                className="flex-1 sm:flex-none hover-scale"
              >
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
               <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleGenerateIdCard(e, student)}
                loading={generatingIdFor === student.id}
                disabled={generatingIdFor !== null}
                className="flex-1 sm:flex-none hover-scale border-cyber-500/50 text-cyber-400 hover:bg-cyber-500/20"
              >
                <Badge className="w-3 h-3 mr-1" />
                ID Card
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => handleDeleteStudent(e, student.id)}
                className="hover-scale"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
        {students.length === 0 && (
          <Card className="p-8 text-center glass-card">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-400">No students found for "{debouncedSearchTerm}"</p>
          </Card>
        )}
      </div>

      <UserDetailModal 
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        user={selectedStudent}
      />
    </div>
  );
};

export default UserManagement;

