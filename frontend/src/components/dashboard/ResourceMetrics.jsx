import React from 'react'
import { Droplets, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react'
import { formatVolume, formatWeight, formatCurrency } from '../../utils/formatters'

const ResourceMetrics = ({ resourceSummary }) => {
  if (!resourceSummary) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Resource Usage</h3>
        <div className="text-gray-400 text-center py-8">No resource data available</div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK': return 'text-green-400'
      case 'WARNING': return 'text-yellow-400'
      case 'CRITICAL': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      OK: 'badge-success',
      WARNING: 'badge-warning',
      CRITICAL: 'badge-danger'
    }
    return `badge ${colors[status] || 'badge-info'}`
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">💧 Resource Usage (30 days)</h3>
        <span className={getStatusBadge(resourceSummary.status)}>
          {resourceSummary.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Water Usage */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplets className="text-blue-400" size={20} />
              <span className="text-gray-300">Water Usage</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{formatVolume(resourceSummary.total_water_used_liters)}</div>
              <div className="text-gray-400 text-xs">of {formatVolume(resourceSummary.water_budget_liters)} budget</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                resourceSummary.water_usage_percentage >= 100
                  ? 'bg-red-500'
                  : resourceSummary.water_usage_percentage >= 80
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, resourceSummary.water_usage_percentage)}%` }}
            ></div>
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {resourceSummary.water_usage_percentage.toFixed(1)}% used
          </div>
        </div>

        {/* Savings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-900/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="text-green-400" size={16} />
              <span className="text-gray-300 text-xs">Water Saved</span>
            </div>
            <div className="text-green-400 font-bold text-lg">
              {formatVolume(resourceSummary.total_water_saved_liters)}
            </div>
          </div>

          <div className="bg-purple-900/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <IndianRupee className="text-purple-400" size={16} />
              <span className="text-gray-300 text-xs">Total Cost</span>
            </div>
            <div className="text-purple-400 font-bold text-lg">
              {formatCurrency(resourceSummary.total_cost_rupees)}
            </div>
          </div>
        </div>

        {/* Fertilizer */}
        <div className="bg-amber-900/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="text-amber-400" size={16} />
            <span className="text-gray-300 text-xs">Fertilizer Used</span>
          </div>
          <div className="text-amber-400 font-bold">
            {formatWeight(resourceSummary.total_fertilizer_used_grams)}
          </div>
        </div>

        {/* Message */}
        {resourceSummary.message && (
          <div className={`text-sm p-3 rounded-lg ${
            resourceSummary.status === 'CRITICAL'
              ? 'bg-red-900/50 text-red-200 border border-red-700'
              : resourceSummary.status === 'WARNING'
              ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700'
              : 'bg-green-900/50 text-green-200 border border-green-700'
          }`}>
            {resourceSummary.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResourceMetrics
