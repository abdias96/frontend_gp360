import { ref, computed } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

interface LegalProfile {
  id: number;
  inmate_id: number;
  admission_number: number;
  admission_date: string;
  release_date: string | null;
  profile_status: 'active' | 'completed' | 'transferred' | 'deceased';
  is_reentry: boolean;
  previous_case_number: string | null;
  case_number: string;
  judicial_file_number: string | null;
  court_id: number;
  procedural_status_id: number;
  procedural_stage: string | null;
  in_preventive_detention: boolean;
  preventive_detention_start: string | null;
  preventive_detention_max_end: string | null;
  preventive_detention_expired: boolean;
  sentence_type_id: number | null;
  sentence_years: number | null;
  sentence_months: number | null;
  sentence_days: number | null;
  sentence_start_date: string | null;
  sentence_end_date: string | null;
  sentence_final: boolean;
  // Relaciones
  court?: any;
  proceduralStatus?: any;
  sentenceType?: any;
  crimes?: any[];
  hearings?: any[];
  judicialResolutions?: any[];
}

interface ProfileStatistics {
  total_profiles: number;
  active_profiles: number;
  completed_profiles: number;
  total_admissions: number;
  is_reentry: boolean;
  first_admission_date: string | null;
  last_admission_date: string | null;
}

export function useLegalProfiles() {
  const loading = ref(false);
  const activeProfile = ref<LegalProfile | null>(null);
  const allProfiles = ref<LegalProfile[]>([]);
  const statistics = ref<ProfileStatistics | null>(null);
  const error = ref<string | null>(null);

  /**
   * Obtener perfil legal activo de un interno
   */
  const getActiveProfile = async (inmateId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get(`/legal/profiles/inmate/${inmateId}/active`);

      if (response.data.success) {
        activeProfile.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener perfil activo');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener perfil activo';
      console.error('Error getting active profile:', err);

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
   * Obtener todos los perfiles de un interno (histórico)
   */
  const getAllProfiles = async (inmateId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get(`/legal/profiles/inmate/${inmateId}/all`);

      if (response.data.success) {
        allProfiles.value = response.data.data.profiles;
        statistics.value = response.data.data.statistics;
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener perfiles');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener perfiles';
      console.error('Error getting all profiles:', err);

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
   * Obtener detalles de un perfil específico
   */
  const getProfileDetails = async (profileId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.get(`/legal/profiles/${profileId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener detalles del perfil');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al obtener detalles del perfil';
      console.error('Error getting profile details:', err);

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
   * Crear nuevo perfil legal (reingreso)
   */
  const createProfile = async (profileData: any) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.post('/legal/profiles', profileData);

      if (response.data.success) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Perfil legal creado exitosamente',
          icon: 'success'
        });

        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al crear perfil');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al crear perfil';
      console.error('Error creating profile:', err);

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
   * Actualizar perfil legal
   */
  const updateProfile = async (profileId: number, profileData: any) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await ApiService.put(`/legal/profiles/${profileId}`, profileData);

      if (response.data.success) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Perfil legal actualizado exitosamente',
          icon: 'success'
        });

        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar perfil');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al actualizar perfil';
      console.error('Error updating profile:', err);

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
   * Marcar interno como fallecido
   */
  const markAsDeceased = async (profileId: number, deathData: any = {}) => {
    loading.value = true;
    error.value = null;

    // Confirmar acción
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción marcará al interno como fallecido. No se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, marcar como fallecido',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      loading.value = false;
      return null;
    }

    try {
      const response = await ApiService.post(`/legal/profiles/${profileId}/mark-deceased`, deathData);

      if (response.data.success) {
        Swal.fire({
          title: '¡Confirmado!',
          text: 'Interno marcado como fallecido',
          icon: 'success'
        });

        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al marcar como fallecido');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Error al marcar como fallecido';
      console.error('Error marking as deceased:', err);

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

  // Computed properties
  const hasActiveProfile = computed(() => activeProfile.value !== null);
  const isReentry = computed(() => statistics.value?.is_reentry || false);
  const totalAdmissions = computed(() => statistics.value?.total_admissions || 0);

  return {
    // State
    loading,
    activeProfile,
    allProfiles,
    statistics,
    error,

    // Computed
    hasActiveProfile,
    isReentry,
    totalAdmissions,

    // Methods
    getActiveProfile,
    getAllProfiles,
    getProfileDetails,
    createProfile,
    updateProfile,
    markAsDeceased
  };
}
