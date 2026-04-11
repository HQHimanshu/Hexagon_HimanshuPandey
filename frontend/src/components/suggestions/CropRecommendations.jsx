import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';

const crops = [
  { name: 'Wheat (HD-2967)', match: '98%', reason: 'Optimal soil pH and upcoming temperature patterns align perfectly.', season: 'Rabi' },
  { name: 'Mustard', match: '85%', reason: 'Good alternative, requires less water which suits current reservoir levels.', season: 'Rabi' }
];

const CropRecommendations = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="text-emerald-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Crop Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        {crops.map((crop, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {crop.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300">{crop.season}</span>
                </h4>
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-sm border border-emerald-100 dark:border-emerald-800">
                {crop.match} Match
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{crop.reason}</p>
            <button className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Guide <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRecommendations;
