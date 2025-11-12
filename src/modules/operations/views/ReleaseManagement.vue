<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3><i class="bi bi-box-arrow-right me-2"></i>Gestión de Liberaciones</h3>
        <p class="text-muted">Administración de liberaciones programadas y completadas</p>
      </div>
      <div class="card-toolbar">
        <button
          @click="loadData"
          class="btn btn-light btn-sm me-2"
          :disabled="releasesLoading"
        >
          <i class="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Statistics Cards -->
      <div class="row mb-6" v-if="statistics">
        <div class="col-md-3">
          <div class="card bg-light-warning">
            <div class="card-body d-flex align-items-center">
              <i class="bi bi-clock-history fs-2x text-warning me-3"></i>
              <div>
                <div class="fs-4 fw-bold">{{ statistics.pending }}</div>
                <div class="fs-7 text-muted">Pendientes</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-danger">
            <div class="card-body d-flex align-items-center">
              <i class="bi bi-calendar-event fs-2x text-danger me-3"></i>
              <div>
                <div class="fs-4 fw-bold">{{ statistics.today }}</div>
                <div class="fs-7 text-muted">Hoy</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body d-flex align-items-center">
              <i class="bi bi-exclamation-triangle fs-2x text-primary me-3"></i>
              <div>
                <div class="fs-4 fw-bold">{{ statistics.overdue }}</div>
                <div class="fs-7 text-muted">Vencidas</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body d-flex align-items-center">
              <i class="bi bi-check-circle fs-2x text-success me-3"></i>
              <div>
                <div class="fs-4 fw-bold">{{ statistics.completed }}</div>
                <div class="fs-7 text-muted">Completadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs nav-line-tabs mb-5 fs-6">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'all' }"
            @click.prevent="activeTab = 'all'"
            href="#"
          >
            Todas
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'pending' }"
            @click.prevent="activeTab = 'pending'"
            href="#"
          >
            Pendientes
            <span v-if="statistics" class="badge badge-light-warning ms-2">{{ statistics.pending }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'today' }"
            @click.prevent="activeTab = 'today'"
            href="#"
          >
            Hoy
            <span v-if="statistics" class="badge badge-light-danger ms-2">{{ statistics.today }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'overdue' }"
            @click.prevent="activeTab = 'overdue'"
            href="#"
          >
            Vencidas
            <span v-if="statistics" class="badge badge-light-primary ms-2">{{ statistics.overdue }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'completed' }"
            @click.prevent="activeTab = 'completed'"
            href="#"
          >
            Completadas
          </a>
        </li>
      </ul>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Motivo de Liberación</label>
          <select v-model="filters.exit_reason_id" class="form-select" :disabled="loadingCatalogs">
            <option value="">Todos</option>
            <option
              v-for="reason in exitReasons"
              :key="reason.id"
              :value="reason.id"
            >
              {{ reason.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Desde</label>
          <input
            type="date"
            v-model="filters.date_from"
            class="form-control"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Hasta</label>
          <input
            type="date"
            v-model="filters.date_to"
            class="form-control"
          >
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button
            @click="clearFilters"
            class="btn btn-light w-100"
          >
            <i class="bi bi-x-circle me-2"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="releasesLoading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-3">Cargando liberaciones...</p>
      </div>

      <!-- Releases Table -->
      <div v-else-if="filteredReleases.length > 0" class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
          <thead>
            <tr class="fw-bold text-muted">
              <th class="min-w-150px">Número</th>
              <th class="min-w-200px">PPL</th>
              <th class="min-w-150px">Fecha Programada</th>
              <th class="min-w-150px">Motivo</th>
              <th class="min-w-120px">Estado</th>
              <th class="text-end min-w-150px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="release in filteredReleases" :key="release.id">
              <td>
                <span class="text-dark fw-bold d-block fs-6">{{ release.release_number }}</span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold">{{ release.inmate?.first_name }} {{ release.inmate?.last_name }}</span>
                  <span class="text-muted fs-7">{{ release.inmate?.document_number }}</span>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :class="getDateBadgeClass(release.scheduled_release_date, release.release_completed)"
                >
                  {{ formatDate(release.scheduled_release_date) }}
                </span>
              </td>
              <td>
                <span class="text-dark">{{ release.exitReason?.name || 'N/A' }}</span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="release.release_completed ? 'badge-light-success' : 'badge-light-warning'"
                >
                  {{ release.release_completed ? 'Completada' : 'Pendiente' }}
                </span>
              </td>
              <td class="text-end">
                <button
                  @click="viewDetails(release)"
                  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                  title="Ver detalles"
                >
                  <i class="bi bi-eye fs-4"></i>
                </button>
                <button
                  v-if="!release.release_completed"
                  @click="openCompleteModal(release)"
                  class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
                  title="Completar liberación"
                >
                  <i class="bi bi-check-circle fs-4"></i>
                </button>
                <button
                  v-if="!release.release_completed"
                  @click="handleCancelRelease(release)"
                  class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                  title="Cancelar liberación"
                >
                  <i class="bi bi-x-circle fs-4"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-10">
        <i class="bi bi-inbox fs-3x text-muted mb-4"></i>
        <h4 class="text-muted">No hay liberaciones</h4>
        <p class="text-muted">No se encontraron liberaciones para el filtro seleccionado.</p>
      </div>
    </div>

    <!-- Modals -->
    <CompleteReleaseModal
      v-if="selectedRelease"
      :release="selectedRelease"
      @completed="handleReleaseCompleted"
      @close="selectedRelease = null"
    />

    <ReleaseDetailModal
      v-if="detailRelease"
      :release="detailRelease"
      @close="detailRelease = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useReleases } from '@/composables/useReleases';
import { useCatalogs } from '@/composables/useCatalogs';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import CompleteReleaseModal from '@/components/releases/modals/CompleteReleaseModal.vue';
import ReleaseDetailModal from '@/components/releases/modals/ReleaseDetailModal.vue';

// Composables
const {
  loading: releasesLoading,
  releases,
  getReleases,
  getReleaseDetails,
  getTodayReleases,
  getOverdueReleases,
  cancelRelease
} = useReleases();

const { fetchCatalog } = useCatalogs();

// State
const activeTab = ref('all');
const exitReasons = ref<any[]>([]);
const loadingCatalogs = ref(false);
const selectedRelease = ref<any>(null);
const detailRelease = ref<any>(null);

const filters = ref({
  exit_reason_id: '',
  date_from: '',
  date_to: ''
});

const statistics = ref({
  pending: 0,
  today: 0,
  overdue: 0,
  completed: 0
});

// Computed
const filteredReleases = computed(() => {
  let result = releases.value;

  // Filter by tab
  if (activeTab.value === 'pending') {
    result = result.filter((r: any) => !r.release_completed && !isOverdue(r.scheduled_release_date));
  } else if (activeTab.value === 'today') {
    result = result.filter((r: any) => isToday(r.scheduled_release_date) && !r.release_completed);
  } else if (activeTab.value === 'overdue') {
    result = result.filter((r: any) => isOverdue(r.scheduled_release_date) && !r.release_completed);
  } else if (activeTab.value === 'completed') {
    result = result.filter((r: any) => r.release_completed);
  }

  // Apply additional filters
  if (filters.value.exit_reason_id) {
    result = result.filter((r: any) => r.exit_reason_id === parseInt(filters.value.exit_reason_id));
  }

  if (filters.value.date_from) {
    result = result.filter((r: any) => r.scheduled_release_date >= filters.value.date_from);
  }

  if (filters.value.date_to) {
    result = result.filter((r: any) => r.scheduled_release_date <= filters.value.date_to);
  }

  return result;
});

// Methods
const loadData = async () => {
  await Promise.all([
    loadReleases(),
    loadCatalogs()
  ]);
  calculateStatistics();
};

const loadReleases = async () => {
  const params: any = {};

  if (activeTab.value === 'pending') {
    params.status = 'pending';
  } else if (activeTab.value === 'completed') {
    params.status = 'completed';
  }

  await getReleases(params);
};

const loadCatalogs = async () => {
  loadingCatalogs.value = true;
  try {
    exitReasons.value = await fetchCatalog('exit-reasons', true);
  } catch (error) {
    console.error('Error loading catalogs:', error);
  } finally {
    loadingCatalogs.value = false;
  }
};

const calculateStatistics = () => {
  const today = dayjs().format('YYYY-MM-DD');

  statistics.value = {
    pending: releases.value.filter((r: any) =>
      !r.release_completed && !isOverdue(r.scheduled_release_date)
    ).length,
    today: releases.value.filter((r: any) =>
      r.scheduled_release_date === today && !r.release_completed
    ).length,
    overdue: releases.value.filter((r: any) =>
      isOverdue(r.scheduled_release_date) && !r.release_completed
    ).length,
    completed: releases.value.filter((r: any) => r.release_completed).length
  };
};

const clearFilters = () => {
  filters.value = {
    exit_reason_id: '',
    date_from: '',
    date_to: ''
  };
};

const openCompleteModal = (release: any) => {
  selectedRelease.value = release;
};

const viewDetails = async (release: any) => {
  // Cargar detalles completos desde el backend
  const fullDetails = await getReleaseDetails(release.id);
  if (fullDetails) {
    detailRelease.value = fullDetails;
  }
};

const handleCancelRelease = async (release: any) => {
  const { value: reason } = await Swal.fire({
    title: 'Cancelar Liberación',
    text: '¿Por qué desea cancelar esta liberación?',
    input: 'textarea',
    inputPlaceholder: 'Ingrese el motivo de la cancelación...',
    inputAttributes: {
      'aria-label': 'Motivo de cancelación'
    },
    showCancelButton: true,
    confirmButtonText: 'Cancelar Liberación',
    cancelButtonText: 'No, volver',
    confirmButtonColor: '#d33',
    inputValidator: (value) => {
      if (!value) {
        return '¡Debe ingresar un motivo!';
      }
      return null;
    }
  });

  if (reason) {
    const result = await cancelRelease(release.id, reason);
    if (result) {
      loadData();
    }
  }
};

const handleReleaseCompleted = () => {
  selectedRelease.value = null;
  loadData();
};

// Helper methods
const isToday = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
};

const isOverdue = (date: string) => {
  return dayjs(date).isBefore(dayjs(), 'day');
};

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const getDateBadgeClass = (date: string, completed: boolean) => {
  if (completed) return 'badge-light-success';
  if (isToday(date)) return 'badge-danger';
  if (isOverdue(date)) return 'badge-primary';
  return 'badge-light';
};

// Watchers
watch(activeTab, () => {
  loadReleases();
});

watch(filters, () => {
  // Filtering happens in computed property
}, { deep: true });

// Lifecycle
onMounted(() => {
  loadData();
});
</script>