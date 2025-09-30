import apiClient from './apiClient'

// Visitors API
export const visitorsApi = {
  // Get visitors list with filters
  getList(params = {}) {
    return apiClient.get('/visitors', { params })
  },

  // Get visitor by ID
  getById(id) {
    return apiClient.get(`/visitors/${id}`)
  },

  // Create new visitor
  create(data) {
    const formData = new FormData()
    
    // Add all form fields to FormData
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'visitor_photo' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else {
          formData.append(key, data[key])
        }
      }
    })

    return apiClient.post('/visitors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update visitor
  update(id, data) {
    const formData = new FormData()
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'visitor_photo' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else {
          formData.append(key, data[key])
        }
      }
    })

    // Use POST with _method=PUT for file uploads
    formData.append('_method', 'PUT')
    
    return apiClient.post(`/visitors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete visitor
  delete(id) {
    return apiClient.delete(`/visitors/${id}`)
  },

  // Suspend visitor
  suspend(id, data = {}) {
    return apiClient.patch(`/visitors/${id}/suspend`, data)
  },

  // Activate visitor
  activate(id) {
    return apiClient.patch(`/visitors/${id}/activate`)
  },

  // Capture biometric data
  captureBiometric(id, data) {
    return apiClient.post(`/visitors/${id}/biometric`, data)
  },

  // Get visitor statistics
  getStatistics(params = {}) {
    return apiClient.get('/visitors/statistics', { params })
  },

  // Search visitors
  search(query) {
    return apiClient.get('/visitors/search', { params: { q: query } })
  }
}

// Visitor Relationships API
export const visitorRelationshipsApi = {
  // Get relationships list with filters
  getList(params = {}) {
    return apiClient.get('/inmate-visitor-relationships', { params })
  },

  // Get relationship by ID
  getById(id) {
    return apiClient.get(`/inmate-visitor-relationships/${id}`)
  },

  // Get relationships by inmate
  getByInmate(inmateId) {
    return apiClient.get(`/inmate-visitor-relationships/by-inmate/${inmateId}`)
  },

  // Create new relationship
  create(data) {
    return apiClient.post('/inmate-visitor-relationships', data)
  },

  // Update relationship
  update(id, data) {
    return apiClient.put(`/inmate-visitor-relationships/${id}`, data)
  },

  // Delete relationship
  delete(id) {
    return apiClient.delete(`/inmate-visitor-relationships/${id}`)
  },

  // Authorize relationship
  authorize(id, data) {
    return apiClient.post(`/inmate-visitor-relationships/${id}/authorize`, data)
  },

  // Reject relationship
  reject(id, data) {
    return apiClient.post(`/inmate-visitor-relationships/${id}/reject`, data)
  },

  // Suspend relationship
  suspend(id, data) {
    return apiClient.patch(`/inmate-visitor-relationships/${id}/suspend`, data)
  },

  // Reactivate relationship
  reactivate(id) {
    return apiClient.patch(`/inmate-visitor-relationships/${id}/reactivate`)
  },

  // Renew authorization
  renew(id, data = {}) {
    return apiClient.patch(`/inmate-visitor-relationships/${id}/renew`, data)
  },

  // Get relationship statistics
  getStatistics(params = {}) {
    return apiClient.get('/inmate-visitor-relationships/statistics', { params })
  },

  // Get relationship activities
  getActivities(id, params = {}) {
    return apiClient.get(`/inmate-visitor-relationships/${id}/activities`, { params })
  }
}

// Visit Requests API
export const visitRequestsApi = {
  // Get visit requests list
  getList(params = {}) {
    return apiClient.get('/visit-requests', { params })
  },

  // Get visit request by ID
  getById(id) {
    return apiClient.get(`/visit-requests/${id}`)
  },

  // Create visit request
  create(data) {
    return apiClient.post('/visit-requests', data)
  },

  // Update visit request
  update(id, data) {
    return apiClient.put(`/visit-requests/${id}`, data)
  },

  // Approve visit request
  approve(id, data) {
    return apiClient.patch(`/visit-requests/${id}/approve`, data)
  },

  // Reject visit request
  reject(id, data) {
    return apiClient.patch(`/visit-requests/${id}/reject`, data)
  },

  // Cancel visit request
  cancel(id, data = {}) {
    return apiClient.patch(`/visit-requests/${id}/cancel`, data)
  },

  // Schedule visit
  schedule(id, data) {
    return apiClient.patch(`/visit-requests/${id}/schedule`, data)
  },

  // Get available time slots
  getAvailableSlots(params) {
    return apiClient.get('/visit-requests/available-slots', { params })
  },

  // Get visit request statistics
  getStatistics(params = {}) {
    return apiClient.get('/visit-requests/statistics', { params })
  }
}

// Visit Execution API
export const visitExecutionApi = {
  // Get active visits
  getActive(params = {}) {
    return apiClient.get('/visits/active', { params })
  },

  // Get visit by ID
  getById(id) {
    return apiClient.get(`/visits/${id}`)
  },

  // Start visit
  start(data) {
    return apiClient.post('/visits/start', data)
  },

  // End visit
  end(id, data) {
    return apiClient.patch(`/visits/${id}/end`, data)
  },

  // Terminate visit (supervisor action)
  terminate(id, data) {
    return apiClient.patch(`/visits/${id}/terminate`, data)
  },

  // Report incident during visit
  reportIncident(id, data) {
    return apiClient.post(`/visits/${id}/incidents`, data)
  },

  // Update visit notes
  updateNotes(id, data) {
    return apiClient.patch(`/visits/${id}/notes`, data)
  },

  // Get visit history for inmate
  getInmateHistory(inmateId, params = {}) {
    return apiClient.get(`/visits/inmate/${inmateId}/history`, { params })
  },

  // Get visit history for visitor
  getVisitorHistory(visitorId, params = {}) {
    return apiClient.get(`/visits/visitor/${visitorId}/history`, { params })
  },

  // Get visit statistics
  getStatistics(params = {}) {
    return apiClient.get('/visits/statistics', { params })
  }
}

// Biometric Control API
export const biometricControlApi = {
  // Get biometric devices
  getDevices(params = {}) {
    return apiClient.get('/biometric/devices', { params })
  },

  // Get device status
  getDeviceStatus(deviceId) {
    return apiClient.get(`/biometric/devices/${deviceId}/status`)
  },

  // Verify fingerprint
  verifyFingerprint(data) {
    return apiClient.post('/biometric/verify', data)
  },

  // Enroll fingerprint
  enrollFingerprint(data) {
    return apiClient.post('/biometric/enroll', data)
  },

  // Get biometric logs
  getLogs(params = {}) {
    return apiClient.get('/biometric/logs', { params })
  },

  // Get access log for visitor
  getVisitorAccessLog(visitorId, params = {}) {
    return apiClient.get(`/biometric/logs/visitor/${visitorId}`, { params })
  },

  // Grant manual access
  grantManualAccess(data) {
    return apiClient.post('/biometric/manual-access', data)
  },

  // Get biometric statistics
  getStatistics(params = {}) {
    return apiClient.get('/biometric/statistics', { params })
  }
}

// Visit Scheduling API
export const visitSchedulingApi = {
  // Get schedule overview
  getScheduleOverview(params = {}) {
    return apiClient.get('/visit-schedule/overview', { params })
  },

  // Get schedule by date
  getScheduleByDate(date, params = {}) {
    return apiClient.get(`/visit-schedule/date/${date}`, { params })
  },

  // Get available capacity
  getCapacity(params) {
    return apiClient.get('/visit-schedule/capacity', { params })
  },

  // Block time slot
  blockTimeSlot(data) {
    return apiClient.post('/visit-schedule/block', data)
  },

  // Unblock time slot
  unblockTimeSlot(blockId) {
    return apiClient.delete(`/visit-schedule/block/${blockId}`)
  },

  // Get schedule conflicts
  getConflicts(params = {}) {
    return apiClient.get('/visit-schedule/conflicts', { params })
  }
}

// Visit Reports API
export const visitReportsApi = {
  // Generate daily report
  generateDailyReport(date, params = {}) {
    return apiClient.get(`/visit-reports/daily/${date}`, { params })
  },

  // Generate visitor activity report
  generateVisitorActivityReport(params) {
    return apiClient.get('/visit-reports/visitor-activity', { params })
  },

  // Generate incident report
  generateIncidentReport(params) {
    return apiClient.get('/visit-reports/incidents', { params })
  },

  // Generate statistical summary
  generateStatisticalSummary(params) {
    return apiClient.get('/visit-reports/statistical-summary', { params })
  },

  // Export report
  exportReport(reportType, params, format = 'pdf') {
    return apiClient.get(`/visit-reports/${reportType}/export`, {
      params: { ...params, format },
      responseType: 'blob'
    })
  }
}

// Visit Settings API
export const visitSettingsApi = {
  // Get visit settings
  getSettings() {
    return apiClient.get('/visit-settings')
  },

  // Update visit settings
  updateSettings(data) {
    return apiClient.put('/visit-settings', data)
  },

  // Get visit rules
  getRules() {
    return apiClient.get('/visit-settings/rules')
  },

  // Update visit rules
  updateRules(data) {
    return apiClient.put('/visit-settings/rules', data)
  },

  // Get security settings
  getSecuritySettings() {
    return apiClient.get('/visit-settings/security')
  },

  // Update security settings
  updateSecuritySettings(data) {
    return apiClient.put('/visit-settings/security', data)
  }
}

// Visit Utilities
export const visitUtils = {
  // Format relationship types
  formatRelationshipType(type) {
    const types = {
      'spouse': 'Cónyuge',
      'child': 'Hijo/a',
      'parent': 'Padre/Madre',
      'sibling': 'Hermano/a',
      'grandparent': 'Abuelo/a',
      'grandchild': 'Nieto/a',
      'uncle_aunt': 'Tío/a',
      'cousin': 'Primo/a',
      'friend': 'Amigo/a',
      'lawyer': 'Abogado/a',
      'religious': 'Líder Religioso',
      'other': 'Otro'
    }
    return types[type] || type
  },

  // Format visit types
  formatVisitType(type) {
    const types = {
      'family': 'Familiar',
      'conjugal': 'Conyugal',
      'legal': 'Legal',
      'religious': 'Religiosa',
      'medical': 'Médica',
      'social': 'Social',
      'official': 'Oficial'
    }
    return types[type] || type
  },

  // Format authorization status
  formatAuthorizationStatus(status) {
    const statuses = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
      'suspended': 'Suspendida',
      'expired': 'Expirada'
    }
    return statuses[status] || status
  },

  // Format visit status
  formatVisitStatus(status) {
    const statuses = {
      'scheduled': 'Programada',
      'confirmed': 'Confirmada',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'terminated': 'Terminada',
      'no_show': 'No se presentó'
    }
    return statuses[status] || status
  },

  // Get status badge classes
  getStatusBadgeClass(status) {
    const classes = {
      'pending': 'badge-light-warning',
      'approved': 'badge-light-success',
      'rejected': 'badge-light-danger',
      'suspended': 'badge-light-secondary',
      'expired': 'badge-light-dark',
      'scheduled': 'badge-light-info',
      'confirmed': 'badge-light-primary',
      'in_progress': 'badge-light-warning',
      'completed': 'badge-light-success',
      'cancelled': 'badge-light-danger',
      'terminated': 'badge-light-dark',
      'no_show': 'badge-light-secondary'
    }
    return classes[status] || 'badge-light-secondary'
  },

  // Calculate visitor age
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

  // Validate visitor age for relationship type
  validateVisitorAge(birthDate, isConsanguineous, relationshipType) {
    const age = this.calculateAge(birthDate)
    
    // Minors (under 18) can only visit if consanguineous
    if (age < 18 && !isConsanguineous) {
      return {
        valid: false,
        message: 'Los menores de 18 años solo pueden visitar si tienen relación consanguínea'
      }
    }
    
    // Special rules for specific relationship types
    if (relationshipType === 'spouse' && age < 18) {
      return {
        valid: false,
        message: 'Las visitas conyugales requieren que el visitante sea mayor de edad'
      }
    }
    
    return { valid: true }
  },

  // Calculate visit duration
  calculateVisitDuration(startTime, endTime) {
    if (!startTime || !endTime) return null
    
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    return diffMinutes
  },

  // Format visit duration
  formatVisitDuration(minutes) {
    if (!minutes || minutes === 0) return '-'
    
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  },

  // Check if time slot is available
  isTimeSlotAvailable(date, time, duration, existingVisits, capacity) {
    const slotStart = new Date(`${date} ${time}`)
    const slotEnd = new Date(slotStart.getTime() + (duration * 60000))
    
    // Count overlapping visits
    const overlapping = existingVisits.filter(visit => {
      const visitStart = new Date(visit.start_time)
      const visitEnd = new Date(visit.end_time)
      
      return (slotStart < visitEnd && slotEnd > visitStart)
    })
    
    return overlapping.length < capacity
  },

  // Get conduct score color class
  getConductScoreClass(score) {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-danger'
  },

  // Generate visitor QR code data
  generateVisitorQRData(visitor, visit) {
    return {
      visitor_id: visitor.id,
      visit_id: visit.id,
      document_number: visitor.visitor_document_number,
      full_name: visitor.visitor_full_name,
      visit_date: visit.scheduled_date,
      visit_time: visit.scheduled_time,
      generated_at: new Date().toISOString()
    }
  }
}

export default {
  visitorsApi,
  visitorRelationshipsApi,
  visitRequestsApi,
  visitExecutionApi,
  biometricControlApi,
  visitSchedulingApi,
  visitReportsApi,
  visitSettingsApi,
  visitUtils
}