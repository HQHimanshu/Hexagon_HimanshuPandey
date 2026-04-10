import React from 'react'
import { AlertTriangle, CheckCircle, Info, Lightbulb, Droplets, Clock } from 'lucide-react'
import { RECOMMENDATION_TYPES } from '../../utils/constants'

const AdviceCard = ({ advice }) => {
  const getRecommendationIcon = (type) => {
    const rec = RECOMMENDATION_TYPES[type]
    const Icon = {
      IRRIGATE: Droplets,
      WAIT: Clock,
      FERTILIZE: Lightbulb
    }[type] || Info

    const color = {
      IRRIGATE: 'text-blue-400',
      WAIT: 'text-yellow-400',
      FERTILIZE: 'text-green-400'
    }[type] || 'text-gray-400'

    return <Icon className={color} size={24} />
  }

  const getAlertClass = (risk) => {
    if (!risk) return 'hidden'
    return 'bg-red-900/50 border border-red-700 text-red-200'
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Recommendation Header */}
      <div className="bg-gradient-to-r from-primary-900/50 to-purple-900/50 rounded-lg p-4 border border-primary-700">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getRecommendationIcon(advice.recommendation)}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-lg mb-1">
              {advice.recommendation?.replace('_', ' ')}
            </h4>
            {advice.confidence_score && (
              <div className="text-gray-400 text-sm">
                Confidence: {advice.confidence_score}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-blue-900/30 rounded-lg p-4">
        <h5 className="text-blue-300 font-semibold mb-2 flex items-center space-x-2">
          <Info size={16} />
          <span>Reason</span>
        </h5>
        <p className="text-gray-300 text-sm">{advice.reason}</p>
      </div>

      {/* Action Steps */}
      <div className="bg-green-900/30 rounded-lg p-4">
        <h5 className="text-green-300 font-semibold mb-2 flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>Action Steps</span>
        </h5>
        <p className="text-gray-300 text-sm whitespace-pre-line">{advice.action}</p>
      </div>

      {/* Risk Warning */}
      {advice.risk && (
        <div className={`rounded-lg p-4 ${getAlertClass(advice.risk)}`}>
          <h5 className="font-semibold mb-2 flex items-center space-x-2">
            <AlertTriangle size={16} />
            <span>Warning</span>
          </h5>
          <p className="text-sm">{advice.risk}</p>
        </div>
      )}

      {/* Language */}
      {advice.language && (
        <div className="text-gray-500 text-xs text-right">
          Language: {advice.language.toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default AdviceCard
