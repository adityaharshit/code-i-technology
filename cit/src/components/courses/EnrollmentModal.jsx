import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const EnrollmentModal = ({ isOpen, onClose, onConfirm, course, loading }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Confirm Enrollment</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to enroll in the course <strong className="text-secondary">{course?.title}</strong>?
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
          >
            <CheckCircle size={16} className="mr-2" />
            Yes, Enroll
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EnrollmentModal;
