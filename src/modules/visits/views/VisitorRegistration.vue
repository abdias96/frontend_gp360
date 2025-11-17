<template>
  <div>
    <!-- Page Header -->
    <div class="page-header d-print-none mb-5">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col">
            <h2 class="page-title">Registro de Visitantes</h2>
            <div class="text-muted mt-1">Gestión completa del registro y acreditación de visitantes</div>
          </div>
          <div class="col-auto">
            <div class="btn-list">
              <button 
                @click="exportData" 
                class="btn btn-secondary"
                :disabled="loading"
              >
                <i class="fas fa-download me-2"></i>
                Exportar
              </button>
              <button 
                @click="openNewVisitorModal"
                class="btn btn-primary"
                v-if="hasPermission('visits.visitors_create')"
              >
                <i class="fas fa-plus me-2"></i>
                Nuevo Visitante
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row row-cards mb-4">
      <div class="col-sm-6 col-lg-3">
        <div class="card card-sm">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="bg-primary text-white avatar">
                  <i class="fas fa-users"></i>
                </span>
              </div>
              <div class="col">
                <div class="font-weight-medium">{{ statistics.total || 0 }}</div>
                <div class="text-muted">Total Visitantes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card card-sm">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="bg-success text-white avatar">
                  <i class="fas fa-check-circle"></i>
                </span>
              </div>
              <div class="col">
                <div class="font-weight-medium">{{ statistics.active || 0 }}</div>
                <div class="text-muted">Acreditados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card card-sm">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="bg-warning text-white avatar">
                  <i class="fas fa-clock"></i>
                </span>
              </div>
              <div class="col">
                <div class="font-weight-medium">{{ statistics.pending || 0 }}</div>
                <div class="text-muted">Pendientes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card card-sm">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="bg-info text-white avatar">
                  <i class="fas fa-fingerprint"></i>
                </span>
              </div>
              <div class="col">
                <div class="font-weight-medium">{{ statistics.with_biometrics || 0 }}</div>
                <div class="text-muted">Con Biometría</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Listado de Visitantes</h3>
        <div class="card-actions">
          <button 
            @click="refreshData" 
            class="btn btn-sm btn-icon"
            :disabled="loading"
          >
            <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
          </button>
        </div>
      </div>

      <div class="card-body">
        <!-- Filters -->
        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <label class="form-label">Buscar</label>
            <input 
              v-model="filters.search" 
              type="text" 
              class="form-control"
              placeholder="DPI, nombre, teléfono..."
              @input="debounceSearch"
            >
          </div>
          <div class="col-md-2">
            <label class="form-label">Estado Acreditación</label>
            <select v-model="filters.accreditation_status" class="form-select" @change="loadVisitors">
              <option value="">Todos</option>
              <option value="pending_documentation">Pendiente Documentación</option>
              <option value="documentation_review">Revisión Documentos</option>
              <option value="background_check">Verificación Antecedentes</option>
              <option value="biometric_enrollment">Registro Biométrico</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="suspended">Suspendido</option>
              <option value="revoked">Revocado</option>
              <option value="expired">Vencido</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Biometría</label>
            <select v-model="filters.biometric_enrolled" class="form-select" @change="loadVisitors">
              <option value="">Todos</option>
              <option value="true">Con Biometría</option>
              <option value="false">Sin Biometría</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Restricciones</label>
            <select v-model="filters.has_restrictions" class="form-select" @change="loadVisitors">
              <option value="">Todos</option>
              <option value="true">Con Restricciones</option>
              <option value="false">Sin Restricciones</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Departamento</label>
            <select v-model="filters.department_id" class="form-select" @change="loadVisitors">
              <option value="">Todos</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div class="col-md-1">
            <label class="form-label">&nbsp;</label>
            <button @click="clearFilters" class="btn btn-secondary w-100">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Foto</th>
                <th>DPI</th>
                <th>Nombre Completo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Biometría</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="8" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="!visitors || visitors.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  No se encontraron visitantes
                </td>
              </tr>
              <tr v-else v-for="visitor in visitors" :key="visitor.id">
                <td>
                  <div class="avatar avatar-sm">
                    <img 
                      v-if="visitor.front_photo_path" 
                      :src="getPhotoUrl(visitor.front_photo_path)"
                      :alt="visitor.full_name"
                    >
                    <span v-else class="avatar-content">
                      {{ getInitials(visitor) }}
                    </span>
                  </div>
                </td>
                <td>{{ visitor.identification_number }}</td>
                <td>
                  <div>
                    <strong>{{ visitor.full_name }}</strong>
                    <div class="small text-muted">{{ visitor.email }}</div>
                  </div>
                </td>
                <td>
                  <div v-if="visitor.mobile_phone">
                    <i class="fas fa-mobile-alt me-1"></i>
                    {{ visitor.mobile_phone }}
                  </div>
                  <div v-if="visitor.phone" class="small text-muted">
                    <i class="fas fa-phone me-1"></i>
                    {{ visitor.phone }}
                  </div>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(visitor.accreditation_status)">
                    {{ getStatusLabel(visitor.accreditation_status) }}
                  </span>
                </td>
                <td>
                  <span v-if="visitor.biometric_enrolled" class="badge bg-success">
                    <i class="fas fa-fingerprint me-1"></i>
                    Registrado
                  </span>
                  <span v-else class="badge bg-secondary">
                    Pendiente
                  </span>
                </td>
                <td>
                  <span v-if="visitor.accreditation_expiry_date">
                    {{ formatDate(visitor.accreditation_expiry_date) }}
                    <span v-if="isExpiringSoon(visitor.accreditation_expiry_date)" class="badge bg-warning ms-1">
                      Próximo a vencer
                    </span>
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="viewVisitor(visitor)"
                      class="btn btn-info"
                      title="Ver detalles"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      @click="editVisitor(visitor)"
                      class="btn btn-primary"
                      v-if="hasPermission('visits.visitors_edit')"
                      title="Editar"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="btn-group btn-group-sm" role="group">
                      <button 
                        type="button" 
                        class="btn btn-secondary dropdown-toggle" 
                        data-bs-toggle="dropdown"
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li v-if="canEnrollBiometrics(visitor)">
                          <a class="dropdown-item" @click="enrollBiometrics(visitor)">
                            <i class="fas fa-fingerprint me-2"></i>
                            Registrar Biometría
                          </a>
                        </li>
                        <li v-if="canUpdateStatus(visitor)">
                          <a class="dropdown-item" @click="updateStatus(visitor)">
                            <i class="fas fa-check-circle me-2"></i>
                            Actualizar Estado
                          </a>
                        </li>
                        <li v-if="canPerformBackgroundCheck(visitor)">
                          <a class="dropdown-item" @click="performBackgroundCheck(visitor)">
                            <i class="fas fa-search me-2"></i>
                            Verificar Antecedentes
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" @click="viewRelationships(visitor)">
                            <i class="fas fa-users me-2"></i>
                            Ver Relaciones
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" @click="viewVisitHistory(visitor)">
                            <i class="fas fa-history me-2"></i>
                            Historial de Visitas
                          </a>
                        </li>
                        <li v-if="hasPermission('visits.visitors_delete')">
                          <hr class="dropdown-divider">
                        </li>
                        <li v-if="hasPermission('visits.visitors_delete')">
                          <a class="dropdown-item text-danger" @click="deleteVisitor(visitor)">
                            <i class="fas fa-trash me-2"></i>
                            Eliminar
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <div class="text-muted">
            Mostrando {{ (pagination.current_page - 1) * pagination.per_page + 1 }} - 
            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} 
            de {{ pagination.total }} registros
          </div>
          <nav>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                <a class="page-link" @click="changePage(pagination.current_page - 1)">
                  <i class="fas fa-chevron-left"></i>
                </a>
              </li>
              <li 
                v-for="page in paginationPages" 
                :key="page"
                class="page-item" 
                :class="{ active: page === pagination.current_page }"
              >
                <a class="page-link" @click="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                <a class="page-link" @click="changePage(pagination.current_page + 1)">
                  <i class="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- New/Edit Visitor Modal -->
    <!-- TODO: Implementar modal de formulario de visitante -->
    <!-- <VisitorFormModal
      v-if="showVisitorModal"
      :visitor="selectedVisitor"
      :formData="formData"
      @save="saveVisitor"
      @close="closeVisitorModal"
    /> -->

    <!-- Biometric Enrollment Modal -->
    <!-- TODO: Implementar modal de registro biométrico -->
    <!-- <BiometricEnrollmentModal
      v-if="showBiometricModal"
      :visitor="selectedVisitor"
      @enrolled="onBiometricEnrolled"
      @close="showBiometricModal = false"
    /> -->

    <!-- Status Update Modal -->
    <!-- TODO: Implementar modal de actualización de estado -->
    <!-- <StatusUpdateModal
      v-if="showStatusModal"
      :visitor="selectedVisitor"
      @updated="onStatusUpdated"
      @close="showStatusModal = false"
    /> -->

    <!-- Background Check Modal -->
    <!-- TODO: Implementar modal de verificación de antecedentes -->
    <!-- <BackgroundCheckModal
      v-if="showBackgroundCheckModal"
      :visitor="selectedVisitor"
      @completed="onBackgroundCheckCompleted"
      @close="showBackgroundCheckModal = false"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { visitorsApi } from '@/services/api/visits';
