import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Sprout, Calendar, Shield, Activity, MessageSquare, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const AccountPage = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await api.get('/account/account-summary');
      setAccountData(response.data);
    } catch (err) {
      setError('Failed to load account data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!accountData) return null;

  const { user, account_stats, recent_activity } = accountData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-emerald-100">View your profile and activity history</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={20} className="text-emerald-600" />
          Profile Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <User size={18} className="text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{user.name || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Mail size={18} className="text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Phone size={18} className="text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <MapPin size={18} className="text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Region</p>
              <p className="font-medium text-gray-900 dark:text-white">{user.region || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
            <Sprout size={18} className="text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Crops</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.crops && user.crops.length > 0 ? (
                  user.crops.map((crop, idx) => (
                    <span key={idx} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-sm">
                      {crop}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-900 dark:text-white">No crops selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-emerald-600" />
          Account Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            <Shield size={24} className="text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{account_stats.total_otp_sent}</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">OTP Sent</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl">
            <AlertTriangle size={24} className="text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{account_stats.total_alerts}</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400">Alerts</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
            <MessageSquare size={24} className="text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{account_stats.total_advice_queries}</p>
            <p className="text-xs text-purple-700 dark:text-purple-400">Advice Queries</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{account_stats.total_sensor_readings}</p>
            <p className="text-xs text-green-700 dark:text-green-400">Sensor Readings</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Account created: {new Date(account_stats.account_created_at).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent OTP History */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-emerald-600" />
          Recent OTP History
        </h2>
        
        <div className="space-y-2">
          {recent_activity.otp_history.length > 0 ? (
            recent_activity.otp_history.map((otp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {otp.is_verified ? '✅ Verified' : '⏳ Pending'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(otp.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No OTP history</p>
          )}
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-emerald-600" />
          Recent Alerts
        </h2>
        
        <div className="space-y-2">
          {recent_activity.recent_alerts.length > 0 ? (
            recent_activity.recent_alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                alert.type === 'WARNING' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {alert.channel} • {new Date(alert.timestamp).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    alert.is_read ? 'bg-gray-200 dark:bg-gray-700' : 'bg-emerald-500 text-white'
                  }`}>
                    {alert.is_read ? 'Read' : 'New'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No alerts yet</p>
          )}
        </div>
      </motion.div>

      {/* Recent Advice Queries */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-emerald-600" />
          Recent Advice Queries
        </h2>
        
        <div className="space-y-2">
          {recent_activity.recent_advice.length > 0 ? (
            recent_activity.recent_advice.map((advice) => (
              <div key={advice.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{advice.question}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(advice.timestamp).toLocaleString('en-IN')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No advice queries yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AccountPage;
