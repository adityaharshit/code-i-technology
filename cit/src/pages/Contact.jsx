import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      content: 'info@codeitech.com',
      subtitle: 'We\'ll respond within 24 hours',
      delay: 'animate-delay-100'
    },
    {
      icon: '📞',
      title: 'Call Us',
      content: '+91 9876543210',
      subtitle: 'Mon-Fri, 9AM-6PM IST',
      delay: 'animate-delay-200'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      content: '123 Tech Street',
      subtitle: 'Innovation City, IN 560001',
      delay: 'animate-delay-300'
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: '💼', link: '#' },
    { name: 'Twitter', icon: '🐦', link: '#' },
    { name: 'Facebook', icon: '📘', link: '#' },
    { name: 'Instagram', icon: '📸', link: '#' }
  ];

  const faqs = [
    {
      question: "What courses do you offer?",
      answer: "We offer a wide range of courses including Web Development, Data Science, Mobile App Development, and more."
    },
    {
      question: "Do you provide placement assistance?",
      answer: "Yes, we have a dedicated placement team that helps students with job preparation and connecting with industry partners."
    },
    {
      question: "Are the courses suitable for beginners?",
      answer: "Absolutely! Our courses are designed for all skill levels, from complete beginners to advanced learners."
    }
  ];

  return (
    <div className="responsive-container section-spacing">
      {/* Hero Section */}
      <div className={`text-center mb-12 lg:mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h1 className="heading-responsive text-gradient-blue mb-4 lg:mb-6">
          Get in Touch
        </h1>
        <p className="text-responsive-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Have questions about our courses or need guidance? We're here to help you on your learning journey.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className={`grid-responsive-1 mb-12 lg:mb-16 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
        {contactInfo.map((info, index) => (
          <Card 
            key={index}
            className={`p-6 sm:p-8 glass-interactive text-center hover-lift ${isVisible ? `animate-scale-in ${info.delay}` : 'opacity-0'}`}
          >
            <div className="text-3xl sm:text-4xl mb-4">
              {info.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {info.title}
            </h3>
            <p className="text-base sm:text-lg text-secondary font-medium mb-1">
              {info.content}
            </p>
            <p className="text-sm text-gray-400">
              {info.subtitle}
            </p>
          </Card>
        ))}
      </div>

      {/* Main Content - Contact Form and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
        {/* Contact Form */}
        <Card className={`p-6 sm:p-8 glass-enhanced hover-lift ${isVisible ? 'animate-fade-in-left animate-delay-400' : 'opacity-0'}`}>
          <h2 className="subheading-responsive text-white mb-6">
            Send us a Message
          </h2>
          <p className="text-responsive-sm text-gray-400 mb-6">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="form-layout-mobile">
            <Input
              label="Your Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
            
            <Input
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
            />
            
            <div>
              <label className="form-label-responsive">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                className="form-input-responsive h-32 sm:h-40 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full hover-lift animate-pulse-glow"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>

        {/* Additional Information */}
        <div className={`space-y-8 ${isVisible ? 'animate-fade-in-right animate-delay-600' : 'opacity-0'}`}>
          {/* Office Hours */}
          <Card className="p-6 sm:p-8 glass-interactive hover-lift">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
              Office Hours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monday - Friday</span>
                <span className="text-secondary font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Saturday</span>
                <span className="text-secondary font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Sunday</span>
                <span className="text-gray-500">Closed</span>
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card className="p-6 sm:p-8 glass-interactive hover-lift">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
              Follow Us
            </h3>
            <p className="text-gray-400 mb-6">
              Stay connected and get the latest updates on courses and tech trends.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-all duration-200 hover-lift group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {social.icon}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </Card>

          {/* Quick Info */}
          <Card className="p-6 sm:p-8 glass-interactive hover-lift">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
              Quick Response
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <div>
                  <p className="text-white font-medium">Fast Response</p>
                  <p className="text-gray-400 text-sm">We typically respond within 2-4 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 text-xl">💬</span>
                <div>
                  <p className="text-white font-medium">Live Chat Available</p>
                  <p className="text-gray-400 text-sm">Chat with our team during business hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-400 text-xl">📋</span>
                <div>
                  <p className="text-white font-medium">Course Counseling</p>
                  <p className="text-gray-400 text-sm">Get personalized course recommendations</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className={`p-6 sm:p-8 glass-enhanced ${isVisible ? 'animate-fade-in-up animate-delay-800' : 'opacity-0'}`}>
        <h2 className="subheading-responsive text-center text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-lg font-semibold text-secondary">
                {faq.question}
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contact */}
      <div className={`text-center mt-12 ${isVisible ? 'animate-fade-in-up animate-delay-1000' : 'opacity-0'}`}>
        <Card className="p-6 sm:p-8 glass-interactive inline-block">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-400 mb-4">
            For urgent queries, call us directly
          </p>
          <a 
            href="tel:+919876543210"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-secondary to-primary text-white px-6 py-3 rounded-lg hover-lift font-medium transition-all duration-200"
          >
            <span>📞</span>
            <span>+91 9876543210</span>
          </a>
        </Card>
      </div>
    </div>
  );
};

export default Contact;