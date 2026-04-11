import React from 'react';
import { ThumbsUp } from 'lucide-react';

const BestPractices = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <ThumbsUp className="text-emerald-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Best Practices</h3>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <li>Always test soil pH before fertilizing.</li>
        <li>Clean sensor probes monthly for accuracy.</li>
        <li>Utilize crop rotation for soil health.</li>
      </ul>
    </div>
  );
};

export default BestPractices;
