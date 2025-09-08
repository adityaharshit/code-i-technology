// cit/src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI } from '../services/courses';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Users, 
  Star,
  ArrowLeft,
  Play,
  BookOpen,
  Award
} from 'lucide-react';

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
        toast.error('Failed to load course details');
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'live':
        return {
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          icon: Play,
          text: 'LIVE NOW',
          pulse: true
        };
      case 'upcoming':
        return {
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          icon: Calendar,
          text: 'UPCOMING',
          pulse: false
        };
      case 'completed':
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          icon: Award,
          text: 'COMPLETED',
          pulse: false
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          icon: BookOpen,
          text: 'DRAFT',
          pulse: false
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button className="bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary">
              Browse Courses
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isFullyPaid = course.isEnrolled && course.monthsPaid >= course.duration;
  const statusConfig = getStatusConfig(course.status);
  const StatusIcon = statusConfig.icon;

  const renderActionButtons = () => {
    if (course.status === 'completed') {
      return (
        <Button size="lg" className="w-full sm:w-auto bg-gray-600 cursor-not-allowed" disabled>
          <Award className="w-5 h-5 mr-2" />
          Course Completed
        </Button>
      );
    }

    if (course.isEnrolled) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
          <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 cursor-default" disabled>
            <CheckCircle className="w-5 h-5 mr-2" />
            Already Enrolled
          </Button>
          {!isFullyPaid && (
            <Link to={`/payment/${course.id}`} className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white">
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Fees
              </Button>
            </Link>
          )}
        </div>
      );
    }
    
    if (course.status === 'live' || course.status === 'upcoming') {
      return (
        <Button 
          onClick={handleEnroll} 
          size="lg"
          className="w-full sm:w-auto bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-secondary/25"
        >
          <Users className="w-5 h-5 mr-2" />
          Enroll Now
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 animate-fade-in-left">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-400 hover:text-secondary transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Courses
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            
            <Card className="relative overflow-hidden bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5"></div>
              
              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {statusConfig.text}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">(4.8)</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-lg text-gray-300 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up animate-delay-200">
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Duration</h3>
                    <p className="text-blue-300 text-xl font-semibold">{course.duration} months</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-400/30 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Monthly Fee</h3>
                    <p className="text-green-300 text-xl font-semibold">₹{course.feePerMonth}</p>
                  </div>
                </div>
              </Card>
            </div>

            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <Card className="p-6 sm:p-8 bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-up animate-delay-300">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-secondary" />
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-dark-700/30 hover:bg-dark-600/30 transition-all duration-300">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-24 p-6 sm:p-8 bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-dark-600/50 backdrop-blur-lg animate-fade-in-right">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-white">
                    ₹{course.feePerMonth}
                    <span className="text-lg font-normal text-gray-400">/month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Total: ₹{course.feePerMonth * course.duration} for {course.duration} months
                  </div>
                </div>

                {course.isEnrolled && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Payment Progress</span>
                      <span className="text-white font-medium">
                        {course.monthsPaid || 0} / {course.duration} months
                      </span>
                    </div>
                    <div className="w-full bg-dark-600 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                        style={{ width: `${Math.min(((course.monthsPaid || 0) / course.duration) * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {renderActionButtons()}
                </div>

                {course.courseIncludes && course.courseIncludes.length > 0 && (
                  <div className="text-left space-y-3 pt-6 border-t border-dark-600/50">
                    <h3 className="font-semibold text-white mb-4">This course includes:</h3>
                    {course.courseIncludes.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-right animate-delay-200">
              <h3 className="font-semibold text-white mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Skill Level</span>
                  <span className="text-white font-medium">{course.skillLevel || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Language</span>
                  <span className="text-white font-medium">{course.language || 'English'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-right animate-delay-300">
              <h3 className="font-semibold text-white mb-4">Instructor</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{course.instructorName?.split(' ').map(n => n[0]).join('') || 'TBA'}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{course.instructorName || 'TBA'}</h4>
                  <p className="text-gray-400 text-sm">Senior Developer</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {course.instructorDetails || 'Expert from the industry.'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div> 
  )};

export default CourseDetail;

