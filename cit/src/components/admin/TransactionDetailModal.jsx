// cit/src/components/admin/TransactionDetailModal.jsx
import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { XCircle, CheckCircle, Download } from 'lucide-react';
import { paymentsAPI } from '../../services/payments';
import toast from 'react-hot-toast';

const TransactionDetailModal = ({ isOpen, onClose, transaction, onStatusUpdate }) => {
  if (!isOpen) return null;

  const handleDownloadInvoice = async (e) => {
    // Prevent the modal from closing when the button inside is clicked
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
      console.error('Invoice generation error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-400';
      case 'pending approval':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
          <p className="text-sm text-gray-400 font-mono">Bill No: {transaction.billNo}</p>
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-400">Student</p>
              <p className="text-white">{transaction.student?.fullName}</p>
              <p className="text-gray-500 font-mono">{transaction.student?.rollNumber}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-400">Course</p>
              <p className="text-white">{transaction.course?.title}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-400">Date</p>
              <p className="text-white">{formatDate(transaction.createdAt)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-400">Status</p>
              <p className={`font-bold capitalize ${getStatusColor(transaction.status)}`}>{transaction.status}</p>
            </div>
             <div>
              <p className="font-semibold text-gray-400">Payment Mode</p>
              <p className="text-white capitalize">{transaction.modeOfPayment}</p>
            </div>
             <div>
              <p className="font-semibold text-gray-400">Amount Paid</p>
              <p className="text-white font-bold text-lg">{formatCurrency(transaction.netPayable)}</p>
            </div>
          </div>
        </div>

        {transaction.modeOfPayment === 'online' && transaction.paymentProofUrl && (
          <div className="border-t border-gray-700 pt-4">
            <p className="font-semibold text-gray-400 mb-2">Payment Proof</p>
            <a href={transaction.paymentProofUrl} target="_blank" rel="noopener noreferrer">
              <img src={transaction.paymentProofUrl} alt="Payment Proof" className="rounded-lg max-h-60 w-auto mx-auto"/>
            </a>
          </div>
        )}
        
        {/* Actions */}
        <div className="border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-end gap-4">
            {transaction.status === 'paid' && (
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download size={16} className="mr-2" />
                Download Invoice
              </Button>
            )}
            {transaction.status === 'pending approval' && (
              <>
                <Button variant="secondary" onClick={() => onStatusUpdate(transaction.tid, 'rejected')}>
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
                <Button onClick={() => onStatusUpdate(transaction.tid, 'paid')}>
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
              </>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;