import Swal from 'sweetalert2';
import { formatDate } from '@/utils/helpers';

// Import child components (to be created)
// import VisitorFormModal from '../components/VisitorFormModal.vue';
// import BiometricEnrollmentModal from '../components/BiometricEnrollmentModal.vue';
// import StatusUpdateModal from '../components/StatusUpdateModal.vue';
// import BackgroundCheckModal from '../components/BackgroundCheckModal.vue';

// Types
interface Visitor {
  id: number;
  identification_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  biometric_enrolled: boolean;
  accreditation_status: string;
  accreditation_expiry_date: string | null;
  background_check_status: string;
  background_check_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Statistics {
  total: number;
  active: number;
  with_biometric: number;
  pending_approval: number;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

// Store
const authStore = useAuthStore();
const router = useRouter();

// State
const loading = ref(false);
const visitors = ref<Visitor[]>([]);
const selectedVisitor = ref<Visitor | null>(null);
const statistics = ref<Statistics>({
  total: 0,
  active: 0,
  with_biometric: 0,
  pending_approval: 0
});
const formData = ref({
  document_types: [],
  nationalities: [],
  departments: [],
  municipalities: []
});
const searchTimeout = ref<number | null>(null);

// Modals
const showVisitorModal = ref(false);
const showBiometricModal = ref(false);
const showStatusModal = ref(false);
const showBackgroundCheckModal = ref(false);

// Filters
const filters = ref({
  search: '',
  accreditation_status: '',
  biometric_enrolled: '',
  has_restrictions: '',
  department_id: ''
});

// Pagination
const pagination = ref<Pagination>({
  current_page: 1,
  per_page: 15,
  total: 0,
  last_page: 1
});

// Computed
const departments = computed(() => formData.value.departments || []);

const paginationPages = computed(() => {
  const pages = [];
  const start = Math.max(1, pagination.value.current_page - 2);
  const end = Math.min(pagination.value.last_page, pagination.value.current_page + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const hasPermission = (permission: string) => {
  return authStore.hasPermission(permission);
};

const loadVisitors = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      ...filters.value
    };

    const response = await visitorsApi.getList(params);
    visitors.value = response.data.visitors.data || [];
    pagination.value = {
      current_page: response.data.visitors.current_page,
      per_page: response.data.visitors.per_page,
      total: response.data.visitors.total,
      last_page: response.data.visitors.last_page
    };
  } catch (error) {
    console.error('Error loading visitors:', error);
    Swal.fire('Error', 'No se pudieron cargar los visitantes', 'error');
  } finally {
    loading.value = false;
  }
};

const loadStatistics = async () => {
  try {
    const response = await visitorsApi.getStatistics();
    statistics.value = response.data;
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
};

const loadFormData = async () => {
  try {
    // Por ahora usaremos datos vacíos hasta configurar el endpoint
    formData.value = {
      document_types: [],
      nationalities: [],
      departments: [],
      municipalities: []
    };
  } catch (error) {
    console.error('Error loading form data:', error);
  }
};

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = window.setTimeout(() => {
    pagination.value.current_page = 1;
    loadVisitors();
  }, 500);
};

const clearFilters = () => {
  filters.value = {
    search: '',
    accreditation_status: '',
    biometric_enrolled: '',
    has_restrictions: '',
    department_id: ''
  };
  loadVisitors();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page;
    loadVisitors();
  }
};

const refreshData = () => {
  loadVisitors();
  loadStatistics();
};

const openNewVisitorModal = () => {
  // Por ahora mostramos mensaje informativo
  Swal.fire('Información', 'El formulario de registro estará disponible próximamente', 'info');
};

const editVisitor = (visitor: Visitor) => {
  // Por ahora mostramos mensaje informativo
  Swal.fire('Información', 'La edición de visitantes estará disponible próximamente', 'info');
};

const viewVisitor = (visitor: Visitor) => {
  router.push(`/visits/visitors/${visitor.id}`);
};

const closeVisitorModal = () => {
  showVisitorModal.value = false;
  selectedVisitor.value = null;
};

const saveVisitor = async (visitorData: any) => {
  try {
    if (selectedVisitor.value) {
      await visitorsApi.update(selectedVisitor.value.id, visitorData);
      Swal.fire('Éxito', 'Visitante actualizado correctamente', 'success');
    } else {
      await visitorsApi.create(visitorData);
      Swal.fire('Éxito', 'Visitante registrado correctamente', 'success');
    }
    closeVisitorModal();
    refreshData();
  } catch (error) {
    console.error('Error saving visitor:', error);
    Swal.fire('Error', 'No se pudo guardar el visitante', 'error');
  }
};

const deleteVisitor = async (visitor: Visitor) => {
  const result = await Swal.fire({
    title: '¿Está seguro?',
    text: `¿Desea eliminar el registro de ${visitor.first_name} ${visitor.last_name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await visitorsApi.delete(visitor.id);
      Swal.fire('Eliminado', 'El visitante ha sido eliminado', 'success');
      refreshData();
    } catch (error) {
      console.error('Error deleting visitor:', error);
      Swal.fire('Error', 'No se pudo eliminar el visitante', 'error');
    }
  }
};

const enrollBiometrics = (visitor: Visitor) => {
  Swal.fire('Información', 'El registro biométrico estará disponible próximamente', 'info');
};

const updateStatus = (visitor: Visitor) => {
  Swal.fire('Información', 'La actualización de estado estará disponible próximamente', 'info');
};

const performBackgroundCheck = (visitor: Visitor) => {
  Swal.fire('Información', 'La verificación de antecedentes estará disponible próximamente', 'info');
};

const viewRelationships = (visitor: Visitor) => {
  router.push(`/visits/relationships?visitor_id=${visitor.id}`);
};

const viewVisitHistory = (visitor: Visitor) => {
  router.push(`/visits/history?visitor_id=${visitor.id}`);
};

const onBiometricEnrolled = () => {
  showBiometricModal.value = false;
  refreshData();
};

const onStatusUpdated = () => {
  showStatusModal.value = false;
  refreshData();
};

const onBackgroundCheckCompleted = () => {
  showBackgroundCheckModal.value = false;
  refreshData();
};

const exportData = async () => {
  try {
    // Por ahora mostramos mensaje informativo
    Swal.fire('Información', 'La exportación estará disponible próximamente', 'info');
  } catch (error) {
    console.error('Error exporting data:', error);
    Swal.fire('Error', 'No se pudo exportar los datos', 'error');
  }
};

// Helper functions
const getPhotoUrl = (path: string) => {
  return `/storage/${path}`;
};

const getInitials = (visitor: any) => {
  const first = visitor.first_name?.[0] || '';
  const last = visitor.first_surname?.[0] || '';
  return (first + last).toUpperCase();
};

const getStatusBadgeClass = (status: string) => {
  const classes = {
    'pending_documentation': 'badge bg-secondary',
    'documentation_review': 'badge bg-info',
    'background_check': 'badge bg-warning',
    'biometric_enrollment': 'badge bg-primary',
    'approved': 'badge bg-success',
    'rejected': 'badge bg-danger',
    'suspended': 'badge bg-dark',
    'revoked': 'badge bg-danger',
    'expired': 'badge bg-secondary'
  };
  return classes[status] || 'badge bg-secondary';
};

const getStatusLabel = (status: string) => {
  const labels = {
    'pending_documentation': 'Pendiente Doc.',
    'documentation_review': 'Revisión Doc.',
    'background_check': 'Verificación',
    'biometric_enrollment': 'Reg. Biométrico',
    'approved': 'Aprobado',
    'rejected': 'Rechazado',
    'suspended': 'Suspendido',
    'revoked': 'Revocado',
    'expired': 'Vencido'
  };
  return labels[status] || status;
};

const isExpiringSoon = (date: string) => {
  const expiryDate = new Date(date);
  const today = new Date();
  const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= 30 && daysDiff > 0;
};

const canEnrollBiometrics = (visitor: any) => {
  return !visitor.biometric_enrolled &&
         ['background_check', 'biometric_enrollment', 'approved'].includes(visitor.accreditation_status) &&
         hasPermission('visits.visitors_biometrics');
};

const canUpdateStatus = (visitor: any) => {
  return hasPermission('visits.visitors_status');
};

const canPerformBackgroundCheck = (visitor: any) => {
  return !visitor.background_check_completed &&
         hasPermission('visits.visitors_background_check');
};

// Lifecycle
onMounted(() => {
  loadFormData();
  loadVisitors();
  loadStatistics();
});
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f3f4f6;
  font-weight: 600;
  color: #6b7280;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.dropdown-toggle::after {
  display: none;
}
</style>