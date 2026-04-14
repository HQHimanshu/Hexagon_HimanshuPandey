import React from 'react';
import { motion } from 'framer-motion';
import { Users, Quote, Star } from 'lucide-react';

const CommunityStories = () => {
  const stories = [
    { name: 'Ramesh Patil', location: 'Nashik, MH', quote: 'KrishiDrishti helped me reduce water usage by 40% while increasing yield.', crop: 'Grapes', rating: 5 },
    { name: 'Sunita Deshmukh', location: 'Pune, MH', quote: 'The AI advice was spot-on for my cotton crop. Best decision ever!', crop: 'Cotton', rating: 5 },
    { name: 'Vijay Kulkarni', location: 'Solapur, MH', quote: 'Real-time soil data changed how I irrigate. No more guesswork.', crop: 'Soybean', rating: 4 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-transparent border border-gray-700/50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-32 h-[1px] bg-blue-500" />
      <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Users className="text-blue-400" size={18} />
          <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">Community Stories</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {stories.map((story, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50"
          >
            <Quote size={16} className="text-blue-500/30 mb-2" />
            <p className="text-gray-300 text-sm italic leading-relaxed mb-3">"{story.quote}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">{story.name}</p>
                <p className="text-gray-500 text-xs">{story.location} • {story.crop}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < story.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CommunityStories;
