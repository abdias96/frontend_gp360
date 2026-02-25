<template>
  <div id="incidentDetailModal" class="modal fade" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Detalle del Incidente</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <div v-if="!incident" class="text-center py-10">
            <p class="text-gray-500">No hay datos disponibles</p>
          </div>

          <div v-else>
            <!-- Header Info -->
            <div class="card border border-dashed mb-7">
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-4">
                    <strong>Tipo:</strong><br>
                    <span class="text-muted">{{ getTypeLabel(incident.incident_type) }}</span>
                  </div>
                  <div class="col-md-4">
                    <strong>Severidad:</strong><br>
                    <span class="badge" :class="getSeverityBadge(incident.severity_level)">
                      {{ getSeverityLabel(incident.severity_level) }}
                    </span>
                  </div>
                  <div class="col-md-4">
                    <strong>Estado:</strong><br>
                    <span class="badge" :class="getStatusBadge(incident.resolution_status)">
                      {{ getStatusLabel(incident.resolution_status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Involved -->
            <div v-if="incident.inmate" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">PPL Involucrado</h5></div>
              <div class="card-body p-4">
                <strong>{{ getInmateName(incident.inmate) }}</strong>
                <span class="text-muted ms-2">{{ incident.inmate.inmate_number }}</span>
              </div>
            </div>

            <!-- Details -->
            <div class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Información del Incidente</h5></div>
              <div class="card-body p-4">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <strong>Fecha:</strong><br>
                    <span class="text-muted">{{ formatDateTime(incident.incident_date) }}</span>
                  </div>
                  <div class="col-md-6">
                    <strong>Ubicación:</strong><br>
                    <span class="text-muted">{{ incident.location || 'N/A' }}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <strong>Descripción:</strong>
                  <p class="text-muted mt-1">{{ incident.incident_description || 'N/A' }}</p>
                </div>
                <div v-if="incident.circumstances" class="mb-3">
                  <strong>Circunstancias:</strong>
                  <p class="text-muted mt-1">{{ incident.circumstances }}</p>
                </div>
              </div>
            </div>

            <!-- Evidence -->
            <div v-if="incident.evidence_collected || incident.staff_statements || incident.inmate_statement" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Evidencia y Declaraciones</h5></div>
              <div class="card-body p-4">
                <div v-if="incident.evidence_collected" class="mb-3">
                  <strong>Evidencia Recolectada:</strong>
                  <p class="text-muted mt-1">{{ incident.evidence_collected }}</p>
                </div>
                <div v-if="incident.staff_statements" class="mb-3">
                  <strong>Declaraciones del Personal:</strong>
                  <p class="text-muted mt-1">{{ incident.staff_statements }}</p>
                </div>
                <div v-if="incident.inmate_statement" class="mb-3">
                  <strong>Declaración del Interno:</strong>
                  <p class="text-muted mt-1">{{ incident.inmate_statement }}</p>
                </div>
              </div>
            </div>

            <!-- Resolution -->
            <div v-if="hasResolution" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Resolución y Seguimiento</h5></div>
              <div class="card-body p-4">
                <div v-if="incident.resolution_details" class="mb-3">
                  <strong>Detalles de Resolución:</strong>
                  <p class="text-muted mt-1">{{ incident.resolution_details }}</p>
                </div>
                <div v-if="incident.sanctions_applied" class="mb-3">
                  <strong>Sanciones Aplicadas:</strong>
                  <p class="text-muted mt-1">{{ incident.sanctions_applied }}</p>
                </div>
                <div v-if="incident.resolution_date" class="mb-3">
                  <strong>Fecha de Resolución:</strong>
                  <span class="text-muted ms-2">{{ formatDate(incident.resolution_date) }}</span>
                </div>
                <div v-if="incident.requires_follow_up" class="mb-3">
                  <span class="badge badge-light-warning mb-2"><i class="fas fa-clock me-1"></i> Requiere Seguimiento</span>
                  <div v-if="incident.follow_up_date" class="text-muted">
                    Fecha: {{ formatDate(incident.follow_up_date) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Impact -->
            <div v-if="incident.affects_security_level || incident.reported_to_prosecutor" class="card border mb-5">
              <div class="card-header"><h5 class="card-title mb-0">Impacto</h5></div>
              <div class="card-body p-4">
                <div class="d-flex gap-3 flex-wrap">
                  <span v-if="incident.affects_security_level" class="badge badge-light-danger">
                    <i class="fas fa-shield-alt me-1"></i>Afecta Nivel de Seguridad
                  </span>
                  <span v-if="incident.reported_to_prosecutor" class="badge badge-light-info">
                    <i class="fas fa-gavel me-1"></i>Reportado al MP
                    <span v-if="incident.prosecutor_case_number">({{ incident.prosecutor_case_number }})</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Reporter -->
            <div class="text-muted fs-7 mt-5">
              <i class="fas fa-user-edit me-1"></i>
              Reportado por: {{ incident.reported_by_user?.first_name || 'N/A' }} {{ incident.reported_by_user?.last_name || '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps<{ incident: any }>();

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const hasResolution = computed(() => {
  if (!props.incident) return false;
  return props.incident.resolution_details || props.incident.sanctions_applied ||
    props.incident.resolution_date || props.incident.requires_follow_up;
});

const incidentTypeLabels: Record<string, string> = {
  violence_against_inmate: 'Violencia contra PPL',
  violence_against_staff: 'Violencia contra personal',
  gang_activity: 'Actividad pandillera',
  extortion_attempt: 'Intento de extorsión',
  contraband_possession: 'Posesión de contrabando',
  escape_attempt: 'Intento de fuga',
  riot_participation: 'Participación en motín',
  unauthorized_communication: 'Comunicación no autorizada',
  bribery_attempt: 'Intento de soborno',
  weapon_possession: 'Posesión de arma',
  drug_possession: 'Posesión de drogas',
  cell_phone_possession: 'Posesión de celular',
  threatening_behavior: 'Comportamiento amenazante',
  sexual_harassment: 'Acoso sexual',
  property_damage: 'Daño a propiedad',
  rule_violation: 'Violación de reglas',
};

const getInmateName = (i: any) => {
  if (!i) return 'N/A';
  return [i.first_name, i.last_name, i.second_last_name].filter(Boolean).join(' ');
};

const getTypeLabel = (t: string) => incidentTypeLabels[t] || t;
const getSeverityBadge = (s: string) => ({ low: 'badge-light-info', medium: 'badge-light-warning', high: 'badge-light-danger', critical: 'badge-danger' }[s] || 'badge-light');
const getSeverityLabel = (s: string) => ({ low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' }[s] || s);
const getStatusBadge = (s: string) => ({ pending: 'badge-light-secondary', investigating: 'badge-light-warning', resolved: 'badge-light-success', dismissed: 'badge-light-info' }[s] || 'badge-light');
const getStatusLabel = (s: string) => ({ pending: 'Pendiente', investigating: 'Investigando', resolved: 'Resuelto', dismissed: 'Desestimado' }[s] || s);
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('es-GT') : 'N/A';
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : 'N/A';

const open = () => {
  if (modalRef.value && !modalInstance) modalInstance = new Modal(modalRef.value);
  modalInstance?.show();
};
const close = () => { modalInstance?.hide(); };

defineExpose({ open, close });
</script>
