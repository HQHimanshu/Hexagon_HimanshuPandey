import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle, Loader2, Key, User, MapPin, Mail, Sprout, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

// Available crops for selection
const AVAILABLE_CROPS = [
  'Rice', 'Wheat', 'Cotton', 'Maize', 'Soybean', 'Sugarcane',
  'Potato', 'Tomato', 'Onion', 'Chili', 'Turmeric', 'Ginger',
  'Mustard', 'Sunflower', 'Groundnut', 'Pulses', 'Jowar', 'Bajra',
  'Vegetables', 'Fruits', 'Other'
];

// Indian regions/states
const REGIONS = [
  'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh',
  'Rajasthan', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
  'Telangana', 'Kerala', 'West Bengal', 'Odisha', 'Bihar',
  'Jharkhand', 'Assam', 'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Goa', 'Delhi', 'Other'
];

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRegion, setSignupRegion] = useState('');
  const [signupCrops, setSignupCrops] = useState([]);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupStep, setSignupStep] = useState(1); // 1: form, 2: OTP
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [cropInput, setCropInput] = useState('');
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  
  const navigate = useNavigate();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Close crop dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setShowCropDropdown(false);
    if (showCropDropdown) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showCropDropdown]);

  // Filter crops based on input
  const filteredCrops = AVAILABLE_CROPS.filter(
    crop => crop.toLowerCase().includes(cropInput.toLowerCase()) && !signupCrops.includes(crop)
  );

  // Add crop to selection
  const addCrop = (crop) => {
    if (!signupCrops.includes(crop)) {
      setSignupCrops([...signupCrops, crop]);
    }
    setCropInput('');
    setShowCropDropdown(false);
  };

  // Remove crop from selection
  const removeCrop = (crop) => {
    setSignupCrops(signupCrops.filter(c => c !== crop));
  };

  // ==================== LOGIN HANDLERS ====================
  const handleLoginSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/send-email-otp', { email: loginEmail });
      
      setSuccess(`✅ OTP sent to ${loginEmail}!`);
      setLoginStep(2);
      setCountdown(60);
      
      setTimeout(() => {
        alert(`📧 Login OTP: ${response.data.mock_otp}\n\nCheck your email for the code.`);
      }, 500);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-email-otp', {
        email: loginEmail,
        otp_code: loginOtp
      });

      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('✅ Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendLoginOTP = async () => {
    if (countdown > 0) return;
    await handleLoginSendOTP({ preventDefault: () => {} });
  };

  // ==================== SIGNUP HANDLERS ====================
  const handleSignupSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/send-signup-otp', {
        name: signupName,
        email: signupEmail,
        phone: signupPhone || undefined,
        region: signupRegion,
        crops: signupCrops
      });
      
      setSuccess(`✅ Welcome ${signupName}! OTP sent to ${signupEmail}!`);
      setSignupStep(2);
      setCountdown(60);
      
      setTimeout(() => {
        alert(`📧 Signup OTP: ${response.data.mock_otp}\n\nCheck your email to complete signup.`);
      }, 500);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This email is already registered. Please login instead.');
        setTimeout(() => setActiveTab('login'), 2000);
      } else {
        setError(err.response?.data?.detail || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-signup-otp', {
        email: signupEmail,
        otp_code: signupOtp,
        name: signupName,
        phone: signupPhone || undefined,
        region: signupRegion,
        crops: signupCrops
      });

      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess(`🎉 Welcome ${signupName}! Signup successful! Redirecting...`);
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendSignupOTP = async () => {
    if (countdown > 0) return;
    await handleSignupSendOTP({ preventDefault: () => {} });
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Header with Tabs */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🌾</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">KrishiDrishti</h2>
            <p className="text-emerald-100 text-sm">AI-Powered Smart Farming</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-1">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-emerald-700 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-emerald-700 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* ==================== LOGIN FORM ==================== */}
            {activeTab === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {loginStep === 1 ? (
                  <form onSubmit={handleLoginSendOTP} className="space-y-6">
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
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          placeholder="farmer@example.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !loginEmail.trim()}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (<>Send OTP <ArrowRight size={18} /></>)}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginVerifyOTP} className="space-y-6">
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
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength="6"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-center text-2xl tracking-widest"
                          placeholder="123456"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || loginOtp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (<>Verify & Login <CheckCircle size={18} /></>)}
                    </button>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleResendLoginOTP}
                        disabled={countdown > 0}
                        className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all disabled:opacity-50 text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setLoginStep(1); setLoginOtp(''); }}
                        className="w-full py-3 px-4 rounded-xl font-medium text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                      >
                        Change Number
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* ==================== SIGNUP FORM ==================== */}
            {activeTab === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {signupStep === 1 ? (
                  <form onSubmit={handleSignupSendOTP} className="space-y-5">
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

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          placeholder="Ramesh Kumar"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          placeholder="farmer@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mobile Number <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value.replace(/\s/g, ''))}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region / State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          required
                          value={signupRegion}
                          onChange={(e) => setSignupRegion(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                        >
                          <option value="">Select your region</option>
                          {REGIONS.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Crops Multi-Select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Crops You're Growing <span className="text-gray-400 text-xs">(Select multiple)</span>
                      </label>
                      
                      {/* Selected crops tags */}
                      {signupCrops.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {signupCrops.map(crop => (
                            <span
                              key={crop}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium"
                            >
                              <Sprout size={14} />
                              {crop}
                              <button
                                type="button"
                                onClick={() => removeCrop(crop)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Crop input with dropdown */}
                      <div className="relative">
                        <div className="relative">
                          <Sprout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={cropInput}
                            onChange={(e) => {
                              setCropInput(e.target.value);
                              setShowCropDropdown(true);
                            }}
                            onFocus={() => setShowCropDropdown(true)}
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="Search crops..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (cropInput && !signupCrops.includes(cropInput)) {
                                addCrop(cropInput);
                              }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {/* Dropdown */}
                        {showCropDropdown && filteredCrops.length > 0 && (
                          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                            {filteredCrops.map(crop => (
                              <button
                                key={crop}
                                type="button"
                                onClick={() => addCrop(crop)}
                                className="w-full px-4 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-900 dark:text-white"
                              >
                                {crop}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !signupName || !signupEmail || !signupRegion}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (<>Send OTP & Continue <ArrowRight size={18} /></>)}
                    </button>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                      We'll send an OTP via WhatsApp to verify your number
                    </p>
                  </form>
                ) : (
                  /* OTP Verification Step */
                  <form onSubmit={handleSignupVerifyOTP} className="space-y-6">
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

                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verify Your Account</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enter the OTP sent to {signupEmail}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter OTP from WhatsApp
                      </label>
                      <div className="relative">
                        <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={signupOtp}
                          onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength="6"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-center text-2xl tracking-widest"
                          placeholder="123456"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || signupOtp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (<>Verify & Complete Signup <CheckCircle size={18} /></>)}
                    </button>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleResendSignupOTP}
                        disabled={countdown > 0}
                        className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all disabled:opacity-50 text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSignupStep(1); setSignupOtp(''); }}
                        className="w-full py-3 px-4 rounded-xl font-medium text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                      >
                        Go Back
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              🔒 Secure OTP verification via WhatsApp
            </p>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">
              Supports Hindi, Marathi & English | Works offline in rural areas 🌾
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
