<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('visits.visitor_registry.title') }}</h3>
        <p class="text-muted">{{ $t('visits.visitor_registry.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <button 
          @click="showNewVisitorModal = true"
          class="btn btn-primary btn-sm"
          v-if="canCreate"
        >
          <i class="fas fa-plus"></i>
          {{ $t('visits.visitor_registry.new_visitor') }}
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Summary Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #7239EA; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.total_visitors }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">{{ $t('visits.statistics.general.total_visitors') }}</span>
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
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.verified_visitors }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Verificados</span>
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
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.with_biometrics }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Con Biometría</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #F1416C; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.pending_verification }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Pendientes Verificación</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">{{ $t('visits.common.status') }}</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="pending_documentation">Pendiente Documentación</option>
            <option value="documentation_review">Revisión Documentación</option>
            <option value="background_check">Verificación Antecedentes</option>
            <option value="biometric_enrollment">Enrolamiento Biométrico</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
            <option value="suspended">Suspendido</option>
            <option value="revoked">Revocado</option>
            <option value="expired">Expirado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Datos Biométricos</label>
          <select v-model="filters.has_biometrics" class="form-select">
            <option value="">Todos</option>
            <option value="true">Con Biometría</option>
            <option value="false">Sin Biometría</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Género</label>
          <select v-model="filters.gender" class="form-select">
            <option value="">Todos</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">{{ $t('visits.common.search') }}</label>
          <input 
            type="text" 
            v-model="filters.search"
            class="form-control"
            placeholder="DPI, nombre, teléfono..."
          >
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="mb-6">
        <button 
          @click="applyQuickFilter('pending_verification')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'pending_verification' }"
        >
          <i class="fas fa-clock text-warning"></i>
          Pendientes Verificación
        </button>
        <button 
          @click="applyQuickFilter('without_biometrics')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'without_biometrics' }"
        >
          <i class="fas fa-fingerprint text-danger"></i>
          Sin Biometría
        </button>
        <button 
          @click="applyQuickFilter('recent_visitors')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'recent_visitors' }"
        >
          <i class="fas fa-calendar text-info"></i>
          Visitantes Recientes
        </button>
        <button 
          @click="clearFilters"
          class="btn btn-sm btn-secondary"
        >
          {{ $t('visits.common.filter') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Visitors Table -->
      <div v-else class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Visitante</th>
              <th>Documento</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Biometría</th>
              <th>Relaciones Activas</th>
              <th>Última Visita</th>
              <th>Puntuación</th>
              <th>{{ $t('visits.common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!visitors.data || visitors.data.length === 0">
              <td colspan="9" class="text-center py-6">
                <div class="text-muted">
                  <i class="fas fa-users mb-3 fs-2x"></i>
                  <p>No hay visitantes registrados</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="visitor in visitors.data" :key="visitor.id">
              <td>
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-50px me-3">
                    <img v-if="visitor.front_photo_path" 
                         :src="`/storage/${visitor.front_photo_path}`" 
                         alt="Foto" 
                         class="symbol-label">
                    <div v-else class="symbol-label bg-light-primary">
                      <i class="fas fa-user text-primary fs-3"></i>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ visitor.full_name }}</span>
                    <span class="text-muted fs-7">{{ getAge(visitor.birth_date) }} años</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ visitor.document_type?.name || 'N/A' }}</span>
                  <span class="text-muted fs-7">{{ visitor.identification_number }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ visitor.mobile_phone || visitor.phone || '-' }}</span>
                  <span class="text-muted fs-7">{{ visitor.email || '-' }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(visitor.accreditation_status)">
                  {{ formatStatus(visitor.accreditation_status) }}
                </span>
              </td>
              <td>
                <div class="text-center">
                  <i v-if="visitor.biometric_enrolled" 
                     class="fas fa-fingerprint text-success fs-3" 
                     title="Biometría registrada"></i>
                  <i v-else 
                     class="fas fa-fingerprint text-muted fs-3" 
                     title="Sin biometría"></i>
                </div>
              </td>
              <td>
                <div class="text-center">
                  <span class="badge badge-light-primary">{{ visitor.relationships_count || 0 }}</span>
                </div>
              </td>
              <td>
                <span v-if="visitor.last_visit_date" class="text-gray-800">
                  {{ formatDate(visitor.last_visit_date) }}
                </span>
                <span v-else class="text-muted">Sin visitas</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="progress h-6px w-60px me-2">
                    <div 
                      class="progress-bar" 
                      :class="getConductScoreClass(visitor.conduct_score)"
                      :style="`width: ${visitor.conduct_score || 100}%`"
                    ></div>
                  </div>
                  <span class="fs-7 text-muted">{{ visitor.conduct_score || 100 }}%</span>
                </div>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewVisitor(visitor)"
                    class="btn btn-light btn-sm"
                    title="Ver perfil"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="editVisitor(visitor)"
                    class="btn btn-primary btn-sm"
                    v-if="canEdit"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="captureBiometrics(visitor)"
                    class="btn btn-warning btn-sm"
                    v-if="!visitor.biometric_enrolled && canEdit"
                    title="Capturar biometría"
                  >
                    <i class="fas fa-fingerprint"></i>
                  </button>
                  <button 
                    @click="manageRelationships(visitor)"
                    class="btn btn-info btn-sm"
                    title="Gestionar relaciones"
                  >
                    <i class="fas fa-users"></i>
                  </button>
                  <div class="btn-group">
                    <button 
                      class="btn btn-secondary btn-sm dropdown-toggle" 
                      data-bs-toggle="dropdown"
                      title="Más acciones"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-if="visitor.status !== 'suspended'">
                        <a class="dropdown-item" @click="suspendVisitor(visitor)">
                          <i class="fas fa-ban text-warning me-2"></i>
                          Suspender
                        </a>
                      </li>
                      <li v-if="visitor.status === 'suspended'">
                        <a class="dropdown-item" @click="activateVisitor(visitor)">
                          <i class="fas fa-check text-success me-2"></i>
                          Activar
                        </a>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <a class="dropdown-item" @click="viewVisitHistory(visitor)">
                          <i class="fas fa-history text-info me-2"></i>
                          Historial de Visitas
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" @click="exportVisitorData(visitor)">
                          <i class="fas fa-download text-primary me-2"></i>
                          Exportar Datos
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
      <div v-if="visitors.total > 0" class="d-flex justify-content-between align-items-center mt-6">
        <div class="text-muted">
          Mostrando {{ visitors.from || 0 }} - {{ visitors.to || 0 }} de {{ visitors.total || 0 }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !visitors.prev_page_url }">
              <button class="page-link" @click="loadPage(visitors.current_page - 1)">Anterior</button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === visitors.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !visitors.next_page_url }">
              <button class="page-link" @click="loadPage(visitors.current_page + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- New Visitor Modal -->
    <!-- TODO: Create VisitorModal component -->
    <!-- <VisitorModal
      v-if="showNewVisitorModal"
      @close="showNewVisitorModal = false"
      @saved="handleVisitorSaved"
    /> -->

    <!-- Edit Visitor Modal -->
    <!-- TODO: Create VisitorModal component -->
    <!-- <VisitorModal
      v-if="showEditModal"
      :visitor="selectedVisitor"
      @close="showEditModal = false"
      @saved="handleVisitorUpdated"
    /> -->

    <!-- Visitor Detail Modal -->
    <!-- TODO: Create VisitorDetailModal component -->
    <!-- <VisitorDetailModal
      v-if="showDetailModal"
      :visitor="selectedVisitor"
      @close="showDetailModal = false"
      @updated="handleVisitorUpdated"
    /> -->

    <!-- Biometric Capture Modal -->
    <!-- TODO: Create BiometricCaptureModal component -->
    <!-- <BiometricCaptureModal
      v-if="showBiometricModal"
      :visitor="selectedVisitor"
      @close="showBiometricModal = false"
      @captured="handleBiometricCaptured"
    /> -->

    <!-- Relationships Modal -->
    <!-- TODO: Create VisitorRelationshipsModal component -->
    <!-- <VisitorRelationshipsModal
      v-if="showRelationshipsModal"
      :visitor="selectedVisitor"
      @close="showRelationshipsModal = false"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { visitorsApi } from '@/services/api/visits'
import { formatDate as formatDateHelper } from '@/core/helpers/formatters'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'
// import VisitorModal from '../components/VisitorModal.vue'
// import VisitorDetailModal from '../components/VisitorDetailModal.vue'
// import BiometricCaptureModal from '../components/BiometricCaptureModal.vue'
// import VisitorRelationshipsModal from '../components/VisitorRelationshipsModal.vue'

const router = useRouter()
const { showToast, showConfirm } = useToast()
const authStore = useAuthStore()
const { user } = authStore

// Data
const loading = ref(false)
const showNewVisitorModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showBiometricModal = ref(false)
const showRelationshipsModal = ref(false)
const selectedVisitor = ref(null)
const quickFilter = ref('')

const visitors = ref({
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
  total_visitors: 0,
  verified_visitors: 0,
  with_biometrics: 0,
  pending_verification: 0
})

const filters = reactive({
  status: '',
  has_biometrics: '',
  gender: '',
  search: ''
})

// Computed
const canCreate = computed(() => {
  return user.permissions?.includes('visits.visitors.create')
})

const canEdit = computed(() => {
  return user.permissions?.includes('visits.visitors.edit')
})

const visiblePages = computed(() => {
  const pages = []
  const current = visitors.value.current_page
  const last = visitors.value.last_page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadVisitors = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: 20,
      ...filters
    }
    
    const response = await visitorsApi.getList(params)
    visitors.value = response.data.visitors
    summary.value = response.data.summary
  } catch (error) {
    showToast('Error al cargar visitantes', 'error')
    console.error('Error loading visitors:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  if (page >= 1 && page <= visitors.value.last_page) {
    loadVisitors(page)
  }
}

const applyQuickFilter = (filter) => {
  quickFilter.value = filter
  
  // Reset filters first
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })

  // Apply specific filter
  switch (filter) {
    case 'pending_verification':
      filters.status = 'pending_verification'
      break
    case 'without_biometrics':
      filters.has_biometrics = 'false'
      break
    case 'recent_visitors':
      filters.recent_activity = 'true'
      break
  }
  
  loadVisitors(1)
}

