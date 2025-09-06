import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../../services/payments';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await paymentsAPI.updateStatus(id, status);
      setTransactions(transactions.map(transaction =>
        transaction.tid === id ? { ...transaction, status } : transaction
      ));
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
        return 'bg-ternary1 bg-opacity-20 text-ternary1';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
        <Button onClick={fetchTransactions}>Refresh</Button>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-ternary2 bg-opacity-20 border border-ternary1">
          <p className="text-ternary1">{error}</p>
        </Card>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Bill No</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Course</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.tid} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-4 px-4 text-white font-mono">{transaction.billNo}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white">{transaction.student?.fullName}</p>
                      <p className="text-gray-400 text-sm">{transaction.student?.rollNumber}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white">{transaction.course?.title}</td>
                  <td className="py-4 px-4 text-white">
                    ₹{transaction.netPayable?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {transaction.status === 'pending approval' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(transaction.tid, 'paid')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusUpdate(transaction.tid, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No transactions found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TransactionManagement;