import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Cpu, Cloud, Brain, Shield, Globe, Users, Zap, Github, Mail } from 'lucide-react';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl border border-emerald-500/50 flex items-center justify-center">
            <Sprout size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              About KrishiDrishti
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm tracking-widest uppercase">
              Smart Farming for Indian Farmers
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Our Mission</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-base leading-relaxed">
            <strong className="text-white">KrishiDrishti</strong> bridges the gap between traditional farming intuition and 
            data-driven precision agriculture. Built specifically for <strong className="text-emerald-400">Indian farmers</strong>, 
            our platform empowers you to make smarter decisions about irrigation, fertilization, and crop management using 
            real-time sensor data and AI-powered recommendations.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Our system uses affordable, locally-available IoT sensors (DHT11, soil moisture, rain detection) connected to 
            an Arduino microcontroller to monitor field conditions 24/7. This data flows through a secure backend powered 
            by FastAPI and is enhanced by a local LLM (Qwen 2.5 via Ollama) that provides context-aware farming advice 
            in English, Hindi, and Marathi.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-[1px] bg-orange-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} />
            Technology Stack
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10', title: 'IoT Sensors', desc: 'DHT11, Soil Moisture, Rain Detection connected to Arduino Uno/Nano' },
            { icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Backend', desc: 'FastAPI (Python), SQLite database, async architecture' },
            { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'AI/LLM', desc: 'Qwen 2.5 via Ollama (local), RAG with ChromaDB for crop knowledge' },
            { icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Frontend', desc: 'React 18, Vite, Tailwind CSS, Framer Motion animations' },
            { icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10', title: 'Security', desc: 'JWT authentication, OTP-based login, encrypted data' },
            { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', title: 'Notifications', desc: 'WhatsApp, SMS, Email, Voice alerts via Twilio & SMTP' }
          ].map((tech, i) => (
            <div key={i} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <div className={`w-10 h-10 ${tech.bg} rounded-lg flex items-center justify-center mb-3`}>
                <tech.icon size={20} className={tech.color} />
              </div>
              <h3 className="text-white font-bold mb-1">{tech.title}</h3>
              <p className="text-gray-400 text-sm">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-blue-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} />
            Key Features
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            '🌡️ Real-time sensor monitoring every 5 seconds',
            '🤖 AI-powered farming advice in 3 languages',
            '📊 Interactive analytics with historical trends',
            '🔔 Multi-channel alerts (WhatsApp, SMS, Email, Voice)',
            '🌾 Crop-specific recommendations via RAG',
            '📱 Mobile-responsive design for any device',
            '🔒 Secure OTP-based authentication',
            '🌍 Offline-first architecture with sync',
            '📖 Complete sensor calibration guides',
            '💾 Local LLM - no internet needed for AI'
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
              <span className="text-emerald-400 mt-1">✓</span>
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-purple-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
            <Users size={14} />
            Team HEXAGON
          </h2>
        </div>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-300">
            Built with ❤️ by <strong className="text-white">Team HEXAGON</strong> for PS-301, 
            focused on empowering Indian farmers with accessible smart agriculture technology.
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Github size={20} className="hover:text-white cursor-pointer transition-colors" />
            <Mail size={20} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Sensors Used */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-cyan-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} />
            Hardware Sensors
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'DHT11', measures: 'Temperature & Humidity', range: '0-50°C, 20-90% RH', pin: 'Digital Pin 2' },
            { name: 'Soil Moisture', measures: 'Soil Water Content', range: '0-1023 ADC', pin: 'Analog Pin A0' },
            { name: 'Rain Sensor', measures: 'Rainfall Detection', range: 'Digital LOW/HIGH', pin: 'Digital Pin 3' }
          ].map((sensor, i) => (
            <div key={i} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <h3 className="text-white font-bold text-lg mb-2">{sensor.name}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400"><span className="text-gray-500">Measures:</span> {sensor.measures}</p>
                <p className="text-gray-400"><span className="text-gray-500">Range:</span> {sensor.range}</p>
                <p className="text-gray-400"><span className="text-gray-500">Pin:</span> {sensor.pin}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default About;
