import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../services/payments';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  Receipt, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const response = await paymentsAPI.getMyTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Could not fetch transaction history.');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleViewReceipt = async (tid) => {
    try {
      const response = await paymentsAPI.getInvoice(tid);
      const receiptHTML = response.data;
      
      const receiptWindow = window.open('', '_blank', 'height=800,width=800');
      receiptWindow.document.write(receiptHTML);
      receiptWindow.document.close();
      receiptWindow.focus();
    } catch (error) {
      console.error('Failed to open receipt:', error);
      toast.error('Failed to open receipt.');
    }
  };

  const handleRefresh = () => {
    fetchTransactions(true);
    toast.success('Transactions refreshed!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'failed':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1";
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterStatus === 'all') return true;
    return tx.status === filterStatus;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
    } else if (sortBy === 'amount-high') {
      return b.netPayable - a.netPayable;
    } else if (sortBy === 'amount-low') {
      return a.netPayable - b.netPayable;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in-up">
          <LoadingSpinner />
          <p className="text-gray-400 animate-pulse">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in-down">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-secondary to-primary rounded-full animate-pulse-glow">
              <Receipt className="text-white" size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white animate-fade-in-up animate-delay-200">
              My Transactions
            </h1>
            <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up animate-delay-300">
              View and manage your payment history
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up animate-delay-400">
          <Card className="glass-card p-4 sm:p-6 hover-lift">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-bold text-white">
                  {transactions.filter(t => t.status === 'paid').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="glass-card p-4 sm:p-6 hover-lift animate-delay-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-xl font-bold text-white">
                  {transactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="glass-card p-4 sm:p-6 hover-lift animate-delay-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-xl font-bold text-white">{transactions.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="glass-card p-4 sm:p-6 hover-lift animate-delay-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Receipt className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Paid</p>
                <p className="text-lg font-bold text-white">
                  ₹{transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.netPayable, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="glass-card p-4 sm:p-6 lg:p-8 animate-fade-in-up animate-delay-500">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <CreditCard className="mr-3 text-secondary" size={24} />
              Transaction History
            </h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field text-sm py-2 px-3 min-w-0"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-sm py-2 px-3 min-w-0"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
              
              {/* Refresh */}
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                loading={refreshing}
                className="whitespace-nowrap"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 font-medium text-gray-300">Course</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-300">Date</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-300">Amount</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((tx, index) => (
                  <tr 
                    key={tx.tid} 
                    className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{tx.course.title}</div>
                      <div className="text-sm text-gray-400">ID: {tx.tid}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {new Date(tx.createdAt || tx.date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white text-lg">₹{tx.netPayable}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(tx.status)}
                        <span className="capitalize font-medium text-white">{tx.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {tx.status === 'paid' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleViewReceipt(tx.tid)}
                          className="hover-lift"
                        >
                          <Eye size={14} className="mr-2" />
                          View Receipt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {sortedTransactions.map((tx, index) => (
              <Card 
                key={tx.tid} 
                className="glass-card p-4 border border-gray-700 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                      {tx.course.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">ID: {tx.tid}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{new Date(tx.createdAt || tx.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white text-lg mb-1">₹{tx.netPayable}</div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(tx.status)}
                      <span className="capitalize text-sm text-white">{tx.status}</span>
                    </div>
                  </div>
                </div>
                
                {tx.status === 'paid' && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <Button 
                      size="sm" 
                      onClick={() => handleViewReceipt(tx.tid)}
                      className="w-full hover-lift"
                    >
                      <Eye size={14} className="mr-2" />
                      View Receipt
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {sortedTransactions.length === 0 && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <Receipt className="text-gray-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Transactions Found</h3>
              <p className="text-gray-400 mb-6">
                {filterStatus === 'all' 
                  ? "You haven't made any payments yet."
                  : `No ${filterStatus} transactions found.`
                }
              </p>
              {filterStatus !== 'all' && (
                <Button 
                  onClick={() => setFilterStatus('all')}
                  variant="outline"
                >
                  View All Transactions
                </Button>
              )}
            </div>
          )}
        </Card>

        
      </div>
    </div>
  );
};

export default Transactions;