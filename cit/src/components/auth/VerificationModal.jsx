import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { MailCheck } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-4">
        <MailCheck size={56} className="mx-auto text-green-400 mb-6 animate-bounce-slow" />
        <h2 className="text-2xl font-bold text-white mb-3">Registration Successful!</h2>
        <p className="text-gray-400 mb-8">
          We've sent a verification link to your email address. Please check your inbox (and spam folder) to activate your account.
        </p>
        
        <Button
          onClick={handleLoginRedirect}
          className="w-full"
        >
          Proceed to Login
        </Button>
      </div>
    </Modal>
  );
};

export default VerificationModal;
