import React from 'react'
import { APP_NAME, APP_VERSION } from '../../utils/constants'

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4 fixed bottom-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2026 {APP_NAME} v{APP_VERSION} - PS-301
          </div>
          <div className="text-gray-400 text-sm">
            Empowering Indian Farmers with AI 🌾
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
