import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { LayoutDashboard, BarChart3, Lightbulb, Activity, Bell, User, Info, ArrowRight, Sprout, Cpu, Brain, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const features = [
    { path: '/dashboard', icon: LayoutDashboard, color: 'from-emerald-500 to-teal-500', title: 'Live Dashboard', desc: 'Real-time sensor monitoring with instant alerts' },
    { path: '/analytics', icon: BarChart3, color: 'from-blue-500 to-indigo-500', title: 'Analytics', desc: 'Historical trends and per-sensor charts' },
    { path: '/suggestions', icon: Lightbulb, color: 'from-amber-500 to-orange-500', title: 'AI Suggestions', desc: 'Qwen-powered farming advice in 3 languages' },
    { path: '/sensors', icon: Activity, color: 'from-cyan-500 to-blue-500', title: 'Sensor Guide', desc: 'Complete wiring, calibration & code docs' },
    { path: '/notifications', icon: Bell, color: 'from-red-500 to-pink-500', title: 'Alerts', desc: 'Multi-channel notifications (WhatsApp, SMS)' },
    { path: '/profile', icon: User, color: 'from-purple-500 to-violet-500', title: 'Profile', desc: 'Manage farm details and preferences' },
    { path: '/about', icon: Info, color: 'from-gray-500 to-gray-600', title: 'About', desc: 'Project info, tech stack and team' }
  ];

  const stats = [
    { icon: Cpu, value: '3', label: 'IoT Sensors', color: 'text-cyan-400' },
    { icon: Brain, value: '24/7', label: 'AI Monitoring', color: 'text-purple-400' },
    { icon: Zap, value: '5s', label: 'Update Rate', color: 'text-amber-400' },
    { icon: Sprout, value: '3', label: 'Languages', color: 'text-emerald-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-gray-900/50 to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-emerald-400 text-sm font-semibold tracking-wide">SMART FARMING SYSTEM</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                KrishiDrishti
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Bridging traditional farming with AI-powered precision agriculture.
              Real-time sensors, local LLM advice, and multi-language support for Indian farmers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <span>Launch Dashboard</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 px-8 py-4 bg-gray-800/50 text-gray-300 rounded-xl font-bold text-lg border border-gray-700 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
              >
                <span>Learn More</span>
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4">
            All Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need for smart farming in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(feature.path)}
              className="group cursor-pointer bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-emerald-500/50 transition-all p-6 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Stack Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-8"
        >
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6 text-center">
            Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-2xl font-black text-cyan-400">Arduino</p>
              <p className="text-gray-500 text-xs">IoT Sensors</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-emerald-400">FastAPI</p>
              <p className="text-gray-500 text-xs">Python Backend</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-purple-400">Qwen 2.5</p>
              <p className="text-gray-500 text-xs">Local LLM</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-blue-400">React</p>
              <p className="text-gray-500 text-xs">Modern UI</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-8 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/30"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">Login to access your personalized farming dashboard</p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
