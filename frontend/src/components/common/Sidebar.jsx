import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, BarChart3, Lightbulb, Activity, Users, Info, User, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../App';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
};

const Sidebar = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/analytics', icon: BarChart3, label: t('nav.analytics') },
    { path: '/suggestions', icon: Lightbulb, label: t('nav.suggestions') },
    { path: '/sensors', icon: Activity, label: t('nav.sensors') },
    { path: '/awareness', icon: Users, label: t('nav.awareness') },
    { path: '/notifications', icon: Bell, label: t('nav.notifications') },
    { path: '/profile', icon: User, label: t('nav.profile') },
    { path: '/about', icon: Info, label: t('nav.about') },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <aside className="fixed bottom-0 sm:bottom-auto sm:top-20 sm:left-0 z-40 w-full sm:w-64 sm:h-[calc(100vh-5rem)] backdrop-blur-xl bg-white/70 dark:bg-white/[0.03] border-t sm:border-t-0 sm:border-r border-emerald-100 dark:border-white/10 transition-colors duration-500 ease-in-out">
      <nav className="h-full px-3 py-2 sm:py-4 overflow-y-auto max-w-full">
        <motion.ul 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex sm:flex-col gap-1 sm:gap-2 justify-around sm:justify-start"
        >
          {navItems.map((item) => (
            <motion.li key={item.path} variants={itemVariants} className="flex-1 sm:flex-none">
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col sm:flex-row items-center sm:gap-3 px-2 py-3 sm:px-4 sm:py-3 rounded-2xl sm:rounded-xl transition-all duration-300 relative group
                  ${isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium dark:drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-emerald-300'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={`sm:mb-0 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                    <span className="text-[10px] sm:text-sm font-medium whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-emerald-50 dark:bg-emerald-500/20 rounded-2xl sm:rounded-xl -z-10 shadow-[inner_0_0_10px_rgba(52,211,153,0.2)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        {/* User Info & Logout */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden sm:flex flex-col gap-3 mt-6 pt-4 border-t border-emerald-200 dark:border-white/10"
          >
            <div className="flex items-center gap-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || 'user@example.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
