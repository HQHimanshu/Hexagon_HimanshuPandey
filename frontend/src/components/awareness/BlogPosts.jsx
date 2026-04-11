import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

const BlogPosts = () => {
  const posts = [
    { title: 'Optimizing Drip Irrigation for Tomato Yields', date: 'Oct 12, 2023', min: '5 min read' },
    { title: 'Organic Pest Control: A Comprehensive Guide', date: 'Oct 08, 2023', min: '8 min read' },
    { title: 'Understanding Soil Health Indicators', date: 'Sep 29, 2023', min: '6 min read' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-emerald-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Farming Insights</h3>
        </div>
        <button className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {posts.map((post, idx) => (
          <div key={idx} className="group cursor-pointer">
            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              {post.title}
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.min}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
