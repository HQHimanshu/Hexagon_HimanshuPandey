import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SensorCards from '../components/dashboard/SensorCards';
import AlertBanner from '../components/dashboard/AlertBanner';
import ResourceMetrics from '../components/dashboard/ResourceMetrics';
import AIChat from '../components/common/AIChat';
import api from '../utils/api';
import { Loader2, RefreshCw } from 'lucide-react';

const DEMO_DATA = {
  current_sensor_data: {
    temperature: 33.1,
    humidity: 60.8,
    soil_moisture_surface: 1023,
    soil_moisture_root: 1023,
    ph_level: 6.8,
    rain_detected: false,
    water_tank_level: 75,
    timestamp: new Date().toISOString()
  },
  weather: {
    temperature: 33, humidity: 65, condition: 'Partly Cloudy',
    description: 'partly cloudy', feels_like: 35, wind_speed: 3.5, pressure: 1013,
    forecast: [
      { day: 'Today', high: 34, low: 25, condition: 'Sunny', rain_probability: 10 },
      { day: 'Tomorrow', high: 32, low: 24, condition: 'Cloudy', rain_probability: 40 }
    ]
  },
  resource_summary: {
    total_water_used_liters: 1250, water_budget_liters: 10000,
    water_usage_percentage: 12.5, total_water_saved_liters: 850,
    total_cost_rupees: 4500, total_fertilizer_used_grams: 15500,
    status: 'OK', message: 'Within normal limits'
  },
  recent_alerts: [
    { id: 1, message_en: 'Soil moisture low - irrigate now', type: 'WARNING', channel: 'app', created_at: new Date().toISOString(), is_read: false }
  ]
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Try 1: Full metrics
      const res = await api.get('/dashboard/metrics', { timeout: 5000 });
      if (res.data) { setMetrics(res.data); setLastUpdate(new Date()); }
    } catch (e1) {
      try {
        // Try 2: Just sensor data
        const res = await api.get('/sensors/latest', { timeout: 5000 });
        if (res.data) {
          setMetrics({ ...DEMO_DATA, current_sensor_data: res.data });
        }
      } catch (e2) {
        // Try 3: Use demo data
        setMetrics(DEMO_DATA);
      }
    } finally {
      setLoading(false);
    }
  };

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
      className="p-4 sm:p-8 max-w-[1400px] mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-emerald-500/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {t('dashboard.command_center')}
          </h1>
          <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm">
            {t('dashboard.telemetry_active')}
            {lastUpdate && ` • ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>
        <button onClick={fetchMetrics} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Alerts */}
      {metrics?.recent_alerts?.length > 0 && <AlertBanner alerts={metrics.recent_alerts} />}

      {/* Sensors */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
        <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            {t('dashboard.live_sensors')}
          </h2>
        </div>
        <div className="p-6"><SensorCards data={metrics?.current_sensor_data} /></div>
      </div>

      {/* Resources + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-orange-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
              {t('dashboard.resource_util')}
            </h2>
          </div>
          <div className="p-6"><ResourceMetrics data={metrics?.resource_summary} /></div>
        </div>
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-blue-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              {t('dashboard.neural_advice')}
            </h2>
          </div>
          <div className="p-4"><AIChat currentSensors={metrics?.current_sensor_data} /></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
