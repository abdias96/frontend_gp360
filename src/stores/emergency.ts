import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import type {
  EmergencyIncident,
  EmergencyIncidentCreate,
  EmergencyIncidentFilters,
  EmergencyStatistics,
} from "@/types/emergency";

interface EmergencyState {
  incidents: EmergencyIncident[];
  currentIncident: EmergencyIncident | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: EmergencyIncidentFilters;
  statistics: EmergencyStatistics | null;
}

export const useEmergencyStore = defineStore("emergency", {
  state: (): EmergencyState => ({
    incidents: [],
    currentIncident: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    filters: {
      search: "",
      center_id: null,
      severity: null,
      status: null,
      emergency_type_id: null,
      date_from: null,
      date_to: null,
    },
    statistics: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    currentError: (state) => state.error,
    totalIncidents: (state) => state.pagination.total,
    hasIncidents: (state) => state.incidents.length > 0,
  },

  actions: {
    async fetchIncidents(page = 1, force = false) {
      if (this.loading && !force) return;

      try {
        this.loading = true;
        this.error = null;

        const params: Record<string, any> = {
          page,
          per_page: this.pagination.per_page,
        };

        if (this.filters.search) params.search = this.filters.search;
        if (this.filters.center_id) params.center_id = this.filters.center_id;
        if (this.filters.severity) params.severity = this.filters.severity;
        if (this.filters.status) params.status = this.filters.status;
        if (this.filters.emergency_type_id) params.emergency_type_id = this.filters.emergency_type_id;
        if (this.filters.date_from) params.date_from = this.filters.date_from;
        if (this.filters.date_to) params.date_to = this.filters.date_to;

        const response = await ApiService.query("/emergency/incidents", params);

        if (response.data.success && response.data.data && Array.isArray(response.data.data.data)) {
          this.incidents = response.data.data.data;
          this.pagination = {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            per_page: response.data.data.per_page,
            total: response.data.data.total,
          };
        } else if (response.data.data && Array.isArray(response.data.data)) {
          this.incidents = response.data.data;
          this.pagination = {
            current_page: response.data.current_page || 1,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 15,
            total: response.data.total || 0,
          };
        } else {
          this.incidents = [];
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || "Error al cargar los incidentes";
      } finally {
        this.loading = false;
      }
    },

    async createIncident(data: EmergencyIncidentCreate) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.post("/emergency/incidents", data);
        const newIncident = response.data.data;

        if (this.pagination.current_page === 1) {
          this.incidents.unshift(newIncident);
        }

        return newIncident;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Error al crear el incidente";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateIncident(id: number, data: Partial<EmergencyIncidentCreate>) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.put(`/emergency/incidents/${id}`, data);
        const updated = response.data.data;

        const index = this.incidents.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.incidents[index] = updated;
        }

        if (this.currentIncident?.id === id) {
          this.currentIncident = updated;
        }

        return updated;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Error al actualizar el incidente";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteIncident(id: number) {
      try {
        this.loading = true;
        this.error = null;

        await ApiService.delete(`/emergency/incidents/${id}`);
        this.incidents = this.incidents.filter((i) => i.id !== id);

        if (this.currentIncident?.id === id) {
          this.currentIncident = null;
        }

        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Error al eliminar el incidente";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchIncident(id: number) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.get(`/emergency/incidents/${id}`);
        this.currentIncident = response.data.data;
        return this.currentIncident;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Error al cargar el incidente";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      try {
        const params: Record<string, any> = {};
        if (this.filters.center_id) params.center_id = this.filters.center_id;

        const response = await ApiService.query("/emergency/incidents/statistics", params);
        this.statistics = response.data.data;
        return this.statistics;
      } catch (error: any) {
        console.error("Error fetching emergency statistics:", error);
      }
    },

    setFilters(newFilters: Partial<EmergencyIncidentFilters>) {
      this.filters = { ...this.filters, ...newFilters };
    },

    clearFilters() {
      this.filters = {
        search: "",
        center_id: null,
        severity: null,
        status: null,
        emergency_type_id: null,
        date_from: null,
        date_to: null,
      };
    },

    setCurrentPage(page: number) {
      this.pagination.current_page = page;
    },

    clearError() {
      this.error = null;
    },

    resetStore() {
      this.incidents = [];
      this.currentIncident = null;
      this.loading = false;
      this.error = null;
      this.statistics = null;
      this.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      };
      this.clearFilters();
    },
  },
});
