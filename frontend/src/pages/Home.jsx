import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Network, Radio, ScanLine, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import farmBg from '../assets/images/farm_bg.png';

// Futuristic Glitch/Typewriter component
const TechTypewriter = ({ text, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-2 bg-emerald-500 h-[1em] ml-1 align-middle"
      />
    </span>
  );
};

const FuturisticCard = ({ icon: Icon, title, desc, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative group bg-gray-900/40 backdrop-blur-md p-8 border border-emerald-500/20 hover:border-emerald-500/80 transition-colors overflow-hidden"
    >
      {/* Corner UI Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500"></div>

      {/* Scanning laser on hover */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 shadow-[0_0_10px_#10b981] hidden group-hover:block"
        animate={{ y: [0, 250, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-gray-900 border border-emerald-500/30 rounded-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow">
          <Icon size={24} className="text-emerald-400 group-hover:text-emerald-300" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-emerald-50 tracking-wider font-mono uppercase">{title}</h3>
        <p className="text-emerald-500/70 text-sm leading-relaxed font-mono">{desc}</p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-emerald-50 dark:bg-transparent overflow-hidden font-sans selection:bg-emerald-500/30 transition-colors duration-500 ease-in-out"
    >
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden pt-20 pb-20">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={farmBg} alt="Farm Target" className="w-full h-full object-cover blur-sm opacity-20 filter grayscale contrast-150 mix-blend-luminosity" />
          
          {/* Cyber grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-emerald-50 dark:from-transparent dark:to-transparent"></div>
        </div>

        {/* Floating Datasets animation */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ y: "100vh", opacity: 0 }}
               animate={{ y: "-10vh", opacity: [0, 0.5, 0] }}
               transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
               className="absolute w-px h-32 bg-gradient-to-t from-transparent via-emerald-500 to-transparent"
               style={{ left: `${Math.random() * 100}%` }}
             />
           ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-widest"
            >
              <Radio size={14} className="animate-pulse" />
              {t('global.system_online')}
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black text-emerald-950 dark:text-white tracking-tighter mb-6 leading-tight">
              {t('global.precision_agriculture')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500" style={{ textShadow: '0 0 40px rgba(16,185,129,0.3)' }}>
                {t('global.agriculture')}
              </span>
            </h1>
            
            <div className="min-h-[100px] mb-12 max-w-lg">
              <TechTypewriter 
                 text={t('global.desc')}
                 delay={0.5}
                 className="text-emerald-500/80 text-lg font-mono leading-relaxed"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-12"
            >
              <Link to="/dashboard" className="group relative overflow-hidden rounded-none border border-emerald-500 bg-emerald-500/10 px-8 py-4 font-mono font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 flex items-center justify-center gap-3 w-full sm:w-auto">
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">{t('global.init_dashboard')} <ArrowRight size={18} /></span>
                <motion.div 
                  className="absolute inset-0 bg-emerald-500 z-0"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ transformOrigin: "left" }}
                />
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-gray-900 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t('global.init_dashboard')} <ArrowRight size={18} />
                </span>
              </Link>
              
              <Link to="/login" className="rounded-none border border-gray-600 bg-transparent hover:border-gray-400 text-gray-400 hover:text-white px-8 py-4 font-mono font-bold transition-all text-center whitespace-nowrap w-full sm:w-auto hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {t('global.user_auth')}
              </Link>
            </motion.div>
          </div>

          {/* Right Hero HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:block relative h-[500px] w-full"
          >
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-dashed border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500/10 w-48 h-48 rounded-full blur-2xl"></div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-emerald-400">
               <ScanLine size={64} className="animate-pulse" />
             </div>

             {/* Floating holographic boxes */}
             <motion.div 
               animate={{ y: [-10, 10, -10] }} 
               transition={{ duration: 4, repeat: Infinity }} 
               className="absolute top-20 right-20 bg-gray-900 border border-emerald-500/50 p-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-mono text-xs text-emerald-300 flex items-center gap-2 max-w-[200px]"
             >
               <span className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full animate-ping"></span> {t('dashboard.moisture')}: 42%
             </motion.div>
             <motion.div 
               animate={{ y: [10, -10, 10] }} 
               transition={{ duration: 5, repeat: Infinity, delay: 1 }} 
               className="absolute bottom-32 left-10 bg-gray-900 border border-emerald-500/50 p-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-mono text-xs text-emerald-300 flex items-center gap-2 max-w-[200px]"
             >
               <span className="w-2 h-2 shrink-0 bg-emerald-500 rounded-full animate-ping"></span> {t('dashboard.npk_sync')}: OK
             </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Data Modules Grid */}
      <section className="relative z-20 py-24 bg-emerald-50 dark:bg-transparent border-t border-emerald-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 border-l-4 border-emerald-500 pl-4">
            <h2 className="text-3xl font-black text-emerald-950 dark:text-white uppercase tracking-wider mb-2">{t('diag.title')}</h2>
            <p className="text-emerald-500/60 font-mono text-sm uppercase">{t('diag.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FuturisticCard 
               icon={Cpu} 
               title={t('diag.compute.title')} 
               desc={t('diag.compute.desc')}
               delay={0.2}
             />
             <FuturisticCard 
               icon={Network} 
               title={t('diag.mesh.title')} 
               desc={t('diag.mesh.desc')}
               delay={0.4}
             />
             <FuturisticCard 
               icon={ShieldAlert} 
               title={t('diag.ai.title')} 
               desc={t('diag.ai.desc')}
               delay={0.6}
             />
          </div>
        </div>
      </section>
      
      {/* Footer Banner */}
      <section className="border-t border-emerald-500/20 bg-[linear-gradient(to_right,theme(colors.emerald.50),rgba(16,185,129,0.05),theme(colors.emerald.50))] dark:bg-transparent backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 text-center font-mono">
           <div className="flex justify-center items-center gap-2 mb-4 text-emerald-500">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
             <span className="text-sm tracking-widest font-bold">{t('global.secure_connection')}</span>
           </div>
           <Link to="/signup" className="mt-8 text-emerald-400 hover:text-white transition-colors uppercase text-sm border-b border-emerald-500/30 hover:border-white pb-1 tracking-wider">
             {t('global.initiate_registration')}
           </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
