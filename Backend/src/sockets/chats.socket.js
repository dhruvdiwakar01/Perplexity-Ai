import { io } from 'socket.io-client'

let socket = null

export const initializeSocketConnection = () => {
  if (socket && socket.connected) return socket

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    withCredentials: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 2000,
    timeout: 5000,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message)
  })

  socket.on('reconnect_failed', () => {
    console.warn('Socket reconnection failed — is the backend running?')
  })

  return socket
}

export const getSocket = () => socket

export default socket