// Enhanced Futuristic Admin Course Detail Page
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { coursesAPI } from "../services/courses";
import { paymentsAPI } from "../services/payments";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import TransactionDetailModal from "../components/admin/TransactionDetailModal";
import CertificateModal from "../components/admin/CertificateModal";
import MarksheetModal from "../components/admin/MarksheetModal";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  Award,
  Users,
  BarChart2,
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  BookOpen,
  Activity,
  Zap,
  Shield,
  Sparkles,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import useDebounce from "../hooks/useDebounce";

const AdminCourseDetail = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [studentsWithCertificates, setStudentWithCertificates] = useState([]);
  const [studentsWithMarksheets, setStudentWithMarksheets] = useState([]);
   // State for the new certificate modal
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);
  
  // State for the new certificate modal
 const [isMarksheetModalOpen, setIsMarksheetModalOpen] = useState(false);
 const [selectedStudentForMark, setSelectedStudentForMark] = useState(null);

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getCourseDetailsForAdmin(
        id,
        debouncedSearchTerm,
        statusFilter
      );
      setCourseDetails(response.data);
      const studentsCertificates = response.data.certificates.map( (student)=>
        student.studentId
      );
      setStudentWithCertificates( studentsCertificates);
      const studentsMarksheets = response.data.marksheets.map( (student)=>
        student.studentId
      );
      setStudentWithMarksheets( studentsMarksheets);
    } catch (err) {
      setError("Failed to fetch course details.");
      console.error("Error fetching course details:", err);
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
      toast.error("Failed to update transaction status.");
    }
  };

  const handleOpenCertificateModal = (student) => {
    setSelectedStudentForCert(student);
    setIsCertificateModalOpen(true);
  };

  const handleOpenMarksheetModal = (student) => {
    setSelectedStudentForMark(student);
    setIsMarksheetModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-500 bg-opacity-20 text-green-400 border-green-400";
      case "pending approval":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-400";
      case "rejected":
        return "bg-red-500 bg-opacity-20 text-red-400 border-red-400";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400 border-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-6 animate-fade-in-down">
          <div className="skeleton-line h-6 w-32"></div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="skeleton-title h-8 w-3/4"></div>
            <div className="skeleton-line h-4 w-full"></div>
            <div className="skeleton-line h-4 w-2/3"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="skeleton-line h-24 w-full sm:w-32"></div>
            <div className="skeleton-line h-24 w-full sm:w-32"></div>
          </div>
        </div>

        {[1, 2].map((i) => (
          <Card
            key={i}
            className="p-6 animate-fade-in-up"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div className="skeleton-title"></div>
            <div className="skeleton-paragraph">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center text-red-400 animate-fade-in-up">{error}</div>
    );
  if (!courseDetails)
    return (
      <div className="text-center animate-fade-in-up">Course not found.</div>
    );

  const {
    course,
    totalStudents,
    totalRevenue,
    enrolledStudents,
    transactions,
    certificates,
  } = courseDetails;

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <BookOpen
          className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <BarChart2
          className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float"
          style={{ animationDelay: "2s" }}
        />
        <Users
          className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse"
          style={{ animationDelay: "1s" }}
        />
        <DollarSign
          className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 "
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced Back Navigation */}
        <Card variant="hologram" className="p-4 sm:p-6 animate-fade-in-down">
          <Link
            to="/admin-dashboard"
            className="inline-flex items-center text-electric-400 hover:text-electric-300 hover:underline transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm sm:text-base font-medium">
              Back to Dashboard
            </span>
          </Link>
        </Card>

        {/* Enhanced Header & Summary */}
        <Card
          variant="electric"
          className="p-6 sm:p-8 animate-fade-in-up animate-delay-200"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8">
            <div className="flex-1 min-w-0 space-y-6">
              {/* Course Header */}
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-electric-400 " />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                    {course.title}
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed">
                    {course.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Enhanced Course Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-lg border border-dark-600/50">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {course.duration} months
                    </p>
                    <p className="text-gray-400 text-xs">Duration</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-lg border border-dark-600/50">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {formatCurrency(course.feePerMonth)}
                    </p>
                    <p className="text-gray-400 text-xs">Per Month</p>
                  </div>
                </div>

                {course.discountPercentage > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-lg border border-dark-600/50">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {course.discountPercentage}%
                      </p>
                      <p className="text-gray-400 text-xs">Discount</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 w-full lg:w-auto">
              <Card
                variant="cyber"
                className="p-4 sm:p-6 text-center hover:scale-105 transition-all duration-300 group relative"
              >
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyber-400 rounded-full " />
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cyber-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white animate-neural-pulse">
                  {totalStudents}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  Total Students
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                  <div
                    className="bg-gradient-to-r from-cyber-400 to-cyber-500 h-1 rounded-full animate-progress-fill"
                    style={{ width: "85%" }}
                  />
                </div>
              </Card>

              <Card
                variant="matrix"
                className="p-4 sm:p-6 text-center hover:scale-105 transition-all duration-300 group relative"
              >
                <div className="absolute top-2 right-2 w-2 h-2 bg-matrix-400 rounded-full " />
                <BarChart2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-matrix-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white animate-neural-pulse">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  Total Revenue
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                  <div
                    className="bg-gradient-to-r from-matrix-400 to-matrix-500 h-1 rounded-full animate-progress-fill"
                    style={{ width: "92%" }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Enrolled Students */}
        <Card className="animate-fade-in-up animate-delay-700">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-down">
              Enrolled Students
            </h2>

            {enrolledStudents.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
                {enrolledStudents.map((student, index) => (
                  <div
                    key={student.rollNumber}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 glass-card rounded-lg hover-lift animate-fade-in-up`}
                    style={{ animationDelay: `${800 + index * 50}ms` }}
                  >
                    <div className="flex-1 mb-3 sm:mb-0">
                      <p className="font-semibold text-white text-sm sm:text-base">
                        {student.fullName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 font-mono">
                        {student.rollNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Certificate Button */}
                      <Button
                        variant={ studentsWithCertificates.includes(student.id) ? `success` : 'outline'}
                        size="sm"
                        onClick={() => handleOpenCertificateModal(student)}
                      >
                        <Award size={14} className="mr-2" />
                        Certificate
                      </Button>

                      {/* Marksheet Button */}
                      {course.courseType == 2 && (

                        <Button
                        variant={ studentsWithMarksheets.includes(student.id) ? `success` : 'outline'}
                        size="sm"
                        onClick={() => handleOpenMarksheetModal(student)}
                      >
                        <Award size={14} className="mr-2" />
                        Marksheet
                      </Button>
                      )}

                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-white font-medium">
                          Progress: {student.monthsPaid} / {course.duration}{" "}
                          months
                        </p>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 animate-fade-in-up">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-sm sm:text-base">
                  No students are currently enrolled in this course.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Transactions */}
        <Card className="p-0 animate-fade-in-up animate-delay-900">
          {/* Transaction Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Course Transactions
              </h2>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto pl-4 pr-8 py-2 sm:py-3 glass-input rounded-lg text-sm focus:ring-2 focus:ring-secondary appearance-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending approval">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-input"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Table/List */}
          {transactions.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-800 bg-opacity-50">
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                        Student
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction.tid}
                        className={`border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer transition-all duration-200 animate-fade-in-up`}
                        style={{ animationDelay: `${1000 + index * 50}ms` }}
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-white font-semibold text-sm">
                            {transaction.student.fullName}
                          </p>
                          <p className="text-gray-400 text-xs font-mono">
                            {transaction.billNo}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-white font-semibold text-sm">
                          {formatCurrency(transaction.netPayable)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4 sm:p-6">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.tid}
                    className={`glass-card p-4 rounded-lg cursor-pointer hover-lift animate-fade-in-up`}
                    style={{ animationDelay: `${1000 + index * 50}ms` }}
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">
                          {transaction.student.fullName}
                        </p>
                        <p className="text-gray-400 text-xs font-mono">
                          {transaction.billNo}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold">
                        {formatCurrency(transaction.netPayable)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16 animate-fade-in-up">
              <BarChart2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-sm sm:text-base">
                No transactions found for the selected filters.
              </p>
            </div>
          )}
        </Card>

        <TransactionDetailModal
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
          onStatusUpdate={handleStatusUpdate}
        />

        <CertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          student={selectedStudentForCert}
          course={course}
        />

        <MarksheetModal
          isOpen={isMarksheetModalOpen}
          onClose={() => setIsMarksheetModalOpen(false)}
          student={selectedStudentForMark}
          course={course}
        />
      </div>
    </div>
  );
};

export default AdminCourseDetail;
