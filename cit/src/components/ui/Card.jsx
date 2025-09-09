import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  glow = false,
  neural = false,
  holographic = false,
  interactive = false,
  ...props 
}) => {
  const baseClasses = "relative rounded-2xl transition-all duration-500 ease-out overflow-hidden group";
  
  const variants = {
    default: "bg-quantum-900/60 backdrop-blur-lg border border-quantum-700/50",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    neural: "bg-gradient-to-br from-neural-900/40 to-space-900/60 backdrop-blur-lg border border-neural-600/30",
    cyber: "bg-gradient-to-br from-cyber-900/40 to-space-900/60 backdrop-blur-lg border border-cyber-600/30",
    matrix: "bg-gradient-to-br from-matrix-900/40 to-space-900/60 backdrop-blur-lg border border-matrix-600/30",
    electric: "bg-gradient-to-br from-electric-900/40 to-space-900/60 backdrop-blur-lg border border-electric-600/30",
    quantum: "bg-gradient-to-br from-quantum-800/50 to-quantum-900/70 backdrop-blur-lg border border-quantum-600/40",
    hologram: "bg-gradient-to-br from-electric-900/30 to-cyber-900/30 backdrop-blur-xl border border-electric-500/20",
    solid: "bg-space-800 border border-quantum-700",
    gradient: "bg-gradient-to-br from-space-800 to-space-900 border border-quantum-600",
  };
  
  const hoverEffects = hover ? "hover:scale-102 hover:shadow-2xl hover:-translate-y-2" : "";
  const glowEffect = glow ? "shadow-glow hover:shadow-glow-lg" : "";
  const neuralEffect = neural ? "animate-neural-pulse" : "";
  const holographicEffect = holographic ? "animate-hologram" : "";
  const interactiveEffect = interactive ? "cursor-pointer hover:border-electric-500/50" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverEffects} ${glowEffect} ${neuralEffect} ${holographicEffect} ${interactiveEffect} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {/* Neural network pattern overlay */}
      {neural && (
        <div className="absolute inset-0 bg-neural-network opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
      )}
      
      {/* Circuit pattern overlay */}
      {variant === 'cyber' && (
        <div className="absolute inset-0 bg-circuit-pattern opacity-20 animate-circuit-flow" />
      )}
      
      {/* Holographic scan lines
      {holographic && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-500/10 to-transparent animate-scan-line" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-500/5 to-transparent" />
        </>
      )} */}
      
      {/* Interactive glow effect */}
      {interactive && (
        <div className="absolute inset-0 bg-gradient-to-br from-electric-500/0 to-cyber-500/0 group-hover:from-electric-500/10 group-hover:to-cyber-500/10 transition-all duration-500 rounded-2xl" />
      )}
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Enhanced glow effect */}
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric-500/10 to-cyber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      )}
    </div>
  );
};

export default Card;