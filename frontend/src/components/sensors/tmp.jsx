import React from 'react';
import { FileText, Cpu, Video, Github } from 'lucide-react';

export const SetupGuide = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Setup Guide</h3>
      </div>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <li className="flex gap-2"><Cpu size={16} className="text-blue-400" /> 1. Connect ESP32 to Wi-Fi</li>
        <li className="flex gap-2"><Cpu size={16} className="text-blue-400" /> 2. Wire the NPK/Moisture probe to Analog pins</li>
        <li className="flex gap-2"><Cpu size={16} className="text-blue-400" /> 3. Power on the device via Solar/Battery</li>
      </ul>
    </div>
  );
};

export const CodeRepository = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Github className="text-gray-900 dark:text-white" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hardware Code</h3>
      </div>
      <div className="bg-gray-900 text-gray-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
        <p>{`// ESP32 Node Firmware`}</p>
        <p>{`#include <WiFi.h>`}</p>
        <p>{`void setup() { ... }`}</p>
      </div>
    </div>
  );
};

export const TutorialVideos = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Video className="text-red-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tutorial Videos</h3>
      </div>
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Video Player Placeholder</p>
      </div>
    </div>
  );
};
