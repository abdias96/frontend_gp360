<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.releases.title') }}</h3>
        <p class="text-muted">{{ $t('operations.releases.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-release-plans' }"
          class="btn btn-light-warning btn-sm me-2"
        >
          <i class="fas fa-calendar-alt me-2"></i>
          Planificación
        </router-link>
        <button 
          @click="showNewReleaseModal = true"
          class="btn btn-primary btn-sm"
          v-if="canCreate"
        >
          <i class="fas fa-plus me-2"></i>
          Nueva Liberación
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Today's Releases Alert -->
      <div v-if="todayReleases > 0" class="alert alert-info d-flex align-items-center mb-6">
        <i class="fas fa-info-circle fa-2x me-3"></i>
        <div>
          <h5 class="mb-1">Liberaciones del Día</h5>
          <p class="mb-0">Hay {{ todayReleases }} liberaciones programadas para hoy.</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Tipo de Liberación</label>
          <select v-model="filters.release_type" class="form-select">
            <option value="">Todos</option>
            <option value="sentence_completion">Cumplimiento de Condena</option>
            <option value="parole">Libertad Condicional</option>
            <option value="bail">Fianza</option>
            <option value="court_order">Orden Judicial</option>
            <option value="amnesty">Amnistía</option>
            <option value="transfer">Traslado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="scheduled">Programado</option>
            <option value="in_process">En Proceso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
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
            placeholder="Nombre o DPI..."
          >
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-6">
        <div class="col-md-3">
          <div class="card bg-light-warning">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="fas fa-clock fa-2x text-warning me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.scheduled }}</div>
                  <div class="fs-7 text-muted">Programadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-primary">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="fas fa-spinner fa-2x text-primary me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.in_process }}</div>
                  <div class="fs-7 text-muted">En Proceso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="fas fa-check-circle fa-2x text-success me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.completed_today }}</div>
                  <div class="fs-7 text-muted">Completadas Hoy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-light-info">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="fas fa-calendar-check fa-2x text-info me-3"></i>
                <div>
                  <div class="fs-4 fw-bold">{{ statistics.this_week }}</div>
                  <div class="fs-7 text-muted">Esta Semana</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Releases Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>PPL</th>
              <th>Tipo de Liberación</th>
              <th>Fecha Programada</th>
              <th>Estado</th>
              <th>Progreso</th>
              <th>Documentos</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="release in releases" :key="release.id">
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ release.inmate.full_name }}</span>
                  <span class="text-muted fs-7">{{ release.inmate.document_number }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getReleaseTypeBadgeClass(release.release_type)">
                  {{ formatReleaseType(release.release_type) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ formatDate(release.scheduled_date) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(release.scheduled_time) }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(release.status)">
                  {{ formatStatus(release.status) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <div class="progress h-6px mb-1">
                    <div 
                      class="progress-bar bg-primary"
                      :style="`width: ${release.completion_percentage}%`"
                    ></div>
                  </div>
                  <span class="fs-7 text-muted">
                    {{ release.completed_steps }}/{{ release.total_steps }} pasos
                  </span>
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <span v-if="release.documents_complete" class="badge badge-light-success">
                    <i class="fas fa-check me-1"></i>
                    Completos
                  </span>
                  <span v-else class="badge badge-light-warning">
                    <i class="fas fa-exclamation me-1"></i>
                    Pendientes
                  </span>
                </div>
              </td>
              <td>{{ release.assigned_to?.name || 'Sin asignar' }}</td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewRelease(release)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="canProcess && release.status === 'scheduled'"
                    @click="startProcess(release)"
                    class="btn btn-primary btn-sm"
                    title="Iniciar proceso"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    v-if="canProcess && release.status === 'in_process'"
                    @click="continueProcess(release)"
                    class="btn btn-warning btn-sm"
                    title="Continuar proceso"
                  >
                    <i class="fas fa-forward"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="releases.length === 0" class="text-center py-10">
        <i class="fas fa-door-open fa-4x text-muted mb-4"></i>
        <h4 class="text-muted">No hay liberaciones registradas</h4>
        <p class="text-muted">No se encontraron liberaciones con los filtros aplicados.</p>
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
const showNewReleaseModal = ref(false)
const releases = ref<any[]>([])
const todayReleases = ref(0)

const filters = reactive({
  release_type: '',
  status: '',
  date: '',
  search: ''
})

const statistics = ref({
  scheduled: 0,
  in_process: 0,
  completed_today: 0,
  this_week: 0
})

// Computed
const canCreate = computed(() => {
  return authStore.hasPermission('operations.releases.create')
})

const canProcess = computed(() => {
  return authStore.hasPermission('operations.releases.process')
})

// Methods
const loadReleases = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    releases.value = [
      {
        id: 1,
        inmate: {
          full_name: 'Juan Pérez García',
          document_number: '1234567890101'
        },
        release_type: 'sentence_completion',
        scheduled_date: '2024-01-16',
        scheduled_time: '08:00:00',
        status: 'scheduled',
        completion_percentage: 60,
        completed_steps: 3,
        total_steps: 5,
        documents_complete: false,
        assigned_to: { name: 'María López' }
      },
      {
        id: 2,
        inmate: {
          full_name: 'Carlos Rodríguez',
          document_number: '2345678901234'
        },
        release_type: 'parole',
        scheduled_date: '2024-01-16',
        scheduled_time: '10:00:00',
        status: 'in_process',
        completion_percentage: 80,
        completed_steps: 4,
        total_steps: 5,
        documents_complete: true,
        assigned_to: { name: 'Juan Martínez' }
      }
    ]
    
    todayReleases.value = 3
    
    statistics.value = {
      scheduled: 8,
      in_process: 2,
      completed_today: 5,
      this_week: 15
    }
  } catch (error) {
    console.error('Error loading releases:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las liberaciones'
    })
  } finally {
    loading.value = false
  }
}

const viewRelease = (release: any) => {
  router.push({ 
    name: 'operations-release-detail', 
    params: { id: release.id } 
  })
}

const startProcess = async (release: any) => {
  const result = await Swal.fire({
    title: 'Iniciar proceso de liberación',
    text: `¿Desea iniciar el proceso de liberación para ${release.inmate.full_name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, iniciar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Proceso iniciado',
        text: 'El proceso de liberación ha sido iniciado'
      })
      loadReleases()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo iniciar el proceso'
      })
    }
  }
}

const continueProcess = (release: any) => {
  router.push({ 
    name: 'operations-release-process', 
    params: { id: release.id } 
  })
}

// Formatting methods
const formatReleaseType = (type: string) => {
  const types: Record<string, string> = {
    'sentence_completion': 'Cumplimiento',
    'parole': 'Condicional',
    'bail': 'Fianza',
    'court_order': 'Orden Judicial',
    'amnesty': 'Amnistía',
    'transfer': 'Traslado'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'scheduled': 'Programado',
    'in_process': 'En Proceso',
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

const getReleaseTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'sentence_completion': 'badge-light-success',
    'parole': 'badge-light-warning',
    'bail': 'badge-light-info',
    'court_order': 'badge-light-primary',
    'amnesty': 'badge-light-secondary',
    'transfer': 'badge-light-dark'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'scheduled': 'badge-light-warning',
    'in_process': 'badge-light-primary',
    'completed': 'badge-light-success',
    'cancelled': 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

// Watchers
watch(filters, () => {
  loadReleases()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadReleases()
})
</script>