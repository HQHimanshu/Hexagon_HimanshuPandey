import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertBanner = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) return null;

  const latestAlert = alerts[0];
  
  const getAlertConfig = (type) => {
    switch (type) {
      case 'CRITICAL':
        return {
          icon: AlertTriangle,
          color: 'red',
          borderColor: 'border-red-500/50',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          textLight: 'text-red-200/80',
          buttonBg: 'bg-red-500/10',
          buttonBorder: 'border-red-500/50',
          buttonText: 'text-red-400',
          buttonHover: 'hover:bg-red-500',
          shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
        };
      case 'WARNING':
        return {
          icon: AlertCircle,
          color: 'orange',
          borderColor: 'border-orange-500/50',
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-400',
          textLight: 'text-orange-200/80',
          buttonBg: 'bg-orange-500/10',
          buttonBorder: 'border-orange-500/50',
          buttonText: 'text-orange-400',
          buttonHover: 'hover:bg-orange-500',
          shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]'
        };
      default:
        return {
          icon: Info,
          color: 'blue',
          borderColor: 'border-blue-500/50',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          textLight: 'text-blue-200/80',
          buttonBg: 'bg-blue-500/10',
          buttonBorder: 'border-blue-500/50',
          buttonText: 'text-blue-400',
          buttonHover: 'hover:bg-blue-500',
          shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
        };
    }
  };

  const config = getAlertConfig(latestAlert.type);
  const Icon = config.icon;
  const message = latestAlert.message_en || latestAlert.message_hi || latestAlert.message_mr || 'Alert';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-transparent border ${config.borderColor} backdrop-blur-md rounded-xl p-4 sm:p-6 text-white ${config.shadow} flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative group`}
    >
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${config.color}-500 to-transparent opacity-50`} />
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${config.color}-500 to-transparent opacity-50`} />

      <div className="flex items-center gap-4">
        <div className={`p-2 ${config.bgColor} border ${config.borderColor} rounded-lg`}>
          <Icon size={24} className={config.textColor} />
        </div>
        <div>
          <h3 className={`font-mono font-bold text-lg ${config.textColor} tracking-wider uppercase`}>
            {latestAlert.type}
          </h3>
          <p className={`${config.textLight} font-mono text-xs tracking-wide`}>{message}</p>
        </div>
      </div>
      <div className="text-xs text-gray-500 font-mono">
        {new Date(latestAlert.timestamp).toLocaleTimeString()}
      </div>
    </motion.div>
  );
};

export default AlertBanner;
