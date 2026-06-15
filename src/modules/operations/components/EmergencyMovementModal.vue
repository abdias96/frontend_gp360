<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-light-danger">
          <h3 class="modal-title text-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Movimiento de Emergencia
          </h3>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="alert alert-warning d-flex align-items-center mb-6">
              <i class="fas fa-info-circle fs-2 me-3"></i>
              <div>
                El movimiento de emergencia inicia de inmediato (en tránsito) y
                <strong>cancela cualquier movimiento activo</strong> que tenga el PPL.
              </div>
            </div>

            <!-- Inmate selection -->
            <div class="mb-6">
              <InmateSearchField
                v-model="selectedInmate"
                label="PPL a movilizar"
                required
                :error="errors.inmate_id"
              />
            </div>

            <div class="row mb-6">
              <div class="col-md-6">
                <label for="em-type" class="form-label required">Tipo de Emergencia</label>
                <select
                  id="em-type"
                  v-model="form.emergency_type"
                  class="form-select"
                  :class="{ 'is-invalid': errors.emergency_type }"
                >
                  <option value="">Seleccionar...</option>
                  <option value="medical">Médica</option>
                  <option value="security">Seguridad</option>
                  <option value="administrative">Administrativa</option>
                </select>
                <div v-if="errors.emergency_type" class="invalid-feedback">{{ errors.emergency_type }}</div>
              </div>
              <div class="col-md-6">
                <label for="em-destination" class="form-label required">Destino</label>
                <input
                  id="em-destination"
                  v-model="form.destination"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.destination }"
                  maxlength="255"
                  placeholder="Ej. Hospital Nacional, Área de aislamiento..."
                >
                <div v-if="errors.destination" class="invalid-feedback">{{ errors.destination }}</div>
              </div>
            </div>

            <div class="row mb-6">
              <div class="col-md-12">
                <label for="em-reason" class="form-label required">Razón de la Emergencia</label>
                <textarea
                  id="em-reason"
                  v-model="form.reason"
                  class="form-control"
                  :class="{ 'is-invalid': errors.reason }"
                  rows="3"
                  maxlength="1000"
                  placeholder="Describa la situación de emergencia que justifica el movimiento..."
                ></textarea>
                <div v-if="errors.reason" class="invalid-feedback">{{ errors.reason }}</div>
              </div>
            </div>

            <!-- Escort -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-check form-switch mt-md-10">
                  <input
                    id="em-escort"
                    v-model="form.requires_escort"
                    class="form-check-input"
                    type="checkbox"
                  >
                  <label for="em-escort" class="form-check-label">Requiere escolta</label>
                </div>
              </div>
              <div v-if="form.requires_escort" class="col-md-6">
                <label for="em-escort-officer" class="form-label required">Oficial de Escolta</label>
                <select
                  id="em-escort-officer"
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
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-danger" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registrar Emergencia
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

const submitting = ref(false)
const errors = ref({})
const officers = ref([])
const selectedInmate = ref(null)

const form = reactive({
  inmate_id: null,
  emergency_type: '',
  destination: '',
  reason: '',
  requires_escort: false,
  escort_officer_id: ''
})

watch(selectedInmate, (inmate) => {
  form.inmate_id = inmate?.id || null
  if (inmate) errors.value.inmate_id = ''
})

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
  if (!form.emergency_type) errors.value.emergency_type = 'Campo requerido'
  if (!form.destination.trim()) errors.value.destination = 'Campo requerido'
  if (!form.reason.trim()) errors.value.reason = 'Campo requerido'
  if (form.requires_escort && !form.escort_officer_id) {
    errors.value.escort_officer_id = 'Seleccione el oficial de escolta'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const payload = {
      inmate_id: form.inmate_id,
      emergency_type: form.emergency_type,
      destination: form.destination.trim(),
      reason: form.reason.trim(),
      requires_escort: form.requires_escort
    }
    if (form.requires_escort) payload.escort_officer_id = form.escort_officer_id

    await movementsApi.createEmergency(payload)
    showToast('Movimiento de emergencia registrado', 'success')
    emit('saved')
  } catch (error) {
    if (error.response?.status === 422 && error.response.data?.errors) {
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach((key) => {
        errors.value[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key]
      })
      showToast('Verifique los datos del formulario', 'error')
    } else {
      showToast('Error al registrar el movimiento de emergencia', 'error')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadOfficers()
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
