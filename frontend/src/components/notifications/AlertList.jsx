import React from 'react'
import { AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react'
import { formatDateTime, timeAgo } from '../../utils/formatters'
import { ALERT_TYPES, ALERT_CHANNELS } from '../../utils/constants'
import VoicePlayer from '../ai/VoicePlayer'

const AlertList = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">🔔 Recent Alerts</h3>
        <div className="text-gray-400 text-center py-8">No alerts yet</div>
      </div>
    )
  }

  const getTypeIcon = (type) => {
    const alertType = ALERT_TYPES[type]
    const Icon = {
      CRITICAL: AlertTriangle,
      WARNING: AlertCircle,
      INFO: Info
    }[type] || Bell

    const color = {
      CRITICAL: 'text-red-400',
      WARNING: 'text-yellow-400',
      INFO: 'text-blue-400'
    }[type] || 'text-gray-400'

    return <Icon className={color} size={20} />
  }

  const getChannelIcon = (channel) => {
    const ch = ALERT_CHANNELS[channel]
    return ch?.icon || '📱'
  }

  const getMessage = (alert) => {
    // Prefer message in user's language (assuming stored in message_en for now)
    return alert.message_en || alert.message_hi || alert.message_mr || 'No message'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">🔔 Recent Alerts</h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-gray-700/50 rounded-lg p-4 border-l-4 ${
              alert.type === 'CRITICAL'
                ? 'border-red-500'
                : alert.type === 'WARNING'
                ? 'border-yellow-500'
                : 'border-blue-500'
            } ${alert.is_read ? 'opacity-70' : 'opacity-100'}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getTypeIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    alert.type === 'CRITICAL'
                      ? 'bg-red-900 text-red-200'
                      : alert.type === 'WARNING'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-blue-900 text-blue-200'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {timeAgo(alert.timestamp)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  {getMessage(alert)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <span>{getChannelIcon(alert.channel)}</span>
                    <span>{alert.channel}</span>
                  </div>
                  {alert.channel === 'voice' && (
                    <VoicePlayer text={getMessage(alert)} language="hi" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertList
