<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.counts.history.title') }}</h3>
        <p class="text-muted">{{ $t('operations.counts.history.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-counts' }"
          class="btn btn-light-primary btn-sm"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver al conteo actual
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <!-- Filters -->
      <div class="row mb-6">
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
          <label class="form-label">Tipo de Conteo</label>
          <select v-model="filters.count_type" class="form-select">
            <option value="">Todos</option>
            <option value="morning">Matutino</option>
            <option value="afternoon">Vespertino</option>
            <option value="night">Nocturno</option>
            <option value="emergency">Emergencia</option>
          </select>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <span class="svg-icon svg-icon-3x svg-icon-primary me-5">
                  <i class="fas fa-check-circle fa-2x text-primary"></i>
                </span>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold fs-5">{{ statistics.successful_counts }}</span>
                  <span class="text-muted fs-7">Conteos Exitosos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-danger">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <span class="svg-icon svg-icon-3x svg-icon-danger me-5">
                  <i class="fas fa-exclamation-triangle fa-2x text-danger"></i>
                </span>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold fs-5">{{ statistics.discrepancies }}</span>
                  <span class="text-muted fs-7">Con Discrepancias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-warning">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <span class="svg-icon svg-icon-3x svg-icon-warning me-5">
                  <i class="fas fa-clock fa-2x text-warning"></i>
                </span>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold fs-5">{{ statistics.average_duration }} min</span>
                  <span class="text-muted fs-7">Duración Promedio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <span class="svg-icon svg-icon-3x svg-icon-success me-5">
                  <i class="fas fa-percentage fa-2x text-success"></i>
                </span>
                <div class="d-flex flex-column">
                  <span class="text-dark fw-bold fs-5">{{ statistics.accuracy_rate }}%</span>
                  <span class="text-muted fs-7">Tasa de Precisión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Fecha/Hora</th>
              <th>Centro</th>
              <th>Tipo</th>
              <th>Esperado</th>
              <th>Contado</th>
              <th>Discrepancia</th>
              <th>Duración</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="count in counts" :key="count.id">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ formatDate(count.count_date) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(count.start_time) }}</span>
                </div>
              </td>
              <td>{{ count.center.name }}</td>
              <td>
                <span class="badge" :class="getCountTypeBadgeClass(count.count_type)">
                  {{ formatCountType(count.count_type) }}
                </span>
              </td>
              <td class="text-center fw-bold">{{ count.expected_count }}</td>
              <td class="text-center fw-bold">{{ count.actual_count }}</td>
              <td class="text-center">
                <span 
                  v-if="count.discrepancy !== 0"
                  class="badge badge-light-danger fw-bold"
                >
                  {{ count.discrepancy > 0 ? '+' : '' }}{{ count.discrepancy }}
                </span>
                <span v-else class="badge badge-light-success">
                  <i class="fas fa-check"></i>
                </span>
              </td>
              <td>{{ count.duration_minutes }} min</td>
              <td>{{ count.conducted_by.name }}</td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(count.status)">
                  {{ formatStatus(count.status) }}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewDetails(count)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="downloadReport(count)"
                    class="btn btn-light btn-sm"
                    title="Descargar reporte"
                  >
                    <i class="fas fa-download"></i>
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
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const { t } = useI18n()
const authStore = useAuthStore()

// Data
const loading = ref(false)
const counts = ref<any[]>([])
const centers = ref<any[]>([])

const filters = reactive({
  date_from: '',
  date_to: '',
  center_id: '',
  count_type: ''
})

const statistics = ref({
  successful_counts: 0,
  discrepancies: 0,
  average_duration: 0,
  accuracy_rate: 0
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
const loadCountHistory = async (page = 1) => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    counts.value = [
      {
        id: 1,
        count_date: '2024-01-15',
        start_time: '06:00:00',
        center: { id: 1, name: 'Centro Preventivo Zona 18' },
        count_type: 'morning',
        expected_count: 450,
        actual_count: 450,
        discrepancy: 0,
        duration_minutes: 45,
        conducted_by: { name: 'Juan Pérez' },
        status: 'completed'
      },
      {
        id: 2,
        count_date: '2024-01-15',
        start_time: '14:00:00',
        center: { id: 1, name: 'Centro Preventivo Zona 18' },
        count_type: 'afternoon',
        expected_count: 450,
        actual_count: 448,
        discrepancy: -2,
        duration_minutes: 55,
        conducted_by: { name: 'María García' },
        status: 'resolved'
      }
    ]
    
    statistics.value = {
      successful_counts: 28,
      discrepancies: 2,
      average_duration: 48,
      accuracy_rate: 93.3
    }
    
    pagination.value = {
      current_page: page,
      last_page: 5,
      per_page: 20,
      total: 100,
      from: 1,
      to: 20,
      prev_page_url: page > 1 ? '#' : null,
      next_page_url: page < 5 ? '#' : null
    }
  } catch (error) {
    console.error('Error loading count history:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el historial de conteos'
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
    loadCountHistory(page)
  }
}

const viewDetails = async (count: any) => {
  // TODO: Implement view details modal
  await Swal.fire({
    title: 'Detalles del Conteo',
    html: `
      <div class="text-start">
        <p><strong>Fecha:</strong> ${formatDate(count.count_date)}</p>
        <p><strong>Hora:</strong> ${formatTime(count.start_time)}</p>
        <p><strong>Centro:</strong> ${count.center.name}</p>
        <p><strong>Tipo:</strong> ${formatCountType(count.count_type)}</p>
        <p><strong>Esperado:</strong> ${count.expected_count}</p>
        <p><strong>Contado:</strong> ${count.actual_count}</p>
        <p><strong>Discrepancia:</strong> ${count.discrepancy}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar'
  })
}

const downloadReport = async (count: any) => {
  try {
    // TODO: Implement download report
    await Swal.fire({
      icon: 'success',
      title: 'Reporte descargado',
      text: 'El reporte ha sido descargado exitosamente'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo descargar el reporte'
    })
  }
}

// Formatting methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatCountType = (type: string) => {
  const types: Record<string, string> = {
    'morning': 'Matutino',
    'afternoon': 'Vespertino',
    'night': 'Nocturno',
    'emergency': 'Emergencia'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'completed': 'Completado',
    'resolved': 'Resuelto',
    'pending': 'Pendiente',
    'in_progress': 'En Proceso'
  }
  return statuses[status] || status
}

const getCountTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'morning': 'badge-light-primary',
    'afternoon': 'badge-light-info',
    'night': 'badge-light-dark',
    'emergency': 'badge-light-danger'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'badge-light-success',
    'resolved': 'badge-light-warning',
    'pending': 'badge-light-danger',
    'in_progress': 'badge-light-primary'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  loadCountHistory(1)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadCenters()
  loadCountHistory()
})
</script>