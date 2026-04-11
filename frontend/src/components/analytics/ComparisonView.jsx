import React from 'react';

const ComparisonView = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Season vs Season</h3>
      
      <div className="space-y-4">
        {[
          { label: 'Water Saved', thisSeason: '1.2M L', lastSeason: '900K L', trend: 'up' },
          { label: 'Fertilizer Used', thisSeason: '450 kg', lastSeason: '520 kg', trend: 'down' },
          { label: 'Pest Incidents', thisSeason: '2', lastSeason: '7', trend: 'down' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-400 line-through">{item.lastSeason}</span>
              <span className={`text-sm font-bold ${item.trend === 'down' ? 'text-emerald-500' : 'text-blue-500'}`}>
                {item.thisSeason}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonView;
