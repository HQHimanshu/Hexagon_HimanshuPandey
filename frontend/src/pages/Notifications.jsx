import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Check, Trash2, Loader2, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/notifications?limit=50');
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllRead = async () => {
    const unread = alerts.filter(a => !a.is_read);
    for (const alert of unread) {
      await markRead(alert.id);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'CRITICAL': return <AlertTriangle size={20} className="text-red-400" />;
      case 'WARNING': return <AlertTriangle size={20} className="text-amber-400" />;
      default: return <Info size={20} className="text-blue-400" />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case 'CRITICAL': return 'border-l-red-500';
      case 'WARNING': return 'border-l-amber-500';
      default: return 'border-l-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl border border-emerald-500/50 flex items-center justify-center">
            <Bell size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Notifications
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm tracking-widest uppercase">
              {alerts.filter(a => !a.is_read).length} unread | {alerts.length} total
            </p>
          </div>
        </div>
        {alerts.some(a => !a.is_read) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors font-semibold text-sm"
          >
            <Check size={16} />
            Mark All Read
          </button>
        )}
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <BellOff size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-semibold">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-2">You'll be alerted when something needs attention</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-gray-800/50 rounded-xl border border-gray-700/50 border-l-4 ${getBorder(alert.type)} p-4 flex items-start gap-4 ${alert.is_read ? 'opacity-60' : ''}`}
            >
              <div className="p-2 bg-gray-900/50 rounded-lg">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-1">
                  {alert.message_en || alert.message_hi || alert.message_mr || 'Alert'}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(alert.timestamp).toLocaleString()} • {alert.channel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!alert.is_read && (
                  <button
                    onClick={() => markRead(alert.id)}
                    className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                {alert.is_read && (
                  <CheckCircle size={18} className="text-emerald-500/50" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;
