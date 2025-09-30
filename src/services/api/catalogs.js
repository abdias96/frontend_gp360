import apiClient from './apiClient'

// Catalogs API for visits module
export const catalogsApi = {
  // Get visitors catalog (for select dropdowns)
  getVisitors(params = {}) {
    return apiClient.get('/catalogs/visitors', { params })
  },

  // Get inmates catalog (for select dropdowns)
  getInmates(params = {}) {
    return apiClient.get('/catalogs/inmates', { params })
  },

  // Get relationship types
  getRelationshipTypes(params = {}) {
    return apiClient.get('/catalogs/relationship-types', { params })
  },

  // Get visit types
  getVisitTypes(params = {}) {
    return apiClient.get('/catalogs/visit-types', { params })
  },

  // Get document types
  getDocumentTypes(params = {}) {
    return apiClient.get('/catalogs/document-types', { params })
  },

  // Get countries
  getCountries(params = {}) {
    return apiClient.get('/catalogs/countries', { params })
  },

  // Get departments
  getDepartments(countryId = null, params = {}) {
    const endpoint = countryId 
      ? `/catalogs/countries/${countryId}/departments` 
      : '/catalogs/departments'
    return apiClient.get(endpoint, { params })
  },

  // Get municipalities
  getMunicipalities(departmentId = null, params = {}) {
    const endpoint = departmentId 
      ? `/catalogs/departments/${departmentId}/municipalities` 
      : '/catalogs/municipalities'
    return apiClient.get(endpoint, { params })
  },

  // Get centers
  getCenters(params = {}) {
    return apiClient.get('/catalogs/centers', { params })
  },

  // Get sectors by center
  getSectorsByCenter(centerId, params = {}) {
    return apiClient.get(`/catalogs/centers/${centerId}/sectors`, { params })
  },

  // Get cancellation reasons
  getCancellationReasons(params = {}) {
    return apiClient.get('/catalogs/cancellation-reasons', { params })
  },

  // Get incident types
  getIncidentTypes(params = {}) {
    return apiClient.get('/catalogs/incident-types', { params })
  },

  // Get rejection reasons
  getRejectionReasons(params = {}) {
    return apiClient.get('/catalogs/rejection-reasons', { params })
  },

  // Get suspension reasons
  getSuspensionReasons(params = {}) {
    return apiClient.get('/catalogs/suspension-reasons', { params })
  },

  // Get blacklist reasons
  getBlacklistReasons(params = {}) {
    return apiClient.get('/catalogs/blacklist-reasons', { params })
  },

  // Search catalogs with generic endpoint
  searchCatalog(catalogType, query, params = {}) {
    return apiClient.get(`/catalogs/${catalogType}/search`, { 
      params: { q: query, ...params } 
    })
  },

  // Get all catalogs needed for a form
  getFormCatalogs(catalogTypes = []) {
    return apiClient.post('/catalogs/bulk', { types: catalogTypes })
  }
}

export default catalogsApi