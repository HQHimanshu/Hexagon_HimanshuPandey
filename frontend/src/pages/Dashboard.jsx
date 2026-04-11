import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SensorCards from '../components/dashboard/SensorCards';
import AlertBanner from '../components/dashboard/AlertBanner';
import ResourceMetrics from '../components/dashboard/ResourceMetrics';
import AIChat from '../components/common/AIChat';
import api from '../utils/api';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/dashboard/metrics');
        setMetrics(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics from FastAPI', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [t]);

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
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut", staggerChildren: 0.15 }}
      className="p-4 sm:p-8 max-w-[1400px] mx-auto space-y-6"
    >
      <div className="flex items-center justify-between mb-8 relative z-10 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl border border-emerald-500/50 flex items-center justify-center">
            <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 rotate-45"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
               {t('dashboard.command_center')}
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm tracking-widest uppercase">
               {t('dashboard.telemetry_active')}
            </p>
          </div>
        </div>
      </div>

      <AlertBanner alerts={metrics?.recent_alerts} />
      
      {/* Dynamic Command Grid Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-8 mt-8"
      >
         
         {/* Traditional Hardware Telemetry */}
         <div className="flex flex-col gap-8 relative z-10">
            <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
               <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 w-full inline-block backdrop-blur-md">
                 <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    {t('dashboard.live_sensors')}
                 </h2>
               </div>
               <div className="p-6">
                 <SensorCards data={metrics?.current_sensor_data} />
               </div>
            </div>

            <div className="bg-transparent border border-gray-700/50 relative overflow-hidden mt-4">
               <div className="absolute top-0 right-0 w-32 h-[1px] bg-orange-500" />
               <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 w-full inline-block backdrop-blur-md">
                 <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-none"></span>
                    {t('dashboard.resource_util')}
                 </h2>
               </div>
               <div className="p-6">
                 <ResourceMetrics data={metrics?.resource_summary} />
               </div>
            </div>
         </div>

      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
