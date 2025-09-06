// cit/src/components/admin/TransactionManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '../../services/payments';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import TransactionDetailModal from './TransactionDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getAll(debouncedSearchTerm, statusFilter);
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await paymentsAPI.updateStatus(id, status);
      toast.success(`Transaction status updated to ${status}.`);
      fetchTransactions();
      setSelectedTransaction(null);
    } catch (error) {
      setError('Failed to update transaction status');
    }
  };

  const getStatusColor = (status) => {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="all">All Statuses</option>
            <option value="pending approval">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="w-full sm:w-auto sm:max-w-xs">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>


      {error && (
        <Card className="p-4 mb-6 bg-red-500 bg-opacity-20 border border-red-400">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-6 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.tid} className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer" onClick={() => setSelectedTransaction(transaction)}>
                  <td className="py-4 px-6 text-gray-400">{formatDate(transaction.createdAt)}</td>
                  <td className="py-4 px-6">
                    <p className="text-white font-semibold">{transaction.student?.fullName}</p>
                    <p className="text-gray-400 text-sm font-mono">{transaction.billNo}</p>
                  </td>
                  <td className="py-4 px-6 text-white font-semibold">{formatCurrency(transaction.netPayable)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && transactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
                <p>No transactions found for the selected filters.</p>
            </div>
          )}
        </div>
      </Card>
      
      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default TransactionManagement;

