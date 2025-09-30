import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // Add auth token to headers
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    // Add activity context if available
    if (authStore.activityContext) {
      config.headers['X-Activity-Context'] = authStore.activityContext
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const authStore = useAuthStore()
      
      // Try to refresh token
      try {
        await authStore.refreshToken()
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        await authStore.logout()
        router.push('/auth/login')
        return Promise.reject(refreshError)
      }
    }
    
    // Handle 403 Forbidden (no permissions)
    if (error.response?.status === 403) {
      // Show permission denied message
      const message = error.response.data?.message || 'No tienes permisos para realizar esta acción'
      
      // You can dispatch a global notification here
      window.dispatchEvent(new CustomEvent('permission-denied', { detail: { message } }))
    }
    
    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      // Format validation errors for easier handling
      const validationErrors = error.response.data?.errors || {}
      error.validationErrors = validationErrors
    }
    
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after']
      error.retryAfter = retryAfter
      
      const message = `Demasiadas solicitudes. Por favor, espera ${retryAfter} segundos.`
      window.dispatchEvent(new CustomEvent('rate-limit', { detail: { message, retryAfter } }))
    }
    
    // Handle 500 Server errors
    if (error.response?.status >= 500) {
      const message = 'Error del servidor. Por favor, intenta nuevamente más tarde.'
      window.dispatchEvent(new CustomEvent('server-error', { detail: { message } }))
    }
    
    // Handle network errors
    if (!error.response && error.message === 'Network Error') {
      const message = 'Error de conexión. Por favor, verifica tu conexión a internet.'
      window.dispatchEvent(new CustomEvent('network-error', { detail: { message } }))
    }
    
    return Promise.reject(error)
  }
)

// Helper methods
apiClient.setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

apiClient.removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization']
}

// Export configured instance
export default apiClient

// Export helper functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      status: error.response.status,
      message: error.response.data?.message || 'Error en la solicitud',
      errors: error.response.data?.errors || {},
      data: error.response.data
    }
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor',
      errors: {},
      data: null
    }
  } else {
    // Error in request setup
    return {
      status: -1,
      message: error.message || 'Error desconocido',
      errors: {},
      data: null
    }
  }
}

export const isValidationError = (error) => {
  return error.response?.status === 422
}

export const getValidationErrors = (error) => {
  if (!isValidationError(error)) return {}
  return error.response?.data?.errors || {}
}

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'Ha ocurrido un error inesperado'
}