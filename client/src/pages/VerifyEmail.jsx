import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/auth';
import Card from '../components/ui/Card';

const VerifyEmail = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      authAPI.verifyEmail(token)
        .then(() => setMessage('Email verified successfully! You can now log in.'))
        .catch(() => setMessage('Invalid or expired verification token.'));
    } else {
      setMessage('No verification token found.');
    }
  }, [location]);

  return (
    <Card className="max-w-lg mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p>{message}</p>
      <Link to="/login" className="text-secondary mt-4 inline-block">Go to Login</Link>
    </Card>
  );
};

export default VerifyEmail;