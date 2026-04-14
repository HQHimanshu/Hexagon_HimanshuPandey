import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, MessageSquare, BarChart3, CloudRain } from 'lucide-react'

const QuickActions = ({ sensorData, onIrrigate }) => {
  const navigate = useNavigate()

  const actions = [
    {
      icon: Droplets,
      label: 'Irrigate Now',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: onIrrigate,
      disabled: sensorData?.rain_detected
    },
    {
      icon: MessageSquare,
      label: 'Get AI Advice',
      color: 'bg-primary-600 hover:bg-primary-700',
      action: () => navigate('/advice')
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => navigate('/analytics')
    },
    {
      icon: CloudRain,
      label: 'Weather Forecast',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      action: () => navigate('/dashboard')
    }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.action}
              disabled={action.disabled}
              className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center space-y-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon size={28} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
