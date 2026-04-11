import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';

const YieldPrediction = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
          <Target size={24} />
        </div>
        <h3 className="text-lg font-bold">AI Yield Prediction</h3>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-emerald-100 text-sm mb-1">Expected Output (Wheat)</p>
        <div className="text-4xl font-extrabold flex items-center justify-center gap-2">
          4.2 <span className="text-2xl font-medium">Tons/Acre</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 flex items-center gap-4">
        <TrendingUp className="text-emerald-300" />
        <p className="text-sm">
          Parameters indicate a <strong className="text-white">+12%</strong> increase from last season's yield due to optimal moisture management.
        </p>
      </div>
    </div>
  );
};

export default YieldPrediction;
