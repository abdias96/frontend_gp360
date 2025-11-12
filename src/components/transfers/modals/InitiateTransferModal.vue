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
        <div class="modal-header bg-primary">
          <h3 class="modal-title text-white">Iniciar Traslado</h3>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="transfer">
          <div class="alert alert-info">
            <i class="ki-duotone ki-information fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            Se registrará la salida del interno y el traslado quedará en estado "En Tránsito"
          </div>

          <div class="mb-4">
            <div class="fw-bold mb-2">Traslado: {{ transfer.transfer_number }}</div>
            <div>Interno: {{ getInmateName(transfer.inmate) }}</div>
            <div class="text-muted">{{ transfer.origin_center?.name }} → {{ transfer.destination_center?.name }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close" :disabled="loading">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="initiate" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Iniciar Traslado
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
const emit = defineEmits(['initiated', 'close']);

const modalRef = ref<HTMLElement | null>(null);
const modal = ref<Modal | null>(null);
const loading = ref(false);

watch(() => props.show, async (show) => {
  if (show) {
    await nextTick();
    if (modalRef.value) {
      modal.value = new Modal(modalRef.value);
      modal.value.show();
    }
  } else {
    modal.value?.hide();
  }
});

const initiate = async () => {
  try {
    loading.value = true;

    const response = await ApiService.post(`/transfers/${props.transfer.id}/initiate`);

    if (response.data.success) {
      await Swal.fire({
        title: '¡Traslado Iniciado!',
        text: 'El interno ha salido y se encuentra en tránsito',
        icon: 'success',
        timer: 2000
      });

      emit('initiated');
      close();
    }
  } catch (error: any) {
    console.error('Error initiating transfer:', error);
    await Swal.fire({
      title: 'Error',
      text: error.response?.data?.message || 'Error al iniciar el traslado',
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
