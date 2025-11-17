<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.movements.detail.title') }}</h3>
        <p class="text-muted">{{ $t('operations.movements.detail.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link 
          :to="{ name: 'operations-movements' }"
          class="btn btn-light-primary btn-sm me-2"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver al listado
        </router-link>
        <button 
          v-if="canPrint"
          @click="printMovement"
          class="btn btn-light-success btn-sm"
        >
          <i class="fas fa-print me-2"></i>
          Imprimir
        </button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="movement">
        <!-- Movement Status Alert -->
        <div v-if="movement.status === 'in_transit'" class="alert alert-warning d-flex align-items-center mb-6">
          <i class="fas fa-truck fa-2x me-3"></i>
          <div>
            <h5 class="mb-1">Movimiento en Tránsito</h5>
            <p class="mb-0">Este movimiento se encuentra actualmente en proceso de ejecución.</p>
          </div>
        </div>

        <!-- Movement Information -->
        <div class="row mb-8">
          <div class="col-md-6">
            <h5 class="mb-4">Información del Movimiento</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">ID Movimiento:</td>
                  <td class="fw-bold">#{{ movement.id }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Tipo:</td>
                  <td>
                    <span class="badge" :class="getMovementTypeBadgeClass(movement.movement_type)">
                      {{ formatMovementType(movement.movement_type) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">Estado:</td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(movement.status)">
                      {{ formatStatus(movement.status) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">Fecha Programada:</td>
                  <td class="fw-bold">{{ formatDate(movement.movement_date) }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Hora Programada:</td>
                  <td class="fw-bold">{{ formatTime(movement.movement_time) }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Motivo:</td>
                  <td>{{ movement.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-md-6">
            <h5 class="mb-4">Información del PPL</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">Nombre:</td>
                  <td class="fw-bold">{{ movement.inmate.full_name }}</td>
                </tr>
                <tr>
                  <td class="text-muted">DPI:</td>
                  <td class="fw-bold">{{ movement.inmate.document_number }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Código:</td>
                  <td class="fw-bold">{{ movement.inmate.code }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Clasificación:</td>
                  <td>
                    <span class="badge badge-light-warning">
                      {{ movement.inmate.security_classification }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">Estado Legal:</td>
                  <td>{{ movement.inmate.legal_status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Origin and Destination -->
        <div class="separator my-8"></div>
        <div class="row mb-8">
          <div class="col-md-6">
            <h5 class="mb-4">
              <i class="fas fa-map-marker-alt text-danger me-2"></i>
              Origen
            </h5>
            <div class="card bg-light-danger">
              <div class="card-body">
                <h6 class="mb-3">{{ movement.origin.center }}</h6>
                <p class="mb-1"><strong>Sector:</strong> {{ movement.origin.sector || 'N/A' }}</p>
                <p class="mb-1"><strong>Celda:</strong> {{ movement.origin.cell || 'N/A' }}</p>
                <p class="mb-0 text-muted fs-7">
                  <strong>Salida:</strong> {{ formatDateTime(movement.departure_datetime) || 'Pendiente' }}
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <h5 class="mb-4">
              <i class="fas fa-map-marker-alt text-success me-2"></i>
              Destino
            </h5>
            <div class="card bg-light-success">
              <div class="card-body">
                <h6 class="mb-3">{{ movement.destination.center }}</h6>
                <p class="mb-1"><strong>Sector:</strong> {{ movement.destination.sector || 'N/A' }}</p>
                <p class="mb-1"><strong>Celda:</strong> {{ movement.destination.cell || 'N/A' }}</p>
                <p class="mb-0 text-muted fs-7">
                  <strong>Llegada:</strong> {{ formatDateTime(movement.arrival_datetime) || 'Pendiente' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Authorization and Personnel -->
        <div class="separator my-8"></div>
        <div class="row mb-8">
          <div class="col-md-6">
            <h5 class="mb-4">Autorización</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">Autorizado por:</td>
                  <td class="fw-bold">{{ movement.authorized_by || 'N/A' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Fecha Autorización:</td>
                  <td>{{ formatDate(movement.authorization_date) || 'N/A' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Documento:</td>
                  <td>
                    <a v-if="movement.authorization_document" href="#" class="text-primary">
                      <i class="fas fa-file-pdf me-1"></i>
                      Ver documento
                    </a>
                    <span v-else class="text-muted">Sin documento</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-md-6">
            <h5 class="mb-4">Personal Asignado</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">Responsable:</td>
                  <td class="fw-bold">{{ movement.responsible_officer || 'Por asignar' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Escolta:</td>
                  <td>{{ movement.escort_officers?.join(', ') || 'Por asignar' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Vehículo:</td>
                  <td>{{ movement.vehicle || 'Por asignar' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Movement Log -->
        <div class="separator my-8"></div>
        <h5 class="mb-4">Bitácora del Movimiento</h5>
        <div class="timeline">
          <div 
            v-for="(log, index) in movement.logs" 
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-line"></div>
            <div class="timeline-icon">
              <i 
                class="fas fa-circle"
                :class="getLogIconClass(log.type)"
              ></i>
            </div>
            <div class="timeline-content mb-10 mt-n1">
              <div class="pe-3 mb-5">
                <div class="fs-5 fw-semibold mb-2">{{ log.title }}</div>
                <div class="text-muted fs-7">
                  {{ formatDateTime(log.datetime) }} - {{ log.user }}
                </div>
                <div class="mt-2 fs-6">{{ log.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end mt-10">
          <button 
            v-if="canCancel && movement.status === 'pending'"
            @click="cancelMovement"
            class="btn btn-danger me-2"
          >
            <i class="fas fa-times me-2"></i>
            Cancelar Movimiento
          </button>
          <button 
            v-if="canComplete && movement.status === 'in_transit'"
            @click="completeMovement"
            class="btn btn-success"
          >
            <i class="fas fa-check me-2"></i>
            Completar Movimiento
          </button>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-muted">No se encontró la información del movimiento.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Data
const loading = ref(false)
const movement = ref<any>(null)

// Computed
const canPrint = computed(() => {
  return movement.value && ['completed', 'in_transit'].includes(movement.value.status)
})

const canCancel = computed(() => {
  return authStore.hasPermission('operations.movements_cancel')
})

const canComplete = computed(() => {
  return authStore.hasPermission('operations.movements_complete')
})

// Methods
const loadMovement = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // Mock data for now
    movement.value = {
      id: route.params.id,
      movement_type: 'transfer',
      status: 'in_transit',
      movement_date: '2024-01-16',
      movement_time: '10:00:00',
      reason: 'Traslado por sobrepoblación en centro de origen',
      inmate: {
        full_name: 'Juan Pérez García',
        document_number: '1234567890101',
        code: 'PPL-2024-001',
        security_classification: 'Media',
        legal_status: 'Sentenciado'
      },
      origin: {
        center: 'Centro Preventivo Zona 18',
        sector: 'Sector A',
        cell: 'Celda A-101'
      },
      destination: {
        center: 'Granja Penal Canadá',
        sector: 'Sector B',
        cell: 'Celda B-205'
      },
      departure_datetime: '2024-01-16 10:15:00',
      arrival_datetime: null,
      authorized_by: 'Director del Centro',
      authorization_date: '2024-01-15',
      authorization_document: 'auth_doc_001.pdf',
      responsible_officer: 'Cap. Juan Martínez',
      escort_officers: ['Agt. Carlos López', 'Agt. María García'],
      vehicle: 'Unidad T-102',
      logs: [
        {
          type: 'created',
          title: 'Movimiento creado',
          datetime: '2024-01-15 14:30:00',
          user: 'Admin Sistema',
          description: 'Se registró el movimiento en el sistema'
        },
        {
          type: 'authorized',
          title: 'Movimiento autorizado',
          datetime: '2024-01-15 16:00:00',
          user: 'Director Centro',
          description: 'Se autorizó el traslado del PPL'
        },
        {
          type: 'started',
          title: 'Movimiento iniciado',
          datetime: '2024-01-16 10:15:00',
          user: 'Cap. Juan Martínez',
          description: 'PPL salió del centro de origen'
        }
      ]
    }
  } catch (error) {
    console.error('Error loading movement:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la información del movimiento'
    })
  } finally {
    loading.value = false
  }
}

const printMovement = async () => {
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

const cancelMovement = async () => {
  const result = await Swal.fire({
    title: '¿Cancelar movimiento?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Movimiento cancelado',
        text: 'El movimiento ha sido cancelado exitosamente'
      })
      router.push({ name: 'operations-movements' })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar el movimiento'
      })
    }
  }
}

const completeMovement = async () => {
  const result = await Swal.fire({
    title: 'Completar movimiento',
    text: '¿Confirma que el PPL ha llegado al destino?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, completar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      // TODO: Implement API call
      await Swal.fire({
        icon: 'success',
        title: 'Movimiento completado',
        text: 'El movimiento ha sido completado exitosamente'
      })
      loadMovement()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo completar el movimiento'
      })
    }
  }
}

// Formatting methods
const formatMovementType = (type: string) => {
  const types: Record<string, string> = {
    'internal': 'Movimiento Interno',
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
  if (!date) return null
  return new Date(date).toLocaleDateString('es-GT')
}

const formatTime = (time: string) => {
  if (!time) return null
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (datetime: string) => {
  if (!datetime) return null
  return new Date(datetime).toLocaleString('es-GT')
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

const getLogIconClass = (type: string) => {
  const classes: Record<string, string> = {
    'created': 'text-primary',
    'authorized': 'text-success',
    'started': 'text-info',
    'completed': 'text-success',
    'cancelled': 'text-danger'
  }
  return classes[type] || 'text-secondary'
}

// Lifecycle
onMounted(() => {
  loadMovement()
})
</script>