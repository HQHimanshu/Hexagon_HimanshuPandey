import React, { useState } from 'react'
import { useAuth } from '../../App'
import { authAPI } from '../../services/api'
import { Bell, MessageSquare, Mail, Phone, Smartphone } from 'lucide-react'

const NotificationSettings = () => {
  const { user, updateUser } = useAuth()
  const [settings, setSettings] = useState({
    whatsapp_opt_in: user?.whatsapp_opt_in ?? true,
    sms_opt_in: user?.sms_opt_in ?? true,
    email_opt_in: user?.email_opt_in ?? false,
    voice_opt_in: user?.voice_opt_in ?? true
  })
  const [saving, setSaving] = useState(false)

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authAPI.updateProfile(settings)
      updateUser(settings)
    } catch (err) {
      console.error('Failed to update notification settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const channels = [
    {
      key: 'whatsapp_opt_in',
      icon: MessageSquare,
      label: 'WhatsApp',
      description: 'Receive alerts on WhatsApp',
      color: 'text-green-400'
    },
    {
      key: 'sms_opt_in',
      icon: Phone,
      label: 'SMS',
      description: 'Receive text messages',
      color: 'text-blue-400'
    },
    {
      key: 'email_opt_in',
      icon: Mail,
      label: 'Email',
      description: 'Receive email notifications',
      color: 'text-purple-400'
    },
    {
      key: 'voice_opt_in',
      icon: Bell,
      label: 'Voice Alerts',
      description: 'Receive voice calls',
      color: 'text-amber-400'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Bell size={20} />
        <span>Notification Preferences</span>
      </h3>

      <div className="space-y-3">
        {channels.map((channel) => {
          const Icon = channel.icon
          const isEnabled = settings[channel.key]

          return (
            <div
              key={channel.key}
              className={`bg-gray-700/50 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors ${
                isEnabled ? 'border-l-4 border-primary-500' : ''
              }`}
              onClick={() => handleToggle(channel.key)}
            >
              <div className="flex items-center space-x-3">
                <Icon className={isEnabled ? channel.color : 'text-gray-500'} size={24} />
                <div>
                  <div className="text-white font-medium">{channel.label}</div>
                  <div className="text-gray-400 text-sm">{channel.description}</div>
                </div>
              </div>

              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  isEnabled ? 'bg-primary-500' : 'bg-gray-600'
                } relative`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <Smartphone size={18} />
        <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
      </button>
    </div>
  )
}

export default NotificationSettings
