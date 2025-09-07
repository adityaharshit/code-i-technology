import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = 'Username or email is required';
    }
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const features = [
    {
      icon: '🎯',
      title: 'Personalized Dashboard',
      description: 'Track your learning progress and achievements'
    },
    {
      icon: '📚',
      title: 'Access Courses',
      description: 'Unlock all premium courses and materials'
    },
    {
      icon: '💬',
      title: 'Community Support',
      description: 'Connect with fellow learners and instructors'
    },
    {
      icon: '🏆',
      title: 'Certificates',
      description: 'Earn industry-recognized certifications'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Welcome Content (Hidden on mobile) */}
          <div className={`hidden lg:block space-y-8 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="text-center lg:text-left">
              <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4">
                Welcome Back to
              </h1>
              <h2 className="text-4xl xl:text-5xl font-bold text-gradient-blue mb-6">
                Code i Technology
              </h2>
              <p className="text-lg xl:text-xl text-gray-300 leading-relaxed max-w-lg">
                Continue your learning journey with industry-leading courses and expert guidance.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`p-4 glass-subtle hover-lift ${isVisible ? `animate-fade-in-up animate-stagger-${index + 1}` : 'opacity-0'}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm xl:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs xl:text-sm text-gray-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl xl:text-3xl font-bold text-gradient-blue">500+</div>
                <div className="text-xs xl:text-sm text-gray-400">Students</div>
              </div>
              <div>
                <div className="text-2xl xl:text-3xl font-bold text-gradient-blue">50+</div>
                <div className="text-xs xl:text-sm text-gray-400">Courses</div>
              </div>
              <div>
                <div className="text-2xl xl:text-3xl font-bold text-gradient-blue">95%</div>
                <div className="text-xs xl:text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`max-w-md w-full mx-auto ${isVisible ? 'animate-fade-in-right animate-delay-200' : 'opacity-0'}`}>
            <Card className="p-6 sm:p-8 glass-enhanced hover-lift">
              {/* Mobile Header */}
              <div className="text-center mb-8 lg:hidden">
                <h1 className="text-2xl font-bold text-gradient-blue mb-2">
                  Code i Technology
                </h1>
                <p className="text-gray-400">Sign in to continue learning</p>
              </div>

              {/* Desktop Header */}
              <div className="text-center mb-8 hidden lg:block">
                <h1 className="text-2xl xl:text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-400">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Username or Email"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                  placeholder="Enter your username or email"
                  className="form-input-responsive"
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  placeholder="Enter your password"
                  className="form-input-responsive"
                />

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-secondary bg-dark-800 border-gray-600 rounded focus:ring-secondary focus:ring-2"
                    />
                    <span className="text-gray-300">Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password"
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {errors.submit && (
                  <div className="error-state animate-shake">
                    <p className="text-red-400 text-sm flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>{errors.submit}</span>
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full hover-lift animate-pulse-glow"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
                  >
                    Sign up now
                  </Link>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Join thousands of successful learners
                </p>
              </div>
            </Card>

            {/* Help Section */}
            <div className={`mt-8 text-center ${isVisible ? 'animate-fade-in-up animate-delay-600' : 'opacity-0'}`}>
              <Card className="p-4 glass-subtle">
                <p className="text-sm text-gray-400 mb-2">
                  Need help signing in?
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <Link 
                    to="/contact" 
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    Contact Support
                  </Link>
                  <span className="text-gray-600">•</span>
                  <Link 
                    to="/help" 
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;