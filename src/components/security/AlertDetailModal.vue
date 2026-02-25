<template>
  <div id="alertDetailModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalle de Alerta</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="!alert" class="text-center py-10">
            <p class="text-gray-500">No hay datos disponibles</p>
          </div>

          <div v-else>
            <!-- Header -->
            <div class="card border border-dashed mb-7">
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-3">
                    <strong>Tipo:</strong><br>
                    <span class="text-muted">{{ getTypeLabel(alert.alert_type) }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Prioridad:</strong><br>
                    <span class="badge" :class="getPriorityBadge(alert.priority_level)">{{ getPriorityLabel(alert.priority_level) }}</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Estado:</strong><br>
                    <span v-if="alert.is_active" class="badge badge-light-danger">Activa</span>
                    <span v-else class="badge badge-light-secondary">Inactiva</span>
                  </div>
                  <div class="col-md-3">
                    <strong>Resolución:</strong><br>
                    <span class="badge" :class="getResolutionBadge(alert.resolution_status)">
                      {{ getResolutionLabel(alert.resolution_status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- PPL -->
            <div v-if="alert.inmate" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">PPL Asociado</h5></div>
              <div class="card-body p-4">
                <strong>{{ [alert.inmate.first_name, alert.inmate.middle_name, alert.inmate.last_name, alert.inmate.second_last_name].filter(Boolean).join(' ') }}</strong>
                <span class="text-muted ms-2">{{ alert.inmate.inmate_number }}</span>
              </div>
            </div>

            <!-- Details -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Información de la Alerta</h5></div>
              <div class="card-body p-4">
                <div class="row mb-3">
                  <div class="col-md-4"><strong>Fecha:</strong><br><span class="text-muted">{{ formatDate(alert.alert_date) }}</span></div>
                  <div class="col-md-4"><strong>Expiración:</strong><br><span class="text-muted">{{ formatDate(alert.expiration_date) }}</span></div>
                  <div class="col-md-4">
                    <span v-if="alert.requires_immediate_action" class="badge badge-danger"><i class="fas fa-bolt me-1"></i>Acción Inmediata</span>
                  </div>
                </div>
                <div class="mb-3">
                  <strong>Descripción:</strong>
                  <p class="text-muted mt-1">{{ alert.alert_description }}</p>
                </div>
                <div v-if="alert.recommended_actions" class="mb-3">
                  <strong>Acciones Recomendadas:</strong>
                  <p class="text-muted mt-1">{{ alert.recommended_actions }}</p>
                </div>
                <div v-if="alert.actions_taken" class="mb-3">
                  <strong>Acciones Tomadas:</strong>
                  <p class="text-muted mt-1">{{ alert.actions_taken }}</p>
                </div>
                <div v-if="alert.resolution_notes">
                  <strong>Notas de Resolución:</strong>
                  <p class="text-muted mt-1">{{ alert.resolution_notes }}</p>
                </div>
              </div>
            </div>

            <div class="text-muted fs-7 mt-5">
              <span v-if="alert.last_reviewed">
                <i class="fas fa-clock me-1"></i>Última revisión: {{ formatDateTime(alert.last_reviewed) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from 'bootstrap';

defineProps<{ alert: any }>();

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const alertTypeLabels: Record<string, string> = {
  escape_risk: 'Riesgo de Fuga', violence_risk: 'Riesgo de Violencia', gang_activity: 'Actividad Pandillera',
  contraband: 'Contrabando', suicide_risk: 'Riesgo Suicida', medical_emergency: 'Emergencia Médica',
  external_threat: 'Amenaza Externa', visitor_concern: 'Preocupación de Visitas', staff_safety: 'Seguridad del Personal',
  riot_potential: 'Potencial Motín', intelligence_alert: 'Alerta de Inteligencia', transfer_required: 'Traslado Requerido',
  protective_custody: 'Custodia Protectora', other: 'Otra',
};

const getTypeLabel = (t: string) => alertTypeLabels[t] || t;
const getPriorityBadge = (p: string) => ({ low: 'badge-light-info', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[p] || 'badge-light');
const getPriorityLabel = (p: string) => ({ low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' }[p] || p);
const getResolutionBadge = (r: string) => ({ pending: 'badge-light-warning', in_progress: 'badge-light-info', resolved: 'badge-light-success', dismissed: 'badge-light-secondary', escalated: 'badge-light-danger' }[r] || 'badge-light-warning');
const getResolutionLabel = (r: string) => ({ pending: 'Pendiente', in_progress: 'En Progreso', resolved: 'Resuelto', dismissed: 'Descartado', escalated: 'Escalado' }[r] || r || 'Pendiente');
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : 'N/A';
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('es-GT') : 'N/A';

const open = () => { if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value); modalInstance?.show(); };
const close = () => { modalInstance?.hide(); };

defineExpose({ open, close });
</script>
