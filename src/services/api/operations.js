import apiClient from './apiClient'

// Admissions API
export const admissionsApi = {
  // Get admissions list with filters
  getList(params = {}) {
    return apiClient.get('/admissions', { params })
  },

  // Get admission by ID
  getById(id) {
    return apiClient.get(`/admissions/${id}`)
  },

  // Create new admission
  create(data) {
    return apiClient.post('/admissions', data)
  },

  // Update admission
  update(id, data) {
    return apiClient.put(`/admissions/${id}`, data)
  },

  // Update admission step
  updateStep(id, data) {
    return apiClient.patch(`/admissions/${id}/step`, data)
  },

  // Cancel admission
  cancel(id, reason = '') {
    return apiClient.patch(`/admissions/${id}/cancel`, { reason })
  },

  // Complete admission
  complete(id) {
    return apiClient.patch(`/admissions/${id}/complete`)
  },

  // Get admission statistics
  getStatistics(params = {}) {
    return apiClient.get('/admissions/statistics', { params })
  },

  // Get belongings for admission
  getBelongings(admissionId) {
    return apiClient.get(`/admissions/${admissionId}/belongings`)
  },

  // Add belonging to admission
  addBelonging(admissionId, data) {
    return apiClient.post(`/admissions/${admissionId}/belongings`, data)
  },

  // Update belonging
  updateBelonging(admissionId, belongingId, data) {
    return apiClient.put(`/admissions/${admissionId}/belongings/${belongingId}`, data)
  },

  // Remove belonging
  removeBelonging(admissionId, belongingId) {
    return apiClient.delete(`/admissions/${admissionId}/belongings/${belongingId}`)
  }
}

// Daily Counts API
export const dailyCountsApi = {
  // Get counts list with filters
  getList(params = {}) {
    return apiClient.get('/counts', { params })
  },

  // Get scheduled counts for today
  getScheduled(params = {}) {
    return apiClient.get('/counts/scheduled', { params })
  },

  // Start new count
  start(data) {
    return apiClient.post('/counts', data)
  },

  // Submit count results
  submit(id, data) {
    return apiClient.patch(`/counts/${id}/submit`, data)
  },

  // Resolve count discrepancy
  resolveDiscrepancy(id, data) {
    return apiClient.patch(`/counts/${id}/resolve`, data)
  },

  // Verify count (supervisor)
  verify(id) {
    return apiClient.patch(`/counts/${id}/verify`)
  },

  // Get count statistics
  getStatistics(params = {}) {
    return apiClient.get('/counts/statistics', { params })
  },

  // Get inmates currently out of sector
  getInmatesOut(params = {}) {
    return apiClient.get('/counts/inmates-out', { params })
  },

  // Get count by ID
  getById(id) {
    return apiClient.get(`/counts/${id}`)
  }
}

// Movements API
export const movementsApi = {
  // Get movements list with filters
  getList(params = {}) {
    return apiClient.get('/movements', { params })
  },

  // Get movement by ID
  getById(id) {
    return apiClient.get(`/movements/${id}`)
  },

  // Schedule new movement
  schedule(data) {
    return apiClient.post('/movements', data)
  },

  // Start movement
  start(id, data = {}) {
    return apiClient.patch(`/movements/${id}/start`, data)
  },

  // Update movement status
  updateStatus(id, data) {
    return apiClient.patch(`/movements/${id}/status`, data)
  },

  // Get active movements by location
  getActiveByLocation(params = {}) {
    return apiClient.get('/movements/active', { params })
  },

  // Get movement history for inmate
  getInmateHistory(inmateId) {
    return apiClient.get(`/movements/inmate/${inmateId}/history`)
  },

  // Get movement statistics
  getStatistics(params = {}) {
    return apiClient.get('/movements/statistics', { params })
  },

  // Create emergency movement
  createEmergency(data) {
    return apiClient.post('/movements/emergency', data)
  }
}

