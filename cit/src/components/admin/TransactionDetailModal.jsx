// cit/src/components/admin/TransactionDetailModal.jsx
import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { XCircle, CheckCircle, Download, Calendar, User, CreditCard, DollarSign } from 'lucide-react';
import { paymentsAPI } from '../../services/payments';
import toast from 'react-hot-toast';

const TransactionDetailModal = ({ isOpen, onClose, transaction, onStatusUpdate }) => {
  if (!isOpen) return null;

  const handleDownloadInvoice = async (e) => {
    e.stopPropagation(); 
    
    try {
      const response = await paymentsAPI.getInvoice(transaction.tid);
      const invoiceHTML = response.data;
      
      const printWindow = window.open('', '_blank', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.focus();
      } else {
        toast.error('Please allow pop-ups to view the invoice.');
      }
    } catch (error) {
      toast.error('Failed to generate invoice.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-500 bg-opacity-20';
      case 'pending approval':
        return 'text-yellow-400 bg-yellow-500 bg-opacity-20';
      case 'rejected':
        return 'text-red-400 bg-red-500 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-500 bg-opacity-20';
    }
  };

  const getPaymentModeIcon = (mode) => {
    return mode === 'online' ? <CreditCard className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="animate-fade-in-down">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Transaction Details</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs sm:text-sm text-gray-400 font-mono">Bill No: {transaction.billNo}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="border-t border-gray-700 pt-4 sm:pt-6 animate-fade-in-up animate-delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Info */}
            <div className="glass-card p-4 sm:p-6 animate-fade-in-left animate-delay-200">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-5 h-5 text-secondary" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Student Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Name</p>
                  <p className="text-sm sm:text-base text-white font-medium">{transaction.student?.fullName}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Roll Number</p>
                  <p className="text-sm sm:text-base text-white font-mono">{transaction.student?.rollNumber}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Course</p>
                  <p className="text-sm sm:text-base text-white">{transaction.course?.title}</p>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="glass-card p-4 sm:p-6 animate-fade-in-right animate-delay-300">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-5 h-5 text-secondary" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Transaction Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Date</p>
                  <p className="text-sm sm:text-base text-white">{formatDate(transaction.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Payment Mode</p>
                  <div className="flex items-center space-x-2">
                    {getPaymentModeIcon(transaction.modeOfPayment)}
                    <p className="text-sm sm:text-base text-white capitalize">{transaction.modeOfPayment}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">Amount Paid</p>
                  <p className="text-lg sm:text-xl text-white font-bold">{formatCurrency(transaction.netPayable)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Proof */}
        {transaction.modeOfPayment === 'online' && transaction.paymentProofUrl && (
          <div className="border-t border-gray-700 pt-4 sm:pt-6 animate-fade-in-up animate-delay-400">
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Payment Proof</h3>
              <div className="flex justify-center">
                <a 
                  href={transaction.paymentProofUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover-scale transition-transform duration-300"
                >
                  <img 
                    src={transaction.paymentProofUrl} 
                    alt="Payment Proof" 
                    className="rounded-lg max-h-40 sm:max-h-60 w-auto mx-auto border border-gray-600 hover:border-secondary transition-colors duration-300"
                  />
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="border-t border-gray-700 pt-4 sm:pt-6 animate-fade-in-up animate-delay-500">
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            {transaction.status === 'paid' && (
              <Button 
                variant="outline" 
                onClick={handleDownloadInvoice}
                className="w-full sm:w-auto hover-lift"
              >
                <Download size={16} className="mr-2" />
                Download Invoice
              </Button>
            )}
            {transaction.status === 'pending approval' && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={() => onStatusUpdate(transaction.tid, 'rejected')}
                  className="w-full sm:w-auto hover-lift order-2 sm:order-1"
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => onStatusUpdate(transaction.tid, 'paid')}
                  className="w-full sm:w-auto hover-lift order-1 sm:order-2"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;