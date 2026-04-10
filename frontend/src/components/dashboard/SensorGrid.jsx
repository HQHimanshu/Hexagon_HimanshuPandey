import React from 'react'
import { Thermometer, Droplets, Waves, Beaker, CloudRain, Droplet } from 'lucide-react'
import { formatSensorValue } from '../../utils/formatters'

const SensorGrid = ({ sensorData }) => {
  if (!sensorData) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Sensor Data</h3>
        <div className="text-gray-400 text-center py-8">No sensor data available</div>
      </div>
    )
  }

  const sensorCards = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: formatSensorValue('temperature', sensorData.temperature),
      color: 'text-red-400',
      bgColor: 'bg-red-900/30'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: formatSensorValue('humidity', sensorData.humidity),
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30'
    },
    {
      icon: Waves,
      label: 'Soil Moisture',
      value: sensorData.soil_moisture_root !== null && sensorData.soil_moisture_root !== undefined 
        ? `${((1 - sensorData.soil_moisture_root / 1023) * 100).toFixed(0)}%` 
        : 'N/A',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/30'
    },
    {
      icon: Beaker,
      label: 'pH Level',
      value: formatSensorValue('ph_level', sensorData.ph_level),
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/30'
    },
    {
      icon: CloudRain,
      label: 'Rain',
      value: sensorData.rain_detected ? 'Yes' : 'No',
      color: sensorData.rain_detected ? 'text-blue-300' : 'text-gray-400',
      bgColor: sensorData.rain_detected ? 'bg-blue-900/50' : 'bg-gray-800'
    },
    {
      icon: Droplet,
      label: 'Water Tank',
      value: sensorData.water_tank_level !== null && sensorData.water_tank_level !== undefined
        ? `${sensorData.water_tank_level.toFixed(0)}%`
        : 'N/A',
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/30'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">📊 Live Sensor Data</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className={`${card.bgColor} rounded-lg p-4 card-hover`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={card.color} size={24} />
                <span className="text-gray-400 text-sm">{card.label}</span>
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SensorGrid
