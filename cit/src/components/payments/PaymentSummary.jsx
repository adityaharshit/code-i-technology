// cit/src/components/payments/PaymentSummary.jsx
import React, { useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';

const PaymentSummary = ({ feePerMonth, months, courseDuration, discountPercentage }) => {
  const { amount, discount, netPayable } = useMemo(() => {
    const calculatedAmount = feePerMonth * months;
    let calculatedDiscount = 0;

    // Safely handle discount percentage, defaulting to 0 if it's not a valid number
    const actualDiscountPercentage = Number(discountPercentage) || 0;

    // Apply discount only if paying for the full course duration in one go
    if (months === courseDuration && actualDiscountPercentage > 0) {
      calculatedDiscount = calculatedAmount * (actualDiscountPercentage / 100);
    }
    
    const calculatedNetPayable = calculatedAmount - calculatedDiscount;

    return { 
        amount: calculatedAmount, 
        discount: calculatedDiscount, 
        netPayable: calculatedNetPayable 
    };
  }, [feePerMonth, months, courseDuration, discountPercentage]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Payment Summary</h3>
      <div className="flex justify-between items-center text-gray-300">
        <span>Fee ({months} month{months > 1 ? 's' : ''})</span>
        <span className="font-medium">{formatCurrency(amount)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between items-center text-green-400">
          <span>Full Payment Discount ({discountPercentage}%)</span>
          <span className="font-medium">-{formatCurrency(discount)}</span>
        </div>
      )}
      <div className="border-t border-gray-600 my-2"></div>
      <div className="flex justify-between items-center text-white text-lg font-bold">
        <span>Net Payable Amount</span>
        <span>{formatCurrency(netPayable)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;

