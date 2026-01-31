import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import type {
  InmateListItem,
  InmateDetail,
  InmateCreate,
  InmateUpdate,
} from "@/types/inmates";

interface InmateState {
  inmates: InmateListItem[];
  currentInmate: InmateDetail | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search: string;
    center_id: number | null;
    status: string | null;
    gender: string | null;
    nationality_id: number | null;
  };
}

export const useInmatesStore = defineStore("inmates", {
  state: (): InmateState => ({
    inmates: [],
    currentInmate: null,
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
      status: null,
      gender: null,
      nationality_id: null,
    },
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    currentError: (state) => state.error,
    totalInmates: (state) => state.pagination.total,
    hasInmates: (state) => state.inmates.length > 0,
    activeInmates: (state) =>
      state.inmates.filter((inmate) => inmate.status === "active"),
    inmatesByCenter: (state) => {
      const byCenter: Record<string, InmateListItem[]> = {};
      state.inmates.forEach((inmate) => {
        const centerName = inmate.center_name || "Sin Centro";
        if (!byCenter[centerName]) {
          byCenter[centerName] = [];
        }
        byCenter[centerName].push(inmate);
      });
      return byCenter;
    },
  },

  actions: {
    // Fetch inmates list with pagination and filters
    async fetchInmates(page = 1, force = false) {
      if (this.loading && !force) return;

      try {
        this.loading = true;
        this.error = null;

        const params = {
          page,
          per_page: this.pagination.per_page,
          search: this.filters.search || undefined,
          center_id: this.filters.center_id || undefined,
          status: this.filters.status || undefined,
          gender: this.filters.gender || undefined,
          nationality_id: this.filters.nationality_id || undefined,
          with_photos: true, // Keep photos for the inmates list display
        };

        // Remove undefined values
        Object.keys(params).forEach((key) => {
          if (params[key as keyof typeof params] === undefined) {
            delete params[key as keyof typeof params];
          }
        });

        const response = await ApiService.query("/inmates", params);

        // Handle API response structure: { success: true, data: { current_page: 1, data: [...], ... } }
        if (
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          // Laravel paginated response wrapped in success response
          this.inmates = response.data.data.data;
          this.pagination = {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            per_page: response.data.data.per_page,
            total: response.data.data.total,
          };
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Direct Laravel paginated response: { data: [...], current_page: 1, ... }
          this.inmates = response.data.data;
          this.pagination = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            total: response.data.total,
          };
        } else if (Array.isArray(response.data)) {
          // Direct array response: [...]
          this.inmates = response.data;
          this.pagination = {
            current_page: 1,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length,
          };
        } else {
          console.error("❌ Unexpected response structure:", response.data);
          this.inmates = [];
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error al cargar los internos";
        console.error("Error fetching inmates:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch single inmate details
    async fetchInmate(id: string | number) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.get(`/inmates/${id}?with_photos=true&with_biometrics=true&include_images=true`);
        this.currentInmate = response.data.data;

        return this.currentInmate;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error al cargar el interno";
        console.error("Error fetching inmate:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new inmate
    async createInmate(inmateData: InmateCreate) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.post("/inmates", inmateData);
        const newInmate = response.data.data;

        // Add to inmates list if we're on first page
        if (this.pagination.current_page === 1) {
          this.inmates.unshift(newInmate);
        }

        return newInmate;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error al crear el interno";
        console.error("Error creating inmate:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update inmate
    async updateInmate(id: string | number, inmateData: InmateUpdate) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.put(`/inmates/${id}`, inmateData);
        const updatedInmate = response.data.data;

        // Update in list
        const index = this.inmates.findIndex((inmate) => inmate.id === id);
        if (index !== -1) {
          this.inmates[index] = updatedInmate;
        }

        // Update current inmate if it's the same
        if (this.currentInmate?.id === id) {
          this.currentInmate = updatedInmate;
        }

        return updatedInmate;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error al actualizar el interno";
        console.error("Error updating inmate:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete inmate (soft delete)
    async deleteInmate(id: string | number) {
      try {
        this.loading = true;
        this.error = null;

        await ApiService.delete(`/inmates/${id}`);

        // Remove from list
        this.inmates = this.inmates.filter((inmate) => inmate.id !== id);

        // Clear current inmate if it's the deleted one
        if (this.currentInmate?.id === id) {
          this.currentInmate = null;
        }

        return true;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error al eliminar el interno";
        console.error("Error deleting inmate:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Transfer inmate
    async transferInmate(id: string | number, transferData: any) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.post(
          `/inmates/${id}/transfer`,
          transferData,
        );

        // Refresh inmate data after transfer
        await this.fetchInmate(id);

        return response.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error al transferir el interno";
        console.error("Error transferring inmate:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Change inmate status
    async changeInmateStatus(
      id: string | number,
      status: string,
      reason?: string,
    ) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.post(`/inmates/${id}/change-status`, {
          status,
          reason,
        });

        // Update in list
        const index = this.inmates.findIndex((inmate) => inmate.id === id);
        if (index !== -1) {
          this.inmates[index].status = status;
        }

        // Update current inmate if it's the same
        if (this.currentInmate?.id === id) {
          this.currentInmate.status = status;
        }

        return response.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message ||
          "Error al cambiar el estado del interno";
        console.error("Error changing inmate status:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Advanced search
    async advancedSearch(searchParams: Record<string, any>) {
      try {
        this.loading = true;
        this.error = null;

        const response = await ApiService.post(
          "/inmates/advanced-search",
          searchParams,
        );

        // Laravel paginate returns data.data for the items
        const paginatedData = response.data.data;
        this.inmates = paginatedData.data || [];

        // Update pagination from Laravel paginator
        this.pagination = {
          current_page: paginatedData.current_page || 1,
          last_page: paginatedData.last_page || 1,
          per_page: paginatedData.per_page || 15,
          total: paginatedData.total || 0,
        };

        return response.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || "Error en la búsqueda avanzada";
        console.error("Error in advanced search:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get statistics
    async fetchStatistics() {
      try {
        const response = await ApiService.get("/inmates/statistics");
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching inmate statistics:", error);
        throw error;
      }
    },

    // Update filters
    setFilters(newFilters: Partial<InmateState["filters"]>) {
      this.filters = { ...this.filters, ...newFilters };
    },

    // Clear filters
    clearFilters() {
      this.filters = {
        search: "",
        center_id: null,
        status: null,
        gender: null,
        nationality_id: null,
      };
    },

    // Set current page
    setCurrentPage(page: number) {
      this.pagination.current_page = page;
    },

    // Clear current inmate
    clearCurrentInmate() {
      this.currentInmate = null;
    },

    // Clear error
    clearError() {
      this.error = null;
    },

    // Reset store
    resetStore() {
      this.inmates = [];
      this.currentInmate = null;
      this.loading = false;
      this.error = null;
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
