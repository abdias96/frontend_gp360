<template>
  <div id="alertFormModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ isEditing ? 'Editar Alerta' : 'Nueva Alerta de Seguridad' }}</h2>
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

            <!-- Section 2: Alerta -->
            <div class="mb-4">
              <h4 class="fs-6 fw-bold text-gray-800">Alerta</h4>
            </div>
            <div class="row mb-7">
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Tipo de Alerta</label>
                <select v-model="form.alert_type" class="form-select" :class="{ 'is-invalid': errors.alert_type }">
                  <option value="">Seleccionar...</option>
                  <option v-for="t in alertTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
                <div v-if="errors.alert_type" class="invalid-feedback">{{ errors.alert_type }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Prioridad</label>
                <select v-model="form.priority_level" class="form-select" :class="{ 'is-invalid': errors.priority_level }">
                  <option value="">Seleccionar...</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
                <div v-if="errors.priority_level" class="invalid-feedback">{{ errors.priority_level }}</div>
              </div>
              <div class="col-md-4">
                <label class="required fs-6 fw-semibold mb-2">Fecha Alerta</label>
                <input v-model="form.alert_date" type="date" class="form-control" :class="{ 'is-invalid': errors.alert_date }" />
                <div v-if="errors.alert_date" class="invalid-feedback">{{ errors.alert_date }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-md-6">
                <label class="fs-6 fw-semibold mb-2">Fecha de Expiración</label>
                <input v-model="form.expiration_date" type="date" class="form-control" />
              </div>
            </div>

            <!-- Section 3: Descripción -->
            <div class="row mb-7">
              <div class="col-12">
                <label class="required fs-6 fw-semibold mb-2">Descripción</label>
                <textarea v-model="form.alert_description" class="form-control" rows="3"
                  :class="{ 'is-invalid': errors.alert_description }"
                  placeholder="Describa la alerta..."></textarea>
                <div v-if="errors.alert_description" class="invalid-feedback">{{ errors.alert_description }}</div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Acciones Recomendadas</label>
                <textarea v-model="form.recommended_actions" class="form-control" rows="2"
                  placeholder="Acciones sugeridas..."></textarea>
              </div>
            </div>

            <!-- Section 4: Estado -->
            <div class="row mb-7">
              <div class="col-md-4">
                <div class="form-check form-switch mb-3">
                  <input v-model="form.is_active" class="form-check-input" type="checkbox" id="isActiveCheck" />
                  <label class="form-check-label" for="isActiveCheck">Alerta Activa</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch mb-3">
                  <input v-model="form.requires_immediate_action" class="form-check-input" type="checkbox" id="immediateCheck" />
                  <label class="form-check-label" for="immediateCheck">Requiere Acción Inmediata</label>
                </div>
              </div>
            </div>

            <div class="row mb-7">
              <div class="col-12">
                <label class="fs-6 fw-semibold mb-2">Personal Notificado</label>
                <textarea v-model="form.staff_notified" class="form-control" rows="2"
                  placeholder="Nombres del personal notificado..."></textarea>
              </div>
            </div>

            <!-- Section 5: Resolución (solo en edición) -->
            <div v-if="isEditing">
              <div class="mb-4">
                <h4 class="fs-6 fw-bold text-gray-800">Resolución</h4>
              </div>
              <div class="row mb-7">
                <div class="col-12">
                  <label class="fs-6 fw-semibold mb-2">Acciones Realizadas</label>
                  <textarea v-model="form.actions_taken" class="form-control" rows="2"
                    placeholder="Acciones tomadas..."></textarea>
                </div>
              </div>
              <div class="row mb-7">
                <div class="col-md-4">
                  <label class="fs-6 fw-semibold mb-2">Estado de Resolución</label>
                  <select v-model="form.resolution_status" class="form-select">
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="resolved">Resuelto</option>
                    <option value="escalated">Escalado</option>
                  </select>
                </div>
              </div>
              <div class="row mb-7">
                <div class="col-12">
                  <label class="fs-6 fw-semibold mb-2">Notas de Resolución</label>
                  <textarea v-model="form.resolution_notes" class="form-control" rows="2"
                    placeholder="Notas sobre la resolución..."></textarea>
                </div>
              </div>
            </div>

            <div class="text-center pt-5">
              <button type="button" class="btn btn-light me-3" @click="close">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar' : 'Crear Alerta' }}
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

const props = defineProps<{ alert?: any; isEditing: boolean }>();
const emit = defineEmits(['saved']);

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;
const saving = ref(false);
const selectedInmate = ref<any>(null);
const errors = ref<Record<string, string>>({});

const alertTypes = [
  { value: 'high_escape_risk', label: 'Alto Riesgo de Fuga' },
  { value: 'violence_threat', label: 'Amenaza de Violencia' },
  { value: 'gang_leader', label: 'Líder de Pandilla' },
  { value: 'extortion_coordinator', label: 'Coordinador de Extorsión' },
  { value: 'suicide_risk', label: 'Riesgo Suicida' },
  { value: 'medical_emergency', label: 'Emergencia Médica' },
  { value: 'court_appearance', label: 'Audiencia Judicial' },
  { value: 'transfer_pending', label: 'Traslado Pendiente' },
  { value: 'visitor_restriction', label: 'Restricción de Visitas' },
  { value: 'communication_restriction', label: 'Restricción de Comunicaciones' },
  { value: 'isolation_required', label: 'Aislamiento Requerido' },
  { value: 'weapon_possession_risk', label: 'Riesgo de Posesión de Armas' },
  { value: 'contraband_risk', label: 'Riesgo de Contrabando' },
  { value: 'corruption_involvement', label: 'Involucramiento en Corrupción' },
];

const defaultForm = () => ({
  alert_type: '',
  priority_level: '',
  alert_date: new Date().toISOString().split('T')[0],
  expiration_date: '',
  alert_description: '',
  recommended_actions: '',
  is_active: true,
  requires_immediate_action: false,
  staff_notified: '',
  actions_taken: '',
  resolution_status: 'pending',
  resolution_notes: '',
});

const form = ref(defaultForm());

const populateForm = () => {
  const val = props.alert;
  if (val && props.isEditing) {
    form.value = {
      alert_type: val.alert_type || '',
      priority_level: val.priority_level || '',
      alert_date: val.alert_date ? val.alert_date.substring(0, 10) : '',
      expiration_date: val.expiration_date ? val.expiration_date.substring(0, 10) : '',
      alert_description: val.alert_description || '',
      recommended_actions: val.recommended_actions || '',
      is_active: val.is_active ?? true,
      requires_immediate_action: val.requires_immediate_action || false,
      staff_notified: val.staff_notified || '',
      actions_taken: val.actions_taken || '',
      resolution_status: val.resolution_status || 'pending',
      resolution_notes: val.resolution_notes || '',
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
  if (!form.value.alert_type) errors.value.alert_type = 'El tipo es requerido';
  if (!form.value.priority_level) errors.value.priority_level = 'La prioridad es requerida';
  if (!form.value.alert_date) errors.value.alert_date = 'La fecha es requerida';
  if (!form.value.alert_description) errors.value.alert_description = 'La descripción es requerida';
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
    if (!payload.expiration_date) delete payload.expiration_date;
    if (!payload.recommended_actions) delete payload.recommended_actions;
    if (!payload.staff_notified) delete payload.staff_notified;
    if (!payload.actions_taken) delete payload.actions_taken;
    if (!payload.resolution_notes) delete payload.resolution_notes;

    if (props.isEditing && props.alert?.id) {
      await ApiService.put(`/security/alerts/${props.alert.id}`, payload);
    } else {
      await ApiService.post('/security/alerts', payload);
    }
    emit('saved');
    close();
  } catch (error: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al guardar la alerta' });
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
