// Global Loading Component for Long Operations
import React from 'react';
import { Zap, Activity, Shield } from 'lucide-react';

const GlobalLoader = ({ 
  message = 'Loading...', 
  submessage = 'Please wait while we process your request',
  variant = 'default',
  showProgress = false,
  progress = 0
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'auth':
        return {
          icon: Shield,
          gradient: 'from-electric-500 to-cyber-500',
          bgGradient: 'from-electric-500/10 to-cyber-500/10',
          borderColor: 'border-electric-500/30'
        };
      case 'database':
        return {
          icon: Activity,
          gradient: 'from-matrix-500 to-neural-500',
          bgGradient: 'from-matrix-500/10 to-neural-500/10',
          borderColor: 'border-matrix-500/30'
        };
      default:
        return {
          icon: Zap,
          gradient: 'from-electric-500 to-matrix-500',
          bgGradient: 'from-electric-500/10 to-matrix-500/10',
          borderColor: 'border-electric-500/30'
        };
    }
  };

  const { icon: Icon, gradient, bgGradient, borderColor } = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`bg-gradient-to-br ${bgGradient} border ${borderColor} rounded-2xl p-8 max-w-md mx-4 text-center animate-fade-in-up`}>
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center animate-neural-pulse shadow-glow`}>
            <Icon className="w-8 h-8 text-white animate-glow-pulse" />
          </div>
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-electric-400 rounded-full animate-particle-float" />
          <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-cyber-400 rounded-full animate-float" />
        </div>

        {/* Loading Message */}
        <div className="space-y-3">
          <h3 className="text-xl font-display font-bold text-white animate-fade-in-up animate-delay-200">
            {message}
          </h3>
          <p className="text-gray-300 text-sm animate-fade-in-up animate-delay-300">
            {submessage}
          </p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-6 space-y-2 animate-fade-in-up animate-delay-400">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500 animate-energy-flow`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mt-6 animate-fade-in-up animate-delay-500">
          <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cyber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-matrix-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Timeout Warning */}
        <div className="mt-4 text-xs text-gray-500 animate-fade-in-up animate-delay-600">
          This may take up to 60 seconds for large operations
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;