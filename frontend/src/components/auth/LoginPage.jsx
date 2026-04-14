import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/send-otp', { phone });
      const mockOtp = response.data.mock_otp || '123456';
      alert(`✅ OTP sent! Your code is: ${mockOtp}`);
      setOtpSent(true);
      setTimeout(() => {
        navigate('/verify-otp', { state: { phone, mockOtp } });
      }, 1000);
    } catch (err) {
      // Even if backend fails, go to OTP page with mock OTP
      const mockOtp = '123456';
      console.warn('Using demo OTP mode:', err.message);
      setOtpSent(true);
      setTimeout(() => {
        navigate('/verify-otp', { state: { phone: phone || '9876543210', mockOtp } });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Phone size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Welcome Back</h2>
          <p className="text-emerald-100 text-sm mt-1">Sign in to KrishiDrishti</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSendOTP} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
                ⚠️ {error}
              </div>
            )}

            {otpSent && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                ✅ OTP sent! Redirecting...
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpSent}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : otpSent ? 'OTP Sent!' : 'Get OTP'} {!loading && !otpSent && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Demo OTP: <span className="font-bold text-emerald-500">123456</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
