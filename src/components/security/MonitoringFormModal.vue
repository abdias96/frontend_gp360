<template>
  <div id="monitoringFormModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ isEditing ? 'Editar Monitoreo' : 'Nuevo Monitoreo de Comunicaciones' }}</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <form @submit.prevent="submitForm">
            <!-- Section 1: Interno -->
            <div class="row mb-7">
              <div class="col-12">
                <InmateSearchInput
                  v-model="selectedInmate"
                  label="Interno"
                  :required="true"
                  :error="errors.inmate_id"
                />
              </div>
            </div>

            <!-- Section 2: Monitoreo -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Monitoreo</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Fecha de Inicio</label>
                <input v-model="form.monitoring_start_date" type="date" class="form-control" :class="{ 'is-invalid': errors.monitoring_start_date }" />
                <div v-if="errors.monitoring_start_date" class="invalid-feedback">{{ errors.monitoring_start_date }}</div>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Fecha de Fin</label>
                <input v-model="form.monitoring_end_date" type="date" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">No. Orden Judicial</label>
                <input v-model="form.court_order_number" type="text" class="form-control" placeholder="Número de orden..." />
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Razón del Monitoreo</label>
                <textarea v-model="form.monitoring_reason" class="form-control" rows="3"
                  :class="{ 'is-invalid': errors.monitoring_reason }"
                  placeholder="Justificación para el monitoreo..."></textarea>
                <div v-if="errors.monitoring_reason" class="invalid-feedback">{{ errors.monitoring_reason }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-md-6 d-flex align-items-end">
                <div class="form-check form-switch">
                  <input v-model="form.monitoring_active" class="form-check-input" type="checkbox" id="monActiveCheck" />
                  <label class="form-check-label" for="monActiveCheck">Monitoreo Activo</label>
                </div>
              </div>
            </div>

            <!-- Section 3: Tipos Monitoreados -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Tipos de Comunicación</h4>
            </div>
            <div class="row mb-7">
              <div class="col-12">
                <div class="d-flex gap-5 flex-wrap">
                  <div class="form-check form-switch">
                    <input v-model="form.phone_calls_monitored" class="form-check-input" type="checkbox" id="phoneCheck" />
                    <label class="form-check-label" for="phoneCheck"><i class="fas fa-phone me-1"></i>Llamadas Telefónicas</label>
                  </div>
                  <div class="form-check form-switch">
                    <input v-model="form.letters_monitored" class="form-check-input" type="checkbox" id="lettersCheck" />
                    <label class="form-check-label" for="lettersCheck"><i class="fas fa-envelope me-1"></i>Correspondencia</label>
                  </div>
                  <div class="form-check form-switch">
                    <input v-model="form.visits_monitored" class="form-check-input" type="checkbox" id="visitsCheck" />
                    <label class="form-check-label" for="visitsCheck"><i class="fas fa-user-friends me-1"></i>Visitas</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <div class="form-check form-switch">
                  <input v-model="form.legal_communications_protected" class="form-check-input" type="checkbox" id="legalProtectedCheck" />
                  <label class="form-check-label" for="legalProtectedCheck">
                    <i class="fas fa-gavel me-1"></i>Comunicaciones Legales Protegidas
                    <small class="text-muted d-block">Las comunicaciones con abogados defensores no serán monitoreadas</small>
                  </label>
                </div>
              </div>
            </div>

            <!-- Section 4: Hallazgos (solo edición) -->
            <div v-if="isEditing">
              <div class="mb-4">
                <h4 class="fs-6 fw-bold text-gray-800">Hallazgos</h4>
              </div>
              <div class="row mb-7">
                <div class="col-12">
                  <label class="fs-6 fw-semibold mb-2">Actividades Sospechosas</label>
                  <textarea v-model="form.suspicious_activities" class="form-control" rows="2"
                    placeholder="Actividades sospechosas detectadas..."></textarea>
                </div>
              </div>
              <div class="row mb-7">
                <div class="col-12">
                  <label class="fs-6 fw-semibold mb-2">Inteligencia Recopilada</label>
                  <textarea v-model="form.intelligence_gathered" class="form-control" rows="2"
                    placeholder="Información de inteligencia obtenida..."></textarea>
                </div>
              </div>
              <div class="row mb-7">
                <div class="col-md-4">
                  <div class="form-check form-switch">
                    <input v-model="form.extortion_evidence_found" class="form-check-input" type="checkbox" id="extEvidence" />
                    <label class="form-check-label" for="extEvidence">Evidencia de Extorsión</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-check form-switch">
                    <input v-model="form.gang_coordination_found" class="form-check-input" type="checkbox" id="gangCoord" />
                    <label class="form-check-label" for="gangCoord">Coordinación de Pandillas</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-check form-switch">
                    <input v-model="form.escape_planning_found" class="form-check-input" type="checkbox" id="escapePlan" />
                    <label class="form-check-label" for="escapePlan">Planificación de Fuga</label>
                  </div>
                </div>
              </div>

              <!-- Section 5: Reporte -->
              <div class="mb-4">
                <h4 class="fs-6 fw-bold text-gray-800">Reporte a Autoridades</h4>
              </div>
              <div class="row mb-7">
                <div class="col-md-4">
                  <div class="form-check form-switch">
                    <input v-model="form.reported_to_authorities" class="form-check-input" type="checkbox" id="reportedAuth" />
                    <label class="form-check-label" for="reportedAuth">Reportado a Autoridades</label>
                  </div>
                </div>
                <div v-if="form.reported_to_authorities" class="col-md-4">
                  <label class="fs-6 fw-semibold mb-2">No. de Reporte</label>
                  <input v-model="form.authority_report_number" type="text" class="form-control" placeholder="Número de reporte..." />
                </div>
              </div>
              <div class="row mb-7">
                <div class="col-12">
                  <label class="fs-6 fw-semibold mb-2">Acciones Preventivas</label>
                  <textarea v-model="form.preventive_actions" class="form-control" rows="2"
                    placeholder="Acciones preventivas tomadas..."></textarea>
                </div>
              </div>
            </div>

            <div class="text-center pt-5">
              <button type="button" class="btn btn-light me-3" @click="close">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar' : 'Crear Monitoreo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import InmateSearchInput from '@/components/shared/InmateSearchInput.vue';

const props = defineProps<{ monitoring?: any; isEditing: boolean }>();
const emit = defineEmits(['saved']);

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
const saving = ref(false);
const selectedInmate = ref<any>(null);
const errors = ref<Record<string, string>>({});

const defaultForm = () => ({
  monitoring_start_date: new Date().toISOString().split('T')[0],
  monitoring_end_date: '',
  monitoring_reason: '',
  court_order_number: '',
  phone_calls_monitored: false,
  letters_monitored: false,
  visits_monitored: false,
  legal_communications_protected: true,
  monitoring_active: true,
  suspicious_activities: '',
  intelligence_gathered: '',
  extortion_evidence_found: false,
  gang_coordination_found: false,
  escape_planning_found: false,
  preventive_actions: '',
  reported_to_authorities: false,
  authority_report_number: '',
});

const form = ref(defaultForm());

const populateForm = () => {
  const val = props.monitoring;
  if (val && props.isEditing) {
    form.value = {
      monitoring_start_date: val.monitoring_start_date ? val.monitoring_start_date.substring(0, 10) : '',
      monitoring_end_date: val.monitoring_end_date ? val.monitoring_end_date.substring(0, 10) : '',
      monitoring_reason: val.monitoring_reason || '',
      court_order_number: val.court_order_number || '',
      phone_calls_monitored: val.phone_calls_monitored || false,
      letters_monitored: val.letters_monitored || false,
      visits_monitored: val.visits_monitored || false,
      legal_communications_protected: val.legal_communications_protected ?? true,
      monitoring_active: val.monitoring_active ?? true,
      suspicious_activities: val.suspicious_activities || '',
      intelligence_gathered: val.intelligence_gathered || '',
      extortion_evidence_found: val.extortion_evidence_found || false,
      gang_coordination_found: val.gang_coordination_found || false,
      escape_planning_found: val.escape_planning_found || false,
      preventive_actions: val.preventive_actions || '',
      reported_to_authorities: val.reported_to_authorities || false,
      authority_report_number: val.authority_report_number || '',
    };
    selectedInmate.value = val.inmate || null;
  } else {
    form.value = defaultForm();
    selectedInmate.value = null;
  }
};

const validate = () => {
  errors.value = {};
  if (!selectedInmate.value) errors.value.inmate_id = 'El interno es requerido';
  if (!form.value.monitoring_start_date) errors.value.monitoring_start_date = 'La fecha de inicio es requerida';
  if (!form.value.monitoring_reason) errors.value.monitoring_reason = 'La razón es requerida';
  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const payload: any = {
      inmate_id: selectedInmate.value.id,
      ...form.value,
    };
    if (!payload.monitoring_end_date) delete payload.monitoring_end_date;
    if (!payload.court_order_number) delete payload.court_order_number;
    if (!payload.suspicious_activities) delete payload.suspicious_activities;
    if (!payload.intelligence_gathered) delete payload.intelligence_gathered;
    if (!payload.preventive_actions) delete payload.preventive_actions;
    if (!payload.authority_report_number) delete payload.authority_report_number;

    if (props.isEditing && props.monitoring?.id) {
      await ApiService.put(`/security/communication-monitoring/${props.monitoring.id}`, payload);
    } else {
      await ApiService.post('/security/communication-monitoring', payload);
    }
    emit('saved');
    close();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al guardar' });
  } finally { saving.value = false; }
};

const open = () => {
  populateForm();
  if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};
const close = () => { modalInstance?.hide(); errors.value = {}; };

defineExpose({ open, close });
</script>
