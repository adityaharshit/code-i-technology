module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Legacy colors (keeping for compatibility)
        primary: '#003049',
        secondary: '#669BBC',
        ternary1: '#C1121F',
        ternary2: '#780000',
        ternary3: '#FDF0D5',
        
        // New futuristic color system
        electric: {
          50: '#E6FAFF',
          100: '#CCF5FF',
          200: '#99EBFF',
          300: '#66E0FF',
          400: '#33D6FF',
          500: '#00D4FF', // Primary electric blue
          600: '#00A3CC',
          700: '#007299',
          800: '#004166',
          900: '#001033',
        },
        cyber: {
          50: '#F3F0FF',
          100: '#E7E0FF',
          200: '#CFC1FF',
          300: '#B7A2FF',
          400: '#9F83FF',
          500: '#8B5CF6', // Cyber purple
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        matrix: {
          50: '#E6FFF4',
          100: '#CCFFE9',
          200: '#99FFD3',
          300: '#66FFBD',
          400: '#33FFA7',
          500: '#00FF88', // Matrix green
          600: '#00CC6A',
          700: '#00994D',
          800: '#006633',
          900: '#003319',
        },
        neural: {
          50: '#FFF2E6',
          100: '#FFE5CC',
          200: '#FFCB99',
          300: '#FFB166',
          400: '#FF9733',
          500: '#FF6B35', // Neural orange
          600: '#CC562A',
          700: '#99401F',
          800: '#662B15',
          900: '#33150A',
        },
        quantum: {
          50: '#F0F4F8',
          100: '#E1E9F1',
          200: '#C3D3E3',
          300: '#A5BDD5',
          400: '#87A7C7',
          500: '#6991B9', // Quantum gray-blue
          600: '#547494',
          700: '#3F576F',
          800: '#2A3A4A',
          900: '#1E2A3A', // Deep quantum
        },
        space: {
          50: '#F2F4F7',
          100: '#E5E9EF',
          200: '#CBD3DF',
          300: '#B1BDCF',
          400: '#97A7BF',
          500: '#7D91AF',
          600: '#64748C',
          700: '#475569',
          800: '#334155',
          900: '#0A0E1A', // Deep space
        },
        dark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        }
      },
      fontFamily: {
        'sans': ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'hero-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        // Legacy animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        
        // New futuristic animations
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'circuit-flow': 'circuitFlow 8s ease-in-out infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
        'neural-pulse': 'neuralPulse 1.5s ease-in-out infinite',
        'data-stream': 'dataStream 4s linear infinite',
        'quantum-shift': 'quantumShift 10s ease-in-out infinite',
        'particle-float': 'particleFloat 8s ease-in-out infinite',
        'code-typing': 'codeTyping 4s steps(40) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'morph': 'morph 6s ease-in-out infinite',
        'scan-line': 'scanLine 2s linear infinite',
        'energy-flow': 'energyFlow 3s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
      },
      keyframes: {
        // Legacy keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        
        // New futuristic keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            filter: 'brightness(1)'
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)',
            filter: 'brightness(1.1)'
          },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        circuitFlow: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(90deg)'
          },
        },
        hologram: {
          '0%, 100%': { 
            opacity: '0.8',
            transform: 'scale(1) rotateX(0deg)',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.02) rotateX(1deg)',
            filter: 'hue-rotate(180deg)'
          },
        },
        neuralPulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '1'
          },
        },
        dataStream: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '50%': { 
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
        },
        quantumShift: {
          '0%, 100%': { 
            backgroundPosition: '0% 0%',
            filter: 'hue-rotate(0deg)'
          },
          '25%': { 
            backgroundPosition: '100% 0%',
            filter: 'hue-rotate(90deg)'
          },
          '50%': { 
            backgroundPosition: '100% 100%',
            filter: 'hue-rotate(180deg)'
          },
          '75%': { 
            backgroundPosition: '0% 100%',
            filter: 'hue-rotate(270deg)'
          },
        },
        particleFloat: {
          '0%, 100%': { 
            transform: 'translate(0px, 0px) rotate(0deg)',
            opacity: '0.4'
          },
          '33%': { 
            transform: 'translate(30px, -30px) rotate(120deg)',
            opacity: '0.8'
          },
          '66%': { 
            transform: 'translate(-20px, 20px) rotate(240deg)',
            opacity: '0.6'
          },
        },
        codeTyping: {
          '0%': { width: '0ch' },
          '50%': { width: '20ch' },
          '100%': { width: '0ch' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        morph: {
          '0%, 100%': { borderRadius: '20px' },
          '50%': { borderRadius: '50px' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        energyFlow: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            opacity: '0.5'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            opacity: '1'
          },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'circuit-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2300D4FF\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'neural-network': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"neural\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"1\" fill=\"%238B5CF6\" fill-opacity=\"0.2\"/%3E%3Cline x1=\"10\" y1=\"10\" x2=\"20\" y2=\"10\" stroke=\"%2300D4FF\" stroke-opacity=\"0.1\" stroke-width=\"0.5\"/%3E%3Cline x1=\"10\" y1=\"10\" x2=\"10\" y2=\"20\" stroke=\"%2300D4FF\" stroke-opacity=\"0.1\" stroke-width=\"0.5\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100\" height=\"100\" fill=\"url(%23neural)\"/%3E%3C/svg%3E')",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'neural': '0 10px 40px rgba(255, 107, 53, 0.2)',
        'quantum': '0 20px 60px rgba(105, 145, 185, 0.3)',
        'hologram': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 212, 255, 0.2)',
      },
      blur: {
        xs: '2px',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
    },
  },
  plugins: [],
}