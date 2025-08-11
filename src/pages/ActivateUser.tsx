import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useActivateUserMutation } from '../services/activateUser';
import { useSuccessToast, useErrorToast } from '../components/Toast';

const ActivateUser = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    confirmPassword: '',
    id_proof_last4: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activateUser, { isLoading }] = useActivateUserMutation();
  const [errors, setErrors] = useState({
    mobile: '',
    password: '',
    confirmPassword: '',
    id_proof_last4: ''
  });
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const validate = () => {
    const newErrors: typeof errors = { mobile: '', password: '', confirmPassword: '', id_proof_last4: '' };
    // Mobile: required, 10 digits, numeric
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits.';
    }
    // Password: required, min 6 chars
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    // Confirm Password: required, must match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    // ID Proof Last 4: required, 4 digits
    if (!formData.id_proof_last4) {
      newErrors.id_proof_last4 = 'Last 4 digits of ID are required.';
    } else if (!/^\d{4}$/.test(formData.id_proof_last4)) {
      newErrors.id_proof_last4 = 'Must be exactly 4 digits.';
    }
    setErrors(newErrors);
    // Return true if no errors
    return Object.values(newErrors).every(e => !e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   try {
    if (!token) {
      console.error('Token is required');
      return;
    }
    if (!validate()) {
      return;
    }
    const data = {
      mobile_number: formData.mobile,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      id_proof_last4: formData.id_proof_last4,
      token: token
    };
    console.log('Form Values:', data);
    const response = await activateUser(data).unwrap();
    showSuccessToast(response?.message || 'User activated successfully');
   } catch (error: any) {
    console.log(error,'error');
      showErrorToast(error?.data?.detail || error?.detail || 'Failed to activate user');
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
                {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
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
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
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
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
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
                {errors.id_proof_last4 && <p className="text-red-400 text-xs mt-1">{errors.id_proof_last4}</p>}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={fadeIn}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full rounded-2xl bg-white/20 px-6 h-12 text-base font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200${isLoading ? ' opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Activating...' : 'Activate Account'}
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
