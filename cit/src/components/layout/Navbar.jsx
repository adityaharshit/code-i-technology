import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import logo from '../../images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    ...(isAuthenticated ? [
      { name: 'My Courses', href: '/my-courses' },
      { name: 'Transactions', href: '/transactions' },
      { name: 'Profile', href: '/profile' }
    ] : []),
    { name: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg shadow-black/20' 
        : 'bg-gray-800 bg-opacity-90 backdrop-blur-sm'
    } border-b border-gray-700 border-opacity-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
          >
            <img 
              src={logo} 
              alt="Code i Technology Logo" 
              className="h-8 sm:h-10 w-auto transition-all duration-200 group-hover:brightness-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-200 relative overflow-hidden group ${
                  location.pathname === item.href
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700 hover:bg-opacity-50'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {location.pathname !== item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 xl:space-x-4">
                <div className="text-right">
                  <span className="text-sm text-gray-300 block">Welcome,</span>
                  <span className="text-sm font-medium text-white">
                    {user?.fullName?.split(' ')[0] || 'Student'}
                  </span>
                </div>
                {user?.type === 'admin' && (
                  <Link to="/admin-dashboard">
                    <Button variant="outline" size="sm" className="text-xs">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-xs xl:text-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs xl:text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="text-xs xl:text-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-1' : ''
                }`}></span>
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                  isOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                  isOpen ? '-rotate-45 -translate-y-1' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? ' opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700 border-opacity-50 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-b-lg">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700 hover:bg-opacity-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-600 border-opacity-50 space-y-3">
                <div className="px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user?.fullName || 'User'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {user?.type === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className="block mx-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                
                <div className="px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-600 border-opacity-50 space-y-2">
                <div className="px-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;