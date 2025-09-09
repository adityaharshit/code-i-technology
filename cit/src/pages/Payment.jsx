// Enhanced Futuristic Payment Page
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PaymentForm from '../components/payments/PaymentForm';
import Button from '../components/ui/Button';
import { 
  CreditCard, 
  ArrowLeft, 
  AlertTriangle, 
  BookOpen, 
  Shield, 
  Zap, 
  Sparkles,
  Clock,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getById(courseId);
        setCourse(response.data);
        setIsVisible(true);
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
      <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <CreditCard className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
          <Shield className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
          <CheckCircle className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
          <Zap className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Card variant="electric" className="p-8 sm:p-12 text-center animate-fade-in-up">
            <div className="space-y-6">
              <div className="flex justify-center">
                <LoadingSpinner className="w-16 h-16 text-electric-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Loading Course Details
                </h2>
                <p className="text-gray-300">
                  Please wait while we fetch the course information...
                </p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-electric-400 to-cyber-500 h-2 rounded-full animate-progress-fill" style={{ width: '60%' }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <AlertTriangle className="absolute top-20 left-10 w-4 h-4 text-neural-500/20 animate-float" style={{ animationDelay: '0s' }} />
          <BookOpen className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
          <CreditCard className="absolute bottom-32 left-20 w-5 h-5 text-electric-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <Card variant="neural" className="p-8 sm:p-12 text-center animate-fade-in-up">
            <div className="space-y-6">
              {/* Error Icon */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full " />
              </div>

              {/* Error Content */}
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Course Not Found
                </h2>
                <p className="text-gray-300 text-lg">
                  We couldn't find the course you're trying to pay for.
                </p>
                <p className="text-gray-400">
                  Please go back to your courses and try again, or contact support if the issue persists.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  as={Link}
                  to="/courses"
                  size="lg"
                  className="bg-gradient-to-r from-cyber-500 to-electric-500 hover:from-electric-500 hover:to-matrix-500 group"
                >
                  <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Browse Courses
                </Button>
                
                <Button 
                  as={Link}
                  to="/my-courses"
                  variant="outline"
                  size="lg"
                  className="group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  My Courses
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <CreditCard className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <Shield className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <CheckCircle className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <Card variant="hologram" className={`p-6 sm:p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            {/* Back Navigation */}
            <Link 
              to="/my-courses" 
              className="inline-flex items-center text-electric-400 hover:text-electric-300 hover:underline transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm sm:text-base">Back to My Courses</span>
            </Link>

            {/* Security Badge */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Secure Payment</span>
            </div>
          </div>

          {/* Page Title */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-2xl">
                <CreditCard className="w-8 h-8 text-electric-400 " />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent">
                  Payment for {course?.title}
                </h1>
                <p className="text-gray-300 text-sm sm:text-base mt-1">
                  Complete the form below to submit your payment securely
                </p>
              </div>
            </div>

            {/* Payment Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              

              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Fast</p>
                  <p className="text-gray-400 text-xs">Instant processing</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Easy</p>
                  <p className="text-gray-400 text-xs">Simple process</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Form */}
        <div className={`${isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
          <PaymentForm course={course} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
