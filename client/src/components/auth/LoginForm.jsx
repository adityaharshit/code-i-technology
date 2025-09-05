import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { validateLogin } from '../../utils/validators';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { LogIn } from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { username: '', password: '' },
    validateLogin
  );

  const handleLogin = async () => {
    try {
      await login(values);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to continue your journey.</p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, handleLogin)} className="space-y-6">
        <Input
          label="Username or Email"
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="e.g., john.doe"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />
        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >
          <LogIn size={16} className="mr-2"/>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-secondary hover:text-primary transition-colors duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginForm;
