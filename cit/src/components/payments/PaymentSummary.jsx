// cit/src/components/payments/PaymentSummary.jsx
import React, { useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Calculator, Tag, CreditCard, TrendingDown } from 'lucide-react';

const PaymentSummary = ({ feePerMonth, months, courseDuration, discountPercentage, amountSelection, amountToPay, remainingAmount }) => {
  const { amount, discount, netPayable } = useMemo(() => {
    const totalAmount = feePerMonth*courseDuration;
    let calculatedDiscount = 0;
    let calculatedAmount = 0;
    // Safely handle discount percentage, defaulting to 0 if it's not a valid number
    const actualDiscountPercentage = Number(discountPercentage) || 0;

    // Apply discount only if paying for the full course duration in one go
    if(amountSelection === "payByMonths"){
       calculatedAmount = feePerMonth * months;
      if (months === courseDuration && actualDiscountPercentage > 0) {
        calculatedDiscount = calculatedAmount * (actualDiscountPercentage / 100);
      }
    }else{
      calculatedAmount = parseInt(amountToPay) || 0;
      if(amountToPay == totalAmount && actualDiscountPercentage > 0){
        calculatedDiscount = parseInt(amountToPay) * (actualDiscountPercentage / 100);
      }
    }
    
    const calculatedNetPayable = calculatedAmount - calculatedDiscount;

    return { 
        amount: calculatedAmount, 
        discount: calculatedDiscount, 
        netPayable: calculatedNetPayable 
    };
  }, [feePerMonth, months, courseDuration, discountPercentage, amountSelection, amountToPay, remainingAmount]);

  return (
    <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-700 space-y-4 sm:space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
          <Calculator className="mr-2 sm:mr-3 text-secondary" size={20} />
          Payment Summary
        </h3>
        {months === courseDuration && discountPercentage > 0 && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-green-900/20 border border-green-400/30 rounded-full">
            <Tag size={12} className="text-green-400" />
            <span className="text-xs font-medium text-green-400">Full Payment Discount</span>
          </div>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Base Amount */}
        

        {(amountSelection==="partialPayment") ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <CreditCard size={16} className="text-blue-400 flex-shrink-0" />
            <div>
              <span className="text-gray-300 font-medium">
                Entered Amount
              </span>
              <div className="text-xs text-gray-500 sm:hidden">
                ₹{feePerMonth} × {months}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-white text-base sm:text-lg">
              {formatCurrency(amount)}
            </div>
            
          </div>
        </div>
        ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <CreditCard size={16} className="text-blue-400 flex-shrink-0" />
            <div>
              <span className="text-gray-300 font-medium">
                Monthly Fee × {months} month{months > 1 ? 's' : ''}
              </span>
              <div className="text-xs text-gray-500 sm:hidden">
                ₹{feePerMonth} × {months}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-white text-base sm:text-lg">
              {formatCurrency(amount)}
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              ₹{feePerMonth} × {months}
            </div>
          </div>
        </div>
        )}

        {/* Discount Row */}
        {discount > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-green-900/10 border border-green-400/20 rounded-lg animate-fade-in-up animate-delay-200">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <TrendingDown size={16} className="text-green-400 flex-shrink-0" />
              <div>
                <span className="text-green-300 font-medium">
                  Full Payment Discount ({discountPercentage}%)
                </span>
                <div className="text-xs text-green-500 sm:hidden">
                  You saved ₹{discount.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-400 text-base sm:text-lg">
                -{formatCurrency(discount)}
              </div>
              <div className="text-xs text-green-500 hidden sm:block">
                You saved ₹{discount.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-gray-600 my-3 sm:my-4"></div>

        {/* Final Amount */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-secondary/30 animate-pulse-glow">
          <div className="flex items-center space-x-2 mb-3 sm:mb-0">
            <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-white font-bold text-base sm:text-lg lg:text-xl">
              Total Amount Payable
            </span>
          </div>
          <div className="text-right">
            <div className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
              {formatCurrency(netPayable)}
            </div>
            {discount > 0 && (
              <div className="text-xs sm:text-sm text-green-400 font-medium">
                Saved: {formatCurrency(discount)}
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/10 border border-blue-400/20 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="text-center sm:text-left">
              <p className="text-gray-400">Payment for</p>
              <p className="font-semibold text-white">
                {months} month{months > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Per month</p>
              <p className="font-semibold text-white">
                {formatCurrency(feePerMonth)}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-400">Effective rate</p>
              <p className="font-semibold text-white">
                {formatCurrency(netPayable / months)}
              </p>
            </div>
          </div>
        </div>

        {/* Special Offers */}
        {months < courseDuration && discountPercentage > 0 && (
          <div className="mt-4 p-3 sm:p-4 bg-yellow-900/10 border border-yellow-400/20 rounded-lg animate-fade-in-up animate-delay-300">
            <div className="flex items-start space-x-2">
              <Tag size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-300 font-medium text-sm">
                  💡 Save {discountPercentage}% with full payment!
                </p>
                <p className="text-yellow-500 text-xs mt-1">
                  Pay for all {courseDuration} months at once and save {formatCurrency((feePerMonth * courseDuration * discountPercentage) / 100)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;