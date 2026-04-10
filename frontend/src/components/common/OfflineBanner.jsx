import React, { useState, useEffect } from 'react'
import { WifiOff, Wifi, RefreshCw } from 'lucide-react'
import { checkOnlineStatus, getOfflineStatus, syncPendingData } from '../../services/offline'

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(checkOnlineStatus())
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const handleConnectivityChange = (event) => {
      setIsOnline(event.detail.isOnline)
      if (event.detail.isOnline) {
        updatePendingCount()
      }
    }

    window.addEventListener('connectivity-change', handleConnectivityChange)
    updatePendingCount()

    return () => {
      window.removeEventListener('connectivity-change', handleConnectivityChange)
    }
  }, [])

  const updatePendingCount = () => {
    const status = getOfflineStatus()
    setPendingCount(status.pendingItems)
  }

  const handleSync = async () => {
    setIsSyncing(true)
    await syncPendingData()
    updatePendingCount()
    setIsSyncing(false)
  }

  if (isOnline && pendingCount === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-16 left-0 right-0 z-50 animate-slideIn ${
      isOnline ? 'bg-blue-600' : 'bg-red-600'
    } text-white px-4 py-3 shadow-lg`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <>
              <Wifi size={20} />
              <span>
                {isSyncing ? (
                  'Syncing data...'
                ) : (
                  `Back online - ${pendingCount} item${pendingCount !== 1 ? 's' : ''} ready to sync`
                )}
              </span>
            </>
          ) : (
            <>
              <WifiOff size={20} />
              <span>You're offline - data will sync when connected</span>
            </>
          )}
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            <span>Sync Now</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default OfflineBanner
