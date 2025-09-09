// Enhanced Futuristic Course Detail Page
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
  Award,
  Zap,
  Target,
  Code,
  Globe,
  TrendingUp,
  Shield,
  Download,
  Video,
  FileText,
  ChevronRight,
  Sparkles
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
          color: 'from-matrix-500 to-matrix-600',
          bgColor: 'bg-matrix-500/20',
          textColor: 'text-matrix-400',
          icon: Zap,
          text: 'LIVE NOW',
          pulse: true,
          variant: 'matrix'
        };
      case 'upcoming':
        return {
          color: 'from-electric-500 to-electric-600',
          bgColor: 'bg-electric-500/20',
          textColor: 'text-electric-400',
          icon: Calendar,
          text: 'UPCOMING',
          pulse: false,
          variant: 'electric'
        };
      case 'completed':
        return {
          color: 'from-quantum-500 to-quantum-600',
          bgColor: 'bg-quantum-500/20',
          textColor: 'text-quantum-400',
          icon: Award,
          text: 'COMPLETED',
          pulse: false,
          variant: 'quantum'
        };
      default:
        return {
          color: 'from-cyber-500 to-cyber-600',
          bgColor: 'bg-cyber-500/20',
          textColor: 'text-cyber-400',
          icon: BookOpen,
          text: 'DRAFT',
          pulse: false,
          variant: 'cyber'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card variant="hologram" className="p-12 text-center max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-2xl flex items-center justify-center animate-float">
              <BookOpen className="w-10 h-10 text-electric-400" />
            </div>
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyber-400 rounded-full animate-particle-float" />
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-matrix-400 rounded-full animate-neural-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/courses">
            <Button variant="primary" glow holographic className="group">
              <BookOpen className="w-4 h-4 mr-2 group-hover:" />
              Browse Courses
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
        <Button size="lg" variant="success" className="w-full sm:w-auto cursor-not-allowed" disabled>
          <Award className="w-5 h-5 mr-2" />
          Course Completed
        </Button>
      );
    }

    if (course.isEnrolled) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
          <Button size="lg" variant="success" className="w-full sm:w-auto cursor-default" disabled>
            <CheckCircle className="w-5 h-5 mr-2" />
            Already Enrolled
          </Button>
          {!isFullyPaid && (
            <Link to={`/payment/${course.id}`} className="w-full sm:w-auto">
              <Button size="lg" variant="neural" glow className="w-full sm:w-auto group">
                <CreditCard className="w-5 h-5 mr-2 group-hover:" />
                Pay Fees
                <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
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
          variant="primary"
          className="w-full sm:w-auto group"
        >
          <Users className="w-5 h-5 mr-2 group-hover:" />
          Enroll Now
          <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Enhanced Back Button */}
        <div className="mb-8 animate-fade-in-left">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center px-4 py-2 rounded-xl bg-quantum-800/50 border border-electric-500/20 hover:border-electric-500/50 text-gray-300 hover:text-electric-400 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Courses</span>
            <div className="ml-2 w-1 h-1 bg-electric-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enhanced Hero Card */}
            <Card variant="hologram" className="relative overflow-hidden animate-fade-in-up">
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <Code className="absolute top-6 right-6 w-4 h-4 text-electric-500/30 animate-float" style={{ animationDelay: '0s' }} />
                <Target className="absolute top-16 left-8 w-3 h-3 text-cyber-500/30 animate-particle-float" style={{ animationDelay: '2s' }} />
                <Sparkles className="absolute bottom-8 right-12 w-5 h-5 text-matrix-500/30 animate-neural-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                  {/* Enhanced Status Badge */}
                  <div className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider ${statusConfig.bgColor} ${statusConfig.textColor} border border-${statusConfig.variant}-400/30 ${statusConfig.pulse ? 'animate-neural-pulse' : ''}`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {statusConfig.text}
                    {statusConfig.pulse && <div className="ml-2 w-2 h-2 bg-current rounded-full animate-pulse" />}
                  </div>
                  
                  
                </div>

                {/* Enhanced Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent leading-tight ">
                  {course.title}
                </h1>

                {/* Enhanced Description */}
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Course Highlights */}
                <div className="flex flex-wrap gap-3">
                  {['Hands-on Projects', 'Certificate'].map((highlight, index) => (
                    <div 
                      key={highlight}
                      className="px-3 py-1.5 bg-electric-500/20 border border-electric-400/30 rounded-lg text-sm text-electric-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Enhanced Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up animate-delay-200">
              <Card variant="electric" interactive className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-xl flex items-center justify-center animate-neural-pulse">
                    <Clock className="w-6 h-6 text-electric-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Duration</h3>
                    <p className="text-electric-300 text-xl font-display font-semibold">{course.duration} months</p>
                  </div>
                </div>
              </Card>

              <Card variant="matrix" interactive className="p-6 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-matrix-500/20 to-matrix-600/30 rounded-xl flex items-center justify-center animate-neural-pulse">
                    <CreditCard className="w-6 h-6 text-matrix-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Monthly Fee</h3>
                    <p className="text-matrix-300 text-xl font-display font-semibold">₹{course.feePerMonth}</p>
                  </div>
                </div>
              </Card>

              
            </div>

            {/* Enhanced Learning Outcomes */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <Card variant="hologram" className="p-6 sm:p-8 animate-fade-in-up animate-delay-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent flex items-center">
                    <BookOpen className="w-7 h-7 mr-3 text-electric-400 " />
                    What You'll Learn
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full animate-energy-flow" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center space-x-3 p-4 rounded-xl bg-quantum-800/30 border border-electric-500/20 hover:border-electric-500/50 hover:bg-quantum-700/40 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-matrix-500 to-matrix-600 flex items-center justify-center animate-neural-pulse">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300 flex-1">
                        {item}
                      </span>
                      <div className="w-1 h-1 bg-electric-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Enhanced Pricing Card */}
            <Card variant="hologram" neural className="sticky top-24 p-6 sm:p-8 backdrop-blur-xl animate-fade-in-right">
              <div className="text-center space-y-6">
                {/* Enhanced Pricing Display */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
                      ₹{course.feePerMonth}
                      <span className="text-lg font-normal text-gray-400">/month</span>
                    </div>
                    {/* Floating price indicator */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-electric-400 rounded-full " />
                  </div>
                  <div className="text-sm text-gray-300 bg-quantum-800/50 px-3 py-1 rounded-lg border border-electric-500/20">
                    Total: ₹{course.feePerMonth * course.duration} for {course.duration} months
                  </div>
                </div>

                {/* Enhanced Progress Section */}
                {course.isEnrolled && (
                  <div className="space-y-4 p-4 bg-matrix-500/10 border border-matrix-400/30 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-medium">Payment Progress</span>
                      <span className="text-matrix-400 font-bold">
                        {course.monthsPaid || 0} / {course.duration} months
                      </span>
                    </div>
                    <div className="w-full bg-quantum-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-matrix-400 to-matrix-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden animate-energy-flow"
                        style={{ width: `${Math.min(((course.monthsPaid || 0) / course.duration) * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="text-xs text-matrix-300">
                      {Math.round(((course.monthsPaid || 0) / course.duration) * 100)}% completed
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  {renderActionButtons()}
                </div>

                {/* Enhanced Course Includes */}
                {course.courseIncludes && course.courseIncludes.length > 0 && (
                  <div className="text-left space-y-4 pt-6 border-t border-electric-500/20">
                    <h3 className="font-display font-semibold text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-electric-400" />
                      This course includes:
                    </h3>
                    <div className="space-y-3">
                      {course.courseIncludes.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-quantum-800/30 transition-all duration-300 group animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-electric-500 to-cyber-500 flex items-center justify-center animate-neural-pulse">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300 flex-1">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Enhanced Course Stats */}
            <Card variant="cyber" className="p-6 animate-fade-in-right animate-delay-200">
              <h3 className="font-display font-semibold text-white mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-cyber-400 " />
                Course Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-quantum-800/30 border border-cyber-500/20 hover:border-cyber-500/40 transition-all duration-300 group">
                  <span className="text-gray-300 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-cyber-400" />
                    Skill Level
                  </span>
                  <span className="text-cyber-300 font-medium group-hover:text-cyber-200 transition-colors duration-300">
                    {course.skillLevel || 'Intermediate'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-quantum-800/30 border border-cyber-500/20 hover:border-cyber-500/40 transition-all duration-300 group">
                  <span className="text-gray-300 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-cyber-400" />
                    Language
                  </span>
                  <span className="text-cyber-300 font-medium group-hover:text-cyber-200 transition-colors duration-300">
                    {course.language || 'English'}
                  </span>
                </div>
                
              </div>
            </Card>

            {/* Enhanced Instructor Card */}
            <Card variant="neural" className="p-6 animate-fade-in-right animate-delay-300">
              <h3 className="font-display font-semibold text-white mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-neural-400 " />
                Instructor
              </h3>
              
              <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-quantum-800/30 border border-neural-500/20">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-neural-500 to-neural-600 rounded-2xl flex items-center justify-center animate-neural-pulse">
                    <span className="text-white font-bold text-lg">
                      {course.instructorName?.split(' ').map(n => n[0]).join('') || 'TBA'}
                    </span>
                  </div>
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-matrix-500 rounded-full border-2 border-quantum-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-display font-semibold text-white text-lg mb-1">
                    {course.instructorName || 'To Be Announced'}
                  </h4>
                  <p className="text-neural-300 text-sm mb-2">Teacher</p>
                  
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {course.instructorDetails || 'Industry expert with 10+ years of experience in full-stack development and mentoring.'}
              </p>
              
              
            </Card>
          </div>
        </div>
      </div>
    </div> 
  )};

export default CourseDetail;

