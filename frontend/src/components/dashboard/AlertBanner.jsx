import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

const AlertBanner = () => {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-transparent border border-orange-500/50 backdrop-blur-md rounded-xl p-4 sm:p-6 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative group"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

      <div className="flex items-center gap-4">
        <div className="p-2 bg-orange-500/20 border border-orange-500/30 rounded-lg">
          <AlertCircle size={24} className="text-orange-400 animate-pulse" />
        </div>
        <div>
          <h3 className="font-mono font-bold text-lg text-orange-400 tracking-wider uppercase">{t('alert.recommended')}</h3>
          <p className="text-orange-200/80 font-mono text-xs tracking-wide">{t('alert.moisture_drop')}</p>
        </div>
      </div>
      <button className="w-full sm:w-auto px-6 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/50 font-mono font-semibold tracking-wider hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_10px_rgba(249,115,22,0.2)] focus:outline-none focus:ring-2 focus:ring-orange-500/50 uppercase text-sm">
        {t('alert.start_pump')}
      </button>
    </motion.div>
  );
};

export default AlertBanner;
