import { ref } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

interface InmateRelease {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  exit_reason_id: number;
  release_number: string;
  scheduled_release_date: string;
  actual_release_datetime: string | null;
  authorization_document_number: string | null;
  authorizing_court_id: number | null;
  authorizing_authority: string | null;
  authorization_date: string | null;
  release_conditions: string | null;
  has_conditions: boolean;
  supervision_end_date: string | null;
  final_observations: string | null;
  release_completed: boolean;
  // Relaciones
  inmate?: any;
  legalProfile?: any;
  exitReason?: any;
  authorizingCourt?: any;
}

export function useReleases() {
  const loading = ref(false);
  const releases = ref<InmateRelease[]>([]);
  const currentRelease = ref<InmateRelease | null>(null);
  const todayReleases = ref<InmateRelease[]>([]);
  const overdueReleases = ref<InmateRelease[]>([]);
  const error = ref<string | null>(null);

  /**
   * Obtener todas las liberaciones con filtros
   */
  const getReleases = async (filters: any = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.query('/legal/releases', { params: filters });

      if (response.data.success) {
        releases.value = response.data.data.data || response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener liberaciones');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener liberaciones';
      console.error('Error getting releases:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener liberaciones de un interno específico
   */
  const getReleasesByInmate = async (inmateId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get(`/legal/releases/inmate/${inmateId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener liberaciones del interno');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener liberaciones';
      console.error('Error getting inmate releases:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener detalles de una liberación
   */
  const getReleaseDetails = async (releaseId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get(`/legal/releases/${releaseId}`);

      if (response.data.success) {
        currentRelease.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener detalles de la liberación');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener detalles';
      console.error('Error getting release details:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear proceso de liberación
   */
  const createRelease = async (releaseData: any) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.post('/legal/releases', releaseData);

      if (response.data.success) {
        const message = releaseData.release_immediately
          ? 'Interno liberado exitosamente'
          : 'Liberación programada exitosamente';

        Swal.fire({
          title: '¡Éxito!',
          text: message,
          icon: 'success'
        });

        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al crear liberación');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al crear liberación';
      console.error('Error creating release:', err);

      Swal.fire({
        title: 'Error',
        text: error.value,
        icon: 'error'
      });

      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Completar proceso de liberación
   */
  const completeRelease = async (releaseId: number, completionData: any = {}) => {
    loading.value = true;
    error.value = null;

    // Confirmar acción
    const result = await Swal.fire({
      title: '¿Completar liberación?',
      text: 'Esta acción marcará la liberación como completada y actualizará el estado del interno.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      loading.value = false;
      return null;
    }

    try {
      const response = await ApiService.post(`/legal/releases/${releaseId}/complete`, completionData);

      if (response.data.success) {
        Swal.fire({
          title: '¡Completado!',
          text: 'Liberación completada exitosamente',
          icon: 'success'
        });

        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al completar liberación');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al completar liberación';
      console.error('Error completing release:', err);

      Swal.fire({
        title: 'Error',
        text: error.value,
        icon: 'error'
      });

      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cancelar liberación
   */
  const cancelRelease = async (releaseId: number, cancellationReason: string) => {
    loading.value = true;
    error.value = null;

    // Confirmar acción
    const result = await Swal.fire({
      title: '¿Cancelar liberación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar liberación',
      cancelButtonText: 'No'
    });

    if (!result.isConfirmed) {
      loading.value = false;
      return null;
    }

    try {
      const response = await ApiService.post(`/legal/releases/${releaseId}/cancel`, {
        cancellation_reason: cancellationReason
      });

      if (response.data.success) {
        Swal.fire({
          title: '¡Cancelado!',
          text: 'Liberación cancelada exitosamente',
          icon: 'success'
        });

        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al cancelar liberación');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al cancelar liberación';
      console.error('Error cancelling release:', err);

      Swal.fire({
        title: 'Error',
        text: error.value,
        icon: 'error'
      });

      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener liberaciones de hoy
   */
  const getTodayReleases = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get('/legal/releases/today');

      if (response.data.success) {
        todayReleases.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener liberaciones de hoy');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener liberaciones';
      console.error('Error getting today releases:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener liberaciones vencidas
   */
  const getOverdueReleases = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get('/legal/releases/overdue');

      if (response.data.success) {
        overdueReleases.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener liberaciones vencidas');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener liberaciones';
      console.error('Error getting overdue releases:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    loading,
    releases,
    currentRelease,
    todayReleases,
    overdueReleases,
    error,

    // Methods
    getReleases,
    getReleasesByInmate,
    getReleaseDetails,
    createRelease,
    completeRelease,
    cancelRelease,
    getTodayReleases,
    getOverdueReleases
  };
}
