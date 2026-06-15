<template>
  <div class="card print-area">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.movements.detail.title') }}</h3>
        <p class="text-muted">{{ $t('operations.movements.detail.subtitle') }}</p>
      </div>
      <div class="card-toolbar no-print">
        <router-link
          :to="{ name: 'operations-movements' }"
          class="btn btn-light-primary btn-sm me-2"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Volver al listado
        </router-link>
        <button
          v-if="movement"
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
        <div v-if="meta.is_overdue" class="alert alert-danger d-flex align-items-center mb-6">
          <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
          <div>
            <h5 class="mb-1">Movimiento Atrasado</h5>
            <p class="mb-0">El retorno esperado ya venció y el PPL aún no ha regresado.</p>
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
                  <td class="text-muted">Salida:</td>
                  <td class="fw-bold">{{ formatDateTime(movement.departure_time) || '-' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Retorno Esperado:</td>
                  <td class="fw-bold">{{ formatDateTime(movement.expected_return_time) || 'No definido' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Retorno Real:</td>
                  <td class="fw-bold">{{ formatDateTime(movement.actual_return_time) || 'Pendiente' }}</td>
                </tr>
                <tr v-if="meta.duration_minutes !== null">
                  <td class="text-muted">Duración:</td>
                  <td class="fw-bold">{{ formatDuration(meta.duration_minutes) }}</td>
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
                  <td class="fw-bold">{{ movement.inmate?.full_name || '-' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">DPI:</td>
                  <td class="fw-bold">{{ movement.inmate?.document_number || 'Sin documento' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Número de Registro:</td>
                  <td class="fw-bold">{{ movement.inmate?.inmate_number || '-' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Ubicación Actual:</td>
                  <td>{{ movement.inmate?.current_location || '-' }}</td>
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
                <h6 class="mb-3">{{ movement.from_location || '-' }}</h6>
                <p class="mb-1"><strong>Sector:</strong> {{ movement.from_sector?.name || 'N/A' }}</p>
                <p class="mb-0 text-muted fs-7">
                  <strong>Salida:</strong> {{ formatDateTime(movement.departure_time) || 'Pendiente' }}
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
                <h6 class="mb-3">{{ movement.to_location || '-' }}</h6>
                <p class="mb-1"><strong>Sector:</strong> {{ movement.to_sector?.name || 'N/A' }}</p>
                <p class="mb-0 text-muted fs-7">
                  <strong>Retorno Esperado:</strong> {{ formatDateTime(movement.expected_return_time) || 'No definido' }}
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
                  <td class="fw-bold">{{ userName(movement.authorized_by) || 'N/A' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Registrado por:</td>
                  <td class="fw-bold">{{ userName(movement.registered_by) || 'N/A' }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Fecha de Registro:</td>
                  <td>{{ formatDateTime(movement.created_at) || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-md-6">
            <h5 class="mb-4">Escolta</h5>
            <table class="table table-flush">
              <tbody>
                <tr>
                  <td class="text-muted">Requiere escolta:</td>
                  <td>
                    <span v-if="movement.requires_escort" class="badge badge-light-warning">
                      <i class="fas fa-shield-alt me-1"></i>Sí
                    </span>
                    <span v-else class="text-muted">No</span>
                  </td>
                </tr>
                <tr v-if="movement.requires_escort">
                  <td class="text-muted">Oficial de escolta:</td>
                  <td class="fw-bold">{{ userName(movement.escort_officer) || 'Por asignar' }}</td>
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
            v-for="(log, index) in movementLogs"
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-line"></div>
            <div class="timeline-icon">
              <i
                class="fas fa-circle"
                :class="log.iconClass"
              ></i>
            </div>
            <div class="timeline-content mb-10 mt-n1">
              <div class="pe-3 mb-5">
                <div class="fs-5 fw-semibold mb-2">{{ log.title }}</div>
                <div v-if="log.datetime" class="text-muted fs-7">
                  {{ formatDateTime(log.datetime) }}<span v-if="log.user"> - {{ log.user }}</span>
                </div>
                <div v-if="log.description" class="mt-2 fs-6">{{ log.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Observations -->
        <template v-if="movement.observations">
          <h5 class="mb-4">Observaciones</h5>
          <p class="border rounded p-4 bg-light observations">{{ movement.observations }}</p>
        </template>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end mt-10 no-print">
          <button
            v-if="movement.status === 'scheduled'"
            @click="startMovement"
            class="btn btn-success me-2"
          >
            <i class="fas fa-play me-2"></i>
            Iniciar Movimiento
          </button>
          <button
            v-if="canCancel && ['scheduled', 'in_transit'].includes(movement.status)"
            @click="cancelMovement"
            class="btn btn-danger me-2"
          >
            <i class="fas fa-times me-2"></i>
            Cancelar Movimiento
          </button>
          <button
            v-if="canComplete && ['at_destination', 'returning'].includes(movement.status)"
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
import { movementsApi } from '@/services/api/operations'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Data
const loading = ref(false)
const movement = ref<any>(null)
const meta = ref<any>({
  is_active: false,
  is_overdue: false,
  duration_minutes: null,
  delay_minutes: null
})

// Computed
const canCancel = computed(() => {
  return authStore.hasPermission('operations.movements_cancel')
})

const canComplete = computed(() => {
  return authStore.hasPermission('operations.movements_complete')
})

const movementLogs = computed(() => {
  if (!movement.value) return []
  const m = movement.value
  const logs: any[] = [
    {
      title: 'Movimiento registrado',
      datetime: m.created_at,
      user: userName(m.registered_by),
      description: 'Se registró el movimiento en el sistema',
      iconClass: 'text-primary'
    }
  ]

  if (m.status !== 'scheduled' && m.status !== 'cancelled') {
    logs.push({
      title: 'Movimiento iniciado',
      datetime: m.departure_time,
      user: null,
      description: 'El PPL salió hacia el destino',
      iconClass: 'text-info'
    })
  }

  if (m.actual_return_time) {
    logs.push({
      title: 'Movimiento completado',
      datetime: m.actual_return_time,
      user: null,
      description: 'El PPL retornó a su ubicación de origen',
      iconClass: 'text-success'
    })
  }

  if (m.status === 'cancelled') {
    logs.push({
      title: 'Movimiento cancelado',
      datetime: m.updated_at,
      user: null,
      description: null,
      iconClass: 'text-danger'
    })
  }

  return logs
})

// Methods
const loadMovement = async () => {
  loading.value = true
  try {
    const response = await movementsApi.getById(route.params.id as string)
    const payload = response.data?.data ?? {}
    movement.value = payload.movement || null
    meta.value = {
      is_active: payload.is_active ?? false,
      is_overdue: payload.is_overdue ?? false,
      duration_minutes: payload.duration_minutes ?? null,
      delay_minutes: payload.delay_minutes ?? null
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

const printMovement = () => {
  window.print()
}

const startMovement = async () => {
  const result = await Swal.fire({
    title: 'Iniciar movimiento',
    text: '¿Confirma la salida del PPL hacia el destino?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, iniciar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await movementsApi.start(movement.value.id)
      await Swal.fire({
        icon: 'success',
        title: 'Movimiento iniciado',
        text: 'El movimiento ha sido iniciado exitosamente'
      })
      loadMovement()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo iniciar el movimiento'
      })
    }
  }
}

const cancelMovement = async () => {
  const result = await Swal.fire({
    title: '¿Cancelar movimiento?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    input: 'textarea',
    inputLabel: 'Razón de cancelación',
    inputPlaceholder: 'Explique por qué se cancela el movimiento...',
    inputValidator: (value) => (!value ? 'La razón de cancelación es requerida' : null),
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed && result.value) {
    try {
      await movementsApi.updateStatus(movement.value.id, {
        status: 'cancelled',
        cancellation_reason: result.value
      })
      await Swal.fire({
        icon: 'success',
        title: 'Movimiento cancelado',
        text: 'El movimiento ha sido cancelado exitosamente'
      })
      loadMovement()
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
    text: '¿Confirma que el PPL retornó a su ubicación de origen?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, completar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await movementsApi.updateStatus(movement.value.id, { status: 'completed' })
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

// Helpers
const userName = (user: any) => {
  if (!user || typeof user !== 'object') return null
  return user.name || user.full_name || [user.first_name, user.last_name].filter(Boolean).join(' ') || null
}

// Formatting methods
const formatMovementType = (type: string) => {
  const types: Record<string, string> = {
    medical: 'Médico',
    education: 'Educación',
    work: 'Trabajo',
    visit: 'Visita',
    court: 'Tribunal',
    administrative: 'Administrativo',
    religious: 'Religioso',
    sports: 'Deportes',
    emergency: 'Emergencia',
    transfer: 'Traslado'
  }
  return types[type] || type
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    scheduled: 'Programado',
    in_transit: 'En Tránsito',
    at_destination: 'En Destino',
    returning: 'Regresando',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
  return statuses[status] || status
}

const formatDateTime = (datetime: string) => {
  if (!datetime) return null
  const date = new Date(datetime)
  return `${date.toLocaleDateString('es-GT')} ${date.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

const formatDuration = (minutes: number | null) => {
  if (minutes === null || minutes === undefined) return '-'
  const total = Math.round(minutes)
  const hours = Math.floor(total / 60)
  const mins = total % 60
  return `${hours}h ${mins}m`
}

const getMovementTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    medical: 'badge-light-success',
    education: 'badge-light-info',
    work: 'badge-light-warning',
    visit: 'badge-light-primary',
    court: 'badge-light-dark',
    administrative: 'badge-light-secondary',
    religious: 'badge-light-primary',
    sports: 'badge-light-success',
    emergency: 'badge-light-danger',
    transfer: 'badge-light-info'
  }
  return classes[type] || 'badge-light-secondary'
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'badge-light-secondary',
    in_transit: 'badge-light-primary',
    at_destination: 'badge-light-warning',
    returning: 'badge-light-info',
    completed: 'badge-light-success',
    cancelled: 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

// Lifecycle
onMounted(() => {
  loadMovement()
})
</script>

<style scoped>
.observations {
  white-space: pre-line;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-area {
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
