import React, { useState } from 'react'
import { Save, Bell, MessageSquare, Phone, Mail, Volume2 } from 'lucide-react'

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    whatsapp_enabled: true,
    sms_enabled: true,
    email_enabled: false,
    voice_enabled: false,
    critical_alerts: true,
    warning_alerts: true,
    info_alerts: false
  })

  const handleSave = () => {
    // TODO: Implement save to backend
    alert('Settings saved! (Demo)')
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Bell size={20} />
        <span>Notification Settings</span>
      </h3>

      <div className="space-y-6">
        {/* Channel Settings */}
        <div>
          <h4 className="text-gray-300 font-medium mb-3">Notification Channels</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <MessageSquare className="text-green-400" size={20} />
                <span className="text-gray-300">WhatsApp</span>
              </div>
              <input
                type="checkbox"
                checked={settings.whatsapp_enabled}
                onChange={(e) => setSettings({...settings, whatsapp_enabled: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-primary-500 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-400" size={20} />
                <span className="text-gray-300">SMS</span>
              </div>
              <input
                type="checkbox"
                checked={settings.sms_enabled}
                onChange={(e) => setSettings({...settings, sms_enabled: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-primary-500 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Mail className="text-purple-400" size={20} />
                <span className="text-gray-300">Email</span>
              </div>
              <input
                type="checkbox"
                checked={settings.email_enabled}
                onChange={(e) => setSettings({...settings, email_enabled: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-primary-500 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Volume2 className="text-amber-400" size={20} />
                <span className="text-gray-300">Voice Call</span>
              </div>
              <input
                type="checkbox"
                checked={settings.voice_enabled}
                onChange={(e) => setSettings({...settings, voice_enabled: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-primary-500 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Alert Types */}
        <div>
          <h4 className="text-gray-300 font-medium mb-3">Alert Types</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-red-400 font-medium">Critical Alerts</span>
              <input
                type="checkbox"
                checked={settings.critical_alerts}
                onChange={(e) => setSettings({...settings, critical_alerts: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-yellow-400 font-medium">Warning Alerts</span>
              <input
                type="checkbox"
                checked={settings.warning_alerts}
                onChange={(e) => setSettings({...settings, warning_alerts: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-blue-400 font-medium">Info Alerts</span>
              <input
                type="checkbox"
                checked={settings.info_alerts}
                onChange={(e) => setSettings({...settings, info_alerts: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  )
}

export default NotificationSettings
