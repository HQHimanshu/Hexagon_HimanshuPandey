import React from 'react';
import { PackageSearch, ShoppingCart, Star } from 'lucide-react';

const products = [
  { name: 'KrishiDrishti Basic Node', price: '₹1,499', rating: 4.8 },
  { name: 'Soil NPK Sensor Pro', price: '₹3,299', rating: 4.9 },
  { name: 'Weather Station Mini', price: '₹4,500', rating: 4.7 }
];

const SensorMarketplace = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <PackageSearch className="text-emerald-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sensor Marketplace</h3>
      </div>
      
      <div className="space-y-4">
        {products.map((product, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</h4>
              <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                <Star size={12} fill="currentColor" /> {product.rating}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{product.price}</span>
              <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors text-gray-600 dark:text-gray-300">
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorMarketplace;
