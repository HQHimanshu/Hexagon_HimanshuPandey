import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sprout, Droplets, Shield } from 'lucide-react';

const BestPractices = () => {
  const practices = [
    { icon: Droplets, title: 'Irrigation Best Practices', desc: 'Water early morning or late evening to reduce evaporation loss by 30%.', tip: 'Tip: Use soil moisture sensors to irrigate only when needed.' },
    { icon: Sprout, title: 'Crop Rotation', desc: 'Rotate crops every season to maintain soil health and reduce pest buildup.', tip: 'Tip: Legumes fix nitrogen, benefiting subsequent crops.' },
    { icon: Shield, title: 'Integrated Pest Management', desc: 'Combine biological, cultural, and chemical tools for sustainable pest control.', tip: 'Tip: Monitor pest levels with traps before spraying.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-transparent border border-gray-700/50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-[1px] bg-orange-500" />
      <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-orange-400" size={18} />
          <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">Best Practices</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {practices.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <item.icon size={18} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                <p className="text-emerald-400 text-xs mt-2 font-semibold">💡 {item.tip}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BestPractices;
