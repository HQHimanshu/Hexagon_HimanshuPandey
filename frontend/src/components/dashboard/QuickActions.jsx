import React from 'react';
import { motion } from 'framer-motion';
import { Power, Settings, Droplet, Sprout } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const QuickActions = () => {
  const { t } = useTranslation();
  
  const actions = [
    { label: t('quick.pump'), icon: Power, border: 'border-emerald-500', text: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/20' },
    { label: t('quick.fertigate'), icon: Sprout, border: 'border-indigo-500', text: 'text-indigo-400', hoverBg: 'hover:bg-indigo-500/20' },
    { label: t('quick.water'), icon: Droplet, border: 'border-blue-500', text: 'text-blue-400', hoverBg: 'hover:bg-blue-500/20' },
    { label: t('quick.settings'), icon: Settings, border: 'border-gray-500', text: 'text-gray-400', hoverBg: 'hover:bg-gray-500/20' },
  ];

  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-6 shadow-sm border border-emerald-500/20">
      <h3 className="font-mono text-sm tracking-widest font-bold text-emerald-400 mb-4 uppercase">{t('quick.title')}</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            key={index}
            className={`relative flex flex-col items-center justify-center gap-3 p-4 border rounded-none transition-all ${action.border} ${action.text} ${action.hoverBg} hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-transparent group overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
            <action.icon size={24} className="z-10" />
            <span className="text-xs font-mono tracking-widest uppercase z-10">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
