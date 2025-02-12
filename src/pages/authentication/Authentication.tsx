import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useGetLoginMutation } from '../../services/AuthApi';
import { LoginTypes } from '../../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Authentication = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [getLogin, { isLoading }] = useGetLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: LoginTypes = {
      employee_code: employeeId,
      password: password
    };
    try {
      console.log('Making API call with data:', data);
      console.log('API URL:', import.meta.env.VITE_BASE_URL);
      const response = await getLogin(data).unwrap();
      console.log('API Response:', response);
      
      if (keepLoggedIn) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      } else {
        sessionStorage.setItem('auth_token', response.data.token);
        sessionStorage.setItem('user_data', JSON.stringify(response.data.user));
      }

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', {
        status: error?.status,
        data: error?.data,
        error: error,
        message: error?.message
      });
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
      className="min-h-screen flex bg-gray-50"
    >
      <div className={`hidden lg:flex lg:flex-1 lg:h-screen ${!isActive ? 'rounded-r-[10rem]' : 'rounded-l-[10rem]'} overflow-hidden relative ${isActive ? 'order-2' : 'order-1'}`}>
        <img src="/assets/bg.png" alt="Horizon UI Logo" className="h-full w-full object-cover absolute" />

        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">
            {!isActive ? 'Welcome Back!' : "Don't have an account?"}
          </h1>
          <p className="text-lg px-10 mb-8">
            {!isActive
              ? 'Already have an account? Sign in now!'
              : "Click here to know more about our services"}
          </p>
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 font-medium"
          >
            {!isActive ? 'Sign In' : 'Know more'}
          </button>
        </div>
      </div>

      <div className={`w-full lg:flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 ${isActive ? 'order-1' : 'order-2'}`}>
        <div className="w-full max-w-md relative min-h-[400px] flex items-center">
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div 
                key="login"
                {...pageTransition}
                className="w-full"
                style={{ position: 'absolute', left: 0, right: 0 }}
              >
                <motion.div 
                  className="w-full space-y-8"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div variants={fadeIn}>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6 sm:mt-8">
                    <motion.div className="space-y-5" variants={fadeIn}>
                      <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                            Employee ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="employeeId"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="Enter your Employee ID"
                            className="w-full rounded-2xl border border-gray-200 px-4 h-12 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-2xl border border-gray-200 px-4 h-12 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <label htmlFor="keep-logged-in" className="ml-2.5 text-sm text-gray-600">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
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
                      className="w-full rounded-2xl bg-gray-900 px-6 h-12 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Don't have an account? Learn more
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="info"
                {...pageTransition}
                className="w-full"
                style={{ position: 'absolute', left: 0, right: 0 }}
              >
                <motion.div 
                  className="text-center space-y-4 sm:space-y-6"
                  variants={fadeIn}
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">Don't have an account?</h1>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-gray-600 text-lg">Please contact our team at</p>
                    <p className="text-gray-900 font-medium">support@example.com</p>
                    <p className="text-gray-600 text-lg">We'll be happy to help you get started</p>
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