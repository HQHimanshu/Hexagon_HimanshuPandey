import React from 'react'
import { Lightbulb, Clock, MapPin } from 'lucide-react'
import { formatDateTime } from '../../utils/formatters'

const AdviceCard = ({ advice }) => {
  if (!advice) return null

  return (
    <div className="bg-gradient-to-br from-primary-900/50 to-purple-900/50 rounded-lg p-6 border border-primary-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Lightbulb className="text-yellow-400" size={24} />
          <h4 className="text-lg font-semibold text-white">AI Recommendation</h4>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-xs">
          <Clock size={14} />
          <span>{formatDateTime(advice.timestamp)}</span>
        </div>
      </div>

      {/* Question */}
      {advice.question && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-sm">
            <span className="text-gray-400 font-medium">Question:</span> {advice.question}
          </p>
        </div>
      )}

      {/* Recommendation */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
        <p className="text-white leading-relaxed">{advice.recommendation}</p>
      </div>

      {/* Details */}
      {advice.details && (
        <div className="space-y-2 mb-4">
          {advice.details.map((detail, index) => (
            <div key={index} className="flex items-start space-x-2 text-gray-300 text-sm">
              <span className="text-primary-400 mt-1">•</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Location */}
      {advice.location && (
        <div className="flex items-center space-x-2 text-gray-400 text-xs mb-4">
          <MapPin size={14} />
          <span>{advice.location}</span>
        </div>
      )}

      {/* Confidence Score */}
      {advice.confidence && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-gray-400 text-sm">Confidence</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${advice.confidence}%` }}
              ></div>
            </div>
            <span className="text-primary-400 font-semibold">{advice.confidence}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdviceCard
