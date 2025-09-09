// cit/src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FuturisticBackground from './components/ui/FuturisticBackground';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="text-white min-h-screen flex flex-col relative">
            {/* Futuristic animated background */}
            <FuturisticBackground variant="default" intensity="medium" />
            
            {/* Main app content */}
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
