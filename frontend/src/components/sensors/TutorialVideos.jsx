import React from 'react';
import { Video } from 'lucide-react';

const TutorialVideos = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Video className="text-red-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tutorial Videos</h3>
      </div>
      <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Video Placeholder</p>
      </div>
    </div>
  );
};

export default TutorialVideos;
