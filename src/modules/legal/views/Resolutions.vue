<template>
  <div class="resolutions-page">
    <!-- Page Header -->
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">Resoluciones Judiciales</span>
              <span class="text-muted mt-1 fw-semibold fs-7">
                Gestión integral de resoluciones y decisiones judiciales
              </span>
            </h3>
            <div class="card-toolbar">
              <!-- Search -->
              <div class="d-flex align-items-center position-relative me-3">
                <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <input
                  type="text"
                  v-model="searchTerm"
                  class="form-control form-control-solid w-250px ps-10"
                  placeholder="Buscar resolución..."
                  @input="debounceSearch"
                />
              </div>

              <!-- Filter by Type -->
              <select
                v-model="filters.type"
                @change="loadResolutions"
                class="form-select form-select-solid w-200px me-3"
              >
                <option value="">Todos los tipos</option>
                <option
                  v-for="type in resolutionTypes"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>

              <!-- Filter by Status -->
              <select
                v-model="filters.status"
                @change="loadResolutions"
                class="form-select form-select-solid w-150px me-3"
              >
                <option value="">Todos los estados</option>
                <option
                  v-for="status in complianceStatuses"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>

              <!-- Add Button -->
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreateModal"
              >
                <i class="ki-duotone ki-plus fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Nueva Resolución
              </button>
            </div>
          </div>

          <div class="card-body py-3">
            <!-- Statistics Cards -->
            <div class="row g-5 mb-5" v-if="statistics">
              <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex align-items-center mb-2">
                      <span class="fs-2hx fw-bold text-gray-900">{{ statistics.total }}</span>
                      <span class="ms-2 badge badge-light-primary">Total</span>
                    </div>
                    <span class="fs-6 fw-semibold text-gray-500">Resoluciones Registradas</span>
                  </div>
                </div>
              </div>

              <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex align-items-center mb-2">
                      <span class="fs-2hx fw-bold text-success">{{ statistics.final }}</span>
                      <span class="ms-2 badge badge-light-success">Firmes</span>
                    </div>
                    <span class="fs-6 fw-semibold text-gray-500">Resoluciones Firmes</span>
                  </div>
                </div>
              </div>

              <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex align-items-center mb-2">
                      <span class="fs-2hx fw-bold text-warning">{{ statistics.pending }}</span>
                      <span class="ms-2 badge badge-light-warning">Pendientes</span>
                    </div>
                    <span class="fs-6 fw-semibold text-gray-500">Pendientes de Cumplimiento</span>
                  </div>
                </div>
              </div>

              <div class="col-xl-3">
                <div class="card card-flush h-xl-100">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex align-items-center mb-2">
                      <span class="fs-2hx fw-bold text-danger">{{ statistics.overdue }}</span>
                      <span class="ms-2 badge badge-light-danger">Vencidas</span>
                    </div>
                    <span class="fs-6 fw-semibold text-gray-500">Vencidas</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="d-flex justify-content-center py-10">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>

            <!-- Table -->
            <div v-else-if="resolutions.length > 0" class="table-responsive">
              <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th class="min-w-150px">Interno</th>
                    <th class="min-w-120px">Número</th>
                    <th class="min-w-100px">Fecha</th>
                    <th class="min-w-150px">Tipo</th>
                    <th class="min-w-150px">Juzgado</th>
                    <th class="min-w-100px">Estado</th>
                    <th class="min-w-100px">Cumplimiento</th>
                    <th class="min-w-100px text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="resolution in resolutions" :key="resolution.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="d-flex justify-content-start flex-column">
                          <router-link
                            :to="`/inmates/${resolution.inmate_id}`"
                            class="text-gray-900 fw-bold text-hover-primary fs-6"
                          >
                            {{ resolution.inmate?.full_name || 'Sin asignar' }}
                          </router-link>
                          <span class="text-muted fw-semibold text-muted d-block fs-7">
                            {{ resolution.inmate?.registry_number }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-gray-900 fw-bold fs-6">
                        {{ resolution.resolution_number }}
                      </span>
                    </td>
                    <td>
                      <span class="text-gray-900 fs-6">
                        {{ formatDate(resolution.resolution_date) }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getTypeClass(resolution.resolution_type)"
                      >
                        {{ resolution.resolution_type_display }}
                      </span>
                    </td>
                    <td>
                      <span class="text-gray-900 fs-6">
                        {{ resolution.court?.name || 'N/A' }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="resolution.is_final ? 'badge-light-success' : 'badge-light-warning'"
                      >
                        {{ resolution.is_final ? 'Firme' : 'En Proceso' }}
                      </span>
                    </td>
                    <td>
                      <span
                        v-if="resolution.compliance_status"
                        class="badge"
                        :class="getComplianceClass(resolution.compliance_status)"
                      >
                        {{ resolution.compliance_status_display }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div class="d-flex justify-content-end flex-shrink-0">
                        <button
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click="viewDetails(resolution)"
                          title="Ver detalles"
                        >
                          <i class="ki-duotone ki-eye fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                        </button>
                        <button
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click="editResolution(resolution)"
                          title="Editar"
                        >
                          <i class="ki-duotone ki-pencil fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                        <button
                          v-if="!resolution.is_final && resolution.compliance_status !== 'completed'"
                          class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                          @click="updateCompliance(resolution)"
                          title="Actualizar cumplimiento"
                        >
                          <i class="ki-duotone ki-check-square fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>
                        <button
                          class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                          @click="deleteResolution(resolution)"
                          title="Eliminar"
                        >
                          <i class="ki-duotone ki-trash fs-3">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                            <span class="path5"></span>
                          </i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-10">
              <img
                src="/media/illustrations/sketchy-1/5.png"
                class="mw-200px mb-5"
                alt=""
              />
              <div class="fw-semibold fs-6 text-gray-500">
                No hay resoluciones registradas
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="!loading && resolutions.length > 0"
              class="d-flex justify-content-between align-items-center flex-wrap mt-5"
            >
              <div class="d-flex align-items-center">
                <span class="text-muted">
                  Mostrando {{ (currentPage - 1) * perPage + 1 }} -
                  {{ Math.min(currentPage * perPage, total) }} de {{ total }}
                </span>
              </div>
              <ul class="pagination">
                <li class="page-item previous" :class="{ disabled: currentPage === 1 }">
                  <a href="#" class="page-link" @click.prevent="changePage(currentPage - 1)">
                    <i class="previous"></i>
                  </a>
                </li>
                <li
                  v-for="page in displayedPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a href="#" class="page-link" @click.prevent="changePage(page)">
                    {{ page }}
                  </a>
                </li>
                <li class="page-item next" :class="{ disabled: currentPage === totalPages }">
                  <a href="#" class="page-link" @click.prevent="changePage(currentPage + 1)">
                    <i class="next"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resolution Modal -->
    <ResolutionModal
      ref="resolutionModal"
      :inmate-id="selectedInmateId"
      @saved="handleSaved"
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
                <label class="form-label text-muted">Estado:</label>
                <p>
                  <span
                    class="badge"
                    :class="selectedResolution.is_final ? 'badge-light-success' : 'badge-light-warning'"
                  >
                    {{ selectedResolution.is_final ? 'Firme' : 'En Proceso' }}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">Cumplimiento:</label>
                <p>
                  <span
                    v-if="selectedResolution.compliance_status"
                    class="badge"
                    :class="getComplianceClass(selectedResolution.compliance_status)"
                  >
                    {{ selectedResolution.compliance_status_display }}
                  </span>
                  <span v-else>N/A</span>
                </p>
              </div>
            </div>

            <div class="row mt-3" v-if="selectedResolution.compliance_deadline">
              <div class="col-12">
                <label class="form-label text-muted">Fecha Límite de Cumplimiento:</label>
                <p class="fw-bold">{{ formatDate(selectedResolution.compliance_deadline) }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ResolutionModal from '@/components/legal/ResolutionModal.vue';

interface Resolution {
  id: number;
  inmate_id: number;
  inmate?: {
    full_name: string;
    registry_number: string;
  };
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

interface Statistics {
  total: number;
  final: number;
  pending: number;
  completed: number;
  overdue: number;
}

// Composables
const router = useRouter();
const route = useRoute();

// State
const loading = ref(false);
const resolutions = ref<Resolution[]>([]);
const statistics = ref<Statistics | null>(null);
const selectedResolution = ref<Resolution | null>(null);
const selectedInmateId = ref<number | null>(null);

// Filters
const searchTerm = ref('');
const filters = ref({
  type: '',
  status: ''
});

// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPages = ref(0);

// Options
const resolutionTypes = ref<Array<{value: string; label: string}>>([]);
const complianceStatuses = ref<Array<{value: string; label: string}>>([]);

// Modals
const resolutionModal = ref<InstanceType<typeof ResolutionModal>>();
const detailsModalInstance = ref<Modal | null>(null);

let searchTimeout: NodeJS.Timeout | null = null;

// Computed
const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxPages - 1);

  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const loadResolutions = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: currentPage.value,
      per_page: perPage.value
    };

    if (searchTerm.value) {
      params.search = searchTerm.value;
    }

    if (filters.value.type) {
      params.resolution_type = filters.value.type;
    }

    if (filters.value.status) {
      params.compliance_status = filters.value.status;
    }

    // Check if filtering by inmate from query params
    if (route.query.inmate_id) {
      params.inmate_id = route.query.inmate_id;
    }

    const response = await ApiService.get('/legal/resolutions', { params });

    console.log('API Response:', response.data);

    if (response.data.success) {
      resolutions.value = response.data.data.data || [];
      total.value = response.data.data.total || 0;
      totalPages.value = response.data.data.last_page || 1;
      currentPage.value = response.data.data.current_page || 1;

      console.log('Loaded resolutions:', resolutions.value);
      console.log('First resolution:', resolutions.value[0]);

      // Calculate statistics
      calculateStatistics();
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

const calculateStatistics = () => {
  // Load overall statistics
  statistics.value = {
    total: resolutions.value.length,
    final: resolutions.value.filter(r => r.is_final).length,
    pending: resolutions.value.filter(r => r.compliance_status === 'pending').length,
    completed: resolutions.value.filter(r => r.compliance_status === 'completed').length,
    overdue: resolutions.value.filter(r => {
      if (!r.compliance_deadline) return false;
      return new Date(r.compliance_deadline) < new Date() && r.compliance_status !== 'completed';
    }).length
  };
};

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

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadResolutions();
  }, 500);
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadResolutions();
  }
};

const showCreateModal = () => {
  selectedInmateId.value = route.query.inmate_id ? Number(route.query.inmate_id) : null;
  resolutionModal.value?.openModal();
};

const editResolution = (resolution: Resolution) => {
  console.log('Edit resolution called with:', resolution);
  console.log('Resolution ID:', resolution.id);
  console.log('Inmate ID:', resolution.inmate_id);

  selectedInmateId.value = resolution.inmate_id || null;
  resolutionModal.value?.openModal(resolution);
};

const viewDetails = (resolution: Resolution) => {
  selectedResolution.value = resolution;
  detailsModalInstance.value?.show();
};

const updateCompliance = async (resolution: Resolution) => {
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

const deleteResolution = async (resolution: Resolution) => {
  console.log('Delete resolution called with:', resolution);
  console.log('Resolution ID:', resolution.id);

  const result = await Swal.fire({
    title: '¿Está seguro?',
    text: `¿Desea eliminar la resolución ${resolution.resolution_number}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      // Ensure we have a valid ID
      if (!resolution.id || typeof resolution.id !== 'number') {
        throw new Error('ID de resolución inválido');
      }

      const response = await ApiService.delete(`/legal/resolutions/${resolution.id}`);
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

const handleSaved = () => {
  loadResolutions();
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getTypeClass = (type: string) => {
  const typeClasses: Record<string, string> = {
    'sentence': 'badge-light-danger',
    'preventive_detention_order': 'badge-light-warning',
    'benefit_grant': 'badge-light-success',
    'benefit_denial': 'badge-light-danger',
    'appeal_resolution': 'badge-light-info',
    'auto_opening_prosecution': 'badge-light-primary',
    'transfer_authorization': 'badge-light-secondary',
    'medical_treatment_order': 'badge-light-info',
    'family_visit_authorization': 'badge-light-success',
    'work_assignment_order': 'badge-light-primary',
    'disciplinary_sanction': 'badge-light-danger',
    'appeal_admission': 'badge-light-info',
    'cassation_resolution': 'badge-light-warning'
  };
  return typeClasses[type] || 'badge-light-secondary';
};

const getComplianceClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'pending': 'badge-light-warning',
    'partial': 'badge-light-info',
    'completed': 'badge-light-success',
    'expired': 'badge-light-danger'
  };
  return statusClasses[status] || 'badge-light-secondary';
};

// Lifecycle
onMounted(async () => {
  detailsModalInstance.value = new Modal(document.getElementById('detailsModal')!);

  // Load options
  await Promise.all([
    loadResolutionTypes(),
    loadComplianceStatuses()
  ]);

  // Load resolutions
  await loadResolutions();
});
</script>

<style scoped>
.table-responsive {
  min-height: 400px;
}
</style>