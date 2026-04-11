import React from 'react';
import { User, LogOut } from 'lucide-react';

const Profile = () => {
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center text-white mb-4">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-1">Farmer Pro</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">+91 98765 43210</p>
        
        <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
          <LogOut size={20} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
