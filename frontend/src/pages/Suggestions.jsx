import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AIChat from '../components/common/AIChat';
import { MessageSquareText } from 'lucide-react';

const Suggestions = () => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
           <MessageSquareText className="text-emerald-500" size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {t('chat.title', 'Smart Suggestions')}
          </h1>
          <p className="text-gray-500 dark:text-emerald-500/70 mt-1 font-mono text-sm">
            {t('chat.subtitle', 'Powered by local LLM')}
          </p>
        </div>
      </div>

      <div className="w-full">
         <AIChat />
      </div>

    </motion.div>
  );
};

export default Suggestions;
