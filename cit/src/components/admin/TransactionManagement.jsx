// cit/src/components/admin/TransactionManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '../../services/payments';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import TransactionDetailModal from './TransactionDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ManualInvoiceModal from './ManualInvoiceModal';
import { Search, Filter, TrendingUp, AlertCircle, CheckCircle, Clock, XCircle, FilePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import useDebounce from '../../hooks/useDebounce';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isManualInvoiceOpen, setIsManualInvoiceOpen] = useState(false);
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
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30';
      case 'pending approval':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500 border-opacity-30';
      case 'rejected':
        return 'bg-red-500 bg-opacity-20 text-red-400 border-red-500 border-opacity-30';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500 border-opacity-30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending approval':
        return <Clock className="w-3 h-3" />;
      case 'rejected':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStats = () => {
    const total = transactions.length;
    const paid = transactions.filter(t => t.status === 'paid').length;
    const pending = transactions.filter(t => t.status === 'pending approval').length;
    const rejected = transactions.filter(t => t.status === 'rejected').length;
    
    return { total, paid, pending, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white animate-fade-in-down">Transaction Management</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1 animate-fade-in-down animate-delay-100">
            Monitor and manage payment transactions
          </p>
        </div>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="animate-fade-in-down">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Transaction Management</h2>
        <p className="text-sm sm:text-base text-gray-400">Monitor and manage payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up animate-delay-100">
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-2">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-400">Total</div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.paid}</div>
            <div className="text-xs sm:text-sm text-gray-400">Paid</div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-2">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-400">Pending</div>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 text-center glass-card hover-lift">
          <div className="flex flex-col items-center space-y-2">
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.rejected}</div>
            <div className="text-xs sm:text-sm text-gray-400">Rejected</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-fade-in-up animate-delay-200">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white text-sm sm:text-base w-full sm:w-auto min-w-[160px] appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending approval">Pending</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <Button onClick={() => setIsManualInvoiceOpen(true)} className="hover-scale">
            <FilePlus size={16} className="mr-2" />
            Create Manual Invoice
        </Button>
      </div>

      {error && (
        <Card className="p-4 sm:p-6 bg-red-500 bg-opacity-20 border border-red-400 animate-fade-in-up animate-delay-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        </Card>
      )}

      {/* Desktop Table */}
      <Card className="p-0 hidden lg:block animate-fade-in-up animate-delay-400 glass-enhanced">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Student</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Course</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Amount</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction.tid} 
                  className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer transition-all duration-200 hover-lift-subtle" 
                  onClick={() => setSelectedTransaction(transaction)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-6 text-gray-400 text-sm animate-fade-in-left">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="py-4 px-6 animate-fade-in-left animate-delay-100">
                    <div>
                      <p className="text-white font-semibold text-sm">{transaction.student?.fullName}</p>
                      <p className="text-gray-400 text-xs font-mono">{transaction.billNo}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white text-sm animate-fade-in-left animate-delay-200">
                    {transaction.course?.title}
                  </td>
                  <td className="py-4 px-6 text-white font-semibold text-sm animate-fade-in-left animate-delay-300">
                    {formatCurrency(transaction.netPayable)}
                  </td>
                  <td className="py-4 px-6 animate-fade-in-left animate-delay-400">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span>{transaction.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-base">No transactions found for the selected filters.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 animate-fade-in-up animate-delay-400">
        {transactions.map((transaction, index) => (
          <Card 
            key={transaction.tid}
            className="p-4 glass-card hover-lift cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedTransaction(transaction)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{transaction.student?.fullName}</h3>
                <p className="text-gray-400 text-xs font-mono">{transaction.billNo}</p>
                <p className="text-gray-400 text-xs mt-1">{transaction.course?.title}</p>
              </div>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(transaction.status)}`}>
                {getStatusIcon(transaction.status)}
                <span>{transaction.status}</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{formatDate(transaction.createdAt)}</span>
              <span className="text-white font-semibold">{formatCurrency(transaction.netPayable)}</span>
            </div>
          </Card>
        ))}
        {transactions.length === 0 && (
          <Card className="p-8 text-center glass-card">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-400">No transactions found for the selected filters.</p>
          </Card>
        )}
      </div>
      
      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onStatusUpdate={handleStatusUpdate}
      />
      <ManualInvoiceModal
        isOpen={isManualInvoiceOpen}
        onClose={() => setIsManualInvoiceOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default TransactionManagement;