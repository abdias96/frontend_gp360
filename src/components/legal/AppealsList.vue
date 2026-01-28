<template>
  <div>
    <!-- Header Actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h6 class="fw-bold text-gray-800">Listado de Apelaciones</h6>
      <button
        class="btn btn-sm btn-primary"
        @click="openNewAppeal"
        v-if="!inmateId"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Nueva Apelación
      </button>
    </div>

    <!-- Filters (only for general list) -->
    <div v-if="!inmateId" class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select v-model="filters.appeal_type" class="form-select form-select-sm">
              <option value="">Todos los tipos</option>
              <option v-for="type in appealTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.appeal_status" class="form-select form-select-sm">
              <option value="">Todos los estados</option>
              <option v-for="status in appealStatuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <input
              v-model="filters.date_from"
              type="date"
              class="form-control form-control-sm"
              placeholder="Fecha desde"
            />
          </div>
          <div class="col-md-3">
            <input
              v-model="filters.date_to"
              type="date"
              class="form-control form-control-sm"
              placeholder="Fecha hasta"
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <button @click="applyFilters" class="btn btn-sm btn-primary me-2">
              <i class="bi bi-search me-1"></i>Buscar
            </button>
            <button @click="clearFilters" class="btn btn-sm btn-light">
              <i class="bi bi-x-circle me-1"></i>Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics (for inmate view) -->
    <div v-if="inmateId && stats" class="row mb-4">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-muted mb-0">Total</p>
                <h4 class="mb-0">{{ stats.total }}</h4>
              </div>
              <i class="bi bi-file-text fs-2 text-primary"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-muted mb-0">Activas</p>
                <h4 class="mb-0 text-warning">{{ stats.active }}</h4>
              </div>
              <i class="bi bi-hourglass-split fs-2 text-warning"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-muted mb-0">Favorables</p>
                <h4 class="mb-0 text-success">{{ stats.favorable }}</h4>
              </div>
              <i class="bi bi-check-circle fs-2 text-success"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-muted mb-0">Desfavorables</p>
                <h4 class="mb-0 text-danger">{{ stats.unfavorable }}</h4>
              </div>
              <i class="bi bi-x-circle fs-2 text-danger"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appeals Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="appeals.length === 0" class="text-center py-4">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">No se encontraron apelaciones</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Resolución Original</th>
                <th>Tipo de Recurso</th>
                <th>Fecha Interposición</th>
                <th>Tribunal</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appeal in appeals" :key="appeal.id">
                <td>
                  <div v-if="appeal.original_resolution">
                    <span class="fw-bold">{{ appeal.original_resolution.number }}</span>
                    <br>
                    <small class="text-muted">{{ appeal.original_resolution.type }}</small>
                  </div>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <span class="badge bg-light-primary">
                    {{ appeal.appeal_type_display }}
                  </span>
                </td>
                <td>{{ formatDate(appeal.appeal_filed_date) }}</td>
                <td>
                  <span v-if="appeal.appeals_court">
                    {{ appeal.appeals_court.name }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusClass(appeal.appeal_status)"
                  >
                    {{ appeal.appeal_status_display }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-light-primary"
                      @click="viewAppeal(appeal)"
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-light-warning"
                      @click="editAppeal(appeal)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-light-info"
                      @click="updateStatus(appeal)"
                      title="Actualizar estado"
                    >
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                    <button
                      class="btn btn-light-danger"
                      @click="deleteAppeal(appeal)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="d-flex justify-content-between align-items-center mt-4">
          <div>
            Mostrando {{ pagination.from }} a {{ pagination.to }} de {{ pagination.total }} registros
          </div>
          <nav>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                <a class="page-link" @click="changePage(pagination.current_page - 1)">
                  Anterior
                </a>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === pagination.current_page }"
              >
                <a class="page-link" @click="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                <a class="page-link" @click="changePage(pagination.current_page + 1)">
                  Siguiente
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Appeals Modal -->
    <AppealsModal
      ref="appealsModal"
      :inmate-id="props.inmateId || null"
      @saved="loadAppeals"
    />

    <!-- Status Update Modal -->
    <StatusUpdateModal
      ref="statusModal"
      @updated="loadAppeals"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ApiService from '@/core/services/ApiService';
import AppealsModal from './AppealsModal.vue';
import StatusUpdateModal from './StatusUpdateModal.vue';
import Swal from 'sweetalert2';

const props = defineProps<{
  inmateId?: number | null;
}>();

const loading = ref(false);
const appeals = ref<any[]>([]);
const pagination = ref<any>(null);
const currentPage = ref(1);
const stats = ref<any>(null);

const filters = ref({
  appeal_type: '',
  appeal_status: '',
  date_from: '',
  date_to: ''
});

const appealTypes = ref<Array<{value: string; label: string}>>([]);
const appealStatuses = ref<Array<{value: string; label: string}>>([]);

const appealsModal = ref<InstanceType<typeof AppealsModal>>();
const statusModal = ref<InstanceType<typeof StatusUpdateModal>>();

onMounted(async () => {
  await loadAppealTypes();
  await loadAppealStatuses();
  await loadAppeals();
});

const loadAppealTypes = async () => {
  try {
    const response = await ApiService.get('/legal/appeals/types');
    appealTypes.value = response.data.data;
  } catch (error) {
    console.error('Error loading appeal types:', error);
  }
};

const loadAppealStatuses = async () => {
  try {
    const response = await ApiService.get('/legal/appeals/statuses');
    appealStatuses.value = response.data.data;
  } catch (error) {
    console.error('Error loading appeal statuses:', error);
  }
};

const loadAppeals = async () => {
  loading.value = true;
  try {
    let response;
    if (props.inmateId) {
      // Load appeals for specific inmate
      response = await ApiService.get(`/legal/appeals/inmate/${props.inmateId}`);
      if (response.data.success && response.data.data) {
        appeals.value = response.data.data.all_appeals || [];
        stats.value = response.data.data.stats || null;
      }
    } else {
      // Load all appeals with filters and pagination
      const params = {
        page: currentPage.value,
        per_page: 10,
        ...filters.value
      };
      response = await ApiService.get('/legal/appeals', { params });
      if (response.data.success && response.data.data) {
        appeals.value = response.data.data.data || [];
        pagination.value = response.data.data;
      }
    }
  } catch (error) {
    console.error('Error loading appeals:', error);
    appeals.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    filed: 'bg-light-info',
    admitted: 'bg-light-primary',
    rejected: 'bg-light-danger',
    pending_resolution: 'bg-light-warning',
    resolved_favorable: 'bg-light-success',
    resolved_unfavorable: 'bg-light-danger',
    withdrawn: 'bg-light-secondary'
  };
  return classes[status] || 'bg-light';
};

const visiblePages = computed(() => {
  if (!pagination.value) return [];
  const pages = [];
  const start = Math.max(1, pagination.value.current_page - 2);
  const end = Math.min(pagination.value.last_page, pagination.value.current_page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    currentPage.value = page;
    loadAppeals();
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  loadAppeals();
};

const clearFilters = () => {
  filters.value = {
    appeal_type: '',
    appeal_status: '',
    date_from: '',
    date_to: ''
  };
  currentPage.value = 1;
  loadAppeals();
};

const openNewAppeal = () => {
  appealsModal.value?.openModal();
};

const viewAppeal = (appeal: any) => {
  // Could open a detail modal or navigate to detail view
};

const editAppeal = (appeal: any) => {
  appealsModal.value?.openModal(appeal);
};

const updateStatus = (appeal: any) => {
  statusModal.value?.openModal(appeal);
};

const deleteAppeal = async (appeal: any) => {
  const result = await Swal.fire({
    title: '¿Eliminar apelación?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`/legal/appeals/${appeal.id}`);
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La apelación ha sido eliminada correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        await loadAppeals();
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al eliminar la apelación'
      });
    }
  }
};
</script>