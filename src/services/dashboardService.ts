import ApiService from '@/core/services/ApiService'
import type { AxiosResponse } from 'axios'

export interface DashboardStats {
  summary: {
    total_inmates: number
    total_capacity: number
    occupancy_rate: number
    today_admissions: number
    today_releases: number
    critical_alerts: number
  }
  population: {
    by_gender: Array<{ gender: string; count: number; percentage: number }>
    by_security_level: Array<{ level: string; count: number; percentage: number }>
    by_status: Array<{ status: string; count: number; percentage: number }>
    trend_last_30_days: Array<{ date: string; count: number }>
  }
  security: {
    incidents_today: number
    incidents_this_week: number
    incidents_by_type: Array<{ type: string; count: number }>
    high_risk_inmates: number
    gang_affiliated: number
  }
  legal: {
    hearings_today: number
    hearings_this_week: number
    upcoming_hearings: Array<{ date: string; time: string; inmate_name: string; type: string }>
    overdue_cases: number
    critical_deadlines: number
  }
  operational: {
    transfers_in_progress: number
    visits_today: number
    visits_this_week: number
    medical_appointments_today: number
    work_assignments_active: number
  }
  alerts: Array<{
    id: number
    type: string
    severity: string
    message: string
    timestamp: string
    requires_action: boolean
  }>
  charts: {
    population_by_center: Array<{ name: string; current: number; capacity: number }>
    incidents_trend: Array<{ date: string; count: number }>
    admissions_releases: Array<{ date: string; admissions: number; releases: number }>
  }
}

class DashboardService {
  /**
   * Obtener estadísticas del dashboard penitenciario
   */
  static async getPrisonStats(): Promise<AxiosResponse<DashboardStats>> {
    return ApiService.get('/dashboard/prison-stats')
  }

  /**
   * Obtener estadísticas de población
   */
  static async getPopulationStats(): Promise<AxiosResponse<any>> {
    return ApiService.get('/dashboard/population-stats')
  }

  /**
   * Obtener estadísticas de seguridad
   */
  static async getSecurityStats(): Promise<AxiosResponse<any>> {
    return ApiService.get('/dashboard/security-stats')
  }

  /**
   * Obtener estadísticas legales
   */
  static async getLegalStats(): Promise<AxiosResponse<any>> {
    return ApiService.get('/dashboard/legal-stats')
  }

  /**
   * Obtener estadísticas operacionales
   */
  static async getOperationalStats(): Promise<AxiosResponse<any>> {
    return ApiService.get('/dashboard/operational-stats')
  }
}

export default DashboardService