<template>
  <div class="d-flex flex-column gap-7 gap-lg-10">
    <div class="d-flex flex-wrap flex-stack gap-5 gap-lg-10">
      <div class="d-flex flex-column">
        <h1 class="fw-bold text-gray-900 mb-1">Perfiles Legales</h1>
        <div class="text-gray-600 fw-semibold fs-6">
          Gestión de información legal de internos
        </div>
      </div>
      <div class="d-flex gap-3">
        <button
          v-if="canCreate"
          type="button"
          class="btn btn-sm btn-primary"
          @click="createProfile"
        >
          <i class="ki-duotone ki-plus fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Crear Perfil Legal
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <div class="d-flex align-items-center position-relative my-1">
            <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              v-model="searchTerm"
              type="text"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Buscar perfiles legales..."
              @input="handleSearch"
            />
          </div>
        </div>
      </div>

      <div class="card-body py-4">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          <i class="ki-duotone ki-information fs-2 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          {{ error }}
        </div>

        <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <th class="min-w-125px">Interno</th>
                <th class="min-w-125px">Caso</th>
                <th class="min-w-125px">Tribunal</th>
                <th class="min-w-100px">Estado</th>
                <th class="min-w-100px">Audiencias</th>
                <th class="min-w-100px">Delitos</th>
                <th class="min-w-100px">Última Actualización</th>
                <th class="text-end min-w-100px">Acciones</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold">
              <tr v-for="profile in profiles.data" :key="profile.id">
                <td class="d-flex align-items-center">
                  <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                    <div class="symbol-label bg-light-primary text-primary">
                      {{ getInitials(profile.inmate?.first_name, profile.inmate?.last_name) }}
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <router-link
                      :to="`/inmates/${profile.inmate?.id}`"
                      class="text-gray-800 text-hover-primary mb-1"
                    >
                      {{ profile.inmate?.first_name }} {{ profile.inmate?.last_name }}
                    </router-link>
                    <span class="text-muted">{{ profile.inmate?.document_number }}</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 mb-1">{{ profile.case_number }}</span>
                    <span class="text-muted fs-7">{{ profile.judicial_file_number || 'N/A' }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-gray-800">{{ profile.court?.name || 'N/A' }}</span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="badge" :class="getStatusBadgeClass(profile)">
                      {{ getStatusLabel(profile) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="text-gray-800 fw-bold">{{ profile.hearings_count || 0 }}</span>
                </td>
                <td>
                  <span class="text-gray-800 fw-bold">{{ profile.crimes_count || 0 }}</span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800">{{ formatDate(profile.updated_at) }}</span>
                    <span class="text-muted fs-7">por {{ profile.updated_by?.first_name }}</span>
                  </div>
                </td>
                <td class="text-end">
                  <router-link
                    :to="`/inmates/${profile.inmate?.id}`"
                    class="btn btn-light btn-active-light-primary btn-sm"
                  >
                    Ver Detalle
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ApiService from '@/core/services/ApiService';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);
const searchTerm = ref('');
const profiles = ref<any>({});

const canCreate = computed(() => authStore.hasPermission('inmates.legal.edit'));

const loadProfiles = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('Loading profiles with search term:', searchTerm.value);
    
    console.log('Making API call to: /inmate-legal-profiles');
    
    // Temporarily call without any parameters to test
    const response = await ApiService.get('/inmate-legal-profiles');
    console.log('API response:', response.data);
    
    profiles.value = response.data.data;

  } catch (err: any) {
    console.error('Full error object:', err);
    console.error('Error response:', err.response);
    error.value = err.response?.data?.message || 'Error al cargar perfiles legales';
  } finally {
    loading.value = false;
  }
};

const handleSearch = debounce(() => {
  loadProfiles();
}, 300);

const createProfile = () => {
  router.push('/inmates/create');
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const getStatusBadgeClass = (profile: any) => {
  if (profile.sentence_date) {
    return profile.sentence_final ? 'badge-light-success' : 'badge-light-warning';
  }
  return 'badge-light-info';
};

const getStatusLabel = (profile: any) => {
  return 'Proceso Abierto';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

onMounted(() => {
  loadProfiles();
});
</script>