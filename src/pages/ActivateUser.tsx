import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ActivateUser = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    confirmPassword: '',
    id_proof_last4: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Values:', formData);
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
          variants={containerVariants}
        >
          {/* Logo */}
          <motion.div variants={fadeIn} className="flex justify-center">
            <img src="/assets/dwarpal.png" alt="Company Logo" className="h-20 w-64" />
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeIn} className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Activate User</h1>
            <p className="text-white/80 mt-3">Please enter your details to activate your account</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={fadeIn} className="space-y-5">
              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-white mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="w-full rounded-2xl border border-white/30 px-4 h-12 text-white placeholder:text-white/60 bg-transparent focus:border-white focus:ring-1 focus:ring-white text-sm transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full rounded-2xl border border-white/30 px-4 h-12 text-white placeholder:text-white/60 bg-transparent focus:border-white focus:ring-1 focus:ring-white text-sm transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Last 4 digits of ID */}
              <div>
                <label htmlFor="id_proof_last4" className="block text-sm font-medium text-white mb-2">
                  Last 4 digits of ID
                </label>
                <input
                  type="text"
                  id="id_proof_last4"
                  name="id_proof_last4"
                  value={formData.id_proof_last4}
                  onChange={handleChange}
                  placeholder="Enter last 4 digits of ID"
                  maxLength={4}
                  className="w-full rounded-2xl border border-white/30 px-4 h-12 text-white placeholder:text-white/60 bg-transparent focus:border-white focus:ring-1 focus:ring-white text-sm transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-white/20 px-6 h-12 text-base font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200"
            >
              Activate Account
            </motion.button>

            {/* Back Link */}
            <motion.div variants={fadeIn} className="text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Back to Login
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActivateUser;
