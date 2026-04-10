import React from 'react'
import { Cloud, Wind, Droplets, Gauge, AlertTriangle } from 'lucide-react'
import { formatTemperature, formatHumidity } from '../../utils/formatters'

const WeatherWidget = ({ weather }) => {
  if (!weather) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Weather</h3>
        <div className="text-gray-400 text-center py-8">Loading weather data...</div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">🌤️ Weather</h3>
      
      <div className="space-y-4">
        {/* Current Weather */}
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {formatTemperature(weather.temperature)}
              </div>
              <div className="text-gray-300 capitalize">
                {weather.description}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Feels like {formatTemperature(weather.feels_like)}
              </div>
            </div>
            <Cloud className="text-blue-400" size={64} />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3">
            <Droplets className="text-blue-400" size={20} />
            <div>
              <div className="text-gray-400 text-xs">Humidity</div>
              <div className="text-white font-semibold">{formatHumidity(weather.humidity)}</div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3">
            <Wind className="text-cyan-400" size={20} />
            <div>
              <div className="text-gray-400 text-xs">Wind Speed</div>
              <div className="text-white font-semibold">{weather.wind_speed} m/s</div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3">
            <Gauge className="text-purple-400" size={20} />
            <div>
              <div className="text-gray-400 text-xs">Pressure</div>
              <div className="text-white font-semibold">{weather.pressure} hPa</div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {weather.alert && (
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3 flex items-start space-x-3">
            <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
            <div className="text-yellow-200 text-sm">{weather.alert}</div>
          </div>
        )}

        {/* Forecast */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Forecast</h4>
            <div className="space-y-2">
              {weather.forecast.slice(0, 4).map((item, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="text-gray-300 text-sm">
                    {new Date(item.datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-white text-sm">
                    {formatTemperature(item.temperature)}
                  </div>
                  <div className="text-gray-400 text-sm capitalize">
                    {item.description}
                  </div>
                  <div className="text-blue-400 text-sm">
                    💧 {item.rain_probability.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherWidget
