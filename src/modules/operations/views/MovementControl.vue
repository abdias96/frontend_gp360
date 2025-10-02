<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>Control de Movimientos</h3>
        <p class="text-muted">Gestión de movimientos internos y externos de PPL</p>
      </div>
      <div class="card-toolbar">
        <button 
          @click="showNewMovementModal = true"
          class="btn btn-primary btn-sm me-2"
          v-if="canCreate"
        >
          <i class="fas fa-plus"></i>
          Programar Movimiento
        </button>
        <button 
          @click="showEmergencyModal = true"
          class="btn btn-danger btn-sm"
          v-if="canCreate"
        >
          <i class="fas fa-exclamation-triangle"></i>
          Movimiento de Emergencia
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Active Movements Summary -->
      <div class="card card-flush mb-6">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-map-marker-alt text-primary me-2"></i>
            Movimientos Activos - {{ formatDate(new Date()) }}
          </h3>
          <div class="card-toolbar">
            <button 
              @click="loadActiveMovements"
              class="btn btn-sm btn-light"
              title="Actualizar"
            >
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-2" v-for="(data, type) in activeMovements" :key="type">
              <div class="card border h-100">
                <div class="card-body text-center py-4">
                  <i :class="['fas', getMovementTypeIcon(type), 'fs-2x', 'mb-3', 'text-primary']"></i>
                  <h6 class="card-title text-uppercase">{{ formatMovementType(type) }}</h6>
                  <p class="card-text">
                    <span class="badge badge-light-primary">{{ data.count }}</span>
                  </p>
                  <small v-if="data.overdue > 0" class="text-danger">
                    {{ data.overdue }} atrasados
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-4" v-if="!Object.keys(activeMovements).length">
            <i class="fas fa-check-circle text-success fs-3x"></i>
            <p class="text-muted mt-2">No hay movimientos activos en este momento</p>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #7239EA; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.total_active }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Activos</span>
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
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.total_overdue }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Atrasados</span>
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
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Completados Hoy</span>
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
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Duración Promedio (min)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="scheduled">Programados</option>
            <option value="in_transit">En Tránsito</option>
            <option value="at_destination">En Destino</option>
            <option value="returning">Regresando</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tipo de Movimiento</label>
          <select v-model="filters.movement_type" class="form-select">
            <option value="">Todos</option>
            <option value="medical">Médico</option>
            <option value="education">Educación</option>
            <option value="work">Trabajo</option>
            <option value="visit">Visita</option>
            <option value="court">Tribunal</option>
            <option value="administrative">Administrativo</option>
            <option value="religious">Religioso</option>
            <option value="sports">Deportes</option>
            <option value="emergency">Emergencia</option>
            <option value="transfer">Traslado</option>
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
          <label class="form-label">Buscar PPL</label>
          <input 
            type="text" 
            v-model="filters.search"
            class="form-control"
            placeholder="DPI, nombre..."
          >
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="mb-6">
        <button 
          @click="applyQuickFilter('today')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'today' }"
        >
          Hoy
        </button>
        <button 
          @click="applyQuickFilter('overdue')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'overdue' }"
        >
          Atrasados
        </button>
        <button 
          @click="applyQuickFilter('requires_escort')"
          class="btn btn-sm btn-light me-2"
          :class="{ active: quickFilter === 'requires_escort' }"
        >
          Con Escolta
        </button>
        <button 
          @click="clearFilters"
          class="btn btn-sm btn-secondary"
        >
          Limpiar Filtros
        </button>
      </div>

      <!-- Movements Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>PPL</th>
              <th>Tipo</th>
              <th>Origen → Destino</th>
              <th>Salida</th>
              <th>Retorno Esperado</th>
              <th>Estado</th>
              <th>Escolta</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements.data" :key="movement.id">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ movement.inmate?.full_name }}</span>
                  <span class="text-muted fs-7">{{ movement.inmate?.document_number }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getMovementTypeBadgeClass(movement.movement_type)">
                  {{ formatMovementType(movement.movement_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ movement.from_location }}</span>
                  <i class="fas fa-arrow-down text-muted"></i>
                  <span class="text-primary">{{ movement.to_location }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatDateTime(movement.departure_time) }}</span>
                  <span v-if="movement.actual_departure_time" class="text-muted fs-7">
                    Real: {{ formatTime(movement.actual_departure_time) }}
                  </span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatTime(movement.expected_return_time) }}</span>
                  <span v-if="movement.is_overdue" class="text-danger fs-7">
                    <i class="fas fa-exclamation-triangle"></i>
                    Atrasado {{ movement.delay_minutes }}m
                  </span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(movement.status)">
                  {{ formatStatus(movement.status) }}
                </span>
              </td>
              <td>
                <div v-if="movement.requires_escort">
                  <span class="text-gray-800">{{ movement.escort_officer?.name }}</span>
                  <i class="fas fa-shield-alt text-warning ms-1" title="Requiere escolta"></i>
                </div>
                <span v-else class="text-muted">No requerida</span>
              </td>
              <td>
                <span class="text-gray-800">{{ formatDuration(movement.duration_minutes) }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewMovement(movement)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="startMovement(movement)"
                    class="btn btn-success btn-sm"
                    v-if="movement.status === 'scheduled'"
                    title="Iniciar movimiento"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    @click="updateStatus(movement)"
                    class="btn btn-primary btn-sm"
                    v-if="['in_transit', 'at_destination', 'returning'].includes(movement.status)"
                    title="Actualizar estado"
                  >
                    <i class="fas fa-map-marker-alt"></i>
                  </button>
                  <button 
                    @click="completeMovement(movement)"
                    class="btn btn-info btn-sm"
                    v-if="movement.status === 'returning'"
                    title="Completar movimiento"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    @click="cancelMovement(movement)"
                    class="btn btn-danger btn-sm"
                    v-if="['scheduled', 'in_transit'].includes(movement.status)"
                    title="Cancelar movimiento"
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
          Mostrando {{ movements.from }} - {{ movements.to }} de {{ movements.total }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !movements.prev_page_url }">
              <button class="page-link" @click="loadPage(movements.current_page - 1)">Anterior</button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === movements.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !movements.next_page_url }">
              <button class="page-link" @click="loadPage(movements.current_page + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Movement Modal -->
    <!-- TODO: Create MovementModal component -->
    <!-- <MovementModal
      v-if="showNewMovementModal"
      @close="showNewMovementModal = false"
      @saved="handleMovementSaved"
    /> -->

    <!-- Emergency Movement Modal -->
    <!-- TODO: Create EmergencyMovementModal component -->
    <!-- <EmergencyMovementModal
      v-if="showEmergencyModal"
      @close="showEmergencyModal = false"
      @saved="handleMovementSaved"
    /> -->

    <!-- Movement Detail Modal -->
    <!-- TODO: Create MovementDetailModal component -->
    <!-- <MovementDetailModal
      v-if="showDetailModal"
      :movement="selectedMovement"
      @close="showDetailModal = false"
      @updated="handleMovementUpdated"
    /> -->

    <!-- Status Update Modal -->
    <!-- TODO: Create StatusUpdateModal component -->
    <!-- <StatusUpdateModal
      v-if="showStatusModal"
      :movement="selectedMovement"
      @close="showStatusModal = false"
      @updated="handleMovementUpdated"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { movementsApi } from '@/services/api/operations'
// import MovementModal from '../components/MovementModal.vue'
// import EmergencyMovementModal from '../components/EmergencyMovementModal.vue'
// import MovementDetailModal from '../components/MovementDetailModal.vue'
// import StatusUpdateModal from '../components/StatusUpdateModal.vue'

const { showToast, showConfirm } = useToast()
const authStore = useAuthStore()
const { user } = authStore

// Data
const loading = ref(false)
const showNewMovementModal = ref(false)
const showEmergencyModal = ref(false)
const showDetailModal = ref(false)
const showStatusModal = ref(false)
const selectedMovement = ref(null)
const quickFilter = ref('')

const movements = ref({
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
  total_active: 0,
  total_overdue: 0,
  completed_today: 0,
  average_duration: 0
})

const activeMovements = ref({})

const filters = reactive({
  status: '',
  movement_type: '',
  date: '',
  search: ''
})

// Computed
const canCreate = computed(() => {
  return user.permissions?.includes('movements.create')
})

const visiblePages = computed(() => {
  const pages = []
  const current = movements.value.current_page
  const last = movements.value.last_page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadMovements = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: 20,
      ...filters
    }
    
    const response = await movementsApi.getList(params)
    movements.value = response.data.movements
    summary.value = response.data.summary
  } catch (error) {
    showToast('Error al cargar movimientos', 'error')
    console.error('Error loading movements:', error)
  } finally {
    loading.value = false
  }
}

const loadActiveMovements = async () => {
  try {
    const response = await movementsApi.getActiveByLocation()
    activeMovements.value = response.data.by_type
  } catch (error) {
    console.error('Error loading active movements:', error)
  }
}

