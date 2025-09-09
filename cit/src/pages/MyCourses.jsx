// Enhanced Futuristic MyCourses Page
import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../services/courses';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import IDCardGenerator from '../components/idcard/IDCardGenerator';
import toast from 'react-hot-toast';
import { 
  Play, 
  Calendar, 
  Award, 
  CreditCard, 
  Eye, 
  BookOpen, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  Activity,
  Shield,
  Star,
  Badge
} from 'lucide-react';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCourseForID, setSelectedCourseForID] = useState(null);
  const [isIDCardModalOpen, setIsIDCardModalOpen] = useState(false);

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'live':
        return {
          badge: (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-xs font-bold rounded-full animate-pulse shadow-lg">
              <Play className="w-3 h-3 inline mr-1" />
              LIVE
            </span>
          ),
          color: 'border-red-500/30 bg-red-500/5',
          textColor: 'text-red-400'
        };
      case 'upcoming':
        return {
          badge: (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
              <Calendar className="w-3 h-3 inline mr-1" />
              UPCOMING
            </span>
          ),
          color: 'border-blue-500/30 bg-blue-500/5',
          textColor: 'text-blue-400'
        };
      case 'completed':
        return {
          badge: (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
              <Award className="w-3 h-3 inline mr-1" />
              COMPLETED
            </span>
          ),
          color: 'border-gray-500/30 bg-gray-500/5',
          textColor: 'text-gray-400'
        };
      default:
        return {
          badge: null,
          color: 'border-dark-600/50 bg-dark-700/20',
          textColor: 'text-gray-400'
        };
    }
  };

  const getFilteredCourses = () => {
    if (filter === 'all') return courses;
    return courses.filter(course => course.status === filter);
  };

  const getOverallProgress = () => {
    if (courses.length === 0) return { completed: 0, inProgress: 0, upcoming: 0 };
    
    const stats = courses.reduce((acc, course) => {
      if (course.status === 'completed') acc.completed++;
      else if (course.status === 'live') acc.inProgress++;
      else if (course.status === 'upcoming') acc.upcoming++;
      return acc;
    }, { completed: 0, inProgress: 0, upcoming: 0 });

    return stats;
  };

  const handleGenerateIDCard = (course) => {
    if (!user) {
      toast.error('User information not available. Please refresh the page.');
      return;
    }
    if (!course) {
      toast.error('Course information not available. Please try again.');
      return;
    }
    setSelectedCourseForID(course);
    setIsIDCardModalOpen(true);
  };

  const handleCloseIDCardModal = () => {
    setIsIDCardModalOpen(false);
    setSelectedCourseForID(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your courses..." />
      </div>
    );
  }

  const stats = getOverallProgress();
  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <BookOpen className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <Target className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <Award className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <TrendingUp className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        
        {/* Enhanced Header Section */}
        <Card variant="hologram" className="p-6 sm:p-8 text-center animate-fade-in-down">
          <div className="flex flex-col items-center space-y-6">
            {/* Enhanced Icon */}
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-3xl animate-neural-pulse shadow-glow">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              {/* Floating indicators */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-matrix-400 rounded-full " />
              <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-neural-400 rounded-full animate-particle-float" />
            </div>

            {/* Enhanced Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
                My Learning Journey
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
                Track your{' '}
                <span className="text-electric-400 font-semibold">progress</span>{' '}
                and continue your{' '}
                <span className="text-cyber-400 font-semibold">educational journey</span>
              </p>
              
              {/* Activity indicator */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Activity className="w-4 h-4 text-matrix-400 animate-pulse" />
                <span className="text-sm text-gray-400">
                  Active learning since {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {courses.length > 0 && (
          <>
            {/* Enhanced Statistics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up animate-delay-200">
              <Card variant="matrix" interactive className="p-6 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-matrix-400 font-medium mb-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </p>
                    <p className="text-3xl font-display font-bold text-white group-hover:text-matrix-400 transition-colors duration-300">
                      {stats.completed}
                    </p>
                    <div className="w-full h-1 bg-matrix-500/20 rounded-full mt-3">
                      <div className="w-full h-full bg-gradient-to-r from-matrix-500 to-matrix-400 rounded-full animate-energy-flow" />
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-matrix-500/20 to-matrix-600/30 rounded-2xl flex items-center justify-center animate-neural-pulse">
                    <Award className="w-7 h-7 text-matrix-400" />
                  </div>
                </div>
              </Card>

              <Card variant="electric" interactive className="p-6 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-electric-400 font-medium mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      In Progress
                    </p>
                    <p className="text-3xl font-display font-bold text-white group-hover:text-electric-400 transition-colors duration-300">
                      {stats.inProgress}
                    </p>
                    <div className="w-full h-1 bg-electric-500/20 rounded-full mt-3">
                      <div className="w-4/5 h-full bg-gradient-to-r from-electric-500 to-electric-400 rounded-full animate-energy-flow" />
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-2xl flex items-center justify-center animate-neural-pulse">
                    <TrendingUp className="w-7 h-7 text-electric-400" />
                  </div>
                </div>
              </Card>

              <Card variant="neural" interactive className="p-6 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-neural-400 font-medium mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Upcoming
                    </p>
                    <p className="text-3xl font-display font-bold text-white group-hover:text-neural-400 transition-colors duration-300">
                      {stats.upcoming}
                    </p>
                    <div className="w-full h-1 bg-neural-500/20 rounded-full mt-3">
                      <div className="w-3/5 h-full bg-gradient-to-r from-neural-500 to-neural-400 rounded-full animate-energy-flow" />
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-neural-500/20 to-neural-600/30 rounded-2xl flex items-center justify-center animate-neural-pulse">
                    <Calendar className="w-7 h-7 text-neural-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up animate-delay-300">
              {[
                { key: 'all', label: 'All Courses', count: courses.length },
                { key: 'live', label: 'Live', count: stats.inProgress },
                { key: 'upcoming', label: 'Upcoming', count: stats.upcoming },
                { key: 'completed', label: 'Completed', count: stats.completed }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    filter === filterOption.key
                      ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-secondary/25'
                      : 'bg-dark-700/50 text-gray-300 hover:bg-dark-600/50 hover:text-white border border-dark-600/50 hover:border-dark-500/50'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredCourses.map((course, index) => {
                const monthsPaid = course.monthsPaid || 0;
                const monthsRemaining = course.duration - monthsPaid;
                const progressPercentage = Math.min((monthsPaid / course.duration) * 100, 100);
                const statusConfig = getStatusConfig(course.status);

                return (
                  <Card 
                    key={course.id} 
                    className={`group relative overflow-hidden bg-gradient-to-br from-dark-800/60 to-dark-700/40 border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up ${statusConfig.color}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {statusConfig.badge}
                    
                    <div className="p-6 flex flex-col h-full">
                      {/* Course Header */}
                      <div className="mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                          {course.title}
                        </h2>
                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                      
                      {/* Payment Progress */}
                      <div className="mb-6 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-300 font-medium">Payment Progress</span>
                          <span className="text-white font-semibold bg-dark-600/50 px-2 py-1 rounded-full">
                            {monthsPaid} / {course.duration}
                          </span>
                        </div>
                        
                        <div className="relative w-full bg-dark-600/50 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progressPercentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                          {monthsRemaining > 0 ? (
                            <>
                              <span className="text-yellow-400 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {monthsRemaining} month(s) remaining
                              </span>
                              <span className="text-gray-400">
                                ₹{course.feePerMonth * monthsRemaining} due
                              </span>
                            </>
                          ) : (
                            <span className="text-green-400 font-semibold flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Fully Paid
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Meta */}
                      <div className="mb-6 pt-4 border-t border-dark-600/50">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="text-gray-300">{course.duration} months</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-secondary" />
                            <span className="text-gray-300">₹{course.feePerMonth}/mo</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 mt-auto">
                        {/* First row - Details and Pay Fees */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link to={`/courses/${course.id}`} className="flex-1">
                            <Button 
                              variant="outline" 
                              className="w-full bg-transparent border-secondary/50 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 group/btn"
                            >
                              <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                              Details
                            </Button>
                          </Link>
                          
                          {monthsRemaining > 0 && course.status !== 'completed' && (
                            <Link to={`/payment/${course.id}`} className="flex-1">
                              <Button 
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pay Fees
                              </Button>
                            </Link>
                          )}
                        </div>

                        {/* Second row - Generate ID Card */}
                        <Button 
                          onClick={() => handleGenerateIDCard(course)}
                          className="w-full bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-cyber-500 hover:to-matrix-500 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-electric-500/25 group/id relative overflow-hidden"
                        >
                          <Badge className="w-4 h-4 mr-2 group-hover/id:scale-110 transition-transform duration-300" />
                          Generate ID Card
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/id:translate-x-full transition-transform duration-700"></div>
                        </Button>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {courses.length === 0 && (
          <Card className="p-12 sm:p-16 text-center bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-up">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-secondary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Start Your Learning Journey</h3>
                <p className="text-gray-400 leading-relaxed">
                  You haven't enrolled in any courses yet. Discover our comprehensive range of courses and begin your path to success!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-secondary/25">
                    <Users className="w-5 h-5 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6 border-t border-dark-600/50">
                <p className="text-sm text-gray-500">
                  Join thousands of students already learning with us
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* No Filtered Results */}
        {courses.length > 0 && filteredCourses.length === 0 && (
          <Card className="p-12 text-center bg-gradient-to-br from-dark-800/60 to-dark-700/40 border border-dark-600/50 animate-fade-in-up">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">No Courses Found</h3>
              <p className="text-gray-400">
                No courses match the selected filter. Try selecting a different filter to see your courses.
              </p>
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Show All Courses
              </button>
            </div>
          </Card>
        )}

        {/* ID Card Generator Modal */}
        {selectedCourseForID && (
          <IDCardGenerator
            isOpen={isIDCardModalOpen}
            onClose={handleCloseIDCardModal}
            course={selectedCourseForID}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default MyCourses;