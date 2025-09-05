import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../../services/payments';
import { generateInvoiceHTML } from '../../utils/invoiceGenerator';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatDate, formatPaymentStatus } from '../../utils/formatters';
import Button from '../ui/Button';
import { Download } from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const { showError } = useToast();
  const navigate = useNavigate();

  const handleDownloadInvoice = async () => {
    try {
      const response = await paymentsAPI.getInvoice(transaction.tid);
      const { transaction: txData, student, course } = response.data;
      
      const invoiceHTML = generateInvoiceHTML(txData, student, course);
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();
      // The print dialog will be triggered by the script in the invoice HTML
    } catch (error) {
      showError('Failed to download invoice. Please try again.');
      console.error('Invoice download error:', error);
    }
  };
  
  const getStatusClasses = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'pending approval':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  return (
    <tr className="border-t border-gray-700 hover:bg-gray-800 transition-colors">
      <td className="p-4 font-mono text-sm">{transaction.billNo}</td>
      <td className="p-4">{transaction.course.title}</td>
      <td className="p-4 font-semibold">{formatCurrency(transaction.netPayable)}</td>
      <td className="p-4 text-gray-400">{formatDate(transaction.createdAt)}</td>
      <td className="p-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(transaction.status)}`}>
          {formatPaymentStatus(transaction.status)}
        </span>
      </td>
      <td className="p-4">
        {transaction.status === 'paid' && (
          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download size={16} className="mr-2" />
            Invoice
          </Button>
        )}
      </td>
    </tr>
  );
};

export default TransactionItem;
