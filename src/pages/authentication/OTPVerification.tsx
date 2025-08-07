import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../components/Toast';
import './Authentication.css';
import { useOtpVerificationMutation, useResendOtpMutation } from '../../services/AuthApi';
import { LoginTypes } from '../../types/auth.types';

const OTPVerification = () => {
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;
  const rememberMe = location.state?.rememberMe;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showResend, setShowResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const [otpVerification, { isLoading: isOtpVerificationLoading }] = useOtpVerificationMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Handle initial delay and resend timer
  useEffect(() => {
    // Show resend button after 5 seconds
    const showTimer = setTimeout(() => {
      setShowResend(true);
    }, 5000);

    // Start countdown timer when resend becomes visible
    let countdownTimer: NodeJS.Timeout;
    if (showResend) {
      countdownTimer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(showTimer);
      clearInterval(countdownTimer);
    };
  }, [showResend]);

  const handleResendOtp = async () => {
    try {
      await resendOtp({ mobile_number: mobileNumber }).unwrap();
      showSuccessToast('OTP resent successfully');
      setResendTimer(30);
      setIsResendDisabled(true);
    } catch (error: any) {
      showErrorToast(error?.message || 'Failed to resend OTP');
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: LoginTypes = {
      otp: otp.join(''),
      mobile_number: mobileNumber?.toString()
    }
    // Debug log
    console.log('Submitting OTP data:', data);
    try {
      // Validate data before sending
      if (!data.mobile_number || !data.otp || data.otp.length !== 6) {
        showErrorToast('Invalid OTP or mobile number');
        return;
      }
      console.log('Sending OTP verification request:', {
        mobile_number: data.mobile_number,
        otp: data.otp,
        otpLength: data.otp.length
      });
      const response = await otpVerification(data).unwrap();
      console.log(response);

      if (response?.success === true && response?.status_code === 200) {
        showSuccessToast(response?.message);
        if (rememberMe) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem('auth_token', response.data.token);
          sessionStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
        // Verify storage
        const storedUser = rememberMe
          ? localStorage.getItem('user_data')
          : sessionStorage.getItem('user_data');
        console.log('Stored User Data:', storedUser);
        if (storedUser) {
          navigate('/dashboard');
        }
      }

          } catch (error: any) {
        const errorMessage = error?.data?.message || error?.message || 'Failed to verify OTP';
        showErrorToast(errorMessage);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Verify OTP</h1>
            <p className="text-white/80 mt-3">Enter the 6-digit code sent to your mobile</p>
          </motion.div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <motion.div variants={fadeIn} className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-semibold rounded-xl border-2 border-white/30 text-white bg-transparent focus:border-white focus:ring-0 focus:outline-none"
                />
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-6">
              <motion.button
                type="submit"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isOtpVerificationLoading || otp.some(digit => digit === '')}
                className="w-full rounded-2xl bg-white/20 px-6 h-12 text-base font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isOtpVerificationLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify OTP'
                )}
              </motion.button>

              {showResend && (
                <motion.button
                  type="button"
                  variants={fadeIn}
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || isResendLoading}
                  className="w-full py-2 text-sm font-medium text-white/80 hover:text-white disabled:text-white/50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResendLoading ? (
                    <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : isResendDisabled ? (
                    `Resend OTP in ${resendTimer}s`
                  ) : (
                    'Resend OTP'
                  )}
                </motion.button>
              )}

              <button
                type="button"
                onClick={() => navigate(-1)}
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

export default OTPVerification; 