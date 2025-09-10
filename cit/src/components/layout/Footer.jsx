// Enhanced Futuristic Footer
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, Zap, Code, Users, Award } from 'lucide-react';
import logo from "../../images/logo.png";

const Footer = () => {
  const socialLinks = [
        {
      name: 'Instagram',
      href: 'https://www.instagram.com/codeitechnology',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' }
  ];

  return (
    <footer className="relative bg-space-900/95 backdrop-blur-xl border-t border-electric-500/20 mt-auto overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500 to-transparent animate-energy-flow"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Code className="absolute top-10 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <Zap className="absolute top-20 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <Users className="absolute bottom-20 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Award className="absolute bottom-10 right-10 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-5 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          
          {/* Enhanced Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="Code i Technology Logo"
                  className="h-10 sm:h-12 w-auto transition-all duration-300 group-hover:brightness-125 relative z-10"
                />
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-electric-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 " />
              </div>
              
            </Link>
            
            <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed max-w-md">
              Empowering students with{' '}
              <span className="text-electric-400 font-semibold">cutting-edge technology</span>{' '}
              education and hands-on learning experiences that prepare them for{' '}
              <span className="text-cyber-400 font-semibold">successful careers</span> in tech.
            </p>
            
            
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6 bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-gray-300 hover:text-electric-400 transition-all duration-300"
                  >
                    <div className="w-1 h-1 bg-electric-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Support Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6 bg-gradient-to-r from-cyber-400 to-matrix-500 bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group flex items-center space-x-2 text-sm sm:text-base text-gray-300 hover:text-cyber-400 transition-all duration-300"
                  >
                    <div className="w-1 h-1 bg-cyber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6 bg-gradient-to-r from-matrix-400 to-neural-500 bg-clip-text text-transparent">
              Contact Info
            </h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-quantum-800/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-electric-500/20 group-hover:bg-electric-500/30 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-electric-400" />
                </div>
                <a 
                  href="mailto:infocodeitechnology@gmail.com" 
                  className="text-gray-300 hover:text-electric-400 transition-colors duration-300"
                >
                  infocodeitechnology@gmail.com
                </a>
              </div>
              
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-quantum-800/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-cyber-500/20 group-hover:bg-cyber-500/30 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-cyber-400" />
                </div>
                <a 
                  href="tel:+917004554075" 
                  className="text-gray-300 hover:text-cyber-400 transition-colors duration-300"
                >
                  +91 7004554075
                </a>
              </div>
              
              <div className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-quantum-800/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-matrix-500/20 group-hover:bg-matrix-500/30 transition-colors duration-300 mt-0.5">
                  <MapPin className="w-4 h-4 text-matrix-400" />
                </div>
                <address className="not-italic leading-relaxed text-gray-300 group-hover:text-matrix-400 transition-colors duration-300">
                  Aman & Akash Complex,<br />
                  Sinha College More<br />
                  Aurangabad Bihar - 824101
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Footer */}
        <div className="border-t border-electric-500/20 pt-8 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-electric-500 to-transparent animate-energy-flow" />
          <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-cyber-500 to-transparent animate-energy-flow" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
              © {new Date().getFullYear()}{' '}
              <span className="bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent font-semibold">
                Code i Technology
              </span>
              . All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                <span>in India</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">by</span>
                <span className="bg-gradient-to-r from-electric-400 to-cyber-500 bg-clip-text text-transparent font-semibold">
                  Harshit Aditya
                </span>
                <div className="w-1 h-1 bg-electric-400 rounded-full " />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
