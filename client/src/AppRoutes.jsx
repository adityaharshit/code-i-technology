import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import Contact from './pages/Contact';
import About from './pages/About';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user?.type !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />

      <Route
        path="/dashboard"
        element={<PrivateRoute><Dashboard /></PrivateRoute>}
      />
      <Route
        path="/my-courses"
        element={<PrivateRoute><MyCourses /></PrivateRoute>}
      />
      <Route
        path="/payment/:courseId"
        element={<PrivateRoute><Payment /></PrivateRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute><Profile /></PrivateRoute>}
      />
      <Route
        path="/transactions"
        element={<PrivateRoute><Transactions /></PrivateRoute>}
      />
      <Route
        path="/admin-dashboard"
        element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>}
      />
    </Routes>
  );
};

export default AppRoutes;