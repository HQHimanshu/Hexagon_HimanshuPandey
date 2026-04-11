import React from 'react';
import { Beaker } from 'lucide-react';

const FertilizerAdvice = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Beaker className="text-purple-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fertilizer Advice</h3>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">NPK Ratio Warning</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Nitrogen levels in Sector B are lower than optimal. Consider applying 20kg/acre of Urea in the next 3 days.</p>
      </div>
    </div>
  );
};

export default FertilizerAdvice;
