import React from 'react';
import { CloudRain, Sun, Wind } from 'lucide-react';

const WeatherForecast = () => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-medium text-blue-100">Current Weather</h3>
          <p className="text-3xl font-bold mt-1">28°C</p>
          <p className="text-sm text-blue-100 mt-1">Partly Cloudy</p>
        </div>
        <Sun size={48} className="text-yellow-300 drop-shadow-md" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-400/30">
        <div className="text-center">
          <Wind size={20} className="mx-auto mb-1 text-blue-200" />
          <p className="text-xs text-blue-100">Wind</p>
          <p className="font-semibold text-sm">12 km/h</p>
        </div>
        <div className="text-center border-l border-r border-blue-400/30">
          <CloudRain size={20} className="mx-auto mb-1 text-blue-200" />
          <p className="text-xs text-blue-100">Rain</p>
          <p className="font-semibold text-sm">20%</p>
        </div>
        <div className="text-center">
          <Sun size={20} className="mx-auto mb-1 text-blue-200" />
          <p className="text-xs text-blue-100">UV</p>
          <p className="font-semibold text-sm">High</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
