<template>
  <div id="incidentFormModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">
            {{ isEditing ? 'Editar Incidente de Seguridad' : 'Nuevo Incidente de Seguridad' }}
          </h2>
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
                  label="Interno Involucrado"
                  :required="true"
                  :error="errors.inmate_id"
                />
              </div>
            </div>

            <!-- Section 2: Incidente -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Incidente</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Tipo de Incidente</label>
                <select v-model="form.incident_type" class="form-select" :class="{ 'is-invalid': errors.incident_type }">
                  <option value="">Seleccionar tipo...</option>
                  <option v-for="t in incidentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
                <div v-if="errors.incident_type" class="invalid-feedback">{{ errors.incident_type }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Severidad</label>
                <select v-model="form.severity_level" class="form-select" :class="{ 'is-invalid': errors.severity_level }">
                  <option value="">Seleccionar...</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
                <div v-if="errors.severity_level" class="invalid-feedback">{{ errors.severity_level }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Fecha y Hora</label>
                <input v-model="form.incident_date" type="datetime-local" class="form-control"
                  :class="{ 'is-invalid': errors.incident_date }" />
                <div v-if="errors.incident_date" class="invalid-feedback">{{ errors.incident_date }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-md-6">
                <label class="required fs-6 fw-semibold mb-2">Ubicación</label>
                <input v-model="form.location" type="text" class="form-control"
                  :class="{ 'is-invalid': errors.location }"
                  placeholder="Lugar dentro del centro..." />
                <div v-if="errors.location" class="invalid-feedback">{{ errors.location }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Descripción del Incidente</label>
                <textarea v-model="form.incident_description" class="form-control" rows="3"
                  :class="{ 'is-invalid': errors.incident_description }"
                  placeholder="Describa detalladamente lo ocurrido..."></textarea>
                <div v-if="errors.incident_description" class="invalid-feedback">{{ errors.incident_description }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Circunstancias</label>
                <textarea v-model="form.circumstances" class="form-control" rows="2"
                  placeholder="Circunstancias que rodearon el incidente..."></textarea>
              </div>
            </div>

            <!-- Section 3: Evidencia -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Evidencia y Declaraciones</h4>
            </div>
            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Evidencia Recolectada</label>
                <textarea v-model="form.evidence_collected" class="form-control" rows="2"
                  placeholder="Describa la evidencia recolectada..."></textarea>
              </div>
            </div>
            <div class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Declaraciones del Personal</label>
                <textarea v-model="form.staff_statements" class="form-control" rows="2"
                  placeholder="Declaraciones de guardias/personal..."></textarea>
              </div>
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Declaración del Interno</label>
                <textarea v-model="form.inmate_statement" class="form-control" rows="2"
                  placeholder="Declaración del interno involucrado..."></textarea>
              </div>
            </div>

            <!-- Section 4: Resolución -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Resolución</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Estado</label>
                <select v-model="form.resolution_status" class="form-select">
                  <option value="pending">Pendiente</option>
                  <option value="investigating">En Investigación</option>
                  <option value="resolved">Resuelto</option>
                  <option value="dismissed">Desestimado</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">Fecha de Resolución</label>
                <input v-model="form.resolution_date" type="date" class="form-control" />
              </div>
            </div>

            <div v-if="form.resolution_status !== 'pending'" class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Detalles de Resolución</label>
                <textarea v-model="form.resolution_details" class="form-control" rows="2"
                  placeholder="Detalles de la resolución..."></textarea>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Sanciones Aplicadas</label>
                <textarea v-model="form.sanctions_applied" class="form-control" rows="2"
                  placeholder="Sanciones aplicadas como resultado..."></textarea>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-md-6">
                <div class="form-check form-switch mb-3">
                  <input v-model="form.requires_follow_up" class="form-check-input" type="checkbox" id="followupCheck" />
                  <label class="form-check-label" for="followupCheck">Requiere Seguimiento</label>
                </div>
                <div v-if="form.requires_follow_up">
                  <label class="fs-6 fw-semibold mb-2">Fecha de Seguimiento</label>
                  <input v-model="form.follow_up_date" type="date" class="form-control" />
                </div>
              </div>
            </div>

            <!-- Section 5: Impacto -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Impacto</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <input v-model="form.affects_security_level" class="form-check-input" type="checkbox" id="affectsLevel" />
                  <label class="form-check-label" for="affectsLevel">Afecta Nivel de Seguridad</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <input v-model="form.reported_to_prosecutor" class="form-check-input" type="checkbox" id="prosecutor" />
                  <label class="form-check-label" for="prosecutor">Reportado al MP</label>
                </div>
              </div>
              <div v-if="form.reported_to_prosecutor" class="col-md-4">
                <label class="fs-6 fw-semibold mb-2">No. Expediente MP</label>
                <input v-model="form.prosecutor_case_number" type="text" class="form-control"
                  placeholder="Número de caso..." />
              </div>
            </div>

            <div class="text-center pt-5">
              <button type="button" class="btn btn-light me-3" @click="close">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar' : 'Registrar' }}
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

const props = defineProps<{ incident?: any; isEditing: boolean }>();
const emit = defineEmits(['saved']);

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
const saving = ref(false);
const selectedInmate = ref<any>(null);
const errors = ref<Record<string, string>>({});

const incidentTypes = [
  { value: 'violence_against_inmate', label: 'Violencia contra PPL' },
  { value: 'violence_against_staff', label: 'Violencia contra personal' },
  { value: 'gang_activity', label: 'Actividad pandillera' },
  { value: 'extortion_attempt', label: 'Intento de extorsión' },
  { value: 'contraband_possession', label: 'Posesión de contrabando' },
  { value: 'escape_attempt', label: 'Intento de fuga' },
  { value: 'riot_participation', label: 'Participación en motín' },
  { value: 'unauthorized_communication', label: 'Comunicación no autorizada' },
  { value: 'bribery_attempt', label: 'Intento de soborno' },
  { value: 'weapon_possession', label: 'Posesión de arma' },
  { value: 'drug_possession', label: 'Posesión de drogas' },
  { value: 'cell_phone_possession', label: 'Posesión de celular' },
  { value: 'threatening_behavior', label: 'Comportamiento amenazante' },
  { value: 'sexual_harassment', label: 'Acoso sexual' },
  { value: 'property_damage', label: 'Daño a propiedad' },
  { value: 'rule_violation', label: 'Violación de reglas' },
];

const defaultForm = () => ({
  incident_type: '',
  severity_level: '',
  incident_date: '',
  location: '',
  incident_description: '',
  circumstances: '',
  evidence_collected: '',
  staff_statements: '',
  inmate_statement: '',
  resolution_status: 'pending',
  resolution_details: '',
  sanctions_applied: '',
  resolution_date: '',
  requires_follow_up: false,
  follow_up_date: '',
  affects_security_level: false,
  reported_to_prosecutor: false,
  prosecutor_case_number: '',
});

const form = ref(defaultForm());

const populateForm = () => {
  const val = props.incident;
  if (val && props.isEditing) {
    form.value = {
      incident_type: val.incident_type || '',
      severity_level: val.severity_level || '',
      incident_date: val.incident_date ? val.incident_date.substring(0, 16) : '',
      location: val.location || '',
      incident_description: val.incident_description || '',
      circumstances: val.circumstances || '',
      evidence_collected: val.evidence_collected || '',
      staff_statements: val.staff_statements || '',
      inmate_statement: val.inmate_statement || '',
      resolution_status: val.resolution_status || 'pending',
      resolution_details: val.resolution_details || '',
      sanctions_applied: val.sanctions_applied || '',
      resolution_date: val.resolution_date ? val.resolution_date.substring(0, 10) : '',
      requires_follow_up: val.requires_follow_up || false,
      follow_up_date: val.follow_up_date ? val.follow_up_date.substring(0, 10) : '',
      affects_security_level: val.affects_security_level || false,
      reported_to_prosecutor: val.reported_to_prosecutor || false,
      prosecutor_case_number: val.prosecutor_case_number || '',
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
  if (!form.value.incident_type) errors.value.incident_type = 'El tipo es requerido';
  if (!form.value.severity_level) errors.value.severity_level = 'La severidad es requerida';
  if (!form.value.incident_date) errors.value.incident_date = 'La fecha es requerida';
  if (!form.value.location) errors.value.location = 'La ubicación es requerida';
  if (!form.value.incident_description) errors.value.incident_description = 'La descripción es requerida';
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

    // Clean empty optional fields
    const optionalFields = ['circumstances', 'evidence_collected', 'staff_statements', 'inmate_statement',
      'resolution_details', 'sanctions_applied', 'resolution_date', 'follow_up_date', 'prosecutor_case_number'];
    for (const f of optionalFields) {
      if (!payload[f]) delete payload[f];
    }

    if (props.isEditing && props.incident?.id) {
      await ApiService.put(`/security/incidents/${props.incident.id}`, payload);
    } else {
      await ApiService.post('/security/incidents', payload);
    }
    emit('saved');
    close();
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Error al guardar el incidente';
    Swal.fire({ icon: 'error', title: 'Error', text: msg });
  } finally {
    saving.value = false;
  }
};

const open = () => {
  populateForm();
  if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};

const close = () => {
  modalInstance?.hide();
  errors.value = {};
};

defineExpose({ open, close });
</script>
