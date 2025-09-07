import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';

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
      description: "Learn from industry professionals with years of real-world experience",
      icon: "👨‍🏫"
    },
    {
      title: "Modern Curriculum",
      description: "Stay updated with the latest technologies and industry trends",
      icon: "📚"
    },
    {
      title: "Hands-on Projects",
      description: "Build real-world projects to strengthen your portfolio",
      icon: "💻"
    },
    {
      title: "Career Support",
      description: "Get assistance and career guidance throughout your journey",
      icon: "🚀"
    }
  ];

  const stats = [
    { number: "500+", label: "Students Trained", delay: "animate-delay-100" },
    { number: "20+", label: "Courses Completed", delay: "animate-delay-200" },
    // { number: "50+", label: "Industry Partners", delay: "animate-delay-300" },
    { number: "5+", label: "Years Experience", delay: "animate-delay-400" }
  ];

  return (
    <div className="responsive-container section-spacing">
      {/* Hero Section */}
      <div className={`text-center mb-12 lg:mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h1 className="heading-responsive text-gradient-blue mb-4 lg:mb-6">
          About Code i Technology
        </h1>
        <p className="text-responsive-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Empowering the next generation of tech innovators with cutting-edge education and real-world expertise
        </p>
      </div>

      {/* Main Content Card */}
      <Card className={`p-6 sm:p-8 lg:p-12 mb-12 lg:mb-16 glass-enhanced hover-lift ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h2 className="subheading-responsive text-secondary mb-4">
              Our Mission
            </h2>
            <p className="text-responsive-sm text-gray-300 leading-relaxed mb-6">
              Code i Technology is a leading institution dedicated to providing high-quality education 
              in the field of computer science and technology. Our mission is to empower students with 
              the skills and knowledge needed to succeed in the ever-evolving tech industry.
            </p>
            <p className="text-responsive-sm text-gray-300 leading-relaxed">
              We offer a wide range of courses, from beginner to advanced levels, taught by experienced 
              instructors who are experts in their fields. Our curriculum is constantly updated to 
              reflect the latest industry standards and emerging technologies.
            </p>
          </div>
          
          <div className="relative">
            <div className="glass-card p-6 sm:p-8 text-center hover-lift">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl sm:text-3xl">
                🎯
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Industry-Focused Learning
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Curriculum designed by industry experts to meet current market demands
              </p>
            </div>
          </div>
        </div>
      </Card>

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
  );
};

export default About;