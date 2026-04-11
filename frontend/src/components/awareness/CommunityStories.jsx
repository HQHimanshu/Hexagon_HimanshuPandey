import React from 'react';
import { Users } from 'lucide-react';

const CommunityStories = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
      <div className="flex items-center gap-3 mb-4">
        <Users className="text-teal-600 dark:text-teal-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Farmer Spotlight</h3>
      </div>
      <p className="italic text-sm text-gray-600 dark:text-gray-300 mb-3">
        "Using KrishiDrishti's IoT sensors, I managed to reduce my water usage by 30% while actually increasing my tomato yield!"
      </p>
      <p className="text-xs font-bold text-teal-700 dark:text-teal-300">- Ramesh, Maharashtra</p>
    </div>
  );
};

export default CommunityStories;
