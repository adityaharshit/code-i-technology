import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const dashboardCards = [
    {
      title: 'My Courses',
      description: 'View your enrolled courses, track progress, and check for pending payments.',
      icon: '📚',
      link: '/my-courses',
      buttonText: 'View Courses',
      color: 'from-blue-500 to-blue-600',
      stats: '5 Active Courses',
      delay: '200'
    },
    {
      title: 'Transactions',
      description: 'Check your payment history, download invoices, and manage billing information.',
      icon: '💳',
      link: '/transactions',
      buttonText: 'View Transactions',
      color: 'from-green-500 to-green-600',
      stats: 'Last payment: $299',
      delay: '400'
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information, preferences, and account security settings.',
      icon: '⚙️',
      link: '/profile',
      buttonText: 'Edit Profile',
      color: 'from-purple-500 to-purple-600',
      stats: 'Profile 90% complete',
      delay: '600'
    }
  ];

  const quickStats = [
    { label: 'Courses Completed', value: '12', icon: '✅', color: 'text-green-400' },
    { label: 'Hours Learned', value: '145', icon: '⏰', color: 'text-blue-400' },
    { label: 'Certificates', value: '3', icon: '🏆', color: 'text-yellow-400' },
    { label: 'Current Streak', value: '7 days', icon: '🔥', color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Welcome Header */}
        <div className={`mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                Welcome back, 
                <span className="block sm:inline text-blue-400 mt-1 sm:mt-0 sm:ml-3">
                  {user?.fullName || 'Student'}! 👋
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl">
                Continue your learning journey and achieve your goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/courses" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse New Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up opacity-100 animate-delay-100' : 'opacity-0'
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickStats.map((stat, index) => (
              <Card 
                key={index} 
                variant="glass" 
                className="p-4 sm:p-6 text-center hover-lift"
              >
                <div className={`text-2xl sm:text-3xl mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up opacity-100 animate-delay-200' : 'opacity-0'
        }`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center lg:text-left">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {dashboardCards.map((card, index) => (
              <Card 
                key={index} 
                variant="glass" 
                className={`p-6 sm:p-8 hover-lift transition-all duration-1000 ${
                  isVisible ? 'animate-scale-in opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${card.delay}ms` }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${card.color} bg-opacity-20`}>
                    <span className="text-2xl sm:text-3xl">{card.icon}</span>
                  </div>
                  <div className={`text-xs sm:text-sm px-2 py-1 rounded-full bg-gradient-to-r ${card.color} bg-opacity-20 text-white`}>
                    {card.stats}
                  </div>
                </div>

                {/* Card Content */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card Action */}
                <Link to={card.link} className="block">
                  <Button 
                    variant="outline" 
                    className="w-full hover:scale-105 transition-transform"
                  >
                    {card.buttonText}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        

        
      </div>
    </div>
  );
};

export default Dashboard;