import axios from 'axios'

const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocalDev ? 'http://localhost:4000/api' : '/api')
})

API.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(localStorage.getItem('honeychain-auth') || 'null')
    if (session?.role) {
      config.headers['x-user-role'] = session.role
    }
  } catch {
    // Requests remain public when no valid local session exists.
  }
  return config
})

export default API
