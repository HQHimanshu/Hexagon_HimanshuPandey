import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import api from '../../utils/api';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications?limit=50');
      setUnreadCount(res.data.filter(a => !a.is_read).length);
    } catch (err) {
      // Silently fail
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/60 dark:bg-white/5 border-b border-emerald-100 dark:border-white/10 shadow-sm transition-colors duration-500 ease-in-out"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center group cursor-pointer gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden border border-emerald-400/50">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover relative z-10 p-1" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-none tracking-tight">
                KrishiDrishti
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/70">Smart Farming System</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Notifications"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            title="Profile"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0).toUpperCase() || user?.phone?.slice(-2) || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                {user?.name || 'Farmer'}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                {user?.phone || 'View Profile'}
              </span>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
