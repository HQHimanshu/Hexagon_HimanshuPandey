import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, CloudRain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SensorCards = ({ data }) => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('sensor.temperature'),
      value: data?.temperature ? `${data.temperature}°C` : '--',
      icon: Thermometer, color: 'text-orange-400', shadow: 'rgba(249,115,22,0.3)', bg: 'bg-orange-500/10'
    },
    {
      title: t('sensor.humidity'),
      value: data?.humidity ? `${data.humidity}%` : '--',
      icon: Droplets, color: 'text-teal-400', shadow: 'rgba(20,184,166,0.3)', bg: 'bg-teal-500/10'
    },
    {
      title: t('sensor.soil_moisture'),
      value: data?.soil_moisture_root ? `${((1 - data.soil_moisture_root / 1023) * 100).toFixed(0)}%` : '--',
      icon: CloudRain, color: 'text-blue-400', shadow: 'rgba(59,130,246,0.3)', bg: 'bg-blue-500/10'
    },
    {
      title: t('sensor.rain'),
      value: data?.rain_detected ? 'RAINING' : 'DRY',
      icon: CloudRain, color: data?.rain_detected ? 'text-indigo-400' : 'text-gray-500', shadow: 'rgba(99,102,241,0.3)', bg: data?.rain_detected ? 'bg-indigo-500/20' : 'bg-gray-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5, boxShadow: `0 0 20px ${card.shadow}` }}
          className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-sm border border-gray-700/50 hover:border-emerald-500/50 transition-colors group overflow-hidden"
        >
          {/* Cyber accents */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <motion.div 
             className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent hidden group-hover:block"
             animate={{ y: [0, 150, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <motion.div 
               whileHover={{ rotate: [0, -10, 10, -10, 0] }}
               transition={{ duration: 0.5 }}
               className={`p-3 rounded-lg border border-gray-700 shadow-inner ${card.bg} cursor-pointer`}
            >
              <card.icon size={24} className={card.color} />
            </motion.div>
          </div>
          <h3 className="text-xs font-mono tracking-widest text-gray-500 dark:text-gray-400 mb-1 uppercase relative z-10">{card.title}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] font-mono relative z-10">
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default SensorCards;
