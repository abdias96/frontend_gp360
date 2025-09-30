<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>Conteo Diario de PPL</h3>
        <p class="text-muted">Control y seguimiento de conteos obligatorios</p>
      </div>
      <div class="card-toolbar">
        <button 
          @click="startNewCount"
          class="btn btn-primary btn-sm me-2"
          v-if="canCreate"
        >
          <i class="fas fa-plus"></i>
          Iniciar Conteo
        </button>
        <button 
          @click="startEmergencyCount"
          class="btn btn-warning btn-sm"
          v-if="canCreate"
        >
          <i class="fas fa-exclamation-triangle"></i>
          Conteo de Emergencia
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Today's Schedule -->
      <div class="card card-flush mb-6">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-calendar-day text-primary me-2"></i>
            Conteos de Hoy - {{ formatDate(new Date()) }}
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3" v-for="schedule in todaySchedule" :key="schedule.count_type">
              <div class="card border" :class="getScheduleCardClass(schedule)">
                <div class="card-body text-center py-4">
                  <i class="fas fa-clock fs-2x mb-3" :class="getScheduleIconClass(schedule)"></i>
                  <h5 class="card-title">{{ formatCountType(schedule.count_type) }}</h5>
                  <p class="card-text">{{ formatTime(schedule.scheduled_time) }}</p>
                  <div v-if="schedule.exists">
                    <span class="badge" :class="getStatusBadgeClass(schedule.status)">
                      {{ formatStatus(schedule.status) }}
                    </span>
                    <div v-if="schedule.status === 'in_progress'" class="mt-2">
                      <button 
                        @click="continueCount(schedule)"
                        class="btn btn-sm btn-primary"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <span class="badge badge-light-secondary">Pendiente</span>
                    <div class="mt-2" v-if="schedule.status !== 'overdue'">
                      <button 
                        @click="startScheduledCount(schedule.count_type)"
                        class="btn btn-sm btn-success"
                      >
                        Iniciar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
               style="background-color: #50CD89; background-image: url('/assets/media/patterns/vector-1.png')">
            <div class="card-header pt-5">
              <div class="card-title d-flex flex-column">
                <div class="d-flex align-items-center">
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.total_population }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Población Total</span>
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
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.completed }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Completados Hoy</span>
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
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.with_discrepancies }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Con Discrepancias</span>
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
                  <span class="fs-4 fw-semibold text-white me-1 align-self-start">{{ summary.pending }}</span>
                </div>
                <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Pendientes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Fecha</label>
          <input 
            type="date" 
            v-model="filters.date"
            class="form-control"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Tipo de Conteo</label>
          <select v-model="filters.count_type" class="form-select">
            <option value="">Todos</option>
            <option value="morning">Matutino (06:00)</option>
            <option value="midday">Medio Día (12:00)</option>
            <option value="evening">Vespertino (18:00)</option>
            <option value="night">Nocturno (21:00)</option>
            <option value="emergency">Emergencia</option>
            <option value="recount">Reconteo</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Proceso</option>
            <option value="completed">Completado</option>
            <option value="with_discrepancy">Con Discrepancia</option>
            <option value="resolved">Resuelto</option>
            <option value="verified">Verificado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Sector</label>
          <select v-model="filters.sector_id" class="form-select">
            <option value="">Todos los Sectores</option>
            <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
              {{ sector.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Counts Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Fecha/Hora</th>
              <th>Tipo</th>
              <th>Sector</th>
              <th>Esperado</th>
              <th>Contado</th>
              <th>Diferencia</th>
              <th>Estado</th>
              <th>Responsable</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="count in counts.data" :key="count.id">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatDate(count.count_date) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(count.scheduled_time) }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getCountTypeBadgeClass(count.count_type)">
                  {{ formatCountType(count.count_type) }}
                </span>
              </td>
              <td>
                <span class="text-gray-800">{{ count.sector?.name || 'Todo el Centro' }}</span>
              </td>
              <td>
                <span class="fs-6 fw-bold text-gray-800">{{ count.expected_count }}</span>
              </td>
              <td>
                <span class="fs-6 fw-bold" :class="count.count_matches ? 'text-success' : 'text-danger'">
                  {{ count.physical_count || '-' }}
                </span>
              </td>
              <td>
                <span v-if="count.physical_count" 
                      class="badge" 
                      :class="count.count_matches ? 'badge-light-success' : 'badge-light-danger'">
                  {{ count.discrepancy > 0 ? '+' : '' }}{{ count.discrepancy }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(count.status)">
                  {{ formatStatus(count.status) }}
                </span>
                <div v-if="!count.count_matches && count.status === 'completed'" class="mt-1">
                  <i class="fas fa-exclamation-triangle text-warning" title="Discrepancia encontrada"></i>
                </div>
              </td>
              <td>
                <span class="text-gray-800">{{ count.officer_in_charge?.name }}</span>
              </td>
              <td>
                <span class="text-gray-800">{{ formatDuration(count.duration_minutes) }}</span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewCount(count)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="continueCount(count)"
                    class="btn btn-primary btn-sm"
                    v-if="count.status === 'in_progress'"
                    title="Continuar conteo"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    @click="resolveDiscrepancy(count)"
                    class="btn btn-warning btn-sm"
                    v-if="count.status === 'with_discrepancy'"
                    title="Resolver discrepancia"
                  >
                    <i class="fas fa-exclamation-triangle"></i>
                  </button>
                  <button 
                    @click="verifyCount(count)"
                    class="btn btn-success btn-sm"
                    v-if="['completed', 'resolved'].includes(count.status) && canVerify"
                    title="Verificar conteo"
                  >
                    <i class="fas fa-check"></i>
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
          Mostrando {{ counts.from }} - {{ counts.to }} de {{ counts.total }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !counts.prev_page_url }">
              <button class="page-link" @click="loadPage(counts.current_page - 1)">Anterior</button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === counts.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !counts.next_page_url }">
              <button class="page-link" @click="loadPage(counts.current_page + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Count Modal -->
    <CountModal 
      v-if="showCountModal"
      :count="selectedCount"
      @close="showCountModal = false"
      @saved="handleCountSaved"
    />

    <!-- Discrepancy Resolution Modal -->
    <DiscrepancyModal 
      v-if="showDiscrepancyModal"
      :count="selectedCount"
      @close="showDiscrepancyModal = false"
      @resolved="handleDiscrepancyResolved"
    />

    <!-- Count Detail Modal -->
    <CountDetailModal 
      v-if="showDetailModal"
      :count="selectedCount"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { dailyCountsApi } from '@/services/api/operations'
import { catalogsApi } from '@/services/api/catalogs'
import CountModal from '../components/CountModal.vue'
import DiscrepancyModal from '../components/DiscrepancyModal.vue'
import CountDetailModal from '../components/CountDetailModal.vue'

const { showToast, showConfirm } = useToast()
const authStore = useAuthStore()
const { user } = authStore

// Data
const loading = ref(false)
const showCountModal = ref(false)
const showDiscrepancyModal = ref(false)
const showDetailModal = ref(false)
const selectedCount = ref(null)

const counts = ref({
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
  total_population: 0,
  completed: 0,
  pending: 0,
  with_discrepancies: 0
})

const todaySchedule = ref([])
const sectors = ref([])

const filters = reactive({
  date: new Date().toISOString().split('T')[0],
  count_type: '',
  status: '',
  sector_id: ''
})

// Computed
const canCreate = computed(() => {
  return user.permissions?.includes('counts.create')
})

const canVerify = computed(() => {
  return user.permissions?.includes('counts.verify')
})

const visiblePages = computed(() => {
  const pages = []
  const current = counts.value.current_page
  const last = counts.value.last_page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadCounts = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: 20,
      ...filters
    }
    
    const response = await dailyCountsApi.getList(params)
    counts.value = response.data.counts
    summary.value = response.data.summary
  } catch (error) {
    showToast('Error al cargar conteos', 'error')
    console.error('Error loading counts:', error)
  } finally {
    loading.value = false
  }
}

