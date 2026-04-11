import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} KrishiDrishti. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">Contact Support</a>
      </div>
    </footer>
  );
};

export default Footer;
