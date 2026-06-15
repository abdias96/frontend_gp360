<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-route text-primary me-2"></i>
            Programar Movimiento
          </h3>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Inmate selection -->
            <div class="mb-6">
              <InmateSearchField
                v-model="selectedInmate"
                label="PPL a movilizar"
                required
                :error="errors.inmate_id"
              />
            </div>

            <!-- Type and destination -->
            <div class="row mb-6">
              <div class="col-md-6">
                <label for="mv-type" class="form-label required">Tipo de Movimiento</label>
                <select
                  id="mv-type"
                  v-model="form.movement_type"
                  class="form-select"
                  :class="{ 'is-invalid': errors.movement_type }"
                >
                  <option value="">Seleccionar...</option>
                  <option v-for="(label, value) in movementTypes" :key="value" :value="value">
                    {{ label }}
                  </option>
                </select>
                <div v-if="errors.movement_type" class="invalid-feedback">{{ errors.movement_type }}</div>
              </div>
              <div class="col-md-6">
                <label for="mv-sector" class="form-label">Sector Destino (opcional)</label>
                <select id="mv-sector" v-model="form.to_sector_id" class="form-select">
                  <option value="">Sin sector específico</option>
                  <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row mb-6">
              <div class="col-md-12">
                <label for="mv-destination" class="form-label required">Destino</label>
                <input
                  id="mv-destination"
                  v-model="form.to_location"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.to_location }"
                  maxlength="255"
                  placeholder="Ej. Clínica médica, Juzgado 5to, Área de visitas..."
                >
                <div v-if="errors.to_location" class="invalid-feedback">{{ errors.to_location }}</div>
              </div>
            </div>

            <!-- Schedule -->
            <div class="row mb-6">
              <div class="col-md-6">
                <label for="mv-departure" class="form-label required">Fecha y Hora de Salida</label>
                <input
                  id="mv-departure"
                  v-model="form.departure_time"
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': errors.departure_time }"
                  :min="minDeparture"
                >
                <div v-if="errors.departure_time" class="invalid-feedback">{{ errors.departure_time }}</div>
              </div>
              <div class="col-md-6">
                <label for="mv-return" class="form-label">Retorno Esperado (opcional)</label>
                <input
                  id="mv-return"
                  v-model="form.expected_return_time"
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': errors.expected_return_time }"
                  :min="form.departure_time"
                >
                <div v-if="errors.expected_return_time" class="invalid-feedback">{{ errors.expected_return_time }}</div>
              </div>
            </div>

            <!-- Escort -->
            <div class="row mb-6">
              <div class="col-md-6">
                <div class="form-check form-switch mt-md-10">
                  <input
                    id="mv-escort"
                    v-model="form.requires_escort"
                    class="form-check-input"
                    type="checkbox"
                  >
                  <label for="mv-escort" class="form-check-label">Requiere escolta</label>
                </div>
              </div>
              <div v-if="form.requires_escort" class="col-md-6">
                <label for="mv-escort-officer" class="form-label required">Oficial de Escolta</label>
                <select
                  id="mv-escort-officer"
                  v-model="form.escort_officer_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.escort_officer_id }"
                >
                  <option value="">Seleccionar oficial...</option>
                  <option v-for="officer in officers" :key="officer.id" :value="officer.id">
                    {{ officer.full_name }}
                  </option>
                </select>
                <div v-if="errors.escort_officer_id" class="invalid-feedback">{{ errors.escort_officer_id }}</div>
              </div>
            </div>

            <!-- Reason -->
            <div class="row mb-6">
              <div class="col-md-12">
                <label for="mv-reason" class="form-label required">Motivo del Movimiento</label>
                <textarea
                  id="mv-reason"
                  v-model="form.reason"
                  class="form-control"
                  :class="{ 'is-invalid': errors.reason }"
                  rows="3"
                  maxlength="500"
                  placeholder="Describa el motivo del movimiento..."
                ></textarea>
                <div v-if="errors.reason" class="invalid-feedback">{{ errors.reason }}</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <label for="mv-instructions" class="form-label">Instrucciones Especiales (opcional)</label>
                <textarea
                  id="mv-instructions"
                  v-model="form.special_instructions"
                  class="form-control"
                  rows="2"
                  maxlength="500"
                  placeholder="Indicaciones adicionales de seguridad o manejo..."
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Programar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { movementsApi } from '@/services/api/operations'
import apiClient from '@/services/api/apiClient'
import InmateSearchField from './InmateSearchField.vue'

