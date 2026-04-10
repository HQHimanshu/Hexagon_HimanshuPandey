import React, { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatDateTime, formatVolume } from '../utils/formatters'
import { Loader2, TrendingUp, Droplets } from 'lucide-react'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [trends, setTrends] = useState(null)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetchTrends()
  }, [days])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const response = await dashboardAPI.getTrends(days)
      setTrends(response.data)
    } catch (err) {
      console.error('Failed to fetch trends:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Analytics & Trends</h1>
        <div className="flex space-x-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg ${
                days === d
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {trends && (
        <>
          {/* Sensor Trends */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Sensor Trends</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.sensor_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#9CA3AF"
                  tickFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#FFF' }}
                />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#EF4444" name="Temp (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#3B82F6" name="Humidity (%)" />
                <Line type="monotone" dataKey="soil_moisture" stroke="#06B6D4" name="Soil Moisture" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Usage */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Droplets size={20} />
              <span>Resource Usage</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends.resource_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tickFormatter={(val) => new Date(val).toLocaleDateString()}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#FFF' }}
                  formatter={(value) => formatVolume(value)}
                />
                <Legend />
                <Bar dataKey="water_used" fill="#3B82F6" name="Water Used" />
                <Bar dataKey="water_saved" fill="#10B981" name="Water Saved" />
                <Bar dataKey="fertilizer_used" fill="#F59E0B" name="Fertilizer (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics
