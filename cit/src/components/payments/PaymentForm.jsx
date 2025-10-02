// cit/src/components/payments/PaymentForm.jsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { paymentsAPI } from '../../services/payments';
import { validatePayment } from '../../utils/validators';
import Button from '../ui/Button';
import PaymentSummary from './PaymentSummary';
import { UploadCloud, Calendar, CreditCard, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../ui/Input';

const PaymentForm = ({ course }) => {
  const { values, errors, isSubmitting, handleChange, setValues } = useForm(
    {
      months: 1,
      modeOfPayment: 'online',
      paymentProof: null,
      amountToPay: 0,
      amountSelection: "payByMonths"
    },
    validatePayment
  );

  const [isDisabled, setIsDisabled] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should not exceed 5MB.');
        e.target.value = null; // Clear the input
        setValues(prev => ({ ...prev, paymentProof: null }));
        return;
      }
      setValues(prev => ({ ...prev, paymentProof: file }));
    }
  };

  const handlePaymentChange = (e) =>{
    const paymentAmount = parseInt(e.target.value, 10) || 0;
    if(paymentAmount<0 || paymentAmount > course.remainingAmount){
      setIsDisabled(true)
    }
    setValues(prev => ({...prev, amountToPay: paymentAmount}))
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    const totalAmount = course.duration*course.feePerMonth;
    if(values.amountToPay > course.remainingAmount || values.amountToPay < 0){ 
      toast.error("Invalid amount");
      return;
    }
    formData.append('courseId', course.id);
    formData.append('modeOfPayment', values.modeOfPayment);
    if (values.paymentProof) {
      formData.append('paymentProof', values.paymentProof);
    }
    // formData.append('amountToPay', values.amountToPay);
    
    let calculatedDiscount = 0;
    let calculatedAmount = 0;
    // Safely handle discount percentage, defaulting to 0 if it's not a valid number
    const actualDiscountPercentage = Number(course.discountPercentage) || 0;

    // Apply discount only if paying for the full course duration in one go
    if(values.amountSelection === "payByMonths"){
       calculatedAmount = course.feePerMonth * values.months;
      if (values.months === course.courseDuration && actualDiscountPercentage > 0) {
        calculatedDiscount = calculatedAmount * (actualDiscountPercentage / 100);
      }
    }else{
      calculatedAmount = parseInt(values.amountToPay) || 0;
      if(calculatedAmount == totalAmount && actualDiscountPercentage > 0){
        calculatedDiscount = calculatedAmount * (actualDiscountPercentage / 100);
      }
    }
    
    const calculatedNetPayable = calculatedAmount - calculatedDiscount;



    if(values.amountSelection=== "partialPayment"){
      let months = 0;
      if(values.amountToPay == course.remainingAmount){
        months = monthsRemaining;
      }else{
        months = Math.floor(values.amountToPay / course.feePerMonth);
      }
      formData.append('months', months);
      
    }else{
      formData.append('months', values.months);
    }
    formData.append('amount', calculatedAmount);
    formData.append('netPayable', calculatedNetPayable);
    formData.append('discount', calculatedDiscount);
    formData.append('remainingAmount', course.remainingAmount);
    if(calculatedAmount > course.remainingAmount){
      toast.error("Amount to be paid can not be greater than remaining amount");
      return;
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
    <div className="space-y-6 sm:space-y-8">
      {/* Course Info Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 sm:p-6 text-white animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold">{course.title}</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm opacity-90">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Duration: {course.duration} months</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle size={14} />
                <span>Paid: {monthsPaid} months</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Remaining: {monthsRemaining} months</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Fee per month</p>
            <p className="text-xl sm:text-2xl font-bold">₹{course.feePerMonth}</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6 sm:space-y-8">
        {/* Payment Options */}
        <div className="glass-card p-4 sm:p-6 rounded-xl animate-fade-in-up animate-delay-100">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <CreditCard className="mr-2 text-secondary" size={20} />
            Payment Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

            <div className="space-y-2">
              <label htmlFor="modeOfPayment" className="block text-sm font-medium text-gray-300">
                Mode of Payment
              </label>
              <select
                id="modeOfPayment"
                name="modeOfPayment"
                value={values.modeOfPayment}
                onChange={handleChange}
                className="input-field w-full hover-glow transition-all duration-200"
              >
                <option value="online" className="bg-gray-800">Online Payment</option>
                <option value="offline" className="bg-gray-800">Offline Payment</option>
              </select>
              <p className="text-xs text-gray-500">
                {values.modeOfPayment === 'online' 
                  ? 'Pay using QR code and upload proof'
                  : 'Pay at institute and upload receipt'
                }
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="amountSelection" className="block text-sm font-medium text-gray-300">
                Amount selection
              </label>
              <select
                id="amountSelection"
                name="amountSelection"
                value={values.amountSelection}
                onChange={handleChange}
                className="input-field w-full hover-glow transition-all duration-200"
              >
                <option value="payByMonths" className="bg-gray-800">Pay by Months</option>
                <option value="partialPayment" className="bg-gray-800">Partial payment</option>
              </select>
              <p className="text-xs text-gray-500">
                {values.amountSelection === 'payByMonths' 
                  ? 'Select the number of months to pay for'
                  : 'Enter the amount to be paid in textbox'
                }
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="months" className="block text-sm font-medium text-gray-300">
                Number of Months to Pay
              </label>
              <select
                id="months"
                name="months"
                value={values.months}
                onChange={handleMonthsChange}
                className="input-field w-full hover-glow transition-all duration-200"
                disabled={(monthsRemaining <= 0) || (values.amountSelection === "partialPayment")}
              >
                {monthsRemaining > 0 ? (
                  monthOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option className="bg-gray-800">Fully Paid</option>
                )}
              </select>
              {monthsRemaining <= 0 && (
                <p className="text-xs text-green-400 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  Course fully paid!
                </p>
              )}
            </div>
            
            
            <div className="space-y-2">
              <Input 
                id="amountToPay" 
                name="amountToPay" 
                value={values.amountToPay} 
                onChange={handlePaymentChange} 
                label={"Amount to Pay"} 
                disabled = {(values.amountSelection === "payByMonths")}
              />
              <p className="text-xs text-gray-500">
                Remaining Amount: {course.remainingAmount}
              </p>
            </div>

          </div>
        </div>
        
        {/* Payment Summary */}
        <div className="animate-fade-in-up animate-delay-100">
          <PaymentSummary
            feePerMonth={course.feePerMonth}
            months={parseInt(values.months, 10)}
            courseDuration={course.duration} 
            discountPercentage={course.discountPercentage}
            amountSelection = {values.amountSelection}
            amountToPay = {values.amountToPay}
            remainingAmount = {course.remainingAmount}
          />
        </div>

        {/* QR Code Section for Online Payments */}
        {values.modeOfPayment === 'online' && (
          <div className="glass-card p-4 sm:p-6 rounded-xl animate-fade-in-up animate-delay-100">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
              <CreditCard className="mr-2 text-secondary" size={20} />
              Complete Your Payment
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* QR Code */}
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    Scan QR Code to Pay
                  </h4>
                  <p className="text-sm text-gray-400">
                    Use any UPI app to scan and pay
                  </p>
                </div>
                
                {course.qrCodeUrl ? (
                  <div className="relative inline-block">
                    <div className="p-4 bg-white rounded-xl shadow-lg animate-pulse-glow">
                      <img 
                        src={course.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain rounded-lg"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-gray-600 rounded-xl">
                    <p className="text-ternary1 text-sm sm:text-base">
                      QR Code is not available for this course.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Please contact administration.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Upload Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-semibold text-white">
                    Upload Payment Proof
                  </h4>
                  <p className="text-sm text-gray-400">
                    Take a screenshot of your successful payment
                  </p>
                </div>
                
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 sm:p-6 hover:border-secondary transition-colors duration-200">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                      <UploadCloud className="text-gray-400" size={24} />
                    </div>
                    
                    <div className="space-y-2">
                      <label 
                        htmlFor="paymentProof" 
                        className="cursor-pointer bg-secondary hover:bg-opacity-90 text-white font-medium py-3 px-4 sm:px-6 rounded-lg inline-flex items-center transition-all duration-200 hover-lift"
                      >
                        <UploadCloud className="mr-2" size={18}/>
                        <span className="text-sm sm:text-base">
                          {values.paymentProof ? values.paymentProof.name : 'Choose Screenshot'}
                        </span>
                        <input 
                          id="paymentProof" 
                          name="paymentProof" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange} 
                          accept="image/*,application/pdf" 
                        />
                      </label>
                      
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>
                    
                    {values.paymentProof && (
                      <div className="p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">File selected successfully</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {errors.paymentProof && (
                  <p className="text-ternary1 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.paymentProof}
                  </p>
                )}
                
                {/* Payment Instructions */}
                <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                  <h5 className="text-sm font-semibold text-blue-400 mb-2">
                    Payment Instructions:
                  </h5>
                  <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Scan the QR code with any UPI app</li>
                    <li>Enter the exact amount shown in summary</li>
                    <li>Complete the payment</li>
                    <li>Take a screenshot of success page</li>
                    <li>Upload the screenshot above</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offline Payment Instructions */}
        {values.modeOfPayment === 'offline' && (
          <div className="glass-card p-4 sm:p-6 rounded-xl animate-fade-in-up animate-delay-100">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CreditCard className="mr-2 text-secondary" size={20} />
              Offline Payment Instructions
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
                <h5 className="text-sm font-semibold text-yellow-400 mb-2">
                  How to pay offline:
                </h5>
                <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Visit the institute's accounts office</li>
                  <li>Make payment at the designated counter</li>
                  <li>Collect your payment receipt</li>
                  <li>Upload a clear photo of the receipt</li>
                </ol>
              </div>
              
              
              
              {errors.paymentProof && (
                <p className="text-ternary1 text-sm">{errors.paymentProof}</p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up animate-delay-100">
          <Button 
            type="submit" 
            loading={isSubmitting} 
            className="flex-1 sm:flex-initial btn-hover-lift text-base sm:text-lg py-3 px-6 sm:px-8" 
            size="lg"
            disabled={isDisabled}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Payment'}
          </Button>
          
          <Button 
            type="button"
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-initial text-base sm:text-lg py-3 px-6 sm:px-8"
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
