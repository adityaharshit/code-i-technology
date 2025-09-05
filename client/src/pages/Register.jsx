import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    // ... other fields
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="fullName"
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            required
          />
          <Input
            label="Username"
            name="username"
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
          {/* Add other input fields here */}
          <Button type="submit" loading={loading} className="w-full">
            Register
          </Button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-secondary">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;