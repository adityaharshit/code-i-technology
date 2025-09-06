// cit/src/pages/AdminCourseDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import { paymentsAPI } from '../services/payments';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TransactionDetailModal from '../components/admin/TransactionDetailModal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Users, BarChart2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../hooks/useDebounce';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getCourseDetailsForAdmin(id, debouncedSearchTerm, statusFilter);
      setCourseDetails(response.data);
    } catch (err) {
      setError('Failed to fetch course details.');
      console.error('Error fetching course details:', err);
    } finally {
      setLoading(false);
    }
  }, [id, debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleStatusUpdate = async (transactionId, status) => {
    try {
      await paymentsAPI.updateStatus(transactionId, status);
      toast.success(`Transaction status updated to ${status}.`);
      fetchCourseDetails();
      setSelectedTransaction(null);
    } catch (err) {
      toast.error('Failed to update transaction status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'pending approval':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-400">{error}</div>;
  if (!courseDetails) return <div className="text-center">Course not found.</div>;

  const { course, totalStudents, totalRevenue, enrolledStudents, transactions } = courseDetails;

  return (
    <div className="space-y-8">
      <Link to="/admin-dashboard" className="flex items-center text-secondary hover:underline mb-4">
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </Link>

      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">{course.title}</h1>
          <p className="text-gray-400 mt-2 max-w-2xl">{course.description}</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4 text-center">
            <Users className="mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">{totalStudents}</div>
            <div className="text-sm text-gray-400">Total Students</div>
          </Card>
          <Card className="p-4 text-center">
            <BarChart2 className="mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </Card>
        </div>
      </div>

      {/* Enrolled Students */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Enrolled Students</h2>
          <div className="max-h-96 overflow-y-auto">
            {enrolledStudents.length > 0 ? (
              <ul className="space-y-2">
                {enrolledStudents.map(student => (
                  <li key={student.rollNumber} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{student.fullName}</p>
                      <p className="text-sm text-gray-400 font-mono">{student.rollNumber}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm text-white">Paid: {student.monthsPaid} / {course.duration} months</p>
                        <progress
                            className="w-32 h-2 rounded-full [&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:bg-secondary"
                            max={course.duration}
                            value={student.monthsPaid}
                        />
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-400">No students are currently enrolled in this course.</p>}
          </div>
        </div>
      </Card>

      {/* Transactions */}
      <Card className="p-0">
         <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Course Transactions</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="all">All Statuses</option>
                <option value="pending approval">Pending</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-t border-gray-700">
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.tid} className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedTransaction(transaction)}>
                  <td className="py-4 px-6 text-gray-400">{formatDate(transaction.createdAt)}</td>
                  <td className="py-4 px-6">
                    <p className="text-white font-semibold">{transaction.student.fullName}</p>
                    <p className="text-gray-400 text-sm font-mono">{transaction.billNo}</p>
                  </td>
                  <td className="py-4 px-6 text-white font-semibold">{formatCurrency(transaction.netPayable)}</td>
                   <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
           {!loading && transactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
                <p>No transactions found for the selected filters.</p>
            </div>
           )}
        </div>
      </Card>

      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AdminCourseDetail;

