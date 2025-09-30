<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h3 class="fw-bold m-0">Información Legal del Interno</h3>
      </div>
      <div class="card-toolbar">
        <router-link :to="`/inmates/${inmateId}`" class="btn btn-light-secondary me-3">
          <i class="ki-duotone ki-arrow-left fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Volver al Perfil
        </router-link>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Legal Tabs Navigation -->
      <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: activeTab === 'profile' }"
            @click="activeTab = 'profile'"
            href="#"
          >
            <i class="ki-duotone ki-user fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Perfil Legal
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link"
            :class="{ active: activeTab === 'crimes' }"
            @click="activeTab = 'crimes'"
            href="#"
          >
            <i class="ki-duotone ki-shield-cross fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Delitos
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link"
            :class="{ active: activeTab === 'hearings' }"
            @click="activeTab = 'hearings'"
            href="#"
          >
            <i class="ki-duotone ki-calendar fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Audiencias
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link"
            :class="{ active: activeTab === 'resolutions' }"
            @click="activeTab = 'resolutions'"
            href="#"
          >
            <i class="ki-duotone ki-document fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Resoluciones
          </a>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Legal Profile Tab -->
        <div v-if="activeTab === 'profile'" class="tab-pane fade show active">
          <h4 class="mb-4">Perfil Legal</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="legalProfile" class="row g-5">
            <div class="col-md-6">
              <label class="form-label fw-bold">Número de Caso:</label>
              <p>{{ legalProfile.case_number || 'No especificado' }}</p>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Estado Legal:</label>
              <p>{{ legalProfile.legal_status || 'No especificado' }}</p>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Estado Procesal:</label>
              <p>{{ legalProfile.procedural_status?.name || 'No especificado' }}</p>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Juzgado:</label>
              <p>{{ legalProfile.court?.name || 'No especificado' }}</p>
            </div>
          </div>
          <div v-else class="alert alert-info">
            No hay información legal disponible para este interno.
          </div>
        </div>

        <!-- Crimes Tab -->
        <div v-if="activeTab === 'crimes'" class="tab-pane fade show active">
          <h4 class="mb-4">Delitos Imputados</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="crimes && crimes.length > 0">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>Delito</th>
                    <th>Clasificación</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="crime in crimes" :key="crime.id">
                    <td>{{ crime.crime?.name || 'No especificado' }}</td>
                    <td>{{ crime.crime?.classification || '-' }}</td>
                    <td>{{ formatDate(crime.created_at) }}</td>
                    <td>
                      <span class="badge badge-light-primary">{{ crime.status || 'Activo' }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info">
            No hay delitos registrados para este interno.
          </div>
        </div>

        <!-- Hearings Tab -->
        <div v-if="activeTab === 'hearings'" class="tab-pane fade show active">
          <h4 class="mb-4">Audiencias</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="hearings && hearings.length > 0">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Juzgado</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hearing in hearings" :key="hearing.id">
                    <td>{{ formatDate(hearing.hearing_date) }}</td>
                    <td>{{ hearing.hearing_type || 'No especificado' }}</td>
                    <td>{{ hearing.court?.name || '-' }}</td>
                    <td>
                      <span :class="`badge badge-light-${getStatusColor(hearing.status)}`">
                        {{ hearing.status || 'Pendiente' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info">
            No hay audiencias programadas para este interno.
          </div>
        </div>

        <!-- Resolutions Tab -->
        <div v-if="activeTab === 'resolutions'" class="tab-pane fade show active">
          <h4 class="mb-4">Resoluciones Judiciales</h4>
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="resolutions && resolutions.length > 0">
            <div class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Juzgado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="resolution in resolutions" :key="resolution.id">
                    <td>{{ formatDate(resolution.resolution_date) }}</td>
                    <td>{{ resolution.resolution_type || 'No especificado' }}</td>
                    <td>{{ resolution.description || '-' }}</td>
                    <td>{{ resolution.court?.name || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="alert alert-info">
            No hay resoluciones judiciales registradas para este interno.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ApiService from '@/core/services/ApiService';

const route = useRoute();
const inmateId = computed(() => route.params.id);
const activeTab = ref('profile');
const loading = ref(false);

const legalProfile = ref<any>(null);
const crimes = ref<any[]>([]);
const hearings = ref<any[]>([]);
const resolutions = ref<any[]>([]);

const formatDate = (date: string) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('es-GT');
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completado':
      return 'success';
    case 'pending':
    case 'pendiente':
      return 'warning';
    case 'cancelled':
    case 'cancelado':
      return 'danger';
    default:
      return 'info';
  }
};

const loadLegalData = async () => {
  loading.value = true;
  try {
    // Load legal profile
    const profileResponse = await ApiService.get(`/inmates/${inmateId.value}/legal-profile`);
    legalProfile.value = profileResponse.data.data;

    // Load crimes
    const crimesResponse = await ApiService.get(`/inmates/${inmateId.value}/crimes`);
    crimes.value = crimesResponse.data.data || [];

    // Load hearings
    const hearingsResponse = await ApiService.get(`/inmates/${inmateId.value}/hearings`);
    hearings.value = hearingsResponse.data.data || [];

    // Load resolutions
    const resolutionsResponse = await ApiService.get(`/inmates/${inmateId.value}/resolutions`);
    resolutions.value = resolutionsResponse.data.data || [];
  } catch (error) {
    console.error('Error loading legal data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const section = route.params.section as string;
  if (section) {
    activeTab.value = section;
  }
  loadLegalData();
});
</script>

<style scoped>
.nav-line-tabs .nav-link {
  cursor: pointer;
}

.nav-line-tabs .nav-link.active {
  color: var(--kt-primary);
  border-bottom-color: var(--kt-primary);
}
</style>