const loadTodaySchedule = async () => {
  try {
    const response = await dailyCountsApi.getScheduled()
    todaySchedule.value = response.data
  } catch (error) {
    console.error('Error loading today schedule:', error)
  }
}

const loadSectors = async () => {
  try {
    const response = await catalogsApi.sectors.getAll()
    sectors.value = response.data
  } catch (error) {
    console.error('Error loading sectors:', error)
  }
}

const loadPage = (page) => {
  if (page >= 1 && page <= counts.value.last_page) {
    loadCounts(page)
  }
}

const startNewCount = () => {
  selectedCount.value = null
  showCountModal.value = true
}

const startScheduledCount = (countType) => {
  selectedCount.value = { count_type: countType }
  showCountModal.value = true
}

const startEmergencyCount = () => {
  selectedCount.value = { count_type: 'emergency' }
  showCountModal.value = true
}

const continueCount = (count) => {
  selectedCount.value = count
  showCountModal.value = true
}

const viewCount = (count) => {
  selectedCount.value = count
  showDetailModal.value = true
}

const resolveDiscrepancy = (count) => {
  selectedCount.value = count
  showDiscrepancyModal.value = true
}

const verifyCount = async (count) => {
  if (await showConfirm('¿Está seguro de verificar este conteo?')) {
    try {
      await dailyCountsApi.verify(count.id)
      showToast('Conteo verificado exitosamente', 'success')
      loadCounts(counts.value.current_page)
    } catch (error) {
      showToast('Error al verificar conteo', 'error')
    }
  }
}

