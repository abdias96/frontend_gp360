<template>
  <div class="modal fade" id="appealsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Editar Apelación' : 'Nueva Apelación' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="resetForm"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Inmate Selection (if not provided) -->
            <div v-if="!inmateId" class="mb-3">
              <label class="form-label required">Interno</label>
              <select
                v-model="form.inmate_id"
                class="form-select"
                :class="{ 'is-invalid': errors.inmate_id }"
                required
              >
                <option value="">Seleccionar interno...</option>
                <option
                  v-for="inmate in inmates"
                  :key="inmate.id"
                  :value="inmate.id"
                >
                  {{ inmate.full_name }} - {{ inmate.registry_number }}
                </option>
              </select>
              <div v-if="errors.inmate_id" class="invalid-feedback">
                {{ errors.inmate_id }}
              </div>
            </div>

            <!-- Original Resolution Selection -->
            <div class="mb-3">
              <label class="form-label required">Resolución a Apelar</label>
              <select
                v-model="form.original_resolution_id"
                class="form-select"
                :class="{ 'is-invalid': errors.original_resolution_id }"
                @change="onResolutionChange"
                required
              >
                <option value="">Seleccionar resolución...</option>
                <option
                  v-for="resolution in appealableResolutions"
                  :key="resolution.id"
                  :value="resolution.id"
                >
                  {{ resolution.resolution_number }} - {{ resolution.resolution_date }} - {{ resolution.resolution_type_display }}
                </option>
              </select>
              <div v-if="errors.original_resolution_id" class="invalid-feedback">
                {{ errors.original_resolution_id }}
              </div>
            </div>

            <!-- Appeal Type and Filed Date -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label required">Tipo de Recurso</label>
                <select
                  v-model="form.appeal_type"
                  class="form-select"
                  :class="{ 'is-invalid': errors.appeal_type }"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  <option
                    v-for="type in appealTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
                <div v-if="errors.appeal_type" class="invalid-feedback">
                  {{ errors.appeal_type }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label required">Fecha de Interposición</label>
                <input
                  v-model="form.appeal_filed_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.appeal_filed_date }"
                  required
                />
                <div v-if="errors.appeal_filed_date" class="invalid-feedback">
                  {{ errors.appeal_filed_date }}
                </div>
              </div>
            </div>

            <!-- Appeal Grounds -->
            <div class="mb-3">
              <label class="form-label required">Fundamentos del Recurso</label>
              <textarea
                v-model="form.appeal_grounds"
                class="form-control"
                :class="{ 'is-invalid': errors.appeal_grounds }"
                rows="4"
                placeholder="Describir los fundamentos legales del recurso..."
                required
              ></textarea>
              <div v-if="errors.appeal_grounds" class="invalid-feedback">
                {{ errors.appeal_grounds }}
              </div>
            </div>

            <!-- Court and Status -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label required">Tribunal de Apelación</label>
                <select
                  v-model="form.appeals_court_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.appeals_court_id }"
                  required
                >
                  <option value="">Seleccionar tribunal...</option>
                  <option
                    v-for="court in courts"
                    :key="court.id"
                    :value="court.id"
                  >
                    {{ court.name }}
                  </option>
                </select>
                <div v-if="errors.appeals_court_id" class="invalid-feedback">
                  {{ errors.appeals_court_id }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Estado del Recurso</label>
                <select
                  v-model="form.appeal_status"
                  class="form-select"
                  :class="{ 'is-invalid': errors.appeal_status }"
                >
                  <option
                    v-for="status in appealStatuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div v-if="errors.appeal_status" class="invalid-feedback">
                  {{ errors.appeal_status }}
                </div>
              </div>
            </div>

            <!-- Resolution (if resolved) -->
            <div v-if="['resolved_favorable', 'resolved_unfavorable'].includes(form.appeal_status)">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label required">Fecha de Resolución</label>
                  <input
                    v-model="form.resolution_date"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.resolution_date }"
                    :min="form.appeal_filed_date"
                    required
                  />
                  <div v-if="errors.resolution_date" class="invalid-feedback">
                    {{ errors.resolution_date }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label required">Resumen de la Resolución</label>
                <textarea
                  v-model="form.resolution_summary"
                  class="form-control"
                  :class="{ 'is-invalid': errors.resolution_summary }"
                  rows="3"
                  placeholder="Resumen del resultado del recurso..."
                  required
                ></textarea>
                <div v-if="errors.resolution_summary" class="invalid-feedback">
                  {{ errors.resolution_summary }}
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditMode ? 'Actualizar' : 'Guardar' }} Apelación
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { useCatalogs } from '@/composables/useCatalogs';

interface AppealForm {
  inmate_id: number | null;
  original_resolution_id: string;
  appeal_type: string;
  appeal_filed_date: string;
  appeal_grounds: string;
  appeals_court_id: string;
  appeal_status: string;
  resolution_date: string;
  resolution_summary: string;
}

const props = defineProps<{
  inmateId: number | null;
}>();

const emit = defineEmits(['saved']);

const loading = ref(false);
const isEditMode = ref(false);
const currentAppealId = ref<number | null>(null);
const modalInstance = ref<Modal | null>(null);

