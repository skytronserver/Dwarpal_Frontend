import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../components/Toast';
import './Authentication.css';
import { useSetPasswordMutation } from '../../services/AuthApi';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const ResetPassword = () => {
    const location = useLocation();
    const token = location.pathname.split('/').pop();
    const navigate = useNavigate();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();

    const [mobileNumber, setMobileNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [setNewPasswordMutation, { isLoading }] = useSetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            showErrorToast('Passwords do not match');
            return;
        }

        if (!token) {
            showErrorToast('Invalid or missing reset token');
            return;
        }

        try {
            const response = await setNewPasswordMutation({
                token,
                mobile_number: mobileNumber,
                new_password: newPassword
            }).unwrap();
            showSuccessToast(response?.message || 'Password has been reset successfully');
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to reset password';
            showErrorToast(errorMessage);
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Reset Password</h1>
                        <p className="text-white/80 mt-3">Enter your new password below</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                        <motion.div variants={fadeIn} className="space-y-6">
                            {/* Mobile Number */}
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                className="w-full text-center text-lg font-semibold rounded-xl border-2 border-white/30 text-white bg-transparent focus:border-white focus:ring-0 focus:outline-none h-14"
                            />

                            {/* New Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full text-center text-lg font-semibold rounded-xl border-2 border-white/30 text-white bg-transparent focus:border-white focus:ring-0 focus:outline-none h-14"
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-white/80"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                                </span>
                            </div>

                            {/* Confirm New Password */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="w-full text-center text-lg font-semibold rounded-xl border-2 border-white/30 text-white bg-transparent focus:border-white focus:ring-0 focus:outline-none h-14"
                                />
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-white/80"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="space-y-6">
                            <motion.button
                                type="submit"
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading || !newPassword || !confirmNewPassword}
                                className="w-full rounded-2xl bg-white/20 px-6 h-12 text-base font-medium text-white shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Reset Password'
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

export default ResetPassword;
