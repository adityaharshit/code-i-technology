// cit/src/components/admin/UserDetailModal.jsx
import React from 'react';
import Modal from '../ui/Modal';
import { formatDate, formatAddress } from '../../utils/formatters';

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex items-start space-x-4 mb-6">
          <img 
            src={user.photoUrl || `https://placehold.co/80x80/003049/FDF0D5?text=${user.fullName.charAt(0)}`} 
            alt={user.fullName}
            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-600"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
            <p className="text-sm text-gray-400 font-mono">{user.rollNumber}</p>
            <p className="text-sm text-secondary">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Personal Details */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Personal Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p className="text-gray-400">Father's Name:</p><p className="text-white">{user.fatherName}</p>
              <p className="text-gray-400">Student Mobile:</p><p className="text-white">{user.studentMobile}</p>
              <p className="text-gray-400">Parent Mobile:</p><p className="text-white">{user.parentMobile}</p>
              <p className="text-gray-400">DOB:</p><p className="text-white">{formatDate(user.dob)}</p>
              <p className="text-gray-400">Gender:</p><p className="text-white">{user.gender}</p>
              <p className="text-gray-400">Blood Group:</p><p className="text-white">{user.bloodGroup}</p>
              <p className="text-gray-400">Qualification:</p><p className="text-white">{user.qualification}</p>
              <p className="text-gray-400">College:</p><p className="text-white">{user.collegeName}</p>
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-gray-800 p-4 rounded-lg">
             <h3 className="text-lg font-semibold text-white mb-2">Addresses</h3>
             <div className="text-sm space-y-2">
                <div>
                    <p className="font-semibold text-gray-400">Permanent Address:</p>
                    <p className="text-white">{formatAddress(user.permanentAddress)}</p>
                </div>
                 <div>
                    <p className="font-semibold text-gray-400">Local Address:</p>
                    <p className="text-white">{formatAddress(user.localAddress)}</p>
                </div>
             </div>
          </div>
          
          {/* Enrolled Courses */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Enrolled Courses</h3>
            {user.enrollments && user.enrollments.length > 0 ? (
              <ul className="space-y-2">
                {user.enrollments.map((enrollment, index) => (
                  <li key={index} className="flex justify-between items-center text-sm p-2 bg-gray-900 rounded">
                    <span className="text-white font-medium">{enrollment.courseTitle}</span>
                    <span className="text-gray-400">
                      Paid: {enrollment.monthsPaid} / {enrollment.courseDuration} months
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Not enrolled in any courses.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;
