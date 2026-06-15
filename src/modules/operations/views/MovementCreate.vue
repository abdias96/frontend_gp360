<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ $t('operations.movements.create.title') }}</h3>
        <p class="text-muted">{{ $t('operations.movements.create.subtitle') }}</p>
      </div>
      <div class="card-toolbar">
        <router-link
          :to="{ name: 'operations-movements' }"
          class="btn btn-light-primary btn-sm"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Cancelar
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <!-- Movement Type Selection -->
      <div class="mb-8">
        <h5 class="mb-4">Tipo de Movimiento</h5>
        <div class="row">
          <div
            v-for="type in movementTypes"
            :key="type.value"
            class="col-6 col-md-3 mb-4"
          >
            <div
              class="card border-2 cursor-pointer h-100"
              :class="{
                'border-primary': form.movement_type === type.value,
                'border-gray-300': form.movement_type !== type.value
              }"
              @click="form.movement_type = type.value"
            >
              <div class="card-body text-center">
                <i :class="type.icon" class="fa-2x mb-3"
                   :style="{ color: form.movement_type === type.value ? '#009ef7' : '#a1a5b7' }"></i>
                <h6 class="mb-1">{{ type.label }}</h6>
                <p class="text-muted fs-7 mb-0">{{ type.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="form.movement_type">
        <!-- Search Inmate -->
        <div class="mb-8">
          <h5 class="mb-4">Seleccionar PPL</h5>
          <div class="row">
            <div class="col-md-6">
              <InmateSearchField
                v-model="selectedInmate"
                label="Buscar PPL"
                required
              />
            </div>
          </div>
        </div>

        <!-- Movement Details Form -->
        <div v-if="selectedInmate" class="mb-8">
          <h5 class="mb-4">Detalles del Movimiento</h5>

          <div class="row">
            <!-- Origin -->
            <div class="col-md-6 mb-6">
              <h6 class="mb-3">Origen (ubicación actual)</h6>
              <div class="mb-3">
                <label for="origin-center" class="form-label">Centro</label>
                <input
                  id="origin-center"
                  :value="inmateDetail?.current_center?.name || 'No registrado'"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="mb-3">
                <label for="origin-sector" class="form-label">Sector</label>
                <input
                  id="origin-sector"
                  :value="inmateDetail?.current_sector?.name || 'No registrado'"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="mb-3">
                <label for="origin-location" class="form-label">Ubicación</label>
                <input
                  id="origin-location"
                  :value="inmateDetail?.current_location || 'No registrada'"
                  class="form-control"
                  disabled
                >
              </div>
            </div>

            <!-- Destination -->
            <div class="col-md-6 mb-6">
              <h6 class="mb-3">Destino</h6>
              <div class="mb-3">
                <label for="dest-location" class="form-label required">Destino</label>
                <input
                  id="dest-location"
                  v-model="form.to_location"
                  type="text"
                  class="form-control"
                  maxlength="255"
                  placeholder="Ej. Clínica médica, Juzgado 5to, Área de visitas..."
                >
              </div>
              <div class="mb-3">
                <label for="dest-sector" class="form-label">Sector Destino (opcional)</label>
                <select
                  id="dest-sector"
                  v-model="form.to_sector_id"
                  class="form-select"
                >
                  <option value="">Sin sector específico</option>
                  <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="mv-departure" class="form-label required">Fecha y Hora de Salida</label>
              <input
                id="mv-departure"
                v-model="form.departure_time"
                type="datetime-local"
                class="form-control"
                :min="minDeparture"
              >
            </div>
            <div class="col-md-6 mb-3">
              <label for="mv-return" class="form-label">Retorno Esperado (opcional)</label>
              <input
                id="mv-return"
                v-model="form.expected_return_time"
                type="datetime-local"
                class="form-control"
                :min="form.departure_time"
              >
            </div>
          </div>

          <!-- Escort -->
          <div class="row">
            <div class="col-md-6 mb-3">
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
            <div v-if="form.requires_escort" class="col-md-6 mb-3">
              <label for="mv-escort-officer" class="form-label required">Oficial de Escolta</label>
              <select
                id="mv-escort-officer"
                v-model="form.escort_officer_id"
                class="form-select"
              >
                <option value="">Seleccionar oficial...</option>
                <option v-for="officer in officers" :key="officer.id" :value="officer.id">
                  {{ officer.full_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="mv-reason" class="form-label required">Motivo del Movimiento</label>
              <textarea
                id="mv-reason"
                v-model="form.reason"
                class="form-control"
                rows="3"
                maxlength="500"
                placeholder="Describa el motivo del movimiento..."
              ></textarea>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
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

        <!-- Action Buttons -->
        <div v-if="selectedInmate" class="d-flex justify-content-end">
          <button
            @click="saveMovement"
            class="btn btn-primary"
            :disabled="!isFormValid || saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <i v-else class="fas fa-save me-2"></i>
            Programar Movimiento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { movementsApi } from '@/services/api/operations'
import apiClient from '@/services/api/apiClient'
import InmateSearchField from '../components/InmateSearchField.vue'

const { t } = useI18n()
const router = useRouter()

// Data
const selectedInmate = ref<any>(null)
const inmateDetail = ref<any>(null)
const sectors = ref<any[]>([])
const officers = ref<any[]>([])
const saving = ref(false)

const toLocalDateTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const minDeparture = toLocalDateTime(new Date())

const form = reactive({
  movement_type: '',
  inmate_id: null as number | null,
  to_location: '',
  to_sector_id: '',
  departure_time: toLocalDateTime(new Date(Date.now() + 15 * 60 * 1000)),
  expected_return_time: '',
  requires_escort: false,
  escort_officer_id: '',
  reason: '',
  special_instructions: ''
})

// Tipos válidos según backend InmateMovementController@store
// (el tipo "emergency" se registra desde Control de Movimientos)
const movementTypes = [
  { value: 'medical', label: 'Médico', description: 'Consulta o atención médica', icon: 'fas fa-stethoscope' },
  { value: 'court', label: 'Tribunal', description: 'Audiencia o diligencia judicial', icon: 'fas fa-gavel' },
  { value: 'transfer', label: 'Traslado', description: 'Cambio de ubicación', icon: 'fas fa-exchange-alt' },
  { value: 'administrative', label: 'Administrativo', description: 'Gestión administrativa', icon: 'fas fa-file-alt' },
  { value: 'visit', label: 'Visita', description: 'Área de visitas', icon: 'fas fa-users' },
  { value: 'education', label: 'Educación', description: 'Actividad educativa', icon: 'fas fa-graduation-cap' },
  { value: 'work', label: 'Trabajo', description: 'Programa laboral', icon: 'fas fa-hammer' },
  { value: 'religious', label: 'Religioso', description: 'Actividad religiosa', icon: 'fas fa-pray' },
  { value: 'sports', label: 'Deportes', description: 'Actividad deportiva', icon: 'fas fa-running' }
]

// Computed
const isFormValid = computed(() => {
  if (!form.movement_type || !selectedInmate.value) return false
  if (!form.to_location.trim() || !form.departure_time || !form.reason.trim()) return false
  if (form.requires_escort && !form.escort_officer_id) return false
  if (form.expected_return_time && form.expected_return_time <= form.departure_time) return false
  return true
})

// Methods
const loadInmateDetail = async (inmateId: number) => {
  try {
    const response = await apiClient.get(`/inmates/${inmateId}`)
    inmateDetail.value = response.data?.data ?? response.data
  } catch (error) {
    console.error('Error loading inmate detail:', error)
    inmateDetail.value = null
  }
}

const loadSectors = async () => {
  try {
    const response = await apiClient.get('/sectors', { params: { simple: true } })
    sectors.value = response.data?.data || []
  } catch (error) {
    console.error('Error loading sectors:', error)
  }
}

const loadOfficers = async () => {
  try {
    const response = await apiClient.get('/users', { params: { simple: true } })
    officers.value = response.data?.data || []
  } catch (error) {
    console.error('Error loading officers:', error)
  }
}

const saveMovement = async () => {
  const result = await Swal.fire({
    title: '¿Confirmar movimiento?',
    text: 'Se programará el movimiento del PPL',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  })

  if (!result.isConfirmed) return

  saving.value = true
  try {
    const payload: Record<string, any> = {
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

    await Swal.fire({
      icon: 'success',
      title: 'Movimiento programado',
      text: 'El movimiento ha sido registrado exitosamente'
    })
    router.push({ name: 'operations-movements' })
  } catch (error: any) {
    let message = 'No se pudo registrar el movimiento'
    if (error.response?.status === 409) {
      message = 'El PPL ya tiene un movimiento activo'
    } else if (error.response?.status === 422 && error.response.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0]
      message = Array.isArray(firstError) ? String(firstError[0]) : String(firstError)
    }
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    })
  } finally {
    saving.value = false
  }
}

// Watchers
watch(selectedInmate, (inmate) => {
  form.inmate_id = inmate?.id || null
  inmateDetail.value = null
  if (inmate?.id) {
    loadInmateDetail(inmate.id)
  }
})

// Lifecycle
loadSectors()
loadOfficers()
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
