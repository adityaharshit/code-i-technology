import React from 'react';
import { X, BarChart3, Users, BookOpen, CreditCard, Activity } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, isMobileOpen, onMobileClose }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Overview & Analytics'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users,
      description: 'Manage Students'
    },
    { 
      id: 'courses', 
      label: 'Course Management', 
      icon: BookOpen,
      description: 'Courses & Content'
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: CreditCard,
      description: 'Payments & Billing'
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-20 h-full w-64 xl:w-72 z-50">
        <div className="h-full glass-enhanced border-r border-gray-700 animate-slide-in-left">
          <div className="p-6 xl:p-8">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8 xl:mb-12 animate-fade-in-down">
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-pulse-subtle">
                <span className="text-white font-bold text-sm xl:text-base">CIT</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg xl:text-xl">Admin Panel</span>
                <p className="text-gray-400 text-xs xl:text-sm hidden xl:block">Management System</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 xl:space-y-3 mb-8">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 xl:space-x-4 px-4 py-3 xl:py-4 rounded-xl transition-all duration-300 group animate-fade-in-left animate-delay-${(index + 1) * 100} ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700 hover:bg-opacity-50 hover:backdrop-blur-md hover:scale-102'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 xl:w-6 xl:h-6 transition-transform duration-200 ${
                      activeTab === item.id ? 'animate-pulse-subtle' : 'group-hover:scale-110'
                    }`} />
                    <div className="flex-1 text-left">
                      <span className="font-medium text-sm xl:text-base block">{item.label}</span>
                      <span className="text-xs text-gray-500 hidden xl:block group-hover:text-gray-300 transition-colors duration-200">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* System Status */}
            <div className="absolute bottom-6 xl:bottom-8 left-6 xl:left-8 right-6 xl:right-8 animate-fade-in-up animate-delay-800">
              <div className="p-4 xl:p-5 glass-card rounded-xl border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-sm xl:text-base font-medium">System Status</p>
                  <Activity className="w-4 h-4 xl:w-5 xl:h-5 text-green-400 animate-pulse" />
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse-subtle" />
                  <span className="text-green-400 text-xs xl:text-sm font-medium">All Systems Operational</span>
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full animate-progress-fill" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-18 h-full w-80 z-40 transform transition-transform duration-300 ease-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full glass-enhanced border-r border-gray-700 animate-slide-in-left">
          <div className="p-4 sm:p-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-subtle">
                  <span className="text-white font-bold text-sm">CIT</span>
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Admin Panel</span>
                  <p className="text-gray-400 text-xs">Management System</p>
                </div>
              </div>
              <button
                onClick={onMobileClose}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 hover-scale"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-8">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group animate-fade-in-left animate-delay-${(index + 1) * 100} ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700 hover:bg-opacity-50'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 transition-transform duration-200 ${
                      activeTab === item.id ? 'animate-pulse-subtle' : 'group-hover:scale-110'
                    }`} />
                    <div className="flex-1 text-left">
                      <span className="font-medium block">{item.label}</span>
                      <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Mobile System Status */}
            <div className="animate-fade-in-up animate-delay-600">
              <div className="p-4 glass-card rounded-xl border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-medium">System Status</p>
                  <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse-subtle" />
                  <span className="text-green-400 text-sm font-medium">Operational</span>
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full animate-progress-fill" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;