const { courts } = useCatalogs();

const inmates = ref<any[]>([]);
const appealableResolutions = ref<any[]>([]);

const form = reactive<AppealForm>({
  inmate_id: null,
  original_resolution_id: '',
  appeal_type: '',
  appeal_filed_date: '',
  appeal_grounds: '',
  appeals_court_id: '',
  appeal_status: 'filed',
  resolution_date: '',
  resolution_summary: ''
});

const errors = reactive<Record<string, string>>({});

const appealTypes = ref<Array<{value: string; label: string}>>([]);
const appealStatuses = ref<Array<{value: string; label: string}>>([]);

onMounted(async () => {
  modalInstance.value = new Modal(document.getElementById('appealsModal')!);
  await loadAppealTypes();
  await loadAppealStatuses();
  if (!props.inmateId) {
    await loadInmates();
  } else {
    form.inmate_id = props.inmateId;
    await loadAppealableResolutions(props.inmateId);
  }
});

// Watch for inmate changes to load appealable resolutions
watch(() => form.inmate_id, async (newId) => {
  if (newId) {
    await loadAppealableResolutions(newId);
  } else {
    appealableResolutions.value = [];
  }
});

const loadAppealTypes = async () => {
  try {
    const response = await ApiService.get('/legal/appeals/types');
    appealTypes.value = response.data.data;
  } catch (error) {
    console.error('Error loading appeal types:', error);
  }
};

const loadAppealStatuses = async () => {
  try {
    const response = await ApiService.get('/legal/appeals/statuses');
    appealStatuses.value = response.data.data;
  } catch (error) {
    console.error('Error loading appeal statuses:', error);
  }
};

const loadInmates = async () => {
  try {
    const response = await ApiService.get('/inmates', {
      params: { per_page: 1000, active: true }
    });
    inmates.value = response.data.data.data || [];
  } catch (error) {
    console.error('Error loading inmates:', error);
  }
};

const loadAppealableResolutions = async (inmateId: number) => {
  try {
    const response = await ApiService.get(`/legal/appeals/appealable-resolutions/${inmateId}`);
    appealableResolutions.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading appealable resolutions:', error);
    appealableResolutions.value = [];
  }
};

const onResolutionChange = () => {
  // Could load additional details about the selected resolution if needed
};

const resetForm = () => {
  Object.assign(form, {
    inmate_id: props.inmateId || null,
    original_resolution_id: '',
    appeal_type: '',
    appeal_filed_date: '',
    appeal_grounds: '',
    appeals_court_id: '',
    appeal_status: 'filed',
    resolution_date: '',
    resolution_summary: ''
  });
  Object.keys(errors).forEach(key => delete errors[key]);
  isEditMode.value = false;
  currentAppealId.value = null;
  appealableResolutions.value = [];
};

const handleSubmit = async () => {
  loading.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const dataToSend = {
      ...form,
      inmate_id: form.inmate_id || props.inmateId
    };

    // Only include resolution fields if appeal is resolved
    if (!['resolved_favorable', 'resolved_unfavorable'].includes(form.appeal_status)) {
      delete dataToSend.resolution_date;
      delete dataToSend.resolution_summary;
    }

    let response;
    if (isEditMode.value && currentAppealId.value) {
      response = await ApiService.put(`/legal/appeals/${currentAppealId.value}`, dataToSend);
    } else {
      response = await ApiService.post('/legal/appeals', dataToSend);
    }

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: isEditMode.value ? 'Apelación actualizada correctamente' : 'Apelación registrada correctamente',
        timer: 1500,
        showConfirmButton: false
      });

      modalInstance.value?.hide();
      resetForm();
      emit('saved');
    }
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    }

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar la apelación'
    });
  } finally {
    loading.value = false;
  }
};

const openModal = async (appeal?: any) => {
  // Load inmates if not already loaded and no inmateId prop
  if (!props.inmateId && inmates.value.length === 0) {
    await loadInmates();
  }

  if (appeal) {
    isEditMode.value = true;
    currentAppealId.value = appeal.id;

    // Set inmate ID first to load appealable resolutions
    form.inmate_id = appeal.inmate_id || props.inmateId || null;
    if (form.inmate_id) {
      await loadAppealableResolutions(form.inmate_id);
    }

    Object.assign(form, {
      original_resolution_id: appeal.original_resolution_id || '',
      appeal_type: appeal.appeal_type || '',
      appeal_filed_date: appeal.appeal_filed_date?.split('T')[0] || '',
      appeal_grounds: appeal.appeal_grounds || '',
      appeals_court_id: appeal.appeals_court_id || '',
      appeal_status: appeal.appeal_status || 'filed',
      resolution_date: appeal.resolution_date?.split('T')[0] || '',
      resolution_summary: appeal.resolution_summary || ''
    });
  } else {
    resetForm();
    // If inmateId is provided as prop, use it
    if (props.inmateId) {
      form.inmate_id = props.inmateId;
      await loadAppealableResolutions(props.inmateId);
    }
  }
  modalInstance.value?.show();
};

defineExpose({
  openModal
});
</script>

<style scoped>
.required::after {
  content: " *";
  color: #dc3545;
}
</style>