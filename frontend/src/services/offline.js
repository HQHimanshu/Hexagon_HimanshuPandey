// Offline detection and queue management

let isOnline = navigator.onLine
const offlineQueue = []

// Event listeners for online/offline
window.addEventListener('online', () => {
  isOnline = true
  window.dispatchEvent(new CustomEvent('connectivity-change', { detail: { isOnline: true } }))
  syncPendingData()
})

window.addEventListener('offline', () => {
  isOnline = false
  window.dispatchEvent(new CustomEvent('connectivity-change', { detail: { isOnline: false } }))
})

export const checkOnlineStatus = () => {
  return isOnline
}

// Queue data for later sync when offline
export const queueForSync = (type, data) => {
  const item = {
    type,
    data,
    timestamp: new Date().toISOString()
  }
  
  offlineQueue.push(item)
  
  // Store in localStorage for persistence
  const stored = JSON.parse(localStorage.getItem('offline_queue') || '[]')
  stored.push(item)
  localStorage.setItem('offline_queue', JSON.stringify(stored))
  
  return item
}

// Sync pending data when back online
export const syncPendingData = async () => {
  if (!isOnline) return
  
  const stored = JSON.parse(localStorage.getItem('offline_queue') || '[]')
  
  if (stored.length === 0) return
  
  console.log(`Syncing ${stored.length} pending items...`)
  
  // Request background sync if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register('sync-sensor-data')
    } catch (err) {
      console.log('Background sync not available, manual sync...')
      await manualSync(stored)
    }
  } else {
    await manualSync(stored)
  }
}

// Manual sync fallback
const manualSync = async (items) => {
  const { sensorAPI } = await import('./api')
  
  const sensorReadings = items.filter(item => item.type === 'sensor_reading')
  
  for (const item of sensorReadings) {
    try {
      await sensorAPI.create(item.data)
    } catch (err) {
      console.error('Failed to sync item:', err)
      // Keep in queue for next attempt
      return
    }
  }
  
  // Clear synced items
  localStorage.removeItem('offline_queue')
}

// Store sensor reading (queue if offline)
export const storeSensorReading = async (sensorData) => {
  if (isOnline) {
    try {
      const { sensorAPI } = await import('./api')
      return await sensorAPI.create(sensorData)
    } catch (err) {
      console.error('Failed to send sensor data:', err)
      // Queue for later
      queueForSync('sensor_reading', sensorData)
      throw err
    }
  } else {
    // Queue for later sync
    queueForSync('sensor_reading', sensorData)
    return { queued: true, data: sensorData }
  }
}

// Get offline status
export const getOfflineStatus = () => {
  const stored = JSON.parse(localStorage.getItem('offline_queue') || '[]')
  return {
    isOnline,
    pendingItems: stored.length,
    items: stored
  }
}
