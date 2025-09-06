import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome, {user?.fullName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <p className="text-gray-400 mb-4">View your enrolled courses and check for pending payments.</p>
          <Link to="/my-courses">
            <Button>View My Courses</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Transactions</h2>
          <p className="text-gray-400 mb-4">Check your payment history and download invoices.</p>
          <Link to="/transactions">
            <Button>View Transactions</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="text-gray-400 mb-4">Update your personal information.</p>
          <Link to="/profile">
            <Button>Edit Profile</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;