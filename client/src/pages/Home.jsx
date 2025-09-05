import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Code i Technology
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-slide-up">
            Empowering the next generation of developers with cutting-edge technology education 
            and hands-on learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            {!isAuthenticated ? (
              <>
                <Link to="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg">Browse Courses</Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose CIT?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide comprehensive learning experiences with industry-relevant curriculum 
            and expert instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Expert Instructors',
              description: 'Learn from industry professionals with years of experience.',
              icon: '👨‍🏫'
            },
            {
              title: 'Hands-on Projects',
              description: 'Build real-world projects to enhance your portfolio.',
              icon: '💻'
            },
            {
              title: 'Career Support',
              description: 'Get guidance for job placements and career growth.',
              icon: '🎯'
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:scale-105 transition-transform duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <Card className="max-w-4xl mx-auto p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 mb-8">
            Join hundreds of students who have transformed their careers with our courses.
          </p>
          <Link to={isAuthenticated ? "/courses" : "/register"}>
            <Button size="lg">Enroll Now</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default Home;