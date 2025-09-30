<template>
  <div class="resolution-list">
    <!-- Header with Add Button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Resoluciones Judiciales</h4>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="openResolutionModal()"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Nueva Resolución
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4" v-if="stats">
      <div class="col-md-3">
        <div class="card card-flush">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <span class="text-muted fs-7 d-block">Total</span>
                <span class="text-dark fs-4 fw-bold">{{ stats.total }}</span>
              </div>
              <i class="bi bi-file-earmark-text fs-2 text-primary"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card card-flush">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <span class="text-muted fs-7 d-block">Firmes</span>
                <span class="text-dark fs-4 fw-bold">{{ stats.final }}</span>
              </div>
              <i class="bi bi-check-circle fs-2 text-success"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card card-flush">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <span class="text-muted fs-7 d-block">Pendientes</span>
                <span class="text-dark fs-4 fw-bold">{{ stats.pending }}</span>
              </div>
              <i class="bi bi-clock fs-2 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card card-flush">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <span class="text-muted fs-7 d-block">Vencidas</span>
                <span class="text-dark fs-4 fw-bold">{{ stats.overdue }}</span>
              </div>
              <i class="bi bi-exclamation-triangle fs-2 text-danger"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card card-flush mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label fs-7">Tipo de Resolución</label>
            <select v-model="filters.type" class="form-select form-select-sm" @change="loadResolutions">
              <option value="">Todos los tipos</option>
              <option
                v-for="type in resolutionTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label fs-7">Estado de Cumplimiento</label>
            <select v-model="filters.status" class="form-select form-select-sm" @change="loadResolutions">
              <option value="">Todos los estados</option>
              <option
                v-for="status in complianceStatuses"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label fs-7">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control form-control-sm"
              placeholder="Número de resolución..."
              @input="debounceSearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Resolution List -->
    <div v-else-if="resolutions.length > 0" class="resolution-cards">
      <div
        v-for="resolution in resolutions"
        :key="resolution.id"
        class="card card-flush mb-3"
      >
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <div class="d-flex align-items-start">
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center mb-2">
                    <h6 class="mb-0 me-3">
                      Resolución #{{ resolution.resolution_number }}
                    </h6>
                    <span
                      class="badge me-2"
                      :class="getTypeClass(resolution.resolution_type)"
                    >
                      {{ resolution.resolution_type_display }}
                    </span>
                    <span
                      v-if="resolution.is_final"
                      class="badge bg-success"
                    >
                      FIRME
                    </span>
                  </div>

                  <div class="text-muted fs-7 mb-2">
                    <i class="bi bi-calendar me-1"></i>
                    {{ formatDate(resolution.resolution_date) }}
                    <span class="mx-2">|</span>
                    <i class="bi bi-building me-1"></i>
                    {{ resolution.court?.name || 'Sin juzgado' }}
                  </div>

                  <p class="mb-2">{{ resolution.resolution_summary }}</p>

                  <div v-if="resolution.compliance_deadline" class="d-flex align-items-center">
                    <span class="text-muted fs-7 me-2">Cumplimiento:</span>
                    <span
                      class="badge"
                      :class="getComplianceClass(resolution.compliance_status)"
                    >
                      {{ resolution.compliance_status_display }}
                    </span>
                    <span class="text-muted fs-7 ms-2">
                      (Límite: {{ formatDate(resolution.compliance_deadline) }})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4 text-end">
              <div class="btn-group" role="group">
                <button
                  type="button"
                  class="btn btn-sm btn-light-primary"
                  @click="viewDetails(resolution)"
                  title="Ver detalles"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-light-warning"
                  @click="openResolutionModal(resolution)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-light-info"
                  @click="updateComplianceStatus(resolution)"
                  title="Actualizar cumplimiento"
                  v-if="!resolution.is_final && resolution.compliance_status !== 'completed'"
                >
                  <i class="bi bi-check2-square"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-light-danger"
                  @click="deleteResolution(resolution.id)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Effects if present -->
          <div v-if="resolution.resolution_effects?.length > 0" class="mt-3">
            <h6 class="fs-7 text-muted mb-2">Efectos de la Resolución:</h6>
            <ul class="mb-0">
              <li
                v-for="(effect, index) in resolution.resolution_effects"
                :key="index"
                class="fs-7"
              >
                {{ effect }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="bi bi-file-earmark-x fs-1 text-muted mb-3 d-block"></i>
      <p class="text-muted">No se encontraron resoluciones</p>
    </div>

    <!-- Resolution Modal -->
    <ResolutionModal
      ref="resolutionModal"
      :inmate-id="inmateId"
      @saved="loadResolutions"
    />

    <!-- Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Resolución</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedResolution">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-muted">Número:</label>
                <p class="fw-bold">{{ selectedResolution.resolution_number }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">Fecha:</label>
                <p class="fw-bold">{{ formatDate(selectedResolution.resolution_date) }}</p>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-muted">Tipo:</label>
                <p class="fw-bold">{{ selectedResolution.resolution_type_display }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">Juzgado:</label>
                <p class="fw-bold">{{ selectedResolution.court?.name || 'N/A' }}</p>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-muted">Resumen:</label>
              <p>{{ selectedResolution.resolution_summary }}</p>
            </div>

            <div class="mb-3" v-if="selectedResolution.resolution_details">
              <label class="form-label text-muted">Detalles:</label>
              <p>{{ selectedResolution.resolution_details }}</p>
            </div>

            <div class="mb-3" v-if="selectedResolution.resolution_effects?.length > 0">
              <label class="form-label text-muted">Efectos:</label>
              <ul>
                <li v-for="(effect, index) in selectedResolution.resolution_effects" :key="index">
                  {{ effect }}
                </li>
              </ul>
            </div>

            <div class="row">
              <div class="col-md-6">
                <label class="form-label text-muted">Estado de Cumplimiento:</label>
                <p>
                  <span class="badge" :class="getComplianceClass(selectedResolution.compliance_status)">
                    {{ selectedResolution.compliance_status_display }}
                  </span>
                </p>
              </div>
              <div class="col-md-6" v-if="selectedResolution.compliance_deadline">
                <label class="form-label text-muted">Fecha Límite:</label>
                <p class="fw-bold">{{ formatDate(selectedResolution.compliance_deadline) }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ResolutionModal from './ResolutionModal.vue';

interface Resolution {
  id: number;
  resolution_number: string;
  resolution_date: string;
  resolution_type: string;
  resolution_type_display: string;
  resolution_summary: string;
  resolution_details?: string;
  resolution_effects?: string[];
  is_final: boolean;
  compliance_deadline?: string;
  compliance_status: string;
  compliance_status_display: string;
  court?: {
    id: number;
    name: string;
  };
}

interface Stats {
  total: number;
  final: number;
  pending: number;
  completed: number;
  overdue: number;
}

const props = defineProps<{
  inmateId: number;
}>();

const loading = ref(false);
const resolutions = ref<Resolution[]>([]);
const stats = ref<Stats | null>(null);
const selectedResolution = ref<Resolution | null>(null);

const resolutionModal = ref<InstanceType<typeof ResolutionModal>>();
const detailsModalInstance = ref<Modal | null>(null);

const filters = reactive({
  type: '',
  status: '',
  search: ''
});

const resolutionTypes = ref<Array<{value: string; label: string}>>([]);
const complianceStatuses = ref<Array<{value: string; label: string}>>([]);

let searchTimeout: NodeJS.Timeout | null = null;

onMounted(async () => {
  detailsModalInstance.value = new Modal(document.getElementById('detailsModal')!);
  await loadResolutionTypes();
  await loadComplianceStatuses();
  await loadResolutions();
});

const loadResolutionTypes = async () => {
  try {
    const response = await ApiService.get('/legal/resolutions/types');
    resolutionTypes.value = response.data.data;
  } catch (error) {
    console.error('Error loading resolution types:', error);
  }
};

const loadComplianceStatuses = async () => {
  try {
    const response = await ApiService.get('/legal/resolutions/compliance-statuses');
    complianceStatuses.value = response.data.data;
  } catch (error) {
    console.error('Error loading compliance statuses:', error);
  }
};

const loadResolutions = async () => {
  loading.value = true;
  try {
    const response = await ApiService.get(`/legal/resolutions/inmate/${props.inmateId}`);
    if (response.data.success) {
      resolutions.value = response.data.data.all_resolutions || [];
      stats.value = response.data.data.stats || null;
    }
  } catch (error) {
    console.error('Error loading resolutions:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las resoluciones'
    });
  } finally {
    loading.value = false;
  }
};

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadResolutions();
  }, 500);
};