// Releases API
export const releasesApi = {
  // Get eligible inmates for release planning
  getEligible(params = {}) {
    return apiClient.get('/releases/eligible', { params })
  },

  // Create release plan
  createPlan(data) {
    return apiClient.post('/releases/plans', data)
  },

  // Get release plans
  getPlans(params = {}) {
    return apiClient.get('/releases/plans', { params })
  },

  // Get release plan by ID
  getPlan(id) {
    return apiClient.get(`/releases/plans/${id}`)
  },

  // Update release plan evaluations
  updateEvaluations(id, data) {
    return apiClient.patch(`/releases/plans/${id}/evaluations`, data)
  },

  // Update release plan details
  updatePlan(id, data) {
    return apiClient.put(`/releases/plans/${id}`, data)
  },

  // Update preparation status
  updatePreparation(id, data) {
    return apiClient.patch(`/releases/plans/${id}/preparation`, data)
  },

  // Create release order
  createRelease(data) {
    return apiClient.post('/releases', data)
  },

  // Get scheduled releases
  getScheduledReleases(params = {}) {
    return apiClient.get('/releases/scheduled', { params })
  },

  // Process release step
  processStep(id, data) {
    return apiClient.patch(`/releases/${id}/step`, data)
  },

  // Complete release
  complete(id, data) {
    return apiClient.patch(`/releases/${id}/complete`, data)
  },

  // Get release statistics
  getStatistics(params = {}) {
    return apiClient.get('/releases/statistics', { params })
  },

  // Get release by ID
  getById(id) {
    return apiClient.get(`/releases/${id}`)
  }
}

// Generic operations utilities
export const operationsUtils = {
  // Format admission types
  formatAdmissionType(type) {
    const types = {
      'preventive_detention': 'Prisión Preventiva',
      'sentence_execution': 'Ejecución de Sentencia',
      'transfer': 'Traslado',
      'reentry': 'Reingreso',
      'judicial_order': 'Orden Judicial'
    }
    return types[type] || type
  },

  // Format count types
  formatCountType(type) {
    const types = {
      'morning': 'Matutino (06:00)',
      'midday': 'Medio Día (12:00)',
      'evening': 'Vespertino (18:00)',
      'night': 'Nocturno (21:00)',
      'emergency': 'Emergencia',
      'recount': 'Reconteo'
    }
    return types[type] || type
  },

  // Format movement types
  formatMovementType(type) {
    const types = {
      'medical': 'Médico',
      'education': 'Educación',
      'work': 'Trabajo',
      'visit': 'Visita',
      'court': 'Tribunal',
      'administrative': 'Administrativo',
      'religious': 'Religioso',
      'sports': 'Deportes',
      'emergency': 'Emergencia',
      'transfer': 'Traslado'
    }
    return types[type] || type
  },

  // Format release types
  formatReleaseType(type) {
    const types = {
      'sentence_completion': 'Cumplimiento de Sentencia',
      'conditional_release': 'Libertad Condicional',
      'substitute_measures': 'Medidas Sustitutivas',
      'judicial_order': 'Orden Judicial',
      'deportation': 'Deportación'
    }
    return types[type] || type
  },

  // Format status common to multiple modules
  formatStatus(status) {
    const statuses = {
      'pending': 'Pendiente',
      'in_progress': 'En Proceso',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'verified': 'Verificado',
      'resolved': 'Resuelto',
      'scheduled': 'Programado',
      'active': 'Activo',
      'inactive': 'Inactivo'
    }
    return statuses[status] || status
  },

  // Get status badge class
  getStatusBadgeClass(status) {
    const classes = {
      'pending': 'badge-light-warning',
      'in_progress': 'badge-light-primary',
      'completed': 'badge-light-success',
      'cancelled': 'badge-light-danger',
      'verified': 'badge-light-success',
      'resolved': 'badge-light-info',
      'scheduled': 'badge-light-secondary',
      'active': 'badge-light-success',
      'inactive': 'badge-light-secondary'
    }
    return classes[status] || 'badge-light-secondary'
  },

  // Format duration in minutes to readable format
  formatDuration(minutes) {
    if (!minutes || minutes === 0) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  },

  // Format date to locale
  formatDate(date, locale = 'es-GT') {
    if (!date) return '-'
    return new Date(date).toLocaleDateString(locale)
  },

  // Format time to locale
  formatTime(time, locale = 'es-GT') {
    if (!time) return '-'
    const date = typeof time === 'string' && time.includes('T') 
      ? new Date(time) 
      : new Date(`2000-01-01 ${time}`)
    return date.toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  },

  // Format datetime to locale
  formatDateTime(datetime, locale = 'es-GT') {
    if (!datetime) return '-'
    const date = new Date(datetime)
    return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  },

  // Calculate age from birth date
  calculateAge(birthDate) {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  },

  // Calculate days between dates
  daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000
    const firstDate = new Date(date1)
    const secondDate = new Date(date2)
    
    return Math.round(Math.abs((firstDate - secondDate) / oneDay))
  },

  // Get progress bar class based on percentage
  getProgressBarClass(percentage) {
    if (percentage >= 75) return 'bg-success'
    if (percentage >= 50) return 'bg-warning'
    if (percentage >= 25) return 'bg-info'
    return 'bg-danger'
  }
}

export default {
  admissionsApi,
  dailyCountsApi,
  movementsApi,
  releasesApi,
  operationsUtils
}