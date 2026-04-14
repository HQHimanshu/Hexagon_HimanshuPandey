import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Thermometer, Droplets, Waves, CloudRain, Cpu, ArrowRight, Book, Code, Settings } from 'lucide-react'

const Sensors = () => {
  const navigate = useNavigate()

  const sensors = [
    {
      id: 'dht11',
      name: 'DHT11 Temperature & Humidity Sensor',
      icon: Thermometer,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-900/30 to-orange-800/20',
      borderColor: 'border-red-700/50',
      shortDesc: 'Measures air temperature and humidity for your farm',
      specs: {
        type: 'Digital Sensor',
        temperatureRange: '0°C to 50°C (±2°C)',
        humidityRange: '20% to 90% (±5%)',
        operatingVoltage: '3.3V - 5V',
        arduinoPin: 'Pin 2 (Digital)'
      },
      whatItDoes: 'The DHT11 sensor measures the temperature and humidity of the air around your crops. This data helps you understand if conditions are right for plant growth and when to take action.',
      whyItMatters: 'Temperature and humidity affect plant growth, disease risk, and irrigation needs. High humidity can cause fungal diseases, while high temperature can stress plants.',
      wiring: [
        'VCC pin → Arduino 5V',
        'GND pin → Arduino GND',
        'DATA pin → Arduino Digital Pin 2'
      ],
      troubleshooting: [
        'If reading shows NaN: Check wiring connections',
        'If readings seem wrong: Wait 2 seconds between readings',
        'If no data: Try a different DHT11 sensor'
      ]
    },
    {
      id: 'soil-moisture',
      name: 'Soil Moisture Sensor',
      icon: Waves,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-900/30 to-blue-800/20',
      borderColor: 'border-cyan-700/50',
      shortDesc: 'Measures water content in soil to prevent over/under watering',
      specs: {
        type: 'Analog Sensor',
        outputRange: '0-1023 ADC values',
        dryValue: '~800-1023 (in air)',
        wetValue: '~0-400 (in water)',
        operatingVoltage: '3.3V - 5V',
        arduinoPin: 'Pin A0 (Analog)'
      },
      whatItDoes: 'The soil moisture sensor measures how much water is in your soil. It gives you a reading from 0-1023, where higher values mean drier soil and lower values mean wetter soil.',
      whyItMatters: 'Knowing soil moisture helps you water at the right time. Overwatering wastes water and can damage roots. Underwatering stresses plants and reduces yield.',
      wiring: [
        'VCC pin → Arduino 5V',
        'GND pin → Arduino GND',
        'AOUT pin → Arduino Analog Pin A0'
      ],
      calibrationSteps: [
        'Step 1: Keep sensor in air (dry) - note the ADC value',
        'Step 2: Put sensor in water (wet) - note the ADC value',
        'Step 3: Update SOIL_MOISTURE_DRY and SOIL_MOISTURE_WET in code',
        'Step 4: Upload sensor_node.ino to Arduino'
      ],
      troubleshooting: [
        'If always 1023: Sensor not connected or loose wire',
        'If always 0: Sensor short-circuited or wrong pin',
        'If readings jump around: Clean sensor probes and check connections'
      ]
    },
    {
      id: 'rain-sensor',
      name: 'Rain Detection Sensor',
      icon: CloudRain,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-900/30 to-indigo-800/20',
      borderColor: 'border-blue-700/50',
      shortDesc: 'Detects rainfall to automate irrigation control',
      specs: {
        type: 'Digital Sensor',
        output: 'LOW = Rain detected, HIGH = No rain',
        sensitivity: 'Adjustable (blue potentiometer)',
        operatingVoltage: '3.3V - 5V',
        arduinoPin: 'Pin 3 (Digital)'
      },
      whatItDoes: 'The rain sensor detects when it rains. It has a pad that gets wet when rain falls. When water bridges the lines on the pad, it sends a signal to the Arduino.',
      whyItMatters: 'When it rains, you don\'t need to irrigate. This sensor helps save water and prevents overwatering during rainy periods.',
      wiring: [
        'VCC pin → Arduino 5V',
        'GND pin → Arduino GND',
        'D0 (Digital Out) → Arduino Digital Pin 3'
      ],
      calibrationSteps: [
        'Step 1: Keep rain sensor dry (no water)',
        'Step 2: Add drops of water to sensor pad',
        'Step 3: Adjust blue potentiometer until LED turns on with water',
        'Step 4: Code already has debouncing (15 seconds confirmation)'
      ],
      troubleshooting: [
        'If always detects rain: Turn potentiometer clockwise',
        'If never detects rain: Turn potentiometer counter-clockwise',
        'If inconsistent: Clean sensor pad and ensure good water contact'
      ]
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900/50 to-gray-900 rounded-2xl p-8 mb-8 border border-primary-700/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl">
            <Cpu size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-gradient">Sensor Guide</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Complete documentation of all sensors, wiring diagrams, calibration steps, and Arduino code
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 border border-gray-700/50">
            <Book className="text-primary-400" size={24} />
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-gray-400 text-sm">Sensors Used</div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 border border-gray-700/50">
            <Code className="text-amber-400" size={24} />
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-gray-400 text-sm">Open Source Code</div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 border border-gray-700/50">
            <Settings className="text-cyan-400" size={24} />
            <div>
              <div className="text-2xl font-bold text-white">Easy</div>
              <div className="text-gray-400 text-sm">Calibration Guide</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sensors.map((sensor, index) => {
          const Icon = sensor.icon
          return (
            <div
              key={sensor.id}
              className={`card bg-gradient-to-br ${sensor.bgColor} border ${sensor.borderColor} card-hover animate-slideInUp`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${sensor.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={32} className="text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{sensor.name}</h3>
              <p className="text-gray-400 mb-4">{sensor.shortDesc}</p>
              
              <div className="space-y-2 mb-6">
                {Object.entries(sensor.specs).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-gray-300 font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/sensors/${sensor.id}`)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <span>View Full Guide</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Arduino Code Section */}
      <div className="card mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Code size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">📦 Complete Arduino Code</h2>
            <p className="text-gray-400">All code files for your KrishiDrishti sensor system</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">📄 sensor_node.ino</h3>
            <p className="text-gray-400 text-sm mb-4">Main firmware for Arduino with live sensor readings and JSON output</p>
            <ul className="space-y-2 text-sm text-gray-300 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✅</span>
                <span>Reads DHT11 temperature & humidity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✅</span>
                <span>Reads soil moisture (analog)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✅</span>
                <span>Rain detection with debouncing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✅</span>
                <span>Outputs JSON over USB serial every 5 seconds</span>
              </li>
            </ul>
            <div className="text-xs text-gray-500 font-mono bg-gray-900/50 rounded-lg p-3">
              Location: arduino/sensor_node.ino
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all">
            <h3 className="text-lg font-bold text-white mb-2">📄 calibrate_sensors.ino</h3>
            <p className="text-gray-400 text-sm mb-4">Calibration tool to get accurate soil moisture readings</p>
            <ul className="space-y-2 text-sm text-gray-300 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">📊</span>
                <span>Shows live soil moisture ADC values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">📊</span>
                <span>Helps find DRY and WET values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">📊</span>
                <span>Run once to calibrate your sensor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">📊</span>
                <span>Copy values to sensor_node.ino</span>
              </li>
            </ul>
            <div className="text-xs text-gray-500 font-mono bg-gray-900/50 rounded-lg p-3">
              Location: arduino/calibrate_sensors.ino
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Book size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">🚀 Quick Start Guide</h2>
            <p className="text-gray-400">Get your KrishiDrishti system running in 5 steps</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { step: 1, title: 'Connect Sensors to Arduino', desc: 'Follow the wiring diagrams in each sensor guide above. Double-check VCC, GND, and signal pins.' },
            { step: 2, title: 'Upload Calibration Sketch', desc: 'Open calibrate_sensors.ino in Arduino IDE, upload to Arduino, and open Serial Monitor at 115200 baud.' },
            { step: 3, title: 'Calibrate Soil Moisture', desc: 'Note the ADC value in air (dry) and in water (wet). Update SOIL_MOISTURE_DRY and SOIL_MOISTURE_WET in sensor_node.ino.' },
            { step: 4, title: 'Upload Main Firmware', desc: 'Open sensor_node.ino, verify calibration values, and upload to Arduino.' },
            { step: 5, title: 'Start USB Serial Bridge', desc: 'Run "start_arduino_bridge.bat" from project root. The bridge will auto-connect and send data to backend.' }
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-xl font-bold">{item.step}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sensors
