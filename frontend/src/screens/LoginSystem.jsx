import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../assets/kalusugan.png';

export default function LoginSystem({ onLogin }) {
  const [currentPage, setCurrentPage] = useState('admin'); // 'admin' or 'user'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful!');
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Call onLogin callback with user data
        onLogin(data.data.user, data.data.token);
      } else {
        const errorMsg = data.message || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const switchToUser = () => {
    setCurrentPage('user');
    setFormData({ username: '', password: '' });
    setShowPassword(false);
    setError('');
  };

  const switchToAdmin = () => {
    setCurrentPage('admin');
    setFormData({ username: '', password: '' });
    setShowPassword(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main Login Card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
            <div className="text-white text-2xl font-bold">
              <img src={Logo} alt="Logo" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          Welcome To alusugan.
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          </div>
        )}

        {/* Username Field */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Username*"
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Password*"
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Login Notice */}
        <div className="text-center mb-6">
          <p className="text-sm font-bold text-gray-900">
            {currentPage === 'admin' ? 'PLEASE LOG IN AS ADMIN.' : 'PLEASE LOG IN AS USER.'}
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full font-bold py-3 rounded-lg transition-all bg-gray-800 hover:bg-gray-900 text-white mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              LOGGING IN...
            </div>
          ) : (
            'LOG IN'
          )}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <a
            href="#"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
          >
            FORGOTTEN YOUR PASSWORD ?
          </a>
        </div>
      </div>

      {/* Switch Login Type Button */}
      {currentPage === 'admin' ? (
        <button
          onClick={switchToUser}
          disabled={isLoading}
          className="absolute bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all shadow-lg group font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>USER LOGIN</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          onClick={switchToAdmin}
          disabled={isLoading}
          className="absolute bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all shadow-lg group font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>ADMIN LOGIN</span>
        </button>
      )}
    </div>
  );
}
