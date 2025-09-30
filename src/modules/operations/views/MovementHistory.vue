<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.movements.history.title') }}</h3>
        <p class="text-muted">{{ $t('operations.movements.history.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-movements' }"
          class="btn btn-light-primary btn-sm me-2"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver
        </router-link>
        <button 
          @click="exportHistory"
          class="btn btn-light-success btn-sm"
        >
          <i class="fas fa-file-excel me-2"></i>
          Exportar
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Tipo de Movimiento</label>
          <select v-model="filters.movement_type" class="form-select">
            <option value="">Todos</option>
            <option value="internal">Movimiento Interno</option>
            <option value="transfer">Traslado</option>
            <option value="court">Audiencia</option>
            <option value="medical">Médico</option>
            <option value="temporary">Temporal</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Centro</label>
          <select v-model="filters.center_id" class="form-select">
            <option value="">Todos los centros</option>
            <option v-for="center in centers" :key="center.id" :value="center.id">
              {{ center.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Fecha Desde</label>
          <input 
            type="date" 
            v-model="filters.date_from"
            class="form-control"
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Fecha Hasta</label>
          <input 
            type="date" 
            v-model="filters.date_to"
            class="form-control"
          >
        </div>
      </div>

      <div class="row mb-6">
        <div class="col-md-6">
          <label class="form-label">Buscar PPL</label>
          <input 
            type="text" 
            v-model="filters.search"
            class="form-control"
            placeholder="Nombre, DPI o código..."
          >
        </div>
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in_transit">En Tránsito</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">&nbsp;</label>
          <button 
            @click="clearFilters"
            class="btn btn-light-primary w-100"
          >
            <i class="fas fa-redo me-2"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-exchange-alt fa-2x text-primary me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.total_movements }}</div>
                  <div class="fs-7 text-muted">Total Movimientos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-warning">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-clock fa-2x text-warning me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.pending }}</div>
                  <div class="fs-7 text-muted">Pendientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-info">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-truck fa-2x text-info me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.in_transit }}</div>
                  <div class="fs-7 text-muted">En Tránsito</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-check-circle fa-2x text-success me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.completed_today }}</div>
                  <div class="fs-7 text-muted">Completados Hoy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Movement History Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>ID</th>
              <th>PPL</th>
              <th>Tipo</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha/Hora</th>
              <th>Estado</th>
              <th>Autorizado por</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements" :key="movement.id">
              <td class="fw-bold">#{{ movement.id }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ movement.inmate.full_name }}</span>
                  <span class="text-muted fs-7">{{ movement.inmate.document_number }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getMovementTypeBadgeClass(movement.movement_type)">
                  {{ formatMovementType(movement.movement_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ movement.origin.center }}</span>
                  <span class="text-muted fs-7">{{ movement.origin.location }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ movement.destination.center }}</span>
                  <span class="text-muted fs-7">{{ movement.destination.location }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatDate(movement.movement_date) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(movement.movement_time) }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(movement.status)">
                  {{ formatStatus(movement.status) }}
                </span>
              </td>
              <td>{{ movement.authorized_by || '-' }}</td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewDetails(movement)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="canPrint(movement)"
                    @click="printMovement(movement)"
                    class="btn btn-light btn-sm"
                    title="Imprimir"
                  >
                    <i class="fas fa-print"></i>
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
          Mostrando {{ pagination.from }} - {{ pagination.to }} de {{ pagination.total }} registros
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
              <button class="page-link" @click="loadPage(pagination.current_page - 1)">
                Anterior
              </button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === pagination.current_page }"
            >
              <button class="page-link" @click="loadPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
              <button class="page-link" @click="loadPage(pagination.current_page + 1)">
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Data
const loading = ref(false)
const movements = ref<any[]>([])
const centers = ref<any[]>([])

const filters = reactive({
  movement_type: '',
  center_id: '',
  date_from: '',
  date_to: '',
  search: '',
  status: ''
})