const handleCountSaved = () => {
  showCountModal.value = false
  loadCounts(counts.value.current_page)
  loadTodaySchedule()
}

const handleDiscrepancyResolved = () => {
  showDiscrepancyModal.value = false
  loadCounts(counts.value.current_page)
}

// Formatting methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time) => {
  if (typeof time === 'string' && time.includes('T')) {
    return new Date(time).toLocaleTimeString('es-GT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
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

const formatCountType = (type) => {
  const types = {
    'morning': 'Matutino',
    'midday': 'Medio Día',
    'evening': 'Vespertino',
    'night': 'Nocturno',
    'emergency': 'Emergencia',
    'recount': 'Reconteo'
  }
  return types[type] || type
}

const formatStatus = (status) => {
  const statuses = {
    'pending': 'Pendiente',
    'in_progress': 'En Proceso',
    'completed': 'Completado',
    'with_discrepancy': 'Con Discrepancia',
    'resolved': 'Resuelto',
    'verified': 'Verificado'
  }
  return statuses[status] || status
}

const getScheduleCardClass = (schedule) => {
  if (!schedule.exists && schedule.status === 'overdue') return 'border-danger'
  if (schedule.exists && schedule.status === 'completed') return 'border-success'
  if (schedule.exists && schedule.status === 'in_progress') return 'border-primary'
  return 'border-secondary'
}

const getScheduleIconClass = (schedule) => {
  if (!schedule.exists && schedule.status === 'overdue') return 'text-danger'
  if (schedule.exists && schedule.status === 'completed') return 'text-success'
  if (schedule.exists && schedule.status === 'in_progress') return 'text-primary'
  return 'text-secondary'
}

const getCountTypeBadgeClass = (type) => {
  const classes = {
    'morning': 'badge-light-success',
    'midday': 'badge-light-warning',
    'evening': 'badge-light-info',
    'night': 'badge-light-primary',
    'emergency': 'badge-light-danger',
    'recount': 'badge-light-secondary'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'badge-light-secondary',
    'in_progress': 'badge-light-primary',
    'completed': 'badge-light-success',
    'with_discrepancy': 'badge-light-danger',
    'resolved': 'badge-light-warning',
    'verified': 'badge-light-success'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  loadCounts(1)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadCounts()
  loadTodaySchedule()
  loadSectors()
})
</script>