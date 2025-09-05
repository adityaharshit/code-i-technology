import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`input-field ${error ? 'border-ternary1 focus:ring-ternary1' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-ternary1 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;