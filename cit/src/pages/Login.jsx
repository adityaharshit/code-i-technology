import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username or Email"
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            error={errors.username}
            required
            placeholder="Enter your username or email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Enter your password"
          />

          {errors.submit && (
            <div className="p-3 bg-ternary2 bg-opacity-20 border border-ternary1 rounded-lg">
              <p className="text-ternary1 text-sm">{errors.submit}</p>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary hover:text-primary transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;