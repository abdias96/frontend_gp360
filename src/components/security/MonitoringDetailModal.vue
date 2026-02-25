<template>
  <div id="monitoringDetailModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalle de Monitoreo</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="!monitoring" class="text-center py-10">
            <p class="text-gray-500">No hay datos disponibles</p>
          </div>

          <div v-else>
            <!-- Header -->
            <div class="card border border-dashed mb-7">
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-4">
                    <strong>PPL:</strong><br>
                    <span class="text-muted">{{ getInmateName(monitoring) }}</span>
                  </div>
                  <div class="col-md-4">
                    <strong>Estado:</strong><br>
                    <span v-if="monitoring.monitoring_active" class="badge badge-light-success">Activo</span>
                    <span v-else class="badge badge-light-secondary">Inactivo</span>
                  </div>
                  <div class="col-md-4">
                    <strong>Orden Judicial:</strong><br>
                    <span class="text-muted">{{ monitoring.court_order_number || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monitoring Info -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Información del Monitoreo</h5></div>
              <div class="card-body p-4">
                <div class="row mb-3">
                  <div class="col-md-4"><strong>Inicio:</strong><br><span class="text-muted">{{ formatDate(monitoring.monitoring_start_date) }}</span></div>
                  <div class="col-md-4"><strong>Fin:</strong><br><span class="text-muted">{{ formatDate(monitoring.monitoring_end_date) }}</span></div>
                  <div class="col-md-4">
                    <strong>Autorizado por:</strong><br>
                    <span class="text-muted">{{ monitoring.authorized_by_user?.first_name || 'N/A' }} {{ monitoring.authorized_by_user?.last_name || '' }}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <strong>Razón:</strong>
                  <p class="text-muted mt-1">{{ monitoring.monitoring_reason }}</p>
                </div>
              </div>
            </div>

            <!-- Communication Types -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Tipos de Comunicación Monitoreada</h5></div>
              <div class="card-body p-4">
                <div class="d-flex gap-3 flex-wrap">
                  <span :class="monitoring.phone_calls_monitored ? 'badge badge-light-primary' : 'badge badge-light-secondary'">
                    <i class="fas fa-phone me-1"></i>Llamadas {{ monitoring.phone_calls_monitored ? 'Sí' : 'No' }}
                  </span>
                  <span :class="monitoring.letters_monitored ? 'badge badge-light-primary' : 'badge badge-light-secondary'">
                    <i class="fas fa-envelope me-1"></i>Cartas {{ monitoring.letters_monitored ? 'Sí' : 'No' }}
                  </span>
                  <span :class="monitoring.visits_monitored ? 'badge badge-light-primary' : 'badge badge-light-secondary'">
                    <i class="fas fa-user-friends me-1"></i>Visitas {{ monitoring.visits_monitored ? 'Sí' : 'No' }}
                  </span>
                </div>
                <div v-if="monitoring.legal_communications_protected" class="mt-3">
                  <span class="badge badge-light-success"><i class="fas fa-gavel me-1"></i>Comunicaciones Legales Protegidas</span>
                </div>
              </div>
            </div>

            <!-- Evidence Found -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Hallazgos</h5></div>
              <div class="card-body p-4">
                <div class="d-flex gap-3 flex-wrap mb-3">
                  <span v-if="monitoring.extortion_evidence_found" class="badge badge-danger"><i class="fas fa-money-bill me-1"></i>Evidencia de Extorsión</span>
                  <span v-if="monitoring.gang_coordination_found" class="badge badge-danger"><i class="fas fa-users me-1"></i>Coordinación de Pandillas</span>
                  <span v-if="monitoring.escape_planning_found" class="badge badge-danger"><i class="fas fa-running me-1"></i>Planificación de Fuga</span>
                  <span v-if="!monitoring.extortion_evidence_found && !monitoring.gang_coordination_found && !monitoring.escape_planning_found" class="text-muted">Sin hallazgos significativos</span>
                </div>
                <div v-if="monitoring.intelligence_gathered" class="mt-3">
                  <strong>Inteligencia Recopilada:</strong>
                  <p class="text-muted mt-1">{{ monitoring.intelligence_gathered }}</p>
                </div>
                <div v-if="monitoring.reported_to_authorities" class="mt-3">
                  <span class="badge badge-light-warning"><i class="fas fa-gavel me-1"></i>Reportado a Autoridades</span>
                  <span v-if="monitoring.authority_report_number" class="text-muted ms-2">No. {{ monitoring.authority_report_number }}</span>
                </div>
              </div>
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

defineProps<{ monitoring: any }>();

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const getInmateName = (r: any) => { const i = r?.inmate; if (!i) return 'N/A'; return [i.first_name, i.last_name, i.second_last_name].filter(Boolean).join(' '); };
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : 'N/A';

const open = () => { if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value); modalInstance?.show(); };
const close = () => { modalInstance?.hide(); };

defineExpose({ open, close });
</script>
