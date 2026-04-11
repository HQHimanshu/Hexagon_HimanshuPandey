import React from 'react';
import { Github } from 'lucide-react';

const CodeRepository = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
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

export default CodeRepository;
