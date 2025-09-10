// cit/src/components/ui/Modal.jsx
import React, { useRef } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const Modal = React.memo(({ isOpen, onClose, children, className = "" }) => {
  const modalRef = useRef(null);
  
  // Custom hook that closes the modal when a click is detected outside of the modalRef element
  useOnClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  return (
    // This is the full-screen backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      {/* This is the modal panel itself */}
      <div
        ref={modalRef} // We attach the ref here
        className={`bg-dark-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 text-2xl leading-none"
          type="button"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
