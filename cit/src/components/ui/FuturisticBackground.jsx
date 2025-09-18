import React, { useEffect, useRef, useState } from 'react';

const FuturisticBackground = ({ variant = 'default', intensity = 'medium' }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef();
  const particlesRef = useRef([]);

  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth <= 1024 || 
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    setIsMobile(checkMobile());
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsMobile(checkMobile());
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles based on variant
    const initParticles = () => {
      // Reduce particle count on mobile/low-power devices
      const isLowPower = isMobile || (navigator.deviceMemory && navigator.deviceMemory < 2);
      const particleCount = isLowPower ? 20 : intensity === 'low' ? 30 : intensity === 'high' ? 80 : 50;
      
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          hue: variant === 'neural' ? 25 : variant === 'matrix' ? 120 : 200,
          connections: []
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > dimensions.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
        particle.y = Math.max(0, Math.min(dimensions.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();

        // Find and draw connections
        particle.connections = [];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );

          if (distance < 120) {
            particle.connections.push(other);
            
            // Draw connection line
            const opacity = (120 - distance) / 120 * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    };

    let frameCount = 0;
    const frameSkip = isMobile ? 1 : 0; // Skip every other frame on mobile
    
    const animate = () => {
      frameCount++;
      
      if (frameSkip === 0 || frameCount % (frameSkip + 1) === 0) {
        drawParticles();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, variant, intensity, isMobile]);

  const getBackgroundClass = () => {
    switch (variant) {
      case 'neural':
        return 'bg-gradient-to-br from-space-900 via-neural-900/20 to-space-900';
      case 'cyber':
        return 'bg-gradient-to-br from-space-900 via-cyber-900/20 to-space-900';
      case 'quantum':
        return 'bg-gradient-to-br from-space-900 via-quantum-900/20 to-space-900';
      default:
        return 'bg-gradient-to-br from-space-900 via-electric-900/20 to-space-900';
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 ${getBackgroundClass()} animate-quantum-shift`} />
      
      {/* Neural network pattern */}
      <div className="absolute inset-0 bg-neural-network opacity-10" />
      
      {/* Particle system canvas - disable blend mode on mobile */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none gpu-accelerated"
        style={{ 
          mixBlendMode: isMobile ? 'normal' : 'screen',
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Floating code elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-electric-500/20 font-mono text-sm animate-particle-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {['Java', 'MySQL', 'CSS', 'C', 'C++', 'HTML' ,'JavaScript'][i]}
          </div>
        ))}
      </div>
      
      {/* Holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-electric-500/5 to-transparent animate-hologram pointer-events-none" />
    </div>
  );
};

export default FuturisticBackground;