const statistics = ref({
  total_movements: 0,
  pending: 0,
  in_transit: 0,
  completed_today: 0
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0,
  prev_page_url: null,
  next_page_url: null
})

// Computed
const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  
  let start = Math.max(1, current - 2)
  let end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadMovementHistory = async (page = 1) => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    movements.value = [
      {
        id: 1001,
        inmate: {
          full_name: 'Juan Pérez García',
          document_number: '1234567890101'
        },
        movement_type: 'transfer',
        origin: {
          center: 'Centro Preventivo Zona 18',
          location: 'Sector A - Celda A-101'
        },
        destination: {
          center: 'Granja Penal Canadá',
          location: 'Sector B - Celda B-205'
        },
        movement_date: '2024-01-15',
        movement_time: '10:30:00',
        status: 'completed',
        authorized_by: 'Director Centro'
      },
      {
        id: 1002,
        inmate: {
          full_name: 'María González López',
          document_number: '9876543210101'
        },
        movement_type: 'court',
        origin: {
          center: 'Centro Preventivo Zona 18',
          location: 'Sector C - Celda C-303'
        },
        destination: {
          center: 'Torre de Tribunales',
          location: 'Juzgado 5to'
        },
        movement_date: '2024-01-16',
        movement_time: '08:00:00',
        status: 'in_transit',
        authorized_by: 'Juez de Ejecución'
      }
    ]
    
    statistics.value = {
      total_movements: 156,
      pending: 8,
      in_transit: 3,
      completed_today: 12
    }
    
    pagination.value = {
      current_page: page,
      last_page: 8,
      per_page: 20,
      total: 156,
      from: 1,
      to: 20,
      prev_page_url: page > 1 ? '#' : null,
      next_page_url: page < 8 ? '#' : null
    }
  } catch (error) {
    console.error('Error loading movement history:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el historial de movimientos'
    })
  } finally {
    loading.value = false
  }
}

const loadCenters = async () => {
  try {
    // TODO: Implement API call
    centers.value = [
      { id: 1, name: 'Centro Preventivo Zona 18' },
      { id: 2, name: 'Granja Penal Canadá' },
      { id: 3, name: 'Centro de Detención Preventiva para Mujeres' }
    ]
  } catch (error) {
    console.error('Error loading centers:', error)
  }
}

const loadPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadMovementHistory(page)
  }
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof typeof filters] = ''
  })
  loadMovementHistory(1)
}

const viewDetails = (movement: any) => {
  router.push({ 
    name: 'operations-movement-detail', 
    params: { id: movement.id } 
  })
}

const printMovement = async (movement: any) => {
  try {
    // TODO: Implement print functionality
    await Swal.fire({
      icon: 'info',
      title: 'Imprimiendo',
      text: 'Generando documento de movimiento...'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo imprimir el documento'
    })
  }
}

const exportHistory = async () => {
  try {
    // TODO: Implement export functionality
    await Swal.fire({
      icon: 'success',
      title: 'Exportando',
      text: 'El archivo se está generando...'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo exportar el historial'
    })
  }
}

const canPrint = (movement: any) => {
  return ['completed', 'in_transit'].includes(movement.status)
}

// Formatting methods
const formatMovementType = (type: string) => {
  const types: Record<string, string> = {
    'internal': 'Interno',
    'transfer': 'Traslado',
    'court': 'Audiencia',
    'medical': 'Médico',
    'temporary': 'Temporal'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'pending': 'Pendiente',
    'in_transit': 'En Tránsito',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statuses[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getMovementTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'internal': 'badge-light-primary',
    'transfer': 'badge-light-warning',
    'court': 'badge-light-info',
    'medical': 'badge-light-danger',
    'temporary': 'badge-light-secondary'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'badge-light-warning',
    'in_transit': 'badge-light-info',
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  loadMovementHistory(1)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadCenters()
  loadMovementHistory()
})
</script>