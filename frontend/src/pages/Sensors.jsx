import React from 'react';
import { motion } from 'framer-motion';
import SensorMarketplace from '../components/sensors/SensorMarketplace';
import SetupGuide from '../components/sensors/SetupGuide';
import CodeRepository from '../components/sensors/CodeRepository';
import TutorialVideos from '../components/sensors/TutorialVideos';

const Sensors = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sensor Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your IoT devices and explore marketplace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
           <SensorMarketplace />
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <SetupGuide />
             <CodeRepository />
           </div>
        </div>
        <div className="lg:col-span-1">
           <TutorialVideos />
        </div>
      </div>
    </motion.div>
  );
};

export default Sensors;