const loadPage = (page) => {
  if (page >= 1 && page <= movements.value.last_page) {
    loadMovements(page)
  }
}

const applyQuickFilter = (filter) => {
  quickFilter.value = filter
  filters.today = filter === 'today'
  filters.overdue = filter === 'overdue'
  filters.requires_escort = filter === 'requires_escort'
  loadMovements(1)
}

const clearFilters = () => {
  quickFilter.value = ''
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  loadMovements(1)
}

const viewMovement = (movement) => {
  selectedMovement.value = movement
  showDetailModal.value = true
}

const startMovement = async (movement) => {
  if (await showConfirm('¿Confirma el inicio de este movimiento?')) {
    try {
      await movementsApi.start(movement.id)
      showToast('Movimiento iniciado exitosamente', 'success')
      loadMovements(movements.value.current_page)
      loadActiveMovements()
    } catch (error) {
      showToast('Error al iniciar movimiento', 'error')
    }
  }
}

const updateStatus = (movement) => {
  selectedMovement.value = movement
  showStatusModal.value = true
}

const completeMovement = async (movement) => {
  if (await showConfirm('¿Confirma la finalización de este movimiento?')) {
    try {
      await movementsApi.updateStatus(movement.id, { status: 'completed' })
      showToast('Movimiento completado exitosamente', 'success')
      loadMovements(movements.value.current_page)
      loadActiveMovements()
    } catch (error) {
      showToast('Error al completar movimiento', 'error')
    }
  }
}

const cancelMovement = async (movement) => {
  const reason = await showPrompt('Ingrese la razón de cancelación:')
  if (reason) {
    try {
      await movementsApi.updateStatus(movement.id, { 
        status: 'cancelled',
        cancellation_reason: reason
      })
      showToast('Movimiento cancelado exitosamente', 'success')
      loadMovements(movements.value.current_page)
      loadActiveMovements()
    } catch (error) {
      showToast('Error al cancelar movimiento', 'error')
    }
  }
}

const handleMovementSaved = () => {
  showNewMovementModal.value = false
  showEmergencyModal.value = false
  loadMovements(1)
  loadActiveMovements()
}

const handleMovementUpdated = () => {
  showStatusModal.value = false
  loadMovements(movements.value.current_page)
  loadActiveMovements()
}

// Formatting methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (datetime) => {
  const date = new Date(datetime)
  return `${date.toLocaleDateString('es-GT')} ${date.toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`
}

const formatDuration = (minutes) => {
  if (!minutes) return '-'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatMovementType = (type) => {
  const types = {
    'medical': 'Médico',
    'education': 'Educación',
    'work': 'Trabajo',
    'visit': 'Visita',
    'court': 'Tribunal',
    'administrative': 'Administrativo',
    'religious': 'Religioso',
    'sports': 'Deportes',
    'emergency': 'Emergencia',
    'transfer': 'Traslado'
  }
  return types[type] || type
}

const formatStatus = (status) => {
  const statuses = {
    'scheduled': 'Programado',
    'in_transit': 'En Tránsito',
    'at_destination': 'En Destino',
    'returning': 'Regresando',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statuses[status] || status
}

const getMovementTypeIcon = (type) => {
  const icons = {
    'medical': 'fa-stethoscope',
    'education': 'fa-graduation-cap',
    'work': 'fa-hammer',
    'visit': 'fa-users',
    'court': 'fa-gavel',
    'administrative': 'fa-file-alt',
    'religious': 'fa-pray',
    'sports': 'fa-running',
    'emergency': 'fa-exclamation-triangle',
    'transfer': 'fa-exchange-alt'
  }
  return icons[type] || 'fa-arrow-right'
}

const getMovementTypeBadgeClass = (type) => {
  const classes = {
    'medical': 'badge-light-success',
    'education': 'badge-light-info',
    'work': 'badge-light-warning',
    'visit': 'badge-light-primary',
    'court': 'badge-light-dark',
    'administrative': 'badge-light-secondary',
    'religious': 'badge-light-purple',
    'sports': 'badge-light-success',
    'emergency': 'badge-light-danger',
    'transfer': 'badge-light-info'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'scheduled': 'badge-light-secondary',
    'in_transit': 'badge-light-primary',
    'at_destination': 'badge-light-warning',
    'returning': 'badge-light-info',
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  if (quickFilter.value === '') {
    loadMovements(1)
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadMovements()
  loadActiveMovements()
})
</script>