import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle, Loader2, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Format phone number
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      const response = await api.post('/auth/send-otp', { phone: formattedPhone });
      
      setSuccess(`✅ OTP sent to ${formattedPhone} via WhatsApp!`);
      setStep(2);
      setCountdown(60); // 60 seconds before can resend
      
      // Show info about OTP
      setTimeout(() => {
        alert(`📱 OTP Code: ${response.data.mock_otp}\n\nCheck your WhatsApp for the verification code.`);
      }, 500);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.');
      console.error('OTP Send Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      const response = await api.post('/auth/verify-otp', {
        phone: formattedPhone,
        otp_code: otp
      });

      // Store token
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('✅ Login successful! Redirecting...');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
      console.error('OTP Verify Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP({ preventDefault: () => {} });
  };

  const handleChangeNumber = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
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
          <div className="text-6xl mb-3">🌾</div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">KrishiDrishti</h2>
          <p className="text-emerald-100 text-sm mt-1">AI-Powered Smart Farming</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {step === 1 ? (
            /* Phone Input Step */
            <form onSubmit={handleSendOTP} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Mobile Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\s/g, ''))}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  We'll send a 6-digit OTP via WhatsApp
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Send OTP <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Demo Mode: OTP will be shown in alert for testing
              </p>
            </form>
          ) : (
            /* OTP Input Step */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter OTP from WhatsApp
                </label>
                <div className="relative">
                  <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-center text-2xl tracking-widest"
                    placeholder="123456"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Check your WhatsApp for the 6-digit code
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Verify & Login <CheckCircle size={18} />
                  </>
                )}
              </button>

              {/* Resend & Change Number */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
                
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all text-gray-600 hover:text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                >
                  Change Number
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
