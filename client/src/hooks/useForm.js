import { useState, useCallback } from 'react';

const useForm = (initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;

    setValues(prevValues => ({
      ...prevValues,
      [name]: val
    }));
  }, []);

  const handleSubmit = useCallback(async (event, callback) => {
    event.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await callback();
      } catch (apiError) {
        // Handle API errors if necessary
      }
    }
    setIsSubmitting(false);
  }, [values, validate]);
  
  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
  },[initialState])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useForm;