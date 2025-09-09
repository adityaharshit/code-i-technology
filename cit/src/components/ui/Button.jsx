// Enhanced Futuristic Button Component
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  fullWidth = false,
  glow = false,
  holographic = false,
  neural = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'relative font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 active:scale-98 overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-electric-400 hover:to-cyber-400 text-white shadow-glow hover:shadow-glow-lg focus:ring-electric-500/50',
    secondary: 'bg-gradient-to-r from-quantum-600 to-quantum-700 hover:from-quantum-500 hover:to-quantum-600 text-white shadow-quantum focus:ring-quantum-500/50',
    outline: 'border-2 border-electric-500 text-electric-400 hover:bg-electric-500 hover:text-white hover:shadow-glow focus:ring-electric-500/50 backdrop-blur-sm bg-space-900/20',
    ghost: 'text-gray-300 hover:text-white hover:bg-quantum-800/50 focus:ring-quantum-500/50 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg shadow-red-500/30 focus:ring-red-500/50',
    success: 'bg-gradient-to-r from-matrix-500 to-matrix-600 hover:from-matrix-400 hover:to-matrix-500 text-white shadow-glow-green focus:ring-matrix-500/50',
    neural: 'bg-gradient-to-r from-neural-500 to-neural-600 hover:from-neural-400 hover:to-neural-500 text-white shadow-neural focus:ring-neural-500/50',
    cyber: 'bg-gradient-to-r from-cyber-600 to-cyber-700 hover:from-cyber-500 hover:to-cyber-600 text-white shadow-glow-purple focus:ring-cyber-500/50'
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base sm:px-8 sm:py-3',
    lg: 'px-8 py-3.5 text-lg sm:px-10 sm:py-4',
    xl: 'px-10 py-4 text-xl sm:px-12 sm:py-5'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const glowEffect = glow ? '' : '';
  const holographicEffect = holographic ? 'animate-hologram' : '';
  const neuralEffect = neural ? 'animate-neural-pulse' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${glowEffect} ${holographicEffect} ${neuralEffect} ${className}`;
  
  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      
      {/* Neural network pattern overlay for neural variant */}
      {neural && (
        <div className="absolute inset-0 bg-neural-network opacity-20" />
      )}
      
      {/* Holographic scan line */}
      {holographic && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scan-line" />
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            <span className="hidden sm:inline">Processing...</span>
          </div>
        ) : (
          children
        )}
      </span>
      
      {/* Glow effect for enhanced variants */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-500/20 to-cyber-500/20 blur-xl  -z-10" />
      )}
    </button>
  );
};

export default Button;

