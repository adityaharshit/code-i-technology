// Enhanced Futuristic Login Page
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Zap,
  Target,
  Users,
  Award,
  TrendingUp,
  Shield,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      newErrors.username = "Username or email is required";
    }
    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login(credentials);
      if (response.data.user?.type === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const features = [
    {
      icon: Target,
      title: "Personalized Dashboard",
      description: "Track your learning progress and achievements",
      color: "electric",
    },
    {
      icon: Zap,
      title: "Access Courses",
      description: "Unlock all premium courses and materials",
      color: "cyber",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow learners and instructors",
      color: "matrix",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn industry-recognized certifications",
      color: "neural",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Zap
          className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Target
          className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float"
          style={{ animationDelay: "2s" }}
        />
        <Users
          className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse"
          style={{ animationDelay: "1s" }}
        />
        <Award
          className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 "
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Enhanced Left Side - Welcome Content */}
          <div
            className={`hidden lg:block space-y-8 ${
              isVisible ? "animate-fade-in-left" : "opacity-0"
            }`}
          >
            <div className="text-center lg:text-left">
              <h2 className="text-3xl xl:text-4xl font-display font-bold text-white mb-4">
                Welcome Back to
              </h2>
              <h2 className="text-4xl xl:text-6xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent mb-6 ">
                Code i Technology
              </h2>
              <p className="text-lg xl:text-xl text-gray-300 leading-relaxed max-w-lg">
                Continue your learning journey with{" "}
                <span className="text-electric-400 font-semibold">
                  industry-leading courses
                </span>{" "}
                and expert guidance.
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={index}
                    variant={feature.color}
                    interactive
                    className={`p-4 group ${
                      isVisible ? `animate-fade-in-up` : "opacity-0"
                    }`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/30 animate-neural-pulse`}
                      >
                        <IconComponent
                          className={`w-5 h-5 text-${feature.color}-400`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-white text-sm xl:text-base mb-1 group-hover:text-electric-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-xs xl:text-sm text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Stats */}
            <Card variant="hologram" className="p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="group">
                  <div className="text-2xl xl:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent group-hover:">
                    500+
                  </div>
                  <div className="text-xs xl:text-sm text-gray-300 font-medium">
                    Students
                  </div>
                  <div className="w-full h-1 bg-electric-500/20 rounded-full mt-2">
                    <div className="w-full h-full bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full animate-energy-flow" />
                  </div>
                </div>
                <div className="group">
                  <div className="text-2xl xl:text-3xl font-display font-bold bg-gradient-to-r from-cyber-400 to-matrix-500 bg-clip-text text-transparent group-hover:">
                    50+
                  </div>
                  <div className="text-xs xl:text-sm text-gray-300 font-medium">
                    Courses
                  </div>
                  <div className="w-full h-1 bg-cyber-500/20 rounded-full mt-2">
                    <div className="w-4/5 h-full bg-gradient-to-r from-cyber-500 to-matrix-500 rounded-full animate-energy-flow" />
                  </div>
                </div>
                <div className="group">
                  <div className="text-2xl xl:text-3xl font-display font-bold bg-gradient-to-r from-matrix-400 to-neural-500 bg-clip-text text-transparent group-hover:">
                    95%
                  </div>
                  <div className="text-xs xl:text-sm text-gray-300 font-medium">
                    Success Rate
                  </div>
                  <div className="w-full h-1 bg-matrix-500/20 rounded-full mt-2">
                    <div className="w-full h-full bg-gradient-to-r from-matrix-500 to-neural-500 rounded-full animate-energy-flow" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Right Side - Login Form */}
          <div
            className={`max-w-md w-full mx-auto ${
              isVisible
                ? "animate-fade-in-right animate-delay-200"
                : "opacity-0"
            }`}
          >
            <Card variant="" className="p-6 sm:p-8 relative overflow-hidden">
              {/* Floating particles inside card */}
              <div className="absolute top-4 right-4 w-1 h-1 bg-electric-400 rounded-full animate-particle-float" />
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-cyber-400 rounded-full animate-float" />

              {/* Mobile Header */}
              <div className="text-center mb-8 lg:hidden relative z-10">
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent mb-2">
                  Sign In
                </h1>
                
                <div className="w-16 h-1 bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full mx-auto mt-3 animate-energy-flow" />
              </div>

              {/* Desktop Header */}
              <div className="text-center mb-8 hidden lg:block relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-electric-400 mr-3 " />
                  <h1 className="text-2xl xl:text-3xl font-display font-bold bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
                    Sign In
                  </h1>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-electric-500 to-cyber-500 rounded-full mx-auto mt-3 animate-energy-flow" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Enhanced Username Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-400" />
                    <input
                      name="username"
                      type="text"
                      value={credentials.username}
                      onChange={handleChange}
                      required
                      placeholder="Enter your username or email"
                      className="w-full pl-12 pr-4 py-3 bg-quantum-800/50 border border-electric-500/30 rounded-xl text-white placeholder-gray-400 focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    />
                    {credentials.username && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-matrix-400 rounded-full " />
                    )}
                  </div>
                  {errors.username && (
                    <div className="text-red-400 text-sm flex items-center space-x-2 animate-fade-in-up">
                      <span className="w-1 h-1 bg-red-400 rounded-full" />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-400" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 bg-quantum-800/50 border border-cyber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-400 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="text-red-400 text-sm flex items-center space-x-2 animate-fade-in-up">
                      <span className="w-1 h-1 bg-red-400 rounded-full" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <Card
                    variant="neural"
                    className="p-4 border-red-500/30 bg-red-500/10 animate-shake"
                  >
                    <div className="text-red-400 text-sm flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <span>{errors.submit}</span>
                    </div>
                  </Card>
                )}

                {/* Enhanced Submit Button */}
                <Button
                  type="submit"
                  loading={loading}
                  variant="primary"
                  className="w-full group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Shield className="w-5 h-5 mr-2 " />
                      Sign In
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Enhanced Sign Up Link */}
              <div className="mt-8 text-center relative z-10">
                <div className="text-gray-300 mb-2">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-electric-400 hover:text-cyber-400 transition-colors duration-300 font-semibold group"
                  >
                    Sign up now
                    <Sparkles className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
                <div className="text-xs text-gray-400">
                  Join{" "}
                  <span className="text-electric-400 font-semibold">
                    thousands
                  </span>{" "}
                  of successful learners
                </div>
              </div>
            </Card>

            {/* Enhanced Help Section */}
            <div
              className={`mt-8 text-center ${
                isVisible ? "animate-fade-in-up animate-delay-600" : "opacity-0"
              }`}
            >
              <Card variant="quantum" className="p-4 group">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-4 h-4 text-quantum-400 mr-2 " />
                  <span className="text-sm text-gray-300 font-medium">
                    Need help signing in?
                  </span>
                </div>
                <div className="flex justify-center items-center space-x-4 text-xs">
                  <Link
                    to="/contact"
                    className="flex items-center space-x-1 text-electric-400 hover:text-cyber-400 transition-colors duration-300 group"
                  >
                    <span>Contact Support</span>
                    <div className="w-1 h-1 bg-electric-400 rounded-full group-hover:" />
                  </Link>
                  <div className="w-1 h-1 bg-quantum-400 rounded-full animate-pulse" />
                  <Link
                    to="/help"
                    className="flex items-center space-x-1 text-cyber-400 hover:text-matrix-400 transition-colors duration-300 group"
                  >
                    <span>FAQ</span>
                    <div className="w-1 h-1 bg-cyber-400 rounded-full group-hover:" />
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
