// cit/src/components/payments/PaymentForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { paymentsAPI } from '../../services/payments';
import { validatePayment } from '../../utils/validators';
import Button from '../ui/Button';
import PaymentSummary from './PaymentSummary';
import { UploadCloud } from 'lucide-react';

const PaymentForm = ({ course }) => {
  const { values, errors, isSubmitting, handleChange, setValues } = useForm(
    {
      months: 1,
      modeOfPayment: 'online',
      paymentProof: null,
    },
    validatePayment
  );

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const monthsPaid = course.monthsPaid || 0;
  const monthsRemaining = course.duration - monthsPaid;

  const monthOptions = Array.from({ length: monthsRemaining }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} month${i > 0 ? 's' : ''}`
  }));

  const handleMonthsChange = (e) => {
    let newMonths = parseInt(e.target.value, 10);
    if (isNaN(newMonths) || newMonths < 1) {
      newMonths = 1;
    } else if (newMonths > monthsRemaining) {
      newMonths = monthsRemaining;
    }
    setValues(prev => ({ ...prev, months: newMonths }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('courseId', course.id);
    formData.append('months', values.months);
    formData.append('modeOfPayment', values.modeOfPayment);
    
    if (values.modeOfPayment === 'online' && values.paymentProof) {
      formData.append('paymentProof', values.paymentProof);
    }

    try {
      await paymentsAPI.create(formData);
      showSuccess('Payment submitted for approval!');
      navigate('/transactions');
    } catch (error) {
      showError(error.response?.data?.error || 'Payment submission failed.');
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="months" className="block text-sm font-medium text-gray-300 mb-1">
            Number of Months to Pay
          </label>
          <select
            id="months"
            name="months"
            value={values.months}
            onChange={handleMonthsChange}
            className="input-field"
            disabled={monthsRemaining <= 0}
          >
            {monthsRemaining > 0 ? (
              monthOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))
            ) : (
              <option>Fully Paid</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="modeOfPayment" className="block text-sm font-medium text-gray-300 mb-1">
            Mode of Payment
          </label>
          <select
            id="modeOfPayment"
            name="modeOfPayment"
            value={values.modeOfPayment}
            onChange={handleChange}
            className="input-field"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>
      
      <PaymentSummary
        feePerMonth={course.feePerMonth}
        months={parseInt(values.months, 10)}
        courseDuration={course.duration} 
        discountPercentage={course.discountPercentage} 
      />

      {values.modeOfPayment === 'online' && (
        <div className="text-center p-4 border border-dashed border-gray-600 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Pay via QR Code</h3>
          <p className="text-gray-400 text-sm mb-4">Scan the QR code below and upload a screenshot of your payment.</p>
          {course.qrCodeUrl ? (
            <img src={course.qrCodeUrl} alt="QR Code" className="mx-auto my-4 w-48 h-48 object-contain rounded-md" />
          ) : (
            <p className="text-ternary1">QR Code is not available for this course.</p>
          )}
          <div className="mt-4">
             <label htmlFor="paymentProof" className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center">
              <UploadCloud className="mr-2" size={18}/>
              <span>{values.paymentProof ? values.paymentProof.name : 'Upload Screenshot'}</span>
              <input id="paymentProof" name="paymentProof" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
            </label>
            {errors.paymentProof && <p className="text-ternary1 text-sm mt-2">{errors.paymentProof}</p>}
          </div>
        </div>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg" disabled={monthsRemaining <= 0}>
        Submit Payment
      </Button>
    </form>
  );
};

export default PaymentForm;

