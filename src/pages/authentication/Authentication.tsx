import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useGetLoginMutation } from '../../services/AuthApi';
import { LoginTypes } from '../../types/auth.types';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useErrorToast, useSuccessToast } from '../../components/Toast';
import './Authentication.css';

const Authentication = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [getLogin, { isLoading }] = useGetLoginMutation();
  const navigate = useNavigate();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: LoginTypes = {
      mobile_number: mobileNumber,
      password: password
    };
    try {
      const response = await getLogin(data).unwrap();
      console.log('Login Response:', response);
      showSuccessToast(response?.message);
      navigate('/otp-verification', { state: { mobileNumber: mobileNumber, rememberMe: keepLoggedIn } });
    } catch (error: any) {
      console.log('Login failed:', error);
      showErrorToast(error?.data?.error || error?.message || 'Login failed. Please try again.');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: isActive ? -100 : 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isActive ? 100 : -100 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen lg:h-screen flex flex-col lg:flex-row relative bg-[#0d5c63] overflow-y-auto"
    >
      {/* Side panel for desktop */}
      <div className={`hidden lg:flex lg:flex-1 h-full lg:h-screen ${!isActive ? 'rounded-r-[10rem]' : 'rounded-l-[10rem]'} overflow-hidden relative ${isActive ? 'order-2' : 'order-1'} transition-all duration-300 bg-white`}>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            x: isActive ? '0%' : '0%',
            scale: isActive ? 1 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="h-full w-full bg-white" />
        </motion.div>
        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0d5c63] text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#0d5c63]">
            {!isActive ? 'Welcome Back!' : "Don't have an account?"}
          </h1>
          <p className="text-lg px-10 mb-8 text-[#197981]">
            {!isActive
              ? 'Already have an account? Sign in now!'
              : "Click here to know more about our services"}
          </p>
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-white border-2 border-[#0d5c63] text-[#0d5c63] px-8 py-3 rounded-full hover:bg-[#0d5c63] hover:text-white transition-all duration-200 font-medium shadow-md"
          >
            {!isActive ? 'Sign In' : 'Know more'}
          </button>
        </div>
      </div>

      {/* Main form area */}
      <div className={`w-full lg:flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 h-full lg:h-screen ${isActive ? 'order-1' : 'order-2'}`}
      >
        <div className="w-full max-w-md relative flex flex-col items-center auth-form-vertical-fix">
          {/* Logo for all screen sizes */}
          <div className="flex justify-center mb-6 w-full">
            <img src="/assets/dwarpal.png" alt="Company Logo" className="h-20 w-64" />
          </div>
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div
                key="login"
                {...pageTransition}
                className="w-full"
                style={{ position: 'relative' }}
              >
                <motion.div
                  className="w-full space-y-8"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div variants={fadeIn} className="text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Welcome back</h1>
                    <p className="text-white/80 mt-2">Please enter your details to sign in</p>
                  </motion.div>
                  <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6 sm:mt-8">
                    <motion.div className="space-y-5" variants={fadeIn}>
                      <div>
                          <label htmlFor="mobileNumber" className="block text-sm font-medium text-white mb-2">
                            Mobile Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="mobileNumber"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="Enter your Mobile Number"
                            className="w-full rounded-2xl border border-white/30 px-4 h-12 text-white placeholder:text-white/60 bg-transparent focus:border-white focus:ring-1 focus:ring-white text-sm transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-2xl border border-white/30 px-4 h-12 text-white placeholder:text-white/60 bg-transparent focus:border-white focus:ring-1 focus:ring-white text-sm transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                          >
                            {showPassword ? (
                              <HiEyeOff className="w-5 h-5" />
                            ) : (
                              <HiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-between"
                      variants={fadeIn}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="keep-logged-in"
                          checked={keepLoggedIn}
                          onChange={(e) => setKeepLoggedIn(e.target.checked)}
                          className="h-4 w-4 rounded border-white/40 text-white bg-transparent focus:ring-white"
                        />
                        <label htmlFor="keep-logged-in" className="ml-2.5 text-sm text-white">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </motion.div>
                    <motion.button
                      type="submit"
                      variants={fadeIn}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className="w-full rounded-2xl bg-white/20 px-6 h-12 text-sm font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Sign in'
                      )}
                    </motion.button>
                    <div className="mt-6 text-center lg:hidden">
                      <button
                        onClick={() => setIsActive(false)}
                        className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                      >
                        Don't have an account? Learn more
                      </button>
                    </div>
                  </form>
                  <div className="mt-4 text-center text-xs text-white/70">
                    <span>
                      By signing in, you agree to our{' '}
                      <Link to="/terms-and-conditions" className="underline hover:text-white">Terms & Conditions</Link>
                      {' '}and{' '}
                      <Link to="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="info"
                {...pageTransition}
                className="w-full"
                style={{ position: 'relative' }}
              >
                <motion.div
                  className="text-center space-y-4 sm:space-y-6"
                  variants={fadeIn}
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">Don't have an account?</h1>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-white/80 text-lg">Please contact our team at</p>
                    <p className="text-white font-medium">support@example.com</p>
                    <p className="text-white/80 text-lg">We'll be happy to help you get started</p>
                  </div>
                  <motion.button
                    onClick={() => setIsActive(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto rounded-2xl bg-gray-900 px-6 h-12 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200"
                  >
                    Back to login
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Authentication;