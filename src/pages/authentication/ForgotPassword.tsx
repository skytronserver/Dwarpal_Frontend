import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../components/Toast';
import { useRequestPasswordResetMutation } from '../../services/AuthApi'; // This will be created later
import './Authentication.css';

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const[email, setEmail] = useState('');
  const navigate = useNavigate();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await requestPasswordReset({ mobile_number: mobileNumber, email: email }).unwrap();
      showSuccessToast(response?.message || 'Password reset link sent successfully.');
    } catch (error: any) {
      showErrorToast(error?.data?.message || 'Failed to send password reset link.');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-[#0d5c63] p-4"
    >
      <div className="w-full max-w-md mx-auto px-6">
        <motion.div
          className="w-full space-y-10"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeIn} className="flex justify-center">
            <img src="/assets/dwarpal.png" alt="Company Logo" className="h-20 w-64" />
          </motion.div>

          <motion.div variants={fadeIn} className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Forgot Password</h1>
            <p className="text-white/80 mt-3">Enter your mobile number to reset your password</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <motion.div variants={fadeIn} className="space-y-6">
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full text-center text-lg font-semibold rounded-xl border-2 border-white/30 text-white bg-transparent focus:border-white focus:ring-0 focus:outline-none h-14"
                />
            </motion.div>
            <motion.div variants={fadeIn} className="space-y-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-center text-lg font-semibold rounded-xl border-2 border-white/30 text-white bg-transparent focus:border-white focus:ring-0 focus:outline-none h-14"
                />
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-6">
              <motion.button
                type="submit"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !mobileNumber || !email}
                className="w-full rounded-2xl bg-white/20 px-6 h-12 text-base font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Back to Login
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
