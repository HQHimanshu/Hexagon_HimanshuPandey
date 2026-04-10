import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../App'
import { Languages } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '../../utils/constants'

const LanguageToggle = () => {
  const { i18n } = useTranslation()
  const { user, updateUser } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  const changeLanguage = async (lang) => {
    await i18n.changeLanguage(lang)
    if (user) {
      updateUser({ language: lang })
    }
    setIsOpen(false)
  }

  const currentLang = SUPPORTED_LANGUAGES[i18n.language] || SUPPORTED_LANGUAGES.en

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
      >
        <Languages size={18} />
        <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-fadeIn z-50">
          <div className="py-1">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2 ${
                  i18n.language === code ? 'bg-primary-500 text-white' : 'text-gray-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageToggle
