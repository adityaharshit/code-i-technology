// Enhanced Futuristic Transactions Page
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
  RefreshCw,
  TrendingUp,
  Zap,
  Shield,
  Activity,
  Target,
  Sparkles,
  ChevronRight,
  DollarSign
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
        <LoadingSpinner size="lg" text="Loading your transactions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Receipt className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <CreditCard className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float" style={{ animationDelay: '2s' }} />
        <DollarSign className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse" style={{ animationDelay: '1s' }} />
        <Shield className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 " style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Enhanced Header Section */}
        <Card variant="hologram" className="p-6 sm:p-8 text-center animate-fade-in-down">
          <div className="flex flex-col items-center space-y-6">
            {/* Enhanced Icon */}
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-3xl animate-neural-pulse shadow-glow">
                <Receipt className="text-white w-8 h-8" />
              </div>
              {/* Floating indicators */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-matrix-400 rounded-full " />
              <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-neural-400 rounded-full animate-particle-float" />
            </div>

            {/* Enhanced Title */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-electric-400 via-cyber-500 to-matrix-400 bg-clip-text text-transparent ">
                My Transactions
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                View and manage your{' '}
                <span className="text-electric-400 font-semibold">payment history</span>{' '}
                and{' '}
                <span className="text-cyber-400 font-semibold">transaction records</span>
              </p>
              
              {/* Activity indicator */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Activity className="w-4 h-4 text-matrix-400 animate-pulse" />
                <span className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up animate-delay-400">
          <Card variant="matrix" interactive className="p-4 sm:p-6 group">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-matrix-500/20 to-matrix-600/30 animate-neural-pulse">
                <CheckCircle className="text-matrix-400 w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">Completed</p>
                <p className="text-2xl font-display font-bold text-white group-hover:text-matrix-400 transition-colors duration-300">
                  {transactions.filter(t => t.status === 'paid').length}
                </p>
                <div className="w-full h-1 bg-matrix-500/20 rounded-full mt-2">
                  <div className="w-full h-full bg-gradient-to-r from-matrix-500 to-matrix-400 rounded-full animate-energy-flow" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="neural" interactive className="p-4 sm:p-6 group animate-delay-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-neural-500/20 to-neural-600/30 animate-neural-pulse">
                <Clock className="text-neural-400 w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">Pending</p>
                <p className="text-2xl font-display font-bold text-white group-hover:text-neural-400 transition-colors duration-300">
                  {transactions.filter(t => t.status === 'pending').length}
                </p>
                <div className="w-full h-1 bg-neural-500/20 rounded-full mt-2">
                  <div className="w-3/4 h-full bg-gradient-to-r from-neural-500 to-neural-400 rounded-full animate-energy-flow" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="electric" interactive className="p-4 sm:p-6 group animate-delay-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-electric-500/20 to-electric-600/30 animate-neural-pulse">
                <CreditCard className="text-electric-400 w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">Total Transactions</p>
                <p className="text-2xl font-display font-bold text-white group-hover:text-electric-400 transition-colors duration-300">
                  {transactions.length}
                </p>
                <div className="w-full h-1 bg-electric-500/20 rounded-full mt-2">
                  <div className="w-full h-full bg-gradient-to-r from-electric-500 to-electric-400 rounded-full animate-energy-flow" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="cyber" interactive className="p-4 sm:p-6 group animate-delay-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyber-500/20 to-cyber-600/30 animate-neural-pulse">
                <DollarSign className="text-cyber-400 w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">Total Paid</p>
                <p className="text-xl font-display font-bold text-white group-hover:text-cyber-400 transition-colors duration-300">
                  ₹{transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.netPayable, 0)}
                </p>
                <div className="w-full h-1 bg-cyber-500/20 rounded-full mt-2">
                  <div className="w-4/5 h-full bg-gradient-to-r from-cyber-500 to-cyber-400 rounded-full animate-energy-flow" />
                </div>
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