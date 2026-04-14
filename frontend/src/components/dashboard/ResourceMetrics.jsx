import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { formatVolume, formatWeight, formatCurrency } from '../../utils/formatters';

const ResourceMetrics = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No resource data available</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK': return 'text-emerald-400';
      case 'WARNING': return 'text-amber-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Water Usage */}
      <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-400" size={18} />
            <span className="text-gray-300 text-sm font-semibold">Water Usage</span>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">{formatVolume(data.total_water_used_liters)}</div>
            <div className="text-gray-500 text-xs">of {formatVolume(data.water_budget_liters)} budget</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, data.water_usage_percentage)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              data.water_usage_percentage >= 100 ? 'bg-red-500' :
              data.water_usage_percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </div>
        <div className="text-gray-400 text-xs mt-2 font-mono">
          {data.water_usage_percentage.toFixed(1)}% used
        </div>
      </div>

      {/* Savings Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-emerald-900/20 rounded-xl border border-emerald-700/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-emerald-400" size={16} />
            <span className="text-gray-400 text-xs font-semibold">Water Saved</span>
          </div>
          <div className="text-emerald-400 font-bold text-lg font-mono">
            {formatVolume(data.total_water_saved_liters)}
          </div>
        </div>

        <div className="p-3 bg-purple-900/20 rounded-xl border border-purple-700/30">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="text-purple-400" size={16} />
            <span className="text-gray-400 text-xs font-semibold">Total Cost</span>
          </div>
          <div className="text-purple-400 font-bold text-lg font-mono">
            {formatCurrency(data.total_cost_rupees)}
          </div>
        </div>
      </div>

      {/* Fertilizer */}
      <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="text-amber-400" size={16} />
          <span className="text-gray-400 text-xs font-semibold">Fertilizer Used</span>
        </div>
        <div className="text-amber-400 font-bold font-mono">
          {formatWeight(data.total_fertilizer_used_grams)}
        </div>
      </div>

      {/* Status Message */}
      {data.message && (
        <div className={`p-3 rounded-xl border text-sm ${
          data.status === 'CRITICAL'
            ? 'bg-red-900/20 border-red-700/30 text-red-300'
            : data.status === 'WARNING'
            ? 'bg-amber-900/20 border-amber-700/30 text-amber-300'
            : 'bg-emerald-900/20 border-emerald-700/30 text-emerald-300'
        }`}>
          <span className={`font-bold ${getStatusColor(data.status)}`}>[{data.status}]</span> {data.message}
        </div>
      )}
    </div>
  );
};

export default ResourceMetrics;
