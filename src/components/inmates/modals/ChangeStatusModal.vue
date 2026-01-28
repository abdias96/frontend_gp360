<template>
  <div class="modal fade" id="changeStatusModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="bi bi-arrow-left-right me-2"></i>
            {{ $t('inmates.changeStatusModal.title') }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Información del Interno -->
          <div v-if="inmate" class="alert alert-info d-flex align-items-center mb-6">
            <i class="bi bi-person-circle fs-2x me-3"></i>
            <div>
              <div class="fw-bold">{{ inmate.full_name }}</div>
              <div class="text-muted small">
                {{ $t('inmates.changeStatusModal.documentNumber') }}: {{ inmate.document_number }} |
                {{ $t('inmates.changeStatusModal.inmateNumber') }}: {{ inmate.inmate_number }} |
                {{ $t('inmates.changeStatusModal.currentStatus') }}: <span class="badge badge-light-primary">{{ getStatusLabel(inmate.status) }}</span>
              </div>
            </div>
          </div>

          <form @submit.prevent="submitStatusChange">
            <!-- Selección de Nuevo Estado -->
            <div class="mb-6">
              <label class="form-label required">{{ $t('inmates.changeStatusModal.newStatus') }}</label>
              <select
                v-model="form.new_status"
                class="form-select"
                required
                @change="handleStatusChange"
              >
                <option value="">{{ $t('inmates.changeStatusModal.selectNewStatus') }}</option>
                <option value="active">{{ $t('inmates.changeStatusModal.statuses.active') }}</option>
                <option value="court_hearing">{{ $t('inmates.changeStatusModal.statuses.court_hearing') }}</option>
                <option value="hospital_external">{{ $t('inmates.changeStatusModal.statuses.hospital_external') }}</option>
                <option value="hospital_internal">{{ $t('inmates.changeStatusModal.statuses.hospital_internal') }}</option>
                <option value="isolation">{{ $t('inmates.changeStatusModal.statuses.isolation') }}</option>
                <option value="released" class="text-danger">{{ $t('inmates.changeStatusModal.statuses.released') }}</option>
                <option value="deceased" class="text-danger">{{ $t('inmates.changeStatusModal.statuses.deceased') }}</option>
                <option value="escaped" class="text-danger">{{ $t('inmates.changeStatusModal.statuses.escaped') }}</option>
              </select>
              <div class="form-text">
                {{ $t('inmates.changeStatusModal.statusHint') }}
              </div>
            </div>

            <!-- Advertencia para estados críticos -->
            <div
              v-if="isCriticalStatus"
              class="alert alert-warning d-flex align-items-center mb-6"
            >
              <i class="bi bi-exclamation-triangle-fill fs-2x me-3"></i>
              <div>
                <strong>{{ $t('inmates.changeStatusModal.warnings.attention') }}</strong>
                <span v-if="form.new_status === 'released'">
                  {{ $t('inmates.changeStatusModal.warnings.releasedWarning') }}
                </span>
                <span v-else-if="form.new_status === 'deceased'">
                  {{ $t('inmates.changeStatusModal.warnings.deceasedWarning') }}
                </span>
                <span v-else-if="form.new_status === 'escaped'">
                  {{ $t('inmates.changeStatusModal.warnings.escapedWarning') }}
                </span>
              </div>
            </div>

            <!-- Campo especial para Liberación -->
            <div v-if="form.new_status === 'released'" class="mb-6">
              <div class="alert alert-danger">
                <h6 class="alert-heading">{{ $t('inmates.changeStatusModal.releaseProcess.title') }}</h6>
                <p>{{ $t('inmates.changeStatusModal.releaseProcess.description') }}</p>
                <ul class="mb-0">
                  <li>{{ $t('inmates.changeStatusModal.releaseProcess.step1') }}</li>
                  <li>{{ $t('inmates.changeStatusModal.releaseProcess.step2') }}</li>
                  <li>{{ $t('inmates.changeStatusModal.releaseProcess.step3') }}</li>
                  <li>{{ $t('inmates.changeStatusModal.releaseProcess.step4') }}</li>
                </ul>
                <hr>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="openReleaseModal"
                >
                  <i class="bi bi-box-arrow-right me-2"></i>
                  {{ $t('inmates.changeStatusModal.releaseProcess.startProcess') }}
                </button>
              </div>
            </div>

            <!-- Campo especial para Fallecido -->
            <div v-if="form.new_status === 'deceased'" class="mb-6">
              <label class="form-label required">{{ $t('inmates.changeStatusModal.deathDate') }}</label>
              <input
                v-model="form.death_date"
                type="date"
                class="form-control"
                :max="new Date().toISOString().split('T')[0]"
                required
              />
            </div>

            <!-- Campo especial para Fugado -->
            <div v-if="form.new_status === 'escaped'" class="mb-6">
              <label class="form-label required">{{ $t('inmates.changeStatusModal.escapeDateTime') }}</label>
              <input
                v-model="form.escape_datetime"
                type="datetime-local"
                class="form-control"
                :max="new Date().toISOString().slice(0, 16)"
                required
              />
            </div>

            <!-- Razón del Cambio (obligatorio para todos) -->
            <div class="mb-6">
              <label class="form-label required">{{ $t('inmates.changeStatusModal.changeReason') }}</label>
              <textarea
                v-model="form.reason"
                class="form-control"
                rows="4"
                :placeholder="$t('inmates.changeStatusModal.changeReasonPlaceholder')"
                required
              ></textarea>
            </div>

            <!-- Observaciones Adicionales -->
            <div class="mb-6">
              <label class="form-label">{{ $t('inmates.changeStatusModal.additionalObservations') }}</label>
              <textarea
                v-model="form.observations"
                class="form-control"
                rows="3"
                :placeholder="$t('inmates.changeStatusModal.additionalObservationsPlaceholder')"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            data-bs-dismiss="modal"
          >
            {{ $t('inmates.changeStatusModal.cancel') }}
          </button>
          <button
            v-if="form.new_status !== 'released'"
            type="button"
            class="btn"
            :class="isCriticalStatus ? 'btn-danger' : 'btn-primary'"
            @click="submitStatusChange"
            :disabled="loading || !form.new_status || !form.reason"
          >
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              {{ $t('inmates.changeStatusModal.processing') }}
            </span>
            <span v-else>
              <i class="bi bi-check-circle me-2"></i>
              {{ $t('inmates.changeStatusModal.confirmChange') }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Release Modal (se abre si selecciona "Liberado") -->
  <ReleaseModal
    v-if="inmate"
    :inmateId="inmate.id"
    :inmateData="inmate"
    @released="handleReleased"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLegalProfiles } from '@/composables/useLegalProfiles';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import ReleaseModal from './ReleaseModal.vue';

const { t } = useI18n();

interface Props {
  inmate?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['statusChanged', 'released']);

const { markAsDeceased } = useLegalProfiles();

const loading = ref(false);
const form = ref({
  new_status: '',
  reason: '',
  observations: '',
  death_date: '',
  escape_datetime: ''
});

const getStatusLabel = (status: string) => {
  const key = `inmates.changeStatusModal.statuses.${status}`;
  const translation = t(key);
  return translation !== key ? translation : status;
};

const isCriticalStatus = computed(() => {
  return ['released', 'deceased', 'escaped'].includes(form.value.new_status);
});

const handleStatusChange = () => {
  // Limpiar campos específicos al cambiar de estado
  if (form.value.new_status !== 'deceased') {
    form.value.death_date = '';
  }
  if (form.value.new_status !== 'escaped') {
    form.value.escape_datetime = '';
  }
};

const openReleaseModal = () => {
  // Cerrar modal de cambio de estado
  const statusModal = document.getElementById('changeStatusModal');
  const statusModalInstance = bootstrap.Modal.getInstance(statusModal);
  statusModalInstance?.hide();

  // Abrir modal de liberación
  setTimeout(() => {
    const releaseModal = new bootstrap.Modal(document.getElementById('releaseModal'));
    releaseModal.show();
  }, 300);
};

const submitStatusChange = async () => {
  if (!props.inmate) return;

  // Validaciones
  if (!form.value.new_status) {
    Swal.fire({
      title: t('inmates.changeStatusModal.swal.error'),
      text: t('inmates.changeStatusModal.swal.selectStatus'),
      icon: 'error'
    });
    return;
  }

  if (!form.value.reason.trim()) {
    Swal.fire({
      title: t('inmates.changeStatusModal.swal.error'),
      text: t('inmates.changeStatusModal.swal.provideReason'),
      icon: 'error'
    });
    return;
  }

  // No permitir cambio directo a "released" sin proceso formal
  if (form.value.new_status === 'released') {
    Swal.fire({
      title: t('inmates.changeStatusModal.swal.incompleteProcess'),
      text: t('inmates.changeStatusModal.swal.useRelease'),
      icon: 'warning'
    });
    return;
  }

  // Confirmación especial para estados críticos
  if (isCriticalStatus.value) {
    const result = await Swal.fire({
      title: t('inmates.changeStatusModal.swal.confirmTitle'),
      html: `
        <p>${t('inmates.changeStatusModal.swal.confirmMessage')} <strong>${getStatusLabel(form.value.new_status)}</strong>.</p>
        <p class="text-danger">${t('inmates.changeStatusModal.swal.confirmWarning')}</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('inmates.changeStatusModal.swal.confirmButton'),
      cancelButtonText: t('inmates.changeStatusModal.swal.cancelButton')
    });

    if (!result.isConfirmed) {
      return;
    }
  }

  loading.value = true;

  try {
    // Si es fallecimiento, usar el método especial que cierra el perfil legal
    if (form.value.new_status === 'deceased') {
      // Obtener perfil legal activo
      const response = await ApiService.get(`/legal/profiles/inmate/${props.inmate.id}/active`);

      if (response.data.success && response.data.data) {
        const legalProfile = response.data.data;

        // Marcar como fallecido (esto actualiza perfil legal e interno)
        await markAsDeceased(legalProfile.id, {
          death_date: form.value.death_date
        });
      } else {
        // Si no hay perfil legal activo, actualizar solo el estado del interno
        await updateInmateStatus();
      }
    } else {
      // Para otros estados, actualizar directamente
      await updateInmateStatus();
    }

    // Cerrar modal
    const modalElement = document.getElementById('changeStatusModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();

    // Emitir evento
    emit('statusChanged');

    // Resetear formulario
    resetForm();

  } catch (error: any) {
    console.error('Error changing status:', error);
    Swal.fire({
      title: t('inmates.changeStatusModal.swal.error'),
      text: error.response?.data?.message || error.message || t('inmates.changeStatusModal.swal.updateError'),
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const updateInmateStatus = async () => {
  const payload = {
    status: form.value.new_status,
    reason: form.value.reason,
    observations: form.value.observations,
    death_date: form.value.death_date || undefined,
    escape_datetime: form.value.escape_datetime || undefined
  };

  const response = await ApiService.put(`/inmates/${props.inmate.id}/status`, payload);

  if (!response.data.success) {
    throw new Error(response.data.message || t('inmates.changeStatusModal.swal.updateError'));
  }

  Swal.fire({
    title: t('inmates.changeStatusModal.swal.successTitle'),
    text: `${t('inmates.changeStatusModal.swal.successMessage')} ${getStatusLabel(form.value.new_status)}`,
    icon: 'success'
  });
};

const handleReleased = () => {
  emit('released');
  emit('statusChanged');
};

const resetForm = () => {
  form.value = {
    new_status: '',
    reason: '',
    observations: '',
    death_date: '',
    escape_datetime: ''
  };
};

// Watch para resetear formulario cuando cambia el interno
watch(() => props.inmate, () => {
  resetForm();
});
</script>

<style scoped>
.required::after {
  content: " *";
  color: red;
}
</style>
