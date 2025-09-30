<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.counts.discrepancies.title') }}</h3>
        <p class="text-muted">{{ $t('operations.counts.discrepancies.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-counts' }"
          class="btn btn-light-primary btn-sm"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver al conteo
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <!-- Alert for Active Discrepancies -->
      <div v-if="activeDiscrepancies > 0" class="alert alert-danger d-flex align-items-center mb-6">
        <span class="svg-icon svg-icon-2hx svg-icon-danger me-4">
          <i class="fas fa-exclamation-triangle fa-2x"></i>
        </span>
        <div class="d-flex flex-column">
          <h4 class="mb-1 text-danger">¡Atención! Discrepancias Activas</h4>
          <span>Hay {{ activeDiscrepancies }} discrepancias pendientes de resolución.</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-6">
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="investigating">En Investigación</option>
            <option value="resolved">Resuelto</option>
            <option value="false_alarm">Falsa Alarma</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tipo de Discrepancia</label>
          <select v-model="filters.discrepancy_type" class="form-select">
            <option value="">Todos</option>
            <option value="missing">Faltante</option>
            <option value="extra">Sobrante</option>
            <option value="location_mismatch">Ubicación Incorrecta</option>
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
          <label class="form-label">Fecha</label>
          <input 
            type="date" 
            v-model="filters.date"
            class="form-control"
          >
        </div>
      </div>

      <!-- Discrepancies Table -->
      <div class="table-responsive">
        <table class="table table-rounded table-striped border gy-7 gs-7">
          <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>ID</th>
              <th>Fecha/Hora</th>
              <th>Centro/Sector</th>
              <th>Tipo</th>
              <th>PPL Involucrado</th>
              <th>Estado</th>
              <th>Tiempo Transcurrido</th>
              <th>Asignado a</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="discrepancy in discrepancies" :key="discrepancy.id">
              <td class="fw-bold">#{{ discrepancy.id }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ formatDate(discrepancy.detected_at) }}</span>
                  <span class="text-muted fs-7">{{ formatTime(discrepancy.detected_at) }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">{{ discrepancy.center.name }}</span>
                  <span class="text-muted fs-7">{{ discrepancy.sector?.name || 'General' }}</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="getTypeBadgeClass(discrepancy.discrepancy_type)">
                  {{ formatDiscrepancyType(discrepancy.discrepancy_type) }}
                </span>
              </td>
              <td>
                <div v-if="discrepancy.inmate" class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">{{ discrepancy.inmate.full_name }}</span>
                  <span class="text-muted fs-7">{{ discrepancy.inmate.document_number }}</span>
                </div>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(discrepancy.status)">
                  {{ formatStatus(discrepancy.status) }}
                </span>
              </td>
              <td>
                <span :class="getTimeElapsedClass(discrepancy.hours_elapsed)">
                  {{ formatTimeElapsed(discrepancy.hours_elapsed) }}
                </span>
              </td>
              <td>
                <span v-if="discrepancy.assigned_to">
                  {{ discrepancy.assigned_to.name }}
                </span>
                <span v-else class="text-muted">Sin asignar</span>
              </td>
              <td>
                <span class="badge" :class="getPriorityBadgeClass(discrepancy.priority)">
                  {{ formatPriority(discrepancy.priority) }}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    @click="viewDetails(discrepancy)"
                    class="btn btn-light btn-sm"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="canManage && discrepancy.status === 'pending'"
                    @click="assignDiscrepancy(discrepancy)"
                    class="btn btn-primary btn-sm"
                    title="Asignar"
                  >
                    <i class="fas fa-user-plus"></i>
                  </button>
                  <button 
                    v-if="canManage && discrepancy.status === 'investigating'"
                    @click="resolveDiscrepancy(discrepancy)"
                    class="btn btn-success btn-sm"
                    title="Resolver"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="discrepancies.length === 0" class="text-center py-10">
        <i class="fas fa-check-circle fa-4x text-success mb-4"></i>
        <h4 class="text-muted">No hay discrepancias registradas</h4>
        <p class="text-muted">Todos los conteos coinciden correctamente.</p>
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
const discrepancies = ref<any[]>([])
const centers = ref<any[]>([])
const activeDiscrepancies = ref(0)

const filters = reactive({
  status: '',
  discrepancy_type: '',
  center_id: '',
  date: ''
})

// Computed
const canManage = computed(() => {
  return authStore.hasPermission('operations.counts.manage_discrepancies')
})

// Methods
const loadDiscrepancies = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    discrepancies.value = [
      {
        id: 101,
        detected_at: '2024-01-15 14:30:00',
        center: { id: 1, name: 'Centro Preventivo Zona 18' },
        sector: { id: 1, name: 'Sector A' },
        discrepancy_type: 'missing',
        inmate: {
          full_name: 'Juan Pérez García',
          document_number: '1234567890101'
        },
        status: 'pending',
        hours_elapsed: 2,
        assigned_to: null,
        priority: 'high'
      },
      {
        id: 102,
        detected_at: '2024-01-15 06:15:00',
        center: { id: 1, name: 'Centro Preventivo Zona 18' },
        sector: { id: 2, name: 'Sector B' },
        discrepancy_type: 'location_mismatch',
        inmate: {
          full_name: 'María González López',
          document_number: '9876543210101'
        },
        status: 'investigating',
        hours_elapsed: 10,
        assigned_to: { name: 'Carlos Rodríguez' },
        priority: 'medium'
      }
    ]
    
    activeDiscrepancies.value = discrepancies.value.filter(d => 
      ['pending', 'investigating'].includes(d.status)
    ).length
  } catch (error) {
    console.error('Error loading discrepancies:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las discrepancias'
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

const viewDetails = async (discrepancy: any) => {
  // TODO: Implement view details modal or navigation
  await Swal.fire({
    title: `Discrepancia #${discrepancy.id}`,
    html: `
      <div class="text-start">
        <p><strong>Tipo:</strong> ${formatDiscrepancyType(discrepancy.discrepancy_type)}</p>
        <p><strong>PPL:</strong> ${discrepancy.inmate?.full_name || 'N/A'}</p>
        <p><strong>Centro:</strong> ${discrepancy.center.name}</p>
        <p><strong>Sector:</strong> ${discrepancy.sector?.name || 'General'}</p>
        <p><strong>Estado:</strong> ${formatStatus(discrepancy.status)}</p>
        <p><strong>Detectado:</strong> ${formatDateTime(discrepancy.detected_at)}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar'
  })
}

const assignDiscrepancy = async (discrepancy: any) => {
  // TODO: Implement assign functionality
  const result = await Swal.fire({
    title: 'Asignar Discrepancia',
    input: 'select',
    inputOptions: {
      '1': 'Carlos Rodríguez',
      '2': 'María López',
      '3': 'Juan Martínez'
    },
    inputPlaceholder: 'Seleccionar responsable',
    showCancelButton: true,
    confirmButtonText: 'Asignar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    await Swal.fire({
      icon: 'success',
      title: 'Asignado',
      text: 'La discrepancia ha sido asignada exitosamente'
    })
    loadDiscrepancies()
  }
}

const resolveDiscrepancy = async (discrepancy: any) => {
  const result = await Swal.fire({
    title: 'Resolver Discrepancia',
    input: 'textarea',
    inputLabel: 'Descripción de la resolución',
    inputPlaceholder: 'Ingrese los detalles de cómo se resolvió la discrepancia...',
    showCancelButton: true,
    confirmButtonText: 'Resolver',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    await Swal.fire({
      icon: 'success',
      title: 'Resuelta',
      text: 'La discrepancia ha sido resuelta exitosamente'
    })
    loadDiscrepancies()
  }
}

// Formatting methods
const formatDate = (datetime: string) => {
  return new Date(datetime).toLocaleDateString('es-GT')
}

const formatTime = (datetime: string) => {
  return new Date(datetime).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('es-GT')
}

const formatDiscrepancyType = (type: string) => {
  const types: Record<string, string> = {
    'missing': 'Faltante',
    'extra': 'Sobrante',
    'location_mismatch': 'Ubicación Incorrecta'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'pending': 'Pendiente',
    'investigating': 'En Investigación',
    'resolved': 'Resuelto',
    'false_alarm': 'Falsa Alarma'
  }
  return statuses[status] || status
}

const formatPriority = (priority: string) => {
  const priorities: Record<string, string> = {
    'high': 'Alta',
    'medium': 'Media',
    'low': 'Baja'
  }
  return priorities[priority] || priority
}

const formatTimeElapsed = (hours: number) => {
  if (hours < 1) return 'Menos de 1 hora'
  if (hours === 1) return '1 hora'
  if (hours < 24) return `${hours} horas`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? 'día' : 'días'}`
}

// Style classes
const getTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'missing': 'badge-light-danger',
    'extra': 'badge-light-warning',
    'location_mismatch': 'badge-light-info'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'badge-light-danger',
    'investigating': 'badge-light-warning',
    'resolved': 'badge-light-success',
    'false_alarm': 'badge-light-secondary'
  }
  return classes[status] || 'badge-light-secondary'
}

const getPriorityBadgeClass = (priority: string) => {
  const classes: Record<string, string> = {
    'high': 'badge-light-danger',
    'medium': 'badge-light-warning',
    'low': 'badge-light-info'
  }
  return classes[priority] || 'badge-light-secondary'
}

const getTimeElapsedClass = (hours: number) => {
  if (hours >= 24) return 'text-danger fw-bold'
  if (hours >= 12) return 'text-warning fw-bold'
  return 'text-muted'
}

// Watchers
watch(filters, () => {
  loadDiscrepancies()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadCenters()
  loadDiscrepancies()
})
</script>