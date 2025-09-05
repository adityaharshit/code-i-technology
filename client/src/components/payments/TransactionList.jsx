import React from 'react';
import TransactionItem from './TransactionItem';
import Card from '../ui/Card';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400">You have no transactions yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 font-semibold">Bill No</th>
              <th className="p-4 font-semibold">Course</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.tid} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionList;
