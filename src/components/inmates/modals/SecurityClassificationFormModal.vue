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
              <span class="path1"></span><span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <form @submit.prevent="submitForm">
            <!-- Section 1: Interno -->
            <div v-if="!isEditing" class="row mb-7">
              <div class="col-12">
                <InmateSearchInput
                  v-model="selectedInmate"
                  label="Interno a Clasificar"
                  :required="true"
                  :error="errors.inmate_id"
                />
              </div>
            </div>

            <!-- Section 2: Clasificación -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Clasificación</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Nivel de Seguridad</label>
                <select
                  v-model="form.security_level"
                  class="form-select"
                  :class="{ 'is-invalid': errors.security_level }"
                >
                  <option value="">Seleccionar nivel...</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                  <option value="maximum">Máximo</option>
                </select>
                <div v-if="errors.security_level" class="invalid-feedback">{{ errors.security_level }}</div>
              </div>
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
                <label class="required fs-6 fw-semibold mb-2">Próxima Revisión</label>
                <input
                  v-model="form.next_review_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.next_review_date }"
                />
                <div v-if="errors.next_review_date" class="invalid-feedback">{{ errors.next_review_date }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Razones de Clasificación</label>
                <textarea
                  v-model="form.classification_reasons"
                  class="form-control"
                  :class="{ 'is-invalid': errors.classification_reasons }"
                  rows="3"
                  placeholder="Describa las razones para esta clasificación..."
                ></textarea>
                <div v-if="errors.classification_reasons" class="invalid-feedback">{{ errors.classification_reasons }}</div>
              </div>
            </div>

            <!-- Section 3: Evaluación de Riesgo -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Evaluación de Riesgo</h4>
            </div>
            <div class="row mb-5">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Riesgo de Violencia (0-10)</label>
                <input
                  v-model.number="form.violence_risk_score"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.violence_risk_score }"
                  min="0" max="10"
                />
                <div v-if="errors.violence_risk_score" class="invalid-feedback">{{ errors.violence_risk_score }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Riesgo de Fuga (0-10)</label>
                <input
                  v-model.number="form.escape_risk_score"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.escape_risk_score }"
                  min="0" max="10"
                />
                <div v-if="errors.escape_risk_score" class="invalid-feedback">{{ errors.escape_risk_score }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Influencia Pandillera (0-10)</label>
                <input
                  v-model.number="form.gang_influence_score"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.gang_influence_score }"
                  min="0" max="10"
                />
                <div v-if="errors.gang_influence_score" class="invalid-feedback">{{ errors.gang_influence_score }}</div>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Amenaza a Víctimas (0-10)</label>
                <input
                  v-model.number="form.victim_threat_score"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.victim_threat_score }"
                  min="0" max="10"
                />
                <div v-if="errors.victim_threat_score" class="invalid-feedback">{{ errors.victim_threat_score }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Riesgo de Corrupción (0-10)</label>
                <input
                  v-model.number="form.corruption_risk_score"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.corruption_risk_score }"
                  min="0" max="10"
                />
                <div v-if="errors.corruption_risk_score" class="invalid-feedback">{{ errors.corruption_risk_score }}</div>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Riesgo Total (0-50)</label>
                <input
                  :value="overallRiskScore"
                  type="number"
                  class="form-control bg-light"
                  disabled
                />
                <div class="text-muted fs-7 mt-1">Auto-calculado</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Clasificación de Riesgo</label>
                <select v-model="form.risk_classification_id" class="form-select">
                  <option :value="null">Ninguna</option>
                  <option
                    v-for="rc in riskClassifications"
                    :key="rc.id"
                    :value="rc.id"
                  >{{ rc.name }}</option>
                </select>
              </div>
            </div>

            <!-- Section 4: Restricciones -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Restricciones</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.requires_single_cell" class="form-check-input" type="checkbox" id="singleCell" />
                  <label class="form-check-label" for="singleCell">Celda Individual</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.limited_recreation_time" class="form-check-input" type="checkbox" id="limitedRec" />
                  <label class="form-check-label" for="limitedRec">Recreación Limitada</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.restricted_visits" class="form-check-input" type="checkbox" id="restrictVisits" />
                  <label class="form-check-label" for="restrictVisits">Visitas Restringidas</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.monitored_communications" class="form-check-input" type="checkbox" id="monComms" />
                  <label class="form-check-label" for="monComms">Comunicaciones Monitoreadas</label>
                </div>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.escort_required" class="form-check-input" type="checkbox" id="escortReq" />
                  <label class="form-check-label" for="escortReq">Escolta Requerida</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.restricted_work_assignments" class="form-check-input" type="checkbox" id="restrictWork" />
                  <label class="form-check-label" for="restrictWork">Trabajo Restringido</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-check form-check-custom form-check-solid mb-3">
                  <input v-model="form.medical_isolation" class="form-check-input" type="checkbox" id="medIsolation" />
                  <label class="form-check-label" for="medIsolation">Aislamiento Médico</label>
                </div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Restricciones Específicas</label>
                <textarea
                  v-model="form.specific_restrictions"
                  class="form-control"
                  rows="2"
                  placeholder="Restricciones adicionales en formato libre..."
                ></textarea>
              </div>
            </div>

            <!-- Section 5: Notas -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Notas de Compatibilidad</label>
                <textarea
                  v-model="form.compatibility_notes"
                  class="form-control"
                  rows="3"
                  placeholder="Notas sobre compatibilidad con otros internos..."
                ></textarea>
              </div>
            </div>

            <div class="text-center pt-5">
              <button type="button" class="btn btn-light me-3" @click="close">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar Clasificación' : 'Crear Clasificación' }}
              </button>
            </div>
          </form>
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
import InmateSearchInput from '@/components/shared/InmateSearchInput.vue';

