<template>
  <div
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Detalle del Traslado</h3>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="transfer">
          <div class="row g-5">
            <!-- Transfer Info -->
            <div class="col-md-6">
              <h4 class="mb-4">Información del Traslado</h4>
              <div class="mb-3">
                <label class="fw-bold">Número de Traslado:</label>
                <div>{{ transfer.transfer_number }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Estado:</label>
                <div>
                  <span :class="getStatusBadgeClass(transfer.status)">
                    {{ getStatusLabel(transfer.status) }}
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Fecha Programada de Salida:</label>
                <div>{{ formatDate(transfer.scheduled_departure_datetime) }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Fecha Estimada de Llegada:</label>
                <div>{{ formatDate(transfer.scheduled_arrival_datetime) }}</div>
              </div>
            </div>

            <!-- Inmate Info -->
            <div class="col-md-6">
              <h4 class="mb-4">Interno</h4>
              <div class="mb-3">
                <label class="fw-bold">Nombre:</label>
                <div>{{ getInmateName(transfer.inmate) }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Número Interno:</label>
                <div>{{ transfer.inmate?.inmate_number || 'N/A' }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Documento:</label>
                <div>{{ transfer.inmate?.document_number || 'N/A' }}</div>
              </div>
            </div>

            <!-- Origin -->
            <div class="col-md-6">
              <h4 class="mb-4">Origen</h4>
              <div class="mb-3">
                <label class="fw-bold">Centro:</label>
                <div>{{ transfer.origin_center?.name || 'N/A' }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Sector:</label>
                <div>{{ transfer.origin_sector?.name || 'N/A' }}</div>
              </div>
            </div>

            <!-- Destination -->
            <div class="col-md-6">
              <h4 class="mb-4">Destino</h4>
              <div class="mb-3">
                <label class="fw-bold">Centro:</label>
                <div>{{ transfer.destination_center?.name || 'N/A' }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Sector:</label>
                <div>{{ transfer.destination_sector?.name || 'N/A' }}</div>
              </div>
            </div>

            <!-- Description -->
            <div class="col-12" v-if="transfer.transfer_description">
              <h4 class="mb-4">Descripción</h4>
              <div class="bg-light p-4 rounded">
                {{ transfer.transfer_description }}
              </div>
            </div>

            <!-- Timestamps -->
            <div class="col-md-6" v-if="transfer.actual_departure_datetime">
              <h4 class="mb-4">Fechas Reales</h4>
              <div class="mb-3">
                <label class="fw-bold">Salida Real:</label>
                <div>{{ formatDate(transfer.actual_departure_datetime) }}</div>
              </div>
              <div class="mb-3" v-if="transfer.actual_arrival_datetime">
                <label class="fw-bold">Llegada Real:</label>
                <div>{{ formatDate(transfer.actual_arrival_datetime) }}</div>
              </div>
            </div>

            <!-- Created By -->
            <div class="col-md-6">
              <h4 class="mb-4">Información Adicional</h4>
              <div class="mb-3">
                <label class="fw-bold">Creado por:</label>
                <div>{{ getCreatorName(transfer.created_by) }}</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Fecha de Creación:</label>
                <div>{{ formatDate(transfer.created_at) }}</div>
              </div>
              <div class="mb-3" v-if="transfer.authorized_by">
                <label class="fw-bold">Autorizado por:</label>
                <div>{{ getCreatorName(transfer.authorized_by) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Modal } from 'bootstrap';

interface Props {
  show: boolean;
  transfer: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const modalRef = ref<HTMLElement | null>(null);
const modal = ref<Modal | null>(null);

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

const getCreatorName = (user: any) => {
  if (!user) return 'N/A';
  return `${user.first_name} ${user.last_name}`;
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    scheduled: 'Programado',
    approved: 'Aprobado',
    in_transit: 'En Tránsito',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classes: { [key: string]: string } = {
    scheduled: 'badge badge-light-warning fw-bold',
    approved: 'badge badge-light-primary fw-bold',
    in_transit: 'badge badge-light-info fw-bold',
    completed: 'badge badge-light-success fw-bold',
    cancelled: 'badge badge-light-danger fw-bold',
  };
  return classes[status] || 'badge badge-light fw-bold';
};
</script>
