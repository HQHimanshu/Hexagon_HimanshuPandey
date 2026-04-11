import React from 'react';
import { motion } from 'framer-motion';
import BlogPosts from '../components/awareness/BlogPosts';
import BestPractices from '../components/awareness/BestPractices';
import CommunityStories from '../components/awareness/CommunityStories';

const Awareness = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Community & Learning</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with best practices and community stories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
           <BlogPosts />
           <BestPractices />
        </div>
        <div className="lg:col-span-1">
           <CommunityStories />
        </div>
      </div>
    </motion.div>
  );
};

export default Awareness;
