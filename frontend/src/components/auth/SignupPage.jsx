import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Phone, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import farmBg from '../../assets/images/farm_bg.png';
import api from '../../utils/api';

const SignupPage = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Typical structure mapping for new user
      const response = await api.post('/auth/register', { phone, full_name: name });
      if (response.status === 200 || response.status === 201) {
        navigate('/login', { state: { message: 'Account created! Please log in.' } });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col md:flex-row-reverse overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 relative min-h-[300px] hidden sm:block">
          <img 
            src={farmBg} 
            alt="Smart Farming" 
            className="absolute inset-0 w-full h-full object-cover origin-right"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white text-right">
            <h2 className="text-3xl font-bold mb-2">Join the Community.</h2>
            <p className="text-teal-50 text-sm font-medium opacity-90">Share insights, get local recommendations, and master your crop cycles.</p>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl md:mx-0 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
              <UserPlus className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400">Join KrishiDrishti today</p>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-500/20">
                {error}
              </div>
            )}
          
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                  placeholder="Ramesh Patel"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Start Farm Journey'} {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
