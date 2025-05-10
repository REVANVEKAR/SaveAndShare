import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await login(formData.email, formData.password, 'user');
      
      toast.success('Login successful!');
      navigate('/user');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">User Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access volunteer opportunities
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-sm">
              Don't have an account?{' '}
              <Link to="/user/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
              <ArrowRight size={16} className="mr-1" />
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;