interface Props {
  classification?: any;
  inmate?: any;
  show: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  saved: [classification: any];
}>();

const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();
const saving = ref(false);
const selectedInmate = ref<any>(null);
const riskClassifications = ref<any[]>([]);
const errors = ref<Record<string, string>>({});

const isEditing = computed(() => !!props.classification);

const defaultForm = () => ({
  security_level: '',
  classification_date: new Date().toISOString().split('T')[0],
  next_review_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  classification_reasons: '',
  violence_risk_score: 0,
  escape_risk_score: 0,
  gang_influence_score: 0,
  victim_threat_score: 0,
  corruption_risk_score: 0,
  overall_risk_score: 0,
  risk_classification_id: null as number | null,
  requires_single_cell: false,
  limited_recreation_time: false,
  restricted_visits: false,
  monitored_communications: false,
  escort_required: false,
  restricted_work_assignments: false,
  medical_isolation: false,
  specific_restrictions: '',
  compatibility_notes: '',
});

const form = ref(defaultForm());

const overallRiskScore = computed(() => {
  return (form.value.violence_risk_score || 0)
    + (form.value.escape_risk_score || 0)
    + (form.value.gang_influence_score || 0)
    + (form.value.victim_threat_score || 0)
    + (form.value.corruption_risk_score || 0);
});

watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
      await loadCatalogs();

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
  }
});

const loadCatalogs = async () => {
  try {
    const res = await ApiService.get('/catalogs/risk-classifications?simple=true');
    riskClassifications.value = res.data?.data || [];
  } catch (e) {
    console.error('Error loading catalogs:', e);
  }
};

const populateForm = () => {
  if (!props.classification) return;
  const c = props.classification;
  form.value = {
    security_level: c.security_level || '',
    classification_date: c.classification_date ? c.classification_date.substring(0, 10) : '',
    next_review_date: c.next_review_date ? c.next_review_date.substring(0, 10) : '',
    classification_reasons: c.classification_reasons || '',
    violence_risk_score: c.violence_risk_score || 0,
    escape_risk_score: c.escape_risk_score || 0,
    gang_influence_score: c.gang_influence_score || 0,
    victim_threat_score: c.victim_threat_score || 0,
    corruption_risk_score: c.corruption_risk_score || 0,
    overall_risk_score: c.overall_risk_score || 0,
    risk_classification_id: c.risk_classification_id || null,
    requires_single_cell: c.requires_single_cell || false,
    limited_recreation_time: c.limited_recreation_time || false,
    restricted_visits: c.restricted_visits || false,
    monitored_communications: c.monitored_communications || false,
    escort_required: c.escort_required || false,
    restricted_work_assignments: c.restricted_work_assignments || false,
    medical_isolation: c.medical_isolation || false,
    specific_restrictions: c.specific_restrictions || '',
    compatibility_notes: c.compatibility_notes || '',
  };
  selectedInmate.value = c.inmate || null;
};

const resetForm = () => {
  form.value = defaultForm();
  errors.value = {};
  selectedInmate.value = props.inmate || null;
};

const validate = () => {
  errors.value = {};

  if (!isEditing.value && !selectedInmate.value) {
    errors.value.inmate_id = 'El interno es requerido';
  }
  if (!form.value.security_level) errors.value.security_level = 'El nivel de seguridad es requerido';
  if (!form.value.classification_date) errors.value.classification_date = 'La fecha de clasificación es requerida';
  if (!form.value.next_review_date) errors.value.next_review_date = 'La fecha de revisión es requerida';
  if (!form.value.classification_reasons) errors.value.classification_reasons = 'Las razones son requeridas';

  const scoreFields = ['violence_risk_score', 'escape_risk_score', 'gang_influence_score', 'victim_threat_score', 'corruption_risk_score'] as const;
  for (const field of scoreFields) {
    const val = form.value[field];
    if (val === null || val === undefined || val === '' as any) {
      errors.value[field] = 'Este campo es requerido';
    } else if (val < 0 || val > 10) {
      errors.value[field] = 'Debe ser entre 0 y 10';
    }
  }

  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validate()) return;

  saving.value = true;
  try {
    const payload: any = {
      ...form.value,
      overall_risk_score: overallRiskScore.value,
    };

    if (!isEditing.value) {
      payload.inmate_id = selectedInmate.value.id;
    }

    if (!payload.risk_classification_id) delete payload.risk_classification_id;
    if (payload.specific_restrictions) {
      payload.specific_restrictions = payload.specific_restrictions.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else {
      delete payload.specific_restrictions;
    }
    if (!payload.compatibility_notes) delete payload.compatibility_notes;

    const url = isEditing.value
      ? `/inmate-security-classifications/${props.classification.id}`
      : '/inmate-security-classifications';
    const method = isEditing.value ? 'put' : 'post';

    const response = await ApiService[method](url, payload);

    if (response.data.success) {
      await Swal.fire({
        title: 'Clasificación guardada',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      emit('saved', response.data.data);
    }
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    }
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar la clasificación',
      icon: 'error',
    });
  } finally {
    saving.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>
