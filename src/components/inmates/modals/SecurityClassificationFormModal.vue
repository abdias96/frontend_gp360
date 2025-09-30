<template>
  <div 
    id="securityClassificationFormModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ isEditing ? 'Editar Clasificación de Seguridad' : 'Nueva Clasificación de Seguridad' }}
          </h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border spinner-border-lg text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitForm" ref="formRef">
            <!-- Inmate Selection -->
            <div v-if="!isEditing" class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Interno a Clasificar</label>
                <select
                  v-model="form.inmate_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.inmate_id }"
                  @change="onInmateChange"
                >
                  <option value="">Seleccionar interno...</option>
                  <option v-for="inmate in inmates" :key="inmate.id" :value="inmate.id">
                    {{ inmate.full_name }} - {{ inmate.inmate_number }}
                  </option>
                </select>
                <div v-if="errors.inmate_id" class="invalid-feedback">{{ errors.inmate_id }}</div>
              </div>
            </div>

            <!-- Current Inmate Info (Read-only) -->
            <div v-if="selectedInmate" class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Interno Seleccionado</label>
                <div class="card border border-dashed border-primary">
                  <div class="card-body p-4">
                    <div class="row">
                      <div class="col-md-3">
                        <strong>Nombre:</strong><br>
                        <span class="text-muted">{{ getInmateName(selectedInmate) }}</span>
                      </div>
                      <div class="col-md-3">
                        <strong>Número:</strong><br>
                        <span class="text-muted">{{ selectedInmate.inmate_number }}</span>
                      </div>
                      <div class="col-md-3">
                        <strong>Centro:</strong><br>
                        <span class="text-muted">{{ selectedInmate.current_center?.name || 'N/A' }}</span>
                      </div>
                      <div class="col-md-3">
                        <strong>Sector:</strong><br>
                        <span class="text-muted">{{ selectedInmate.current_sector?.name || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Classification Basic Info -->
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Nivel de Clasificación</label>
                <select
                  v-model="form.classification_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.classification_level }"
                >
                  <option value="">Seleccionar nivel...</option>
                  <option value="minimum">Mínimo</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="maximum">Máximo</option>
                  <option value="super_maximum">Super Máximo</option>
                </select>
                <div v-if="errors.classification_level" class="invalid-feedback">{{ errors.classification_level }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Tipo de Clasificación</label>
                <select
                  v-model="form.classification_type"
                  class="form-select"
                  :class="{ 'is-invalid': errors.classification_type }"
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="initial">Inicial</option>
                  <option value="review">Revisión</option>
                  <option value="incident_based">Basada en Incidente</option>
                  <option value="appeal_result">Resultado de Apelación</option>
                  <option value="medical_reclassification">Reclasificación Médica</option>
                </select>
                <div v-if="errors.classification_type" class="invalid-feedback">{{ errors.classification_type }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Nivel de Supervisión</label>
                <select
                  v-model="form.supervision_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.supervision_level }"
                >
                  <option value="">Seleccionar supervisión...</option>
                  <option value="minimum">Mínimo</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="maximum">Máximo</option>
                </select>
                <div v-if="errors.supervision_level" class="invalid-feedback">{{ errors.supervision_level }}</div>
              </div>
            </div>

            <!-- Risk Levels -->
            <div class="row mb-7">
              <div class="col-12 mb-4">
                <h4 class="fs-6 fw-bold text-gray-800">Niveles de Riesgo</h4>
              </div>
              <div class="col-md-3">
                <label class="required fs-6 fw-semibold mb-2">Riesgo de Violencia</label>
                <select
                  v-model="form.violence_risk_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.violence_risk_level }"
                >
                  <option value="">Seleccionar...</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="extreme">Extremo</option>
                </select>
                <div v-if="errors.violence_risk_level" class="invalid-feedback">{{ errors.violence_risk_level }}</div>
              </div>
              <div class="col-md-3">
                <label class="required fs-6 fw-semibold mb-2">Riesgo de Fuga</label>
                <select
                  v-model="form.escape_risk_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.escape_risk_level }"
                >
                  <option value="">Seleccionar...</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="extreme">Extremo</option>
                </select>
                <div v-if="errors.escape_risk_level" class="invalid-feedback">{{ errors.escape_risk_level }}</div>
              </div>
              <div class="col-md-3">
                <label class="required fs-6 fw-semibold mb-2">Riesgo de Pandillas</label>
                <select
                  v-model="form.gang_affiliation_risk"
                  class="form-select"
                  :class="{ 'is-invalid': errors.gang_affiliation_risk }"
                >
                  <option value="">Seleccionar...</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="extreme">Extremo</option>
                </select>
                <div v-if="errors.gang_affiliation_risk" class="invalid-feedback">{{ errors.gang_affiliation_risk }}</div>
              </div>
              <div class="col-md-3">
                <label class="fs-6 fw-semibold mb-2">Puntuación de Riesgo</label>
                <input
                  v-model.number="form.risk_score"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.risk_score }"
                  min="0"
                  max="100"
                  placeholder="0-100"
                />
                <div v-if="errors.risk_score" class="invalid-feedback">{{ errors.risk_score }}</div>
              </div>
            </div>

            <!-- Additional Risk Levels -->
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Riesgo Institucional</label>
                <select
                  v-model="form.institutional_risk_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.institutional_risk_level }"
                >
                  <option value="">Seleccionar...</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="extreme">Extremo</option>
                </select>
                <div v-if="errors.institutional_risk_level" class="invalid-feedback">{{ errors.institutional_risk_level }}</div>
              </div>
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Riesgo Externo</label>
                <select
                  v-model="form.external_risk_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.external_risk_level }"
                >
                  <option value="">Seleccionar...</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="extreme">Extremo</option>
                </select>
                <div v-if="errors.external_risk_level" class="invalid-feedback">{{ errors.external_risk_level }}</div>
              </div>
            </div>

            <!-- Dates -->
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Fecha de Clasificación</label>
                <input
                  v-model="form.classification_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.classification_date }"
                />
                <div v-if="errors.classification_date" class="invalid-feedback">{{ errors.classification_date }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Fecha de Vigencia</label>
                <input
                  v-model="form.effective_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.effective_date }"
                />
                <div v-if="errors.effective_date" class="invalid-feedback">{{ errors.effective_date }}</div>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Fecha de Revisión</label>
                <input
                  v-model="form.review_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.review_date }"
                />
                <div v-if="errors.review_date" class="invalid-feedback">{{ errors.review_date }}</div>
              </div>
            </div>

            <!-- Special Status Indicators -->
            <div class="row mb-7">
              <div class="col-12 mb-4">
                <h4 class="fs-6 fw-bold text-gray-800">Estados Especiales</h4>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.protective_custody_indicator"
                    class="form-check-input"
                    type="checkbox"
                    id="protective_custody"
                  />
                  <label class="form-check-label" for="protective_custody">
                    Custodia Protectiva
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.administrative_segregation"
                    class="form-check-input"
                    type="checkbox"
                    id="admin_segregation"
                  />
                  <label class="form-check-label" for="admin_segregation">
                    Segregación Administrativa
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.disciplinary_segregation"
                    class="form-check-input"
                    type="checkbox"
                    id="disc_segregation"
                  />
                  <label class="form-check-label" for="disc_segregation">
                    Segregación Disciplinaria
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.medical_isolation"
                    class="form-check-input"
                    type="checkbox"
                    id="medical_isolation"
                  />
                  <label class="form-check-label" for="medical_isolation">
                    Aislamiento Médico
                  </label>
                </div>
              </div>
            </div>

            <!-- Additional Special Status -->
            <div class="row mb-7">
              <div class="col-md-4">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.mental_health_designation"
                    class="form-check-input"
                    type="checkbox"
                    id="mental_health"
                  />
                  <label class="form-check-label" for="mental_health">
                    Designación de Salud Mental
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    v-model="form.suicide_watch"
                    class="form-check-input"
                    type="checkbox"
                    id="suicide_watch"
                  />
                  <label class="form-check-label" for="suicide_watch">
                    Vigilancia Suicidio
                  </label>
                </div>
              </div>
            </div>

            <!-- Protective Custody Reason -->
            <div v-if="form.protective_custody_indicator" class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Razón de Custodia Protectiva</label>
                <textarea
                  v-model="form.protective_custody_reason"
                  class="form-control"
                  rows="3"
                  placeholder="Describa la razón para la custodia protectiva..."
                ></textarea>
              </div>
            </div>

            <!-- Reason and Notes -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Razón de Clasificación</label>
                <textarea
                  v-model="form.classification_reason"
                  class="form-control"
                  :class="{ 'is-invalid': errors.classification_reason }"
                  rows="3"
                  placeholder="Describa la razón para esta clasificación..."
                ></textarea>
                <div v-if="errors.classification_reason" class="invalid-feedback">{{ errors.classification_reason }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Notas de Clasificación</label>
                <textarea
                  v-model="form.classification_notes"
                  class="form-control"
                  rows="4"
                  placeholder="Observaciones adicionales sobre la clasificación..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="submitForm"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isEditing ? 'Actualizar Clasificación' : 'Crear Clasificación' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

// Props
interface Props {
  classification?: any;
  inmate?: any;
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  saved: [classification: any];
}>();

// State
const modalRef = ref<HTMLElement>();
const formRef = ref<HTMLFormElement>();
const loading = ref(false);
const saving = ref(false);
const modal = ref<Modal>();

// Data
const inmates = ref<any[]>([]);
const selectedInmate = ref<any>(null);

// Form data
const form = ref({
  inmate_id: '',
  classification_level: '',
  classification_type: 'initial',
  risk_score: 0,
  violence_risk_level: '',
  escape_risk_level: '',
  gang_affiliation_risk: '',
  institutional_risk_level: '',
  external_risk_level: '',
  classification_date: '',
  effective_date: '',
  review_date: '',
  classification_reason: '',
  supervision_level: '',
  protective_custody_indicator: false,
  protective_custody_reason: '',
  administrative_segregation: false,
  disciplinary_segregation: false,
  medical_isolation: false,
  mental_health_designation: false,
  suicide_watch: false,
  classification_notes: ''
});

// Errors
const errors = ref<{ [key: string]: string }>({});

// Computed
const isEditing = computed(() => !!props.classification);

// Watchers
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadInitialData();
      
      if (props.classification) {
        populateForm();
      } else {
        resetForm();
      }
    }
  } else {
    modal.value?.hide();
  }
});

watch(() => props.inmate, (inmate) => {
  if (inmate) {
    selectedInmate.value = inmate;
    form.value.inmate_id = inmate.id;
  }
});

// Methods
const loadInitialData = async () => {
  try {
    loading.value = true;
    
    if (!isEditing.value) {
      const response = await ApiService.get('/inmates?per_page=1000&status=active');
      inmates.value = response.data.data.data || response.data.data;
    }
    
  } catch (error) {
    console.error('Error loading initial data:', error);
    await Swal.fire({
      title: 'Error',
      text: 'Error al cargar los datos iniciales',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const onInmateChange = () => {
  if (form.value.inmate_id) {
    selectedInmate.value = inmates.value.find(i => i.id.toString() === form.value.inmate_id.toString());
  } else {
    selectedInmate.value = null;
  }
};

const populateForm = () => {
  if (props.classification) {
    Object.assign(form.value, {
      inmate_id: props.classification.inmate_id,
      classification_level: props.classification.classification_level,
      classification_type: props.classification.classification_type,
      risk_score: props.classification.risk_score || 0,
      violence_risk_level: props.classification.violence_risk_level,
      escape_risk_level: props.classification.escape_risk_level,
      gang_affiliation_risk: props.classification.gang_affiliation_risk,
      institutional_risk_level: props.classification.institutional_risk_level,
      external_risk_level: props.classification.external_risk_level,
      classification_date: props.classification.classification_date,
      effective_date: props.classification.effective_date,
      review_date: props.classification.review_date || '',
      classification_reason: props.classification.classification_reason,
      supervision_level: props.classification.supervision_level,
      protective_custody_indicator: props.classification.protective_custody_indicator || false,
      protective_custody_reason: props.classification.protective_custody_reason || '',
      administrative_segregation: props.classification.administrative_segregation || false,
      disciplinary_segregation: props.classification.disciplinary_segregation || false,
      medical_isolation: props.classification.medical_isolation || false,
      mental_health_designation: props.classification.mental_health_designation || false,
      suicide_watch: props.classification.suicide_watch || false,
      classification_notes: props.classification.classification_notes || ''
    });
    
    selectedInmate.value = props.classification.inmate;
  }
};

const resetForm = () => {
  Object.assign(form.value, {
    inmate_id: props.inmate?.id || '',
    classification_level: '',
    classification_type: 'initial',
    risk_score: 0,
    violence_risk_level: '',
    escape_risk_level: '',
    gang_affiliation_risk: '',
    institutional_risk_level: '',
    external_risk_level: '',
    classification_date: new Date().toISOString().split('T')[0],
    effective_date: new Date().toISOString().split('T')[0],
    review_date: '',
    classification_reason: '',
    supervision_level: '',
    protective_custody_indicator: false,
    protective_custody_reason: '',
    administrative_segregation: false,
    disciplinary_segregation: false,
    medical_isolation: false,
    mental_health_designation: false,
    suicide_watch: false,
    classification_notes: ''
  });
  
  errors.value = {};
  selectedInmate.value = props.inmate || null;
};

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.inmate_id) {
    errors.value.inmate_id = 'El interno es requerido';
  }
  
  if (!form.value.classification_level) {
    errors.value.classification_level = 'El nivel de clasificación es requerido';
  }
  
  if (!form.value.classification_type) {
    errors.value.classification_type = 'El tipo de clasificación es requerido';
  }
  
  if (!form.value.violence_risk_level) {
    errors.value.violence_risk_level = 'El riesgo de violencia es requerido';
  }
  
  if (!form.value.escape_risk_level) {
    errors.value.escape_risk_level = 'El riesgo de fuga es requerido';
  }
  
  if (!form.value.gang_affiliation_risk) {
    errors.value.gang_affiliation_risk = 'El riesgo de pandillas es requerido';
  }
  
  if (!form.value.institutional_risk_level) {
    errors.value.institutional_risk_level = 'El riesgo institucional es requerido';
  }
  
  if (!form.value.external_risk_level) {
    errors.value.external_risk_level = 'El riesgo externo es requerido';
  }
  
  if (!form.value.classification_date) {
    errors.value.classification_date = 'La fecha de clasificación es requerida';
  }
  
  if (!form.value.effective_date) {
    errors.value.effective_date = 'La fecha de vigencia es requerida';
  }
  
  if (!form.value.classification_reason) {
    errors.value.classification_reason = 'La razón de clasificación es requerida';
  }
  
  if (!form.value.supervision_level) {
    errors.value.supervision_level = 'El nivel de supervisión es requerido';
  }
  
  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    saving.value = true;
    
    const url = isEditing.value ? `/inmate-security-classifications/${props.classification.id}` : '/inmate-security-classifications';
    const method = isEditing.value ? 'put' : 'post';
    
    const response = await ApiService[method](url, form.value);
    
    if (response.data.success) {
      await Swal.fire({
        title: '¡Éxito!',
        text: isEditing.value 
          ? 'La clasificación de seguridad ha sido actualizada correctamente'
          : 'La clasificación de seguridad ha sido creada correctamente',
        icon: 'success',
        timer: 2000
      });
      
      emit('saved', response.data.data);
    }
  } catch (error: any) {
    console.error('Error saving classification:', error);
    
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    }
    
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar la clasificación de seguridad',
      icon: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

// Utility functions
const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return `${inmate.first_name} ${inmate.last_name}`;
};

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>