<template>
  <div
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-warning">
          <h3 class="modal-title">Cancelar Traslado</h3>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="transfer">
          <div class="alert alert-warning">
            <i class="ki-duotone ki-information fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            ¿Está seguro que desea cancelar este traslado?
          </div>

          <div class="mb-4">
            <div class="fw-bold mb-2">Traslado: {{ transfer.transfer_number }}</div>
            <div>Interno: {{ getInmateName(transfer.inmate) }}</div>
          </div>

          <div class="mb-4">
            <label class="form-label required">Motivo de la Cancelación</label>
            <textarea
              v-model="cancellationReason"
              class="form-control"
              :class="{ 'is-invalid': error }"
              rows="4"
              placeholder="Describa el motivo por el cual se cancela este traslado..."
            ></textarea>
            <div v-if="error" class="invalid-feedback">{{ error }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close" :disabled="loading">
            Cerrar
          </button>
          <button type="button" class="btn btn-warning" @click="cancel" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Cancelar Traslado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';

interface Props {
  show: boolean;
  transfer: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['cancelled', 'close']);

const modalRef = ref<HTMLElement | null>(null);
const modal = ref<Modal | null>(null);
const loading = ref(false);
const cancellationReason = ref('');
const error = ref('');

watch(() => props.show, async (show) => {
  if (show) {
    cancellationReason.value = '';
    error.value = '';
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
    }
  } else {
    modal.value?.hide();
  }
});

const cancel = async () => {
  if (!cancellationReason.value.trim()) {
    error.value = 'El motivo de la cancelación es requerido';
    return;
  }

  try {
    loading.value = true;
    error.value = '';

    const response = await ApiService.post(`/transfers/${props.transfer.id}/cancel`, {
      cancellation_reason: cancellationReason.value
    });

    if (response.data.success) {
      await Swal.fire({
        title: 'Cancelado',
        text: 'El traslado ha sido cancelado',
        icon: 'success',
        timer: 2000
      });

      emit('cancelled');
      close();
    }
  } catch (error: any) {
    console.error('Error cancelling transfer:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al cancelar el traslado',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const close = () => {
  modal.value?.hide();
  emit('close');
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  const parts = [
    inmate.first_name,
    inmate.middle_name,
    inmate.last_name,
    inmate.second_last_name,
  ].filter(Boolean);
  return parts.join(' ') || 'N/A';
};
</script>
