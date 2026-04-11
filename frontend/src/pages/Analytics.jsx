import React from 'react';
import { motion } from 'framer-motion';
import SensorCharts from '../components/analytics/SensorCharts';
import ResourceUsage from '../components/analytics/ResourceUsage';
import YieldPrediction from '../components/analytics/YieldPrediction';
import ComparisonView from '../components/analytics/ComparisonView';

const Analytics = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Deep dive into historical data and predictions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SensorCharts />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <YieldPrediction />
            <ComparisonView />
          </div>
        </div>
        <div className="lg:col-span-1">
          <ResourceUsage />
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
