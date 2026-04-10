// WebSocket service for real-time alerts
let ws = null
let reconnectTimeout = null
const RECONNECT_DELAY = 5000

export const connectWebSocket = (onMessage, onError) => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('No token available, WebSocket not connected')
    return
  }

  const wsUrl = `ws://localhost:8000/ws/alerts?token=${token}`

  try {
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      if (onError) onError(error)
    }

    ws.onclose = () => {
      console.log('WebSocket closed, attempting reconnect...')
      scheduleReconnect(onMessage, onError)
    }
  } catch (error) {
    console.error('Failed to connect WebSocket:', error)
    scheduleReconnect(onMessage, onError)
  }
}

const scheduleReconnect = (onMessage, onError) => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
  }

  reconnectTimeout = setTimeout(() => {
    connectWebSocket(onMessage, onError)
  }, RECONNECT_DELAY)
}

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close()
    ws = null
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
}

export const sendWebSocketMessage = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  } else {
    console.warn('WebSocket not connected, message not sent')
  }
}

export default {
  connect: connectWebSocket,
  disconnect: disconnectWebSocket,
  send: sendWebSocketMessage
}
