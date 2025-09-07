import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  glow = false,
  ...props 
}) => {
  const baseClasses = "rounded-xl transition-all duration-300 ease-out";
  
  const variants = {
    default: "bg-gray-800 bg-opacity-60 backdrop-blur-sm border border-gray-700",
    glass: "bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-20",
    solid: "bg-gray-800 border border-gray-700",
    gradient: "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600",
  };
  
  const hoverEffects = hover ? "hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1" : "";
  const glowEffect = glow ? "shadow-lg shadow-blue-500/20" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverEffects} ${glowEffect} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;