import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface Inmate {
  id: number
  inmate_code: string
  full_name: string
  first_name: string
  last_name: string
  date_of_birth: string
  nationality: string
  document_type: string
  document_number: string
  current_status: string
  current_center_id: number
  current_sector_id: number
  admission_date: string
  expected_release_date?: string
  actual_release_date?: string
  photo?: string
  fingerprints?: any[]
  created_at: string
  updated_at: string
}

export const useInmateStore = defineStore('inmate', () => {
  // State
  const inmates = ref<Inmate[]>([])
  const currentInmate = ref<Inmate | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const totalInmates = ref(0)
  const currentPage = ref(1)
  const perPage = ref(10)

  // Getters
  const filteredInmates = computed(() => {
    if (!searchQuery.value) return inmates.value
    
    const query = searchQuery.value.toLowerCase()
    return inmates.value.filter(inmate => 
      inmate.full_name.toLowerCase().includes(query) ||
      inmate.inmate_code.toLowerCase().includes(query) ||
      inmate.document_number?.toLowerCase().includes(query)
    )
  })

  const hasInmates = computed(() => inmates.value.length > 0)
  
  const currentInmateName = computed(() => currentInmate.value?.full_name || '')
  
  const currentInmateCode = computed(() => currentInmate.value?.inmate_code || '')

  // Actions
  const fetchInmates = async (params: any = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/inmates', { 
        params: {
          page: currentPage.value,
          per_page: perPage.value,
          ...params
        }
      })
      
      inmates.value = response.data.data
      totalInmates.value = response.data.meta?.total || response.data.total || inmates.value.length
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar internos'
      console.error('Error fetching inmates:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchInmate = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`/api/inmates/${id}`)
      currentInmate.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar interno'
      console.error('Error fetching inmate:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchInmates = async (query: string) => {
    searchQuery.value = query
    
    if (query.length < 2) {
      return filteredInmates.value
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/inmates/search', {
        params: { q: query, limit: 20 }
      })
      
      inmates.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error en búsqueda'
      console.error('Error searching inmates:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const createInmate = async (data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/inmates', data)
      const newInmate = response.data.data
      
      inmates.value.unshift(newInmate)
      currentInmate.value = newInmate
      
      return newInmate
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear interno'
      console.error('Error creating inmate:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateInmate = async (id: number, data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(`/api/inmates/${id}`, data)
      const updatedInmate = response.data.data
      
      // Update in list
      const index = inmates.value.findIndex(i => i.id === id)
      if (index !== -1) {
        inmates.value[index] = updatedInmate
      }
      
      // Update current if same
      if (currentInmate.value?.id === id) {
        currentInmate.value = updatedInmate
      }
      
      return updatedInmate
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar interno'
      console.error('Error updating inmate:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteInmate = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await axios.delete(`/api/inmates/${id}`)
      
      // Remove from list
      inmates.value = inmates.value.filter(i => i.id !== id)
      
      // Clear current if same
      if (currentInmate.value?.id === id) {
        currentInmate.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar interno'
      console.error('Error deleting inmate:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentInmate = (inmate: Inmate | null) => {
    currentInmate.value = inmate
  }

  const clearCurrentInmate = () => {
    currentInmate.value = null
  }

  const resetStore = () => {
    inmates.value = []
    currentInmate.value = null
    loading.value = false
    error.value = null
    searchQuery.value = ''
    currentPage.value = 1
  }

  // Biometric specific methods
  const getInmateBiometrics = async (inmateId: number) => {
    try {
      const response = await axios.get(`/api/biometric/inmates/${inmateId}/biometrics`)
      return response.data.data
    } catch (err: any) {
      console.error('Error fetching inmate biometrics:', err)
      throw err
    }
  }

  const registerFingerprint = async (inmateId: number, fingerData: any) => {
    try {
      const response = await axios.post('/api/biometric/register', {
        inmate_id: inmateId,
        ...fingerData
      })
      return response.data
    } catch (err: any) {
      console.error('Error registering fingerprint:', err)
      throw err
    }
  }

  const verifyFingerprint = async (inmateId: number, fingerprintData: string) => {
    try {
      const response = await axios.post('/api/biometric/verify', {
        inmate_id: inmateId,
        fingerprint_data: fingerprintData
      })
      return response.data
    } catch (err: any) {
      console.error('Error verifying fingerprint:', err)
      throw err
    }
  }

  return {
    // State
    inmates,
    currentInmate,
    loading,
    error,
    searchQuery,
    totalInmates,
    currentPage,
    perPage,
    
    // Getters
    filteredInmates,
    hasInmates,
    currentInmateName,
    currentInmateCode,
    
    // Actions
    fetchInmates,
    fetchInmate,
    searchInmates,
    createInmate,
    updateInmate,
    deleteInmate,
    setCurrentInmate,
    clearCurrentInmate,
    resetStore,
    
    // Biometric methods
    getInmateBiometrics,
    registerFingerprint,
    verifyFingerprint
  }
})