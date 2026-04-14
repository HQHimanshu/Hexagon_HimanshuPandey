import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Droplets, CloudRain, Code, Book, ChevronRight, Zap, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sensors = () => {
  const navigate = useNavigate();

  const sensors = [
    {
      id: 'dht11',
      name: 'DHT11 Temperature & Humidity',
      icon: Thermometer,
      color: 'from-red-500 to-orange-500',
      specs: {
        'Type': 'Digital Sensor',
        'Temperature': '0-50°C (±2°C)',
        'Humidity': '20-90% (±5%)',
        'Voltage': '3.3V - 5V',
        'Pin': 'Digital Pin 2'
      },
      description: 'Measures air temperature and humidity for crop health monitoring.'
    },
    {
      id: 'soil-moisture',
      name: 'Soil Moisture Sensor',
      icon: Droplets,
      color: 'from-cyan-500 to-blue-500',
      specs: {
        'Type': 'Analog Sensor',
        'Output': '0-1023 ADC',
        'Dry Value': '~800-1023',
        'Wet Value': '~0-400',
        'Pin': 'Analog Pin A0'
      },
      description: 'Measures water content in soil to optimize irrigation scheduling.'
    },
    {
      id: 'rain-sensor',
      name: 'Rain Detection Sensor',
      icon: CloudRain,
      color: 'from-blue-500 to-indigo-500',
      specs: {
        'Type': 'Digital Sensor',
        'Output': 'LOW = Rain, HIGH = Dry',
        'Sensitivity': 'Adjustable',
        'Voltage': '3.3V - 5V',
        'Pin': 'Digital Pin 3'
      },
      description: 'Detects rainfall to automate irrigation control and save water.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl border border-emerald-500/50 flex items-center justify-center">
            <Activity size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Sensor Guide
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-mono text-sm tracking-widest uppercase">
              Specifications, Wiring & Calibration
            </p>
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sensors.map((sensor, index) => {
          const Icon = sensor.icon;
          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-transparent border border-gray-700/50 relative overflow-hidden hover:border-emerald-500/50 transition-colors group"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${sensor.color}`} />
              <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${sensor.color}`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">{sensor.name}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-400 text-sm">{sensor.description}</p>

                <div className="space-y-2">
                  {Object.entries(sensor.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500">{key}:</span>
                      <span className="text-gray-300 font-mono font-bold">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/sensors/${sensor.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors font-semibold"
                >
                  <span>View Full Guide</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Arduino Code Section */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-[1px] bg-orange-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 w-full inline-block backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <Code size={14} />
            Arduino Firmware
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Book size={20} className="text-emerald-400" />
              sensor_node.ino
            </h3>
            <p className="text-gray-400 text-sm">Main firmware that reads all sensors and outputs JSON over USB serial every 5 seconds.</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> DHT11 temperature & humidity</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Soil moisture (analog)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Rain detection (debounced)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> JSON output at 9600 baud</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings size={20} className="text-cyan-400" />
              calibrate_sensors.ino
            </h3>
            <p className="text-gray-400 text-sm">Calibration tool to get accurate soil moisture readings for your specific sensor.</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-cyan-400">✓</span> Live ADC value display</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">✓</span> Find DRY and WET values</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">✓</span> Run once per sensor</li>
              <li className="flex items-start gap-2"><span className="text-cyan-400">✓</span> Copy values to main firmware</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-emerald-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} />
            Quick Start - 5 Steps
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { step: 1, title: 'Connect Sensors', desc: 'Wire DHT11 to D2, Soil to A0, Rain to D3. Check VCC/GND connections.' },
            { step: 2, title: 'Upload Calibration', desc: 'Open calibrate_sensors.ino, upload, open Serial Monitor at 115200 baud.' },
            { step: 3, title: 'Calibrate Soil', desc: 'Note ADC in air (dry) and water (wet). Update values in sensor_node.ino.' },
            { step: 4, title: 'Upload Firmware', desc: 'Open sensor_node.ino, verify calibration values, upload to Arduino.' },
            { step: 5, title: 'Start Bridge', desc: 'Run start_arduino_bridge.bat. Data flows to dashboard automatically.' }
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/50">
                <span className="text-emerald-400 font-black">{item.step}</span>
              </div>
              <div>
                <h4 className="text-white font-bold">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-transparent border border-gray-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-red-500" />
        <div className="bg-gray-800/80 px-6 py-3 border-b border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={14} />
            Common Issues
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { issue: 'DHT11 shows NaN', fix: 'Check DATA pin to D2. Verify DHT library installed.' },
            { issue: 'Soil always 1023', fix: 'Check AOUT wire. Sensor may not be connected properly.' },
            { issue: 'Rain always YES', fix: 'Turn potentiometer clockwise. Clean sensor pad.' },
            { issue: 'No data in dashboard', fix: 'Ensure USB bridge is running and Arduino Serial Monitor is closed.' }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <p className="text-red-400 font-bold text-sm mb-1">⚠ {item.issue}</p>
              <p className="text-gray-400 text-sm">→ {item.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sensors;
