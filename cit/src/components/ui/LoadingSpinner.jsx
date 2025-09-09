import React from 'react';

const LoadingSpinner = ({ size = 'md', variant = 'primary', text = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  const variants = {
    primary: 'border-electric-500',
    secondary: 'border-cyber-500',
    matrix: 'border-matrix-500',
    neural: 'border-neural-500'
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      {/* Enhanced spinner with multiple rings */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`animate-spin rounded-full ${sizes[size]} border-2 border-transparent border-t-electric-500 border-r-cyber-500`} />
        
        {/* Middle ring */}
        <div className={`absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-matrix-500 border-l-neural-500`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        
        {/* Inner ring */}
        <div className={`absolute inset-4 animate-spin rounded-full border-2 border-transparent border-t-quantum-500`} style={{ animationDuration: '0.8s' }} />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-electric-400 rounded-full " />
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-500/20 to-cyber-500/20 blur-lg " />
      </div>
      
      {/* Loading text */}
      {text && (
        <div className="text-center">
          <p className="text-gray-300 text-sm font-medium animate-pulse">
            {text}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-electric-400 rounded-full " style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-cyber-400 rounded-full " style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-matrix-400 rounded-full " style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;