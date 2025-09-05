import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Button from '../ui/Button';
import { formatCurrency, formatDate, formatAddress } from '../../utils/formatters';

const InvoiceTemplate = ({ transaction, student, course }) => {
  const componentRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${transaction.billNo}`,
  });

  // Automatically trigger print when component mounts, if needed
  // useEffect(() => {
  //   handlePrint();
  // }, [handlePrint]);

  return (
    <div>
      <div ref={componentRef} className="p-8 bg-white text-gray-900">
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-primary mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Code i Technology</h1>
            <p>123 Education Street, Tech City - 700001</p>
            <p>info@codeitechnology.com | +91 9876543210</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold uppercase text-gray-600">Invoice</h2>
            <p><span className="font-semibold">Bill No:</span> {transaction.billNo}</p>
            <p><span className="font-semibold">Date:</span> {formatDate(transaction.createdAt)}</p>
          </div>
        </div>
        
        {/* Student & Payment Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Bill To</h3>
            <p className="font-bold text-lg">{student.fullName}</p>
            <p>{formatAddress(student.localAddress)}</p>
            <p>{student.email}</p>
            <p>Roll No: {student.rollNumber}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Payment Details</h3>
            <p><span className="font-semibold">Mode:</span> {transaction.modeOfPayment}</p>
            <p><span className="font-semibold">Status:</span> 
              <span className="font-bold text-green-600"> {transaction.status.toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 text-left">Course Name</th>
              <th className="p-3 text-center">Months Paid</th>
              <th className="p-3 text-right">Fee</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">{course.title}</td>
              <td className="p-3 text-center">{transaction.months}</td>
              <td className="p-3 text-right">{formatCurrency(course.feePerMonth)}/mo</td>
              <td className="p-3 text-right">{formatCurrency(transaction.amount)}</td>
            </tr>
          </tbody>
        </table>
        
        {/* Totals */}
        <div className="flex justify-end mb-8">
            <div className="w-1/2">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
                </div>
                {transaction.discount > 0 && (
                     <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold">-{formatCurrency(transaction.discount)}</span>
                    </div>
                )}
                <div className="border-t border-gray-300 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Net Payable</span>
                    <span>{formatCurrency(transaction.netPayable)}</span>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 border-t pt-6">
            <h4 className="font-bold mb-2">Terms & Conditions</h4>
            <p>Fee once paid is non-refundable/non-transferable.</p>
            <p>Classes start the next working day after the demo class.</p>
            <p className="mt-4 font-semibold">Thank you for your business!</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Button onClick={handlePrint}>Print Invoice</Button>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
