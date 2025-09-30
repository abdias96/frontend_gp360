<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Nueva Admisión</h3>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid">
              <!-- Navigation -->
              <div class="card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9">
                <div class="card-body px-6 px-lg-10 px-xxl-15 py-20">
                  <div class="stepper-nav">
                    <div class="stepper-item" :class="{ current: currentStep === 1 }">
                      <div class="stepper-wrapper">
                        <div class="stepper-icon">
                          <i class="fas fa-user fs-2"></i>
                        </div>
                        <div class="stepper-label">
                          <h3 class="stepper-title">Datos Personales</h3>
                          <div class="stepper-desc">Información básica del PPL</div>
                        </div>
                      </div>
                    </div>

                    <div class="stepper-item" :class="{ current: currentStep === 2 }">
                      <div class="stepper-wrapper">
                        <div class="stepper-icon">
                          <i class="fas fa-gavel fs-2"></i>
                        </div>
                        <div class="stepper-label">
                          <h3 class="stepper-title">Información Legal</h3>
                          <div class="stepper-desc">Datos legales y judiciales</div>
                        </div>
                      </div>
                    </div>

                    <div class="stepper-item" :class="{ current: currentStep === 3 }">
                      <div class="stepper-wrapper">
                        <div class="stepper-icon">
                          <i class="fas fa-stethoscope fs-2"></i>
                        </div>
                        <div class="stepper-label">
                          <h3 class="stepper-title">Información Médica</h3>
                          <div class="stepper-desc">Estado de salud inicial</div>
                        </div>
                      </div>
                    </div>

                    <div class="stepper-item" :class="{ current: currentStep === 4 }">
                      <div class="stepper-wrapper">
                        <div class="stepper-icon">
                          <i class="fas fa-check fs-2"></i>
                        </div>
                        <div class="stepper-label">
                          <h3 class="stepper-title">Confirmación</h3>
                          <div class="stepper-desc">Revisión y confirmación</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="card d-flex flex-row-fluid flex-center">
                <div class="card-body py-20 w-100 mw-xl-700px px-9">
                  <!-- Step 1: Personal Data -->
                  <div v-if="currentStep === 1" class="current">
                    <div class="w-100">
                      <div class="mb-10">
                        <h2 class="text-dark fw-bold mb-3">Datos Personales</h2>
                        <div class="text-gray-500 fw-semibold fs-6">
                          Ingrese la información personal básica del nuevo PPL
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label required">Tipo de Documento</label>
                          <select 
                            v-model="form.document_type" 
                            class="form-select"
                            :class="{ 'is-invalid': errors.document_type }"
                            required
                          >
                            <option value="">Seleccionar...</option>
                            <option value="DPI">DPI</option>
                            <option value="passport">Pasaporte</option>
                            <option value="foreign_id">Cédula Extranjera</option>
                          </select>
                          <div v-if="errors.document_type" class="invalid-feedback">
                            {{ errors.document_type }}
                          </div>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label required">Número de Documento</label>
                          <input 
                            type="text" 
                            v-model="form.document_number"
                            class="form-control"
                            :class="{ 'is-invalid': errors.document_number }"
                            placeholder="Ej: 1234567890101"
                            required
                          >
                          <div v-if="errors.document_number" class="invalid-feedback">
                            {{ errors.document_number }}
                          </div>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label required">Primer Nombre</label>
                          <input 
                            type="text" 
                            v-model="form.first_name"
                            class="form-control"
                            :class="{ 'is-invalid': errors.first_name }"
                            required
                          >
                          <div v-if="errors.first_name" class="invalid-feedback">
                            {{ errors.first_name }}
                          </div>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Segundo Nombre</label>
                          <input 
                            type="text" 
                            v-model="form.second_name"
                            class="form-control"
                          >
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label required">Primer Apellido</label>
                          <input 
                            type="text" 
                            v-model="form.last_name"
                            class="form-control"
                            :class="{ 'is-invalid': errors.last_name }"
                            required
                          >
                          <div v-if="errors.last_name" class="invalid-feedback">
                            {{ errors.last_name }}
                          </div>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Segundo Apellido</label>
                          <input 
                            type="text" 
                            v-model="form.second_last_name"
                            class="form-control"
                          >
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-4">
                          <label class="form-label required">Fecha de Nacimiento</label>
                          <input 
                            type="date" 
                            v-model="form.birth_date"
                            class="form-control"
                            :class="{ 'is-invalid': errors.birth_date }"
                            required
                          >
                          <div v-if="errors.birth_date" class="invalid-feedback">
                            {{ errors.birth_date }}
                          </div>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label required">Género</label>
                          <select 
                            v-model="form.gender" 
                            class="form-select"
                            :class="{ 'is-invalid': errors.gender }"
                            required
                          >
                            <option value="">Seleccionar...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                          </select>
                          <div v-if="errors.gender" class="invalid-feedback">
                            {{ errors.gender }}
                          </div>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Estado Civil</label>
                          <select v-model="form.civil_status_id" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option v-for="status in civilStatuses" :key="status.id" :value="status.id">
                              {{ status.name }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-4">
                          <label class="form-label">Nacionalidad</label>
                          <select v-model="form.nationality_id" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.id">
                              {{ nationality.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Grupo Étnico</label>
                          <select v-model="form.ethnic_group_id" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option v-for="group in ethnicGroups" :key="group.id" :value="group.id">
                              {{ group.name }}
                            </option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Tipo de Sangre</label>
                          <select v-model="form.blood_type_id" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option v-for="type in bloodTypes" :key="type.id" :value="type.id">
                              {{ type.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 2: Legal Information -->
                  <div v-if="currentStep === 2" class="current">
                    <div class="w-100">
                      <div class="mb-10">
                        <h2 class="text-dark fw-bold mb-3">Información Legal</h2>
                        <div class="text-gray-500 fw-semibold fs-6">
                          Datos sobre la situación legal del PPL
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label required">Tipo de Admisión</label>
                          <select 
                            v-model="form.admission_type" 
                            class="form-select"
                            :class="{ 'is-invalid': errors.admission_type }"
                            required
                          >
                            <option value="">Seleccionar...</option>
                            <option value="preventive_detention">Prisión Preventiva</option>
                            <option value="sentence_execution">Ejecución de Sentencia</option>
                            <option value="transfer">Traslado</option>
                            <option value="reentry">Reingreso</option>
                            <option value="judicial_order">Orden Judicial</option>
                          </select>
                          <div v-if="errors.admission_type" class="invalid-feedback">
                            {{ errors.admission_type }}
                          </div>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label required">Juzgado/Tribunal</label>
                          <select 
                            v-model="form.court_id" 
                            class="form-select"
                            :class="{ 'is-invalid': errors.court_id }"
                            required
                          >
                            <option value="">Seleccionar...</option>
                            <option v-for="court in courts" :key="court.id" :value="court.id">
                              {{ court.name }}
                            </option>
                          </select>
                          <div v-if="errors.court_id" class="invalid-feedback">
                            {{ errors.court_id }}
                          </div>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label required">Número de Expediente</label>
                          <input 
                            type="text" 
                            v-model="form.case_number"
                            class="form-control"
                            :class="{ 'is-invalid': errors.case_number }"
                            required
                          >
                          <div v-if="errors.case_number" class="invalid-feedback">
                            {{ errors.case_number }}
                          </div>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Número de Proceso</label>
                          <input 
                            type="text" 
                            v-model="form.process_number"
                            class="form-control"
                          >
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-12">
                          <label class="form-label required">Delito(s) Principal(es)</label>
                          <textarea 
                            v-model="form.main_crime"
                            class="form-control"
                            :class="{ 'is-invalid': errors.main_crime }"
                            rows="3"
                            placeholder="Descripción del/los delito(s)..."
                            required
                          ></textarea>
                          <div v-if="errors.main_crime" class="invalid-feedback">
                            {{ errors.main_crime }}
                          </div>
                        </div>
                      </div>

                      <div class="row mb-6" v-if="form.admission_type === 'sentence_execution'">
                        <div class="col-md-4">
                          <label class="form-label">Años de Sentencia</label>
                          <input 
                            type="number" 
                            v-model="form.sentence_years"
                            class="form-control"
                            min="0"
                          >
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Meses de Sentencia</label>
                          <input 
                            type="number" 
                            v-model="form.sentence_months"
                            class="form-control"
                            min="0"
                            max="11"
                          >
                        </div>
                        <div class="col-md-4">
                          <label class="form-label">Días de Sentencia</label>
                          <input 
                            type="number" 
                            v-model="form.sentence_days"
                            class="form-control"
                            min="0"
                            max="30"
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 3: Medical Information -->
                  <div v-if="currentStep === 3" class="current">
                    <div class="w-100">
                      <div class="mb-10">
                        <h2 class="text-dark fw-bold mb-3">Información Médica Inicial</h2>
                        <div class="text-gray-500 fw-semibold fs-6">
                          Estado de salud y condiciones médicas relevantes
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-6">
                          <label class="form-label">Estado de Salud General</label>
                          <select v-model="form.general_health_status" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option value="excellent">Excelente</option>
                            <option value="good">Bueno</option>
                            <option value="fair">Regular</option>
                            <option value="poor">Malo</option>
                            <option value="critical">Crítico</option>
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">¿Requiere Atención Médica Inmediata?</label>
                          <select v-model="form.requires_immediate_medical_attention" class="form-select">
                            <option value="">Seleccionar...</option>
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-12">
                          <label class="form-label">Enfermedades Crónicas Conocidas</label>
                          <textarea 
                            v-model="form.chronic_diseases"
                            class="form-control"
                            rows="3"
                            placeholder="Diabetes, hipertensión, etc..."
                          ></textarea>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-12">
                          <label class="form-label">Medicamentos Actuales</label>
                          <textarea 
                            v-model="form.current_medications"
                            class="form-control"
                            rows="3"
                            placeholder="Medicamentos que toma actualmente..."
                          ></textarea>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-12">
                          <label class="form-label">Alergias Conocidas</label>
                          <textarea 
                            v-model="form.known_allergies"
                            class="form-control"
                            rows="2"
                            placeholder="Alergias a medicamentos, alimentos, etc..."
                          ></textarea>
                        </div>
                      </div>

                      <div class="row mb-6">
                        <div class="col-md-12">
                          <label class="form-label">Observaciones Médicas</label>
                          <textarea 
                            v-model="form.medical_observations"
                            class="form-control"
                            rows="3"
                            placeholder="Cualquier observación médica relevante..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 4: Confirmation -->
                  <div v-if="currentStep === 4" class="current">
                    <div class="w-100">
                      <div class="mb-10">
                        <h2 class="text-dark fw-bold mb-3">Confirmación de Datos</h2>
                        <div class="text-gray-500 fw-semibold fs-6">
                          Revise los datos ingresados antes de crear la admisión
                        </div>
                      </div>

                      <!-- Summary Cards -->
                      <div class="card card-flush mb-6">
                        <div class="card-header">
                          <h3 class="card-title">Datos Personales</h3>
                        </div>
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-6">
                              <strong>Nombre Completo:</strong> {{ fullName }}
                            </div>
                            <div class="col-md-6">
                              <strong>Documento:</strong> {{ form.document_type }} {{ form.document_number }}
                            </div>
                            <div class="col-md-6">
                              <strong>Fecha de Nacimiento:</strong> {{ formatDate(form.birth_date) }}
                            </div>
                            <div class="col-md-6">
                              <strong>Género:</strong> {{ form.gender === 'M' ? 'Masculino' : 'Femenino' }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card card-flush mb-6">
                        <div class="card-header">
                          <h3 class="card-title">Información Legal</h3>
                        </div>
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-6">
                              <strong>Tipo de Admisión:</strong> {{ formatAdmissionType(form.admission_type) }}
                            </div>
                            <div class="col-md-6">
                              <strong>Expediente:</strong> {{ form.case_number }}
                            </div>
                            <div class="col-md-12">
                              <strong>Delito Principal:</strong> {{ form.main_crime }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card card-flush mb-6">
                        <div class="card-header">
                          <h3 class="card-title">Información Médica</h3>
                        </div>
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-6">
                              <strong>Estado de Salud:</strong> {{ formatHealthStatus(form.general_health_status) }}
                            </div>
                            <div class="col-md-6">
                              <strong>Atención Inmediata:</strong> {{ form.requires_immediate_medical_attention ? 'Sí' : 'No' }}
                            </div>
                          </div>
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
              type="button" 
              class="btn btn-light" 
              @click="previousStep"
              v-if="currentStep > 1"
            >
              Anterior
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="nextStep"
              v-if="currentStep < 4"
            >
              Siguiente
            </button>
            <button 
              type="submit" 
              class="btn btn-success"
              v-if="currentStep === 4"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              Crear Admisión
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { admissionsApi } from '@/services/api/operations'
import { catalogsApi } from '@/services/api/catalogs'

const emit = defineEmits(['close', 'saved'])
const { showToast } = useToast()

// Data
const currentStep = ref(1)
const submitting = ref(false)
const errors = ref({})

// Catalogs
const civilStatuses = ref([])
const nationalities = ref([])
const ethnicGroups = ref([])
const bloodTypes = ref([])
const courts = ref([])

const form = reactive({
  // Personal data
  document_type: '',
  document_number: '',
  first_name: '',
  second_name: '',
  last_name: '',
  second_last_name: '',
  birth_date: '',
  gender: '',
  civil_status_id: '',
  nationality_id: '',
  ethnic_group_id: '',
  blood_type_id: '',
  
  // Legal data
  admission_type: '',
  court_id: '',
  case_number: '',
  process_number: '',
  main_crime: '',
  sentence_years: 0,
  sentence_months: 0,
  sentence_days: 0,
  
  // Medical data
  general_health_status: '',
  requires_immediate_medical_attention: '',
  chronic_diseases: '',
  current_medications: '',
  known_allergies: '',
  medical_observations: ''
})

// Computed
const fullName = computed(() => {
  return [form.first_name, form.second_name, form.last_name, form.second_last_name]
    .filter(Boolean)
    .join(' ')
})

// Methods
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

const previousStep = () => {
  currentStep.value--
  errors.value = {}
}

const validateCurrentStep = () => {
  errors.value = {}
  
  if (currentStep.value === 1) {
    if (!form.document_type) errors.value.document_type = 'Campo requerido'
    if (!form.document_number) errors.value.document_number = 'Campo requerido'
    if (!form.first_name) errors.value.first_name = 'Campo requerido'
    if (!form.last_name) errors.value.last_name = 'Campo requerido'
    if (!form.birth_date) errors.value.birth_date = 'Campo requerido'
    if (!form.gender) errors.value.gender = 'Campo requerido'
  }
  
  if (currentStep.value === 2) {
    if (!form.admission_type) errors.value.admission_type = 'Campo requerido'
    if (!form.court_id) errors.value.court_id = 'Campo requerido'
    if (!form.case_number) errors.value.case_number = 'Campo requerido'
    if (!form.main_crime) errors.value.main_crime = 'Campo requerido'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateCurrentStep()) return
  
  try {
    submitting.value = true
    await admissionsApi.create(form)
    showToast('Admisión creada exitosamente', 'success')
    emit('saved')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showToast('Error al crear admisión', 'error')
    }
  } finally {
    submitting.value = false
  }
}

const loadCatalogs = async () => {
  try {
    const [civilStatusesRes, nationalitiesRes, ethnicGroupsRes, bloodTypesRes, courtsRes] = await Promise.all([
      catalogsApi.civilStatuses.getAll(),
      catalogsApi.nationalities.getAll(),
      catalogsApi.ethnicGroups.getAll(),
      catalogsApi.bloodTypes.getAll(),
      catalogsApi.courts.getAll()
    ])
    
    civilStatuses.value = civilStatusesRes.data
    nationalities.value = nationalitiesRes.data
    ethnicGroups.value = ethnicGroupsRes.data
    bloodTypes.value = bloodTypesRes.data
    courts.value = courtsRes.data
  } catch (error) {
    console.error('Error loading catalogs:', error)
  }
}

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('es-GT') : ''
}

const formatAdmissionType = (type) => {
  const types = {
    'preventive_detention': 'Prisión Preventiva',
    'sentence_execution': 'Ejecución de Sentencia',
    'transfer': 'Traslado',
    'reentry': 'Reingreso',
    'judicial_order': 'Orden Judicial'
  }
  return types[type] || type
}

const formatHealthStatus = (status) => {
  const statuses = {
    'excellent': 'Excelente',
    'good': 'Bueno',
    'fair': 'Regular',
    'poor': 'Malo',
    'critical': 'Crítico'
  }
  return statuses[status] || 'No especificado'
}

// Lifecycle
onMounted(() => {
  loadCatalogs()
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.stepper-item.current .stepper-icon {
  background-color: var(--bs-primary);
  color: white;
}

.stepper-item.current .stepper-title {
  color: var(--bs-primary);
}
</style>