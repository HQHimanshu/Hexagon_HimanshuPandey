import React, { useState } from 'react'
import { Send, Loader2, MessageSquare } from 'lucide-react'
import { adviceAPI } from '../../services/api'
import AdviceCard from './AdviceCard'

const ChatInterface = () => {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAdvice(null)

    try {
      const response = await adviceAPI.getAdvice(question, null)
      setAdvice(response.data)
      setQuestion('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get advice')
    } finally {
      setLoading(false)
    }
  }

  const sampleQuestions = [
    "Should I irrigate now?",
    "What fertilizer should I use for wheat?",
    "How to control pests in cotton?",
    "Is the current weather good for crops?"
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <MessageSquare size={20} />
        <span>AI Farming Assistant</span>
      </h3>

      {/* Chat Area */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {!advice && !loading && (
          <div className="text-center text-gray-400 py-12">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4">Ask me anything about farming!</p>
            <div className="space-y-2">
              {sampleQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="block w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary-500" />
            <span className="ml-3 text-gray-400">Getting advice...</span>
          </div>
        )}

        {advice && <AdviceCard advice={advice} />}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about farming..."
          className="input-field flex-1"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn-primary disabled:opacity-50 flex items-center space-x-2"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default ChatInterface