const emit = defineEmits(['close', 'saved'])
const { showToast } = useToast()

// Valid types per backend InmateMovementController@store
// (el tipo "emergency" se gestiona con el modal de emergencia)
const movementTypes = {
  medical: 'Médico',
  education: 'Educación',
  work: 'Trabajo',
  visit: 'Visita',
  court: 'Tribunal',
  administrative: 'Administrativo',
  religious: 'Religioso',
  sports: 'Deportes',
  transfer: 'Traslado'
}

const submitting = ref(false)
const errors = ref({})
const sectors = ref([])
const officers = ref([])
const selectedInmate = ref(null)

const toLocalDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const minDeparture = toLocalDateTime(new Date())

const form = reactive({
  inmate_id: null,
  movement_type: '',
  to_location: '',
  to_sector_id: '',
  departure_time: toLocalDateTime(new Date(Date.now() + 15 * 60 * 1000)),
  expected_return_time: '',
  requires_escort: false,
  escort_officer_id: '',
  reason: '',
  special_instructions: ''
})

watch(selectedInmate, (inmate) => {
  form.inmate_id = inmate?.id || null
  if (inmate) errors.value.inmate_id = ''
})

const loadSectors = async () => {
  try {
    const response = await apiClient.get('/sectors', { params: { simple: true } })
    sectors.value = response.data?.data || []
  } catch (e) {
    console.error('Error cargando sectores:', e)
  }
}

const loadOfficers = async () => {
  try {
    const response = await apiClient.get('/users', { params: { simple: true } })
    officers.value = response.data?.data || []
  } catch (e) {
    console.error('Error cargando oficiales:', e)
  }
}

const validateForm = () => {
  errors.value = {}

  if (!form.inmate_id) errors.value.inmate_id = 'Debe seleccionar un PPL'
  if (!form.movement_type) errors.value.movement_type = 'Campo requerido'
  if (!form.to_location.trim()) errors.value.to_location = 'Campo requerido'
  if (!form.departure_time) errors.value.departure_time = 'Campo requerido'
  if (form.expected_return_time && form.expected_return_time <= form.departure_time) {
    errors.value.expected_return_time = 'Debe ser posterior a la hora de salida'
  }
  if (form.requires_escort && !form.escort_officer_id) {
    errors.value.escort_officer_id = 'Seleccione el oficial de escolta'
  }
  if (!form.reason.trim()) errors.value.reason = 'Campo requerido'

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const payload = {
      inmate_id: form.inmate_id,
      movement_type: form.movement_type,
      to_location: form.to_location.trim(),
      departure_time: form.departure_time,
      requires_escort: form.requires_escort,
      reason: form.reason.trim()
    }
    if (form.to_sector_id) payload.to_sector_id = form.to_sector_id
    if (form.expected_return_time) payload.expected_return_time = form.expected_return_time
    if (form.requires_escort) payload.escort_officer_id = form.escort_officer_id
    if (form.special_instructions.trim()) payload.special_instructions = form.special_instructions.trim()

    await movementsApi.schedule(payload)
    showToast('Movimiento programado exitosamente', 'success')
    emit('saved')
  } catch (error) {
    if (error.response?.status === 409) {
      showToast('El PPL ya tiene un movimiento activo', 'warning')
    } else if (error.response?.status === 422 && error.response.data?.errors) {
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach((key) => {
        errors.value[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key]
      })
      showToast('Verifique los datos del formulario', 'error')
    } else {
      showToast('Error al programar el movimiento', 'error')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadSectors()
  loadOfficers()
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