const openResolutionModal = (resolution?: Resolution) => {
  resolutionModal.value?.openModal(resolution);
};

const viewDetails = (resolution: Resolution) => {
  selectedResolution.value = resolution;
  detailsModalInstance.value?.show();
};

const updateComplianceStatus = async (resolution: Resolution) => {
  const { value: status } = await Swal.fire({
    title: 'Actualizar Estado de Cumplimiento',
    input: 'select',
    inputOptions: {
      pending: 'Pendiente',
      partial: 'Parcial',
      completed: 'Completado',
      expired: 'Vencido'
    },
    inputPlaceholder: 'Seleccione el nuevo estado',
    inputValue: resolution.compliance_status,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar'
  });

  if (status) {
    try {
      const response = await ApiService.patch(`/legal/resolutions/${resolution.id}/compliance`, {
        compliance_status: status
      });

      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Estado de cumplimiento actualizado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        await loadResolutions();
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado de cumplimiento'
      });
    }
  }
};

const deleteResolution = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Está seguro?',
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
      const response = await ApiService.delete(`/legal/resolutions/${id}`);
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Resolución eliminada correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        await loadResolutions();
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la resolución'
      });
    }
  }
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('es-GT');
};

const getTypeClass = (type: string) => {
  const typeClasses: Record<string, string> = {
    'sentence': 'bg-danger',
    'preventive_detention_order': 'bg-warning',
    'benefit_grant': 'bg-success',
    'benefit_denial': 'bg-danger',
    'appeal_resolution': 'bg-info',
    'auto_opening_prosecution': 'bg-primary'
  };
  return typeClasses[type] || 'bg-secondary';
};

const getComplianceClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'pending': 'bg-warning',
    'partial': 'bg-info',
    'completed': 'bg-success',
    'expired': 'bg-danger'
  };
  return statusClasses[status] || 'bg-secondary';
};
</script>

<style scoped>
.resolution-cards {
  max-height: 600px;
  overflow-y: auto;
}
</style>