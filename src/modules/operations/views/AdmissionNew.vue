<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{ $t('operations.admissions.new_admission') }}</h3>
      <div class="card-toolbar">
        <router-link to="/operations/admissions" class="btn btn-light-primary">
          <KTIcon icon-name="arrow-left" icon-class="fs-2" />
          {{ $t('common.back') }}
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <!-- Progress Steps -->
      <div class="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid gap-10">
        <div class="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
          <div class="stepper-nav ps-lg-10">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="stepper-item"
              :class="{ current: currentStep === index, completed: currentStep > index }"
              @click="goToStep(index)"
            >
              <div class="stepper-wrapper d-flex align-items-center">
                <div class="stepper-icon w-40px h-40px">
                  <i class="stepper-check fas fa-check"></i>
                  <span class="stepper-number">{{ index + 1 }}</span>
                </div>
                <div class="stepper-label">
                  <h3 class="stepper-title">{{ step.title }}</h3>
                  <div class="stepper-desc">{{ step.description }}</div>
                </div>
              </div>
              <div class="stepper-line h-40px"></div>
            </div>
          </div>
        </div>

        <div class="flex-row-fluid px-lg-15">
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 0" class="current">
            <div class="w-100">
              <h4 class="fw-bold mb-5">{{ $t('operations.admissions.basic_info') }}</h4>
              
              <div class="row mb-5">
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.arrival_date') }}</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="formData.arrival_date"
                    :max="today"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.arrival_time') }}</label>
                  <input 
                    type="time" 
                    class="form-control" 
                    v-model="formData.arrival_time"
                  />
                </div>
              </div>

              <div class="row mb-5">
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.document_type') }}</label>
                  <select class="form-select" v-model="formData.document_type">
                    <option value="">{{ $t('common.select') }}</option>
                    <option value="dpi">DPI</option>
                    <option value="passport">Pasaporte</option>
                    <option value="birth_certificate">Certificado de Nacimiento</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.document_number') }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.document_number"
                    placeholder="Ej: 1234567890101"
                  />
                </div>
              </div>

              <div class="row mb-5">
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.first_name') }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.first_name"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.last_name') }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.last_name"
                  />
                </div>
              </div>

              <div class="row mb-5">
                <div class="col-md-6">
                  <label class="form-label">{{ $t('operations.admissions.known_as') }}</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.alias"
                    placeholder="Alias o apodo"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label required">{{ $t('operations.admissions.origin_court') }}</label>
                  <select class="form-select" v-model="formData.court_id">
                    <option value="">{{ $t('common.select') }}</option>
                    <option value="1">Juzgado de Primera Instancia Penal</option>
                    <option value="2">Tribunal de Sentencia</option>
                  </select>
                </div>
              </div>

              <div class="mb-5">
                <label class="form-label required">{{ $t('operations.admissions.legal_status') }}</label>
                <select class="form-select" v-model="formData.legal_status">
                  <option value="">{{ $t('common.select') }}</option>
                  <option value="preventive">Prisión Preventiva</option>
                  <option value="sentenced">Condenado</option>
                  <option value="mixed">Mixto</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 2: Quick Registration -->
          <div v-if="currentStep === 1" class="current">
            <div class="w-100">
              <h4 class="fw-bold mb-5">{{ $t('operations.admissions.quick_registration') }}</h4>
              
              <div class="alert alert-info d-flex align-items-center p-5 mb-5">
                <KTIcon icon-name="information-5" icon-class="fs-2hx text-info me-4" />
                <div class="d-flex flex-column">
                  <h4 class="mb-1 text-info">{{ $t('operations.admissions.quick_process_info') }}</h4>
                  <span>{{ $t('operations.admissions.quick_process_description') }}</span>
                </div>
              </div>

              <div class="row mb-5">
                <div class="col-md-4">
                  <div class="form-check form-check-custom form-check-solid">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      v-model="formData.has_medical_emergency"
                    />
                    <label class="form-check-label">
                      {{ $t('operations.admissions.medical_emergency') }}
                    </label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-check form-check-custom form-check-solid">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      v-model="formData.has_injuries"
                    />
                    <label class="form-check-label">
                      {{ $t('operations.admissions.visible_injuries') }}
                    </label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-check form-check-custom form-check-solid">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      v-model="formData.requires_interpreter"
                    />
                    <label class="form-check-label">
                      {{ $t('operations.admissions.requires_interpreter') }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <label class="form-label">{{ $t('operations.admissions.initial_observations') }}</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  v-model="formData.initial_observations"
                  placeholder="Observaciones importantes del momento de ingreso"
                ></textarea>
              </div>

              <div class="mb-5">
                <label class="form-label required">{{ $t('operations.admissions.temporary_location') }}</label>
                <select class="form-select" v-model="formData.temporary_location">
                  <option value="">{{ $t('common.select') }}</option>
                  <option value="intake">Área de Ingreso</option>
                  <option value="medical">Área Médica</option>
                  <option value="isolation">Aislamiento Temporal</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="currentStep === 2" class="current">
            <div class="w-100">
              <h4 class="fw-bold mb-5">{{ $t('operations.admissions.confirm_admission') }}</h4>
              
              <div class="bg-light rounded p-5 mb-5">
                <h5 class="mb-3">{{ $t('operations.admissions.summary') }}</h5>
                <div class="row">
                  <div class="col-md-6">
                    <p><strong>{{ $t('operations.admissions.full_name') }}:</strong> {{ formData.first_name }} {{ formData.last_name }}</p>
                    <p><strong>{{ $t('operations.admissions.document') }}:</strong> {{ formData.document_type }} - {{ formData.document_number }}</p>
                    <p><strong>{{ $t('operations.admissions.legal_status') }}:</strong> {{ formData.legal_status }}</p>
                  </div>
                  <div class="col-md-6">
                    <p><strong>{{ $t('operations.admissions.arrival') }}:</strong> {{ formData.arrival_date }} {{ formData.arrival_time }}</p>
                    <p><strong>{{ $t('operations.admissions.court') }}:</strong> {{ getCourtName(formData.court_id) }}</p>
                    <p><strong>{{ $t('operations.admissions.location') }}:</strong> {{ formData.temporary_location }}</p>
                  </div>
                </div>
              </div>

              <div class="alert alert-warning d-flex align-items-center p-5">
                <KTIcon icon-name="warning" icon-class="fs-2hx text-warning me-4" />
                <div class="d-flex flex-column">
                  <h4 class="mb-1 text-warning">{{ $t('operations.admissions.next_steps_title') }}</h4>
                  <span>{{ $t('operations.admissions.next_steps_description') }}</span>
                  <ul class="mt-2">
                    <li>{{ $t('operations.admissions.step_biometric') }}</li>
                    <li>{{ $t('operations.admissions.step_medical') }}</li>
                    <li>{{ $t('operations.admissions.step_belongings') }}</li>
                    <li>{{ $t('operations.admissions.step_notification') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="d-flex flex-stack pt-10">
            <div class="me-2">
              <button 
                type="button" 
                class="btn btn-light-primary"
                @click="previousStep"
                :disabled="currentStep === 0"
              >
                <KTIcon icon-name="arrow-left" icon-class="fs-2" />
                {{ $t('common.previous') }}
              </button>
            </div>

            <div>
              <button 
                type="button" 
                class="btn btn-primary"
                @click="nextStep"
                v-if="currentStep < steps.length - 1"
              >
                {{ $t('common.continue') }}
                <KTIcon icon-name="arrow-right" icon-class="fs-2" />
              </button>
              
              <button 
                type="button" 
                class="btn btn-success"
                @click="submitAdmission"
                v-if="currentStep === steps.length - 1"
              >
                <KTIcon icon-name="check" icon-class="fs-2" />
                {{ $t('operations.admissions.create_admission') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const { t } = useI18n()

const currentStep = ref(0)
const today = new Date().toISOString().split('T')[0]

const steps = ref([
  {
    title: t('operations.admissions.basic_info'),
    description: t('operations.admissions.basic_info_desc')
  },
  {
    title: t('operations.admissions.quick_registration'),
    description: t('operations.admissions.quick_registration_desc')
  },
  {
    title: t('operations.admissions.confirmation'),
    description: t('operations.admissions.confirmation_desc')
  }
])

const formData = ref({
  arrival_date: today,
  arrival_time: new Date().toTimeString().slice(0, 5),
  document_type: '',
  document_number: '',
  first_name: '',
  last_name: '',
  alias: '',
  court_id: '',
  legal_status: '',
  has_medical_emergency: false,
  has_injuries: false,
  requires_interpreter: false,
  initial_observations: '',
  temporary_location: ''
})

const goToStep = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step
  }
}

const nextStep = () => {
  // Basic validation
  if (currentStep.value === 0) {
    if (!formData.value.document_number || !formData.value.first_name || !formData.value.last_name) {
      Swal.fire({
        icon: 'error',
        title: t('common.error'),
        text: t('operations.admissions.fill_required_fields')
      })
      return
    }
  }
  
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const getCourtName = (courtId: string) => {
  const courts = {
    '1': 'Juzgado de Primera Instancia Penal',
    '2': 'Tribunal de Sentencia'
  }
  return courts[courtId] || ''
}

const submitAdmission = async () => {
  try {
    // TODO: API call to create admission
    
    await Swal.fire({
      icon: 'success',
      title: t('common.success'),
      text: t('operations.admissions.admission_created'),
      confirmButtonText: t('common.continue')
    })
    
    // Redirect to admission detail
    router.push('/operations/admissions/1')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: t('common.error'),
      text: t('operations.admissions.admission_error')
    })
  }
}
</script>

<style scoped>
.stepper-item {
  cursor: pointer;
}

.stepper-item.completed .stepper-icon {
  background-color: #00a3ff;
  color: white;
}

.stepper-item.current .stepper-icon {
  background-color: #f1416c;
  color: white;
}
</style>