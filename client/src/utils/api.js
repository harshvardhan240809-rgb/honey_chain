import axios from 'axios'

const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocalDev ? 'http://localhost:4000/api' : '/api')
})

export default API
