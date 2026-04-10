import React from 'react'
import { useAuth } from '../App'
import ProfileSetup from '../components/auth/ProfileSetup'
import LanguageToggle from '../components/common/LanguageToggle'
import ThemeToggle from '../components/common/ThemeToggle'
import { User, Phone, MapPin, Sprout, Ruler, Settings, LogOut } from 'lucide-react'
import { CROP_TYPES, SUPPORTED_LANGUAGES } from '../utils/constants'

const Profile = () => {
  const { user, logout, updateUser } = useAuth()

  const getCropLabel = (value) => {
    const crop = CROP_TYPES.find(c => c.value === value)
    return crop ? `${crop.icon} ${crop.label}` : value
  }

  const getLanguageName = (code) => {
    return SUPPORTED_LANGUAGES[code]?.name || code
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center space-x-2">
        <User size={32} />
        <span>Profile</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <User size={20} />
            <span>Your Information</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
              <Phone className="text-primary-400" size={20} />
              <div>
                <div className="text-gray-400 text-xs">Phone</div>
                <div className="text-white">{user?.phone}</div>
              </div>
            </div>

            {user?.name && (
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
                <User className="text-blue-400" size={20} />
                <div>
                  <div className="text-gray-400 text-xs">Name</div>
                  <div className="text-white">{user.name}</div>
                </div>
              </div>
            )}

            {user?.crop_type && (
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
                <Sprout className="text-green-400" size={20} />
                <div>
                  <div className="text-gray-400 text-xs">Crop Type</div>
                  <div className="text-white">{getCropLabel(user.crop_type)}</div>
                </div>
              </div>
            )}

            {user?.farm_area_acres && (
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
                <Ruler className="text-amber-400" size={20} />
                <div>
                  <div className="text-gray-400 text-xs">Farm Area</div>
                  <div className="text-white">{user.farm_area_acres} acres</div>
                </div>
              </div>
            )}

            {user?.location_lat && user?.location_lng && (
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
                <MapPin className="text-red-400" size={20} />
                <div>
                  <div className="text-gray-400 text-xs">Location</div>
                  <div className="text-white">
                    {user.location_lat.toFixed(4)}, {user.location_lng.toFixed(4)}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3">
              <Settings className="text-purple-400" size={20} />
              <div>
                <div className="text-gray-400 text-xs">Language</div>
                <div className="text-white">{getLanguageName(user?.language || 'en')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Profile Setup */}
          <ProfileSetup onComplete={() => {}} />

          {/* Quick Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">⚙️ Quick Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-300">Language</span>
                <LanguageToggle />
              </div>
              <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg p-4 flex items-center justify-center space-x-2 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
