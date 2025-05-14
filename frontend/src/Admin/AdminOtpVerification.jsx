import React, { useState } from 'react';
import { api } from "../services/axiosInstance";
// Import Toast components
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOtpVerification = ({ email, onVerificationSuccess,onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle OTP input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    // Update the OTP digit at this position
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Move focus to next input
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`admin-otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle keydown for backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`admin-otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await api.post('/admin/resend-otp', { email });
      if (response.data.success) {
        toast.info('A new OTP has been sent to your email', {
          position: "top-right"
        });
        setOtp(['', '', '', '', '', '']); 
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter all digits of the OTP');
      toast.warning('Please enter all 6 digits of the OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/admin/verify-otp', {
        otp: otpValue,
        email
      });

      // Fixed response handling
      if (response.data.success) {
        setMessage('Email verified successfully!');
        toast.success('Email verified successfully! Redirecting to login page...', {
          position: "top-right",
          autoClose: 2000
        });
        
      
        if (onVerificationSuccess) {
          onVerificationSuccess();
        } else {
          // Default behavior if callback not provided
          setTimeout(() => {
            
            window.location.href = '/admin/login';
          }, 2000);
        }
      } else {
        setError(response.data.error || 'Verification failed');
        toast.error(response.data.error || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred during verification');
      toast.error('An error occurred during verification');
      console.error('Verification error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-amber-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header - styled to match signup form */}
          <div className="bg-amber-900 text-amber-100 p-6">
            <h2 className="text-3xl font-bold text-center">Verify Your Email</h2>
            <p className="text-center text-amber-200 mt-2">Enter the 6-digit code sent to {email}</p>
          </div>
          
          <div className="p-8">
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`admin-otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-amber-900"
                />
              ))}
            </div>
            
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            {message && <p className="text-green-600 text-center mb-4">{message}</p>}
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-amber-700 text-white font-medium w-full p-3 rounded-md transition duration-300 hover:bg-amber-800 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-amber-900">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  className="text-amber-700 font-medium hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOtpVerification;