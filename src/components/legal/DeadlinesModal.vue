<template>
  <div class="modal fade" id="deadlinesModal" tabindex="-1" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditMode ? 'Editar Plazo Procesal' : 'Nuevo Plazo Procesal' }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Inmate Selection -->
            <div class="mb-3">
              <label class="form-label required">Interno</label>
              <select
                v-model="formData.inmate_id"
                class="form-select"
                :class="{ 'is-invalid': errors.inmate_id }"
                :disabled="props.inmateId !== null"
                required
              >
                <option value="">Seleccionar interno...</option>
                <option v-for="inmate in inmates" :key="inmate.id" :value="inmate.id">
                  {{ inmate.full_name }} - {{ inmate.registration_number }}
                </option>
              </select>
              <div v-if="errors.inmate_id" class="invalid-feedback">{{ errors.inmate_id }}</div>
            </div>

            <!-- Deadline Type -->
            <div class="mb-3">
              <label class="form-label required">Tipo de Plazo</label>
              <select
                v-model="formData.deadline_type"
                class="form-select"
                :class="{ 'is-invalid': errors.deadline_type }"
                required
              >
                <option value="">Seleccionar tipo...</option>
                <option v-for="type in deadlineTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <div v-if="errors.deadline_type" class="invalid-feedback">{{ errors.deadline_type }}</div>
            </div>

            <!-- Deadline Date -->
            <div class="mb-3">
              <label class="form-label required">Fecha Límite</label>
              <input
                v-model="formData.deadline_date"
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.deadline_date }"
                :min="minDate"
                required
              />
              <div v-if="errors.deadline_date" class="invalid-feedback">{{ errors.deadline_date }}</div>
            </div>

            <!-- Priority Level -->
            <div class="mb-3">
              <label class="form-label required">Nivel de Prioridad</label>
              <select
                v-model="formData.priority_level"
                class="form-select"
                :class="{ 'is-invalid': errors.priority_level }"
                required
              >
                <option value="">Seleccionar prioridad...</option>
                <option v-for="priority in priorityLevels" :key="priority.value" :value="priority.value">
                  {{ priority.label }}
                </option>
              </select>
              <div v-if="errors.priority_level" class="invalid-feedback">{{ errors.priority_level }}</div>
            </div>

            <!-- Notification Date -->
            <div class="mb-3">
              <label class="form-label">Fecha de Notificación</label>
              <input
                v-model="formData.notification_date"
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.notification_date }"
                :max="formData.deadline_date"
              />
              <small class="text-muted">Se notificará con anticipación sobre el vencimiento del plazo</small>
              <div v-if="errors.notification_date" class="invalid-feedback">{{ errors.notification_date }}</div>
            </div>

            <!-- Notes -->
            <div class="mb-3">
              <label class="form-label">Notas</label>
              <textarea
                v-model="formData.deadline_notes"
                class="form-control"
                :class="{ 'is-invalid': errors.deadline_notes }"
                rows="3"
                maxlength="1000"
                placeholder="Notas adicionales sobre el plazo..."
              ></textarea>
              <div v-if="errors.deadline_notes" class="invalid-feedback">{{ errors.deadline_notes }}</div>
            </div>

            <!-- Notification Recipients -->
            <div class="mb-3">
              <label class="form-label">Destinatarios de Notificación</label>
              <div class="input-group mb-2" v-for="(recipient, index) in formData.notification_recipients" :key="index">
                <input
                  v-model="formData.notification_recipients[index]"
                  type="email"
                  class="form-control"
                  placeholder="correo@ejemplo.com"
                />
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="removeRecipient(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                @click="addRecipient"
              >
                <i class="bi bi-plus-circle me-1"></i>
                Agregar destinatario
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditMode ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const props = defineProps<{
  inmateId?: number | null;
}>();

const emit = defineEmits(['saved']);

const modalElement = ref<HTMLElement>();
let modalInstance: Modal | null = null;

const loading = ref(false);
const isEditMode = ref(false);
const deadlineId = ref<number | null>(null);
const inmates = ref<any[]>([]);

const formData = reactive({
  inmate_id: '',
  deadline_type: '',
  deadline_date: '',
  priority_level: '',
  notification_date: '',
  deadline_notes: '',
  notification_recipients: [] as string[]
});

const errors = reactive({
  inmate_id: '',
  deadline_type: '',
  deadline_date: '',
  priority_level: '',
  notification_date: '',
  deadline_notes: ''
});

