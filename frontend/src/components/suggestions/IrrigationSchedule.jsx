import React from 'react';
import { Droplets, Clock } from 'lucide-react';

const schedule = [
  { block: 'Field A (North)', time: '05:00 AM', duration: '45 mins', status: 'Scheduled' },
  { block: 'Field B (South)', time: '06:00 AM', duration: '30 mins', status: 'Pending Sensor Check' },
  { block: 'Polyhouse 1', time: '08:00 AM', duration: '15 mins (Drip)', status: 'Scheduled' }
];

const IrrigationSchedule = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Droplets className="text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Smart Irrigation Plan</h3>
      </div>

      <div className="relative border-l-2 border-blue-100 dark:border-blue-900 ml-3 space-y-6">
        {schedule.map((item, idx) => (
          <div key={idx} className="pl-6 relative">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-white dark:border-gray-800"></div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.block}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
              <span>{item.duration}</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IrrigationSchedule;
