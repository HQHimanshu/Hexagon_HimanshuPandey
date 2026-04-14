import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import api from '../../utils/api';

const OTPVerification = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const phone = location.state?.phone || '9876543210';
  const mockOtp = '123456';

  useEffect(() => {
    // Auto-verify after 1.5 seconds
    const timer = setTimeout(() => autoVerify(), 1500);
    return () => clearTimeout(timer);
  }, []);

  const autoVerify = async () => {
    setLoading(true);
    try {
      // Try real backend
      const response = await api.post('/auth/verify-otp', { phone, otp_code: mockOtp });
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user || { phone }));
        setUser(response.data.user || { phone });
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 500);
        return;
      }
    } catch (err) {
      console.warn('Backend auth failed, using demo mode');
    }
    
    // Fallback: Demo mode
    localStorage.setItem('token', 'demo-token-12345');
    const demoUser = { phone, id: 1, name: 'Demo Farmer' };
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 text-center"
      >
        {success ? (
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">Login Successful!</h2>
            <p className="text-gray-500">Redirecting to dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
              <ShieldCheck size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying OTP</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Phone: <span className="font-bold">{phone}</span></p>
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {'123456'.split('').map((d, i) => (
                  <div key={i} className="w-12 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl font-bold text-emerald-600 font-mono">
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Verifying...</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OTPVerification;
