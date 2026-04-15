import React from 'react';
import { motion } from 'framer-motion';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const Header = () => {
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
