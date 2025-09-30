<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ isNewCount ? 'Iniciar Nuevo Conteo' : 'Continuar Conteo' }}
          </h3>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Count Info -->
            <div class="card card-flush mb-6" v-if="!isNewCount">
              <div class="card-header">
                <h3 class="card-title">Información del Conteo</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <strong>Tipo:</strong> {{ formatCountType(count?.count_type) }}
                  </div>
                  <div class="col-md-6">
                    <strong>Fecha:</strong> {{ formatDate(count?.count_date) }}
                  </div>
                  <div class="col-md-6">
                    <strong>Hora Programada:</strong> {{ formatTime(count?.scheduled_time) }}
                  </div>
                  <div class="col-md-6">
                    <strong>Población Esperada:</strong> {{ count?.expected_count }}
                  </div>
                </div>
              </div>
            </div>

            <!-- New Count Form -->
            <div v-if="isNewCount">
              <div class="row mb-6">
                <div class="col-md-6">
                  <label class="form-label required">Tipo de Conteo</label>
                  <select 
                    v-model="form.count_type" 
                    class="form-select"
                    :class="{ 'is-invalid': errors.count_type }"
                    required
                    :disabled="count?.count_type"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="morning">Matutino (06:00)</option>
                    <option value="midday">Medio Día (12:00)</option>
                    <option value="evening">Vespertino (18:00)</option>
                    <option value="night">Nocturno (21:00)</option>
                    <option value="emergency">Emergencia</option>
                    <option value="recount">Reconteo</option>
                  </select>
                  <div v-if="errors.count_type" class="invalid-feedback">
                    {{ errors.count_type }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Sector (Opcional)</label>
                  <select v-model="form.sector_id" class="form-select">
                    <option value="">Todo el Centro</option>
                    <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                      {{ sector.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mb-6" v-if="['emergency', 'recount'].includes(form.count_type)">
                <div class="col-md-12">
                  <label class="form-label required">Razón</label>
                  <textarea 
                    v-model="form.reason"
                    class="form-control"
                    :class="{ 'is-invalid': errors.reason }"
                    rows="3"
                    placeholder="Explique la razón del conteo de emergencia o reconteo..."
                    required
                  ></textarea>
                  <div v-if="errors.reason" class="invalid-feedback">
                    {{ errors.reason }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Count Form -->
            <div v-if="!isNewCount || form.count_type">
              <div class="card card-flush">
                <div class="card-header">
                  <h3 class="card-title">Registrar Conteo</h3>
                </div>
                <div class="card-body">
                  <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Población Esperada:</strong> {{ expectedCount }} PPL
                  </div>

                  <div class="row mb-6">
                    <div class="col-md-6">
                      <label class="form-label required">Conteo Físico</label>
                      <input 
                        type="number" 
                        v-model.number="form.physical_count"
                        class="form-control form-control-lg text-center fw-bold"
                        :class="{ 
                          'is-invalid': errors.physical_count,
                          'border-success': form.physical_count === expectedCount,
                          'border-danger': form.physical_count > 0 && form.physical_count !== expectedCount
                        }"
                        min="0"
                        required
                        placeholder="0"
                      >
                      <div v-if="errors.physical_count" class="invalid-feedback">
                        {{ errors.physical_count }}
                      </div>
                      <div v-if="form.physical_count > 0" class="mt-2">
                        <span 
                          class="badge"
                          :class="form.physical_count === expectedCount ? 'badge-success' : 'badge-danger'"
                        >
                          {{ form.physical_count === expectedCount ? 'Coincide' : `Diferencia: ${form.physical_count - expectedCount}` }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Breakdown -->
                  <h5 class="mb-4">Desglose de Ubicaciones</h5>
                  <div class="row mb-4">
                    <div class="col-md-4">
                      <label class="form-label">En Consulta Médica</label>
                      <input 
                        type="number" 
                        v-model.number="form.in_medical"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      >
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">En Tribunales</label>
                      <input 
                        type="number" 
                        v-model.number="form.in_court"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      >
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">En Visitas</label>
                      <input 
                        type="number" 
                        v-model.number="form.in_visits"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      >
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-4">
                      <label class="form-label">En Programas</label>
                      <input 
                        type="number" 
                        v-model.number="form.in_programs"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      >
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">En Trabajo</label>
                      <input 
                        type="number" 
                        v-model.number="form.in_work"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      >
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Otros Justificados</label>
                      <input 
                        type="number" 
                        v-model.number="form.other_justified"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      >
                    </div>
                  </div>

                  <div class="row mb-6" v-if="form.other_justified > 0">
                    <div class="col-md-12">
                      <label class="form-label required">Razón de Otros Justificados</label>
                      <input 
                        type="text" 
                        v-model="form.other_justified_reason"
                        class="form-control"
                        :class="{ 'is-invalid': errors.other_justified_reason }"
                        placeholder="Especifique la razón..."
                        required
                      >
                      <div v-if="errors.other_justified_reason" class="invalid-feedback">
                        {{ errors.other_justified_reason }}
                      </div>
                    </div>
                  </div>

                  <!-- Missing Inmates -->
                  <div v-if="hasDiscrepancy" class="alert alert-warning">
                    <h6 class="alert-heading">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      Discrepancia Detectada
                    </h6>
                    <p class="mb-0">
                      Faltan <strong>{{ Math.abs(discrepancy) }}</strong> PPL en el conteo.
                      Por favor, verifique e identifique a las personas faltantes.
                    </p>
                  </div>

                  <!-- Summary -->
                  <div class="card card-flush bg-light">
                    <div class="card-body">
                      <h6>Resumen del Conteo</h6>
                      <div class="row">
                        <div class="col-md-6">
                          <strong>Total Contado:</strong> {{ form.physical_count || 0 }}
                        </div>
                        <div class="col-md-6">
                          <strong>Total Justificado:</strong> {{ totalJustified }}
                        </div>
                        <div class="col-md-6">
                          <strong>Esperado:</strong> {{ expectedCount }}
                        </div>
                        <div class="col-md-6">
                          <strong>Diferencia:</strong> 
                          <span :class="discrepancy === 0 ? 'text-success' : 'text-danger'">
                            {{ discrepancy }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isNewCount ? 'Iniciar Conteo' : 'Completar Conteo' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { dailyCountsApi } from '@/services/api/operations'
import { catalogsApi } from '@/services/api/catalogs'

const props = defineProps({
  count: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])
const { showToast } = useToast()

// Data
const submitting = ref(false)
const errors = ref({})
const sectors = ref([])
const expectedCount = ref(0)

const form = reactive({
  center_id: null,
  sector_id: '',
  count_type: '',
  reason: '',
  physical_count: 0,
  in_medical: 0,
  in_court: 0,
  in_visits: 0,
  in_programs: 0,
  in_work: 0,
  other_justified: 0,
  other_justified_reason: '',
  missing_inmates: []
})

// Computed
const isNewCount = computed(() => !props.count?.id)

const totalJustified = computed(() => {
  return form.in_medical + form.in_court + form.in_visits + 
         form.in_programs + form.in_work + form.other_justified
})

const discrepancy = computed(() => {
  return expectedCount.value - (form.physical_count || 0)
})

const hasDiscrepancy = computed(() => {
  return form.physical_count > 0 && discrepancy.value !== 0
})

// Methods
const loadSectors = async () => {
  try {
    const response = await catalogsApi.sectors.getAll()
    sectors.value = response.data
  } catch (error) {
    console.error('Error loading sectors:', error)
  }
}

const calculateExpectedCount = async () => {
  // This would typically be fetched from the API
  // For now, using a placeholder
  expectedCount.value = 150
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    submitting.value = true
    errors.value = {}
    
    if (isNewCount.value) {
      // Start new count
      const response = await dailyCountsApi.start(form)
      const countId = response.data.count.id
      
      // If not emergency/recount, immediately submit the count
      if (!['emergency', 'recount'].includes(form.count_type)) {
        await dailyCountsApi.submit(countId, {
          physical_count: form.physical_count,
          in_medical: form.in_medical,
          in_court: form.in_court,
          in_visits: form.in_visits,
          in_programs: form.in_programs,
          in_work: form.in_work,
          other_justified: form.other_justified,
          other_justified_reason: form.other_justified_reason
        })
      }
    } else {
      // Submit existing count
      await dailyCountsApi.submit(props.count.id, {
        physical_count: form.physical_count,
        in_medical: form.in_medical,
        in_court: form.in_court,
        in_visits: form.in_visits,
        in_programs: form.in_programs,
        in_work: form.in_work,
        other_justified: form.other_justified,
        other_justified_reason: form.other_justified_reason
      })
    }
    
    showToast('Conteo completado exitosamente', 'success')
    emit('saved')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showToast('Error al procesar conteo', 'error')
    }
  } finally {
    submitting.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (isNewCount.value) {
    if (!form.count_type) {
      errors.value.count_type = 'Campo requerido'
    }
    
    if (['emergency', 'recount'].includes(form.count_type) && !form.reason) {
      errors.value.reason = 'Campo requerido'
    }
  }
  
  if (!form.physical_count && form.physical_count !== 0) {
    errors.value.physical_count = 'Campo requerido'
  }
  
  if (form.other_justified > 0 && !form.other_justified_reason) {
    errors.value.other_justified_reason = 'Campo requerido cuando hay otros justificados'
  }
  
  return Object.keys(errors.value).length === 0
}

const formatCountType = (type) => {
  const types = {
    'morning': 'Matutino (06:00)',
    'midday': 'Medio Día (12:00)',
    'evening': 'Vespertino (18:00)',
    'night': 'Nocturno (21:00)',
    'emergency': 'Emergencia',
    'recount': 'Reconteo'
  }
  return types[type] || type
}

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('es-GT') : ''
}

const formatTime = (time) => {
  if (!time) return ''
  const date = typeof time === 'string' && time.includes('T') 
    ? new Date(time) 
    : new Date(`2000-01-01 ${time}`)
  return date.toLocaleTimeString('es-GT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Watchers
watch(() => props.count, (newCount) => {
  if (newCount?.count_type) {
    form.count_type = newCount.count_type
  }
  if (newCount?.expected_count) {
    expectedCount.value = newCount.expected_count
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadSectors()
  calculateExpectedCount()
  
  // Set default center
  form.center_id = 1 // This should come from auth user or be selected
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.border-success {
  border-color: #28a745 !important;
}

.border-danger {
  border-color: #dc3545 !important;
}
</style>