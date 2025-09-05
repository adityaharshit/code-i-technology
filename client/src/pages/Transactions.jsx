import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../services/payments';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await paymentsAPI.getMyTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleDownloadInvoice = async (tid) => {
    try {
      const response = await paymentsAPI.getInvoice(tid);
      const blob = new Blob([response.data], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice-${tid}.html`;
      link.click();
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Transactions</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Course</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.tid} className="border-b border-gray-700">
                <td className="py-4 px-4">{tx.course.title}</td>
                <td className="py-4 px-4">₹{tx.netPayable}</td>
                <td className="py-4 px-4 capitalize">{tx.status}</td>
                <td className="py-4 px-4">
                  {tx.status === 'paid' && (
                    <Button size="sm" onClick={() => handleDownloadInvoice(tx.tid)}>
                      Download Invoice
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

export default Transactions;