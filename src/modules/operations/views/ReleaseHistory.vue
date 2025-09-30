<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.releases.history.title') }}</h3>
        <p class="text-muted">{{ $t('operations.releases.history.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-releases' }"
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
          <label class="form-label">Tipo de Liberación</label>
          <select v-model="filters.release_type" class="form-select">
            <option value="">Todos</option>
            <option value="sentence_completion">Cumplimiento de Condena</option>
            <option value="parole">Libertad Condicional</option>
            <option value="bail">Fianza</option>
            <option value="court_order">Orden Judicial</option>
            <option value="amnesty">Amnistía</option>
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
                <i class="fas fa-door-open fa-2x text-primary me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.total_releases }}</div>
                  <div class="fs-7 text-muted">Total Liberaciones</div>
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
                  <div class="fs-4 fw-bold">{{ statistics.completed }}</div>
                  <div class="fs-7 text-muted">Completadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-warning">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-balance-scale fa-2x text-warning me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.parole }}</div>
                  <div class="fs-7 text-muted">Condicionales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-info">
            <div class="card-body p-5">
              <div class="d-flex align-items-center">
                <i class="fas fa-clock fa-2x text-info me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.average_duration }} días</div>
                  <div class="fs-7 text-muted">Duración Promedio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Release History Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>ID</th>
              <th>PPL</th>
              <th>Centro</th>
              <th>Tipo de Liberación</th>
              <th>Fecha Liberación</th>
              <th>Tiempo en Prisión</th>
              <th>Estado</th>
              <th>Procesado por</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="release in releases" :key="release.id">
              <td class="fw-bold">#{{ release.id }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ release.inmate.full_name }}</span>
                  <span class="text-muted fs-7">{{ release.inmate.document_number }}</span>
                </div>
              </td>
              <td>{{ release.center.name }}</td>
              <td>
                <span class="badge" :class="getReleaseTypeBadgeClass(release.release_type)">
                  {{ formatReleaseType(release.release_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatDate(release.release_date) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(release.release_time) }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ formatPrisonTime(release.prison_time) }}</span>
                  <span class="text-muted fs-7">{{ release.prison_days }} días</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(release.status)">
                  {{ formatStatus(release.status) }}
                </span>
              </td>
              <td>{{ release.processed_by?.name || '-' }}</td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewDetails(release)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="downloadDocuments(release)"
                    class="btn btn-light btn-sm"
                    title="Descargar documentos"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    @click="printCertificate(release)"
                    class="btn btn-light btn-sm"
                    title="Imprimir certificado"
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
import Swal from 'sweetalert2'

const { t } = useI18n()
const router = useRouter()

// Data
const loading = ref(false)
const releases = ref<any[]>([])
const centers = ref<any[]>([])

const filters = reactive({
  date_from: '',
  date_to: '',
  release_type: '',
  center_id: '',
  search: '',
  status: ''
})

const statistics = ref({
  total_releases: 0,
  completed: 0,
  parole: 0,
  average_duration: 0
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
const loadReleaseHistory = async (page = 1) => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    releases.value = [
      {
        id: 1001,
        inmate: {
          full_name: 'Juan Pérez García',
          document_number: '1234567890101'
        },
        center: { name: 'Centro Preventivo Zona 18' },
        release_type: 'sentence_completion',
        release_date: '2024-01-10',
        release_time: '08:30:00',
        prison_time: '2 años, 3 meses',
        prison_days: 825,
        status: 'completed',
        processed_by: { name: 'María López' }
      },
      {
        id: 1002,
        inmate: {
          full_name: 'Carlos Rodríguez',
          document_number: '9876543210101'
        },
        center: { name: 'Granja Penal Canadá' },
        release_type: 'parole',
        release_date: '2024-01-08',
        release_time: '10:15:00',
        prison_time: '5 años, 6 meses',
        prison_days: 2007,
        status: 'completed',
        processed_by: { name: 'Juan Martínez' }
      },
      {
        id: 1003,
        inmate: {
          full_name: 'María González',
          document_number: '5555555555555'
        },
        center: { name: 'Centro de Mujeres' },
        release_type: 'court_order',
        release_date: '2024-01-05',
        release_time: '14:00:00',
        prison_time: '1 año, 2 meses',
        prison_days: 425,
        status: 'completed',
        processed_by: { name: 'Ana García' }
      }
    ]
    
    statistics.value = {
      total_releases: 245,
      completed: 242,
      parole: 87,
      average_duration: 18
    }
    
    pagination.value = {
      current_page: page,
      last_page: 13,
      per_page: 20,
      total: 245,
      from: 1,
      to: 20,
      prev_page_url: page > 1 ? '#' : null,
      next_page_url: page < 13 ? '#' : null
    }
  } catch (error) {
    console.error('Error loading release history:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el historial de liberaciones'
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
    loadReleaseHistory(page)
  }
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof typeof filters] = ''
  })
  loadReleaseHistory(1)
}

const viewDetails = (release: any) => {
  router.push({ 
    name: 'operations-release-detail', 
    params: { id: release.id } 
  })
}

const downloadDocuments = async (release: any) => {
  try {
    // TODO: Implement download functionality
    await Swal.fire({
      icon: 'info',
      title: 'Descargando',
      text: 'Preparando documentos para descarga...'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron descargar los documentos'
    })
  }
}

const printCertificate = async (release: any) => {
  try {
    // TODO: Implement print functionality
    await Swal.fire({
      icon: 'info',
      title: 'Imprimiendo',
      text: 'Generando certificado de liberación...'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo imprimir el certificado'
    })
  }
}

const exportHistory = async () => {
  try {
    // TODO: Implement export functionality
    await Swal.fire({
      icon: 'success',
      title: 'Exportando',
      text: 'El archivo se está generando y será descargado automáticamente'
    })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo exportar el historial'
    })
  }
}

// Formatting methods
const formatReleaseType = (type: string) => {
  const types: Record<string, string> = {
    'sentence_completion': 'Cumplimiento',
    'parole': 'Condicional',
    'bail': 'Fianza',
    'court_order': 'Orden Judicial',
    'amnesty': 'Amnistía'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
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

const formatPrisonTime = (time: string) => {
  return time
}

const getReleaseTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'sentence_completion': 'badge-light-success',
    'parole': 'badge-light-warning',
    'bail': 'badge-light-info',
    'court_order': 'badge-light-primary',
    'amnesty': 'badge-light-secondary'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  loadReleaseHistory(1)
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadCenters()
  loadReleaseHistory()
})
</script>