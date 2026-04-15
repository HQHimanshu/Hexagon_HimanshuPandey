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
  const [weatherUpdate, setWeatherUpdate] = useState(null);

  useEffect(() => {
    // Fetch sensors frequently for live updates (every 5 seconds)
    fetchSensorData();
    const sensorInterval = setInterval(fetchSensorData, 5000);
    
    // Fetch weather less frequently (every 5 minutes = 300 seconds)
    fetchWeatherData();
    const weatherInterval = setInterval(fetchWeatherData, 300000);
    
    return () => {
      clearInterval(sensorInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  // Fetch ONLY sensor data for live updates
  const fetchSensorData = async () => {
    try {
      console.log('🔴 Dashboard: Fetching LIVE sensor data...');
      const res = await api.get('/sensors/latest', { timeout: 5000 });
      if (res.data) { 
        console.log('✅ Dashboard: Got LIVE sensor data:', res.data);
        setMetrics(prev => ({
          ...prev,
          current_sensor_data: res.data
        }));
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.log('⚠️ Dashboard: Sensor fetch failed -', e.message);
    }
  };

  // Fetch weather data separately (every 5 minutes)
  const fetchWeatherData = async () => {
    try {
      console.log('🌤️  Dashboard: Fetching LIVE weather data...');
      const res = await api.get('/dashboard/metrics', { timeout: 12000 });
      if (res.data) { 
        console.log('✅ Dashboard: Got LIVE weather data');
        setMetrics(prev => ({
          ...prev,
          weather: res.data.weather,
          resource_summary: res.data.resource_summary,
          recent_alerts: res.data.recent_alerts
        }));
        setWeatherUpdate(new Date());
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.log('⚠️ Dashboard: Weather/metrics API failed -', e.message);
    }
  };

  // Initial load with all data
  useEffect(() => {
    const initialLoad = async () => {
      try {
        console.log('⚙️ Dashboard: Initial load...');
        const res = await api.get('/dashboard/metrics', { timeout: 12000 });
        if (res.data) {
          console.log('✅ Dashboard: Initial data loaded');
          setMetrics(res.data);
          setLastUpdate(new Date());
          setWeatherUpdate(new Date());
          setLoading(false);
        }
      } catch (e) {
        console.log('⚠️ Dashboard: Initial load failed -', e.message);
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

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
          <div className="flex gap-4 mt-1 text-xs font-mono text-gray-500 dark:text-gray-400">
            <span className="text-emerald-600 dark:text-emerald-400">
              {t('dashboard.telemetry_active')} {lastUpdate && lastUpdate.toLocaleTimeString()}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              🌤️ Weather {weatherUpdate && weatherUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSensorData} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20" title="Refresh sensors">
            <RefreshCw size={16} /> Sensors
          </button>
          <button onClick={fetchWeatherData} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/20" title="Refresh weather">
            <RefreshCw size={16} /> Weather
          </button>
        </div>
      </div>

      {/* Alerts */}
      {metrics?.recent_alerts?.length > 0 && <AlertBanner alerts={metrics.recent_alerts} />}

      {/* LIVE WEATHER Section */}
      {metrics?.weather && (
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-blue-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              LIVE WEATHER (Updates: Every 5 Minutes)
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Temperature */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Temperature</h3>
                <p className="text-3xl font-bold text-red-400">{metrics.weather.temperature?.toFixed(1)}°C</p>
                <p className="text-xs text-gray-500 mt-1">Feels like {metrics.weather.feels_like?.toFixed(1)}°C</p>
              </motion.div>

              {/* Humidity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Humidity</h3>
                <p className="text-3xl font-bold text-blue-400">{metrics.weather.humidity}%</p>
                <p className="text-xs text-gray-500 mt-1">Moisture Level</p>
              </motion.div>

              {/* Condition */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Condition</h3>
                <p className="text-sm font-bold text-sky-400 capitalize">{metrics.weather.condition || 'Clear'}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{metrics.weather.description || 'Neutral'}</p>
              </motion.div>

              {/* Wind Speed */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Wind Speed</h3>
                <p className="text-3xl font-bold text-cyan-400">{metrics.weather.wind_speed?.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">m/s</p>
              </motion.div>

              {/* Pressure */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Pressure</h3>
                <p className="text-3xl font-bold text-purple-400">{metrics.weather.pressure}</p>
                <p className="text-xs text-gray-500 mt-1">hPa</p>
              </motion.div>

              {/* Rain */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50">
                <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase">Rain (1h)</h3>
                <p className="text-3xl font-bold text-indigo-400">{(metrics.weather.rain || 0).toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">mm</p>
              </motion.div>
            </div>
            {metrics.weather.alert && (
              <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-300 text-sm">
                ⚠️ {metrics.weather.alert}
              </div>
            )}
          </div>
        </div>
      )}

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