const deadlineTypes = ref([
  { value: 'preventive_detention_max', label: 'Plazo Máximo de Prisión Preventiva' },
  { value: 'investigation_closure', label: 'Cierre de Investigación' },
  { value: 'intermediate_phase', label: 'Fase Intermedia' },
  { value: 'trial_start', label: 'Inicio de Juicio' },
  { value: 'sentence_execution', label: 'Ejecución de Sentencia' },
  { value: 'appeal_filing', label: 'Interposición de Recurso' },
  { value: 'benefit_eligibility', label: 'Elegibilidad para Beneficios' },
  { value: 'parole_review', label: 'Revisión de Libertad Condicional' },
  { value: 'sentence_completion', label: 'Cumplimiento de Sentencia' }
]);

const priorityLevels = ref([
  { value: 'low', label: 'Baja', color: 'success' },
  { value: 'medium', label: 'Media', color: 'warning' },
  { value: 'high', label: 'Alta', color: 'danger' },
  { value: 'critical', label: 'Crítica', color: 'dark' }
]);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

onMounted(async () => {
  if (modalElement.value) {
    modalInstance = new Modal(modalElement.value);
  }

  // If inmateId is provided as prop, use it
  if (props.inmateId) {
    formData.inmate_id = props.inmateId.toString();
  } else {
    // Load inmates for selection
    await loadInmates();
  }
});

const loadInmates = async () => {
  try {
    const response = await ApiService.get('/inmates', {
      params: { per_page: 1000, status: 'active' }
    });
    if (response.data.success) {
      inmates.value = response.data.data.data;
    }
  } catch (error) {
    console.error('Error loading inmates:', error);
  }
};

const openModal = (deadline?: any) => {
  resetForm();

  if (deadline) {
    isEditMode.value = true;
    deadlineId.value = deadline.id;

    // Populate form with existing data
    formData.inmate_id = deadline.inmate_id.toString();
    formData.deadline_type = deadline.deadline_type;
    formData.deadline_date = deadline.deadline_date;
    formData.priority_level = deadline.priority_level;
    formData.notification_date = deadline.notification_date || '';
    formData.deadline_notes = deadline.deadline_notes || '';
    formData.notification_recipients = deadline.notification_recipients || [];
  } else {
    isEditMode.value = false;
    deadlineId.value = null;

    // If inmateId is provided as prop, use it
    if (props.inmateId) {
      formData.inmate_id = props.inmateId.toString();
    }
  }

  modalInstance?.show();
};

const closeModal = () => {
  modalInstance?.hide();
  resetForm();
};

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (key === 'notification_recipients') {
      formData[key] = [];
    } else {
      formData[key] = '';
    }
  });

  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
};

const validateForm = (): boolean => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  if (!formData.inmate_id) {
    errors.inmate_id = 'El interno es requerido';
    isValid = false;
  }

  if (!formData.deadline_type) {
    errors.deadline_type = 'El tipo de plazo es requerido';
    isValid = false;
  }

  if (!formData.deadline_date) {
    errors.deadline_date = 'La fecha límite es requerida';
    isValid = false;
  }

  if (!formData.priority_level) {
    errors.priority_level = 'El nivel de prioridad es requerido';
    isValid = false;
  }

  if (formData.notification_date && formData.deadline_date) {
    if (formData.notification_date > formData.deadline_date) {
      errors.notification_date = 'La fecha de notificación debe ser anterior a la fecha límite';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const payload = {
      ...formData,
      notification_recipients: formData.notification_recipients.filter(r => r.trim() !== '')
    };

    const response = isEditMode.value
      ? await ApiService.put(`/legal/deadlines/${deadlineId.value}`, payload)
      : await ApiService.post('/legal/deadlines', payload);

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: isEditMode.value ? 'Plazo actualizado correctamente' : 'Plazo creado correctamente'
      });

      closeModal();
      emit('saved');
    }
  } catch (error: any) {
    console.error('Error saving deadline:', error);

    if (error.response?.data?.errors) {
      // Display validation errors
      Object.keys(error.response.data.errors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = error.response.data.errors[key][0];
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar el plazo'
      });
    }
  } finally {
    loading.value = false;
  }
};

const addRecipient = () => {
  formData.notification_recipients.push('');
};

const removeRecipient = (index: number) => {
  formData.notification_recipients.splice(index, 1);
};

defineExpose({ openModal });
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #dc3545;
}
</style>