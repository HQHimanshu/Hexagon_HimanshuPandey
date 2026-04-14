import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Loader2, Thermometer, Droplets, Waves, CloudRain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState([]);
  const [days, setDays] = useState(1);
  const [activeChart, setActiveChart] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    console.log('[Analytics] Fetching data for', days, 'days...');
    
    // ALWAYS start with demo data immediately so page renders
    const now = Date.now();
    const demoData = [
      { timestamp: new Date(now - 300000).toISOString(), temperature: 32.5, humidity: 62, soil_moisture: 450 },
      { timestamp: new Date(now - 240000).toISOString(), temperature: 32.8, humidity: 61.5, soil_moisture: 455 },
      { timestamp: new Date(now - 180000).toISOString(), temperature: 33.0, humidity: 61, soil_moisture: 460 },
      { timestamp: new Date(now - 120000).toISOString(), temperature: 33.1, humidity: 60.8, soil_moisture: 465 },
      { timestamp: new Date(now - 60000).toISOString(), temperature: 33.2, humidity: 60.5, soil_moisture: 470 },
      { timestamp: new Date(now).toISOString(), temperature: 33.1, humidity: 60.8, soil_moisture: 473 },
    ];
    setSensorData(demoData);

    try {
      // Try sensor history in background
      console.log('[Analytics] Fetching sensor history...');
      const res = await api.get(`/sensors/history?hours=${days * 24}`, { timeout: 8000 });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        console.log('[Analytics] Got', res.data.length, 'readings from backend');
        const formatted = res.data.slice(-100).map(r => ({
          timestamp: r.timestamp,
          temperature: r.temperature || 0,
          humidity: r.humidity || 0,
          soil_moisture: r.soil_moisture_root || r.soil_moisture_surface || 0
        }));
        setSensorData(formatted);
        setError('');
      } else {
        console.warn('[Analytics] No data from backend, using demo');
        setError('Showing demo data - connect Arduino for live data');
      }
    } catch (e) {
      console.warn('[Analytics] Backend fetch failed:', e.message, '- using demo data');
      setError('Showing demo data - connect Arduino for live data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (loading && sensorData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-emerald-500/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Analytics</h1>
          <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm">{sensorData.length} data points | Last {days} day(s)</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1.5 border border-gray-700">
          <Calendar size={16} className="text-gray-400 ml-2" />
          {[1, 3, 7].map(d => (
            <button key={d} onClick={() => setDays(d)} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${days === d ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Chart Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All', icon: BarChart3 },
          { id: 'temp', label: 'Temp', icon: Thermometer },
          { id: 'humidity', label: 'Humidity', icon: Droplets },
          { id: 'soil', label: 'Soil', icon: Waves }
        ].map(chart => (
          <button key={chart.id} onClick={() => setActiveChart(chart.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all ${activeChart === chart.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>
            <chart.icon size={16} /><span className="hidden sm:inline">{chart.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      {sensorData.length > 0 ? (
        <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
          <div className="bg-gray-800/80 px-6 py-2 border-b border-gray-700/50 backdrop-blur-md">
            <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Sensor Trends</h2>
          </div>
          <div className="p-6 bg-gray-900/50">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={formatTime} />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} labelFormatter={(val) => new Date(val).toLocaleString()} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {(activeChart === 'all' || activeChart === 'temp') && <Area type="monotone" dataKey="temperature" stroke="#EF4444" fill="url(#tempGrad)" strokeWidth={2} name="🌡️ Temp °C" />}
                {(activeChart === 'all' || activeChart === 'humidity') && <Area type="monotone" dataKey="humidity" stroke="#3B82F6" fill="url(#humGrad)" strokeWidth={2} name="💧 Humidity %" />}
                {(activeChart === 'all' || activeChart === 'soil') && <Area type="monotone" dataKey="soil_moisture" stroke="#10B981" fill="url(#soilGrad)" strokeWidth={2} name="🌱 Soil ADC" />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <BarChart3 size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No data available</p>
          <button onClick={fetchData} className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600">Refresh</button>
        </div>
      )}

      {/* Stats */}
      {sensorData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Temp</p>
            <p className="text-2xl font-bold text-red-400">{(sensorData.reduce((a, b) => a + (b.temperature || 0), 0) / sensorData.length).toFixed(1)}°C</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Humidity</p>
            <p className="text-2xl font-bold text-blue-400">{(sensorData.reduce((a, b) => a + (b.humidity || 0), 0) / sensorData.length).toFixed(0)}%</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Soil Reading</p>
            <p className="text-2xl font-bold text-emerald-400">{sensorData[sensorData.length - 1]?.soil_moisture || 0} ADC</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
