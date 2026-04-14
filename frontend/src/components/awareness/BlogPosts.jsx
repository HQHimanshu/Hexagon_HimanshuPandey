import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Calendar, Clock } from 'lucide-react';

const BlogPosts = () => {
  const posts = [
    { title: 'Optimizing Drip Irrigation for Tomato Yields', date: 'Apr 10, 2026', min: '5 min read', category: 'Irrigation' },
    { title: 'Organic Pest Control: A Comprehensive Guide', date: 'Apr 08, 2026', min: '8 min read', category: 'Pest Control' },
    { title: 'Understanding Soil Health Indicators', date: 'Apr 05, 2026', min: '6 min read', category: 'Soil Health' },
    { title: 'Monsoon Preparation Checklist for Farmers', date: 'Apr 01, 2026', min: '4 min read', category: 'Weather' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-transparent border border-gray-700/50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
      <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="text-emerald-400" size={18} />
          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Farming Insights</h3>
        </div>
        <button className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
          View All <ExternalLink size={12} />
        </button>
      </div>
      <div className="p-6 space-y-4">
        {posts.map((post, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer p-3 bg-gray-900/30 rounded-xl border border-gray-700/30 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-gray-200 group-hover:text-emerald-400 transition-colors flex-1">
                {post.title}
              </h4>
              <ExternalLink size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-semibold">{post.category}</span>
              <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {post.min}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BlogPosts;
