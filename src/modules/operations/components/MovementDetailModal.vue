<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-route text-primary me-2"></i>
            Detalle del Movimiento #{{ movement?.id }}
          </h3>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <div class="modal-body">
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <template v-else-if="detail">
            <!-- Status header -->
            <div class="d-flex align-items-center flex-wrap gap-3 mb-6">
              <span class="badge fs-7" :class="getMovementTypeBadgeClass(detail.movement_type)">
                {{ formatMovementType(detail.movement_type) }}
              </span>
              <span class="badge fs-7" :class="getStatusBadgeClass(detail.status)">
                {{ formatStatus(detail.status) }}
              </span>
              <span v-if="meta.is_overdue" class="badge badge-light-danger fs-7">
                <i class="fas fa-exclamation-triangle me-1"></i>
                Atrasado{{ meta.delay_minutes ? ` ${meta.delay_minutes} min` : '' }}
              </span>
            </div>

            <!-- PPL -->
            <div class="card card-flush bg-light mb-6">
              <div class="card-body py-4">
                <h6 class="mb-2">PPL</h6>
                <div class="fw-bold fs-5">{{ detail.inmate?.full_name || '-' }}</div>
                <div class="text-muted">
                  DPI: {{ detail.inmate?.document_number || 'Sin documento' }}
                  <span v-if="detail.inmate?.inmate_number"> | Registro: {{ detail.inmate.inmate_number }}</span>
                </div>
              </div>
            </div>

            <!-- Origin / Destination -->
            <div class="row mb-6">
              <div class="col-md-6">
                <h6 class="mb-3">
                  <i class="fas fa-map-marker-alt text-danger me-2"></i>
                  Origen
                </h6>
                <div class="border rounded p-4 h-100">
                  <div class="fw-bold">{{ detail.from_location || '-' }}</div>
                  <div v-if="detail.from_sector" class="text-muted fs-7">
                    Sector: {{ detail.from_sector.name }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6 class="mb-3">
                  <i class="fas fa-map-marker-alt text-success me-2"></i>
                  Destino
                </h6>
                <div class="border rounded p-4 h-100">
                  <div class="fw-bold">{{ detail.to_location || '-' }}</div>
                  <div v-if="detail.to_sector" class="text-muted fs-7">
                    Sector: {{ detail.to_sector.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Times -->
            <h6 class="mb-3">Tiempos</h6>
            <div class="table-responsive mb-6">
              <table class="table table-row-bordered align-middle mb-0">
                <tbody>
                  <tr>
                    <td class="text-muted w-200px">Salida:</td>
                    <td class="fw-bold">{{ formatDateTime(detail.departure_time) || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Retorno esperado:</td>
                    <td class="fw-bold">{{ formatDateTime(detail.expected_return_time) || 'No definido' }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Retorno real:</td>
                    <td class="fw-bold">{{ formatDateTime(detail.actual_return_time) || 'Pendiente' }}</td>
                  </tr>
                  <tr v-if="meta.duration_minutes !== null && meta.duration_minutes !== undefined">
                    <td class="text-muted">Duración:</td>
                    <td class="fw-bold">{{ formatDuration(meta.duration_minutes) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Escort and authorization -->
            <h6 class="mb-3">Escolta y Autorización</h6>
            <div class="table-responsive mb-6">
              <table class="table table-row-bordered align-middle mb-0">
                <tbody>
                  <tr>
                    <td class="text-muted w-200px">Requiere escolta:</td>
                    <td>
                      <span v-if="detail.requires_escort" class="badge badge-light-warning">
                        <i class="fas fa-shield-alt me-1"></i>Sí
                      </span>
                      <span v-else class="text-muted">No</span>
                    </td>
                  </tr>
                  <tr v-if="detail.requires_escort">
                    <td class="text-muted">Oficial de escolta:</td>
                    <td class="fw-bold">{{ userName(detail.escort_officer) || 'Por asignar' }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Autorizado por:</td>
                    <td class="fw-bold">{{ userName(detail.authorized_by) || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Registrado por:</td>
                    <td class="fw-bold">{{ userName(detail.registered_by) || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Fecha de registro:</td>
                    <td>{{ formatDateTime(detail.created_at) || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Reason -->
            <h6 class="mb-3">Motivo</h6>
            <p class="border rounded p-4 bg-light mb-6">{{ detail.reason || '-' }}</p>

            <!-- Observations timeline -->
            <template v-if="observationLines.length">
              <h6 class="mb-3">Bitácora / Observaciones</h6>
              <ul class="list-group mb-0">
                <li
                  v-for="(line, index) in observationLines"
                  :key="index"
                  class="list-group-item d-flex align-items-start"
                >
                  <i class="fas fa-circle text-primary fs-9 me-3 mt-2"></i>
                  <span>{{ line }}</span>
                </li>
              </ul>
            </template>
          </template>

          <div v-else class="text-center py-10">
            <p class="text-muted mb-0">No se pudo cargar la información del movimiento.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { movementsApi } from '@/services/api/operations'

const props = defineProps({
  movement: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'updated'])
const { showToast } = useToast()

const loading = ref(false)
const detail = ref(null)
const meta = ref({
  is_active: false,
  is_overdue: false,
  duration_minutes: null,
  delay_minutes: null
})

const observationLines = computed(() => {
  if (!detail.value?.observations) return []
  return String(detail.value.observations)
    .split(/\n|\s\|\s/)
    .map((line) => line.trim())
    .filter(Boolean)
})

const loadDetail = async () => {
  loading.value = true
  try {
    const response = await movementsApi.getById(props.movement.id)
    const payload = response.data?.data || {}
    detail.value = payload.movement || null
    meta.value = {
      is_active: payload.is_active ?? false,
      is_overdue: payload.is_overdue ?? false,
      duration_minutes: payload.duration_minutes ?? null,
      delay_minutes: payload.delay_minutes ?? null
    }
  } catch (e) {
    console.error('Error cargando detalle del movimiento:', e)
    showToast('Error al cargar el detalle del movimiento', 'error')
    // Fallback: show the data already available in the listing
    detail.value = props.movement
  } finally {
    loading.value = false
  }
}

const userName = (user) => {
  if (!user || typeof user !== 'object') return null
  return user.name || user.full_name || [user.first_name, user.last_name].filter(Boolean).join(' ') || null
}

const formatDateTime = (datetime) => {
  if (!datetime) return null
  const date = new Date(datetime)
  return `${date.toLocaleDateString('es-GT')} ${date.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return '-'
  const total = Math.round(minutes)
  const hours = Math.floor(total / 60)
  const mins = total % 60
  return `${hours}h ${mins}m`
}

const formatMovementType = (type) => {
  const types = {
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

const formatStatus = (status) => {
  const statuses = {
    scheduled: 'Programado',
    in_transit: 'En Tránsito',
    at_destination: 'En Destino',
    returning: 'Regresando',
    completed: 'Completado',
    cancelled: 'Cancelado'
  }
  return statuses[status] || status
}

const getMovementTypeBadgeClass = (type) => {
  const classes = {
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

const getStatusBadgeClass = (status) => {
  const classes = {
    scheduled: 'badge-light-secondary',
    in_transit: 'badge-light-primary',
    at_destination: 'badge-light-warning',
    returning: 'badge-light-info',
    completed: 'badge-light-success',
    cancelled: 'badge-light-danger'
  }
  return classes[status] || 'badge-light-secondary'
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
