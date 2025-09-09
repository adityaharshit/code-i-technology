// Enhanced Futuristic Dashboard
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { usersAPI } from '../services/users';
import toast from 'react-hot-toast';
import { BookUp, CheckCircle2, Clock, IndianRupee, BookCopy, CreditCard, User, TrendingUp, Zap, Target, Award, ChevronRight, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const fetchStats = async () => {
      try {
        const response = await usersAPI.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        toast.error("Could not load dashboard data.");
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    { 
      label: 'Courses Registered', 
      value: stats.coursesRegistered, 
      icon: BookUp, 
      color: 'electric',
      bgColor: 'from-electric-500/20 to-electric-600/30',
    },
    { 
      label: 'Courses Completed', 
      value: stats.coursesCompleted, 
      icon: CheckCircle2, 
      color: 'matrix',
      bgColor: 'from-matrix-500/20 to-matrix-600/30',
    },
    { 
      label: 'Ongoing Courses', 
      value: stats.ongoingCourses, 
      icon: Clock, 
      color: 'neural',
      bgColor: 'from-neural-500/20 to-neural-600/30',
    },
    { 
      label: 'Total Fees Paid', 
      value: formatCurrency(stats.feesPaid), 
      icon: IndianRupee, 
      color: 'cyber',
      bgColor: 'from-cyber-500/20 to-cyber-600/30',
    }
  ] : [];

  const dashboardCards = stats ? [
    {
      title: 'My Courses',
      description: 'View your enrolled courses, track progress, and check for pending payments.',
      icon: BookCopy,
      link: '/my-courses',
      buttonText: 'View Courses',
      variant: 'electric',
      stats: stats.pendingPayments > 0 ? `${stats.pendingPayments} pending` : 'All paid',
      delay: '200',
      activity: 'Recently accessed React Fundamentals'
    },
    {
      title: 'Transactions',
      description: 'Check your payment history, download invoices, and manage billing information.',
      icon: CreditCard,
      link: '/transactions',
      buttonText: 'View Transactions',
      variant: 'matrix',
      stats: `${stats.totalTransactions} transactions`,
      delay: '400',
      activity: 'Last payment: ₹'
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information, preferences, and account security settings.',
      icon: User,
      link: '/profile',
      buttonText: 'Edit Profile',
      variant: 'cyber',
      stats: `Profile ${stats.profileCompletion}% complete`,
      delay: '600',
      activity: 'Complete your profile for better experience'
    }
  ] : [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Enhanced Welcome Header */}
        <div className={`mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 relative ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
        }`}>
          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <Zap className="absolute top-4 right-10 w-5 h-5 text-electric-500/30 animate-float" style={{ animationDelay: '0s' }} />
            <Target className="absolute top-16 left-8 w-4 h-4 text-cyber-500/30 animate-particle-float" style={{ animationDelay: '2s' }} />
            <Award className="absolute bottom-8 right-16 w-6 h-6 text-matrix-500/30 animate-neural-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <Card variant="hologram" className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-grow">
                <div className="flex items-center space-x-4 mb-4">
                  {/* User avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-500 to-cyber-500 flex items-center justify-center ">
                    <span className="text-white font-bold text-xl">
                      {user?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                      Welcome back,{' '}
                      <span className="bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
                        {user?.fullName?.split(' ')[0] || 'Student'}!
                      </span>
                    </h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <Activity className="w-4 h-4 text-matrix-400" />
                      <p className="text-base sm:text-lg text-gray-300">
                        Continue your learning journey and achieve your goals.
                      </p>
                    </div>
                  </div>
                </div>
                
                
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                    <BookUp className="w-5 h-5 mr-2 group-hover:" />
                    Browse New Courses
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Quick Stats */}
        {statsLoading ? (
            <Card variant="hologram" className="flex justify-center items-center h-40">
                <LoadingSpinner size="lg" text="Loading your dashboard..." />
            </Card>
        ) : (
          <div className={`mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100 animate-delay-100' : 'opacity-0'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index} 
                    variant={stat.color}
                    interactive
                    neural
                    className="p-4 sm:p-6 text-center group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Icon with animated background */}
                    <div className="relative mb-4">
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center animate-neural-pulse`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-400`} />
                      </div>
                      {/* Floating indicator */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 bg-${stat.color}-400 rounded-full `} />
                    </div>
                    
                    {/* Value with animation */}
                    <div className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-electric-400 group-hover:to-cyber-400 transition-all duration-300">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-xs sm:text-sm text-gray-300 mb-3 font-medium">
                      {stat.label}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-quantum-800 rounded-full mb-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 rounded-full animate-energy-flow`}
                        style={{ 
                          width: `${stat.progress}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                    
                    {/* Trend indicator */}
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className={`w-3 h-3 text-${stat.color}-400`} />
                      <span className={`text-xs text-${stat.color}-400 font-semibold`}>
                        {stat.trend}
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Enhanced Main Dashboard Cards */}
        {!statsLoading && (
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100 animate-delay-200' : 'opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
                Quick Actions
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full animate-energy-flow" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {dashboardCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <Card 
                    key={index} 
                    variant={card.variant}
                    interactive
                    holographic
                    className={`p-6 sm:p-8 group transition-all duration-1000 ${
                      isVisible ? 'animate-scale-in opacity-100' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${card.delay}ms` }}
                  >
                    {/* Floating particles */}
                    <div className={`absolute top-4 right-4 w-1 h-1 bg-${card.variant}-400 rounded-full animate-particle-float`} />
                    <div className={`absolute bottom-6 left-6 w-2 h-2 bg-${card.variant}-300 rounded-full animate-float`} />
                    
                    {/* Enhanced Card Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br from-${card.variant}-500/20 to-${card.variant}-600/30 animate-neural-pulse`}>
                        <IconComponent className={`w-8 h-8 text-${card.variant}-400`} />
                      </div>
                      <div className={`text-xs px-3 py-1.5 rounded-xl bg-${card.variant}-500/20 border border-${card.variant}-400/30 text-${card.variant}-300 font-semibold`}>
                        {card.stats}
                      </div>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-electric-400 group-hover:to-cyber-400 transition-all duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3">
                        {card.description}
                      </p>
                      
                      {/* Activity indicator */}
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Activity className="w-3 h-3" />
                        <span>{card.activity}</span>
                      </div>
                    </div>

                    {/* Enhanced Card Action */}
                    <Link to={card.link} className="block">
                      <Button 
                        variant="outline" 
                        className="w-full group"
                      >
                        <span className="flex items-center justify-center">
                          <IconComponent className="w-4 h-4 mr-2 group-hover:" />
                          {card.buttonText}
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

