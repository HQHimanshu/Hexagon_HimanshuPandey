import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ResourceMetrics = ({ data }) => {
  const { t } = useTranslation();
  
  // Real stats from DB logic or fallback
  const waterEff = data?.water_saved_liters ? `${data.water_saved_liters}%` : '85%';
  const powerCon = data?.power_used_percent ? `${data.power_used_percent}%` : '62%';
  const fertOpti = data?.fertilizer_efficiency ? `${data.fertilizer_efficiency}%` : '92%';

  return (
    <div className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-6 border border-emerald-500/20 overflow-hidden group">
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="space-y-6 mt-4 relative z-10">
        <div>
          <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2">
            <span className="text-gray-400">{t('resource.water_eff')}</span>
            <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{waterEff}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-none h-2 overflow-hidden border border-emerald-900/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: waterEff }}
              transition={{ duration: 1.5, type: "spring", stiffness: 50, delay: 0.2 }}
              className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.8)] relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px] animate-[pulse_2s_linear_infinite]"></div>
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2">
            <span className="text-gray-400">{t('resource.power_con')}</span>
            <span className="text-orange-400 font-bold drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">{powerCon}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-none h-2 overflow-hidden border border-orange-900/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: powerCon }}
              transition={{ duration: 1.5, type: "spring", stiffness: 50, delay: 0.4 }}
              className="bg-orange-500 h-full shadow-[0_0_10px_rgba(249,115,22,0.8)] relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px] animate-[pulse_2s_linear_infinite]"></div>
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2">
            <span className="text-gray-400">{t('resource.fert_optimum')}</span>
            <span className="text-indigo-400 font-bold drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">{fertOpti}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-none h-2 overflow-hidden border border-indigo-900/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: fertOpti }}
              transition={{ duration: 1.5, type: "spring", stiffness: 50, delay: 0.6 }}
              className="bg-indigo-500 h-full shadow-[0_0_10px_rgba(99,102,241,0.8)] relative"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px] animate-[pulse_2s_linear_infinite]"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMetrics;
