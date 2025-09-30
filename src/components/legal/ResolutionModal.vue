<template>
  <div class="modal fade" id="resolutionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Editar Resolución' : 'Nueva Resolución Judicial' }}
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

            <!-- Court Selection -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label required">Juzgado/Tribunal</label>
                <select
                  v-model="form.court_id"
                  class="form-select"
                  :class="{ 'is-invalid': errors.court_id }"
                  required
                >
                  <option value="">Seleccionar juzgado...</option>
                  <option
                    v-for="court in courts"
                    :key="court.id"
                    :value="court.id"
                  >
                    {{ court.name }}
                  </option>
                </select>
                <div v-if="errors.court_id" class="invalid-feedback">
                  {{ errors.court_id }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label required">Número de Resolución</label>
                <input
                  v-model="form.resolution_number"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.resolution_number }"
                  placeholder="Ej: 123-2024"
                  required
                />
                <div v-if="errors.resolution_number" class="invalid-feedback">
                  {{ errors.resolution_number }}
                </div>
              </div>
            </div>

            <!-- Resolution Type and Date -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label required">Tipo de Resolución</label>
                <select
                  v-model="form.resolution_type"
                  class="form-select"
                  :class="{ 'is-invalid': errors.resolution_type }"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  <option
                    v-for="type in resolutionTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
                <div v-if="errors.resolution_type" class="invalid-feedback">
                  {{ errors.resolution_type }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label required">Fecha de Resolución</label>
                <input
                  v-model="form.resolution_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.resolution_date }"
                  required
                />
                <div v-if="errors.resolution_date" class="invalid-feedback">
                  {{ errors.resolution_date }}
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="mb-3">
              <label class="form-label required">Resumen</label>
              <textarea
                v-model="form.resolution_summary"
                class="form-control"
                :class="{ 'is-invalid': errors.resolution_summary }"
                rows="3"
                placeholder="Resumen de la resolución..."
                required
              ></textarea>
              <div v-if="errors.resolution_summary" class="invalid-feedback">
                {{ errors.resolution_summary }}
              </div>
            </div>

            <!-- Details -->
            <div class="mb-3">
              <label class="form-label">Detalles</label>
              <textarea
                v-model="form.resolution_details"
                class="form-control"
                :class="{ 'is-invalid': errors.resolution_details }"
                rows="4"
                placeholder="Detalles adicionales de la resolución..."
              ></textarea>
              <div v-if="errors.resolution_details" class="invalid-feedback">
                {{ errors.resolution_details }}
              </div>
            </div>

            <!-- Effects -->
            <div class="mb-3">
              <label class="form-label">Efectos de la Resolución</label>
              <div class="input-group mb-2" v-for="(effect, index) in form.resolution_effects" :key="index">
                <input
                  v-model="form.resolution_effects[index]"
                  type="text"
                  class="form-control"
                  placeholder="Describir efecto..."
                />
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="removeEffect(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-light-primary"
                @click="addEffect"
              >
                <i class="bi bi-plus-circle me-1"></i>
                Agregar Efecto
              </button>
            </div>

            <!-- Compliance -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Fecha Límite de Cumplimiento</label>
                <input
                  v-model="form.compliance_deadline"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.compliance_deadline }"
                  :min="form.resolution_date"
                />
                <div v-if="errors.compliance_deadline" class="invalid-feedback">
                  {{ errors.compliance_deadline }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Estado de Cumplimiento</label>
                <select
                  v-model="form.compliance_status"
                  class="form-select"
                  :class="{ 'is-invalid': errors.compliance_status }"
                >
                  <option
                    v-for="status in complianceStatuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div v-if="errors.compliance_status" class="invalid-feedback">
                  {{ errors.compliance_status }}
                </div>
              </div>
            </div>

            <!-- Is Final -->
            <div class="form-check mb-3">
              <input
                v-model="form.is_final"
                type="checkbox"
                class="form-check-input"
                id="isFinalCheck"
              />
              <label class="form-check-label" for="isFinalCheck">
                Resolución Firme (no admite recursos)
              </label>
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
              {{ isEditMode ? 'Actualizar' : 'Guardar' }} Resolución
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { useCatalogs } from '@/composables/useCatalogs';

interface ResolutionForm {
  inmate_id: number | null;
  court_id: string;
  resolution_number: string;
  resolution_date: string;
  resolution_type: string;
  resolution_summary: string;
  resolution_details: string;
  resolution_effects: string[];
  is_final: boolean;
  compliance_deadline: string;
  compliance_status: string;
}

const props = defineProps<{
  inmateId: number | null;
}>();

const emit = defineEmits(['saved']);

const loading = ref(false);
const isEditMode = ref(false);
const currentResolutionId = ref<number | null>(null);
const modalInstance = ref<Modal | null>(null);

const { courts } = useCatalogs();

const inmates = ref<any[]>([]);

const form = reactive<ResolutionForm>({
  inmate_id: null,
  court_id: '',
  resolution_number: '',
  resolution_date: '',
  resolution_type: '',
  resolution_summary: '',
  resolution_details: '',
  resolution_effects: [],
  is_final: false,
  compliance_deadline: '',
  compliance_status: 'pending'
});

const errors = reactive<Record<string, string>>({});

const resolutionTypes = ref<Array<{value: string; label: string}>>([]);
const complianceStatuses = ref<Array<{value: string; label: string}>>([]);

onMounted(async () => {
  modalInstance.value = new Modal(document.getElementById('resolutionModal')!);
  await loadResolutionTypes();
  await loadComplianceStatuses();
  if (!props.inmateId) {
    await loadInmates();
  }
});

const loadResolutionTypes = async () => {
  try {
    const response = await ApiService.get('/legal/resolutions/types');
    resolutionTypes.value = response.data.data;
  } catch (error) {
    console.error('Error loading resolution types:', error);
  }
};

const loadComplianceStatuses = async () => {
  try {
    const response = await ApiService.get('/legal/resolutions/compliance-statuses');
    complianceStatuses.value = response.data.data;
  } catch (error) {
    console.error('Error loading compliance statuses:', error);
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

const addEffect = () => {
  form.resolution_effects.push('');
};

const removeEffect = (index: number) => {
  form.resolution_effects.splice(index, 1);
};

const resetForm = () => {
  Object.assign(form, {
    inmate_id: props.inmateId || null,
    court_id: '',
    resolution_number: '',
    resolution_date: '',
    resolution_type: '',
    resolution_summary: '',
    resolution_details: '',
    resolution_effects: [],
    is_final: false,
    compliance_deadline: '',
    compliance_status: 'pending'
  });
  Object.keys(errors).forEach(key => delete errors[key]);
  isEditMode.value = false;
  currentResolutionId.value = null;
};

const handleSubmit = async () => {
  loading.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    // Filter out empty effects
    const dataToSend = {
      ...form,
      resolution_effects: form.resolution_effects.filter(e => e.trim() !== '')
    };

    let response;
    if (isEditMode.value && currentResolutionId.value) {
      response = await ApiService.put(`/legal/resolutions/${currentResolutionId.value}`, dataToSend);
    } else {
      response = await ApiService.post('/legal/resolutions', dataToSend);
    }

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: isEditMode.value ? 'Resolución actualizada correctamente' : 'Resolución registrada correctamente',
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
      text: error.response?.data?.message || 'Error al guardar la resolución'
    });
  } finally {
    loading.value = false;
  }
};

const openModal = async (resolution?: any) => {
  // Load inmates if not already loaded and no inmateId prop
  if (!props.inmateId && inmates.value.length === 0) {
    await loadInmates();
  }

  if (resolution) {
    isEditMode.value = true;
    currentResolutionId.value = resolution.id;
    Object.assign(form, {
      inmate_id: resolution.inmate_id || props.inmateId || null,
      court_id: resolution.court_id || '',
      resolution_number: resolution.resolution_number || '',
      resolution_date: resolution.resolution_date?.split('T')[0] || '',
      resolution_type: resolution.resolution_type || '',
      resolution_summary: resolution.resolution_summary || '',
      resolution_details: resolution.resolution_details || '',
      resolution_effects: Array.isArray(resolution.resolution_effects) ? resolution.resolution_effects : [],
      is_final: resolution.is_final || false,
      compliance_deadline: resolution.compliance_deadline?.split('T')[0] || '',
      compliance_status: resolution.compliance_status || 'pending'
    });
  } else {
    resetForm();
    // If inmateId is provided as prop, use it
    if (props.inmateId) {
      form.inmate_id = props.inmateId;
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