const clearFilters = () => {
  quickFilter.value = ''
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  loadVisitors(1)
}

const viewVisitor = (visitor) => {
  // Navigate to visitor detail page
  router.push(`/visits/visitors/${visitor.id}`)
}

const editVisitor = (visitor) => {
  // Navigate to visitor edit page
  router.push(`/visits/visitors/${visitor.id}/edit`)
}

const captureBiometrics = (visitor) => {
  selectedVisitor.value = visitor
  showBiometricModal.value = true
}

const manageRelationships = (visitor) => {
  // Navigate to visitor relationships page filtered by this visitor
  router.push(`/visits/relationships?visitor_id=${visitor.id}&visitor_name=${encodeURIComponent(visitor.full_name)}`)
}

const suspendVisitor = async (visitor) => {
  const result = await Swal.fire({
    title: '¿Suspender Visitante?',
    text: 'El visitante no podrá realizar visitas mientras esté suspendido',
    input: 'textarea',
    inputLabel: 'Motivo de la suspensión',
    inputPlaceholder: 'Ingrese el motivo...',
    inputAttributes: {
      'aria-label': 'Ingrese el motivo de la suspensión'
    },
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, suspender',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Debe proporcionar un motivo'
      }
    }
  })

  if (result.isConfirmed) {
    try {
      await ApiService.post(`/visitors/${visitor.id}/accreditation-status`, {
        status: 'suspended',
        reason: result.value
      })
      Swal.fire('Suspendido', 'El visitante ha sido suspendido exitosamente', 'success')
      loadVisitors(visitors.value.current_page)
    } catch (error) {
      console.error('Error suspending visitor:', error)
      Swal.fire('Error', 'No se pudo suspender al visitante', 'error')
    }
  }
}

