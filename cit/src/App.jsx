// cit/src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext'; // Import the provider
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider> {/* Wrap the app in the provider */}
          <div className="bg-dark-900 text-white min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
            <Footer />
            {/* The Toaster component is now rendered inside ToastProvider, so we remove it from here */}
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
