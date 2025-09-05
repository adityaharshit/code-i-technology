import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/admin';
import { coursesAPI } from '../services/courses';
import { paymentsAPI } from '../services/payments';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';
import TransactionManagement from '../components/admin/TransactionManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboardContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <Card className="p-6">
          <div className="text-center text-ternary1">
            <p>{error}</p>
            <Button onClick={fetchDashboardStats} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-3xl font-bold text-primary mb-2">{stats?.totalStudents || 0}</div>
          <div className="text-gray-400">Total Students</div>
          <div className="w-12 h-1 bg-primary mx-auto mt-3 rounded-full"></div>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-3xl font-bold text-secondary mb-2">{stats?.totalCourses || 0}</div>
          <div className="text-gray-400">Total Courses</div>
          <div className="w-12 h-1 bg-secondary mx-auto mt-3 rounded-full"></div>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-3xl font-bold text-ternary1 mb-2">{stats?.totalTransactions || 0}</div>
          <div className="text-gray-400">Transactions</div>
          <div className="w-12 h-1 bg-ternary1 mx-auto mt-3 rounded-full"></div>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform duration-200">
          <div className="text-3xl font-bold text-ternary3 mb-2">
            ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-gray-400">Total Revenue</div>
          <div className="w-12 h-1 bg-ternary3 mx-auto mt-3 rounded-full"></div>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
            {renderDashboardContent()}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setActiveTab('courses')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📚 Manage Courses
                  </Button>
                  <Button
                    onClick={() => setActiveTab('users')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    👥 Manage Users
                  </Button>
                  <Button
                    onClick={() => setActiveTab('transactions')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    💰 View Transactions
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🎓</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">New student registration</p>
                        <p className="text-gray-400 text-xs">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💰</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">Payment received</p>
                        <p className="text-gray-400 text-xs">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-ternary1 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📊</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">Course enrollment</p>
                        <p className="text-gray-400 text-xs">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
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
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 p-6 ml-64">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">
                Welcome back, {user?.fullName} 👋
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.username}</p>
                <p className="text-gray-400 text-sm">Administrator</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;