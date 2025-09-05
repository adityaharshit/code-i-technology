import React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { X, AlertTriangle, CheckCircle, Info, Bell } from 'lucide-react';

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1E293B', // dark-800
          color: '#F8FAFC', // slate-50
          border: '1px solid #334155', // dark-700
          borderRadius: '8px',
          padding: '16px',
        },
        success: {
          icon: <CheckCircle className="text-green-400" />,
          style: {
            borderColor: '#4ADE80', // green-400
          },
        },
        error: {
          icon: <AlertTriangle className="text-red-400" />,
          style: {
            borderColor: '#F87171', // red-400
          },
        },
        loading: {
          icon: <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary"></div>,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              <div className="flex-1 mx-4 text-sm font-medium">{message}</div>
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default CustomToaster;
