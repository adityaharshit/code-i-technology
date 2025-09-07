// cit/src/components/admin/UserDetailModal.jsx
import React from 'react';
import Modal from '../ui/Modal';
import { formatDate, formatAddress } from '../../utils/formatters';
import { User, Phone, Mail, MapPin, Calendar, Book, GraduationCap, Heart, Building } from 'lucide-react';

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const InfoCard = ({ icon: Icon, title, children, delay = "0" }) => (
    <div className={`glass-card p-4 sm:p-6 animate-fade-in-up animate-delay-${delay}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-secondary bg-opacity-20">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header with Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 animate-fade-in-down">
          <div className="relative group">
            <img 
              src={user.photoUrl || `https://placehold.co/100x100/003049/FDF0D5?text=${user.fullName.charAt(0)}`} 
              alt={user.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-gray-600 group-hover:border-secondary transition-colors duration-300 hover-scale"
            />
            <div className="absolute inset-0 bg-secondary bg-opacity-20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{user.fullName}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <p className="text-sm text-gray-400 font-mono flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" />
                {user.rollNumber}
              </p>
              <p className="text-sm text-secondary flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {user.email}
              </p>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Details */}
          <InfoCard icon={User} title="Personal Details" delay="100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Qualification</p>
                  <p className="text-white">{user.qualification || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">College</p>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2 text-purple-400" />
                    <p className="text-white">{user.collegeName || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Address Details */}
          <InfoCard icon={MapPin} title="Address Information" delay="200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-2">Permanent Address</p>
                  <div className="glass-subtle p-3 rounded-lg">
                    <p className="text-white text-sm leading-relaxed">
                      {formatAddress(user.permanentAddress) || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-2">Local Address</p>
                  <div className="glass-subtle p-3 rounded-lg">
                    <p className="text-white text-sm leading-relaxed">
                      {formatAddress(user.localAddress) || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
          
          {/* Enrolled Courses */}
          <InfoCard icon={Book} title="Enrolled Courses" delay="300">
            {user.enrollments && user.enrollments.length > 0 ? (
              <div className="space-y-3">
                {user.enrollments.map((enrollment, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-subtle rounded-lg hover-lift transition-all duration-300"
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <h4 className="text-white font-medium text-sm sm:text-base">{enrollment.courseTitle}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400">
                          Duration: {enrollment.courseDuration} months
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Payment Progress</p>
                        <p className="text-sm font-medium text-white">
                          {enrollment.monthsPaid} / {enrollment.courseDuration} months
                        </p>
                      </div>
                      <div className="w-16 sm:w-20">
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(enrollment.monthsPaid / enrollment.courseDuration) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Book className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400">Not enrolled in any courses yet.</p>
              </div>
            )}
          </InfoCard>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;