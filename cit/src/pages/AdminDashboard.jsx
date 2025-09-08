import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/admin';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';
import TransactionManagement from '../components/admin/TransactionManagement';
import { formatDistanceToNow } from '../utils/formatters';
import { Menu, X, TrendingUp, Users, BookOpen, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRecentActivity(),
      ]);
      setStats(statsResponse.data);
      setRecentActivity(activityResponse.data);
    } catch (error) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'primary',
      bgColor: 'bg-blue-500',
      delay: 'animate-delay-100'
    },
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'secondary',
      bgColor: 'bg-purple-500',
      delay: 'animate-delay-100'
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: TrendingUp,
      color: 'ternary1',
      bgColor: 'bg-green-500',
      delay: 'animate-delay-100'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'ternary3',
      bgColor: 'bg-orange-500',
      delay: 'animate-delay-100'
    }
  ];

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <Card className="p-6 animate-fade-in-up">
          <div className="text-center text-red-400">
            <p className="mb-4">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={stat.title}
                className={`p-4 sm:p-6 text-center hover-lift glass-interactive animate-fade-in-up ${stat.delay} group`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-full ${stat.bgColor} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 text-${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 animate-pulse-subtle">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-400">{stat.title}</div>
                  </div>
                  <div className={`w-8 sm:w-12 h-1 bg-${stat.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Quick Actions */}
          <Card className="p-4 sm:p-6 animate-fade-in-left animate-delay-500 glass-enhanced">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Quick Actions</h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { id: 'courses', label: 'Manage Courses', icon: '📚', desc: 'Add, edit, or view courses' },
                { id: 'users', label: 'Manage Users', icon: '👥', desc: 'View and manage students' },
                { id: 'transactions', label: 'View Transactions', icon: '💰', desc: 'Monitor payments and invoices' }
              ].map((action, index) => (
                <Button
                  key={action.id}
                  onClick={() => setActiveTab(action.id)}
                  variant="outline"
                  className={`w-full justify-start text-left p-3 sm:p-4 hover-scale animate-fade-in-up animate-delay-${600 + index * 100} group`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200">
                      {action.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{action.label}</div>
                      <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">{action.desc}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 sm:p-6 animate-fade-in-right animate-delay-600 glass-enhanced">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Recent Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 sm:p-4 bg-gray-800 bg-opacity-50 rounded-lg hover-lift animate-fade-in-up animate-delay-${700 + index * 100} backdrop-blur-sm`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center`}>
                        <span className="text-white text-sm sm:text-base">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm sm:text-base font-medium">{activity.type}</p>
                        <p className="text-gray-400 text-xs sm:text-sm truncate" title={activity.details}>
                          {activity.details}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm flex-shrink-0 ml-2">
                      {formatDistanceToNow(activity.timestamp)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity found.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="animate-fade-in-up">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white animate-fade-in-down">Dashboard Overview</h2>
              <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 animate-fade-in-down animate-delay-100">
                Monitor your system performance and key metrics
              </p>
            </div>
            {renderDashboardContent()}
          </div>
        );
      
      case 'users':
        return <UserManagement />;
      
      case 'courses':
        return <CourseManagement />;
      
      case 'transactions':
        return <TransactionManagement />;
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-800 bg-opacity-95 backdrop-blur-md border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Admin</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium text-sm">{user?.username}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden animate-fade-in"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between p-6 xl:p-8 animate-fade-in-down">
            <div>
              <h1 className="text-2xl xl:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Welcome back, {user?.fullName} 👋
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.username}</p>
                <p className="text-gray-400 text-sm">Administrator</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse-subtle">
                <span className="text-white font-bold text-lg">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-6 xl:p-8 pt-20 lg:pt-0 min-h-screen">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;