import React from 'react';
import { paymentsAPI } from '../../services/payments';
import { generateInvoiceHTML } from '../../utils/invoiceGenerator';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatDate, formatPaymentStatus } from '../../utils/formatters';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Download, Info } from 'lucide-react';

const TransactionTable = ({ transactions, isLoading }) => {
  const { showError } = useToast();

  const handleDownloadInvoice = async (transaction) => {
    try {
      // The API now returns the full HTML content
      const response = await paymentsAPI.getInvoice(transaction.tid);
      const invoiceHTML = response.data;
      
      const printWindow = window.open('', '_blank', 'height=600,width=800');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();
    } catch (error) {
      showError('Failed to generate invoice. Please try again.');
      console.error('Invoice generation error:', error);
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
  
  if (isLoading) {
      return <div>Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-12 text-center flex flex-col items-center">
        <Info size={48} className="text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-white">No Transactions Found</h3>
        <p className="text-gray-400 mt-2">When you make a payment, it will appear here.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Bill No</th>
              <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Course</th>
              <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Date</th>
              <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Status</th>
              <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.tid} className="hover:bg-gray-800 transition-colors duration-200">
                <td className="p-4 font-mono text-sm text-gray-400">{transaction.billNo}</td>
                <td className="p-4 text-white font-medium">{transaction.course.title}</td>
                <td className="p-4 text-white font-semibold">{formatCurrency(transaction.netPayable)}</td>
                <td className="p-4 text-gray-400 text-sm">{formatDate(transaction.createdAt)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(transaction.status)}`}>
                    {formatPaymentStatus(transaction.status)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {transaction.status === 'paid' && (
                    <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(transaction)}>
                      <Download size={14} className="mr-2" />
                      Invoice
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionTable;
