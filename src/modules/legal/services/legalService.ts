import ApiService from '@/services/ApiService';
import type { 
  LegalProfile, 
  Crime, 
  Hearing, 
  JudicialResolution,
  Appeal,
  ProceduralDeadline,
  LegalMeasure,
  BenefitApplication
} from '../types/legal';

class LegalService {
  // Legal Profiles
  async getLegalProfiles(params?: any) {
    return ApiService.get('/api/inmate-legal-profiles', { params });
  }

  async getLegalProfile(id: number) {
    return ApiService.get(`/api/inmate-legal-profiles/${id}`);
  }

  async createLegalProfile(data: Partial<LegalProfile>) {
    return ApiService.post('/api/inmate-legal-profiles', data);
  }

  async updateLegalProfile(id: number, data: Partial<LegalProfile>) {
    return ApiService.put(`/api/inmate-legal-profiles/${id}`, data);
  }

  async deleteLegalProfile(id: number) {
    return ApiService.delete(`/api/inmate-legal-profiles/${id}`);
  }

  // Crimes
  async getInmateCrimes(inmateId: number) {
    return ApiService.get(`/api/inmate-crimes`, { 
      params: { inmate_id: inmateId } 
    });
  }

  async getCrime(id: number) {
    return ApiService.get(`/api/inmate-crimes/${id}`);
  }

  async createCrime(data: Partial<Crime>) {
    return ApiService.post('/api/inmate-crimes', data);
  }

  async updateCrime(id: number, data: Partial<Crime>) {
    return ApiService.put(`/api/inmate-crimes/${id}`, data);
  }

  async deleteCrime(id: number) {
    return ApiService.delete(`/api/inmate-crimes/${id}`);
  }

  // Hearings
  async getHearings(params?: any) {
    return ApiService.get('/api/inmate-hearings', { params });
  }

  async getHearing(id: number) {
    return ApiService.get(`/api/inmate-hearings/${id}`);
  }

  async createHearing(data: Partial<Hearing>) {
    return ApiService.post('/api/inmate-hearings', data);
  }

  async updateHearing(id: number, data: Partial<Hearing>) {
    return ApiService.put(`/api/inmate-hearings/${id}`, data);
  }

  async deleteHearing(id: number) {
    return ApiService.delete(`/api/inmate-hearings/${id}`);
  }

  async updateHearingResult(id: number, result: string, notes: string) {
    return ApiService.post(`/api/inmate-hearings/${id}/result`, {
      result,
      notes
    });
  }

  // Judicial Resolutions
  async getResolutions(params?: any) {
    return ApiService.get('/api/inmate-judicial-resolutions', { params });
  }

  async getResolution(id: number) {
    return ApiService.get(`/api/inmate-judicial-resolutions/${id}`);
  }

  async createResolution(data: Partial<JudicialResolution>) {
    return ApiService.post('/api/inmate-judicial-resolutions', data);
  }

  async updateResolution(id: number, data: Partial<JudicialResolution>) {
    return ApiService.put(`/api/inmate-judicial-resolutions/${id}`, data);
  }

  async deleteResolution(id: number) {
    return ApiService.delete(`/api/inmate-judicial-resolutions/${id}`);
  }

  // Appeals
  async getAppeals(params?: any) {
    return ApiService.get('/api/inmate-appeals', { params });
  }

  async getAppeal(id: number) {
    return ApiService.get(`/api/inmate-appeals/${id}`);
  }

  async createAppeal(data: Partial<Appeal>) {
    return ApiService.post('/api/inmate-appeals', data);
  }

  async updateAppeal(id: number, data: Partial<Appeal>) {
    return ApiService.put(`/api/inmate-appeals/${id}`, data);
  }

  async updateAppealStatus(id: number, status: string, resolution: string) {
    return ApiService.post(`/api/inmate-appeals/${id}/status`, {
      status,
      resolution
    });
  }

  // Procedural Deadlines
  async getDeadlines(params?: any) {
    return ApiService.get('/api/inmate-procedural-deadlines', { params });
  }

  async getDeadline(id: number) {
    return ApiService.get(`/api/inmate-procedural-deadlines/${id}`);
  }

  async createDeadline(data: Partial<ProceduralDeadline>) {
    return ApiService.post('/api/inmate-procedural-deadlines', data);
  }

  async updateDeadline(id: number, data: Partial<ProceduralDeadline>) {
    return ApiService.put(`/api/inmate-procedural-deadlines/${id}`, data);
  }

  async completeDeadline(id: number, completionNotes: string) {
    return ApiService.post(`/api/inmate-procedural-deadlines/${id}/complete`, {
      completion_notes: completionNotes
    });
  }

  async getUpcomingDeadlines(days: number = 30) {
    return ApiService.get('/api/inmate-procedural-deadlines/upcoming', {
      params: { days }
    });
  }

  async getOverdueDeadlines() {
    return ApiService.get('/api/inmate-procedural-deadlines/overdue');
  }

  // Legal Measures
  async getMeasures(params?: any) {
    return ApiService.get('/api/inmate-legal-measures', { params });
  }

  async getMeasure(id: number) {
    return ApiService.get(`/api/inmate-legal-measures/${id}`);
  }

  async createMeasure(data: Partial<LegalMeasure>) {
    return ApiService.post('/api/inmate-legal-measures', data);
  }

  async updateMeasure(id: number, data: Partial<LegalMeasure>) {
    return ApiService.put(`/api/inmate-legal-measures/${id}`, data);
  }

  async revokeMeasure(id: number, reason: string) {
    return ApiService.post(`/api/inmate-legal-measures/${id}/revoke`, {
      revocation_reason: reason
    });
  }

  // Benefit Applications
  async getBenefitApplications(params?: any) {
    return ApiService.get('/api/inmate-benefit-applications', { params });
  }

  async getBenefitApplication(id: number) {
    return ApiService.get(`/api/inmate-benefit-applications/${id}`);
  }

  async createBenefitApplication(data: Partial<BenefitApplication>) {
    return ApiService.post('/api/inmate-benefit-applications', data);
  }

  async updateBenefitApplication(id: number, data: Partial<BenefitApplication>) {
    return ApiService.put(`/api/inmate-benefit-applications/${id}`, data);
  }

  async processBenefitApplication(id: number, decision: string, notes: string) {
    return ApiService.post(`/api/inmate-benefit-applications/${id}/process`, {
      decision,
      decision_notes: notes
    });
  }

  // Statistics
  async getLegalStatistics(centerId?: number) {
    return ApiService.get('/api/legal/statistics', {
      params: { center_id: centerId }
    });
  }

  // Preventive Detention Calculation
  async calculatePreventiveDetention(inmateId: number) {
    return ApiService.get(`/api/inmates/${inmateId}/calculate-preventive-detention`);
  }

  // Sentence Reduction Calculation
  async calculateSentenceReduction(profileId: number) {
    return ApiService.post(`/api/inmate-legal-profiles/${profileId}/calculate-reduction`);
  }

  async applySentenceReduction(profileId: number, data: any) {
    return ApiService.post(`/api/inmate-legal-profiles/${profileId}/apply-reduction`, data);
  }

  // Search
  async searchLegalRecords(query: string) {
    return ApiService.get('/api/legal/search', {
      params: { q: query }
    });
  }

  // Bulk Operations
  async bulkUpdateDeadlines(ids: number[], data: any) {
    return ApiService.post('/api/inmate-procedural-deadlines/bulk-update', {
      ids,
      data
    });
  }

  async exportLegalReport(params: any) {
    return ApiService.get('/api/legal/export', {
      params,
      responseType: 'blob'
    });
  }
}

export default new LegalService();