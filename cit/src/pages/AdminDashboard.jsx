// Enhanced Futuristic Admin Dashboard
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
import { 
  Menu, 
  X, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Activity, 
  Zap, 
  Shield, 
  Sparkles,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';

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
      variant: 'electric',
      bgColor: 'from-electric-500/20 to-electric-600/10',
      iconColor: 'text-electric-400',
      delay: 'animate-delay-100'
    },
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      variant: 'cyber',
      bgColor: 'from-cyber-500/20 to-cyber-600/10',
      iconColor: 'text-cyber-400',
      delay: 'animate-delay-200'
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: TrendingUp,
      variant: 'matrix',
      bgColor: 'from-matrix-500/20 to-matrix-600/10',
      iconColor: 'text-matrix-400',
      delay: 'animate-delay-300'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      variant: 'neural',
      bgColor: 'from-neural-500/20 to-neural-600/10',
      iconColor: 'text-neural-400',
      delay: 'animate-delay-400'
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
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={stat.title}
                variant={stat.variant}
                className={`p-4 sm:p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up ${stat.delay} group relative overflow-hidden`}
              >
                {/* Floating particles */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-current rounded-full opacity-30 " />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-current rounded-full opacity-20 animate-particle-float" />
                
                <div className="flex flex-col items-center space-y-4 relative z-10">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.iconColor} group-hover:`} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-white animate-neural-pulse">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-gray-300 font-medium">{stat.title}</div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.bgColor} rounded-full animate-progress-fill group-hover:`} 
                         style={{ width: `${Math.min(100, (stat.value / 1000) * 100)}%` }} />
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Shield className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <BarChart3 className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <Activity className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur-md border-b border-dark-700/50">
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
          {/* Enhanced Desktop Header */}
          <div className="hidden lg:flex items-center justify-between p-6 xl:p-8 animate-fade-in-down relative z-10">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-2xl">
                  <Shield className="w-8 h-8 text-electric-400 " />
                </div>
                <div>
                  <h1 className="text-2xl xl:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-300 mt-1 flex items-center space-x-2">
                    <span>Welcome back, {user?.fullName}</span>
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </p>
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Admin stats mini */}
              <div className="hidden xl:flex items-center space-x-4">
                <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-dark-600/50">
                  <div className="text-electric-400 font-bold text-lg">{stats?.totalStudents || 0}</div>
                  <div className="text-gray-400 text-xs">Students</div>
                </div>
                <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-dark-600/50">
                  <div className="text-cyber-400 font-bold text-lg">{stats?.totalCourses || 0}</div>
                  <div className="text-gray-400 text-xs">Courses</div>
                </div>
              </div>
              
              {/* User profile */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-semibold">{user?.username}</p>
                  <p className="text-gray-400 text-sm flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Administrator
                  </p>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-full flex items-center justify-center animate-neural-pulse shadow-glow">
                    <span className="text-white font-bold text-lg">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-dark-800 " />
                </div>
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