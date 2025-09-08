import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className={`text-responsive-3xl font-bold mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
            }`}>
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-glow">
                Code i Technology
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className={`text-responsive-lg text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100 animate-delay-200' : 'opacity-0'
            }`}>
              Empowering the next generation of developers with cutting-edge technology education 
              and hands-on learning experiences that shape the future.
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100 animate-delay-400' : 'opacity-0'
            }`}>
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" glow className="w-full sm:w-auto">
                      Get Started Today
                    </Button>
                  </Link>
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explore Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" glow className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle animate-delay-1000 hidden md:block"></div>
        <div className="absolute top-1/3 right-8 w-3 h-3 bg-blue-400 rounded-full animate-bounce-slow animate-delay-700 hidden md:block"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse animate-delay-500 hidden lg:block"></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-blue-600 rounded-full animate-bounce-slow animate-delay-300 hidden lg:block"></div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100 animate-delay-600' : 'opacity-0'
          }`}>
            <h2 className="text-responsive-2xl font-bold mb-4 sm:mb-6">
              Why Choose <span className="text-blue-400">CIT</span>?
            </h2>
            <p className="text-responsive-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive learning experiences with industry-relevant curriculum 
              and expert instructors who care about your success.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience and proven expertise.',
                icon: '👨‍🏫',
                delay: '800'
              },
              {
                title: 'Hands-on Projects',
                description: 'Build impressive real-world projects that enhance your portfolio and showcase your skills.',
                icon: '💻',
                delay: '1000'
              },
              {
                title: 'Career Support',
                description: 'Get personalized guidance for interviews, and accelerated career growth.',
                icon: '🎯',
                delay: '1200'
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                variant="glass" 
                className={`text-center p-6 sm:p-8 lg:p-10 hover-lift transition-all duration-1000 ${
                  isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 animate-bounce-slow">
                  {feature.icon}
                </div>
                <h3 className="text-responsive-lg font-semibold mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-responsive-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '500+', label: 'Students Enrolled', delay: '1400' },
              { number: '50+', label: 'Expert Instructors', delay: '1600' },
              { number: '100+', label: 'Courses Available', delay: '1800' },
              { number: '95%', label: 'Success Rate', delay: '2000' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-1000 ${
                  isVisible ? 'animate-scale-in opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-responsive-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100 animate-delay-2200' : 'opacity-0'
          }`}>
            <h2 className="text-responsive-2xl font-bold mb-4 sm:mb-6">
              What Our <span className="text-blue-400">Students Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Full Stack Developer',
                content: 'CIT transformed my career completely. The hands-on approach and expert guidance helped me land my dream job.',
                delay: '2400'
              },
              {
                name: 'Mike Chen',
                role: 'Software Engineer',
                content: 'The instructors are amazing and the curriculum is perfectly designed for real-world applications.',
                delay: '2600'
              },
              {
                name: 'Emily Davis',
                role: 'Frontend Developer',
                content: 'I went from zero coding knowledge to building full applications in just 6 months. Highly recommended!',
                delay: '2800'
              }
            ].map((testimonial, index) => (
              <Card 
                key={index}
                variant="glass"
                className={`p-6 sm:p-8 hover-lift transition-all duration-1000 ${
                  isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${testimonial.delay}ms` }}
              >
                <div className="mb-4 sm:mb-6">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-responsive-sm text-gray-300 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-responsive-xs text-blue-400">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card 
            variant="gradient" 
            glow
            className={`max-w-5xl mx-auto p-8 sm:p-12 lg:p-16 text-center transition-all duration-1000 ${
              isVisible ? 'animate-scale-in opacity-100 animate-delay-3000' : 'opacity-0'
            }`}
          >
            <h2 className="text-responsive-2xl font-bold mb-4 sm:mb-6">
              Ready to Start Your <span className="text-blue-400">Coding Journey</span>?
            </h2>
            <p className="text-responsive-lg text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of students who have transformed their careers with our comprehensive courses 
              and expert guidance. Your future starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link to={isAuthenticated ? "/courses" : "/register"} className="w-full sm:w-auto">
                <Button size="xl" glow className="w-full sm:w-auto">
                  {isAuthenticated ? "Browse Courses" : "Enroll Now"}
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    View Demo
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )};

export default Home;