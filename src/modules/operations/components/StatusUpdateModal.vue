<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-map-marker-alt text-primary me-2"></i>
            Actualizar Estado
          </h3>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Movement summary -->
            <div class="card card-flush bg-light mb-6">
              <div class="card-body py-4">
                <div class="fw-bold">{{ movement.inmate?.full_name || `Movimiento #${movement.id}` }}</div>
                <div class="text-muted fs-7">
                  {{ movement.from_location }} <i class="fas fa-arrow-right mx-1"></i> {{ movement.to_location }}
                </div>
                <div class="mt-2">
                  <span class="text-muted fs-7 me-2">Estado actual:</span>
                  <span class="badge" :class="getStatusBadgeClass(movement.status)">
                    {{ formatStatus(movement.status) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <label for="st-status" class="form-label required">Nuevo Estado</label>
              <select
                id="st-status"
                v-model="form.status"
                class="form-select"
                :class="{ 'is-invalid': errors.status }"
              >
                <option value="">Seleccionar...</option>
                <option v-for="option in availableStatuses" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
            </div>

            <div v-if="form.status === 'cancelled'" class="mb-6">
              <label for="st-cancellation" class="form-label required">Razón de Cancelación</label>
              <textarea
                id="st-cancellation"
                v-model="form.cancellation_reason"
                class="form-control"
                :class="{ 'is-invalid': errors.cancellation_reason }"
                rows="3"
                maxlength="500"
                placeholder="Explique por qué se cancela el movimiento..."
              ></textarea>
              <div v-if="errors.cancellation_reason" class="invalid-feedback">{{ errors.cancellation_reason }}</div>
            </div>

            <div class="mb-0">
              <label for="st-notes" class="form-label">Observaciones (opcional)</label>
              <textarea
                id="st-notes"
                v-model="form.notes"
                class="form-control"
                rows="2"
                maxlength="500"
                placeholder="Notas adicionales sobre el cambio de estado..."
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Actualizar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { movementsApi } from '@/services/api/operations'

const props = defineProps({
  movement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])
const { showToast } = useToast()

const submitting = ref(false)
const errors = ref({})

const form = reactive({
  status: '',
  notes: '',
  cancellation_reason: ''
})

// Valid transitions per backend InmateMovementController@updateStatus
const statusLabels = {
  at_destination: 'En Destino (llegó al destino)',
  returning: 'Regresando (inició el retorno)',
  completed: 'Completado (retornó al origen)',
  cancelled: 'Cancelado'
}

const transitions = {
  in_transit: ['at_destination', 'cancelled'],
  at_destination: ['returning', 'completed', 'cancelled'],
  returning: ['completed', 'cancelled']
}

const availableStatuses = computed(() => {
  const allowed = transitions[props.movement.status] || ['at_destination', 'returning', 'completed', 'cancelled']
  return allowed.map((value) => ({ value, label: statusLabels[value] }))
})

const validateForm = () => {
  errors.value = {}

  if (!form.status) errors.value.status = 'Seleccione el nuevo estado'
  if (form.status === 'cancelled' && !form.cancellation_reason.trim()) {
    errors.value.cancellation_reason = 'Campo requerido al cancelar'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const payload = { status: form.status }
    if (form.notes.trim()) payload.notes = form.notes.trim()
    if (form.status === 'cancelled') payload.cancellation_reason = form.cancellation_reason.trim()

    await movementsApi.updateStatus(props.movement.id, payload)
    showToast('Estado actualizado exitosamente', 'success')
    emit('updated')
  } catch (error) {
    if (error.response?.status === 422 && error.response.data?.errors) {
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach((key) => {
        errors.value[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key]
      })
      showToast('Verifique los datos del formulario', 'error')
    } else {
      showToast('Error al actualizar el estado del movimiento', 'error')
    }
  } finally {
    submitting.value = false
  }
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
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
