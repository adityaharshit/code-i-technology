// Enhanced Futuristic 404 Not Found Page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  Zap, 
  Sparkles, 
  Navigation, 
  RefreshCw,
  BookOpen,
  Users,
  Activity
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      navigate('/');
    }
  }, [countdown, autoRedirect, navigate]);

  const handleStopRedirect = () => {
    setAutoRedirect(false);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <AlertTriangle className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <Search className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <Navigation className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Main Error Display */}
        <Card variant="hologram" className={`p-8 sm:p-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="space-y-8">
            {/* 404 Display */}
            <div className="relative">
              <div className="text-8xl sm:text-9xl lg:text-[12rem] font-display font-black bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent  leading-none">
                404
              </div>
              
              {/* Glitch effects */}
              <div className="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-display font-black text-electric-500/20 animate-glitch-1 leading-none">
                404
              </div>
              <div className="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-display font-black text-cyber-500/20 animate-glitch-2 leading-none">
                404
              </div>
              
              {/* Floating indicators */}
              <div className="absolute -top-4 -right-4 w-4 h-4 bg-electric-400 rounded-full " />
              <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-cyber-400 rounded-full animate-particle-float" />
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white animate-fade-in-up animate-delay-300">
                Page Not Found
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animate-delay-400">
                The page you're looking for seems to have{' '}
                <span className="text-electric-400 font-semibold">vanished</span>{' '}
                into the digital void. Don't worry, we'll help you find your way back.
              </p>
            </div>

            {/* Auto-redirect countdown */}
            {autoRedirect && (
              <Card variant="neural" className="p-4 sm:p-6 animate-fade-in-up animate-delay-500">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-matrix-500/20 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-matrix-400 animate-spin" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Auto-redirecting to home</p>
                      <p className="text-gray-400 text-sm">in {countdown} seconds</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleStopRedirect}
                    className="hover:bg-red-500/20 hover:border-red-400 hover:text-red-400"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </Card>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up animate-delay-600">
          {/* Home */}
          <Card variant="electric" className="p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <Link to="/" className="block">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-electric-500/20 rounded-2xl group-hover:bg-electric-500/30 transition-colors duration-300">
                  <Home className="w-8 h-8 text-electric-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Go Home</h3>
                  <p className="text-gray-400 text-sm">Return to the main page</p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Courses */}
          <Card variant="cyber" className="p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <Link to="/courses" className="block">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-cyber-500/20 rounded-2xl group-hover:bg-cyber-500/30 transition-colors duration-300">
                  <BookOpen className="w-8 h-8 text-cyber-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Browse Courses</h3>
                  <p className="text-gray-400 text-sm">Explore our course catalog</p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Dashboard */}
          <Card variant="matrix" className="p-6 hover:scale-105 transition-all duration-300 group cursor-pointer sm:col-span-2 lg:col-span-1">
            <Link to="/dashboard" className="block">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-matrix-500/20 rounded-2xl group-hover:bg-matrix-500/30 transition-colors duration-300">
                  <Activity className="w-8 h-8 text-matrix-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Dashboard</h3>
                  <p className="text-gray-400 text-sm">View your progress</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-700">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-cyber-500 hover:to-matrix-500 group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Take Me Home
          </Button>
        </div>

        {/* Help Section */}
        <Card variant="neural" className="p-6 sm:p-8 animate-fade-in-up animate-delay-800">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="p-4 bg-neural-500/20 rounded-2xl">
              <Sparkles className="w-8 h-8 text-neural-400 " />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                If you believe this is an error or need assistance, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/contact" 
                  className="text-neural-400 hover:text-neural-300 text-sm font-medium hover:underline transition-colors duration-300"
                >
                  Contact Support
                </Link>
                <span className="hidden sm:inline text-gray-600">•</span>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-neural-400 hover:text-neural-300 text-sm font-medium hover:underline transition-colors duration-300"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;