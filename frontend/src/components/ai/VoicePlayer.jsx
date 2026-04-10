import React, { useRef, useState } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

const VoicePlayer = ({ text, language = 'hi' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const utteranceRef = useRef(null)

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      utteranceRef.current = new SpeechSynthesisUtterance(text)
      
      // Set language
      const langMap = {
        'hi': 'hi-IN',
        'mr': 'mr-IN',
        'en': 'en-IN'
      }
      utteranceRef.current.lang = langMap[language] || 'hi-IN'
      utteranceRef.current.rate = 0.9 // Slightly slower for clarity

      utteranceRef.current.onend = () => {
        setIsPlaying(false)
      }

      utteranceRef.current.onerror = () => {
        setIsPlaying(false)
      }

      window.speechSynthesis.speak(utteranceRef.current)
      setIsPlaying(true)
    } else {
      console.warn('Speech Synthesis not supported')
    }
  }

  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <button
      onClick={handlePlay}
      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
      aria-label="Play voice alert"
    >
      <Volume2 size={18} />
      {isPlaying ? (
        <>
          <Pause size={16} />
          <span>Playing...</span>
        </>
      ) : (
        <>
          <Play size={16} />
          <span>Listen</span>
        </>
      )}
    </button>
  )
}

export default VoicePlayer
