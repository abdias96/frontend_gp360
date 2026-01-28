<template>
  <div 
    id="transferDetailModal" 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalles de Solicitud de Traslado</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="transfer" class="row g-7">
            <!-- Header Info -->
            <div class="col-12">
              <div class="card border border-dashed border-primary">
                <div class="card-body p-6">
                  <div class="row">
                    <div class="col-md-3">
                      <div class="d-flex align-items-center">
                        <div class="symbol symbol-60px me-4">
                          <div class="symbol-label bg-light-primary text-primary fs-4 fw-bold">
                            {{ getInitials(transfer.inmate) }}
                          </div>
                        </div>
                        <div>
                          <div class="fw-bold fs-6">{{ getInmateName(transfer.inmate) }}</div>
                          <div class="text-muted fs-7">{{ transfer.inmate?.inmate_number }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Solicitud #:</div>
                      <div class="fs-6">{{ transfer.request_number || transfer.id }}</div>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Estado:</div>
                      <span class="badge" :class="getStatusBadgeClass(transfer.status)">
                        {{ getStatusLabel(transfer.status) }}
                      </span>
                    </div>
                    <div class="col-md-3">
                      <div class="fw-semibold text-gray-600">Prioridad:</div>
                      <span class="badge" :class="getPriorityBadgeClass(transfer.priority_level)">
                        {{ getPriorityLabel(transfer.priority_level) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Location Information -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">Ubicación Origen</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Centro:</div>
                    <div class="fs-6">{{ transfer.origin_center?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Sector:</div>
                    <div class="fs-6">{{ transfer.origin_sector?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Celda:</div>
                    <div class="fs-6">{{ transfer.origin_cell_number || 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">Ubicación Destino</h3>
                </div>
                <div class="card-body">
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Centro:</div>
                    <div class="fs-6">{{ transfer.destination_center?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Sector:</div>
                    <div class="fs-6">{{ transfer.destination_sector?.name || 'N/A' }}</div>
                  </div>
                  <div class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Celda:</div>
                    <div class="fs-6">{{ transfer.destination_cell_number || 'A asignar' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transfer Details -->
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Detalles del Traslado</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">Motivo:</div>
                        <div class="fs-6">{{ transfer.transfer_reason?.name || 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">Fecha Solicitud:</div>
                        <div class="fs-6">{{ formatDate(transfer.request_date) }}</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">Fecha Solicitada:</div>
                        <div class="fs-6">{{ formatDate(transfer.requested_transfer_date) }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">Nivel de Urgencia:</div>
                        <div class="fs-6">
                          <span v-if="transfer.urgency_level" class="badge" :class="getUrgencyBadgeClass(transfer.urgency_level)">
                            {{ getUrgencyLabel(transfer.urgency_level) }}
                          </span>
                          <span v-else class="text-muted">No especificado</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-4">
                        <div class="fw-semibold text-gray-600 mb-1">Solicitado por:</div>
                        <div class="fs-6">{{ transfer.requested_by || transfer.creator?.full_name || 'N/A' }}</div>
                      </div>
                    </div>
                  </div>

                  <div v-if="transfer.justification" class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-2">Justificación:</div>
                    <div class="bg-light p-4 rounded">{{ transfer.justification }}</div>
                  </div>

                  <div v-if="transfer.detailed_reason" class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-2">Razón Detallada:</div>
                    <div class="bg-light p-4 rounded">{{ transfer.detailed_reason }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">Requisitos y Autorizaciones</h3>
                </div>
                <div class="card-body">
                  <!-- Medical Clearance -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div class="fw-semibold">Autorización Médica</div>
                      <div class="text-muted fs-7">
                        {{ transfer.requires_medical_clearance ? 'Requerida' : 'No requerida' }}
                      </div>
                    </div>
                    <div>
                      <span v-if="transfer.requires_medical_clearance" class="badge" :class="transfer.medical_clearance_obtained ? 'badge-light-success' : 'badge-light-warning'">
                        {{ transfer.medical_clearance_obtained ? 'Obtenida' : 'Pendiente' }}
                      </span>
                      <span v-else class="badge badge-light-secondary">N/A</span>
                    </div>
                  </div>

                  <!-- Security Clearance -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div class="fw-semibold">Autorización de Seguridad</div>
                      <div class="text-muted fs-7">
                        {{ transfer.requires_security_clearance ? 'Requerida' : 'No requerida' }}
                      </div>
                    </div>
                    <div>
                      <span v-if="transfer.requires_security_clearance" class="badge" :class="transfer.security_clearance_obtained ? 'badge-light-success' : 'badge-light-warning'">
                        {{ transfer.security_clearance_obtained ? 'Obtenida' : 'Pendiente' }}
                      </span>
                      <span v-else class="badge badge-light-secondary">N/A</span>
                    </div>
                  </div>

                  <!-- Court Authorization -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div class="fw-semibold">Autorización Judicial</div>
                      <div class="text-muted fs-7">
                        {{ transfer.requires_court_authorization ? 'Requerida' : 'No requerida' }}
                      </div>
                    </div>
                    <div>
                      <span v-if="transfer.requires_court_authorization" class="badge" :class="transfer.court_authorization_obtained ? 'badge-light-success' : 'badge-light-warning'">
                        {{ transfer.court_authorization_obtained ? 'Obtenida' : 'Pendiente' }}
                      </span>
                      <span v-else class="badge badge-light-secondary">N/A</span>
                    </div>
                  </div>

                  <div v-if="transfer.court_order_number" class="mt-4">
                    <div class="fw-semibold text-gray-600 mb-1">Orden Judicial:</div>
                    <div class="fs-7">{{ transfer.court_order_number }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security and Medical Escorts -->
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h3 class="card-title">Requisitos de Escolta</h3>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="fw-semibold">Escolta Médica</div>
                    <span class="badge" :class="transfer.requires_medical_escort ? 'badge-light-success' : 'badge-light-secondary'">
                      {{ transfer.requires_medical_escort ? 'Requerida' : 'No requerida' }}
                    </span>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="fw-semibold">Escolta de Seguridad</div>
                    <span class="badge" :class="transfer.requires_security_escort ? 'badge-light-success' : 'badge-light-secondary'">
                      {{ transfer.requires_security_escort ? 'Requerida' : 'No requerida' }}
                    </span>
                  </div>

                  <div v-if="transfer.requires_security_escort && transfer.min_security_personnel" class="mb-4">
                    <div class="fw-semibold text-gray-600 mb-1">Personal Mínimo:</div>
                    <div class="fs-6">{{ transfer.min_security_personnel }} agentes</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Considerations -->
            <div v-if="transfer.security_considerations || transfer.medical_considerations" class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Consideraciones Especiales</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div v-if="transfer.security_considerations" class="col-md-6">
                      <div class="fw-semibold text-gray-600 mb-2">Consideraciones de Seguridad:</div>
                      <div class="bg-light-warning p-4 rounded">{{ transfer.security_considerations }}</div>
                    </div>
                    <div v-if="transfer.medical_considerations" class="col-md-6">
                      <div class="fw-semibold text-gray-600 mb-2">Consideraciones Médicas:</div>
                      <div class="bg-light-info p-4 rounded">{{ transfer.medical_considerations }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Decision Information -->
            <div v-if="transfer.status !== 'pending'" class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Información de Decisión</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="fw-semibold text-gray-600 mb-1">Decidido por:</div>
                      <div class="fs-6">{{ transfer.decided_by || transfer.approved_by?.full_name || 'N/A' }}</div>
                    </div>
                    <div class="col-md-4">
                      <div class="fw-semibold text-gray-600 mb-1">Fecha de Decisión:</div>
                      <div class="fs-6">{{ formatDate(transfer.decision_date) }}</div>
                    </div>
                    <div class="col-md-4">
                      <div class="fw-semibold text-gray-600 mb-1">Estado Final:</div>
                      <span class="badge" :class="getStatusBadgeClass(transfer.status)">
                        {{ getStatusLabel(transfer.status) }}
                      </span>
                    </div>
                  </div>

                  <div v-if="transfer.decision_notes" class="mt-4">
                    <div class="fw-semibold text-gray-600 mb-2">Notas de Decisión:</div>
                    <div class="bg-light p-4 rounded">{{ transfer.decision_notes }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- General Observations -->
            <div v-if="transfer.observations" class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Observaciones Generales</h3>
                </div>
                <div class="card-body">
                  <div class="bg-light p-4 rounded">{{ transfer.observations }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">
            Cerrar
          </button>
          <button 
            v-if="transfer?.status === 'approved'"
            type="button" 
            class="btn btn-info"
            @click="printTransferOrder"
          >
            <i class="ki-duotone ki-printer fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            Imprimir Orden
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap';

// Props
interface Props {
  transfer?: any;
  show: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// State
const modalRef = ref<HTMLElement>();
const modal = ref<Modal>();

// Watchers
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

// Methods
const close = () => {
  modal.value?.hide();
  emit('close');
};

const printTransferOrder = () => {
  // TODO: Implement print functionality
};

// Utility functions
const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getInmateName = (inmate: any) => {
  if (!inmate) return 'N/A';
  return `${inmate.first_name} ${inmate.last_name}`;
};

const getInitials = (inmate: any) => {
  if (!inmate) return '??';
  const first = inmate.first_name?.[0] || '';
  const last = inmate.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

const getPriorityBadgeClass = (priority: string) => {
  const classes: { [key: string]: string } = {
    low: 'badge-light-secondary',
    normal: 'badge-light-primary',
    high: 'badge-light-warning',
    urgent: 'badge-light-danger'
  };
  return classes[priority] || 'badge-light-secondary';
};

const getPriorityLabel = (priority: string) => {
  const labels: { [key: string]: string } = {
    low: 'Baja',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente'
  };
  return labels[priority] || priority;
};

const getUrgencyBadgeClass = (urgency: string) => {
  const classes: { [key: string]: string } = {
    low: 'badge-light-secondary',
    medium: 'badge-light-primary',
    high: 'badge-light-warning',
    critical: 'badge-light-danger'
  };
  return classes[urgency] || 'badge-light-secondary';
};

const getUrgencyLabel = (urgency: string) => {
  const labels: { [key: string]: string } = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica'
  };
  return labels[urgency] || urgency;
};

const getStatusBadgeClass = (status: string) => {
  const classes: { [key: string]: string } = {
    pending: 'badge-light-warning',
    approved: 'badge-light-success',
    rejected: 'badge-light-danger',
    completed: 'badge-light-info'
  };
  return classes[status] || 'badge-light-secondary';
};

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    completed: 'Completado'
  };
  return labels[status] || status;
};

// Setup modal event listeners
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});
</script>