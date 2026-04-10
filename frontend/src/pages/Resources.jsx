import React, { useState, useEffect } from 'react'
import { resourceAPI } from '../services/api'
import ResourceMetrics from '../components/dashboard/ResourceMetrics'
import { Loader2, Plus, FileText } from 'lucide-react'
import { formatVolume, formatWeight, formatCurrency } from '../utils/formatters'

const Resources = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [history, setHistory] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    water_used_liters: 0,
    irrigation_duration_min: 0,
    fertilizer_used_grams: 0,
    fertilizer_type: '',
    estimated_cost_rupees: 0,
    energy_kwh: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [summaryRes, historyRes] = await Promise.all([
        resourceAPI.getSummary(30),
        resourceAPI.getHistory(30)
      ])
      setSummary(summaryRes.data)
      setHistory(historyRes.data)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await resourceAPI.logUsage(formData)
      setShowForm(false)
      setFormData({
        water_used_liters: 0,
        irrigation_duration_min: 0,
        fertilizer_used_grams: 0,
        fertilizer_type: '',
        estimated_cost_rupees: 0,
        energy_kwh: 0
      })
      fetchData()
    } catch (err) {
      console.error('Failed to log resource:', err)
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
        <h1 className="text-3xl font-bold text-white">Resource Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Log Usage</span>
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <ResourceMetrics resourceSummary={summary} />
        </div>
      )}

      {/* Log Form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <FileText size={20} />
            <span>Log Resource Usage</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Water Used (liters)</label>
                <input
                  type="number"
                  value={formData.water_used_liters}
                  onChange={(e) => setFormData({...formData, water_used_liters: Number(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Irrigation Duration (min)</label>
                <input
                  type="number"
                  value={formData.irrigation_duration_min}
                  onChange={(e) => setFormData({...formData, irrigation_duration_min: Number(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Fertilizer (grams)</label>
                <input
                  type="number"
                  value={formData.fertilizer_used_grams}
                  onChange={(e) => setFormData({...formData, fertilizer_used_grams: Number(e.target.value)})}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Fertilizer Type</label>
                <select
                  value={formData.fertilizer_type}
                  onChange={(e) => setFormData({...formData, fertilizer_type: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option value="Urea">Urea</option>
                  <option value="DAP">DAP</option>
                  <option value="Potash">Potash</option>
                  <option value="NPK">NPK</option>
                  <option value="Organic">Organic</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Usage History (30 days)</h3>
        {history.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No records yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Water Used</th>
                  <th className="pb-3">Water Saved</th>
                  <th className="pb-3">Fertilizer</th>
                  <th className="pb-3">Cost</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3">{formatVolume(item.water_used_liters)}</td>
                    <td className="py-3 text-green-400">{formatVolume(item.water_saved_liters)}</td>
                    <td className="py-3">{formatWeight(item.fertilizer_used_grams)}</td>
                    <td className="py-3">{formatCurrency(item.estimated_cost_rupees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Resources
