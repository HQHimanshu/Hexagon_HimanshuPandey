import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import api from '../../utils/api';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  // Gets passed phone from Login page
  const phone = location.state?.phone || '';

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp: otpCode });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        // Fake setting user details for now (if backend gives data, put here)
        const userData = { phone, token: response.data.access_token };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-700 text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
          <ShieldCheck size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Phone</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
          Enter the 6-digit code sent to<br/> <span className="text-gray-900 dark:text-white">{phone || 'your number'}</span>
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((data, index) => {
              return (
                <input
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 mb-6"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Account'} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Didn't receive code? <button className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-1">Resend SMS</button>
        </p>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
