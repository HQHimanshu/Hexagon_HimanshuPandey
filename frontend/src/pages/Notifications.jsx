import React, { useState, useEffect } from 'react'
import { notificationAPI } from '../services/api'
import AlertList from '../components/notifications/AlertList'
import NotificationSettings from '../components/notifications/NotificationSettings'
import { Loader2, Bell, Send } from 'lucide-react'

const Notifications = () => {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const response = await notificationAPI.getAlerts(50)
      setAlerts(response.data)
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTestAlert = async () => {
    setSending(true)
    try {
      await notificationAPI.sendTest('all')
      alert('Test alert sent! (Check console/logs)')
    } catch (err) {
      console.error('Failed to send test:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
          <Bell size={32} />
          <span>Notifications</span>
        </h1>
        <button
          onClick={handleTestAlert}
          disabled={sending}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <Send size={18} />
          <span>{sending ? 'Sending...' : 'Test Alert'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AlertList alerts={alerts} />
        <NotificationSettings />
      </div>
    </div>
  )
}

export default Notifications
