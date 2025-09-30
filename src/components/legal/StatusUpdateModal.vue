<template>
  <div class="modal fade" id="statusUpdateModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Actualizar Estado de Apelación</h5>
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
            <!-- Current Appeal Info -->
            <div v-if="currentAppeal" class="alert alert-light mb-3">
              <h6 class="fw-bold">Información de la Apelación</h6>
              <div class="small">
                <div><strong>Tipo:</strong> {{ currentAppeal.appeal_type_display }}</div>
                <div><strong>Fecha:</strong> {{ formatDate(currentAppeal.appeal_filed_date) }}</div>
                <div><strong>Estado actual:</strong>
                  <span class="badge" :class="getStatusClass(currentAppeal.appeal_status)">
                    {{ currentAppeal.appeal_status_display }}
                  </span>
                </div>
              </div>
            </div>

            <!-- New Status -->
            <div class="mb-3">
              <label class="form-label required">Nuevo Estado</label>
              <select
                v-model="form.appeal_status"
                class="form-select"
                :class="{ 'is-invalid': errors.appeal_status }"
                @change="onStatusChange"
                required
              >
                <option value="">Seleccionar estado...</option>
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

            <!-- Resolution Fields (if resolved) -->
            <div v-if="isResolved">
              <div class="mb-3">
                <label class="form-label required">Fecha de Resolución</label>
                <input
                  v-model="form.resolution_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.resolution_date }"
                  :min="currentAppeal?.appeal_filed_date"
                  required
                />
                <div v-if="errors.resolution_date" class="invalid-feedback">
                  {{ errors.resolution_date }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label required">Resumen de la Resolución</label>
                <textarea
                  v-model="form.resolution_summary"
                  class="form-control"
                  :class="{ 'is-invalid': errors.resolution_summary }"
                  rows="4"
                  placeholder="Describir el resultado del recurso..."
                  required
                ></textarea>
                <div v-if="errors.resolution_summary" class="invalid-feedback">
                  {{ errors.resolution_summary }}
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="mb-3">
              <label class="form-label">Notas (opcional)</label>
              <textarea
                v-model="form.notes"
                class="form-control"
                rows="2"
                placeholder="Notas adicionales sobre el cambio de estado..."
              ></textarea>
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
              Actualizar Estado
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

interface StatusForm {
  appeal_status: string;
  resolution_date: string;
  resolution_summary: string;
  notes: string;
}

const emit = defineEmits(['updated']);

const loading = ref(false);
const currentAppeal = ref<any>(null);
const modalInstance = ref<Modal | null>(null);

const form = reactive<StatusForm>({
  appeal_status: '',
  resolution_date: '',
  resolution_summary: '',
  notes: ''
});

const errors = reactive<Record<string, string>>({});

const appealStatuses = ref<Array<{value: string; label: string}>>([]);

const isResolved = computed(() => {
  return ['resolved_favorable', 'resolved_unfavorable'].includes(form.appeal_status);
});

onMounted(async () => {
  modalInstance.value = new Modal(document.getElementById('statusUpdateModal')!);
  await loadAppealStatuses();
});

const loadAppealStatuses = async () => {
  try {
    const response = await ApiService.get('/legal/appeals/statuses');
    appealStatuses.value = response.data.data;
  } catch (error) {
    console.error('Error loading appeal statuses:', error);
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    filed: 'bg-light-info',
    admitted: 'bg-light-primary',
    rejected: 'bg-light-danger',
    pending_resolution: 'bg-light-warning',
    resolved_favorable: 'bg-light-success',
    resolved_unfavorable: 'bg-light-danger',
    withdrawn: 'bg-light-secondary'
  };
  return classes[status] || 'bg-light';
};

const onStatusChange = () => {
  // Clear resolution fields if not resolved
  if (!isResolved.value) {
    form.resolution_date = '';
    form.resolution_summary = '';
  }
};

const resetForm = () => {
  Object.assign(form, {
    appeal_status: '',
    resolution_date: '',
    resolution_summary: '',
    notes: ''
  });
  Object.keys(errors).forEach(key => delete errors[key]);
  currentAppeal.value = null;
};

const handleSubmit = async () => {
  if (!currentAppeal.value) return;

  loading.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const dataToSend: any = {
      appeal_status: form.appeal_status
    };

    // Only include resolution fields if status is resolved
    if (isResolved.value) {
      dataToSend.resolution_date = form.resolution_date;
      dataToSend.resolution_summary = form.resolution_summary;
    }

    const response = await ApiService.patch(
      `/legal/appeals/${currentAppeal.value.id}/status`,
      dataToSend
    );

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Estado actualizado correctamente',
        timer: 1500,
        showConfirmButton: false
      });

      modalInstance.value?.hide();
      resetForm();
      emit('updated');
    }
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    }

    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al actualizar el estado'
    });
  } finally {
    loading.value = false;
  }
};

const openModal = (appeal: any) => {
  currentAppeal.value = appeal;
  form.appeal_status = appeal.appeal_status || '';
  form.resolution_date = appeal.resolution_date?.split('T')[0] || '';
  form.resolution_summary = appeal.resolution_summary || '';
  form.notes = '';
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