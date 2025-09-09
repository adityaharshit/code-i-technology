// Enhanced Futuristic About Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Users, 
  BookOpen, 
  Code, 
  Rocket, 
  Target, 
  Award, 
  TrendingUp, 
  Zap, 
  Shield, 
  Sparkles, 
  ChevronRight,
  Activity,
  Globe,
  Star
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience and proven expertise",
      icon: Users,
      color: "electric"
    },
    {
      title: "Modern Curriculum",
      description: "Stay updated with the latest technologies and industry trends that matter",
      icon: BookOpen,
      color: "cyber"
    },
    {
      title: "Hands-on Projects",
      description: "Build real-world projects to strengthen your portfolio and showcase skills",
      icon: Code,
      color: "matrix"
    },
    {
      title: "Career Support",
      description: "Get personalized assistance and career guidance throughout your journey",
      icon: Rocket,
      color: "neural"
    }
  ];

  const stats = [
    { number: "500+", label: "Students Trained", color: "electric", icon: Users, delay: 100 },
    { number: "50+", label: "Courses Available", color: "cyber", icon: BookOpen, delay: 200 },
    { number: "95%", label: "Success Rate", color: "matrix", icon: TrendingUp, delay: 300 },
    { number: "5+", label: "Years Experience", color: "neural", icon: Award, delay: 400 }
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Target className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <Shield className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <Award className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Rocket className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Enhanced Hero Section */}
        <Card variant="hologram" className={`p-8 sm:p-12 text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="flex flex-col items-center space-y-6">
            {/* Enhanced Icon */}
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-3xl animate-neural-pulse shadow-glow">
                <Target className="text-white w-10 h-10" />
              </div>
              {/* Floating indicators */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-matrix-400 rounded-full " />
              <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-neural-400 rounded-full animate-particle-float" />
            </div>

            {/* Enhanced Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
                About Code i Technology
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl leading-relaxed">
                Empowering the next generation of{' '}
                <span className="text-electric-400 font-semibold">tech innovators</span>{' '}
                with cutting-edge education and{' '}
                <span className="text-cyber-400 font-semibold">real-world expertise</span>
              </p>
              
              {/* Mission indicator */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Activity className="w-4 h-4 text-matrix-400 animate-pulse" />
                <span className="text-sm text-gray-400">
                  Transforming careers since 2019
                </span>
              </div>
            </div>
          </div>
        </Card>

      {/* Enhanced Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Mission Card */}
        <Card variant="neural" className={`p-8 lg:p-10 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-neural-500/20 to-neural-600/30 animate-neural-pulse">
                <Target className="w-6 h-6 text-neural-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-neural-400 to-electric-500 bg-clip-text text-transparent">
                Our Mission
              </h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              Code i Technology is a leading institution dedicated to providing{' '}
              <span className="text-electric-400 font-semibold">high-quality education</span>{' '}
              in the field of computer science and technology. Our mission is to empower students with 
              the skills and knowledge needed to succeed in the{' '}
              <span className="text-cyber-400 font-semibold">ever-evolving tech industry</span>.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              We offer a wide range of courses, from beginner to advanced levels, taught by{' '}
              <span className="text-matrix-400 font-semibold">experienced instructors</span>{' '}
              who are experts in their fields. Our curriculum is constantly updated to 
              reflect the latest industry standards and emerging technologies.
            </p>

            {/* Mission highlights */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-neural-500/10 border border-neural-400/20 rounded-lg">
                <Globe className="w-6 h-6 text-neural-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Global Standards</div>
              </div>
              <div className="text-center p-3 bg-neural-500/10 border border-neural-400/20 rounded-lg">
                <Shield className="w-6 h-6 text-neural-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Quality Assured</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Vision Card */}
        <Card variant="cyber" className={`p-8 lg:p-10 ${isVisible ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyber-500/20 to-cyber-600/30 animate-neural-pulse">
                <Rocket className="w-6 h-6 text-cyber-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-cyber-400 to-matrix-500 bg-clip-text text-transparent">
                Our Vision
              </h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              To become the{' '}
              <span className="text-electric-400 font-semibold">leading technology education platform</span>{' '}
              that bridges the gap between academic learning and industry requirements, creating{' '}
              <span className="text-cyber-400 font-semibold">future-ready professionals</span>{' '}
              who can drive innovation and technological advancement.
            </p>

            {/* Vision highlights */}
            <div className="space-y-3">
              {[
                'Industry-aligned curriculum',
                'Practical skill development',
                'Career-focused training',
                'Innovation-driven approach'
              ].map((item, index) => (
                <div key={item} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-cyber-500/10 transition-all duration-300 group">
                  <div className="w-2 h-2 bg-cyber-400 rounded-full " />
                  <span className="text-gray-300 group-hover:text-cyber-300 transition-colors duration-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Section */}
      <div className={`mb-12 lg:mb-16 ${isVisible ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
        <h2 className="subheading-responsive text-center text-white mb-8 lg:mb-12">
          Our Impact in Numbers
        </h2>
        <div className="grid-responsive-1">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className={`stats-card-responsive glass-interactive text-center hover-lift ${isVisible ? `animate-scale-in ${stat.delay}` : 'opacity-0'}`}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-blue mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-400">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className={`${isVisible ? 'animate-fade-in-up animate-delay-600' : 'opacity-0'}`}>
        <h2 className="subheading-responsive text-center text-white mb-8 lg:mb-12">
          Why Choose Us?
        </h2>
        <div className="grid-responsive-2">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`p-6 sm:p-8 glass-interactive hover-lift ${isVisible ? `animate-fade-in-up animate-stagger-${index + 1}` : 'opacity-0'}`}
            >
              <div className="text-3xl sm:text-4xl mb-4 text-center">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400 text-center leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`text-center mt-12 lg:mt-16 ${isVisible ? 'animate-fade-in-up animate-delay-1000' : 'opacity-0'}`}>
        <Card className="p-8 sm:p-12 glass-enhanced">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-responsive-sm text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with our comprehensive programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary-responsive hover-lift animate-pulse-glow">
              Explore Courses
            </button>
            <button className="btn-outline-responsive hover-lift">
              Contact Us
            </button>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default About;