import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Code, Cpu, Zap, Users, BookOpen, Trophy } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Code i Technology';

  useEffect(() => {
    setIsVisible(true);
    
    // Typing animation for the main title
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating Tech Icons */}
            <div className="absolute inset-0 pointer-events-none">
              <Code className="absolute top-20 left-10 w-8 h-8 text-electric-500/30 animate-float" style={{ animationDelay: '0s' }} />
              <Cpu className="absolute top-32 right-16 w-6 h-6 text-cyber-500/30 animate-float" style={{ animationDelay: '2s' }} />
              <Zap className="absolute bottom-40 left-20 w-10 h-10 text-matrix-500/30 animate-float" style={{ animationDelay: '4s' }} />
              <BookOpen className="absolute top-40 right-32 w-7 h-7 text-neural-500/30 animate-float" style={{ animationDelay: '1s' }} />
            </div>

            {/* Main Heading with Typing Effect */}
            <div className={`transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 md:mb-8">
                Welcome to{' '}
                <span className="block mt-2 bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
            </div>
            
            {/* Subtitle with Enhanced Styling */}
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100 animate-delay-200' : 'opacity-0'
            }`}>
              Empowering the next generation of developers with{' '}
              <span className="text-electric-400 font-semibold">cutting-edge technology</span> education 
              and hands-on learning experiences that{' '}
              <span className="text-cyber-400 font-semibold">shape the future</span>.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-1000 ${
              isVisible ? 'animate-fade-in-up opacity-100 animate-delay-400' : 'opacity-0'
            }`}>
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Zap className="w-5 h-5 mr-2" />
                      Get Started Today
                    </Button>
                  </Link>
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Explore Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" glow neural className="w-full sm:w-auto">
                    <Cpu className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-3 h-3 bg-electric-500 rounded-full animate-neural-pulse hidden md:block" />
        <div className="absolute top-1/3 right-8 w-4 h-4 bg-cyber-400 rounded-full animate-float hidden md:block" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-matrix-300 rounded-full  hidden lg:block" />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-neural-600 rounded-full animate-particle-float hidden lg:block" />
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100 animate-delay-600' : 'opacity-0'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
                CIT
              </span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive learning experiences with industry-relevant curriculum 
              and expert instructors who care about your success.
            </p>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience and proven expertise.',
                icon: Users,
                color: 'electric',
                delay: '800'
              },
              {
                title: 'Hands-on Projects',
                description: 'Build impressive real-world projects that enhance your portfolio and showcase your skills.',
                icon: Code,
                color: 'cyber',
                delay: '1000'
              },
              {
                title: 'Career Support',
                description: 'Get personalized guidance for interviews, and accelerated career growth.',
                icon: Trophy,
                color: 'matrix',
                delay: '1200'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  variant={feature.color}
                  interactive
                  holographic
                  className={`text-center p-6 sm:p-8 lg:p-10 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/30 flex items-center justify-center animate-neural-pulse`}>
                      <IconComponent className={`w-8 h-8 text-${feature.color}-400`} />
                    </div>
                    {/* Floating particles around icon */}
                    <div className={`absolute -top-2 -right-2 w-2 h-2 bg-${feature.color}-400 rounded-full animate-particle-float`} />
                    <div className={`absolute -bottom-1 -left-1 w-1 h-1 bg-${feature.color}-300 rounded-full animate-float`} />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-display font-semibold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="hologram" className="p-8 sm:p-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { number: '150+', label: 'Students Enrolled', color: 'electric', delay: '1400' },
                { number: '5+', label: 'Expert Instructors', color: 'cyber', delay: '1600' },
                { number: '100+', label: 'Courses Available', color: 'matrix', delay: '1800' },
                { number: '95%', label: 'Success Rate', color: 'neural', delay: '2000' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center group transition-all duration-1000 ${
                    isVisible ? 'animate-scale-in opacity-100' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${stat.delay}ms` }}
                >
                  {/* Animated number with glow effect */}
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-${stat.color}-400 mb-2 group-hover: transition-all duration-300`}>
                    {stat.number}
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="w-full h-1 bg-quantum-800 rounded-full mb-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 rounded-full animate-energy-flow`}
                      style={{ 
                        width: '100%',
                        animationDelay: `${stat.delay}ms`
                      }}
                    />
                  </div>
                  
                  <div className="text-sm sm:text-base text-gray-300 font-medium">
                    {stat.label}
                  </div>
                  
                  {/* Floating indicator */}
                  <div className={`w-2 h-2 bg-${stat.color}-400 rounded-full mx-auto mt-2 animate-neural-pulse`} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100 animate-delay-2200' : 'opacity-0'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-matrix-400 to-electric-500 bg-clip-text text-transparent">
                Students Say
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-electric-500 to-cyber-500 mx-auto rounded-full animate-energy-flow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Full Stack Developer',
                content: 'CIT transformed my career completely. The hands-on approach and expert guidance helped me land my dream job.',
                avatar: 'SJ',
                color: 'electric',
                delay: '2400'
              },
              {
                name: 'Mike Chen',
                role: 'Software Engineer',
                content: 'The instructors are amazing and the curriculum is perfectly designed for real-world applications.',
                avatar: 'MC',
                color: 'cyber',
                delay: '2600'
              },
              {
                name: 'Emily Davis',
                role: 'Frontend Developer',
                content: 'I went from zero coding knowledge to building full applications in just 6 months. Highly recommended!',
                avatar: 'ED',
                color: 'matrix',
                delay: '2800'
              }
            ].map((testimonial, index) => (
              <Card 
                key={index}
                variant="neural"
                interactive
                holographic
                className={`p-6 sm:p-8 transition-all duration-1000 ${
                  isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${testimonial.delay}ms` }}
              >
                {/* Enhanced rating display */}
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full bg-gradient-to-r from-${testimonial.color}-400 to-${testimonial.color}-500 flex items-center justify-center mr-1 `}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <span className="text-white text-xs">★</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quote with enhanced styling */}
                  <div className="relative">
                    <div className={`absolute -top-2 -left-2 text-4xl text-${testimonial.color}-400/30 font-serif`}>"</div>
                    <p className="text-gray-300 italic leading-relaxed pl-6">
                      {testimonial.content}
                    </p>
                    <div className={`absolute -bottom-2 -right-2 text-4xl text-${testimonial.color}-400/30 font-serif rotate-180`}>"</div>
                  </div>
                </div>
                
                {/* Enhanced profile section */}
                <div className="border-t border-quantum-600/50 pt-6 flex items-center">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${testimonial.color}-500 to-${testimonial.color}-600 flex items-center justify-center mr-4 animate-neural-pulse`}>
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  
                  {/* Name and role */}
                  <div>
                    <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                    <div className={`text-${testimonial.color}-400 text-sm font-medium`}>{testimonial.role}</div>
                  </div>
                  
                  {/* Verification badge */}
                  <div className={`ml-auto w-6 h-6 rounded-full bg-${testimonial.color}-500 flex items-center justify-center`}>
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card 
            variant="hologram"
            
            
            className={`max-w-5xl mx-auto p-8 sm:p-12 lg:p-16 text-center transition-all duration-1000 relative overflow-hidden ${
              isVisible ? 'animate-scale-in opacity-100 animate-delay-3000' : 'opacity-0'
            }`}
          >
            {/* Animated background elements */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 via-cyber-500/10 to-matrix-500/10 animate-quantum-shift" />
             */}
            {/* Floating particles */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-electric-400 rounded-full animate-particle-float" />
            <div className="absolute top-20 right-16 w-3 h-3 bg-cyber-400 rounded-full animate-float" />
            <div className="absolute bottom-16 left-20 w-1 h-1 bg-matrix-400 rounded-full animate-neural-pulse" />
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-neural-400 rounded-full " />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 sm:mb-8">
                Ready to Start Your{' '}
                <span className="bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
                  Coding Journey
                </span>?
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of students who have transformed their careers with our comprehensive courses 
                and expert guidance.{' '}
                <span className="text-electric-400 font-semibold">Your future starts here.</span>
              </p>
              
              {/* Enhanced CTA buttons with icons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Link to={isAuthenticated ? "/courses" : "/register"} className="w-full sm:w-auto">
                  <Button size="xl" glow className="w-full sm:w-auto group">
                    <Zap className="w-6 h-6 mr-3" />
                    {isAuthenticated ? "Browse Courses" : "Enroll Now"}
                    <div className="ml-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto group">
                      <BookOpen className="w-6 h-6 mr-3 group-hover:" />
                      View Demo
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-quantum-600/30">
                <p className="text-sm text-gray-400 mb-4">Trusted by developers worldwide</p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-electric-400" />
                    <span className="text-sm">150+ Students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-cyber-400" />
                    <span className="text-sm">95% Success Rate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-matrix-400" />
                    <span className="text-sm">100+ Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;