const activateVisitor = async (visitor) => {
  const result = await Swal.fire({
    title: '¿Activar Visitante?',
    text: 'El visitante podrá realizar visitas nuevamente',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, activar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await ApiService.post(`/visitors/${visitor.id}/accreditation-status`, {
        status: 'active'
      })
      Swal.fire('Activado', 'El visitante ha sido activado exitosamente', 'success')
      loadVisitors(visitors.value.current_page)
    } catch (error) {
      console.error('Error activating visitor:', error)
      Swal.fire('Error', 'No se pudo activar al visitante', 'error')
    }
  }
}

const viewVisitHistory = (visitor) => {
  // Navigate to visit logs filtered by this visitor
  router.push(`/visits/logs?visitor_id=${visitor.id}&visitor_name=${encodeURIComponent(visitor.full_name)}`)
}

const exportVisitorData = async (visitor) => {
  try {
    const response = await ApiService.get(`/visitors/${visitor.id}`)
    const visitorData = response.data.data || response.data

    // Create downloadable JSON file
    const dataStr = JSON.stringify(visitorData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `visitante-${visitor.document_number}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    Swal.fire('Exportado', 'Datos del visitante exportados exitosamente', 'success')
  } catch (error) {
    console.error('Error exporting visitor data:', error)
    Swal.fire('Error', 'No se pudieron exportar los datos del visitante', 'error')
  }
}

const handleVisitorSaved = () => {
  showNewVisitorModal.value = false
  loadVisitors(1)
}

const handleVisitorUpdated = () => {
  showEditModal.value = false
  showDetailModal.value = false
  loadVisitors(visitors.value.current_page)
}

const handleBiometricCaptured = () => {
  showBiometricModal.value = false
  loadVisitors(visitors.value.current_page)
}

// Formatting methods
const formatDate = (date) => {
  return date ? formatDateHelper(date, 'dd/MM/yyyy') : ''
}

const getAge = (birthDate) => {
  if (!birthDate) return 0
  const today = new Date()

  // Parse date correctly to avoid timezone issues
  let birth
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
    const [year, month, day] = birthDate.split('-').map(Number)
    birth = new Date(year, month - 1, day) // month is 0-indexed
  } else {
    birth = new Date(birthDate)
  }

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const formatStatus = (status) => {
  const statuses = {
    'pending_documentation': 'Pendiente Doc.',
    'documentation_review': 'Revisión Doc.',
    'background_check': 'Verificación',
    'biometric_enrollment': 'Biometría',
    'approved': 'Aprobado',
    'rejected': 'Rechazado',
    'suspended': 'Suspendido',
    'revoked': 'Revocado',
    'expired': 'Expirado'
  }
  return statuses[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'pending_documentation': 'badge-light-secondary',
    'documentation_review': 'badge-light-info',
    'background_check': 'badge-light-warning',
    'biometric_enrollment': 'badge-light-primary',
    'approved': 'badge-light-success',
    'rejected': 'badge-light-danger',
    'suspended': 'badge-light-danger',
    'revoked': 'badge-light-dark',
    'expired': 'badge-light-secondary'
  }
  return classes[status] || 'badge-light-secondary'
}

const getConductScoreClass = (score) => {
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-warning'
  return 'bg-danger'
}

// Watchers
watch(filters, () => {
  if (quickFilter.value === '') {
    loadVisitors(1)
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadVisitors()
})
</script>