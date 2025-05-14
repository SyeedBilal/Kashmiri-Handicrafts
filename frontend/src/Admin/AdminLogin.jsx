import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { api } from '../services/axiosInstance';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../store/Slices/adminSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminOtpVerification from './AdminOtpVerification';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('login');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerificationSuccess = () => {
    toast.success('Admin account verified successfully!');
    setTimeout(() => {
      setStep('login');
      setIsLogin(true);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const response = await api.post('/admin/login', formData);
       
        if (response.data.success) {
          toast.success('Login successful! Redirecting to dashboard...', {
            position: "top-right",
            autoClose: 2000
          });
          dispatch(setAdmin(response.data.admin));

          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 2000);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          toast.error('Passwords do not match');
          return;
        }
        
        if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
          setError('Only Gmail addresses are allowed');
          toast.error('Only Gmail addresses are allowed');
          return;
        }
        
        const response = await api.post('/admin/signup', formData);
        if (response.data) {
          toast.success('Account created! Please verify with OTP');
          setStep('verify');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (step === 'verify') {
    return (
      <AdminOtpVerification 
        email={formData.email} 
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-900">
              Admin {isLogin ? 'Login' : 'Signup'}
            </h2>
            <p className="mt-2 text-sm text-amber-600">
              {isLogin 
                ? 'Please sign in to access the admin dashboard'
                : 'Create your admin account'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`border-l-4 p-4 mb-4 ${
                error.includes('successful') 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}>
                <p className={error.includes('successful') ? 'text-green-700' : 'text-red-700'}>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-amber-900">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-amber-500" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-900">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-900">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-amber-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 cursor-pointer"
              >
                {isLogin ? 'Sign in to Dashboard' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-amber-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
                className="font-medium text-amber-900 hover:text-amber-800 cursor-pointer"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
