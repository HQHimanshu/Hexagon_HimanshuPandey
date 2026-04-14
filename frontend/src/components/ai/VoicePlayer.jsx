import React, { useState } from 'react'
import { Play, Square, Volume2 } from 'lucide-react'

const VoicePlayer = ({ text, language = 'hi' }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = async () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <button
      onClick={handlePlay}
      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors text-sm"
      title="Play voice message"
    >
      {isPlaying ? <Square size={14} /> : <Volume2 size={14} />}
      <span>{isPlaying ? 'Stop' : 'Play'}</span>
    </button>
  )
}

export default VoicePlayer
