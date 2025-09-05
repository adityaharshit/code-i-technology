import React, { useMemo } from 'react';
import { calculatePayment, formatCurrency } from '../../utils/formatters';

const PaymentSummary = ({ feePerMonth, months, courseDuration }) => {
  const { amount, discount, netPayable } = useMemo(
    () => calculatePayment(feePerMonth, months, courseDuration),
    [feePerMonth, months, courseDuration]
  );

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Payment Summary</h3>
      <div className="flex justify-between items-center text-gray-300">
        <span>Fee ({months} month{months > 1 ? 's' : ''})</span>
        <span className="font-medium">{formatCurrency(amount)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between items-center text-green-400">
          <span>Full Payment Discount</span>
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
