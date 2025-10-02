<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.admissions.title') }}</h3>
        <p class="text-muted">{{ $t('operations.admissions.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <button 
          @click="showNewAdmissionModal = true"
          class="btn btn-primary btn-sm"
          v-if="canCreate"
        >
          <i class="fas fa-plus"></i>
          Nueva Admisión
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Proceso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tipo de Admisión</label>
          <select v-model="filters.admission_type" class="form-select">
            <option value="">Todos</option>
            <option value="preventive_detention">Prisión Preventiva</option>
            <option value="sentence_execution">Ejecución de Sentencia</option>
            <option value="transfer">Traslado</option>
            <option value="reentry">Reingreso</option>
            <option value="judicial_order">Orden Judicial</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Fecha</label>
          <input 
            type="date" 
            v-model="filters.date"
            class="form-control"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Buscar</label>
          <input 
            type="text" 
            v-model="filters.search"
            class="form-control"
            placeholder="DPI, nombre..."
          >
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #F1416C; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.pending }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Pendientes</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #7239EA; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.in_progress }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">En Proceso</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #50CD89; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.completed_today }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Completadas Hoy</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #FFC700; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.average_duration }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Promedio (horas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admissions Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>PPL</th>
              <th>Tipo Admisión</th>
              <th>Fecha/Hora</th>
              <th>Estado</th>
              <th>Progreso</th>
              <th>Tiempo Transcurrido</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admission in admissions.data" :key="admission.id">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ admission.inmate?.full_name }}</span>
                  <span class="text-muted fs-7">{{ admission.inmate?.document_number }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getAdmissionTypeBadgeClass(admission.admission_type)">
                  {{ formatAdmissionType(admission.admission_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatDate(admission.admission_date) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(admission.admission_time) }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(admission.status)">
                  {{ formatStatus(admission.status) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <div class="progress h-6px mb-1">
                    <div 
                      class="progress-bar" 
                      :class="getProgressBarClass(admission.completion_percentage)"
                      :style="`width: ${admission.completion_percentage}%`"
                    ></div>
                  </div>
                  <span class="fs-7 text-muted">{{ admission.completion_percentage }}% ({{ admission.completed_steps }}/{{ admission.total_steps }})</span>
                </div>
              </td>
              <td>
                <span class="text-gray-800">{{ formatDuration(admission.duration_minutes) }}</span>
              </td>
              <td>
                <span class="text-gray-800">{{ admission.created_by?.name }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewAdmission(admission)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="continueAdmission(admission)"
                    class="btn btn-primary btn-sm"
                    v-if="admission.status === 'in_progress'"
                    title="Continuar proceso"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    @click="cancelAdmission(admission)"
                    class="btn btn-danger btn-sm"
                    v-if="['pending', 'in_progress'].includes(admission.status)"
                    title="Cancelar admisión"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-6">
        <div class="text-muted">
          Mostrando {{ admissions.from }} - {{ admissions.to }} de {{ admissions.total }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !admissions.prev_page_url }">
              <button class="page-link" @click="loadPage(admissions.current_page - 1)">Anterior</button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === admissions.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !admissions.next_page_url }">
              <button class="page-link" @click="loadPage(admissions.current_page + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- New Admission Modal -->
    <AdmissionModal 
      v-if="showNewAdmissionModal"
      @close="showNewAdmissionModal = false"
      @saved="handleAdmissionSaved"
    />

    <!-- Admission Detail Modal -->
    <!-- TODO: Create AdmissionDetailModal component -->
    <!-- <AdmissionDetailModal
      v-if="showDetailModal"
      :admission="selectedAdmission"
      @close="showDetailModal = false"
      @updated="handleAdmissionUpdated"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/stores/auth'
import { admissionsApi } from '@/services/api/operations'
import AdmissionModal from '../components/AdmissionModal.vue'
// import AdmissionDetailModal from '../components/AdmissionDetailModal.vue'

const { showToast } = useToast()
const { user } = useAuth()

// Data
const loading = ref(false)
const showNewAdmissionModal = ref(false)
const showDetailModal = ref(false)
const selectedAdmission = ref(null)

const admissions = ref({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0,
  prev_page_url: null,
  next_page_url: null
})

const summary = ref({
  pending: 0,
  in_progress: 0,
  completed_today: 0,
  average_duration: 0
})

const filters = reactive({
  status: '',
  admission_type: '',
  date: '',
  search: ''
})

// Computed
const canCreate = computed(() => {
  return user.permissions?.includes('admissions.create')
})

const visiblePages = computed(() => {
  const pages = []
  const current = admissions.value.current_page
  const last = admissions.value.last_page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadAdmissions = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: 20,
      ...filters
    }
    
    const response = await admissionsApi.getList(params)
    admissions.value = response.data.admissions
    summary.value = response.data.summary
  } catch (error) {
    showToast('Error al cargar admisiones', 'error')
    console.error('Error loading admissions:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  if (page >= 1 && page <= admissions.value.last_page) {
    loadAdmissions(page)
  }
}

const viewAdmission = (admission) => {
  selectedAdmission.value = admission
  showDetailModal.value = true
}

const continueAdmission = (admission) => {
  selectedAdmission.value = admission
  showDetailModal.value = true
}

const cancelAdmission = async (admission) => {
  if (await showConfirm('¿Está seguro de cancelar esta admisión?')) {
    try {
      await admissionsApi.cancel(admission.id)
      showToast('Admisión cancelada exitosamente', 'success')
      loadAdmissions(admissions.value.current_page)
    } catch (error) {
      showToast('Error al cancelar admisión', 'error')
    }
  }
}

const handleAdmissionSaved = () => {
  showNewAdmissionModal.value = false
  loadAdmissions(1)
}

const handleAdmissionUpdated = () => {
  loadAdmissions(admissions.value.current_page)
}

// Formatting methods
const formatAdmissionType = (type) => {
  const types = {
    'preventive_detention': 'Prisión Preventiva',
    'sentence_execution': 'Ejecución de Sentencia',
    'transfer': 'Traslado',
    'reentry': 'Reingreso',
    'judicial_order': 'Orden Judicial'
  }
  return types[type] || type
}

const formatStatus = (status) => {
  const statuses = {
    'pending': 'Pendiente',
    'in_progress': 'En Proceso',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statuses[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time) => {
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDuration = (minutes) => {
  if (!minutes) return '-'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const getAdmissionTypeBadgeClass = (type) => {
  const classes = {
    'preventive_detention': 'badge-light-warning',
    'sentence_execution': 'badge-light-primary',
    'transfer': 'badge-light-info',
    'reentry': 'badge-light-secondary',
    'judicial_order': 'badge-light-success'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'badge-light-warning',
    'in_progress': 'badge-light-primary',
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

const getProgressBarClass = (percentage) => {
  if (percentage >= 75) return 'bg-success'
  if (percentage >= 50) return 'bg-warning'
  return 'bg-danger'
}

// Watchers
watch(filters, () => {
  loadAdmissions(1)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadAdmissions()
})
</script>