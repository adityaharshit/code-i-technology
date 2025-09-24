// /cit/src/AppRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const Payment = lazy(() => import('./pages/Payment'));
const Profile = lazy(() => import('./pages/Profile'));
const Transactions = lazy(() => import('./pages/Transactions'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCourseDetail = lazy(() => import('./pages/AdminCourseDetail'));
const AddEditCourse = lazy(() => import('./components/admin/AddEditCourse'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/payment/:courseId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses/:id" element={<ProtectedRoute adminOnly={true}><AdminCourseDetail /></ProtectedRoute>} />
          <Route path="/admin/course/add" element={<ProtectedRoute adminOnly={true}><AddEditCourse /></ProtectedRoute>} />
          <Route path="/admin/course/edit/:id" element={<ProtectedRoute adminOnly={true}><AddEditCourse /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;