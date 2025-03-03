import axios from 'axios'
import { API_CONFIG } from './config'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5002',
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            config.headers.Authorization = JSON.stringify(user)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance 