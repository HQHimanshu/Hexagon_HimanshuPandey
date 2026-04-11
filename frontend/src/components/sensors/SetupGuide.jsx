import React from 'react';
import { FileText, Cpu } from 'lucide-react';

const SetupGuide = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Setup Guide</h3>
      </div>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <li className="flex gap-2"><Cpu size={16} className="text-blue-400 flex-shrink-0" /> 1. Connect ESP32 to Wi-Fi</li>
        <li className="flex gap-2"><Cpu size={16} className="text-blue-400 flex-shrink-0" /> 2. Wire the NPK/Moisture probe</li>
        <li className="flex gap-2"><Cpu size={16} className="text-blue-400 flex-shrink-0" /> 3. Power on the device</li>
      </ul>
    </div>
  );
};

export default SetupGuide;
